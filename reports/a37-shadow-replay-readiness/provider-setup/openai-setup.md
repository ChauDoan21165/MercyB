# OpenAI Setup Runbook

Purpose: clear the OpenAI provider blocker for future A37 shadow replay validation.

## Required Env Vars

- `OPENAI_API_KEY`
- Optional: `OPENAI_MODEL`, if the placement grader is configured to override the default model.

## Where To Obtain Them

1. Open the OpenAI dashboard.
2. Create or select the MercyBlade project.
3. Create a project-scoped API key for local validation.
4. Store the key only in local shell, `.env.local`, CI secret storage, or Supabase function secrets.

Do not paste the key into docs, issue comments, PRs, screenshots, or terminal logs.

## Minimal Permissions

- Text generation access for the model used by `_shared/aiProvider.ts`.
- Billing/quota sufficient for repeated placement grading calls.
- No admin/project-management permissions are required for the runtime key.

## Local Setup Checklist

- [ ] Key created in the correct OpenAI project.
- [ ] Key has model access.
- [ ] Key is stored in a local secret location.
- [ ] Shell exports `OPENAI_API_KEY`.
- [ ] No key value appears in git-tracked files.

## Local Verification Commands

```bash
test -n "${OPENAI_API_KEY:-}" && echo "OPENAI_API_KEY=set" || echo "OPENAI_API_KEY=missing"
```

Expected success output:

```text
OPENAI_API_KEY=set
```

Minimal API smoke:

```bash
curl -sS https://api.openai.com/v1/models \
  -H "Authorization: Bearer ${OPENAI_API_KEY}" \
  | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const j=JSON.parse(d); console.log(Array.isArray(j.data) ? 'openai=models-ok' : 'openai=unexpected');})"
```

Expected success output:

```text
openai=models-ok
```

## Common Failure Modes

- `OPENAI_API_KEY=missing`: key not exported in the current shell.
- `401 Unauthorized`: key is invalid, revoked, copied incorrectly, or from the wrong project.
- `429`: quota, rate limit, or billing issue.
- `model_not_found`: configured model is unavailable to the project.
- TLS/network errors: local network blocks outbound HTTPS.

## Rollback / Revocation Steps

```bash
unset OPENAI_API_KEY
echo "OPENAI_API_KEY=${OPENAI_API_KEY:-unset}"
```

Expected output:

```text
OPENAI_API_KEY=unset
```

Then revoke the key in the OpenAI dashboard and rotate any Supabase/CI secret that used it.
