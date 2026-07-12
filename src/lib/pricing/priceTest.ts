import { FEATURE_FLAGS } from "@/lib/featureFlags";
import { supabase } from "@/lib/supabaseClient";

export type PriceTestVariant = "control" | "test";
export type PriceTestEventType =
  | "price_test_variant_exposure"
  | "price_test_checkout_start"
  | "price_test_checkout_complete";

export type PriceTestPriceConfig = {
  monthPriceId: string;
  yearPriceId: string;
  monthlyAmountVnd: number;
  yearlyAmountVnd: number;
};

export type StoredPriceTestAssignment = {
  experimentKey: string;
  variant: PriceTestVariant;
  identityKind: "user" | "anon" | "unknown";
  identityKey: string;
  assignedAt: string;
  configReady: boolean;
  enabled: boolean;
};

export type ResolvedPriceTestPlan = StoredPriceTestAssignment & PriceTestPriceConfig & {
  exposureEligible: boolean;
  configWarning: string;
};

type ResolveDeps = {
  userId?: string | null;
  control: PriceTestPriceConfig;
  enabled?: boolean;
  storage?: Storage | null;
  now?: () => Date;
  randomId?: () => string;
  testConfig?: Partial<PriceTestPriceConfig>;
};

export const PRICE_TEST_EXPERIMENT_KEY = "price_test_v1";
const ASSIGNMENT_KEY = "mb_price_test_assignment_v1";
const ANON_ID_KEY = "mb_price_test_anon_id";
const COMPLETION_PREFIX = "mb_price_test_checkout_complete:";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function safeLocalStorage(): Storage | null {
  if (!isBrowser()) return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readEnv(name: string): string {
  try {
    return String((import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.[name] ?? "").trim();
  } catch {
    return "";
  }
}

function readEnvNumber(name: string): number | null {
  const raw = readEnv(name).replace(/[_\s,]/g, "");
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function generateAnonId(): string {
  if (isBrowser() && typeof crypto !== "undefined" && "randomUUID" in crypto) {
    try {
      return crypto.randomUUID();
    } catch {
      // fall through
    }
  }
  return `anon-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function readJson<T>(storage: Storage | null, key: string): T | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) as T : null;
  } catch {
    return null;
  }
}

function writeJson(storage: Storage | null, key: string, value: unknown): void {
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be full or blocked. The page still falls back safely.
  }
}

function fnv1aHash32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = (hash + ((hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24))) >>> 0;
  }
  return hash >>> 0;
}

function pickVariant(identityKey: string): PriceTestVariant {
  return fnv1aHash32(`${PRICE_TEST_EXPERIMENT_KEY}:${identityKey}`) % 2 === 0 ? "control" : "test";
}

function envTestConfig(): Partial<PriceTestPriceConfig> {
  return {
    monthPriceId: readEnv("VITE_STRIPE_PRICE_ONE_MONTH_TEST") || readEnv("VITE_STRIPE_PRICE_MONTHLY_TEST"),
    yearPriceId: readEnv("VITE_STRIPE_PRICE_ONE_YEAR_TEST") || readEnv("VITE_STRIPE_PRICE_YEARLY_TEST"),
    monthlyAmountVnd: readEnvNumber("VITE_PRICE_TEST_MONTHLY_VND") ?? undefined,
    yearlyAmountVnd: readEnvNumber("VITE_PRICE_TEST_YEARLY_VND") ?? undefined,
  };
}

export function getPriceTestMissingConfig(testConfig: Partial<PriceTestPriceConfig> = envTestConfig()): string[] {
  const missing: string[] = [];
  if (!testConfig.monthPriceId) missing.push("VITE_STRIPE_PRICE_ONE_MONTH_TEST");
  if (!testConfig.yearPriceId) missing.push("VITE_STRIPE_PRICE_ONE_YEAR_TEST");
  if (!testConfig.monthlyAmountVnd) missing.push("VITE_PRICE_TEST_MONTHLY_VND");
  if (!testConfig.yearlyAmountVnd) missing.push("VITE_PRICE_TEST_YEARLY_VND");
  return missing;
}

function resolveIdentity(
  storage: Storage | null,
  userId: string | null | undefined,
  randomId: () => string,
): Pick<StoredPriceTestAssignment, "identityKind" | "identityKey"> {
  if (userId) return { identityKind: "user", identityKey: `u:${userId}` };
  const existing = storage?.getItem(ANON_ID_KEY);
  if (existing) return { identityKind: "anon", identityKey: `a:${existing}` };
  const fresh = randomId();
  try {
    storage?.setItem(ANON_ID_KEY, fresh);
  } catch {
    // ignored
  }
  return { identityKind: "anon", identityKey: `a:${fresh}` };
}

function isStoredAssignment(value: unknown): value is StoredPriceTestAssignment {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<StoredPriceTestAssignment>;
  return candidate.experimentKey === PRICE_TEST_EXPERIMENT_KEY
    && (candidate.variant === "control" || candidate.variant === "test");
}

export function resolvePriceTestPlan(deps: ResolveDeps): ResolvedPriceTestPlan {
  const storage = deps.storage ?? safeLocalStorage();
  const enabled = deps.enabled ?? FEATURE_FLAGS.PRICE_TEST_ENABLED;
  const now = deps.now ?? (() => new Date());
  const randomId = deps.randomId ?? generateAnonId;
  const testConfig = deps.testConfig ?? envTestConfig();
  const missing = getPriceTestMissingConfig(testConfig);
  const configReady = missing.length === 0;

  const cached = readJson<StoredPriceTestAssignment>(storage, ASSIGNMENT_KEY);
  const base = isStoredAssignment(cached)
    ? { ...cached, enabled, configReady }
    : (() => {
        const identity = resolveIdentity(storage, deps.userId, randomId);
        const assignment: StoredPriceTestAssignment = {
          experimentKey: PRICE_TEST_EXPERIMENT_KEY,
          variant: enabled && configReady ? pickVariant(identity.identityKey) : "control",
          identityKind: identity.identityKind,
          identityKey: identity.identityKey,
          assignedAt: now().toISOString(),
          enabled,
          configReady,
        };
        if (enabled && configReady) writeJson(storage, ASSIGNMENT_KEY, assignment);
        return assignment;
      })();

  if (enabled && !configReady) {
    console.error("[price-test] missing env config", { missing });
  }

  const useTest = enabled && configReady && base.variant === "test";
  const selected = useTest ? testConfig as PriceTestPriceConfig : deps.control;

  return {
    ...base,
    ...selected,
    enabled,
    configReady,
    exposureEligible: enabled && configReady,
    configWarning: enabled && !configReady ? `Price test disabled: missing ${missing.join(", ")}` : "",
  };
}

export function getStoredPriceTestAssignment(storage: Storage | null = safeLocalStorage()): StoredPriceTestAssignment | null {
  const stored = readJson<StoredPriceTestAssignment>(storage, ASSIGNMENT_KEY);
  return isStoredAssignment(stored) ? stored : null;
}

export function priceTestAnalyticsPayload(
  plan: Pick<StoredPriceTestAssignment, "experimentKey" | "variant" | "enabled" | "configReady">,
  extra: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    ...extra,
    price_test_experiment: plan.experimentKey,
    price_test_variant: plan.variant,
    price_test_enabled: plan.enabled,
    price_test_config_ready: plan.configReady,
  };
}

export function markCheckoutCompleteRecorded(key: string, storage: Storage | null = safeLocalStorage()): boolean {
  if (!storage) return true;
  const storageKey = `${COMPLETION_PREFIX}${key}`;
  try {
    if (storage.getItem(storageKey)) return false;
    storage.setItem(storageKey, new Date().toISOString());
    return true;
  } catch {
    return true;
  }
}

export async function recordPriceTestLearningEvent(
  eventType: PriceTestEventType,
  assignment: Pick<StoredPriceTestAssignment, "experimentKey" | "variant" | "enabled" | "configReady">,
  payload: Record<string, unknown> = {},
): Promise<void> {
  if (!assignment.enabled || !assignment.configReady) return;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return;
    await supabase.from("learning_events").insert({
      user_id: data.user.id,
      event_type: eventType,
      rule_or_detector_id: null,
      payload: priceTestAnalyticsPayload(assignment, payload),
      client_ts: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[price-test] failed to record learning event", {
      eventType,
      errorClass: error instanceof Error ? error.name : typeof error,
    });
  }
}

export function __resetPriceTestForTests(storage: Storage | null = safeLocalStorage()): void {
  if (!storage) return;
  try {
    const keys: string[] = [];
    for (let i = 0; i < storage.length; i += 1) {
      const key = storage.key(i);
      if (key && (key === ASSIGNMENT_KEY || key === ANON_ID_KEY || key.startsWith(COMPLETION_PREFIX))) {
        keys.push(key);
      }
    }
    for (const key of keys) storage.removeItem(key);
  } catch {
    // ignored
  }
}
