// src/components/account/LanguagePairSettings.tsx
//
// Settings panel: manage the (native, target) language pair. Fulfils
// the promise the onboarding confirmation already makes ("đổi sau
// trong phần Cài đặt") — previously a broken promise (no UI existed).
//
// Data-loss guarantee: target_languages is just an ordered list of
// codes. Removing a target only hides that path — no progress rows are
// deleted (progress is keyed independently of this column). Changing
// native re-points lesson pedagogy language; it does not erase
// anything either.

import React, { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useProfileQuery } from "@/lib/queries/useProfileQuery";
import {
  NATIVE_OPTIONS,
  RECOMMENDED_TARGET,
  TARGET_MENU,
  TARGET_META,
  targetBadge,
  type NativeLang,
  type TargetLang,
} from "@/lib/onboarding/types";
import {
  parseLanguagePair,
  usePairMutation,
} from "@/lib/languagePair/languagePair";

const chip = (active: boolean): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  borderRadius: 9999,
  border: `1px solid ${active ? "rgba(180,60,100,0.55)" : "rgba(0,0,0,0.14)"}`,
  background: active
    ? "linear-gradient(135deg, #B45309 0%, #D97706 50%, #14B8A6 100%)"
    : "white",
  color: active ? "white" : "rgba(15,23,42,0.85)",
  fontSize: 13,
  fontWeight: 800,
  padding: "8px 14px",
  cursor: "pointer",
});

export default function LanguagePairSettings() {
  const { user } = useAuth();
  const { data: profile } = useProfileQuery(user?.id ?? null);
  const { nativeLanguage, targets } = parseLanguagePair(profile);
  const { persist } = usePairMutation();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Existing users are backfilled to 'vi'; default the display there
  // if somehow unset so the panel is always usable.
  const native: NativeLang = nativeLanguage ?? "vi";
  const menu = TARGET_MENU[native];

  const save = async (patch: Parameters<typeof persist>[0]) => {
    setBusy(true);
    setMsg(null);
    const r = await persist(patch);
    setMsg(r.ok ? "Đã lưu · Saved" : "Lưu thất bại · Save failed");
    setBusy(false);
  };

  const changeNative = (next: NativeLang) => {
    if (next === native || busy) return;
    // Keep only targets valid for the new native; fall back to that
    // native's recommended target if none survive (e.g. switching to a
    // native whose menu excludes the current picks).
    const valid = new Set(TARGET_MENU[next].map((i) => i.value));
    let nextTargets = targets.filter((t) => valid.has(t));
    if (nextTargets.length === 0) nextTargets = [RECOMMENDED_TARGET[next]];
    void save({ native_language: next, target_languages: nextTargets });
  };

  const toggleTarget = (t: TargetLang) => {
    if (busy) return;
    const has = targets.includes(t);
    const next = has ? targets.filter((x) => x !== t) : [...targets, t];
    if (next.length === 0) {
      setMsg("Cần ít nhất một ngôn ngữ · Keep at least one language");
      return;
    }
    void save({ target_languages: next });
  };

  return (
    <div>
      {/* Native language */}
      <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(15,23,42,0.85)" }}>
        Tiếng mẹ đẻ
        <span style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)" }}>
          Native language — Mercy explains lessons in this language
        </span>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
        {NATIVE_OPTIONS.map((n) => (
          <button
            key={n.value}
            type="button"
            disabled={busy}
            onClick={() => changeNative(n.value)}
            aria-pressed={n.value === native}
            style={chip(n.value === native)}
          >
            <span aria-hidden>{n.icon}</span>
            {n.label.vi}
          </button>
        ))}
      </div>
      <p
        style={{
          marginTop: 8,
          fontSize: 12,
          lineHeight: 1.5,
          color: "rgba(180,83,9,0.9)",
        }}
      >
        Đổi tiếng mẹ đẻ sẽ thay đổi ngôn ngữ giải thích bài học. Tiến trình
        của bạn được giữ nguyên.
        <span style={{ display: "block", color: "rgba(0,0,0,0.45)" }}>
          Changing this changes the lesson explanation language — your
          progress is kept.
        </span>
      </p>

      {/* Target languages */}
      <div
        style={{
          marginTop: 18,
          fontSize: 13,
          fontWeight: 800,
          color: "rgba(15,23,42,0.85)",
        }}
      >
        Ngôn ngữ đang học
        <span style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)" }}>
          Languages you're learning — add or remove anytime
        </span>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
        {menu.map((item) => {
          const meta = TARGET_META[item.value];
          const active = targets.includes(item.value);
          const badge = targetBadge(item);
          return (
            <button
              key={item.value}
              type="button"
              disabled={busy}
              onClick={() => toggleTarget(item.value)}
              aria-pressed={active}
              title={badge ? `${badge.vi} · ${badge.en}` : undefined}
              style={chip(active)}
            >
              <span aria-hidden>{meta.flag}</span>
              {meta.labelVi}
              {badge ? (
                <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.85 }}>
                  ({badge.en})
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      <p
        style={{
          marginTop: 8,
          fontSize: 12,
          lineHeight: 1.5,
          color: "rgba(0,0,0,0.45)",
        }}
      >
        Bỏ một ngôn ngữ chỉ ẩn nó đi — tiến trình của ngôn ngữ đó vẫn được
        giữ. · Removing a language only hides it; its progress is kept.
      </p>

      {msg ? (
        <p
          role="status"
          style={{
            marginTop: 10,
            fontSize: 12,
            fontWeight: 700,
            color: msg.includes("thất bại")
              ? "rgba(180,30,30,0.85)"
              : "rgba(13,148,136,0.95)",
          }}
        >
          {msg}
        </p>
      ) : null}
    </div>
  );
}
