/**
 * Tier-Specific Host Scripts
 * 
 * Each tier has a unique tone and set of greeting/guidance lines.
 */

export interface TierScript {
  tone: string;
  greetings: { en: string; vi: string }[];
  encouragements: { en: string; vi: string }[];
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

/**
 * Get tier script by tier ID
 */
export function getTierScript(tier: string): TierScript {
  const normalizedTier = tier.toLowerCase().replace('-', '');
  return TIER_SCRIPTS[normalizedTier] || TIER_SCRIPTS.free;
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
