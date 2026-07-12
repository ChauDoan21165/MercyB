// Clinic Diabetes Follow-up Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for diabetes follow-up: blood sugar,
// regular medicine, food choices, light exercise, doctor checkups, foot wounds,
// and lab results. Indonesian target text lives in `en`, Vietnamese glosses in
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
  cell_id?: string;
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
  cell_id?: string;
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

export const clinicDiabetesFollowupLessons: IndonesianLesson[] = [
  {
    id: "indonesian_clinic_diabetes_followup",
    level: "B1",
    category: "clinic_health",
    title_vi: "Tái khám diabetes: gula darah, thuốc và kiểm tra định kỳ",
    title_en: "Diabetes follow-up: blood sugar, medication, and regular checkups",
    sentences: [
      {
        en: "Saya datang untuk kontrol diabetes saya.",
        vi: "Tôi đến để tái khám bệnh tiểu đường của tôi.",
        pronunciation_focus: [
          "kon-TROL di-a-BE-tes - `kontrol` = tái khám/kiểm tra định kỳ với bác sĩ.",
          "`datang untuk` = đến để; cấu trúc rất tự nhiên khi nói mục đích.",
          "Lỗi người Việt: nói `check up diabetes` lẫn Anh-Indo. Tự nhiên hơn là `kontrol diabetes`.",
          "Luyện: `Saya datang untuk kontrol.`",
        ],
        pronunciation_focus_en: [
          "kon-TROL dee-ah-BEH-tes - `kontrol` = follow-up checkup / review visit.",
          "`datang untuk` = come for; a very natural purpose pattern.",
          "VN-speaker trap: mixing English `check up diabetes`. More natural is `kontrol diabetes`.",
          "Drill: `Saya datang untuk kontrol.`",
        ],
      },
      {
        en: "Gula darah saya masih tinggi pagi ini.",
        vi: "Đường huyết của tôi sáng nay vẫn còn cao.",
        pronunciation_focus: [
          "gu-la DA-rah - `gula darah` = đường huyết.",
          "`masih tinggi` = vẫn cao; dùng khi kết quả chưa tốt.",
          "Lỗi người Việt: nói `gula` thôi là chưa rõ. Trong y tế, `gula darah` là cụm chuẩn.",
          "Luyện: `Gula darah saya masih tinggi.`",
        ],
        pronunciation_focus_en: [
          "GOO-lah DA-rah - `gula darah` = blood sugar.",
          "`masih tinggi` = still high; used when the result is not yet good.",
          "VN-speaker trap: saying only `gula` is too vague. In medical contexts, `gula darah` is the standard phrase.",
          "Drill: `Gula darah saya masih tinggi.`",
        ],
      },
      {
        en: "Saya harus minum obat rutin setiap hari.",
        vi: "Tôi phải uống thuốc đều đặn mỗi ngày.",
        pronunciation_focus: [
          "o-BAT RU-tin - `obat rutin` = thuốc dùng đều đặn theo lịch.",
          "`setiap hari` = mỗi ngày; chỉ thói quen hoặc quy định cố định.",
          "Lỗi người Việt: nói `obat biasa` hoặc `obat terus` không rõ bằng `obat rutin`.",
          "Luyện: `Saya harus minum obat rutin.`",
        ],
        pronunciation_focus_en: [
          "OH-bat ROO-tin - `obat rutin` = regular medicine taken on schedule.",
          "`setiap hari` = every day; for a fixed habit or routine.",
          "VN-speaker trap: `obat biasa` or `obat terus` is less precise than `obat rutin`.",
          "Drill: `Saya harus minum obat rutin.`",
        ],
      },
      {
        en: "Kalau makan, saya perlu jaga pola makan.",
        vi: "Khi ăn uống, tôi cần giữ chế độ ăn.",
        pronunciation_focus: [
          "PA-la MA-kan - `pola makan` = chế độ ăn / thói quen ăn uống.",
          "`jaga` = giữ, duy trì, kiểm soát; rất hay đi với kesehatan.",
          "Lỗi người Việt: dùng `diet` cho mọi trường hợp. `Pola makan` là cụm tự nhiên hơn trong tư vấn y tế.",
          "Luyện: `Saya perlu jaga pola makan.`",
        ],
        pronunciation_focus_en: [
          "PAH-lah MAH-kahn - `pola makan` = eating pattern / diet habits.",
          "`jaga` = keep/maintain/control; very common in health talk.",
          "VN-speaker trap: using `diet` for every situation. `Pola makan` is more natural in medical advice.",
          "Drill: `Saya perlu jaga pola makan.`",
        ],
      },
      {
        en: "Dokter menyarankan olahraga ringan setelah makan.",
        vi: "Bác sĩ khuyên tập thể dục nhẹ sau khi ăn.",
        pronunciation_focus: [
          "o-laH-ra-ga RING-an - `olahraga ringan` = vận động nhẹ.",
          "`menyarankan` = khuyên/gợi ý; phù hợp với lời tư vấn bác sĩ.",
          "Lỗi người Việt: dịch `olahraga` thành thể thao nặng. Trong lời khuyên y tế, `olahraga ringan` là đi bộ nhẹ, stretching, v.v.",
          "Luyện: `Dokter menyarankan olahraga ringan.`",
        ],
        pronunciation_focus_en: [
          "oh-lah-RAH-gah RING-ahn - `olahraga ringan` = light exercise.",
          "`menyarankan` = recommends/suggests; suitable for doctor advice.",
          "VN-speaker trap: thinking `olahraga` means heavy sports. In health advice, `olahraga ringan` can be a short walk or stretching.",
          "Drill: `Dokter menyarankan olahraga ringan.`",
        ],
      },
      {
        en: "Saya lupa minum obat tadi malam.",
        vi: "Tối qua tôi quên uống thuốc.",
        pronunciation_focus: [
          "lu-pa mi-num o-BAT - `lupa minum obat` = quên uống thuốc.",
          "`tadi malam` = tối qua; rất hữu ích khi kể với bác sĩ.",
          "Lỗi người Việt: dùng `lupa makan obat` có thể hiểu, nhưng `minum obat` là cách nói chuẩn trong y tế.",
          "Luyện: `Saya lupa minum obat.`",
        ],
        pronunciation_focus_en: [
          "LOO-pah MEE-num OH-bat - `lupa minum obat` = forgot to take the medicine.",
          "`tadi malam` = last night; useful when explaining to a doctor.",
          "VN-speaker trap: `lupa makan obat` may be understood, but `minum obat` is the standard medical phrase.",
          "Drill: `Saya lupa minum obat.`",
        ],
      },
      {
        en: "Kaki saya ada luka kecil yang sulit sembuh.",
        vi: "Chân tôi có vết thương nhỏ khó lành.",
        pronunciation_focus: [
          "KA-ki SA-ya A-da LU-ka ke-CIL - `luka` = vết thương; `kecil` = nhỏ.",
          "`sulit sembuh` = khó lành; `sembuh` = khỏi/lành.",
          "Lỗi người Việt: nói `sakit kaki` cho mọi vấn đề. Nếu có vết thương, dùng `luka`.",
          "Luyện: `Kaki saya ada luka kecil.`",
        ],
        pronunciation_focus_en: [
          "KAH-kee SA-yah AH-dah LOO-kah ke-CHIL - `luka` = wound; `kecil` = small.",
          "`sulit sembuh` = hard to heal; `sembuh` = recover/heal.",
          "VN-speaker trap: saying `sakit kaki` for everything. If there is a wound, use `luka`.",
          "Drill: `Kaki saya ada luka kecil.`",
        ],
      },
      {
        en: "Apakah saya perlu rujukan dokter untuk kontrol lagi?",
        vi: "Tôi có cần giấy giới thiệu của bác sĩ để tái khám lại không?",
        pronunciation_focus: [
          "ru-JU-kan dok-ter - `rujukan dokter` = giấy giới thiệu/chuyển tuyến của bác sĩ.",
          "`kontrol lagi` = tái khám lại; `lagi` nhấn việc lặp lại.",
          "Lỗi người Việt: nói `surat dokter` chung chung. Nếu cần giấy giới thiệu, từ đúng là `rujukan`.",
          "Luyện: `Apakah saya perlu rujukan dokter?`",
        ],
        pronunciation_focus_en: [
          "roo-JOO-kan DOK-ter - `rujukan dokter` = doctor's referral.",
          "`kontrol lagi` = follow-up again; `lagi` emphasizes repetition.",
          "VN-speaker trap: vague `surat dokter`. If you need a referral, the correct word is `rujukan`.",
          "Drill: `Apakah saya perlu rujukan dokter?`",
        ],
      },
      {
        en: "Saya sudah cek hasil lab, tapi belum paham artinya.",
        vi: "Tôi đã xem kết quả xét nghiệm, nhưng vẫn chưa hiểu ý nghĩa của nó.",
        pronunciation_focus: [
          "ha-sil lab - `hasil lab` = kết quả xét nghiệm.",
          "`belum paham` = chưa hiểu; `paham` là hiểu rõ, nắm được.",
          "Lỗi người Việt: nói `mengerti` cũng được, nhưng `paham` rất tự nhiên trong văn nói của bác sĩ và bệnh nhân.",
          "Luyện: `Saya belum paham artinya.`",
        ],
        pronunciation_focus_en: [
          "HAH-seel lab - `hasil lab` = lab result.",
          "`belum paham` = do not understand yet; `paham` = understand clearly.",
          "VN-speaker trap: `mengerti` is okay, but `paham` is very natural in doctor-patient speech.",
          "Drill: `Saya belum paham artinya.`",
        ],
      },
      {
        en: "Mohon jelaskan hasil lab ini dengan sederhana.",
        vi: "Xin hãy giải thích kết quả xét nghiệm này một cách đơn giản.",
        pronunciation_focus: [
          "je-LAS-kan - `jelaskan` = giải thích.",
          "`dengan sederhana` = một cách đơn giản; rất hữu ích khi muốn hiểu hasil lab.",
          "Lỗi người Việt: nói `jelasin` quá thân mật với petugas y tế. `Jelaskan` lịch sự và an toàn hơn.",
          "Luyện: `Mohon jelaskan hasil lab ini.`",
        ],
        pronunciation_focus_en: [
          "jeh-LAS-kan - `jelaskan` = explain.",
          "`dengan sederhana` = simply / in simple terms; useful for lab results.",
          "VN-speaker trap: casual `jelasin` is too informal with medical staff. `Jelaskan` is polite and safe.",
          "Drill: `Mohon jelaskan hasil lab ini.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, bệnh nhân diabetes thường được dặn `kontrol` định kỳ, cek `gula darah`, uống `obat rutin`, và menjaga `pola makan`. Bác sĩ hoặc perawat có thể hỏi về aktivitas, luka pada kaki, dan hasil lab terakhir. Khi không hiểu, nên hỏi `Mohon jelaskan dengan sederhana` thay vì im lặng.",
    cultural_notes_en:
      "In Indonesia, diabetes patients are often told to come for regular `kontrol`, check `gula darah`, take `obat rutin`, and keep a good `pola makan`. The doctor or nurse may ask about activity, foot wounds, and the latest lab results. If you do not understand, ask `Mohon jelaskan dengan sederhana` instead of staying silent.",
    tip_advice_vi:
      "Mẫu câu hữu ích: `Saya datang untuk kontrol`, `Gula darah saya masih tinggi`, `Saya harus minum obat rutin`, `Saya punya luka kecil di kaki`, `Mohon jelaskan hasil lab ini dengan sederhana`. Với diabetes, các từ `kontrol`, `gula darah`, `obat rutin`, `pola makan`, và `rujukan` rất quan trọng.",
    tip_advice_en:
      "Useful lines: `Saya datang untuk kontrol`, `Gula darah saya masih tinggi`, `Saya harus minum obat rutin`, `Saya punya luka kecil di kaki`, `Mohon jelaskan hasil lab ini dengan sederhana`. For diabetes, words like `kontrol`, `gula darah`, `obat rutin`, `pola makan`, and `rujukan` are important.",
    vocabulary: [
      {
        cell_id: "30f682e4-4cdd-4b51-bb06-01cfcc90111f",
        word: "kontrol",
        en: "follow-up checkup",
        vi: "tái khám / kiểm tra định kỳ",
        pos: "noun / verb",
        pronunciation_vi: "kon-TROL",
        pronunciation_en: "kon-TROHL",
      },
      {
        cell_id: "fba34484-d895-46fd-a987-1a5292f73212",
        word: "gula darah",
        en: "blood sugar",
        vi: "đường huyết",
        pos: "noun phrase",
        pronunciation_vi: "GU-la DA-rah",
        pronunciation_en: "GOO-lah DA-rah",
      },
      {
        cell_id: "eb53a653-eb5d-4252-81d9-c5d91effdf8e",
        word: "obat rutin",
        en: "regular medication",
        vi: "thuốc uống đều đặn",
        pos: "noun phrase",
        pronunciation_vi: "o-BAT RU-tin",
        pronunciation_en: "OH-bat ROO-tin",
      },
      {
        cell_id: "9f2793bf-aabc-4a13-b5c5-fdf9aeeba918",
        word: "pola makan",
        en: "eating pattern / diet",
        vi: "chế độ ăn",
        pos: "noun phrase",
        pronunciation_vi: "PA-la MA-kan",
        pronunciation_en: "PAH-lah MAH-kahn",
      },
      {
        cell_id: "44ea874c-9fe3-4771-8919-92b79aaf6e48",
        word: "olahraga ringan",
        en: "light exercise",
        vi: "vận động nhẹ",
        pos: "noun phrase",
        pronunciation_vi: "o-laH-ra-ga RING-an",
        pronunciation_en: "oh-lah-RAH-gah RING-ahn",
      },
      {
        cell_id: "e393b6f6-01df-4be4-b923-6bb9c33d230a",
        word: "rujukan dokter",
        en: "doctor's referral",
        vi: "giấy giới thiệu của bác sĩ",
        pos: "noun phrase",
        pronunciation_vi: "ru-JU-kan dok-ter",
        pronunciation_en: "roo-JOO-kan DOK-ter",
      },
      {
        cell_id: "1dad96cf-165d-49da-b189-f24c82aebad7",
        word: "luka kaki",
        en: "foot wound",
        vi: "vết thương ở chân/bàn chân",
        pos: "noun phrase",
        pronunciation_vi: "LU-ka KA-ki",
        pronunciation_en: "LOO-kah KAH-kee",
      },
      {
        cell_id: "94a5faa2-6eca-4b5a-ac9f-7f92bca47276",
        word: "hasil lab",
        en: "lab result",
        vi: "kết quả xét nghiệm",
        pos: "noun phrase",
        pronunciation_vi: "ha-sil lab",
        pronunciation_en: "HAH-seel lab",
      },
      {
        cell_id: "41919202-8074-4d08-83f2-b3819dbb75a0",
        word: "jelaskan",
        en: "explain",
        vi: "giải thích",
        pos: "verb",
        pronunciation_vi: "je-LAS-kan",
        pronunciation_en: "jeh-LAS-kan",
      },
      {
        cell_id: "63ae074f-0420-416c-9e34-2c382f728804",
        word: "sederhana",
        en: "simple / simple manner",
        vi: "đơn giản",
        pos: "adjective / adverb",
        pronunciation_vi: "se-der-HA-na",
        pronunciation_en: "seh-der-HAH-nah",
      },
    ],
    dialogue: [
      {
        cell_id: "ac6da4aa-9f5d-4b85-ba86-5ac000e1276c",
        speaker: "Pasien",
        text: "Saya datang untuk kontrol diabetes saya.",
        vi: "Tôi đến để tái khám bệnh tiểu đường của tôi.",
        en: "I came for my diabetes follow-up.",
      },
      {
        cell_id: "1c973f6c-2857-4660-b1b8-2f99691fc092",
        speaker: "Perawat",
        text: "Baik, apakah gula darah Anda masih tinggi pagi ini?",
        vi: "Vâng, sáng nay đường huyết của anh/chị vẫn còn cao không?",
        en: "Okay, is your blood sugar still high this morning?",
      },
      {
        cell_id: "960a64bf-d7a5-44d1-a2f4-5a88f2e32b4e",
        speaker: "Pasien",
        text: "Masih, dan saya juga lupa minum obat rutin tadi malam.",
        vi: "Vẫn còn cao, và tối qua tôi cũng quên uống thuốc đều đặn.",
        en: "Yes, and I also forgot to take my regular medicine last night.",
      },
      {
        cell_id: "16893ab1-5b74-479e-bd56-4b88362a5440",
        speaker: "Perawat",
        text: "Dokter akan melihat hasil lab Anda dan menjelaskan pola makan yang perlu dijaga.",
        vi: "Bác sĩ sẽ xem kết quả xét nghiệm của anh/chị và giải thích chế độ ăn cần giữ.",
        en: "The doctor will look at your lab results and explain the diet you need to maintain.",
      },
      {
        cell_id: "b3b30898-d270-4351-8681-a680ff3e0d3d",
        speaker: "Pasien",
        text: "Saya juga punya luka kecil di kaki. Apakah perlu kontrol lagi minggu depan?",
        vi: "Tôi cũng có vết thương nhỏ ở chân. Có cần tái khám lại vào tuần sau không?",
        en: "I also have a small wound on my foot. Do I need another follow-up next week?",
      },
      {
        cell_id: "54da4b75-cd9e-43e2-b98d-fd14f6196726",
        speaker: "Perawat",
        text: "Ya, dan mohon jelaskan hasil lab ini dengan sederhana kalau masih belum paham.",
        vi: "Vâng, và nếu vẫn chưa hiểu thì xin hãy giải thích kết quả xét nghiệm này một cách đơn giản.",
        en: "Yes, and please ask for a simple explanation of these lab results if you still do not understand.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt: "Translate into Indonesian: Tôi đến để tái khám bệnh tiểu đường của tôi.",
        answer: "Saya datang untuk kontrol diabetes saya.",
      },
      {
        type: "translation",
        prompt: "Translate into Vietnamese: Saya harus minum obat rutin setiap hari.",
        answer: "Tôi phải uống thuốc đều đặn mỗi ngày.",
      },
      {
        type: "fill_blank",
        prompt: "Gula darah saya masih ____ pagi ini.",
        answer: "tinggi",
      },
      {
        type: "fill_blank",
        prompt: "Mohon jelaskan hasil lab ini dengan ____.",
        answer: "sederhana",
      },
      {
        type: "matching",
        prompt: "Match the Indonesian phrase to the meaning.",
        pairs: [
          ["gula darah", "blood sugar / đường huyết"],
          ["obat rutin", "regular medication / thuốc uống đều đặn"],
          ["rujukan dokter", "doctor's referral / giấy giới thiệu của bác sĩ"],
          ["hasil lab", "lab result / kết quả xét nghiệm"],
        ],
      },
    ],
  },
];

export default clinicDiabetesFollowupLessons;
