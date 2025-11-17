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
  // A. CORE EMOTIONAL STATES
  
  // 1. Calm / Peace / Safety
  {
    emotion: "calm-peace",
    color: "#A8C6E8",
    en: ["calm", "peaceful", "relaxed", "content", "centered", "grounded", "safe", "satisfied", "balanced", "secure"],
    vi: ["bình tĩnh", "binh tinh", "yên bình", "yen binh", "thư giãn", "thu gian", "hài lòng", "hai long", "trung tâm", "trung tam", "nền tảng", "nen tang", "an toàn", "an toan", "thỏa mãn", "thoa man", "cân bằng", "can bang", "vững chắc", "vung chac"]
  },
  
  // 2. Happy / Joy / Confidence
  {
    emotion: "happy-joy",
    color: "#FFD88A",
    en: ["happy", "joyful", "excited", "hopeful", "cheerful", "optimistic", "grateful", "proud", "inspired", "confident"],
    vi: ["vui", "vui vẻ", "vui ve", "phấn khích", "phan khich", "hy vọng", "hy vong", "phấn chấn", "phan chan", "lạc quan", "lac quan", "biết ơn", "biet on", "tự hào", "tu hao", "truyền cảm hứng", "truyen cam hung", "tự tin", "tu tin"]
  },
  
  // 3. Love / Connection / Warmth
  {
    emotion: "love-connection",
    color: "#F5A6B7",
    en: ["loving", "compassionate", "affectionate", "intimate", "connected", "tender", "empathetic", "supportive", "caring", "warm"],
    vi: ["yêu thương", "yeu thuong", "từ bi", "tu bi", "trìu mến", "triu men", "thân mật", "than mat", "kết nối", "ket noi", "dịu dàng", "diu dang", "đồng cảm", "dong cam", "hỗ trợ", "ho tro", "quan tâm", "quan tam", "ấm áp", "am ap"]
  },
  
  // 4. Anger / Frustration
  {
    emotion: "anger",
    color: "#D96F6F",
    en: ["angry", "frustrated", "irritated", "annoyed", "bitter", "resentful", "hostile", "furious", "enraged", "defensive"],
    vi: ["tức giận", "tuc gian", "bực bội", "buc boi", "khó chịu", "kho chiu", "phiền", "phien", "cay đắng", "cay dang", "oán giận", "oan gian", "thù địch", "thu dich", "giận dữ", "gian du", "phẫn nộ", "phan no", "phòng thủ", "phong thu"]
  },
  
  // 5. Sadness / Loss / Vulnerability
  {
    emotion: "sadness",
    color: "#8FA3C8",
    en: ["sad", "lonely", "heartbroken", "disappointed", "grieving", "hopeless", "numb", "miserable", "lost", "vulnerable"],
    vi: ["buồn", "buon", "cô đơn", "co don", "tan vỡ", "tan vo", "thất vọng", "that vong", "đau buồn", "dau buon", "vô vọng", "vo vong", "tê liệt", "te liet", "khổ sở", "kho so", "lạc lối", "lac loi", "dễ tổn thương", "de ton thuong"]
  },
  
  // 6. Fear / Anxiety
  {
    emotion: "fear-anxiety",
    color: "#A7B2C1",
    en: ["afraid", "anxious", "worried", "stressed", "tense", "overwhelmed", "panicked", "insecure", "hesitant", "apprehensive"],
    vi: ["sợ", "so", "lo lắng", "lo lang", "lo âu", "lo au", "căng thẳng", "cang thang", "căng", "cang", "áp đảo", "ap dao", "hoảng loạn", "hoang loan", "bất an", "bat an", "do dự", "do du", "e ngại", "e ngai"]
  },
  
  // 7. Shame / Guilt
  {
    emotion: "shame-guilt",
    color: "#B09BB2",
    en: ["ashamed", "guilty", "embarrassed", "inferior", "unworthy", "regretful", "humiliated", "self-critical", "remorseful", "inadequate"],
    vi: ["xấu hổ", "xau ho", "tội lỗi", "toi loi", "bối rối", "boi roi", "tự ti", "tu ti", "không xứng đáng", "khong xung dang", "hối hận", "hoi han", "nhục nhã", "nhuc nha", "tự phê phán", "tu phe phan", "ăn năn", "an nan", "không đủ", "khong du"]
  },
  
  // 8. Motivation / Drive
  {
    emotion: "motivation",
    color: "#79C7B4",
    en: ["motivated", "energized", "determined", "productive", "focused", "ambitious", "driven", "empowered", "ready", "bold"],
    vi: ["có động lực", "co dong luc", "tràn đầy năng lượng", "tran day nang luong", "quyết tâm", "quyet tam", "năng suất", "nang suat", "tập trung", "tap trung", "tham vọng", "tham vong", "thúc đẩy", "thuc day", "trao quyền", "trao quyen", "sẵn sàng", "san sang", "táo bạo", "tao bao"]
  },
  
  // 9. Curiosity / Creativity
  {
    emotion: "curiosity",
    color: "#C5B7F2",
    en: ["curious", "open-minded", "interested", "engaged", "playful", "adventurous", "intrigued", "stimulated", "creative", "reflective"],
    vi: ["tò mò", "to mo", "cởi mở", "coi mo", "quan tâm", "quan tam", "tham gia", "tham gia", "vui tươi", "vui tuoi", "phiêu lưu", "phieu luu", "hấp dẫn", "hap dan", "kích thích", "kich thich", "sáng tạo", "sang tao", "phản ánh", "phan anh"]
  },
  
  // 10. Healing / Growth
  {
    emotion: "healing-growth",
    color: "#A6D7A1",
    en: ["healing", "growing", "accepting", "recovering", "renewed", "transforming", "rebuilding", "strengthening", "letting-go", "reassured"],
    vi: ["chữa lành", "chua lanh", "phát triển", "phat trien", "chấp nhận", "chap nhan", "hồi phục", "hoi phuc", "đổi mới", "doi moi", "biến đổi", "bien doi", "xây dựng lại", "xay dung lai", "củng cố", "cung co", "buông bỏ", "buong bo", "yên tâm", "yen tam"]
  },
  
  // B. ADDITIONAL ADJECTIVES
  
  // Strengths / Personality
  {
    emotion: "strength-personality",
    color: "#8EBE8E",
    en: ["resilient", "patient", "honest", "brave", "compassionate", "insightful", "wise", "mindful", "purposeful", "generous", "humble", "gentle", "reliable", "steady", "devoted", "loyal", "sincere", "courageous", "flexible", "adaptable"],
    vi: ["kiên cường", "kien cuong", "kiên nhẫn", "kien nhan", "trung thực", "trung thuc", "dũng cảm", "dung cam", "nhân từ", "nhan tu", "sâu sắc", "sau sac", "khôn ngoan", "khon ngoan", "chánh niệm", "chanh niem", "có mục đích", "co muc dich", "rộng lượng", "rong luong", "khiêm tốn", "khiem ton", "hiền lành", "hien lanh", "đáng tin cậy", "dang tin cay", "vững vàng", "vung vang", "tận tụy", "tan tuy", "trung thành", "trung thanh", "chân thành", "chan thanh", "can đảm", "can dam", "linh hoạt", "linh hoat", "thích nghi", "thich nghi"]
  },
  
  // Negative / Difficult States
  {
    emotion: "difficult-states",
    color: "#C7CDE0",
    en: ["confused", "unsure", "distracted", "drained", "fatigued", "restless", "bored", "apathetic", "disconnected", "disoriented", "jealous", "envious", "possessive", "suspicious", "distrustful", "impatient", "moody", "cynical", "pessimistic", "impulsive"],
    vi: ["bối rối", "boi roi", "không chắc", "khong chac", "mất tập trung", "mat tap trung", "kiệt sức", "kiet suc", "mệt mỏi", "met moi", "bồn chồn", "bon chon", "chán", "chan", "thờ ơ", "tho o", "mất kết nối", "mat ket noi", "lạc hướng", "lac huong", "ghen tị", "ghen ti", "ganh tỵ", "ganh ty", "chiếm hữu", "chiem huu", "nghi ngờ", "nghi ngo", "không tin", "khong tin", "thiếu kiên nhẫn", "thieu kien nhan", "thất thường", "that thuong", "hoài nghi", "hoai nghi", "bi quan", "bi quan", "bốc đồng", "boc dong"]
  },
  
  // Neutral / Descriptive Psychological
  {
    emotion: "psychological-states",
    color: "#BDC3D2",
    en: ["overthinking", "controlling", "avoidant", "withdrawn", "overwhelmed", "scattered", "hesitant", "unfocused", "reactive", "stuck"],
    vi: ["suy nghĩ quá nhiều", "suy nghi qua nhieu", "kiểm soát", "kiem soat", "tránh né", "tranh ne", "rút lui", "rut lui", "choáng ngợp", "choang ngop", "rải rác", "rai rac", "ngần ngại", "ngan ngai", "không tập trung", "khong tap trung", "phản ứng", "phan ung", "bế tắc", "be tac"]
  },
  
  // Intellectual / Personality Traits
  {
    emotion: "intellectual",
    color: "#C2D2D7",
    en: ["observant", "introspective", "thoughtful", "analytical", "objective", "methodical", "minimalist", "expressive", "logical", "intuitive"],
    vi: ["quan sát", "quan sat", "nội tâm", "noi tam", "suy tư", "suy tu", "phân tích", "phan tich", "khách quan", "khach quan", "có phương pháp", "co phuong phap", "tối giản", "toi gian", "biểu cảm", "bieu cam", "logic", "logic", "trực giác", "truc giac"]
  },
  
  // Life Growth Traits
  {
    emotion: "life-growth",
    color: "#C9D2D4",
    en: ["independent", "assertive", "outgoing", "reserved", "introverted", "extroverted", "empirical", "experimental", "detail-oriented", "big-picture"],
    vi: ["độc lập", "doc lap", "quyết đoán", "quyet doan", "hướng ngoại", "huong ngoai", "dè dặt", "de dat", "hướng nội", "huong noi", "hướng ngoại", "huong ngoai", "thực nghiệm", "thuc nghiem", "thử nghiệm", "thu nghiem", "chú ý chi tiết", "chu y chi tiet", "tầm nhìn tổng thể", "tam nhin tong the"]
  },
  
  // Transformation / Higher Mind
  {
    emotion: "transformation",
    color: "#B9D8AE",
    en: ["evolving", "awakening", "expanding", "aligning", "clarifying", "unlearning", "reframing", "integrating", "releasing", "re-centering"],
    vi: ["tiến hóa", "tien hoa", "thức tỉnh", "thuc tinh", "mở rộng", "mo rong", "liên kết", "lien ket", "làm rõ", "lam ro", "bỏ học", "bo hoc", "định khung lại", "dinh khung lai", "tích hợp", "tich hop", "giải phóng", "giai phong", "tái trung tâm", "tai trung tam"]
  },
  
  // Creativity / High Cognition
  {
    emotion: "creativity-cognition",
    color: "#D7C6FD",
    en: ["imaginative", "insightful", "inventive", "inspired", "perceptive", "expressive", "fluid", "conceptual", "original", "innovative"],
    vi: ["tưởng tượng", "tuong tuong", "nhạy bén", "nhay ben", "sáng chế", "sang che", "cảm hứng", "cam hung", "nhận thức", "nhan thuc", "diễn đạt", "dien dat", "trôi chảy", "troi chay", "khái niệm", "khai niem", "nguyên bản", "nguyen ban", "đổi mới", "doi moi"]
  },
  
  // Mind / Clarity / Structure
  {
    emotion: "clarity-structure",
    color: "#B9C6D2",
    en: ["structured", "organized", "precise", "systematic", "logical", "disciplined", "intentional", "clear", "stable", "harmonious"],
    vi: ["có cấu trúc", "co cau truc", "có tổ chức", "co to chuc", "chính xác", "chinh xac", "có hệ thống", "co he thong", "logic", "logic", "kỷ luật", "ky luat", "có chủ ý", "co chu y", "rõ ràng", "ro rang", "ổn định", "on dinh", "hài hòa", "hai hoa"]
  },
  
  // Grammar / Language (kept from previous version)
  {
    emotion: "grammar-language",
    color: "#c9a0dc",
    en: ["passive", "active", "voice", "tense", "grammar", "sentence", "sentences", "verb", "pattern", "patterns", "structure", "form", "construction", "usage", "communication", "reports", "report", "documents", "document", "explanation", "explanations", "clarity", "professionalism", "professional", "sent", "solved", "cleaned", "converted", "converting", "convert", "practice", "essential", "common", "simple", "quickly", "well", "avoid", "overusing", "mention", "adds", "matters", "doer", "action", "person", "yesterday", "problem", "office", "someone", "used", "when", "only", "work"],
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
