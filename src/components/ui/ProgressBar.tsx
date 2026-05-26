// FILE: ProgressBar.tsx
// PATH: src/components/ui/ProgressBar.tsx

import React from "react";
import { View } from "react-native";
import { theme } from "../../core/ui/theme";

export function ProgressBar(props: { value0to1: number }) {
  const v = Math.max(0, Math.min(1, props.value0to1 || 0));
  return (
    <View
      style={{
        height: 10,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      <View
        style={{
          height: 10,
          width: `${Math.round(v * 100)}%`,
          backgroundColor: theme.color.primary2,
        }}
      />
    </View>
  );
}