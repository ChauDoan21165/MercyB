// Landlord Rent Increase Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It follows the established Indonesian extra
// lesson format: Indonesian target text lives in `en`, Vietnamese glosses live in
// `vi`, and each Vietnamese-facing learning note has an English companion.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus -- same length + order. */
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

// Loosely typed so per-type fields (translation, fill-blank, matching) can vary.
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
    id: "indonesian_landlord_rent_increase",
    level: "B1",
    category: "housing",
    title_vi: "Chủ nhà tăng tiền thuê",
    title_en: "Landlord rent increase",
    sentences: [
      {
        en: "Bu, saya mau tanya soal kenaikan sewa bulan depan.",
        vi: "Cô ơi, tôi muốn hỏi về việc tăng tiền thuê vào tháng sau.",
        pronunciation_focus: [
          "Bu, SA-ya mau TA-nya so-al ke-NA-ik-an SE-wa BUL-an de-PAN -- `kenaikan sewa` = tăng tiền thuê.",
          "Mẹo: mở đầu bằng `Bu` hoặc `Ibu` giữ giọng lịch sự, mềm hơn hỏi thẳng `naik berapa?`",
          "Luyện: `Saya mau tanya soal kenaikan sewa.`",
        ],
        pronunciation_focus_en: [
          "Bu, SA-ya mau TA-nya so-AL ke-NA-ik-an SE-wa BOOL-an de-PAN -- `kenaikan sewa` = rent increase.",
          "Tip: starting with `Bu` or `Ibu` keeps the tone polite and softer than bluntly asking `naik berapa?`",
          "Drill: `Saya mau tanya soal kenaikan sewa.`",
        ],
      },
      {
        en: "Kontrak lama saya masih berlaku sampai akhir tahun.",
        vi: "Hợp đồng cũ của tôi vẫn còn hiệu lực đến cuối năm.",
        pronunciation_focus: [
          "kon-TRAK LA-ma SA-ya MA-sih ber-LA-ku SAM-pai A-khir TA-hun -- `masih berlaku` = vẫn còn hiệu lực.",
          "Lỗi người Việt: nói `kontrak masih ada` nghe chưa đủ rõ. Dalam urusan sewa, `masih berlaku` lebih tepat.",
          "Luyện: `Kontrak saya masih berlaku.`",
        ],
        pronunciation_focus_en: [
          "kon-TRAK LA-ma SA-ya MA-sih ber-LA-koo SAM-pai A-kheer TA-hoon -- `masih berlaku` = still valid/in force.",
          "VN-speaker trap: saying `kontrak masih ada`, which is less precise. In rental matters, `masih berlaku` is the right chunk.",
          "Drill: `Kontrak saya masih berlaku.`",
        ],
      },
      {
        en: "Apakah kenaikannya bisa dinegosiasikan?",
        vi: "Việc tăng giá có thể thương lượng được không?",
        pronunciation_focus: [
          "a-pa-KAH ke-NA-ik-an-nya BI-sa di-ne-go-si-a-SI-kan -- `dinegosiasikan` = được thương lượng.",
          "Mẹo: bentuk pasif `di-` memberi kesan formal dan sopan saat bicara dengan pemilik rumah.",
          "Luyện: `Kenaikannya bisa dinegosiasikan?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH ke-NA-ik-an-nya BEE-sa di-ne-go-si-a-SEE-kan -- `dinegosiasikan` = can be negotiated.",
          "Tip: the passive `di-` gives a formal and polite tone when speaking with a landlord.",
          "Drill: `Kenaikannya bisa dinegosiasikan?`",
        ],
      },
      {
        en: "Kalau saya perpanjang sewa dua tahun, bisa tetap harga lama?",
        vi: "Nếu tôi gia hạn thuê hai năm, có thể giữ giá cũ không?",
        pronunciation_focus: [
          "KA-lau SA-ya per-PAN-jang SE-wa DU-a TA-hun, BI-sa te-TAP HAR-ga LA-ma -- `perpanjang sewa` = gia hạn thuê.",
          "`tetap harga lama` = giữ nguyên giá cũ; câu này biasa untuk negosiasi kontrak.",
          "Luyện: `Bisa tetap harga lama?`",
        ],
        pronunciation_focus_en: [
          "KA-lau SA-ya per-PAN-jang SE-wa DOO-a TA-hoon, BEE-sa te-TAP HAR-ga LA-ma -- `perpanjang sewa` = extend the lease.",
          "`tetap harga lama` = keep the old price; this is a common contract-negotiation line.",
          "Drill: `Bisa tetap harga lama?`",
        ],
      },
      {
        en: "Tolong jelaskan alasan kenaikan ini, Bu.",
        vi: "Làm ơn giải thích lý do tăng giá này, cô.",
        pronunciation_focus: [
          "TO-long je-las-KAN A-la-san ke-NA-ik-an I-ni, Bu -- `alasan` = lý do; `jelaskan` = giải thích rõ.",
          "Mẹo: `tolong jelaskan` bagus untuk meminta penjelasan tanpa terdengar menuduh.",
          "Luyện: `Tolong jelaskan alasannya.`",
        ],
        pronunciation_focus_en: [
          "TO-long je-LAS-kan A-la-san ke-NA-ik-an EE-ni, Boo -- `alasan` = reason; `jelaskan` = explain clearly.",
          "Tip: `tolong jelaskan` is useful for asking for an explanation without sounding accusatory.",
          "Drill: `Tolong jelaskan alasannya.`",
        ],
      },
      {
        en: "Saya masih punya cicilan, jadi perlu atur uang sewa dengan hati-hati.",
        vi: "Tôi vẫn còn trả góp, nên cần sắp xếp tiền thuê cẩn thận.",
        pronunciation_focus: [
          "SA-ya MA-sih PU-nya ci-CIL-an, JA-di per-LU A-tur U-ang SE-wa de-ngan ha-TI-ha-ti -- `cicilan` = trả góp; `hati-hati` = cẩn thận.",
          "`jadi` nối lý do và kết luận rất alami: còn cicilan, nên phải atur sewa.",
          "Luyện: `Saya masih punya cicilan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MA-sih POO-nya chi-CHIL-an, JA-di per-LOO A-toor OO-ang SE-wa DE-ngan ha-TEE-ha-TEE -- `cicilan` = installment; `hati-hati` = carefully.",
          "`Jadi` naturally links reason and conclusion: I still have installments, so I need to manage rent carefully.",
          "Drill: `Saya masih punya cicilan.`",
        ],
      },
      {
        en: "Kalau tidak cocok, saya mungkin harus pindah rumah.",
        vi: "Nếu không phù hợp, có lẽ tôi phải chuyển nhà.",
        pronunciation_focus: [
          "KA-lau TI-dak CO-cok, SA-ya MUNG-kin HA-rus PIN-dah RU-mah -- `tidak cocok` = không phù hợp; `pindah rumah` = chuyển nhà.",
          "Lỗi người Việt: nói `gak pas` bisa dimengerti, tapi `tidak cocok` lebih rapi dalam negosiasi sewa.",
          "Luyện: `Saya mungkin harus pindah rumah.`",
        ],
        pronunciation_focus_en: [
          "KA-lau TEE-dak CHO-chok, SA-ya MOONG-kin HA-roos PIN-dah ROO-mah -- `tidak cocok` = not suitable; `pindah rumah` = move house.",
          "VN-speaker trap: `gak pas` may be understood, but `tidak cocok` is cleaner in rent negotiations.",
          "Drill: `Saya mungkin harus pindah rumah.`",
        ],
      },
      {
        en: "Apakah kita bisa buat kesepakatan yang sama-sama enak?",
        vi: "Chúng ta có thể đưa ra một thỏa thuận đôi bên cùng thoải mái không?",
        pronunciation_focus: [
          "a-pa-KAH ki-ta BI-sa bu-AT ke-se-pa-KA-tan yang sa-MA-sa-MA E-nak -- `kesepakatan` = thỏa thuận; `sama-sama enak` = hai bên đều thoải mái.",
          "Mẹo: `sama-sama enak` adalah cara halus mengatakan win-win tanpa terlalu formal.",
          "Luyện: `Bisa buat kesepakatan?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH kee-ta BEE-sa boo-AT ke-se-pa-KA-tan yang sa-MA-sa-MA E-nak -- `kesepakatan` = agreement; `sama-sama enak` = mutually comfortable.",
          "Tip: `sama-sama enak` is a soft way to say win-win without sounding too formal.",
          "Drill: `Bisa buat kesepakatan?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, kenaikan sewa thường dibicarakan melalui obrolan langsung yang sopan, terutama jika kontrak lama masih berlaku. Pemilik rumah có thể nêu alasan kenaikan seperti biaya perawatan, pajak, atau harga pasar. Người thuê thường hỏi apakah kenaikan bisa dinegosiasikan, apakah perpanjang sewa dengan harga lama mungkin, dan kapan keputusan harus dibuat. Giữ giọng bình tĩnh giúp kesepakatan lebih mudah dicapai.",
    cultural_notes_en:
      "In Indonesia, rent increases are often discussed in a polite direct conversation, especially if the old contract is still valid. Landlords may explain the increase using reasons like maintenance costs, taxes, or market prices. Tenants usually ask whether the increase can be negotiated, whether renewing at the old price is possible, and when a decision must be made. Keeping a calm tone makes it easier to reach an agreement.",
    tip_advice_vi:
      "Mẹo cho người Việt: học các cụm thương lượng `kenaikan sewa`, `kontrak lama`, `perpanjang sewa`, `dinegosiasikan`, `harga lama`, `pindah rumah`, `kesepakatan`. Khi nói khó khăn tài chính, dùng `saya masih punya cicilan` hoặc `perlu atur uang sewa` thay vì than phiền quá mạnh.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn the negotiation chunks `kenaikan sewa`, `kontrak lama`, `perpanjang sewa`, `dinegosiasikan`, `harga lama`, `pindah rumah`, `kesepakatan`. When explaining financial difficulty, use `saya masih punya cicilan` or `perlu atur uang sewa` instead of sounding too harsh.",
    vocabulary: [
      {
        cell_id: "5781652e-50e1-4c4b-8140-d70300b5b419",
        word: "kenaikan sewa",
        en: "rent increase",
        vi: "tăng tiền thuê",
        pos: "noun phrase",
        pronunciation_vi: "ke-NA-ik-an SE-wa",
        pronunciation_en: "ke-NA-ik-an SE-wa",
      },
      {
        cell_id: "439ab951-5383-4e44-82d2-bf2b626c0d91",
        word: "negosiasi",
        en: "negotiation",
        vi: "thương lượng",
        pos: "noun",
        pronunciation_vi: "ne-go-si-a-SI",
        pronunciation_en: "ne-go-si-A-shun",
      },
      {
        cell_id: "4b84a95f-2f7c-48b4-a73c-cd21c10f8ed3",
        word: "kontrak lama",
        en: "old contract",
        vi: "hợp đồng cũ",
        pos: "noun phrase",
        pronunciation_vi: "kon-TRAK LA-ma",
        pronunciation_en: "KON-trak LA-ma",
      },
      {
        cell_id: "e76a8c18-b3a0-4bfb-86bd-3a0094a56d69",
        word: "perpanjang sewa",
        en: "extend the lease",
        vi: "gia hạn thuê",
        pos: "verb phrase",
        pronunciation_vi: "per-PAN-jang SE-wa",
        pronunciation_en: "per-PAN-jang SE-wa",
      },
      {
        cell_id: "e8a8a2b6-e47d-49be-83dc-eb3e2b9901c9",
        word: "alasan kenaikan",
        en: "reason for increase",
        vi: "lý do tăng giá",
        pos: "noun phrase",
        pronunciation_vi: "A-la-san ke-NA-ik-an",
        pronunciation_en: "A-la-san ke-NA-ik-an",
      },
      {
        cell_id: "eed5ad96-dfbf-47b7-9995-363540aecd96",
        word: "cicilan",
        en: "installment payment",
        vi: "trả góp",
        pos: "noun",
        pronunciation_vi: "ci-CIL-an",
        pronunciation_en: "chi-CHIL-an",
      },
      {
        cell_id: "791f4c48-11ec-44af-a2ef-7a4f8b8c6837",
        word: "pindah rumah",
        en: "move house",
        vi: "chuyển nhà",
        pos: "verb phrase",
        pronunciation_vi: "PIN-dah RU-mah",
        pronunciation_en: "PIN-dah ROO-mah",
      },
      {
        cell_id: "9c95efa2-bbd6-40e5-8b8b-72d6d467bef4",
        word: "kesepakatan",
        en: "agreement",
        vi: "thỏa thuận",
        pos: "noun",
        pronunciation_vi: "ke-se-pa-KA-tan",
        pronunciation_en: "ke-se-pa-KA-tan",
      },
    ],
    dialogue: [
      {
        cell_id: "317b8bf8-d618-473e-9e3b-e2c0109057fb",
        speaker: "Penyewa",
        text: "Bu, saya mau tanya soal kenaikan sewa bulan depan.",
        vi: "Cô ơi, tôi muốn hỏi về việc tăng tiền thuê vào tháng sau.",
        en: "Ma'am, I want to ask about the rent increase next month.",
      },
      {
        cell_id: "7d528c39-d5d9-4ae0-a949-3de6382b1de3",
        speaker: "Pemilik rumah",
        text: "Iya, biaya perawatan naik, jadi sewanya perlu disesuaikan.",
        vi: "Vâng, chi phí bảo trì tăng, nên tiền thuê cần được điều chỉnh.",
        en: "Yes, maintenance costs have gone up, so the rent needs to be adjusted.",
      },
      {
        cell_id: "32e941a9-88bd-4c15-a65e-8bc4c4ad0f1e",
        speaker: "Penyewa",
        text: "Kontrak lama saya masih berlaku, jadi apakah bisa dinegosiasikan?",
        vi: "Hợp đồng cũ của tôi vẫn còn hiệu lực, nên có thể thương lượng được không?",
        en: "My old contract is still valid, so can it be negotiated?",
      },
      {
        cell_id: "358ed396-3d75-408f-a08d-a0a0658ea597",
        speaker: "Pemilik rumah",
        text: "Kalau Anda mau perpanjang sewa, kita bisa cari kesepakatan yang baik.",
        vi: "Nếu anh/chị muốn gia hạn thuê, chúng ta có thể tìm một thỏa thuận tốt.",
        en: "If you want to renew the lease, we can find a good agreement.",
      },
      {
        cell_id: "48dfabdb-cd86-4602-a9f6-72f14b538d4c",
        speaker: "Penyewa",
        text: "Terima kasih. Saya masih punya cicilan, jadi saya perlu atur uang sewa dulu.",
        vi: "Cảm ơn. Tôi vẫn còn trả góp, nên tôi cần sắp xếp tiền thuê trước.",
        en: "Thank you. I still have installments, so I need to arrange the rent budget first.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: 'Tiền thuê của tôi có thể được thương lượng không?'",
        prompt_en: "Translate into Indonesian: 'Can my rent be negotiated?'",
        answer: "Kenaikan sewanya bisa dinegosiasikan?",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Kontrak lama saya masih ____ sampai akhir tahun.`",
        prompt_en: "Fill in the blank: `Kontrak lama saya masih ____ sampai akhir tahun.`",
        answer: "berlaku",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm Indonesia với nghĩa tiếng Việt.",
        prompt_en: "Match the Indonesian phrase with the Vietnamese meaning.",
        pairs: [
          ["kenaikan sewa", "tăng tiền thuê"],
          ["perpanjang sewa", "gia hạn thuê"],
          ["kesepakatan", "thỏa thuận"],
        ],
      },
      {
        type: "roleplay",
        prompt_vi:
          "Bạn nói chuyện với chủ nhà về kenaikan sewa, hỏi alasan kenaikan, đề nghị perpanjang sewa với harga lama, và nếu cần thì chuẩn bị pindah rumah.",
        prompt_en:
          "You are talking to the landlord about a rent increase, asking for the reason, proposing to renew the lease at the old price, and, if needed, preparing to move house.",
      },
    ],
    content:
      "Use this lesson for Indonesian conversations about rent increases: asking for reasons, referring to an old contract, negotiating renewal, mentioning installment payments, and reaching a calm agreement with the landlord.",
  },
];
