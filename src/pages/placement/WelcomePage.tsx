// src/pages/placement/WelcomePage.tsx
//
// Screen 1 of the placement test — lands new users after signup.
// Matches docs/placement-test-wireframes.md "Screen 1 — Welcome / intro".

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SkipModal } from '@/components/placement/SkipModal';

const PAGE_MAX = 520;

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
  gap: 24,
  textAlign: 'center',
};

const headingStyle: React.CSSProperties = {
  fontSize: 'clamp(24px, 6vw, 36px)',
  fontWeight: 950,
  letterSpacing: -0.6,
  lineHeight: 1.15,
  color: 'rgba(10,10,10,0.96)',
  margin: 0,
};

const headingViStyle: React.CSSProperties = {
  display: 'block',
  marginTop: 6,
  fontSize: 16,
  fontWeight: 500,
  color: '#94a3b8',
  letterSpacing: 0,
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.55,
  color: '#475569',
  margin: 0,
};

const subtitleViStyle: React.CSSProperties = {
  marginTop: 6,
  fontSize: 14,
  color: '#94a3b8',
};

const infoCardStyle: React.CSSProperties = {
  border: '1px solid rgba(0,0,0,0.10)',
  borderRadius: 18,
  padding: 20,
  background: 'white',
  boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
  textAlign: 'left',
};

const infoRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  padding: '10px 0',
};

const infoIcon: React.CSSProperties = {
  fontSize: 22,
  lineHeight: 1.2,
  flex: '0 0 auto',
};

const infoText: React.CSSProperties = {
  flex: 1,
  fontSize: 15,
  fontWeight: 700,
  color: 'rgba(0,0,0,0.88)',
  lineHeight: 1.45,
};

const infoTextVi: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 400,
  color: '#94a3b8',
  marginTop: 2,
};

const primaryBtn: React.CSSProperties = {
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

const skipLink: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#64748b',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  padding: '8px 12px',
};

export default function WelcomePage() {
  const nav = useNavigate();
  const [skipOpen, setSkipOpen] = useState(false);

  return (
    <div style={wrap}>
      <div style={column}>
        <h1 style={headingStyle}>
          Let's find where you should start
          <span style={headingViStyle}>Hãy tìm điểm bắt đầu phù hợp cho bạn</span>
        </h1>

        <p style={subtitleStyle}>
          A short test will show us your English level and point you at the
          first lesson that fits — no guessing.
          <span style={subtitleViStyle}>
            Một bài đánh giá ngắn sẽ cho chúng tôi biết trình độ của bạn và
            giới thiệu bài học đầu tiên phù hợp — bạn không phải tự đoán.
          </span>
        </p>

        <div style={infoCardStyle}>
          <div style={infoRow}>
            <span style={infoIcon} aria-hidden>⏱️</span>
            <div style={infoText}>
              About 6–9 minutes
              <span style={infoTextVi}>Khoảng 6–9 phút</span>
            </div>
          </div>
          <div style={infoRow}>
            <span style={infoIcon} aria-hidden>📝</span>
            <div style={infoText}>
              10–12 questions (fewer or more based on your answers)
              <span style={infoTextVi}>
                10–12 câu hỏi (có thể ít hoặc nhiều tuỳ câu trả lời)
              </span>
            </div>
          </div>
          <div style={infoRow}>
            <span style={infoIcon} aria-hidden>🇻🇳</span>
            <div style={infoText}>
              Bilingual support — English + Vietnamese throughout
              <span style={infoTextVi}>
                Song ngữ — Tiếng Anh + Tiếng Việt suốt bài
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          style={primaryBtn}
          onClick={() => nav('/placement/who')}
        >
          Start placement test
          <span style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.78)', marginTop: 2 }}>
            Bắt đầu đánh giá
          </span>
        </button>

        <button
          type="button"
          style={skipLink}
          onClick={() => setSkipOpen(true)}
        >
          Skip for now — I'll explore on my own
          <span style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
            Bỏ qua — để tôi tự khám phá
          </span>
        </button>
      </div>

      <SkipModal
        open={skipOpen}
        onOpenChange={setSkipOpen}
        onKeepTesting={() => setSkipOpen(false)}
        onSkip={() => {
          setSkipOpen(false);
          nav('/');
        }}
      />
    </div>
  );
}
