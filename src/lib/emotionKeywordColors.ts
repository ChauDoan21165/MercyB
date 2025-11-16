/**
 * Emotion-Based Keyword Color System
 * Maps keywords to colors based on their emotional/semantic meaning
 * English and Vietnamese translations share the same color
 */

export interface EmotionKeywordGroup {
  emotion: string;
  color: string;
  en: string[];
  vi: string[];
}

export const emotionKeywordGroups: EmotionKeywordGroup[] = [
  {
    emotion: "joy",
    color: "hsl(var(--emotion-joy))",
    en: ["joy", "joys", "happiness", "happy", "delight", "cheerful", "joyful"],
    vi: ["niềm vui", "niem vui", "hạnh phúc", "hanh phuc", "vui", "vui vẻ", "vui ve"]
  },
  {
    emotion: "warmth",
    color: "hsl(var(--emotion-warmth))",
    en: ["warmth", "warm", "softness", "soft", "gentle", "comfort", "cozy", "tenderness", "tender"],
    vi: ["ấm", "am", "mềm mại", "mem mai", "dịu dàng", "diu dang", "thoải mái", "thoai mai"]
  },
  {
    emotion: "peace",
    color: "hsl(var(--emotion-peace))",
    en: ["peace", "peaceful", "calm", "quiet", "serene", "tranquil", "stillness", "steady", "quieter"],
    vi: ["bình an", "binh an", "yên tĩnh", "yen tinh", "lặng", "lang", "thanh thản", "thanh than", "vững", "vung"]
  },
  {
    emotion: "struggle",
    color: "hsl(var(--emotion-struggle))",
    en: ["struggle", "difficulty", "difficult", "challenge", "hard", "burden", "weight"],
    vi: ["khó khăn", "kho khan", "gian nan", "gánh nặng", "ganh nang", "thử thách", "thu thach"]
  },
  {
    emotion: "pain",
    color: "hsl(var(--emotion-pain))",
    en: ["pain", "suffering", "hurt", "ache", "wound", "heartbreak", "discomfort"],
    vi: ["nỗi đau", "noi dau", "đau khổ", "dau kho", "đau", "dau", "tan vỡ", "tan vo"]
  },
  {
    emotion: "strength",
    color: "hsl(var(--emotion-strength))",
    en: ["strength", "strong", "power", "powerful", "courage", "resilience", "endurance"],
    vi: ["sức mạnh", "suc manh", "mạnh", "manh", "can đảm", "can dam", "bền bỉ", "ben bi"]
  },
  {
    emotion: "awareness",
    color: "hsl(var(--emotion-awareness))",
    en: ["awareness", "aware", "presence", "present", "mindful", "attention", "notice", "recognize", "pay attention", "notice", "noticing"],
    vi: ["nhận biết", "nhan biet", "hiện diện", "hien dien", "tỉnh thức", "tinh thuc", "chú ý", "chu y"]
  },
  {
    emotion: "gratitude",
    color: "hsl(var(--emotion-gratitude))",
    en: ["gratitude", "grateful", "thankful", "appreciation", "appreciate"],
    vi: ["biết ơn", "biet on", "lòng biết ơn", "long biet on", "trân trọng", "tran trong"]
  },
  {
    emotion: "honesty",
    color: "hsl(var(--emotion-honesty))",
    en: ["honesty", "honest", "truth", "true", "authentic", "genuine", "integrity"],
    vi: ["trung thực", "trung thuc", "sự thật", "su that", "chân thật", "chan that", "thật", "that", "chính trực", "chinh truc"]
  },
  {
    emotion: "freedom",
    color: "hsl(var(--emotion-freedom))",
    en: ["freedom", "free", "liberation", "release", "independent"],
    vi: ["tự do", "tu do", "giải phóng", "giai phong", "độc lập", "doc lap"]
  },
  {
    emotion: "responsibility",
    color: "hsl(var(--emotion-responsibility))",
    en: ["responsibility", "responsible", "duty", "obligation", "commitment"],
    vi: ["trách nhiệm", "trach nhiem", "nghĩa vụ", "nghia vu", "cam kết", "cam ket"]
  },
  {
    emotion: "action",
    color: "hsl(var(--emotion-action))",
    en: ["choose", "choosing", "chose", "act", "action", "move", "practice", "become", "becoming", "shape", "create", "made", "grows", "allowing", "show up"],
    vi: ["chọn", "chon", "lựa chọn", "lua chon", "hành động", "hanh dong", "di chuyển", "di chuyen", "thực hành", "thuc hanh", "trở thành", "tro thanh"]
  },
  {
    emotion: "connection",
    color: "hsl(var(--emotion-connection))",
    en: ["love", "connection", "belonging", "compassion", "kindness", "devotion", "care", "kind"],
    vi: ["tình yêu", "tinh yeu", "kết nối", "ket noi", "gắn bó", "gan bo", "từ bi", "tu bi", "tử tế", "tu te", "quan tâm", "quan tam"]
  },
  {
    emotion: "release",
    color: "hsl(var(--emotion-release))",
    en: ["release", "let go", "surrender", "accept", "allow", "breathe", "soften"],
    vi: ["buông", "buong", "thả lỏng", "tha long", "chấp nhận", "chap nhan", "cho phép", "cho phep", "hít thở", "hit tho", "mềm lại", "mem lai"]
  },
  {
    emotion: "meaning",
    color: "hsl(var(--emotion-awareness))",
    en: ["meaning", "purpose", "intentional", "value", "believe"],
    vi: ["ý nghĩa", "y nghia", "mục đích", "muc dich", "giá trị", "gia tri"]
  },
  {
    emotion: "moments",
    color: "hsl(var(--emotion-peace))",
    en: ["moment", "moments", "dramatic", "quietly", "distant", "here", "far away", "small", "empty", "rich"],
    vi: ["khoảnh khắc", "khoanh khac", "phút", "phut", "giây", "giay"]
  },
  {
    emotion: "being",
    color: "hsl(var(--emotion-warmth))",
    en: ["plan", "alignment", "watching", "feels", "appears", "need", "discovered"],
    vi: ["kế hoạch", "ke hoach", "cảm giác", "cam giac"]
  }
];

/**
 * Normalize text for consistent matching across different Unicode representations
 * Vietnamese can use composed (NFC) or decomposed (NFD) forms
 */
const normalizeText = (text: string): string => {
  return text.toLowerCase().trim().normalize('NFC');
};

/**
 * Build a flat map of all keywords to their colors
 * This allows fast O(1) lookup
 */
export const buildEmotionColorMap = (): Map<string, string> => {
  const colorMap = new Map<string, string>();
  
  emotionKeywordGroups.forEach(group => {
    // Add English keywords
    group.en.forEach(keyword => {
      const normalized = normalizeText(keyword);
      colorMap.set(normalized, group.color);
    });
    
    // Add Vietnamese keywords with both NFC and NFD normalization
    group.vi.forEach(keyword => {
      const normalizedNFC = normalizeText(keyword);
      const normalizedNFD = keyword.toLowerCase().trim().normalize('NFD');
      colorMap.set(normalizedNFC, group.color);
      colorMap.set(normalizedNFD, group.color);
    });
  });
  
  return colorMap;
};

// Create the color map once
const emotionColorMap = buildEmotionColorMap();

/**
 * Get the color for a keyword based on its emotional meaning
 * Returns the emotion-based color or null if not found
 */
export const getEmotionKeywordColor = (keyword: string): string | null => {
  const normalizedNFC = normalizeText(keyword);
  const normalizedNFD = keyword.toLowerCase().trim().normalize('NFD');
  return emotionColorMap.get(normalizedNFC) || emotionColorMap.get(normalizedNFD) || null;
};

/**
 * Export the highlighted_words format for JSON data files
 */
export const exportHighlightedWords = () => {
  return emotionKeywordGroups.map(group => ({
    en: group.en,
    vi: group.vi,
    color: group.color,
    emotion: group.emotion
  }));
};
