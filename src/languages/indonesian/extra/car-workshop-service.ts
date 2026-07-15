// Car Workshop & Service Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for bengkel mobil: oil changes, tires,
// brakes, battery, routine service, labor cost, spare parts, and breakdowns.
// Indonesian target text lives in `en`, Vietnamese glosses in `vi`, Vietnamese
// L1 notes in `pronunciation_focus`, and English companions in
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

export const carWorkshopServiceLessons: IndonesianLesson[] = [
  {
    id: "indonesian_car_workshop_service",
    level: "A2",
    category: "transport",
    title_vi: "Bengkel mobil: bảo dưỡng và sửa ô tô",
    title_en: "Car workshop: servicing and repairs",
    sentences: [
      {
        en: "Mas, saya mau servis mobil berkala.",
        vi: "Anh ơi, tôi muốn bảo dưỡng ô tô định kỳ.",
        pronunciation_focus: [
          "SER-vis MO-bil ber-KA-la - `servis berkala` = bảo dưỡng định kỳ.",
          "`mobil` trong Indonesia = ô tô/xe hơi; khác `motor` = xe máy.",
          "Lỗi người Việt: dùng `servis biasa` cho bảo dưỡng định kỳ. Từ tự nhiên ở bengkel là `servis berkala`.",
          "Luyện: `Saya mau servis mobil berkala.`",
        ],
        pronunciation_focus_en: [
          "SER-vis MO-bil ber-KA-la - `servis berkala` = scheduled/routine service.",
          "`mobil` in Indonesian = car; `motor` = motorcycle.",
          "VN-speaker trap: saying `servis biasa` for scheduled maintenance. At workshops, `servis berkala` is natural.",
          "Drill: `Saya mau servis mobil berkala.`",
        ],
      },
      {
        en: "Kapan terakhir ganti oli mesin?",
        vi: "Lần cuối thay dầu máy là khi nào?",
        pronunciation_focus: [
          "GAN-ti O-li ME-sin - `ganti oli mesin` = thay dầu máy.",
          "`terakhir` = lần cuối/gần nhất; dùng để hỏi lịch sử bảo dưỡng.",
          "Lỗi người Việt: nói `minyak mesin`. Với xe, dầu nhớt là `oli`, không phải `minyak`.",
          "Luyện: `Kapan terakhir ganti oli?`",
        ],
        pronunciation_focus_en: [
          "GAN-tee O-lee ME-sin - `ganti oli mesin` = change engine oil.",
          "`terakhir` = last/most recent; useful for service history.",
          "VN-speaker trap: saying `minyak mesin`. For vehicles, engine oil is `oli`, not `minyak`.",
          "Drill: `Kapan terakhir ganti oli?`",
        ],
      },
      {
        en: "Tekanan ban depan kanan kurang.",
        vi: "Áp suất lốp trước bên phải bị thiếu.",
        pronunciation_focus: [
          "te-KA-nan BAN de-PAN KA-nan - `tekanan ban` = áp suất lốp.",
          "`depan kanan` = trước bên phải; thứ tự vị trí rất thường trong bengkel.",
          "Lỗi người Việt: dùng `angin ban kurang` cũng nghe được, nhưng `tekanan ban kurang` chuẩn hơn.",
          "Luyện: `Tekanan ban kurang.`",
        ],
        pronunciation_focus_en: [
          "te-KA-nan BAN de-PAN KA-nan - `tekanan ban` = tire pressure.",
          "`depan kanan` = front right; position order is common in workshops.",
          "VN-speaker trap: `angin ban kurang` is understood, but `tekanan ban kurang` is more standard.",
          "Drill: `Tekanan ban kurang.`",
        ],
      },
      {
        en: "Rem mobil saya kurang pakem saat turun bukit.",
        vi: "Phanh ô tô của tôi không ăn lắm khi xuống dốc.",
        pronunciation_focus: [
          "rem MO-bil SA-ya KU-rang PA-kem - `rem kurang pakem` = phanh không ăn/chưa chắc.",
          "`saat turun bukit` = khi xuống dốc; `turun` = đi xuống.",
          "Lỗi người Việt: dịch 'phanh không ăn' thành `rem tidak makan`. Tiếng Indonesia nói `rem kurang pakem`.",
          "Luyện: `Rem mobil kurang pakem.`",
        ],
        pronunciation_focus_en: [
          "rem MO-bil SA-ya KOO-rang PA-kem - `rem kurang pakem` = brakes do not grip well.",
          "`saat turun bukit` = when going downhill; `turun` = go down.",
          "VN-speaker trap: translating 'brakes don't bite' as `rem tidak makan`. Indonesian says `rem kurang pakem`.",
          "Drill: `Rem mobil kurang pakem.`",
        ],
      },
      {
        en: "Aki mobil lemah, mesin susah dinyalakan.",
        vi: "Ắc quy ô tô yếu, máy khó khởi động.",
        pronunciation_focus: [
          "A-ki MO-bil LE-mah - `aki` = ắc quy; `lemah` = yếu.",
          "`mesin susah dinyalakan` = máy khó được khởi động; `di-...-kan` tạo bị động.",
          "`ny` trong `dinyalakan` đọc như 'nh' tiếng Việt, không tách n-y.",
          "Luyện: `Aki mobil lemah.`",
        ],
        pronunciation_focus_en: [
          "A-kee MO-bil LEH-mah - `aki` = battery; `lemah` = weak.",
          "`mesin susah dinyalakan` = the engine is hard to start; `di-...-kan` forms the passive.",
          "`ny` in `dinyalakan` is one sound, like Vietnamese nh, not separate n-y.",
          "Drill: `Aki mobil lemah.`",
        ],
      },
      {
        en: "Mobil saya mogok di pinggir jalan tadi pagi.",
        vi: "Sáng nay ô tô của tôi chết máy bên lề đường.",
        pronunciation_focus: [
          "MO-bil SA-ya MO-gok - `mogok` = chết máy/không chạy được.",
          "`di pinggir jalan` = bên lề đường; `pinggir` = mép/rìa.",
          "Lỗi người Việt: dùng `rusak` cho mọi tình huống. Xe đang đi rồi chết máy là `mogok`.",
          "Luyện: `Mobil saya mogok.`",
        ],
        pronunciation_focus_en: [
          "MO-bil SA-ya MO-gok - `mogok` = broke down/stalled.",
          "`di pinggir jalan` = at the roadside; `pinggir` = edge/side.",
          "VN-speaker trap: using `rusak` for every fault. A car that stalls/breaks down on the road is `mogok`.",
          "Drill: `Mobil saya mogok.`",
        ],
      },
      {
        en: "Berapa biaya jasa dan harga spare part-nya?",
        vi: "Tiền công và giá phụ tùng là bao nhiêu?",
        pronunciation_focus: [
          "BI-a-ya JA-sa - `biaya jasa` = tiền công/phí dịch vụ.",
          "`harga spare part-nya` = giá phụ tùng đó; cũng có từ chuẩn `suku cadang`.",
          "Mẹo: hỏi tách `biaya jasa` và `spare part` để tránh bất ngờ khi thanh toán.",
          "Luyện: `Berapa biaya jasa?`",
        ],
        pronunciation_focus_en: [
          "BEE-a-ya JA-sa - `biaya jasa` = labor/service fee.",
          "`harga spare part-nya` = the price of the part; the standard term is also `suku cadang`.",
          "Tip: ask separately about labor and parts to avoid surprises at payment.",
          "Drill: `Berapa biaya jasa?`",
        ],
      },
      {
        en: "Tolong kabari saya dulu sebelum mengganti spare part mahal.",
        vi: "Làm ơn báo cho tôi trước khi thay phụ tùng đắt tiền.",
        pronunciation_focus: [
          "ka-BA-ri SA-ya DU-lu - `kabari saya dulu` = báo cho tôi trước đã.",
          "`sebelum mengganti` = trước khi thay; `mengganti` = thay thế.",
          "Mẹo thực tế: câu này giúp bạn kiểm soát chi phí khi bengkel phát hiện lỗi mới.",
          "Luyện: `Kabari saya dulu sebelum mengganti.`",
        ],
        pronunciation_focus_en: [
          "ka-BA-ree SA-ya DOO-loo - `kabari saya dulu` = let me know first.",
          "`sebelum mengganti` = before replacing; `mengganti` = to replace.",
          "Practical tip: this line helps control costs when the workshop finds new problems.",
          "Drill: `Kabari saya dulu sebelum mengganti.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `bengkel mobil` có thể là bengkel resmi của hãng hoặc bengkel umum. Bengkel resmi thường đắt hơn nhưng có catatan servis và spare part resmi; bengkel umum linh hoạt hơn về harga và pilihan spare part. Khi xe `mogok`, người ta có thể gọi derek/towing hoặc minta mekanik datang. Luôn hỏi trước `estimasi biaya`, tách rõ `biaya jasa` và `harga spare part`, rồi yêu cầu bengkel `kabari dulu` trước khi thay phụ tùng mahal.",
    cultural_notes_en:
      "In Indonesia, a `bengkel mobil` may be an authorized brand workshop or a general workshop. Authorized workshops are often more expensive but provide service records and official parts; general workshops are more flexible on price and part choices. When a car `mogok`, people may call a tow truck or ask a mechanic to come. Always ask for an `estimasi biaya`, separate `biaya jasa` from `harga spare part`, and ask the workshop to `kabari dulu` before replacing expensive parts.",
    tip_advice_vi:
      "Mẹo cho người Việt: học các cụm nguyên khối ở bengkel: `servis berkala`, `ganti oli`, `tekanan ban`, `rem kurang pakem`, `aki lemah`, `mobil mogok`, `biaya jasa`, `spare part`. Đừng dùng `rusak` cho mọi lỗi; `mogok`, `bocor`, `lemah`, `kurang pakem`, `bunyi kasar` chính xác hơn.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn workshop chunks as whole phrases: `servis berkala`, `ganti oli`, `tekanan ban`, `rem kurang pakem`, `aki lemah`, `mobil mogok`, `biaya jasa`, `spare part`. Do not use `rusak` for every fault; `mogok`, `bocor`, `lemah`, `kurang pakem`, and `bunyi kasar` are more precise.",
    vocabulary: [
      {
        cell_id: "fb9f367c-9dc7-45c4-9453-b06b920c5906",
        word: "bengkel mobil",
        en: "car workshop",
        vi: "tiệm sửa ô tô",
        pos: "noun phrase",
        pronunciation_vi: "BENG-kel MO-bil",
        pronunciation_en: "BENG-kel MO-bil",
      },
      {
        cell_id: "a32a58ed-2d73-41db-8ac9-69c8bb55b7d1",
        word: "ganti oli",
        en: "oil change",
        vi: "thay dầu nhớt",
        pos: "verb phrase",
        pronunciation_vi: "GAN-ti O-li",
        pronunciation_en: "GAN-tee O-lee",
      },
      {
        cell_id: "99760401-64ea-4f15-ba76-549374059615",
        word: "ban",
        en: "tire",
        vi: "lốp xe",
        pos: "noun",
        pronunciation_vi: "BAN",
        pronunciation_en: "BAN",
      },
      {
        cell_id: "f9025f3f-010a-4ee1-9468-d4e208be32ee",
        word: "rem",
        en: "brake",
        vi: "phanh / thắng",
        pos: "noun",
        pronunciation_vi: "rem",
        pronunciation_en: "rem",
      },
      {
        cell_id: "177ad674-0cc0-4e39-aadd-19a144b55498",
        word: "aki",
        en: "car battery",
        vi: "ắc quy",
        pos: "noun",
        pronunciation_vi: "A-ki",
        pronunciation_en: "A-kee",
      },
      {
        cell_id: "a563ba26-73de-42b0-af65-a20c9fbda32f",
        word: "servis berkala",
        en: "routine service",
        vi: "bảo dưỡng định kỳ",
        pos: "noun phrase",
        pronunciation_vi: "SER-vis ber-KA-la",
        pronunciation_en: "SER-vis ber-KA-la",
      },
      {
        cell_id: "4181e2ae-33d3-4c06-b8b6-d168288c7e83",
        word: "biaya jasa",
        en: "labor/service fee",
        vi: "tiền công / phí dịch vụ",
        pos: "noun phrase",
        pronunciation_vi: "BI-a-ya JA-sa",
        pronunciation_en: "BEE-a-ya JA-sa",
      },
      {
        cell_id: "88ce38eb-1188-4ebf-82ed-55b4a454ff87",
        word: "spare part",
        en: "spare part",
        vi: "phụ tùng",
        pos: "noun",
        pronunciation_vi: "SPER-part",
        pronunciation_en: "SPARE-part",
      },
      {
        cell_id: "c0b0f9e4-1095-47d1-9448-1b0d130639f9",
        word: "mogok",
        en: "to stall / break down",
        vi: "chết máy / hỏng giữa đường",
        pos: "verb",
        pronunciation_vi: "MO-gok",
        pronunciation_en: "MO-gok",
      },
      {
        cell_id: "b7f0bb1a-ae15-49f3-a44d-de0115311a2c",
        word: "estimasi biaya",
        en: "cost estimate",
        vi: "ước tính chi phí",
        pos: "noun phrase",
        pronunciation_vi: "es-ti-MA-si BI-a-ya",
        pronunciation_en: "es-tee-MA-see BEE-a-ya",
      },
    ],
    dialogue: [
      {
        cell_id: "02281924-6039-48c8-a3cd-6c25273d1d54",
        speaker: "Pemilik Mobil",
        text: "Mas, mobil saya mogok tadi pagi. Bisa dicek?",
        vi: "Anh ơi, sáng nay xe tôi chết máy. Kiểm tra được không?",
        en: "Sir, my car broke down this morning. Can you check it?",
      },
      {
        cell_id: "373c5267-c7e7-411b-b97d-8b38f3651ee0",
        speaker: "Mekanik",
        text: "Bisa. Akinya lemah atau mesin tidak mau hidup?",
        vi: "Được. Ắc quy yếu hay máy không chịu nổ?",
        en: "Yes. Is the battery weak or does the engine refuse to start?",
      },
      {
        cell_id: "eba53818-5b33-4579-acba-8a0effb712db",
        speaker: "Pemilik Mobil",
        text: "Mesin susah dinyalakan, dan rem juga kurang pakem.",
        vi: "Máy khó khởi động, và phanh cũng không ăn lắm.",
        en: "The engine is hard to start, and the brakes also do not grip well.",
      },
      {
        cell_id: "977048ad-6723-4a44-bb0b-43b3f2a9da5c",
        speaker: "Mekanik",
        text: "Baik, nanti saya beri estimasi biaya jasa dan spare part.",
        vi: "Vâng, lát nữa tôi sẽ đưa ước tính tiền công và phụ tùng.",
        en: "Okay, I will give an estimate for labor and parts later.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ/cụm từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word or phrase with its Vietnamese meaning:",
        items: [
          { prompt: "bengkel mobil", answer: "tiệm sửa ô tô" },
          { prompt: "ganti oli", answer: "thay dầu nhớt" },
          { prompt: "aki", answer: "ắc quy" },
          { prompt: "mogok", answer: "chết máy" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu:",
        instruction_en: "Fill in the missing word:",
        items: [
          {
            prompt: "Saya mau servis mobil ___. (định kỳ)",
            answer: "berkala",
            options: ["berkala", "berjalan", "berangkat"],
          },
          {
            prompt: "Rem mobil saya kurang ___. (ăn/chắc)",
            answer: "pakem",
            options: ["pakem", "paham", "panas"],
          },
          {
            prompt: "Berapa biaya ___ dan harga spare part-nya? (tiền công)",
            answer: "jasa",
            options: ["jasa", "jalan", "janji"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Xe tôi chết máy bên lề đường.", answer: "Mobil saya mogok di pinggir jalan." },
          { prompt: "Ắc quy ô tô yếu.", answer: "Aki mobil lemah." },
          { prompt: "Báo cho tôi trước khi thay phụ tùng đắt tiền.", answer: "Kabari saya dulu sebelum mengganti spare part mahal." },
        ],
      },
    ],
  },
];

export default carWorkshopServiceLessons;
