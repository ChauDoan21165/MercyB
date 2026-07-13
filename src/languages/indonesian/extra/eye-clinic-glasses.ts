// Eye Clinic & Glasses Indonesian (Vietnamese -> Indonesian study track).
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
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  cell_id?: string;
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
    id: "indonesian_eye_clinic_glasses",
    level: "A2",
    category: "health",
    title_vi: "Khám mắt, kính và tiệm optik ở Indonesia",
    title_en: "Eye clinic, glasses and optical shops in Indonesia",
    sentences: [
      {
        en: "Saya mau periksa mata ke dokter mata.",
        vi: "Tôi muốn đi khám mắt với bác sĩ mắt.",
        pronunciation_focus: [
          "SA-ya MAU pe-RIK-sa MA-ta ke DOK-ter MA-ta - `periksa mata` = khám mắt; `dokter mata` = bác sĩ mắt.",
          "Lỗi người Việt: nói `di dokter mata` khi có chuyển động. Đi khám với bác sĩ dùng `ke dokter mata`.",
          "Luyện: `Saya mau periksa mata ke dokter mata.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU pe-RIK-sa MA-ta ke DOK-ter MA-ta - `periksa mata` = eye exam; `dokter mata` = eye doctor.",
          "VN-speaker trap: saying `di dokter mata` when there is movement. Going to the eye doctor uses `ke dokter mata`.",
          "Drill: `Saya mau periksa mata ke dokter mata.`",
        ],
      },
      {
        en: "Mata saya kabur kalau melihat jauh.",
        vi: "Mắt tôi bị mờ khi nhìn xa.",
        pronunciation_focus: [
          "MA-ta SA-ya KA-bur ka-LAU me-LI-hat JA-uh - `kabur` = mờ; `melihat jauh` = nhìn xa.",
          "Lỗi người Việt: lẫn `kabur` với `buta`. `Kabur` là nhìn không rõ; `buta` là mù.",
          "Luyện: `Mata saya kabur kalau melihat jauh.`",
        ],
        pronunciation_focus_en: [
          "MA-ta SA-ya KA-bur ka-LAU me-LEE-hat JAH-ooh - `kabur` = blurry; `melihat jauh` = see far away.",
          "VN-speaker trap: confusing `kabur` with `buta`. `Kabur` means blurry; `buta` means blind.",
          "Drill: `Mata saya kabur kalau melihat jauh.`",
        ],
      },
      {
        en: "Minus mata kanan saya bertambah.",
        vi: "Độ cận mắt phải của tôi tăng lên.",
        pronunciation_focus: [
          "MI-nus MA-ta KA-nan SA-ya ber-TAM-bah - `minus` = độ cận; `mata kanan` = mắt phải; `bertambah` = tăng thêm.",
          "Lỗi người Việt: dùng `naik` cho mọi số đo. Với độ mắt tăng, `minus bertambah` tự nhiên hơn.",
          "Luyện: `Minus mata kanan saya bertambah.`",
        ],
        pronunciation_focus_en: [
          "MEE-nus MA-ta KA-nan SA-ya ber-TAM-bah - `minus` = myopia prescription; `mata kanan` = right eye; `bertambah` = increases.",
          "VN-speaker trap: using `naik` for every number. For a rising eye prescription, `minus bertambah` sounds more natural.",
          "Drill: `Minus mata kanan saya bertambah.`",
        ],
      },
      {
        en: "Mata kiri saya ada silinder.",
        vi: "Mắt trái của tôi có loạn thị.",
        pronunciation_focus: [
          "MA-ta KI-ri SA-ya A-da si-LIN-der - `silinder` = loạn thị/độ trụ; `mata kiri` = mắt trái.",
          "Lỗi người Việt: dịch `loạn thị` từng chữ. Ở tiệm kính, người Indonesia hay nói `ada silinder`.",
          "Luyện: `Mata kiri saya ada silinder.`",
        ],
        pronunciation_focus_en: [
          "MA-ta KI-ri SA-ya A-da si-LIN-der - `silinder` = astigmatism/cylinder; `mata kiri` = left eye.",
          "VN-speaker trap: translating 'astigmatism' word for word. At optical shops, Indonesians often say `ada silinder`.",
          "Drill: `Mata kiri saya ada silinder.`",
        ],
      },
      {
        en: "Saya perlu resep kacamata baru.",
        vi: "Tôi cần đơn kính mới.",
        pronunciation_focus: [
          "SA-ya per-LU RE-sep ka-ca-MA-ta BA-ru - `resep kacamata` = đơn kính; `kacamata` = kính mắt, viết một từ.",
          "Lỗi người Việt: tách `kaca mata`. Kính mắt là một từ `kacamata`; còn `kaca` riêng là kính/thủy tinh.",
          "Luyện: `Saya perlu resep kacamata baru.`",
        ],
        pronunciation_focus_en: [
          "SA-ya per-LU REH-sep ka-cha-MA-ta BA-ru - `resep kacamata` = glasses prescription; `kacamata` = eyeglasses, one word.",
          "VN-speaker trap: splitting `kaca mata`. Eyeglasses is one word `kacamata`; separate `kaca` means glass.",
          "Drill: `Saya perlu resep kacamata baru.`",
        ],
      },
      {
        en: "Di mana optik terdekat?",
        vi: "Tiệm kính gần nhất ở đâu?",
        pronunciation_focus: [
          "di MA-na OP-tik ter-DE-kat - `optik` = tiệm kính/cửa hàng kính; `terdekat` = gần nhất.",
          "Lỗi người Việt: nói `toko kacamata` được hiểu, nhưng biển hiệu phổ biến là `optik`.",
          "Luyện: `Di mana optik terdekat?`",
        ],
        pronunciation_focus_en: [
          "di MA-na OP-tik ter-DE-kat - `optik` = optical shop; `terdekat` = nearest.",
          "VN-speaker trap: `toko kacamata` is understood, but the common sign word is `optik`.",
          "Drill: `Di mana optik terdekat?`",
        ],
      },
      {
        en: "Saya mau buat kacamata dengan lensa anti radiasi.",
        vi: "Tôi muốn làm kính với tròng chống ánh sáng xanh/bức xạ.",
        pronunciation_focus: [
          "SA-ya MAU BU-at ka-ca-MA-ta de-NGAN LEN-sa AN-ti ra-di-A-si - `buat kacamata` = làm kính; `lensa` = tròng kính.",
          "Lỗi người Việt: nhầm `lensa` với cả cặp kính. `Lensa` là tròng, `frame`/`bingkai` là gọng, `kacamata` là cả cặp.",
          "Luyện: `Saya mau buat kacamata dengan lensa anti radiasi.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU BOO-at ka-cha-MA-ta de-NGAN LEN-sa AN-ti ra-dee-A-see - `buat kacamata` = make glasses; `lensa` = lens.",
          "VN-speaker trap: confusing `lensa` with the whole pair. `Lensa` is the lens, `frame`/`bingkai` is the frame, `kacamata` is the whole pair.",
          "Drill: `Saya mau buat kacamata dengan lensa anti radiasi.`",
        ],
      },
      {
        en: "Saya lebih nyaman pakai lensa kontak.",
        vi: "Tôi thấy thoải mái hơn khi đeo kính áp tròng.",
        pronunciation_focus: [
          "SA-ya le-BIH NYA-man PA-kai LEN-sa KON-tak - `lensa kontak` = kính áp tròng; `nyaman` = thoải mái.",
          "Lỗi người Việt: dịch `kính áp tròng` thành `kacamata kontak`. Cụm đúng là `lensa kontak`.",
          "Luyện: `Saya lebih nyaman pakai lensa kontak.`",
        ],
        pronunciation_focus_en: [
          "SA-ya le-BIH NYA-man PA-kai LEN-sa KON-tak - `lensa kontak` = contact lenses; `nyaman` = comfortable.",
          "VN-speaker trap: translating contact lenses as `kacamata kontak`. The correct phrase is `lensa kontak`.",
          "Drill: `Saya lebih nyaman pakai lensa kontak.`",
        ],
      },
      {
        en: "Berapa lama kacamata ini bisa jadi?",
        vi: "Bao lâu thì kính này làm xong?",
        pronunciation_focus: [
          "be-RA-pa LA-ma ka-ca-MA-ta I-ni BI-sa JA-di - `bisa jadi` = có thể xong/hoàn thành; `berapa lama` = bao lâu.",
          "Lỗi người Việt: dùng `selesai berapa jam` nghe cụt. Hỏi tự nhiên: `berapa lama ... bisa jadi?`",
          "Luyện: `Berapa lama kacamata ini bisa jadi?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa LA-ma ka-cha-MA-ta I-ni BI-sa JA-di - `bisa jadi` = can be ready/finished; `berapa lama` = how long.",
          "VN-speaker trap: saying `selesai berapa jam`, which sounds abrupt. Natural question: `berapa lama ... bisa jadi?`",
          "Drill: `Berapa lama kacamata ini bisa jadi?`",
        ],
      },
      {
        en: "Kalau mata merah dan sakit, sebaiknya ke dokter mata.",
        vi: "Nếu mắt đỏ và đau, tốt nhất nên đi bác sĩ mắt.",
        pronunciation_focus: [
          "KA-lau MA-ta ME-rah dan SA-kit, se-BA-ik-nya ke DOK-ter MA-ta - `mata merah` = mắt đỏ; `sebaiknya` = tốt nhất nên.",
          "Lỗi người Việt: tự mua thuốc nhỏ mắt cho mọi trường hợp. Khi đỏ và đau, câu an toàn là `sebaiknya ke dokter mata`.",
          "Luyện: `Kalau mata merah dan sakit, sebaiknya ke dokter mata.`",
        ],
        pronunciation_focus_en: [
          "KA-lau MA-ta ME-rah dan SA-kit, se-BA-ik-nya ke DOK-ter MA-ta - `mata merah` = red eye; `sebaiknya` = it is best to.",
          "VN-speaker trap: buying eye drops for every case. When the eye is red and painful, the safe phrase is `sebaiknya ke dokter mata`.",
          "Drill: `Kalau mata merah dan sakit, sebaiknya ke dokter mata.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `dokter mata` là bác sĩ mắt tại phòng khám/bệnh viện, còn `optik` là tiệm kính để đo mắt cơ bản, làm kính, thay tròng hoặc mua lensa kontak. Nhiều người nói `minus` cho cận thị và `silinder` cho loạn thị. Nếu chỉ cần làm kính, bạn có thể đến `optik`; nếu mắt đỏ, đau, chấn thương, nhìn mờ đột ngột hoặc có bệnh nền, nên đi `dokter mata`. `Resep kacamata` có thể dùng để đặt kính ở optik.",
    cultural_notes_en:
      "In Indonesia, a `dokter mata` is an eye doctor at a clinic or hospital, while an `optik` is an optical shop for basic eye checks, making glasses, replacing lenses, or buying contact lenses. Many people say `minus` for myopia and `silinder` for astigmatism. If you only need glasses, you can go to an `optik`; if the eye is red, painful, injured, suddenly blurry, or you have underlying conditions, go to a `dokter mata`. A `resep kacamata` can be used to order glasses at an optical shop.",
    tip_advice_vi:
      "Mẹo cho người Việt: `mata` = mắt, `dokter mata` = bác sĩ mắt, `optik` = tiệm kính, `kacamata` = kính mắt, `lensa kontak` = kính áp tròng. Nhớ `kacamata` viết một từ và chữ `c` đọc như 'ch'. Khi nói độ mắt, dùng mẫu `minus saya...`, `mata kiri ada silinder`, hoặc `resep kacamata baru`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: `mata` = eye, `dokter mata` = eye doctor, `optik` = optical shop, `kacamata` = eyeglasses, `lensa kontak` = contact lenses. Remember `kacamata` is one word and `c` sounds like 'ch'. For prescriptions, use patterns like `minus saya...`, `mata kiri ada silinder`, or `resep kacamata baru`.",
    vocabulary: [
      {
        cell_id: "0fd47109-6b57-4ef9-ab05-6aa76717b787",
        word: "dokter mata",
        en: "eye doctor",
        vi: "bác sĩ mắt",
        pos: "noun phrase",
        pronunciation_vi: "DOK-ter MA-ta",
        pronunciation_en: "DOK-ter MAH-ta",
      },
      {
        cell_id: "3bb3f50e-e445-4238-a249-a2da0d90e884",
        word: "periksa mata",
        en: "eye exam / check eyes",
        vi: "khám mắt",
        pos: "verb phrase",
        pronunciation_vi: "pe-RIK-sa MA-ta",
        pronunciation_en: "pe-RIK-sa MAH-ta",
      },
      {
        cell_id: "3cc94a3e-eeb9-4068-b1fc-2bc02eb1cddd",
        word: "minus",
        en: "myopia prescription",
        vi: "độ cận",
        pos: "noun",
        pronunciation_vi: "MI-nus",
        pronunciation_en: "MEE-nus",
      },
      {
        cell_id: "47d64c1c-d946-44cc-91a6-b629c18328c8",
        word: "silinder",
        en: "astigmatism / cylinder",
        vi: "loạn thị / độ trụ",
        pos: "noun",
        pronunciation_vi: "si-LIN-der",
        pronunciation_en: "see-LIN-der",
      },
      {
        cell_id: "0075130a-c423-484d-b3a5-60760f0dd93c",
        word: "kacamata",
        en: "eyeglasses",
        vi: "kính mắt",
        pos: "noun",
        pronunciation_vi: "ka-cha-MA-ta",
        pronunciation_en: "ka-cha-MA-ta",
      },
      {
        cell_id: "f363348c-1c68-4962-9638-5b2687590ef4",
        word: "lensa kontak",
        en: "contact lenses",
        vi: "kính áp tròng",
        pos: "noun phrase",
        pronunciation_vi: "LEN-sa KON-tak",
        pronunciation_en: "LEN-sa KON-tak",
      },
      {
        cell_id: "798f8a26-c962-4ef6-864b-72467f3749a2",
        word: "resep kacamata",
        en: "glasses prescription",
        vi: "đơn kính",
        pos: "noun phrase",
        pronunciation_vi: "RE-sep ka-cha-MA-ta",
        pronunciation_en: "REH-sep ka-cha-MA-ta",
      },
      {
        cell_id: "0ebc5a74-5d28-423b-bf1a-129e97ac9ef4",
        word: "optik",
        en: "optical shop",
        vi: "tiệm kính",
        pos: "noun",
        pronunciation_vi: "OP-tik",
        pronunciation_en: "OP-tik",
      },
      {
        cell_id: "11830aac-157b-4883-aee6-88e3aa7c56f4",
        word: "lensa",
        en: "lens",
        vi: "tròng kính / thấu kính",
        pos: "noun",
        pronunciation_vi: "LEN-sa",
        pronunciation_en: "LEN-sa",
      },
      {
        cell_id: "751e04ff-374a-4bf2-bee9-7815abdea927",
        word: "bingkai",
        en: "frame",
        vi: "gọng kính",
        pos: "noun",
        pronunciation_vi: "BING-kai",
        pronunciation_en: "BING-kai",
      },
    ],
    dialogue: [
      {
        cell_id: "aa4daf25-ea95-4b36-b8a0-49ed7ed2a0f5",
        speaker: "Pasien",
        text: "Selamat siang, saya mau periksa mata.",
        vi: "Chào buổi trưa, tôi muốn khám mắt.",
        en: "Good afternoon, I want an eye exam.",
      },
      {
        cell_id: "f0dfc9c5-5c12-40eb-9e69-20b95a7a700e",
        speaker: "Petugas Optik",
        text: "Baik. Mata Anda kabur saat melihat jauh atau dekat?",
        vi: "Được. Mắt anh/chị mờ khi nhìn xa hay gần?",
        en: "Okay. Is your vision blurry when seeing far or near?",
      },
      {
        cell_id: "4f8b7416-6739-4ab4-a330-7ab8910d41b3",
        speaker: "Pasien",
        text: "Melihat jauh kabur. Minus saya mungkin bertambah.",
        vi: "Nhìn xa bị mờ. Có lẽ độ cận của tôi tăng.",
        en: "Seeing far is blurry. My myopia prescription may have increased.",
      },
      {
        cell_id: "2f2c5989-f04f-4799-bf1d-6999b474ee38",
        speaker: "Petugas Optik",
        text: "Nanti kami cek minus dan silindernya.",
        vi: "Lát nữa chúng tôi kiểm tra độ cận và độ loạn.",
        en: "We will check the myopia and cylinder prescription.",
      },
      {
        cell_id: "08f5ac79-86b9-4275-8863-29a0e7d176ec",
        speaker: "Pasien",
        text: "Kalau sudah ada resep kacamata, saya mau buat kacamata baru.",
        vi: "Nếu đã có đơn kính, tôi muốn làm kính mới.",
        en: "Once there is a glasses prescription, I want to make new glasses.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya mau periksa ____ ke dokter mata.`",
        prompt_en: "Fill in the blank: `Saya mau periksa ____ ke dokter mata.`",
        answer: "mata",
        explanation_vi: "`periksa mata` = khám mắt.",
        explanation_en: "`periksa mata` = eye exam/check eyes.",
      },
      {
        type: "multiple_choice",
        prompt_vi: "`Optik` nghĩa là gì?",
        prompt_en: "What does `optik` mean?",
        choices: ["tiệm kính", "phòng cấp cứu", "quầy thuốc"],
        answer: "tiệm kính",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: `Tôi cần đơn kính mới.`",
        prompt_en: "Translate into Indonesian: `I need a new glasses prescription.`",
        answer: "Saya perlu resep kacamata baru.",
      },
      {
        type: "matching",
        prompt_vi: "Ghép đúng các từ về mắt.",
        prompt_en: "Match the eye-related terms correctly.",
        pairs: [
          ["minus", "myopia prescription / độ cận"],
          ["silinder", "astigmatism / loạn thị"],
          ["lensa kontak", "contact lenses / kính áp tròng"],
        ],
      },
    ],
  },
];
