// src/components/corporate/InviteSeatsForm.tsx
//
// Bulk invite UI: paste a list of emails (CSV / one-per-line / comma-
// separated) and mint up to CORPORATE_MAX_BULK_INVITES invite codes
// in one click. The actual email-out is left to the daytime workflow
// (sales/admin), so the form returns the codes inline so the admin
// can copy/paste them into whatever channel they prefer (email,
// Zalo, Facebook group post, etc.).

import React, { useMemo, useState } from "react";

import {
  CORPORATE_MAX_BULK_INVITES,
  inviteSeatsBulk,
  parseBulkEmails,
  type CorporateSeatInvite,
} from "@/lib/corporate/corporateClient";

export type InviteSeatsFormProps = {
  corporateAccountId: string;
  /** Called once after a successful bulk send. */
  onCreated?: (invites: CorporateSeatInvite[]) => void;
};

export function InviteSeatsForm({
  corporateAccountId,
  onCreated,
}: InviteSeatsFormProps) {
  const [raw, setRaw] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CorporateSeatInvite[]>([]);
  const [failed, setFailed] = useState<string[]>([]);

  const parsed = useMemo(() => parseBulkEmails(raw), [raw]);
  const canSubmit = !submitting && parsed.valid.length > 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    setCreated([]);
    setFailed([]);
    try {
      const result = await inviteSeatsBulk(corporateAccountId, parsed.valid);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setCreated(result.data.created);
      setFailed(result.data.failed);
      onCreated?.(result.data.created);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm p-5 sm:p-6 max-w-xl mx-auto"
      aria-label="Bulk invite seats"
    >
      <h2 className="text-base font-semibold mb-1">
        Mời thành viên
        <span className="text-slate-400 font-normal ml-2">Invite seats</span>
      </h2>
      <p className="text-xs text-slate-500 mb-3">
        Dán danh sách email (mỗi dòng một email, hoặc cách nhau bằng dấu phẩy).
        Tối đa {CORPORATE_MAX_BULK_INVITES} mỗi lần.
      </p>

      <form onSubmit={onSubmit} className="space-y-3">
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={6}
          placeholder={"student1@example.com\nstudent2@example.com\nstudent3@example.com"}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent p-2 text-sm font-mono"
          aria-label="Email list"
        />

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <span>
            Hợp lệ: <strong>{parsed.valid.length}</strong>
          </span>
          {parsed.invalid.length > 0 && (
            <span className="text-amber-700 dark:text-amber-300">
              · Bỏ qua {parsed.invalid.length} dòng không phải email
            </span>
          )}
          {parsed.truncated && (
            <span className="text-amber-700 dark:text-amber-300">
              · Cắt còn {CORPORATE_MAX_BULK_INVITES} đầu tiên
            </span>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-700 dark:text-red-300" role="alert">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 font-medium"
          >
            {submitting ? "Đang tạo mã…" : `Tạo ${parsed.valid.length} mã mời`}
          </button>
        </div>
      </form>

      {created.length > 0 && (
        <div
          className="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-3"
          data-testid="invite-results"
        >
          <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 mb-2">
            Đã tạo {created.length} mã mời. Sao chép gửi cho thành viên:
          </div>
          <ul className="text-sm font-mono space-y-1">
            {created.map((inv) => (
              <li key={inv.id} className="flex items-center gap-2">
                <span className="text-slate-500 text-xs">{inv.invited_email}</span>
                <span className="rounded bg-white dark:bg-slate-800 px-2 py-0.5 border border-emerald-200 dark:border-emerald-800">
                  {inv.invite_code}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {failed.length > 0 && (
        <div className="mt-3 rounded-lg bg-red-50 dark:bg-red-900/20 p-3">
          <div className="text-xs font-semibold text-red-900 dark:text-red-200 mb-1">
            Không tạo được mã cho {failed.length} email (có thể đã được mời trước):
          </div>
          <ul className="text-xs font-mono text-red-900 dark:text-red-200 list-disc pl-5">
            {failed.map((email) => (
              <li key={email}>{email}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default InviteSeatsForm;
