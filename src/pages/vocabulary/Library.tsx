// /vocabulary — full library view, three buckets:
//   - Due now      (next_review_at <= now)
//   - Coming up    (next 7 days)
//   - Mastered     (repetitions >= 8 AND interval_days >= 30)
//
// Search box filters by word substring (case-insensitive). Source
// attribution renders as a small chip on each row when present.
//
// Like ReviewSession, we surface tone gently: no shame language for
// "due now" — it's just where the queue stands.

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "@/providers/AuthProvider";
import {
  bucketFor,
  daysUntil,
  fetchAllVocabulary,
  type LibraryBucket,
  type VocabularyEntry,
} from "@/lib/vocabulary/repository";

type Phase = "loading" | "ready" | "anon" | "error";

export default function VocabularyLibraryPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [phase, setPhase] = useState<Phase>("loading");
  const [entries, setEntries] = useState<VocabularyEntry[]>([]);
  const [search, setSearch] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setPhase("anon");
      return;
    }
    let alive = true;
    setPhase("loading");
    fetchAllVocabulary()
      .then((rows) => {
        if (!alive) return;
        setEntries(rows);
        setPhase("ready");
      })
      .catch((err) => {
        if (!alive) return;
        setError(err instanceof Error ? err.message : "Failed to load library.");
        setPhase("error");
      });
    return () => {
      alive = false;
    };
  }, [authLoading, user]);

  const grouped = useMemo(() => groupEntries(entries, search), [entries, search]);

  if (phase === "anon") {
    return (
      <div style={pageStyle}>
        <Header />
        <p style={emptyStyle}>
          Đăng nhập để xem thư viện từ vựng của bạn.
          <br />
          <span style={emptyEnStyle}>Sign in to see your vocabulary library.</span>
        </p>
        <Link to="/signin?next=/vocabulary" style={primaryBtnStyle}>
          Đăng nhập · Sign in
        </Link>
      </div>
    );
  }

  if (phase === "loading") {
    return (
      <div style={pageStyle}>
        <Header />
        <p style={emptyStyle}>Đang tải… · Loading…</p>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div style={pageStyle}>
        <Header />
        <p style={emptyStyle}>
          {error ?? "Failed to load."}
        </p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div style={pageStyle}>
        <Header />
        <section style={emptyCardStyle}>
          <div style={{ fontSize: 28 }}>📚</div>
          <h2 style={emptyHeadingStyle}>Chưa có từ nào trong thư viện.</h2>
          <p style={emptyEnStyle}>
            Words will appear here as you encounter them in lessons.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <Header />
      <SearchBox value={search} onChange={setSearch} />

      {grouped.due_now.length > 0 ? (
        <BucketSection
          vi="Cần ôn ngay"
          en="Due now"
          accent="#ef4444"
          rows={grouped.due_now}
          showDays={false}
        />
      ) : null}

      {grouped.coming_up.length > 0 ? (
        <BucketSection
          vi="Sắp tới"
          en="Coming up"
          accent="#6366f1"
          rows={grouped.coming_up}
          showDays
        />
      ) : null}

      {grouped.mastered.length > 0 ? (
        <BucketSection
          vi="Đã thuộc"
          en="Mastered"
          accent="#22c55e"
          rows={grouped.mastered}
          showDays={false}
        />
      ) : null}

      <p style={footerNoteStyle}>
        Tổng cộng {entries.length} từ · {entries.length} words total
      </p>

      <Link to="/vocabulary/review" style={primaryBtnStyle}>
        Bắt đầu ôn · Start review
      </Link>
    </div>
  );
}

// ── Pure grouping helper (exported for tests) ───────────────────────────

export type GroupedLibrary = Record<LibraryBucket, VocabularyEntry[]>;

export function groupEntries(
  entries: VocabularyEntry[],
  search: string,
  nowMs: number = Date.now(),
): GroupedLibrary {
  const q = search.trim().toLowerCase();
  const horizon = nowMs + 7 * 24 * 60 * 60 * 1000;
  const out: GroupedLibrary = { due_now: [], coming_up: [], mastered: [] };
  for (const e of entries) {
    if (q && !e.word.toLowerCase().includes(q)) continue;
    const bucket = bucketFor(e, nowMs);
    if (bucket === "coming_up") {
      // Coming-up section is capped at the next-7-days horizon for the
      // calm-list rule. Cards beyond that fall through to nothing on
      // this page; they reappear once they enter the 7-day window.
      const dueMs = new Date(e.next_review_at).getTime();
      if (dueMs > horizon) continue;
    }
    out[bucket].push(e);
  }
  return out;
}

// ── Subcomponents ───────────────────────────────────────────────────────

function Header() {
  return (
    <header style={headerStyle}>
      <Link to="/" style={backLinkStyle}>
        ← Trang chủ
      </Link>
      <div style={{ textAlign: "right" }}>
        <div style={titleViStyle}>Thư viện từ vựng</div>
        <div style={titleEnStyle}>Vocabulary library</div>
      </div>
    </header>
  );
}

function SearchBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Tìm từ… · Search words…"
      aria-label="Tìm từ"
      style={searchStyle}
      data-testid="vocab-search"
    />
  );
}

function BucketSection({
  vi,
  en,
  accent,
  rows,
  showDays,
}: {
  vi: string;
  en: string;
  accent: string;
  rows: VocabularyEntry[];
  showDays: boolean;
}) {
  return (
    <section style={sectionStyle} aria-label={`${vi} · ${en}`}>
      <header style={sectionHeaderStyle}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span aria-hidden style={{ ...accentDotStyle, background: accent }} />
          <h2 style={sectionTitleViStyle}>{vi}</h2>
          <span style={sectionCountStyle}>{rows.length}</span>
        </div>
        <span style={sectionTitleEnStyle}>{en}</span>
      </header>
      <ul style={rowListStyle}>
        {rows.map((row) => (
          <Row key={row.id} entry={row} showDays={showDays} />
        ))}
      </ul>
    </section>
  );
}

function Row({
  entry,
  showDays,
}: {
  entry: VocabularyEntry;
  showDays: boolean;
}) {
  const days = showDays ? daysUntil(entry, Date.now()) : 0;
  return (
    <li style={rowStyle}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={rowWordStyle}>
          <span style={rowWordTextStyle}>{entry.word}</span>
          {entry.ipa ? <span style={rowIpaStyle}>{entry.ipa}</span> : null}
        </div>
        {entry.definition_vi ? (
          <div style={rowDefStyle}>{entry.definition_vi}</div>
        ) : null}
        {entry.source ? (
          <span style={rowSourceStyle} title="Nguồn · source">
            {entry.source}
          </span>
        ) : null}
      </div>
      {showDays ? (
        <span style={rowDaysStyle}>
          {days === 0 ? "<1d" : `${days}d`}
        </span>
      ) : null}
    </li>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  maxWidth: 720,
  margin: "0 auto",
  padding: "16px 14px 80px",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
};

const backLinkStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "rgba(67,56,202,0.85)",
  textDecoration: "none",
  padding: "6px 10px",
  borderRadius: 9999,
  background: "rgba(99,102,241,0.06)",
  border: "1px solid rgba(99,102,241,0.20)",
};

const titleViStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  color: "rgba(15,23,42,0.92)",
};

const titleEnStyle: React.CSSProperties = {
  fontSize: 11,
  color: "rgba(0,0,0,0.55)",
  marginTop: 2,
};

const searchStyle: React.CSSProperties = {
  marginTop: 4,
  width: "100%",
  padding: "10px 14px",
  borderRadius: 9999,
  border: "1px solid rgba(0,0,0,0.12)",
  fontSize: 14,
  outline: "none",
};

const sectionStyle: React.CSSProperties = {
  marginTop: 8,
  padding: 12,
  borderRadius: 12,
  background: "white",
  border: "1px solid rgba(0,0,0,0.06)",
};

const sectionHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  marginBottom: 10,
};

const accentDotStyle: React.CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: 9999,
  display: "inline-block",
};

const sectionTitleViStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: "rgba(15,23,42,0.92)",
};

const sectionTitleEnStyle: React.CSSProperties = {
  fontSize: 11,
  color: "rgba(0,0,0,0.5)",
};

const sectionCountStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  color: "rgba(0,0,0,0.55)",
};

const rowListStyle: React.CSSProperties = {
  margin: 0,
  padding: 0,
  listStyle: "none",
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "8px 10px",
  borderRadius: 8,
  background: "rgba(0,0,0,0.02)",
};

const rowWordStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: 8,
  flexWrap: "wrap",
};

const rowWordTextStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 800,
  color: "rgba(15,23,42,0.92)",
};

const rowIpaStyle: React.CSSProperties = {
  fontSize: 12,
  color: "rgba(67,56,202,0.85)",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

const rowDefStyle: React.CSSProperties = {
  marginTop: 2,
  fontSize: 12,
  color: "rgba(0,0,0,0.65)",
};

const rowSourceStyle: React.CSSProperties = {
  marginTop: 4,
  display: "inline-block",
  padding: "1px 6px",
  borderRadius: 4,
  background: "rgba(99,102,241,0.08)",
  color: "rgba(67,56,202,0.85)",
  fontSize: 10,
  fontWeight: 700,
};

const rowDaysStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  color: "rgba(0,0,0,0.55)",
  flexShrink: 0,
};

const emptyCardStyle: React.CSSProperties = {
  marginTop: 24,
  padding: 24,
  borderRadius: 16,
  background:
    "linear-gradient(150deg, rgba(238,242,255,0.96) 0%, rgba(252,252,255,0.96) 100%)",
  border: "1px solid rgba(99,102,241,0.20)",
  textAlign: "center",
};

const emptyHeadingStyle: React.CSSProperties = {
  marginTop: 6,
  fontSize: 16,
  fontWeight: 800,
  color: "rgba(15,23,42,0.92)",
};

const emptyStyle: React.CSSProperties = {
  fontSize: 14,
  color: "rgba(0,0,0,0.7)",
  marginTop: 24,
  textAlign: "center",
  lineHeight: 1.6,
};

const emptyEnStyle: React.CSSProperties = {
  fontSize: 12,
  color: "rgba(0,0,0,0.5)",
};

const footerNoteStyle: React.CSSProperties = {
  marginTop: 6,
  fontSize: 11,
  color: "rgba(0,0,0,0.45)",
  textAlign: "center",
};

const primaryBtnStyle: React.CSSProperties = {
  alignSelf: "center",
  marginTop: 12,
  padding: "10px 18px",
  borderRadius: 9999,
  background: "linear-gradient(150deg, #6366F1 0%, #4F46E5 100%)",
  color: "white",
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 13,
};
