// Mosque & Prayer Etiquette Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file following the established Indonesian extra
// format. The `en` field holds TARGET-LANGUAGE Indonesian, `vi` holds the
// Vietnamese gloss, and pronunciation_focus carries Vietnamese L1 notes with
// English companion explanations in the same order.

type LessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar/culture notes, incl. L1 traps. */
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
  content?: string;
};

export const mosquePrayerEtiquetteLessons: IndonesianLesson[] = [
  {
    id: "indonesian_mosque_prayer_etiquette",
    level: "B1",
    category: "culture_religion",
    title_vi: "Ứng xử ở masjid: wudu, salat Jumat và sopan santun",
    title_en: "Mosque etiquette: wudu, Friday prayer and respectful behavior",
    sentences: [
      {
        en: "Sebelum masuk masjid, kita melepas sandal dan sepatu.",
        vi: "Trước khi vào nhà thờ Hồi giáo, chúng ta cởi dép và giày.",
        pronunciation_focus: [
          "MAS-jid = nhà thờ Hồi giáo; âm cuối `d` đọc nhẹ nhưng rõ.",
          "`melepas sandal dan sepatu` = cởi dép và giày; lịch sự hơn `buka sandal` trong văn phong hướng dẫn.",
          "Lỗi người Việt: dùng `di masjid` cho hướng đi. Nói `masuk masjid` hoặc `masuk ke masjid` khi vào trong.",
        ],
        pronunciation_focus_en: [
          "MAS-jid means mosque; pronounce the final `d` lightly but clearly.",
          "`melepas sandal dan sepatu` means taking off sandals and shoes; it is more polished than `buka sandal` in guidance.",
          "VN-speaker trap: using `di masjid` for direction. Say `masuk masjid` or `masuk ke masjid` when entering.",
        ],
      },
      {
        en: "Tempat wudu ada di sebelah kanan.",
        vi: "Chỗ rửa trước khi cầu nguyện ở bên phải.",
        pronunciation_focus: [
          "`wudu` là việc rửa tay, mặt, chân trước khi salat; không dịch thành tắm.",
          "`tempat wudu` = khu/chỗ wudu; rất hay hỏi trong masjid lớn.",
          "Lỗi người Việt: hỏi `toilet di mana?` khi muốn wudu. Toilet và tempat wudu có thể ở gần nhau nhưng không giống nhau.",
        ],
        pronunciation_focus_en: [
          "`wudu` is the ritual washing before salat; it is not the same as bathing.",
          "`tempat wudu` means the wudu area, a useful phrase in a large mosque.",
          "VN-speaker trap: asking `toilet di mana?` when you mean wudu. Toilets and wudu areas may be nearby but are not the same.",
        ],
      },
      {
        en: "Kalau ikut salat Jumat, sebaiknya datang lebih awal.",
        vi: "Nếu tham gia lễ cầu nguyện thứ Sáu, nên đến sớm hơn.",
        pronunciation_focus: [
          "`salat Jumat` = lễ cầu nguyện thứ Sáu, đặc biệt quan trọng với nam giới Hồi giáo.",
          "`ikut salat Jumat` = tham gia salat Jumat; `ikut` nghe tự nhiên khi bạn nói tham dự cùng mọi người.",
          "Lỗi người Việt: nói `Jumat salat`. Thứ tự tự nhiên là `salat Jumat`.",
        ],
        pronunciation_focus_en: [
          "`salat Jumat` means Friday prayer, especially important for Muslim men.",
          "`ikut salat Jumat` means join Friday prayer; `ikut` sounds natural for participating with others.",
          "VN-speaker trap: saying `Jumat salat`. The natural order is `salat Jumat`.",
        ],
      },
      {
        en: "Mbak, apakah saya bisa pinjam mukena?",
        vi: "Chị ơi, tôi có thể mượn áo cầu nguyện nữ không?",
        pronunciation_focus: [
          "`mukena` là trang phục cầu nguyện nữ phổ biến ở Indonesia.",
          "`pinjam mukena` = mượn mukena; nhiều masjid có mukena chung, nhưng nên hỏi trước.",
          "Lỗi người Việt: gọi mukena là `baju putih` hoặc `áo trắng`. Dùng đúng từ `mukena`.",
        ],
        pronunciation_focus_en: [
          "`mukena` is a common women's prayer garment in Indonesia.",
          "`pinjam mukena` means borrow a mukena; many mosques have shared ones, but ask first.",
          "VN-speaker trap: calling it `baju putih` or 'white clothes'. Use the specific word `mukena`.",
        ],
      },
      {
        en: "Mas, apakah ada sarung yang bisa dipinjam?",
        vi: "Anh ơi, có sarong nào có thể mượn không?",
        pronunciation_focus: [
          "`sarung` là vải quấn, thường được nam giới mặc khi salat hoặc khi cần ăn mặc kín đáo hơn.",
          "`yang bisa dipinjam` = cái có thể được mượn; thể bị động `di-` làm câu hỏi lịch sự.",
          "Lỗi người Việt: nói `bisa saya pinjam sarung?` được, nhưng `ada sarung yang bisa dipinjam?` mềm hơn khi hỏi người quản lý masjid.",
        ],
        pronunciation_focus_en: [
          "`sarung` is a wrapped cloth often worn by men for prayer or for more modest dress.",
          "`yang bisa dipinjam` means one that can be borrowed; passive `di-` makes the question polite.",
          "VN-speaker trap: `bisa saya pinjam sarung?` is understandable, but `ada sarung yang bisa dipinjam?` is softer when asking mosque staff.",
        ],
      },
      {
        en: "Saat azan berkumandang, kami berhenti berbicara sebentar.",
        vi: "Khi tiếng gọi cầu nguyện vang lên, chúng tôi tạm ngừng nói chuyện.",
        pronunciation_focus: [
          "`azan` = tiếng gọi cầu nguyện; `berkumandang` = vang lên, nghe trang trọng và tự nhiên.",
          "`berhenti berbicara sebentar` = ngừng nói chuyện một lúc; phù hợp để thể hiện tôn trọng.",
          "Lỗi người Việt: dùng `suara azan datang`. Nói tự nhiên là `azan berkumandang` hoặc `terdengar azan`.",
        ],
        pronunciation_focus_en: [
          "`azan` means the call to prayer; `berkumandang` means resounds and sounds natural in this context.",
          "`berhenti berbicara sebentar` means stop speaking for a moment, appropriate for showing respect.",
          "VN-speaker trap: saying `suara azan datang`. Natural options are `azan berkumandang` or `terdengar azan`.",
        ],
      },
      {
        en: "Tolong luruskan saf dan jangan mendahului imam.",
        vi: "Vui lòng xếp thẳng hàng cầu nguyện và đừng đi trước imam.",
        pronunciation_focus: [
          "`saf` là hàng người khi salat; `luruskan saf` là câu rất thường nghe trước cầu nguyện.",
          "`imam` là người dẫn salat; `mendahului imam` = làm động tác trước imam.",
          "Lỗi người Việt: dịch `hàng` thành `baris` ở đây. Trong ngữ cảnh salat, từ đúng là `saf`.",
        ],
        pronunciation_focus_en: [
          "`saf` is the prayer row; `luruskan saf` is commonly heard before prayer.",
          "`imam` is the prayer leader; `mendahului imam` means moving before the imam.",
          "VN-speaker trap: translating 'row' as `baris` here. In salat context, the right term is `saf`.",
        ],
      },
      {
        en: "Saya titip sandal di sini supaya tidak tertukar.",
        vi: "Tôi gửi dép ở đây để không bị lấy nhầm.",
        pronunciation_focus: [
          "`titip sandal` = gửi/nhờ giữ dép; rất thực tế ở masjid đông.",
          "`tertukar` = bị lẫn/bị nhầm với của người khác, không nhất thiết bị mất cắp.",
          "Lỗi người Việt: dùng `hilang` cho mọi trường hợp. Nếu dép bị đổi nhầm, nói `tertukar`.",
        ],
        pronunciation_focus_en: [
          "`titip sandal` means leave sandals with someone or at a place for safekeeping; very practical at a crowded mosque.",
          "`tertukar` means accidentally swapped or mixed up with someone else's item, not necessarily stolen.",
          "VN-speaker trap: using `hilang` for every case. If sandals are swapped by mistake, say `tertukar`.",
        ],
      },
      {
        en: "Maaf, apakah pengunjung boleh duduk di bagian belakang?",
        vi: "Xin lỗi, khách tham quan có được ngồi ở khu phía sau không?",
        pronunciation_focus: [
          "`pengunjung` = khách tham quan/khách đến; dùng tốt nếu bạn không tham gia cầu nguyện.",
          "`bagian belakang` = khu phía sau; hữu ích khi không chắc khu nào dành cho ai.",
          "Lỗi người Việt: tự chọn chỗ ngồi ở nơi tôn giáo. Hỏi `apakah ... boleh ...?` trước khi ngồi.",
        ],
        pronunciation_focus_en: [
          "`pengunjung` means visitor; use it if you are not joining the prayer.",
          "`bagian belakang` means the back section, useful when you are unsure which area is for whom.",
          "VN-speaker trap: choosing a seat on your own in a religious place. Ask `apakah ... boleh ...?` before sitting.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, masjid là không gian cầu nguyện và cộng đồng. Trước khi vào khu cầu nguyện, thường cởi sandal/sepatu, ăn mặc sopan, giữ tiếng nói nhỏ, và chú ý khu nam/nữ nếu có. Wudu là nghi thức rửa trước salat; salat Jumat thường rất đông nên nên đến sớm. Mukena và sarung có thể được mượn ở một số masjid, nhưng cần hỏi lịch sự. Khi nghe azan hoặc khi người khác đang salat, khách nên đứng/ngồi yên, tránh đi ngang trước người đang cầu nguyện, và hỏi nếu không chắc quy định.",
    cultural_notes_en:
      "In Indonesia, a mosque is both a prayer space and a community space. Before entering the prayer area, people usually remove sandals/shoes, dress modestly, speak quietly, and pay attention to men's/women's sections if present. Wudu is the ritual washing before salat; Friday prayer is often crowded, so arriving early helps. Mukena and sarung may be available to borrow at some mosques, but ask politely. When the azan is heard or people are praying, visitors should stay still or move carefully, avoid walking in front of someone praying, and ask if unsure about the rules.",
    tip_advice_vi:
      "Mẹo cho người Việt: nhớ bốn cụm thực dụng ở masjid: `tempat wudu`, `pinjam mukena/sarung`, `luruskan saf`, và `titip sandal`. Khi chưa chắc, dùng khung lịch sự `Maaf, apakah saya boleh ...?` hoặc `Ada aturan khusus untuk pengunjung?`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: remember four practical mosque phrases: `tempat wudu`, `pinjam mukena/sarung`, `luruskan saf`, and `titip sandal`. When unsure, use the polite frame `Maaf, apakah saya boleh ...?` or `Ada aturan khusus untuk pengunjung?`.",
    vocabulary: [
      {
        word: "masjid",
        en: "mosque",
        vi: "nhà thờ Hồi giáo",
        pos: "noun",
        pronunciation_vi: "MAS-jid",
        pronunciation_en: "MAS-jid",
      },
      {
        word: "wudu",
        en: "ritual washing before prayer",
        vi: "nghi thức rửa trước khi cầu nguyện",
        pos: "noun / verb",
        pronunciation_vi: "wu-DU",
        pronunciation_en: "woo-DOO",
      },
      {
        word: "salat Jumat",
        en: "Friday prayer",
        vi: "lễ cầu nguyện thứ Sáu",
        pos: "noun phrase",
        pronunciation_vi: "SA-lat JUM-at",
        pronunciation_en: "SA-lat JOOM-at",
      },
      {
        word: "mukena",
        en: "women's prayer garment",
        vi: "trang phục cầu nguyện nữ",
        pos: "noun",
        pronunciation_vi: "mu-KE-na",
        pronunciation_en: "moo-KEH-na",
      },
      {
        word: "sarung",
        en: "sarong / wrapped cloth",
        vi: "sarong / vải quấn",
        pos: "noun",
        pronunciation_vi: "SA-rung",
        pronunciation_en: "SA-roong",
      },
      {
        word: "saf",
        en: "prayer row",
        vi: "hàng cầu nguyện",
        pos: "noun",
        pronunciation_vi: "saf",
        pronunciation_en: "saf",
      },
      {
        word: "azan",
        en: "call to prayer",
        vi: "tiếng gọi cầu nguyện",
        pos: "noun",
        pronunciation_vi: "A-zan",
        pronunciation_en: "AH-zan",
      },
      {
        word: "titip sandal",
        en: "leave sandals for safekeeping",
        vi: "gửi dép / nhờ giữ dép",
        pos: "verb phrase",
        pronunciation_vi: "TI-tip SAN-dal",
        pronunciation_en: "TEE-tip SAN-dal",
      },
    ],
    dialogue: [
      {
        speaker: "Pengunjung",
        text: "Maaf, tempat wudu ada di mana?",
        vi: "Xin lỗi, chỗ wudu ở đâu ạ?",
        en: "Excuse me, where is the wudu area?",
      },
      {
        speaker: "Petugas Masjid",
        text: "Di sebelah kanan, dekat tempat sandal.",
        vi: "Ở bên phải, gần chỗ để dép.",
        en: "On the right, near the sandal area.",
      },
      {
        speaker: "Pengunjung",
        text: "Apakah saya bisa pinjam sarung?",
        vi: "Tôi có thể mượn sarong không ạ?",
        en: "May I borrow a sarong?",
      },
      {
        speaker: "Petugas Masjid",
        text: "Bisa. Setelah dipakai, tolong kembalikan ke rak ini.",
        vi: "Có thể. Sau khi dùng, vui lòng trả lại kệ này.",
        en: "Yes. After using it, please return it to this shelf.",
      },
      {
        speaker: "Pengunjung",
        text: "Baik. Kalau azan sudah mulai, saya duduk di bagian belakang saja.",
        vi: "Vâng. Nếu azan bắt đầu rồi, tôi sẽ ngồi ở khu phía sau thôi.",
        en: "Okay. If the azan has started, I will just sit in the back section.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Chỗ wudu ở bên phải.",
        prompt_en: "Translate into Indonesian: The wudu area is on the right.",
        answer: "Tempat wudu ada di sebelah kanan.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Tolong luruskan ___ dan jangan mendahului imam.",
        prompt_en: "Fill in the blank: Tolong luruskan ___ dan jangan mendahului imam.",
        answer: "saf",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi có thể mượn mukena không?",
        prompt_en: "Translate into Indonesian: May I borrow a mukena?",
        answer: "Apakah saya bisa pinjam mukena?",
      },
      {
        type: "roleplay",
        prompt_vi: "Bạn là khách ở masjid. Hỏi lịch sự liệu khách tham quan có được ngồi ở khu phía sau không.",
        prompt_en: "You are a visitor at a mosque. Politely ask whether visitors may sit in the back section.",
        answer: "Maaf, apakah pengunjung boleh duduk di bagian belakang?",
      },
    ],
  },
];
