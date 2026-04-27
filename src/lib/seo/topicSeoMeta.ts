// src/lib/seo/topicSeoMeta.ts
//
// Per-topic SEO metadata generator. Returns the title, 150-char
// description, og:image URL, canonical URL, and JSON-LD Article
// payload for a single VSTEP / TOEIC / IELTS Writing topic page.
//
// Title patterns (Vietnamese-keyword-front-loaded so VN searchers see
// the keyword in the SERP snippet):
//   VSTEP: "VSTEP {level} Speaking: chủ đề {topic_vi} | MercyBlade"
//   TOEIC: "TOEIC Part {N} {section}: {topic_vi} | Luyện thi TOEIC"
//   IELTS: "IELTS Writing Task 2: {topic_vi} | Mẹo cho người Việt"
//
// Description budget is 150 chars (Google snippet truncates around
// 155 on mobile). The truncator is unicode-aware so VN diacritics
// don't blow the limit.

import {
  findVstepTopicById,
  type VstepSpeakingTopic,
} from "@/data/exam-prep/vstep/speaking-topics";
import {
  getPracticeItemById,
  type TOEICPracticeItem,
} from "@/data/exam-prep/toeic/practice-items";
import {
  findIeltsWritingTopicById,
  type IeltsWritingTopic,
} from "@/data/exam-prep/ielts/writing-topics";

export type TopicType = "vstep_speaking" | "toeic_practice" | "ielts_writing";

export type TopicSeoMeta = {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  /** JSON-LD Article schema, ready to drop into a <script type="application/ld+json"> tag. */
  structuredData: Record<string, unknown>;
};

/** Public origin for canonical / og:url. */
export const SITE_ORIGIN = "https://mercyblade.com";

/** Default OG image — already used by the existing /seo/* landing pages. */
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og/hoc-tieng-anh.png`;

const SECTION_LABEL: Record<"listening" | "reading", { vi: string; en: string }> = {
  listening: { vi: "Nghe", en: "Listening" },
  reading: { vi: "Đọc", en: "Reading" },
};

// Unicode-aware truncate. Google counts characters, not bytes, so this
// preserves VN diacritics correctly.
export function truncateForSnippet(text: string, max = 150): string {
  const chars = [...text];
  if (chars.length <= max) return text;
  let cut = chars.slice(0, max - 1).join("");
  // Try to break at the last word boundary so the snippet doesn't end
  // mid-word.
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > 0 && lastSpace > max - 30) cut = cut.slice(0, lastSpace);
  return `${cut}…`;
}

// ── Per-type builders ────────────────────────────────────────────────

function buildVstepMeta(topic: VstepSpeakingTopic): TopicSeoMeta {
  const title = `VSTEP ${topic.level} Speaking: chủ đề ${topic.topic_title_vi} | MercyBlade`;
  const description = truncateForSnippet(
    `Luyện VSTEP ${topic.level} Speaking chủ đề ${topic.topic_title_vi} — câu hỏi mẫu, từ vựng và mẹo phát âm cho người Việt. ${topic.description_vi}`,
  );
  const canonical = `${SITE_ORIGIN}/vstep/speaking/${topic.id}`;

  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    inLanguage: "vi-VN",
    url: canonical,
    author: { "@type": "Organization", name: "MercyBlade" },
    publisher: {
      "@type": "Organization",
      name: "MercyBlade",
      logo: { "@type": "ImageObject", url: `${SITE_ORIGIN}/og/hoc-tieng-anh.png` },
    },
    about: {
      "@type": "Course",
      name: `VSTEP ${topic.level} Speaking — ${topic.topic_title_en}`,
      educationalLevel: topic.level,
      timeRequired: `PT${topic.estimated_time_minutes}M`,
    },
    keywords: [
      "VSTEP",
      `VSTEP ${topic.level}`,
      "VSTEP Speaking",
      `VSTEP ${topic.topic_title_vi}`,
      "luyện thi VSTEP",
      topic.topic_title_en,
    ].join(", "),
  };

  return { title, description, canonical, ogImage: DEFAULT_OG_IMAGE, structuredData };
}

function buildToeicMeta(item: TOEICPracticeItem): TopicSeoMeta {
  const sectionLabel = SECTION_LABEL[item.section];
  const title = `TOEIC Part ${item.part} ${sectionLabel.vi}: ${item.title_vi} | Luyện thi TOEIC`;
  const description = truncateForSnippet(
    `Đề luyện TOEIC Part ${item.part} ${sectionLabel.vi} chủ đề ${item.title_vi}: passage gốc, lời giải tiếng Việt, từ vựng và bẫy phổ biến cho người Việt.`,
  );
  const canonical = `${SITE_ORIGIN}/toeic/practice/${item.id}`;

  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    inLanguage: "vi-VN",
    url: canonical,
    author: { "@type": "Organization", name: "MercyBlade" },
    publisher: {
      "@type": "Organization",
      name: "MercyBlade",
      logo: { "@type": "ImageObject", url: `${SITE_ORIGIN}/og/hoc-tieng-anh.png` },
    },
    about: {
      "@type": "Course",
      name: `TOEIC Part ${item.part} (${sectionLabel.en}) — ${item.title_en}`,
      educationalLevel: `TOEIC ${item.level}`,
      timeRequired: `PT${item.estimated_time_minutes}M`,
    },
    keywords: [
      "TOEIC",
      `TOEIC Part ${item.part}`,
      `TOEIC ${sectionLabel.en}`,
      `TOEIC ${item.title_vi}`,
      "luyện thi TOEIC",
      item.title_en,
    ].join(", "),
  };

  return { title, description, canonical, ogImage: DEFAULT_OG_IMAGE, structuredData };
}

function buildIeltsMeta(topic: IeltsWritingTopic): TopicSeoMeta {
  const title = `IELTS Writing Task 2: ${topic.topic_title_vi} | Mẹo cho người Việt`;
  const description = truncateForSnippet(
    `IELTS Writing Task 2 chủ đề ${topic.topic_title_vi}: đề mẫu, dàn bài, từ vựng và mẹo viết cho người Việt. ${topic.description_vi}`,
  );
  const canonical = `${SITE_ORIGIN}/ielts/writing/topic/${topic.id}`;

  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    inLanguage: "vi-VN",
    url: canonical,
    author: { "@type": "Organization", name: "MercyBlade" },
    publisher: {
      "@type": "Organization",
      name: "MercyBlade",
      logo: { "@type": "ImageObject", url: `${SITE_ORIGIN}/og/hoc-tieng-anh.png` },
    },
    about: {
      "@type": "Course",
      name: `IELTS Writing Task 2 — ${topic.topic_title_en}`,
      educationalLevel: "B2-C1",
      timeRequired: `PT${topic.recommended_minutes}M`,
    },
    keywords: [
      "IELTS",
      "IELTS Writing",
      "IELTS Writing Task 2",
      `IELTS ${topic.topic_title_vi}`,
      "luyện viết IELTS",
      topic.topic_title_en,
    ].join(", "),
  };

  return { title, description, canonical, ogImage: DEFAULT_OG_IMAGE, structuredData };
}

// ── Public API ────────────────────────────────────────────────────────

/**
 * Returns the SEO metadata bundle for a given topic, or null if the
 * topic ID isn't recognized. Page wrappers should fall back to the
 * site-wide defaults when null is returned.
 */
export function getSeoMeta(
  topicType: TopicType,
  topicId: string,
): TopicSeoMeta | null {
  switch (topicType) {
    case "vstep_speaking": {
      const topic = findVstepTopicById(topicId);
      return topic ? buildVstepMeta(topic) : null;
    }
    case "toeic_practice": {
      const item = getPracticeItemById(topicId);
      return item ? buildToeicMeta(item) : null;
    }
    case "ielts_writing": {
      const topic = findIeltsWritingTopicById(topicId);
      return topic ? buildIeltsMeta(topic) : null;
    }
  }
}
