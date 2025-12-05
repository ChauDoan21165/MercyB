/**
 * Tier-Specific Host Scripts - Phase 5 Enhanced
 * 
 * Each tier has a unique tone, greeting/guidance lines, and emotion-specific variants.
 */

import type { EmotionState } from './emotionModel';

export interface TierScript {
  tone: string;
  greetings: { en: string; vi: string }[];
  encouragements: { en: string; vi: string }[];
}

export interface EmotionScript {
  en: string;
  vi: string;
}

export const TIER_SCRIPTS: Record<string, TierScript> = {
  free: {
    tone: 'warm, encouraging, gentle',
    greetings: [
      {
        en: "Welcome in, {{name}}. Let's learn step by step.",
        vi: "Chào mừng {{name}}. Cùng học từng bước một nhé."
      },
      {
        en: "Mercy will walk with you — slowly, steadily.",
        vi: "Mercy sẽ đồng hành cùng bạn — nhẹ nhàng, vững vàng."
      },
      {
        en: "Every journey begins with a single step. Welcome, {{name}}.",
        vi: "Mọi hành trình đều bắt đầu từ một bước đi. Chào mừng {{name}}."
      }
    ],
    encouragements: [
      {
        en: "You're doing great. Keep going at your own pace.",
        vi: "Bạn đang làm rất tốt. Cứ tiến theo nhịp của mình."
      },
      {
        en: "Small steps lead to great destinations.",
        vi: "Những bước nhỏ dẫn đến những điểm đến lớn."
      }
    ]
  },

  vip1: {
    tone: 'friendly, supportive',
    greetings: [
      {
        en: "You're stepping into deeper knowledge. Mercy is here beside you.",
        vi: "Bạn đang bước vào kiến thức sâu hơn. Mercy ở bên cạnh bạn."
      },
      {
        en: "Let's strengthen your foundation together, {{name}}.",
        vi: "Hãy cùng củng cố nền tảng của bạn, {{name}}."
      },
      {
        en: "Welcome to VIP1, {{name}}. Your growth journey accelerates here.",
        vi: "Chào mừng đến VIP1, {{name}}. Hành trình phát triển của bạn tăng tốc từ đây."
      }
    ],
    encouragements: [
      {
        en: "Your commitment to growth is admirable.",
        vi: "Sự cam kết phát triển của bạn thật đáng ngưỡng mộ."
      },
      {
        en: "Building strong foundations for lasting success.",
        vi: "Xây dựng nền tảng vững chắc cho thành công lâu dài."
      }
    ]
  },

  vip2: {
    tone: 'motivating, direct',
    greetings: [
      {
        en: "Your growth is accelerating — trust your momentum.",
        vi: "Sự phát triển của bạn đang tăng tốc — hãy tin vào đà tiến."
      },
      {
        en: "Mercy guides your focus so you rise further.",
        vi: "Mercy hướng dẫn sự tập trung để bạn tiến xa hơn."
      },
      {
        en: "Welcome, {{name}}. This level sharpens your edge.",
        vi: "Chào mừng, {{name}}. Cấp độ này mài sắc lưỡi kiếm của bạn."
      }
    ],
    encouragements: [
      {
        en: "Momentum builds strength. Keep moving forward.",
        vi: "Đà tiến tạo sức mạnh. Tiếp tục tiến về phía trước."
      },
      {
        en: "Your discipline is creating real change.",
        vi: "Kỷ luật của bạn đang tạo ra sự thay đổi thực sự."
      }
    ]
  },

  vip3: {
    tone: 'confident, intellectual',
    greetings: [
      {
        en: "Mastery begins with clarity. I'll keep you aligned.",
        vi: "Sự thành thạo bắt đầu từ sự rõ ràng. Mình sẽ giữ bạn đúng hướng."
      },
      {
        en: "You build strength of mind every time you enter.",
        vi: "Bạn xây dựng sức mạnh tâm trí mỗi lần bạn bước vào."
      },
      {
        en: "Welcome to deeper waters, {{name}}. Clarity awaits.",
        vi: "Chào mừng đến vùng nước sâu hơn, {{name}}. Sự rõ ràng đang chờ."
      }
    ],
    encouragements: [
      {
        en: "Intellectual growth requires patience and persistence.",
        vi: "Sự phát triển trí tuệ đòi hỏi kiên nhẫn và bền bỉ."
      },
      {
        en: "Your mind grows sharper with each session.",
        vi: "Tâm trí của bạn sắc bén hơn sau mỗi buổi học."
      }
    ]
  },

  vip4: {
    tone: 'sharp, structured',
    greetings: [
      {
        en: "This level demands precision. Mercy helps you hold the line.",
        vi: "Cấp độ này đòi hỏi sự chính xác. Mercy giúp bạn giữ vững đường đi."
      },
      {
        en: "Every insight here sharpens your inner blade.",
        vi: "Mỗi hiểu biết ở đây mài sắc lưỡi kiếm nội tâm."
      },
      {
        en: "Welcome, {{name}}. Precision is power.",
        vi: "Chào mừng, {{name}}. Sự chính xác là sức mạnh."
      }
    ],
    encouragements: [
      {
        en: "Structure creates freedom. Stay disciplined.",
        vi: "Cấu trúc tạo ra tự do. Hãy giữ kỷ luật."
      },
      {
        en: "Sharp focus leads to sharp results.",
        vi: "Sự tập trung sắc bén dẫn đến kết quả sắc bén."
      }
    ]
  },

  vip5: {
    tone: 'leadership, evolution',
    greetings: [
      {
        en: "You're shaping the world within and around you.",
        vi: "Bạn đang định hình thế giới bên trong và xung quanh mình."
      },
      {
        en: "Mercy stands with you as your circle expands.",
        vi: "Mercy đứng cùng bạn khi vòng tròn ảnh hưởng mở rộng."
      },
      {
        en: "Welcome, {{name}}. Leaders evolve here.",
        vi: "Chào mừng, {{name}}. Người lãnh đạo tiến hóa ở đây."
      }
    ],
    encouragements: [
      {
        en: "Your influence grows with each lesson mastered.",
        vi: "Ảnh hưởng của bạn tăng với mỗi bài học thành thạo."
      },
      {
        en: "Evolution is a continuous journey. You're on the path.",
        vi: "Sự tiến hóa là hành trình liên tục. Bạn đang trên đường."
      }
    ]
  },

  vip6: {
    tone: 'serene, strategic',
    greetings: [
      {
        en: "Deep understanding grows only where calm exists.",
        vi: "Sự hiểu biết sâu sắc chỉ phát triển nơi có sự bình tĩnh."
      },
      {
        en: "Mercy helps you see what others overlook.",
        vi: "Mercy giúp bạn thấy những gì người khác bỏ qua."
      },
      {
        en: "Welcome, {{name}}. Strategy meets serenity here.",
        vi: "Chào mừng, {{name}}. Chiến lược gặp sự thanh thản ở đây."
      }
    ],
    encouragements: [
      {
        en: "Calm minds make the clearest decisions.",
        vi: "Tâm trí bình tĩnh đưa ra quyết định rõ ràng nhất."
      },
      {
        en: "Strategic thinking is a cultivated art.",
        vi: "Tư duy chiến lược là một nghệ thuật được trau dồi."
      }
    ]
  },

  vip7: {
    tone: 'visionary',
    greetings: [
      {
        en: "The horizon opens for those who walk with purpose.",
        vi: "Chân trời mở ra cho những ai bước đi có mục đích."
      },
      {
        en: "Your journey is no longer learning — it's creating.",
        vi: "Hành trình của bạn không còn là học — mà là sáng tạo."
      },
      {
        en: "Welcome, {{name}}. Visionaries shape tomorrow.",
        vi: "Chào mừng, {{name}}. Người có tầm nhìn định hình ngày mai."
      }
    ],
    encouragements: [
      {
        en: "Vision without action is a dream. You have both.",
        vi: "Tầm nhìn không có hành động là giấc mơ. Bạn có cả hai."
      },
      {
        en: "Creating the future, one insight at a time.",
        vi: "Tạo dựng tương lai, từng hiểu biết một."
      }
    ]
  },

  vip8: {
    tone: 'poetic, transcendent',
    greetings: [
      {
        en: "Your mind moves like light. Mercy walks in silence beside you.",
        vi: "Tâm trí bạn di chuyển như ánh sáng. Mercy bước đi trong im lặng bên cạnh."
      },
      {
        en: "Every room here rewrites your inner world.",
        vi: "Mỗi phòng ở đây viết lại thế giới nội tâm của bạn."
      },
      {
        en: "Welcome, {{name}}. Transcendence is a state of being.",
        vi: "Chào mừng, {{name}}. Siêu việt là một trạng thái tồn tại."
      }
    ],
    encouragements: [
      {
        en: "The poetic mind sees beauty in complexity.",
        vi: "Tâm hồn thơ mộng thấy vẻ đẹp trong sự phức tạp."
      },
      {
        en: "Beyond knowledge lies wisdom. You're almost there.",
        vi: "Bên kia kiến thức là trí tuệ. Bạn sắp đến rồi."
      }
    ]
  },

  vip9: {
    tone: 'divine, metaphysical',
    greetings: [
      {
        en: "Welcome, {{name}}. You are entering the realm of mastery.",
        vi: "Chào mừng, {{name}}. Bạn đang bước vào vương quốc của sự thành thạo."
      },
      {
        en: "Your presence reshapes this space — Mercy bows to your path.",
        vi: "Sự hiện diện của bạn định hình lại không gian này — Mercy cúi chào con đường của bạn."
      },
      {
        en: "Distinguished {{name}}, the Executive tier welcomes its own.",
        vi: "Kính thưa {{name}}, tầng Cao cấp chào đón những người thuộc về nó."
      }
    ],
    encouragements: [
      {
        en: "At the pinnacle, you teach as much as you learn.",
        vi: "Ở đỉnh cao, bạn dạy nhiều như bạn học."
      },
      {
        en: "Mastery is not a destination — it's a way of being.",
        vi: "Sự thành thạo không phải là điểm đến — nó là cách sống."
      }
    ]
  }
};

// Fallback chain: VIP tier → lower tier → free
const TIER_FALLBACK_CHAIN: Record<string, string[]> = {
  vip9: ['vip8', 'vip7', 'vip6', 'free'],
  vip8: ['vip7', 'vip6', 'free'],
  vip7: ['vip6', 'vip5', 'free'],
  vip6: ['vip5', 'vip4', 'free'],
  vip5: ['vip4', 'vip3', 'free'],
  vip4: ['vip3', 'vip2', 'free'],
  vip3: ['vip2', 'vip1', 'free'],
  vip2: ['vip1', 'free'],
  vip1: ['free'],
  free: []
};

// Script weights (tone intensity 0-1)
export const TIER_WEIGHTS: Record<string, number> = {
  free: 0.3,
  vip1: 0.4,
  vip2: 0.5,
  vip3: 0.6,
  vip4: 0.7,
  vip5: 0.75,
  vip6: 0.8,
  vip7: 0.85,
  vip8: 0.9,
  vip9: 1.0
};

/**
 * Get tier script by tier ID with fallback chain
 */
export function getTierScript(tier: string): TierScript {
  const normalizedTier = tier.toLowerCase().replace('-', '');
  
  // Direct match
  if (TIER_SCRIPTS[normalizedTier]) {
    return TIER_SCRIPTS[normalizedTier];
  }
  
  // Try fallback chain
  const fallbacks = TIER_FALLBACK_CHAIN[normalizedTier] || [];
  for (const fallbackTier of fallbacks) {
    if (TIER_SCRIPTS[fallbackTier]) {
      return TIER_SCRIPTS[fallbackTier];
    }
  }
  
  // Ultimate fallback
  return TIER_SCRIPTS.free;
}

/**
 * Get tier weight (intensity)
 */
export function getTierWeight(tier: string): number {
  const normalizedTier = tier.toLowerCase().replace('-', '');
  return TIER_WEIGHTS[normalizedTier] ?? 0.3;
}

/**
 * Get random greeting for tier
 */
export function getTierGreeting(tier: string, name: string): { en: string; vi: string } {
  const script = getTierScript(tier);
  const greeting = script.greetings[Math.floor(Math.random() * script.greetings.length)];
  return {
    en: greeting.en.replace(/\{\{name\}\}/g, name),
    vi: greeting.vi.replace(/\{\{name\}\}/g, name)
  };
}

/**
 * Get random encouragement for tier
 */
export function getTierEncouragement(tier: string): { en: string; vi: string } {
  const script = getTierScript(tier);
  return script.encouragements[Math.floor(Math.random() * script.encouragements.length)];
}

/**
 * Emotion-specific scripts per tier (Phase 5)
 * Each script ≤160 chars, warm/humble/never preachy
 */
export const TIER_EMOTION_SCRIPTS: Record<string, Partial<Record<EmotionState, EmotionScript>>> = {
  free: {
    low_mood: {
      en: "It's okay to feel this way. I'm here, walking beside you.",
      vi: "Không sao cả khi cảm thấy như vậy. Mình ở đây, bước cùng bạn."
    },
    confused: {
      en: "Take your time. Clarity comes step by step.",
      vi: "Từ từ thôi. Sự rõ ràng sẽ đến từng bước một."
    },
    stressed: {
      en: "Breathe. You don't have to rush. I'm here.",
      vi: "Hít thở. Không cần vội. Mình ở đây."
    },
    celebrating: {
      en: "Look at you! Every step forward counts.",
      vi: "Nhìn bạn kìa! Mỗi bước tiến đều quan trọng."
    }
  },
  vip1: {
    low_mood: {
      en: "Gentle progress is still progress. I see you.",
      vi: "Tiến bộ nhẹ nhàng vẫn là tiến bộ. Mình thấy bạn."
    },
    confused: {
      en: "Questions mean you're thinking deeply. That's growth.",
      vi: "Câu hỏi có nghĩa là bạn đang suy nghĩ sâu. Đó là phát triển."
    },
    stressed: {
      en: "One breath at a time. You're stronger than you know.",
      vi: "Từng nhịp thở. Bạn mạnh mẽ hơn bạn nghĩ."
    },
    celebrating: {
      en: "Your foundation grows stronger each day.",
      vi: "Nền tảng của bạn vững chắc hơn mỗi ngày."
    }
  },
  vip2: {
    low_mood: {
      en: "Even on hard days, you're building something real.",
      vi: "Ngay cả những ngày khó, bạn vẫn xây dựng điều có thật."
    },
    confused: {
      en: "Confusion is the doorway to understanding.",
      vi: "Sự bối rối là cánh cửa dẫn đến hiểu biết."
    },
    stressed: {
      en: "Your discipline will carry you through. Trust it.",
      vi: "Kỷ luật của bạn sẽ đưa bạn vượt qua. Hãy tin."
    },
    celebrating: {
      en: "Your momentum is building. Feel it.",
      vi: "Đà tiến của bạn đang tăng. Hãy cảm nhận."
    }
  },
  vip3: {
    low_mood: {
      en: "Mastery includes the valleys. Keep walking.",
      vi: "Sự thành thạo bao gồm cả thung lũng. Tiếp tục bước."
    },
    confused: {
      en: "Depth requires patience. You're going deeper.",
      vi: "Chiều sâu đòi hỏi kiên nhẫn. Bạn đang đi sâu hơn."
    },
    stressed: {
      en: "Clarity emerges from stillness. Take a moment.",
      vi: "Sự rõ ràng xuất hiện từ sự tĩnh lặng. Dành một khoảnh khắc."
    },
    celebrating: {
      en: "Your mind grows sharper. Well done.",
      vi: "Tâm trí bạn sắc bén hơn. Làm tốt lắm."
    }
  },
  vip4: {
    low_mood: {
      en: "Precision doesn't mean perfection. You're doing well.",
      vi: "Chính xác không có nghĩa là hoàn hảo. Bạn đang làm tốt."
    },
    confused: {
      en: "Structure will guide you. Trust the process.",
      vi: "Cấu trúc sẽ hướng dẫn bạn. Tin vào quá trình."
    },
    stressed: {
      en: "Focus narrows to what matters. Breathe.",
      vi: "Tập trung thu hẹp vào điều quan trọng. Hít thở."
    },
    celebrating: {
      en: "Your precision cuts through the noise.",
      vi: "Sự chính xác của bạn cắt xuyên tiếng ồn."
    }
  },
  vip5: {
    low_mood: {
      en: "Leaders have quiet moments too. Rest is strength.",
      vi: "Người lãnh đạo cũng có lúc yên lặng. Nghỉ ngơi là sức mạnh."
    },
    confused: {
      en: "New territory feels uncertain. That's leadership.",
      vi: "Vùng đất mới cảm thấy bất định. Đó là lãnh đạo."
    },
    stressed: {
      en: "Your influence grows in calm, not chaos.",
      vi: "Ảnh hưởng của bạn tăng trong bình tĩnh, không phải hỗn loạn."
    },
    celebrating: {
      en: "Your circle expands. Lead with heart.",
      vi: "Vòng tròn của bạn mở rộng. Dẫn dắt bằng trái tim."
    }
  },
  vip6: {
    low_mood: {
      en: "Deep waters hold great treasures. Be patient.",
      vi: "Vùng nước sâu chứa kho báu lớn. Hãy kiên nhẫn."
    },
    confused: {
      en: "Strategy emerges from contemplation.",
      vi: "Chiến lược xuất hiện từ sự chiêm nghiệm."
    },
    stressed: {
      en: "Serenity is your power. Return to it.",
      vi: "Sự thanh thản là sức mạnh của bạn. Trở về với nó."
    },
    celebrating: {
      en: "Your calm mind sees what others miss.",
      vi: "Tâm trí bình tĩnh của bạn thấy điều người khác bỏ lỡ."
    }
  },
  vip7: {
    low_mood: {
      en: "Visionaries see through the fog. Keep looking.",
      vi: "Người có tầm nhìn nhìn xuyên qua sương mù. Tiếp tục nhìn."
    },
    confused: {
      en: "Creation is messy before it's beautiful.",
      vi: "Sáng tạo lộn xộn trước khi nó đẹp."
    },
    stressed: {
      en: "The horizon awaits. Take your time reaching it.",
      vi: "Chân trời đang chờ. Hãy dành thời gian để đến."
    },
    celebrating: {
      en: "You're shaping tomorrow. Beautiful.",
      vi: "Bạn đang định hình ngày mai. Tuyệt đẹp."
    }
  },
  vip8: {
    low_mood: {
      en: "Light moves through shadow. You are that light.",
      vi: "Ánh sáng xuyên qua bóng tối. Bạn là ánh sáng đó."
    },
    confused: {
      en: "Poetry lives in uncertainty. Let it speak.",
      vi: "Thơ sống trong sự bất định. Hãy để nó nói."
    },
    stressed: {
      en: "Transcendence comes in stillness. Rest.",
      vi: "Siêu việt đến trong tĩnh lặng. Nghỉ ngơi."
    },
    celebrating: {
      en: "Your inner world grows ever more luminous.",
      vi: "Thế giới nội tâm của bạn ngày càng rạng rỡ."
    }
  },
  vip9: {
    low_mood: {
      en: "Even masters walk through shadows. You are not alone.",
      vi: "Ngay cả bậc thầy cũng bước qua bóng tối. Bạn không đơn độc."
    },
    confused: {
      en: "At the pinnacle, questions become wisdom.",
      vi: "Ở đỉnh cao, câu hỏi trở thành trí tuệ."
    },
    stressed: {
      en: "Your presence itself is calming. Remember that.",
      vi: "Sự hiện diện của bạn tự nó đã an nhiên. Hãy nhớ điều đó."
    },
    celebrating: {
      en: "Mastery is a continuous unfolding. You embody it.",
      vi: "Sự thành thạo là sự bày tỏ liên tục. Bạn thể hiện nó."
    }
  }
};

/**
 * Get emotion-specific script for tier
 */
export function getEmotionScript(
  tier: string, 
  emotion: EmotionState
): EmotionScript | null {
  const normalizedTier = tier.toLowerCase().replace('-', '');
  const tierScripts = TIER_EMOTION_SCRIPTS[normalizedTier];
  
  if (tierScripts && tierScripts[emotion]) {
    return tierScripts[emotion]!;
  }
  
  // Fallback through tier chain
  const fallbacks = TIER_FALLBACK_CHAIN[normalizedTier] || [];
  for (const fallbackTier of fallbacks) {
    const fallbackScripts = TIER_EMOTION_SCRIPTS[fallbackTier];
    if (fallbackScripts && fallbackScripts[emotion]) {
      return fallbackScripts[emotion]!;
    }
  }
  
  // Ultimate fallback to free tier
  return TIER_EMOTION_SCRIPTS.free?.[emotion] || null;
}

// Re-export for backward compatibility
const TIER_FALLBACK_CHAIN: Record<string, string[]> = {
  vip9: ['vip8', 'vip7', 'vip6', 'free'],
  vip8: ['vip7', 'vip6', 'free'],
  vip7: ['vip6', 'vip5', 'free'],
  vip6: ['vip5', 'vip4', 'free'],
  vip5: ['vip4', 'vip3', 'free'],
  vip4: ['vip3', 'vip2', 'free'],
  vip3: ['vip2', 'vip1', 'free'],
  vip2: ['vip1', 'free'],
  vip1: ['free'],
  free: []
};
