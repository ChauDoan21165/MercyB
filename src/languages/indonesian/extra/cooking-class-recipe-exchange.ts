// Cooking class and recipe exchange Indonesian (Vietnamese -> Indonesian study track).
//
// A2 Wave 24 file. Covers kelas memasak, resep, bahan, takaran, cara mengiris,
// mencicipi, bumbu kurang, and tukar resep.
// Self-contained so no registry or sibling agent files are touched.
//
// Field convention: sentence `en` holds the target Indonesian line, `vi` holds
// the Vietnamese gloss. `pronunciation_focus` carries Vietnamese-facing notes
// and common L1 traps; `pronunciation_focus_en` mirrors the same order for
// English-speaking companions.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length and order. */
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
    id: "indonesian_cooking_class_recipe_exchange",
    level: "A2",
    category: "food",
    title_vi: "Lớp nấu ăn và trao đổi công thức",
    title_en: "Cooking class and recipe exchange",
    sentences: [
      {
        en: "Saya ikut kelas memasak masakan Indonesia.",
        vi: "Tôi tham gia lớp nấu món Indonesia.",
        pronunciation_focus: [
          "SA-ya I-kut KE-las me-MA-sak ma-SA-kan in-do-NE-sia - `kelas memasak` = lớp nấu ăn; `masakan Indonesia` = món ăn/ẩm thực Indonesia.",
          "`ikut kelas` tự nhiên hơn `masuk kelas` khi nói tham gia một khóa/lớp.",
          "Lỗi người Việt: nhầm `memasak` và `masakan`. `Memasak` = nấu; `masakan` = món ăn/ẩm thực.",
        ],
        pronunciation_focus_en: [
          "SA-ya I-kut KE-las me-MA-sak ma-SA-kan in-do-NE-sia - `kelas memasak` = cooking class; `masakan Indonesia` = Indonesian dishes/cuisine.",
          "`ikut kelas` is more natural than `masuk kelas` when joining a class/course.",
          "VN-speaker trap: mixing up `memasak` and `masakan`. `Memasak` = cook; `masakan` = dish/cuisine.",
        ],
      },
      {
        en: "Boleh saya lihat resepnya dulu?",
        vi: "Tôi xem công thức trước được không?",
        pronunciation_focus: [
          "BO-leh SA-ya LI-hat RE-sep-nya DU-lu - `resep` = công thức nấu ăn; `dulu` = trước.",
          "`-nya` trong `resepnya` chỉ công thức đang nói tới, không nhất thiết là 'của anh/chị ấy'.",
          "Lỗi người Việt: dùng English `recipe`. Trong tiếng Indonesia nói `resep`.",
        ],
        pronunciation_focus_en: [
          "BO-leh SA-ya LEE-hat RE-sep-nya DOO-loo - `resep` = recipe; `dulu` = first.",
          "`-nya` in `resepnya` points to the recipe being discussed, not necessarily 'his/her recipe'.",
          "VN-speaker trap: using English `recipe`. In Indonesian, say `resep`.",
        ],
      },
      {
        en: "Bahan utama untuk masakan ini apa saja?",
        vi: "Nguyên liệu chính cho món này gồm những gì?",
        pronunciation_focus: [
          "BA-han u-TA-ma UN-tuk ma-SA-kan I-ni A-pa SA-ja - `bahan utama` = nguyên liệu chính; `apa saja` = những gì.",
          "`apa saja` hỏi danh sách nhiều thứ. Câu này tự nhiên khi hỏi nguyên liệu.",
          "Lỗi người Việt: nói `bahan apa?` được, nhưng `apa saja` rõ hơn vì thường có nhiều nguyên liệu.",
        ],
        pronunciation_focus_en: [
          "BA-han oo-TA-ma OON-took ma-SA-kan EE-nee A-pa SA-ja - `bahan utama` = main ingredients; `apa saja` = what items.",
          "`apa saja` asks for a list. This is natural when asking about ingredients.",
          "VN-speaker note: `bahan apa?` works, but `apa saja` is clearer because recipes usually have multiple ingredients.",
        ],
      },
      {
        en: "Takaran garamnya satu sendok teh saja.",
        vi: "Lượng muối chỉ một muỗng cà phê thôi.",
        pronunciation_focus: [
          "ta-KA-ran GA-ram-nya SA-tu SEN-dok TEH SA-ja - `takaran` = lượng/định lượng; `sendok teh` = muỗng cà phê.",
          "`saja` ở cuối làm nghĩa 'chỉ/thôi'. Dùng khi muốn nhấn lượng nhỏ.",
          "Lỗi người Việt: dịch 'muỗng cà phê' thành `sendok kopi`. Định lượng chuẩn là `sendok teh`.",
        ],
        pronunciation_focus_en: [
          "ta-KA-ran GA-ram-nya SA-too SEN-dok TEH SA-ja - `takaran` = measurement/amount; `sendok teh` = teaspoon.",
          "`saja` at the end means 'only/just'. Use it to emphasize a small amount.",
          "VN-speaker trap: translating teaspoon as `sendok kopi`. The measurement is `sendok teh`.",
        ],
      },
      {
        en: "Bagaimana cara mengiris bawang supaya tipis?",
        vi: "Cách thái hành như thế nào để mỏng?",
        pronunciation_focus: [
          "ba-GAI-ma-na CA-ra me-NGI-ris BA-wang su-PA-ya TI-pis - `cara mengiris` = cách thái/lát; `bawang` = hành/tỏi tùy loại.",
          "`supaya tipis` = để mỏng. Nếu cần rõ, nói `bawang merah` = hành tím, `bawang putih` = tỏi.",
          "Lỗi người Việt: dùng `potong` cho mọi kiểu cắt. `Mengiris` nhấn thái/lát mỏng.",
        ],
        pronunciation_focus_en: [
          "ba-GAI-ma-na CHA-ra me-NGEE-ris BA-wang soo-PA-ya TEE-pis - `cara mengiris` = how to slice; `bawang` = onion/garlic depending on type.",
          "`supaya tipis` = so it is thin. For clarity, `bawang merah` = shallot/red onion, `bawang putih` = garlic.",
          "VN-speaker trap: using `potong` for every kind of cutting. `Mengiris` emphasizes slicing thinly.",
        ],
      },
      {
        en: "Saya belum terbiasa menguleg bumbu.",
        vi: "Tôi chưa quen giã gia vị bằng cối.",
        pronunciation_focus: [
          "SA-ya be-LUM ter-BI-a-sa me-NGU-leg BUM-bu - `belum terbiasa` = chưa quen; `menguleg bumbu` = giã/nghiền gia vị bằng ulekan.",
          "`uleg` là kỹ thuật nghiền bằng cối đá/ulekan, rất phổ biến trong bếp Indonesia.",
          "Lỗi người Việt: dùng `blender` cho mọi cách nghiền. Nhiều món Indonesia nhấn hương vị từ `diuleg`.",
        ],
        pronunciation_focus_en: [
          "SA-ya be-LOOM ter-BEE-a-sa me-NGOO-leg BOOM-boo - `belum terbiasa` = not used to it yet; `menguleg bumbu` = grind spices with a mortar/pestle.",
          "`uleg` is grinding with a stone mortar/pestle, very common in Indonesian cooking.",
          "VN-speaker note: using a blender for everything misses the local cooking term. Many Indonesian dishes emphasize flavor from spices being `diuleg`.",
        ],
      },
      {
        en: "Boleh saya mencicipi kuahnya?",
        vi: "Tôi nếm thử nước dùng/nước sốt được không?",
        pronunciation_focus: [
          "BO-leh SA-ya men-ci-CI-pi KU-ah-nya - `mencicipi` = nếm thử; `kuah` = nước dùng/nước sốt lỏng.",
          "`mencicipi` lịch sự hơn `coba makan` khi chỉ nếm một chút.",
          "Lỗi người Việt: dịch 'nếm' thành `rasa` như động từ. Nói `mencicipi` hoặc thân mật hơn `cicip`.",
        ],
        pronunciation_focus_en: [
          "BO-leh SA-ya men-chee-CHEE-pee KOO-ah-nya - `mencicipi` = taste/sample; `kuah` = broth/sauce.",
          "`mencicipi` is more polite than `coba makan` when tasting a little.",
          "VN-speaker trap: translating 'taste' as verb `rasa`. Say `mencicipi`, or casually `cicip`.",
        ],
      },
      {
        en: "Menurut saya, bumbunya masih kurang sedikit.",
        vi: "Theo tôi, gia vị vẫn còn thiếu một chút.",
        pronunciation_focus: [
          "me-NU-rut SA-ya, BUM-bu-nya MA-sih KU-rang se-DI-kit - `menurut saya` = theo tôi; `bumbu kurang` = gia vị thiếu/chưa đủ.",
          "`masih kurang sedikit` mềm hơn nói thẳng `tidak enak`. Dùng khi góp ý trong lớp.",
          "Lỗi người Việt: dịch 'thiếu vị' thành `rasa kurang`. Có thể nói, nhưng về gia vị cụ thể `bumbunya kurang` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "me-NOO-root SA-ya, BOOM-boo-nya MA-sih KOO-rang se-DEE-kit - `menurut saya` = in my opinion; `bumbu kurang` = seasoning is lacking.",
          "`masih kurang sedikit` is softer than bluntly saying `tidak enak`. Use it for class feedback.",
          "VN-speaker note: `rasa kurang` can work, but for seasoning specifically `bumbunya kurang` is more natural.",
        ],
      },
      {
        en: "Kalau terlalu pedas, tambahkan santan sedikit.",
        vi: "Nếu cay quá, thêm một chút nước cốt dừa.",
        pronunciation_focus: [
          "KA-lau ter-LA-lu PE-das, tam-BAH-kan SAN-tan se-DI-kit - `terlalu pedas` = quá cay; `santan` = nước cốt dừa; `tambahkan` = hãy thêm.",
          "`tambahkan` là dạng chỉ dẫn lịch sự trong công thức. `tambah` thân mật hơn.",
          "Lỗi người Việt: gọi `santan` là `susu kelapa` trong nấu ăn. Từ bếp tự nhiên là `santan`.",
        ],
        pronunciation_focus_en: [
          "KA-lau ter-LA-loo PE-das, tam-BAH-kan SAN-tan se-DEE-kit - `terlalu pedas` = too spicy; `santan` = coconut milk; `tambahkan` = add.",
          "`tambahkan` is a polite instruction form in recipes. `tambah` is more casual.",
          "VN-speaker trap: calling `santan` `susu kelapa` in cooking. The natural kitchen word is `santan`.",
        ],
      },
      {
        en: "Kita bisa tukar resep setelah kelas selesai.",
        vi: "Chúng ta có thể trao đổi công thức sau khi lớp kết thúc.",
        pronunciation_focus: [
          "KI-ta BI-sa TU-kar RE-sep se-TE-lah KE-las se-LE-sai - `tukar resep` = trao đổi công thức; `setelah` = sau khi.",
          "`kita` gồm cả người nghe. Dùng `kita bisa` để mời thân thiện.",
          "Lỗi người Việt: nhầm `kami` và `kita`. Nếu bạn muốn nói 'chúng ta' gồm người nghe, dùng `kita`.",
        ],
        pronunciation_focus_en: [
          "KEE-ta BEE-sa TOO-kar RE-sep se-TE-lah KE-las se-LE-sai - `tukar resep` = exchange recipes; `setelah` = after.",
          "`kita` includes the listener. Use `kita bisa` for a friendly invitation.",
          "VN-speaker trap: mixing up `kami` and `kita`. If you mean 'we' including the listener, use `kita`.",
        ],
      },
      {
        en: "Saya mau menulis resep ini di buku catatan.",
        vi: "Tôi muốn ghi công thức này vào sổ ghi chú.",
        pronunciation_focus: [
          "SA-ya mau me-NU-lis RE-sep I-ni di BU-ku ca-TA-tan - `buku catatan` = sổ ghi chú; `menulis resep` = ghi công thức.",
          "`di buku catatan` = trong sổ ghi chú. Với điện thoại có thể nói `di HP saya`.",
          "Lỗi người Việt: nói `tulis ke buku` có thể hiểu, nhưng `menulis di buku catatan` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau me-NOO-lis RE-sep EE-nee dee BOO-koo cha-TA-tan - `buku catatan` = notebook; `menulis resep` = write down a recipe.",
          "`di buku catatan` = in a notebook. For a phone, you can say `di HP saya`.",
          "VN-speaker note: `tulis ke buku` can be understood, but `menulis di buku catatan` is more natural.",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong lớp nấu ăn Indonesia, từ `bumbu` rất quan trọng: nó không chỉ là gia vị rời mà còn là hỗn hợp hành, tỏi, ớt, nghệ, riềng, sả, kemiri, v.v. Nhiều món dùng `ulekan` để giã bumbu thay vì xay máy. Khi góp ý món ăn, nên nói mềm như `bumbunya masih kurang sedikit` hoặc `menurut saya perlu tambah garam sedikit`, tránh nói thẳng `tidak enak`.",
    cultural_notes_en:
      "In Indonesian cooking classes, `bumbu` is a key word: it is not just loose seasoning, but often a paste or blend of shallots, garlic, chilies, turmeric, galangal, lemongrass, candlenut, and more. Many dishes use an `ulekan` to grind spices instead of a blender. When giving feedback, soften it with `bumbunya masih kurang sedikit` or `menurut saya perlu tambah garam sedikit`, instead of bluntly saying `tidak enak`.",
    tip_advice_vi:
      "Khung câu hữu ích: `Boleh saya lihat resepnya?`, `Takaran ___ berapa?`, `Bagaimana cara mengiris ___?`, `Boleh saya mencicipi?`, và `Kita bisa tukar resep?` Nhớ phân biệt `rasa` = vị/cảm giác, `bumbu` = gia vị/hỗn hợp gia vị, `resep` = công thức.",
    tip_advice_en:
      "Useful frames: `Boleh saya lihat resepnya?`, `Takaran ___ berapa?`, `Bagaimana cara mengiris ___?`, `Boleh saya mencicipi?`, and `Kita bisa tukar resep?` Keep `rasa` = taste/feeling, `bumbu` = seasoning/spice paste, and `resep` = recipe separate.",
    vocabulary: [
      {
        cell_id: "7802fd8f-d37c-4ded-9182-e300adc8b77f",
        word: "kelas memasak",
        en: "cooking class",
        vi: "lớp nấu ăn",
        pos: "noun",
        pronunciation_vi: "KE-las me-MA-sak",
        pronunciation_en: "KE-las me-MA-sak",
      },
      {
        cell_id: "f3bdab0f-6e7e-4a08-b587-ab18875a7e4b",
        word: "resep",
        en: "recipe",
        vi: "công thức nấu ăn",
        pos: "noun",
        pronunciation_vi: "RE-sep",
        pronunciation_en: "RE-sep",
      },
      {
        cell_id: "f9e58819-3f7b-4f1f-ab75-61f5d9949cd7",
        word: "bahan",
        en: "ingredient; material",
        vi: "nguyên liệu",
        pos: "noun",
        pronunciation_vi: "BA-han",
        pronunciation_en: "BA-han",
      },
      {
        cell_id: "a5c11fd4-ff6c-4350-8caa-f0ea53ee17ae",
        word: "takaran",
        en: "measurement; amount",
        vi: "định lượng",
        pos: "noun",
        pronunciation_vi: "ta-KA-ran",
        pronunciation_en: "ta-KA-ran",
      },
      {
        cell_id: "7a5e00e9-f230-4ff3-b146-081f7e5919fe",
        word: "mengiris",
        en: "to slice",
        vi: "thái/lát",
        pos: "verb",
        pronunciation_vi: "me-NGI-ris",
        pronunciation_en: "me-NGEE-ris",
      },
      {
        cell_id: "ab5894b9-433c-4771-bd2c-29bc64f55456",
        word: "mencicipi",
        en: "to taste; to sample",
        vi: "nếm thử",
        pos: "verb",
        pronunciation_vi: "men-ci-CI-pi",
        pronunciation_en: "men-chee-CHEE-pee",
      },
      {
        cell_id: "79cb48ff-17bb-4cb5-a673-341f8da26858",
        word: "bumbu",
        en: "seasoning; spice paste",
        vi: "gia vị/hỗn hợp gia vị",
        pos: "noun",
        pronunciation_vi: "BUM-bu",
        pronunciation_en: "BOOM-boo",
      },
      {
        cell_id: "7d4fbd2e-8395-4c94-87ce-5124d71204a5",
        word: "kurang sedikit",
        en: "a little lacking",
        vi: "thiếu một chút",
        pos: "phrase",
        pronunciation_vi: "KU-rang se-DI-kit",
        pronunciation_en: "KOO-rang se-DEE-kit",
      },
      {
        cell_id: "cff74c09-80df-4ecd-9f98-d4000fcf6ded",
        word: "tukar resep",
        en: "exchange recipes",
        vi: "trao đổi công thức",
        pos: "verb phrase",
        pronunciation_vi: "TU-kar RE-sep",
        pronunciation_en: "TOO-kar RE-sep",
      },
      {
        cell_id: "6bf4a3ef-596e-4cb5-a1ee-de0b517f4f66",
        word: "santan",
        en: "coconut milk",
        vi: "nước cốt dừa",
        pos: "noun",
        pronunciation_vi: "SAN-tan",
        pronunciation_en: "SAN-tan",
      },
    ],
    dialogue: [
      {
        cell_id: "cb0851b0-372e-43f7-8b88-5f1a24d17a97",
        speaker: "Peserta",
        text: "Boleh saya lihat resepnya dulu?",
        vi: "Tôi xem công thức trước được không?",
        en: "May I look at the recipe first?",
      },
      {
        cell_id: "f2b05ca5-2dab-4a48-bdaf-3bdf8c7642b5",
        speaker: "Instruktur",
        text: "Boleh. Bahan utama hari ini adalah ayam, santan, dan bumbu halus.",
        vi: "Được. Nguyên liệu chính hôm nay là gà, nước cốt dừa, và bumbu xay/giã mịn.",
        en: "Sure. Today's main ingredients are chicken, coconut milk, and ground spice paste.",
      },
      {
        cell_id: "926c4f5b-f621-49e3-ac10-4a4d8f165009",
        speaker: "Peserta",
        text: "Takaran garamnya berapa?",
        vi: "Lượng muối là bao nhiêu?",
        en: "How much salt should we use?",
      },
      {
        cell_id: "b1e349ff-21ba-4ef7-91d5-f923499fb35e",
        speaker: "Instruktur",
        text: "Satu sendok teh dulu, nanti kita cicipi lagi.",
        vi: "Một muỗng cà phê trước, lát nữa chúng ta nếm lại.",
        en: "One teaspoon first, then we will taste it again.",
      },
      {
        cell_id: "56dd57bf-00e8-48c7-b05d-df1923431282",
        speaker: "Peserta",
        text: "Menurut saya, bumbunya masih kurang sedikit.",
        vi: "Theo tôi, gia vị vẫn còn thiếu một chút.",
        en: "In my opinion, the seasoning is still a little lacking.",
      },
      {
        cell_id: "5e31287a-68c6-45aa-a3a6-5095c451c2d0",
        speaker: "Instruktur",
        text: "Baik, tambahkan garam sedikit dan aduk pelan-pelan.",
        vi: "Được, thêm một chút muối và khuấy từ từ.",
        en: "All right, add a little salt and stir slowly.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi có thể nếm thử nước dùng không?",
        prompt_en: "Translate into Indonesian: May I taste the broth?",
        answer: "Boleh saya mencicipi kuahnya?",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: ___ garamnya satu sendok teh saja.",
        prompt_en: "Fill in the blank: ___ garamnya satu sendok teh saja.",
        answer: "Takaran",
      },
      {
        type: "choice",
        prompt_vi: "Câu nào mềm và lịch sự nhất khi góp ý món còn thiếu gia vị?",
        prompt_en: "Which sentence is the softest and most polite feedback when a dish lacks seasoning?",
        options: [
          "Menurut saya, bumbunya masih kurang sedikit.",
          "Ini tidak enak.",
          "Bumbunya salah semua.",
        ],
        answer: "Menurut saya, bumbunya masih kurang sedikit.",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm từ Indonesia với nghĩa tiếng Việt.",
        prompt_en: "Match each Indonesian phrase with its Vietnamese meaning.",
        pairs: [
          ["kelas memasak", "lớp nấu ăn"],
          ["tukar resep", "trao đổi công thức"],
          ["mengiris bawang", "thái hành/tỏi"],
        ],
      },
    ],
    content:
      "Use this lesson for friendly cooking-class interactions: asking for a recipe, checking ingredients and measurements, learning slicing and spice-grinding techniques, tasting politely, giving soft feedback, and exchanging recipes after class.",
  },
];
