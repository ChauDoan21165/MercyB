import type { PlacementV3ObservationTimelineItem } from "./types";
import { buildPlacementTeacherContext } from "./runtimeIntegration";

const REPLAY_TIME = "2026-07-03T00:00:00.000Z";

export const RR001_PLACEMENT_RUNTIME_TIMELINE: PlacementV3ObservationTimelineItem[] = [
  {
    kind: "listening_media",
    taskId: "listening-a2-class-delay-1",
    modality: "listening",
    observedAt: REPLAY_TIME,
    mediaStatus: "unplayable",
    requestedAudioUrl: "/audio/placement-v3/listening-a2-class-delay-1.mp3",
    audioDurationSeconds: 0,
  },
  {
    kind: "speaking_capture",
    taskId: "speaking-a2-learning-goals-1",
    modality: "speaking",
    observedAt: REPLAY_TIME,
    speechPermission: "denied",
  },
  {
    kind: "answer",
    taskId: "reading-b1-work-email-1",
    modality: "reading",
    observedAt: REPLAY_TIME,
    elapsedMs: 900,
    observedCorrect: false,
  },
  {
    kind: "answer",
    taskId: "conversation-a2-job-goals-1",
    modality: "conversation",
    observedAt: REPLAY_TIME,
    elapsedMs: 800,
    observedCorrect: false,
  },
];

export function runRr001PlacementRuntimeReplay() {
  return buildPlacementTeacherContext(RR001_PLACEMENT_RUNTIME_TIMELINE, REPLAY_TIME);
}
