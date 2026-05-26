// src/pages/referral/BulkInvite.tsx
//
// /referral/invite-family — auth-required.
// Three input methods (manual rows, paste from clipboard, contact
// picker stub on mobile), template picker, optional custom message,
// and a real-time stats panel ("Bạn đã mời 8 người. 5 đã đăng ký…").

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/providers/AuthProvider";
import {
  FAMILY_INVITE_TEMPLATES,
  type FamilyInviteRelationship,
  type FamilyInviteTemplateKey,
  recipientAddressVi,
} from "@/lib/referral/familyInviteCopy";
import {
  type BulkRecipient,
  type BulkSendResult,
  sendBulkInvitations,
} from "@/lib/referral/familyInviteClient";
import {
  type FamilyInviteStats,
  loadFamilyInviteStats,
} from "@/lib/referral/familyInviteTelemetry";

const MAX_ROWS = 10;
const DEFAULT_ROW: BulkRecipient = { name: "", email: "", phone: "", relationship: null };

interface RowState extends BulkRecipient {
  /** UI-side error from the last send attempt. */
  errorCode?: string;
}

export default function BulkInvite(): React.ReactElement {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  const [rows, setRows] = useState<RowState[]>(() =>
    Array.from({ length: 5 }, () => ({ ...DEFAULT_ROW })),
  );
  const [templateKey, setTemplateKey] = useState<FamilyInviteTemplateKey>("family");
  const [customMessage, setCustomMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sendResult, setSendResult] = useState<BulkSendResult | null>(null);
  const [stats, setStats] = useState<FamilyInviteStats | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user?.id) {
      navigate("/signin?next=/referral/invite-family", { replace: true });
      return;
    }
    void loadFamilyInviteStats(user.id).then(setStats);
  }, [user, isLoading, navigate]);

  // Re-fetch stats after a send so the dashboard reflects the new rows.
  useEffect(() => {
    if (!user?.id || !sendResult || sendResult.kind !== "ok") return;
    void loadFamilyInviteStats(user.id).then(setStats);
  }, [user, sendResult]);

  const filledCount = useMemo(
    () => rows.filter((r) => (r.email && r.email.trim()) || (r.phone && r.phone.trim())).length,
    [rows],
  );

  const handleRowChange = (index: number, patch: Partial<RowState>) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const handleAddRow = () => {
    setRows((prev) => (prev.length >= MAX_ROWS ? prev : [...prev, { ...DEFAULT_ROW }]));
  };

  const handleRemoveRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePaste = async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const text = event.clipboardData.getData("text/plain");
    if (!text.trim()) return;
    event.preventDefault();
    const parsed = parseClipboardContacts(text);
    if (parsed.length === 0) return;
    setRows((prev) => mergeWithPasted(prev, parsed));
  };

  const handleContactPicker = async () => {
    // Capacitor Contacts plugin would land here. For web we fall back
    // to the native Contact Picker API where supported, else show a
    // toast hint to use paste/manual.
    const navWith = navigator as unknown as {
      contacts?: { select?: (props: string[], opts: { multiple: boolean }) => Promise<unknown[]> };
    };
    if (typeof navWith.contacts?.select !== "function") {
      alert(
        "Trình duyệt này không hỗ trợ chọn từ danh bạ. Vui lòng nhập tay hoặc dán từ Notes.",
      );
      return;
    }
    try {
      const results = (await navWith.contacts.select(["name", "email", "tel"], {
        multiple: true,
      })) as Array<{ name?: string[]; email?: string[]; tel?: string[] }>;
      const next = results.flatMap((c) => {
        const name = c.name?.[0] ?? "";
        const emails = c.email ?? [];
        const phones = c.tel ?? [];
        if (emails.length === 0 && phones.length === 0) return [];
        return [
          {
            name,
            email: emails[0] ?? "",
            phone: phones[0] ?? "",
            relationship: null as FamilyInviteRelationship | null,
          } satisfies RowState,
        ];
      });
      if (next.length > 0) {
        setRows((prev) => mergeWithPasted(prev, next));
      }
    } catch {
      // user cancelled — no-op
    }
  };

  const handleSend = async () => {
    setSubmitting(true);
    setSendResult(null);
    const recipients: BulkRecipient[] = rows
      .filter((r) => (r.email && r.email.trim()) || (r.phone && r.phone.trim()))
      .map((r) => ({
        name: r.name?.trim() || null,
        email: r.email?.trim() || null,
        phone: r.phone?.trim() || null,
        relationship: r.relationship ?? null,
      }));

    const result = await sendBulkInvitations(
      recipients,
      templateKey,
      templateKey === "custom" ? customMessage.trim() || null : null,
    );
    setSendResult(result);
    setSubmitting(false);
  };

  if (!user) {
    return (
      <main className="px-4 py-12 max-w-md mx-auto text-sm text-black/55">
        Đang tải / Loading…
      </main>
    );
  }

  return (
    <main className="px-4 py-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Mời gia đình & bạn bè</h1>
      <p className="text-xs italic text-black/55 mb-4">
        Invite family & friends — 14 days free for each accepted invite
      </p>

      {stats ? <StatsPanel stats={stats} /> : null}

      <section className="rounded-xl border border-black/10 bg-white p-4 mb-4">
        <h2 className="text-sm font-semibold mb-2">
          Người được mời / Recipients ({filledCount} / {MAX_ROWS})
        </h2>
        <div className="space-y-3">
          {rows.map((row, i) => (
            <RecipientRow
              key={i}
              index={i}
              row={row}
              onChange={(patch) => handleRowChange(i, patch)}
              onRemove={rows.length > 1 ? () => handleRemoveRow(i) : undefined}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            type="button"
            onClick={handleAddRow}
            disabled={rows.length >= MAX_ROWS}
            className="text-xs px-3 py-1.5 rounded-lg border border-black/15 disabled:opacity-50"
          >
            + Thêm người / Add row
          </button>
          <button
            type="button"
            onClick={handleContactPicker}
            className="text-xs px-3 py-1.5 rounded-lg border border-black/15"
          >
            📇 Chọn từ danh bạ / From contacts
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-black/10 bg-white p-4 mb-4">
        <h2 className="text-sm font-semibold mb-2">
          Hoặc dán danh sách / Or paste a list
        </h2>
        <p className="text-xs text-black/60 mb-2">
          Dán email hoặc số điện thoại — mỗi dòng một người. Hỗ trợ định dạng "Tên,
          email" hoặc chỉ email.
        </p>
        <textarea
          rows={3}
          placeholder="lan@example.com&#10;Mẹ, me@example.com&#10;+84 90 123 4567"
          onPaste={handlePaste}
          className="w-full px-3 py-2 rounded-lg border border-black/15 text-sm"
        />
      </section>

      <section className="rounded-xl border border-black/10 bg-white p-4 mb-4">
        <h2 className="text-sm font-semibold mb-2">Lời nhắn / Message template</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FAMILY_INVITE_TEMPLATES.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTemplateKey(t.key)}
              className={`px-3 py-2 rounded-lg border text-xs font-medium ${
                templateKey === t.key
                  ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                  : "border-black/15 bg-white"
              }`}
              aria-pressed={templateKey === t.key}
            >
              <div>{t.label_vi}</div>
              <div className="italic text-[10px] text-black/50">{t.label_en}</div>
            </button>
          ))}
        </div>
        {templateKey === "custom" ? (
          <div className="mt-3">
            <textarea
              rows={3}
              maxLength={280}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Lời nhắn riêng (tối đa 280 ký tự)…"
              className="w-full px-3 py-2 rounded-lg border border-black/15 text-sm"
            />
            <p className="text-[11px] text-black/50 mt-1">
              {280 - customMessage.length} chars left
            </p>
          </div>
        ) : null}
      </section>

      <button
        type="button"
        onClick={() => void handleSend()}
        disabled={submitting || filledCount === 0}
        className="w-full px-5 py-3 rounded-lg bg-emerald-600 text-white text-sm font-semibold disabled:opacity-50"
      >
        {submitting
          ? "Đang gửi… / Sending…"
          : `Gửi ${filledCount} lời mời / Send ${filledCount} invitations`}
      </button>

      {sendResult ? <SendResultPanel result={sendResult} /> : null}
    </main>
  );
}

function StatsPanel({ stats }: { stats: FamilyInviteStats }) {
  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50 p-3 mb-4 text-sm">
      <p className="text-amber-900 font-semibold">
        Bạn đã mời {stats.total_invited} người
      </p>
      <p className="text-xs text-amber-800/80 italic mb-1">
        You've invited {stats.total_invited} people
      </p>
      <p className="text-xs text-black/70">
        {stats.signed_up} đã đăng ký · {stats.converted} đã trả phí · {stats.sent}{" "}
        đang chờ phản hồi
      </p>
    </section>
  );
}

function RecipientRow({
  index,
  row,
  onChange,
  onRemove,
}: {
  index: number;
  row: RowState;
  onChange: (patch: Partial<RowState>) => void;
  onRemove?: () => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-start" data-testid={`bulk-invite-row-${index}`}>
      <input
        type="text"
        value={row.name ?? ""}
        onChange={(e) => onChange({ name: e.target.value })}
        placeholder="Tên / Name"
        className="sm:col-span-3 px-3 py-2 rounded-lg border border-black/15 text-sm"
      />
      <input
        type="email"
        value={row.email ?? ""}
        onChange={(e) => onChange({ email: e.target.value })}
        placeholder="Email"
        className="sm:col-span-4 px-3 py-2 rounded-lg border border-black/15 text-sm"
      />
      <input
        type="tel"
        value={row.phone ?? ""}
        onChange={(e) => onChange({ phone: e.target.value })}
        placeholder="Phone"
        className="sm:col-span-3 px-3 py-2 rounded-lg border border-black/15 text-sm"
      />
      <select
        value={row.relationship ?? ""}
        onChange={(e) => onChange({ relationship: e.target.value || null })}
        className="sm:col-span-2 px-2 py-2 rounded-lg border border-black/15 text-sm"
        aria-label="Quan hệ / Relationship"
      >
        <option value="">— xưng hô —</option>
        <option value="older_sister">chị (older sister)</option>
        <option value="older_brother">anh (older brother)</option>
        <option value="younger">em (younger)</option>
        <option value="aunt">cô / dì (aunt)</option>
        <option value="uncle">chú / bác (uncle)</option>
        <option value="parent">ba / mẹ (parent)</option>
        <option value="cousin">anh em họ (cousin)</option>
        <option value="friend">bạn (friend)</option>
        <option value="colleague">đồng nghiệp (colleague)</option>
        <option value="other">khác (other)</option>
      </select>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-rose-700 sm:col-span-12 sm:justify-self-end"
          aria-label="Xoá / Remove"
        >
          ✕ xoá
        </button>
      ) : null}
    </div>
  );
}

function SendResultPanel({ result }: { result: BulkSendResult }) {
  if (result.kind === "rate_limited") {
    return (
      <section className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm">
        <p className="text-rose-800 font-semibold">{result.messageVi}</p>
        <p className="text-xs italic text-rose-700/80 mt-1">{result.messageEn}</p>
      </section>
    );
  }
  if (result.kind === "feature_disabled") {
    return (
      <section className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
        <p className="font-semibold text-amber-900">{result.messageVi}</p>
        <p className="text-xs italic text-amber-800/80 mt-1">{result.messageEn}</p>
      </section>
    );
  }
  if (result.kind === "validation_error") {
    return (
      <section className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm">
        <p className="text-rose-800 font-semibold">Vui lòng kiểm tra danh sách.</p>
      </section>
    );
  }
  if (result.kind === "transport_error") {
    return (
      <section className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm">
        <p className="text-rose-800 font-semibold">Lỗi mạng. Vui lòng thử lại.</p>
        <p className="text-xs italic text-rose-700/80 mt-1">Network error. Please try again.</p>
      </section>
    );
  }
  // ok
  return (
    <section className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
      <p className="text-emerald-900 font-semibold">
        Đã gửi {result.summary.sent} lời mời.
      </p>
      <p className="text-xs italic text-emerald-800/80 mt-1">
        Sent {result.summary.sent} of {result.summary.attempted} invitations.
        {result.summary.failed > 0 ? ` ${result.summary.failed} failed.` : ""}
      </p>
    </section>
  );
}

// ── helpers ────────────────────────────────────────────────────────────

function parseClipboardContacts(text: string): RowState[] {
  const lines = text
    .split(/[\r\n,;]/)
    .map((l) => l.trim())
    .filter(Boolean);
  const out: RowState[] = [];
  for (const line of lines) {
    // Heuristics: "Name <email>" or "Name, email" or just email/phone.
    const angle = line.match(/^([^<]+)<([^>]+)>$/);
    if (angle) {
      out.push({
        name: angle[1].trim(),
        email: angle[2].trim(),
        phone: "",
        relationship: null,
      });
      continue;
    }
    const comma = line.split(/[,\t]/).map((s) => s.trim()).filter(Boolean);
    if (comma.length === 2) {
      const [a, b] = comma;
      const looksEmail = /@/.test(b) || /@/.test(a);
      if (looksEmail) {
        out.push({
          name: /@/.test(b) ? a : b,
          email: /@/.test(b) ? b : a,
          phone: "",
          relationship: null,
        });
        continue;
      }
    }
    if (/@/.test(line)) {
      out.push({ name: "", email: line, phone: "", relationship: null });
    } else if (/\d/.test(line)) {
      out.push({ name: "", email: "", phone: line, relationship: null });
    }
  }
  return out;
}

function mergeWithPasted(prev: RowState[], pasted: RowState[]): RowState[] {
  const next: RowState[] = [];
  let pastedIdx = 0;
  for (const row of prev) {
    const isEmpty = !row.email && !row.phone;
    if (isEmpty && pastedIdx < pasted.length) {
      next.push(pasted[pastedIdx++]);
    } else {
      next.push(row);
    }
  }
  while (next.length < MAX_ROWS && pastedIdx < pasted.length) {
    next.push(pasted[pastedIdx++]);
  }
  return next;
}
