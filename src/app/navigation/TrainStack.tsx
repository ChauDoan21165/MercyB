// FILE: TrainStack.tsx
// PATH: src/app/navigation/TrainStack.tsx

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens you listed
import OnboardingScreen from "../../screens/OnboardingScreen";
import PlacementScreen from "../../screens/PlacementScreen";
import TrainHomeScreen from "../../screens/TrainHomeScreen";
import DrillRunnerScreen from "../../screens/DrillRunnerScreen";
import DrillResultScreen from "../../screens/DrillResultScreen";
import GateScreen from "../../screens/GateScreen";
import RecoveryScreen from "../../screens/RecoveryScreen";

export type TrainStackParamList = {
  Onboarding: undefined;
  Placement: { userId?: string } | undefined;

  TrainHome: { userId: string } | undefined;

  DrillRunner: {
    userId: string;
    levelId: number;
    // add more later (drillId, drill definition, etc.)
  };

  DrillResult: {
    userId: string;
    levelId: number;

    drillInput: any;
    skillImpacted: string;
    gateDefinition: any;
  };

  GateScreen: {
    userId: string;
    levelId: number;
    gateDefinition: any;

    gateReady?: boolean;
    gateReasons?: string[];
    missingSkills?: string[];
    mastery?: Record<string, number>;
    sessionScore0to100?: number;
    avgAccuracy0to1?: number;
  };

  RecoveryScreen: {
    userId: string;
    levelId: number;
    gateDefinition: any;

    gateReady?: boolean;
    gateReasons?: string[];
    missingSkills?: string[];
    mastery?: Record<string, number>;
    sessionScore0to100?: number;
    avgAccuracy0to1?: number;
  };
};

const Stack = createNativeStackNavigator<TrainStackParamList>();

export default function TrainStack() {
  return (
    <Stack.Navigator
      initialRouteName="TrainHome"
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen as any} />
      <Stack.Screen name="Placement" component={PlacementScreen as any} />
      <Stack.Screen
        name="TrainHome"
        component={TrainHomeScreen as any}
        options={{ title: "Train" }}
      />
      <Stack.Screen
        name="DrillRunner"
        component={DrillRunnerScreen as any}
        options={{ title: "Drill" }}
      />
      <Stack.Screen
        name="DrillResult"
        component={DrillResultScreen as any}
        options={{ title: "Results" }}
      />
      <Stack.Screen
        name="GateScreen"
        component={GateScreen as any}
        options={{ title: "Gate" }}
      />
      <Stack.Screen
        name="RecoveryScreen"
        component={RecoveryScreen as any}
        options={{ title: "Recovery" }}
      />
    </Stack.Navigator>
  );
}