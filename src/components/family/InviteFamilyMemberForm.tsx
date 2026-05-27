// Owner-only: send an invite. Email is optional — the invite_code is the
// primary share mechanism (copy/paste, SMS, Zalo). The email field is a
// hint for future "I sent this to alice@..." UX.

import React, { useState } from "react";
import { Send, Copy, Check } from "lucide-react";

import {
  inviteMember,
  type FamilyInvite,
} from "@/lib/family/familyPlanClient";

export type InviteFamilyMemberFormProps = {
  familyPlanId: string;
  /** Called after a successful invite so the parent can refresh its list. */
  onInvited?: (invite: FamilyInvite) => void;
};

export default function InviteFamilyMemberForm({
  familyPlanId,
  onInvited,
}: InviteFamilyMemberFormProps) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [lastInvite, setLastInvite] = useState<FamilyInvite | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const invite = await inviteMember(familyPlanId, email.trim() || null);
      if (!invite) {
        setError("Could not create invite. Please try again.");
        return;
      }
      setLastInvite(invite);
      setEmail("");
      onInvited?.(invite);
    } finally {
      setBusy(false);
    }
  };

  const onCopyCode = async () => {
    if (!lastInvite) return;
    try {
      await navigator.clipboard.writeText(lastInvite.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="rounded-[18px] border border-emerald-200/70 bg-white p-4">
      <h3 className="text-[15px] font-black text-emerald-900">
        Invite a family member
      </h3>
      <div className="text-[12px] font-semibold text-emerald-700/70">
        Mời thành viên gia đình
      </div>

      <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-2">
        <label className="text-[13px] font-bold text-slate-700">
          Email <span className="font-normal text-slate-500">(tuỳ chọn / optional)</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="member@example.com"
            disabled={busy}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-black text-white shadow-[0_6px_18px_rgba(16,185,129,0.25)] hover:bg-emerald-600 disabled:opacity-60"
        >
          <Send className="h-4 w-4" aria-hidden />
          {busy ? "Creating…" : "Create invite · Tạo lời mời"}
        </button>

        {error && (
          <div role="alert" className="text-[13px] font-semibold text-red-600">
            {error}
          </div>
        )}
      </form>

      {lastInvite && (
        <div className="mt-4 rounded-[14px] border border-emerald-200/70 bg-emerald-50/60 p-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            Share this code · Chia sẻ mã này
          </div>
          <div className="mt-2 flex items-center gap-3">
            <code className="flex-1 rounded-lg bg-white px-3 py-2 text-center text-lg font-black tracking-[0.18em] text-emerald-900">
              {lastInvite.inviteCode}
            </code>
            <button
              type="button"
              onClick={onCopyCode}
              className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-white px-3 py-2 text-[12px] font-black text-emerald-700 hover:bg-emerald-50"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" aria-hidden /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" aria-hidden /> Copy
                </>
              )}
            </button>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Expires {lastInvite.expiresAt.slice(0, 10)} · hết hạn sau 7 ngày
          </div>
        </div>
      )}
    </div>
  );
}
