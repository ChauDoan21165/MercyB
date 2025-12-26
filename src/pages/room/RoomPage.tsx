// src/pages/room/RoomPage.tsx — MB-BLUE-94.4 — 2025-12-24 (+0700)
/**
 * MercyBlade Blue — DEAD PAGE (Compatibility Shim)
 *
 * STATUS:
 * - OBSOLETE. This file exists ONLY because older code may still import it.
 *
 * RULES (LOCKED):
 * - /room/:roomId MUST render ChatHub via src/router/AppRouter.tsx
 * - Room JSON loading MUST go through src/lib/roomJsonResolver.ts
 *
 * Behavior:
 * - If someone accidentally routes to RoomPage, it simply delegates to ChatHub
 *   (so we still keep ONE canonical room loader).
 */

import ChatHub from "@/pages/ChatHub";

export default function RoomPage() {
  return <ChatHub />;
}
