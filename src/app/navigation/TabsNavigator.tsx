// FILE: TabsNavigator.tsx
// PATH: src/app/navigation/TabsNavigator.tsx

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import TrainStack from "./TrainStack";

// Screens
import LevelMapScreen from "../../screens/LevelMapScreen";
import ProgressScreen from "../../screens/ProgressScreen";
import ProfileScreen from "../../screens/ProfileScreen";

export type TabsParamList = {
  TrainTab: { userId: string } | undefined;
  LevelMap: { userId: string } | undefined;
  Progress: { userId: string } | undefined;
  Profile: { userId: string } | undefined;
};

const Tabs = createBottomTabNavigator<TabsParamList>();

export default function TabsNavigator({ route }: any) {
  const userId: string | undefined = route?.params?.userId;

  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="TrainTab"
        component={TrainStack}
        initialParams={userId ? { userId } : undefined}
        options={{ title: "Train" }}
      />
      <Tabs.Screen
        name="LevelMap"
        component={LevelMapScreen}
        initialParams={userId ? { userId } : undefined}
        options={{ title: "Levels" }}
      />
      <Tabs.Screen
        name="Progress"
        component={ProgressScreen}
        initialParams={userId ? { userId } : undefined}
        options={{ title: "Progress" }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={userId ? { userId } : undefined}
        options={{ title: "Profile" }}
      />
    </Tabs.Navigator>
  );
}