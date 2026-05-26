-- Teacher review portal — feedback + content review state.
--
-- Two tables:
--   1. content_review_status — moderation state for a piece of content
--      (vstep / toeic / ielts / cultural / profession / room). Admin
--      flips it to 'in_review' to surface it in the teacher queue;
--      teacher flips it to 'approved' / 'needs_revision' / 'rejected'
--      after submitting feedback.
--   2. teacher_feedback — append-only log of teacher reviews. One row
--      per teacher review submission. Admin works through these in
--      `/admin/teacher-feedback` to apply, reject, or request revision.
--
-- RLS shape (mirrors the existing user_stories pattern from
-- 20260523000000_user_stories.sql):
--   - Teacher (level >= 5): SELECT only rows surfaced to them; INSERT
--     own feedback only; UPDATE only review status of items in queue.
--   - Admin (level >= 9): full access to both tables.
--   - Non-admin: no access (RLS denies by default; no permissive policy).
--
-- Privacy: teachers see CONTENT references and their own feedback —
-- they NEVER see user data. The `content_review_status` table only
-- carries `content_id` + `content_type` + workflow state; the
-- `teacher_feedback` table records the reviewer (which is the teacher
-- themselves) but no end-user fields.
--
-- Reversibility:
--   DROP TABLE IF EXISTS public.teacher_feedback;
--   DROP TABLE IF EXISTS public.content_review_status;
--   DROP TYPE  IF EXISTS public.teacher_feedback_status;
--   DROP TYPE  IF EXISTS public.teacher_feedback_severity;
--   DROP TYPE  IF EXISTS public.content_review_state;

-- ── Enums ─────────────────────────────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'content_review_state') then
    create type public.content_review_state as enum (
      'not_reviewed', 'in_review', 'approved', 'needs_revision', 'rejected'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'teacher_feedback_severity') then
    create type public.teacher_feedback_severity as enum (
      '1', '2', '3', '4', '5'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'teacher_feedback_status') then
    create type public.teacher_feedback_status as enum (
      'open', 'admin_acknowledged', 'correction_applied', 'rejected_by_admin'
    );
  end if;
end$$;

-- ── content_review_status ─────────────────────────────────────────────
create table if not exists public.content_review_status (
  content_id    text not null,
  content_type  text not null check (content_type in
    ('vstep', 'toeic', 'ielts', 'cultural', 'profession', 'room')),
  status        public.content_review_state not null default 'not_reviewed',
  marked_for_review_at timestamptz,
  last_reviewed_at     timestamptz,
  reviewer_id   uuid references public.profiles(id) on delete set null,
  primary key (content_id, content_type)
);

comment on table public.content_review_status is
  'Per-content moderation state. Admin marks items in_review; teachers '
  'transition them to approved / needs_revision / rejected after review.';

-- ── teacher_feedback ──────────────────────────────────────────────────
create table if not exists public.teacher_feedback (
  id            uuid primary key default gen_random_uuid(),
  content_id    text not null,
  content_type  text not null,
  reviewer_id   uuid not null references public.profiles(id) on delete cascade,
  severity      public.teacher_feedback_severity not null,
  -- issues is jsonb so the schema can grow without migration churn.
  -- Expected shape: array of { category: 'vocabulary'|'grammar'|
  -- 'cultural_accuracy'|'clarity'|'tone', note: string }.
  issues        jsonb not null default '[]'::jsonb,
  suggested_correction text,
  decision      text not null check (decision in ('approve', 'needs_revision', 'reject')),
  status        public.teacher_feedback_status not null default 'open',
  admin_response text,
  created_at    timestamptz not null default now(),
  resolved_at   timestamptz
);

comment on table public.teacher_feedback is
  'Append-only log of teacher review submissions. One row per review. '
  'Admins triage via /admin/teacher-feedback.';

-- ── Indexes ───────────────────────────────────────────────────────────
-- Partial index on the open queue is the only hot read path admins hit.
create index if not exists teacher_feedback_status_idx
  on public.teacher_feedback (status)
  where status = 'open';

create index if not exists teacher_feedback_content_idx
  on public.teacher_feedback (content_type, content_id);

create index if not exists teacher_feedback_reviewer_idx
  on public.teacher_feedback (reviewer_id);

create index if not exists content_review_status_state_idx
  on public.content_review_status (status)
  where status in ('in_review', 'needs_revision');

-- ── RLS ───────────────────────────────────────────────────────────────
alter table public.content_review_status enable row level security;
alter table public.teacher_feedback enable row level security;

-- ── content_review_status policies ────────────────────────────────────

-- Teacher (level >= 5) can SELECT only items currently in queue or
-- waiting on a revision. They never see fully-approved or rejected
-- rows — those are admin business.
drop policy if exists "teacher_select_review_queue" on public.content_review_status;
create policy "teacher_select_review_queue"
  on public.content_review_status
  for select
  using (
    public.get_admin_level() >= 5
    and status in ('in_review', 'needs_revision')
  );

-- Teacher (level >= 5) can UPDATE the same in-queue rows. The shape
-- of the update — flipping to approved/needs_revision/rejected — is
-- the application's job; RLS only gates row visibility.
drop policy if exists "teacher_update_review_status" on public.content_review_status;
create policy "teacher_update_review_status"
  on public.content_review_status
  for update
  using (
    public.get_admin_level() >= 5
    and status in ('in_review', 'needs_revision')
  )
  with check (public.get_admin_level() >= 5);

-- Admin (level >= 9) full access. Used to mark items for review (INSERT
-- via UPSERT path) and to override any state.
drop policy if exists "admin_all_review_status" on public.content_review_status;
create policy "admin_all_review_status"
  on public.content_review_status
  for all
  using (public.get_admin_level() >= 9)
  with check (public.get_admin_level() >= 9);

-- ── teacher_feedback policies ─────────────────────────────────────────

-- Teacher (level >= 5) can INSERT their own feedback row. The reviewer_id
-- check prevents one teacher from forging another's review.
drop policy if exists "teacher_insert_feedback" on public.teacher_feedback;
create policy "teacher_insert_feedback"
  on public.teacher_feedback
  for insert
  with check (
    public.get_admin_level() >= 5
    and reviewer_id = auth.uid()
  );

-- Teacher (level >= 5) can SELECT only their own past reviews. They
-- never see other teachers' feedback (privacy + simplicity).
drop policy if exists "teacher_select_own_feedback" on public.teacher_feedback;
create policy "teacher_select_own_feedback"
  on public.teacher_feedback
  for select
  using (
    public.get_admin_level() >= 5
    and reviewer_id = auth.uid()
  );

-- Admin (level >= 9) full access for triage.
drop policy if exists "admin_all_feedback" on public.teacher_feedback;
create policy "admin_all_feedback"
  on public.teacher_feedback
  for all
  using (public.get_admin_level() >= 9)
  with check (public.get_admin_level() >= 9);

-- ── Grants ────────────────────────────────────────────────────────────
grant select, update on public.content_review_status to authenticated;
grant select, insert on public.teacher_feedback to authenticated;
