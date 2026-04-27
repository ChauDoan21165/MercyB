/**
 * Cost alert state machine — pure logic, zero side effects.
 *
 * The dashboard derives a state from (forecast monthly cost, threshold),
 * shows a colored banner, and decides whether to dispatch an admin email.
 * The actual email send lives in the page (it calls an existing function);
 * this file only computes the *should we alert* answer.
 */

import { DEFAULT_USD_VND_RATE } from "./costMonitoring";

export type AlertLevel = "ok" | "watch" | "alert";

/**
 * Default monthly cost ceiling, in USD. Stored here as a constant so it's
 * easy to bump from one place; the admin UI can pass a live override that
 * an admin tweaked through a setting.
 */
export const DEFAULT_THRESHOLD_USD = 100;

export const ALERT_THRESHOLDS = {
  /** Yellow at this fraction of the cap. */
  watchRatio: 0.75,
  /** Red at this fraction of the cap. */
  alertRatio: 1.0,
} as const;

export interface AlertEvaluation {
  level: AlertLevel;
  /** forecast_monthly_vnd ÷ threshold_vnd, rounded to 4 decimals. */
  ratio: number;
  /** The threshold the call was evaluated against, in VND. */
  thresholdVnd: number;
  /** Bilingual sentence the UI shows next to the banner. */
  message: { vi: string; en: string };
}

/**
 * Evaluate an alert from a forecast and a threshold. Pure — same inputs
 * always produce the same output, easy to test edge cases.
 */
export function evaluateAlert(
  forecastMonthlyVnd: number,
  thresholdUsd: number = DEFAULT_THRESHOLD_USD,
  usdVndRate: number = DEFAULT_USD_VND_RATE,
): AlertEvaluation {
  const thresholdVnd = Math.round(thresholdUsd * usdVndRate);
  const ratio =
    thresholdVnd > 0
      ? Number((forecastMonthlyVnd / thresholdVnd).toFixed(4))
      : 0;
  let level: AlertLevel = "ok";
  if (ratio >= ALERT_THRESHOLDS.alertRatio) level = "alert";
  else if (ratio >= ALERT_THRESHOLDS.watchRatio) level = "watch";
  return {
    level,
    ratio,
    thresholdVnd,
    message: messageFor(level, ratio),
  };
}

function messageFor(
  level: AlertLevel,
  ratio: number,
): { vi: string; en: string } {
  const pct = Math.round(ratio * 100);
  if (level === "alert") {
    return {
      vi: `Chi phí dự kiến tháng này đã chạm ngưỡng (${pct}% của hạn mức). Xem xét tắt tính năng tốn kém hoặc tăng giá.`,
      en: `Projected monthly cost has hit the threshold (${pct}% of cap). Consider darkening expensive features or adjusting pricing.`,
    };
  }
  if (level === "watch") {
    return {
      vi: `Chi phí dự kiến tháng này đạt ${pct}% hạn mức. Theo dõi sát sao.`,
      en: `Projected monthly cost is at ${pct}% of cap. Watch closely.`,
    };
  }
  return {
    vi: `Chi phí dự kiến tháng này đạt ${pct}% hạn mức. Vẫn ổn.`,
    en: `Projected monthly cost is at ${pct}% of cap. All good.`,
  };
}

/**
 * Return true when the alert state has just crossed into 'alert' (or
 * 'watch') and the previous evaluation was at a lower level — used to
 * decide whether to dispatch the admin email. Without this, every page
 * load would re-trigger an email.
 *
 * The page persists the previous level in localStorage / a tiny KV row;
 * this helper is just the comparator.
 */
export function shouldDispatchEmail(
  current: AlertLevel,
  previous: AlertLevel | null,
): boolean {
  if (current === "ok") return false;
  // Reaching here means current is 'watch' or 'alert' — both dispatchable
  // when there's no prior state.
  if (previous === null) return true;
  // Dispatch only on transitions UP (ok→watch, watch→alert, ok→alert).
  const order: Record<AlertLevel, number> = { ok: 0, watch: 1, alert: 2 };
  return order[current] > order[previous];
}
