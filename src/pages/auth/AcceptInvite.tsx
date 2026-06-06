// src/pages/auth/AcceptInvite.tsx
//
// /invite/:invite_token — public landing page for an invitee.
// Shows the personalised welcome from the inviter, marks the invite
// as 'clicked' on mount, and sends the user to /signin (or /auth/save-progress)
// so they can complete signup. The 14-day trial bonus is applied
// server-side via mark_family_invite_signed_up() once the recipient
// authenticates.

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { supabase } from "@/lib/supabaseClient";
import {
  type FamilyInviteRelationship,
  type FamilyInviteTemplateKey,
  recipientAddressVi,
} from "@/lib/referral/familyInviteCopy";

interface InvitationRow {
  inviter_user_id: string;
  recipient_name: string | null;
  template_key: FamilyInviteTemplateKey;
  custom_message: string | null;
  relationship: FamilyInviteRelationship | null;
  trial_bonus_days: number;
  expires_at: string;
  status: string;
}

interface InviterRow {
  preferred_name: string | null;
  full_name: string | null;
}

export default function AcceptInvite(): React.ReactElement {
  const { token = "" } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<
    | { kind: "loading" }
    | { kind: "expired" }
    | { kind: "not_found" }
    | { kind: "ok"; invite: InvitationRow; inviter: InviterRow }
  >({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!token || !/^[2-9A-HJ-NP-Z]{12}$/.test(token)) {
        if (!cancelled) setState({ kind: "not_found" });
        return;
      }
      const { data, error } = await supabase
        .rpc("get_family_invitation_by_token", { p_token: token })
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        setState({ kind: "not_found" });
        return;
      }
      const invite = data as InvitationRow;
      if (Date.parse(invite.expires_at) <= Date.now()) {
        setState({ kind: "expired" });
        return;
      }
      // Look up the inviter's display name (RLS allows a single lookup;
      // if the policy denies it, we fall back to a generic greeting).
      const { data: inviterData } = await supabase
        .from("profiles")
        .select("preferred_name, full_name")
        .eq("id", invite.inviter_user_id)
        .maybeSingle();
      const inviter = (inviterData ?? null) as InviterRow | null;

      // Mark as clicked (idempotent SECURITY DEFINER RPC).
      void supabase.rpc("mark_family_invite_clicked", { p_token: token });

      setState({
        kind: "ok",
        invite,
        inviter: inviter ?? { preferred_name: null, full_name: null },
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (state.kind === "loading") {
    return (
      <main className="px-4 py-12 max-w-md mx-auto text-sm text-black/55">
        Đang tải / Loading…
      </main>
    );
  }
  if (state.kind === "expired") {
    return (
      <main className="px-4 py-12 max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-2">Lời mời đã hết hạn</h1>
        <p className="text-xs italic text-black/55 mb-4">This invitation has expired</p>
        <p className="text-sm text-black/75 mb-6">
          Bạn vẫn có thể đăng ký miễn phí ở MercyBlade.
        </p>
        <button
          onClick={() => navigate("/signin")}
          className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold"
        >
          Tạo tài khoản miễn phí / Sign up free
        </button>
      </main>
    );
  }
  if (state.kind === "not_found") {
    return (
      <main className="px-4 py-12 max-w-md mx-auto text-center">
        <h1 className="text-xl font-bold mb-2">Không tìm thấy lời mời</h1>
        <p className="text-xs italic text-black/55 mb-4">Invitation not found</p>
        <Link to="/" className="text-emerald-700 underline text-sm">
          Về trang chủ / Home
        </Link>
      </main>
    );
  }

  const inviterName =
    state.inviter.preferred_name ??
    state.inviter.full_name ??
    "MercyBlade";
  const recipientGreeting =
    state.invite.recipient_name ?? recipientAddressVi(state.invite.relationship);
  const trialDays = 3 + state.invite.trial_bonus_days;

  const handleSignUp = () => {
    // Stash the token so the post-signup hook can call
    // mark_family_invite_signed_up() once the new user_id is known.
    try {
      sessionStorage.setItem("mb:family-invite-token", token);
    } catch {
      // ignore
    }
    navigate(`/signin?next=/invite/${token}/welcome`);
  };

  return (
    <main className="px-4 py-8 max-w-md mx-auto">
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 mb-4">
        <p className="text-sm text-emerald-900 font-semibold">
          {inviterName} mời {recipientGreeting} thử MercyBlade
        </p>
        <p className="text-xs italic text-emerald-800/80 mt-1">
          {inviterName} invited you to learn English with MercyBlade
        </p>
      </section>

      {state.invite.custom_message ? (
        <blockquote className="rounded-md border border-black/10 bg-white p-4 mb-4 text-sm italic">
          "{state.invite.custom_message}"
        </blockquote>
      ) : null}

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-5 text-sm">
        <p className="font-semibold text-amber-900">
          🎁 Quà từ {inviterName}: {trialDays} ngày dùng miễn phí
        </p>
        <p className="text-xs italic text-amber-800/80 mt-1">
          Gift from {inviterName}: {trialDays}-day free trial
        </p>
      </section>

      <button
        onClick={handleSignUp}
        className="w-full px-5 py-3 rounded-lg bg-emerald-600 text-white text-sm font-semibold"
      >
        Bắt đầu — Tạo tài khoản miễn phí / Get started — sign up free
      </button>

      <p className="mt-3 text-xs text-center text-black/50">
        Đã có tài khoản? <Link to="/signin" className="underline">Đăng nhập</Link>
      </p>
    </main>
  );
}
