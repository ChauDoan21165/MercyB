#!/usr/bin/env node
/**
 * Weekly PR-template compliance report.
 *
 * Runs every Monday via .github/workflows/pr-template-weekly.yml.
 * Queries the last 7 days of merged PRs against main, scores each
 * one against the same rules as the per-PR observer, and writes a
 * rolling Markdown report to:
 *
 *   reports/PR-TEMPLATE-compliance-weekly.md
 *
 * The Phase-2 promote-to-hard-gate decision keys off the most
 * recent week's compliance % — once it crosses 80% with no false
 * positives, ship the Phase-2 PR (see baseline report).
 *
 * Inputs (GitHub Actions env):
 *   GITHUB_REPOSITORY — "owner/repo"
 *   GH_TOKEN          — for gh CLI
 *
 * Outputs:
 *   - reports/PR-TEMPLATE-compliance-weekly.md (overwritten each run with rolling history prepended)
 *   - exit 0 on success, 1 only if gh CLI / git are unreachable
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const REPORT_PATH = resolve(REPO_ROOT, 'reports/PR-TEMPLATE-compliance-weekly.md');

const WINDOW_DAYS = 7;

function isoDaysAgo(n) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

function fetchMergedPrs(repo, since) {
  // gh search prs is the only call here. Cap at 100 — MercyBlade
  // ships ~30–60 PRs/week, so this is comfortable headroom.
  const raw = execSync(
    `gh search prs --repo ${repo} --merged --merged-at '>=${since}' --limit 100 --json number,title,mergedAt,body,labels`,
    { encoding: 'utf8' },
  );
  return JSON.parse(raw);
}

function hasChecked(body, sectionRegex, blockEndRegex) {
  const start = body.search(sectionRegex);
  if (start === -1) return { found: false, checked: false };
  const tail = body.slice(start);
  const endRel = tail.slice(1).search(blockEndRegex);
  const block = endRel === -1 ? tail : tail.slice(0, endRel + 1);
  return { found: true, checked: /- \[[xX]\]/.test(block), block };
}

function score(pr) {
  const body = pr.body || '';
  const labels = (pr.labels || []).map((l) => l.name);
  const surface = hasChecked(body, /\*\*Surface\(s\) this PR ships to\*\*/i, /\*\*Verified by Chau\*\*/i);
  const verified = hasChecked(body, /\*\*Verified by Chau\*\*/i, /##\s|\*\*If tested/i);
  const nonNeg = hasChecked(body, /##\s+Five Non-Negotiables/i, /##\s/);

  const typeBlock = hasChecked(body, /##\s+Type of Change/i, /##\s/);
  const isBugFix =
    labels.some((l) => /bug|fix/i.test(l)) ||
    (typeBlock.found && /- \[[xX]\][^\n]*Bug fix/i.test(typeBlock.block));

  let diagnoseFilled = !isBugFix; // not required when not a bug fix
  if (isBugFix) {
    const start = body.search(/##\s+Diagnose-Before-Patching/i);
    if (start !== -1) {
      const tail = body.slice(start);
      const endRel = tail.slice(1).search(/##\s/);
      const block = endRel === -1 ? tail : tail.slice(0, endRel + 1);
      diagnoseFilled = block
        .split('\n')
        .some((l) => {
          if (!/\*\*(Symptom|Root cause|Fix)/i.test(l)) return false;
          const afterColon = l
            .split(':')
            .slice(1)
            .join(':')
            .replace(/^\s*\*\*\s*/, '')
            .trim();
          return afterColon && !/^<!--/.test(afterColon);
        });
    }
  }

  return {
    number: pr.number,
    title: pr.title,
    mergedAt: pr.mergedAt,
    isBugFix,
    surfaceDeclared: surface.checked,
    verifiedByChau: verified.checked,
    nonNegotiablesChecked: nonNeg.checked,
    diagnoseFilled,
    compliant: surface.checked && verified.checked && diagnoseFilled,
  };
}

function pct(n, total) {
  if (total === 0) return '—';
  return `${Math.round((n / total) * 100)}%`;
}

function renderReport(scored, since, generatedAt) {
  const total = scored.length;
  const compliant = scored.filter((s) => s.compliant).length;
  const surface = scored.filter((s) => s.surfaceDeclared).length;
  const verified = scored.filter((s) => s.verifiedByChau).length;
  const nonNeg = scored.filter((s) => s.nonNegotiablesChecked).length;
  const bugFixes = scored.filter((s) => s.isBugFix);
  const diagnosed = bugFixes.filter((s) => s.diagnoseFilled).length;

  const lines = [
    `# PR Template Compliance — week ending ${generatedAt}`,
    '',
    `Window: PRs merged since \`${since}\` (UTC). Run: ${generatedAt}.`,
    '',
    '## Headline',
    '',
    `- Merged PRs in window: **${total}**`,
    `- Fully compliant (surface + verified-by-Chau + diagnose-if-bugfix): **${compliant} / ${total} = ${pct(compliant, total)}**`,
    '',
    '## Per-gate breakdown',
    '',
    '| Gate | Filled | Total | % |',
    '|---|---|---|---|',
    `| Surface declared | ${surface} | ${total} | ${pct(surface, total)} |`,
    `| Verified by Chau | ${verified} | ${total} | ${pct(verified, total)} |`,
    `| Diagnose-before-patching (bug fixes only) | ${diagnosed} | ${bugFixes.length} | ${pct(diagnosed, bugFixes.length)} |`,
    `| Five non-negotiables checked | ${nonNeg} | ${total} | ${pct(nonNeg, total)} |`,
    '',
    '## Phase-2 readiness',
    '',
    compliant / Math.max(total, 1) >= 0.8
      ? `🟢 Compliance ≥ 80%. Eligible to flip the observer to a hard gate (Phase 2 dispatch in baseline report).`
      : `🟡 Compliance < 80%. Stay in observe mode for another week.`,
    '',
    '## Non-compliant PRs (this week)',
    '',
  ];

  const noncompliant = scored.filter((s) => !s.compliant);
  if (noncompliant.length === 0) {
    lines.push('_None — every merged PR cleared the template gates._');
  } else {
    for (const pr of noncompliant) {
      const missing = [];
      if (!pr.surfaceDeclared) missing.push('surface');
      if (!pr.verifiedByChau) missing.push('verified-by-Chau');
      if (pr.isBugFix && !pr.diagnoseFilled) missing.push('diagnose-block');
      lines.push(`- #${pr.number} _${pr.title}_ — missing: ${missing.join(', ')}`);
    }
  }
  lines.push('', '---', '');
  return lines.join('\n');
}

function main() {
  const repo = process.env.GITHUB_REPOSITORY;
  if (!repo) {
    console.error('GITHUB_REPOSITORY not set.');
    process.exit(1);
  }
  const since = isoDaysAgo(WINDOW_DAYS);
  const generatedAt = new Date().toISOString().slice(0, 10);

  const prs = fetchMergedPrs(repo, since);
  const scored = prs.map(score);
  const fresh = renderReport(scored, since, generatedAt);

  // Prepend the new week's section so the file is a rolling log,
  // newest first. Keep at most 13 weeks (~ a quarter).
  let prior = '';
  if (existsSync(REPORT_PATH)) {
    prior = readFileSync(REPORT_PATH, 'utf8');
    const sections = prior.split(/^# PR Template Compliance — week ending /m).filter(Boolean);
    const trimmed = sections.slice(0, 12).map((s) => `# PR Template Compliance — week ending ${s}`);
    prior = trimmed.join('');
  }
  writeFileSync(REPORT_PATH, fresh + prior, 'utf8');
  console.log(`Wrote ${REPORT_PATH} (${scored.length} PRs in window).`);
}

main();
