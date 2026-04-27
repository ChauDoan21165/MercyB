/**
 * Curated 5-minute "today's lesson" entries for the Home page card.
 *
 * Each entry maps a finishable, daily-coach framing onto an existing
 * room in public/data/*.json. We do not author new content here; the
 * card's job is to remove the "what should I do today?" decision and
 * point the learner at one room that fits a 5-minute window.
 *
 * Adding entries: keep the room id matching the JSON filename (without
 * .json). roomId is validated at runtime by the room loader, so a typo
 * surfaces as a 404 — the rotation tests guard against an empty list.
 */

export type DailyLessonEntry = {
  roomId: string;
  title_vi: string;
  title_en: string;
  description_vi: string;
  description_en: string;
  duration_minutes: number;
};

export const DAILY_LESSONS: ReadonlyArray<DailyLessonEntry> = [
  {
    roomId: "grammar_foundations_free",
    title_vi: "Nền tảng ngữ pháp trong 5 phút",
    title_en: "Grammar foundations in 5 minutes",
    description_vi: "Sửa nhanh 5 lỗi ngữ pháp người Việt hay mắc.",
    description_en: "Fix 5 grammar mistakes Vietnamese learners make most.",
    duration_minutes: 5,
  },
  {
    roomId: "productivity_and_focus_free",
    title_vi: "Năng suất & tập trung",
    title_en: "Productivity & focus",
    description_vi: "Học cụm từ tiếng Anh để lập kế hoạch một ngày năng suất.",
    description_en: "English phrases for planning a focused day.",
    duration_minutes: 5,
  },
  {
    roomId: "ai_free",
    title_vi: "Tiếng Anh thời AI",
    title_en: "English in the AI age",
    description_vi: "5 cụm từ bạn cần để nói chuyện về AI ngày hôm nay.",
    description_en: "5 phrases to talk about AI today.",
    duration_minutes: 5,
  },
  {
    roomId: "sleep_improvement_free",
    title_vi: "Tiếng Anh về giấc ngủ",
    title_en: "Sleep & rest English",
    description_vi: "Từ vựng và mẹo nói về giấc ngủ chất lượng.",
    description_en: "Vocabulary and phrases for talking about sleep.",
    duration_minutes: 5,
  },
  {
    roomId: "self_love_free",
    title_vi: "Yêu bản thân — bằng tiếng Anh",
    title_en: "Self-love phrases",
    description_vi: "5 câu nói tiếng Anh giúp bạn tử tế với chính mình.",
    description_en: "5 English phrases to be kinder to yourself.",
    duration_minutes: 5,
  },
  {
    roomId: "social_anxiety_free",
    title_vi: "Vượt qua lo âu xã hội",
    title_en: "Social anxiety: phrases that help",
    description_vi: "Cụm từ tiếng Anh để giữ bình tĩnh trước đám đông.",
    description_en: "English phrases to stay calm in social settings.",
    duration_minutes: 5,
  },
  {
    roomId: "stress_free",
    title_vi: "Giải tỏa căng thẳng",
    title_en: "Stress relief in English",
    description_vi: "5 câu thoại tiếng Anh để giảm áp lực hôm nay.",
    description_en: "5 English lines to release pressure today.",
    duration_minutes: 5,
  },
  {
    roomId: "anxiety_relief_free",
    title_vi: "Thư giãn lo âu",
    title_en: "Anxiety relief phrases",
    description_vi: "Từ ngữ tiếng Anh để tự trấn an khi thấy lo lắng.",
    description_en: "Words to ground yourself when anxious.",
    duration_minutes: 5,
  },
  {
    roomId: "burnout_recovery_free",
    title_vi: "Hồi phục kiệt sức",
    title_en: "Burnout recovery language",
    description_vi: "Cụm từ tiếng Anh để đặt giới hạn và xin nghỉ.",
    description_en: "Phrases to set boundaries and ask for space.",
    duration_minutes: 5,
  },
  {
    roomId: "career_consultant_free",
    title_vi: "Tiếng Anh nghề nghiệp",
    title_en: "Career English",
    description_vi: "5 câu trả lời phỏng vấn ai cũng nên thuộc lòng.",
    description_en: "5 interview answers worth memorizing.",
    duration_minutes: 5,
  },
  {
    roomId: "nutrition_free",
    title_vi: "Dinh dưỡng — tiếng Anh đi siêu thị",
    title_en: "Nutrition & supermarket English",
    description_vi: "Đọc nhãn sản phẩm và đặt hàng bằng tiếng Anh.",
    description_en: "Read food labels and order in English.",
    duration_minutes: 5,
  },
  {
    roomId: "physical_fitness_and_nutrition_free",
    title_vi: "Thể lực & dinh dưỡng",
    title_en: "Fitness & nutrition",
    description_vi: "Tiếng Anh tại phòng gym bạn dùng được ngay.",
    description_en: "Gym English you can use today.",
    duration_minutes: 5,
  },
  {
    roomId: "relationship_healing_free",
    title_vi: "Chữa lành mối quan hệ",
    title_en: "Healing a relationship",
    description_vi: "Cụm từ tiếng Anh để xin lỗi và hàn gắn.",
    description_en: "English phrases to apologize and repair.",
    duration_minutes: 5,
  },
  {
    roomId: "loneliness_comfort_free",
    title_vi: "Vượt qua cô đơn",
    title_en: "Words for loneliness",
    description_vi: "Câu nói tiếng Anh để mở đầu một cuộc trò chuyện.",
    description_en: "English openers to start a real conversation.",
    duration_minutes: 5,
  },
  {
    roomId: "mens_mental_health_free",
    title_vi: "Sức khỏe tinh thần nam giới",
    title_en: "Men's mental health phrases",
    description_vi: "5 câu tiếng Anh để mở lòng mà không ngại.",
    description_en: "5 English lines to open up without shame.",
    duration_minutes: 5,
  },
  {
    roomId: "shadow_work_free",
    title_vi: "Đối diện với bóng tối nội tâm",
    title_en: "Shadow work vocabulary",
    description_vi: "Từ vựng tiếng Anh để tự suy ngẫm trong 5 phút.",
    description_en: "Vocabulary for 5 minutes of self-reflection.",
    duration_minutes: 5,
  },
  {
    roomId: "soulmate_free",
    title_vi: "Bạn tâm giao",
    title_en: "Soulmate phrases",
    description_vi: "Cách nói tiếng Anh về kết nối sâu sắc.",
    description_en: "How to talk about deep connection in English.",
    duration_minutes: 5,
  },
  {
    roomId: "stoicism_free",
    title_vi: "Triết học Khắc kỷ — 5 phút mỗi ngày",
    title_en: "Daily stoicism in English",
    description_vi: "Một câu nói khắc kỷ mỗi ngày, kèm dịch tiếng Việt.",
    description_en: "One stoic line a day, with Vietnamese gloss.",
    duration_minutes: 5,
  },
  {
    roomId: "philosophy_of_everyday_free",
    title_vi: "Triết học đời thường",
    title_en: "Everyday philosophy",
    description_vi: "Một ý tưởng nhỏ để suy nghĩ — bằng tiếng Anh.",
    description_en: "One small idea to think about — in English.",
    duration_minutes: 5,
  },
  {
    roomId: "meaning_of_life_free",
    title_vi: "Ý nghĩa cuộc sống",
    title_en: "Meaning of life — vocabulary",
    description_vi: "Từ vựng tiếng Anh cho những câu hỏi lớn.",
    description_en: "English words for the bigger questions.",
    duration_minutes: 5,
  },
  {
    roomId: "obesity_free",
    title_vi: "Sức khỏe & cân nặng",
    title_en: "Health & weight English",
    description_vi: "Cụm từ tiếng Anh để nói về cân nặng một cách tôn trọng.",
    description_en: "English phrases to talk about weight respectfully.",
    duration_minutes: 5,
  },
  {
    roomId: "ocd_support_free",
    title_vi: "Hỗ trợ OCD",
    title_en: "OCD support phrases",
    description_vi: "Từ ngữ tiếng Anh để tự trấn an mình.",
    description_en: "Words to ground yourself when intrusive thoughts hit.",
    duration_minutes: 5,
  },
  {
    roomId: "ptsd_support_free",
    title_vi: "Hỗ trợ PTSD",
    title_en: "PTSD support phrases",
    description_vi: "Tiếng Anh để cảm thấy an toàn ở hiện tại.",
    description_en: "English phrases for feeling safe in the present.",
    duration_minutes: 5,
  },
  {
    roomId: "grief_healing_free",
    title_vi: "Chữa lành nỗi đau mất mát",
    title_en: "Words for grief",
    description_vi: "Cách nói tiếng Anh khi không biết nói gì.",
    description_en: "English when there are no words.",
    duration_minutes: 5,
  },
  {
    roomId: "addiction_support_free",
    title_vi: "Hồi phục — từng ngày một",
    title_en: "Recovery: one day at a time",
    description_vi: "5 câu tiếng Anh cho những ngày khó khăn.",
    description_en: "5 English phrases for hard days.",
    duration_minutes: 5,
  },
  {
    roomId: "adhd_support_free",
    title_vi: "Tập trung khi có ADHD",
    title_en: "Focus with ADHD",
    description_vi: "Cụm từ tiếng Anh để tự nhắc và sắp xếp lại.",
    description_en: "Phrases to refocus and reset in English.",
    duration_minutes: 5,
  },
  {
    roomId: "eating_disorder_support_free",
    title_vi: "Hỗ trợ rối loạn ăn uống",
    title_en: "Eating recovery phrases",
    description_vi: "5 câu tiếng Anh để tử tế với cơ thể mình.",
    description_en: "5 English phrases to be kind to your body.",
    duration_minutes: 5,
  },
  {
    roomId: "bipolar_support_free",
    title_vi: "Hỗ trợ rối loạn lưỡng cực",
    title_en: "Bipolar support phrases",
    description_vi: "Tiếng Anh để mô tả cảm xúc thay đổi mỗi ngày.",
    description_en: "English to describe shifting moods.",
    duration_minutes: 5,
  },
  {
    roomId: "wealth_wisdom_vip3_preview_free",
    title_vi: "Trí tuệ giàu có",
    title_en: "Wealth wisdom",
    description_vi: "5 cụm từ tiếng Anh xây tư duy tiền bạc.",
    description_en: "5 English phrases that build money mindset.",
    duration_minutes: 5,
  },
  {
    roomId: "weight_loss_and_fitness_free",
    title_vi: "Vận động & giảm cân",
    title_en: "Movement & weight loss",
    description_vi: "Lời tự động viên tiếng Anh để bắt đầu vận động hôm nay.",
    description_en: "English pep talk to move your body today.",
    duration_minutes: 5,
  },
];

/**
 * Static starter lesson for anonymous (signed-out) visitors. We always
 * show the same room here so the experience is predictable and the
 * underlying file is guaranteed to load. Logged-in users get the
 * rotated list above instead.
 */
export const ANONYMOUS_STARTER_LESSON: DailyLessonEntry = {
  roomId: "grammar_foundations_free",
  title_vi: "Bắt đầu với nền tảng ngữ pháp",
  title_en: "Start with grammar foundations",
  description_vi: "Bài học 5 phút phù hợp cho người mới — không cần đăng nhập.",
  description_en: "A 5-minute starter lesson — no signup needed.",
  duration_minutes: 5,
};
