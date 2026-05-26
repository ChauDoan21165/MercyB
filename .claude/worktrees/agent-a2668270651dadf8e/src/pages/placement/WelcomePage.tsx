// src/pages/placement/WelcomePage.tsx
//
// Screen 1 of the placement test — lands new users after signup.
// Matches docs/placement-test-wireframes.md "Screen 1 — Welcome / intro".
//
// Polish (2026-05-09): tightened text, reduced block density, added
// optional tap-to-hear on the headline. Audio is pre-recorded native
// English speaker, ~5 seconds, tap-to-play only — no autoplay.

import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SkipModal } from '@/components/placement/SkipModal';
import { useAudioUrl } from '@/hooks/useAudioUrl';

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
  gap: 18,
  textAlign: 'center',
};

const headingRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: 8,
};

const headingStyle: React.CSSProperties = {
  fontSize: 'clamp(22px, 5.5vw, 30px)',
  fontWeight: 900,
  letterSpacing: -0.4,
  lineHeight: 1.2,
  color: 'rgba(10,10,10,0.94)',
  margin: 0,
};

const headingViStyle: React.CSSProperties = {
  display: 'block',
  marginTop: 6,
  fontSize: 14,
  fontWeight: 500,
  color: '#94a3b8',
  letterSpacing: 0,
};

const audioBtnStyle: React.CSSProperties = {
  flex: '0 0 auto',
  width: 36,
  height: 36,
  borderRadius: 9999,
  border: '1px solid rgba(0,0,0,0.10)',
  background: 'white',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  padding: 0,
  marginTop: 2,
  color: 'rgba(0,0,0,0.55)',
  fontSize: 16,
  transition: 'background 0.15s, color 0.15s',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.5,
  color: '#475569',
  margin: 0,
};

const subtitleViStyle: React.CSSProperties = {
  marginTop: 4,
  fontSize: 13,
  color: '#94a3b8',
};

const infoCardStyle: React.CSSProperties = {
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: 16,
  padding: '16px 18px',
  background: 'white',
  boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
  textAlign: 'left',
};

const infoRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
  padding: '8px 0',
};

const infoIcon: React.CSSProperties = {
  fontSize: 20,
  lineHeight: 1.2,
  flex: '0 0 auto',
};

const infoText: React.CSSProperties = {
  flex: 1,
  fontSize: 14,
  fontWeight: 700,
  color: 'rgba(0,0,0,0.86)',
  lineHeight: 1.4,
};

const infoTextVi: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 400,
  color: '#94a3b8',
  marginTop: 1,
};

const primaryBtn: React.CSSProperties = {
  background: '#111827',
  color: 'white',
  borderRadius: 9999,
  minHeight: 46,
  padding: '13px 24px',
  fontSize: 15,
  fontWeight: 900,
  border: 'none',
  cursor: 'pointer',
  width: '100%',
};

const skipLink: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#94a3b8',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  padding: '6px 10px',
};

// Audio key for the pre-recorded welcome headline narration.
// Tap-to-hear only — no autoplay. Resolved via Supabase room-audio bucket.
const WELCOME_AUDIO_KEY = 'placement/welcome-headline.mp3';

export default function WelcomePage() {
  const nav = useNavigate();
  const [skipOpen, setSkipOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const { url: welcomeAudioUrl } = useAudioUrl(WELCOME_AUDIO_KEY);

  const handleToggleAudio = () => {
    if (!audioRef.current) {
      if (!welcomeAudioUrl) return;
      const a = new Audio(welcomeAudioUrl);
      a.preload = 'metadata';
      a.onplay = () => setAudioPlaying(true);
      a.onpause = () => setAudioPlaying(false);
      a.onended = () => setAudioPlaying(false);
      a.onerror = () => setAudioPlaying(false);
      audioRef.current = a;
      a.play().catch(() => setAudioPlaying(false));
    } else if (audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  };

  return (
    <div style={wrap}>
      <div style={column}>
        <div style={headingRow}>
          <h1 style={headingStyle}>
            Find your starting level
            <span style={headingViStyle}>Tìm điểm bắt đầu cho bạn</span>
          </h1>
          <button
            type="button"
            style={audioBtnStyle}
            onClick={handleToggleAudio}
            aria-label={audioPlaying ? 'Pause headline audio' : 'Listen to headline'}
            title={audioPlaying ? 'Pause' : 'Listen'}
          >
            {audioPlaying ? '⏸' : '🔊'}
          </button>
        </div>

        <p style={subtitleStyle}>
          A short test shows your English level and suggests the right first lesson.
          <span style={subtitleViStyle}>
            Bài đánh giá ngắn giúp xác định trình độ và gợi ý bài học đầu tiên.
          </span>
        </p>

        <div style={infoCardStyle}>
          <div style={infoRow}>
            <span style={infoIcon} aria-hidden>⏱️</span>
            <div style={infoText}>
              6–9 minutes
              <span style={infoTextVi}>Khoảng 6–9 phút</span>
            </div>
          </div>
          <div style={infoRow}>
            <span style={infoIcon} aria-hidden>📝</span>
            <div style={infoText}>
              10–12 questions
              <span style={infoTextVi}>10–12 câu hỏi</span>
            </div>
          </div>
          <div style={infoRow}>
            <span style={infoIcon} aria-hidden>🇻🇳</span>
            <div style={infoText}>
              English + tiếng Việt
              <span style={infoTextVi}>Song ngữ trong suốt bài</span>
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
            Bắt đầu bài đánh giá
          </span>
        </button>

        <button
          type="button"
          style={skipLink}
          onClick={() => setSkipOpen(true)}
        >
          Skip — I'll explore on my own
          <span style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
            Bỏ qua — tôi sẽ tự khám phá
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
