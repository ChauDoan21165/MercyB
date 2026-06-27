// src/components/contribute/AdminPendingSentenceRow.tsx
//
// One row in the admin pending-sentences queue. Approve / reject with
// an optional free-text note. Calls back to the parent so the parent
// can refresh the queue — the row itself holds no list state.

import React, { useState } from 'react';

import {
  approveSubmission,
  rejectSubmission,
  type SubmissionRow,
} from '@/lib/userContent/sentenceSubmission';

export type AdminPendingSentenceRowProps = {
  row: SubmissionRow;
  adminUserId: string;
  onReviewed?: (id: string, status: 'approved' | 'rejected') => void;
};

export function AdminPendingSentenceRow({
  row,
  adminUserId,
  onReviewed,
}: AdminPendingSentenceRowProps) {
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function doReview(action: 'approve' | 'reject') {
    setError(null);
    setBusy(true);
    try {
      const fn = action === 'approve' ? approveSubmission : rejectSubmission;
      const result = await fn(adminUserId, row.id, notes);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onReviewed?.(row.id, action === 'approve' ? 'approved' : 'rejected');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="rounded-xl border border-slate-200 dark:border-slate-700 p-4"
      data-testid="admin-pending-row"
      data-submission-id={row.id}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0 flex-1">
          <p className="text-base font-medium">{row.en}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300" lang="vi">{row.vi}</p>
          <p className="text-xs text-slate-600 mt-1">
            Gửi: {new Date(row.submitted_at).toLocaleString()}
            {row.context ? ` · ${row.context}` : ''}
            {row.difficulty ? ` · ${row.difficulty}` : ''}
            {row.suggested_l1_tag ? ` · ` : ''}
            {row.suggested_l1_tag && (
              <code className="text-xs">{row.suggested_l1_tag}</code>
            )}
          </p>
        </div>
      </div>

      <label className="block text-xs text-slate-600 mt-2 mb-1" htmlFor={`notes-${row.id}`}>
        Ghi chú (tuỳ chọn)
      </label>
      <textarea
        id={`notes-${row.id}`}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        maxLength={1000}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent p-2 text-sm"
        placeholder="Tại sao duyệt hoặc từ chối?"
      />

      {error && (
        <p className="text-sm text-red-700 dark:text-red-300 mt-2" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-2 mt-3">
        <button
          type="button"
          onClick={() => doReview('reject')}
          disabled={busy}
          className="px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-200 disabled:opacity-60 text-sm font-medium"
        >
          Từ chối
        </button>
        <button
          type="button"
          onClick={() => doReview('approve')}
          disabled={busy}
          className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 text-sm font-medium"
        >
          Duyệt
        </button>
      </div>
    </div>
  );
}

export default AdminPendingSentenceRow;
