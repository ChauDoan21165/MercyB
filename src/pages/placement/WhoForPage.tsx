// src/pages/placement/WhoForPage.tsx
//
// Screen 2 — "Who is this account for?" (adult vs child).
// Child branch writes a self_report_kid audit row and routes to the kids
// alphabet adventure room. Adult branch routes to /placement/test.

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { savePlacementResult } from '@/lib/placement/persistence';

const PAGE_MAX = 720;

const wrap: React.CSSProperties = {
  width: '100%',
  minHeight: 'calc(100vh - 72px)',
  padding: '32px 16px 64px',
  display: 'flex',
  justifyContent: 'center',
};

const column: React.CSSProperties = {
  width: '100%',
  maxWidth: PAGE_MAX,
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
};

const headingStyle: React.CSSProperties = {
  fontSize: 'clamp(22px, 5.2vw, 30px)',
  fontWeight: 900,
  letterSpacing: -0.4,
  lineHeight: 1.2,
  color: 'rgba(10,10,10,0.94)',
  textAlign: 'center',
  margin: 0,
};

const headingViStyle: React.CSSProperties = {
  display: 'block',
  marginTop: 4,
  fontSize: 14,
  fontWeight: 500,
  color: '#94a3b8',
};

const cardsRow: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 14,
};

const cardsRowDesktop: React.CSSProperties = {
  ...cardsRow,
  gridTemplateColumns: '1fr 1fr',
};

function branchCardStyle(disabled: boolean): React.CSSProperties {
  return {
    textAlign: 'left',
    border: '1px solid rgba(0,0,0,0.10)',
    borderRadius: 18,
    padding: 20,
    background: 'white',
    boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
    cursor: disabled ? 'wait' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    fontFamily: 'inherit',
    color: 'inherit',
    width: '100%',
    minHeight: 140,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  };
}

const cardIcon: React.CSSProperties = {
  fontSize: 30,
  lineHeight: 1,
};

const cardTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 900,
  color: 'rgba(0,0,0,0.90)',
};

const cardTitleVi: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 500,
  color: '#94a3b8',
  marginTop: 2,
};

const cardBody: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.5,
  color: '#475569',
};

const cardBodyVi: React.CSSProperties = {
  marginTop: 4,
  fontSize: 13,
  color: '#94a3b8',
  lineHeight: 1.5,
};

const backLink: React.CSSProperties = {
  alignSelf: 'flex-start',
  color: '#64748b',
  fontSize: 14,
  fontWeight: 600,
  textDecoration: 'none',
  padding: '8px 4px',
};

export default function WhoForPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const isDesktop =
    typeof window !== 'undefined' && window.innerWidth >= 640;

  const handleAdult = () => {
    nav('/placement/test');
  };

  const handleChild = async () => {
    if (submitting) return;
    setSubmitting(true);

    const kidsRoomId = 'alphabet_adventure_kids_l1';

    if (user?.id) {
      // Fire-and-forget — the user still gets routed even if the write
      // fails. Errors land in console only per persistence.ts contract.
      try {
        const res = await savePlacementResult({
          userId: user.id,
          method: 'self_report_kid',
          cefr: 'pre_a1',
          score: null,
          recommendedRoomId: kidsRoomId,
          questionResponses: [],
          weaknessFlags: [],
          elapsedMs: null,
        });
        if (!res.ok && res.errors.length) {
          console.warn('[placement/who] kid self-report errors:', res.errors);
        }
      } catch (err) {
        console.warn('[placement/who] kid self-report threw:', err);
      }
    }

    nav(`/room/${kidsRoomId}`);
  };

  return (
    <div style={wrap}>
      <div style={column}>
        <Link to="/placement" style={backLink}>
          ← Back · Quay lại
        </Link>

        <h1 style={headingStyle}>
          Who is this account for?
          <span style={headingViStyle}>Tài khoản này là của ai?</span>
        </h1>

        <div style={isDesktop ? cardsRowDesktop : cardsRow}>
          <button
            type="button"
            style={branchCardStyle(submitting)}
            onClick={handleAdult}
            disabled={submitting}
            aria-label="Me, an adult learner"
          >
            <div style={cardIcon} aria-hidden>🧑</div>
            <div style={cardTitle}>
              Me — an adult learner
              <span style={cardTitleVi}>Mình — người lớn đang học</span>
            </div>
            <div style={cardBody}>
              Short test, 6–9 minutes, gives you a CEFR level and a
              recommended starting lesson.
              <div style={cardBodyVi}>
                Bài đánh giá ngắn, 6–9 phút, cho bạn trình độ CEFR và bài học
                nên bắt đầu.
              </div>
            </div>
          </button>

          <button
            type="button"
            style={branchCardStyle(submitting)}
            onClick={handleChild}
            disabled={submitting}
            aria-label="My child, ages 4 to 10"
          >
            <div style={cardIcon} aria-hidden>👧</div>
            <div style={cardTitle}>
              My child (ages 4–10)
              <span style={cardTitleVi}>Con của mình (4–10 tuổi)</span>
            </div>
            <div style={cardBody}>
              Kids skip the test and go straight to fun beginner rooms —
              alphabet, colors, animals.
              <div style={cardBodyVi}>
                Trẻ em bỏ qua bài đánh giá và vào thẳng các phòng khởi đầu
                vui — bảng chữ cái, màu sắc, động vật.
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
