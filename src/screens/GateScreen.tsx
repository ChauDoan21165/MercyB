// FILE: GateScreen.tsx
// PATH: src/screens/GateScreen.tsx
//
// Purpose:
// - Shows gate readiness using the *exact* mastery/reasons passed from DrillResultScreen
// - Persists gate outcome + advances level (authoritative) via completeGateFlow()
// - Uses Mercy Host messaging for elite coaching tone
//
// Notes:
// - Expects navigation route names from TrainStack:
//   "TrainHome", "RecoveryScreen", "LevelMapScreen" (optional), etc.
// - If you don’t have LevelMapScreen yet, it falls back safely to TrainHome.

import React, { useMemo, useState } from "react";
import { View, Text, Button, ScrollView, ActivityIndicator } from "react-native";

import { buildMercyMessage } from "../core/engine/mercyHost";
import { completeGateFlow } from "../core/engine/gatingFlow";

import type { GateDefinition } from "../core/types/curriculum";

type GateParams = {
  userId: string;
  levelId: number;
  gateDefinition: GateDefinition;

  gateReady?: boolean;
  gateReasons?: string[];
  missingSkills?: string[];
  mastery?: any; // can be canonical mastery OR loose {skill:number}
  sessionScore0to100?: number;
  avgAccuracy0to1?: number;
};

interface Props {
  route: { params?: GateParams };
  navigation: any;
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

  const sample = mastery[keys[0]];
  // canonical
  if (sample && typeof sample === "object" && typeof sample.value === "number") {
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries<any>(mastery)) {
      if (v && typeof v.value === "number") out[k] = v.value;
    }
    return out;
  }

  // loose
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries<any>(mastery)) {
    const n = typeof v === "number" ? v : Number(v);
    if (Number.isFinite(n)) out[k] = Math.max(0, Math.min(1, n));
  }
  return out;
}

export default function GateScreen({ route, navigation }: Props) {
  const params = route?.params;

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (!params?.userId || params.levelId == null || !params.gateDefinition) {
    return (
      <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
        <Text style={{ fontSize: 28, fontWeight: "800" }}>Gate</Text>
        <Text style={{ marginTop: 10, fontSize: 16, opacity: 0.8 }}>
          This screen needs drill results (userId, levelId, gateDefinition).
        </Text>

        <View style={{ marginTop: 24 }}>
          <Button title="Back to Training" onPress={() => navigation.navigate("TrainHome")} />
        </View>
      </View>
    );
  }

  const {
    userId,
    levelId,
    gateDefinition,

    gateReady = false,
    gateReasons = [],
    missingSkills = [],
    mastery = {},
    sessionScore0to100 = 0,
    avgAccuracy0to1 = 0,
  } = params;

  const displayMastery = useMemo(() => toDisplayMastery(mastery), [mastery]);

  const mercy = useMemo(() => {
    return buildMercyMessage({
      userName: "Warrior",
      levelId,
      tone: "focused",
      seed: userId,
      mastery,
      sessionScore0to100,
      avgAccuracy0to1,
      gateReady,
      gateReasons,
      missingSkills,
    });
  }, [
    userId,
    levelId,
    mastery,
    sessionScore0to100,
    avgAccuracy0to1,
    gateReady,
    gateReasons,
    missingSkills,
  ]);

  async function handleAdvance() {
    setSaveError(null);
    setSaving(true);

    try {
      const next = await completeGateFlow({
        userId,
        levelId,
        gateDefinition,
        gateReady,
        updatedMastery: mastery,
        gateReasons,
        missingSkills,
      });

      // If you already built LevelMapScreen, go there.
      // Otherwise fall back to TrainHome safely.
      const hasLevelMap = Boolean((navigation as any)?.navigate);

      if (hasLevelMap) {
        // Prefer LevelMapScreen if it exists in your navigator
        try {
          navigation.navigate("LevelMapScreen", {
            userId,
            fromLevelId: levelId,
            toLevelId: next.currentLevelId,
          });
          return;
        } catch {
          // ignore and fallback
        }
      }

      navigation.navigate("TrainHome", { userId });
    } catch (e: any) {
      setSaveError(e?.message ?? "Failed to advance level.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "800" }}>Level {levelId} Gate Check</Text>

      <View style={{ marginTop: 16, padding: 16, borderWidth: 1, borderRadius: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>Session Summary</Text>
        <Text style={{ marginTop: 8 }}>Score: {sessionScore0to100}</Text>
        <Text>Accuracy: {pct(avgAccuracy0to1)}</Text>
      </View>

      <View style={{ marginTop: 16, padding: 16, borderWidth: 1, borderRadius: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>
          Gate Status:{" "}
          <Text style={{ fontWeight: "900" }}>{gateReady ? "READY ✅" : "NOT YET ❌"}</Text>
        </Text>

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
            <Text style={{ fontWeight: "700" }}>Missing Skills</Text>
            {missingSkills.map((s) => (
              <Text key={s} style={{ marginTop: 6, opacity: 0.85 }}>
                • {s}
              </Text>
            ))}
          </View>
        )}
      </View>

      <View style={{ marginTop: 16, padding: 16, borderWidth: 1, borderRadius: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>Mastery</Text>
        {Object.keys(displayMastery).length === 0 ? (
          <Text style={{ marginTop: 8, opacity: 0.75 }}>No mastery data provided.</Text>
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

      <View style={{ marginTop: 16, padding: 16, borderWidth: 1, borderRadius: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "800" }}>{mercy.title}</Text>
        <Text style={{ marginTop: 8, fontSize: 15, lineHeight: 20, opacity: 0.9 }}>
          {mercy.body}
        </Text>
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
            <Text>Saving gate result...</Text>
          </View>
        ) : gateReady ? (
          <>
            <Button title={`Advance to Level ${levelId + 1}`} onPress={handleAdvance} />
            <View style={{ height: 12 }} />
            <Button title="Back to Training" onPress={() => navigation.navigate("TrainHome", { userId })} />
          </>
        ) : (
          <>
            <Button
              title="Enter Recovery Mode"
              onPress={() =>
                navigation.navigate("RecoveryScreen", {
                  userId,
                  levelId,
                  gateDefinition,
                  gateReady,
                  gateReasons,
                  missingSkills,
                  mastery,
                  sessionScore0to100,
                  avgAccuracy0to1,
                })
              }
            />
            <View style={{ height: 12 }} />
            <Button title="Try Another Drill" onPress={() => navigation.navigate("TrainHome", { userId })} />
          </>
        )}
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}