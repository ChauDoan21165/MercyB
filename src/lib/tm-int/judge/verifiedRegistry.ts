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

export type VerifiedEduFramework = {
  framework_id: "EDU-LS-SPRINT1";
  semantic_key: "edu_ls.sprint1.learning_signal_framework";
  judge_decision: "promoted";
  judge_artifact: string;
  promoted_by: "ADMIN/JUDGE";
  source_commit: string;
  verified: true;
};

export const VERIFIED_EDU_FRAMEWORKS = [
  {
    framework_id: "EDU-LS-SPRINT1",
    semantic_key: "edu_ls.sprint1.learning_signal_framework",
    judge_decision: "promoted",
    judge_artifact: "src/lib/tm-int/judge/decisions/EDU-LS-SPRINT1.json",
    promoted_by: "ADMIN/JUDGE",
    source_commit: "419d45b65",
    verified: true,
  },
] as const satisfies readonly VerifiedEduFramework[];

export function verifiedEduFrameworkCount(): number {
  return VERIFIED_EDU_FRAMEWORKS.length;
}

export type VerifiedLearningBehaviorFamily = {
  family_id: "LEARNING-BEHAVIOR-FAMILY-v1";
  semantic_key: "learning_behavior.family.v1";
  judge_decision: "promoted";
  judge_artifact: string;
  promoted_by: "ADMIN/JUDGE";
  source_commit: string;
  verified: true;
};

export const VERIFIED_LEARNING_BEHAVIOR_FAMILIES = [
  {
    family_id: "LEARNING-BEHAVIOR-FAMILY-v1",
    semantic_key: "learning_behavior.family.v1",
    judge_decision: "promoted",
    judge_artifact: "src/lib/tm-int/judge/decisions/LEARNING-BEHAVIOR-FAMILY-v1.json",
    promoted_by: "ADMIN/JUDGE",
    source_commit: "7af613136",
    verified: true,
  },
] as const satisfies readonly VerifiedLearningBehaviorFamily[];

export function verifiedLearningBehaviorFamilyCount(): number {
  return VERIFIED_LEARNING_BEHAVIOR_FAMILIES.length;
}

export type VerifiedRuntimeAdoption = {
  runtime_id: "RUNTIME-ADOPTION-RA1";
  semantic_key: "runtime.teacher_context.ra1";
  judge_decision: "promoted";
  judge_artifact: string;
  promoted_by: "ADMIN/JUDGE";
  source_commit: string;
  verified: true;
};

export const VERIFIED_RUNTIME_ADOPTIONS = [
  {
    runtime_id: "RUNTIME-ADOPTION-RA1",
    semantic_key: "runtime.teacher_context.ra1",
    judge_decision: "promoted",
    judge_artifact: "src/lib/tm-int/judge/decisions/RUNTIME-ADOPTION-RA1.json",
    promoted_by: "ADMIN/JUDGE",
    source_commit: "2bb324127",
    verified: true,
  },
] as const satisfies readonly VerifiedRuntimeAdoption[];

export function verifiedRuntimeAdoptionCount(): number {
  return VERIFIED_RUNTIME_ADOPTIONS.length;
}
