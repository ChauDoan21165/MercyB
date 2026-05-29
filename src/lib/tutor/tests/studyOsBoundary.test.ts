import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();
const tutorRoot = join(repoRoot, "src", "lib", "tutor");

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

describe("Study OS static boundary", () => {
  it("scans only the intended production tutor files", () => {
    expect(productionFiles.map((file) => file.rel)).toEqual([
      "src/lib/tutor/correctionEngine.ts",
      "src/lib/tutor/languageRegistry.ts",
      "src/lib/tutor/learningEvents.ts",
      "src/lib/tutor/learningEventSummary.ts",
      "src/lib/tutor/masteryGraph.ts",
      "src/lib/tutor/productConfigs.ts",
      "src/lib/tutor/speakableText.ts",
      "src/lib/tutor/speakConversationState.ts",
      "src/lib/tutor/speakFollowups.ts",
      "src/lib/tutor/studySessionState.ts",
      "src/lib/tutor/todayLessonPlanner.ts",
      "src/lib/tutor/tutorCopy.ts",
      "src/lib/tutor/tutorEngine.ts",
      "src/lib/tutor/tutorTypes.ts",
      "src/lib/tutor/vietlishCuratedLogic.ts",
      "src/lib/tutor/vietlishLogicEngine.ts",
    ]);
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
        if (pattern.test(text)) violations.push(`${file.rel}: ${label}`);
      }
    }

    expect(violations).toEqual([]);
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
      .filter((file) => /\blocalStorage\b/.test(file.text))
      .map((file) => file.rel);

    expect(localStorageUsers).toEqual([
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
