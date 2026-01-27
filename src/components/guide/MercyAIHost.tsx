// FILE: MercyAIHost.tsx
// PATH: src/components/guide/MercyAIHost.tsx
// VERSION: MB-BLUE-101.7e — 2026-01-14 (+0700)
//
// SPLIT (SAFE WRAPPER):
// - This file is now a thin entrypoint wrapper.
// - Implementation lives in: src/components/guide/host/MercyAIHostImpl.tsx
// - Goal: keep Mercy Host improvable without a 1600-line God file.

import React from "react";
import MercyAIHostImpl from "@/components/guide/host/MercyAIHostImpl";

export default function MercyAIHost() {
  return <MercyAIHostImpl />;
}
