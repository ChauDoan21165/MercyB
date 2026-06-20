// Court & Legal Help Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson following the established Indonesian lesson shape.
// Field convention: sentence `en` is the TARGET-LANGUAGE text (Indonesian), and
// `vi` is the Vietnamese gloss. `pronunciation_focus` gives Vietnamese L1 notes;
// `pronunciation_focus_en` is the English companion in the same order.

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

export type IndonesianExercise = Record<string, any>;

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
    id: "indonesian_court_legal_help",
    level: "B1",
    category: "legal",
    title_vi: "Tòa án và hỗ trợ pháp lý bằng tiếng Indonesia",
    title_en: "Court and legal help Indonesian",
    sentences: [
      {
        en: "Saya perlu konsultasi hukum dengan pengacara.",
        vi: "Tôi cần tư vấn pháp luật với luật sư.",
        pronunciation_focus: [
          "SA-ya per-LU kon-sul-TA-si HU-kum de-NGAN pe-nga-CA-ra - `konsultasi hukum` = tư vấn pháp luật; `pengacara` = luật sư.",
          "Lỗi người Việt: đọc `pengacara` như pe-nga-ka-ra. Chữ `c` trong Indonesia = 'ch': pe-nga-CHA-ra.",
          "Luyện: `Saya perlu konsultasi hukum dengan pengacara.`",
        ],
        pronunciation_focus_en: [
          "SA-ya per-LU kon-sool-TA-see HU-kum de-NGAN pe-nga-CHA-ra - `konsultasi hukum` = legal consultation; `pengacara` = lawyer.",
          "VN-speaker trap: reading `pengacara` as pe-nga-ka-ra. Indonesian `c` = 'ch': pe-nga-CHA-ra.",
          "Drill: `Saya perlu konsultasi hukum dengan pengacara.`",
        ],
      },
      {
        en: "Saya mendapat panggilan sidang minggu depan.",
        vi: "Tôi nhận được giấy/ thông báo gọi ra phiên tòa tuần sau.",
        pronunciation_focus: [
          "SA-ya men-DA-pat pang-GIL-an SI-dang MING-gu de-PAN - `panggilan sidang` = lệnh/thông báo mời ra phiên tòa; `sidang` = phiên tòa/phiên họp.",
          "Lỗi người Việt: dùng `rapat` cho tòa. Với tòa án, dùng `sidang`, không dùng `rapat`.",
          "Luyện: `Saya mendapat panggilan sidang minggu depan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya men-DA-pat pang-GIL-an SEE-dang MING-goo de-PAN - `panggilan sidang` = court summons/hearing notice; `sidang` = court hearing/session.",
          "VN-speaker trap: using `rapat` for court. In court, use `sidang`, not `rapat`.",
          "Drill: `Saya mendapat panggilan sidang minggu depan.`",
        ],
      },
      {
        en: "Bukti apa saja yang harus saya bawa?",
        vi: "Tôi phải mang những bằng chứng nào?",
        pronunciation_focus: [
          "BUK-ti A-pa SA-ja yang HA-rus SA-ya BA-wa - `bukti` = bằng chứng; `apa saja` = những gì/nào.",
          "Lỗi người Việt: hỏi `apa bukti` nghe thiếu. Hỏi danh sách bằng `bukti apa saja`.",
          "Luyện: `Bukti apa saja yang harus saya bawa?`",
        ],
        pronunciation_focus_en: [
          "BUK-tee A-pa SA-ja yang HA-rus SA-ya BA-wa - `bukti` = evidence; `apa saja` = which things/what all.",
          "VN-speaker trap: asking clipped `apa bukti`. For a list, ask `bukti apa saja`.",
          "Drill: `Bukti apa saja yang harus saya bawa?`",
        ],
      },
      {
        en: "Apakah saksi perlu hadir di sidang?",
        vi: "Nhân chứng có cần có mặt tại phiên tòa không?",
        pronunciation_focus: [
          "a-pa-KAH SAK-si per-LU HA-dir di SI-dang - `saksi` = nhân chứng; `hadir` = có mặt/tham dự.",
          "Lỗi người Việt: nói `datang di sidang`. Với ngữ cảnh trang trọng, `hadir di sidang` tự nhiên hơn.",
          "Luyện: `Apakah saksi perlu hadir di sidang?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH SAK-see per-LU HA-dir di SEE-dang - `saksi` = witness; `hadir` = be present/attend.",
          "VN-speaker trap: saying `datang di sidang`. In a formal context, `hadir di sidang` is more natural.",
          "Drill: `Apakah saksi perlu hadir di sidang?`",
        ],
      },
      {
        en: "Saya ingin membuat surat kuasa.",
        vi: "Tôi muốn làm giấy ủy quyền.",
        pronunciation_focus: [
          "SA-ya I-ngin mem-BU-at SU-rat KU-a-sa - `surat kuasa` = giấy ủy quyền; `membuat` = làm/lập.",
          "Lỗi người Việt: dịch `giấy quyền` từng chữ. Cụm pháp lý đúng là `surat kuasa`.",
          "Luyện: `Saya ingin membuat surat kuasa.`",
        ],
        pronunciation_focus_en: [
          "SA-ya I-ngin mem-BOO-at SU-rat KU-a-sa - `surat kuasa` = power of attorney/authorization letter; `membuat` = make/draft.",
          "VN-speaker trap: translating 'authorization paper' word for word. The legal phrase is `surat kuasa`.",
          "Drill: `Saya ingin membuat surat kuasa.`",
        ],
      },
      {
        en: "Berapa biaya jasa pengacara untuk kasus ini?",
        vi: "Phí dịch vụ luật sư cho vụ này là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa BI-a-ya JA-sa pe-nga-CA-ra un-TUK KA-sus I-ni - `biaya jasa` = phí dịch vụ; `kasus` = vụ việc.",
          "Lỗi người Việt: nói `harga pengacara`. Lịch sự và chính xác hơn là `biaya jasa pengacara`.",
          "Luyện: `Berapa biaya jasa pengacara untuk kasus ini?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa bee-A-ya JA-sa pe-nga-CHA-ra un-TUK KA-sus I-ni - `biaya jasa` = service fee; `kasus` = case.",
          "VN-speaker trap: saying `harga pengacara`. More polite and precise: `biaya jasa pengacara`.",
          "Drill: `Berapa biaya jasa pengacara untuk kasus ini?`",
        ],
      },
      {
        en: "Apakah kasus ini bisa diselesaikan lewat mediasi?",
        vi: "Vụ này có thể giải quyết qua hòa giải không?",
        pronunciation_focus: [
          "a-pa-KAH KA-sus I-ni BI-sa di-se-le-SAI-kan LE-wat me-di-A-si - `diselesaikan` = được giải quyết; `mediasi` = hòa giải.",
          "Lỗi người Việt: né bị động. Văn phong pháp lý rất hay dùng `di-`: `diselesaikan`, `diproses`, `ditolak`.",
          "Luyện: `Apakah kasus ini bisa diselesaikan lewat mediasi?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH KA-sus I-ni BI-sa di-se-le-SAI-kan LE-wat me-dee-A-see - `diselesaikan` = be resolved; `mediasi` = mediation.",
          "VN-speaker trap: avoiding the passive. Legal Indonesian often uses `di-`: `diselesaikan`, `diproses`, `ditolak`.",
          "Drill: `Apakah kasus ini bisa diselesaikan lewat mediasi?`",
        ],
      },
      {
        en: "Saya belum mengerti isi surat ini.",
        vi: "Tôi chưa hiểu nội dung lá thư/giấy này.",
        pronunciation_focus: [
          "SA-ya be-LUM me-NGER-ti I-si SU-rat I-ni - `belum mengerti` = chưa hiểu; `isi surat` = nội dung văn bản/thư.",
          "Lỗi người Việt: dùng `tidak mengerti` khi còn muốn nhờ giải thích. `Belum` mềm hơn: chưa hiểu nhưng có thể hiểu sau.",
          "Luyện: `Saya belum mengerti isi surat ini.`",
        ],
        pronunciation_focus_en: [
          "SA-ya be-LUM me-NGER-tee I-si SU-rat I-ni - `belum mengerti` = do not yet understand; `isi surat` = contents of this document/letter.",
          "VN-speaker trap: using `tidak mengerti` when you still want help. `Belum` is softer: not yet understood, but can be explained.",
          "Drill: `Saya belum mengerti isi surat ini.`",
        ],
      },
      {
        en: "Mohon jelaskan hak dan kewajiban saya.",
        vi: "Xin giải thích quyền và nghĩa vụ của tôi.",
        pronunciation_focus: [
          "MO-hon je-LAS-kan HAK dan ke-wa-JI-ban SA-ya - `hak` = quyền; `kewajiban` = nghĩa vụ; `mohon` = xin vui lòng.",
          "Lỗi người Việt: nói `hak dan harus saya`. Cặp pháp lý chuẩn là `hak dan kewajiban`.",
          "Luyện: `Mohon jelaskan hak dan kewajiban saya.`",
        ],
        pronunciation_focus_en: [
          "MO-hon je-LAS-kan HAK dan ke-wa-JI-ban SA-ya - `hak` = right; `kewajiban` = obligation; `mohon` = please.",
          "VN-speaker trap: saying `hak dan harus saya`. The legal pair is `hak dan kewajiban`.",
          "Drill: `Mohon jelaskan hak dan kewajiban saya.`",
        ],
      },
      {
        en: "Saya ingin semua kesepakatan dibuat tertulis.",
        vi: "Tôi muốn mọi thỏa thuận được lập thành văn bản.",
        pronunciation_focus: [
          "SA-ya I-ngin se-MU-a ke-se-PA-ka-tan di-BU-at ter-TU-lis - `kesepakatan` = thỏa thuận; `tertulis` = bằng văn bản.",
          "Lỗi người Việt: tin lời nói miệng trong việc pháp lý. Hãy dùng `dibuat tertulis` để yêu cầu văn bản.",
          "Luyện: `Saya ingin semua kesepakatan dibuat tertulis.`",
        ],
        pronunciation_focus_en: [
          "SA-ya I-ngin se-MU-a ke-se-PA-ka-tan di-BU-at ter-TU-lis - `kesepakatan` = agreement; `tertulis` = written.",
          "VN-speaker trap: relying on verbal promises in legal matters. Use `dibuat tertulis` to request a written record.",
          "Drill: `Saya ingin semua kesepakatan dibuat tertulis.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong bối cảnh pháp lý Indonesia, giọng nói nên trang trọng: dùng `saya`, `Bapak/Ibu`, `mohon`, `ingin`, và tránh `aku/kamu/gue/lu`. `Pengacara` là luật sư; `konsultasi hukum` là tư vấn pháp luật; `sidang` là phiên tòa/phiên xử; `bukti` và `saksi` là hai trụ cột thường được hỏi. `Surat kuasa` cho phép người khác đại diện bạn trong phạm vi nhất định. Nhiều tranh chấp dân sự/lao động/gia đình có thể được khuyến khích `mediasi` trước khi đi sâu vào phiên tòa. Với giấy tờ pháp lý, nên xin bản viết và hỏi rõ phí dịch vụ.",
    cultural_notes_en:
      "In Indonesian legal settings, keep the register formal: use `saya`, `Bapak/Ibu`, `mohon`, `ingin`, and avoid `aku/kamu/gue/lu`. `Pengacara` is a lawyer; `konsultasi hukum` is legal consultation; `sidang` is a court hearing; `bukti` and `saksi` are two core things often requested. A `surat kuasa` lets someone represent you within a defined scope. Many civil, labor, or family disputes may be encouraged toward `mediasi` before deeper court proceedings. For legal paperwork, ask for written records and clear service fees.",
    tip_advice_vi:
      "Mẹo cho người Việt: tiếng pháp lý Indonesia hay dùng danh từ trừu tượng và bị động `di-`: `konsultasi`, `kewajiban`, `kesepakatan`, `diselesaikan`, `dibuat tertulis`. Đừng dịch từng chữ từ tiếng Việt. Học theo cụm: `konsultasi hukum`, `panggilan sidang`, `membawa bukti`, `saksi hadir`, `surat kuasa`, `biaya jasa pengacara`, `lewat mediasi`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: Indonesian legal language often uses abstract nouns and the `di-` passive: `konsultasi`, `kewajiban`, `kesepakatan`, `diselesaikan`, `dibuat tertulis`. Do not translate word by word from Vietnamese. Learn chunks: `konsultasi hukum`, `panggilan sidang`, `membawa bukti`, `saksi hadir`, `surat kuasa`, `biaya jasa pengacara`, `lewat mediasi`.",
    vocabulary: [
      {
        word: "pengacara",
        en: "lawyer",
        vi: "luật sư",
        pos: "noun",
        pronunciation_vi: "pe-nga-CHA-ra",
        pronunciation_en: "pe-nga-CHA-ra",
      },
      {
        word: "sidang",
        en: "court hearing / session",
        vi: "phiên tòa / phiên họp",
        pos: "noun",
        pronunciation_vi: "SI-dang",
        pronunciation_en: "SEE-dang",
      },
      {
        word: "bukti",
        en: "evidence",
        vi: "bằng chứng",
        pos: "noun",
        pronunciation_vi: "BUK-ti",
        pronunciation_en: "BUK-tee",
      },
      {
        word: "saksi",
        en: "witness",
        vi: "nhân chứng",
        pos: "noun",
        pronunciation_vi: "SAK-si",
        pronunciation_en: "SAK-see",
      },
      {
        word: "surat kuasa",
        en: "power of attorney / authorization letter",
        vi: "giấy ủy quyền",
        pos: "noun phrase",
        pronunciation_vi: "SU-rat KU-a-sa",
        pronunciation_en: "SOO-rat KOO-a-sa",
      },
      {
        word: "konsultasi hukum",
        en: "legal consultation",
        vi: "tư vấn pháp luật",
        pos: "noun phrase",
        pronunciation_vi: "kon-sul-TA-si HU-kum",
        pronunciation_en: "kon-sool-TA-see HOO-koom",
      },
      {
        word: "biaya jasa",
        en: "service fee",
        vi: "phí dịch vụ",
        pos: "noun phrase",
        pronunciation_vi: "BI-a-ya JA-sa",
        pronunciation_en: "bee-AH-ya JAH-sa",
      },
      {
        word: "mediasi",
        en: "mediation",
        vi: "hòa giải",
        pos: "noun",
        pronunciation_vi: "me-di-A-si",
        pronunciation_en: "me-dee-A-see",
      },
      {
        word: "hak dan kewajiban",
        en: "rights and obligations",
        vi: "quyền và nghĩa vụ",
        pos: "noun phrase",
        pronunciation_vi: "HAK dan ke-wa-JI-ban",
        pronunciation_en: "HAK dan ke-wa-JEE-ban",
      },
      {
        word: "kesepakatan tertulis",
        en: "written agreement",
        vi: "thỏa thuận bằng văn bản",
        pos: "noun phrase",
        pronunciation_vi: "ke-se-PA-ka-tan ter-TU-lis",
        pronunciation_en: "ke-se-PA-ka-tan ter-TOO-lis",
      },
    ],
    dialogue: [
      {
        speaker: "Klien",
        text: "Selamat siang, Pak. Saya perlu konsultasi hukum.",
        vi: "Chào buổi trưa anh/chú. Tôi cần tư vấn pháp luật.",
        en: "Good afternoon, sir. I need a legal consultation.",
      },
      {
        speaker: "Pengacara",
        text: "Baik. Apakah Anda sudah menerima panggilan sidang?",
        vi: "Được. Anh/chị đã nhận giấy gọi ra phiên tòa chưa?",
        en: "Okay. Have you received a court summons?",
      },
      {
        speaker: "Klien",
        text: "Sudah. Bukti apa saja yang harus saya bawa?",
        vi: "Rồi. Tôi phải mang những bằng chứng nào?",
        en: "Yes. What evidence should I bring?",
      },
      {
        speaker: "Pengacara",
        text: "Bawa semua dokumen asli dan saksi jika ada.",
        vi: "Mang tất cả giấy tờ gốc và nhân chứng nếu có.",
        en: "Bring all original documents and witnesses if any.",
      },
      {
        speaker: "Klien",
        text: "Berapa biaya jasa pengacara untuk mediasi?",
        vi: "Phí dịch vụ luật sư cho hòa giải là bao nhiêu?",
        en: "How much is the lawyer's service fee for mediation?",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya perlu konsultasi hukum dengan ____.`",
        prompt_en: "Fill in the blank: `Saya perlu konsultasi hukum dengan ____.`",
        answer: "pengacara",
        explanation_vi: "`pengacara` = luật sư.",
        explanation_en: "`pengacara` = lawyer.",
      },
      {
        type: "multiple_choice",
        prompt_vi: "`Surat kuasa` nghĩa là gì?",
        prompt_en: "What does `surat kuasa` mean?",
        choices: ["giấy ủy quyền", "vé tòa án", "hóa đơn phí dịch vụ"],
        answer: "giấy ủy quyền",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: `Vụ này có thể giải quyết qua hòa giải không?`",
        prompt_en: "Translate into Indonesian: `Can this case be resolved through mediation?`",
        answer: "Apakah kasus ini bisa diselesaikan lewat mediasi?",
      },
      {
        type: "matching",
        prompt_vi: "Ghép đúng các từ pháp lý.",
        prompt_en: "Match the legal terms correctly.",
        pairs: [
          ["bukti", "evidence / bằng chứng"],
          ["saksi", "witness / nhân chứng"],
          ["sidang", "court hearing / phiên tòa"],
        ],
      },
    ],
  },
];
