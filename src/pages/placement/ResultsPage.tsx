// src/pages/placement/ResultsPage.tsx
//
// Screen 6 — Results.
// Reads the stashed engine result, writes persistence to Supabase
// (fire-and-forget; UI never blocks on the write), and renders:
//   - CEFR level card with bilingual tagline
//   - "Start here" recommended-room card
//   - Secondary retake + browse-other-lessons buttons

import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '@/providers/AuthProvider';
import { mapEstimateToCefr, type ResultCEFR } from '@/lib/placement/engine';
import { CEFR_TAGLINE } from '@/lib/placement/cefrToRoom';
import { savePlacementResult } from '@/lib/placement/persistence';
import { clearStashedResult, readStashedResult } from './resultStash';

const PAGE_MAX = 720;

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

const banner: React.CSSProperties = {
  background: '#FFF8F3',
  border: '1px solid rgba(180,83,9,0.14)',
  borderRadius: 20,
  padding: '20px 22px',
  textAlign: 'center',
};

const bannerHeading: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 900,
  letterSpacing: -0.3,
  color: 'rgba(80,40,10,0.92)',
  margin: 0,
  lineHeight: 1.2,
};

const bannerHeadingVi: React.CSSProperties = {
  display: 'block',
  marginTop: 4,
  fontSize: 13,
  fontWeight: 500,
  color: '#94a3b8',
};

const bannerSub: React.CSSProperties = {
  marginTop: 8,
  fontSize: 14,
  color: '#475569',
  lineHeight: 1.5,
};

const bannerSubVi: React.CSSProperties = {
  display: 'block',
  marginTop: 4,
  fontSize: 13,
  color: '#94a3b8',
};

const levelCard: React.CSSProperties = {
  background: 'white',
  border: '1px solid rgba(0,0,0,0.10)',
  borderRadius: 18,
  padding: 24,
  boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
  textAlign: 'center',
};

const tinyLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: 0.6,
  color: 'rgba(0,0,0,0.55)',
};

const tinyLabelVi: React.CSSProperties = {
  display: 'inline',
  marginLeft: 6,
  fontSize: 12,
  fontWeight: 400,
  color: '#94a3b8',
  textTransform: 'none',
  letterSpacing: 0,
};

const hugeLevel: React.CSSProperties = {
  fontSize: 64,
  fontWeight: 950,
  letterSpacing: -2,
  color: '#059669',
  lineHeight: 1.05,
  margin: '10px 0 4px',
};

const taglineEn: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  color: 'rgba(0,0,0,0.84)',
};

const taglineVi: React.CSSProperties = {
  marginTop: 4,
  fontSize: 14,
  color: '#94a3b8',
};

const startCard: React.CSSProperties = {
  background: 'white',
  border: '2px solid rgba(16,185,129,0.24)',
  borderRadius: 18,
  padding: 22,
  boxShadow: '0 10px 30px rgba(16,185,129,0.08)',
};

const roomTitle: React.CSSProperties = {
  marginTop: 10,
  fontSize: 20,
  fontWeight: 800,
  color: 'rgba(0,0,0,0.90)',
  lineHeight: 1.3,
};

const roomTitleVi: React.CSSProperties = {
  marginTop: 4,
  fontSize: 14,
  color: '#94a3b8',
  lineHeight: 1.4,
};

const roomDescription: React.CSSProperties = {
  marginTop: 10,
  fontSize: 14,
  lineHeight: 1.6,
  color: '#475569',
};

const roomDescriptionVi: React.CSSProperties = {
  marginTop: 4,
  fontSize: 13,
  color: '#94a3b8',
  lineHeight: 1.55,
};

const primaryBtn: React.CSSProperties = {
  marginTop: 18,
  background: '#111827',
  color: 'white',
  borderRadius: 9999,
  minHeight: 48,
  padding: '14px 24px',
  fontSize: 16,
  fontWeight: 900,
  border: 'none',
  cursor: 'pointer',
  width: '100%',
};

const secondaryRow: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 10,
};

const ghostBtn: React.CSSProperties = {
  background: 'white',
  color: 'rgba(0,0,0,0.78)',
  border: '1px solid rgba(0,0,0,0.14)',
  borderRadius: 14,
  minHeight: 44,
  padding: '10px 16px',
  fontSize: 14,
  fontWeight: 700,
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center' as const,
};

const statsFooter: React.CSSProperties = {
  marginTop: 8,
  textAlign: 'center',
  fontSize: 12,
  color: '#94a3b8',
};

type RoomInfo = {
  title?: { en?: string; vi?: string };
  content?: { en?: string; vi?: string };
};

async function loadRoomInfo(roomId: string): Promise<RoomInfo | null> {
  try {
    const res = await fetch(`/data/${roomId}.json`);
    if (!res.ok) return null;
    return (await res.json()) as RoomInfo;
  } catch {
    return null;
  }
}

function formatDate(d: Date): { en: string; vi: string } {
  const day = d.getDate();
  const year = d.getFullYear();
  const enMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const enMonth = enMonths[d.getMonth()];
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    en: `${day} ${enMonth} ${year}`,
    vi: `${pad(day)}/${pad(d.getMonth() + 1)}/${year}`,
  };
}

export default function ResultsPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);

  const stashed = useMemo(() => readStashedResult(), []);

  // If there's nothing to show, bounce back to the welcome screen.
  if (!stashed) {
    return <Navigate to="/placement" replace />;
  }

  const { snapshot, roomId, elapsedMs } = stashed;
  const cefr: ResultCEFR =
    snapshot.finalCefr ?? mapEstimateToCefr(snapshot.estimate);
  const tagline = CEFR_TAGLINE[cefr];
  const questionCount = snapshot.responses.length;

  // Fetch recommended room metadata once.
  useEffect(() => {
    let cancelled = false;
    loadRoomInfo(roomId).then((info) => {
      if (!cancelled) setRoomInfo(info);
    });
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  // Persist (fire-and-forget) — UI never waits on this.
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await savePlacementResult({
          userId: user.id,
          method: 'test',
          cefr,
          score: snapshot.estimate,
          recommendedRoomId: roomId,
          questionResponses: snapshot.responses,
          weaknessFlags: snapshot.weaknessFlags,
          elapsedMs,
        });
        if (!cancelled && !res.ok && res.errors.length) {
          console.warn('[placement/results] save errors:', res.errors);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('[placement/results] save threw:', err);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, cefr, roomId, elapsedMs, snapshot]);

  // Clear the stash on unmount so navigating back doesn't re-show stale
  // results. We clear only when the user leaves — not on first render —
  // so a page refresh still works.
  useEffect(() => {
    return () => {
      clearStashedResult();
    };
  }, []);

  const displayCefr = cefr === 'pre_a1' ? 'Pre-A1' : cefr;
  const date = formatDate(new Date());

  const displayTitleEn =
    roomInfo?.title?.en || 'Your recommended starting lesson';
  const displayTitleVi = roomInfo?.title?.vi || 'Bài học được gợi ý để bắt đầu';
  const displayDescEn = roomInfo?.content?.en;
  const displayDescVi = roomInfo?.content?.vi;

  return (
    <div style={wrap}>
      <div style={column}>
        <section style={banner}>
          <h1 style={bannerHeading}>
            Here's what we found
            <span style={bannerHeadingVi}>Kết quả của bạn đây</span>
          </h1>
          <p style={bannerSub}>
            Based on your answers. You can retake anytime.
            <span style={bannerSubVi}>
              Dựa trên các câu trả lời của bạn. Bạn có thể làm lại bất cứ lúc nào.
            </span>
          </p>
        </section>

        <section style={levelCard}>
          <div>
            <span style={tinyLabel}>Your level</span>
            <span style={tinyLabelVi}>· Trình độ của bạn</span>
          </div>
          <div style={hugeLevel}>{displayCefr}</div>
          <div style={taglineEn}>{tagline.en}</div>
          <div style={taglineVi}>{tagline.vi}</div>
        </section>

        <section style={startCard}>
          <div>
            <span style={tinyLabel}>Recommended starting lesson</span>
            <span style={tinyLabelVi}>· Bài học được gợi ý để bắt đầu</span>
          </div>
          <div style={roomTitle}>{displayTitleEn}</div>
          <div style={roomTitleVi}>{displayTitleVi}</div>
          {displayDescEn ? (
            <>
              <p style={roomDescription}>{displayDescEn}</p>
              {displayDescVi ? (
                <p style={roomDescriptionVi}>{displayDescVi}</p>
              ) : null}
            </>
          ) : null}

          <button
            type="button"
            style={primaryBtn}
            onClick={() => nav(`/room/${roomId}`)}
          >
            Start this lesson
            <span style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.78)', marginTop: 2 }}>
              Bắt đầu bài học
            </span>
          </button>
        </section>

        <div style={secondaryRow}>
          <Link to="/rooms" style={ghostBtn}>
            Browse all lessons · Xem tất cả bài học
          </Link>
          <Link to="/placement" style={ghostBtn}>
            Retake test · Làm lại bài đánh giá
          </Link>
        </div>

        <div style={statsFooter}>
          {questionCount} questions · {date.en}
          <br />
          {questionCount} câu · {date.vi}
        </div>
      </div>
    </div>
  );
}
