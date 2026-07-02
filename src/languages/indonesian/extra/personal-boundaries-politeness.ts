// Personal Boundaries and Politeness Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file following the established Indonesian extra
// format. The `en` field holds TARGET-LANGUAGE Indonesian, `vi` holds the
// Vietnamese gloss, and pronunciation_focus carries Vietnamese L1 notes with
// English companion explanations in the same order.

type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar/culture notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

type IndonesianVocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type IndonesianDialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type IndonesianExercise = Record<string, unknown>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
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

export const personalBoundariesPolitenessLessons: IndonesianLesson[] = [
  {
    id: "indonesian_personal_boundaries_politeness",
    level: "B1",
    category: "social_life",
    title_vi: "Ranh giới cá nhân: từ chối lịch sự nhưng rõ ràng",
    title_en: "Personal boundaries: refusing politely but clearly",
    sentences: [
      {
        en: "Maaf, saya kurang nyaman membicarakan hal itu.",
        vi: "Xin lỗi, tôi không thoải mái lắm khi nói về chuyện đó.",
        pronunciation_focus: [
          "`kurang nyaman` = không thoải mái lắm; mềm hơn `tidak nyaman` nhưng vẫn rõ.",
          "`membicarakan hal itu` = nói/bàn về chuyện đó; trang trọng hơn `ngomongin itu`.",
          "Lỗi người Việt: im lặng để tránh mất lòng. Trong tiếng Indonesia, một câu mềm như `kurang nyaman` giúp giữ quan hệ mà vẫn đặt ranh giới.",
        ],
        pronunciation_focus_en: [
          "`kurang nyaman` means not quite comfortable; softer than `tidak nyaman` but still clear.",
          "`membicarakan hal itu` means discuss that matter; more formal than casual `ngomongin itu`.",
          "VN-speaker note: staying silent to avoid offense can be unclear. A soft phrase like `kurang nyaman` protects the relationship while setting a boundary.",
        ],
      },
      {
        en: "Terima kasih sudah mengajak, tapi saya tidak bisa ikut kali ini.",
        vi: "Cảm ơn đã rủ, nhưng lần này tôi không thể tham gia.",
        pronunciation_focus: [
          "`sudah mengajak` = đã mời/rủ; dùng để ghi nhận thiện ý trước khi từ chối.",
          "`tidak bisa ikut kali ini` = lần này không thể đi/tham gia; để mở khả năng lần khác.",
          "Lỗi người Việt: chỉ nói `tidak mau` nghe rất thẳng. Với lời mời, `tidak bisa ikut kali ini` lịch sự hơn.",
        ],
        pronunciation_focus_en: [
          "`sudah mengajak` means for inviting me; it acknowledges goodwill before refusing.",
          "`tidak bisa ikut kali ini` means cannot join this time; it leaves room for another time.",
          "VN-speaker trap: blunt `tidak mau` can sound harsh. For invitations, `tidak bisa ikut kali ini` is more polite.",
        ],
      },
      {
        en: "Saya perlu waktu sendiri malam ini.",
        vi: "Tối nay tôi cần thời gian riêng cho mình.",
        pronunciation_focus: [
          "`waktu sendiri` = thời gian một mình; nói tự nhiên khi cần nghỉ hoặc không muốn gặp ai.",
          "`perlu` = cần; nhẹ hơn một mệnh lệnh như `jangan ganggu saya`.",
          "Lỗi người Việt: giải thích quá nhiều. Câu ngắn `Saya perlu waktu sendiri` thường đủ lịch sự.",
        ],
        pronunciation_focus_en: [
          "`waktu sendiri` means time alone; natural when you need rest or do not want to meet.",
          "`perlu` means need; softer than an order like `jangan ganggu saya`.",
          "VN-speaker note: over-explaining is not necessary. The short sentence `Saya perlu waktu sendiri` is often polite enough.",
        ],
      },
      {
        en: "Boleh kita bahas topik lain saja?",
        vi: "Mình có thể nói sang chủ đề khác được không?",
        pronunciation_focus: [
          "`boleh kita... ?` = mình có được phép/có thể... không; mềm và mời hợp tác.",
          "`topik lain saja` = chủ đề khác thôi; `saja` làm câu nhẹ hơn.",
          "Lỗi người Việt: nói `ganti topik!` nghe như ra lệnh. Dạng hỏi với `boleh` giữ phép lịch sự.",
        ],
        pronunciation_focus_en: [
          "`boleh kita... ?` means may/can we..., a soft collaborative question.",
          "`topik lain saja` means just another topic; `saja` softens the request.",
          "VN-speaker trap: `ganti topik!` sounds like a command. A question with `boleh` keeps it polite.",
        ],
      },
      {
        en: "Saya menghargai pendapat Anda, tetapi keputusan saya tetap sama.",
        vi: "Tôi tôn trọng ý kiến của anh/chị, nhưng quyết định của tôi vẫn như vậy.",
        pronunciation_focus: [
          "`menghargai pendapat Anda` = tôn trọng ý kiến của anh/chị; rất hữu ích khi bất đồng.",
          "`tetap sama` = vẫn như cũ/vẫn vậy; dùng để nói quyết định không thay đổi.",
          "Lỗi người Việt: xin lỗi lặp đi lặp lại rồi đổi ý. Câu này vừa lịch sự vừa giữ lập trường.",
        ],
        pronunciation_focus_en: [
          "`menghargai pendapat Anda` means I respect your opinion; useful in disagreement.",
          "`tetap sama` means remains the same; use it when your decision has not changed.",
          "VN-speaker note: repeatedly apologizing and then changing your mind can blur the boundary. This sentence is polite and firm.",
        ],
      },
      {
        en: "Saya tidak ingin meminjamkan uang untuk hal pribadi.",
        vi: "Tôi không muốn cho mượn tiền cho chuyện cá nhân.",
        pronunciation_focus: [
          "`meminjamkan uang` = cho mượn tiền; khác với `meminjam uang` = vay/mượn tiền.",
          "`untuk hal pribadi` = cho chuyện cá nhân; cách nói trung tính, không phán xét.",
          "Lỗi người Việt: nhầm `meminjam` và `meminjamkan`. Người cho mượn dùng `meminjamkan`.",
        ],
        pronunciation_focus_en: [
          "`meminjamkan uang` means lend money; different from `meminjam uang`, borrow money.",
          "`untuk hal pribadi` means for personal matters; neutral and nonjudgmental.",
          "VN-speaker trap: mixing up `meminjam` and `meminjamkan`. The lender uses `meminjamkan`.",
        ],
      },
      {
        en: "Tolong jangan menyentuh barang pribadi saya tanpa izin.",
        vi: "Làm ơn đừng chạm vào đồ cá nhân của tôi khi chưa xin phép.",
        pronunciation_focus: [
          "`tolong jangan...` = làm ơn đừng...; trực tiếp nhưng vẫn lịch sự.",
          "`tanpa izin` = không có phép/chưa xin phép; cụm quan trọng khi nói về ranh giới.",
          "Lỗi người Việt: nói vòng quá xa khiến người nghe không hiểu. Với đồ cá nhân, câu rõ ràng như này là phù hợp.",
        ],
        pronunciation_focus_en: [
          "`tolong jangan...` means please do not...; direct but still polite.",
          "`tanpa izin` means without permission; a key phrase for boundaries.",
          "VN-speaker note: being too indirect can make the message unclear. For personal belongings, a clear sentence like this is appropriate.",
        ],
      },
      {
        en: "Saya mengerti maksud Anda, tapi saya tetap tidak setuju.",
        vi: "Tôi hiểu ý của anh/chị, nhưng tôi vẫn không đồng ý.",
        pronunciation_focus: [
          "`mengerti maksud Anda` = hiểu ý/ý định của anh/chị; giúp giảm căng thẳng trước khi bất đồng.",
          "`tetap tidak setuju` = vẫn không đồng ý; rõ hơn chỉ nói `mungkin tidak`.",
          "Lỗi người Việt: dùng `mungkin` để né tránh, làm câu mơ hồ. Khi cần ranh giới, hãy nói `tidak setuju` rõ ràng.",
        ],
        pronunciation_focus_en: [
          "`mengerti maksud Anda` means understand your point/intention; it lowers tension before disagreement.",
          "`tetap tidak setuju` means still disagree; clearer than just `mungkin tidak`.",
          "VN-speaker trap: using `mungkin` to avoid directness can make the sentence vague. For a boundary, say `tidak setuju` clearly.",
        ],
      },
      {
        en: "Saya harap hubungan kita tetap baik walaupun saya menolak ajakan ini.",
        vi: "Tôi hy vọng quan hệ của chúng ta vẫn tốt dù tôi từ chối lời mời này.",
        pronunciation_focus: [
          "`hubungan kita tetap baik` = quan hệ của chúng ta vẫn tốt; dùng khi muốn giữ hòa khí.",
          "`menolak ajakan` = từ chối lời mời; `menolak` rõ nhưng không thô nếu có lời mở đầu lịch sự.",
          "Lỗi người Việt: sợ từ `menolak` quá nặng. Trong câu mềm như này, `menolak` hoàn toàn phù hợp.",
        ],
        pronunciation_focus_en: [
          "`hubungan kita tetap baik` means our relationship stays good; useful when preserving harmony.",
          "`menolak ajakan` means refuse an invitation; `menolak` is clear but not rude with a polite frame.",
          "VN-speaker note: `menolak` may feel heavy, but inside a soft sentence like this it is appropriate.",
        ],
      },
      {
        en: "Untuk sekarang, jawaban saya belum berubah.",
        vi: "Hiện tại, câu trả lời của tôi chưa thay đổi.",
        pronunciation_focus: [
          "`untuk sekarang` = hiện tại/lúc này; không cần hứa mãi mãi.",
          "`belum berubah` = chưa thay đổi; mềm hơn `tidak akan berubah`.",
          "Lỗi người Việt: hoặc quá mềm, hoặc quá cứng. `Untuk sekarang` cho phép lịch sự mà vẫn chắc chắn.",
        ],
        pronunciation_focus_en: [
          "`untuk sekarang` means for now/at this point; you do not have to promise forever.",
          "`belum berubah` means has not changed yet; softer than `tidak akan berubah`.",
          "VN-speaker note: learners may be either too soft or too hard. `Untuk sekarang` lets you be polite and firm.",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong giao tiếp Indonesia, giữ hòa khí rất quan trọng, nên người ta thường mở đầu bằng `maaf`, `terima kasih`, hoặc `saya mengerti`. Tuy vậy, ranh giới vẫn có thể nói rõ bằng các cụm như `kurang nyaman`, `tidak bisa ikut`, `tolong jangan`, `tanpa izin`, và `keputusan saya tetap sama`. Với người lớn tuổi, cấp trên, hoặc người mới quen, dùng `saya`, `Anda`, `Bapak/Ibu`, `mohon`, `tolong`, và tránh giọng ra lệnh.",
    cultural_notes_en:
      "In Indonesian communication, preserving harmony matters, so people often open with `maaf`, `terima kasih`, or `saya mengerti`. Still, boundaries can be stated clearly with phrases like `kurang nyaman`, `tidak bisa ikut`, `tolong jangan`, `tanpa izin`, and `keputusan saya tetap sama`. With elders, superiors, or new acquaintances, use `saya`, `Anda`, `Bapak/Ibu`, `mohon`, `tolong`, and avoid a commanding tone.",
    tip_advice_vi:
      "Công thức an toàn: cảm ơn/xin lỗi + lý do ngắn + ranh giới rõ + giữ quan hệ. Ví dụ: `Terima kasih sudah mengajak, tapi saya tidak bisa ikut kali ini. Semoga kita bisa bertemu lain waktu.` Đừng dùng `tidak mau` trống nếu bạn muốn giữ lịch sự.",
    tip_advice_en:
      "Safe formula: thanks/apology + short reason + clear boundary + relationship repair. Example: `Terima kasih sudah mengajak, tapi saya tidak bisa ikut kali ini. Semoga kita bisa bertemu lain waktu.` Avoid bare `tidak mau` if you want to stay polite.",
    vocabulary: [
      {
        word: "batas pribadi",
        en: "personal boundary",
        vi: "ranh giới cá nhân",
        pos: "noun phrase",
        pronunciation_vi: "BA-tas pri-BA-di",
        pronunciation_en: "BAH-tas pree-BAH-dee",
      },
      {
        word: "kurang nyaman",
        en: "not quite comfortable",
        vi: "không thoải mái lắm",
        pos: "adjective phrase",
        pronunciation_vi: "KU-rang NYA-man",
        pronunciation_en: "KOO-rang NYA-man",
      },
      {
        word: "menolak ajakan",
        en: "decline an invitation",
        vi: "từ chối lời mời",
        pos: "verb phrase",
        pronunciation_vi: "me-NO-lak a-JA-kan",
        pronunciation_en: "meh-NO-lak ah-JAH-kan",
      },
      {
        word: "tanpa izin",
        en: "without permission",
        vi: "không có phép",
        pos: "prepositional phrase",
        pronunciation_vi: "TAN-pa I-zin",
        pronunciation_en: "TAHN-pa EE-zin",
      },
      {
        word: "tegas tapi baik",
        en: "firm but kind",
        vi: "kiên quyết nhưng tử tế",
        pos: "phrase",
        pronunciation_vi: "TE-gas TA-pi BA-ik",
        pronunciation_en: "TEH-gas TAH-pee BAH-ik",
      },
      {
        word: "menjaga hubungan",
        en: "maintain a relationship",
        vi: "giữ gìn quan hệ",
        pos: "verb phrase",
        pronunciation_vi: "men-JA-ga hu-BUNG-an",
        pronunciation_en: "men-JAH-ga hoo-BOONG-an",
      },
      {
        word: "alasan halus",
        en: "gentle reason",
        vi: "lý do nhẹ nhàng",
        pos: "noun phrase",
        pronunciation_vi: "a-LA-san HA-lus",
        pronunciation_en: "ah-LAH-san HAH-loos",
      },
      {
        word: "keputusan saya",
        en: "my decision",
        vi: "quyết định của tôi",
        pos: "noun phrase",
        pronunciation_vi: "ke-pu-TUS-an SA-ya",
        pronunciation_en: "keh-poo-TOOS-an SAH-ya",
      },
    ],
    dialogue: [
      {
        speaker: "Rani",
        text: "Malam ini ikut kumpul di rumah Dika, ya?",
        vi: "Tối nay đi tụ tập ở nhà Dika nhé?",
        en: "Join the gathering at Dika's house tonight, okay?",
      },
      {
        speaker: "Linh",
        text: "Terima kasih sudah mengajak, tapi saya tidak bisa ikut kali ini.",
        vi: "Cảm ơn đã rủ, nhưng lần này tôi không thể tham gia.",
        en: "Thanks for inviting me, but I cannot join this time.",
      },
      {
        speaker: "Rani",
        text: "Kenapa? Cuma sebentar saja.",
        vi: "Sao vậy? Chỉ một lát thôi mà.",
        en: "Why? Just for a little while.",
      },
      {
        speaker: "Linh",
        text: "Saya perlu waktu sendiri malam ini. Semoga kita bisa bertemu lain waktu.",
        vi: "Tối nay tôi cần thời gian riêng. Hy vọng mình có thể gặp nhau lần khác.",
        en: "I need time alone tonight. I hope we can meet another time.",
      },
      {
        speaker: "Rani",
        text: "Oke, aku mengerti. Istirahat dulu, ya.",
        vi: "Ừ, mình hiểu. Nghỉ ngơi trước nhé.",
        en: "Okay, I understand. Get some rest.",
      },
    ],
    exercises: [
      {
        type: "translation_id",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi không thoải mái lắm khi nói về chuyện đó.",
        prompt_en: "Translate into Indonesian: I am not quite comfortable discussing that.",
        answer: "Saya kurang nyaman membicarakan hal itu.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ đúng: Tolong jangan menyentuh barang pribadi saya ___ izin.",
        prompt_en: "Fill in the correct word: Tolong jangan menyentuh barang pribadi saya ___ izin.",
        answer: "tanpa",
        explanation_vi: "`tanpa izin` = không có phép/chưa xin phép.",
        explanation_en: "`tanpa izin` means without permission.",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Câu nào lịch sự nhất để từ chối lời mời?",
        prompt_en: "Which sentence is the most polite way to decline an invitation?",
        choices: [
          "Terima kasih sudah mengajak, tapi saya tidak bisa ikut kali ini.",
          "Tidak mau.",
          "Jangan ajak saya.",
          "Saya bosan sekali.",
        ],
        answer: "Terima kasih sudah mengajak, tapi saya tidak bisa ikut kali ini.",
      },
      {
        type: "rewrite_polite",
        prompt_vi: "Viết lại câu này lịch sự hơn: `Ganti topik!`",
        prompt_en: "Rewrite this more politely: `Ganti topik!`",
        sample_answer: "Boleh kita bahas topik lain saja?",
      },
    ],
  },
];
