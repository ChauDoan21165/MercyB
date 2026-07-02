// src/languages/indonesian/extra/healthcare-emergency.ts
//
// Indonesian healthcare & emergency survival pack for Vietnamese learners.
// Covers: the emergency room (IGD), describing symptoms to a doctor at the
// hospital (rumah sakit), the pharmacy (apotek), and the BPJS national health
// insurance system. Hand-crafted, no filler.
//
// Shape mirrors the named template src/languages/portuguese/lessons-a1.ts so the
// page UI stays consistent across language verticals. The types are defined
// inline because the Indonesian pack has no sibling lessons.ts registry yet
// (A7 owns it) — this file is self-contained on purpose. Types are NOT exported
// and the lesson array uses a unique name so a future barrel `export *` cannot
// collide with the sibling extra packs.
//
// Field convention (inherited from the Portuguese pack): a sentence's `en` slot
// holds the TARGET-LANGUAGE text (here: Indonesian), `vi` holds the Vietnamese
// gloss. `pronunciation_focus` carries Vietnamese-facing pronunciation/grammar
// notes (incl. the common Vietnamese-speaker mistake = L1 note);
// `pronunciation_focus_en` is the English-speaker companion, same length + order.
//
// Indonesian uses the Latin alphabet — no special script rendering needed.

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

export const healthcareEmergencyLessons: IndonesianLesson[] = [
  {
    id: "indonesian_emergency_igd",
    level: "A1",
    category: "health_emergency",
    title_vi: "Cấp cứu — Phòng cấp cứu (IGD)",
    title_en: "Emergency — the ER (IGD)",
    sentences: [
      {
        en: "Tolong! Ini darurat!",
        vi: "Cứu với! Đây là trường hợp khẩn cấp!",
        pronunciation_focus: [
          "tolong → TÔ-long, 'cứu với'",
          "darurat → da-RU-rat, 'khẩn cấp'",
          "không chia động từ — câu y hệt dù ai nói",
        ],
        pronunciation_focus_en: [
          "tolong → 'TOH-long' — the all-purpose 'help!' / 'please'",
          "darurat → 'da-ROO-rat' — emergency",
          "no verb conjugation: the sentence is identical no matter who speaks",
        ],
      },
      {
        en: "Di mana ruang gawat darurat?",
        vi: "Phòng cấp cứu ở đâu?",
        pronunciation_focus: [
          "di mana → 'ở đâu' (di = ở, mana = đâu)",
          "gawat darurat → 'nguy cấp - khẩn cấp' = cấp cứu, viết tắt IGD",
          "ruang → RU-ang, 'phòng/khu'",
        ],
        pronunciation_focus_en: [
          "di mana → 'where' — 'di' is the static preposition 'at/in'",
          "gawat darurat → literally 'critical-emergency' = ER; abbreviated IGD",
          "ruang → 'ROO-ang' — room/area",
        ],
      },
      {
        en: "Tolong panggil ambulans, cepat!",
        vi: "Làm ơn gọi xe cứu thương, nhanh lên!",
        pronunciation_focus: [
          "panggil → PANG-gil, 'gọi (người/dịch vụ)'",
          "ambulans → AM-bu-lans, mượn từ tiếng Anh 'ambulance'",
          "cepat → cheu-PAT, 'nhanh'",
        ],
        pronunciation_focus_en: [
          "panggil → 'PANG-gil' — to call/summon a person or service",
          "ambulans → 'AM-boo-lans' — loanword from English 'ambulance'",
          "cepat → 'che-PAT' — fast/quick; 'c' is always 'ch'",
        ],
      },
      {
        en: "Dia tidak sadar dan tidak bernapas.",
        vi: "Anh ấy bất tỉnh và không thở.",
        pronunciation_focus: [
          "dia = 'anh/chị/nó' — KHÔNG phân biệt giới tính, dễ cho người Việt",
          "tidak sadar → 'không tỉnh' = bất tỉnh",
          "bernapas → ber-NA-pas, 'thở' (gốc napas + tiền tố ber-)",
        ],
        pronunciation_focus_en: [
          "dia → he/she/it — Indonesian has NO gender on pronouns (easier!)",
          "tidak sadar → 'not conscious' = unconscious",
          "bernapas → 'ber-NA-pas' — to breathe (root 'napas' + prefix 'ber-')",
        ],
      },
      {
        en: "Saya butuh dokter sekarang juga.",
        vi: "Tôi cần bác sĩ ngay bây giờ.",
        pronunciation_focus: [
          "butuh → BU-tuh, 'cần'",
          "dokter → DOK-ter, 'bác sĩ'",
          "sekarang juga → 'ngay lập tức' (juga nhấn mạnh 'ngay')",
        ],
        pronunciation_focus_en: [
          "butuh → 'BOO-tooh' — to need",
          "dokter → 'DOK-ter' — doctor",
          "sekarang juga → 'right now' — 'juga' here intensifies 'now'",
        ],
      },
    ],
    cultural_notes_vi:
      "Số điện thoại cấp cứu chung ở Indonesia là 112 (miễn phí, cả nước). Xe cứu thương riêng có thể gọi 118 hoặc 119. Tại bệnh viện, khu cấp cứu ghi là 'IGD' (Instalasi Gawat Darurat) — luôn tìm bảng chữ này. Lưu ý: 'gawat darurat' được dùng cả trên biển báo lẫn lời nói.",
    cultural_notes_en:
      "Indonesia's general emergency number is 112 (free, nationwide). Ambulances may also be reached at 118 or 119. In hospitals the emergency department is signposted 'IGD' (Instalasi Gawat Darurat) — look for those letters. Note that 'gawat darurat' appears on both signage and in speech.",
    tip_advice_vi:
      "Mẹo cho người Việt: tiếng Indonesia KHÔNG chia động từ và KHÔNG có thời (tense), nên câu cấp cứu rất gọn — chỉ cần học nguyên mẫu. 'Tolong' là từ vàng: vừa là 'cứu với', vừa là 'làm ơn'. Ghép 'Tolong + việc cần' là xong: Tolong panggil… / Tolong bantu… (giúp).",
    tip_advice_en:
      "Tip for Vietnamese speakers: Indonesian has NO verb conjugation and NO tense, so emergency phrases stay short — learn the bare verb and you're done. 'Tolong' is the magic word: it means both 'help!' and 'please'. Just say 'Tolong + the action': Tolong panggil… (please call), Tolong bantu… (please help).",
    vocabulary: [
      {
        word: "tolong",
        en: "help! / please",
        vi: "cứu với / làm ơn",
        pos: "interjection / verb",
        pronunciation_vi: "TÔ-long",
        pronunciation_en: "TOH-long",
      },
      {
        word: "darurat",
        en: "emergency",
        vi: "khẩn cấp",
        pos: "noun / adjective",
        pronunciation_vi: "da-RU-rat",
        pronunciation_en: "da-ROO-rat",
      },
      {
        word: "ambulans",
        en: "ambulance",
        vi: "xe cứu thương",
        pos: "noun",
        pronunciation_vi: "AM-bu-lans",
        pronunciation_en: "AM-boo-lans",
      },
      {
        word: "dokter",
        en: "doctor",
        vi: "bác sĩ",
        pos: "noun",
        pronunciation_vi: "DOK-ter",
        pronunciation_en: "DOK-ter",
      },
      {
        word: "IGD (gawat darurat)",
        en: "emergency room (ER)",
        vi: "phòng cấp cứu",
        pos: "noun",
        pronunciation_vi: "i-ge-DE / GA-wat da-RU-rat",
        pronunciation_en: "ee-jay-DAY / GAH-wat da-ROO-rat",
      },
      {
        word: "sadar",
        en: "conscious / aware",
        vi: "tỉnh táo",
        pos: "adjective",
        pronunciation_vi: "SA-dar",
        pronunciation_en: "SAH-dar",
      },
      {
        word: "bernapas",
        en: "to breathe",
        vi: "thở",
        pos: "verb",
        pronunciation_vi: "ber-NA-pas",
        pronunciation_en: "ber-NA-pas",
      },
      {
        word: "cepat",
        en: "fast / quick",
        vi: "nhanh",
        pos: "adjective",
        pronunciation_vi: "cheu-PAT",
        pronunciation_en: "che-PAT",
      },
      {
        word: "kecelakaan",
        en: "accident",
        vi: "tai nạn",
        pos: "noun",
        pronunciation_vi: "keu-che-la-KA-an",
        pronunciation_en: "ke-che-la-KAH-an",
      },
    ],
    dialogue: [
      {
        speaker: "Penelepon",
        text: "Halo, ini darurat! Ada kecelakaan motor!",
        vi: "Alô, đây là cấp cứu! Có tai nạn xe máy!",
        en: "Hello, this is an emergency! There's a motorbike accident!",
      },
      {
        speaker: "Operator",
        text: "Di mana lokasinya, Pak?",
        vi: "Vị trí ở đâu, anh?",
        en: "Where is the location, sir?",
      },
      {
        speaker: "Penelepon",
        text: "Di Jalan Sudirman, depan bank. Tolong cepat!",
        vi: "Trên đường Sudirman, trước ngân hàng. Làm ơn nhanh lên!",
        en: "On Sudirman Street, in front of the bank. Please hurry!",
      },
      {
        speaker: "Operator",
        text: "Tenang, Pak. Ambulans segera datang.",
        vi: "Bình tĩnh, anh. Xe cứu thương sẽ đến ngay.",
        en: "Stay calm, sir. The ambulance is coming right away.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ cấp cứu còn thiếu:",
        instruction_en: "Fill in the missing emergency word:",
        items: [
          {
            prompt: "___ panggil ambulans! (Làm ơn)",
            answer: "Tolong",
            options: ["Tolong", "Terima kasih", "Selamat"],
          },
          {
            prompt: "Di mana ruang gawat ___? (cấp)",
            answer: "darurat",
            options: ["darurat", "dingin", "datang"],
          },
          {
            prompt: "Dia tidak ___ dan tidak bernapas. (tỉnh)",
            answer: "sadar",
            options: ["sadar", "sabar", "santai"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ tiếng Indonesia với nghĩa tiếng Việt:",
        instruction_en: "Match each Indonesian word with its Vietnamese meaning:",
        items: [
          { prompt: "dokter", answer: "bác sĩ" },
          { prompt: "ambulans", answer: "xe cứu thương" },
          { prompt: "kecelakaan", answer: "tai nạn" },
          { prompt: "cepat", answer: "nhanh" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Cứu với! Đây là khẩn cấp!", answer: "Tolong! Ini darurat!" },
          { prompt: "Phòng cấp cứu ở đâu?", answer: "Di mana ruang gawat darurat?" },
          { prompt: "Tôi cần bác sĩ ngay.", answer: "Saya butuh dokter sekarang." },
        ],
      },
    ],
  },
  {
    id: "indonesian_hospital_symptoms",
    level: "A2",
    category: "health_emergency",
    title_vi: "Khám bệnh — Mô tả triệu chứng ở bệnh viện",
    title_en: "Seeing a doctor — describing symptoms at the hospital",
    sentences: [
      {
        en: "Saya merasa tidak enak badan.",
        vi: "Tôi thấy người không khỏe.",
        pronunciation_focus: [
          "merasa → meu-RA-sa, 'cảm thấy' (gốc rasa)",
          "tidak enak badan → 'người không khỏe' (enak = dễ chịu, badan = thân thể)",
          "không cần thời quá khứ/hiện tại — chỉ một câu",
        ],
        pronunciation_focus_en: [
          "merasa → 'me-RA-sa' — to feel (root 'rasa')",
          "tidak enak badan → idiom 'body not comfortable' = feeling unwell",
          "no tense needed — one form covers present feeling",
        ],
      },
      {
        en: "Kepala saya sakit dan saya demam.",
        vi: "Tôi đau đầu và bị sốt.",
        pronunciation_focus: [
          "kepala saya → 'đầu của tôi' — sở hữu đặt SAU danh từ (ngược tiếng Việt thì giống!)",
          "sakit → SA-kit, 'đau/ốm'",
          "demam → DE-mam, 'sốt'",
        ],
        pronunciation_focus_en: [
          "kepala saya → 'head my' — the possessor follows the noun (like 'đầu của tôi')",
          "sakit → 'SA-kit' — sick / it hurts",
          "demam → 'DEH-mam' — fever",
        ],
      },
      {
        en: "Sudah berapa hari Anda sakit?",
        vi: "Anh/chị bị bệnh bao nhiêu ngày rồi?",
        pronunciation_focus: [
          "sudah → 'đã/rồi' — đánh dấu việc đã xảy ra (không cần chia động từ)",
          "berapa hari → 'bao nhiêu ngày'",
          "Anda → AN-da, 'anh/chị' lịch sự (trang trọng)",
        ],
        pronunciation_focus_en: [
          "sudah → 'already' — marks completed/ongoing action (no conjugation needed)",
          "berapa hari → 'how many days'",
          "Anda → 'AN-da' — formal/polite 'you'",
        ],
      },
      {
        en: "Saya alergi terhadap obat penisilin.",
        vi: "Tôi dị ứng với thuốc penicillin.",
        pronunciation_focus: [
          "alergi → a-LER-gi, 'dị ứng'",
          "terhadap → 'đối với/với'",
          "obat → Ô-bat, 'thuốc' — từ quan trọng nhất ở hiệu thuốc",
        ],
        pronunciation_focus_en: [
          "alergi → 'a-LER-gee' — allergic / allergy ('g' is hard, as in 'go')",
          "terhadap → 'toward/to' — links to the thing you react to",
          "obat → 'OH-bat' — medicine; the key pharmacy word",
        ],
      },
      {
        en: "Apakah saya perlu dirawat di rumah sakit?",
        vi: "Tôi có cần nhập viện không?",
        pronunciation_focus: [
          "apakah → đánh dấu câu hỏi có/không, đặt ở đầu câu",
          "dirawat → 'được chăm sóc/điều trị' — tiền tố di- = bị động",
          "rumah sakit → 'nhà bệnh' = bệnh viện (rumah = nhà, sakit = bệnh)",
        ],
        pronunciation_focus_en: [
          "apakah → fronted yes/no question marker (optional but polite)",
          "dirawat → 'to be treated/cared for' — prefix 'di-' makes it passive",
          "rumah sakit → literally 'sick house' = hospital",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở bệnh viện Indonesia, bác sĩ thường được gọi 'Dokter' + tên. Khi mô tả triệu chứng, công thức đơn giản: '[bộ phận] saya sakit' (… của tôi đau). 'Sakit' vừa nghĩa 'đau' vừa nghĩa 'ốm' — rất linh hoạt. Người Indonesia hay nói giảm: 'kurang enak badan' (người hơi khó chịu) thay vì kêu đau to.",
    cultural_notes_en:
      "In Indonesian hospitals a doctor is addressed 'Dokter' + name. To describe symptoms use the simple frame '[body part] saya sakit' (my … hurts). 'Sakit' means both 'hurts' and 'sick' — very flexible. Indonesians often understate: 'kurang enak badan' (a bit unwell) rather than dramatizing pain.",
    tip_advice_vi:
      "Mẹo cho người Việt: sở hữu trong tiếng Indonesia đặt SAU danh từ — 'kepala saya' = đầu của tôi, giống cấu trúc 'của tôi' nên dễ nhớ. Học một khung duy nhất: '… saya sakit'. Đổi bộ phận: perut (bụng), gigi (răng), tenggorokan (họng), dada (ngực).",
    tip_advice_en:
      "Tip for Vietnamese speakers: the possessor goes AFTER the noun — 'kepala saya' (head my) maps neatly onto Vietnamese 'đầu của tôi'. Memorize one frame: '… saya sakit' and swap the body part: perut (stomach), gigi (tooth), tenggorokan (throat), dada (chest).",
    vocabulary: [
      {
        word: "sakit",
        en: "sick / it hurts",
        vi: "ốm / đau",
        pos: "adjective / verb",
        pronunciation_vi: "SA-kit",
        pronunciation_en: "SA-kit",
      },
      {
        word: "demam",
        en: "fever",
        vi: "sốt",
        pos: "noun / verb",
        pronunciation_vi: "DE-mam",
        pronunciation_en: "DEH-mam",
      },
      {
        word: "batuk",
        en: "cough",
        vi: "ho",
        pos: "noun / verb",
        pronunciation_vi: "BA-tuk",
        pronunciation_en: "BA-took",
      },
      {
        word: "pusing",
        en: "dizzy / headache",
        vi: "chóng mặt / nhức đầu",
        pos: "adjective",
        pronunciation_vi: "PU-sing",
        pronunciation_en: "POO-sing",
      },
      {
        word: "perut",
        en: "stomach / belly",
        vi: "bụng",
        pos: "noun",
        pronunciation_vi: "peu-RUT",
        pronunciation_en: "pe-ROOT",
      },
      {
        word: "alergi",
        en: "allergy / allergic",
        vi: "dị ứng",
        pos: "noun / adjective",
        pronunciation_vi: "a-LER-gi",
        pronunciation_en: "a-LER-gee",
      },
      {
        word: "rumah sakit",
        en: "hospital",
        vi: "bệnh viện",
        pos: "noun",
        pronunciation_vi: "RU-mah SA-kit",
        pronunciation_en: "ROO-mah SA-kit",
      },
      {
        word: "dirawat",
        en: "to be hospitalized / treated",
        vi: "nhập viện / được điều trị",
        pos: "verb (passive)",
        pronunciation_vi: "di-RA-wat",
        pronunciation_en: "dee-RA-wat",
      },
      {
        word: "gejala",
        en: "symptom",
        vi: "triệu chứng",
        pos: "noun",
        pronunciation_vi: "geu-JA-la",
        pronunciation_en: "ge-JA-la",
      },
    ],
    dialogue: [
      {
        speaker: "Dokter",
        text: "Selamat siang. Apa keluhan Anda?",
        vi: "Chào buổi trưa. Anh/chị bị làm sao?",
        en: "Good afternoon. What is your complaint?",
      },
      {
        speaker: "Pasien",
        text: "Saya demam dan kepala saya sakit sejak kemarin.",
        vi: "Tôi bị sốt và đau đầu từ hôm qua.",
        en: "I have a fever and my head hurts since yesterday.",
      },
      {
        speaker: "Dokter",
        text: "Apakah Anda batuk juga?",
        vi: "Anh/chị có ho không?",
        en: "Are you coughing as well?",
      },
      {
        speaker: "Pasien",
        text: "Ya, sedikit. Saya juga merasa pusing.",
        vi: "Vâng, một chút. Tôi cũng thấy chóng mặt.",
        en: "Yes, a little. I also feel dizzy.",
      },
      {
        speaker: "Dokter",
        text: "Baik. Anda perlu istirahat dan minum obat ini.",
        vi: "Được rồi. Anh/chị cần nghỉ ngơi và uống thuốc này.",
        en: "Alright. You need rest and to take this medicine.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ triệu chứng đúng:",
        instruction_en: "Fill in the correct symptom word:",
        items: [
          {
            prompt: "Kepala saya ___. (đau)",
            answer: "sakit",
            options: ["sakit", "senang", "selamat"],
          },
          {
            prompt: "Saya ___, suhu badan tinggi. (sốt)",
            answer: "demam",
            options: ["demam", "diam", "datang"],
          },
          {
            prompt: "Saya ___ terhadap penisilin. (dị ứng)",
            answer: "alergi",
            options: ["alergi", "antri", "akhir"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối bộ phận / triệu chứng với nghĩa tiếng Việt:",
        instruction_en: "Match each body part / symptom with its meaning:",
        items: [
          { prompt: "perut", answer: "bụng" },
          { prompt: "batuk", answer: "ho" },
          { prompt: "pusing", answer: "chóng mặt" },
          { prompt: "gejala", answer: "triệu chứng" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi thấy người không khỏe.", answer: "Saya merasa tidak enak badan." },
          { prompt: "Tôi đau đầu và bị sốt.", answer: "Kepala saya sakit dan saya demam." },
          { prompt: "Tôi có cần nhập viện không?", answer: "Apakah saya perlu dirawat di rumah sakit?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_pharmacy_bpjs",
    level: "A2",
    category: "health_emergency",
    title_vi: "Hiệu thuốc và bảo hiểm BPJS",
    title_en: "The pharmacy and BPJS insurance",
    sentences: [
      {
        en: "Apakah ada apotek di dekat sini?",
        vi: "Có hiệu thuốc gần đây không?",
        pronunciation_focus: [
          "apotek → a-pô-TÉK, 'hiệu thuốc'",
          "di dekat sini → 'gần đây' (dekat = gần, sini = đây)",
          "ada → A-da, 'có' — động từ tồn tại, dùng rất nhiều",
        ],
        pronunciation_focus_en: [
          "apotek → 'a-poh-TEK' — pharmacy/drugstore",
          "di dekat sini → 'nearby here' (dekat = near, sini = here)",
          "ada → 'A-da' — 'there is/are'; the high-frequency existence verb",
        ],
      },
      {
        en: "Saya mau menebus resep ini.",
        vi: "Tôi muốn lấy thuốc theo đơn này.",
        pronunciation_focus: [
          "mau → 'muốn' — chỉ một từ, không chia",
          "menebus → meu-neu-BUS, 'mua lại/lấy (đơn thuốc)' (gốc tebus)",
          "resep → RE-sep, 'đơn thuốc' (cũng nghĩa 'công thức nấu ăn')",
        ],
        pronunciation_focus_en: [
          "mau → 'mow' (rhymes with 'cow') — 'want', never conjugated",
          "menebus → 'me-ne-BOOS' — to redeem/fill (a prescription)",
          "resep → 'REH-sep' — prescription (also means a cooking recipe)",
        ],
      },
      {
        en: "Obat ini diminum tiga kali sehari setelah makan.",
        vi: "Thuốc này uống ba lần một ngày sau khi ăn.",
        pronunciation_focus: [
          "diminum → 'được uống' — tiền tố di- (bị động) + gốc minum (uống)",
          "tiga kali sehari → 'ba lần một ngày' (kali = lần, se- = một)",
          "setelah makan → 'sau khi ăn'",
        ],
        pronunciation_focus_en: [
          "diminum → 'to be taken/drunk' — passive 'di-' + root 'minum' (drink)",
          "tiga kali sehari → 'three times a day' (kali = times, se- = one/per)",
          "setelah makan → 'after eating'",
        ],
      },
      {
        en: "Saya pakai BPJS Kesehatan. Apakah obat ini ditanggung?",
        vi: "Tôi dùng BPJS Y tế. Thuốc này có được chi trả không?",
        pronunciation_focus: [
          "BPJS → đọc 'be-pe-je-és', bảo hiểm y tế quốc gia Indonesia",
          "Kesehatan → keu-se-HA-tan, 'sức khỏe' (gốc sehat + ke-...-an)",
          "ditanggung → 'được chi trả/bảo lãnh' — di- bị động + gốc tanggung",
        ],
        pronunciation_focus_en: [
          "BPJS → spell it out 'beh-peh-jeh-ess' — Indonesia's national health insurance",
          "Kesehatan → 'ke-se-HA-tan' — health (root 'sehat' + circumfix 'ke-…-an')",
          "ditanggung → 'to be covered/borne' — passive 'di-' + root 'tanggung'",
        ],
      },
      {
        en: "Berapa harga obat ini tanpa resep?",
        vi: "Thuốc này giá bao nhiêu nếu không cần đơn?",
        pronunciation_focus: [
          "berapa harga → 'giá bao nhiêu' — câu hỏi giá chuẩn",
          "tanpa → TAN-pa, 'không có/thiếu'",
          "tanpa resep → 'không cần đơn' = thuốc không kê đơn",
        ],
        pronunciation_focus_en: [
          "berapa harga → 'how much (is the) price' — the standard price question",
          "tanpa → 'TAN-pa' — without",
          "tanpa resep → 'without prescription' = over-the-counter",
        ],
      },
    ],
    cultural_notes_vi:
      "BPJS Kesehatan là hệ thống bảo hiểm y tế quốc gia bắt buộc của Indonesia. Người nước ngoài làm việc hợp pháp (có KITAS) cũng phải tham gia. Tại 'apotek' (hiệu thuốc), dược sĩ là 'apoteker'. Nhiều thuốc thông thường mua được không cần đơn ('tanpa resep'), nhưng kháng sinh thì cần 'resep dokter'. Luôn mang thẻ BPJS khi đi khám.",
    cultural_notes_en:
      "BPJS Kesehatan is Indonesia's mandatory national health-insurance scheme. Foreigners working legally (with a KITAS permit) must enroll too. At an 'apotek' (pharmacy) the pharmacist is an 'apoteker'. Many common medicines are sold over the counter ('tanpa resep'), but antibiotics require a 'resep dokter' (doctor's prescription). Always carry your BPJS card to appointments.",
    tip_advice_vi:
      "Mẹo cho người Việt: chú ý tiền tố bị động 'di-' trên nhãn thuốc — 'diminum' (được uống), 'dioleskan' (được bôi), 'ditelan' (được nuốt). Hiểu 'di- + gốc' là đọc được hướng dẫn dùng thuốc. Liều lượng dùng số + 'kali sehari' (lần/ngày): 'dua kali sehari' = 2 lần/ngày.",
    tip_advice_en:
      "Tip for Vietnamese speakers: watch for the passive 'di-' prefix on medicine labels — 'diminum' (to be taken), 'dioleskan' (to be applied), 'ditelan' (to be swallowed). Once you parse 'di- + root' you can read dosage instructions. Dosage = number + 'kali sehari' (times a day): 'dua kali sehari' = twice daily.",
    vocabulary: [
      {
        word: "apotek",
        en: "pharmacy / drugstore",
        vi: "hiệu thuốc",
        pos: "noun",
        pronunciation_vi: "a-pô-TÉK",
        pronunciation_en: "a-poh-TEK",
      },
      {
        word: "obat",
        en: "medicine",
        vi: "thuốc",
        pos: "noun",
        pronunciation_vi: "Ô-bat",
        pronunciation_en: "OH-bat",
      },
      {
        word: "resep",
        en: "prescription (also recipe)",
        vi: "đơn thuốc",
        pos: "noun",
        pronunciation_vi: "RE-sep",
        pronunciation_en: "REH-sep",
      },
      {
        word: "apoteker",
        en: "pharmacist",
        vi: "dược sĩ",
        pos: "noun",
        pronunciation_vi: "a-pô-TE-ker",
        pronunciation_en: "a-poh-TEH-ker",
      },
      {
        word: "BPJS Kesehatan",
        en: "national health insurance",
        vi: "bảo hiểm y tế quốc gia",
        pos: "noun (proper)",
        pronunciation_vi: "be-pe-je-és keu-se-HA-tan",
        pronunciation_en: "beh-peh-jeh-ess ke-se-HA-tan",
      },
      {
        word: "ditanggung",
        en: "to be covered (by insurance)",
        vi: "được chi trả",
        pos: "verb (passive)",
        pronunciation_vi: "di-tang-GUNG",
        pronunciation_en: "dee-tang-GOONG",
      },
      {
        word: "minum",
        en: "to drink / take (medicine)",
        vi: "uống",
        pos: "verb",
        pronunciation_vi: "MI-num",
        pronunciation_en: "MEE-noom",
      },
      {
        word: "tanpa",
        en: "without",
        vi: "không có",
        pos: "preposition",
        pronunciation_vi: "TAN-pa",
        pronunciation_en: "TAN-pa",
      },
      {
        word: "harga",
        en: "price",
        vi: "giá",
        pos: "noun",
        pronunciation_vi: "HAR-ga",
        pronunciation_en: "HAR-ga",
      },
    ],
    dialogue: [
      {
        speaker: "Pasien",
        text: "Selamat sore. Saya mau menebus resep ini.",
        vi: "Chào buổi chiều. Tôi muốn lấy thuốc theo đơn này.",
        en: "Good evening. I'd like to fill this prescription.",
      },
      {
        speaker: "Apoteker",
        text: "Baik. Anda pakai BPJS atau bayar sendiri?",
        vi: "Được. Anh/chị dùng BPJS hay tự trả?",
        en: "Sure. Are you using BPJS or paying yourself?",
      },
      {
        speaker: "Pasien",
        text: "Pakai BPJS. Apakah obat ini ditanggung?",
        vi: "Dùng BPJS. Thuốc này có được chi trả không?",
        en: "BPJS. Is this medicine covered?",
      },
      {
        speaker: "Apoteker",
        text: "Ya, ditanggung. Diminum tiga kali sehari setelah makan.",
        vi: "Vâng, được chi trả. Uống ba lần một ngày sau khi ăn.",
        en: "Yes, it's covered. Take it three times a day after meals.",
      },
      {
        speaker: "Pasien",
        text: "Terima kasih banyak.",
        vi: "Cảm ơn nhiều.",
        en: "Thank you very much.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu ở hiệu thuốc:",
        instruction_en: "Fill in the missing pharmacy word:",
        items: [
          {
            prompt: "Saya mau menebus ___ ini. (đơn thuốc)",
            answer: "resep",
            options: ["resep", "rumah", "ruang"],
          },
          {
            prompt: "Obat ini ___ tiga kali sehari. (được uống)",
            answer: "diminum",
            options: ["diminum", "dimasak", "dibeli"],
          },
          {
            prompt: "Apakah obat ini ___ BPJS? (được chi trả)",
            answer: "ditanggung",
            options: ["ditanggung", "ditutup", "ditolak"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "apotek", answer: "hiệu thuốc" },
          { prompt: "apoteker", answer: "dược sĩ" },
          { prompt: "harga", answer: "giá" },
          { prompt: "tanpa", answer: "không có" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Có hiệu thuốc gần đây không?", answer: "Apakah ada apotek di dekat sini?" },
          { prompt: "Tôi muốn lấy thuốc theo đơn này.", answer: "Saya mau menebus resep ini." },
          { prompt: "Thuốc này giá bao nhiêu?", answer: "Berapa harga obat ini?" },
        ],
      },
    ],
  },
];

export default healthcareEmergencyLessons;
