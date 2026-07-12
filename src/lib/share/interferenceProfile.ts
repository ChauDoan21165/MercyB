import { PRODUCT_CONFIG } from "@/config/product";
import type { BilingualText, PlacementV3L1Flag, PlacementV3Results } from "@/lib/placement/v3/types";

export const INTERFERENCE_CARD_WIDTH = 1200;
export const INTERFERENCE_CARD_HEIGHT = 630;
export const INTERFERENCE_PROFILE_SITE_URL = "https://mercyblade.com";

export type InterferenceProfileFinding = {
  id: string;
  severity: PlacementV3L1Flag["severity"];
  label: BilingualText;
  example?: BilingualText;
};

export type InterferenceProfileCardInput = {
  findings: InterferenceProfileFinding[];
  siteUrl: string;
};

const SEVERITY_RANK: Record<PlacementV3L1Flag["severity"], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const UUID_RE = /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi;
const LONG_ID_RE = /\b(?:user|account|session|profile|uid|id)[_-]?[a-z0-9]{8,}\b/gi;

export function buildInterferenceProfileFindings(results: PlacementV3Results): InterferenceProfileFinding[] {
  const distinctByCause = new Map<string, { finding: InterferenceProfileFinding; index: number }>();

  results.l1Flags.forEach((flag, index) => {
    const finding: InterferenceProfileFinding = {
      id: flag.id,
      severity: flag.severity,
      label: sanitizeBilingualText(flag.label),
      example: sanitizeBilingualText(flag.evidence),
    };
    if (!finding.label.en && !finding.label.vi) return;

    const causeKey = normalizeCauseKey(flag.id);
    const previous = distinctByCause.get(causeKey);
    if (!previous || compareRankedFindings({ finding, index }, previous) < 0) {
      distinctByCause.set(causeKey, { finding, index });
    }
  });

  return [...distinctByCause.values()].sort(compareRankedFindings).slice(0, 3).map(({ finding }) => finding);
}

export function formatInterferenceProfileShareText(findings: InterferenceProfileFinding[], siteUrl: string): string {
  const patternList = findings.map((finding) => finding.label.vi || finding.label.en).join(", ");
  return [
    "Hồ sơ ảnh hưởng tiếng Việt của tôi trên MercyBlade",
    patternList ? `Top patterns: ${patternList}` : "Top patterns: placement profile ready",
    siteUrl,
  ].join("\n");
}

export async function generateInterferenceProfileCardBlob(input: InterferenceProfileCardInput): Promise<Blob> {
  if (typeof document === "undefined") {
    throw new Error("generateInterferenceProfileCardBlob requires a browser document");
  }

  const canvas = document.createElement("canvas");
  canvas.width = INTERFERENCE_CARD_WIDTH;
  canvas.height = INTERFERENCE_CARD_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to acquire 2d canvas context");

  paintInterferenceProfileCard(ctx, input);
  return await canvasToPngBlob(canvas);
}

function sanitizeBilingualText(text: BilingualText): BilingualText {
  return {
    en: sanitizeShareText(text.en),
    vi: sanitizeShareText(text.vi),
  };
}

function sanitizeShareText(text: string): string {
  return text
    .replace(EMAIL_RE, "[redacted]")
    .replace(UUID_RE, "[redacted]")
    .replace(LONG_ID_RE, "[redacted]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("canvas.toBlob returned null"));
          return;
        }
        resolve(blob);
      },
      "image/png",
    );
  });
}

function paintInterferenceProfileCard(ctx: CanvasRenderingContext2D, input: InterferenceProfileCardInput): void {
  const gradient = ctx.createLinearGradient(0, 0, INTERFERENCE_CARD_WIDTH, INTERFERENCE_CARD_HEIGHT);
  gradient.addColorStop(0, "#ECFDF5");
  gradient.addColorStop(0.55, "#F8FAFC");
  gradient.addColorStop(1, "#FFF7ED");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, INTERFERENCE_CARD_WIDTH, INTERFERENCE_CARD_HEIGHT);

  ctx.strokeStyle = "rgba(15,118,110,0.16)";
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, INTERFERENCE_CARD_WIDTH - 4, INTERFERENCE_CARD_HEIGHT - 4);

  ctx.fillStyle = "#0F766E";
  ctx.font = "900 38px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(PRODUCT_CONFIG.name, 56, 44);

  ctx.fillStyle = "rgba(15,23,42,0.62)";
  ctx.font = "700 18px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(PRODUCT_CONFIG.tagline, 56, 94);

  ctx.fillStyle = "#0F172A";
  ctx.font = "950 54px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("Hồ sơ Interference", 56, 150);

  ctx.fillStyle = "rgba(15,23,42,0.66)";
  ctx.font = "800 28px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("Interference Profile", 56, 212);

  let y = 292;
  input.findings.slice(0, 3).forEach((finding, index) => {
    const badge = `${index + 1}`;
    ctx.fillStyle = severityColor(finding.severity);
    roundRect(ctx, 56, y - 12, 50, 50, 16);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "900 28px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(badge, 81, y + 13);

    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#0F172A";
    ctx.font = "900 28px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
    drawWrappedText(ctx, finding.label.vi || finding.label.en, 126, y - 10, 820, 34, 1);

    if (finding.label.en && finding.label.en !== finding.label.vi) {
      ctx.fillStyle = "rgba(51,65,85,0.74)";
      ctx.font = "800 19px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
      drawWrappedText(ctx, finding.label.en, 126, y + 22, 820, 24, 1);
    }

    const example = finding.example?.en || finding.example?.vi;
    if (example) {
      ctx.fillStyle = "rgba(51,65,85,0.78)";
      ctx.font = "700 20px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
      drawWrappedText(ctx, `Ví dụ / Example: ${example}`, 126, y + 50, 880, 27, 1);
    }
    y += 96;
  });

  ctx.fillStyle = "#0F766E";
  ctx.font = "900 24px -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(input.siteUrl, 56, INTERFERENCE_CARD_HEIGHT - 44);
}

function normalizeCauseKey(id: string): string {
  return id.trim().toLowerCase().replace(/[_\s]+/g, "-");
}

function compareRankedFindings(
  left: { finding: InterferenceProfileFinding; index: number },
  right: { finding: InterferenceProfileFinding; index: number },
): number {
  return SEVERITY_RANK[left.finding.severity] - SEVERITY_RANK[right.finding.severity] || left.index - right.index;
}

function severityColor(severity: PlacementV3L1Flag["severity"]): string {
  if (severity === "high") return "#E11D48";
  if (severity === "medium") return "#D97706";
  return "#0F766E";
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
): void {
  const words = text.split(/\s+/);
  let line = "";
  let cursorY = y;
  let lines = 0;

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      lines += 1;
      if (lines >= maxLines) return;
      line = word;
      cursorY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line && lines < maxLines) ctx.fillText(line, x, cursorY);
}
