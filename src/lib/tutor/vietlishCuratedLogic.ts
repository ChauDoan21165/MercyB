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
  {
    id: "mention-about",
    title: "Mention without about",
    explanationVi: "Mention đã mang nghĩa 'nhắc đến/đề cập đến', nên không thêm about ngay sau mention.",
    correctExample: "She mentioned the schedule.",
    trapExample: "She mentioned about the schedule.",
    memoryAid: "Mention + object, không dùng mention about.",
    match: /\b(?:mention|mentions|mentioned|mentioning)\s+about\b/i,
  },
  {
    id: "very-like",
    title: "Like very much",
    explanationVi: "Very thường bổ nghĩa cho tính từ/trạng từ, không đứng trước động từ like theo cách này. Dùng really like hoặc like ... very much.",
    correctExample: "I really like this song.",
    trapExample: "I very like this song.",
    memoryAid: "Động từ like cần really trước nó, hoặc very much sau tân ngữ.",
    match: /\b(?:i|you|we|they|he|she)\s+very\s+likes?\b/i,
  },
  {
    id: "discuss-about",
    title: "Discuss without about",
    explanationVi: "Discuss là ngoại động từ: nói discuss the issue, không nói discuss about the issue.",
    correctExample: "We discussed the plan.",
    trapExample: "We discussed about the plan.",
    memoryAid: "Discuss + object, bỏ about.",
    match: /\b(?:discuss|discusses|discussed|discussing)\s+about\b/i,
  },
  {
    id: "say-tell-person",
    title: "Tell a person, say to a person",
    explanationVi: "Khi có người nghe ngay sau động từ, dùng tell me/her/us...; nếu dùng say thì cần say to me/her/us...",
    correctExample: "She told me the truth.",
    trapExample: "She said me the truth.",
    memoryAid: "Tell + person; say + to + person.",
    match: /\b(?:say|says|said|saying)\s+(?:me|us)\b/i,
  },
  {
    id: "contact-with",
    title: "Contact without with",
    explanationVi: "Contact khi là động từ thường đi trực tiếp với người/văn phòng cần liên hệ, không thêm with.",
    correctExample: "Please contact the manager.",
    trapExample: "Please contact with the manager.",
    memoryAid: "Contact + person/place, bỏ with.",
    match: /\b(?:(?:i|you|we|they|he|she|it|to|will|can|could|should|must|please)\s+contact|contacts|contacted|contacting)\s+with\b/i,
  },
  {
    id: "research-about",
    title: "Research without about",
    explanationVi: "Research khi là động từ thường nhận tân ngữ trực tiếp; không cần about ngay sau research.",
    correctExample: "They researched the market.",
    trapExample: "They researched about the market.",
    memoryAid: "Research + topic, không dùng research about.",
    match: /\b(?:(?:i|you|we|they|he|she|it|to|will|can|could|should|must|please)\s+research|researches|researched|researching)\s+about\b/i,
  },
  {
    id: "explain-to-me",
    title: "Explain something to someone",
    explanationVi: "Explain không đi với người nghe ngay sau động từ. Nói explain something to me, hoặc explain to me why...",
    correctExample: "Can you explain the rule to me?",
    trapExample: "Can you explain me the rule?",
    memoryAid: "Explain + thing + to + person.",
    match: /\b(?:explain|explains|explained|explaining)\s+(?:me|you|him|her|us|them)\s+(?:the|this|that|why|how|what|when|where|a|an)\b/i,
  },
  {
    id: "marry-with",
    title: "Marry without with",
    explanationVi: "Marry/get married đã đủ nghĩa kết hôn với ai; với marry someone không thêm with.",
    correctExample: "She married her classmate.",
    trapExample: "She married with her classmate.",
    memoryAid: "Marry + person; get married to + person.",
    match: /\b(?:marry|marries|married|marrying)\s+with\b/i,
  },
  {
    id: "go-home",
    title: "Go home without to",
    explanationVi: "Home là trạng từ chỉ hướng trong cụm go home, nên không dùng to trước home.",
    correctExample: "I went home after class.",
    trapExample: "I went to home after class.",
    memoryAid: "Go home, come home, get home: không có to.",
    match: /\b(?:go|goes|went|going|come|comes|came|coming|get|gets|got|getting)\s+to\s+home\b/i,
  },
  {
    id: "since-for-duration",
    title: "For durations, since start points",
    explanationVi: "Dùng for với khoảng thời gian kéo dài như two years; dùng since với mốc bắt đầu như 2020 hoặc Monday.",
    correctExample: "I have lived here for two years.",
    trapExample: "I have lived here since two years.",
    memoryAid: "For + duration; since + starting point.",
    match: /\bsince\s+(?:a|an|one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+(?:second|minute|hour|day|week|month|year|decade)s?\b(?!\s+ago)/i,
  },
  {
    id: "age-have-be",
    title: "Use be for age",
    explanationVi: "Tiếng Việt nói 'có ... tuổi', nhưng tiếng Anh diễn đạt tuổi bằng động từ be: I am 20 years old.",
    correctExample: "I am 20 years old.",
    trapExample: "I have 20 years old.",
    memoryAid: "Tuổi trong tiếng Anh dùng be, không dùng have.",
    match: /\b(?:i|you|we|they)\s+have\s+\d{1,3}\s+years?\s+old\b|\b(?:he|she|it)\s+has\s+\d{1,3}\s+years?\s+old\b/i,
  },
  {
    id: "double-comparative",
    title: "Avoid double comparatives",
    explanationVi: "So sánh hơn chỉ dùng một dấu hiệu: more + adjective hoặc adjective-er, không dùng cả hai cùng lúc.",
    correctExample: "This exercise is easier than the last one.",
    trapExample: "This exercise is more easier than the last one.",
    memoryAid: "More hoặc -er, chọn một.",
    match: /\bmore\s+(?:easier|harder|faster|slower|cheaper|older|younger|taller|shorter|bigger|smaller|stronger|weaker|richer|poorer|colder|hotter|warmer|closer|quicker|better|worse)\s+than\b/i,
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
