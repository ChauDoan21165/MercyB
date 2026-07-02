// Eye emergency clinic Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson. It follows the existing Indonesian `extra`
// format: Indonesian target sentences in `en`, Vietnamese glosses in `vi`,
// Vietnamese L1 notes in `pronunciation_focus`, and English companion notes in
// `pronunciation_focus_en`.

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

export type IndonesianExercise = Record<string, unknown>;

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
    id: "indonesian_clinic_eye_emergency",
    level: "B1",
    category: "health",
    title_vi: "Cấp cứu mắt và đi khám mắt",
    title_en: "Eye emergencies and eye clinic visits",
    sentences: [
      {
        en: "Mata saya merah dan terasa sakit sejak pagi.",
        vi: "Mắt tôi đỏ và đau từ sáng nay.",
        pronunciation_focus: [
          "MA-ta SA-ya ME-rah dan te-RA-sa SA-kit se-JAK PA-gi - `mata merah` = mắt đỏ; `terasa sakit` = cảm thấy đau.",
          "Lỗi người Việt: chỉ nói `sakit mata` khi muốn mô tả đỏ và đau. Câu đầy đủ `mata saya merah dan terasa sakit` rõ hơn.",
          "Luyện: `Mata saya merah.`",
        ],
        pronunciation_focus_en: [
          "MAH-tah SAH-yah MEH-rah dan teh-RAH-sah SAH-kit seh-JAK PAH-gee - `mata merah` = red eye; `terasa sakit` = feels painful.",
          "VN-speaker trap: only saying `sakit mata` when you need to describe redness and pain. The full sentence `mata saya merah dan terasa sakit` is clearer.",
          "Drill: `Mata saya merah.`",
        ],
      },
      {
        en: "Sepertinya ada kelilipan di mata saya.",
        vi: "Có vẻ như có bụi bay vào mắt tôi.",
        pronunciation_focus: [
          "se-per-TI-nya A-da ke-li-LI-pan di MA-ta SA-ya - `kelilipan` = bị bụi/cát bay vào mắt.",
          "Lỗi người Việt: dịch từng chữ `bị nhỏ vào mắt`. Cụm tự nhiên là `ada kelilipan`.",
          "Luyện: `Ada kelilipan.`",
        ],
        pronunciation_focus_en: [
          "seh-per-TIH-nyah AH-dah keh-lee-LEE-pahn dee MAH-tah SAH-yah - `kelilipan` = having dust/sand in the eye.",
          "VN-speaker trap: translating it word by word as `small thing entered the eye`. The natural phrase is `ada kelilipan`.",
          "Drill: `Ada kelilipan.`",
        ],
      },
      {
        en: "Penglihatan saya tiba-tiba kabur.",
        vi: "Thị lực của tôi đột nhiên bị mờ.",
        pronunciation_focus: [
          "pe-nga-li-HA-tan SA-ya ti-BA-ti-ba ka-BUR - `penglihatan` = thị lực/khả năng nhìn; `kabur` = mờ.",
          "Lỗi người Việt: nói `lihat kabur` là thiếu tự nhiên. Ở phòng khám, dùng `penglihatan kabur`.",
          "Luyện: `Penglihatan saya kabur.`",
        ],
        pronunciation_focus_en: [
          "peh-nglee-HAH-tan SAH-yah tee-BAH-tee-bah kah-BOOR - `penglihatan` = vision; `kabur` = blurry.",
          "VN-speaker trap: saying `lihat kabur` is unnatural. At the clinic, use `penglihatan kabur`.",
          "Drill: `Penglihatan saya kabur.`",
        ],
      },
      {
        en: "Saya mau periksa ke dokter mata.",
        vi: "Tôi muốn khám với bác sĩ mắt.",
        pronunciation_focus: [
          "SA-ya mau pe-RIK-sa ke DOK-ter MA-ta - `dokter mata` = bác sĩ mắt / bác sĩ nhãn khoa.",
          "`ke` dùng khi nói đi đến bác sĩ/chuyên khoa. Đừng nói `di dokter mata`.",
          "Lỗi người Việt: dùng `periksa mata` mà quên người khám là `dokter mata`.",
        ],
        pronunciation_focus_en: [
          "SAH-yah mow peh-RIK-sah keh DOK-ter MAH-tah - `dokter mata` = eye doctor / ophthalmologist.",
          "Use `ke` when saying you go to a doctor/specialist. Do not say `di dokter mata`.",
          "VN-speaker trap: saying `periksa mata` and forgetting the specialist is `dokter mata`.",
        ],
      },
      {
        en: "Apakah saya perlu obat tetes mata?",
        vi: "Tôi có cần thuốc nhỏ mắt không?",
        pronunciation_focus: [
          "a-PA-kah SA-ya PER-lu O-bat TE-tes MA-ta - `obat tetes mata` = thuốc nhỏ mắt.",
          "Lỗi người Việt: chỉ nói `obat mata`. Với toa y tế, `obat tetes mata` rõ hơn.",
          "Luyện: `Perlu obat tetes mata?`",
        ],
        pronunciation_focus_en: [
          "ah-PAH-kah SAH-yah PEHR-loo OH-bat TEH-tes MAH-tah - `obat tetes mata` = eye drops.",
          "VN-speaker trap: only saying `obat mata`. On a prescription, `obat tetes mata` is clearer.",
          "Drill: `Perlu obat tetes mata?`",
        ],
      },
      {
        en: "Obat tetes ini dipakai berapa kali sehari?",
        vi: "Thuốc nhỏ mắt này dùng mấy lần một ngày?",
        pronunciation_focus: [
          "O-bat TE-tes I-ni di-PA-kai be-RA-pa KA-li se-HA-ri - `dipakai` = được dùng; `berapa kali sehari` = mấy lần một ngày.",
          "Lỗi người Việt: hỏi `minum obat tetes` là sai. Thuốc nhỏ mắt thì `dipakai` atau `diteteskan`.",
          "Luyện: `Berapa kali sehari?`",
        ],
        pronunciation_focus_en: [
          "OH-bat TEH-tes EE-nee dee-PAH-kai beh-RAH-pah KAH-lee seh-HAH-ree - `dipakai` = used/applied; `berapa kali sehari` = how many times per day.",
          "VN-speaker trap: asking `minum obat tetes` is wrong. Eye drops are `dipakai` or `diteteskan`.",
          "Drill: `Berapa kali sehari?`",
        ],
      },
      {
        en: "Saya perlu rujukan kalau harus ke rumah sakit.",
        vi: "Tôi cần giấy chuyển tuyến nếu phải đến bệnh viện.",
        pronunciation_focus: [
          "SA-ya PER-lu ru-JU-kan KA-lau HA-rus ke RU-mah SA-kit - `rujukan` = giấy chuyển tuyến.",
          "Lỗi người Việt: nói `surat pindah`. Trong y tế, từ đúng là `rujukan`.",
          "Luyện: `Perlu rujukan.`",
        ],
        pronunciation_focus_en: [
          "SAH-yah PEHR-loo roo-JOO-kahn KAH-low HA-roos keh ROO-mah SAH-kit - `rujukan` = referral.",
          "VN-speaker trap: saying `surat pindah`. In healthcare, the correct term is `rujukan`.",
          "Drill: `Perlu rujukan.`",
        ],
      },
      {
        en: "Kalau sakitnya makin parah, ini darurat.",
        vi: "Nếu cơn đau nặng hơn, đây là tình trạng khẩn cấp.",
        pronunciation_focus: [
          "KA-lau SA-kit-nya MA-kin PA-rah, I-ni da-RU-rat - `makin parah` = ngày càng nặng; `darurat` = khẩn cấp.",
          "Lỗi người Việt: dùng `urgent` trong câu Indonesia. Từ tự nhiên là `darurat`.",
          "Luyện: `Ini darurat.`",
        ],
        pronunciation_focus_en: [
          "KAH-low SAH-kit-nyah MAH-kin PAH-rah, EE-nee dah-ROO-rat - `makin parah` = getting worse; `darurat` = emergency.",
          "VN-speaker trap: using `urgent` inside Indonesian. The natural word is `darurat`.",
          "Drill: `Ini darurat.`",
        ],
      },
      {
        en: "Saya tidak bisa melihat jelas dengan mata ini.",
        vi: "Tôi không thể nhìn rõ bằng mắt này.",
        pronunciation_focus: [
          "SA-ya ti-DAK BI-sa me-li-HAT JE-las de-NGAN MA-ta I-ni - `melihat jelas` = nhìn rõ.",
          "Lỗi người Việt: nói `lihat terang`. `Terang` là sáng; `jelas` là rõ.",
          "Luyện: `Tidak bisa melihat jelas.`",
        ],
        pronunciation_focus_en: [
          "SAH-yah tee-DAK BEE-sah meh-lee-HAHT JEH-las deh-NGAN MAH-tah EE-nee - `melihat jelas` = see clearly.",
          "VN-speaker trap: saying `lihat terang`. `Terang` = bright/light; `jelas` = clear.",
          "Drill: `Tidak bisa melihat jelas.`",
        ],
      },
      {
        en: "Tolong periksa apakah saya perlu dirujuk segera.",
        vi: "Làm ơn kiểm tra xem tôi có cần được chuyển tuyến ngay không.",
        pronunciation_focus: [
          "TO-long pe-RIK-sa a-pa-KAH SA-ya PER-lu di-ru-JUK se-GE-ra - `dirujuk` = được chuyển tuyến; `segera` = ngay/lập tức.",
          "Lỗi người Việt: bỏ bị động `di-` và nói `perlu rujuk`. Trong bệnh viện, `dirujuk` rất tự nhiên.",
          "Luyện: `Perlu dirujuk segera.`",
        ],
        pronunciation_focus_en: [
          "TOH-long peh-RIK-sah ah-pah-KAH SAH-yah PEHR-loo dee-roo-JOOK seh-GEH-rah - `dirujuk` = be referred; `segera` = immediately.",
          "VN-speaker trap: dropping passive `di-` and saying `perlu rujuk`. In hospitals, `dirujuk` is natural.",
          "Drill: `Perlu dirujuk segera.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, đau mắt hoặc mắt đỏ nhẹ có thể được khám ở klinik, puskesmas, atau dokter umum. Nhưng nếu có penglihatan kabur, sakit berat, mata terluka, ada bahan kimia masuk, atau kecurigaan infeksi serius, người bệnh thường được đánh giá nhanh hơn và có thể cần rujukan ke dokter mata atau rumah sakit. Khi đi khám, hãy nói rõ từ khi nào bắt đầu, một hay hai mắt, có kelilipan, đau, keluar cairan, hoặc sensitif terhadap cahaya hay không.",
    cultural_notes_en:
      "In Indonesia, mild red-eye symptoms may be examined at a clinic, puskesmas, or by a general doctor. But if there is blurry vision, severe pain, eye injury, chemical exposure, or concern for serious infection, the patient is usually assessed faster and may need a referral to an eye doctor or hospital. When visiting, clearly state when it started, whether one or both eyes are affected, and whether there is dust in the eye, pain, discharge, or light sensitivity.",
    tip_advice_vi:
      "Mẫu an toàn: `Mata saya merah dan terasa sakit. Sepertinya ada kelilipan. Penglihatan saya kabur. Apakah saya perlu ke dokter mata atau rujukan segera?` Nếu triệu chứng nặng nhanh, đừng chờ quá lâu.",
    tip_advice_en:
      "Safe template: `Mata saya merah dan terasa sakit. Sepertinya ada kelilipan. Penglihatan saya kabur. Apakah saya perlu ke dokter mata atau rujukan segera?` If symptoms worsen quickly, do not wait too long.",
    vocabulary: [
      {
        word: "mata merah",
        en: "red eye",
        vi: "mắt đỏ",
        pos: "noun phrase",
        pronunciation_vi: "MA-ta ME-rah",
        pronunciation_en: "MAH-tah MEH-rah",
      },
      {
        word: "kelilipan",
        en: "having dust/sand in the eye",
        vi: "bụi/cát bay vào mắt",
        pos: "noun/condition",
        pronunciation_vi: "ke-li-LI-pan",
        pronunciation_en: "keh-lee-LEE-pahn",
      },
      {
        word: "dokter mata",
        en: "eye doctor",
        vi: "bác sĩ mắt / bác sĩ nhãn khoa",
        pos: "noun phrase",
        pronunciation_vi: "DOK-ter MA-ta",
        pronunciation_en: "DOK-ter MAH-tah",
      },
      {
        word: "obat tetes mata",
        en: "eye drops",
        vi: "thuốc nhỏ mắt",
        pos: "noun phrase",
        pronunciation_vi: "O-bat TE-tes MA-ta",
        pronunciation_en: "OH-bat TEH-tes MAH-tah",
      },
      {
        word: "penglihatan kabur",
        en: "blurry vision",
        vi: "thị lực bị mờ",
        pos: "noun phrase",
        pronunciation_vi: "pe-nga-li-HA-tan ka-BUR",
        pronunciation_en: "peh-nglee-HAH-tan kah-BOOR",
      },
      {
        word: "rujukan",
        en: "referral",
        vi: "giấy chuyển tuyến",
        pos: "noun",
        pronunciation_vi: "ru-JU-kan",
        pronunciation_en: "roo-JOO-kahn",
      },
      {
        word: "darurat",
        en: "emergency",
        vi: "tình trạng khẩn cấp",
        pos: "adjective/noun",
        pronunciation_vi: "da-RU-rat",
        pronunciation_en: "dah-ROO-rat",
      },
      {
        word: "mata terasa sakit",
        en: "the eye feels painful",
        vi: "mắt đau",
        pos: "phrase",
        pronunciation_vi: "MA-ta te-RA-sa SA-kit",
        pronunciation_en: "MAH-tah teh-RAH-sah SAH-kit",
      },
    ],
    dialogue: [
      {
        speaker: "Pasien",
        text: "Selamat pagi. Mata saya merah dan terasa sakit sejak pagi.",
        vi: "Chào buổi sáng. Mắt tôi đỏ và đau từ sáng nay.",
        en: "Good morning. My eye has been red and painful since this morning.",
      },
      {
        speaker: "Petugas",
        text: "Apakah ada kelilipan atau penglihatan kabur?",
        vi: "Có bụi bay vào mắt hoặc nhìn bị mờ không?",
        en: "Is there anything in the eye, or is your vision blurry?",
      },
      {
        speaker: "Pasien",
        text: "Iya, penglihatan saya kabur. Saya mau periksa ke dokter mata.",
        vi: "Vâng, thị lực của tôi bị mờ. Tôi muốn khám với bác sĩ mắt.",
        en: "Yes, my vision is blurry. I want to be examined by an eye doctor.",
      },
      {
        speaker: "Petugas",
        text: "Baik. Kalau perlu, kami bisa buat rujukan segera.",
        vi: "Được. Nếu cần, chúng tôi có thể làm giấy chuyển tuyến ngay.",
        en: "All right. If needed, we can prepare a referral right away.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Mắt tôi đỏ và đau từ sáng nay.",
        prompt_en: "Translate into Indonesian: My eye has been red and painful since this morning.",
        answer: "Mata saya merah dan terasa sakit sejak pagi.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ còn thiếu: Sepertinya ada ____ di mata saya.",
        prompt_en: "Fill in the blank: Sepertinya ada ____ di mata saya.",
        answer: "kelilipan",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Cụm nào nghĩa là “thuốc nhỏ mắt”?",
        prompt_en: "Which phrase means “eye drops”?",
        choices: ["obat tetes mata", "dokter mata", "penglihatan kabur"],
        answer: "obat tetes mata",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `darurat` = ?",
        prompt_en: "Match the meaning: `darurat` = ?",
        answer: "emergency",
      },
    ],
  },
];

export default lessons;
