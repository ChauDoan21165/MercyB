import { describe, expect, it } from "vitest";

import {
  ISSUE_TYPE_LABELS,
  TASK_TYPE_LABELS,
  type AudioJob,
  type AuditFilterType,
  type AuditIssue,
  type AuditIssueType,
  type AuditMode,
  type AuditRequestOptions,
  type AuditResponse,
  type AuditSeverity,
  type AuditSummary,
  type AuditTaskSuggestion,
  type RoomHealthDetail,
  type TaskPriority,
  type TaskType,
} from "../audit-v4-types";

const ALL_ISSUE_TYPES = [
  "duplicate_room",
  "missing_tier",
  "invalid_tier",
  "tier_incorrect",
  "missing_schema_id",
  "missing_schema",
  "missing_domain",
  "domain_incorrect",
  "missing_title",
  "missing_title_en",
  "missing_title_vi",
  "missing_entries",
  "malformed_entries",
  "entry_count_info",
  "missing_slug",
  "duplicate_slug",
  "slug_format_info",
  "invalid_slug",
  "entry_copy_missing",
  "entry_copy_structure_invalid",
  "missing_copy_en",
  "missing_copy_vi",
  "copy_word_count_extreme",
  "copy_placeholder_detected",
  "room_content_missing",
  "missing_room_keywords",
  "missing_keywords",
  "missing_keywords_vi",
  "entry_keyword_missing_en",
  "entry_keyword_missing_vi",
  "entry_keyword_too_few",
  "entry_keyword_duplicate_across_room",
  "keyword_display_label_wrong",
  "keyword_too_few",
  "keyword_duplicate",
  "missing_audio",
  "missing_audio_field",
  "missing_audio_file",
  "missing_intro_audio_en",
  "missing_intro_audio_vi",
  "orphan_audio_files",
  "missing_json",
  "invalid_json",
  "json_malformed",
  "json_size_exceeded",
  "missing_db",
  "mismatched_slug",
  "registry_missing",
  "missing_room_essay_en",
  "missing_room_essay_vi",
  "essay_placeholder_detected",
  "essay_placeholder",
  "essay_too_short",
  "essay_too_long",
  "tts_unstable_text",
  "tts_length_exceeded",
  "crisis_content",
  "crisis_content_detected",
  "medical_claims",
  "unsafe_medical_claim",
  "emergency_phrasing",
  "kids_crisis_blocker",
  "kids_blocker_detected",
  "corrupt_characters_detected",
  "deprecated_field_present",
  "unknown_entry_key",
  "unknown_field_present",
  "tts_job_generated",
  "tts_intro_job_generated",
  "general_warning",
  "general_info",
] as const satisfies readonly AuditIssueType[];

const ALL_TASK_TYPES = [
  "fix_json",
  "fix_audio",
  "create_intro_audio",
  "fill_keywords",
  "rewrite_essay",
  "review_content",
  "delete_orphan",
] as const satisfies readonly TaskType[];

const ALL_SEVERITIES = ["error", "warning", "info"] as const satisfies readonly AuditSeverity[];
const ALL_PRIORITIES = ["low", "medium", "high", "critical"] as const satisfies readonly TaskPriority[];
const ALL_MODES = ["dry-run", "repair", "scan"] as const satisfies readonly AuditMode[];
const ALL_FILTER_TYPES = [
  "all",
  "errors",
  "warnings",
  "infos",
  "audio",
  "intro_audio",
  "orphan_audio",
  "essays",
  "keywords",
  "tts",
  "safety",
  "deprecated",
  "room_identity",
  "entry_structure",
  "tasks",
  "audio_jobs",
] as const satisfies readonly AuditFilterType[];

const baseStats: AuditSummary = {
  totalRooms: 3,
  scannedRooms: 2,
  errors: 1,
  warnings: 2,
  infos: 3,
  fixed: 1,
  audioFilesInBucket: 12,
  audioBasenamesInBucket: 10,
  orphanAudioCount: 2,
  orphanAudioFiles: 2,
  referencedAudioFiles: 8,
  totalAudioSlots: 20,
  totalAudioPresent: 18,
  totalAudioMissing: 2,
  audioCoveragePercent: 90,
  entriesMissingAudio: 1,
  roomsWithIntroEn: 2,
  roomsWithIntroVi: 1,
  roomsMissingIntroEn: 0,
  roomsMissingIntroVi: 1,
  roomsWithFullIntroAudio: 1,
  tasksGenerated: 4,
  audioJobsGenerated: 5,
  durationMs: 123,
};

describe("audit v4 exported type contracts", () => {
  it("accepts complete normal response fixtures with backwards-compatible aliases", () => {
    const issue: AuditIssue = {
      id: "issue-1",
      file: "rooms/english_foundation_room.json",
      type: "missing_audio_file",
      severity: "error",
      message: "Entry audio file is missing",
      fix: "Generate the missing audio file",
      autoFixable: true,
      orphanList: ["unused-audio.mp3"],
      context: { entrySlug: "ask-for-help", attempts: 2 },
    };

    const task: AuditTaskSuggestion = {
      room_id: "english_foundation_room",
      priority: "critical",
      task_type: "fix_audio",
      description: "Generate missing English entry audio",
      suggested_filename: "english_foundation_room-ask-for-help-en.mp3",
      suggested_text: "Could you help me, please?",
      language: "en",
    };

    const audioJob: AudioJob = {
      room_id: "english_foundation_room",
      entry_slug: "ask-for-help",
      field: "content",
      lang: "en",
      text: "Could you help me, please?",
      filename: "english_foundation_room-ask-for-help-en.mp3",
    };

    const response: AuditResponse = {
      ok: true,
      mode: "repair",
      stats: baseStats,
      summary: baseStats,
      issues: [issue],
      tasks: [task],
      audioJobs: [audioJob],
      fixesApplied: 1,
      fixed: 1,
      logs: ["repair completed"],
    };

    expect(response.summary).toBe(response.stats);
    expect(response.issues[0]).toMatchObject({
      type: "missing_audio_file",
      severity: "error",
      autoFixable: true,
    });
    expect(response.tasks[0]).toMatchObject({ priority: "critical", language: "en" });
    expect(response.audioJobs[0]).toMatchObject({ field: "content", lang: "en" });
    expect(response.fixed).toBe(response.fixesApplied);
  });

  it("accepts edge fixtures for optional fields, zero stats, intro jobs, and error responses", () => {
    const zeroStats: AuditSummary = {
      ...baseStats,
      totalRooms: 0,
      scannedRooms: 0,
      errors: 0,
      warnings: 0,
      infos: 0,
      fixed: 0,
      audioFilesInBucket: 0,
      audioBasenamesInBucket: 0,
      orphanAudioCount: 0,
      orphanAudioFiles: undefined,
      referencedAudioFiles: 0,
      totalAudioSlots: 0,
      totalAudioPresent: 0,
      totalAudioMissing: 0,
      audioCoveragePercent: 0,
      entriesMissingAudio: 0,
      roomsWithIntroEn: 0,
      roomsWithIntroVi: 0,
      roomsMissingIntroEn: 0,
      roomsMissingIntroVi: 0,
      roomsWithFullIntroAudio: 0,
      tasksGenerated: 0,
      audioJobsGenerated: 0,
      durationMs: 0,
    };

    const forwardCompatibleIssue: AuditIssue = {
      id: "future-issue",
      file: "rooms/future.json",
      type: "future_issue_type_from_server",
      severity: "warning",
      message: "The client should keep rendering unknown issue types",
    };

    const introAudioJob: AudioJob = {
      room_id: "english_foundation_room",
      field: "intro",
      lang: "vi",
      text: "Xin chao",
      filename: "english_foundation_room-intro-vi.mp3",
    };

    const failedScan: AuditResponse = {
      ok: false,
      mode: "scan",
      error: "Storage list failed",
      stats: zeroStats,
      summary: zeroStats,
      issues: [forwardCompatibleIssue],
      tasks: [],
      audioJobs: [introAudioJob],
      fixesApplied: 0,
      logs: [],
    };

    expect(failedScan.ok).toBe(false);
    expect(failedScan.error).toBe("Storage list failed");
    expect(failedScan.issues[0].type).toBe("future_issue_type_from_server");
    expect(failedScan.audioJobs[0].entry_slug).toBeUndefined();
    expect(failedScan.stats.orphanAudioFiles).toBeUndefined();
  });

  it("accepts request options and room health detail boundary values", () => {
    const dryRunOptions: AuditRequestOptions = {
      mode: "dry-run",
      limit: 1,
      roomIdPrefix: "english_foundation_",
      checkFiles: true,
    };

    const minimalOptions: AuditRequestOptions = {
      mode: "scan",
    };

    const emptyRoomHealth: RoomHealthDetail = {
      roomId: "empty_room",
      tier: "foundation",
      totalEntries: 0,
      entriesWithAudio: 0,
      entriesMissingAudio: 0,
      audioCoverage: 0,
      hasIntroAudioEn: false,
      hasIntroAudioVi: false,
      issueCount: 0,
    };

    const completeRoomHealth: RoomHealthDetail = {
      ...emptyRoomHealth,
      roomId: "complete_room",
      totalEntries: 10,
      entriesWithAudio: 10,
      audioCoverage: 100,
      hasIntroAudioEn: true,
      hasIntroAudioVi: true,
    };

    expect(dryRunOptions).toMatchObject({ mode: "dry-run", checkFiles: true });
    expect(minimalOptions.limit).toBeUndefined();
    expect(emptyRoomHealth.audioCoverage).toBe(0);
    expect(completeRoomHealth.audioCoverage).toBe(100);
  });

  it("keeps exported literal unions visible to compile-time fixtures", () => {
    expect(ALL_SEVERITIES).toEqual(["error", "warning", "info"]);
    expect(ALL_PRIORITIES).toEqual(["low", "medium", "high", "critical"]);
    expect(ALL_MODES).toEqual(["dry-run", "repair", "scan"]);
    expect(ALL_FILTER_TYPES).toEqual([
      "all",
      "errors",
      "warnings",
      "infos",
      "audio",
      "intro_audio",
      "orphan_audio",
      "essays",
      "keywords",
      "tts",
      "safety",
      "deprecated",
      "room_identity",
      "entry_structure",
      "tasks",
      "audio_jobs",
    ]);
  });
});

describe("ISSUE_TYPE_LABELS", () => {
  it("defines a non-empty deterministic label for every exported issue type", () => {
    expect(Object.keys(ISSUE_TYPE_LABELS).sort()).toEqual([...ALL_ISSUE_TYPES].sort());

    for (const issueType of ALL_ISSUE_TYPES) {
      expect(ISSUE_TYPE_LABELS[issueType], issueType).toEqual(expect.any(String));
      expect(ISSUE_TYPE_LABELS[issueType].trim(), issueType).toBe(ISSUE_TYPE_LABELS[issueType]);
      expect(ISSUE_TYPE_LABELS[issueType].length, issueType).toBeGreaterThan(0);
    }
  });

  it("preserves labels for high-impact normal cases and compatibility aliases", () => {
    expect(ISSUE_TYPE_LABELS.missing_audio_file).toBe("Missing audio file");
    expect(ISSUE_TYPE_LABELS.missing_intro_audio_en).toBe("Missing intro audio (EN)");
    expect(ISSUE_TYPE_LABELS.crisis_content).toBe("Crisis / self-harm content");
    expect(ISSUE_TYPE_LABELS.corrupt_characters_detected).toBe("Corrupt characters");
    expect(ISSUE_TYPE_LABELS.essay_placeholder).toBe("Essay has placeholder");
    expect(ISSUE_TYPE_LABELS.essay_placeholder_detected).toBe("Essay has placeholder");
  });

  it("does not invent labels for forward-compatible unknown issue strings", () => {
    const issue: AuditIssue = {
      id: "unknown-1",
      file: "rooms/unknown.json",
      type: "server_added_issue_type",
      severity: "info",
      message: "Server emitted a newer issue type",
    };

    expect(ISSUE_TYPE_LABELS[issue.type]).toBeUndefined();
  });
});

describe("TASK_TYPE_LABELS", () => {
  it("defines exactly one non-empty label for every exported task type", () => {
    expect(Object.keys(TASK_TYPE_LABELS).sort()).toEqual([...ALL_TASK_TYPES].sort());

    for (const taskType of ALL_TASK_TYPES) {
      expect(TASK_TYPE_LABELS[taskType], taskType).toEqual(expect.any(String));
      expect(TASK_TYPE_LABELS[taskType].trim(), taskType).toBe(TASK_TYPE_LABELS[taskType]);
      expect(TASK_TYPE_LABELS[taskType].length, taskType).toBeGreaterThan(0);
    }
  });

  it("preserves deterministic labels for every task", () => {
    expect(TASK_TYPE_LABELS).toEqual({
      fix_json: "Fix JSON structure",
      fix_audio: "Generate entry audio",
      create_intro_audio: "Generate intro audio",
      fill_keywords: "Fill keywords",
      rewrite_essay: "Rewrite essay",
      review_content: "Review content",
      delete_orphan: "Delete orphan file",
    });
  });
});
