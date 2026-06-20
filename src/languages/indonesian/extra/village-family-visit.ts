// Village Family Visit Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for visiting family in a village: pulang
// kampung, staying at relatives' homes, bringing oleh-oleh, family manners,
// talking with elders, and eating together. Indonesian target text lives in
// `en`, Vietnamese glosses in `vi`, Vietnamese L1 notes in
// `pronunciation_focus`, and English companions in `pronunciation_focus_en`.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  /** Indonesian word/phrase. */
  word: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Part of speech. */
  pos: string;
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
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

// Loosely typed so per-type fields (translation, fill_blank, matching) can vary.
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

export const villageFamilyVisitLessons: IndonesianLesson[] = [
  {
    id: "indonesian_village_family_visit",
    level: "A2",
    category: "family_culture",
    title_vi: "Pulang kampung và thăm gia đình ở desa",
    title_en: "Going back to the village and visiting family",
    sentences: [
      {
        en: "Akhir pekan ini kami pulang kampung ke desa orang tua.",
        vi: "Cuối tuần này chúng tôi về quê/làng của cha mẹ.",
        pronunciation_focus: [
          "PU-lang KAM-pung - `pulang kampung` = về quê/về làng gốc gia đình.",
          "`desa orang tua` = làng quê của cha mẹ; `orang tua` ở đây nghĩa là cha mẹ.",
          "Lỗi người Việt: dịch `quê` thành `kampung halaman` trong mọi câu. `Pulang kampung` là cụm rất tự nhiên khi nói về chuyến về quê.",
          "Luyện: `Kami pulang kampung akhir pekan ini.`",
        ],
        pronunciation_focus_en: [
          "POO-lang KAM-poong - `pulang kampung` = go back to one's hometown/village.",
          "`desa orang tua` = parents' village; `orang tua` here means parents.",
          "VN-speaker trap: translating every 'hometown' as `kampung halaman`. `Pulang kampung` is the natural travel-home phrase.",
          "Drill: `Kami pulang kampung akhir pekan ini.`",
        ],
      },
      {
        en: "Kami menginap di rumah saudara selama dua malam.",
        vi: "Chúng tôi ở lại nhà họ hàng trong hai đêm.",
        pronunciation_focus: [
          "me-NGI-nap di RU-mah sau-DA-ra - `menginap` = ngủ lại/ở qua đêm.",
          "`rumah saudara` = nhà họ hàng; `saudara` có thể là anh chị em hoặc họ hàng rộng.",
          "`selama dua malam` = trong hai đêm; `selama` dùng cho khoảng thời gian.",
          "Luyện: `Kami menginap di rumah saudara.`",
        ],
        pronunciation_focus_en: [
          "me-NGI-nap dee ROO-mah sau-DA-ra - `menginap` = stay overnight.",
          "`rumah saudara` = relative's house; `saudara` can mean sibling or extended relative.",
          "`selama dua malam` = for two nights; `selama` marks duration.",
          "Drill: `Kami menginap di rumah saudara.`",
        ],
      },
      {
        en: "Jangan lupa membawa oleh-oleh untuk keluarga di kampung.",
        vi: "Đừng quên mang quà về cho gia đình ở quê.",
        pronunciation_focus: [
          "O-leh O-leh - `oleh-oleh` = quà mang về sau chuyến đi.",
          "`keluarga di kampung` = gia đình/họ hàng ở quê.",
          "Lỗi người Việt: dùng `hadiah` cho mọi loại quà. Khi đi xa mang về cho người nhà, nói `oleh-oleh` tự nhiên hơn.",
          "Luyện: `Bawa oleh-oleh untuk keluarga.`",
        ],
        pronunciation_focus_en: [
          "O-leh O-leh - `oleh-oleh` = gifts/souvenirs brought from a trip.",
          "`keluarga di kampung` = family/relatives in the village.",
          "VN-speaker trap: using `hadiah` for every gift. For gifts brought back from travel, `oleh-oleh` is more natural.",
          "Drill: `Bawa oleh-oleh untuk keluarga.`",
        ],
      },
      {
        en: "Saat masuk rumah, kami salim kepada orang yang lebih tua.",
        vi: "Khi vào nhà, chúng tôi chào kính người lớn tuổi bằng salim.",
        pronunciation_focus: [
          "SA-lim - `salim` = chào kính bằng cách đưa tay người lớn lên trán/môi tùy vùng.",
          "`orang yang lebih tua` = người lớn tuổi hơn; trong gia đình Indonesia rất được tôn trọng.",
          "Lỗi người Việt: chỉ nói `halo` với người lớn tuổi. Trong gia đình, thêm `salim` hoặc lời chào kính trọng sẽ tự nhiên hơn.",
          "Luyện: `Kami salim kepada orang yang lebih tua.`",
        ],
        pronunciation_focus_en: [
          "SA-lim - `salim` = respectful greeting by taking an elder's hand to the forehead/lips depending on region.",
          "`orang yang lebih tua` = older person/elder; highly respected in Indonesian families.",
          "VN-speaker trap: only saying `halo` to elders. In family settings, add `salim` or a respectful greeting.",
          "Drill: `Kami salim kepada orang yang lebih tua.`",
        ],
      },
      {
        en: "Saya harus memanggil tetua keluarga dengan Pak, Bu, atau Mbah.",
        vi: "Tôi nên gọi các bậc cao niên trong gia đình bằng Pak, Bu hoặc Mbah.",
        pronunciation_focus: [
          "TE-tu-a ke-LU-ar-ga - `tetua keluarga` = bậc cao niên/người lớn tuổi có uy tín trong gia đình.",
          "`Mbah` = ông/bà/cụ trong cách gọi Java; dùng nhiều ở một số vùng.",
          "Lỗi người Việt: dùng tên trống với người lớn tuổi. An toàn hơn là `Pak`, `Bu`, `Mbah`, hoặc cách gọi gia đình được chủ nhà dùng.",
          "Luyện: `Saya memanggil beliau Mbah.`",
        ],
        pronunciation_focus_en: [
          "TE-too-a ke-LOO-ar-ga - `tetua keluarga` = family elder.",
          "`Mbah` = grandparent/elder address in Javanese-influenced usage; common in some regions.",
          "VN-speaker trap: using a bare first name for an elder. Safer: `Pak`, `Bu`, `Mbah`, or the family term the host uses.",
          "Drill: `Saya memanggil beliau Mbah.`",
        ],
      },
      {
        en: "Kami ngobrol dengan tetua tentang kabar keluarga.",
        vi: "Chúng tôi trò chuyện với người lớn trong nhà về tin tức gia đình.",
        pronunciation_focus: [
          "NGO-brol de-NGAN TE-tu-a - `ngobrol` = trò chuyện thân mật.",
          "`kabar keluarga` = tin tức/tình hình gia đình; câu hỏi xã giao an toàn.",
          "`dengan` = với; đừng bỏ khi nói chuyện với ai trong câu rõ ràng.",
          "Luyện: `Kami ngobrol tentang kabar keluarga.`",
        ],
        pronunciation_focus_en: [
          "NGO-brol de-NGAN TE-too-a - `ngobrol` = chat casually.",
          "`kabar keluarga` = family news/updates; a safe small-talk topic.",
          "`dengan` = with; do not drop it when saying who you talk with in a clear sentence.",
          "Drill: `Kami ngobrol tentang kabar keluarga.`",
        ],
      },
      {
        en: "Kalau ditawari makan, sebaiknya jawab dengan sopan.",
        vi: "Nếu được mời ăn, tốt nhất nên trả lời lịch sự.",
        pronunciation_focus: [
          "di-TA-war-i MA-kan - `ditawari makan` = được mời ăn; bị động `di-` rất quan trọng.",
          "`sebaiknya` = tốt nhất nên; dùng để cho lời khuyên mềm.",
          "`dengan sopan` = một cách lịch sự; `sopan` trong gia đình gồm lời nói, thái độ và cử chỉ.",
          "Luyện: `Jawab dengan sopan.`",
        ],
        pronunciation_focus_en: [
          "di-TA-war-i MA-kan - `ditawari makan` = be offered food; passive `di-` is important.",
          "`sebaiknya` = it is best to/should; soft advice.",
          "`dengan sopan` = politely; `sopan` in family contexts includes words, attitude, and gestures.",
          "Drill: `Jawab dengan sopan.`",
        ],
      },
      {
        en: "Terima kasih, saya ambil sedikit dulu.",
        vi: "Cảm ơn, tôi lấy một chút trước đã.",
        pronunciation_focus: [
          "`ambil sedikit dulu` = lấy một chút trước; lịch sự khi chưa muốn ăn nhiều.",
          "`dulu` cuối câu = trước đã/tạm thời; làm câu mềm hơn.",
          "Lỗi người Việt: từ chối thẳng `tidak mau` có thể nghe cứng khi chủ nhà mời ăn. Câu mềm hơn là `saya ambil sedikit dulu`.",
          "Luyện: `Saya ambil sedikit dulu.`",
        ],
        pronunciation_focus_en: [
          "`ambil sedikit dulu` = take a little first; polite when you do not want much yet.",
          "Sentence-final `dulu` = first/for now; softens the sentence.",
          "VN-speaker trap: blunt `tidak mau` can sound hard when a host offers food. Softer: `saya ambil sedikit dulu`.",
          "Drill: `Saya ambil sedikit dulu.`",
        ],
      },
      {
        en: "Makan bersama biasanya menunggu semua orang duduk.",
        vi: "Ăn cùng nhau thường chờ mọi người ngồi đủ.",
        pronunciation_focus: [
          "MA-kan ber-SA-ma - `makan bersama` = ăn cùng nhau.",
          "`menunggu semua orang duduk` = chờ mọi người ngồi; nhấn mạnh phép lịch sự trong bữa ăn.",
          "Lỗi người Việt: tự bắt đầu ăn quá nhanh. Khi ở nhà họ hàng, hãy quan sát chủ nhà hoặc người lớn trước.",
          "Luyện: `Kami makan bersama.`",
        ],
        pronunciation_focus_en: [
          "MA-kan ber-SA-ma - `makan bersama` = eat together.",
          "`menunggu semua orang duduk` = wait until everyone sits; emphasizes table manners.",
          "VN-speaker trap: starting to eat too quickly. At a relative's house, watch the host or elders first.",
          "Drill: `Kami makan bersama.`",
        ],
      },
      {
        en: "Sebelum pulang, kami pamit kepada tuan rumah.",
        vi: "Trước khi về, chúng tôi chào xin phép chủ nhà.",
        pronunciation_focus: [
          "PA-mit ke-PA-da TU-an RU-mah - `pamit` = chào xin phép trước khi đi.",
          "`tuan rumah` = chủ nhà/người tiếp đón; không nhất thiết là chủ sở hữu nhà.",
          "Lỗi người Việt: chỉ nói `bye` rồi đi. Trong văn hóa Indonesia, `pamit` trước khi về rất quan trọng.",
          "Luyện: `Kami pamit kepada tuan rumah.`",
        ],
        pronunciation_focus_en: [
          "PA-mit ke-PA-da TOO-an ROO-mah - `pamit` = take leave respectfully before leaving.",
          "`tuan rumah` = host; not necessarily the legal owner of the house.",
          "VN-speaker trap: only saying `bye` and leaving. In Indonesian culture, `pamit` before going home matters.",
          "Drill: `Kami pamit kepada tuan rumah.`",
        ],
      },
    ],
    cultural_notes_vi:
      "`Pulang kampung` là trải nghiệm gia đình rất quen thuộc ở Indonesia, nhất là dịp Lebaran, đám cưới, nghỉ dài, hoặc khi thăm orang tua. Khi ở `rumah saudara`, khách thường mang `oleh-oleh`, chào người lớn tuổi trước, dùng cách xưng hô kính trọng như Pak/Bu/Mbah, và `pamit` trước khi về. Bữa `makan bersama` không chỉ là ăn mà còn là lúc hỏi thăm kabar keluarga, nghe chuyện tetua, và thể hiện sopan santun.",
    cultural_notes_en:
      "`Pulang kampung` is a very familiar family experience in Indonesia, especially around Lebaran, weddings, long holidays, or visiting parents. When staying at a relative's house, guests often bring `oleh-oleh`, greet elders first, use respectful address like Pak/Bu/Mbah, and `pamit` before leaving. `Makan bersama` is not only eating; it is also a time to ask about family news, listen to elders, and show good manners.",
    tip_advice_vi:
      "Mẹo cho người Việt: bản năng kính trọng người lớn trong tiếng Việt chuyển rất tốt sang Indonesia. Dùng `Pak`, `Bu`, `Mbah`, `beliau`, `pamit`, `permisi`, `terima kasih`, và tránh gọi tên trống với tetua. Khi được mời ăn mà chưa muốn nhiều, đừng từ chối cộc; nói `Terima kasih, saya ambil sedikit dulu` rất mềm và an toàn.",
    tip_advice_en:
      "Tip for Vietnamese speakers: Vietnamese elder-respect instincts transfer well into Indonesian. Use `Pak`, `Bu`, `Mbah`, `beliau`, `pamit`, `permisi`, `terima kasih`, and avoid bare first names with elders. When offered food but you do not want much, avoid a blunt refusal; `Terima kasih, saya ambil sedikit dulu` is soft and safe.",
    vocabulary: [
      {
        word: "pulang kampung",
        en: "go back to one's hometown/village",
        vi: "về quê",
        pos: "verb phrase",
        pronunciation_vi: "PU-lang KAM-pung",
        pronunciation_en: "POO-lang KAM-poong",
      },
      {
        word: "rumah saudara",
        en: "relative's house",
        vi: "nhà họ hàng",
        pos: "noun phrase",
        pronunciation_vi: "RU-mah sau-DA-ra",
        pronunciation_en: "ROO-mah sau-DA-ra",
      },
      {
        word: "oleh-oleh",
        en: "souvenir / gift brought back",
        vi: "quà mang về",
        pos: "noun",
        pronunciation_vi: "O-leh O-leh",
        pronunciation_en: "O-leh O-leh",
      },
      {
        word: "sopan santun keluarga",
        en: "family manners",
        vi: "phép lịch sự trong gia đình",
        pos: "noun phrase",
        pronunciation_vi: "SO-pan SAN-tun ke-LU-ar-ga",
        pronunciation_en: "SO-pan SAN-toon ke-LOO-ar-ga",
      },
      {
        word: "tetua",
        en: "elder",
        vi: "bậc cao niên / người lớn tuổi",
        pos: "noun",
        pronunciation_vi: "TE-tu-a",
        pronunciation_en: "TE-too-a",
      },
      {
        word: "ngobrol",
        en: "chat casually",
        vi: "trò chuyện",
        pos: "verb",
        pronunciation_vi: "NGO-brol",
        pronunciation_en: "NGO-brol",
      },
      {
        word: "makan bersama",
        en: "eat together",
        vi: "ăn cùng nhau",
        pos: "verb phrase",
        pronunciation_vi: "MA-kan ber-SA-ma",
        pronunciation_en: "MA-kan ber-SA-ma",
      },
      {
        word: "salim",
        en: "respectful hand greeting to elders",
        vi: "chào kính người lớn bằng tay",
        pos: "verb / noun",
        pronunciation_vi: "SA-lim",
        pronunciation_en: "SA-lim",
      },
      {
        word: "tuan rumah",
        en: "host",
        vi: "chủ nhà / người tiếp đón",
        pos: "noun phrase",
        pronunciation_vi: "TU-an RU-mah",
        pronunciation_en: "TOO-an ROO-mah",
      },
      {
        word: "pamit",
        en: "take leave respectfully",
        vi: "chào xin phép trước khi đi",
        pos: "verb",
        pronunciation_vi: "PA-mit",
        pronunciation_en: "PA-mit",
      },
    ],
    dialogue: [
      {
        speaker: "Tamu",
        text: "Assalamualaikum, Bu. Kami baru sampai dari kota.",
        vi: "Chào cô. Chúng cháu vừa đến từ thành phố.",
        en: "Peace be upon you, ma'am. We just arrived from the city.",
      },
      {
        speaker: "Tuan Rumah",
        text: "Waalaikumsalam. Silakan masuk, Nak. Sudah lama tidak pulang kampung.",
        vi: "Chào cháu. Mời vào, con. Lâu rồi không về quê.",
        en: "And peace be upon you. Please come in, child. It has been a long time since you came home to the village.",
      },
      {
        speaker: "Tamu",
        text: "Ini ada oleh-oleh sedikit untuk keluarga.",
        vi: "Đây có chút quà mang về cho gia đình.",
        en: "Here are some small gifts for the family.",
      },
      {
        speaker: "Tuan Rumah",
        text: "Terima kasih. Nanti kita makan bersama setelah semua saudara datang.",
        vi: "Cảm ơn. Lát nữa chúng ta ăn cùng nhau sau khi họ hàng đến đủ.",
        en: "Thank you. Later we will eat together after all the relatives arrive.",
      },
      {
        speaker: "Tamu",
        text: "Baik, Bu. Sebelum pulang nanti, kami pamit dulu kepada tetua keluarga.",
        vi: "Vâng cô. Trước khi về lát nữa, chúng cháu sẽ chào xin phép các bậc cao niên trước.",
        en: "Yes, ma'am. Before leaving later, we will take leave from the family elders first.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm từ gia đình/làng quê còn thiếu:",
        instruction_en: "Fill in the missing family/village phrase:",
        items: [
          {
            prompt: "Akhir pekan ini kami pulang ___ ke desa orang tua.",
            answer: "kampung",
            options: ["kampung", "kantor", "kamar"],
          },
          {
            prompt: "Jangan lupa membawa ___ untuk keluarga.",
            answer: "oleh-oleh",
            options: ["oleh-oleh", "obat", "ongkos"],
          },
          {
            prompt: "Sebelum pulang, kami ___ kepada tuan rumah.",
            answer: "pamit",
            options: ["pamit", "parkir", "panas"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ Indonesia với nghĩa tiếng Việt:",
        instruction_en: "Match the Indonesian phrase with its Vietnamese meaning:",
        items: [
          { prompt: "pulang kampung", answer: "về quê" },
          { prompt: "rumah saudara", answer: "nhà họ hàng" },
          { prompt: "tetua", answer: "bậc cao niên" },
          { prompt: "makan bersama", answer: "ăn cùng nhau" },
          { prompt: "tuan rumah", answer: "chủ nhà / người tiếp đón" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          {
            prompt: "Cuối tuần này chúng tôi về quê.",
            answer: "Akhir pekan ini kami pulang kampung.",
          },
          {
            prompt: "Chúng tôi ở lại nhà họ hàng trong hai đêm.",
            answer: "Kami menginap di rumah saudara selama dua malam.",
          },
          {
            prompt: "Trước khi về, chúng tôi chào xin phép chủ nhà.",
            answer: "Sebelum pulang, kami pamit kepada tuan rumah.",
          },
        ],
      },
    ],
  },
];

export default villageFamilyVisitLessons;
