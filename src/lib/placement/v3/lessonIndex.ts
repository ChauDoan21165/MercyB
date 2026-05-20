import { DAILY_LESSONS } from "@/data/dailyLessons";
import { RICH_LESSONS_PILOT } from "@/data/richLessonsPilot";
import { CUSTOMER_SERVICE_LESSONS } from "@/data/profession-packs/customer-service/content";
import { DRIVER_LESSONS } from "@/data/profession-packs/drivers/content";
import { HEALTHCARE_LESSONS } from "@/data/profession-packs/healthcare/content";
import { HOSPITALITY_LESSONS } from "@/data/profession-packs/hospitality/content";
import { NAIL_TECH_LESSONS } from "@/data/profession-packs/nail-technician/content";
import { RESTAURANT_LESSONS } from "@/data/profession-packs/restaurant/content";
import { TECH_WORKER_LESSONS } from "@/data/profession-packs/tech-worker/content";
import { VSTEP_LISTENING_ITEMS } from "@/data/exam-prep/vstep/listening-items";
import { VSTEP_READING_PASSAGES } from "@/data/exam-prep/vstep/reading-passages";
import { VSTEP_SPEAKING_TOPICS } from "@/data/exam-prep/vstep/speaking-topics";
import { VSTEP_WRITING_TOPICS } from "@/data/exam-prep/vstep/writing-topics";
import { DAILY_CHALLENGES } from "@/data/pronunciation-challenges";
import { LISTENING_CLIPS } from "@/data/listening/clips";
import { SCENARIOS } from "@/data/mock-interviews/scenarios";
import type { CefrLevel, IndexedLesson, LessonSource } from "./recommenderTypes";

type RoomJson = {
  id?: string;
  tier?: string;
  domain?: string;
  title?: { en?: string; vi?: string };
  title_en?: string;
  title_vi?: string;
  name?: string;
  name_vi?: string;
  content?: { en?: string; vi?: string };
  entries?: Array<{
    slug?: string;
    keywords_en?: string[];
    keywords_vi?: string[];
    tags?: string[];
    copy?: { en?: string; vi?: string };
  }>;
  tags?: string[];
};

const roomModules = import.meta.glob("../../../../public/data/*.json", {
  eager: true,
  import: "default",
}) as Record<string, RoomJson>;

const VALID_CEFR = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);

const L1_RULE_SYNONYMS: Record<string, string[]> = {
  vi_l1_missing_article: ["missing-articles", "missing article", "articles", "a/an", "the", "article"],
  vi_l1_no_article_generic: ["zero article", "generic article", "articles"],
  vi_l1_a_vs_an_vowel: ["a vs an", "a/an", "articles"],
  vi_l1_geographical_article: ["geographical article", "the philippines", "the us"],
  vi_l1_3rd_person_s: ["third person", "3rd person", "subject verb", "verb agreement", "-s"],
  vi_l1_plural_s: ["plural", "plural-s", "plural s", "final s"],
  vi_l1_past_ed: ["past tense", "past-ed", "ed ending", "yesterday"],
  vi_l1_missing_be: ["missing be", "to be", "am is are"],
  vi_l1_question_no_aux: ["question", "auxiliary", "do support"],
  vi_l1_preposition_transfer: ["preposition", "in on at", "for since"],
  vi_l1_subjunctive_were: ["subjunctive", "if i were", "were"],
  vi_l1_conditional_mix: ["conditional", "if clause", "if i were"],
  vi_l1_passive_missing_be: ["passive", "be v3"],
  vi_l1_final_consonants: ["final consonant", "final consonants", "ending sounds"],
};

function cleanToken(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[*_`"“”'’()[\]{}]/g, " ")
    .replace(/[^a-z0-9/+\-\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function unique(values: Array<string | undefined | null>): string[] {
  return [...new Set(values.map((v) => cleanToken(v)).filter(Boolean))];
}

function compact(values: Array<string | undefined | null>): string[] {
  return [...new Set(values.map((v) => String(v ?? "").trim()).filter(Boolean))];
}

function hasAny(text: string, needles: string[]): boolean {
  const haystack = cleanToken(text);
  return needles.some((needle) => haystack.includes(cleanToken(needle)));
}

function inferCefrFromText(text: string, fallback: CefrLevel | null = null): CefrLevel | null {
  const normalized = cleanToken(text);
  const exact = normalized.match(/\b(a1|a2|b1|b2|c1|c2)\b/i)?.[1]?.toUpperCase();
  if (exact && VALID_CEFR.has(exact)) return exact as CefrLevel;

  if (hasAny(normalized, ["subjunctive", "if i were", "conditional", "passive voice"])) return "B2";
  if (hasAny(normalized, ["advanced", "mastery", "sophisticated", "nuance", "academic"])) return "C1";
  if (hasAny(normalized, ["intermediate", "professional", "interview", "workplace"])) return "B1";
  if (hasAny(normalized, ["beginner", "basic", "foundation", "first words"])) return "A1";

  return fallback;
}

function inferCategory(text: string, fallback = "vocabulary"): string {
  if (hasAny(text, ["grammar", "tense", "article", "passive", "conditional", "subjunctive", "verb", "plural", "preposition"])) return "grammar";
  if (hasAny(text, ["pronunciation", "phoneme", "sound", "stress", "intonation", "tongue twister"])) return "pronunciation";
  if (hasAny(text, ["listen", "listening", "transcript", "accent", "audio"])) return "listening";
  if (hasAny(text, ["interview", "speaking", "answer", "conversation", "scenario"])) return "speaking";
  if (hasAny(text, ["writing", "email", "letter", "essay"])) return "writing";
  if (hasAny(text, ["reading", "passage", "scan", "notice"])) return "reading";
  return fallback;
}

function inferSubskills(text: string, base: string[] = []): string[] {
  const pairs: Array<[string, string[]]> = [
    ["grammar", ["grammar", "tense", "article", "passive", "conditional", "subjunctive", "verb", "plural", "preposition"]],
    ["pronunciation", ["pronunciation", "phoneme", "sound", "stress", "intonation", "final consonant"]],
    ["vocabulary", ["vocabulary", "phrases", "keywords", "word", "collocation"]],
    ["listening", ["listening", "transcript", "accent", "audio"]],
    ["speaking", ["speaking", "interview", "conversation", "answer"]],
    ["writing", ["writing", "email", "letter", "essay"]],
    ["reading", ["reading", "passage", "notice", "article"]],
  ];

  return unique([
    ...base,
    ...pairs.filter(([, needles]) => hasAny(text, needles)).map(([skill]) => skill),
  ]);
}

function inferL1Coverage(text: string, explicit: string[] = []): string[] {
  const haystack = cleanToken([text, ...explicit].join(" "));
  const matches = Object.entries(L1_RULE_SYNONYMS)
    .filter(([rule, needles]) => haystack.includes(cleanToken(rule)) || needles.some((needle) => haystack.includes(cleanToken(needle))))
    .map(([rule]) => rule);
  return compact([...explicit.filter((v) => v.startsWith("vi_l1_")), ...matches]);
}

function lesson(
  source: LessonSource,
  rawId: string,
  title: string,
  opts: Omit<IndexedLesson, "id" | "title" | "source">,
): IndexedLesson {
  const text = [title, opts.titleVi, opts.category, ...opts.subskills, ...opts.tags, ...opts.l1InterferenceCoverage].join(" ");
  return {
    id: `${source}:${rawId}`,
    title,
    source,
    cefrLevel: opts.cefrLevel ?? inferCefrFromText(text),
    category: opts.category || inferCategory(text),
    subskills: inferSubskills(text, opts.subskills),
    tags: unique(opts.tags),
    l1InterferenceCoverage: inferL1Coverage(text, opts.l1InterferenceCoverage),
    titleVi: opts.titleVi,
  };
}

function indexDaily(): IndexedLesson[] {
  return DAILY_LESSONS.map((entry) =>
    lesson("daily", entry.roomId, entry.title_en, {
      titleVi: entry.title_vi,
      cefrLevel: inferCefrFromText(entry.roomId, "A1"),
      category: inferCategory([entry.title_en, entry.description_en, entry.roomId].join(" ")),
      subskills: [],
      tags: [entry.roomId, entry.description_en, entry.description_vi],
      l1InterferenceCoverage: [],
    }),
  );
}

function indexRichLessons(): IndexedLesson[] {
  return RICH_LESSONS_PILOT.map((entry) => {
    const text = [
      entry.tag,
      entry.title.en,
      entry.title.vi,
      ...Object.values(entry.sections).flatMap((section) => [section.en, section.vi]),
    ].join(" ");
    return lesson("rich", entry.tag, entry.title.en.replace(/\*\*/g, ""), {
      titleVi: entry.title.vi.replace(/\*\*/g, ""),
      cefrLevel: inferCefrFromText(text, hasAny(text, ["subjunctive", "reported speech", "past perfect"]) ? "C1" : "A2"),
      category: "grammar",
      subskills: ["grammar"],
      tags: [entry.tag, text],
      l1InterferenceCoverage: [entry.tag],
    });
  });
}

function indexProfessionPacks(): IndexedLesson[] {
  const packs = [
    ...CUSTOMER_SERVICE_LESSONS,
    ...DRIVER_LESSONS,
    ...HEALTHCARE_LESSONS,
    ...HOSPITALITY_LESSONS,
    ...NAIL_TECH_LESSONS,
    ...RESTAURANT_LESSONS,
    ...TECH_WORKER_LESSONS,
  ];

  return packs.map((entry) => {
    const sentenceText = entry.sentences.flatMap((s) => [s.en, s.vi, ...s.pronunciation_focus]).join(" ");
    const text = [entry.id, entry.category, entry.title_en, entry.title_vi, sentenceText, entry.cultural_notes_vi, entry.tip_advice_vi].join(" ");
    return lesson("profession-pack", entry.id, entry.title_en, {
      titleVi: entry.title_vi,
      cefrLevel: inferCefrFromText(text, "B1"),
      category: inferCategory(text, "speaking"),
      subskills: ["speaking", "vocabulary", "pronunciation"],
      tags: [entry.category, text],
      l1InterferenceCoverage: inferL1Coverage(text),
    });
  });
}

function indexVstep(): IndexedLesson[] {
  const listening = VSTEP_LISTENING_ITEMS.map((entry) =>
    lesson("vstep", `listening:${entry.id}`, entry.title_en, {
      titleVi: entry.title_vi,
      cefrLevel: entry.level,
      category: "listening",
      subskills: ["listening", "vocabulary"],
      tags: [entry.section, entry.difficulty, ...entry.vietnameseLearnerTips],
      l1InterferenceCoverage: inferL1Coverage(entry.vietnameseLearnerTips.join(" ")),
    }),
  );

  const reading = VSTEP_READING_PASSAGES.map((entry) =>
    lesson("vstep", `reading:${entry.id}`, entry.title_en, {
      titleVi: entry.title_vi,
      cefrLevel: entry.level,
      category: "reading",
      subskills: ["reading", "vocabulary"],
      tags: [entry.section, entry.difficulty, entry.vietnameseLearnerNotes],
      l1InterferenceCoverage: inferL1Coverage(entry.vietnameseLearnerNotes),
    }),
  );

  const speaking = VSTEP_SPEAKING_TOPICS.map((entry) =>
    lesson("vstep", `speaking:${entry.id}`, entry.topic_title_en, {
      titleVi: entry.topic_title_vi,
      cefrLevel: entry.level,
      category: "speaking",
      subskills: ["speaking", "pronunciation", "vocabulary"],
      tags: [entry.description_en, entry.description_vi, ...entry.vietnamese_speaker_tips],
      l1InterferenceCoverage: inferL1Coverage(entry.vietnamese_speaker_tips.join(" ")),
    }),
  );

  const writing = VSTEP_WRITING_TOPICS.map((entry) =>
    lesson("vstep", `writing:${entry.id}`, entry.title_en, {
      titleVi: entry.title_vi,
      cefrLevel: entry.level,
      category: "writing",
      subskills: ["writing", "grammar", "vocabulary"],
      tags: [entry.task, entry.prompt_en, entry.prompt_vi, ...entry.vietnameseLearnerTips],
      l1InterferenceCoverage: inferL1Coverage(entry.vietnameseLearnerTips.join(" ")),
    }),
  );

  return [...listening, ...reading, ...speaking, ...writing];
}

function indexPronunciation(): IndexedLesson[] {
  return DAILY_CHALLENGES.map((entry) =>
    lesson("pronunciation", entry.id, entry.content_en, {
      titleVi: entry.content_vi_explanation,
      cefrLevel: entry.difficulty === "easy" ? "A2" : entry.difficulty === "medium" ? "B1" : "B2",
      category: "pronunciation",
      subskills: ["pronunciation"],
      tags: [entry.type, entry.difficulty, ...entry.target_phonemes, entry.content_vi_explanation],
      l1InterferenceCoverage: inferL1Coverage(["pronunciation", ...entry.target_phonemes, entry.content_vi_explanation].join(" ")),
    }),
  );
}

function indexListening(): IndexedLesson[] {
  return LISTENING_CLIPS.map((entry) =>
    lesson("listening", entry.id, entry.title_en, {
      titleVi: entry.title_vi,
      cefrLevel: entry.difficulty === "beginner" ? "A1" : entry.difficulty === "intermediate" ? "B1" : "B2",
      category: "listening",
      subskills: ["listening", "vocabulary"],
      tags: [entry.category, entry.accent, entry.description_vi, ...entry.vocabulary_keys],
      l1InterferenceCoverage: inferL1Coverage([entry.description_vi, ...entry.vocabulary_keys].join(" ")),
    }),
  );
}

function indexInterviews(): IndexedLesson[] {
  return Object.values(SCENARIOS).map((entry) => {
    const mistakes = entry.questions.flatMap((q) => q.common_mistakes_vi);
    return lesson("interview", entry.slug, entry.title_en, {
      titleVi: entry.title_vi,
      cefrLevel: entry.difficulty,
      category: "speaking",
      subskills: ["speaking", "grammar", "vocabulary"],
      tags: [entry.industry, entry.intro_en, entry.intro_vi, ...entry.evaluation_criteria, ...mistakes],
      l1InterferenceCoverage: inferL1Coverage(mistakes.join(" ")),
    });
  });
}

function indexRooms(): IndexedLesson[] {
  return Object.values(roomModules).flatMap((room) => {
    const id = String(room.id ?? "").trim();
    if (!id) return [];

    const title = room.title?.en ?? room.title_en ?? room.name ?? id;
    const titleVi = room.title?.vi ?? room.title_vi ?? room.name_vi;
    const entries = room.entries ?? [];
    const entryTags = entries.flatMap((entry) => [
      ...(entry.keywords_en ?? []),
      ...(entry.keywords_vi ?? []),
      ...(entry.tags ?? []),
      entry.copy?.en,
      entry.copy?.vi,
      entry.slug,
    ]);
    const text = [id, room.domain, title, titleVi, room.content?.en, room.content?.vi, ...(room.tags ?? []), ...entryTags].join(" ");

    return [
      lesson("room", id, title, {
        titleVi,
        cefrLevel: inferCefrFromText(text),
        category: inferCategory(text),
        subskills: inferSubskills(text),
        tags: compact([room.domain, ...(room.tags ?? []), ...entryTags]),
        l1InterferenceCoverage: inferL1Coverage(text),
      }),
    ];
  });
}

function assertUniqueIds(lessons: IndexedLesson[]): IndexedLesson[] {
  const seen = new Set<string>();
  return lessons.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function buildLessonIndex(): IndexedLesson[] {
  return assertUniqueIds([
    ...indexDaily(),
    ...indexRichLessons(),
    ...indexProfessionPacks(),
    ...indexVstep(),
    ...indexPronunciation(),
    ...indexListening(),
    ...indexInterviews(),
    ...indexRooms(),
  ]);
}

export const LESSON_INDEX: readonly IndexedLesson[] = Object.freeze(buildLessonIndex());
