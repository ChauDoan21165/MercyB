// FILE: TrainHomeScreen.tsx
// PATH: src/screens/TrainHomeScreen.tsx
//
// Purpose:
// - Main “Train” hub for the current level
// - Loads curriculum index + current level definition
// - Loads user progress from repo (source of truth)
// - Shows mastery snapshot + next recommended drill button
// - Routes into DrillRunner with the minimum params needed
//
// Notes:
// - Works even if progress isn’t initialized (gives a “Start” CTA to Onboarding/Placement)
// - Keeps routing names aligned with TrainStack you shared:
//   "Onboarding", "Placement", "TrainHome", "DrillRunner", "LevelMapScreen" (optional)

import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Button, ScrollView, ActivityIndicator } from "react-native";

import type { LevelsIndex, LevelDefinition, GateDefinition, SkillId, Drill } from "../core/types/curriculum";
import type { UserProgress } from "../core/types/session";

import { loadLevelsIndex, loadLevel, loadUserProgress } from "../core/storage/repo";

type TrainHomeParams = {
  userId?: string;
};

interface Props {
  route: { params?: TrainHomeParams };
  navigation: any;
}

function pct(n0to1: number | undefined): string {
  if (n0to1 == null || Number.isNaN(n0to1)) return "—";
  return `${Math.round(n0to1 * 100)}%`;
}

function coerceUserId(routeUserId?: string, progressUserId?: string): string {
  return (routeUserId ?? progressUserId ?? "local_user").trim() || "local_user";
}

/** normalize canonical mastery -> {skill: 0..1} */
function toDisplayMastery(progress: UserProgress | null): Record<string, number> {
  const m = progress?.mastery;
  if (!m) return {};
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries<any>(m)) {
    if (v && typeof v.value === "number") out[k] = v.value;
  }
  return out;
}

/**
 * Very simple “next drill” selection:
 * - pick a drill that trains the lowest mastery skill that exists in this level
 * - fallback to the first drill of first module
 */
function pickNextDrill(level: LevelDefinition, mastery: Record<string, number>): { drill: Drill; skillImpacted: SkillId } {
  const drills: Drill[] = level.modules.flatMap((m) => m.drills ?? []);
  if (drills.length === 0) {
    throw new Error("No drills found in this level.");
  }

  // compute lowest mastery skill
  const masteryEntries = Object.entries(mastery);
  masteryEntries.sort((a, b) => (a[1] ?? 0) - (b[1] ?? 0));
  const lowestSkill = (masteryEntries[0]?.[0] as SkillId | undefined) ?? (drills[0].skills?.[0] as SkillId);

  // pick a drill containing that skill
  const match = drills.find((d) => (d.skills ?? []).includes(lowestSkill));
  const drill = match ?? drills[0];
  const skillImpacted = (drill.skills?.[0] as SkillId) ?? "reading";

  return { drill, skillImpacted };
}

export default function TrainHomeScreen({ route, navigation }: Props) {
  const routeUserId = route?.params?.userId;

  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState<LevelsIndex | null>(null);
  const [level, setLevel] = useState<LevelDefinition | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load repo + curriculum
  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setError(null);
        setLoading(true);

        const p = loadUserProgress();
        if (!alive) return;
        setProgress(p);

        const idx = await loadLevelsIndex();
        if (!alive) return;
        setIndex(idx);

        const currentLevelId = p?.currentLevelId ?? 1;
        const def = await loadLevel(currentLevelId);
        if (!alive) return;
        setLevel(def);

        setLoading(false);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? "Failed to load training data.");
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const userId = useMemo(() => coerceUserId(routeUserId, progress?.userId), [routeUserId, progress?.userId]);

  const displayMastery = useMemo(() => toDisplayMastery(progress), [progress]);

  const next = useMemo(() => {
    if (!level) return null;
    return pickNextDrill(level, displayMastery);
  }, [level, displayMastery]);

  // If user progress not initialized yet
  const needsSetup = !progress;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Loading training...</Text>
      </View>
    );
  }

  if (error || !index || !level) {
    return (
      <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
        <Text style={{ fontSize: 20, fontWeight: "700" }}>Train</Text>
        <Text style={{ marginTop: 10 }}>{error ?? "Missing curriculum data."}</Text>
        <View style={{ marginTop: 20 }}>
          <Button title="Go back" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  if (needsSetup) {
    return (
      <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
        <Text style={{ fontSize: 28, fontWeight: "800" }}>Mercy Blade</Text>
        <Text style={{ marginTop: 10, fontSize: 16, opacity: 0.85 }}>
          Start your training profile so Mercy Host can track mastery and unlock levels.
        </Text>

        <View style={{ marginTop: 24 }}>
          <Button title="Start Onboarding" onPress={() => navigation.navigate("Onboarding")} />
          <View style={{ height: 12 }} />
          <Button title="Placement Test" onPress={() => navigation.navigate("Placement", { userId })} />
        </View>
      </View>
    );
  }

  const levelId = level.levelId;
  const gateDefinition: GateDefinition = level.gate;

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      {/* Header */}
      <Text style={{ fontSize: 28, fontWeight: "800" }}>Train</Text>
      <Text style={{ marginTop: 6, fontSize: 16, opacity: 0.85 }}>
        Level {levelId}: {level.title}
      </Text>
      <Text style={{ marginTop: 10, fontSize: 14, lineHeight: 20, opacity: 0.8 }}>{level.description}</Text>

      {/* Quick actions */}
      <View style={{ marginTop: 18 }}>
        <Button
          title="View Level Map"
          onPress={() => {
            // If LevelMapScreen exists, go there; else ignore safely.
            try {
              navigation.navigate("LevelMapScreen", { userId, levelId });
            } catch {
              // fallback: no-op
            }
          }}
        />
      </View>

      {/* Mastery Snapshot */}
      <View style={{ marginTop: 16, padding: 16, borderWidth: 1, borderRadius: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>Mastery Snapshot</Text>

        {Object.keys(displayMastery).length === 0 ? (
          <Text style={{ marginTop: 10, opacity: 0.75 }}>No mastery data yet. Start a drill to establish baseline.</Text>
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

      {/* Next drill card */}
      <View style={{ marginTop: 16, padding: 16, borderWidth: 1, borderRadius: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>Next Drill</Text>

        {next ? (
          <>
            <Text style={{ marginTop: 10, fontWeight: "800" }}>{next.drill.title}</Text>
            <Text style={{ marginTop: 6, opacity: 0.85 }}>
              Kind: {next.drill.kind} • Difficulty: {next.drill.difficulty} • Focus: {next.skillImpacted}
            </Text>

            <View style={{ marginTop: 14 }}>
              <Button
                title="Start Drill"
                onPress={() => {
                  navigation.navigate("DrillRunner", {
                    userId,
                    levelId,
                    drillId: next.drill.drillId,
                    drill: next.drill, // optional convenience
                    skillImpacted: next.skillImpacted,
                    gateDefinition,
                  });
                }}
              />
            </View>
          </>
        ) : (
          <Text style={{ marginTop: 10, opacity: 0.75 }}>No drill available.</Text>
        )}
      </View>

      {/* Modules list */}
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>Modules</Text>

        {level.modules.map((m) => (
          <View key={m.moduleId} style={{ marginTop: 12, padding: 16, borderWidth: 1, borderRadius: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "800" }}>{m.title}</Text>
            {m.description ? <Text style={{ marginTop: 6, opacity: 0.8 }}>{m.description}</Text> : null}

            <Text style={{ marginTop: 10, fontWeight: "700" }}>Drills</Text>
            {(m.drills ?? []).slice(0, 3).map((d) => (
              <View key={d.drillId} style={{ marginTop: 8 }}>
                <Text style={{ fontWeight: "700" }}>{d.title}</Text>
                <Text style={{ opacity: 0.8 }}>
                  {d.kind} • diff {d.difficulty} • skills: {(d.skills ?? []).join(", ")}
                </Text>
                <View style={{ marginTop: 6 }}>
                  <Button
                    title="Start this drill"
                    onPress={() => {
                      const skillImpacted = (d.skills?.[0] as SkillId) ?? "reading";
                      navigation.navigate("DrillRunner", {
                        userId,
                        levelId,
                        drillId: d.drillId,
                        drill: d,
                        skillImpacted,
                        gateDefinition,
                      });
                    }}
                  />
                </View>
              </View>
            ))}

            {(m.drills ?? []).length > 3 ? (
              <Text style={{ marginTop: 10, opacity: 0.7 }}>
                +{(m.drills ?? []).length - 3} more drills (we’ll add “See all” later)
              </Text>
            ) : null}
          </View>
        ))}
      </View>

      <View style={{ height: 28 }} />
    </ScrollView>
  );
}