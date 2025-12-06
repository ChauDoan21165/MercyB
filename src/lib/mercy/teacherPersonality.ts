/**
 * Mercy Teacher Personality System
 * 
 * Central module for Mercy's AI English teacher personality.
 * Consolidates tone, emotion, and all teacher messages.
 * 
 * HOW TO ADD NEW LINES:
 * 1. Add the event type to TeacherEvent union
 * 2. Add lines for that event in MESSAGES_BY_EVENT
 * 3. Each line must have en + vi and be ≤160 chars
 * 
 * HOW TO LOCALIZE:
 * - All messages already have en/vi
 * - To add new language: extend BilingualText and add to each message
 */

// ============================================
// TYPES
// ============================================

export type MercyTone = 'gentle' | 'warm' | 'encouraging' | 'focused' | 'celebratory';

export type MercyEmotion = 
  | 'neutral' 
  | 'happy' 
  | 'proud' 
  | 'calm' 
  | 'concerned' 
  | 'excited';

export type TeacherEvent =
  // Room events
  | 'room_start'
  | 'room_complete'
  | 'entry_complete'
  // Streak events
  | 'streak_day_3'
  | 'streak_day_7'
  | 'streak_day_14'
  | 'streak_day_30'
  | 'streak_break_3_days'
  | 'streak_break_7_days'
  | 'streak_return'
  // Practice events
  | 'shadow_attempt_success'
  | 'shadow_attempt_fail'
  | 'pronunciation_good'
  | 'pronunciation_try_again'
  // Progress events
  | 'first_room_complete'
  | 'level_up'
  | 'milestone_10_rooms'
  | 'milestone_50_rooms'
  // Mood events
  | 'user_tired'
  | 'user_struggling'
  | 'user_excited'
  // Session events
  | 'session_start_morning'
  | 'session_start_evening'
  | 'session_end'
  // CEFR-specific
  | 'a1_intro'
  | 'a2_intro'
  | 'b1_intro'
  | 'b2_intro'
  | 'c1_intro';

export interface BilingualText {
  en: string;
  vi: string;
}

export interface TeacherMessage extends BilingualText {
  tone: MercyTone;
  emotion?: MercyEmotion;
}

export interface GetMessageOptions {
  level?: string; // CEFR level: A1, A2, B1, B2, C1
  username?: string;
  emotionOverride?: MercyEmotion;
  tier?: string;
}

// ============================================
// MESSAGE LIBRARY
// ============================================

/**
 * All teacher messages organized by event.
 * Each event can have multiple variations for natural responses.
 */
const MESSAGES_BY_EVENT: Record<TeacherEvent, TeacherMessage[]> = {
  // --- Room Events ---
  room_start: [
    { en: "Let's learn together. No rush, no pressure.", vi: "Cùng học nhé. Không vội, không áp lực.", tone: 'gentle' },
    { en: "Welcome back to English. Take your time.", vi: "Chào mừng trở lại với tiếng Anh. Từ từ thôi.", tone: 'warm' },
    { en: "English is a journey. Enjoy each step.", vi: "Tiếng Anh là hành trình. Tận hưởng từng bước.", tone: 'encouraging' },
    { en: "Ready when you are. Let's begin.", vi: "Sẵn sàng khi bạn sẵn sàng. Bắt đầu thôi.", tone: 'warm' },
    { en: "Your English adventure continues today.", vi: "Hành trình tiếng Anh tiếp tục hôm nay.", tone: 'encouraging' },
  ],
  room_complete: [
    { en: "Wonderful! You completed this room. Well done!", vi: "Tuyệt vời! Bạn đã hoàn thành phòng này. Làm tốt lắm!", tone: 'celebratory', emotion: 'proud' },
    { en: "Another room done. Your English grows stronger.", vi: "Thêm một phòng hoàn thành. Tiếng Anh của bạn mạnh hơn.", tone: 'encouraging', emotion: 'happy' },
    { en: "You did it! Take a moment to feel proud.", vi: "Bạn làm được rồi! Hãy tự hào về bản thân.", tone: 'celebratory', emotion: 'proud' },
  ],
  entry_complete: [
    { en: "Well done! Every word learned is progress.", vi: "Làm tốt lắm! Mỗi từ học được là tiến bộ.", tone: 'encouraging' },
    { en: "You're building your English, one step at a time.", vi: "Bạn đang xây dựng tiếng Anh, từng bước một.", tone: 'warm' },
    { en: "Good progress! Try using this phrase today.", vi: "Tiến bộ tốt! Thử dùng cụm từ này hôm nay nhé.", tone: 'encouraging' },
    { en: "Another step forward. Your English improves daily.", vi: "Thêm một bước tiến. Tiếng Anh cải thiện mỗi ngày.", tone: 'warm' },
  ],

  // --- Streak Events ---
  streak_day_3: [
    { en: "3 days in a row! Consistency is beautiful.", vi: "3 ngày liên tiếp! Sự kiên trì thật đẹp.", tone: 'celebratory', emotion: 'happy' },
    { en: "You're building a habit. Keep going!", vi: "Bạn đang xây dựng thói quen. Tiếp tục!", tone: 'encouraging' },
  ],
  streak_day_7: [
    { en: "One week! Your dedication is inspiring.", vi: "Một tuần! Sự cống hiến của bạn thật đáng ngưỡng mộ.", tone: 'celebratory', emotion: 'proud' },
    { en: "7 days of growth. You're amazing!", vi: "7 ngày tiến bộ. Bạn thật tuyệt!", tone: 'celebratory', emotion: 'excited' },
  ],
  streak_day_14: [
    { en: "Two weeks! Your commitment is extraordinary.", vi: "Hai tuần! Cam kết của bạn thật phi thường.", tone: 'celebratory', emotion: 'proud' },
  ],
  streak_day_30: [
    { en: "30 days! You've built a true learning habit.", vi: "30 ngày! Bạn đã xây dựng thói quen học thật sự.", tone: 'celebratory', emotion: 'excited' },
    { en: "One month of English! I'm so proud of you.", vi: "Một tháng tiếng Anh! Mình rất tự hào về bạn.", tone: 'celebratory', emotion: 'proud' },
  ],
  streak_break_3_days: [
    { en: "Welcome back. Life happens. Let's continue gently.", vi: "Chào mừng trở lại. Cuộc sống mà. Tiếp tục nhẹ nhàng.", tone: 'gentle', emotion: 'calm' },
  ],
  streak_break_7_days: [
    { en: "You've been missed! English missed you too.", vi: "Bạn đã được nhớ! Tiếng Anh cũng nhớ bạn.", tone: 'warm', emotion: 'calm' },
    { en: "Welcome home. Let's refresh what you learned.", vi: "Chào mừng về nhà. Hãy ôn lại những gì bạn đã học.", tone: 'gentle' },
  ],
  streak_return: [
    { en: "Every return is a victory. Welcome back.", vi: "Mỗi lần quay lại là chiến thắng. Chào mừng trở lại.", tone: 'encouraging' },
  ],

  // --- Practice Events ---
  shadow_attempt_success: [
    { en: "Great shadowing! Your pronunciation is improving.", vi: "Shadowing tốt lắm! Phát âm của bạn đang tiến bộ.", tone: 'celebratory', emotion: 'happy' },
    { en: "Well done! Your voice matches the rhythm.", vi: "Làm tốt lắm! Giọng bạn khớp với nhịp.", tone: 'encouraging' },
  ],
  shadow_attempt_fail: [
    { en: "Good try! Listen again and repeat slowly.", vi: "Cố gắng tốt! Nghe lại và lặp lại chậm hơn.", tone: 'gentle', emotion: 'calm' },
    { en: "It's okay. Practice makes progress, not perfection.", vi: "Không sao. Luyện tập tạo tiến bộ, không phải hoàn hảo.", tone: 'warm' },
  ],
  pronunciation_good: [
    { en: "Your pronunciation is clear! Well done.", vi: "Phát âm của bạn rõ ràng! Làm tốt lắm.", tone: 'celebratory', emotion: 'happy' },
    { en: "The sounds are coming naturally now.", vi: "Âm thanh đang đến tự nhiên rồi.", tone: 'encouraging' },
  ],
  pronunciation_try_again: [
    { en: "Let's try that sound again. Listen carefully.", vi: "Hãy thử âm đó lại. Lắng nghe cẩn thận.", tone: 'gentle' },
    { en: "Focus on the ending sounds. You're close!", vi: "Tập trung vào âm cuối. Bạn gần được rồi!", tone: 'encouraging' },
  ],

  // --- Progress Events ---
  first_room_complete: [
    { en: "Your first room! This is just the beginning.", vi: "Phòng đầu tiên! Đây mới chỉ là khởi đầu.", tone: 'celebratory', emotion: 'excited' },
    { en: "You've started your English journey. I'm proud.", vi: "Bạn đã bắt đầu hành trình tiếng Anh. Mình tự hào.", tone: 'celebratory', emotion: 'proud' },
  ],
  level_up: [
    { en: "Level up! Your hard work is paying off.", vi: "Lên level! Công sức của bạn đang được đền đáp.", tone: 'celebratory', emotion: 'excited' },
    { en: "You've grown! Ready for new challenges.", vi: "Bạn đã phát triển! Sẵn sàng cho thử thách mới.", tone: 'encouraging', emotion: 'proud' },
  ],
  milestone_10_rooms: [
    { en: "10 rooms completed! You're building real skill.", vi: "10 phòng hoàn thành! Bạn đang xây dựng kỹ năng thực.", tone: 'celebratory', emotion: 'proud' },
  ],
  milestone_50_rooms: [
    { en: "50 rooms! Your dedication is remarkable.", vi: "50 phòng! Sự cống hiến của bạn đáng ngưỡng mộ.", tone: 'celebratory', emotion: 'excited' },
  ],

  // --- Mood Events ---
  user_tired: [
    { en: "It's okay to rest. Even small steps count.", vi: "Nghỉ ngơi cũng được. Bước nhỏ vẫn có giá trị.", tone: 'gentle', emotion: 'calm' },
    { en: "Take it easy today. Learning is a marathon.", vi: "Hôm nay nhẹ nhàng thôi. Học là chặng đường dài.", tone: 'warm', emotion: 'calm' },
  ],
  user_struggling: [
    { en: "Struggling means you're learning. Keep going.", vi: "Khó khăn nghĩa là bạn đang học. Tiếp tục.", tone: 'encouraging' },
    { en: "Every expert was once a beginner. You've got this.", vi: "Chuyên gia nào cũng từng là người mới. Bạn làm được.", tone: 'warm' },
  ],
  user_excited: [
    { en: "Your enthusiasm is wonderful! Let's channel it.", vi: "Sự nhiệt tình của bạn tuyệt vời! Hãy tận dụng nó.", tone: 'encouraging', emotion: 'excited' },
  ],

  // --- Session Events ---
  session_start_morning: [
    { en: "Good morning! Fresh mind, fresh learning.", vi: "Chào buổi sáng! Trí óc tươi mới, học hỏi mới.", tone: 'warm', emotion: 'happy' },
    { en: "Morning practice is powerful. Let's begin.", vi: "Luyện tập buổi sáng rất mạnh mẽ. Bắt đầu thôi.", tone: 'encouraging' },
  ],
  session_start_evening: [
    { en: "Evening study time. Let's wind down with English.", vi: "Thời gian học buổi tối. Thư giãn với tiếng Anh.", tone: 'gentle' },
    { en: "End your day with a little learning. You deserve it.", vi: "Kết thúc ngày với chút học hỏi. Bạn xứng đáng.", tone: 'warm' },
  ],
  session_end: [
    { en: "Great session! Rest well and come back soon.", vi: "Buổi học tốt! Nghỉ ngơi và quay lại sớm nhé.", tone: 'warm', emotion: 'happy' },
    { en: "You did wonderful today. See you next time.", vi: "Bạn làm tuyệt vời hôm nay. Hẹn gặp lại.", tone: 'encouraging', emotion: 'proud' },
  ],

  // --- CEFR-Specific Intros ---
  a1_intro: [
    { en: "A1 - Your first steps in English. We start simple.", vi: "A1 - Bước đầu tiên trong tiếng Anh. Ta bắt đầu đơn giản.", tone: 'gentle' },
    { en: "Welcome to A1! Basic phrases, big progress.", vi: "Chào mừng đến A1! Cụm từ cơ bản, tiến bộ lớn.", tone: 'encouraging' },
  ],
  a2_intro: [
    { en: "A2 - Building on basics. You're growing!", vi: "A2 - Xây dựng từ nền tảng. Bạn đang phát triển!", tone: 'encouraging' },
    { en: "Welcome to A2! More vocabulary, more confidence.", vi: "Chào mừng đến A2! Nhiều từ vựng hơn, tự tin hơn.", tone: 'warm' },
  ],
  b1_intro: [
    { en: "B1 - You can express yourself now. Let's deepen.", vi: "B1 - Bạn có thể diễn đạt rồi. Hãy đào sâu hơn.", tone: 'encouraging' },
    { en: "Welcome to B1! Real conversations await.", vi: "Chào mừng đến B1! Hội thoại thực sự đang chờ.", tone: 'warm' },
  ],
  b2_intro: [
    { en: "B2 - You're becoming fluent. Let's polish.", vi: "B2 - Bạn đang trở nên lưu loát. Hãy trau dồi.", tone: 'encouraging' },
    { en: "Welcome to B2! Complex ideas, natural speech.", vi: "Chào mừng đến B2! Ý tưởng phức tạp, lời nói tự nhiên.", tone: 'focused' },
  ],
  c1_intro: [
    { en: "C1 - Near mastery. Let's refine your English.", vi: "C1 - Gần thành thạo. Hãy tinh chỉnh tiếng Anh.", tone: 'focused' },
    { en: "Welcome to C1! Nuance and precision ahead.", vi: "Chào mừng đến C1! Sắc thái và chính xác phía trước.", tone: 'encouraging' },
  ],
};

// ============================================
// CORE FUNCTIONS
// ============================================

/**
 * Get a Mercy message for a specific event.
 * Returns a random variation from the available messages.
 */
export function getMercyMessage(
  event: TeacherEvent,
  options: GetMessageOptions = {}
): TeacherMessage {
  const messages = MESSAGES_BY_EVENT[event];
  
  if (!messages || messages.length === 0) {
    // Fallback message
    return {
      en: "I'm here with you.",
      vi: "Mình ở đây với bạn.",
      tone: 'gentle',
      emotion: 'calm'
    };
  }

  // Pick random message
  let message = messages[Math.floor(Math.random() * messages.length)];

  // Apply username substitution
  if (options.username) {
    message = {
      ...message,
      en: message.en.replace(/\{\{name\}\}/g, options.username),
      vi: message.vi.replace(/\{\{name\}\}/g, options.username),
    };
  }

  // Apply emotion override if provided
  if (options.emotionOverride) {
    message = { ...message, emotion: options.emotionOverride };
  }

  return message;
}

/**
 * Get all messages for an event (for testing/validation)
 */
export function getAllMessagesForEvent(event: TeacherEvent): TeacherMessage[] {
  return MESSAGES_BY_EVENT[event] || [];
}

/**
 * Get message count for inventory
 */
export function getMessageInventory(): { event: TeacherEvent; count: number }[] {
  return Object.entries(MESSAGES_BY_EVENT).map(([event, messages]) => ({
    event: event as TeacherEvent,
    count: messages.length
  }));
}

/**
 * Get total message count
 */
export function getTotalMessageCount(): number {
  return Object.values(MESSAGES_BY_EVENT).reduce((sum, msgs) => sum + msgs.length, 0);
}

/**
 * Validate all messages are within length limit
 */
export function validateMessages(): { valid: boolean; errors: string[] } {
  const MAX_LENGTH = 160;
  const errors: string[] = [];

  for (const [event, messages] of Object.entries(MESSAGES_BY_EVENT)) {
    for (const msg of messages) {
      if (msg.en.length > MAX_LENGTH) {
        errors.push(`${event}: EN too long (${msg.en.length}): "${msg.en.slice(0, 50)}..."`);
      }
      if (msg.vi.length > MAX_LENGTH) {
        errors.push(`${event}: VI too long (${msg.vi.length}): "${msg.vi.slice(0, 50)}..."`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Get CEFR intro message based on level
 */
export function getCefrIntroMessage(level: string): TeacherMessage {
  const levelUpper = level.toUpperCase();
  const eventMap: Record<string, TeacherEvent> = {
    'A1': 'a1_intro',
    'A2': 'a2_intro',
    'B1': 'b1_intro',
    'B2': 'b2_intro',
    'C1': 'c1_intro',
  };

  const event = eventMap[levelUpper];
  if (event) {
    return getMercyMessage(event);
  }

  // Default fallback
  return getMercyMessage('room_start');
}

/**
 * Get streak message based on days
 */
export function getStreakMessage(days: number): TeacherMessage | null {
  if (days === 3) return getMercyMessage('streak_day_3');
  if (days === 7) return getMercyMessage('streak_day_7');
  if (days === 14) return getMercyMessage('streak_day_14');
  if (days === 30) return getMercyMessage('streak_day_30');
  return null;
}

/**
 * Get break message based on days away
 */
export function getBreakMessage(daysAway: number): TeacherMessage {
  if (daysAway >= 7) return getMercyMessage('streak_break_7_days');
  if (daysAway >= 3) return getMercyMessage('streak_break_3_days');
  return getMercyMessage('streak_return');
}

// ============================================
// EXPORTS
// ============================================

export { MESSAGES_BY_EVENT };
