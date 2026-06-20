// Supermarket Membership & Returns Indonesian (Vietnamese -> Indonesian study track).
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

export const supermarketMembershipReturnLessons: IndonesianLesson[] = [
  {
    id: "indonesian_supermarket_member_cashier_promo",
    level: "A2",
    category: "shopping",
    title_vi: "Siêu thị: thẻ member, điểm và khuyến mãi",
    title_en: "Supermarket: member cards, points and promos",
    sentences: [
      {
        en: "Saya mau daftar kartu member supermarket.",
        vi: "Tôi muốn đăng ký thẻ thành viên siêu thị.",
        pronunciation_focus: [
          "SA-ya mau DAF-tar KAR-tu MEM-ber su-per-MAR-ket - `daftar` = đăng ký; `kartu member` = thẻ thành viên.",
          "Lỗi người Việt: nói `membuat member` theo kiểu dịch thẳng. Tự nhiên hơn: `daftar kartu member` hoặc `jadi member`.",
          "Luyện: `Saya mau daftar kartu member.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau DAF-tar KAR-too MEM-ber su-per-MAR-ket - `daftar` = register; `kartu member` = member card.",
          "VN-speaker trap: saying literal `membuat member`. More natural: `daftar kartu member` or `jadi member`.",
          "Drill: `Saya mau daftar kartu member.`",
        ],
      },
      {
        en: "Poin belanja saya bisa dipakai untuk diskon?",
        vi: "Điểm mua sắm của tôi có thể dùng để giảm giá không?",
        pronunciation_focus: [
          "PO-in be-LAN-ja SA-ya BI-sa di-PA-kai un-TUK DIS-kon - `poin belanja` = điểm mua sắm; `dipakai` = được dùng.",
          "Lỗi người Việt: dùng `gunakan` quá trang trọng ở quầy tính tiền. Trong hội thoại siêu thị, `pakai`/`dipakai` rất tự nhiên.",
          "Luyện: `Poin belanja bisa dipakai?`",
        ],
        pronunciation_focus_en: [
          "PO-in be-LAN-ja SA-ya BEE-sa di-PA-kai un-TOOK DIS-kon - `poin belanja` = shopping points; `dipakai` = used.",
          "VN-speaker trap: using formal `gunakan` at checkout. In supermarket talk, `pakai`/`dipakai` is natural.",
          "Drill: `Poin belanja bisa dipakai?`",
        ],
      },
      {
        en: "Kasirnya bilang promo ini hanya untuk member.",
        vi: "Thu ngân nói khuyến mãi này chỉ dành cho thành viên.",
        pronunciation_focus: [
          "KA-sir-nya BI-lang PRO-mo I-ni HA-nya un-TUK MEM-ber - `kasir` = thu ngân; `hanya untuk member` = chỉ dành cho thành viên.",
          "Lỗi người Việt: nhầm `kasir` với `kassir` theo chính tả nước khác. Tiếng Indonesia viết một `s`: `kasir`.",
          "Luyện: `Promo ini hanya untuk member.`",
        ],
        pronunciation_focus_en: [
          "KA-seer-nya BEE-lang PRO-mo EE-ni HA-nya un-TOOK MEM-ber - `kasir` = cashier; `hanya untuk member` = only for members.",
          "VN-speaker trap: spelling `kasir` like `kassir`. Indonesian uses one `s`: `kasir`.",
          "Drill: `Promo ini hanya untuk member.`",
        ],
      },
      {
        en: "Tolong struknya jangan dibuang dulu.",
        vi: "Làm ơn đừng vứt hóa đơn đi vội.",
        pronunciation_focus: [
          "TO-long struk-nya JA-ngan di-BU-ang DU-lu - `struk` = hóa đơn/biên lai; `jangan dibuang dulu` = đừng vứt vội.",
          "Lỗi người Việt: dùng `nota` cho mọi biên lai. Ở siêu thị/máy tính tiền, `struk` rất phổ biến.",
          "Luyện: `Struknya jangan dibuang dulu.`",
        ],
        pronunciation_focus_en: [
          "TO-long strook-nya JA-ngan di-BOO-ang DOO-loo - `struk` = receipt; `jangan dibuang dulu` = don't throw it away yet.",
          "VN-speaker trap: using `nota` for every receipt. At supermarkets/cash registers, `struk` is very common.",
          "Drill: `Struknya jangan dibuang dulu.`",
        ],
      },
      {
        en: "Total belanja saya sudah termasuk promo?",
        vi: "Tổng tiền mua sắm của tôi đã bao gồm khuyến mãi chưa?",
        pronunciation_focus: [
          "TO-tal be-LAN-ja SA-ya SU-dah ter-MA-suk PRO-mo - `total belanja` = tổng tiền mua; `termasuk` = bao gồm.",
          "Lỗi người Việt: hỏi `sudah masuk promo?` dễ mơ hồ. Rõ hơn: `sudah termasuk promo?`.",
          "Luyện: `Sudah termasuk promo?`",
        ],
        pronunciation_focus_en: [
          "TO-tal be-LAN-ja SA-ya SOO-dah ter-MA-sook PRO-mo - `total belanja` = shopping total; `termasuk` = included.",
          "VN-speaker trap: asking `sudah masuk promo?`, which can be vague. Clearer: `sudah termasuk promo?`.",
          "Drill: `Sudah termasuk promo?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Nhiều siêu thị Indonesia có `kartu member`, app thành viên, điểm belanja, và promo riêng cho member. Ở quầy kasir, nhân viên thường hỏi số điện thoại member hoặc quét mã app. Giữ `struk` nếu cần kiểm tra giá, đổi trả, hoặc báo barang bermasalah.",
    cultural_notes_en:
      "Many Indonesian supermarkets have member cards, membership apps, shopping points, and member-only promos. At checkout, the cashier often asks for a member phone number or scans an app code. Keep the `struk` if you need to check prices, return items, or report a problem item.",
    tip_advice_vi:
      "Khung cần nhớ: `daftar kartu member`, `poin belanja bisa dipakai?`, `struknya jangan dibuang dulu`, `sudah termasuk promo?`. `Promo` trong Indonesia dùng rất rộng cho giảm giá, ưu đãi, và chương trình thành viên.",
    tip_advice_en:
      "Useful frames: `daftar kartu member`, `poin belanja bisa dipakai?`, `struknya jangan dibuang dulu`, `sudah termasuk promo?`. `Promo` in Indonesian broadly covers discounts, offers, and membership deals.",
    vocabulary: [
      {
        word: "supermarket",
        en: "supermarket",
        vi: "siêu thị",
        pos: "noun",
        pronunciation_vi: "su-per-MAR-ket",
        pronunciation_en: "su-per-MAR-ket",
      },
      {
        word: "kartu member",
        en: "member card",
        vi: "thẻ thành viên",
        pos: "noun phrase",
        pronunciation_vi: "KAR-tu MEM-ber",
        pronunciation_en: "KAR-too MEM-ber",
      },
      {
        word: "poin belanja",
        en: "shopping points",
        vi: "điểm mua sắm",
        pos: "noun phrase",
        pronunciation_vi: "PO-in be-LAN-ja",
        pronunciation_en: "PO-in be-LAN-ja",
      },
      {
        word: "kasir",
        en: "cashier",
        vi: "thu ngân",
        pos: "noun",
        pronunciation_vi: "KA-sir",
        pronunciation_en: "KA-seer",
      },
      {
        word: "struk",
        en: "receipt",
        vi: "hóa đơn / biên lai",
        pos: "noun",
        pronunciation_vi: "struk",
        pronunciation_en: "strook",
      },
      {
        word: "promo",
        en: "promotion / discount offer",
        vi: "khuyến mãi / ưu đãi",
        pos: "noun",
        pronunciation_vi: "PRO-mo",
        pronunciation_en: "PRO-mo",
      },
    ],
    dialogue: [
      {
        speaker: "Kasir",
        text: "Ada kartu member, Kak?",
        vi: "Bạn có thẻ thành viên không?",
        en: "Do you have a member card?",
      },
      {
        speaker: "Pelanggan",
        text: "Ada. Poin belanja saya bisa dipakai untuk diskon?",
        vi: "Có. Điểm mua sắm của tôi có dùng để giảm giá được không?",
        en: "Yes. Can my shopping points be used for a discount?",
      },
      {
        speaker: "Kasir",
        text: "Bisa, tapi promo ini hanya untuk member.",
        vi: "Được, nhưng khuyến mãi này chỉ dành cho thành viên.",
        en: "Yes, but this promo is only for members.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya mau daftar kartu ___.`",
        prompt_en: "Fill in: `Saya mau daftar kartu ___.`",
        answer: "member",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Đừng vứt hóa đơn đi vội.",
        prompt_en: "Translate to Indonesian: Don't throw away the receipt yet.",
        answer: "Struknya jangan dibuang dulu.",
      },
      {
        type: "choice",
        prompt_vi: "Từ nào nghĩa là thu ngân?",
        prompt_en: "Which word means cashier?",
        options: ["kasir", "promo", "struk"],
        answer: "kasir",
      },
    ],
  },
  {
    id: "indonesian_supermarket_return_expired_goods",
    level: "B1",
    category: "shopping",
    title_vi: "Đổi trả hàng và hàng hết hạn",
    title_en: "Returns and expired goods",
    sentences: [
      {
        en: "Saya mau retur barang karena salah beli ukuran.",
        vi: "Tôi muốn trả/đổi hàng vì mua nhầm kích cỡ.",
        pronunciation_focus: [
          "SA-ya mau re-TUR BA-rang ka-RE-na SA-lah be-LI u-KU-ran - `retur barang` = đổi/trả hàng; `salah beli` = mua nhầm.",
          "Lỗi người Việt: dùng `kembali barang` theo dịch thẳng. Trong mua bán, dùng `retur barang` hoặc `tukar barang`.",
          "Luyện: `Saya mau retur barang.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau re-TOOR BA-rang ka-RE-na SA-lah be-LEE u-KU-ran - `retur barang` = return goods; `salah beli` = bought the wrong one.",
          "VN-speaker trap: saying literal `kembali barang`. In shopping, use `retur barang` or `tukar barang`.",
          "Drill: `Saya mau retur barang.`",
        ],
      },
      {
        en: "Barang ini kedaluwarsa sejak minggu lalu.",
        vi: "Món hàng này đã hết hạn từ tuần trước.",
        pronunciation_focus: [
          "BA-rang I-ni ke-da-lu-WAR-sa se-JAK MING-gu LA-lu - `kedaluwarsa` = hết hạn; `sejak` = từ.",
          "Lỗi người Việt: nói `mati tanggal` theo kiểu dịch từ 'hạn'. Tiếng Indonesia dùng `kedaluwarsa` hoặc `expired` trong nói thường.",
          "Luyện: `Barang ini kedaluwarsa.`",
        ],
        pronunciation_focus_en: [
          "BA-rang EE-ni ke-da-loo-WAR-sa se-JAK MING-goo LA-loo - `kedaluwarsa` = expired; `sejak` = since.",
          "VN-speaker trap: literal date wording. Indonesian uses `kedaluwarsa` or casual `expired`.",
          "Drill: `Barang ini kedaluwarsa.`",
        ],
      },
      {
        en: "Saya masih punya struk pembelian kemarin.",
        vi: "Tôi vẫn còn hóa đơn mua hàng hôm qua.",
        pronunciation_focus: [
          "SA-ya MA-sih PU-nya struk pem-BE-li-an ke-MA-rin - `struk pembelian` = hóa đơn mua hàng; `kemarin` = hôm qua.",
          "Lỗi người Việt: quên `masih` khi nói 'vẫn còn'. Câu tự nhiên: `saya masih punya struk`.",
          "Luyện: `Saya masih punya struk.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MA-sih POO-nya strook pem-BE-li-an ke-MA-rin - `struk pembelian` = purchase receipt; `kemarin` = yesterday.",
          "VN-speaker trap: dropping `masih` for 'still have'. Natural phrase: `saya masih punya struk`.",
          "Drill: `Saya masih punya struk.`",
        ],
      },
      {
        en: "Bisa ditukar dengan barang yang belum kedaluwarsa?",
        vi: "Có thể đổi sang món chưa hết hạn không?",
        pronunciation_focus: [
          "BI-sa di-TU-kar de-NGAN BA-rang yang be-LUM ke-da-lu-WAR-sa - `ditukar` = được đổi; `belum kedaluwarsa` = chưa hết hạn.",
          "Lỗi người Việt: dùng `tidak kedaluwarsa` khi ý là 'chưa'. Với hạn sử dụng, `belum kedaluwarsa` rõ hơn.",
          "Luyện: `Bisa ditukar?`",
        ],
        pronunciation_focus_en: [
          "BEE-sa di-TOO-kar de-NGAN BA-rang yang be-LOOM ke-da-loo-WAR-sa - `ditukar` = exchanged; `belum kedaluwarsa` = not expired yet.",
          "VN-speaker trap: using `tidak kedaluwarsa` when you mean 'not yet'. For expiry, `belum kedaluwarsa` is clearer.",
          "Drill: `Bisa ditukar?`",
        ],
      },
      {
        en: "Kalau tidak bisa retur, saya minta bicara dengan supervisor.",
        vi: "Nếu không thể trả hàng, tôi xin nói chuyện với quản lý.",
        pronunciation_focus: [
          "KA-lau TI-dak BI-sa re-TUR, SA-ya MIN-ta bi-CA-ra de-NGAN su-per-VAI-sor - `minta bicara` = xin nói chuyện; `supervisor` = quản lý ca/quầy.",
          "Lỗi người Việt: nói quá gắt khi khiếu nại. `Saya minta bicara dengan supervisor` rõ ràng nhưng vẫn lịch sự.",
          "Luyện: `Saya minta bicara dengan supervisor.`",
        ],
        pronunciation_focus_en: [
          "KA-lau TEE-dak BEE-sa re-TOOR, SA-ya MIN-ta bi-CHA-ra de-NGAN su-per-VY-sor - `minta bicara` = ask to speak; `supervisor` = supervisor/manager on duty.",
          "VN-speaker trap: sounding too harsh in complaints. `Saya minta bicara dengan supervisor` is clear but still polite.",
          "Drill: `Saya minta bicara dengan supervisor.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở siêu thị Indonesia, chính sách `retur barang` thường cần `struk`, hàng còn nguyên, và thời hạn đổi trả ngắn. Với thực phẩm `kedaluwarsa`, nên chụp ngày hết hạn, giữ bao bì, giữ struk, và nói rõ bạn muốn `ditukar` hay `refund`.",
    cultural_notes_en:
      "In Indonesian supermarkets, return policies usually require a receipt, intact goods, and a short return window. For expired food, photograph the expiry date, keep the packaging, keep the receipt, and state clearly whether you want an exchange or a refund.",
    tip_advice_vi:
      "Dùng giọng bình tĩnh: `Saya mau retur barang`, `barang ini kedaluwarsa`, `saya masih punya struk`, `bisa ditukar?`. Với nhân viên, `minta bicara dengan supervisor` lịch sự hơn là nổi giận ở quầy.",
    tip_advice_en:
      "Use a calm tone: `Saya mau retur barang`, `barang ini kedaluwarsa`, `saya masih punya struk`, `bisa ditukar?`. With staff, `minta bicara dengan supervisor` is more polite than getting angry at the counter.",
    vocabulary: [
      {
        word: "retur barang",
        en: "return goods",
        vi: "trả/đổi hàng",
        pos: "verb/noun phrase",
        pronunciation_vi: "re-TUR BA-rang",
        pronunciation_en: "re-TOOR BA-rang",
      },
      {
        word: "kedaluwarsa",
        en: "expired",
        vi: "hết hạn",
        pos: "adjective",
        pronunciation_vi: "ke-da-lu-WAR-sa",
        pronunciation_en: "ke-da-loo-WAR-sa",
      },
      {
        word: "struk pembelian",
        en: "purchase receipt",
        vi: "hóa đơn mua hàng",
        pos: "noun phrase",
        pronunciation_vi: "struk pem-BE-li-an",
        pronunciation_en: "strook pem-BE-li-an",
      },
      {
        word: "ditukar",
        en: "exchanged",
        vi: "được đổi",
        pos: "verb",
        pronunciation_vi: "di-TU-kar",
        pronunciation_en: "di-TOO-kar",
      },
      {
        word: "supervisor",
        en: "supervisor",
        vi: "quản lý ca/quầy",
        pos: "noun",
        pronunciation_vi: "su-per-VAI-sor",
        pronunciation_en: "su-per-VY-sor",
      },
      {
        word: "refund",
        en: "refund",
        vi: "hoàn tiền",
        pos: "noun/verb",
        pronunciation_vi: "RI-fund",
        pronunciation_en: "REE-fund",
      },
    ],
    dialogue: [
      {
        speaker: "Pelanggan",
        text: "Permisi, saya mau retur barang. Ini kedaluwarsa sejak minggu lalu.",
        vi: "Xin lỗi, tôi muốn trả/đổi hàng. Món này đã hết hạn từ tuần trước.",
        en: "Excuse me, I want to return this item. It expired last week.",
      },
      {
        speaker: "Kasir",
        text: "Apakah masih ada struk pembeliannya?",
        vi: "Vẫn còn hóa đơn mua hàng không?",
        en: "Do you still have the purchase receipt?",
      },
      {
        speaker: "Pelanggan",
        text: "Ada. Bisa ditukar dengan barang yang belum kedaluwarsa?",
        vi: "Có. Có thể đổi sang món chưa hết hạn không?",
        en: "Yes. Can it be exchanged for an item that has not expired?",
      },
      {
        speaker: "Kasir",
        text: "Saya cek dulu dengan supervisor, ya.",
        vi: "Tôi kiểm tra với quản lý trước nhé.",
        en: "I'll check with the supervisor first.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Barang ini ___ sejak minggu lalu.`",
        prompt_en: "Fill in: `Barang ini ___ sejak minggu lalu.`",
        answer: "kedaluwarsa",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Tôi vẫn còn hóa đơn.",
        prompt_en: "Translate to Indonesian: I still have the receipt.",
        answer: "Saya masih punya struk.",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `retur barang`, `kedaluwarsa`, `ditukar`.",
        prompt_en: "Match meanings: `retur barang`, `kedaluwarsa`, `ditukar`.",
        pairs: [
          ["retur barang", "trả/đổi hàng / return goods"],
          ["kedaluwarsa", "hết hạn / expired"],
          ["ditukar", "được đổi / exchanged"],
        ],
      },
    ],
  },
];
