// FILE: OnboardingScreen.tsx
// PATH: src/screens/OnboardingScreen.tsx
//
// Purpose:
// - Minimal onboarding to initialize UserProgress in repo
// - Creates a local userId if missing
// - Sets starting level (default 1)
// - Sends user to TrainHome
//
// Notes:
// - This is intentionally simple for MVP.
// - Later you can add name, goals, time budget, etc.

import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";

import type { UserProgress } from "../core/types/session";
import type { SkillId } from "../core/types/curriculum";

import { loadUserProgress, saveUserProgress, clearSessions, clearUserProgress } from "../core/storage/repo";

function nowISO(): string {
  return new Date().toISOString();
}

function ensureUserId(existing?: string | null): string {
  const trimmed = (existing ?? "").trim();
  if (trimmed) return trimmed;
  // simple local id (no dependency)
  return `user_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

function initialMastery(): UserProgress["mastery"] {
  const base = 0.2;
  const skills: SkillId[] = [
    "listening",
    "reading",
    "speaking",
    "writing",
    "vocabulary",
    "grammar",
    "pronunciation",
  ];

  const m = {} as UserProgress["mastery"];
  for (const s of skills) {
    m[s] = { value: base, updatedAtISO: new Date(0).toISOString() };
  }
  return m;
}

interface Props {
  route: { params?: { userId?: string } };
  navigation: any;
}

export default function OnboardingScreen({ route, navigation }: Props) {
  const existing = useMemo(() => loadUserProgress(), []);
  const initialUserId = useMemo(
    () => ensureUserId(route?.params?.userId ?? existing?.userId),
    [route?.params?.userId, existing?.userId]
  );

  const [userId, setUserId] = useState(initialUserId);
  const [startLevelId, setStartLevelId] = useState<number>(existing?.currentLevelId ?? 1);
  const [error, setError] = useState<string | null>(null);

  function clampLevel(n: number): number {
    if (!Number.isFinite(n)) return 1;
    return Math.max(1, Math.min(9, Math.floor(n)));
  }

  function handleStart() {
    setError(null);

    const uid = ensureUserId(userId);
    const levelId = clampLevel(startLevelId);

    const progress: UserProgress = {
      userId: uid,
      currentLevelId: levelId,
      mastery: existing?.mastery ?? initialMastery(),
      attemptsInCurrentLevel: existing?.attemptsInCurrentLevel ?? 0,
      completedDrillIds: existing?.completedDrillIds ?? [],
    };

    try {
      saveUserProgress(progress);
      navigation.reset?.({
        index: 0,
        routes: [{ name: "TrainHome", params: { userId: uid } }],
      });
      // If reset isn't available, fallback:
      navigation.navigate("TrainHome", { userId: uid });
    } catch (e: any) {
      setError(e?.message ?? "Failed to start.");
    }
  }

  function handleFreshStart() {
    // optional convenience for testing
    clearSessions();
    clearUserProgress();
    const uid = ensureUserId(null);
    setUserId(uid);
    setStartLevelId(1);
    setError(null);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "800" }}>Welcome</Text>
      <Text style={{ marginTop: 10, fontSize: 16, opacity: 0.85 }}>
        Mercy Host will track your mastery and unlock levels when you earn them.
      </Text>

      <View style={{ marginTop: 20, padding: 16, borderWidth: 1, borderRadius: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: "700" }}>Your User ID</Text>
        <Text style={{ marginTop: 6, opacity: 0.75 }}>
          (Local-only for MVP. You can change it for testing.)
        </Text>

        <TextInput
          value={userId}
          onChangeText={setUserId}
          autoCapitalize="none"
          autoCorrect={false}
          style={{
            marginTop: 10,
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
          placeholder="user_..."
        />
      </View>

      <View style={{ marginTop: 16, padding: 16, borderWidth: 1, borderRadius: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: "700" }}>Starting Level</Text>
        <Text style={{ marginTop: 6, opacity: 0.75 }}>Default is Level 1. You can run Placement later.</Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
          <View style={{ flex: 1 }}>
            <Button title="-" onPress={() => setStartLevelId((v) => clampLevel(v - 1))} />
          </View>

          <Text style={{ width: 80, textAlign: "center", fontSize: 22, fontWeight: "800" }}>
            {startLevelId}
          </Text>

          <View style={{ flex: 1 }}>
            <Button title="+" onPress={() => setStartLevelId((v) => clampLevel(v + 1))} />
          </View>
        </View>

        <Text style={{ marginTop: 10, opacity: 0.75 }}>
          Tip: Start low, prove consistency, then climb fast.
        </Text>
      </View>

      {error ? (
        <View style={{ marginTop: 14 }}>
          <Text style={{ color: "crimson" }}>{error}</Text>
        </View>
      ) : null}

      <View style={{ marginTop: 20 }}>
        <Button title="Start Training" onPress={handleStart} />
        <View style={{ height: 12 }} />
        <Button title="Run Placement Test" onPress={() => navigation.navigate("Placement", { userId })} />
        <View style={{ height: 12 }} />
        <Button title="Reset Local Data (dev)" onPress={handleFreshStart} />
      </View>

      <View style={{ height: 28 }} />
      <Text style={{ opacity: 0.6, fontSize: 12 }}>
        {`Timestamp: ${nowISO()}`}
      </Text>
    </ScrollView>
  );
}