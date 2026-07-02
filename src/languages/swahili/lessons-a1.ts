// src/languages/swahili/lessons-a1.ts
//
// Swahili (Kiswahili) A1 lessons for Vietnamese learners.
// Beginner survival pack: greetings, introductions, numbers 1-100, basic
// question words, food ordering, directions, and family.
//
// Each lesson carries Vietnamese L1 notes (cultural_notes_vi, tip_advice_vi,
// pronunciation_vi) and English companions (pronunciation_focus_en, *_en).
//
// Swahili uses the Latin alphabet and is largely phonetic — the big win
// for Vietnamese speakers: NO tones, NO grammatical gender, NO articles,
// NO verb conjugation by person (just prefix chains that are regular).
// Penultimate stress is predictable. The main A1 challenge is getting
// comfortable with noun-class prefixes (m-/wa-, ki-/vi-) and the
// subject-prefix + tense-marker verb pattern.

import type { SwahiliCategoryId } from "./lessons";

type LessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type SwahiliLesson = {
  id: string;
  category: SwahiliCategoryId;
  level: string;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: VocabEntry[];
  dialogue?: DialogueLine[];
  exercises?: Array<Record<string, unknown>>;
  content?: string;
};

export const lessons: SwahiliLesson[] = [
  // ───────────────────────────────────────────────────────────── greetings
  {
    id: "swahili_greetings_intro",
    level: "A1",
    category: "greetings",
    title_vi: "Chào hỏi cơ bản",
    title_en: "Basic greetings",
    sentences: [
      {
        en: "Hello! How are you?",
        vi: "Xin chào! Bạn khỏe không?",
        pronunciation_focus: [
          "Jambo! → JAM-bo (chào chung)",
          "Hujambo? → hu-JAM-bo (bạn khỏe không, số ít)",
          "Sijambo. → si-JAM-bo (tôi khỏe, đáp)",
          "hamjambo? → ham-JAM-bo (số nhiều)",
        ],
        pronunciation_focus_en: [
          "Jambo! → 'JAM-bo' — universal greeting, like 'hello'",
          "Hujambo? → 'hoo-JAM-bo' — 'how are you?' (singular); lit. 'do you have no problem?'",
          "Sijambo. → 'see-JAM-bo' — 'I'm fine'; the standard reply to Hujambo",
          "hamjambo? → 'ham-JAM-bo' — plural form; reply: Hatujambo (we're fine)",
        ],
      },
      {
        en: "What's the news? — Good! — Peaceful!",
        vi: "Có tin gì không? — Tốt! — Bình yên!",
        pronunciation_focus: [
          "Habari? → ha-BA-ri (tin tức, chào hỏi)",
          "Nzuri. → NZU-ri (tốt, đẹp)",
          "Salama. → sa-LA-ma (bình an)",
          "Habari gani? → ha-BA-ri GA-ni (tin gì?)",
        ],
        pronunciation_focus_en: [
          "Habari? → 'ha-BAH-ree' — literally 'news?', the most common everyday greeting",
          "Nzuri. → 'n-ZOO-ree' — 'good/beautiful'; the default answer to Habari",
          "Salama. → 'sa-LAH-mah' — 'peaceful/safe'; from Arabic salam",
          "Habari gani? → 'ha-BAH-ree GAH-nee' — 'what news?' (= 'how are things?')",
        ],
      },
      {
        en: "Good morning! Good afternoon! Good evening!",
        vi: "Chào buổi sáng! Chào buổi trưa! Chào buổi tối!",
        pronunciation_focus: [
          "Habari za asubuhi? → ... a-su-BU-hi",
          "Habari za mchana? → ... m-CHA-na",
          "Habari za jioni? → ... ji-O-ni",
          "za = của (giới từ sở hữu)",
        ],
        pronunciation_focus_en: [
          "Habari za asubuhi? → 'ha-BAH-ree zah a-soo-BOO-hee' — 'news of the morning?'",
          "Habari za mchana? → '... m-CHAH-nah' — 'news of the daytime?' (midday/afternoon)",
          "Habari za jioni? → '... jee-OH-nee' — 'news of the evening?'",
          "za = 'of' (possessive connector for n-class nouns like habari)",
        ],
      },
      {
        en: "Thank you very much. You're welcome.",
        vi: "Cảm ơn nhiều. Không có gì.",
        pronunciation_focus: [
          "Asante. → a-SAN-te (cảm ơn)",
          "Asante sana. → ... SA-na (cảm ơn nhiều)",
          "Karibu. → ka-RI-bu (không có gì)",
          "Karibu sana. → chào đón nồng nhiệt",
        ],
        pronunciation_focus_en: [
          "Asante. → 'ah-SAHN-teh' — 'thank you' (from Arabic)",
          "Asante sana. → '... SAH-nah' — 'thank you very much' (sana = very)",
          "Karibu. → 'kah-REE-boo' — 'you're welcome' (also means 'welcome!' as a host)",
          "Karibu sana. → 'you're most welcome' — the warm, full-response form",
        ],
      },
      {
        en: "Excuse me. Sorry. Goodbye! See you later!",
        vi: "Xin phép. Xin lỗi. Tạm biệt! Hẹn gặp lại!",
        pronunciation_focus: [
          "Samahani. → sa-ma-HA-ni (xin lỗi)",
          "Kwa heri. → kwa HE-ri (tạm biệt, số ít)",
          "Kwa herini. → ... he-RI-ni (số nhiều)",
          "Tutaonana. → tu-ta-o-NA-na (hẹn gặp lại)",
        ],
        pronunciation_focus_en: [
          "Samahani. → 'sah-mah-HAH-nee' — 'excuse me / sorry' (from Arabic samah)",
          "Kwa heri. → 'kwah HEH-ree' — 'goodbye' (to one person); from Arabic khayr (goodness)",
          "Kwa herini. → 'kwah heh-REE-nee' — 'goodbye' (to multiple people)",
          "Tutaonana. → 'too-tah-oh-NAH-nah' — 'we'll see each other' (tu- = we, -ta- = future, -onana = see each other)",
        ],
      },
      {
        en: "Respectful greeting to an elder.",
        vi: "Lời chào kính trọng với người lớn tuổi.",
        pronunciation_focus: [
          "Shikamoo. → shi-ka-MO-o (chào người lớn)",
          "Marahaba. → ma-ra-HA-ba (đáp lại)",
          "'Nashika miguu yako' = con ôm chân",
          "dùng với người già, giáo viên",
        ],
        pronunciation_focus_en: [
          "Shikamoo. → 'shee-kah-MOH-oh' — respectful greeting to elders; lit. 'I hold your feet'",
          "Marahaba. → 'mah-rah-HAH-bah' — the elder's response; from Arabic marhaba (welcome)",
          "Used when greeting elders, teachers, or respected figures — shows deep Swahili politeness",
          "Not used among peers; 'Hujambo' or 'Habari' is fine for same-age interactions",
        ],
      },
    ],
    cultural_notes_vi:
      "Chào hỏi là 'chìa khóa' trong văn hóa Swahili — người Đông Phi dành nhiều thời gian chào hỏi hơn người phương Tây. Ba cách chào chính: (1) 'Jambo!' / 'Hujambo?' = kiểu 'không có vấn đề gì chứ?', phổ biến với khách du lịch; (2) 'Habari?' = 'tin tức thế nào?', cách chào hàng ngày phổ biến NHẤT của người bản xứ; (3) 'Shikamoo' = chào kính trọng người già, trẻ em và thanh niên dùng khi chào người lớn tuổi. ĐIỂM DỄ cho người Việt: không có thanh điệu, trọng âm luôn rơi vào âm tiết ÁP CHÓT — quy tắc cực kỳ ổn định. 'Habari' linh hoạt nhất: thêm 'za asubuhi/mchana/jioni' để chỉ buổi. Người Swahili đánh giá cao nếu bạn dành thời gian chào hỏi đúng cách.",
    cultural_notes_en:
      "Greetings are the 'master key' in Swahili culture — East Africans spend far more time on greetings than Westerners. Three main greeting systems: (1) 'Jambo!' / 'Hujambo?' = the 'any problems?' format, common with tourists; (2) 'Habari?' = 'what's the news?', the MOST common native-speaker everyday greeting; (3) 'Shikamoo' = respectful greeting to elders, used by young people to older adults. EASY for Vietnamese speakers: no tones at all, and stress ALWAYS falls on the PENULTIMATE syllable — an extremely predictable rule. 'Habari' is the most flexible: add 'za asubuhi/mchana/jioni' for time of day. Swahili speakers deeply appreciate when you take the time to greet properly.",
    tip_advice_vi:
      "Mẹo ghi nhớ: 'Hujambo?' (bạn?) → 'Sijambo' (tôi). 'Hamjambo?' (các bạn?) → 'Hatujambo' (chúng tôi). Chỉ cần đổi tiền tố chủ ngữ: hu- (bạn) → si- (tôi), ham- (các bạn) → hatu- (chúng tôi). 'Habari?' là câu thần chú — dùng mọi lúc, đáp 'Nzuri' hoặc 'Salama'. ĐIỂM KHÓ cho người Việt: âm mũi 'ng'/'ng' như trong 'ng' tiếng Việt xuất hiện nhiều. Âm 'j' đọc như 'j' trong tiếng Anh 'job', KHÔNG phải 'j' tiếng Việt (như 'da'). 'r' đọc rung nhẹ đầu lưỡi (không như 'r' miền Bắc Việt Nam).",
    tip_advice_en:
      "Memory hook: 'Hujambo?' (you?) → 'Sijambo' (me). 'Hamjambo?' (you all?) → 'Hatujambo' (us). Just swap the subject prefix: hu- (you) → si- (I), ham- (you pl.) → hatu- (we). 'Habari?' is your magic word — use it anytime, answer 'Nzuri' or 'Salama'. Key sounds for Vietnamese speakers: Swahili 'j' = English 'job' (NOT like Vietnamese 'gi'). 'r' is a light tongue-tap (NOT like northern Vietnamese 'r'). Nasal combinations like 'ny', 'ng', 'ng' are frequent — similar to Vietnamese but in different positions.",
    vocabulary: [
      {
        word: "Jambo",
        en: "hello",
        vi: "xin chào",
        pos: "greeting",
        pronunciation_vi: "JAM-bo — 'j' như tiếng Anh 'job'",
        pronunciation_en: "JAM-bo — 'j' as in 'job'",
      },
      {
        word: "Hujambo?",
        en: "how are you? (singular)",
        vi: "bạn khỏe không?",
        pos: "greeting",
        pronunciation_vi: "hu-JAM-bo",
        pronunciation_en: "hoo-JAM-bo",
      },
      {
        word: "Sijambo",
        en: "I'm fine (reply)",
        vi: "tôi khỏe",
        pos: "response",
        pronunciation_vi: "si-JAM-bo",
        pronunciation_en: "see-JAM-bo",
      },
      {
        word: "Habari?",
        en: "what's the news? / how are things?",
        vi: "có tin gì không?",
        pos: "greeting",
        pronunciation_vi: "ha-BA-ri",
        pronunciation_en: "hah-BAH-ree",
      },
      {
        word: "Nzuri",
        en: "good / fine",
        vi: "tốt / khỏe",
        pos: "adjective",
        pronunciation_vi: "NZU-ri — bắt đầu bằng âm 'nz'",
        pronunciation_en: "n-ZOO-ree — starts with 'nz' together",
      },
      {
        word: "Salama",
        en: "peaceful / safe",
        vi: "bình an",
        pos: "adjective",
        pronunciation_vi: "sa-LA-ma",
        pronunciation_en: "sah-LAH-mah",
      },
      {
        word: "Asante",
        en: "thank you",
        vi: "cảm ơn",
        pos: "interjection",
        pronunciation_vi: "a-SAN-te",
        pronunciation_en: "ah-SAHN-teh",
      },
      {
        word: "Asante sana",
        en: "thank you very much",
        vi: "cảm ơn nhiều",
        pos: "phrase",
        pronunciation_vi: "a-SAN-te SA-na",
        pronunciation_en: "ah-SAHN-teh SAH-nah",
      },
      {
        word: "Karibu",
        en: "you're welcome / welcome!",
        vi: "không có gì / chào mừng!",
        pos: "interjection",
        pronunciation_vi: "ka-RI-bu",
        pronunciation_en: "kah-REE-boo",
      },
      {
        word: "Samahani",
        en: "excuse me / sorry",
        vi: "xin lỗi",
        pos: "interjection",
        pronunciation_vi: "sa-ma-HA-ni",
        pronunciation_en: "sah-mah-HAH-nee",
      },
      {
        word: "Kwa heri",
        en: "goodbye (singular)",
        vi: "tạm biệt",
        pos: "phrase",
        pronunciation_vi: "kwa HE-ri",
        pronunciation_en: "kwah HEH-ree",
      },
      {
        word: "Tutaonana",
        en: "see you later",
        vi: "hẹn gặp lại",
        pos: "phrase",
        pronunciation_vi: "tu-ta-o-NA-na",
        pronunciation_en: "too-tah-oh-NAH-nah",
      },
      {
        word: "Shikamoo",
        en: "respectful greeting to elder",
        vi: "chào kính trọng (người lớn)",
        pos: "greeting",
        pronunciation_vi: "shi-ka-MO-o",
        pronunciation_en: "shee-kah-MOH-oh",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        text: "Hujambo? Habari gani?",
        vi: "Bạn khỏe không? Có tin gì mới?",
        en: "How are you? What's the news?",
      },
      {
        speaker: "B",
        text: "Sijambo! Nzuri sana. Na wewe?",
        vi: "Tôi khỏe! Rất tốt. Còn bạn?",
        en: "I'm fine! Very good. And you?",
      },
      {
        speaker: "A",
        text: "Salama tu. Asante kwa kuuliza.",
        vi: "Bình an thôi. Cảm ơn bạn đã hỏi.",
        en: "Just peaceful. Thanks for asking.",
      },
      {
        speaker: "B",
        text: "Karibu. Tutaonana kesho!",
        vi: "Không có gì. Hẹn gặp lại ngày mai!",
        en: "You're welcome. See you tomorrow!",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền lời chào phù hợp:",
        instruction_en: "Fill in the right greeting:",
        pronunciation_focus: ["Hujambo", "Habari", "Shikamoo"],
        pronunciation_focus_en: [
          "Hujambo → 'hoo-JAM-bo' (how are you, singular)",
          "Habari → 'hah-BAH-ree' (what's the news?)",
          "Shikamoo → 'shee-kah-MOH-oh' (respectful greeting to elder)",
        ],
        items: [
          {
            prompt: "___? (Bạn khỏe không?)",
            answer: "Hujambo",
            options: ["Hujambo", "Kwa heri", "Karibu"],
          },
          {
            prompt: "___ gani? (Có tin gì?)",
            answer: "Habari",
            options: ["Habari", "Asante", "Nzuri"],
          },
          {
            prompt: "___, babu! (Chào ông, thưa ông!)",
            answer: "Shikamoo",
            options: ["Jambo", "Shikamoo", "Samahani"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối lời chào với nghĩa tiếng Việt:",
        instruction_en: "Match each greeting with its meaning:",
        pronunciation_focus: ["Asante", "Karibu", "Kwa heri"],
        pronunciation_focus_en: [
          "Asante → 'ah-SAHN-teh' (thank you)",
          "Karibu → 'kah-REE-boo' (you're welcome)",
          "Kwa heri → 'kwah HEH-ree' (goodbye)",
        ],
        items: [
          { prompt: "Asante", answer: "cảm ơn" },
          { prompt: "Karibu", answer: "không có gì" },
          { prompt: "Samahani", answer: "xin lỗi" },
          { prompt: "Tutaonana", answer: "hẹn gặp lại" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Swahili:",
        instruction_en: "Translate into Swahili:",
        pronunciation_focus: ["Habari za asubuhi", "Asante sana"],
        pronunciation_focus_en: [
          "Habari za asubuhi → 'hah-BAH-ree zah ah-soo-BOO-hee' (good morning)",
          "Asante sana → 'ah-SAHN-teh SAH-nah' (thank you very much)",
        ],
        items: [
          { prompt: "Chào buổi sáng! Bạn khỏe không?", answer: "Habari za asubuhi! Hujambo?" },
          { prompt: "Cảm ơn nhiều! Tạm biệt!", answer: "Asante sana! Kwa heri!" },
          { prompt: "Tôi khỏe. Hẹn gặp lại!", answer: "Sijambo. Tutaonana!" },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────── introductions
  {
    id: "swahili_introductions",
    level: "A1",
    category: "introductions",
    title_vi: "Giới thiệu bản thân",
    title_en: "Introducing yourself",
    sentences: [
      {
        en: "My name is Linh.",
        vi: "Tên tôi là Linh.",
        pronunciation_focus: [
          "Jina langu ni ___. → JI-na LAN-gu ni",
          "jina = tên, -angu = của tôi",
          "ni = là (động từ 'to be')",
          "trật tự: Jina langu ni Linh",
        ],
        pronunciation_focus_en: [
          "Jina langu ni ___. → 'JEE-nah LAHN-goo nee' — 'name my is ___'",
          "jina = name; -angu = my (possessive suffix)",
          "ni = is/are (the copula verb)",
          "Word order: Jina langu ni [name]; 'name my is Linh'",
        ],
      },
      {
        en: "What is your name?",
        vi: "Bạn tên là gì?",
        pronunciation_focus: [
          "Jina lako ni nani? → ... LA-ko ni NA-ni",
          "nani? = ai? (hỏi tên dùng 'ai')",
          "-ako = của bạn (sở hữu)",
          "lako = li- + -ako (lớp ji-/ma-)",
        ],
        pronunciation_focus_en: [
          "Jina lako ni nani? → 'JEE-nah LAH-ko nee NAH-nee' — 'name your is who?'",
          "nani? = who? — Swahili asks a name with 'who', not 'what'",
          "-ako = your (possessive suffix)",
          "lako = li- (noun-class prefix for ji-/ma- class) + -ako (your)",
        ],
      },
      {
        en: "I am from Vietnam.",
        vi: "Tôi đến từ Việt Nam.",
        pronunciation_focus: [
          "Ninatoka ___. → ni-na-TO-ka (tôi đến từ)",
          "ni- = tôi, -na- = thì hiện tại",
          "Vietnam → vi-e-ti-NA-mu",
          "không chia động từ theo ngôi",
        ],
        pronunciation_focus_en: [
          "Ninatoka ___. → 'nee-nah-TOH-kah' — 'I come from ___'",
          "ni- = I (subject prefix); -na- = present tense marker",
          "Vietnam → 'vee-eh-tee-NAH-moo' in Swahili pronunciation",
          "No conjugation by person: ninatoka, unatoka, anatoka — only the prefix changes",
        ],
      },
      {
        en: "Nice to meet you.",
        vi: "Rất vui được gặp bạn.",
        pronunciation_focus: [
          "Ninafuraha → ni-na-fu-RA-ha (tôi vui)",
          "kukutana → ku-ku-TA-na (gặp nhau)",
          "na wewe → na WE-we (với bạn)",
          "Ninafuraha kukutana na wewe.",
        ],
        pronunciation_focus_en: [
          "Ninafuraha → 'nee-nah-foo-RAH-hah' — 'I'm happy'",
          "kukutana → 'koo-koo-TAH-nah' — 'to meet each other' (ku- = infinitive, -ana = reciprocal)",
          "na wewe → 'nah WEH-weh' — 'with you'",
          "'Ninafuraha kukutana na wewe' = 'I am happy to meet with you'",
        ],
      },
      {
        en: "I speak a little Swahili.",
        vi: "Tôi nói được một chút tiếng Swahili.",
        pronunciation_focus: [
          "Ninaongea → ni-na-o-NGE-a (tôi nói)",
          "Kiswahili → ki-swa-HI-li",
          "kidogo → ki-DO-go (một chút)",
          "Ninaongea Kiswahili kidogo.",
        ],
        pronunciation_focus_en: [
          "Ninaongea → 'nee-nah-oh-NGEH-ah' — 'I speak' (ongea = speak/converse)",
          "Kiswahili → 'kee-swa-HEE-lee' — the Swahili language (ki- = language prefix)",
          "kidogo → 'kee-DOH-go' — 'a little' (ki- class adjective)",
          "'Ninaongea Kiswahili kidogo' = 'I speak Swahili a little'",
        ],
      },
    ],
    cultural_notes_vi:
      "Người Swahili dùng 'mimi' (tôi) và 'wewe' (bạn). ĐIỂM DỄ cho người Việt: động từ KHÔNG chia theo ngôi như tiếng Anh hay tiếng Pháp — chỉ thay đổi tiền tố chủ ngữ: ninapenda (tôi thích), unapenda (bạn thích), anapenda (anh ấy/cô ấy thích) — phần gốc 'penda' LUÔN giữ nguyên. Sở hữu đặt SAU danh từ: jina langu (tên của tôi), không phải 'langu jina'. Hỏi tên dùng 'nani' (ai), không phải 'nini' (gì). Người Swahili thường hỏi 'Unatoka wapi?' (Bạn từ đâu đến?) sớm trong cuộc trò chuyện — đó là cách thể hiện sự quan tâm, không phải soi mói.",
    cultural_notes_en:
      "Swahili speakers use 'mimi' (I/me) and 'wewe' (you). EASY for Vietnamese speakers: verbs DON'T conjugate by person — only the subject prefix changes: ninapenda (I like), unapenda (you like), anapenda (he/she likes) — the root 'penda' ALWAYS stays the same. The possessive follows the noun: jina langu (my name), not 'langu jina'. Ask a name with 'nani' (who), not 'nini' (what). Swahili speakers often ask 'Unatoka wapi?' (Where are you from?) early in conversation — it shows interest, not intrusion.",
    tip_advice_vi:
      "Khung câu vàng: 'Jina langu ni ___. Ninatoka ___. Ninafuraha kukutana na wewe.' Chỉ cần thay tên và nơi chốn. Mẹo người Việt: nhớ sở hữu ngược (jina langu, không phải langu jina). Tiền tố động từ cực kỳ logic: ni- (tôi), u- (bạn), a- (anh ấy/cô ấy), tu- (chúng tôi), m- (các bạn), wa- (họ). -na- = thì hiện tại. Học thuộc ni- + -na- + [động từ gốc] là bạn có thể tạo hàng trăm câu.",
    tip_advice_en:
      "Golden frame: 'Jina langu ni ___. Ninatoka ___. Ninafuraha kukutana na wewe.' Swap only the name and place. For Vietnamese learners: the reversed possessive (jina langu, not langu jina) is the main habit to build. The verb prefix system is extremely logical: ni- (I), u- (you), a- (he/she), tu- (we), m- (you pl.), wa- (they). -na- = present tense. Master ni- + -na- + [verb root] and you can make hundreds of sentences.",
    vocabulary: [
      {
        word: "jina",
        en: "name",
        vi: "tên",
        pos: "noun (ji-/ma-)",
        pronunciation_vi: "JI-na",
        pronunciation_en: "JEE-nah",
      },
      {
        word: "mimi",
        en: "I / me",
        vi: "tôi",
        pos: "pronoun",
        pronunciation_vi: "MI-mi",
        pronunciation_en: "MEE-mee",
      },
      {
        word: "wewe",
        en: "you (singular)",
        vi: "bạn",
        pos: "pronoun",
        pronunciation_vi: "WE-we",
        pronunciation_en: "WEH-weh",
      },
      {
        word: "nani",
        en: "who",
        vi: "ai",
        pos: "question word",
        pronunciation_vi: "NA-ni",
        pronunciation_en: "NAH-nee",
      },
      {
        word: "ninatoka",
        en: "I come from",
        vi: "tôi đến từ",
        pos: "verb phrase",
        pronunciation_vi: "ni-na-TO-ka",
        pronunciation_en: "nee-nah-TOH-kah",
      },
      {
        word: "ninafuraha",
        en: "I am happy",
        vi: "tôi vui",
        pos: "verb phrase",
        pronunciation_vi: "ni-na-fu-RA-ha",
        pronunciation_en: "nee-nah-foo-RAH-hah",
      },
      {
        word: "kukutana",
        en: "to meet each other",
        vi: "gặp nhau",
        pos: "verb (infinitive)",
        pronunciation_vi: "ku-ku-TA-na",
        pronunciation_en: "koo-koo-TAH-nah",
      },
      {
        word: "Kiswahili",
        en: "the Swahili language",
        vi: "tiếng Swahili",
        pos: "noun (ki-)",
        pronunciation_vi: "ki-swa-HI-li",
        pronunciation_en: "kee-swah-HEE-lee",
      },
      {
        word: "kidogo",
        en: "a little",
        vi: "một chút",
        pos: "adverb",
        pronunciation_vi: "ki-DO-go",
        pronunciation_en: "kee-DOH-go",
      },
      {
        word: "na",
        en: "and / with",
        vi: "và / với",
        pos: "conjunction / preposition",
        pronunciation_vi: "na",
        pronunciation_en: "nah",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        text: "Halo! Jina lako ni nani?",
        vi: "Xin chào! Bạn tên là gì?",
        en: "Hello! What is your name?",
      },
      {
        speaker: "B",
        text: "Jina langu ni Linh. Ninatoka Vietnam. Na wewe?",
        vi: "Tên tôi là Linh. Tôi đến từ Việt Nam. Còn bạn?",
        en: "My name is Linh. I'm from Vietnam. And you?",
      },
      {
        speaker: "A",
        text: "Mimi ni Juma, ninatoka Tanzania. Ninafuraha kukutana na wewe.",
        vi: "Tôi là Juma, đến từ Tanzania. Rất vui được gặp bạn.",
        en: "I'm Juma, from Tanzania. Nice to meet you.",
      },
      {
        speaker: "B",
        text: "Ninafuraha pia! Ninaongea Kiswahili kidogo.",
        vi: "Tôi cũng rất vui! Tôi nói được một chút tiếng Swahili.",
        en: "Nice to meet you too! I speak a little Swahili.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu:",
        instruction_en: "Fill in the missing word:",
        pronunciation_focus: ["jina", "nani", "ninafuraha"],
        pronunciation_focus_en: [
          "jina → 'JEE-nah' (name)",
          "nani → 'NAH-nee' (who)",
          "ninafuraha → 'nee-nah-foo-RAH-hah' (I am happy)",
        ],
        items: [
          {
            prompt: "___ langu ni Linh. (Tên tôi là Linh)",
            answer: "Jina",
            options: ["Jina", "Nani", "Mimi"],
          },
          {
            prompt: "Jina lako ni ___? (Bạn tên là ai?)",
            answer: "nani",
            options: ["nini", "nani", "wapi"],
          },
          {
            prompt: "___ kukutana na wewe. (Tôi vui được gặp bạn)",
            answer: "Ninafuraha",
            options: ["Ninafuraha", "Ninapenda", "Ninatoka"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối đại từ với nghĩa:",
        instruction_en: "Match the pronoun with its meaning:",
        pronunciation_focus: ["mimi", "wewe", "yeye"],
        pronunciation_focus_en: [
          "mimi → 'MEE-mee' (I/me)",
          "wewe → 'WEH-weh' (you)",
          "yeye → 'YEH-yeh' (he/she)",
        ],
        items: [
          { prompt: "mimi", answer: "tôi" },
          { prompt: "wewe", answer: "bạn" },
          { prompt: "yeye", answer: "anh ấy / cô ấy" },
          { prompt: "sisi", answer: "chúng tôi" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Swahili:",
        instruction_en: "Translate into Swahili:",
        pronunciation_focus: ["Jina langu ni", "Ninatoka"],
        pronunciation_focus_en: [
          "Jina langu ni → 'JEE-nah LAHN-goo nee' (my name is)",
          "Ninatoka → 'nee-nah-TOH-kah' (I come from)",
        ],
        items: [
          { prompt: "Tên tôi là Linh.", answer: "Jina langu ni Linh." },
          { prompt: "Tôi đến từ Việt Nam.", answer: "Ninatoka Vietnam." },
          { prompt: "Rất vui được gặp bạn.", answer: "Ninafuraha kukutana na wewe." },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────── numbers
  {
    id: "swahili_numbers_1_100",
    level: "A1",
    category: "numbers",
    title_vi: "Số đếm 1–100",
    title_en: "Numbers 1–100",
    sentences: [
      {
        en: "One, two, three, four, five.",
        vi: "Một, hai, ba, bốn, năm.",
        pronunciation_focus: [
          "moja → MO-ja (1)",
          "mbili → MBI-li (2)",
          "tatu → TA-tu (3)",
          "nne → NNe (4), tano → TA-no (5)",
        ],
        pronunciation_focus_en: [
          "moja → 'MOH-jah' (1)",
          "mbili → 'm-BEE-lee' (2) — 'mb' is pronounced together",
          "tatu → 'TAH-too' (3)",
          "nne → 'n-NEH' (4) — double 'n'; tano → 'TAH-noh' (5)",
        ],
      },
      {
        en: "Six, seven, eight, nine, ten.",
        vi: "Sáu, bảy, tám, chín, mười.",
        pronunciation_focus: [
          "sita → SI-ta (6) — gốc Ả Rập",
          "saba → SA-ba (7) — gốc Ả Rập",
          "nane → NA-ne (8)",
          "tisa → TI-sa (9), kumi → KU-mi (10)",
        ],
        pronunciation_focus_en: [
          "sita → 'SEE-tah' (6) — from Arabic sitta",
          "saba → 'SAH-bah' (7) — from Arabic sab'a",
          "nane → 'NAH-neh' (8) — native Bantu root",
          "tisa → 'TEE-sah' (9) — from Arabic tis'a; kumi → 'KOO-mee' (10)",
        ],
      },
      {
        en: "Eleven, twelve, fifteen, nineteen.",
        vi: "Mười một, mười hai, mười lăm, mười chín.",
        pronunciation_focus: [
          "kumi na moja → KU-mi na MO-ja (11)",
          "kumi na mbili → ... MBI-li (12)",
          "kumi na tano → ... TA-no (15)",
          "kumi na + số = 'mười + số'",
        ],
        pronunciation_focus_en: [
          "kumi na moja → 'KOO-mee nah MOH-jah' (11) = 'ten and one'",
          "kumi na mbili → '... m-BEE-lee' (12) = 'ten and two'",
          "kumi na tano → '... TAH-noh' (15) = 'ten and five'",
          "kumi na + number = 'ten and ...'; very regular, like Vietnamese 'mười ...'",
        ],
      },
      {
        en: "Twenty, twenty-one, fifty.",
        vi: "Hai mươi, hai mươi mốt, năm mươi.",
        pronunciation_focus: [
          "ishirini → i-shi-RI-ni (20)",
          "ishirini na moja → ... MO-ja (21)",
          "hamsini → ham-SI-ni (50)",
          "số tròn chục từ tiếng Ả Rập",
        ],
        pronunciation_focus_en: [
          "ishirini → 'ee-shee-REE-nee' (20) — from Arabic 'ishrin",
          "ishirini na moja → add 'na moja' for 21 = 'twenty and one'",
          "hamsini → 'hahm-SEE-nee' (50) — from Arabic khamsin",
          "Tens are mostly Arabic-derived; the 'na + digit' pattern is Bantu logic",
        ],
      },
      {
        en: "One hundred.",
        vi: "Một trăm.",
        pronunciation_focus: [
          "mia moja → MI-a MO-ja (100)",
          "mia = trăm",
          "mia mbili = 200, mia tatu = 300",
          "ghép: mia + số đếm",
        ],
        pronunciation_focus_en: [
          "mia moja → 'MEE-ah MOH-jah' (100) = 'hundred one'",
          "mia = hundred; just stack mia + the multiplier",
          "mia mbili = 200, mia tatu = 300",
          "Logic: like Vietnamese 'một trăm, hai trăm' but the number comes AFTER mia",
        ],
      },
    ],
    cultural_notes_vi:
      "Hệ số Swahili là sự PHA TRỘN giữa gốc Bantu (1–5, 8) và gốc Ả Rập (6, 7, 9, và TẤT CẢ số tròn chục từ 20 trở lên). ĐIỂM DỄ cho người Việt: cấu trúc 'kumi na [số]' = 'mười [số]', rất giống tiếng Việt. 'ishirini na moja' = 'hai mươi và một' cũng giống hệt cách ta nói. Quy tắc: số từ 1–5, 8 đi sau danh từ phải CÓ tiền tố lớp danh từ (ví dụ: watu wawili = người hai, vitabu vitatu = sách ba) — gọi là 'sự hòa hợp số', khác biệt LỚN NHẤT với tiếng Việt. Nhưng khi ĐẾM KHÔNG (không có danh từ), dùng dạng gốc: moja, mbili, tatu...",
    cultural_notes_en:
      "The Swahili number system is a BLEND of Bantu roots (1–5, 8) and Arabic roots (6, 7, 9, and ALL tens from 20 up). EASY for Vietnamese speakers: the pattern 'kumi na [number]' = 'ten [number]' mirrors Vietnamese exactly. 'ishirini na moja' = 'twenty and one' — same logic. Rule: when numbers 1–5, 8 follow a noun, they must take the noun-class PREFIX (e.g., watu wawili = 'people two', vitabu vitatu = 'books three') — this 'number agreement' is the single BIGGEST difference from Vietnamese. But when counting in the abstract (no noun), use the bare forms: moja, mbili, tatu...",
    tip_advice_vi:
      "Học 1–10 cho thuộc, rồi mọi số khác chỉ là ghép. 13 = kumi na tatu (mười và ba), 30 = thelathini (ba mươi), 33 = thelathini na tatu. Mẹo: các số tròn chục thuộc gốc Ả Rập, nghe như biến âm của số: sita (6) → sitini (60), saba (7) → sabini (70). SỰ HÒA HỢP SỐ: ở A1 chỉ cần biết nó TỒN TẠI, chưa cần thuộc — khi đếm không thì dùng dạng gốc. 'na' = 'và', dùng để nối chục + đơn vị.",
    tip_advice_en:
      "Master 1–10 cold; everything else is assembly. 13 = kumi na tatu (ten and three), 30 = thelathini (thirty), 33 = thelathini na tatu. Tip: the tens are Arabic-derived and sound like mutations of the digits: sita (6) → sitini (60), saba (7) → sabini (70). NUMBER AGREEMENT: at A1 you only need to know it EXISTS — for abstract counting use the bare forms. 'na' = 'and', the connector for tens + units.",
    vocabulary: [
      {
        word: "moja",
        en: "one (1)",
        vi: "một",
        pos: "number",
        pronunciation_vi: "MO-ja",
        pronunciation_en: "MOH-jah",
      },
      {
        word: "tano",
        en: "five (5)",
        vi: "năm",
        pos: "number",
        pronunciation_vi: "TA-no",
        pronunciation_en: "TAH-noh",
      },
      {
        word: "kumi",
        en: "ten (10)",
        vi: "mười",
        pos: "number",
        pronunciation_vi: "KU-mi",
        pronunciation_en: "KOO-mee",
      },
      {
        word: "kumi na moja",
        en: "eleven (11)",
        vi: "mười một",
        pos: "number",
        pronunciation_vi: "KU-mi na MO-ja",
        pronunciation_en: "KOO-mee nah MOH-jah",
      },
      {
        word: "kumi na mbili",
        en: "twelve (12)",
        vi: "mười hai",
        pos: "number",
        pronunciation_vi: "KU-mi na MBI-li",
        pronunciation_en: "KOO-mee nah m-BEE-lee",
      },
      {
        word: "ishirini",
        en: "twenty (20)",
        vi: "hai mươi",
        pos: "number",
        pronunciation_vi: "i-shi-RI-ni",
        pronunciation_en: "ee-shee-REE-nee",
      },
      {
        word: "hamsini",
        en: "fifty (50)",
        vi: "năm mươi",
        pos: "number",
        pronunciation_vi: "ham-SI-ni",
        pronunciation_en: "hahm-SEE-nee",
      },
      {
        word: "mia moja",
        en: "one hundred (100)",
        vi: "một trăm",
        pos: "number",
        pronunciation_vi: "MI-a MO-ja",
        pronunciation_en: "MEE-ah MOH-jah",
      },
      {
        word: "thelathini",
        en: "thirty (30)",
        vi: "ba mươi",
        pos: "number",
        pronunciation_vi: "the-la-THI-ni",
        pronunciation_en: "theh-lah-THEE-nee",
      },
      {
        word: "arobaini",
        en: "forty (40)",
        vi: "bốn mươi",
        pos: "number",
        pronunciation_vi: "a-ro-ba-I-ni",
        pronunciation_en: "ah-roh-bah-EE-nee",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        text: "Una miaka mingapi?",
        vi: "Bạn bao nhiêu tuổi?",
        en: "How old are you?",
      },
      {
        speaker: "B",
        text: "Nina miaka ishirini na mitano.",
        vi: "Tôi hai mươi lăm tuổi.",
        en: "I'm twenty-five years old.",
      },
      {
        speaker: "A",
        text: "Nambari yako ya simu ni ipi?",
        vi: "Số điện thoại của bạn là gì?",
        en: "What's your phone number?",
      },
      {
        speaker: "B",
        text: "Sifuri saba sita tano, nne tatu mbili...",
        vi: "Không bảy sáu năm, bốn ba hai...",
        en: "Zero seven six five, four three two...",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Viết số bằng chữ:",
        instruction_en: "Write the number in words:",
        pronunciation_focus: ["kumi na tatu", "thelathini", "mia moja"],
        pronunciation_focus_en: [
          "kumi na tatu → 'KOO-mee nah TAH-too' (13)",
          "thelathini → 'theh-lah-THEE-nee' (30)",
          "mia moja → 'MEE-ah MOH-jah' (100)",
        ],
        items: [
          {
            prompt: "13 = ___",
            answer: "kumi na tatu",
            options: ["kumi na tatu", "thelathini", "mia tatu"],
          },
          {
            prompt: "30 = ___",
            answer: "thelathini",
            options: ["kumi na tatu", "thelathini", "mia tatu"],
          },
          {
            prompt: "100 = ___",
            answer: "mia moja",
            options: ["kumi", "mia moja", "elfu moja"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối số với chữ:",
        instruction_en: "Match the digit with its word:",
        pronunciation_focus: ["nne", "saba", "tisa"],
        pronunciation_focus_en: [
          "nne → 'n-NEH' (4)",
          "saba → 'SAH-bah' (7)",
          "tisa → 'TEE-sah' (9)",
        ],
        items: [
          { prompt: "4", answer: "nne" },
          { prompt: "7", answer: "saba" },
          { prompt: "9", answer: "tisa" },
          { prompt: "20", answer: "ishirini" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch số sang tiếng Swahili:",
        instruction_en: "Translate the number into Swahili:",
        pronunciation_focus: ["ishirini na tano", "hamsini"],
        pronunciation_focus_en: [
          "ishirini na tano → 'ee-shee-REE-nee nah TAH-noh' (25)",
          "hamsini → 'hahm-SEE-nee' (50)",
        ],
        items: [
          { prompt: "25", answer: "ishirini na tano" },
          { prompt: "50", answer: "hamsini" },
          { prompt: "100", answer: "mia moja" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────── questions
  {
    id: "swahili_question_words",
    level: "A1",
    category: "questions",
    title_vi: "Từ để hỏi cơ bản",
    title_en: "Basic question words",
    sentences: [
      {
        en: "What is this?",
        vi: "Đây là cái gì?",
        pronunciation_focus: [
          "Nini? → NI-ni (gì)",
          "hii → HI-i (này, cái này)",
          "Hii ni nini? = Đây là gì?",
          "ni = là (động từ 'to be')",
        ],
        pronunciation_focus_en: [
          "Nini? → 'NEE-nee' — 'what'",
          "hii → 'HEE-ee' — 'this' (i-/zi- class demonstrative)",
          "Hii ni nini? = 'this is what?'",
          "ni = is/are; word order: [thing] ni nini (what)",
        ],
      },
      {
        en: "Who is that?",
        vi: "Người kia là ai?",
        pronunciation_focus: [
          "Nani? → NA-ni (ai)",
          "yule → YU-le (người kia)",
          "Yule ni nani? = Đó là ai?",
          "nani dùng cho người",
        ],
        pronunciation_focus_en: [
          "Nani? → 'NAH-nee' — 'who'",
          "yule → 'YOO-leh' — 'that person' (wa- class)",
          "Yule ni nani? = 'that (person) is who?'",
          "nani is strictly for people",
        ],
      },
      {
        en: "Where is the toilet?",
        vi: "Nhà vệ sinh ở đâu?",
        pronunciation_focus: [
          "Wapi? → WA-pi (ở đâu)",
          "choo → CHO-o (nhà vệ sinh)",
          "Choo kiko wapi? = WC ở đâu?",
          "kiko = nó ở (lớp ki-/vi-)",
        ],
        pronunciation_focus_en: [
          "Wapi? → 'WAH-pee' — 'where'",
          "choo → 'CHOH-oh' — 'toilet'",
          "Choo kiko wapi? = 'toilet is where?' — kiko = 'it is located' (ki-/vi- class)",
          "Swahili uses locative subject prefixes: kiko (ki- class), yuko (person), kipo (place)",
        ],
      },
      {
        en: "How much is this?",
        vi: "Cái này giá bao nhiêu?",
        pronunciation_focus: [
          "Bei gani? → BE-i GA-ni (giá bao nhiêu)",
          "shilingi ngapi? → shi-LI-ngi NGA-pi",
          "gani = loại nào (chất lượng)",
          "ngapi = bao nhiêu (số lượng)",
        ],
        pronunciation_focus_en: [
          "Bei gani? → 'BEH-ee GAH-nee' — 'what price?' (gani = what kind of)",
          "shilingi ngapi? → 'shee-LEEN-gee n-GAH-pee' — 'how many shillings?'",
          "gani = 'what kind/which' (quality); ngapi = 'how many' (quantity)",
          "Distinction: gani asks about type, ngapi asks about count",
        ],
      },
      {
        en: "When and why?",
        vi: "Khi nào và tại sao?",
        pronunciation_focus: [
          "Lini? → LI-ni (khi nào)",
          "Kwa nini? → kwa NI-ni (tại sao)",
          "Vipi? → VI-pi (như thế nào)",
          "Je, ...? → JE (tiểu từ nghi vấn)",
        ],
        pronunciation_focus_en: [
          "Lini? → 'LEE-nee' — 'when'",
          "Kwa nini? → 'kwah NEE-nee' — 'why' (literally 'for what?')",
          "Vipi? → 'VEE-pee' — 'how'",
          "Je, ...? → 'JEH' — sentence-initial question particle; 'Je, unakwenda?' = 'Are you going?'",
        ],
      },
    ],
    cultural_notes_vi:
      "Tám từ hỏi cốt lõi: nini (gì), nani (ai), wapi (ở đâu), lini (khi nào), kwa nini (tại sao), vipi (như thế nào), gani (loại nào), ngapi (bao nhiêu). ĐIỂM DỄ cho người Việt: cấu trúc câu hỏi KHÔNG đảo trợ động từ như tiếng Anh — chỉ cần đặt từ hỏi vào cuối câu hoặc dùng 'Je,' ở đầu câu. Thú vị: Swahili phân biệt 'gani' (loại nào) và 'ngapi' (bao nhiêu), giống cách tiếng Việt phân biệt 'gì' và 'bao nhiêu'. 'Kwa nini?' nghĩa đen là 'cho cái gì?' = 'tại sao?', cách hỏi rất trực quan. 'Wapi?' khi hỏi vị trí phải đi với tiền tố chỉ vị trí phù hợp với lớp danh từ của chủ ngữ (yuko wapi?, kiko wapi?, kipo wapi?) — ở A1 chỉ cần học thuộc vài mẫu cố định.",
    cultural_notes_en:
      "Eight core question words: nini (what), nani (who), wapi (where), lini (when), kwa nini (why), vipi (how), gani (which/what kind), ngapi (how many). EASY for Vietnamese speakers: NO auxiliary inversion like English — just put the question word at the end or use sentence-initial 'Je,'. Interesting: Swahili distinguishes 'gani' (what kind) and 'ngapi' (how many), similar to Vietnamese 'gì' vs 'bao nhiêu'. 'Kwa nini?' literally means 'for what?' = 'why?', a very intuitive construction. 'Wapi?' for location questions must agree with the subject's noun class via locative prefixes (yuko wapi?, kiko wapi?, kipo wapi?) — at A1 just memorize a few fixed patterns.",
    tip_advice_vi:
      "Mẹo nhớ bộ ba: nani (ai → người), nini (gì → vật), wapi (ở đâu → nơi chốn). 'Je,' là tiểu từ nghi vấn đa năng: chỉ cần thêm 'Je,' trước câu trần thuật là thành câu hỏi. Phân biệt: 'gani' hỏi về loại/chất (Unakaa gani? = Bạn thế nào?), 'ngapi' hỏi số lượng (Watu wangapi? = Bao nhiêu người?). 'Kwa nini' phân tích được: 'kwa' (bởi/cho) + 'nini' (gì) = 'cho cái gì' = tại sao.",
    tip_advice_en:
      "Memory hook for the core trio: nani (who → people), nini (what → things), wapi (where → places). 'Je,' is the universal question particle: just add 'Je,' before any statement to make it a question. Distinguish: 'gani' asks about type/kind (Unakaa gani? = How are you doing?), 'ngapi' asks about count (Watu wangapi? = How many people?). 'Kwa nini' is analyzable: 'kwa' (by/for) + 'nini' (what) = 'for what' = why.",
    vocabulary: [
      {
        word: "nini",
        en: "what",
        vi: "gì / cái gì",
        pos: "question word",
        pronunciation_vi: "NI-ni",
        pronunciation_en: "NEE-nee",
      },
      {
        word: "nani",
        en: "who",
        vi: "ai",
        pos: "question word",
        pronunciation_vi: "NA-ni",
        pronunciation_en: "NAH-nee",
      },
      {
        word: "wapi",
        en: "where",
        vi: "ở đâu",
        pos: "question word",
        pronunciation_vi: "WA-pi",
        pronunciation_en: "WAH-pee",
      },
      {
        word: "lini",
        en: "when",
        vi: "khi nào",
        pos: "question word",
        pronunciation_vi: "LI-ni",
        pronunciation_en: "LEE-nee",
      },
      {
        word: "kwa nini",
        en: "why",
        vi: "tại sao",
        pos: "question phrase",
        pronunciation_vi: "kwa NI-ni",
        pronunciation_en: "kwah NEE-nee",
      },
      {
        word: "vipi",
        en: "how",
        vi: "như thế nào",
        pos: "question word",
        pronunciation_vi: "VI-pi",
        pronunciation_en: "VEE-pee",
      },
      {
        word: "gani",
        en: "which / what kind of",
        vi: "loại nào",
        pos: "question word",
        pronunciation_vi: "GA-ni",
        pronunciation_en: "GAH-nee",
      },
      {
        word: "ngapi",
        en: "how many",
        vi: "bao nhiêu",
        pos: "question word",
        pronunciation_vi: "NGA-pi",
        pronunciation_en: "n-GAH-pee",
      },
      {
        word: "hii",
        en: "this",
        vi: "này / đây",
        pos: "demonstrative",
        pronunciation_vi: "HI-i",
        pronunciation_en: "HEE-ee",
      },
      {
        word: "bei",
        en: "price",
        vi: "giá",
        pos: "noun (n-)",
        pronunciation_vi: "BE-i",
        pronunciation_en: "BEH-ee",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        text: "Hii ni nini?",
        vi: "Đây là cái gì?",
        en: "What is this?",
      },
      {
        speaker: "B",
        text: "Hii ni kitabu. Ile ni begi langu.",
        vi: "Đây là quyển sách. Kia là túi của tôi.",
        en: "This is a book. That is my bag.",
      },
      {
        speaker: "A",
        text: "Bei gani kitabu hiki?",
        vi: "Quyển sách này giá bao nhiêu?",
        en: "How much is this book?",
      },
      {
        speaker: "B",
        text: "Shilingi elfu kumi.",
        vi: "Mười nghìn shilling.",
        en: "Ten thousand shillings.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn từ để hỏi đúng:",
        instruction_en: "Choose the correct question word:",
        pronunciation_focus: ["nini", "nani", "wapi"],
        pronunciation_focus_en: [
          "nini → 'NEE-nee' (what)",
          "nani → 'NAH-nee' (who)",
          "wapi → 'WAH-pee' (where)",
        ],
        items: [
          {
            prompt: "Hii ni ___? (Đây là gì?)",
            answer: "nini",
            options: ["nini", "nani", "wapi"],
          },
          {
            prompt: "Yule ni ___? (Người kia là ai?)",
            answer: "nani",
            options: ["nini", "nani", "lini"],
          },
          {
            prompt: "Choo kiko ___? (Nhà vệ sinh ở đâu?)",
            answer: "wapi",
            options: ["wapi", "gani", "kwa nini"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ hỏi với nghĩa:",
        instruction_en: "Match the question word with its meaning:",
        pronunciation_focus: ["lini", "kwa nini", "vipi"],
        pronunciation_focus_en: [
          "lini → 'LEE-nee' (when)",
          "kwa nini → 'kwah NEE-nee' (why)",
          "vipi → 'VEE-pee' (how)",
        ],
        items: [
          { prompt: "lini", answer: "khi nào" },
          { prompt: "kwa nini", answer: "tại sao" },
          { prompt: "ngapi", answer: "bao nhiêu" },
          { prompt: "vipi", answer: "như thế nào" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Swahili:",
        instruction_en: "Translate into Swahili:",
        pronunciation_focus: ["wapi", "bei gani"],
        pronunciation_focus_en: [
          "wapi → 'WAH-pee' (where)",
          "bei gani → 'BEH-ee GAH-nee' (what price)",
        ],
        items: [
          { prompt: "Nhà vệ sinh ở đâu?", answer: "Choo kiko wapi?" },
          { prompt: "Đây là cái gì?", answer: "Hii ni nini?" },
          { prompt: "Cái này giá bao nhiêu?", answer: "Bei gani hii?" },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────── food
  {
    id: "swahili_food_ordering",
    level: "A1",
    category: "food",
    title_vi: "Gọi món ăn",
    title_en: "Ordering food",
    sentences: [
      {
        en: "I want rice and beans, please.",
        vi: "Cho tôi cơm và đậu.",
        pronunciation_focus: [
          "Nataka → na-TA-ka (tôi muốn)",
          "wali → WA-li (cơm)",
          "maharage → ma-ha-RA-ge (đậu)",
          "wali na maharage = cơm đậu",
        ],
        pronunciation_focus_en: [
          "Nataka → 'nah-TAH-kah' — 'I want'; -taka = want; na- = I (present)",
          "wali → 'WAH-lee' — 'cooked rice'",
          "maharage → 'mah-hah-RAH-geh' — 'beans'",
          "wali na maharage = 'rice and beans' — the classic East African meal",
        ],
      },
      {
        en: "One chicken and one fish.",
        vi: "Một gà và một cá.",
        pronunciation_focus: [
          "kuku → KU-ku (gà)",
          "samaki → sa-MA-ki (cá)",
          "kuku moja na samaki moja",
          "tính từ số đếm SAU danh từ",
        ],
        pronunciation_focus_en: [
          "kuku → 'KOO-koo' — 'chicken'",
          "samaki → 'sah-MAH-kee' — 'fish' (from Arabic samak)",
          "kuku moja na samaki moja = 'one chicken and one fish'",
          "Numbers follow the noun: kuku moja (chicken one), not moja kuku",
        ],
      },
      {
        en: "A cup of tea and a glass of water.",
        vi: "Một tách trà và một ly nước.",
        pronunciation_focus: [
          "chai → CHA-i (trà)",
          "maji → MA-ji (nước)",
          "chai ya maji → chai nước",
          "kahawa → ka-HA-wa (cà phê)",
        ],
        pronunciation_focus_en: [
          "chai → 'CHAH-ee' — 'tea' (chai is the same word across Swahili, Hindi, Arabic!)",
          "maji → 'MAH-jee' — 'water' (ma- class, always plural in form)",
          "chai ya maji = 'tea of water' = 'water' (as a drink)",
          "kahawa → 'kah-HAH-wah' — 'coffee' (from Arabic qahwa)",
        ],
      },
      {
        en: "Is it spicy? It's very delicious.",
        vi: "Có cay không? Ngon lắm.",
        pronunciation_focus: [
          "pilipili → pi-li-PI-li (ớt / cay)",
          "tamu → TA-mu (ngon / ngọt)",
          "tamu sana → ngon lắm",
          "hakuna pilipili → không cay",
        ],
        pronunciation_focus_en: [
          "pilipili → 'pee-lee-PEE-lee' — 'pepper/chili' (reduplication = intensity)",
          "tamu → 'TAH-moo' — 'delicious / sweet'",
          "tamu sana → 'very delicious' (sana = very)",
          "hakuna pilipili → 'there is no pepper' = 'it's not spicy'",
        ],
      },
      {
        en: "How much is the total? Here you go.",
        vi: "Tổng cộng bao nhiêu? Đây ạ.",
        pronunciation_focus: [
          "Jumla ni ngapi? → JUM-la ni NGA-pi",
          "jumla = tổng cộng",
          "Tafadhali → ta-fa-DHA-li (làm ơn)",
          "Asante → a-SAN-te (cảm ơn)",
        ],
        pronunciation_focus_en: [
          "Jumla ni ngapi? → 'JOOM-lah nee n-GAH-pee' — 'the total is how much?'",
          "jumla → 'JOOM-lah' — 'total' (from Arabic jumla)",
          "Tafadhali → 'tah-fah-THAH-lee' — 'please' (Arabic tafaDDal, 'dh' = soft 'th' as in 'the')",
          "Asante → 'thank you'; always say it when paying!",
        ],
      },
    ],
    cultural_notes_vi:
      "Món quốc dân: ugali (bột ngô đặc, lương thực chính), wali (cơm), nyama choma (thịt nướng), samaki (cá), chapati (bánh mì dẹt kiểu Ấn). Bữa sáng: chai (trà) + mandazi (bánh rán). Đồ uống: chai (trà — RẤT phổ biến), kahawa (cà phê), maji (nước). ĐIỂM DỄ cho người Việt: cấu trúc 'danh từ + tính từ' giống tiếng Việt (nyama choma = 'thịt nướng', không phải 'nướng thịt'). 'Pilipili' (ớt/cay) lặp âm — cách tạo từ rất phổ biến trong tiếng Swahili. Gọi món dùng 'Nataka ___' (Tôi muốn ___) hoặc lịch sự hơn 'Naomba ___' (Tôi xin ___).",
    cultural_notes_en:
      "National dishes: ugali (stiff maize porridge, THE staple), wali (rice), nyama choma (grilled meat), samaki (fish), chapati (Indian-style flatbread). Breakfast: chai (tea) + mandazi (doughnuts). Drinks: chai (tea — VERY popular), kahawa (coffee), maji (water). EASY for Vietnamese: 'noun + adjective' order matches exactly (nyama choma = 'meat grilled', like 'thịt nướng'). 'Pilipili' (pepper/spicy) is a reduplication — a very common word-building pattern in Swahili. Order with 'Nataka ___' (I want) or more politely 'Naomba ___' (I request/I pray).",
    tip_advice_vi:
      "Ba câu sống còn ở quán: 'Nataka ___' (gọi món), 'Bei gani?' (bao nhiêu tiền), 'Tamu sana!' (ngon lắm). Mẹo: 'sana' (rất) đặt SAU tính từ — tamu sana (ngon lắm), ghali sana (đắt lắm). 'Tafadhali' (làm ơn) dùng khi nhờ làm gì. 'Naomba' lịch sự hơn 'Nataka' (nghĩa đen là 'tôi cầu xin', nhưng trong ngữ cảnh gọi món là 'tôi xin'). 'Chakula' (thức ăn) và 'Mlo' (bữa ăn) — phân biệt nếu cần.",
    tip_advice_en:
      "Three survival lines at any eatery: 'Nataka ___' (to order), 'Bei gani?' (how much), 'Tamu sana!' (very delicious). Tip: 'sana' (very) comes AFTER the adjective — tamu sana, ghali sana (very expensive). 'Tafadhali' = please (when requesting). 'Naomba' is more polite than 'Nataka' (literally 'I pray/request', but in ordering it's just 'I'd like'). 'Chakula' (food) vs 'Mlo' (meal) — useful distinction.",
    vocabulary: [
      {
        word: "nataka",
        en: "I want",
        vi: "tôi muốn",
        pos: "verb phrase",
        pronunciation_vi: "na-TA-ka",
        pronunciation_en: "nah-TAH-kah",
      },
      {
        word: "wali",
        en: "cooked rice",
        vi: "cơm",
        pos: "noun (u-)",
        pronunciation_vi: "WA-li",
        pronunciation_en: "WAH-lee",
      },
      {
        word: "nyama choma",
        en: "grilled meat",
        vi: "thịt nướng",
        pos: "noun",
        pronunciation_vi: "NYA-ma CHO-ma",
        pronunciation_en: "NYAH-mah CHOH-mah",
      },
      {
        word: "samaki",
        en: "fish",
        vi: "cá",
        pos: "noun (n-)",
        pronunciation_vi: "sa-MA-ki",
        pronunciation_en: "sah-MAH-kee",
      },
      {
        word: "chai",
        en: "tea",
        vi: "trà",
        pos: "noun (n-)",
        pronunciation_vi: "CHA-i",
        pronunciation_en: "CHAH-ee",
      },
      {
        word: "kahawa",
        en: "coffee",
        vi: "cà phê",
        pos: "noun (n-)",
        pronunciation_vi: "ka-HA-wa",
        pronunciation_en: "kah-HAH-wah",
      },
      {
        word: "maji",
        en: "water",
        vi: "nước",
        pos: "noun (ma-)",
        pronunciation_vi: "MA-ji",
        pronunciation_en: "MAH-jee",
      },
      {
        word: "tamu",
        en: "delicious / sweet",
        vi: "ngon / ngọt",
        pos: "adjective",
        pronunciation_vi: "TA-mu",
        pronunciation_en: "TAH-moo",
      },
      {
        word: "pilipili",
        en: "pepper / spicy",
        vi: "ớt / cay",
        pos: "noun / adjective",
        pronunciation_vi: "pi-li-PI-li",
        pronunciation_en: "pee-lee-PEE-lee",
      },
      {
        word: "tafadhali",
        en: "please",
        vi: "làm ơn",
        pos: "interjection",
        pronunciation_vi: "ta-fa-DHA-li — 'dh' như 'th' trong 'the'",
        pronunciation_en: "tah-fah-THAH-lee — 'dh' is soft 'th' as in 'the'",
      },
    ],
    dialogue: [
      {
        speaker: "Mhudumu",
        text: "Habari za mchana! Nataka nini?",
        vi: "Chào buổi trưa! Anh/chị muốn gọi gì?",
        en: "Good afternoon! What would you like?",
      },
      {
        speaker: "Mteja",
        text: "Nataka wali na samaki, tafadhali. Na maji pia.",
        vi: "Cho tôi cơm và cá, làm ơn. Và nước nữa.",
        en: "I'd like rice and fish, please. And water too.",
      },
      {
        speaker: "Mhudumu",
        text: "Unapenda pilipili au la?",
        vi: "Bạn thích cay hay không?",
        en: "Do you like it spicy or not?",
      },
      {
        speaker: "Mteja",
        text: "Pilipili kidogo tu. Jumla ni ngapi?",
        vi: "Chỉ một chút cay thôi. Tổng cộng bao nhiêu?",
        en: "Just a little spice. How much is the total?",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu khi gọi món:",
        instruction_en: "Fill in the missing ordering word:",
        pronunciation_focus: ["nataka", "tamu", "pilipili"],
        pronunciation_focus_en: [
          "nataka → 'nah-TAH-kah' (I want)",
          "tamu → 'TAH-moo' (delicious)",
          "pilipili → 'pee-lee-PEE-lee' (spicy)",
        ],
        items: [
          {
            prompt: "___ wali na kuku. (Tôi muốn cơm và gà)",
            answer: "Nataka",
            options: ["Nataka", "Ninafuraha", "Ninakaa"],
          },
          {
            prompt: "Hakuna ___, tafadhali. (Không cay, làm ơn)",
            answer: "pilipili",
            options: ["pilipili", "tamu", "chai"],
          },
          {
            prompt: "Chakula hiki ni ___ sana! (Món này ngon lắm)",
            answer: "tamu",
            options: ["tamu", "pilipili", "ghali"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối món/đồ uống với nghĩa:",
        instruction_en: "Match the dish/drink with its meaning:",
        pronunciation_focus: ["wali", "maji", "nyama choma"],
        pronunciation_focus_en: [
          "wali → 'WAH-lee' (cooked rice)",
          "maji → 'MAH-jee' (water)",
          "nyama choma → 'NYAH-mah CHOH-mah' (grilled meat)",
        ],
        items: [
          { prompt: "wali", answer: "cơm" },
          { prompt: "samaki", answer: "cá" },
          { prompt: "chai", answer: "trà" },
          { prompt: "maji", answer: "nước" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Swahili:",
        instruction_en: "Translate into Swahili:",
        pronunciation_focus: ["nataka", "bei gani"],
        pronunciation_focus_en: [
          "nataka → 'nah-TAH-kah' (I want)",
          "bei gani → 'BEH-ee GAH-nee' (what price / how much)",
        ],
        items: [
          { prompt: "Cho tôi một ly cà phê.", answer: "Nataka kahawa moja." },
          { prompt: "Cái này có cay không?", answer: "Hii ina pilipili?" },
          { prompt: "Tổng cộng bao nhiêu tiền?", answer: "Jumla ni ngapi?" },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────── directions
  {
    id: "swahili_directions",
    level: "A1",
    category: "directions",
    title_vi: "Hỏi đường",
    title_en: "Asking for directions",
    sentences: [
      {
        en: "Excuse me, where is the station?",
        vi: "Xin lỗi, nhà ga ở đâu?",
        pronunciation_focus: [
          "Samahani → sa-ma-HA-ni (xin lỗi)",
          "stesheni → ste-SHE-ni (nhà ga)",
          "iko wapi? → I-ko WA-pi (nó ở đâu)",
          "Stesheni iko wapi?",
        ],
        pronunciation_focus_en: [
          "Samahani → 'sah-mah-HAH-nee' — 'excuse me' to open a request",
          "stesheni → 'steh-SHEH-nee' — 'station' (English loanword)",
          "iko wapi? → 'EE-koh WAH-pee' — 'where is it?' (n-class inanimate)",
          "'Stesheni iko wapi?' = 'Station is where?'",
        ],
      },
      {
        en: "Go straight ahead.",
        vi: "Đi thẳng.",
        pronunciation_focus: [
          "Moja kwa moja → MO-ja kwa MO-ja",
          "enda → EN-da (đi!)",
          "Enda moja kwa moja.",
          "nenda = đi",
        ],
        pronunciation_focus_en: [
          "Moja kwa moja → 'MOH-jah kwah MOH-jah' — 'straight ahead' (literally 'one by one')",
          "enda → 'EHN-dah' — 'go!' (imperative)",
          "'Enda moja kwa moja.' = 'Go straight ahead.'",
          "nenda = go (infinitive); enda = go! (command)",
        ],
      },
      {
        en: "Turn left, then turn right.",
        vi: "Rẽ trái, rồi rẽ phải.",
        pronunciation_focus: [
          "Pinda kushoto. → PIN-da ku-SHO-to",
          "kushoto → ku-SHO-to (trái)",
          "kulia → ku-LI-a (phải)",
          "kisha = rồi / sau đó",
        ],
        pronunciation_focus_en: [
          "Pinda kushoto. → 'PEEN-dah koo-SHOH-toh' — 'turn left'",
          "kushoto → 'koo-SHOH-toh' — 'left' (ku- = locative/infinitive prefix)",
          "kulia → 'koo-LEE-ah' — 'right'",
          "kisha → 'KEE-shah' — 'then / afterwards'",
        ],
      },
      {
        en: "It's near here. It's not far.",
        vi: "Gần đây thôi. Không xa.",
        pronunciation_focus: [
          "Karibu → ka-RI-bu (gần)",
          "mbali → MBA-li (xa)",
          "hapa → HA-pa (ở đây)",
          "Si mbali. → SI MBA-li (Không xa)",
        ],
        pronunciation_focus_en: [
          "Karibu → 'kah-REE-boo' — 'near' (same word as 'welcome'!)",
          "mbali → 'm-BAH-lee' — 'far'",
          "hapa → 'HAH-pah' — 'here' (specific location)",
          "'Si mbali.' = 'It's not far.' (si- = negative prefix)",
        ],
      },
      {
        en: "In front of the market, behind the mosque.",
        vi: "Trước chợ, sau nhà thờ Hồi giáo.",
        pronunciation_focus: [
          "Mbele ya → MBE-le ya (phía trước)",
          "Nyuma ya → NYU-ma ya (phía sau)",
          "soko → SO-ko (chợ)",
          "msikiti → m-si-KI-ti (nhà thờ)",
        ],
        pronunciation_focus_en: [
          "Mbele ya → 'm-BEH-leh yah' — 'in front of'",
          "Nyuma ya → 'NYOO-mah yah' — 'behind'",
          "soko → 'SOH-koh' — 'market' (from Arabic suq)",
          "msikiti → 'm-see-KEE-tee' — 'mosque' (from Arabic masjid)",
        ],
      },
    ],
    cultural_notes_vi:
      "Mở đầu lịch sự: 'Samahani, ___ iko wapi?' (Xin lỗi, ___ ở đâu?). Từ chỉ hướng cốt lõi: moja kwa moja (thẳng), kushoto (trái), kulia (phải), karibu (gần), mbali (xa). Vị trí: mbele ya (trước), nyuma ya (sau), kando ya (bên cạnh), karibu na (gần). ĐIỂM DỄ cho người Việt: không có giống đực/cái, chỉ cần xác định LỚP DANH TỪ của vật để chọn 'iko' / 'yuko' / 'kiko'. Hầu hết đồ vật không phải người dùng 'iko'. Người Đông Phi rất thân thiện chỉ đường; từ 'karibu' vừa có nghĩa 'gần' vừa có nghĩa 'chào mừng' — cùng một thái độ hiếu khách!",
    cultural_notes_en:
      "Polite opener: 'Samahani, ___ iko wapi?' ('Excuse me, where is ___?'). Core direction words: moja kwa moja (straight), kushoto (left), kulia (right), karibu (near), mbali (far). Position words: mbele ya (in front), nyuma ya (behind), kando ya (beside), karibu na (near). EASY for Vietnamese speakers: no gendered forms — just match the NOUN CLASS of the object to choose 'iko' / 'yuko' / 'kiko'. Most inanimate objects use 'iko'. East Africans are very friendly with directions; the word 'karibu' means both 'near' AND 'welcome' — same hospitality mindset!",
    tip_advice_vi:
      "Combo hỏi đường: 'Samahani, ___ iko wapi?' → nghe 'moja kwa moja / kushoto / kulia'. Mẹo người Việt: 'Moja kwa moja' nghĩa đen là 'một bởi một' — dễ nhớ. 'iko' = nó ở (lớp n- và hầu hết đồ vật), 'yuko' = người đó ở, 'kiko' = vật lớp ki-/vi- ở. Học một mẫu chính: '___ iko wapi?' là đủ cho hầu hết tình huống du lịch. 'Mbele ya' và 'Nyuma ya' luôn có 'ya' (của) — 'phía trước CỦA', 'phía sau CỦA'.",
    tip_advice_en:
      "Direction combo: 'Samahani, ___ iko wapi?' → listen for 'moja kwa moja / kushoto / kulia'. For Vietnamese: 'Moja kwa moja' literally means 'one by one' — easy to remember. 'iko' = it is (n-class and most inanimate), 'yuko' = he/she is, 'kiko' = it is (ki-/vi- class). Learn one master pattern: '___ iko wapi?' covers most tourist situations. 'Mbele ya' and 'Nyuma ya' always take 'ya' (of) — 'front OF', 'back OF'.",
    vocabulary: [
      {
        word: "wapi",
        en: "where",
        vi: "ở đâu",
        pos: "question word",
        pronunciation_vi: "WA-pi",
        pronunciation_en: "WAH-pee",
      },
      {
        word: "moja kwa moja",
        en: "straight ahead",
        vi: "đi thẳng",
        pos: "phrase",
        pronunciation_vi: "MO-ja kwa MO-ja",
        pronunciation_en: "MOH-jah kwah MOH-jah",
      },
      {
        word: "kushoto",
        en: "left",
        vi: "trái",
        pos: "direction",
        pronunciation_vi: "ku-SHO-to",
        pronunciation_en: "koo-SHOH-toh",
      },
      {
        word: "kulia",
        en: "right",
        vi: "phải",
        pos: "direction",
        pronunciation_vi: "ku-LI-a",
        pronunciation_en: "koo-LEE-ah",
      },
      {
        word: "karibu",
        en: "near / close",
        vi: "gần",
        pos: "adjective",
        pronunciation_vi: "ka-RI-bu",
        pronunciation_en: "kah-REE-boo",
      },
      {
        word: "mbali",
        en: "far",
        vi: "xa",
        pos: "adjective",
        pronunciation_vi: "MBA-li",
        pronunciation_en: "m-BAH-lee",
      },
      {
        word: "mbele ya",
        en: "in front of",
        vi: "phía trước",
        pos: "preposition",
        pronunciation_vi: "MBE-le ya",
        pronunciation_en: "m-BEH-leh yah",
      },
      {
        word: "nyuma ya",
        en: "behind",
        vi: "phía sau",
        pos: "preposition",
        pronunciation_vi: "NYU-ma ya",
        pronunciation_en: "NYOO-mah yah",
      },
      {
        word: "soko",
        en: "market",
        vi: "chợ",
        pos: "noun (ma-)",
        pronunciation_vi: "SO-ko",
        pronunciation_en: "SOH-koh",
      },
      {
        word: "enda",
        en: "go! (command)",
        vi: "đi!",
        pos: "verb (imperative)",
        pronunciation_vi: "EN-da",
        pronunciation_en: "EHN-dah",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        text: "Samahani, soko liko wapi?",
        vi: "Xin lỗi, chợ ở đâu?",
        en: "Excuse me, where is the market?",
      },
      {
        speaker: "B",
        text: "Enda moja kwa moja, kisha pinda kulia.",
        vi: "Đi thẳng, rồi rẽ phải.",
        en: "Go straight, then turn right.",
      },
      {
        speaker: "A",
        text: "Ni mbali kutoka hapa?",
        vi: "Có xa đây không?",
        en: "Is it far from here?",
      },
      {
        speaker: "B",
        text: "Hapana, ni karibu. Iko mbele ya msikiti.",
        vi: "Không, gần thôi. Ở trước nhà thờ.",
        en: "No, it's near. It's in front of the mosque.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ chỉ hướng đúng:",
        instruction_en: "Fill in the correct direction word:",
        pronunciation_focus: ["moja kwa moja", "kushoto", "kulia"],
        pronunciation_focus_en: [
          "moja kwa moja → 'MOH-jah kwah MOH-jah' (straight ahead)",
          "kushoto → 'koo-SHOH-toh' (left)",
          "kulia → 'koo-LEE-ah' (right)",
        ],
        items: [
          {
            prompt: "Enda ___ kwa ___. (Đi thẳng)",
            answer: "moja kwa moja",
            options: ["moja kwa moja", "karibu", "mbali"],
          },
          {
            prompt: "Pinda ___. (Rẽ trái)",
            answer: "kushoto",
            options: ["kushoto", "kulia", "mbele"],
          },
          {
            prompt: "Soko liko ___ ya msikiti. (Chợ ở trước nhà thờ)",
            answer: "mbele",
            options: ["mbele", "nyuma", "mbali"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        instruction_en: "Match the word with its meaning:",
        pronunciation_focus: ["karibu", "mbali", "nyuma ya"],
        pronunciation_focus_en: [
          "karibu → 'kah-REE-boo' (near)",
          "mbali → 'm-BAH-lee' (far)",
          "nyuma ya → 'NYOO-mah yah' (behind)",
        ],
        items: [
          { prompt: "karibu", answer: "gần" },
          { prompt: "mbali", answer: "xa" },
          { prompt: "mbele ya", answer: "phía trước" },
          { prompt: "nyuma ya", answer: "phía sau" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Swahili:",
        instruction_en: "Translate into Swahili:",
        pronunciation_focus: ["iko wapi", "pinda kulia"],
        pronunciation_focus_en: [
          "iko wapi → 'EE-koh WAH-pee' (where is it)",
          "pinda kulia → 'PEEN-dah koo-LEE-ah' (turn right)",
        ],
        items: [
          { prompt: "Xin lỗi, nhà ga ở đâu?", answer: "Samahani, stesheni iko wapi?" },
          { prompt: "Đi thẳng rồi rẽ trái.", answer: "Enda moja kwa moja kisha pinda kushoto." },
          { prompt: "Có gần đây không?", answer: "Ni karibu kutoka hapa?" },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────── family
  {
    id: "swahili_family",
    level: "A1",
    category: "family",
    title_vi: "Gia đình",
    title_en: "Family",
    sentences: [
      {
        en: "This is my father and my mother.",
        vi: "Đây là cha tôi và mẹ tôi.",
        pronunciation_focus: [
          "Baba → BA-ba (cha)",
          "Mama → MA-ma (mẹ)",
          "baba yangu / mama yangu",
          "yangu = của tôi",
        ],
        pronunciation_focus_en: [
          "Baba → 'BAH-bah' — 'father'",
          "Mama → 'MAH-mah' — 'mother'",
          "baba yangu / mama yangu = 'my father / my mother'",
          "yangu = my (possessive, n-class form); follows the noun",
        ],
      },
      {
        en: "I have an older brother and a younger sister.",
        vi: "Tôi có anh trai và em gái.",
        pronunciation_focus: [
          "Nina kaka → NI-na KA-ka (tôi có anh)",
          "kaka → KA-ka (anh trai)",
          "dada → DA-da (chị gái)",
          "ndugu → NDU-gu (anh chị em)",
        ],
        pronunciation_focus_en: [
          "Nina kaka → 'NEE-nah KAH-kah' — 'I have an older brother'",
          "kaka → 'KAH-kah' — 'older brother' (specifically male)",
          "dada → 'DAH-dah' — 'older sister' (specifically female)",
          "Unlike Indonesian kakak, Swahili kaka/dada MARK gender from the start",
        ],
      },
      {
        en: "My older brother, my younger sister.",
        vi: "Anh trai tôi, em gái tôi.",
        pronunciation_focus: [
          "kaka yangu → KA-ka YAN-gu (anh tôi)",
          "dada yangu → DA-da YAN-gu (chị tôi)",
          "ndugu yangu mdogo → em tôi",
          "mdogo = nhỏ hơn, mkubwa = lớn hơn",
        ],
        pronunciation_focus_en: [
          "kaka yangu → 'KAH-kah YAHN-goo' — 'my older brother'",
          "dada yangu → 'DAH-dah YAHN-goo' — 'my older sister'",
          "ndugu yangu mdogo → 'my younger sibling' (mdogo = small/younger)",
          "mdogo (younger) vs mkubwa (older) — adjectives that agree with m-/wa- class",
        ],
      },
      {
        en: "How many siblings do you have?",
        vi: "Bạn có mấy anh chị em?",
        pronunciation_focus: [
          "Una ndugu wangapi? → ... wa-NGA-pi",
          "wangapi = bao nhiêu (wa- class)",
          "ndugu = anh chị em ruột",
          "Una = bạn có (u- + -na)",
        ],
        pronunciation_focus_en: [
          "Una ndugu wangapi? → 'OO-nah n-DOO-goo wahn-GAH-pee' — 'you have how many siblings?'",
          "wangapi → 'how many' with wa- prefix for people (m-/wa- class)",
          "ndugu → 'n-DOO-goo' — 'sibling/blood relative'",
          "Una = 'you have'; u- (you) + -na (present tense with 'have' meaning)",
        ],
      },
      {
        en: "This is my child, and these are my grandparents.",
        vi: "Đây là con tôi, và đây là ông bà tôi.",
        pronunciation_focus: [
          "mtoto → MTO-to (con / đứa trẻ)",
          "babu → BA-bu (ông)",
          "bibi → BI-bi (bà)",
          "familia → fa-MI-li-a (gia đình)",
        ],
        pronunciation_focus_en: [
          "mtoto → 'm-TOH-toh' — 'child' (m-/wa- class: mtoto/watoto)",
          "babu → 'BAH-boo' — 'grandfather' (Arabic influence)",
          "bibi → 'BEE-bee' — 'grandmother' (also means 'lady/wife' in some contexts)",
          "familia → 'fah-MEE-lee-ah' — 'family' (from English/Arabic via colonial contact)",
        ],
      },
    ],
    cultural_notes_vi:
      "Gia đình Swahili có điểm GIỐNG và KHÁC với tiếng Việt. Giống: kaka (anh trai) và dada (chị gái) phân biệt GIỚI TÍNH ngay trong từ — giống tiếng Việt 'anh/chị'. Khác: KHÔNG có hệ thống xưng hô phức tạp theo vai vế như tiếng Việt (chú/bác/cậu/dì...). 'Ndugu' là từ bao quát nghĩa 'anh chị em ruột' hoặc 'họ hàng gần'. 'Babu' (ông) và 'bibi' (bà) cũng dùng để gọi người già nói chung — thể hiện sự kính trọng. Trong văn hóa Swahili, gia đình MỞ RỘNG rất quan trọng — 'mjomba' (cậu/bác trai bên mẹ) và 'shangazi' (cô/bác gái bên cha) có vai trò đặc biệt trong các nghi lễ.",
    cultural_notes_en:
      "Swahili family words are both SIMILAR and DIFFERENT from Vietnamese. Similar: kaka (older brother) and dada (older sister) mark GENDER in the word — like Vietnamese 'anh/chị'. Different: there's NO elaborate kinship term system based on relative age/rank like Vietnamese (chú/bác/cậu/dì...). 'Ndugu' is the blanket term for 'blood sibling' or 'close relative'. 'Babu' (grandfather) and 'bibi' (grandmother) are also used to address any elderly person respectfully. In Swahili culture, the EXTENDED family is crucial — 'mjomba' (maternal uncle) and 'shangazi' (paternal aunt) have special ritual roles.",
    tip_advice_vi:
      "Bộ tứ cốt lõi: baba (cha), mama (mẹ), kaka (anh trai), dada (chị gái). Mẹo người Việt: 'kaka' và 'dada' vừa phân biệt tuổi-tương-đối (lớn hơn) vừa phân biệt GIỚI TÍNH — khác với tiếng Indonesia 'kakak' (không phân biệt giới). 'Yangu' là sở hữu 'của tôi' cho lớp danh từ n- (baba yangu, mama yangu). Với lớp m-/wa- thì dùng 'wangu' (kaka wangu). Ở A1, 'yangu' là đủ dùng cho baba/mama, còn kaka/dada dùng kèm cũng sẽ được hiểu.",
    tip_advice_en:
      "Core quartet: baba (father), mama (mother), kaka (older brother), dada (older sister). For Vietnamese learners: 'kaka' and 'dada' mark both relative AGE (older) AND GENDER — unlike Indonesian 'kakak' (gender-neutral). 'Yangu' is the possessive 'my' for n-class nouns (baba yangu, mama yangu). For m-/wa- class use 'wangu' (kaka wangu). At A1, 'yangu' works for baba/mama, and using it with kaka/dada will still be understood.",
    vocabulary: [
      {
        word: "familia",
        en: "family",
        vi: "gia đình",
        pos: "noun (n-)",
        pronunciation_vi: "fa-MI-li-a",
        pronunciation_en: "fah-MEE-lee-ah",
      },
      {
        word: "baba",
        en: "father",
        vi: "cha / ba",
        pos: "noun",
        pronunciation_vi: "BA-ba",
        pronunciation_en: "BAH-bah",
      },
      {
        word: "mama",
        en: "mother",
        vi: "mẹ",
        pos: "noun",
        pronunciation_vi: "MA-ma",
        pronunciation_en: "MAH-mah",
      },
      {
        word: "kaka",
        en: "older brother",
        vi: "anh trai",
        pos: "noun",
        pronunciation_vi: "KA-ka",
        pronunciation_en: "KAH-kah",
      },
      {
        word: "dada",
        en: "older sister",
        vi: "chị gái",
        pos: "noun",
        pronunciation_vi: "DA-da",
        pronunciation_en: "DAH-dah",
      },
      {
        word: "ndugu",
        en: "sibling / relative",
        vi: "anh chị em ruột",
        pos: "noun",
        pronunciation_vi: "NDU-gu",
        pronunciation_en: "n-DOO-goo",
      },
      {
        word: "mtoto",
        en: "child",
        vi: "con / đứa trẻ",
        pos: "noun (m-/wa-)",
        pronunciation_vi: "MTO-to",
        pronunciation_en: "m-TOH-toh",
      },
      {
        word: "babu",
        en: "grandfather",
        vi: "ông",
        pos: "noun",
        pronunciation_vi: "BA-bu",
        pronunciation_en: "BAH-boo",
      },
      {
        word: "bibi",
        en: "grandmother",
        vi: "bà",
        pos: "noun",
        pronunciation_vi: "BI-bi",
        pronunciation_en: "BEE-bee",
      },
      {
        word: "mdogo",
        en: "younger / small",
        vi: "nhỏ hơn / em",
        pos: "adjective",
        pronunciation_vi: "m-DO-go",
        pronunciation_en: "m-DOH-go",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        text: "Una ndugu wangapi?",
        vi: "Bạn có mấy anh chị em?",
        en: "How many siblings do you have?",
      },
      {
        speaker: "B",
        text: "Nina kaka mmoja na dada wawili.",
        vi: "Tôi có một anh trai và hai chị gái.",
        en: "I have one older brother and two older sisters.",
      },
      {
        speaker: "A",
        text: "Na wewe ndio mdogo?",
        vi: "Và bạn là em út à?",
        en: "And you're the youngest?",
      },
      {
        speaker: "B",
        text: "Ndiyo, mimi ni mdogo. Hii ni picha ya familia yangu.",
        vi: "Vâng, tôi là em út. Đây là ảnh gia đình tôi.",
        en: "Yes, I'm the youngest. This is my family photo.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ gia đình đúng:",
        instruction_en: "Fill in the correct family word:",
        pronunciation_focus: ["baba", "mama", "kaka"],
        pronunciation_focus_en: [
          "baba → 'BAH-bah' (father)",
          "mama → 'MAH-mah' (mother)",
          "kaka → 'KAH-kah' (older brother)",
        ],
        items: [
          {
            prompt: "___ yangu ni mwalimu. (Cha tôi là giáo viên)",
            answer: "Baba",
            options: ["Baba", "Mama", "Kaka"],
          },
          {
            prompt: "___ yangu anapika. (Mẹ tôi nấu ăn)",
            answer: "Mama",
            options: ["Baba", "Mama", "Mtoto"],
          },
          {
            prompt: "___ yangu ni mdogo. (Em tôi nhỏ hơn)",
            answer: "Ndugu",
            options: ["Kaka", "Ndugu", "Babu"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ gia đình với nghĩa:",
        instruction_en: "Match the family word with its meaning:",
        pronunciation_focus: ["kaka", "dada", "babu"],
        pronunciation_focus_en: [
          "kaka → 'KAH-kah' (older brother)",
          "dada → 'DAH-dah' (older sister)",
          "babu → 'BAH-boo' (grandfather)",
        ],
        items: [
          { prompt: "kaka", answer: "anh trai" },
          { prompt: "dada", answer: "chị gái" },
          { prompt: "babu", answer: "ông" },
          { prompt: "bibi", answer: "bà" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Swahili:",
        instruction_en: "Translate into Swahili:",
        pronunciation_focus: ["baba yangu", "ndugu"],
        pronunciation_focus_en: [
          "baba yangu → 'BAH-bah YAHN-goo' (my father)",
          "ndugu → 'n-DOO-goo' (sibling)",
        ],
        items: [
          { prompt: "Đây là mẹ tôi.", answer: "Huyu ni mama yangu." },
          { prompt: "Tôi có một em gái.", answer: "Nina dada mmoja mdogo." },
          { prompt: "Bạn có mấy anh chị em?", answer: "Una ndugu wangapi?" },
        ],
      },
    ],
  },
];

export default lessons;
