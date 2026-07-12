// Online Scam Safety Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// pronunciation/culture notes with English companions in pronunciation_focus_en.

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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_online_scam_safety",
    level: "B1",
    category: "technology",
    title_vi: "An toàn trước lừa đảo online",
    title_en: "Online scam safety",
    sentences: [
      {
        en: "Hati-hati, banyak penipuan online yang mengatasnamakan bank.",
        vi: "Cẩn thận, có nhiều vụ lừa đảo online mạo danh ngân hàng.",
        pronunciation_focus: [
          "HA-ti-HA-ti, BA-nyak pe-ni-PU-an ON-lain — `penipuan online` = lừa đảo online; `mengatasnamakan` = mạo danh/nhân danh.",
          "Lỗi người Việt: nói `tipu online` như động từ trần. Danh từ sự việc là `penipuan online`.",
          "Luyện: `Hati-hati dengan penipuan online.`",
        ],
        pronunciation_focus_en: [
          "HA-ti-HA-ti, BA-nyak pe-ni-PU-an ON-line — `penipuan online` = online scam; `mengatasnamakan` = impersonating/using the name of.",
          "VN-speaker trap: saying bare `tipu online`. The event/noun is `penipuan online`.",
          "Drill: `Hati-hati dengan penipuan online.`",
        ],
      },
      {
        en: "Jangan pernah bagikan kode OTP kepada siapa pun.",
        vi: "Đừng bao giờ chia sẻ mã OTP cho bất kỳ ai.",
        pronunciation_focus: [
          "JA-ngan PER-nah ba-GI-kan KO-de o-te-pe — `jangan pernah` = đừng bao giờ; `siapa pun` = bất kỳ ai.",
          "Lỗi người Việt: bỏ `pun`. `siapa pun` nhấn mạnh 'bất kỳ ai', rất hợp trong cảnh báo bảo mật.",
          "Luyện: `Jangan bagikan kode OTP.`",
        ],
        pronunciation_focus_en: [
          "JA-ngan PER-nah ba-GI-kan KO-de o-te-pe — `jangan pernah` = never; `siapa pun` = anyone at all.",
          "VN-speaker trap: dropping `pun`. `siapa pun` emphasizes 'anyone', useful in security warnings.",
          "Drill: `Jangan bagikan kode OTP.`",
        ],
      },
      {
        en: "Link ini mencurigakan, jangan diklik dulu.",
        vi: "Đường link này đáng ngờ, đừng bấm vội.",
        pronunciation_focus: [
          "link I-ni men-cu-ri-GA-kan, JA-ngan di-KLIK DU-lu — `mencurigakan` = đáng ngờ; `diklik` = được bấm/nhấp.",
          "Lỗi người Việt: đọc `c` như k. Trong `mencurigakan`, `c` đọc 'ch': men-chu-ri-GA-kan.",
          "Luyện: `Link ini mencurigakan.`",
        ],
        pronunciation_focus_en: [
          "link I-ni men-cu-ri-GA-kan, JA-ngan di-KLIK DU-lu — `mencurigakan` = suspicious; `diklik` = clicked.",
          "VN-speaker trap: reading `c` like k. In `mencurigakan`, `c` is 'ch': men-choo-ree-GA-kan.",
          "Drill: `Link ini mencurigakan.`",
        ],
      },
      {
        en: "Saya menerima bukti transfer palsu dari pembeli.",
        vi: "Tôi nhận được bằng chứng chuyển khoản giả từ người mua.",
        pronunciation_focus: [
          "SA-ya me-ne-RI-ma BUK-ti TRANS-fer PAL-su — `bukti transfer` = bằng chứng chuyển khoản; `palsu` = giả.",
          "Lỗi người Việt: dùng `salah` cho giả mạo. `salah` = sai; chứng từ giả là `palsu`.",
          "Luyện: `Bukti transfernya palsu.`",
        ],
        pronunciation_focus_en: [
          "SA-ya me-ne-RI-ma BUK-ti TRANS-fer PAL-su — `bukti transfer` = transfer proof; `palsu` = fake.",
          "VN-speaker trap: using `salah` for fake. `salah` = wrong; fraudulent proof is `palsu`.",
          "Drill: `Bukti transfernya palsu.`",
        ],
      },
      {
        en: "Akun saya dibajak setelah saya membuka tautan itu.",
        vi: "Tài khoản của tôi bị chiếm sau khi tôi mở đường dẫn đó.",
        pronunciation_focus: [
          "A-kun SA-ya di-BA-jak se-TE-lah mem-BU-ka TAU-tan I-tu — `dibajak` = bị chiếm/hack; `tautan` = đường dẫn.",
          "Lỗi người Việt: nói `akun saya hack`. Cách Indonesia tự nhiên: `akun saya dibajak` hoặc `akun saya kena hack`.",
          "Luyện: `Akun saya dibajak.`",
        ],
        pronunciation_focus_en: [
          "A-kun SA-ya di-BA-jak se-TE-lah mem-BU-ka TAU-tan I-tu — `dibajak` = hijacked/hacked; `tautan` = link.",
          "VN-speaker trap: saying `akun saya hack`. Natural Indonesian: `akun saya dibajak` or colloquial `akun saya kena hack`.",
          "Drill: `Akun saya dibajak.`",
        ],
      },
      {
        en: "Segera ganti kata sandi dan aktifkan verifikasi dua langkah.",
        vi: "Hãy đổi mật khẩu ngay và bật xác minh hai bước.",
        pronunciation_focus: [
          "se-GE-ra GAN-ti KA-ta SAN-di — `kata sandi` = mật khẩu; `verifikasi dua langkah` = xác minh hai bước.",
          "Lỗi người Việt: chỉ nói `password`. Người Indonesia hiểu, nhưng trong hướng dẫn chính thức dùng `kata sandi`.",
          "Luyện: `Ganti kata sandi sekarang.`",
        ],
        pronunciation_focus_en: [
          "se-GE-ra GAN-ti KA-ta SAN-di — `kata sandi` = password; `verifikasi dua langkah` = two-step verification.",
          "VN-speaker trap: only saying `password`. Indonesians understand it, but official guidance uses `kata sandi`.",
          "Drill: `Ganti kata sandi sekarang.`",
        ],
      },
      {
        en: "Saya mau lapor bank karena ada transaksi mencurigakan.",
        vi: "Tôi muốn báo ngân hàng vì có giao dịch đáng ngờ.",
        pronunciation_focus: [
          "SA-ya mau la-POR bank ka-RE-na A-da tran-SAK-si men-cu-ri-GA-kan — `lapor bank` = báo với ngân hàng; `transaksi` = giao dịch.",
          "Lỗi người Việt: nói `lapor kepada bank` không sai nhưng nặng. Khi nói nhanh: `lapor bank`.",
          "Luyện: `Ada transaksi mencurigakan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau la-POR bank ka-RE-na A-da tran-SAK-si men-cu-ri-GA-kan — `lapor bank` = report to the bank; `transaksi` = transaction.",
          "VN-speaker trap: `lapor kepada bank` is correct but heavy. In quick speech: `lapor bank`.",
          "Drill: `Ada transaksi mencurigakan.`",
        ],
      },
      {
        en: "Tolong blokir kartu dan rekening saya sementara.",
        vi: "Làm ơn khóa thẻ và tài khoản ngân hàng của tôi tạm thời.",
        pronunciation_focus: [
          "TO-long BLO-kir KAR-tu dan re-KE-ning SA-ya se-men-TA-ra — `blokir` = khóa/chặn; `sementara` = tạm thời.",
          "Lỗi người Việt: dùng `akun` cho tài khoản ngân hàng. Ở ngân hàng thường là `rekening`; `akun` dùng nhiều cho app.",
          "Luyện: `Tolong blokir kartu saya.`",
        ],
        pronunciation_focus_en: [
          "TO-long BLO-kir KAR-tu dan re-KE-ning SA-ya se-men-TA-ra — `blokir` = block/freeze; `sementara` = temporarily.",
          "VN-speaker trap: using `akun` for bank account. Banking usually uses `rekening`; `akun` is common for apps.",
          "Drill: `Tolong blokir kartu saya.`",
        ],
      },
      {
        en: "Pihak bank tidak pernah meminta PIN lewat telepon.",
        vi: "Phía ngân hàng không bao giờ yêu cầu mã PIN qua điện thoại.",
        pronunciation_focus: [
          "PI-hak bank ti-DAK PER-nah me-MIN-ta pin LE-wat te-le-PON — `pihak bank` = phía/người đại diện ngân hàng; `lewat` = qua.",
          "Lỗi người Việt: dùng `di telepon` cho kênh liên lạc. Nói `lewat telepon` = qua điện thoại.",
          "Luyện: `Bank tidak pernah meminta PIN.`",
        ],
        pronunciation_focus_en: [
          "PI-hak bank ti-DAK PER-nah me-MIN-ta pin LE-wat te-le-PON — `pihak bank` = the bank side/representatives; `lewat` = via.",
          "VN-speaker trap: using `di telepon` for a communication channel. Say `lewat telepon` = by phone.",
          "Drill: `Bank tidak pernah meminta PIN.`",
        ],
      },
      {
        en: "Nomor itu mengaku dari kurir, tapi minta biaya tambahan.",
        vi: "Số đó tự nhận là bên shipper, nhưng lại yêu cầu phí thêm.",
        pronunciation_focus: [
          "NO-mor I-tu me-NGA-ku da-ri KU-rir — `mengaku dari` = tự nhận là từ/bên; `biaya tambahan` = phí bổ sung.",
          "Lỗi người Việt: dịch 'shipper' thành `pengirim`. Người giao hàng trong app/thương mại điện tử là `kurir`.",
          "Luyện: `Dia mengaku dari kurir.`",
        ],
        pronunciation_focus_en: [
          "NO-mor I-tu me-NGA-ku da-ri KU-rir — `mengaku dari` = claims to be from; `biaya tambahan` = extra fee.",
          "VN-speaker trap: translating 'shipper' as `pengirim`. Delivery people in app/e-commerce contexts are `kurir`.",
          "Drill: `Dia mengaku dari kurir.`",
        ],
      },
      {
        en: "Kalau ragu, hubungi layanan resmi lewat aplikasi.",
        vi: "Nếu nghi ngờ, hãy liên hệ dịch vụ chính thức qua ứng dụng.",
        pronunciation_focus: [
          "KA-lau RA-gu, hu-BUNG-i la-YA-nan res-MI LE-wat a-pli-KA-si — `ragu` = nghi ngờ/lưỡng lự; `resmi` = chính thức.",
          "Lỗi người Việt: nhấn `resmi` như tiếng Anh. Đọc res-MI, và dùng cho kênh chính thức: `layanan resmi`.",
          "Luyện: `Hubungi layanan resmi.`",
        ],
        pronunciation_focus_en: [
          "KA-lau RA-gu, hu-BUNG-i la-YA-nan res-MI LE-wat ap-lee-KA-see — `ragu` = unsure/doubtful; `resmi` = official.",
          "VN-speaker trap: stressing `resmi` like English. Say res-MI, and use it for official channels: `layanan resmi`.",
          "Drill: `Hubungi layanan resmi.`",
        ],
      },
      {
        en: "Saya simpan tangkapan layar sebagai bukti laporan.",
        vi: "Tôi lưu ảnh chụp màn hình làm bằng chứng báo cáo.",
        pronunciation_focus: [
          "SA-ya SIM-pan tang-KAP-an LA-yar se-BA-gai BUK-ti la-POR-an — `tangkapan layar` = ảnh chụp màn hình; `bukti laporan` = bằng chứng cho báo cáo.",
          "Lỗi người Việt: chỉ nói `screenshot`. Hiểu được, nhưng trong văn bản/tường trình dùng `tangkapan layar`.",
          "Luyện: `Simpan tangkapan layar.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SIM-pan tang-KAP-an LA-yar se-BA-gai BUK-ti la-POR-an — `tangkapan layar` = screenshot; `bukti laporan` = evidence for a report.",
          "VN-speaker trap: only saying `screenshot`. It is understood, but reports use `tangkapan layar`.",
          "Drill: `Simpan tangkapan layar.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, lừa đảo online thường mạo danh ngân hàng, ví điện tử, sàn thương mại điện tử, kurir, hoặc người quen bị mất tài khoản. Từ khóa hay gặp trong cảnh báo là `OTP`, `PIN`, `link mencurigakan`, `akun dibajak`, `transfer palsu`, `blokir kartu`, và `lapor bank`. Nguyên tắc an toàn: không chia sẻ OTP/PIN, không bấm link lạ, kiểm tra qua ứng dụng chính thức, lưu bukti như tangkapan layar, rồi liên hệ ngân hàng hoặc layanan resmi.",
    cultural_notes_en:
      "In Indonesia, online scams often impersonate banks, e-wallets, marketplaces, couriers, or acquaintances with hijacked accounts. Common warning terms include `OTP`, `PIN`, `link mencurigakan`, `akun dibajak`, `transfer palsu`, `blokir kartu`, and `lapor bank`. The safety rule is simple: never share OTP/PIN, avoid suspicious links, verify through the official app, save evidence such as screenshots, then contact the bank or official support.",
    tip_advice_vi:
      "Mẹo cho người Việt: học nguyên cụm cảnh báo thay vì dịch từng chữ: `jangan pernah bagikan OTP`, `link mencurigakan`, `bukti transfer palsu`, `akun saya dibajak`, `lapor bank`, `blokir kartu`. Phân biệt `rekening` (tài khoản ngân hàng) với `akun` (tài khoản app), và `palsu` (giả mạo) với `salah` (sai).",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn whole warning chunks instead of translating word by word: `jangan pernah bagikan OTP`, `link mencurigakan`, `bukti transfer palsu`, `akun saya dibajak`, `lapor bank`, `blokir kartu`. Distinguish `rekening` (bank account) from `akun` (app account), and `palsu` (fake) from `salah` (wrong).",
    vocabulary: [
      { cell_id: "61cacfa9-f387-427b-809d-39994d5a3335", word: "penipuan online", en: "online scam", vi: "lừa đảo online", pos: "noun phrase", pronunciation_vi: "peu-ni-PU-an ON-lain", pronunciation_en: "pe-ni-POO-an ON-line" },
      { cell_id: "f14026bb-8704-4f02-bd12-f771343ef7b5", word: "OTP", en: "one-time password/code", vi: "mã OTP", pos: "noun", pronunciation_vi: "o-te-pe", pronunciation_en: "oh-teh-peh" },
      { cell_id: "e88561ce-6a45-470a-9fa0-f7a86e02519b", word: "transfer palsu", en: "fake transfer", vi: "chuyển khoản giả", pos: "noun phrase", pronunciation_vi: "TRANS-fer PAL-su", pronunciation_en: "TRANS-fer PAL-soo" },
      { cell_id: "31164365-84f8-41c5-8f15-61a08db044f3", word: "akun dibajak", en: "account hacked/hijacked", vi: "tài khoản bị chiếm", pos: "phrase", pronunciation_vi: "A-kun di-BA-jak", pronunciation_en: "A-koon di-BA-jak" },
      { cell_id: "a81f7d2a-67fa-47c2-9b95-8a26547d3a35", word: "link mencurigakan", en: "suspicious link", vi: "đường link đáng ngờ", pos: "noun phrase", pronunciation_vi: "link men-chu-ri-GA-kan", pronunciation_en: "link men-choo-ree-GA-kan" },
      { cell_id: "2af812eb-978d-4cfa-922f-5b0191aecc78", word: "lapor bank", en: "report to the bank", vi: "báo ngân hàng", pos: "verb phrase", pronunciation_vi: "la-POR bank", pronunciation_en: "la-POR bank" },
      { cell_id: "0d6a91d9-7f79-4d35-a6f4-fe275c6b9eaa", word: "blokir kartu", en: "block/freeze a card", vi: "khóa thẻ", pos: "verb phrase", pronunciation_vi: "BLO-kir KAR-tu", pronunciation_en: "BLO-keer KAR-too" },
      { cell_id: "4001fd90-4053-4520-b25a-5a05ca0f5652", word: "hati-hati", en: "be careful", vi: "cẩn thận", pos: "interjection / adjective", pronunciation_vi: "HA-ti-HA-ti", pronunciation_en: "HA-tee-HA-tee" },
      { cell_id: "139c1539-3098-462c-a41d-283044b01dc1", word: "kata sandi", en: "password", vi: "mật khẩu", pos: "noun", pronunciation_vi: "KA-ta SAN-di", pronunciation_en: "KA-ta SAN-dee" },
      { cell_id: "14306b6d-1af4-451b-aa6a-a56094fc5ae2", word: "tangkapan layar", en: "screenshot", vi: "ảnh chụp màn hình", pos: "noun phrase", pronunciation_vi: "tang-KAP-an LA-yar", pronunciation_en: "tang-KAP-an LA-yar" },
      { cell_id: "4e05949c-b23d-4a31-a452-616f403df24c", word: "layanan resmi", en: "official support/service", vi: "dịch vụ chính thức", pos: "noun phrase", pronunciation_vi: "la-YA-nan res-MI", pronunciation_en: "la-YA-nan res-MEE" },
      { cell_id: "5caaa2a8-2d6c-430b-a759-1dd447ac33dc", word: "biaya tambahan", en: "extra fee", vi: "phí bổ sung", pos: "noun phrase", pronunciation_vi: "bi-A-ya tam-BA-han", pronunciation_en: "bee-A-ya tam-BA-han" },
    ],
    dialogue: [
      {
        cell_id: "98f1599a-2056-4752-9e62-406dc1fe440a",
        speaker: "Linh",
        text: "Saya dapat SMS dari bank, katanya harus klik link dan isi OTP.",
        vi: "Tôi nhận được SMS từ ngân hàng, họ nói phải bấm link và điền OTP.",
        en: "I got an SMS from the bank, saying I must click a link and enter an OTP.",
      },
      {
        cell_id: "42975e6b-49ba-4e9c-be40-ba018a6cce1f",
        speaker: "Rafi",
        text: "Jangan diklik. Bank tidak pernah meminta OTP lewat SMS.",
        vi: "Đừng bấm. Ngân hàng không bao giờ yêu cầu OTP qua SMS.",
        en: "Do not click it. Banks never ask for OTP by SMS.",
      },
      {
        cell_id: "9b8b8dd7-8c4e-44ff-a1fb-5389a80f7f52",
        speaker: "Linh",
        text: "Kalau begitu saya simpan tangkapan layar dan lapor bank.",
        vi: "Vậy tôi sẽ lưu ảnh chụp màn hình và báo ngân hàng.",
        en: "Then I will save a screenshot and report it to the bank.",
      },
      {
        cell_id: "98e318c3-9f1d-4ba7-9cc4-037bd40041f0",
        speaker: "Rafi",
        text: "Betul. Hubungi layanan resmi lewat aplikasi saja.",
        vi: "Đúng rồi. Chỉ liên hệ dịch vụ chính thức qua ứng dụng thôi.",
        en: "Correct. Contact official support through the app only.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng về an toàn chống lừa đảo online:",
        instruction_en: "Fill in the right online-scam safety word:",
        items: [
          {
            prompt: "Jangan pernah bagikan kode ___ kepada siapa pun. (OTP)",
            answer: "OTP",
            options: ["OTP", "ATM", "COD"],
          },
          {
            prompt: "Link ini ___, jangan diklik dulu. (đáng ngờ)",
            answer: "mencurigakan",
            options: ["mencurigakan", "menyenangkan", "menawarkan"],
          },
          {
            prompt: "Akun saya ___ setelah membuka tautan itu. (bị chiếm)",
            answer: "dibajak",
            options: ["dibajak", "dibayar", "dibuka"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối cụm tiếng Indonesia với nghĩa tiếng Việt:",
        instruction_en: "Match each Indonesian phrase with its Vietnamese meaning:",
        items: [
          { prompt: "transfer palsu", answer: "chuyển khoản giả" },
          { prompt: "lapor bank", answer: "báo ngân hàng" },
          { prompt: "blokir kartu", answer: "khóa thẻ" },
          { prompt: "tangkapan layar", answer: "ảnh chụp màn hình" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Đừng bao giờ chia sẻ mã OTP.", answer: "Jangan pernah bagikan kode OTP." },
          { prompt: "Tài khoản của tôi bị chiếm.", answer: "Akun saya dibajak." },
          { prompt: "Nếu nghi ngờ, hãy liên hệ dịch vụ chính thức.", answer: "Kalau ragu, hubungi layanan resmi." },
        ],
      },
    ],
  },
];

export default lessons;
