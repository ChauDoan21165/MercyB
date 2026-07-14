// src/lib/certificates/rpc.ts
//
// Real Supabase RPC layer for Progress Certificates. Replaces the
// localStorage mock that previously stood in here. Verification is still
// owned by A2 (mockVerifyCertificate.ts → verify_certificate RPC); this
// module exports issue + list only.
//
// Backend contract (prod, verified read-only on 2026-04-29):
//   issue_certificate(p_cert_type text, p_milestone_value int,
//                     p_metadata jsonb)
//     → returns row { id, user_id, cert_type, milestone_value,
//                     certificate_code, metadata, issued_at }.
//     Derives user_id from auth.uid() inside the database function.
//     Idempotent on (user_id, cert_type, milestone_value): returns the
//     pre-existing row instead of creating a duplicate.
//
//   get_user_certificates()
//     → returns rows joined with the type catalog: { id, certificate_code,
//       cert_type, milestone_value, issued_at, display_name_en,
//       display_name_vi }. Self-scoped inside the function via auth.uid().
//
// Failure mode: RPC errors return `{ ok: false, error: msg }` without
// throwing and without falling back to a local mock. Call sites
// (MilestoneObserver, CertificatesGalleryPage) already treat ok=false /
// empty list as a no-op, so the UI degrades silently.

import { supabase } from "@/lib/supabaseClient";
import type { CertificateType, EarnedCertificate } from "./types";

interface IssueRpcRow {
  id: string;
  user_id: string;
  cert_type: string;
  milestone_value: number;
  certificate_code: string;
  metadata: Record<string, unknown> | null;
  issued_at: string;
}

interface ListRpcRow {
  id: string;
  certificate_code: string;
  cert_type: string;
  milestone_value: number;
  issued_at: string;
  display_name_en?: string;
  display_name_vi?: string;
}

/** Pull the trailing integer out of a CertificateType ("xp_100" → 100). */
function milestoneValueOf(certType: CertificateType): number {
  const m = /_(\d+)$/.exec(certType);
  return m ? Number(m[1]) : 0;
}

function issueRowToEarned(row: IssueRpcRow): EarnedCertificate {
  return {
    id: row.id,
    user_id: row.user_id,
    certificate_type: row.cert_type as CertificateType,
    earned_at: row.issued_at,
    certificate_code: row.certificate_code,
    metadata: row.metadata ?? {},
  };
}

function listRowToEarned(row: ListRpcRow, userId: string): EarnedCertificate {
  return {
    id: row.id,
    user_id: userId,
    certificate_type: row.cert_type as CertificateType,
    earned_at: row.issued_at,
    certificate_code: row.certificate_code,
    // get_user_certificates doesn't return metadata; UI labels come from
    // the local catalog. Keep the field present so the type stays stable.
    metadata: {},
  };
}

export interface IssueCertificateInput {
  certificate_type: CertificateType;
  metadata?: Record<string, unknown> & { backfilled?: boolean };
}

export interface IssueCertificateResult {
  ok: boolean;
  certificate: EarnedCertificate | null;
  error?: string;
}

export async function issueCertificate(
  input: IssueCertificateInput,
): Promise<IssueCertificateResult> {
  if (!input.certificate_type) {
    return { ok: false, certificate: null, error: "invalid_input" };
  }

  const { data, error } = await supabase.rpc("issue_certificate", {
    p_cert_type: input.certificate_type,
    p_milestone_value: milestoneValueOf(input.certificate_type),
    p_metadata: input.metadata ?? {},
  });

  if (error) {
    console.warn("[certificates/rpc] issue_certificate failed", error);
    return { ok: false, certificate: null, error: error.message };
  }

  const row = (Array.isArray(data) ? data[0] : data) as IssueRpcRow | null;
  if (!row || !row.id || !row.certificate_code) {
    return { ok: false, certificate: null, error: "empty_response" };
  }

  // Idempotency is enforced by the DB UNIQUE constraint on
  // (user_id, cert_type, milestone_value); the RPC always returns a
  // valid row. Toast suppression for retroactive grants is handled
  // downstream via metadata.backfilled === true (CertificateToast.tsx).
  return { ok: true, certificate: issueRowToEarned(row) };
}

export async function listEarnedCertificates(
  userId: string,
): Promise<EarnedCertificate[]> {
  if (!userId) return [];

  const { data, error } = await supabase.rpc("get_user_certificates");

  if (error) {
    console.warn("[certificates/rpc] get_user_certificates failed", error);
    return [];
  }

  const rows = (Array.isArray(data) ? data : []) as ListRpcRow[];
  return rows
    .map((row) => listRowToEarned(row, userId))
    .sort((a, b) => b.earned_at.localeCompare(a.earned_at));
}

// NOTE: Verification is owned by A2 (mockVerifyCertificate.ts → real
// verify_certificate RPC). This module deliberately does not export a
// verify function so the two surfaces don't drift. A3 only needs to
// *issue* and *list* certificates; shareable verify URLs are built
// from `certificate_code` via `publicCertificateUrl()` in types.ts.
