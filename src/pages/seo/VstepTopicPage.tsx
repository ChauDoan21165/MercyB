// src/pages/seo/VstepTopicPage.tsx
//
// Route: /vstep/speaking/:topicId — one SEO landing page per VSTEP
// speaking topic. Resolves the topic from
// src/data/exam-prep/vstep/speaking-topics.ts and feeds it into
// SeoTopicPage. If the slug is unknown, redirects to the parent
// index instead of showing a generic 404 — better SEO signal.

import React from "react";
import { Navigate, useParams } from "react-router-dom";

import {
  VSTEP_SPEAKING_TOPICS,
  findVstepTopicById,
  type VstepSpeakingTopic,
} from "@/data/exam-prep/vstep/speaking-topics";
import SeoTopicPage, {
  type SeoTopicPageProps,
} from "@/pages/seo/SeoTopicPage";

const PARENT = {
  titleVi: "VSTEP B1/B2 Speaking",
  titleEn: "VSTEP B1/B2 Speaking",
  href: "/exam/vstep/speaking",
};

const PART_EYEBROW: Record<1 | 2 | 3, { vi: string; en: string }> = {
  1: { vi: "Phần 1 · Giao tiếp xã hội", en: "Part 1 · Social interaction" },
  2: { vi: "Phần 2 · Thảo luận giải pháp", en: "Part 2 · Solution discussion" },
  3: { vi: "Phần 3 · Phát triển chủ đề", en: "Part 3 · Topic development" },
};

function buildRelated(current: VstepSpeakingTopic) {
  // Prefer same-level same-part topics; pad from same level any part.
  const sameLevelSamePart = VSTEP_SPEAKING_TOPICS.filter(
    (t) => t.level === current.level && t.part === current.part && t.id !== current.id,
  );
  const sameLevelOtherPart = VSTEP_SPEAKING_TOPICS.filter(
    (t) => t.level === current.level && t.part !== current.part,
  );
  const ordered = [...sameLevelSamePart, ...sameLevelOtherPart].slice(0, 6);
  return ordered.map((t) => ({
    id: t.id,
    titleVi: t.topic_title_vi,
    titleEn: t.topic_title_en,
    href: `/vstep/speaking/${t.id}`,
  }));
}

export default function VstepTopicPage(): React.ReactElement {
  const { topicId } = useParams<{ topicId: string }>();
  const topic = topicId ? findVstepTopicById(topicId) : undefined;
  if (!topic) return <Navigate to={PARENT.href} replace />;

  const eyebrowParts = PART_EYEBROW[topic.part];
  const props: SeoTopicPageProps = {
    topicType: "vstep_speaking",
    topicId: topic.id,
    eyebrow: `VSTEP ${topic.level} · ${eyebrowParts.vi}`,
    titleVi: topic.topic_title_vi,
    titleEn: topic.topic_title_en,
    descriptionVi: topic.description_vi,
    descriptionEn: topic.description_en,
    sampleQuestions: topic.sample_questions,
    vietnameseTips: topic.vietnamese_speaker_tips,
    vocabulary: topic.key_vocabulary.map((v) => ({
      word: v.word,
      translationVi: v.translation_vi,
      pronunciationIpa: v.pronunciation_ipa,
      level: v.level,
    })),
    practiceCtaHref: `/exam/vstep/speaking#${topic.id}`,
    practiceCtaLabel: { vi: "Luyện trên VSTEP Speaking", en: "Practice on VSTEP Speaking" },
    parent: PARENT,
    related: buildRelated(topic),
  };

  return <SeoTopicPage {...props} />;
}
