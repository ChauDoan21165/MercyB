import wordColorRules from "@/data/word-color-rule.json";

interface ColoredWord {
  word: string;
  color: string;
  category: string;
}

// Map of English to Vietnamese equivalent words
const enToViEquivalents: Record<string, string> = {
  // Calm & Grounded
  "calm": "bình an",
  "peaceful": "yên bình",
  "gentle": "nhẹ nhàng",
  "grounded": "vững chãi",
  "steady": "vững vàng",
  "patient": "kiên nhẫn",
  "gently": "nhẹ nhàng",
  "slowly": "từ từ",
  "steadily": "đều đặn",
  "breathe": "thở",
  "relax": "thư giãn",
  "rest": "nghỉ ngơi",
  "pause": "tạm dừng",
  "listen": "lắng nghe",
  "notice": "chú ý",
  
  // Warm Connection
  "warm": "ấm áp",
  "kind": "tử tế",
  "caring": "quan tâm",
  "loving": "yêu thương",
  "compassionate": "trắc ẩn",
  "supportive": "ủng hộ",
  "hopeful": "hy vọng",
  "warmly": "ấm áp",
  "kindly": "tử tế",
  "deeply": "sâu sắc",
  "truly": "thật sự",
  "care": "quan tâm",
  "support": "hỗ trợ",
  "encourage": "khuyến khích",
  "connect": "kết nối",
  "share": "chia sẻ",
  "love": "yêu",
  
  // Power & Motivation
  "bold": "táo bạo",
  "strong": "mạnh mẽ",
  "confident": "tự tin",
  "powerful": "quyền lực",
  "energetic": "năng động",
  "driven": "động lực",
  "motivated": "có động lực",
  "brave": "dũng cảm",
  "courageous": "can đảm",
  "firmly": "vững chắc",
  "boldly": "táo bạo",
  "bravely": "dũng cảm",
  "decisively": "quyết đoán",
  "strongly": "mạnh mẽ",
  "move": "di chuyển",
  "act": "hành động",
  "stand": "đứng vững",
  "build": "xây dựng",
  "create": "sáng tạo",
  "grow": "phát triển",
  "choose": "chọn lựa",
  "rise": "vươn lên",
  "fight": "chiến đấu",
  
  // Healing & Clarity
  "bright": "sáng sủa",
  "joyful": "vui vẻ",
  "cheerful": "phấn khởi",
  "curious": "tò mò",
  "clear": "rõ ràng",
  "focused": "tập trung",
  "present": "hiện tại",
  "aware": "nhận thức",
  "mindful": "chánh niệm",
  "honest": "chân thật",
  "authentic": "xác thực",
  "resilient": "kiên cường",
  "clearly": "rõ ràng",
  "brightly": "sáng sủa",
  "mindfully": "chánh niệm",
  "consciously": "có ý thức",
  "carefully": "cẩn thận",
  "honestly": "thành thật",
  "heal": "chữa lành",
  "reflect": "phản ánh",
  "learn": "học hỏi",
  "understand": "hiểu",
  "release": "giải phóng",
  "forgive": "tha thứ",
  
  // VIP3 II specific terms
  "mastery": "làm chủ",
  "specialization": "chuyên ngành",
  "highest": "cao nhất",
  "tier": "cấp độ",
  "advanced": "nâng cao",
  "academic": "học thuật",
  "thinking": "tư duy",
  "professional": "chuyên nghiệp",
  "excellence": "xuất sắc",
  "precision": "chính xác",
  "sophisticated": "tinh tế",
  "nuanced": "tinh tế",
  "comprehensive": "toàn diện",
  "intensive": "chuyên sâu",
  "rigorous": "nghiêm ngặt",
};

// Create reverse mapping
const viToEnEquivalents: Record<string, string> = Object.fromEntries(
  Object.entries(enToViEquivalents).map(([en, vi]) => [vi, en])
);

function findWordInCategories(word: string): ColoredWord | null {
  const lowerWord = word.toLowerCase();
  
  for (const category of wordColorRules.categories) {
    // Check adjectives
    if (category.adjectives.includes(lowerWord)) {
      return { word, color: category.hex, category: category.id };
    }
    
    // Check adverbs
    if (category.adverbs.includes(lowerWord)) {
      return { word, color: category.hex, category: category.id };
    }
    
    // Check verbs (all intensity levels)
    if (category.verbs_light.includes(lowerWord) ||
        category.verbs_medium.includes(lowerWord) ||
        category.verbs_strong.includes(lowerWord)) {
      return { word, color: category.hex, category: category.id };
    }
  }
  
  return null;
}

export function highlightTextByRules(text: string, isVietnamese: boolean = false): JSX.Element[] {
  // Split by common punctuation while preserving the punctuation
  const segments = text.split(/(\s+|[.,;:!?()""—–-])/);
  const result: JSX.Element[] = [];
  
  segments.forEach((segment, index) => {
    if (!segment || segment.trim() === '') {
      result.push(<span key={index}>{segment}</span>);
      return;
    }
    
    const cleanWord = segment.trim().toLowerCase();
    let coloredWord: ColoredWord | null = null;
    
    if (isVietnamese) {
      // Check if this Vietnamese word has an English equivalent
      const enEquivalent = viToEnEquivalents[cleanWord];
      if (enEquivalent) {
        coloredWord = findWordInCategories(enEquivalent);
      }
      // Also check if the Vietnamese word itself is in the categories
      if (!coloredWord) {
        coloredWord = findWordInCategories(cleanWord);
      }
    } else {
      // For English, directly check the word
      coloredWord = findWordInCategories(cleanWord);
    }
    
    if (coloredWord) {
      result.push(
        <span 
          key={index}
          style={{ 
            backgroundColor: coloredWord.color,
            padding: '2px 4px',
            borderRadius: '3px',
            fontWeight: '500'
          }}
        >
          {segment}
        </span>
      );
    } else {
      result.push(<span key={index}>{segment}</span>);
    }
  });
  
  return result;
}

export function highlightPairedText(enText: string, viText: string): {
  enHighlighted: JSX.Element[];
  viHighlighted: JSX.Element[];
} {
  return {
    enHighlighted: highlightTextByRules(enText, false),
    viHighlighted: highlightTextByRules(viText, true)
  };
}
