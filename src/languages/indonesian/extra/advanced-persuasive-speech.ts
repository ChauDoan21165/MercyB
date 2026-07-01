// Advanced Persuasive Speech Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// persuasive-speaking notes with English companions in pronunciation_focus_en.

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
    id: "indonesian_advanced_persuasive_speech",
    level: "B2",
    category: "formal_speaking",
    title_vi: "Bài phát biểu thuyết phục nâng cao",
    title_en: "Advanced persuasive speech",
    sentences: [
      {
        en: "Hadirin sekalian, hari ini saya ingin mengajak kita melihat masalah ini dengan lebih serius.",
        vi: "Kính thưa quý vị, hôm nay tôi muốn mời chúng ta nhìn vấn đề này nghiêm túc hơn.",
        pronunciation_focus: [
          "ha-DI-rin se-KA-li-an, HA-ri I-ni SA-ya I-ngin meng-A-jak KI-ta me-LI-hat MA-sa-lah I-ni de-NGAN LE-bih se-RI-us - `mengajak kita` = mời/kêu gọi chúng ta.",
          "Lỗi người Việt: mở pidato persuasif bằng `saya mau bilang`. `Saya ingin mengajak...` nghe trang trọng và thuyết phục hơn.",
          "Luyện: `Saya ingin mengajak kita...`",
        ],
        pronunciation_focus_en: [
          "ha-DEE-rin se-KA-li-an, HA-ri I-ni SA-ya EE-ngin meng-A-jak KI-ta me-LI-hat MA-sa-lah I-ni de-NGAN LE-bih se-RI-us - `mengajak kita` = invite/urge us.",
          "VN-speaker trap: opening a persuasive speech with `saya mau bilang`. `Saya ingin mengajak...` sounds more formal and persuasive.",
          "Drill: `Saya ingin mengajak kita...`",
        ],
      },
      {
        en: "Pidato persuasif bukan hanya menyampaikan pendapat, tetapi juga membangun keyakinan audiens.",
        vi: "Bài phát biểu thuyết phục không chỉ truyền đạt ý kiến, mà còn xây dựng niềm tin của khán giả.",
        pronunciation_focus: [
          "pi-DA-to per-su-a-SIF BU-kan HA-nya me-nyam-PAI-kan pen-DA-pat, te-TA-pi JU-ga mem-BA-ngun ke-ya-KIN-an AU-di-ens - `keyakinan audiens` = niềm tin của khán giả.",
          "Lỗi người Việt: dịch `persuasive` bằng tiếng Anh trong bài nói. Từ Indonesia tự nhiên là `persuasif`.",
          "Luyện: `Membangun keyakinan audiens.`",
        ],
        pronunciation_focus_en: [
          "pi-DA-to per-su-a-SIF BOO-kan HA-nya me-nyam-PAI-kan pen-DA-pat, te-TA-pi JOO-ga mem-BA-ngun ke-ya-KIN-an AU-di-ens - `keyakinan audiens` = audience confidence/belief.",
          "VN-speaker trap: keeping English `persuasive` in a speech. Indonesian naturally uses `persuasif`.",
          "Drill: `Membangun keyakinan audiens.`",
        ],
      },
      {
        en: "Alasan kuat pertama adalah manfaatnya dapat dirasakan langsung oleh masyarakat.",
        vi: "Lý do mạnh đầu tiên là lợi ích của nó có thể được người dân cảm nhận trực tiếp.",
        pronunciation_focus: [
          "a-LA-san KU-at per-TA-ma A-da-lah man-FA-at-nya DA-pat di-RA-sa-kan LANG-sung O-leh ma-sya-ra-KAT - `alasan kuat` = lý do mạnh; `dirasakan langsung` = được cảm nhận trực tiếp.",
          "Lỗi người Việt: liệt kê lý do bằng `satu, dua`. Trong pidato, `alasan kuat pertama` nghe rõ và thuyết phục hơn.",
          "Luyện: `Alasan kuat pertama adalah...`",
        ],
        pronunciation_focus_en: [
          "a-LA-san KOO-at per-TA-ma A-da-lah man-FA-at-nya DA-pat di-RA-sa-kan LANG-soong O-leh ma-sya-ra-KAT - `alasan kuat` = strong reason; `dirasakan langsung` = directly felt.",
          "VN-speaker trap: listing reasons with bare `satu, dua`. In speeches, `alasan kuat pertama` sounds clearer and more persuasive.",
          "Drill: `Alasan kuat pertama adalah...`",
        ],
      },
      {
        en: "Sebagai contoh nyata, banyak warga sudah merasakan perubahan setelah program ini berjalan.",
        vi: "Như một ví dụ thực tế, nhiều người dân đã cảm nhận sự thay đổi sau khi chương trình này vận hành.",
        pronunciation_focus: [
          "se-BA-gai CON-toh NYA-ta, BA-nyak WAR-ga SU-dah me-RA-sa-kan pe-ru-BA-han se-TE-lah PRO-gram I-ni ber-JA-lan - `contoh nyata` = ví dụ thực tế.",
          "Lỗi người Việt: nói `contoh real` trong pidato. Cụm tự nhiên và trang trọng là `contoh nyata`.",
          "Luyện: `Sebagai contoh nyata...`",
        ],
        pronunciation_focus_en: [
          "se-BA-gai CHON-toh NYA-ta, BA-nyak WAR-ga SOO-dah me-RA-sa-kan pe-roo-BA-han se-TE-lah PRO-gram I-ni ber-JA-lan - `contoh nyata` = real/concrete example.",
          "VN-speaker trap: saying `contoh real` in a speech. Natural formal phrase: `contoh nyata`.",
          "Drill: `Sebagai contoh nyata...`",
        ],
      },
      {
        en: "Jika kita menunda tindakan, masalah ini akan semakin sulit diselesaikan.",
        vi: "Nếu chúng ta trì hoãn hành động, vấn đề này sẽ ngày càng khó giải quyết.",
        pronunciation_focus: [
          "JI-ka KI-ta me-NUN-da tin-DAK-an, MA-sa-lah I-ni A-kan se-MA-kin SU-lit di-se-le-SAI-kan - `menunda tindakan` = trì hoãn hành động; `semakin sulit` = ngày càng khó.",
          "Lỗi người Việt: dùng `delay aksi` trong văn trang trọng. Dùng `menunda tindakan`.",
          "Luyện: `Jangan menunda tindakan.`",
        ],
        pronunciation_focus_en: [
          "JI-ka KI-ta me-NOON-da tin-DAK-an, MA-sa-lah I-ni A-kan se-MA-kin SOO-lit di-se-le-SAI-kan - `menunda tindakan` = delay action; `semakin sulit` = increasingly difficult.",
          "VN-speaker trap: saying `delay aksi` in formal speech. Use `menunda tindakan`.",
          "Drill: `Jangan menunda tindakan.`",
        ],
      },
      {
        en: "Oleh karena itu, saya mengajak hadirin untuk mengambil bagian mulai hari ini.",
        vi: "Vì vậy, tôi kêu gọi quý vị tham gia bắt đầu từ hôm nay.",
        pronunciation_focus: [
          "O-leh ka-RE-na I-tu, SA-ya meng-A-jak ha-DI-rin UN-tuk me-NGAM-bil BA-gi-an mu-LAI HA-ri I-ni - `mengambil bagian` = tham gia/góp phần.",
          "Lỗi người Việt: dịch `take part` là `ambil part`. Cụm Indonesia chuẩn là `mengambil bagian`.",
          "Luyện: `Mari mengambil bagian.`",
        ],
        pronunciation_focus_en: [
          "O-leh ka-RE-na I-too, SA-ya meng-A-jak ha-DEE-rin UN-tuk me-NGAM-bil BA-gi-an moo-LAI HA-ri I-ni - `mengambil bagian` = take part.",
          "VN-speaker trap: translating 'take part' as `ambil part`. Standard Indonesian: `mengambil bagian`.",
          "Drill: `Mari mengambil bagian.`",
        ],
      },
      {
        en: "Ajakan bertindak harus jelas, singkat, dan bisa dilakukan.",
        vi: "Lời kêu gọi hành động phải rõ ràng, ngắn gọn, và có thể thực hiện được.",
        pronunciation_focus: [
          "a-JAK-an ber-TIN-dak HA-rus JE-las, SING-kat, dan BI-sa di-la-KU-kan - `ajakan bertindak` = lời kêu gọi hành động.",
          "Lỗi người Việt: kết bài bằng lời kêu gọi mơ hồ. `Ajakan bertindak` nên nói rõ người nghe cần làm gì.",
          "Luyện: `Ajakan bertindak harus jelas.`",
        ],
        pronunciation_focus_en: [
          "a-JAK-an ber-TIN-dak HA-roos JE-las, SING-kat, dan BI-sa di-la-KOO-kan - `ajakan bertindak` = call to action.",
          "VN-speaker trap: ending with a vague call. `Ajakan bertindak` should clearly say what listeners should do.",
          "Drill: `Ajakan bertindak harus jelas.`",
        ],
      },
      {
        en: "Nada meyakinkan tidak berarti harus keras; yang penting tegas dan sopan.",
        vi: "Giọng điệu thuyết phục không có nghĩa là phải lớn tiếng; điều quan trọng là dứt khoát và lịch sự.",
        pronunciation_focus: [
          "NA-da me-ya-KIN-kan ti-DAK ber-AR-ti HA-rus KE-ras; yang PEN-ting te-GAS dan SO-pan - `nada meyakinkan` = giọng điệu thuyết phục; `tegas` = dứt khoát.",
          "Lỗi người Việt: tưởng nói thuyết phục là nói to. Trong Indonesia, `tegas dan sopan` thường hiệu quả hơn.",
          "Luyện: `Tegas dan sopan.`",
        ],
        pronunciation_focus_en: [
          "NA-da me-ya-KIN-kan ti-DAK ber-AR-ti HA-roos KE-ras; yang PEN-ting te-GAS dan SO-pan - `nada meyakinkan` = convincing tone; `tegas` = firm.",
          "VN-speaker trap: thinking persuasion means speaking loudly. In Indonesian, `tegas dan sopan` is often more effective.",
          "Drill: `Tegas dan sopan.`",
        ],
      },
      {
        en: "Kita tidak hanya membutuhkan niat baik, tetapi juga langkah nyata.",
        vi: "Chúng ta không chỉ cần ý định tốt, mà còn cần bước đi cụ thể.",
        pronunciation_focus: [
          "KI-ta ti-DAK HA-nya mem-bu-TUH-kan ni-AT BAIK, te-TA-pi JU-ga LANG-kah NYA-ta - `niat baik` = ý định tốt; `langkah nyata` = bước đi cụ thể.",
          "Lỗi người Việt: dùng `aksi nyata` được hiểu, nhưng `langkah nyata` tự nhiên hơn trong pidato formal.",
          "Luyện: `Butuh langkah nyata.`",
        ],
        pronunciation_focus_en: [
          "KI-ta ti-DAK HA-nya mem-boo-TOOH-kan ni-AT BAIK, te-TA-pi JOO-ga LANG-kah NYA-ta - `niat baik` = good intention; `langkah nyata` = concrete step.",
          "VN-speaker trap: `aksi nyata` is understood, but `langkah nyata` is more natural in formal speech.",
          "Drill: `Butuh langkah nyata.`",
        ],
      },
      {
        en: "Bayangkan dampaknya jika setiap orang berkontribusi sedikit saja.",
        vi: "Hãy tưởng tượng tác động nếu mỗi người chỉ đóng góp một chút thôi.",
        pronunciation_focus: [
          "BA-yang-kan DAM-pak-nya JI-ka SE-ti-ap O-rang ber-kon-tri-BU-si se-DI-kit SA-ja - `bayangkan` = hãy tưởng tượng; `berkontribusi` = đóng góp.",
          "Lỗi người Việt: dùng `imagine` trong pidato. `Bayangkan...` là cách mở hình ảnh rất mạnh.",
          "Luyện: `Bayangkan dampaknya.`",
        ],
        pronunciation_focus_en: [
          "BA-yang-kan DAM-pak-nya JI-ka SE-ti-ap O-rang ber-kon-tri-BOO-si se-DEE-kit SA-ja - `bayangkan` = imagine; `berkontribusi` = contribute.",
          "VN-speaker trap: using English `imagine` in a speech. `Bayangkan...` is a strong imagery opener.",
          "Drill: `Bayangkan dampaknya.`",
        ],
      },
      {
        en: "Saya percaya perubahan besar selalu dimulai dari keputusan kecil yang konsisten.",
        vi: "Tôi tin rằng thay đổi lớn luôn bắt đầu từ những quyết định nhỏ nhưng nhất quán.",
        pronunciation_focus: [
          "SA-ya per-CA-ya pe-ru-BA-han BE-sar se-LA-lu di-MU-lai da-ri ke-pu-TUS-an KE-cil yang kon-SIS-ten - `saya percaya` = tôi tin; `konsisten` = nhất quán.",
          "Lỗi người Việt: dùng `menurut saya` cho mọi câu. Trong pidato persuasif, `saya percaya` mạnh hơn và tự nhiên hơn.",
          "Luyện: `Saya percaya perubahan bisa dimulai.`",
        ],
        pronunciation_focus_en: [
          "SA-ya per-CHA-ya pe-roo-BA-han BE-sar se-LA-loo di-MOO-lai da-ri ke-poo-TOOS-an KE-chil yang kon-SIS-ten - `saya percaya` = I believe; `konsisten` = consistent.",
          "VN-speaker trap: using `menurut saya` for every statement. In persuasive speech, `saya percaya` is stronger and natural.",
          "Drill: `Saya percaya perubahan bisa dimulai.`",
        ],
      },
      {
        en: "Mari kita mulai dari hal sederhana: hadir, peduli, dan bertindak.",
        vi: "Chúng ta hãy bắt đầu từ điều đơn giản: có mặt, quan tâm, và hành động.",
        pronunciation_focus: [
          "MA-ri KI-ta mu-LAI da-ri HAL se-der-HA-na: HA-dir, pe-DU-li, dan ber-TIN-dak - `mari kita` = chúng ta hãy; `peduli` = quan tâm.",
          "Lỗi người Việt: kết thúc quá dài làm mất lực. Ba động từ ngắn như `hadir, peduli, bertindak` tạo penutup kuat.",
          "Luyện: `Hadir, peduli, dan bertindak.`",
        ],
        pronunciation_focus_en: [
          "MA-ri KI-ta moo-LAI da-ri HAL se-der-HA-na: HA-dir, pe-DOO-li, dan ber-TIN-dak - `mari kita` = let us; `peduli` = care.",
          "VN-speaker trap: ending too long weakens the impact. Three short verbs like `hadir, peduli, bertindak` create a strong close.",
          "Drill: `Hadir, peduli, dan bertindak.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Pidato persuasif Indonesia thường kết hợp giọng trang trọng với sự gần gũi: mở bằng sapaan hadirin, nêu masalah, đưa alasan kuat, contoh nyata, lalu ajakan bertindak. Người nghe thường phản ứng tốt với giọng `tegas dan sopan`, không quá ra lệnh. Câu như `saya mengajak`, `mari kita`, `bayangkan`, và `saya percaya` giúp bài nói có sức thuyết phục mà vẫn giữ sự lịch sự.",
    cultural_notes_en:
      "Indonesian persuasive speeches often combine formal tone with closeness: greet the audience, state the problem, give strong reasons, provide concrete examples, then make a call to action. Listeners often respond well to a `tegas dan sopan` tone, not an overly commanding one. Phrases like `saya mengajak`, `mari kita`, `bayangkan`, and `saya percaya` make the speech persuasive while still polite.",
    tip_advice_vi:
      "Mẹo cho người Việt: xây bài theo khung 5 phần: sapaan -> masalah -> alasan kuat -> contoh nyata -> ajakan bertindak. Đừng chỉ nói `harus`; hãy dẫn người nghe bằng `mari kita`, `saya mengajak`, và `bayangkan`. Penutup kuat nên ngắn, có nhịp, và nêu hành động cụ thể.",
    tip_advice_en:
      "Tip for Vietnamese speakers: build the speech in five parts: greeting -> problem -> strong reason -> concrete example -> call to action. Do not only say `harus`; guide listeners with `mari kita`, `saya mengajak`, and `bayangkan`. A strong closing should be short, rhythmic, and name a concrete action.",
    vocabulary: [
      { word: "pidato persuasif", en: "persuasive speech", vi: "bài phát biểu thuyết phục", pos: "noun phrase", pronunciation_vi: "pi-DA-to per-su-a-SIF", pronunciation_en: "pi-DA-to per-su-a-SIF" },
      { word: "mengajak audiens", en: "to invite/urge the audience", vi: "kêu gọi khán giả", pos: "verb phrase", pronunciation_vi: "meng-A-jak AU-di-ens", pronunciation_en: "meng-A-jak AU-di-ens" },
      { word: "alasan kuat", en: "strong reason", vi: "lý do mạnh", pos: "noun phrase", pronunciation_vi: "a-LA-san KU-at", pronunciation_en: "a-LA-san KOO-at" },
      { word: "contoh nyata", en: "concrete example", vi: "ví dụ thực tế", pos: "noun phrase", pronunciation_vi: "CON-toh NYA-ta", pronunciation_en: "CHON-toh NYA-ta" },
      { word: "ajakan bertindak", en: "call to action", vi: "lời kêu gọi hành động", pos: "noun phrase", pronunciation_vi: "a-JAK-an ber-TIN-dak", pronunciation_en: "a-JAK-an ber-TIN-dak" },
      { word: "nada meyakinkan", en: "convincing tone", vi: "giọng điệu thuyết phục", pos: "noun phrase", pronunciation_vi: "NA-da me-ya-KIN-kan", pronunciation_en: "NA-da me-ya-KIN-kan" },
      { word: "penutup kuat", en: "strong closing", vi: "kết bài mạnh", pos: "noun phrase", pronunciation_vi: "pe-NU-tup KU-at", pronunciation_en: "pe-NOO-toop KOO-at" },
      { word: "langkah nyata", en: "concrete step", vi: "bước đi cụ thể", pos: "noun phrase", pronunciation_vi: "LANG-kah NYA-ta", pronunciation_en: "LANG-kah NYA-ta" },
    ],
    dialogue: [
      {
        speaker: "Pelatih",
        text: "Apa tujuan utama pidato persuasifmu?",
        vi: "Mục tiêu chính của bài phát biểu thuyết phục của em là gì?",
        en: "What is the main goal of your persuasive speech?",
      },
      {
        speaker: "Siswa",
        text: "Saya ingin mengajak audiens untuk mengurangi sampah plastik.",
        vi: "Em muốn kêu gọi khán giả giảm rác thải nhựa.",
        en: "I want to urge the audience to reduce plastic waste.",
      },
      {
        speaker: "Pelatih",
        text: "Bagus. Berikan alasan kuat dan contoh nyata.",
        vi: "Tốt. Hãy đưa ra lý do mạnh và ví dụ thực tế.",
        en: "Good. Give a strong reason and a concrete example.",
      },
      {
        speaker: "Siswa",
        text: "Saya akan menjelaskan dampaknya pada sungai dan memberi contoh dari lingkungan sekolah.",
        vi: "Em sẽ giải thích tác động của nó lên sông và đưa ví dụ từ môi trường trường học.",
        en: "I will explain its impact on rivers and give an example from the school environment.",
      },
      {
        speaker: "Pelatih",
        text: "Akhiri dengan ajakan bertindak yang singkat dan jelas.",
        vi: "Hãy kết thúc bằng lời kêu gọi hành động ngắn gọn và rõ ràng.",
        en: "End with a short and clear call to action.",
      },
    ],
    exercises: [
      {
        type: "speech_structure",
        instruction_vi: "Sắp xếp các phần của pidato persuasif theo thứ tự hợp lý.",
        instruction_en: "Arrange the parts of a persuasive speech in a logical order.",
        items: [
          { prompt: "1", answer: "sapaan dan pembuka" },
          { prompt: "2", answer: "masalah utama" },
          { prompt: "3", answer: "alasan kuat dan contoh nyata" },
          { prompt: "4", answer: "ajakan bertindak" },
          { prompt: "5", answer: "penutup kuat" },
        ],
      },
      {
        type: "rewrite",
        instruction_vi: "Viết lại câu thường thành câu pidato persuasif tự nhiên hơn.",
        instruction_en: "Rewrite the plain sentence into more natural persuasive-speech Indonesian.",
        items: [
          {
            prompt: "Kita harus melakukan sesuatu.",
            answer: "Mari kita mulai dari hal sederhana: hadir, peduli, dan bertindak.",
          },
          {
            prompt: "Ini penting karena bagus.",
            answer: "Alasan kuat pertama adalah manfaatnya dapat dirasakan langsung oleh masyarakat.",
          },
          {
            prompt: "Saya mau kalian ikut.",
            answer: "Saya mengajak hadirin untuk mengambil bagian mulai hari ini.",
          },
        ],
      },
    ],
  },
];

export default lessons;
