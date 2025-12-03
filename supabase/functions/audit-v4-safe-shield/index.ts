import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type AuditIssueType =
  | "missing_json"
  | "missing_audio"
  | "missing_entries"
  | "missing_db"
  | "mismatched_slug"
  | "duplicate_room"
  | "invalid_json"
  | "missing_tier"
  | "missing_title"
  | "registry_missing";

type AuditSeverity = "error" | "warning" | "info";

interface AuditIssue {
  id: string;
  file: string;
  type: AuditIssueType;
  severity: AuditSeverity;
  message: string;
  fix?: string;
  autoFixable?: boolean;
}

interface AuditSummary {
  totalRooms: number;
  scannedRooms: number;
  errors: number;
  warnings: number;
  fixed: number;
}

type AuditMode = "dry-run" | "repair";

interface AuditResponse {
  ok: boolean;
  mode: AuditMode;
  summary: AuditSummary;
  issues: AuditIssue[];
  fixesApplied?: number;
  logs?: string[];
  error?: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request
    const body = await req.json().catch(() => ({}));
    const mode: AuditMode = body.mode || "repair";
    
    console.log(`[Audit v4 Safe Shield] Starting in ${mode} mode`);
    
    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const issues: AuditIssue[] = [];
    const logs: string[] = [];
    let fixedCount = 0;

    const addIssue = (issue: AuditIssue) => {
      issues.push(issue);
    };

    const log = (msg: string) => {
      logs.push(msg);
      console.log(`[Audit] ${msg}`);
    };

    // Phase 1: Load all rooms from database
    log("Loading rooms from database...");
    const { data: dbRooms, error: dbError } = await supabaseAdmin
      .from("rooms")
      .select("id, title_en, title_vi, tier, entries, schema_id, domain");

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    const totalRooms = dbRooms?.length || 0;
    log(`Found ${totalRooms} rooms in database`);

    // Phase 2: Build lookup sets
    const dbIds = new Set(dbRooms?.map((r) => r.id) || []);
    const seenIds = new Set<string>();

    // Phase 3: Scan each room
    log("Scanning rooms for issues...");
    let scannedRooms = 0;
    let errors = 0;
    let warnings = 0;

    if (dbRooms) {
      for (const room of dbRooms) {
        const roomId = room.id;
        scannedRooms++;

        // Check for duplicates
        if (seenIds.has(roomId)) {
          addIssue({
            id: `dup-${roomId}`,
            file: `${roomId}.json`,
            type: "duplicate_room",
            severity: "error",
            message: `Duplicate room ID: ${roomId}`,
          });
          errors++;
        }
        seenIds.add(roomId);

        // Check required fields
        if (!room.tier) {
          addIssue({
            id: `tier-${roomId}`,
            file: `${roomId}.json`,
            type: "missing_tier",
            severity: "warning",
            message: `Missing tier: ${roomId}`,
            fix: `Set tier to "Free / Miễn phí"`,
            autoFixable: true,
          });
          warnings++;
        }

        if (!room.title_en || !room.title_vi) {
          addIssue({
            id: `title-${roomId}`,
            file: `${roomId}.json`,
            type: "missing_title",
            severity: "warning",
            message: `Missing bilingual title: ${roomId}`,
          });
          warnings++;
        }

        // Check schema_id
        if (!room.schema_id) {
          addIssue({
            id: `schema-${roomId}`,
            file: `${roomId}.json`,
            type: "missing_tier",
            severity: "info",
            message: `Missing schema_id: ${roomId}`,
            fix: `Set schema_id to "mercy-blade-v1"`,
            autoFixable: true,
          });
        }

        // Check domain
        if (!room.domain) {
          addIssue({
            id: `domain-${roomId}`,
            file: `${roomId}.json`,
            type: "missing_tier",
            severity: "info",
            message: `Missing domain: ${roomId}`,
            fix: `Set domain based on tier`,
            autoFixable: true,
          });
        }

        // Check entries
        const entries = Array.isArray(room.entries) ? room.entries : [];
        if (entries.length === 0) {
          addIssue({
            id: `entries-${roomId}`,
            file: `${roomId}.json`,
            type: "missing_entries",
            severity: "error",
            message: `No entries: ${roomId}`,
          });
          errors++;
          continue;
        }

        // Check each entry for issues
        for (let j = 0; j < entries.length; j++) {
          const entry = entries[j] as Record<string, unknown>;
          const entryId = entry.slug || entry.artifact_id || entry.id || `entry-${j}`;

          // Check identifier
          if (!entry.slug && !entry.artifact_id && !entry.id) {
            addIssue({
              id: `slug-${roomId}-${j}`,
              file: `${roomId}.json`,
              type: "mismatched_slug",
              severity: "warning",
              message: `Entry ${j} missing identifier in ${roomId}`,
            });
            warnings++;
          }

          // Check audio
          const audio = entry.audio || entry.audio_en;
          if (!audio) {
            addIssue({
              id: `audio-${roomId}-${j}`,
              file: `${roomId}.json`,
              type: "missing_audio",
              severity: "warning",
              message: `Entry "${entryId}" missing audio in ${roomId}`,
              fix: `Generate TTS for entry ${j}`,
              autoFixable: true,
            });
            warnings++;
          }
        }
      }
    }

    // Phase 4: Apply repairs if mode is "repair"
    if (mode === "repair") {
      log("Starting Safe Shield repairs...");

      // Repair 1: Fix rooms with missing tier (set to "Free" as safe default)
      const roomsWithMissingTier = dbRooms?.filter((r) => !r.tier) || [];
      if (roomsWithMissingTier.length > 0) {
        log(`Fixing ${roomsWithMissingTier.length} rooms with missing tier...`);
        for (const room of roomsWithMissingTier) {
          const { error: updateError } = await supabaseAdmin
            .from("rooms")
            .update({ tier: "Free / Miễn phí" })
            .eq("id", room.id);

          if (!updateError) {
            fixedCount++;
            log(`Fixed tier for room: ${room.id}`);
          } else {
            log(`Failed to fix tier for ${room.id}: ${updateError.message}`);
          }
        }
      }

      // Repair 2: Sync schema_id for rooms missing it
      const roomsWithMissingSchema = dbRooms?.filter((r) => !r.schema_id) || [];
      if (roomsWithMissingSchema.length > 0) {
        log(`Fixing ${roomsWithMissingSchema.length} rooms with missing schema_id...`);
        for (const room of roomsWithMissingSchema) {
          const { error: updateError } = await supabaseAdmin
            .from("rooms")
            .update({ schema_id: "mercy-blade-v1" })
            .eq("id", room.id);

          if (!updateError) {
            fixedCount++;
            log(`Fixed schema_id for room: ${room.id}`);
          }
        }
      }

      // Repair 3: Ensure rooms have proper domain set
      const roomsWithMissingDomain = dbRooms?.filter((r) => !r.domain && r.tier) || [];
      if (roomsWithMissingDomain.length > 0) {
        log(`Setting domain for ${roomsWithMissingDomain.length} rooms based on tier...`);
        for (const room of roomsWithMissingDomain) {
          // Derive domain from tier
          let domain = "General";
          const tier = room.tier?.toLowerCase() || "";
          if (tier.includes("vip9")) domain = "Strategic Intelligence";
          else if (tier.includes("vip")) domain = "VIP Learning";
          else if (tier.includes("free")) domain = "English Foundation";
          else if (tier.includes("kids")) domain = "Kids English";

          const { error: updateError } = await supabaseAdmin
            .from("rooms")
            .update({ domain })
            .eq("id", room.id);

          if (!updateError) {
            fixedCount++;
            log(`Set domain "${domain}" for room: ${room.id}`);
          }
        }
      }

      log(`Safe Shield repairs complete. Fixed ${fixedCount} issues.`);
    }

    // Build final summary
    const summary: AuditSummary = {
      totalRooms,
      scannedRooms,
      errors,
      warnings,
      fixed: fixedCount,
    };

    const response: AuditResponse = {
      ok: true,
      mode,
      summary,
      issues,
      fixesApplied: fixedCount,
      logs,
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[Audit v4 Safe Shield] Error:", error);
    
    const errorResponse: AuditResponse = {
      ok: false,
      mode: "dry-run",
      summary: { totalRooms: 0, scannedRooms: 0, errors: 0, warnings: 0, fixed: 0 },
      issues: [],
      error: error instanceof Error ? error.message : String(error),
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
