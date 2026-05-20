# A37 Blocker Status

Date: 2026-05-20

Source blocker list: the parked A37 blocker document was not merged to `origin/main`; it was checked from `origin/feat/a37-shadow-session-replay:docs/placement-v3/shadow-replay/a37-blockers.md` as contextual evidence.

| Blocker | Still true? | Evidence | Command/file checked | Severity | Can proceed without it? | Required Chau action |
|---|---:|---|---|---|---:|---|
| `OPENAI_API_KEY` unavailable | Yes | `env-audit.log` has no matching exported variable | `env \| grep -E 'OPENAI...'` | High | No for real replay | Provide runtime OpenAI key or confirm OpenAI is out of scope |
| `GEMINI_API_KEY` unavailable | Yes | `env-audit.log` has no matching exported variable | `env \| grep -E 'GEMINI...'` | High | No for failover replay | Provide runtime Gemini key or disable Gemini route explicitly |
| Azure speech env unavailable | Yes | `env-audit.log` has no `AZURE_*` variables | `env \| grep -E 'AZURE...'` | High | No for speaking replay | Provide Azure Speech key/region |
| Supabase env unavailable | Yes | `env-audit.log` has no `SUPABASE_*` variables | `env \| grep -E 'SUPABASE...'` | High | No for real persistence/replay | Provide project URL, anon key, service role key in a safe local/runtime channel |
| Placement V3 files were not fully merged | Mostly cleared | #942 is on `origin/main` and core V3 functions/pages/libs exist | `git fetch origin`, file presence checks | Medium | Yes for design audit | Keep #942 on main; ensure later PRs rebase on it |
| Real shadow sessions unavailable | Yes | No shadow capture tables/code or runtime credentials exist | `supabase/functions/placement-v3-session/`, migrations, env audit | High | No | Run credentialed sessions only after capture schema exists |
| Replay artifacts unavailable | Yes | No `raw-runs` artifacts on main and no replay engine | `find docs/placement-v3`, `find scripts` | High | No | Do not claim replay coverage until real artifacts exist |
| Sanitization audit unavailable | Yes | No production sanitization audit exists on main | repo audit | High | No for production capture | Implement and run audit before any real capture export |
| Provider routing cannot be proven | Yes | Provider secrets missing | env audit | High | No | Provide provider credentials and record real calls |
| Token usage capture not proven end-to-end | Yes | Writing endpoint returns provider/model/latency/raw, but replay-grade token usage is not proven in placement session path | `supabase/functions/placement-v3-grade-writing/index.ts`, `_shared/aiProvider.ts` | Medium | No for anti-fabrication evidence | Add capture requirements before implementation |
| Dashboard/admin access not available | Yes | No shadow dashboard exists on main | repo audit | Medium | Yes for pre-implementation report | Build only after schema/privacy plan is approved |
| Required contextual docs absent from main | Yes | Several required-reading paths live only on feature branches | `git ls-tree origin/main`, remote branch checks | Medium | Yes for readiness report | Merge or attach approved docs before implementation restart |
