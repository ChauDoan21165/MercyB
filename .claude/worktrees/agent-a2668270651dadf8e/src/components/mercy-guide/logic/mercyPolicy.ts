/**
 * Path: src/components/mercy-guide/logic/mercyPolicy.ts
 */

export type MercyPolicyReply = {
  en: string;
  vi: string;
};

export type ForbiddenGuideClaimType =
  | 'pronunciation_guide_claim'
  | 'toddler_policy_claim';

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

function stripVietnamese(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function hasAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

const TODDLER_POLICY_PATTERNS: RegExp[] = [
  /\bcan my 2 year old use this app\b/,
  /\bcan my 3 year old use this app\b/,
  /\bcan this app help my 2 year old\b/,
  /\bcan this app help my 3 year old\b/,
  /\bis this app okay for toddlers\b/,
  /\bis this app okay for a toddler\b/,
  /\bis this app suitable for toddlers\b/,
  /\bcan a toddler use this app\b/,
  /\bcan my toddler use this app\b/,
  /\bmy 2 year old use this app\b/,
  /\bmy 3 year old use this app\b/,
  /\bapp nay co giup con toi 2 tuoi khong\b/,
  /\bapp nay co giup con toi 3 tuoi khong\b/,
  /\btre 2 tuoi dung app nay duoc khong\b/,
  /\btre 3 tuoi dung app nay duoc khong\b/,
  /\bbe 2 tuoi dung app nay duoc khong\b/,
  /\bbe 3 tuoi dung app nay duoc khong\b/,
  /\bcon toi 2 tuoi dung app nay duoc khong\b/,
  /\bcon toi 3 tuoi dung app nay duoc khong\b/,
  /\bapp nay co hop cho tre 2 tuoi khong\b/,
  /\bapp nay co hop cho be 2 tuoi khong\b/,
];

const PRONUNCIATION_GUIDE_PATTERNS: RegExp[] = [
  /\bcorrect my pronunciation\b/,
  /\bcheck my pronunciation\b/,
  /\bcan you correct my pronunciation\b/,
  /\bcan you check my pronunciation\b/,
  /\bhelp my pronunciation\b/,
  /\bhelp me pronounce\b/,
  /\blisten to my pronunciation\b/,
  /\blisten to me\b/,
  /\bcan you hear me\b/,
  /\bare you listening\b/,
  /\bhow to pronounce\b/,
  /\bpronunciation help\b/,
  /\bspeaking practice\b/,
  /\bsua phat am\b/,
  /\bchinh phat am\b/,
  /\bgiup phat am\b/,
  /\bhuong dan phat am\b/,
  /\bban sua phat am cho toi\b/,
  /\bsua phat am cho toi\b/,
  /\bban co the sua phat am\b/,
  /\bgiup toi sua phat am\b/,
  /\bphat am cho toi\b/,
  /\bban co nghe toi khong\b/,
  /\bnghe toi khong\b/,
  /\bban giup toi sua phat am duoc khong\b/,
  /\bban sua phat am giup toi nhe\b/,
  /\bgiup toi phat am\b/,
  /\bkiem tra phat am cho toi\b/,
];

const FORBIDDEN_GUIDE_AUDIO_CLAIMS: RegExp[] = [
  /\bi can hear you here\b/i,
  /\bi can listen to you here\b/i,
  /\bi can hear your audio here\b/i,
  /\bi can listen to your audio here\b/i,
  /\bi can correct your pronunciation here\b/i,
  /\bi can check your pronunciation here\b/i,
  /\bi can analyze your pronunciation here\b/i,
];

const FORBIDDEN_TODDLER_CLAIMS: RegExp[] = [
  /\bnot suitable for very young children\b/i,
  /\bnot suitable for young children\b/i,
  /\bunsuitable for very young children\b/i,
  /\bunsuitable for young children\b/i,
  /\ba 2-year-old can use this alone\b/i,
  /\ba 2 year old can use this alone\b/i,
  /\ba toddler can use this alone\b/i,
  /\byour child can use this alone\b/i,
  /\bcan use it alone\b/i,
  /\buse it independently\b/i,
];

export function isToddlerPolicyQuestion(input: string): boolean {
  const text = normalize(input);
  const stripped = stripVietnamese(text);

  return (
    hasAny(text, TODDLER_POLICY_PATTERNS) ||
    hasAny(stripped, TODDLER_POLICY_PATTERNS)
  );
}

export function isPronunciationGuideQuestion(input: string): boolean {
  const text = normalize(input);
  const stripped = stripVietnamese(text);

  return (
    hasAny(text, PRONUNCIATION_GUIDE_PATTERNS) ||
    hasAny(stripped, PRONUNCIATION_GUIDE_PATTERNS)
  );
}

export function getToddlerPolicyReply(): MercyPolicyReply {
  return {
    en: 'Yes, Mercy Blade can be used for toddlers with adult guidance. It should not be used independently by a very young child.',
    vi: 'Có, Mercy Blade có thể dùng cho trẻ nhỏ khi có người lớn hướng dẫn. Một em bé còn rất nhỏ không nên tự dùng một mình.',
  };
}

export function getGuidePronunciationPolicyReply(): MercyPolicyReply {
  return {
    en: 'I can guide you here, but pronunciation listening and correction happens in Speak. Please open Speak to practice and get pronunciation help.',
    vi: 'Mình có thể hướng dẫn bạn ở đây, nhưng việc nghe và sửa phát âm diễn ra trong Speak. Hãy mở Speak để luyện tập và nhận hỗ trợ phát âm.',
  };
}

export function getGuidePronunciationRepairReply(): MercyPolicyReply {
  return {
    en: 'Sorry I missed that. For pronunciation listening and correction, please use Speak. I can help you open Speak if you want.',
    vi: 'Xin lỗi nhé, mình đã bỏ lỡ tin nhắn đó. Với hỗ trợ nghe và sửa phát âm, vui lòng dùng Speak. Mình có thể giúp bạn mở Speak nếu bạn muốn.',
  };
}

export function getForbiddenGuideClaimType(
  answer: string
): ForbiddenGuideClaimType | null {
  if (hasAny(answer, FORBIDDEN_GUIDE_AUDIO_CLAIMS)) {
    return 'pronunciation_guide_claim';
  }

  if (hasAny(answer, FORBIDDEN_TODDLER_CLAIMS)) {
    return 'toddler_policy_claim';
  }

  return null;
}

export function getSafeGuidePolicyOverrideForViolation({
  violationType,
}: {
  violationType: ForbiddenGuideClaimType;
}): MercyPolicyReply {
  if (violationType === 'toddler_policy_claim') {
    return getToddlerPolicyReply();
  }

  return getGuidePronunciationPolicyReply();
}