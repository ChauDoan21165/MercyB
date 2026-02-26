// FILE: LevelMapScreen.tsx
// PATH: src/screens/LevelMapScreen.tsx
//
// Purpose:
// - Visual progression map (Levels 1 → 9)
// - Shows: locked / current / completed
// - Shows mini “gate criteria summary” (from levels index + per-level file)
// - Uses repo as source of truth (UserProgress.currentLevelId)
// - Lets user jump into training for current level
//
// Assumptions:
// - You have curriculum JSON:
//   - src/core/curriculum/levels.json  (index list with levelId, title, shortDesc maybe)
//   - src/core/curriculum/level_1.json, level_2.json ...
// - repo.ts exports loadLevelsIndex() and loadLevel(levelId)

import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";

import { loadLevelsIndex, loadLevel, loadUserProgress } from "../core/storage/repo";
import type { LevelsIndex, LevelDefinition, GateDefinition } from "../core/types/curriculum";
import type { UserProgress } from "../core/types/session";

type LevelRow = {
  levelId: number;
  title: string;
  subtitle?: string;
  status: "completed" | "current" | "locked";
  gate?: GateDefinition | null;
};

interface Props {
  route: { params?: { userId?: string; fromLevelId?: number; toLevelId?: number } };
  navigation: any;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function statusLabel(status: LevelRow["status"]) {
  if (status === "completed") return "Completed ✅";
  if (status === "current") return "Current ⭐️";
  return "Locked 🔒";
}

function gateSummary(gate?: GateDefinition | null): string {
  if (!gate) return "Gate: —";
  // Keep this robust; we don’t assume exact schema beyond "skills" + "min"
  const anyGate: any = gate as any;

  // Common patterns you may have:
  // gate.skills: [{ skillId, min0to1 }] or { skill, min }
  const skills = Array.isArray(anyGate.skills) ? anyGate.skills : [];
  if (skills.length > 0) {
    const parts = skills.slice(0, 3).map((s: any) => {
      const name = String(s.skillId ?? s.skill ?? s.id ?? "skill");
      const min = s.min0to1 ?? s.min ?? s.threshold0to1 ?? null;
      const pct = typeof min === "number" ? `${Math.round(min * 100)}%` : "—";
      return `${name} ≥ ${pct}`;
    });
    return `Gate: ${parts.join(" • ")}${skills.length > 3 ? " • …" : ""}`;
  }

  // Fallback: show attempts requirement if present
  const minAttempts = anyGate.minAttempts ?? anyGate.attempts ?? null;
  if (typeof minAttempts === "number") return `Gate: ≥ ${minAttempts} attempts`;

  return "Gate: criteria set";
}

export default function LevelMapScreen({ route, navigation }: Props) {
  const userId = route?.params?.userId;

  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState<LevelsIndex | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [gateByLevel, setGateByLevel] = useState<Record<number, GateDefinition | null>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function boot() {
      try {
        setError(null);
        setLoading(true);

        const p = loadUserProgress();
        if (!p) throw new Error("User progress not initialized");
        if (userId && p.userId && p.userId !== userId) throw new Error("Progress user mismatch");

        const idx = await loadLevelsIndex();

        // Preload gates for levels in the index (cheap, since local JSON)
        const gates: Record<number, GateDefinition | null> = {};
        const items: any[] = (idx as any).levels ?? (idx as any) ?? [];
        for (const it of items) {
          const levelId = Number(it.levelId ?? it.id ?? it.level ?? NaN);
          if (!Number.isFinite(levelId)) continue;
          try {
            const level = (await loadLevel(levelId)) as LevelDefinition;
            gates[levelId] = (level as any).gateDefinition ?? (level as any).gate ?? null;
          } catch {
            gates[levelId] = null;
          }
        }

        if (!alive) return;
        setProgress(p);
        setIndex(idx);
        setGateByLevel(gates);
        setLoading(false);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? "Failed to load Level Map");
        setLoading(false);
      }
    }

    boot();
    return () => {
      alive = false;
    };
  }, [userId]);

  const rows: LevelRow[] = useMemo(() => {
    if (!index || !progress) return [];

    const current = clamp(progress.currentLevelId ?? 1, 1, 9);

    const rawLevels: any[] = (index as any).levels ?? (index as any);
    // If levels.json isn’t shaped, fallback to 1..9
    const fallback = Array.from({ length: 9 }, (_, i) => ({ levelId: i + 1, title: `Level ${i + 1}` }));

    const list = Array.isArray(rawLevels) && rawLevels.length > 0 ? rawLevels : fallback;

    return list
      .map((it) => {
        const levelId = Number(it.levelId ?? it.id ?? it.level ?? NaN);
        const title = String(it.title ?? `Level ${levelId}`);
        const subtitle = it.subtitle ?? it.desc ?? it.shortDesc ?? undefined;

        const status: LevelRow["status"] =
          levelId < current ? "completed" : levelId === current ? "current" : "locked";

        return {
          levelId,
          title,
          subtitle,
          status,
          gate: gateByLevel[levelId] ?? null,
        } as LevelRow;
      })
      .filter((r) => Number.isFinite(r.levelId))
      .sort((a, b) => a.levelId - b.levelId);
  }, [index, progress, gateByLevel]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Loading Level Map…</Text>
      </View>
    );
  }

  if (error || !progress) {
    return (
      <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "800" }}>Level Map</Text>
        <Text style={{ marginTop: 10, opacity: 0.85 }}>{error ?? "No progress data."}</Text>
        <View style={{ height: 16 }} />
        <Pressable
          onPress={() => navigation.navigate("TrainHome")}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderWidth: 1,
            borderRadius: 12,
            alignSelf: "flex-start",
          }}
        >
          <Text style={{ fontWeight: "700" }}>Back to Training</Text>
        </Pressable>
      </View>
    );
  }

  const currentLevelId = clamp(progress.currentLevelId ?? 1, 1, 9);

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "900" }}>Your Path</Text>
      <Text style={{ marginTop: 8, fontSize: 15, opacity: 0.8 }}>
        Levels 1 → 9. Only one job: earn the next gate.
      </Text>

      {/* Current header */}
      <View style={{ marginTop: 16, padding: 16, borderWidth: 1, borderRadius: 14 }}>
        <Text style={{ fontSize: 18, fontWeight: "800" }}>Current Level</Text>
        <Text style={{ marginTop: 6, fontSize: 16 }}>
          Level <Text style={{ fontWeight: "900" }}>{currentLevelId}</Text>
        </Text>
        <Text style={{ marginTop: 6, opacity: 0.8 }}>
          Attempts in this level: <Text style={{ fontWeight: "800" }}>{progress.attemptsInCurrentLevel ?? 0}</Text>
        </Text>

        <View style={{ height: 12 }} />

        <Pressable
          onPress={() => {
            navigation.navigate("TrainHome", { userId: progress.userId });
          }}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderWidth: 1,
            borderRadius: 12,
            alignSelf: "flex-start",
          }}
        >
          <Text style={{ fontWeight: "800" }}>Continue Training</Text>
        </Pressable>
      </View>

      {/* Level list */}
      <View style={{ marginTop: 16 }}>
        {rows.map((r) => {
          const clickable = r.status !== "locked";
          return (
            <Pressable
              key={r.levelId}
              disabled={!clickable}
              onPress={() => {
                if (r.status === "current") {
                  navigation.navigate("TrainHome", { userId: progress.userId });
                  return;
                }
                // Completed levels: allow review later (for MVP: just show a detail stub)
                navigation.navigate("ProgressScreen", { userId: progress.userId, levelId: r.levelId });
              }}
              style={{
                padding: 16,
                borderWidth: 1,
                borderRadius: 14,
                marginBottom: 12,
                opacity: r.status === "locked" ? 0.45 : 1,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: "900" }}>
                    Level {r.levelId}: {r.title}
                  </Text>
                  {r.subtitle ? <Text style={{ marginTop: 6, opacity: 0.85 }}>{r.subtitle}</Text> : null}
                  <Text style={{ marginTop: 8, fontWeight: "700" }}>{statusLabel(r.status)}</Text>
                  <Text style={{ marginTop: 6, opacity: 0.8 }}>{gateSummary(r.gate)}</Text>
                </View>

                {/* Right rail “node” */}
                <View
                  style={{
                    width: 16,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      borderWidth: 1,
                    }}
                  />
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}