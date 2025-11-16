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
  },
  {
    emotion: "learning",
    color: "hsl(var(--emotion-action))",
    en: ["learn", "learning", "study", "practice", "training", "improve", "improvement", "progress", "mastery", "mastered", "skill", "develop", "developing"],
    vi: ["học", "hoc", "học tập", "hoc tap", "thực hành", "thuc hanh", "luyện tập", "luyen tap", "cải thiện", "cai thien", "tiến bộ", "tien bo", "thành thạo", "thanh thao", "kỹ năng", "ky nang"]
  },
  {
    emotion: "method",
    color: "hsl(var(--emotion-honesty))",
    en: ["method", "approach", "strategy", "technique", "ritual", "routine", "habit", "system", "process", "loop", "repeat"],
    vi: ["phương pháp", "phuong phap", "cách tiếp cận", "cach tiep can", "chiến lược", "chien luoc", "kỹ thuật", "ky thuat", "nghi lễ", "nghi le", "thói quen", "thoi quen", "hệ thống", "he thong"]
  },
  {
    emotion: "focus",
    color: "hsl(var(--emotion-awareness))",
    en: ["focus", "focused", "attention", "concentrate", "concentration", "mindset", "deliberate", "deliberately", "intentional", "mindful"],
    vi: ["tập trung", "tap trung", "chú ý", "chu y", "chánh niệm", "chanh niem", "có chủ ý", "co chu y", "suy nghĩ", "suy nghi", "tâm thế", "tam the"]
  },
  {
    emotion: "quality",
    color: "hsl(var(--emotion-strength))",
    en: ["depth", "deep", "deeply", "quality", "valuable", "excellence", "mastery", "refined", "precise", "thorough"],
    vi: ["chiều sâu", "chieu sau", "sâu", "sau", "chất lượng", "chat luong", "giá trị", "gia tri", "xuất sắc", "xuat sac", "tinh tế", "tinh te", "chính xác", "chinh xac"]
  },
  {
    emotion: "analysis",
    color: "hsl(var(--emotion-awareness))",
    en: ["analyze", "analysis", "examine", "review", "reflect", "reflection", "evaluate", "assess", "measure", "reasoning"],
    vi: ["phân tích", "phan tich", "xem xét", "xem xet", "đánh giá", "danh gia", "suy ngẫm", "suy ngam", "đo lường", "do luong", "lý luận", "ly luan"]
  },
  {
    emotion: "output",
    color: "hsl(var(--emotion-action))",
    en: ["output", "produce", "write", "speak", "express", "expression", "communicate", "create", "build"],
    vi: ["đầu ra", "dau ra", "tạo ra", "tao ra", "viết", "viet", "nói", "noi", "diễn đạt", "dien dat", "giao tiếp", "giao tiep", "xây dựng", "xay dung"]
  },
  {
    emotion: "input",
    color: "hsl(var(--emotion-awareness))",
    en: ["input", "collect", "gather", "listen", "listening", "read", "reading", "absorb", "receive"],
    vi: ["đầu vào", "dau vao", "thu thập", "thu thap", "nghe", "lắng nghe", "lang nghe", "đọc", "doc", "tiếp nhận", "tiep nhan"]
  },
  {
    emotion: "growth",
    color: "hsl(var(--emotion-action))",
    en: ["grow", "growth", "transform", "transforming", "evolve", "develop", "compound", "refine", "improve"],
    vi: ["phát triển", "phat trien", "tăng trưởng", "tang truong", "biến đổi", "bien doi", "tiến hóa", "tien hoa", "cải thiện", "cai thien"]
  },
  {
    emotion: "error",
    color: "hsl(var(--emotion-pain))",
    en: ["error", "errors", "mistake", "mistakes", "weakness", "weaknesses", "flaw", "gap"],
    vi: ["lỗi", "loi", "sai lầm", "sai lam", "điểm yếu", "diem yeu", "khuyết điểm", "khuyet diem", "khoảng trống", "khoang trong"]
  },
  {
    emotion: "goal",
    color: "hsl(var(--emotion-meaning))",
    en: ["goal", "micro-goal", "target", "objective", "aim", "purpose", "tool"],
    vi: ["mục tiêu", "muc tieu", "tiểu mục tiêu", "tieu muc tieu", "đích", "dich", "mục đích", "muc dich", "công cụ", "cong cu"]
  },
  {
    emotion: "recovery",
    color: "hsl(var(--emotion-action))",
    en: ["recovery", "recovering", "healing", "heal", "sobriety", "sober", "overcome", "reclaim", "restore"],
    vi: ["phục hồi", "phuc hoi", "chữa lành", "chua lanh", "hồi phục", "hoi phuc", "tỉnh táo", "tinh tao", "vượt qua", "vuot qua", "lấy lại", "lay lai"]
  },
  {
    emotion: "support",
    color: "hsl(var(--emotion-connection))",
    en: ["support", "help", "assistance", "community", "group", "groups", "peer", "professional", "guidance"],
    vi: ["hỗ trợ", "ho tro", "giúp đỡ", "giup do", "cộng đồng", "cong dong", "nhóm", "nhom", "hướng dẫn", "huong dan", "chuyên gia", "chuyen gia"]
  },
  {
    emotion: "compassion",
    color: "hsl(var(--emotion-warmth))",
    en: ["compassion", "self-compassion", "empathy", "understanding", "acceptance", "forgiveness", "without shame"],
    vi: ["lòng thương", "long thuong", "tự thương", "tu thuong", "cảm thông", "cam thong", "thấu hiểu", "thau hieu", "chấp nhận", "chap nhan", "tha thứ", "tha thu"]
  },
  {
    emotion: "hope",
    color: "hsl(var(--emotion-joy))",
    en: ["hope", "hopeful", "optimism", "inspire", "empower", "empowering", "resilience", "momentum"],
    vi: ["hy vọng", "hy vong", "lạc quan", "lac quan", "truyền cảm hứng", "truyen cam hung", "trao quyền", "trao quyen", "sức bền", "suc ben"]
  },
  {
    emotion: "challenge",
    color: "hsl(var(--emotion-struggle))",
    en: ["struggle", "struggles", "challenge", "challenges", "addiction", "trigger", "triggers", "craving", "relapse"],
    vi: ["đấu tranh", "dau tranh", "thử thách", "thu thach", "nghiện", "nghien", "kích hoạt", "kich hoat", "thèm", "them", "tái phát", "tai phat"]
  },
  {
    emotion: "habits",
    color: "hsl(var(--emotion-action))",
    en: ["habit", "habits", "behavior", "pattern", "routine", "step", "steps", "consistent", "consistency"],
    vi: ["thói quen", "thoi quen", "hành vi", "hanh vi", "mẫu hình", "mau hinh", "nhất quán", "nhat quan", "bước", "buoc"]
  },
  {
    emotion: "celebration",
    color: "hsl(var(--emotion-joy))",
    en: ["celebrate", "milestone", "milestones", "achievement", "victory", "success", "progress"],
    vi: ["ăn mừng", "an mung", "cột mốc", "cot moc", "thành tựu", "thanh tuu", "chiến thắng", "chien thang", "thành công", "thanh cong"]
  },
  {
    emotion: "therapy",
    color: "hsl(var(--emotion-awareness))",
    en: ["therapy", "cognitive behavioral therapy", "cbt", "reframe", "journaling", "journal", "self-awareness", "awareness"],
    vi: ["liệu pháp", "lieu phap", "trị liệu", "tri lieu", "nhận thức hành vi", "nhan thuc hanh vi", "viết nhật ký", "viet nhat ky", "tự nhận thức", "tu nhan thuc"]
  },
  {
    emotion: "control",
    color: "hsl(var(--emotion-strength))",
    en: ["control", "discipline", "willpower", "determination", "commit", "commitment", "dedicated"],
    vi: ["kiểm soát", "kiem soat", "kỷ luật", "ky luat", "ý chí", "y chi", "quyết tâm", "quyet tam", "cam kết", "cam ket"]
  },
  {
    emotion: "influence",
    color: "hsl(var(--emotion-connection))",
    en: ["influence", "influences", "surround", "environment", "positive", "negative", "relationship", "relationships"],
    vi: ["ảnh hưởng", "anh huong", "bao quanh", "môi trường", "moi truong", "tích cực", "tich cuc", "tiêu cực", "tieu cuc", "mối quan hệ", "moi quan he"]
  },
  {
    emotion: "journey",
    color: "hsl(var(--emotion-peace))",
    en: ["journey", "path", "process", "unique", "personal", "experience", "lasting"],
    vi: ["hành trình", "hanh trinh", "con đường", "con duong", "quá trình", "qua trinh", "độc đáo", "doc dao", "cá nhân", "ca nhan", "trải nghiệm", "trai nghiem"]
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
