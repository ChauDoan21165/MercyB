// tests/content/honestyGuard.test.ts
// M19 honesty floor — CI guard against fabricated statistics, bare testimonials,
// and invented IELTS/TOEIC score claims in src/content-factory/**
//
// Acceptance bar: zero false positives against existing merged content (human-reviewed).
// Any violation here means a newly committed file introduced a breach.
//
// CALIBRATION NOTES (run against existing files before merging):
//   "triệu chứng" (symptoms) — does NOT match "triệu người" (requires " người")
//   "Lỗi hay sai #1" (ordinal) — does NOT match "#1 app/platform" (no market noun after)
//   "Muốn tăng điểm TOEIC bền" (general advice) — does NOT match (no score number)
//   post-20.md "MẪU — điền thông tin thật" — exempt from testimonial check (template file)

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const CONTENT_FACTORY = join(__dirname, "../../src/content-factory");

function collectContentFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectContentFiles(fullPath));
    } else if (/\.(md|json)$/.test(entry.name)) {
      out.push(fullPath);
    }
  }
  return out;
}

function fileLabel(filePath: string): string {
  return relative(CONTENT_FACTORY, filePath);
}

const contentFiles = collectContentFiles(CONTENT_FACTORY);

// ---------------------------------------------------------------------------
// Guard A — Fabricated statistics
// ---------------------------------------------------------------------------
const FABRICATED_STAT_PATTERNS: Array<{ re: RegExp; patternLabel: string }> = [
  // "triệu người" — millions of users; NOT "triệu chứng" (symptoms)
  {
    re: /triệu\s+người/i,
    patternLabel: "triệu người (fabricated user-count claim)",
  },
  // "hàng nghìn học viên" — thousands of students
  {
    re: /hàng\s+nghìn\s+học\s+viên/i,
    patternLabel: "hàng nghìn học viên (fabricated scale claim)",
  },
  // <number>% + improvement verb in the same clause
  {
    re: /\d+\s*%\s*(cải\s*thiện|tăng\s*lên|improvement)/i,
    patternLabel: "% + improvement verb with concrete number",
  },
  // "#1 app/platform" market-rank claim; NOT ordinals like "Lỗi hay sai #1"
  {
    re: /#\s*1\s+(app|platform|ứng\s+dụng)\b/i,
    patternLabel: "#1 app/platform market-rank claim",
  },
];

// ---------------------------------------------------------------------------
// Guard B — Bare testimonials
// Pattern: quoted speech (10-200 chars) + named person attribution + IELTS/TOEIC score
// Exempt: files that carry a "MẪU" + "[điền" template marker (slots prevent fabrication)
// ---------------------------------------------------------------------------
const TESTIMONIAL_RE =
  /["""«]([^"""«]{10,200})["""»]\s*[-—–]?\s*[A-ZÀ-Ỹ][a-zà-ỹ]+\s*[,(]\s*(IELTS|TOEIC|Band)\s*[\d.]+/i;

function isMauTemplate(text: string): boolean {
  return text.includes("MẪU") && /\[điền/.test(text);
}

// ---------------------------------------------------------------------------
// Guard C — Invented IELTS / TOEIC score claims
// Only flags when a specific numeric result is CLAIMED, not generic advice.
// ---------------------------------------------------------------------------
const INVENTED_SCORE_PATTERNS: Array<{ re: RegExp; patternLabel: string }> = [
  {
    re: /đạt\s+(IELTS|Band)\s*[\d.]+/i,
    patternLabel: "đạt IELTS/Band [score] — invented result",
  },
  {
    re: /đạt\s+TOEIC\s*\d{3,4}/i,
    patternLabel: "đạt TOEIC [score] — invented result",
  },
  {
    re: /tăng\s+(?:điểm\s+)?IELTS\s+(?:từ|lên|thêm)\s*[\d.]+/i,
    patternLabel: "tăng IELTS [score] — fabricated improvement",
  },
  {
    re: /tăng\s+(?:điểm\s+)?TOEIC\s+(?:từ|lên|thêm)\s*\d{3,4}/i,
    patternLabel: "tăng TOEIC [score] — fabricated improvement",
  },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("M19 Honesty Guard — src/content-factory/**", () => {
  it("(A) no fabricated statistics in any content file", () => {
    const violations: string[] = [];
    for (const file of contentFiles) {
      const text = readFileSync(file, "utf-8");
      for (const { re, patternLabel } of FABRICATED_STAT_PATTERNS) {
        if (re.test(text)) {
          violations.push(`${fileLabel(file)}: ${patternLabel}`);
        }
      }
    }
    expect(
      violations,
      `Fabricated-stat violations — review or add MẪU exemption:\n${violations.join("\n")}`,
    ).toEqual([]);
  });

  it("(B) no bare testimonial (quoted speech + name + score) outside a MẪU template", () => {
    const violations: string[] = [];
    for (const file of contentFiles) {
      const text = readFileSync(file, "utf-8");
      if (isMauTemplate(text)) continue;
      if (TESTIMONIAL_RE.test(text)) {
        violations.push(fileLabel(file));
      }
    }
    expect(
      violations,
      `Bare testimonial violations — add MẪU template markers or remove fabricated quotes:\n${violations.join("\n")}`,
    ).toEqual([]);
  });

  it("(C) no invented IELTS / TOEIC score claims", () => {
    const violations: string[] = [];
    for (const file of contentFiles) {
      const text = readFileSync(file, "utf-8");
      for (const { re, patternLabel } of INVENTED_SCORE_PATTERNS) {
        if (re.test(text)) {
          violations.push(`${fileLabel(file)}: ${patternLabel}`);
        }
      }
    }
    expect(
      violations,
      `Invented IELTS/TOEIC score claim found:\n${violations.join("\n")}`,
    ).toEqual([]);
  });
});
