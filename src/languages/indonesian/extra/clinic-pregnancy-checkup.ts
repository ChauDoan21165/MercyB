// Clinic Pregnancy Checkup Indonesian (Vietnamese -> Indonesian study track).
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
    id: "indonesian_clinic_pregnancy_checkup",
    level: "A2",
    category: "health",
    title_vi: "Khám thai ở phòng khám và Puskesmas",
    title_en: "Pregnancy checkups at a clinic or Puskesmas",
    sentences: [
      {
        en: "Saya sedang hamil tiga bulan.",
        vi: "Tôi đang mang thai ba tháng.",
        pronunciation_focus: [
          "SA-ya SE-dang HA-mil TI-ga BU-lan - `sedang` = đang; `hamil` = mang thai; số đứng trước đơn vị.",
          "Lỗi người Việt: thêm động từ `punya` như `saya punya hamil`. Đúng là `saya hamil` hoặc `sedang hamil`.",
          "Luyện: `Saya sedang hamil tiga bulan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SE-dang HA-mil TEE-ga BU-lan - `sedang` = currently; `hamil` = pregnant; number comes before the unit.",
          "VN-speaker trap: adding `punya` as in `saya punya hamil`. Correct: `saya hamil` or `sedang hamil`.",
          "Drill: `Saya sedang hamil tiga bulan.`",
        ],
      },
      {
        en: "Saya mau periksa kandungan hari ini.",
        vi: "Hôm nay tôi muốn khám thai.",
        pronunciation_focus: [
          "SA-ya MAU pe-RIK-sa kan-DUNG-an HA-ri I-ni - `periksa kandungan` = khám thai; `kandungan` = thai/bào thai/tử cung theo ngữ cảnh.",
          "Lỗi người Việt: nói `periksa hamil` nghe không tự nhiên. Cụm ở phòng khám là `periksa kandungan` hoặc `periksa kehamilan`.",
          "Luyện: `Saya mau periksa kandungan hari ini.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU pe-RIK-sa kan-DOONG-an HA-ri I-ni - `periksa kandungan` = pregnancy checkup; `kandungan` = pregnancy/womb depending on context.",
          "VN-speaker trap: saying `periksa hamil`, which sounds unnatural. At clinics use `periksa kandungan` or `periksa kehamilan`.",
          "Drill: `Saya mau periksa kandungan hari ini.`",
        ],
      },
      {
        en: "Apakah ada bidan yang praktik pagi ini?",
        vi: "Sáng nay có nữ hộ sinh khám không?",
        pronunciation_focus: [
          "a-pa-KAH A-da BI-dan yang PRAK-tik PA-gi I-ni - `bidan` = nữ hộ sinh; `praktik` = có lịch khám/hành nghề.",
          "Lỗi người Việt: dùng `kerja` cho lịch khám. Với bác sĩ/bidan, hỏi `praktik` tự nhiên hơn.",
          "Luyện: `Apakah ada bidan yang praktik pagi ini?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH A-da BEE-dan yang PRAK-tik PA-gi I-ni - `bidan` = midwife; `praktik` = be seeing patients/practicing.",
          "VN-speaker trap: using `kerja` for clinic hours. For doctors/midwives, `praktik` is more natural.",
          "Drill: `Apakah ada bidan yang praktik pagi ini?`",
        ],
      },
      {
        en: "Saya ingin jadwal USG untuk minggu depan.",
        vi: "Tôi muốn đặt lịch siêu âm cho tuần sau.",
        pronunciation_focus: [
          "SA-ya I-ngin JAD-wal u-es-ge un-TUK MING-gu de-PAN - `USG` = siêu âm; `jadwal` = lịch.",
          "Lỗi người Việt: đọc USG như tiếng Anh. Ở Indonesia thường đánh vần `u-es-ge`.",
          "Luyện: `Saya ingin jadwal USG untuk minggu depan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya I-ngin JAD-wal oo-es-geh un-TUK MING-goo de-PAN - `USG` = ultrasound; `jadwal` = schedule.",
          "VN-speaker trap: reading USG English-style. In Indonesian it is usually spelled `u-es-ge`.",
          "Drill: `Saya ingin jadwal USG untuk minggu depan.`",
        ],
      },
      {
        en: "Bidan memberi saya vitamin dan tablet tambah darah.",
        vi: "Nữ hộ sinh cho tôi vitamin và viên sắt bổ máu.",
        pronunciation_focus: [
          "BI-dan mem-BE-ri SA-ya VI-ta-min dan TAB-let TAM-bah DA-rah - `tablet tambah darah` = viên sắt/bổ máu.",
          "Lỗi người Việt: dịch là `obat darah`. Trong thai kỳ, cụm quen thuộc là `tablet tambah darah`.",
          "Luyện: `Bidan memberi saya vitamin dan tablet tambah darah.`",
        ],
        pronunciation_focus_en: [
          "BEE-dan mem-BE-ri SA-ya VEE-ta-min dan TAB-let TAM-bah DA-rah - `tablet tambah darah` = iron/blood-boosting tablet.",
          "VN-speaker trap: translating it as `obat darah`. In pregnancy care, the common phrase is `tablet tambah darah`.",
          "Drill: `Bidan memberi saya vitamin dan tablet tambah darah.`",
        ],
      },
      {
        en: "Saya sering mual, terutama pagi hari.",
        vi: "Tôi thường buồn nôn, nhất là buổi sáng.",
        pronunciation_focus: [
          "SA-ya SE-ring MU-al, ter-u-TA-ma PA-gi HA-ri - `mual` = buồn nôn; `terutama` = nhất là/đặc biệt.",
          "Lỗi người Việt: lẫn `mual` với `muntah`. `Mual` là cảm giác buồn nôn; `muntah` là nôn ra.",
          "Luyện: `Saya sering mual, terutama pagi hari.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SE-ring MOO-al, ter-oo-TA-ma PA-gi HA-ri - `mual` = nauseous; `terutama` = especially.",
          "VN-speaker trap: confusing `mual` with `muntah`. `Mual` is nausea; `muntah` is vomiting.",
          "Drill: `Saya sering mual, terutama pagi hari.`",
        ],
      },
      {
        en: "Kapan jadwal kontrol berikutnya?",
        vi: "Lịch tái khám tiếp theo là khi nào?",
        pronunciation_focus: [
          "KA-pan JAD-wal KON-trol be-ri-KUT-nya - `jadwal kontrol` = lịch tái khám/kiểm tra định kỳ; `berikutnya` = tiếp theo.",
          "Lỗi người Việt: dịch `kiểm tra lại` thành câu dài. Cụm y tế tự nhiên là `kontrol`.",
          "Luyện: `Kapan jadwal kontrol berikutnya?`",
        ],
        pronunciation_focus_en: [
          "KA-pan JAD-wal KON-trol be-ri-KUT-nya - `jadwal kontrol` = follow-up/checkup schedule; `berikutnya` = next.",
          "VN-speaker trap: translating 'check again' into a long phrase. The natural medical term is `kontrol`.",
          "Drill: `Kapan jadwal kontrol berikutnya?`",
        ],
      },
      {
        en: "Saya membawa buku KIA dari rumah.",
        vi: "Tôi mang sổ KIA từ nhà.",
        pronunciation_focus: [
          "SA-ya mem-BA-wa BU-ku ki-a da-ri RU-mah - `buku KIA` = sổ sức khỏe mẹ và trẻ em; đọc KIA từng chữ `ki-a`.",
          "Lỗi người Việt: tưởng `KIA` là hãng xe. Trong y tế mẹ bé, `buku KIA` là sổ theo dõi.",
          "Luyện: `Saya membawa buku KIA dari rumah.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mem-BA-wa BOO-ku kee-ah da-ri RU-mah - `buku KIA` = mother-and-child health book; KIA is read `ki-a`.",
          "VN-speaker trap: thinking `KIA` is the car brand. In maternal-child health, `buku KIA` is the health record book.",
          "Drill: `Saya membawa buku KIA dari rumah.`",
        ],
      },
      {
        en: "Tolong catat tekanan darah saya di buku KIA.",
        vi: "Làm ơn ghi huyết áp của tôi vào sổ KIA.",
        pronunciation_focus: [
          "TO-long CA-tat te-KA-nan DA-rah SA-ya di BU-ku ki-a - `catat` = ghi lại; `tekanan darah` = huyết áp.",
          "Lỗi người Việt: đọc `catat` như ka-tat. Chữ `c` = 'ch': CHA-tat.",
          "Luyện: `Tolong catat tekanan darah saya di buku KIA.`",
        ],
        pronunciation_focus_en: [
          "TO-long CHA-tat te-KA-nan DA-rah SA-ya di BOO-ku kee-ah - `catat` = write down/record; `tekanan darah` = blood pressure.",
          "VN-speaker trap: reading `catat` as ka-tat. Indonesian `c` = 'ch': CHA-tat.",
          "Drill: `Tolong catat tekanan darah saya di buku KIA.`",
        ],
      },
      {
        en: "Kalau ada nyeri perut atau perdarahan, segera ke IGD.",
        vi: "Nếu đau bụng hoặc chảy máu, hãy đến cấp cứu ngay.",
        pronunciation_focus: [
          "KA-lau A-da NYE-ri pe-RUT A-tau per-da-RA-han, se-GE-ra ke i-ge-DE - `nyeri perut` = đau bụng; `perdarahan` = chảy máu; `IGD` = cấp cứu.",
          "Lỗi người Việt: dùng `sakit perut` cho mọi mức độ. Trong cảnh báo y tế, `nyeri perut` nghe cụ thể và nghiêm túc hơn.",
          "Luyện: `Kalau ada nyeri perut atau perdarahan, segera ke IGD.`",
        ],
        pronunciation_focus_en: [
          "KA-lau A-da NYEH-ri pe-RUT A-tau per-da-RA-han, se-GEH-ra ke ee-geh-DE - `nyeri perut` = abdominal pain; `perdarahan` = bleeding; `IGD` = emergency department.",
          "VN-speaker trap: using `sakit perut` for every level. In medical warnings, `nyeri perut` sounds more specific and serious.",
          "Drill: `Kalau ada nyeri perut atau perdarahan, segera ke IGD.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, khám thai cơ bản thường diễn ra tại `Puskesmas`, klinik, hoặc với `bidan`. `Buku KIA` là sổ sức khỏe mẹ và trẻ em dùng để ghi tuổi thai, cân nặng, huyết áp, lịch kontrol, tiêm chủng và ghi chú quan trọng. `USG` là siêu âm, có thể làm tại phòng khám hoặc bệnh viện tùy nơi. Phụ nữ mang thai thường được khuyên uống vitamin và `tablet tambah darah`. Nếu có đau bụng dữ dội, chảy máu, sốt cao, đau đầu nặng, khó thở, hoặc thai ít cử động, nên đi cấp cứu/IGD ngay.",
    cultural_notes_en:
      "In Indonesia, basic pregnancy checkups often happen at a `Puskesmas`, clinic, or with a `bidan` (midwife). The `buku KIA` is the mother-and-child health book used to record gestational age, weight, blood pressure, follow-up schedules, immunization, and important notes. `USG` is ultrasound and may be done at a clinic or hospital depending on the facility. Pregnant women are often advised to take vitamins and `tablet tambah darah`. Severe abdominal pain, bleeding, high fever, severe headache, breathing trouble, or reduced fetal movement should be treated as urgent and taken to the ER/IGD.",
    tip_advice_vi:
      "Mẹo cho người Việt: học theo cụm phòng khám: `sedang hamil`, `periksa kandungan`, `bidan praktik`, `jadwal USG`, `minum vitamin`, `sering mual`, `jadwal kontrol`, `buku KIA`. Với câu hỏi lịch, dùng `Kapan jadwal ... berikutnya?`. Với triệu chứng, dùng mẫu `Saya sering ...` hoặc `Kalau ada ..., segera ke IGD`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn clinic chunks: `sedang hamil`, `periksa kandungan`, `bidan praktik`, `jadwal USG`, `minum vitamin`, `sering mual`, `jadwal kontrol`, `buku KIA`. For schedule questions, use `Kapan jadwal ... berikutnya?`. For symptoms, use `Saya sering ...` or `Kalau ada ..., segera ke IGD`.",
    vocabulary: [
      {
        word: "hamil",
        en: "pregnant",
        vi: "mang thai / có bầu",
        pos: "adjective",
        pronunciation_vi: "HA-mil",
        pronunciation_en: "HA-mil",
      },
      {
        word: "periksa kandungan",
        en: "pregnancy checkup",
        vi: "khám thai",
        pos: "verb phrase",
        pronunciation_vi: "pe-RIK-sa kan-DUNG-an",
        pronunciation_en: "pe-RIK-sa kan-DOONG-an",
      },
      {
        word: "bidan",
        en: "midwife",
        vi: "nữ hộ sinh",
        pos: "noun",
        pronunciation_vi: "BI-dan",
        pronunciation_en: "BEE-dan",
      },
      {
        word: "USG",
        en: "ultrasound",
        vi: "siêu âm",
        pos: "noun",
        pronunciation_vi: "u-es-ge",
        pronunciation_en: "oo-es-geh",
      },
      {
        word: "vitamin",
        en: "vitamin",
        vi: "vitamin",
        pos: "noun",
        pronunciation_vi: "VI-ta-min",
        pronunciation_en: "VEE-ta-min",
      },
      {
        word: "mual",
        en: "nauseous",
        vi: "buồn nôn",
        pos: "adjective",
        pronunciation_vi: "MU-al",
        pronunciation_en: "MOO-al",
      },
      {
        word: "jadwal kontrol",
        en: "follow-up schedule",
        vi: "lịch tái khám",
        pos: "noun phrase",
        pronunciation_vi: "JAD-wal KON-trol",
        pronunciation_en: "JAD-wal KON-trol",
      },
      {
        word: "buku KIA",
        en: "mother-and-child health book",
        vi: "sổ sức khỏe mẹ và bé",
        pos: "noun phrase",
        pronunciation_vi: "BU-ku ki-a",
        pronunciation_en: "BOO-ku kee-ah",
      },
      {
        word: "tablet tambah darah",
        en: "iron tablet",
        vi: "viên sắt / viên bổ máu",
        pos: "noun phrase",
        pronunciation_vi: "TAB-let TAM-bah DA-rah",
        pronunciation_en: "TAB-let TAM-bah DA-rah",
      },
      {
        word: "tekanan darah",
        en: "blood pressure",
        vi: "huyết áp",
        pos: "noun phrase",
        pronunciation_vi: "te-KA-nan DA-rah",
        pronunciation_en: "te-KA-nan DA-rah",
      },
    ],
    dialogue: [
      {
        speaker: "Pasien",
        text: "Selamat pagi, Bu. Saya mau periksa kandungan.",
        vi: "Chào buổi sáng cô/chị. Tôi muốn khám thai.",
        en: "Good morning, ma'am. I want a pregnancy checkup.",
      },
      {
        speaker: "Bidan",
        text: "Baik. Usia kehamilannya berapa minggu?",
        vi: "Được. Tuổi thai là bao nhiêu tuần?",
        en: "Okay. How many weeks is the pregnancy?",
      },
      {
        speaker: "Pasien",
        text: "Sekitar dua belas minggu. Saya juga sering mual.",
        vi: "Khoảng mười hai tuần. Tôi cũng thường buồn nôn.",
        en: "About twelve weeks. I also often feel nauseous.",
      },
      {
        speaker: "Bidan",
        text: "Bawa buku KIA? Nanti saya catat tekanan darah dan jadwal kontrol.",
        vi: "Có mang sổ KIA không? Lát nữa tôi ghi huyết áp và lịch tái khám.",
        en: "Did you bring the KIA book? I will record blood pressure and the follow-up schedule.",
      },
      {
        speaker: "Pasien",
        text: "Ada, Bu. Kapan jadwal USG berikutnya?",
        vi: "Có ạ. Lịch siêu âm tiếp theo khi nào?",
        en: "Yes, ma'am. When is the next ultrasound schedule?",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya mau periksa ____ hari ini.`",
        prompt_en: "Fill in the blank: `Saya mau periksa ____ hari ini.`",
        answer: "kandungan",
        explanation_vi: "`periksa kandungan` = khám thai.",
        explanation_en: "`periksa kandungan` = pregnancy checkup.",
      },
      {
        type: "multiple_choice",
        prompt_vi: "`Buku KIA` là gì?",
        prompt_en: "What is `buku KIA`?",
        choices: ["sổ sức khỏe mẹ và bé", "vé siêu âm", "hóa đơn thuốc"],
        answer: "sổ sức khỏe mẹ và bé",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: `Lịch tái khám tiếp theo là khi nào?`",
        prompt_en: "Translate into Indonesian: `When is the next follow-up schedule?`",
        answer: "Kapan jadwal kontrol berikutnya?",
      },
      {
        type: "matching",
        prompt_vi: "Ghép đúng các cụm khám thai.",
        prompt_en: "Match the pregnancy checkup phrases correctly.",
        pairs: [
          ["USG", "ultrasound / siêu âm"],
          ["bidan", "midwife / nữ hộ sinh"],
          ["tablet tambah darah", "iron tablet / viên sắt"],
        ],
      },
    ],
  },
];
