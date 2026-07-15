// Creative Writing & Story Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file following the established Indonesian extra
// format. The `en` field holds TARGET-LANGUAGE Indonesian, `vi` holds the
// Vietnamese gloss, and pronunciation_focus carries Vietnamese L1 notes with
// English companion explanations in the same order.

type LessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar/culture notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type DialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type Exercise = Record<string, unknown>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: VocabEntry[];
  dialogue?: DialogueLine[];
  exercises?: Exercise[];
  content?: string;
};

export const creativeWritingStoryLessons: IndonesianLesson[] = [
  {
    id: "indonesian_creative_writing_story",
    level: "B1",
    category: "language_writing",
    title_vi: "Viết truyện bằng tiếng Indonesia: nhân vật, cốt truyện và phong cách",
    title_en: "Creative writing in Indonesian: character, plot and style",
    sentences: [
      {
        en: "Saya sedang menulis cerita pendek tentang seorang anak yang tersesat di pasar malam.",
        vi: "Tôi đang viết một truyện ngắn về một đứa trẻ bị lạc ở chợ đêm.",
        pronunciation_focus: [
          "`menulis cerita pendek` = viết truyện ngắn; `cerita` là câu chuyện, `pendek` đứng sau danh từ.",
          "`tentang seorang anak` = về một đứa trẻ; `seorang` dùng cho một người/nhân vật.",
          "Lỗi người Việt: đặt tính từ trước danh từ như `pendek cerita`. Tiếng Indonesia nói `cerita pendek`.",
        ],
        pronunciation_focus_en: [
          "`menulis cerita pendek` means writing a short story; `cerita` is story, and `pendek` comes after the noun.",
          "`tentang seorang anak` means about a child; `seorang` is used for one person or character.",
          "VN-speaker trap: placing adjectives before nouns, as in `pendek cerita`. Indonesian says `cerita pendek`.",
        ],
      },
      {
        en: "Tokoh utamanya pendiam, tetapi berani mengambil keputusan.",
        vi: "Nhân vật chính ít nói, nhưng dám đưa ra quyết định.",
        pronunciation_focus: [
          "`tokoh utama` = nhân vật chính; `utama` đứng sau `tokoh`.",
          "`pendiam` = ít nói/trầm tính; không phải `diam` đơn thuần là im lặng tại một thời điểm.",
          "Lỗi người Việt: dùng `karakter utama` được hiểu, nhưng trong bài học văn và phân tích truyện, `tokoh utama` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "`tokoh utama` means main character; `utama` follows `tokoh`.",
          "`pendiam` means quiet by personality, not just silent at one moment.",
          "VN-speaker trap: `karakter utama` is understood, but in literature or story analysis, `tokoh utama` is more natural.",
        ],
      },
      {
        en: "Alur cerita bergerak dari masalah kecil ke konflik besar.",
        vi: "Mạch truyện đi từ vấn đề nhỏ đến xung đột lớn.",
        pronunciation_focus: [
          "`alur cerita` = mạch/cốt truyện; dùng khi nói về trình tự sự kiện.",
          "`bergerak dari ... ke ...` = chuyển từ ... đến ...; khung hữu ích để mô tả tiến triển truyện.",
          "Lỗi người Việt: dịch `plot` thành `rencana`. Trong văn học, `plot` là `alur`, không phải kế hoạch.",
        ],
        pronunciation_focus_en: [
          "`alur cerita` means plot or story flow; use it for the sequence of events.",
          "`bergerak dari ... ke ...` means moves from ... to ..., useful for describing story progression.",
          "VN-speaker trap: translating `plot` as `rencana`. In literature, plot is `alur`, not plan.",
        ],
      },
      {
        en: "Latar cerita ini adalah kota kecil di tepi laut.",
        vi: "Bối cảnh của câu chuyện này là một thị trấn nhỏ bên bờ biển.",
        pronunciation_focus: [
          "`latar cerita` = bối cảnh truyện; bao gồm nơi chốn, thời gian, không khí.",
          "`kota kecil di tepi laut` = thị trấn/thành phố nhỏ bên bờ biển; `di` chỉ vị trí.",
          "Lỗi người Việt: dùng `background` trong bài viết. Tiếng Indonesia văn học dùng `latar`.",
        ],
        pronunciation_focus_en: [
          "`latar cerita` means story setting; it includes place, time, and atmosphere.",
          "`kota kecil di tepi laut` means a small town by the sea; `di` marks location.",
          "VN-speaker trap: using English `background` in writing. Indonesian literary language uses `latar`.",
        ],
      },
      {
        en: "Dialognya harus terdengar alami, bukan seperti pidato.",
        vi: "Lời thoại phải nghe tự nhiên, không giống bài phát biểu.",
        pronunciation_focus: [
          "`dialognya` = lời thoại của truyện đó; `-nya` làm cụm danh từ rõ hơn.",
          "`terdengar alami` = nghe tự nhiên; dùng cho giọng văn, lời thoại, cách nói.",
          "Lỗi người Việt: nói `dialog alami terdengar`. Trật tự tự nhiên là `dialognya terdengar alami`.",
        ],
        pronunciation_focus_en: [
          "`dialognya` means the dialogue of that story; `-nya` makes the noun phrase clear.",
          "`terdengar alami` means sounds natural; use it for style, dialogue, or speech.",
          "VN-speaker trap: saying `dialog alami terdengar`. Natural order is `dialognya terdengar alami`.",
        ],
      },
      {
        en: "Konflik muncul ketika tokoh utama menyimpan rahasia dari sahabatnya.",
        vi: "Xung đột xuất hiện khi nhân vật chính giấu bí mật với bạn thân của mình.",
        pronunciation_focus: [
          "`konflik muncul ketika ...` = xung đột xuất hiện khi ...; khung tốt để phân tích truyện.",
          "`menyimpan rahasia dari sahabatnya` = giữ/giấu bí mật với bạn thân; `dari` ở đây là khỏi/đối với người đó.",
          "Lỗi người Việt: dịch `giấu bí mật` thành `menyembunyikan rahasia kepada`. Tự nhiên hơn: `menyimpan rahasia dari ...`.",
        ],
        pronunciation_focus_en: [
          "`konflik muncul ketika ...` means the conflict appears when ..., a useful story-analysis frame.",
          "`menyimpan rahasia dari sahabatnya` means keeps a secret from a close friend; `dari` means from that person.",
          "VN-speaker trap: translating to `menyembunyikan rahasia kepada`. More natural: `menyimpan rahasia dari ...`.",
        ],
      },
      {
        en: "Akhir ceritanya terbuka, jadi pembaca bisa menafsirkan sendiri.",
        vi: "Kết truyện mở, nên độc giả có thể tự diễn giải.",
        pronunciation_focus: [
          "`akhir cerita` = kết truyện; thêm `-nya` thành `akhir ceritanya` khi nói về truyện cụ thể.",
          "`terbuka` = mở; `akhir terbuka` là kết thúc không giải thích hết mọi thứ.",
          "Lỗi người Việt: dịch `open ending` thành `akhir buka`. Cụm tự nhiên là `akhir cerita terbuka` hoặc `akhir terbuka`.",
        ],
        pronunciation_focus_en: [
          "`akhir cerita` means story ending; add `-nya` as `akhir ceritanya` for a specific story.",
          "`terbuka` means open; an open ending does not explain everything.",
          "VN-speaker trap: translating `open ending` as `akhir buka`. Natural phrases are `akhir cerita terbuka` or `akhir terbuka`.",
        ],
      },
      {
        en: "Gaya bahasanya sederhana, tetapi gambarnya kuat.",
        vi: "Phong cách ngôn ngữ đơn giản, nhưng hình ảnh rất mạnh.",
        pronunciation_focus: [
          "`gaya bahasa` = phong cách ngôn ngữ/văn phong; không phải chỉ cách phát âm.",
          "`gambarnya kuat` trong văn chương nghĩa là hình ảnh gợi mạnh, không phải bức tranh vật lý.",
          "Lỗi người Việt: dùng `style bahasa`. Cụm Indonesia chuẩn là `gaya bahasa`.",
        ],
        pronunciation_focus_en: [
          "`gaya bahasa` means language style or prose style, not only pronunciation.",
          "`gambarnya kuat` in writing means the imagery is strong, not a physical picture.",
          "VN-speaker trap: saying `style bahasa`. Standard Indonesian is `gaya bahasa`.",
        ],
      },
      {
        en: "Saya revisi paragraf pertama supaya pembukaannya lebih menarik.",
        vi: "Tôi sửa đoạn đầu để phần mở đầu hấp dẫn hơn.",
        pronunciation_focus: [
          "`revisi` = sửa/chỉnh lại bản viết; từ này rất phổ biến trong học thuật và viết lách.",
          "`pembukaan` = phần mở đầu; khác `awal` là điểm bắt đầu chung chung.",
          "Lỗi người Việt: nói `memperbaiki pertama paragraf`. Trật tự đúng là `paragraf pertama`.",
        ],
        pronunciation_focus_en: [
          "`revisi` means revise a draft; the word is common in academic and writing contexts.",
          "`pembukaan` means opening section; different from generic `awal`, the beginning point.",
          "VN-speaker trap: saying `memperbaiki pertama paragraf`. Correct order is `paragraf pertama`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong lớp Bahasa Indonesia, học sinh thường phân tích unsur intrinsik cerita: tokoh, alur, latar, tema, sudut pandang, konflik, amanat, dan gaya bahasa. Khi viết sáng tạo, tiếng Indonesia thích câu rõ, mạch sự kiện rành mạch, và dialog yang alami. `Amanat` là thông điệp/bài học của truyện, nhưng truyện hiện đại không nhất thiết phải kết luận quá lộ liễu. Người học Việt nên tránh dịch quá sát từ tiếng Việt; hãy dùng cụm cố định như `tokoh utama`, `alur cerita`, `latar cerita`, `akhir terbuka`, và `gaya bahasa`.",
    cultural_notes_en:
      "In Indonesian language classes, students often analyze a story's intrinsic elements: character, plot, setting, theme, point of view, conflict, message, and language style. In creative writing, Indonesian favors clear sentences, a coherent event flow, and natural dialogue. `Amanat` means the message or lesson of a story, but modern stories do not always need an obvious moral. Vietnamese learners should avoid translating too literally; use fixed phrases such as `tokoh utama`, `alur cerita`, `latar cerita`, `akhir terbuka`, and `gaya bahasa`.",
    tip_advice_vi:
      "Mẹo cho người Việt: tính từ Indonesia đứng sau danh từ trong cụm viết truyện: `cerita pendek`, `tokoh utama`, `kota kecil`, `akhir terbuka`. Khi tóm tắt truyện, dùng khung: `Tokohnya...`, `Latarnya...`, `Konfliknya muncul ketika...`, `Akhir ceritanya...`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: Indonesian adjectives come after nouns in story-writing phrases: `cerita pendek`, `tokoh utama`, `kota kecil`, `akhir terbuka`. When summarizing a story, use frames: `Tokohnya...`, `Latarnya...`, `Konfliknya muncul ketika...`, `Akhir ceritanya...`.",
    vocabulary: [
      {
        cell_id: "96bd3576-ceed-4816-8a34-e8df191efc55",
        word: "menulis cerita",
        en: "to write a story",
        vi: "viết truyện",
        pos: "verb phrase",
        pronunciation_vi: "me-NU-lis ce-RI-ta",
        pronunciation_en: "meh-NOO-lis che-REE-ta",
      },
      {
        cell_id: "72f3febf-c380-4078-bc36-4064fa51341d",
        word: "tokoh utama",
        en: "main character",
        vi: "nhân vật chính",
        pos: "noun phrase",
        pronunciation_vi: "TO-koh u-TA-ma",
        pronunciation_en: "TOH-koh oo-TA-ma",
      },
      {
        cell_id: "172c86ae-15a3-47a5-89b6-ed65c116fd14",
        word: "alur cerita",
        en: "plot / story flow",
        vi: "cốt truyện / mạch truyện",
        pos: "noun phrase",
        pronunciation_vi: "A-lur ce-RI-ta",
        pronunciation_en: "AH-loor che-REE-ta",
      },
      {
        cell_id: "d690ec1b-29c7-402d-8687-441f6e43eaf5",
        word: "latar",
        en: "setting",
        vi: "bối cảnh",
        pos: "noun",
        pronunciation_vi: "LA-tar",
        pronunciation_en: "LA-tar",
      },
      {
        cell_id: "0c67d044-687b-4caf-a924-fa7b52292802",
        word: "dialog",
        en: "dialogue",
        vi: "lời thoại / đối thoại",
        pos: "noun",
        pronunciation_vi: "DI-a-log",
        pronunciation_en: "DEE-a-log",
      },
      {
        cell_id: "080f7510-2c95-4123-a8b5-edba76f59728",
        word: "konflik",
        en: "conflict",
        vi: "xung đột",
        pos: "noun",
        pronunciation_vi: "KON-flik",
        pronunciation_en: "KON-flik",
      },
      {
        cell_id: "af3d1292-f7da-41db-8cf0-63ff2aa3faf7",
        word: "akhir cerita",
        en: "story ending",
        vi: "kết truyện",
        pos: "noun phrase",
        pronunciation_vi: "A-khir ce-RI-ta",
        pronunciation_en: "AH-khir che-REE-ta",
      },
      {
        cell_id: "e13a6a11-1078-48bb-8748-7f6ef338b917",
        word: "gaya bahasa",
        en: "language style / prose style",
        vi: "văn phong / phong cách ngôn ngữ",
        pos: "noun phrase",
        pronunciation_vi: "GA-ya ba-HA-sa",
        pronunciation_en: "GA-ya ba-HA-sa",
      },
    ],
    dialogue: [
      {
        cell_id: "bcf94018-7c8e-4e21-9f25-563a35f13113",
        speaker: "Guru",
        text: "Ceritamu menarik, tapi tokoh utamanya belum jelas.",
        vi: "Truyện của em thú vị, nhưng nhân vật chính chưa rõ.",
        en: "Your story is interesting, but the main character is not clear yet.",
      },
      {
        cell_id: "b31c57c7-7efb-42d5-b957-e76fed73ae86",
        speaker: "Siswa",
        text: "Saya ingin tokohnya pendiam, tetapi berani di akhir cerita.",
        vi: "Em muốn nhân vật ít nói, nhưng dũng cảm ở cuối truyện.",
        en: "I want the character to be quiet, but brave at the end of the story.",
      },
      {
        cell_id: "f379d42b-6889-4c83-b65c-6a7dc1181d80",
        speaker: "Guru",
        text: "Bagus. Sekarang perkuat konfliknya dan buat dialognya lebih alami.",
        vi: "Tốt. Bây giờ hãy làm xung đột mạnh hơn và làm lời thoại tự nhiên hơn.",
        en: "Good. Now strengthen the conflict and make the dialogue more natural.",
      },
      {
        cell_id: "82246db5-28f7-416b-a474-6deb1817a85e",
        speaker: "Siswa",
        text: "Baik, saya akan revisi alur dan pembukaannya.",
        vi: "Vâng, em sẽ sửa mạch truyện và phần mở đầu.",
        en: "Okay, I will revise the plot and the opening.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Nhân vật chính ít nói, nhưng dũng cảm.",
        prompt_en: "Translate into Indonesian: The main character is quiet, but brave.",
        answer: "Tokoh utamanya pendiam, tetapi berani.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: ___ cerita ini adalah kota kecil di tepi laut.",
        prompt_en: "Fill in the blank: ___ cerita ini adalah kota kecil di tepi laut.",
        answer: "Latar",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: alur cerita",
        prompt_en: "Match the meaning: alur cerita",
        answer: "plot / story flow / cốt truyện",
      },
      {
        type: "roleplay",
        prompt_vi: "Bạn đang góp ý cho bạn học. Nói bằng tiếng Indonesia rằng lời thoại nên nghe tự nhiên hơn.",
        prompt_en: "You are giving feedback to a classmate. Say in Indonesian that the dialogue should sound more natural.",
        answer: "Dialognya harus terdengar lebih alami.",
      },
    ],
  },
];
