import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

type AuditMode = "dry-run" | "repair";

type AuditIssue = {
  id: string;
  file: string;
  type: string;
  severity: "error" | "warning" | "info";
  message: string;
  fix?: string | null;
  autoFixable?: boolean;
};

type AuditSummary = {
  totalRooms: number;
  scannedRooms: number;
  errors: number;
  warnings: number;
  fixed: number;
};

type AuditResult = {
  issues: AuditIssue[];
  summary: AuditSummary;
  fixesApplied: number;
  logs: string[];
};

type AuditResponse = {
  ok: boolean;
  error?: string;
  issues: AuditIssue[];
  fixesApplied: number;
  logs: string[];
  summary: AuditSummary;
};

async function runSafeShieldAudit(mode: AuditMode): Promise<AuditResult> {
  const logs: string[] = [];
  const issues: AuditIssue[] = [];
  let fixesApplied = 0;

  const log = (msg: string) => {
    logs.push(msg);
    console.log(`[Audit] ${msg}`);
  };

  log(`Starting Safe Shield Audit in ${mode} mode...`);

  // Phase 1: Load all rooms from database
  const { data: dbRooms, error: dbError } = await supabase
    .from("rooms")
    .select("id, title_en, title_vi, tier, entries, schema_id, domain, keywords");

  if (dbError) {
    throw new Error(`Database error: ${dbError.message}`);
  }

  const totalRooms = dbRooms?.length || 0;
  log(`Found ${totalRooms} rooms in database`);

  const seenIds = new Set<string>();
  let scannedRooms = 0;

  // Phase 2: Scan each room for issues
  if (dbRooms) {
    for (const room of dbRooms) {
      const roomId = room.id;
      scannedRooms++;

      // Check for duplicates
      if (seenIds.has(roomId)) {
        issues.push({
          id: `dup-${roomId}`,
          file: `${roomId}.json`,
          type: "duplicate_room",
          severity: "error",
          message: `Duplicate room ID: ${roomId}`,
          autoFixable: false,
        });
      }
      seenIds.add(roomId);

      // Check tier
      if (!room.tier) {
        issues.push({
          id: `tier-${roomId}`,
          file: `${roomId}.json`,
          type: "missing_tier",
          severity: "warning",
          message: `Missing tier: ${roomId}`,
          fix: `Set tier to "Free / Miễn phí"`,
          autoFixable: true,
        });
      }

      // Check titles
      if (!room.title_en || !room.title_vi) {
        issues.push({
          id: `title-${roomId}`,
          file: `${roomId}.json`,
          type: "missing_title",
          severity: "warning",
          message: `Missing bilingual title: ${roomId}`,
          autoFixable: false,
        });
      }

      // Check schema_id
      if (!room.schema_id) {
        issues.push({
          id: `schema-${roomId}`,
          file: `${roomId}.json`,
          type: "missing_schema",
          severity: "info",
          message: `Missing schema_id: ${roomId}`,
          fix: `Set schema_id to "mercy-blade-v1"`,
          autoFixable: true,
        });
      }

      // Check domain
      if (!room.domain) {
        issues.push({
          id: `domain-${roomId}`,
          file: `${roomId}.json`,
          type: "missing_domain",
          severity: "info",
          message: `Missing domain: ${roomId}`,
          fix: `Set domain based on tier`,
          autoFixable: true,
        });
      }

      // Check keywords
      if (!room.keywords || (Array.isArray(room.keywords) && room.keywords.length === 0)) {
        issues.push({
          id: `keywords-${roomId}`,
          file: `${roomId}.json`,
          type: "missing_keywords",
          severity: "warning",
          message: `Missing keywords: ${roomId}`,
          fix: `Extract keywords from entries`,
          autoFixable: true,
        });
      }

      // Check entries
      const entries = Array.isArray(room.entries) ? room.entries : [];
      if (entries.length === 0) {
        issues.push({
          id: `entries-${roomId}`,
          file: `${roomId}.json`,
          type: "missing_entries",
          severity: "error",
          message: `No entries: ${roomId}`,
          autoFixable: false,
        });
        continue;
      }

      // Check each entry
      for (let j = 0; j < entries.length; j++) {
        const entry = entries[j] as Record<string, unknown>;
        const entryId = entry.slug || entry.artifact_id || entry.id || `entry-${j}`;

        // Check identifier
        if (!entry.slug && !entry.artifact_id && !entry.id) {
          issues.push({
            id: `slug-${roomId}-${j}`,
            file: `${roomId}.json`,
            type: "missing_slug",
            severity: "warning",
            message: `Entry ${j} missing identifier in ${roomId}`,
            autoFixable: false,
          });
        }

        // Check audio
        const audio = entry.audio || entry.audio_en;
        if (!audio) {
          issues.push({
            id: `audio-${roomId}-${j}`,
            file: `${roomId}.json`,
            type: "missing_audio",
            severity: "warning",
            message: `Entry "${entryId}" missing audio in ${roomId}`,
            fix: `Generate TTS for entry`,
            autoFixable: true,
          });
        }
      }
    }
  }

  log(`Scanned ${scannedRooms} rooms, found ${issues.length} issues`);

  // Phase 3: Apply repairs if mode is "repair"
  if (mode === "repair") {
    log("Starting Safe Shield repairs...");

    // Repair: Fix rooms with missing tier
    const roomsWithMissingTier = dbRooms?.filter((r) => !r.tier) || [];
    for (const room of roomsWithMissingTier) {
      const { error } = await supabase
        .from("rooms")
        .update({ tier: "Free / Miễn phí" })
        .eq("id", room.id);

      if (!error) {
        fixesApplied++;
        log(`Fixed tier for room: ${room.id}`);
      }
    }

    // Repair: Fix rooms with missing schema_id
    const roomsWithMissingSchema = dbRooms?.filter((r) => !r.schema_id) || [];
    for (const room of roomsWithMissingSchema) {
      const { error } = await supabase
        .from("rooms")
        .update({ schema_id: "mercy-blade-v1" })
        .eq("id", room.id);

      if (!error) {
        fixesApplied++;
        log(`Fixed schema_id for room: ${room.id}`);
      }
    }

    // Repair: Fix rooms with missing domain
    const roomsWithMissingDomain = dbRooms?.filter((r) => !r.domain && r.tier) || [];
    for (const room of roomsWithMissingDomain) {
      let domain = "General";
      const tier = room.tier?.toLowerCase() || "";
      if (tier.includes("vip9")) domain = "Strategic Intelligence";
      else if (tier.includes("vip")) domain = "VIP Learning";
      else if (tier.includes("free")) domain = "English Foundation";
      else if (tier.includes("kids")) domain = "Kids English";

      const { error } = await supabase
        .from("rooms")
        .update({ domain })
        .eq("id", room.id);

      if (!error) {
        fixesApplied++;
        log(`Set domain "${domain}" for room: ${room.id}`);
      }
    }

    // Repair: Extract keywords from entries for rooms missing keywords
    const roomsWithMissingKeywords = dbRooms?.filter(
      (r) => !r.keywords || (Array.isArray(r.keywords) && r.keywords.length === 0)
    ) || [];
    for (const room of roomsWithMissingKeywords) {
      const entries = Array.isArray(room.entries) ? room.entries : [];
      const keywords = new Set<string>();
      
      for (const entry of entries) {
        const e = entry as Record<string, unknown>;
        const kwEn = e.keywords_en as string[] | undefined;
        const kwVi = e.keywords_vi as string[] | undefined;
        if (Array.isArray(kwEn)) kwEn.forEach(k => keywords.add(k));
        if (Array.isArray(kwVi)) kwVi.forEach(k => keywords.add(k));
      }

      if (keywords.size > 0) {
        const { error } = await supabase
          .from("rooms")
          .update({ keywords: Array.from(keywords) })
          .eq("id", room.id);

        if (!error) {
          fixesApplied++;
          log(`Extracted ${keywords.size} keywords for room: ${room.id}`);
        }
      }
    }

    log(`Safe Shield repairs complete. Fixed ${fixesApplied} issues.`);
  }

  // Build summary
  const errors = issues.filter((i) => i.severity === "error").length;
  const warnings = issues.filter((i) => i.severity === "warning").length;

  const summary: AuditSummary = {
    totalRooms,
    scannedRooms,
    errors,
    warnings,
    fixed: fixesApplied,
  };

  log(`Summary: ${totalRooms} total, ${scannedRooms} scanned, ${errors} errors, ${warnings} warnings, ${fixesApplied} fixed`);

  return { issues, summary, fixesApplied, logs };
}

// HTTP HANDLER
serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    let body: Record<string, unknown> = {};
    if (contentType.includes("application/json")) {
      body = await req.json();
    }

    const mode: AuditMode = body.mode === "repair" ? "repair" : "dry-run";
    const result = await runSafeShieldAudit(mode);

    const response: AuditResponse = {
      ok: true,
      issues: result.issues,
      fixesApplied: result.fixesApplied,
      logs: result.logs,
      summary: result.summary,
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[audit-v4-safe-shield] Error:", err);

    const errorResponse: AuditResponse = {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      issues: [],
      fixesApplied: 0,
      logs: [],
      summary: {
        totalRooms: 0,
        scannedRooms: 0,
        errors: 0,
        warnings: 0,
        fixed: 0,
      },
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
