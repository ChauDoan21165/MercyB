// src/lib/certificates/certificateExport.ts
//
// Export helpers for the printable certificate. No new dependencies —
// PNG is drawn on a 2D canvas, PDF uses the browser's native print
// pipeline against a single root element.

const CERT_PRINT_ROOT_ID = "mb-cert-print-root";
const CERT_PRINT_STYLE_ID = "mb-cert-print-style";

export type CertificateCanvasInput = {
  recipientName: string;
  topLabelEn?: string;
  topLabelVi?: string;
  titleEn?: string;
  titleVi?: string;
  subtitleEn?: string;
  subtitleVi?: string;
  programLineEn?: string;
  programLineVi?: string;
  issuedAtFormatted: string;
  certificateCode: string;
  verifyUrl: string;
  signature: string;
};

const CANVAS_W = 1600;
const CANVAS_H = 1131; // A4 landscape ratio (≈√2:1)

/**
 * Draw the certificate to a 1600×1131 PNG and trigger a download.
 * The visible component is HTML/CSS so it scales beautifully in the
 * viewport; this function rebuilds the same layout on a Canvas to
 * guarantee a clean exported image regardless of viewport size.
 */
export function downloadCertificatePng(
  input: CertificateCanvasInput,
  filename: string,
): void {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  drawCertificateOnCanvas(ctx, input);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, "image/png");
}

/**
 * Open the browser print dialog with print styles that show only the
 * certificate. The caller wraps the cert visual in an element with id
 * `mb-cert-print-root`; we inject a small <style> tag at print time to
 * hide everything else, then remove it on afterprint.
 */
export function printCertificate(): void {
  const existing = document.getElementById(CERT_PRINT_STYLE_ID);
  if (existing) existing.remove();

  const style = document.createElement("style");
  style.id = CERT_PRINT_STYLE_ID;
  style.textContent = `
    @media print {
      @page { size: A4 landscape; margin: 0; }
      body * { visibility: hidden !important; }
      #${CERT_PRINT_ROOT_ID}, #${CERT_PRINT_ROOT_ID} * { visibility: visible !important; }
      #${CERT_PRINT_ROOT_ID} {
        position: fixed !important;
        inset: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        background: white !important;
      }
    }
  `;
  document.head.appendChild(style);

  const cleanup = () => {
    const node = document.getElementById(CERT_PRINT_STYLE_ID);
    if (node) node.remove();
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);

  window.print();
}

export const CERTIFICATE_PRINT_ROOT_ID = CERT_PRINT_ROOT_ID;

// ─────────────────────────────────────────────────────────────────────────────
// Canvas drawing — internal
// ─────────────────────────────────────────────────────────────────────────────

function drawCertificateOnCanvas(
  ctx: CanvasRenderingContext2D,
  input: CertificateCanvasInput,
): void {
  // Background — soft cream gradient.
  const bg = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  bg.addColorStop(0, "#fffdf6");
  bg.addColorStop(1, "#fef3c7");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Outer + inner border.
  ctx.strokeStyle = "#92400e";
  ctx.lineWidth = 6;
  ctx.strokeRect(40, 40, CANVAS_W - 80, CANVAS_H - 80);
  ctx.strokeStyle = "rgba(146, 64, 14, 0.45)";
  ctx.lineWidth = 2;
  ctx.strokeRect(70, 70, CANVAS_W - 140, CANVAS_H - 140);

  // Brand mark — top center.
  ctx.fillStyle = "#7c2d12";
  ctx.font = "700 56px system-ui, -apple-system, Helvetica, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("MercyBlade", CANVAS_W / 2, 170);

  ctx.fillStyle = "#9a3412";
  ctx.font = "400 24px system-ui, -apple-system, Helvetica, Arial, sans-serif";
  ctx.fillText(
    "Học tiếng Anh dành cho người Việt",
    CANVAS_W / 2,
    210,
  );

  // Top label (EN/VI).
  let cursor = 300;
  if (input.topLabelEn) {
    ctx.fillStyle = "#475569";
    ctx.font = "500 28px system-ui, -apple-system, Helvetica, Arial, sans-serif";
    ctx.fillText(input.topLabelEn, CANVAS_W / 2, cursor);
    cursor += 38;
  }
  if (input.topLabelVi) {
    ctx.fillStyle = "#64748b";
    ctx.font = "400 24px system-ui, -apple-system, Helvetica, Arial, sans-serif";
    ctx.fillText(input.topLabelVi, CANVAS_W / 2, cursor);
    cursor += 50;
  }

  // Title block (EN/VI).
  cursor = 410;
  if (input.titleEn) {
    ctx.fillStyle = "#1f2937";
    ctx.font = "800 64px system-ui, -apple-system, Helvetica, Arial, sans-serif";
    ctx.fillText(input.titleEn, CANVAS_W / 2, cursor);
    cursor += 70;
  }
  if (input.titleVi) {
    ctx.fillStyle = "#374151";
    ctx.font = "600 38px system-ui, -apple-system, Helvetica, Arial, sans-serif";
    ctx.fillText(input.titleVi, CANVAS_W / 2, cursor);
    cursor += 60;
  }

  // "Presented to" line.
  cursor = Math.max(cursor + 20, 600);
  if (input.subtitleEn) {
    ctx.fillStyle = "#64748b";
    ctx.font = "400 24px system-ui, -apple-system, Helvetica, Arial, sans-serif";
    ctx.fillText(input.subtitleEn, CANVAS_W / 2, cursor);
    cursor += 32;
  }
  if (input.subtitleVi) {
    ctx.fillStyle = "#64748b";
    ctx.font = "400 22px system-ui, -apple-system, Helvetica, Arial, sans-serif";
    ctx.fillText(input.subtitleVi, CANVAS_W / 2, cursor);
    cursor += 50;
  }

  // Recipient name — center stage.
  ctx.fillStyle = "#7c2d12";
  ctx.font = "700 80px Georgia, 'Times New Roman', serif";
  ctx.fillText(input.recipientName, CANVAS_W / 2, cursor + 60);

  // Underline accent.
  const nameWidth = ctx.measureText(input.recipientName).width;
  ctx.strokeStyle = "rgba(146, 64, 14, 0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo((CANVAS_W - nameWidth) / 2 - 24, cursor + 80);
  ctx.lineTo((CANVAS_W + nameWidth) / 2 + 24, cursor + 80);
  ctx.stroke();
  cursor += 130;

  // Program lines (cert type display).
  if (input.programLineEn) {
    ctx.fillStyle = "#475569";
    ctx.font = "500 28px system-ui, -apple-system, Helvetica, Arial, sans-serif";
    ctx.fillText(input.programLineEn, CANVAS_W / 2, cursor);
    cursor += 38;
  }
  if (input.programLineVi) {
    ctx.fillStyle = "#64748b";
    ctx.font = "400 24px system-ui, -apple-system, Helvetica, Arial, sans-serif";
    ctx.fillText(input.programLineVi, CANVAS_W / 2, cursor);
    cursor += 40;
  }

  // Footer — issued date (left), signature (center), code/verify (right).
  const footerY = CANVAS_H - 160;
  ctx.fillStyle = "#475569";
  ctx.font = "500 22px system-ui, -apple-system, Helvetica, Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`Issued · Cấp ngày`, 140, footerY);
  ctx.fillStyle = "#1f2937";
  ctx.font = "600 24px system-ui, -apple-system, Helvetica, Arial, sans-serif";
  ctx.fillText(input.issuedAtFormatted, 140, footerY + 32);

  ctx.fillStyle = "#475569";
  ctx.font = "500 22px system-ui, -apple-system, Helvetica, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(input.signature, CANVAS_W / 2, footerY + 32);
  ctx.strokeStyle = "rgba(71, 85, 105, 0.45)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(CANVAS_W / 2 - 160, footerY + 8);
  ctx.lineTo(CANVAS_W / 2 + 160, footerY + 8);
  ctx.stroke();

  ctx.fillStyle = "#475569";
  ctx.font = "500 22px system-ui, -apple-system, Helvetica, Arial, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("Verify · Mã chứng nhận", CANVAS_W - 140, footerY);
  ctx.fillStyle = "#1f2937";
  ctx.font = "600 22px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText(input.certificateCode, CANVAS_W - 140, footerY + 32);
  ctx.fillStyle = "#7c2d12";
  ctx.font = "400 18px system-ui, -apple-system, Helvetica, Arial, sans-serif";
  ctx.fillText(input.verifyUrl, CANVAS_W - 140, footerY + 60);
}
