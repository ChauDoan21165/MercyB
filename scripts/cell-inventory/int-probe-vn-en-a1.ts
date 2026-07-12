import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { correctWithTutorRules, type TutorCorrectionLanguage } from "../../src/lib/tutor/correctionEngine";
import { lessons } from "../../src/languages/vietnamese/lessons-a1";

type GoldenStatus = "corrected" | "unchanged" | "needs_ai";

type GoldenCase = {
  id: string;
  input: string;
  expectedStatus?: GoldenStatus;
  expectedCorrection: string;
  expectedRuleFired: string | null;
  expectedRulesFired?: string[];
  language?: TutorCorrectionLanguage;
};

type GoldenFixture = {
  rule: string;
  ruleId: string;
  language?: TutorCorrectionLanguage;
  positive: GoldenCase[];
};

type InventoryCell = {
  id: string;
  cell_type: string;
  source_object?: {
    lesson_id?: number;
    ordinal?: number;
    lesson_title_en?: string;
  };
  address_text?: string;
};

type Inventory = {
  metadata?: unknown;
  cells?: InventoryCell[];
  inventory?: InventoryCell[];
  items?: InventoryCell[];
};

type Token = {
  raw: string;
  key: string;
  leading: string;
  trailing: string;
};

type Transformation = {
  id: string;
  fixtureFile: string;
  fixtureRule: string;
  ruleId: string;
  expectedRuleIds: string[];
  caseId: string;
  rightText: string;
  wrongText: string;
  sourceRight: string;
  sourceWrong: string;
};

type Probe = {
  probe_id: string;
  transformation_id: string;
  fixture_file: string;
  fixture_case_id: string;
  rule_family: string;
  expected_rule_ids: string[];
  original: string;
  corrupted: string;
  engine_status: string;
  corrected: string;
  applied_rule_ids: string[];
  caught: boolean;
  rule_family_correct: boolean;
};

type CellReport = {
  cell_id: string;
  lesson_id: number;
  ordinal: number;
  lesson_title_en: string;
  english: string;
  probes_run: number;
  caught: number;
  rule_family_correct: number;
  coverage: "full" | "partial" | "blind" | "no_applicable_probes";
  probes: Probe[];
};

const ROOT = process.cwd();
const FIXTURE_DIR = path.join(ROOT, "tests/regression/golden-set/correction-rules");
const INVENTORY_PATH = path.join(ROOT, "reports/cell-inventory/vn-en-a1-inventory.json");
const JSON_OUT = path.join(ROOT, "reports/cell-inventory/int-probe-vn-en-a1.json");
const MD_OUT = path.join(ROOT, "reports/cell-inventory/int-probe-vn-en-a1.md");

function normalizeSpace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function stripTerminal(value: string): string {
  return normalizeSpace(value).replace(/[.!?]+$/u, "");
}

function tokenize(value: string): Token[] {
  return normalizeSpace(value)
    .split(" ")
    .filter(Boolean)
    .map((raw) => {
      const match = raw.match(/^([^A-Za-z0-9']*)(.*?)([^A-Za-z0-9']*)$/u);
      const leading = match?.[1] ?? "";
      const core = match?.[2] ?? raw;
      const trailing = match?.[3] ?? "";
      return { raw, key: core.toLowerCase(), leading, trailing };
    });
}

function expectedRuleIds(fixture: GoldenFixture, testCase: GoldenCase): string[] {
  if (testCase.expectedRulesFired?.length) return [...testCase.expectedRulesFired].sort();
  if (!testCase.expectedRuleFired || testCase.expectedRuleFired === fixture.rule) return [fixture.ruleId];
  return [testCase.expectedRuleFired];
}

function lcsTable(a: Token[], b: Token[]): number[][] {
  const table = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      table[i][j] = a[i].key === b[j].key ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  return table;
}

function changedSpans(wrong: Token[], right: Token[]): Array<{ wrongStart: number; wrongEnd: number; rightStart: number; rightEnd: number }> {
  const table = lcsTable(wrong, right);
  const spans: Array<{ wrongStart: number; wrongEnd: number; rightStart: number; rightEnd: number }> = [];
  let i = 0;
  let j = 0;
  let pending: { wrongStart: number; wrongEnd: number; rightStart: number; rightEnd: number } | null = null;

  const flush = () => {
    if (pending && (pending.wrongStart < pending.wrongEnd || pending.rightStart < pending.rightEnd)) {
      spans.push(pending);
    }
    pending = null;
  };

  const ensurePending = () => {
    pending ??= { wrongStart: i, wrongEnd: i, rightStart: j, rightEnd: j };
  };

  while (i < wrong.length || j < right.length) {
    if (i < wrong.length && j < right.length && wrong[i].key === right[j].key) {
      flush();
      i += 1;
      j += 1;
    } else if (j < right.length && (i === wrong.length || table[i][j + 1] >= table[i + 1][j])) {
      ensurePending();
      j += 1;
      pending!.rightEnd = j;
    } else if (i < wrong.length) {
      ensurePending();
      i += 1;
      pending!.wrongEnd = i;
    }
  }
  flush();
  return spans;
}

function tokensText(tokens: Token[]): string {
  return tokens.map((token) => token.raw).join(" ");
}

function buildTransformations(fixtures: Array<{ file: string; fixture: GoldenFixture }>): Transformation[] {
  const transformations = new Map<string, Transformation>();

  for (const { file, fixture } of fixtures) {
    for (const testCase of fixture.positive) {
      const language = testCase.language ?? fixture.language ?? "en";
      if (language !== "en") continue;

      const wrong = tokenize(stripTerminal(testCase.input));
      const right = tokenize(stripTerminal(testCase.expectedCorrection));
      const spans = changedSpans(wrong, right).filter((span) => span.wrongStart < span.wrongEnd || span.rightStart < span.rightEnd);
      if (spans.length !== 1 || spans[0].rightStart === spans[0].rightEnd) continue;

      const span = spans[0];
      const rightStart = Math.max(0, span.rightStart - 1);
      const rightEnd = Math.min(right.length, span.rightEnd + 1);
      const wrongStart = span.wrongStart > 0 && rightStart < span.rightStart ? span.wrongStart - 1 : span.wrongStart;
      const wrongEnd = span.wrongEnd < wrong.length && rightEnd > span.rightEnd ? span.wrongEnd + 1 : span.wrongEnd;
      const rightText = tokensText(right.slice(rightStart, rightEnd));
      const wrongText = tokensText(wrong.slice(wrongStart, wrongEnd));
      if (!rightText || rightText.toLowerCase() === wrongText.toLowerCase()) continue;

      const ids = expectedRuleIds(fixture, testCase);
      const key = `${fixture.ruleId}\t${rightText.toLowerCase()}\t${wrongText.toLowerCase()}`;
      if (transformations.has(key)) continue;

      transformations.set(key, {
        id: `tx-${transformations.size + 1}`,
        fixtureFile: file,
        fixtureRule: fixture.rule,
        ruleId: fixture.ruleId,
        expectedRuleIds: ids,
        caseId: testCase.id,
        rightText,
        wrongText,
        sourceRight: stripTerminal(testCase.expectedCorrection),
        sourceWrong: stripTerminal(testCase.input),
      });
    }
  }

  return [...transformations.values()].sort((a, b) =>
    `${a.ruleId}:${a.rightText}:${a.wrongText}`.localeCompare(`${b.ruleId}:${b.rightText}:${b.wrongText}`),
  );
}

function applyTransformation(sentence: string, transformation: Transformation): string | null {
  const tokens = tokenize(sentence);
  const pattern = tokenize(transformation.rightText);
  if (!pattern.length || pattern.length > tokens.length) return null;

  for (let i = 0; i <= tokens.length - pattern.length; i += 1) {
    const matches = pattern.every((token, offset) => token.key === tokens[i + offset].key);
    if (!matches) continue;

    const out = [...tokens];
    const wrongTokens = transformation.wrongText ? transformation.wrongText.split(" ") : [];
    const replacement = wrongTokens.map((raw, offset) => {
      if (offset === 0) return `${tokens[i].leading}${raw}`;
      if (offset === wrongTokens.length - 1) return `${raw}${tokens[i + pattern.length - 1].trailing}`;
      return raw;
    });
    if (replacement.length === 0 && i > 0) {
      out[i - 1] = { ...out[i - 1], raw: `${out[i - 1].raw}${tokens[i + pattern.length - 1].trailing}` };
    }
    out.splice(i, pattern.length, ...replacement.map((raw) => ({ raw, key: raw.toLowerCase(), leading: "", trailing: "" })));
    const corrupted = normalizeSpace(out.map((token) => token.raw).join(" "));
    if (corrupted && corrupted !== sentence) return corrupted;
  }

  return null;
}

function loadFixtures(): Array<{ file: string; fixture: GoldenFixture }> {
  return readdirSync(FIXTURE_DIR)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => ({ file, fixture: JSON.parse(readFileSync(path.join(FIXTURE_DIR, file), "utf8")) as GoldenFixture }))
    .filter(({ file, fixture }) => (fixture.language ?? "en") === "en" && !file.startsWith("zh-"));
}

function inventoryCells(value: unknown): InventoryCell[] {
  const found: InventoryCell[] = [];
  const visit = (node: unknown) => {
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    if (!node || typeof node !== "object") return;
    const record = node as Record<string, unknown>;
    if (record.cell_type === "Dialogue Turn" && typeof record.id === "string") {
      found.push(record as InventoryCell);
      return;
    }
    for (const child of Object.values(record)) visit(child);
  };
  visit(value as Inventory);
  return found.sort((a, b) => a.id.localeCompare(b.id));
}

function dialogueEnglishByAddress(): Map<string, { english: string; lessonTitle: string }> {
  const map = new Map<string, { english: string; lessonTitle: string }>();
  for (const lesson of lessons) {
    lesson.dialogue?.forEach((line, index) => {
      map.set(`${lesson.id}:${index + 1}`, { english: line.english, lessonTitle: lesson.title_en });
    });
  }
  return map;
}

function runSelfTest(fixtures: Array<{ file: string; fixture: GoldenFixture }>) {
  const cases = [];
  let passed = 0;
  let failed = 0;

  for (const { file, fixture } of fixtures) {
    for (const testCase of fixture.positive) {
      const language = testCase.language ?? fixture.language ?? "en";
      if (language !== "en") continue;
      const result = correctWithTutorRules(testCase.input, "en");
      const expected = expectedRuleIds(fixture, testCase);
      const ruleFamilyCorrect = expected.every((id) => result.appliedRuleIds.includes(id));
      const caught = result.status === "corrected" || result.status === "needs_ai";
      const ok = caught && ruleFamilyCorrect;
      if (ok) passed += 1;
      else failed += 1;
      cases.push({
        fixture_file: file,
        case_id: testCase.id,
        input: testCase.input,
        expected_rule_ids: expected,
        engine_status: result.status,
        applied_rule_ids: result.appliedRuleIds,
        caught,
        rule_family_correct: ruleFamilyCorrect,
        ok,
      });
    }
  }

  return {
    status: failed === 0 ? "passed" : "failed",
    passed,
    failed,
    cases,
  };
}

function probeCells(transformations: Transformation[]): CellReport[] {
  const inventory = JSON.parse(readFileSync(INVENTORY_PATH, "utf8")) as unknown;
  const cells = inventoryCells(inventory);
  const englishByAddress = dialogueEnglishByAddress();

  return cells.map((cell) => {
    const lessonId = cell.source_object?.lesson_id ?? -1;
    const ordinal = cell.source_object?.ordinal ?? -1;
    const mapped = englishByAddress.get(`${lessonId}:${ordinal}`);
    const english = mapped?.english ?? "";
    const probes: Probe[] = [];

    for (const transformation of transformations) {
      const corrupted = applyTransformation(english, transformation);
      if (!corrupted || corrupted === english) continue;

      const result = correctWithTutorRules(corrupted, "en");
      const caught = result.status === "corrected" || result.status === "needs_ai";
      const ruleFamilyCorrect = transformation.expectedRuleIds.every((id) => result.appliedRuleIds.includes(id));
      const probeIdSeed = `${cell.id}\t${transformation.id}\t${corrupted}`;
      probes.push({
        probe_id: createHash("sha1").update(probeIdSeed).digest("hex").slice(0, 12),
        transformation_id: transformation.id,
        fixture_file: transformation.fixtureFile,
        fixture_case_id: transformation.caseId,
        rule_family: transformation.ruleId,
        expected_rule_ids: transformation.expectedRuleIds,
        original: english,
        corrupted,
        engine_status: result.status,
        corrected: result.corrected,
        applied_rule_ids: result.appliedRuleIds,
        caught,
        rule_family_correct: ruleFamilyCorrect,
      });
    }

    const caughtCount = probes.filter((probe) => probe.caught).length;
    const familyCount = probes.filter((probe) => probe.rule_family_correct).length;
    const coverage =
      probes.length === 0
        ? "no_applicable_probes"
        : familyCount === probes.length
          ? "full"
          : familyCount === 0
            ? "blind"
            : "partial";

    return {
      cell_id: cell.id,
      lesson_id: lessonId,
      ordinal,
      lesson_title_en: mapped?.lessonTitle ?? cell.source_object?.lesson_title_en ?? "",
      english,
      probes_run: probes.length,
      caught: caughtCount,
      rule_family_correct: familyCount,
      coverage,
      probes: probes.sort((a, b) => a.probe_id.localeCompare(b.probe_id)),
    };
  });
}

function markdown(report: ReturnType<typeof buildReport>): string {
  const blindOrPartial = report.cells
    .filter((cell) => cell.coverage === "blind" || cell.coverage === "partial")
    .sort((a, b) => {
      const ar = a.probes_run === 0 ? 1 : a.rule_family_correct / a.probes_run;
      const br = b.probes_run === 0 ? 1 : b.rule_family_correct / b.probes_run;
      return ar - br || b.probes_run - a.probes_run || a.cell_id.localeCompare(b.cell_id);
    });

  const queueRows = blindOrPartial.flatMap((cell) =>
    cell.probes
      .filter((probe) => !probe.rule_family_correct)
      .map((probe) => ({ cell, probe })),
  );

  const lines = [
    "# INT Probe VN-EN A1",
    "",
    `Headline: ${report.summary.cells_full_covered} cells fully covered / ${report.summary.cells_partially_covered} partially / ${report.summary.cells_blind} blind.`,
    "",
    "## Self-Test Gate",
    "",
    `Status: ${report.self_test.status}`,
    `Cases passed: ${report.self_test.passed}`,
    `Cases failed: ${report.self_test.failed}`,
    "",
    "## Scope",
    "",
    `Dialogue Turn cells: ${report.summary.dialogue_turn_cells}`,
    `Fixture files used: ${report.summary.fixture_files_used}`,
    `Fixture-derived transformations: ${report.summary.transformations}`,
    `Total probes run: ${report.summary.total_probes_run}`,
    `Caught: ${report.summary.total_caught}`,
    `Rule-family-correct: ${report.summary.total_rule_family_correct}`,
    "",
    "Chinese (`zh-*`) fixtures were excluded from the VN-EN wedge probe. All included transformations come from English golden positives under `tests/regression/golden-set/correction-rules`.",
    "",
    "## Ranked Blind-Spot List",
    "",
  ];

  if (queueRows.length === 0) {
    lines.push("No blind spots among applicable fixture-derived corruptions.");
  } else {
    lines.push("| Rank | Cell | Lesson | Rule family | Corrupted sentence | Engine status | Applied rule ids |");
    lines.push("| ---: | --- | --- | --- | --- | --- | --- |");
    queueRows.slice(0, 100).forEach(({ cell, probe }, index) => {
      lines.push(
        `| ${index + 1} | ${cell.cell_id} | ${cell.lesson_title_en} | ${probe.rule_family} | ${probe.corrupted.replaceAll("|", "\\|")} | ${probe.engine_status} | ${probe.applied_rule_ids.join(", ") || "-"} |`,
      );
    });
  }

  lines.push("", "## Cell Coverage", "");
  lines.push("| Cell | English | Probes | Caught | Rule-family-correct | Coverage |");
  lines.push("| --- | --- | ---: | ---: | ---: | --- |");
  for (const cell of report.cells) {
    lines.push(
      `| ${cell.cell_id} | ${cell.english.replaceAll("|", "\\|")} | ${cell.probes_run} | ${cell.caught} | ${cell.rule_family_correct} | ${cell.coverage} |`,
    );
  }

  return `${lines.join("\n")}\n`;
}

function buildReport() {
  const fixtures = loadFixtures();
  const selfTest = runSelfTest(fixtures);
  if (selfTest.failed > 0) {
    return {
      metadata: {
        generated_by: "scripts/cell-inventory/int-probe-vn-en-a1.ts",
        deterministic: true,
        engine_entrypoint: "src/lib/tutor/correctionEngine.ts::correctWithTutorRules",
      },
      self_test: selfTest,
      summary: {
        dialogue_turn_cells: 0,
        fixture_files_used: fixtures.length,
        transformations: 0,
        total_probes_run: 0,
        total_caught: 0,
        total_rule_family_correct: 0,
        cells_full_covered: 0,
        cells_partially_covered: 0,
        cells_blind: 0,
        cells_no_applicable_probes: 0,
      },
      transformations: [],
      cells: [],
    };
  }

  const transformations = buildTransformations(fixtures);
  const cells = probeCells(transformations);
  const summary = {
    dialogue_turn_cells: cells.length,
    fixture_files_used: fixtures.length,
    transformations: transformations.length,
    total_probes_run: cells.reduce((sum, cell) => sum + cell.probes_run, 0),
    total_caught: cells.reduce((sum, cell) => sum + cell.caught, 0),
    total_rule_family_correct: cells.reduce((sum, cell) => sum + cell.rule_family_correct, 0),
    cells_full_covered: cells.filter((cell) => cell.coverage === "full").length,
    cells_partially_covered: cells.filter((cell) => cell.coverage === "partial").length,
    cells_blind: cells.filter((cell) => cell.coverage === "blind").length,
    cells_no_applicable_probes: cells.filter((cell) => cell.coverage === "no_applicable_probes").length,
  };

  return {
    metadata: {
      generated_by: "scripts/cell-inventory/int-probe-vn-en-a1.ts",
      deterministic: true,
      engine_entrypoint: "src/lib/tutor/correctionEngine.ts::correctWithTutorRules",
      source_inventory: "reports/cell-inventory/vn-en-a1-inventory.json",
      fixture_source: "tests/regression/golden-set/correction-rules/*.json",
      src_policy: "src/** imported only; no correction logic reimplemented",
    },
    self_test: selfTest,
    summary,
    transformations,
    cells,
  };
}

const report = buildReport();
writeFileSync(JSON_OUT, `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(MD_OUT, markdown(report));

if (report.self_test.status !== "passed") {
  console.error(`Self-test gate failed: ${report.self_test.failed} failing cases. Wrote ${JSON_OUT}`);
  process.exit(1);
}

console.log(`Wrote ${JSON_OUT}`);
console.log(`Wrote ${MD_OUT}`);
