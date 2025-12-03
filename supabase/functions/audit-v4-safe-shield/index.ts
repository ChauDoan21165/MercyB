// supabase/functions/audit-v4-safe-shield/index.ts
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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
  fix?: string;
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
  fixed?: number; // V5/V6 compatibility
  logs: string[];
  summary: AuditSummary;
};

type DbRoom = {
  id: string;
  tier?: string | null;
  schema_id?: string | null;
  domain?: string | null;
  title_en?: string | null;
  title_vi?: string | null;
  keywords?: string[] | null;
  entries?: unknown;
};

async function runSafeShieldAudit(mode: AuditMode): Promise<AuditResult> {
  const logs: string[] = [];
  const issues: AuditIssue[] = [];
  let fixesApplied = 0;

  const log = (msg: string) => {
    logs.push(msg);
    console.log(`[SafeShield] ${msg}`);
  };

  log(`Starting Safe Shield audit in ${mode} mode`);

  // Phase 1 – load rooms from DB
  const { data: dbRooms, error: dbError } = await supabase
    .from("rooms")
    .select(
      "id, tier, schema_id, domain, title_en, title_vi, keywords, entries",
    );

  if (dbError) {
    const message = dbError.message || String(dbError);
    log(`Database error: ${message}`);
    throw new Error(`Database error: ${message}`);
  }

  const rooms: DbRoom[] = (dbRooms ?? []) as DbRoom[];
  const totalRooms = rooms.length;
  let scannedRooms = 0;
  const seenIds = new Set<string>();

  // Phase 2 – scan rooms, collect issues
  for (const room of rooms) {
    const roomId = room.id;
    scannedRooms++;

    // Duplicate ID
    if (seenIds.has(roomId)) {
      issues.push({
        id: `dup-${roomId}`,
        file: `${roomId}.json`,
        type: "duplicate_room",
        severity: "error",
        message: `Duplicate room id detected: ${roomId}`,
        autoFixable: false,
      });
      continue;
    }
    seenIds.add(roomId);

    // Missing tier
    if (!room.tier) {
      issues.push({
        id: `tier-${roomId}`,
        file: `${roomId}.json`,
        type: "missing_tier",
        severity: "warning",
        message: `Missing tier for room: ${roomId}`,
        fix: `Set tier to "Free / Miễn phí"`,
        autoFixable: true,
      });
    }

    // Missing EN/VI titles
    if (!room.title_en || !room.title_vi) {
      issues.push({
        id: `title-${roomId}`,
        file: `${roomId}.json`,
        type: "missing_title",
        severity: "warning",
        message: `Missing bilingual title for room: ${roomId}`,
        autoFixable: false,
      });
    }

    // Missing schema_id
    if (!room.schema_id) {
      issues.push({
        id: `schema-${roomId}`,
        file: `${roomId}.json`,
        type: "missing_schema",
        severity: "info",
        message: `Missing schema_id for room: ${roomId}`,
        fix: `Set schema_id to "mercy-blade-v1"`,
        autoFixable: true,
      });
    }

    // Missing domain
    if (!room.domain) {
      issues.push({
        id: `domain-${roomId}`,
        file: `${roomId}.json`,
        type: "missing_domain",
        severity: "info",
        message: `Missing domain for room: ${roomId}`,
        fix: `Set domain based on tier`,
        autoFixable: true,
      });
    }

    // Missing keywords
    if (!room.keywords || room.keywords.length === 0) {
      issues.push({
        id: `keywords-${roomId}`,
        file: `${roomId}.json`,
        type: "missing_keywords",
        severity: "warning",
        message: `Missing keywords for room: ${roomId}`,
        fix: "Extract keywords from entries",
        autoFixable: true,
      });
    }

    // Entries & audio checks
    const entries = Array.isArray(room.entries)
      ? (room.entries as any[])
      : [];

    if (entries.length === 0) {
      issues.push({
        id: `entries-${roomId}`,
        file: `${roomId}.json`,
        type: "missing_entries",
        severity: "error",
        message: `Room has no entries: ${roomId}`,
        autoFixable: false,
      });
      continue;
    }

    for (let index = 0; index < entries.length; index++) {
      const entry = entries[index] as Record<string, any>;
      const entryId =
        (entry.slug as string | undefined) ||
        (entry.artifact_id as string | undefined) ||
        (entry.id as string | undefined) ||
        `entry-${index}`;

      // Missing identifier (slug/artifact_id/id)
      if (!entry.slug && !entry.artifact_id && !entry.id) {
        issues.push({
          id: `slug-${roomId}-${index}`,
          file: `${roomId}.json`,
          type: "missing_slug",
          severity: "warning",
          message: `Entry ${index} is missing identifier in room ${roomId}`,
          autoFixable: false,
        });
      }

      // Missing audio
      const audio: string | undefined =
        entry.audio || entry.audio_en;

      if (!audio) {
        issues.push({
          id: `audio-${roomId}-${index}`,
          file: `${roomId}.json`,
          type: "missing_audio",
          severity: "warning",
          message: `Entry "${entryId}" is missing audio in room ${roomId}`,
          fix: "Generate TTS for this entry",
          autoFixable: true,
        });
      }
    }
  }

  // Phase 3 – Safe repairs (only when mode === "repair")
  if (mode === "repair" && rooms.length > 0) {
    log("Starting Safe Shield repairs (DB only, no deletions)");

    // 1) Default tier where missing
    const roomsMissingTier = rooms.filter((r) => !r.tier);
    for (const room of roomsMissingTier) {
      const { error } = await supabase
        .from("rooms")
        .update({ tier: "Free / Miễn phí" })
        .eq("id", room.id);

      if (!error) {
        fixesApplied++;
        log(`Fixed tier for room: ${room.id}`);
      }
    }

    // 2) Default schema_id where missing
    const roomsMissingSchema = rooms.filter((r) => !r.schema_id);
    for (const room of roomsMissingSchema) {
      const { error } = await supabase
        .from("rooms")
        .update({ schema_id: "mercy-blade-v1" })
        .eq("id", room.id);

      if (!error) {
        fixesApplied++;
        log(`Fixed schema_id for room: ${room.id}`);
      }
    }

    // 3) Default domain inferred from tier
    const roomsMissingDomain = rooms.filter((r) => !r.domain && r.tier);
    for (const room of roomsMissingDomain) {
      const tierLower = (room.tier || "").toLowerCase();
      let domain = "General";

      if (tierLower.includes("vip9")) domain = "Strategic Intelligence";
      else if (tierLower.includes("vip")) domain = "VIP Learning";
      else if (tierLower.includes("free")) domain = "English Foundation";
      else if (tierLower.includes("kids")) domain = "Kids English";

      const { error } = await supabase
        .from("rooms")
        .update({ domain })
        .eq("id", room.id);

      if (!error) {
        fixesApplied++;
        log(`Set domain "${domain}" for room: ${room.id}`);
      }
    }

    // 4) Extract keywords from entries when keywords[] is empty
    const roomsMissingKeywords = rooms.filter(
      (r) => !r.keywords || r.keywords.length === 0,
    );

    for (const room of roomsMissingKeywords) {
      const entries = Array.isArray(room.entries)
        ? (room.entries as any[])
        : [];
      const keywordSet = new Set<string>();

      for (const raw of entries) {
        const entry = raw as Record<string, any>;
        const kwEn = entry.keywords_en as string[] | undefined;
        const kwVi = entry.keywords_vi as string[] | undefined;

        if (Array.isArray(kwEn)) {
          for (const k of kwEn) keywordSet.add(k);
        }
        if (Array.isArray(kwVi)) {
          for (const k of kwVi) keywordSet.add(k);
        }
      }

      if (keywordSet.size > 0) {
        const { error } = await supabase
          .from("rooms")
          .update({ keywords: Array.from(keywordSet) })
          .eq("id", room.id);

        if (!error) {
          fixesApplied++;
          log(
            `Extracted ${keywordSet.size} keywords for room: ${room.id}`,
          );
        }
      }
    }

    log(`Safe Shield repairs complete: ${fixesApplied} fixes applied`);
  }

  const errors = issues.filter((i) => i.severity === "error").length;
  const warnings = issues.filter((i) => i.severity === "warning").length;

  const summary: AuditSummary = {
    totalRooms,
    scannedRooms,
    errors,
    warnings,
    fixed: fixesApplied,
  };

  log(
    `Summary: ${totalRooms} total, ${scannedRooms} scanned, ${errors} errors, ${warnings} warnings, ${fixesApplied} fixed`,
  );

  return { issues, summary, fixesApplied, logs };
}

// HTTP handler – matches supabase.functions.invoke("audit-v4-safe-shield", { body: { mode } })
serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    let body: any = {};
    if (contentType.includes("application/json")) {
      body = await req.json();
    }

    const mode: AuditMode = body.mode === "repair" ? "repair" : "dry-run";
    const result = await runSafeShieldAudit(mode);

    const response: AuditResponse = {
      ok: true,
      issues: result.issues,
      fixesApplied: result.fixesApplied,
      fixed: result.fixesApplied, // for V5/V6
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
      fixed: 0,
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
