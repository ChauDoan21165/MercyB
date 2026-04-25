// src/components/gift/MyGiftsList.tsx
//
// Step 9 — combined "purchased + redeemed" history view. Reads via
// the gift client; both lists are owner-only via RLS.

import React, { useEffect, useState } from "react";

import {
  listMyPurchasedGifts,
  listMyRedeemedGifts,
  type GiftSubscriptionRow,
} from "@/lib/gift/giftSubscriptionClient";
import { Card, CardContent } from "@/components/ui/card";
import { Gift } from "lucide-react";

interface MyGiftsListProps {
  userId: string;
}

export default function MyGiftsList({
  userId,
}: MyGiftsListProps): React.ReactElement {
  const [purchased, setPurchased] = useState<GiftSubscriptionRow[]>([]);
  const [redeemed, setRedeemed] = useState<GiftSubscriptionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void Promise.all([
      listMyPurchasedGifts(userId),
      listMyRedeemedGifts(userId),
    ]).then(([p, r]) => {
      if (cancelled) return;
      setPurchased(p);
      setRedeemed(r);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-slate-500">
          Đang tải / Loading…
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Section
        title="Đã tặng / Gifts I sent"
        empty="Bạn chưa tặng ai. / You haven't sent any gifts yet."
        rows={purchased}
        kind="purchased"
      />
      <Section
        title="Đã nhận / Gifts I received"
        empty="Bạn chưa nhận quà nào. / You haven't received any gifts."
        rows={redeemed}
        kind="redeemed"
      />
    </div>
  );
}

interface SectionProps {
  title: string;
  empty: string;
  rows: GiftSubscriptionRow[];
  kind: "purchased" | "redeemed";
}

function Section({ title, empty, rows, kind }: SectionProps): React.ReactElement {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          {title}
        </h3>
        {rows.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">{empty}</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {rows.map((row) => (
              <li key={row.id} className="flex items-start gap-3 py-3">
                <Gift className="mt-0.5 h-5 w-5 text-amber-500" aria-hidden />
                <div className="flex-1 text-sm">
                  <p className="font-medium text-slate-900">
                    {row.durationMonths} tháng / months
                  </p>
                  <p className="text-xs text-slate-500">
                    {kind === "purchased"
                      ? `Tặng cho / To: ${row.recipientEmail ?? "—"}`
                      : `Tặng từ / From: ${row.purchaserEmail ?? "—"}`}
                  </p>
                  <p className="text-xs text-slate-400">
                    {kind === "purchased" ? (
                      <>
                        Mã / Code:{" "}
                        <span className="font-mono">{row.code}</span>
                        {row.redeemedAt
                          ? ` — đã nhận / redeemed ${formatDate(row.redeemedAt)}`
                          : ` — chưa nhận / unredeemed`}
                      </>
                    ) : (
                      <>Đã nhận / Redeemed: {formatDate(row.redeemedAt)}</>
                    )}
                  </p>
                  {row.personalMessage ? (
                    <p className="mt-1 italic text-slate-600">
                      "{row.personalMessage}"
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return "—";
  return new Date(ms).toLocaleDateString();
}
