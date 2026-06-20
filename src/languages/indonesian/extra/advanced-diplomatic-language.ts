// Advanced Diplomatic Language Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file following the established Indonesian extra
// format. The `en` field holds TARGET-LANGUAGE Indonesian, `vi` holds the
// Vietnamese gloss, and pronunciation_focus carries Vietnamese L1 notes with
// English companion explanations in the same order.

type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar/culture notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

type IndonesianVocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type IndonesianDialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type IndonesianExercise = Record<string, any>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
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

export const advancedDiplomaticLanguageLessons: IndonesianLesson[] = [
  {
    id: "indonesian_advanced_diplomatic_language",
    level: "B1",
    category: "communication",
    title_vi: "Ngon ngu ngoai giao: giu trung lap, lich su va ro rang",
    title_en: "Diplomatic language: staying neutral, polite and clear",
    sentences: [
      {
        en: "Dengan hormat, saya ingin menyampaikan beberapa catatan.",
        vi: "Kinh thua, toi muon trinh bay mot vai ghi chu.",
        pronunciation_focus: [
          "`Dengan hormat` = với sự kính trọng; rất hay dùng trong email và phát biểu trang trọng.",
          "`menyampaikan` = trình bày/đề đạt; lịch sự hơn `bilang` hoặc `ngomong`.",
          "Loi nguoi Viet: mo bang `saya mau bilang` qua truc tiep. Trong ngu canh trang trong, `saya ingin menyampaikan` mem hon.",
        ],
        pronunciation_focus_en: [
          "`Dengan hormat` means with respect; common in formal email and speeches.",
          "`menyampaikan` means present/convey; more polite than `bilang` or `ngomong`.",
          "VN-speaker trap: opening with `saya mau bilang` is too direct. In formal contexts, `saya ingin menyampaikan` is softer.",
        ],
      },
      {
        en: "Kami mempertimbangkan masukan dari semua pihak.",
        vi: "Chung toi xem xet y kien tu tat ca cac ben.",
        pronunciation_focus: [
          "`mempertimbangkan` = xem xét; từ này dùng tốt khi chưa muốn quyết định vội.",
          "`masukan` = ý kiến/đóng góp; khác với `masukkan` là động từ 'cho vào'.",
          "Loi nguoi Viet: nham `masukan` va `masukkan`. Trong giao tiep chinh thuc, dau am `-an` rat quan trong.",
        ],
        pronunciation_focus_en: [
          "`mempertimbangkan` means consider; useful when you do not want to decide too quickly.",
          "`masukan` means input or feedback; different from `masukkan`, the verb 'put in'.",
          "VN-speaker trap: confusing `masukan` and `masukkan`. In formal communication, the final sound matters.",
        ],
      },
      {
        en: "Saya memahami kekhawatiran Anda, tetapi izinkan saya memberi penjelasan.",
        vi: "Toi hieu su lo lang cua anh/chj, nhung cho phep toi giai thich.",
        pronunciation_focus: [
          "`memahami kekhawatiran` = thấu hiểu lo ngại; mở đầu rất an toàn khi phản hồi ý kiến khó.",
          "`izinkan saya` = xin cho tôi; cách xin phép mềm và trang trọng.",
          "Loi nguoi Viet: noi thang `tidak benar` ngay lap tuc. Nay dung `saya memahami... tetapi...` de giam xung dot.",
        ],
        pronunciation_focus_en: [
          "`memahami kekhawatiran` means understand the concern; a safe opener for difficult replies.",
          "`izinkan saya` means allow me; a soft and formal request.",
          "VN-speaker trap: jumping directly to `tidak benar`. Use `saya memahami... tetapi...` to reduce conflict.",
        ],
      },
      {
        en: "Mohon maaf, kami belum bisa mengambil keputusan final saat ini.",
        vi: "Xin loi, hien tai chung toi chua the dua ra quyet dinh cuoi cung.",
        pronunciation_focus: [
          "`mohon maaf` = xin lỗi; cụm an toàn trong thư từ và họp.",
          "`belum bisa mengambil keputusan final` = chưa thể đưa ra quyết định cuối cùng; tránh cam kết quá sớm.",
          "Loi nguoi Viet: noi `kita tidak bisa` co the nghe go. `belum bisa` mem hon va chuyen nghiep hon.",
        ],
        pronunciation_focus_en: [
          "`mohon maaf` means sorry/excuse me; safe in correspondence and meetings.",
          "`belum bisa mengambil keputusan final` means cannot make a final decision yet; avoids premature commitment.",
          "VN-speaker trap: `kita tidak bisa` can sound blunt. `belum bisa` is softer and more professional.",
        ],
      },
      {
        en: "Menurut saya, ada beberapa hal yang perlu dibahas lebih lanjut.",
        vi: "Theo toi, co mot vai dieu can duoc thao luan them.",
        pronunciation_focus: [
          "`menurut saya` = theo tôi; mở ý kiến cá nhân mà không áp đặt.",
          "`perlu dibahas lebih lanjut` = cần được bàn thêm; rất hữu ích để kéo cuộc thảo luận sang hướng xây dựng.",
          "Loi nguoi Viet: noi `saya pikir` khong sai, nhung `menurut saya` thuong trang trong hon.",
        ],
        pronunciation_focus_en: [
          "`menurut saya` means in my opinion; introduces a personal view without forcing it.",
          "`perlu dibahas lebih lanjut` means needs further discussion; useful for constructive direction.",
          "VN-speaker note: `saya pikir` is not wrong, but `menurut saya` often sounds more formal.",
        ],
      },
      {
        en: "Kami ingin menjaga hubungan baik dengan semua pihak.",
        vi: "Chung toi muon giu quan he tot voi tat ca cac ben.",
        pronunciation_focus: [
          "`menjaga hubungan baik` = giữ quan hệ tốt; cụm cực kỳ quan trọng trong ngôn ngữ ngoại giao.",
          "`semua pihak` = tất cả các bên; nghe trung lập hơn khi không muốn nêu đích danh.",
          "Loi nguoi Viet: dung `bên này bên kia` qua nhieu. Trong ngoai giao, `semua pihak` trung lap va an toan.",
        ],
        pronunciation_focus_en: [
          "`menjaga hubungan baik` means maintain good relations; crucial in diplomatic language.",
          "`semua pihak` means all parties; neutral when you do not want to name sides.",
          "VN-speaker trap: overusing `this side/that side`. In diplomacy, `semua pihak` is neutral and safe.",
        ],
      },
      {
        en: "Apabila diperlukan, kami siap mencari solusi bersama.",
        vi: "Neu can, chung toi san sang tim giai phap cung nhau.",
        pronunciation_focus: [
          "`apabila diperlukan` = nếu cần; văn viết và rất trang trọng.",
          "`solusi bersama` = giải pháp cùng nhau; thể hiện tinh thần hợp tác.",
          "Loi nguoi Viet: noi `kalau perlu` duoc, nhung `apabila diperlukan` trang trong hon trong van ban chinh thuc.",
        ],
        pronunciation_focus_en: [
          "`apabila diperlukan` means if needed; written and formal.",
          "`solusi bersama` means joint solution; shows cooperation.",
          "VN-speaker note: `kalau perlu` is fine, but `apabila diperlukan` is more formal in official text.",
        ],
      },
      {
        en: "Saya ingin menyampaikan keberatan secara netral.",
        vi: "Toi muon neu y kien phan doi theo cach trung lap.",
        pronunciation_focus: [
          "`menyampaikan keberatan` = nêu ý kiến phản đối/quan ngại; cụm quan trọng trong ngôn ngữ ngoại giao.",
          "`secara netral` = một cách trung lập; giúp câu không mang sắc thái công kích.",
          "Loi nguoi Viet: bien `keberatan` thanh than phiền gay gat. Trong ngoai giao, y cu la phan doi nhung giu giong trung tinh.",
        ],
        pronunciation_focus_en: [
          "`menyampaikan keberatan` means raise an objection/concern; key diplomatic phrase.",
          "`secara netral` means neutrally; keeps the line non-attacking.",
          "VN-speaker trap: turning `keberatan` into a harsh complaint. In diplomacy, the idea is objection with neutral tone.",
        ],
      },
      {
        en: "Terima kasih atas perhatian dan kerja samanya.",
        vi: "Cam on vi su chu y va su hop tac cua quy vi.",
        pronunciation_focus: [
          "`atas perhatian` = vì sự quan tâm; câu kết rất quen trong email trang trọng.",
          "`kerja samanya` = sự hợp tác của anh/chị/quý vị; `kerja sama` là hợp tác.",
          "Loi nguoi Viet: ket thu bang `thank you` nghe loe ngoe. Cau ket nay rat Indonesia va chuyen nghiep.",
        ],
        pronunciation_focus_en: [
          "`atas perhatian` means for your attention; a common formal email closing.",
          "`kerja samanya` means your cooperation; `kerja sama` is cooperation.",
          "VN-speaker note: ending with mixed English can feel loose. This closing is fully Indonesian and professional.",
        ],
      },
      {
        en: "Mohon konfirmasi jika ada hal yang perlu kami perbaiki.",
        vi: "Xin xac nhan neu co dieu gi chung toi can sua doi.",
        pronunciation_focus: [
          "`mohon konfirmasi` = xin xác nhận; rất hay trong email, rapat, dan tindak lanjut.",
          "`perlu kami perbaiki` = chúng tôi cần sửa; cho thấy tinh thần trách nhiệm.",
          "Loi nguoi Viet: noi `bilang saja kalau salah` qua truc tiep. `mohon konfirmasi` mem va giu luc su.",
        ],
        pronunciation_focus_en: [
          "`mohon konfirmasi` means please confirm; common in email, meetings, and follow-up.",
          "`perlu kami perbaiki` means we need to fix; shows responsibility.",
          "VN-speaker trap: blunt `tell me if wrong`. `mohon konfirmasi` is softer and keeps dignity.",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong giao tiep ngoai giao hoac lien he chinh thuc o Indonesia, nguoi noi thuong tranh phan biet dung-sai qua truc tiep va u tien ngon ngu trung lap: `menurut saya`, `kami memahami`, `apabila diperlukan`, `semua pihak`, `solusi bersama`. Tieu de va email thuong bat dau bang `Dengan hormat` hoac `Mohon maaf`. Khi can phan doi, nguoi Indonesia de cao giong noi chuyen nghiep, khong cong kich ca nhan, va luon ket bang loi cam on hoac de nghi xac nhan.",
    cultural_notes_en:
      "In Indonesian formal or diplomatic communication, speakers usually avoid overly direct right-or-wrong wording and prefer neutral language: `menurut saya`, `kami memahami`, `apabila diperlukan`, `semua pihak`, `solusi bersama`. Emails and letters often begin with `Dengan hormat` or `Mohon maaf`. When objecting, Indonesian communication values a professional tone, avoids personal attacks, and often ends with thanks or a request for confirmation.",
    tip_advice_vi:
      "Cong thuc an toan: mo bang `Dengan hormat` hoac `Mohon maaf`, noi quan diem bang `menurut saya`, giam xung dot bang `kami memahami`, va ket bang `Terima kasih atas perhatian dan kerja samanya`. Neu muon phan doi, dung `menyampaikan keberatan secara netral` thay vi noi thang theo kieu cam tinh.",
    tip_advice_en:
      "Safe formula: open with `Dengan hormat` or `Mohon maaf`, express your view with `menurut saya`, soften conflict with `kami memahami`, and close with `Terima kasih atas perhatian dan kerja samanya`. If you want to object, use `menyampaikan keberatan secara netral` rather than an emotional direct statement.",
    vocabulary: [
      {
        word: "dengan hormat",
        en: "respectfully",
        vi: "kinh thua / tran trong",
        pos: "phrase",
        pronunciation_vi: "DE-ngan HOR-mat",
        pronunciation_en: "DEH-ngan HOR-mat",
      },
      {
        word: "mempertimbangkan",
        en: "to consider",
        vi: "xem xet",
        pos: "verb",
        pronunciation_vi: "mem-per-tim-BANG-kan",
        pronunciation_en: "mem-per-TEEM-bung-kan",
      },
      {
        word: "menyampaikan",
        en: "to convey, to present",
        vi: "trinh bay, truyen dat",
        pos: "verb",
        pronunciation_vi: "me-nyam-PAI-kan",
        pronunciation_en: "meh-nyam-PAI-kan",
      },
      {
        word: "keberatan",
        en: "objection, concern",
        vi: "y kien phan doi, quan ngai",
        pos: "noun",
        pronunciation_vi: "ke-be-RA-tan",
        pronunciation_en: "keh-beh-RAH-tan",
      },
      {
        word: "menjaga hubungan",
        en: "maintain relations",
        vi: "giu quan he",
        pos: "verb phrase",
        pronunciation_vi: "men-JA-ga hu-BUNG-an",
        pronunciation_en: "men-JAH-ga hoo-BOONG-an",
      },
      {
        word: "solusi bersama",
        en: "joint solution",
        vi: "giai phap cung nhau",
        pos: "noun phrase",
        pronunciation_vi: "so-LU-si ber-SA-ma",
        pronunciation_en: "soh-LOO-see ber-SAH-mah",
      },
      {
        word: "netral",
        en: "neutral",
        vi: "trung lap",
        pos: "adjective",
        pronunciation_vi: "NE-tral",
        pronunciation_en: "NEH-tral",
      },
      {
        word: "mohon maaf",
        en: "please excuse me / sorry",
        vi: "xin loi",
        pos: "phrase",
        pronunciation_vi: "MO-hon ma-AF",
        pronunciation_en: "MOH-hon ma-AHF",
      },
    ],
    dialogue: [
      {
        speaker: "Perwakilan A",
        text: "Dengan hormat, kami ingin menyampaikan beberapa catatan.",
        vi: "Kinh thua, chung toi muon trinh bay mot vai ghi chu.",
        en: "Respectfully, we would like to convey several notes.",
      },
      {
        speaker: "Perwakilan B",
        text: "Tentu, kami memahami posisi Anda.",
        vi: "Tat nhien, chung toi hieu vi tri cua quy vi.",
        en: "Certainly, we understand your position.",
      },
      {
        speaker: "Perwakilan A",
        text: "Kami menyampaikan keberatan secara netral agar hubungan tetap baik.",
        vi: "Chung toi neu y kien phan doi theo cach trung lap de quan he van tot dep.",
        en: "We are raising our objection neutrally so the relationship remains good.",
      },
      {
        speaker: "Perwakilan B",
        text: "Baik, mari kita mencari solusi bersama.",
        vi: "Duoc, hay cung nhau tim giai phap.",
        en: "Alright, let us look for a joint solution.",
      },
      {
        speaker: "Perwakilan A",
        text: "Terima kasih atas perhatian dan kerja samanya.",
        vi: "Cam on vi su chu y va hop tac cua quy vi.",
        en: "Thank you for your attention and cooperation.",
      },
    ],
    exercises: [
      {
        type: "translation_id",
        prompt_vi: "Dich sang tieng Indonesia: Kinh thua, toi muon trinh bay mot vai ghi chu.",
        prompt_en: "Translate into Indonesian: Respectfully, I would like to present a few notes.",
        answer: "Dengan hormat, saya ingin menyampaikan beberapa catatan.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Dien tu dung: Kami ingin ___ masukan dari semua pihak.",
        prompt_en: "Fill in the correct word: Kami ingin ___ masukan dari semua pihak.",
        answer: "mempertimbangkan",
        explanation_vi: "`mempertimbangkan` = xem xet.",
        explanation_en: "`mempertimbangkan` means to consider.",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Cum nao lich su va trang trong nhat de mo dau email?",
        prompt_en: "Which phrase is the most polite and formal way to open an email?",
        choices: ["Dengan hormat", "Eh bro", "Saya mau bilang", "Cepat baca"],
        answer: "Dengan hormat",
      },
      {
        type: "short_answer",
        prompt_vi: "Viet mot cau trung lap de noi ban co y kien phan doi.",
        prompt_en: "Write one neutral sentence saying you have an objection.",
        sample_answer: "Saya ingin menyampaikan keberatan secara netral.",
      },
    ],
  },
];
