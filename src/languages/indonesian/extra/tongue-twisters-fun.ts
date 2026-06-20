// Tongue Twisters & Indonesian Wordplay (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// pronunciation/culture notes with English companions in pronunciation_focus_en.

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
    id: "indonesian_tongue_twisters_fun",
    level: "B1",
    category: "humor",
    title_vi: "Trò chơi chữ, pantun và câu líu lưỡi Indonesia",
    title_en: "Indonesian tongue twisters, pantun, and wordplay",
    sentences: [
      {
        en: "Kuku kaki kakekku kaku-kaku.",
        vi: "Móng chân của ông tôi cứng cứng.",
        pronunciation_focus: [
          "KU-ku KA-ki ka-KEK-ku KA-ku-KA-ku — luyện chuỗi `ku/ka/ke`; `kakekku` = ông của tôi.",
          "Lỗi người Việt: nuốt phụ âm cuối `k`. Trong tiếng Indonesia, âm cuối `k` vẫn phải đóng gọn.",
          "Luyện chậm rồi nhanh: `Kuku kaki kakekku kaku-kaku.`",
        ],
        pronunciation_focus_en: [
          "KU-ku KA-ki ka-KEK-ku KA-ku-KA-ku — trains the `ku/ka/ke` chain; `kakekku` = my grandfather.",
          "VN-speaker trap: dropping final `k`. Indonesian final `k` needs a clear clipped stop.",
          "Drill slow, then fast: `Kuku kaki kakekku kaku-kaku.`",
        ],
      },
      {
        en: "Ular melingkar di pagar Pak Umar.",
        vi: "Con rắn cuộn quanh hàng rào của ông Umar.",
        pronunciation_focus: [
          "U-lar me-LING-kar di PA-gar pak U-mar — luyện `r/l/ng`; `melingkar` = cuộn vòng.",
          "Lỗi người Việt: đọc `ng` thành hai âm n-g. `ng` là một âm mũi như trong `người`.",
          "Luyện: `Ular melingkar di pagar Pak Umar.`",
        ],
        pronunciation_focus_en: [
          "U-lar me-LING-kar di PA-gar pak U-mar — trains `r/l/ng`; `melingkar` = coil around.",
          "VN-speaker trap: splitting `ng` into n-g. Indonesian `ng` is one nasal sound.",
          "Drill: `Ular melingkar di pagar Pak Umar.`",
        ],
      },
      {
        en: "Satu sate tujuh tusuk, tujuh tusuk satu sate.",
        vi: "Một phần satay bảy xiên, bảy xiên một phần satay.",
        pronunciation_focus: [
          "SA-tu SA-te TU-juh TU-suk — luyện `s/t` và số; `tusuk` = xiên/que.",
          "Lỗi người Việt: lẫn `tujuh` (7) với `tuju` (hướng tới). Âm cuối `h` nhẹ nhưng có.",
          "Luyện: `Satu sate tujuh tusuk, tujuh tusuk satu sate.`",
        ],
        pronunciation_focus_en: [
          "SA-tu SA-te TU-juh TU-suk — trains `s/t` and numbers; `tusuk` = skewer.",
          "VN-speaker trap: confusing `tujuh` (seven) with `tuju` (head toward). Keep the light final `h`.",
          "Drill: `Satu sate tujuh tusuk, tujuh tusuk satu sate.`",
        ],
      },
      {
        en: "Kalau ada sumur di ladang, boleh kita menumpang mandi.",
        vi: "Nếu có giếng ở ruộng, cho chúng tôi tắm nhờ.",
        pronunciation_focus: [
          "KA-lau A-da SU-mur di LA-dang — mở đầu pantun quen thuộc; `menumpang` = đi nhờ/dùng nhờ.",
          "Pantun thường có 4 dòng: 2 dòng đầu tạo vần/khung cảnh, 2 dòng sau mới là ý chính.",
          "Lỗi người Việt: dịch từng dòng rồi thấy vô lý. Với pantun, hãy chờ hai dòng cuối.",
        ],
        pronunciation_focus_en: [
          "KA-lau A-da SU-mur di LA-dang — a familiar pantun opening; `menumpang` = use/ride along by permission.",
          "Pantun often has 4 lines: the first 2 set rhyme/scenery, the last 2 carry the message.",
          "VN-speaker trap: translating each line and thinking it is random. With pantun, wait for the final two lines.",
        ],
      },
      {
        en: "Kalau ada umur panjang, boleh kita berjumpa lagi.",
        vi: "Nếu còn sống lâu, chúng ta có thể gặp lại nhau.",
        pronunciation_focus: [
          "KA-lau A-da U-mur PAN-jang — đây là phần ý chính của pantun chia tay.",
          "`berjumpa lagi` = gặp lại; lịch sự và mềm hơn `ketemu lagi` trong văn vần.",
          "Luyện cặp pantun: dòng `ladang/mandi` đi với `panjang/lagi` để tạo nhịp chia tay.",
        ],
        pronunciation_focus_en: [
          "KA-lau A-da U-mur PAN-jang — this is the message half of the farewell pantun.",
          "`berjumpa lagi` = meet again; more polished than casual `ketemu lagi` in verse.",
          "Practice the pair: `ladang/mandi` lines lead into `panjang/lagi` for a farewell rhythm.",
        ],
      },
      {
        en: "Burung kakaktua hinggap di jendela.",
        vi: "Con vẹt mào đậu trên cửa sổ.",
        pronunciation_focus: [
          "BU-rung ka-kak-TU-a HING-gap di jen-DE-la — câu mở đầu bài hát/trò chơi trẻ em quen thuộc.",
          "`hinggap` = đậu xuống (chim/côn trùng); khác `tinggal` = sống/ở.",
          "Lỗi người Việt: đọc `jendela` như tiếng Anh `window`. Đây là từ Indonesia: jen-DE-la.",
        ],
        pronunciation_focus_en: [
          "BU-rung ka-kak-TU-a HING-gap di jen-DE-la — opening line of a familiar children's song/game.",
          "`hinggap` = perch/land (birds/insects); different from `tinggal` = live/stay.",
          "VN-speaker trap: treating `jendela` like English `window`. It is Indonesian: jen-DE-la.",
        ],
      },
      {
        en: "Gajah apa yang kecil? Gajah yang baru lahir.",
        vi: "Con voi nào nhỏ? Con voi mới sinh.",
        pronunciation_focus: [
          "GA-jah A-pa yang ke-CHIL — mẫu `tebak-tebakan`: hỏi nghe lạ nhưng đáp án rất đơn giản.",
          "`baru lahir` = mới sinh; `c` trong `kecil` đọc như 'ch'.",
          "Lỗi người Việt: cố tìm chơi chữ sâu. Nhiều câu đố Indonesia là kiểu đáp án ngây ngô để gây cười.",
        ],
        pronunciation_focus_en: [
          "GA-jah A-pa yang ke-CHIL — a `tebak-tebakan` pattern: odd question, very simple answer.",
          "`baru lahir` = newly born; `c` in `kecil` sounds like 'ch'.",
          "VN-speaker trap: looking for deep wordplay. Many Indonesian riddles are intentionally silly.",
        ],
      },
      {
        en: "Jauh di mata, dekat di hati.",
        vi: "Xa mặt nhưng gần trong tim.",
        pronunciation_focus: [
          "JA-uh di MA-ta, DE-kat di HA-ti — câu vần đối lập `jauh/dekat`, `mata/hati`.",
          "Dùng cho bạn bè/người yêu ở xa; tương đương Việt: `xa mặt nhưng không cách lòng`.",
          "Lỗi người Việt: dịch `in heart` quá sát. Cụm cố định là `di hati`.",
        ],
        pronunciation_focus_en: [
          "JA-uh di MA-ta, DE-kat di HA-ti — rhymed contrast: `far/near`, `eyes/heart`.",
          "Used for friends/lovers far away; close to 'far from the eyes, near to the heart'.",
          "VN-speaker trap: overtranslating 'in heart'. The fixed phrase is `di hati`.",
        ],
      },
      {
        en: "Jangan baper, ini cuma bercanda.",
        vi: "Đừng nhạy cảm quá, cái này chỉ là đùa thôi.",
        pronunciation_focus: [
          "JA-ngan BA-per, I-ni CU-ma ber-CAN-da — `baper` = bawa perasaan, dễ tự ái/nhạy cảm.",
          "`cuma bercanda` = chỉ đùa thôi; dùng để hạ nhiệt sau một câu joke nhẹ.",
          "Lỗi người Việt: dùng câu này sau lời xúc phạm nặng. `Bercanda` không xóa được sự bất lịch sự.",
        ],
        pronunciation_focus_en: [
          "JA-ngan BA-per, I-ni CU-ma ber-CAN-da — `baper` = bawa perasaan, taking things personally.",
          "`cuma bercanda` = just joking; used to soften a light joke.",
          "VN-speaker trap: using this after a harsh insult. `Bercanda` does not erase rudeness.",
        ],
      },
      {
        en: "Receh banget, tapi lucu.",
        vi: "Nhạt/rẻ tiền thật, nhưng buồn cười.",
        pronunciation_focus: [
          "RE-cheh BA-nget, TA-pi LU-chu — `receh` nghĩa gốc là tiền lẻ, nghĩa lóng là joke đơn giản/nhạt.",
          "`lucu` = buồn cười/dễ thương tùy ngữ cảnh; ở đây là hài.",
          "Lỗi người Việt: dịch `receh` là `rẻ` về giá. Với humor, `jokes receh` = joke đơn giản, hơi nhảm.",
        ],
        pronunciation_focus_en: [
          "RE-cheh BA-nget, TA-pi LU-chu — `receh` literally small change, slang for a low-effort/silly joke.",
          "`lucu` = funny/cute by context; here it means funny.",
          "VN-speaker trap: translating `receh` as cheap in price. In humor, `jokes receh` = corny/simple jokes.",
        ],
      },
      {
        en: "Pelesetan nama kota itu bikin orang ketawa.",
        vi: "Cách nói lái/tấu tên thành phố đó làm người ta cười.",
        pronunciation_focus: [
          "pe-le-SE-tan NA-ma KO-ta — `pelesetan` = nói lái/biến âm để gây cười.",
          "`bikin orang ketawa` = làm người ta cười; khẩu ngữ hơn `membuat orang tertawa`.",
          "Lỗi người Việt: lẫn `ketawa` (cười, khẩu ngữ) với `tertawa` (cười, chuẩn/trang trọng hơn).",
        ],
        pronunciation_focus_en: [
          "pe-le-SE-tan NA-ma KO-ta — `pelesetan` = punning/twisting sounds for humor.",
          "`bikin orang ketawa` = make people laugh; more colloquial than `membuat orang tertawa`.",
          "VN-speaker trap: mixing `ketawa` (laugh, casual) and `tertawa` (laugh, more standard/formal).",
        ],
      },
      {
        en: "Humor Indonesia sering main bunyi, bukan hanya arti.",
        vi: "Hài Indonesia thường chơi âm thanh, không chỉ chơi nghĩa.",
        pronunciation_focus: [
          "HU-mor in-do-NE-sia SE-ring main BU-nyi — `main bunyi` = chơi âm/vần; `arti` = nghĩa.",
          "Gợi ý học: đọc to để nghe nhịp. Nếu chỉ đọc thầm, nhiều joke và pantun sẽ mất vui.",
          "Luyện: `Humor Indonesia sering main bunyi, bukan hanya arti.`",
        ],
        pronunciation_focus_en: [
          "HU-mor in-do-NE-sia SE-ring main BU-nyi — `main bunyi` = play with sound/rhyme; `arti` = meaning.",
          "Study tip: read aloud to hear the rhythm. If you only read silently, many jokes and pantun lose their punch.",
          "Drill: `Humor Indonesia sering main bunyi, bukan hanya arti.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trò chơi chữ Indonesia xuất hiện trong pantun, câu đố `tebak-tebakan`, joke `receh`, meme, và câu líu lưỡi để luyện phát âm. Pantun là thơ vần 4 dòng rất phổ biến trong lời chào, đám cưới, MC sự kiện và nói vui. Joke đời thường hay dùng `pelesetan` (biến âm/nói lái), từ viết tắt như `baper`, và sự ngây ngô có chủ ý.",
    cultural_notes_en:
      "Indonesian wordplay appears in pantun, `tebak-tebakan` riddles, `receh` jokes, memes, and tongue twisters for pronunciation practice. Pantun is a rhymed four-line verse common in greetings, weddings, event hosting, and playful speech. Everyday jokes often use `pelesetan` sound-twisting, abbreviations such as `baper`, and deliberately silly logic.",
    tip_advice_vi:
      "Mẹo cho người Việt: để hiểu humor Indonesia, nghe âm trước rồi mới phân tích nghĩa. Chú ý `c` = ch, `ng` là một âm, âm cuối `k/h/r` không nên nuốt mất. Khi đùa với người mới quen, tránh chủ đề ngoại hình, tôn giáo, sắc tộc; dùng câu nhẹ như `cuma bercanda` nhưng vẫn phải lịch sự.",
    tip_advice_en:
      "Tip for Vietnamese speakers: to understand Indonesian humor, listen for sound first, then analyze meaning. Watch `c` = ch, `ng` as one sound, and final `k/h/r` without swallowing them. With new acquaintances, avoid appearance, religion, and ethnicity; `cuma bercanda` helps only when the joke is already polite.",
    vocabulary: [
      { word: "permainan kata", en: "wordplay", vi: "trò chơi chữ", pos: "noun phrase", pronunciation_vi: "per-ma-IN-an KA-ta", pronunciation_en: "per-ma-IN-an KA-ta" },
      { word: "pantun", en: "rhymed quatrain", vi: "thơ pantun bốn dòng", pos: "noun", pronunciation_vi: "PAN-tun", pronunciation_en: "PAN-toon" },
      { word: "tebak-tebakan", en: "riddle / guessing joke", vi: "câu đố", pos: "noun", pronunciation_vi: "TE-bak-TE-ba-kan", pronunciation_en: "TE-bak-TE-ba-kan" },
      { word: "pelesetan", en: "pun / sound twist", vi: "nói lái / biến âm gây cười", pos: "noun", pronunciation_vi: "peu-leu-SE-tan", pronunciation_en: "pe-le-SE-tan" },
      { word: "bercanda", en: "to joke", vi: "đùa", pos: "verb", pronunciation_vi: "ber-CHAN-da", pronunciation_en: "ber-CHAN-da" },
      { word: "lucu", en: "funny / cute", vi: "buồn cười / dễ thương", pos: "adjective", pronunciation_vi: "LU-chu", pronunciation_en: "LOO-choo" },
      { word: "ketawa", en: "to laugh", vi: "cười", pos: "verb", pronunciation_vi: "keu-TA-wa", pronunciation_en: "ke-TA-wa" },
      { word: "receh", en: "corny / low-effort joke", vi: "nhạt, nhảm nhưng vui", pos: "slang adjective", pronunciation_vi: "RE-chèh", pronunciation_en: "RE-cheh" },
      { word: "baper", en: "too emotionally affected", vi: "nhạy cảm / tự ái", pos: "slang adjective", pronunciation_vi: "BA-per", pronunciation_en: "BA-per" },
      { word: "bunyi", en: "sound", vi: "âm thanh", pos: "noun", pronunciation_vi: "BU-nyi", pronunciation_en: "BOO-nyee" },
    ],
    dialogue: [
      {
        speaker: "Dina",
        text: "Coba baca cepat: Kuku kaki kakekku kaku-kaku.",
        vi: "Thử đọc nhanh đi: Móng chân của ông tôi cứng cứng.",
        en: "Try reading this fast: Kuku kaki kakekku kaku-kaku.",
      },
      {
        speaker: "Minh",
        text: "Aduh, susah! Lidah saya belibet.",
        vi: "Ôi khó quá! Lưỡi tôi líu lại.",
        en: "Ouch, hard! My tongue is tied.",
      },
      {
        speaker: "Dina",
        text: "Santai, ini cuma permainan kata.",
        vi: "Thoải mái đi, đây chỉ là trò chơi chữ thôi.",
        en: "Relax, this is just wordplay.",
      },
      {
        speaker: "Minh",
        text: "Receh banget, tapi lucu. Saya mau coba tebak-tebakan juga.",
        vi: "Nhạt thật, nhưng vui. Tôi cũng muốn thử câu đố.",
        en: "So corny, but funny. I want to try a riddle too.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng về trò chơi chữ và humor:",
        instruction_en: "Fill in the right word for wordplay and humor:",
        items: [
          { prompt: "___ adalah puisi empat baris yang berima. (pantun)", answer: "Pantun", options: ["Pantun", "Parkir", "Piring"] },
          { prompt: "Joke itu ___ banget, tapi lucu. (nhạt/nhảm vui)", answer: "receh", options: ["receh", "resmi", "ramai"] },
          { prompt: "Jangan ___, ini cuma bercanda. (nhạy cảm quá)", answer: "baper", options: ["baper", "bakar", "bayar"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "permainan kata", answer: "trò chơi chữ" },
          { prompt: "tebak-tebakan", answer: "câu đố" },
          { prompt: "pelesetan", answer: "nói lái / biến âm gây cười" },
          { prompt: "ketawa", answer: "cười" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Đừng nhạy cảm quá, cái này chỉ là đùa thôi.", answer: "Jangan baper, ini cuma bercanda." },
          { prompt: "Hài Indonesia thường chơi âm thanh.", answer: "Humor Indonesia sering main bunyi." },
          { prompt: "Xa mặt nhưng gần trong tim.", answer: "Jauh di mata, dekat di hati." },
        ],
      },
    ],
  },
];

export default lessons;
