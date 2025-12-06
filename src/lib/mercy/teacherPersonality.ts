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
  | 'warm_gentle'      // Default nurturing tone
  | 'excited_proud'    // Celebrating achievements
  | 'calm_firm'        // After multiple failures, steady guidance
  | 'playful'          // Light moments, encouragement
  | 'reassuring';      // Comeback, struggles, heavy moods

/**
 * All events that can trigger Mercy messages
 */
export type TeacherEvent =
  // App lifecycle
  | 'app_open_first_time'
  | 'app_open_returning'
  // Room events
  | 'room_start'
  | 'room_halfway'
  | 'room_complete'
  // Shadow/speaking practice
  | 'shadow_start'
  | 'shadow_attempt_good'
  | 'shadow_attempt_bad'
  | 'shadow_attempt_bad_3plus'  // 3+ failures
  | 'shadow_session_complete'
  // Streak events
  | 'streak_day_3'
  | 'streak_day_7'
  | 'streak_day_14'
  | 'streak_day_30'
  | 'streak_continue'
  | 'streak_break'
  | 'streak_comeback_short'     // 1-3 days away
  | 'streak_comeback_long'      // 7+ days away
  // User state
  | 'user_confused'
  | 'user_low_energy'
  | 'user_tired'
  | 'user_struggling'
  | 'user_excited'
  // Progress milestones
  | 'level_up'
  | 'first_room_complete'
  | 'milestone_10_rooms'
  | 'milestone_50_rooms'
  | 'milestone_100_rooms'
  // Session events
  | 'session_start_morning'
  | 'session_start_evening'
  | 'session_end'
  // CEFR level intros
  | 'cefr_a1_intro'
  | 'cefr_a2_intro'
  | 'cefr_b1_intro'
  | 'cefr_b2_intro'
  | 'cefr_c1_intro'
  // Entry-level
  | 'entry_complete'
  | 'pronunciation_good'
  | 'pronunciation_try_again';

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
  cefrMin?: string;  // e.g., 'A1' - message only for A1+
  cefrMax?: string;  // e.g., 'B1' - message only up to B1
  text: BilingualText;
}

/**
 * Display mode for bilingual content
 */
export type DisplayMode = 'en' | 'vi' | 'dual';

/**
 * Options for getMercyMessage
 */
export interface GetMessageOptions {
  cefrLevel?: string;
  username?: string;
  emotionOverride?: MercyEmotion;
  displayMode?: DisplayMode;
  failureCount?: number;  // For shadow_attempt_bad logic
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
    case 'room_complete':
    case 'shadow_session_complete':
    case 'level_up':
    case 'first_room_complete':
    case 'milestone_10_rooms':
    case 'milestone_50_rooms':
    case 'milestone_100_rooms':
    case 'streak_day_7':
    case 'streak_day_14':
    case 'streak_day_30':
      return 'excited_proud';

    // Gentle starts
    case 'app_open_first_time':
    case 'room_start':
    case 'shadow_start':
    case 'session_start_morning':
    case 'session_start_evening':
      return 'warm_gentle';

    // Failures with escalation
    case 'shadow_attempt_bad':
    case 'shadow_attempt_bad_3plus':
      return failureCount >= 3 ? 'calm_firm' : 'warm_gentle';

    // Comeback logic
    case 'streak_comeback_long':
      return 'reassuring';
    case 'streak_comeback_short':
      return daysAway >= 7 ? 'reassuring' : 'warm_gentle';

    // User states
    case 'user_low_energy':
    case 'user_tired':
    case 'user_struggling':
      return 'reassuring';
    case 'user_confused':
      return 'calm_firm';
    case 'user_excited':
      return 'playful';

    // Mood-based overrides
    default:
      if (mood === 'heavy' || mood === 'anxious') {
        return 'reassuring';
      }
      return 'warm_gentle';
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
    { id: 'open_first_01', event: 'app_open_first_time', emotion: 'warm_gentle', text: { en: "Welcome. We'll grow your English together, one quiet step at a time.", vi: "Chào mừng bạn. Chúng ta sẽ cùng nhau xây tiếng Anh từng bước nhẹ nhàng." } },
    { id: 'open_first_02', event: 'app_open_first_time', emotion: 'warm_gentle', text: { en: "Nice to have you here. Let me guide you with clarity and calm.", vi: "Thật vui khi có bạn ở đây. Mình sẽ hướng dẫn bạn bằng sự rõ ràng và bình tĩnh." } },
    { id: 'open_first_03', event: 'app_open_first_time', emotion: 'reassuring', text: { en: "No pressure at all. Even one minute today is enough.", vi: "Không có áp lực gì cả. Chỉ một phút hôm nay cũng đủ rồi." } },
    { id: 'open_first_04', event: 'app_open_first_time', emotion: 'warm_gentle', text: { en: "This is the beginning of something steady and good.", vi: "Đây là sự bắt đầu của một điều bền bỉ và tốt đẹp." } },
    { id: 'open_first_05', event: 'app_open_first_time', emotion: 'playful', text: { en: "Let's wake your tongue up a little today.", vi: "Cùng đánh thức chiếc lưỡi của bạn nhẹ nhàng hôm nay nhé." } },
    { id: 'open_first_06', event: 'app_open_first_time', emotion: 'warm_gentle', text: { en: "Slow is fine. Slow builds strong foundations.", vi: "Chậm cũng tốt. Chậm tạo nền tảng vững chắc." } },
    { id: 'open_first_07', event: 'app_open_first_time', emotion: 'reassuring', text: { en: "If English ever felt scary, I'll make it feel lighter.", vi: "Nếu tiếng Anh từng khiến bạn sợ, mình sẽ làm nó nhẹ đi." } },
    { id: 'open_first_08', event: 'app_open_first_time', emotion: 'warm_gentle', text: { en: "You're not alone. I'm here with you in every step.", vi: "Bạn không đơn độc. Mình ở đây cùng bạn trong từng bước." } },
    { id: 'open_first_09', event: 'app_open_first_time', emotion: 'playful', text: { en: "Let's see how your brain responds today.", vi: "Xem thử hôm nay bộ não bạn phản ứng thế nào nhé." } },
    { id: 'open_first_10', event: 'app_open_first_time', emotion: 'reassuring', text: { en: "You don't need talent. You just need small, honest effort.", vi: "Bạn không cần tài năng. Bạn chỉ cần những nỗ lực nhỏ nhưng thật lòng." } },
    // --- INSERT NEW app_open_first_time MESSAGES ABOVE THIS LINE ---
  ],

  // ============================================
  // APP OPEN - RETURNING (10 lines)
  // ============================================
  app_open_returning: [
    { id: 'open_return_01', event: 'app_open_returning', emotion: 'warm_gentle', text: { en: "Welcome back. Even showing up is progress.", vi: "Chào mừng bạn trở lại. Chỉ cần xuất hiện đã là tiến bộ rồi." } },
    { id: 'open_return_02', event: 'app_open_returning', emotion: 'warm_gentle', text: { en: "Good to see you again. Let's make today simple and clear.", vi: "Rất vui được gặp lại bạn. Cùng làm hôm nay thật đơn giản và rõ ràng nhé." } },
    { id: 'open_return_03', event: 'app_open_returning', emotion: 'reassuring', text: { en: "You didn't fall behind. You're still on track.", vi: "Bạn không hề chậm lại. Bạn vẫn đang đi đúng hướng." } },
    { id: 'open_return_04', event: 'app_open_returning', emotion: 'playful', text: { en: "Shall we warm up your tongue again?", vi: "Hâm nóng chiếc lưỡi một chút nữa nhé?" } },
    { id: 'open_return_05', event: 'app_open_returning', emotion: 'warm_gentle', text: { en: "Consistency is power. You're doing wonderfully.", vi: "Sự đều đặn là sức mạnh. Bạn đang làm rất tốt." } },
    { id: 'open_return_06', event: 'app_open_returning', emotion: 'reassuring', text: { en: "If yesterday was heavy, today we go light.", vi: "Nếu hôm qua nặng nề, hôm nay chúng ta đi nhẹ." } },
    { id: 'open_return_07', event: 'app_open_returning', emotion: 'warm_gentle', text: { en: "I'm here. Let's pick up right where you left off.", vi: "Mình đây rồi. Cùng tiếp tục từ nơi bạn dừng lại nhé." } },
    { id: 'open_return_08', event: 'app_open_returning', emotion: 'playful', text: { en: "Your English muscles missed this.", vi: "Các cơ tiếng Anh của bạn nhớ điều này rồi đó." } },
    { id: 'open_return_09', event: 'app_open_returning', emotion: 'reassuring', text: { en: "Returning is more important than perfection.", vi: "Quay lại quan trọng hơn hoàn hảo." } },
    { id: 'open_return_10', event: 'app_open_returning', emotion: 'warm_gentle', text: { en: "Let's make a small win today.", vi: "Hôm nay mình cùng làm một chiến thắng nhỏ nhé." } },
    // --- INSERT NEW app_open_returning MESSAGES ABOVE THIS LINE ---
  ],

  // ============================================
  // ROOM START (20 lines) - TODO: Awaiting batch from user
  // ============================================
  room_start: [
    { id: 'rs_1', event: 'room_start', emotion: 'warm_gentle', text: { en: "Let's learn together. No rush, no pressure.", vi: "Cùng học nhé. Không vội, không áp lực." } },
    { id: 'rs_2', event: 'room_start', emotion: 'warm_gentle', text: { en: "Welcome to this room. Take your time.", vi: "Chào mừng đến phòng này. Từ từ thôi." } },
    { id: 'rs_3', event: 'room_start', emotion: 'warm_gentle', text: { en: "English is a journey. Enjoy each step.", vi: "Tiếng Anh là hành trình. Tận hưởng từng bước." } },
    { id: 'rs_4', event: 'room_start', emotion: 'warm_gentle', text: { en: "Ready when you are. Let's begin.", vi: "Sẵn sàng khi bạn sẵn sàng. Bắt đầu thôi." } },
    { id: 'rs_5', event: 'room_start', emotion: 'playful', text: { en: "Your English adventure continues today.", vi: "Hành trình tiếng Anh tiếp tục hôm nay." } },
    // --- INSERT NEW room_start MESSAGES ABOVE THIS LINE ---
  ],

  // ============================================
  // ROOM HALFWAY (20 lines) - TODO: Awaiting batch from user
  // ============================================
  room_halfway: [
    { id: 'rh_1', event: 'room_halfway', emotion: 'playful', text: { en: "Halfway there! You're doing great.", vi: "Đã nửa đường! Bạn đang làm rất tốt." } },
    { id: 'rh_2', event: 'room_halfway', emotion: 'warm_gentle', text: { en: "Keep going. You've got momentum.", vi: "Tiếp tục đi. Bạn đang có đà rồi." } },
    { id: 'rh_3', event: 'room_halfway', emotion: 'playful', text: { en: "Nice! The second half awaits.", vi: "Hay lắm! Nửa còn lại đang chờ." } },
    // --- INSERT NEW room_halfway MESSAGES ABOVE THIS LINE ---
  ],

  // ============================================
  // ROOM COMPLETE (20 lines) - TODO: Awaiting batch from user
  // ============================================
  room_complete: [
    { id: 'rc_1', event: 'room_complete', emotion: 'excited_proud', text: { en: "Wonderful! You completed this room. Well done!", vi: "Tuyệt vời! Bạn đã hoàn thành phòng này. Làm tốt lắm!" } },
    { id: 'rc_2', event: 'room_complete', emotion: 'excited_proud', text: { en: "Another room done. Your English grows stronger.", vi: "Thêm một phòng hoàn thành. Tiếng Anh của bạn mạnh hơn." } },
    { id: 'rc_3', event: 'room_complete', emotion: 'excited_proud', text: { en: "You did it! Take a moment to feel proud.", vi: "Bạn làm được rồi! Hãy tự hào về bản thân." } },
    { id: 'rc_4', event: 'room_complete', emotion: 'excited_proud', text: { en: "Room complete! Every finish line is a new starting point.", vi: "Hoàn thành phòng! Mỗi đích đến là điểm xuất phát mới." } },
    // --- INSERT NEW room_complete MESSAGES ABOVE THIS LINE ---
  ],

  // ============================================
  // SHADOW START (20 lines) - TODO: Awaiting batch from user
  // ============================================
  shadow_start: [
    { id: 'ss_1', event: 'shadow_start', emotion: 'warm_gentle', text: { en: "Shadow practice begins. Listen, then repeat.", vi: "Bắt đầu luyện shadow. Nghe, rồi lặp lại." } },
    { id: 'ss_2', event: 'shadow_start', emotion: 'warm_gentle', text: { en: "Follow the rhythm. Your voice matters.", vi: "Theo nhịp điệu. Giọng bạn quan trọng." } },
    // --- INSERT NEW shadow_start MESSAGES ABOVE THIS LINE ---
  ],

  // ============================================
  // SHADOW ATTEMPT GOOD (30 lines) - TODO: Awaiting batch from user
  // ============================================
  shadow_attempt_good: [
    { id: 'sag_1', event: 'shadow_attempt_good', emotion: 'excited_proud', text: { en: "Great shadowing! Your pronunciation is improving.", vi: "Shadowing tốt lắm! Phát âm của bạn đang tiến bộ." } },
    { id: 'sag_2', event: 'shadow_attempt_good', emotion: 'excited_proud', text: { en: "Well done! Your voice matches the rhythm.", vi: "Làm tốt lắm! Giọng bạn khớp với nhịp." } },
    { id: 'sag_3', event: 'shadow_attempt_good', emotion: 'playful', text: { en: "That sounded natural! Keep it up.", vi: "Nghe tự nhiên lắm! Tiếp tục nhé." } },
    // --- INSERT NEW shadow_attempt_good MESSAGES ABOVE THIS LINE ---
  ],

  // ============================================
  // SHADOW ATTEMPT BAD (30 lines) - TODO: Awaiting batch from user
  // ============================================
  shadow_attempt_bad: [
    { id: 'sab_1', event: 'shadow_attempt_bad', emotion: 'warm_gentle', text: { en: "Good try! Listen again and repeat slowly.", vi: "Cố gắng tốt! Nghe lại và lặp lại chậm hơn." } },
    { id: 'sab_2', event: 'shadow_attempt_bad', emotion: 'warm_gentle', text: { en: "It's okay. Practice makes progress, not perfection.", vi: "Không sao. Luyện tập tạo tiến bộ, không phải hoàn hảo." } },
    { id: 'sab_3', event: 'shadow_attempt_bad', emotion: 'warm_gentle', text: { en: "Let's try that again. Slower this time.", vi: "Thử lại nhé. Chậm hơn lần này." } },
    // --- INSERT NEW shadow_attempt_bad MESSAGES ABOVE THIS LINE ---
  ],

  shadow_attempt_bad_3plus: [
    { id: 'sab3_1', event: 'shadow_attempt_bad_3plus', emotion: 'calm_firm', text: { en: "Let's pause and focus on just the first few words.", vi: "Hãy dừng lại và tập trung vào vài từ đầu thôi." } },
    { id: 'sab3_2', event: 'shadow_attempt_bad_3plus', emotion: 'calm_firm', text: { en: "Slow down. One sound at a time.", vi: "Chậm lại. Từng âm một thôi." } },
    { id: 'sab3_3', event: 'shadow_attempt_bad_3plus', emotion: 'reassuring', text: { en: "This is tough, but you're building real skill.", vi: "Khó đấy, nhưng bạn đang xây dựng kỹ năng thực sự." } },
    // --- INSERT NEW shadow_attempt_bad_3plus MESSAGES ABOVE THIS LINE ---
  ],

  // ============================================
  // SHADOW SESSION COMPLETE (10 lines) - TODO: Awaiting batch from user
  // ============================================
  shadow_session_complete: [
    { id: 'ssc_1', event: 'shadow_session_complete', emotion: 'excited_proud', text: { en: "Shadow session complete! Your speaking grows stronger.", vi: "Hoàn thành buổi shadow! Kỹ năng nói mạnh hơn rồi." } },
    { id: 'ssc_2', event: 'shadow_session_complete', emotion: 'excited_proud', text: { en: "Well done! Regular shadow practice builds fluency.", vi: "Làm tốt lắm! Luyện shadow đều đặn xây dựng sự lưu loát." } },
    // --- INSERT NEW shadow_session_complete MESSAGES ABOVE THIS LINE ---
  ],

  // ============================================
  // STREAK EVENTS - TODO: Awaiting batches from user
  // ============================================
  streak_day_3: [
    { id: 'sd3_1', event: 'streak_day_3', emotion: 'excited_proud', text: { en: "3 days in a row! Consistency is beautiful.", vi: "3 ngày liên tiếp! Sự kiên trì thật đẹp." } },
    { id: 'sd3_2', event: 'streak_day_3', emotion: 'playful', text: { en: "You're building a habit. Keep going!", vi: "Bạn đang xây dựng thói quen. Tiếp tục!" } },
  ],
  streak_day_7: [
    { id: 'sd7_1', event: 'streak_day_7', emotion: 'excited_proud', text: { en: "One week! Your dedication is inspiring.", vi: "Một tuần! Sự cống hiến của bạn thật đáng ngưỡng mộ." } },
    { id: 'sd7_2', event: 'streak_day_7', emotion: 'excited_proud', text: { en: "7 days of growth. You're amazing!", vi: "7 ngày tiến bộ. Bạn thật tuyệt!" } },
  ],
  streak_day_14: [
    { id: 'sd14_1', event: 'streak_day_14', emotion: 'excited_proud', text: { en: "Two weeks! Your commitment is extraordinary.", vi: "Hai tuần! Cam kết của bạn thật phi thường." } },
  ],
  streak_day_30: [
    { id: 'sd30_1', event: 'streak_day_30', emotion: 'excited_proud', text: { en: "30 days! You've built a true learning habit.", vi: "30 ngày! Bạn đã xây dựng thói quen học thật sự." } },
    { id: 'sd30_2', event: 'streak_day_30', emotion: 'excited_proud', text: { en: "One month of English! I'm so proud of you.", vi: "Một tháng tiếng Anh! Mình rất tự hào về bạn." } },
  ],
  streak_continue: [
    { id: 'sc_1', event: 'streak_continue', emotion: 'playful', text: { en: "Another day, another win. Keep the streak alive!", vi: "Thêm một ngày, thêm chiến thắng. Giữ chuỗi ngày!" } },
    // --- INSERT NEW streak_continue MESSAGES ABOVE THIS LINE ---
  ],
  streak_break: [
    { id: 'sb_1', event: 'streak_break', emotion: 'reassuring', text: { en: "Streaks can restart. What matters is you're here now.", vi: "Chuỗi ngày có thể bắt đầu lại. Quan trọng là bạn ở đây." } },
    // --- INSERT NEW streak_break MESSAGES ABOVE THIS LINE ---
  ],
  streak_comeback_short: [
    { id: 'scs_1', event: 'streak_comeback_short', emotion: 'warm_gentle', text: { en: "Welcome back. Life happens. Let's continue gently.", vi: "Chào mừng trở lại. Cuộc sống mà. Tiếp tục nhẹ nhàng." } },
    // --- INSERT NEW streak_comeback_short MESSAGES ABOVE THIS LINE ---
  ],
  streak_comeback_long: [
    { id: 'scl_1', event: 'streak_comeback_long', emotion: 'reassuring', text: { en: "You've been missed! English missed you too.", vi: "Bạn đã được nhớ! Tiếng Anh cũng nhớ bạn." } },
    { id: 'scl_2', event: 'streak_comeback_long', emotion: 'reassuring', text: { en: "Welcome home. Let's refresh what you learned.", vi: "Chào mừng về nhà. Hãy ôn lại những gì bạn đã học." } },
    { id: 'scl_3', event: 'streak_comeback_long', emotion: 'reassuring', text: { en: "Every return is a victory. Welcome back.", vi: "Mỗi lần quay lại là chiến thắng. Chào mừng trở lại." } },
    // --- INSERT NEW streak_comeback_long MESSAGES ABOVE THIS LINE ---
  ],

  // --- User States ---
  user_confused: [
    { id: 'uc_1', event: 'user_confused', emotion: 'calm_firm', text: { en: "Confused? That's okay. Let's break this down.", vi: "Bối rối? Không sao. Hãy chia nhỏ ra." } },
    { id: 'uc_2', event: 'user_confused', emotion: 'calm_firm', text: { en: "Let me explain that differently.", vi: "Để mình giải thích khác đi." } },
  ],
  user_low_energy: [
    { id: 'ule_1', event: 'user_low_energy', emotion: 'reassuring', text: { en: "Low energy today? Even small steps count.", vi: "Hôm nay mệt? Bước nhỏ vẫn có giá trị." } },
    { id: 'ule_2', event: 'user_low_energy', emotion: 'reassuring', text: { en: "Take it easy. Learning is a marathon.", vi: "Nhẹ nhàng thôi. Học là chặng đường dài." } },
  ],
  user_tired: [
    { id: 'ut_1', event: 'user_tired', emotion: 'reassuring', text: { en: "It's okay to rest. Even small steps count.", vi: "Nghỉ ngơi cũng được. Bước nhỏ vẫn có giá trị." } },
    { id: 'ut_2', event: 'user_tired', emotion: 'reassuring', text: { en: "Your effort today matters, however small.", vi: "Nỗ lực hôm nay quan trọng, dù nhỏ thế nào." } },
  ],
  user_struggling: [
    { id: 'us_1', event: 'user_struggling', emotion: 'reassuring', text: { en: "Struggling means you're learning. Keep going.", vi: "Khó khăn nghĩa là bạn đang học. Tiếp tục." } },
    { id: 'us_2', event: 'user_struggling', emotion: 'reassuring', text: { en: "Every expert was once a beginner. You've got this.", vi: "Chuyên gia nào cũng từng là người mới. Bạn làm được." } },
  ],
  user_excited: [
    { id: 'ue_1', event: 'user_excited', emotion: 'playful', text: { en: "Your enthusiasm is wonderful! Let's channel it.", vi: "Sự nhiệt tình của bạn tuyệt vời! Hãy tận dụng nó." } },
    { id: 'ue_2', event: 'user_excited', emotion: 'playful', text: { en: "I love your energy! Let's make progress together.", vi: "Mình thích năng lượng của bạn! Cùng tiến bộ nào." } },
  ],

  // --- Progress Milestones ---
  level_up: [
    { id: 'lu_1', event: 'level_up', emotion: 'excited_proud', text: { en: "Level up! Your hard work is paying off.", vi: "Lên level! Công sức của bạn đang được đền đáp." } },
    { id: 'lu_2', event: 'level_up', emotion: 'excited_proud', text: { en: "You've grown! Ready for new challenges.", vi: "Bạn đã phát triển! Sẵn sàng cho thử thách mới." } },
  ],
  first_room_complete: [
    { id: 'frc_1', event: 'first_room_complete', emotion: 'excited_proud', text: { en: "Your first room! This is just the beginning.", vi: "Phòng đầu tiên! Đây mới chỉ là khởi đầu." } },
    { id: 'frc_2', event: 'first_room_complete', emotion: 'excited_proud', text: { en: "You've started your English journey. I'm proud.", vi: "Bạn đã bắt đầu hành trình tiếng Anh. Mình tự hào." } },
  ],
  milestone_10_rooms: [
    { id: 'm10_1', event: 'milestone_10_rooms', emotion: 'excited_proud', text: { en: "10 rooms completed! You're building real skill.", vi: "10 phòng hoàn thành! Bạn đang xây dựng kỹ năng thực." } },
  ],
  milestone_50_rooms: [
    { id: 'm50_1', event: 'milestone_50_rooms', emotion: 'excited_proud', text: { en: "50 rooms! Your dedication is remarkable.", vi: "50 phòng! Sự cống hiến của bạn đáng ngưỡng mộ." } },
  ],
  milestone_100_rooms: [
    { id: 'm100_1', event: 'milestone_100_rooms', emotion: 'excited_proud', text: { en: "100 rooms! You've achieved something incredible.", vi: "100 phòng! Bạn đã đạt được điều phi thường." } },
  ],

  // --- Session Events ---
  session_start_morning: [
    { id: 'ssm_1', event: 'session_start_morning', emotion: 'warm_gentle', text: { en: "Good morning! Fresh mind, fresh learning.", vi: "Chào buổi sáng! Trí óc tươi mới, học hỏi mới." } },
    { id: 'ssm_2', event: 'session_start_morning', emotion: 'playful', text: { en: "Morning practice is powerful. Let's begin.", vi: "Luyện tập buổi sáng rất mạnh mẽ. Bắt đầu thôi." } },
  ],
  session_start_evening: [
    { id: 'sse_1', event: 'session_start_evening', emotion: 'warm_gentle', text: { en: "Evening study time. Let's wind down with English.", vi: "Thời gian học buổi tối. Thư giãn với tiếng Anh." } },
    { id: 'sse_2', event: 'session_start_evening', emotion: 'warm_gentle', text: { en: "End your day with a little learning. You deserve it.", vi: "Kết thúc ngày với chút học hỏi. Bạn xứng đáng." } },
  ],
  session_end: [
    { id: 'se_1', event: 'session_end', emotion: 'warm_gentle', text: { en: "Great session! Rest well and come back soon.", vi: "Buổi học tốt! Nghỉ ngơi và quay lại sớm nhé." } },
    { id: 'se_2', event: 'session_end', emotion: 'excited_proud', text: { en: "You did wonderful today. See you next time.", vi: "Bạn làm tuyệt vời hôm nay. Hẹn gặp lại." } },
  ],

  // --- CEFR Level Intros ---
  cefr_a1_intro: [
    { id: 'ca1_1', event: 'cefr_a1_intro', emotion: 'warm_gentle', text: { en: "A1 - Your first steps in English. We start simple.", vi: "A1 - Bước đầu tiên trong tiếng Anh. Ta bắt đầu đơn giản." } },
    { id: 'ca1_2', event: 'cefr_a1_intro', emotion: 'playful', text: { en: "Welcome to A1! Basic phrases, big progress.", vi: "Chào mừng đến A1! Cụm từ cơ bản, tiến bộ lớn." } },
  ],
  cefr_a2_intro: [
    { id: 'ca2_1', event: 'cefr_a2_intro', emotion: 'playful', text: { en: "A2 - Building on basics. You're growing!", vi: "A2 - Xây dựng từ nền tảng. Bạn đang phát triển!" } },
    { id: 'ca2_2', event: 'cefr_a2_intro', emotion: 'warm_gentle', text: { en: "Welcome to A2! More vocabulary, more confidence.", vi: "Chào mừng đến A2! Nhiều từ vựng hơn, tự tin hơn." } },
  ],
  cefr_b1_intro: [
    { id: 'cb1_1', event: 'cefr_b1_intro', emotion: 'playful', text: { en: "B1 - You can express yourself now. Let's deepen.", vi: "B1 - Bạn có thể diễn đạt rồi. Hãy đào sâu hơn." } },
    { id: 'cb1_2', event: 'cefr_b1_intro', emotion: 'warm_gentle', text: { en: "Welcome to B1! Real conversations await.", vi: "Chào mừng đến B1! Hội thoại thực sự đang chờ." } },
  ],
  cefr_b2_intro: [
    { id: 'cb2_1', event: 'cefr_b2_intro', emotion: 'playful', text: { en: "B2 - You're becoming fluent. Let's polish.", vi: "B2 - Bạn đang trở nên lưu loát. Hãy trau dồi." } },
    { id: 'cb2_2', event: 'cefr_b2_intro', emotion: 'calm_firm', text: { en: "Welcome to B2! Complex ideas, natural speech.", vi: "Chào mừng đến B2! Ý tưởng phức tạp, lời nói tự nhiên." } },
  ],
  cefr_c1_intro: [
    { id: 'cc1_1', event: 'cefr_c1_intro', emotion: 'calm_firm', text: { en: "C1 - Near mastery. Let's refine your English.", vi: "C1 - Gần thành thạo. Hãy tinh chỉnh tiếng Anh." } },
    { id: 'cc1_2', event: 'cefr_c1_intro', emotion: 'playful', text: { en: "Welcome to C1! Nuance and precision ahead.", vi: "Chào mừng đến C1! Sắc thái và chính xác phía trước." } },
  ],

  // --- Entry-level Events ---
  entry_complete: [
    { id: 'ec_1', event: 'entry_complete', emotion: 'warm_gentle', text: { en: "Well done! Every word learned is progress.", vi: "Làm tốt lắm! Mỗi từ học được là tiến bộ." } },
    { id: 'ec_2', event: 'entry_complete', emotion: 'warm_gentle', text: { en: "You're building your English, one step at a time.", vi: "Bạn đang xây dựng tiếng Anh, từng bước một." } },
    { id: 'ec_3', event: 'entry_complete', emotion: 'playful', text: { en: "Good progress! Try using this phrase today.", vi: "Tiến bộ tốt! Thử dùng cụm từ này hôm nay nhé." } },
  ],
  pronunciation_good: [
    { id: 'pg_1', event: 'pronunciation_good', emotion: 'excited_proud', text: { en: "Your pronunciation is clear! Well done.", vi: "Phát âm của bạn rõ ràng! Làm tốt lắm." } },
    { id: 'pg_2', event: 'pronunciation_good', emotion: 'playful', text: { en: "The sounds are coming naturally now.", vi: "Âm thanh đang đến tự nhiên rồi." } },
  ],
  pronunciation_try_again: [
    { id: 'pta_1', event: 'pronunciation_try_again', emotion: 'warm_gentle', text: { en: "Let's try that sound again. Listen carefully.", vi: "Hãy thử âm đó lại. Lắng nghe cẩn thận." } },
    { id: 'pta_2', event: 'pronunciation_try_again', emotion: 'playful', text: { en: "Focus on the ending sounds. You're close!", vi: "Tập trung vào âm cuối. Bạn gần được rồi!" } },
  ],
};

// ============================================
// CEFR LEVEL UTILITIES
// ============================================

const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

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

/**
 * Get a Mercy message for a specific event.
 * Filters by CEFR level if provided and selects randomly.
 */
export function getMercyMessage(
  event: TeacherEvent,
  options: GetMessageOptions = {}
): MercyMessage {
  const messages = MESSAGES_BY_EVENT[event] || [];
  
  if (messages.length === 0) {
    // Fallback message
    return {
      id: 'fallback',
      event,
      emotion: 'warm_gentle',
      text: {
        en: "I'm here with you.",
        vi: "Mình ở đây với bạn.",
      },
    };
  }

  // Filter by CEFR level if provided
  let filtered = messages;
  if (options.cefrLevel) {
    filtered = messages.filter(m => isLevelInRange(options.cefrLevel!, m.cefrMin, m.cefrMax));
    if (filtered.length === 0) filtered = messages; // Fallback to all if none match
  }

  // Pick random message
  let message = filtered[Math.floor(Math.random() * filtered.length)];

  // Apply username substitution
  if (options.username) {
    message = {
      ...message,
      text: {
        en: message.text.en.replace(/\{\{name\}\}/g, options.username),
        vi: message.text.vi.replace(/\{\{name\}\}/g, options.username),
      },
    };
  }

  // Apply emotion override if provided
  if (options.emotionOverride) {
    message = { ...message, emotion: options.emotionOverride };
  }

  return message;
}

/**
 * Format a Mercy message for display based on language mode.
 */
export function formatMercyMessage(
  message: MercyMessage,
  mode: DisplayMode = 'dual'
): string {
  switch (mode) {
    case 'en':
      return message.text.en;
    case 'vi':
      return message.text.vi;
    case 'dual':
    default:
      return `${message.text.en}\n${message.text.vi}`;
  }
}

/**
 * Get all messages for an event (for testing/validation)
 */
export function getAllMessagesForEvent(event: TeacherEvent): MercyMessage[] {
  return MESSAGES_BY_EVENT[event] || [];
}

/**
 * Get message count inventory
 */
export function getMessageInventory(): { event: TeacherEvent; count: number }[] {
  return Object.entries(MESSAGES_BY_EVENT).map(([event, messages]) => ({
    event: event as TeacherEvent,
    count: messages.length,
  }));
}

/**
 * Get total message count
 */
export function getTotalMessageCount(): number {
  return Object.values(MESSAGES_BY_EVENT).reduce((sum, msgs) => sum + msgs.length, 0);
}

/**
 * Get CEFR intro message based on level
 */
export function getCefrIntroMessage(level: string): MercyMessage {
  const levelUpper = level.toUpperCase();
  const eventMap: Record<string, TeacherEvent> = {
    'A1': 'cefr_a1_intro',
    'A2': 'cefr_a2_intro',
    'B1': 'cefr_b1_intro',
    'B2': 'cefr_b2_intro',
    'C1': 'cefr_c1_intro',
  };

  const event = eventMap[levelUpper];
  if (event) {
    return getMercyMessage(event);
  }
  return getMercyMessage('room_start');
}

/**
 * Get streak message based on days
 */
export function getStreakMessage(days: number): MercyMessage | null {
  if (days === 3) return getMercyMessage('streak_day_3');
  if (days === 7) return getMercyMessage('streak_day_7');
  if (days === 14) return getMercyMessage('streak_day_14');
  if (days >= 30) return getMercyMessage('streak_day_30');
  return null;
}

/**
 * Get comeback message based on days away
 */
export function getComebackMessage(daysAway: number): MercyMessage {
  if (daysAway >= 7) return getMercyMessage('streak_comeback_long');
  if (daysAway >= 1) return getMercyMessage('streak_comeback_short');
  return getMercyMessage('app_open_returning');
}
