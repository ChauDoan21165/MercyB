// FILE: Bits.tsx
// PATH: src/components/ui/Bits.tsx

import React from "react";
import { View, Text } from "react-native";
import { theme } from "../../core/ui/theme";

export function Divider() {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: theme.color.border,
        marginVertical: theme.space.md,
      }}
    />
  );
}

export function Badge(props: { label: string; tone?: "ok" | "warn" | "bad" }) {
  const tone = props.tone ?? "ok";
  const bg =
    tone === "ok"
      ? "rgba(47, 227, 140, 0.14)"
      : tone === "warn"
      ? "rgba(255, 200, 87, 0.14)"
      : "rgba(255, 77, 109, 0.14)";

  const fg =
    tone === "ok"
      ? theme.color.success
      : tone === "warn"
      ? theme.color.warning
      : theme.color.danger;

  return (
    <View
      style={{
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.10)",
      }}
    >
      <Text style={{ color: fg, fontWeight: "800", fontSize: 12 }}>
        {props.label}
      </Text>
    </View>
  );
}