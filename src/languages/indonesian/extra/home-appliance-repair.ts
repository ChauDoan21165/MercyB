// src/languages/indonesian/extra/home-appliance-repair.ts
//
// Indonesian home-appliance repair pack for Vietnamese learners.
// Covers: kulkas, mesin cuci, AC, kompor, rusak, teknisi, garansi, spare part,
// and biaya servis. Vietnamese-first with English companions, following the
// established Indonesian extra lesson shape.

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
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields (fill_blank, matching, translation) vary.
type Exercise = Record<string, any>;

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

export const homeApplianceRepairLessons: IndonesianLesson[] = [
  {
    id: "indonesian_appliance_repair_call_technician",
    level: "A2",
    category: "home_services",
    title_vi: "Gọi thợ sửa đồ điện gia dụng",
    title_en: "Calling a home-appliance technician",
    sentences: [
      {
        en: "Halo, saya butuh teknisi untuk perbaikan kulkas.",
        vi: "Alô, tôi cần kỹ thuật viên để sửa tủ lạnh.",
        pronunciation_focus: [
          "teknisi → tek-NI-si, kỹ thuật viên/thợ kỹ thuật",
          "perbaikan → per-ba-I-kan, việc sửa chữa; gốc 'baik' = tốt",
          "kulkas → KUL-kas, tủ lạnh; từ rất thường trong gia đình",
        ],
        pronunciation_focus_en: [
          "teknisi → 'tek-NEE-see' — technician",
          "perbaikan → 'per-ba-EE-kan' — repair; root 'baik' = good",
          "kulkas → 'KOOL-kas' — refrigerator; very common household word",
        ],
      },
      {
        en: "Kulkas saya rusak dan tidak dingin sejak kemarin.",
        vi: "Tủ lạnh của tôi bị hỏng và không lạnh từ hôm qua.",
        pronunciation_focus: [
          "rusak → RU-sak, hỏng; dùng cho máy móc/đồ vật",
          "tidak dingin → không lạnh; dingin = lạnh",
          "sejak kemarin → từ hôm qua; đặt mốc thời gian rất hữu ích khi gọi thợ",
        ],
        pronunciation_focus_en: [
          "rusak → 'ROO-sak' — broken/damaged; used for machines and objects",
          "tidak dingin → not cold; dingin = cold",
          "sejak kemarin → since yesterday; useful time anchor when calling a repair tech",
        ],
      },
      {
        en: "Mesin cuci menyala, tapi airnya tidak keluar.",
        vi: "Máy giặt bật lên, nhưng nước không chảy ra.",
        pronunciation_focus: [
          "mesin cuci → me-SIN CU-ci, máy giặt; c đọc như 'ch'",
          "menyala → me-NYA-la, bật/sáng/lên nguồn",
          "airnya tidak keluar → nước không ra; air = nước, đọc hai âm",
        ],
        pronunciation_focus_en: [
          "mesin cuci → 'me-SEEN CHOO-chee' — washing machine; c is 'ch'",
          "menyala → 'me-NYA-la' — turns on/lights up",
          "airnya tidak keluar → the water does not come out; air = water, two vowels",
        ],
      },
      {
        en: "AC di kamar mati total, tidak bisa dinyalakan.",
        vi: "Máy lạnh trong phòng chết hẳn, không bật lên được.",
        pronunciation_focus: [
          "AC → a-sé, máy lạnh/điều hòa",
          "mati total → chết hẳn/không lên nguồn chút nào",
          "tidak bisa dinyalakan → không thể được bật lên; di-...-kan = bị động",
        ],
        pronunciation_focus_en: [
          "AC → 'ah-seh' — air conditioner",
          "mati total → completely dead / will not power on at all",
          "tidak bisa dinyalakan → cannot be turned on; di-...-kan = passive",
        ],
      },
      {
        en: "Kompor gas saya susah menyala dan baunya gas.",
        vi: "Bếp gas của tôi khó bật lửa và có mùi gas.",
        pronunciation_focus: [
          "kompor gas → KOM-por gas, bếp gas",
          "susah menyala → khó bật lửa/khó lên",
          "baunya gas → có mùi gas; bau = mùi, -nya = của nó/cái đó",
        ],
        pronunciation_focus_en: [
          "kompor gas → 'KOM-por gas' — gas stove",
          "susah menyala → hard to ignite/turn on",
          "baunya gas → it smells like gas; bau = smell, -nya = its/the",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, thợ sửa đồ điện gia dụng có thể gọi là 'teknisi' hoặc 'tukang servis'. Với AC có nhiều jasa servis AC riêng; với kulkas, mesin cuci, dan kompor gas, thường hỏi trước apakah teknisi bisa datang ke rumah. Khi có mùi gas, nên tắt kompor, mở cửa, không bật công tắc điện gần đó, rồi gọi teknisi hoặc nhà cung cấp gas. Khi mô tả lỗi, câu ngắn và cụ thể hiệu quả hơn: 'tidak dingin', 'mati total', 'air tidak keluar', 'bau gas'.",
    cultural_notes_en:
      "In Indonesia, a home-appliance repair person may be called 'teknisi' or 'tukang servis'. For AC, there are many specialized AC service providers; for refrigerators, washing machines, and gas stoves, ask first whether the technician can come to your home. If you smell gas, turn off the stove, open doors/windows, avoid switching nearby electrical devices, then call a technician or gas provider. When describing faults, short specific phrases work best: 'tidak dingin', 'mati total', 'air tidak keluar', 'bau gas'.",
    tip_advice_vi:
      "Mẹo cho người Việt: máy móc hỏng nói 'rusak', không nói 'tidak baik'. Thiết bị không lên nguồn nói 'mati' hoặc 'mati total'. Để nói 'bật máy', dùng 'menyalakan'; khi máy tự bật/lên nguồn, dùng 'menyala'. Đây là cặp hay nhầm.",
    tip_advice_en:
      "Tip for Vietnamese speakers: a broken machine is 'rusak', not 'tidak baik'. A device that will not power on is 'mati' or 'mati total'. To turn a device on, use 'menyalakan'; when the device turns on, use 'menyala'. This pair is easy to mix up.",
    vocabulary: [
      {
        word: "teknisi",
        en: "technician",
        vi: "kỹ thuật viên",
        pos: "noun",
        pronunciation_vi: "tek-NI-si",
        pronunciation_en: "tek-NEE-see",
      },
      {
        word: "kulkas",
        en: "refrigerator",
        vi: "tủ lạnh",
        pos: "noun",
        pronunciation_vi: "KUL-kas",
        pronunciation_en: "KOOL-kas",
      },
      {
        word: "mesin cuci",
        en: "washing machine",
        vi: "máy giặt",
        pos: "noun phrase",
        pronunciation_vi: "me-SIN CU-ci",
        pronunciation_en: "me-SEEN CHOO-chee",
      },
      {
        word: "AC",
        en: "air conditioner",
        vi: "máy lạnh / điều hòa",
        pos: "noun",
        pronunciation_vi: "a-sé",
        pronunciation_en: "ah-seh",
      },
      {
        word: "kompor",
        en: "stove",
        vi: "bếp",
        pos: "noun",
        pronunciation_vi: "KOM-por",
        pronunciation_en: "KOM-por",
      },
      {
        word: "rusak",
        en: "broken / damaged",
        vi: "hỏng",
        pos: "adjective",
        pronunciation_vi: "RU-sak",
        pronunciation_en: "ROO-sak",
      },
      {
        word: "mati total",
        en: "completely dead",
        vi: "chết hẳn / không lên nguồn",
        pos: "adjective phrase",
        pronunciation_vi: "MA-ti TO-tal",
        pronunciation_en: "MA-tee TO-tal",
      },
    ],
    dialogue: [
      {
        speaker: "Pelanggan",
        text: "Halo, saya butuh teknisi. Kulkas saya rusak.",
        vi: "Alô, tôi cần kỹ thuật viên. Tủ lạnh của tôi bị hỏng.",
        en: "Hello, I need a technician. My refrigerator is broken.",
      },
      {
        speaker: "Teknisi",
        text: "Rusaknya bagaimana, Bu? Tidak dingin atau mati total?",
        vi: "Hỏng thế nào ạ? Không lạnh hay chết hẳn?",
        en: "How is it broken, ma'am? Not cold or completely dead?",
      },
      {
        speaker: "Pelanggan",
        text: "Tidak dingin sejak kemarin, tapi lampunya masih menyala.",
        vi: "Không lạnh từ hôm qua, nhưng đèn vẫn sáng.",
        en: "It has not been cold since yesterday, but the light still turns on.",
      },
      {
        speaker: "Teknisi",
        text: "Baik, saya bisa datang sore ini untuk cek dulu.",
        vi: "Vâng, chiều nay tôi có thể đến kiểm tra trước.",
        en: "Okay, I can come this afternoon to check first.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ sửa thiết bị còn thiếu:",
        instruction_en: "Fill in the missing appliance-repair word:",
        items: [
          {
            prompt: "Saya butuh ___ untuk perbaikan kulkas. (kỹ thuật viên)",
            answer: "teknisi",
            options: ["teknisi", "tiket", "tetangga"],
          },
          {
            prompt: "___ saya rusak dan tidak dingin. (tủ lạnh)",
            answer: "Kulkas",
            options: ["Kulkas", "Kompor", "Kamar"],
          },
          {
            prompt: "AC di kamar ___ total. (chết hẳn)",
            answer: "mati",
            options: ["mati", "makan", "mandi"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "kulkas", answer: "tủ lạnh" },
          { prompt: "mesin cuci", answer: "máy giặt" },
          { prompt: "AC", answer: "máy lạnh" },
          { prompt: "kompor", answer: "bếp" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi cần kỹ thuật viên để sửa tủ lạnh.", answer: "Saya butuh teknisi untuk perbaikan kulkas." },
          { prompt: "Máy giặt bật lên, nhưng nước không chảy ra.", answer: "Mesin cuci menyala, tapi airnya tidak keluar." },
          { prompt: "Bếp gas của tôi khó bật lửa.", answer: "Kompor gas saya susah menyala." },
        ],
      },
    ],
  },
  {
    id: "indonesian_appliance_warranty_parts_cost",
    level: "B1",
    category: "home_services",
    title_vi: "Bảo hành, linh kiện và phí sửa chữa",
    title_en: "Warranty, spare parts and service fees",
    sentences: [
      {
        en: "Apakah barang ini masih dalam masa garansi?",
        vi: "Món đồ này vẫn còn trong thời hạn bảo hành không?",
        pronunciation_focus: [
          "masih dalam masa garansi → vẫn còn trong thời hạn bảo hành",
          "garansi → ga-RAN-si, bảo hành; từ mượn rất phổ biến",
          "barang ini → món đồ/thiết bị này",
        ],
        pronunciation_focus_en: [
          "masih dalam masa garansi → still within the warranty period",
          "garansi → 'ga-RAN-see' — warranty; very common loanword",
          "barang ini → this item/device",
        ],
      },
      {
        en: "Kalau masih garansi, biaya servisnya gratis atau tidak?",
        vi: "Nếu vẫn còn bảo hành, phí dịch vụ miễn phí hay không?",
        pronunciation_focus: [
          "kalau masih garansi → nếu vẫn còn bảo hành",
          "biaya servis → phí dịch vụ/sửa chữa",
          "gratis atau tidak → miễn phí hay không; câu hỏi lựa chọn rõ ràng",
        ],
        pronunciation_focus_en: [
          "kalau masih garansi → if still under warranty",
          "biaya servis → service/repair fee",
          "gratis atau tidak → free or not; clear choice question",
        ],
      },
      {
        en: "Spare part yang rusak harus diganti.",
        vi: "Linh kiện bị hỏng phải được thay.",
        pronunciation_focus: [
          "spare part → SPER part, linh kiện/phụ tùng; trong nói thường rất phổ biến",
          "yang rusak → cái bị hỏng",
          "harus diganti → phải được thay; di- = bị động",
        ],
        pronunciation_focus_en: [
          "spare part → 'SPARE part' — spare part/component; very common in speech",
          "yang rusak → the one that is broken",
          "harus diganti → must be replaced; di- = passive",
        ],
      },
      {
        en: "Tolong beri estimasi biaya sebelum diperbaiki.",
        vi: "Làm ơn báo ước tính chi phí trước khi sửa.",
        pronunciation_focus: [
          "beri estimasi biaya → đưa/báo ước tính chi phí",
          "sebelum diperbaiki → trước khi được sửa; di-...-i = bị động",
          "L1 note: hỏi giá trước giúp tránh 'biaya tambahan'",
        ],
        pronunciation_focus_en: [
          "beri estimasi biaya → give a cost estimate",
          "sebelum diperbaiki → before it is repaired; di-...-i = passive",
          "VN-speaker note: asking the price first helps avoid extra charges",
        ],
      },
      {
        en: "Kalau biaya servis terlalu mahal, saya tunda dulu.",
        vi: "Nếu phí sửa quá đắt, tôi hoãn trước đã.",
        pronunciation_focus: [
          "terlalu mahal → quá đắt",
          "saya tunda dulu → tôi hoãn trước đã; tunda = hoãn",
          "dulu → trước đã/tạm thời, làm câu mềm hơn",
        ],
        pronunciation_focus_en: [
          "terlalu mahal → too expensive",
          "saya tunda dulu → I will postpone for now; tunda = postpone",
          "dulu → for now/first, softens the sentence",
        ],
      },
      {
        en: "Bisa kasih nota dan garansi servis setelah selesai?",
        vi: "Có thể cho phiếu và bảo hành dịch vụ sau khi xong không?",
        pronunciation_focus: [
          "kasih nota → cho phiếu/biên nhận; 'kasih' thân mật hơn 'beri'",
          "garansi servis → bảo hành cho lần sửa",
          "setelah selesai → sau khi xong",
        ],
        pronunciation_focus_en: [
          "kasih nota → give a receipt/slip; 'kasih' is more colloquial than 'beri'",
          "garansi servis → warranty for the repair work",
          "setelah selesai → after it is finished",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi sửa kulkas, mesin cuci, AC hoặc kompor ở Indonesia, hãy hỏi rõ ba khoản: biaya pengecekan (phí kiểm tra), biaya servis (phí sửa), và harga spare part (giá linh kiện). Một số teknisi vẫn tính phí datang/cek walaupun không sửa. Nếu barang masih dalam masa garansi, thường cần kartu garansi, nota pembelian, atau nomor seri. Với AC, 'servis AC' định kỳ thường gồm cuci AC, cek freon, dan cek kebocoran.",
    cultural_notes_en:
      "When repairing a refrigerator, washing machine, AC, or stove in Indonesia, clarify three charges: inspection fee, service fee, and spare-part price. Some technicians still charge a visit/check fee even if no repair is done. If the item is still under warranty, you usually need the warranty card, purchase receipt, or serial number. For AC, regular 'servis AC' often includes cleaning, checking freon, and checking for leaks.",
    tip_advice_vi:
      "Mẹo cho người Việt: 'servis' trong Indonesia vừa là danh từ vừa là động từ trong nói thường: 'servis AC', 'biaya servis'. Khi muốn lịch sự hơn, dùng 'perbaikan'. Hỏi trước bằng câu 'Tolong beri estimasi biaya sebelum diperbaiki' để tránh hiểu nhầm về tiền.",
    tip_advice_en:
      "Tip for Vietnamese speakers: Indonesian 'servis' works as both noun and verb in everyday speech: 'servis AC', 'biaya servis'. For a more formal word, use 'perbaikan'. Ask first with 'Tolong beri estimasi biaya sebelum diperbaiki' to avoid money misunderstandings.",
    vocabulary: [
      {
        word: "garansi",
        en: "warranty",
        vi: "bảo hành",
        pos: "noun",
        pronunciation_vi: "ga-RAN-si",
        pronunciation_en: "ga-RAN-see",
      },
      {
        word: "biaya servis",
        en: "service fee / repair cost",
        vi: "phí sửa chữa / phí dịch vụ",
        pos: "noun phrase",
        pronunciation_vi: "bi-A-ya SER-vis",
        pronunciation_en: "bee-A-ya SER-vis",
      },
      {
        word: "spare part",
        en: "spare part / component",
        vi: "linh kiện / phụ tùng",
        pos: "noun",
        pronunciation_vi: "SPER part",
        pronunciation_en: "SPARE part",
      },
      {
        word: "diganti",
        en: "replaced",
        vi: "được thay",
        pos: "passive verb",
        pronunciation_vi: "di-GAN-ti",
        pronunciation_en: "dee-GAN-tee",
      },
      {
        word: "estimasi biaya",
        en: "cost estimate",
        vi: "ước tính chi phí",
        pos: "noun phrase",
        pronunciation_vi: "es-ti-MA-si bi-A-ya",
        pronunciation_en: "es-tee-MA-see bee-A-ya",
      },
      {
        word: "nota",
        en: "receipt / service slip",
        vi: "phiếu / biên nhận",
        pos: "noun",
        pronunciation_vi: "NO-ta",
        pronunciation_en: "NO-ta",
      },
      {
        word: "diperbaiki",
        en: "repaired",
        vi: "được sửa",
        pos: "passive verb",
        pronunciation_vi: "di-per-ba-I-ki",
        pronunciation_en: "dee-per-ba-EE-kee",
      },
    ],
    dialogue: [
      {
        speaker: "Pelanggan",
        text: "Apakah mesin cuci ini masih dalam masa garansi?",
        vi: "Máy giặt này vẫn còn trong thời hạn bảo hành không?",
        en: "Is this washing machine still under warranty?",
      },
      {
        speaker: "Teknisi",
        text: "Boleh saya lihat nota pembelian dan kartu garansi?",
        vi: "Tôi có thể xem hóa đơn mua hàng và thẻ bảo hành không?",
        en: "May I see the purchase receipt and warranty card?",
      },
      {
        speaker: "Pelanggan",
        text: "Kalau perlu ganti spare part, tolong beri estimasi biaya dulu.",
        vi: "Nếu cần thay linh kiện, làm ơn báo ước tính chi phí trước.",
        en: "If a spare part needs replacing, please give a cost estimate first.",
      },
      {
        speaker: "Teknisi",
        text: "Baik. Saya cek dulu, lalu kabari biaya servisnya.",
        vi: "Vâng. Tôi kiểm tra trước, rồi báo phí sửa.",
        en: "Okay. I will check first, then tell you the service cost.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ bảo hành/sửa chữa còn thiếu:",
        instruction_en: "Fill in the missing warranty/repair word:",
        items: [
          {
            prompt: "Barang ini masih dalam masa ___. (bảo hành)",
            answer: "garansi",
            options: ["garansi", "gratis", "ganti"],
          },
          {
            prompt: "Spare part yang rusak harus ___. (được thay)",
            answer: "diganti",
            options: ["diganti", "dicuci", "dibawa"],
          },
          {
            prompt: "Tolong beri estimasi ___ sebelum diperbaiki. (chi phí)",
            answer: "biaya",
            options: ["biaya", "barang", "bukti"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "garansi", answer: "bảo hành" },
          { prompt: "biaya servis", answer: "phí sửa chữa" },
          { prompt: "spare part", answer: "linh kiện" },
          { prompt: "nota", answer: "phiếu / biên nhận" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Món đồ này vẫn còn trong thời hạn bảo hành không?", answer: "Apakah barang ini masih dalam masa garansi?" },
          { prompt: "Linh kiện bị hỏng phải được thay.", answer: "Spare part yang rusak harus diganti." },
          { prompt: "Nếu phí sửa quá đắt, tôi hoãn trước đã.", answer: "Kalau biaya servis terlalu mahal, saya tunda dulu." },
        ],
      },
    ],
  },
];
