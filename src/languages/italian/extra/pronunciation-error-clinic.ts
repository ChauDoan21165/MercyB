// src/languages/italian/extra/pronunciation-error-clinic.ts
//
// Italian pronunciation error clinic for Vietnamese learners.
// Converted from .local/vietnamese-italian-study/H3-italian-pronunciation-error-clinic.md.
//
// Targets the pronunciation errors Vietnamese speakers most often make in
// Italian: dropped final vowels, single/double consonants, stress, the
// tapped/trilled `r`, and the `gli` / `gn` / `ci` / `gi` / `sc` clusters.
//
// Shape mirrors the French lessons-a1.ts pattern (LessonSentence /
// VocabEntry / Exercise) so the page UI stays consistent across verticals.
// Types are inlined because src/languages/italian/lessons.ts does not exist
// yet — keep this file self-contained until the Italian registry lands.
//
// Vietnamese-first: every drill carries a `vi` gloss; `pronunciation_focus`
// holds the Vietnamese-speaker (L1) note, `pronunciation_focus_en` the
// English-speaker companion.

export type LessonSentence = {
  en: string;
  vi: string;
  // L1 = Vietnamese-speaker pronunciation notes.
  pronunciation_focus: string[];
  // English-speaker companion to pronunciation_focus — same length + order.
  pronunciation_focus_en?: string[];
};

export type VocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  // Vietnamese-speaker pronunciation hint with stressed syllable in CAPS.
  pronunciation_vi: string;
  // English-speaker pronunciation hint with stressed syllable in CAPS.
  pronunciation_en?: string;
};

export type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields (fill-blank, matching, drill) can vary.
export type Exercise = Record<string, any>;

export type ItalianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ItalianLesson = {
  id: string;
  category: string;
  level: ItalianCefrLevel;
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

export const lesson: ItalianLesson = {
  id: "italian_pronunciation_error_clinic",
  category: "pronunciation",
  level: "A2",
  title_vi: "Phòng khám lỗi phát âm tiếng Ý",
  title_en: "Italian pronunciation error clinic",

  sentences: [
    {
      en: "Vado al lavoro.",
      vi: "Tôi đi làm.",
      pronunciation_focus: [
        "Giữ nguyên âm cuối: 'lavoro', KHÔNG đọc cụt thành 'lavor'",
        "Nhấn âm giữa: la-VO-ro",
      ],
      pronunciation_focus_en: [
        "Keep the final vowel: 'lavoro', never clip it to 'lavor' — Italian words almost always end in a vowel",
        "Stress the middle syllable: la-VO-ro",
      ],
    },
    {
      en: "Questa è la mia casa.",
      vi: "Đây là nhà của tôi.",
      pronunciation_focus: [
        "casa nhấn đầu: CA-sa",
        "'s' giữa hai nguyên âm đọc nhẹ như 'z'",
      ],
      pronunciation_focus_en: [
        "casa is stressed on the first syllable: CA-sa",
        "the 's' between two vowels softens toward a 'z'",
      ],
    },
    {
      en: "Grazie per l'aiuto.",
      vi: "Cảm ơn vì sự giúp đỡ.",
      pronunciation_focus: [
        "Đọc đủ 'grazie' (GRA-zie), đừng nuốt thành 'grazi'",
        "'zie' = 'tsi-e', âm cuối -e phải nghe rõ",
      ],
      pronunciation_focus_en: [
        "Say the full 'grazie' (GRA-zie); don't swallow it to 'grazi'",
        "'zie' = 'tsee-eh' — the final -e must be audible",
      ],
    },
    {
      en: "Porto il documento.",
      vi: "Tôi mang theo giấy tờ.",
      pronunciation_focus: [
        "documento nhấn 'MEN': do-cu-MEN-to",
        "Giữ -o cuối, đừng đọc cụt thành 'documen'",
      ],
      pronunciation_focus_en: [
        "documento is stressed on 'MEN': do-cu-MEN-to",
        "Keep the final -o; don't clip it to 'documen'",
      ],
    },
    {
      en: "Ho un appuntamento.",
      vi: "Tôi có một cuộc hẹn.",
      pronunciation_focus: [
        "'pp' đôi — giữ phụ âm lâu hơn: ap-pun-ta-MEN-to",
        "Nhấn 'MEN' ở áp chót",
      ],
      pronunciation_focus_en: [
        "Double 'pp' — hold the consonant longer: ap-pun-ta-MEN-to",
        "Stress 'MEN' on the penultimate syllable",
      ],
    },
    {
      en: "Devo arrivare a Roma.",
      vi: "Tôi phải đến Roma.",
      pronunciation_focus: [
        "'r' rung lưỡi: đầu lưỡi chạm nhẹ sau răng cửa, KHÔNG dùng 'r' kiểu Anh",
        "'rr' trong arrivare rung mạnh hơn 'r' đơn",
      ],
      pronunciation_focus_en: [
        "Tapped/trilled 'r': tongue tip taps just behind the upper teeth — not the English 'r'",
        "the 'rr' in arrivare is a stronger trill than a single 'r'",
      ],
    },
    {
      en: "La mia famiglia vive qui.",
      vi: "Gia đình tôi sống ở đây.",
      pronunciation_focus: [
        "'gli' đọc mềm như 'l-i' ngạc, KHÔNG đọc 'g' cứng (đừng nói 'fa-mi-ghli-a')",
        "Giống cảm giác 'nh' nhưng cho âm 'l'",
      ],
      pronunciation_focus_en: [
        "'gli' is a palatal sound (like the 'lli' in 'million'); never a hard 'g'",
        "famiglia = 'fa-MEE-lya', not 'fa-mig-lia'",
      ],
    },
    {
      en: "Ho bisogno del bagno.",
      vi: "Tôi cần dùng nhà vệ sinh.",
      pronunciation_focus: [
        "'gn' đọc như 'nh' tiếng Việt (nhô): bagno = 'ba-nho'",
        "KHÔNG tách thành g + n ('bag-no')",
      ],
      pronunciation_focus_en: [
        "'gn' is the 'ny' sound (like 'canyon'): bagno = 'BA-nyo'",
        "Don't split it into g + n ('bag-no')",
      ],
    },
  ],

  cultural_notes_vi:
    "Tiếng Ý gần như luôn kết thúc bằng nguyên âm, và mỗi nguyên âm đều được phát âm rõ — đây là điểm khác lớn so với tiếng Việt (vốn hay đọc cụt phụ âm/nguyên âm cuối). Phụ âm đôi (doppie: tt, pp, ll, ss, nn, rr) là âm vị thật sự: 'fato' (số phận) và 'fatto' (đã làm) là hai từ khác nghĩa hoàn toàn. Người Ý nghe ra ngay khi bạn không giữ phụ âm đôi đủ lâu.",
  cultural_notes_en:
    "Italian almost always ends words in a vowel, and every vowel is pronounced clearly — a big departure from Vietnamese, which often clips final sounds. Double consonants (doppie: tt, pp, ll, ss, nn, rr) are real, meaning-bearing phonemes: 'fato' (fate) and 'fatto' (done) are different words. Italians hear it immediately when you don't hold a double consonant long enough.",
  tip_advice_vi:
    "Quy trình phòng khám mỗi ngày: (1) chỉ chọn MỘT lỗi; (2) đọc 5 từ rời; (3) đọc 5 câu; (4) ghi âm 30 giây; (5) so với hôm qua. Đừng sửa mười lỗi cùng lúc — sửa một lỗi đến khi quen rồi mới sang lỗi tiếp theo.",
  tip_advice_en:
    "Daily clinic routine: (1) pick ONE error only; (2) say five isolated words; (3) say five sentences; (4) record 30 seconds; (5) compare with yesterday. Don't try to fix ten errors at once — drill one until it sticks, then move on.",

  vocabulary: [
    {
      word: "lavoro",
      en: "work / job",
      vi: "công việc",
      pos: "noun (m)",
      pronunciation_vi: "la-VO-ro — giữ -o cuối, KHÔNG đọc 'lavor'",
      pronunciation_en: "la-VO-ro — keep the final -o",
    },
    {
      word: "casa",
      en: "house / home",
      vi: "nhà",
      pos: "noun (f)",
      pronunciation_vi: "CA-sa — 's' đọc nhẹ như 'z'",
      pronunciation_en: "CA-sa — intervocalic 's' softens to 'z'",
    },
    {
      word: "grazie",
      en: "thank you",
      vi: "cảm ơn",
      pos: "interjection",
      pronunciation_vi: "GRA-zie — đọc đủ -e cuối, đừng nuốt thành 'grazi'",
      pronunciation_en: "GRA-tsee-eh — sound the final -e",
    },
    {
      word: "documento",
      en: "document",
      vi: "giấy tờ",
      pos: "noun (m)",
      pronunciation_vi: "do-cu-MEN-to — nhấn 'MEN', giữ -o cuối",
      pronunciation_en: "do-cu-MEN-to — stress 'MEN', keep final -o",
    },
    {
      word: "appuntamento",
      en: "appointment",
      vi: "cuộc hẹn",
      pos: "noun (m)",
      pronunciation_vi: "ap-pun-ta-MEN-to — 'pp' giữ lâu, nhấn 'MEN'",
      pronunciation_en: "ap-pun-ta-MEN-to — hold the 'pp', stress 'MEN'",
    },
    {
      word: "permesso",
      en: "permit / permission",
      vi: "giấy phép",
      pos: "noun (m)",
      pronunciation_vi: "per-MES-so — 'ss' đôi giữ lâu",
      pronunciation_en: "per-MES-so — hold the double 'ss'",
    },
    {
      word: "telefono",
      en: "telephone",
      vi: "điện thoại",
      pos: "noun (m)",
      pronunciation_vi: "te-LE-fo-no — nhấn 'LE' (lệch khỏi vị trí người Việt hay đoán)",
      pronunciation_en: "te-LE-fo-no — stress on 'LE' (antepenultimate)",
    },
    {
      word: "università",
      en: "university",
      vi: "đại học",
      pos: "noun (f)",
      pronunciation_vi: "u-ni-ver-si-TÀ — dấu huyền cuối = nhấn mạnh âm cuối",
      pronunciation_en: "u-ni-ver-si-TÀ — the grave accent marks final stress",
    },
    {
      word: "famiglia",
      en: "family",
      vi: "gia đình",
      pos: "noun (f)",
      pronunciation_vi: "fa-MI-lia — 'gli' mềm, KHÔNG đọc 'g' cứng",
      pronunciation_en: "fa-MEE-lya — soft palatal 'gli', no hard 'g'",
    },
    {
      word: "bisogno",
      en: "need",
      vi: "nhu cầu / sự cần",
      pos: "noun (m)",
      pronunciation_vi: "bi-SO-nho — 'gn' đọc như 'nh' tiếng Việt",
      pronunciation_en: "bi-SO-nyo — 'gn' is the 'ny' sound",
    },
  ],

  dialogue: [
    {
      speaker: "Maestro",
      text: "Oggi lavoriamo su una sola difficoltà: le doppie.",
      vi: "Hôm nay ta luyện đúng một khó khăn thôi: phụ âm đôi.",
      en: "Today we work on just one difficulty: the double consonants.",
    },
    {
      speaker: "Linh",
      text: "Ho fatto il lavoro. Ho fato il lavoro?",
      vi: "Tôi đã làm xong việc. (so với) 'fato' nghĩa là số phận?",
      en: "I have done the work. ('fato' would mean 'fate' instead.)",
    },
    {
      speaker: "Maestro",
      text: "Bene. 'Fatto' con due T: tieni la consonante più a lungo.",
      vi: "Tốt. 'Fatto' có hai chữ T: giữ phụ âm lâu hơn.",
      en: "Good. 'Fatto' with two T's: hold the consonant longer.",
    },
    {
      speaker: "Linh",
      text: "Ho sette euro, non sete.",
      vi: "Tôi có bảy euro, không phải 'khát'.",
      en: "I have seven euros, not 'thirst'.",
    },
  ],

  exercises: [
    {
      type: "minimal_pairs",
      instruction_vi:
        "Phụ âm đơn vs đôi — đọc to từng cặp, giữ phụ âm đôi lâu hơn rõ rệt:",
      instruction_en:
        "Single vs double consonant — read each pair aloud, holding the doubled consonant noticeably longer:",
      pronunciation_focus: ["phụ âm đôi (doppie) giữ lâu hơn"],
      pronunciation_focus_en: ["doppie are held longer than single consonants"],
      items: [
        {
          prompt: "fato / fatto",
          answer: "số phận / đã làm",
          drill: "Ho fatto il lavoro.",
        },
        {
          prompt: "pala / palla",
          answer: "xẻng / quả bóng",
          drill: "La palla è qui.",
        },
        {
          prompt: "sete / sette",
          answer: "khát / bảy",
          drill: "Ho sette euro.",
        },
        {
          prompt: "casa / cassa",
          answer: "nhà / quầy thu ngân",
          drill: "Pago alla cassa.",
        },
        {
          prompt: "nono / nonno",
          answer: "thứ chín / ông",
          drill: "Mio nonno vive qui.",
        },
        {
          prompt: "caro / carro",
          answer: "đắt (hoặc yêu) / xe kéo",
          drill: "Il carro è grande.",
        },
      ],
    },
    {
      type: "stress_drill",
      instruction_vi:
        "Đọc to và nhấn ĐÚNG âm tiết in HOA — sai trọng âm làm người Ý khó hiểu:",
      instruction_en:
        "Read aloud and stress the CAPITALISED syllable — wrong stress hurts comprehension:",
      pronunciation_focus: ["trọng âm thay đổi nhịp điệu của từ"],
      pronunciation_focus_en: ["stress changes the rhythm of the word"],
      items: [
        { prompt: "telefono", answer: "te-LE-fo-no", vi: "điện thoại" },
        { prompt: "lavoro", answer: "la-VO-ro", vi: "công việc" },
        { prompt: "documento", answer: "do-cu-MEN-to", vi: "giấy tờ" },
        { prompt: "università", answer: "u-ni-ver-si-TÀ", vi: "đại học" },
        { prompt: "possibilità", answer: "pos-si-bi-li-TÀ", vi: "khả năng" },
        { prompt: "farmacia", answer: "far-ma-CI-a", vi: "nhà thuốc" },
      ],
    },
    {
      type: "problem_sounds",
      instruction_vi:
        "Âm khó cho người Việt — đọc cụm từ luyện tập, chú ý cụm phụ âm:",
      instruction_en:
        "Sounds that are hard for Vietnamese speakers — read the practice phrase, watch the cluster:",
      items: [
        {
          prompt: "r — Roma, arrivare, lavoro",
          answer: "Devo arrivare a Roma.",
          vi: "Tôi phải đến Roma. (r rung lưỡi)",
        },
        {
          prompt: "gli — famiglia, figlio, foglio",
          answer: "La mia famiglia vive qui.",
          vi: "Gia đình tôi sống ở đây. (gli mềm)",
        },
        {
          prompt: "gn — bagno, bisogno, signora",
          answer: "Ho bisogno del bagno.",
          vi: "Tôi cần nhà vệ sinh. (gn = nh)",
        },
        {
          prompt: "ci — ciao, città, cinema",
          answer: "La città è grande.",
          vi: "Thành phố thì lớn. (ci = 'chi')",
        },
        {
          prompt: "gi — giorno, giro, giusto",
          answer: "Buongiorno, è giusto.",
          vi: "Chào buổi sáng, đúng vậy. (gi = 'gi' mềm như 'j')",
        },
        {
          prompt: "sc — scelta, scendere, lasciare",
          answer: "Devo scendere qui.",
          vi: "Tôi phải xuống ở đây. (sc + e/i = 'sh')",
        },
      ],
    },
    {
      type: "correction_notes",
      instruction_vi:
        "Lỗi người Việt hay mắc → cách sửa → câu luyện. Đọc lại đến khi tự nghe ra khác biệt:",
      instruction_en:
        "Common Vietnamese-speaker mistakes → correction → drill. Repeat until you can hear the difference yourself:",
      items: [
        {
          prompt: "Đọc 'grazi' (nuốt -e)",
          answer: "grazie — đủ âm cuối -e",
          drill: "Grazie mille.",
        },
        {
          prompt: "Đọc 'documen' (cụt -to)",
          answer: "documento — giữ nguyên âm cuối",
          drill: "Porto il documento.",
        },
        {
          prompt: "'famiglia' với 'g' cứng",
          answer: "gli mềm (palatal)",
          drill: "La mia famiglia.",
        },
        {
          prompt: "'sete' thay cho 'sette'",
          answer: "giữ 'tt' đôi lâu hơn",
          drill: "Ho sette euro.",
        },
        {
          prompt: "Đọc đều, không trọng âm",
          answer: "đánh dấu và nhấn âm tiết trọng âm",
          drill: "ap-pun-ta-MEN-to",
        },
      ],
    },
    {
      type: "reading_passage",
      instruction_vi:
        "Đọc to đoạn văn, sau đó ghi âm 30 giây và so sánh. Chú ý: phụ âm đôi, âm r, và các từ dài.",
      instruction_en:
        "Read the passage aloud, then record 30 seconds and compare. Focus on: doubles, the 'r', and the long words.",
      text_it:
        "Buongiorno, mi chiamo Linh. Vivo in Italia da sei mesi. Lavoro in un magazzino e studio italiano la sera. Ho bisogno di migliorare la pronuncia, soprattutto le doppie, la erre e le parole lunghe.",
      text_vi:
        "Xin chào, tôi tên Linh. Tôi sống ở Ý sáu tháng. Tôi làm ở kho và học tiếng Ý buổi tối. Tôi cần cải thiện phát âm, nhất là phụ âm đôi, âm r và từ dài.",
    },
    {
      type: "practice_test",
      instruction_vi: "Bài kiểm tra — đọc to 5 câu, rồi đối chiếu với phần đáp án:",
      instruction_en: "Practice test — read all five aloud, then check against the answer key:",
      items: [
        {
          prompt: "Ho fatto sette domande.",
          vi: "Tôi đã hỏi bảy câu.",
          check: "'fatto' và 'sette' đều có phụ âm đôi.",
        },
        {
          prompt: "La mia famiglia vive in una città grande.",
          vi: "Gia đình tôi sống ở một thành phố lớn.",
          check: "'famiglia' dùng 'gli' mềm.",
        },
        {
          prompt: "Porto il documento all'appuntamento.",
          vi: "Tôi mang giấy tờ đến cuộc hẹn.",
          check: "trọng âm 'documento' rơi vào 'MEN'.",
        },
        {
          prompt: "Ho bisogno di parlare con la signora.",
          vi: "Tôi cần nói chuyện với bà ấy.",
          check: "'bisogno' có 'gn' (= nh).",
        },
        {
          prompt: "Arrivo al lavoro alle otto.",
          vi: "Tôi đến chỗ làm lúc tám giờ.",
          check: "'arrivo' và 'lavoro' giữ nguyên âm cuối.",
        },
      ],
    },
  ],
};

export default lesson;
