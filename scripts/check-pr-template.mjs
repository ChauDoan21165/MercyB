#!/usr/bin/env node
/**
 * PR template compliance observer — soft mode (Phase 1).
 *
 * Parses the PR body from $GITHUB_EVENT_PATH (no API call needed),
 * checks whether the operator filled in the gates the template asks
 * for (Surface, Verified-by-Chau, diagnose-before-patching when the
 * PR is a bug fix, five non-negotiables), and posts an informational
 * comment back on the PR.
 *
 * Phase 1 contract (this file): ALWAYS exit 0. The job name in the
 * workflow has "(observe)" appended and is NOT a required check.
 * The point is to gather data on whether the new gate (PR #890) is
 * actually being used before we flip it to a hard fail.
 *
 * Phase 2 (separate dispatch, separate PR): flip EXIT_ON_NONCOMPLIANT
 * to true once weekly compliance > 80%, drop "(observe)" from the
 * job name, and add to the required-checks ruleset.
 *
 * Tone rule (per dispatch brief): comments are HELPFUL, not punitive.
 * Heads-up phrasing, link to the template, no scolding.
 *
 * Inputs (GitHub Actions env):
 *   GITHUB_EVENT_PATH — JSON payload (pull_request event)
 *   GITHUB_REPOSITORY — "owner/repo"
 *   GH_TOKEN          — for gh CLI (provided by actions/checkout)
 *
 * Outputs:
 *   1. stdout: pretty JSON report
 *   2. PR comment with the same report (only when running in CI)
 *   3. 👍 reaction on PRs scoring 100%
 *   4. Always exit 0 in Phase 1
 */
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const EXIT_ON_NONCOMPLIANT = false; // Phase 1: observe only.
const COMMENT_MARKER = '<!-- pr-template-compliance-observer -->';

function readEvent() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) {
    throw new Error('GITHUB_EVENT_PATH not set — this script runs in GitHub Actions.');
  }
  return JSON.parse(readFileSync(eventPath, 'utf8'));
}

/**
 * The template uses GitHub-flavored checkboxes: `- [ ]` (unchecked)
 * and `- [x]` / `- [X]` (checked). A "filled-in" section means at
 * least one checkbox under that section was ticked.
 */
function hasCheckedBoxInSection(body, sectionRegex, blockEndRegex) {
  const start = body.search(sectionRegex);
  if (start === -1) return { found: false, checked: false };
  const tail = body.slice(start);
  const endRel = tail.slice(1).search(blockEndRegex);
  const block = endRel === -1 ? tail : tail.slice(0, endRel + 1);
  const checked = /- \[[xX]\]/.test(block);
  return { found: true, checked, block };
}

function isBugFix(body, labels) {
  if (labels.some((l) => /bug|fix/i.test(l))) return true;
  const typeBlock = hasCheckedBoxInSection(body, /##\s+Type of Change/i, /##\s/);
  if (!typeBlock.found) return false;
  return /- \[[xX]\][^\n]*Bug fix/i.test(typeBlock.block);
}

function checkSurface(body) {
  const result = hasCheckedBoxInSection(body, /\*\*Surface\(s\) this PR ships to\*\*/i, /\*\*Verified by Chau\*\*/i);
  return { present: result.found, checked: result.checked };
}

function checkVerifiedByChau(body) {
  const result = hasCheckedBoxInSection(body, /\*\*Verified by Chau\*\*/i, /##\s|\*\*If tested/i);
  return { present: result.found, checked: result.checked };
}

function checkDiagnoseBlock(body) {
  const start = body.search(/##\s+Diagnose-Before-Patching/i);
  if (start === -1) return { present: false, filled: false };
  const tail = body.slice(start);
  const endRel = tail.slice(1).search(/##\s/);
  const block = endRel === -1 ? tail : tail.slice(0, endRel + 1);
  // "Filled" = at least one of Symptom / Root cause / Fix has content
  // after the colon that isn't an HTML comment placeholder.
  const filledLines = block
    .split('\n')
    .filter((l) => /\*\*(Symptom|Root cause|Fix|Why this is)/i.test(l))
    .filter((l) => {
      // Strip the closing `**` of the bold label + surrounding whitespace,
      // then check what's left. A placeholder-only line is either empty
      // or starts with an HTML comment.
      const afterColon = l
        .split(':')
        .slice(1)
        .join(':')
        .replace(/^\s*\*\*\s*/, '')
        .trim();
      return afterColon && !/^<!--/.test(afterColon);
    });
  return { present: true, filled: filledLines.length >= 1 };
}

function checkNonNegotiables(body) {
  const result = hasCheckedBoxInSection(body, /##\s+Five Non-Negotiables/i, /##\s/);
  return { present: result.found, checked: result.checked };
}

function buildReport(pr) {
  const body = pr.body || '';
  const labels = (pr.labels || []).map((l) => l.name);
  const surface = checkSurface(body);
  const verified = checkVerifiedByChau(body);
  const bugFix = isBugFix(body, labels);
  const diagnose = checkDiagnoseBlock(body);
  const nonNeg = checkNonNegotiables(body);

  const missing = [];
  const warnings = [];

  if (!surface.present) missing.push('Surface(s) declaration section');
  else if (!surface.checked) missing.push('Surface(s) declaration — no box ticked');

  if (!verified.present) missing.push('Verified by Chau section');
  else if (!verified.checked) missing.push('Verified by Chau — no box ticked (one of ✅/⏸️/N-A required)');

  if (bugFix) {
    if (!diagnose.present) missing.push('Diagnose-Before-Patching block (required for bug fixes per PRINCIPLES §5)');
    else if (!diagnose.filled) warnings.push('Diagnose-Before-Patching block present but Symptom/Root cause/Fix are blank');
  }

  if (!nonNeg.present) warnings.push('Five Non-Negotiables checklist removed from template');

  // Surface declaration may be honestly "docs only" — in that case the
  // template line for it gets checked and Verified-by-Chau N/A is fine.
  // The compliance score doesn't penalize that path.

  return {
    pr_number: pr.number,
    title: pr.title,
    is_bug_fix: bugFix,
    compliant: missing.length === 0,
    missing_fields: missing,
    warnings,
  };
}

function renderComment(report) {
  const lines = [COMMENT_MARKER, '', '### PR Template Compliance — observation mode'];
  if (report.compliant) {
    lines.push('', '✅ Template gates look good. Thanks for filling them in — this is the discipline PRINCIPLES §3 codifies.', '');
  } else {
    lines.push('', 'Heads up — the template has a few gates that look unfilled. This check is **observational only** (Phase 1); nothing is failing CI. Sharing so the gate is visible early:', '');
    for (const item of report.missing_fields) {
      lines.push(`- ❗ ${item}`);
    }
    for (const item of report.warnings) {
      lines.push(`- ⚠️ ${item}`);
    }
    lines.push('', `Template lives at \`.github/PULL_REQUEST_TEMPLATE.md\`. Edit the PR description to fill in the missing pieces — no re-push needed.`, '');
  }
  lines.push('', `<sub>Compliance observer (A16-soft) — exits 0 in Phase 1. Score: ${report.compliant ? '100%' : `missing ${report.missing_fields.length}, ${report.warnings.length} warnings`}.</sub>`);
  return lines.join('\n');
}

function postComment(prNumber, body, repo) {
  // Replace any prior observer comment so the PR thread stays tidy.
  const listJson = execSync(`gh api repos/${repo}/issues/${prNumber}/comments --paginate`, { encoding: 'utf8' });
  const comments = JSON.parse(listJson);
  const prior = comments.find((c) => typeof c.body === 'string' && c.body.includes(COMMENT_MARKER));
  if (prior) {
    execSync(`gh api -X PATCH repos/${repo}/issues/comments/${prior.id} -f body=@-`, {
      input: body,
      stdio: ['pipe', 'inherit', 'inherit'],
    });
  } else {
    execSync(`gh pr comment ${prNumber} --body-file -`, {
      input: body,
      stdio: ['pipe', 'inherit', 'inherit'],
    });
  }
}

function postReaction(prNumber, repo) {
  try {
    execSync(`gh api -X POST repos/${repo}/issues/${prNumber}/reactions -f content=+1`, { stdio: 'ignore' });
  } catch {
    // Reactions are best-effort. Not a failure mode.
  }
}

function main() {
  const event = readEvent();
  const pr = event.pull_request;
  if (!pr) {
    console.error('No pull_request payload — bailing.');
    process.exit(0);
  }
  const repo = process.env.GITHUB_REPOSITORY;
  const report = buildReport(pr);
  console.log(JSON.stringify(report, null, 2));

  if (repo && process.env.GH_TOKEN) {
    const comment = renderComment(report);
    try {
      postComment(pr.number, comment, repo);
      if (report.compliant) postReaction(pr.number, repo);
    } catch (err) {
      console.error('Failed to post comment / reaction:', err.message);
    }
  }

  if (EXIT_ON_NONCOMPLIANT && !report.compliant) {
    process.exit(1);
  }
  process.exit(0);
}

main();
