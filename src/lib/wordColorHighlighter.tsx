import wordColorRules from "@/data/word-color-rule.json";

interface ColoredWord {
  word: string;
  color: string;
  category: string;
}

// Map of English to Vietnamese equivalent words (supports multi-word + variants)
const enToViEquivalents: Record<string, string | string[]> = {
  // Calm & Grounded
  "calm": ["bình an", "bình yên"],
  "peaceful": ["yên bình", "bình yên"],
  "gentle": "nhẹ nhàng",
  "grounded": ["vững chãi", "vững vàng"],
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
  "present": "hiện diện",
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
  
  // Spiritual & Connection
  "spirit": ["tinh thần", "linh hồn"],
  "soul": "tâm hồn",
  "faith": "đức tin",
  "prayer": "cầu nguyện",
  "meditate": "thiền định",
  "meditation": "thiền định",
  "sacred": "thiêng liêng",
  "divine": "thần thánh",
  "grace": "ân sủng",
  "blessing": ["phước lành", "ban phước"],
  "peace": ["hòa bình", "bình yên"],
  "harmony": "hài hòa",
  "wisdom": "trí tuệ",
  "enlightenment": "giác ngộ",
  "transcend": "siêu việt",
  "surrender": "buông bỏ",
  "trust": "tin tưởng",
  "hope": "hy vọng",
  "hopeful": "hy vọng",
  "comfort": "an ủi",
  "guidance": "hướng dẫn",
  "guide": "dẫn dắt",
  "inspire": "truyền cảm hứng",
  "inspired": "cảm hứng",
  "spiritual": "tâm linh",
  
  // Therapeutic & Growth
  "trauma": "chấn thương",
  "healing": "chữa lành",
  "recovery": "hồi phục",
  "recover": "phục hồi",
  "anxiety": "lo âu",
  "anxious": "lo lắng",
  "depression": "trầm cảm",
  "stress": "căng thẳng",
  "stressed": "căng thẳng",
  "coping": "đối phó",
  "cope": "đối phó",
  "boundary": "ranh giới",
  "boundaries": "ranh giới",
  "self-care": "tự chăm sóc",
  "therapy": "trị liệu",
  "therapeutic": "trị liệu",
  "growth": "phát triển",
  "transformation": "biến đổi",
  "transform": "biến đổi",
  "acceptance": "chấp nhận",
  "accept": "chấp nhận",
  "validation": "xác nhận",
  "validate": "xác nhận",
  "empowerment": "trao quyền",
  "empower": "trao quyền",
  "awareness": "nhận thức",
  "compassion": ["từ bi", "trắc ẩn"],
  "empathy": "đồng cảm",
  "empathetic": "đồng cảm",
  "nurture": "nuôi dưỡng",
  "nourish": "nuôi dưỡng",
  "restore": "phục hồi",
  "renew": "đổi mới",
  "rebuild": "xây dựng lại",
  "process": "xử lý",
  "integrate": "hội nhập",
  "balance": "cân bằng",
  "balanced": "cân bằng",
  "whole": "toàn vẹn",
  "wholeness": "sự toàn vẹn",
  "journey": "hành trình",
  "path": "con đường",
  "progress": "tiến bộ",

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

// Create reverse mapping (supports string or string[] variants)
const viToEnEquivalents: Record<string, string> = {};
for (const [en, vi] of Object.entries(enToViEquivalents)) {
  if (Array.isArray(vi)) {
    vi.forEach(v => { viToEnEquivalents[v.toLowerCase()] = en; });
  } else {
    viToEnEquivalents[vi.toLowerCase()] = en;
  }
}

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
  // Split by common punctuation while preserving the punctuation
  const segments = text.split(/(\s+|[.,;:!?()""—–-])/);
  const result: JSX.Element[] = [];
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    if (!segment || segment.trim() === '') {
      result.push(<span key={i}>{segment}</span>);
      continue;
    }
    
    const cleanWord = segment.trim().toLowerCase();
    let coloredWord: ColoredWord | null = null;
    
    if (isVietnamese) {
      // Try single word equivalence first
      const enEquivalent = viToEnEquivalents[cleanWord];
      if (enEquivalent) {
        coloredWord = findWordInCategories(enEquivalent);
      }
      
      // Try phrase equivalence: current + space + next word (e.g., "bình yên")
      if (!coloredWord && i + 2 < segments.length) {
        const maybeSpace = segments[i + 1];
        const nextSeg = segments[i + 2];
        if (/^\s+$/.test(maybeSpace || '') && nextSeg && nextSeg.trim() !== '') {
          const phrase = `${cleanWord} ${nextSeg.trim().toLowerCase()}`;
          const enEqPhrase = viToEnEquivalents[phrase];
          if (enEqPhrase) {
            const cat = findWordInCategories(enEqPhrase);
            if (cat) {
              result.push(
                <span key={i} style={{ backgroundColor: cat.color, padding: '2px 4px', borderRadius: '3px', fontWeight: 500 }}>
                  {segment}
                </span>
              );
              result.push(<span key={i + 1}>{maybeSpace}</span>);
              result.push(
                <span key={i + 2} style={{ backgroundColor: cat.color, padding: '2px 4px', borderRadius: '3px', fontWeight: 500 }}>
                  {nextSeg}
                </span>
              );
              i += 2;
              continue;
            }
          }
        }
      }
      
      // Also check if the Vietnamese word itself matches a category directly
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
          key={i}
          style={{ 
            backgroundColor: coloredWord.color,
            padding: '2px 4px',
            borderRadius: '3px',
            fontWeight: 500
          }}
        >
          {segment}
        </span>
      );
    } else {
      result.push(<span key={i}>{segment}</span>);
    }
  }
  
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
