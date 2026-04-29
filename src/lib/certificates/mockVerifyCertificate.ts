// src/lib/certificates/mockVerifyCertificate.ts
//
// Mock verification client for the /cert/:code page. Mirrors the shape
// the real Supabase RPC will return once A1's backend lands. When that
// ships, swap the body of `verifyCertificate` to call the RPC and keep
// the return shape identical so consumers do not need to change.

export type CertificateRecord = {
  recipientName: string;
  certType: string;
  displayNameEn: string;
  displayNameVi: string;
  issuedAt: string; // ISO 8601
  certificateCode: string;
};

export type CertificateVerifyResult =
  | { status: "verified"; certificate: CertificateRecord }
  | { status: "not_found" }
  | { status: "error"; message: string };

const MOCK_CERTIFICATES: Record<string, CertificateRecord> = {
  "MB-IELTS-2026-A1B2C3": {
    recipientName: "Nguyễn Minh Anh",
    certType: "ielts_listening_band_7",
    displayNameEn: "IELTS Listening · Band 7",
    displayNameVi: "Luyện nghe IELTS · Band 7",
    issuedAt: "2026-04-12T03:00:00.000Z",
    certificateCode: "MB-IELTS-2026-A1B2C3",
  },
  "MB-PRON-2026-XYZ789": {
    recipientName: "Trần Quốc Bảo",
    certType: "pronunciation_30_day_streak",
    displayNameEn: "30-Day Pronunciation Streak",
    displayNameVi: "Chuỗi 30 ngày luyện phát âm",
    issuedAt: "2026-03-28T10:30:00.000Z",
    certificateCode: "MB-PRON-2026-XYZ789",
  },
  "MB-VSTEP-2026-DEMO01": {
    recipientName: "Demo User",
    certType: "vstep_b2_speaking",
    displayNameEn: "VSTEP B2 · Speaking",
    displayNameVi: "VSTEP B2 · Phần Nói",
    issuedAt: "2026-04-20T07:15:00.000Z",
    certificateCode: "MB-VSTEP-2026-DEMO01",
  },
};

const MOCK_LATENCY_MS = 600;

export async function verifyCertificate(
  code: string,
): Promise<CertificateVerifyResult> {
  const trimmed = String(code || "").trim().toUpperCase();

  await new Promise((resolve) => window.setTimeout(resolve, MOCK_LATENCY_MS));

  if (!trimmed) {
    return { status: "error", message: "Missing certificate code." };
  }

  const hit = MOCK_CERTIFICATES[trimmed];
  if (hit) return { status: "verified", certificate: hit };

  return { status: "not_found" };
}

export const __MOCK_CERTIFICATE_CODES__ = Object.keys(MOCK_CERTIFICATES);
