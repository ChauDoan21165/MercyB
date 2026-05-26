// Member-side: paste an invite code to join a family plan.

import React, { useState } from "react";
import { LogIn } from "lucide-react";

import { redeemInvite } from "@/lib/family/familyPlanClient";

export type JoinFamilyFormProps = {
  userId: string;
  /** Called with the joined family plan id on success. */
  onJoined?: (familyPlanId: string) => void;
};

export default function JoinFamilyForm({ userId, onJoined }: JoinFamilyFormProps) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const result = await redeemInvite(code, userId);
    setBusy(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setCode("");
    onJoined?.(result.familyPlanId);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[18px] border border-indigo-200/70 bg-white p-4"
    >
      <h3 className="text-[15px] font-black text-indigo-900">
        Have an invite code?
      </h3>
      <div className="text-[12px] font-semibold text-indigo-700/70">
        Bạn có mã mời?
      </div>

      <label className="mt-3 block text-[13px] font-bold text-slate-700">
        Invite code · Mã mời
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ABCDEFGH"
          maxLength={8}
          autoCapitalize="characters"
          spellCheck={false}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-center text-lg font-black tracking-[0.18em] focus:border-indigo-400 focus:outline-none"
          disabled={busy}
        />
      </label>

      <button
        type="submit"
        disabled={busy || code.length !== 8}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-black text-white shadow-[0_6px_18px_rgba(79,70,229,0.25)] hover:bg-indigo-600 disabled:opacity-60"
      >
        <LogIn className="h-4 w-4" aria-hidden />
        {busy ? "Joining…" : "Join family · Tham gia"}
      </button>

      {error && (
        <div
          role="alert"
          className="mt-2 text-[13px] font-semibold text-red-600"
        >
          {humanizeFor(error)}
        </div>
      )}
    </form>
  );
}

function humanizeFor(error: string): string {
  switch (error) {
    case "invite not found":
      return "Mã mời không đúng · invite code not found";
    case "invite expired":
      return "Mã mời đã hết hạn · invite expired";
    case "invite already redeemed":
      return "Mã đã được dùng · code already used";
    case "already in a family plan":
      return "Bạn đã trong một gói gia đình · already in a family plan";
    case "family plan is full":
      return "Gói đã đủ thành viên · family plan is full";
    case "not authenticated":
      return "Vui lòng đăng nhập · please sign in";
    default:
      return error;
  }
}
