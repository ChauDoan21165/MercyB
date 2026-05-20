# Gemini Setup Runbook

Purpose: clear the Gemini provider/failover blocker for future A37 shadow replay validation.

## Required Env Vars

- `GEMINI_API_KEY`
- Optional: `GEMINI_MODEL`, if the placement grader is configured to override the default model.

## Where To Obtain Them

1. Open Google AI Studio or the approved Google Cloud project.
2. Create an API key scoped to Gemini model access.
3. Restrict the key where possible by project/API.
4. Store it only in local shell, `.env.local`, CI secret storage, or Supabase function secrets.

## Minimal Permissions

- Gemini text generation access.
- No broad Google Cloud admin permissions are required.
- If using Google Cloud restrictions, allow the Generative Language API used by `_shared/aiProvider.ts`.

## Local Setup Checklist

- [ ] Key created in the intended Google project.
- [ ] Generative Language/Gemini API enabled.
- [ ] Shell exports `GEMINI_API_KEY`.
- [ ] Key is absent from git-tracked files and screenshots.

## Local Verification Commands

```bash
test -n "${GEMINI_API_KEY:-}" && echo "GEMINI_API_KEY=set" || echo "GEMINI_API_KEY=missing"
```

Expected success output:

```text
GEMINI_API_KEY=set
```

Minimal API smoke:

```bash
curl -sS "https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}" \
  | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const j=JSON.parse(d); console.log(Array.isArray(j.models) ? 'gemini=models-ok' : 'gemini=unexpected');})"
```

Expected success output:

```text
gemini=models-ok
```

## Common Failure Modes

- `GEMINI_API_KEY=missing`: key not exported.
- `API key not valid`: wrong key or revoked key.
- `PERMISSION_DENIED`: API not enabled or key restricted too tightly.
- `RESOURCE_EXHAUSTED`: quota/rate limit.
- Empty model list: project lacks Gemini access.

## Rollback / Revocation Steps

```bash
unset GEMINI_API_KEY
echo "GEMINI_API_KEY=${GEMINI_API_KEY:-unset}"
```

Expected output:

```text
GEMINI_API_KEY=unset
```

Then revoke or restrict the key in Google AI Studio/Cloud Console and rotate any runtime secret using it.
