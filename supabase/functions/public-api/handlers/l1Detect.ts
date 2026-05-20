/**
 * POST /api/v1/l1-detect
 *
 * Body: { text: string, l1_code: "vi" }
 * Returns: { hits: Array<{ rule, message_en, message_vi, span? }> }
 *
 * Shell implementation: this handler runs a SMALL inline subset of the
 * Vietnamese L1 rule pack (3 high-signal rules) to demonstrate the
 * endpoint shape without coupling to `src/lib/feedback/` — that module
 * uses extensionless imports that Deno can't resolve as-is. Wiring the
 * full rule pack is a follow-up: either add `.ts` extensions through
 * the feedback chain, or expose an internal RPC the handler can proxy.
 *
 * Privacy: the input `text` is processed in-memory only; we don't
 * persist it. The api_request_logs row stores endpoint + status, not body.
 */

import type { HandlerResponse, RequestContext } from "../index.ts";
import { captureEdgeError } from "../../_shared/sentry.ts";
import { l1DetectRequestSchema } from "../../_shared/publicApiSchemas.ts";

// DetectBody type now sourced from the zod schema in
// _shared/publicApiSchemas.ts (A11c). Local `unknown`-fields shape
// removed.

type RuleHit = {
  rule: string;
  message_en: string;
  message_vi: string;
  span?: { start: number; end: number; text: string };
};

const MAX_TEXT_LENGTH = 1000;

/**
 * Detect "missing be-verb" — Vietnamese has zero copula in many
 * predicate-noun and predicate-adjective structures, so learners
 * write "I student" / "She tired" without "am" / "is".
 */
function detectMissingBe(text: string): RuleHit | null {
  // Quick heuristic: subject pronoun directly followed by a noun/adj
  // without an intervening be-form. Not exhaustive; avoids false-pos
  // on imperative + verb starts.
  const m = text.match(
    /\b(I|you|he|she|it|we|they)\s+(student|teacher|tired|happy|sad|angry|hungry|thirsty|busy|cold|hot|good|bad|ready|here|there)\b/i,
  );
  if (!m) return null;
  return {
    rule: "vi_l1_missing_be",
    message_en: "English needs a 'be'-verb here. Vietnamese drops it; English doesn't.",
    message_vi: "Tiếng Anh cần động từ 'be' (am/is/are) ở đây. Tiếng Việt thường bỏ — tiếng Anh thì không.",
    span: m.index !== undefined
      ? { start: m.index, end: m.index + m[0].length, text: m[0] }
      : undefined,
  };
}

/**
 * Detect "missing article" — Vietnamese has no a/an/the. A common
 * error is bare singular count nouns: "I want apple" instead of "an apple".
 */
function detectMissingArticle(text: string): RuleHit | null {
  // Look for a verb followed directly by a bare singular count noun.
  const m = text.match(
    /\b(want|need|buy|see|have|eat|drink)\s+(apple|book|car|house|dog|cat|chair|table|phone|computer|pen)\b/i,
  );
  if (!m) return null;
  return {
    rule: "vi_l1_missing_article",
    message_en: "Add 'a' or 'the' before the noun. English requires articles even when Vietnamese doesn't.",
    message_vi: "Thêm 'a' hoặc 'the' trước danh từ. Tiếng Anh cần mạo từ kể cả khi tiếng Việt không.",
    span: m.index !== undefined
      ? { start: m.index, end: m.index + m[0].length, text: m[0] }
      : undefined,
  };
}

/**
 * Detect "missing plural -s" — Vietnamese marks plurality with separate
 * classifiers, not noun morphology. Learners write "two book" / "three apple".
 */
function detectMissingPlural(text: string): RuleHit | null {
  const m = text.match(
    /\b(two|three|four|five|six|seven|eight|nine|ten|many|several|few)\s+(apple|book|car|house|dog|cat|chair|table|phone|computer|pen|student|teacher|child|friend)\b/i,
  );
  if (!m) return null;
  return {
    rule: "vi_l1_plural_s",
    message_en: "Add '-s' to the noun for plural. Vietnamese doesn't change the noun; English does.",
    message_vi: "Thêm '-s' vào danh từ để chỉ số nhiều. Tiếng Việt không đổi danh từ; tiếng Anh có.",
    span: m.index !== undefined
      ? { start: m.index, end: m.index + m[0].length, text: m[0] }
      : undefined,
  };
}

const VI_RULES = [detectMissingBe, detectMissingArticle, detectMissingPlural];

export async function handleL1Detect(
  ctx: RequestContext,
): Promise<HandlerResponse> {
  if (ctx.request.method !== "POST") {
    return { status: 405, body: { error: "method_not_allowed" } };
  }

  // ── A11c: structural zod validation (THIRD gate after auth + rate-limit) ──
  // The existing application-layer checks below (missing_field /
  // text_too_long / unsupported_l1_code) still drive the public
  // contract — they are documented error codes consumers may branch
  // on. Zod runs first as a structural gate that catches wrong-type
  // / null / array bodies (which the existing defensive type-checks
  // would silently coerce). On structural failure: generic 400
  // (no schema info leaks) + Sentry beacon (PII-scrubbed: ONLY
  // {path, code} per issue + top-level keys; the `message` field
  // is intentionally dropped per A11c's tightened public-api PII
  // contract — zod auto-messages can echo user-supplied content).
  let parsedJson: unknown;
  try {
    parsedJson = await ctx.request.json();
  } catch {
    return { status: 400, body: { error: "invalid_json" } };
  }

  const parse = l1DetectRequestSchema.safeParse(parsedJson);
  if (!parse.success) {
    const topLevelKeys =
      parsedJson && typeof parsedJson === "object" && !Array.isArray(parsedJson)
        ? Object.keys(parsedJson as Record<string, unknown>)
        : [];
    await captureEdgeError(
      new Error("public-api/l1-detect request failed zod validation"),
      {
        functionName: "public-api/l1-detect",
        extra: {
          stage: "request-zod",
          // PII-scrubbed: path + code ONLY — no message echoes.
          zodIssues: parse.error.issues.map((iss) => ({
            path: iss.path.join("."),
            code: iss.code,
          })),
          topLevelKeys,
        },
        tags: {
          surface: "public-api",
          endpoint: "l1-detect",
          stage: "request-zod",
        },
      },
    );
    // Generic 400 — no schema info leaks via the response body.
    return { status: 400, body: { error: "invalid_payload" } };
  }

  const body = parse.data;
  const text = typeof body.text === "string" ? body.text.trim() : "";
  const l1Code = typeof body.l1_code === "string" ? body.l1_code : "";

  if (!text) {
    return { status: 400, body: { error: "missing_field", field: "text" } };
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return {
      status: 413,
      body: { error: "text_too_long", limit: MAX_TEXT_LENGTH },
    };
  }
  if (l1Code !== "vi") {
    return {
      status: 400,
      body: {
        error: "unsupported_l1_code",
        supported: ["vi"],
        detail: "Only 'vi' (Vietnamese) is supported in this release.",
      },
    };
  }

  // Run all rules; collect every match (unlike the in-app detector which
  // stops at first match — public consumers may want every signal).
  const hits: RuleHit[] = [];
  for (const fn of VI_RULES) {
    const hit = fn(text);
    if (hit) hits.push(hit);
  }

  return {
    status: 200,
    body: {
      l1_code: l1Code,
      input_length: text.length,
      hits,
      note: "Shell release — covers vi_l1_missing_be, vi_l1_missing_article, vi_l1_plural_s. Full rule pack coming soon.",
    },
  };
}
