
function nativeCopyLang(lang: "vi" | "en" | "ja" | "id" | "th"): "vi" | "en" {
  return lang === "vi" ? "vi" : "en";
}

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
  targetLabel,
  type NativeLang,
  type TargetLang,
} from "@/lib/onboarding/types";
import { parseLanguagePair } from "@/lib/languagePair/languagePair";
import { usePairMutation } from "@/lib/languagePair/usePairMutation";
import { pickChrome } from "@/lib/i18n/chromeLanguage";

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
  // `msg` is now single-language (chrome follows native), so the old
  // `.includes("thất bại")` colour test no longer works — track the
  // error state explicitly instead.
  const [msg, setMsg] = useState<{ text: string; error: boolean } | null>(
    null,
  );

  // Existing users are backfilled to 'vi'; default the display there
  // if somehow unset so the panel is always usable.
  const native: NativeLang = nativeLanguage ?? "vi";
  const menu = TARGET_MENU[nativeCopyLang(native)];

  const save = async (patch: Parameters<typeof persist>[0]) => {
    setBusy(true);
    setMsg(null);
    const r = await persist(patch);
    setMsg(
      r.ok
        ? { text: pickChrome({ vi: "Đã lưu", en: "Saved" }, native), error: false }
        : {
            text: pickChrome(
              { vi: "Lưu thất bại", en: "Save failed" },
              native,
            ),
            error: true,
          },
    );
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
      setMsg({
        text: pickChrome(
          {
            vi: "Cần ít nhất một ngôn ngữ",
            en: "Keep at least one language",
          },
          native,
        ),
        error: true,
      });
      return;
    }
    void save({ target_languages: next });
  };

  return (
    <div>
      {/* Native language */}
      <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(15,23,42,0.85)" }}>
        {pickChrome({ vi: "Tiếng mẹ đẻ", en: "Native language" }, native)}
        <span style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)" }}>
          {pickChrome(
            {
              vi: "Mercy giải thích bài học bằng ngôn ngữ này",
              en: "Mercy explains lessons in this language",
            },
            native,
          )}
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
            {n.label[n.value]}
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
        {pickChrome(
          {
            vi: "Đổi tiếng mẹ đẻ sẽ thay đổi ngôn ngữ giải thích bài học. Tiến trình của bạn được giữ nguyên.",
            en: "Changing this changes the lesson explanation language — your progress is kept.",
          },
          native,
        )}
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
        {pickChrome(
          { vi: "Ngôn ngữ đang học", en: "Languages you're learning" },
          native,
        )}
        <span style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)" }}>
          {pickChrome(
            {
              vi: "Thêm hoặc bớt bất cứ lúc nào",
              en: "Add or remove anytime",
            },
            native,
          )}
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
              title={badge ? pickChrome(badge, native) : undefined}
              style={chip(active)}
            >
              <span aria-hidden>{meta.flag}</span>
              {targetLabel(item.value, native)}
              {badge ? (
                <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.85 }}>
                  ({pickChrome(badge, native)})
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
        {pickChrome(
          {
            vi: "Bỏ một ngôn ngữ chỉ ẩn nó đi — tiến trình của ngôn ngữ đó vẫn được giữ.",
            en: "Removing a language only hides it; its progress is kept.",
          },
          native,
        )}
      </p>

      {msg ? (
        <p
          role="status"
          style={{
            marginTop: 10,
            fontSize: 12,
            fontWeight: 700,
            color: msg.error
              ? "rgba(180,30,30,0.85)"
              : "rgba(13,148,136,0.95)",
          }}
        >
          {msg.text}
        </p>
      ) : null}
    </div>
  );
}
