// Active & Passive Voice Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling `extra/*` files (construction-worker.ts, tax-documents.ts…),
// which in turn mirror the French `FrenchLesson` shape. When the shared Indonesian
// registry (src/languages/indonesian/lessons.ts) lands, swap the local types for a
// shared import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// Topic: the voice system that organizes ALL Indonesian verbs —
//   • meN- active   : subject does it      (membaca = to read)
//   • di- passive   : 3rd-person agent     (dibaca oleh dia = read by him)
//   • bare passive  : 1st/2nd-person agent (saya baca = read by me — NO di-)
//   • ter- accidental/stative              (terbaca = accidentally/already read)
//   • ke-…-an adversative stative          (kehujanan = got caught in the rain)
// Vietnamese marks passive with separate words (bị / được) and never touches the
// verb, so the hardest leap for a VN learner is that Indonesian changes the verb's
// AFFIX instead. This lesson drills the four contrasts side by side.

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

// Loosely typed so per-type fields (translation, fill_blank, transform, checklist) can vary.
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
    id: "indonesian_passive_active",
    level: "B1",
    category: "grammar",
    title_vi: "Thể chủ động và bị động (meN-, di-, ter-, ke-...-an)",
    title_en: "Active & passive voice (meN-, di-, ter-, ke-...-an)",
    sentences: [
      // ── meN- active ─────────────────────────────────────────────────────
      {
        en: "Dia membaca buku itu.",
        vi: "Anh ấy đọc cuốn sách đó.",
        pronunciation_focus: [
          "DI-a mem-BA-ca BU-ku I-tu — chủ động `meN-`: `mem-` + gốc `baca` (đọc) = `membaca`. Chủ ngữ là người LÀM hành động.",
          "Mẹo: `meN-` đổi âm theo chữ đầu của gốc: ba→`mem`baca, tulis→`men`ulis, kirim→`me`ngirim. Đây là 'meN- biến âm'.",
          "Lỗi người Việt: nói `dia baca buku` (bỏ `meN-`). Khẩu ngữ chấp nhận, nhưng câu chuẩn cần `membaca`.",
          "Luyện: `Dia membaca buku itu.`",
        ],
        pronunciation_focus_en: [
          "DI-a mem-BA-ca BU-ku I-tu — `meN-` active: `mem-` + root `baca` (read) = `membaca`. The subject is the DOER.",
          "Tip: `meN-` morphs to the root's first sound: ba→`mem`baca, tulis→`men`ulis, kirim→`me`ngirim. This is 'meN- assimilation'.",
          "VN-speaker trap: `dia baca buku` (dropping `meN-`). Casual speech allows it, but standard needs `membaca`.",
          "Drill: `Dia membaca buku itu.`",
        ],
      },
      {
        en: "Saya menulis surat untuk ibu.",
        vi: "Tôi viết thư cho mẹ.",
        pronunciation_focus: [
          "SA-ya me-NU-lis SU-rat un-TUK I-bu — `menulis` = `men-` + `tulis`; chữ `t` rụng khi gặp `meN-` (tulis→menulis, KHÔNG mentulis).",
          "Mẹo: phụ âm `t, p, s, k` RỤNG khi thêm `meN-`: tulis→me`n`ulis, pukul→me`m`ukul, sapu→me`ny`apu, kirim→me`ng`irim.",
          "Lỗi người Việt: giữ nguyên `t`: `mentulis`. Sai — `t` biến mất: `menulis`.",
          "Luyện: `Saya menulis surat untuk ibu.`",
        ],
        pronunciation_focus_en: [
          "SA-ya me-NU-lis SU-rat un-TUK I-bu — `menulis` = `men-` + `tulis`; the `t` drops with `meN-` (tulis→menulis, NOT mentulis).",
          "Tip: consonants `t, p, s, k` DROP with `meN-`: tulis→me`n`ulis, pukul→me`m`ukul, sapu→me`ny`apu, kirim→me`ng`irim.",
          "VN-speaker trap: keeping the `t`: `mentulis`. Wrong — the `t` vanishes: `menulis`.",
          "Drill: `Saya menulis surat untuk ibu.`",
        ],
      },
      // ── di- passive (3rd person) ────────────────────────────────────────
      {
        en: "Buku itu dibaca oleh dia.",
        vi: "Cuốn sách đó được anh ấy đọc.",
        pronunciation_focus: [
          "BU-ku I-tu di-BA-ca O-leh DI-a — bị động `di-`: `di-` + gốc TRẦN `baca` = `dibaca`; `oleh` = bởi/do (đánh dấu người làm).",
          "Mẹo so với tiếng Việt: tiếng Việt thêm TỪ riêng (`được`/`bị`) và không đụng động từ; tiếng Indonesia đổi TIỀN TỐ (`mem`baca→`di`baca).",
          "Lỗi người Việt: nói `dibaca oleh saya`. KHÔNG được — ngôi 1/2 dùng bị động trần (`saya baca`), không `di-`.",
          "Luyện: `Buku itu dibaca oleh dia.`",
        ],
        pronunciation_focus_en: [
          "BU-ku I-tu di-BA-ca O-leh DI-a — `di-` passive: `di-` + BARE root `baca` = `dibaca`; `oleh` = by (marks the agent).",
          "Tip vs Vietnamese: Vietnamese adds a SEPARATE word (`được`/`bị`) and leaves the verb alone; Indonesian changes the PREFIX (`mem`baca→`di`baca).",
          "VN-speaker trap: `dibaca oleh saya`. NOT allowed — 1st/2nd person uses the bare passive (`saya baca`), no `di-`.",
          "Drill: `Buku itu dibaca oleh dia.`",
        ],
      },
      {
        en: "Surat ini sudah dikirim kemarin.",
        vi: "Lá thư này đã được gửi hôm qua.",
        pronunciation_focus: [
          "SU-rat I-ni SU-dah di-KI-rim ke-MA-rin — `dikirim` = `di-` + `kirim`; chú ý gốc TRẦN (không `mengirim`). `oleh + người` có thể bỏ.",
          "Mẹo: rất hay gặp `di-` mà KHÔNG có `oleh` khi người làm không quan trọng — như tin tức: `Harga dinaikkan` (Giá được tăng).",
          "Lỗi người Việt: thêm `meN-` vào câu bị động: `mengirim` thay `dikirim`. Bị động = `di-` + gốc trần.",
          "Luyện: `Surat ini sudah dikirim kemarin.`",
        ],
        pronunciation_focus_en: [
          "SU-rat I-ni SU-dah di-KI-rim ke-MA-rin — `dikirim` = `di-` + `kirim`; note the BARE root (not `mengirim`). The `oleh + agent` can be dropped.",
          "Tip: `di-` with NO `oleh` is common when the doer doesn't matter — like news: `Harga dinaikkan` (The price was raised).",
          "VN-speaker trap: adding `meN-` to a passive: `mengirim` instead of `dikirim`. Passive = `di-` + bare root.",
          "Drill: `Surat ini sudah dikirim kemarin.`",
        ],
      },
      // ── Bare passive (1st/2nd person) ───────────────────────────────────
      {
        en: "Buku itu saya baca tadi malam.",
        vi: "Cuốn sách đó tôi đã đọc tối qua.",
        pronunciation_focus: [
          "BU-ku I-tu SA-ya BA-ca TA-di MA-lam — bị động trần ngôi 1: [đối tượng] + [đại từ] + [gốc TRẦN]. `saya baca` = (cái đó) tôi đọc. KHÔNG `di-`, KHÔNG `meN-`.",
          "Mẹo: đây là điểm KHÓ NHẤT cho người Việt — `saya baca` ở đây là BỊ ĐỘNG ('được tôi đọc'), không phải chủ động. Đối tượng đứng đầu câu.",
          "Lỗi người Việt: nói `dibaca saya` hay `disaya baca`. SAI hoàn toàn. Ngôi 1/2: `saya baca`, `kamu baca`, `kita baca`.",
          "Luyện: `Buku itu saya baca tadi malam.`",
        ],
        pronunciation_focus_en: [
          "BU-ku I-tu SA-ya BA-ca TA-di MA-lam — 1st-person passive: [object] + [pronoun] + [BARE root]. `saya baca` = (it) was read by me. NO `di-`, NO `meN-`.",
          "Tip: this is the HARDEST point for VN learners — `saya baca` here is PASSIVE ('read by me'), not active. The object fronts the sentence.",
          "VN-speaker trap: `dibaca saya` or `disaya baca`. Completely wrong. 1st/2nd person: `saya baca`, `kamu baca`, `kita baca`.",
          "Drill: `Buku itu saya baca tadi malam.`",
        ],
      },
      {
        en: "Pekerjaan itu akan kamu selesaikan besok, kan?",
        vi: "Công việc đó ngày mai bạn sẽ hoàn thành, đúng không?",
        pronunciation_focus: [
          "pe-ker-JA-an I-tu A-kan KA-mu se-le-SAI-kan be-SOK, kan — bị động trần ngôi 2: `kamu selesaikan` = (cái đó) bạn hoàn thành. Trợ từ thì (`akan`) đứng TRƯỚC đại từ.",
          "Mẹo: trật tự cố định — [đối tượng] + [akan/sudah/bisa] + [đại từ] + [gốc]. `akan kamu selesaikan`.",
          "Lỗi người Việt: chèn `meN-`: `kamu menyelesaikan`. Trong bị động trần dùng gốc + `-kan`, KHÔNG `meN-`.",
          "Luyện: `Pekerjaan itu akan kamu selesaikan besok, kan?`",
        ],
        pronunciation_focus_en: [
          "pe-ker-JA-an I-tu A-kan KA-mu se-le-SAI-kan be-SOK, kan — 2nd-person passive: `kamu selesaikan` = (it) will be finished by you. The tense word (`akan`) comes BEFORE the pronoun.",
          "Tip: fixed order — [object] + [akan/sudah/bisa] + [pronoun] + [root]. `akan kamu selesaikan`.",
          "VN-speaker trap: inserting `meN-`: `kamu menyelesaikan`. The bare passive uses root + `-kan`, NOT `meN-`.",
          "Drill: `Pekerjaan itu akan kamu selesaikan besok, kan?`",
        ],
      },
      // ── ter- accidental / stative ───────────────────────────────────────
      {
        en: "Maaf, pesannya terkirim dua kali.",
        vi: "Xin lỗi, tin nhắn bị gửi nhầm hai lần.",
        pronunciation_focus: [
          "ma-AF, pe-SAN-nya ter-KI-rim du-A KA-li — `ter-` = vô ý/ngoài chủ đích: `terkirim` = (lỡ) bị gửi đi. So `dikirim` (được gửi có chủ đích) ≠ `terkirim` (lỡ gửi).",
          "Mẹo so với tiếng Việt: `ter-` ≈ 'lỡ/vô tình bị' — `terjatuh` (lỡ ngã), `terbangun` (chợt tỉnh), `tertinggal` (bỏ quên).",
          "Lỗi người Việt: dùng `di-` cho việc ngoài ý muốn. Cố ý = `di-`; vô ý = `ter-`.",
          "Luyện: `Maaf, pesannya terkirim dua kali.`",
        ],
        pronunciation_focus_en: [
          "ma-AF, pe-SAN-nya ter-KI-rim du-A KA-li — `ter-` = accidental/unintended: `terkirim` = got sent (by accident). Compare `dikirim` (sent on purpose) ≠ `terkirim` (sent accidentally).",
          "Tip vs Vietnamese: `ter-` ≈ 'accidentally got' — `terjatuh` (fell by accident), `terbangun` (woke up suddenly), `tertinggal` (left behind).",
          "VN-speaker trap: using `di-` for unintended events. On purpose = `di-`; by accident = `ter-`.",
          "Drill: `Maaf, pesannya terkirim dua kali.`",
        ],
      },
      {
        en: "Pintunya sudah terbuka dari tadi.",
        vi: "Cửa đã (ở trạng thái) mở từ nãy.",
        pronunciation_focus: [
          "PIN-tu-nya SU-dah ter-BU-ka da-ri TA-di — `ter-` cũng chỉ TRẠNG THÁI hoàn thành: `terbuka` = đang mở (sẵn). So `dibuka` (được ai đó mở — hành động) ≠ `terbuka` (ở trạng thái mở).",
          "Mẹo: `ter-` + tính chất = trạng thái: `tertutup` (đóng sẵn), `terbuka` (mở sẵn), `terkenal` (nổi tiếng).",
          "Lỗi người Việt: dùng `dibuka` khi chỉ muốn tả trạng thái 'đang mở'. Trạng thái tĩnh = `terbuka`.",
          "Luyện: `Pintunya sudah terbuka dari tadi.`",
        ],
        pronunciation_focus_en: [
          "PIN-tu-nya SU-dah ter-BU-ka da-ri TA-di — `ter-` also marks a RESULTING STATE: `terbuka` = (is) open. Compare `dibuka` (opened by someone — an action) ≠ `terbuka` (in an open state).",
          "Tip: `ter-` + quality = a state: `tertutup` (shut), `terbuka` (open), `terkenal` (famous).",
          "VN-speaker trap: using `dibuka` when you only mean the state 'is open'. A static state = `terbuka`.",
          "Drill: `Pintunya sudah terbuka dari tadi.`",
        ],
      },
      // ── ke-...-an adversative stative ───────────────────────────────────
      {
        en: "Kami kehujanan di jalan pulang.",
        vi: "Chúng tôi bị dính mưa trên đường về.",
        pronunciation_focus: [
          "KA-mi ke-hu-JA-nan di JA-lan PU-lang — `ke-…-an` quanh `hujan` (mưa) = `kehujanan` = bị mưa (chịu ảnh hưởng xấu). Đây là bị động 'lãnh đủ', không có người làm.",
          "Mẹo: `ke-…-an` từ danh từ/tính từ = 'bị (cái đó) đổ lên người': `kehujanan` (dính mưa), `kepanasan` (bị nóng), `kedinginan` (bị lạnh), `kemalaman` (bị tối muộn).",
          "Lỗi người Việt: nói `saya hujan` (= tôi là mưa?!). Để nói 'bị mắc mưa' phải là `kehujanan`.",
          "Luyện: `Kami kehujanan di jalan pulang.`",
        ],
        pronunciation_focus_en: [
          "KA-mi ke-hu-JA-nan di JA-lan PU-lang — `ke-…-an` around `hujan` (rain) = `kehujanan` = got rained on (adversely affected). This is the 'suffering' passive, with no agent.",
          "Tip: `ke-…-an` from a noun/adjective = 'got (that) inflicted on you': `kehujanan` (caught in rain), `kepanasan` (overheated), `kedinginan` (got cold), `kemalaman` (caught out late).",
          "VN-speaker trap: `saya hujan` (= I am rain?!). To say 'got caught in the rain' you need `kehujanan`.",
          "Drill: `Kami kehujanan di jalan pulang.`",
        ],
      },
      {
        en: "Dia ketiduran di bus dan kelewatan halte.",
        vi: "Anh ấy lỡ ngủ quên trên xe buýt và đi quá trạm.",
        pronunciation_focus: [
          "DI-a ke-ti-DU-ran di bus dan ke-le-WA-tan HAL-te — `ketiduran` = lỡ ngủ quên (ngoài ý muốn); `kelewatan` = bị quá/lố (lỡ qua trạm).",
          "Mẹo: `ke-…-an` cũng = 'lỡ … quá mức/ngoài ý muốn': `ketiduran` (ngủ quên), `kelewatan` (quá đà/lố), `kesiangan` (dậy trễ).",
          "Lỗi người Việt: lẫn `ter-` và `ke-…-an`. Cả hai đều ngoài ý muốn, nhưng `ke-…-an` nhấn 'chịu hậu quả xấu', thường từ danh từ/tính từ.",
          "Luyện: `Dia ketiduran di bus dan kelewatan halte.`",
        ],
        pronunciation_focus_en: [
          "DI-a ke-ti-DU-ran di bus dan ke-le-WA-tan HAL-te — `ketiduran` = fell asleep unintentionally; `kelewatan` = overshot/missed (went past the stop).",
          "Tip: `ke-…-an` also = 'accidentally did … to excess': `ketiduran` (dozed off), `kelewatan` (overdone/overshot), `kesiangan` (overslept).",
          "VN-speaker trap: mixing `ter-` and `ke-…-an`. Both are unintended, but `ke-…-an` stresses 'suffering a bad result' and usually builds from a noun/adjective.",
          "Drill: `Dia ketiduran di bus dan kelewatan halte.`",
        ],
      },
      // ── Side-by-side contrast ───────────────────────────────────────────
      {
        en: "Saya memecahkan gelas — bukan, gelasnya terpecah sendiri.",
        vi: "Tôi làm vỡ cái ly — à không, cái ly tự nó vỡ.",
        pronunciation_focus: [
          "SA-ya me-me-CAH-kan GE-las — BU-kan, GE-las-nya ter-PE-cah sen-DI-ri — cặp tương phản: `memecahkan` (chủ động, CỐ Ý làm vỡ) ↔ `terpecah` (`ter-`, tự vỡ/vô tình).",
          "Mẹo: cùng gốc `pecah` (vỡ): `memecahkan` = làm vỡ (có tác nhân); `dipecahkan` = bị làm vỡ (bị động cố ý); `terpecah` = vỡ ngoài ý muốn.",
          "Lỗi người Việt: dùng một dạng cho mọi nghĩa. Chọn theo Ý ĐỒ: cố ý→`meN-`/`di-`, vô ý→`ter-`.",
          "Luyện: `Saya memecahkan gelas — bukan, gelasnya terpecah sendiri.`",
        ],
        pronunciation_focus_en: [
          "SA-ya me-me-CAH-kan GE-las — BU-kan, GE-las-nya ter-PE-cah sen-DI-ri — the contrast pair: `memecahkan` (active, broke it ON PURPOSE) ↔ `terpecah` (`ter-`, broke by itself/accidentally).",
          "Tip: same root `pecah` (break): `memecahkan` = to break (with an agent); `dipecahkan` = was broken (intentional passive); `terpecah` = broke unintentionally.",
          "VN-speaker trap: using one form for every meaning. Choose by INTENT: on purpose→`meN-`/`di-`, by accident→`ter-`.",
          "Drill: `Saya memecahkan gelas — bukan, gelasnya terpecah sendiri.`",
        ],
      },
      {
        en: "Laporan ini saya tulis, lalu diperiksa oleh atasan.",
        vi: "Báo cáo này tôi viết, rồi được sếp kiểm tra.",
        pronunciation_focus: [
          "la-PO-ran I-ni SA-ya TU-lis, LA-lu di-pe-RIK-sa O-leh a-TA-san — một câu, HAI kiểu bị động: `saya tulis` (bị động trần, ngôi 1) + `diperiksa oleh atasan` (bị động `di-`, ngôi 3).",
          "Mẹo: chọn kiểu theo NGÔI của người làm: tôi/bạn/chúng ta → bị động trần (`saya tulis`); anh ấy/họ/danh từ → `di-` (`diperiksa oleh atasan`).",
          "Lỗi người Việt: trộn lẫn — `disaya tulis` hoặc `atasan periksa` (thiếu `di-`). Giữ đúng quy tắc theo ngôi.",
          "Luyện: `Laporan ini saya tulis, lalu diperiksa oleh atasan.`",
        ],
        pronunciation_focus_en: [
          "la-PO-ran I-ni SA-ya TU-lis, LA-lu di-pe-RIK-sa O-leh a-TA-san — one sentence, TWO passives: `saya tulis` (bare passive, 1st person) + `diperiksa oleh atasan` (di- passive, 3rd person).",
          "Tip: choose the form by the AGENT'S PERSON: I/you/we → bare passive (`saya tulis`); he/they/a noun → `di-` (`diperiksa oleh atasan`).",
          "VN-speaker trap: mixing them — `disaya tulis` or `atasan periksa` (missing `di-`). Keep the person rule straight.",
          "Drill: `Laporan ini saya tulis, lalu diperiksa oleh atasan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Tiếng Indonesia tổ chức gần như MỌI động từ quanh hệ thống 'thể' (voice), và đây là khác biệt lớn nhất với tiếng Việt. Tiếng Việt báo bị động bằng TỪ riêng — `bị` (nghĩa xấu) hoặc `được` (nghĩa tốt) — và KHÔNG đụng vào động từ: 'bị/được đọc'. Tiếng Indonesia ngược lại: nó đổi TIỀN TỐ ngay trên động từ. Bốn cột trụ: (1) `meN-` chủ động — chủ ngữ làm hành động (`membaca` = đọc); (2) `di-` bị động cho người làm là ngôi thứ 3 (`dibaca oleh dia`); (3) bị động TRẦN cho người làm là ngôi 1/2 — dùng đại từ + gốc trần, KHÔNG `di-` (`saya baca`, `kamu baca`); (4) `ter-` cho việc ngoài ý muốn hoặc trạng thái (`terkirim` lỡ gửi, `terbuka` mở sẵn); và (5) `ke-…-an` cho kiểu 'lãnh đủ' chịu hậu quả xấu (`kehujanan` dính mưa, `ketiduran` ngủ quên). Điều quan trọng về văn hóa: thể bị động `di-` được DÙNG NHIỀU hơn hẳn tiếng Việt/tiếng Anh, nhất là trong tin tức, công văn và lời lẽ trang trọng, vì nó nghe khách quan, nhã nhặn — tránh chỉ thẳng 'ai làm'. Trong tiếng Việt câu bị động nhiều khi nghe nặng nề; trong tiếng Indonesia nó là mặc định của văn viết.",
    cultural_notes_en:
      "Indonesian organizes almost EVERY verb around a 'voice' system, and this is the single biggest difference from Vietnamese. Vietnamese signals passive with a SEPARATE word — `bị` (bad sense) or `được` (good sense) — and leaves the verb untouched: 'bị/được đọc'. Indonesian does the opposite: it changes the PREFIX on the verb itself. Four pillars: (1) `meN-` active — the subject does the action (`membaca` = read); (2) `di-` passive when the agent is 3rd person (`dibaca oleh dia`); (3) the BARE passive when the agent is 1st/2nd person — pronoun + bare root, NO `di-` (`saya baca`, `kamu baca`); (4) `ter-` for the unintended or a resulting state (`terkirim` got sent by accident, `terbuka` is open); and (5) `ke-…-an` for the adversative 'suffering' passive (`kehujanan` got rained on, `ketiduran` dozed off). The cultural point: the `di-` passive is used FAR more than in Vietnamese or English — especially in news, official letters, and formal speech — because it sounds objective and tactful, avoiding pointing at 'who did it'. In Vietnamese a passive can feel heavy; in Indonesian it's the default of written register.",
    tip_advice_vi:
      "Quy trình chọn thể, hỏi 3 câu: (1) Chủ ngữ LÀM hay CHỊU hành động? Làm → `meN-` (`membaca`). Chịu → tiếp câu 2. (2) Người làm là AI? Ngôi 3 (anh ấy/họ/danh từ) → `di-` + gốc trần + (`oleh` + người): `dibaca (oleh) dia`. Ngôi 1/2 (tôi/bạn/chúng ta) → đại từ + gốc trần, KHÔNG `di-`: `saya baca`. (3) Việc đó CỐ Ý hay NGOÀI Ý? Ngoài ý/trạng thái → `ter-` (`terbuka`, `terkirim`); chịu hậu quả xấu (mưa, ngủ quên…) → `ke-…-an` (`kehujanan`, `ketiduran`). Ba cấm kỵ tuyệt đối: KHÔNG bao giờ `disaya`/`dikamu` (ngôi 1/2 không dùng `di-`); KHÔNG trộn `meN-` vào câu bị động (`mengirim` ≠ `dikirim`); KHÔNG dùng `di-` cho việc lỡ tay (dùng `ter-`). So với tiếng Việt: đừng dịch `bị`/`được` thành một từ rời — hãy đổi TIỀN TỐ. Tin vui: vẫn không chia thì, không thanh điệu — chỉ cần thuộc 5 khuôn.",
    tip_advice_en:
      "Voice-picking flow, ask 3 questions: (1) Does the subject DO or RECEIVE the action? Does → `meN-` (`membaca`). Receives → go to Q2. (2) WHO is the agent? 3rd person (he/they/a noun) → `di-` + bare root + (`oleh` + agent): `dibaca (oleh) dia`. 1st/2nd person (I/you/we) → pronoun + bare root, NO `di-`: `saya baca`. (3) Was it ON PURPOSE or NOT? Unintended/state → `ter-` (`terbuka`, `terkirim`); suffering a bad result (rain, oversleeping…) → `ke-…-an` (`kehujanan`, `ketiduran`). Three absolute taboos: NEVER `disaya`/`dikamu` (1st/2nd person never takes `di-`); NEVER mix `meN-` into a passive (`mengirim` ≠ `dikirim`); NEVER use `di-` for accidents (use `ter-`). Vs Vietnamese: don't translate `bị`/`được` as a loose word — change the PREFIX instead. Good news: still no tense, no tones — just memorize the 5 templates.",
    vocabulary: [
      // ── meN- active ─────────────────────────────────────────────────
      {
        cell_id: "13d9ff1c-ea13-4b28-b7f2-7949a46e6b98",
        word: "meN- (membaca)",
        en: "active prefix (to read)",
        vi: "tiền tố chủ động (đọc)",
        pos: "prefix/verb",
        pronunciation_vi: "me-eN — biến âm: mem-/men-/meng-/meny-/me-; `membaca`, `menulis`",
        pronunciation_en: "muh-eN — assimilates: mem-/men-/meng-/meny-/me-; `membaca`, `menulis`",
      },
      {
        cell_id: "118cf3d0-4567-4982-a7a0-42ba17a7ad81",
        word: "membaca",
        en: "to read (active)",
        vi: "đọc",
        pos: "verb (meN-)",
        pronunciation_vi: "mem-BA-ca — gốc `baca`; chủ ngữ là người đọc",
        pronunciation_en: "mem-BA-ca — root `baca`; subject is the reader",
      },
      {
        cell_id: "f1fb8569-9107-499b-bd63-9e79b3a1cb40",
        word: "menulis",
        en: "to write (active)",
        vi: "viết",
        pos: "verb (meN-)",
        pronunciation_vi: "me-NU-lis — gốc `tulis`; `t` rụng (không mentulis)",
        pronunciation_en: "me-NU-lis — root `tulis`; `t` drops (not mentulis)",
      },
      {
        cell_id: "e465f4d7-c677-4bbf-8f23-ea4459665676",
        word: "mengirim",
        en: "to send (active)",
        vi: "gửi",
        pos: "verb (meN-)",
        pronunciation_vi: "me-NGI-rim — gốc `kirim`; `k` rụng → meng-irim",
        pronunciation_en: "me-NGI-rim — root `kirim`; `k` drops → meng-irim",
      },
      // ── di- passive ─────────────────────────────────────────────────
      {
        cell_id: "616ba6ac-2e2b-437c-807e-95bc6a0eaea4",
        word: "di- (dibaca)",
        en: "passive prefix, 3rd-person agent",
        vi: "tiền tố bị động (ngôi 3)",
        pos: "prefix/verb",
        pronunciation_vi: "di — `di-` + gốc TRẦN; `dibaca`, `dikirim`",
        pronunciation_en: "dee — `di-` + BARE root; `dibaca`, `dikirim`",
      },
      {
        cell_id: "762b2ae0-39a7-4d10-aff6-7da53771b7b6",
        word: "oleh",
        en: "by (agent marker)",
        vi: "bởi / do",
        pos: "preposition",
        pronunciation_vi: "O-leh — `dibaca oleh dia`; có thể bỏ `oleh`",
        pronunciation_en: "OH-leh — `dibaca oleh dia`; `oleh` can be dropped",
      },
      {
        cell_id: "3ae2fc3f-864f-4fe0-b298-2cbf2aa1ccd1",
        word: "dikirim",
        en: "(is/was) sent",
        vi: "được gửi",
        pos: "verb (di-)",
        pronunciation_vi: "di-KI-rim — bị động ngôi 3 của `kirim`",
        pronunciation_en: "dee-KEE-rim — 3rd-person passive of `kirim`",
      },
      {
        cell_id: "41a1b48c-3f71-44d4-afe0-02c5f904161f",
        word: "diperiksa",
        en: "(is/was) checked",
        vi: "được kiểm tra",
        pos: "verb (di-)",
        pronunciation_vi: "di-pe-RIK-sa — `diperiksa oleh atasan`",
        pronunciation_en: "dee-puh-RIK-sa — `diperiksa oleh atasan`",
      },
      // ── Bare passive (1st/2nd) ──────────────────────────────────────
      {
        cell_id: "6acfc87a-7d6e-4921-a5b5-3109211b295e",
        word: "saya baca",
        en: "read by me (bare passive)",
        vi: "(cái đó) tôi đọc",
        pos: "passive construction",
        pronunciation_vi: "SA-ya BA-ca — ngôi 1: đại từ + gốc TRẦN, KHÔNG `di-`",
        pronunciation_en: "SAH-ya BA-ca — 1st person: pronoun + BARE root, NO `di-`",
      },
      {
        cell_id: "c6f52d2e-a340-4fc2-a537-98ddfe7c7e65",
        word: "kamu baca",
        en: "read by you (bare passive)",
        vi: "(cái đó) bạn đọc",
        pos: "passive construction",
        pronunciation_vi: "KA-mu BA-ca — ngôi 2; `akan kamu baca` (trợ từ trước đại từ)",
        pronunciation_en: "KA-mu BA-ca — 2nd person; `akan kamu baca` (aux before pronoun)",
      },
      // ── ter- accidental/stative ─────────────────────────────────────
      {
        cell_id: "7d4b8276-74e9-4ace-9fe8-a1336c5ee35b",
        word: "ter- (terkirim)",
        en: "accidental / stative prefix",
        vi: "tiền tố vô ý / trạng thái",
        pos: "prefix/verb",
        pronunciation_vi: "ter — vô ý: `terkirim`, `terjatuh`; trạng thái: `terbuka`",
        pronunciation_en: "ter — accidental: `terkirim`, `terjatuh`; state: `terbuka`",
      },
      {
        cell_id: "2f814997-b113-4f48-8152-dde9d53af65c",
        word: "terbuka",
        en: "(is) open (state)",
        vi: "đang mở (trạng thái)",
        pos: "verb (ter-)",
        pronunciation_vi: "ter-BU-ka — trạng thái, ≠ `dibuka` (hành động mở)",
        pronunciation_en: "ter-BU-ka — a state, ≠ `dibuka` (the act of opening)",
      },
      {
        cell_id: "4801519f-f77e-4694-9195-2e3e90222961",
        word: "terjatuh",
        en: "to fall accidentally",
        vi: "lỡ ngã / rơi",
        pos: "verb (ter-)",
        pronunciation_vi: "ter-JA-tuh — ngoài ý muốn; ≠ `menjatuhkan` (cố làm rơi)",
        pronunciation_en: "ter-JA-tooh — unintended; ≠ `menjatuhkan` (drop on purpose)",
      },
      {
        cell_id: "88d404e9-76ec-47fe-9282-34f4d127c821",
        word: "tertinggal",
        en: "left behind (accidentally)",
        vi: "bỏ quên",
        pos: "verb (ter-)",
        pronunciation_vi: "ter-TING-gal — `HP saya tertinggal` = quên điện thoại",
        pronunciation_en: "ter-TING-gal — `HP saya tertinggal` = I left my phone behind",
      },
      // ── ke-...-an adversative ───────────────────────────────────────
      {
        cell_id: "0592daf4-28ea-4b27-af1a-d899d6a96777",
        word: "ke-…-an (kehujanan)",
        en: "adversative 'suffering' passive",
        vi: "bị 'lãnh đủ'",
        pos: "circumfix/verb",
        pronunciation_vi: "ke-…-an — `kehujanan`, `kedinginan`, `ketiduran`",
        pronunciation_en: "ke-…-an — `kehujanan`, `kedinginan`, `ketiduran`",
      },
      {
        cell_id: "4bff8e85-23fc-4459-b185-7c4c952d02fe",
        word: "kehujanan",
        en: "to get caught in the rain",
        vi: "bị dính mưa",
        pos: "verb (ke-…-an)",
        pronunciation_vi: "ke-hu-JA-nan — gốc `hujan` (mưa); không có người làm",
        pronunciation_en: "ke-hu-JA-nan — root `hujan` (rain); no agent",
      },
      {
        cell_id: "c027de31-a390-471b-981a-d1a3878be1f2",
        word: "ketiduran",
        en: "to fall asleep unintentionally",
        vi: "ngủ quên",
        pos: "verb (ke-…-an)",
        pronunciation_vi: "ke-ti-DU-ran — gốc `tidur` (ngủ); lỡ ngủ mất",
        pronunciation_en: "ke-ti-DU-ran — root `tidur` (sleep); dozed off",
      },
      {
        cell_id: "b3e9c29d-ffda-4ed0-a153-7e93f849cbe2",
        word: "kedinginan",
        en: "to be (adversely) cold",
        vi: "bị lạnh cóng",
        pos: "verb (ke-…-an)",
        pronunciation_vi: "ke-di-NGI-nan — gốc `dingin` (lạnh); chịu cái lạnh",
        pronunciation_en: "ke-di-NGI-nan — root `dingin` (cold); suffering the cold",
      },
      // ── Contrast roots ──────────────────────────────────────────────
      {
        cell_id: "8c3d4ed5-4477-4a20-8098-a8775b680dbd",
        word: "memecahkan / terpecah",
        en: "to break (on purpose) / break (by itself)",
        vi: "làm vỡ / tự vỡ",
        pos: "verb pair",
        pronunciation_vi: "me-me-CAH-kan / ter-PE-cah — cùng gốc `pecah`; ý đồ khác nhau",
        pronunciation_en: "me-me-CAH-kan / ter-PE-cah — same root `pecah`; different intent",
      },
      {
        cell_id: "8f5162a7-6de5-4a46-9cac-f8fd6986f03c",
        word: "menyelesaikan / diselesaikan",
        en: "to finish (active / passive)",
        vi: "hoàn thành (chủ động / bị động)",
        pos: "verb pair",
        pronunciation_vi: "me-nye-le-SAI-kan / di-se-le-SAI-kan — gốc `selesai` + `-kan`",
        pronunciation_en: "me-nye-le-SAI-kan / di-se-le-SAI-kan — root `selesai` + `-kan`",
      },
    ],
    dialogue: [
      // Dialogue: two coworkers untangle who did what — every voice appears
      {
        cell_id: "fc5e31e6-8789-42b0-bef4-76b484a0f5fd",
        speaker: "Rudi",
        text: "Laporan bulanan sudah kamu kirim ke Bu Sari?",
        vi: "Báo cáo tháng bạn đã gửi cho cô Sari chưa? (bị động trần ngôi 2)",
        en: "Have you sent the monthly report to Bu Sari? (2nd-person bare passive)",
      },
      {
        cell_id: "dd9e33f4-d107-4dde-b76e-5203314f58a7",
        speaker: "Dewi",
        text: "Sudah saya kirim tadi pagi, lalu langsung diperiksa oleh beliau.",
        vi: "Tôi đã gửi sáng nay, rồi được cô ấy kiểm tra ngay. (bị động trần + `di-`)",
        en: "I sent it this morning, and it was checked by her right away. (bare passive + `di-`)",
      },
      {
        cell_id: "99c3f6ee-3c9b-4696-ac76-e60385f703c9",
        speaker: "Rudi",
        text: "Oh ya? Maaf, kemarin filenya terkirim dua kali gara-gara sinyal jelek.",
        vi: "Ồ vậy à? Xin lỗi, hôm qua file bị gửi nhầm hai lần vì sóng yếu. (`ter-` vô ý)",
        en: "Oh really? Sorry, yesterday the file got sent twice because of bad signal. (`ter-` accidental)",
      },
      {
        cell_id: "3d64a93d-e455-4b68-9fe3-6f1f6e3cbc6c",
        speaker: "Dewi",
        text: "Tidak apa-apa. Kemarin aku juga kehujanan pulang kantor, lalu ketiduran di rumah.",
        vi: "Không sao. Hôm qua tôi cũng dính mưa lúc về, rồi ngủ quên ở nhà. (`ke-…-an`)",
        en: "No problem. Yesterday I got rained on heading home, then dozed off at home. (`ke-…-an`)",
      },
      {
        cell_id: "028baf23-dc04-4094-9c2f-cb55c3f4346c",
        speaker: "Rudi",
        text: "Hahaha. Nanti sisa datanya aku yang masukkan, kamu istirahat saja.",
        vi: "Haha. Lát dữ liệu còn lại để tôi nhập, bạn cứ nghỉ đi. (bị động trần ngôi 1)",
        en: "Haha. I'll enter the rest of the data, you just rest. (1st-person bare passive)",
      },
      {
        cell_id: "3e0a4b26-cd3b-48b1-8133-29a198fc5b7f",
        speaker: "Dewi",
        text: "Makasih ya. Pintu ruang arsipnya sudah terbuka, datanya ada di sana.",
        vi: "Cảm ơn nhé. Cửa phòng lưu trữ đang mở sẵn, dữ liệu ở trong đó. (`ter-` trạng thái)",
        en: "Thanks. The archive room door is already open, the data's in there. (`ter-` stative)",
      },
    ],
    exercises: [
      {
        type: "transform",
        instruction_vi:
          "Đổi câu CHỦ ĐỘNG sang BỊ ĐỘNG đúng kiểu (ngôi 3 → `di-`; ngôi 1/2 → bị động trần):",
        instruction_en:
          "Rewrite ACTIVE → PASSIVE in the right form (3rd person → `di-`; 1st/2nd → bare passive):",
        items: [
          { prompt: "Dia membaca buku itu.", answer: "Buku itu dibaca (oleh) dia." },
          { prompt: "Saya menulis surat ini.", answer: "Surat ini saya tulis." },
          { prompt: "Kamu mengirim paket itu.", answer: "Paket itu kamu kirim." },
          { prompt: "Mereka memperbaiki jalan ini.", answer: "Jalan ini diperbaiki (oleh) mereka." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Chọn tiền tố đúng — `meN-`, `di-`, `ter-`, hay `ke-…-an`:",
        instruction_en:
          "Choose the right affix — `meN-`, `di-`, `ter-`, or `ke-…-an`:",
        items: [
          { prompt: "Setiap pagi saya ___baca koran. (chủ động: đọc)", answer: "mem", hint: "chủ ngữ làm = `meN-` → membaca" },
          { prompt: "Surat itu ___kirim oleh dia kemarin. (bị động ngôi 3)", answer: "di", hint: "người làm ngôi 3 = `di-` → dikirim" },
          { prompt: "Maaf, pesannya ___kirim dua kali. (lỡ tay)", answer: "ter", hint: "ngoài ý muốn = `ter-` → terkirim" },
          { prompt: "Kami ___hujan___ di jalan. (bị dính mưa)", answer: "ke / an", hint: "lãnh đủ = `ke-…-an` → kehujanan" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "BẪY người Việt: `di-` (bị động cố ý) hay `ter-` (vô ý)? Chọn theo Ý ĐỒ:",
        instruction_en:
          "VN-speaker TRAP: `di-` (intentional passive) or `ter-` (accidental)? Choose by INTENT:",
        items: [
          { prompt: "Pintu itu ___buka oleh satpam tiap pagi. (có người mở)", answer: "di", hint: "cố ý, có người làm = dibuka" },
          { prompt: "Gelasnya ___pecah waktu gempa. (tự vỡ)", answer: "ter", hint: "ngoài ý muốn = terpecah" },
          { prompt: "HP saya ___tinggal di taksi. (bỏ quên)", answer: "ter", hint: "lỡ quên = tertinggal" },
          { prompt: "Hadiah ini ___beri oleh teman saya. (được tặng)", answer: "di", hint: "có chủ thể tặng = diberi" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Sửa lỗi: câu nào dùng `di-` với ngôi 1/2 là SAI — viết lại đúng (bị động trần):",
        instruction_en:
          "Fix the error: any `di-` with 1st/2nd person is WRONG — rewrite correctly (bare passive):",
        items: [
          { prompt: "Buku itu dibaca saya. → ___", answer: "Buku itu saya baca.", hint: "ngôi 1 KHÔNG `di-`" },
          { prompt: "Tugas ini akan diselesaikan kamu. → ___", answer: "Tugas ini akan kamu selesaikan.", hint: "trợ từ `akan` trước đại từ" },
          { prompt: "Surat ini dikirim kita besok. → ___", answer: "Surat ini kita kirim besok.", hint: "ngôi 1 số nhiều: `kita kirim`" },
        ],
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra — bạn làm được chưa?",
        instruction_en: "Quick self-check — can you do each one?",
        items: [
          { vi: "Tôi tạo được động từ chủ động `meN-` (membaca, menulis, mengirim).", en: "I can build `meN-` active verbs (membaca, menulis, mengirim)." },
          { vi: "Tôi dùng `di-` + `oleh` cho người làm ngôi 3.", en: "I can use `di-` + `oleh` for a 3rd-person agent." },
          { vi: "Tôi dùng bị động TRẦN cho ngôi 1/2 và KHÔNG nói `disaya`.", en: "I use the BARE passive for 1st/2nd person and never say `disaya`." },
          { vi: "Tôi chọn `ter-` cho việc vô ý/trạng thái (terkirim, terbuka).", en: "I choose `ter-` for accidental/stative (terkirim, terbuka)." },
          { vi: "Tôi dùng `ke-…-an` cho kiểu 'lãnh đủ' (kehujanan, ketiduran).", en: "I use `ke-…-an` for the adversative (kehujanan, ketiduran)." },
          { vi: "Tôi KHÔNG dịch `bị`/`được` thành một từ rời — tôi đổi tiền tố.", en: "I do NOT translate `bị`/`được` as a loose word — I change the prefix." },
        ],
      },
    ],
  },
];

export default lessons;
