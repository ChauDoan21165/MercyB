// src/pages/seo/IeltsTopicPage.tsx
//
// Route: /ielts/writing/topic/:topicId — one SEO landing page per
// IELTS Writing Task 2 topic. Resolves from
// src/data/exam-prep/ielts/writing-topics.ts.

import React from "react";
import { Navigate, useParams } from "react-router-dom";

import {
  IELTS_WRITING_TOPICS,
  findIeltsWritingTopicById,
  type IeltsWritingTopic,
} from "@/data/exam-prep/ielts/writing-topics";
import SeoTopicPage, {
  type SeoTopicPageProps,
} from "@/pages/seo/SeoTopicPage";

const PARENT = {
  titleVi: "IELTS Writing",
  titleEn: "IELTS Writing",
  href: "/exam/ielts/writing",
};

const TASK_TYPE_EYEBROW: Record<IeltsWritingTopic["task_type"], { vi: string; en: string }> = {
  opinion: { vi: "Dạng Opinion", en: "Opinion essay" },
  discussion: { vi: "Dạng Discussion", en: "Discussion essay" },
  two_part: { vi: "Dạng Two-part", en: "Two-part question" },
  advantages_disadvantages: {
    vi: "Dạng Advantages/Disadvantages",
    en: "Advantages/Disadvantages",
  },
};

function buildSampleQuestions(topic: IeltsWritingTopic): string[] {
  // Combine the prompt and the approach outline so crawlers see
  // substantive on-page content beyond the title.
  return [topic.prompt_en, topic.prompt_vi, ...topic.approach_outline_vi];
}

function buildRelated(current: IeltsWritingTopic) {
  const sameTaskType = IELTS_WRITING_TOPICS.filter(
    (t) => t.task_type === current.task_type && t.id !== current.id,
  );
  const otherTaskType = IELTS_WRITING_TOPICS.filter(
    (t) => t.task_type !== current.task_type,
  );
  const ordered = [...sameTaskType, ...otherTaskType].slice(0, 6);
  return ordered.map((t) => ({
    id: t.id,
    titleVi: t.topic_title_vi,
    titleEn: t.topic_title_en,
    href: `/ielts/writing/topic/${t.id}`,
  }));
}

export default function IeltsTopicPage(): React.ReactElement {
  const { topicId } = useParams<{ topicId: string }>();
  const topic = topicId ? findIeltsWritingTopicById(topicId) : undefined;
  if (!topic) return <Navigate to={PARENT.href} replace />;

  const eyebrow = TASK_TYPE_EYEBROW[topic.task_type];
  const props: SeoTopicPageProps = {
    topicType: "ielts_writing",
    topicId: topic.id,
    eyebrow: `IELTS Writing Task 2 · ${eyebrow.vi}`,
    titleVi: topic.topic_title_vi,
    titleEn: topic.topic_title_en,
    descriptionVi: topic.description_vi,
    descriptionEn: topic.description_en,
    sampleQuestions: buildSampleQuestions(topic),
    vietnameseTips: topic.vietnamese_speaker_tips,
    vocabulary: topic.key_vocabulary.map((v) => ({
      word: v.word,
      translationVi: v.translation_vi,
      pronunciationIpa: v.pronunciation_ipa,
      level: v.level,
    })),
    practiceCtaHref: "/exam/ielts/writing",
    practiceCtaLabel: { vi: "Bắt đầu viết Task 2", en: "Start Task 2 practice" },
    parent: PARENT,
    related: buildRelated(topic),
  };

  return <SeoTopicPage {...props} />;
}
