// supabase/functions/weekly-digest-email/render.ts
//
// Pure rendering for the weekly digest. Split out so unit tests can pin
// behavior without spinning up Supabase or Resend.

export type DigestAggregate = {
  week_starts_on: string;
  total_attempts_this_week: number;
  total_unique_active_users_this_week: number;
  new_users_this_week: number;
  top_phoneme_improved: string | null;
  top_phoneme_improvement_points: number | null;
  top_topic_practiced: string | null;
  top_topic_attempt_count: number | null;
};

export type UserContribution = {
  attempts_count: number;
  sentences_practiced: number;
  topics_explored: number;
  score_delta_vs_last_week: number;
};

export type DigestTemplate = {
  subject_vi: string;
  subject_en: string;
  body_vi: string;
  body_en: string;
};

export type RenderedDigest = {
  subject: string;
  body_vi: string;
  body_en: string;
  /** True when the user has zero attempts this week — caller may choose to skip. */
  is_inactive_user: boolean;
};

// ── Date helpers ─────────────────────────────────────────────────────────

const VN_MONTHS = [
  "tháng 1", "tháng 2", "tháng 3", "tháng 4", "tháng 5", "tháng 6",
  "tháng 7", "tháng 8", "tháng 9", "tháng 10", "tháng 11", "tháng 12",
];

const EN_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function fmtVi(d: Date): string {
  return `${d.getUTCDate()} ${VN_MONTHS[d.getUTCMonth()]}`;
}

function fmtEn(d: Date): string {
  return `${EN_MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

function addDays(iso: string, n: number): Date {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d;
}

// ── Phoneme + topic block formatting ─────────────────────────────────────

/** Build the bilingual "hardest phoneme" sentence fragment. Falls back
 *  gracefully when no phoneme cleared the threshold (e.g., first week,
 *  small sample size). */
export function formatPhonemeBlock(
  agg: DigestAggregate,
): { vi: string; en: string } {
  const phoneme = agg.top_phoneme_improved;
  const delta = agg.top_phoneme_improvement_points;
  if (!phoneme || delta == null) {
    return {
      vi: "tuần này chưa đủ dữ liệu để chọn âm khó nhất",
      en: "not enough data this week",
    };
  }
  const sign = delta >= 0 ? "+" : "";
  return {
    vi: `/${phoneme}/ — trung bình cộng đồng tăng ${sign}${delta} điểm`,
    en: `/${phoneme}/ — community average up ${sign}${delta} points`,
  };
}

export function formatTopicBlock(
  agg: DigestAggregate,
): { vi: string; en: string } {
  const topic = agg.top_topic_practiced;
  const count = agg.top_topic_attempt_count;
  if (!topic || count == null) {
    return {
      vi: "chưa có phòng nào nổi bật tuần này",
      en: "no standout room this week",
    };
  }
  return {
    vi: `${topic} (${count} lượt luyện)`,
    en: `${topic} (${count} attempts)`,
  };
}

// ── User contribution formatting ─────────────────────────────────────────

export function formatScoreDelta(
  delta: number,
): { vi: string; en: string } {
  if (delta === 0) {
    return { vi: "giữ nguyên", en: "no change" };
  }
  const sign = delta > 0 ? "+" : "";
  return {
    vi: `${sign}${delta} điểm`,
    en: `${sign}${delta} points`,
  };
}

// ── Template variable substitution ───────────────────────────────────────

function substitute(
  template: string,
  vars: Record<string, string>,
): string {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    // Replace all occurrences. Escape regex special chars in the key.
    const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(`\\{\\{${safeKey}\\}\\}`, "g"), value);
  }
  return out;
}

// ── Public render ────────────────────────────────────────────────────────

export function buildVariables(
  agg: DigestAggregate,
  user: UserContribution,
): Record<string, string> {
  const weekStart = new Date(agg.week_starts_on + "T00:00:00Z");
  const weekEnd = addDays(agg.week_starts_on, 6);
  const phoneme = formatPhonemeBlock(agg);
  const topic = formatTopicBlock(agg);
  const delta = formatScoreDelta(user.score_delta_vs_last_week);
  const minusOne = Math.max(0, agg.total_unique_active_users_this_week - 1);

  return {
    week_starts_on_vi: fmtVi(weekStart),
    week_ends_on_vi: fmtVi(weekEnd),
    week_starts_on_en: fmtEn(weekStart),
    week_ends_on_en: fmtEn(weekEnd),
    total_attempts: String(agg.total_attempts_this_week),
    unique_users: String(agg.total_unique_active_users_this_week),
    unique_users_minus_one: String(minusOne),
    new_users: String(agg.new_users_this_week),
    top_phoneme_block_vi: phoneme.vi,
    top_phoneme_block_en: phoneme.en,
    top_topic_block_vi: topic.vi,
    top_topic_block_en: topic.en,
    user_attempts: String(user.attempts_count),
    user_sentences: String(user.sentences_practiced),
    user_topics: String(user.topics_explored),
    user_score_delta_vi: delta.vi,
    user_score_delta_en: delta.en,
  };
}

export function renderDigest(
  template: DigestTemplate,
  agg: DigestAggregate,
  user: UserContribution,
): RenderedDigest {
  const vars = buildVariables(agg, user);
  return {
    subject: substitute(template.subject_vi, vars),
    body_vi: substitute(template.body_vi, vars),
    body_en: substitute(template.body_en, vars),
    is_inactive_user: user.attempts_count === 0,
  };
}

/** HTML wrapper for Resend. Keeps both languages visible — VI on top,
 *  EN below in muted color. */
export function toEmailHtml(rendered: RenderedDigest): string {
  const escape = (s: string) =>
    s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
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
