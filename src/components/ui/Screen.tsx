/**
 * Path: src/components/ui/Screen.tsx
 */

import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";

// Web-safe shim for SafeAreaView
const SafeAreaView: React.FC<{ style?: any; children?: ReactNode }> = ({ style, children }) => (
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
