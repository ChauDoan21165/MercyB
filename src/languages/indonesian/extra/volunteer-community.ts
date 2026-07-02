// Volunteer & Community Service Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (legal-police.ts, shopping-bargaining.ts,
// etc.), which in turn mirror the French `FrenchLesson` shape. When the shared
// Indonesian registry (src/languages/indonesian/lessons.ts) lands, swap the local
// types for a shared import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// Indonesian is written in Latin script and is largely phonetic. For Vietnamese
// speakers the big WINS are: no grammatical gender, no verb conjugation, no tones,
// no articles. Community-service vocabulary leans heavily on the deeply Indonesian
// values of `gotong royong` (mutual aid) and `bakti sosial` (social service), and
// on ber- + meN-…-kan affix verbs (`bergabung` to join, `menyumbang` to donate,
// `membantu` to help, `mendaftar` to register, `mengadakan` to organize). Knowing
// `PMI` (Red Cross), `posko`, and `relawan` opens the door to volunteering anywhere.

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
    id: "indonesian_volunteer_community",
    level: "B1",
    category: "community",
    title_vi: "Tiếng Indonesia khi tình nguyện & phục vụ cộng đồng",
    title_en: "Volunteer & community service Indonesian",
    sentences: [
      // ── Signing up / joining ────────────────────────────────────────────
      {
        en: "Saya ingin menjadi relawan. Bagaimana cara mendaftar?",
        vi: "Tôi muốn làm tình nguyện viên. Đăng ký bằng cách nào ạ?",
        pronunciation_focus: [
          "SA-ya ING-in men-JA-di re-LA-wan. ba-gai-MA-na CA-ra men-DAF-tar? — `relawan` = tình nguyện viên; `menjadi` = trở thành; `mendaftar` = đăng ký (meN- + `daftar`).",
          "Lợi thế người Việt: `ingin menjadi` = 'muốn trở thành', cấu trúc giống tiếng Việt, không chia thì.",
          "Lỗi người Việt: dùng danh từ `pendaftaran` (việc đăng ký) làm động từ. Hành động 'đăng ký' là `mendaftar`.",
          "Luyện: `Saya ingin menjadi relawan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya ING-in men-JA-di re-LA-wan. ba-gai-MA-na CHA-ra men-DAF-tar? — `relawan` = volunteer; `menjadi` = to become; `mendaftar` = to register (meN- + `daftar`).",
          "VN-speaker win: `ingin menjadi` = 'want to become', the same shape as Vietnamese, no tense.",
          "VN-speaker trap: using the noun `pendaftaran` (registration) as a verb. The action 'to register' is `mendaftar`.",
          "Drill: `Saya ingin menjadi relawan.`",
        ],
      },
      {
        en: "Saya mau bergabung dengan kegiatan bakti sosial.",
        vi: "Tôi muốn tham gia hoạt động công tác xã hội.",
        pronunciation_focus: [
          "SA-ya MA-u ber-ga-BUNG DE-ngan ke-GI-a-tan BAK-ti so-si-AL — `bergabung dengan` = tham gia/gia nhập (ber- + `gabung`); `kegiatan` = hoạt động; `bakti sosial` (baksos) = công tác thiện nguyện.",
          "Lỗi người Việt: bỏ `dengan` sau `bergabung`. Cặp cố định là `bergabung DENGAN …`.",
          "Mẹo: `bakti sosial` thường viết tắt `baksos` trong nói/đăng tin.",
          "Luyện: `Saya mau bergabung dengan kegiatan bakti sosial.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MA-oo ber-ga-BOONG DE-ngan ke-GEE-a-tan BAK-ti so-si-AL — `bergabung dengan` = to join (ber- + `gabung`); `kegiatan` = activity; `bakti sosial` (baksos) = social/charity service.",
          "VN-speaker trap: dropping `dengan` after `bergabung`. The fixed pairing is `bergabung DENGAN …`.",
          "Tip: `bakti sosial` is often shortened to `baksos` in speech and posts.",
          "Drill: `Saya mau bergabung dengan kegiatan bakti sosial.`",
        ],
      },
      // ── Offering help ───────────────────────────────────────────────────
      {
        en: "Ada yang bisa saya bantu? Saya siap membantu.",
        vi: "Có gì tôi giúp được không? Tôi sẵn sàng giúp.",
        pronunciation_focus: [
          "A-da yang BI-sa SA-ya BAN-tu? SA-ya SI-ap mem-BAN-tu — `ada yang bisa saya bantu?` = có gì tôi giúp được không; `siap` = sẵn sàng; `membantu` = giúp (meN- + `bantu`).",
          "Lỗi người Việt: lẫn `bantu` (giúp, dạng gốc/khẩu ngữ) với `membantu` (động từ chuẩn). Câu đầy đủ dùng `membantu`.",
          "Mẹo: câu `ada yang bisa saya bantu?` rất hữu ích, dùng được cả khi tình nguyện lẫn công sở.",
          "Luyện: `Ada yang bisa saya bantu? Saya siap membantu.`",
        ],
        pronunciation_focus_en: [
          "A-da yang BEE-sa SA-ya BAN-too? SA-ya SEE-ap mem-BAN-too — `ada yang bisa saya bantu?` = is there anything I can help with?; `siap` = ready; `membantu` = to help (meN- + `bantu`).",
          "VN-speaker trap: confusing `bantu` (help, root/casual) with `membantu` (the standard verb). Full sentences use `membantu`.",
          "Tip: `ada yang bisa saya bantu?` is a high-value line — useful both volunteering and at work.",
          "Drill: `Ada yang bisa saya bantu? Saya siap membantu.`",
        ],
      },
      {
        en: "Saya bisa ikut hari Sabtu, dari pagi sampai sore.",
        vi: "Tôi có thể tham gia thứ Bảy, từ sáng đến chiều.",
        pronunciation_focus: [
          "SA-ya BI-sa I-kut HA-ri SAB-tu, DA-ri PA-gi SAM-pai SO-re — `ikut` = đi cùng/tham gia; `dari … sampai …` = từ … đến …; `sore` = chiều.",
          "Lợi thế người Việt: `dari pagi sampai sore` khớp đúng 'từ sáng đến chiều', dễ nhớ.",
          "Lỗi người Việt: dùng `dengan` cho 'đến (mốc thời gian)'. Khoảng thời gian dùng `sampai`, không `dengan`.",
          "Luyện: `Saya bisa ikut hari Sabtu, dari pagi sampai sore.`",
        ],
        pronunciation_focus_en: [
          "SA-ya BEE-sa EE-koot HA-ri SAB-too, DA-ri PA-gi SAM-pai SO-re — `ikut` = to come along/join; `dari … sampai …` = from … to …; `sore` = (late) afternoon.",
          "VN-speaker win: `dari pagi sampai sore` maps to 'from morning to afternoon', easy to remember.",
          "VN-speaker trap: using `dengan` for 'until (a time)'. A time span uses `sampai`, not `dengan`.",
          "Drill: `Saya bisa ikut hari Sabtu, dari pagi sampai sore.`",
        ],
      },
      // ── Donating ────────────────────────────────────────────────────────
      {
        en: "Saya mau menyumbang pakaian dan makanan untuk korban banjir.",
        vi: "Tôi muốn quyên góp quần áo và thực phẩm cho nạn nhân lũ lụt.",
        pronunciation_focus: [
          "SA-ya MA-u me-nyum-BANG pa-KAI-an dan ma-KA-nan UN-tuk KOR-ban BAN-jir — `menyumbang` = quyên góp (meN- + `sumbang`; 's' → 'ny'); `sumbangan` = món/khoản quyên góp (danh từ); `korban` = nạn nhân.",
          "Lỗi người Việt: lẫn động từ `menyumbang` (quyên góp) với danh từ `sumbangan` (khoản quyên). Hành động dùng `menyumbang`.",
          "Mẹo: `untuk` = cho/dành cho (mục đích/người nhận).",
          "Luyện: `Saya mau menyumbang pakaian untuk korban banjir.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MA-oo me-nyoom-BANG pa-KAI-an dan ma-KA-nan UN-took KOR-ban BAN-jir — `menyumbang` = to donate (meN- + `sumbang`; s → ny); `sumbangan` = a donation (noun); `korban` = victim.",
          "VN-speaker trap: confusing the verb `menyumbang` (to donate) with the noun `sumbangan` (a donation). The action uses `menyumbang`.",
          "Tip: `untuk` = for (purpose/recipient).",
          "Drill: `Saya mau menyumbang pakaian untuk korban banjir.`",
        ],
      },
      {
        en: "Di mana tempat donor darah PMI yang terdekat?",
        vi: "Điểm hiến máu của Hội Chữ thập đỏ gần nhất ở đâu?",
        pronunciation_focus: [
          "di MA-na TEM-pat DO-nor DA-rah pe-em-I yang ter-DE-kat? — `donor darah` = hiến máu; `PMI` (đánh vần 'pe-em-i') = Hội Chữ thập đỏ Indonesia; `terdekat` = gần nhất (ter- so sánh nhất).",
          "Lỗi người Việt: đọc liền `PMI`. Đánh vần từng chữ: pe-em-i (Palang Merah Indonesia).",
          "Lợi thế người Việt: `ter-` + tính từ = so sánh nhất, đơn giản: `terdekat` = gần nhất.",
          "Luyện: `Di mana tempat donor darah PMI yang terdekat?`",
        ],
        pronunciation_focus_en: [
          "di MA-na TEM-pat DO-nor DA-rah pe-em-EE yang ter-DE-kat? — `donor darah` = blood donation; `PMI` (spell 'pe-em-i') = the Indonesian Red Cross; `terdekat` = nearest (ter- superlative).",
          "VN-speaker trap: reading `PMI` as one word. Spell each letter: pe-em-i (Palang Merah Indonesia).",
          "VN-speaker win: `ter-` + adjective = the superlative, simple: `terdekat` = nearest.",
          "Drill: `Di mana tempat donor darah PMI yang terdekat?`",
        ],
      },
      // ── Organizing / community ──────────────────────────────────────────
      {
        en: "Warga akan mengadakan kerja bakti membersihkan selokan.",
        vi: "Dân cư sẽ tổ chức lao động chung dọn cống rãnh.",
        pronunciation_focus: [
          "WAR-ga A-kan me-nga-DA-kan KER-ja BAK-ti mem-ber-SIH-kan se-LO-kan — `warga` = dân/cư dân; `mengadakan` = tổ chức (meN- + ada + -kan); `kerja bakti` = lao động công ích chung; `membersihkan` = làm sạch.",
          "Lỗi người Việt: dùng `membersih` thiếu `-kan`. 'Làm sạch (cái gì)' là `membersihkan` (meN-…-kan).",
          "Mẹo: `kerja bakti` là hoạt động dọn dẹp khu phố tập thể — biểu hiện của `gotong royong`.",
          "Luyện: `Warga akan mengadakan kerja bakti.`",
        ],
        pronunciation_focus_en: [
          "WAR-ga A-kan me-nga-DA-kan KER-ja BAK-ti mem-ber-SIH-kan se-LO-kan — `warga` = resident; `mengadakan` = to hold/organize (meN- + ada + -kan); `kerja bakti` = communal volunteer labour; `membersihkan` = to clean.",
          "VN-speaker trap: using `membersih` without `-kan`. 'To clean (something)' is `membersihkan` (meN-…-kan).",
          "Tip: `kerja bakti` is collective neighbourhood clean-up — an expression of `gotong royong`.",
          "Drill: `Warga akan mengadakan kerja bakti.`",
        ],
      },
      {
        en: "Terima kasih atas partisipasi Anda. Bantuan ini sangat berarti.",
        vi: "Cảm ơn vì sự tham gia của bạn. Sự giúp đỡ này rất ý nghĩa.",
        pronunciation_focus: [
          "te-RI-ma KA-sih A-tas par-ti-si-PA-si AN-da. ban-TU-an I-ni SA-ngat ber-AR-ti — `atas` = về/đối với (lời cảm ơn trang trọng); `partisipasi` = sự tham gia; `berarti` = có ý nghĩa (ber- + `arti`).",
          "Lỗi người Việt: dùng `terima kasih untuk`. Trang trọng dùng `terima kasih ATAS …`.",
          "Mẹo: `sangat berarti` = rất ý nghĩa; lời cảm ơn ấm áp này hợp văn hóa cộng đồng Indonesia.",
          "Luyện: `Terima kasih atas partisipasi Anda.`",
        ],
        pronunciation_focus_en: [
          "te-REE-ma KA-sih A-tas par-ti-si-PA-si AN-da. ban-TU-an EE-ni SA-ngat ber-AR-ti — `atas` = for (formal thanks); `partisipasi` = participation; `berarti` = to be meaningful (ber- + `arti`).",
          "VN-speaker trap: using `terima kasih untuk`. The formal pairing is `terima kasih ATAS …`.",
          "Tip: `sangat berarti` = very meaningful; this warm thanks fits Indonesian community culture.",
          "Drill: `Terima kasih atas partisipasi Anda.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Tinh thần cộng đồng là một trong những giá trị cốt lõi và đáng yêu nhất của Indonesia, và người Việt sẽ thấy rất quen. Ba khái niệm nền tảng:\n\n1) `GOTONG ROYONG` (tương trợ cộng đồng) — triết lý 'cùng gánh vác'. Cả khu phố cùng làm việc chung: dọn dẹp, dựng nhà, lo đám cưới/đám tang. Nó gần với 'tình làng nghĩa xóm' của Việt Nam. Đây không chỉ là hoạt động mà là một giá trị quốc gia (nằm trong tinh thần Pancasila).\n\n2) `KERJA BAKTI` (lao động công ích) — buổi dọn dẹp tập thể của khu phố, thường cuối tuần, do `RT`/`RW` (tổ trưởng/khu phố) phát động: quét đường, khơi `selokan` (cống rãnh), sửa chỗ công cộng. Tham gia `kerja bakti` là cách hòa nhập hàng xóm nhanh nhất; vắng mặt thường xuyên bị xem là 'kurang guyub' (thiếu gắn bó).\n\n3) `BAKTI SOSIAL` (baksos — công tác thiện nguyện) — các đợt từ thiện có tổ chức: phát quà, khám bệnh miễn phí, cứu trợ thiên tai. Thường do nhà thờ/nhà thờ Hồi giáo (`masjid`), trường học, công ty, hay tổ chức như `PMI` đứng ra.\n\nTỔ CHỨC & TỪ KHÓA: `PMI` (Palang Merah Indonesia = Hội Chữ thập đỏ) lo `donor darah` (hiến máu) và cứu trợ. `relawan` = tình nguyện viên. `posko` = trạm chỉ huy/tiếp nhận (cứu trợ, đăng ký). `sumbangan`/`donasi` = khoản quyên góp; `menggalang dana` = gây quỹ. Nhiều `LSM`/`NGO` (tổ chức phi chính phủ) và `yayasan` (quỹ từ thiện) tuyển tình nguyện viên.\n\nLỜI KHUYÊN HÒA NHẬP: là người nước ngoài tham gia `kerja bakti` khu phố là cử chỉ thiện chí cực mạnh — hàng xóm sẽ quý ngay. Mang theo nước, đồ ăn nhẹ để chia sẻ; ăn chung sau buổi làm (`makan bareng`) là phần quan trọng của sự gắn kết. Khi quyên góp, hỏi `posko` chính thức để tránh lừa đảo.",
    cultural_notes_en:
      "Community spirit is one of Indonesia's core and most endearing values, and Vietnamese speakers will find it familiar. Three foundational concepts:\n\n1) `GOTONG ROYONG` (communal mutual aid) — the 'shouldering the load together' philosophy. A whole neighbourhood works jointly: cleaning, house-building, weddings/funerals. It's close to the Vietnamese 'tình làng nghĩa xóm'. It's not just an activity but a national value (part of the Pancasila ethos).\n\n2) `KERJA BAKTI` (communal labour) — a collective neighbourhood clean-up, usually on weekends, called by the `RT`/`RW` (block/neighbourhood heads): sweeping streets, clearing the `selokan` (drainage ditch), fixing shared spaces. Joining `kerja bakti` is the fastest way to integrate; chronic absence reads as 'kurang guyub' (not cohesive).\n\n3) `BAKTI SOSIAL` (baksos — social service) — organized charity drives: distributing aid, free medical checks, disaster relief. Often run by a church/mosque (`masjid`), school, company, or an organization like `PMI`.\n\nORGANIZATIONS & KEYWORDS: `PMI` (Palang Merah Indonesia = Indonesian Red Cross) runs `donor darah` (blood donation) and relief. `relawan` = volunteer. `posko` = command/intake post (relief, sign-up). `sumbangan`/`donasi` = a donation; `menggalang dana` = to fundraise. Many `LSM`/`NGO`s and `yayasan` (charitable foundations) recruit volunteers.\n\nINTEGRATION TIP: as a foreigner, joining the neighbourhood `kerja bakti` is a powerful goodwill gesture — neighbours warm to you instantly. Bring water and snacks to share; the post-work `makan bareng` (eating together) is a key bonding ritual. When donating, ask for the official `posko` to avoid scams.",
    tip_advice_vi:
      "Học 'bộ khung tình nguyện' bốn câu: (1) ngỏ ý — `Saya ingin menjadi relawan. Bagaimana cara mendaftar?`; (2) tham gia — `Saya mau bergabung dengan kegiatan baksos.`; (3) ngỏ giúp — `Ada yang bisa saya bantu? Saya siap membantu.`; (4) báo lịch — `Saya bisa ikut hari ___, dari ___ sampai ___.`. Để quyên góp: `Saya mau menyumbang ___ untuk ___.`.\n\nNhớ các cặp phụ tố hay nhầm: `mendaftar` (động từ, đăng ký) ≠ `pendaftaran` (danh từ, việc/khâu đăng ký); `menyumbang` (động từ, quyên góp) ≠ `sumbangan` (danh từ, khoản quyên); `membantu` (động từ, giúp) vs `bantuan` (danh từ, sự giúp đỡ); động từ meN-…-kan cần `-kan`: `membersihkan` (làm sạch), `mengadakan` (tổ chức). Cặp cố định: `bergabung DENGAN`, `terima kasih ATAS`, `dari … SAMPAI …`. Đánh vần viết tắt: `PMI` = pe-em-i, `RT` = er-te, `RW` = er-we, `LSM` = el-es-em. Giữ giọng phẳng; `c` đọc 'ch', `j` đọc 'j' (như 'jam').",
    tip_advice_en:
      "Learn the four-line volunteer frame: (1) express interest — `Saya ingin menjadi relawan. Bagaimana cara mendaftar?`; (2) join — `Saya mau bergabung dengan kegiatan baksos.`; (3) offer help — `Ada yang bisa saya bantu? Saya siap membantu.`; (4) state availability — `Saya bisa ikut hari ___, dari ___ sampai ___.`. To donate: `Saya mau menyumbang ___ untuk ___.`.\n\nKeep these affix pairs straight: `mendaftar` (verb, register) ≠ `pendaftaran` (noun, registration); `menyumbang` (verb, donate) ≠ `sumbangan` (noun, a donation); `membantu` (verb, help) vs `bantuan` (noun, assistance); meN-…-kan verbs need `-kan`: `membersihkan` (to clean), `mengadakan` (to hold). Fixed pairings: `bergabung DENGAN`, `terima kasih ATAS`, `dari … SAMPAI …`. Spell abbreviations: `PMI` = pe-em-i, `RT` = er-te, `RW` = er-we, `LSM` = el-es-em. Keep your pitch flat; `c` is 'ch', `j` is the English 'j' as in 'jam'.",
    vocabulary: [
      // People & roles
      {
        word: "relawan",
        en: "volunteer",
        vi: "tình nguyện viên",
        pos: "noun",
        pronunciation_vi: "re-LA-wan — từ `rela` (tự nguyện) + -wan; `sukarelawan` là dạng dài hơn",
        pronunciation_en: "re-LA-wan — from `rela` (willing) + -wan; `sukarelawan` is the longer form",
      },
      {
        word: "warga",
        en: "resident / citizen / member",
        vi: "cư dân / thành viên cộng đồng",
        pos: "noun",
        pronunciation_vi: "WAR-ga — `warga setempat` = dân địa phương; `warga negara` = công dân",
        pronunciation_en: "WAR-ga — `warga setempat` = locals; `warga negara` = citizen (of a state)",
      },
      {
        word: "panitia",
        en: "committee / organizing team",
        vi: "ban tổ chức",
        pos: "noun",
        pronunciation_vi: "pa-NI-ti-a — `panitia acara` = ban tổ chức sự kiện",
        pronunciation_en: "pa-NEE-ti-a — `panitia acara` = the event organizing committee",
      },
      // Activities
      {
        word: "gotong royong",
        en: "communal mutual aid",
        vi: "tương trợ cộng đồng",
        pos: "noun/phrase",
        pronunciation_vi: "GO-tong RO-yong — giá trị quốc gia; gần 'tình làng nghĩa xóm'",
        pronunciation_en: "GO-tong RO-yong — a national value; close to communal neighbourliness",
      },
      {
        word: "kerja bakti",
        en: "communal volunteer labour",
        vi: "lao động công ích chung",
        pos: "noun",
        pronunciation_vi: "KER-ja BAK-ti — dọn dẹp khu phố tập thể, thường cuối tuần",
        pronunciation_en: "KER-ja BAK-ti — collective neighbourhood clean-up, usually weekends",
      },
      {
        word: "bakti sosial (baksos)",
        en: "social service / charity drive",
        vi: "công tác thiện nguyện",
        pos: "noun",
        pronunciation_vi: "BAK-ti so-si-AL (BAK-sos) — phát quà, khám bệnh, cứu trợ",
        pronunciation_en: "BAK-ti so-si-AL (BAK-sos) — aid distribution, free clinics, relief",
      },
      {
        word: "donor darah",
        en: "blood donation",
        vi: "hiến máu",
        pos: "noun",
        pronunciation_vi: "DO-nor DA-rah — thường do `PMI` tổ chức; `pendonor` = người hiến",
        pronunciation_en: "DO-nor DA-rah — usually run by `PMI`; `pendonor` = a donor",
      },
      // Verbs
      {
        word: "mendaftar",
        en: "to register / sign up",
        vi: "đăng ký",
        pos: "verb",
        pronunciation_vi: "men-DAF-tar — động từ (meN- + `daftar`); danh từ là `pendaftaran`",
        pronunciation_en: "men-DAF-tar — the verb (meN- + `daftar`); the noun is `pendaftaran`",
      },
      {
        word: "bergabung",
        en: "to join (a group)",
        vi: "tham gia / gia nhập",
        pos: "verb",
        pronunciation_vi: "ber-ga-BUNG — luôn đi với `dengan`: `bergabung dengan …`",
        pronunciation_en: "ber-ga-BOONG — always takes `dengan`: `bergabung dengan …`",
      },
      {
        word: "menyumbang",
        en: "to donate / contribute",
        vi: "quyên góp / đóng góp",
        pos: "verb",
        pronunciation_vi: "me-nyum-BANG — động từ (meN- + `sumbang`); danh từ là `sumbangan`",
        pronunciation_en: "me-nyoom-BANG — the verb (meN- + `sumbang`); the noun is `sumbangan`",
      },
      {
        word: "membantu",
        en: "to help / assist",
        vi: "giúp đỡ",
        pos: "verb",
        pronunciation_vi: "mem-BAN-tu — động từ chuẩn (meN- + `bantu`); danh từ `bantuan`",
        pronunciation_en: "mem-BAN-too — the standard verb (meN- + `bantu`); noun `bantuan`",
      },
      {
        word: "mengadakan",
        en: "to hold / organize (an event)",
        vi: "tổ chức (sự kiện)",
        pos: "verb",
        pronunciation_vi: "me-nga-DA-kan — meN- + `ada` + -kan; `mengadakan acara` = tổ chức sự kiện",
        pronunciation_en: "me-nga-DA-kan — meN- + `ada` + -kan; `mengadakan acara` = to hold an event",
      },
      // Organizations & places
      {
        word: "PMI",
        en: "Indonesian Red Cross",
        vi: "Hội Chữ thập đỏ Indonesia",
        pos: "noun (acronym)",
        pronunciation_vi: "pe-em-I — Palang Merah Indonesia; lo hiến máu & cứu trợ",
        pronunciation_en: "pe-em-EE — Palang Merah Indonesia; runs blood donation & relief",
      },
      {
        word: "posko",
        en: "command / relief / intake post",
        vi: "trạm chỉ huy / tiếp nhận",
        pos: "noun",
        pronunciation_vi: "POS-ko — viết tắt `pos komando`; nơi đăng ký/nhận cứu trợ",
        pronunciation_en: "POS-ko — short for `pos komando`; the sign-up/relief point",
      },
      {
        word: "yayasan",
        en: "foundation / charity (org)",
        vi: "quỹ từ thiện / tổ chức phi lợi nhuận",
        pos: "noun",
        pronunciation_vi: "ya-YA-san — `yayasan sosial`; nhiều nơi tuyển `relawan`",
        pronunciation_en: "ya-YA-san — `yayasan sosial`; many recruit `relawan`",
      },
      {
        word: "sumbangan / donasi",
        en: "donation / contribution",
        vi: "khoản quyên góp",
        pos: "noun",
        pronunciation_vi: "sum-BANG-an / do-NA-si — `menggalang dana` = gây quỹ",
        pronunciation_en: "soom-BANG-an / do-NA-si — `menggalang dana` = to fundraise",
      },
    ],
    dialogue: [
      // Dialogue A: signing up as a volunteer at a yayasan
      {
        speaker: "Linh",
        text: "Selamat siang. Saya ingin menjadi relawan. Bagaimana cara mendaftar?",
        vi: "Chào buổi trưa. Tôi muốn làm tình nguyện viên. Đăng ký bằng cách nào ạ?",
        en: "Good afternoon. I'd like to become a volunteer. How do I register?",
      },
      {
        speaker: "Koordinator",
        text: "Bagus sekali! Isi formulir ini dulu. Kamu mau bergabung dengan kegiatan apa?",
        vi: "Tuyệt quá! Điền mẫu này trước nhé. Bạn muốn tham gia hoạt động nào?",
        en: "Wonderful! Fill out this form first. Which activity do you want to join?",
      },
      {
        speaker: "Linh",
        text: "Saya tertarik dengan bakti sosial dan donor darah. Saya siap membantu apa saja.",
        vi: "Tôi quan tâm đến công tác thiện nguyện và hiến máu. Tôi sẵn sàng giúp bất cứ việc gì.",
        en: "I'm interested in social service and blood donation. I'm ready to help with anything.",
      },
      {
        speaker: "Koordinator",
        text: "Kapan kamu biasanya luang?",
        vi: "Bạn thường rảnh khi nào?",
        en: "When are you usually free?",
      },
      {
        speaker: "Linh",
        text: "Saya bisa ikut hari Sabtu, dari pagi sampai sore.",
        vi: "Tôi có thể tham gia thứ Bảy, từ sáng đến chiều.",
        en: "I can join on Saturdays, from morning to afternoon.",
      },
      {
        speaker: "Koordinator",
        text: "Sempurna. Sabtu depan ada baksos untuk korban banjir di posko RW 04. Sampai jumpa di sana, ya. Terima kasih atas partisipasinya!",
        vi: "Hoàn hảo. Thứ Bảy tới có đợt thiện nguyện cho nạn nhân lũ lụt tại trạm khu phố 04. Hẹn gặp ở đó nhé. Cảm ơn vì sự tham gia của bạn!",
        en: "Perfect. Next Saturday there's a charity drive for flood victims at the RW 04 post. See you there. Thank you for taking part!",
      },
      // Dialogue B: neighbourhood kerja bakti
      {
        speaker: "Pak RT",
        text: "Mbak Linh, besok pagi ada kerja bakti membersihkan selokan. Bisa ikut?",
        vi: "Chị Linh, sáng mai có buổi lao động chung dọn cống. Tham gia được không?",
        en: "Mbak Linh, tomorrow morning there's a clean-up to clear the drainage. Can you join?",
      },
      {
        speaker: "Linh",
        text: "Tentu, Pak. Ada yang bisa saya bantu? Saya bawa sapu dan air minum untuk semua.",
        vi: "Chắc chắn rồi anh. Có gì tôi giúp được không? Tôi mang chổi và nước uống cho mọi người.",
        en: "Of course, sir. Is there anything I can help with? I'll bring a broom and drinking water for everyone.",
      },
      {
        speaker: "Pak RT",
        text: "Wah, guyub sekali. Nanti setelah selesai kita makan bareng, ya.",
        vi: "Ồ, gắn bó quá. Lát xong mình ăn chung nhé.",
        en: "Oh, how community-minded. Afterwards we'll eat together, okay.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn làm tình nguyện viên.", answer: "Saya ingin menjadi relawan." },
          { prompt: "Đăng ký bằng cách nào?", answer: "Bagaimana cara mendaftar?" },
          { prompt: "Tôi muốn tham gia hoạt động thiện nguyện.", answer: "Saya mau bergabung dengan kegiatan bakti sosial." },
          { prompt: "Có gì tôi giúp được không?", answer: "Ada yang bisa saya bantu?" },
          { prompt: "Tôi có thể tham gia thứ Bảy, từ sáng đến chiều.", answer: "Saya bisa ikut hari Sabtu, dari pagi sampai sore." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Quyên góp & cảm ơn — dịch sang tiếng Indonesia:",
        instruction_en: "Donating & thanking — translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn quyên góp quần áo cho nạn nhân lũ lụt.", answer: "Saya mau menyumbang pakaian untuk korban banjir." },
          { prompt: "Điểm hiến máu gần nhất ở đâu?", answer: "Di mana tempat donor darah yang terdekat?" },
          { prompt: "Dân cư sẽ tổ chức lao động chung.", answer: "Warga akan mengadakan kerja bakti." },
          { prompt: "Cảm ơn vì sự tham gia của bạn.", answer: "Terima kasih atas partisipasi Anda." },
          { prompt: "Sự giúp đỡ này rất ý nghĩa.", answer: "Bantuan ini sangat berarti." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn `mendaftar`/`pendaftaran`, `menyumbang`/`sumbangan`, hay `membantu`/`bantuan` cho đúng (động từ vs danh từ):",
        instruction_en:
          "Choose `mendaftar`/`pendaftaran`, `menyumbang`/`sumbangan`, or `membantu`/`bantuan` correctly (verb vs noun):",
        items: [
          { prompt: "Saya mau ___ sebagai relawan.", answer: "mendaftar", hint: "động từ 'đăng ký' (meN-)" },
          { prompt: "___ dibuka mulai hari Senin.", answer: "Pendaftaran", hint: "danh từ 'việc đăng ký' (peN-…-an)" },
          { prompt: "Kami ___ buku untuk sekolah itu.", answer: "menyumbang", hint: "động từ 'quyên góp' (meN-)" },
          { prompt: "___ Anda sangat berarti bagi kami.", answer: "Sumbangan", hint: "danh từ 'khoản quyên' (-an)" },
          { prompt: "Saya siap ___ kapan saja.", answer: "membantu", hint: "động từ 'giúp đỡ' (meN-)" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung đăng ký tình nguyện — điền chỗ trống: `Saya ingin menjadi ___. Saya mau bergabung dengan ___. Saya bisa ikut hari ___, dari ___ sampai ___.`",
        instruction_en:
          "Volunteer sign-up frame — fill the blanks: `Saya ingin menjadi ___. Saya mau bergabung dengan ___. Saya bisa ikut hari ___, dari ___ sampai ___.`",
        example:
          "Saya ingin menjadi relawan. Saya mau bergabung dengan kegiatan donor darah. Saya bisa ikut hari Minggu, dari pagi sampai siang.",
        example_vi:
          "Tôi muốn làm tình nguyện viên. Tôi muốn tham gia hoạt động hiến máu. Tôi có thể tham gia Chủ nhật, từ sáng đến trưa.",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra tình nguyện & cộng đồng — bạn làm được chưa?",
        instruction_en: "Volunteer & community self-check — can you do each one?",
        items: [
          { vi: "Tôi có thể ngỏ ý làm tình nguyện và hỏi cách đăng ký.", en: "I can express interest in volunteering and ask how to register." },
          { vi: "Tôi phân biệt động từ và danh từ: `mendaftar`/`pendaftaran`, `menyumbang`/`sumbangan`.", en: "I distinguish verb from noun: `mendaftar`/`pendaftaran`, `menyumbang`/`sumbangan`." },
          { vi: "Tôi dùng đúng cặp cố định: `bergabung dengan`, `terima kasih atas`, `dari … sampai …`.", en: "I use the fixed pairings: `bergabung dengan`, `terima kasih atas`, `dari … sampai …`." },
          { vi: "Tôi dùng động từ meN-…-kan đầy đủ `-kan`: `membersihkan`, `mengadakan`.", en: "I use full meN-…-kan verbs: `membersihkan`, `mengadakan`." },
          { vi: "Tôi hiểu `gotong royong`, `kerja bakti`, `bakti sosial` và sẵn sàng tham gia.", en: "I understand `gotong royong`, `kerja bakti`, `bakti sosial` and am ready to join." },
          { vi: "Tôi đánh vần được `PMI` = pe-em-i và biết `posko`, `yayasan`.", en: "I can spell `PMI` = pe-em-i and know `posko`, `yayasan`." },
          { vi: "Tôi dùng `saya`/`Anda` và lời cảm ơn ấm áp hợp văn hóa cộng đồng.", en: "I use `saya`/`Anda` and warm thanks that fit community culture." },
        ],
      },
    ],
  },
];

export default lessons;
