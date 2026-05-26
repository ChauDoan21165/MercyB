// src/components/placement/SkipModal.tsx
//
// Confirmation dialog shown when the user tries to skip the placement
// test. Per wireframe Screen 7 / Revision Q4:
//   - "Keep testing" is the PRIMARY action (encourages completion)
//   - "Yes, skip" is the ghost action
// Shown on:
//   - Welcome screen "Skip for now" tap
//   - Browser back button mid-test (not for Finish Early at Q8+)

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onKeepTesting: () => void;
  onSkip: () => void;
};

const primaryBtnStyle: React.CSSProperties = {
  background: '#111827',
  color: 'white',
  borderRadius: 14,
  minHeight: 48,
  padding: '12px 24px',
  fontSize: 15,
  fontWeight: 700,
  border: 'none',
  cursor: 'pointer',
  width: '100%',
};

const ghostBtnStyle: React.CSSProperties = {
  background: 'white',
  color: 'rgba(0,0,0,0.78)',
  borderRadius: 14,
  minHeight: 48,
  padding: '12px 20px',
  fontSize: 15,
  fontWeight: 600,
  border: '1px solid rgba(0,0,0,0.14)',
  cursor: 'pointer',
  width: '100%',
};

export function SkipModal({ open, onOpenChange, onKeepTesting, onSkip }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Skip placement test?
            <span
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 400,
                color: '#94a3b8',
                marginTop: 4,
              }}
            >
              Bỏ qua bài đánh giá?
            </span>
          </DialogTitle>
          <DialogDescription>
            You can take it anytime from your Account page, and we'll
            recommend a starting lesson whenever you're ready.
            <span
              style={{
                display: 'block',
                color: '#94a3b8',
                marginTop: 6,
              }}
            >
              Bạn có thể làm bài này bất cứ lúc nào từ trang Tài khoản, và
              Mercy sẽ gợi ý bài học phù hợp khi bạn sẵn sàng.
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <button
            type="button"
            style={primaryBtnStyle}
            onClick={onKeepTesting}
            autoFocus
          >
            Keep testing
            <span
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 400,
                color: 'rgba(255,255,255,0.75)',
                marginTop: 2,
              }}
            >
              Tiếp tục làm bài
            </span>
          </button>
          <button type="button" style={ghostBtnStyle} onClick={onSkip}>
            Yes, skip
            <span
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 400,
                color: '#94a3b8',
                marginTop: 2,
              }}
            >
              Có, bỏ qua
            </span>
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SkipModal;
