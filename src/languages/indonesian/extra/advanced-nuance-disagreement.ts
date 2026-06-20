// Advanced Nuance in Disagreement Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// register/disagreement notes with English companions in pronunciation_focus_en.
//
// Topic: agreeing partially (`saya paham, namun`), soft disagreement
// (`kurang sependapat`), suggesting alternatives (`mungkin ada cara lain`),
// respecting the other side's view, and handling professional discussion without
// sounding too blunt. For Vietnamese speakers, the wins are familiar: you already
// soften disagreement in Vietnamese with `em hiểu, nhưng...`, `theo em thì...`,
// or `có lẽ có cách khác`. The traps: sounding too direct, overusing `tidak setuju`,
// and forgetting to acknowledge the other person's point first.

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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_advanced_nuance_disagreement",
    level: "B2",
    category: "communication",
    title_vi: "Sắc thái bất đồng tinh tế",
    title_en: "Advanced nuance in disagreement",
    sentences: [
      {
        en: "Saya paham, namun ada beberapa hal yang perlu dipertimbangkan lagi.",
        vi: "Tôi hiểu, tuy nhiên có vài điều cần được cân nhắc lại.",
        pronunciation_focus: [
          "SA-ya pa-HAM, NA-mun A-da be-be-RA-pa HAL yang per-LU di-per-tim-BANG-kan LA-gi — `saya paham` = tôi hiểu; `namun` = tuy nhiên.",
          "Mẹo: mở bằng `saya paham` rồi mới chuyển ý bằng `namun` để người nghe không cảm thấy bị phủ đầu.",
          "Lỗi người Việt: vào thẳng `tapi...` ngay từ đầu. Thêm một câu công nhận trước sẽ mềm hơn nhiều.",
        ],
        pronunciation_focus_en: [
          "SAH-yah pah-HAHM, NAH-moon AH-dah beh-beh-RAH-pah HAHL yang per-LOO dee-per-teem-BANG-kahn LAH-gee — `saya paham` = I understand; `namun` = however.",
          "Tip: open with `saya paham` and then shift with `namun` so the listener does not feel immediately pushed back.",
          "VN-speaker trap: jumping straight to `tapi...`. Adding an acknowledgement first sounds much softer.",
        ],
      },
      {
        en: "Kalau boleh jujur, saya kurang sependapat dengan bagian itu.",
        vi: "Nếu được nói thật, tôi không hoàn toàn đồng tình với phần đó.",
        pronunciation_focus: [
          "KA-lau BO-leh JU-jur, SA-ya KU-rang se-pen-DA-pat de-NGAN ba-GI-an I-tu — `jujur` = thật lòng; `kurang sependapat` = không hẳn cùng ý.",
          "Mẹo: `kurang sependapat` lebih halus daripada `tidak setuju`. Ini cocok untuk rapat atau diskusi profesional.",
          "Lỗi người Việt: dùng `tidak setuju` terlalu cepat. Jika ingin tetap sopan, pakai `kurang sependapat`.",
        ],
        pronunciation_focus_en: [
          "KAH-low BOH-leh JOO-joor, SAH-yah KOO-rang seh-pen-DAH-pat deh-NGAN bah-GEE-an EE-too — `jujur` = honestly; `kurang sependapat` = not fully in agreement.",
          "Tip: `kurang sependapat` is softer than `tidak setuju`. It fits meetings and professional discussion well.",
          "VN-speaker trap: using `tidak setuju` too quickly. If you want to stay polite, use `kurang sependapat`.",
        ],
      },
      {
        en: "Mungkin ada cara lain yang lebih efektif.",
        vi: "Có lẽ có cách khác hiệu quả hơn.",
        pronunciation_focus: [
          "MUNG-kin A-da CA-ra LA-in yang LE-bih e-fek-TIF — `mungkin` = có lẽ; `cara lain` = cách khác; `efektif` = hiệu quả.",
          "Mẹo: `mungkin` làm câu nghe mở hơn. Với saran, nó thường mềm hơn `harus` atau `sebaiknya` yang terlalu tegas.",
          "Lỗi người Việt: nói `ada jalan lain` theo thói quen, nhưng trong konteks profesional `cara lain` lebih natural.",
        ],
        pronunciation_focus_en: [
          "MOONG-kin AH-dah CHA-rah LAH-een yang LEH-bee eh-fek-TEEF — `mungkin` = maybe; `cara lain` = another way; `efektif` = effective.",
          "Tip: `mungkin` makes the sentence more open. For suggestions, it is often softer than `harus` or overly firm `sebaiknya`.",
          "VN-speaker trap: using `ada jalan lain` by habit. In professional contexts, `cara lain` is more natural.",
        ],
      },
      {
        en: "Saya menghargai pendapat Anda, hanya saja saya melihatnya dari sisi yang berbeda.",
        vi: "Tôi trân trọng ý kiến của anh/chị, chỉ là tôi nhìn nó từ góc độ khác.",
        pronunciation_focus: [
          "SA-ya meng-har-GAI pen-DA-pat AN-da, HA-nya SA-ja SA-ya me-li-HAT-nya da-ri SI-si yang ber-be-DA — `menghargai` = trân trọng; `dari sisi yang berbeda` = từ góc độ khác.",
          "Mẹo: công nhận trước (`menghargai pendapat Anda`) giúp người nghe không cảm thấy bị bác bỏ toàn bộ.",
          "Lỗi người Việt: chỉ nói phần khác biệt mà quên công nhận. Trong diskusi profesional, công nhận là kunci.",
        ],
        pronunciation_focus_en: [
          "SAH-yah me-nghar-GAI pen-DAH-pat AHN-dah, HAH-nyah SAH-jah SAH-yah meh-lee-HAHT-nyah dah-ree SEE-see yang ber-beh-DAH — `menghargai` = appreciate; `dari sisi yang berbeda` = from a different angle.",
          "Tip: acknowledging first (`menghargai pendapat Anda`) keeps the listener from feeling rejected.",
          "VN-speaker trap: stating only the difference and forgetting the acknowledgement. In professional discussion, acknowledgement is key.",
        ],
      },
      {
        en: "Bukan berarti saya menolak, tetapi saya ingin memperjelas risikonya dulu.",
        vi: "Không phải là tôi từ chối, nhưng tôi muốn làm rõ rủi ro trước đã.",
        pronunciation_focus: [
          "BU-kan ber-AR-ti SA-ya me-no-LAK, te-TA-pi SA-ya I-ngin mem-per-je-LAS ri-SI-ko-nya DU-lu — `bukan berarti` = không có nghĩa là; `memperjelas` = làm rõ hơn.",
          "Mẹo: `bukan berarti` sangat berguna saat Anda ingin menolak halus tanpa menutup pintu diskusi.",
          "Lỗi người Việt: menolak bằng kalimat pendek saja. Tambahkan `bukan berarti` supaya maksudnya tidak terdengar keras.",
        ],
        pronunciation_focus_en: [
          "BOO-kahn ber-AHR-tee SAH-yah meh-no-LAK, teh-TAH-pee SAH-yah EE-ngin mem-per-jeh-LAHS ree-SEE-koh-nyah DOO-loo — `bukan berarti` = that does not mean; `memperjelas` = clarify.",
          "Tip: `bukan berarti` is useful when you want to refuse gently without closing the discussion.",
          "VN-speaker trap: refusing with a short sentence only. Add `bukan berarti` so it does not sound harsh.",
        ],
      },
      {
        en: "Kalau saya boleh menyanggah sedikit, angka itu mungkin perlu dicek ulang.",
        vi: "Nếu tôi được phép phản biện nhẹ một chút, con số đó có lẽ cần kiểm tra lại.",
        pronunciation_focus: [
          "KA-lau SA-ya BO-leh me-nyang-GAH se-DI-kit, ANG-ka i-tu MUNG-kin per-LU di-cek u-LANG — `menyanggah` = phản biện/cãi lại; `dicek ulang` = kiểm tra lại.",
          "Mẹo: `menyanggah sedikit` lebih halus daripada `membantah`. Ini cocok saat Anda ingin berbeda pendapat tanpa menekan.",
          "Lỗi người Việt: dùng `bantah` quá keras trong rapat. `Menyanggah` terdengar lebih profesional.",
        ],
        pronunciation_focus_en: [
          "KAH-low SAH-yah BOH-leh me-nyang-GAH seh-DEE-kit, AHNG-kah ee-too MOONG-kin per-LOO dee-chek oo-LAHNG — `menyanggah` = to object lightly/challenge; `dicek ulang` = checked again.",
          "Tip: `menyanggah sedikit` is softer than `membantah`. It fits when you want to disagree without pressure.",
          "VN-speaker trap: using `bantah` too strongly in meetings. `Menyanggah` sounds more professional.",
        ],
      },
      {
        en: "Saya setuju dengan tujuannya, tapi mungkin urutannya perlu diubah.",
        vi: "Tôi đồng ý với mục tiêu, nhưng có lẽ thứ tự cần được thay đổi.",
        pronunciation_focus: [
          "SA-ya se-TU-ju de-NGAN tu-JU-an-nya, TA-pi MUNG-kin u-RUT-an-nya per-LU di-U-bah — `tujuan` = mục tiêu; `urutan` = thứ tự.",
          "Mẹo: setuju pada tujuan, beda pada cara. Ini pola klasik yang sangat aman dalam diskusi.",
          "Lỗi người Việt: menolak semua isi sekaligus. Coba pisahkan `tujuan` dari `urutan` atau `cara`.",
        ],
        pronunciation_focus_en: [
          "SAH-yah seh-TOO-joo deh-NGAN too-JOO-an-nyah, TAH-pee MOONG-kin oo-ROO-tan-nyah per-LOO dee-OO-bah — `tujuan` = goal; `urutan` = sequence/order.",
          "Tip: agree with the goal, differ on the method. This is a classic and very safe discussion pattern.",
          "VN-speaker trap: rejecting everything at once. Try separating the `tujuan` from the `urutan` or `cara`.",
        ],
      },
      {
        en: "Diskusi kita akan lebih produktif kalau kita fokus pada solusi.",
        vi: "Cuộc thảo luận của chúng ta sẽ hiệu quả hơn nếu tập trung vào giải pháp.",
        pronunciation_focus: [
          "dis-KU-si KI-ta A-kan LE-bih pro-duK-TIF ka-lau KI-ta FO-kus pa-da so-LU-si — `produktif` = hiệu quả/năng suất; `solusi` = giải pháp.",
          "Mẹo: trong diskusi profesional, chuyển từ `siapa benar` ke `solusi` thường làm cuộc họp tiến nhanh hơn.",
          "Lỗi người Việt: tranh luận để thắng. Trong konteks kerja, biasanya tujuan utama adalah solusi, bukan menang.",
        ],
        pronunciation_focus_en: [
          "dis-KOO-see KEE-tah AH-kahn LEH-bee pro-dook-TEEF kah-low KEE-tah FOH-koos pah-dah soh-LOO-see — `produktif` = productive; `solusi` = solution.",
          "Tip: in professional discussion, shifting from `who is right` to `solution` usually moves the meeting faster.",
          "VN-speaker trap: debating to win. In work contexts, the main goal is usually the solution, not victory.",
        ],
      },
      {
        en: "Jika ada kekeliruan dalam pemahaman saya, silakan koreksi.",
        vi: "Nếu có sai sót trong cách hiểu của tôi, xin cứ sửa giúp.",
        pronunciation_focus: [
          "JI-ka A-da ke-ke-li-RU-an da-LAM pe-ma-HA-man SA-ya, si-la-KAN ko-REK-si — `kekeliruan` = sai sót; `koreksi` = sửa/điều chỉnh.",
          "Mẹo: mời người khác koreksi là cara sangat elegan untuk menjaga suasana baik.",
          "Lỗi người Việt: sợ mất mặt nên không mau menerima koreksi. Dalam diskusi profesional, minta koreksi justru tanda matang.",
        ],
        pronunciation_focus_en: [
          "JIH-kah AH-dah keh-keh-lee-ROO-an dah-LAHM peh-mah-HAH-man SAH-yah, see-lah-KAHN koh-REK-see — `kekeliruan` = mistake/error; `koreksi` = correction.",
          "Tip: inviting correction is an elegant way to keep the mood good.",
          "VN-speaker trap: avoiding correction to save face. In professional discussion, asking for correction is actually a sign of maturity.",
        ],
      },
      {
        en: "Saya tetap menghormati keputusan akhirnya, meski saya punya pandangan lain.",
        vi: "Tôi vẫn tôn trọng quyết định cuối cùng, dù tôi có quan điểm khác.",
        pronunciation_focus: [
          "SA-ya te-TAP meng-hor-MA-ti ke-pu-TUS-an a-khir-nya, MES-ki SA-ya PU-nya pan-DA-ngan LA-in — `menghormati` = tôn trọng; `pandangan` = quan điểm.",
          "Mẹo: tutup dengan penghormatan supaya perbedaan tidak merusak hubungan kerja.",
          "Lỗi người Việt: phản đối đến cùng rồi mới nhường. Dengan `tetap menghormati`, Anda menjaga hubungan profesional.",
        ],
        pronunciation_focus_en: [
          "SAH-yah teh-TAP me-nghor-MAH-tee keh-poo-TOOS-an ah-KHEER-nyah, MESS-kee SAH-yah POO-nyah pan-DAH-ngan LAH-een — `menghormati` = respect; `pandangan` = viewpoint.",
          "Tip: end with respect so the difference does not damage the working relationship.",
          "VN-speaker trap: pushing back all the way and only yielding at the end. `Tetap menghormati` protects the professional relationship.",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong diskusi Indonesia, đặc biệt là di kantor atau rapat, ketidaksetujuan yang baik biasanya tidak langsung dimulai dengan `tidak setuju`. Orang sering mulai dengan pengakuan: `saya paham`, `saya mengerti`, lalu baru masuk ke `namun`, `hanya saja`, atau `kurang sependapat`. Teknik ini menjaga `suasana` dan membuat lawan bicara tetap merasa dihargai. Dalam konteks profesional, tujuannya bukan memenangkan argumen, tetapi menemukan jalan yang lebih baik sambil tetap menjaga hubungan kerja.",
    cultural_notes_en:
      "In Indonesian discussion, especially in offices or meetings, good disagreement usually does not start directly with `tidak setuju`. People often begin with acknowledgement: `saya paham`, `saya mengerti`, and only then move into `namun`, `hanya saja`, or `kurang sependapat`. This keeps the `suasana` intact and makes the other person feel respected. In professional contexts, the goal is not to win the argument but to find a better path while preserving the working relationship.",
    tip_advice_vi:
      "Mẹo cho người Việt: dùng công thức 4 bước khi bất đồng. (1) công nhận: `Saya paham...`; (2) chuyển hướng mềm: `namun`, `hanya saja`, `kalau boleh jujur`; (3) đưa lựa chọn khác: `mungkin ada cara lain`; (4) chốt bằng tôn trọng: `saya menghargai pendapat Anda`. Nếu cần phản biện mạnh hơn, vẫn giữ từ ngữ nhẹ như `kurang sependapat` hoặc `menyanggah sedikit` thay vì `bantah` trực diện.",
    tip_advice_en:
      "Tip for Vietnamese speakers: use a 4-step frame when disagreeing. (1) acknowledge: `Saya paham...`; (2) soften the shift: `namun`, `hanya saja`, `kalau boleh jujur`; (3) offer an alternative: `mungkin ada cara lain`; (4) close with respect: `saya menghargai pendapat Anda`. If you need stronger disagreement, still keep the wording light with `kurang sependapat` or `menyanggah sedikit` rather than a direct `bantah`.",
    vocabulary: [
      {
        word: "saya paham",
        en: "I understand",
        vi: "tôi hiểu",
        pos: "phrase",
        pronunciation_vi: "SA-ya pa-HAM",
        pronunciation_en: "SAH-yah pah-HAHM",
      },
      {
        word: "namun",
        en: "however",
        vi: "tuy nhiên",
        pos: "conjunction",
        pronunciation_vi: "NA-mun",
        pronunciation_en: "NAH-moon",
      },
      {
        word: "kurang sependapat",
        en: "not fully agree",
        vi: "không hoàn toàn đồng tình",
        pos: "phrase",
        pronunciation_vi: "KU-rang se-pen-DA-pat",
        pronunciation_en: "KOO-rang seh-pen-DAH-pat",
      },
      {
        word: "menghargai pendapat",
        en: "to value an opinion",
        vi: "trân trọng ý kiến",
        pos: "verb phrase",
        pronunciation_vi: "meng-har-GAI pen-DA-pat",
        pronunciation_en: "me-nghar-GAI pen-DAH-pat",
      },
      {
        word: "mungkin ada cara lain",
        en: "maybe there is another way",
        vi: "có lẽ có cách khác",
        pos: "phrase",
        pronunciation_vi: "MUNG-kin A-da CA-ra LA-in",
        pronunciation_en: "MOONG-kin AH-dah CHA-rah LAH-een",
      },
      {
        word: "menyanggah",
        en: "to challenge / object lightly",
        vi: "phản biện nhẹ / cãi nhẹ",
        pos: "verb",
        pronunciation_vi: "me-nyang-GAH",
        pronunciation_en: "meh-nyang-GAH",
      },
      {
        word: "membantah",
        en: "to contradict / dispute",
        vi: "bác bỏ / phản bác",
        pos: "verb",
        pronunciation_vi: "mem-BAN-tah",
        pronunciation_en: "mem-BAN-tah",
      },
      {
        word: "diskusi profesional",
        en: "professional discussion",
        vi: "thảo luận chuyên nghiệp",
        pos: "noun phrase",
        pronunciation_vi: "dis-KU-si pro-fe-si-o-NAL",
        pronunciation_en: "dis-KOO-see pro-feh-shee-oh-NAL",
      },
    ],
    dialogue: [
      {
        speaker: "Sari",
        text: "Saya paham, namun ada beberapa hal yang perlu dipertimbangkan lagi.",
        vi: "Tôi hiểu, tuy nhiên có vài điều cần được cân nhắc lại.",
        en: "I understand, however there are several things that need to be considered again.",
      },
      {
        speaker: "Andi",
        text: "Saya juga menghargai pendapat Anda, hanya saja saya kurang sependapat.",
        vi: "Tôi cũng trân trọng ý kiến của anh/chị, chỉ là tôi không hoàn toàn đồng tình.",
        en: "I also appreciate your opinion, only I do not fully agree.",
      },
      {
        speaker: "Sari",
        text: "Baik, mungkin ada cara lain yang lebih aman.",
        vi: "Được, có lẽ có cách khác an toàn hơn.",
        en: "All right, maybe there is another way that is safer.",
      },
      {
        speaker: "Andi",
        text: "Kalau saya boleh menyanggah sedikit, risikonya perlu dicek ulang.",
        vi: "Nếu tôi được phép phản biện nhẹ một chút, rủi ro cần được kiểm tra lại.",
        en: "If I may object lightly, the risks need to be checked again.",
      },
      {
        speaker: "Sari",
        text: "Setuju. Yang penting, diskusi kita tetap profesional.",
        vi: "Đồng ý. Quan trọng là cuộc thảo luận của chúng ta vẫn chuyên nghiệp.",
        en: "Agreed. What matters is that our discussion remains professional.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi hiểu, tuy nhiên có vài điều cần được cân nhắc lại.", answer: "Saya paham, namun ada beberapa hal yang perlu dipertimbangkan lagi." },
          { prompt: "Tôi trân trọng ý kiến của anh/chị, chỉ là tôi nhìn nó từ góc độ khác.", answer: "Saya menghargai pendapat Anda, hanya saja saya melihatnya dari sisi yang berbeda." },
          { prompt: "Có lẽ có cách khác hiệu quả hơn.", answer: "Mungkin ada cara lain yang lebih efektif." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu để câu nghe mềm hơn:",
        instruction_en: "Fill in the missing word to make the sentence softer:",
        items: [
          {
            prompt: "Saya paham, ____ ada beberapa hal yang perlu dipertimbangkan lagi.",
            answer: "namun",
            options: ["namun", "dan", "karena"],
          },
          {
            prompt: "Kalau boleh jujur, saya ____ sependapat dengan bagian itu.",
            answer: "kurang",
            options: ["kurang", "sangat", "sudah"],
          },
          {
            prompt: "Mungkin ada ____ lain yang lebih efektif.",
            answer: "cara",
            options: ["cara", "kata", "rasa"],
          },
        ],
      },
      {
        type: "ordering",
        instruction_vi: "Sắp xếp thành câu đúng:",
        instruction_en: "Put the words in the correct order:",
        items: [
          {
            words: ["Saya", "menghargai", "pendapat", "Anda", "hanya", "saja", "saya", "melihatnya", "dari", "sisi", "yang", "berbeda"],
            answer: "Saya menghargai pendapat Anda, hanya saja saya melihatnya dari sisi yang berbeda.",
          },
          {
            words: ["Kalau", "saya", "boleh", "menyanggah", "sedikit", "risikonya", "perlu", "dicek", "ulang"],
            answer: "Kalau saya boleh menyanggah sedikit, risikonya perlu dicek ulang.",
          },
          {
            words: ["Yang", "penting", "diskusi", "kita", "tetap", "profesional"],
            answer: "Yang penting diskusi kita tetap profesional.",
          },
        ],
      },
    ],
  },
];
