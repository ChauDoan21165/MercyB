// Grab / Gojek Passenger Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson. Field convention follows the Indonesian extra
// pack: sentence `en` holds TARGET-LANGUAGE Indonesian, `vi` holds Vietnamese,
// Vietnamese L1 notes live in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en` with the same order.

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
    id: "indonesian_grab_gojek_passenger",
    level: "A2",
    category: "transport",
    title_vi: "Đi Grab/Gojek ở Indonesia: đặt xe, giá và khiếu nại",
    title_en: "Using Grab/Gojek in Indonesia: booking, fares and complaints",
    sentences: [
      {
        en: "Saya mau pesan ojek ke stasiun.",
        vi: "Tôi muốn đặt xe ôm công nghệ đến ga.",
        pronunciation_focus: [
          "SA-ya mau PE-san O-jek ke sta-si-UN — `pesan ojek` = đặt xe ôm; `ke` = đến.",
          "Lỗi người Việt: nói `pesan ke stasiun`. `Pesan` lấy đối tượng là xe/dịch vụ; điểm đến đi với `ke`.",
          "Luyện: `Saya mau pesan ojek ke stasiun.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau PE-san O-jek ke sta-see-OON — `pesan ojek` = book a motorbike taxi; `ke` = to.",
          "VN-speaker trap: saying `pesan ke stasiun`. `Pesan` takes the ride/service as its object; destination uses `ke`.",
          "Drill: `Saya mau pesan ojek ke stasiun.`",
        ],
      },
      {
        en: "Tujuan saya Bandara Soekarno-Hatta.",
        vi: "Điểm đến của tôi là sân bay Soekarno-Hatta.",
        pronunciation_focus: [
          "tu-JU-an SA-ya ban-DA-ra — `tujuan` = điểm đến/mục đích; thường dùng trong app.",
          "Lỗi người Việt: chỉ nói `saya ke...` khi app hỏi điểm đến. Câu đủ: `Tujuan saya...`.",
          "Luyện: `Tujuan saya bandara.`",
        ],
        pronunciation_focus_en: [
          "too-JOO-an SA-ya ban-DA-ra — `tujuan` = destination/purpose; common in apps.",
          "VN-speaker trap: only saying `saya ke...` when the app asks for destination. Full phrase: `Tujuan saya...`.",
          "Drill: `Tujuan saya bandara.`",
        ],
      },
      {
        en: "Tolong jemput saya di depan lobi hotel.",
        vi: "Làm ơn đón tôi trước sảnh khách sạn.",
        pronunciation_focus: [
          "TO-long JEM-put SA-ya di de-PAN LO-bi ho-TEL — `jemput` = đón; `di depan` = ở phía trước.",
          "Lỗi người Việt: lẫn `di depan` và `ke depan`. Điểm đón đứng yên nên dùng `di depan`.",
          "Luyện: `Jemput saya di depan lobi.`",
        ],
        pronunciation_focus_en: [
          "TO-long JEM-poot SA-ya di de-PAN LO-bi ho-TEL — `jemput` = pick up; `di depan` = in front of.",
          "VN-speaker trap: mixing `di depan` and `ke depan`. A fixed pickup point uses `di depan`.",
          "Drill: `Jemput saya di depan lobi.`",
        ],
      },
      {
        en: "Tarifnya berapa sebelum promo?",
        vi: "Giá cước trước khuyến mãi là bao nhiêu?",
        pronunciation_focus: [
          "TA-rif-nya be-RA-pa se-BE-lum PRO-mo — `tarif` = giá cước; `promo` = khuyến mãi.",
          "Lỗi người Việt: dùng `harga` được nhưng trong xe/app `tarif` tự nhiên hơn.",
          "Luyện: `Tarifnya berapa?`",
        ],
        pronunciation_focus_en: [
          "TA-rif-nya be-RA-pa se-BE-lum PRO-mo — `tarif` = fare/rate; `promo` = promotion/discount.",
          "VN-speaker trap: `harga` works, but for rides/apps `tarif` is more natural.",
          "Drill: `Tarifnya berapa?`",
        ],
      },
      {
        en: "Saya pakai promo, jadi lebih murah.",
        vi: "Tôi dùng mã khuyến mãi nên rẻ hơn.",
        pronunciation_focus: [
          "SA-ya PA-kai PRO-mo, JA-di le-BIH MU-rah — `pakai promo` = dùng khuyến mãi; `jadi` = nên/thành ra.",
          "Lỗi người Việt: nói `gunakan promosi` quá trang trọng. Trong app nói gọn `pakai promo`.",
          "Luyện: `Saya pakai promo.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PA-kai PRO-mo, JA-di le-BIH MOO-rah — `pakai promo` = use a discount/promo; `jadi` = so.",
          "VN-speaker trap: saying formal `gunakan promosi`. In app speech, use `pakai promo`.",
          "Drill: `Saya pakai promo.`",
        ],
      },
      {
        en: "Drivernya sudah dekat belum?",
        vi: "Tài xế đã tới gần chưa?",
        pronunciation_focus: [
          "DRAI-ver-nya SU-dah DE-kat be-LUM — `sudah...belum?` = đã...chưa?",
          "Lỗi người Việt: hỏi `sudah dekat tidak?`. Với 'đã...chưa' dùng `belum`, không phải `tidak`.",
          "Luyện: `Drivernya sudah dekat belum?`",
        ],
        pronunciation_focus_en: [
          "DRY-ver-nya SOO-dah DE-kat be-LOOM — `sudah...belum?` = has it...yet?",
          "VN-speaker trap: asking `sudah dekat tidak?`. For 'has it yet', use `belum`, not `tidak`.",
          "Drill: `Drivernya sudah dekat belum?`",
        ],
      },
      {
        en: "Saya tunggu di pintu masuk, ya.",
        vi: "Tôi chờ ở cổng vào nhé.",
        pronunciation_focus: [
          "SA-ya TUNG-gu di PIN-tu MA-suk ya — `tunggu` = chờ; `pintu masuk` = cửa/cổng vào.",
          "Lỗi người Việt: nói `saya tunggu driver` thiếu nơi chốn. Thêm `di...` giúp tài xế tìm đúng.",
          "Luyện: `Saya tunggu di pintu masuk.`",
        ],
        pronunciation_focus_en: [
          "SA-ya TOONG-goo di PIN-too MA-sook ya — `tunggu` = wait; `pintu masuk` = entrance.",
          "VN-speaker trap: saying `saya tunggu driver` without location. Add `di...` so the driver can find you.",
          "Drill: `Saya tunggu di pintu masuk.`",
        ],
      },
      {
        en: "Boleh lewat jalan tol kalau lebih cepat.",
        vi: "Có thể đi đường cao tốc nếu nhanh hơn.",
        pronunciation_focus: [
          "BO-leh LE-wat JA-lan tol KA-lau le-BIH CE-pat — `boleh` = được/có thể; `lewat` = đi qua.",
          "Lỗi người Việt: đọc `cepat` như ke-pat. Chữ `c` Indonesia = 'ch': CHE-pat.",
          "Luyện: `Boleh lewat jalan tol.`",
        ],
        pronunciation_focus_en: [
          "BO-leh LEH-wat JA-lan tol KA-lau le-BIH CHE-pat — `boleh` = may/can; `lewat` = go via.",
          "VN-speaker trap: reading `cepat` as ke-pat. Indonesian `c` = 'ch': CHE-pat.",
          "Drill: `Boleh lewat jalan tol.`",
        ],
      },
      {
        en: "Barang saya tertinggal di mobil Grab.",
        vi: "Đồ của tôi bị bỏ quên trên xe Grab.",
        pronunciation_focus: [
          "BA-rang SA-ya ter-ting-GAL di MO-bil grab — `tertinggal` = bị bỏ quên; `barang` = đồ/vật.",
          "Lỗi người Việt: nói `lupa barang`. Tự nhiên hơn: `barang saya tertinggal`.",
          "Luyện: `Barang saya tertinggal di mobil.`",
        ],
        pronunciation_focus_en: [
          "BA-rang SA-ya ter-ting-GAL di MO-bil Grab — `tertinggal` = left behind; `barang` = item/belonging.",
          "VN-speaker trap: saying `lupa barang`. More natural: `barang saya tertinggal`.",
          "Drill: `Barang saya tertinggal di mobil.`",
        ],
      },
      {
        en: "Saya mau komplain karena driver cancel tiba-tiba.",
        vi: "Tôi muốn khiếu nại vì tài xế hủy chuyến đột ngột.",
        pronunciation_focus: [
          "SA-ya mau kom-PLAIN ka-RE-na DRAI-ver KEN-sel TI-ba TI-ba — `komplain` = khiếu nại; `tiba-tiba` = đột ngột.",
          "Lỗi người Việt: dùng `mengeluh` cho khiếu nại trong app. Nút hỗ trợ thường là `komplain`/`laporkan`.",
          "Luyện: `Saya mau komplain.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau kom-PLAIN ka-RE-na DRY-ver KEN-sel TI-ba TI-ba — `komplain` = complain/file a complaint; `tiba-tiba` = suddenly.",
          "VN-speaker trap: using `mengeluh` for an app complaint. Support flow commonly uses `komplain`/`laporkan`.",
          "Drill: `Saya mau komplain.`",
        ],
      },
      {
        en: "Saya kasih rating lima karena drivernya ramah.",
        vi: "Tôi cho năm sao vì tài xế thân thiện.",
        pronunciation_focus: [
          "SA-ya KA-sih RA-ting LI-ma ka-RE-na DRAI-ver-nya RA-mah — `kasih` = cho; `ramah` = thân thiện.",
          "Lỗi người Việt: dịch 'đánh giá' thành câu dài. Trong app nói gọn: `kasih rating lima`.",
          "Luyện: `Saya kasih rating lima.`",
        ],
        pronunciation_focus_en: [
          "SA-ya KA-sih RA-ting LI-ma ka-RE-na DRY-ver-nya RA-mah — `kasih` = give; `ramah` = friendly.",
          "VN-speaker trap: over-translating 'review/rate'. In app speech: `kasih rating lima`.",
          "Drill: `Saya kasih rating lima.`",
        ],
      },
      {
        en: "Tolong antar saya sampai depan gedung.",
        vi: "Làm ơn chở tôi đến tận trước tòa nhà.",
        pronunciation_focus: [
          "TO-long AN-tar SA-ya SAM-pai de-PAN GE-dung — `antar` = chở/đưa đến; `sampai` = đến tận.",
          "Lỗi người Việt: lẫn `antar` và `jemput`. `Jemput` = đón; `antar` = chở tới điểm đến.",
          "Luyện: `Antar saya sampai depan gedung.`",
        ],
        pronunciation_focus_en: [
          "TO-long AN-tar SA-ya SAM-pai de-PAN GE-doong — `antar` = take/drop off; `sampai` = all the way to.",
          "VN-speaker trap: mixing `antar` and `jemput`. `Jemput` = pick up; `antar` = take to the destination.",
          "Drill: `Antar saya sampai depan gedung.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, Grab và Gojek là công cụ đi lại hằng ngày. Khách thường nhắn ngắn trong app: xác nhận `titik jemput` (điểm đón), mô tả áo/quầy/cổng, hỏi `sudah dekat belum?`, và nói rõ nếu muốn đi đường tol. Với ojek xe máy, đội `helm` là bắt buộc. Nếu bị cancel, bị tính sai tarif, hoặc để quên đồ, vào menu bantuan/support để `komplain` hoặc `laporkan masalah`.",
    cultural_notes_en:
      "In Indonesia, Grab and Gojek are everyday transport tools. Passengers usually send short app messages: confirm the `titik jemput` (pickup point), describe clothing/counter/gate, ask `sudah dekat belum?`, and say clearly if they want the toll road. On motorbike rides, wearing a `helm` is required. If a ride is canceled, the fare is wrong, or an item is left behind, use the help/support menu to `komplain` or `laporkan masalah`.",
    tip_advice_vi:
      "Mẹo cho người Việt: ba động từ cần tách rõ là `pesan` (đặt), `jemput` (đón), `antar` (chở đến). Điểm tĩnh dùng `di`: `di depan lobi`; hướng đến dùng `ke`: `ke stasiun`. Câu hỏi 'đã...chưa?' là `sudah...belum?`, không phải `sudah...tidak?`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: keep three verbs separate: `pesan` (book), `jemput` (pick up), `antar` (take/drop off). Static location uses `di`: `di depan lobi`; destination uses `ke`: `ke stasiun`. The 'has it...yet?' question is `sudah...belum?`, not `sudah...tidak?`.",
    vocabulary: [
      {
        cell_id: "8b6ff4ba-7597-4579-b261-2efcb6f109de",
        word: "pesan ojek",
        en: "book a motorbike taxi",
        vi: "đặt xe ôm công nghệ",
        pos: "verb phrase",
        pronunciation_vi: "PE-san O-jek",
        pronunciation_en: "PE-san OH-jek",
      },
      {
        cell_id: "89fd69a0-b057-41e9-9c19-c6c927581474",
        word: "tujuan",
        en: "destination",
        vi: "điểm đến",
        pos: "noun",
        pronunciation_vi: "tu-JU-an",
        pronunciation_en: "too-JOO-an",
      },
      {
        cell_id: "7abc8627-74db-4b0f-9219-38ad8950b604",
        word: "tarif",
        en: "fare / rate",
        vi: "giá cước",
        pos: "noun",
        pronunciation_vi: "TA-rif",
        pronunciation_en: "TA-rif",
      },
      {
        cell_id: "4f76c0bf-d615-45ad-9caa-5e2cf7cbb527",
        word: "promo",
        en: "promotion / discount",
        vi: "khuyến mãi",
        pos: "noun",
        pronunciation_vi: "PRO-mo",
        pronunciation_en: "PRO-mo",
      },
      {
        cell_id: "b4ff6a9b-691c-4402-946b-e74b0a54fb96",
        word: "rating",
        en: "rating",
        vi: "điểm đánh giá",
        pos: "noun",
        pronunciation_vi: "RA-ting",
        pronunciation_en: "RA-ting",
      },
      {
        cell_id: "0a15a4b2-ddff-4310-b04a-30dbe489ba14",
        word: "barang tertinggal",
        en: "item left behind",
        vi: "đồ bị bỏ quên",
        pos: "noun phrase",
        pronunciation_vi: "BA-rang ter-ting-GAL",
        pronunciation_en: "BA-rang ter-ting-GAL",
      },
      {
        cell_id: "df7adab1-f780-45b3-b5b4-1b7ee5ef51b7",
        word: "komplain",
        en: "complaint / to complain",
        vi: "khiếu nại",
        pos: "noun / verb",
        pronunciation_vi: "kom-PLAIN",
        pronunciation_en: "kom-PLAIN",
      },
      {
        cell_id: "e26a207f-b15b-494b-8254-85a7f7d4cbcf",
        word: "titik jemput",
        en: "pickup point",
        vi: "điểm đón",
        pos: "noun phrase",
        pronunciation_vi: "TI-tik JEM-put",
        pronunciation_en: "TEE-tik JEM-poot",
      },
      {
        cell_id: "fc456f10-9e76-40f0-8fc2-00c73c598191",
        word: "driver",
        en: "driver",
        vi: "tài xế",
        pos: "noun",
        pronunciation_vi: "DRAI-ver",
        pronunciation_en: "DRY-ver",
      },
      {
        cell_id: "28e26a90-21a2-4bae-b988-cbc8669bd195",
        word: "cancel",
        en: "cancel",
        vi: "hủy chuyến",
        pos: "verb",
        pronunciation_vi: "KEN-sel",
        pronunciation_en: "KEN-sel",
      },
      {
        cell_id: "bb2eb710-af46-4868-b5c5-27ee85fd36ea",
        word: "antar",
        en: "take / drop off",
        vi: "chở đến / đưa đến",
        pos: "verb",
        pronunciation_vi: "AN-tar",
        pronunciation_en: "AN-tar",
      },
      {
        cell_id: "9338d855-1cba-411c-9c53-d4cb54cec9d4",
        word: "jemput",
        en: "pick up",
        vi: "đón",
        pos: "verb",
        pronunciation_vi: "JEM-put",
        pronunciation_en: "JEM-poot",
      },
    ],
    dialogue: [
      {
        cell_id: "aa14d812-31a4-4e61-9753-57e72b3a7f94",
        speaker: "Penumpang",
        text: "Halo, Pak. Saya tunggu di depan lobi hotel.",
        vi: "Alo anh. Tôi chờ trước sảnh khách sạn.",
        en: "Hello, sir. I am waiting in front of the hotel lobby.",
      },
      {
        cell_id: "e4c3cb54-837c-464e-bc4c-9ddc1a5ee64c",
        speaker: "Driver",
        text: "Baik, saya sudah dekat. Tujuannya ke mana?",
        vi: "Vâng, tôi đã gần tới. Điểm đến ở đâu ạ?",
        en: "Okay, I am nearby. Where is the destination?",
      },
      {
        cell_id: "18253e2e-1760-49c9-9c30-7894a510d08a",
        speaker: "Penumpang",
        text: "Tujuan saya stasiun. Boleh lewat jalan tol kalau lebih cepat.",
        vi: "Điểm đến của tôi là ga. Có thể đi đường cao tốc nếu nhanh hơn.",
        en: "My destination is the station. We can take the toll road if it is faster.",
      },
      {
        cell_id: "85c322d4-d72f-48bc-989f-366bad7374ce",
        speaker: "Driver",
        text: "Siap. Nanti tolong kasih rating kalau perjalanan aman.",
        vi: "Được ạ. Lát nữa làm ơn cho đánh giá nếu chuyến đi an toàn.",
        en: "Sure. Please give a rating later if the trip is safe.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ dùng trong Grab/Gojek:",
        instruction_en: "Fill in the Grab/Gojek word:",
        items: [
          {
            prompt: "Saya mau ___ ojek ke stasiun. (đặt)",
            answer: "pesan",
            options: ["pesan", "pasar", "pindah"],
          },
          {
            prompt: "___ saya Bandara Soekarno-Hatta. (điểm đến)",
            answer: "Tujuan",
            options: ["Tujuan", "Tunjuk", "Turun"],
          },
          {
            prompt: "Barang saya ___ di mobil Grab. (bị bỏ quên)",
            answer: "tertinggal",
            options: ["tertinggal", "tinggi", "terima"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "tarif", answer: "giá cước" },
          { prompt: "promo", answer: "khuyến mãi" },
          { prompt: "rating", answer: "điểm đánh giá" },
          { prompt: "komplain", answer: "khiếu nại" },
          { prompt: "titik jemput", answer: "điểm đón" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          {
            prompt: "Tôi muốn đặt xe ôm công nghệ đến ga.",
            answer: "Saya mau pesan ojek ke stasiun.",
          },
          {
            prompt: "Đồ của tôi bị bỏ quên trên xe Grab.",
            answer: "Barang saya tertinggal di mobil Grab.",
          },
          {
            prompt: "Tôi cho năm sao vì tài xế thân thiện.",
            answer: "Saya kasih rating lima karena drivernya ramah.",
          },
        ],
      },
    ],
  },
];
