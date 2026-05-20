#!/usr/bin/env tsx
import fs from "node:fs";
import path from "node:path";

import type {
  PlacementDataQualityIssue,
  PlacementDataQualityRun,
} from "../../src/types/placementDataQuality.js";
import { REPO_ROOT } from "./dataQualityAuditCore.js";

type ReviewStatus =
  | "pending"
  | "needs Chau review"
  | "needs linguist review"
  | "approved"
  | "rejected"
  | "deferred"
  | "blocked";

type ReviewPriority = "P0" | "P1" | "P2" | "informational";

type ReviewPacket = {
  id: string;
  sourceIssueId: string;
  issue: string;
  category:
    | "missing_remediation_link"
    | "conversation_calibration_gap"
    | "unused_taxonomy_disposition";
  priority: ReviewPriority;
  status: ReviewStatus;
  taxonomyId?: string;
  promptId?: string;
  file: string;
  evidence: Record<string, unknown>;
  owner: string;
  learnerImpact: string;
  releaseImpact: string;
  nextAction: string;
  reviewQuestion: string;
};

const DATA_QUALITY_DIR = path.join(REPO_ROOT, "docs/placement-v3/data-quality");
const RAW_RUN_DIR = path.join(DATA_QUALITY_DIR, "raw-runs");
const REVIEW_QUEUE_DIR = path.join(DATA_QUALITY_DIR, "review-queue");
const STATUS_FILE = path.join(DATA_QUALITY_DIR, "a3-review-status.md");
const PR_BODY_FILE = path.join(DATA_QUALITY_DIR, "PR_BODY.md");
const FINAL_REPORT_FILE = path.join(DATA_QUALITY_DIR, "a3-final-report.md");

const VALID_STATUSES: ReviewStatus[] = [
  "pending",
  "needs Chau review",
  "needs linguist review",
  "approved",
  "rejected",
  "deferred",
  "blocked",
];

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

function latestRunFile(suffix: string): string {
  const files = fs
    .readdirSync(RAW_RUN_DIR)
    .filter((file) => file.endsWith(`${suffix}.json`))
    .sort();
  const file = files.at(-1);
  if (!file) {
    throw new Error(`No raw run found for suffix ${suffix}`);
  }
  return path.join(RAW_RUN_DIR, file);
}

function tagFromIssue(issue: PlacementDataQualityIssue): string {
  const tag = issue.evidence?.tag;
  if (typeof tag === "string" && tag.length > 0) return tag;
  const match = issue.message.match(/(?:tag|id) ([A-Za-z0-9_-]+)/);
  return match?.[1] ?? issue.id;
}

function promptIdFromIssue(issue: PlacementDataQualityIssue): string {
  const id = issue.evidence?.id;
  if (typeof id === "string" && id.length > 0) return id;
  const match = issue.message.match(/Prompt ([A-Za-z0-9_-]+)/);
  return match?.[1] ?? issue.id;
}

function packetId(prefix: string, id: string): string {
  return `${prefix}:${id}`;
}

function readExistingStatuses(): Map<string, ReviewStatus> {
  if (!fs.existsSync(STATUS_FILE)) return new Map();
  const content = fs.readFileSync(STATUS_FILE, "utf8");
  const statuses = new Map<string, ReviewStatus>();
  for (const line of content.split("\n")) {
    const cells = line
      .split("|")
      .map((cell) => cell.trim())
      .filter(Boolean);
    if (cells.length < 3 || cells[0] === "Packet ID" || cells[0].startsWith("---")) continue;
    const status = cells[2] as ReviewStatus;
    if (VALID_STATUSES.includes(status)) {
      statuses.set(cells[0], status);
    }
  }
  return statuses;
}

function applyStatus(
  packet: Omit<ReviewPacket, "status">,
  existingStatuses: Map<string, ReviewStatus>,
  defaultStatus: ReviewStatus,
): ReviewPacket {
  return {
    ...packet,
    status: existingStatuses.get(packet.id) ?? defaultStatus,
  };
}

function buildPackets(existingStatuses: Map<string, ReviewStatus>): {
  packets: ReviewPacket[];
  sources: Record<string, string>;
} {
  const taxonomyFile = latestRunFile("taxonomy-consistency");
  const alignmentFile = latestRunFile("prompt-rubric-alignment");
  const taxonomyRun = readJson<PlacementDataQualityRun>(taxonomyFile);
  const alignmentRun = readJson<PlacementDataQualityRun>(alignmentFile);
  const packets: ReviewPacket[] = [];

  for (const issue of taxonomyRun.issues.filter((item) => item.category === "missing_remediation_link")) {
    const taxonomyId = tagFromIssue(issue);
    packets.push(
      applyStatus(
        {
          id: packetId("remediation", taxonomyId),
          sourceIssueId: issue.id,
          issue: issue.message,
          category: "missing_remediation_link",
          priority: "P1",
          taxonomyId,
          file: issue.file,
          evidence: issue.evidence ?? {},
          owner: "Placement V3 content owner; Chau final approval for learner-facing paths",
          learnerImpact: "Potentially high if a weak or incorrect room is surfaced as remediation.",
          releaseImpact: "Blocks production-safe remediation claims and broad automated remediation rollout.",
          nextAction: "Choose approved-room, detector-only, needs-new-room, or reject-link.",
          reviewQuestion: "Does an existing room directly remediate this Vietnamese-L1 pattern, or should the ID remain detector-only until a better room exists?",
        },
        existingStatuses,
        "needs linguist review",
      ),
    );
  }

  for (const issue of alignmentRun.issues.filter((item) => item.category === "orphaned_rubric_reference")) {
    const promptId = promptIdFromIssue(issue);
    packets.push(
      applyStatus(
        {
          id: packetId("conversation-calibration", promptId),
          sourceIssueId: issue.id,
          issue: issue.message,
          category: "conversation_calibration_gap",
          priority: "P1",
          promptId,
          file: issue.file,
          evidence: issue.evidence ?? {},
          owner: "Placement V3 assessment owner",
          learnerImpact: "Medium if conversation placement is scored without calibration evidence.",
          releaseImpact: "Blocks production-safe conversation calibration claims.",
          nextAction: "Decide whether conversation scoring is launch-scope; if yes, create reviewed calibration entries.",
          reviewQuestion: "What representative accepted, borderline, and weak learner responses should calibrate this prompt?",
        },
        existingStatuses,
        "needs linguist review",
      ),
    );
  }

  for (const issue of taxonomyRun.issues.filter((item) => item.category === "unused_taxonomy_category")) {
    const taxonomyId = tagFromIssue(issue);
    const isV3KnownId = taxonomyId === "negation-no-not-placement";
    packets.push(
      applyStatus(
        {
          id: packetId("taxonomy-disposition", taxonomyId),
          sourceIssueId: issue.id,
          issue: issue.message,
          category: "unused_taxonomy_disposition",
          priority: isV3KnownId ? "P2" : "informational",
          taxonomyId,
          file: issue.file,
          evidence: issue.evidence ?? {},
          owner: "Placement V3 taxonomy owner",
          learnerImpact: isV3KnownId
            ? "Low today; medium if expected to be active V3 prompt coverage."
            : "Low unless represented as active learner-facing coverage.",
          releaseImpact: isV3KnownId
            ? "Blocks clean full-coverage claims for the V3 L1 taxonomy."
            : "Blocks claims that every legacy taxonomy category is active.",
          nextAction: "Classify as runtime, detector-only, future-coverage, deprecated-candidate, or merge-candidate.",
          reviewQuestion: "Should this taxonomy ID be kept, wired into runtime coverage, marked detector-only/future, or deprecated?",
        },
        existingStatuses,
        isV3KnownId ? "needs Chau review" : "pending",
      ),
    );
  }

  packets.sort((a, b) => {
    const priorityOrder: Record<ReviewPriority, number> = { P0: 0, P1: 1, P2: 2, informational: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority] || a.id.localeCompare(b.id);
  });

  return {
    packets,
    sources: {
      taxonomyConsistency: path.relative(REPO_ROOT, taxonomyFile),
      promptRubricAlignment: path.relative(REPO_ROOT, alignmentFile),
    },
  };
}

function countBy<T extends string>(items: ReviewPacket[], key: (item: ReviewPacket) => T): Record<T, number> {
  const counts = {} as Record<T, number>;
  for (const item of items) {
    counts[key(item)] = (counts[key(item)] ?? 0) + 1;
  }
  return counts;
}

function markdownTable(items: ReviewPacket[]): string {
  const rows = [
    "| Packet ID | Priority | Status | Owner | Item | Next action |",
    "| --- | --- | --- | --- | --- | --- |",
  ];
  for (const item of items) {
    const subject = item.taxonomyId ?? item.promptId ?? item.id;
    rows.push(
      `| \`${item.id}\` | ${item.priority} | ${item.status} | ${item.owner} | \`${subject}\` | ${item.nextAction} |`,
    );
  }
  return rows.join("\n");
}

function writeMarkdownQueue(packets: ReviewPacket[], sources: Record<string, string>): void {
  const content = `# A3 Data-Quality Review Queue

Generated: ${new Date().toISOString()}

Sources:

- ${sources.taxonomyConsistency}
- ${sources.promptRubricAlignment}

## Counts

- Total review packets: ${packets.length}
- By priority: ${JSON.stringify(countBy(packets, (item) => item.priority))}
- By status: ${JSON.stringify(countBy(packets, (item) => item.status))}
- By category: ${JSON.stringify(countBy(packets, (item) => item.category))}

## Queue

${markdownTable(packets)}

## Guardrail

No packet is approved by automation. Approval requires expert review evidence.
`;
  fs.writeFileSync(path.join(REVIEW_QUEUE_DIR, "review-queue.md"), content);
}

function writeCategoryFile(fileName: string, title: string, packets: ReviewPacket[]): void {
  const content = `# ${title}

Generated: ${new Date().toISOString()}

${markdownTable(packets)}
`;
  fs.writeFileSync(path.join(REVIEW_QUEUE_DIR, fileName), content);
}

function writeStatusTracker(packets: ReviewPacket[]): void {
  const content = `# A3 Review Status

Generated by \`npm run placement:data-quality-review\`.

Allowed statuses: \`pending\`, \`needs Chau review\`, \`needs linguist review\`, \`approved\`, \`rejected\`, \`deferred\`, \`blocked\`.

Automation preserves existing statuses in this table, but never creates \`approved\` by itself.

${markdownTable(packets)}
`;
  fs.writeFileSync(STATUS_FILE, content);
}

function unsupportedProductionSafeClaims(): string[] {
  const files = [
    PR_BODY_FILE,
    FINAL_REPORT_FILE,
    path.join(DATA_QUALITY_DIR, "a3-launch-impact.md"),
    path.join(DATA_QUALITY_DIR, "a3-release-blocker-assessment.md"),
    path.join(DATA_QUALITY_DIR, "a3-unresolved-risk-matrix.md"),
  ].filter((file) => fs.existsSync(file));

  const unsupported: string[] = [];
  const allowed = [
    /does not claim/i,
    /do not claim/i,
    /does not declare/i,
    /no production-safe claim/i,
    /not production-safe/i,
    /blocks? .*production-safe/i,
    /release blocker for .*production-safe/i,
    /blocked .*production-safe/i,
    /Any claim .*production-safe/i,
    /prevent.*claim/i,
    /not sufficient/i,
    /No remaining item supports/i,
    /unsupported production-safe claims/i,
    /## Production-Safe\?/i,
    /claim: yes/i,
    /claim\./i,
    /claims\./i,
  ];

  for (const file of files) {
    const rel = path.relative(REPO_ROOT, file);
    const lines = fs.readFileSync(file, "utf8").split("\n");
    lines.forEach((line, index) => {
      if (!/production-safe|production safe/i.test(line)) return;
      if (allowed.some((pattern) => pattern.test(line))) return;
      unsupported.push(`${rel}:${index + 1}: ${line.trim()}`);
    });
  }
  return unsupported;
}

function main(): void {
  fs.mkdirSync(REVIEW_QUEUE_DIR, { recursive: true });
  const existingStatuses = readExistingStatuses();
  const { packets, sources } = buildPackets(existingStatuses);
  const productionSafeClaims = unsupportedProductionSafeClaims();
  if (productionSafeClaims.length > 0) {
    throw new Error(`Unsupported production-safe claims found:\n${productionSafeClaims.join("\n")}`);
  }

  const output = {
    generatedAt: new Date().toISOString(),
    sources,
    counts: {
      total: packets.length,
      byPriority: countBy(packets, (item) => item.priority),
      byStatus: countBy(packets, (item) => item.status),
      byCategory: countBy(packets, (item) => item.category),
    },
    guardrails: {
      productionSafeClaims: "No unsupported production-safe claims detected.",
      automationApproval: "Automation never marks packets approved without existing status evidence.",
    },
    packets,
  };

  fs.writeFileSync(path.join(REVIEW_QUEUE_DIR, "review-queue.json"), `${JSON.stringify(output, null, 2)}\n`);
  writeMarkdownQueue(packets, sources);
  writeCategoryFile(
    "remediation-link-review.md",
    "A3 Remediation Link Review",
    packets.filter((item) => item.category === "missing_remediation_link"),
  );
  writeCategoryFile(
    "conversation-calibration-review.md",
    "A3 Conversation Calibration Review",
    packets.filter((item) => item.category === "conversation_calibration_gap"),
  );
  writeCategoryFile(
    "unused-taxonomy-disposition.md",
    "A3 Unused Taxonomy Disposition",
    packets.filter((item) => item.category === "unused_taxonomy_disposition"),
  );
  writeStatusTracker(packets);

  console.log(`A3 review queue generated: ${packets.length} packets`);
  console.log(`By priority: ${JSON.stringify(output.counts.byPriority)}`);
  console.log(`By status: ${JSON.stringify(output.counts.byStatus)}`);
  console.log(`By category: ${JSON.stringify(output.counts.byCategory)}`);
}

main();
