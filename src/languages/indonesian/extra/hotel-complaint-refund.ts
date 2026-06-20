// Hotel Complaint & Refund Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It follows the established Indonesian extra
// lesson format: Indonesian target text lives in `en`, Vietnamese glosses live in
// `vi`, and each Vietnamese-facing learning note has an English companion.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus -- same length + order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  /** Indonesian word/phrase. */
  word: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Part of speech, e.g. "noun", "verb", "phrase". */
  pos: string;
  /** Vietnamese pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  speaker: string;
  /** Indonesian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
  en?: string;
};

// Loosely typed so per-type fields (translation, fill-blank, matching) can vary.
export type IndonesianExercise = Record<string, any>;

export type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: IndonesianLessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: IndonesianVocabEntry[];
  dialogue?: IndonesianDialogueLine[];
  exercises?: IndonesianExercise[];
  content?: string;
};

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_hotel_complaint_refund",
    level: "B1",
    category: "travel",
    title_vi: "Phàn nàn khách sạn và yêu cầu hoàn tiền",
    title_en: "Hotel complaints and refunds",
    sentences: [
      {
        en: "Maaf, kamar saya kotor saat saya check-in.",
        vi: "Xin lỗi, phòng của tôi bị bẩn khi tôi nhận phòng.",
        pronunciation_focus: [
          "ma-AF, KA-mar SA-ya KO-tor saat SA-ya check-in -- `kamar kotor` = phòng bẩn; `saat check-in` = lúc nhận phòng.",
          "Mẹo: mở đầu bằng `Maaf` giúp phàn nàn nghe lịch sự hơn, dù nội dung vẫn rõ.",
          "Luyện: `Kamar saya kotor saat check-in.`",
        ],
        pronunciation_focus_en: [
          "ma-AF, KA-mar SA-ya KO-tor saat SA-ya check-in -- `kamar kotor` = dirty room; `saat check-in` = at check-in.",
          "Tip: opening with `Maaf` makes the complaint sound polite while keeping it clear.",
          "Drill: `Kamar saya kotor saat check-in.`",
        ],
      },
      {
        en: "AC di kamar tidak dingin dan suaranya berisik.",
        vi: "Máy lạnh trong phòng không mát và tiếng ồn.",
        pronunciation_focus: [
          "A-C di KA-mar TI-dak DI-ngin dan SU-a-ra-nya be-RI-sik -- `AC tidak dingin` = máy lạnh không mát; `berisik` = ồn.",
          "Lỗi người Việt: nói `AC rusak` cho mọi lỗi. Nếu vẫn chạy nhưng không mát, nói rõ `tidak dingin`.",
          "Luyện: `AC di kamar tidak dingin.`",
        ],
        pronunciation_focus_en: [
          "A-C di KA-mar TEE-dak DEE-ngin dan SOO-a-ra-nya be-REE-sik -- `AC tidak dingin` = the AC is not cold; `berisik` = noisy.",
          "VN-speaker trap: saying `AC rusak` for every issue. If it runs but is not cooling, say `tidak dingin`.",
          "Drill: `AC di kamar tidak dingin.`",
        ],
      },
      {
        en: "Air panas di kamar mandi tidak menyala.",
        vi: "Nước nóng trong phòng tắm không hoạt động.",
        pronunciation_focus: [
          "A-ir PA-nas di KA-mar MAN-di TI-dak me-NYA-la -- `air panas` = nước nóng; `tidak menyala` = không bật/không hoạt động.",
          "`air` trong tiếng Indonesia đọc A-ir, không giống tiếng Anh `air`.",
          "Luyện: `Air panas tidak menyala.`",
        ],
        pronunciation_focus_en: [
          "A-ir PA-nas di KA-mar MAN-di TEE-dak me-NYA-la -- `air panas` = hot water; `tidak menyala` = does not turn on/work.",
          "`Air` in Indonesian is pronounced A-ir, not like English `air`.",
          "Drill: `Air panas tidak menyala.`",
        ],
      },
      {
        en: "Bisa pindah kamar yang lebih bersih dan tenang?",
        vi: "Tôi có thể chuyển sang phòng sạch hơn và yên tĩnh hơn không?",
        pronunciation_focus: [
          "BI-sa PIN-dah KA-mar yang LE-bih BER-sih dan te-NANG -- `pindah kamar` = chuyển phòng; `lebih bersih` = sạch hơn.",
          "`bisa` hỏi khả năng/giải pháp. Nếu muốn xin phép mềm hơn, dùng `boleh saya pindah kamar?`",
          "Luyện: `Bisa pindah kamar?`",
        ],
        pronunciation_focus_en: [
          "BEE-sa PIN-dah KA-mar yang LE-bih BER-sih dan te-NANG -- `pindah kamar` = move rooms; `lebih bersih` = cleaner.",
          "`Bisa` asks about possibility/solution. For softer permission, use `boleh saya pindah kamar?`",
          "Drill: `Bisa pindah kamar?`",
        ],
      },
      {
        en: "Kalau tidak ada kamar lain, saya mau minta refund hotel.",
        vi: "Nếu không có phòng khác, tôi muốn yêu cầu khách sạn hoàn tiền.",
        pronunciation_focus: [
          "KA-lau TI-dak A-da KA-mar LA-in, SA-ya mau MIN-ta RE-fund ho-TEL -- `minta refund` = yêu cầu hoàn tiền.",
          "Mẹo: `refund` rất thường trong du lịch/booking online; cách Indonesia đầy đủ hơn là `pengembalian dana`.",
          "Luyện: `Saya mau minta refund hotel.`",
        ],
        pronunciation_focus_en: [
          "KA-lau TEE-dak A-da KA-mar LA-in, SA-ya mau MIN-ta RE-fund ho-TEL -- `minta refund` = request a refund.",
          "Tip: `refund` is common in travel/online booking; the fuller Indonesian phrase is `pengembalian dana`.",
          "Drill: `Saya mau minta refund hotel.`",
        ],
      },
      {
        en: "Saya sudah melapor ke resepsionis tadi malam.",
        vi: "Tối qua tôi đã báo với lễ tân.",
        pronunciation_focus: [
          "SA-ya SU-dah me-LA-por ke re-sep-si-O-nis TA-di MA-lam -- `resepsionis` = lễ tân; `melapor ke` = báo với.",
          "`ke resepsionis` dùng `ke` vì thông tin hướng đến người nhận; `di resepsionis` là ở khu lễ tân.",
          "Luyện: `Saya sudah melapor ke resepsionis.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah me-LA-por ke re-sep-si-O-nis TA-di MA-lam -- `resepsionis` = receptionist; `melapor ke` = report to.",
          "`Ke resepsionis` uses `ke` because the report goes to a person; `di resepsionis` means at the reception area.",
          "Drill: `Saya sudah melapor ke resepsionis.`",
        ],
      },
      {
        en: "Boleh saya bicara dengan manajer hotel?",
        vi: "Tôi có thể nói chuyện với quản lý khách sạn không?",
        pronunciation_focus: [
          "BO-leh SA-ya bi-CA-ra DE-ngan ma-NA-jer ho-TEL -- `manajer hotel` = quản lý khách sạn.",
          "Lỗi người Việt: nói thẳng `panggil bos`. Trong khách sạn, câu lịch sự là `Boleh saya bicara dengan manajer?`",
          "Luyện: `Boleh saya bicara dengan manajer?`",
        ],
        pronunciation_focus_en: [
          "BO-leh SA-ya bi-CHA-ra DE-ngan ma-NA-jer ho-TEL -- `manajer hotel` = hotel manager.",
          "VN-speaker trap: bluntly saying `panggil bos`. In a hotel, the polite line is `Boleh saya bicara dengan manajer?`",
          "Drill: `Boleh saya bicara dengan manajer?`",
        ],
      },
      {
        en: "Saya akan menulis ulasan online kalau masalah ini tidak diselesaikan.",
        vi: "Tôi sẽ viết đánh giá online nếu vấn đề này không được giải quyết.",
        pronunciation_focus: [
          "SA-ya A-kan me-NU-lis u-LA-san on-LINE KA-lau ma-SA-lah I-ni TI-dak di-se-le-SAI-kan -- `ulasan online` = đánh giá online; `diselesaikan` = được giải quyết.",
          "Mẹo văn hóa: câu này khá mạnh. Dùng sau khi đã báo lỗi và yêu cầu giải pháp một cách lịch sự.",
          "Luyện: `Masalah ini belum diselesaikan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya A-kan me-NOO-lis u-LA-san on-LINE KA-lau ma-SA-lah EE-ni TEE-dak di-se-le-SAI-kan -- `ulasan online` = online review; `diselesaikan` = resolved.",
          "Culture tip: this sentence is fairly strong. Use it after you have reported the issue and asked politely for a solution.",
          "Drill: `Masalah ini belum diselesaikan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi phàn nàn ở khách sạn Indonesia, giữ giọng lịch sự nhưng cụ thể: nêu vấn đề, thời điểm, bukti foto nếu có, và giải pháp mong muốn như `pindah kamar`, `perbaikan`, atau `refund`. Thường nên báo với `resepsionis` trước, rồi yêu cầu gặp `manajer` nếu chưa có solusi. Đe dọa viết `ulasan online` là bước mạnh hơn, nên dùng sau khi khách sạn không xử lý.",
    cultural_notes_en:
      "When complaining at an Indonesian hotel, keep the tone polite but specific: state the issue, time, photo evidence if available, and the solution you want such as moving rooms, repair, or refund. Usually report to the receptionist first, then ask for the manager if there is no solution. Mentioning an online review is a stronger step and is best used after the hotel does not resolve the issue.",
    tip_advice_vi:
      "Mẹo cho người Việt: học theo khung `Maaf, kamar saya...`, `Saya sudah melapor...`, `Bisa pindah kamar?`, `Saya mau minta refund`. Phân biệt `kotor` (bẩn), `rusak` (hỏng), `tidak dingin` (không mát), `tidak menyala` (không bật/hoạt động).",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn the frame `Maaf, kamar saya...`, `Saya sudah melapor...`, `Bisa pindah kamar?`, `Saya mau minta refund`. Distinguish `kotor` (dirty), `rusak` (broken), `tidak dingin` (not cold), and `tidak menyala` (does not turn on/work).",
    vocabulary: [
      {
        word: "kamar kotor",
        en: "dirty room",
        vi: "phòng bẩn",
        pos: "noun phrase",
        pronunciation_vi: "KA-mar KO-tor",
        pronunciation_en: "KA-mar KO-tor",
      },
      {
        word: "AC rusak",
        en: "broken air conditioner",
        vi: "máy lạnh hỏng",
        pos: "phrase",
        pronunciation_vi: "A-C RU-sak",
        pronunciation_en: "A-C ROO-sak",
      },
      {
        word: "air panas",
        en: "hot water",
        vi: "nước nóng",
        pos: "noun phrase",
        pronunciation_vi: "A-ir PA-nas",
        pronunciation_en: "A-ir PA-nas",
      },
      {
        word: "pindah kamar",
        en: "move rooms",
        vi: "chuyển phòng",
        pos: "verb phrase",
        pronunciation_vi: "PIN-dah KA-mar",
        pronunciation_en: "PIN-dah KA-mar",
      },
      {
        word: "refund hotel",
        en: "hotel refund",
        vi: "hoàn tiền khách sạn",
        pos: "noun phrase",
        pronunciation_vi: "RE-fund ho-TEL",
        pronunciation_en: "RE-fund ho-TEL",
      },
      {
        word: "resepsionis",
        en: "receptionist",
        vi: "lễ tân",
        pos: "noun",
        pronunciation_vi: "re-sep-si-O-nis",
        pronunciation_en: "re-sep-si-O-nis",
      },
      {
        word: "manajer",
        en: "manager",
        vi: "quản lý",
        pos: "noun",
        pronunciation_vi: "ma-NA-jer",
        pronunciation_en: "ma-NA-jer",
      },
      {
        word: "ulasan online",
        en: "online review",
        vi: "đánh giá online",
        pos: "noun phrase",
        pronunciation_vi: "u-LA-san on-LINE",
        pronunciation_en: "u-LA-san on-LINE",
      },
    ],
    dialogue: [
      {
        speaker: "Tamu",
        text: "Maaf, kamar saya kotor dan AC-nya tidak dingin sejak check-in.",
        vi: "Xin lỗi, phòng của tôi bẩn và máy lạnh không mát từ lúc nhận phòng.",
        en: "Sorry, my room is dirty and the AC has not been cold since check-in.",
      },
      {
        speaker: "Resepsionis",
        text: "Mohon maaf, Bapak/Ibu. Apakah ada foto kondisinya?",
        vi: "Chúng tôi xin lỗi. Quý khách có ảnh tình trạng đó không?",
        en: "We apologize, Sir/Madam. Do you have a photo of the condition?",
      },
      {
        speaker: "Tamu",
        text: "Ada. Saya juga sudah melapor tadi malam, tapi belum ada perbaikan.",
        vi: "Có. Tối qua tôi cũng đã báo rồi, nhưng vẫn chưa có sửa chữa.",
        en: "Yes. I also reported it last night, but there has been no repair yet.",
      },
      {
        speaker: "Tamu",
        text: "Kalau bisa, saya ingin pindah kamar yang lebih bersih.",
        vi: "Nếu được, tôi muốn chuyển sang phòng sạch hơn.",
        en: "If possible, I would like to move to a cleaner room.",
      },
      {
        speaker: "Resepsionis",
        text: "Saya cek ketersediaan kamar dulu, atau saya panggil manajer.",
        vi: "Tôi kiểm tra tình trạng phòng trước, hoặc tôi gọi quản lý.",
        en: "I will check room availability first, or I will call the manager.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: 'Tôi muốn chuyển phòng.'",
        prompt_en: "Translate into Indonesian: 'I want to move rooms.'",
        answer: "Saya mau pindah kamar.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `AC di kamar tidak ____.`",
        prompt_en: "Fill in the blank: `AC di kamar tidak ____.`",
        answer: "dingin",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm Indonesia với nghĩa tiếng Việt.",
        prompt_en: "Match the Indonesian phrase with the Vietnamese meaning.",
        pairs: [
          ["kamar kotor", "phòng bẩn"],
          ["air panas", "nước nóng"],
          ["ulasan online", "đánh giá online"],
        ],
      },
      {
        type: "roleplay",
        prompt_vi:
          "Bạn ở quầy lễ tân. Nói phòng bẩn, AC không mát, nước nóng không hoạt động, yêu cầu pindah kamar hoặc refund.",
        prompt_en:
          "You are at hotel reception. Say the room is dirty, the AC is not cold, hot water is not working, and request a room change or refund.",
      },
    ],
    content:
      "Use this lesson for Indonesian hotel complaints: dirty rooms, broken or weak AC, hot-water problems, asking reception for a room change, escalating to the manager, requesting a hotel refund, and mentioning online reviews carefully.",
  },
];
