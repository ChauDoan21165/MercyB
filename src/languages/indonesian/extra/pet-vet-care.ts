// src/languages/indonesian/extra/pet-vet-care.ts
//
// Indonesian pet and vet-care pack for Vietnamese learners.
// Covers: dokter hewan, kucing, anjing, vaksin, steril, makanan hewan, kandang,
// grooming, and describing when a pet is sick. Vietnamese-first with English
// companions, following the established Indonesian extra lesson shape.

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

export const petVetCareLessons: IndonesianLesson[] = [
  {
    id: "indonesian_pet_vet_basic_visit",
    level: "A2",
    category: "pets_animals",
    title_vi: "Đi bác sĩ thú y - mèo, chó và tiêm vắc xin",
    title_en: "Going to the vet - cats, dogs and vaccination",
    sentences: [
      {
        en: "Saya mau bawa kucing saya ke dokter hewan.",
        vi: "Tôi muốn đưa mèo của tôi đến bác sĩ thú y.",
        pronunciation_focus: [
          "bawa → BA-wa, 'mang/đưa theo'",
          "kucing saya → mèo của tôi; sở hữu đặt sau danh từ",
          "dokter hewan → bác sĩ thú y; hewan = động vật",
        ],
        pronunciation_focus_en: [
          "bawa → 'BA-wa' — bring/take along",
          "kucing saya → my cat; the possessor follows the noun",
          "dokter hewan → veterinarian; hewan = animal",
        ],
      },
      {
        en: "Anjing saya belum vaksin rabies.",
        vi: "Chó của tôi chưa tiêm vắc xin dại.",
        pronunciation_focus: [
          "anjing → AN-jing, 'chó'; giữ âm ng cuối",
          "belum vaksin → chưa tiêm vắc xin; trong nói thường 'vaksin' làm động từ",
          "rabies → RA-bies, bệnh dại",
        ],
        pronunciation_focus_en: [
          "anjing → 'AN-jing' — dog; keep the final ng",
          "belum vaksin → not vaccinated yet; in speech 'vaksin' can act like a verb",
          "rabies → 'RA-bees' — rabies",
        ],
      },
      {
        en: "Apakah perlu steril sebelum kucing saya beranak?",
        vi: "Có cần triệt sản trước khi mèo của tôi sinh con không?",
        pronunciation_focus: [
          "apakah perlu → có cần không; câu hỏi lịch sự",
          "steril → ste-RIL, triệt sản/khử trùng tùy ngữ cảnh",
          "beranak → ber-A-nak, sinh con/đẻ con; dùng cho động vật cũng tự nhiên",
        ],
        pronunciation_focus_en: [
          "apakah perlu → is it necessary; polite question form",
          "steril → 'ste-REEL' — sterilization or sterile depending on context",
          "beranak → 'ber-A-nak' — give birth/have babies; natural for animals too",
        ],
      },
      {
        en: "Kucing ini tidak mau makan sejak kemarin.",
        vi: "Con mèo này không chịu ăn từ hôm qua.",
        pronunciation_focus: [
          "tidak mau makan → không muốn/không chịu ăn",
          "sejak kemarin → từ hôm qua",
          "L1 note: đừng dịch 'bị bệnh' quá sớm; mô tả triệu chứng cụ thể trước",
        ],
        pronunciation_focus_en: [
          "tidak mau makan → does not want/refuses to eat",
          "sejak kemarin → since yesterday",
          "VN-speaker note: don't jump straight to 'sick'; describe the specific symptom first",
        ],
      },
      {
        en: "Dokter bilang dia harus minum obat dua kali sehari.",
        vi: "Bác sĩ nói nó phải uống thuốc hai lần một ngày.",
        pronunciation_focus: [
          "dokter bilang → bác sĩ nói; 'bilang' thân mật hơn 'mengatakan'",
          "dia → nó/anh ấy/cô ấy; không phân biệt giống",
          "dua kali sehari → hai lần một ngày",
        ],
        pronunciation_focus_en: [
          "dokter bilang → the doctor says; 'bilang' is more conversational than 'mengatakan'",
          "dia → it/he/she; no gender distinction",
          "dua kali sehari → twice a day",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, phòng khám thú y thường ghi 'klinik hewan' hoặc 'dokter hewan'. Mèo ('kucing') rất phổ biến, còn chó ('anjing') cũng được nuôi nhưng cần tế nhị ở một số khu dân cư Hồi giáo. Tiêm 'vaksin rabies' quan trọng cho chó và mèo, nhất là nếu thú cưng đi ra ngoài. 'Steril' trong ngữ cảnh thú cưng thường nghĩa là triệt sản để tránh sinh sản ngoài kế hoạch và giảm một số rủi ro sức khỏe.",
    cultural_notes_en:
      "In Indonesia, vet clinics are often labeled 'klinik hewan' or 'dokter hewan'. Cats ('kucing') are very common, while dogs ('anjing') are also kept but require tact in some Muslim neighborhoods. 'Vaksin rabies' is important for dogs and cats, especially if pets go outdoors. In pet contexts, 'steril' usually means spay/neuter to prevent unplanned litters and reduce some health risks.",
    tip_advice_vi:
      "Mẹo cho người Việt: động vật dùng loại từ 'ekor': 'seekor kucing', 'dua ekor anjing'. Khi nói với bác sĩ, mô tả triệu chứng theo mẫu 'tidak mau makan', 'muntah', 'lemas', 'sejak kemarin' thay vì chỉ nói 'sakit'. 'Belum' = chưa, rất hữu ích khi nói lịch tiêm: 'belum vaksin', 'belum steril'.",
    tip_advice_en:
      "Tip for Vietnamese speakers: animals use the classifier 'ekor': 'seekor kucing', 'dua ekor anjing'. At the vet, describe symptoms with patterns like 'tidak mau makan', 'muntah', 'lemas', 'sejak kemarin' instead of only saying 'sick'. 'Belum' = not yet, useful for vaccine schedules: 'belum vaksin', 'belum steril'.",
    vocabulary: [
      {
        cell_id: "87acc09c-d7aa-473b-a6ab-ad10db572af6",
        word: "dokter hewan",
        en: "veterinarian",
        vi: "bác sĩ thú y",
        pos: "noun",
        pronunciation_vi: "DOK-ter HE-wan",
        pronunciation_en: "DOK-ter HEH-wan",
      },
      {
        cell_id: "b7a15f58-c911-4de9-a51b-65126b7360a6",
        word: "kucing",
        en: "cat",
        vi: "mèo",
        pos: "noun",
        pronunciation_vi: "KU-ching",
        pronunciation_en: "KOO-ching",
      },
      {
        cell_id: "05eef3ca-82d7-4749-a9b0-9b399332aff4",
        word: "anjing",
        en: "dog",
        vi: "chó",
        pos: "noun",
        pronunciation_vi: "AN-jing",
        pronunciation_en: "AN-jing",
      },
      {
        cell_id: "ce9a807e-a571-4c44-806e-a9db9a2cebcf",
        word: "vaksin",
        en: "vaccine / to vaccinate",
        vi: "vắc xin / tiêm vắc xin",
        pos: "noun / verb",
        pronunciation_vi: "VAK-sin",
        pronunciation_en: "VAK-seen",
      },
      {
        cell_id: "8e987b1e-91f9-487c-a31e-4913aacfe2fd",
        word: "steril",
        en: "spay/neuter / sterile",
        vi: "triệt sản / vô trùng",
        pos: "verb / adjective",
        pronunciation_vi: "ste-RIL",
        pronunciation_en: "ste-REEL",
      },
      {
        cell_id: "1c50b483-b753-4684-afce-9827c7150128",
        word: "sakit",
        en: "sick / painful",
        vi: "ốm / đau",
        pos: "adjective",
        pronunciation_vi: "SA-kit",
        pronunciation_en: "SA-kit",
      },
      {
        cell_id: "65cc3d2b-e21c-4896-9ce0-87ed1dbd980f",
        word: "obat",
        en: "medicine",
        vi: "thuốc",
        pos: "noun",
        pronunciation_vi: "O-bat",
        pronunciation_en: "OH-bat",
      },
    ],
    dialogue: [
      {
        cell_id: "0ac25be3-e0dd-43e5-9f85-1b1ad740cfbc",
        speaker: "Pemilik",
        text: "Dok, saya mau bawa kucing saya periksa.",
        vi: "Bác sĩ ơi, tôi muốn đưa mèo của tôi đi khám.",
        en: "Doctor, I want to bring my cat for a check-up.",
      },
      {
        cell_id: "aaebc4ab-e6fe-4e4e-ada8-43c68f6aac41",
        speaker: "Dokter Hewan",
        text: "Keluhannya apa? Sudah vaksin rabies?",
        vi: "Triệu chứng là gì? Đã tiêm vắc xin dại chưa?",
        en: "What is the complaint? Has it had the rabies vaccine?",
      },
      {
        cell_id: "e3388d55-cb09-4233-8be0-5ac92ade91ee",
        speaker: "Pemilik",
        text: "Belum vaksin. Sejak kemarin dia tidak mau makan.",
        vi: "Chưa tiêm. Từ hôm qua nó không chịu ăn.",
        en: "Not vaccinated yet. Since yesterday it has refused to eat.",
      },
      {
        cell_id: "331be494-bc4c-4d96-8dbf-65bdb0747a50",
        speaker: "Dokter Hewan",
        text: "Baik, kita periksa dulu. Nanti saya jelaskan obatnya.",
        vi: "Được, mình khám trước. Lát nữa tôi giải thích thuốc.",
        en: "Okay, let's examine it first. Later I will explain the medicine.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ khám thú y còn thiếu:",
        instruction_en: "Fill in the missing vet-care word:",
        items: [
          {
            prompt: "Saya mau bawa kucing saya ke dokter ___. (thú y)",
            answer: "hewan",
            options: ["hewan", "hujan", "halaman"],
          },
          {
            prompt: "Anjing saya belum ___ rabies. (tiêm vắc xin)",
            answer: "vaksin",
            options: ["vaksin", "vitamin", "viral"],
          },
          {
            prompt: "Kucing ini tidak mau ___ sejak kemarin. (ăn)",
            answer: "makan",
            options: ["makan", "mandi", "main"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "dokter hewan", answer: "bác sĩ thú y" },
          { prompt: "kucing", answer: "mèo" },
          { prompt: "anjing", answer: "chó" },
          { prompt: "obat", answer: "thuốc" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn đưa mèo của tôi đến bác sĩ thú y.", answer: "Saya mau bawa kucing saya ke dokter hewan." },
          { prompt: "Chó của tôi chưa tiêm vắc xin dại.", answer: "Anjing saya belum vaksin rabies." },
          { prompt: "Nó phải uống thuốc hai lần một ngày.", answer: "Dia harus minum obat dua kali sehari." },
        ],
      },
    ],
  },
  {
    id: "indonesian_pet_food_grooming_boarding",
    level: "B1",
    category: "pets_animals",
    title_vi: "Chăm sóc thú cưng - đồ ăn, chuồng và grooming",
    title_en: "Pet care - food, cages and grooming",
    sentences: [
      {
        en: "Saya cari makanan hewan untuk kucing yang sensitif.",
        vi: "Tôi tìm đồ ăn thú cưng cho mèo nhạy cảm.",
        pronunciation_focus: [
          "cari → CA-ri, 'tìm'; c đọc như 'ch'",
          "makanan hewan → thức ăn cho động vật/thú cưng",
          "yang sensitif → nhạy cảm; yang nối tính từ vào danh từ",
        ],
        pronunciation_focus_en: [
          "cari → 'CHA-ree' — look for; c is pronounced 'ch'",
          "makanan hewan → animal/pet food",
          "yang sensitif → sensitive; yang links the adjective to the noun",
        ],
      },
      {
        en: "Apakah ada kandang yang cukup besar untuk anjing ini?",
        vi: "Có chuồng đủ lớn cho con chó này không?",
        pronunciation_focus: [
          "kandang → KAN-dang, chuồng/lồng",
          "cukup besar → đủ lớn",
          "untuk anjing ini → cho con chó này",
        ],
        pronunciation_focus_en: [
          "kandang → 'KAN-dang' — cage/kennel/enclosure",
          "cukup besar → big enough",
          "untuk anjing ini → for this dog",
        ],
      },
      {
        en: "Saya mau booking grooming untuk hari Sabtu.",
        vi: "Tôi muốn đặt lịch grooming cho thứ Bảy.",
        pronunciation_focus: [
          "booking → BU-king, đặt lịch; từ mượn rất phổ biến",
          "grooming → GRU-ming, tắm/cắt/tỉa lông thú cưng",
          "hari Sabtu → thứ Bảy; hari = ngày",
        ],
        pronunciation_focus_en: [
          "booking → 'BOO-king' — make a booking; common loanword",
          "grooming → 'GROO-ming' — pet bath/trim/grooming",
          "hari Sabtu → Saturday; hari = day",
        ],
      },
      {
        en: "Tolong potong kuku dan bersihkan telinganya.",
        vi: "Làm ơn cắt móng và vệ sinh tai cho nó.",
        pronunciation_focus: [
          "potong kuku → cắt móng",
          "bersihkan → làm sạch/vệ sinh; gốc 'bersih' = sạch",
          "telinganya → tai của nó; -nya = của nó/đó",
        ],
        pronunciation_focus_en: [
          "potong kuku → trim/cut nails",
          "bersihkan → clean; root 'bersih' = clean",
          "telinganya → its ears; -nya = its/the",
        ],
      },
      {
        en: "Kalau saya mudik, apakah ada penitipan hewan?",
        vi: "Nếu tôi về quê dịp lễ, có dịch vụ gửi thú cưng không?",
        pronunciation_focus: [
          "kalau saya mudik → nếu tôi về quê dịp lễ",
          "penitipan hewan → nơi/dịch vụ gửi thú cưng",
          "apakah ada → có không; câu hỏi lịch sự",
        ],
        pronunciation_focus_en: [
          "kalau saya mudik → if I go home for the holiday",
          "penitipan hewan → pet boarding / pet-sitting place",
          "apakah ada → is there; polite question form",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở thành phố lớn như Jakarta, Bandung, Surabaya và Bali, pet shop thường bán 'makanan hewan', pasir kucing, kandang, vitamin, và có jasa grooming. 'Grooming' thường gồm mandi, potong kuku, bersihkan telinga, và kadang potong bulu. Khi chủ đi 'mudik' hoặc du lịch, một số klinik hewan và pet shop có 'penitipan hewan'. Luôn hỏi syarat vaksin, jam jemput, biaya per hari, và apakah makanan dibawa sendiri.",
    cultural_notes_en:
      "In big cities like Jakarta, Bandung, Surabaya, and Bali, pet shops usually sell 'makanan hewan', cat litter, cages, vitamins, and offer grooming services. 'Grooming' often includes bathing, nail trimming, ear cleaning, and sometimes fur trimming. When owners go 'mudik' or travel, some vet clinics and pet shops offer 'penitipan hewan' boarding. Always ask about vaccine requirements, pickup hours, daily fees, and whether you should bring the pet's own food.",
    tip_advice_vi:
      "Mẹo cho người Việt: 'kandang' có thể là chuồng chó, lồng mèo, lồng chim - nghĩa rộng hơn một loại chuồng cụ thể. 'Makanan hewan' là cách trung tính; trong shop cũng nghe 'makanan kucing' và 'makanan anjing'. Với dịch vụ, dùng 'booking' hoặc 'pesan jadwal' đều tự nhiên.",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'kandang' can mean dog kennel, cat cage, bird cage, or enclosure - broader than one specific cage type. 'Makanan hewan' is neutral; in shops you will also hear 'makanan kucing' and 'makanan anjing'. For services, both 'booking' and 'pesan jadwal' sound natural.",
    vocabulary: [
      {
        cell_id: "be16152c-3c86-4866-b393-f036afd17095",
        word: "makanan hewan",
        en: "pet/animal food",
        vi: "đồ ăn thú cưng",
        pos: "noun phrase",
        pronunciation_vi: "ma-KA-nan HE-wan",
        pronunciation_en: "ma-KA-nan HEH-wan",
      },
      {
        cell_id: "b9f3b96e-ffed-4bd8-949b-db4c01067f5e",
        word: "kandang",
        en: "cage / kennel / enclosure",
        vi: "chuồng / lồng",
        pos: "noun",
        pronunciation_vi: "KAN-dang",
        pronunciation_en: "KAN-dang",
      },
      {
        cell_id: "00fabec8-5785-43be-a21f-cd200602e2d4",
        word: "grooming",
        en: "pet grooming",
        vi: "tắm/cắt/tỉa lông thú cưng",
        pos: "noun",
        pronunciation_vi: "GRU-ming",
        pronunciation_en: "GROO-ming",
      },
      {
        cell_id: "1cbf286a-bec9-4e18-b120-9d825c66502a",
        word: "potong kuku",
        en: "trim nails",
        vi: "cắt móng",
        pos: "verb phrase",
        pronunciation_vi: "PO-tong KU-ku",
        pronunciation_en: "POH-tong KOO-koo",
      },
      {
        cell_id: "69198b3a-46a6-4f77-a87d-58c08ff76d81",
        word: "bersihkan telinga",
        en: "clean ears",
        vi: "vệ sinh tai",
        pos: "verb phrase",
        pronunciation_vi: "ber-SIH-kan te-LI-nga",
        pronunciation_en: "ber-SEE-kan te-LEE-nga",
      },
      {
        cell_id: "33442770-6a1c-4f99-9649-5b2a9b2e31ce",
        word: "penitipan hewan",
        en: "pet boarding",
        vi: "dịch vụ gửi thú cưng",
        pos: "noun phrase",
        pronunciation_vi: "pe-ni-TI-pan HE-wan",
        pronunciation_en: "pe-nee-TEE-pan HEH-wan",
      },
      {
        cell_id: "d4b998be-7c17-4dfd-8fa6-053c0330af49",
        word: "pasir kucing",
        en: "cat litter",
        vi: "cát vệ sinh mèo",
        pos: "noun phrase",
        pronunciation_vi: "PA-sir KU-ching",
        pronunciation_en: "PA-seer KOO-ching",
      },
    ],
    dialogue: [
      {
        cell_id: "6dcabffe-5ba2-4b31-aa11-acf343c5f3ac",
        speaker: "Pemilik",
        text: "Mbak, saya mau booking grooming untuk kucing saya hari Sabtu.",
        vi: "Chị ơi, tôi muốn đặt lịch grooming cho mèo của tôi vào thứ Bảy.",
        en: "Miss, I want to book grooming for my cat on Saturday.",
      },
      {
        cell_id: "f64e38ce-eed5-41b3-b1b7-556579d00c87",
        speaker: "Pet Shop",
        text: "Bisa. Mau mandi saja atau sekalian potong kuku?",
        vi: "Được. Chỉ tắm thôi hay cắt móng luôn?",
        en: "Sure. Bath only, or nail trimming too?",
      },
      {
        cell_id: "f8d28400-03eb-4a85-8b9f-204e2df9c5de",
        speaker: "Pemilik",
        text: "Sekalian potong kuku dan bersihkan telinganya, ya.",
        vi: "Cắt móng và vệ sinh tai luôn nhé.",
        en: "Please trim the nails and clean the ears too.",
      },
      {
        cell_id: "c31933c4-41b0-463f-8cf3-5db0b1bbb8ee",
        speaker: "Pet Shop",
        text: "Baik. Kalau perlu penitipan hewan saat mudik, kami juga ada.",
        vi: "Vâng. Nếu cần gửi thú cưng khi về quê dịp lễ, bên em cũng có.",
        en: "Okay. If you need pet boarding during mudik, we also have it.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ chăm sóc thú cưng còn thiếu:",
        instruction_en: "Fill in the missing pet-care word:",
        items: [
          {
            prompt: "Saya cari makanan ___ untuk kucing saya. (thú cưng/động vật)",
            answer: "hewan",
            options: ["hewan", "hujan", "halal"],
          },
          {
            prompt: "Apakah ada ___ yang cukup besar? (chuồng/lồng)",
            answer: "kandang",
            options: ["kandang", "kantor", "kamar"],
          },
          {
            prompt: "Saya mau booking ___ untuk hari Sabtu. (grooming)",
            answer: "grooming",
            options: ["grooming", "gratis", "goreng"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "makanan hewan", answer: "đồ ăn thú cưng" },
          { prompt: "kandang", answer: "chuồng / lồng" },
          { prompt: "potong kuku", answer: "cắt móng" },
          { prompt: "penitipan hewan", answer: "dịch vụ gửi thú cưng" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi tìm đồ ăn thú cưng cho mèo.", answer: "Saya cari makanan hewan untuk kucing." },
          { prompt: "Làm ơn cắt móng và vệ sinh tai cho nó.", answer: "Tolong potong kuku dan bersihkan telinganya." },
          { prompt: "Có dịch vụ gửi thú cưng không?", answer: "Apakah ada penitipan hewan?" },
        ],
      },
    ],
  },
];
