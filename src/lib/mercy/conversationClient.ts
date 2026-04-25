/**
 * Mercy v2 — Supabase client wrapper for persisted conversation threads.
 *
 * Pure I/O. No React. No business logic. Each function maps to one or
 * two Supabase calls and returns plain typed objects so the UI layer
 * (ConversationThread, ConversationList) can stay declarative.
 *
 * RLS does the per-user gating — every call only sees the caller's own
 * rows. We pass `userId` only when *writing* (insert constraints) since
 * reads filter implicitly via the policy.
 */

import { supabase } from "@/lib/supabaseClient";

export type MercyRole = "user" | "mercy";

export type MercyConversation = {
  id: string;
  userId: string;
  title: string | null;
  createdAt: string;
  lastMessageAt: string;
};

export type MercyMessage = {
  id: string;
  conversationId: string;
  role: MercyRole;
  content: string;
  viTranslation: string | null;
  createdAt: string;
};

type DbConversationRow = {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  last_message_at: string;
};

type DbMessageRow = {
  id: string;
  conversation_id: string;
  role: MercyRole;
  content: string;
  vi_translation: string | null;
  created_at: string;
};

function rowToConversation(row: DbConversationRow): MercyConversation {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    createdAt: row.created_at,
    lastMessageAt: row.last_message_at,
  };
}

function rowToMessage(row: DbMessageRow): MercyMessage {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    role: row.role,
    content: row.content,
    viTranslation: row.vi_translation,
    createdAt: row.created_at,
  };
}

export async function createConversation(
  userId: string,
  title?: string,
): Promise<MercyConversation> {
  const { data, error } = await supabase
    .from("mercy_conversations")
    .insert({ user_id: userId, title: title ?? null })
    .select()
    .single();

  if (error) throw error;
  return rowToConversation(data as DbConversationRow);
}

export async function listMyConversations(
  userId: string,
): Promise<MercyConversation[]> {
  // RLS already scopes to the caller, but we keep the explicit filter so
  // the call shape is identical between local dev (anon key with RLS) and
  // future server-side reads via the service-role client.
  const { data, error } = await supabase
    .from("mercy_conversations")
    .select("id, user_id, title, created_at, last_message_at")
    .eq("user_id", userId)
    .order("last_message_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((r) => rowToConversation(r as DbConversationRow));
}

export async function getMessagesForConversation(
  conversationId: string,
): Promise<MercyMessage[]> {
  const { data, error } = await supabase
    .from("mercy_messages")
    .select("id, conversation_id, role, content, vi_translation, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((r) => rowToMessage(r as DbMessageRow));
}

/**
 * Append one turn to a conversation. Bumps the parent's `last_message_at`
 * so ConversationList can sort by recency without a separate read.
 *
 * The bump runs as a second write rather than a trigger because the SQL
 * migration deliberately keeps triggers off mercy_messages — we want
 * inserts atomic-per-turn, not coupled to side-effects that could
 * fail the write.
 */
export async function appendMessage(
  conversationId: string,
  role: MercyRole,
  content: string,
  viTranslation?: string,
): Promise<MercyMessage> {
  const { data, error } = await supabase
    .from("mercy_messages")
    .insert({
      conversation_id: conversationId,
      role,
      content,
      vi_translation: viTranslation ?? null,
    })
    .select()
    .single();

  if (error) throw error;

  // Best-effort recency bump. If this fails, the message still lands —
  // the list sort just shows the parent in stale order until the next
  // successful turn.
  await supabase
    .from("mercy_conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);

  return rowToMessage(data as DbMessageRow);
}

export async function deleteConversation(id: string): Promise<void> {
  // Hard delete — cascade removes mercy_messages via the FK constraint.
  // Soft-delete deferred (no `status` column on the table); revisit if
  // Chau wants undo.
  const { error } = await supabase
    .from("mercy_conversations")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function renameConversation(
  id: string,
  title: string,
): Promise<void> {
  const { error } = await supabase
    .from("mercy_conversations")
    .update({ title })
    .eq("id", id);

  if (error) throw error;
}
