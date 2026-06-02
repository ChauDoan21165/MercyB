// src/components/NotificationBootstrap.tsx
//
// App-root wiring for the notification engine. Mounted inside <AuthProvider>
// so the auth context is available. Boots the engine once (registers
// foreground/background listeners, checks permission WITHOUT prompting, and
// refreshes the schedule when permission is already granted) and tears the
// listeners down on unmount. Guarded by FEATURE_NOTIFICATIONS — and the engine
// itself no-ops when the flag is off — so this is inert by default and on web.

import { useEffect } from "react";

import { FEATURE_FLAGS } from "@/lib/featureFlags";
import {
  bootNotificationEngine,
  shutdownNotificationEngine,
} from "@/notificationEngine";

export default function NotificationBootstrap(): null {
  useEffect(() => {
    if (!FEATURE_FLAGS.FEATURE_NOTIFICATIONS) return;
    void bootNotificationEngine();
    return () => {
      void shutdownNotificationEngine();
    };
  }, []);
  return null;
}
