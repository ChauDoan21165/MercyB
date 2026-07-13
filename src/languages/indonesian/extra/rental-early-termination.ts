// Rental Early Termination Indonesian (Vietnamese -> Indonesian study track).
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

// Loosely typed so per-type fields (translation, fill-blank, matching) can vary.
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
    id: "indonesian_rental_early_termination",
    level: "B1",
    category: "housing",
    title_vi: "Chấm dứt hợp đồng thuê sớm",
    title_en: "Ending a rental contract early",
    sentences: [
      {
        en: "Saya ingin putus kontrak sewa lebih awal.",
        vi: "Tôi muốn chấm dứt hợp đồng thuê sớm hơn.",
        pronunciation_focus: [
          "SA-ya I-ngin PU-tus KON-trak SE-wa le-BIH A-wal — `putus kontrak` = chấm dứt hợp đồng.",
          "Lỗi người Việt: nói `break contract` lẫn tiếng Anh. Trong Indonesia, `putus kontrak` atau `mengakhiri kontrak` lebih natural.",
          "Luyện: `Saya ingin putus kontrak sewa.`",
        ],
        pronunciation_focus_en: [
          "SAH-yah EE-ngin POO-toos KON-trak SEH-wah leh-BEE AH-wahl — `putus kontrak` = end the contract.",
          "VN-speaker trap: mixing English `break contract`. In Indonesian, `putus kontrak` or `mengakhiri kontrak` is more natural.",
          "Drill: `Saya ingin putus kontrak sewa.`",
        ],
      },
      {
        en: "Apakah saya bisa keluar lebih awal dari rumah ini?",
        vi: "Tôi có thể chuyển ra sớm hơn khỏi nhà này không?",
        pronunciation_focus: [
          "A-pa-kah SA-ya BI-sa ke-LU-ar le-BIH A-wal da-ri RU-mah I-ni — `keluar lebih awal` = chuyển ra sớm.",
          "Lưu ý: `keluar` di sini berarti pindah keluar dari rumah/sewa, bukan keluar jalan-jalan.",
          "Lỗi người Việt: dùng `go out` theo tiếng Anh. Trong konteks thuê nhà, `keluar` atau `pindah keluar` lebih tepat.",
          "Luyện: `Bisa keluar lebih awal?`",
        ],
        pronunciation_focus_en: [
          "AH-pah-kah SAH-yah BEE-sah keh-LOO-ar leh-BEE AH-wahl dah-ree ROO-mah EE-nee — `keluar lebih awal` = move out early.",
          "Note: `keluar` here means moving out of the rental, not going out for a trip.",
          "VN-speaker trap: using English `go out`. In a rental context, `keluar` or `pindah keluar` is more accurate.",
          "Drill: `Bisa keluar lebih awal?`",
        ],
      },
      {
        en: "Saya perlu memberi pemberitahuan dulu.",
        vi: "Tôi cần báo trước đã.",
        pronunciation_focus: [
          "SA-ya per-LU mem-be-RI pem-be-ri-TA-hu-an DU-lu — `pemberitahuan` = thông báo.",
          "`memberi pemberitahuan` = gửi thông báo/báo trước; đây là cách nói formal yang aman.",
          "Lỗi người Việt: dùng `kasih tahu` dalam surat resmi. Dengan pemilik rumah, `memberi pemberitahuan` lebih rapi.",
          "Luyện: `Saya perlu memberi pemberitahuan.`",
        ],
        pronunciation_focus_en: [
          "SAH-yah per-LOO مم? mem-be-REE pem-be-ree-TAH-hoo-an DOO-loo — `pemberitahuan` = notice / notification.",
          "`memberi pemberitahuan` = to give notice / inform ahead; a safe formal wording.",
          "VN-speaker trap: using casual `kasih tahu` in an official message. With a landlord, `memberi pemberitahuan` is neater.",
          "Drill: `Saya perlu memberi pemberitahuan.`",
        ],
      },
      {
        en: "Berapa lama pemberitahuan yang dibutuhkan?",
        vi: "Cần báo trước bao lâu?",
        pronunciation_focus: [
          "be-RA-pa LA-ma pem-be-ri-TA-hu-an yang di-bu-TUH-kan — `dibutuhkan` = được cần/yêu cầu.",
          "Lỗi người Việt: nói `berapa lama notice` lẫn tiếng Anh. Câu Indonesia chuẩn là `pemberitahuan yang dibutuhkan`.",
          "Luyện: `Pemberitahuan yang dibutuhkan berapa lama?`",
        ],
        pronunciation_focus_en: [
          "beh-RAH-pah LAH-mah pem-be-ree-TAH-hoo-an yang dee-boo-TOO-kan — `dibutuhkan` = required/needed.",
          "VN-speaker trap: mixing in `notice`. The standard Indonesian question is `pemberitahuan yang dibutuhkan`.",
          "Drill: `Pemberitahuan yang dibutuhkan berapa lama?`",
        ],
      },
      {
        en: "Alasan pindah saya karena kerja di kota lain.",
        vi: "Lý do tôi chuyển đi là vì làm việc ở thành phố khác.",
        pronunciation_focus: [
          "a-LA-san PIN-dah SA-ya ka-RE-na KER-ja di KO-ta LA-in — `alasan pindah` = lý do chuyển đi.",
          "`karena` = vì/bởi vì; dùng alasan sederhana lebih meyakinkan daripada cerita panjang.",
          "Lỗi người Việt: quên `karena` lalu câu nghe như mệnh đề cụt. `Karena kerja di kota lain` rất rõ.",
          "Luyện: `Saya pindah karena kerja di kota lain.`",
        ],
        pronunciation_focus_en: [
          "ah-LAH-san PEEN-dah SAH-yah kah-REH-nah KER-jah dee KOH-tah LYEEN — `alasan pindah` = reason for moving.",
          "`karena` = because; a simple reason sounds more convincing than a long story.",
          "VN-speaker trap: forgetting `karena` and leaving the sentence hanging. `Karena kerja di kota lain` is clear.",
          "Drill: `Saya pindah karena kerja di kota lain.`",
        ],
      },
      {
        en: "Saya siap membayar denda kalau memang ada.",
        vi: "Tôi sẵn sàng trả tiền phạt nếu thật sự có.",
        pronunciation_focus: [
          "SA-ya si-AP mem-ba-YAR DEN-da KA-lau me-MANG A-da — `denda` = tiền phạt.",
          "`kalau memang ada` = nếu thực sự có; câu này aman saat menanyakan penalti tanpa terdengar menantang.",
          "Lỗi người Việt: nói `fine money` hoặc `penalty fee` camp tiếng Anh. `Denda` là từ chuẩn.",
          "Luyện: `Saya siap bayar denda.`",
        ],
        pronunciation_focus_en: [
          "SAH-yah see-AP mem-ba-YAR DEN-dah KAH-low me-MANG AH-dah — `denda` = fine/penalty.",
          "`kalau memang ada` = if there really is one; a safe way to ask about penalties without sounding confrontational.",
          "VN-speaker trap: mixing `fine money` or `penalty fee`. `Denda` is the standard word.",
          "Drill: `Saya siap bayar denda.`",
        ],
      },
      {
        en: "Apakah deposit saya bisa dikembalikan sebagian?",
        vi: "Tiền cọc của tôi có thể được hoàn một phần không?",
        pronunciation_focus: [
          "A-pa-kah de-po-SIT SA-ya BI-sa di-kem-ba-LI-kan se-ba-GI-an — `deposit` = tiền cọc; `sebagian` = một phần.",
          "`dikembalikan` = được trả lại; thể bị động sangat umum dalam topik uang dan sewa.",
          "Lỗi người Việt: dùng `refund` lẫn tiếng Anh. Với cọc, `dikembalikan` là tự nhiên nhất.",
          "Luyện: `Deposit saya bisa dikembalikan?`",
        ],
        pronunciation_focus_en: [
          "AH-pah-kah deh-po-SIT SAH-yah BEE-sah dee-kehm-bah-LEE-kahn seh-bah-GEE-an — `deposit` = security deposit; `sebagian` = part of it.",
          "`dikembalikan` = returned; passive voice is very common in money and rental topics.",
          "VN-speaker trap: using English `refund`. For deposits, `dikembalikan` is the most natural.",
          "Drill: `Deposit saya bisa dikembalikan?`",
        ],
      },
      {
        en: "Kalau keluar lebih awal, apakah ada potongan deposit?",
        vi: "Nếu chuyển ra sớm, có bị trừ tiền cọc không?",
        pronunciation_focus: [
          "KA-lau ke-LU-ar le-BIH A-wal, A-pa-kah A-da po-TONG-an de-po-SIT — `potongan deposit` = khoản trừ từ tiền cọc.",
          "Lỗi người Việt: hỏi `discount deposit`. Trong konteks sewa, pakai `potongan` atau `dipotong dari deposit`.",
          "Luyện: `Ada potongan deposit?`",
        ],
        pronunciation_focus_en: [
          "KAH-low keh-LOO-ar leh-BEE AH-wahl, AH-pah-kah AH-dah poh-TONG-an deh-po-SIT — `potongan deposit` = deduction from the deposit.",
          "VN-speaker trap: saying `discount deposit`. In rentals, use `potongan` or `dipotong dari deposit`.",
          "Drill: `Ada potongan deposit?`",
        ],
      },
      {
        en: "Kita sebaiknya buat kesepakatan tertulis.",
        vi: "Tốt nhất là chúng ta nên lập thỏa thuận bằng văn bản.",
        pronunciation_focus: [
          "KI-ta se-baiK-nya bu-at ke-se-pa-KAT-an ter-TU-lis — `kesepakatan tertulis` = thỏa thuận bằng văn bản.",
          "`sebaiknya` = tốt nhất nên; nghe lebih lembut daripada `harus`.",
          "Lỗi người Việt: chỉ nói `janji ya`. Dalam sewa rumah, tulisan penting để tránh salah paham.",
          "Luyện: `Buat kesepakatan tertulis.`",
        ],
        pronunciation_focus_en: [
          "KEE-tah seh-BYKE-nyah boo-at keh-seh-pah-KAH-tan ter-TOO-lees — `kesepakatan tertulis` = written agreement.",
          "`sebaiknya` = it would be best to; softer than `harus`.",
          "VN-speaker trap: saying just `janji ya`. In rentals, writing it down helps prevent misunderstandings.",
          "Drill: `Buat kesepakatan tertulis.`",
        ],
      },
      {
        en: "Mohon kirim aturan pindah keluar lewat chat.",
        vi: "Xin hãy gửi quy định chuyển ra qua chat.",
        pronunciation_focus: [
          "MO-hon KI-rim a-TU-ran PIN-dah ke-LU-ar le-WAT chat — `aturan` = quy định; `lewat chat` = qua chat.",
          "`mohon kirim` là câu mở mềm cho permintaan resmi hoặc semi-formal.",
          "Lỗi người Việt: viết dài quá. Với aturan sewa, một câu ngắn rõ là đủ.",
          "Luyện: `Mohon kirim aturan pindah keluar.`",
        ],
        pronunciation_focus_en: [
          "MOH-hon KEE-rim ah-TOO-ran PEEN-dah keh-LOO-ar leh-WAHT chat — `aturan` = rules; `lewat chat` = via chat.",
          "`mohon kirim` is a soft opening for formal or semi-formal requests.",
          "VN-speaker trap: overlong messages. For rental rules, a short and clear sentence is enough.",
          "Drill: `Mohon kirim aturan pindah keluar.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, việc keluar lebih awal dari kontrakan thường cần melihat isi kontrak: pemberitahuan, denda, dan aturan deposit. Nhiều chủ rumah muốn ada kesepakatan tertulis atau chat yang jelas agar kedua pihak sama-sama aman. Gaya nói lịch sự như `mohon`, `apakah bisa`, `sebaiknya`, dan `kalau memang ada` rất quan trọng để giữ hubungan baik, nhất là khi Anda phải pindah karena pekerjaan, keluarga, atau alasan darurat.",
    cultural_notes_en:
      "In Indonesia, moving out early from a rental usually depends on the contract: notice, penalties, and deposit rules. Many landlords want a written agreement or a clear chat record so both sides are protected. Polite wording like `mohon`, `apakah bisa`, `sebaiknya`, and `kalau memang ada` is important to preserve good relations, especially when you must move for work, family, or an emergency.",
    tip_advice_vi:
      "Mẹo cho người Việt: dùng đúng cặp từ `keluar lebih awal`, `pemberitahuan`, `denda`, `deposit dikembalikan`, `kesepakatan tertulis`. Nếu muốn mềm, thêm `mohon` hoặc `kalau memang ada` để câu không nghe đối đầu.",
    tip_advice_en:
      "Tip for Vietnamese speakers: use the right chunks `keluar lebih awal`, `pemberitahuan`, `denda`, `deposit dikembalikan`, `kesepakatan tertulis`. If you want a softer tone, add `mohon` or `kalau memang ada` so the sentence does not sound confrontational.",
    vocabulary: [
      {
        cell_id: "716508e5-1e2e-4151-8f07-fad0f81fade1",
        word: "putus kontrak",
        en: "end a contract",
        vi: "chấm dứt hợp đồng",
        pos: "verb phrase",
        pronunciation_vi: "PU-tus KON-trak",
        pronunciation_en: "POO-toos KON-trak",
      },
      {
        cell_id: "9177ea25-6e6c-4bdb-a91d-b4310c92717f",
        word: "keluar lebih awal",
        en: "move out early",
        vi: "chuyển ra sớm",
        pos: "phrase",
        pronunciation_vi: "ke-LU-ar le-BIH A-wal",
        pronunciation_en: "keh-LOO-ar leh-BEE AH-wahl",
      },
      {
        cell_id: "1c7485de-16da-4a1e-b43b-03cbe65139c5",
        word: "pemberitahuan",
        en: "notice / notification",
        vi: "thông báo, báo trước",
        pos: "noun",
        pronunciation_vi: "pem-be-ri-TA-hu-an",
        pronunciation_en: "pem-be-ree-TAH-hoo-an",
      },
      {
        cell_id: "aa46a9ba-b3b3-4e3a-9555-6bdde88f3577",
        word: "alasan pindah",
        en: "reason for moving",
        vi: "lý do chuyển đi",
        pos: "noun phrase",
        pronunciation_vi: "a-LA-san PIN-dah",
        pronunciation_en: "ah-LAH-san PEEN-dah",
      },
      {
        cell_id: "997b9d81-b6d8-4783-b335-9604e32d73a2",
        word: "denda",
        en: "fine / penalty",
        vi: "tiền phạt",
        pos: "noun",
        pronunciation_vi: "DEN-da",
        pronunciation_en: "DEN-dah",
      },
      {
        cell_id: "6ffaf499-7a21-48c7-b6e6-4113eed88ffd",
        word: "deposit",
        en: "security deposit",
        vi: "tiền cọc",
        pos: "noun",
        pronunciation_vi: "de-po-SIT",
        pronunciation_en: "deh-po-SIT",
      },
      {
        cell_id: "9e90eb51-fc65-476e-88a7-f8e203d3a5a1",
        word: "kesepakatan tertulis",
        en: "written agreement",
        vi: "thỏa thuận bằng văn bản",
        pos: "noun phrase",
        pronunciation_vi: "ke-se-pa-KAT-an ter-TU-lis",
        pronunciation_en: "keh-seh-pah-KAH-tan ter-TOO-lees",
      },
      {
        cell_id: "1c965143-e3df-44b3-824c-1dc4a23d7829",
        word: "potongan deposit",
        en: "deduction from the deposit",
        vi: "khoản trừ từ tiền cọc",
        pos: "noun phrase",
        pronunciation_vi: "po-TONG-an de-po-SIT",
        pronunciation_en: "poh-TONG-an deh-po-SIT",
      },
    ],
    dialogue: [
      {
        cell_id: "9d9592c9-521f-42bf-b916-61f7e124ca75",
        speaker: "Penyewa",
        text: "Pak, saya ingin putus kontrak sewa lebih awal.",
        vi: "Anh/chú ơi, tôi muốn chấm dứt hợp đồng thuê sớm hơn.",
        en: "Sir, I want to end the rental contract early.",
      },
      {
        cell_id: "f1ea64bb-94b4-4b62-8720-71b21a79d525",
        speaker: "Pemilik Rumah",
        text: "Boleh. Apa alasan pindahnya?",
        vi: "Được. Lý do chuyển đi là gì?",
        en: "Okay. What is the reason for moving?",
      },
      {
        cell_id: "d8aa54e9-79f7-48d6-9e7f-7b76df49e3a3",
        speaker: "Penyewa",
        text: "Saya pindah karena kerja di kota lain.",
        vi: "Tôi chuyển đi vì làm việc ở thành phố khác.",
        en: "I am moving because I work in another city.",
      },
      {
        cell_id: "c588a052-8d7e-47c6-9618-43b29a540298",
        speaker: "Pemilik Rumah",
        text: "Baik. Kita lihat aturan pemberitahuan dan deposit dulu.",
        vi: "Được. Chúng ta xem quy định thông báo và tiền cọc trước đã.",
        en: "Okay. Let us check the notice and deposit rules first.",
      },
      {
        cell_id: "4b15d08b-45d4-468e-b838-6c745df9bcb3",
        speaker: "Penyewa",
        text: "Kalau ada denda, mohon kirim kesepakatan tertulisnya.",
        vi: "Nếu có tiền phạt, xin hãy gửi thỏa thuận bằng văn bản.",
        en: "If there is a penalty, please send the written agreement.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya ingin putus ___ sewa lebih awal.`",
        prompt_en: "Fill in: `Saya ingin putus ___ sewa lebih awal.`",
        answer: "kontrak",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Tôi cần báo trước đã.",
        prompt_en: "Translate to Indonesian: I need to give notice first.",
        answer: "Saya perlu memberi pemberitahuan dulu.",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Tiền cọc của tôi có thể được hoàn một phần không?",
        prompt_en: "Translate to Indonesian: Can my deposit be returned partially?",
        answer: "Apakah deposit saya bisa dikembalikan sebagian?",
      },
      {
        type: "choose_best_phrase",
        prompt_vi: "Chọn cụm tự nhiên nhất cho 'thỏa thuận bằng văn bản'.",
        prompt_en: "Choose the most natural phrase for 'written agreement'.",
        options: ["kesepakatan tertulis", "janji kertas", "kontrak lisan"],
        answer: "kesepakatan tertulis",
      },
      {
        type: "roleplay",
        prompt_vi: "Đóng vai: bạn muốn xin chuyển ra sớm và hỏi về tiền cọc.",
        prompt_en: "Roleplay: you want to move out early and ask about the deposit.",
        answer: "Saya ingin putus kontrak sewa lebih awal. Apakah deposit saya bisa dikembalikan sebagian?",
      },
    ],
  },
];

