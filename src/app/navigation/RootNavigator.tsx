// FILE: RootNavigator.tsx
// PATH: src/app/navigation/RootNavigator.tsx

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TabsNavigator from "./TabsNavigator";

// Screens
import OnboardingScreen from "../../screens/OnboardingScreen";
import PlacementScreen from "../../screens/PlacementScreen";

export type RootStackParamList = {
  Onboarding: undefined;
  Placement: undefined;
  MainTabs: { userId: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Start simple for MVP */}
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Placement" component={PlacementScreen} />
      <Stack.Screen name="MainTabs" component={TabsNavigator} />
    </Stack.Navigator>
  );
}