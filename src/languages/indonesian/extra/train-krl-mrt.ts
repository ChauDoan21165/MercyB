// src/languages/indonesian/extra/train-krl-mrt.ts
//
// Indonesian KRL/MRT public transport pack for Vietnamese learners.
// Covers: KRL, MRT, stasiun, kartu transportasi, tap in, tap out, gerbong,
// jam sibuk, turun di mana, transfers, and station announcements.
//
// Shape mirrors the sibling Indonesian extra files. This file is self-contained:
// it declares inline types and exports one uniquely named lesson array.
//
// Field convention: sentence `en` holds TARGET-LANGUAGE Indonesian; `vi` holds
// Vietnamese. `pronunciation_focus` carries Vietnamese-facing pronunciation and
// grammar notes, including L1 traps; `pronunciation_focus_en` is the English
// companion in the same order.

type LessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
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

export const trainKrlMrtLessons: IndonesianLesson[] = [
  {
    id: "indonesian_krl_mrt_station_card",
    level: "A2",
    category: "transport",
    title_vi: "KRL và MRT — ga, thẻ và cửa soát vé",
    title_en: "KRL and MRT — station, card and gates",
    sentences: [
      {
        en: "Saya mau naik MRT ke Bundaran HI.",
        vi: "Tôi muốn đi MRT đến Bundaran HI.",
        pronunciation_focus: [
          "naik MRT → đi/lên MRT; với phương tiện dùng `naik`, không dùng `pergi` một mình.",
          "ke Bundaran HI → đến Bundaran HI; `ke` chỉ hướng/điểm đến.",
          "Lỗi người Việt: nói `di Bundaran HI` khi đang đi tới. Điểm đến dùng `ke`.",
        ],
        pronunciation_focus_en: [
          "naik MRT → take/ride the MRT; vehicles use `naik`, not only `pergi`.",
          "ke Bundaran HI → to Bundaran HI; `ke` marks direction/destination.",
          "VN-speaker trap: saying `di Bundaran HI` when going there. Destination uses `ke`.",
        ],
      },
      {
        en: "Stasiun KRL terdekat di mana?",
        vi: "Ga KRL gần nhất ở đâu?",
        pronunciation_focus: [
          "stasiun → sta-si-UN, nhà ga; dùng cho KRL, MRT, tàu đường dài.",
          "terdekat → gần nhất; `ter-` tạo nghĩa nhất trong nhiều tính từ.",
          "di mana → ở đâu; viết tách hai từ.",
        ],
        pronunciation_focus_en: [
          "stasiun → sta-see-OON, station; used for KRL, MRT, and intercity trains.",
          "terdekat → nearest; `ter-` often creates a superlative meaning.",
          "di mana → where; written as two words.",
        ],
      },
      {
        en: "Saya perlu kartu transportasi untuk tap in dan tap out.",
        vi: "Tôi cần thẻ giao thông để tap in và tap out.",
        pronunciation_focus: [
          "kartu transportasi → thẻ giao thông; cũng nghe `kartu e-money`.",
          "tap in / tap out → chạm thẻ vào/ra; nói thẳng tiếng Anh trong ga.",
          "Lỗi người Việt: dịch `tap` thành động từ dài. Ở Jakarta, người ta nói `tap in` và `tap out`.",
        ],
        pronunciation_focus_en: [
          "kartu transportasi → transport card; people also say `kartu e-money`.",
          "tap in / tap out → tap the card in/out; English is used directly at stations.",
          "VN-speaker trap: over-translating `tap`. In Jakarta, people say `tap in` and `tap out`.",
        ],
      },
      {
        en: "Saldo kartu saya kurang.",
        vi: "Số dư trong thẻ của tôi không đủ.",
        pronunciation_focus: [
          "saldo kartu → số dư thẻ; `saldo` là từ ngân hàng/app rất thường gặp.",
          "kurang → thiếu/không đủ; không nhất thiết là 'ít' chung chung.",
          "Khung sống còn: `Saldo saya kurang` = số dư của tôi không đủ.",
        ],
        pronunciation_focus_en: [
          "saldo kartu → card balance; `saldo` is common in bank/app language.",
          "kurang → lacking/not enough; not just generally 'small'.",
          "Survival frame: `Saldo saya kurang` = my balance is not enough.",
        ],
      },
      {
        en: "Di mana tempat isi ulang kartu?",
        vi: "Chỗ nạp tiền thẻ ở đâu?",
        pronunciation_focus: [
          "tempat isi ulang → chỗ nạp lại/top up; `isi` = đổ/điền/nạp.",
          "kartu → thẻ; trong ngữ cảnh này là thẻ giao thông hoặc e-money.",
          "Lỗi người Việt: nói `tambah uang kartu`. Tự nhiên hơn: `isi ulang kartu`.",
        ],
        pronunciation_focus_en: [
          "tempat isi ulang → top-up place; `isi` = fill/load.",
          "kartu → card; here a transport or e-money card.",
          "VN-speaker trap: saying `tambah uang kartu`. Natural phrase: `isi ulang kartu`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Jakarta và vùng lân cận, `KRL` thường chỉ tàu điện commuter line Jabodetabek, còn `MRT` là hệ thống metro trong thành phố. Hành khách thường dùng thẻ ngân hàng/e-money hoặc thẻ transport để `tap in` lúc vào ga và `tap out` lúc ra. Nếu `saldo kurang`, bạn phải `isi ulang` trước khi qua cửa. Tên ga và hướng tuyến thường quan trọng hơn số chuyến.",
    cultural_notes_en:
      "In Jakarta and nearby areas, `KRL` usually means the Jabodetabek commuter rail, while `MRT` is the city metro system. Passengers commonly use bank/e-money or transport cards to `tap in` at entry gates and `tap out` at exit gates. If `saldo kurang`, you must top up before passing the gate. Station names and line direction usually matter more than train numbers.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt `di` và `ke` khi đi tàu. `di stasiun` = ở ga; `ke stasiun` = đến ga. Với phương tiện, dùng `naik KRL/MRT`, còn khi xuống dùng `turun di ...`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: separate `di` and `ke` for train travel. `di stasiun` = at the station; `ke stasiun` = to the station. For vehicles, use `naik KRL/MRT`; for getting off, use `turun di ...`.",
    vocabulary: [
      {
        cell_id: "e0921e17-4681-4c67-b02f-fa94f4804794",
        word: "KRL",
        en: "commuter rail",
        vi: "tàu điện commuter",
        pos: "noun",
        pronunciation_vi: "ka-er-el",
        pronunciation_en: "kah-er-el",
      },
      {
        cell_id: "f504faf1-c027-419d-a6fb-ea57c6765f33",
        word: "MRT",
        en: "metro / MRT",
        vi: "tàu MRT / metro",
        pos: "noun",
        pronunciation_vi: "em-er-te",
        pronunciation_en: "em-er-teh",
      },
      {
        cell_id: "55f86cfc-de2d-4dda-9847-d6939cc408a3",
        word: "stasiun",
        en: "station",
        vi: "nhà ga",
        pos: "noun",
        pronunciation_vi: "sta-si-UN",
        pronunciation_en: "sta-see-OON",
      },
      {
        cell_id: "883cf9a7-344a-4fbd-9d75-3db4aeec2b21",
        word: "kartu transportasi",
        en: "transport card",
        vi: "thẻ giao thông",
        pos: "noun phrase",
        pronunciation_vi: "KAR-tu trans-por-TA-si",
        pronunciation_en: "KAR-too trans-por-TA-see",
      },
      {
        cell_id: "a74c8114-62b8-4348-bd47-7112f966c5f5",
        word: "tap in",
        en: "tap in / enter with card",
        vi: "chạm thẻ vào cửa",
        pos: "verb phrase",
        pronunciation_vi: "tep in",
        pronunciation_en: "tap in",
      },
      {
        cell_id: "bcecc287-652f-420d-9eb0-78be937054f5",
        word: "tap out",
        en: "tap out / exit with card",
        vi: "chạm thẻ ra cửa",
        pos: "verb phrase",
        pronunciation_vi: "tep aut",
        pronunciation_en: "tap out",
      },
      {
        cell_id: "f7723ad3-b49b-41e3-aff1-a614d18fcf68",
        word: "saldo",
        en: "balance",
        vi: "số dư",
        pos: "noun",
        pronunciation_vi: "SAL-do",
        pronunciation_en: "SAL-do",
      },
      {
        cell_id: "6eea73bd-4bc5-413e-b6be-e144778f3106",
        word: "isi ulang",
        en: "top up / refill",
        vi: "nạp lại",
        pos: "verb phrase",
        pronunciation_vi: "I-si U-lang",
        pronunciation_en: "EE-see OO-lang",
      },
    ],
    dialogue: [
      {
        cell_id: "27a5346b-9696-4d32-9a8f-6bf0238aa862",
        speaker: "Penumpang",
        text: "Permisi, stasiun MRT terdekat di mana?",
        vi: "Xin lỗi, ga MRT gần nhất ở đâu?",
        en: "Excuse me, where is the nearest MRT station?",
      },
      {
        cell_id: "3baf908f-2837-4402-a525-c433c9762835",
        speaker: "Petugas",
        text: "Di sebelah mal. Ibu punya kartu transportasi?",
        vi: "Bên cạnh trung tâm thương mại. Chị có thẻ giao thông không?",
        en: "Next to the mall. Do you have a transport card?",
      },
      {
        cell_id: "4fab6f20-f1ae-4bc8-a719-532062d66e9d",
        speaker: "Penumpang",
        text: "Punya, tapi saldo kartu saya kurang.",
        vi: "Có, nhưng số dư thẻ của tôi không đủ.",
        en: "Yes, but my card balance is not enough.",
      },
      {
        cell_id: "35cdc66c-de0e-4812-b692-be43eaf00595",
        speaker: "Petugas",
        text: "Silakan isi ulang dulu di mesin itu, lalu tap in.",
        vi: "Vui lòng nạp trước ở máy đó, rồi tap in.",
        en: "Please top up first at that machine, then tap in.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ ga và thẻ còn thiếu:",
        instruction_en: "Fill in the missing station/card word:",
        items: [
          {
            prompt: "Stasiun KRL ___ di mana? (gần nhất)",
            answer: "terdekat",
            options: ["terdekat", "terlambat", "terbuka"],
          },
          {
            prompt: "Saya perlu kartu transportasi untuk ___ in. (chạm thẻ vào)",
            answer: "tap",
            options: ["tap", "top", "tutup"],
          },
          {
            prompt: "Saldo kartu saya ___. (không đủ)",
            answer: "kurang",
            options: ["kurang", "kering", "keras"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "stasiun", answer: "nhà ga" },
          { prompt: "saldo", answer: "số dư" },
          { prompt: "isi ulang", answer: "nạp lại" },
          { prompt: "kartu transportasi", answer: "thẻ giao thông" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn đi MRT đến Bundaran HI.", answer: "Saya mau naik MRT ke Bundaran HI." },
          { prompt: "Số dư trong thẻ của tôi không đủ.", answer: "Saldo kartu saya kurang." },
          { prompt: "Chỗ nạp tiền thẻ ở đâu?", answer: "Di mana tempat isi ulang kartu?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_krl_mrt_platform_carriage",
    level: "B1",
    category: "transport",
    title_vi: "Trên sân ga — toa tàu, giờ cao điểm và xuống ga nào",
    title_en: "On the platform — carriage, rush hour and where to get off",
    sentences: [
      {
        en: "Saya harus turun di stasiun apa?",
        vi: "Tôi phải xuống ở ga nào?",
        pronunciation_focus: [
          "harus turun → phải xuống; `turun` dùng khi xuống xe/tàu.",
          "di stasiun apa → ở ga nào; điểm xuống dùng `di` vì là nơi dừng.",
          "Lỗi người Việt: hỏi `turun ke mana?` cũng nghe được, nhưng `turun di stasiun apa?` rõ hơn.",
        ],
        pronunciation_focus_en: [
          "harus turun → must get off; `turun` is used for leaving a vehicle/train.",
          "di stasiun apa → at which station; the stop location uses `di`.",
          "VN-speaker trap: `turun ke mana?` is understandable, but `turun di stasiun apa?` is clearer.",
        ],
      },
      {
        en: "Kereta ini arah Lebak Bulus atau Bundaran HI?",
        vi: "Tàu này hướng Lebak Bulus hay Bundaran HI?",
        pronunciation_focus: [
          "kereta ini → tàu này; trong đô thị cũng dùng `kereta` cho train.",
          "arah → hướng; hỏi hướng tuyến rất quan trọng.",
          "atau → hay/hoặc; dùng trong câu chọn A hoặc B.",
        ],
        pronunciation_focus_en: [
          "kereta ini → this train; urban train can still be called `kereta`.",
          "arah → direction; asking line direction is essential.",
          "atau → or; used for A-or-B questions.",
        ],
      },
      {
        en: "Gerbong depan lebih kosong daripada gerbong tengah.",
        vi: "Toa phía trước vắng hơn toa giữa.",
        pronunciation_focus: [
          "gerbong → toa tàu; dùng cho KRL/MRT/tàu.",
          "lebih kosong daripada ... → vắng hơn ...; khung so sánh đầy đủ.",
          "Lỗi người Việt: bỏ `daripada`. Khi so sánh rõ hai vế, dùng `daripada`.",
        ],
        pronunciation_focus_en: [
          "gerbong → train carriage/car.",
          "lebih kosong daripada ... → emptier than ...; full comparison frame.",
          "VN-speaker trap: dropping `daripada`. For explicit comparison, use `daripada`.",
        ],
      },
      {
        en: "Jam sibuk biasanya sangat padat.",
        vi: "Giờ cao điểm thường rất đông/chật.",
        pronunciation_focus: [
          "jam sibuk → giờ cao điểm; nghĩa đen là giờ bận.",
          "biasanya → thường; đặt trước tính từ/cụm vị ngữ.",
          "padat → đông/chật/kín; hay dùng cho giao thông.",
        ],
        pronunciation_focus_en: [
          "jam sibuk → rush hour; literally busy hour.",
          "biasanya → usually; placed before the adjective/predicate.",
          "padat → crowded/dense; common for traffic and trains.",
        ],
      },
      {
        en: "Tolong geser sedikit, saya mau keluar.",
        vi: "Làm ơn nhích qua một chút, tôi muốn ra.",
        pronunciation_focus: [
          "tolong geser sedikit → làm ơn nhích qua một chút; lịch sự khi tàu đông.",
          "mau keluar → muốn ra ngoài/đi ra cửa.",
          "Lỗi người Việt: nói `pergi keluar` không sai nhưng dài. Trên tàu nói `mau keluar`.",
        ],
        pronunciation_focus_en: [
          "tolong geser sedikit → please move over a little; polite in a crowded train.",
          "mau keluar → want to get out/exit.",
          "VN-speaker trap: `pergi keluar` is not wrong but too long. On the train say `mau keluar`.",
        ],
      },
      {
        en: "Kalau transit, saya pindah jalur di stasiun Dukuh Atas.",
        vi: "Nếu chuyển tuyến, tôi đổi tuyến ở ga Dukuh Atas.",
        pronunciation_focus: [
          "kalau transit → nếu chuyển tuyến; `transit` là từ mượn rất thường dùng.",
          "pindah jalur → đổi tuyến/đổi line; `jalur` = tuyến/làn/đường.",
          "di stasiun Dukuh Atas → ở ga Dukuh Atas; nơi đổi tuyến dùng `di`.",
        ],
        pronunciation_focus_en: [
          "kalau transit → if transferring; `transit` is a common loanword.",
          "pindah jalur → change line/track; `jalur` = line/lane/path.",
          "di stasiun Dukuh Atas → at Dukuh Atas station; transfer location uses `di`.",
        ],
      },
    ],
    cultural_notes_vi:
      "KRL và MRT ở Jakarta có thể rất đông vào `jam sibuk`, nhất là sáng đi làm và chiều tan tầm. Người đi tàu hay hỏi `arah mana?`, `turun di stasiun apa?`, và `perlu transit tidak?`. `Gerbong wanita` có ở một số dịch vụ KRL vào vị trí nhất định; hãy để ý biển báo trên sân ga. Khi cần ra cửa, nói `permisi` hoặc `tolong geser sedikit` sẽ lịch sự hơn chen im lặng.",
    cultural_notes_en:
      "KRL and MRT in Jakarta can be very crowded during `jam sibuk`, especially morning commute and evening rush. Riders commonly ask `arah mana?`, `turun di stasiun apa?`, and `perlu transit tidak?`. Women-only carriages (`gerbong wanita`) exist on some KRL services in designated positions; watch the platform signs. When you need to reach the door, saying `permisi` or `tolong geser sedikit` is more polite than pushing silently.",
    tip_advice_vi:
      "Mẹo cho người Việt: ba từ vàng khi đi tàu là `arah` (hướng), `turun` (xuống), `transit` (chuyển tuyến). Hỏi đúng hướng trước khi lên: `Kereta ini arah ...?` Khi tàu đông, dùng `permisi` và `tolong geser sedikit`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: the three key train words are `arah` (direction), `turun` (get off), and `transit` (transfer). Ask the direction before boarding: `Kereta ini arah ...?` In a crowded train, use `permisi` and `tolong geser sedikit`.",
    vocabulary: [
      {
        cell_id: "840cdac5-642d-49fd-b78a-feb903704abc",
        word: "turun",
        en: "to get off / go down",
        vi: "xuống",
        pos: "verb",
        pronunciation_vi: "TU-run",
        pronunciation_en: "TOO-roon",
      },
      {
        cell_id: "eb85e0a0-f1c5-4c36-aacf-ccebbf660867",
        word: "arah",
        en: "direction",
        vi: "hướng",
        pos: "noun",
        pronunciation_vi: "A-rah",
        pronunciation_en: "A-rah",
      },
      {
        cell_id: "ca08cd9c-01b1-4d02-b2f9-851224941a1c",
        word: "gerbong",
        en: "train carriage",
        vi: "toa tàu",
        pos: "noun",
        pronunciation_vi: "GER-bong",
        pronunciation_en: "GER-bong",
      },
      {
        cell_id: "554a609b-063b-43d6-b7c6-0bf6d64355ff",
        word: "jam sibuk",
        en: "rush hour",
        vi: "giờ cao điểm",
        pos: "noun phrase",
        pronunciation_vi: "jam SI-buk",
        pronunciation_en: "jam SEE-book",
      },
      {
        cell_id: "c5e3b093-f9ba-4db3-b315-45287b048eea",
        word: "padat",
        en: "crowded / dense",
        vi: "đông / chật",
        pos: "adjective",
        pronunciation_vi: "PA-dat",
        pronunciation_en: "PA-dat",
      },
      {
        cell_id: "544d50f3-5850-4a0e-a7a3-bbc3e082bf40",
        word: "geser",
        en: "to shift / move over",
        vi: "nhích qua",
        pos: "verb",
        pronunciation_vi: "GE-ser",
        pronunciation_en: "GEH-ser",
      },
      {
        cell_id: "87d2bd8c-300b-43bb-8f1b-a89bf903e2a3",
        word: "transit",
        en: "transfer",
        vi: "chuyển tuyến",
        pos: "verb / noun",
        pronunciation_vi: "TRAN-sit",
        pronunciation_en: "TRAN-sit",
      },
      {
        cell_id: "dd3d73c1-0819-4c8c-ba36-dc0435a66779",
        word: "pindah jalur",
        en: "change line / track",
        vi: "đổi tuyến",
        pos: "verb phrase",
        pronunciation_vi: "PIN-dah JA-lur",
        pronunciation_en: "PIN-dah JA-loor",
      },
    ],
    dialogue: [
      {
        cell_id: "1dab4048-c41c-48de-a66f-4703cf0ea559",
        speaker: "Penumpang",
        text: "Maaf, kereta ini arah Bundaran HI?",
        vi: "Xin lỗi, tàu này hướng Bundaran HI phải không?",
        en: "Excuse me, is this train going toward Bundaran HI?",
      },
      {
        cell_id: "0a995693-bd9a-4c26-80ca-05f2097f2128",
        speaker: "Petugas",
        text: "Betul. Ibu turun di stasiun apa?",
        vi: "Đúng. Chị xuống ở ga nào?",
        en: "Correct. Which station are you getting off at?",
      },
      {
        cell_id: "4d8c0937-0a26-457b-9739-ec645271e1da",
        speaker: "Penumpang",
        text: "Saya turun di Dukuh Atas, lalu transit ke KRL.",
        vi: "Tôi xuống ở Dukuh Atas, rồi chuyển sang KRL.",
        en: "I get off at Dukuh Atas, then transfer to KRL.",
      },
      {
        cell_id: "fe80c7b5-04a1-4122-842c-9ad1cc79e947",
        speaker: "Petugas",
        text: "Baik. Saat jam sibuk, gerbong tengah biasanya padat.",
        vi: "Vâng. Vào giờ cao điểm, toa giữa thường đông.",
        en: "Okay. During rush hour, the middle carriage is usually crowded.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đi tàu còn thiếu:",
        instruction_en: "Fill in the missing train word:",
        items: [
          {
            prompt: "Saya harus ___ di stasiun apa? (xuống)",
            answer: "turun",
            options: ["turun", "tukar", "tutup"],
          },
          {
            prompt: "Kereta ini ___ Lebak Bulus atau Bundaran HI? (hướng)",
            answer: "arah",
            options: ["arah", "air", "area"],
          },
          {
            prompt: "Jam sibuk biasanya sangat ___. (đông/chật)",
            answer: "padat",
            options: ["padat", "pendek", "panas"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "gerbong", answer: "toa tàu" },
          { prompt: "jam sibuk", answer: "giờ cao điểm" },
          { prompt: "geser", answer: "nhích qua" },
          { prompt: "pindah jalur", answer: "đổi tuyến" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi phải xuống ở ga nào?", answer: "Saya harus turun di stasiun apa?" },
          { prompt: "Toa phía trước vắng hơn toa giữa.", answer: "Gerbong depan lebih kosong daripada gerbong tengah." },
          { prompt: "Nếu chuyển tuyến, tôi đổi tuyến ở ga Dukuh Atas.", answer: "Kalau transit, saya pindah jalur di stasiun Dukuh Atas." },
        ],
      },
    ],
  },
];
