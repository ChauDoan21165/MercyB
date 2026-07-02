// Religious & Cultural Etiquette Indonesian (Vietnamese -> Indonesian study track).
//
// This pack teaches practical respectful behavior around mosques, temples,
// churches, greetings, clothing, photo permission, and local adat. It follows
// the Indonesian extra convention: `en` holds Indonesian target text, `vi` holds
// Vietnamese glosses, and pronunciation notes are Vietnamese-first with English
// companions.

type LessonSentence = {
  /** Target-language (Indonesian) sentence. */
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

export const religiousCulturalEtiquetteLessons: IndonesianLesson[] = [
  {
    id: "indonesian_religious_cultural_etiquette",
    level: "B1",
    category: "culture_religion",
    title_vi: "Sopan santun ở nơi tôn giáo và văn hóa",
    title_en: "Etiquette at religious and cultural places",
    sentences: [
      {
        en: "Sebelum masuk masjid, kita harus melepas sepatu.",
        vi: "Trước khi vào nhà thờ Hồi giáo, chúng ta phải cởi giày.",
        pronunciation_focus: [
          "se-BE-lum MA-suk MAS-jid - `sebelum` = trước khi; `masjid` = nhà thờ Hồi giáo.",
          "`melepas sepatu` = cởi giày; dùng cho giày, dép, áo khoác.",
          "Lỗi người Việt: dùng `buka sepatu` theo tiếng Việt. Người Indonesia hiểu, nhưng `melepas sepatu` chuẩn và lịch sự hơn.",
          "Luyện: `Kita harus melepas sepatu.`",
        ],
        pronunciation_focus_en: [
          "se-BE-lum MA-suk MAS-jid - `sebelum` = before; `masjid` = mosque.",
          "`melepas sepatu` = take off shoes; used for shoes, sandals, jackets.",
          "VN-speaker trap: copying Vietnamese and saying `buka sepatu`. People understand, but `melepas sepatu` is better and more polite.",
          "Drill: `Kita harus melepas sepatu.`",
        ],
      },
      {
        en: "Di pura, pengunjung sebaiknya memakai sarung dan selendang.",
        vi: "Ở đền Hindu Bali, khách tham quan nên mặc sarong và khăn thắt lưng.",
        pronunciation_focus: [
          "PU-ra - `pura` = đền Hindu, đặc biệt ở Bali; không phải `pure` tiếng Anh.",
          "`pengunjung sebaiknya` = khách tham quan nên; `sebaiknya` mềm hơn `harus`.",
          "`sarung dan selendang` = sarong và khăn/dải buộc; thường được mượn ở cổng đền.",
          "Luyện: `Sebaiknya memakai sarung.`",
        ],
        pronunciation_focus_en: [
          "POO-ra - `pura` = Hindu temple, especially in Bali; not English `pure`.",
          "`pengunjung sebaiknya` = visitors should; `sebaiknya` is softer than `harus`.",
          "`sarung dan selendang` = sarong and sash; often rented or lent at temple entrances.",
          "Drill: `Sebaiknya memakai sarung.`",
        ],
      },
      {
        en: "Saat masuk gereja, saya berbicara pelan dan mematikan suara HP.",
        vi: "Khi vào nhà thờ, tôi nói nhỏ và tắt tiếng điện thoại.",
        pronunciation_focus: [
          "GE-re-ja - `gereja` = nhà thờ Kitô giáo/Công giáo.",
          "`berbicara pelan` = nói nhỏ/nhẹ; `pelan` cũng nghĩa là chậm.",
          "`mematikan suara HP` = tắt âm điện thoại; HP đọc `ha-pe` trong Indonesia.",
          "Luyện: `Saya berbicara pelan.`",
        ],
        pronunciation_focus_en: [
          "GE-re-ja - `gereja` = Christian/Catholic church.",
          "`berbicara pelan` = speak quietly/softly; `pelan` can also mean slow.",
          "`mematikan suara HP` = silence the phone; HP is pronounced `ha-pe` in Indonesian.",
          "Drill: `Saya berbicara pelan.`",
        ],
      },
      {
        en: "Saya memakai pakaian sopan ketika menghadiri acara adat.",
        vi: "Tôi mặc trang phục lịch sự khi tham dự sự kiện phong tục truyền thống.",
        pronunciation_focus: [
          "pa-KAI-an SO-pan - `pakaian sopan` = trang phục kín đáo/lịch sự.",
          "`menghadiri acara adat` = tham dự sự kiện nghi lễ/phong tục; trang trọng hơn `datang ke acara`.",
          "Lỗi người Việt: nghĩ `sopan` chỉ là lời nói. `Sopan` dùng cả cho hành vi và quần áo.",
          "Luyện: `Saya memakai pakaian sopan.`",
        ],
        pronunciation_focus_en: [
          "pa-KAI-an SO-pan - `pakaian sopan` = modest/polite clothing.",
          "`menghadiri acara adat` = attend a customary ceremony/event; more formal than `datang ke acara`.",
          "VN-speaker trap: thinking `sopan` only describes speech. It also describes behavior and clothing.",
          "Drill: `Saya memakai pakaian sopan.`",
        ],
      },
      {
        en: "Boleh saya mengambil foto di sini?",
        vi: "Tôi có thể chụp ảnh ở đây không?",
        pronunciation_focus: [
          "BO-leh SA-ya me-NGAM-bil FO-to di SI-ni - câu xin phép chụp ảnh an toàn.",
          "`mengambil foto` = chụp ảnh; cũng nghe `foto-foto` trong nói chuyện thân mật.",
          "Lỗi người Việt: chỉ giơ máy ảnh lên chụp. Ở nơi tôn giáo/đám lễ, luôn hỏi trước.",
          "Luyện: `Boleh saya mengambil foto?`",
        ],
        pronunciation_focus_en: [
          "BO-leh SA-ya me-NGAM-bil FO-to dee SEE-nee - a safe permission line for taking photos.",
          "`mengambil foto` = take a photo; casual speech also says `foto-foto`.",
          "VN-speaker trap: just raising the camera and shooting. At religious or ceremonial places, ask first.",
          "Drill: `Boleh saya mengambil foto?`",
        ],
      },
      {
        en: "Maaf, apakah saya boleh duduk di bagian ini?",
        vi: "Xin lỗi, tôi có được ngồi ở khu vực này không?",
        pronunciation_focus: [
          "a-PA-kah SA-ya BO-leh DU-duk di BA-gi-an I-ni - `apakah` làm câu hỏi lịch sự hơn.",
          "`bagian ini` = phần/khu vực này; hữu ích khi có khu vực riêng nam/nữ, khách, hoặc người cầu nguyện.",
          "`Maaf` mở câu không chỉ là xin lỗi mà còn là xin phép/làm phiền nhẹ.",
          "Luyện: `Apakah saya boleh duduk di sini?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah SA-ya BO-leh DOO-dook dee BA-gee-an EE-nee - `apakah` makes the question more polite.",
          "`bagian ini` = this section/area; useful where there are separate zones for men/women, visitors, or worshippers.",
          "`Maaf` at the start is not only sorry; it softens an interruption or permission request.",
          "Drill: `Apakah saya boleh duduk di sini?`",
        ],
      },
      {
        en: "Saya menghormati adat setempat, jadi saya mengikuti aturan di sini.",
        vi: "Tôi tôn trọng phong tục địa phương, nên tôi làm theo quy định ở đây.",
        pronunciation_focus: [
          "meng-hor-MA-ti A-dat se-TEM-pat - `menghormati` = tôn trọng; `adat setempat` = phong tục địa phương.",
          "`mengikuti aturan` = làm theo quy định; tự nhiên hơn dịch từng chữ 'theo luật'.",
          "Mẹo văn hóa: câu này rất có ích khi bạn là khách ở làng, đền, nhà thờ, hoặc lễ cưới.",
          "Luyện: `Saya menghormati adat setempat.`",
        ],
        pronunciation_focus_en: [
          "meng-hor-MA-ti A-dat se-TEM-pat - `menghormati` = respect; `adat setempat` = local custom.",
          "`mengikuti aturan` = follow the rules; more natural than translating 'follow law' literally.",
          "Culture tip: this line is useful when you are a guest in a village, temple, church, or wedding.",
          "Drill: `Saya menghormati adat setempat.`",
        ],
      },
      {
        en: "Salam yang aman adalah tersenyum, mengangguk, dan berkata selamat pagi.",
        vi: "Cách chào an toàn là mỉm cười, gật đầu và nói chào buổi sáng.",
        pronunciation_focus: [
          "SA-lam yang A-man - `salam` = lời chào/cách chào; `aman` = an toàn.",
          "`mengangguk` = gật đầu; âm `ngg` giữa từ cần đọc rõ.",
          "Mẹo: không phải ai cũng bắt tay khác giới; nụ cười và gật đầu là lựa chọn an toàn.",
          "Luyện: `Salam yang aman adalah tersenyum.`",
        ],
        pronunciation_focus_en: [
          "SA-lam yang A-man - `salam` = greeting; `aman` = safe.",
          "`mengangguk` = nod; pronounce the medial `ngg` clearly.",
          "Tip: not everyone shakes hands across gender; a smile and nod are safe choices.",
          "Drill: `Salam yang aman adalah tersenyum.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Indonesia rất đa tôn giáo và đa văn hóa: masjid, pura, gereja, vihara, klenteng và địa điểm adat đều có quy tắc riêng. Ở masjid thường cởi giày, ăn mặc kín đáo, giữ yên lặng và không đi vào khu cầu nguyện khi không chắc. Ở pura Bali, khách thường cần sarung/selendang và có khu vực cấm vào nếu đang có upacara. Ở gereja, giữ yên lặng, tắt tiếng HP và tránh đi lại trong lúc lễ. Quy tắc vàng là hỏi bằng câu lịch sự: `Boleh saya ...?`, `Apakah saya boleh ...?`, hoặc `Ada aturan khusus?`.",
    cultural_notes_en:
      "Indonesia is religiously and culturally diverse: mosques, Hindu temples, churches, Buddhist temples, Chinese temples, and adat sites each have their own rules. At mosques, visitors usually remove shoes, dress modestly, stay quiet, and avoid prayer areas if unsure. At Balinese temples, visitors often need a sarong/sash and some areas may be closed during ceremonies. At churches, keep quiet, silence your phone, and avoid moving around during service. The golden rule is to ask politely: `Boleh saya ...?`, `Apakah saya boleh ...?`, or `Ada aturan khusus?`.",
    tip_advice_vi:
      "Mẹo cho người Việt: `sopan santun` là nếp lịch sự/hành xử đúng mực, gần với 'lễ phép' và 'ý tứ' trong tiếng Việt. `Adat` không chỉ là truyền thống chung chung; ở Indonesia, adat có thể quyết định cách mặc, cách ngồi, ai được vào đâu, có được chụp ảnh không. Khi chưa chắc, dùng `Maaf, saya belum tahu aturannya` (Xin lỗi, tôi chưa biết quy định) rồi hỏi tiếp.",
    tip_advice_en:
      "Tip for Vietnamese speakers: `sopan santun` means proper manners, close to Vietnamese ideas of lễ phép and ý tứ. `Adat` is not just generic tradition; in Indonesia it can determine clothing, seating, who may enter which area, and whether photos are allowed. When unsure, say `Maaf, saya belum tahu aturannya` (Sorry, I do not know the rules yet), then ask.",
    vocabulary: [
      {
        word: "sopan santun",
        en: "manners / etiquette",
        vi: "lễ phép / phép lịch sự",
        pos: "noun phrase",
        pronunciation_vi: "SO-pan SAN-tun",
        pronunciation_en: "SO-pan SAN-toon",
      },
      {
        word: "masjid",
        en: "mosque",
        vi: "nhà thờ Hồi giáo",
        pos: "noun",
        pronunciation_vi: "MAS-jid",
        pronunciation_en: "MAS-jid",
      },
      {
        word: "pura",
        en: "Hindu temple",
        vi: "đền Hindu",
        pos: "noun",
        pronunciation_vi: "PU-ra",
        pronunciation_en: "POO-ra",
      },
      {
        word: "gereja",
        en: "church",
        vi: "nhà thờ",
        pos: "noun",
        pronunciation_vi: "GE-re-ja",
        pronunciation_en: "GE-re-ja",
      },
      {
        word: "pakaian sopan",
        en: "modest / polite clothing",
        vi: "trang phục lịch sự / kín đáo",
        pos: "noun phrase",
        pronunciation_vi: "pa-KAI-an SO-pan",
        pronunciation_en: "pa-KAI-an SO-pan",
      },
      {
        word: "izin foto",
        en: "permission to take photos",
        vi: "sự cho phép chụp ảnh",
        pos: "noun phrase",
        pronunciation_vi: "I-zin FO-to",
        pronunciation_en: "EE-zin FO-to",
      },
      {
        word: "adat",
        en: "custom / customary law",
        vi: "phong tục / lệ truyền thống",
        pos: "noun",
        pronunciation_vi: "A-dat",
        pronunciation_en: "A-dat",
      },
      {
        word: "menghormati",
        en: "to respect",
        vi: "tôn trọng",
        pos: "verb",
        pronunciation_vi: "meng-hor-MA-ti",
        pronunciation_en: "meng-hor-MA-tee",
      },
      {
        word: "aturan khusus",
        en: "special rules",
        vi: "quy định riêng",
        pos: "noun phrase",
        pronunciation_vi: "a-TUR-an KHU-sus",
        pronunciation_en: "a-TOOR-an KHU-soos",
      },
      {
        word: "selendang",
        en: "sash / shawl",
        vi: "khăn choàng / dải thắt",
        pos: "noun",
        pronunciation_vi: "se-LEN-dang",
        pronunciation_en: "se-LEN-dang",
      },
    ],
    dialogue: [
      {
        speaker: "Lan",
        text: "Maaf, apakah saya boleh masuk ke pura ini?",
        vi: "Xin lỗi, tôi có thể vào ngôi đền này không?",
        en: "Excuse me, may I enter this temple?",
      },
      {
        speaker: "Petugas",
        text: "Boleh, tapi silakan memakai sarung dan selendang dulu.",
        vi: "Được, nhưng vui lòng mặc sarong và thắt khăn trước.",
        en: "Yes, but please put on a sarong and sash first.",
      },
      {
        speaker: "Lan",
        text: "Baik. Apakah boleh mengambil foto di dalam?",
        vi: "Vâng. Có được chụp ảnh bên trong không?",
        en: "Okay. Is it allowed to take photos inside?",
      },
      {
        speaker: "Petugas",
        text: "Untuk area upacara, mohon jangan foto dulu.",
        vi: "Ở khu vực nghi lễ, xin đừng chụp ảnh lúc này.",
        en: "For the ceremony area, please do not take photos for now.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ/cụm từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word or phrase with its Vietnamese meaning:",
        items: [
          { prompt: "masjid", answer: "nhà thờ Hồi giáo" },
          { prompt: "pura", answer: "đền Hindu" },
          { prompt: "gereja", answer: "nhà thờ" },
          { prompt: "pakaian sopan", answer: "trang phục lịch sự" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu:",
        instruction_en: "Fill in the missing word:",
        items: [
          {
            prompt: "Sebelum masuk masjid, kita harus melepas ___. (giày)",
            answer: "sepatu",
            options: ["sepatu", "sarung", "salam"],
          },
          {
            prompt: "Boleh saya mengambil ___ di sini? (ảnh)",
            answer: "foto",
            options: ["foto", "adat", "aturan"],
          },
          {
            prompt: "Saya menghormati ___ setempat. (phong tục)",
            answer: "adat",
            options: ["adat", "alamat", "agama"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi có thể chụp ảnh ở đây không?", answer: "Boleh saya mengambil foto di sini?" },
          { prompt: "Tôi mặc trang phục lịch sự.", answer: "Saya memakai pakaian sopan." },
          { prompt: "Tôi tôn trọng phong tục địa phương.", answer: "Saya menghormati adat setempat." },
        ],
      },
    ],
  },
];

export default religiousCulturalEtiquetteLessons;
