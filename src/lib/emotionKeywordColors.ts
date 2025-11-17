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
    color: "#ffeb99", // Soft lemon yellow
    en: ["joy", "joys", "happiness", "happy", "delight", "cheerful", "joyful"],
    vi: ["niềm vui", "niem vui", "hạnh phúc", "hanh phuc", "vui", "vui vẻ", "vui ve"]
  },
  {
    emotion: "warmth",
    color: "#ff9999", // Soft coral red
    en: ["warmth", "warm", "softness", "soft", "gentle", "comfort", "cozy", "tenderness", "tender"],
    vi: ["ấm", "am", "mềm mại", "mem mai", "dịu dàng", "diu dang", "thoải mái", "thoai mai"]
  },
  {
    emotion: "peace",
    color: "#99ddcc", // Soft mint turquoise
    en: ["peace", "peaceful", "calm", "quiet", "serene", "tranquil", "stillness", "steady", "quieter"],
    vi: ["bình an", "binh an", "yên tĩnh", "yen tinh", "lặng", "lang", "thanh thản", "thanh than", "vững", "vung"]
  },
  {
    emotion: "struggle",
    color: "#c2b3d4", // Soft dusty purple
    en: ["struggle", "difficulty", "difficult", "challenge", "hard", "burden", "weight"],
    vi: ["khó khăn", "kho khan", "gian nan", "gánh nặng", "ganh nang", "thử thách", "thu thach"]
  },
  {
    emotion: "pain",
    color: "#e6b3cc", // Soft mauve
    en: ["pain", "suffering", "hurt", "ache", "wound", "heartbreak", "discomfort"],
    vi: ["nỗi đau", "noi dau", "đau khổ", "dau kho", "đau", "dau", "tan vỡ", "tan vo"]
  },
  {
    emotion: "strength",
    color: "#ffb366", // Soft peach orange
    en: ["strength", "strong", "power", "powerful", "courage", "resilience", "endurance"],
    vi: ["sức mạnh", "suc manh", "mạnh", "manh", "can đảm", "can dam", "bền bỉ", "ben bi"]
  },
  {
    emotion: "awareness",
    color: "#99ccff", // Soft sky blue
    en: ["awareness", "aware", "presence", "present", "mindful", "attention", "notice", "recognize", "pay attention", "notice", "noticing"],
    vi: ["nhận biết", "nhan biet", "hiện diện", "hien dien", "tỉnh thức", "tinh thuc", "chú ý", "chu y"]
  },
  {
    emotion: "gratitude",
    color: "#ffc299", // Soft apricot orange
    en: ["gratitude", "grateful", "thankful", "appreciation", "appreciate"],
    vi: ["biết ơn", "biet on", "lòng biết ơn", "long biet on", "trân trọng", "tran trong"]
  },
  {
    emotion: "honesty",
    color: "#99d6ff", // Soft cerulean blue
    en: ["honesty", "honest", "truth", "true", "authentic", "genuine", "integrity"],
    vi: ["trung thực", "trung thuc", "sự thật", "su that", "chân thật", "chan that", "thật", "that", "chính trực", "chinh truc"]
  },
  {
    emotion: "freedom",
    color: "#d4c5f9", // Soft periwinkle
    en: ["freedom", "free", "liberation", "release", "independent"],
    vi: ["tự do", "tu do", "giải phóng", "giai phong", "độc lập", "doc lap"]
  },
  {
    emotion: "responsibility",
    color: "#c9e4ca", // Soft pistachio green
    en: ["responsibility", "responsible", "duty", "obligation", "commitment"],
    vi: ["trách nhiệm", "trach nhiem", "nghĩa vụ", "nghia vu", "cam kết", "cam ket"]
  },
  {
    emotion: "action",
    color: "#a8d5ba", // Soft sage green
    en: ["choose", "choosing", "chose", "act", "action", "move", "practice", "become", "becoming", "shape", "create", "made", "grows", "allowing", "show up"],
    vi: ["chọn", "chon", "lựa chọn", "lua chon", "hành động", "hanh dong", "di chuyển", "di chuyen", "thực hành", "thuc hanh", "trở thành", "tro thanh"]
  },
  {
    emotion: "connection",
    color: "#ff99cc", // Soft rose pink
    en: ["love", "connection", "belonging", "compassion", "kindness", "devotion", "care", "kind"],
    vi: ["tình yêu", "tinh yeu", "kết nối", "ket noi", "gắn bó", "gan bo", "từ bi", "tu bi", "tử tế", "tu te", "quan tâm", "quan tam"]
  },
  {
    emotion: "transformation",
    color: "#ccb3ff", // Soft violet
    en: ["transformation", "transform", "growth", "change", "evolve", "shift", "transition"],
    vi: ["biến đổi", "bien doi", "chuyển đổi", "chuyen doi", "phát triển", "phat trien", "thay đổi", "thay doi"]
  },
  {
    emotion: "hope",
    color: "#ffd699", // Soft golden yellow
    en: ["hope", "hopeful", "optimism", "optimistic", "potential", "possibility", "future"],
    vi: ["hy vọng", "hy vong", "lạc quan", "lac quan", "tiềm năng", "tiem nang", "tương lai", "tuong lai"]
  },
  {
    emotion: "vulnerability",
    color: "#ffd4e5", // Soft baby pink
    en: ["vulnerability", "vulnerable", "sensitive", "fragile", "exposed", "tender"],
    vi: ["mỏng manh", "mong manh", "nhạy cảm", "nhay cam", "dễ tổn thương", "de ton thuong"]
  },
  {
    emotion: "acceptance",
    color: "#c2e0c6", // Soft sea green
    en: ["acceptance", "accept", "allow", "embrace", "welcome", "receive"],
    vi: ["chấp nhận", "chap nhan", "cho phép", "cho phep", "đón nhận", "don nhan"]
  },
  {
    emotion: "clarity",
    color: "#b3e0f2", // Soft aqua cyan
    en: ["clarity", "clear", "understanding", "insight", "wisdom", "see", "vision"],
    vi: ["rõ ràng", "ro rang", "hiểu biết", "hieu biet", "cái nhìn", "cai nhin", "thấy", "thay"]
  },
  {
    emotion: "balance",
    color: "#c2d4dd", // Soft slate blue
    en: ["balance", "harmony", "equilibrium", "centered", "stable", "steady"],
    vi: ["cân bằng", "can bang", "hài hòa", "hai hoa", "ổn định", "on dinh"]
  },
  {
    emotion: "trust",
    color: "#b3d4e6", // Soft powder blue
    en: ["trust", "faith", "believe", "confidence", "rely", "depend"],
    vi: ["tin tưởng", "tin tuong", "đức tin", "duc tin", "tin cậy", "tin cay", "tin"]
  },
  {
    emotion: "purpose",
    color: "#f9d5a7", // Soft sand
    en: ["purpose", "meaning", "mission", "calling", "intention", "goal"],
    vi: ["mục đích", "muc dich", "ý nghĩa", "y nghia", "sứ mệnh", "su menh"]
  },
  {
    emotion: "patience",
    color: "#d4f0d4", // Soft celadon green
    en: ["patience", "patient", "wait", "endure", "tolerate", "persevere"],
    vi: ["kiên nhẫn", "kien nhan", "chờ đợi", "cho doi", "chịu đựng", "chiu dung"]
  },
  {
    emotion: "inspiration",
    color: "#ffe6b3", // Soft champagne
    en: ["inspiration", "inspire", "motivate", "encourage", "uplift"],
    vi: ["cảm hứng", "cam hung", "truyền cảm hứng", "truyen cam hung", "khuyến khích", "khuyen khich"]
  },
  {
    emotion: "philosophy",
    color: "#e6b3ff", // Soft orchid
    en: ["philosophy", "philosophical", "ethics", "morality", "virtue", "good", "right"],
    vi: ["triết học", "triet hoc", "triết lý", "triet ly", "đạo đức", "dao duc", "đức hạnh", "duc hanh"]
  },
  {
    emotion: "curiosity",
    color: "#e6ccff", // Soft lilac
    en: ["curious", "curiosity", "wonder", "question", "explore", "discover"],
    vi: ["tò mò", "to mo", "hiếu kỳ", "hieu ky", "khám phá", "kham pha"]
  },
  {
    emotion: "resilience",
    color: "#ffb3b3", // Soft salmon
    en: ["resilience", "resilient", "persevere", "persist", "overcome", "endure"],
    vi: ["kiên cường", "kien cuong", "bền bỉ", "ben bi", "vượt qua", "vuot qua"]
  },
  {
    emotion: "grammar-language",
    color: "#c9a0dc", // Soft amethyst
    en: ["passive", "active", "voice", "tense", "grammar", "sentence", "sentences", "verb", "pattern", "patterns", "structure", "form", "construction", "usage", "communication", "reports", "report", "documents", "document", "explanation", "explanations", "clarity", "professionalism", "professional", "sent", "solved", "cleaned", "converted", "converting", "convert", "practice", "essential", "common", "simple", "quickly", "well", "avoid", "overusing", "mention", "adds", "matters", "doer", "action", "person", "yesterday", "problem", "office", "someone", "used", "when", "only", "adds", "work"],
    vi: ["bị động", "bi dong", "chủ động", "chu dong", "giọng", "giong", "thì", "thi", "ngữ pháp", "ngu phap", "câu", "cau", "động từ", "dong tu", "mẫu", "mau", "cấu trúc", "cau truc", "hình thức", "hinh thuc", "xây dựng", "xay dung", "cách dùng", "cach dung", "giao tiếp", "giao tiep", "báo cáo", "bao cao", "tài liệu", "tai lieu", "giải thích", "giai thich", "rõ ràng", "ro rang", "chuyên nghiệp", "chuyen nghiep", "gửi", "gui", "đã gửi", "da gui", "giải quyết", "giai quyet", "đã giải quyết", "da giai quyet", "dọn dẹp", "don dep", "chuyển đổi", "chuyen doi", "luyện tập", "luyen tap", "cần thiết", "can thiet", "phổ biến", "pho bien", "đơn giản", "don gian", "nhanh chóng", "nhanh chong", "tốt", "tot", "tránh", "tranh", "dùng quá nhiều", "dung qua nhieu", "đề cập", "de cap", "thêm vào", "them vao", "quan trọng", "quan trong", "người làm", "nguoi lam", "hành động", "hanh dong", "người", "nguoi", "hôm qua", "hom qua", "vấn đề", "van de", "văn phòng", "van phong", "ai đó", "ai do", "được dùng", "duoc dung", "khi", "chỉ", "chi", "công việc", "cong viec"]
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
