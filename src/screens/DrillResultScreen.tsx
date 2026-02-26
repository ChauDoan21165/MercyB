// FILE: DrillResultScreen.tsx
// PATH: src/screens/DrillResultScreen.tsx
//
// Purpose:
// - Runs the engine "completeDrillFlow" once after a drill finishes
// - Shows session score + Mercy Host message
// - Navigates to GateScreen with the *exact* mastery + gate reasons from the flow result
//   (so GateScreen always shows correct mastery/reasons)
//
// Important:
// - Route names must match your TrainStack:
//   "TrainHome", "DrillRunner", "DrillResult", "GateScreen", "RecoveryScreen"

import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";

import { completeDrillFlow } from "../core/engine/trainingFlow";
import { buildMercyMessage } from "../core/engine/mercyHost";

import type { DrillAttemptInput } from "../core/engine/scoring";
import type { GateDefinition } from "../core/types/curriculum";

type NavAction = "start_next" | "recovery" | "level_up" | "back";

type MercyCTA = {
  label: string;
  action: NavAction;
};

type MercyMessage = {
  title: string;
  body: string;
  cta: MercyCTA;
};

type DrillFlowResult = {
  sessionScore: number;
  avgAccuracy?: number | null;
  gateReady: boolean;
  gateReasons?: string[];
  missingSkills?: string[];
  updatedProgress: {
    mastery: Record<string, any>;
  };
};

interface Props {
  route: any;
  navigation: any;
}

export default function DrillResultScreen({ route, navigation }: Props) {
  const params = route?.params ?? {};

  const drillInput: DrillAttemptInput | undefined = params.drillInput;
  const skillImpacted: string | undefined = params.skillImpacted;
  const levelId: number | undefined = params.levelId;
  const gateDefinition: GateDefinition | undefined = params.gateDefinition;
  const userId: string | undefined = params.userId;

  const canRun = useMemo(() => {
    return Boolean(
      drillInput &&
        typeof skillImpacted === "string" &&
        typeof levelId === "number" &&
        gateDefinition &&
        typeof userId === "string"
    );
  }, [drillInput, skillImpacted, levelId, gateDefinition, userId]);

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<DrillFlowResult | null>(null);
  const [mercy, setMercy] = useState<MercyMessage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function process() {
      try {
        if (!canRun) throw new Error("Missing required result parameters.");

        const flow = (await completeDrillFlow({
          userId: userId as string,
          levelId: levelId as number,
          gateDefinition: gateDefinition as GateDefinition,
          drillInput: drillInput as DrillAttemptInput,
          skillImpacted: skillImpacted as string,
        })) as DrillFlowResult;

        if (!alive) return;

        setResult(flow);

        const mercyMessage = buildMercyMessage({
          userName: "Warrior",
          levelId: levelId as number,
          tone: "focused",
          seed: userId as string,
          mastery: flow.updatedProgress.mastery,
          sessionScore0to100: flow.sessionScore,
          avgAccuracy0to1: flow.avgAccuracy ?? undefined,
          gateReady: flow.gateReady,
          gateReasons: flow.gateReasons ?? [],
          missingSkills: flow.missingSkills ?? [],
        }) as MercyMessage;

        if (!alive) return;

        setMercy(mercyMessage);
        setLoading(false);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? "Failed to process results.");
        setLoading(false);
      }
    }

    process();
    return () => {
      alive = false;
    };
  }, [canRun, userId, levelId, gateDefinition, drillInput, skillImpacted]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Processing results...</Text>
      </View>
    );
  }

  if (error || !result || !mercy) {
    return (
      <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Something went wrong</Text>
        <Text style={{ marginTop: 8 }}>{error ?? "No result data."}</Text>
        <View style={{ marginTop: 24 }}>
          <Button title="Go back" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  const mastery = result.updatedProgress?.mastery ?? {};
  const gateReady = Boolean(result.gateReady);
  const gateReasons = result.gateReasons ?? [];
  const missingSkills = result.missingSkills ?? [];
  const sessionScore0to100 = result.sessionScore ?? 0;
  const avgAccuracy0to1 = result.avgAccuracy ?? 0;

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {/* Score */}
      <Text style={{ fontSize: 32, fontWeight: "bold" }}>Score: {sessionScore0to100}</Text>

      {result.avgAccuracy != null && (
        <Text style={{ marginTop: 8 }}>Accuracy: {Math.round((avgAccuracy0to1 ?? 0) * 100)}%</Text>
      )}

      {/* Mercy Host */}
      <View style={{ marginTop: 24 }}>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>{mercy.title}</Text>
        <Text style={{ marginTop: 8 }}>{mercy.body}</Text>
      </View>

      {/* CTA */}
      <View style={{ marginTop: 32 }}>
        <Button
          title={mercy.cta.label}
          onPress={() => {
            switch (mercy.cta.action) {
              case "start_next":
                navigation.navigate("TrainHome", { userId });
                break;

              case "recovery":
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
                });
                break;

              case "level_up":
                // ✅ KEY FIX: pass the flow outputs so GateScreen always shows correct mastery/reasons.
                navigation.navigate("GateScreen", {
                  userId,
                  levelId,
                  gateDefinition,

                  gateReady,
                  gateReasons,
                  missingSkills,
                  mastery,
                  sessionScore0to100,
                  avgAccuracy0to1,
                });
                break;

              case "back":
              default:
                navigation.goBack();
                break;
            }
          }}
        />
      </View>
    </View>
  );
}