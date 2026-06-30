// src/components/corporate/SeatList.tsx
//
// Read + manage current seat-holders. Admin can remove members; the
// list itself is read-only otherwise. Self-leave goes through the same
// `removeSeat` call (RLS allows the seat-holder to delete their own row).

import React, { useCallback, useEffect, useState } from "react";

import {
  listSeats,
  removeSeat,
  type CorporateSeat,
} from "@/lib/corporate/corporateClient";

export type SeatListProps = {
  corporateAccountId: string;
  /** When true, render the "Remove" button on each row. */
  isAdmin?: boolean;
};

export function SeatList({ corporateAccountId, isAdmin = false }: SeatListProps) {
  const [rows, setRows] = useState<CorporateSeat[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const result = await listSeats(corporateAccountId);
    if (!result.ok) {
      setError(result.error);
      setRows([]);
      return;
    }
    setError(null);
    setRows(result.data);
  }, [corporateAccountId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await listSeats(corporateAccountId);
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
  }, [corporateAccountId]);

  const onRemove = useCallback(
    async (userId: string) => {
      setBusyId(userId);
      try {
        const result = await removeSeat(corporateAccountId, userId);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        await refresh();
      } finally {
        setBusyId(null);
      }
    },
    [corporateAccountId, refresh],
  );

  if (rows === null) {
    return <p className="text-sm text-slate-600">Đang tải danh sách thành viên…</p>;
  }
  if (error) {
    return (
      <p className="text-sm text-red-700 dark:text-red-300" role="alert">
        {error}
      </p>
    );
  }
  if (rows.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        Chưa có thành viên nào. Mời thành viên đầu tiên ở trên.
      </p>
    );
  }
  return (
    <ul className="space-y-2" aria-label="Corporate seat members">
      {rows.map((r) => (
        <li
          key={r.user_id}
          className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 flex items-center justify-between gap-3"
          data-testid="seat-row"
          data-user-id={r.user_id}
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium font-mono truncate">{r.user_id}</p>
            <p className="text-xs text-slate-600">
              Tham gia: {new Date(r.joined_at).toLocaleDateString()}
            </p>
          </div>
          {isAdmin && (
            <button
              type="button"
              onClick={() => onRemove(r.user_id)}
              disabled={busyId === r.user_id}
              className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-200 disabled:opacity-60"
            >
              {busyId === r.user_id ? "Đang xoá…" : "Xoá"}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

export default SeatList;
