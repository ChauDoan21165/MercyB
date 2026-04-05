// PATH: src/components/ui/MBButton.tsx

import { ActivityIndicator, Pressable, Text } from "react-native";

// Web-friendly RN shim types
type StyleProp<T> = T | T[] | null | undefined;
type ViewStyle = Record<string, unknown>;

import { theme } from "../../core/ui/theme";

type Variant = "primary" | "ghost" | "danger";

interface MBButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
}

export function MBButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  style,
}: MBButtonProps) {
  const bg =
    variant === "primary"
      ? theme.color.primary
      : variant === "danger"
        ? theme.color.danger
        : "transparent";

  const border = variant === "ghost" ? theme.color.border : "transparent";
  const textColor = variant === "ghost" ? theme.color.text : "#0B0F14";
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[
        {
          height: 48,
          borderRadius: theme.radius.lg,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: bg,
          borderWidth: variant === "ghost" ? 1 : 0,
          borderColor: border,
          opacity: isDisabled ? 0.55 : 1,
        },
        style,
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

export default MBButton;