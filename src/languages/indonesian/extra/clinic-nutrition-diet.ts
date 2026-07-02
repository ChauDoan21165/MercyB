// Clinic Nutrition & Diet Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for nutrition consultations: dietitians,
// eating patterns, healthy diet, calories, body weight, diabetes, cholesterol,
// and meal planning. Indonesian target text lives in `en`, Vietnamese glosses in
// `vi`, Vietnamese L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.

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

export const clinicNutritionDietLessons: IndonesianLesson[] = [
  {
    id: "indonesian_clinic_nutrition_diet",
    level: "B1",
    category: "health",
    title_vi: "Tư vấn ahli gizi: pola makan và diet sehat",
    title_en: "Dietitian consultation: eating patterns and a healthy diet",
    sentences: [
      {
        en: "Saya mau konsultasi dengan ahli gizi.",
        vi: "Tôi muốn tư vấn với chuyên gia dinh dưỡng.",
        pronunciation_focus: [
          "AH-li GI-zi - `ahli gizi` = chuyên gia dinh dưỡng.",
          "`konsultasi dengan` = tư vấn với; dùng tự nhiên ở klinik hoặc rumah sakit.",
          "Lỗi người Việt: nói `dokter makan` theo dịch chữ. Người tư vấn dinh dưỡng là `ahli gizi`.",
          "Luyện: `Saya mau konsultasi dengan ahli gizi.`",
        ],
        pronunciation_focus_en: [
          "AH-li GEE-zee - `ahli gizi` = dietitian/nutritionist.",
          "`konsultasi dengan` = consult with; natural in clinics and hospitals.",
          "VN-speaker trap: saying translated `dokter makan`. The nutrition professional is `ahli gizi`.",
          "Drill: `Saya mau konsultasi dengan ahli gizi.`",
        ],
      },
      {
        en: "Pola makan saya akhir-akhir ini kurang teratur.",
        vi: "Dạo gần đây chế độ ăn/uống của tôi không đều lắm.",
        pronunciation_focus: [
          "PO-la MA-kan - `pola makan` = chế độ/thói quen ăn uống.",
          "`akhir-akhir ini` = dạo gần đây; cụm thời gian rất tự nhiên.",
          "`kurang teratur` = chưa đều/không đều lắm; mềm hơn nói `berantakan`.",
          "Luyện: `Pola makan saya kurang teratur.`",
        ],
        pronunciation_focus_en: [
          "PO-la MA-kan - `pola makan` = eating pattern/dietary pattern.",
          "`akhir-akhir ini` = lately/recently; very natural time phrase.",
          "`kurang teratur` = not very regular; softer than `berantakan`.",
          "Drill: `Pola makan saya kurang teratur.`",
        ],
      },
      {
        en: "Saya ingin mulai diet sehat, bukan diet ekstrem.",
        vi: "Tôi muốn bắt đầu ăn kiêng lành mạnh, không phải ăn kiêng cực đoan.",
        pronunciation_focus: [
          "di-ET SE-hat - `diet sehat` = chế độ ăn lành mạnh.",
          "`bukan diet ekstrem` = không phải diet cực đoan; `bukan` phủ định danh từ/cụm danh từ.",
          "Lỗi người Việt: dùng `tidak diet ekstrem`. Vì `diet ekstrem` là danh từ/cụm danh từ, dùng `bukan`.",
          "Luyện: `Saya ingin diet sehat.`",
        ],
        pronunciation_focus_en: [
          "di-ET SE-hat - `diet sehat` = healthy diet.",
          "`bukan diet ekstrem` = not an extreme diet; `bukan` negates nouns/noun phrases.",
          "VN-speaker trap: using `tidak diet ekstrem`. Since `diet ekstrem` is a noun phrase, use `bukan`.",
          "Drill: `Saya ingin diet sehat.`",
        ],
      },
      {
        en: "Berapa kalori yang sebaiknya saya makan setiap hari?",
        vi: "Tôi nên ăn bao nhiêu calo mỗi ngày?",
        pronunciation_focus: [
          "KA-lo-ri - `kalori` = calo/năng lượng.",
          "`sebaiknya` = nên/tốt nhất là; lịch sự khi xin lời khuyên chuyên môn.",
          "`setiap hari` = mỗi ngày; đặt cuối câu rất tự nhiên.",
          "Luyện: `Berapa kalori setiap hari?`",
        ],
        pronunciation_focus_en: [
          "KA-lo-ree - `kalori` = calories.",
          "`sebaiknya` = should/it is best to; polite for professional advice.",
          "`setiap hari` = every day; natural at the end of the sentence.",
          "Drill: `Berapa kalori setiap hari?`",
        ],
      },
      {
        en: "Berat badan saya naik lima kilo dalam tiga bulan.",
        vi: "Cân nặng của tôi tăng năm ký trong ba tháng.",
        pronunciation_focus: [
          "BE-rat BA-dan - `berat badan` = cân nặng cơ thể.",
          "`naik lima kilo` = tăng năm ký; dùng `naik` cho cân nặng tăng.",
          "Lỗi người Việt: nói `berat saya tambah`. Tự nhiên hơn: `berat badan saya naik`.",
          "Luyện: `Berat badan saya naik lima kilo.`",
        ],
        pronunciation_focus_en: [
          "BE-rat BA-dan - `berat badan` = body weight.",
          "`naik lima kilo` = gained five kilos; use `naik` for weight increase.",
          "VN-speaker trap: saying `berat saya tambah`. Natural: `berat badan saya naik`.",
          "Drill: `Berat badan saya naik lima kilo.`",
        ],
      },
      {
        en: "Dokter bilang gula darah saya mulai tinggi.",
        vi: "Bác sĩ nói đường huyết của tôi bắt đầu cao.",
        pronunciation_focus: [
          "GU-la DA-rah - `gula darah` = đường huyết.",
          "`mulai tinggi` = bắt đầu cao; chưa nhất thiết là diagnosis cuối cùng.",
          "`dokter bilang` tự nhiên trong hội thoại; văn bản trang trọng có thể dùng `dokter mengatakan`.",
          "Luyện: `Gula darah saya mulai tinggi.`",
        ],
        pronunciation_focus_en: [
          "GOO-la DA-rah - `gula darah` = blood sugar.",
          "`mulai tinggi` = starting to be high; not necessarily a final diagnosis.",
          "`dokter bilang` is natural in speech; formal writing can use `dokter mengatakan`.",
          "Drill: `Gula darah saya mulai tinggi.`",
        ],
      },
      {
        en: "Saya punya riwayat diabetes dalam keluarga.",
        vi: "Gia đình tôi có tiền sử tiểu đường.",
        pronunciation_focus: [
          "ri-WA-yat di-a-BE-tes - `riwayat diabetes` = tiền sử tiểu đường.",
          "`dalam keluarga` = trong gia đình; dùng khi nói bệnh di truyền/nguy cơ gia đình.",
          "Lỗi người Việt: nói `sejarah diabetes` nghe như lịch sử. Y tế dùng `riwayat`.",
          "Luyện: `Ada riwayat diabetes dalam keluarga.`",
        ],
        pronunciation_focus_en: [
          "ri-WA-yat di-a-BE-tes - `riwayat diabetes` = history of diabetes.",
          "`dalam keluarga` = in the family; used for family medical risk.",
          "VN-speaker trap: saying `sejarah diabetes`, which sounds like history. Medical Indonesian uses `riwayat`.",
          "Drill: `Ada riwayat diabetes dalam keluarga.`",
        ],
      },
      {
        en: "Kolesterol saya tinggi, jadi saya perlu mengurangi gorengan.",
        vi: "Cholesterol của tôi cao, nên tôi cần giảm đồ chiên.",
        pronunciation_focus: [
          "ko-les-te-ROL TING-gi - `kolesterol tinggi` = cholesterol cao.",
          "`mengurangi gorengan` = giảm đồ chiên; `gorengan` là nhóm đồ chiên rất phổ biến ở Indonesia.",
          "`jadi` = nên/vì vậy; nối kết quả với kế hoạch.",
          "Luyện: `Saya perlu mengurangi gorengan.`",
        ],
        pronunciation_focus_en: [
          "ko-les-te-ROL TING-gi - `kolesterol tinggi` = high cholesterol.",
          "`mengurangi gorengan` = reduce fried snacks/foods; `gorengan` is common in Indonesia.",
          "`jadi` = so/therefore; links the result to the plan.",
          "Drill: `Saya perlu mengurangi gorengan.`",
        ],
      },
      {
        en: "Tolong bantu buatkan rencana makan selama satu minggu.",
        vi: "Xin giúp tôi lập kế hoạch ăn uống trong một tuần.",
        pronunciation_focus: [
          "ren-CA-na MA-kan - `rencana makan` = kế hoạch ăn uống/thực đơn.",
          "`buatkan` = làm giúp cho tôi; hậu tố `-kan` tạo nghĩa làm cho người khác.",
          "`selama satu minggu` = trong một tuần; `selama` cho khoảng thời gian.",
          "Luyện: `Tolong buatkan rencana makan.`",
        ],
        pronunciation_focus_en: [
          "ren-CHA-na MA-kan - `rencana makan` = meal plan.",
          "`buatkan` = make for someone; suffix `-kan` adds a benefactive sense.",
          "`selama satu minggu` = for one week; `selama` marks duration.",
          "Drill: `Tolong buatkan rencana makan.`",
        ],
      },
      {
        en: "Saya mau pilihan makanan yang cocok untuk jadwal kerja saya.",
        vi: "Tôi muốn lựa chọn món ăn phù hợp với lịch làm việc của tôi.",
        pronunciation_focus: [
          "CO-cok un-TUK JAD-wal KER-ja - `cocok untuk jadwal kerja` = phù hợp với lịch làm việc.",
          "`pilihan makanan` = lựa chọn thực phẩm/món ăn; dùng khi xin menu linh hoạt.",
          "Lỗi người Việt: đọc `cocok` như ko-kok. Chữ `c` Indonesia = ch: CO-chok.",
          "Luyện: `Makanan ini cocok untuk saya.`",
        ],
        pronunciation_focus_en: [
          "CHO-chok un-TOOK JAD-wal KER-ja - `cocok untuk jadwal kerja` = suitable for the work schedule.",
          "`pilihan makanan` = food choices/options; useful when asking for a flexible menu.",
          "VN-speaker trap: reading `cocok` as ko-kok. Indonesian `c` = ch: CHO-chok.",
          "Drill: `Makanan ini cocok untuk saya.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở klinik, rumah sakit, hoặc Puskesmas Indonesia, `ahli gizi` có thể giúp membuat rencana makan cho berat badan, diabetes, kolesterol, ibu hamil, anak, hoặc pemulihan bệnh. Người Indonesia thường ăn nasi sebagai makanan pokok, nên tư vấn diet hay nói về porsi nasi, lauk, sayur, buah, minuman manis, gorengan, và jadwal makan. Nếu có hasil lab như gula darah atau kolesterol, mang theo agar saran lebih tepat.",
    cultural_notes_en:
      "In Indonesian clinics, hospitals, or Puskesmas, an `ahli gizi` can help make a meal plan for weight, diabetes, cholesterol, pregnancy, children, or recovery. Rice is a staple food, so diet advice often discusses portions of rice, protein side dishes, vegetables, fruit, sweet drinks, fried snacks, and meal timing. If you have lab results such as blood sugar or cholesterol, bring them so the advice is more specific.",
    tip_advice_vi:
      "Mẹo cho người Việt: `diet` trong Indonesia không chỉ là giảm cân, mà có thể là chế độ ăn vì sức khỏe. Dùng cụm cụ thể: `pola makan`, `diet sehat`, `berat badan naik/turun`, `gula darah`, `kolesterol`, `mengurangi gorengan`, `rencana makan`. Khi xin lời khuyên, `sebaiknya saya... ?` nghe mềm và lịch sự.",
    tip_advice_en:
      "Tip for Vietnamese speakers: Indonesian `diet` does not only mean weight loss; it can mean a health eating plan. Use concrete chunks: `pola makan`, `diet sehat`, `berat badan naik/turun`, `gula darah`, `kolesterol`, `mengurangi gorengan`, `rencana makan`. When asking advice, `sebaiknya saya... ?` sounds soft and polite.",
    vocabulary: [
      {
        word: "ahli gizi",
        en: "dietitian / nutritionist",
        vi: "chuyên gia dinh dưỡng",
        pos: "noun",
        pronunciation_vi: "AH-li GI-zi",
        pronunciation_en: "AH-li GEE-zee",
      },
      {
        word: "pola makan",
        en: "eating pattern",
        vi: "chế độ/thói quen ăn uống",
        pos: "noun phrase",
        pronunciation_vi: "PO-la MA-kan",
        pronunciation_en: "PO-la MA-kan",
      },
      {
        word: "diet sehat",
        en: "healthy diet",
        vi: "chế độ ăn lành mạnh",
        pos: "noun phrase",
        pronunciation_vi: "di-ET SE-hat",
        pronunciation_en: "di-ET SE-hat",
      },
      {
        word: "kalori",
        en: "calories",
        vi: "calo",
        pos: "noun",
        pronunciation_vi: "KA-lo-ri",
        pronunciation_en: "KA-lo-ree",
      },
      {
        word: "berat badan",
        en: "body weight",
        vi: "cân nặng",
        pos: "noun phrase",
        pronunciation_vi: "BE-rat BA-dan",
        pronunciation_en: "BE-rat BA-dan",
      },
      {
        word: "gula darah",
        en: "blood sugar",
        vi: "đường huyết",
        pos: "noun phrase",
        pronunciation_vi: "GU-la DA-rah",
        pronunciation_en: "GOO-la DA-rah",
      },
      {
        word: "diabetes",
        en: "diabetes",
        vi: "tiểu đường",
        pos: "noun",
        pronunciation_vi: "di-a-BE-tes",
        pronunciation_en: "dee-a-BE-tes",
      },
      {
        word: "kolesterol",
        en: "cholesterol",
        vi: "cholesterol",
        pos: "noun",
        pronunciation_vi: "ko-les-te-ROL",
        pronunciation_en: "ko-les-te-ROL",
      },
      {
        word: "rencana makan",
        en: "meal plan",
        vi: "kế hoạch ăn uống",
        pos: "noun phrase",
        pronunciation_vi: "ren-CA-na MA-kan",
        pronunciation_en: "ren-CHA-na MA-kan",
      },
      {
        word: "gorengan",
        en: "fried snacks / fried foods",
        vi: "đồ chiên",
        pos: "noun",
        pronunciation_vi: "go-RENG-an",
        pronunciation_en: "go-RENG-an",
      },
    ],
    dialogue: [
      {
        speaker: "Pasien",
        text: "Selamat pagi. Saya mau konsultasi dengan ahli gizi.",
        vi: "Chào buổi sáng. Tôi muốn tư vấn với chuyên gia dinh dưỡng.",
        en: "Good morning. I would like to consult with a dietitian.",
      },
      {
        speaker: "Ahli Gizi",
        text: "Baik. Apa tujuan utama Anda, menurunkan berat badan atau mengatur gula darah?",
        vi: "Được. Mục tiêu chính của anh/chị là giảm cân hay kiểm soát đường huyết?",
        en: "All right. What is your main goal, losing weight or managing blood sugar?",
      },
      {
        speaker: "Pasien",
        text: "Berat badan saya naik, dan dokter bilang kolesterol saya tinggi.",
        vi: "Cân nặng của tôi tăng, và bác sĩ nói cholesterol của tôi cao.",
        en: "My weight has gone up, and the doctor said my cholesterol is high.",
      },
      {
        speaker: "Ahli Gizi",
        text: "Kita bisa mulai dari pola makan teratur dan mengurangi gorengan.",
        vi: "Chúng ta có thể bắt đầu từ chế độ ăn đều đặn và giảm đồ chiên.",
        en: "We can start with a regular eating pattern and reducing fried foods.",
      },
      {
        speaker: "Pasien",
        text: "Tolong bantu buatkan rencana makan selama satu minggu.",
        vi: "Xin giúp tôi lập kế hoạch ăn uống trong một tuần.",
        en: "Please help make a one-week meal plan for me.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm từ dinh dưỡng còn thiếu:",
        instruction_en: "Fill in the missing nutrition phrase:",
        items: [
          {
            prompt: "Saya mau konsultasi dengan ahli ___.",
            answer: "gizi",
            options: ["gizi", "gigi", "gaji"],
          },
          {
            prompt: "Pola ___ saya akhir-akhir ini kurang teratur.",
            answer: "makan",
            options: ["makan", "mandi", "main"],
          },
          {
            prompt: "Kolesterol saya tinggi, jadi saya perlu mengurangi ___.",
            answer: "gorengan",
            options: ["gorengan", "gerakan", "gudang"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ Indonesia với nghĩa tiếng Việt:",
        instruction_en: "Match the Indonesian phrase with its Vietnamese meaning:",
        items: [
          { prompt: "ahli gizi", answer: "chuyên gia dinh dưỡng" },
          { prompt: "pola makan", answer: "thói quen ăn uống" },
          { prompt: "gula darah", answer: "đường huyết" },
          { prompt: "berat badan", answer: "cân nặng" },
          { prompt: "rencana makan", answer: "kế hoạch ăn uống" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          {
            prompt: "Tôi muốn tư vấn với chuyên gia dinh dưỡng.",
            answer: "Saya mau konsultasi dengan ahli gizi.",
          },
          {
            prompt: "Bác sĩ nói đường huyết của tôi bắt đầu cao.",
            answer: "Dokter bilang gula darah saya mulai tinggi.",
          },
          {
            prompt: "Xin giúp tôi lập kế hoạch ăn uống trong một tuần.",
            answer: "Tolong bantu buatkan rencana makan selama satu minggu.",
          },
        ],
      },
    ],
  },
];

export default clinicNutritionDietLessons;
