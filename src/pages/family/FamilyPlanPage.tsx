// Family plan page — /family.
//
// Three states driven by getMyFamilyMembership:
//   1. owner    → show plan card + invite form + member list with remove
//   2. member   → show plan card + leave button
//   3. nothing  → show "Create plan" CTA + "Have an invite code?" form
//
// Stripe checkout for the family plan SKU is daytime work; the "Create
// plan" CTA here creates the bare DB row so the rest of the plumbing can
// be tested. A real launch will route through Stripe before this insert.

import React, { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/providers/AuthProvider";
import {
  createFamilyPlan,
  getMyFamilyMembership,
  listMembers,
  deactivateOwnPlan,
  removeMember,
  type FamilyMember,
  type FamilyMembership,
} from "@/lib/family/familyPlanClient";

import FamilyPlanCard from "@/components/family/FamilyPlanCard";
import InviteFamilyMemberForm from "@/components/family/InviteFamilyMemberForm";
import JoinFamilyForm from "@/components/family/JoinFamilyForm";
import LeaveFamilyButton from "@/components/family/LeaveFamilyButton";

export default function FamilyPlanPage() {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [membership, setMembership] = useState<FamilyMembership>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const refresh = useCallback(async () => {
    if (!userId) {
      setMembership(null);
      setMembers([]);
      return;
    }
    const m = await getMyFamilyMembership(userId);
    setMembership(m);
    if (m) {
      const planId =
        m.role === "owner" ? m.plan.id : m.familyPlanId;
      setMembers(await listMembers(planId));
    } else {
      setMembers([]);
    }
  }, [userId]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    refresh().finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const onCreatePlan = async () => {
    if (!userId || creating) return;
    setCreating(true);
    const plan = await createFamilyPlan(userId, 5);
    setCreating(false);
    if (plan) await refresh();
  };

  const onRemoveMember = async (memberId: string) => {
    if (!membership || membership.role !== "owner") return;
    const ok = await removeMember(membership.plan.id, memberId);
    if (ok) await refresh();
  };

  const onDeactivate = async () => {
    if (!membership || membership.role !== "owner") return;
    const ok = await deactivateOwnPlan(membership.plan.id);
    if (ok) await refresh();
  };

  if (!userId) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px" }}>
        <p style={{ fontSize: 14, color: "rgba(0,0,0,0.6)" }}>
          Please sign in to manage your family plan.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px 80px" }}>
      <header style={{ marginBottom: 18 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 950,
            letterSpacing: -0.5,
            color: "rgba(15,23,42,0.94)",
          }}
        >
          Family plan
        </h1>
        <div
          style={{
            marginTop: 2,
            fontSize: 13,
            fontWeight: 700,
            color: "rgba(16,185,129,0.80)",
          }}
        >
          Gói gia đình
        </div>
        <p
          style={{
            marginTop: 8,
            fontSize: 14,
            lineHeight: 1.5,
            color: "rgba(0,0,0,0.65)",
          }}
        >
          One paying owner, up to 5 family members get full access.
        </p>
        <p
          style={{
            marginTop: 2,
            fontSize: 12,
            color: "rgba(0,0,0,0.45)",
          }}
        >
          Một người trả tiền, tối đa 5 thành viên gia đình được quyền truy cập đầy đủ.
        </p>
      </header>

      {loading ? (
        <div style={{ padding: 24, color: "rgba(0,0,0,0.5)" }}>Loading…</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <FamilyPlanCard
            membership={membership}
            members={members}
            currentUserId={userId}
            onRemoveMember={
              membership?.role === "owner" ? onRemoveMember : undefined
            }
          />

          {membership?.role === "owner" && (
            <>
              <InviteFamilyMemberForm
                familyPlanId={membership.plan.id}
                onInvited={() => {
                  /* The invite has its own copy/share UI inside the form. */
                }}
              />
              <div>
                <button
                  type="button"
                  onClick={onDeactivate}
                  className="text-[12px] font-bold text-red-600 underline hover:text-red-700"
                >
                  Cancel my plan · Huỷ gói
                </button>
              </div>
            </>
          )}

          {membership?.role === "member" && (
            <LeaveFamilyButton userId={userId} onLeft={refresh} />
          )}

          {!membership && (
            <>
              <div className="rounded-[18px] border border-emerald-200/70 bg-white p-4">
                <h3 className="text-[15px] font-black text-emerald-900">
                  Start a family plan
                </h3>
                <div className="text-[12px] font-semibold text-emerald-700/70">
                  Tạo gói gia đình
                </div>
                <p className="mt-2 text-[13px] leading-snug text-slate-600">
                  Cover up to 5 family members under one subscription.
                  Stripe billing will be wired before launch.
                </p>
                <button
                  type="button"
                  onClick={onCreatePlan}
                  disabled={creating}
                  className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-black text-white shadow-[0_6px_18px_rgba(16,185,129,0.25)] hover:bg-emerald-600 disabled:opacity-60"
                >
                  {creating ? "Creating…" : "Create family plan · Tạo gói"}
                </button>
              </div>
              <JoinFamilyForm userId={userId} onJoined={refresh} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
