// Parenting Teenagers Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack. Indonesian target text lives in `en`,
// Vietnamese glosses in `vi`, Vietnamese L1 notes in `pronunciation_focus`, and
// English companion explanations in `pronunciation_focus_en`.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  /** Indonesian word/phrase. */
  word: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Part of speech. */
  pos: string;
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
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

// Loosely typed so per-type fields (translation, fill_blank, matching) can vary.
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

export const parentingTeenagersLessons: IndonesianLesson[] = [
  {
    id: "indonesian_parenting_teenagers",
    level: "B1",
    category: "family_parenting",
    title_vi: "Nuôi dạy con tuổi teen và giao tiếp trong gia đình",
    title_en: "Parenting teenagers and family communication",
    sentences: [
      {
        en: "Anak saya sudah remaja, jadi kami perlu aturan rumah yang jelas.",
        vi: "Con tôi đã là thiếu niên, nên chúng tôi cần quy tắc gia đình rõ ràng.",
        pronunciation_focus: [
          "A-nak SA-ya SU-dah re-MA-ja - `remaja` = tuổi teen/thiếu niên.",
          "`aturan rumah` = quy tắc gia đình; `jelas` = rõ ràng.",
          "Lỗi người Việt: dịch `house rule` thành `hukum rumah`. Trong gia đình, dùng `aturan rumah`.",
          "Luyện: `Kami perlu aturan rumah yang jelas.`",
        ],
        pronunciation_focus_en: [
          "A-nak SA-ya SOO-dah re-MA-ja - `remaja` = teenager/adolescent.",
          "`aturan rumah` = house rules/family rules; `jelas` = clear.",
          "VN-speaker trap: translating 'house rule' as `hukum rumah`. In family context, use `aturan rumah`.",
          "Drill: `Kami perlu aturan rumah yang jelas.`",
        ],
      },
      {
        en: "Kami membatasi waktu memakai gawai setelah jam sembilan malam.",
        vi: "Chúng tôi giới hạn thời gian dùng thiết bị sau chín giờ tối.",
        pronunciation_focus: [
          "mem-BA-tas-i WAK-tu me-MA-kai GA-wai - `membatasi` = giới hạn; `gawai` = thiết bị/điện thoại.",
          "`setelah jam sembilan malam` = sau chín giờ tối; `setelah` dùng cho sau một mốc.",
          "Lỗi người Việt: chỉ nói `HP`. `HP` thông dụng, nhưng `gawai` trung tính hơn khi nói quy tắc gia đình.",
          "Luyện: `Kami membatasi waktu memakai gawai.`",
        ],
        pronunciation_focus_en: [
          "mem-BA-ta-see WAK-too me-MA-kai GA-wai - `membatasi` = limit; `gawai` = device/gadget.",
          "`setelah jam sembilan malam` = after nine at night; `setelah` follows a time point.",
          "VN-speaker trap: only saying `HP`. `HP` is common, but `gawai` is more neutral for family rules.",
          "Drill: `Kami membatasi waktu memakai gawai.`",
        ],
      },
      {
        en: "Uang jajan diberikan setiap minggu, bukan setiap hari.",
        vi: "Tiền tiêu vặt được đưa mỗi tuần, không phải mỗi ngày.",
        pronunciation_focus: [
          "U-ang JA-jan di-be-RI-kan se-TI-ap MING-gu - `uang jajan` = tiền tiêu vặt.",
          "`diberikan` = được đưa/được cho; bị động `di-` hợp khi nói quy tắc chung.",
          "Lỗi người Việt: dịch `ăn vặt` quá sát. `Jajan` là ăn/mua đồ vặt; `uang jajan` là tiền tiêu vặt.",
          "Luyện: `Uang jajan diberikan setiap minggu.`",
        ],
        pronunciation_focus_en: [
          "OO-ang JA-jan dee-be-REE-kan se-TEE-ap MING-goo - `uang jajan` = allowance/pocket money.",
          "`diberikan` = is given; passive `di-` fits general rules.",
          "VN-speaker trap: over-literalizing `jajan` as only snacking. `Uang jajan` means allowance.",
          "Drill: `Uang jajan diberikan setiap minggu.`",
        ],
      },
      {
        en: "Saya ingin tahu pergaulan anak saya tanpa terlalu mengontrol.",
        vi: "Tôi muốn biết quan hệ bạn bè của con tôi mà không kiểm soát quá mức.",
        pronunciation_focus: [
          "per-GAU-lan A-nak SA-ya - `pergaulan` = môi trường bạn bè/quan hệ xã hội.",
          "`tanpa terlalu mengontrol` = không kiểm soát quá mức; `tanpa` = không có/không làm.",
          "Mẹo: `pergaulan` hay dùng khi phụ huynh nói về bạn bè và ảnh hưởng xã hội của con.",
          "Luyện: `Saya ingin tahu pergaulan anak saya.`",
        ],
        pronunciation_focus_en: [
          "per-GAU-lan A-nak SA-ya - `pergaulan` = social circle/peer environment.",
          "`tanpa terlalu mengontrol` = without controlling too much; `tanpa` = without.",
          "Tip: `pergaulan` is common when parents talk about friends and social influence.",
          "Drill: `Saya ingin tahu pergaulan anak saya.`",
        ],
      },
      {
        en: "Kalau ada masalah di sekolah, anak saya boleh cerita kepada kami.",
        vi: "Nếu có vấn đề ở trường, con tôi có thể kể với chúng tôi.",
        pronunciation_focus: [
          "KA-lau A-da ma-SA-lah di se-KO-lah - `masalah` = vấn đề.",
          "`boleh cerita kepada kami` = được phép/có thể kể với chúng tôi; `kami` không gồm người nghe.",
          "Lỗi người Việt: dùng `bicara` cho mọi thứ. Khi kể chuyện/tâm sự, `cerita` tự nhiên hơn.",
          "Luyện: `Anak saya boleh cerita kepada kami.`",
        ],
        pronunciation_focus_en: [
          "KA-lau A-da ma-SA-lah dee se-KO-lah - `masalah` = problem.",
          "`boleh cerita kepada kami` = may/can tell us; `kami` excludes the listener.",
          "VN-speaker trap: using `bicara` for everything. For telling/sharing a story, `cerita` is more natural.",
          "Drill: `Anak saya boleh cerita kepada kami.`",
        ],
      },
      {
        en: "Kami mencoba berkomunikasi tanpa langsung marah.",
        vi: "Chúng tôi cố gắng giao tiếp mà không nổi giận ngay.",
        pronunciation_focus: [
          "men-CO-ba ber-ko-mu-ni-KA-si - `mencoba` = thử/cố gắng; `berkomunikasi` = giao tiếp.",
          "`tanpa langsung marah` = không giận ngay; `langsung` = ngay lập tức.",
          "Lỗi người Việt: nói `komunikasi` như danh từ trong câu động từ. Dùng `berkomunikasi` để nói 'giao tiếp'.",
          "Luyện: `Kami mencoba berkomunikasi.`",
        ],
        pronunciation_focus_en: [
          "men-CO-ba ber-ko-moo-nee-KA-see - `mencoba` = try; `berkomunikasi` = communicate.",
          "`tanpa langsung marah` = without immediately getting angry; `langsung` = directly/immediately.",
          "VN-speaker trap: using noun `komunikasi` as a verb. Use `berkomunikasi` for 'to communicate'.",
          "Drill: `Kami mencoba berkomunikasi.`",
        ],
      },
      {
        en: "Nasihat orang tua lebih mudah diterima kalau disampaikan dengan tenang.",
        vi: "Lời khuyên của cha mẹ dễ được tiếp nhận hơn nếu được nói một cách bình tĩnh.",
        pronunciation_focus: [
          "na-SI-hat o-RANG TU-a - `nasihat orang tua` = lời khuyên của cha mẹ.",
          "`diterima` = được nhận/tiếp nhận; `disampaikan` = được truyền đạt/nói ra.",
          "`dengan tenang` = một cách bình tĩnh; hữu ích khi nói về xung đột gia đình.",
          "Luyện: `Sampaikan nasihat dengan tenang.`",
        ],
        pronunciation_focus_en: [
          "na-SEE-hat o-RANG TOO-a - `nasihat orang tua` = parental advice.",
          "`diterima` = is accepted/received; `disampaikan` = is conveyed/said.",
          "`dengan tenang` = calmly; useful for family conflict talk.",
          "Drill: `Sampaikan nasihat dengan tenang.`",
        ],
      },
      {
        en: "Remaja perlu dipercaya, tetapi tetap perlu batasan.",
        vi: "Thiếu niên cần được tin tưởng, nhưng vẫn cần giới hạn.",
        pronunciation_focus: [
          "re-MA-ja PER-lu di-per-CA-ya - `dipercaya` = được tin tưởng.",
          "`tetap perlu batasan` = vẫn cần giới hạn; `batasan` = ranh giới/quy định giới hạn.",
          "Mẹo: `tetapi` trang trọng hơn `tapi`; cả hai đều nghĩa là 'nhưng'.",
          "Luyện: `Remaja tetap perlu batasan.`",
        ],
        pronunciation_focus_en: [
          "re-MA-ja PER-loo dee-per-CHA-ya - `dipercaya` = be trusted.",
          "`tetap perlu batasan` = still needs boundaries; `batasan` = limits/boundaries.",
          "Tip: `tetapi` is more formal than `tapi`; both mean 'but'.",
          "Drill: `Remaja tetap perlu batasan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong nhiều gia đình Indonesia, nuôi dạy remaja thường kết hợp sự gần gũi gia đình với aturan rumah rõ ràng: giờ về nhà, gawai, uang jajan, học hành, và pergaulan. Cha mẹ hay nhấn mạnh `sopan santun`, trách nhiệm ở trường, và việc giữ nama baik keluarga. Đồng thời, nhiều phụ huynh hiện đại cố gắng nói chuyện nhẹ nhàng hơn: `diajak bicara baik-baik` (được nói chuyện tử tế), thay vì chỉ mắng. Với người Việt, bối cảnh này khá quen vì văn hóa gia đình coi trọng học hành, lễ phép và lời khuyên của cha mẹ.",
    cultural_notes_en:
      "In many Indonesian families, parenting teenagers combines family closeness with clear house rules: curfew, devices, allowance, school, and social circles. Parents often emphasize `sopan santun`, school responsibility, and maintaining the family's good name. At the same time, many modern parents try to speak more gently: `diajak bicara baik-baik` (talked to respectfully), rather than only scolding. Vietnamese learners will find this familiar because both cultures value schooling, manners, and parental advice.",
    tip_advice_vi:
      "Mẹo cho người Việt: học các cụm cố định để nói chuyện gia đình không quá nặng: `aturan rumah`, `uang jajan`, `waktu memakai gawai`, `pergaulan anak`, `diajak bicara baik-baik`, `nasihat orang tua`, `batasan`. Khi muốn nói 'con tôi', luôn là `anak saya`, không phải `saya anak`. Khi muốn nói lời khuyên mềm, dùng `sebaiknya` hoặc `lebih baik`, không chỉ `harus`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn fixed family-talk chunks that sound firm but not harsh: `aturan rumah`, `uang jajan`, `waktu memakai gawai`, `pergaulan anak`, `diajak bicara baik-baik`, `nasihat orang tua`, `batasan`. 'My child' is always `anak saya`, not `saya anak`. For softer advice, use `sebaiknya` or `lebih baik`, not only `harus`.",
    vocabulary: [
      {
        word: "remaja",
        en: "teenager / adolescent",
        vi: "thiếu niên / tuổi teen",
        pos: "noun",
        pronunciation_vi: "re-MA-ja",
        pronunciation_en: "re-MA-ja",
      },
      {
        word: "aturan rumah",
        en: "house rules",
        vi: "quy tắc gia đình",
        pos: "noun phrase",
        pronunciation_vi: "a-TUR-an RU-mah",
        pronunciation_en: "a-TOOR-an ROO-mah",
      },
      {
        word: "pergaulan",
        en: "social circle / peer environment",
        vi: "mối quan hệ bạn bè / môi trường giao du",
        pos: "noun",
        pronunciation_vi: "per-GAU-lan",
        pronunciation_en: "per-GAU-lan",
      },
      {
        word: "uang jajan",
        en: "allowance / pocket money",
        vi: "tiền tiêu vặt",
        pos: "noun phrase",
        pronunciation_vi: "U-ang JA-jan",
        pronunciation_en: "OO-ang JA-jan",
      },
      {
        word: "gawai",
        en: "device / gadget",
        vi: "thiết bị điện tử",
        pos: "noun",
        pronunciation_vi: "GA-wai",
        pronunciation_en: "GA-wai",
      },
      {
        word: "berkomunikasi",
        en: "to communicate",
        vi: "giao tiếp",
        pos: "verb",
        pronunciation_vi: "ber-ko-mu-ni-KA-si",
        pronunciation_en: "ber-ko-moo-nee-KA-see",
      },
      {
        word: "nasihat orang tua",
        en: "parental advice",
        vi: "lời khuyên của cha mẹ",
        pos: "noun phrase",
        pronunciation_vi: "na-SI-hat o-RANG TU-a",
        pronunciation_en: "na-SEE-hat o-RANG TOO-a",
      },
      {
        word: "batasan",
        en: "boundary / limit",
        vi: "giới hạn / ranh giới",
        pos: "noun",
        pronunciation_vi: "ba-TAS-an",
        pronunciation_en: "ba-TAS-an",
      },
      {
        word: "diajak bicara baik-baik",
        en: "talked to respectfully/gently",
        vi: "được nói chuyện tử tế/nhẹ nhàng",
        pos: "phrase",
        pronunciation_vi: "di-A-jak bi-CHA-ra BAIK-BAIK",
        pronunciation_en: "dee-A-jak bee-CHA-ra BAIK-BAIK",
      },
      {
        word: "sekolah",
        en: "school",
        vi: "trường học",
        pos: "noun",
        pronunciation_vi: "se-KO-lah",
        pronunciation_en: "se-KO-lah",
      },
    ],
    dialogue: [
      {
        speaker: "Ibu",
        text: "Kamu boleh main dengan teman, tapi pulang sebelum jam sembilan.",
        vi: "Con được đi chơi với bạn, nhưng về trước chín giờ.",
        en: "You may hang out with friends, but come home before nine.",
      },
      {
        speaker: "Anak",
        text: "Boleh sampai jam sepuluh? Teman-teman masih di sana.",
        vi: "Đến mười giờ được không ạ? Các bạn vẫn còn ở đó.",
        en: "Can it be until ten? My friends are still there.",
      },
      {
        speaker: "Ibu",
        text: "Hari sekolah tetap jam sembilan. Akhir pekan bisa kita bicarakan.",
        vi: "Ngày đi học vẫn là chín giờ. Cuối tuần thì mình có thể bàn lại.",
        en: "On school days it is still nine. We can discuss weekends.",
      },
      {
        speaker: "Anak",
        text: "Baik, Bu. Nanti saya kabari kalau sudah berangkat pulang.",
        vi: "Vâng mẹ. Lát nữa con sẽ báo khi bắt đầu về.",
        en: "Okay, Mom. I will let you know when I head home.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ/cụm từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word or phrase with its Vietnamese meaning:",
        items: [
          { prompt: "remaja", answer: "thiếu niên" },
          { prompt: "uang jajan", answer: "tiền tiêu vặt" },
          { prompt: "gawai", answer: "thiết bị điện tử" },
          { prompt: "batasan", answer: "giới hạn" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu:",
        instruction_en: "Fill in the missing word:",
        items: [
          {
            prompt: "Kami perlu ___ rumah yang jelas. (quy tắc)",
            answer: "aturan",
            options: ["aturan", "acara", "alamat"],
          },
          {
            prompt: "Uang ___ diberikan setiap minggu. (tiêu vặt)",
            answer: "jajan",
            options: ["jajan", "jalan", "janji"],
          },
          {
            prompt: "Kami mencoba ___ tanpa langsung marah. (giao tiếp)",
            answer: "berkomunikasi",
            options: ["berkomunikasi", "berbelanja", "berangkat"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Con tôi đã là thiếu niên.", answer: "Anak saya sudah remaja." },
          { prompt: "Chúng tôi giới hạn thời gian dùng thiết bị.", answer: "Kami membatasi waktu memakai gawai." },
          { prompt: "Lời khuyên của cha mẹ nên được nói bình tĩnh.", answer: "Nasihat orang tua sebaiknya disampaikan dengan tenang." },
        ],
      },
    ],
  },
];

export default parentingTeenagersLessons;
