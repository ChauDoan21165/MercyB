// FILE: types.ts
// PATH: src/components/guide/host/types.ts
// VERSION: MB-BLUE-101.7h — 2026-01-20 (+0700)
//
// GOAL:
// - Single source of truth for MercyAIHost domain types
// - NO React, NO Supabase, NO browser APIs
// - Safe to import from hooks, components, and tests
//
// RULE:
// - If a type is used by MercyAIHost OR its hooks, it belongs here.


// =========================
// UI / PANEL
// =========================

export type PanelMode = "home" | "email" | "billing" | "about";

export type QuickAction = {
  id: string;
  label: string;
  description?: string;
  onClick: () => void;
};


// =========================
// HOST CONTEXT (Room → Host)
// =========================

export type HostContext = {
  roomId?: string;
  roomTitle?: string;
  entryId?: string;
  keyword?: string;

  focus_en?: string;
  focus_vi?: string;

  welcome_en?: string;
  welcome_vi?: string;

  vip_required_rank?: number;
};


// =========================
// CHAT
// =========================

export type ChatRole = "assistant" | "user";

export type ChatMsg = {
  id: string;
  role: ChatRole;
  text: string;
};

export type HostLang = "en" | "vi";


// =========================
// HOST NOTES / LOGGING
// =========================

export type HostNoteType =
  | "question"
  | "progress"
  | "fault"
  | "feedback";

export type HostCategory =
  | "ui"
  | "content"
  | "audio"
  | "billing"
  | "auth"
  | "performance"
  | "other";

export type HostRowType =
  | "user_report"
  | "host_auto"
  | "admin_note";


// =========================
// QUICK TEST
// =========================

export type QuickTestStep = 0 | 1 | 2 | 3;


// =========================
// REPEAT LOOP (shared shape)
// NOTE:
// - Logic lives in useRepeatLoop.ts
// - Types live here so Host + hooks agree
// =========================

export type RepeatStep = "idle" | "play" | "your_turn";

export type RepeatTarget = {
  roomId?: string;
  entryId?: string | null;
  keyword?: string | null;

  text_en?: string;
  text_vi?: string;

  audio_url?: string;
  pace?: "slow" | "normal" | "fast";
};

export type HeartKind = "basic" | "pronunciation";

export type HeartBurst = {
  kind: HeartKind;
  id: string;
  at: number;
};


// =========================
// DEV / DEBUG (optional)
// =========================

export type HostDebugState = {
  open: boolean;
  mode: PanelMode;
  page: string;
  roomId?: string;

  lang: HostLang;
  isTyping: boolean;
  messagesCount: number;

  authUserId: string | null;
  authEmail: string;

  repeatStep: RepeatStep;
  repeatCount: number;
};
