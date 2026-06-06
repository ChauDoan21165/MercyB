# Family Invitations PII Apply Runbook

## Emergency Mitigation

If the CEO chooses to stop the anonymous table-read leak immediately, Chau can run this single statement:

```sql
REVOKE SELECT ON public.family_invitations FROM anon;
```

Impact: this deliberately breaks the anonymous `/invite/:token` `AcceptInvite` page until the RPC migration is applied and the app switches that page from direct table SELECT to `get_family_invitation_by_token`.

## Proper Fix Order

1. Apply `20260709000000_family_invitations_token_lookup_rpc.sql`.
   - Additive and safe at any time.
   - Creates `public.get_family_invitation_by_token(text)` as a `SECURITY DEFINER` RPC.
   - Returns only the token-matched display row.
   - Does not return `recipient_email`, `recipient_phone`, or `invite_token`.
   - Grants execute to `anon` and `authenticated`; revokes from `PUBLIC`.

2. Ship the app client switch owned by the `AcceptInvite` lane.
   - Replace the direct `from("family_invitations").select(...).eq("invite_token", token)` read in `src/pages/auth/AcceptInvite.tsx`.
   - Use `rpc("get_family_invitation_by_token", { p_token: token })`.
   - Verify `/invite/:token` works anonymously before tightening table access.

3. Apply `20260710000000_family_invitations_tighten_anon_select.sql` only after step 2 is live and verified.
   - Drops `family_invitations_recipient_by_token`.
   - Recreates owner SELECT as `TO authenticated`.
   - Revokes `SELECT` on `public.family_invitations` from `anon`.
   - Grants `SELECT` to `authenticated` for inviter-owned dashboard reads.

Do not apply step 3 before the client switch unless the accepted product decision is to break anonymous invite landing pages to stop the PII leak immediately.
