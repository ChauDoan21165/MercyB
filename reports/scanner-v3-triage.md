# Scanner v3 Triage — C3.3

Date: 2026-07-11
Base: `origin/main` / local `main` at `3192c6ad677409f1ee1a9bca0bb25fffdbd18892`

Scope: report-only triage for the two large v3 scanner classes. No fixes are included in this item.

## V3-network-call-no-timeout

Scanner count: 129 callsites.

Buckets:

| Bucket | Count | Notes |
| --- | ---: | --- |
| Learner-facing runtime path | 94 | Calls reachable from learner API, guide, AI tutor, speech, placement, room, gift, referral, account, payment, and learner-facing edge functions. |
| Admin/internal path | 27 | Admin panels, admin stats/billing, security alert tooling, email infrastructure, uptime/sync/stripe internals. |
| Scripts/CI/dev-only | 8 | Scanner text/comment false positives in docs/comments or provider commentary. Accepted as scanner noise unless the scanner is tightened later. |

Learner-facing top 10 by blast radius:

| Rank | Callsite | Learner blast radius if it hangs/fails |
| ---: | --- | --- |
| 1 | `supabase/functions/ai-chat/index.ts:502` | Speech transcription can hang until platform timeout; learner sees speaking analysis stall or fail after recording. |
| 2 | `api/_lib/aiConversation.ts:425` | AI conversation turn can hang; learner waits on the core tutor response and may see a 502/blank result. |
| 3 | `api/_lib/aiProvider.ts:149` | Shared OpenAI provider path can hang across multiple AI flows. |
| 4 | `supabase/functions/_shared/aiProvider.ts:216` | Edge shared OpenAI provider can hang any Supabase function using it. |
| 5 | `supabase/functions/_shared/aiProvider.ts:299` | Edge shared DeepSeek provider can hang alternate-model tutor flows. |
| 6 | `src/pages/AiTutor.tsx:361` | Browser AI tutor API request can leave the learner waiting with no bounded failure. |
| 7 | `src/pages/AiTutor.tsx:431` | Follow-up AI tutor API request has the same learner-visible waiting failure. |
| 8 | `src/components/mercy-guide/mercyGuideClient.ts:184` | Mercy Guide question flow can hang instead of returning a controlled “try again” state. |
| 9 | `src/components/roleplay/RoleplaySession.tsx:250` | Roleplay TTS generation can block the session audio loop. |
| 10 | `src/lib/speech/transcribeAudio.ts:79` | Client speech transcription upload can hang after a learner records audio. |

Recommended fix workpack:

- Create a bounded-network helper for learner-facing API/function calls, then apply it first to AI tutor/conversation, Mercy Guide, speech STT/TTS, and roleplay audio paths.
- Explicitly exclude billing, entitlement, auth, and account/security callsites from the first fix workpack unless the owner grants scope, because those surfaces are forbidden in this queue.

Accepted as-is for now:

- Admin/internal bucket: lower learner exposure; defer until owner chooses an internal reliability pass.
- Scripts/CI/dev-only bucket: scanner text/comment false positives; accept as-is unless scanner precision work is requested.

## V3-api-env-read-no-missing-handling

Scanner count: 110 callsites.

Buckets:

| Bucket | Count | Notes |
| --- | ---: | --- |
| Learner-facing runtime path | 51 | AI provider, AI chat, guide, placement/match generation, room chat/cache, public API, redemption, moderation, bank transfer, and payment screenshot functions. |
| Admin/internal path | 59 | Audit/rate-limit telemetry helpers, admin billing/list/stats, digest/email automation, room health, internal notifications, metrics, and admin audio generation. |
| Scripts/CI/dev-only | 0 | No script/CI-only env findings in this v3 class. |

Learner-facing top 10 by blast radius:

| Rank | Callsite | Learner blast radius if missing env is unhandled |
| ---: | --- | --- |
| 1 | `supabase/functions/ai-chat/index.ts:56` | Missing Supabase URL can crash the streaming chat function before any learner response. |
| 2 | `supabase/functions/ai-chat/index.ts:58` | Missing service role key can crash chat entitlement/history work and surface as failed tutor chat. |
| 3 | `api/mercy-ai.ts:30` | Missing OpenAI key can fail the main AI API at module/init time instead of returning a controlled unavailable state. |
| 4 | `api/_lib/aiProvider.ts:130` | Shared OpenAI provider can fail all caller flows using that provider. |
| 5 | `supabase/functions/_shared/aiProvider.ts:204` | Edge shared OpenAI provider can fail AI functions without a learner-safe error. |
| 6 | `supabase/functions/_shared/aiProvider.ts:286` | Edge shared DeepSeek provider can fail alternate-model flows without a learner-safe error. |
| 7 | `supabase/functions/guide-assistant/index.ts:354` | Guide assistant can crash before answering learner help requests. |
| 8 | `supabase/functions/guide-english-helper/index.ts:89` | English helper function can fail before learner-facing guide assistance. |
| 9 | `supabase/functions/room-chat/index.ts:199` | Room chat moderation handoff can fail in learner chat instead of degrading cleanly. |
| 10 | `supabase/functions/generate-matches/index.ts:100` | Placement/match generation can fail without a controlled learner error. |

Recommended fix workpack:

- Add a small required-env helper for learner-facing Supabase functions/API modules and convert AI chat/provider, Mercy Guide/helper, room chat/moderation, and placement/match generation first.
- Keep payment/billing/entitlement/auth-adjacent entries out of the first fix workpack under the current forbidden-surface rules.

Accepted as-is for now:

- Admin/internal bucket: defer; these are operational/admin reliability concerns rather than the first learner-exposure pass.
- Optional capability checks such as `Boolean(...GEMINI_API_KEY)` should be accepted as-is only when the callsite is purely feature detection and not used as a required secret later in the same request.

## Premise For WP-DIST-01

Located diagnostic/interference profile surfaces on `origin/main`:

| Surface | File | Role |
| --- | --- | --- |
| `/weak-at` route | `src/router/AppRouter.tsx:1109` | Existing share/read route for the learner’s local weakness/interference view. |
| Page shell | `src/pages/WeakAt.tsx` | Renders the profile page title, local-only source note, `LocalWeaknessMap`, and `SuggestedPracticeList`. |
| Profile renderer | `src/components/stage-3a/LocalWeaknessMap.tsx` | Renders L1 grammar patterns, placement weaknesses, and pronunciation pain points from local aggregate data. |
| Suggested practice renderer | `src/components/stage-3b/SuggestedPracticeList.tsx` | Renders learner next-step suggestions from the same aggregate. |
| Placement result mirror | `src/pages/placement/v3/ResultsPage.tsx` | Records placement snapshot locally for `/weak-at`; placement result page itself is shareable by session route, but the interference profile currently renders on `/weak-at`. |

Finding: no separate named “Interference Profile” result page exists on `origin/main`. The current profile renders at `/weak-at`, backed by local Stage 3A aggregate data.

## WP-DIST-01 Outcome

Implementation branch: `hardening/diagnostic-contact-capture`

Files changed:

| File | Purpose |
| --- | --- |
| `src/pages/WeakAt.tsx` | Wraps the full profile in a contact gate only when `VITE_DIAGNOSTIC_CONTACT_GATE=true`; default is off. |
| `src/components/diagnostic/DiagnosticContactGate.tsx` | Teaser + email/Zalo capture form; reveals full profile after successful insert. |
| `src/lib/diagnosticLeads.ts` | Contact parsing, flag read, and anon insert into `diagnostic_leads`. |
| `src/pages/__tests__/WeakAt.test.tsx` | Pins default-off behavior, gated teaser behavior, and successful insert/unlock. |
| `src/lib/__tests__/diagnosticLeads.test.ts` | Pins email/Zalo contact classification and invalid-contact rejection. |

Learner/deployed-app result tomorrow:

- With the flag off, `/weak-at` behaves exactly as before.
- With `VITE_DIAGNOSTIC_CONTACT_GATE=true`, learners see a teaser first, enter email or Zalo, then get the full Interference Profile. The contact is inserted as a lead; this is not an auth/account flow.

Database SQL output only — owner applies:

```sql
create table if not exists public.diagnostic_leads (
  id uuid primary key default gen_random_uuid(),
  contact text not null,
  contact_type text not null check (contact_type in ('email', 'zalo')),
  profile_ref text,
  created_at timestamptz not null default now()
);

alter table public.diagnostic_leads enable row level security;

create policy diagnostic_leads_insert_anon_allowed
  on public.diagnostic_leads
  for insert
  to anon
  with check (
    contact is not null
    and contact_type in ('email', 'zalo')
  );

-- No select policy is defined. Service-role clients bypass RLS for lead review/export.
-- Rate limiting consideration: keep this behind VITE_DIAGNOSTIC_CONTACT_GATE until
-- edge/WAF or RPC-side throttling is configured by IP/contact fingerprint.
```

Local gates:

- `npx vitest run src/pages/__tests__/WeakAt.test.tsx src/lib/__tests__/diagnosticLeads.test.ts` — passed.
- `NODE_OPTIONS=--max-old-space-size=6144 ./node_modules/.bin/tsc --noEmit` — passed.
- `npm run lint` — passed.
- `npm run build` — passed.

Memory discipline: gates ran sequentially; no exit 137.
