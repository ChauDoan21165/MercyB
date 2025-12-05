/**
 * Mercy Host Greetings
 * 
 * Greeting templates organized by tier with EN/VI variants.
 * {{name}} and {{roomTitle}} are replaced at runtime.
 */

export interface GreetingTemplate {
  en: string;
  vi: string;
}

/**
 * General greetings (work for all tiers)
 */
export const GENERAL_GREETINGS: GreetingTemplate[] = [
  {
    en: "Hi {{name}}, Mercy welcomes you to {{roomTitle}}. Make yourself at home — I'm here to guide you.",
    vi: "Chào {{name}}, Mercy mời bạn vào phòng {{roomTitle}}. Cứ thoải mái nhé — mình luôn ở đây hỗ trợ bạn."
  },
  {
    en: "Welcome, {{name}}. This is {{roomTitle}} — a space created just for you. Take your time.",
    vi: "Chào mừng {{name}}. Đây là {{roomTitle}} — không gian được tạo riêng cho bạn. Hãy thong thả nhé."
  },
  {
    en: "Hello {{name}}, I'm Mercy. Let's explore {{roomTitle}} together at your own pace.",
    vi: "Xin chào {{name}}, mình là Mercy. Cùng khám phá {{roomTitle}} theo nhịp của bạn nhé."
  },
  {
    en: "{{name}}, welcome to {{roomTitle}}. I'm here whenever you need a gentle guide.",
    vi: "{{name}}, chào mừng đến {{roomTitle}}. Mình ở đây khi bạn cần một người đồng hành nhẹ nhàng."
  },
  {
    en: "Glad you're here, {{name}}. {{roomTitle}} awaits — no rush, just presence.",
    vi: "Vui vì bạn đến, {{name}}. {{roomTitle}} đang chờ — không vội, chỉ cần có mặt thôi."
  }
];

/**
 * VIP-tier enhanced greetings (VIP3+)
 */
export const VIP_GREETINGS: GreetingTemplate[] = [
  {
    en: "Welcome back, {{name}}. As a valued member, {{roomTitle}} opens its deeper layers for you.",
    vi: "Chào mừng trở lại, {{name}}. Là thành viên quý, {{roomTitle}} mở ra những tầng sâu hơn cho bạn."
  },
  {
    en: "{{name}}, your dedication brings you here. Let's unlock what {{roomTitle}} has to offer.",
    vi: "{{name}}, sự chuyên tâm đã đưa bạn đến đây. Hãy cùng mở khóa những gì {{roomTitle}} dành tặng."
  },
  {
    en: "Hello {{name}}, I've prepared {{roomTitle}} with care. This content is crafted for seekers like you.",
    vi: "Xin chào {{name}}, mình đã chuẩn bị {{roomTitle}} cẩn thận. Nội dung này dành cho những người tìm kiếm như bạn."
  }
];

/**
 * VIP9 Executive greetings (exclusive tone)
 */
export const VIP9_GREETINGS: GreetingTemplate[] = [
  {
    en: "{{name}}, welcome to the Executive tier. {{roomTitle}} represents our most refined wisdom.",
    vi: "{{name}}, chào mừng đến tầng Cao cấp. {{roomTitle}} đại diện cho tri thức tinh túy nhất."
  },
  {
    en: "Distinguished {{name}}, I'm honored to host you in {{roomTitle}}. Excellence awaits.",
    vi: "Kính chào {{name}}, mình vinh dự được đón tiếp bạn tại {{roomTitle}}. Sự xuất sắc đang chờ đợi."
  }
];

/**
 * Kids tier greetings (playful, encouraging)
 */
export const KIDS_GREETINGS: GreetingTemplate[] = [
  {
    en: "Hey {{name}}! 🌟 Ready to learn something fun in {{roomTitle}}? Let's go!",
    vi: "Chào {{name}}! 🌟 Sẵn sàng học điều thú vị trong {{roomTitle}} chưa? Bắt đầu nào!"
  },
  {
    en: "{{name}}, welcome to {{roomTitle}}! Today's adventure starts now. 🎈",
    vi: "{{name}}, chào mừng đến {{roomTitle}}! Cuộc phiêu lưu hôm nay bắt đầu rồi. 🎈"
  },
  {
    en: "Hi {{name}}! I'm Mercy, your learning buddy. Let's explore {{roomTitle}} together! 🌈",
    vi: "Xin chào {{name}}! Mình là Mercy, bạn đồng hành học tập của bạn. Cùng khám phá {{roomTitle}} nhé! 🌈"
  }
];

/**
 * Color mode switch micro-responses
 */
export const COLOR_MODE_RESPONSES: GreetingTemplate[] = [
  {
    en: "Switched to clean mode for you.",
    vi: "Đã chuyển sang chế độ sáng cho bạn."
  },
  {
    en: "Colors adjusted to your preference.",
    vi: "Màu sắc đã điều chỉnh theo sở thích của bạn."
  },
  {
    en: "A new view, same warmth.",
    vi: "Góc nhìn mới, sự ấm áp vẫn còn."
  },
  {
    en: "Visual mode updated.",
    vi: "Chế độ hiển thị đã cập nhật."
  }
];

/**
 * Get random greeting from array
 */
export function getRandomGreeting(templates: GreetingTemplate[]): GreetingTemplate {
  const index = Math.floor(Math.random() * templates.length);
  return templates[index];
}

/**
 * Get appropriate greeting based on tier
 */
export function getGreetingByTier(tier: string): GreetingTemplate {
  if (tier === 'vip9') {
    return getRandomGreeting(VIP9_GREETINGS);
  }
  if (tier.startsWith('kids')) {
    return getRandomGreeting(KIDS_GREETINGS);
  }
  if (['vip3', 'vip4', 'vip5', 'vip6', 'vip7', 'vip8'].includes(tier)) {
    // 50% chance of VIP greeting, 50% general
    return Math.random() > 0.5 
      ? getRandomGreeting(VIP_GREETINGS) 
      : getRandomGreeting(GENERAL_GREETINGS);
  }
  return getRandomGreeting(GENERAL_GREETINGS);
}

/**
 * Format greeting with user data
 */
export function formatGreeting(
  template: GreetingTemplate,
  name: string,
  roomTitle: string,
  language: 'en' | 'vi' = 'en'
): string {
  const text = language === 'vi' ? template.vi : template.en;
  return text
    .replace(/\{\{name\}\}/g, name)
    .replace(/\{\{roomTitle\}\}/g, roomTitle);
}
