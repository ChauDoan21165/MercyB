// tests/docs/post-migration-doc-drift.test.ts
//
// Static drift detector for the post-2026-05-27 migration docs. The
// realignment work in !74 + !82 brought a set of root + docs/ files
// into line with current ground truth (Netlify primary, GitLab repo,
// Vercel as documented recovery, Stripe webhook at the Supabase edge
// function — see docs/runbooks/disaster-recovery.md). Without a
// guard, those edits will rot silently as the codebase evolves. This
// test is the guard.
//
// What this is NOT:
//   - A full markdown linter. We do not check spelling, link health,
//     or tone.
//   - A semantic-correctness check. We pattern-match on known stale
//     references; we cannot detect every possible drift.
//   - A replacement for human review. Operators still read MRs.
//
// What this IS:
//   - Four narrow rules, each backed by a regex / structural check,
//     that catch the specific drift classes we've already had to
//     fix once.
//   - Per-rule allowlist via HTML-comment sentinels (`<!--
//     drift-allow: <rule> -->`) so historical/contextual mentions can
//     be marked intentional.
//   - Per-section historical-block awareness — content under a
//     heading matching /^#+ (Historical|Changelog|Legacy|Archive)/i
//     is exempt from every rule until the next equal-or-higher
//     heading.
//
// To add a new rule:
//   1. Add a `Rule` entry to the RULES array below.
//   2. Implement the detector function returning Finding[].
//   3. Document the rule name in the failure-message hint so
//      `drift-allow: <name>` is discoverable.
//
// To allow a single line:
//   <!-- drift-allow: <rule-name> -->
//
// To allow an entire section:
//   ## Historical
//   ...
//
// To allow a single line via inline marker:
//   <!-- stale-ref: historical -->

import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

// ────────────────────────────────────────────────────────────────────
// Tracked-docs roster
// ────────────────────────────────────────────────────────────────────
//
// Every doc on this list was touched by the post-migration realignment
// (!74 or !82) AND describes current production reality. The drift
// detector pins their content against the four rules below.
//
// Adding to this list: add a path here. The new doc must satisfy every
// rule on first inclusion. Use drift-allow sentinels for legitimate
// historical mentions.
//
// Removing from this list: only when the doc itself is removed or
// genuinely no longer describes current state.

const REPO_ROOT = resolve(__dirname, "..", "..");

const TRACKED_DOCS: ReadonlyArray<string> = [
  "CLAUDE.md",
  "README.md",
  "SETUP.md",
  "PRINCIPLES.md",
  ".github/workflows/DEPLOYMENT.md",
  ".github/workflows/ROLLBACK.md",
  "docs/ACCESSIBILITY.md",
  "docs/runbooks/disaster-recovery.md",
  "docs/architecture/system-overview.md",
  "docs/architecture/data-flow.md",
  "docs/architecture/systems/billing-entitlement.md",
  "docs/architecture/systems/observability.md",
  "docs/architecture/systems/native-shells.md",
  "docs/architecture/systems/study-os-stage-3.md",
  "docs/architecture/systems/ai-tutor.md",
  "docs/architecture/systems/placement-v3.md",
  "docs/architecture/systems/mercy-guide.md",
  "docs/architecture/systems/search-rooms.md",
  "docs/architecture/systems/onboarding-language-pair.md",
  "docs/onboarding/README.md",
  "docs/onboarding/local-setup.md",
  "docs/onboarding/your-first-contribution.md",
  "docs/onboarding/glossary.md",
  "docs/contributing/agent-handoff.md",
];

// ────────────────────────────────────────────────────────────────────
// Parse helpers — historical sections and drift-allow sentinels
// ────────────────────────────────────────────────────────────────────

const HISTORICAL_HEADING_RE =
  /^(#+)\s+(historical|history|changelog|legacy|archive|archived)\b/i;
const HEADING_RE = /^(#+)\s+/;
const DRIFT_ALLOW_RE = /<!--\s*drift-allow:\s*([a-z0-9-]+)\s*-->/i;
const STALE_REF_RE = /<!--\s*stale-ref:\s*historical\s*-->/i;

interface DocFile {
  /** Relative path from REPO_ROOT. Used in failure messages. */
  path: string;
  /** Full file content. Useful for file-level scans. */
  content: string;
  /** Lines, split on \n. Indices are 0-based; reported line numbers are
   *  1-based via i + 1. */
  lines: string[];
  /** lines[i] is in a historical section. */
  inHistorical: boolean[];
  /** lines[i] carries an explicit drift-allow sentinel for any of these
   *  rule names. The sentinel covers the same line and the next 2 lines
   *  to allow placement above the offending content. */
  allowedRulesByLine: Map<number, Set<string>>;
}

function loadDoc(relPath: string): DocFile {
  const abs = resolve(REPO_ROOT, relPath);
  const content = readFileSync(abs, "utf8");
  const lines = content.split("\n");
  return {
    path: relPath,
    content,
    lines,
    inHistorical: computeHistoricalMap(lines),
    allowedRulesByLine: computeAllowedMap(lines),
  };
}

/**
 * Walk the document, opening a "historical" region whenever we hit a
 * heading matching HISTORICAL_HEADING_RE, and closing it when we hit a
 * later heading of equal-or-higher level. Sibling inline markers
 * (<!-- stale-ref: historical -->) also mark the same line.
 */
function computeHistoricalMap(lines: string[]): boolean[] {
  const out = new Array<boolean>(lines.length).fill(false);
  let activeLevel: number | null = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headingMatch = HEADING_RE.exec(line);
    if (headingMatch) {
      const level = headingMatch[1].length;
      if (activeLevel !== null && level <= activeLevel) {
        activeLevel = null;
      }
      if (HISTORICAL_HEADING_RE.test(line)) {
        activeLevel = level;
      }
    }
    if (activeLevel !== null) out[i] = true;
    if (STALE_REF_RE.test(line)) out[i] = true;
  }
  return out;
}

/**
 * The sentinel `<!-- drift-allow: <rule> -->` covers the line it
 * appears on AND the next 2 lines, so an operator can mark a
 * preceding block-quote / table row / paragraph as intentional
 * without inlining the comment inside the offending content.
 */
function computeAllowedMap(lines: string[]): Map<number, Set<string>> {
  const out = new Map<number, Set<string>>();
  for (let i = 0; i < lines.length; i++) {
    const m = DRIFT_ALLOW_RE.exec(lines[i]);
    if (!m) continue;
    const rule = m[1].toLowerCase();
    for (let j = i; j <= Math.min(i + 2, lines.length - 1); j++) {
      let s = out.get(j);
      if (!s) {
        s = new Set<string>();
        out.set(j, s);
      }
      s.add(rule);
    }
  }
  return out;
}

function isExemptForRule(doc: DocFile, lineIdx: number, rule: string): boolean {
  if (doc.inHistorical[lineIdx]) return true;
  return doc.allowedRulesByLine.get(lineIdx)?.has(rule) ?? false;
}

// ────────────────────────────────────────────────────────────────────
// Finding shape + formatter
// ────────────────────────────────────────────────────────────────────

interface Finding {
  doc: string;
  /** 1-based. */
  line: number;
  /** Short snippet of the offending content. */
  excerpt: string;
}

function formatFindings(rule: Rule, findings: Finding[]): string {
  return [
    ``,
    `[doc-drift] Rule "${rule.name}" found ${findings.length} drift finding(s):`,
    ``,
    ...findings.map(
      (f) =>
        `  ${f.doc}:${f.line}\n` +
        `    └─ ${f.excerpt}`,
    ),
    ``,
    `What this rule guards: ${rule.description}`,
    ``,
    `How to fix:`,
    `  • If the finding is the actual current state, update the doc to remove the stale claim.`,
    `  • If the mention is historical/contextual, mark it intentional:`,
    `      <!-- drift-allow: ${rule.name} -->`,
    `    (placed on the same line OR up to 2 lines above the mention).`,
    `  • Or move the mention under a section heading matching /^#+ (Historical|Changelog|Legacy|Archive)\\b/i.`,
    `  • Or inline mark a single line with: <!-- stale-ref: historical -->`,
    ``,
  ].join("\n");
}

// ────────────────────────────────────────────────────────────────────
// Rule 1: no Vercel URLs (vercel.com / vercel.app) as live links
// ────────────────────────────────────────────────────────────────────
//
// Post-migration, mercyblade.com is on Netlify. Vercel is the
// documented recovery host but is not the primary docs target. Email
// contacts (`help@vercel.com`) are legitimate and excluded from this
// rule — the regex requires a URL prefix.

function findVercelUrls(doc: DocFile): Finding[] {
  const re = /https?:\/\/[^\s"'`)>\]]*vercel\.(?:com|app)\b/gi;
  const findings: Finding[] = [];
  for (let i = 0; i < doc.lines.length; i++) {
    for (const m of doc.lines[i].matchAll(re)) {
      if (isExemptForRule(doc, i, "vercel-url")) continue;
      findings.push({
        doc: doc.path,
        line: i + 1,
        excerpt: m[0],
      });
    }
  }
  return findings;
}

// ────────────────────────────────────────────────────────────────────
// Rule 2: no legacy GitHub repo URLs (github.com/ChauDoan21165)
// ────────────────────────────────────────────────────────────────────
//
// The canonical repo is GitLab (`gitlab.com:cd12536/mercyB`). The
// `github.com/ChauDoan21165/MercyB` URL is the legacy pre-migration
// target. Note: the regex deliberately requires a slash after
// `github.com/` so the noreply commit email
// (`239713933+ChauDoan21165@users.noreply.github.com`) does NOT match.

function findLegacyGithubRepoUrls(doc: DocFile): Finding[] {
  const re = /github\.com\/ChauDoan21165\b/g;
  const findings: Finding[] = [];
  for (let i = 0; i < doc.lines.length; i++) {
    for (const m of doc.lines[i].matchAll(re)) {
      if (isExemptForRule(doc, i, "github-repo-url")) continue;
      findings.push({
        doc: doc.path,
        line: i + 1,
        excerpt: m[0],
      });
    }
  }
  return findings;
}

// ────────────────────────────────────────────────────────────────────
// Rule 3: no GitHub-as-sole-auth-path UI strings
// ────────────────────────────────────────────────────────────────────
//
// The 2026-05-26 incident showed that single-OAuth-provider account
// chains are a real failure mode (PRINCIPLES.md §4 + the May 26 cascade
// recovery in `disaster-recovery.md` §4). Any doc that mentions a
// GitHub-based auth UI string must ALSO mention an email+password or
// equivalent alternative.

const GITHUB_AUTH_UI_RE =
  /(Continue|Sign in|Sign up|Log in|Login)\s+with\s+GitHub\b/gi;

const HAS_AUTH_ALTERNATIVE_RE =
  /(email\s*(?:\+|\/|and|or)\s*password|email-and-password|email\/password|email\+password|password-based|magic\s*link|email[-\s]based\s+sign-?in)/i;

function findGitHubAuthOnlyMentions(doc: DocFile): Finding[] {
  const findings: Finding[] = [];
  const hasAlternative = HAS_AUTH_ALTERNATIVE_RE.test(doc.content);
  for (let i = 0; i < doc.lines.length; i++) {
    for (const m of doc.lines[i].matchAll(GITHUB_AUTH_UI_RE)) {
      if (hasAlternative) continue; // any alternative anywhere in the file passes the line
      if (isExemptForRule(doc, i, "continue-with-github-only")) continue;
      findings.push({
        doc: doc.path,
        line: i + 1,
        excerpt: m[0],
      });
    }
  }
  return findings;
}

// ────────────────────────────────────────────────────────────────────
// Rule 4: no hardcoded api/* host claims for the Stripe webhook
// ────────────────────────────────────────────────────────────────────
//
// The verified Stripe webhook lives at the Supabase edge function:
//   supabase/functions/stripe-webhook/
//   live URL: https://buemdfxyhxunzpgdoqin.supabase.co/functions/v1/stripe-webhook
//
// Pre-migration drafts claimed it was a Vercel function under `api/*`;
// the !74 + !82 sweep corrected those, and !80 (Stripe-webhook
// verification) made the verified treatment canonical. The rule fires
// when a line claims Stripe webhook lives at `api/*` AND the line is
// not contextualised (within ±3 lines) by:
//   - the verified Supabase path or URL fingerprint,
//   - an explicit "Supabase edge function" mention,
//   - or a "NOT a Vercel api/*" / "was wrong" / similar negation.

const STRIPE_WEBHOOK_HOST_CLAIM_RE =
  /(?:stripe[-\s_]?webhook|Stripe.*\bwebhook\b)[\s\S]{0,80}?api\/\*?|api\/\*?[\s\S]{0,80}?(?:stripe[-\s_]?webhook|Stripe.*\bwebhook\b)/i;
const STRIPE_WEBHOOK_TOKEN_RE = /(stripe[-\s_]?webhook|Stripe.*\bwebhook\b)/i;
const API_STAR_RE = /api\/\*|api\/stripe/i;

const VERIFIED_STRIPE_MARKERS: ReadonlyArray<string> = [
  "supabase/functions/stripe-webhook",
  "buemdfxyhxunzpgdoqin.supabase.co/functions/v1/stripe-webhook",
  "Supabase edge function",
];

const HISTORICAL_NEGATION_MARKERS: ReadonlyArray<string> = [
  "NOT a Vercel",
  "not a Vercel",
  "was wrong",
  "earlier versions of this doc",
  "correction over prior drafts",
  "incorrect",
];

function lineWindow(doc: DocFile, lineIdx: number, radius: number): string {
  const start = Math.max(0, lineIdx - radius);
  const end = Math.min(doc.lines.length, lineIdx + radius + 1);
  return doc.lines.slice(start, end).join("\n");
}

function lineHasVerifiedContext(window: string): boolean {
  for (const marker of VERIFIED_STRIPE_MARKERS) {
    if (window.includes(marker)) return true;
  }
  for (const marker of HISTORICAL_NEGATION_MARKERS) {
    if (window.includes(marker)) return true;
  }
  return false;
}

function findStripeWebhookApiHostClaims(doc: DocFile): Finding[] {
  // Cheap early exit: if the file makes no Stripe-webhook mention at
  // all, skip.
  if (!STRIPE_WEBHOOK_TOKEN_RE.test(doc.content)) return [];

  const findings: Finding[] = [];
  for (let i = 0; i < doc.lines.length; i++) {
    const line = doc.lines[i];
    if (!STRIPE_WEBHOOK_TOKEN_RE.test(line)) continue;
    if (!API_STAR_RE.test(line)) continue;
    // Both tokens in the same line — check whether a co-occurring host
    // claim is contextualised by the verified URL/path or by a
    // historical negation.
    const window = lineWindow(doc, i, 3);
    if (lineHasVerifiedContext(window)) continue;
    if (isExemptForRule(doc, i, "stripe-webhook-host")) continue;
    // Also accept any of the cross-line patterns in the broader 6-line
    // window: the verified context may sit ±3 lines away even when not
    // visible in the line itself.
    findings.push({
      doc: doc.path,
      line: i + 1,
      excerpt: line.trim().slice(0, 140),
    });
  }
  return findings;
}

// ────────────────────────────────────────────────────────────────────
// Rule registry
// ────────────────────────────────────────────────────────────────────

interface Rule {
  /** Stable id used in `<!-- drift-allow: <name> -->`. */
  name: string;
  /** One-line description used in the failure message. */
  description: string;
  /** Detector returning every drift finding for this rule. */
  detect: (doc: DocFile) => Finding[];
}

const RULES: ReadonlyArray<Rule> = [
  {
    name: "vercel-url",
    description:
      "Live URLs to vercel.com / vercel.app are pre-migration artifacts; Netlify is the production host post-2026-05-27. Email contacts (help@vercel.com) are not URLs and are excluded by the regex.",
    detect: findVercelUrls,
  },
  {
    name: "github-repo-url",
    description:
      "github.com/ChauDoan21165/MercyB is the pre-migration repo URL; the canonical remote is GitLab (gitlab.com:cd12536/mercyB). The noreply commit email (users.noreply.github.com) is deliberately not matched.",
    detect: findLegacyGithubRepoUrls,
  },
  {
    name: "continue-with-github-only",
    description:
      "A doc that mentions a GitHub-based auth UI string (\"Continue with GitHub\", etc.) must also mention an email+password / magic-link alternative anywhere in the file (PRINCIPLES.md §4 — single-OAuth-provider lesson).",
    detect: findGitHubAuthOnlyMentions,
  },
  {
    name: "stripe-webhook-host",
    description:
      "Stripe webhook host claims tying the webhook to api/* (a Vercel/Netlify serverless function) without referencing the verified Supabase edge function at supabase/functions/stripe-webhook/ within ±3 lines. The verified URL is https://buemdfxyhxunzpgdoqin.supabase.co/functions/v1/stripe-webhook.",
    detect: findStripeWebhookApiHostClaims,
  },
];

// ────────────────────────────────────────────────────────────────────
// Tests
// ────────────────────────────────────────────────────────────────────

/**
 * Synthetic test fixture used by detector self-checks. Builds a
 * minimal DocFile against arbitrary content so each detector can be
 * exercised directly without touching real on-disk docs.
 */
function syntheticDoc(content: string): DocFile {
  const lines = content.split("\n");
  return {
    path: "<synthetic>",
    content,
    lines,
    inHistorical: computeHistoricalMap(lines),
    allowedRulesByLine: computeAllowedMap(lines),
  };
}

describe("post-migration doc drift detector", () => {
  describe("tracked-docs precondition (every doc exists on main)", () => {
    for (const rel of TRACKED_DOCS) {
      it(rel, () => {
        expect(existsSync(resolve(REPO_ROOT, rel))).toBe(true);
      });
    }
  });

  for (const rule of RULES) {
    describe(`rule: ${rule.name}`, () => {
      for (const rel of TRACKED_DOCS) {
        it(`${rel} has no ${rule.name} drift`, () => {
          const doc = loadDoc(rel);
          const findings = rule.detect(doc);
          if (findings.length > 0) {
            throw new Error(formatFindings(rule, findings));
          }
        });
      }
    });
  }

  // ────────────────────────────────────────────────────────────────
  // Detector self-checks — prove each rule fires on its target
  // drift and is silenced by historical / drift-allow contexts.
  // Without these, a clean-main pass doesn't prove the rule does
  // anything.
  // ────────────────────────────────────────────────────────────────

  describe("detector self-checks (synthetic inputs)", () => {
    describe("vercel-url", () => {
      it("flags a live Vercel docs URL", () => {
        const doc = syntheticDoc(
          "See https://vercel.com/docs/deployments for details.",
        );
        expect(findVercelUrls(doc)).toHaveLength(1);
      });

      it("flags a *.vercel.app preview URL", () => {
        const doc = syntheticDoc(
          "Preview: https://mercyblade-pr-123.vercel.app/",
        );
        expect(findVercelUrls(doc)).toHaveLength(1);
      });

      it("does NOT flag the help@vercel.com email contact", () => {
        const doc = syntheticDoc("Email help@vercel.com for support.");
        expect(findVercelUrls(doc)).toHaveLength(0);
      });

      it("is silenced under a Historical section heading", () => {
        const doc = syntheticDoc(
          "## Historical\n\nSee https://vercel.com/docs/legacy.\n",
        );
        expect(findVercelUrls(doc)).toHaveLength(0);
      });

      it("is silenced by drift-allow sentinel on the same line", () => {
        const doc = syntheticDoc(
          "See https://vercel.com/docs/x. <!-- drift-allow: vercel-url -->",
        );
        expect(findVercelUrls(doc)).toHaveLength(0);
      });

      it("is silenced by drift-allow sentinel on the preceding line", () => {
        const doc = syntheticDoc(
          "<!-- drift-allow: vercel-url -->\nSee https://vercel.com/docs/x.",
        );
        expect(findVercelUrls(doc)).toHaveLength(0);
      });
    });

    describe("github-repo-url", () => {
      it("flags https://github.com/ChauDoan21165/MercyB", () => {
        const doc = syntheticDoc(
          "Clone: https://github.com/ChauDoan21165/MercyB.git",
        );
        expect(findLegacyGithubRepoUrls(doc)).toHaveLength(1);
      });

      it("does NOT flag the noreply commit email (users.noreply.github.com)", () => {
        const doc = syntheticDoc(
          "Commit as Chau Doan <239713933+ChauDoan21165@users.noreply.github.com>",
        );
        expect(findLegacyGithubRepoUrls(doc)).toHaveLength(0);
      });

      it("is silenced under a Changelog heading", () => {
        const doc = syntheticDoc(
          "## Changelog\n\n- Migrated from https://github.com/ChauDoan21165/MercyB to GitLab.",
        );
        expect(findLegacyGithubRepoUrls(doc)).toHaveLength(0);
      });

      it("is silenced by drift-allow sentinel", () => {
        const doc = syntheticDoc(
          "<!-- drift-allow: github-repo-url -->\nLegacy: https://github.com/ChauDoan21165/MercyB",
        );
        expect(findLegacyGithubRepoUrls(doc)).toHaveLength(0);
      });
    });

    describe("continue-with-github-only", () => {
      it("flags 'Continue with GitHub' when no alternative is mentioned", () => {
        const doc = syntheticDoc(
          "## Sign in\n\nClick **Continue with GitHub** to sign in.\n",
        );
        expect(findGitHubAuthOnlyMentions(doc)).toHaveLength(1);
      });

      it("passes when email+password alternative is mentioned in the file", () => {
        const doc = syntheticDoc(
          "## Sign in\n\nClick **Continue with GitHub**, or use the email and password form below.\n",
        );
        expect(findGitHubAuthOnlyMentions(doc)).toHaveLength(0);
      });

      it("passes when magic link is the alternative", () => {
        const doc = syntheticDoc(
          "Sign in with GitHub. (Or request a magic link via email.)",
        );
        expect(findGitHubAuthOnlyMentions(doc)).toHaveLength(0);
      });

      it("is silenced under a Legacy section heading", () => {
        const doc = syntheticDoc(
          "## Legacy\n\nThe old UI showed Continue with GitHub as the only path.",
        );
        expect(findGitHubAuthOnlyMentions(doc)).toHaveLength(0);
      });
    });

    describe("stripe-webhook-host", () => {
      it("flags an affirmative api/* host claim with no verified context", () => {
        const doc = syntheticDoc(
          "Stripe webhook lives at api/* and is signed by STRIPE_WEBHOOK_SECRET.",
        );
        expect(findStripeWebhookApiHostClaims(doc)).toHaveLength(1);
      });

      it("passes when the verified Supabase path is nearby", () => {
        const doc = syntheticDoc(
          [
            "Stripe webhook lives at api/* — wrong, see below.",
            "It is actually at supabase/functions/stripe-webhook/.",
          ].join("\n"),
        );
        expect(findStripeWebhookApiHostClaims(doc)).toHaveLength(0);
      });

      it("passes when the verified Supabase URL is present in the same line", () => {
        const doc = syntheticDoc(
          "Stripe webhook URL: https://buemdfxyhxunzpgdoqin.supabase.co/functions/v1/stripe-webhook (NOT an api/* function).",
        );
        expect(findStripeWebhookApiHostClaims(doc)).toHaveLength(0);
      });

      it("passes under a Historical correction (e.g. 'was wrong')", () => {
        const doc = syntheticDoc(
          [
            "Earlier versions of this doc said the Stripe webhook was at api/*. That was wrong.",
            "It is at supabase/functions/stripe-webhook/.",
          ].join("\n"),
        );
        expect(findStripeWebhookApiHostClaims(doc)).toHaveLength(0);
      });

      it("is silenced by drift-allow sentinel on the preceding line", () => {
        const doc = syntheticDoc(
          [
            "<!-- drift-allow: stripe-webhook-host -->",
            "The Stripe webhook lived at api/* historically.",
          ].join("\n"),
        );
        expect(findStripeWebhookApiHostClaims(doc)).toHaveLength(0);
      });

      it("does NOT fire when a doc mentions only the secret name (not the host)", () => {
        const doc = syntheticDoc(
          "Server-only secrets (Stripe webhook signing, Resend API key) live in Supabase Edge Function secrets.",
        );
        expect(findStripeWebhookApiHostClaims(doc)).toHaveLength(0);
      });
    });
  });
});
