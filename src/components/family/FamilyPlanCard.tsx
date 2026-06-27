// Read-only card showing the current family plan + members.
//
// Caller passes the loaded membership + member list; this component is
// dumb (no data fetching) so it's easy to test and to embed inside the
// FamilyPlanPage shell.

import React from "react";
import { Users, Crown, UserMinus } from "lucide-react";

import type {
  FamilyMember,
  FamilyMembership,
} from "@/lib/family/familyPlanClient";

const shellBase =
  "w-full rounded-[20px] border border-emerald-200/70 bg-gradient-to-br from-emerald-50 to-white shadow-[0_10px_28px_rgba(16,185,129,0.08)]";

export type FamilyPlanCardProps = {
  membership: FamilyMembership;
  members: FamilyMember[];
  /** Owner-only: receive memberId to remove. */
  onRemoveMember?: (memberId: string) => void;
  /** Mark which member rows should show a "(you)" tag. */
  currentUserId: string | null;
};

export default function FamilyPlanCard({
  membership,
  members,
  onRemoveMember,
  currentUserId,
}: FamilyPlanCardProps) {
  if (!membership) {
    return (
      <div className={shellBase} style={{ padding: "16px 18px" }}>
        <div className="flex items-start gap-3">
          <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-slate-300 to-slate-500">
            <Users className="h-6 w-6 text-white" aria-hidden />
          </div>
          <div>
            <div className="text-[18px] font-black tracking-tight text-slate-800">
              No family plan yet
            </div>
            <div className="mt-0.5 text-[12px] font-semibold text-slate-600/80">
              Bạn chưa có gói gia đình
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = membership.role === "owner";
  const planId =
    membership.role === "owner"
      ? membership.familyPlanId
      : membership.familyPlanId;
  const maxMembers =
    membership.role === "owner" ? membership.plan.maxMembers : 5;

  return (
    <div className={shellBase} style={{ padding: "16px 18px" }}>
      <div className="flex items-start gap-3">
        <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-emerald-400 to-emerald-500 shadow-[0_8px_20px_rgba(16,185,129,0.20)]">
          <Users className="h-6 w-6 text-white" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[18px] font-black tracking-tight text-emerald-900">
            {isOwner ? "Your family plan" : "Family plan"}
          </div>
          <div className="mt-0.5 text-[12px] font-semibold text-emerald-700/70">
            {isOwner ? "Gói gia đình của bạn" : "Gói gia đình"}
          </div>
          <div className="mt-1.5 text-[13px] font-semibold leading-snug text-slate-600">
            {isOwner
              ? `${members.length} of ${maxMembers} seats used.`
              : "Premium covered by the plan owner."}
          </div>
          <div className="mt-0.5 text-[12px] font-medium leading-snug text-slate-500">
            {isOwner
              ? `${members.length}/${maxMembers} chỗ đã dùng.`
              : "Premium được bao phủ bởi chủ gói."}
          </div>
        </div>
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {members.map((m) => {
          const isMe = m.userId === currentUserId;
          const isPlanOwner =
            membership.role === "owner"
              ? m.userId === membership.plan.ownerUserId
              : m.userId === membership.ownerUserId;
          return (
            <li
              key={m.userId}
              className="flex items-center gap-3 rounded-[14px] border border-emerald-200/60 bg-white/70 px-3 py-2"
            >
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                {isPlanOwner ? (
                  <Crown className="h-4 w-4" aria-hidden />
                ) : (
                  <Users className="h-4 w-4" aria-hidden />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-slate-800">
                  {m.userId.slice(0, 8)}…
                  {isMe && (
                    <span className="ml-2 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-black uppercase text-white">
                      you · bạn
                    </span>
                  )}
                  {isPlanOwner && !isMe && (
                    <span className="ml-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-black uppercase text-amber-700">
                      owner · chủ gói
                    </span>
                  )}
                </div>
                <div className="truncate text-[11px] text-slate-500">
                  Joined {m.joinedAt.slice(0, 10)}
                </div>
              </div>
              {isOwner && !isPlanOwner && onRemoveMember && (
                <button
                  type="button"
                  onClick={() => onRemoveMember(m.userId)}
                  aria-label={`Remove member ${m.userId}`}
                  className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-2.5 py-1 text-[11px] font-bold text-red-600 hover:bg-red-50"
                >
                  <UserMinus className="h-3 w-3" aria-hidden />
                  Remove
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
