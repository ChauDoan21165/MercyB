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
    vi: ["độc lập", "doc lap", "quyết đoán", "quyet doan", "hướng ngoại", "huong ngoai", "dè dặt", "de dat", "hướng nội", "huong noi", "hướng ngoại", "huong ngoai", "thực nghiệm", "thuc nghiem", "thử nghiệm", "thu nghiem", "chi tiết", "chi tiet", "tổng thể", "tong the"]
  },
  
  // Common Adjectives - Rainbow Colors
  {
    emotion: "adjectives-positive-1",
    color: "#FF6B9D", // Pink
    en: ["beautiful", "wonderful", "amazing", "fantastic", "excellent", "perfect", "brilliant", "magnificent", "spectacular", "marvelous"],
    vi: ["đẹp", "dep", "tuyệt vời", "tuyet voi", "tuyệt diệu", "tuyet dieu", "tuyệt hảo", "tuyet hao", "xuất sắc", "xuat sac", "hoàn hảo", "hoan hao", "lỗi lạc", "loi lac", "tráng lệ", "trang le", "hùng vĩ", "hung vi", "kỳ diệu", "ky dieu"]
  },
  {
    emotion: "adjectives-positive-2",
    color: "#FF9E6B", // Orange
    en: ["bright", "vibrant", "colorful", "radiant", "glowing", "luminous", "sparkling", "shining", "dazzling", "gleaming"],
    vi: ["sáng", "sang", "rực rỡ", "ruc ro", "đầy màu sắc", "day mau sac", "rạng rỡ", "rang ro", "tỏa sáng", "toa sang", "phát sáng", "phat sang", "lấp lánh", "lap lanh", "chiếu sáng", "chieu sang", "chói lọi", "choi loi", "lấp lánh", "lap lanh"]
  },
  {
    emotion: "adjectives-positive-3",
    color: "#FFD666", // Yellow
    en: ["fresh", "new", "young", "pure", "clean", "clear", "crisp", "neat", "tidy", "pristine"],
    vi: ["tươi", "tuoi", "mới", "moi", "trẻ", "tre", "thuần khiết", "thuan khiet", "sạch", "sach", "trong", "trong", "giòn", "gion", "gọn gàng", "gon gang", "ngăn nắp", "ngan nap", "nguyên sơ", "nguyen so"]
  },
  {
    emotion: "adjectives-positive-4",
    color: "#9EE6A8", // Green
    en: ["natural", "organic", "healthy", "vital", "lively", "alive", "thriving", "flourishing", "blooming", "verdant"],
    vi: ["tự nhiên", "tu nhien", "hữu cơ", "huu co", "khỏe mạnh", "khoe manh", "sống động", "song dong", "năng động", "nang dong", "sống", "song", "phát triển", "phat trien", "thịnh vượng", "thinh vuong", "nở rộ", "no ro", "tươi tốt", "tuoi tot"]
  },
  {
    emotion: "adjectives-positive-5",
    color: "#6BCDFF", // Sky Blue
    en: ["free", "open", "wide", "vast", "spacious", "broad", "expansive", "infinite", "boundless", "unlimited"],
    vi: ["tự do", "tu do", "mở", "mo", "rộng", "rong", "bao la", "bao la", "rộng rãi", "rong rai", "bao trùm", "bao trum", "mở rộng", "mo rong", "vô tận", "vo tan", "vô biên", "vo bien", "không giới hạn", "khong gioi han"]
  },
  {
    emotion: "adjectives-positive-6",
    color: "#9D6BFF", // Purple
    en: ["deep", "profound", "meaningful", "significant", "important", "valuable", "precious", "treasured", "sacred", "divine"],
    vi: ["sâu", "sau", "sâu sắc", "sau sac", "có ý nghĩa", "co y nghia", "quan trọng", "quan trong", "quan trọng", "quan trong", "có giá trị", "co gia tri", "quý giá", "quy gia", "trân quý", "tran quy", "thiêng liêng", "thieng lieng", "thần thánh", "than thanh"]
  },
  {
    emotion: "adjectives-descriptive-1",
    color: "#FF8FA3", // Rose
    en: ["soft", "gentle", "smooth", "delicate", "tender", "mild", "subtle", "fine", "light", "airy"],
    vi: ["mềm", "mem", "dịu dàng", "diu dang", "mịn", "min", "tinh tế", "tinh te", "mềm mại", "mem mai", "nhẹ nhàng", "nhe nhang", "tinh vi", "tinh vi", "mịn màng", "min mang", "nhẹ", "nhe", "thoáng", "thoang"]
  },
  {
    emotion: "adjectives-descriptive-2",
    color: "#FFB86F", // Peach
    en: ["warm", "cozy", "comfortable", "pleasant", "nice", "agreeable", "welcoming", "inviting", "friendly", "cordial"],
    vi: ["ấm", "am", "ấm cúng", "am cung", "thoải mái", "thoai mai", "dễ chịu", "de chiu", "đẹp", "dep", "dễ chịu", "de chiu", "chào đón", "chao don", "mời gọi", "moi goi", "thân thiện", "than thien", "thân mật", "than mat"]
  },
  {
    emotion: "adjectives-descriptive-3",
    color: "#C1E1C1", // Mint
    en: ["quiet", "still", "silent", "peaceful", "tranquil", "serene", "placid", "undisturbed", "untroubled", "restful"],
    vi: ["yên tĩnh", "yen tinh", "im lặng", "im lang", "yên lặng", "yen lang", "hòa bình", "hoa binh", "thanh bình", "thanh binh", "thanh thản", "thanh than", "điềm tĩnh", "diem tinh", "không bị quấy rầy", "khong bi quay ray", "không lo lắng", "khong lo lang", "nghỉ ngơi", "nghi ngoi"]
  },
  
  // Common Adverbs - Rainbow Colors
  {
    emotion: "adverbs-manner-1",
    color: "#FF77A9", // Hot Pink
    en: ["slowly", "quickly", "rapidly", "swiftly", "fast", "speedily", "hastily", "gradually", "steadily", "gently"],
    vi: ["chậm", "cham", "nhanh", "nhanh", "nhanh chóng", "nhanh chong", "mau lẹ", "mau le", "mau", "mau", "nhanh nhẹn", "nhanh nhen", "vội vàng", "voi vang", "dần dần", "dan dan", "đều đặn", "deu dan", "nhẹ nhàng", "nhe nhang"]
  },
  {
    emotion: "adverbs-frequency-1",
    color: "#FFA866", // Coral
    en: ["always", "never", "often", "sometimes", "rarely", "seldom", "frequently", "occasionally", "usually", "regularly"],
    vi: ["luôn luôn", "luon luon", "không bao giờ", "khong bao gio", "thường", "thuong", "đôi khi", "doi khi", "hiếm khi", "hiem khi", "ít khi", "it khi", "thường xuyên", "thuong xuyen", "thỉnh thoảng", "thinh thoang", "thường", "thuong", "đều đặn", "deu dan"]
  },
  {
    emotion: "adverbs-degree-1",
    color: "#FFCC66", // Gold
    en: ["very", "extremely", "incredibly", "remarkably", "exceptionally", "particularly", "especially", "truly", "really", "absolutely"],
    vi: ["rất", "rat", "cực kỳ", "cuc ky", "không thể tin", "khong the tin", "đáng chú ý", "dang chu y", "đặc biệt", "dac biet", "đặc biệt", "dac biet", "đặc biệt", "dac biet", "thực sự", "thuc su", "thật sự", "that su", "hoàn toàn", "hoan toan"]
  },
  {
    emotion: "adverbs-manner-2",
    color: "#88DD99", // Light Green
    en: ["easily", "simply", "naturally", "effortlessly", "smoothly", "freely", "openly", "directly", "plainly", "clearly"],
    vi: ["dễ dàng", "de dang", "đơn giản", "don gian", "tự nhiên", "tu nhien", "không nỗ lực", "khong no luc", "mượt mà", "muot ma", "tự do", "tu do", "công khai", "cong khai", "trực tiếp", "truc tiep", "rõ ràng", "ro rang", "rõ ràng", "ro rang"]
  },
  {
    emotion: "adverbs-manner-3",
    color: "#77CCFF", // Light Blue
    en: ["deeply", "profoundly", "thoroughly", "completely", "entirely", "fully", "totally", "wholly", "utterly", "perfectly"],
    vi: ["sâu sắc", "sau sac", "sâu xa", "sau xa", "kỹ lưỡng", "ky luong", "hoàn toàn", "hoan toan", "toàn bộ", "toan bo", "đầy đủ", "day du", "hoàn toàn", "hoan toan", "toàn thể", "toan the", "hoàn toàn", "hoan toan", "hoàn hảo", "hoan hao"]
  },
  {
    emotion: "adverbs-manner-4",
    color: "#AA77FF", // Lavender
    en: ["carefully", "thoughtfully", "mindfully", "consciously", "deliberately", "intentionally", "purposefully", "attentively", "wisely", "prudently"],
    vi: ["cẩn thận", "can than", "chu đáo", "chu dao", "chánh niệm", "chanh niem", "có ý thức", "co y thuc", "cố ý", "co y", "có chủ ý", "co chu y", "có mục đích", "co muc dich", "chú ý", "chu y", "khôn ngoan", "khon ngoan", "thận trọng", "than trong"]
  },
  {
    emotion: "breathing-keywords",
    color: "#B4E7F0", // Light Cyan (Special for breathing)
    en: ["breath", "breathe", "breathing", "inhale", "exhale", "respiration", "air", "oxygen", "breaths", "breathwork"],
    vi: ["hơi thở", "hoi tho", "thở", "tho", "hít vào", "hit vao", "thở ra", "tho ra", "hô hấp", "ho hap", "không khí", "khong khi", "oxy", "oxy", "các hơi thở", "cac hoi tho", "công tác thở", "cong tac tho"]
  }
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
    en: ["passive", "active", "voice", "tense", "grammar", "sentence", "sentences", "verb", "pattern", "patterns", "structure", "form", "construction", "usage", "communication", "reports", "report", "documents", "document", "explanation", "explanations", "clarity", "professionalism", "professional", "sent", "solved", "cleaned", "converted", "converting", "convert", "practice", "essential", "common", "simple", "quickly", "well", "avoid", "overusing", "mention", "adds", "matters", "doer", "action", "person", "yesterday", "problem", "office", "someone", "used", "when", "only", "work", "becomes", "use", "creates", "abuse", "state", "correctly"],
    vi: ["bị động", "bi dong", "chủ động", "chu dong", "giọng", "giong", "thì", "thi", "ngữ pháp", "ngu phap", "câu", "cau", "động từ", "dong tu", "mẫu", "mau", "cấu trúc", "cau truc", "hình thức", "hinh thuc", "xây dựng", "xay dung", "cách dùng", "cach dung", "giao tiếp", "giao tiep", "báo cáo", "bao cao", "tài liệu", "tai lieu", "giải thích", "giai thich", "rõ ràng", "ro rang", "chuyên nghiệp", "chuyen nghiep", "gửi", "gui", "đã gửi", "da gui", "giải quyết", "giai quyet", "đã giải quyết", "da giai quyet", "dọn dẹp", "don dep", "chuyển đổi", "chuyen doi", "luyện tập", "luyen tap", "cần thiết", "can thiet", "phổ biến", "pho bien", "đơn giản", "don gian", "nhanh chóng", "nhanh chong", "tốt", "tot", "tránh", "tranh", "dùng quá nhiều", "dung qua nhieu", "đề cập", "de cap", "thêm vào", "them vao", "quan trọng", "quan trong", "người làm", "nguoi lam", "hành động", "hanh dong", "người", "nguoi", "hôm qua", "hom qua", "vấn đề", "van de", "văn phòng", "van phong", "ai đó", "ai do", "được dùng", "duoc dung", "khi", "chỉ", "chi", "công việc", "cong viec", "trở nên", "tro nen", "thực hiện", "thuc hien", "luyện", "luyen", "đổi", "doi", "lạm dụng", "lam dung", "nêu", "neu", "dùng đúng", "dung dung", "tạo", "tao", "dùng", "dung", "chúng", "chung"]
  },
  
  // ADVERBS - Calm / Neutral / Balanced
  {
    emotion: "adverb-calm-neutral",
    color: "#AFC6D9",
    en: ["calmly", "quietly", "gently", "softly", "smoothly", "evenly", "steadily", "slowly", "peacefully", "delicately", "fully", "clearly", "simply", "truly", "purely", "lightly", "naturally", "wisely", "patiently", "openly"],
    vi: ["một cách bình tĩnh", "mot cach binh tinh", "lặng lẽ", "lang le", "nhẹ nhàng", "nhe nhang", "mềm mại", "mem mai", "trơn tru", "tron tru", "đều đặn", "deu dan", "vững vàng", "vung vang", "chậm rãi", "cham rai", "yên bình", "yen binh", "tinh tế", "tinh te", "đầy đủ", "day du", "rõ ràng", "ro rang", "đơn giản", "don gian", "thực sự", "thuc su", "thuần khiết", "thuan khiet", "nhẹ nhàng", "nhe nhang", "tự nhiên", "tu nhien", "khôn ngoan", "khon ngoan", "kiên nhẫn", "kien nhan", "cởi mở", "coi mo"]
  },
  
  // ADVERBS - Warm / Expressive / Emotional
  {
    emotion: "adverb-warm-expressive",
    color: "#F5C2A5",
    en: ["warmly", "kindly", "lovingly", "brightly", "happily", "cheerfully", "bravely", "boldly", "proudly", "confidently", "playfully", "tenderly", "gracefully", "softheartedly", "encouragingly", "joyfully", "gratefully", "hopefully", "sincerely", "compassionately"],
    vi: ["ấm áp", "am ap", "tử tế", "tu te", "yêu thương", "yeu thuong", "rạng rỡ", "rang ro", "vui vẻ", "vui ve", "phấn khởi", "phan khoi", "dũng cảm", "dung cam", "táo bạo", "tao bao", "tự hào", "tu hao", "tự tin", "tu tin", "vui tươi", "vui tuoi", "dịu dàng", "diu dang", "duyên dáng", "duyen dang", "hiền lành", "hien lanh", "khích lệ", "khich le", "vui vẻ", "vui ve", "biết ơn", "biet on", "đầy hy vọng", "day hy vong", "chân thành", "chan thanh", "nhân từ", "nhan tu"]
  },
  
  // ADVERBS - High Energy / Motivation
  {
    emotion: "adverb-high-energy",
    color: "#7BC9B6",
    en: ["actively", "quickly", "sharply", "efficiently", "powerfully", "strongly", "purposefully", "assertively", "deeply", "mindfully", "energetically", "focusedly", "deliberately", "determinedly", "decisively", "resiliently", "persistently", "consistently", "consciously"],
    vi: ["tích cực", "tich cuc", "nhanh chóng", "nhanh chong", "sắc bén", "sac ben", "hiệu quả", "hieu qua", "mạnh mẽ", "manh me", "mạnh mẽ", "manh me", "có mục đích", "co muc dich", "quyết đoán", "quyet doan", "sâu sắc", "sau sac", "chánh niệm", "chanh niem", "tràn đầy năng lượng", "tran day nang luong", "tập trung", "tap trung", "cố ý", "co y", "quyết tâm", "quyet tam", "dứt khoát", "dut khoat", "kiên cường", "kien cuong", "kiên trì", "kien tri", "nhất quán", "nhat quan", "có ý thức", "co y thuc"]
  },
  
  // ADVERBS - Negative / Stress / Hard Emotions
  {
    emotion: "adverb-negative-stress",
    color: "#9FA8BE",
    en: ["sadly", "hesitantly", "fearfully", "anxiously", "nervously", "tiredly", "uncertainly", "weakly", "wearily", "regretfully", "shamefully", "awkwardly", "guiltily", "bitterly", "angrily", "harshly", "defensively", "coldly", "reluctantly"],
    vi: ["buồn bã", "buon ba", "do dự", "do du", "sợ hãi", "so hai", "lo lắng", "lo lang", "bồn chồn", "bon chon", "mệt mỏi", "met moi", "không chắc chắn", "khong chac chan", "yếu đuối", "yeu duoi", "mệt nhọc", "met nhoc", "hối tiếc", "hoi tiec", "xấu hổ", "xau ho", "vụng về", "vung ve", "tội lỗi", "toi loi", "cay đắng", "cay dang", "giận dữ", "gian du", "khắc nghiệt", "khac nghiet", "phòng thủ", "phong thu", "lạnh lùng", "lanh lung", "miễn cưỡng", "mien cuong"]
  },
  
  // ADVERBS - Reflective / Cognitive / Insightful
  {
    emotion: "adverb-reflective-cognitive",
    color: "#CFC3EB",
    en: ["reflectively", "thoughtfully", "introspectively", "philosophically", "rationally", "logically", "analytically", "systematically", "carefully", "precisely", "honestly", "curiously", "creatively", "open-mindedly", "insightfully", "spiritually", "harmoniously", "deliberately", "conscientiously"],
    vi: ["suy ngẫm", "suy ngam", "suy tư", "suy tu", "nội tâm", "noi tam", "triết học", "triet hoc", "hợp lý", "hop ly", "logic", "logic", "phân tích", "phan tich", "có hệ thống", "co he thong", "cẩn thận", "can than", "chính xác", "chinh xac", "trung thực", "trung thuc", "tò mò", "to mo", "sáng tạo", "sang tao", "cởi mở", "coi mo", "sâu sắc", "sau sac", "tâm linh", "tam linh", "hài hòa", "hai hoa", "có chủ ý", "co chu y", "tận tâm", "tan tam"]
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
