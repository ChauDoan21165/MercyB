// FILE: Card.tsx
// PATH: src/components/ui/Card.tsx
//
// Merge notes:
// - Keeps the shadcn-style component API: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
// - React Native implementation (View/Text), not web div/className.
// - Uses theme tokens for consistent Mercy Blade look.

import React from "react";
import { View, Text, StyleSheet, ViewProps, TextProps } from "react-native";
import { theme } from "../../core/ui/theme";

type BoxProps = ViewProps & { children?: React.ReactNode };
type TxtProps = TextProps & { children?: React.ReactNode };

export const Card = React.forwardRef<View, BoxProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.card, style]} {...props} />
));
Card.displayName = "Card";

export const CardHeader = React.forwardRef<View, BoxProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.header, style]} {...props} />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<Text, TxtProps>(({ style, ...props }, ref) => (
  <Text ref={ref} style={[styles.title, style]} {...props} />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<Text, TxtProps>(({ style, ...props }, ref) => (
  <Text ref={ref} style={[styles.description, style]} {...props} />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<View, BoxProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.content, style]} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<View, BoxProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.footer, style]} {...props} />
));
CardFooter.displayName = "CardFooter";

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.color.card,
    borderColor: theme.color.border,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    padding: theme.space.md,
    ...theme.shadow.card,
  },
  header: {
    paddingBottom: theme.space.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.color.text,
    letterSpacing: 0.2,
  },
  description: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: theme.color.muted,
  },
  content: {
    paddingTop: theme.space.sm,
  },
  footer: {
    paddingTop: theme.space.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: theme.space.sm,
  },
});