// src/lib/certificates/eventBus.ts
//
// Tiny window-CustomEvent bus for newly-earned certificates. Mirrors
// the pattern used by awardXPEventBus.ts so subscribers (the toast,
// future analytics) can listen without React-context plumbing.

import type { EarnedCertificate } from "./types";

export const CERTIFICATE_EARNED_EVENT = "mb:certificate:earned";

export interface CertificateEarnedDetail {
  certificate: EarnedCertificate;
}

export function publishCertificateEarned(detail: CertificateEarnedDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<CertificateEarnedDetail>(CERTIFICATE_EARNED_EVENT, {
      detail,
    }),
  );
}
