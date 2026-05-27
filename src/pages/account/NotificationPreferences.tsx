// src/pages/account/NotificationPreferences.tsx
//
// Route: /account/notifications (auth-required, mounted under RequireAuth).
//
// Three independent toggles backed by profiles.email_*_enabled. Each
// toggle has a description explaining when this email actually fires
// — so users opt out with intent rather than blanket-fear.
//
// Save behavior:
//   - Per-toggle save (no big "Save" button) — every flip is a single
//     UPDATE. Keeps the UI feeling instant, removes the "did it save?"
//     ambiguity, and lines up with how /account/* already handles
//     boolean settings (e.g., leaderboard opt-in).
//   - On error, we revert the toggle and show an inline error.
//
// Bilingual VI primary throughout.

import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import {
  getEmailPreferences,
  updateEmailPreferences,
  type EmailPreferences,
} from "@/services/emailPreferences";

const wrap: React.CSSProperties = {
  width: "100%",
  minHeight: "calc(100vh - 72px)",
  padding: "20px 16px 80px",
  display: "flex",
  justifyContent: "center",
};

const column: React.CSSProperties = {
  width: "100%",
  maxWidth: 600,
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const cardStyle: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.10)",
  borderRadius: 20,
  padding: 22,
  background: "white",
  boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
};

const headingStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 900,
  letterSpacing: -0.3,
  margin: 0,
  color: "rgba(10,10,10,0.94)",
};

const breadcrumbLink: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  color: "#475569",
  fontSize: 13,
  textDecoration: "none",
};

type ToggleKey =
  | "reEngagementEnabled"
  | "trialExpiryEnabled"
  | "weeklyDigestEnabled"
  | "streakReminderEnabled"
  | "weeklyProgressEnabled";

type ToggleConfig = {
  key: ToggleKey;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  whenVi: string;
  whenEn: string;
};

const TOGGLES: ToggleConfig[] = [
  {
    key: "reEngagementEnabled",
    titleVi: "Email gợi nhắc quay lại",
    titleEn: "Re-engagement emails",
    descVi: "Email động viên quay lại học khi bạn không vào app trong nhiều ngày.",
    descEn:
      "Friendly nudges to come back to the app when you've been away.",
    whenVi: "Khi bạn không quay lại 7+ ngày",
    whenEn: "When you haven't returned in 7+ days",
  },
  {
    key: "trialExpiryEnabled",
    titleVi: "Nhắc trial sắp hết",
    titleEn: "Trial expiry reminders",
    descVi: "Thông báo trial sắp hết hạn (D-1) và mời quay lại sau khi hết (D+1).",
    descEn:
      "Reminders just before your free trial ends (D-1) and a follow-up after (D+1).",
    whenVi: "Khi trial gần hết hạn / D-1 và D+1",
    whenEn: "When the trial is about to end / D-1 and D+1",
  },
  {
    key: "weeklyDigestEnabled",
    titleVi: "Bản tin tuần",
    titleEn: "Weekly digest",
    descVi:
      "Tóm tắt tuần qua: bạn học được gì, điểm phát âm thay đổi thế nào, mẹo cho tuần tới.",
    descEn:
      "Your weekly summary: what you practiced, score changes, tips for the next week.",
    whenVi: "Mỗi sáng thứ Hai",
    whenEn: "Every Monday morning",
  },
  {
    key: "streakReminderEnabled",
    titleVi: "Nhắc giữ streak",
    titleEn: "Streak reminders",
    descVi:
      "Email nhắc vào học để không mất streak khi hôm đó bạn chưa học.",
    descEn:
      "A nudge to study so you don't lose your streak on a day you haven't practiced yet.",
    whenVi: "Buổi tối nếu hôm đó bạn chưa học",
    whenEn: "In the evening if you haven't studied that day",
  },
  {
    key: "weeklyProgressEnabled",
    titleVi: "Tổng kết tiến độ tuần",
    titleEn: "Weekly progress summary",
    descVi:
      "Tổng kết cá nhân mỗi tuần: streak, số bài đã học và lời động viên.",
    descEn:
      "Your personal weekly recap: streak, lessons completed, and encouragement.",
    whenVi: "Sáng thứ Hai hàng tuần",
    whenEn: "Every Monday morning",
  },
];

export default function NotificationPreferencesPage(): React.ReactElement {
  const [prefs, setPrefs] = useState<EmailPreferences | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<ToggleKey | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoadError(null);
    getEmailPreferences()
      .then((p) => {
        if (alive) setPrefs(p);
      })
      .catch((err: unknown) => {
        if (!alive) return;
        setLoadError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      alive = false;
    };
  }, []);

  const onToggle = useCallback(
    async (key: ToggleKey, next: boolean) => {
      if (!prefs) return;
      const previous = prefs[key];
      // Optimistic UI — flip immediately, revert on error.
      setPrefs({ ...prefs, [key]: next });
      setSavingKey(key);
      setSaveError(null);
      try {
        const updated = await updateEmailPreferences({ [key]: next });
        setPrefs(updated);
      } catch (err) {
        setPrefs({ ...prefs, [key]: previous });
        setSaveError(err instanceof Error ? err.message : String(err));
      } finally {
        setSavingKey(null);
      }
    },
    [prefs],
  );

  return (
    <div style={wrap}>
      <div style={column}>
        <Link to="/account" style={breadcrumbLink} aria-label="Back to account">
          <ChevronLeft size={14} aria-hidden />
          <span>Tài khoản · Account</span>
        </Link>

        <header>
          <h1 style={headingStyle}>Tùy chọn email · Notification preferences</h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>
            Tắt từng loại email mà không cần unsubscribe toàn bộ. Toggle cập nhật
            ngay khi bạn bấm.
          </p>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
            Opt out per category — no need to unsubscribe from everything. Each
            toggle saves immediately.
          </p>
        </header>

        {loadError ? (
          <div
            role="alert"
            style={{
              ...cardStyle,
              borderColor: "#fecaca",
              background: "#fef2f2",
              color: "#991b1b",
              fontSize: 13,
            }}
          >
            Không tải được tùy chọn — {loadError}
          </div>
        ) : null}

        {prefs?.unsubscribedAt ? (
          <div
            style={{
              ...cardStyle,
              background: "#fffbeb",
              borderColor: "#fde68a",
              fontSize: 13,
              color: "#78350f",
            }}
          >
            Bạn đã unsubscribe toàn bộ vào{" "}
            <strong>{new Date(prefs.unsubscribedAt).toLocaleString()}</strong>. Bật
            bất kỳ toggle nào bên dưới sẽ hủy trạng thái unsubscribe.
            <div style={{ fontSize: 11, color: "#92400e", marginTop: 4 }}>
              You unsubscribed from all email at the timestamp above. Toggling any
              option back on clears that state.
            </div>
          </div>
        ) : null}

        {prefs ? (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {TOGGLES.map((t) => {
              const value = prefs[t.key];
              const saving = savingKey === t.key;
              return (
                <li key={t.key} style={cardStyle}>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "rgba(10,10,10,0.94)" }}>
                        {t.titleVi}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 1 }}>
                        {t.titleEn}
                      </div>
                      <p
                        style={{
                          fontSize: 13,
                          color: "#475569",
                          margin: "8px 0 0",
                          lineHeight: 1.5,
                        }}
                      >
                        {t.descVi}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#64748b",
                          margin: "2px 0 0",
                          lineHeight: 1.5,
                        }}
                      >
                        {t.descEn}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#64748b",
                          marginTop: 8,
                          fontWeight: 700,
                        }}
                      >
                        Khi nào: {t.whenVi} · When: {t.whenEn}
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={value}
                      onChange={(next) => void onToggle(t.key, next)}
                      disabled={saving}
                      ariaLabel={t.titleEn}
                      testId={`pref-toggle-${t.key}`}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : !loadError ? (
          <div style={{ ...cardStyle, color: "#64748b", fontSize: 13 }}>
            Đang tải… · Loading…
          </div>
        ) : null}

        {saveError ? (
          <div
            role="alert"
            style={{
              ...cardStyle,
              borderColor: "#fecaca",
              background: "#fef2f2",
              color: "#991b1b",
              fontSize: 13,
            }}
          >
            Lưu thất bại — {saveError}
          </div>
        ) : null}

        <div style={{ ...cardStyle, fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
          Email giao dịch (đăng ký, đặt lại mật khẩu, biên lai thanh toán) vẫn được
          gửi vì đây là yêu cầu pháp lý — các tùy chọn ở trên chỉ áp dụng cho email
          marketing.
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
            Transactional email (sign-in, password reset, billing receipts) still
            goes out — only marketing email is governed by the toggles above.
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  disabled,
  ariaLabel,
  testId,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  ariaLabel: string;
  testId?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      data-testid={testId}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      style={{
        flexShrink: 0,
        width: 48,
        height: 28,
        borderRadius: 9999,
        background: checked ? "#10b981" : "#cbd5e1",
        border: "none",
        cursor: disabled ? "wait" : "pointer",
        position: "relative",
        transition: "background 120ms ease",
        opacity: disabled ? 0.7 : 1,
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 23 : 3,
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          transition: "left 120ms ease",
        }}
      />
    </button>
  );
}
