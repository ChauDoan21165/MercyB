// Clinic women's health Indonesian lesson pack for Vietnamese learners.
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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_womens_health_symptoms_checkup",
    level: "B1",
    category: "health",
    title_vi: "Kesehatan perempuan: haid, nyeri, dan kiểm tra rutin",
    title_en: "Women's health: periods, pain, and routine checkups",
    sentences: [
      {
        en: "Saya ingin membuat janji temu dengan dokter kandungan.",
        vi: "Tôi muốn đặt lịch hẹn với bác sĩ phụ khoa.",
        pronunciation_focus: [
          "SA-ya I-ngin mem-BU-at JAN-ji TE-mu deNG-an dok-ter kan-DUNG-an.",
          "`dokter kandungan` = bác sĩ phụ khoa; `janji temu` = lịch hẹn/appointment.",
          "L1 Việt: `kandungan` ở đây là sản phụ khoa/phụ khoa; đừng hiểu theo nghĩa chung chung của từ gốc `kandung`.",
        ],
        pronunciation_focus_en: [
          "SA-ya I-ngin mem-BOO-at JAN-jee TE-moo deNG-an dok-ter kan-DOONG-an.",
          "`dokter kandungan` = OB-GYN; `janji temu` = appointment.",
          "VN-speaker note: `kandungan` here refers to obstetrics/gynecology; do not interpret it too literally from the root `kandung`.",
        ],
      },
      {
        en: "Saya sedang haid dan perut saya terasa nyeri.",
        vi: "Tôi đang trong kỳ kinh và bụng tôi đau.",
        pronunciation_focus: [
          "SA-ya se-DANG HA-id dan pe-RUT SA-ya te-RA-sa NYE-ri.",
          "`haid` = kỳ kinh; `nyeri` = đau/nhức, thường dùng trong y tế.",
          "L1 Việt: `nyeri` là từ rất hữu ích trong khám bệnh; không cần nói dài như `sakit sekali` nếu muốn mô tả triệu chứng rõ.",
        ],
        pronunciation_focus_en: [
          "SA-ya se-DANG HA-id dan pe-ROOT SA-ya te-RA-sa NYE-ree.",
          "`haid` = period/menstruation; `nyeri` = pain/aching, common in medical speech.",
          "VN-speaker note: `nyeri` is a very useful medical word; you do not need a long phrase like `sakit sekali` when describing symptoms clearly.",
        ],
      },
      {
        en: "Kramnya datang setiap bulan dan kadang cukup kuat.",
        vi: "Cơn co thắt xuất hiện mỗi tháng và đôi khi khá mạnh.",
        pronunciation_focus: [
          "KRAM-nya DA-tang se-TI-ap BU-lan dan KA-dang CU-kup KU-at.",
          "`kram` = co thắt/chuột rút; `cukup kuat` = khá mạnh.",
          "L1 Việt: trong mô tả y tế, `setiap bulan` nghe tự nhiên hơn `tiap bulan sekali` khi nói về chu kỳ.",
        ],
        pronunciation_focus_en: [
          "KRAM-nya DA-tang se-TEE-ap BOO-lan dan KA-dang CHOO-kup KOOT.",
          "`kram` = cramp; `cukup kuat` = quite strong.",
          "VN-speaker note: in medical descriptions, `setiap bulan` sounds natural for a cycle; it is better than over-expanding the phrase.",
        ],
      },
      {
        en: "Saya perlu pemeriksaan rutin untuk kesehatan perempuan.",
        vi: "Tôi cần khám định kỳ về sức khỏe phụ nữ.",
        pronunciation_focus: [
          "SA-ya per-LU pe-me-rik-SA-an RU-tin UN-tuk ke-se-HA-tan pe-rem-PU-an.",
          "`pemeriksaan rutin` = kiểm tra định kỳ; `kesehatan perempuan` = sức khỏe phụ nữ.",
          "L1 Việt: `rutin` ở đây là đều đặn/định kỳ, không phải chỉ việc lặp lại máy móc.",
        ],
        pronunciation_focus_en: [
          "SA-ya per-LOO pe-me-rik-SA-an ROO-tin OON-tuk ke-se-HA-tan pe-rem-POO-an.",
          "`pemeriksaan rutin` = routine checkup; `kesehatan perempuan` = women's health.",
          "VN-speaker note: `rutin` here means regular/periodic, not merely repetitive.",
        ],
      },
      {
        en: "Apakah saya perlu USG atau tes lain?",
        vi: "Tôi có cần siêu âm hoặc xét nghiệm khác không?",
        pronunciation_focus: [
          "A-pa-kah SA-ya per-LU U-ES-GE a-tau tes LA-in.",
          "`USG` sering dibaca satu-satu: U-ES-GE; `tes` = xét nghiệm/kiểm tra.",
          "L1 Việt: đừng đọc `USG` như một từ tiếng Việt. Ở Indonesia, viết tắt medis sering diucapkan per huruf.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah SA-ya per-LOO U-ES-GEE a-TOO tes LA-in.",
          "`USG` is often spelled out: U-E-S-G; `tes` = test/exam.",
          "VN-speaker note: do not read `USG` as one Vietnamese-style word; Indonesian medical abbreviations are often pronounced letter by letter.",
        ],
      },
      {
        en: "Saya ingin tahu hasil tes saya secara jelas.",
        vi: "Tôi muốn biết rõ kết quả xét nghiệm của tôi.",
        pronunciation_focus: [
          "SA-ya I-ngin TA-hu ha-SIL tes SA-ya se-CA-ra JE-las.",
          "`hasil tes` = kết quả xét nghiệm; `secara jelas` = một cách rõ ràng.",
          "L1 Việt: `hasil` là kết quả; trong bệnh viện, hỏi `hasil tes` nghe tự nhiên hơn `jawaban tes`.",
        ],
        pronunciation_focus_en: [
          "SA-ya I-ngin TA-hoo ha-SEEL tes SA-ya se-CHA-ra JE-las.",
          "`hasil tes` = test result; `secara jelas` = clearly.",
          "VN-speaker note: `hasil` means result; in a clinic, `hasil tes` sounds natural, not `jawaban tes`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Di klinik atau rumah sakit Indonesia, pasien biasanya menyebut gejala dengan singkat dan jelas: kapan haid terakhir, nyeri di bagian mana, seberapa kuat, dan apakah ada tes sebelumnya. Untuk kesehatan perempuan, dokter kandungan là chuyên môn tepat khi nói về haid tidak teratur, nyeri panggul, pemeriksaan rutin, atau hasil USG. Jika Anda ingin privasi, Anda bisa bilang `Saya ingin bicara secara pribadi` atau `Saya kurang nyaman membicarakan ini di depan orang lain`.",
    cultural_notes_en:
      "In Indonesian clinics or hospitals, patients usually describe symptoms briefly and clearly: when the last period started, where the pain is, how strong it is, and whether there were previous tests. For women's health, an ob-gyn is the right specialist for irregular periods, pelvic pain, routine checkups, or ultrasound results. If you want privacy, you can say `Saya ingin bicara secara pribadi` or `Saya kurang nyaman membicarakan ini di depan orang lain`.",
    tip_advice_vi:
      "Mẫu nói rất hữu ích: `Saya sedang haid`, `Saya perut saya terasa nyeri`, `Saya perlu pemeriksaan rutin`, `Saya ingin tahu hasil tes`. Người Việt nên học cách hỏi lịch hẹn bằng `janji temu` và nhớ `USG` thường đọc theo từng chữ.",
    tip_advice_en:
      "Very useful phrases: `Saya sedang haid`, `Perut saya terasa nyeri`, `Saya perlu pemeriksaan rutin`, `Saya ingin tahu hasil tes`. Vietnamese speakers should learn to ask for an appointment with `janji temu` and remember `USG` is often spelled out letter by letter.",
    vocabulary: [
      { cell_id: "1133c837-d333-4fa9-9dc0-bda36fb08f17", word: "dokter kandungan", en: "ob-gyn / gynecologist", vi: "bác sĩ phụ khoa", pos: "noun phrase", pronunciation_vi: "dok-ter kan-DUNG-an", pronunciation_en: "dok-ter kan-DOONG-an" },
      { cell_id: "00e27baa-766c-402d-a55a-a31c9aad8b5b", word: "haid", en: "period / menstruation", vi: "kỳ kinh", pos: "noun", pronunciation_vi: "HA-id", pronunciation_en: "HA-id" },
      { cell_id: "0777ce24-9f7d-4a27-8902-9f2a7e625be4", word: "nyeri", en: "painful / pain", vi: "đau", pos: "adjective / noun", pronunciation_vi: "NYE-ri", pronunciation_en: "NYE-ree" },
      { cell_id: "6539f532-134d-4650-bb6d-8d45d6b7b968", word: "pemeriksaan rutin", en: "routine checkup", vi: "khám định kỳ", pos: "noun phrase", pronunciation_vi: "pe-me-rik-SA-an RU-tin", pronunciation_en: "pe-me-rik-SA-an ROO-tin" },
      { cell_id: "1bd7b8ae-540e-4299-bfb1-63c465d07016", word: "janji temu", en: "appointment", vi: "lịch hẹn", pos: "noun phrase", pronunciation_vi: "JAN-ji TE-mu", pronunciation_en: "JAN-jee TE-moo" },
      { cell_id: "4f5a251b-0874-4576-a091-82f520e26a91", word: "USG", en: "ultrasound", vi: "siêu âm", pos: "noun", pronunciation_vi: "U-ES-GE", pronunciation_en: "U-ES-GEE" },
      { cell_id: "f278235d-2514-4d3e-b01d-dabbfb755ebd", word: "hasil tes", en: "test result", vi: "kết quả xét nghiệm", pos: "noun phrase", pronunciation_vi: "HA-sil tes", pronunciation_en: "HA-seel tes" },
    ],
    dialogue: [
      {
        cell_id: "42620944-a426-4e28-8aea-0f0e67506fe5",
        speaker: "Pasien",
        text: "Selamat pagi, saya ingin membuat janji temu dengan dokter kandungan.",
        vi: "Chào buổi sáng, tôi muốn đặt lịch hẹn với bác sĩ phụ khoa.",
        en: "Good morning, I would like to make an appointment with the gynecologist.",
      },
      {
        cell_id: "917c7f11-1e6d-478a-a8f9-50866141db7d",
        speaker: "Petugas",
        text: "Baik. Keluhannya apa, Bu?",
        vi: "Vâng. Chị đang than phiền về triệu chứng gì ạ?",
        en: "Okay. What is the complaint, Ma'am?",
      },
      {
        cell_id: "f05f9cdd-95b2-422b-b65c-7153483c2560",
        speaker: "Pasien",
        text: "Saya sedang haid dan perut saya terasa nyeri.",
        vi: "Tôi đang trong kỳ kinh và bụng tôi đau.",
        en: "I am on my period and my stomach feels painful.",
      },
      {
        cell_id: "0cb185d5-61e0-4a22-acf0-9a63a294ac74",
        speaker: "Petugas",
        text: "Silakan tunggu. Dokter akan memeriksa Anda sebentar lagi.",
        vi: "Xin vui lòng chờ. Bác sĩ sẽ khám cho chị ngay sau đây.",
        en: "Please wait. The doctor will examine you shortly.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "dokter kandungan", answer: "bác sĩ phụ khoa" },
          { prompt: "haid", answer: "kỳ kinh" },
          { prompt: "janji temu", answer: "lịch hẹn" },
          { prompt: "hasil tes", answer: "kết quả xét nghiệm" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi muốn đặt lịch hẹn với bác sĩ phụ khoa.", answer: "Saya ingin membuat janji temu dengan dokter kandungan." },
          { prompt: "Tôi cần khám định kỳ về sức khỏe phụ nữ.", answer: "Saya perlu pemeriksaan rutin untuk kesehatan perempuan." },
          { prompt: "Tôi muốn biết rõ kết quả xét nghiệm của tôi.", answer: "Saya ingin tahu hasil tes saya secara jelas." },
        ],
      },
    ],
  },
  {
    id: "indonesian_womens_health_privacy_results",
    level: "B2",
    category: "health",
    title_vi: "Privasi pasien, kết quả xét nghiệm, và theo dõi",
    title_en: "Patient privacy, test results, and follow-up",
    sentences: [
      {
        en: "Saya ingin bicara secara pribadi tentang hasil pemeriksaan.",
        vi: "Tôi muốn nói riêng về kết quả khám.",
        pronunciation_focus: [
          "SA-ya I-ngin BI-ca-ra se-CA-ra pri-BA-di ten-TANG ha-SIL pe-me-rik-SA-an.",
          "`secara pribadi` = một cách riêng tư; `hasil pemeriksaan` = kết quả khám.",
          "L1 Việt: nếu không muốn nói trước người khác, cụm này rất lịch sự và rõ ý.",
        ],
        pronunciation_focus_en: [
          "SA-ya I-ngin BEE-cha-ra se-CHA-ra pree-BA-di ten-TANG ha-SEEL pe-me-rik-SA-an.",
          "`secara pribadi` = privately; `hasil pemeriksaan` = examination result.",
          "VN-speaker note: if you do not want to speak in front of others, this phrase is polite and clear.",
        ],
      },
      {
        en: "Apakah privasi pasien dijaga di ruangan ini?",
        vi: "Quyền riêng tư của bệnh nhân có được giữ ở phòng này không?",
        pronunciation_focus: [
          "A-pa-kah pri-va-si PA-si-en di-JA-ga di ru-ANG-an i-ni.",
          "`privasi pasien` = sự riêng tư của bệnh nhân; `dijaga` = được giữ/được bảo vệ.",
          "L1 Việt: `privasi` là từ mượn rất phổ biến trong dịch vụ y tế; dùng với `dijaga` nghe tự nhiên.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah pree-VA-see PA-see-en di-JA-ga di roo-AN-gan EE-ni.",
          "`privasi pasien` = patient privacy; `dijaga` = is protected/maintained.",
          "VN-speaker note: `privasi` is a common loanword in healthcare; pairing it with `dijaga` sounds natural.",
        ],
      },
      {
        en: "Saya sudah mendapat hasil tes, tetapi masih ada pertanyaan.",
        vi: "Tôi đã nhận được kết quả xét nghiệm, nhưng vẫn còn câu hỏi.",
        pronunciation_focus: [
          "SA-ya SU-dah men-da-PAT ha-SIL tes, te-ta-pi ma-SIH A-da per-ta-nya-AN.",
          "`mendapat hasil` = nhận được kết quả; `pertanyaan` = câu hỏi.",
          "L1 Việt: `masih ada pertanyaan` là cách rất tự nhiên để xin giải thích thêm.",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah men-da-PAT ha-SEEL tes, te-ta-PEE ma-SHEE A-da per-ta-NYA-an.",
          "`mendapat hasil` = receive a result; `pertanyaan` = question.",
          "VN-speaker note: `masih ada pertanyaan` is a very natural way to ask for more explanation.",
        ],
      },
      {
        en: "Bisa dijelaskan hasil tes saya dengan bahasa yang sederhana?",
        vi: "Có thể giải thích kết quả xét nghiệm của tôi bằng ngôn ngữ đơn giản không?",
        pronunciation_focus: [
          "BI-sa di-je-LAS-kan ha-SIL tes SA-ya de-NGAN ba-HA-sa yang se-de-HA-na.",
          "`dijelaskan` = được giải thích; `bahasa yang sederhana` = ngôn ngữ đơn giản.",
          "L1 Việt: khi nghe kết quả y tế, yêu cầu `bahasa yang sederhana` giúp tránh hiểu lầm thuật ngữ.",
        ],
        pronunciation_focus_en: [
          "BEE-sa di-je-LAS-kan ha-SEEL tes SA-ya de-NGAN ba-HA-sa yang se-de-HA-na.",
          "`dijelaskan` = explained; `bahasa yang sederhana` = simple language.",
          "VN-speaker note: asking for `bahasa yang sederhana` helps avoid misunderstanding medical terms.",
        ],
      },
      {
        en: "Saya perlu kontrol ulang minggu depan.",
        vi: "Tôi cần tái khám vào tuần tới.",
        pronunciation_focus: [
          "SA-ya per-LU kon-TROL u-LANG MING-gu de-PAN.",
          "`kontrol ulang` = tái khám/theo dõi lại; `minggu depan` = tuần tới.",
          "L1 Việt: `kontrol` trong y tế là tái khám theo dõi, không phải 'kiểm soát' theo nghĩa chung.",
        ],
        pronunciation_focus_en: [
          "SA-ya per-LOO kon-TROL oo-LANG MING-goo de-PAN.",
          "`kontrol ulang` = follow-up checkup; `minggu depan` = next week.",
          "VN-speaker note: in medical contexts, `kontrol` means follow-up checkup, not general control.",
        ],
      },
      {
        en: "Kalau ada efek samping, saya harus hubungi klinik ini?",
        vi: "Nếu có tác dụng phụ, tôi có phải liên hệ phòng khám này không?",
        pronunciation_focus: [
          "KA-lau A-da e-FEK sam-PING, SA-ya HA-rus hu-BUNG-i KLI-nik i-ni.",
          "`efek samping` = tác dụng phụ; `hubungi klinik` = liên hệ phòng khám.",
          "L1 Việt: hỏi bằng `harus hubungi` là rõ trách nhiệm; rất hữu ích khi dặn dò sau khám.",
        ],
        pronunciation_focus_en: [
          "KA-loo A-da eh-FEK sam-PEENG, SA-ya HA-roos hoo-BOONG-gee KLEE-nik ee-ni.",
          "`efek samping` = side effect; `hubungi klinik` = contact the clinic.",
          "VN-speaker note: asking `harus hubungi` makes the responsibility clear; useful in after-care instructions.",
        ],
      },
      {
        en: "Mohon kirim hasil tes melalui email agar saya punya catatan.",
        vi: "Xin hãy gửi kết quả xét nghiệm qua email để tôi có bản lưu.",
        pronunciation_focus: [
          "MO-hon KI-rim ha-SIL tes me-la-LU-i e-MEL a-GAR SA-ya PU-nya ca-TA-tan.",
          "`melalui email` = qua email; `catatan` = bản ghi/chú thích/hồ sơ lưu.",
          "L1 Việt: nếu muốn bukti tertulis, email là pilihan bagus karena ada catatan.",
        ],
        pronunciation_focus_en: [
          "MO-hon KEE-rim ha-SEEL tes me-la-LOO-ee ee-MAIL a-GAR SA-ya POO-nya cha-TA-tan.",
          "`melalui email` = via email; `catatan` = written record/note.",
          "VN-speaker note: if you want a written record, email is a good choice because it leaves a trace.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở klinik phụ khoa hoặc tổng quát, câu hỏi lịch sự nhưng rõ ràng sẽ hiệu quả hơn: nói về triệu chứng, thời điểm bắt đầu, và kết quả khám trước đó. Nếu muốn riêng tư, bạn có thể yêu cầu bicara secara pribadi hoặc minta ruangan yang lebih tertutup. Khi nhận hasil tes, nhiều pasien ở Indonesia muốn hasilnya dikirim lewat email agar ada catatan.",
    cultural_notes_en:
      "In gynecology or general clinics, polite but clear questions work best: describe the symptoms, when they started, and any previous test results. If you want privacy, you can ask to speak privately or request a more closed room. When receiving test results, many patients in Indonesia prefer them sent by email so there is a record.",
    tip_advice_vi:
      "Khung nhớ nhanh: `Saya ingin membuat janji temu`, `Saya sedang haid`, `Saya ingin bicara secara pribadi`, `Mohon kirim hasil tes melalui email`. Người Việt nên chú ý các từ y tế bị động như `dijaga`, `dijelaskan`, `dikirim`.",
    tip_advice_en:
      "Fast memory set: `Saya ingin membuat janji temu`, `Saya sedang haid`, `Saya ingin bicara secara pribadi`, `Mohon kirim hasil tes melalui email`. Vietnamese speakers should pay attention to passive medical forms like `dijaga`, `dijelaskan`, `dikirim`.",
    vocabulary: [
      { cell_id: "a0d51d0a-b743-46e8-bdfc-8aa436f02b0f", word: "privasi pasien", en: "patient privacy", vi: "quyền riêng tư của bệnh nhân", pos: "noun phrase", pronunciation_vi: "pri-va-si PA-si-en", pronunciation_en: "pree-VA-see PA-see-en" },
      { cell_id: "496338e1-89a0-4c23-adfe-61b5cc78dfea", word: "hasil pemeriksaan", en: "examination result", vi: "kết quả khám", pos: "noun phrase", pronunciation_vi: "ha-SIL pe-me-rik-SA-an", pronunciation_en: "ha-SEEL pe-me-rik-SA-an" },
      { cell_id: "f43295cd-10a0-4435-a90b-50538712fc72", word: "kontrol ulang", en: "follow-up checkup", vi: "tái khám", pos: "noun phrase", pronunciation_vi: "kon-TROL u-LANG", pronunciation_en: "kon-TROL oo-LANG" },
      { cell_id: "73b75b70-6fa6-4267-9de2-c0b26182f6b7", word: "efek samping", en: "side effect", vi: "tác dụng phụ", pos: "noun phrase", pronunciation_vi: "e-FEK sam-PING", pronunciation_en: "eh-FEK sam-PEENG" },
      { cell_id: "c7635111-26e4-4ff3-ba50-3163d9a5813f", word: "bahasa yang sederhana", en: "simple language", vi: "ngôn ngữ đơn giản", pos: "noun phrase", pronunciation_vi: "ba-HA-sa yang se-de-HA-na", pronunciation_en: "ba-HA-sa yang se-de-HA-na" },
      { cell_id: "2b140957-389b-400e-abf5-d3aad54abd9f", word: "catatan", en: "record / note", vi: "bản ghi / ghi chú", pos: "noun", pronunciation_vi: "ca-TA-tan", pronunciation_en: "cha-TA-tan" },
    ],
    dialogue: [
      {
        cell_id: "08c14a48-9cee-49c7-8d6a-36cdb4638c1d",
        speaker: "Pasien",
        text: "Saya ingin bicara secara pribadi tentang hasil pemeriksaan.",
        vi: "Tôi muốn nói riêng về kết quả khám.",
        en: "I would like to speak privately about the examination results.",
      },
      {
        cell_id: "c991275d-730d-463f-9c2d-a0f8991bc8e8",
        speaker: "Petugas",
        text: "Tentu. Privasi pasien dijaga di ruangan ini.",
        vi: "Tất nhiên. Quyền riêng tư của bệnh nhân được giữ trong phòng này.",
        en: "Of course. Patient privacy is protected in this room.",
      },
      {
        cell_id: "7d08e764-7af1-4b69-b716-f505079af906",
        speaker: "Pasien",
        text: "Mohon kirim hasil tes melalui email agar saya punya catatan.",
        vi: "Xin hãy gửi kết quả xét nghiệm qua email để tôi có bản lưu.",
        en: "Please send the test results by email so I have a record.",
      },
      {
        cell_id: "145f48a8-c205-4eea-b02c-10f62173d61a",
        speaker: "Petugas",
        text: "Baik, dan silakan kontrol ulang minggu depan.",
        vi: "Vâng, và mời tái khám vào tuần tới.",
        en: "Okay, and please come back for a follow-up checkup next week.",
      },
    ],
    exercises: [
      {
        type: "multiple_choice",
        instruction_vi: "Chọn câu lịch sự và đúng ngữ cảnh bệnh viện.",
        instruction_en: "Choose the polite and appropriate hospital sentence.",
        items: [
          {
            prompt: "Bạn muốn khám riêng về kết quả.",
            answer: "Saya ingin bicara secara pribadi tentang hasil pemeriksaan.",
            options: [
              "Saya ingin bicara secara pribadi tentang hasil pemeriksaan.",
              "Saya mau teriak di sini.",
              "Kasih tahu cepat hasilnya!",
            ],
          },
          {
            prompt: "Bạn muốn hỏi về tái khám.",
            answer: "Saya perlu kontrol ulang minggu depan.",
            options: [
              "Saya perlu kontrol ulang minggu depan.",
              "Saya tidak mau kembali lagi.",
              "Apa saya harus berhenti saja?",
            ],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi muốn nói riêng về kết quả khám.", answer: "Saya ingin bicara secara pribadi tentang hasil pemeriksaan." },
          { prompt: "Quyền riêng tư của bệnh nhân có được giữ ở phòng này không?", answer: "Apakah privasi pasien dijaga di ruangan ini?" },
          { prompt: "Xin hãy gửi kết quả xét nghiệm qua email để tôi có bản lưu.", answer: "Mohon kirim hasil tes melalui email agar saya punya catatan." },
        ],
      },
    ],
  },
];
