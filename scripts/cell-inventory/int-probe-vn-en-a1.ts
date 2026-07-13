import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { correctWithTutorRules, type TutorCorrectionLanguage } from "../../src/lib/tutor/correctionEngine";
import { lessons } from "../../src/languages/vietnamese/lessons-a1";

type GoldenCase = {
  id: string;
  input: string;
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
type FixtureFamily = {
  order: number;
  ruleId: string;
  fixtureFiles: string[];
  fixtureRule: string;
  expectedRuleIds: string[];
  sampleCaseId: string;
  sampleWrong: string;
  sampleRight: string;
};
type InventoryCell = {
  id: string;
  address_hash?: string;
  cell_type: string;
  source_object?: { lesson_id?: number; ordinal?: number; lesson_title_en?: string };
};
type Probe = {
  probe_id: string;
  cell_id: string;
  rule_family: string;
  fixture_files: string[];
  fixture_case_id: string;
  expected_rule_ids: string[];
  corruption_basis: { wrong: string; right: string };
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
  address_hash: string;
  lesson_id: number;
  ordinal: number;
  lesson_title_en: string;
  english: string;
  probes_run: number;
  caught: number;
  rule_family_correct: number;
  coverage: "measured-covered" | "measured-blind" | "unmeasured";
  probes: Probe[];
};

const ROOT = process.cwd();
const FIXTURE_DIR = path.join(ROOT, "tests/regression/golden-set/correction-rules");
const INVENTORY_PATH = path.join(ROOT, "reports/cell-inventory/vn-en-a1-inventory.json");
const JSON_OUT = path.join(ROOT, "reports/cell-inventory/int-probe-vn-en-a1.json");
const MD_OUT = path.join(ROOT, "reports/cell-inventory/int-probe-vn-en-a1.md");

const SUBJECT = String.raw`(?:I|You|We|They|He|She|It|This|That|There|My [a-z]+|Your [a-z]+|The [a-z]+|A [a-z]+|An [a-z]+|[A-Z][a-z]+)`;
const ADJ = String.raw`(?:happy|sad|tired|busy|sick|lost|free|late|ready|fine|good|bad|hot|cold|nice|crowded|fun|broken|included|charged|spicy|vegetarian|expensive|okay|nearby|available|stable|cheaper|stronger|easier|better|quiet|convenient|suitable|clear|unclear|high|low|open|closed|new|old|right|wrong)`;
const PLACE = String.raw`(?:home|here|there|school|work|Canada|Vietnam|the room|the house|the office|the market|the hospital|the bathroom|the gate|the center|the bank|the clinic|the hotel)`;
const PROFESSIONS = String.raw`(?:artist|doctor|driver|engineer|farmer|lawyer|nurse|student|teacher|writer|repair person)`;
const COUNT_NOUNS = String.raw`(?:apple|bicycle|book|hat|orange|student|teacher|bag|card|receipt|menu|address|map|phone|hospital|room|table|ticket|gift|friend|plan|document|network|password|sore throat|stomachache|SIM card|temporary residence card)`;
const PLURALS = String.raw`(?:apples|books|hats|lessons|oranges|students|words|documents|days|weeks|months|years|minutes|pills|photos|mistakes|options|plans|cards)`;
const PRONOUN_OBJECT = String.raw`(?:me|you|him|her|us|them|it)`;

function normalizeSpace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function stripTerminal(value: string): string {
  return normalizeSpace(value).replace(/[.!?]+$/u, "");
}

function capLike(source: string, replacement: string): string {
  return /^[A-Z]/.test(source) ? `${replacement.charAt(0).toUpperCase()}${replacement.slice(1)}` : replacement;
}

function capFirst(value: string): string {
  const trimmed = value.trim();
  return trimmed ? `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}` : trimmed;
}

function replaceOne(sentence: string, pattern: RegExp, replacer: (...args: string[]) => string): string[] {
  if (!pattern.test(sentence)) return [];
  pattern.lastIndex = 0;
  const out = sentence.replace(pattern, (...args) => replacer(...(args as string[])));
  return out === sentence ? [] : [out];
}

function singular(word: string): string {
  return word.replace(/ies$/i, "y").replace(/s$/i, "");
}

function basePastVerb(word: string): string {
  const irregular: Record<string, string> = { went: "go", bought: "buy", ate: "eat", did: "do", had: "have", came: "come", saw: "see", took: "take", made: "make", paid: "pay", said: "say", told: "tell", wrote: "write", met: "meet", was: "is", were: "are" };
  const lower = word.toLowerCase();
  if (irregular[lower]) return capLike(word, irregular[lower]);
  if (/ied$/i.test(word)) return word.replace(/ied$/i, "y");
  if (/ed$/i.test(word)) return word.replace(/ed$/i, "");
  return word;
}

function expectedRuleIds(fixture: GoldenFixture, testCase: GoldenCase): string[] {
  if (testCase.expectedRulesFired?.length) return [...testCase.expectedRulesFired].sort();
  if (!testCase.expectedRuleFired || testCase.expectedRuleFired === fixture.rule) return [fixture.ruleId];
  return [testCase.expectedRuleFired];
}

function loadFixtures(): Array<{ file: string; fixture: GoldenFixture }> {
  return readdirSync(FIXTURE_DIR)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => ({ file, fixture: JSON.parse(readFileSync(path.join(FIXTURE_DIR, file), "utf8")) as GoldenFixture }))
    .filter(({ file, fixture }) => (fixture.language ?? "en") === "en" && !file.startsWith("zh-"));
}

function fixtureFamilies(fixtures: Array<{ file: string; fixture: GoldenFixture }>): FixtureFamily[] {
  const families = new Map<string, FixtureFamily>();
  fixtures.forEach(({ file, fixture }, order) => {
    const first = fixture.positive.find((testCase) => (testCase.language ?? fixture.language ?? "en") === "en");
    if (!first) return;
    const family = families.get(fixture.ruleId);
    if (family) {
      family.fixtureFiles.push(file);
      return;
    }
    families.set(fixture.ruleId, {
      order,
      ruleId: fixture.ruleId,
      fixtureFiles: [file],
      fixtureRule: fixture.rule,
      expectedRuleIds: expectedRuleIds(fixture, first),
      sampleCaseId: first.id,
      sampleWrong: first.input,
      sampleRight: first.expectedCorrection,
    });
  });
  return [...families.values()].sort((a, b) => a.order - b.order);
}

function inventoryCells(value: unknown): InventoryCell[] {
  const found: InventoryCell[] = [];
  const visit = (node: unknown) => {
    if (Array.isArray(node)) return node.forEach(visit);
    if (!node || typeof node !== "object") return;
    const record = node as Record<string, unknown>;
    if (record.cell_type === "Dialogue Turn" && typeof record.id === "string") found.push(record as InventoryCell);
    else Object.values(record).forEach(visit);
  };
  visit(value);
  return found.sort((a, b) => (a.address_hash ?? a.id).localeCompare(b.address_hash ?? b.id));
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

type Applicator = (sentence: string) => string[];
const applicators: Record<string, Applicator> = {
  "en-vn-although-even-though-but": (s) => replaceOne(s, /\b(Although|Even though)\b([^,.!?]+),?\s+([^.!?]+)/i, (_m, lead, clause, main) => `${lead}${clause}, but ${main}`),
  "en-vn-because-so-doubling": (s) => replaceOne(s, /\bBecause\b([^,.!?]+),?\s+([^.!?]+)/i, (_m, clause, main) => `Because${clause}, so ${main}`),
  "en-step6-at-clock-time": (s) => replaceOne(s, /\bat\s+((?:\d{1,2}(?::\d{2})?|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)(?:\s*(?:a\.m\.|p\.m\.|AM|PM|o'clock))?)/i, (_m, time) => time),
  "en-be-verb-omission": (s) => replaceOne(s, new RegExp(String.raw`\b(${SUBJECT})\s+(?:am|is|are|'m|'re|'s)\s+(very|so|really|quite|pretty|a little)\s+(${ADJ})\b`, "i"), (_m, subj, degree, adj) => `${subj} ${degree} ${adj}`),
  "en-vn-copula-be-adjective": (s) => replaceOne(s, new RegExp(String.raw`\b(${SUBJECT})\s+(?:am|is|are|'m|'re|'s)\s+(${ADJ})\b`, "i"), (_m, subj, adj) => `${subj} ${adj}`),
  "en-step6-location-be-drop": (s) => replaceOne(s, new RegExp(String.raw`\b(${SUBJECT})\s+(?:am|is|are|'m|'re|'s)\s+((?:at|in|near|from|on)\s+${PLACE})\b`, "i"), (_m, subj, loc) => `${subj} ${loc}`),
  "en-step6-possessive-s": (s) => replaceOne(s, /\b(mother|father|brother|sister|friend|teacher|boss|wife|husband)'s\s+(car|phone|house|room|bag|book|computer|bicycle|bike|office|job|name)\b/i, (_m, owner, object) => `${owner} ${object}`),
  "en-step5-subject-verb-agreement": (s) => replaceOne(s, /\b(He|She|It|This|That|My [a-z]+|The [a-z]+)\s+(goes|works|makes|has|eats|likes|needs|wants|does)\b/i, (_m, subj, verb) => `${subj} ${basePastVerb(verb.replace(/es$/i, "").replace(/s$/i, ""))}`),
  "en-step5-preposition-pattern": (s) => replaceOne(s, /\b(go|goes|going|went|take|takes|taking|took)\s+to\s+(school|work|the market|the hospital|this hotel|this address|the center)\b/i, (_m, verb, obj) => `${verb} ${obj}`),
  "en-step6-wait-for-person-object": (s) => replaceOne(s, new RegExp(String.raw`\b(wait|waits|waited|waiting)\s+for\s+(${PRONOUN_OBJECT})\b`, "i"), (_m, verb, obj) => `${verb} ${obj}`),
  "en-step6-listen-to-object": (s) => replaceOne(s, /\b(listen|listens|listened|listening)\s+to\s+([a-z]+)\b/i, (_m, verb, obj) => `${verb} ${obj}`),
  "en-step6-look-at-pronoun": (s) => replaceOne(s, new RegExp(String.raw`\b(look|looks|looked|looking)\s+at\s+(${PRONOUN_OBJECT})\b`, "i"), (_m, verb, obj) => `${verb} ${obj}`),
  "en-calque-open-turn-on-appliance": (s) => replaceOne(s, /\b(turn|turns|turned|turning)\s+on\s+the\s+(TV|television|light|radio|fan|air conditioner|power|Wi-Fi)\b/i, (_m, verb, obj) => `${capLike(verb, verb.toLowerCase().startsWith("turn") && /ed$/i.test(verb) ? "opened" : "open")} the ${obj}`),
  "en-calque-close-turn-off-appliance": (s) => replaceOne(s, /\b(turn|turns|turned|turning)\s+off\s+the\s+(TV|television|light|radio|fan|air conditioner|power|Wi-Fi)\b/i, (_m, verb, obj) => `${capLike(verb, verb.toLowerCase().startsWith("turn") && /ed$/i.test(verb) ? "closed" : "close")} the ${obj}`),
  "en-calque-take-medicine": (s) => replaceOne(s, /\b(take|takes|took|taking)\s+(medicine|pills|antibiotics|mild medicine)\b/i, (_m, _verb, obj) => `drink ${obj}`),
  "en-calque-say-with-person": (s) => replaceOne(s, new RegExp(String.raw`\b(say|says|said|speak|speaks|spoke|talk|talks|talked)\s+(?:to|with)\s+(${PRONOUN_OBJECT})\b`, "i"), (_m, verb, obj) => `${verb} with ${obj}`),
  "en-step6-discuss-about": (s) => replaceOne(s, /\b(discuss|discusses|discussed|discussing)\s+([a-z][^.!?]+)/i, (_m, verb, obj) => `${verb} about ${obj}`),
  "en-step6-marry-with": (s) => replaceOne(s, new RegExp(String.raw`\b(marry|marries|married|marrying)\s+(${PRONOUN_OBJECT})\b`, "i"), (_m, verb, obj) => `${verb} with ${obj}`),
  "en-yesterday-irregular-beginner-past": (s) => /(?:yesterday|last|ago|then)/i.test(s) ? replaceOne(s, /\b(went|bought|ate|did|had|came|saw|took|made|paid|met)\b/i, (_m, verb) => basePastVerb(verb)) : [],
  "en-vn-past-marker-regular-verb": (s) => /(?:yesterday|last|ago|then|in \d{4})/i.test(s) ? replaceOne(s, /\b(worked|watched|played|moved|studied|called|cleaned|finished|helped|invited|learned|started|talked|visited|walked)\b/i, (_m, verb) => basePastVerb(verb)) : [],
  "en-step6-past-marker-recall": (s) => /(?:yesterday|last|ago|then|in \d{4})/i.test(s) ? replaceOne(s, /\b(went|ate|moved)\b/i, (_m, verb) => basePastVerb(verb)) : [],
  "en-time-expression-placement": (s) => replaceOne(s, /\b(I|He|She|We|They)\s+([^.!?]+?)\s+(yesterday|last night|last week|last summer)\b/i, (_m, subj, body, time) => `${subj} ${time} ${body}`),
  "en-step6-in-month-year": (s) => replaceOne(s, /\bin\s+((?:19|20)\d{2}|January|February|March|April|May|June|July|August|September|October|November|December)\b/i, (_m, date) => date),
  "en-step6-profession-article": (s) => replaceOne(s, new RegExp(String.raw`\b((?:am|is|are|'m|'re|'s))\s+(?:a|an)\s+(${PROFESSIONS})\b`, "i"), (_m, be, job) => `${be} ${job}`),
  "en-l4-missing-singular-article": (s) => replaceOne(s, new RegExp(String.raw`\b(want|wants|wanted|need|needs|needed|buy|buys|bought|have|has|had|call|send|show|bring|get|see|try|choose)\s+(?:a|an)\s+(${COUNT_NOUNS})\b`, "i"), (_m, verb, noun) => `${verb} ${noun}`),
  "en-vn-numeral-quantifier-plural": (s) => replaceOne(s, new RegExp(String.raw`\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|many|a few|some|all)\s+(${PLURALS})\b`, "i"), (_m, q, noun) => `${q} ${singular(noun)}`),
  "en-l4-quantity-plural-s": (s) => replaceOne(s, new RegExp(String.raw`\b(two|three|four|five|six|seven|eight|nine|ten|many|a few|some)\s+(${PLURALS})\b`, "i"), (_m, q, noun) => `${q} ${singular(noun)}`),
  "en-l4-topic-comment-word-order": (s) => replaceOne(s, /\bI\s+(like|want|need|study|choose)\s+(this|that|English|Vietnamese|coffee|it|this one)\b/i, (_m, verb, obj) => `${obj} I ${verb}`),
  "en-existential-have-there-is": (s) => replaceOne(s, /\bThere\s+(is|are)\s+([^.!?]+)/i, (_m, _be, rest) => `Here have ${rest}`),
  "en-step6-enter-concrete-place": (s) => replaceOne(s, /\b(enter|enters|entered|entering)\s+(the\s+(?:room|house|office|bank|clinic|hotel|bathroom))\b/i, (_m, verb, place) => `${verb} to ${place}`),
  "en-third-person-daily-go-eat-have": (s) => /every day|usually|often|on weekends/i.test(s) ? replaceOne(s, /\b(He|She|It)\s+(eats|goes|has)\b/i, (_m, subj, verb) => `${subj} ${verb.replace(/es$/i, "").replace(/s$/i, "")}`) : [],
  "en-third-person-school-routine": (s) => replaceOne(s, /\b(He|She)\s+goes\s+to\s+school\b/i, (_m, subj) => `${subj} go to school`),
  "en-vn-yesno-do-support": (s) => replaceOne(s, /^(Do|Does|Did|Can|Could|Will|Would|Is|Are|Have|Has)\s+([^?]+)\?/i, (_m, _aux, body) => `${capFirst(body)}?`),
  "en-vietlish-collocation-take-photo": (s) => replaceOne(s, /\b(take|takes|took|taking)\s+(a\s+photo|photos|a\s+picture|pictures)\b/i, (_m, _verb, obj) => `make ${obj}`),
  "en-vietlish-collocation-make-mistake": (s) => replaceOne(s, /\b(make|makes|made|making)\s+(a\s+mistake|mistakes)\b/i, (_m, _verb, obj) => `do ${obj}`),
  "en-vietlish-collocation-do-homework": (s) => replaceOne(s, /\b(do|does|did|doing)\s+(my|your|his|her|our|their)?\s*homework\b/i, (_m, _verb, poss = "") => `make ${poss} homework`),
  "en-vietlish-mention-about": (s) => replaceOne(s, /\b(mention|mentions|mentioned|mentioning)\s+([^.!?]+)/i, (_m, verb, obj) => `${verb} about ${obj}`),
  "en-vietlish-contact-with": (s) => replaceOne(s, new RegExp(String.raw`\b(contact|contacts|contacted|contacting)\s+(${PRONOUN_OBJECT})\b`, "i"), (_m, verb, obj) => `${verb} with ${obj}`),
  "en-vietlish-phone-text-to": (s) => replaceOne(s, new RegExp(String.raw`\b(text|texts|texted|phone|phones|phoned|call|calls|called)\s+(${PRONOUN_OBJECT})\b`, "i"), (_m, verb, obj) => `${verb} to ${obj}`),
  "en-vietlish-discourse-according-to-me": (s) => replaceOne(s, /\bIn my opinion\b/i, () => "According to me"),
  "en-vietlish-discourse-reason-is-because": (s) => replaceOne(s, /\b(The reason (?:is|was)) that\b/i, (_m, lead) => `${lead} because`),
  "en-vietlish-be-agree": (s) => replaceOne(s, /\b(I|We|You|They)\s+agree\b/i, (_m, subj) => `${subj} am agree`),
  "en-vietlish-explain-to-me": (s) => replaceOne(s, /\b(explain|explains|explained|explaining)\s+([^.!?]+)\s+to\s+me\b/i, (_m, verb, obj) => `${verb} me ${obj}`),
  "en-vietlish-research-about": (s) => replaceOne(s, /\b(research|researches|researched|researching)\s+([^.!?]+)/i, (_m, verb, obj) => `${verb} about ${obj}`),
  "en-vietlish-go-home": (s) => replaceOne(s, /\b(go|goes|going|went)\s+home\b/i, (_m, verb) => `${verb} to home`),
  "en-vietlish-very-like": (s) => replaceOne(s, /\b(really)\s+(like|likes|liked)\b/i, (_m, _adv, verb) => `very ${verb}`),
  "en-vietlish-duration-since-for": (s) => replaceOne(s, /\bfor\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+(years?|months?|weeks?|days?)\b/i, (_m, n, unit) => `since ${n} ${unit}`),
  "en-vietlish-double-comparative": (s) => replaceOne(s, /\b(better|easier|faster|cheaper|stronger|closer)\b/i, (_m, adj) => `more ${adj}`),
  "en-vietlish-say-tell-person": (s) => replaceOne(s, new RegExp(String.raw`\b(tell|tells|told)\s+(${PRONOUN_OBJECT})\s+([^.!?]+)`, "i"), (_m, _verb, obj, rest) => `say ${obj} ${rest}`),
  "en-vietlish-age-have-be": (s) => replaceOne(s, /\b(I|You|We|They|He|She|It)\s+(?:am|are|is|'m|'re|'s)\s+(\d+)\s+years?\s+old\b/i, (_m, subj, n) => `${subj} have ${n} years old`),
  "en-vietlish-very-verb-really": (s) => replaceOne(s, /\breally\s+(want|wants|need|needs|love|loves)\b/i, (_m, verb) => `very ${verb}`),
  "en-vietlish-double-superlative-most-est": (s) => replaceOne(s, /\bthe\s+(biggest|tallest|fastest|cheapest|strongest|easiest)\b/i, (_m, adj) => `the most ${adj}`),
  "en-question-form-final-mark": (s) => /^(?:What|Where|When|Why|How|Can|Could|Would|Will|Do|Does|Did|Is|Are|Have|Has)\b/i.test(s) && /\?$/.test(s) ? [s.replace(/\?$/, "")] : [],
};

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
      cases.push({ fixture_file: file, case_id: testCase.id, input: testCase.input, expected_rule_ids: expected, engine_status: result.status, applied_rule_ids: result.appliedRuleIds, caught, rule_family_correct: ruleFamilyCorrect, ok });
    }
  }
  return { status: failed === 0 ? "passed" : "failed", passed, failed, cases };
}

function probeCells(families: FixtureFamily[]): CellReport[] {
  const inventory = JSON.parse(readFileSync(INVENTORY_PATH, "utf8")) as unknown;
  const cells = inventoryCells(inventory);
  const englishByAddress = dialogueEnglishByAddress();
  return cells.map((cell) => {
    const lessonId = cell.source_object?.lesson_id ?? -1;
    const ordinal = cell.source_object?.ordinal ?? -1;
    const mapped = englishByAddress.get(`${lessonId}:${ordinal}`);
    const english = mapped?.english ?? "";
    const probes: Probe[] = [];
    for (const family of families) {
      const apply = applicators[family.ruleId];
      if (!apply) continue;
      const corruptions = [...new Set(apply(english).map(normalizeSpace).filter((c) => c && c !== english))].sort();
      for (const corrupted of corruptions) {
        const result = correctWithTutorRules(corrupted, "en");
        const caught = result.status === "corrected" || result.status === "needs_ai";
        const ruleFamilyCorrect = family.expectedRuleIds.every((id) => result.appliedRuleIds.includes(id));
        probes.push({
          probe_id: createHash("sha1").update(`${cell.id}\t${family.ruleId}\t${corrupted}`).digest("hex").slice(0, 12),
          cell_id: cell.id,
          rule_family: family.ruleId,
          fixture_files: family.fixtureFiles,
          fixture_case_id: family.sampleCaseId,
          expected_rule_ids: family.expectedRuleIds,
          corruption_basis: { wrong: family.sampleWrong, right: family.sampleRight },
          original: english,
          corrupted,
          engine_status: result.status,
          corrected: result.corrected,
          applied_rule_ids: result.appliedRuleIds,
          caught,
          rule_family_correct: ruleFamilyCorrect,
        });
      }
    }
    probes.sort((a, b) => a.rule_family.localeCompare(b.rule_family) || a.corrupted.localeCompare(b.corrupted));
    const ruleFamilyCorrect = probes.filter((probe) => probe.rule_family_correct).length;
    const coverage = probes.length === 0 ? "unmeasured" : ruleFamilyCorrect === probes.length ? "measured-covered" : "measured-blind";
    return {
      cell_id: cell.id,
      address_hash: cell.address_hash ?? "",
      lesson_id: lessonId,
      ordinal,
      lesson_title_en: mapped?.lessonTitle ?? cell.source_object?.lesson_title_en ?? "",
      english,
      probes_run: probes.length,
      caught: probes.filter((probe) => probe.caught).length,
      rule_family_correct: ruleFamilyCorrect,
      coverage,
      probes,
    };
  });
}

function familyCounts(families: FixtureFamily[], cells: CellReport[]) {
  return families.map((family) => {
    const probes = cells.flatMap((cell) => cell.probes.filter((probe) => probe.rule_family === family.ruleId));
    const measuredCells = new Set(probes.map((probe) => probe.cell_id));
    return {
      rule_family: family.ruleId,
      fixture_files: family.fixtureFiles,
      applicable_probes: probes.length,
      applicable_cells: measuredCells.size,
      caught: probes.filter((probe) => probe.caught).length,
      rule_family_correct: probes.filter((probe) => probe.rule_family_correct).length,
      blind_probes: probes.filter((probe) => !probe.rule_family_correct).length,
      structural_detector: applicators[family.ruleId] ? "implemented" : "not_applicable_in_v2",
    };
  });
}

function markdown(report: ReturnType<typeof buildReport>): string {
  const familyOrder = new Map(report.families.map((family, index) => [family.rule_family, index]));
  const blind = report.cells
    .flatMap((cell) => cell.probes.filter((probe) => !probe.rule_family_correct).map((probe) => ({ cell, probe })))
    .sort((a, b) => a.cell.lesson_id - b.cell.lesson_id || a.cell.ordinal - b.cell.ordinal || (familyOrder.get(a.probe.rule_family) ?? 999) - (familyOrder.get(b.probe.rule_family) ?? 999) || a.probe.corrupted.localeCompare(b.probe.corrupted));
  const lines = [
    "# INT Probe VN-EN A1",
    "",
    `Headline: ${report.summary.measured_covered} measured-covered / ${report.summary.measured_blind} measured-blind / ${report.summary.unmeasured} unmeasured.`,
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
    `Fixture families: ${report.summary.fixture_families}`,
    `Fixture files used: ${report.summary.fixture_files_used}`,
    `Total probes run: ${report.summary.total_probes_run}`,
    `Caught: ${report.summary.total_caught}`,
    `Rule-family-correct: ${report.summary.total_rule_family_correct}`,
    "",
    "Chinese (`zh-*`) fixtures were excluded from the VN-EN wedge probe. Applicability is structural per golden-set family; corruptions stay anchored to each family's wrong/right fixture transformation.",
    "",
    "## Per-Family Applicability",
    "",
    "| Rule family | Applicable cells | Probes | Caught | Rule-family-correct | Blind probes | Detector |",
    "| --- | ---: | ---: | ---: | ---: | ---: | --- |",
  ];
  for (const family of report.families) {
    lines.push(`| ${family.rule_family} | ${family.applicable_cells} | ${family.applicable_probes} | ${family.caught} | ${family.rule_family_correct} | ${family.blind_probes} | ${family.structural_detector} |`);
  }
  lines.push("", "## Top-20 Blind List", "");
  if (blind.length === 0) {
    lines.push("No blind probes among measured cells.");
  } else {
    lines.push("| Rank | Cell | Lesson | Rule family | Corrupted sentence | Engine status | Applied rule ids |");
    lines.push("| ---: | --- | --- | --- | --- | --- | --- |");
    blind.slice(0, 20).forEach(({ cell, probe }, index) => {
      lines.push(`| ${index + 1} | ${cell.cell_id} | ${cell.lesson_title_en} | ${probe.rule_family} | ${probe.corrupted.replaceAll("|", "\\|")} | ${probe.engine_status} | ${probe.applied_rule_ids.join(", ") || "-"} |`);
    });
  }
  lines.push("", "## Cell Coverage", "");
  lines.push("| Cell | Address hash | English | Probes | Caught | Rule-family-correct | Coverage |");
  lines.push("| --- | --- | --- | ---: | ---: | ---: | --- |");
  for (const cell of report.cells) {
    lines.push(`| ${cell.cell_id} | ${cell.address_hash} | ${cell.english.replaceAll("|", "\\|")} | ${cell.probes_run} | ${cell.caught} | ${cell.rule_family_correct} | ${cell.coverage} |`);
  }
  return `${lines.join("\n")}\n`;
}

function buildReport() {
  const fixtures = loadFixtures();
  const selfTest = runSelfTest(fixtures);
  const familiesRaw = fixtureFamilies(fixtures);
  const cells = selfTest.failed === 0 ? probeCells(familiesRaw) : [];
  const families = familyCounts(familiesRaw, cells);
  const summary = {
    dialogue_turn_cells: cells.length,
    fixture_files_used: fixtures.length,
    fixture_families: familiesRaw.length,
    total_probes_run: cells.reduce((sum, cell) => sum + cell.probes_run, 0),
    total_caught: cells.reduce((sum, cell) => sum + cell.caught, 0),
    total_rule_family_correct: cells.reduce((sum, cell) => sum + cell.rule_family_correct, 0),
    measured_covered: cells.filter((cell) => cell.coverage === "measured-covered").length,
    measured_blind: cells.filter((cell) => cell.coverage === "measured-blind").length,
    unmeasured: cells.filter((cell) => cell.coverage === "unmeasured").length,
  };
  return {
    metadata: {
      generated_by: "scripts/cell-inventory/int-probe-vn-en-a1.ts",
      deterministic: true,
      engine_entrypoint: "src/lib/tutor/correctionEngine.ts::correctWithTutorRules",
      source_inventory: "reports/cell-inventory/vn-en-a1-inventory.json",
      fixture_source: "tests/regression/golden-set/correction-rules/*.json",
      applicability: "structural detector per golden-set rule family",
      src_policy: "src/** imported only; no correction logic reimplemented",
    },
    self_test: selfTest,
    summary,
    families,
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
if (report.summary.measured_covered + report.summary.measured_blind + report.summary.unmeasured !== 215) {
  console.error("Headline invariant failed: measured-covered + measured-blind + unmeasured must equal 215.");
  process.exit(1);
}
console.log(`Wrote ${JSON_OUT}`);
console.log(`Wrote ${MD_OUT}`);
