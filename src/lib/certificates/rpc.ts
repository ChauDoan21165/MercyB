// src/lib/certificates/rpc.ts
//
// MOCK RPC layer for Progress Certificates. A1 will replace these with
// real Supabase calls (`issue_certificate`, `list_user_certificates`,
// `verify_certificate`). The function signatures here match what the
// real RPCs are expected to accept/return so the call sites stay stable
// across the swap.
//
// Storage: per-user list under localStorage key
//   `mb:certificates:v1:<userId>`
// Lost on logout / clearStorage. That's intentional for the mock phase.

import type { CertificateType, EarnedCertificate } from "./types";

const STORAGE_PREFIX = "mb:certificates:v1:";

function storageKey(userId: string): string {
  return `${STORAGE_PREFIX}${userId}`;
}

function safeParse(raw: string | null): EarnedCertificate[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as EarnedCertificate[]) : [];
  } catch {
    return [];
  }
}

function readAll(userId: string): EarnedCertificate[] {
  if (typeof window === "undefined" || !window.localStorage) return [];
  return safeParse(window.localStorage.getItem(storageKey(userId)));
}

function writeAll(userId: string, list: EarnedCertificate[]): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(storageKey(userId), JSON.stringify(list));
  } catch {
    // Storage quota / private mode — best effort.
  }
}

function randomCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  const bytes = new Uint8Array(10);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  for (let i = 0; i < bytes.length; i++) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  return out;
}

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `mock-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export interface IssueCertificateInput {
  user_id: string;
  certificate_type: CertificateType;
  metadata?: Record<string, unknown> & { backfilled?: boolean };
}

export interface IssueCertificateResult {
  ok: boolean;
  /** True when the user already had this type and we returned the
   *  existing row instead of creating a new one. */
  duplicate: boolean;
  certificate: EarnedCertificate | null;
  error?: string;
}

/** Mock issue. Idempotent on (user_id, certificate_type). */
export async function issueCertificate(
  input: IssueCertificateInput,
): Promise<IssueCertificateResult> {
  if (!input.user_id || !input.certificate_type) {
    return { ok: false, duplicate: false, certificate: null, error: "invalid_input" };
  }

  const list = readAll(input.user_id);
  const existing = list.find(
    (c) => c.certificate_type === input.certificate_type,
  );
  if (existing) {
    return { ok: true, duplicate: true, certificate: existing };
  }

  const cert: EarnedCertificate = {
    id: randomId(),
    user_id: input.user_id,
    certificate_type: input.certificate_type,
    earned_at: new Date().toISOString(),
    certificate_code: randomCode(),
    metadata: { ...(input.metadata ?? {}) },
  };
  list.push(cert);
  writeAll(input.user_id, list);
  return { ok: true, duplicate: false, certificate: cert };
}

/** Mock list. Returns earned certs ordered newest-first. */
export async function listEarnedCertificates(
  userId: string,
): Promise<EarnedCertificate[]> {
  if (!userId) return [];
  const list = readAll(userId);
  return [...list].sort((a, b) => b.earned_at.localeCompare(a.earned_at));
}

// NOTE: Verification is owned by A2 (mockVerifyCertificate.ts → real
// verify_certificate RPC). This module deliberately does not export a
// verify function so the two surfaces don't drift. A3 only needs to
// *issue* and *list* certificates; shareable verify URLs are built
// from `certificate_code` via `publicCertificateUrl()` in types.ts.
