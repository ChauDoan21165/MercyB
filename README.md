# Room Analysis Scripts

## Generate Cross-Topic Recommendations

This script analyzes all 62 room files and automatically generates intelligent cross-room keyword mappings.

### What it does:
1. **Extracts keywords** from all room JSON files
2. **Finds overlaps** - discovers which keywords appear across multiple rooms
3. **Builds relationships** - creates a map showing related rooms for each keyword
4. **Generates recommendations** - outputs `cross_topic_recommendations.json` with smart room suggestions

### How to run:

```bash
# Using tsx (recommended)
npx tsx scripts/generate-cross-topic-recommendations.ts

# Or using node with TypeScript support
node --loader ts-node/esm scripts/generate-cross-topic-recommendations.ts
```

### Output:
- File: `src/data/system/cross_topic_recommendations.json`
- Contains: Keyword → Related Rooms mapping
- Used by: `keywordResponder.ts` to suggest related rooms to users

### Example output:
```json
{
  "keyword": "stress",
  "rooms": [
    {
      "roomId": "mental-health",
      "roomNameEn": "Mental Health",
      "roomNameVi": "Sức khỏe tâm thần",
      "relevance": "primary",
      "matchedTerms": ["stress", "anxiety", "mental_stress"]
    },
    {
      "roomId": "burnout",
      "roomNameEn": "Burnout",
      "roomNameVi": "Kiệt sức",
      "relevance": "primary",
      "matchedTerms": ["work_stress", "chronic_stress"]
    }
  ]
}
```

## Validate Room Integrity

Checks all room files for data quality and completeness.

```bash
npx tsx scripts/validate-room-integrity.ts
```

### What it checks:
- JSON syntax validity
- Required fields presence
- Bilingual content (EN/VI)
- Keyword completeness
- Entry structure
- Import/export consistency

---

## Apple In-App Purchase (iOS)

iOS builds route subscription purchases through Apple IAP via RevenueCat
per App Store rule 3.1.1. Web and Android continue to use Stripe. The
platform switch lives in `src/screens/Pricing.tsx` (`getPlatform() === "ios"`).

### Environment variables

Full reference with copy-pasteable commands lives in `.env.example`.
Short version:

| Variable | Scope | Where it lives |
|---|---|---|
| `VITE_REVENUECAT_APPLE_API_KEY` | Client (iOS bundle) | `.env.local` for local Xcode builds; production build env (Vercel / CI) for App Store builds |
| `REVENUECAT_WEBHOOK_AUTH_TOKEN` | Server (Supabase Edge) | Supabase secrets (command below) |
| `REVENUECAT_WEBHOOK_DISABLED` | Server (Supabase Edge) | Supabase secrets — optional kill switch |

### Setup commands

```bash
# 1. Client key (iOS only). Not needed on web/Android — web stays on Stripe.
#    Local: create .env.local at the repo root.
echo 'VITE_REVENUECAT_APPLE_API_KEY=appl_xxxxxxxxxxxx' >> .env.local

#    Production iOS build: set the same var in whichever env injects into
#    the Vite build that cap sync copies into ios/App/App/public.

# 2. Webhook shared secret (server only).
#    Generate a token:
openssl rand -hex 32

#    Apply it as a Supabase secret:
npx supabase secrets set REVENUECAT_WEBHOOK_AUTH_TOKEN=<paste-token> \
  --project-ref buemdfxyhxunzpgdoqin

#    Paste the same token into RevenueCat Dashboard →
#    Integrations → Webhook → Authorization header field.
#    (The handler accepts either the raw token or "Bearer <token>".)

# 3. Deploy the webhook edge function:
npx supabase functions deploy revenuecat-webhook \
  --project-ref buemdfxyhxunzpgdoqin

# 4. Optional kill switch (freeze writes without redeploying):
npx supabase secrets set REVENUECAT_WEBHOOK_DISABLED=true \
  --project-ref buemdfxyhxunzpgdoqin

#    Re-enable:
npx supabase secrets unset REVENUECAT_WEBHOOK_DISABLED \
  --project-ref buemdfxyhxunzpgdoqin
```

### Key code locations

- `src/lib/platform.ts` — `getPlatform()` / `isNativePlatform()` wrappers
- `src/lib/iap.ts` — RevenueCat SDK wrapper + product/entitlement constants
- `src/components/pricing/IapPlanCard.tsx` — iOS subscription card
- `src/components/iap/RestorePurchasesButton.tsx` — drop-in restore button (Account page)
- `src/providers/AuthProvider.tsx` — syncs RevenueCat App User ID on sign-in / sign-out
- `supabase/functions/revenuecat-webhook/index.ts` — server-side entitlement writer

### App Store Connect product IDs

The IAP product IDs are hardcoded in `src/lib/iap.ts` and must match App
Store Connect exactly:

- `mercy.premium.monthly`
- `mercy.premium.yearly`

The RevenueCat entitlement identifier is `"MercyBlade Pro"`. If renamed
in the RevenueCat dashboard, update `IAP_ENTITLEMENT_ID` in both
`src/lib/iap.ts` and the webhook handler.
