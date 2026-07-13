// Environmental Noise & Pollution Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson. Field convention follows the Indonesian extra
// pack: sentence `en` holds TARGET-LANGUAGE Indonesian, `vi` holds Vietnamese,
// Vietnamese L1 notes live in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en` with the same order.

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

export const environmentalNoisePollutionLessons: IndonesianLesson[] = [
  {
    id: "indonesian_noise_smell_resident_complaint",
    level: "A2",
    category: "community",
    title_vi: "Phàn nàn về tiếng ồn và mùi khó chịu",
    title_en: "Complaining about noise and bad smells",
    sentences: [
      {
        en: "Polusi suara dari proyek itu sangat mengganggu.",
        vi: "Ô nhiễm tiếng ồn từ công trình đó rất gây phiền.",
        pronunciation_focus: [
          "po-LU-si SU-a-ra da-ri PRO-yek I-tu SA-ngat meng-GANG-gu — `polusi suara` = ô nhiễm tiếng ồn; `mengganggu` = làm phiền.",
          "Lỗi người Việt: dịch 'ồn' chỉ thành `ramai`. `Ramai` = đông/vui/nhộn; tiếng ồn gây hại dùng `bising` hoặc `polusi suara`.",
          "Luyện: `Polusi suara itu sangat mengganggu.`",
        ],
        pronunciation_focus_en: [
          "po-LOO-si SOO-a-ra da-ri PRO-yek EE-tu SA-ngat meng-GANG-gu — `polusi suara` = noise pollution; `mengganggu` = disturbing.",
          "VN-speaker trap: translating 'noisy' only as `ramai`. `Ramai` means crowded/lively; harmful noise is `bising` or `polusi suara`.",
          "Drill: `Polusi suara itu sangat mengganggu.`",
        ],
      },
      {
        en: "Ada bau tidak sedap dari saluran air belakang rumah.",
        vi: "Có mùi khó chịu từ cống nước phía sau nhà.",
        pronunciation_focus: [
          "A-da bau TI-dak SE-dap da-ri sa-LU-ran A-ir be-LA-kang RU-mah — `bau tidak sedap` = mùi khó chịu; `saluran air` = cống/kênh thoát nước.",
          "Lỗi người Việt: dùng `bau jelek` theo kiểu dịch thẳng. Cụm tự nhiên hơn là `bau tidak sedap`.",
          "Luyện: `Ada bau tidak sedap dari saluran air.`",
        ],
        pronunciation_focus_en: [
          "A-da bau TEE-dak SE-dap da-ri sa-LOO-ran A-ir be-LA-kang ROO-mah — `bau tidak sedap` = bad/unpleasant smell; `saluran air` = drain/water channel.",
          "VN-speaker trap: saying literal `bau jelek`. The natural phrase is `bau tidak sedap`.",
          "Drill: `Ada bau tidak sedap dari saluran air.`",
        ],
      },
      {
        en: "Limbah dari warung itu dibuang sembarangan.",
        vi: "Rác thải/nước thải từ quán đó bị xả bừa bãi.",
        pronunciation_focus: [
          "LIM-bah da-ri WA-rung I-tu di-BU-ang sem-ba-RA-ngan — `limbah` = chất thải; `dibuang sembarangan` = bị vứt/xả bừa bãi.",
          "Lỗi người Việt: gọi mọi loại rác là `sampah`. `Sampah` là rác nói chung; `limbah` dùng cho chất thải, nhất là từ kinh doanh/sản xuất.",
          "Luyện: `Limbah dibuang sembarangan.`",
        ],
        pronunciation_focus_en: [
          "LIM-bah da-ri WA-roong EE-tu di-BOO-ang sem-ba-RA-ngan — `limbah` = waste; `dibuang sembarangan` = dumped carelessly.",
          "VN-speaker trap: calling all waste `sampah`. `Sampah` is general trash; `limbah` is waste, especially from businesses or production.",
          "Drill: `Limbah dibuang sembarangan.`",
        ],
      },
      {
        en: "Warga sudah komplain karena suara mesin terlalu keras.",
        vi: "Người dân đã phàn nàn vì tiếng máy quá lớn.",
        pronunciation_focus: [
          "WAR-ga SU-dah kom-PLAIN ka-RE-na SU-a-ra ME-sin ter-LA-lu KE-ras — `warga` = cư dân/người dân; `terlalu keras` = quá to.",
          "Lỗi người Việt: dùng `besar` cho âm thanh. Âm lượng nói `keras`, không phải `besar`.",
          "Luyện: `Suara mesin terlalu keras.`",
        ],
        pronunciation_focus_en: [
          "WAR-ga SOO-dah kom-PLAIN ka-RE-na SOO-a-ra ME-sin ter-LA-lu KE-ras — `warga` = residents; `terlalu keras` = too loud.",
          "VN-speaker trap: using `besar` for sound volume. For loudness, use `keras`, not `besar`.",
          "Drill: `Suara mesin terlalu keras.`",
        ],
      },
      {
        en: "Kami ingin mencari solusi yang baik untuk semua pihak.",
        vi: "Chúng tôi muốn tìm giải pháp tốt cho mọi bên.",
        pronunciation_focus: [
          "KA-mi I-ngin men-CA-ri so-LU-si yang BA-ik un-TUK se-MU-a PI-hak — `solusi` = giải pháp; `semua pihak` = mọi bên.",
          "Lỗi người Việt: trong khi phàn nàn chỉ nói lỗi của bên kia. Câu `mencari solusi` giúp giọng bớt đối đầu.",
          "Luyện: `Kami ingin mencari solusi.`",
        ],
        pronunciation_focus_en: [
          "KA-mi EE-ngin men-CHA-ri so-LOO-si yang BA-ik un-TOOK se-MOO-a PEE-hak — `solusi` = solution; `semua pihak` = all parties.",
          "VN-speaker trap: making the complaint only about blame. `Mencari solusi` makes the tone less confrontational.",
          "Drill: `Kami ingin mencari solusi.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở khu dân cư Indonesia, phàn nàn thường đi qua RT/RW, satpam, pengelola gedung, hoặc trực tiếp với bên gây vấn đề trước khi lên cơ quan. Giữ giọng lịch sự rất quan trọng: nói vấn đề cụ thể, thời gian xảy ra, ảnh hưởng đến warga, rồi đề xuất solusi.",
    cultural_notes_en:
      "In Indonesian neighborhoods, complaints often go through the RT/RW, security guard, building management, or the responsible party before escalating to an agency. A polite tone matters: state the specific problem, when it happens, the effect on residents, and then propose a solution.",
    tip_advice_vi:
      "Cụm cần nhớ: `polusi suara`, `bau tidak sedap`, `limbah`, `komplain warga`, `mencari solusi`. Tránh dịch từng chữ từ tiếng Việt như `suara besar` hoặc `bau jelek`.",
    tip_advice_en:
      "Key phrases: `polusi suara`, `bau tidak sedap`, `limbah`, `komplain warga`, `mencari solusi`. Avoid literal Vietnamese-style phrases like `suara besar` or `bau jelek`.",
    vocabulary: [
      {
        cell_id: "a24a1583-0943-4fa5-a8fb-0ac4ed1c90ef",
        word: "polusi suara",
        en: "noise pollution",
        vi: "ô nhiễm tiếng ồn",
        pos: "noun phrase",
        pronunciation_vi: "po-LU-si SU-a-ra",
        pronunciation_en: "po-LOO-si SOO-a-ra",
      },
      {
        cell_id: "ecbe23e3-d0c9-4365-98da-81cd8c3f3c35",
        word: "limbah",
        en: "waste",
        vi: "chất thải",
        pos: "noun",
        pronunciation_vi: "LIM-bah",
        pronunciation_en: "LIM-bah",
      },
      {
        cell_id: "6233aab8-f462-43b5-8195-4f29e52adb72",
        word: "bau tidak sedap",
        en: "unpleasant smell",
        vi: "mùi khó chịu",
        pos: "noun phrase",
        pronunciation_vi: "bau TI-dak SE-dap",
        pronunciation_en: "bau TEE-dak SE-dap",
      },
      {
        cell_id: "982b0a8b-95df-42fc-82cf-89fb85d8c114",
        word: "warga",
        en: "residents",
        vi: "cư dân / người dân",
        pos: "noun",
        pronunciation_vi: "WAR-ga",
        pronunciation_en: "WAR-ga",
      },
      {
        cell_id: "dadc46a2-d1a2-4691-9fa0-011bf6c64e36",
        word: "komplain",
        en: "complaint / complain",
        vi: "phàn nàn / khiếu nại",
        pos: "noun/verb",
        pronunciation_vi: "kom-PLAIN",
        pronunciation_en: "kom-PLAIN",
      },
      {
        cell_id: "15f08e3b-9504-4a5f-9d94-7863f7c42b38",
        word: "solusi",
        en: "solution",
        vi: "giải pháp",
        pos: "noun",
        pronunciation_vi: "so-LU-si",
        pronunciation_en: "so-LOO-si",
      },
    ],
    dialogue: [
      {
        cell_id: "58b46f10-08f9-4ec4-bce0-61cd095f9885",
        speaker: "Warga",
        text: "Pak, suara mesin dari proyek terlalu keras setiap malam.",
        vi: "Chú ơi, tiếng máy từ công trình quá to mỗi tối.",
        en: "Sir, the machine noise from the project is too loud every night.",
      },
      {
        cell_id: "53c9ab45-d96d-4efe-a47b-a6c0ba4acbc0",
        speaker: "Pengelola",
        text: "Baik, apakah sudah ada laporan dari warga lain?",
        vi: "Được, đã có báo cáo từ cư dân khác chưa?",
        en: "Okay, have there been reports from other residents?",
      },
      {
        cell_id: "674b497e-81fd-453e-9178-be5cf0a81d0a",
        speaker: "Warga",
        text: "Sudah. Kami ingin mencari solusi supaya tidak mengganggu.",
        vi: "Có rồi. Chúng tôi muốn tìm giải pháp để không gây phiền.",
        en: "Yes. We want to find a solution so it does not disturb people.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Polusi ___ dari proyek itu sangat mengganggu.`",
        prompt_en: "Fill in: `Polusi ___ dari proyek itu sangat mengganggu.`",
        answer: "suara",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Có mùi khó chịu từ cống nước.",
        prompt_en: "Translate to Indonesian: There is an unpleasant smell from the drain.",
        answer: "Ada bau tidak sedap dari saluran air.",
      },
      {
        type: "choice",
        prompt_vi: "Cụm nào nghĩa là 'giải pháp'?",
        prompt_en: "Which word means 'solution'?",
        options: ["solusi", "limbah", "warga"],
        answer: "solusi",
      },
    ],
  },
  {
    id: "indonesian_environmental_report_evidence",
    level: "B1",
    category: "community",
    title_vi: "Báo cáo môi trường và bằng chứng",
    title_en: "Environmental reports and evidence",
    sentences: [
      {
        en: "Kami mau membuat laporan ke dinas lingkungan.",
        vi: "Chúng tôi muốn lập báo cáo/gửi đơn đến sở môi trường.",
        pronunciation_focus: [
          "KA-mi mau mem-BU-at la-PO-ran ke DI-nas ling-KUNG-an — `membuat laporan` = lập/gửi báo cáo; `dinas lingkungan` = cơ quan môi trường.",
          "Lỗi người Việt: nói `lapor ke lingkungan` thiếu cơ quan. Cụm rõ hơn là `ke dinas lingkungan`.",
          "Luyện: `Kami mau membuat laporan ke dinas lingkungan.`",
        ],
        pronunciation_focus_en: [
          "KA-mi mau mem-BOO-at la-PO-ran ke DEE-nas ling-KOONG-an — `membuat laporan` = make/file a report; `dinas lingkungan` = environmental agency.",
          "VN-speaker trap: saying `lapor ke lingkungan`, which lacks the agency. The clearer phrase is `ke dinas lingkungan`.",
          "Drill: `Kami mau membuat laporan ke dinas lingkungan.`",
        ],
      },
      {
        en: "Kami punya bukti laporan berupa foto dan video.",
        vi: "Chúng tôi có bằng chứng cho báo cáo dưới dạng ảnh và video.",
        pronunciation_focus: [
          "KA-mi PU-nya BUK-ti la-PO-ran be-RU-pa FO-to dan VI-de-o — `bukti laporan` = bằng chứng cho báo cáo; `berupa` = dưới dạng.",
          "Lỗi người Việt: dịch 'bằng chứng' thành số nhiều. Tiếng Indonesia dùng `bukti` cho cả một hoặc nhiều chứng cứ.",
          "Luyện: `Kami punya bukti berupa foto.`",
        ],
        pronunciation_focus_en: [
          "KA-mi POO-nya BOOK-ti la-PO-ran be-ROO-pa FO-to dan VEE-de-o — `bukti laporan` = report evidence; `berupa` = in the form of.",
          "VN-speaker trap: forcing a plural for evidence. Indonesian `bukti` can cover one or multiple pieces of evidence.",
          "Drill: `Kami punya bukti berupa foto.`",
        ],
      },
      {
        en: "Kejadian ini berulang hampir setiap hari.",
        vi: "Việc này lặp lại gần như mỗi ngày.",
        pronunciation_focus: [
          "ke-JA-di-an I-ni be-RU-lang HAM-pir se-TI-ap HA-ri — `kejadian` = sự việc; `berulang` = lặp lại.",
          "Lỗi người Việt: nói `terjadi ulang` theo kiểu dịch thẳng. Cụm tự nhiên là `kejadian ini berulang`.",
          "Luyện: `Kejadian ini berulang setiap hari.`",
        ],
        pronunciation_focus_en: [
          "ke-JA-di-an EE-ni be-ROO-lang HAM-pir se-TEE-ap HA-ri — `kejadian` = incident/event; `berulang` = recurring.",
          "VN-speaker trap: saying literal `terjadi ulang`. Natural phrasing: `kejadian ini berulang`.",
          "Drill: `Kejadian ini berulang setiap hari.`",
        ],
      },
      {
        en: "Warga meminta pemeriksaan dan tindak lanjut.",
        vi: "Người dân yêu cầu kiểm tra và xử lý tiếp.",
        pronunciation_focus: [
          "WAR-ga me-MIN-ta pe-me-RIK-sa-an dan TIN-dak LAN-jut — `pemeriksaan` = kiểm tra; `tindak lanjut` = bước xử lý tiếp theo.",
          "Lỗi người Việt: dùng `cek` trong văn bản chính thức. Khi viết báo cáo, `pemeriksaan` trang trọng hơn.",
          "Luyện: `Warga meminta tindak lanjut.`",
        ],
        pronunciation_focus_en: [
          "WAR-ga me-MIN-ta pe-me-RIK-sa-an dan TIN-dak LAN-jut — `pemeriksaan` = inspection/check; `tindak lanjut` = follow-up action.",
          "VN-speaker trap: using casual `cek` in a formal report. In writing, `pemeriksaan` is more formal.",
          "Drill: `Warga meminta tindak lanjut.`",
        ],
      },
      {
        en: "Kami berharap ada solusi tanpa konflik dengan tetangga.",
        vi: "Chúng tôi hy vọng có giải pháp mà không xung đột với hàng xóm.",
        pronunciation_focus: [
          "KA-mi ber-HA-rap A-da so-LU-si TAN-pa KON-flik de-NGAN te-TANG-ga — `berharap` = hy vọng; `tanpa konflik` = không xung đột.",
          "Lỗi người Việt: nhầm `tetangga` và `warga`. `Tetangga` = hàng xóm gần; `warga` = cư dân/người dân rộng hơn.",
          "Luyện: `Kami berharap ada solusi tanpa konflik.`",
        ],
        pronunciation_focus_en: [
          "KA-mi ber-HA-rap A-da so-LOO-si TAN-pa KON-flik de-NGAN te-TANG-ga — `berharap` = hope; `tanpa konflik` = without conflict.",
          "VN-speaker trap: mixing `tetangga` and `warga`. `Tetangga` = neighbors nearby; `warga` = residents more broadly.",
          "Drill: `Kami berharap ada solusi tanpa konflik.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi báo cáo vấn đề môi trường ở Indonesia, bằng chứng cụ thể rất hữu ích: ảnh, video, ngày giờ, địa điểm, và danh sách warga yang terdampak. Tùy nơi, báo cáo có thể đi qua RT/RW, kelurahan, pengelola, atau dinas lingkungan hidup.",
    cultural_notes_en:
      "When reporting an environmental issue in Indonesia, concrete evidence is useful: photos, videos, date and time, location, and a list of affected residents. Depending on the place, reports may go through the RT/RW, urban village office, building management, or environmental agency.",
    tip_advice_vi:
      "Trong văn bản chính thức, chọn từ rõ và trung lập: `membuat laporan`, `bukti berupa foto`, `pemeriksaan`, `tindak lanjut`. Tránh lời buộc tội quá mạnh nếu bạn chưa có bukti.",
    tip_advice_en:
      "In formal writing, choose clear and neutral terms: `membuat laporan`, `bukti berupa foto`, `pemeriksaan`, `tindak lanjut`. Avoid strong accusations if you do not yet have evidence.",
    vocabulary: [
      {
        cell_id: "1ef36d5d-1815-46f8-af22-fa71792b79fa",
        word: "dinas lingkungan",
        en: "environmental agency",
        vi: "cơ quan/sở môi trường",
        pos: "noun phrase",
        pronunciation_vi: "DI-nas ling-KUNG-an",
        pronunciation_en: "DEE-nas ling-KOONG-an",
      },
      {
        cell_id: "33e53ad5-7290-40fc-bf1c-275e9b0574d9",
        word: "bukti laporan",
        en: "report evidence",
        vi: "bằng chứng cho báo cáo",
        pos: "noun phrase",
        pronunciation_vi: "BUK-ti la-PO-ran",
        pronunciation_en: "BOOK-ti la-PO-ran",
      },
      {
        cell_id: "6902478b-eb31-4869-a2c1-aee9489f72e6",
        word: "kejadian",
        en: "incident / event",
        vi: "sự việc",
        pos: "noun",
        pronunciation_vi: "ke-JA-di-an",
        pronunciation_en: "ke-JA-di-an",
      },
      {
        cell_id: "ee0a59f0-ec95-4708-9e08-7cd3536e6b6e",
        word: "pemeriksaan",
        en: "inspection / check",
        vi: "việc kiểm tra",
        pos: "noun",
        pronunciation_vi: "pe-me-RIK-sa-an",
        pronunciation_en: "pe-me-RIK-sa-an",
      },
      {
        cell_id: "db940f22-b92b-4f32-af83-83bcdbc76a47",
        word: "tindak lanjut",
        en: "follow-up action",
        vi: "xử lý tiếp / bước tiếp theo",
        pos: "noun phrase",
        pronunciation_vi: "TIN-dak LAN-jut",
        pronunciation_en: "TIN-dak LAN-jut",
      },
      {
        cell_id: "8d933160-f7c4-430f-a815-58089a5eec69",
        word: "terdampak",
        en: "affected",
        vi: "bị ảnh hưởng",
        pos: "adjective",
        pronunciation_vi: "ter-DAM-pak",
        pronunciation_en: "ter-DAM-pak",
      },
    ],
    dialogue: [
      {
        cell_id: "7785b646-11df-4db9-91c6-c7016f2055c0",
        speaker: "Warga",
        text: "Kami mau membuat laporan tentang limbah dan bau tidak sedap.",
        vi: "Chúng tôi muốn lập báo cáo về chất thải và mùi khó chịu.",
        en: "We want to file a report about waste and unpleasant smells.",
      },
      {
        cell_id: "ed3752a0-ef8f-49ac-bb96-c538038aaa7a",
        speaker: "Petugas",
        text: "Apakah ada bukti berupa foto atau video?",
        vi: "Có bằng chứng dưới dạng ảnh hoặc video không?",
        en: "Is there evidence in the form of photos or videos?",
      },
      {
        cell_id: "a4ca6d57-df0d-416d-8844-f092e2a43b8d",
        speaker: "Warga",
        text: "Ada, dan kejadian ini berulang hampir setiap hari.",
        vi: "Có, và việc này lặp lại gần như mỗi ngày.",
        en: "Yes, and this incident recurs almost every day.",
      },
      {
        cell_id: "1022954c-21a2-4688-9961-9474c1bf53f2",
        speaker: "Petugas",
        text: "Baik, kami catat untuk pemeriksaan dan tindak lanjut.",
        vi: "Được, chúng tôi ghi nhận để kiểm tra và xử lý tiếp.",
        en: "Okay, we will record it for inspection and follow-up.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Kami mau membuat laporan ke dinas ___.`",
        prompt_en: "Fill in: `Kami mau membuat laporan ke dinas ___.`",
        answer: "lingkungan",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Chúng tôi có bằng chứng dưới dạng video.",
        prompt_en: "Translate to Indonesian: We have evidence in the form of video.",
        answer: "Kami punya bukti berupa video.",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `pemeriksaan`, `tindak lanjut`, `terdampak`.",
        prompt_en: "Match meanings: `pemeriksaan`, `tindak lanjut`, `terdampak`.",
        pairs: [
          ["pemeriksaan", "việc kiểm tra / inspection"],
          ["tindak lanjut", "xử lý tiếp / follow-up action"],
          ["terdampak", "bị ảnh hưởng / affected"],
        ],
      },
    ],
  },
];
