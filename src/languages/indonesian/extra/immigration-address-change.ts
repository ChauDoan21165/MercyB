// Immigration address change Indonesian lesson pack for Vietnamese learners.
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
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

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
  content?: string;
};

export const immigrationAddressChangeLessons: IndonesianLesson[] = [
  {
    id: "indonesian_immigration_address_change_notice",
    level: "B1",
    category: "bureaucracy",
    title_vi: "Báo đổi địa chỉ: lapor imigrasi và domisili baru",
    title_en: "Address change notice: reporting to immigration and new domicile",
    sentences: [
      {
        en: "Saya pindah alamat dan perlu lapor ke imigrasi.",
        vi: "Tôi chuyển địa chỉ và cần báo cho imigrasi.",
        pronunciation_focus: [
          "SA-ya PIN-dah A-la-mat dan per-LU LA-por ke i-mi-gra-si.",
          "`pindah alamat` = chuyển địa chỉ; `lapor ke imigrasi` = báo với cơ quan imigrasi.",
          "L1 Việt: `lapor` là động từ rất tự nhiên trong hành chính; đừng dịch thẳng thành câu quá dài.",
        ],
        pronunciation_focus_en: [
          "SA-ya PEEN-dah A-la-mat dan per-LOO LA-por ke ee-mee-gra-see.",
          "`pindah alamat` = move address; `lapor ke imigrasi` = report to immigration.",
          "VN-speaker note: `lapor` is a very natural administrative verb; do not over-literalize it into a long phrase.",
        ],
      },
      {
        en: "Apakah perubahan alamat ini perlu dicatat di KITAS saya?",
        vi: "Việc thay đổi địa chỉ này có cần ghi vào KITAS của tôi không?",
        pronunciation_focus: [
          "A-pa-kah per-ru-BA-han A-la-mat I-ni per-LU di-CA-tat di KEE-tas SA-ya.",
          "`perubahan alamat` = thay đổi địa chỉ; `dicatat` = được ghi nhận; `KITAS` đọc như một từ `KEE-tas`.",
          "L1 Việt: trong thủ tục cư trú, hỏi `perlu dicatat` nghe tự nhiên hơn `harus tulis`.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah per-roo-BA-han A-la-mat EE-ni per-LOO di-CHA-tat di KEE-tas SA-ya.",
          "`perubahan alamat` = address change; `dicatat` = recorded; `KITAS` is said as one word `KEE-tas`.",
          "VN-speaker note: in residence procedures, `perlu dicatat` sounds more natural than `harus tulis`.",
        ],
      },
      {
        en: "Saya sudah punya surat keterangan domisili baru.",
        vi: "Tôi đã có giấy xác nhận nơi cư trú mới.",
        pronunciation_focus: [
          "SA-ya SU-dah PU-nya SU-rat ke-te-RANG-an do-mi-SI-li BA-ru.",
          "`surat keterangan domisili` = giấy xác nhận nơi cư trú; `baru` = mới.",
          "L1 Việt: `domisili` là từ giấy tờ hành chính; đừng thay bằng `alamat tinggal` nếu đang nói về giấy chính thức.",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah POO-nya SOO-rat ke-te-RANG-an do-mi-SEE-li BA-roo.",
          "`surat keterangan domisili` = domicile/residence letter; `baru` = new.",
          "VN-speaker note: `domisili` is an administrative term; do not replace it with `alamat tinggal` when discussing an official document.",
        ],
      },
      {
        en: "Sponsor saya juga harus memberi tahu imigrasi.",
        vi: "Người bảo lãnh của tôi cũng phải thông báo cho imigrasi.",
        pronunciation_focus: [
          "SPON-sor SA-ya JU-ga HA-rus me-ME-ri TA-hu i-mi-gra-si.",
          "`sponsor` = bên bảo lãnh; `memberi tahu` = thông báo cho.",
          "L1 Việt: trong ngữ cảnh imigrasi, `sponsor` không phải nhà tài trợ, mà là người/công ty bảo lãnh.",
        ],
        pronunciation_focus_en: [
          "SPON-sor SA-ya JOO-ga HA-roos me-MEH-ree TA-hoo ee-mee-gra-see.",
          "`sponsor` = sponsoring party; `memberi tahu` = inform/tell.",
          "VN-speaker note: in immigration, `sponsor` does not mean donor; it means the sponsor or guarantor.",
        ],
      },
      {
        en: "Dokumen pendukung apa saja yang perlu saya bawa?",
        vi: "Tôi cần mang những giấy tờ hỗ trợ nào?",
        pronunciation_focus: [
          "do-ku-MEN pen-du-KUNG a-pa SA-ja yang per-LU SA-ya BA-wa.",
          "`dokumen pendukung` = giấy tờ bổ trợ; `apa saja` = những gì.",
          "L1 Việt: hỏi danh sách bằng `apa saja` rất tự nhiên; đừng chỉ hỏi `apa` nếu bạn muốn một danh sách đầy đủ.",
        ],
        pronunciation_focus_en: [
          "do-ku-MEN pen-du-KOONG a-pa SA-ja yang per-LOO SA-ya BA-wa.",
          "`dokumen pendukung` = supporting documents; `apa saja` = which items/what all.",
          "VN-speaker note: `apa saja` is the natural way to ask for a complete list.",
        ],
      },
      {
        en: "Saya ingin memastikan antrean dan jam layanan di loket itu.",
        vi: "Tôi muốn xác nhận hàng đợi và giờ làm việc ở quầy đó.",
        pronunciation_focus: [
          "SA-ya I-ngin me-mas-TI-kan an-TRE-an dan jam la-YA-nan di LO-ket i-tu.",
          "`antrean` = hàng đợi; `jam layanan` = giờ phục vụ; `loket` = quầy giao dịch.",
          "L1 Việt: `antre` là xếp hàng; trong hành chính, hỏi trước giờ và số thứ tự giúp tránh chờ lâu.",
        ],
        pronunciation_focus_en: [
          "SA-ya I-ngin me-mas-TEE-kan an-TRE-an dan jam la-YA-nan di LO-ket ee-TOO.",
          "`antrean` = queue/line; `jam layanan` = service hours; `loket` = service counter.",
          "VN-speaker note: asking about hours and queue order first helps avoid a long wait.",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong thủ tục imigrasi ở Indonesia, báo thay đổi địa chỉ thường cần đi kèm giấy tờ rõ ràng: alamat baru, surat keterangan domisili, KITAS hoặc giấy cư trú liên quan, và đôi khi cả surat dari sponsor. Nhiều nơi yêu cầu đến đúng giờ layanan, lấy nomor antrean, rồi nộp dokumen pendukung theo thứ tự. Nếu chưa chắc giấy nào cần cập nhật, nên hỏi trực tiếp petugas trước khi nộp.",
    cultural_notes_en:
      "In Indonesian immigration procedures, reporting an address change usually requires clear documents: the new address, a domicile letter, the relevant KITAS or residence document, and sometimes a letter from the sponsor. Many offices require you to come during service hours, take a queue number, and submit supporting documents in order. If you are unsure which document needs updating, ask the officer before submitting.",
    tip_advice_vi:
      "Khung câu hữu ích: `Saya pindah alamat...`, `Apakah perubahan alamat ini perlu dicatat di KITAS saya?`, `Dokumen pendukung apa saja yang perlu saya bawa?`. Người Việt nên nhớ `dicatat` = được ghi nhận; trong giấy tờ nhà nước, câu bị động thường nghe tự nhiên hơn.",
    tip_advice_en:
      "Useful frames: `Saya pindah alamat...`, `Apakah perubahan alamat ini perlu dicatat di KITAS saya?`, `Dokumen pendukung apa saja yang perlu saya bawa?`. Vietnamese speakers should remember `dicatat` = recorded; in government paperwork, passive sentences often sound more natural.",
    vocabulary: [
      { word: "pindah alamat", en: "move address", vi: "chuyển địa chỉ", pos: "verb phrase", pronunciation_vi: "PIN-dah A-la-mat", pronunciation_en: "PEEN-dah A-la-mat" },
      { word: "lapor ke imigrasi", en: "report to immigration", vi: "báo với imigrasi", pos: "verb phrase", pronunciation_vi: "LA-por ke i-mi-gra-si", pronunciation_en: "LA-por ke ee-mee-gra-see" },
      { word: "KITAS", en: "temporary stay permit", vi: "thẻ tạm trú", pos: "noun", pronunciation_vi: "KEE-tas", pronunciation_en: "KEE-tas" },
      { word: "domisili baru", en: "new domicile/residence", vi: "nơi cư trú mới", pos: "noun phrase", pronunciation_vi: "do-mi-SI-li BA-ru", pronunciation_en: "do-mi-SEE-li BA-roo" },
      { word: "surat keterangan", en: "statement letter / certificate", vi: "giấy xác nhận", pos: "noun phrase", pronunciation_vi: "SU-rat ke-te-RANG-an", pronunciation_en: "SOO-rat ke-te-RANG-an" },
      { word: "dokumen pendukung", en: "supporting documents", vi: "giấy tờ hỗ trợ", pos: "noun phrase", pronunciation_vi: "do-KU-men pen-du-KUNG", pronunciation_en: "do-KU-men pen-du-KOONG" },
      { word: "antrean", en: "queue / line", vi: "hàng đợi", pos: "noun", pronunciation_vi: "an-TRE-an", pronunciation_en: "an-TRE-an" },
    ],
    dialogue: [
      {
        speaker: "Pemohon",
        text: "Selamat pagi. Saya pindah alamat dan perlu lapor ke imigrasi.",
        vi: "Chào buổi sáng. Tôi chuyển địa chỉ và cần báo cho imigrasi.",
        en: "Good morning. I moved address and need to report to immigration.",
      },
      {
        speaker: "Petugas",
        text: "Baik. Apakah perubahan alamat ini sudah dicatat di KITAS Anda?",
        vi: "Được. Việc thay đổi địa chỉ này đã được ghi trên KITAS của anh/chị chưa?",
        en: "Okay. Has this address change already been recorded on your KITAS?",
      },
      {
        speaker: "Pemohon",
        text: "Belum. Saya sudah punya surat keterangan domisili baru.",
        vi: "Chưa. Tôi đã có giấy xác nhận nơi cư trú mới.",
        en: "Not yet. I already have a new domicile letter.",
      },
      {
        speaker: "Petugas",
        text: "Silakan ambil nomor antrean dan siapkan dokumen pendukung.",
        vi: "Mời lấy số thứ tự và chuẩn bị giấy tờ hỗ trợ.",
        en: "Please take a queue number and prepare the supporting documents.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "pindah alamat", answer: "chuyển địa chỉ" },
          { prompt: "surat keterangan domisili", answer: "giấy xác nhận nơi cư trú" },
          { prompt: "dokumen pendukung", answer: "giấy tờ hỗ trợ" },
          { prompt: "antrean", answer: "hàng đợi" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi chuyển địa chỉ và cần báo cho imigrasi.", answer: "Saya pindah alamat dan perlu lapor ke imigrasi." },
          { prompt: "Tôi đã có giấy xác nhận nơi cư trú mới.", answer: "Saya sudah punya surat keterangan domisili baru." },
          { prompt: "Tôi muốn xác nhận hàng đợi và giờ làm việc ở quầy đó.", answer: "Saya ingin memastikan antrean dan jam layanan di loket itu." },
        ],
      },
    ],
  },
  {
    id: "indonesian_immigration_address_change_followup",
    level: "B2",
    category: "bureaucracy",
    title_vi: "Theo dõi hồ sơ: sponsor, dokumen và kết quả",
    title_en: "Following up on the case: sponsor, documents, and outcome",
    sentences: [
      {
        en: "Saya ingin menanyakan status laporan perubahan alamat saya.",
        vi: "Tôi muốn hỏi trạng thái báo cáo thay đổi địa chỉ của tôi.",
        pronunciation_focus: [
          "SA-ya I-ngin me-na-nya-kan STA-tus la-PO-ran per-ru-BA-han A-la-mat SA-ya.",
          "`menanyakan status` = hỏi trạng thái; `laporan perubahan alamat` = báo cáo thay đổi địa chỉ.",
          "L1 Việt: dùng `status` rất tự nhiên trong hồ sơ; đừng chỉ hỏi `sudah atau belum` nếu bạn cần theo dõi chính thức.",
        ],
        pronunciation_focus_en: [
          "SA-ya I-ngin me-na-NYA-kan STA-tus la-PO-ran per-roo-BA-han A-la-mat SA-ya.",
          "`menanyakan status` = ask for the status; `laporan perubahan alamat` = address-change report.",
          "VN-speaker note: `status` is very natural for case tracking; do not only ask `already or not` if you need an official follow-up.",
        ],
      },
      {
        en: "Sponsor saya sudah mengirim surat pendukung ke kantor.",
        vi: "Người bảo lãnh của tôi đã gửi thư hỗ trợ đến văn phòng.",
        pronunciation_focus: [
          "SPON-sor SA-ya SU-dah me-NGIR-im SU-rat pen-du-KUNG ke KAN-tor.",
          "`surat pendukung` = thư hỗ trợ; `ke kantor` = đến văn phòng.",
          "L1 Việt: `mengirim` là gửi, không phải mang trực tiếp. Nếu email, vẫn bisa `mengirim surat`.",
        ],
        pronunciation_focus_en: [
          "SPON-sor SA-ya SOO-dah me-NGEER-im SOO-rat pen-du-KOONG ke KAN-tor.",
          "`surat pendukung` = supporting letter; `ke kantor` = to the office.",
          "VN-speaker note: `mengirim` means send, not physically bring. It still works for email: `mengirim surat`.",
        ],
      },
      {
        en: "Dokumen saya sudah lengkap, tetapi saya masih menunggu keputusan.",
        vi: "Giấy tờ của tôi đã đầy đủ, nhưng tôi vẫn đang chờ quyết định.",
        pronunciation_focus: [
          "do-ku-MEN SA-ya SU-dah leng-KAP, te-ta-pi SA-ya ma-sih me-NUNG-gu ke-pu-TUS-an.",
          "`lengkap` = đầy đủ; `keputusan` = quyết định.",
          "L1 Việt: khi cần lịch sự, dùng `masih menunggu keputusan` thay vì thúc ép quá mạnh.",
        ],
        pronunciation_focus_en: [
          "do-ku-MEN SA-ya SOO-dah leng-KAP, te-ta-pee SA-ya MA-sih me-NOONG-goo ke-poo-TOO-san.",
          "`lengkap` = complete; `keputusan` = decision.",
          "VN-speaker note: to sound polite, use `masih menunggu keputusan` instead of pushing too hard.",
        ],
      },
      {
        en: "Jika ada kekurangan, mohon beri tahu saya secepatnya.",
        vi: "Nếu có thiếu sót, xin hãy báo cho tôi sớm nhất có thể.",
        pronunciation_focus: [
          "JI-ka A-da ke-ku-RANG-an, MO-hon BE-ri TA-hu SA-ya se-ce-pat-NYA.",
          "`kekurangan` = thiếu sót/thiếu phần nào; `secepatnya` = càng sớm càng tốt.",
          "L1 Việt: `mohon` làm câu mềm hơn; rất hữu ích khi hỏi bổ sung hồ sơ.",
        ],
        pronunciation_focus_en: [
          "JI-ka A-da ke-ku-RANG-an, MO-hon BEH-ree TA-hoo SA-ya se-che-pat-NYA.",
          "`kekurangan` = missing item/deficiency; `secepatnya` = as soon as possible.",
          "VN-speaker note: `mohon` softens the sentence; very useful when asking to complete documents.",
        ],
      },
      {
        en: "Saya akan datang lagi setelah nomor antrean saya dipanggil.",
        vi: "Tôi sẽ đến lại sau khi số thứ tự của tôi được gọi.",
        pronunciation_focus: [
          "SA-ya A-kan DA-tang LA-gi se-te-LAH NO-mor an-TRE-an SA-ya di-PANG-gil.",
          "`dipanggil` = được gọi lên; `setelah` = sau khi.",
          "L1 Việt: `nomor antrean dipanggil` là cụm rất thường dùng ở kantor imigrasi; nhớ cấu trúc bị động `di-`.",
        ],
        pronunciation_focus_en: [
          "SA-ya A-kan DA-tang LA-gee se-te-LAH NO-mor an-TRE-an SA-ya di-PANG-geel.",
          "`dipanggil` = called; `setelah` = after.",
          "VN-speaker note: `nomor antrean dipanggil` is a common immigration-office phrase; remember the passive `di-` form.",
        ],
      },
      {
        en: "Apakah hasilnya bisa dikirim ke email sponsor saya?",
        vi: "Kết quả có thể gửi đến email của người bảo lãnh tôi không?",
        pronunciation_focus: [
          "A-pa-kah ha-SIL-nya BI-sa di-KI-rim ke i-MEL SPON-sor SA-ya.",
          "`hasilnya` = kết quả đó; `email sponsor` = email của bên bảo lãnh.",
          "L1 Việt: `bisa dikirim` là bị động tự nhiên trong hành chính; không cần nói `saya kirim sendiri` nếu muốn họ gửi.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah ha-SEEL-nya BEE-sa di-KEE-rim ke EE-mail SPON-sor SA-ya.",
          "`hasilnya` = the result; `email sponsor` = sponsor's email.",
          "VN-speaker note: `bisa dikirim` is a natural passive in admin contexts; you do not need `saya kirim sendiri` if you want them to send it.",
        ],
      },
    ],
    cultural_notes_vi:
      "Làm việc với imigrasi ở Indonesia thường cần sự kiên nhẫn: lấy nomor antrean, chờ dipanggil, lalu serahkan dokumen lengkap. Nếu ada sponsor atau perusahaan yang bertanggung jawab, hãy giữ tất cả surat pendukung dan email konfirmasi. Đừng giả định mọi nơi cập nhật KITAS tự động; hỏi rõ apakah perubahan alamat cần dicatat, siapa yang mengirim hasil, và kapan bisa diambil.",
    cultural_notes_en:
      "Working with immigration in Indonesia usually requires patience: take a queue number, wait to be called, then submit complete documents. If there is a sponsor or company responsible, keep all supporting letters and confirmation emails. Do not assume every office updates the KITAS automatically; ask clearly whether the address change must be recorded, who sends the result, and when it can be collected.",
    tip_advice_vi:
      "Câu khung rất hữu dụng: `Saya pindah alamat...`, `Apakah perlu dicatat di KITAS?`, `Dokumen pendukung apa saja?`, `Kapan nomor antrean saya dipanggil?`. Người Việt nên chú ý `dicatat`, `dipanggil`, `dikirim` là các dạng bị động thường gặp.",
    tip_advice_en:
      "Very useful frames: `Saya pindah alamat...`, `Apakah perlu dicatat di KITAS?`, `Dokumen pendukung apa saja?`, `Kapan nomor antrean saya dipanggil?`. Vietnamese speakers should note that `dicatat`, `dipanggil`, and `dikirim` are common passive forms.",
    vocabulary: [
      { word: "lapor ke imigrasi", en: "report to immigration", vi: "báo với imigrasi", pos: "verb phrase", pronunciation_vi: "LA-por ke i-mi-gra-si", pronunciation_en: "LA-por ke ee-mee-gra-see" },
      { word: "perubahan alamat", en: "address change", vi: "thay đổi địa chỉ", pos: "noun phrase", pronunciation_vi: "per-ru-BA-han A-la-mat", pronunciation_en: "per-roo-BA-han A-la-mat" },
      { word: "surat keterangan domisili", en: "domicile letter", vi: "giấy xác nhận nơi cư trú", pos: "noun phrase", pronunciation_vi: "SU-rat ke-te-RANG-an do-mi-SI-li", pronunciation_en: "SOO-rat ke-te-RANG-an do-mi-SEE-li" },
      { word: "dokumen pendukung", en: "supporting documents", vi: "giấy tờ hỗ trợ", pos: "noun phrase", pronunciation_vi: "do-KU-men pen-du-KUNG", pronunciation_en: "do-KU-men pen-du-KOONG" },
      { word: "antrean", en: "queue / line", vi: "hàng đợi", pos: "noun", pronunciation_vi: "an-TRE-an", pronunciation_en: "an-TRE-an" },
      { word: "dipanggil", en: "called up / summoned", vi: "được gọi lên", pos: "verb / passive", pronunciation_vi: "di-PANG-gil", pronunciation_en: "di-PANG-geel" },
      { word: "hasil", en: "result", vi: "kết quả", pos: "noun", pronunciation_vi: "ha-SIL", pronunciation_en: "ha-SEEL" },
    ],
    dialogue: [
      {
        speaker: "Pemohon",
        text: "Selamat pagi. Saya ingin menanyakan status laporan perubahan alamat saya.",
        vi: "Chào buổi sáng. Tôi muốn hỏi trạng thái báo cáo thay đổi địa chỉ của tôi.",
        en: "Good morning. I would like to ask about the status of my address-change report.",
      },
      {
        speaker: "Petugas",
        text: "Baik. Apakah perubahan alamat ini sudah dicatat di KITAS Anda?",
        vi: "Được. Việc thay đổi địa chỉ này đã được ghi trên KITAS của anh/chị chưa?",
        en: "Okay. Has this address change been recorded on your KITAS?",
      },
      {
        speaker: "Pemohon",
        text: "Belum. Sponsor saya sudah mengirim surat pendukung ke kantor.",
        vi: "Chưa. Người bảo lãnh của tôi đã gửi thư hỗ trợ đến văn phòng.",
        en: "Not yet. My sponsor has already sent a supporting letter to the office.",
      },
      {
        speaker: "Petugas",
        text: "Silakan tunggu sampai nomor antrean Anda dipanggil.",
        vi: "Mời chờ đến khi số thứ tự của anh/chị được gọi.",
        en: "Please wait until your queue number is called.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ phù hợp về hồ sơ imigrasi:",
        instruction_en: "Fill in the suitable immigration-document word:",
        items: [
          {
            prompt: "Saya pindah alamat dan perlu ___ ke imigrasi. (báo)",
            answer: "lapor",
            options: ["lapor", "lari", "lupa"],
          },
          {
            prompt: "Apakah perubahan alamat ini perlu ___ di KITAS saya? (ghi lại)",
            answer: "dicatat",
            options: ["dicatat", "dibuka", "ditutup"],
          },
          {
            prompt: "Saya menunggu nomor antrean saya ___. (được gọi)",
            answer: "dipanggil",
            options: ["dipanggil", "dipakai", "diperbaiki"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi chuyển địa chỉ và cần báo cho imigrasi.", answer: "Saya pindah alamat dan perlu lapor ke imigrasi." },
          { prompt: "Tôi muốn biết giấy tờ hỗ trợ nào cần mang theo.", answer: "Saya ingin tahu dokumen pendukung apa saja yang perlu saya bawa." },
          { prompt: "Kết quả có thể gửi đến email của người bảo lãnh tôi không?", answer: "Apakah hasilnya bisa dikirim ke email sponsor saya?" },
        ],
      },
    ],
  },
];
