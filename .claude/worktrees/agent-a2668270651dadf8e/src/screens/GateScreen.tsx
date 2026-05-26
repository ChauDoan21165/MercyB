// PATH: src/screens/GateScreen.tsx

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
  mastery?: any;
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

function toDisplayMastery(mastery: any): Record<string, number> {
  if (!mastery || typeof mastery !== "object") return {};
  const keys = Object.keys(mastery);
  if (keys.length === 0) return {};

  const sample = mastery[keys[0]];

  if (sample && typeof sample === "object" && typeof sample.value === "number") {
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries<any>(mastery)) {
      if (v && typeof v.value === "number") out[k] = v.value;
    }
    return out;
  }

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

      // ✅ FIX: relax strict type
      mastery: mastery as any,

      sessionScore0to100,
      avgAccuracy0to1,
      gateReady,
      gateReasons,

      // ✅ FIX: remove SkillId cast
      missingSkills: (missingSkills ?? []) as any,
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
      });

      try {
        navigation.navigate("LevelMapScreen", {
          userId,
          fromLevelId: levelId,
          toLevelId: next.currentLevelId,
        });
        return;
      } catch {}

      navigation.navigate("TrainHome", { userId });
    } catch (e: any) {
      setSaveError(e?.message ?? "Failed to advance level.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "800" }}>
        Level {levelId} Gate Check
      </Text>

      <View style={{ marginTop: 16, padding: 16, borderWidth: 1, borderRadius: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>Session Summary</Text>
        <Text style={{ marginTop: 8 }}>Score: {sessionScore0to100}</Text>
        <Text>Accuracy: {pct(avgAccuracy0to1)}</Text>
      </View>

      <View style={{ marginTop: 16, padding: 16, borderWidth: 1, borderRadius: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>
          Gate Status:{" "}
          <Text style={{ fontWeight: "900" }}>
            {gateReady ? "READY ✅" : "NOT YET ❌"}
          </Text>
        </Text>

        {gateReasons.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontWeight: "700" }}>Reasons</Text>
            {gateReasons.map((r, idx) => (
              <Text key={`${idx}-${r}`} style={{ marginTop: 6 }}>
                • {r}
              </Text>
            ))}
          </View>
        )}

        {missingSkills.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontWeight: "700" }}>Missing Skills</Text>
            {missingSkills.map((s) => (
              <Text key={s} style={{ marginTop: 6 }}>
                • {s}
              </Text>
            ))}
          </View>
        )}
      </View>

      <View style={{ marginTop: 16, padding: 16, borderWidth: 1, borderRadius: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>Mastery</Text>
        {Object.entries(displayMastery).map(([skill, v]) => (
          <View key={skill} style={{ marginTop: 10 }}>
            <Text>{skill}</Text>
            <Text>{pct(v)}</Text>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 16, padding: 16, borderWidth: 1, borderRadius: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "800" }}>{mercy.title}</Text>
        <Text style={{ marginTop: 8 }}>{mercy.body}</Text>
      </View>

      {saveError && <Text style={{ color: "crimson" }}>{saveError}</Text>}

      <View style={{ marginTop: 20 }}>
        {saving ? (
          <ActivityIndicator />
        ) : gateReady ? (
          <Button title={`Advance to Level ${levelId + 1}`} onPress={handleAdvance} />
        ) : (
          <Button title="Back to Training" onPress={() => navigation.navigate("TrainHome")} />
        )}
      </View>
    </ScrollView>
  );
}