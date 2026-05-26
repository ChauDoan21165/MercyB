// src/pages/seo/ToeicTopicPage.tsx
//
// Route: /toeic/practice/:itemId — one SEO landing page per TOEIC
// practice item. Resolves from src/data/exam-prep/toeic/practice-items.ts.

import React from "react";
import { Navigate, useParams } from "react-router-dom";

import {
  TOEIC_PRACTICE_ITEMS,
  getPracticeItemById,
  type TOEICPracticeItem,
} from "@/data/exam-prep/toeic/practice-items";
import SeoTopicPage, {
  type SeoTopicPageProps,
} from "@/pages/seo/SeoTopicPage";

const PARENT = {
  titleVi: "Luyện thi TOEIC",
  titleEn: "TOEIC Practice Pack",
  href: "/exam-prep/toeic",
};

const SECTION_LABEL = {
  listening: { vi: "Nghe", en: "Listening" },
  reading: { vi: "Đọc", en: "Reading" },
} as const;

function buildSampleQuestions(item: TOEICPracticeItem): string[] {
  // Surface the passage / audio script first as a single block, then
  // each question with its options, so the page has substantive,
  // crawl-friendly content (not just titles).
  const out: string[] = [];
  if (item.passage_or_audio_script) {
    out.push(item.passage_or_audio_script);
  }
  item.questions.forEach((q, i) => {
    const optionsBlock = q.options_en
      .map((opt, j) => `${String.fromCharCode(65 + j)}. ${opt}`)
      .join("  ");
    out.push(`Q${i + 1}. ${q.question_en} — ${optionsBlock}`);
  });
  return out;
}

function buildRelated(current: TOEICPracticeItem) {
  // Same section + same part first; pad with same-section same-topic.
  const samePart = TOEIC_PRACTICE_ITEMS.filter(
    (i) =>
      i.section === current.section &&
      i.part === current.part &&
      i.id !== current.id,
  );
  const sameTopic = TOEIC_PRACTICE_ITEMS.filter(
    (i) => i.topic === current.topic && i.id !== current.id,
  );
  const seen = new Set<string>();
  const ordered: TOEICPracticeItem[] = [];
  for (const list of [samePart, sameTopic]) {
    for (const it of list) {
      if (seen.has(it.id)) continue;
      seen.add(it.id);
      ordered.push(it);
      if (ordered.length >= 6) break;
    }
    if (ordered.length >= 6) break;
  }
  return ordered.map((it) => ({
    id: it.id,
    titleVi: it.title_vi,
    titleEn: it.title_en,
    href: `/toeic/practice/${it.id}`,
  }));
}

export default function ToeicTopicPage(): React.ReactElement {
  const { itemId } = useParams<{ itemId: string }>();
  const item = itemId ? getPracticeItemById(itemId) : null;
  if (!item) return <Navigate to={PARENT.href} replace />;

  const sectionLabel = SECTION_LABEL[item.section];
  const props: SeoTopicPageProps = {
    topicType: "toeic_practice",
    topicId: item.id,
    eyebrow: `TOEIC Part ${item.part} · ${sectionLabel.vi} (${sectionLabel.en})`,
    titleVi: item.title_vi,
    titleEn: item.title_en,
    descriptionVi: `Đề luyện TOEIC Part ${item.part} ${sectionLabel.vi} chủ đề ${item.title_vi}. Mức điểm mục tiêu: ${item.level}. Thời lượng dự kiến: ${item.estimated_time_minutes} phút.`,
    descriptionEn: `TOEIC Part ${item.part} ${sectionLabel.en} practice on ${item.title_en}. Target band: ${item.level}. Estimated time: ${item.estimated_time_minutes} minutes.`,
    sampleQuestions: buildSampleQuestions(item),
    vietnameseTips: item.typical_traps,
    vocabulary: item.vocabulary_focus.map((v) => ({
      word: v.word,
      translationVi: v.vi_translation,
      pronunciationIpa: v.ipa,
      level: `TOEIC ${item.level}`,
    })),
    practiceCtaHref: `/exam-prep/toeic#${item.id}`,
    practiceCtaLabel: { vi: "Mở bộ luyện TOEIC", en: "Open TOEIC pack" },
    parent: PARENT,
    related: buildRelated(item),
  };

  return <SeoTopicPage {...props} />;
}
