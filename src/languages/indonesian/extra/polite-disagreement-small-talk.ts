// Polite Disagreement & Small Talk Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// register/social notes with English companions in pronunciation_focus_en.

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
    id: "indonesian_polite_disagreement_small_talk",
    level: "B1",
    category: "communication",
    title_vi: "Bất đồng lịch sự và nói chuyện xã giao",
    title_en: "Polite disagreement and small talk",
    sentences: [
      {
        en: "Saya kurang setuju, tapi saya mengerti maksud Anda.",
        vi: "Tôi không hẳn đồng ý, nhưng tôi hiểu ý của anh/chị.",
        pronunciation_focus: [
          "SA-ya KU-rang se-TU-ju, TA-pi SA-ya me-NGER-ti MAK-sud AN-da - `kurang setuju` = không hẳn đồng ý; `maksud Anda` = ý của anh/chị.",
          "Lỗi người Việt: nói `saya tidak setuju` ngay có thể nghe gắt. `Kurang setuju` là cách phản đối mềm hơn.",
          "Luyện: `Saya kurang setuju, tapi saya mengerti.`",
        ],
        pronunciation_focus_en: [
          "SA-ya KOO-rang se-TOO-joo, TA-pi SA-ya me-NGER-ti MAK-sood AN-da - `kurang setuju` = I do not quite agree; `maksud Anda` = your point.",
          "VN-speaker trap: starting with blunt `saya tidak setuju` can sound sharp. `Kurang setuju` is a softer disagreement.",
          "Drill: `Saya kurang setuju, tapi saya mengerti.`",
        ],
      },
      {
        en: "Menurut saya, mungkin lebih baik kita coba cara lain.",
        vi: "Theo tôi, có lẽ tốt hơn là chúng ta thử cách khác.",
        pronunciation_focus: [
          "me-NU-rut SA-ya, MUNG-kin LE-bih BAIK KI-ta CO-ba CA-ra LA-in - `menurut saya` = theo tôi; `mungkin lebih baik` = có lẽ tốt hơn.",
          "Lỗi người Việt: đưa đề xuất như mệnh lệnh. Thêm `menurut saya` và `mungkin` để giữ không khí nhẹ.",
          "Luyện: `Mungkin lebih baik kita coba cara lain.`",
        ],
        pronunciation_focus_en: [
          "me-NU-rut SA-ya, MOONG-kin LE-bih BAIK KI-ta CHO-ba CHA-ra LA-in - `menurut saya` = in my opinion; `mungkin lebih baik` = maybe it is better.",
          "VN-speaker trap: giving suggestions like commands. Add `menurut saya` and `mungkin` to keep the mood light.",
          "Drill: `Mungkin lebih baik kita coba cara lain.`",
        ],
      },
      {
        en: "Ide itu menarik, hanya saja waktunya agak mepet.",
        vi: "Ý tưởng đó thú vị, chỉ là thời gian hơi gấp.",
        pronunciation_focus: [
          "i-DE I-tu me-NA-rik, HA-nya SA-ja WAK-tu-nya A-gak ME-pet - `menarik` = thú vị; `agak mepet` = hơi sát/gấp.",
          "Lỗi người Việt: phản bác trước khi công nhận. Mẫu `menarik, hanya saja...` giúp giữ thiện chí.",
          "Luyện: `Ide itu menarik, hanya saja...`",
        ],
        pronunciation_focus_en: [
          "i-DE I-too me-NA-rik, HA-nya SA-ja WAK-too-nya A-gak ME-pet - `menarik` = interesting; `agak mepet` = a bit tight.",
          "VN-speaker trap: rejecting before acknowledging. The frame `menarik, hanya saja...` preserves goodwill.",
          "Drill: `Ide itu menarik, hanya saja...`",
        ],
      },
      {
        en: "Boleh saya memberi sudut pandang lain?",
        vi: "Tôi có thể đưa ra một góc nhìn khác không?",
        pronunciation_focus: [
          "BO-leh SA-ya mem-BE-ri SU-dut PAN-dang LA-in - `sudut pandang lain` = góc nhìn khác.",
          "Lỗi người Việt: chen vào bằng `tapi...` quá nhanh. Xin phép bằng `boleh saya...` lịch sự hơn.",
          "Luyện: `Boleh saya memberi sudut pandang lain?`",
        ],
        pronunciation_focus_en: [
          "BO-leh SA-ya mem-BE-ri SOO-doot PAN-dang LA-in - `sudut pandang lain` = another perspective.",
          "VN-speaker trap: jumping in with fast `tapi...`. Asking permission with `boleh saya...` is more polite.",
          "Drill: `Boleh saya memberi sudut pandang lain?`",
        ],
      },
      {
        en: "Kita bisa berbeda pendapat tanpa merusak suasana.",
        vi: "Chúng ta có thể khác ý kiến mà không làm hỏng bầu không khí.",
        pronunciation_focus: [
          "KI-ta BI-sa ber-BE-da pen-DA-pat TAN-pa me-RU-sak su-A-sa-na - `berbeda pendapat` = khác ý kiến; `merusak suasana` = làm hỏng không khí.",
          "Lỗi người Việt: `suasana` không chỉ là thời tiết; trong giao tiếp là bầu không khí/tâm trạng chung.",
          "Luyện: `Jangan merusak suasana.`",
        ],
        pronunciation_focus_en: [
          "KI-ta BI-sa ber-BE-da pen-DA-pat TAN-pa me-ROO-sak soo-A-sa-na - `berbeda pendapat` = differ in opinion; `merusak suasana` = spoil the mood.",
          "VN-speaker trap: `suasana` is not only atmosphere/weather; socially it means the mood/vibe.",
          "Drill: `Jangan merusak suasana.`",
        ],
      },
      {
        en: "Kalau boleh tahu, akhir-akhir ini sibuk apa?",
        vi: "Nếu có thể hỏi, dạo này anh/chị bận việc gì?",
        pronunciation_focus: [
          "KA-lau BO-leh TA-hu, A-khir-A-khir I-ni SI-buk A-pa - `kalau boleh tahu` = nếu được hỏi; `akhir-akhir ini` = dạo này.",
          "Lỗi người Việt: hỏi quá trực tiếp về lương, tuổi, gia đình. Câu này mở obrolan ringan an toàn hơn.",
          "Luyện: `Akhir-akhir ini sibuk apa?`",
        ],
        pronunciation_focus_en: [
          "KA-lau BO-leh TA-hoo, A-khir-A-khir I-ni SI-book A-pa - `kalau boleh tahu` = if I may ask; `akhir-akhir ini` = lately.",
          "VN-speaker trap: asking too directly about salary, age, or family. This is safer small talk.",
          "Drill: `Akhir-akhir ini sibuk apa?`",
        ],
      },
      {
        en: "Cuacanya panas sekali ya, tapi sore ini cukup cerah.",
        vi: "Thời tiết nóng thật nhỉ, nhưng chiều nay khá đẹp trời.",
        pronunciation_focus: [
          "cu-A-ca-nya PA-nas se-KA-li ya, TA-pi SO-re I-ni CU-kup CE-rah - `cuaca` = thời tiết; `cerah` = sáng/đẹp trời.",
          "Lỗi người Việt: small talk thời tiết nghe đơn giản nhưng rất an toàn trong tình huống mới gặp.",
          "Luyện: `Cuacanya panas sekali ya.`",
        ],
        pronunciation_focus_en: [
          "choo-A-cha-nya PA-nas se-KA-li ya, TA-pi SO-re I-ni CHOO-kup CHE-rah - `cuaca` = weather; `cerah` = bright/clear.",
          "VN-speaker trap: weather small talk sounds simple, but it is very safe when meeting people.",
          "Drill: `Cuacanya panas sekali ya.`",
        ],
      },
      {
        en: "Makanannya enak, saya jadi ingat masakan rumah.",
        vi: "Món ăn ngon quá, tôi lại nhớ đồ ăn ở nhà.",
        pronunciation_focus: [
          "ma-KA-nan-nya E-nak, SA-ya JA-di I-ngat ma-SA-kan RU-mah - `makanan` = món ăn; `masakan rumah` = đồ ăn nhà nấu.",
          "Lỗi người Việt: khen đồ ăn bằng một từ `enak` rồi dừng. Thêm một câu nhẹ để kéo dài obrolan ringan.",
          "Luyện: `Makanannya enak sekali.`",
        ],
        pronunciation_focus_en: [
          "ma-KA-nan-nya E-nak, SA-ya JA-di I-ngat ma-SA-kan ROO-mah - `makanan` = food; `masakan rumah` = home cooking.",
          "VN-speaker trap: praising food with only `enak` and stopping. Add a light sentence to continue small talk.",
          "Drill: `Makanannya enak sekali.`",
        ],
      },
      {
        en: "Saya bercanda saja, jangan dimasukkan ke hati.",
        vi: "Tôi chỉ đùa thôi, đừng để bụng nhé.",
        pronunciation_focus: [
          "SA-ya ber-CAN-da SA-ja, JA-ngan di-ma-SUK-kan ke HA-ti - `bercanda` = đùa; `dimasukkan ke hati` = để bụng/chấp trong lòng.",
          "Lỗi người Việt: nói đùa rồi không báo hiệu có thể bị hiểu sai. Câu này làm rõ ý và giữ lịch sự.",
          "Luyện: `Saya bercanda saja.`",
        ],
        pronunciation_focus_en: [
          "SA-ya ber-CHAN-da SA-ja, JA-ngan di-ma-SOOK-kan ke HA-ti - `bercanda` = joking; `dimasukkan ke hati` = take it to heart.",
          "VN-speaker trap: joking without signaling it may be misunderstood. This phrase clarifies and stays polite.",
          "Drill: `Saya bercanda saja.`",
        ],
      },
      {
        en: "Topik itu agak sensitif; mungkin kita bahas yang lain saja.",
        vi: "Chủ đề đó hơi nhạy cảm; có lẽ chúng ta nói chuyện khác thôi.",
        pronunciation_focus: [
          "TO-pik I-tu A-gak sen-si-TIF; MUNG-kin KI-ta BA-has yang LA-in SA-ja - `topik sensitif` = chủ đề nhạy cảm; `yang lain saja` = cái khác thôi.",
          "Lỗi người Việt: đổi chủ đề bằng im lặng đột ngột. Câu này chuyển hướng rõ mà vẫn mềm.",
          "Luyện: `Mungkin kita bahas yang lain saja.`",
        ],
        pronunciation_focus_en: [
          "TO-pik I-too A-gak sen-si-TEEF; MOONG-kin KI-ta BA-has yang LA-in SA-ja - `topik sensitif` = sensitive topic; `yang lain saja` = something else instead.",
          "VN-speaker trap: changing topic through sudden silence. This redirects clearly but softly.",
          "Drill: `Mungkin kita bahas yang lain saja.`",
        ],
      },
      {
        en: "Saya tidak terlalu paham soal itu, jadi saya dengarkan dulu.",
        vi: "Tôi không hiểu lắm về chuyện đó, nên tôi nghe trước đã.",
        pronunciation_focus: [
          "SA-ya ti-DAK ter-LA-lu PA-ham so-AL I-tu, JA-di SA-ya de-NGAR-kan DU-lu - `tidak terlalu paham` = không hiểu lắm; `dulu` = trước đã.",
          "Lỗi người Việt: giả vờ biết để giữ mặt. Trong Indonesia, thừa nhận nhẹ nhàng như vậy thường ổn.",
          "Luyện: `Saya dengarkan dulu.`",
        ],
        pronunciation_focus_en: [
          "SA-ya ti-DAK ter-LA-loo PA-ham so-AL I-too, JA-di SA-ya de-NGAR-kan DOO-loo - `tidak terlalu paham` = do not really understand; `dulu` = first/for now.",
          "VN-speaker trap: pretending to know to save face. In Indonesian, a light admission like this is usually fine.",
          "Drill: `Saya dengarkan dulu.`",
        ],
      },
      {
        en: "Setuju tidak setuju, yang penting kita tetap saling menghormati.",
        vi: "Dù đồng ý hay không, điều quan trọng là chúng ta vẫn tôn trọng nhau.",
        pronunciation_focus: [
          "se-TU-ju ti-DAK se-TU-ju, yang PEN-ting KI-ta te-TAP SA-ling meng-hor-MA-ti - `saling menghormati` = tôn trọng lẫn nhau.",
          "Lỗi người Việt: kết thúc bất đồng bằng thắng-thua. Câu này chuyển trọng tâm sang quan hệ và sự tôn trọng.",
          "Luyện: `Yang penting kita saling menghormati.`",
        ],
        pronunciation_focus_en: [
          "se-TOO-joo ti-DAK se-TOO-joo, yang PEN-ting KI-ta te-TAP SA-ling meng-hor-MA-ti - `saling menghormati` = respect each other.",
          "VN-speaker trap: ending disagreement as win-lose. This shifts the focus to relationship and respect.",
          "Drill: `Yang penting kita saling menghormati.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong nhiều bối cảnh Indonesia, giữ `suasana` quan trọng không kém nội dung. Khi không đồng ý, người nói thường công nhận trước (`ide itu menarik`, `saya mengerti maksud Anda`), rồi mới đưa ý kiến mềm (`kurang setuju`, `mungkin lebih baik`). Với obrolan ringan, các chủ đề an toàn thường là thời tiết, đồ ăn, giao thông nhẹ, công việc chung, hobi, hoặc kế hoạch cuối tuần. Nên tránh hỏi quá sớm về lương, chính trị, tôn giáo, hôn nhân, tuổi, hoặc chuyện gia đình riêng tư.",
    cultural_notes_en:
      "In many Indonesian settings, preserving the `suasana` matters as much as the content. When disagreeing, speakers often acknowledge first (`ide itu menarik`, `saya mengerti maksud Anda`) and then offer a softer view (`kurang setuju`, `mungkin lebih baik`). For small talk, safe topics include weather, food, light traffic comments, shared work, hobbies, or weekend plans. Avoid asking too early about salary, politics, religion, marriage, age, or private family matters.",
    tip_advice_vi:
      "Mẹo cho người Việt: khi muốn phản đối, hãy dùng khung 3 bước: công nhận (`Saya mengerti`), làm mềm (`mungkin`, `agak`, `kurang`), rồi đề xuất (`lebih baik kita...`). Khi nói chuyện xã giao, một câu hỏi nhẹ + một nhận xét tích cực thường đủ: `Akhir-akhir ini sibuk apa?` hoặc `Makanannya enak ya.` Đừng cố pha trò nếu chưa chắc mức thân; nếu đùa, thêm `saya bercanda saja`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: when disagreeing, use a three-step frame: acknowledge (`Saya mengerti`), soften (`mungkin`, `agak`, `kurang`), then suggest (`lebih baik kita...`). In small talk, one light question plus one positive comment is usually enough: `Akhir-akhir ini sibuk apa?` or `Makanannya enak ya.` Do not force jokes if you are unsure about closeness; if you joke, add `saya bercanda saja`.",
    vocabulary: [
      { word: "kurang setuju", en: "do not quite agree", vi: "không hẳn đồng ý", pos: "phrase", pronunciation_vi: "KU-rang se-TU-ju", pronunciation_en: "KOO-rang se-TOO-joo" },
      { word: "menurut saya", en: "in my opinion", vi: "theo tôi", pos: "phrase", pronunciation_vi: "me-NU-rut SA-ya", pronunciation_en: "me-NU-root SA-ya" },
      { word: "mungkin lebih baik", en: "maybe it would be better", vi: "có lẽ tốt hơn", pos: "phrase", pronunciation_vi: "MUNG-kin LE-bih BAIK", pronunciation_en: "MOONG-kin LE-bih BAIK" },
      { word: "obrolan ringan", en: "small talk", vi: "chuyện xã giao", pos: "noun phrase", pronunciation_vi: "ob-RO-lan RI-ngan", pronunciation_en: "ob-RO-lan RI-ngan" },
      { word: "menjaga suasana", en: "to keep the mood pleasant", vi: "giữ bầu không khí", pos: "verb phrase", pronunciation_vi: "men-JA-ga su-A-sa-na", pronunciation_en: "men-JA-ga soo-A-sa-na" },
      { word: "bercanda sopan", en: "to joke politely", vi: "đùa lịch sự", pos: "verb phrase", pronunciation_vi: "ber-CAN-da SO-pan", pronunciation_en: "ber-CHAN-da SO-pan" },
      { word: "topik aman", en: "safe topic", vi: "chủ đề an toàn", pos: "noun phrase", pronunciation_vi: "TO-pik A-man", pronunciation_en: "TO-pik A-man" },
      { word: "saling menghormati", en: "to respect each other", vi: "tôn trọng lẫn nhau", pos: "verb phrase", pronunciation_vi: "SA-ling meng-hor-MA-ti", pronunciation_en: "SA-ling meng-hor-MA-ti" },
    ],
    dialogue: [
      {
        speaker: "Nadia",
        text: "Menurut saya, lebih baik rapatnya dimulai jam sembilan.",
        vi: "Theo tôi, tốt hơn là cuộc họp bắt đầu lúc chín giờ.",
        en: "In my opinion, it would be better for the meeting to start at nine.",
      },
      {
        speaker: "Bima",
        text: "Saya mengerti, tapi saya kurang setuju karena beberapa orang datang dari jauh.",
        vi: "Tôi hiểu, nhưng tôi không hẳn đồng ý vì vài người đến từ xa.",
        en: "I understand, but I do not quite agree because some people come from far away.",
      },
      {
        speaker: "Nadia",
        text: "Benar juga. Mungkin lebih baik kita mulai jam setengah sepuluh.",
        vi: "Cũng đúng. Có lẽ tốt hơn là chúng ta bắt đầu lúc chín rưỡi.",
        en: "That's true too. Maybe it is better to start at nine thirty.",
      },
      {
        speaker: "Bima",
        text: "Setuju. Yang penting suasananya tetap enak.",
        vi: "Đồng ý. Quan trọng là bầu không khí vẫn dễ chịu.",
        en: "Agreed. The important thing is that the mood stays pleasant.",
      },
      {
        speaker: "Nadia",
        text: "Ngomong-ngomong, akhir-akhir ini sibuk apa?",
        vi: "Nhân tiện, dạo này anh bận gì?",
        en: "By the way, what have you been busy with lately?",
      },
    ],
    exercises: [
      {
        type: "rewrite",
        instruction_vi: "Viết lại câu trực tiếp thành cách nói mềm và lịch sự hơn.",
        instruction_en: "Rewrite the direct sentence into a softer, more polite version.",
        items: [
          {
            prompt: "Saya tidak setuju.",
            answer: "Saya kurang setuju, tapi saya mengerti maksud Anda.",
          },
          {
            prompt: "Cara ini jelek.",
            answer: "Ide itu menarik, hanya saja mungkin lebih baik kita coba cara lain.",
          },
          {
            prompt: "Jangan bahas itu.",
            answer: "Topik itu agak sensitif; mungkin kita bahas yang lain saja.",
          },
        ],
      },
      {
        type: "safe_topics",
        instruction_vi: "Chọn câu phù hợp cho obrolan ringan an toàn.",
        instruction_en: "Choose the suitable sentence for safe small talk.",
        items: [
          { prompt: "Mở chuyện với người mới gặp", answer: "Cuacanya panas sekali ya." },
          { prompt: "Khen món ăn", answer: "Makanannya enak, saya jadi ingat masakan rumah." },
          { prompt: "Đổi chủ đề nhạy cảm", answer: "Mungkin kita bahas yang lain saja." },
          { prompt: "Làm rõ một câu đùa", answer: "Saya bercanda saja, jangan dimasukkan ke hati." },
        ],
      },
    ],
  },
];

export default lessons;
