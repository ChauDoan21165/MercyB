// src/lib/referral/familyInviteCopy.ts
//
// Bilingual VI-primary invitation templates with VN-cultural
// addressing. The user picks a template OR writes a custom message;
// the recipient page uses the same module to render the personalised
// welcome.
//
// Pure module — no React, no Supabase, vitest-friendly.

export type FamilyInviteRelationship =
  | "older_sister"
  | "older_brother"
  | "younger"
  | "aunt"
  | "uncle"
  | "parent"
  | "cousin"
  | "friend"
  | "colleague"
  | "other";

export type FamilyInviteTemplateKey =
  | "family"
  | "friend"
  | "colleague"
  | "custom";

export interface FamilyInviteTemplate {
  key: FamilyInviteTemplateKey;
  label_vi: string;
  label_en: string;
  body_vi: string;
  body_en: string;
}

/**
 * Pick the right Vietnamese pronoun for the recipient based on the
 * declared relationship. Defaults to "bạn" when unknown.
 */
export function recipientAddressVi(rel: FamilyInviteRelationship | null): string {
  switch (rel) {
    case "older_sister":
      return "chị";
    case "older_brother":
      return "anh";
    case "younger":
      return "em";
    case "aunt":
      return "cô";
    case "uncle":
      return "chú";
    case "parent":
      // We don't pick mẹ vs bố automatically — parent gender isn't on
      // the input shape. Default to "ba/mẹ" (universal).
      return "ba/mẹ";
    case "cousin":
    case "friend":
      return "bạn";
    case "colleague":
      return "anh/chị";
    default:
      return "bạn";
  }
}

/** Self-pronoun the inviter uses when speaking TO the recipient. */
export function inviterSelfAddressVi(rel: FamilyInviteRelationship | null): string {
  switch (rel) {
    case "older_sister":
    case "older_brother":
    case "aunt":
    case "uncle":
    case "parent":
      return "em"; // inviter is younger
    case "younger":
      return "anh/chị"; // inviter is older
    case "colleague":
    case "friend":
    case "cousin":
    default:
      return "mình";
  }
}

export const FAMILY_INVITE_TEMPLATES: ReadonlyArray<FamilyInviteTemplate> = Object.freeze([
  {
    key: "family",
    label_vi: "Mời gia đình",
    label_en: "Invite family",
    body_vi:
      "{{inviter_self}} mời {{recipient_address}} thử MercyBlade — học tiếng Anh có phản hồi tiếng Việt. {{inviter_self}} đang dùng và thấy hợp với người Việt mình. Bấm vào link để bắt đầu — phần thưởng: 14 ngày dùng miễn phí cho {{recipient_address}}.",
    body_en:
      "I'm inviting you to try MercyBlade — English learning with Vietnamese feedback. I've been using it and it really fits the way Vietnamese speakers learn. Click to start — your bonus: 14 days free.",
  },
  {
    key: "friend",
    label_vi: "Mời bạn bè",
    label_en: "Invite friends",
    body_vi:
      "Mình đang dùng MercyBlade luyện tiếng Anh, có phản hồi bằng tiếng Việt nên dễ hiểu cho bọn mình. {{recipient_address}} thử cùng nhé — link bên dưới, có 14 ngày miễn phí cho {{recipient_address}}.",
    body_en:
      "I've been using MercyBlade to practice English — feedback is in Vietnamese so it really clicks for us. Try it with me — 14 days free for you on this link.",
  },
  {
    key: "colleague",
    label_vi: "Mời đồng nghiệp",
    label_en: "Invite colleagues",
    body_vi:
      "Em/Mình thấy MercyBlade phù hợp cho người đi làm muốn luyện tiếng Anh giao tiếp. Có phản hồi tiếng Việt và phòng phỏng vấn thử rất sát thực tế. Mời {{recipient_address}} thử — link miễn phí 14 ngày.",
    body_en:
      "MercyBlade is genuinely useful for working professionals practicing English — Vietnamese feedback plus a realistic mock-interview room. 14-day free trial on this link.",
  },
  {
    key: "custom",
    label_vi: "Lời nhắn của riêng tôi",
    label_en: "Write my own",
    body_vi: "{{custom_message}}",
    body_en: "{{custom_message}}",
  },
]);

export interface RenderTemplateInput {
  templateKey: FamilyInviteTemplateKey;
  inviterName: string;
  recipientName: string | null;
  relationship: FamilyInviteRelationship | null;
  customMessage: string | null;
  inviteUrl: string;
}

/**
 * Render a template into VI + EN strings ready for email body /
 * preview. Falls back to the family template when an unknown key
 * is passed.
 */
export function renderInviteBody(input: RenderTemplateInput): {
  vi: string;
  en: string;
} {
  const template =
    FAMILY_INVITE_TEMPLATES.find((t) => t.key === input.templateKey) ??
    FAMILY_INVITE_TEMPLATES[0];

  const vars: Record<string, string> = {
    inviter_name: input.inviterName,
    inviter_self: inviterSelfAddressVi(input.relationship),
    recipient_address: recipientAddressVi(input.relationship),
    recipient_name: input.recipientName ?? recipientAddressVi(input.relationship),
    invite_url: input.inviteUrl,
    custom_message: input.customMessage ?? "",
  };

  return {
    vi: interpolate(template.body_vi, vars),
    en: interpolate(template.body_en, vars),
  };
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{\s*([a-z_]+)\s*\}\}/g, (_match, key: string) => {
    return vars[key] ?? "";
  });
}
