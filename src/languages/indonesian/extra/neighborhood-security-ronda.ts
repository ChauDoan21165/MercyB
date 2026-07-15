// Indonesian neighborhood security / ronda lesson pack for Vietnamese learners.
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

export const neighborhoodSecurityRondaLessons: IndonesianLesson[] = [
  {
    id: "indonesian_ronda_malam_pos_kamling",
    level: "A2",
    category: "community_safety",
    title_vi: "Ronda malam và pos kamling",
    title_en: "Night watch and neighborhood security post",
    sentences: [
      {
        en: "Malam ini saya ikut ronda malam di kompleks.",
        vi: "Tối nay tôi tham gia tuần tra đêm trong khu nhà.",
        pronunciation_focus: [
          "MA-lam I-ni SA-ya I-kut RON-da MA-lam di KOM-pleks.",
          "`ronda malam` = tuần tra/gác đêm ở khu dân cư; `ikut` = tham gia.",
          "L1 Việt: `ikut` rất tự nhiên cho tham gia hoạt động cộng đồng; không cần dùng từ trang trọng hơn.",
        ],
        pronunciation_focus_en: [
          "MA-lam I-ni SA-ya I-kut RON-da MA-lam di KOM-pleks.",
          "`ronda malam` = night watch/patrol in a neighborhood; `ikut` = join.",
          "VN-speaker note: `ikut` is natural for joining community activities; no need for a more formal verb.",
        ],
      },
      {
        en: "Pos kamling ada di dekat gerbang utama.",
        vi: "Chốt an ninh khu dân cư ở gần cổng chính.",
        pronunciation_focus: [
          "pos KAM-ling A-da di de-KAT GER-bang u-TA-ma.",
          "`pos kamling` = chốt/gian canh an ninh cộng đồng; viết tắt từ keamanan lingkungan.",
          "L1 Việt: `di dekat` = ở gần. Đừng dùng `ke dekat` vì `ke` chỉ hướng đi.",
        ],
        pronunciation_focus_en: [
          "pos KAM-ling A-da di de-KAT GER-bang u-TA-ma.",
          "`pos kamling` = neighborhood security post; `kamling` abbreviates keamanan lingkungan.",
          "VN-speaker trap: `di dekat` = near/at near. Do not use `ke dekat`; `ke` marks direction.",
        ],
      },
      {
        en: "Pak satpam berkeliling setiap dua jam.",
        vi: "Chú bảo vệ đi tuần mỗi hai giờ.",
        pronunciation_focus: [
          "Pak SAT-pam ber-ke-LI-ling se-TI-ap DU-a jam.",
          "`satpam` = bảo vệ; `berkeliling` = đi vòng quanh/đi tuần.",
          "L1 Việt: `setiap dua jam` = mỗi hai giờ; số đứng sau `setiap`, không cần từ đếm.",
        ],
        pronunciation_focus_en: [
          "Pak SAT-pam ber-ke-LI-ling se-TI-ap DU-a jam.",
          "`satpam` = security guard; `berkeliling` = go around/patrol.",
          "VN-speaker note: `setiap dua jam` = every two hours; no classifier is needed.",
        ],
      },
      {
        en: "Tamu yang menginap perlu lapor ke Pak RT.",
        vi: "Khách ngủ lại cần báo với ông trưởng RT.",
        pronunciation_focus: [
          "TA-mu yang me-NGI-nap per-LU LA-por ke Pak er-TE.",
          "`tamu yang menginap` = khách ngủ lại; `lapor ke` = báo với/người nhận báo cáo.",
          "L1 Việt: `tamu` là khách đến chơi/khách ở nhà, không phải `pelanggan` là khách hàng mua dịch vụ.",
        ],
        pronunciation_focus_en: [
          "TA-mu yang me-NGI-nap per-LU LA-por ke Pak er-TE.",
          "`tamu yang menginap` = overnight guest; `lapor ke` = report to.",
          "VN-speaker trap: `tamu` is a visitor/house guest, not `pelanggan`, a paying customer.",
        ],
      },
      {
        en: "Keamanan lingkungan perlu dijaga bersama.",
        vi: "An ninh khu dân cư cần được cùng nhau giữ gìn.",
        pronunciation_focus: [
          "ke-a-MA-nan ling-KUNG-an per-LU di-JA-ga ber-SA-ma.",
          "`dijaga` = được giữ gìn/bảo vệ; dạng `di-` bị động thường dùng trong thông báo.",
          "L1 Việt: câu bị động này tự nhiên trong quy định cộng đồng, đừng dịch cứng thành chủ động nếu không cần.",
        ],
        pronunciation_focus_en: [
          "ke-a-MA-nan ling-KUNG-an per-LU di-JA-ga ber-SA-ma.",
          "`dijaga` = be maintained/protected; the `di-` passive is common in announcements.",
          "VN-speaker note: this passive wording is natural in community rules; do not force an active sentence.",
        ],
      },
    ],
    cultural_notes_vi:
      "Di banyak lingkungan Indonesia, `ronda malam` atau `siskamling` adalah kegiatan warga untuk menjaga keamanan bersama. `Pos kamling` thường là chốt nhỏ ở gần cổng/khu trung tâm, nơi warga hoặc satpam berkumpul, mencatat tamu, dan berkeliling. Người mới ở khu dân cư thường nên biết Pak RT/Bu RT, satpam, dan aturan tamu menginap.",
    cultural_notes_en:
      "In many Indonesian neighborhoods, `ronda malam` or `siskamling` is a resident activity for shared security. A `pos kamling` is often a small post near the gate or central area where residents or guards gather, record guests, and patrol. New residents should know the local RT head, security guard, and overnight guest rules.",
    tip_advice_vi:
      "Mẫu nên học: `ikut ronda malam`, `lapor ke Pak RT`, `pos kamling di dekat...`, `keamanan lingkungan dijaga bersama`. Người Việt cần phân biệt `tamu` (khách đến nhà) và `pelanggan` (khách hàng).",
    tip_advice_en:
      "Useful chunks: `ikut ronda malam`, `lapor ke Pak RT`, `pos kamling di dekat...`, `keamanan lingkungan dijaga bersama`. Vietnamese speakers should distinguish `tamu` (visitor/guest) from `pelanggan` (customer).",
    vocabulary: [
      {
        cell_id: "b3c45d0a-d39e-4cda-bf4d-20dc2452c8e5",
        word: "ronda malam",
        en: "night watch / night patrol",
        vi: "tuần tra đêm / gác đêm",
        pos: "noun phrase",
        pronunciation_vi: "RON-da MA-lam",
        pronunciation_en: "RON-da MA-lam",
      },
      {
        cell_id: "d4e4dc24-b7bf-4e75-8e72-96f5465790a3",
        word: "pos kamling",
        en: "neighborhood security post",
        vi: "chốt an ninh khu dân cư",
        pos: "noun phrase",
        pronunciation_vi: "pos KAM-ling",
        pronunciation_en: "pos KAM-ling",
      },
      {
        cell_id: "a351f944-f85a-4c0d-9375-c507ebf31425",
        word: "satpam",
        en: "security guard",
        vi: "bảo vệ",
        pos: "noun",
        pronunciation_vi: "SAT-pam",
        pronunciation_en: "SAT-pam",
      },
      {
        cell_id: "b207907f-0b80-4cc6-964a-98abf008adac",
        word: "tamu menginap",
        en: "overnight guest",
        vi: "khách ngủ lại",
        pos: "noun phrase",
        pronunciation_vi: "TA-mu me-NGI-nap",
        pronunciation_en: "TA-moo me-NGI-nap",
      },
      {
        cell_id: "9a816e70-cda3-458f-8097-1c894ec09840",
        word: "keamanan lingkungan",
        en: "neighborhood security",
        vi: "an ninh khu dân cư",
        pos: "noun phrase",
        pronunciation_vi: "ke-a-MA-nan ling-KUNG-an",
        pronunciation_en: "ke-a-MA-nan ling-KUNG-an",
      },
      {
        cell_id: "76539990-9042-4616-be4b-c06bc0aa0013",
        word: "lapor ke",
        en: "to report to",
        vi: "báo với / trình báo cho",
        pos: "verb phrase",
        pronunciation_vi: "LA-por ke",
        pronunciation_en: "LA-por keh",
      },
    ],
    dialogue: [
      {
        cell_id: "761d2883-5e3b-4311-b790-9cb97cb2a610",
        speaker: "Warga Baru",
        text: "Pak, pos kamling ada di mana?",
        vi: "Anh/bác ơi, chốt an ninh khu dân cư ở đâu?",
        en: "Sir, where is the neighborhood security post?",
      },
      {
        cell_id: "0260e088-1829-4169-b18f-545c2b0a1891",
        speaker: "Satpam",
        text: "Di dekat gerbang utama. Malam ini ada ronda.",
        vi: "Ở gần cổng chính. Tối nay có tuần tra đêm.",
        en: "Near the main gate. There is night watch tonight.",
      },
      {
        cell_id: "d35c77c3-92dd-4e51-8a45-ecbb13e0f8ac",
        speaker: "Warga Baru",
        text: "Kalau ada tamu menginap, saya lapor ke siapa?",
        vi: "Nếu có khách ngủ lại, tôi báo với ai?",
        en: "If there is an overnight guest, whom should I report to?",
      },
      {
        cell_id: "f7b49e83-1dae-409d-b8fa-1137090c3516",
        speaker: "Satpam",
        text: "Lapor ke Pak RT atau satpam yang jaga.",
        vi: "Báo với Pak RT hoặc bảo vệ đang trực.",
        en: "Report to the RT head or the security guard on duty.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ phù hợp về ronda và pos kamling:",
        instruction_en: "Fill in the suitable ronda and security-post word:",
        items: [
          {
            prompt: "Malam ini saya ikut ___ malam. (tuần tra)",
            answer: "ronda",
            options: ["ronda", "rencana", "rekening"],
          },
          {
            prompt: "Pos kamling ada di dekat ___ utama. (cổng)",
            answer: "gerbang",
            options: ["gerbang", "gudang", "gelas"],
          },
          {
            prompt: "Tamu yang menginap perlu ___ ke Pak RT. (báo)",
            answer: "lapor",
            options: ["lapor", "lupa", "lari"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tối nay tôi tham gia tuần tra đêm.", answer: "Malam ini saya ikut ronda malam." },
          { prompt: "Chốt an ninh ở gần cổng chính.", answer: "Pos kamling ada di dekat gerbang utama." },
          { prompt: "Khách ngủ lại cần báo với Pak RT.", answer: "Tamu yang menginap perlu lapor ke Pak RT." },
        ],
      },
    ],
  },
  {
    id: "indonesian_laporan_warga_suspicious_activity",
    level: "B1",
    category: "community_safety",
    title_vi: "Báo cáo cư dân và tình huống đáng ngờ",
    title_en: "Resident reports and suspicious situations",
    sentences: [
      {
        en: "Ada orang asing yang mondar-mandir di depan rumah.",
        vi: "Có người lạ đi qua đi lại trước nhà.",
        pronunciation_focus: [
          "A-da O-rang A-sing yang MON-dar-MAN-dir di de-PAN RU-mah.",
          "`orang asing` = người lạ/người nước ngoài tùy ngữ cảnh; ở đây là người lạ.",
          "L1 Việt: `mondar-mandir` là từ láy cố định nghĩa là đi qua đi lại; học nguyên cụm.",
        ],
        pronunciation_focus_en: [
          "A-da O-rang A-sing yang MON-dar-MAN-dir di de-PAN RU-mah.",
          "`orang asing` can mean stranger or foreigner depending on context; here it means stranger.",
          "VN-speaker note: `mondar-mandir` is a fixed reduplicated word meaning pacing/back-and-forth movement.",
        ],
      },
      {
        en: "Saya merasa curiga karena motornya tidak ada pelat nomor.",
        vi: "Tôi thấy nghi ngờ vì xe máy của người đó không có biển số.",
        pronunciation_focus: [
          "SA-ya me-RA-sa cu-RI-ga ka-RE-na MO-tor-nya TI-dak A-da PE-lat NO-mor.",
          "`merasa curiga` = cảm thấy nghi ngờ; `pelat nomor` = biển số xe.",
          "L1 Việt: `tidak ada` = không có; đừng dùng `bukan ada`.",
        ],
        pronunciation_focus_en: [
          "SA-ya me-RA-sa choo-REE-ga ka-RE-na MO-tor-nya TI-dak A-da PE-lat NO-mor.",
          "`merasa curiga` = feel suspicious; `pelat nomor` = vehicle license plate.",
          "VN-speaker trap: `tidak ada` = there is/are not; do not use `bukan ada`.",
        ],
      },
      {
        en: "Tolong kirim laporan warga ke grup RT.",
        vi: "Làm ơn gửi báo cáo của cư dân vào nhóm RT.",
        pronunciation_focus: [
          "TO-long KI-rim la-PO-ran WAR-ga ke grup er-TE.",
          "`laporan warga` = báo cáo/thông tin từ cư dân; `ke grup` = gửi vào nhóm.",
          "L1 Việt: với hướng gửi, dùng `ke grup`; `di grup` là ở trong nhóm.",
        ],
        pronunciation_focus_en: [
          "TO-long KI-rim la-PO-ran WAR-ga ke grup er-TE.",
          "`laporan warga` = resident report/information; `ke grup` = send to the group.",
          "VN-speaker trap: for sending direction, use `ke grup`; `di grup` means in the group.",
        ],
      },
      {
        en: "Jangan menuduh orang sebelum ada bukti.",
        vi: "Đừng buộc tội người khác trước khi có bằng chứng.",
        pronunciation_focus: [
          "JA-ngan me-NU-duh O-rang se-BE-lum A-da BUK-ti.",
          "`jangan` = đừng; `menuduh` = buộc tội; `bukti` = bằng chứng.",
          "L1 Việt: cảnh báo an ninh nên khách quan. Dùng `curiga` để nói nghi ngờ, không kết luận quá sớm.",
        ],
        pronunciation_focus_en: [
          "JA-ngan me-NU-duh O-rang se-BE-lum A-da BUK-ti.",
          "`jangan` = do not; `menuduh` = accuse; `bukti` = evidence.",
          "VN-speaker note: security reports should stay objective. Use `curiga` for suspicion without jumping to conclusions.",
        ],
      },
      {
        en: "Kalau situasinya darurat, segera hubungi nomor darurat.",
        vi: "Nếu tình huống khẩn cấp, hãy liên hệ ngay số khẩn cấp.",
        pronunciation_focus: [
          "KA-lau si-tu-A-si-nya da-RU-rat, se-GE-ra hu-BUNG-i NO-mor da-RU-rat.",
          "`segera hubungi` = hãy liên hệ ngay; `nomor darurat` = số khẩn cấp.",
          "L1 Việt: `hubungi` cần đối tượng trực tiếp: `hubungi satpam`, `hubungi nomor darurat`.",
        ],
        pronunciation_focus_en: [
          "KA-lau si-tu-A-si-nya da-ROO-rat, se-GE-ra hu-BOONG-i NO-mor da-ROO-rat.",
          "`segera hubungi` = contact immediately; `nomor darurat` = emergency number.",
          "VN-speaker note: `hubungi` takes a direct object: `hubungi satpam`, `hubungi nomor darurat`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong nhóm warga hoặc grup RT, báo cáo an ninh nên ngắn, rõ, và không vu cáo: waktu, tempat, ciri-ciri, kejadian, dan foto jika aman. Nhiều khu dân cư khuyên warga báo ke satpam/Pak RT trước, còn tình huống nguy hiểm thật sự thì hubungi nomor darurat seperti 112 hoặc polisi setempat.",
    cultural_notes_en:
      "In a resident or RT chat group, a security report should be short, clear, and avoid accusations: time, place, description, incident, and a photo if safe. Many neighborhoods advise reporting to security or the RT head first, while real danger should go to an emergency number such as 112 or the local police.",
    tip_advice_vi:
      "Mẫu báo cáo an toàn: `Saya melihat...`, `Saya merasa curiga karena...`, `Lokasinya di...`, `Tolong dicek oleh satpam`. Tránh viết `pasti pencuri` nếu chưa có bukti; nói `mencurigakan` sẽ an toàn và lịch sự hơn.",
    tip_advice_en:
      "Safe reporting frames: `Saya melihat...`, `Saya merasa curiga karena...`, `Lokasinya di...`, `Tolong dicek oleh satpam`. Avoid writing `pasti pencuri` without evidence; `mencurigakan` is safer and more polite.",
    vocabulary: [
      {
        cell_id: "6ab2702b-0ad3-45d6-88bd-6f52c47c080e",
        word: "laporan warga",
        en: "resident report",
        vi: "báo cáo/thông tin từ cư dân",
        pos: "noun phrase",
        pronunciation_vi: "la-PO-ran WAR-ga",
        pronunciation_en: "la-PO-ran WAR-ga",
      },
      {
        cell_id: "ae3ca06d-b667-4700-a3ce-4502ce860bd0",
        word: "curiga",
        en: "suspicious",
        vi: "nghi ngờ",
        pos: "adjective",
        pronunciation_vi: "cu-RI-ga",
        pronunciation_en: "choo-REE-ga",
      },
      {
        cell_id: "d7d755d4-2a3b-46e4-ae3b-c6ebf779d293",
        word: "mencurigakan",
        en: "suspicious-looking",
        vi: "đáng ngờ",
        pos: "adjective",
        pronunciation_vi: "men-cu-ri-GA-kan",
        pronunciation_en: "men-choo-ree-GA-kan",
      },
      {
        cell_id: "38d86aac-4f7d-4b5f-99cb-3f4178615dde",
        word: "orang asing",
        en: "stranger / foreigner",
        vi: "người lạ / người nước ngoài",
        pos: "noun phrase",
        pronunciation_vi: "O-rang A-sing",
        pronunciation_en: "O-rang A-sing",
      },
      {
        cell_id: "efd5fb47-c348-4e70-9f77-3ff2684f38ea",
        word: "bukti",
        en: "evidence",
        vi: "bằng chứng",
        pos: "noun",
        pronunciation_vi: "BUK-ti",
        pronunciation_en: "BOOK-tee",
      },
      {
        cell_id: "3ad513d4-eb46-4911-9981-b78f9b3504e3",
        word: "nomor darurat",
        en: "emergency number",
        vi: "số khẩn cấp",
        pos: "noun phrase",
        pronunciation_vi: "NO-mor da-RU-rat",
        pronunciation_en: "NO-mor da-ROO-rat",
      },
    ],
    dialogue: [
      {
        cell_id: "dc9b21b9-ff6e-4e4a-a3e4-a3ad22c29312",
        speaker: "Warga",
        text: "Pak, ada orang asing mondar-mandir di depan rumah saya.",
        vi: "Anh/bác ơi, có người lạ đi qua đi lại trước nhà tôi.",
        en: "Sir, there is a stranger pacing in front of my house.",
      },
      {
        cell_id: "2e08ab05-6a96-493e-b4b4-8971fd25afde",
        speaker: "Pak RT",
        text: "Apakah ada kejadian yang mencurigakan?",
        vi: "Có sự việc nào đáng ngờ không?",
        en: "Was there anything suspicious?",
      },
      {
        cell_id: "a811ad8c-a5c9-45ea-8d93-64a1a08f29c2",
        speaker: "Warga",
        text: "Saya merasa curiga karena motornya tidak ada pelat nomor.",
        vi: "Tôi thấy nghi vì xe máy của người đó không có biển số.",
        en: "I feel suspicious because the motorbike has no license plate.",
      },
      {
        cell_id: "2bb7191d-9ce6-4f9b-a113-5f08f99044ab",
        speaker: "Pak RT",
        text: "Baik, saya minta satpam cek lokasi. Jangan menuduh dulu.",
        vi: "Được, tôi sẽ nhờ bảo vệ kiểm tra địa điểm. Đừng buộc tội vội.",
        en: "Okay, I will ask security to check the location. Do not accuse anyone yet.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ/cụm từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word or phrase with its Vietnamese meaning:",
        items: [
          { prompt: "curiga", answer: "nghi ngờ" },
          { prompt: "laporan warga", answer: "báo cáo của cư dân" },
          { prompt: "bukti", answer: "bằng chứng" },
          { prompt: "nomor darurat", answer: "số khẩn cấp" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Chọn từ đúng:",
        instruction_en: "Choose the correct word:",
        items: [
          {
            prompt: "Saya merasa ___ karena motornya tidak ada pelat nomor. (nghi ngờ)",
            answer: "curiga",
            options: ["curiga", "cukup", "cepat"],
          },
          {
            prompt: "Jangan menuduh orang sebelum ada ___. (bằng chứng)",
            answer: "bukti",
            options: ["bukti", "buku", "baju"],
          },
          {
            prompt: "Kalau situasinya darurat, hubungi nomor ___. (khẩn cấp)",
            answer: "darurat",
            options: ["darurat", "diskon", "daftar"],
          },
        ],
      },
    ],
  },
];
