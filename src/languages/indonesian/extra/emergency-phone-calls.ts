// Emergency Phone Calls Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// pronunciation/emergency notes with English companions in pronunciation_focus_en.

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
    id: "indonesian_emergency_phone_calls",
    level: "A2",
    category: "emergency",
    title_vi: "Gọi điện khẩn cấp bằng tiếng Indonesia",
    title_en: "Emergency phone calls in Indonesian",
    sentences: [
      {
        en: "Halo, ini keadaan darurat. Tolong bantu saya.",
        vi: "A lô, đây là tình huống khẩn cấp. Làm ơn giúp tôi.",
        pronunciation_focus: [
          "HA-lo, I-ni ke-a-DA-an da-RU-rat. TO-long BAN-tu SA-ya - `keadaan darurat` = tình huống khẩn cấp; `tolong` = cứu/làm ơn.",
          "Lỗi người Việt: nói dài khi hoảng. Câu mở đầu cần ngắn: `ini keadaan darurat`.",
          "Luyện: `Tolong bantu saya.`",
        ],
        pronunciation_focus_en: [
          "HA-lo, I-ni ke-a-DA-an da-ROO-rat. TO-long BAN-too SA-ya - `keadaan darurat` = emergency situation; `tolong` = help/please.",
          "VN-speaker trap: speaking too long when panicked. The opening line should be short: `ini keadaan darurat`.",
          "Drill: `Tolong bantu saya.`",
        ],
      },
      {
        en: "Saya butuh ambulans sekarang juga.",
        vi: "Tôi cần xe cứu thương ngay bây giờ.",
        pronunciation_focus: [
          "SA-ya BU-tuh am-bu-LANS se-ka-RANG JU-ga - `butuh` = cần; `ambulans` = xe cứu thương; `sekarang juga` = ngay lập tức.",
          "Lỗi người Việt: dùng `mau` thay cho `butuh`. Trong cấp cứu, `butuh ambulans` mạnh và rõ hơn `mau ambulans`.",
          "Luyện: `Butuh ambulans sekarang juga.`",
        ],
        pronunciation_focus_en: [
          "SA-ya BOO-tuh am-boo-LANS se-ka-RANG JOO-ga - `butuh` = need; `ambulans` = ambulance; `sekarang juga` = right now.",
          "VN-speaker trap: using `mau` instead of `butuh`. In emergencies, `butuh ambulans` is stronger and clearer than `mau ambulans`.",
          "Drill: `Butuh ambulans sekarang juga.`",
        ],
      },
      {
        en: "Tolong panggil pemadam kebakaran.",
        vi: "Làm ơn gọi lính cứu hỏa.",
        pronunciation_focus: [
          "TO-long PANG-gil pe-MA-dam ke-ba-KA-ran - `panggil` = gọi; `pemadam kebakaran` = lực lượng cứu hỏa.",
          "Lỗi người Việt: dùng `polisi api`. Cách nói đúng là `pemadam kebakaran`.",
          "Luyện: `Panggil pemadam kebakaran.`",
        ],
        pronunciation_focus_en: [
          "TO-long PANG-gil pe-MA-dam ke-ba-KA-ran - `panggil` = call/summon; `pemadam kebakaran` = firefighters/fire brigade.",
          "VN-speaker trap: saying `polisi api`. Correct Indonesian is `pemadam kebakaran`.",
          "Drill: `Panggil pemadam kebakaran.`",
        ],
      },
      {
        en: "Tolong hubungi polisi, ada perampokan.",
        vi: "Làm ơn liên hệ cảnh sát, có vụ cướp.",
        pronunciation_focus: [
          "TO-long hu-BUNG-i po-LI-si, A-da pe-ram-PO-kan - `hubungi` = liên hệ; `perampokan` = vụ cướp.",
          "Lỗi người Việt: dùng `panggil` cho mọi cuộc gọi. `Hubungi polisi` nghe như liên hệ chính thức, `panggil polisi` là gọi tới hiện trường.",
          "Luyện: `Tolong hubungi polisi.`",
        ],
        pronunciation_focus_en: [
          "TO-long hoo-BOONG-i po-LEE-see, A-da pe-ram-PO-kan - `hubungi` = contact; `perampokan` = robbery.",
          "VN-speaker trap: using `panggil` for every call. `Hubungi polisi` sounds like official contact; `panggil polisi` means call them to the scene.",
          "Drill: `Tolong hubungi polisi.`",
        ],
      },
      {
        en: "Lokasi kejadian di Jalan Melati nomor dua belas.",
        vi: "Địa điểm xảy ra sự việc ở đường Melati số mười hai.",
        pronunciation_focus: [
          "lo-KA-si ke-JA-di-an di JA-lan me-LA-ti NO-mor DU-a be-LAS - `lokasi kejadian` = địa điểm xảy ra sự việc.",
          "Lỗi người Việt: đặt số nhà trước tên đường theo tiếng Việt. Indonesia: `Jalan` + tên đường + `nomor` + số.",
          "Luyện: `Lokasi kejadian di Jalan Melati nomor dua belas.`",
        ],
        pronunciation_focus_en: [
          "lo-KA-see ke-JA-dee-an di JA-lan me-LA-tee NO-mor DOO-a be-LAS - `lokasi kejadian` = incident location.",
          "VN-speaker trap: placing the house number before the street name. Indonesian order: `Jalan` + street name + `nomor` + number.",
          "Drill: `Lokasi kejadian di Jalan Melati nomor dua belas.`",
        ],
      },
      {
        en: "Ada korban yang tidak sadar dan sulit bernapas.",
        vi: "Có nạn nhân bất tỉnh và khó thở.",
        pronunciation_focus: [
          "A-da KOR-ban yang ti-DAK SA-dar dan SU-lit ber-NA-pas - `korban` = nạn nhân; `tidak sadar` = bất tỉnh; `bernapas` = thở.",
          "Lỗi người Việt: dùng `ngantuk` cho bất tỉnh. `Ngantuk` là buồn ngủ; bất tỉnh là `tidak sadar`.",
          "Luyện: `Korban sulit bernapas.`",
        ],
        pronunciation_focus_en: [
          "A-da KOR-ban yang ti-DAK SA-dar dan SOO-lit ber-NA-pas - `korban` = victim; `tidak sadar` = unconscious; `bernapas` = breathe.",
          "VN-speaker trap: using `ngantuk` for unconscious. `Ngantuk` means sleepy; unconscious is `tidak sadar`.",
          "Drill: `Korban sulit bernapas.`",
        ],
      },
      {
        en: "Ada dua orang terluka, satu anak kecil dan satu orang dewasa.",
        vi: "Có hai người bị thương, một trẻ nhỏ và một người lớn.",
        pronunciation_focus: [
          "A-da DU-a O-rang ter-LU-ka, SA-tu A-nak ke-CHIL dan SA-tu O-rang de-WA-sa - `terluka` = bị thương; `orang dewasa` = người lớn.",
          "Lỗi người Việt: nói `dua korban luka` được, nhưng khi gọi điện nên rõ hơn: `dua orang terluka`.",
          "Luyện: `Ada dua orang terluka.`",
        ],
        pronunciation_focus_en: [
          "A-da DOO-a O-rang ter-LOO-ka, SA-too A-nak ke-CHIL dan SA-too O-rang de-WA-sa - `terluka` = injured; `orang dewasa` = adult.",
          "VN-speaker trap: `dua korban luka` can work, but on emergency calls `dua orang terluka` is clearer.",
          "Drill: `Ada dua orang terluka.`",
        ],
      },
      {
        en: "Saya panik, tapi saya akan tetap di telepon.",
        vi: "Tôi đang hoảng, nhưng tôi sẽ vẫn giữ máy.",
        pronunciation_focus: [
          "SA-ya PA-nik, TA-pi SA-ya A-kan te-TAP di te-LE-pon - `panik` = hoảng; `tetap di telepon` = giữ máy.",
          "Lỗi người Việt: dịch `ở trên điện thoại` quá sát. Cụm tự nhiên là `tetap di telepon` hoặc `jangan tutup telepon`.",
          "Luyện: `Saya akan tetap di telepon.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PA-nik, TA-pi SA-ya A-kan te-TAP di te-LE-pon - `panik` = panicked; `tetap di telepon` = stay on the phone.",
          "VN-speaker trap: literal 'on the phone'. Natural Indonesian is `tetap di telepon` or `jangan tutup telepon`.",
          "Drill: `Saya akan tetap di telepon.`",
        ],
      },
      {
        en: "Jangan tutup telepon, saya butuh instruksi.",
        vi: "Đừng cúp máy, tôi cần hướng dẫn.",
        pronunciation_focus: [
          "JA-ngan TU-tup te-LE-pon, SA-ya BU-tuh in-STRUK-si - `tutup telepon` = cúp máy; `instruksi` = hướng dẫn.",
          "Lỗi người Việt: nói `matikan telepon` cho cúp máy. Trong cuộc gọi, dùng `tutup telepon`.",
          "Luyện: `Jangan tutup telepon.`",
        ],
        pronunciation_focus_en: [
          "JA-ngan TU-tup te-LE-pon, SA-ya BOO-tuh in-STRUK-si - `tutup telepon` = hang up; `instruksi` = instructions.",
          "VN-speaker trap: saying `matikan telepon` for hanging up. In calls, use `tutup telepon`.",
          "Drill: `Jangan tutup telepon.`",
        ],
      },
      {
        en: "Apakah aman kalau saya memindahkan korban?",
        vi: "Tôi di chuyển nạn nhân có an toàn không?",
        pronunciation_focus: [
          "A-pa-kah A-man KA-lau SA-ya me-min-DAH-kan KOR-ban - `memindahkan` = di chuyển; `aman` = an toàn.",
          "Lỗi người Việt: dùng `pindah korban`. `Pindah` là tự chuyển chỗ; chuyển ai/cái gì là `memindahkan`.",
          "Luyện: `Apakah aman memindahkan korban?`",
        ],
        pronunciation_focus_en: [
          "A-pa-kah A-man KA-lau SA-ya me-min-DAH-kan KOR-ban - `memindahkan` = move/relocate something or someone; `aman` = safe.",
          "VN-speaker trap: saying `pindah korban`. `Pindah` means move oneself; moving someone/something is `memindahkan`.",
          "Drill: `Apakah aman memindahkan korban?`",
        ],
      },
      {
        en: "Petugas sudah dalam perjalanan ke lokasi.",
        vi: "Nhân viên cứu hộ/cán bộ đang trên đường đến hiện trường.",
        pronunciation_focus: [
          "pe-TU-gas SU-dah DA-lam per-ja-LAN-an ke lo-KA-si - `petugas` = nhân viên/cán bộ trực; `dalam perjalanan` = đang trên đường.",
          "Lỗi người Việt: nói `sedang di jalan` cho thông báo chính thức. Tổng đài thường nói `dalam perjalanan`.",
          "Luyện: `Petugas sudah dalam perjalanan.`",
        ],
        pronunciation_focus_en: [
          "pe-TOO-gas SOO-dah DA-lam per-ja-LAN-an ke lo-KA-see - `petugas` = officer/responder; `dalam perjalanan` = on the way.",
          "VN-speaker trap: saying `sedang di jalan` in official updates. Dispatchers often say `dalam perjalanan`.",
          "Drill: `Petugas sudah dalam perjalanan.`",
        ],
      },
      {
        en: "Nomor saya bisa dihubungi lagi kalau perlu.",
        vi: "Số của tôi có thể được gọi lại nếu cần.",
        pronunciation_focus: [
          "NO-mor SA-ya BI-sa di-hu-BUNG-i LA-gi KA-lau per-LU - `dihubungi` = được liên hệ; `kalau perlu` = nếu cần.",
          "Lỗi người Việt: nói `telepon saya lagi` có thể được, nhưng để tổng đài lưu thông tin, `nomor saya bisa dihubungi` rõ hơn.",
          "Luyện: `Nomor saya bisa dihubungi.`",
        ],
        pronunciation_focus_en: [
          "NO-mor SA-ya BI-sa di-hoo-BOONG-i LA-gi KA-lau per-LOO - `dihubungi` = can be contacted; `kalau perlu` = if needed.",
          "VN-speaker trap: `telepon saya lagi` works, but for a dispatcher recording details, `nomor saya bisa dihubungi` is clearer.",
          "Drill: `Nomor saya bisa dihubungi.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, số khẩn cấp chung là 112 ở nhiều khu vực; ambulans thường liên quan 118/119, pemadam kebakaran thường 113, polisi là 110. Khi gọi, hãy nói ngắn theo thứ tự: loại khẩn cấp, lokasi kejadian, jumlah korban, tình trạng nạn nhân, nguy cơ hiện tại, số liên hệ. Nếu hoảng, nói thẳng `Saya panik` rồi giữ máy để nghe instruksi.",
    cultural_notes_en:
      "In Indonesia, 112 is a general emergency number in many areas; ambulances are often associated with 118/119, fire services with 113, and police with 110. On a call, keep the order short: emergency type, incident location, number of victims, victim condition, current danger, and contact number. If panicked, say `Saya panik` and stay on the line for instructions.",
    tip_advice_vi:
      "Mẹo cho người Việt: trong cuộc gọi khẩn, đừng cố nói câu dài. Dùng khung cố định: `Ini keadaan darurat`, `Saya butuh ambulans`, `Lokasi kejadian di...`, `Ada korban...`, `Jangan tutup telepon`. Phân biệt `panggil` (gọi tới hiện trường), `hubungi` (liên hệ), `tutup telepon` (cúp máy), và `tetap di telepon` (giữ máy).",
    tip_advice_en:
      "Tip for Vietnamese speakers: in an emergency call, do not try long sentences. Use fixed frames: `Ini keadaan darurat`, `Saya butuh ambulans`, `Lokasi kejadian di...`, `Ada korban...`, `Jangan tutup telepon`. Distinguish `panggil` (summon to the scene), `hubungi` (contact), `tutup telepon` (hang up), and `tetap di telepon` (stay on the line).",
    vocabulary: [
      { cell_id: "98f4c573-7ad5-4c9d-b949-60af257bfc10", word: "telepon darurat", en: "emergency call", vi: "cuộc gọi khẩn cấp", pos: "noun phrase", pronunciation_vi: "te-LE-pon da-RU-rat", pronunciation_en: "te-LE-pon da-ROO-rat" },
      { cell_id: "fd3d7f53-8490-4f28-8840-dd86253eb084", word: "ambulans", en: "ambulance", vi: "xe cứu thương", pos: "noun", pronunciation_vi: "am-bu-LANS", pronunciation_en: "am-boo-LANS" },
      { cell_id: "7ccaa2d9-0e8f-4b98-9181-7ab8ef6e7035", word: "pemadam kebakaran", en: "fire brigade / firefighters", vi: "lực lượng cứu hỏa", pos: "noun phrase", pronunciation_vi: "pe-MA-dam ke-ba-KA-ran", pronunciation_en: "pe-MA-dam ke-ba-KA-ran" },
      { cell_id: "e8be1182-8f67-4539-a76c-d39a7c04823c", word: "polisi", en: "police", vi: "cảnh sát", pos: "noun", pronunciation_vi: "po-LI-si", pronunciation_en: "po-LEE-see" },
      { cell_id: "68c4ef41-99ef-464a-84dc-f12f1eb91b0e", word: "lokasi kejadian", en: "incident location", vi: "địa điểm xảy ra sự việc", pos: "noun phrase", pronunciation_vi: "lo-KA-si ke-JA-di-an", pronunciation_en: "lo-KA-see ke-JA-dee-an" },
      { cell_id: "fc9befc9-cff6-4d22-8a06-993681f250c9", word: "korban", en: "victim", vi: "nạn nhân", pos: "noun", pronunciation_vi: "KOR-ban", pronunciation_en: "KOR-ban" },
      { cell_id: "d68d44c0-dcf4-45fc-bc9a-48420bf64715", word: "panik", en: "panicked", vi: "hoảng", pos: "adjective", pronunciation_vi: "PA-nik", pronunciation_en: "PA-nik" },
      { cell_id: "0cfd309c-b3cb-49ad-917c-8d170b3c0458", word: "minta bantuan", en: "ask for help", vi: "xin hỗ trợ", pos: "verb phrase", pronunciation_vi: "MIN-ta ban-TU-an", pronunciation_en: "MIN-ta ban-TOO-an" },
      { cell_id: "eca78f8f-a925-4af4-be9e-be62a95188ac", word: "terluka", en: "injured", vi: "bị thương", pos: "state verb", pronunciation_vi: "ter-LU-ka", pronunciation_en: "ter-LOO-ka" },
      { cell_id: "2f842729-af7c-4a38-ac9c-a7296e2ea4a2", word: "tidak sadar", en: "unconscious", vi: "bất tỉnh", pos: "adjective phrase", pronunciation_vi: "ti-DAK SA-dar", pronunciation_en: "ti-DAK SA-dar" },
      { cell_id: "276881f2-9f8e-44a5-907d-0e13c57c82fb", word: "tutup telepon", en: "hang up", vi: "cúp máy", pos: "verb phrase", pronunciation_vi: "TU-tup te-LE-pon", pronunciation_en: "TOO-toop te-LE-pon" },
      { cell_id: "43d74d00-ef1b-479d-824e-c2ab56d98d02", word: "dalam perjalanan", en: "on the way", vi: "đang trên đường", pos: "phrase", pronunciation_vi: "DA-lam per-ja-LAN-an", pronunciation_en: "DA-lam per-ja-LAN-an" },
    ],
    dialogue: [
      {
        cell_id: "60835bcb-a049-4b51-92ed-bbdb0d43012e",
        speaker: "Penelepon",
        text: "Halo, ini keadaan darurat. Saya butuh ambulans sekarang juga.",
        vi: "A lô, đây là tình huống khẩn cấp. Tôi cần xe cứu thương ngay bây giờ.",
        en: "Hello, this is an emergency. I need an ambulance right now.",
      },
      {
        cell_id: "db5a16e6-2f64-4453-a002-ba2ce3dbdadd",
        speaker: "Petugas",
        text: "Lokasi kejadian di mana? Ada berapa korban?",
        vi: "Địa điểm xảy ra sự việc ở đâu? Có bao nhiêu nạn nhân?",
        en: "Where is the incident location? How many victims are there?",
      },
      {
        cell_id: "d7b45bd6-aea2-42b3-ba8e-99d61ab7da17",
        speaker: "Penelepon",
        text: "Di Jalan Melati nomor dua belas. Ada dua orang terluka.",
        vi: "Ở đường Melati số mười hai. Có hai người bị thương.",
        en: "At Jalan Melati number twelve. Two people are injured.",
      },
      {
        cell_id: "f08677e8-3055-428b-b091-86e859ed9587",
        speaker: "Petugas",
        text: "Baik, petugas dalam perjalanan. Jangan tutup telepon.",
        vi: "Được, nhân viên cứu hộ đang trên đường. Đừng cúp máy.",
        en: "Okay, responders are on the way. Do not hang up.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng trong cuộc gọi khẩn cấp:",
        instruction_en: "Fill in the right emergency-call word:",
        items: [
          {
            prompt: "Saya butuh ___ sekarang juga. (xe cứu thương)",
            answer: "ambulans",
            options: ["ambulans", "alamat", "apotek"],
          },
          {
            prompt: "Tolong panggil ___ kebakaran. (cứu hỏa)",
            answer: "pemadam",
            options: ["pemadam", "pengungsi", "pembeli"],
          },
          {
            prompt: "Ada dua orang ___. (bị thương)",
            answer: "terluka",
            options: ["terluka", "tertawa", "terlambat"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối cụm tiếng Indonesia với nghĩa tiếng Việt:",
        instruction_en: "Match each Indonesian phrase with its Vietnamese meaning:",
        items: [
          { prompt: "lokasi kejadian", answer: "địa điểm xảy ra sự việc" },
          { prompt: "tutup telepon", answer: "cúp máy" },
          { prompt: "tidak sadar", answer: "bất tỉnh" },
          { prompt: "dalam perjalanan", answer: "đang trên đường" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Đây là tình huống khẩn cấp.", answer: "Ini keadaan darurat." },
          { prompt: "Địa điểm xảy ra sự việc ở đường Melati.", answer: "Lokasi kejadian di Jalan Melati." },
          { prompt: "Đừng cúp máy, tôi cần hướng dẫn.", answer: "Jangan tutup telepon, saya butuh instruksi." },
        ],
      },
    ],
  },
];

export default lessons;
