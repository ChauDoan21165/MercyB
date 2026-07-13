// Tenant maintenance request Indonesian (Vietnamese -> Indonesian study track).
//
// A2 Wave 25 file. Covers minta perbaikan, pipa bocor, lampu mati, AC rusak,
// pemilik rumah, jadwal tukang, biaya, and bukti foto.
// Self-contained so no registry or sibling agent files are touched.
//
// Field convention: sentence `en` holds the target Indonesian line, `vi` holds
// the Vietnamese gloss. `pronunciation_focus` carries Vietnamese-facing notes
// and common L1 traps; `pronunciation_focus_en` mirrors the same order for
// English-speaking companions.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length and order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  cell_id?: string;
  /** Indonesian word/phrase. */
  word: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Part of speech, e.g. "noun", "verb", "phrase". */
  pos: string;
  /** Vietnamese pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  cell_id?: string;
  speaker: string;
  /** Indonesian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
  en?: string;
};

// Loosely typed so per-type fields (translation, fill-blank, matching) can vary.
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
    id: "indonesian_tenant_maintenance_request",
    level: "A2",
    category: "housing",
    title_vi: "Yêu cầu sửa chữa nhà thuê",
    title_en: "Tenant maintenance requests",
    sentences: [
      {
        en: "Saya mau minta perbaikan untuk kamar saya.",
        vi: "Tôi muốn yêu cầu sửa chữa cho phòng của tôi.",
        pronunciation_focus: [
          "SA-ya mau MIN-ta per-BAI-kan UN-tuk KA-mar SA-ya - `minta perbaikan` = yêu cầu sửa chữa; `kamar saya` = phòng của tôi.",
          "`perbaikan` là danh từ từ `baik`/`memperbaiki`, dùng cho việc sửa chữa nói chung.",
          "Lỗi người Việt: nói `minta memperbaiki` không tự nhiên. Dùng danh từ: `minta perbaikan`.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau MIN-ta per-BAI-kan OON-took KA-mar SA-ya - `minta perbaikan` = request a repair; `kamar saya` = my room.",
          "`perbaikan` is the noun for repair/improvement, used for repair work in general.",
          "VN-speaker trap: saying `minta memperbaiki` sounds unnatural. Use the noun: `minta perbaikan`.",
        ],
      },
      {
        en: "Pipa di bawah wastafel bocor sejak tadi malam.",
        vi: "Ống nước dưới bồn rửa bị rò từ tối qua.",
        pronunciation_focus: [
          "PI-pa di BA-wah WAS-ta-fel BO-cor se-JAK TA-di MA-lam - `pipa bocor` = ống bị rò; `sejak tadi malam` = từ tối qua.",
          "`bocor` dùng cho nước/khí rò rỉ. Với nhà thuê, nói vị trí cụ thể giúp chủ nhà gọi tukang đúng.",
          "Lỗi người Việt: dùng `rusak` cho mọi lỗi. Với rò nước, từ chính xác là `bocor`.",
        ],
        pronunciation_focus_en: [
          "PEE-pa dee BA-wah WAS-ta-fel BO-chor seh-JAK TA-dee MA-lam - `pipa bocor` = leaking pipe; `sejak tadi malam` = since last night.",
          "`bocor` is used for water/gas leaks. For rentals, give the exact location so the owner can call the right repair worker.",
          "VN-speaker trap: using `rusak` for every problem. For leaks, the precise word is `bocor`.",
        ],
      },
      {
        en: "Lampu di ruang tamu mati dan tidak bisa dinyalakan.",
        vi: "Đèn ở phòng khách bị tắt/hỏng và không bật lên được.",
        pronunciation_focus: [
          "LAM-pu di RU-ang TA-mu MA-ti dan ti-DAK BI-sa di-NYA-la-kan - `lampu mati` = đèn tắt/hỏng; `dinyalakan` = được bật lên.",
          "`mati` có thể dùng cho thiết bị không hoạt động, không chỉ sinh vật chết.",
          "Lỗi người Việt: dịch máy móc hỏng là `meninggal`. Thiết bị dùng `mati` hoặc `rusak`.",
        ],
        pronunciation_focus_en: [
          "LAM-poo dee ROO-ang TA-moo MA-tee dan tee-DAK BEE-sa dee-NYA-la-kan - `lampu mati` = light is out; `dinyalakan` = turned on.",
          "`mati` can describe devices not working, not only living things dying.",
          "VN-speaker trap: using a human death word for broken devices. Equipment uses `mati` or `rusak`.",
        ],
      },
      {
        en: "AC kamar tidur rusak dan tidak dingin lagi.",
        vi: "Máy lạnh phòng ngủ bị hỏng và không còn lạnh nữa.",
        pronunciation_focus: [
          "A-CE KA-mar TI-dur RU-sak dan ti-DAK DI-ngin LA-gi - `AC rusak` = máy lạnh hỏng; `tidak dingin lagi` = không còn lạnh nữa.",
          "`AC` thường đọc A-CE trong tiếng Indonesia, không cần nói dài `air conditioner`.",
          "Lỗi người Việt: nói `AC tidak sejuk` nghe Malaysia/ít tự nhiên hơn ở Indonesia; dùng `tidak dingin`.",
        ],
        pronunciation_focus_en: [
          "A-CHE KA-mar TEE-door ROO-sak dan tee-DAK DEE-ngin LA-gee - `AC rusak` = air conditioner is broken; `tidak dingin lagi` = no longer cold.",
          "`AC` is usually pronounced A-CHE in Indonesian; no need to say the full English phrase.",
          "VN-speaker note: `AC tidak sejuk` sounds more Malaysian/less natural in Indonesia; use `tidak dingin`.",
        ],
      },
      {
        en: "Saya sudah kirim bukti foto lewat WhatsApp.",
        vi: "Tôi đã gửi bằng chứng ảnh qua WhatsApp.",
        pronunciation_focus: [
          "SA-ya SU-dah KI-rim BUK-ti FO-to LE-wat WhatsApp - `bukti foto` = bằng chứng ảnh; `lewat WhatsApp` = qua WhatsApp.",
          "`sudah kirim` là cách nói hằng ngày; bản đầy đủ hơn là `sudah mengirim`.",
          "Lỗi người Việt: nói `foto bukti` vẫn hiểu, nhưng cụm tự nhiên trong tranh chấp/sửa chữa là `bukti foto`.",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah KEE-rim BOOK-tee FO-to LE-wat WhatsApp - `bukti foto` = photo evidence; `lewat WhatsApp` = via WhatsApp.",
          "`sudah kirim` is everyday speech; the fuller form is `sudah mengirim`.",
          "VN-speaker note: `foto bukti` may be understood, but the natural phrase for disputes/repairs is `bukti foto`.",
        ],
      },
      {
        en: "Bisa tolong kabari pemilik rumah hari ini?",
        vi: "Bạn có thể nhờ báo cho chủ nhà hôm nay không?",
        pronunciation_focus: [
          "BI-sa TO-long ka-BA-ri pe-MI-lik RU-mah HA-ri I-ni - `pemilik rumah` = chủ nhà; `kabari` = báo tin cho.",
          "`tolong kabari` mềm hơn `suruh pemilik rumah`. Dùng khi nhờ quản lý/kos helper liên hệ chủ nhà.",
          "Lỗi người Việt: dịch 'báo' thành `lapor` trong mọi trường hợp. Báo tin/cập nhật cho ai là `kabari`.",
        ],
        pronunciation_focus_en: [
          "BEE-sa TO-long ka-BA-ree pe-MEE-lik ROO-mah HA-ree EE-nee - `pemilik rumah` = homeowner/landlord; `kabari` = let someone know.",
          "`tolong kabari` is softer than `suruh pemilik rumah`. Use it when asking a manager/helper to contact the owner.",
          "VN-speaker trap: translating every 'report/tell' as `lapor`. Updating someone is `kabari`.",
        ],
      },
      {
        en: "Kapan tukang bisa datang untuk mengecek kerusakan?",
        vi: "Khi nào thợ có thể đến để kiểm tra hư hỏng?",
        pronunciation_focus: [
          "KA-pan TU-kang BI-sa DA-tang UN-tuk me-NGE-cek ke-ru-SA-kan - `tukang` = thợ; `mengecek kerusakan` = kiểm tra hư hỏng.",
          "`tukang` cần ngữ cảnh: `tukang ledeng` thợ ống nước, `tukang listrik` thợ điện, `tukang AC` thợ máy lạnh.",
          "Lỗi người Việt: nói `pekerja` quá chung. Với sửa nhà, `tukang` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "KA-pan TOO-kang BEE-sa DA-tang OON-took me-NGE-chek keh-roo-SA-kan - `tukang` = repair worker/tradesperson; `mengecek kerusakan` = check the damage/problem.",
          "`tukang` needs context: `tukang ledeng` plumber, `tukang listrik` electrician, `tukang AC` AC technician.",
          "VN-speaker note: `pekerja` is too general. For home repair, `tukang` is more natural.",
        ],
      },
      {
        en: "Tolong buat jadwal tukang yang jelas.",
        vi: "Làm ơn sắp lịch thợ rõ ràng.",
        pronunciation_focus: [
          "TO-long BU-at JAD-wal TU-kang yang JE-las - `jadwal tukang` = lịch thợ đến; `jelas` = rõ ràng.",
          "`buat jadwal` là cách nói phổ biến cho sắp lịch/hẹn lịch.",
          "Lỗi người Việt: dịch 'schedule' thành `skedul` trong câu hành chính. `Jadwal` tự nhiên và chuẩn hơn.",
        ],
        pronunciation_focus_en: [
          "TO-long BOO-at JAD-wal TOO-kang yang JE-las - `jadwal tukang` = repair-worker schedule; `jelas` = clear.",
          "`buat jadwal` is a common way to say make/set a schedule.",
          "VN-speaker trap: translating schedule as English-like `skedul`. `Jadwal` is more natural and standard.",
        ],
      },
      {
        en: "Apakah biaya perbaikan ditanggung pemilik rumah?",
        vi: "Chi phí sửa chữa có do chủ nhà chịu không?",
        pronunciation_focus: [
          "a-PA-kah BI-a-ya per-BAI-kan di-TANG-gung pe-MI-lik RU-mah - `biaya perbaikan` = chi phí sửa chữa; `ditanggung` = được chịu/trả bởi.",
          "`ditanggung` thường dùng cho ai chịu trách nhiệm chi phí.",
          "Lỗi người Việt: nói `siapa bayar biaya` được nhưng hơi thô. Câu `ditanggung siapa` lịch sự hơn.",
        ],
        pronunciation_focus_en: [
          "a-PA-kah BEE-a-ya per-BAI-kan dee-TANG-goong pe-MEE-lik ROO-mah - `biaya perbaikan` = repair cost; `ditanggung` = borne/covered by.",
          "`ditanggung` is commonly used for who bears responsibility for a cost.",
          "VN-speaker note: `siapa bayar biaya` is understandable but blunt. `Ditanggung siapa` is more polite.",
        ],
      },
      {
        en: "Kalau kerusakannya karena pemakaian normal, saya minta biaya tidak dibebankan ke penyewa.",
        vi: "Nếu hư hỏng do sử dụng bình thường, tôi xin chi phí không bị tính cho người thuê.",
        pronunciation_focus: [
          "KA-lau ke-ru-SA-kan-nya KA-re-na pe-ma-KAI-an nor-MAL, SA-ya MIN-ta BI-a-ya ti-DAK di-be-BAN-kan ke pe-NYE-wa - `pemakaian normal` = sử dụng bình thường; `penyewa` = người thuê.",
          "`dibebankan ke penyewa` = bị tính/đổ chi phí cho người thuê. Đây là cụm quan trọng khi nói trách nhiệm chi phí.",
          "Lỗi người Việt: phản ứng `saya tidak mau bayar` có thể gắt. Câu này đưa lý do và đề nghị rõ hơn.",
        ],
        pronunciation_focus_en: [
          "KA-lau keh-roo-SA-kan-nya KA-reh-na peh-ma-KAI-an nor-MAL, SA-ya MIN-ta BEE-a-ya tee-DAK dee-beh-BAN-kan keh pe-NYE-wa - `pemakaian normal` = normal use; `penyewa` = tenant.",
          "`dibebankan ke penyewa` = charged to the tenant. This is a key phrase for repair-cost responsibility.",
          "VN-speaker trap: reacting with `saya tidak mau bayar` can sound harsh. This sentence gives a reason and a clearer request.",
        ],
      },
      {
        en: "Saya bisa menunggu tukang antara jam dua sampai jam empat sore.",
        vi: "Tôi có thể chờ thợ từ hai giờ đến bốn giờ chiều.",
        pronunciation_focus: [
          "SA-ya BI-sa me-NUNG-gu TU-kang an-TA-ra jam DU-a sam-PAI jam EM-pat SO-re - `antara ... sampai ...` = từ ... đến ...; `sore` = buổi chiều muộn.",
          "`menunggu tukang` nghĩa là chờ thợ đến, không phải làm thợ chờ.",
          "Lỗi người Việt: bỏ từ chỉ khung giờ. Với hẹn sửa nhà, nói rõ `antara jam dua sampai jam empat`.",
        ],
        pronunciation_focus_en: [
          "SA-ya BEE-sa meh-NOONG-goo TOO-kang an-TA-ra jam DOO-a sam-PAI jam EM-pat SO-reh - `antara ... sampai ...` = between ... and ...; `sore` = afternoon/early evening.",
          "`menunggu tukang` means wait for the repair worker to arrive.",
          "VN-speaker note: do not omit the time window. For home repairs, state `antara jam dua sampai jam empat` clearly.",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi thuê nhà, kos, hoặc căn hộ ở Indonesia, yêu cầu sửa chữa nên viết rõ vấn đề, vị trí, thời gian bắt đầu, và gửi `bukti foto` nếu có. Cách nói lịch sự giúp tránh căng thẳng với `pemilik rumah` hoặc pengelola: mô tả sự cố trước, hỏi `jadwal tukang`, rồi hỏi rõ `biaya perbaikan ditanggung siapa`. Nếu lỗi do sử dụng bình thường, có thể nói `karena pemakaian normal` thay vì tranh cãi trực tiếp.",
    cultural_notes_en:
      "When renting a house, boarding room, or apartment in Indonesia, repair requests should clearly state the problem, location, when it started, and include photo evidence if possible. Polite wording helps avoid tension with the landlord or management: describe the issue first, ask for the repair-worker schedule, then clarify who covers the repair cost. If the issue is from normal use, say `karena pemakaian normal` instead of arguing directly.",
    tip_advice_vi:
      "Mẫu tin nhắn an toàn: `Selamat pagi, saya mau minta perbaikan. Pipa di bawah wastafel bocor sejak tadi malam. Saya sudah kirim bukti foto. Kapan tukang bisa datang, dan apakah biaya perbaikan ditanggung pemilik rumah?`",
    tip_advice_en:
      "Safe message template: `Selamat pagi, saya mau minta perbaikan. Pipa di bawah wastafel bocor sejak tadi malam. Saya sudah kirim bukti foto. Kapan tukang bisa datang, dan apakah biaya perbaikan ditanggung pemilik rumah?`",
    vocabulary: [
      {
        cell_id: "21d4e6ca-49e6-46bb-9cb2-e9b6d4c7301b",
        word: "minta perbaikan",
        en: "request a repair",
        vi: "yêu cầu sửa chữa",
        pos: "verb phrase",
        pronunciation_vi: "MIN-ta per-BAI-kan",
        pronunciation_en: "MIN-ta per-BAI-kan",
      },
      {
        cell_id: "fa685e0f-c1a8-4c52-bb22-a381d3942803",
        word: "pipa bocor",
        en: "leaking pipe",
        vi: "ống nước bị rò",
        pos: "noun phrase",
        pronunciation_vi: "PI-pa BO-cor",
        pronunciation_en: "PEE-pa BO-chor",
      },
      {
        cell_id: "79053667-786e-489e-a158-444b7798ec12",
        word: "lampu mati",
        en: "light is out",
        vi: "đèn hỏng/tắt không lên",
        pos: "phrase",
        pronunciation_vi: "LAM-pu MA-ti",
        pronunciation_en: "LAM-poo MA-tee",
      },
      {
        cell_id: "fc26a90f-7cb8-48f7-bd14-1de4f1735987",
        word: "AC rusak",
        en: "air conditioner is broken",
        vi: "máy lạnh bị hỏng",
        pos: "phrase",
        pronunciation_vi: "A-CE RU-sak",
        pronunciation_en: "A-CHE ROO-sak",
      },
      {
        cell_id: "65afcf2b-06e2-40b9-9baa-a438ee907527",
        word: "pemilik rumah",
        en: "homeowner; landlord",
        vi: "chủ nhà",
        pos: "noun",
        pronunciation_vi: "pe-MI-lik RU-mah",
        pronunciation_en: "pe-MEE-lik ROO-mah",
      },
      {
        cell_id: "0898d698-0849-4bb9-b130-7f2141272631",
        word: "jadwal tukang",
        en: "repair-worker schedule",
        vi: "lịch thợ đến sửa",
        pos: "noun",
        pronunciation_vi: "JAD-wal TU-kang",
        pronunciation_en: "JAD-wal TOO-kang",
      },
      {
        cell_id: "64dcd627-a2fb-4f55-b66e-9623c3b5b5fe",
        word: "biaya perbaikan",
        en: "repair cost",
        vi: "chi phí sửa chữa",
        pos: "noun",
        pronunciation_vi: "BI-a-ya per-BAI-kan",
        pronunciation_en: "BEE-a-ya per-BAI-kan",
      },
      {
        cell_id: "a8dc452e-a62f-45a9-a6dd-3ed49c16b94f",
        word: "bukti foto",
        en: "photo evidence",
        vi: "bằng chứng ảnh",
        pos: "noun",
        pronunciation_vi: "BUK-ti FO-to",
        pronunciation_en: "BOOK-tee FO-to",
      },
      {
        cell_id: "7076b35b-a6c8-489f-aa71-97b31adf1510",
        word: "ditanggung",
        en: "covered; borne as a responsibility",
        vi: "được chịu/trả bởi",
        pos: "verb",
        pronunciation_vi: "di-TANG-gung",
        pronunciation_en: "dee-TANG-goong",
      },
      {
        cell_id: "991cbc43-ee1b-4928-ba4c-983a6a3c13f7",
        word: "penyewa",
        en: "tenant",
        vi: "người thuê",
        pos: "noun",
        pronunciation_vi: "pe-NYE-wa",
        pronunciation_en: "pe-NYE-wa",
      },
    ],
    dialogue: [
      {
        cell_id: "d2207e83-b8d4-4121-b819-fbbe93642214",
        speaker: "Penyewa",
        text: "Selamat pagi, saya mau minta perbaikan untuk kamar saya.",
        vi: "Chào buổi sáng, tôi muốn yêu cầu sửa chữa cho phòng của tôi.",
        en: "Good morning, I would like to request a repair for my room.",
      },
      {
        cell_id: "bf3796c3-b6fa-45c1-84a9-cef1564bd13a",
        speaker: "Pemilik rumah",
        text: "Ada masalah apa?",
        vi: "Có vấn đề gì vậy?",
        en: "What is the problem?",
      },
      {
        cell_id: "2a774b95-2c8f-4a2e-b45d-b02caf82e2de",
        speaker: "Penyewa",
        text: "Pipa di bawah wastafel bocor sejak tadi malam. Saya sudah kirim bukti foto.",
        vi: "Ống nước dưới bồn rửa bị rò từ tối qua. Tôi đã gửi bằng chứng ảnh.",
        en: "The pipe under the sink has been leaking since last night. I have sent photo evidence.",
      },
      {
        cell_id: "5b7d33ad-64e4-46d2-8491-7ce18c72ba2b",
        speaker: "Pemilik rumah",
        text: "Baik, saya akan hubungi tukang ledeng.",
        vi: "Được, tôi sẽ liên hệ thợ ống nước.",
        en: "All right, I will contact a plumber.",
      },
      {
        cell_id: "91301657-3aea-45cb-a6af-5379b71e93ad",
        speaker: "Penyewa",
        text: "Kapan tukang bisa datang? Saya bisa menunggu antara jam dua sampai jam empat sore.",
        vi: "Khi nào thợ có thể đến? Tôi có thể chờ từ hai giờ đến bốn giờ chiều.",
        en: "When can the repair worker come? I can wait between two and four in the afternoon.",
      },
      {
        cell_id: "4fc29864-a40f-4206-9b5b-37c298318ac6",
        speaker: "Pemilik rumah",
        text: "Saya kabari lagi setelah jadwal tukangnya pasti.",
        vi: "Tôi sẽ báo lại sau khi lịch thợ chắc chắn.",
        en: "I will update you after the repair-worker schedule is confirmed.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Ống nước dưới bồn rửa bị rò.",
        prompt_en: "Translate into Indonesian: The pipe under the sink is leaking.",
        answer: "Pipa di bawah wastafel bocor.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Saya sudah kirim ___ foto lewat WhatsApp.",
        prompt_en: "Fill in the blank: Saya sudah kirim ___ foto lewat WhatsApp.",
        answer: "bukti",
      },
      {
        type: "choice",
        prompt_vi: "Câu nào lịch sự nhất khi hỏi ai chịu chi phí sửa chữa?",
        prompt_en: "Which sentence is most polite for asking who covers repair costs?",
        options: [
          "Apakah biaya perbaikan ditanggung pemilik rumah?",
          "Siapa bayar ini?",
          "Saya tidak mau bayar apa pun.",
        ],
        answer: "Apakah biaya perbaikan ditanggung pemilik rumah?",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm từ Indonesia với nghĩa tiếng Việt.",
        prompt_en: "Match each Indonesian phrase with its Vietnamese meaning.",
        pairs: [
          ["AC rusak", "máy lạnh bị hỏng"],
          ["jadwal tukang", "lịch thợ đến sửa"],
          ["pemilik rumah", "chủ nhà"],
        ],
      },
    ],
    content:
      "Use this lesson for practical tenant repair requests: describing leaks and broken fixtures, sending photo evidence, asking the landlord to schedule a repair worker, clarifying time windows, and discussing who covers repair costs politely.",
  },
];
