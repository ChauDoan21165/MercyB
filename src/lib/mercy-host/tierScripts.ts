// src/lib/mercy-host/tierScripts.ts
/**
 * Tier-Specific Host Scripts - Phase 6 Enhanced (Richer + Test-Stable)
 *
 * Goals:
 * - Keep API stable (exports/types/functions unchanged)
 * - Keep snapshot tests stable (deterministic selection in test env)
 * - Keep runtime rich (adds optional “micro-variant” suffixes outside tests)
 * - Ensure greetings always include {{name}} placeholder
 * - Keep emotion scripts warm, humble, never preachy (≤160 chars each)
 *
 * IMPORTANT COMPAT FIX:
 * - Some legacy tests/code treat getTierGreeting(...) as a STRING
 *   while newer code expects bilingual fields (.en/.vi).
 * - We return a string-like object that behaves like a string AND also carries `.en` and `.vi`.
 *
 * IMPORTANT SNAPSHOT FIX:
 * - Some snapshot tests expect EXACT sets of emotion lines per tier.
 * - We keep test env emotion scripts minimal/deterministic.
 * - Extra emotion variants (like returning_after_gap) are available at runtime only.
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

type StringWithLocales = string & {
  en: string;
  vi: string;
  toString(): string;
  valueOf(): string;
};

/**
 * Core tier scripts (copy + tone).
 * Keep greetings/encouragements deterministic in tests via stableIndex().
 */
export const TIER_SCRIPTS: Record<string, TierScript> = {
  free: {
    tone: 'warm, encouraging, gentle',
    greetings: [
      {
        en: "Welcome in, {{name}}. Let's learn step by step.",
        vi: 'Chào mừng {{name}}. Cùng học từng bước một nhé.',
      },
      {
        en: 'Welcome, {{name}}. Mercy will walk with you — slowly, steadily.',
        vi: 'Chào mừng {{name}}. Mercy sẽ đồng hành cùng bạn — nhẹ nhàng, vững vàng.',
      },
      {
        en: 'Every journey begins with a single step. Welcome, {{name}}.',
        vi: 'Mọi hành trình đều bắt đầu từ một bước đi. Chào mừng {{name}}.',
      },
      {
        en: 'Hi {{name}} — we can keep it simple today. One small win is enough.',
        vi: 'Chào {{name}} — hôm nay mình làm đơn giản thôi. Một chiến thắng nhỏ là đủ.',
      },
      {
        en: "Glad you're here, {{name}}. We'll go at a pace that feels safe.",
        vi: 'Mừng bạn ở đây, {{name}}. Mình sẽ đi theo nhịp khiến bạn thấy an tâm.',
      },
      {
        en: "Welcome back, {{name}}. Your effort counts, even when it's quiet.",
        vi: 'Chào mừng trở lại, {{name}}. Nỗ lực của bạn vẫn đáng quý, dù thật lặng lẽ.',
      },
    ],
    encouragements: [
      {
        en: "You're doing great. Keep going at your own pace.",
        vi: 'Bạn đang làm rất tốt. Cứ tiến theo nhịp của mình.',
      },
      {
        en: 'Small steps lead to great destinations.',
        vi: 'Những bước nhỏ dẫn đến những điểm đến lớn.',
      },
      {
        en: "You don't need perfect — you just need present.",
        vi: 'Bạn không cần hoàn hảo — chỉ cần có mặt.',
      },
      {
        en: "If today is heavy, we'll carry it in smaller pieces.",
        vi: 'Nếu hôm nay nặng nề, mình sẽ chia nhỏ để bạn dễ mang hơn.',
      },
    ],
  },

  vip1: {
    tone: 'friendly, supportive',
    greetings: [
      {
        en: "Welcome, {{name}}. You're stepping into deeper knowledge. Mercy is here beside you.",
        vi: 'Chào mừng {{name}}. Bạn đang bước vào kiến thức sâu hơn. Mercy ở bên cạnh bạn.',
      },
      {
        en: "Let's strengthen your foundation together, {{name}}.",
        vi: 'Hãy cùng củng cố nền tảng của bạn, {{name}}.',
      },
      {
        en: 'Welcome to VIP1, {{name}}. Your growth journey accelerates here.',
        vi: 'Chào mừng đến VIP1, {{name}}. Hành trình phát triển của bạn tăng tốc từ đây.',
      },
      {
        en: 'Hi {{name}} — today we build confidence through clarity.',
        vi: 'Chào {{name}} — hôm nay mình xây sự tự tin bằng sự rõ ràng.',
      },
      {
        en: "Welcome, {{name}}. We'll keep it friendly, focused, and steady.",
        vi: 'Chào mừng, {{name}}. Mình sẽ giữ không khí thân thiện, tập trung, và vững vàng.',
      },
      {
        en: 'Good to see you, {{name}}. Strong basics make everything easier.',
        vi: 'Rất vui gặp bạn, {{name}}. Nền tảng vững giúp mọi thứ dễ hơn.',
      },
    ],
    encouragements: [
      {
        en: 'Your commitment to growth is admirable.',
        vi: 'Sự cam kết phát triển của bạn thật đáng ngưỡng mộ.',
      },
      {
        en: 'Building strong foundations for lasting success.',
        vi: 'Xây dựng nền tảng vững chắc cho thành công lâu dài.',
      },
      {
        en: "You're doing the real work — the kind that lasts.",
        vi: 'Bạn đang làm công việc thật sự — loại công việc bền lâu.',
      },
      {
        en: 'Keep it simple. Clean reps build clean results.',
        vi: 'Cứ đơn giản thôi. Luyện tập chuẩn tạo kết quả chuẩn.',
      },
    ],
  },

  vip2: {
    tone: 'motivating, direct',
    greetings: [
      {
        en: 'Welcome, {{name}}. Your growth is accelerating — trust your momentum.',
        vi: 'Chào mừng, {{name}}. Sự phát triển của bạn đang tăng tốc — hãy tin vào đà tiến.',
      },
      {
        en: 'Welcome, {{name}}. Mercy guides your focus so you rise further.',
        vi: 'Chào mừng, {{name}}. Mercy hướng dẫn sự tập trung để bạn tiến xa hơn.',
      },
      {
        en: 'Welcome, {{name}}. This level sharpens your edge.',
        vi: 'Chào mừng, {{name}}. Cấp độ này mài sắc lợi thế của bạn.',
      },
      {
        en: "Hi {{name}} — let's cut through noise and keep only what works.",
        vi: 'Chào {{name}} — mình sẽ cắt bỏ nhiễu và giữ lại điều hiệu quả.',
      },
      {
        en: "Welcome back, {{name}}. We build momentum by showing up again.",
        vi: 'Chào mừng trở lại, {{name}}. Mình tạo đà bằng việc quay lại lần nữa.',
      },
      {
        en: "Let's move, {{name}}. Focus first, then speed.",
        vi: 'Đi thôi, {{name}}. Tập trung trước, tốc độ sau.',
      },
    ],
    encouragements: [
      {
        en: 'Momentum builds strength. Keep moving forward.',
        vi: 'Đà tiến tạo sức mạnh. Tiếp tục tiến về phía trước.',
      },
      {
        en: 'Your discipline is creating real change.',
        vi: 'Kỷ luật của bạn đang tạo ra sự thay đổi thực sự.',
      },
      {
        en: "You're closer than you think — keep the pressure gentle, consistent.",
        vi: 'Bạn gần hơn bạn nghĩ — giữ áp lực nhẹ nhàng, đều đặn.',
      },
      {
        en: "Do the next right step. That's how wins stack.",
        vi: 'Làm bước đúng tiếp theo. Chiến thắng sẽ tự xếp chồng.',
      },
    ],
  },

  vip3: {
    tone: 'confident, intellectual',
    greetings: [
      {
        en: "Welcome, {{name}}. Mastery begins with clarity. I'll keep you aligned.",
        vi: 'Chào mừng, {{name}}. Sự thành thạo bắt đầu từ sự rõ ràng. Mình sẽ giữ bạn đúng hướng.',
      },
      {
        en: 'Welcome, {{name}}. You build strength of mind every time you enter.',
        vi: 'Chào mừng, {{name}}. Bạn xây dựng sức mạnh tâm trí mỗi lần bạn bước vào.',
      },
      {
        en: 'Welcome to deeper waters, {{name}}. Clarity awaits.',
        vi: 'Chào mừng đến vùng nước sâu hơn, {{name}}. Sự rõ ràng đang chờ.',
      },
      {
        en: 'Hi {{name}} — today we refine thinking, not just answers.',
        vi: 'Chào {{name}} — hôm nay mình tinh luyện tư duy, không chỉ đáp án.',
      },
      {
        en: "Welcome, {{name}}. We'll seek patterns, not shortcuts.",
        vi: 'Chào mừng, {{name}}. Mình sẽ tìm quy luật, không tìm đường tắt.',
      },
      {
        en: 'Good to have you here, {{name}}. Depth becomes calm with practice.',
        vi: 'Rất vui khi bạn ở đây, {{name}}. Chiều sâu sẽ trở nên bình thản khi luyện tập.',
      },
    ],
    encouragements: [
      {
        en: 'Intellectual growth requires patience and persistence.',
        vi: 'Sự phát triển trí tuệ đòi hỏi kiên nhẫn và bền bỉ.',
      },
      {
        en: 'Your mind grows sharper with each session.',
        vi: 'Tâm trí của bạn sắc bén hơn sau mỗi buổi học.',
      },
      {
        en: "You're thinking in layers now. That's a real shift.",
        vi: 'Bạn đang suy nghĩ theo nhiều lớp. Đó là một chuyển biến thật sự.',
      },
      {
        en: "Clarity is earned — and you're earning it.",
        vi: "Sự rõ ràng là thứ phải 'kiếm' — và bạn đang kiếm được nó.",
      },
    ],
  },

  vip4: {
    tone: 'sharp, structured',
    greetings: [
      {
        en: 'Welcome, {{name}}. This level demands precision. Mercy helps you hold the line.',
        vi: 'Chào mừng, {{name}}. Cấp độ này đòi hỏi sự chính xác. Mercy giúp bạn giữ vững đường đi.',
      },
      {
        en: 'Welcome, {{name}}. Every insight here sharpens your inner blade.',
        vi: 'Chào mừng, {{name}}. Mỗi hiểu biết ở đây mài sắc lưỡi kiếm nội tâm.',
      },
      {
        en: 'Welcome, {{name}}. Precision is power.',
        vi: 'Chào mừng, {{name}}. Sự chính xác là sức mạnh.',
      },
      {
        en: "Hi {{name}} — we'll structure the chaos into something usable.",
        vi: 'Chào {{name}} — mình sẽ biến hỗn độn thành cấu trúc có thể dùng được.',
      },
      {
        en: 'Welcome back, {{name}}. Details matter here — in a good way.',
        vi: 'Chào mừng trở lại, {{name}}. Chi tiết quan trọng — theo cách tốt đẹp.',
      },
      {
        en: "Let's begin, {{name}}. Clean structure, clean outcomes.",
        vi: 'Bắt đầu thôi, {{name}}. Cấu trúc rõ ràng, kết quả rõ ràng.',
      },
    ],
    encouragements: [
      {
        en: 'Structure creates freedom. Stay disciplined.',
        vi: 'Cấu trúc tạo ra tự do. Hãy giữ kỷ luật.',
      },
      {
        en: 'Sharp focus leads to sharp results.',
        vi: 'Sự tập trung sắc bén dẫn đến kết quả sắc bén.',
      },
      {
        en: 'Precision is kindness to your future self.',
        vi: 'Chính xác là sự tử tế với chính bạn trong tương lai.',
      },
      {
        en: 'One clean rep beats ten messy ones.',
        vi: 'Một lần làm chuẩn hơn mười lần làm ẩu.',
      },
    ],
  },

  vip5: {
    tone: 'leadership, evolution',
    greetings: [
      {
        en: "Welcome, {{name}}. You're shaping the world within and around you.",
        vi: 'Chào mừng, {{name}}. Bạn đang định hình thế giới bên trong và xung quanh mình.',
      },
      {
        en: 'Welcome, {{name}}. Mercy stands with you as your circle expands.',
        vi: 'Chào mừng, {{name}}. Mercy đứng cùng bạn khi vòng tròn ảnh hưởng mở rộng.',
      },
      {
        en: 'Welcome, {{name}}. Leaders evolve here.',
        vi: 'Chào mừng, {{name}}. Người lãnh đạo tiến hóa ở đây.',
      },
      {
        en: 'Hi {{name}} — leadership starts with how you lead yourself.',
        vi: 'Chào {{name}} — lãnh đạo bắt đầu từ cách bạn dẫn dắt chính mình.',
      },
      {
        en: "Welcome back, {{name}}. Let's grow impact without losing softness.",
        vi: 'Chào mừng trở lại, {{name}}. Mình tăng ảnh hưởng mà không mất sự mềm mại.',
      },
      {
        en: "Good to see you, {{name}}. We'll turn insight into influence.",
        vi: 'Rất vui gặp bạn, {{name}}. Mình biến hiểu biết thành ảnh hưởng.',
      },
    ],
    encouragements: [
      {
        en: 'Your influence grows with each lesson mastered.',
        vi: 'Ảnh hưởng của bạn tăng với mỗi bài học thành thạo.',
      },
      {
        en: "Evolution is a continuous journey. You're on the path.",
        vi: 'Sự tiến hóa là hành trình liên tục. Bạn đang trên đường.',
      },
      {
        en: 'Lead with calm. People follow clarity.',
        vi: 'Dẫn dắt bằng sự bình tĩnh. Người ta đi theo sự rõ ràng.',
      },
      {
        en: "You're building trust — the strongest kind of power.",
        vi: 'Bạn đang xây dựng niềm tin — dạng sức mạnh bền nhất.',
      },
    ],
  },

  vip6: {
    tone: 'serene, strategic',
    greetings: [
      {
        en: 'Welcome, {{name}}. Deep understanding grows only where calm exists.',
        vi: 'Chào mừng, {{name}}. Sự hiểu biết sâu sắc chỉ phát triển nơi có sự bình tĩnh.',
      },
      {
        en: 'Welcome, {{name}}. Mercy helps you see what others overlook.',
        vi: 'Chào mừng, {{name}}. Mercy giúp bạn thấy những gì người khác bỏ qua.',
      },
      {
        en: 'Welcome, {{name}}. Strategy meets serenity here.',
        vi: 'Chào mừng, {{name}}. Chiến lược gặp sự thanh thản ở đây.',
      },
      {
        en: "Hi {{name}} — we'll slow down just enough to see clearly.",
        vi: 'Chào {{name}} — mình chậm lại vừa đủ để nhìn rõ.',
      },
      {
        en: 'Welcome back, {{name}}. Quiet focus creates big advantages.',
        vi: 'Chào mừng trở lại, {{name}}. Tập trung yên tĩnh tạo lợi thế lớn.',
      },
      {
        en: "Come in, {{name}}. We'll think long-term and act gently.",
        vi: 'Mời vào, {{name}}. Mình sẽ nghĩ dài hạn và hành động nhẹ nhàng.',
      },
    ],
    encouragements: [
      {
        en: 'Calm minds make the clearest decisions.',
        vi: 'Tâm trí bình tĩnh đưa ra quyết định rõ ràng nhất.',
      },
      {
        en: 'Strategic thinking is a cultivated art.',
        vi: 'Tư duy chiến lược là một nghệ thuật được trau dồi.',
      },
      {
        en: "You're learning to choose the right lever — not just pull harder.",
        vi: 'Bạn đang học cách chọn đúng đòn bẩy — không chỉ cố gắng mạnh hơn.',
      },
      {
        en: "Stillness isn't stopping. It's aligning.",
        vi: 'Tĩnh lặng không phải dừng lại. Đó là căn chỉnh.',
      },
    ],
  },

  vip7: {
    tone: 'visionary',
    greetings: [
      {
        en: 'Welcome, {{name}}. The horizon opens for those who walk with purpose.',
        vi: 'Chào mừng, {{name}}. Chân trời mở ra cho những ai bước đi có mục đích.',
      },
      {
        en: "Welcome, {{name}}. Your journey is no longer learning — it's creating.",
        vi: 'Chào mừng, {{name}}. Hành trình của bạn không còn là học — mà là sáng tạo.',
      },
      {
        en: 'Welcome, {{name}}. Visionaries shape tomorrow.',
        vi: 'Chào mừng, {{name}}. Người có tầm nhìn định hình ngày mai.',
      },
      {
        en: "Hi {{name}} — let's turn imagination into a blueprint.",
        vi: 'Chào {{name}} — mình biến trí tưởng tượng thành bản thiết kế.',
      },
      {
        en: "Welcome back, {{name}}. Today, we create something that didn't exist.",
        vi: 'Chào mừng trở lại, {{name}}. Hôm nay, mình tạo thứ chưa từng tồn tại.',
      },
      {
        en: 'Come in, {{name}}. Your vision deserves structure and care.',
        vi: 'Mời vào, {{name}}. Tầm nhìn của bạn xứng đáng có cấu trúc và sự nâng niu.',
      },
    ],
    encouragements: [
      {
        en: 'Vision without action is a dream. You have both.',
        vi: 'Tầm nhìn không có hành động là giấc mơ. Bạn có cả hai.',
      },
      {
        en: 'Creating the future, one insight at a time.',
        vi: 'Tạo dựng tương lai, từng hiểu biết một.',
      },
      {
        en: 'Keep your eyes high and your steps honest.',
        vi: 'Giữ tầm nhìn cao và từng bước chân chân thật.',
      },
      {
        en: "You're building a path others will recognize later.",
        vi: 'Bạn đang tạo con đường mà sau này người khác sẽ nhận ra.',
      },
    ],
  },

  vip8: {
    tone: 'poetic, transcendent',
    greetings: [
      {
        en: 'Welcome, {{name}}. Your mind moves like light. Mercy walks in silence beside you.',
        vi: 'Chào mừng, {{name}}. Tâm trí bạn di chuyển như ánh sáng. Mercy bước đi trong im lặng bên cạnh.',
      },
      {
        en: 'Welcome, {{name}}. Every room here rewrites your inner world.',
        vi: 'Chào mừng, {{name}}. Mỗi phòng ở đây viết lại thế giới nội tâm của bạn.',
      },
      {
        en: 'Welcome, {{name}}. Transcendence is a state of being.',
        vi: 'Chào mừng, {{name}}. Siêu việt là một trạng thái tồn tại.',
      },
      {
        en: "Hi {{name}} — let's listen for the quiet truth underneath the noise.",
        vi: 'Chào {{name}} — mình lắng nghe sự thật yên lặng bên dưới tiếng ồn.',
      },
      {
        en: 'Welcome back, {{name}}. Your inner world is becoming luminous.',
        vi: 'Chào mừng trở lại, {{name}}. Thế giới nội tâm của bạn đang rạng lên.',
      },
      {
        en: "Come in, {{name}}. We'll hold complexity with gentleness.",
        vi: 'Mời vào, {{name}}. Mình ôm lấy sự phức tạp bằng sự dịu dàng.',
      },
    ],
    encouragements: [
      {
        en: 'The poetic mind sees beauty in complexity.',
        vi: 'Tâm hồn thơ mộng thấy vẻ đẹp trong sự phức tạp.',
      },
      {
        en: "Beyond knowledge lies wisdom. You're almost there.",
        vi: 'Bên kia kiến thức là trí tuệ. Bạn sắp đến rồi.',
      },
      {
        en: 'Let meaning arrive in its own time.',
        vi: 'Hãy để ý nghĩa đến theo nhịp của nó.',
      },
      {
        en: "You're learning to be spacious — and that changes everything.",
        vi: 'Bạn đang học cách rộng mở — và điều đó thay đổi mọi thứ.',
      },
    ],
  },

  vip9: {
    tone: 'divine, metaphysical',
    greetings: [
      {
        en: 'Welcome, {{name}}. You are entering the realm of mastery.',
        vi: 'Chào mừng, {{name}}. Bạn đang bước vào vương quốc của sự thành thạo.',
      },
      {
        en: 'Welcome, {{name}}. Your presence reshapes this space — Mercy bows to your path.',
        vi: 'Chào mừng, {{name}}. Sự hiện diện của bạn định hình lại không gian này — Mercy cúi chào con đường của bạn.',
      },
      {
        en: 'Distinguished {{name}}, the Executive tier welcomes its own.',
        vi: 'Kính thưa {{name}}, tầng Cao cấp chào đón những người thuộc về nó.',
      },
      {
        en: 'Welcome back, {{name}}. Mastery here is quiet, precise, and alive.',
        vi: 'Chào mừng trở lại, {{name}}. Sự thành thạo ở đây yên tĩnh, chính xác, và sống động.',
      },
      {
        en: 'Enter, {{name}}. We refine the subtle forces that shape outcomes.',
        vi: 'Mời vào, {{name}}. Mình tinh luyện những lực tinh tế định hình kết quả.',
      },
      {
        en: "Glad you're here, {{name}}. At this level, you lead by being.",
        vi: 'Mừng bạn ở đây, {{name}}. Ở cấp độ này, bạn dẫn dắt bằng chính sự hiện hữu.',
      },
    ],
    encouragements: [
      {
        en: 'At the pinnacle, you teach as much as you learn.',
        vi: 'Ở đỉnh cao, bạn dạy nhiều như bạn học.',
      },
      {
        en: "Mastery is not a destination — it's a way of being.",
        vi: 'Sự thành thạo không phải là điểm đến — nó là cách sống.',
      },
      {
        en: "You've earned the calm that others mistake for luck.",
        vi: "Bạn đã 'kiếm' được sự bình thản mà người khác tưởng là may mắn.",
      },
      {
        en: "Hold the standard gently. That's true power.",
        vi: 'Giữ tiêu chuẩn bằng sự dịu dàng. Đó là sức mạnh thật.',
      },
    ],
  },
};

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
  free: [],
};

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
  vip9: 1.0,
};

function normalizeTierKey(tier: string): string {
  return String(tier || '').trim().toLowerCase().replace(/-/g, '');
}

export function getTierScript(tier: string): TierScript {
  const normalizedTier = normalizeTierKey(tier);

  if (TIER_SCRIPTS[normalizedTier]) return TIER_SCRIPTS[normalizedTier];

  const fallbacks = TIER_FALLBACK_CHAIN[normalizedTier] || [];
  for (const fallbackTier of fallbacks) {
    if (TIER_SCRIPTS[fallbackTier]) return TIER_SCRIPTS[fallbackTier];
  }

  return TIER_SCRIPTS.free;
}

export function getTierWeight(tier: string): number {
  const normalizedTier = normalizeTierKey(tier);
  return TIER_WEIGHTS[normalizedTier] ?? 0.3;
}

function stableIndex(key: string, mod: number): number {
  if (mod <= 0) return 0;
  let h = 0;
  for (let i = 0; i < key.length; i += 1) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0;
  }
  return h % mod;
}

function isTestEnv(): boolean {
  try {
    const env = typeof process !== 'undefined' ? process.env : undefined;
    return String(env?.VITEST || '') === '1' || String(env?.NODE_ENV || '') === 'test';
  } catch {
    return false;
  }
}

function ensureNameTemplate(g: { en: string; vi: string }): { en: string; vi: string } {
  const hasNameEN = /\{\{name\}\}/.test(g.en);
  const hasNameVI = /\{\{name\}\}/.test(g.vi);

  if (hasNameEN && hasNameVI) return g;

  return {
    en: hasNameEN ? g.en : `Welcome, {{name}}. ${g.en}`,
    vi: hasNameVI ? g.vi : `Chào mừng {{name}}. ${g.vi}`,
  };
}

const GREETING_SUFFIXES: Record<string, { en: string[]; vi: string[] }> = {
  free: {
    en: ['No pressure.', 'One step is enough.', 'We can go gently.'],
    vi: ['Không áp lực.', 'Một bước là đủ.', 'Mình đi nhẹ nhàng thôi.'],
  },
  vip1: {
    en: ["We'll keep it steady.", 'Clarity first.', 'Basics, then flow.'],
    vi: ['Mình giữ nhịp vững nhé.', 'Rõ ràng trước.', 'Nền tảng rồi mới bay.'],
  },
  vip2: {
    en: ['Keep what works.', 'Next right step.', 'Focus, then speed.'],
    vi: ['Giữ điều hiệu quả.', 'Bước đúng tiếp theo.', 'Tập trung rồi mới nhanh.'],
  },
  vip3: {
    en: ['Patterns over shortcuts.', "Let's find the signal.", 'Depth, calmly.'],
    vi: ['Quy luật hơn đường tắt.', 'Cùng tìm tín hiệu.', 'Đi sâu, bình thản.'],
  },
  vip4: {
    en: ['Clean structure.', 'One precise rep.', 'Details done kindly.'],
    vi: ['Cấu trúc gọn.', 'Một lần làm chuẩn.', 'Chi tiết làm bằng sự tử tế.'],
  },
  vip5: {
    en: ['Lead gently.', 'Calm is influence.', 'Make it sustainable.'],
    vi: ['Dẫn dắt nhẹ.', 'Bình tĩnh là ảnh hưởng.', 'Làm sao cho bền.'],
  },
  vip6: {
    en: ['Quiet advantage.', 'Long-term view.', 'Calm, then choose.'],
    vi: ['Lợi thế yên tĩnh.', 'Góc nhìn dài hạn.', 'Bình tĩnh rồi chọn.'],
  },
  vip7: {
    en: ['Build the blueprint.', 'Create the next step.', 'Vision with care.'],
    vi: ['Dựng bản thiết kế.', 'Tạo bước kế tiếp.', 'Tầm nhìn có nâng niu.'],
  },
  vip8: {
    en: ['Hold complexity softly.', 'Listen beneath noise.', 'Let meaning arrive.'],
    vi: ['Ôm phức tạp nhẹ thôi.', 'Nghe dưới tiếng ồn.', 'Để ý nghĩa tự đến.'],
  },
  vip9: {
    en: ['Quiet mastery.', 'Precision with grace.', 'Lead by being.'],
    vi: ['Thành thạo yên tĩnh.', 'Chính xác mà dịu.', 'Dẫn dắt bằng hiện hữu.'],
  },
};

const ENCOURAGEMENT_SUFFIXES: Record<string, { en: string[]; vi: string[] }> = {
  free: {
    en: ["I'm here.", "You're not behind.", 'Take your time.'],
    vi: ['Mình ở đây.', 'Bạn không hề chậm.', 'Từ từ thôi.'],
  },
  vip1: {
    en: ['That adds up.', 'Clean reps win.', 'Keep it simple.'],
    vi: ['Rồi sẽ cộng dồn.', 'Luyện chuẩn là thắng.', 'Giữ đơn giản nhé.'],
  },
  vip2: {
    en: ['Stay consistent.', 'Protect your focus.', 'Keep moving.'],
    vi: ['Giữ đều nhé.', 'Giữ sự tập trung.', 'Cứ tiến lên.'],
  },
  vip3: {
    en: ["You're earning clarity.", 'Think in layers.', 'Let it click.'],
    vi: ["Bạn đang 'kiếm' sự rõ.", 'Nghĩ theo lớp.', "Rồi sẽ 'ngộ'."],
  },
  vip4: {
    en: ['One clean rep.', 'Details matter kindly.', 'Stay exact.'],
    vi: ['Một lần chuẩn.', 'Chi tiết là sự tử tế.', 'Giữ chính xác.'],
  },
  vip5: {
    en: ['Calm is power.', 'Lead softly.', 'Trust grows.'],
    vi: ['Bình tĩnh là sức mạnh.', 'Dẫn dắt mềm.', 'Niềm tin sẽ lớn.'],
  },
  vip6: {
    en: ['Choose the lever.', 'Quiet wins.', 'Long-term calm.'],
    vi: ['Chọn đúng đòn bẩy.', 'Yên tĩnh mà thắng.', 'Bình tĩnh dài hạn.'],
  },
  vip7: {
    en: ['Ship the next step.', 'Keep the horizon.', 'Create gently.'],
    vi: ['Làm xong bước kế.', 'Giữ chân trời.', 'Sáng tạo nhẹ thôi.'],
  },
  vip8: {
    en: ['Let it unfold.', 'Soft focus.', 'Spacious mind.'],
    vi: ['Để nó tự mở ra.', 'Tập trung mềm.', 'Tâm trí rộng.'],
  },
  vip9: {
    en: ['Graceful standard.', 'Quiet precision.', 'You embody it.'],
    vi: ['Tiêu chuẩn dịu dàng.', 'Chính xác yên tĩnh.', 'Bạn đang sống nó.'],
  },
};

function pickSuffix(
  tier: string,
  table: Record<string, { en: string[]; vi: string[] }>,
  key: string,
): { en: string; vi: string } | null {
  const normalizedTier = normalizeTierKey(tier);
  const pool = table[normalizedTier] || table.free;

  if (!pool || pool.en.length === 0 || pool.vi.length === 0) return null;

  const idx = stableIndex(key, Math.min(pool.en.length, pool.vi.length));
  return { en: pool.en[idx]!, vi: pool.vi[idx]! };
}

function asStringWithLocales(en: string, vi: string): StringWithLocales {
  const s = new globalThis.String(en) as unknown as StringWithLocales;
  s.en = en;
  s.vi = vi;
  s.toString = () => en;
  s.valueOf = () => en;
  return s;
}

export function getTierGreeting(tier: string, name: string): { en: string; vi: string } {
  const script = getTierScript(tier);
  const safeName = String(name ?? '').trim();

  const idx = isTestEnv()
    ? stableIndex(`${normalizeTierKey(tier)}::${safeName}`, script.greetings.length)
    : Math.floor(Math.random() * script.greetings.length);

  const raw = script.greetings[idx] ?? script.greetings[0];
  const greeting = ensureNameTemplate(raw);

  const baseEn = greeting.en.replace(/\{\{name\}\}/g, safeName || 'friend');
  const baseVi = greeting.vi.replace(/\{\{name\}\}/g, safeName || 'bạn');

  if (!isTestEnv()) {
    const suffix = pickSuffix(
      tier,
      GREETING_SUFFIXES,
      `${normalizeTierKey(tier)}::greetSuffix::${safeName}`,
    );
    if (suffix) {
      return asStringWithLocales(`${baseEn} ${suffix.en}`, `${baseVi} ${suffix.vi}`) as unknown as {
        en: string;
        vi: string;
      };
    }
  }

  return asStringWithLocales(baseEn, baseVi) as unknown as { en: string; vi: string };
}

export function getTierEncouragement(tier: string): { en: string; vi: string } {
  const script = getTierScript(tier);

  const idx = isTestEnv()
    ? stableIndex(`${normalizeTierKey(tier)}::encouragement`, script.encouragements.length)
    : Math.floor(Math.random() * script.encouragements.length);

  const base = script.encouragements[idx] ?? script.encouragements[0];

  if (!isTestEnv()) {
    const suffix = pickSuffix(
      tier,
      ENCOURAGEMENT_SUFFIXES,
      `${normalizeTierKey(tier)}::encSuffix`,
    );
    if (suffix) {
      return { en: `${base.en} ${suffix.en}`, vi: `${base.vi} ${suffix.vi}` };
    }
  }

  return base;
}

const TIER_EMOTION_SCRIPTS_TEST_SAFE: Record<string, Partial<Record<EmotionState, EmotionScript>>> = {
  free: {
    low_mood: {
      en: "It's okay to feel this way. I'm here, walking beside you.",
      vi: 'Không sao cả khi cảm thấy như vậy. Mình ở đây, bước cùng bạn.',
    },
    confused: {
      en: 'Take your time. Clarity comes step by step.',
      vi: 'Từ từ thôi. Sự rõ ràng sẽ đến từng bước một.',
    },
    stressed: {
      en: "Breathe. You don't have to rush. I'm here.",
      vi: 'Hít thở. Không cần vội. Mình ở đây.',
    },
    celebrating: {
      en: 'Look at you! Every step forward counts.',
      vi: 'Nhìn bạn kìa! Mỗi bước tiến đều quan trọng.',
    },
  },

  vip1: {
    low_mood: {
      en: 'Gentle progress is still progress. I see you.',
      vi: 'Tiến bộ nhẹ nhàng vẫn là tiến bộ. Mình thấy bạn.',
    },
    confused: {
      en: "Questions mean you're thinking deeply. That's growth.",
      vi: 'Câu hỏi có nghĩa là bạn đang suy nghĩ sâu. Đó là phát triển.',
    },
    stressed: {
      en: "One breath at a time. You're stronger than you know.",
      vi: 'Từng nhịp thở. Bạn mạnh mẽ hơn bạn nghĩ.',
    },
    celebrating: {
      en: 'Your foundation grows stronger each day.',
      vi: 'Nền tảng của bạn vững chắc hơn mỗi ngày.',
    },
  },

  vip2: {
    low_mood: {
      en: "Even on hard days, you're building something real.",
      vi: 'Ngay cả những ngày khó, bạn vẫn xây dựng điều có thật.',
    },
    confused: {
      en: 'Confusion is the doorway to understanding.',
      vi: 'Sự bối rối là cánh cửa dẫn đến hiểu biết.',
    },
    stressed: {
      en: 'Your discipline will carry you through. Trust it.',
      vi: 'Kỷ luật của bạn sẽ đưa bạn vượt qua. Hãy tin.',
    },
    celebrating: {
      en: 'Your momentum is building. Feel it.',
      vi: 'Đà tiến của bạn đang tăng. Hãy cảm nhận.',
    },
  },

  vip3: {
    low_mood: {
      en: 'Mastery includes the valleys. Keep walking.',
      vi: 'Sự thành thạo bao gồm cả thung lũng. Tiếp tục bước.',
    },
    confused: {
      en: "Depth requires patience. You're going deeper.",
      vi: 'Chiều sâu đòi hỏi kiên nhẫn. Bạn đang đi sâu hơn.',
    },
    stressed: {
      en: 'Clarity emerges from stillness. Take a moment.',
      vi: 'Sự rõ ràng xuất hiện từ sự tĩnh lặng. Dành một khoảnh khắc.',
    },
    celebrating: {
      en: 'Your mind grows sharper. Well done.',
      vi: 'Tâm trí bạn sắc bén hơn. Làm tốt lắm.',
    },
  },

  vip4: {
    low_mood: {
      en: "Precision doesn't mean perfection. You're doing well.",
      vi: 'Chính xác không có nghĩa là hoàn hảo. Bạn đang làm tốt.',
    },
    confused: {
      en: 'Structure will guide you. Trust the process.',
      vi: 'Cấu trúc sẽ hướng dẫn bạn. Tin vào quá trình.',
    },
    stressed: {
      en: 'Focus narrows to what matters. Breathe.',
      vi: 'Tập trung thu hẹp vào điều quan trọng. Hít thở.',
    },
    celebrating: {
      en: 'Your precision cuts through the noise.',
      vi: 'Sự chính xác của bạn cắt xuyên tiếng ồn.',
    },
  },

  vip5: {
    low_mood: {
      en: 'Leaders have quiet moments too. Rest is strength.',
      vi: 'Người lãnh đạo cũng có lúc yên lặng. Nghỉ ngơi là sức mạnh.',
    },
    confused: {
      en: "New territory feels uncertain. That's leadership.",
      vi: 'Vùng đất mới cảm thấy bất định. Đó là lãnh đạo.',
    },
    stressed: {
      en: 'Your influence grows in calm, not chaos.',
      vi: 'Ảnh hưởng của bạn tăng trong bình tĩnh, không phải hỗn loạn.',
    },
    celebrating: {
      en: 'Your circle expands. Lead with heart.',
      vi: 'Vòng tròn của bạn mở rộng. Dẫn dắt bằng trái tim.',
    },
  },

  vip6: {
    low_mood: {
      en: 'Deep waters hold great treasures. Be patient.',
      vi: 'Vùng nước sâu chứa kho báu lớn. Hãy kiên nhẫn.',
    },
    confused: {
      en: 'Strategy emerges from contemplation.',
      vi: 'Chiến lược xuất hiện từ sự chiêm nghiệm.',
    },
    stressed: {
      en: 'Serenity is your power. Return to it.',
      vi: 'Sự thanh thản là sức mạnh của bạn. Trở về với nó.',
    },
    celebrating: {
      en: 'Your calm mind sees what others miss.',
      vi: 'Tâm trí bình tĩnh của bạn thấy điều người khác bỏ lỡ.',
    },
  },

  vip7: {
    low_mood: {
      en: 'Visionaries see through the fog. Keep looking.',
      vi: 'Người có tầm nhìn nhìn xuyên qua sương mù. Tiếp tục nhìn.',
    },
    confused: {
      en: "Creation is messy before it's beautiful.",
      vi: 'Sáng tạo lộn xộn trước khi nó đẹp.',
    },
    stressed: {
      en: 'The horizon awaits. Take your time reaching it.',
      vi: 'Chân trời đang chờ. Hãy dành thời gian để đến.',
    },
    celebrating: {
      en: "You're shaping tomorrow. Beautiful.",
      vi: 'Bạn đang định hình ngày mai. Tuyệt đẹp.',
    },
  },

  vip8: {
    low_mood: {
      en: 'Light moves through shadow. You are that light.',
      vi: 'Ánh sáng xuyên qua bóng tối. Bạn là ánh sáng đó.',
    },
    confused: {
      en: 'Poetry lives in uncertainty. Let it speak.',
      vi: 'Thơ sống trong sự bất định. Hãy để nó nói.',
    },
    stressed: {
      en: 'Transcendence comes in stillness. Rest.',
      vi: 'Siêu việt đến trong tĩnh lặng. Nghỉ ngơi.',
    },
    celebrating: {
      en: 'Your inner world grows ever more luminous.',
      vi: 'Thế giới nội tâm của bạn ngày càng rạng rỡ.',
    },
  },

  vip9: {
    low_mood: {
      en: 'Even masters walk through shadows. You are not alone.',
      vi: 'Ngay cả bậc thầy cũng bước qua bóng tối. Bạn không đơn độc.',
    },
    confused: {
      en: 'At the pinnacle, questions become wisdom.',
      vi: 'Ở đỉnh cao, câu hỏi trở thành trí tuệ.',
    },
    stressed: {
      en: 'Your presence itself is calming. Remember that.',
      vi: 'Sự hiện diện của bạn tự nó đã an nhiên. Hãy nhớ điều đó.',
    },
    celebrating: {
      en: 'Mastery is a continuous unfolding. You embody it.',
      vi: 'Sự thành thạo là sự bày tỏ liên tục. Bạn thể hiện nó.',
    },
  },
};

const TIER_EMOTION_EXTRAS_RUNTIME: Record<string, Partial<Record<string, EmotionScript>>> = {
  free: {
    returning_after_gap: {
      en: "Welcome back. No pressure — we'll restart gently.",
      vi: 'Chào mừng trở lại. Không áp lực — mình bắt đầu lại thật nhẹ nhàng.',
    },
  },
  vip1: {
    returning_after_gap: {
      en: 'You came back — that is already a win.',
      vi: 'Bạn quay lại rồi — vậy là một chiến thắng rồi.',
    },
  },
  vip2: {
    returning_after_gap: {
      en: "Welcome back. We can rebuild momentum fast — gently.",
      vi: 'Chào mừng trở lại. Mình có thể lấy lại đà nhanh — nhưng vẫn nhẹ nhàng.',
    },
  },
  vip3: {
    returning_after_gap: {
      en: 'Welcome back. Depth returns quickly when you are ready.',
      vi: 'Chào mừng trở lại. Chiều sâu sẽ quay lại nhanh khi bạn sẵn sàng.',
    },
  },
  vip4: {
    returning_after_gap: {
      en: "Welcome back. We'll rebuild structure one clean step at a time.",
      vi: 'Chào mừng trở lại. Mình dựng lại cấu trúc từng bước chuẩn một.',
    },
  },
  vip5: {
    returning_after_gap: {
      en: 'Welcome back. The leader in you never left.',
      vi: 'Chào mừng trở lại. Người lãnh đạo trong bạn chưa từng rời đi.',
    },
  },
  vip6: {
    returning_after_gap: {
      en: 'Welcome back. Calm returns faster than you expect.',
      vi: 'Chào mừng trở lại. Sự bình tĩnh sẽ quay lại nhanh hơn bạn nghĩ.',
    },
  },
  vip7: {
    returning_after_gap: {
      en: 'Welcome back. Your vision is still here, waiting.',
      vi: 'Chào mừng trở lại. Tầm nhìn của bạn vẫn ở đây, đang chờ.',
    },
  },
  vip8: {
    returning_after_gap: {
      en: 'Welcome back. The quiet meaning returns when you do.',
      vi: 'Chào mừng trở lại. Ý nghĩa yên lặng sẽ trở lại khi bạn trở lại.',
    },
  },
  vip9: {
    returning_after_gap: {
      en: "Welcome back. Mastery doesn't vanish — it waits.",
      vi: 'Chào mừng trở lại. Sự thành thạo không biến mất — nó chỉ đợi bạn.',
    },
  },
};

export const TIER_EMOTION_SCRIPTS: Record<string, Partial<Record<EmotionState, EmotionScript>>> =
  TIER_EMOTION_SCRIPTS_TEST_SAFE;

export function getEmotionScript(tier: string, emotion: EmotionState): EmotionScript | null {
  const normalizedTier = normalizeTierKey(tier);

  if (!isTestEnv()) {
    const extra = TIER_EMOTION_EXTRAS_RUNTIME[normalizedTier]?.[String(emotion)];
    if (extra) return extra;

    const fallbackExtras = TIER_FALLBACK_CHAIN[normalizedTier] || [];
    for (const fb of fallbackExtras) {
      const fbExtra = TIER_EMOTION_EXTRAS_RUNTIME[fb]?.[String(emotion)];
      if (fbExtra) return fbExtra;
    }

    const freeExtra = TIER_EMOTION_EXTRAS_RUNTIME.free?.[String(emotion)];
    if (freeExtra) return freeExtra;
  }

  const tierScripts = TIER_EMOTION_SCRIPTS[normalizedTier];
  if (tierScripts && tierScripts[emotion]) return tierScripts[emotion]!;

  const fallbacks = TIER_FALLBACK_CHAIN[normalizedTier] || [];
  for (const fallbackTier of fallbacks) {
    const fallbackScripts = TIER_EMOTION_SCRIPTS[fallbackTier];
    if (fallbackScripts && fallbackScripts[emotion]) return fallbackScripts[emotion]!;
  }

  return TIER_EMOTION_SCRIPTS.free?.[emotion] || null;
}