// Beauty Salon & Spa Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling Indonesian `extra/*` files (e.g. food-street.ts,
// banking-money.ts), which in turn mirror the French `FrenchLesson` shape. When the
// shared Indonesian registry (src/languages/indonesian/lessons.ts) lands, swap the
// local types for a shared import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// Salon Indonesian is polite-casual: `mbak`/`mas` for staff, the booking verb
// `membuat janji`, and a cluster of `-kan` request verbs (`potongkan`,
// `keramasin`) plus measure phrases (`agak pendek`, `jangan terlalu tipis`). For
// Vietnamese speakers the WIN is no conjugation/gender/tone; the trap is the
// `meN-...-kan` causative ("trim it FOR me"), the comparative `lebih ___`, and
// loan-word pronunciation (`creambath`, `facial`, `spa`).

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
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

// Loosely typed so per-type fields (translation, fill-blank, checklist) can vary.
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
    id: "indonesian_beauty_salon",
    level: "A2",
    category: "services",
    title_vi: "Tiếng Indonesia cho tiệm làm tóc và spa",
    title_en: "Beauty salon and spa Indonesian",
    sentences: [
      // ── Booking & arriving ─────────────────────────────────────────────
      {
        en: "Saya mau membuat janji untuk potong rambut.",
        vi: "Tôi muốn đặt lịch hẹn cắt tóc.",
        pronunciation_focus: [
          "SA-ya mau mem-BU-at JAN-ji UN-tuk PO-tong RAM-but — `membuat janji` = đặt lịch hẹn; `potong rambut` = cắt tóc.",
          "Lỗi người Việt: nói `booking`. Đặt hẹn ở tiệm là `membuat janji`; `potong rambut` (cắt tóc) là cụm cố định.",
          "Luyện: `Saya mau membuat janji untuk potong rambut.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau mem-BU-at JAN-ji UN-tuk PO-tong RAM-but — `membuat janji` = to make an appointment; `potong rambut` = haircut.",
          "VN-speaker trap: saying `booking`. A salon appointment is `membuat janji`; `potong rambut` is the fixed phrase.",
          "Drill: `Saya mau membuat janji untuk potong rambut.`",
        ],
      },
      {
        en: "Apakah ada slot kosong sore ini?",
        vi: "Chiều nay còn chỗ trống không ạ?",
        pronunciation_focus: [
          "a-pa-KAH A-da slot KO-song SO-re I-ni — `ada` = có; `kosong` = trống; `sore ini` = chiều nay.",
          "Lỗi người Việt: nói `pagi/siang/sore` lẫn lộn. `sore` = chiều (~15–18h); `siang` = trưa; `malam` = tối.",
          "Luyện: `Apakah ada slot kosong sore ini?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH A-da slot KO-song SO-re I-ni — `ada` = there is; `kosong` = empty/free; `sore ini` = this afternoon.",
          "VN-speaker trap: mixing `pagi/siang/sore`. `sore` = late afternoon (~3–6pm); `siang` = midday; `malam` = night.",
          "Drill: `Apakah ada slot kosong sore ini?`",
        ],
      },
      // ── Describing the cut you want ────────────────────────────────────
      {
        en: "Tolong potongkan agak pendek, tapi jangan terlalu pendek.",
        vi: "Làm ơn cắt giúp tôi hơi ngắn, nhưng đừng quá ngắn.",
        pronunciation_focus: [
          "TO-long po-TONG-kan A-gak PEN-dek — `potongkan` = cắt GIÚP (gốc `potong` + `-kan` sai khiến); `agak` = hơi; `pendek` = ngắn.",
          "Lỗi người Việt: bỏ `-kan`. `potong` = cắt (chung); `potongkan` = cắt cho/giúp tôi — sắc thái nhờ vả lịch sự.",
          "Luyện: `Tolong potongkan agak pendek, tapi jangan terlalu pendek.`",
        ],
        pronunciation_focus_en: [
          "TO-long po-TONG-kan A-gak PEN-dek — `potongkan` = cut it FOR me (root `potong` + causative `-kan`); `agak` = a bit; `pendek` = short.",
          "VN-speaker trap: dropping `-kan`. `potong` = cut (general); `potongkan` = cut it for me — the polite 'do it for me' nuance.",
          "Drill: `Tolong potongkan agak pendek, tapi jangan terlalu pendek.`",
        ],
      },
      {
        en: "Bagian belakang dirapikan saja, depannya jangan dipotong.",
        vi: "Phía sau chỉ tỉa gọn thôi, phía trước đừng cắt.",
        pronunciation_focus: [
          "ba-GI-an be-la-KANG di-ra-PI-kan SA-ja — `dirapikan` (bị động `di-...-kan`) = được tỉa gọn; `jangan dipotong` = đừng cắt.",
          "Lỗi người Việt: né thể bị động. Ở tiệm rất hay dùng `di-...-kan`: `dirapikan`, `dipotong`, `dikeringkan`.",
          "Luyện: `Bagian belakang dirapikan saja, depannya jangan dipotong.`",
        ],
        pronunciation_focus_en: [
          "ba-GI-an be-la-KANG di-ra-PI-kan SA-ja — `dirapikan` (passive `di-...-kan`) = to be tidied up; `jangan dipotong` = don't cut.",
          "VN-speaker trap: avoiding the passive. Salons lean on `di-...-kan`: `dirapikan`, `dipotong`, `dikeringkan`.",
          "Drill: `Bagian belakang dirapikan saja, depannya jangan dipotong.`",
        ],
      },
      {
        en: "Saya mau model rambut seperti di foto ini.",
        vi: "Tôi muốn kiểu tóc giống trong ảnh này.",
        pronunciation_focus: [
          "SA-ya mau MO-del RAM-but se-PER-ti di FO-to I-ni — `model rambut` = kiểu tóc; `seperti` = giống như; `di foto ini` = trong ảnh này.",
          "Lỗi người Việt: nói `kiểu` trực dịch. 'Kiểu tóc' là `model rambut` (hoặc `gaya rambut`); đưa ảnh là cách an toàn nhất.",
          "Luyện: `Saya mau model rambut seperti di foto ini.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau MO-del RAM-but se-PER-ti di FO-to I-ni — `model rambut` = hairstyle; `seperti` = like; `di foto ini` = in this photo.",
          "VN-speaker trap: word-for-word for 'style'. 'Hairstyle' is `model rambut` (or `gaya rambut`); showing a photo is safest.",
          "Drill: `Saya mau model rambut seperti di foto ini.`",
        ],
      },
      // ── Wash, color, treatments ────────────────────────────────────────
      {
        en: "Sekalian keramas dan blow, ya, Mbak.",
        vi: "Gội đầu và sấy tạo kiểu luôn nhé chị.",
        pronunciation_focus: [
          "se-ka-LI-an ke-RA-mas dan blow — `sekalian` = luôn tiện/luôn thể; `keramas` = gội đầu; `blow` = sấy tạo kiểu.",
          "Lỗi người Việt: nói `cuci rambut`. Gội đầu ở tiệm là `keramas`; `cuci` dùng cho giặt/rửa đồ vật.",
          "Luyện: `Sekalian keramas dan blow, ya, Mbak.`",
        ],
        pronunciation_focus_en: [
          "se-ka-LI-an ke-RA-mas dan blow — `sekalian` = while you're at it; `keramas` = shampoo/wash hair; `blow` = blow-dry/style.",
          "VN-speaker trap: `cuci rambut`. Washing hair is `keramas`; `cuci` is for laundry/dishes.",
          "Drill: `Sekalian keramas dan blow, ya, Mbak.`",
        ],
      },
      {
        en: "Berapa harga semir rambut warna cokelat?",
        vi: "Nhuộm tóc màu nâu giá bao nhiêu ạ?",
        pronunciation_focus: [
          "be-RA-pa HAR-ga se-MIR RAM-but WAR-na co-KE-lat — `semir rambut` = nhuộm tóc; `warna cokelat` = màu nâu.",
          "Lỗi người Việt: nói `cat rambut`. `semir/cat rambut` đều hiểu là nhuộm; `cokelat` (nâu) phát âm 'cô-kê-lát'.",
          "Luyện: `Berapa harga semir rambut warna cokelat?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa HAR-ga se-MIR RAM-but WAR-na co-KE-lat — `semir rambut` = hair dye/color; `warna cokelat` = brown color.",
          "VN-speaker trap: only `cat rambut`. Both `semir/cat rambut` mean to dye; `cokelat` (brown) is 'cho-KEH-laht'.",
          "Drill: `Berapa harga semir rambut warna cokelat?`",
        ],
      },
      {
        en: "Saya mau coba creambath untuk rambut rontok.",
        vi: "Tôi muốn thử creambath (ủ massage tóc) cho tóc rụng.",
        pronunciation_focus: [
          "SA-ya mau CO-ba krim-bat UN-tuk RAM-but RON-tok — `creambath` đọc 'krim-bat'; `rambut rontok` = tóc rụng.",
          "Lỗi người Việt: đọc 'cream-bath' kiểu Anh. Ở Indonesia quen đọc `krim-bat`; đây là liệu pháp ủ + massage.",
          "Luyện: `Saya mau coba creambath untuk rambut rontok.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau CO-ba krim-bat UN-tuk RAM-but RON-tok — `creambath` is said 'krim-baht'; `rambut rontok` = hair loss.",
          "VN-speaker trap: full English 'cream-bath'. Indonesians say `krim-baht`; it's a cream + scalp-massage treatment.",
          "Drill: `Saya mau coba creambath untuk rambut rontok.`",
        ],
      },
      {
        en: "Ada paket facial untuk kulit berminyak?",
        vi: "Có gói chăm sóc da mặt cho da dầu không ạ?",
        pronunciation_focus: [
          "A-da pa-KET FE-si-al UN-tuk KU-lit ber-mi-NYAK — `facial` đọc 'fe-si-al'; `kulit berminyak` = da dầu (gốc `minyak` + `ber-`).",
          "Lỗi người Việt: bỏ `ber-`. 'Da dầu' = `kulit berminyak`; 'da khô' = `kulit kering`; 'da nhạy cảm' = `kulit sensitif`.",
          "Luyện: `Ada paket facial untuk kulit berminyak?`",
        ],
        pronunciation_focus_en: [
          "A-da pa-KET FE-si-al UN-tuk KU-lit ber-mi-NYAK — `facial` is 'FEH-see-al'; `kulit berminyak` = oily skin (root `minyak` + `ber-`).",
          "VN-speaker trap: dropping `ber-`. 'Oily skin' = `kulit berminyak`; 'dry skin' = `kulit kering`; 'sensitive skin' = `kulit sensitif`.",
          "Drill: `Ada paket facial untuk kulit berminyak?`",
        ],
      },
      // ── Manicure / nails / massage ─────────────────────────────────────
      {
        en: "Saya mau menikur dan pedikur juga.",
        vi: "Tôi cũng muốn làm móng tay và móng chân.",
        pronunciation_focus: [
          "SA-ya mau me-ni-KUR dan pe-di-KUR — `manikur` (móng tay), `pedikur` (móng chân); 'sơn móng' = `cat kuku`.",
          "Lỗi người Việt: dùng từ tiếng Anh 'nail'. Tiếng Indonesia: `kuku` = móng; `manikur/pedikur` là từ vay mượn quen dùng.",
          "Luyện: `Saya mau manikur dan pedikur juga.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau me-ni-KUR dan pe-di-KUR — `manikur` (manicure), `pedikur` (pedicure); 'nail polish' = `cat kuku`.",
          "VN-speaker trap: using English 'nail'. In Indonesian: `kuku` = nail; `manikur/pedikur` are the common loanwords.",
          "Drill: `Saya mau manikur dan pedikur juga.`",
        ],
      },
      {
        en: "Pijatnya tolong jangan terlalu keras.",
        vi: "Massage làm ơn đừng mạnh quá.",
        pronunciation_focus: [
          "pi-JAT-nya TO-long JA-ngan ter-LA-lu ke-RAS — `pijat` = massage/bấm huyệt; `keras` = mạnh; cùng khung `jangan terlalu ___`.",
          "Lỗi người Việt: nói `kuat` cho 'mạnh tay'. Lực bấm dùng `keras` (mạnh) / `pelan` (nhẹ).",
          "Luyện: `Pijatnya tolong jangan terlalu keras.`",
        ],
        pronunciation_focus_en: [
          "pi-JAT-nya TO-long JA-ngan ter-LA-lu ke-RAS — `pijat` = massage; `keras` = hard/strong; same `jangan terlalu ___` frame.",
          "VN-speaker trap: `kuat` for pressure. Massage pressure is `keras` (hard) / `pelan` (gentle).",
          "Drill: `Pijatnya tolong jangan terlalu keras.`",
        ],
      },
      // ── Time, price & paying ───────────────────────────────────────────
      {
        en: "Kira-kira berapa lama prosesnya?",
        vi: "Khoảng bao lâu thì xong ạ?",
        pronunciation_focus: [
          "ki-ra-KI-ra be-RA-pa LA-ma PRO-ses-nya — `kira-kira` = khoảng chừng (từ láy); `berapa lama` = mất bao lâu.",
          "Lỗi người Việt: bỏ `kira-kira` nên nghe gắt. Thêm `kira-kira` (ước chừng) làm câu hỏi mềm, lịch sự.",
          "Luyện: `Kira-kira berapa lama prosesnya?`",
        ],
        pronunciation_focus_en: [
          "ki-ra-KI-ra be-RA-pa LA-ma PRO-ses-nya — `kira-kira` = roughly (reduplication); `berapa lama` = how long.",
          "VN-speaker trap: dropping `kira-kira`, sounding blunt. Adding `kira-kira` (about) softens the question politely.",
          "Drill: `Kira-kira berapa lama prosesnya?`",
        ],
      },
      {
        en: "Sudah termasuk keramas dan vitamin rambut?",
        vi: "Đã bao gồm gội đầu và dưỡng tóc chưa ạ?",
        pronunciation_focus: [
          "su-DAH ter-MA-suk ke-RA-mas dan VI-ta-min RAM-but — `sudah termasuk` (`ter-` + masuk) = đã bao gồm; `vitamin rambut` = dưỡng tóc.",
          "Lỗi người Việt: bỏ `ter-`. 'Đã gồm trong giá' là `sudah termasuk` — từ cố định khi hỏi giá dịch vụ.",
          "Luyện: `Sudah termasuk keramas dan vitamin rambut?`",
        ],
        pronunciation_focus_en: [
          "su-DAH ter-MA-suk ke-RA-mas dan VI-ta-min RAM-but — `sudah termasuk` (`ter-` + masuk) = already included; `vitamin rambut` = hair treatment.",
          "VN-speaker trap: dropping `ter-`. 'Included in the price' is `sudah termasuk` — the set phrase for service pricing.",
          "Drill: `Sudah termasuk keramas dan vitamin rambut?`",
        ],
      },
      {
        en: "Hasilnya bagus, makasih ya, Mbak.",
        vi: "Kết quả đẹp lắm, cảm ơn chị nhé.",
        pronunciation_focus: [
          "ha-SIL-nya BA-gus, ma-KA-sih ya, mbak — `hasil` = kết quả; `bagus` = đẹp/tốt; `makasih` = cảm ơn (khẩu ngữ).",
          "Lỗi người Việt: chỉ nói `terima kasih` trang trọng. Ở salon `bagus` + `makasih ya, Mbak` nghe thân thiện, đúng tông.",
          "Luyện: `Hasilnya bagus, makasih ya, Mbak.`",
        ],
        pronunciation_focus_en: [
          "ha-SIL-nya BA-gus, ma-KA-sih ya, mbak — `hasil` = result; `bagus` = nice/good; `makasih` = thanks (colloquial).",
          "VN-speaker trap: only the formal `terima kasih`. At a salon, `bagus` + `makasih ya, Mbak` sounds warm and on-tone.",
          "Drill: `Hasilnya bagus, makasih ya, Mbak.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Tiệm làm đẹp ở Indonesia trải từ `pangkas rambut`/`barbershop` bình dân (cắt tóc nam, ~Rp 20–50 nghìn) đến `salon` và `klinik kecantikan` cao cấp. Dịch vụ quen thuộc: `potong rambut` (cắt tóc), `keramas` (gội), `blow`/`catok` (sấy/duỗi tạo kiểu), `semir`/`cat rambut` (nhuộm), `smoothing`/`rebonding` (ép/duỗi), `creambath` (ủ + massage da đầu, rất phổ biến và thư giãn), `facial`, `manikur`/`pedikur`, `pijat`/`refleksi`, và `spa`. Gọi nhân viên là `Mbak` (nữ trẻ) / `Mas` (nam trẻ); nên `membuat janji` (đặt hẹn) ở salon đông khách. Giá tính bằng `ribu`; nhiều nơi nhận `QRIS`, và 'tip' tuy không bắt buộc nhưng được quý. Nhiều salon Hồi giáo có khu riêng cho nữ trùm khăn (`hijab`) hoặc dịch vụ tại nhà (`home service`). Khi tả kiểu, đưa ảnh (`foto`) là an toàn nhất, kèm các từ đo lường: `pendek` (ngắn), `panjang` (dài), `tipis` (mỏng), `agak` (hơi), `jangan terlalu` (đừng quá).",
    cultural_notes_en:
      "Indonesian beauty spots range from budget `pangkas rambut`/`barbershop` (men's cuts, ~Rp 20–50k) to upscale `salon` and `klinik kecantikan`. Common services: `potong rambut` (haircut), `keramas` (wash), `blow`/`catok` (blow-dry/straighten-style), `semir`/`cat rambut` (color), `smoothing`/`rebonding` (straightening), `creambath` (cream + scalp massage — hugely popular and relaxing), `facial`, `manikur`/`pedikur`, `pijat`/`refleksi` (massage/reflexology), and `spa`. Address staff as `Mbak` (young woman) / `Mas` (young man); `membuat janji` (book) at busy salons. Prices are in `ribu`; many take `QRIS`, and a tip — not required — is appreciated. Many salons offer a women-only area for those in `hijab`, or `home service`. To describe a cut, showing a `foto` is safest, plus measure words: `pendek` (short), `panjang` (long), `tipis` (thin), `agak` (a bit), `jangan terlalu` (not too).",
    tip_advice_vi:
      "Năm khung vàng cho salon: (1) đặt hẹn — `Saya mau membuat janji untuk ___`; (2) tả kiểu nhờ vả (dùng `-kan`) — `Tolong potongkan ___` / `Tolong rapikan ___`; (3) mức độ — `agak ___`, `jangan terlalu ___`, `lebih ___ sedikit`; (4) hỏi giá + thời gian — `Berapa harganya?` / `Kira-kira berapa lama?` / `Sudah termasuk ___?`; (5) phản hồi — `Hasilnya bagus, makasih ya`. Điểm ngữ pháp chính: hậu tố sai khiến `-kan` ('làm GIÚP tôi') — `potong` → `potongkan`, `rapi` → `rapikan`, `kering` → `keringkan`; và thể bị động `di-...-kan` rất hay gặp (`dirapikan`, `dikeringkan`, `dipotong`). Tả da dùng `ber-`: `kulit berminyak` (da dầu). Đừng quên bậc `ribu` khi nói giá.",
    tip_advice_en:
      "Five golden salon frames: (1) book — `Saya mau membuat janji untuk ___`; (2) request a cut (use `-kan`) — `Tolong potongkan ___` / `Tolong rapikan ___`; (3) degree — `agak ___`, `jangan terlalu ___`, `lebih ___ sedikit`; (4) ask price + time — `Berapa harganya?` / `Kira-kira berapa lama?` / `Sudah termasuk ___?`; (5) feedback — `Hasilnya bagus, makasih ya`. Key grammar: the causative `-kan` ('do it FOR me') — `potong` → `potongkan`, `rapi` → `rapikan`, `kering` → `keringkan`; and the passive `di-...-kan`, very common here (`dirapikan`, `dikeringkan`, `dipotong`). Describe skin with `ber-`: `kulit berminyak` (oily skin). Don't forget the `ribu` scale on prices.",
    vocabulary: [
      {
        cell_id: "b3b18dd2-270f-4f80-8aca-27d0707c2f64",
        word: "salon",
        en: "beauty salon",
        vi: "tiệm làm đẹp / salon",
        pos: "noun",
        pronunciation_vi: "SA-lon — `klinik kecantikan` = phòng khám thẩm mỹ",
        pronunciation_en: "SAH-lon — `klinik kecantikan` = beauty clinic",
      },
      {
        cell_id: "f8cd20dc-f3f1-4d40-a386-64ca9520ceb8",
        word: "potong rambut",
        en: "haircut",
        vi: "cắt tóc",
        pos: "noun/verb phrase",
        pronunciation_vi: "PO-tong RAM-but — nhờ cắt giúp = `potongkan`",
        pronunciation_en: "PO-tong RAM-boot — 'cut it for me' = `potongkan`",
      },
      {
        cell_id: "3d6e7199-a97e-4f01-bb7c-301730334edd",
        word: "keramas",
        en: "to shampoo / wash hair",
        vi: "gội đầu",
        pos: "verb",
        pronunciation_vi: "ke-RA-mas — KHÁC `cuci` (giặt/rửa đồ)",
        pronunciation_en: "ke-RAH-mas — NOT `cuci` (laundry/dishes)",
      },
      {
        cell_id: "a9e5b239-6216-437d-b3e8-7da141566e77",
        word: "semir rambut",
        en: "hair dye / coloring",
        vi: "nhuộm tóc",
        pos: "noun/verb phrase",
        pronunciation_vi: "se-MIR RAM-but — đồng nghĩa `cat rambut`",
        pronunciation_en: "se-MIR RAM-boot — synonym `cat rambut`",
      },
      {
        cell_id: "1754f7ba-3bf0-4308-8a8d-96c5d2750d90",
        word: "creambath",
        en: "cream + scalp-massage treatment",
        vi: "ủ và massage da đầu",
        pos: "noun",
        pronunciation_vi: "krim-bat — đọc 'krim-bat', không phải kiểu Anh",
        pronunciation_en: "krim-baht — said 'krim-baht', not full English",
      },
      {
        cell_id: "315a03a7-86e3-4eb5-a6c7-6d7209fba78f",
        word: "facial",
        en: "facial / skincare treatment",
        vi: "chăm sóc da mặt",
        pos: "noun",
        pronunciation_vi: "FE-si-al — `kulit berminyak/kering/sensitif`",
        pronunciation_en: "FEH-see-al — `kulit berminyak/kering/sensitif`",
      },
      {
        cell_id: "ce4f60d6-8c2b-4eeb-be53-e252890eda58",
        word: "manikur / pedikur",
        en: "manicure / pedicure",
        vi: "làm móng tay / móng chân",
        pos: "noun",
        pronunciation_vi: "ma-ni-KUR / pe-di-KUR — móng = `kuku`; sơn móng = `cat kuku`",
        pronunciation_en: "ma-nee-KUR / pe-dee-KUR — nail = `kuku`; polish = `cat kuku`",
      },
      {
        cell_id: "c414e081-a69b-4655-a4b7-fa80af5541b3",
        word: "pijat",
        en: "massage",
        vi: "massage / bấm huyệt",
        pos: "noun/verb",
        pronunciation_vi: "pi-JAT — lực: `keras` (mạnh) / `pelan` (nhẹ)",
        pronunciation_en: "pee-JAHT — pressure: `keras` (hard) / `pelan` (gentle)",
      },
      {
        cell_id: "f1844329-578c-4883-a60e-3a1ad7d7b8d0",
        word: "agak",
        en: "a bit / somewhat",
        vi: "hơi, một chút",
        pos: "adv.",
        pronunciation_vi: "A-gak — `agak pendek` = hơi ngắn",
        pronunciation_en: "AH-gak — `agak pendek` = a bit short",
      },
      {
        cell_id: "a37bbc89-0d7a-4661-9c46-1a1e652e9b29",
        word: "jangan terlalu",
        en: "not too (much)",
        vi: "đừng quá",
        pos: "phrase",
        pronunciation_vi: "JA-ngan ter-LA-lu — `jangan terlalu pendek` = đừng quá ngắn",
        pronunciation_en: "JAH-ngan ter-LAH-loo — `jangan terlalu pendek` = not too short",
      },
      {
        cell_id: "e0a7abcd-e282-4998-97fc-5d6d2226ac3f",
        word: "membuat janji",
        en: "to make an appointment",
        vi: "đặt lịch hẹn",
        pos: "verb phrase",
        pronunciation_vi: "mem-BU-at JAN-ji — KHÁC nói `booking` tiếng Anh",
        pronunciation_en: "mem-BOO-at JAN-jee — not English `booking`",
      },
      {
        cell_id: "faad65cf-1d48-4754-b8b9-614963a7ee2d",
        word: "sudah termasuk",
        en: "already included",
        vi: "đã bao gồm",
        pos: "phrase (ter-)",
        pronunciation_vi: "su-DAH ter-MA-suk — hỏi giá dịch vụ luôn dùng cụm này",
        pronunciation_en: "soo-DAH ter-MAH-sook — the set phrase when asking what's included",
      },
    ],
    dialogue: [
      {
        cell_id: "2397b055-71e5-480a-b2d0-ec00d17c1a72",
        speaker: "Pelanggan",
        text: "Mbak, saya mau membuat janji untuk potong rambut. Ada slot sore ini?",
        vi: "Chị ơi, tôi muốn đặt hẹn cắt tóc. Chiều nay còn chỗ không?",
        en: "Hi, I'd like to book a haircut. Any slot this afternoon?",
      },
      {
        cell_id: "b36760f9-cab4-4659-b7e5-fc34fd9775d7",
        speaker: "Staf",
        text: "Ada, jam empat. Mau model seperti apa, Mbak?",
        vi: "Có, bốn giờ. Chị muốn kiểu như thế nào ạ?",
        en: "Yes, at four. What style would you like?",
      },
      {
        cell_id: "28f5aee6-b309-49f6-adbc-ec20830c2eee",
        speaker: "Pelanggan",
        text: "Seperti di foto ini. Tolong potongkan agak pendek, tapi jangan terlalu pendek.",
        vi: "Giống trong ảnh này. Làm ơn cắt hơi ngắn, nhưng đừng quá ngắn.",
        en: "Like this photo. Cut it a bit short, but not too short.",
      },
      {
        cell_id: "376c8f1b-4d07-4538-a9ed-14a263c95080",
        speaker: "Staf",
        text: "Baik. Sekalian keramas dan blow? Sudah termasuk vitamin rambut.",
        vi: "Vâng. Gội và sấy tạo kiểu luôn nhé? Đã gồm dưỡng tóc.",
        en: "Sure. Shampoo and blow-dry too? Hair treatment is included.",
      },
      {
        cell_id: "b9b5cba7-ead2-412a-81ca-9ebf92d6e615",
        speaker: "Pelanggan",
        text: "Boleh. Kira-kira berapa lama dan berapa semuanya?",
        vi: "Được. Khoảng bao lâu và tất cả bao nhiêu?",
        en: "Okay. About how long, and how much altogether?",
      },
      {
        cell_id: "8454a13d-9e0d-4f4c-bfe5-db3442bb68b0",
        speaker: "Staf",
        text: "Sekitar satu jam, semuanya seratus lima puluh ribu. Bisa QRIS.",
        vi: "Khoảng một tiếng, tất cả một trăm năm mươi nghìn. Có thể QRIS.",
        en: "Around an hour, a hundred and fifty thousand total. QRIS works.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn đặt lịch hẹn cắt tóc.", answer: "Saya mau membuat janji untuk potong rambut." },
          { prompt: "Làm ơn cắt giúp hơi ngắn, đừng quá ngắn.", answer: "Tolong potongkan agak pendek, jangan terlalu pendek." },
          { prompt: "Gội đầu và sấy tạo kiểu luôn nhé chị.", answer: "Sekalian keramas dan blow, ya, Mbak." },
          { prompt: "Khoảng bao lâu thì xong ạ?", answer: "Kira-kira berapa lama prosesnya?" },
          { prompt: "Kết quả đẹp lắm, cảm ơn chị nhé.", answer: "Hasilnya bagus, makasih ya, Mbak." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — dịch vụ và mức độ:",
        instruction_en: "Extra practice — services and degree:",
        items: [
          { prompt: "Tôi muốn kiểu tóc giống trong ảnh này.", answer: "Saya mau model rambut seperti di foto ini." },
          { prompt: "Có gói chăm sóc da mặt cho da dầu không?", answer: "Ada paket facial untuk kulit berminyak?" },
          { prompt: "Massage làm ơn đừng mạnh quá.", answer: "Pijatnya tolong jangan terlalu keras." },
          { prompt: "Nhuộm tóc màu nâu giá bao nhiêu?", answer: "Berapa harga semir rambut warna cokelat?" },
          { prompt: "Đã bao gồm gội đầu chưa ạ?", answer: "Sudah termasuk keramas?" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Thêm hậu tố sai khiến `-kan` ('làm GIÚP tôi'): `potong` → ___, `rapi` → ___, `kering` → ___, `lurus` → ___.",
        instruction_en:
          "Add the causative `-kan` ('do it FOR me'): `potong` → ___, `rapi` → ___, `kering` → ___, `lurus` → ___.",
        items: [
          { prompt: "potong (cắt) →", answer: "potongkan" },
          { prompt: "rapi (gọn) →", answer: "rapikan" },
          { prompt: "kering (khô) →", answer: "keringkan" },
          { prompt: "lurus (thẳng) →", answer: "luruskan" },
        ],
      },
      {
        type: "term_match",
        instruction_vi: "Ghép dịch vụ/từ với nghĩa:",
        instruction_en: "Match the service/word to its meaning:",
        items: [
          { prompt: "keramas", answer: "gội đầu (to wash hair)" },
          { prompt: "creambath", answer: "ủ + massage da đầu (cream + scalp massage)" },
          { prompt: "semir rambut", answer: "nhuộm tóc (hair coloring)" },
          { prompt: "kulit berminyak", answer: "da dầu (oily skin)" },
          { prompt: "membuat janji", answer: "đặt lịch hẹn (to make an appointment)" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung yêu cầu ở salon — điền chỗ trống: `Mbak/Mas, saya mau ___. Tolong potongkan ___, jangan terlalu ___. Kira-kira berapa lama dan berapa harganya?`",
        instruction_en:
          "Salon-request frame — fill the blanks: `Mbak/Mas, saya mau ___. Tolong potongkan ___, jangan terlalu ___. Kira-kira berapa lama dan berapa harganya?`",
        example:
          "Mbak, saya mau potong rambut seperti di foto ini. Tolong potongkan agak pendek, jangan terlalu pendek. Kira-kira berapa lama dan berapa harganya?",
        example_vi:
          "Chị ơi, tôi muốn cắt tóc giống ảnh này. Làm ơn cắt hơi ngắn, đừng quá ngắn. Khoảng bao lâu và giá bao nhiêu?",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra ở salon — bạn làm được chưa?",
        instruction_en: "Quick salon self-check — can you do each one?",
        items: [
          { vi: "Tôi đặt hẹn bằng `membuat janji` và gọi nhân viên `Mbak/Mas`.", en: "I book with `membuat janji` and address staff as `Mbak/Mas`." },
          { vi: "Tôi nhờ vả bằng hậu tố `-kan` (`potongkan`, `rapikan`).", en: "I make requests with the `-kan` suffix (`potongkan`, `rapikan`)." },
          { vi: "Tôi điều chỉnh mức độ: `agak ___`, `jangan terlalu ___`.", en: "I adjust degree: `agak ___`, `jangan terlalu ___`." },
          { vi: "Tôi tả da bằng `ber-`: `kulit berminyak/kering/sensitif`.", en: "I describe skin with `ber-`: `kulit berminyak/kering/sensitif`." },
          { vi: "Tôi hỏi giá, thời gian và `sudah termasuk ___?`.", en: "I ask price, time, and `sudah termasuk ___?`." },
          { vi: "Tôi phân biệt `keramas` (gội đầu) và `cuci` (giặt/rửa).", en: "I distinguish `keramas` (wash hair) from `cuci` (laundry/dishes)." },
        ],
      },
    ],
  },
];

export default lessons;
