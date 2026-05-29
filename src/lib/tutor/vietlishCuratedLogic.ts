export type VietlishCuratedPattern = {
  id: string;
  title: string;
  explanationVi: string;
  correctExample: string;
  trapExample: string;
  memoryAid: string;
  match: RegExp;
};

export const VIETLISH_CURATED_PATTERNS: readonly VietlishCuratedPattern[] = [
  {
    id: "missing-articles",
    title: "Missing articles: a/an/the",
    explanationVi: "Tiếng Việt không dùng mạo từ như a/an/the, nhưng tiếng Anh thường cần a/an trước danh từ đếm được số ít.",
    correctExample: "I bought a hat yesterday.",
    trapExample: "I bought hat yesterday.",
    memoryAid: "Một vật đếm được số ít thường cần a/an trước danh từ.",
    match: /\b(?:bought|buy|have|has|is|am|are)\s+(?:hat|teacher|book|car|apple|job)\b/i,
  },
  {
    id: "unmarked-past-tense",
    title: "Unmarked past tense",
    explanationVi: "Khi có yesterday, last week, ago..., tiếng Anh thường đổi động từ sang quá khứ.",
    correctExample: "I bought a hat yesterday.",
    trapExample: "I buy a hat yesterday.",
    memoryAid: "Có mốc quá khứ thì kiểm tra động từ quá khứ.",
    match: /\b(?:yesterday|last|ago)\b.*\b(?:buy|go|eat|have|do|see)\b|\b(?:buy|go|eat|have|do|see)\b.*\b(?:yesterday|last|ago)\b/i,
  },
  {
    id: "plural-s",
    title: "Plural -s",
    explanationVi: "Khi có two/many/some/several..., danh từ đếm được thường cần số nhiều.",
    correctExample: "I have two books.",
    trapExample: "I have two book.",
    memoryAid: "Từ chỉ số lượng nhiều kéo danh từ đếm được sang số nhiều.",
    match: /\b(?:two|three|many|some|several|a few)\s+(?:book|student|friend|day|hour|question)\b/i,
  },
  {
    id: "topic-comment-fronting",
    title: "Topic-comment fronting",
    explanationVi: "Tiếng Việt có thể đưa chủ đề lên đầu câu, nhưng tiếng Anh cơ bản thường cần trật tự Chủ ngữ + Động từ + Tân ngữ.",
    correctExample: "I like this book.",
    trapExample: "This book I like.",
    memoryAid: "Câu tiếng Anh cơ bản đi theo S + V + O.",
    match: /\b(?:this book|english|that movie|this lesson)\s+i\s+(?:like|study|watch|learn)\b/i,
  },
  {
    id: "preposition-in-on-at",
    title: "In/on/at preposition transfer",
    explanationVi: "Tiếng Việt dùng một từ như ở/vào linh hoạt, nhưng tiếng Anh tách in, on, at theo nơi chốn và thời gian.",
    correctExample: "I work at the office.",
    trapExample: "I work in office.",
    memoryAid: "at cho điểm/nơi cụ thể, in cho không gian bao quanh, on cho bề mặt/ngày.",
    match: /\b(?:in office|on night|at monday|in monday|at the morning)\b/i,
  },
  {
    id: "interesting-interested",
    title: "Interesting/interested adjective trap",
    explanationVi: "Interesting mô tả vật/người gây thú vị; interested mô tả cảm giác của người.",
    correctExample: "I am interested in English.",
    trapExample: "I am interesting in English.",
    memoryAid: "Người cảm thấy: interested. Thứ gây cảm giác: interesting.",
    match: /\bi am interesting in\b|\bi feel interesting\b/i,
  },
  {
    id: "word-for-word-order",
    title: "Word-for-word Vietnamese order",
    explanationVi: "Dịch từng chữ từ tiếng Việt sang tiếng Anh dễ làm sai vị trí động từ, tân ngữ hoặc trạng từ.",
    correctExample: "I usually drink coffee in the morning.",
    trapExample: "I in the morning usually drink coffee.",
    memoryAid: "Đặt chủ ngữ và động từ chính gần nhau trước, rồi thêm chi tiết.",
    match: /\bi\s+(?:in the morning|every day|yesterday)\s+(?:usually\s+)?(?:drink|study|go|eat)\b/i,
  },
  {
    id: "countable-uncountable",
    title: "Countable/uncountable nouns",
    explanationVi: "Một số danh từ tiếng Anh không đếm trực tiếp như advice, information, homework; không thêm a hoặc -s như danh từ đếm được.",
    correctExample: "She gave me some advice.",
    trapExample: "She gave me an advice.",
    memoryAid: "Với danh từ không đếm được, dùng some/a piece of thay vì a hoặc -s.",
    match: /\b(?:an advice|advices|an information|informations|homeworks)\b/i,
  },
];

export function findCuratedLogicPattern(input: string): VietlishCuratedPattern | null {
  const normalized = input.replace(/\s+/g, " ").trim();
  if (!normalized) return null;
  return VIETLISH_CURATED_PATTERNS.find((pattern) => pattern.match.test(normalized)) ?? null;
}

export function buildLongTailLogicFallback(sentence: string) {
  // long-tail; expand curated library to absorb common fallback cases before this path grows.
  return {
    title: "Long-tail Vietlish check",
    explanationVi: "Mercy chưa có thẻ logic cố định cho câu này. Đây là đường dự phòng cho các mẫu ít gặp.",
    correctExample: sentence.trim(),
    trapExample: sentence.trim(),
    memoryAid: "Ghi lại mẫu này nếu người học gặp thường xuyên, rồi nâng cấp thành thẻ curated.",
  };
}
