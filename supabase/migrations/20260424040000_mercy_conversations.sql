-- Mercy v2 — multi-turn conversation persistence.
--
-- Step 7 (AI Teacher v2). The legacy MercyChat keeps in-memory `messages`
-- state and loses the thread on refresh. The new ConversationThread UI
-- persists threads here so users can resume — and so the assistant has
-- a real context window to draw from on follow-up turns.
--
-- Two tables, parent-child:
--   mercy_conversations  — one row per thread, owns the title + recency.
--   mercy_messages       — one row per turn (user OR mercy). Hard delete
--                          via cascade when the parent conversation is
--                          deleted (no soft-delete column for now —
--                          can add later if Chau wants undo).
--
-- RLS: owner-only on both tables. user_id derived via the FK chain to
-- auth.users; mercy_messages relies on the parent conversation's policy
-- via EXISTS (no user_id column on messages — keeps the schema lean,
-- one source of truth for ownership).
--
-- Reversibility:
--   DROP TABLE IF EXISTS public.mercy_messages;
--   DROP TABLE IF EXISTS public.mercy_conversations;

-- ── 1. Tables ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.mercy_conversations (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  title           text,
  created_at      timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS idx_mercy_conversations_user_recent
  ON public.mercy_conversations (user_id, last_message_at DESC);

CREATE TABLE IF NOT EXISTS public.mercy_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.mercy_conversations(id) on delete cascade,
  -- 'user' for the human turn, 'mercy' for the assistant turn. Constrained
  -- so a typo can't write a third unrecognised role.
  role            text not null check (role in ('user', 'mercy')),
  content         text not null,
  vi_translation  text,
  created_at      timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS idx_mercy_messages_conversation_created
  ON public.mercy_messages (conversation_id, created_at);

-- ── 2. RLS — owner-only ───────────────────────────────────────────────────

ALTER TABLE public.mercy_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercy_messages      ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "mercy_conversations_owner_select" ON public.mercy_conversations;
CREATE POLICY "mercy_conversations_owner_select"
  ON public.mercy_conversations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "mercy_conversations_owner_insert" ON public.mercy_conversations;
CREATE POLICY "mercy_conversations_owner_insert"
  ON public.mercy_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "mercy_conversations_owner_update" ON public.mercy_conversations;
CREATE POLICY "mercy_conversations_owner_update"
  ON public.mercy_conversations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "mercy_conversations_owner_delete" ON public.mercy_conversations;
CREATE POLICY "mercy_conversations_owner_delete"
  ON public.mercy_conversations FOR DELETE
  USING (auth.uid() = user_id);

-- mercy_messages — ownership inherited from parent conversation. Using
-- EXISTS keeps the policy simple and avoids a denormalised user_id
-- column that could drift from the parent.
DROP POLICY IF EXISTS "mercy_messages_owner_select" ON public.mercy_messages;
CREATE POLICY "mercy_messages_owner_select"
  ON public.mercy_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.mercy_conversations c
     WHERE c.id = mercy_messages.conversation_id
       AND c.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "mercy_messages_owner_insert" ON public.mercy_messages;
CREATE POLICY "mercy_messages_owner_insert"
  ON public.mercy_messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.mercy_conversations c
     WHERE c.id = mercy_messages.conversation_id
       AND c.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "mercy_messages_owner_delete" ON public.mercy_messages;
CREATE POLICY "mercy_messages_owner_delete"
  ON public.mercy_messages FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.mercy_conversations c
     WHERE c.id = mercy_messages.conversation_id
       AND c.user_id = auth.uid()
  ));

-- Documentation
COMMENT ON TABLE public.mercy_conversations IS
  'Mercy v2: one row per persisted multi-turn thread. RLS owner-only.';
COMMENT ON TABLE public.mercy_messages IS
  'Mercy v2: one row per turn (user or mercy). RLS inherited from parent conversation.';
COMMENT ON COLUMN public.mercy_messages.role IS
  'user = human turn, mercy = assistant turn. CHECK constrained.';
