// Client API for Step 6 (Community) study groups.
//
// Architecture:
//   - Reads (`listPublicGroups`, `getMyGroups`, `getGroupById`,
//     `getGroupMembers`) hit tables directly through RLS.
//   - Writes that need permission logic beyond plain RLS (`joinGroup`,
//     `kickMember`) go through SECURITY DEFINER RPCs defined in
//     supabase/migrations/20260430000000_study_groups.sql.
//   - Plain writes (`createGroup`, `leaveGroup`, `updateGroup`) use
//     direct INSERT / DELETE / UPDATE; RLS gates correctness.
//
// All functions return narrow shapes (no raw Supabase rows) so consumers
// don't have to know snake_case ↔ camelCase mapping.

import { supabase } from "@/lib/supabaseClient";

export type StudyGroupRole = "owner" | "admin" | "member";

export type StudyGroup = {
  id: string;
  name: string;
  description: string | null;
  ownerUserId: string;
  isPrivate: boolean;
  inviteCode: string | null;
  createdAt: string;
  memberCount: number;
};

export type StudyGroupMember = {
  groupId: string;
  userId: string;
  joinedAt: string;
  role: StudyGroupRole;
};

export type JoinGroupError =
  | "not_signed_in"
  | "group_not_found"
  | "invalid_invite_code"
  | "rpc_failed";

export type KickMemberError =
  | "not_signed_in"
  | "group_not_found"
  | "not_owner"
  | "cannot_kick_owner"
  | "rpc_failed";

// ── reads ────────────────────────────────────────────────────────────────

export async function listPublicGroups(opts?: { limit?: number }): Promise<StudyGroup[]> {
  const { data, error } = await supabase
    .from("study_groups")
    .select("*")
    .eq("is_private", false)
    .order("created_at", { ascending: false })
    .limit(opts?.limit ?? 50);

  if (error) {
    console.warn("[studyGroups] listPublicGroups failed:", error.message);
    return [];
  }
  return Array.isArray(data) ? data.map(toGroup) : [];
}

export async function getMyGroups(
  userId: string | null | undefined,
): Promise<StudyGroup[]> {
  if (!userId) return [];

  // Member rows hold (group_id, user_id); join study_groups via FK.
  const { data, error } = await supabase
    .from("study_group_members")
    .select("study_groups(*)")
    .eq("user_id", userId);

  if (error) {
    console.warn("[studyGroups] getMyGroups failed:", error.message);
    return [];
  }

  if (!Array.isArray(data)) return [];

  // PostgREST returns either an object or array under the embedded relation
  // depending on FK cardinality — flatten defensively.
  const out: StudyGroup[] = [];
  for (const row of data) {
    const embedded = (row as Record<string, unknown>).study_groups;
    if (!embedded) continue;
    if (Array.isArray(embedded)) {
      for (const g of embedded) out.push(toGroup(g));
    } else {
      out.push(toGroup(embedded));
    }
  }
  return out;
}

export async function getGroupById(groupId: string): Promise<StudyGroup | null> {
  const { data, error } = await supabase
    .from("study_groups")
    .select("*")
    .eq("id", groupId)
    .maybeSingle();

  if (error) {
    console.warn("[studyGroups] getGroupById failed:", error.message);
    return null;
  }
  return data ? toGroup(data) : null;
}

export async function getGroupMembers(groupId: string): Promise<StudyGroupMember[]> {
  const { data, error } = await supabase
    .from("study_group_members")
    .select("*")
    .eq("group_id", groupId)
    .order("joined_at", { ascending: true });

  if (error) {
    console.warn("[studyGroups] getGroupMembers failed:", error.message);
    return [];
  }
  return Array.isArray(data) ? data.map(toMember) : [];
}

// ── writes ───────────────────────────────────────────────────────────────

export async function createGroup(args: {
  userId: string | null | undefined;
  name: string;
  description?: string | null;
  isPrivate?: boolean;
}): Promise<StudyGroup | null> {
  if (!args.userId) return null;
  const trimmedName = args.name.trim();
  if (trimmedName.length < 2 || trimmedName.length > 80) {
    console.warn("[studyGroups] createGroup rejected: name length out of range");
    return null;
  }

  const { data, error } = await supabase
    .from("study_groups")
    .insert({
      name: trimmedName,
      description: args.description ?? null,
      owner_user_id: args.userId,
      is_private: args.isPrivate ?? false,
    })
    .select()
    .single();

  if (error || !data) {
    console.warn("[studyGroups] createGroup failed:", error?.message);
    return null;
  }
  return toGroup(data);
}

export async function joinGroup(
  groupId: string,
  inviteCode?: string | null,
): Promise<{ ok: true; groupId: string } | { ok: false; error: JoinGroupError }> {
  const { data, error } = await supabase.rpc("join_study_group", {
    p_group_id: groupId,
    p_invite_code: inviteCode ?? null,
  });

  if (error) {
    console.warn("[studyGroups] joinGroup RPC error:", error.message);
    return { ok: false, error: "rpc_failed" };
  }

  const row = (data ?? {}) as Record<string, unknown>;
  if (row.ok === true) {
    return { ok: true, groupId: String(row.group_id ?? groupId) };
  }
  return { ok: false, error: (row.error as JoinGroupError) ?? "rpc_failed" };
}

export async function leaveGroup(
  userId: string | null | undefined,
  groupId: string,
): Promise<{ ok: boolean }> {
  if (!userId) return { ok: false };

  const { error } = await supabase
    .from("study_group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", userId);

  if (error) {
    console.warn("[studyGroups] leaveGroup failed:", error.message);
    return { ok: false };
  }
  return { ok: true };
}

export async function kickMember(
  groupId: string,
  userId: string,
): Promise<{ ok: true } | { ok: false; error: KickMemberError }> {
  const { data, error } = await supabase.rpc("kick_study_group_member", {
    p_group_id: groupId,
    p_user_id: userId,
  });

  if (error) {
    console.warn("[studyGroups] kickMember RPC error:", error.message);
    return { ok: false, error: "rpc_failed" };
  }

  const row = (data ?? {}) as Record<string, unknown>;
  if (row.ok === true) return { ok: true };
  return { ok: false, error: (row.error as KickMemberError) ?? "rpc_failed" };
}

export async function updateGroup(
  groupId: string,
  patch: { name?: string; description?: string | null; isPrivate?: boolean },
): Promise<StudyGroup | null> {
  const update: Record<string, unknown> = {};
  if (patch.name !== undefined) {
    const trimmed = patch.name.trim();
    if (trimmed.length < 2 || trimmed.length > 80) {
      console.warn("[studyGroups] updateGroup rejected: name length out of range");
      return null;
    }
    update.name = trimmed;
  }
  if (patch.description !== undefined) update.description = patch.description;
  if (patch.isPrivate !== undefined) update.is_private = patch.isPrivate;

  if (Object.keys(update).length === 0) {
    return getGroupById(groupId);
  }

  const { data, error } = await supabase
    .from("study_groups")
    .update(update)
    .eq("id", groupId)
    .select()
    .single();

  if (error || !data) {
    console.warn("[studyGroups] updateGroup failed:", error?.message);
    return null;
  }
  return toGroup(data);
}

// ── helpers ──────────────────────────────────────────────────────────────

export function toGroup(raw: unknown): StudyGroup {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    id: String(r.id ?? ""),
    name: String(r.name ?? ""),
    description: r.description == null ? null : String(r.description),
    ownerUserId: String(r.owner_user_id ?? ""),
    isPrivate: Boolean(r.is_private),
    inviteCode: r.invite_code == null ? null : String(r.invite_code),
    createdAt: String(r.created_at ?? ""),
    memberCount: Number(r.member_count ?? 0),
  };
}

export function toMember(raw: unknown): StudyGroupMember {
  const r = (raw ?? {}) as Record<string, unknown>;
  const role = r.role === "owner" || r.role === "admin" ? r.role : "member";
  return {
    groupId: String(r.group_id ?? ""),
    userId: String(r.user_id ?? ""),
    joinedAt: String(r.joined_at ?? ""),
    role: role as StudyGroupRole,
  };
}
