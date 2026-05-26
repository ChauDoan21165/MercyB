// src/pages/mercy/MercyUnifiedPage.tsx
//
// Full-page host for UnifiedMercyChat. Picked over an in-place drawer
// because the unified flow benefits from a dedicated viewport on
// mobile (375 px) — the chat needs the full height for the message
// stream + the inline panels.
//
// If the user has opted into 'classic' mode, we still render the
// unified chat here (the page is the explicit choice). The classic
// fallback remains reachable via the floating MercyGuide bubble on
// other pages.

import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import UnifiedMercyChat from "@/components/mercy-guide/UnifiedMercyChat";

export default function MercyUnifiedPage() {
  const navigate = useNavigate();
  const onRequestClassic = useCallback(() => {
    // Classic mode lives on Home (the floating MercyGuide bubble).
    navigate("/");
  }, [navigate]);

  return (
    <div className="mx-auto flex h-[100dvh] max-w-2xl flex-col">
      <UnifiedMercyChat onRequestClassic={onRequestClassic} />
    </div>
  );
}
