// src/components/certificates/Certificate.tsx
//
// Visual certificate + export controls. The on-screen render is HTML +
// CSS so it scales nicely in the viewport and prints cleanly with
// `window.print()`. PNG export rebuilds the same layout on a Canvas
// inside `lib/certificates/certificateExport.ts` — no new deps.
//
// Bilingual handling:
//   language === "en"        → English copy only
//   language === "vi"        → Vietnamese copy only
//   language === "bilingual" → both, EN as primary, VI as subtitle
//
// Per project memory: the signing character is "Teacher Mercy" (NOT
// "host"). Per CLAUDE.md non-negotiables: bilingual copy must look
// intentional, not auto-translated.

import React, { useMemo } from "react";
import { Download, Printer, Share2 } from "lucide-react";
import {
  CERTIFICATE_PRINT_ROOT_ID,
  downloadCertificatePng,
  printCertificate,
  type CertificateCanvasInput,
} from "@/lib/certificates/certificateExport";

export type CertificateLanguage = "en" | "vi" | "bilingual";

export type CertificateProps = {
  recipientName: string;
  certType: string;
  displayNameEn: string;
  displayNameVi: string;
  issuedAt: string; // ISO 8601
  certificateCode: string;
  language: CertificateLanguage;
  /** Optional — when omitted we derive from window.location.origin. */
  verifyOrigin?: string;
  /** Hide the action toolbar (used by the verify page in read-only mode). */
  hideActions?: boolean;
};

const TEACHER_SIGNATURE = "Teacher Mercy · MercyBlade";

const COPY = {
  topLabel: {
    en: "Certificate of Achievement",
    vi: "Chứng nhận Thành tích",
  },
  title: {
    en: "Awarded with pride to",
    vi: "Trân trọng trao tặng",
  },
  subtitle: {
    en: "in recognition of completing",
    vi: "vì đã hoàn thành xuất sắc",
  },
  issued: {
    en: "Issued",
    vi: "Cấp ngày",
  },
  verify: {
    en: "Verify online",
    vi: "Tra cứu trực tuyến",
  },
} as const;

function formatIssuedAt(isoDate: string, language: CertificateLanguage): string {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  // Bilingual + EN: long English date. VI-only: Vietnamese long date.
  const enFormat = d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  if (language === "en") return enFormat;
  const viFormat = d.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  if (language === "vi") return viFormat;
  return `${enFormat} · ${viFormat}`;
}

export default function Certificate({
  recipientName,
  certType,
  displayNameEn,
  displayNameVi,
  issuedAt,
  certificateCode,
  language,
  verifyOrigin,
  hideActions,
}: CertificateProps): React.ReactElement {
  const showEn = language === "en" || language === "bilingual";
  const showVi = language === "vi" || language === "bilingual";

  const verifyUrl = useMemo(() => {
    const origin =
      verifyOrigin ||
      (typeof window !== "undefined" ? window.location.origin : "https://mercyblade.com");
    return `${origin}/cert/${certificateCode}`;
  }, [verifyOrigin, certificateCode]);

  const issuedAtFormatted = useMemo(
    () => formatIssuedAt(issuedAt, language),
    [issuedAt, language],
  );

  const canvasInput: CertificateCanvasInput = useMemo(
    () => ({
      recipientName,
      topLabelEn: showEn ? COPY.topLabel.en : undefined,
      topLabelVi: showVi ? COPY.topLabel.vi : undefined,
      titleEn: showEn ? COPY.title.en : undefined,
      titleVi: showVi ? COPY.title.vi : undefined,
      subtitleEn: showEn ? COPY.subtitle.en : undefined,
      subtitleVi: showVi ? COPY.subtitle.vi : undefined,
      programLineEn: showEn ? displayNameEn : undefined,
      programLineVi: showVi ? displayNameVi : undefined,
      issuedAtFormatted,
      certificateCode,
      verifyUrl,
      signature: TEACHER_SIGNATURE,
    }),
    [
      recipientName,
      showEn,
      showVi,
      displayNameEn,
      displayNameVi,
      issuedAtFormatted,
      certificateCode,
      verifyUrl,
    ],
  );

  function handleDownloadPng(): void {
    const slug = (recipientName || "certificate")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .toLowerCase();
    downloadCertificatePng(canvasInput, `mercyblade-${slug}-${certificateCode}.png`);
  }

  function handlePrint(): void {
    printCertificate();
  }

  async function handleShare(): Promise<void> {
    const shareText =
      language === "vi"
        ? `Tôi vừa nhận chứng nhận ${displayNameVi} từ MercyBlade.`
        : `I earned a ${displayNameEn} certificate on MercyBlade.`;
    const data: ShareData = { title: "MercyBlade certificate", text: shareText, url: verifyUrl };
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share(data);
        return;
      } catch {
        // User dismissed the share sheet — fall through to clipboard.
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(verifyUrl);
    }
  }

  return (
    <div className="space-y-3" data-cert-type={certType}>
      <div
        id={CERTIFICATE_PRINT_ROOT_ID}
        role="img"
        aria-label={
          showEn
            ? `Certificate awarded to ${recipientName} for ${displayNameEn}`
            : `Chứng nhận trao cho ${recipientName} – ${displayNameVi}`
        }
        style={{
          aspectRatio: "1600 / 1131",
          width: "100%",
          maxWidth: 960,
          margin: "0 auto",
          background: "linear-gradient(180deg, #fffdf6 0%, #fef3c7 100%)",
          border: "6px solid #92400e",
          boxShadow: "0 12px 32px rgba(124, 45, 18, 0.18)",
          padding: "4.5% 6%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif",
          color: "#1f2937",
          position: "relative",
          containerType: "inline-size",
          textRendering: "optimizeLegibility",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: "1.8%",
            border: "1.5px solid rgba(146, 64, 14, 0.45)",
            pointerEvents: "none",
          }}
        />

        <header style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "clamp(18px, 3.2cqw, 30px)",
              fontWeight: 700,
              color: "#7c2d12",
              letterSpacing: "-0.01em",
            }}
          >
            MercyBlade
          </div>
          <div
            style={{
              fontSize: "clamp(11px, 1.7cqw, 16px)",
              color: "#9a3412",
              marginTop: "0.4em",
            }}
          >
            Học tiếng Anh dành cho người Việt
          </div>
        </header>

        <div style={{ textAlign: "center", lineHeight: 1.3, width: "100%" }}>
          {showEn && (
            <div
              style={{
                fontSize: "clamp(11px, 1.9cqw, 17px)",
                color: "#475569",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {COPY.topLabel.en}
            </div>
          )}
          {showVi && (
            <div
              style={{
                fontSize: "clamp(11px, 1.7cqw, 15px)",
                color: "#64748b",
                marginTop: "0.3em",
                fontWeight: 400,
                letterSpacing: "0.04em",
              }}
            >
              {COPY.topLabel.vi}
            </div>
          )}

          <div style={{ marginTop: "1.6em" }}>
            {showEn && (
              <div
                style={{
                  fontSize: "clamp(20px, 4.2cqw, 38px)",
                  fontWeight: 800,
                  color: "#1f2937",
                  lineHeight: 1.18,
                  letterSpacing: "-0.012em",
                }}
              >
                {COPY.title.en}
              </div>
            )}
            {showVi && (
              <div
                style={{
                  fontSize: "clamp(15px, 2.7cqw, 23px)",
                  fontWeight: 600,
                  color: "#374151",
                  marginTop: "0.25em",
                  letterSpacing: "-0.005em",
                }}
              >
                {COPY.title.vi}
              </div>
            )}
          </div>

          <div style={{ marginTop: "1.4em" }}>
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(28px, 6.2cqw, 58px)",
                fontWeight: 700,
                color: "#7c2d12",
                lineHeight: 1.18,
                letterSpacing: "-0.005em",
                padding: "0 4%",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
              }}
            >
              {recipientName}
            </div>
            <div
              aria-hidden
              style={{
                width: "min(420px, 56%)",
                height: 1,
                margin: "0.5em auto 0",
                background: "rgba(146, 64, 14, 0.55)",
              }}
            />
          </div>

          <div style={{ marginTop: "1.4em" }}>
            {showEn && (
              <div
                style={{
                  fontSize: "clamp(12px, 1.8cqw, 16px)",
                  color: "#64748b",
                  fontStyle: "italic",
                }}
              >
                {COPY.subtitle.en}
              </div>
            )}
            {showVi && (
              <div
                style={{
                  fontSize: "clamp(11px, 1.6cqw, 14px)",
                  color: "#94a3b8",
                  marginTop: "0.2em",
                  fontStyle: "italic",
                }}
              >
                {COPY.subtitle.vi}
              </div>
            )}

            <div style={{ marginTop: "0.7em" }}>
              {showEn && (
                <div
                  style={{
                    fontSize: "clamp(15px, 2.6cqw, 22px)",
                    fontWeight: 600,
                    color: "#1f2937",
                    letterSpacing: "-0.005em",
                  }}
                >
                  {displayNameEn}
                </div>
              )}
              {showVi && (
                <div
                  style={{
                    fontSize: "clamp(13px, 2.1cqw, 19px)",
                    fontWeight: 500,
                    color: "#475569",
                    marginTop: "0.15em",
                  }}
                >
                  {displayNameVi}
                </div>
              )}
            </div>
          </div>
        </div>

        <footer
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            width: "100%",
            alignItems: "end",
            gap: "1.2em",
            fontSize: "clamp(10px, 1.45cqw, 13px)",
            color: "#475569",
            lineHeight: 1.4,
          }}
        >
          <div style={{ textAlign: "left", overflowWrap: "anywhere" }}>
            <div style={{ fontWeight: 500, opacity: 0.85 }}>
              {COPY.issued.en} · {COPY.issued.vi}
            </div>
            <div style={{ color: "#1f2937", fontWeight: 600, marginTop: "0.25em" }}>
              {issuedAtFormatted}
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              aria-hidden
              style={{
                width: "min(220px, 78%)",
                height: 1,
                margin: "0 auto 0.5em",
                background: "rgba(71, 85, 105, 0.45)",
              }}
            />
            <div style={{ fontWeight: 600, color: "#1f2937" }}>{TEACHER_SIGNATURE}</div>
          </div>

          <div style={{ textAlign: "right", overflowWrap: "anywhere" }}>
            <div style={{ fontWeight: 500, opacity: 0.85 }}>
              {COPY.verify.en} · {COPY.verify.vi}
            </div>
            <div
              style={{
                color: "#1f2937",
                fontWeight: 600,
                marginTop: "0.25em",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: "0.95em",
                overflowWrap: "anywhere",
              }}
            >
              {certificateCode}
            </div>
            <div
              style={{
                color: "#7c2d12",
                marginTop: "0.2em",
                overflowWrap: "anywhere",
                fontSize: "0.85em",
              }}
            >
              {verifyUrl}
            </div>
          </div>
        </footer>
      </div>

      {!hideActions && (
        <div
          className="flex flex-wrap justify-center gap-2"
          role="toolbar"
          aria-label="Certificate actions"
        >
          <button
            type="button"
            onClick={handleDownloadPng}
            className="inline-flex items-center gap-2 rounded-md bg-amber-700 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-800"
          >
            <Download className="h-4 w-4" aria-hidden /> Tải PNG / Download PNG
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-md border border-amber-700 px-3 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-50"
          >
            <Printer className="h-4 w-4" aria-hidden /> In PDF / Print PDF
          </button>
          <button
            type="button"
            onClick={() => void handleShare()}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Share2 className="h-4 w-4" aria-hidden /> Chia sẻ / Share
          </button>
        </div>
      )}
    </div>
  );
}
