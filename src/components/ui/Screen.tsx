// FILE: Screen.tsx
// PATH: src/components/ui/Screen.tsx

import React from "react";
import { SafeAreaView, View, ScrollView } from "react-native";
import { theme } from "../../core/ui/theme";

export function Screen(props: {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
}) {
  const { children, scroll = false, padded = true } = props;

  const content = (
    <View style={{ flex: 1, padding: padded ? theme.space.lg : 0 }}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.color.bg }}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}