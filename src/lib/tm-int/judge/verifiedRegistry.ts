export type VerifiedTeachingCase = {
  tc_id: "TC-000001";
  semantic_key: "tc000001.placement_audio_unavailable";
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
] as const satisfies readonly VerifiedTeachingCase[];

export function verifiedTeachingCaseCount(): number {
  return VERIFIED_TEACHING_CASES.length;
}
