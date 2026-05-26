# Placement V3 Forensics Live Validation Checklist

Use this checklist before marking PR #953 ready or enabling production rollout.

- [ ] Provider key present: `OPENAI_API_KEY` or `GEMINI_API_KEY`.
- [ ] Supabase runtime env present: `SUPABASE_URL`.
- [ ] Supabase service env present: `SUPABASE_SERVICE_ROLE_KEY`.
- [ ] Browser env present: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- [ ] Migration reviewed and applied.
- [ ] `placement_v3_forensic_events` table exists.
- [ ] `placement_v3_failure_timelines` table exists.
- [ ] `placement_v3_runtime_alerts` table exists.
- [ ] One real Placement V3 session was started.
- [ ] Correlation ID visible in forensic rows.
- [ ] `provider_event` logged from a real grader/provider path.
- [ ] `latency_event` logged for grader/provider timing.
- [ ] `orchestration_transition` logged.
- [ ] Controlled degraded-path test logs `degraded_result`.
- [ ] Dashboard reads persisted forensic rows, not fixture data.
- [ ] No service role key, provider key, bearer token, refresh token, or email appears in forensic rows.
- [ ] Remaining blocker language stays in PR/docs until all live checks pass.
