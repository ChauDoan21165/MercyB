// University thesis defense Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// academic-defense notes with English companions in pronunciation_focus_en.

export type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
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
    id: "indonesian_university_thesis_defense",
    level: "B2",
    category: "academic_communication",
    title_vi: "Bảo vệ luận văn đại học",
    title_en: "University thesis defense",
    sentences: [
      {
        en: "Sidang skripsi saya akan dimulai pukul sembilan pagi.",
        vi: "Buổi bảo vệ luận văn của tôi sẽ bắt đầu lúc 9 giờ sáng.",
        pronunciation_focus: [
          "SI-dang SKRI-psi SA-ya A-kan di-MU-lai PU-kul sem-BI-lan PA-gi - `sidang skripsi` = buổi bảo vệ luận văn; `pukul` = giờ.",
          "Loi nguoi Viet: noi `presentasi skripsi` khi ban can no ve buoi bao ve chinh thuc. Trong dai hoc Indonesia, `sidang skripsi` la tu rat thuong dung.",
          "Luyen: `Sidang skripsi saya dimulai pukul sembilan.`",
        ],
        pronunciation_focus_en: [
          "SEE-dang SKREE-psi SA-ya A-kan dee-MOO-lai POO-kool sem-BEE-lan PAH-gee - `sidang skripsi` = thesis defense; `pukul` = o'clock/time.",
          "VN-speaker trap: saying `presentasi skripsi` when you mean the formal defense session. In Indonesian universities, `sidang skripsi` is the standard term.",
          "Drill: `Sidang skripsi saya dimulai pukul sembilan.`",
        ],
      },
      {
        en: "Dosen pembimbing saya sudah memberi banyak masukan.",
        vi: "Giảng viên hướng dẫn của tôi đã cho tôi nhiều góp ý.",
        pronunciation_focus: [
          "DO-sen pem-BIM-bing SA-ya SU-dah me-MBE-ri BA-nyak MA-su-kan - `dosen pembimbing` = giang vien huong dan; `masukan` = gop y.",
          "Loi nguoi Viet: dung `guru` cho giang vien dai hoc. Trong moi truong dai hoc, `dosen` la tu chuan.",
          "Luyen: `Dosen pembimbing saya memberi masukan.`",
        ],
        pronunciation_focus_en: [
          "DOH-sen pem-BEEM-beeng SA-ya SOO-dah meh-MBEH-ree BAH-nyak MAH-soo-kan - `dosen pembimbing` = thesis supervisor; `masukan` = feedback/input.",
          "VN-speaker trap: using `guru` for university lecturers. In higher education, `dosen` is the standard word.",
          "Drill: `Dosen pembimbing saya memberi masukan.`",
        ],
      },
      {
        en: "Penguji pertama menanyakan metode penelitian saya.",
        vi: "Giám khảo thứ nhất hỏi về phương pháp nghiên cứu của tôi.",
        pronunciation_focus: [
          "pe-NGU-ji per-TA-ma me-na-NYA-kan me-TO-de pe-ne-li-TI-an SA-ya - `penguji` = giam khao; `metode penelitian` = phuong phap nghien cuu.",
          "Loi nguoi Viet: goi nguoi hoi la `profesor` qua chung. Trong sidang, vai tro rat cu the: `penguji`, `pembimbing`, `mahasiswa`.",
          "Luyen: `Penguji menanyakan metode penelitian.`",
        ],
        pronunciation_focus_en: [
          "peh-NGOO-jee per-TAH-ma meh-na-NYAH-kan meh-TOH-deh peh-neh-lee-TEE-an SAH-yah - `penguji` = examiner; `metode penelitian` = research method.",
          "VN-speaker trap: calling everyone `profesor` too loosely. In a defense, roles are specific: `penguji`, `pembimbing`, `mahasiswa`.",
          "Drill: `Penguji menanyakan metode penelitian.`",
        ],
      },
      {
        en: "Saya akan menjelaskan revisi yang sudah saya lakukan.",
        vi: "Tôi sẽ giải thích những chỉnh sửa mà tôi đã thực hiện.",
        pronunciation_focus: [
          "SA-ya A-kan men-je-las-KAN re-VI-si yang SU-dah SA-ya la-KU-kan - `menjelaskan` = giai thich; `revisi` = chinh sua.",
          "Loi nguoi Viet: dung `edit` trong van noi hoc thuat. `Revisi` va `melakukan revisi` la tu chuan hon.",
          "Luyen: `Saya sudah melakukan revisi.`",
        ],
        pronunciation_focus_en: [
          "SAH-yah A-kan men-jeh-LAHS-kan reh-VEE-see yang SOO-dah SAH-yah lah-KOO-kan - `menjelaskan` = explain; `revisi` = revision/correction.",
          "VN-speaker trap: using `edit` in academic speech. `Revisi` and `melakukan revisi` are the standard terms.",
          "Drill: `Saya sudah melakukan revisi.`",
        ],
      },
      {
        en: "Presentasi saya terdiri dari latar belakang, teori, dan hasil penelitian.",
        vi: "Bài trình bày của tôi gồm phần bối cảnh, lý thuyết, và kết quả nghiên cứu.",
        pronunciation_focus: [
          "pre-sen-TA-si SA-ya ter-di-RI da-ri LA-tar be-LA-kang, te-O-ri, dan HA-sil pe-ne-li-TI-an - `terdiri dari` = gồm; `hasil penelitian` = kết quả nghiên cứu.",
          "Loi nguoi Viet: dung `isinya ada` qua thong thuong. Trong bao ve hoc thuat, `terdiri dari` nghe chuyen nghiep hon.",
          "Luyen: `Presentasi saya terdiri dari tiga bagian.`",
        ],
        pronunciation_focus_en: [
          "pre-sen-TA-see SA-ya ter-dee-REE da-ree LAH-tar beh-LAH-kang, teh-OH-ree, dan HAH-sil peh-neh-lee-TEE-an - `terdiri dari` = consists of; `hasil penelitian` = research results.",
          "VN-speaker trap: saying `isinya ada` too casually. In academic defenses, `terdiri dari` sounds more professional.",
          "Drill: `Presentasi saya terdiri dari tiga bagian.`",
        ],
      },
      {
        en: "Apakah ada pertanyaan dari penguji kedua?",
        vi: "Có câu hỏi nào từ giám khảo thứ hai không?",
        pronunciation_focus: [
          "a-pa-KAH A-da per-ta-NYA-an da-ri pe-NGU-ji ke-DU-a - `pertanyaan` = cau hoi; `penguji kedua` = giam khao thu hai.",
          "Loi nguoi Viet: dung `soalan` theo Malaysia atau `question` len tieng Anh. Trong sidang, `pertanyaan` la tu chuan.",
          "Luyen: `Ada pertanyaan dari penguji?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH A-da per-ta-NYAH-an da-ree peh-NGOO-jee keh-DOO-ah - `pertanyaan` = question; `penguji kedua` = second examiner.",
          "VN-speaker trap: using Malay `soalan` or the English `question`. In a defense, `pertanyaan` is the standard Indonesian word.",
          "Drill: `Ada pertanyaan dari penguji?`",
        ],
      },
      {
        en: "Saya perlu memperbaiki bagian teori sebelum sidang lanjutan.",
        vi: "Tôi cần chỉnh sửa phần lý thuyết trước buổi bảo vệ tiếp theo.",
        pronunciation_focus: [
          "SA-ya per-LU mem-per-BAI-ki ba-GI-an te-O-ri se-BE-lum SI-dang lan-JU-tan - `memperbaiki` = chinh sua/cai thien; `sidang lanjutan` = buoi bao ve tiep theo.",
          "Loi nguoi Viet: dung `fix` khi noi voi giang vien. `Memperbaiki` va `revisi` phu hop hon trong hoc thuat.",
          "Luyen: `Saya perlu memperbaiki bagian teori.`",
        ],
        pronunciation_focus_en: [
          "SAH-yah per-LOO mem-per-BAH-ee-kee bah-GEE-an teh-OH-ree seh-BEH-loom SEE-dang lahn-JOO-tahn - `memperbaiki` = improve/fix; `sidang lanjutan` = follow-up defense session.",
          "VN-speaker trap: using `fix` with lecturers. `Memperbaiki` and `revisi` are better suited to academic speech.",
          "Drill: `Saya perlu memperbaiki bagian teori.`",
        ],
      },
      {
        en: "Nilai akhir saya akan diumumkan setelah semua revisi selesai.",
        vi: "Điểm cuối cùng của tôi sẽ được công bố sau khi mọi chỉnh sửa hoàn tất.",
        pronunciation_focus: [
          "NI-lai A-khir SA-ya A-kan di-u-MUM-kan se-te-LAH se-MU-a re-VI-si se-LE-sai - `nilai akhir` = diem cuoi cung; `diumumkan` = duoc cong bo.",
          "Loi nguoi Viet: hoi `berapa nilai saya?` qua som. Trong sidang, `nilai akhir akan diumumkan` la cach noi trung lap hon.",
          "Luyen: `Nilai akhir akan diumumkan.`",
        ],
        pronunciation_focus_en: [
          "NEE-lie AH-kheer SAH-yah A-kan dee-oo-MOOM-kan seh-teh-LAH seh-MOO-ah reh-VEE-see seh-LEH-sai - `nilai akhir` = final grade; `diumumkan` = announced.",
          "VN-speaker trap: asking `berapa nilai saya?` too early. In a defense, `nilai akhir akan diumumkan` is the neutral phrasing.",
          "Drill: `Nilai akhir akan diumumkan.`",
        ],
      },
      {
        en: "Saya berharap bisa lulus dan segera ikut wisuda.",
        vi: "Tôi hy vọng có thể tốt nghiệp và sớm tham gia lễ tốt nghiệp.",
        pronunciation_focus: [
          "SA-ya ber-ha-RAP BI-sa LU-lus dan se-GE-ra i-KUT wi-SU-da - `lulus` = tot nghiep; `wisuda` = le tot nghiep.",
          "Loi nguoi Viet: dich `graduation` boi `graduasi` tu Anh. Trong dai hoc Indonesia, `wisuda` rat pho bien.",
          "Luyen: `Saya berharap bisa lulus.`",
        ],
        pronunciation_focus_en: [
          "SAH-yah ber-ha-RAHP BEE-sa LOO-loos dan seh-GEH-rah ee-KOOT wee-SOO-dah - `lulus` = graduate/pass; `wisuda` = graduation ceremony.",
          "VN-speaker trap: translating `graduation` with English-like `graduasi`. In Indonesian universities, `wisuda` is the common word.",
          "Drill: `Saya berharap bisa lulus.`",
        ],
      },
      {
        en: "Terima kasih atas bimbingan dan pertanyaannya.",
        vi: "Cảm ơn vì sự hướng dẫn và những câu hỏi của thầy/cô.",
        pronunciation_focus: [
          "te-RI-ma KA-sih A-tas bim-BIN-gan dan per-ta-NYA-an-nya - `bimbingan` = su huong dan; `pertanyaannya` = cau hoi cua thay/co.",
          "Loi nguoi Viet: dung `thanks untuk`. Kich ban hoc thuat hay dung `terima kasih atas ...`.",
          "Luyen: `Terima kasih atas bimbingannya.`",
        ],
        pronunciation_focus_en: [
          "teh-REE-ma KAH-seeh AH-tas beem-BEENG-an dan per-tah-NYAH-an-nya - `bimbingan` = guidance; `pertanyaannya` = the questions.",
          "VN-speaker trap: using `thanks untuk`. Academic Indonesian prefers `terima kasih atas ...`.",
          "Drill: `Terima kasih atas bimbingannya.`",
        ],
      },
      {
        en: "Saya akan menyerahkan berkas revisi kepada sekretariat.",
        vi: "Tôi sẽ nộp hồ sơ chỉnh sửa cho thư ký văn phòng.",
        pronunciation_focus: [
          "SA-ya A-kan me-nye-RAH-kan ber-KAS re-VI-si ke-PA-da se-kre-ta-RI-at - `berkas revisi` = ho so chinh sua; `sekretariat` = van phong thu ky.",
          "Loi nguoi Viet: dung `file` trong giao tiep chinh thuc. Trong truong dai hoc, `berkas` la tu rat tu nhien.",
          "Luyen: `Saya akan menyerahkan berkas.`",
        ],
        pronunciation_focus_en: [
          "SAH-yah A-kan mehn-yeh-RAH-kan BER-kas reh-VEE-see keh-PAH-dah seh-kreh-tah-REE-aht - `berkas revisi` = revision documents; `sekretariat` = secretariat office.",
          "VN-speaker trap: using `file` in formal university interaction. `Berkas` is very natural in Indonesian academia.",
          "Drill: `Saya akan menyerahkan berkas.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong môi trường đại học Indonesia, `sidang skripsi` là buổi bảo vệ chính thức trước dosen pembimbing dan penguji. Sinh viên thường trình bày presentasi ngắn, trả lời pertanyaan akademik, rồi chờ revisi trước khi nilai akhir được công bố. Sau khi selesai dan lulus, mahasiswa thường tham gia wisuda. Cách nói lịch sự thường dùng `saya`, `terima kasih atas...`, `mohon`, và `berkas`.",
    cultural_notes_en:
      "In Indonesian universities, `sidang skripsi` is the formal defense before the supervisor and examiners. Students usually give a short presentation, answer academic questions, then complete revisions before the final grade is announced. After finishing and graduating, students usually attend `wisuda`. Polite language commonly uses `saya`, `terima kasih atas...`, `mohon`, and `berkas`.",
    tip_advice_vi:
      "Mẹo cho người Việt: trong sidang, đừng nói quá đời thường như `aku`, `nggak tau`, `ini slide saya aja`. Hãy giữ nhịp trang trọng: `dosen pembimbing`, `penguji`, `revisi`, `pertanyaan akademik`, `nilai akhir`, `wisuda`. Khi chưa chắc, mở bằng `Terima kasih atas pertanyaannya, saya akan menjelaskan...`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: in a thesis defense, avoid overly casual speech like `aku`, `nggak tau`, or `ini slide saya aja`. Keep the register formal: `dosen pembimbing`, `penguji`, `revisi`, `pertanyaan akademik`, `nilai akhir`, `wisuda`. When unsure, start with `Terima kasih atas pertanyaannya, saya akan menjelaskan...`.",
    vocabulary: [
      { word: "sidang skripsi", en: "thesis defense", vi: "buoi bao ve luan van", pos: "noun phrase", pronunciation_vi: "SI-dang SKRI-psi", pronunciation_en: "SEE-dang SKREE-psi" },
      { word: "dosen pembimbing", en: "thesis supervisor", vi: "giang vien huong dan", pos: "noun phrase", pronunciation_vi: "DO-sen pem-BIM-bing", pronunciation_en: "DOH-sen pem-BEEM-bing" },
      { word: "penguji", en: "examiner", vi: "giam khao", pos: "noun", pronunciation_vi: "pe-NGU-ji", pronunciation_en: "peh-NGOO-jee" },
      { word: "revisi", en: "revision / correction", vi: "chinh sua", pos: "noun", pronunciation_vi: "re-VI-si", pronunciation_en: "reh-VEE-see" },
      { word: "presentasi", en: "presentation", vi: "bai trinh bay", pos: "noun", pronunciation_vi: "pre-sen-TA-si", pronunciation_en: "pre-sen-TA-see" },
      { word: "pertanyaan akademik", en: "academic question", vi: "cau hoi hoc thuat", pos: "noun phrase", pronunciation_vi: "per-ta-NYA-an a-ka-DE-mik", pronunciation_en: "per-tah-NYAH-an ah-kah-DEH-meek" },
      { word: "nilai akhir", en: "final grade", vi: "diem cuoi cung", pos: "noun phrase", pronunciation_vi: "NI-lai A-khir", pronunciation_en: "NEE-lie AH-kheer" },
      { word: "wisuda", en: "graduation ceremony", vi: "le tot nghiep", pos: "noun", pronunciation_vi: "wi-SU-da", pronunciation_en: "wee-SOO-dah" },
      { word: "berkas revisi", en: "revision documents", vi: "ho so chinh sua", pos: "noun phrase", pronunciation_vi: "BER-kas re-VI-si", pronunciation_en: "BER-kas reh-VEE-see" },
      { word: "bimbingan", en: "guidance / supervision", vi: "su huong dan", pos: "noun", pronunciation_vi: "bim-BIN-gan", pronunciation_en: "beem-BEENG-an" },
    ],
    dialogue: [
      {
        speaker: "Mahasiswa",
        text: "Selamat pagi, terima kasih atas waktunya. Saya siap mempresentasikan skripsi saya.",
        vi: "Chào buổi sáng, cảm ơn vì thời gian của thầy/cô. Tôi sẵn sàng trình bày luận văn của mình.",
        en: "Good morning, thank you for your time. I am ready to present my thesis.",
      },
      {
        speaker: "Dosen pembimbing",
        text: "Silakan mulai dengan latar belakang penelitian.",
        vi: "Mời bắt đầu với phần bối cảnh nghiên cứu.",
        en: "Please begin with the research background.",
      },
      {
        speaker: "Mahasiswa",
        text: "Terima kasih, Pak. Penelitian ini terdiri dari tiga bagian utama.",
        vi: "Cảm ơn thầy. Nghiên cứu này gồm ba phần chính.",
        en: "Thank you, sir. This research consists of three main parts.",
      },
      {
        speaker: "Penguji",
        text: "Apa perbedaan utama antara hasil awal dan hasil revisi?",
        vi: "Điểm khác biệt chính giữa kết quả ban đầu và kết quả đã chỉnh sửa là gì?",
        en: "What is the main difference between the initial results and the revised results?",
      },
      {
        speaker: "Mahasiswa",
        text: "Saya sudah memperbaiki bagian metode penelitian dan menambahkan data pendukung.",
        vi: "Tôi đã chỉnh sửa phần phương pháp nghiên cứu và bổ sung dữ liệu hỗ trợ.",
        en: "I have improved the research method section and added supporting data.",
      },
      {
        speaker: "Penguji",
        text: "Baik. Kami akan menyampaikan nilai akhir setelah semua revisi selesai.",
        vi: "Được rồi. Chúng tôi sẽ công bố điểm cuối cùng sau khi mọi chỉnh sửa hoàn tất.",
        en: "All right. We will announce the final grade after all revisions are complete.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dich sang tieng Indonesia: Buoi bao ve luan van cua toi se bat dau luc 9 gio sang.",
        prompt_en: "Translate into Indonesian: My thesis defense will start at 9 a.m.",
        answer: "Sidang skripsi saya akan dimulai pukul sembilan pagi.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Dien tu: Dosen ____ saya sudah memberi banyak masukan.",
        prompt_en: "Fill in the blank: Dosen ____ saya sudah memberi banyak masukan.",
        answer: "pembimbing",
      },
      {
        type: "multiple_choice",
        prompt_vi: "`wisuda` nghia la gi?",
        prompt_en: "What does `wisuda` mean?",
        choices: ["le tot nghiep / graduation ceremony", "thi cuoi ki / final exam", "lop hoc / classroom"],
        answer: "le tot nghiep / graduation ceremony",
      },
      {
        type: "rewrite_formal",
        prompt_vi: "Viet lai trang trong hon: Saya mau presentasi skripsi saya sekarang.",
        prompt_en: "Rewrite more formally: I want to present my thesis now.",
        answer: "Saya akan mempresentasikan skripsi saya sekarang.",
      },
    ],
  },
];

export default lessons;
