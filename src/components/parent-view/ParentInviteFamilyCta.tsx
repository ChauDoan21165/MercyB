import { Link } from "react-router-dom";

import { Bilingual } from "@/components/Bilingual";

/**
 * L6 — closes the family-bridge loop from the parent surface. Links to the
 * existing (functional) bulk-invite page so a parent can CREATE + send an
 * invite; the recipient's accept is wired in AuthProvider (mark_family_invite_
 * signed_up) and grants the trial bonus. Rendered only inside ParentView's
 * entitled (post-paywall) view, so it shows only to a parent who can invite.
 */
export function ParentInviteFamilyCta() {
  return (
    <Link
      to="/referral/invite-family"
      data-testid="parent-invite-family"
      aria-label="Mời gia đình thử MercyBlade / Invite family"
      className="block rounded-[20px] border border-emerald-200/80 bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700 shadow-[0_10px_28px_rgba(15,23,42,0.04)]"
    >
      <Bilingual
        primary="vi"
        vi="Mời gia đình"
        en="Invite family"
        viClassName="text-sm font-semibold text-emerald-700"
        enClassName="text-[12px] text-slate-600"
      />
    </Link>
  );
}
