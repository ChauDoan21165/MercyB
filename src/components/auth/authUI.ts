import React from "react";

export const UI = {
  page: {
    display: "grid",
    gridTemplateColumns: "1fr 420px",
    minHeight: "100vh",
    background: "#f8f9fa",
  } as React.CSSProperties,

  left: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    background: "white",
  } as React.CSSProperties,

  card: {
    maxWidth: 460,
    width: "100%",
  } as React.CSSProperties,

  title: {
    fontSize: 32,
    fontWeight: 900,
    margin: 0,
    lineHeight: 1.1,
  } as React.CSSProperties,

  subtitle: {
    margin: "12px 0 32px",
    color: "#666",
    fontSize: 15,
  } as React.CSSProperties,

  block: {
    marginTop: 24,
  } as React.CSSProperties,

  label: {
    display: "block",
    marginBottom: 6,
    fontSize: 13,
    fontWeight: 600,
    color: "#444",
  } as React.CSSProperties,

  input: (disabled: boolean): React.CSSProperties => ({
    width: "100%",
    minHeight: 46,
    padding: "11px 14px",
    fontSize: 16,
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.14)",
    background: disabled ? "#f9f9f9" : "white",
    opacity: disabled ? 0.7 : 1,
    boxSizing: "border-box",
    outline: "none",
  }),

  primaryBtn: (disabled: boolean = false): React.CSSProperties => ({
    width: "100%",
    minHeight: 48,
    padding: "12px 24px",
    fontSize: 16,
    fontWeight: 700,
    borderRadius: 14,
    border: "none",
    background: disabled ? "#a1a1aa" : "#000",
    color: "white",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.7 : 1,
    transition: "all 0.1s ease",
  }),

  ghostBtn: (disabled: boolean = false): React.CSSProperties => ({
    minHeight: 48,
    padding: "12px 20px",
    fontSize: 15,
    fontWeight: 600,
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.15)",
    background: "transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
  }),

  segBtn: (active: boolean, disabled: boolean = false): React.CSSProperties => ({
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 600,
    borderRadius: 9999,
    border: "none",
    background: active ? "#000" : "transparent",
    color: active ? "white" : "#555",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    flex: 1,
  }),

  status: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    fontSize: 14,
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
  } as React.CSSProperties,

  small: {
    fontSize: 13,
    color: "#666",
    lineHeight: 1.4,
  } as React.CSSProperties,

  divider: {
    margin: "28px 0",
    display: "flex",
    alignItems: "center",
    gap: 12,
    color: "#888",
    fontSize: 13,
  } as React.CSSProperties,

  hr: {
    flex: 1,
    height: 1,
    background: "rgba(0,0,0,0.08)",
  } as React.CSSProperties,

  segRow: {
    display: "flex",
    gap: 8,
    marginBottom: 8,
  } as React.CSSProperties,

  ecosystemBlock: {
    marginTop: 28,
    padding: 16,
    background: "rgba(0,0,0,0.02)",
    borderRadius: 16,
    fontSize: 13,
  } as React.CSSProperties,

  ecosystemTitle: {
    fontWeight: 700,
    margin: "0 0 4px 0",
  } as React.CSSProperties,

  ecosystemText: {
    margin: "4px 0",
    color: "#555",
    lineHeight: 1.45,
  } as React.CSSProperties,

  right: {
    background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
    color: "white",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 40px",
  } as React.CSSProperties,

  rightInner: {
    maxWidth: 380,
  } as React.CSSProperties,

  quoteMark: {
    fontSize: 120,
    lineHeight: 1,
    opacity: 0.15,
    fontWeight: 900,
    marginBottom: -30,
  } as React.CSSProperties,

  rightHeadline: {
    fontSize: 26,
    fontWeight: 800,
    lineHeight: 1.15,
    marginBottom: 18,
  } as React.CSSProperties,

  rightText: {
    fontSize: 15,
    lineHeight: 1.65,
    opacity: 0.92,
  } as React.CSSProperties,

  rightBadge: {
    marginTop: 32,
    fontSize: 13,
    opacity: 0.7,
    fontWeight: 600,
  } as React.CSSProperties,

  linkBtn: (disabled: boolean = false): React.CSSProperties => ({
    background: "none",
    border: "none",
    padding: 0,
    color: "#0066ff",
    fontSize: 13,
    textDecoration: "underline",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
  }),
} as const;

export type AuthUI = typeof UI;