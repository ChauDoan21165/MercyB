// src/pages/SpeechDrillPage.tsx
//
// Full-page route at /speak. Cycles a learner through 10 beginner-
// friendly English sentences, one at a time, using the SpeechDrill
// component over CC1's pronunciation library.
//
// MVP scope: no persistence. Scores live in component state, cleared
// on page unload. DB logging is Wave 2 Step 3.
//
// Feature flag: pronunciationScoringEnabled. When off, the page
// redirects to Home (via <Navigate>) rather than rendering a
// placeholder — keeps the feature fully invisible until launch.

import React, { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { SpeechDrill } from '@/components/speech/SpeechDrill';

type Sentence = {
  en: string;
  vi: string;
};

// Beginner-friendly starter set. Short, everyday phrases — tuned for
// A1/A2 learners taking their first shot at the mic. Keep them 4–8
// words so the score isn't punishing on a single misheard word.
const STARTER_SENTENCES: Sentence[] = [
  { en: 'I would like a glass of water.',     vi: 'Cho tôi một ly nước.' },
  { en: 'How much does this cost?',           vi: 'Cái này giá bao nhiêu?' },
  { en: 'Where is the nearest bus stop?',     vi: 'Trạm xe buýt gần nhất ở đâu?' },
  { en: 'My name is Anh. Nice to meet you.',  vi: 'Tôi tên là Anh. Rất vui được gặp bạn.' },
  { en: 'I am learning English every day.',   vi: 'Tôi đang học tiếng Anh mỗi ngày.' },
  { en: 'Could you please speak slower?',     vi: 'Bạn có thể nói chậm lại không?' },
  { en: 'What time does the store open?',     vi: 'Cửa hàng mở cửa lúc mấy giờ?' },
  { en: 'I have two younger brothers.',       vi: 'Tôi có hai em trai.' },
  { en: 'The coffee is very hot today.',      vi: 'Cà phê hôm nay rất nóng.' },
  { en: 'Thank you for your help.',           vi: 'Cảm ơn bạn đã giúp đỡ.' },
];

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

export default function SpeechDrillPage() {
  const { enabled, loading } = useFeatureFlag('pronunciationScoringEnabled', false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = STARTER_SENTENCES.length;
  const current = STARTER_SENTENCES[currentIndex];
  const isDone = currentIndex >= total;

  const progressPct = useMemo(() => {
    return Math.min(100, Math.round((currentIndex / total) * 100));
  }, [currentIndex, total]);

  if (loading) {
    return <div style={{ padding: 24, opacity: 0.72 }}>Loading…</div>;
  }
  if (!enabled) {
    return <Navigate to="/" replace />;
  }

  if (isDone) {
    return (
      <div style={wrap}>
        <div style={column}>
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

  return (
    <div style={wrap}>
      <div style={column}>
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

        <SpeechDrill
          // Force a clean mount when the sentence changes so internal
          // state machine resets (idle → result persists would be wrong).
          key={currentIndex}
          targetSentence={current.en}
          targetSentenceVi={current.vi}
          onNext={() => setCurrentIndex((i) => i + 1)}
        />
      </div>
    </div>
  );
}
