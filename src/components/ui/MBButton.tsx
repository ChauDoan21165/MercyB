// FILE: MBButton.tsx
// PATH: src/components/ui/MBButton.tsx

import React from "react";
import { Pressable, Text, ActivityIndicator, ViewStyle } from "react-native";
import { theme } from "../../core/ui/theme";

type Variant = "primary" | "ghost" | "danger";

export function MBButton(props: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  style?: ViewStyle;
}) {
  const { label, onPress, disabled, loading, variant = "primary" } = props;

  const bg =
    variant === "primary"
      ? theme.color.primary
      : variant === "danger"
      ? theme.color.danger
      : "transparent";

  const border =
    variant === "ghost" ? theme.color.border : "transparent";

  const textColor =
    variant === "ghost" ? theme.color.text : "#0B0F14";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        {
          height: 48,
          borderRadius: theme.radius.lg,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: bg,
          borderWidth: variant === "ghost" ? 1 : 0,
          borderColor: border,
          opacity: disabled ? 0.55 : 1,
        },
        props.style,
      ]}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text style={{ fontSize: 15, fontWeight: "800", color: textColor }}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}