# AI Tutor — Provider Unlock Checklist (Stage 3E)

## Preconditions

All must be confirmed before setting `REAL_PROVIDER_ENABLED=true`:

- [ ] Stage 2: JWT auth gate merged and deployed
- [ ] Stage 3A: operator role in ALLOWED_ROLES
- [ ] Stage 3B: admin role in ALLOWED_ROLES
- [ ] Stage 3C: learner-data safety gate merged and active
- [ ] Stage 3D: cost/kill-switch controls merged and active
- [ ] `DEEPSEEK_API_KEY` set in Supabase secrets
- [ ] `TUTOR_SMOKE_TOKEN` set in Supabase secrets
- [ ] `REAL_PROVIDER_ENABLED` is `"false"` (or unset)
- [ ] Rollback plan rehearsed
- [ ] Operator on-call

## Unlock Procedure

### 1. Pre-flight check (local)

```bash
# Verify all gates are active with env=false
curl -X POST https://<project>.supabase.co/functions/v1/ai-tutor \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <valid-jwt>" \
  -d '{"mode":"sentence_correction","userPrompt":"test"}'
# Expected: HTTP 503, errorKind: "service_disabled"
```

### 2. Set REAL_PROVIDER_ENABLED=true

```
supabase secrets set REAL_PROVIDER_ENABLED=true --project-ref <ref>
```

### 3. Deploy edge function

```
supabase functions deploy ai-tutor --project-ref <ref>
```

### 4. One synthetic smoke

```bash
curl -X POST https://<project>.supabase.co/functions/v1/ai-tutor \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <valid-operator-jwt>" \
  -H "x-tutor-smoke-token: <TUTOR_SMOKE_TOKEN>" \
  -d '{"mode":"sentence_correction","userPrompt":"She go to school every day"}'
# Expected: HTTP 200, ok: true, corrected sentence returned
```

### 5. Collect evidence

- [ ] HTTP status: 200
- [ ] `ok`: true
- [ ] `content` contains corrected sentence
- [ ] `usage` fields present (prompt/completion/total)
- [ ] No PII in response
- [ ] No raw provider error text

### 6. Re-block immediately

```
supabase secrets set REAL_PROVIDER_ENABLED=false --project-ref <ref>
supabase functions deploy ai-tutor --project-ref <ref>
```

### 7. Verify re-block

```bash
# Same request should now fail
curl -X POST https://<project>.supabase.co/functions/v1/ai-tutor \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <valid-operator-jwt>" \
  -H "x-tutor-smoke-token: <TUTOR_SMOKE_TOKEN>" \
  -d '{"mode":"sentence_correction","userPrompt":"test"}'
# Expected: HTTP 503, errorKind: "service_disabled"
```

## Rollback (emergency)

```
supabase secrets set REAL_PROVIDER_ENABLED=false --project-ref <ref>
supabase functions deploy ai-tutor --project-ref <ref>
# Verify 503 restored
```

## Blockers That Remain After Unlock

- No learner/student text unless separately authorized
- No UI exposure unless separately authorized
- No production traffic unless separately authorized
- No paid_tier/authenticated roles unless separately authorized
- Placement V5 coupling is read-only only; raw answers, score mutation, and tutor writeback remain blocked
