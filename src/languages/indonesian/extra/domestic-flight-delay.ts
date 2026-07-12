// Domestic flight delay Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It mirrors sibling Indonesian `extra/*`
// files: target-language text is stored in `en`, Vietnamese glosses in `vi`,
// Vietnamese-facing L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.
//
// Register note: airport delay Indonesian is procedural and announcement-heavy:
// `penerbangan domestik`, `delay`, `gate`, `boarding pass`, `bagasi`,
// `kompensasi`, `ganti jadwal`, and `pengumuman bandara`.

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
    id: "indonesian_domestic_flight_delay",
    level: "B1",
    category: "travel",
    title_vi: "Chuyến bay nội địa bị delay",
    title_en: "Domestic flight delays",
    sentences: [
      {
        en: "Penerbangan domestik saya ke Surabaya mengalami delay.",
        vi: "Chuyến bay nội địa của tôi đi Surabaya bị delay.",
        pronunciation_focus: [
          "pe-ner-BANG-an do-MES-tik SA-ya ke Su-ra-BA-ya me-nga-LA-mi di-LEY - `penerbangan domestik` = chuyến bay nội địa; `mengalami delay` = bị trễ/chậm.",
          "Lỗi người Việt: nói `pesawat saya delay` được trong nói nhanh, nhưng tại quầy nên nói `penerbangan saya mengalami delay`.",
          "Luyện: `Penerbangan saya mengalami delay.`",
        ],
        pronunciation_focus_en: [
          "peh-ner-BANG-an do-MES-tik SA-ya keh Su-ra-BA-ya meh-nga-LA-mee dee-LAY - `penerbangan domestik` = domestic flight; `mengalami delay` = is delayed.",
          "VN-speaker note: `pesawat saya delay` works casually, but at a counter use `penerbangan saya mengalami delay`.",
          "Drill: `Penerbangan saya mengalami delay.`",
        ],
      },
      {
        en: "Apakah ada pengumuman bandara tentang jadwal baru?",
        vi: "Có thông báo sân bay về lịch mới không?",
        pronunciation_focus: [
          "a-PA-kah A-da pe-ngu-MUM-an ban-DA-ra ten-TANG JAD-wal BA-ru - `pengumuman bandara` = thông báo sân bay; `jadwal baru` = lịch mới.",
          "Lỗi người Việt: dùng `pengumuman airport`. Từ Indonesia tự nhiên là `bandara`.",
          "Luyện: `Ada pengumuman bandara?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah A-da peh-ngoo-MOOM-an ban-DA-ra ten-TANG JAD-wal BA-roo - `pengumuman bandara` = airport announcement; `jadwal baru` = new schedule.",
          "VN-speaker trap: saying `pengumuman airport`. Natural Indonesian uses `bandara`.",
          "Drill: `Ada pengumuman bandara?`",
        ],
      },
      {
        en: "Gate keberangkatan berubah dari gate dua ke gate lima.",
        vi: "Cổng khởi hành đổi từ gate 2 sang gate 5.",
        pronunciation_focus: [
          "geyt ke-be-RANG-kat-an be-RU-bah DA-ri geyt DU-a ke geyt LI-ma - `gate keberangkatan` = cổng khởi hành; `berubah dari...ke...` = đổi từ...sang...",
          "Lỗi người Việt: lẫn `di` và `ke`. Chuyển sang cổng mới dùng `ke gate lima`.",
          "Luyện: `Gate berubah ke gate lima.`",
        ],
        pronunciation_focus_en: [
          "gate keh-beh-RANG-kat-an beh-ROO-bah DA-ree gate DOO-a keh gate LEE-ma - `gate keberangkatan` = departure gate; `berubah dari...ke...` = changed from...to...",
          "VN-speaker trap: mixing `di` and `ke`. Moving to a new gate uses `ke gate lima`.",
          "Drill: `Gate berubah ke gate lima.`",
        ],
      },
      {
        en: "Boarding pass saya masih berlaku setelah ganti jadwal?",
        vi: "Boarding pass của tôi còn hiệu lực sau khi đổi lịch không?",
        pronunciation_focus: [
          "BOR-ding pas SA-ya MA-sih ber-LA-ku se-TE-lah GAN-ti JAD-wal - `boarding pass` = thẻ lên máy bay; `masih berlaku` = còn hiệu lực.",
          "Lỗi người Việt: dùng `masih hidup` cho giấy tờ. Với vé/thẻ, dùng `masih berlaku`.",
          "Luyện: `Boarding pass masih berlaku?`",
        ],
        pronunciation_focus_en: [
          "BOR-ding pass SA-ya MA-see ber-LA-koo seh-TEH-lah GAN-tee JAD-wal - `boarding pass` = boarding pass; `masih berlaku` = still valid.",
          "VN-speaker trap: using `masih hidup` for documents. For tickets/passes, use `masih berlaku`.",
          "Drill: `Boarding pass masih berlaku?`",
        ],
      },
      {
        en: "Saya ingin ganti jadwal ke penerbangan yang lebih awal.",
        vi: "Tôi muốn đổi lịch sang chuyến bay sớm hơn.",
        pronunciation_focus: [
          "SA-ya I-ngin GAN-ti JAD-wal ke pe-ner-BANG-an yang LE-bih A-wal - `ganti jadwal` = đổi lịch; `lebih awal` = sớm hơn.",
          "Lỗi người Việt: nói `ganti tiket` có thể bị hiểu là đổi vé khác. Nếu đổi giờ, nói `ganti jadwal`.",
          "Luyện: `Ganti jadwal ke penerbangan lebih awal.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin GAN-tee JAD-wal keh peh-ner-BANG-an yang LEH-bih A-wal - `ganti jadwal` = reschedule; `lebih awal` = earlier.",
          "VN-speaker trap: `ganti tiket` may sound like replacing the ticket. For time changes, say `ganti jadwal`.",
          "Drill: `Ganti jadwal ke penerbangan lebih awal.`",
        ],
      },
      {
        en: "Apakah saya berhak mendapat kompensasi karena delay?",
        vi: "Tôi có quyền nhận bồi thường vì delay không?",
        pronunciation_focus: [
          "a-PA-kah SA-ya ber-HAK men-DA-pat kom-pen-SA-si ka-RE-na di-LEY - `berhak mendapat` = có quyền nhận; `kompensasi` = bồi thường/hỗ trợ.",
          "Lỗi người Việt: hỏi quá thẳng `mana uang saya?` dễ căng. Câu `berhak mendapat kompensasi` lịch sự và rõ hơn.",
          "Luyện: `Berhak mendapat kompensasi?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah SA-ya ber-HAK men-DA-pat kom-pen-SA-see ka-REH-na dee-LAY - `berhak mendapat` = entitled to receive; `kompensasi` = compensation.",
          "VN-speaker trap: asking bluntly `mana uang saya?` can escalate. `Berhak mendapat kompensasi` is polite and clear.",
          "Drill: `Berhak mendapat kompensasi?`",
        ],
      },
      {
        en: "Bagasi saya sudah masuk, apakah bisa dipindahkan ke penerbangan baru?",
        vi: "Hành lý ký gửi của tôi đã vào hệ thống, có thể chuyển sang chuyến bay mới không?",
        pronunciation_focus: [
          "ba-GA-si SA-ya SU-dah MA-suk, a-PA-kah BI-sa di-PIN-dah-kan ke pe-ner-BANG-an BA-ru - `bagasi` = hành lý ký gửi; `dipindahkan` = được chuyển.",
          "Lỗi người Việt: nói `bagasi pindah` thiếu bị động. Hành lý được chuyển là `bagasi dipindahkan`.",
          "Luyện: `Bagasi dipindahkan ke penerbangan baru.`",
        ],
        pronunciation_focus_en: [
          "ba-GA-see SA-ya SOO-dah MA-sook, a-PA-kah BEE-sa dee-PIN-dah-kan keh peh-ner-BANG-an BA-roo - `bagasi` = checked baggage; `dipindahkan` = moved/transferred.",
          "VN-speaker trap: saying `bagasi pindah` without passive marking. Baggage being transferred is `bagasi dipindahkan`.",
          "Drill: `Bagasi dipindahkan ke penerbangan baru.`",
        ],
      },
      {
        en: "Kapan perkiraan waktu boarding setelah delay?",
        vi: "Dự kiến thời gian boarding sau delay là khi nào?",
        pronunciation_focus: [
          "KA-pan per-KI-ra-an WAK-tu BOR-ding se-TE-lah di-LEY - `perkiraan waktu` = thời gian dự kiến; `boarding` = lên máy bay.",
          "Lỗi người Việt: hỏi `jam pasti` khi chưa có lịch chắc. Nếu chưa chắc, dùng `perkiraan waktu`.",
          "Luyện: `Perkiraan waktu boarding kapan?`",
        ],
        pronunciation_focus_en: [
          "KA-pan per-KEE-ra-an WAK-too BOR-ding seh-TEH-lah dee-LAY - `perkiraan waktu` = estimated time; `boarding` = boarding.",
          "VN-speaker note: asking for `jam pasti` may be too strong when the schedule is uncertain. Use `perkiraan waktu`.",
          "Drill: `Perkiraan waktu boarding kapan?`",
        ],
      },
      {
        en: "Tolong beri tahu kalau ada perubahan gate lagi.",
        vi: "Vui lòng báo cho tôi nếu có thay đổi gate nữa.",
        pronunciation_focus: [
          "TO-long be-RI ta-HU KA-lau A-da pe-ru-BA-han geyt la-GI - `beri tahu` = báo/cho biết; `perubahan gate` = thay đổi cổng.",
          "Lỗi người Việt: dùng `kasih tahu` được trong nói thân mật; với nhân viên dùng `beri tahu` lịch sự hơn.",
          "Luyện: `Tolong beri tahu kalau ada perubahan.`",
        ],
        pronunciation_focus_en: [
          "TO-long beh-REE ta-HOO KA-lau A-da peh-roo-BA-han gate la-GEE - `beri tahu` = inform/tell; `perubahan gate` = gate change.",
          "VN-speaker note: `kasih tahu` is casual; with staff, `beri tahu` is more polite.",
          "Drill: `Tolong beri tahu kalau ada perubahan.`",
        ],
      },
      {
        en: "Saya takut ketinggalan penerbangan lanjutan di Jakarta.",
        vi: "Tôi sợ bị lỡ chuyến bay nối tiếp ở Jakarta.",
        pronunciation_focus: [
          "SA-ya TA-kut ke-ting-GAL-an pe-ner-BANG-an lan-JUT-an di Ja-KAR-ta - `ketinggalan` = bị lỡ; `penerbangan lanjutan` = chuyến bay nối tiếp.",
          "Lỗi người Việt: dùng `terlambat pesawat` cho lỡ chuyến. Tự nhiên hơn: `ketinggalan penerbangan`.",
          "Luyện: `Ketinggalan penerbangan lanjutan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya TA-koot keh-ting-GAL-an peh-ner-BANG-an lan-JOOT-an dee Ja-KAR-ta - `ketinggalan` = miss; `penerbangan lanjutan` = connecting flight.",
          "VN-speaker trap: using `terlambat pesawat` for missing a flight. More natural: `ketinggalan penerbangan`.",
          "Drill: `Ketinggalan penerbangan lanjutan.`",
        ],
      },
      {
        en: "Apakah maskapai menyediakan makanan atau voucher selama menunggu?",
        vi: "Hãng bay có cung cấp đồ ăn hoặc voucher trong lúc chờ không?",
        pronunciation_focus: [
          "a-PA-kah mas-ka-PAI me-nye-DI-a-kan ma-KA-nan A-tau VOU-cher se-LA-ma me-NUNG-gu - `maskapai` = hãng hàng không; `menyediakan` = cung cấp.",
          "Lỗi người Việt: nói `airline` trong câu Indonesia. Từ tự nhiên là `maskapai` hoặc `maskapai penerbangan`.",
          "Luyện: `Maskapai menyediakan voucher?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah mas-ka-PAI meh-nyeh-DEE-a-kan ma-KA-nan A-tau VOU-cher seh-LA-ma meh-NOONG-goo - `maskapai` = airline; `menyediakan` = provide.",
          "VN-speaker trap: saying English `airline` inside Indonesian. Natural terms are `maskapai` or `maskapai penerbangan`.",
          "Drill: `Maskapai menyediakan voucher?`",
        ],
      },
      {
        en: "Saya akan menunggu pengumuman berikutnya di dekat gate.",
        vi: "Tôi sẽ chờ thông báo tiếp theo gần gate.",
        pronunciation_focus: [
          "SA-ya A-kan me-NUNG-gu pe-ngu-MUM-an be-RI-kut-nya di de-KAT geyt - `pengumuman berikutnya` = thông báo tiếp theo; `di dekat` = ở gần.",
          "Lỗi người Việt: đi đến gate dùng `ke gate`, nhưng chờ ở gần gate dùng `di dekat gate`.",
          "Luyện: `Menunggu pengumuman berikutnya.`",
        ],
        pronunciation_focus_en: [
          "SA-ya A-kan meh-NOONG-goo peh-ngoo-MOOM-an beh-REE-koot-nya dee deh-KAT gate - `pengumuman berikutnya` = next announcement; `di dekat` = near/at nearby.",
          "VN-speaker trap: going to a gate uses `ke gate`, but waiting near a gate uses `di dekat gate`.",
          "Drill: `Menunggu pengumuman berikutnya.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở sân bay Indonesia, thông tin delay thường xuất hiện trên layar informasi, qua pengumuman bandara, hoặc tại gate. Khi hỏi nhân viên, hãy chuẩn bị nomor penerbangan, boarding pass, tujuan, và hỏi rõ soal ganti jadwal, bagasi, kompensasi, hoặc voucher. Quy định bồi thường có thể phụ thuộc hãng bay và nguyên nhân delay; bài này chỉ dạy ngôn ngữ thực tế.",
    cultural_notes_en:
      "At Indonesian airports, delay information usually appears on information screens, through airport announcements, or at the gate. When asking staff, prepare your flight number, boarding pass, destination, and ask clearly about rescheduling, baggage, compensation, or vouchers. Compensation rules can depend on the airline and the reason for delay; this lesson teaches practical language only.",
    tip_advice_vi:
      "Mẹo cho người Việt: dùng `penerbangan` cho chuyến bay, `pesawat` cho máy bay; `ke gate` khi đi tới cổng, `di gate` khi đang ở cổng. Khi chưa chắc giờ mới, hỏi `perkiraan waktu`, không ép `jam pasti`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: use `penerbangan` for the flight and `pesawat` for the aircraft; use `ke gate` when going to the gate and `di gate` when at the gate. When the new time is uncertain, ask for `perkiraan waktu`, not a guaranteed `jam pasti`.",
    vocabulary: [
      {
        cell_id: "e50be947-74b4-4546-8451-247933118372",
        word: "penerbangan domestik",
        en: "domestic flight",
        vi: "chuyến bay nội địa",
        pos: "noun phrase",
        pronunciation_vi: "pe-ner-BANG-an do-MES-tik",
        pronunciation_en: "peh-ner-BANG-an do-MES-tik",
      },
      {
        cell_id: "6024233a-3834-4aad-b829-c4b3f1721ec5",
        word: "delay",
        en: "delay",
        vi: "chậm/trễ chuyến",
        pos: "noun / verb",
        pronunciation_vi: "di-LEY",
        pronunciation_en: "dee-LAY",
      },
      {
        cell_id: "19b8277e-1c41-41e7-a234-c2b2afd530ca",
        word: "gate",
        en: "gate",
        vi: "cổng ra máy bay",
        pos: "noun",
        pronunciation_vi: "geyt",
        pronunciation_en: "gate",
      },
      {
        cell_id: "460ca09d-283a-4c9d-8381-bcfd09573422",
        word: "boarding pass",
        en: "boarding pass",
        vi: "thẻ lên máy bay",
        pos: "noun phrase",
        pronunciation_vi: "BOR-ding pas",
        pronunciation_en: "BOR-ding pass",
      },
      {
        cell_id: "5f67b8b7-9175-456e-a061-45ecb1f5140c",
        word: "bagasi",
        en: "checked baggage",
        vi: "hành lý ký gửi",
        pos: "noun",
        pronunciation_vi: "ba-GA-si",
        pronunciation_en: "ba-GA-see",
      },
      {
        cell_id: "80e4390c-f4e5-4b23-9d9c-8ed2598349ad",
        word: "kompensasi",
        en: "compensation",
        vi: "bồi thường/hỗ trợ",
        pos: "noun",
        pronunciation_vi: "kom-pen-SA-si",
        pronunciation_en: "kom-pen-SA-see",
      },
      {
        cell_id: "55eec4a0-64fe-4d4c-80c4-b9ece6390003",
        word: "ganti jadwal",
        en: "reschedule",
        vi: "đổi lịch",
        pos: "verb phrase",
        pronunciation_vi: "GAN-ti JAD-wal",
        pronunciation_en: "GAN-tee JAD-wal",
      },
      {
        cell_id: "3f00943c-89fa-4abe-918b-b096009a469f",
        word: "pengumuman bandara",
        en: "airport announcement",
        vi: "thông báo sân bay",
        pos: "noun phrase",
        pronunciation_vi: "pe-ngu-MUM-an ban-DA-ra",
        pronunciation_en: "peh-ngoo-MOOM-an ban-DA-ra",
      },
      {
        cell_id: "1f55fcf3-27db-49d6-ac98-6d31a282ef81",
        word: "maskapai",
        en: "airline",
        vi: "hãng hàng không",
        pos: "noun",
        pronunciation_vi: "mas-ka-PAI",
        pronunciation_en: "mas-ka-PAI",
      },
      {
        cell_id: "f05a7bf3-9f7d-4671-8859-d9c534f9d506",
        word: "penerbangan lanjutan",
        en: "connecting flight",
        vi: "chuyến bay nối tiếp",
        pos: "noun phrase",
        pronunciation_vi: "pe-ner-BANG-an lan-JUT-an",
        pronunciation_en: "peh-ner-BANG-an lan-JOOT-an",
      },
    ],
    dialogue: [
      {
        cell_id: "d6d0db93-9cf6-4796-bda9-33bedf4c67fb",
        speaker: "Penumpang",
        text: "Permisi, penerbangan domestik saya ke Surabaya mengalami delay. Gate-nya masih sama?",
        vi: "Xin lỗi, chuyến bay nội địa của tôi đi Surabaya bị delay. Gate vẫn như cũ không?",
        en: "Excuse me, my domestic flight to Surabaya is delayed. Is the gate still the same?",
      },
      {
        cell_id: "38f773c6-1f4d-4936-83aa-010a1ebb8eef",
        speaker: "Petugas Maskapai",
        text: "Gate berubah ke gate lima. Silakan tunggu pengumuman berikutnya.",
        vi: "Gate đổi sang gate 5. Vui lòng chờ thông báo tiếp theo.",
        en: "The gate has changed to gate five. Please wait for the next announcement.",
      },
      {
        cell_id: "eac92ab2-335f-4e51-828c-f77dcd2eee21",
        speaker: "Penumpang",
        text: "Apakah saya bisa ganti jadwal? Saya takut ketinggalan penerbangan lanjutan.",
        vi: "Tôi có thể đổi lịch không? Tôi sợ lỡ chuyến bay nối tiếp.",
        en: "Can I reschedule? I am afraid of missing my connecting flight.",
      },
      {
        cell_id: "c690b512-9bb9-48f5-b412-de4693da4e2a",
        speaker: "Petugas Maskapai",
        text: "Bisa kami cek. Tolong tunjukkan boarding pass dan nomor penerbangan.",
        vi: "Chúng tôi có thể kiểm tra. Vui lòng cho xem boarding pass và số chuyến bay.",
        en: "We can check. Please show your boarding pass and flight number.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: “Chuyến bay của tôi bị delay.”",
        prompt_en: "Translate into Indonesian: “My flight is delayed.”",
        answer: "Penerbangan saya mengalami delay.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ còn thiếu: Boarding pass saya masih ____?",
        prompt_en: "Fill in the blank: Boarding pass saya masih ____?",
        answer: "berlaku",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Cụm nào nghĩa là “đổi lịch”?",
        prompt_en: "Which phrase means “reschedule”?",
        choices: ["ganti jadwal", "ambil bagasi", "tunggu gate"],
        answer: "ganti jadwal",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `penerbangan lanjutan` = ?",
        prompt_en: "Match the meaning: `penerbangan lanjutan` = ?",
        answer: "connecting flight",
      },
    ],
  },
];

export default lessons;
