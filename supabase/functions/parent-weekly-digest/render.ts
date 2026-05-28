// supabase/functions/parent-weekly-digest/render.ts
//
// L6 — Parent / Family layer. Pure rendering for the weekly parent digest.
// Split out so unit tests pin behavior without Supabase or Resend.
//
// Voice: Q10=C — Mercy speaks here (the digest is the ONE surface where
// Mercy's warmer voice lands; the in-app parent view stays neutral).
// Framing: Q9=A — DESCRIPTIVE only. The attribution clause ("two more
// sessions and this drops") is an L5-PENDING stub that stays empty until
// L4+L5 can ground it. The template is written so that clause layers on
// additively later (a single {{attribution_block_*}} slot).

/** Per-learner signal available SERVER-SIDE today (profiles writeback). */
export type ParentDigestData = {
  /** Learner display name, or a neutral fallback. */
  learner_name_vi: string;
  learner_name_en: string;
  /** Placement CEFR band, or null when no placement snapshot exists. */
  cefr: string | null;
  /** How many distinct patterns are currently flagged. */
  weakness_count: number;
};

export type ParentDigestTemplate = {
  subject_vi: string;
  subject_en: string;
  body_vi: string;
  body_en: string;
};

export type RenderedParentDigest = {
  subject: string;
  body_vi: string;
  body_en: string;
  /** True when there is nothing to report (no CEFR, no flagged patterns). */
  is_empty: boolean;
};

function substitute(template: string, vars: Record<string, string>): string {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(`\\{\\{${safeKey}\\}\\}`, "g"), value);
  }
  return out;
}

export function formatCefrBlock(
  data: ParentDigestData,
): { vi: string; en: string } {
  if (!data.cefr) {
    return {
      vi: "Chưa có kết quả kiểm tra trình độ.",
      en: "No placement result yet.",
    };
  }
  return {
    vi: `Trình độ hiện tại: ${data.cefr}.`,
    en: `Current level: ${data.cefr}.`,
  };
}

export function formatPatternsBlock(
  data: ParentDigestData,
): { vi: string; en: string } {
  if (data.weakness_count <= 0) {
    return {
      vi: "Tuần này chưa có mẫu câu nào nổi bật để luyện.",
      en: "No standout patterns to work on this week.",
    };
  }
  return {
    vi: `${data.learner_name_vi} đang luyện ${data.weakness_count} mẫu câu. Mỗi mẫu có một video tiếng Việt 90 giây giải thích trong trang phụ huynh.`,
    en: `${data.learner_name_en} is working on ${data.weakness_count} pattern(s). Each has a 90-second Vietnamese explainer in the parent view.`,
  };
}

/**
 * L5-PENDING (Q9=A) — the attribution / forecast clause. Empty today so
 * the digest stays descriptive. When L4+L5 land, return the localized
 * sentence here and it drops into the {{attribution_block_*}} slot with no
 * other change.
 */
export function formatAttributionBlock(): { vi: string; en: string } {
  return { vi: "", en: "" };
}

export function buildVariables(
  data: ParentDigestData,
): Record<string, string> {
  const cefr = formatCefrBlock(data);
  const patterns = formatPatternsBlock(data);
  const attribution = formatAttributionBlock();
  return {
    learner_name_vi: data.learner_name_vi,
    learner_name_en: data.learner_name_en,
    cefr_block_vi: cefr.vi,
    cefr_block_en: cefr.en,
    patterns_block_vi: patterns.vi,
    patterns_block_en: patterns.en,
    attribution_block_vi: attribution.vi,
    attribution_block_en: attribution.en,
  };
}

export function renderParentDigest(
  template: ParentDigestTemplate,
  data: ParentDigestData,
): RenderedParentDigest {
  const vars = buildVariables(data);
  return {
    subject: substitute(template.subject_vi, vars),
    body_vi: substitute(template.body_vi, vars),
    body_en: substitute(template.body_en, vars),
    is_empty: !data.cefr && data.weakness_count <= 0,
  };
}

/** HTML wrapper for Resend — VI on top, EN muted below. */
export function toEmailHtml(rendered: RenderedParentDigest): string {
  const escape = (s: string) =>
    s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const para = (text: string) =>
    text
      .split("\n")
      .map((line) => (line === "" ? "<br/>" : `<p>${escape(line)}</p>`))
      .join("");
  return `<!doctype html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#222;max-width:560px;margin:0 auto;padding:24px">
${para(rendered.body_vi)}
<hr style="border:0;border-top:1px solid #ddd;margin:24px 0"/>
<div style="color:#777;font-size:13px;font-style:italic">
${para(rendered.body_en)}
</div>
</body></html>`;
}
