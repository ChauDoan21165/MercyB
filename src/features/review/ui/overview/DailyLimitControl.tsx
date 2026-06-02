// src/features/review/ui/overview/DailyLimitControl.tsx — Lane D / D6
//
// Prop-driven control for the per-flow daily NEW-card limit
// (`ReviewSettings.dailyNewLimit`). Vietnamese-first, mobile-first. A labeled
// number stepper with sensible bounds — outcomes over engagement: a plain
// "how many new cards a day" dial, no streaks, no pressure.

import React, { useId } from "react";

export const DAILY_LIMIT_MIN = 0;
export const DAILY_LIMIT_MAX = 100;
const STEP = 5;

function clamp(n: number): number {
  if (!Number.isFinite(n)) return DAILY_LIMIT_MIN;
  return Math.min(DAILY_LIMIT_MAX, Math.max(DAILY_LIMIT_MIN, Math.round(n)));
}

export interface DailyLimitControlProps {
  /** Current per-day new-card limit. */
  value: number;
  /** Fired with the clamped new value. */
  onChange(value: number): void;
  /** Disable the whole control (e.g. while persisting). */
  disabled?: boolean;
}

/**
 * Labeled stepper for "Số thẻ mới mỗi ngày". Emits a clamped value on every
 * change. The number input is the accessible source of truth; the +/- buttons
 * are conveniences that route through the same `onChange`.
 */
export function DailyLimitControl({
  value,
  onChange,
  disabled = false,
}: DailyLimitControlProps): React.ReactElement {
  const inputId = useId();
  const current = clamp(value);

  const emit = (next: number) => {
    const c = clamp(next);
    if (c !== current) onChange(c);
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-gray-700"
      >
        Số thẻ mới mỗi ngày
      </label>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Giảm số thẻ mới mỗi ngày"
          disabled={disabled || current <= DAILY_LIMIT_MIN}
          onClick={() => emit(current - STEP)}
          className="h-9 w-9 rounded-lg border border-gray-300 text-lg leading-none text-gray-700 disabled:opacity-40"
        >
          −
        </button>
        <input
          id={inputId}
          type="number"
          inputMode="numeric"
          min={DAILY_LIMIT_MIN}
          max={DAILY_LIMIT_MAX}
          step={STEP}
          value={current}
          disabled={disabled}
          aria-label="Số thẻ mới mỗi ngày"
          onChange={(e) => emit(Number(e.target.value))}
          className="h-9 w-16 rounded-lg border border-gray-300 text-center text-base text-gray-900 disabled:opacity-40"
        />
        <button
          type="button"
          aria-label="Tăng số thẻ mới mỗi ngày"
          disabled={disabled || current >= DAILY_LIMIT_MAX}
          onClick={() => emit(current + STEP)}
          className="h-9 w-9 rounded-lg border border-gray-300 text-lg leading-none text-gray-700 disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default DailyLimitControl;
