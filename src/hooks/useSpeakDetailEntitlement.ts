import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { getMeEntitlement } from "@/lib/getMeEntitlement";
import { entitlementIsPremium, type BackendEntitlement } from "@/lib/authService";

/**
 * Provider-free premium/trial signal for the Speak detailed-scoring gate.
 *
 * Deliberately does NOT use react-query / `useEntitlements` so it can be called
 * inside `AiTutorPage` (which is rendered without a `QueryClientProvider`, incl.
 * in its test harness) without dragging in a provider dependency.
 *
 * Fail-closed: returns `false` when the gate is disabled, when there is no
 * session, while the one-shot fetch is in flight, or on any error. Trial-
 * inclusive — `entitlementIsPremium` treats an active trial
 * (`status: "trialing"`) as entitled.
 *
 * `enabled` is the gate flag: when false the hook performs NO network call and
 * stays `false`, so the default-OFF path adds zero side effects.
 */
export function useSpeakDetailEntitlement(
  session: Session | null,
  enabled = true,
): boolean {
  const [isPremiumOrTrial, setIsPremiumOrTrial] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!enabled || !session?.access_token) {
      setIsPremiumOrTrial(false);
      return;
    }
    getMeEntitlement()
      .then((data) => {
        if (cancelled) return;
        setIsPremiumOrTrial(
          entitlementIsPremium(data as BackendEntitlement | null),
        );
      })
      .catch(() => {
        if (!cancelled) setIsPremiumOrTrial(false);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, session?.access_token]);

  return isPremiumOrTrial;
}
