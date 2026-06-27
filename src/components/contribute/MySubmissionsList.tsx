// src/components/contribute/MySubmissionsList.tsx
//
// Read-only list of a single user's submissions with status badges.
// No edit/delete actions — submissions are treated as final once sent;
// a contributor who wants to correct a sentence submits a fresh one.

import React, { useEffect, useState } from 'react';

import {
  getMySubmissions,
  type SubmissionRow,
  type SubmissionStatus,
} from '@/lib/userContent/sentenceSubmission';

export type MySubmissionsListProps = {
  userId: string;
};

const STATUS_LABEL: Record<SubmissionStatus, { vi: string; en: string; tone: string }> = {
  pending:  { vi: 'Chờ duyệt',     en: 'Pending',  tone: 'bg-amber-100 text-amber-900' },
  approved: { vi: 'Đã duyệt',      en: 'Approved', tone: 'bg-emerald-100 text-emerald-900' },
  rejected: { vi: 'Không đạt',     en: 'Rejected', tone: 'bg-red-100 text-red-900' },
};

export function MySubmissionsList({ userId }: MySubmissionsListProps) {
  const [rows, setRows] = useState<SubmissionRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await getMySubmissions(userId);
      if (cancelled) return;
      if (!result.ok) {
        setError(result.error);
        setRows([]);
        return;
      }
      setRows(result.data);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (rows === null) {
    return <p className="text-sm text-slate-600">Đang tải…</p>;
  }
  if (error) {
    return <p className="text-sm text-red-700 dark:text-red-300" role="alert">{error}</p>;
  }
  if (rows.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        Bạn chưa gửi câu nào. Hãy đóng góp câu đầu tiên!
      </p>
    );
  }
  return (
    <ul className="space-y-3" aria-label="My sentence submissions">
      {rows.map((r) => {
        const badge = STATUS_LABEL[r.status];
        return (
          <li
            key={r.id}
            className="rounded-xl border border-slate-200 dark:border-slate-700 p-3"
            data-testid="my-submission-row"
            data-status={r.status}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{r.en}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 truncate" lang="vi">{r.vi}</p>
                <p className="text-xs text-slate-600 mt-1">
                  {new Date(r.submitted_at).toLocaleDateString()}
                  {r.context ? ` · ${r.context}` : ''}
                  {r.difficulty ? ` · ${r.difficulty}` : ''}
                </p>
                {r.status !== 'pending' && r.review_notes && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 italic">
                    Ghi chú: {r.review_notes}
                  </p>
                )}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${badge.tone}`}>
                {badge.vi}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default MySubmissionsList;
