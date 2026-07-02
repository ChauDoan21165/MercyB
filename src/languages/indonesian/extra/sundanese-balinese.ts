// Sundanese and Balinese awareness for Vietnamese learners of Indonesian.
//
// This pack teaches recognition and cultural respect, not fluency in Sundanese
// or Balinese. It follows the Indonesian extra lesson convention: `en` holds
// the target-language line, `vi` holds the Vietnamese gloss, and pronunciation
// notes are Vietnamese-first with English companions.

type LessonSentence = {
  /** Target-language (Indonesian, sometimes with a regional word). */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar/culture notes. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
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

type Exercise = Record<string, unknown>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: VocabEntry[];
  dialogue?: DialogueLine[];
  exercises?: Exercise[];
};

export const sundaneseBalineseLessons: IndonesianLesson[] = [
  {
    id: "indonesian_sundanese_balinese_awareness",
    level: "B1",
    category: "culture_language",
    title_vi: "Nhận biết tiếng Sunda và tiếng Bali trong đời sống",
    title_en: "Sundanese and Balinese awareness in daily life",
    sentences: [
      {
        en: "Di Bandung, banyak orang berbicara bahasa Sunda di rumah.",
        vi: "Ở Bandung, nhiều người nói tiếng Sunda ở nhà.",
        pronunciation_focus: [
          "Bandung -> BAN-dung; dung co am 'ng' cuoi nhu tieng Viet.",
          "bahasa Sunda -> tieng Sunda, ngon ngu vung Tay Java.",
          "di rumah -> o nha; dung `di` cho noi chon tinh.",
        ],
        pronunciation_focus_en: [
          "Bandung -> 'BAN-doong'; final ng as in 'sing'.",
          "bahasa Sunda -> Sundanese, the regional language of West Java.",
          "di rumah -> at home; use `di` for a static location.",
        ],
      },
      {
        en: "Di Bali, orang tetap pakai bahasa Bali dalam upacara adat.",
        vi: "Ở Bali, người ta vẫn dùng tiếng Bali trong nghi lễ truyền thống.",
        pronunciation_focus: [
          "tetap pakai -> van dung/tiep tuc dung.",
          "upacara adat -> nghi le truyen thong; adat = phong tuc.",
          "bahasa Bali -> tieng Bali, khong phai chi la giong Indonesia.",
        ],
        pronunciation_focus_en: [
          "tetap pakai -> still use / continue using.",
          "upacara adat -> traditional ceremony; adat = custom.",
          "bahasa Bali -> Balinese, not just an Indonesian accent.",
        ],
      },
      {
        en: "Saya paham sedikit kata Sunda seperti hatur nuhun dan punten.",
        vi: "Tôi hiểu một ít từ tiếng Sunda như hatur nuhun và punten.",
        pronunciation_focus: [
          "hatur nuhun -> HA-tur NU-hun, 'cam on' trong tieng Sunda.",
          "punten -> PUN-ten, 'xin phep/xin loi' lich su.",
          "sedikit kata -> mot it tu; dung de noi khi chi nhan biet, chua noi duoc.",
        ],
        pronunciation_focus_en: [
          "hatur nuhun -> 'HA-toor NOO-hoon', thank you in Sundanese.",
          "punten -> 'POON-ten', polite excuse me/sorry.",
          "sedikit kata -> a few words; useful when you recognize but cannot speak fluently.",
        ],
      },
      {
        en: "Di Bali saya sering dengar rahajeng semeng untuk selamat pagi.",
        vi: "Ở Bali tôi thường nghe rahajeng semeng để chào buổi sáng.",
        pronunciation_focus: [
          "sering dengar -> thuong nghe; dengar = nghe.",
          "rahajeng semeng -> ra-HA-jeng SE-meng, loi chao buoi sang bang tieng Bali.",
          "untuk selamat pagi -> de noi 'chao buoi sang'.",
        ],
        pronunciation_focus_en: [
          "sering dengar -> often hear; dengar = hear.",
          "rahajeng semeng -> 'ra-HA-jeng SE-meng', a Balinese good morning greeting.",
          "untuk selamat pagi -> for saying 'good morning'.",
        ],
      },
      {
        en: "Kalau saya tidak yakin, saya pakai bahasa Indonesia yang sopan.",
        vi: "Nếu tôi không chắc, tôi dùng tiếng Indonesia lịch sự.",
        pronunciation_focus: [
          "kalau tidak yakin -> neu khong chac.",
          "yang sopan -> lich su; dung `yang` de bo nghia cho danh tu/cum.",
          "MEO: tieng Indonesia lich su an toan hon viec chen tu vung mien sai ngu canh.",
        ],
        pronunciation_focus_en: [
          "kalau tidak yakin -> if unsure.",
          "yang sopan -> polite; `yang` links the description to the noun/phrase.",
          "TIP: polite Indonesian is safer than forcing regional words in the wrong context.",
        ],
      },
      {
        en: "Jangan menganggap semua orang Indonesia punya bahasa daerah yang sama.",
        vi: "Đừng cho rằng tất cả người Indonesia có cùng một tiếng địa phương.",
        pronunciation_focus: [
          "jangan menganggap -> dung cho rang/dung gia dinh.",
          "semua orang Indonesia -> tat ca nguoi Indonesia.",
          "bahasa daerah -> ngon ngu dia phuong/vung mien; daerah = khu vuc.",
        ],
        pronunciation_focus_en: [
          "jangan menganggap -> do not assume.",
          "semua orang Indonesia -> all Indonesians.",
          "bahasa daerah -> regional/local language; daerah = region.",
        ],
      },
      {
        en: "Lebih baik bertanya dengan hormat: ini bahasa Sunda atau bahasa Bali?",
        vi: "Tốt hơn là hỏi một cách tôn trọng: đây là tiếng Sunda hay tiếng Bali?",
        pronunciation_focus: [
          "lebih baik -> tot hon.",
          "bertanya dengan hormat -> hoi voi su ton trong.",
          "atau -> hay/hoac; mau cau nay giup ban khong doan bua.",
        ],
        pronunciation_focus_en: [
          "lebih baik -> better.",
          "bertanya dengan hormat -> ask respectfully.",
          "atau -> or; this pattern prevents careless guessing.",
        ],
      },
      {
        en: "Saya belajar bahasa Indonesia dulu, lalu menghargai bahasa daerah.",
        vi: "Tôi học tiếng Indonesia trước, rồi tôn trọng các tiếng địa phương.",
        pronunciation_focus: [
          "dulu -> truoc/da; o day nghia la 'truoc tien'.",
          "lalu -> roi/sau do.",
          "menghargai -> men-ghar-GAI, ton trong/tran trong.",
        ],
        pronunciation_focus_en: [
          "dulu -> first/before; here it means 'first of all'.",
          "lalu -> then/after that.",
          "menghargai -> 'men-ghar-GAI', to respect/appreciate.",
        ],
      },
    ],
    cultural_notes_vi:
      "Indonesia có hàng trăm ngôn ngữ địa phương. Tiếng Sunda được dùng rộng rãi ở Tây Java, đặc biệt quanh Bandung. Tiếng Bali gắn với đời sống hằng ngày, nghi lễ Hindu Bali, và hệ thống xưng hô/lịch sự riêng. Một số từ như 'punten', 'hatur nuhun', 'rahajeng semeng', 'suksma' có thể nghe trong đời sống, nhưng người học nên dùng chúng để nhận biết và thể hiện tôn trọng, không giả vờ nói thành thạo.",
    cultural_notes_en:
      "Indonesia has hundreds of regional languages. Sundanese is widely spoken in West Java, especially around Bandung. Balinese is tied to daily life, Balinese Hindu ceremonies, and its own politeness/address system. Words such as 'punten', 'hatur nuhun', 'rahajeng semeng', and 'suksma' may appear in daily life, but learners should treat them as recognition-and-respect items, not proof of fluency.",
    tip_advice_vi:
      "Mẹo cho người Việt: cách an toàn nhất là dùng tiếng Indonesia chuẩn, thêm thái độ lịch sự, rồi hỏi nếu cần: 'Maaf, itu bahasa daerah apa?' Đừng gọi mọi tiếng địa phương là 'bahasa Jawa'. Cũng đừng dùng từ vùng miền như trò đùa; với nhiều người, đó là bản sắc gia đình, quê hương và nghi lễ.",
    tip_advice_en:
      "Tip for Vietnamese speakers: the safest path is standard polite Indonesian, then ask if needed: 'Maaf, itu bahasa daerah apa?' Do not call every regional language 'Javanese'. Also avoid using regional words as jokes; for many people they carry family, hometown, and ceremonial identity.",
    vocabulary: [
      {
        word: "bahasa Sunda",
        en: "Sundanese language",
        vi: "tiếng Sunda",
        pos: "noun phrase",
        pronunciation_vi: "ba-HA-sa SUN-da",
        pronunciation_en: "ba-HA-sa SOON-da",
      },
      {
        word: "bahasa Bali",
        en: "Balinese language",
        vi: "tiếng Bali",
        pos: "noun phrase",
        pronunciation_vi: "ba-HA-sa BA-li",
        pronunciation_en: "ba-HA-sa BA-lee",
      },
      {
        word: "bahasa daerah",
        en: "regional language",
        vi: "tiếng địa phương",
        pos: "noun phrase",
        pronunciation_vi: "ba-HA-sa DA-e-rah",
        pronunciation_en: "ba-HA-sa DA-e-rah",
      },
      {
        word: "punten",
        en: "excuse me / sorry (Sundanese)",
        vi: "xin phép / xin lỗi (tiếng Sunda)",
        pos: "interjection",
        pronunciation_vi: "PUN-ten",
        pronunciation_en: "POON-ten",
      },
      {
        word: "hatur nuhun",
        en: "thank you (Sundanese)",
        vi: "cảm ơn (tiếng Sunda)",
        pos: "phrase",
        pronunciation_vi: "HA-tur NU-hun",
        pronunciation_en: "HA-toor NOO-hoon",
      },
      {
        word: "rahajeng semeng",
        en: "good morning (Balinese)",
        vi: "chào buổi sáng (tiếng Bali)",
        pos: "phrase",
        pronunciation_vi: "ra-HA-jeng SE-meng",
        pronunciation_en: "ra-HA-jeng SE-meng",
      },
      {
        word: "suksma",
        en: "thank you (Balinese)",
        vi: "cảm ơn (tiếng Bali)",
        pos: "interjection",
        pronunciation_vi: "SUKS-ma",
        pronunciation_en: "SOOKS-ma",
      },
      {
        word: "adat",
        en: "custom / tradition",
        vi: "phong tục / truyền thống",
        pos: "noun",
        pronunciation_vi: "A-dat",
        pronunciation_en: "A-dat",
      },
      {
        word: "menghargai",
        en: "to respect / appreciate",
        vi: "tôn trọng / trân trọng",
        pos: "verb",
        pronunciation_vi: "men-ghar-GAI",
        pronunciation_en: "men-ghar-GAI",
      },
    ],
    dialogue: [
      {
        speaker: "Lan",
        text: "Maaf, itu bahasa daerah apa? Saya dengar kata punten.",
        vi: "Xin lỗi, đó là tiếng địa phương gì vậy? Tôi nghe từ punten.",
        en: "Sorry, what regional language is that? I heard the word punten.",
      },
      {
        speaker: "Dina",
        text: "Itu bahasa Sunda. Punten artinya permisi atau maaf.",
        vi: "Đó là tiếng Sunda. Punten nghĩa là xin phép hoặc xin lỗi.",
        en: "That is Sundanese. Punten means excuse me or sorry.",
      },
      {
        speaker: "Lan",
        text: "Menarik sekali. Saya pakai bahasa Indonesia dulu supaya sopan.",
        vi: "Thú vị quá. Tôi dùng tiếng Indonesia trước để lịch sự.",
        en: "Very interesting. I will use Indonesian first to stay polite.",
      },
      {
        speaker: "Dina",
        text: "Bagus. Kalau mau bilang terima kasih dalam Sunda, bisa hatur nuhun.",
        vi: "Tốt. Nếu muốn nói cảm ơn bằng tiếng Sunda, có thể nói hatur nuhun.",
        en: "Good. If you want to say thank you in Sundanese, you can say hatur nuhun.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ/cụm từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word or phrase with its Vietnamese meaning:",
        items: [
          { prompt: "bahasa Sunda", answer: "tiếng Sunda" },
          { prompt: "bahasa Bali", answer: "tiếng Bali" },
          { prompt: "bahasa daerah", answer: "tiếng địa phương" },
          { prompt: "menghargai", answer: "tôn trọng" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu:",
        instruction_en: "Fill in the missing word:",
        items: [
          {
            prompt: "Di Bandung, banyak orang berbicara bahasa ___.",
            answer: "Sunda",
            options: ["Sunda", "Bali", "Vietnam"],
          },
          {
            prompt: "Kalau tidak yakin, pakai bahasa Indonesia yang ___.",
            answer: "sopan",
            options: ["sopan", "mahal", "jauh"],
          },
          {
            prompt: "Jangan menganggap semua orang Indonesia punya bahasa ___ yang sama.",
            answer: "daerah",
            options: ["daerah", "dapur", "dokter"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Đây là tiếng Sunda hay tiếng Bali?", answer: "Ini bahasa Sunda atau bahasa Bali?" },
          { prompt: "Tôi dùng tiếng Indonesia lịch sự.", answer: "Saya pakai bahasa Indonesia yang sopan." },
          { prompt: "Đừng cho rằng tất cả người Indonesia giống nhau.", answer: "Jangan menganggap semua orang Indonesia sama." },
        ],
      },
    ],
  },
];

export default sundaneseBalineseLessons;
