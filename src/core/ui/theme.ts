// FILE: theme.ts
// PATH: src/core/ui/theme.ts

export const theme = {
  color: {
    bg: "#0B0F14",
    panel: "#111826",
    panel2: "#0F1623",
    text: "#EAF0FF",
    textDim: "rgba(234, 240, 255, 0.72)",
    border: "rgba(234, 240, 255, 0.12)",

    primary: "#7C5CFF",
    primary2: "#4CC9F0",
    danger: "#FF4D6D",
    success: "#2FE38C",
    warning: "#FFC857",
  },

  space: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
  },

  radius: {
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
  },

  type: {
    h1: { fontSize: 32, fontWeight: "900" as const },
    h2: { fontSize: 24, fontWeight: "800" as const },
    h3: { fontSize: 18, fontWeight: "800" as const },
    body: { fontSize: 15, fontWeight: "500" as const },
    small: { fontSize: 13, fontWeight: "500" as const },
  },

  shadow: {
    soft: {
      shadowColor: "#000",
      shadowOpacity: 0.35,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 6,
    },
  },
};