// Gym & Olahraga Indonesian (Vietnamese -> Indonesian study track).
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
    id: "indonesian_gym_olahraga",
    level: "A2",
    category: "health",
    title_vi: "Phòng gym và olahraga: fitness, tạ, treadmill",
    title_en: "Gym and exercise: fitness, weights, treadmill",
    sentences: [
      {
        en: "Saya mau daftar member gym.",
        vi: "Tôi muốn đăng ký hội viên phòng gym.",
        pronunciation_focus: [
          "SA-ya mau DAF-tar MEM-ber gym -- `daftar` = đăng ký; `member gym` = hội viên phòng gym.",
          "Lỗi người Việt: nói `mendaftar membership` nghe quá nặng. Hội thoại tự nhiên: `daftar member gym`.",
          "Luyện: `Saya mau daftar member gym.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau DAF-tar MEM-ber gym -- `daftar` = register; `member gym` = gym member.",
          "VN-speaker trap: saying formal `mendaftar membership`. Natural conversation: `daftar member gym`.",
          "Drill: `Saya mau daftar member gym.`",
        ],
      },
      {
        en: "Saya olahraga tiga kali seminggu.",
        vi: "Tôi tập thể thao ba lần một tuần.",
        pronunciation_focus: [
          "SA-ya o-lah-RA-ga TI-ga KA-li se-MING-gu -- `olahraga` = tập thể thao/thể thao.",
          "`tiga kali seminggu` = ba lần một tuần. Không cần giới từ như tiếng Việt.",
          "Luyện: `Saya olahraga tiga kali seminggu.`",
        ],
        pronunciation_focus_en: [
          "SA-ya o-lah-RA-ga TI-ga KA-li se-MING-gu -- `olahraga` = exercise/sport.",
          "`tiga kali seminggu` = three times a week. No extra preposition is needed.",
          "Drill: `Saya olahraga tiga kali seminggu.`",
        ],
      },
      {
        en: "Saya pemanasan dulu sebelum angkat beban.",
        vi: "Tôi khởi động trước khi nâng tạ.",
        pronunciation_focus: [
          "SA-ya pe-MA-nas-an DU-lu se-BE-lum ANG-kat BE-ban -- `pemanasan` = khởi động; `angkat beban` = nâng tạ.",
          "Lỗi người Việt: dịch 'tập tạ' thành `latihan berat`. Cụm đúng cho lifting là `angkat beban`.",
          "Luyện: `Saya pemanasan dulu sebelum angkat beban.`",
        ],
        pronunciation_focus_en: [
          "SA-ya pe-MA-nas-an DU-lu se-BE-lum ANG-kat BE-ban -- `pemanasan` = warm-up; `angkat beban` = lift weights.",
          "VN-speaker trap: translating 'weight training' as `latihan berat`. The lifting phrase is `angkat beban`.",
          "Drill: `Saya pemanasan dulu sebelum angkat beban.`",
        ],
      },
      {
        en: "Treadmill ini masih dipakai?",
        vi: "Máy chạy bộ này còn đang được dùng không?",
        pronunciation_focus: [
          "TRED-mil I-ni MA-sih di-PA-kai? -- `masih` = vẫn/còn; `dipakai` = đang được dùng.",
          "Mẫu lịch sự ở gym: hỏi `masih dipakai?` trước khi dùng máy, thay vì chỉ hỏi `boleh?`.",
          "Luyện: `Treadmill ini masih dipakai?`",
        ],
        pronunciation_focus_en: [
          "TRED-mill I-ni MA-sih di-PA-kai? -- `masih` = still; `dipakai` = being used.",
          "Polite gym pattern: ask `masih dipakai?` before using equipment, instead of just `boleh?`.",
          "Drill: `Treadmill ini masih dipakai?`",
        ],
      },
      {
        en: "Saya latihan otot dada dan kaki hari ini.",
        vi: "Hôm nay tôi tập cơ ngực và chân.",
        pronunciation_focus: [
          "SA-ya LA-tih-an O-tot DA-da dan KA-ki HA-ri I-ni -- `otot` = cơ bắp; `dada` = ngực; `kaki` = chân.",
          "Lỗi người Việt: nói `otot kaki saya latihan`. Trật tự tự nhiên: `latihan otot + phần cơ thể`.",
          "Luyện: `Saya latihan otot dada dan kaki.`",
        ],
        pronunciation_focus_en: [
          "SA-ya LA-tih-an O-tot DA-da dan KA-ki HA-ri I-ni -- `otot` = muscle; `dada` = chest; `kaki` = legs/feet.",
          "VN-speaker trap: saying `otot kaki saya latihan`. Natural order: `latihan otot + body part`.",
          "Drill: `Saya latihan otot dada dan kaki.`",
        ],
      },
      {
        en: "Personal trainer membantu saya memperbaiki teknik.",
        vi: "Huấn luyện viên cá nhân giúp tôi sửa kỹ thuật.",
        pronunciation_focus: [
          "PER-so-nal TREI-ner mem-BAN-tu SA-ya mem-per-BA-i-ki TEK-nik -- `membantu` = giúp; `memperbaiki` = cải thiện/sửa.",
          "`personal trainer` thường được dùng nguyên dạng tiếng Anh trong gym Indonesia.",
          "Luyện: `Personal trainer membantu saya.`",
        ],
        pronunciation_focus_en: [
          "PER-so-nal TRAY-ner mem-BAN-tu SA-ya mem-per-BA-i-ki TEK-nik -- `membantu` = help; `memperbaiki` = improve/fix.",
          "`personal trainer` is commonly used as an English loan phrase in Indonesian gyms.",
          "Drill: `Personal trainer membantu saya.`",
        ],
      },
      {
        en: "Jangan lupa minum air saat fitness.",
        vi: "Đừng quên uống nước khi tập fitness.",
        pronunciation_focus: [
          "JA-ngan LU-pa MI-num A-ir saat FIT-nes -- `jangan lupa` = đừng quên; `saat` = khi/lúc.",
          "`fitness` ở Indonesia có thể nghĩa là đi tập gym nói chung, không chỉ 'thể lực'.",
          "Luyện: `Jangan lupa minum air.`",
        ],
        pronunciation_focus_en: [
          "JA-ngan LU-pa MI-num A-ir saat FIT-ness -- `jangan lupa` = do not forget; `saat` = when/during.",
          "`fitness` in Indonesia can mean going to the gym in general, not only physical fitness.",
          "Drill: `Jangan lupa minum air.`",
        ],
      },
      {
        en: "Saya minum suplemen setelah latihan.",
        vi: "Tôi uống thực phẩm bổ sung sau khi tập.",
        pronunciation_focus: [
          "SA-ya MI-num su-ple-MEN se-TE-lah LA-tih-an -- `suplemen` = thực phẩm bổ sung; `setelah` = sau khi.",
          "Lỗi người Việt: dùng `obat` cho supplement. `Obat` = thuốc; `suplemen` = bổ sung, không nhất thiết là thuốc.",
          "Luyện: `Saya minum suplemen setelah latihan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MI-num su-ple-MEN se-TE-lah LA-tih-an -- `suplemen` = supplement; `setelah` = after.",
          "VN-speaker trap: using `obat` for supplements. `Obat` = medicine; `suplemen` = supplement, not necessarily medicine.",
          "Drill: `Saya minum suplemen setelah latihan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, người trẻ thường dùng lẫn từ Indonesia và tiếng Anh trong phòng gym: `gym`, `fitness`, `member`, `treadmill`, `personal trainer`, `reps`, và `set`. `Olahraga` là từ rộng hơn, dùng cho thể thao và tập luyện nói chung. Trong gym, nên hỏi `masih dipakai?` trước khi dùng máy hoặc ghế, lau mồ hôi sau khi tập, và trả tạ về chỗ cũ.",
    cultural_notes_en:
      "In Indonesia, younger speakers often mix Indonesian and English at the gym: `gym`, `fitness`, `member`, `treadmill`, `personal trainer`, `reps`, and `set`. `Olahraga` is broader and means sports or exercise in general. In the gym, ask `masih dipakai?` before using a machine or bench, wipe sweat after training, and return weights to their place.",
    tip_advice_vi:
      "Mẹo cho người Việt: `latihan` = buổi/tập luyện, `olahraga` = tập thể thao, `angkat beban` = nâng tạ, `otot` = cơ bắp. Tiếng Indonesia không chia động từ, nên câu lịch tập rất gọn: `Saya olahraga tiga kali seminggu`, `Saya latihan kaki hari ini`, `Saya istirahat besok`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: `latihan` = training/session, `olahraga` = exercise/sport, `angkat beban` = lift weights, `otot` = muscle. Indonesian has no verb conjugation, so schedule sentences stay compact: `Saya olahraga tiga kali seminggu`, `Saya latihan kaki hari ini`, `Saya istirahat besok`.",
    vocabulary: [
      {
        word: "olahraga",
        en: "exercise / sport",
        vi: "tập thể thao / thể thao",
        pos: "noun / verb",
        pronunciation_vi: "o-lah-RA-ga",
        pronunciation_en: "oh-lah-RAH-ga",
      },
      {
        word: "fitness",
        en: "fitness / gym workout",
        vi: "tập fitness / tập gym",
        pos: "noun",
        pronunciation_vi: "FIT-nes",
        pronunciation_en: "FIT-ness",
      },
      {
        word: "angkat beban",
        en: "to lift weights",
        vi: "nâng tạ",
        pos: "verb phrase",
        pronunciation_vi: "ANG-kat BE-ban",
        pronunciation_en: "ANG-kat BE-ban",
      },
      {
        word: "treadmill",
        en: "treadmill",
        vi: "máy chạy bộ",
        pos: "noun",
        pronunciation_vi: "TRED-mil",
        pronunciation_en: "TRED-mill",
      },
      {
        word: "personal trainer",
        en: "personal trainer",
        vi: "huấn luyện viên cá nhân",
        pos: "noun",
        pronunciation_vi: "PER-so-nal TREI-ner",
        pronunciation_en: "PER-so-nal TRAY-ner",
      },
      {
        word: "member",
        en: "member",
        vi: "hội viên",
        pos: "noun",
        pronunciation_vi: "MEM-ber",
        pronunciation_en: "MEM-ber",
      },
      {
        word: "suplemen",
        en: "supplement",
        vi: "thực phẩm bổ sung",
        pos: "noun",
        pronunciation_vi: "su-ple-MEN",
        pronunciation_en: "su-ple-MEN",
      },
      {
        word: "otot",
        en: "muscle",
        vi: "cơ bắp",
        pos: "noun",
        pronunciation_vi: "O-tot",
        pronunciation_en: "OH-tot",
      },
      {
        word: "pemanasan",
        en: "warm-up",
        vi: "khởi động",
        pos: "noun",
        pronunciation_vi: "pe-MA-nas-an",
        pronunciation_en: "pe-MA-nas-an",
      },
      {
        word: "istirahat",
        en: "rest",
        vi: "nghỉ ngơi",
        pos: "noun / verb",
        pronunciation_vi: "is-ti-RA-hat",
        pronunciation_en: "is-tee-RA-hat",
      },
    ],
    dialogue: [
      {
        speaker: "Resepsionis",
        text: "Halo, mau daftar member gym?",
        vi: "Xin chào, bạn muốn đăng ký hội viên phòng gym à?",
        en: "Hello, do you want to register as a gym member?",
      },
      {
        speaker: "Khach",
        text: "Iya, saya mau member bulanan.",
        vi: "Vâng, tôi muốn gói hội viên theo tháng.",
        en: "Yes, I want a monthly membership.",
      },
      {
        speaker: "Khach",
        text: "Treadmill ini masih dipakai?",
        vi: "Máy chạy bộ này còn đang được dùng không?",
        en: "Is this treadmill still being used?",
      },
      {
        speaker: "Member lain",
        text: "Tidak, silakan pakai. Saya sudah selesai.",
        vi: "Không, bạn cứ dùng đi. Tôi xong rồi.",
        en: "No, please use it. I am finished.",
      },
      {
        speaker: "Personal trainer",
        text: "Pemanasan dulu, lalu kita latihan otot kaki.",
        vi: "Khởi động trước, rồi chúng ta tập cơ chân.",
        en: "Warm up first, then we train leg muscles.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi tập thể thao ba lần một tuần.",
        prompt_en: "Translate into Indonesian: I exercise three times a week.",
        answer: "Saya olahraga tiga kali seminggu.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Saya pemanasan dulu sebelum ____ beban.",
        prompt_en: "Fill in the blank: Saya pemanasan dulu sebelum ____ beban.",
        answer: "angkat",
      },
      {
        type: "matching",
        prompt_vi: "Ghép từ với nghĩa đúng.",
        prompt_en: "Match each word with the correct meaning.",
        pairs: [
          ["otot", "cơ bắp / muscle"],
          ["treadmill", "máy chạy bộ / treadmill"],
          ["suplemen", "thực phẩm bổ sung / supplement"],
          ["pemanasan", "khởi động / warm-up"],
        ],
      },
    ],
    content:
      "Useful gym chunks: `Treadmill ini masih dipakai?` (is this treadmill still being used?), `Saya mau daftar member gym` (I want to register as a gym member), `Saya latihan otot dada hari ini` (I train chest muscles today), `Jangan lupa pemanasan` (do not forget to warm up), and `Saya istirahat besok` (I rest tomorrow).",
  },
];
