import type { ComponentType, ReactNode } from "react";
/**
 * Path: src/components/ui/Screen.tsx
 */

import { ScrollView as RNScrollView, View as RNView } from "react-native";
type NativePrimitiveProps = { children?: ReactNode; [key: string]: unknown };
type NativePrimitive = ComponentType<NativePrimitiveProps>;
type NativeStyle = Record<string, string | number>;
const ScrollView = RNScrollView as unknown as NativePrimitive;
const View = RNView as unknown as NativePrimitive;


// Web-safe shim for SafeAreaView
const SafeAreaView: React.FC<{ style?: NativeStyle; children?: ReactNode }> = ({ style, children }) => (
  <View style={style}>{children}</View>
);

import { theme } from "../../core/ui/theme";

interface ScreenProps {
  children?: ReactNode;
  scroll?: boolean;
  padded?: boolean;
}

export function Screen({
  children,
  scroll = false,
  padded = true,
}: ScreenProps) {
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

export default Screen;
