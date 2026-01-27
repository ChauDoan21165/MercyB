// FILE: src/components/room/roomRendererStyles.ts
// MB-BLUE-99.11m → MB-BLUE-99.11m-split-styles-paddingfix — 2026-01-21 (+0700)
//
// FIX (border-hugging text):
// - Some sections render plain headings/text not wrapped by .mb-chatHeader etc.
// - Default heading margins + card overlay can visually touch the rounded border.
// - Add safe inner padding + margin reset (in roomCardsCss.ts).
//
// SPLIT (ROI):
// - Keep ROOM_CSS export (API stable)
// - Break the big template into small modules under src/components/room/styles/*
//
// ✅ FIX (2026-01-23):
// - Import ORDER: ensure base shell/card padding rules load BEFORE more specific modules,
//   and keyword pills load LAST (so contrast rules win).
// - Keep API stable: export const ROOM_CSS only.

import { ROOM_SHELL_CSS } from "@/components/room/styles/roomShellCss";
import { ROOM_CARDS_CSS } from "@/components/room/styles/roomCardsCss";
import { ROOM_BOX2_CSS } from "@/components/room/styles/roomBox2Css";
import { ROOM_BOX3_KEYWORDS_CSS } from "@/components/room/styles/roomBox3KeywordsCss";
import { ROOM_HIGHLIGHTS_CSS } from "@/components/room/styles/roomHighlightsCss";
import { ROOM_AUDIO_BOX4_CSS } from "@/components/room/styles/roomAudioBox4Css";
import { ROOM_GUIDE_CSS } from "@/components/room/styles/roomGuideCss";
import { ROOM_CHAT_FEEDBACK_CSS } from "@/components/room/styles/roomChatFeedbackCss";
import { ROOM_KEYWORD_PILLS_CSS } from "@/components/room/styles/roomKeywordPillsCss";

// NOTE: order matters — keep "shell + cards" first, "pills" last.
export const ROOM_CSS = `
${ROOM_SHELL_CSS}
${ROOM_CARDS_CSS}

${ROOM_BOX2_CSS}
${ROOM_BOX3_KEYWORDS_CSS}
${ROOM_HIGHLIGHTS_CSS}

${ROOM_AUDIO_BOX4_CSS}
${ROOM_GUIDE_CSS}
${ROOM_CHAT_FEEDBACK_CSS}

${ROOM_KEYWORD_PILLS_CSS}
`;
