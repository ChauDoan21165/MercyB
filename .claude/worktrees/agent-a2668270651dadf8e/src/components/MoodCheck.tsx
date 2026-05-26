import React from 'react';
import { cn } from '@/lib/utils';

export type MoodKey = 'light' | 'ok' | 'heavy' | 'anxious';

type MoodOption = {
  key: MoodKey;
  emoji: string;
  labelEn: string;
  labelVi: string;
};

const MOOD_OPTIONS: MoodOption[] = [
  { key: 'light', emoji: '😊', labelEn: 'light', labelVi: 'nhẹ' },
  { key: 'ok', emoji: '🙂', labelEn: 'ok', labelVi: 'ổn' },
  { key: 'heavy', emoji: '😟', labelEn: 'heavy', labelVi: 'nặng' },
  { key: 'anxious', emoji: '😰', labelEn: 'anxious', labelVi: 'lo' },
];

type MoodCheckProps = {
  value?: MoodKey;
  onChange: (mood: MoodKey) => void;
  labelEn?: string;
  labelVi?: string;
};

export function MoodCheck({ 
  value, 
  onChange, 
  labelEn = 'How do you feel now?',
  labelVi = 'Bây giờ bạn thấy thế nào?'
}: MoodCheckProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        {labelEn}
        <br />
        <span className="text-xs">{labelVi}</span>
      </p>
      <div className="flex gap-2 flex-wrap">
        {MOOD_OPTIONS.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            className={cn(
              'flex flex-col items-center px-3 py-2 rounded-lg border transition-all',
              'hover:bg-accent/50',
              value === option.key
                ? 'border-primary bg-primary/10'
                : 'border-border bg-background'
            )}
          >
            <span className="text-xl">{option.emoji}</span>
            <span className="text-xs text-muted-foreground">
              {option.labelEn}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
