// src/lib/mercyApp.ts
export type MercyApp = "blade" | "builder" | "signal";

export const MERCY_APP: MercyApp =
  (import.meta.env.VITE_MERCY_APP as MercyApp) ?? "blade";
