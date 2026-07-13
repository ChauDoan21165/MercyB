// Landlord & Neighbor Dispute Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It mirrors sibling Indonesian `extra/*`
// files: target-language text is stored in `en`, Vietnamese glosses in `vi`,
// Vietnamese-facing L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.
//
// Community-dispute register note: Indonesian neighborhood conflict language is
// best kept calm and indirect. Useful terms include `tetangga`, `pemilik rumah`,
// `ribut`, `suara berisik`, `parkir`, `batas tanah`, `mediasi`, and `RT/RW`.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length and order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  cell_id?: string;
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
  cell_id?: string;
  speaker: string;
  /** Indonesian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
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
    id: "indonesian_landlord_neighbor_dispute",
    level: "B1",
    category: "community",
    title_vi: "Tranh chấp với chủ nhà và hàng xóm",
    title_en: "Landlord and neighbor disputes",
    sentences: [
      {
        en: "Saya ingin bicara baik-baik dengan tetangga.",
        vi: "Tôi muốn nói chuyện đàng hoàng/êm đẹp với hàng xóm.",
        pronunciation_focus: [
          "SA-ya I-ngin bi-CA-ra baik-BAIK DE-ngan te-TANG-ga - `baik-baik` = một cách tử tế/êm đẹp; `tetangga` = hàng xóm.",
          "Lỗi người Việt: nói thẳng `saya mau komplain` dễ căng. Mở bằng `bicara baik-baik` mềm hơn.",
          "Luyện: `Saya ingin bicara baik-baik.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin bee-CHA-ra baik-BAIK DEH-ngan te-TANG-ga - `baik-baik` = calmly/properly; `tetangga` = neighbor.",
          "VN-speaker trap: opening with blunt `saya mau komplain` can escalate. `Bicara baik-baik` is softer.",
          "Drill: `Saya ingin bicara baik-baik.`",
        ],
      },
      {
        en: "Maaf, suara musiknya agak berisik malam ini.",
        vi: "Xin lỗi, tiếng nhạc tối nay hơi ồn.",
        pronunciation_focus: [
          "ma-AF, SU-a-ra MU-sik-nya A-gak be-RI-sik MA-lam I-ni - `agak` = hơi; `berisik` = ồn.",
          "Lỗi người Việt: hô `berisik!` rất cộc. Thêm `maaf` và `agak` để giảm độ căng.",
          "Luyện: `Suaranya agak berisik.`",
        ],
        pronunciation_focus_en: [
          "ma-AF, SOO-a-ra MOO-sik-nya A-gak be-REE-sik MA-lam EE-nee - `agak` = a bit; `berisik` = noisy.",
          "VN-speaker trap: shouting `berisik!` is blunt. Add `maaf` and `agak` to soften it.",
          "Drill: `Suaranya agak berisik.`",
        ],
      },
      {
        en: "Tolong jangan parkir di depan pagar saya.",
        vi: "Làm ơn đừng đỗ xe trước cổng/hàng rào nhà tôi.",
        pronunciation_focus: [
          "TO-long JA-ngan PAR-kir di de-PAN PA-gar SA-ya - `jangan` = đừng; `pagar` = cổng/hàng rào.",
          "Lỗi người Việt: dùng `tidak parkir` để cấm. Mệnh lệnh phủ định phải dùng `jangan parkir`.",
          "Luyện: `Jangan parkir di depan pagar saya.`",
        ],
        pronunciation_focus_en: [
          "TO-long JA-ngan PAR-keer dee de-PAN PA-gar SA-ya - `jangan` = don't; `pagar` = gate/fence.",
          "VN-speaker trap: using `tidak parkir` for a prohibition. Negative commands use `jangan parkir`.",
          "Drill: `Jangan parkir di depan pagar saya.`",
        ],
      },
      {
        en: "Saya sudah menghubungi pemilik rumah.",
        vi: "Tôi đã liên hệ với chủ nhà.",
        pronunciation_focus: [
          "SA-ya SU-dah meng-hu-BUNG-i pe-MI-lik RU-mah - `pemilik rumah` = chủ nhà; `menghubungi` = liên hệ.",
          "Lỗi người Việt: lẫn `pemilik rumah` với `ibu kost`. `Pemilik rumah` là chủ sở hữu nhà nói chung.",
          "Luyện: `Saya menghubungi pemilik rumah.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah meng-hoo-BOONG-ee pe-MEE-lik ROO-mah - `pemilik rumah` = homeowner/landlord; `menghubungi` = contact.",
          "VN-speaker trap: mixing `pemilik rumah` with `ibu kost`. `Pemilik rumah` is the property owner generally.",
          "Drill: `Saya menghubungi pemilik rumah.`",
        ],
      },
      {
        en: "Kontrakan ini punya aturan jam tenang.",
        vi: "Nhà thuê này có quy định giờ yên tĩnh.",
        pronunciation_focus: [
          "kon-TRA-kan I-ni PU-nya a-TU-ran jam TE-nang - `kontrakan` = nhà thuê; `jam tenang` = giờ yên tĩnh.",
          "Lỗi người Việt: nói `rumah sewa` luôn đúng, nhưng trong đời thường `kontrakan` rất tự nhiên.",
          "Luyện: `Ada aturan jam tenang.`",
        ],
        pronunciation_focus_en: [
          "kon-TRA-kan EE-nee POO-nya a-TOO-ran jam TEH-nang - `kontrakan` = rented house; `jam tenang` = quiet hours.",
          "VN-speaker note: `rumah sewa` is correct, but everyday Indonesian often says `kontrakan`.",
          "Drill: `Ada aturan jam tenang.`",
        ],
      },
      {
        en: "Kami ribut karena batas tanah belum jelas.",
        vi: "Chúng tôi tranh cãi vì ranh giới đất chưa rõ.",
        pronunciation_focus: [
          "KA-mi RI-but ka-RE-na BA-tas TA-nah be-LUM JE-las - `ribut` = cãi vã/ồn ào; `batas tanah` = ranh giới đất.",
          "Lỗi người Việt: `ribut` vừa là ồn vừa là cãi nhau. Ngữ cảnh quyết định nghĩa.",
          "Luyện: `Batas tanah belum jelas.`",
        ],
        pronunciation_focus_en: [
          "KA-mee REE-boot ka-REH-na BA-tas TA-nah be-LOOM JEH-las - `ribut` = noisy/fighting; `batas tanah` = land boundary.",
          "VN-speaker note: `ribut` can mean noisy or arguing. Context decides.",
          "Drill: `Batas tanah belum jelas.`",
        ],
      },
      {
        en: "Sebaiknya kita minta mediasi dari Pak RT.",
        vi: "Tốt nhất là chúng ta nhờ ông RT hòa giải.",
        pronunciation_focus: [
          "se-BAIK-nya KI-ta MIN-ta me-di-A-si DA-ri Pak er-TE - `sebaiknya` = tốt nhất nên; `mediasi` = hòa giải.",
          "Lỗi người Việt: bỏ `sebaiknya` làm câu nghe ra lệnh. `Sebaiknya` khiến đề xuất mềm hơn.",
          "Luyện: `Sebaiknya kita minta mediasi.`",
        ],
        pronunciation_focus_en: [
          "se-BAIK-nya KEE-ta MIN-ta meh-dee-A-see DA-ree Pak er-TEH - `sebaiknya` = it would be best; `mediasi` = mediation.",
          "VN-speaker trap: dropping `sebaiknya` makes it sound like an order. It softens the suggestion.",
          "Drill: `Sebaiknya kita minta mediasi.`",
        ],
      },
      {
        en: "Pak RT dan Pak RW bisa membantu mencari solusi.",
        vi: "Ông RT và ông RW có thể giúp tìm giải pháp.",
        pronunciation_focus: [
          "Pak er-TE dan Pak er-WE BI-sa mem-BAN-tu men-CA-ri so-LU-si - `RT/RW` = đơn vị/tổ dân cư; `solusi` = giải pháp.",
          "Lỗi người Việt: đọc RT/RW theo chữ tiếng Anh. Tiếng Indonesia: `er-te`, `er-we`.",
          "Luyện: `RT dan RW membantu mencari solusi.`",
        ],
        pronunciation_focus_en: [
          "Pak er-TEH dan Pak er-WEH BEE-sa mem-BAN-too men-CHA-ree so-LOO-see - `RT/RW` = local neighborhood units; `solusi` = solution.",
          "VN-speaker trap: spelling RT/RW with English letter names. Indonesian says `er-te`, `er-we`.",
          "Drill: `RT dan RW membantu mencari solusi.`",
        ],
      },
      {
        en: "Saya tidak ingin memperbesar masalah.",
        vi: "Tôi không muốn làm vấn đề lớn thêm.",
        pronunciation_focus: [
          "SA-ya TI-dak I-ngin mem-per-BE-sar ma-sa-LAH - `memperbesar` = làm lớn thêm; `masalah` = vấn đề.",
          "Lỗi người Việt: nói `membuat masalah besar` cũng hiểu, nhưng `memperbesar masalah` tự nhiên hơn.",
          "Luyện: `Tidak ingin memperbesar masalah.`",
        ],
        pronunciation_focus_en: [
          "SA-ya TEE-dak EE-ngin mem-per-BEH-sar ma-sa-LAH - `memperbesar` = make bigger/escalate; `masalah` = problem.",
          "VN-speaker note: `membuat masalah besar` is understood, but `memperbesar masalah` is more natural.",
          "Drill: `Tidak ingin memperbesar masalah.`",
        ],
      },
      {
        en: "Bisa kita buat kesepakatan tertulis?",
        vi: "Chúng ta có thể lập thỏa thuận bằng văn bản không?",
        pronunciation_focus: [
          "BI-sa KI-ta BU-at ke-se-PA-kat-an ter-TU-lis - `kesepakatan` = thỏa thuận; `tertulis` = bằng văn bản.",
          "Lỗi người Việt: chỉ nói miệng khi việc dễ tái diễn. Dùng `kesepakatan tertulis` để rõ ràng.",
          "Luyện: `Buat kesepakatan tertulis.`",
        ],
        pronunciation_focus_en: [
          "BEE-sa KEE-ta BOO-at ke-se-PA-kat-an ter-TOO-lis - `kesepakatan` = agreement; `tertulis` = written.",
          "VN-speaker note: for recurring problems, a `kesepakatan tertulis` makes expectations clear.",
          "Drill: `Buat kesepakatan tertulis.`",
        ],
      },
      {
        en: "Mohon jangan menyebarkan cerita sebelum jelas.",
        vi: "Xin đừng lan truyền câu chuyện trước khi rõ ràng.",
        pronunciation_focus: [
          "MO-hon JA-ngan me-nye-BAR-kan ce-RI-ta se-BE-lum JE-las - `menyebarkan` = lan truyền; `sebelum jelas` = trước khi rõ.",
          "Lỗi người Việt: dùng `cerita` như động từ. `Cerita` là câu chuyện/kể; lan truyền là `menyebarkan cerita`.",
          "Luyện: `Jangan menyebarkan cerita.`",
        ],
        pronunciation_focus_en: [
          "MO-hon JA-ngan me-nyeh-BAR-kan che-REE-ta se-BE-lum JEH-las - `menyebarkan` = spread; `sebelum jelas` = before it is clear.",
          "VN-speaker trap: using `cerita` as the verb. `Cerita` is story/tell; spreading is `menyebarkan cerita`.",
          "Drill: `Jangan menyebarkan cerita.`",
        ],
      },
      {
        en: "Kalau tidak selesai, kita lapor ke kelurahan.",
        vi: "Nếu không giải quyết xong, chúng ta báo lên phường/xã.",
        pronunciation_focus: [
          "KA-lau TI-dak se-LE-sai, KI-ta LA-por ke ke-lu-RA-han - `kelurahan` = phường/xã hành chính; `lapor` = báo/trình.",
          "Lỗi người Việt: nhảy thẳng sang cảnh sát. Tranh chấp khu phố thường qua RT/RW rồi `kelurahan` trước.",
          "Luyện: `Kita lapor ke kelurahan.`",
        ],
        pronunciation_focus_en: [
          "KA-lau TEE-dak se-LEH-sai, KEE-ta LA-por ke ke-loo-RA-han - `kelurahan` = urban village/local administrative office; `lapor` = report.",
          "VN-speaker note: neighborhood disputes often go through RT/RW and `kelurahan` before police.",
          "Drill: `Kita lapor ke kelurahan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, nhiều vấn đề hàng xóm được xử lý theo tầng cộng đồng: nói chuyện trực tiếp trước, rồi nhờ `Pak RT`, `Pak RW`, sau đó mới lên `kelurahan` hoặc cơ quan khác. Giữ thể diện và hòa khí rất quan trọng; dùng `maaf`, `mohon`, `sebaiknya`, `bicara baik-baik`, và tránh quy chụp khi chưa rõ sự việc.",
    cultural_notes_en:
      "In Indonesia, many neighborhood issues are handled through community layers: speak directly first, then ask `Pak RT`, `Pak RW`, and only later go to the `kelurahan` or other authorities. Saving face and keeping peace matter; use `maaf`, `mohon`, `sebaiknya`, `bicara baik-baik`, and avoid accusations before facts are clear.",
    tip_advice_vi:
      "Mẹo cho người Việt: khi phàn nàn, đừng mở đầu bằng câu buộc tội. Dùng khung mềm: `Maaf, ... agak berisik`, `Tolong jangan ...`, `Sebaiknya kita ...`, `Saya tidak ingin memperbesar masalah`. Nếu liên quan đất/đỗ xe/quy định nhà thuê, hỏi `pemilik rumah` và nhờ `RT/RW` làm trung gian.",
    tip_advice_en:
      "Tip for Vietnamese speakers: when complaining, do not start with accusations. Use soft frames: `Maaf, ... agak berisik`, `Tolong jangan ...`, `Sebaiknya kita ...`, `Saya tidak ingin memperbesar masalah`. For land, parking, or rental-rule issues, involve the `pemilik rumah` and ask `RT/RW` to mediate.",
    vocabulary: [
      {
        cell_id: "ab2fd365-592f-4ee0-b2b3-71fb47f3f0f3",
        word: "tetangga",
        en: "neighbor",
        vi: "hàng xóm",
        pos: "noun",
        pronunciation_vi: "te-TANG-ga",
        pronunciation_en: "te-TANG-ga",
      },
      {
        cell_id: "e55565ac-dc0d-4b12-a1ba-aa4fd1a63201",
        word: "pemilik rumah",
        en: "homeowner / landlord",
        vi: "chủ nhà",
        pos: "noun phrase",
        pronunciation_vi: "pe-MI-lik RU-mah",
        pronunciation_en: "pe-MEE-lik ROO-mah",
      },
      {
        cell_id: "24156bda-9def-4a39-958c-9dda708edfc7",
        word: "ribut",
        en: "noisy / arguing",
        vi: "ồn ào / cãi nhau",
        pos: "adjective / verb",
        pronunciation_vi: "RI-but",
        pronunciation_en: "REE-boot",
      },
      {
        cell_id: "063eb510-5837-4707-aefe-f8856f9b4816",
        word: "suara berisik",
        en: "noisy sound",
        vi: "tiếng ồn",
        pos: "noun phrase",
        pronunciation_vi: "SU-a-ra be-RI-sik",
        pronunciation_en: "SOO-a-ra be-REE-sik",
      },
      {
        cell_id: "65cfd256-4fd4-40ee-abd7-558922f7184a",
        word: "parkir",
        en: "to park / parking",
        vi: "đỗ xe / gửi xe",
        pos: "verb / noun",
        pronunciation_vi: "PAR-kir",
        pronunciation_en: "PAR-keer",
      },
      {
        cell_id: "bbf01e95-5c3d-4bf2-bcc2-0f2fa3762596",
        word: "batas tanah",
        en: "land boundary",
        vi: "ranh giới đất",
        pos: "noun phrase",
        pronunciation_vi: "BA-tas TA-nah",
        pronunciation_en: "BA-tas TA-nah",
      },
      {
        cell_id: "1c7d4da2-0c9b-43a7-a209-87520a743781",
        word: "mediasi",
        en: "mediation",
        vi: "hòa giải",
        pos: "noun",
        pronunciation_vi: "me-di-A-si",
        pronunciation_en: "meh-dee-A-see",
      },
      {
        cell_id: "2de57d00-7ab7-45cf-9f7e-54b166ed781e",
        word: "RT/RW",
        en: "neighborhood/community units",
        vi: "tổ/khu dân cư địa phương",
        pos: "noun",
        pronunciation_vi: "er-TE / er-WE",
        pronunciation_en: "er-TEH / er-WEH",
      },
      {
        cell_id: "11fcf19c-4288-4921-9b30-e329e68a5287",
        word: "kelurahan",
        en: "local administrative office",
        vi: "phường/xã hành chính",
        pos: "noun",
        pronunciation_vi: "ke-lu-RA-han",
        pronunciation_en: "ke-loo-RA-han",
      },
      {
        cell_id: "a38e5b41-2514-47cb-9f91-cab9876b43a3",
        word: "kesepakatan tertulis",
        en: "written agreement",
        vi: "thỏa thuận bằng văn bản",
        pos: "noun phrase",
        pronunciation_vi: "ke-se-PA-kat-an ter-TU-lis",
        pronunciation_en: "ke-se-PA-kat-an ter-TOO-lis",
      },
      {
        cell_id: "2a54f4e2-48e0-47b8-ab3f-dc4cb89c575e",
        word: "jam tenang",
        en: "quiet hours",
        vi: "giờ yên tĩnh",
        pos: "noun phrase",
        pronunciation_vi: "jam TE-nang",
        pronunciation_en: "jam TEH-nang",
      },
      {
        cell_id: "783b99aa-45fc-4386-82fd-b36df335359d",
        word: "memperbesar masalah",
        en: "to escalate the problem",
        vi: "làm vấn đề lớn thêm",
        pos: "verb phrase",
        pronunciation_vi: "mem-per-BE-sar ma-sa-LAH",
        pronunciation_en: "mem-per-BEH-sar ma-sa-LAH",
      },
    ],
    dialogue: [
      {
        cell_id: "727eab83-4caa-4310-83e9-57d10a74130b",
        speaker: "Penyewa",
        text: "Pak, saya ingin bicara baik-baik. Suara musik dari sebelah agak berisik malam ini.",
        vi: "Chú ơi, tôi muốn nói chuyện nhẹ nhàng. Tiếng nhạc từ bên cạnh tối nay hơi ồn.",
        en: "Sir, I want to speak calmly. The music from next door is a bit noisy tonight.",
      },
      {
        cell_id: "a6719d42-34c7-4418-b993-918868e8d30f",
        speaker: "Pemilik Rumah",
        text: "Baik, nanti saya hubungi tetangga itu dulu.",
        vi: "Được, lát nữa tôi sẽ liên hệ hàng xóm đó trước.",
        en: "Okay, I will contact that neighbor first.",
      },
      {
        cell_id: "385a0376-6d18-4557-b72c-7bd8384a9acd",
        speaker: "Penyewa",
        text: "Kalau belum selesai, sebaiknya kita minta mediasi Pak RT.",
        vi: "Nếu chưa giải quyết xong, tốt nhất chúng ta nhờ ông RT hòa giải.",
        en: "If it is not resolved, it would be best to ask Pak RT for mediation.",
      },
      {
        cell_id: "2e0605b5-b6ae-435b-99e2-76382742b28a",
        speaker: "Pemilik Rumah",
        text: "Setuju. Kita cari solusi tanpa memperbesar masalah.",
        vi: "Đồng ý. Chúng ta tìm giải pháp mà không làm vấn đề lớn thêm.",
        en: "Agreed. We will find a solution without escalating the problem.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Làm ơn đừng đỗ xe trước cổng nhà tôi.",
        answer: "Tolong jangan parkir di depan pagar saya.",
      },
      {
        type: "fill_blank",
        prompt: "Sebaiknya kita minta ____ dari Pak RT.",
        answer: "mediasi",
        explanation_vi: "`mediasi` = hòa giải, thường dùng khi nhờ RT/RW làm trung gian.",
        explanation_en: "`mediasi` = mediation, often used when asking RT/RW to mediate.",
      },
      {
        type: "multiple_choice",
        prompt: "Which phrase means 'land boundary'?",
        choices: ["batas tanah", "jam tenang", "pemilik rumah", "suara berisik"],
        answer: "batas tanah",
      },
      {
        type: "matching",
        pairs: [
          ["tetangga", "hàng xóm"],
          ["pemilik rumah", "chủ nhà"],
          ["RT/RW", "tổ/khu dân cư"],
          ["kesepakatan tertulis", "thỏa thuận bằng văn bản"],
        ],
      },
    ],
  },
];

export default lessons;
