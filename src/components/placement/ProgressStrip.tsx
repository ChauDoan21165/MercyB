// src/components/placement/ProgressStrip.tsx
//
// Persistent progress indicator across the placement test. Sticky under
// the app header per wireframe Screen 5. No skip link here (Revision A);
// only progress bar + bilingual count label.

import React from 'react';

type Props = {
  /** 1-indexed ordinal of the question currently on screen. */
  current: number;
  /** Target total (the tilde in the label signals it's approximate). */
  total: number;
};

export function ProgressStrip({ current, total }: Props) {
  const safeTotal = Math.max(1, total);
  const pct = Math.min(100, Math.max(0, (current - 1) / safeTotal * 100));

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        padding: '10px 16px',
      }}
      aria-label="Placement test progress"
    >
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        style={{
          height: 4,
          background: '#e2e8f0',
          borderRadius: 9999,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: '#10b981',
            borderRadius: 9999,
            transition: 'width 240ms ease',
          }}
        />
      </div>
      <div
        style={{
          marginTop: 6,
          textAlign: 'center',
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
          color: 'rgba(0,0,0,0.55)',
        }}
      >
        Question {current} of ~{total}
        <span
          style={{
            display: 'block',
            fontSize: 11,
            fontWeight: 400,
            color: '#64748b',
            textTransform: 'none',
            letterSpacing: 0,
            marginTop: 2,
          }}
        >
          Câu {current} / ~{total}
        </span>
      </div>
    </div>
  );
}

export default ProgressStrip;
