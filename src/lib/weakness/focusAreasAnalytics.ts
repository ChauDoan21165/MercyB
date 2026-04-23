// src/lib/weakness/focusAreasAnalytics.ts
//
// Thin wrapper around user_behavior_tracking inserts for the focus-areas
// card. Never throws — analytics must not break Home for a user.
//
// Schema quirk: user_behavior_tracking.room_id is NOT NULL. For events
// not attached to a room (card viewed, empty-state CTA) we use the
// stable pseudo id `home:focus-areas`.

import { supabase } from "@/lib/supabaseClient";
import type { WeaknessTag } from "./weakness-catalog";

const PSEUDO_ROOM_ID = "home:focus-areas";

type InteractionType =
  | "focus_areas_card_viewed"
  | "focus_areas_tag_tapped"
  | "focus_areas_lesson_started"
  | "focus_areas_empty_cta_tapped";

type LogArgs = {
  userId: string;
  interactionType: InteractionType;
  roomId?: string;
  data?: Record<string, unknown>;
};

async function insert({ userId, interactionType, roomId, data }: LogArgs): Promise<void> {
  try {
    await supabase.from("user_behavior_tracking").insert({
      user_id: userId,
      interaction_type: interactionType,
      room_id: roomId ?? PSEUDO_ROOM_ID,
      interaction_data: data ?? null,
    });
  } catch {
    // Swallow. Analytics must never crash the UI.
  }
}

export function logFocusAreasCardViewed(userId: string, tags: readonly WeaknessTag[]): void {
  void insert({
    userId,
    interactionType: "focus_areas_card_viewed",
    data: { tags: [...tags] },
  });
}

export function logFocusAreasTagTapped(
  userId: string,
  tag: WeaknessTag,
  roomId: string,
): void {
  void insert({
    userId,
    interactionType: "focus_areas_tag_tapped",
    roomId,
    data: { tag },
  });
}

export function logFocusAreasLessonStarted(
  userId: string,
  tag: WeaknessTag,
  roomId: string,
): void {
  void insert({
    userId,
    interactionType: "focus_areas_lesson_started",
    roomId,
    data: { tag },
  });
}

export function logFocusAreasEmptyCtaTapped(userId: string): void {
  void insert({
    userId,
    interactionType: "focus_areas_empty_cta_tapped",
  });
}
