// FILE: RecoveryScreen.tsx
// PATH: src/screens/RecoveryScreen.tsx
// VERSION: v1.1
//
// Purpose:
// - “Recovery mode” screen when gate is NOT ready
// - Shows why you’re blocked + what to do next
// - Persists a lightweight recovery state into repo (so Mercy Host + UI can reference it)
// - Routes user into the next best action (usually another drill)

import React, { useEffect, useMemo, useState } from "react";

import type { GateDefinition } from "../core/types/curriculum";
import type { UserProgress } from "../core/types/session";
import type { MasteryState, SkillId } from "../core/engine/mastery";
import { ALL_SKILLS } from "../core/engine/mastery";

import { buildMercyMessage } from "../core/engine/mercyHost";
import { loadUserProgress, saveUserProgress } from "../core/storage/repo";

type NavAction = "start_next" | "recovery" | "level_up" | "back";

type MercyMessage = {
  title: string;
  body: string;
  cta: { label: string; action: NavAction };
};

type RecoveryParams = {
  userId: string;
  levelId: number;
  gateDefinition: GateDefinition;

  gateReady?: boolean;
  gateReasons?: string[];
  missingSkills?: string[];

  // May be passed from DrillResult/Gate screens for immediate rendering
  mastery?: unknown; // canonical mastery shape OR loose {skill:number}
  sessionScore0to100?: number;
  avgAccuracy0to1?: number;
};

interface Props {
  route: { params?: RecoveryParams };
  navigation: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
}

function nowISO(): string {
  return new Date().toISOString();
}

function pct(n0to1: number | undefined): string {
  if (n0to1 == null || Number.isNaN(n0to1)) return "—";
  return `${Math.round(n0to1 * 100)}%`;
}

/**
 * Normalize mastery for display.
 * Accepts either:
 * - canonical: { skill: { value, updatedAtISO } }
 * - loose: { skill: 0..1 }
 */
function toDisplayMastery(mastery: unknown): Record<string, number> {
  if (!mastery || typeof mastery !== "object") return {};
  const keys = Object.keys(mastery as Record<string, unknown>);
  if (keys.length === 0) return {};

  const sample = (mastery as Record<string, unknown>)[keys[0]];
  if (sample && typeof sample === "object" && typeof (sample as { value?: unknown }).value === "number") {
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(mastery as Record<string, { value?: unknown }>)) {
      if (v && typeof v.value === "number") {
        out[k] = Math.max(0, Math.min(1, v.value));
      }
    }
    return out;
  }

  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(mastery as Record<string, unknown>)) {
    const n = typeof v === "number" ? v : Number(v);
    if (Number.isFinite(n)) out[k] = Math.max(0, Math.min(1, n));
  }
  return out;
}

function toCanonicalMastery(mastery: unknown): MasteryState {
  const display = toDisplayMastery(mastery);
  const epoch = new Date(0).toISOString();

  const full = {} as MasteryState;
  for (const skill of ALL_SKILLS) {
    full[skill] = {
      value: typeof display[skill] === "number" ? display[skill] : 0.2,
      updatedAtISO: epoch,
    };
  }
  return full;
}

function normalizeMissingSkills(input?: string[]): SkillId[] {
  if (!Array.isArray(input)) return [];
  const allowed = new Set<string>(ALL_SKILLS);
  return input.filter((s): s is SkillId => allowed.has(s));
}

function pickRecoveryFocus(
  missingSkills: string[] | undefined,
  mastery: Record<string, number>
): string | null {
  if (missingSkills && missingSkills.length > 0) return missingSkills[0];

  const entries = Object.entries(mastery);
  if (entries.length === 0) return null;

  entries.sort((a, b) => (a[1] ?? 0) - (b[1] ?? 0));
  return entries[0]?.[0] ?? null;
}

const styles = {
  page: {
    maxWidth: 760,
    margin: "0 auto",
    padding: 24,
  } as React.CSSProperties,
  title: {
    fontSize: 28,
    fontWeight: 800,
    margin: 0,
  } as React.CSSProperties,
  text: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: "22px",
    opacity: 0.85,
  } as React.CSSProperties,
  card: {
    marginTop: 16,
    padding: 16,
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 12,
    background: "rgba(255,255,255,0.8)",
  } as React.CSSProperties,
  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
    margin: 0,
  } as React.CSSProperties,
  rowGap: {
    marginTop: 10,
  } as React.CSSProperties,
  button: {
    display: "inline-block",
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.14)",
    background: "#fff",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  } as React.CSSProperties,
  dangerText: {
    color: "crimson",
    marginTop: 12,
  } as React.CSSProperties,
  inlineLoading: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
  } as React.CSSProperties,
};

export default function RecoveryScreen({ route, navigation }: Props) {
  const params = route?.params;

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [storedProgress, setStoredProgress] = useState<UserProgress | null>(null);

  const hasBasics = Boolean(
    params?.userId && typeof params?.levelId === "number" && params?.gateDefinition
  );

  useEffect(() => {
    const p = loadUserProgress();
    if (p) setStoredProgress(p);
  }, []);

  const gateReasons = params?.gateReasons ?? [];
  const missingSkills = params?.missingSkills ?? [];
  const canonicalMissingSkills = useMemo(
    () => normalizeMissingSkills(missingSkills),
    [missingSkills]
  );
  const gateReady = Boolean(params?.gateReady);

  const sessionScore0to100 = params?.sessionScore0to100 ?? 0;
  const avgAccuracy0to1 = params?.avgAccuracy0to1 ?? 0;

  const displayMastery = useMemo(() => {
    const m = (storedProgress as { mastery?: unknown } | null)?.mastery ?? params?.mastery;
    return toDisplayMastery(m);
  }, [storedProgress, params?.mastery]);

  const canonicalMastery = useMemo(() => {
    const m = (storedProgress as { mastery?: unknown } | null)?.mastery ?? params?.mastery;
    return toCanonicalMastery(m);
  }, [storedProgress, params?.mastery]);

  const focusSkill = useMemo(() => {
    return pickRecoveryFocus(missingSkills, displayMastery);
  }, [missingSkills, displayMastery]);

  const mercy: MercyMessage = useMemo(() => {
    if (!params?.userId || params?.levelId == null) {
      return {
        title: "Recovery",
        body: "Slow down. Choose one small drill. Clean reps beat fast reps.",
        cta: { label: "Back", action: "back" },
      };
    }

    return buildMercyMessage({
      userName: "Warrior",
      levelId: params.levelId,
      tone: "calm",
      seed: params.userId,
      mastery: canonicalMastery,
      sessionScore0to100,
      avgAccuracy0to1,
      gateReady: false,
      gateReasons,
      missingSkills: canonicalMissingSkills,
    }) as MercyMessage;
  }, [
    params?.userId,
    params?.levelId,
    canonicalMastery,
    sessionScore0to100,
    avgAccuracy0to1,
    gateReasons,
    canonicalMissingSkills,
  ]);

  async function persistRecoveryMode() {
    if (!params?.userId || params.levelId == null) return;

    setSaveError(null);
    setSaving(true);

    try {
      const p = loadUserProgress();
      if (!p) throw new Error("User progress not initialized");

      if ((p as { userId?: string }).userId && (p as { userId?: string }).userId !== params.userId) {
        throw new Error("Progress user mismatch");
      }

      const updated: UserProgress = {
        ...p,
        currentLevelId: (p as { currentLevelId?: number }).currentLevelId ?? params.levelId,
        ...({
          recoveryMode: true,
          recoveryStartedAtISO: nowISO(),
          recoveryFocusSkill: focusSkill ?? null,
          lastGateReasons: gateReasons,
          lastMissingSkills: missingSkills,
          lastRecoveryAtISO: nowISO(),
        } as Record<string, unknown>),
      };

      saveUserProgress(updated);
      setStoredProgress(updated);
    } catch (e: unknown) {
      setSaveError(
        e instanceof Error ? e.message : "Failed to persist recovery state."
      );
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!hasBasics) return;
    if (gateReady) return;
    void persistRecoveryMode();
  }, [hasBasics, gateReady, focusSkill]);

  if (!hasBasics) {
    return (
      <div style={{ ...styles.page, minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h1 style={styles.title}>Recovery</h1>
        <p style={styles.text}>
          This screen needs gate context (userId, levelId, gateDefinition).
        </p>
        <div style={{ marginTop: 24 }}>
          <button style={styles.button} onClick={() => navigation.navigate("TrainHome")}>
            Back to Training
          </button>
        </div>
      </div>
    );
  }

  const { userId, levelId, gateDefinition } = params!;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Recovery Mode</h1>
      <p style={styles.text}>
        You’re close — but not through the gate yet. Recovery means: simplify,
        isolate a weakness, repeat cleanly.
      </p>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Last Session</h2>
        <p style={styles.rowGap}>Score: {sessionScore0to100}</p>
        <p>Accuracy: {pct(avgAccuracy0to1)}</p>
        {focusSkill ? (
          <p style={{ marginTop: 8, opacity: 0.85 }}>
            Focus skill: <strong>{focusSkill}</strong>
          </p>
        ) : (
          <p style={{ marginTop: 8, opacity: 0.75 }}>Focus skill: —</p>
        )}
      </div>

      {(gateReasons.length > 0 || missingSkills.length > 0) && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Why the gate didn’t open</h2>

          {gateReasons.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <p style={{ fontWeight: 700 }}>Reasons</p>
              {gateReasons.map((r, idx) => (
                <p key={`${idx}-${r}`} style={{ marginTop: 6, opacity: 0.85 }}>
                  • {r}
                </p>
              ))}
            </div>
          )}

          {missingSkills.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <p style={{ fontWeight: 700 }}>Skills to raise</p>
              {missingSkills.map((s) => (
                <p key={s} style={{ marginTop: 6, opacity: 0.85 }}>
                  • {s}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={styles.card}>
        <h2 style={{ ...styles.cardTitle, fontWeight: 800 }}>{mercy.title}</h2>
        <p style={{ marginTop: 8, fontSize: 15, lineHeight: "20px", opacity: 0.9 }}>
          {mercy.body}
        </p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Mastery Snapshot</h2>

        {Object.keys(displayMastery).length === 0 ? (
          <p style={{ marginTop: 8, opacity: 0.75 }}>No mastery data available.</p>
        ) : (
          Object.entries(displayMastery)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([skill, v]) => (
              <div key={skill} style={{ marginTop: 10 }}>
                <p style={{ fontWeight: 700, margin: 0 }}>{skill}</p>
                <p style={{ opacity: 0.8, margin: "4px 0 0" }}>{pct(v)}</p>
              </div>
            ))
        )}
      </div>

      {saveError && <div style={styles.dangerText}>{saveError}</div>}

      {saving ? (
        <div style={styles.inlineLoading}>
          <span>⏳</span>
          <span>Entering recovery mode...</span>
        </div>
      ) : (
        <div style={{ marginTop: 20 }}>
          <button
            style={styles.button}
            onClick={() => {
              navigation.navigate("DrillRunner", {
                userId,
                levelId,
                gateDefinition,
                mode: "recovery",
                focusSkill,
              });
            }}
          >
            {focusSkill ? `Do a recovery drill: ${focusSkill}` : "Do a recovery drill"}
          </button>

          <div style={{ height: 12 }} />

          <button
            style={styles.button}
            onClick={() => navigation.navigate("TrainHome", { userId })}
          >
            Back to Train Home
          </button>

          <div style={{ height: 12 }} />

          <button
            style={styles.button}
            onClick={() =>
              navigation.navigate("GateScreen", {
                userId,
                levelId,
                gateDefinition,
                gateReady: false,
                gateReasons,
                missingSkills,
                mastery: canonicalMastery,
                sessionScore0to100,
                avgAccuracy0to1,
              })
            }
          >
            Re-check Gate
          </button>
        </div>
      )}

      <div style={{ height: 24 }} />
    </div>
  );
}