// Advanced Concession and Compromise Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// register notes with English companions in pronunciation_focus_en.
//
// Topic: compromise (`kompromi`), middle ground (`jalan tengah`), giving in a
// little (`mengalah sedikit`), reaching mutual agreement (`kesepakatan bersama`),
// adding conditions (`syarat tambahan`), polite negotiation, and protecting the
// relationship while solving disagreement. For Vietnamese speakers, the wins are
// familiar: Vietnamese also has soft compromise language like `mình nhường một
// chút`, `chốt phương án giữa`, or `miễn là...`. The traps: sounding too rigid,
// using direct refusal too early, and forgetting to mark the shared goal first.

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
    id: "indonesian_advanced_concession_compromise",
    level: "B2",
    category: "communication",
    title_vi: "Nhượng bộ và thỏa hiệp nâng cao",
    title_en: "Advanced concession and compromise",
    sentences: [
      {
        en: "Saya setuju dengan tujuannya, tapi kita perlu cari jalan tengah.",
        vi: "Tôi đồng ý với mục tiêu, nhưng chúng ta cần tìm cách dung hòa.",
        pronunciation_focus: [
          "SA-ya se-TU-ju de-NGAN tu-JU-an-nya, TA-pi KI-ta per-LU CA-ri JA-lan TEN-GAH — `tujuan` = mục tiêu; `jalan tengah` = phương án dung hòa.",
          "Mẹo: bắt đầu bằng `saya setuju` rồi mới thêm `tapi` giúp câu không bị quá đối đầu.",
          "Lỗi người Việt: vào thẳng phủ định. Trong diskusi, công nhận mục tiêu trước thường mềm hơn nhiều.",
        ],
        pronunciation_focus_en: [
          "SAH-yah seh-TOO-joo deh-NGAN too-JOO-an-nyah, TAH-pee KEE-tah per-LOO CHA-ree JAH-lan TEHN-gah — `tujuan` = goal; `jalan tengah` = middle ground.",
          "Tip: starting with `saya setuju` before `tapi` keeps the sentence from sounding confrontational.",
          "VN-speaker trap: going straight into negation. In discussion, acknowledging the goal first is usually much softer.",
        ],
      },
      {
        en: "Kalau bisa, saya mau mengalah sedikit supaya semua pihak nyaman.",
        vi: "Nếu được, tôi muốn nhường một chút để mọi bên đều thoải mái.",
        pronunciation_focus: [
          "KA-lau BI-sa, SA-ya mau me-ngA-lah se-DI-kit su-PA-ya se-MU-a PI-hak NYA-man — `mengalah sedikit` = nhường một chút; `semua pihak` = mọi bên.",
          "Mẹo: `supaya` + lợi ích chung làm câu nghe hợp tác hơn, không phải thua cuộc.",
          "Lỗi người Việt: sợ `mengalah` là yếu. Trong konteks kerja, đó là chiến lược giữ quan hệ.",
        ],
        pronunciation_focus_en: [
          "KAH-low BEE-sah, SAH-yah mow meh-NGAH-lah seh-DEE-kit soo-PAH-yah seh-MOO-ah PEE-hak NYAH-man — `mengalah sedikit` = give in a little; `semua pihak` = all parties.",
          "Tip: `supaya` plus a shared benefit makes the sentence sound cooperative, not like losing.",
          "VN-speaker trap: fearing `mengalah` means being weak. In work contexts, it can be a relationship-saving strategy.",
        ],
      },
      {
        en: "Mungkin ada syarat tambahan, tapi itu masih bisa dibicarakan.",
        vi: "Có lẽ có thêm điều kiện, nhưng chuyện đó vẫn có thể bàn tiếp.",
        pronunciation_focus: [
          "MUNG-kin A-da sya-RAT tam-BA-han, TA-pi i-TU MA-sih BI-sa di-bi-CA-ra-kan — `syarat tambahan` = điều kiện thêm; `dibicarakan` = được bàn bạc.",
          "Mẹo: `masih bisa dibicarakan` giữ cánh cửa mở. Đây là cách mềm để không nói `tidak` quá sớm.",
          "Lỗi người Việt: chốt hẳn `boleh/tidak` quá nhanh. Thêm `masih bisa dibicarakan` sẽ hợp ngoại giao hơn.",
        ],
        pronunciation_focus_en: [
          "MOONG-kin AH-dah syah-RAT tahm-BAH-han, TAH-pee ee-TOH MAH-seeh BEE-sah dee-bee-CHA-rah-kahn — `syarat tambahan` = additional conditions; `dibicarakan` = discussed.",
          "Tip: `masih bisa dibicarakan` keeps the door open. It is a softer way to avoid saying `no` too early.",
          "VN-speaker trap: deciding too quickly with `boleh/tidak`. Adding `masih bisa dibicarakan` is more diplomatic.",
        ],
      },
      {
        en: "Saya menghargai usul Anda, hanya saja perlu disesuaikan sedikit.",
        vi: "Tôi trân trọng đề xuất của anh/chị, chỉ là cần chỉnh lại một chút.",
        pronunciation_focus: [
          "SA-ya meng-har-GAI U-sul AN-da, HA-nya SA-ja per-LU di-se-su-a-I-kan se-DI-kit — `menghargai usul` = trân trọng đề xuất; `disesuaikan` = được điều chỉnh cho phù hợp.",
          "Mẹo: công nhận đề xuất trước rồi mới chỉnh sửa giúp người nghe không thấy bị bác bỏ.",
          "Lỗi người Việt: sửa ý người khác quá trực diện. `Hanya saja...` là chiếc đệm rất hữu ích.",
        ],
        pronunciation_focus_en: [
          "SAH-yah me-nghar-GAI OO-sool AHN-dah, HAH-nyah SAH-jah per-LOO dee-seh-soo-ah-EE-kahn seh-DEE-kit — `menghargai usul` = appreciate the suggestion; `disesuaikan` = adjusted to fit.",
          "Tip: acknowledge the suggestion first, then adjust it, so the listener does not feel rejected.",
          "VN-speaker trap: correcting other people's ideas too directly. `Hanya saja...` is a very useful cushion.",
        ],
      },
      {
        en: "Kalau menurut saya, kita bisa ambil opsi yang di tengah-tengah.",
        vi: "Theo tôi thì chúng ta có thể chọn phương án ở giữa.",
        pronunciation_focus: [
          "KA-lau me-NU-rut SA-ya, KI-ta BI-sa AM-bil OP-si yang di TEN-GAH-ten-GAH — `menurut saya` = theo tôi; `tengah-tengah` = ở giữa.",
          "Mẹo: `ambil opsi` terasa aktif, sementara `yang di tengah-tengah` memberi cảm giác cân bằng.",
          "Lỗi người Việt: chỉ nói `kita kompromi` mà không nói rõ hình dạng kompromi. `Opsi yang di tengah-tengah` lebih cụ thể.",
        ],
        pronunciation_focus_en: [
          "KAH-low meh-NOO-root SAH-yah, KEE-tah BEE-sah AM-beel OP-see yang dee TEHN-gah-TEHN-gah — `menurut saya` = in my opinion; `tengah-tengah` = middle / in between.",
          "Tip: `ambil opsi` sounds active, while `yang di tengah-tengah` makes the compromise feel balanced.",
          "VN-speaker trap: saying only `kita kompromi` without describing the shape of the compromise. `Opsi yang di tengah-tengah` is more concrete.",
        ],
      },
      {
        en: "Saya tidak menolak, saya hanya ingin memastikan detailnya jelas.",
        vi: "Tôi không từ chối, tôi chỉ muốn chắc chắn chi tiết cho rõ ràng.",
        pronunciation_focus: [
          "SA-ya ti-DAK me-no-LAK, SA-ya HA-nya I-ngin mem-as-TI-kan de-TAIL-nya JE-las — `memastikan` = đảm bảo/chắc chắn; `detailnya jelas` = chi tiết rõ ràng.",
          "Mẹo: `saya tidak menolak` là khung cực tốt để giảm cảm giác bị từ chối.",
          "Lỗi người Việt: để người khác nghe thành `saya menolak`. Chỉ thêm `tidak` thôi đã đổi sắc thái rất lớn.",
        ],
        pronunciation_focus_en: [
          "SAH-yah tee-DAK meh-noh-LAHK, SAH-yah HAH-nyah EEN-geen mem-AHS-tee-kahn deh-TAIL-nyah JEH-las — `memastikan` = ensure; `detailnya jelas` = the details are clear.",
          "Tip: `saya tidak menolak` is an excellent frame for reducing the feeling of rejection.",
          "VN-speaker trap: letting the listener hear only `saya menolak`. Adding just `tidak` changes the tone a lot.",
        ],
      },
      {
        en: "Jika perlu, kita bisa tambah satu syarat kecil saja.",
        vi: "Nếu cần, chúng ta có thể chỉ thêm một điều kiện nhỏ thôi.",
        pronunciation_focus: [
          "JI-ka per-LU, KI-ta BI-sa tam-BAH sa-TU sya-RAT KE-cil SA-ja — `syarat kecil` = điều kiện nhỏ; `saja` = thôi/chỉ.",
          "Mẹo: `saja` ở cuối sering membuat syarat terdengar tidak terlalu berat.",
          "Lỗi người Việt: thêm quá nhiều syarat sekaligus. Satu syarat kecil dulu biasanya lebih mudah diterima.",
        ],
        pronunciation_focus_en: [
          "JEE-kah per-LOO, KEE-tah BEE-sah tahm-BAH sah-TOO shyah-RAT KEH-chil SAH-jah — `syarat kecil` = small condition; `saja` = just/only.",
          "Tip: `saja` at the end often makes a condition sound less heavy.",
          "VN-speaker trap: adding too many conditions at once. One small condition is usually easier to accept.",
        ],
      },
      {
        en: "Saya bersedia kompromi, asalkan hubungan kita tetap baik.",
        vi: "Tôi sẵn sàng thỏa hiệp, miễn là quan hệ của chúng ta vẫn tốt.",
        pronunciation_focus: [
          "SA-ya ber-se-DI-a kom-PRO-mi, a-sal-KAN hu-BUNG-an KI-ta te-TAP BAIK — `bersedia` = sẵn sàng; `asalkan` = miễn là.",
          "Mẹo: `asalkan` sangat penting untuk kompromi vì menunjukkan batas yang masih bisa diterima.",
          "Lỗi người Việt: nhượng bộ mà không nói điều kiện. `Asalkan` giúp bạn mềm nhưng vẫn có ranh giới.",
        ],
        pronunciation_focus_en: [
          "SAH-yah ber-seh-DEE-ah kom-PROH-mee, ah-SAHL-kahn hoo-BOONG-an KEE-tah teh-TAP BAIK — `bersedia` = willing; `asalkan` = as long as.",
          "Tip: `asalkan` is very important in compromise because it shows a boundary that is still acceptable.",
          "VN-speaker trap: giving in without stating any condition. `Asalkan` lets you stay soft while keeping a boundary.",
        ],
      },
      {
        en: "Baik, kita ambil jalan tengah supaya semua pihak merasa dihormati.",
        vi: "Được, chúng ta chọn cách dung hòa để mọi bên đều cảm thấy được tôn trọng.",
        pronunciation_focus: [
          "BA-ik, KI-ta AM-bil JA-lan TEN-GAH su-PA-ya se-MU-a PI-hak me-ra-SA di-hor-MA-ti — `merasa dihormati` = cảm thấy được tôn trọng.",
          "Mẹo: tutup kompromi bằng rasa hormat, bukan kemenangan satu pihak.",
          "Lỗi người Việt: menyelesaikan negosiasi dengan nada menang-kalah. `Dihormati` menjaga hubungan tetap aman.",
        ],
        pronunciation_focus_en: [
          "BAH-eek, KEE-tah AM-beel JAH-lan TEHN-gah soo-PAH-yah seh-MOO-ah PEE-hak meh-RAH-sah dee-hor-MAH-tee — `merasa dihormati` = feel respected.",
          "Tip: end compromise with respect, not with one side's victory.",
          "VN-speaker trap: finishing negotiation with a win-lose tone. `Dihormati` keeps the relationship safe.",
        ],
      },
      {
        en: "Kalau kita sepakat, saya akan lanjutkan ke langkah berikutnya.",
        vi: "Nếu chúng ta đồng ý, tôi sẽ tiếp tục sang bước tiếp theo.",
        pronunciation_focus: [
          "KA-lau KI-ta se-PA-kat, SA-ya A-kan lan-JUT-kan ke LANG-kah be-ri-KUT-nya — `sepakat` = đồng ý; `langkah berikutnya` = bước tiếp theo.",
          "Mẹo: `lanjutkan` memberi cảm giác tiến triển. Rất hữu ích sau khi đạt kompromi.",
          "Lỗi người Việt: dừng câu quá sớm. Sau kompromi, thường cần nói rõ bước tiếp theo.",
        ],
        pronunciation_focus_en: [
          "KAH-low KEE-tah seh-PAH-kat, SAH-yah AH-kahn lahn-JOOT-kahn keh LAHNG-kah beh-ree-KOOT-nyah — `sepakat` = agree; `langkah berikutnya` = next step.",
          "Tip: `lanjutkan` gives a sense of progress. Very useful after reaching compromise.",
          "VN-speaker trap: ending the sentence too early. After compromise, you often need to state the next step.",
        ],
      },
      {
        en: "Terima kasih sudah mau mencari solusi bersama.",
        vi: "Cảm ơn vì đã cùng tìm giải pháp.",
        pronunciation_focus: [
          "te-ri-MA KA-sih SU-dah mau men-ca-RI so-LU-si ber-SA-ma — `mencari solusi bersama` = cùng tìm giải pháp.",
          "Mẹo: ucapan terima kasih di akhir membuat kompromi terasa seperti kerja tim, bukan kalah-menang.",
          "Lỗi người Việt: kết thúc terlalu kaku setelah đạt đồng ý. `Terima kasih` menjaga hubungan tetap hangat.",
        ],
        pronunciation_focus_en: [
          "teh-ree-MAH KAH-seeh SOO-dah mow men-CHA-ree soh-LOO-see ber-SAH-mah — `mencari solusi bersama` = finding a solution together.",
          "Tip: thanking people at the end makes the compromise feel like teamwork, not win-lose.",
          "VN-speaker trap: ending too stiffly after agreement. `Terima kasih` keeps the relationship warm.",
        ],
      },
    ],
    cultural_notes_vi:
      "Dalam banyak situasi Indonesia, kompromi yang baik biasanya diucapkan dengan bahasa yang menjaga rasa hormat. Orang sering memakai pola `saya setuju, tapi...`, `mungkin ada jalan tengah`, atau `asalkan...`. Ini sangat umum di kantor, keluarga, dan negosiasi kecil sehari-hari. Yang penting adalah hasilnya terasa `musyawarah`-like: semua pihak merasa didengar, tidak dipaksa, dan hubungan tetap baik. Jika bicara terlalu lurus, pesan bisa benar tetapi suasananya rusak; jika terlalu berputar, pesan bisa kabur. Kompromi yang bagus menjaga dua-duanya.",
    cultural_notes_en:
      "In many Indonesian situations, a good compromise is usually expressed in language that preserves respect. People often use patterns like `saya setuju, tapi...`, `mungkin ada jalan tengah`, or `asalkan...`. This is very common at work, in families, and in everyday negotiation. The result should feel `musyawarah`-like: all sides feel heard, nobody feels forced, and the relationship stays good. If you speak too directly, the message may be correct but the mood gets damaged; if you are too roundabout, the message may become unclear. Good compromise keeps both in balance.",
    tip_advice_vi:
      "Mẹo cho người Việt: khi muốn thỏa hiệp, đừng chỉ nói `iya` hoặc `tidak`. Hãy dùng chuỗi: công nhận (`saya setuju` / `saya paham`), mở cửa (`tapi`, `namun`, `hanya saja`), đưa phương án (`jalan tengah`, `opsi yang di tengah-tengah`), rồi nếu cần thêm điều kiện hãy dùng `asalkan`. Cách này vừa mềm vừa rõ, rất hợp để giữ quan hệ.",
    tip_advice_en:
      "Tip for Vietnamese speakers: when compromising, do not only say `yes` or `no`. Use a sequence: acknowledge (`saya setuju` / `saya paham`), open the shift (`tapi`, `namun`, `hanya saja`), offer a solution (`jalan tengah`, `opsi yang di tengah-tengah`), and if needed add a condition with `asalkan`. This keeps the tone soft and clear, which is ideal for preserving relationships.",
    vocabulary: [
      {
        word: "kompromi",
        en: "compromise",
        vi: "thỏa hiệp",
        pos: "noun / verb",
        pronunciation_vi: "kom-PRO-mi",
        pronunciation_en: "kom-PROH-mee",
      },
      {
        word: "jalan tengah",
        en: "middle ground",
        vi: "phương án dung hòa",
        pos: "noun phrase",
        pronunciation_vi: "JA-lan TEN-gah",
        pronunciation_en: "JAH-lan TEHN-gah",
      },
      {
        word: "mengalah sedikit",
        en: "to give in a little",
        vi: "nhường một chút",
        pos: "verb phrase",
        pronunciation_vi: "me-ngA-lah se-DI-kit",
        pronunciation_en: "meh-NGAH-lah seh-DEE-kit",
      },
      {
        word: "kesepakatan bersama",
        en: "mutual agreement",
        vi: "sự đồng thuận chung",
        pos: "noun phrase",
        pronunciation_vi: "ke-se-pa-KA-tan ber-SA-ma",
        pronunciation_en: "keh-seh-pah-KAH-tahn ber-SAH-mah",
      },
      {
        word: "syarat tambahan",
        en: "additional condition",
        vi: "điều kiện thêm",
        pos: "noun phrase",
        pronunciation_vi: "sya-RAT tam-BA-han",
        pronunciation_en: "shyah-RAT tahm-BAH-han",
      },
      {
        word: "asalkan",
        en: "as long as",
        vi: "miễn là",
        pos: "conjunction",
        pronunciation_vi: "a-SAL-kan",
        pronunciation_en: "ah-SAHL-kahn",
      },
      {
        word: "menghormati",
        en: "to respect",
        vi: "tôn trọng",
        pos: "verb",
        pronunciation_vi: "meng-hor-MA-ti",
        pronunciation_en: "me-nghor-MAH-tee",
      },
      {
        word: "dibicarakan",
        en: "to be discussed",
        vi: "được bàn bạc",
        pos: "verb (passive)",
        pronunciation_vi: "di-bi-CA-ra-kan",
        pronunciation_en: "dee-bee-CHA-rah-kahn",
      },
    ],
    dialogue: [
      {
        speaker: "Mira",
        text: "Saya setuju dengan tujuannya, tapi kita perlu cari jalan tengah.",
        vi: "Tôi đồng ý với mục tiêu, nhưng chúng ta cần tìm cách dung hòa.",
        en: "I agree with the goal, but we need to find a middle ground.",
      },
      {
        speaker: "Rafi",
        text: "Kalau bisa, saya mau mengalah sedikit supaya semua pihak nyaman.",
        vi: "Nếu được, tôi muốn nhường một chút để mọi bên đều thoải mái.",
        en: "If possible, I want to give in a little so everyone feels comfortable.",
      },
      {
        speaker: "Mira",
        text: "Baik, mungkin ada syarat tambahan yang masih bisa dibicarakan.",
        vi: "Được, có lẽ vẫn còn thêm điều kiện có thể bàn tiếp.",
        en: "All right, maybe there are additional conditions we can still discuss.",
      },
      {
        speaker: "Rafi",
        text: "Saya menghargai usul Anda, hanya saja perlu disesuaikan sedikit.",
        vi: "Tôi trân trọng đề xuất của anh/chị, chỉ là cần chỉnh lại một chút.",
        en: "I appreciate your suggestion, only it needs a little adjustment.",
      },
      {
        speaker: "Mira",
        text: "Setuju. Yang penting, kita cari solusi bersama.",
        vi: "Đồng ý. Quan trọng là chúng ta cùng tìm giải pháp.",
        en: "Agreed. The important thing is that we find a solution together.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi đồng ý với mục tiêu, nhưng chúng ta cần tìm cách dung hòa.", answer: "Saya setuju dengan tujuannya, tapi kita perlu cari jalan tengah." },
          { prompt: "Nếu được, tôi muốn nhường một chút để mọi bên đều thoải mái.", answer: "Kalau bisa, saya mau mengalah sedikit supaya semua pihak nyaman." },
          { prompt: "Có lẽ có cách khác hiệu quả hơn.", answer: "Mungkin ada cara lain yang lebih efektif." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu để câu nghe thỏa hiệp hơn:",
        instruction_en: "Fill in the missing word to make the sentence more compromising:",
        items: [
          {
            prompt: "Saya setuju dengan tujuannya, ____ kita perlu cari jalan tengah.",
            answer: "tapi",
            options: ["tapi", "dan", "karena"],
          },
          {
            prompt: "Saya mau mengalah ____ supaya semua pihak nyaman.",
            answer: "sedikit",
            options: ["sedikit", "sekali", "saja"],
          },
          {
            prompt: "Kalau perlu, kita bisa tambah satu ____ kecil saja.",
            answer: "syarat",
            options: ["syarat", "sorot", "sikat"],
          },
        ],
      },
      {
        type: "ordering",
        instruction_vi: "Sắp xếp thành câu đúng:",
        instruction_en: "Put the words in the correct order:",
        items: [
          {
            words: ["Saya", "menghargai", "usul", "Anda", "hanya", "saja", "perlu", "disesuaikan", "sedikit"],
            answer: "Saya menghargai usul Anda, hanya saja perlu disesuaikan sedikit.",
          },
          {
            words: ["Jika", "perlu", "kita", "bisa", "tambah", "satu", "syarat", "kecil", "saja"],
            answer: "Jika perlu kita bisa tambah satu syarat kecil saja.",
          },
          {
            words: ["Baik", "kita", "ambil", "jalan", "tengah", "supaya", "semua", "pihak", "merasa", "dihormati"],
            answer: "Baik kita ambil jalan tengah supaya semua pihak merasa dihormati.",
          },
        ],
      },
    ],
  },
];
