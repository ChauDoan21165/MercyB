/**
 * Semantic Color System for Keyword Highlighting
 * Based on color psychology and meaningful categorization
 * 
 * COLOR PSYCHOLOGY:
 * - Blue (#A8C6E8): Calm, trust, stability (safety/grounding concepts)
 * - Green (#90D4B4): Growth, health, balance (healing/progress concepts)
 * - Soft Orange (#FFD88A): Energy, optimism, warmth (positive/motivational concepts)
 * - Purple (#B8A8D8): Wisdom, insight, depth (cognitive/understanding concepts)
 * - Pink (#F5A6B7): Care, compassion, connection (emotional/relational concepts)
 * - Coral (#FFB8A8): Awareness, caution, intensity (warning/challenging concepts)
 * - Gray-Blue (#A7B2C1): Neutrality, observation, detachment (clinical/observational concepts)
 */

export interface SemanticCategory {
  name: string;
  color: string;
  description: string;
  en: string[];
  vi: string[];
}

export const SEMANTIC_CATEGORIES: SemanticCategory[] = [
  // CATEGORY 1: SAFETY & GROUNDING (Blue - Trust & Stability)
  {
    name: "safety-grounding",
    color: "#A8C6E8",
    description: "Concepts that create safety, stability, and grounding",
    en: [
      "safe", "safety", "secure", "security", "stable", "stability", "grounded", "grounding",
      "calm", "peaceful", "peace", "tranquil", "serene", "settled", "centered",
      "anchor", "foundation", "base", "solid", "reliable", "dependable", "trust"
    ],
    vi: [
      "an toàn", "an toan", "bảo mật", "bao mat", "vững chắc", "vung chac", "ổn định", "on dinh",
      "nền tảng", "nen tang", "bình tĩnh", "binh tinh", "yên bình", "yen binh", "thanh thản", "thanh than",
      "neo", "nền móng", "nen mong", "căn bản", "can ban", "tin cậy", "tin cay", "đáng tin", "dang tin"
    ]
  },

  // CATEGORY 2: HEALING & GROWTH (Green - Health & Balance)
  {
    name: "healing-growth",
    color: "#90D4B4",
    description: "Concepts related to healing, recovery, and personal growth",
    en: [
      "heal", "healing", "recover", "recovery", "restore", "restoration", "renewal",
      "grow", "growth", "develop", "development", "progress", "evolve", "evolution",
      "transform", "transformation", "change", "improve", "improvement", "better",
      "resilience", "resilient", "adapt", "adaptation", "strength", "strengthen", "healthy", "health"
    ],
    vi: [
      "chữa lành", "chua lanh", "hồi phục", "hoi phuc", "phục hồi", "phuc hoi", "khôi phục", "khoi phuc",
      "phát triển", "phat trien", "tăng trưởng", "tang truong", "tiến bộ", "tien bo", "tiến triển", "tien trien",
      "biến đổi", "bien doi", "chuyển hóa", "chuyen hoa", "thay đổi", "thay doi", "cải thiện", "cai thien",
      "khả năng phục hồi", "kha nang phuc hoi", "sức mạnh", "suc manh", "khỏe mạnh", "khoe manh", "sức khỏe", "suc khoe"
    ]
  },

  // CATEGORY 3: POSITIVE ENERGY (Soft Orange - Optimism & Motivation)
  {
    name: "positive-energy",
    color: "#FFD88A",
    description: "Uplifting, energizing, and motivational concepts",
    en: [
      "happy", "happiness", "joy", "joyful", "excited", "excitement", "energized", "energy",
      "motivated", "motivation", "inspired", "inspiration", "hopeful", "hope", "optimistic", "optimism",
      "confident", "confidence", "empowered", "empowerment", "encouraged", "encouragement",
      "enthusiastic", "enthusiasm", "passionate", "passion", "determined", "determination"
    ],
    vi: [
      "vui", "vui vẻ", "vui ve", "hạnh phúc", "hanh phuc", "phấn khích", "phan khich", "nhiệt huyết", "nhiet huyet",
      "động lực", "dong luc", "truyền cảm hứng", "truyen cam hung", "hy vọng", "hy vong", "lạc quan", "lac quan",
      "tự tin", "tu tin", "trao quyền", "trao quyen", "khuyến khích", "khuyen khich", "động viên", "dong vien",
      "nhiệt tình", "nhiet tinh", "đam mê", "dam me", "quyết tâm", "quyet tam"
    ]
  },

  // CATEGORY 4: UNDERSTANDING & INSIGHT (Purple - Wisdom & Depth)
  {
    name: "understanding-insight",
    color: "#B8A8D8",
    description: "Cognitive concepts related to understanding, awareness, and insight",
    en: [
      "understand", "understanding", "comprehend", "comprehension", "realize", "realization",
      "aware", "awareness", "conscious", "consciousness", "mindful", "mindfulness",
      "insight", "wisdom", "knowledge", "learn", "learning", "recognize", "recognition",
      "perceive", "perception", "observe", "observation", "notice", "attention", "focus"
    ],
    vi: [
      "hiểu", "hieu", "thấu hiểu", "thau hieu", "lĩnh hội", "linh hoi", "nhận ra", "nhan ra",
      "ý thức", "y thuc", "nhận thức", "nhan thuc", "chánh niệm", "chanh niem", "tỉnh thức", "tinh thuc",
      "thông sáng", "thong sang", "trí tuệ", "tri tue", "kiến thức", "kien thuc", "học hỏi", "hoc hoi",
      "nhận biết", "nhan biet", "cảm nhận", "cam nhan", "quan sát", "quan sat", "chú ý", "chu y", "tập trung", "tap trung"
    ]
  },

  // CATEGORY 5: CONNECTION & COMPASSION (Pink - Care & Support)
  {
    name: "connection-compassion",
    color: "#F5A6B7",
    description: "Emotional and relational concepts of care, love, and connection",
    en: [
      "love", "loving", "care", "caring", "compassion", "compassionate", "empathy", "empathetic",
      "support", "supportive", "help", "helpful", "kind", "kindness", "gentle", "gentleness",
      "connect", "connection", "relate", "relationship", "bond", "bonding", "together", "togetherness",
      "warm", "warmth", "tender", "tenderness", "affection", "affectionate"
    ],
    vi: [
      "yêu", "yeu", "yêu thương", "yeu thuong", "quan tâm", "quan tam", "từ bi", "tu bi", "đồng cảm", "dong cam",
      "hỗ trợ", "ho tro", "giúp đỡ", "giup do", "tử tế", "tu te", "lòng tốt", "long tot", "dịu dàng", "diu dang",
      "kết nối", "ket noi", "liên hệ", "lien he", "mối quan hệ", "moi quan he", "gắn kết", "gan ket",
      "ấm áp", "am ap", "dịu êm", "diu em", "trìu mến", "triu men"
    ]
  },

  // CATEGORY 6: CHALLENGES & INTENSITY (Coral - Awareness & Caution)
  {
    name: "challenges-intensity",
    color: "#FFB8A8",
    description: "Difficult emotions and challenging states requiring awareness",
    en: [
      "anger", "angry", "frustrated", "frustration", "irritated", "irritation",
      "struggle", "struggling", "difficult", "difficulty", "hard", "challenge", "challenging",
      "pain", "painful", "hurt", "hurting", "suffer", "suffering", "distress",
      "intense", "intensity", "overwhelm", "overwhelming", "crisis", "emergency"
    ],
    vi: [
      "tức giận", "tuc gian", "giận", "gian", "bực bội", "buc boi", "khó chịu", "kho chiu",
      "đấu tranh", "dau tranh", "vật lộn", "vat lon", "khó khăn", "kho khan", "thử thách", "thu thach",
      "đau đớn", "dau don", "đau", "dau", "tổn thương", "ton thuong", "khổ", "kho", "đau khổ", "dau kho",
      "mạnh mẽ", "manh me", "áp đảo", "ap dao", "choáng ngợp", "choang ngop", "khủng hoảng", "khung hoang"
    ]
  },

  // CATEGORY 7: VULNERABILITY & DIFFICULTY (Gray-Blue - Clinical/Neutral)
  {
    name: "vulnerability-difficulty",
    color: "#A7B2C1",
    description: "States of fear, sadness, and vulnerability requiring observation",
    en: [
      "fear", "afraid", "scared", "anxiety", "anxious", "worry", "worried", "stress", "stressed",
      "sad", "sadness", "depressed", "depression", "lonely", "loneliness", "grief", "grieving",
      "vulnerable", "vulnerability", "weak", "weakness", "helpless", "helplessness",
      "shame", "ashamed", "guilt", "guilty", "insecure", "insecurity"
    ],
    vi: [
      "sợ", "so", "sợ hãi", "so hai", "lo âu", "lo au", "lo lắng", "lo lang", "căng thẳng", "cang thang",
      "buồn", "buon", "trầm cảm", "tram cam", "trầm uất", "tram uat", "cô đơn", "co don", "đau buồn", "dau buon",
      "dễ tổn thương", "de ton thuong", "yếu đuối", "yeu duoi", "bất lực", "bat luc",
      "xấu hổ", "xau ho", "tội lỗi", "toi loi", "bất an", "bat an", "thiếu tự tin", "thieu tu tin"
    ]
  },

  // CATEGORY 8: MENTAL HEALTH CONDITIONS (Light Purple - Clinical Awareness)
  {
    name: "mental-health-terms",
    color: "#D8C8E8",
    description: "Clinical and diagnostic terms for mental health conditions",
    en: [
      "adhd", "add", "attention deficit", "hyperactivity", "impulsivity",
      "bipolar", "mania", "manic", "depression", "depressive",
      "schizophrenia", "psychosis", "psychotic", "hallucination", "delusion",
      "ptsd", "trauma", "traumatic", "disorder", "syndrome",
      "ocd", "obsessive", "compulsive", "panic", "phobia"
    ],
    vi: [
      "rối loạn tăng động giảm chú ý", "roi loan tang dong giam chu y", "tăng động", "tang dong", "bốc đồng", "boc dong",
      "lưỡng cực", "luong cuc", "hưng cảm", "hung cam", "trầm cảm", "tram cam",
      "tâm thần phân liệt", "tam than phan liet", "loạn thần", "loan than", "ảo giác", "ao giac", "ảo tưởng", "ao tuong",
      "chấn thương", "chan thuong", "sang chấn", "sang chan", "rối loạn", "roi loan", "hội chứng", "hoi chung",
      "ám ảnh", "am anh", "cưỡng chế", "cuong che", "hoảng loạn", "hoang loan", "ám sợ", "am so"
    ]
  }
];

/**
 * Find the semantic color for a keyword (case-insensitive, partial match)
 * Returns the most specific match (longest matching phrase)
 */
export function getSemanticColor(text: string): string | null {
  if (!text || text.trim().length === 0) return null;
  
  const normalizedText = text.toLowerCase().trim();
  let bestMatch = { color: null as string | null, length: 0 };

  for (const category of SEMANTIC_CATEGORIES) {
    // Check English keywords
    for (const keyword of category.en) {
      const normalizedKeyword = keyword.toLowerCase();
      if (normalizedText === normalizedKeyword || normalizedText.includes(normalizedKeyword)) {
        if (normalizedKeyword.length > bestMatch.length) {
          bestMatch = { color: category.color, length: normalizedKeyword.length };
        }
      }
    }

    // Check Vietnamese keywords
    for (const keyword of category.vi) {
      const normalizedKeyword = keyword.toLowerCase();
      if (normalizedText === normalizedKeyword || normalizedText.includes(normalizedKeyword)) {
        if (normalizedKeyword.length > bestMatch.length) {
          bestMatch = { color: category.color, length: normalizedKeyword.length };
        }
      }
    }
  }

  return bestMatch.color;
}

/**
 * Get all keywords for a specific semantic category
 */
export function getKeywordsByCategory(categoryName: string): string[] {
  const category = SEMANTIC_CATEGORIES.find(cat => cat.name === categoryName);
  if (!category) return [];
  
  return [...category.en, ...category.vi];
}

/**
 * Get the category description for a given keyword
 */
export function getCategoryDescription(keyword: string): string | null {
  const normalizedKeyword = keyword.toLowerCase().trim();
  
  for (const category of SEMANTIC_CATEGORIES) {
    const found = [...category.en, ...category.vi].some(kw => 
      normalizedKeyword === kw.toLowerCase() || normalizedKeyword.includes(kw.toLowerCase())
    );
    
    if (found) {
      return category.description;
    }
  }
  
  return null;
}
