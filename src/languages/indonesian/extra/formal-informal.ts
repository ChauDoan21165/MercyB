// Formal vs Informal Register Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling Indonesian `extra/*` files (e.g. formal-informal's
// siblings food-street.ts, banking-money.ts), which in turn mirror the French
// `FrenchLesson` shape. When the shared Indonesian registry
// (src/languages/indonesian/lessons.ts) lands, swap the local types for a shared
// import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing register + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// Register is THE social-survival skill in Indonesian. Three layers of pronouns:
//   I   → `saya` (neutral/formal) · `aku` (intimate/casual) · `gue/gua` (Jakarta slang)
//   you → `Anda` (formal) · `kamu` (casual) · `lu/lo` (Jakarta slang) · `Bapak/Ibu/Mas/Mbak` (respect-by-title)
// plus the casual layer: `tidak→nggak/gak`, `sudah→udah`, `tidak ada→nggak ada`,
// dropped `meN-` prefixes, and the particles `sih/dong/kok/deh/nih`.
// For Vietnamese speakers the WIN is far fewer kinship pronouns than Vietnamese;
// the trap is using `kamu`/`aku` with elders or a boss (rude), defaulting to
// `Anda` with friends (cold), and treating Jakarta `gue/lu` as standard everywhere.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing register/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
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
    id: "indonesian_formal_informal",
    level: "B1",
    category: "language",
    title_vi: "Tiếng trang trọng và thân mật (chọn đại từ và sắc thái)",
    title_en: "Formal vs informal register (choosing pronouns and tone)",
    sentences: [
      // ── Meeting a stranger / formal default ────────────────────────────
      {
        en: "Selamat siang, nama saya Linh. Boleh saya tahu nama Anda?",
        vi: "Chào buổi trưa, tôi tên Linh. Tôi có thể biết tên anh/chị không?",
        pronunciation_focus: [
          "se-la-MAT SI-ang, NA-ma SA-ya Linh — `saya` = 'tôi' trung tính/lịch sự, an toàn với người lạ.",
          "`Anda` = 'anh/chị/ông/bà' trang trọng, viết hoa. Dùng khi chưa biết tuổi/vai vế người đối diện.",
          "Lỗi người Việt: dùng `kamu` ngay với người lạ — nghe suồng sã. Mặc định khởi đầu là `saya` + `Anda`.",
        ],
        pronunciation_focus_en: [
          "se-la-MAT SI-ang, NA-ma SA-ya Linh — `saya` = neutral/polite 'I', safe with strangers.",
          "`Anda` = formal 'you' (capitalized). Use it when you don't yet know the person's age or status.",
          "VN-speaker trap: using `kamu` with a stranger — too familiar. Default opener is `saya` + `Anda`.",
        ],
      },
      {
        en: "Permisi, Pak. Apakah Bapak punya waktu sebentar?",
        vi: "Xin lỗi chú/anh. Chú/anh có chút thời gian không ạ?",
        pronunciation_focus: [
          "per-MI-si, pak — `Pak` (`Bapak`) = chú/ông (nam lớn tuổi/cấp trên); `Bu`/`Ibu` = cô/bà (nữ).",
          "Mẹo vàng: thay 'you' bằng CHỨC DANH (`Bapak`/`Ibu`) là cách lịch sự nhất — lịch sự hơn cả `Anda`.",
          "Lỗi người Việt: gọi cấp trên bằng `kamu`/`Anda`. Với người trên, dùng `Pak/Bu` + tên/chức để tỏ kính trọng.",
        ],
        pronunciation_focus_en: [
          "per-MI-si, pak — `Pak` (`Bapak`) = sir/older man/superior; `Bu`/`Ibu` = ma'am/older woman.",
          "Golden tip: replacing 'you' with a TITLE (`Bapak`/`Ibu`) is the most polite move — politer even than `Anda`.",
          "VN-speaker trap: `kamu`/`Anda` for a superior. With seniors, use `Pak/Bu` + name/role to show respect.",
        ],
      },
      // ── Workplace formal ───────────────────────────────────────────────
      {
        en: "Mohon maaf, saya belum menerima dokumennya.",
        vi: "Xin lỗi, tôi vẫn chưa nhận được tài liệu ạ.",
        pronunciation_focus: [
          "MO-hon ma-AF, SA-ya be-LUM me-ne-RI-ma — `mohon maaf` = xin lỗi (trang trọng, hơn `maaf` trống).",
          "Trang trọng GIỮ tiền tố đầy đủ: `menerima` (không `terima`), `mengirim` (không `kirim`).",
          "Lỗi người Việt: bê khẩu ngữ vào email công việc. Văn phòng = `saya` + động từ `meN-` đầy đủ + `mohon`.",
        ],
        pronunciation_focus_en: [
          "MO-hon ma-AF, SA-ya be-LUM me-ne-RI-ma — `mohon maaf` = (formal) apology, stronger than bare `maaf`.",
          "Formal register KEEPS full prefixes: `menerima` (not `terima`), `mengirim` (not `kirim`).",
          "VN-speaker trap: dragging casual speech into work email. Office = `saya` + full `meN-` verbs + `mohon`.",
        ],
      },
      {
        en: "Terima kasih atas waktunya, Bu. Saya akan menunggu kabar dari Ibu.",
        vi: "Cảm ơn cô đã dành thời gian. Tôi sẽ chờ tin từ cô ạ.",
        pronunciation_focus: [
          "te-ri-MA KA-sih A-tas WAK-tu-nya, bu — đóng câu trang trọng: `terima kasih atas waktunya`.",
          "Để 'you' lần hai, lặp lại `Ibu` (không đổi sang `kamu`) — giữ nhất quán mức kính trọng cả câu.",
          "Lỗi người Việt: trộn `Ibu` rồi `kamu` trong cùng đoạn. Một cuộc thoại = một mức register, đừng nhảy bậc.",
        ],
        pronunciation_focus_en: [
          "te-ri-MA KA-sih A-tas WAK-tu-nya, bu — formal closer: `terima kasih atas waktunya`.",
          "For the second 'you', repeat `Ibu` (don't switch to `kamu`) — keep the respect level consistent throughout.",
          "VN-speaker trap: mixing `Ibu` then `kamu` in one exchange. One conversation = one register; don't jump levels.",
        ],
      },
      // ── Casual with peers / friends ────────────────────────────────────
      {
        en: "Aku lagi di kafe, kamu mau ke sini, nggak?",
        vi: "Tớ đang ở quán cà phê, cậu muốn qua đây không?",
        pronunciation_focus: [
          "A-ku LA-gi di KA-fe, KA-mu mau ke SI-ni, ng-GAK — thân mật: `aku` (tớ), `kamu` (cậu), `nggak` (= `tidak`).",
          "`lagi` ở đây = `sedang` (đang) trong khẩu ngữ; `nggak` là dạng nói của `tidak`.",
          "Lỗi người Việt: dùng `aku`/`kamu` với người trên — chỉ hợp BẠN BÈ ngang hàng hoặc thân thiết.",
        ],
        pronunciation_focus_en: [
          "A-ku LA-gi di KA-fe, KA-mu mau ke SI-ni, ng-GAK — casual: `aku` (I), `kamu` (you), `nggak` (= `tidak`).",
          "Here `lagi` = `sedang` (in the middle of) in speech; `nggak` is the spoken form of `tidak`.",
          "VN-speaker trap: `aku`/`kamu` with seniors — only for EQUAL-status friends or close ones.",
        ],
      },
      {
        en: "Udah makan belum? Aku laper banget, nih.",
        vi: "Ăn chưa? Tớ đói lắm rồi nè.",
        pronunciation_focus: [
          "u-DAH MA-kan be-LUM — `udah` (= `sudah`, đã); `laper` (= `lapar`, đói); `banget` (= `sangat`, rất); `nih` = tiểu từ nè.",
          "Khẩu ngữ rút gọn nguyên âm: `sudah→udah`, `lapar→laper`, `saja→aja`, `sama→sama` (giữ).",
          "Lỗi người Việt: viết khẩu ngữ này trong văn trang trọng. `udah`/`banget`/`nih` chỉ dùng nói + chat bạn bè.",
        ],
        pronunciation_focus_en: [
          "u-DAH MA-kan be-LUM — `udah` (= `sudah`); `laper` (= `lapar`, hungry); `banget` (= `sangat`, very); `nih` = particle.",
          "Casual speech clips vowels: `sudah→udah`, `lapar→laper`, `saja→aja`.",
          "VN-speaker trap: writing this in formal text. `udah`/`banget`/`nih` are for speech + friend chats only.",
        ],
      },
      // ── Jakarta slang layer ────────────────────────────────────────────
      {
        en: "Gue lagi gabut, lu mau nongkrong, nggak?",
        vi: "Tao đang rảnh rỗi chán, mày muốn đi tụ tập không?",
        pronunciation_focus: [
          "gu-e LA-gi ga-BUT, lu mau nong-KRONG — tiếng lóng Jakarta: `gue` (tao/tớ), `lu/lo` (mày/cậu); `nongkrong` = tụ tập.",
          "`gue`/`lu` CHỈ hợp Jakarta + bạn rất thân/đồng trang lứa; ngoài Jakarta hoặc với người lạ nghe rất sỗ sàng.",
          "Lỗi người Việt: tưởng `gue`/`lu` là chuẩn toàn quốc. Đây là phương ngữ Jakarta, KHÔNG dùng nơi trang trọng.",
        ],
        pronunciation_focus_en: [
          "gu-e LA-gi ga-BUT, lu mau nong-KRONG — Jakarta slang: `gue` (I), `lu/lo` (you); `nongkrong` = to hang out.",
          "`gue`/`lu` fit ONLY Jakarta + very close peers; elsewhere or with strangers they sound crude.",
          "VN-speaker trap: thinking `gue`/`lu` are nationwide standard. They're Jakarta dialect — never in formal settings.",
        ],
      },
      // ── Switching registers (the core skill) ───────────────────────────
      {
        en: "Ke teman: \"Lu udah baca?\" — Ke dosen: \"Apakah Bapak sudah membacanya?\"",
        vi: "Với bạn: 'Mày đọc chưa?' — Với thầy: 'Thầy đã đọc nó chưa ạ?'",
        pronunciation_focus: [
          "cùng một ý, ĐỔI ba thứ: đại từ (`lu`→`Bapak`), `udah`→`sudah`, và thêm `apakah` + `meN-` (`membacanya`).",
          "Đây là kỹ năng cốt lõi: nhận diện đối tượng → chọn tầng đại từ → điều chỉnh động từ + tiểu từ cho khớp.",
          "Lỗi người Việt: nhớ từ vựng nhưng quên CHUYỂN TẦNG. Luyện dịch một câu sang cả hai mức để phản xạ nhanh.",
        ],
        pronunciation_focus_en: [
          "Same idea, THREE switches: pronoun (`lu`→`Bapak`), `udah`→`sudah`, plus `apakah` + `meN-` (`membacanya`).",
          "This is the core skill: read the audience → pick the pronoun tier → adjust verbs + particles to match.",
          "VN-speaker trap: knowing the words but forgetting to SHIFT TIER. Drill one sentence into both levels for reflex.",
        ],
      },
      // ── Possessives by register ────────────────────────────────────────
      {
        en: "Ini buku saya. / Ini bukuku. / Ini buku gue.",
        vi: "Đây là sách của tôi (trang trọng / thân mật / lóng Jakarta).",
        pronunciation_focus: [
          "sở hữu cũng theo tầng: `buku saya` (trang trọng), `bukuku` (`-ku` thân mật), `buku gue` (lóng).",
          "`-ku` = của tôi (gắn đuôi), `-mu` = của bạn: `namamu` (tên cậu) — thân mật; trang trọng dùng `nama Anda`.",
          "Lỗi người Việt: trộn `bukuku` với `Anda` trong một câu. Chọn một tầng và đồng bộ cả sở hữu lẫn đại từ.",
        ],
        pronunciation_focus_en: [
          "Possessives also shift by tier: `buku saya` (formal), `bukuku` (`-ku` casual), `buku gue` (slang).",
          "`-ku` = my (suffix), `-mu` = your: `namamu` (your name) — casual; formal uses `nama Anda`.",
          "VN-speaker trap: mixing `bukuku` with `Anda` in one line. Pick one tier and sync possessive + pronoun.",
        ],
      },
      // ── Softening requests politely ────────────────────────────────────
      {
        en: "Bisa tolong dibantu, Pak? / Bantuin, dong!",
        vi: "Anh giúp giúp được không ạ? / Giúp (tớ) cái đi!",
        pronunciation_focus: [
          "BI-sa TO-long di-BAN-tu, pak — trang trọng: `bisa tolong di...` + thể bị động lịch sự `dibantu`.",
          "Thân mật: `bantuin, dong!` — hậu tố khẩu ngữ `-in` (= `-kan`) + tiểu từ nài nỉ `dong`.",
          "Lỗi người Việt: dùng `bantuin dong` với cấp trên (sỗ). Yêu cầu trang trọng = `bisa tolong di...kan, Pak/Bu?`.",
        ],
        pronunciation_focus_en: [
          "BI-sa TO-long di-BAN-tu, pak — formal: `bisa tolong di...` + the polite passive `dibantu`.",
          "Casual: `bantuin, dong!` — colloquial `-in` suffix (= `-kan`) + the coaxing particle `dong`.",
          "VN-speaker trap: `bantuin dong` with a superior (rude). Formal request = `bisa tolong di...kan, Pak/Bu?`.",
        ],
      },
      // ── Customer service / service register ────────────────────────────
      {
        en: "Ada yang bisa saya bantu, Kak?",
        vi: "Có gì em/mình có thể giúp không ạ?",
        pronunciation_focus: [
          "A-da yang BI-sa SA-ya BAN-tu, kak — `Kak` (`Kakak`) = anh/chị, lịch sự-thân thiện, hay dùng trong dịch vụ/bán hàng.",
          "Bậc 'dịch vụ': lịch sự nhưng ấm áp — `Kak`/`Mas`/`Mbak` + `saya`, mềm hơn `Anda` cứng.",
          "Lỗi người Việt: dùng `Anda` với khách quen — nghe xa cách. Bán hàng/CSKH thường `Kak/Mas/Mbak` thân thiện hơn.",
        ],
        pronunciation_focus_en: [
          "A-da yang BI-sa SA-ya BAN-tu, kak — `Kak` (`Kakak`) = older sibling/you, polite-friendly, common in service/retail.",
          "The 'service' tier: polite yet warm — `Kak`/`Mas`/`Mbak` + `saya`, softer than the stiff `Anda`.",
          "VN-speaker trap: `Anda` with a regular customer — sounds distant. Retail/support prefers the friendlier `Kak/Mas/Mbak`.",
        ],
      },
      // ── Texting etiquette ──────────────────────────────────────────────
      {
        en: "Selamat pagi, Pak. Mohon maaf mengganggu waktunya.",
        vi: "Chào buổi sáng ạ. Xin lỗi đã làm phiền thời gian của chú/anh.",
        pronunciation_focus: [
          "se-la-MAT PA-gi, pak — nhắn tin trang trọng (WhatsApp công việc) MỞ bằng lời chào + `mohon maaf mengganggu`.",
          "Đừng nhắn cộc lốc kiểu 'Pak, ada tugas?'. Mở đầu lịch sự rồi mới vào việc — chuẩn etiket Indonesia.",
          "Lỗi người Việt: vào thẳng yêu cầu, bỏ chào. Người Indonesia coi `basa-basi` mở đầu là phép lịch sự bắt buộc.",
        ],
        pronunciation_focus_en: [
          "se-la-MAT PA-gi, pak — a formal text (work WhatsApp) OPENS with a greeting + `mohon maaf mengganggu`.",
          "Don't fire off 'Pak, ada tugas?'. Open politely, then state your business — standard Indonesian etiquette.",
          "VN-speaker trap: jumping straight to the ask, skipping the greeting. Indonesians treat the opening `basa-basi` as required courtesy.",
        ],
      },
      // ── Reading the relationship ───────────────────────────────────────
      {
        en: "Kalau ragu, pakai saya dan Bapak/Ibu dulu.",
        vi: "Nếu phân vân, cứ dùng `saya` và `Bapak/Ibu` trước đã.",
        pronunciation_focus: [
          "ka-LAU RA-gu, PA-kai SA-ya dan ba-pak/I-bu DU-lu — quy tắc an toàn: nghi ngờ thì chọn mức TRANG TRỌNG.",
          "Hạ register sau khi đối phương hạ trước (họ nói `aku`/`kamu` với bạn) thì dễ; nâng lại sau khi đã suồng sã thì khó.",
          "Lỗi người Việt: sợ 'khách sáo' nên thân mật sớm. Ở Indonesia, lịch sự thừa an toàn hơn thân mật thiếu.",
        ],
        pronunciation_focus_en: [
          "ka-LAU RA-gu, PA-kai SA-ya dan ba-pak/I-bu DU-lu — safe rule: when unsure, choose the FORMAL tier.",
          "It's easy to drop register after the other person does (they use `aku`/`kamu` first); hard to climb back after being too casual.",
          "VN-speaker trap: fearing stiffness, going casual early. In Indonesia, over-polite is safer than under-polite.",
        ],
      },
      // ── The respect verbs ──────────────────────────────────────────────
      {
        en: "Beliau adalah dosen saya; saya sangat menghormati beliau.",
        vi: "Thầy ấy là giảng viên của tôi; tôi rất kính trọng thầy.",
        pronunciation_focus: [
          "be-LI-au A-da-lah DO-sen SA-ya — `beliau` = 'ông/bà ấy' KÍNH NGỮ (thay `dia` khi nói về người đáng kính).",
          "`dia` = anh/cô ấy (trung tính); `beliau` = ngôi thứ ba TRANG TRỌNG. Dùng `beliau` cho thầy cô, lãnh đạo, người lớn tuổi.",
          "Lỗi người Việt: dùng `dia` cho người đáng kính khi nói trang trọng. Nâng lên `beliau` để tỏ kính trọng.",
        ],
        pronunciation_focus_en: [
          "be-LI-au A-da-lah DO-sen SA-ya — `beliau` = honorific 'he/she' (replaces `dia` for respected people).",
          "`dia` = he/she (neutral); `beliau` = the FORMAL third person. Use `beliau` for teachers, leaders, elders.",
          "VN-speaker trap: `dia` for a respected person in formal speech. Upgrade to `beliau` to show respect.",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong tiếng Indonesia, chọn đại từ là chọn KHOẢNG CÁCH XÃ HỘI. Ba tầng cốt lõi cho 'tôi/bạn': (1) TRANG TRỌNG — `saya`/`Anda`, hoặc lịch sự hơn nữa là thay 'bạn' bằng chức danh `Bapak`(Pak)/`Ibu`(Bu)/`Kakak`(Kak)/`Mas`/`Mbak`; (2) THÂN MẬT — `aku`/`kamu`, kèm khẩu ngữ `nggak`, `udah`, `banget`, `aja`, và các tiểu từ `sih/dong/kok/deh/nih`; (3) LÓNG JAKARTA — `gue`/`lu(lo)`, chỉ hợp Jakarta + bạn thân, nghe sỗ ở nơi khác. Văn viết trang trọng (`surat resmi`, email công việc) bắt buộc `saya` + động từ `meN-` đầy đủ + `mohon`. Ngôi thứ ba cũng phân tầng: `dia` (trung tính) vs `beliau` (kính ngữ cho người đáng kính). Mẹo vàng của người bản ngữ: thay 'you' bằng CHỨC DANH/TÊN là cách lịch sự nhất — gọi `Pak Budi`, `Bu Sri` thay vì `Anda`. Khi nhắn tin công việc, luôn mở bằng lời chào + `basa-basi` (xã giao) trước khi vào việc; vào thẳng bị coi là thiếu lễ độ.",
    cultural_notes_en:
      "In Indonesian, choosing a pronoun is choosing SOCIAL DISTANCE. Three core tiers for 'I/you': (1) FORMAL — `saya`/`Anda`, or even more politely, replace 'you' with a title `Bapak`(Pak)/`Ibu`(Bu)/`Kakak`(Kak)/`Mas`/`Mbak`; (2) CASUAL — `aku`/`kamu`, with colloquial `nggak`, `udah`, `banget`, `aja`, and particles `sih/dong/kok/deh/nih`; (3) JAKARTA SLANG — `gue`/`lu(lo)`, only for Jakarta + close friends, crude elsewhere. Formal writing (`surat resmi`, work email) requires `saya` + full `meN-` verbs + `mohon`. The third person tiers too: `dia` (neutral) vs `beliau` (honorific for respected people). The native golden tip: replacing 'you' with a TITLE/NAME is the politest move — say `Pak Budi`, `Bu Sri` rather than `Anda`. In work texting, always open with a greeting + `basa-basi` (small talk) before your point; diving straight in reads as rude.",
    tip_advice_vi:
      "Bốn bước chọn register: (1) ĐỌC ĐỐI TƯỢNG — lạ/trên → trang trọng; ngang hàng/thân → thân mật; (2) CHỌN TẦNG ĐẠI TỪ và ĐỒNG BỘ cả câu (đừng trộn `Ibu` với `kamu`, hay `bukuku` với `Anda`); (3) KHỚP ĐỘNG TỪ + TIỂU TỪ với tầng đó — trang trọng giữ `meN-` đầy đủ (`membaca`, `menerima`) + `apakah`/`mohon`; thân mật rút gọn (`udah`, `nggak`) + `-in`/`dong`; (4) KHI NGHI NGỜ chọn TRANG TRỌNG — hạ bậc sau dễ, nâng bậc lại khó. Quy tắc bất biến: thay 'you' bằng `Pak/Bu/Mas/Mbak/Kak` + tên là an toàn và lịch sự nhất; `gue/lu` chỉ Jakarta + bạn thân; ngôi ba đáng kính dùng `beliau`. Luyện 'song dịch': lấy một câu, viết cả bản trang trọng lẫn thân mật để phản xạ chuyển tầng nhanh.",
    tip_advice_en:
      "Four steps to pick a register: (1) READ THE AUDIENCE — stranger/senior → formal; peer/close → casual; (2) PICK THE PRONOUN TIER and KEEP IT CONSISTENT (don't mix `Ibu` with `kamu`, or `bukuku` with `Anda`); (3) MATCH VERBS + PARTICLES to that tier — formal keeps full `meN-` (`membaca`, `menerima`) + `apakah`/`mohon`; casual clips (`udah`, `nggak`) + `-in`/`dong`; (4) WHEN IN DOUBT go FORMAL — easy to drop later, hard to climb back. Iron rules: replacing 'you' with `Pak/Bu/Mas/Mbak/Kak` + name is the safest and politest; `gue/lu` is Jakarta + close friends only; for a respected third person use `beliau`. Drill 'dual translation': take one sentence, write both the formal and casual versions to build switching reflex.",
    vocabulary: [
      {
        word: "saya / aku / gue",
        en: "I (formal / casual / Jakarta slang)",
        vi: "tôi / tớ / tao",
        pos: "pronoun (1st)",
        pronunciation_vi: "SA-ya / A-ku / gu-e — mặc định an toàn là `saya`",
        pronunciation_en: "SAH-yah / AH-koo / GOO-eh — safe default is `saya`",
      },
      {
        word: "Anda / kamu / lu",
        en: "you (formal / casual / Jakarta slang)",
        vi: "anh-chị / cậu / mày",
        pos: "pronoun (2nd)",
        pronunciation_vi: "AN-da / KA-mu / lu — `Anda` viết hoa; `lu` chỉ Jakarta",
        pronunciation_en: "AHN-dah / KAH-moo / loo — `Anda` capitalized; `lu` Jakarta-only",
      },
      {
        word: "Bapak / Ibu",
        en: "sir / ma'am (Pak / Bu)",
        vi: "chú-ông / cô-bà",
        pos: "title (address)",
        pronunciation_vi: "BA-pak / I-bu — thay 'you' bằng chức danh = lịch sự nhất",
        pronunciation_en: "BAH-pak / EE-boo — title-as-'you' = the most polite",
      },
      {
        word: "Mas / Mbak / Kak",
        en: "young man / young woman / older sibling (you)",
        vi: "anh / chị (trẻ) / anh-chị",
        pos: "title (address)",
        pronunciation_vi: "mas / mbak / kak — bậc lịch sự-thân thiện, hay dùng dịch vụ",
        pronunciation_en: "mahs / mbahk / kahk — the polite-friendly service tier",
      },
      {
        word: "beliau",
        en: "he/she (honorific)",
        vi: "ông/bà ấy (kính ngữ)",
        pos: "pronoun (3rd, formal)",
        pronunciation_vi: "be-LI-au — nâng từ `dia` cho người đáng kính",
        pronunciation_en: "be-LEE-ow — upgrade of `dia` for respected people",
      },
      {
        word: "nggak / gak",
        en: "no / not (casual `tidak`)",
        vi: "không (khẩu ngữ)",
        pos: "negator (casual)",
        pronunciation_vi: "ng-GAK / gak — chỉ nói/chat; trang trọng dùng `tidak`",
        pronunciation_en: "ng-GAK / gak — speech/chat only; formal uses `tidak`",
      },
      {
        word: "udah",
        en: "already (casual `sudah`)",
        vi: "đã/rồi (khẩu ngữ)",
        pos: "adv. (casual)",
        pronunciation_vi: "u-DAH — dạng nói của `sudah`",
        pronunciation_en: "oo-DAH — spoken form of `sudah`",
      },
      {
        word: "mohon maaf",
        en: "(formal) my apologies",
        vi: "xin lỗi (trang trọng)",
        pos: "phrase (formal)",
        pronunciation_vi: "MO-hon ma-AF — trang trọng hơn `maaf` trống",
        pronunciation_en: "MO-hon mah-AF — more formal than bare `maaf`",
      },
      {
        word: "basa-basi",
        en: "small talk / pleasantries",
        vi: "xã giao, lời mở đầu",
        pos: "noun",
        pronunciation_vi: "BA-sa-BA-si — mở đầu lịch sự bắt buộc trước khi vào việc",
        pronunciation_en: "BAH-sah-BAH-see — the obligatory polite opener before business",
      },
      {
        word: "-ku / -mu",
        en: "my / your (casual suffix)",
        vi: "của tôi / của bạn (đuôi thân mật)",
        pos: "possessive suffix",
        pronunciation_vi: "-ku / -mu — `bukuku`, `namamu`; trang trọng: `... saya/Anda`",
        pronunciation_en: "-koo / -moo — `bukuku`, `namamu`; formal: `... saya/Anda`",
      },
    ],
    dialogue: [
      {
        speaker: "Karyawan (ke atasan)",
        text: "Selamat pagi, Pak. Mohon maaf mengganggu. Apakah Bapak ada waktu sebentar?",
        vi: "Chào buổi sáng ạ. Xin lỗi đã làm phiền. Chú/anh có chút thời gian không ạ?",
        en: "Good morning, sir. Sorry to bother you. Do you have a moment?",
      },
      {
        speaker: "Atasan",
        text: "Pagi. Ada, silakan. Ada apa, ya?",
        vi: "Chào. Có, cứ nói. Có chuyện gì vậy?",
        en: "Morning. Yes, go ahead. What is it?",
      },
      {
        speaker: "Karyawan",
        text: "Saya belum menerima dokumennya. Bisa tolong dikirim ulang, Pak?",
        vi: "Tôi vẫn chưa nhận được tài liệu. Anh gửi lại giúp được không ạ?",
        en: "I haven't received the document. Could you resend it, sir?",
      },
      {
        speaker: "Teman (chat)",
        text: "Eh, lu udah kirim tugasnya belum? Gue belum, nih. Bantuin, dong!",
        vi: "Ê, mày gửi bài chưa? Tao chưa nè. Giúp tao cái đi!",
        en: "Hey, did you send the assignment? I haven't. Help me out!",
      },
      {
        speaker: "Teman 2",
        text: "Udah, kok. Santai, aku kirimin ke kamu sekarang.",
        vi: "Gửi rồi mà. Bình tĩnh, tớ gửi cho cậu bây giờ.",
        en: "I did, actually. Chill, I'll send it to you now.",
      },
    ],
    exercises: [
      {
        type: "register_label",
        instruction_vi: "Xếp mỗi câu vào TRANG TRỌNG, THÂN MẬT, hay LÓNG JAKARTA:",
        instruction_en: "Label each line FORMAL, CASUAL, or JAKARTA SLANG:",
        items: [
          { prompt: "Apakah Bapak sudah membacanya?", answer: "trang trọng (formal)" },
          { prompt: "Kamu udah makan belum?", answer: "thân mật (casual)" },
          { prompt: "Gue lagi gabut, lu mau nongkrong?", answer: "lóng Jakarta (Jakarta slang)" },
          { prompt: "Mohon maaf, saya belum menerima dokumennya.", answer: "trang trọng (formal)" },
          { prompt: "Bantuin, dong!", answer: "thân mật (casual)" },
        ],
      },
      {
        type: "transform",
        instruction_vi: "Đổi câu THÂN MẬT sang TRANG TRỌNG (đổi đại từ + động từ + bỏ khẩu ngữ):",
        instruction_en: "Rewrite the CASUAL line as FORMAL (swap pronouns + verbs + drop slang):",
        items: [
          { prompt: "Kamu udah baca emailku?", answer: "Apakah Anda sudah membaca email saya?" },
          { prompt: "Aku nggak bisa datang.", answer: "Saya tidak bisa datang." },
          { prompt: "Lu udah kirim belum?", answer: "Apakah Bapak/Ibu sudah mengirimnya?" },
          { prompt: "Bantuin aku, dong.", answer: "Bisa tolong dibantu, Pak/Bu?" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Chọn đại từ/cách xưng hô đúng cho ngữ cảnh:",
        instruction_en: "Choose the right pronoun/address for the context:",
        items: [
          { prompt: "Email cho sếp: 'Terima kasih, ___ akan menunggu kabar.' (tôi)", answer: "saya" },
          { prompt: "Nói về thầy giáo (kính ngữ): '___ adalah dosen saya.'", answer: "beliau" },
          { prompt: "Gọi cấp trên nam (lịch sự nhất, thay 'you'): '___ ada waktu?'", answer: "Bapak" },
          { prompt: "Chat bạn thân ở Jakarta: '___ mau nongkrong?' (mày)", answer: "lu" },
        ],
      },
      {
        type: "spot_the_error",
        instruction_vi: "Câu sau lẫn lộn register — sửa lại cho nhất quán:",
        instruction_en: "Each line mixes registers — fix it to be consistent:",
        items: [
          { prompt: "Terima kasih, Ibu. Nanti aku kabari kamu, ya. (trộn trang trọng + thân mật)", answer: "Terima kasih, Ibu. Nanti saya kabari Ibu, ya." },
          { prompt: "Ini bukuku, boleh Anda pinjam. (trộn -ku + Anda)", answer: "Ini buku saya, boleh Anda pinjam." },
          { prompt: "Mohon maaf, lu belum kirim dokumennya. (trang trọng + lóng)", answer: "Mohon maaf, Bapak belum mengirim dokumennya." },
        ],
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra về register — bạn làm được chưa?",
        instruction_en: "Quick register self-check — can you do each one?",
        items: [
          { vi: "Tôi đọc đối tượng trước rồi mới chọn đại từ.", en: "I read the audience before picking a pronoun." },
          { vi: "Tôi giữ một tầng register nhất quán cả câu/đoạn.", en: "I keep one consistent register across the whole exchange." },
          { vi: "Tôi thay 'you' bằng `Pak/Bu/Mas/Mbak/Kak` khi cần lịch sự.", en: "I replace 'you' with `Pak/Bu/Mas/Mbak/Kak` for politeness." },
          { vi: "Tôi biết `gue/lu` chỉ hợp Jakarta + bạn thân.", en: "I know `gue/lu` fit only Jakarta + close friends." },
          { vi: "Trang trọng: tôi giữ `meN-` đầy đủ + `mohon` + `apakah`.", en: "Formal: I keep full `meN-` + `mohon` + `apakah`." },
          { vi: "Khi nghi ngờ, tôi chọn mức trang trọng.", en: "When in doubt, I choose the formal tier." },
        ],
      },
    ],
  },
];

export default lessons;
