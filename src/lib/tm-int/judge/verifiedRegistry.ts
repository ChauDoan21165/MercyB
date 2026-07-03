export type VerifiedTeachingCase = {
  tc_id: "TC-000001" | "TC-000002" | "TC-000003";
  semantic_key:
    | "tc000001.placement_audio_unavailable"
    | "tc000002.microphone_denied_during_speaking"
    | "tc000003.rapid_guessing_during_assessment";
  judge_decision: "promoted";
  judge_artifact: string;
  promoted_by: "ADMIN/JUDGE";
  source_commit: string;
  verified: true;
};

export const VERIFIED_TEACHING_CASES = [
  {
    tc_id: "TC-000001",
    semantic_key: "tc000001.placement_audio_unavailable",
    judge_decision: "promoted",
    judge_artifact: "src/lib/tm-int/judge/decisions/TC-000001.json",
    promoted_by: "ADMIN/JUDGE",
    source_commit: "3e9406a99",
    verified: true,
  },
  {
    tc_id: "TC-000002",
    semantic_key: "tc000002.microphone_denied_during_speaking",
    judge_decision: "promoted",
    judge_artifact: "src/lib/tm-int/judge/decisions/TC-000002.json",
    promoted_by: "ADMIN/JUDGE",
    source_commit: "cd02dca61",
    verified: true,
  },
  {
    tc_id: "TC-000003",
    semantic_key: "tc000003.rapid_guessing_during_assessment",
    judge_decision: "promoted",
    judge_artifact: "src/lib/tm-int/judge/decisions/TC-000003.json",
    promoted_by: "ADMIN/JUDGE",
    source_commit: "607a38af9",
    verified: true,
  },
] as const satisfies readonly VerifiedTeachingCase[];

export function verifiedTeachingCaseCount(): number {
  return VERIFIED_TEACHING_CASES.length;
}
