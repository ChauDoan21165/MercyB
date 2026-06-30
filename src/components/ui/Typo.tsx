import type { ComponentType, ReactNode } from "react";
// FILE: Typo.tsx
// PATH: src/components/ui/Typo.tsx

import React from "react";
import { Text as RNText } from "react-native";
type NativePrimitiveProps = { children?: ReactNode; [key: string]: unknown };
type NativePrimitive = ComponentType<NativePrimitiveProps>;
const Text = RNText as unknown as NativePrimitive;

import { theme } from "../../core/ui/theme";

export function H1(props: { children: React.ReactNode; style?: any }) {
  return (
    <Text style={[theme.type.h1, { color: theme.color.text }, props.style]}>
      {props.children}
    </Text>
  );
}

export function H2(props: { children: React.ReactNode; style?: any }) {
  return (
    <Text style={[theme.type.h2, { color: theme.color.text }, props.style]}>
      {props.children}
    </Text>
  );
}

export function H3(props: { children: React.ReactNode; style?: any }) {
  return (
    <Text style={[theme.type.h3, { color: theme.color.text }, props.style]}>
      {props.children}
    </Text>
  );
}

export function Body(props: { children: React.ReactNode; dim?: boolean; style?: any }) {
  return (
    <Text
      style={[
        theme.type.body,
        { color: props.dim ? theme.color.textDim : theme.color.text, lineHeight: 20 },
        props.style,
      ]}
    >
      {props.children}
    </Text>
  );
}

export function Small(props: { children: React.ReactNode; dim?: boolean; style?: any }) {
  return (
    <Text
      style={[
        theme.type.small,
        { color: props.dim ? theme.color.textDim : theme.color.text, lineHeight: 18 },
        props.style,
      ]}
    >
      {props.children}
    </Text>
  );
}