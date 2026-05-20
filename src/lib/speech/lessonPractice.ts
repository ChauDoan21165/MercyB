import {
  getTopicById,
  type IELTSSpeakingTopic,
} from "@/data/exam-prep/ielts/speaking-topics";

export const LESSON_SOURCE_PARAM = "lessonSource";
export const LESSON_ID_PARAM = "lessonId";
export const PRACTICE_TEXT_PARAM = "practice";

export type LessonPracticeSource = "ielts-speaking";

export type LessonPracticeSentence = {
  id: string;
  target_en: string;
  target_vi?: string;
  cefr: "B1" | "B2";
  context: string;
};

export type LessonPracticeSession = {
  source: LessonPracticeSource;
  lessonId: string;
  roomId: string;
  title: string;
  titleVi: string;
  sentences: LessonPracticeSentence[];
};

function splitIntoSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

function cleanWeakSample(text: string): string {
  return text.replace(/\s*\[[^\]]+\]/g, "").replace(/\s+/g, " ").trim();
}

function sentenceId(lessonId: string, band: "band7" | "band5", index: number): string {
  return `${lessonId}:${band}:${index + 1}`;
}

function buildIeltsSpeakingSentences(topic: IELTSSpeakingTopic): LessonPracticeSentence[] {
  const band7 = splitIntoSentences(topic.sample_strong_answer_band_7).map((target, index) => ({
    id: sentenceId(topic.id, "band7", index),
    target_en: target,
    target_vi: "Mẫu band 7 · Band 7 sample",
    cefr: "B2" as const,
    context: "ielts_band_7_sample",
  }));

  const band5 = splitIntoSentences(cleanWeakSample(topic.sample_weak_answer_band_5)).map((target, index) => ({
    id: sentenceId(topic.id, "band5", index),
    target_en: target,
    target_vi: "Mẫu band 5 · Band 5 sample",
    cefr: "B1" as const,
    context: "ielts_band_5_sample",
  }));

  return [...band7, ...band5];
}

export function roomIdForLessonPractice(
  source: LessonPracticeSource,
  lessonId: string,
): string {
  return `practice:${source}:${lessonId}`;
}

export function buildLessonPracticePath(input: {
  source: LessonPracticeSource;
  lessonId: string;
}): string {
  const params = new URLSearchParams();
  params.set(LESSON_SOURCE_PARAM, input.source);
  params.set(LESSON_ID_PARAM, input.lessonId);
  return `/speak?${params.toString()}`;
}

export function resolveLessonPracticeSession(
  params: URLSearchParams,
): LessonPracticeSession | null {
  const source = params.get(LESSON_SOURCE_PARAM);
  const lessonId = params.get(LESSON_ID_PARAM);

  if (source === "ielts-speaking" && lessonId) {
    const topic = getTopicById(lessonId);
    if (!topic) return null;

    return {
      source,
      lessonId,
      roomId: roomIdForLessonPractice(source, lessonId),
      title: `${topic.topic_title_en} · IELTS Speaking Part ${topic.part}`,
      titleVi: topic.topic_title_vi,
      sentences: buildIeltsSpeakingSentences(topic),
    };
  }

  return null;
}

export function resolveStandalonePracticeText(
  params: URLSearchParams,
): LessonPracticeSentence[] | null {
  const text = params.get(PRACTICE_TEXT_PARAM)?.trim();
  if (!text) return null;

  return splitIntoSentences(text).map((target, index) => ({
    id: `practice-text:${index + 1}`,
    target_en: target,
    cefr: "B1",
    context: "custom_practice",
  }));
}
