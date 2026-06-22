import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();
const tutorRoot = join(repoRoot, "src", "lib", "tutor");
const speakTopicsRelPrefix = ["src", "lib", "tutor", "speakTopics", ""].join(sep);
const vietlishCorpusRel = ["src", "lib", "tutor", "vietlishCorpus.ts"].join(sep);

type SourceFile = {
  path: string;
  rel: string;
  text: string;
};

function listTutorProductionFiles(dir = tutorRoot): SourceFile[] {
  const entries = readdirSync(dir).flatMap((name) => {
    const file = join(dir, name);
    const rel = relative(repoRoot, file);
    const stat = statSync(file);
    if (stat.isDirectory()) {
      if (
        name === "tests" ||
        name === "__tests__" ||
        name === "languages" ||
        name === "correctionRules"
      ) {
        return [];
      }
      return listTutorProductionFiles(file);
    }
    if (!/\.(ts|tsx)$/.test(name)) return [];
    if (/\.test\.(ts|tsx)$/.test(name)) return [];
    return [{ path: file, rel, text: readFileSync(file, "utf8") }];
  });
  return entries.sort((a, b) => a.rel.localeCompare(b.rel));
}

function stripComments(text: string): string {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

function importStatements(text: string): string[] {
  return [...text.matchAll(/^\s*import[\s\S]*?\sfrom\s+["'][^"']+["'];?/gm)].map(
    ([statement]) => statement,
  );
}

function importSource(statement: string): string {
  return statement.match(/\sfrom\s+["']([^"']+)["']/)?.[1] ?? "";
}

function isTypeOnlyImport(statement: string): boolean {
  return /^\s*import\s+type\b/.test(statement);
}

const productionFiles = listTutorProductionFiles();

function isSpeakTopicFile(rel: string): boolean {
  return rel.startsWith(speakTopicsRelPrefix);
}

// vietlishCorpus.ts is a pure CONTENT data file (learner example sentences for
// the Vietlish interference engine). Like speakTopics, its strings legitimately
// carry emotional vocabulary ("I feel ashamed to ask for help") — content, not a
// shame mechanic. Being data, it can never hold a code mechanic, so exempting it
// from the shame WORD scan is safe.
function isVietlishCorpusFile(rel: string): boolean {
  return rel === vietlishCorpusRel;
}

// The "shame/guilt mechanic" rule guards the Study OS ENGINE against shame
// *mechanics*. speakTopics/* and vietlishCorpus.ts are CONTENT files where
// "shame"/"ashamed" legitimately appears in anti-shame coaching copy or learner
// vocabulary (MercyBlade is explicitly low-shame), so the word-level scan would
// false-positive on the product's own content. Only the shame WORD scan is
// exempted for content; every code-mechanic rule (Supabase/XP/streak/writes/
// analytics) still applies to every file.
function runtimeRuleAppliesToFile(label: string, rel: string): boolean {
  if (
    label === "shame/guilt mechanic" &&
    (isSpeakTopicFile(rel) || isVietlishCorpusFile(rel))
  ) {
    return false;
  }
  return true;
}

describe("Study OS static boundary", () => {
  it("scans only the intended production tutor files", () => {
    const scannedFiles = productionFiles.map((file) => file.rel);
    const speakTopicFiles = scannedFiles.filter(isSpeakTopicFile);
    const nonSpeakTopicFiles = scannedFiles.filter((rel) => !isSpeakTopicFile(rel));

    expect(nonSpeakTopicFiles).toEqual([
      "src/lib/tutor/bilingualSalienceDetector.ts",
      "src/lib/tutor/contentAwarePivots.ts",
      "src/lib/tutor/conversationAiClient.ts",
      "src/lib/tutor/conversationPromptTemplates.ts",
      "src/lib/tutor/conversationPronunciationAdapter.ts",
      "src/lib/tutor/conversationTelemetry.ts",
      "src/lib/tutor/conversationTurnPolicy.ts",
      "src/lib/tutor/conversationWarmth.ts",
      "src/lib/tutor/correctionEngine.ts",
      "src/lib/tutor/emotionalResponseBoundary.ts",
      "src/lib/tutor/englishOnlyTts.ts",
      "src/lib/tutor/followUpIntelligence.ts",
      "src/lib/tutor/languageRegistry.ts",
      "src/lib/tutor/learnerHistoryProfile.ts",
      "src/lib/tutor/learnerProfileBuilder.ts",
      "src/lib/tutor/learningEvents.ts",
      "src/lib/tutor/learningEventSummary.ts",
      "src/lib/tutor/masteryGraph.ts",
      "src/lib/tutor/nextLessonRecommender.ts",
      "src/lib/tutor/pivotPromptSafety.ts",
      "src/lib/tutor/productConfigs.ts",
      "src/lib/tutor/speakableText.ts",
      "src/lib/tutor/speakConversationState.ts",
      "src/lib/tutor/speakFollowups.ts",
      "src/lib/tutor/speakTopicLibrary.ts",
      "src/lib/tutor/studySessionState.ts",
      "src/lib/tutor/teacherMercyContract.ts",
      "src/lib/tutor/teacherMercyCorrectionTiming.ts",
      "src/lib/tutor/teacherMercyRubric.ts",
      "src/lib/tutor/todayLessonPlanner.ts",
      "src/lib/tutor/tutorCopy.ts",
      "src/lib/tutor/tutorEngine.ts",
      "src/lib/tutor/tutorTypes.ts",
      "src/lib/tutor/vietlishCorpus.ts",
      "src/lib/tutor/vietlishCuratedLogic.ts",
      "src/lib/tutor/vietlishLogicEngine.ts",
    ]);
    expect(speakTopicFiles).toContain("src/lib/tutor/speakTopics/introductions.ts");
    for (const rel of speakTopicFiles) {
      expect(rel).toMatch(/^src\/lib\/tutor\/speakTopics\/[^/]+\.ts$/);
    }
  });

  it("does not import Supabase, external analytics, remote memory writers, placement, XP, or streak modules", () => {
    const violations: string[] = [];
    const forbiddenSources = [
      /^@supabase\/supabase-js$/,
      /^@\/lib\/supabaseClient$/,
      /^supabase\/functions\b/,
      /^@\/lib\/tracking(?:\/|$)/,
      /^@\/lib\/analytics(?:\/|$)/,
      /^@\/services(?:\/|$)/,
      /^@\/lib\/placement(?:\/|$)/,
      /^@\/lib\/xp(?:\/|$)/,
      /^@\/lib\/streak/,
    ];

    for (const file of productionFiles) {
      for (const statement of importStatements(file.text)) {
        const source = importSource(statement);
        if (forbiddenSources.some((pattern) => pattern.test(source))) {
          violations.push(`${file.rel}: forbidden import ${source}`);
        }
        if (
          source === "@/lib/ai-tutor/learningMemory" &&
          !isTypeOnlyImport(statement)
        ) {
          violations.push(
            `${file.rel}: learningMemory may be used for types only, not Study OS memory writes`,
          );
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("does not call remote sync, external analytics, memory write, XP, streak, or shame mechanics", () => {
    const violations: string[] = [];
    const forbiddenRuntimePatterns: Array<[RegExp, string]> = [
      [/\bcreateClient\s*\(/, "Supabase client creation"],
      [/\bsupabase\s*\./, "Supabase client usage"],
      [/\bsupabase\s*\.\s*(?:from|insert|upsert|update)\s*\(/, "Supabase query/write chain"],
      [/\.(?:insert|upsert|update)\s*\(/, "database write chain"],
      [/\bnavigator\.sendBeacon\s*\(/, "sendBeacon analytics"],
      [/\b(?:gtag|fbq|clarity|trackEvent)\s*\(/, "external analytics call"],
      [/\b(?:putCorrection|markPracticed)\s*\(/, "AI Tutor memory write"],
      [/\b(?:awardXP|current_streak|streakDays)\b/, "XP/streak mechanic"],
      [/\b(?:shame|ashamed|guilt|guilty)\b/i, "shame/guilt mechanic"],
    ];

    for (const file of productionFiles) {
      const text = stripComments(file.text);
      for (const [pattern, label] of forbiddenRuntimePatterns) {
        if (!runtimeRuleAppliesToFile(label, file.rel)) continue;
        if (pattern.test(text)) violations.push(`${file.rel}: ${label}`);
      }
    }

    expect(violations).toEqual([]);
  });

  it("exempts only the shame WORD rule for speakTopics content, never for engine files or other rules", () => {
    // Content may carry anti-shame coaching copy ("without shame") — not a mechanic.
    expect(
      runtimeRuleAppliesToFile("shame/guilt mechanic", "src/lib/tutor/speakTopics/healthcareWorkerEnglish.ts"),
    ).toBe(false);
    // Engine logic mentioning shame IS a mechanic and must still fail.
    expect(runtimeRuleAppliesToFile("shame/guilt mechanic", "src/lib/tutor/tutorEngine.ts")).toBe(true);
    // The exemption is scoped to the shame rule only — code-mechanic rules apply everywhere.
    expect(
      runtimeRuleAppliesToFile("XP/streak mechanic", "src/lib/tutor/speakTopics/healthcareWorkerEnglish.ts"),
    ).toBe(true);
    expect(
      runtimeRuleAppliesToFile("Supabase client usage", "src/lib/tutor/speakTopics/social.ts"),
    ).toBe(true);
  });

  it("keeps raw learner text/audio out of Study OS local persistence files", () => {
    const storageFiles = [
      "src/lib/tutor/learningEvents.ts",
      "src/lib/tutor/studySessionState.ts",
    ];
    const forbiddenRawPersistencePatterns: Array<[RegExp, string]> = [
      [/\blearnerText\b/, "learnerText"],
      [/\bcorrectedText\b/, "correctedText"],
      [/\baudioBlob\b/, "audioBlob"],
      [/\brawAudio\b/, "rawAudio"],
      [/\brawLearner(?:Text|Audio)\b/, "raw learner payload"],
      [/\btranscript\s*:/, "transcript field persistence"],
    ];

    const violations: string[] = [];
    for (const rel of storageFiles) {
      const file = productionFiles.find((candidate) => candidate.rel === rel);
      expect(file, `${rel} should be part of the Study OS boundary scan`).toBeTruthy();
      if (!file) continue;
      const text = stripComments(file.text);
      for (const [pattern, label] of forbiddenRawPersistencePatterns) {
        if (pattern.test(text)) violations.push(`${rel}: ${label}`);
      }
    }

    expect(violations).toEqual([]);
  });

  it("allows only documented safe local storage surfaces", () => {
    const localStorageUsers = productionFiles
      .filter((file) => /\blocalStorage\b/.test(stripComments(file.text)))
      .map((file) => file.rel);

    expect(localStorageUsers).toEqual([
      "src/lib/tutor/learnerHistoryProfile.ts",
      "src/lib/tutor/learningEvents.ts",
      "src/lib/tutor/studySessionState.ts",
    ]);
  });

  it("keeps the boundary test out of Kids and Placement ownership", () => {
    expect(existsSync(join(repoRoot, "src", "lib", "tutor", "tests", "studyOsBoundary.test.ts"))).toBe(true);
    expect(
      productionFiles.some((file) =>
        file.rel.split(sep).some((part) => /kids|placement/i.test(part)),
      ),
    ).toBe(false);
  });
});
