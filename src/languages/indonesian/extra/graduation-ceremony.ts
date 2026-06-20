// src/languages/indonesian/extra/graduation-ceremony.ts
//
// Graduation Ceremony pack for Vietnamese learners of Indonesian.
// The full university-finishing journey and its vocabulary: skripsi (thesis),
// sidang (the thesis defense), wisuda (the graduation ceremony), toga (cap &
// gown), ijazah & transkrip (diploma & transcript), and the celebration after.
//
// Vietnamese-first: every line carries a `vi` gloss; `pronunciation_focus`
// holds the Vietnamese-facing pronunciation/grammar note (incl. the predictable
// Vietnamese-speaker mistake = L1 note), and `pronunciation_focus_en` is the
// English-speaker companion (same order). Many academic terms are Dutch/Latin
// borrowings (skripsi, transkrip, toga) — recognisable but pronounced
// Indonesian-style; the notes flag those.
//
// Self-contained inline types (mirrors the sibling extra packs); swap for a
// shared import when src/languages/indonesian/lessons.ts lands.

export type LessonSentence = {
  en: string; // Indonesian target line
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type VocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

export type Exercise = Record<string, any>;

export type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type IndonesianLesson = {
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
  // ──────────────────────────────────────────────────────────────────────
  // 1. Skripsi — the undergraduate thesis
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_grad_skripsi",
    level: "B1",
    category: "education",
    title_vi: "Skripsi — luận văn tốt nghiệp đại học",
    title_en: "Skripsi — the undergraduate thesis",
    sentences: [
      {
        en: "Saya sedang mengerjakan skripsi tentang ekonomi digital.",
        vi: "Tôi đang làm luận văn về kinh tế số.",
        pronunciation_focus: [
          "skripsi → SKRIP-si = luận văn đại học (gốc Hà Lan 'scriptie')",
          "mengerjakan → me-nger-JA-kan = làm, thực hiện (meN- + kerja + -kan); 'nge' giữa",
          "tentang → ten-TANG = về (chủ đề); 'ng' cuối",
          "sedang → se-DANG = đang (dấu hiệu tiếp diễn)",
        ],
        pronunciation_focus_en: [
          "skripsi → 'SKRIP-see' = undergrad thesis (from Dutch 'scriptie')",
          "mengerjakan → 'muh-nger-JAH-kan' = to work on (meN- + kerja + -kan); medial 'nge'",
          "tentang → 'ten-TANG' = about (a topic); final 'ng'",
          "sedang → 'suh-DANG' = the present-continuous marker",
        ],
      },
      {
        en: "Dosen pembimbing saya sangat membantu.",
        vi: "Giảng viên hướng dẫn của tôi rất giúp đỡ.",
        pronunciation_focus: [
          "dosen → DO-sen = giảng viên đại học",
          "pembimbing → pem-BIM-bing = người hướng dẫn (pe- + bimbing); 'ng' cuối",
          "dosen pembimbing → giảng viên hướng dẫn (cố vấn luận văn)",
          "membantu → mem-BAN-tu = giúp đỡ",
        ],
        pronunciation_focus_en: [
          "dosen → 'DOH-sen' = university lecturer",
          "pembimbing → 'pem-BIM-bing' = supervisor/guide (pe- + bimbing); final 'ng'",
          "dosen pembimbing → thesis supervisor/advisor",
          "membantu → 'mem-BAN-too' = to help",
        ],
      },
      {
        en: "Saya harus mengumpulkan data dan menulis bab demi bab.",
        vi: "Tôi phải thu thập dữ liệu và viết từng chương một.",
        pronunciation_focus: [
          "mengumpulkan → me-ngum-PUL-kan = thu thập (meN- + kumpul + -kan); 'ngum'",
          "data → DA-ta = dữ liệu",
          "menulis → me-NU-lis = viết (meN- + tulis)",
          "bab demi bab → BAB de-mi BAB = từng chương một",
        ],
        pronunciation_focus_en: [
          "mengumpulkan → 'muh-ngoom-POOL-kan' = to collect (meN- + kumpul + -kan)",
          "data → 'DAH-tah' = data",
          "menulis → 'muh-NOO-lis' = to write (meN- + tulis)",
          "bab demi bab → 'BAB duh-mee BAB' = chapter by chapter",
        ],
      },
    ],
    cultural_notes_vi:
      "'Skripsi' là luận văn tốt nghiệp bậc cử nhân (S1) ở Indonesia — bắt buộc ở hầu hết các ngành, là rào cản lớn cuối cùng trước khi ra trường. (Luận văn thạc sĩ gọi là 'tesis', tiến sĩ là 'disertasi'.) Sinh viên có một 'dosen pembimbing' (giảng viên hướng dẫn) theo sát. Cụm 'mahasiswa tingkat akhir' (sinh viên năm cuối) và câu hỏi 'Skripsimu sampai bab berapa?' (Luận văn cậu tới chương mấy rồi?) là chủ đề căng thẳng quen thuộc — sinh viên Indonesia hay than 'di-PHP-in dosen' (bị giảng viên hẹn lần lữa). Nhiều từ học thuật là từ mượn Hà Lan (skripsi, dosen) hoặc Latin (data) — người Việt nhận ra dễ. Khái niệm rất giống 'khóa luận tốt nghiệp' của Việt Nam.",
    cultural_notes_en:
      "'Skripsi' is the bachelor's (S1) graduation thesis in Indonesia — required in most majors and the final big hurdle before graduating. (A master's thesis is 'tesis', a doctoral one 'disertasi'.) Students have a 'dosen pembimbing' (thesis supervisor) guiding them. The phrase 'mahasiswa tingkat akhir' (final-year student) and the question 'Skripsimu sampai bab berapa?' (Which chapter is your thesis on?) are familiar stress points — students joke about being 'di-PHP-in dosen' (kept waiting by a supervisor). Many academic words are Dutch borrowings (skripsi, dosen) or Latin (data) — easy for Vietnamese to recognise. The concept closely matches Vietnam's 'khóa luận tốt nghiệp'.",
    tip_advice_vi:
      "Phân biệt ba bậc: skripsi (cử nhân) < tesis (thạc sĩ) < disertasi (tiến sĩ). 'dosen' = giảng viên (khác 'guru' = giáo viên phổ thông). Động từ học thuật đầy tiền tố meN-: mengerjakan, mengumpulkan, menulis — 'nge/ngum' dễ với người Việt. 'tentang' = về (chủ đề).",
    tip_advice_en:
      "Three levels: skripsi (bachelor's) < tesis (master's) < disertasi (doctorate). 'dosen' = lecturer (vs 'guru' = school teacher). Academic verbs are full of the meN- prefix: mengerjakan, mengumpulkan, menulis — easy for Vietnamese. 'tentang' = about (a topic).",
    vocabulary: [
      { word: "skripsi", en: "undergraduate thesis", vi: "luận văn cử nhân", pos: "noun", pronunciation_vi: "SKRIP-si", pronunciation_en: "SKRIP-see" },
      { word: "dosen", en: "university lecturer", vi: "giảng viên", pos: "noun", pronunciation_vi: "DO-sen", pronunciation_en: "DOH-sen" },
      { word: "dosen pembimbing", en: "thesis supervisor", vi: "giảng viên hướng dẫn", pos: "noun phrase", pronunciation_vi: "DO-sen pem-BIM-bing", pronunciation_en: "DOH-sen pem-BIM-bing" },
      { word: "bab", en: "chapter", vi: "chương", pos: "noun", pronunciation_vi: "BAB", pronunciation_en: "BAB" },
      { word: "mahasiswa", en: "university student", vi: "sinh viên", pos: "noun", pronunciation_vi: "ma-ha-SIS-wa", pronunciation_en: "mah-hah-SIS-wah" },
      { word: "penelitian", en: "research", vi: "nghiên cứu", pos: "noun", pronunciation_vi: "pe-ne-li-TI-an", pronunciation_en: "puh-nuh-lee-TEE-an" },
    ],
    dialogue: [
      { speaker: "Tina", text: "Skripsimu udah sampai bab berapa?", vi: "Luận văn cậu tới chương mấy rồi?", en: "Which chapter is your thesis on now?" },
      { speaker: "Joko", text: "Baru bab tiga. Lagi nunggu revisi dari dosen pembimbing.", vi: "Mới chương ba. Đang đợi chỉnh sửa từ giảng viên hướng dẫn.", en: "Only chapter three. Waiting for revisions from my supervisor." },
      { speaker: "Tina", text: "Semangat ya! Sebentar lagi sidang.", vi: "Cố lên nhé! Sắp bảo vệ rồi đấy.", en: "Hang in there! The defense is coming soon." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        instruction_en: "Match the word to its meaning:",
        items: [
          { prompt: "skripsi", answer: "luận văn cử nhân" },
          { prompt: "dosen", answer: "giảng viên" },
          { prompt: "bab", answer: "chương" },
          { prompt: "mahasiswa", answer: "sinh viên" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 2. Sidang — the thesis defense
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_grad_sidang",
    level: "B1",
    category: "education",
    title_vi: "Sidang — buổi bảo vệ luận văn",
    title_en: "Sidang — the thesis defense",
    sentences: [
      {
        en: "Besok saya sidang skripsi di depan tiga penguji.",
        vi: "Mai tôi bảo vệ luận văn trước ba giám khảo.",
        pronunciation_focus: [
          "sidang → SI-dang = buổi bảo vệ/phiên họp; 'ng' cuối",
          "di depan → di de-PAN = trước mặt, trước",
          "penguji → pe-NGU-ji = giám khảo (pe- + uji); 'ngu' giữa từ",
          "tiga → TI-ga = ba (số 3)",
        ],
        pronunciation_focus_en: [
          "sidang → 'SEE-dang' = the defense/session; final 'ng'",
          "di depan → 'dee duh-PAN' = in front of",
          "penguji → 'puh-NGOO-jee' = examiner (pe- + uji); medial 'ngu'",
          "tiga → 'TEE-gah' = three",
        ],
      },
      {
        en: "Saya gugup, tapi sudah berlatih presentasi berkali-kali.",
        vi: "Tôi hồi hộp, nhưng đã luyện thuyết trình nhiều lần.",
        pronunciation_focus: [
          "gugup → GU-gup = hồi hộp, run",
          "berlatih → ber-LA-tih = luyện tập (ber- + latih)",
          "presentasi → pre-sen-TA-si = bài thuyết trình (mượn tiếng Anh)",
          "berkali-kali → ber-KA-li KA-li = nhiều lần (từ lặp)",
        ],
        pronunciation_focus_en: [
          "gugup → 'GOO-goop' = nervous",
          "berlatih → 'ber-LAH-tee' = to practise (ber- + latih)",
          "presentasi → 'preh-sen-TAH-see' = presentation",
          "berkali-kali → 'ber-KAH-lee KAH-lee' = many times (reduplication)",
        ],
      },
      {
        en: "Akhirnya saya lulus sidang dengan nilai memuaskan!",
        vi: "Cuối cùng tôi đã đậu buổi bảo vệ với điểm tốt!",
        pronunciation_focus: [
          "lulus → LU-lus = đậu, đỗ, qua",
          "nilai → NI-lai = điểm số",
          "memuaskan → me-mu-AS-kan = đạt yêu cầu, hài lòng (meN- + puas + -kan)",
          "akhirnya → a-KHIR-nya = cuối cùng; 'kh' khạc nhẹ, 'ny'='nh'",
        ],
        pronunciation_focus_en: [
          "lulus → 'LOO-loos' = to pass",
          "nilai → 'NEE-lai' = grade/score",
          "memuaskan → 'muh-moo-AS-kan' = satisfactory (meN- + puas + -kan)",
          "akhirnya → 'ah-KHEER-nyah' = finally; 'kh' light guttural, 'ny'=ñ",
        ],
      },
    ],
    cultural_notes_vi:
      "'Sidang' (đầy đủ: 'sidang skripsi' hay 'sidang akhir') là buổi bảo vệ luận văn miệng trước hội đồng 'penguji' (giám khảo) — thường 2-3 người. Sinh viên 'presentasi' (thuyết trình) rồi trả lời câu hỏi phản biện. Đây là khoảnh khắc cực căng thẳng; ai 'lulus sidang' (đậu bảo vệ) thì gần như chắc chắn tốt nghiệp. Có truyền thống mặc trang phục trang trọng (áo sơ mi trắng, quần/váy đen) và bạn bè chờ ngoài cửa để chúc mừng, đôi khi 'siram air/telur' (té nước/đập trứng ăn mừng) — phong tục vui sau khi đậu. Người Việt sẽ thấy quen với 'bảo vệ khóa luận'. Từ 'lulus' (đậu) đối lập 'tidak lulus/gagal' (rớt). 'Sidang' cũng dùng ngoài học thuật, nghĩa 'phiên tòa/phiên họp'.",
    cultural_notes_en:
      "'Sidang' (full: 'sidang skripsi' or 'sidang akhir') is the oral thesis defense before a panel of 'penguji' (examiners) — usually 2–3 people. The student gives a 'presentasi' (presentation) then answers critical questions. It's an intensely stressful moment; passing ('lulus sidang') all but guarantees graduation. Tradition includes formal dress (white shirt, black trousers/skirt) and friends waiting outside to celebrate, sometimes with a playful 'siram air/telur' (water/egg dousing) after passing. Vietnamese learners will recognise their own 'bảo vệ khóa luận'. 'Lulus' (pass) contrasts with 'tidak lulus/gagal' (fail). 'Sidang' is also used non-academically for a 'court session/hearing'.",
    tip_advice_vi:
      "'sidang' = bảo vệ (cũng nghĩa 'phiên tòa' ngoài học thuật). 'penguji' (giám khảo) từ gốc 'uji' (kiểm tra) + pe-. 'lulus' = đậu, 'gagal' = rớt. 'presentasi' mượn tiếng Anh. Câu hữu ích: 'Semoga lancar sidangnya!' (Chúc buổi bảo vệ suôn sẻ!).",
    tip_advice_en:
      "'sidang' = defense (also 'court hearing' outside academia). 'penguji' (examiner) from 'uji' (to test) + pe-. 'lulus' = pass, 'gagal' = fail. 'presentasi' is an English borrowing. Useful line: 'Semoga lancar sidangnya!' (May your defense go smoothly!).",
    vocabulary: [
      { word: "sidang", en: "thesis defense / session", vi: "buổi bảo vệ", pos: "noun", pronunciation_vi: "SI-dang", pronunciation_en: "SEE-dang" },
      { word: "penguji", en: "examiner", vi: "giám khảo", pos: "noun", pronunciation_vi: "pe-NGU-ji", pronunciation_en: "puh-NGOO-jee" },
      { word: "lulus", en: "to pass", vi: "đậu, đỗ", pos: "verb", pronunciation_vi: "LU-lus", pronunciation_en: "LOO-loos" },
      { word: "gugup", en: "nervous", vi: "hồi hộp, run", pos: "adjective", pronunciation_vi: "GU-gup", pronunciation_en: "GOO-goop" },
      { word: "presentasi", en: "presentation", vi: "bài thuyết trình", pos: "noun", pronunciation_vi: "pre-sen-TA-si", pronunciation_en: "preh-sen-TAH-see" },
      { word: "nilai", en: "grade, score", vi: "điểm số", pos: "noun", pronunciation_vi: "NI-lai", pronunciation_en: "NEE-lai" },
    ],
    dialogue: [
      { speaker: "Rani", text: "Gimana sidangmu tadi? Lancar?", vi: "Buổi bảo vệ vừa rồi sao? Suôn sẻ không?", en: "How was your defense earlier? Did it go smoothly?" },
      { speaker: "Doni", text: "Alhamdulillah lulus! Penguji cuma kasih sedikit revisi.", vi: "Ơn trời đậu rồi! Giám khảo chỉ cho ít chỉnh sửa.", en: "Thank God I passed! The examiners gave only minor revisions." },
      { speaker: "Rani", text: "Selamat ya! Sebentar lagi wisuda!", vi: "Chúc mừng! Sắp tốt nghiệp rồi!", en: "Congratulations! Graduation is coming soon!" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu:",
        instruction_en: "Fill in the missing word:",
        items: [
          { prompt: "Saya ___ skripsi di depan penguji. (bảo vệ)", answer: "sidang", options: ["sidang", "wisuda", "skripsi"] },
          { prompt: "Akhirnya saya ___ sidang! (đậu)", answer: "lulus", options: ["lulus", "gagal", "gugup"] },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 3. Wisuda & toga — the ceremony and cap & gown
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_grad_wisuda_toga",
    level: "A2",
    category: "education",
    title_vi: "Wisuda & toga — lễ tốt nghiệp và áo mũ cử nhân",
    title_en: "Wisuda & toga — the ceremony and cap & gown",
    sentences: [
      {
        en: "Minggu depan saya wisuda di gedung universitas.",
        vi: "Tuần sau tôi dự lễ tốt nghiệp ở tòa nhà trường đại học.",
        pronunciation_focus: [
          "wisuda → wi-SU-da = lễ tốt nghiệp",
          "minggu depan → MING-gu de-PAN = tuần sau",
          "gedung → ge-DUNG = tòa nhà; 'ng' cuối",
          "universitas → u-ni-ver-si-TAS = trường đại học",
        ],
        pronunciation_focus_en: [
          "wisuda → 'wee-SOO-dah' = graduation ceremony",
          "minggu depan → 'MING-goo duh-PAN' = next week",
          "gedung → 'guh-DOONG' = building; final 'ng'",
          "universitas → 'oo-nee-ver-see-TAS' = university",
        ],
      },
      {
        en: "Saya memakai toga hitam dan topi wisuda.",
        vi: "Tôi mặc áo choàng cử nhân màu đen và đội mũ tốt nghiệp.",
        pronunciation_focus: [
          "toga → TO-ga = áo choàng cử nhân (gốc Latin)",
          "memakai → me-ma-KAI = mặc, đội (meN- + pakai)",
          "topi → TO-pi = mũ, nón",
          "hitam → HI-tam = màu đen",
        ],
        pronunciation_focus_en: [
          "toga → 'TOH-gah' = academic gown (from Latin)",
          "memakai → 'muh-mah-KAI' = to wear (meN- + pakai)",
          "topi → 'TOH-pee' = hat/cap",
          "hitam → 'HEE-tam' = black",
        ],
      },
      {
        en: "Saat namaku dipanggil, aku memindahkan tali toga.",
        vi: "Khi tên tôi được gọi, tôi chuyển dải tua mũ sang bên.",
        pronunciation_focus: [
          "dipanggil → di-pang-GIL = được gọi (thụ động di- + panggil); 'ngg'",
          "memindahkan → me-min-DAH-kan = chuyển, di dời (meN- + pindah + -kan)",
          "tali → TA-li = dây, dải",
          "tali toga → dải tua trên mũ cử nhân (lễ chuyển tua)",
        ],
        pronunciation_focus_en: [
          "dipanggil → 'dee-pang-GIL' = is called (passive di- + panggil); 'ngg'",
          "memindahkan → 'muh-min-DAH-kan' = to move (meN- + pindah + -kan)",
          "tali → 'TAH-lee' = string/cord/tassel",
          "tali toga → the graduation cap tassel (the moving-the-tassel ritual)",
        ],
      },
    ],
    cultural_notes_vi:
      "'Wisuda' là lễ tốt nghiệp trang trọng — đỉnh cao của hành trình đại học. Sinh viên mặc 'toga' (áo choàng cử nhân, gốc Latin) và đội 'topi toga' (mũ vuông). Nghi thức trung tâm là 'pemindahan tali toga' (lễ chuyển dải tua mũ từ phải sang trái), tượng trưng đã tốt nghiệp. Rektor (hiệu trưởng) trao bằng. Wisuda ở Indonesia là sự kiện gia đình lớn: cả nhà đến dự, tặng hoa và 'boneka wisuda' (gấu bông cầm hoa), chụp ảnh tập thể. Đây là dịp hãnh diện, đặc biệt với gia đình có con đầu tiên tốt nghiệp đại học ('sarjana'). Người Việt sẽ thấy rất quen — lễ tốt nghiệp, áo mũ cử nhân, chụp ảnh gia đình giống hệt. Từ 'toga' và 'wisuda' không có gốc tiếng Anh nên cần học riêng.",
    cultural_notes_en:
      "'Wisuda' is the formal graduation ceremony — the climax of the university journey. Graduates wear a 'toga' (academic gown, from Latin) and 'topi toga' (mortarboard). The central rite is 'pemindahan tali toga' (moving the cap tassel from right to left), symbolising completion. The rektor (rector/president) confers the degree. Wisuda is a big family event in Indonesia: the whole family attends, gives flowers and 'boneka wisuda' (graduation teddy bears with flowers), and takes group photos. It's a proud occasion, especially for families with their first university graduate ('sarjana'). Vietnamese learners will find it very familiar — the ceremony, cap and gown, family photos are the same. 'Toga' and 'wisuda' aren't English-based, so learn them separately.",
    tip_advice_vi:
      "'wisuda' = lễ tốt nghiệp, 'toga' = áo choàng cử nhân, 'sarjana' = cử nhân (người tốt nghiệp). Nghi thức: 'memindahkan tali toga' (chuyển tua mũ). Thụ động di-: dipanggil (được gọi). 'memakai' (mặc/đội) cho cả áo lẫn mũ. Câu chúc: 'Selamat wisuda!' (Chúc mừng tốt nghiệp!).",
    tip_advice_en:
      "'wisuda' = graduation ceremony, 'toga' = gown, 'sarjana' = graduate/bachelor. The rite: 'memindahkan tali toga' (move the tassel). Passive di-: dipanggil (is called). 'memakai' (to wear) covers both gown and cap. Congratulation: 'Selamat wisuda!'.",
    vocabulary: [
      { word: "wisuda", en: "graduation ceremony", vi: "lễ tốt nghiệp", pos: "noun", pronunciation_vi: "wi-SU-da", pronunciation_en: "wee-SOO-dah" },
      { word: "toga", en: "academic gown", vi: "áo choàng cử nhân", pos: "noun", pronunciation_vi: "TO-ga", pronunciation_en: "TOH-gah" },
      { word: "sarjana", en: "graduate, bachelor's holder", vi: "cử nhân", pos: "noun", pronunciation_vi: "sar-JA-na", pronunciation_en: "sar-JAH-nah" },
      { word: "topi", en: "cap, hat", vi: "mũ, nón", pos: "noun", pronunciation_vi: "TO-pi", pronunciation_en: "TOH-pee" },
      { word: "universitas", en: "university", vi: "trường đại học", pos: "noun", pronunciation_vi: "u-ni-ver-si-TAS", pronunciation_en: "oo-nee-ver-see-TAS" },
      { word: "rektor", en: "rector, university head", vi: "hiệu trưởng đại học", pos: "noun", pronunciation_vi: "REK-tor", pronunciation_en: "REK-tor" },
    ],
    dialogue: [
      { speaker: "Ibu", text: "Anakku, hari ini kamu resmi jadi sarjana!", vi: "Con của mẹ, hôm nay con chính thức là cử nhân!", en: "My child, today you officially become a graduate!" },
      { speaker: "Sinta", text: "Iya, Bu. Terima kasih sudah mendukung selama ini.", vi: "Vâng mẹ. Cảm ơn mẹ đã ủng hộ suốt thời gian qua.", en: "Yes, Mum. Thank you for supporting me all this time." },
      { speaker: "Ibu", text: "Bangga sekali. Ayo foto bareng pakai toga!", vi: "Mẹ tự hào lắm. Nào chụp ảnh chung với áo cử nhân!", en: "So proud. Let's take a photo together in your gown!" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        instruction_en: "Match the word to its meaning:",
        items: [
          { prompt: "wisuda", answer: "lễ tốt nghiệp" },
          { prompt: "toga", answer: "áo choàng cử nhân" },
          { prompt: "sarjana", answer: "cử nhân" },
          { prompt: "rektor", answer: "hiệu trưởng đại học" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 4. Ijazah & transkrip — diploma and transcript
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_grad_ijazah_transkrip",
    level: "B1",
    category: "education",
    title_vi: "Ijazah & transkrip — bằng tốt nghiệp và bảng điểm",
    title_en: "Ijazah & transkrip — diploma and transcript",
    sentences: [
      {
        en: "Saya sudah menerima ijazah dan transkrip nilai.",
        vi: "Tôi đã nhận bằng tốt nghiệp và bảng điểm.",
        pronunciation_focus: [
          "ijazah → i-JA-zah = bằng tốt nghiệp; 'j' tiếng Anh, 'z' rõ",
          "menerima → me-ne-RI-ma = nhận (meN- + terima)",
          "transkrip → trans-KRIP = bảng điểm (mượn tiếng Anh)",
          "nilai → NI-lai = điểm",
        ],
        pronunciation_focus_en: [
          "ijazah → 'ee-JAH-zah' = diploma/certificate; English 'j', clear 'z'",
          "menerima → 'muh-nuh-REE-mah' = to receive (meN- + terima)",
          "transkrip → 'trans-KRIP' = transcript (English borrowing)",
          "nilai → 'NEE-lai' = grade",
        ],
      },
      {
        en: "Untuk melamar kerja, saya butuh fotokopi ijazah yang dilegalisir.",
        vi: "Để xin việc, tôi cần bản photo bằng đã được công chứng.",
        pronunciation_focus: [
          "melamar → me-LA-mar = nộp đơn, xin (việc); (meN- + lamar)",
          "butuh → BU-tuh = cần",
          "fotokopi → fo-to-KO-pi = bản photo, bản sao",
          "dilegalisir → di-le-ga-li-SIR = được công chứng (thụ động di-)",
        ],
        pronunciation_focus_en: [
          "melamar → 'muh-LAH-mar' = to apply (for a job) (meN- + lamar)",
          "butuh → 'BOO-tooh' = to need",
          "fotokopi → 'foh-toh-KOH-pee' = photocopy",
          "dilegalisir → 'dee-luh-gah-lee-SEER' = is legalised/certified (passive di-)",
        ],
      },
      {
        en: "IPK saya 3,5 dari skala 4,0.",
        vi: "Điểm trung bình của tôi là 3,5 trên thang 4,0.",
        pronunciation_focus: [
          "IPK → i-pe-KA = điểm trung bình tích lũy (Indeks Prestasi Kumulatif)",
          "skala → SKA-la = thang (điểm)",
          "lưu ý: dùng DẤU PHẨY cho số thập phân (3,5 không phải 3.5)",
          "dari → DA-ri = trên, từ (ở đây: trên thang)",
        ],
        pronunciation_focus_en: [
          "IPK → 'ee-peh-KAH' = cumulative GPA (Indeks Prestasi Kumulatif)",
          "skala → 'SKAH-lah' = scale",
          "note: Indonesian uses a COMMA for decimals (3,5 not 3.5)",
          "dari → 'DAH-ree' = out of/from (here: out of the scale)",
        ],
      },
    ],
    cultural_notes_vi:
      "'Ijazah' (bằng tốt nghiệp) và 'transkrip nilai' (bảng điểm) là hai giấy tờ quan trọng nhất sau khi ra trường — cần cho mọi đơn xin việc ('melamar kerja'). Điểm trung bình gọi là 'IPK' (Indeks Prestasi Kumulatif), thang 4,0 giống hệ Mỹ; 'IPK cumlaude' (≥3,5) là danh hiệu danh dự. LƯU Ý QUAN TRỌNG cho người Việt: tiếng Indonesia dùng DẤU PHẨY cho số thập phân (3,5) và DẤU CHẤM cho hàng nghìn (1.000) — NGƯỢC với tiếng Anh, nhưng GIỐNG tiếng Việt! Khi xin việc thường cần 'ijazah yang dilegalisir' (bằng đã công chứng) và bản 'fotokopi'. Nhiều từ mượn: transkrip, fotokopi, legalisir (từ Hà Lan). Khái niệm giống Việt Nam: bằng đại học + bảng điểm + công chứng.",
    cultural_notes_en:
      "'Ijazah' (diploma) and 'transkrip nilai' (transcript) are the two most important documents after graduating — needed for every job application ('melamar kerja'). The GPA is 'IPK' (Indeks Prestasi Kumulatif) on a 4.0 scale like the US; 'IPK cumlaude' (≥3.5) is an honours distinction. IMPORTANT for Vietnamese learners: Indonesian uses a COMMA for decimals (3,5) and a PERIOD for thousands (1.000) — OPPOSITE to English but the SAME as Vietnamese! Job applications often need 'ijazah yang dilegalisir' (a certified diploma) and a 'fotokopi'. Many borrowings: transkrip, fotokopi, legalisir (from Dutch). The concept matches Vietnam: degree + transcript + notarisation.",
    tip_advice_vi:
      "'ijazah' = bằng, 'transkrip' = bảng điểm, 'IPK' = điểm trung bình. DẤU PHẨY thập phân (3,5) giống tiếng Việt — đừng dùng dấu chấm kiểu Anh. 'melamar kerja' = xin việc. Thụ động di-: dilegalisir (được công chứng). 'ijazah' có 'z' rõ ràng — phát âm đầy đủ.",
    tip_advice_en:
      "'ijazah' = diploma, 'transkrip' = transcript, 'IPK' = GPA. Decimal COMMA (3,5) like Vietnamese — don't use the English period. 'melamar kerja' = to apply for a job. Passive di-: dilegalisir (is certified). 'ijazah' has a clear 'z' — pronounce it fully.",
    vocabulary: [
      { word: "ijazah", en: "diploma, certificate", vi: "bằng tốt nghiệp", pos: "noun", pronunciation_vi: "i-JA-zah", pronunciation_en: "ee-JAH-zah" },
      { word: "transkrip", en: "transcript", vi: "bảng điểm", pos: "noun", pronunciation_vi: "trans-KRIP", pronunciation_en: "trans-KRIP" },
      { word: "IPK", en: "cumulative GPA", vi: "điểm trung bình tích lũy", pos: "noun", pronunciation_vi: "i-pe-KA", pronunciation_en: "ee-peh-KAH" },
      { word: "melamar kerja", en: "to apply for a job", vi: "xin việc", pos: "verb phrase", pronunciation_vi: "me-LA-mar KER-ja", pronunciation_en: "muh-LAH-mar KER-jah" },
      { word: "fotokopi", en: "photocopy", vi: "bản photo", pos: "noun", pronunciation_vi: "fo-to-KO-pi", pronunciation_en: "foh-toh-KOH-pee" },
      { word: "cumlaude", en: "with honours (GPA ≥3.5)", vi: "loại giỏi/xuất sắc", pos: "noun", pronunciation_vi: "kum-LA-u-de", pronunciation_en: "koom-LAU-deh" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ giấy tờ tốt nghiệp:",
        instruction_en: "Fill the graduation-document word:",
        items: [
          { prompt: "Saya menerima ___ dan transkrip. (bằng)", answer: "ijazah", options: ["ijazah", "toga", "skripsi"] },
          { prompt: "___ saya 3,5. (điểm trung bình)", answer: "IPK", options: ["IPK", "Bab", "Toga"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Để xin việc, tôi cần bằng đã công chứng.", answer: "Untuk melamar kerja, saya butuh ijazah yang dilegalisir." },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 5. Celebration — congratulations & the future
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_grad_perayaan",
    level: "A2",
    category: "education",
    title_vi: "Ăn mừng — lời chúc và tương lai",
    title_en: "Celebration — congratulations & the future",
    sentences: [
      {
        en: "Selamat atas kelulusanmu! Kamu pantas mendapatkannya.",
        vi: "Chúc mừng cậu đã tốt nghiệp! Cậu xứng đáng với điều đó.",
        pronunciation_focus: [
          "selamat atas → se-LA-mat A-tas = chúc mừng vì",
          "kelulusan → ke-lu-LU-san = sự tốt nghiệp (ke- + lulus + -an)",
          "pantas → PAN-tas = xứng đáng",
          "mendapatkannya → men-da-PAT-kan-nya = đạt được điều đó",
        ],
        pronunciation_focus_en: [
          "selamat atas → 'suh-LAH-mat AH-tas' = congratulations on",
          "kelulusan → 'kuh-loo-LOO-san' = graduation/passing (ke- + lulus + -an)",
          "pantas → 'PAN-tas' = deserving/worthy",
          "mendapatkannya → 'men-dah-PAT-kan-nyah' = to attain it",
        ],
      },
      {
        en: "Setelah lulus, saya ingin langsung mencari pekerjaan.",
        vi: "Sau khi tốt nghiệp, tôi muốn tìm việc ngay.",
        pronunciation_focus: [
          "setelah lulus → sau khi đậu/tốt nghiệp",
          "ingin → I-ngin = muốn (trang trọng hơn 'mau'); 'ng' giữa",
          "langsung → LANG-sung = ngay; 'ng' hai lần",
          "mencari pekerjaan → men-CA-ri pe-ker-JA-an = tìm việc làm",
        ],
        pronunciation_focus_en: [
          "setelah lulus → after graduating/passing",
          "ingin → 'EE-ngin' = to want (more formal than 'mau'); medial 'ng'",
          "langsung → 'LANG-soong' = right away; 'ng' twice",
          "mencari pekerjaan → 'men-CHAH-ree puh-ker-JAH-an' = to look for work",
        ],
      },
      {
        en: "Terima kasih kepada orang tua dan dosen yang telah membimbing.",
        vi: "Cảm ơn bố mẹ và thầy cô đã dìu dắt.",
        pronunciation_focus: [
          "terima kasih kepada → cảm ơn đến (trang trọng)",
          "telah → te-LAH = đã (trang trọng hơn 'sudah')",
          "membimbing → mem-BIM-bing = dìu dắt, hướng dẫn (meN- + bimbing)",
          "yang telah membimbing → người đã dìu dắt (mệnh đề quan hệ)",
        ],
        pronunciation_focus_en: [
          "terima kasih kepada → thank you to (formal)",
          "telah → 'tuh-LAH' = have/has (more formal than 'sudah')",
          "membimbing → 'mem-BIM-bing' = to guide/mentor (meN- + bimbing)",
          "yang telah membimbing → who have guided (relative clause)",
        ],
      },
    ],
    cultural_notes_vi:
      "Sau wisuda là tiệc ăn mừng ('syukuran' - lễ tạ ơn, hoặc tiệc gia đình). Lời chúc chuẩn: 'Selamat atas kelulusanmu!' (Chúc mừng cậu tốt nghiệp!) hoặc 'Selamat wisuda!'. Người mới tốt nghiệp là 'fresh graduate' (mượn tiếng Anh, rất thông dụng) bước vào giai đoạn 'mencari kerja' (tìm việc). Trong văn hóa Indonesia, tốt nghiệp là dịp để 'berterima kasih' (tỏ lòng biết ơn) công khai với bố mẹ và thầy cô — bài phát biểu wisuda luôn có phần cảm ơn 'orang tua' (cha mẹ) đã hy sinh. Người Việt rất đồng cảm vì văn hóa hiếu học và biết ơn thầy cô tương đồng. Lưu ý sắc thái trang trọng: 'telah' (đã) trang trọng hơn 'sudah'; 'ingin' (muốn) trang trọng hơn 'mau'; 'kepada' (đến) trang trọng hơn 'ke' — dùng trong lời cảm ơn lễ nghi.",
    cultural_notes_en:
      "After wisuda comes a celebration ('syukuran' - a thanksgiving gathering, or a family party). Standard wishes: 'Selamat atas kelulusanmu!' (Congrats on graduating!) or 'Selamat wisuda!'. A new graduate is a 'fresh graduate' (a very common English borrowing) entering the 'mencari kerja' (job-hunting) phase. In Indonesian culture, graduating is a time to publicly 'berterima kasih' (express gratitude) to parents and teachers — wisuda speeches always thank 'orang tua' (parents) for their sacrifices. Vietnamese learners relate strongly, sharing a culture of valuing education and honouring teachers. Note the formal register: 'telah' (have) is more formal than 'sudah'; 'ingin' (want) more than 'mau'; 'kepada' (to) more than 'ke' — used in ceremonial thanks.",
    tip_advice_vi:
      "Lời chúc: 'Selamat atas kelulusanmu!' / 'Selamat wisuda!'. Sắc thái trang trọng cho lễ nghi: telah (>sudah), ingin (>mau), kepada (>ke). 'fresh graduate' mượn tiếng Anh. Cấu trúc ke-...-an: kelulusan (sự tốt nghiệp), từ 'lulus'. 'langsung' có 'ng' hai lần — đọc rõ.",
    tip_advice_en:
      "Wishes: 'Selamat atas kelulusanmu!' / 'Selamat wisuda!'. Formal register for ceremony: telah (>sudah), ingin (>mau), kepada (>ke). 'fresh graduate' is an English borrowing. The ke-...-an pattern: kelulusan (graduation), from 'lulus'. 'langsung' has two 'ng' — pronounce clearly.",
    vocabulary: [
      { word: "selamat", en: "congratulations", vi: "chúc mừng", pos: "interjection", pronunciation_vi: "se-LA-mat", pronunciation_en: "suh-LAH-mat" },
      { word: "kelulusan", en: "graduation, passing", vi: "sự tốt nghiệp", pos: "noun", pronunciation_vi: "ke-lu-LU-san", pronunciation_en: "kuh-loo-LOO-san" },
      { word: "mencari kerja", en: "to look for work", vi: "tìm việc", pos: "verb phrase", pronunciation_vi: "men-CA-ri KER-ja", pronunciation_en: "men-CHAH-ree KER-jah" },
      { word: "membimbing", en: "to guide, mentor", vi: "dìu dắt, hướng dẫn", pos: "verb", pronunciation_vi: "mem-BIM-bing", pronunciation_en: "mem-BIM-bing" },
      { word: "bangga", en: "proud", vi: "tự hào", pos: "adjective", pronunciation_vi: "BANG-ga", pronunciation_en: "BANG-gah" },
      { word: "masa depan", en: "the future", vi: "tương lai", pos: "noun phrase", pronunciation_vi: "MA-sa de-PAN", pronunciation_en: "MAH-sah duh-PAN" },
    ],
    dialogue: [
      { speaker: "Teman", text: "Selamat atas kelulusanmu! Rencana selanjutnya apa?", vi: "Chúc mừng cậu tốt nghiệp! Kế hoạch tiếp theo là gì?", en: "Congrats on graduating! What's your next plan?" },
      { speaker: "Wira", text: "Makasih! Aku mau langsung mencari kerja.", vi: "Cảm ơn! Tớ muốn tìm việc ngay.", en: "Thanks! I want to start job-hunting right away." },
      { speaker: "Teman", text: "Semoga cepat dapat ya. Masa depanmu cerah!", vi: "Mong cậu sớm có việc. Tương lai cậu tươi sáng!", en: "Hope you find one soon. Your future is bright!" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Chúc mừng cậu đã tốt nghiệp!", answer: "Selamat atas kelulusanmu!" },
          { prompt: "Sau khi tốt nghiệp, tôi muốn tìm việc ngay.", answer: "Setelah lulus, saya ingin langsung mencari pekerjaan." },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        instruction_en: "Match the word to its meaning:",
        items: [
          { prompt: "kelulusan", answer: "sự tốt nghiệp" },
          { prompt: "mencari kerja", answer: "tìm việc" },
          { prompt: "bangga", answer: "tự hào" },
          { prompt: "masa depan", answer: "tương lai" },
        ],
      },
    ],
  },
];

export default lessons;
