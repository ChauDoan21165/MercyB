// Member-only: leave the family plan (delete own membership row).
// Owners use a different control (deactivateOwnPlan) — this button is
// hidden for owners.

import React, { useState } from "react";
import { LogOut } from "lucide-react";

import { leaveFamily } from "@/lib/family/familyPlanClient";

export type LeaveFamilyButtonProps = {
  userId: string;
  onLeft?: () => void;
};

export default function LeaveFamilyButton({
  userId,
  onLeft,
}: LeaveFamilyButtonProps) {
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const onConfirm = async () => {
    if (busy) return;
    setBusy(true);
    const ok = await leaveFamily(userId);
    setBusy(false);
    setConfirming(false);
    if (ok) onLeft?.();
  };

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
      >
        <LogOut className="h-4 w-4" aria-hidden />
        Leave family · Rời nhóm
      </button>
    );
  }

  return (
    <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2">
      <span className="text-[13px] font-semibold text-red-700">
        Bạn chắc chứ? · Are you sure?
      </span>
      <button
        type="button"
        onClick={onConfirm}
        disabled={busy}
        className="rounded-full bg-red-500 px-3 py-1 text-[12px] font-black text-white hover:bg-red-600 disabled:opacity-60"
      >
        {busy ? "Leaving…" : "Yes, leave"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        disabled={busy}
        className="rounded-full bg-white px-3 py-1 text-[12px] font-bold text-slate-700 hover:bg-slate-100"
      >
        Cancel
      </button>
    </div>
  );
}
