// src/pages/SpeechDrillPage.tsx
//
// Full-page route at /speak. Cycles a learner through the starter
// sentence library (src/data/speech-sentences.json, 100+ items, 25
// per CEFR level), one at a time, using the SpeechDrill component
// over CC1's pronunciation library.
//
// Level filtering: ?cefr=A1|A2|B1|B2 query param. Also exposed via a
// dropdown on the page so users can switch levels without editing
// the URL. "All" = every level in insertion order.
//
// MVP scope: no persistence. Scores live in component state, cleared
// on page unload. DB logging is Wave 2 Step 3.
//
// Feature flag: pronunciationScoringEnabled. When off, the page
// redirects to Home (via <Navigate>) rather than rendering a
// placeholder — keeps the feature fully invisible until launch.

import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { SpeechDrill } from '@/components/speech/SpeechDrill';
import {
  SENTENCE_CEFR_LEVELS,
  parseCefrParam,
  sentencesForCefr,
  type SentenceCefr,
} from '@/data/speechSentencesSchema';

const PAGE_MAX = 680;

const wrap: React.CSSProperties = {
  width: '100%',
  minHeight: 'calc(100vh - 72px)',
  padding: '24px 16px 80px',
  display: 'flex',
  justifyContent: 'center',
};

const column: React.CSSProperties = {
  width: '100%',
  maxWidth: PAGE_MAX,
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
};

const progressBarTrack: React.CSSProperties = {
  height: 4,
  background: '#e2e8f0',
  borderRadius: 9999,
  overflow: 'hidden',
};

const progressLabel: React.CSSProperties = {
  marginTop: 8,
  textAlign: 'center',
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 0.6,
  color: 'rgba(0,0,0,0.55)',
};

const progressLabelVi: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 400,
  color: '#94a3b8',
  textTransform: 'none',
  letterSpacing: 0,
  marginTop: 2,
};

const levelSelectRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
  flexWrap: 'wrap',
};

const levelLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: 0.6,
  color: 'rgba(0,0,0,0.55)',
};

const levelLabelViStyle: React.CSSProperties = {
  display: 'inline',
  marginLeft: 6,
  fontSize: 12,
  fontWeight: 400,
  color: '#94a3b8',
  textTransform: 'none',
  letterSpacing: 0,
};

const levelSelectStyle: React.CSSProperties = {
  border: '1px solid rgba(0,0,0,0.14)',
  borderRadius: 9999,
  background: 'white',
  fontSize: 14,
  fontWeight: 700,
  padding: '8px 14px',
  color: 'rgba(0,0,0,0.78)',
  cursor: 'pointer',
  minHeight: 38,
  fontFamily: 'inherit',
};

const cefrBadgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '4px 10px',
  borderRadius: 9999,
  background: '#ecfdf5',
  color: '#047857',
  border: '1px solid rgba(5,150,105,0.22)',
  fontSize: 11,
  fontWeight: 900,
  textTransform: 'uppercase',
  letterSpacing: 0.6,
};

const finishCard: React.CSSProperties = {
  border: '1px solid rgba(0,0,0,0.10)',
  borderRadius: 22,
  padding: 32,
  background: 'white',
  boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
  textAlign: 'center',
};

const primaryBtn: React.CSSProperties = {
  marginTop: 22,
  background: '#111827',
  color: 'white',
  borderRadius: 9999,
  minHeight: 48,
  padding: '14px 28px',
  fontSize: 15,
  fontWeight: 900,
  border: 'none',
  cursor: 'pointer',
};

type LevelSelection = SentenceCefr | 'ALL';

const LEVEL_LABELS: Record<LevelSelection, { en: string; vi: string }> = {
  ALL: { en: 'All levels', vi: 'Tất cả trình độ' },
  A1:  { en: 'A1 — Beginner', vi: 'A1 — Sơ khởi' },
  A2:  { en: 'A2 — Elementary', vi: 'A2 — Sơ cấp' },
  B1:  { en: 'B1 — Intermediate', vi: 'B1 — Trung cấp' },
  B2:  { en: 'B2 — Upper intermediate', vi: 'B2 — Trung cấp cao' },
};

function contextLabel(context: string): string {
  // Convert snake_case / lowercase context tags into Title Case.
  if (!context) return '';
  return context
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

export default function SpeechDrillPage() {
  const { enabled, loading } = useFeatureFlag('pronunciationScoringEnabled', false);
  const [searchParams, setSearchParams] = useSearchParams();

  const urlLevel: LevelSelection = parseCefrParam(searchParams.get('cefr'));
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset position whenever the level changes (user either flips the
  // dropdown or navigates with a new ?cefr=).
  useEffect(() => {
    setCurrentIndex(0);
  }, [urlLevel]);

  const activeSentences = useMemo(
    () => sentencesForCefr(urlLevel),
    [urlLevel],
  );

  const total = activeSentences.length;
  const current = activeSentences[currentIndex];
  const isDone = currentIndex >= total;

  const progressPct = useMemo(() => {
    if (total === 0) return 0;
    return Math.min(100, Math.round((currentIndex / total) * 100));
  }, [currentIndex, total]);

  const handleLevelChange = (next: LevelSelection) => {
    if (next === 'ALL') {
      // Clear the query param rather than write ?cefr=ALL — cleaner URL,
      // matches parseCefrParam's "missing means all" default.
      searchParams.delete('cefr');
    } else {
      searchParams.set('cefr', next);
    }
    setSearchParams(searchParams, { replace: true });
  };

  if (loading) {
    return <div style={{ padding: 24, opacity: 0.72 }}>Loading…</div>;
  }
  if (!enabled) {
    return <Navigate to="/" replace />;
  }

  const levelSelector = (
    <div style={levelSelectRow}>
      <label htmlFor="speech-level" style={levelLabelStyle}>
        Level
        <span style={levelLabelViStyle}>· Trình độ</span>
      </label>
      <select
        id="speech-level"
        value={urlLevel}
        onChange={(e) => handleLevelChange(e.target.value as LevelSelection)}
        style={levelSelectStyle}
      >
        <option value="ALL">{LEVEL_LABELS.ALL.en} · {LEVEL_LABELS.ALL.vi}</option>
        {SENTENCE_CEFR_LEVELS.map((lvl) => (
          <option key={lvl} value={lvl}>
            {LEVEL_LABELS[lvl].en} · {LEVEL_LABELS[lvl].vi}
          </option>
        ))}
      </select>
    </div>
  );

  if (isDone || !current) {
    return (
      <div style={wrap}>
        <div style={column}>
          {levelSelector}
          <section style={finishCard}>
            <div style={{ fontSize: 48 }} aria-hidden>✨</div>
            <h1
              style={{
                marginTop: 8,
                fontSize: 24,
                fontWeight: 900,
                letterSpacing: -0.3,
                color: 'rgba(10,10,10,0.94)',
              }}
            >
              Nice work. You made it through all {total}.
              <span
                style={{
                  display: 'block',
                  marginTop: 6,
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#94a3b8',
                }}
              >
                Làm tốt lắm. Bạn đã hoàn thành cả {total} câu.
              </span>
            </h1>
            <button
              type="button"
              style={primaryBtn}
              onClick={() => setCurrentIndex(0)}
            >
              Start over · Làm lại từ đầu
            </button>
          </section>
        </div>
      </div>
    );
  }

  const ordinal = currentIndex + 1;
  const badgeText = `${current.cefr} · ${contextLabel(current.context)}`;

  return (
    <div style={wrap}>
      <div style={column}>
        {levelSelector}

        <section aria-label="Progress">
          <div style={progressBarTrack}>
            <div
              style={{
                height: '100%',
                width: `${progressPct}%`,
                background: '#10b981',
                borderRadius: 9999,
                transition: 'width 240ms ease',
              }}
              role="progressbar"
              aria-valuenow={ordinal}
              aria-valuemin={1}
              aria-valuemax={total}
            />
          </div>
          <div style={progressLabel}>
            Sentence {ordinal} of {total}
            <span style={progressLabelVi}>Câu {ordinal} / {total}</span>
          </div>
        </section>

        <div style={{ textAlign: 'center' }}>
          <span style={cefrBadgeStyle}>{badgeText}</span>
        </div>

        <SpeechDrill
          // Force a clean mount when the sentence changes so internal
          // state machine resets (idle → result persists would be wrong).
          key={current.id}
          targetSentence={current.target_en}
          targetSentenceVi={current.target_vi}
          onNext={() => setCurrentIndex((i) => i + 1)}
        />
      </div>
    </div>
  );
}
