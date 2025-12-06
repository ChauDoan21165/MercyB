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
  // ROOM START (20 lines) ✅ COMPLETE
  // ============================================
  room_start: [
    { id: 'room_start_01', event: 'room_start', emotion: 'warm_gentle', text: { en: "Let's enter this room slowly. No rush—just clarity.", vi: "Hãy vào phòng này thật chậm rãi. Không vội—chỉ cần rõ ràng." } },
    { id: 'room_start_02', event: 'room_start', emotion: 'warm_gentle', text: { en: "Give your mind a second to settle. We begin gently.", vi: "Hãy để tâm trí bạn ổn định một chút. Chúng ta bắt đầu nhẹ nhàng." } },
    { id: 'room_start_03', event: 'room_start', emotion: 'playful', text: { en: "Ready? Let's see how your English brain wakes up.", vi: "Sẵn sàng chưa? Xem thử bộ não tiếng Anh của bạn thức dậy thế nào nhé." } },
    { id: 'room_start_04', event: 'room_start', emotion: 'warm_gentle', text: { en: "One small step in this room is enough.", vi: "Chỉ một bước nhỏ trong phòng này là đủ rồi." } },
    { id: 'room_start_05', event: 'room_start', emotion: 'reassuring', text: { en: "If anything feels heavy, I'll guide you through it.", vi: "Nếu điều gì khiến bạn nặng đầu, mình sẽ dẫn bạn đi qua." } },
    { id: 'room_start_06', event: 'room_start', emotion: 'playful', text: { en: "Let's warm your tongue up a bit before we dive in.", vi: "Hâm nóng chiếc lưỡi một chút trước khi bắt đầu nhé." } },
    { id: 'room_start_07', event: 'room_start', emotion: 'warm_gentle', text: { en: "Focus on meaning first. The English will follow.", vi: "Hãy tập trung vào ý nghĩa trước. Tiếng Anh sẽ theo sau." } },
    { id: 'room_start_08', event: 'room_start', emotion: 'reassuring', text: { en: "You don't need to be perfect here—just present.", vi: "Bạn không cần hoàn hảo—chỉ cần có mặt ở đây." } },
    { id: 'room_start_09', event: 'room_start', emotion: 'warm_gentle', text: { en: "Let's take this page one breath at a time.", vi: "Hãy đi từng hơi thở một." } },
    { id: 'room_start_10', event: 'room_start', emotion: 'playful', text: { en: "Let's stretch your listening muscles a bit.", vi: "Cùng kéo giãn cơ nghe của bạn một chút nhé." } },
    { id: 'room_start_11', event: 'room_start', emotion: 'warm_gentle', text: { en: "A little patience here creates strong understanding later.", vi: "Một chút kiên nhẫn bây giờ sẽ tạo ra sự hiểu mạnh mẽ sau này." } },
    { id: 'room_start_12', event: 'room_start', emotion: 'reassuring', text: { en: "If a sentence feels too long, we'll chop it together.", vi: "Nếu câu nào quá dài, mình sẽ cắt nhỏ cùng bạn." } },
    { id: 'room_start_13', event: 'room_start', emotion: 'warm_gentle', text: { en: "You don't need to try hard—just try honestly.", vi: "Bạn không cần cố quá—chỉ cần cố thật lòng." } },
    { id: 'room_start_14', event: 'room_start', emotion: 'playful', text: { en: "Let's test how awake your listening is today.", vi: "Xem thử khả năng nghe hôm nay tỉnh táo tới đâu nhé." } },
    { id: 'room_start_15', event: 'room_start', emotion: 'warm_gentle', text: { en: "Kind attention is enough for this room.", vi: "Chỉ cần sự chú ý nhẹ nhàng là đủ cho phòng này." } },
    { id: 'room_start_16', event: 'room_start', emotion: 'reassuring', text: { en: "We'll keep this simple. Simplicity builds confidence.", vi: "Chúng ta sẽ giữ mọi thứ đơn giản. Đơn giản tạo tự tin." } },
    { id: 'room_start_17', event: 'room_start', emotion: 'warm_gentle', text: { en: "Let's get curious—not perfect.", vi: "Hãy tò mò—không cần hoàn hảo." } },
    { id: 'room_start_18', event: 'room_start', emotion: 'playful', text: { en: "Alright, English brain—wake up!", vi: "Được rồi, bộ não tiếng Anh—thức dậy nào!" } },
    { id: 'room_start_19', event: 'room_start', emotion: 'warm_gentle', text: { en: "You can take this at your own pace. I'm here with you.", vi: "Bạn có thể đi với nhịp độ của mình. Mình ở đây cùng bạn." } },
    { id: 'room_start_20', event: 'room_start', emotion: 'reassuring', text: { en: "Whatever you give today is enough.", vi: "Hôm nay bạn làm được bao nhiêu cũng là đủ." } },
    // --- INSERT NEW room_start MESSAGES ABOVE THIS LINE ---
  ],

  // ============================================
  // ROOM HALFWAY (20 lines) ✅ COMPLETE
  // ============================================
  room_halfway: [
    { id: 'room_half_01', event: 'room_halfway', emotion: 'warm_gentle', text: { en: "You're halfway. Let's keep the rhythm steady.", vi: "Bạn đã đi được nửa đường. Hãy giữ nhịp thật đều." } },
    { id: 'room_half_02', event: 'room_halfway', emotion: 'excited_proud', text: { en: "Nice! You've passed the tricky parts.", vi: "Tốt lắm! Bạn đã vượt qua phần khó rồi." } },
    { id: 'room_half_03', event: 'room_halfway', emotion: 'reassuring', text: { en: "If the middle feels messy, that's normal. Keep going.", vi: "Nếu đoạn giữa hơi rối, điều đó là bình thường. Tiếp tục nhé." } },
    { id: 'room_half_04', event: 'room_halfway', emotion: 'warm_gentle', text: { en: "Halfway means momentum. Don't break it.", vi: "Nửa đường nghĩa là bạn đang có đà. Đừng để đà mất đi." } },
    { id: 'room_half_05', event: 'room_halfway', emotion: 'playful', text: { en: "The finish line is flirting with you.", vi: "Vạch đích đang lấp ló trêu bạn kìa." } },
    { id: 'room_half_06', event: 'room_halfway', emotion: 'reassuring', text: { en: "If something felt unclear, we can revisit it later.", vi: "Nếu có gì chưa rõ, lát nữa mình xem lại cũng được." } },
    { id: 'room_half_07', event: 'room_halfway', emotion: 'warm_gentle', text: { en: "Halfway is the perfect time to breathe once.", vi: "Nửa đường là lúc tuyệt vời để hít một hơi thật nhẹ." } },
    { id: 'room_half_08', event: 'room_halfway', emotion: 'excited_proud', text: { en: "You're doing beautifully. Let's finish strong.", vi: "Bạn đang làm rất tốt. Cùng kết thúc thật mạnh mẽ nhé." } },
    { id: 'room_half_09', event: 'room_halfway', emotion: 'warm_gentle', text: { en: "The second half will feel smoother.", vi: "Nửa sau sẽ trôi mượt hơn." } },
    { id: 'room_half_10', event: 'room_halfway', emotion: 'playful', text: { en: "Your brain is warmed up now. Let's glide.", vi: "Não bạn đã nóng máy rồi. Giờ lướt nhé." } },
    { id: 'room_half_11', event: 'room_halfway', emotion: 'reassuring', text: { en: "No need to hurry. Precision grows from calm steps.", vi: "Không cần vội. Sự chính xác đến từ những bước bình tĩnh." } },
    { id: 'room_half_12', event: 'room_halfway', emotion: 'warm_gentle', text: { en: "Look how far you've come in this room already.", vi: "Nhìn xem bạn đã đi xa thế nào trong phòng này rồi." } },
    { id: 'room_half_13', event: 'room_halfway', emotion: 'excited_proud', text: { en: "Strong work so far. Let's keep that energy.", vi: "Bạn làm rất tốt. Giữ nguyên năng lượng đó nhé." } },
    { id: 'room_half_14', event: 'room_halfway', emotion: 'warm_gentle', text: { en: "Small steps brought you here. Small steps will finish it.", vi: "Những bước nhỏ đã đưa bạn đến đây. Chúng cũng sẽ đưa bạn đến đích." } },
    { id: 'room_half_15', event: 'room_halfway', emotion: 'reassuring', text: { en: "If you feel tired, we'll slow down without stopping.", vi: "Nếu bạn mệt, mình giảm tốc nhưng không dừng lại nhé." } },
    { id: 'room_half_16', event: 'room_halfway', emotion: 'playful', text: { en: "Halfway heroes don't quit.", vi: "Anh hùng nửa đường sẽ không bỏ cuộc đâu." } },
    { id: 'room_half_17', event: 'room_halfway', emotion: 'warm_gentle', text: { en: "You're absorbing more than you think.", vi: "Bạn đang hấp thụ nhiều hơn bạn nghĩ đấy." } },
    { id: 'room_half_18', event: 'room_halfway', emotion: 'reassuring', text: { en: "If something felt difficult, it's passing now.", vi: "Nếu có gì khó, giờ nó đang dần qua rồi." } },
    { id: 'room_half_19', event: 'room_halfway', emotion: 'excited_proud', text: { en: "Momentum is on your side. Keep flowing.", vi: "Đà đang đứng về phía bạn. Cứ thế mà tiếp tục nhé." } },
    { id: 'room_half_20', event: 'room_halfway', emotion: 'warm_gentle', text: { en: "Let's finish this room with softness, not force.", vi: "Hãy hoàn thành phòng này bằng sự nhẹ nhàng, không phải gượng ép." } },
    // --- INSERT NEW room_halfway MESSAGES ABOVE THIS LINE ---
  ],

  // ============================================
  // ROOM COMPLETE (20 lines) ✅ COMPLETE
  // ============================================
  room_complete: [
    { id: 'room_complete_01', event: 'room_complete', emotion: 'excited_proud', text: { en: "You finished the room—beautiful work. Let that sink in.", vi: "Bạn đã hoàn thành phòng này—tuyệt vời. Hãy để cảm giác ấy lan tỏa." } },
    { id: 'room_complete_02', event: 'room_complete', emotion: 'excited_proud', text: { en: "Strong finish! Your brain just stored something new.", vi: "Kết thúc tuyệt vời! Não bạn vừa lưu thêm điều mới." } },
    { id: 'room_complete_03', event: 'room_complete', emotion: 'warm_gentle', text: { en: "Take a breath. You did that with patience and focus.", vi: "Hít một hơi. Bạn vừa làm điều đó bằng sự kiên nhẫn và tập trung." } },
    { id: 'room_complete_04', event: 'room_complete', emotion: 'excited_proud', text: { en: "Another brick in your English foundation—well done.", vi: "Một viên gạch nữa trong nền tảng tiếng Anh của bạn—tốt lắm." } },
    { id: 'room_complete_05', event: 'room_complete', emotion: 'playful', text: { en: "Look at you finishing rooms like a pro.", vi: "Nhìn bạn hoàn thành phòng như dân chuyên kìa." } },
    { id: 'room_complete_06', event: 'room_complete', emotion: 'warm_gentle', text: { en: "Let this success stay in your chest for a second.", vi: "Hãy để cảm giác thành công này ở lại trong ngực bạn một chút." } },
    { id: 'room_complete_07', event: 'room_complete', emotion: 'excited_proud', text: { en: "Done! Your consistency is showing.", vi: "Xong rồi! Sự đều đặn của bạn đang lộ rõ." } },
    { id: 'room_complete_08', event: 'room_complete', emotion: 'warm_gentle', text: { en: "You handled the hard parts with calm. Impressive.", vi: "Bạn đã xử lý phần khó bằng sự bình tĩnh. Ấn tượng đấy." } },
    { id: 'room_complete_09', event: 'room_complete', emotion: 'excited_proud', text: { en: "This is real progress—felt or not.", vi: "Đây là tiến bộ thật—dù bạn có cảm thấy hay chưa." } },
    { id: 'room_complete_10', event: 'room_complete', emotion: 'playful', text: { en: "Room demolished. Next?", vi: "Phòng này bị bạn "phá đảo" rồi. Tiếp theo chứ?" } },
    { id: 'room_complete_11', event: 'room_complete', emotion: 'warm_gentle', text: { en: "Take a small pause. Let the learning settle.", vi: "Tạm dừng một chút. Để kiến thức thấm vào nhé." } },
    { id: 'room_complete_12', event: 'room_complete', emotion: 'excited_proud', text: { en: "You're building something strong inside yourself.", vi: "Bạn đang xây dựng một điều mạnh mẽ bên trong mình." } },
    { id: 'room_complete_13', event: 'room_complete', emotion: 'playful', text: { en: "You finished it smoother than you think.", vi: "Bạn hoàn thành còn mượt hơn bạn tưởng đó." } },
    { id: 'room_complete_14', event: 'room_complete', emotion: 'warm_gentle', text: { en: "Good work. Rest your mind for a moment.", vi: "Làm tốt lắm. Cho tâm trí nghỉ một chút nhé." } },
    { id: 'room_complete_15', event: 'room_complete', emotion: 'excited_proud', text: { en: "Victory. Quiet, but very real.", vi: "Chiến thắng. Lặng lẽ nhưng rất thật." } },
    { id: 'room_complete_16', event: 'room_complete', emotion: 'warm_gentle', text: { en: "Your English grew a little right here.", vi: "Tiếng Anh của bạn vừa lớn thêm một chút ngay tại đây." } },
    { id: 'room_complete_17', event: 'room_complete', emotion: 'reassuring', text: { en: "Even if it felt messy, finishing matters.", vi: "Dù có hơi rối, hoàn thành mới là điều quan trọng." } },
    { id: 'room_complete_18', event: 'room_complete', emotion: 'excited_proud', text: { en: "Great job staying with it to the end.", vi: "Bạn đã làm rất tốt khi theo tới cuối." } },
    { id: 'room_complete_19', event: 'room_complete', emotion: 'warm_gentle', text: { en: "Be proud of this moment. It counts.", vi: "Hãy tự hào về khoảnh khắc này. Nó rất có giá trị." } },
    { id: 'room_complete_20', event: 'room_complete', emotion: 'playful', text: { en: "Finished! Your brain did a little dance just now.", vi: "Xong rồi! Não bạn vừa nhảy một điệu nhỏ đấy." } },
    // --- INSERT NEW room_complete MESSAGES ABOVE THIS LINE ---
  ],

  // ============================================
  // SHADOW START (20 lines) ✅ COMPLETE
  // ============================================
  shadow_start: [
    { id: 'shadow_start_01', event: 'shadow_start', emotion: 'warm_gentle', text: { en: "Let's warm your voice. No pressure—just echo me.", vi: "Cùng làm ấm giọng bạn nhé. Không áp lực—chỉ cần lặp theo mình." } },
    { id: 'shadow_start_02', event: 'shadow_start', emotion: 'playful', text: { en: "Ready to let your tongue dance a bit?", vi: "Sẵn sàng cho chiếc lưỡi nhảy múa chút chưa?" } },
    { id: 'shadow_start_03', event: 'shadow_start', emotion: 'warm_gentle', text: { en: "Shadowing works best when you relax your throat.", vi: "Shadowing hiệu quả nhất khi bạn thả lỏng cổ họng." } },
    { id: 'shadow_start_04', event: 'shadow_start', emotion: 'calm_firm', text: { en: "Listen once. Then we speak together.", vi: "Nghe một lần. Rồi chúng ta nói cùng nhau." } },
    { id: 'shadow_start_05', event: 'shadow_start', emotion: 'warm_gentle', text: { en: "You don't need to be loud—just accurate.", vi: "Không cần nói to—chỉ cần chính xác." } },
    { id: 'shadow_start_06', event: 'shadow_start', emotion: 'playful', text: { en: "Let's stretch your pronunciation muscles.", vi: "Kéo giãn cơ phát âm một chút nhé." } },
    { id: 'shadow_start_07', event: 'shadow_start', emotion: 'warm_gentle', text: { en: "Shadowing sharpens rhythm. Let's tune yours.", vi: "Shadowing giúp sắc bén nhịp điệu. Cùng chỉnh nhịp của bạn nhé." } },
    { id: 'shadow_start_08', event: 'shadow_start', emotion: 'reassuring', text: { en: "If it feels awkward at first, that's perfect.", vi: "Nếu ban đầu thấy gượng gạo, như vậy là đúng đấy." } },
    { id: 'shadow_start_09', event: 'shadow_start', emotion: 'warm_gentle', text: { en: "Just follow the sound. Your mouth will learn the path.", vi: "Chỉ cần theo âm thanh. Miệng bạn sẽ tự học đường đi." } },
    { id: 'shadow_start_10', event: 'shadow_start', emotion: 'playful', text: { en: "Let's give your pronunciation a tiny workout.", vi: "Cho phát âm của bạn tập thể dục nhẹ nhé." } },
    { id: 'shadow_start_11', event: 'shadow_start', emotion: 'warm_gentle', text: { en: "Let your voice soften. Then follow mine.", vi: "Hãy để giọng bạn mềm xuống. Rồi đi theo mình." } },
    { id: 'shadow_start_12', event: 'shadow_start', emotion: 'reassuring', text: { en: "It's okay if you stumble. That's part of shadowing.", vi: "Vấp một chút cũng không sao. Đó là một phần của shadowing." } },
    { id: 'shadow_start_13', event: 'shadow_start', emotion: 'calm_firm', text: { en: "Stay with the rhythm more than the words.", vi: "Hãy bám nhịp nhiều hơn là bám chữ." } },
    { id: 'shadow_start_14', event: 'shadow_start', emotion: 'warm_gentle', text: { en: "Let's move your mouth the English way.", vi: "Cùng di chuyển miệng theo kiểu tiếng Anh nhé." } },
    { id: 'shadow_start_15', event: 'shadow_start', emotion: 'playful', text: { en: "Don't worry, your tongue will catch up.", vi: "Đừng lo, lưỡi bạn sẽ theo kịp ngay thôi." } },
    { id: 'shadow_start_16', event: 'shadow_start', emotion: 'warm_gentle', text: { en: "Shadowing is muscle training. Let's train softly.", vi: "Shadowing là tập cơ. Chúng ta tập nhẹ nhàng thôi." } },
    { id: 'shadow_start_17', event: 'shadow_start', emotion: 'reassuring', text: { en: "Your voice may feel shy. It opens with practice.", vi: "Giọng bạn có thể hơi ngại. Nó sẽ mở ra khi luyện tập." } },
    { id: 'shadow_start_18', event: 'shadow_start', emotion: 'warm_gentle', text: { en: "Even small attempts here build big fluency later.", vi: "Dù cố gắng nhỏ cũng tạo ra sự trôi chảy lớn sau này." } },
    { id: 'shadow_start_19', event: 'shadow_start', emotion: 'playful', text: { en: "Let's wake your speaking engine gently.", vi: "Cùng đánh thức động cơ nói của bạn thật nhẹ nhàng." } },
    { id: 'shadow_start_20', event: 'shadow_start', emotion: 'warm_gentle', text: { en: "We'll go slow first, then flow naturally.", vi: "Ta đi chậm trước, rồi sẽ trôi chảy tự nhiên." } },
    // --- INSERT NEW shadow_start MESSAGES ABOVE THIS LINE ---
  ],

  // ============================================
  // SHADOW ATTEMPT GOOD (18 lines) ✅ COMPLETE
  // ============================================
  shadow_attempt_good: [
    { id: 'sag_1', event: 'shadow_attempt_good', emotion: 'excited_proud', text: { en: "Great shadowing! Your pronunciation is improving.", vi: "Shadowing tốt lắm! Phát âm của bạn đang tiến bộ." } },
    { id: 'sag_2', event: 'shadow_attempt_good', emotion: 'excited_proud', text: { en: "Well done! Your voice matches the rhythm.", vi: "Làm tốt lắm! Giọng bạn khớp với nhịp." } },
    { id: 'sag_3', event: 'shadow_attempt_good', emotion: 'playful', text: { en: "That sounded natural! Keep it up.", vi: "Nghe tự nhiên lắm! Tiếp tục nhé." } },
    { id: 'shadow_good_01', event: 'shadow_attempt_good', emotion: 'excited_proud', text: { en: "That sounded smoother. Your mouth is learning the path.", vi: "Vừa rồi nghe mượt hơn. Miệng bạn đang học đúng đường đi." } },
    { id: 'shadow_good_02', event: 'shadow_attempt_good', emotion: 'warm_gentle', text: { en: "Nice. Feel how the rhythm is clearer now?", vi: "Hay lắm. Bạn thấy nhịp rõ hơn chưa?" } },
    { id: 'shadow_good_03', event: 'shadow_attempt_good', emotion: 'playful', text: { en: "Your tongue just leveled up a little.", vi: "Lưỡi của bạn vừa lên level một chút rồi đó." } },
    { id: 'shadow_good_04', event: 'shadow_attempt_good', emotion: 'excited_proud', text: { en: "Great echo. You matched the music of the sentence.", vi: "Bạn lặp lại rất tốt. Bạn vừa bắt đúng nhạc của câu đó." } },
    { id: 'shadow_good_05', event: 'shadow_attempt_good', emotion: 'warm_gentle', text: { en: "Your voice followed closely. That's real progress.", vi: "Giọng bạn bám rất sát. Đó là tiến bộ thật sự." } },
    { id: 'shadow_good_06', event: 'shadow_attempt_good', emotion: 'excited_proud', text: { en: "Beautiful. Your mouth and ear are starting to cooperate.", vi: "Rất đẹp. Miệng và tai bạn đang bắt đầu phối hợp rồi." } },
    { id: 'shadow_good_07', event: 'shadow_attempt_good', emotion: 'playful', text: { en: "That attempt had real confidence in it.", vi: "Lần nói vừa rồi có sự tự tin thật sự đấy." } },
    { id: 'shadow_good_08', event: 'shadow_attempt_good', emotion: 'warm_gentle', text: { en: "You hit most of the sounds. We'll polish the rest.", vi: "Bạn đã chạm được hầu hết âm. Phần còn lại chúng ta mài dần." } },
    { id: 'shadow_good_09', event: 'shadow_attempt_good', emotion: 'excited_proud', text: { en: "That was clear enough for a native to understand.", vi: "Vừa rồi đủ rõ để người bản xứ hiểu rồi đó." } },
    { id: 'shadow_good_10', event: 'shadow_attempt_good', emotion: 'warm_gentle', text: { en: "You synced well with the audio. Nice timing.", vi: "Bạn đồng bộ rất tốt với audio. Nhịp rất ổn." } },
    { id: 'shadow_good_11', event: 'shadow_attempt_good', emotion: 'playful', text: { en: "Hear that? That's you sounding more natural.", vi: "Bạn nghe không? Đó là bạn đang nghe tự nhiên hơn đấy." } },
    { id: 'shadow_good_12', event: 'shadow_attempt_good', emotion: 'excited_proud', text: { en: "Smooth. Your pronunciation is waking up.", vi: "Mượt lắm. Phát âm của bạn đang thức dậy rồi." } },
    { id: 'shadow_good_13', event: 'shadow_attempt_good', emotion: 'warm_gentle', text: { en: "You carried the sentence all the way through.", vi: "Bạn đã đưa trọn vẹn câu đó ra khỏi miệng mình." } },
    { id: 'shadow_good_14', event: 'shadow_attempt_good', emotion: 'playful', text: { en: "That was a strong attempt. Want to try it a bit faster?", vi: "Lần đó rất tốt. Muốn thử nhanh hơn chút không?" } },
    { id: 'shadow_good_15', event: 'shadow_attempt_good', emotion: 'warm_gentle', text: { en: "You sounded more relaxed this time. Keep that feeling.", vi: "Lần này nghe bạn thả lỏng hơn. Giữ cảm giác đó nhé." } },
    // --- INSERT NEW shadow_attempt_good MESSAGES ABOVE THIS LINE ---
  ],

  // ============================================
  // SHADOW ATTEMPT BAD (18 lines) ✅ COMPLETE
  // ============================================
  shadow_attempt_bad: [
    { id: 'sab_1', event: 'shadow_attempt_bad', emotion: 'warm_gentle', text: { en: "Good try! Listen again and repeat slowly.", vi: "Cố gắng tốt! Nghe lại và lặp lại chậm hơn." } },
    { id: 'sab_2', event: 'shadow_attempt_bad', emotion: 'warm_gentle', text: { en: "It's okay. Practice makes progress, not perfection.", vi: "Không sao. Luyện tập tạo tiến bộ, không phải hoàn hảo." } },
    { id: 'sab_3', event: 'shadow_attempt_bad', emotion: 'warm_gentle', text: { en: "Let's try that again. Slower this time.", vi: "Thử lại nhé. Chậm hơn lần này." } },
    { id: 'shadow_bad_01', event: 'shadow_attempt_bad', emotion: 'warm_gentle', text: { en: "Messy is okay. Your mouth is still mapping the route.", vi: "Lộn xộn cũng không sao. Miệng bạn vẫn đang vẽ bản đồ đường đi." } },
    { id: 'shadow_bad_02', event: 'shadow_attempt_bad', emotion: 'reassuring', text: { en: "That felt rough, right? Good. That's how training works.", vi: "Cảm giác hơi gồ ghề phải không? Tốt. Tập luyện là như vậy." } },
    { id: 'shadow_bad_03', event: 'shadow_attempt_bad', emotion: 'warm_gentle', text: { en: "Let's slow it down and try a smaller piece.", vi: "Mình giảm tốc độ và chia câu này nhỏ hơn nhé." } },
    { id: 'shadow_bad_04', event: 'shadow_attempt_bad', emotion: 'reassuring', text: { en: "You stumbled, but you didn't stay silent. That matters.", vi: "Bạn có vấp, nhưng bạn không im lặng. Thế là quan trọng lắm rồi." } },
    { id: 'shadow_bad_05', event: 'shadow_attempt_bad', emotion: 'calm_firm', text: { en: "Once more, slowly. Your brain needs a clear signal.", vi: "Làm lại một lần nữa, thật chậm. Não bạn cần tín hiệu rõ ràng." } },
    { id: 'shadow_bad_06', event: 'shadow_attempt_bad', emotion: 'warm_gentle', text: { en: "Some sounds slipped away. We'll catch them together.", vi: "Một vài âm bị trượt mất. Chúng ta sẽ bắt lại cùng nhau." } },
    { id: 'shadow_bad_07', event: 'shadow_attempt_bad', emotion: 'reassuring', text: { en: "This awkward feeling is exactly where growth hides.", vi: "Cảm giác gượng gạo này chính là nơi sự phát triển đang ẩn nấp." } },
    { id: 'shadow_bad_08', event: 'shadow_attempt_bad', emotion: 'calm_firm', text: { en: "Stay with me. We'll shape the sentence piece by piece.", vi: "Ở lại với mình. Ta sẽ chỉnh từng phần của câu này." } },
    { id: 'shadow_bad_09', event: 'shadow_attempt_bad', emotion: 'warm_gentle', text: { en: "You tried. That's already more than silence.", vi: "Bạn đã thử. Như vậy đã hơn im lặng rất nhiều rồi." } },
    { id: 'shadow_bad_10', event: 'shadow_attempt_bad', emotion: 'reassuring', text: { en: "Don't worry about perfection—just give it one cleaner try.", vi: "Đừng lo về sự hoàn hảo—chỉ cần thử lại gọn gàng hơn một chút." } },
    { id: 'shadow_bad_11', event: 'shadow_attempt_bad', emotion: 'calm_firm', text: { en: "Let's cut the sentence in half and master the first part.", vi: "Chia câu này làm đôi và làm chủ phần đầu trước nhé." } },
    { id: 'shadow_bad_12', event: 'shadow_attempt_bad', emotion: 'warm_gentle', text: { en: "Your tongue is confused, not broken.", vi: "Lưỡi bạn chỉ đang bối rối, không phải hỏng đâu." } },
    { id: 'shadow_bad_13', event: 'shadow_attempt_bad', emotion: 'reassuring', text: { en: "This is the ugly middle of learning. We pass through it, not around it.", vi: "Đây là đoạn giữa xấu xí của việc học. Ta đi xuyên qua nó, không vòng tránh." } },
    { id: 'shadow_bad_14', event: 'shadow_attempt_bad', emotion: 'calm_firm', text: { en: "One more attempt, but kinder to yourself.", vi: "Thử thêm lần nữa, nhưng hãy nhẹ với bản thân hơn." } },
    { id: 'shadow_bad_15', event: 'shadow_attempt_bad', emotion: 'warm_gentle', text: { en: "You're allowed to sound bad on the way to sounding good.", vi: "Bạn được phép nói dở trên đường đi tới chỗ nói hay." } },
    // --- INSERT NEW shadow_attempt_bad MESSAGES ABOVE THIS LINE ---
  ],

  shadow_attempt_bad_3plus: [
    { id: 'sab3_1', event: 'shadow_attempt_bad_3plus', emotion: 'calm_firm', text: { en: "Let's pause and focus on just the first few words.", vi: "Hãy dừng lại và tập trung vào vài từ đầu thôi." } },
    { id: 'sab3_2', event: 'shadow_attempt_bad_3plus', emotion: 'calm_firm', text: { en: "Slow down. One sound at a time.", vi: "Chậm lại. Từng âm một thôi." } },
    { id: 'sab3_3', event: 'shadow_attempt_bad_3plus', emotion: 'reassuring', text: { en: "This is tough, but you're building real skill.", vi: "Khó đấy, nhưng bạn đang xây dựng kỹ năng thực sự." } },
    // --- INSERT NEW shadow_attempt_bad_3plus MESSAGES ABOVE THIS LINE ---
  ],

  // ============================================
  // SHADOW SESSION COMPLETE (12 lines) ✅ COMPLETE
  // ============================================
  shadow_session_complete: [
    { id: 'ssc_1', event: 'shadow_session_complete', emotion: 'excited_proud', text: { en: "Shadow session complete! Your speaking grows stronger.", vi: "Hoàn thành buổi shadow! Kỹ năng nói mạnh hơn rồi." } },
    { id: 'ssc_2', event: 'shadow_session_complete', emotion: 'excited_proud', text: { en: "Well done! Regular shadow practice builds fluency.", vi: "Làm tốt lắm! Luyện shadow đều đặn xây dựng sự lưu loát." } },
    { id: 'shadow_done_01', event: 'shadow_session_complete', emotion: 'excited_proud', text: { en: "Shadowing session done. Your speaking muscles worked well.", vi: "Buổi shadowing xong rồi. Các cơ nói của bạn đã hoạt động rất tốt." } },
    { id: 'shadow_done_02', event: 'shadow_session_complete', emotion: 'warm_gentle', text: { en: "Nice effort. Your mouth is a bit more used to English now.", vi: "Bạn đã cố gắng rất tốt. Miệng bạn giờ quen tiếng Anh hơn một chút rồi." } },
    { id: 'shadow_done_03', event: 'shadow_session_complete', emotion: 'excited_proud', text: { en: "You stayed with the audio until the end. That's real discipline.", vi: "Bạn đã theo audio tới cuối. Đó là sự kỷ luật thật sự." } },
    { id: 'shadow_done_04', event: 'shadow_session_complete', emotion: 'warm_gentle', text: { en: "Let your throat rest. It worked hard for you.", vi: "Hãy cho cổ họng nghỉ chút. Nó vừa làm việc rất chăm chỉ cho bạn." } },
    { id: 'shadow_done_05', event: 'shadow_session_complete', emotion: 'playful', text: { en: "Your voice just did a mini workout. High five.", vi: "Giọng bạn vừa tập gym mini xong. Đập tay cái nào." } },
    { id: 'shadow_done_06', event: 'shadow_session_complete', emotion: 'warm_gentle', text: { en: "Every finished shadow session makes natural speech easier later.", vi: "Mỗi buổi shadow xong đều khiến việc nói tự nhiên dễ hơn về sau." } },
    { id: 'shadow_done_07', event: 'shadow_session_complete', emotion: 'excited_proud', text: { en: "Good job staying through the awkward parts.", vi: "Bạn đã làm rất tốt khi đi qua cả những đoạn gượng gạo." } },
    { id: 'shadow_done_08', event: 'shadow_session_complete', emotion: 'warm_gentle', text: { en: "Your ears and tongue got a little closer today.", vi: "Tai và lưỡi của bạn đã gần nhau hơn thêm chút nữa hôm nay." } },
    { id: 'shadow_done_09', event: 'shadow_session_complete', emotion: 'reassuring', text: { en: "Even if it felt weird, finishing the session matters.", vi: "Dù bạn thấy hơi kỳ, hoàn thành buổi tập mới là điều quan trọng." } },
    { id: 'shadow_done_10', event: 'shadow_session_complete', emotion: 'playful', text: { en: "Session complete. Your future self will thank you for this.", vi: "Buổi tập xong rồi. Phiên bản tương lai của bạn sẽ cảm ơn bạn vì điều này." } },
    // --- INSERT NEW shadow_session_complete MESSAGES ABOVE THIS LINE ---
  ],

  // ============================================
  // STREAK EVENTS ✅ COMPLETE
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
    { id: 'streak_keep_01', event: 'streak_continue', emotion: 'excited_proud', text: { en: "Streak alive. Showing up again is powerful.", vi: "Chuỗi ngày học vẫn đang chạy. Việc bạn lại xuất hiện rất có sức mạnh." } },
    { id: 'streak_keep_02', event: 'streak_continue', emotion: 'warm_gentle', text: { en: "Another day, another quiet step forward.", vi: "Thêm một ngày, thêm một bước tiến nhẹ nhàng nữa." } },
    { id: 'streak_keep_03', event: 'streak_continue', emotion: 'excited_proud', text: { en: "You're proving you can be consistent.", vi: "Bạn đang chứng minh mình có thể kiên trì." } },
    { id: 'streak_keep_04', event: 'streak_continue', emotion: 'warm_gentle', text: { en: "Your habit is more important than today's performance.", vi: "Thói quen của bạn quan trọng hơn việc hôm nay làm được bao nhiêu." } },
    { id: 'streak_keep_05', event: 'streak_continue', emotion: 'playful', text: { en: "Look at you protecting your streak.", vi: "Nhìn bạn đang bảo vệ chuỗi ngày học của mình kìa." } },
    { id: 'streak_keep_06', event: 'streak_continue', emotion: 'warm_gentle', text: { en: "Tiny daily effort beats huge rare effort.", vi: "Cố gắng nhỏ mỗi ngày thắng nỗ lực khổng lồ nhưng thỉnh thoảng." } },
    { id: 'streak_keep_07', event: 'streak_continue', emotion: 'excited_proud', text: { en: "This is how real English growth looks: quiet, repeated.", vi: "Đây là cách tiếng Anh thực sự phát triển: lặng lẽ và lặp lại." } },
    { id: 'streak_keep_08', event: 'streak_continue', emotion: 'warm_gentle', text: { en: "Be proud of showing up, even if you're tired.", vi: "Hãy tự hào vì mình vẫn học, dù hôm nay bạn mệt." } },
    { id: 'streak_keep_09', event: 'streak_continue', emotion: 'playful', text: { en: "Your streak is turning into a real identity.", vi: "Chuỗi ngày học của bạn đang dần trở thành một phần con người bạn." } },
    { id: 'streak_keep_10', event: 'streak_continue', emotion: 'warm_gentle', text: { en: "You're becoming the person who practices, not just dreams.", vi: "Bạn đang trở thành người thực sự luyện tập, không chỉ là người mơ ước." } },
    // --- INSERT NEW streak_continue MESSAGES ABOVE THIS LINE ---
  ],
  streak_break: [
    { id: 'sb_1', event: 'streak_break', emotion: 'reassuring', text: { en: "Streaks can restart. What matters is you're here now.", vi: "Chuỗi ngày có thể bắt đầu lại. Quan trọng là bạn ở đây." } },
    { id: 'streak_break_01', event: 'streak_break', emotion: 'reassuring', text: { en: "You missed a day. That's human. We simply start again.", vi: "Bạn bỏ lỡ một ngày. Điều đó rất con người. Giờ mình bắt đầu lại thôi." } },
    { id: 'streak_break_02', event: 'streak_break', emotion: 'warm_gentle', text: { en: "A broken streak doesn't erase what you learned.", vi: "Chuỗi bị đứt không xóa đi những gì bạn đã học." } },
    { id: 'streak_break_03', event: 'streak_break', emotion: 'reassuring', text: { en: "One gap is okay. What matters is the next step.", vi: "Một khoảng trống không sao. Quan trọng là bước tiếp theo." } },
    { id: 'streak_break_04', event: 'streak_break', emotion: 'warm_gentle', text: { en: "Be kind to yourself. Then give me a few minutes today.", vi: "Hãy nhẹ với bản thân. Rồi cho mình vài phút hôm nay nhé." } },
    { id: 'streak_break_05', event: 'streak_break', emotion: 'calm_firm', text: { en: "Let's not turn one missed day into ten.", vi: "Đừng để một ngày bỏ lỡ biến thành mười ngày." } },
    { id: 'streak_break_06', event: 'streak_break', emotion: 'reassuring', text: { en: "You're allowed to pause. You're also allowed to return.", vi: "Bạn được phép tạm dừng. Và bạn cũng được phép quay lại." } },
    { id: 'streak_break_07', event: 'streak_break', emotion: 'warm_gentle', text: { en: "Your English didn't disappear. It's just waiting for you.", vi: "Tiếng Anh của bạn không biến mất. Nó chỉ đang chờ bạn thôi." } },
    { id: 'streak_break_08', event: 'streak_break', emotion: 'reassuring', text: { en: "Falling off is normal. Standing up again is special.", vi: "Vấp ngã là chuyện bình thường. Đứng dậy lại mới là điều đặc biệt." } },
    { id: 'streak_break_09', event: 'streak_break', emotion: 'calm_firm', text: { en: "Let's protect today instead of regretting yesterday.", vi: "Hãy bảo vệ ngày hôm nay thay vì hối tiếc ngày hôm qua." } },
    { id: 'streak_break_10', event: 'streak_break', emotion: 'warm_gentle', text: { en: "You can always start again softer than before.", vi: "Bạn luôn có thể bắt đầu lại một cách nhẹ nhàng hơn trước." } },
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
    { id: 'streak_back_01', event: 'streak_comeback_long', emotion: 'reassuring', text: { en: "You came back after a long break. That's brave.", vi: "Bạn đã quay lại sau một thời gian dài. Điều đó rất dũng cảm." } },
    { id: 'streak_back_02', event: 'streak_comeback_long', emotion: 'warm_gentle', text: { en: "I'm genuinely happy to see you here again.", vi: "Mình thật sự rất vui khi thấy bạn ở đây lần nữa." } },
    { id: 'streak_back_03', event: 'streak_comeback_long', emotion: 'reassuring', text: { en: "We don't need to catch up. We just need to continue.", vi: "Chúng ta không cần "đuổi kịp". Chỉ cần tiếp tục thôi." } },
    { id: 'streak_back_04', event: 'streak_comeback_long', emotion: 'warm_gentle', text: { en: "Let's restart with something light and kind.", vi: "Cùng bắt đầu lại bằng điều gì đó nhẹ nhàng và tử tế nhé." } },
    { id: 'streak_back_05', event: 'streak_comeback_long', emotion: 'excited_proud', text: { en: "Coming back after disappearing is a big win.", vi: "Biến mất một thời gian rồi trở lại là một chiến thắng lớn." } },
    { id: 'streak_back_06', event: 'streak_comeback_long', emotion: 'reassuring', text: { en: "It's okay if you feel rusty. We'll warm up together.", vi: "Cảm thấy "rỉ sét" cũng không sao. Mình cùng hâm nóng lại nhé." } },
    { id: 'streak_back_07', event: 'streak_comeback_long', emotion: 'warm_gentle', text: { en: "Your old progress is still inside you.", vi: "Những tiến bộ cũ vẫn còn trong bạn." } },
    { id: 'streak_back_08', event: 'streak_comeback_long', emotion: 'reassuring', text: { en: "We'll rebuild the habit with tiny, safe steps.", vi: "Chúng ta sẽ xây lại thói quen bằng những bước thật nhỏ và an toàn." } },
    { id: 'streak_back_09', event: 'streak_comeback_long', emotion: 'warm_gentle', text: { en: "Thank you for not giving up on your English.", vi: "Cảm ơn bạn vì đã không bỏ cuộc với tiếng Anh của mình." } },
    { id: 'streak_back_10', event: 'streak_comeback_long', emotion: 'excited_proud', text: { en: "This comeback says a lot about who you are.", vi: "Lần quay lại này nói lên rất nhiều điều tốt đẹp về con người bạn." } },
    // --- INSERT NEW streak_comeback_long MESSAGES ABOVE THIS LINE ---
  ],

  // ============================================
  // USER STATES ✅ COMPLETE
  // ============================================
  user_confused: [
    { id: 'uc_1', event: 'user_confused', emotion: 'calm_firm', text: { en: "Confused? That's okay. Let's break this down.", vi: "Bối rối? Không sao. Hãy chia nhỏ ra." } },
    { id: 'uc_2', event: 'user_confused', emotion: 'calm_firm', text: { en: "Let me explain that differently.", vi: "Để mình giải thích khác đi." } },
    { id: 'confused_01', event: 'user_confused', emotion: 'reassuring', text: { en: "Good. Confusion means your brain just met something new.", vi: "Tốt. Bối rối nghĩa là não bạn vừa gặp điều mới." } },
    { id: 'confused_02', event: 'user_confused', emotion: 'warm_gentle', text: { en: "Let's break this idea into smaller pieces together.", vi: "Cùng chia nhỏ ý này ra từng phần nhé." } },
    { id: 'confused_03', event: 'user_confused', emotion: 'reassuring', text: { en: "You're not 'bad at English'. You're just at the edge of your level.", vi: "Bạn không "dở tiếng Anh". Bạn chỉ đang đứng ở rìa trình độ hiện tại thôi." } },
    { id: 'confused_04', event: 'user_confused', emotion: 'warm_gentle', text: { en: "We can slow the sentence down until you see its shape.", vi: "Ta có thể làm câu này chậm lại cho tới khi bạn thấy rõ cấu trúc của nó." } },
    { id: 'confused_05', event: 'user_confused', emotion: 'reassuring', text: { en: "Your confusion is a sign you're in the learning zone.", vi: "Cảm giác bối rối là dấu hiệu cho thấy bạn đang ở vùng học tập." } },
    { id: 'confused_06', event: 'user_confused', emotion: 'warm_gentle', text: { en: "Let's ask: which part is unclear—word, grammar, or meaning?", vi: "Mình hỏi nhé: phần nào chưa rõ—từ vựng, ngữ pháp hay ý nghĩa?" } },
    { id: 'confused_07', event: 'user_confused', emotion: 'reassuring', text: { en: "It's safe to not understand something on the first try.", vi: "Không hiểu ngay lần đầu là chuyện rất bình thường." } },
    { id: 'confused_08', event: 'user_confused', emotion: 'warm_gentle', text: { en: "We'll use examples until the concept feels simple.", vi: "Chúng ta sẽ dùng ví dụ cho tới khi khái niệm này trở nên đơn giản." } },
    { id: 'confused_09', event: 'user_confused', emotion: 'reassuring', text: { en: "You're allowed to ask 'Why?' as many times as you need.", vi: "Bạn được phép hỏi "Tại sao?" bao nhiêu lần cũng được." } },
    { id: 'confused_10', event: 'user_confused', emotion: 'warm_gentle', text: { en: "Stay with the question. The answer will grow clearer.", vi: "Hãy ở lại với câu hỏi. Câu trả lời sẽ dần rõ ràng." } },
    // --- INSERT NEW user_confused MESSAGES ABOVE THIS LINE ---
  ],
  user_low_energy: [
    { id: 'ule_1', event: 'user_low_energy', emotion: 'reassuring', text: { en: "Low energy today? Even small steps count.", vi: "Hôm nay mệt? Bước nhỏ vẫn có giá trị." } },
    { id: 'ule_2', event: 'user_low_energy', emotion: 'reassuring', text: { en: "Take it easy. Learning is a marathon.", vi: "Nhẹ nhàng thôi. Học là chặng đường dài." } },
    { id: 'low_energy_01', event: 'user_low_energy', emotion: 'warm_gentle', text: { en: "You're tired. Let's do a tiny version of today's practice.", vi: "Bạn đang mệt. Hôm nay mình làm phiên bản siêu nhỏ nhé." } },
    { id: 'low_energy_02', event: 'user_low_energy', emotion: 'reassuring', text: { en: "Two honest minutes are enough when your energy is low.", vi: "Khi bạn kiệt sức, hai phút luyện thật lòng cũng đã đủ." } },
    { id: 'low_energy_03', event: 'user_low_energy', emotion: 'warm_gentle', text: { en: "We can switch to lighter content but keep the habit alive.", vi: "Ta có thể dùng nội dung nhẹ hơn nhưng vẫn giữ thói quen sống." } },
    { id: 'low_energy_04', event: 'user_low_energy', emotion: 'reassuring', text: { en: "You showed up even tired—that's a strong sign of commitment.", vi: "Bạn vẫn học dù đang mệt—đó là dấu hiệu cam kết rất mạnh." } },
    { id: 'low_energy_05', event: 'user_low_energy', emotion: 'warm_gentle', text: { en: "We'll focus on listening more than speaking today.", vi: "Hôm nay mình thiên về nghe nhiều hơn nói nhé." } },
    { id: 'low_energy_06', event: 'user_low_energy', emotion: 'reassuring', text: { en: "Your future self will thank you for this small effort.", vi: "Phiên bản tương lai của bạn sẽ biết ơn nỗ lực nhỏ này." } },
    { id: 'low_energy_07', event: 'user_low_energy', emotion: 'warm_gentle', text: { en: "We can stop early, but let's at least touch English once.", vi: "Ta có thể dừng sớm, nhưng ít nhất hãy chạm vào tiếng Anh một lần." } },
    { id: 'low_energy_08', event: 'user_low_energy', emotion: 'reassuring', text: { en: "Low-energy days are part of a long journey, not a failure.", vi: "Những ngày kiệt sức là một phần của hành trình dài, không phải thất bại." } },
    { id: 'low_energy_09', event: 'user_low_energy', emotion: 'warm_gentle', text: { en: "Let's pick one small thing and do only that.", vi: "Chọn một việc thật nhỏ và chỉ làm đúng việc đó thôi." } },
    { id: 'low_energy_10', event: 'user_low_energy', emotion: 'reassuring', text: { en: "You don't need intensity today—just a gentle touch.", vi: "Hôm nay bạn không cần cố mạnh—chỉ cần chạm nhẹ là đủ." } },
    // --- INSERT NEW user_low_energy MESSAGES ABOVE THIS LINE ---
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

  // ============================================
  // PROGRESS MILESTONES ✅ COMPLETE
  // ============================================
  level_up: [
    { id: 'lu_1', event: 'level_up', emotion: 'excited_proud', text: { en: "Level up! Your hard work is paying off.", vi: "Lên level! Công sức của bạn đang được đền đáp." } },
    { id: 'lu_2', event: 'level_up', emotion: 'excited_proud', text: { en: "You've grown! Ready for new challenges.", vi: "Bạn đã phát triển! Sẵn sàng cho thử thách mới." } },
    { id: 'level_up_01', event: 'level_up', emotion: 'excited_proud', text: { en: "You moved up a level. That's a big milestone.", vi: "Bạn đã lên một trình độ mới. Đây là cột mốc rất lớn." } },
    { id: 'level_up_02', event: 'level_up', emotion: 'warm_gentle', text: { en: "Take a moment to feel this. You earned it.", vi: "Hãy dành một chút để cảm nhận. Bạn xứng đáng với điều này." } },
    { id: 'level_up_03', event: 'level_up', emotion: 'excited_proud', text: { en: "Your new level means new doors are open.", vi: "Trình độ mới đồng nghĩa với nhiều cánh cửa mới được mở ra." } },
    { id: 'level_up_04', event: 'level_up', emotion: 'warm_gentle', text: { en: "You're not the same learner who started this journey.", vi: "Bạn không còn là người học giống như lúc mới bắt đầu nữa." } },
    { id: 'level_up_05', event: 'level_up', emotion: 'excited_proud', text: { en: "A higher level also means we can play with harder material.", vi: "Trình độ cao hơn nghĩa là ta có thể "chơi" với nội dung khó hơn." } },
    { id: 'level_up_06', event: 'level_up', emotion: 'warm_gentle', text: { en: "Let's celebrate, then quietly build the next level.", vi: "Ăn mừng một chút, rồi lặng lẽ xây tiếp tầng tiếp theo nhé." } },
    { id: 'level_up_07', event: 'level_up', emotion: 'excited_proud', text: { en: "This is proof that your tiny efforts were never wasted.", vi: "Đây là bằng chứng rằng những nỗ lực nhỏ của bạn chưa bao giờ vô ích." } },
    { id: 'level_up_08', event: 'level_up', emotion: 'warm_gentle', text: { en: "You can trust yourself more now. You've shown what you can do.", vi: "Giờ bạn có thể tin mình hơn. Bạn đã cho thấy mình làm được gì." } },
    { id: 'level_up_09', event: 'level_up', emotion: 'excited_proud', text: { en: "From here, we'll refine, not just climb.", vi: "Từ đây, ta sẽ mài dũa, không chỉ là leo lên." } },
    { id: 'level_up_10', event: 'level_up', emotion: 'warm_gentle', text: { en: "I'm proud of you. Now let's enjoy learning at this new height.", vi: "Mình tự hào về bạn. Giờ cùng tận hưởng việc học ở độ cao mới này nhé." } },
    // --- INSERT NEW level_up MESSAGES ABOVE THIS LINE ---
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
