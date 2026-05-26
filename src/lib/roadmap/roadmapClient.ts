/**
 * Public roadmap client (Step 11 / Trust moat).
 *
 * Reads (`listPublicRoadmap`, `getMyVotes`) hit tables directly through
 * RLS. Writes (`upvote`, `removeVote`) use direct INSERT / DELETE; the
 * composite PK on roadmap_item_votes enforces dedup at the DB level so
 * a double-click can't double-count.
 */

import { supabase } from "@/lib/supabaseClient";

export type RoadmapStatus = "planned" | "in_progress" | "shipped" | "dropped";

export type RoadmapItem = {
  id: string;
  title: string;
  descriptionVi: string | null;
  descriptionEn: string | null;
  status: RoadmapStatus;
  priority: number;
  publicVisible: boolean;
  voteCount: number;
  createdAt: string;
  shippedAt: string | null;
};

// ── reads ────────────────────────────────────────────────────────────────

export async function listPublicRoadmap(): Promise<RoadmapItem[]> {
  const { data, error } = await supabase
    .from("roadmap_items")
    .select("*")
    .eq("public_visible", true)
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("[roadmap] listPublicRoadmap failed:", error.message);
    return [];
  }
  return Array.isArray(data) ? data.map(toItem) : [];
}

export async function getMyVotes(
  userId: string | null | undefined,
): Promise<Set<string>> {
  if (!userId) return new Set();

  const { data, error } = await supabase
    .from("roadmap_item_votes")
    .select("roadmap_item_id")
    .eq("user_id", userId);

  if (error) {
    console.warn("[roadmap] getMyVotes failed:", error.message);
    return new Set();
  }
  if (!Array.isArray(data)) return new Set();
  return new Set(
    data.map((row) => String((row as { roadmap_item_id: unknown }).roadmap_item_id)),
  );
}

// ── writes ───────────────────────────────────────────────────────────────

export type VoteResult =
  | { ok: true; alreadyVoted: boolean }
  | { ok: false; error: "not_signed_in" | "rpc_failed" };

/**
 * Upvote an item. Idempotent — if the user already voted, returns
 * `alreadyVoted: true` instead of a duplicate-key error. Vote dedup is
 * enforced at the DB level by the composite PK.
 */
export async function upvote(
  userId: string | null | undefined,
  roadmapItemId: string,
): Promise<VoteResult> {
  if (!userId) return { ok: false, error: "not_signed_in" };

  const { error } = await supabase
    .from("roadmap_item_votes")
    .insert({ roadmap_item_id: roadmapItemId, user_id: userId });

  if (error) {
    // 23505 = unique_violation — user already voted; treat as success.
    if ((error as { code?: string }).code === "23505") {
      return { ok: true, alreadyVoted: true };
    }
    console.warn("[roadmap] upvote failed:", error.message);
    return { ok: false, error: "rpc_failed" };
  }
  return { ok: true, alreadyVoted: false };
}

export async function removeVote(
  userId: string | null | undefined,
  roadmapItemId: string,
): Promise<{ ok: boolean }> {
  if (!userId) return { ok: false };

  const { error } = await supabase
    .from("roadmap_item_votes")
    .delete()
    .eq("roadmap_item_id", roadmapItemId)
    .eq("user_id", userId);

  if (error) {
    console.warn("[roadmap] removeVote failed:", error.message);
    return { ok: false };
  }
  return { ok: true };
}

// ── helpers ──────────────────────────────────────────────────────────────

function toItem(raw: unknown): RoadmapItem {
  const r = (raw ?? {}) as Record<string, unknown>;
  const status = String(r.status ?? "planned");
  const safeStatus: RoadmapStatus =
    status === "planned" || status === "in_progress" || status === "shipped" || status === "dropped"
      ? (status as RoadmapStatus)
      : "planned";

  return {
    id: String(r.id ?? ""),
    title: String(r.title ?? ""),
    descriptionVi: r.description_vi == null ? null : String(r.description_vi),
    descriptionEn: r.description_en == null ? null : String(r.description_en),
    status: safeStatus,
    priority: Number(r.priority ?? 0),
    publicVisible: Boolean(r.public_visible),
    voteCount: Number(r.vote_count ?? 0),
    createdAt: String(r.created_at ?? ""),
    shippedAt: r.shipped_at == null ? null : String(r.shipped_at),
  };
}

export const __test = { toItem };
