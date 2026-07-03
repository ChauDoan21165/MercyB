import type { EduLearningSignalKey } from "../edu";
import type { LearningBehaviorDpPacket } from "../dp/learningBehaviorFamily";

export type LearningBehaviorPedCapabilityId = "PED-LBF-V1-000001";

const TEACHER_ACTION_BY_SIGNAL: Record<EduLearningSignalKey, string> = {
  productive_hesitation: "allow_wait_time_and_ask_reasoning",
  healthy_self_correction: "acknowledge_revision_and_check_transfer",
  hint_dependency: "check_prompt_clarity_and_fade_hints",
  misconception_recurrence: "reteach_specific_concept_with_contrast",
  retrieval_success: "reinforce_and_schedule_spaced_practice",
  productive_struggle: "acknowledge_persistence_and_offer_transfer_item",
  sustained_attention: "continue_flow_with_periodic_comprehension_check",
  confidence_calibration: "ask_reflection_and_calibrate_with_followup",
  cognitive_overload: "pause_simplify_and_check_directions",
  transfer_success: "ask_novel_transfer_question",
};

export type LearningBehaviorTeacherAction = {
  tmIntId: LearningBehaviorPedCapabilityId;
  signal_key: EduLearningSignalKey;
  teacher_action: string;
  preserve_alternatives: true;
  explainable: true;
  do_not_lower_placement_from_single_event: true;
  sourceDpPacketId: string;
};

export type LearningBehaviorPedPacket = {
  schemaVersion: "tm-int-ped-learning-behavior-v1";
  packetId: string;
  createdAt: string;
  source: "tm-int-ped";
  familyId: "LEARNING-BEHAVIOR-FAMILY-v1";
  dpPacketId: string;
  actions: LearningBehaviorTeacherAction[];
};

export function buildLearningBehaviorPedPacket(
  dpPacket: LearningBehaviorDpPacket,
  createdAt = dpPacket.createdAt,
): LearningBehaviorPedPacket {
  return {
    schemaVersion: "tm-int-ped-learning-behavior-v1",
    packetId: `ped-lbf-v1-${dpPacket.packetId}`,
    createdAt,
    source: "tm-int-ped",
    familyId: "LEARNING-BEHAVIOR-FAMILY-v1",
    dpPacketId: dpPacket.packetId,
    actions: dpPacket.interpretations.map((interpretation) => ({
      tmIntId: "PED-LBF-V1-000001",
      signal_key: interpretation.signal_key,
      teacher_action: TEACHER_ACTION_BY_SIGNAL[interpretation.signal_key],
      preserve_alternatives: true,
      explainable: true,
      do_not_lower_placement_from_single_event: true,
      sourceDpPacketId: dpPacket.packetId,
    })),
  };
}
