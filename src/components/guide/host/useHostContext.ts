// FILE: useHostContext.ts
// PATH: src/components/guide/host/useHostContext.ts

import { useEffect, useState } from "react";
import type { HostContext } from "./types";

export function useHostContextSync(args: { isAdmin: boolean; isRoom: boolean; roomIdFromUrl?: string }) {
  const { isAdmin, isRoom, roomIdFromUrl } = args;
  const [ctx, setCtx] = useState<HostContext>({});

  // Keep ctx via window event
  useEffect(() => {
    if (isAdmin) return;

    const onCtx = (e: Event) => {
      const ce = e as CustomEvent<HostContext>;
      if (!ce.detail) return;
      setCtx((prev) => ({ ...prev, ...ce.detail }));
    };

    window.addEventListener("mb:host-context", onCtx as EventListener);
    return () => {
      window.removeEventListener("mb:host-context", onCtx as EventListener);
    };
  }, [isAdmin]);

  // Keep ctx.roomId aligned with route
  useEffect(() => {
    if (isAdmin) return;
    if (!isRoom) return;
    if (!roomIdFromUrl) return;
    setCtx((prev) => ({ ...prev, roomId: roomIdFromUrl }));
  }, [isAdmin, isRoom, roomIdFromUrl]);

  return [ctx, setCtx] as const;
}
