// src/notificationEngine/copy.ts
//
// Bilingual copy for the four notification messages. Vietnamese is the
// product-default voice; English is provided for the secondary audience.
// Diacritics are restored here (the build plan wrote VN without diacritics
// for terminal safety only).

export type CopyLang = "vi" | "en";

export type NotificationMessageKey =
  | "daily_reminder"
  | "streak_save"
  | "due_review_count"
  | "due_review_pending";

interface CopyTemplate {
  title: string;
  body: string;
}

/** title/body templates per message per language. {{streak}} / {{count}} are interpolated. */
export const NOTIFICATION_COPY: Record<
  NotificationMessageKey,
  Record<CopyLang, CopyTemplate>
> = {
  daily_reminder: {
    vi: {
      title: "Mercy đợi bạn 5 phút",
      body: "Một bài luyện ngắn là đủ giữ thói quen. Mở MercyBlade khi bạn rảnh nhé.",
    },
    en: {
      title: "Mercy is waiting — 5 minutes",
      body: "One short drill keeps the habit alive. Open MercyBlade when you have a minute.",
    },
  },
  streak_save: {
    vi: {
      title: "Còn vài giờ để giữ chuỗi {{streak}} ngày",
      body: "Làm một câu là chuỗi của bạn vẫn nguyên vẹn. Mở MercyBlade trước khi hết ngày nhé.",
    },
    en: {
      title: "A few hours to save your {{streak}}-day streak",
      body: "One sentence keeps it alive. Open MercyBlade before the day ends.",
    },
  },
  due_review_count: {
    vi: {
      title: "Có {{count}} từ cần ôn",
      body: "Ôn nhanh bây giờ sẽ giúp bạn nhớ dễ hơn vào ngày mai.",
    },
    en: {
      title: "{{count}} words are ready to review",
      body: "A quick review now will make them easier to remember tomorrow.",
    },
  },
  due_review_pending: {
    vi: {
      title: "Đến giờ ôn từ",
      body: "Hàng đợi từ vựng đã sẵn sàng. Mở MercyBlade ôn nhanh một vòng nhé.",
    },
    en: {
      title: "Review time",
      body: "Your vocabulary queue is ready. Open MercyBlade for a quick round.",
    },
  },
};

function interpolate(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{\{(\w+)\}\}/g, (_, k: string) =>
    k in vars ? String(vars[k]) : `{{${k}}}`,
  );
}

/** Resolve a message to concrete { title, body }, interpolating {{streak}}/{{count}}. */
export function renderCopy(
  key: NotificationMessageKey,
  lang: CopyLang,
  vars: Record<string, string | number> = {},
): CopyTemplate {
  const tpl = NOTIFICATION_COPY[key][lang];
  return {
    title: interpolate(tpl.title, vars),
    body: interpolate(tpl.body, vars),
  };
}
