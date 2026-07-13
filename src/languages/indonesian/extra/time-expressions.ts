// src/languages/indonesian/extra/time-expressions.ts
//
// Indonesian time & aspect pack for Vietnamese learners.
// Covers: time-when words (tadi, nanti, kemarin, besok, lusa), aspect markers
// (sudah, belum, sedang/lagi, akan, masih, baru), and combining/nuance
// (sudah vs telah, belum vs tidak, baru saja, sebentar lagi). Hand-crafted,
// no filler.
//
// Pedagogical core: Indonesian verbs DON'T conjugate for tense — time and aspect
// ride entirely on these adverbs/particles. This maps almost 1:1 onto the
// Vietnamese system (đã = sudah, đang = sedang, sẽ = akan, rồi = sudah, chưa =
// belum, vẫn = masih, vừa = baru), which is a huge head start for VN learners —
// the L1 notes lean on it throughout.
//
// Shape mirrors the named template src/languages/portuguese/lessons-a1.ts so the
// page UI stays consistent across language verticals. The types are defined
// inline because the per-file shapes diverge slightly between authoring waves —
// this file is self-contained on purpose. Types are NOT exported and the lesson
// array uses a unique name so a future barrel `export *` cannot collide with the
// sibling extra packs.
//
// Field convention (inherited from the Portuguese pack): a sentence's `en` slot
// holds the TARGET-LANGUAGE text (here: Indonesian), `vi` holds the Vietnamese
// gloss. `pronunciation_focus` carries Vietnamese-facing pronunciation/grammar
// notes (incl. the common Vietnamese-speaker mistake = L1 note);
// `pronunciation_focus_en` is the English-speaker companion, same length + order.
//
// Indonesian uses the Latin alphabet — no special script rendering needed.

type LessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

type DialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields (fill_blank, matching, translation) vary.
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
};

export const timeExpressionsLessons: IndonesianLesson[] = [
  {
    id: "indonesian_time_when_words",
    level: "A1",
    category: "grammar",
    title_vi: "Từ chỉ thời điểm — tadi, nanti, kemarin, besok, lusa",
    title_en: "Time-when words — tadi, nanti, kemarin, besok, lusa",
    sentences: [
      {
        en: "Tadi pagi saya minum kopi.",
        vi: "Lúc sáng nãy tôi uống cà phê.",
        pronunciation_focus: [
          "tadi → TA-di, 'lúc nãy/hồi nãy' (quá khứ gần trong NGÀY hôm nay)",
          "tadi pagi → 'sáng nay (đã qua)'; động từ KHÔNG đổi, chỉ thêm 'tadi'",
          "minum → MI-num, 'uống'",
        ],
        pronunciation_focus_en: [
          "tadi → 'TA-dee' — earlier (recent past, still WITHIN today)",
          "tadi pagi → 'this (past) morning'; the verb does NOT change, just add 'tadi'",
          "minum → 'MEE-noom' — to drink",
        ],
      },
      {
        en: "Nanti malam kita makan di luar.",
        vi: "Tối nay (lát nữa) mình ăn ngoài.",
        pronunciation_focus: [
          "nanti → NAN-ti, 'lát nữa/sau này' (tương lai gần trong ngày)",
          "nanti malam → 'tối nay (chưa tới)'",
          "L1 note: 'tadi' (đã qua) ↔ 'nanti' (sắp tới) — cặp đối, cùng trong ngày",
        ],
        pronunciation_focus_en: [
          "nanti → 'NAN-tee' — later (near future, still within today)",
          "nanti malam → 'tonight (yet to come)'",
          "note: 'tadi' (past) ↔ 'nanti' (future) — a pair, both within today",
        ],
      },
      {
        en: "Kemarin saya tidak masuk kerja.",
        vi: "Hôm qua tôi không đi làm.",
        pronunciation_focus: [
          "kemarin → keu-MA-rin, 'hôm qua'",
          "tidak masuk kerja → 'không đi làm' (masuk = vào, kerja = làm việc)",
          "kemarin dulu → 'hôm kia' (mở rộng)",
        ],
        pronunciation_focus_en: [
          "kemarin → 'ke-MA-rin' — yesterday",
          "tidak masuk kerja → 'didn't go to work' (masuk = enter, kerja = work)",
          "kemarin dulu → 'the day before yesterday' (extension)",
        ],
      },
      {
        en: "Besok saya akan ke dokter.",
        vi: "Ngày mai tôi sẽ đi khám bác sĩ.",
        pronunciation_focus: [
          "besok → BÉ-sok, 'ngày mai'",
          "akan → A-kan, 'sẽ' (báo hiệu tương lai)",
          "L1 note: 'kemarin' (hôm qua) ↔ 'besok' (ngày mai) — cặp đối qua ngày",
        ],
        pronunciation_focus_en: [
          "besok → 'BEH-sok' — tomorrow",
          "akan → 'A-kan' — will (future marker)",
          "note: 'kemarin' (yesterday) ↔ 'besok' (tomorrow) — a day-spanning pair",
        ],
      },
      {
        en: "Lusa kami berangkat ke Bali.",
        vi: "Ngày kia chúng tôi khởi hành đi Bali.",
        pronunciation_focus: [
          "lusa → LU-sa, 'ngày kia' (sau ngày mai)",
          "kami → KA-mi, 'chúng tôi' (không gồm người nghe)",
          "berangkat → ber-ANG-kat, 'khởi hành'",
        ],
        pronunciation_focus_en: [
          "lusa → 'LOO-sa' — the day after tomorrow",
          "kami → 'KA-mee' — we (excluding the listener)",
          "berangkat → 'ber-ANG-kat' — to depart",
        ],
      },
    ],
    cultural_notes_vi:
      "Đây là điểm DỄ NHẤT của tiếng Indonesia với người Việt: động từ KHÔNG chia theo thì. Muốn nói quá khứ/tương lai, chỉ cần thêm một từ chỉ thời điểm — y hệt tiếng Việt. Trục thời gian: kemarin dulu (hôm kia) → kemarin (hôm qua) → hari ini (hôm nay) → besok (ngày mai) → lusa (ngày kia). Trong NGÀY: tadi (lúc nãy, đã qua) ↔ sekarang (bây giờ) ↔ nanti (lát nữa, sắp tới). 'Tadi' chỉ dùng cho việc đã xảy ra trong hôm nay; việc của hôm qua trở về trước dùng 'kemarin'.",
    cultural_notes_en:
      "This is the EASIEST part of Indonesian for Vietnamese speakers: verbs do NOT conjugate for tense. To mark past/future you just add a time word — exactly like Vietnamese. The day axis: kemarin dulu (day before yesterday) → kemarin (yesterday) → hari ini (today) → besok (tomorrow) → lusa (day after tomorrow). Within TODAY: tadi (earlier, past) ↔ sekarang (now) ↔ nanti (later, future). 'Tadi' only covers events earlier today; anything from yesterday back uses 'kemarin'.",
    tip_advice_vi:
      "Mẹo cho người Việt: ánh xạ trực tiếp — tadi ≈ 'lúc nãy', nanti ≈ 'lát nữa', kemarin = 'hôm qua', besok = 'ngày mai', lusa = 'ngày kia'. Vì không chia động từ, câu 'Saya makan' đứng một mình mơ hồ về thì — luôn thêm từ thời điểm khi cần rõ. Đừng nhầm 'tadi' (đã qua, trong ngày) với 'nanti' (sắp tới). Vị trí: từ thời điểm thường đứng ĐẦU câu hoặc ngay trước động từ.",
    tip_advice_en:
      "Tip for Vietnamese speakers: direct mapping — tadi ≈ 'just now', nanti ≈ 'later', kemarin = 'yesterday', besok = 'tomorrow', lusa = 'day after tomorrow'. Since verbs don't conjugate, 'Saya makan' alone is tense-ambiguous — always add a time word when you need precision. Don't mix up 'tadi' (past, within today) with 'nanti' (upcoming). Position: the time word usually goes at the START of the sentence or right before the verb.",
    vocabulary: [
      {
        cell_id: "8bbf5a4b-80a7-4f6e-b289-d131ee5d1495",
        word: "tadi",
        en: "earlier (today) / just now",
        vi: "lúc nãy / hồi nãy",
        pos: "time adverb",
        pronunciation_vi: "TA-di",
        pronunciation_en: "TA-dee",
      },
      {
        cell_id: "bc8ea4e1-4649-471c-8cd3-22dd3be05396",
        word: "nanti",
        en: "later (today)",
        vi: "lát nữa / sau này",
        pos: "time adverb",
        pronunciation_vi: "NAN-ti",
        pronunciation_en: "NAN-tee",
      },
      {
        cell_id: "a0567f6b-4482-4b2e-8f36-e3669097927d",
        word: "kemarin",
        en: "yesterday",
        vi: "hôm qua",
        pos: "time adverb",
        pronunciation_vi: "keu-MA-rin",
        pronunciation_en: "ke-MA-rin",
      },
      {
        cell_id: "ee27ed1f-ae47-41f1-b665-42cc12a6eebc",
        word: "besok",
        en: "tomorrow",
        vi: "ngày mai",
        pos: "time adverb",
        pronunciation_vi: "BÉ-sok",
        pronunciation_en: "BEH-sok",
      },
      {
        cell_id: "b489e23a-8f65-4ef4-ba37-4e4df7c300a6",
        word: "lusa",
        en: "day after tomorrow",
        vi: "ngày kia",
        pos: "time adverb",
        pronunciation_vi: "LU-sa",
        pronunciation_en: "LOO-sa",
      },
      {
        cell_id: "467d7ae8-586d-4a6c-9bf4-0673c98461b4",
        word: "sekarang",
        en: "now",
        vi: "bây giờ",
        pos: "time adverb",
        pronunciation_vi: "seu-KA-rang",
        pronunciation_en: "se-KA-rang",
      },
      {
        cell_id: "d404ce04-cbf7-4f62-a49b-b93cd41b9747",
        word: "hari ini",
        en: "today",
        vi: "hôm nay",
        pos: "time phrase",
        pronunciation_vi: "HA-ri I-ni",
        pronunciation_en: "HA-ree EE-nee",
      },
    ],
    dialogue: [
      {
        cell_id: "bac5bf91-47ce-4a03-bc91-8237918fcbae",
        speaker: "Lia",
        text: "Tadi pagi kamu ke mana? Saya cari kamu.",
        vi: "Sáng nãy bạn đi đâu vậy? Mình tìm bạn.",
        en: "Where did you go this morning? I was looking for you.",
      },
      {
        cell_id: "8a56d2de-06b7-4e30-a391-db92d91fb99d",
        speaker: "Tono",
        text: "Tadi saya ke pasar. Nanti sore saya ada di rumah.",
        vi: "Lúc nãy mình ra chợ. Chiều nay mình sẽ ở nhà.",
        en: "I went to the market earlier. I'll be home this afternoon.",
      },
      {
        cell_id: "8aad7a5e-34e4-46e2-bae2-3fd8500229ed",
        speaker: "Lia",
        text: "Oke. Kemarin kamu juga sibuk, ya?",
        vi: "Được. Hôm qua bạn cũng bận à?",
        en: "Okay. You were busy yesterday too, right?",
      },
      {
        cell_id: "100d3c14-fe41-4080-87a3-e5ecc6c0e7c9",
        speaker: "Tono",
        text: "Iya. Besok dan lusa juga, saya akan ke luar kota.",
        vi: "Ừ. Ngày mai và ngày kia nữa, mình sẽ đi ra ngoại tỉnh.",
        en: "Yeah. Tomorrow and the day after too, I'll be out of town.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ chỉ thời điểm còn thiếu:",
        instruction_en: "Fill in the missing time word:",
        items: [
          {
            prompt: "___ pagi saya minum kopi. (lúc nãy/hồi)",
            answer: "Tadi",
            options: ["Tadi", "Nanti", "Lusa"],
          },
          {
            prompt: "___ saya tidak masuk kerja. (hôm qua)",
            answer: "Kemarin",
            options: ["Kemarin", "Besok", "Sekarang"],
          },
          {
            prompt: "___ kami berangkat ke Bali. (ngày kia)",
            answer: "Lusa",
            options: ["Lusa", "Tadi", "Kemarin"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ thời điểm với nghĩa tiếng Việt:",
        instruction_en: "Match each time word with its Vietnamese meaning:",
        items: [
          { prompt: "tadi", answer: "lúc nãy" },
          { prompt: "nanti", answer: "lát nữa" },
          { prompt: "besok", answer: "ngày mai" },
          { prompt: "lusa", answer: "ngày kia" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Lúc sáng nãy tôi uống cà phê.", answer: "Tadi pagi saya minum kopi." },
          { prompt: "Hôm qua tôi không đi làm.", answer: "Kemarin saya tidak masuk kerja." },
          { prompt: "Ngày mai tôi sẽ đi khám bác sĩ.", answer: "Besok saya akan ke dokter." },
        ],
      },
    ],
  },
  {
    id: "indonesian_aspect_markers",
    level: "A2",
    category: "grammar",
    title_vi: "Trợ từ thể — sudah, belum, sedang, akan, masih, baru",
    title_en: "Aspect markers — sudah, belum, sedang, akan, masih, baru",
    sentences: [
      {
        en: "Saya sudah makan, terima kasih.",
        vi: "Tôi ăn rồi, cảm ơn.",
        pronunciation_focus: [
          "sudah → SU-dah, 'đã/rồi' (hành động đã hoàn thành)",
          "L1 note: sudah ≈ 'đã/rồi' của tiếng Việt — đặt TRƯỚC động từ",
          "Có thể đáp gọn 'Sudah.' = 'Rồi.'",
        ],
        pronunciation_focus_en: [
          "sudah → 'SOO-dah' — already/done (completed action)",
          "note: sudah ≈ Vietnamese 'đã/rồi' — placed BEFORE the verb",
          "Can answer curtly 'Sudah.' = 'Already (done).'",
        ],
      },
      {
        en: "Saya belum makan siang.",
        vi: "Tôi chưa ăn trưa.",
        pronunciation_focus: [
          "belum → beu-LUM, 'chưa' (chưa xảy ra, nhưng còn khả năng)",
          "L1 note: belum = 'chưa' — ĐỐI của 'sudah', KHÁC 'tidak' (không)",
          "Đáp gọn 'Belum.' = 'Chưa.'",
        ],
        pronunciation_focus_en: [
          "belum → 'be-LOOM' — not yet (hasn't happened, but still might)",
          "note: belum = 'not yet' — opposite of 'sudah', different from 'tidak' (not at all)",
          "Curt answer 'Belum.' = 'Not yet.'",
        ],
      },
      {
        en: "Adik sedang tidur di kamar.",
        vi: "Em (tôi) đang ngủ trong phòng.",
        pronunciation_focus: [
          "sedang → SEU-dang, 'đang' (hành động diễn ra lúc này)",
          "lagi → LA-gi, dạng đời thường của 'sedang' (= đang)",
          "L1 note: sedang/lagi ≈ 'đang' của tiếng Việt",
        ],
        pronunciation_focus_en: [
          "sedang → 'SE-dang' — -ing / in the middle of (action right now)",
          "lagi → 'LA-gee' — casual form of 'sedang' (= currently)",
          "note: sedang/lagi ≈ Vietnamese 'đang'",
        ],
      },
      {
        en: "Mereka masih menunggu bus.",
        vi: "Họ vẫn còn đợi xe buýt.",
        pronunciation_focus: [
          "masih → MA-sih, 'vẫn/vẫn còn' (tiếp tục, chưa dừng)",
          "menunggu → meu-NUNG-gu, 'chờ đợi' (gốc tunggu)",
          "L1 note: masih ≈ 'vẫn (còn)' của tiếng Việt",
        ],
        pronunciation_focus_en: [
          "masih → 'MA-seeh' — still (ongoing, not stopped)",
          "menunggu → 'me-NOONG-goo' — to wait (root 'tunggu')",
          "note: masih ≈ Vietnamese 'vẫn (còn)'",
        ],
      },
      {
        en: "Saya baru sampai di rumah.",
        vi: "Tôi vừa mới về đến nhà.",
        pronunciation_focus: [
          "baru → BA-ru, 'vừa mới' (việc xảy ra rất gần đây); cũng nghĩa 'mới (≠ cũ)'",
          "sampai → SAM-pai, 'đến nơi/tới'",
          "L1 note: baru (chỉ thời gian) ≈ 'vừa mới' của tiếng Việt",
        ],
        pronunciation_focus_en: [
          "baru → 'BA-roo' — just (very recent); also means 'new (≠ old)'",
          "sampai → 'SAM-pai' — to arrive",
          "note: baru (temporal) ≈ Vietnamese 'vừa mới'",
        ],
      },
    ],
    cultural_notes_vi:
      "Sáu trợ từ thể này thay cho việc 'chia thì' và gần như khớp 1:1 với tiếng Việt — đây là lý do người Việt học tiếng Indonesia rất nhanh ở điểm này: sudah = đã/rồi, belum = chưa, sedang/lagi = đang, akan = sẽ, masih = vẫn còn, baru = vừa mới. Tất cả đặt TRƯỚC động từ. Điều TỐI quan trọng: câu hỏi 'Sudah makan?' (Ăn chưa?) trả lời 'Sudah' (Rồi) hoặc 'Belum' (Chưa) — KHÔNG trả lời 'tidak'. 'Belum' để ngỏ khả năng sẽ làm; 'tidak' là phủ định dứt khoát.",
    cultural_notes_en:
      "These six aspect markers replace tense conjugation and line up almost 1:1 with Vietnamese — which is why VN speakers pick this up fast: sudah = already, belum = not yet, sedang/lagi = -ing, akan = will, masih = still, baru = just. All go BEFORE the verb. Crucially: the question 'Sudah makan?' (Have you eaten?) is answered 'Sudah' (Yes) or 'Belum' (Not yet) — NOT with 'tidak'. 'Belum' leaves the door open to doing it; 'tidak' is a flat negative.",
    tip_advice_vi:
      "Mẹo cho người Việt: học theo cặp Việt–Indo — đã/rồi=sudah, chưa=belum, đang=sedang(/lagi), sẽ=akan, vẫn=masih, vừa mới=baru. Vị trí cố định: [chủ ngữ] + [trợ từ] + [động từ]. LỖI KINH ĐIỂN: dùng 'tidak' để đáp 'Sudah…?' — phải là 'Belum'. 'lagi' (đang) chỉ dùng văn nói; văn viết/trang trọng dùng 'sedang'. 'baru' có hai nghĩa: 'vừa mới' (thời gian) và 'mới/≠ cũ' — phân biệt bằng ngữ cảnh.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn the VN–Indo pairs — đã/rồi=sudah, chưa=belum, đang=sedang(/lagi), sẽ=akan, vẫn=masih, vừa mới=baru. Fixed slot: [subject] + [marker] + [verb]. CLASSIC ERROR: answering 'Sudah…?' with 'tidak' — it must be 'Belum'. 'lagi' (currently) is speech-only; formal/written uses 'sedang'. 'baru' has two senses: 'just' (time) and 'new (≠ old)' — context disambiguates.",
    vocabulary: [
      {
        cell_id: "e5f18343-5fdb-4773-86eb-1b29ac6f2718",
        word: "sudah",
        en: "already / done",
        vi: "đã / rồi",
        pos: "aspect marker",
        pronunciation_vi: "SU-dah",
        pronunciation_en: "SOO-dah",
      },
      {
        cell_id: "8d754c5b-c09d-416c-b005-aad5af49ce5d",
        word: "belum",
        en: "not yet",
        vi: "chưa",
        pos: "aspect marker",
        pronunciation_vi: "beu-LUM",
        pronunciation_en: "be-LOOM",
      },
      {
        cell_id: "7db760c0-fed1-434c-b675-289d8b0430ef",
        word: "sedang",
        en: "in the middle of / -ing",
        vi: "đang",
        pos: "aspect marker",
        pronunciation_vi: "SEU-dang",
        pronunciation_en: "SE-dang",
      },
      {
        cell_id: "8c638c23-8a77-4826-b060-2635983395e3",
        word: "akan",
        en: "will (future)",
        vi: "sẽ",
        pos: "aspect marker",
        pronunciation_vi: "A-kan",
        pronunciation_en: "A-kan",
      },
      {
        cell_id: "72494607-5bc5-4b2f-8f05-982086441d17",
        word: "masih",
        en: "still",
        vi: "vẫn còn",
        pos: "aspect marker",
        pronunciation_vi: "MA-sih",
        pronunciation_en: "MA-seeh",
      },
      {
        cell_id: "514f3061-27d4-4695-a920-60c68cbafad9",
        word: "baru",
        en: "just (recently) / new",
        vi: "vừa mới / mới",
        pos: "aspect marker / adjective",
        pronunciation_vi: "BA-ru",
        pronunciation_en: "BA-roo",
      },
      {
        cell_id: "86e0b4ba-e9c9-43bc-b547-cfc99d167e1f",
        word: "lagi",
        en: "currently (casual = sedang) / again",
        vi: "đang (đời thường) / lại",
        pos: "aspect marker",
        pronunciation_vi: "LA-gi",
        pronunciation_en: "LA-gee",
      },
    ],
    dialogue: [
      {
        cell_id: "f0bc4f19-70a2-44d4-aec4-c620a1cf29aa",
        speaker: "Ibu",
        text: "Kamu sudah makan siang?",
        vi: "Con ăn trưa chưa?",
        en: "Have you had lunch?",
      },
      {
        cell_id: "2ad512fe-7f37-4386-9c6a-fe8f76543347",
        speaker: "Anak",
        text: "Belum, Bu. Saya masih mengerjakan tugas.",
        vi: "Chưa ạ. Con vẫn còn làm bài tập.",
        en: "Not yet, Mom. I'm still doing my homework.",
      },
      {
        cell_id: "74ac7fa8-681a-4d19-8194-18d0b3711694",
        speaker: "Ibu",
        text: "Adikmu sedang apa?",
        vi: "Em con đang làm gì?",
        en: "What's your little sibling doing?",
      },
      {
        cell_id: "54fe96c3-14ac-45d8-85af-bcf21c8c60eb",
        speaker: "Anak",
        text: "Dia lagi tidur. Nanti saya akan makan setelah selesai. Eh, Ayah baru pulang.",
        vi: "Em đang ngủ. Lát nữa làm xong con sẽ ăn. À, bố vừa về.",
        en: "They're sleeping. I'll eat later once I'm done. Oh, Dad just got home.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền trợ từ thể còn thiếu:",
        instruction_en: "Fill in the missing aspect marker:",
        items: [
          {
            prompt: "Saya ___ makan, terima kasih. (đã/rồi)",
            answer: "sudah",
            options: ["sudah", "belum", "akan"],
          },
          {
            prompt: "Mereka ___ menunggu bus. (vẫn còn)",
            answer: "masih",
            options: ["masih", "sudah", "baru"],
          },
          {
            prompt: "Adik ___ tidur di kamar. (đang)",
            answer: "sedang",
            options: ["sedang", "akan", "belum"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối trợ từ với từ tương ứng trong tiếng Việt:",
        instruction_en: "Match each marker with its Vietnamese equivalent:",
        items: [
          { prompt: "sudah", answer: "đã / rồi" },
          { prompt: "belum", answer: "chưa" },
          { prompt: "akan", answer: "sẽ" },
          { prompt: "baru", answer: "vừa mới" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi chưa ăn trưa.", answer: "Saya belum makan siang." },
          { prompt: "Họ vẫn còn đợi xe buýt.", answer: "Mereka masih menunggu bus." },
          { prompt: "Tôi vừa mới về đến nhà.", answer: "Saya baru sampai di rumah." },
        ],
      },
    ],
  },
  {
    id: "indonesian_time_aspect_nuance",
    level: "B1",
    category: "grammar",
    title_vi: "Sắc thái thời gian — sudah/telah, belum/tidak, baru saja, sebentar lagi",
    title_en: "Time nuance — sudah/telah, belum/tidak, baru saja, sebentar lagi",
    sentences: [
      {
        en: "Rapat telah dimulai pukul sembilan tadi.",
        vi: "Cuộc họp đã bắt đầu lúc chín giờ (sáng nãy).",
        pronunciation_focus: [
          "telah → TEU-lah, 'đã' — trang trọng hơn 'sudah', hay gặp trong văn viết/tin tức",
          "dimulai → 'được bắt đầu' (di- + mulai)",
          "L1 note: telah = sudah về nghĩa, nhưng telah trang trọng hơn",
        ],
        pronunciation_focus_en: [
          "telah → 'TE-lah' — 'have/has' — more formal than 'sudah', common in writing/news",
          "dimulai → 'be started' (di- + mulai)",
          "note: telah = sudah in meaning, but telah is more formal",
        ],
      },
      {
        en: "Saya tidak suka kopi, jadi tidak minum.",
        vi: "Tôi không thích cà phê, nên không uống.",
        pronunciation_focus: [
          "tidak → TI-dak, 'không' — phủ định dứt khoát (không phải 'chưa')",
          "L1 note: 'tidak minum' = không uống (không bao giờ/không hề), KHÁC 'belum minum' = chưa uống (sẽ có thể)",
          "jadi → JA-di, 'nên/vậy nên'",
        ],
        pronunciation_focus_en: [
          "tidak → 'TEE-dak' — 'not' — a flat negative (not 'not yet')",
          "note: 'tidak minum' = doesn't drink (never/at all), vs 'belum minum' = hasn't drunk yet (might still)",
          "jadi → 'JA-dee' — so/therefore",
        ],
      },
      {
        en: "Dia baru saja pergi, mungkin masih dekat.",
        vi: "Cậu ấy vừa mới đi, có lẽ vẫn còn gần đây.",
        pronunciation_focus: [
          "baru saja → 'vừa mới (ngay lúc nãy)' — nhấn mạnh hơn 'baru' đơn",
          "mungkin → MUNG-kin, 'có lẽ/có thể'",
          "masih dekat → 'vẫn còn gần' (masih = vẫn)",
        ],
        pronunciation_focus_en: [
          "baru saja → 'just now (a moment ago)' — stronger than bare 'baru'",
          "mungkin → 'MOONG-kin' — maybe/perhaps",
          "masih dekat → 'still nearby' (masih = still)",
        ],
      },
      {
        en: "Sebentar lagi acaranya akan selesai.",
        vi: "Lát nữa thôi chương trình sẽ kết thúc.",
        pronunciation_focus: [
          "sebentar lagi → 'lát nữa thôi/chốc nữa' (tương lai rất gần)",
          "acaranya → 'chương trình/sự kiện (đó)' (acara + -nya)",
          "selesai → seu-leu-SAI, 'xong/kết thúc'",
        ],
        pronunciation_focus_en: [
          "sebentar lagi → 'in a moment/shortly' (very near future)",
          "acaranya → 'the event/program' (acara + '-nya')",
          "selesai → 'se-le-SAI' — finished/done",
        ],
      },
      {
        en: "Walaupun sudah malam, dia masih belum pulang.",
        vi: "Mặc dù đã khuya, cậu ấy vẫn chưa về.",
        pronunciation_focus: [
          "sudah malam → 'đã khuya/đã tối'",
          "masih belum → 'vẫn chưa' (ghép masih + belum, rất tự nhiên)",
          "L1 note: 'masih belum' khớp đúng 'vẫn chưa' của tiếng Việt",
        ],
        pronunciation_focus_en: [
          "sudah malam → 'it's already late/night'",
          "masih belum → 'still not yet' (masih + belum, very natural)",
          "note: 'masih belum' maps exactly to Vietnamese 'vẫn chưa'",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở trình độ cao hơn, cần phân biệt các sắc thái: (1) 'sudah' (đời thường) vs 'telah' (trang trọng, văn viết/tin tức) — cùng nghĩa 'đã'. (2) 'belum' (chưa, còn ngỏ) vs 'tidak' (không, dứt khoát) — chọn sai làm đổi nghĩa hẳn. (3) Ghép trợ từ: 'baru saja' (vừa mới, nhấn mạnh), 'masih belum' (vẫn chưa), 'sebentar lagi' (chốc nữa). Những tổ hợp này nghe rất tự nhiên và đều có bản sao gần đúng trong tiếng Việt, nên chỉ cần ghi nhớ cặp tương ứng.",
    cultural_notes_en:
      "At a higher level you need the nuances: (1) 'sudah' (everyday) vs 'telah' (formal, writing/news) — both 'already'. (2) 'belum' (not yet, still open) vs 'tidak' (not, definitive) — the wrong choice flips the meaning. (3) Stacked markers: 'baru saja' (just now, emphatic), 'masih belum' (still not yet), 'sebentar lagi' (shortly). These combinations sound very natural and all have close Vietnamese counterparts, so it's mostly about memorizing the matching pair.",
    tip_advice_vi:
      "Mẹo cho người Việt: nhớ ba phân biệt vàng — telah (trang trọng) ≥ sudah (đời thường); belum (chưa, sẽ có thể) ≠ tidak (không, dứt khoát); 'baru saja' nhấn 'vừa mới', 'sebentar lagi' = 'chốc nữa'. Các tổ hợp ánh xạ thẳng: masih belum = vẫn chưa, sudah tidak = không còn (nữa), belum pernah = chưa từng. Trong bài thi/viết trang trọng, ưu tiên 'telah' và 'tidak/belum' chuẩn; tránh 'lagi' (đời thường) và 'gak' (lóng).",
    tip_advice_en:
      "Tip for Vietnamese speakers: keep three golden distinctions — telah (formal) ≥ sudah (everyday); belum (not yet, still possible) ≠ tidak (not, definitive); 'baru saja' emphasizes 'just now', 'sebentar lagi' = 'shortly'. Direct-mapping combos: masih belum = vẫn chưa (still not yet), sudah tidak = không còn (no longer), belum pernah = chưa từng (never yet). In exams/formal writing, prefer 'telah' and proper 'tidak/belum'; avoid casual 'lagi' and slang 'gak'.",
    vocabulary: [
      {
        cell_id: "77d3e4e7-3e3f-4cc2-a3c0-0370ea5f25f2",
        word: "telah",
        en: "have/has (formal 'already')",
        vi: "đã (trang trọng)",
        pos: "aspect marker (formal)",
        pronunciation_vi: "TEU-lah",
        pronunciation_en: "TE-lah",
      },
      {
        cell_id: "14e842da-bd6c-4201-b916-e85cecc68de1",
        word: "tidak",
        en: "not (flat negative)",
        vi: "không",
        pos: "negator",
        pronunciation_vi: "TI-dak",
        pronunciation_en: "TEE-dak",
      },
      {
        cell_id: "b7119c1c-819d-4ac4-9a59-39138157e7b0",
        word: "baru saja",
        en: "just now (a moment ago)",
        vi: "vừa mới (ngay lúc nãy)",
        pos: "time phrase",
        pronunciation_vi: "BA-ru SA-ja",
        pronunciation_en: "BA-roo SA-ja",
      },
      {
        cell_id: "d4e1bb87-9451-4063-8035-fd6dcd6ab3dc",
        word: "sebentar lagi",
        en: "shortly / in a moment",
        vi: "lát nữa thôi / chốc nữa",
        pos: "time phrase",
        pronunciation_vi: "seu-ben-TAR LA-gi",
        pronunciation_en: "se-ben-TAR LA-gee",
      },
      {
        cell_id: "e3e7f67e-09c8-4e74-9b6e-cf90de4b7f35",
        word: "masih belum",
        en: "still not yet",
        vi: "vẫn chưa",
        pos: "stacked marker",
        pronunciation_vi: "MA-sih beu-LUM",
        pronunciation_en: "MA-seeh be-LOOM",
      },
      {
        cell_id: "ce140d26-5444-4b96-aba1-88f7062f7497",
        word: "selesai",
        en: "finished / done",
        vi: "xong / kết thúc",
        pos: "verb / adjective",
        pronunciation_vi: "seu-leu-SAI",
        pronunciation_en: "se-le-SAI",
      },
      {
        cell_id: "1f6a943d-79d1-4be5-87d4-d74f68d06c73",
        word: "belum pernah",
        en: "never (yet) / not once",
        vi: "chưa từng",
        pos: "stacked marker",
        pronunciation_vi: "beu-LUM PER-nah",
        pronunciation_en: "be-LOOM PER-nah",
      },
    ],
    dialogue: [
      {
        cell_id: "4e784c6c-dbe9-49cf-8a08-fbd86b7c842b",
        speaker: "Wartawan",
        text: "Acara peresmian sudah dimulai?",
        vi: "Lễ khánh thành đã bắt đầu chưa?",
        en: "Has the inauguration ceremony started?",
      },
      {
        cell_id: "ce7f49de-cdae-4310-babf-6c9d5d3d6b45",
        speaker: "Panitia",
        text: "Sudah. Telah dimulai pukul sembilan tadi. Sebentar lagi akan selesai.",
        vi: "Rồi. Đã bắt đầu lúc chín giờ sáng nãy. Lát nữa sẽ kết thúc.",
        en: "Yes. It started at nine this morning. It'll finish shortly.",
      },
      {
        cell_id: "c39aa17c-69c1-4ceb-90b6-9d22b8c3c251",
        speaker: "Wartawan",
        text: "Tamu utamanya sudah datang?",
        vi: "Khách mời chính đã đến chưa?",
        en: "Has the guest of honor arrived?",
      },
      {
        cell_id: "b1180e5c-ec23-4a16-b4ef-daf9b407d928",
        speaker: "Panitia",
        text: "Walaupun sudah siang, beliau masih belum tiba. Tapi bukan berarti tidak datang.",
        vi: "Mặc dù đã trưa, ông ấy vẫn chưa tới. Nhưng không có nghĩa là không đến.",
        en: "Although it's already midday, he still hasn't arrived. But that doesn't mean he won't come.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ/cụm chỉ thời gian đúng sắc thái:",
        instruction_en: "Fill in the time word/phrase with the right nuance:",
        items: [
          {
            prompt: "Rapat ___ dimulai pukul sembilan. (đã — trang trọng)",
            answer: "telah",
            options: ["telah", "belum", "baru"],
          },
          {
            prompt: "Saya ___ suka kopi, jadi tidak minum. (không — dứt khoát)",
            answer: "tidak",
            options: ["tidak", "belum", "masih"],
          },
          {
            prompt: "Walaupun sudah malam, dia ___ pulang. (vẫn chưa)",
            answer: "masih belum",
            options: ["masih belum", "sudah tidak", "baru saja"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối cụm với nghĩa tiếng Việt:",
        instruction_en: "Match each phrase with its Vietnamese meaning:",
        items: [
          { prompt: "baru saja", answer: "vừa mới (lúc nãy)" },
          { prompt: "sebentar lagi", answer: "lát nữa thôi" },
          { prompt: "masih belum", answer: "vẫn chưa" },
          { prompt: "belum pernah", answer: "chưa từng" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia (chú ý sắc thái):",
        instruction_en: "Translate into Indonesian (mind the nuance):",
        items: [
          { prompt: "Cậu ấy vừa mới đi, có lẽ vẫn còn gần đây.", answer: "Dia baru saja pergi, mungkin masih dekat." },
          { prompt: "Lát nữa thôi chương trình sẽ kết thúc.", answer: "Sebentar lagi acaranya akan selesai." },
          { prompt: "Mặc dù đã khuya, cậu ấy vẫn chưa về.", answer: "Walaupun sudah malam, dia masih belum pulang." },
        ],
      },
    ],
  },
];

export default timeExpressionsLessons;
