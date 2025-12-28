// src/components/room/BilingualEssay.tsx
// MB-BLUE-96.3 — 2025-12-28 (+0700)
/**
 * BilingualEssay
 * Colors identical tokens across EN/VI with the same dark-toned color.
 * Works best for shared terms: AI, Stoicism, Bitcoin, names, etc.
 */

import React, { useMemo } from "react";

function tokenize(s: string) {
  return (s || "")
    .split(/(\s+|[,.!?;:"'(){}\[\]<>/\\\-–—])/g)
    .filter((x) => x !== "");
}

function normToken(t: string) {
  return t
    .toLowerCase()
    .replace(/^[^a-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+/i, "")
    .replace(/[^a-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+$/i, "");
}

function hashColor(key: string) {
  // Dark-toned palette (good contrast on light background)
  const palette = ["#1f2937", "#0f766e", "#7c2d12", "#4338ca", "#9f1239", "#065f46", "#374151"];
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

function buildSharedMap(en: string, vi: string) {
  const enSet = new Set(tokenize(en).map(normToken).filter(Boolean));
  const viSet = new Set(tokenize(vi).map(normToken).filter(Boolean));
  const shared = new Set<string>();
  for (const t of enSet) if (viSet.has(t) && t.length >= 3) shared.add(t); // avoid tiny noise
  return shared;
}

function renderColored(text: string, shared: Set<string>) {
  const parts = tokenize(text);
  return parts.map((p, idx) => {
    const n = normToken(p);
    if (shared.has(n)) {
      const c = hashColor(n);
      return (
        <span key={idx} style={{ color: c, fontWeight: 600 }}>
          {p}
        </span>
      );
    }
    return <span key={idx}>{p}</span>;
  });
}

export function BilingualEssay({
  en,
  vi,
  title,
}: {
  en: string;
  vi: string;
  title?: string;
}) {
  const shared = useMemo(() => buildSharedMap(en, vi), [en, vi]);

  return (
    <section className="rounded-3xl border bg-card/70 backdrop-blur p-6 space-y-4">
      {title ? <h2 className="text-xl font-semibold">{title}</h2> : null}

      <div className="grid gap-6 md:grid-cols-2">
        <article className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground">EN</div>
          <div className="leading-relaxed whitespace-pre-line">{renderColored(en, shared)}</div>
        </article>

        <article className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground">VI</div>
          <div className="leading-relaxed whitespace-pre-line">{renderColored(vi, shared)}</div>
        </article>
      </div>

      {shared.size > 0 ? (
        <div className="text-xs text-muted-foreground">
          Shared terms highlighted: <span className="font-medium">{shared.size}</span>
        </div>
      ) : null}
    </section>
  );
}
