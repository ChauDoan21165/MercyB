// src/hooks/useOnlineStatus.ts
//
// Offline Lite v1 — React hook for online/offline state.
// Thin wrapper over `subscribeOnlineStatus` in src/lib/offline/offlineDetector.ts
// so the pure-JS detector remains the single source of truth.
//
// Why a separate hook from useNetworkStatus:
//   - useNetworkStatus also tracks slow-connection hints; many callers
//     don't care and we want them to depend on the smallest possible API.
//   - The pure-JS detector handles SSR / non-browser cases (returns true).
//
// Contract: { isOnline: boolean }. No ping. Callers that need ground
// truth (captive-portal Wi-Fi) should call `pingOnline()` from the
// detector module directly.

import { useEffect, useState } from "react";
import { isOnline as readIsOnline, subscribeOnlineStatus } from "@/lib/offline/offlineDetector";

export interface UseOnlineStatusResult {
  isOnline: boolean;
}

export function useOnlineStatus(): UseOnlineStatusResult {
  const [online, setOnline] = useState<boolean>(() => readIsOnline());

  useEffect(() => {
    return subscribeOnlineStatus((next) => {
      setOnline(next);
    });
  }, []);

  return { isOnline: online };
}
