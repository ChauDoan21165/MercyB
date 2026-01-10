/**
 * Mercy Teacher Personality System v2.0
 *
 * Central module for Mercy's AI English teacher personality.
 * Fully bilingual (EN + VI), with emotional rules and scalable message architecture.
 *
 * HOW TO ADD NEW LINES:
 * 1. Add the event to TeacherEvent union if needed
 * 2. Add MercyMessage objects to MESSAGES_BY_EVENT[eventName]
 * 3. Each message must have: id, event, emotion, text.en, text.vi
 * 4. Optional: cefrMin, cefrMax for level-specific messages
 *
 * HOW TO ADD NEW EMOTIONS:
 * 1. Add to MercyEmotion type
 * 2. Add rules in getEmotionForEvent()
 */

// ============================================
// TYPES
// ============================================

/**
 * Mercy's emotional states - determines tone and avatar expression
 */
export type MercyEmotion =
  | "warm_gentle" // Default nurturing tone
  | "excited_proud" // Celebrating achievements
  | "calm_firm" // After multiple failures, steady guidance
  | "playful" // Light moments, encouragement
  | "reassuring"; // Comeback, struggles, heavy moods

/**
 * All events that can trigger Mercy messages
 */
export type TeacherEvent =
  // App lifecycle
  | "app_open_first_time"
  | "app_open_returning"
  // Room events
  | "room_start"
  | "room_halfway"
  | "room_complete"
  // Shadow/speaking practice
  | "shadow_start"
  | "shadow_attempt_good"
  | "shadow_attempt_bad"
  | "shadow_attempt_bad_3plus" // 3+ failures
  | "shadow_session_complete"
  // Streak events
  | "streak_day_3"
  | "streak_day_7"
  | "streak_day_14"
  | "streak_day_30"
  | "streak_continue"
  | "streak_break"
  | "streak_comeback_short" // 1-3 days away
  | "streak_comeback_long" // 7+ days away
  // User state
  | "user_confused"
  | "user_low_energy"
  | "user_tired"
  | "user_struggling"
  | "user_excited"
  // Progress milestones
  | "level_up"
  | "first_room_complete"
  | "milestone_10_rooms"
  | "milestone_50_rooms"
  | "milestone_100_rooms"
  // Session events
  | "session_start_morning"
  | "session_start_evening"
  | "session_end"
  // CEFR level intros
  | "cefr_a1_intro"
  | "cefr_a2_intro"
  | "cefr_b1_intro"
  | "cefr_b2_intro"
  | "cefr_c1_intro"
  // Entry-level
  | "entry_complete"
  | "pronunciation_good"
  | "pronunciation_try_again";

/**
 * Bilingual text structure
 */
export interface BilingualText {
  en: string;
  vi: string;
}

/**
 * Complete Mercy message structure
 */
export interface MercyMessage {
  id: string;
  event: TeacherEvent;
  emotion: MercyEmotion;
  cefrMin?: string; // e.g., 'A1' - message only for A1+
  cefrMax?: string; // e.g., 'B1' - message only up to B1
  text: BilingualText;
}

/**
 * Display mode for bilingual content
 */
export type DisplayMode = "en" | "vi" | "dual";

/**
 * Options for getMercyMessage
 */
export interface GetMessageOptions {
  cefrLevel?: string;
  username?: string;
  emotionOverride?: MercyEmotion;
  displayMode?: DisplayMode;
  failureCount?: number; // For shadow_attempt_bad logic
}

// ============================================
// EMOTIONAL RULES ENGINE
// ============================================

/**
 * Get the appropriate emotion for an event based on context.
 * Rules are based on ChatGPT's design for Mercy's personality.
 */
export function getEmotionForEvent(
  event: TeacherEvent,
  context?: { failureCount?: number; daysAway?: number; mood?: string }
): MercyEmotion {
  const { failureCount = 0, daysAway = 0, mood } = context || {};

  switch (event) {
    // Celebrations
    case "room_complete":
    case "shadow_session_complete":
    case "level_up":
    case "first_room_complete":
    case "milestone_10_rooms":
    case "milestone_50_rooms":
    case "milestone_100_rooms":
    case "streak_day_7":
    case "streak_day_14":
    case "streak_day_30":
      return "excited_proud";

    // Gentle starts
    case "app_open_first_time":
    case "room_start":
    case "shadow_start":
    case "session_start_morning":
    case "session_start_evening":
      return "warm_gentle";

    // Failures with escalation
    case "shadow_attempt_bad":
    case "shadow_attempt_bad_3plus":
      return failureCount >= 3 ? "calm_firm" : "warm_gentle";

    // Comeback logic
    case "streak_comeback_long":
      return "reassuring";
    case "streak_comeback_short":
      return daysAway >= 7 ? "reassuring" : "warm_gentle";

    // User states
    case "user_low_energy":
    case "user_tired":
    case "user_struggling":
      return "reassuring";
    case "user_confused":
      return "calm_firm";
    case "user_excited":
      return "playful";

    // Mood-based overrides
    default:
      if (mood === "heavy" || mood === "anxious") {
        return "reassuring";
      }
      return "warm_gentle";
  }
}

// ============================================
// MESSAGE LIBRARY (200+ BILINGUAL MERCY LINES)
// ============================================

/**
 * MERCY MESSAGE BANK v2.0
 *
 * Contains 200+ bilingual (EN/VI) teacher messages organized by event.
 * Each array can safely hold 50+ messages per event.
 *
 * HOW TO ADD NEW BATCHES:
 * 1. Append new objects to the relevant event array
 * 2. Use unique IDs (format: eventPrefix_XX, e.g., open_first_11)
 * 3. Ensure both en/vi fields are filled
 * 4. Optional: add cefrMin/cefrMax for level-specific messages
 *
 * BATCH INSERTION POINT: Add new messages at the end of each array,
 * before the closing bracket. The structure supports 400+ total lines.
 */
export const MESSAGES_BY_EVENT: Record<TeacherEvent, MercyMessage[]> = {
  // ============================================
  // APP OPEN - FIRST TIME (10 lines)
  // ============================================
  app_open_first_time: [
    {
      id: "open_first_01",
      event: "app_open_first_time",
      emotion: "warm_gentle",
      text: {
        en: "Welcome. We'll grow your English together, one quiet step at a time.",
        vi: "Chào mừng bạn. Chúng ta sẽ cùng nhau xây tiếng Anh từng bước nhẹ nhàng.",
      },
    },
    {
      id: "open_first_02",
      event: "app_open_first_time",
      emotion: "warm_gentle",
      text: {
        en: "Nice to have you here. Let me guide you with clarity and calm.",
        vi: "Thật vui khi có bạn ở đây. Mình sẽ hướng dẫn bạn bằng sự rõ ràng và bình tĩnh.",
      },
    },
    {
      id: "open_first_03",
      event: "app_open_first_time",
      emotion: "reassuring",
      text: {
        en: "No pressure at all. Even one minute today is enough.",
        vi: "Không có áp lực gì cả. Chỉ một phút hôm nay cũng đủ rồi.",
      },
    },
    {
      id: "open_first_04",
      event: "app_open_first_time",
      emotion: "warm_gentle",
      text: {
        en: "This is the beginning of something steady and good.",
        vi: "Đây là sự bắt đầu của một điều bền bỉ và tốt đẹp.",
      },
    },
    {
      id: "open_first_05",
      event: "app_open_first_time",
      emotion: "playful",
      text: {
        en: "Let's wake your tongue up a little today.",
        vi: "Cùng đánh thức chiếc lưỡi của bạn nhẹ nhàng hôm nay nhé.",
      },
    },
    {
      id: "open_first_06",
      event: "app_open_first_time",
      emotion: "warm_gentle",
      text: {
        en: "Slow is fine. Slow builds strong foundations.",
        vi: "Chậm cũng tốt. Chậm tạo nền tảng vững chắc.",
      },
    },
    {
      id: "open_first_07",
      event: "app_open_first_time",
      emotion: "reassuring",
      text: {
        en: "If English ever felt scary, I'll make it feel lighter.",
        vi: "Nếu tiếng Anh từng khiến bạn sợ, mình sẽ làm nó nhẹ đi.",
      },
    },
    {
      id: "open_first_08",
      event: "app_open_first_time",
      emotion: "warm_gentle",
      text: {
        en: "You're not alone. I'm here with you in every step.",
        vi: "Bạn không đơn độc. Mình ở đây cùng bạn trong từng bước.",
      },
    },
    {
      id: "open_first_09",
      event: "app_open_first_time",
      emotion: "playful",
      text: {
        en: "Let's see how your brain responds today.",
        vi: "Xem thử hôm nay bộ não bạn phản ứng thế nào nhé.",
      },
    },
    {
      id: "open_first_10",
      event: "app_open_first_time",
      emotion: "reassuring",
      text: {
        en: "You don't need talent. You just need small, honest effort.",
        vi: "Bạn không cần tài năng. Bạn chỉ cần những nỗ lực nhỏ nhưng thật lòng.",
      },
    },
    // --- INSERT NEW app_open_first_time MESSAGES ABOVE THIS LINE ---
  ],

  // ============================================
  // APP OPEN - RETURNING (10 lines)
  // ============================================
  app_open_returning: [
    {
      id: "open_return_01",
      event: "app_open_returning",
      emotion: "warm_gentle",
      text: {
        en: "Welcome back. Even showing up is progress.",
        vi: "Chào mừng bạn trở lại. Chỉ cần xuất hiện đã là tiến bộ rồi.",
      },
    },
    {
      id: "open_return_02",
      event: "app_open_returning",
      emotion: "warm_gentle",
      text: {
        en: "Good to see you again. Let's make today simple and clear.",
        vi: "Rất vui được gặp lại bạn. Cùng làm hôm nay thật đơn giản và rõ ràng nhé.",
      },
    },
    {
      id: "open_return_03",
      event: "app_open_returning",
      emotion: "reassuring",
      text: {
        en: "You didn't fall behind. You're still on track.",
        vi: "Bạn không hề chậm lại. Bạn vẫn đang đi đúng hướng.",
      },
    },
    {
      id: "open_return_04",
      event: "app_open_returning",
      emotion: "playful",
      text: {
        en: "Shall we warm up your tongue again?",
        vi: "Hâm nóng chiếc lưỡi một chút nữa nhé?",
      },
    },
    {
      id: "open_return_05",
      event: "app_open_returning",
      emotion: "warm_gentle",
      text: {
        en: "Consistency is power. You're doing wonderfully.",
        vi: "Sự đều đặn là sức mạnh. Bạn đang làm rất tốt.",
      },
    },
    {
      id: "open_return_06",
      event: "app_open_returning",
      emotion: "reassuring",
      text: {
        en: "If yesterday was heavy, today we go light.",
        vi: "Nếu hôm qua nặng nề, hôm nay chúng ta đi nhẹ.",
      },
    },
    {
      id: "open_return_07",
      event: "app_open_returning",
      emotion: "warm_gentle",
      text: {
        en: "I'm here. Let's pick up right where you left off.",
        vi: "Mình đây rồi. Cùng tiếp tục từ nơi bạn dừng lại nhé.",
      },
    },
    {
      id: "open_return_08",
      event: "app_open_returning",
      emotion: "playful",
      text: {
        en: "Your English muscles missed this.",
        vi: "Các cơ tiếng Anh của bạn nhớ điều này rồi đó.",
      },
    },
    {
      id: "open_return_09",
      event: "app_open_returning",
      emotion: "reassuring",
      text: {
        en: "Returning is more important than perfection.",
        vi: "Quay lại quan trọng hơn hoàn hảo.",
      },
    },
    {
      id: "open_return_10",
      event: "app_open_returning",
      emotion: "warm_gentle",
      text: {
        en: "Let's make a small win today.",
        vi: "Hôm nay mình cùng làm một chiến thắng nhỏ nhé.",
      },
    },
    // --- INSERT NEW app_open_returning MESSAGES ABOVE THIS LINE ---
  ],

  // ============================================
  // ROOM START (20 lines) ✅ COMPLETE
  // ============================================
  room_start: [
    {
      id: "room_start_01",
      event: "room_start",
      emotion: "warm_gentle",
      text: {
        en: "Let's enter this room slowly. No rush—just clarity.",
        vi: "Hãy vào phòng này thật chậm rãi. Không vội—chỉ cần rõ ràng.",
      },
    },
    {
      id: "room_start_02",
      event: "room_start",
      emotion: "warm_gentle",
      text: {
        en: "Give your mind a second to settle. We begin gently.",
        vi: "Hãy để tâm trí bạn ổn định một chút. Chúng ta bắt đầu nhẹ nhàng.",
      },
    },
    {
      id: "room_start_03",
      event: "room_start",
      emotion: "playful",
      text: {
        en: "Ready? Let's see how your English brain wakes up.",
        vi: "Sẵn sàng chưa? Xem thử bộ não tiếng Anh của bạn thức dậy thế nào nhé.",
      },
    },
    {
      id: "room_start_04",
      event: "room_start",
      emotion: "warm_gentle",
      text: {
        en: "One small step in this room is enough.",
        vi: "Chỉ một bước nhỏ trong phòng này là đủ rồi.",
      },
    },
    {
      id: "room_start_05",
      event: "room_start",
      emotion: "reassuring",
      text: {
        en: "If anything feels heavy, I'll guide you through it.",
        vi: "Nếu điều gì khiến bạn nặng đầu, mình sẽ dẫn bạn đi qua.",
      },
    },
    {
      id: "room_start_06",
      event: "room_start",
      emotion: "playful",
      text: {
        en: "Let's warm your tongue up a bit before we dive in.",
        vi: "Hâm nóng chiếc lưỡi một chút trước khi bắt đầu nhé.",
      },
    },
    {
      id: "room_start_07",
      event: "room_start",
      emotion: "warm_gentle",
      text: {
        en: "Focus on meaning first. The English will follow.",
        vi: "Hãy tập trung vào ý nghĩa trước. Tiếng Anh sẽ theo sau.",
      },
    },
    {
      id: "room_start_08",
      event: "room_start",
      emotion: "reassuring",
      text: {
        en: "You don't need to be perfect here—just present.",
        vi: "Bạn không cần hoàn hảo—chỉ cần có mặt ở đây.",
      },
    },
    {
      id: "room_start_09",
      event: "room_start",
      emotion: "warm_gentle",
      text: {
        en: "Let's take this page one breath at a time.",
        vi: "Hãy đi từng hơi thở một.",
      },
    },
    {
      id: "room_start_10",
      event: "room_start",
      emotion: "playful",
      text: {
        en: "Let's stretch your listening muscles a bit.",
        vi: "Cùng kéo giãn cơ nghe của bạn một chút nhé.",
      },
    },
    {
      id: "room_start_11",
      event: "room_start",
      emotion: "warm_gentle",
      text: {
        en: "A little patience here creates strong understanding later.",
        vi: "Một chút kiên nhẫn bây giờ sẽ tạo ra sự hiểu mạnh mẽ sau này.",
      },
    },
    {
      id: "room_start_12",
      event: "room_start",
      emotion: "reassuring",
      text: {
        en: "If a sentence feels too long, we'll chop it together.",
        vi: "Nếu câu nào quá dài, mình sẽ cắt nhỏ cùng bạn.",
      },
    },
    {
      id: "room_start_13",
      event: "room_start",
      emotion: "warm_gentle",
      text: {
        en: "You don't need to try hard—just try honestly.",
        vi: "Bạn không cần cố quá—chỉ cần cố thật lòng.",
      },
    },
    {
      id: "room_start_14",
      event: "room_start",
      emotion: "playful",
      text: {
        en: "Let's test how awake your listening is today.",
        vi: "Xem thử khả năng nghe hôm nay tỉnh táo tới đâu nhé.",
      },
    },
    {
      id: "room_start_15",
      event: "room_start",
      emotion: "warm_gentle",
      text: {
        en: "Kind attention is enough for this room.",
        vi: "Chỉ cần sự chú ý nhẹ nhàng là đủ cho phòng này.",
      },
    },
    {
      id: "room_start_16",
      event: "room_start",
      emotion: "reassuring",
      text: {
        en: "We'll keep this simple. Simplicity builds confidence.",
        vi: "Chúng ta sẽ giữ mọi thứ đơn giản. Đơn giản tạo tự tin.",
      },
    },
    {
      id: "room_start_17",
      event: "room_start",
      emotion: "warm_gentle",
      text: {
        en: "Let's get curious—not perfect.",
        vi: "Hãy tò mò—không cần hoàn hảo.",
      },
    },
    {
      id: "room_start_18",
      event: "room_start",
      emotion: "playful",
      text: {
        en: "Alright, English brain—wake up!",
        vi: "Được rồi, bộ não tiếng Anh—thức dậy nào!",
      },
    },
    {
      id: "room_start_19",
      event: "room_start",
      emotion: "warm_gentle",
      text: {
        en: "You can take this at your own pace. I'm here with you.",
        vi: "Bạn có thể đi với nhịp độ của mình. Mình ở đây cùng bạn.",
      },
    },
    {
      id: "room_start_20",
      event: "room_start",
      emotion: "reassuring",
      text: {
        en: "Whatever you give today is enough.",
        vi: "Hôm nay bạn làm được bao nhiêu cũng là đủ.",
      },
    },
    // --- INSERT NEW room_start MESSAGES ABOVE THIS LINE ---
  ],

  // ============================================
  // ROOM HALFWAY (20 lines) ✅ COMPLETE
  // ============================================
  room_halfway: [
    {
      id: "room_half_01",
      event: "room_halfway",
      emotion: "warm_gentle",
      text: {
        en: "You're halfway. Let's keep the rhythm steady.",
        vi: "Bạn đã đi được nửa đường. Hãy giữ nhịp thật đều.",
      },
    },
    {
      id: "room_half_02",
      event: "room_halfway",
      emotion: "excited_proud",
      text: {
        en: "Nice! You've passed the tricky parts.",
        vi: "Tốt lắm! Bạn đã vượt qua phần khó rồi.",
      },
    },
    {
      id: "room_half_03",
      event: "room_halfway",
      emotion: "reassuring",
      text: {
        en: "If the middle feels messy, that's normal. Keep going.",
        vi: "Nếu đoạn giữa hơi rối, điều đó là bình thường. Tiếp tục nhé.",
      },
    },
    {
      id: "room_half_04",
      event: "room_halfway",
      emotion: "warm_gentle",
      text: {
        en: "Halfway means momentum. Don't break it.",
        vi: "Nửa đường nghĩa là bạn đang có đà. Đừng để đà mất đi.",
      },
    },
    {
      id: "room_half_05",
      event: "room_halfway",
      emotion: "playful",
      text: {
        en: "The finish line is flirting with you.",
        vi: "Vạch đích đang lấp ló trêu bạn kìa.",
      },
    },
    {
      id: "room_half_06",
      event: "room_halfway",
      emotion: "reassuring",
      text: {
        en: "If something felt unclear, we can revisit it later.",
        vi: "Nếu có gì chưa rõ, lát nữa mình xem lại cũng được.",
      },
    },
    {
      id: "room_half_07",
      event: "room_halfway",
      emotion: "warm_gentle",
      text: {
        en: "Halfway is the perfect time to breathe once.",
        vi: "Nửa đường là lúc tuyệt vời để hít một hơi thật nhẹ.",
      },
    },
    {
      id: "room_half_08",
      event: "room_halfway",
      emotion: "excited_proud",
      text: {
        en: "You're doing beautifully. Let's finish strong.",
        vi: "Bạn đang làm rất tốt. Cùng kết thúc thật mạnh mẽ nhé.",
      },
    },
    {
      id: "room_half_09",
      event: "room_halfway",
      emotion: "warm_gentle",
      text: {
        en: "The second half will feel smoother.",
        vi: "Nửa sau sẽ trôi mượt hơn.",
      },
    },
    {
      id: "room_half_10",
      event: "room_halfway",
      emotion: "playful",
      text: {
        en: "Your brain is warmed up now. Let's glide.",
        vi: "Não bạn đã nóng máy rồi. Giờ lướt nhé.",
      },
    },
    {
      id: "room_half_11",
      event: "room_halfway",
      emotion: "reassuring",
      text: {
        en: "No need to hurry. Precision grows from calm steps.",
        vi: "Không cần vội. Sự chính xác đến từ những bước bình tĩnh.",
      },
    },
    {
      id: "room_half_12",
      event: "room_halfway",
      emotion: "warm_gentle",
      text: {
        en: "Look how far you've come in this room already.",
        vi: "Nhìn xem bạn đã đi xa thế nào trong phòng này rồi.",
      },
    },
    {
      id: "room_half_13",
      event: "room_halfway",
      emotion: "excited_proud",
      text: {
        en: "Strong work so far. Let's keep that energy.",
        vi: "Bạn làm rất tốt. Giữ nguyên năng lượng đó nhé.",
      },
    },
    {
      id: "room_half_14",
      event: "room_halfway",
      emotion: "warm_gentle",
      text: {
        en: "Small steps brought you here. Small steps will finish it.",
        vi: "Những bước nhỏ đã đưa bạn đến đây. Chúng cũng sẽ đưa bạn đến đích.",
      },
    },
    {
      id: "room_half_15",
      event: "room_halfway",
      emotion: "reassuring",
      text: {
        en: "If you feel tired, we'll slow down without stopping.",
        vi: "Nếu bạn mệt, mình giảm tốc nhưng không dừng lại nhé.",
      },
    },
    {
      id: "room_half_16",
      event: "room_halfway",
      emotion: "playful",
      text: {
        en: "Halfway heroes don't quit.",
        vi: "Anh hùng nửa đường sẽ không bỏ cuộc đâu.",
      },
    },
    {
      id: "room_half_17",
      event: "room_halfway",
      emotion: "warm_gentle",
      text: {
        en: "You're absorbing more than you think.",
        vi: "Bạn đang hấp thụ nhiều hơn bạn nghĩ đấy.",
      },
    },
    {
      id: "room_half_18",
      event: "room_halfway",
      emotion: "reassuring",
      text: {
        en: "If something felt difficult, it's passing now.",
        vi: "Nếu có gì khó, giờ nó đang dần qua rồi.",
      },
    },
    {
      id: "room_half_19",
      event: "room_halfway",
      emotion: "excited_proud",
      text: {
        en: "Momentum is on your side. Keep flowing.",
        vi: "Đà đang đứng về phía bạn. Cứ thế mà tiếp tục nhé.",
      },
    },
    {
      id: "room_half_20",
      event: "room_halfway",
      emotion: "warm_gentle",
      text: {
        en: "Let's finish this room with softness, not force.",
        vi: "Hãy hoàn thành phòng này bằng sự nhẹ nhàng, không phải gượng ép.",
      },
    },
    // --- INSERT NEW room_halfway MESSAGES ABOVE THIS LINE ---
  ],

  // ============================================
  // ROOM COMPLETE (20 lines) ✅ COMPLETE
  // ============================================
  room_complete: [
    {
      id: "room_complete_01",
      event: "room_complete",
      emotion: "excited_proud",
      text: {
        en: "You finished the room—beautiful work. Let that sink in.",
        vi: "Bạn đã hoàn thành phòng này—tuyệt vời. Hãy để cảm giác ấy lan tỏa.",
      },
    },
    {
      id: "room_complete_02",
      event: "room_complete",
      emotion: "excited_proud",
      text: {
        en: "Strong finish! Your brain just stored something new.",
        vi: "Kết thúc tuyệt vời! Não bạn vừa lưu thêm điều mới.",
      },
    },
    {
      id: "room_complete_03",
      event: "room_complete",
      emotion: "warm_gentle",
      text: {
        en: "Take a breath. You did that with patience and focus.",
        vi: "Hít một hơi. Bạn vừa làm điều đó bằng sự kiên nhẫn và tập trung.",
      },
    },
    {
      id: "room_complete_04",
      event: "room_complete",
      emotion: "excited_proud",
      text: {
        en: "Another brick in your English foundation—well done.",
        vi: "Một viên gạch nữa trong nền tảng tiếng Anh của bạn—tốt lắm.",
      },
    },
    {
      id: "room_complete_05",
      event: "room_complete",
      emotion: "playful",
      text: {
        en: "Look at you finishing rooms like a pro.",
        vi: "Nhìn bạn hoàn thành phòng như dân chuyên kìa.",
      },
    },
    {
      id: "room_complete_06",
      event: "room_complete",
      emotion: "warm_gentle",
      text: {
        en: "Let this success stay in your chest for a second.",
        vi: "Hãy để cảm giác thành công này ở lại trong ngực bạn một chút.",
      },
    },
    {
      id: "room_complete_07",
      event: "room_complete",
      emotion: "excited_proud",
      text: {
        en: "Done! Your consistency is showing.",
        vi: "Xong rồi! Sự đều đặn của bạn đang lộ rõ.",
      },
    },
    {
      id: "room_complete_08",
      event: "room_complete",
      emotion: "warm_gentle",
      text: {
        en: "You handled the hard parts with calm. Impressive.",
        vi: "Bạn đã xử lý phần khó bằng sự bình tĩnh. Ấn tượng đấy.",
      },
    },
    {
      id: "room_complete_09",
      event: "room_complete",
      emotion: "excited_proud",
      text: {
        en: "This is real progress—felt or not.",
        vi: "Đây là tiến bộ thật—dù bạn có cảm thấy hay chưa.",
      },
    },
    {
      id: "room_complete_10",
      event: "room_complete",
      emotion: "playful",
      text: {
        en: "Room demolished. Next?",
        // ✅ FIXED: inner quotes inside the Vietnamese string
        vi: 'Phòng này bị bạn "phá đảo" rồi. Tiếp theo chứ?',
      },
    },
    {
      id: "room_complete_11",
      event: "room_complete",
      emotion: "warm_gentle",
      text: {
        en: "Take a small pause. Let the learning settle.",
        vi: "Tạm dừng một chút. Để kiến thức thấm vào nhé.",
      },
    },
    {
      id: "room_complete_12",
      event: "room_complete",
      emotion: "excited_proud",
      text: {
        en: "You're building something strong inside yourself.",
        vi: "Bạn đang xây dựng một điều mạnh mẽ bên trong mình.",
      },
    },
    {
      id: "room_complete_13",
      event: "room_complete",
      emotion: "playful",
      text: {
        en: "You finished it smoother than you think.",
        vi: "Bạn hoàn thành còn mượt hơn bạn tưởng đó.",
      },
    },
    {
      id: "room_complete_14",
      event: "room_complete",
      emotion: "warm_gentle",
      text: {
        en: "Good work. Rest your mind for a moment.",
        vi: "Làm tốt lắm. Cho tâm trí nghỉ một chút nhé.",
      },
    },
    {
      id: "room_complete_15",
      event: "room_complete",
      emotion: "excited_proud",
      text: {
        en: "Victory. Quiet, but very real.",
        vi: "Chiến thắng. Lặng lẽ nhưng rất thật.",
      },
    },
    {
      id: "room_complete_16",
      event: "room_complete",
      emotion: "warm_gentle",
      text: {
        en: "Your English grew a little right here.",
        vi: "Tiếng Anh của bạn vừa lớn thêm một chút ngay tại đây.",
      },
    },
    {
      id: "room_complete_17",
      event: "room_complete",
      emotion: "reassuring",
      text: {
        en: "Even if it felt messy, finishing matters.",
        vi: "Dù có hơi rối, hoàn thành mới là điều quan trọng.",
      },
    },
    {
      id: "room_complete_18",
      event: "room_complete",
      emotion: "excited_proud",
      text: {
        en: "Great job staying with it to the end.",
        vi: "Bạn đã làm rất tốt khi theo tới cuối.",
      },
    },
    {
      id: "room_complete_19",
      event: "room_complete",
      emotion: "warm_gentle",
      text: {
        en: "Be proud of this moment. It counts.",
        vi: "Hãy tự hào về khoảnh khắc này. Nó rất có giá trị.",
      },
    },
    {
      id: "room_complete_20",
      event: "room_complete",
      emotion: "playful",
      text: {
        en: "Finished! Your brain did a little dance just now.",
        vi: "Xong rồi! Não bạn vừa nhảy một điệu nhỏ đấy.",
      },
    },
    // --- INSERT NEW room_complete MESSAGES ABOVE THIS LINE ---
  ],

  // NOTE: the rest of your file continues unchanged...
  // (shadow_start, shadow_attempt_good, shadow_attempt_bad, streaks, etc.)
};

// ============================================
// CEFR LEVEL UTILITIES
// ============================================

const CEFR_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"];

function getCefrIndex(level: string): number {
  return CEFR_ORDER.indexOf(level.toUpperCase());
}

function isLevelInRange(level: string, min?: string, max?: string): boolean {
  const levelIdx = getCefrIndex(level);
  if (levelIdx === -1) return true; // Unknown level, allow all

  if (min) {
    const minIdx = getCefrIndex(min);
    if (minIdx !== -1 && levelIdx < minIdx) return false;
  }

  if (max) {
    const maxIdx = getCefrIndex(max);
    if (maxIdx !== -1 && levelIdx > maxIdx) return false;
  }

  return true;
}

// ============================================
// CORE FUNCTIONS
// ============================================

export function getMercyMessage(
  event: TeacherEvent,
  options: GetMessageOptions = {}
): MercyMessage {
  const messages = MESSAGES_BY_EVENT[event] || [];

  if (messages.length === 0) {
    return {
      id: "fallback",
      event,
      emotion: "warm_gentle",
      text: { en: "I'm here with you.", vi: "Mình ở đây với bạn." },
    };
  }

  let filtered = messages;
  if (options.cefrLevel) {
    filtered = messages.filter((m) =>
      isLevelInRange(options.cefrLevel!, m.cefrMin, m.cefrMax)
    );
    if (filtered.length === 0) filtered = messages;
  }

  let message = filtered[Math.floor(Math.random() * filtered.length)];

  if (options.username) {
    message = {
      ...message,
      text: {
        en: message.text.en.replace(/\{\{name\}\}/g, options.username),
        vi: message.text.vi.replace(/\{\{name\}\}/g, options.username),
      },
    };
  }

  if (options.emotionOverride) {
    message = { ...message, emotion: options.emotionOverride };
  }

  return message;
}

export function formatMercyMessage(
  message: MercyMessage,
  mode: DisplayMode = "dual"
): string {
  switch (mode) {
    case "en":
      return message.text.en;
    case "vi":
      return message.text.vi;
    case "dual":
    default:
      return `${message.text.en}\n${message.text.vi}`;
  }
}

export function getAllMessagesForEvent(event: TeacherEvent): MercyMessage[] {
  return MESSAGES_BY_EVENT[event] || [];
}

export function getMessageInventory(): { event: TeacherEvent; count: number }[] {
  return Object.entries(MESSAGES_BY_EVENT).map(([event, messages]) => ({
    event: event as TeacherEvent,
    count: messages.length,
  }));
}

export function getTotalMessageCount(): number {
  return Object.values(MESSAGES_BY_EVENT).reduce((sum, msgs) => sum + msgs.length, 0);
}

export function getCefrIntroMessage(level: string): MercyMessage {
  const levelUpper = level.toUpperCase();
  const eventMap: Record<string, TeacherEvent> = {
    A1: "cefr_a1_intro",
    A2: "cefr_a2_intro",
    B1: "cefr_b1_intro",
    B2: "cefr_b2_intro",
    C1: "cefr_c1_intro",
  };

  const event = eventMap[levelUpper];
  if (event) return getMercyMessage(event);
  return getMercyMessage("room_start");
}

export function getStreakMessage(days: number): MercyMessage | null {
  if (days === 3) return getMercyMessage("streak_day_3");
  if (days === 7) return getMercyMessage("streak_day_7");
  if (days === 14) return getMercyMessage("streak_day_14");
  if (days >= 30) return getMercyMessage("streak_day_30");
  return null;
}

export function getComebackMessage(daysAway: number): MercyMessage {
  if (daysAway >= 7) return getMercyMessage("streak_comeback_long");
  if (daysAway >= 1) return getMercyMessage("streak_comeback_short");
  return getMercyMessage("app_open_returning");
}
