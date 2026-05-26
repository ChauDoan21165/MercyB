// src/components/certificates/MilestoneObserver.tsx
//
// Single mount point that turns XP-award events into certificate
// awards. Mounts once at the router level so we never have to touch
// the six product flows (lesson / drill / streak / vocab / pronunciation
// / writing) directly.
//
// Strategy:
//   1. If the `certificates_enabled` feature flag is OFF → render
//      nothing; never subscribe; zero overhead.
//   2. Subscribe to the existing `mb:xp:awarded` window event.
//   3. Build a MilestoneSnapshot from total_xp + persisted counters.
//   4. Run checkMilestones against the locally cached "already earned"
//      set; for each newly qualified type, call issueCertificate.
//   5. Re-publish each newly issued cert via `mb:certificate:earned`
//      so the toast can react.
//
// This component renders nothing.

import { useEffect, useRef } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";

import {
  XP_AWARDED_EVENT,
  type XPAwardedDetail,
} from "@/lib/xp/awardXPEventBus";

import { checkMilestones } from "@/lib/certificates/checkMilestones";
import {
  buildSnapshot,
  readCounters,
} from "@/lib/certificates/snapshot";
import { issueCertificate, listEarnedCertificates } from "@/lib/certificates/rpc";
import { publishCertificateEarned } from "@/lib/certificates/eventBus";
import type { CertificateType } from "@/lib/certificates/types";

const CERTIFICATES_FLAG_KEY = "certificates_enabled";

export function MilestoneObserver(): null {
  const { user } = useAuth();
  const { enabled } = useFeatureFlag(CERTIFICATES_FLAG_KEY, false);

  const earnedRef = useRef<Set<CertificateType>>(new Set());
  const seededForUserRef = useRef<string | null>(null);

  // Seed the "already earned" cache once per signed-in user so the
  // checker doesn't re-issue rows we've already persisted.
  useEffect(() => {
    if (!enabled) return;
    const userId = user?.id;
    if (!userId) return;
    if (seededForUserRef.current === userId) return;

    let alive = true;
    seededForUserRef.current = userId;

    void listEarnedCertificates(userId)
      .then((rows) => {
        if (!alive) return;
        earnedRef.current = new Set(rows.map((r) => r.certificate_type));
      })
      .catch((err) => {
        // Mock failure: leave cache empty. The RPC also dedupes on
        // (user_id, certificate_type), so a stale cache only costs a
        // duplicate call, not a duplicate cert. Never block render.
        console.warn("[MilestoneObserver] seed failed", err);
      });

    return () => {
      alive = false;
    };
  }, [enabled, user?.id]);

  useEffect(() => {
    if (!enabled) return;
    const userId = user?.id;
    if (!userId) return;

    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent<XPAwardedDetail>).detail;
      if (!detail) return;

      // total_xp is authoritative — comes straight from the server's
      // award_xp_event RPC. Per-flow counters are best-effort mirrors
      // until A1 lands real aggregate views.
      const counters = readCounters(userId);
      const snapshot = buildSnapshot(detail.total_xp, counters);
      const newly = checkMilestones(snapshot, earnedRef.current);
      if (newly.length === 0) return;

      void Promise.all(
        newly.map((type) =>
          issueCertificate({
            user_id: userId,
            certificate_type: type,
            metadata: {
              source: "milestone_observer",
              total_xp: detail.total_xp,
            },
          }),
        ),
      ).then((results) => {
        for (const r of results) {
          if (!r.ok || !r.certificate) continue;
          earnedRef.current.add(r.certificate.certificate_type);
          // Toast suppression for retroactive grants is handled inside
          // CertificateToast via metadata.backfilled. The DB enforces
          // (user_id, cert_type, milestone_value) idempotency, so every
          // successful response is safe to publish.
          publishCertificateEarned({ certificate: r.certificate });
        }
      });
    };

    window.addEventListener(XP_AWARDED_EVENT, handler as EventListener);
    return () => {
      window.removeEventListener(XP_AWARDED_EVENT, handler as EventListener);
    };
  }, [enabled, user?.id]);

  return null;
}

export default MilestoneObserver;
