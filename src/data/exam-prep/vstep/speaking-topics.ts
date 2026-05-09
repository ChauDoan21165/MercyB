// src/data/exam-prep/vstep/speaking-topics.ts
//
// VSTEP (Vietnamese Standardized Test of English Proficiency) Speaking
// content pack — B1 + B2 levels.
//
// Format follows the spec issued by the Ministry of Education and Training
// of Vietnam (MoET), Circular 23/2017/TT-BGDĐT, publicly available. The
// Speaking section runs ~12 minutes for B1/B2 and has three parts:
//   Part 1 — Social interaction (~3 min). Examiner asks 3–5 questions
//            on familiar personal topics. Candidate answers in full.
//   Part 2 — Solution discussion (~4 min). Candidate is given a situation
//            with three possible courses of action, picks one, and
//            justifies the choice while comparing against the alternatives.
//   Part 3 — Topic development (~5 min). Candidate gives a longer
//            structured response on a more abstract topic, then handles
//            follow-up questions from the examiner.
//
// All sample questions, tips, vocabulary, and band descriptors in this file
// are **original** — written for MercyBlade based on standard pedagogy +
// the public MoET format spec. None of this is copied from any commercial
// VSTEP prep book. Verbatim re-use of this file requires attribution.
//
// Vietnamese-speaker tips deliberately call out L1-interference patterns
// the rest of the prep market ignores: dropped final consonants, stress
// inversion on multi-syllable words, V-N-V word-order leakage, missing
// articles, plural-s loss, tense flattening, etc.

export type VstepLevel = "B1" | "B2";
export type VstepPart = 1 | 2 | 3;

export interface VstepVocabularyItem {
  word: string;
  translation_vi: string;
  /** IPA pronunciation (Mercy-friendly: General American). */
  pronunciation_ipa: string;
  /** CEFR proficiency at which this word is expected to be active. */
  level: "A2" | "B1" | "B2" | "C1";
}

export interface VstepBandDescriptor {
  band: string;
  criteria_vi: string;
  criteria_en: string;
}

export interface VstepSpeakingTopic {
  id: string;
  level: VstepLevel;
  part: VstepPart;
  topic_title_vi: string;
  topic_title_en: string;
  description_vi: string;
  description_en: string;
  sample_questions: string[];
  vietnamese_speaker_tips: string[];
  key_vocabulary: VstepVocabularyItem[];
  estimated_time_minutes: number;
  typical_band_descriptors: VstepBandDescriptor[];
  /** Supabase storage key for the topic intro narration (vstep-speaking/{id}/intro.mp3). */
  audioIntroKey: string;
  /** Supabase storage keys for each sample question (vstep-speaking/{id}/q1.mp3 …). */
  audioQuestionKeys: string[];
}

// ─────────────────────────────────────────────────────────────────────
// Reused band descriptors — MoET VSTEP rubric simplified into Low/Mid/
// High at each CEFR level. The real marking is more granular (5 bands
// across 4 criteria); these are pedagogical anchors for self-study.
// ─────────────────────────────────────────────────────────────────────

const B1_BAND_DESCRIPTORS: VstepBandDescriptor[] = [
  {
    band: "B1 Low",
    criteria_vi:
      "Trả lời được nhưng còn ngập ngừng, từ vựng cơ bản. Người nghe phải tập trung mới hiểu hết.",
    criteria_en:
      "Responds but with hesitation; basic vocabulary. The listener must concentrate to follow.",
  },
  {
    band: "B1 Mid",
    criteria_vi:
      "Nói được câu trọn vẹn về chủ đề quen thuộc. Có lỗi ngữ pháp nhưng không cản trở giao tiếp. Phát âm hiểu được.",
    criteria_en:
      "Produces complete sentences on familiar topics. Grammar slips don't block meaning. Pronunciation is understandable.",
  },
  {
    band: "B1 High",
    criteria_vi:
      "Nối ý mượt, dùng được liên từ thông dụng (and, but, because, so). Vẫn còn lỗi nhưng tự sửa được.",
    criteria_en:
      "Connects ideas smoothly using common linkers (and, but, because, so). Errors occur but the candidate self-corrects.",
  },
];

const B2_BAND_DESCRIPTORS: VstepBandDescriptor[] = [
  {
    band: "B2 Low",
    criteria_vi:
      "Mở rộng được câu trả lời, dùng được vài cấu trúc B2 nhưng chưa ổn định. Đôi khi quay về cấu trúc B1.",
    criteria_en:
      "Extends answers with some B2 structures, though not consistently. Occasionally falls back to B1 patterns.",
  },
  {
    band: "B2 Mid",
    criteria_vi:
      "Lập luận rõ, dùng được câu phức (relative clauses, conditionals). Phát âm có ngữ điệu, biết nhấn từ quan trọng.",
    criteria_en:
      "Argues clearly using complex sentences (relative clauses, conditionals). Pronunciation has natural intonation and content-word stress.",
  },
  {
    band: "B2 High",
    criteria_vi:
      "Trình bày như thảo luận thật. Dùng linking phức (however, on the other hand, despite). Ít lỗi, lỗi không đổi nghĩa.",
    criteria_en:
      "Speaks like a real discussion. Uses complex connectors (however, on the other hand, despite). Few errors, none affecting meaning.",
  },
];

// ─────────────────────────────────────────────────────────────────────
// Reused tips — appended as common L1-interference notes when relevant
// (not on every topic, only where they fit naturally).
// ─────────────────────────────────────────────────────────────────────

const TIP_FINAL_CONSONANTS =
  "Phát âm rõ phụ âm cuối ('ed', 's', 't', 'd'). Người Việt hay nuốt — VSTEP examiner sẽ trừ điểm phát âm.";
const TIP_PLURAL_S =
  "Đừng quên 's' số nhiều ('two cats', không 'two cat'). Lỗi này lặp lại sẽ kéo điểm Grammar xuống.";
const TIP_ARTICLES =
  "Có 'a/an/the' khi cần — 'I have brother' phải là 'I have a brother'. Người Việt thường bỏ qua.";
const TIP_TENSE =
  "Thì quá khứ phải có 'ed' hoặc dạng bất quy tắc — 'Yesterday I go' phải là 'Yesterday I went'.";

// ─────────────────────────────────────────────────────────────────────
// Topic catalogue
// ─────────────────────────────────────────────────────────────────────

export const VSTEP_SPEAKING_TOPICS: VstepSpeakingTopic[] = [
  // ════════════════════════════════════════════════════════════════
  // B1 — Part 1 (Social interaction, ~3 min, 7 topics)
  // ════════════════════════════════════════════════════════════════
  {
    id: "vstep_b1_speaking_family",
    level: "B1",
    part: 1,
    topic_title_vi: "Gia đình",
    topic_title_en: "Family",
    description_vi:
      "Giới thiệu gia đình bạn: thành viên, công việc của bố mẹ, thói quen cuối tuần.",
    description_en:
      "Introduce your family: members, parents' jobs, weekend habits.",
    sample_questions: [
      "Tell me about your family. How many people are there?",
      "What does your father / mother do for a living?",
      "Are you close to your siblings? Why or why not?",
      "What do you usually do together at the weekend?",
      "Who in your family are you most similar to?",
    ],
    vietnamese_speaker_tips: [
      "Tránh dịch trực tiếp 'My family has 4 people' — người bản xứ nói 'There are 4 of us' hoặc 'My family has four members'.",
      "Đừng gọi 'older brother / younger sister' chung chung — VSTEP cần cụ thể: 'I have an older brother and a younger sister'.",
      TIP_PLURAL_S,
      "Phát âm 'father' /ˈfɑː.ðɚ/ — âm 'th' đẩy lưỡi giữa răng, không phải /f/.",
      "Nói được 1 chi tiết riêng (ví dụ: 'My mother loves cooking phở') sẽ cao điểm hơn câu chung chung.",
    ],
    key_vocabulary: [
      { word: "siblings", translation_vi: "anh chị em ruột", pronunciation_ipa: "/ˈsɪb.lɪŋz/", level: "B1" },
      { word: "close-knit", translation_vi: "gắn bó", pronunciation_ipa: "/ˌkloʊsˈnɪt/", level: "B1" },
      { word: "extended family", translation_vi: "gia đình mở rộng", pronunciation_ipa: "/ɪkˌstɛn.dɪd ˈfæm.ə.li/", level: "B1" },
      { word: "household chores", translation_vi: "việc nhà", pronunciation_ipa: "/ˈhaʊs.hoʊld tʃɔːrz/", level: "B1" },
    ],
    estimated_time_minutes: 3,
    typical_band_descriptors: B1_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b1_speaking_family/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b1_speaking_family/q1.mp3", "vstep-speaking/vstep_b1_speaking_family/q2.mp3", "vstep-speaking/vstep_b1_speaking_family/q3.mp3", "vstep-speaking/vstep_b1_speaking_family/q4.mp3", "vstep-speaking/vstep_b1_speaking_family/q5.mp3"],
  },
  {
    id: "vstep_b1_speaking_hobbies",
    level: "B1",
    part: 1,
    topic_title_vi: "Sở thích",
    topic_title_en: "Hobbies",
    description_vi:
      "Nói về sở thích cá nhân: bạn làm gì khi rảnh, tại sao thích, đã theo sở thích này bao lâu.",
    description_en:
      "Talk about your hobbies: what you do in your free time, why you enjoy it, how long you've had it.",
    sample_questions: [
      "What do you usually do in your free time?",
      "How long have you had this hobby?",
      "Did anyone introduce it to you?",
      "Do you prefer indoor or outdoor activities?",
      "Would you recommend your hobby to other people?",
    ],
    vietnamese_speaker_tips: [
      "Trả lời thì hiện tại đơn ('I usually play badminton'), không 'I am usually play badminton'.",
      "Dùng 'gerund' sau 'enjoy/love/like': 'I enjoy reading' (KHÔNG 'I enjoy to read').",
      "Đừng nói 'my hobby is play guitar' — phải là 'my hobby is playing guitar' hoặc 'I play the guitar'.",
      "Phát âm 'hobby' /ˈhɑː.bi/ — không phải /ˈhɔː.bi/ kiểu Vietnamese-English.",
      "Khi nói thời gian: 'for three years' (khoảng thời gian) khác 'since 2021' (mốc thời gian) — VSTEP examiner để ý chi tiết này.",
    ],
    key_vocabulary: [
      { word: "leisure", translation_vi: "thời gian rảnh", pronunciation_ipa: "/ˈliː.ʒɚ/", level: "B1" },
      { word: "passionate", translation_vi: "đam mê", pronunciation_ipa: "/ˈpæʃ.ən.ət/", level: "B1" },
      { word: "pick up (a hobby)", translation_vi: "bắt đầu (sở thích)", pronunciation_ipa: "/pɪk ʌp/", level: "B1" },
      { word: "stress reliever", translation_vi: "giải tỏa căng thẳng", pronunciation_ipa: "/strɛs rɪˈliː.vɚ/", level: "B1" },
    ],
    estimated_time_minutes: 3,
    typical_band_descriptors: B1_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b1_speaking_hobbies/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b1_speaking_hobbies/q1.mp3", "vstep-speaking/vstep_b1_speaking_hobbies/q2.mp3", "vstep-speaking/vstep_b1_speaking_hobbies/q3.mp3", "vstep-speaking/vstep_b1_speaking_hobbies/q4.mp3", "vstep-speaking/vstep_b1_speaking_hobbies/q5.mp3"],
  },
  {
    id: "vstep_b1_speaking_hometown",
    level: "B1",
    part: 1,
    topic_title_vi: "Quê hương",
    topic_title_en: "Hometown",
    description_vi:
      "Giới thiệu quê hương: vị trí, đặc điểm nổi bật, món ăn nổi tiếng, có gì thay đổi gần đây.",
    description_en:
      "Describe your hometown: location, distinguishing features, famous food, recent changes.",
    sample_questions: [
      "Where is your hometown? What is it famous for?",
      "How has your hometown changed in the past 5–10 years?",
      "What is the best season to visit your hometown?",
      "Would you like to live there in the future, or move somewhere else?",
      "What local food would you recommend a visitor try?",
    ],
    vietnamese_speaker_tips: [
      "'Hometown' là một từ ghép — không nói 'home town' tách ra.",
      "Phát âm /ˈhoʊm.taʊn/ — diphthong 'ow' ở 'home' và /aʊ/ ở 'town'.",
      "Khi mô tả vị trí: 'It's in the north of Vietnam' (KHÔNG 'It's in north of Vietnam').",
      TIP_TENSE,
      "Đừng dịch 'famous about' — đúng là 'famous for' ('famous for its beaches').",
    ],
    key_vocabulary: [
      { word: "bustling", translation_vi: "nhộn nhịp", pronunciation_ipa: "/ˈbʌs.lɪŋ/", level: "B1" },
      { word: "rural", translation_vi: "nông thôn", pronunciation_ipa: "/ˈrʊr.əl/", level: "B1" },
      { word: "specialty (food)", translation_vi: "đặc sản", pronunciation_ipa: "/ˈspɛʃ.əl.ti/", level: "B1" },
      { word: "landmark", translation_vi: "danh thắng", pronunciation_ipa: "/ˈlænd.mɑːrk/", level: "B1" },
    ],
    estimated_time_minutes: 3,
    typical_band_descriptors: B1_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b1_speaking_hometown/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b1_speaking_hometown/q1.mp3", "vstep-speaking/vstep_b1_speaking_hometown/q2.mp3", "vstep-speaking/vstep_b1_speaking_hometown/q3.mp3", "vstep-speaking/vstep_b1_speaking_hometown/q4.mp3", "vstep-speaking/vstep_b1_speaking_hometown/q5.mp3"],
  },
  {
    id: "vstep_b1_speaking_daily_routine",
    level: "B1",
    part: 1,
    topic_title_vi: "Thói quen hàng ngày",
    topic_title_en: "Daily routine",
    description_vi:
      "Một ngày bình thường của bạn: dậy mấy giờ, làm gì sáng/chiều/tối.",
    description_en:
      "A typical day for you: when you wake up, what you do in the morning / afternoon / evening.",
    sample_questions: [
      "What time do you usually wake up on a weekday?",
      "What do you do in the morning before work or school?",
      "Do you take a nap in the afternoon? Why or why not?",
      "How is your weekend routine different from a weekday?",
      "Has your daily routine changed in the past year?",
    ],
    vietnamese_speaker_tips: [
      "Hiện tại đơn cho thói quen: 'I wake up at 6' (KHÔNG 'I am waking up at 6').",
      "'In the morning' / 'at noon' / 'at night' — đúng giới từ, không 'in night' hay 'at morning'.",
      "Đừng nói 'I sleep at 11pm' nếu ý là 'go to bed' — 'sleep' là trạng thái, 'go to bed' là hành động.",
      "Phát âm 'breakfast' /ˈbrɛk.fəst/ — âm /k/ ở giữa, không phải /brek-FAST/.",
      "Adverbs of frequency (always, usually, sometimes) đứng TRƯỚC động từ thường: 'I usually go' (KHÔNG 'I go usually').",
    ],
    key_vocabulary: [
      { word: "commute", translation_vi: "đi lại đến chỗ làm/học", pronunciation_ipa: "/kəˈmjuːt/", level: "B1" },
      { word: "errand", translation_vi: "việc vặt", pronunciation_ipa: "/ˈɛr.ənd/", level: "B1" },
      { word: "wind down", translation_vi: "thư giãn cuối ngày", pronunciation_ipa: "/waɪnd daʊn/", level: "B1" },
      { word: "snooze (the alarm)", translation_vi: "tắt báo thức tạm", pronunciation_ipa: "/snuːz/", level: "B1" },
    ],
    estimated_time_minutes: 3,
    typical_band_descriptors: B1_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b1_speaking_daily_routine/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b1_speaking_daily_routine/q1.mp3", "vstep-speaking/vstep_b1_speaking_daily_routine/q2.mp3", "vstep-speaking/vstep_b1_speaking_daily_routine/q3.mp3", "vstep-speaking/vstep_b1_speaking_daily_routine/q4.mp3", "vstep-speaking/vstep_b1_speaking_daily_routine/q5.mp3"],
  },
  {
    id: "vstep_b1_speaking_food",
    level: "B1",
    part: 1,
    topic_title_vi: "Đồ ăn",
    topic_title_en: "Food",
    description_vi:
      "Sở thích về đồ ăn: món yêu thích, có biết nấu không, ăn ngoài hay ăn nhà nhiều hơn.",
    description_en:
      "Food preferences: favourite dish, cooking ability, eating in vs. eating out.",
    sample_questions: [
      "What is your favourite Vietnamese dish? How is it made?",
      "Do you cook for yourself? How often?",
      "Do you prefer eating at home or going out to restaurants?",
      "Have you tried any foreign food recently?",
      "Is healthy eating important to you? Why?",
    ],
    vietnamese_speaker_tips: [
      "Tên món Việt giữ nguyên tiếng Việt nhưng giải thích: 'Phở — a beef noodle soup'.",
      "'Cook' là động từ, 'cooking' là gerund/danh từ. 'I like cooking' / 'I cook every Sunday'.",
      "Đừng nói 'eat outside' nếu ý là ăn nhà hàng — đúng là 'eat out' hoặc 'dine out'.",
      "Phát âm 'vegetable' /ˈvɛdʒ.tə.bəl/ (3 âm tiết, không 4) — người Việt thường nói /ve-ge-ta-bəl/.",
      TIP_ARTICLES,
    ],
    key_vocabulary: [
      { word: "savoury", translation_vi: "mặn (đối lập sweet)", pronunciation_ipa: "/ˈseɪ.vɚ.i/", level: "B1" },
      { word: "homemade", translation_vi: "tự nấu ở nhà", pronunciation_ipa: "/ˌhoʊmˈmeɪd/", level: "B1" },
      { word: "balanced diet", translation_vi: "chế độ ăn cân bằng", pronunciation_ipa: "/ˈbæl.ənst ˈdaɪ.ət/", level: "B1" },
      { word: "craving", translation_vi: "cơn thèm ăn", pronunciation_ipa: "/ˈkreɪ.vɪŋ/", level: "B1" },
    ],
    estimated_time_minutes: 3,
    typical_band_descriptors: B1_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b1_speaking_food/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b1_speaking_food/q1.mp3", "vstep-speaking/vstep_b1_speaking_food/q2.mp3", "vstep-speaking/vstep_b1_speaking_food/q3.mp3", "vstep-speaking/vstep_b1_speaking_food/q4.mp3", "vstep-speaking/vstep_b1_speaking_food/q5.mp3"],
  },
  {
    id: "vstep_b1_speaking_weather",
    level: "B1",
    part: 1,
    topic_title_vi: "Thời tiết",
    topic_title_en: "Weather",
    description_vi:
      "Thời tiết nơi bạn sống: mùa, cảm nhận của bạn, ảnh hưởng tới sinh hoạt.",
    description_en:
      "Weather where you live: seasons, how you feel about it, effect on daily life.",
    sample_questions: [
      "What is the weather like today?",
      "Which season do you like best, and why?",
      "Does the weather affect your mood or activities?",
      "Has the climate in Vietnam changed in recent years?",
      "What do you do when it rains a lot?",
    ],
    vietnamese_speaker_tips: [
      "'Weather' không đếm được — KHÔNG 'a weather' hay 'weathers'. Đúng là 'the weather' hoặc 'weather'.",
      "'Hot' và 'humid' khác nhau — VN thường mô tả là 'hot' chung chung; đúng là 'hot and humid' nếu muốn nói nóng ẩm.",
      "Phát âm 'rain' /reɪn/, 'sunny' /ˈsʌn.i/, 'windy' /ˈwɪn.di/ — đừng kéo dài /aɪ/.",
      "'It is raining' (now) khác 'It rains a lot in summer' (thói quen) — chọn đúng thì.",
      "Đừng nói 'weather is good' đơn giản — VSTEP cao điểm khi mô tả: 'pleasant', 'mild', 'breezy', 'sweltering'.",
    ],
    key_vocabulary: [
      { word: "humid", translation_vi: "ẩm", pronunciation_ipa: "/ˈhjuː.mɪd/", level: "B1" },
      { word: "drizzle", translation_vi: "mưa phùn", pronunciation_ipa: "/ˈdrɪz.əl/", level: "B1" },
      { word: "scorching", translation_vi: "nóng như thiêu", pronunciation_ipa: "/ˈskɔːr.tʃɪŋ/", level: "B1" },
      { word: "forecast", translation_vi: "dự báo (thời tiết)", pronunciation_ipa: "/ˈfɔːr.kæst/", level: "B1" },
    ],
    estimated_time_minutes: 3,
    typical_band_descriptors: B1_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b1_speaking_weather/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b1_speaking_weather/q1.mp3", "vstep-speaking/vstep_b1_speaking_weather/q2.mp3", "vstep-speaking/vstep_b1_speaking_weather/q3.mp3", "vstep-speaking/vstep_b1_speaking_weather/q4.mp3", "vstep-speaking/vstep_b1_speaking_weather/q5.mp3"],
  },
  {
    id: "vstep_b1_speaking_travel",
    level: "B1",
    part: 1,
    topic_title_vi: "Đi du lịch",
    topic_title_en: "Travel",
    description_vi:
      "Kinh nghiệm đi du lịch của bạn: nơi đã đi, đi với ai, kỷ niệm đáng nhớ.",
    description_en:
      "Your travel experience: places you've been, who with, a memorable moment.",
    sample_questions: [
      "What's the most memorable trip you've ever taken?",
      "Do you prefer travelling alone or with friends and family?",
      "What do you usually pack when you travel?",
      "Have you ever been abroad? Where would you like to go next?",
      "What's the most important thing for you when planning a trip?",
    ],
    vietnamese_speaker_tips: [
      "'Travel' là động từ chung chung. 'Take a trip' / 'go on a trip' tự nhiên hơn khi kể chuyến cụ thể.",
      "Quá khứ: 'I went to Da Lat last summer' — KHÔNG 'I have been to Da Lat last summer' (present perfect không dùng với mốc thời gian xác định).",
      "Phát âm 'abroad' /əˈbrɔːd/ — âm 'a' là /ə/, không /æ/.",
      "Khi mô tả nơi: 'beautiful' nhàm — dùng 'breathtaking', 'stunning', 'lively', 'peaceful' để cao điểm Vocabulary.",
      "Đừng nói 'I have been there 2 times' — đúng là 'I've been there twice' (hoặc 'two times' khi diễn đạt thân mật).",
    ],
    key_vocabulary: [
      { word: "itinerary", translation_vi: "lịch trình", pronunciation_ipa: "/aɪˈtɪn.ə.rer.i/", level: "B1" },
      { word: "souvenir", translation_vi: "quà lưu niệm", pronunciation_ipa: "/ˌsuː.vəˈnɪr/", level: "B1" },
      { word: "off the beaten path", translation_vi: "ít người biết", pronunciation_ipa: "/ɔːf ðə ˈbiː.tən pæθ/", level: "B1" },
      { word: "wanderlust", translation_vi: "khao khát đi đây đó", pronunciation_ipa: "/ˈwɑːn.dɚ.lʌst/", level: "B1" },
    ],
    estimated_time_minutes: 3,
    typical_band_descriptors: B1_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b1_speaking_travel/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b1_speaking_travel/q1.mp3", "vstep-speaking/vstep_b1_speaking_travel/q2.mp3", "vstep-speaking/vstep_b1_speaking_travel/q3.mp3", "vstep-speaking/vstep_b1_speaking_travel/q4.mp3", "vstep-speaking/vstep_b1_speaking_travel/q5.mp3"],
  },

  // ════════════════════════════════════════════════════════════════
  // B1 — Part 2 (Solution discussion, ~4 min, 3 topics)
  // ════════════════════════════════════════════════════════════════
  {
    id: "vstep_b1_speaking_school_problems",
    level: "B1",
    part: 2,
    topic_title_vi: "Vấn đề ở trường",
    topic_title_en: "School problems",
    description_vi:
      "Tình huống: bạn em họ học lớp 9 đang chán học. Có 3 lựa chọn — (a) học gia sư, (b) chuyển trường, (c) nghỉ một học kỳ. Chọn một và giải thích.",
    description_en:
      "Scenario: your 9th-grade cousin is losing motivation in school. Three options — (a) hire a tutor, (b) change schools, (c) take a one-semester break. Pick one and justify.",
    sample_questions: [
      "Which option do you think is best, and why?",
      "What are the disadvantages of the other two options?",
      "Do you think changing schools could solve the problem?",
      "How would the family react to your choice?",
      "What would you say to your cousin directly?",
    ],
    vietnamese_speaker_tips: [
      "Cấu trúc Part 2: 'I would choose option (a) because... + so sánh với (b) and (c) + kết luận'. VSTEP rubric thưởng candidate có structure.",
      "Dùng modal verbs B1: 'should', 'would', 'might'. Tránh chỉ 'will' — quá chắc chắn cho tình huống giả định.",
      "Linking phrases: 'On the other hand', 'However', 'Compared to', 'In my opinion'.",
      "Đừng dịch trực tiếp 'tôi nghĩ rằng' = 'I think that' mỗi câu — luân phiên 'I believe', 'In my view', 'It seems to me'.",
      "Khi không chắc từ vựng, paraphrase: 'a private teacher who comes to your house' nếu quên 'tutor'.",
    ],
    key_vocabulary: [
      { word: "tutor", translation_vi: "gia sư", pronunciation_ipa: "/ˈtuː.tɚ/", level: "B1" },
      { word: "transfer (schools)", translation_vi: "chuyển trường", pronunciation_ipa: "/trænsˈfɝː/", level: "B1" },
      { word: "burnout", translation_vi: "kiệt sức", pronunciation_ipa: "/ˈbɝːn.aʊt/", level: "B2" },
      { word: "motivation", translation_vi: "động lực", pronunciation_ipa: "/ˌmoʊ.t̬əˈveɪ.ʃən/", level: "B1" },
    ],
    estimated_time_minutes: 4,
    typical_band_descriptors: B1_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b1_speaking_school_problems/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b1_speaking_school_problems/q1.mp3", "vstep-speaking/vstep_b1_speaking_school_problems/q2.mp3", "vstep-speaking/vstep_b1_speaking_school_problems/q3.mp3", "vstep-speaking/vstep_b1_speaking_school_problems/q4.mp3", "vstep-speaking/vstep_b1_speaking_school_problems/q5.mp3"],
  },
  {
    id: "vstep_b1_speaking_family_decisions",
    level: "B1",
    part: 2,
    topic_title_vi: "Quyết định trong gia đình",
    topic_title_en: "Family decisions",
    description_vi:
      "Tình huống: gia đình bạn cần chọn cách dùng tiền tiết kiệm — (a) đi du lịch nước ngoài, (b) sửa nhà, (c) gửi tiết kiệm. Chọn một và giải thích.",
    description_en:
      "Scenario: your family must decide how to use savings — (a) overseas trip, (b) home renovation, (c) put it in a savings account. Pick one and justify.",
    sample_questions: [
      "Which option would benefit your family most?",
      "Why are the other two options less suitable?",
      "How long would it take to save up again?",
      "Should children be involved in family financial decisions?",
      "What does your family usually do when there's disagreement?",
    ],
    vietnamese_speaker_tips: [
      "Conditional B1: 'If we travel, we would (we'd) have memories'. KHÔNG 'If we will travel'.",
      "'Save money' (động từ) khác 'savings' (danh từ). 'We should put it into our savings'.",
      "Người Việt thường nói 'my family agree/disagree' — đúng là 'my family agrees' (singular collective) HOẶC 'my family members agree' (plural).",
      "Phát âm 'renovation' /ˌrɛn.əˈveɪ.ʃən/ — stress vào âm thứ ba.",
      "Khi so sánh: 'travelling is more memorable than renovating' (KHÔNG 'more memorable as').",
    ],
    key_vocabulary: [
      { word: "savings", translation_vi: "tiền tiết kiệm", pronunciation_ipa: "/ˈseɪ.vɪŋz/", level: "B1" },
      { word: "renovation", translation_vi: "sửa nhà", pronunciation_ipa: "/ˌrɛn.əˈveɪ.ʃən/", level: "B1" },
      { word: "splurge", translation_vi: "tiêu lớn một lần", pronunciation_ipa: "/splɝːdʒ/", level: "B2" },
      { word: "financial security", translation_vi: "an toàn tài chính", pronunciation_ipa: "/fəˈnæn.ʃəl sɪˈkjʊr.ə.ti/", level: "B1" },
    ],
    estimated_time_minutes: 4,
    typical_band_descriptors: B1_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b1_speaking_family_decisions/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b1_speaking_family_decisions/q1.mp3", "vstep-speaking/vstep_b1_speaking_family_decisions/q2.mp3", "vstep-speaking/vstep_b1_speaking_family_decisions/q3.mp3", "vstep-speaking/vstep_b1_speaking_family_decisions/q4.mp3", "vstep-speaking/vstep_b1_speaking_family_decisions/q5.mp3"],
  },
  {
    id: "vstep_b1_speaking_time_management",
    level: "B1",
    part: 2,
    topic_title_vi: "Quản lý thời gian",
    topic_title_en: "Time management",
    description_vi:
      "Tình huống: bạn của bạn đang quá tải vì học, làm thêm, và sinh hoạt câu lạc bộ. Có 3 lựa chọn — (a) bỏ làm thêm, (b) bỏ câu lạc bộ, (c) học bớt môn tự chọn. Chọn một và giải thích.",
    description_en:
      "Scenario: your friend is overloaded with study, a part-time job, and a club. Three options — (a) quit the job, (b) leave the club, (c) drop one elective course. Pick one and justify.",
    sample_questions: [
      "Which option would give your friend the most relief?",
      "Why might quitting the job be better than leaving the club?",
      "What are the long-term effects of each choice?",
      "Should your friend talk to their parents before deciding?",
      "What time-management tools or habits would you suggest?",
    ],
    vietnamese_speaker_tips: [
      "'Quit' (bỏ) với 'leave' (rời) hơi khác sắc thái — quit + job/smoking, leave + place/club.",
      "Modal cho lời khuyên: 'should', 'ought to', 'might want to'.",
      "Đừng nói 'too many things to do them' — đúng là 'too much to handle' / 'too much on her plate'.",
      "Sử dụng 'priorities' đúng số nhiều: 'set priorities', 'reorder priorities'.",
      "Phát âm 'schedule' — Mỹ /ˈskɛdʒ.uːl/, Anh /ˈʃɛd.juːl/. VSTEP chấp nhận cả hai nhưng nhất quán.",
    ],
    key_vocabulary: [
      { word: "overloaded", translation_vi: "quá tải", pronunciation_ipa: "/ˌoʊ.vɚˈloʊ.dɪd/", level: "B1" },
      { word: "elective", translation_vi: "môn tự chọn", pronunciation_ipa: "/ɪˈlɛk.tɪv/", level: "B1" },
      { word: "priorities", translation_vi: "việc ưu tiên", pronunciation_ipa: "/praɪˈɔːr.ə.t̬iz/", level: "B1" },
      { word: "burn out", translation_vi: "kiệt sức", pronunciation_ipa: "/bɝːn aʊt/", level: "B2" },
    ],
    estimated_time_minutes: 4,
    typical_band_descriptors: B1_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b1_speaking_time_management/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b1_speaking_time_management/q1.mp3", "vstep-speaking/vstep_b1_speaking_time_management/q2.mp3", "vstep-speaking/vstep_b1_speaking_time_management/q3.mp3", "vstep-speaking/vstep_b1_speaking_time_management/q4.mp3", "vstep-speaking/vstep_b1_speaking_time_management/q5.mp3"],
  },

  // ════════════════════════════════════════════════════════════════
  // B1 — Part 3 (Topic development, ~5 min, 5 topics)
  // ════════════════════════════════════════════════════════════════
  {
    id: "vstep_b1_speaking_education_importance",
    level: "B1",
    part: 3,
    topic_title_vi: "Tầm quan trọng của giáo dục",
    topic_title_en: "The importance of education",
    description_vi:
      "Trình bày quan điểm: giáo dục có vai trò gì với cá nhân và xã hội? Cho ví dụ.",
    description_en:
      "Present your view: what role does education play for the individual and society? Give examples.",
    sample_questions: [
      "Why is education important in modern society?",
      "Do you think formal schooling is enough, or should self-learning matter too?",
      "How has Vietnamese education changed in the last 20 years?",
      "Should the government provide free higher education?",
      "What is one thing schools could do better?",
    ],
    vietnamese_speaker_tips: [
      "Mở bài rõ: 'In my opinion, education is essential for three main reasons. First..., Second..., Finally...'",
      "Đừng dịch 'kiến thức' = 'knowledges' — 'knowledge' không đếm được.",
      "Phát âm 'education' /ˌɛdʒ.əˈkeɪ.ʃən/ — không phải /ˌe-du-CA-tion/.",
      "Dùng được giọng B1+: 'literacy rate', 'critical thinking', 'lifelong learning'.",
      "Khi cho ví dụ: 'For example' / 'For instance' / 'Take... as an example'. Luân phiên để VSTEP chấm Vocabulary cao.",
    ],
    key_vocabulary: [
      { word: "literacy", translation_vi: "khả năng đọc viết", pronunciation_ipa: "/ˈlɪt̬.ɚ.ə.si/", level: "B2" },
      { word: "tuition", translation_vi: "học phí", pronunciation_ipa: "/tuˈɪʃ.ən/", level: "B1" },
      { word: "lifelong learning", translation_vi: "học tập suốt đời", pronunciation_ipa: "/ˈlaɪf.lɔːŋ ˈlɝː.nɪŋ/", level: "B1" },
      { word: "vocational", translation_vi: "(thuộc về) nghề", pronunciation_ipa: "/voʊˈkeɪ.ʃən.əl/", level: "B2" },
    ],
    estimated_time_minutes: 5,
    typical_band_descriptors: B1_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b1_speaking_education_importance/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b1_speaking_education_importance/q1.mp3", "vstep-speaking/vstep_b1_speaking_education_importance/q2.mp3", "vstep-speaking/vstep_b1_speaking_education_importance/q3.mp3", "vstep-speaking/vstep_b1_speaking_education_importance/q4.mp3", "vstep-speaking/vstep_b1_speaking_education_importance/q5.mp3"],
  },
  {
    id: "vstep_b1_speaking_role_of_parents",
    level: "B1",
    part: 3,
    topic_title_vi: "Vai trò của bố mẹ",
    topic_title_en: "The role of parents",
    description_vi:
      "Phụ huynh đóng vai trò gì trong việc nuôi dạy con cái thời nay?",
    description_en:
      "What role do parents play in raising children today?",
    sample_questions: [
      "What are the most important things parents should teach children?",
      "Should parents be strict or lenient? Why?",
      "How have parenting styles changed compared to your grandparents' time?",
      "Should both parents work, or should one stay home?",
      "What is the hardest part of being a parent today?",
    ],
    vietnamese_speaker_tips: [
      "'Parent' số ít, 'parents' số nhiều — chọn đúng theo ngữ cảnh.",
      "'Strict' (nghiêm) với 'lenient' (dễ tính) — cặp tính từ chủ đề này hay dùng.",
      "Phát âm 'parents' /ˈpɛr.ənts/ — không bỏ /s/ cuối.",
      "Đừng nói 'my parents are very busy with their job' — đúng là 'with their jobs' nếu cả hai đều có việc, hoặc 'with work' (không đếm).",
      "Cấu trúc B1: 'It is the responsibility of parents to...' — formal hơn 'Parents must...'",
    ],
    key_vocabulary: [
      { word: "upbringing", translation_vi: "sự nuôi dạy", pronunciation_ipa: "/ˈʌpˌbrɪŋ.ɪŋ/", level: "B1" },
      { word: "lenient", translation_vi: "dễ tính", pronunciation_ipa: "/ˈliː.ni.ənt/", level: "B2" },
      { word: "role model", translation_vi: "tấm gương", pronunciation_ipa: "/roʊl ˈmɑː.dəl/", level: "B1" },
      { word: "instil values", translation_vi: "truyền đạt giá trị", pronunciation_ipa: "/ɪnˈstɪl ˈvæl.juːz/", level: "B2" },
    ],
    estimated_time_minutes: 5,
    typical_band_descriptors: B1_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b1_speaking_role_of_parents/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b1_speaking_role_of_parents/q1.mp3", "vstep-speaking/vstep_b1_speaking_role_of_parents/q2.mp3", "vstep-speaking/vstep_b1_speaking_role_of_parents/q3.mp3", "vstep-speaking/vstep_b1_speaking_role_of_parents/q4.mp3", "vstep-speaking/vstep_b1_speaking_role_of_parents/q5.mp3"],
  },
  {
    id: "vstep_b1_speaking_free_time",
    level: "B1",
    part: 3,
    topic_title_vi: "Hoạt động giải trí",
    topic_title_en: "Free-time activities",
    description_vi:
      "Mọi người dùng thời gian rảnh để làm gì? Có khác giữa các thế hệ không?",
    description_en:
      "How do people spend their free time? Does it differ across generations?",
    sample_questions: [
      "What do most young Vietnamese do in their free time today?",
      "How is this different from what older people do?",
      "Has technology changed how we relax?",
      "Is too much screen time a real problem?",
      "What's the most valuable way to spend free time, in your opinion?",
    ],
    vietnamese_speaker_tips: [
      "Generations: 'Gen Z', 'millennials', 'older generations' — biết được các từ này VSTEP cao điểm.",
      "Đừng nói 'play phone' — đúng là 'use the phone', 'scroll on the phone', 'be on the phone'.",
      "'Spend time + V-ing': 'spend time watching TV' (KHÔNG 'spend time to watch').",
      "'Relaxing' (đem lại sự thư giãn) khác 'relaxed' (cảm thấy thư giãn). Activities ARE relaxing, people ARE relaxed.",
      "So sánh thế hệ: 'while older people prefer X, younger people tend to Y'.",
    ],
    key_vocabulary: [
      { word: "screen time", translation_vi: "thời gian dùng thiết bị", pronunciation_ipa: "/skriːn taɪm/", level: "B1" },
      { word: "scroll", translation_vi: "lướt (mạng)", pronunciation_ipa: "/skroʊl/", level: "B1" },
      { word: "downtime", translation_vi: "thời gian thảnh thơi", pronunciation_ipa: "/ˈdaʊn.taɪm/", level: "B1" },
      { word: "generation gap", translation_vi: "khoảng cách thế hệ", pronunciation_ipa: "/ˌdʒɛn.əˈreɪ.ʃən gæp/", level: "B1" },
    ],
    estimated_time_minutes: 5,
    typical_band_descriptors: B1_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b1_speaking_free_time/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b1_speaking_free_time/q1.mp3", "vstep-speaking/vstep_b1_speaking_free_time/q2.mp3", "vstep-speaking/vstep_b1_speaking_free_time/q3.mp3", "vstep-speaking/vstep_b1_speaking_free_time/q4.mp3", "vstep-speaking/vstep_b1_speaking_free_time/q5.mp3"],
  },
  {
    id: "vstep_b1_speaking_friendship",
    level: "B1",
    part: 3,
    topic_title_vi: "Tình bạn",
    topic_title_en: "Friendship",
    description_vi:
      "Một người bạn tốt là người như thế nào? Vai trò của tình bạn trong cuộc sống.",
    description_en:
      "What makes a good friend? The role of friendship in life.",
    sample_questions: [
      "What qualities do you look for in a friend?",
      "How do you keep in touch with friends who live far away?",
      "Are online friends as real as offline friends?",
      "Have you ever lost a close friend? Why?",
      "Is it possible to have a true friend at work?",
    ],
    vietnamese_speaker_tips: [
      "'Friend' đếm được — 'a friend', 'two friends', 'many friends'. Đừng nói 'much friends'.",
      "Phát âm 'friend' /frɛnd/ và 'friendship' /ˈfrɛnd.ʃɪp/ — không kéo dài /e/.",
      "Idiom B1: 'a shoulder to cry on', 'thick and thin', 'have my back'. Dùng 1 idiom đúng → bonus.",
      "'Make friends' (kết bạn) chứ KHÔNG 'do friends' hay 'have friends' (làm bạn).",
      "'Online' và 'offline' không có dấu cách.",
    ],
    key_vocabulary: [
      { word: "loyal", translation_vi: "trung thành", pronunciation_ipa: "/ˈlɔɪ.əl/", level: "B1" },
      { word: "trustworthy", translation_vi: "đáng tin", pronunciation_ipa: "/ˈtrʌstˌwɝː.ði/", level: "B1" },
      { word: "drift apart", translation_vi: "xa nhau dần", pronunciation_ipa: "/drɪft əˈpɑːrt/", level: "B2" },
      { word: "long-distance friendship", translation_vi: "tình bạn xa cách", pronunciation_ipa: "/ˌlɔːŋˈdɪs.təns ˈfrɛnd.ʃɪp/", level: "B1" },
    ],
    estimated_time_minutes: 5,
    typical_band_descriptors: B1_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b1_speaking_friendship/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b1_speaking_friendship/q1.mp3", "vstep-speaking/vstep_b1_speaking_friendship/q2.mp3", "vstep-speaking/vstep_b1_speaking_friendship/q3.mp3", "vstep-speaking/vstep_b1_speaking_friendship/q4.mp3", "vstep-speaking/vstep_b1_speaking_friendship/q5.mp3"],
  },
  {
    id: "vstep_b1_speaking_health_lifestyle",
    level: "B1",
    part: 3,
    topic_title_vi: "Lối sống lành mạnh",
    topic_title_en: "A healthy lifestyle",
    description_vi:
      "Sống lành mạnh nghĩa là gì? Người trẻ Việt Nam ngày nay có sống lành mạnh không?",
    description_en:
      "What does a healthy lifestyle mean? Are young Vietnamese living healthily today?",
    sample_questions: [
      "What does a healthy lifestyle include?",
      "Do you think most young Vietnamese live healthily?",
      "How important is mental health compared to physical health?",
      "Should companies offer wellness programmes for employees?",
      "What's one habit you'd like to change?",
    ],
    vietnamese_speaker_tips: [
      "'Healthy' (cá nhân khỏe) với 'healthful' (món ăn/hoạt động có lợi) — VSTEP examiner để ý phân biệt.",
      "'Exercise' không đếm được khi nói chung — 'I do exercise' / 'get more exercise' (KHÔNG 'do exercises' khi ý là tập luyện chung).",
      "Phát âm 'health' /hɛlθ/ — kết thúc /θ/ (lưỡi giữa răng), không /t/.",
      "Mental health là chủ đề B1 cao điểm — 'mindfulness', 'stress management', 'self-care' đều hữu dụng.",
      "Đừng nói 'I have a good health' — đúng là 'I'm in good health' / 'I have good health' (không 'a').",
    ],
    key_vocabulary: [
      { word: "well-being", translation_vi: "sức khỏe tổng thể", pronunciation_ipa: "/ˈwɛlˌbiː.ɪŋ/", level: "B1" },
      { word: "sedentary", translation_vi: "ít vận động", pronunciation_ipa: "/ˈsɛd.ən.tɛr.i/", level: "B2" },
      { word: "mindfulness", translation_vi: "sự tỉnh thức", pronunciation_ipa: "/ˈmaɪnd.fəl.nəs/", level: "B2" },
      { word: "burn calories", translation_vi: "đốt calo", pronunciation_ipa: "/bɝːn ˈkæl.ə.riz/", level: "B1" },
    ],
    estimated_time_minutes: 5,
    typical_band_descriptors: B1_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b1_speaking_health_lifestyle/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b1_speaking_health_lifestyle/q1.mp3", "vstep-speaking/vstep_b1_speaking_health_lifestyle/q2.mp3", "vstep-speaking/vstep_b1_speaking_health_lifestyle/q3.mp3", "vstep-speaking/vstep_b1_speaking_health_lifestyle/q4.mp3", "vstep-speaking/vstep_b1_speaking_health_lifestyle/q5.mp3"],
  },

  // ════════════════════════════════════════════════════════════════
  // B2 — Part 1 (Social interaction, ~3 min, 6 topics)
  // ════════════════════════════════════════════════════════════════
  {
    id: "vstep_b2_speaking_career_goals",
    level: "B2",
    part: 1,
    topic_title_vi: "Mục tiêu nghề nghiệp",
    topic_title_en: "Career goals",
    description_vi:
      "Định hướng nghề nghiệp của bạn: ngắn hạn vs. dài hạn, lý do chọn ngành.",
    description_en:
      "Your career direction: short-term vs. long-term goals, reasons for choosing your field.",
    sample_questions: [
      "What are your career goals for the next five years?",
      "Why did you choose this field?",
      "How important is salary compared to work-life balance?",
      "Is it common in Vietnam to change careers in your 30s?",
      "What skills will be most valuable in the next decade?",
    ],
    vietnamese_speaker_tips: [
      "Phân biệt 'job' (công việc cụ thể), 'career' (con đường sự nghiệp), 'profession' (nghề chuyên môn). VSTEP B2 expects exact word.",
      "Future plans dùng 'going to' (kế hoạch chắc chắn) hoặc 'plan to' / 'aim to' / 'hope to' — đa dạng để cao điểm.",
      "Đừng nói 'I want to be richer' (so sánh không hoàn chỉnh) — đúng là 'I want to earn a higher salary' hoặc 'I aim for financial stability'.",
      "Phát âm 'career' /kəˈrɪr/ — stress vào âm thứ hai, không /KA-rer/.",
      "Lập luận B2 cần concession: 'While salary matters, work-life balance is equally important to me'.",
    ],
    key_vocabulary: [
      { word: "career path", translation_vi: "lộ trình nghề nghiệp", pronunciation_ipa: "/kəˈrɪr pæθ/", level: "B2" },
      { word: "promotion", translation_vi: "thăng chức", pronunciation_ipa: "/prəˈmoʊ.ʃən/", level: "B2" },
      { word: "transferable skills", translation_vi: "kỹ năng chuyển đổi", pronunciation_ipa: "/trænsˈfɝː.ə.bəl skɪlz/", level: "B2" },
      { word: "fulfilment", translation_vi: "sự thỏa mãn", pronunciation_ipa: "/fʊlˈfɪl.mənt/", level: "B2" },
    ],
    estimated_time_minutes: 3,
    typical_band_descriptors: B2_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b2_speaking_career_goals/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b2_speaking_career_goals/q1.mp3", "vstep-speaking/vstep_b2_speaking_career_goals/q2.mp3", "vstep-speaking/vstep_b2_speaking_career_goals/q3.mp3", "vstep-speaking/vstep_b2_speaking_career_goals/q4.mp3", "vstep-speaking/vstep_b2_speaking_career_goals/q5.mp3"],
  },
  {
    id: "vstep_b2_speaking_technology_use",
    level: "B2",
    part: 1,
    topic_title_vi: "Việc dùng công nghệ",
    topic_title_en: "Technology use",
    description_vi:
      "Bạn dùng công nghệ thế nào hàng ngày? Có lệ thuộc không? Lợi và hại.",
    description_en:
      "How do you use technology daily? Are you dependent? Benefits and drawbacks.",
    sample_questions: [
      "How much time do you spend on your phone each day?",
      "Could you live without the internet for a week?",
      "Has technology made you more or less productive?",
      "What's a technology you wish existed?",
      "Are you concerned about data privacy?",
    ],
    vietnamese_speaker_tips: [
      "Tránh từ chung chung 'use technology' — cụ thể: 'I rely on cloud storage', 'I use video conferencing daily'.",
      "Phát âm 'technology' /tɛkˈnɑː.lə.dʒi/ — stress thứ hai, schwa nhiều. Đừng /TECH-no-LO-gy/ kiểu Việt.",
      "B2 expects nuance: 'on one hand it saves time, on the other hand it can be distracting'.",
      "Đừng nói 'social network' khi ý là Facebook/Instagram — nói 'social media' (không đếm).",
      "'Dependent' với 'depending' khác nhau — 'I'm dependent on my phone' (tính từ trạng thái), 'It depends on the day' (động từ).",
    ],
    key_vocabulary: [
      { word: "data privacy", translation_vi: "quyền riêng tư dữ liệu", pronunciation_ipa: "/ˈdeɪ.t̬ə ˈpraɪ.və.si/", level: "B2" },
      { word: "screen fatigue", translation_vi: "mỏi mắt do màn hình", pronunciation_ipa: "/skriːn fəˈtiːg/", level: "B2" },
      { word: "automation", translation_vi: "tự động hóa", pronunciation_ipa: "/ˌɔː.təˈmeɪ.ʃən/", level: "B2" },
      { word: "doom-scroll", translation_vi: "lướt mạng vô tận", pronunciation_ipa: "/duːm skroʊl/", level: "B2" },
    ],
    estimated_time_minutes: 3,
    typical_band_descriptors: B2_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b2_speaking_technology_use/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b2_speaking_technology_use/q1.mp3", "vstep-speaking/vstep_b2_speaking_technology_use/q2.mp3", "vstep-speaking/vstep_b2_speaking_technology_use/q3.mp3", "vstep-speaking/vstep_b2_speaking_technology_use/q4.mp3", "vstep-speaking/vstep_b2_speaking_technology_use/q5.mp3"],
  },
  {
    id: "vstep_b2_speaking_environmental_issues",
    level: "B2",
    part: 1,
    topic_title_vi: "Vấn đề môi trường",
    topic_title_en: "Environmental issues",
    description_vi:
      "Quan tâm của bạn về môi trường: bạn làm gì để bảo vệ, cộng đồng có quan tâm không.",
    description_en:
      "Your environmental concern: what you personally do, whether your community cares.",
    sample_questions: [
      "What environmental issue concerns you most in Vietnam?",
      "What do you personally do to reduce waste?",
      "Should the government tax single-use plastics more aggressively?",
      "Are young Vietnamese more environmentally aware than older generations?",
      "Is it realistic to expect individuals to fix climate change?",
    ],
    vietnamese_speaker_tips: [
      "B2-tier vocabulary: 'sustainability', 'carbon footprint', 'biodiversity', 'single-use plastics'. Mỗi câu có ít nhất 1 từ B2 → cao điểm Vocabulary.",
      "Phân biệt 'environment' (chung) với 'the environment' (cụ thể, có 'the').",
      "Đừng nói 'protect environment' — đúng là 'protect the environment'.",
      "Phát âm 'environment' /ɪnˈvaɪ.rən.mənt/ — không bỏ /n/ thứ nhất.",
      "Lập luận hai mặt: 'Although individuals can recycle, real change requires policy reform'.",
    ],
    key_vocabulary: [
      { word: "sustainability", translation_vi: "tính bền vững", pronunciation_ipa: "/səˌsteɪ.nəˈbɪl.ə.t̬i/", level: "B2" },
      { word: "carbon footprint", translation_vi: "dấu chân các-bon", pronunciation_ipa: "/ˈkɑːr.bən ˈfʊt.prɪnt/", level: "B2" },
      { word: "single-use", translation_vi: "dùng một lần", pronunciation_ipa: "/ˈsɪŋ.gəlˌjuːs/", level: "B2" },
      { word: "deforestation", translation_vi: "nạn phá rừng", pronunciation_ipa: "/diːˌfɔːr.ɪˈsteɪ.ʃən/", level: "B2" },
    ],
    estimated_time_minutes: 3,
    typical_band_descriptors: B2_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b2_speaking_environmental_issues/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b2_speaking_environmental_issues/q1.mp3", "vstep-speaking/vstep_b2_speaking_environmental_issues/q2.mp3", "vstep-speaking/vstep_b2_speaking_environmental_issues/q3.mp3", "vstep-speaking/vstep_b2_speaking_environmental_issues/q4.mp3", "vstep-speaking/vstep_b2_speaking_environmental_issues/q5.mp3"],
  },
  {
    id: "vstep_b2_speaking_health_fitness",
    level: "B2",
    part: 1,
    topic_title_vi: "Sức khỏe và thể chất",
    topic_title_en: "Health and fitness",
    description_vi:
      "Bạn giữ gìn sức khỏe thế nào? Có gặp khó khăn gì không?",
    description_en:
      "How do you maintain your health? What obstacles do you face?",
    sample_questions: [
      "How often do you exercise, and what kind?",
      "Has it been hard to keep up healthy habits in adult life?",
      "Is mental health treated the same as physical health in Vietnam?",
      "Do you trust health information you find online?",
      "What change would most improve public health in your city?",
    ],
    vietnamese_speaker_tips: [
      "'Workout' (danh từ) khác 'work out' (động từ ghép). 'I had a workout' / 'I worked out yesterday'.",
      "Đừng dịch 'thể chất' = 'body' — đúng là 'physical health' / 'physical condition'.",
      "Phát âm 'fitness' /ˈfɪt.nəs/ — không kéo dài /i/.",
      "B2 hedge phrases: 'I'd say...', 'Generally speaking...', 'It's fair to say...'.",
      "Mental health vocabulary đang là chủ đề thi B2 phổ biến — 'anxiety', 'burnout', 'self-care', 'therapist' đáng học.",
    ],
    key_vocabulary: [
      { word: "stamina", translation_vi: "sức bền", pronunciation_ipa: "/ˈstæm.ə.nə/", level: "B2" },
      { word: "preventive (care)", translation_vi: "phòng ngừa", pronunciation_ipa: "/prɪˈvɛn.t̬ɪv/", level: "B2" },
      { word: "stigma", translation_vi: "sự kỳ thị", pronunciation_ipa: "/ˈstɪg.mə/", level: "B2" },
      { word: "wearable (device)", translation_vi: "thiết bị đeo theo dõi", pronunciation_ipa: "/ˈwɛr.ə.bəl/", level: "B2" },
    ],
    estimated_time_minutes: 3,
    typical_band_descriptors: B2_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b2_speaking_health_fitness/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b2_speaking_health_fitness/q1.mp3", "vstep-speaking/vstep_b2_speaking_health_fitness/q2.mp3", "vstep-speaking/vstep_b2_speaking_health_fitness/q3.mp3", "vstep-speaking/vstep_b2_speaking_health_fitness/q4.mp3", "vstep-speaking/vstep_b2_speaking_health_fitness/q5.mp3"],
  },
  {
    id: "vstep_b2_speaking_learning_english",
    level: "B2",
    part: 1,
    topic_title_vi: "Học tiếng Anh",
    topic_title_en: "Learning English",
    description_vi:
      "Hành trình học tiếng Anh của bạn: bao lâu, phương pháp, khó khăn.",
    description_en:
      "Your English-learning journey: how long, methods, difficulties.",
    sample_questions: [
      "How long have you been studying English, and how did you start?",
      "What's the most difficult skill for you — listening, reading, writing, or speaking?",
      "Do you think Vietnamese students learn English effectively at school?",
      "How has online learning changed the way you study?",
      "Will English remain the global language in 30 years?",
    ],
    vietnamese_speaker_tips: [
      "'I have been studying English for 10 years' (present perfect continuous) — phải có 'have been' + V-ing.",
      "'Learn' (qua kinh nghiệm) khác 'study' (chính thức) — VSTEP examiner để ý chọn đúng.",
      "Đừng nói 'I learn English very long time' — đúng là 'for a long time' hoặc 'for many years'.",
      "Phát âm 'learning' /ˈlɝː.nɪŋ/ — âm /ɝː/ và /ŋ/ cuối, không bỏ.",
      "Khi nói cảm xúc: 'I find listening challenging' (tính từ -ing, gây ra cảm xúc) — KHÔNG 'I find listening challenged'.",
    ],
    key_vocabulary: [
      { word: "fluency", translation_vi: "sự lưu loát", pronunciation_ipa: "/ˈfluː.ən.si/", level: "B2" },
      { word: "immersion", translation_vi: "đắm mình (trong môi trường)", pronunciation_ipa: "/ɪˈmɝː.ʒən/", level: "B2" },
      { word: "proficiency", translation_vi: "trình độ thành thạo", pronunciation_ipa: "/prəˈfɪʃ.ən.si/", level: "B2" },
      { word: "lingua franca", translation_vi: "ngôn ngữ chung", pronunciation_ipa: "/ˌlɪŋ.gwə ˈfræŋ.kə/", level: "C1" },
    ],
    estimated_time_minutes: 3,
    typical_band_descriptors: B2_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b2_speaking_learning_english/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b2_speaking_learning_english/q1.mp3", "vstep-speaking/vstep_b2_speaking_learning_english/q2.mp3", "vstep-speaking/vstep_b2_speaking_learning_english/q3.mp3", "vstep-speaking/vstep_b2_speaking_learning_english/q4.mp3", "vstep-speaking/vstep_b2_speaking_learning_english/q5.mp3"],
  },
  {
    id: "vstep_b2_speaking_family_changes",
    level: "B2",
    part: 1,
    topic_title_vi: "Sự thay đổi của gia đình hiện đại",
    topic_title_en: "Changes in the modern family",
    description_vi:
      "Gia đình Việt thay đổi thế nào trong 20 năm qua? Hệ quả tích cực và tiêu cực.",
    description_en:
      "How has the Vietnamese family changed over 20 years? Positive and negative consequences.",
    sample_questions: [
      "How has the average Vietnamese family changed in the last 20 years?",
      "Are nuclear families replacing extended families? Why?",
      "Should grandparents be involved in raising grandchildren?",
      "Is having only one child a wise decision?",
      "What do families lose when both parents work full-time?",
    ],
    vietnamese_speaker_tips: [
      "B2-tier sociology vocab: 'nuclear family', 'extended family', 'birth rate', 'urbanisation'.",
      "Đừng dịch 'gia đình truyền thống' = 'traditional family' đơn giản — 'multigenerational household' rộng hơn và đúng hơn.",
      "Lý do dùng 'used to' (trước đây thường) khi so sánh quá khứ: 'Families used to live together' khác 'Families lived together'.",
      "Phát âm 'household' /ˈhaʊs.hoʊld/ — diphthong /aʊ/ và /oʊ/ rõ.",
      "Discourse marker B2: 'In hindsight', 'looking back', 'it's no surprise that...'",
    ],
    key_vocabulary: [
      { word: "nuclear family", translation_vi: "gia đình hạt nhân", pronunciation_ipa: "/ˈnuː.kli.ɚ ˈfæm.ə.li/", level: "B2" },
      { word: "birth rate", translation_vi: "tỉ lệ sinh", pronunciation_ipa: "/bɝːθ reɪt/", level: "B2" },
      { word: "urbanisation", translation_vi: "đô thị hóa", pronunciation_ipa: "/ˌɝː.bə.nəˈzeɪ.ʃən/", level: "B2" },
      { word: "intergenerational", translation_vi: "liên thế hệ", pronunciation_ipa: "/ˌɪn.tɚ.dʒɛn.əˈreɪ.ʃən.əl/", level: "C1" },
    ],
    estimated_time_minutes: 3,
    typical_band_descriptors: B2_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b2_speaking_family_changes/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b2_speaking_family_changes/q1.mp3", "vstep-speaking/vstep_b2_speaking_family_changes/q2.mp3", "vstep-speaking/vstep_b2_speaking_family_changes/q3.mp3", "vstep-speaking/vstep_b2_speaking_family_changes/q4.mp3", "vstep-speaking/vstep_b2_speaking_family_changes/q5.mp3"],
  },

  // ════════════════════════════════════════════════════════════════
  // B2 — Part 2 (Solution discussion, ~4 min, 3 topics)
  // ════════════════════════════════════════════════════════════════
  {
    id: "vstep_b2_speaking_workplace_conflict",
    level: "B2",
    part: 2,
    topic_title_vi: "Xung đột nơi làm việc",
    topic_title_en: "Workplace conflict",
    description_vi:
      "Tình huống: đồng nghiệp lấy công của bạn trong báo cáo. Có 3 lựa chọn — (a) nói chuyện riêng với người đó, (b) báo sếp, (c) bỏ qua. Chọn một và giải thích.",
    description_en:
      "Scenario: a colleague took credit for your work in a report. Three options — (a) talk to them privately, (b) report to your manager, (c) let it go. Pick one and justify.",
    sample_questions: [
      "Which option is the most professional?",
      "What are the risks of confronting your colleague directly?",
      "Could reporting to the manager backfire?",
      "Should you keep evidence of who actually did the work?",
      "How would your decision differ if it were a one-off vs. a repeated pattern?",
    ],
    vietnamese_speaker_tips: [
      "B2 expects diplomatic language: 'I'd rather...', 'It might be wiser to...', 'Rather than...'",
      "Đừng dịch 'lấy công' = 'take work' — đúng là 'take credit for' / 'claim credit for'.",
      "Conditional B2: 'If I were in that situation, I would...' (subjunctive 'were').",
      "Phát âm 'colleague' /ˈkɑː.liːg/ — KHÔNG /col-LEAGUE/.",
      "Nuanced phrases: 'address the issue head-on', 'escalate to management', 'pick your battles'.",
    ],
    key_vocabulary: [
      { word: "credit (for work)", translation_vi: "công lao", pronunciation_ipa: "/ˈkrɛd.ɪt/", level: "B2" },
      { word: "escalate", translation_vi: "đẩy lên cấp cao hơn", pronunciation_ipa: "/ˈɛs.kə.leɪt/", level: "B2" },
      { word: "passive-aggressive", translation_vi: "công kích ngầm", pronunciation_ipa: "/ˌpæs.ɪv.əˈgrɛs.ɪv/", level: "B2" },
      { word: "professional boundary", translation_vi: "giới hạn nghề nghiệp", pronunciation_ipa: "/prəˈfɛʃ.ən.əl ˈbaʊn.dɚ.i/", level: "B2" },
    ],
    estimated_time_minutes: 4,
    typical_band_descriptors: B2_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b2_speaking_workplace_conflict/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b2_speaking_workplace_conflict/q1.mp3", "vstep-speaking/vstep_b2_speaking_workplace_conflict/q2.mp3", "vstep-speaking/vstep_b2_speaking_workplace_conflict/q3.mp3", "vstep-speaking/vstep_b2_speaking_workplace_conflict/q4.mp3", "vstep-speaking/vstep_b2_speaking_workplace_conflict/q5.mp3"],
  },
  {
    id: "vstep_b2_speaking_urban_vs_rural",
    level: "B2",
    part: 2,
    topic_title_vi: "Sống thành thị hay nông thôn",
    topic_title_en: "Urban vs. rural living",
    description_vi:
      "Tình huống: bạn 30 tuổi, làm việc tự do, đang chọn nơi định cư. Có 3 lựa chọn — (a) trung tâm Hà Nội, (b) ngoại ô có sân vườn, (c) thị trấn nhỏ ở tỉnh. Chọn một và giải thích.",
    description_en:
      "Scenario: you're 30, work remotely, deciding where to settle. Three options — (a) central Hanoi, (b) a suburban home with a garden, (c) a small provincial town. Pick one and justify.",
    sample_questions: [
      "Which option offers the best lifestyle balance?",
      "What are the trade-offs in each location?",
      "How important is access to healthcare and entertainment?",
      "Would your choice change if you had children?",
      "Is remote work realistic in a small Vietnamese town today?",
    ],
    vietnamese_speaker_tips: [
      "Comparative B2: 'A is more X than B, but on the other hand B offers Y'.",
      "Đừng dịch 'ngoại ô' = 'outside city' — 'suburb' / 'suburban'.",
      "'Settle' (định cư) khác 'live' chung chung. 'I plan to settle in Da Nang'.",
      "Trade-off vocabulary B2 cao điểm: 'cost of living', 'commute time', 'air quality', 'community'.",
      "Phát âm 'rural' /ˈrʊr.əl/ — hai /r/ liền — đặc biệt khó cho người Việt.",
    ],
    key_vocabulary: [
      { word: "suburb", translation_vi: "ngoại ô", pronunciation_ipa: "/ˈsʌb.ɝːb/", level: "B2" },
      { word: "cost of living", translation_vi: "chi phí sinh hoạt", pronunciation_ipa: "/kɔːst əv ˈlɪv.ɪŋ/", level: "B2" },
      { word: "amenities", translation_vi: "tiện nghi (khu đô thị)", pronunciation_ipa: "/əˈmɛn.ə.t̬iz/", level: "B2" },
      { word: "infrastructure", translation_vi: "cơ sở hạ tầng", pronunciation_ipa: "/ˈɪn.frəˌstrʌk.tʃɚ/", level: "B2" },
    ],
    estimated_time_minutes: 4,
    typical_band_descriptors: B2_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b2_speaking_urban_vs_rural/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b2_speaking_urban_vs_rural/q1.mp3", "vstep-speaking/vstep_b2_speaking_urban_vs_rural/q2.mp3", "vstep-speaking/vstep_b2_speaking_urban_vs_rural/q3.mp3", "vstep-speaking/vstep_b2_speaking_urban_vs_rural/q4.mp3", "vstep-speaking/vstep_b2_speaking_urban_vs_rural/q5.mp3"],
  },
  {
    id: "vstep_b2_speaking_traditional_vs_modern",
    level: "B2",
    part: 2,
    topic_title_vi: "Truyền thống và hiện đại",
    topic_title_en: "Tradition vs. modernity",
    description_vi:
      "Tình huống: bạn tổ chức Tết cho gia đình. Có 3 lựa chọn — (a) Tết truyền thống đầy đủ, (b) Tết tối giản tại nhà, (c) đi du lịch trong nước. Chọn một và giải thích.",
    description_en:
      "Scenario: you're organising Tet for your family. Three options — (a) full traditional celebration, (b) minimalist Tet at home, (c) a domestic trip. Pick one and justify.",
    sample_questions: [
      "Which option preserves family meaning best?",
      "Why might travelling during Tet be a controversial choice?",
      "Is it possible to honour tradition without the burden of preparation?",
      "How do older relatives usually react to non-traditional Tet?",
      "Should young people decide how to celebrate, or follow elders?",
    ],
    vietnamese_speaker_tips: [
      "Tet giải thích bằng tiếng Anh nếu cần: 'Tet — the Vietnamese Lunar New Year'.",
      "Đừng dùng 'old' khi nói về truyền thống — 'traditional', 'time-honoured', 'long-standing' phù hợp B2.",
      "Phép so sánh tinh tế B2: 'preserve the spirit while modernising the form'.",
      "Phát âm 'tradition' /trəˈdɪʃ.ən/ — stress thứ hai.",
      "Cách nói tế nhị: 'I respect the tradition, but...' — VSTEP cao điểm khi candidate không cực đoan.",
    ],
    key_vocabulary: [
      { word: "preserve", translation_vi: "giữ gìn", pronunciation_ipa: "/prɪˈzɝːv/", level: "B2" },
      { word: "minimalist", translation_vi: "tối giản", pronunciation_ipa: "/ˈmɪn.ɪ.məl.ɪst/", level: "B2" },
      { word: "ritual", translation_vi: "nghi thức", pronunciation_ipa: "/ˈrɪtʃ.u.əl/", level: "B2" },
      { word: "rite of passage", translation_vi: "nghi thức chuyển giao", pronunciation_ipa: "/raɪt əv ˈpæs.ɪdʒ/", level: "C1" },
    ],
    estimated_time_minutes: 4,
    typical_band_descriptors: B2_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b2_speaking_traditional_vs_modern/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b2_speaking_traditional_vs_modern/q1.mp3", "vstep-speaking/vstep_b2_speaking_traditional_vs_modern/q2.mp3", "vstep-speaking/vstep_b2_speaking_traditional_vs_modern/q3.mp3", "vstep-speaking/vstep_b2_speaking_traditional_vs_modern/q4.mp3", "vstep-speaking/vstep_b2_speaking_traditional_vs_modern/q5.mp3"],
  },

  // ════════════════════════════════════════════════════════════════
  // B2 — Part 3 (Topic development, ~5 min, 6 topics)
  // ════════════════════════════════════════════════════════════════
  {
    id: "vstep_b2_speaking_globalization",
    level: "B2",
    part: 3,
    topic_title_vi: "Toàn cầu hóa",
    topic_title_en: "Globalisation",
    description_vi:
      "Toàn cầu hóa ảnh hưởng tới Việt Nam thế nào? Lợi và hại.",
    description_en:
      "How has globalisation affected Vietnam? Benefits and drawbacks.",
    sample_questions: [
      "What are the most visible effects of globalisation in Vietnam?",
      "Has globalisation created more opportunities or more inequality?",
      "Is Vietnamese culture being lost or enriched?",
      "What industries benefit most? Which are hurt?",
      "Should Vietnam protect domestic industries from foreign competition?",
    ],
    vietnamese_speaker_tips: [
      "B2 essential: 'on a global scale', 'multinational corporations', 'cultural identity', 'economic integration'.",
      "Phát âm 'globalisation' /ˌgloʊ.bə.ləˈzeɪ.ʃən/ — Mỹ /-z-/, Anh /-s-/. Nhất quán một cách.",
      "Đừng nói 'globalisation makes us better' — quá vague. Cụ thể: 'Globalisation has expanded export markets, lifting GDP by X%'.",
      "Ý tưởng B2 high-band: 'Globalisation is a double-edged sword — it brings investment but also widens income gaps'.",
      "Cấu trúc passive: 'Local culture is being reshaped by Western media' — VSTEP B2 đánh giá Grammar cao khi dùng đúng passive.",
    ],
    key_vocabulary: [
      { word: "multinational", translation_vi: "đa quốc gia", pronunciation_ipa: "/ˌmʌl.t̬iˈnæʃ.ən.əl/", level: "B2" },
      { word: "economic integration", translation_vi: "hội nhập kinh tế", pronunciation_ipa: "/ˌɛk.əˈnɑː.mɪk ˌɪn.t̬əˈgreɪ.ʃən/", level: "B2" },
      { word: "cultural identity", translation_vi: "bản sắc văn hóa", pronunciation_ipa: "/ˈkʌl.tʃɚ.əl aɪˈdɛn.t̬ə.t̬i/", level: "B2" },
      { word: "income inequality", translation_vi: "bất bình đẳng thu nhập", pronunciation_ipa: "/ˈɪn.kʌm ˌɪn.ɪˈkwɑː.lə.t̬i/", level: "B2" },
    ],
    estimated_time_minutes: 5,
    typical_band_descriptors: B2_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b2_speaking_globalization/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b2_speaking_globalization/q1.mp3", "vstep-speaking/vstep_b2_speaking_globalization/q2.mp3", "vstep-speaking/vstep_b2_speaking_globalization/q3.mp3", "vstep-speaking/vstep_b2_speaking_globalization/q4.mp3", "vstep-speaking/vstep_b2_speaking_globalization/q5.mp3"],
  },
  {
    id: "vstep_b2_speaking_social_media_impact",
    level: "B2",
    part: 3,
    topic_title_vi: "Tác động của mạng xã hội",
    topic_title_en: "Social media impact",
    description_vi:
      "Mạng xã hội thay đổi cuộc sống thế nào? Ảnh hưởng lên người trẻ.",
    description_en:
      "How has social media changed life? Effect on young people.",
    sample_questions: [
      "What are the biggest changes social media has caused in Vietnam?",
      "Does social media improve or harm mental health?",
      "Is misinformation a serious problem in your community?",
      "Should there be age limits for social media accounts?",
      "Will TikTok-style content replace traditional media?",
    ],
    vietnamese_speaker_tips: [
      "Đừng nói 'Facebook is social media' đơn giản — đúng là 'Facebook is a social media platform'.",
      "B2 vocabulary: 'echo chamber', 'misinformation', 'influencer', 'content creator', 'doomscrolling'.",
      "Phát âm 'misinformation' /ˌmɪs.ɪn.fɚˈmeɪ.ʃən/ — schwa-heavy, không kéo /i/.",
      "B2 high-band tip: thừa nhận sự phức tạp — 'It's not entirely good or bad — it depends on how it's used'.",
      "Chuyển ý tự nhiên: 'That said...', 'Even so...', 'On a related note...'",
    ],
    key_vocabulary: [
      { word: "misinformation", translation_vi: "thông tin sai lệch", pronunciation_ipa: "/ˌmɪs.ɪn.fɚˈmeɪ.ʃən/", level: "B2" },
      { word: "echo chamber", translation_vi: "buồng vọng âm thông tin", pronunciation_ipa: "/ˈɛk.oʊ ˈtʃeɪm.bɚ/", level: "B2" },
      { word: "influencer", translation_vi: "người ảnh hưởng (mạng)", pronunciation_ipa: "/ˈɪn.flu.ən.sɚ/", level: "B2" },
      { word: "algorithm", translation_vi: "thuật toán (đề xuất)", pronunciation_ipa: "/ˈæl.gə.rɪð.əm/", level: "B2" },
    ],
    estimated_time_minutes: 5,
    typical_band_descriptors: B2_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b2_speaking_social_media_impact/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b2_speaking_social_media_impact/q1.mp3", "vstep-speaking/vstep_b2_speaking_social_media_impact/q2.mp3", "vstep-speaking/vstep_b2_speaking_social_media_impact/q3.mp3", "vstep-speaking/vstep_b2_speaking_social_media_impact/q4.mp3", "vstep-speaking/vstep_b2_speaking_social_media_impact/q5.mp3"],
  },
  {
    id: "vstep_b2_speaking_education_reform",
    level: "B2",
    part: 3,
    topic_title_vi: "Cải cách giáo dục",
    topic_title_en: "Education reform",
    description_vi:
      "Hệ thống giáo dục Việt Nam cần cải cách gì? Tại sao?",
    description_en:
      "What reforms does Vietnamese education need? Why?",
    sample_questions: [
      "What's the biggest weakness of the Vietnamese education system?",
      "Should rote memorisation be reduced?",
      "Are entrance exams the right way to assess students?",
      "How important is teaching critical thinking from primary school?",
      "Should English be a mandatory subject from grade 1?",
    ],
    vietnamese_speaker_tips: [
      "B2 advanced phrases: 'rote learning', 'critical thinking', 'standardised testing', 'curriculum overhaul'.",
      "Đừng dịch 'cải cách' = 'change' đơn giản — 'reform', 'overhaul', 'revamp' chính xác hơn.",
      "Khi đề xuất: 'I would propose...', 'It might help if...', 'A possible solution is to...'",
      "Phát âm 'curriculum' /kəˈrɪk.jə.ləm/ — stress thứ hai.",
      "Cấu trúc inverted B2-cao: 'Only by reforming X can we hope to achieve Y'.",
    ],
    key_vocabulary: [
      { word: "rote learning", translation_vi: "học vẹt", pronunciation_ipa: "/roʊt ˈlɝː.nɪŋ/", level: "B2" },
      { word: "curriculum", translation_vi: "chương trình học", pronunciation_ipa: "/kəˈrɪk.jə.ləm/", level: "B2" },
      { word: "critical thinking", translation_vi: "tư duy phản biện", pronunciation_ipa: "/ˈkrɪt̬.ɪ.kəl ˈθɪŋ.kɪŋ/", level: "B2" },
      { word: "standardised testing", translation_vi: "thi chuẩn hóa", pronunciation_ipa: "/ˈstæn.dɚ.daɪzd ˈtɛs.tɪŋ/", level: "B2" },
    ],
    estimated_time_minutes: 5,
    typical_band_descriptors: B2_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b2_speaking_education_reform/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b2_speaking_education_reform/q1.mp3", "vstep-speaking/vstep_b2_speaking_education_reform/q2.mp3", "vstep-speaking/vstep_b2_speaking_education_reform/q3.mp3", "vstep-speaking/vstep_b2_speaking_education_reform/q4.mp3", "vstep-speaking/vstep_b2_speaking_education_reform/q5.mp3"],
  },
  {
    id: "vstep_b2_speaking_work_life_balance",
    level: "B2",
    part: 3,
    topic_title_vi: "Cân bằng công việc và cuộc sống",
    topic_title_en: "Work-life balance",
    description_vi:
      "Sự cân bằng công việc-cuộc sống quan trọng thế nào? Văn hóa làm việc Việt Nam có hỗ trợ điều này không?",
    description_en:
      "How important is work-life balance? Does Vietnamese work culture support it?",
    sample_questions: [
      "Why has work-life balance become a popular topic recently?",
      "Is it realistic for employees in Vietnam today?",
      "Are companies responsible for protecting employees' personal time?",
      "Has remote work helped or hurt the balance?",
      "What does a healthy work culture look like to you?",
    ],
    vietnamese_speaker_tips: [
      "Hyphenated noun: 'work-life balance' — phải có dấu nối, viết đúng quan trọng cho writing.",
      "B2 phrases: 'overtime culture', 'burnout', 'always-on mentality', 'right to disconnect'.",
      "Đừng nói 'I have no balance' — đúng là 'I struggle with work-life balance' / 'My work-life balance is poor'.",
      "Phát âm 'balance' /ˈbæl.əns/ — schwa ở âm thứ hai, không /BAL-LANCE/.",
      "B2 high-band hedge: 'It depends on the industry — banking is harder than education in this regard'.",
    ],
    key_vocabulary: [
      { word: "overtime", translation_vi: "làm thêm giờ", pronunciation_ipa: "/ˈoʊ.vɚ.taɪm/", level: "B2" },
      { word: "burnout", translation_vi: "kiệt sức", pronunciation_ipa: "/ˈbɝːn.aʊt/", level: "B2" },
      { word: "boundaries", translation_vi: "ranh giới (cá nhân)", pronunciation_ipa: "/ˈbaʊn.dɚ.iz/", level: "B2" },
      { word: "remote work", translation_vi: "làm việc từ xa", pronunciation_ipa: "/rɪˈmoʊt wɝːk/", level: "B2" },
    ],
    estimated_time_minutes: 5,
    typical_band_descriptors: B2_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b2_speaking_work_life_balance/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b2_speaking_work_life_balance/q1.mp3", "vstep-speaking/vstep_b2_speaking_work_life_balance/q2.mp3", "vstep-speaking/vstep_b2_speaking_work_life_balance/q3.mp3", "vstep-speaking/vstep_b2_speaking_work_life_balance/q4.mp3", "vstep-speaking/vstep_b2_speaking_work_life_balance/q5.mp3"],
  },
  {
    id: "vstep_b2_speaking_role_of_government",
    level: "B2",
    part: 3,
    topic_title_vi: "Vai trò của chính phủ",
    topic_title_en: "The role of government",
    description_vi:
      "Chính phủ nên đóng vai trò thế nào trong các vấn đề như y tế, giáo dục, nhà ở?",
    description_en:
      "What role should government play in healthcare, education, and housing?",
    sample_questions: [
      "Should healthcare be entirely free? Why or why not?",
      "How much should the government regulate the housing market?",
      "Is private education a problem if public schools are underfunded?",
      "Should the government invest more in mental health?",
      "How transparent are public spending decisions in Vietnam?",
    ],
    vietnamese_speaker_tips: [
      "Tránh chính trị hóa — VSTEP examiner đánh giá ngôn ngữ, không quan điểm. Phát biểu cân bằng, có dẫn chứng.",
      "B2 vocabulary: 'subsidy', 'regulation', 'public sector', 'private sector', 'policy intervention'.",
      "Đừng dịch trực tiếp 'chính phủ làm tốt' — cụ thể: 'the administration has improved X' / 'public investment in Y has increased'.",
      "Modal verbs cho recommendation: 'should', 'ought to', 'need to'. Tránh 'must' (quá mạnh) và 'will' (như mệnh lệnh).",
      "Phát âm 'government' /ˈgʌv.ɚn.mənt/ — không phát âm chữ 'n' giữa rõ ràng.",
    ],
    key_vocabulary: [
      { word: "subsidy", translation_vi: "trợ cấp", pronunciation_ipa: "/ˈsʌb.sə.di/", level: "B2" },
      { word: "regulation", translation_vi: "quy định, điều tiết", pronunciation_ipa: "/ˌrɛg.jəˈleɪ.ʃən/", level: "B2" },
      { word: "public sector", translation_vi: "khu vực công", pronunciation_ipa: "/ˈpʌb.lɪk ˈsɛk.tɚ/", level: "B2" },
      { word: "transparency", translation_vi: "tính minh bạch", pronunciation_ipa: "/trænˈspɛr.ən.si/", level: "B2" },
    ],
    estimated_time_minutes: 5,
    typical_band_descriptors: B2_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b2_speaking_role_of_government/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b2_speaking_role_of_government/q1.mp3", "vstep-speaking/vstep_b2_speaking_role_of_government/q2.mp3", "vstep-speaking/vstep_b2_speaking_role_of_government/q3.mp3", "vstep-speaking/vstep_b2_speaking_role_of_government/q4.mp3", "vstep-speaking/vstep_b2_speaking_role_of_government/q5.mp3"],
  },
  {
    id: "vstep_b2_speaking_future_of_cities",
    level: "B2",
    part: 3,
    topic_title_vi: "Thành phố trong tương lai",
    topic_title_en: "The future of cities",
    description_vi:
      "Thành phố Việt Nam sẽ thay đổi thế nào trong 20 năm tới? Cơ hội và thách thức.",
    description_en:
      "How will Vietnamese cities change in the next 20 years? Opportunities and challenges.",
    sample_questions: [
      "What's the biggest challenge facing Hanoi or Ho Chi Minh City today?",
      "Will smart-city technology actually improve daily life?",
      "How can cities cope with rising temperatures?",
      "Should there be limits on how tall buildings can be?",
      "Will more young people leave cities for smaller towns?",
    ],
    vietnamese_speaker_tips: [
      "Future B2: 'will', 'is likely to', 'is set to', 'expected to'. Đa dạng để cao điểm Grammar.",
      "Vocabulary chủ đề: 'urban planning', 'smart city', 'green space', 'mass transit', 'gentrification'.",
      "Đừng dịch 'thành phố thông minh' = 'intelligent city' — đúng là 'smart city'.",
      "Phát âm 'urban' /ˈɝː.bən/ — không phát âm /r/ rõ trong American (mềm).",
      "Discourse marker B2 high: 'Looking ahead', 'In the long run', 'Over the next decade'.",
    ],
    key_vocabulary: [
      { word: "urban planning", translation_vi: "quy hoạch đô thị", pronunciation_ipa: "/ˈɝː.bən ˈplæn.ɪŋ/", level: "B2" },
      { word: "smart city", translation_vi: "thành phố thông minh", pronunciation_ipa: "/smɑːrt ˈsɪt̬.i/", level: "B2" },
      { word: "mass transit", translation_vi: "giao thông công cộng quy mô lớn", pronunciation_ipa: "/mæs ˈtræn.zɪt/", level: "B2" },
      { word: "gentrification", translation_vi: "đô thị hóa cao cấp", pronunciation_ipa: "/ˌdʒɛn.trə.fəˈkeɪ.ʃən/", level: "C1" },
    ],
    estimated_time_minutes: 5,
    typical_band_descriptors: B2_BAND_DESCRIPTORS,
    audioIntroKey: "vstep-speaking/vstep_b2_speaking_future_of_cities/intro.mp3",
    audioQuestionKeys: ["vstep-speaking/vstep_b2_speaking_future_of_cities/q1.mp3", "vstep-speaking/vstep_b2_speaking_future_of_cities/q2.mp3", "vstep-speaking/vstep_b2_speaking_future_of_cities/q3.mp3", "vstep-speaking/vstep_b2_speaking_future_of_cities/q4.mp3", "vstep-speaking/vstep_b2_speaking_future_of_cities/q5.mp3"],
  },
];

// ─────────────────────────────────────────────────────────────────────
// Convenience selectors used by the page
// ─────────────────────────────────────────────────────────────────────

export const VSTEP_B1_TOPICS: VstepSpeakingTopic[] = VSTEP_SPEAKING_TOPICS.filter(
  (t) => t.level === "B1",
);

export const VSTEP_B2_TOPICS: VstepSpeakingTopic[] = VSTEP_SPEAKING_TOPICS.filter(
  (t) => t.level === "B2",
);

export function findVstepTopicById(id: string): VstepSpeakingTopic | undefined {
  return VSTEP_SPEAKING_TOPICS.find((t) => t.id === id);
}
