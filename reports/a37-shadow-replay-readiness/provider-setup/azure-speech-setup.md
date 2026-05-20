# Azure Speech Setup Runbook

Purpose: clear the Azure speech/scoring blocker for future speaking shadow replay validation.

## Required Env Vars

- `AZURE_SPEECH_KEY`
- `AZURE_SPEECH_REGION`

## Where To Obtain Them

1. Open the approved Azure subscription.
2. Create or select the Speech resource used by MercyBlade.
3. Copy a Speech key and region from the resource key page.
4. Store them only in local shell, `.env.local`, CI secret storage, or Supabase function secrets.

## Minimal Permissions

- Speech service key for pronunciation/speech assessment calls.
- No Azure subscription owner/admin key should be used for runtime validation.

## Local Setup Checklist

- [ ] Speech resource exists in the expected Azure region.
- [ ] Shell exports `AZURE_SPEECH_KEY`.
- [ ] Shell exports `AZURE_SPEECH_REGION`.
- [ ] Key/region are not committed or pasted into logs.

## Local Verification Commands

```bash
test -n "${AZURE_SPEECH_KEY:-}" && echo "AZURE_SPEECH_KEY=set" || echo "AZURE_SPEECH_KEY=missing"
test -n "${AZURE_SPEECH_REGION:-}" && echo "AZURE_SPEECH_REGION=set" || echo "AZURE_SPEECH_REGION=missing"
```

Expected success output:

```text
AZURE_SPEECH_KEY=set
AZURE_SPEECH_REGION=set
```

Token endpoint smoke:

```bash
curl -sS -X POST "https://${AZURE_SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken" \
  -H "Ocp-Apim-Subscription-Key: ${AZURE_SPEECH_KEY}" \
  | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(d.length > 100 ? 'azure=token-ok' : 'azure=unexpected'))"
```

Expected success output:

```text
azure=token-ok
```

## Common Failure Modes

- `AZURE_SPEECH_KEY=missing`: key not exported.
- `AZURE_SPEECH_REGION=missing`: region not exported.
- `401`: invalid key or wrong resource.
- `404`: wrong region endpoint.
- Very short response body: token was not issued.
- Network timeout: outbound HTTPS blocked.

## Rollback / Revocation Steps

```bash
unset AZURE_SPEECH_KEY AZURE_SPEECH_REGION
echo "AZURE_SPEECH_KEY=${AZURE_SPEECH_KEY:-unset}"
echo "AZURE_SPEECH_REGION=${AZURE_SPEECH_REGION:-unset}"
```

Expected output:

```text
AZURE_SPEECH_KEY=unset
AZURE_SPEECH_REGION=unset
```

Then regenerate/revoke the Speech key in Azure if it was exposed.
