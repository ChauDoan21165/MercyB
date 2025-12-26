// src/components/mercy/MercyHostCorner.tsx — MB-BLUE-93.7 — 2025-12-24 (+0700)
/**
 * MercyHostCorner (MINIMAL MOUNT)
 * Goal: prove Mercy Host engine renders inside a room.
 * Non-goals (later): full styling, animations polish, keyword UI, etc.
 */

import React from "react";
import { useMercyHost } from "@/hooks/useMercyHost";

type Props = {
  roomId: string;
  roomTitle: string;
  roomTier?: "free" | "vip1" | "vip2" | "vip3";
  language?: "en" | "vi";
};

export default function MercyHostCorner({
  roomId,
  roomTitle,
  roomTier = "free",
  language = "en",
}: Props) {
  const host = useMercyHost({
    roomId,
    roomTitle,
    roomTier,
    language,
    enableVoice: false, // keep silent for now (structured sound steps later)
    enableAnimations: true,
  });

  // If no greeting text yet, still show the avatar (proof of mount)
  const text =
    language === "vi" ? host.greetingText?.vi : host.greetingText?.en;

  return (
    <div
      className="fixed bottom-24 right-4 z-50 flex items-end gap-2"
      style={{ pointerEvents: "auto" }}
    >
      {/* Greeting bubble (minimal) */}
      {host.isGreetingVisible && text ? (
        <div className="max-w-[240px] rounded-xl border bg-background px-3 py-2 text-sm shadow">
          <div className="mb-1 font-semibold">Mercy</div>
          <div>{text}</div>
          <div className="mt-2 flex gap-2">
            <button
              className="rounded-md border px-2 py-1 text-xs"
              onClick={host.dismiss}
            >
              Close
            </button>
            <button
              className="rounded-md border px-2 py-1 text-xs"
              onClick={() => host.greet()}
            >
              Greet
            </button>
          </div>
        </div>
      ) : null}

      {/* Avatar + animation */}
      <button
        className="relative"
        onClick={() => (host.isGreetingVisible ? host.dismiss() : host.reopen())}
        aria-label="Mercy Host"
      >
        {host.animation}
        {host.avatar}
      </button>
    </div>
  );
}
