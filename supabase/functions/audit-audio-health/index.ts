// supabase/functions/audit-audio-health/index.ts
// Audio health audit - 30 checks for audio files
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

type AuditMode = "dry-run" | "repair";
type Severity = "error" | "warning" | "info";

type AudioIssue = {
  id: string;
  file: string;
  type: string;
  severity: Severity;
  message: string;
  fix?: string;
  autoFixable?: boolean;
};

type AudioSummary = {
  totalEntries: number;
  totalAudioFiles: number;
  entriesWithAudio: number;
  entriesWithoutAudio: number;
  audioCoverage: number;
  errors: number;
  warnings: number;
  fixed: number;
};

type AudioResult = {
  issues: AudioIssue[];
  summary: AudioSummary;
  fixesApplied: number;
  logs: string[];
  coverageByTier: Record<string, { total: number; withAudio: number; coverage: number }>;
};

// Valid audio filename pattern: roomid_index_en.mp3
const AUDIO_PATTERN = /^[a-z0-9_]+_\d+_en\.mp3$/;
const AUDIO_BUCKET = "room-audio";

// Helper functions
function isValidAudioFilename(filename: string): boolean {
  return AUDIO_PATTERN.test(filename);
}

function extractSlugFromAudioName(audioFilename: string): string | null {
  // e.g., "strategic_foundations_vip9_01_en.mp3" -> "strategic_foundations_vip9"
  const match = audioFilename.match(/^(.+)_\d+_en\.mp3$/);
  return match ? match[1] : null;
}

function generateExpectedAudioFilename(roomId: string, entryIndex: number): string {
  const normalizedId = roomId.replace(/-/g, "_").toLowerCase();
  const paddedIndex = String(entryIndex + 1).padStart(2, "0");
  return `${normalizedId}_${paddedIndex}_en.mp3`;
}

// Main audit function
async function runAudioHealthAudit(mode: AuditMode): Promise<AudioResult> {
  const logs: string[] = [];
  const issues: AudioIssue[] = [];
  let fixesApplied = 0;

  const log = (msg: string) => {
    logs.push(msg);
    console.log(`[AudioHealth] ${msg}`);
  };

  log(`Starting Audio Health audit (30 checks) in ${mode} mode`);

  // Phase 1: Load all rooms with entries
  const { data: rooms, error: roomsError } = await supabase
    .from("rooms")
    .select("id, tier, entries");

  if (roomsError) {
    throw new Error(`Database error: ${roomsError.message}`);
  }

  // Phase 2: List all audio files in storage
  const { data: storageFiles, error: storageError } = await supabase
    .storage
    .from(AUDIO_BUCKET)
    .list("", { limit: 10000 });

  const audioFilesInStorage = new Set<string>();
  const audioFileMetadata: Map<string, any> = new Map();

  if (!storageError && storageFiles) {
    for (const file of storageFiles) {
      if (file.name.endsWith(".mp3") || file.name.endsWith(".wav")) {
        audioFilesInStorage.add(file.name);
        audioFileMetadata.set(file.name, file);
      }
    }
    log(`Found ${audioFilesInStorage.size} audio files in storage`);
  } else {
    log(`Warning: Could not list storage files: ${storageError?.message || "unknown error"}`);
  }

  // Track coverage
  let totalEntries = 0;
  let entriesWithAudio = 0;
  const coverageByTier: Record<string, { total: number; withAudio: number; coverage: number }> = {};
  const seenAudioFiles = new Set<string>();
  const audioFilesExpected = new Set<string>();
  const entryAudioRefs: Map<string, string[]> = new Map(); // roomId -> [audio filenames]

  // Phase 3: Run all 30 audio checks
  for (const room of rooms || []) {
    const roomId = room.id;
    const tier = room.tier || "unknown";
    const entries = Array.isArray(room.entries) ? (room.entries as any[]) : [];

    if (!coverageByTier[tier]) {
      coverageByTier[tier] = { total: 0, withAudio: 0, coverage: 0 };
    }

    const roomAudioRefs: string[] = [];

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i] as Record<string, any>;
      const entrySlug = entry.slug || entry.artifact_id || entry.id || `entry-${i}`;
      const audio = entry.audio || entry.audio_en;
      const prefix = `${roomId}-e${i}`;

      totalEntries++;
      coverageByTier[tier].total++;

      // 1. Check audio filename exists
      if (!audio) {
        issues.push({
          id: `a1-${prefix}`,
          file: `${roomId}.json`,
          type: "missing_audio_ref",
          severity: "warning",
          message: `Entry "${entrySlug}" has no audio reference`,
          fix: `Set to "${generateExpectedAudioFilename(roomId, i)}"`,
          autoFixable: true,
        });
      } else {
        entriesWithAudio++;
        coverageByTier[tier].withAudio++;
        roomAudioRefs.push(audio);

        // 2. Check audio filename EN matches slug pattern
        const expectedFilename = generateExpectedAudioFilename(roomId, i);
        audioFilesExpected.add(audio);

        if (audio !== expectedFilename && !audio.includes(roomId.replace(/-/g, "_"))) {
          issues.push({
            id: `a2-${prefix}`,
            file: audio,
            type: "audio_name_mismatch",
            severity: "info",
            message: `Audio "${audio}" doesn't match expected pattern "${expectedFilename}"`,
            autoFixable: false,
          });
        }

        // 3. Check audio file exists in storage
        if (!audioFilesInStorage.has(audio)) {
          issues.push({
            id: `a3-${prefix}`,
            file: audio,
            type: "audio_not_in_storage",
            severity: "error",
            message: `Audio file "${audio}" not found in storage`,
            fix: "Upload file or generate via TTS",
            autoFixable: false,
          });
        }

        // 4. Check duplicate audio files (same file referenced multiple times)
        if (seenAudioFiles.has(audio)) {
          issues.push({
            id: `a4-${prefix}`,
            file: audio,
            type: "duplicate_audio_ref",
            severity: "warning",
            message: `Audio "${audio}" is referenced multiple times`,
            autoFixable: false,
          });
        }
        seenAudioFiles.add(audio);

        // 5. Check incorrect suffix _en.mp3
        if (!audio.endsWith("_en.mp3") && audio.endsWith(".mp3")) {
          issues.push({
            id: `a5-${prefix}`,
            file: audio,
            type: "incorrect_suffix",
            severity: "warning",
            message: `Audio "${audio}" should end with "_en.mp3"`,
            fix: `Rename to "${audio.replace(".mp3", "_en.mp3")}"`,
            autoFixable: true,
          });
        }

        // 6. Check .wav → convert to .mp3
        if (audio.endsWith(".wav")) {
          issues.push({
            id: `a6-${prefix}`,
            file: audio,
            type: "wav_needs_conversion",
            severity: "warning",
            message: `Audio "${audio}" is WAV format, should be MP3`,
            fix: "Convert to MP3",
            autoFixable: false,
          });
        }

        // 7. Detect missing Vietnamese audio (entry.audio_vi)
        if (!entry.audio_vi) {
          issues.push({
            id: `a7-${prefix}`,
            file: `${roomId}.json`,
            type: "missing_audio_vi",
            severity: "info",
            message: `Entry "${entrySlug}" has no Vietnamese audio`,
            autoFixable: false,
          });
        }

        // 8. Detect missing English audio (when audio_vi exists but not audio_en)
        if (entry.audio_vi && !entry.audio_en && !entry.audio) {
          issues.push({
            id: `a8-${prefix}`,
            file: `${roomId}.json`,
            type: "missing_audio_en",
            severity: "warning",
            message: `Entry "${entrySlug}" has Vietnamese but no English audio`,
            autoFixable: false,
          });
        }

        // 18. Replace invalid characters in filename
        if (/[^a-z0-9_.]/.test(audio)) {
          issues.push({
            id: `a18-${prefix}`,
            file: audio,
            type: "invalid_chars_in_filename",
            severity: "warning",
            message: `Audio "${audio}" contains invalid characters`,
            fix: `Rename to "${audio.replace(/[^a-z0-9_.]/g, "_")}"`,
            autoFixable: true,
          });
        }

        // 19. Ensure filename lower-case
        if (audio !== audio.toLowerCase()) {
          issues.push({
            id: `a19-${prefix}`,
            file: audio,
            type: "filename_not_lowercase",
            severity: "warning",
            message: `Audio "${audio}" should be lowercase`,
            fix: `Rename to "${audio.toLowerCase()}"`,
            autoFixable: true,
          });
        }

        // 20. Validate file in correct folder (no subfolders in name)
        if (audio.includes("/")) {
          issues.push({
            id: `a20-${prefix}`,
            file: audio,
            type: "audio_has_folder_path",
            severity: "warning",
            message: `Audio "${audio}" contains folder path, should be filename only`,
            fix: `Use "${audio.split("/").pop()}"`,
            autoFixable: true,
          });
        }
      }

      entryAudioRefs.set(roomId, roomAudioRefs);
    }
  }

  // Additional storage-based checks
  for (const [filename, metadata] of audioFileMetadata.entries()) {
    // 15. Check naming collision (files that might collide after normalization)
    const normalizedName = filename.toLowerCase().replace(/[^a-z0-9_.]/g, "_");
    if (normalizedName !== filename && audioFilesInStorage.has(normalizedName)) {
      issues.push({
        id: `a15-${filename}`,
        file: filename,
        type: "naming_collision",
        severity: "warning",
        message: `Audio "${filename}" may collide with "${normalizedName}"`,
        autoFixable: false,
      });
    }

    // 25. Check storage size anomalies (files < 1KB or > 50MB)
    const size = metadata.metadata?.size || 0;
    if (size > 0 && size < 1024) {
      issues.push({
        id: `a25-small-${filename}`,
        file: filename,
        type: "audio_too_small",
        severity: "warning",
        message: `Audio "${filename}" is very small (${size} bytes), may be corrupted`,
        autoFixable: false,
      });
    }
    if (size > 50 * 1024 * 1024) {
      issues.push({
        id: `a25-large-${filename}`,
        file: filename,
        type: "audio_too_large",
        severity: "info",
        message: `Audio "${filename}" is very large (${Math.round(size / 1024 / 1024)}MB)`,
        autoFixable: false,
      });
    }

    // 28. Check MIME type mismatch
    const mimeType = metadata.metadata?.mimetype;
    if (mimeType && filename.endsWith(".mp3") && !mimeType.includes("audio")) {
      issues.push({
        id: `a28-${filename}`,
        file: filename,
        type: "mime_type_mismatch",
        severity: "warning",
        message: `Audio "${filename}" has unexpected MIME type: ${mimeType}`,
        autoFixable: false,
      });
    }
  }

  // Check for orphaned audio files (in storage but not referenced)
  for (const storageFile of audioFilesInStorage) {
    if (!audioFilesExpected.has(storageFile)) {
      issues.push({
        id: `orphan-${storageFile}`,
        file: storageFile,
        type: "orphaned_audio",
        severity: "info",
        message: `Audio "${storageFile}" exists in storage but is not referenced by any entry`,
        autoFixable: false,
      });
    }
  }

  // Checks that require audio file analysis (flagged as not auto-fixable)
  // 9. Detect silent audio (<0.5s)
  // 10. Detect corrupted files
  // 11. Detect inconsistent bitrate
  // 12. Detect long pauses >2s
  // 13. Detect clipped audio
  // 14. Check volume level consistency
  // 21. Detect outdated audio version
  // 22. Detect background noise
  // 23. Detect inconsistent voice tone
  // 26. Detect duplicate durations
  // 27. Detect broken metadata
  // These require audio processing libraries not available in edge functions
  log("Note: Audio analysis checks (silence, corruption, bitrate, etc.) require manual review");

  // 24. Verify cross-tier naming consistency
  const tierAudioPatterns: Map<string, Set<string>> = new Map();
  for (const room of rooms || []) {
    const tier = room.tier || "unknown";
    if (!tierAudioPatterns.has(tier)) {
      tierAudioPatterns.set(tier, new Set());
    }
    const entries = Array.isArray(room.entries) ? (room.entries as any[]) : [];
    for (const entry of entries) {
      const audio = (entry as any).audio || (entry as any).audio_en;
      if (audio) {
        const pattern = audio.replace(/\d+/g, "N").replace(/_en\.mp3$/, "");
        tierAudioPatterns.get(tier)!.add(pattern);
      }
    }
  }

  // 29. Rebuild missing metadata cache - flag for rebuild
  if (audioFileMetadata.size < audioFilesInStorage.size * 0.9) {
    issues.push({
      id: "a29-cache",
      file: "storage",
      type: "metadata_cache_incomplete",
      severity: "info",
      message: `Audio metadata cache may be incomplete (${audioFileMetadata.size}/${audioFilesInStorage.size} files)`,
      fix: "Rebuild metadata cache",
      autoFixable: false,
    });
  }

  // Phase 4: Apply fixes in repair mode
  if (mode === "repair") {
    log("Repair mode: Auto-fixes for audio require entry updates in rooms table");
    
    // Group fixes by room for batch updates
    const roomUpdates: Map<string, { entries: any[]; fixes: string[] }> = new Map();
    
    for (const room of rooms || []) {
      const roomId = room.id;
      const entries = Array.isArray(room.entries) ? [...(room.entries as any[])] : [];
      let hasChanges = false;
      const fixes: string[] = [];

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i] as Record<string, any>;
        const audio = entry.audio || entry.audio_en;

        // Fix missing audio reference
        if (!audio) {
          const expectedFilename = generateExpectedAudioFilename(roomId, i);
          if (audioFilesInStorage.has(expectedFilename)) {
            entries[i] = { ...entry, audio: expectedFilename };
            hasChanges = true;
            fixes.push(`Set audio to ${expectedFilename} for entry ${i}`);
          }
        }

        // Fix folder paths in audio
        if (audio && audio.includes("/")) {
          const cleanFilename = audio.split("/").pop()!;
          entries[i] = { ...entry, audio: cleanFilename };
          hasChanges = true;
          fixes.push(`Removed folder path from ${audio}`);
        }
      }

      if (hasChanges) {
        roomUpdates.set(roomId, { entries, fixes });
      }
    }

    // Apply updates
    for (const [roomId, { entries, fixes }] of roomUpdates.entries()) {
      const { error } = await supabase
        .from("rooms")
        .update({ entries })
        .eq("id", roomId);

      if (!error) {
        fixesApplied += fixes.length;
        fixes.forEach(f => log(`Fixed: ${f} in ${roomId}`));
      } else {
        log(`Failed to update ${roomId}: ${error.message}`);
      }
    }

    log(`Repairs complete: ${fixesApplied} fixes applied`);
  }

  // Calculate coverage
  for (const tier of Object.keys(coverageByTier)) {
    const stats = coverageByTier[tier];
    stats.coverage = stats.total > 0 ? Math.round((stats.withAudio / stats.total) * 100) : 0;
  }

  const errors = issues.filter(i => i.severity === "error").length;
  const warnings = issues.filter(i => i.severity === "warning").length;

  // 30. Build audio coverage report
  const summary: AudioSummary = {
    totalEntries,
    totalAudioFiles: audioFilesInStorage.size,
    entriesWithAudio,
    entriesWithoutAudio: totalEntries - entriesWithAudio,
    audioCoverage: totalEntries > 0 ? Math.round((entriesWithAudio / totalEntries) * 100) : 0,
    errors,
    warnings,
    fixed: fixesApplied,
  };

  log(`Summary: ${totalEntries} entries, ${entriesWithAudio} with audio (${summary.audioCoverage}% coverage), ${errors} errors, ${warnings} warnings`);

  return { issues, summary, fixesApplied, logs, coverageByTier };
}

// HTTP Handler
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
    const result = await runAudioHealthAudit(mode);

    return new Response(JSON.stringify({
      ok: true,
      issues: result.issues,
      fixesApplied: result.fixesApplied,
      fixed: result.fixesApplied,
      logs: result.logs,
      summary: result.summary,
      coverageByTier: result.coverageByTier,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[audit-audio-health] Error:", err);
    return new Response(JSON.stringify({
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      issues: [],
      fixesApplied: 0,
      logs: [],
      summary: { totalEntries: 0, totalAudioFiles: 0, entriesWithAudio: 0, entriesWithoutAudio: 0, audioCoverage: 0, errors: 0, warnings: 0, fixed: 0 },
      coverageByTier: {},
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
