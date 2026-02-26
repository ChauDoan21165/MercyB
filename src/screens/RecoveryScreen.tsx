// FILE: RecoveryScreen.tsx
// PATH: src/screens/RecoveryScreen.tsx
//
// Purpose:
// - “Recovery mode” screen when gate is NOT ready
// - Shows why you’re blocked + what to do next
// - Persists a lightweight recovery state into repo (so Mercy Host + UI can reference it)
// - Routes user into the next best action (usually another drill)
//
// Notes:
// - We do NOT assume advanced curriculum/drill routing yet.
// - This screen is safe even if some params are missing (it will fall back gracefully).

import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Button, ScrollView, ActivityIndicator } from "react-native";

import type { GateDefinition } from "../core/types/curriculum";
import type { UserProgress } from "../core/types/session";

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
  mastery?: any; // can be canonical mastery shape OR loose {skill:number}
  sessionScore0to100?: number;
  avgAccuracy0to1?: number;
};

interface Props {
  route: { params?: RecoveryParams };
  navigation: any;
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
function toDisplayMastery(mastery: any): Record<string, number> {
  if (!mastery || typeof mastery !== "object") return {};
  const keys = Object.keys(mastery);
  if (keys.length === 0) return {};

  const sample = (mastery as any)[keys[0]];
  // canonical shape
  if (sample && typeof sample === "object" && typeof sample.value === "number") {
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries<any>(mastery)) {
      if (v && typeof v.value === "number") out[k] = Math.max(0, Math.min(1, v.value));
    }
    return out;
  }

  // loose shape
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries<any>(mastery)) {
    const n = typeof v === "number" ? v : Number(v);
    if (Number.isFinite(n)) out[k] = Math.max(0, Math.min(1, n));
  }
  return out;
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

export default function RecoveryScreen({ route, navigation }: Props) {
  const params = route?.params;

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [storedProgress, setStoredProgress] = useState<UserProgress | null>(null);

  const hasBasics = Boolean(
    params?.userId && typeof params?.levelId === "number" && params?.gateDefinition
  );

  // Load authoritative progress so this screen works even if upstream params are stale.
  useEffect(() => {
    const p = loadUserProgress();
    if (p) setStoredProgress(p);
  }, []);

  const gateReasons = params?.gateReasons ?? [];
  const missingSkills = params?.missingSkills ?? [];
  const gateReady = Boolean(params?.gateReady);

  const sessionScore0to100 = params?.sessionScore0to100 ?? 0;
  const avgAccuracy0to1 = params?.avgAccuracy0to1 ?? 0;

  const displayMastery = useMemo(() => {
    // Prefer stored mastery, fallback to param mastery
    const m = storedProgress?.mastery ?? params?.mastery;
    return toDisplayMastery(m);
  }, [storedProgress?.mastery, params?.mastery]);

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
      tone: "gentle",
      seed: params.userId,
      mastery: storedProgress?.mastery ?? params?.mastery ?? {},
      sessionScore0to100,
      avgAccuracy0to1,
      gateReady: false,
      gateReasons,
      missingSkills,
    }) as MercyMessage;
  }, [
    params?.userId,
    params?.levelId,
    params?.mastery,
    storedProgress?.mastery,
    sessionScore0to100,
    avgAccuracy0to1,
    gateReasons,
    missingSkills,
  ]);

  async function persistRecoveryMode() {
    if (!params?.userId || params.levelId == null) return;

    setSaveError(null);
    setSaving(true);

    try {
      const p = loadUserProgress();
      if (!p) throw new Error("User progress not initialized");

      if ((p as any).userId && (p as any).userId !== params.userId) {
        throw new Error("Progress user mismatch");
      }

      const updated: UserProgress = {
        ...p,
        currentLevelId: (p as any).currentLevelId ?? params.levelId,
        ...( {
          recoveryMode: true,
          recoveryStartedAtISO: nowISO(),
          recoveryFocusSkill: focusSkill ?? null,
          lastGateReasons: gateReasons,
          lastMissingSkills: missingSkills,
          lastRecoveryAtISO: nowISO(),
        } as any ),
      };

      saveUserProgress(updated);
      setStoredProgress(updated);
    } catch (e: any) {
      setSaveError(e?.message ?? "Failed to persist recovery state.");
    } finally {
      setSaving(false);
    }
  }

  // Entering Recovery screen should persist recovery state once we have enough context.
  useEffect(() => {
    if (!hasBasics) return;
    if (gateReady) return; // if somehow opened, don’t persist recovery
    void persistRecoveryMode();
    // include focusSkill so persisted “focus” matches what the UI shows
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasBasics, gateReady, focusSkill]);

  if (!hasBasics) {
    return (
      <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
        <Text style={{ fontSize: 28, fontWeight: "800" }}>Recovery</Text>
        <Text style={{ marginTop: 10, fontSize: 16, opacity: 0.8 }}>
          This screen needs gate context (userId, levelId, gateDefinition).
        </Text>
        <View style={{ marginTop: 24 }}>
          <Button title="Back to Training" onPress={() => navigation.navigate("TrainHome")} />
        </View>
      </View>
    );
  }

  const { userId, levelId, gateDefinition } = params!;

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "800" }}>Recovery Mode</Text>
      <Text style={{ marginTop: 8, fontSize: 15, opacity: 0.85 }}>
        You’re close — but not through the gate yet. Recovery means: simplify, isolate a weakness, repeat cleanly.
      </Text>

      <View style={{ marginTop: 16, padding: 16, borderWidth: 1, borderRadius: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>Last Session</Text>
        <Text style={{ marginTop: 8 }}>Score: {sessionScore0to100}</Text>
        <Text>Accuracy: {pct(avgAccuracy0to1)}</Text>
        {focusSkill ? (
          <Text style={{ marginTop: 8, opacity: 0.85 }}>
            Focus skill: <Text style={{ fontWeight: "800" }}>{focusSkill}</Text>
          </Text>
        ) : (
          <Text style={{ marginTop: 8, opacity: 0.75 }}>Focus skill: —</Text>
        )}
      </View>

      {(gateReasons.length > 0 || missingSkills.length > 0) && (
        <View style={{ marginTop: 16, padding: 16, borderWidth: 1, borderRadius: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>Why the gate didn’t open</Text>

          {gateReasons.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: "700" }}>Reasons</Text>
              {gateReasons.map((r, idx) => (
                <Text key={`${idx}-${r}`} style={{ marginTop: 6, opacity: 0.85 }}>
                  • {r}
                </Text>
              ))}
            </View>
          )}

          {missingSkills.length > 0 && (
            <View style={{ marginTop: 12 }}>
              <Text style={{ fontWeight: "700" }}>Skills to raise</Text>
              {missingSkills.map((s) => (
                <Text key={s} style={{ marginTop: 6, opacity: 0.85 }}>
                  • {s}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}

      <View style={{ marginTop: 16, padding: 16, borderWidth: 1, borderRadius: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "800" }}>{mercy.title}</Text>
        <Text style={{ marginTop: 8, fontSize: 15, lineHeight: 20, opacity: 0.9 }}>
          {mercy.body}
        </Text>
      </View>

      <View style={{ marginTop: 16, padding: 16, borderWidth: 1, borderRadius: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>Mastery Snapshot</Text>

        {Object.keys(displayMastery).length === 0 ? (
          <Text style={{ marginTop: 8, opacity: 0.75 }}>No mastery data available.</Text>
        ) : (
          Object.entries(displayMastery)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([skill, v]) => (
              <View key={skill} style={{ marginTop: 10 }}>
                <Text style={{ fontWeight: "700" }}>{skill}</Text>
                <Text style={{ opacity: 0.8 }}>{pct(v)}</Text>
              </View>
            ))
        )}
      </View>

      {saveError && (
        <View style={{ marginTop: 12 }}>
          <Text style={{ color: "crimson" }}>{saveError}</Text>
        </View>
      )}

      <View style={{ marginTop: 20 }}>
        {saving ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <ActivityIndicator />
            <Text>Entering recovery mode...</Text>
          </View>
        ) : (
          <>
            <Button
              title={focusSkill ? `Do a recovery drill: ${focusSkill}` : "Do a recovery drill"}
              onPress={() => {
                navigation.navigate("DrillRunner", {
                  userId,
                  levelId,
                  gateDefinition,
                  mode: "recovery",
                  focusSkill,
                });
              }}
            />
            <View style={{ height: 12 }} />
            <Button title="Back to Train Home" onPress={() => navigation.navigate("TrainHome", { userId })} />
            <View style={{ height: 12 }} />
            <Button
              title="Re-check Gate"
              onPress={() =>
                navigation.navigate("GateScreen", {
                  userId,
                  levelId,
                  gateDefinition,
                  gateReady: false,
                  gateReasons,
                  missingSkills,
                  mastery: storedProgress?.mastery ?? params?.mastery ?? {},
                  sessionScore0to100,
                  avgAccuracy0to1,
                })
              }
            />
          </>
        )}
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}