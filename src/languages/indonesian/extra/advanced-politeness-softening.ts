// Advanced Politeness & Softening Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// politeness/register notes with English companions in pronunciation_focus_en.

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
    id: "indonesian_advanced_politeness_softening",
    level: "B2",
    category: "communication",
    title_vi: "Làm mềm lời nói và lịch sự nâng cao",
    title_en: "Advanced politeness and softening",
    sentences: [
      {
        en: "Maaf mengganggu, apakah Bapak/Ibu punya waktu sebentar?",
        vi: "Xin lỗi vì làm phiền, anh/chị/cô/chú có chút thời gian không?",
        pronunciation_focus: [
          "ma-AF meng-GANG-gu, a-pa-KAH BA-pak/I-bu PU-nya WAK-tu se-BEN-tar - `maaf mengganggu` = xin lỗi vì làm phiền.",
          "Lỗi người Việt: mở đầu trực tiếp bằng `Saya mau tanya`. Thêm `maaf mengganggu` làm câu mềm hơn.",
          "Luyện: `Maaf mengganggu, punya waktu sebentar?`",
        ],
        pronunciation_focus_en: [
          "ma-AF meng-GANG-goo, a-pa-KAH BA-pak/I-bu POO-nya WAK-too se-BEN-tar - `maaf mengganggu` = sorry to bother you.",
          "VN-speaker trap: opening directly with `Saya mau tanya`. Add `maaf mengganggu` to soften it.",
          "Drill: `Maaf mengganggu, punya waktu sebentar?`",
        ],
      },
      {
        en: "Kalau boleh, saya ingin menanyakan satu hal.",
        vi: "Nếu được, tôi muốn hỏi một điều.",
        pronunciation_focus: [
          "KA-lau BO-leh, SA-ya I-ngin me-na-NYA-kan SA-tu HAL - `kalau boleh` = nếu được; `satu hal` = một điều.",
          "Lỗi người Việt: dùng `boleh saya` tốt, nhưng `kalau boleh` mở đầu mềm hơn trong ngữ cảnh nhạy cảm.",
          "Luyện: `Kalau boleh, saya ingin bertanya.`",
        ],
        pronunciation_focus_en: [
          "KA-lau BO-leh, SA-ya EE-ngin me-na-NYA-kan SA-too HAL - `kalau boleh` = if I may; `satu hal` = one thing.",
          "VN-speaker trap: `boleh saya` is fine, but `kalau boleh` is softer for sensitive contexts.",
          "Drill: `Kalau boleh, saya ingin bertanya.`",
        ],
      },
      {
        en: "Sepertinya ada sedikit kesalahpahaman di sini.",
        vi: "Có vẻ như ở đây có một chút hiểu lầm.",
        pronunciation_focus: [
          "se-PER-ti-nya A-da se-DI-kit ke-sa-lah-PA-ham-an di SI-ni - `sepertinya` = có vẻ như; `kesalahpahaman` = sự hiểu lầm.",
          "Lỗi người Việt: nói `Anda salah paham` nghe đổ lỗi. `Ada sedikit kesalahpahaman` trung tính hơn.",
          "Luyện: `Sepertinya ada kesalahpahaman.`",
        ],
        pronunciation_focus_en: [
          "se-PER-ti-nya A-da se-DEE-kit ke-sa-lah-PA-ham-an di SI-ni - `sepertinya` = it seems; `kesalahpahaman` = misunderstanding.",
          "VN-speaker trap: saying `Anda salah paham` sounds blaming. `Ada sedikit kesalahpahaman` is more neutral.",
          "Drill: `Sepertinya ada kesalahpahaman.`",
        ],
      },
      {
        en: "Mungkin bisa dipertimbangkan opsi yang lain.",
        vi: "Có lẽ có thể cân nhắc phương án khác.",
        pronunciation_focus: [
          "MUNG-kin BI-sa di-per-tim-BANG-kan OP-si yang LA-in - `mungkin bisa` = có lẽ có thể; `dipertimbangkan` = được cân nhắc.",
          "Lỗi người Việt: đề xuất bằng `harus`. `Mungkin bisa...` là công thức mềm để đưa ý kiến.",
          "Luyện: `Mungkin bisa dipertimbangkan.`",
        ],
        pronunciation_focus_en: [
          "MOONG-kin BI-sa di-per-tim-BANG-kan OP-si yang LA-in - `mungkin bisa` = maybe it could; `dipertimbangkan` = be considered.",
          "VN-speaker trap: proposing with `harus`. `Mungkin bisa...` is a soft suggestion formula.",
          "Drill: `Mungkin bisa dipertimbangkan.`",
        ],
      },
      {
        en: "Mohon dipertimbangkan kembali sebelum keputusan dibuat.",
        vi: "Xin vui lòng cân nhắc lại trước khi quyết định được đưa ra.",
        pronunciation_focus: [
          "MO-hon di-per-tim-BANG-kan kem-BA-li se-BE-lum ke-pu-TUS-an di-BU-at - `mohon` = kính xin; `kembali` = lại.",
          "Lỗi người Việt: dùng `tolong pikir lagi` trong văn trang trọng. Trang trọng hơn: `Mohon dipertimbangkan kembali`.",
          "Luyện: `Mohon dipertimbangkan kembali.`",
        ],
        pronunciation_focus_en: [
          "MO-hon di-per-tim-BANG-kan kem-BA-li se-BE-lum ke-poo-TOOS-an di-BOO-at - `mohon` = kindly request; `kembali` = again.",
          "VN-speaker trap: saying `tolong pikir lagi` in formal writing. More formal: `Mohon dipertimbangkan kembali`.",
          "Drill: `Mohon dipertimbangkan kembali.`",
        ],
      },
      {
        en: "Untuk saat ini, saya belum bisa menyanggupi permintaan tersebut.",
        vi: "Hiện tại, tôi chưa thể đồng ý/đáp ứng yêu cầu đó.",
        pronunciation_focus: [
          "UN-tuk SA-at I-ni, SA-ya be-LUM BI-sa me-nyang-GU-pi per-MIN-ta-an ter-se-BUT - `menyanggupi` = đồng ý nhận/đáp ứng; `permintaan tersebut` = yêu cầu đó.",
          "Lỗi người Việt: từ chối bằng `tidak bisa` quá cụt. Thêm `untuk saat ini` và `belum` để menolak halus.",
          "Luyện: `Untuk saat ini, saya belum bisa.`",
        ],
        pronunciation_focus_en: [
          "UN-tuk SA-at I-ni, SA-ya be-LOOM BI-sa me-nyang-GOO-pi per-MIN-ta-an ter-se-BOOT - `menyanggupi` = agree/commit to; `permintaan tersebut` = that request.",
          "VN-speaker trap: refusing with bare `tidak bisa`. Add `untuk saat ini` and `belum` for a softer refusal.",
          "Drill: `Untuk saat ini, saya belum bisa.`",
        ],
      },
      {
        en: "Saya khawatir hasilnya belum sesuai dengan harapan.",
        vi: "Tôi e rằng kết quả chưa phù hợp với kỳ vọng.",
        pronunciation_focus: [
          "SA-ya kha-WA-tir HA-sil-nya be-LUM se-SU-ai de-NGAN ha-RAP-an - `saya khawatir` = tôi e rằng; `sesuai harapan` = đúng kỳ vọng.",
          "Lỗi người Việt: phê bình bằng `hasilnya jelek`. Câu này là cách menyampaikan kritik mềm hơn.",
          "Luyện: `Belum sesuai dengan harapan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya kha-WA-teer HA-sil-nya be-LOOM se-SOO-ai de-NGAN ha-RAP-an - `saya khawatir` = I am afraid/concerned; `sesuai harapan` = as expected.",
          "VN-speaker trap: criticizing with `hasilnya jelek`. This is a softer way to give criticism.",
          "Drill: `Belum sesuai dengan harapan.`",
        ],
      },
      {
        en: "Boleh saya memberi masukan kecil?",
        vi: "Tôi có thể góp ý nhỏ được không?",
        pronunciation_focus: [
          "BO-leh SA-ya mem-BE-ri ma-SUK-an KE-cil - `masukan` = góp ý/đầu vào; `kecil` = nhỏ.",
          "Lỗi người Việt: dùng `kritik` ngay làm người nghe phòng thủ. `Masukan kecil` mềm và hợp công việc hơn.",
          "Luyện: `Boleh saya memberi masukan?`",
        ],
        pronunciation_focus_en: [
          "BO-leh SA-ya mem-BE-ri ma-SOO-kan KE-chil - `masukan` = input/feedback; `kecil` = small.",
          "VN-speaker trap: using `kritik` right away can make people defensive. `Masukan kecil` is softer and workplace-friendly.",
          "Drill: `Boleh saya memberi masukan?`",
        ],
      },
      {
        en: "Menurut saya, bagian ini masih bisa dibuat lebih jelas.",
        vi: "Theo tôi, phần này vẫn có thể làm rõ hơn.",
        pronunciation_focus: [
          "me-NU-rut SA-ya, BA-gi-an I-ni MA-sih BI-sa di-BU-at LE-bih JE-las - `masih bisa` = vẫn có thể; `lebih jelas` = rõ hơn.",
          "Lỗi người Việt: nói `ini tidak jelas` quá mạnh. `Masih bisa dibuat lebih jelas` giữ hướng cải thiện.",
          "Luyện: `Masih bisa dibuat lebih jelas.`",
        ],
        pronunciation_focus_en: [
          "me-NU-root SA-ya, BA-gi-an I-ni MA-sih BI-sa di-BOO-at LE-bih JE-las - `masih bisa` = can still be; `lebih jelas` = clearer.",
          "VN-speaker trap: saying `ini tidak jelas` too bluntly. `Masih bisa dibuat lebih jelas` keeps an improvement tone.",
          "Drill: `Masih bisa dibuat lebih jelas.`",
        ],
      },
      {
        en: "Saya menghargai usulnya, hanya saja waktunya kurang tepat.",
        vi: "Tôi trân trọng đề xuất đó, chỉ là thời điểm chưa phù hợp.",
        pronunciation_focus: [
          "SA-ya meng-har-GAI U-sul-nya, HA-nya SA-ja WAK-tu-nya KU-rang te-PAT - `menghargai usulnya` = trân trọng đề xuất; `kurang tepat` = chưa phù hợp.",
          "Lỗi người Việt: từ chối ý tưởng bằng `tidak cocok`. `Kurang tepat` mềm hơn `tidak tepat`.",
          "Luyện: `Hanya saja waktunya kurang tepat.`",
        ],
        pronunciation_focus_en: [
          "SA-ya meng-har-GAI OO-sool-nya, HA-nya SA-ja WAK-too-nya KOO-rang te-PAT - `menghargai usulnya` = appreciate the suggestion; `kurang tepat` = not quite suitable.",
          "VN-speaker trap: rejecting an idea with `tidak cocok`. `Kurang tepat` is softer than `tidak tepat`.",
          "Drill: `Hanya saja waktunya kurang tepat.`",
        ],
      },
      {
        en: "Apabila memungkinkan, kami berharap jawabannya bisa dikirim hari ini.",
        vi: "Nếu có thể, chúng tôi hy vọng câu trả lời có thể được gửi hôm nay.",
        pronunciation_focus: [
          "a-pa-BI-la me-MUNG-kin-kan, KA-mi ber-HA-rap ja-WAB-an-nya BI-sa di-KI-rim HA-ri I-ni - `apabila memungkinkan` = nếu có thể; `berharap` = hy vọng.",
          "Lỗi người Việt: yêu cầu hạn bằng `kirim hari ini`. Thêm `apabila memungkinkan` làm lịch sự hơn.",
          "Luyện: `Apabila memungkinkan, hari ini.`",
        ],
        pronunciation_focus_en: [
          "a-pa-BI-la me-MOONG-kin-kan, KA-mi ber-HA-rap ja-WAB-an-nya BI-sa di-KI-rim HA-ri I-ni - `apabila memungkinkan` = if possible; `berharap` = hope.",
          "VN-speaker trap: setting a deadline with bare `kirim hari ini`. Add `apabila memungkinkan` for politeness.",
          "Drill: `Apabila memungkinkan, hari ini.`",
        ],
      },
      {
        en: "Terima kasih atas pengertiannya.",
        vi: "Cảm ơn vì sự thông cảm/thấu hiểu.",
        pronunciation_focus: [
          "te-ri-MA KA-sih A-tas pe-nger-TI-an-nya - `pengertian` = sự thông cảm/thấu hiểu; `-nya` làm câu mềm và tự nhiên.",
          "Lỗi người Việt: kết thúc từ chối bằng im lặng. Câu này giữ quan hệ sau lời từ chối hoặc yêu cầu khó.",
          "Luyện: `Terima kasih atas pengertiannya.`",
        ],
        pronunciation_focus_en: [
          "te-ri-MA KA-sih A-tas pe-nger-TI-an-nya - `pengertian` = understanding; `-nya` makes the phrase natural and soft.",
          "VN-speaker trap: ending a refusal with silence. This phrase preserves the relationship after a difficult request or refusal.",
          "Drill: `Terima kasih atas pengertiannya.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong tiếng Indonesia, lịch sự nâng cao thường không nằm ở một từ duy nhất mà ở chuỗi làm mềm: xin lỗi nhẹ (`maaf mengganggu`), xin phép (`kalau boleh`, `boleh saya...`), giảm độ chắc (`sepertinya`, `mungkin`), dùng bị động/trang trọng (`mohon dipertimbangkan`), và kết thúc bằng lời giữ quan hệ (`terima kasih atas pengertiannya`). Cách này rất hữu ích trong email, văn phòng, lớp học, và khi nói với người lớn tuổi.",
    cultural_notes_en:
      "In Indonesian, advanced politeness is usually not one magic word but a chain of softeners: a light apology (`maaf mengganggu`), permission (`kalau boleh`, `boleh saya...`), reduced certainty (`sepertinya`, `mungkin`), formal/passive phrasing (`mohon dipertimbangkan`), and a relationship-preserving close (`terima kasih atas pengertiannya`). This is useful in email, office settings, classrooms, and with older people.",
    tip_advice_vi:
      "Mẹo cho người Việt: tiếng Việt cũng hay nói vòng để giữ thể diện, nên hãy chuyển kỹ năng đó sang Indonesia. Công thức an toàn: `Maaf mengganggu` + `kalau boleh` + ý chính mềm (`mungkin bisa...`, `sepertinya...`) + kết thúc giữ quan hệ. Khi từ chối, dùng `untuk saat ini` và `belum bisa` thay vì `tidak mau/tidak bisa`. Khi phê bình, dùng `masukan` và `masih bisa dibuat lebih...` thay vì chê trực tiếp.",
    tip_advice_en:
      "Tip for Vietnamese speakers: Vietnamese also softens speech to preserve face, so transfer that skill into Indonesian. Safe frame: `Maaf mengganggu` + `kalau boleh` + softened main point (`mungkin bisa...`, `sepertinya...`) + relationship-preserving close. For refusal, use `untuk saat ini` and `belum bisa` instead of blunt `tidak mau/tidak bisa`. For criticism, use `masukan` and `masih bisa dibuat lebih...` instead of direct negative judgment.",
    vocabulary: [
      { word: "maaf mengganggu", en: "sorry to bother you", vi: "xin lỗi vì làm phiền", pos: "phrase", pronunciation_vi: "ma-AF meng-GANG-gu", pronunciation_en: "ma-AF meng-GANG-goo" },
      { word: "kalau boleh", en: "if I may", vi: "nếu được", pos: "phrase", pronunciation_vi: "KA-lau BO-leh", pronunciation_en: "KA-lau BO-leh" },
      { word: "sepertinya", en: "it seems", vi: "có vẻ như", pos: "adverb", pronunciation_vi: "se-PER-ti-nya", pronunciation_en: "se-PER-ti-nya" },
      { word: "mungkin bisa", en: "maybe it could", vi: "có lẽ có thể", pos: "phrase", pronunciation_vi: "MUNG-kin BI-sa", pronunciation_en: "MOONG-kin BI-sa" },
      { word: "mohon dipertimbangkan", en: "please consider", vi: "xin vui lòng cân nhắc", pos: "formal phrase", pronunciation_vi: "MO-hon di-per-tim-BANG-kan", pronunciation_en: "MO-hon di-per-tim-BANG-kan" },
      { word: "menolak halus", en: "to refuse gently", vi: "từ chối khéo", pos: "verb phrase", pronunciation_vi: "me-NO-lak HA-lus", pronunciation_en: "me-NO-lak HA-loos" },
      { word: "menyampaikan kritik", en: "to give criticism", vi: "đưa ra phê bình/góp ý", pos: "verb phrase", pronunciation_vi: "me-nyam-PAI-kan KRI-tik", pronunciation_en: "me-nyam-PAI-kan KRI-tik" },
      { word: "masukan", en: "input, feedback", vi: "góp ý", pos: "noun", pronunciation_vi: "ma-SUK-an", pronunciation_en: "ma-SOO-kan" },
    ],
    dialogue: [
      {
        speaker: "Dewi",
        text: "Maaf mengganggu, Pak. Kalau boleh, saya ingin memberi masukan kecil.",
        vi: "Xin lỗi vì làm phiền, thưa anh/chú. Nếu được, tôi muốn góp ý nhỏ.",
        en: "Sorry to bother you, sir. If I may, I would like to give a small piece of feedback.",
      },
      {
        speaker: "Pak Arif",
        text: "Silakan, Dewi. Bagian mana yang perlu dibahas?",
        vi: "Xin mời, Dewi. Phần nào cần thảo luận?",
        en: "Please, Dewi. Which part needs to be discussed?",
      },
      {
        speaker: "Dewi",
        text: "Menurut saya, bagian ini masih bisa dibuat lebih jelas.",
        vi: "Theo tôi, phần này vẫn có thể làm rõ hơn.",
        en: "In my opinion, this section could still be made clearer.",
      },
      {
        speaker: "Pak Arif",
        text: "Baik, terima kasih. Mohon kirim catatannya setelah rapat.",
        vi: "Được, cảm ơn. Vui lòng gửi ghi chú sau cuộc họp.",
        en: "All right, thank you. Please send the notes after the meeting.",
      },
      {
        speaker: "Dewi",
        text: "Baik, Pak. Terima kasih atas pengertiannya.",
        vi: "Vâng, thưa anh/chú. Cảm ơn vì sự thông cảm.",
        en: "Yes, sir. Thank you for your understanding.",
      },
    ],
    exercises: [
      {
        type: "softening_rewrite",
        instruction_vi: "Viết lại câu trực tiếp thành cách nói mềm và lịch sự hơn.",
        instruction_en: "Rewrite the direct sentence into a softer and more polite version.",
        items: [
          {
            prompt: "Saya mau tanya.",
            answer: "Maaf mengganggu, kalau boleh saya ingin menanyakan satu hal.",
          },
          {
            prompt: "Hasilnya jelek.",
            answer: "Saya khawatir hasilnya belum sesuai dengan harapan.",
          },
          {
            prompt: "Saya tidak bisa menerima permintaan itu.",
            answer: "Untuk saat ini, saya belum bisa menyanggupi permintaan tersebut.",
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối cụm làm mềm với chức năng giao tiếp.",
        instruction_en: "Match the softening phrase with its communication function.",
        items: [
          { prompt: "maaf mengganggu", answer: "mở đầu khi sợ làm phiền" },
          { prompt: "kalau boleh", answer: "xin phép trước khi hỏi/nói" },
          { prompt: "sepertinya", answer: "giảm độ chắc, tránh khẳng định gắt" },
          { prompt: "mohon dipertimbangkan", answer: "đề nghị trang trọng" },
        ],
      },
    ],
  },
];

export default lessons;
