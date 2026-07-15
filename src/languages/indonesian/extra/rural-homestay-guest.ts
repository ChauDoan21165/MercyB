// Indonesian rural homestay guest lesson pack for Vietnamese learners.
//
// Self-contained extra lesson file following the established Indonesian format.
// The `en` field holds TARGET-LANGUAGE Indonesian; `vi` holds the Vietnamese
// gloss. Pronunciation notes include Vietnamese L1 traps plus English companions.

type LessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
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
  content?: string;
};

export const ruralHomestayGuestLessons: IndonesianLesson[] = [
  {
    id: "indonesian_rural_homestay_arrival",
    level: "A2",
    category: "travel",
    title_vi: "Đến homestay desa và chào tuan rumah",
    title_en: "Arriving at a village homestay and greeting the host",
    sentences: [
      {
        en: "Saya menginap di homestay desa selama dua malam.",
        vi: "Tôi ở homestay làng quê trong hai đêm.",
        pronunciation_focus: [
          "SA-ya me-NGI-nap di HOM-stay DE-sa se-LA-ma DU-a MA-lam.",
          "`homestay desa` = homestay ở làng quê; `menginap` = ngủ lại/ở qua đêm.",
          "L1 Việt: đừng dùng `tinggal` nếu chỉ ở vài đêm du lịch; dùng `menginap` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya me-NGI-nap di HOM-stay DE-sa se-LA-ma DU-a MA-lam.",
          "`homestay desa` = village/rural homestay; `menginap` = stay overnight.",
          "VN-speaker trap: do not use `tinggal` for a short tourist stay; `menginap` is more natural.",
        ],
      },
      {
        en: "Tuan rumah menyambut kami dengan ramah.",
        vi: "Chủ nhà đón chúng tôi một cách thân thiện.",
        pronunciation_focus: [
          "TU-an RU-mah me-NYAM-but KA-mi de-NGAN RA-mah.",
          "`tuan rumah` = chủ nhà/người tiếp khách; `dengan ramah` = thân thiện.",
          "L1 Việt: `tuan rumah` là một cụm, không dịch từng chữ thành 'ông nhà'.",
        ],
        pronunciation_focus_en: [
          "TU-an RU-mah me-NYAM-but KA-mi de-NGAN RA-mah.",
          "`tuan rumah` = host; `dengan ramah` = warmly/friendly.",
          "VN-speaker note: `tuan rumah` is a fixed phrase; do not translate it word by word as 'house lord'.",
        ],
      },
      {
        en: "Apakah sarapan sudah termasuk dalam harga kamar?",
        vi: "Bữa sáng đã bao gồm trong giá phòng chưa?",
        pronunciation_focus: [
          "a-PA-kah sa-RA-pan SU-dah ter-MA-suk DA-lam HAR-ga KA-mar.",
          "`sarapan` = bữa sáng/ăn sáng; `sudah termasuk` = đã bao gồm.",
          "L1 Việt: cụm tự nhiên là `termasuk dalam harga`, giữ `dalam` khi nói bao gồm trong giá.",
        ],
        pronunciation_focus_en: [
          "a-PA-kah sa-RA-pan SU-dah ter-MA-suk DA-lam HAR-ga KA-mar.",
          "`sarapan` = breakfast / to have breakfast; `sudah termasuk` = already included.",
          "VN-speaker trap: the natural phrase is `termasuk dalam harga`; keep `dalam` for included in the price.",
        ],
      },
      {
        en: "Kamar mandi luar ada di sebelah dapur.",
        vi: "Phòng tắm bên ngoài ở cạnh bếp.",
        pronunciation_focus: [
          "KA-mar MAN-di LU-ar A-da di se-BE-lah DA-pur.",
          "`kamar mandi luar` = phòng tắm bên ngoài/phòng tắm chung ngoài phòng ngủ.",
          "L1 Việt: `di sebelah` = ở bên cạnh; không dùng `ke sebelah` nếu chỉ vị trí.",
        ],
        pronunciation_focus_en: [
          "KA-mar MAN-di LU-ar A-da di se-BE-lah DA-pur.",
          "`kamar mandi luar` = outside bathroom / shared bathroom outside the bedroom.",
          "VN-speaker trap: `di sebelah` = next to; do not use `ke sebelah` for a static location.",
        ],
      },
      {
        en: "Tolong jelaskan aturan rumah untuk tamu.",
        vi: "Làm ơn giải thích nội quy nhà cho khách.",
        pronunciation_focus: [
          "TO-long je-LAS-kan a-TUR-an RU-mah UN-tuk TA-mu.",
          "`aturan rumah` = nội quy nhà; `tamu` = khách đến ở/chơi, không phải khách hàng.",
          "L1 Việt: `tolong jelaskan` là khung lịch sự để hỏi quy định mà không nghe cộc.",
        ],
        pronunciation_focus_en: [
          "TO-long je-LAS-kan a-TUR-an RU-mah UN-tuk TA-mu.",
          "`aturan rumah` = house rules; `tamu` = guest/visitor, not a paying customer in general.",
          "VN-speaker note: `tolong jelaskan` is a polite frame for asking about rules without sounding abrupt.",
        ],
      },
    ],
    cultural_notes_vi:
      "Homestay desa ở Indonesia thường là nhà gia đình hoặc rumah warga được mở cho khách. Tiện nghi có thể sederhana: kamar mandi luar, air panas terbatas, listrik atau sinyal tidak selalu kuat. Tuan rumah biasanya menghargai tamu yang menyapa, melepas alas kaki jika diminta, bertanya aturan rumah, và tôn trọng giờ nghỉ gia đình.",
    cultural_notes_en:
      "A village homestay in Indonesia is often a family home or resident house opened to guests. Facilities may be simple: an outside bathroom, limited hot water, and electricity or signal that may not always be strong. Hosts usually appreciate guests who greet people, remove footwear if asked, ask about house rules, and respect family rest hours.",
    tip_advice_vi:
      "Mẫu nên học: `Saya menginap di...`, `Sarapan sudah termasuk?`, `Kamar mandi luar di mana?`, `Tolong jelaskan aturan rumah`. Người Việt cần phân biệt `menginap` (ở qua đêm ngắn hạn) với `tinggal` (sống/cư trú).",
    tip_advice_en:
      "Useful frames: `Saya menginap di...`, `Sarapan sudah termasuk?`, `Kamar mandi luar di mana?`, `Tolong jelaskan aturan rumah`. Vietnamese speakers should distinguish `menginap` (short overnight stay) from `tinggal` (live/reside).",
    vocabulary: [
      {
        cell_id: "479ebd98-63c1-4532-9ff6-5b9e39cda8b5",
        word: "homestay desa",
        en: "village homestay",
        vi: "homestay làng quê",
        pos: "noun phrase",
        pronunciation_vi: "HOM-stay DE-sa",
        pronunciation_en: "HOM-stay DE-sa",
      },
      {
        cell_id: "6037452b-06e6-43ba-a569-8c58bf7ace25",
        word: "tuan rumah",
        en: "host",
        vi: "chủ nhà / người tiếp khách",
        pos: "noun phrase",
        pronunciation_vi: "TU-an RU-mah",
        pronunciation_en: "TOO-an ROO-mah",
      },
      {
        cell_id: "2a7f60b3-4082-4196-9fd3-c0cdb91ae580",
        word: "menginap",
        en: "to stay overnight",
        vi: "ở qua đêm",
        pos: "verb",
        pronunciation_vi: "me-NGI-nap",
        pronunciation_en: "me-NGI-nap",
      },
      {
        cell_id: "584bac73-8dda-4f6e-8a5e-9d826e113989",
        word: "sarapan",
        en: "breakfast",
        vi: "bữa sáng / ăn sáng",
        pos: "noun / verb",
        pronunciation_vi: "sa-RA-pan",
        pronunciation_en: "sa-RA-pan",
      },
      {
        cell_id: "81caa57c-30f8-4641-a93e-70f080e1597d",
        word: "kamar mandi luar",
        en: "outside bathroom",
        vi: "phòng tắm bên ngoài",
        pos: "noun phrase",
        pronunciation_vi: "KA-mar MAN-di LU-ar",
        pronunciation_en: "KA-mar MAN-dee LOO-ar",
      },
      {
        cell_id: "25e984ff-e385-4725-9c03-058201a2ee9a",
        word: "aturan rumah",
        en: "house rules",
        vi: "nội quy nhà",
        pos: "noun phrase",
        pronunciation_vi: "a-TUR-an RU-mah",
        pronunciation_en: "a-TOOR-an ROO-mah",
      },
    ],
    dialogue: [
      {
        cell_id: "251cf917-d84a-4cc7-95e9-9c026abe5e6c",
        speaker: "Tamu",
        text: "Selamat sore, Bu. Saya tamu atas nama Nguyen.",
        vi: "Chào buổi chiều cô/bác. Tôi là khách đặt tên Nguyen.",
        en: "Good afternoon, Ma'am. I am the guest under the name Nguyen.",
      },
      {
        cell_id: "cddd9f87-421c-404b-9454-2cf7c57537f4",
        speaker: "Tuan rumah",
        text: "Selamat datang. Silakan masuk, kamarnya di sebelah kanan.",
        vi: "Chào mừng. Mời vào, phòng ở bên phải.",
        en: "Welcome. Please come in, the room is on the right.",
      },
      {
        cell_id: "b9240278-d23a-49cc-a3a2-66e4aaacc8ba",
        speaker: "Tamu",
        text: "Terima kasih. Apakah sarapan sudah termasuk?",
        vi: "Cảm ơn. Bữa sáng đã bao gồm chưa?",
        en: "Thank you. Is breakfast included?",
      },
      {
        cell_id: "ab97d8b5-98e0-45b2-9edf-b1bfe2495968",
        speaker: "Tuan rumah",
        text: "Sudah. Kamar mandi luar ada di sebelah dapur.",
        vi: "Rồi. Phòng tắm bên ngoài ở cạnh bếp.",
        en: "Yes. The outside bathroom is next to the kitchen.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ phù hợp về homestay desa:",
        instruction_en: "Fill in the suitable rural homestay word:",
        items: [
          {
            prompt: "Saya ___ di homestay desa selama dua malam. (ở qua đêm)",
            answer: "menginap",
            options: ["menginap", "mencuci", "menjual"],
          },
          {
            prompt: "Apakah ___ sudah termasuk dalam harga kamar? (bữa sáng)",
            answer: "sarapan",
            options: ["sarapan", "sambal", "sepeda"],
          },
          {
            prompt: "Tolong jelaskan aturan ___ untuk tamu. (nhà)",
            answer: "rumah",
            options: ["rumah", "rute", "roda"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi ở homestay làng quê trong hai đêm.", answer: "Saya menginap di homestay desa selama dua malam." },
          { prompt: "Bữa sáng đã bao gồm trong giá phòng chưa?", answer: "Apakah sarapan sudah termasuk dalam harga kamar?" },
          { prompt: "Phòng tắm bên ngoài ở cạnh bếp.", answer: "Kamar mandi luar ada di sebelah dapur." },
        ],
      },
    ],
  },
  {
    id: "indonesian_village_tour_guest_etiquette",
    level: "B1",
    category: "travel",
    title_vi: "Wisata desa và phép lịch sự của khách",
    title_en: "Village tourism and guest etiquette",
    sentences: [
      {
        en: "Besok pagi kami ikut wisata desa dengan pemandu lokal.",
        vi: "Sáng mai chúng tôi tham gia tour làng quê với hướng dẫn viên địa phương.",
        pronunciation_focus: [
          "BE-sok PA-gi KA-mi I-kut wi-SA-ta DE-sa de-NGAN pe-MAN-du LO-kal.",
          "`wisata desa` = du lịch/tham quan làng quê; `pemandu lokal` = hướng dẫn viên địa phương.",
          "L1 Việt: `ikut wisata` = tham gia chuyến tham quan; không cần động từ dài như `berpartisipasi`.",
        ],
        pronunciation_focus_en: [
          "BE-sok PA-gi KA-mi I-kut wi-SA-ta DE-sa de-NGAN pe-MAN-du LO-kal.",
          "`wisata desa` = village tourism/tour; `pemandu lokal` = local guide.",
          "VN-speaker note: `ikut wisata` = join a tour; no need for a long verb like `berpartisipasi`.",
        ],
      },
      {
        en: "Boleh saya mengambil foto di sini?",
        vi: "Tôi có thể chụp ảnh ở đây không?",
        pronunciation_focus: [
          "BO-leh SA-ya me-NGAM-bil FO-to di SI-ni.",
          "`mengambil foto` = chụp ảnh; trong nói nhanh cũng nghe `foto-foto`.",
          "L1 Việt: ở nhà dân, ruộng, nơi thờ cúng, nên hỏi `boleh...?` trước khi chụp.",
        ],
        pronunciation_focus_en: [
          "BO-leh SA-ya me-NGAM-bil FO-to di SI-ni.",
          "`mengambil foto` = take a photo; in casual speech you may hear `foto-foto`.",
          "VN-speaker note: in homes, fields, or sacred spaces, ask `boleh...?` before taking photos.",
        ],
      },
      {
        en: "Kami ingin menghormati adat dan kebiasaan setempat.",
        vi: "Chúng tôi muốn tôn trọng phong tục và thói quen địa phương.",
        pronunciation_focus: [
          "KA-mi I-ngin meng-hor-MA-ti A-dat dan ke-bi-a-SA-an se-TEM-pat.",
          "`adat` = phong tục/tập quán; `setempat` = địa phương/tại nơi này.",
          "L1 Việt: `menghormati` cần đối tượng trực tiếp: `menghormati adat`, `menghormati tuan rumah`.",
        ],
        pronunciation_focus_en: [
          "KA-mi I-ngin meng-hor-MA-ti A-dat dan ke-bi-a-SA-an se-TEM-pat.",
          "`adat` = custom/tradition; `setempat` = local/in this place.",
          "VN-speaker note: `menghormati` takes a direct object: `menghormati adat`, `menghormati tuan rumah`.",
        ],
      },
      {
        en: "Kalau masuk rumah, apakah kami harus melepas sandal?",
        vi: "Nếu vào nhà, chúng tôi có phải cởi dép không?",
        pronunciation_focus: [
          "KA-lau MA-suk RU-mah, a-PA-kah KA-mi HA-rus me-LE-pas SAN-dal.",
          "`melepas sandal` = cởi dép; `harus` = phải.",
          "L1 Việt: hỏi bằng `apakah kami harus...` nghe lịch sự hơn tự đoán quy định nhà.",
        ],
        pronunciation_focus_en: [
          "KA-lau MA-suk ROO-mah, a-PA-kah KA-mi HA-rus me-LE-pas SAN-dal.",
          "`melepas sandal` = take off sandals; `harus` = must.",
          "VN-speaker note: asking `apakah kami harus...` sounds more polite than guessing house rules.",
        ],
      },
      {
        en: "Terima kasih sudah menerima kami dengan hangat.",
        vi: "Cảm ơn vì đã đón tiếp chúng tôi nồng hậu.",
        pronunciation_focus: [
          "te-RI-ma KA-sih SU-dah me-ne-RI-ma KA-mi de-NGAN HA-ngat.",
          "`menerima kami dengan hangat` = đón tiếp chúng tôi nồng hậu.",
          "L1 Việt: `hangat` nghĩa là ấm, nhưng trong lời cảm ơn có nghĩa là nồng hậu/ấm áp.",
        ],
        pronunciation_focus_en: [
          "te-RI-ma KA-sih SU-dah me-ne-RI-ma KA-mi de-NGAN HA-ngat.",
          "`menerima kami dengan hangat` = welcome us warmly.",
          "VN-speaker note: `hangat` means warm, and in thanks it means warm-hearted/warmly.",
        ],
      },
    ],
    cultural_notes_vi:
      "Wisata desa thường đưa khách đến rumah warga, sawah, kebun, kerajinan lokal, hoặc acara kecil trong cộng đồng. Vì đây không phải khách sạn lớn, sopan santun tamu rất quan trọng: hỏi trước khi chụp ảnh, mặc đồ phù hợp, không quá ồn, không bước vào phòng pribadi, và mengikuti aturan rumah. Một món quà nhỏ hoặc lời cảm ơn chân thành thường được đánh giá cao.",
    cultural_notes_en:
      "Village tourism often brings guests into residents' homes, rice fields, gardens, local crafts, or small community events. Because this is not a large hotel, guest etiquette matters: ask before taking photos, dress appropriately, keep noise down, do not enter private rooms, and follow house rules. A small gift or sincere thanks is often appreciated.",
    tip_advice_vi:
      "Cụm lịch sự cho khách: `Boleh saya...?`, `Apakah kami harus...?`, `Kami ingin menghormati...`, `Terima kasih sudah...`. Người Việt có lợi thế vì tiếng Việt cũng đặt lời cảm ơn/xin phép rất tự nhiên; chỉ cần nhớ trật tự danh từ trước tính từ/cụm mô tả trong Indonesia.",
    tip_advice_en:
      "Polite guest chunks: `Boleh saya...?`, `Apakah kami harus...?`, `Kami ingin menghormati...`, `Terima kasih sudah...`. Vietnamese speakers have an advantage because Vietnamese also uses permission and thanks naturally; just remember Indonesian noun-first word order.",
    vocabulary: [
      {
        cell_id: "ecb8c9a4-50ad-4854-ab6f-92fc88f970ff",
        word: "wisata desa",
        en: "village tourism / village tour",
        vi: "du lịch làng quê / tour làng",
        pos: "noun phrase",
        pronunciation_vi: "wi-SA-ta DE-sa",
        pronunciation_en: "wee-SA-ta DE-sa",
      },
      {
        cell_id: "6ed12bdb-9777-4136-808a-039adc256868",
        word: "pemandu lokal",
        en: "local guide",
        vi: "hướng dẫn viên địa phương",
        pos: "noun phrase",
        pronunciation_vi: "pe-MAN-du LO-kal",
        pronunciation_en: "pe-MAN-doo LO-kal",
      },
      {
        cell_id: "1835854e-3f68-4f33-93f4-43985b600503",
        word: "mengambil foto",
        en: "to take a photo",
        vi: "chụp ảnh",
        pos: "verb phrase",
        pronunciation_vi: "me-NGAM-bil FO-to",
        pronunciation_en: "me-NGAM-bil FO-to",
      },
      {
        cell_id: "afc39682-9f76-41bd-9d5e-e53127db1e8f",
        word: "adat setempat",
        en: "local customs",
        vi: "phong tục địa phương",
        pos: "noun phrase",
        pronunciation_vi: "A-dat se-TEM-pat",
        pronunciation_en: "A-dat se-TEM-pat",
      },
      {
        cell_id: "fd214841-3658-4d6f-9735-414f09d3ced2",
        word: "melepas sandal",
        en: "to take off sandals",
        vi: "cởi dép",
        pos: "verb phrase",
        pronunciation_vi: "me-LE-pas SAN-dal",
        pronunciation_en: "me-LE-pas SAN-dal",
      },
      {
        cell_id: "05d9d11a-7324-4340-8e73-e8905b32db69",
        word: "sopan santun tamu",
        en: "guest etiquette",
        vi: "phép lịch sự của khách",
        pos: "noun phrase",
        pronunciation_vi: "SO-pan SAN-tun TA-mu",
        pronunciation_en: "SO-pan SAN-toon TA-moo",
      },
    ],
    dialogue: [
      {
        cell_id: "b53d4b10-edb8-4a9c-b9b0-b4e07c3ee565",
        speaker: "Pemandu",
        text: "Besok pagi kita ikut wisata desa dan mampir ke rumah warga.",
        vi: "Sáng mai chúng ta tham gia tour làng và ghé nhà người dân.",
        en: "Tomorrow morning we join a village tour and stop by residents' homes.",
      },
      {
        cell_id: "681c7f95-0a95-46c9-84a9-1b9649e5f057",
        speaker: "Tamu",
        text: "Baik. Boleh saya mengambil foto di sana?",
        vi: "Vâng. Tôi có thể chụp ảnh ở đó không?",
        en: "Okay. May I take photos there?",
      },
      {
        cell_id: "5d3f4570-17b2-4bb6-9b11-9017041aeceb",
        speaker: "Pemandu",
        text: "Boleh, tapi tanya dulu kepada tuan rumah.",
        vi: "Được, nhưng hãy hỏi chủ nhà trước.",
        en: "Yes, but ask the host first.",
      },
      {
        cell_id: "b18fb73a-5cd0-4924-b036-bac07093f24c",
        speaker: "Tamu",
        text: "Tentu. Kami ingin menghormati adat setempat.",
        vi: "Tất nhiên. Chúng tôi muốn tôn trọng phong tục địa phương.",
        en: "Of course. We want to respect local customs.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa tiếng Việt:",
        instruction_en: "Match each phrase with its Vietnamese meaning:",
        items: [
          { prompt: "wisata desa", answer: "du lịch làng quê" },
          { prompt: "pemandu lokal", answer: "hướng dẫn viên địa phương" },
          { prompt: "adat setempat", answer: "phong tục địa phương" },
          { prompt: "melepas sandal", answer: "cởi dép" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Chọn từ đúng:",
        instruction_en: "Choose the correct word:",
        items: [
          {
            prompt: "Boleh saya mengambil ___ di sini? (ảnh)",
            answer: "foto",
            options: ["foto", "faktur", "formulir"],
          },
          {
            prompt: "Kami ingin menghormati adat dan kebiasaan ___. (địa phương)",
            answer: "setempat",
            options: ["setempat", "sebentar", "sehat"],
          },
          {
            prompt: "Apakah kami harus melepas ___? (dép)",
            answer: "sandal",
            options: ["sandal", "sarapan", "sambal"],
          },
        ],
      },
    ],
  },
];
