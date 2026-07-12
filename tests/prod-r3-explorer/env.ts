import {
  ALERT_TO,
  hasSyntheticCreds,
  redact,
  SYNTH_BASE_URL,
  SYNTH_EMAIL,
  SYNTH_PASSWORD,
  SYNTH_SUPABASE_ANON_KEY,
  SYNTH_SUPABASE_URL,
} from "../prod-synthetic-learner/env";

export {
  ALERT_TO,
  hasSyntheticCreds,
  redact,
  SYNTH_BASE_URL,
  SYNTH_EMAIL,
  SYNTH_PASSWORD,
  SYNTH_SUPABASE_ANON_KEY,
  SYNTH_SUPABASE_URL,
};

export const R3_ENABLED = process.env.R3_EXPLORER_ENABLED === "1";
export const R3_SEED = process.env.R3_EXPLORER_SEED ?? "mercyblade-r3";

export function numberEnv(name: string, fallback: number, min = 1): number {
  const parsed = Number(process.env[name] ?? "");
  return Number.isFinite(parsed) && parsed >= min ? Math.floor(parsed) : fallback;
}

export const R3_MAX_PAGES = numberEnv("R3_MAX_PAGES", 30);
export const R3_MAX_ACTIONS = numberEnv("R3_MAX_ACTIONS", 80);
export const R3_MAX_ACTIONS_PER_PAGE = numberEnv("R3_MAX_ACTIONS_PER_PAGE", 4);
export const R3_MAX_DURATION_MS = numberEnv("R3_MAX_DURATION_MS", 10 * 60_000, 30_000);
export const R3_RETRY_DELAY_MS = numberEnv("R3_RETRY_DELAY_MS", 60_000, 0);

