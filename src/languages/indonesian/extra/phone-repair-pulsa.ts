// Phone Repair & Pulsa Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It mirrors sibling Indonesian `extra/*`
// files: target-language text is stored in `en`, Vietnamese glosses in `vi`,
// Vietnamese-facing L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.
//
// Register note: Indonesian phone-shop language mixes everyday Indonesian with
// app and electronics terms: `servis HP`, `layar retak`, `baterai`, `garansi`,
// `pulsa`, `paket data`, `isi ulang`, and `kartu SIM`. In real shops, short,
// polite problem statements work better than long explanations.

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
  speaker: string;
  /** Indonesian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
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
    id: "indonesian_phone_repair_pulsa",
    level: "A2",
    category: "technology",
    title_vi: "Sửa điện thoại, pulsa và gói dữ liệu",
    title_en: "Phone repair, pulsa and data packages",
    sentences: [
      {
        en: "Saya mau servis HP ini.",
        vi: "Tôi muốn sửa cái điện thoại này.",
        pronunciation_focus: [
          "SA-ya mau SER-vis ha-PE I-ni - `servis HP` = sửa/bảo dưỡng điện thoại.",
          "Lỗi người Việt: nói `telepon` cho smartphone. Ở Indonesia hằng ngày nói `HP` hoặc `ponsel`; tiệm sửa thường nói `servis HP`.",
          "Luyện: `Saya mau servis HP ini.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau SER-vis ha-PE I-ni - `servis HP` = repair/service this phone.",
          "VN-speaker trap: saying `telepon` for a smartphone. Indonesians usually say `HP` or `ponsel`; repair shops say `servis HP`.",
          "Drill: `Saya mau servis HP ini.`",
        ],
      },
      {
        en: "Layarnya retak setelah jatuh.",
        vi: "Màn hình bị nứt sau khi rơi.",
        pronunciation_focus: [
          "LA-yar-nya RE-tak se-TE-lah JA-tuh - `layar` = màn hình; `retak` = nứt; `jatuh` = rơi.",
          "Lỗi người Việt: dùng `pecah` cho mọi vết hư. `Retak` = nứt; `pecah` = vỡ nặng hơn.",
          "Luyện: `Layarnya retak.`",
        ],
        pronunciation_focus_en: [
          "LA-yar-nya REH-tak se-TE-lah JA-tooh - `layar` = screen; `retak` = cracked; `jatuh` = fell.",
          "VN-speaker trap: using `pecah` for every damage. `Retak` = cracked; `pecah` = broken/shattered.",
          "Drill: `Layarnya retak.`",
        ],
      },
      {
        en: "Baterainya cepat habis.",
        vi: "Pin hết rất nhanh.",
        pronunciation_focus: [
          "ba-TE-rai-nya CE-pat HA-bis - `baterai` = pin; `cepat habis` = nhanh hết.",
          "Lỗi người Việt: dịch 'pin yếu' thành `baterai lemah`. Tự nhiên hơn khi pin tụt nhanh: `baterainya cepat habis`.",
          "Luyện: `Baterainya cepat habis.`",
        ],
        pronunciation_focus_en: [
          "ba-TEH-rai-nya CHEH-pat HA-bis - `baterai` = battery; `cepat habis` = runs out quickly.",
          "VN-speaker trap: translating 'weak battery' as `baterai lemah`. If it drains fast, say `baterainya cepat habis`.",
          "Drill: `Baterainya cepat habis.`",
        ],
      },
      {
        en: "HP saya tidak bisa dicas.",
        vi: "Điện thoại của tôi không sạc được.",
        pronunciation_focus: [
          "ha-PE SA-ya TI-dak BI-sa di-CAS - `dicas` = được sạc/bị sạc; từ gốc app/đời thường `cas`.",
          "Lỗi người Việt: nói `charge` bằng tiếng Anh trong câu Indonesia. Ở tiệm thường nghe `cas` / `dicas`.",
          "Luyện: `HP saya tidak bisa dicas.`",
        ],
        pronunciation_focus_en: [
          "ha-PEH SA-ya TEE-dak BEE-sa dee-CHAS - `dicas` = be charged; from everyday `cas`.",
          "VN-speaker trap: inserting English `charge`. In shops you often hear `cas` / `dicas`.",
          "Drill: `HP saya tidak bisa dicas.`",
        ],
      },
      {
        en: "Berapa biaya ganti layar?",
        vi: "Thay màn hình hết bao nhiêu tiền?",
        pronunciation_focus: [
          "be-RA-pa BI-a-ya GAN-ti LA-yar - `biaya` = chi phí; `ganti layar` = thay màn hình.",
          "Lỗi người Việt: hỏi `berapa harga servis?` quá rộng. Nói rõ bộ phận: `biaya ganti layar`.",
          "Luyện: `Berapa biaya ganti layar?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa BEE-a-ya GAN-tee LA-yar - `biaya` = cost; `ganti layar` = replace the screen.",
          "VN-speaker trap: asking broad `berapa harga servis?`. Name the part: `biaya ganti layar`.",
          "Drill: `Berapa biaya ganti layar?`",
        ],
      },
      {
        en: "Apakah masih ada garansi?",
        vi: "Còn bảo hành không?",
        pronunciation_focus: [
          "a-PA-kah MA-sih A-da ga-RAN-si - `garansi` = bảo hành; `masih ada` = vẫn còn.",
          "Lỗi người Việt: dùng `jaminan` cho bảo hành sản phẩm. Trong cửa hàng điện thoại, dùng `garansi`.",
          "Luyện: `Masih ada garansi?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah MA-seeh A-da ga-RAN-see - `garansi` = warranty; `masih ada` = still exists/remains.",
          "VN-speaker trap: using `jaminan` for product warranty. In phone shops, use `garansi`.",
          "Drill: `Masih ada garansi?`",
        ],
      },
      {
        en: "Servisnya selesai kapan?",
        vi: "Khi nào sửa xong?",
        pronunciation_focus: [
          "SER-vis-nya se-LE-sai KA-pan - `selesai` = xong; `kapan` = khi nào.",
          "Lỗi người Việt: nói `kapan habis?` theo nghĩa 'xong'. Công việc xong là `selesai`, không phải `habis`.",
          "Luyện: `Selesai kapan?`",
        ],
        pronunciation_focus_en: [
          "SER-vis-nya se-LEH-sai KA-pan - `selesai` = finished; `kapan` = when.",
          "VN-speaker trap: using `habis` to mean 'finished' for work. A repair is `selesai`, not `habis`.",
          "Drill: `Selesai kapan?`",
        ],
      },
      {
        en: "Saya mau beli pulsa lima puluh ribu.",
        vi: "Tôi muốn mua pulsa năm mươi nghìn.",
        pronunciation_focus: [
          "SA-ya mau BE-li PUL-sa LI-ma PU-luh RI-bu - `pulsa` = tiền điện thoại trả trước; `ribu` = nghìn.",
          "Lỗi người Việt: dịch `pulsa` thành 'số dư' chung chung. `Pulsa` là credit điện thoại, khác `saldo` ví điện tử.",
          "Luyện: `Pulsa lima puluh ribu.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau BEH-lee PUL-sa LEE-ma POO-looh REE-boo - `pulsa` = prepaid phone credit; `ribu` = thousand.",
          "VN-speaker trap: translating `pulsa` as generic balance. `Pulsa` is phone credit, different from e-wallet `saldo`.",
          "Drill: `Pulsa lima puluh ribu.`",
        ],
      },
      {
        en: "Paket data saya sudah habis.",
        vi: "Gói dữ liệu của tôi đã hết.",
        pronunciation_focus: [
          "PA-ket DA-ta SA-ya SU-dah HA-bis - `paket data` = gói dữ liệu; `sudah habis` = đã hết.",
          "Lỗi người Việt: nói `internet saya habis`. Tự nhiên hơn: `paket data saya habis`.",
          "Luyện: `Paket data saya sudah habis.`",
        ],
        pronunciation_focus_en: [
          "PA-ket DA-ta SA-ya SOO-dah HA-bis - `paket data` = data package; `sudah habis` = has run out.",
          "VN-speaker trap: saying `internet saya habis`. More natural: `paket data saya habis`.",
          "Drill: `Paket data saya sudah habis.`",
        ],
      },
      {
        en: "Bisa isi ulang paket data untuk nomor ini?",
        vi: "Có thể nạp lại gói dữ liệu cho số này không?",
        pronunciation_focus: [
          "BI-sa I-si U-lang PA-ket DA-ta UN-tuk NO-mor I-ni - `isi ulang` = nạp lại; `nomor` = số điện thoại.",
          "Lỗi người Việt: nói `tambah data` cũng hiểu, nhưng ở quầy nạp dùng `isi ulang paket data`.",
          "Luyện: `Isi ulang paket data untuk nomor ini.`",
        ],
        pronunciation_focus_en: [
          "BEE-sa EE-see OO-lang PA-ket DA-ta OON-took NO-mor EE-nee - `isi ulang` = refill/top up; `nomor` = phone number.",
          "VN-speaker trap: `tambah data` is understandable, but counters use `isi ulang paket data`.",
          "Drill: `Isi ulang paket data untuk nomor ini.`",
        ],
      },
      {
        en: "Kartu SIM saya tidak terbaca.",
        vi: "Thẻ SIM của tôi không được nhận.",
        pronunciation_focus: [
          "KAR-tu SIM SA-ya TI-dak ter-BA-ca - `tidak terbaca` = không đọc được/không nhận.",
          "Lỗi người Việt: nói `SIM tidak baca`. Thiết bị không nhận thẻ thì dùng bị động/trạng thái `tidak terbaca`.",
          "Luyện: `Kartu SIM tidak terbaca.`",
        ],
        pronunciation_focus_en: [
          "KAR-too SIM SA-ya TEE-dak ter-BA-cha - `tidak terbaca` = not readable/not detected.",
          "VN-speaker trap: saying `SIM tidak baca`. If the device cannot detect it, use `tidak terbaca`.",
          "Drill: `Kartu SIM tidak terbaca.`",
        ],
      },
      {
        en: "Saya perlu kartu SIM baru dengan nomor yang sama.",
        vi: "Tôi cần thẻ SIM mới với cùng số cũ.",
        pronunciation_focus: [
          "SA-ya PER-lu KAR-tu SIM BA-ru DE-ngan NO-mor yang SA-ma - `nomor yang sama` = cùng số.",
          "Lỗi người Việt: bỏ `yang` trong cụm mô tả. `Nomor yang sama` tự nhiên hơn `nomor sama` trong câu này.",
          "Luyện: `Kartu SIM baru dengan nomor yang sama.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PER-loo KAR-too SIM BA-roo DEH-ngan NO-mor yang SA-ma - `nomor yang sama` = the same number.",
          "VN-speaker trap: dropping `yang` in a descriptive phrase. `Nomor yang sama` is more natural here than `nomor sama`.",
          "Drill: `Kartu SIM baru dengan nomor yang sama.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, quầy điện thoại nhỏ thường bán `pulsa`, `paket data`, thẻ SIM, phụ kiện và nhận `servis HP` cơ bản. `Pulsa` vẫn rất phổ biến cho thuê bao trả trước, còn `paket data` là gói internet riêng. Khi sửa máy, hãy hỏi rõ `biaya`, `garansi`, thời gian `selesai`, và liệu dữ liệu trong máy có an toàn không.",
    cultural_notes_en:
      "In Indonesia, small phone counters often sell `pulsa`, `paket data`, SIM cards, accessories, and basic `servis HP`. `Pulsa` is still common for prepaid phone credit, while `paket data` is a separate internet package. For repairs, ask clearly about the `biaya`, `garansi`, when it will be `selesai`, and whether the phone data is safe.",
    tip_advice_vi:
      "Mẹo cho người Việt: đừng dịch máy móc 'nạp tiền điện thoại' thành `isi uang`. Với điện thoại dùng `beli pulsa` hoặc `isi ulang pulsa`; với internet dùng `isi ulang paket data`. Trong tiệm sửa, khung vàng là: `Saya mau servis HP ini`, `Layarnya retak`, `Baterainya cepat habis`, `Masih ada garansi?`, `Selesai kapan?`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: do not translate 'top up phone money' as `isi uang`. For phone credit use `beli pulsa` or `isi ulang pulsa`; for internet use `isi ulang paket data`. In a repair shop, golden frames are: `Saya mau servis HP ini`, `Layarnya retak`, `Baterainya cepat habis`, `Masih ada garansi?`, `Selesai kapan?`.",
    vocabulary: [
      {
        word: "servis HP",
        en: "phone repair/service",
        vi: "sửa điện thoại",
        pos: "noun / verb phrase",
        pronunciation_vi: "SER-vis ha-PE",
        pronunciation_en: "SER-vis ha-PEH",
      },
      {
        word: "layar retak",
        en: "cracked screen",
        vi: "màn hình nứt",
        pos: "noun phrase",
        pronunciation_vi: "LA-yar RE-tak",
        pronunciation_en: "LA-yar REH-tak",
      },
      {
        word: "baterai",
        en: "battery",
        vi: "pin",
        pos: "noun",
        pronunciation_vi: "ba-TE-rai",
        pronunciation_en: "ba-TEH-rai",
      },
      {
        word: "garansi",
        en: "warranty",
        vi: "bảo hành",
        pos: "noun",
        pronunciation_vi: "ga-RAN-si",
        pronunciation_en: "ga-RAN-see",
      },
      {
        word: "pulsa",
        en: "prepaid phone credit",
        vi: "tiền điện thoại trả trước",
        pos: "noun",
        pronunciation_vi: "PUL-sa",
        pronunciation_en: "PUL-sa",
      },
      {
        word: "paket data",
        en: "data package",
        vi: "gói dữ liệu",
        pos: "noun phrase",
        pronunciation_vi: "PA-ket DA-ta",
        pronunciation_en: "PA-ket DA-ta",
      },
      {
        word: "isi ulang",
        en: "refill / top up",
        vi: "nạp lại",
        pos: "verb phrase",
        pronunciation_vi: "I-si U-lang",
        pronunciation_en: "EE-see OO-lang",
      },
      {
        word: "kartu SIM",
        en: "SIM card",
        vi: "thẻ SIM",
        pos: "noun",
        pronunciation_vi: "KAR-tu SIM",
        pronunciation_en: "KAR-too SIM",
      },
      {
        word: "tidak terbaca",
        en: "not readable / not detected",
        vi: "không đọc được / không nhận",
        pos: "phrase",
        pronunciation_vi: "TI-dak ter-BA-ca",
        pronunciation_en: "TEE-dak ter-BA-cha",
      },
      {
        word: "dicas",
        en: "charged",
        vi: "được sạc",
        pos: "verb",
        pronunciation_vi: "di-CAS",
        pronunciation_en: "dee-CHAS",
      },
      {
        word: "nomor",
        en: "number",
        vi: "số",
        pos: "noun",
        pronunciation_vi: "NO-mor",
        pronunciation_en: "NO-mor",
      },
      {
        word: "selesai",
        en: "finished",
        vi: "xong",
        pos: "adjective / verb",
        pronunciation_vi: "se-LE-sai",
        pronunciation_en: "se-LEH-sai",
      },
    ],
    dialogue: [
      {
        speaker: "Pelanggan",
        text: "Mas, saya mau servis HP ini. Layarnya retak dan baterainya cepat habis.",
        vi: "Anh ơi, tôi muốn sửa điện thoại này. Màn hình bị nứt và pin hết nhanh.",
        en: "Sir, I want to repair this phone. The screen is cracked and the battery drains quickly.",
      },
      {
        speaker: "Teknisi",
        text: "Bisa. Masih ada garansi?",
        vi: "Được. Còn bảo hành không?",
        en: "Yes. Is it still under warranty?",
      },
      {
        speaker: "Pelanggan",
        text: "Sepertinya sudah habis. Berapa biaya ganti layar?",
        vi: "Hình như hết rồi. Thay màn hình hết bao nhiêu?",
        en: "It seems expired. How much does screen replacement cost?",
      },
      {
        speaker: "Teknisi",
        text: "Saya cek dulu. Biasanya selesai sore ini.",
        vi: "Tôi kiểm tra trước. Thường xong chiều nay.",
        en: "I will check first. Usually it is finished this afternoon.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Màn hình bị nứt và pin hết nhanh.",
        answer: "Layarnya retak dan baterainya cepat habis.",
      },
      {
        type: "fill_blank",
        prompt: "Saya mau beli ____ lima puluh ribu.",
        answer: "pulsa",
        explanation_vi: "`pulsa` = tiền điện thoại trả trước.",
        explanation_en: "`pulsa` = prepaid phone credit.",
      },
      {
        type: "multiple_choice",
        prompt: "Which phrase means 'the SIM card is not detected'?",
        choices: [
          "Kartu SIM tidak terbaca.",
          "Baterainya cepat habis.",
          "Masih ada garansi?",
          "Saya beli pulsa.",
        ],
        answer: "Kartu SIM tidak terbaca.",
      },
      {
        type: "matching",
        pairs: [
          ["servis HP", "sửa điện thoại"],
          ["layar retak", "màn hình nứt"],
          ["paket data", "gói dữ liệu"],
          ["isi ulang", "nạp lại"],
        ],
      },
    ],
  },
];

export default lessons;
