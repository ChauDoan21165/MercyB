// Wedding Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson following the established Indonesian lesson shape.
// Field convention: sentence `en` is the TARGET-LANGUAGE text (Indonesian), and
// `vi` is the Vietnamese gloss. `pronunciation_focus` gives Vietnamese L1 notes;
// `pronunciation_focus_en` is the English companion in the same order.

export type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

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
    id: "indonesian_wedding_ceremony",
    level: "A2",
    category: "culture",
    title_vi: "Đám cưới Indonesia: akad, resepsi và adat",
    title_en: "Indonesian weddings: akad, reception and customs",
    sentences: [
      {
        en: "Mereka akan nikah bulan depan.",
        vi: "Họ sẽ cưới vào tháng tới.",
        pronunciation_focus: [
          "ME-re-ka A-kan NI-kah BU-lan de-PAN - `nikah` = cưới/kết hôn, rất hay dùng trong nói thường ngày.",
          "Lỗi người Việt: thêm `menikah` mọi lúc. `Menikah` đúng và trang trọng hơn; `nikah` tự nhiên trong hội thoại.",
          "Luyện: `Mereka akan nikah bulan depan.`",
        ],
        pronunciation_focus_en: [
          "ME-re-ka A-kan NI-kah BU-lan de-PAN - `nikah` = marry/get married, very common in everyday speech.",
          "VN-speaker trap: always using `menikah`. `Menikah` is correct and more formal; `nikah` is natural in conversation.",
          "Drill: `Mereka akan nikah bulan depan.`",
        ],
      },
      {
        en: "Akad nikahnya di masjid pagi hari.",
        vi: "Lễ akad nikah của họ ở nhà thờ Hồi giáo vào buổi sáng.",
        pronunciation_focus: [
          "A-kad NI-kah-nya di MAS-jid PA-gi HA-ri - `akad nikah` = nghi thức ký kết/lời thề hôn nhân theo Hồi giáo.",
          "Lỗi người Việt: dịch `akad` thành tiệc cưới. `Akad` là phần nghi lễ chính, không phải `resepsi`.",
          "Luyện: `Akad nikahnya di masjid pagi hari.`",
        ],
        pronunciation_focus_en: [
          "A-kad NI-kah-nya di MAS-jid PA-gi HA-ri - `akad nikah` = the Islamic marriage contract/vow ceremony.",
          "VN-speaker trap: translating `akad` as the wedding party. `Akad` is the core ceremony, not the `resepsi`.",
          "Drill: `Akad nikahnya di masjid pagi hari.`",
        ],
      },
      {
        en: "Resepsinya malam hari di gedung.",
        vi: "Tiệc cưới/tiệc tiếp khách vào buổi tối ở hội trường.",
        pronunciation_focus: [
          "re-SEP-si-nya MA-lam HA-ri di GE-dung - `resepsi` = tiệc tiếp khách sau nghi lễ; `gedung` = tòa nhà/hội trường.",
          "Lỗi người Việt: dùng `pesta` cho mọi thứ. `Resepsi` là từ cụ thể cho phần đón khách trong đám cưới.",
          "Luyện: `Resepsinya malam hari di gedung.`",
        ],
        pronunciation_focus_en: [
          "re-SEP-si-nya MA-lam HA-ri di GE-dung - `resepsi` = reception after the ceremony; `gedung` = building/event hall.",
          "VN-speaker trap: using `pesta` for everything. `Resepsi` is the specific wedding reception.",
          "Drill: `Resepsinya malam hari di gedung.`",
        ],
      },
      {
        en: "Saya sudah menerima undangan pernikahan.",
        vi: "Tôi đã nhận thiệp mời đám cưới.",
        pronunciation_focus: [
          "me-ne-RI-ma un-DA-ngan per-ni-KA-han - `undangan` = lời mời/thiệp mời; `pernikahan` = hôn lễ/đám cưới.",
          "Lỗi người Việt: nói `kartu undang`. Cách tự nhiên là `undangan` hoặc `undangan pernikahan`.",
          "Luyện: `Saya sudah menerima undangan pernikahan.`",
        ],
        pronunciation_focus_en: [
          "me-ne-RI-ma un-DA-ngan per-ni-KA-han - `undangan` = invitation; `pernikahan` = wedding/marriage event.",
          "VN-speaker trap: saying `kartu undang`. Natural Indonesian is `undangan` or `undangan pernikahan`.",
          "Drill: `Saya sudah menerima undangan pernikahan.`",
        ],
      },
      {
        en: "Mas kawinnya berupa cincin emas.",
        vi: "Lễ vật cưới là nhẫn vàng.",
        pronunciation_focus: [
          "mas KA-win-nya be-RU-pa CHIN-chin E-mas - `mas kawin` = sính lễ/mahar; `cincin` đọc CHIN-chin.",
          "Lỗi người Việt: đọc chữ `c` như /k/. Trong `cincin`, `c` = 'ch'.",
          "Luyện: `Mas kawinnya berupa cincin emas.`",
        ],
        pronunciation_focus_en: [
          "mas KA-win-nya be-RU-pa CHIN-chin E-mas - `mas kawin` = dowry/mahr; `cincin` is CHIN-chin.",
          "VN-speaker trap: reading `c` as /k/. In `cincin`, `c` = 'ch'.",
          "Drill: `Mas kawinnya berupa cincin emas.`",
        ],
      },
      {
        en: "Keluarga pengantin memakai baju adat Jawa.",
        vi: "Gia đình cô dâu chú rể mặc trang phục truyền thống Java.",
        pronunciation_focus: [
          "ke-LU-ar-ga pe-NGAN-tin me-MA-kai BA-ju A-dat JA-wa - `pengantin` = cô dâu chú rể/người kết hôn; `adat` = phong tục/truyền thống.",
          "Lỗi người Việt: nhầm `Jawa` (Java/Javanese) với `Jawa Barat` (Tây Java). Nghi lễ Java thường nói `adat Jawa`.",
          "Luyện: `Keluarga pengantin memakai baju adat Jawa.`",
        ],
        pronunciation_focus_en: [
          "ke-LU-ar-ga pe-NGAN-tin me-MA-kai BA-ju A-dat JA-wa - `pengantin` = bride and groom/newlyweds; `adat` = custom/tradition.",
          "VN-speaker trap: confusing `Jawa` (Java/Javanese) with `Jawa Barat` (West Java). Javanese custom is `adat Jawa`.",
          "Drill: `Keluarga pengantin memakai baju adat Jawa.`",
        ],
      },
      {
        en: "Di pesta Sunda, ada acara sungkeman.",
        vi: "Trong tiệc cưới Sunda, có nghi thức sungkeman.",
        pronunciation_focus: [
          "di PES-ta SUN-da, A-da a-CHA-ra sung-KE-man - `Sunda` = người/văn hóa Sunda; `sungkeman` = nghi thức cúi xin phép/cảm ơn cha mẹ.",
          "Lỗi người Việt: gọi mọi văn hóa trên đảo Java là `Jawa`. Sunda là cộng đồng riêng, chủ yếu ở Tây Java.",
          "Luyện: `Di pesta Sunda, ada acara sungkeman.`",
        ],
        pronunciation_focus_en: [
          "di PES-ta SUN-da, A-da a-CHA-ra sung-KE-man - `Sunda` = Sundanese people/culture; `sungkeman` = kneeling to ask blessing/thank parents.",
          "VN-speaker trap: calling every culture on Java `Jawa`. Sundanese is distinct, centered mostly in West Java.",
          "Drill: `Di pesta Sunda, ada acara sungkeman.`",
        ],
      },
      {
        en: "Tamu biasanya memberi amplop untuk pengantin.",
        vi: "Khách thường đưa phong bì cho cô dâu chú rể.",
        pronunciation_focus: [
          "TA-mu bi-A-sa-nya mem-BE-ri AM-plop un-TUK pe-NGAN-tin - `amplop` = phong bì tiền mừng.",
          "Lỗi người Việt: nói `uang hadiah` nghe lạ. Trong đám cưới, người Indonesia hay nói `amplop`.",
          "Luyện: `Tamu biasanya memberi amplop untuk pengantin.`",
        ],
        pronunciation_focus_en: [
          "TA-mu bi-A-sa-nya mem-BE-ri AM-plop un-TUK pe-NGAN-tin - `amplop` = cash envelope for the couple.",
          "VN-speaker trap: saying `uang hadiah`, which sounds odd. At weddings, Indonesians often say `amplop`.",
          "Drill: `Tamu biasanya memberi amplop untuk pengantin.`",
        ],
      },
      {
        en: "Boleh foto bersama pengantin setelah resepsi?",
        vi: "Có thể chụp ảnh cùng cô dâu chú rể sau tiệc không?",
        pronunciation_focus: [
          "BO-leh FO-to ber-SA-ma pe-NGAN-tin se-TE-lah re-SEP-si - `boleh` = có được phép; `bersama` = cùng với.",
          "Lỗi người Việt: dùng `bisa` cho xin phép. `Bisa` được, nhưng `boleh` rõ nghĩa xin phép hơn.",
          "Luyện: `Boleh foto bersama pengantin setelah resepsi?`",
        ],
        pronunciation_focus_en: [
          "BO-leh FO-to ber-SA-ma pe-NGAN-tin se-TE-lah re-SEP-si - `boleh` = may/allowed; `bersama` = together with.",
          "VN-speaker trap: using `bisa` for permission. `Bisa` works, but `boleh` clearly asks permission.",
          "Drill: `Boleh foto bersama pengantin setelah resepsi?`",
        ],
      },
      {
        en: "Selamat menempuh hidup baru!",
        vi: "Chúc mừng bắt đầu cuộc sống mới!",
        pronunciation_focus: [
          "se-LA-mat me-NEM-puh HI-dup BA-ru - lời chúc cưới trang trọng và rất phổ biến.",
          "Lỗi người Việt: chỉ nói `selamat menikah`. Câu chúc tự nhiên hơn là `Selamat menempuh hidup baru!`",
          "Luyện: `Selamat menempuh hidup baru!`",
        ],
        pronunciation_focus_en: [
          "se-LA-mat me-NEM-puh HI-dup BA-ru - a formal and very common wedding wish.",
          "VN-speaker trap: only saying `selamat menikah`. A more natural set phrase is `Selamat menempuh hidup baru!`",
          "Drill: `Selamat menempuh hidup baru!`",
        ],
      },
    ],
    cultural_notes_vi:
      "Đám cưới Indonesia thường có hai phần: `akad nikah` là nghi lễ chính, còn `resepsi` là phần tiếp khách/ăn uống/chụp ảnh. Với gia đình Hồi giáo, `mas kawin` hoặc `mahar` là lễ vật bắt buộc trong akad. Nhiều gia đình kết hợp nghi lễ tôn giáo với `adat` địa phương. Trong adat Jawa có trang phục, trang điểm và nghi lễ trang trọng; trong adat Sunda có thể có `sungkeman`, lời xin phép và cảm ơn cha mẹ. Không nên gộp mọi phong tục Indonesia thành một kiểu duy nhất.",
    cultural_notes_en:
      "Indonesian weddings often have two parts: `akad nikah` is the core ceremony, while `resepsi` is the reception with guests, food, and photos. For Muslim families, `mas kawin` or `mahar` is required in the akad. Many families combine religious ceremony with local `adat`. Javanese weddings may include formal dress, makeup, and ceremonial sequences; Sundanese weddings may include `sungkeman`, asking blessing and thanking parents. Avoid treating all Indonesian customs as one single style.",
    tip_advice_vi:
      "Mẹo cho người Việt: nhớ ba cặp từ chính. `Nikah/menikah` = kết hôn, `akad` = nghi lễ chính, `resepsi` = tiệc tiếp khách. `Mas kawin` không phải tiền mừng của khách; tiền mừng khách bỏ trong `amplop`. Khi nói về văn hóa, dùng `adat Jawa` và `adat Sunda` một cách tôn trọng, vì mỗi cộng đồng có nghi thức riêng.",
    tip_advice_en:
      "Tip for Vietnamese speakers: keep three key terms separate. `Nikah/menikah` = get married, `akad` = the core ceremony, `resepsi` = the guest reception. `Mas kawin` is not the guest gift; guests give money in an `amplop`. When discussing culture, use `adat Jawa` and `adat Sunda` respectfully because each community has its own ceremonies.",
    vocabulary: [
      {
        word: "nikah",
        en: "to marry / marriage",
        vi: "cưới / kết hôn",
        pos: "verb/noun",
        pronunciation_vi: "NI-kah",
        pronunciation_en: "NEE-kah",
      },
      {
        word: "akad nikah",
        en: "marriage contract ceremony",
        vi: "lễ akad / nghi thức hôn nhân",
        pos: "noun phrase",
        pronunciation_vi: "A-kad NI-kah",
        pronunciation_en: "AH-kad NEE-kah",
      },
      {
        word: "resepsi",
        en: "wedding reception",
        vi: "tiệc cưới / tiệc tiếp khách",
        pos: "noun",
        pronunciation_vi: "re-SEP-si",
        pronunciation_en: "re-SEP-see",
      },
      {
        word: "undangan",
        en: "invitation",
        vi: "thiệp mời / lời mời",
        pos: "noun",
        pronunciation_vi: "un-DA-ngan",
        pronunciation_en: "oon-DAH-ngan",
      },
      {
        word: "mas kawin",
        en: "dowry / mahr",
        vi: "sính lễ / lễ vật cưới",
        pos: "noun phrase",
        pronunciation_vi: "mas KA-win",
        pronunciation_en: "mas KAH-win",
      },
      {
        word: "adat",
        en: "custom / tradition",
        vi: "phong tục / truyền thống",
        pos: "noun",
        pronunciation_vi: "A-dat",
        pronunciation_en: "AH-dat",
      },
      {
        word: "pengantin",
        en: "bride and groom / newlyweds",
        vi: "cô dâu chú rể",
        pos: "noun",
        pronunciation_vi: "pe-NGAN-tin",
        pronunciation_en: "pe-NGAHN-tin",
      },
      {
        word: "amplop",
        en: "cash envelope",
        vi: "phong bì tiền mừng",
        pos: "noun",
        pronunciation_vi: "AM-plop",
        pronunciation_en: "AM-plop",
      },
      {
        word: "adat Jawa",
        en: "Javanese customs",
        vi: "phong tục Java",
        pos: "noun phrase",
        pronunciation_vi: "A-dat JA-wa",
        pronunciation_en: "AH-dat JAH-wa",
      },
      {
        word: "adat Sunda",
        en: "Sundanese customs",
        vi: "phong tục Sunda",
        pos: "noun phrase",
        pronunciation_vi: "A-dat SUN-da",
        pronunciation_en: "AH-dat SOON-da",
      },
    ],
    dialogue: [
      {
        speaker: "Rina",
        text: "Kamu datang ke akad atau resepsi?",
        vi: "Bạn đến lễ akad hay tiệc cưới?",
        en: "Are you coming to the akad or the reception?",
      },
      {
        speaker: "Minh",
        text: "Saya datang ke resepsi malam hari. Saya sudah dapat undangan.",
        vi: "Tôi đến tiệc cưới buổi tối. Tôi đã nhận thiệp mời rồi.",
        en: "I am coming to the evening reception. I already got the invitation.",
      },
      {
        speaker: "Rina",
        text: "Jangan lupa bawa amplop untuk pengantin.",
        vi: "Đừng quên mang phong bì cho cô dâu chú rể.",
        en: "Do not forget to bring a cash envelope for the couple.",
      },
      {
        speaker: "Minh",
        text: "Baik. Mereka pakai adat Jawa atau adat Sunda?",
        vi: "Được. Họ dùng phong tục Java hay Sunda?",
        en: "Okay. Are they using Javanese or Sundanese customs?",
      },
      {
        speaker: "Rina",
        text: "Katanya adat Sunda, jadi mungkin ada sungkeman.",
        vi: "Nghe nói là phong tục Sunda, nên có thể có sungkeman.",
        en: "They said Sundanese customs, so there may be sungkeman.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Akad ____ di masjid pagi hari.`",
        prompt_en: "Fill in the blank: `Akad ____ di masjid pagi hari.`",
        answer: "nikahnya",
        explanation_vi: "`akad nikah` là nghi lễ kết hôn; thêm `-nya` = của họ/của buổi đó.",
        explanation_en: "`akad nikah` is the marriage ceremony; `-nya` means their/the ceremony's.",
      },
      {
        type: "multiple_choice",
        prompt_vi: "`Resepsi` nghĩa là gì trong đám cưới?",
        prompt_en: "What does `resepsi` mean in a wedding context?",
        choices: ["tiệc tiếp khách", "giấy khai sinh", "vé máy bay"],
        answer: "tiệc tiếp khách",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: `Tôi đã nhận thiệp mời đám cưới.`",
        prompt_en: "Translate into Indonesian: `I already received the wedding invitation.`",
        answer: "Saya sudah menerima undangan pernikahan.",
      },
      {
        type: "cultural_match",
        prompt_vi: "Ghép đúng: khách mừng tiền trong ____; lễ vật cưới là ____.",
        prompt_en: "Match correctly: guests give money in an ____; the marriage gift is ____.",
        answer: "amplop; mas kawin",
        explanation_vi: "`amplop` là phong bì của khách; `mas kawin`/`mahar` là lễ vật trong akad.",
        explanation_en: "`amplop` is the guest envelope; `mas kawin`/`mahar` is the marriage gift in the akad.",
      },
    ],
  },
];
