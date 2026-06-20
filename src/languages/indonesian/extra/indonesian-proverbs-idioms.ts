// Indonesian Proverbs & Everyday Idioms (Vietnamese -> Indonesian study track).
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
    id: "indonesian_proverbs_everyday_idioms",
    level: "B1",
    category: "language",
    title_vi: "Tục ngữ và thành ngữ đời thường Indonesia",
    title_en: "Indonesian proverbs and everyday idioms",
    sentences: [
      {
        en: "Mereka bagai pinang dibelah dua.",
        vi: "Họ giống nhau như hai nửa của một quả cau.",
        pronunciation_focus: [
          "ME-re-ka BA-gai PI-nang di-BE-lah DU-a - nghĩa đen: như quả cau được bổ làm hai phần giống nhau.",
          "Nghĩa bóng: hai người rất giống nhau, thường dùng cho cặp đôi hoặc anh chị em. Tương đương VN: `giống nhau như hai giọt nước`.",
          "Lỗi người Việt: dịch thành `seperti dua tetes air`. Người Indonesia dùng hình ảnh cau: `pinang dibelah dua`.",
        ],
        pronunciation_focus_en: [
          "ME-re-ka BA-gai PI-nang di-BE-lah DU-a - literal: like a betel nut split into two matching halves.",
          "Figurative: two people look very alike, often a couple or siblings. VN equivalent: 'like two drops of water'.",
          "VN-speaker trap: translating into `seperti dua tetes air`. Indonesian uses the betel-nut image: `pinang dibelah dua`.",
        ],
      },
      {
        en: "Ada udang di balik batu.",
        vi: "Có con tôm sau hòn đá - có động cơ/ẩn ý phía sau.",
        pronunciation_focus: [
          "A-da U-dang di BA-lik BA-tu - nghĩa đen: có con tôm nấp sau hòn đá.",
          "Nghĩa bóng: ai đó có ý đồ ẩn sau hành động tốt hoặc lời nói đẹp. Tương đương VN: `có ẩn ý`, `có ý đồ riêng`.",
          "Lỗi người Việt: dùng cho mọi bí mật. Thành ngữ này thường có sắc thái nghi ngờ động cơ.",
        ],
        pronunciation_focus_en: [
          "A-da U-dang di BA-lik BA-tu - literal: there is a shrimp behind the rock.",
          "Figurative: someone has a hidden motive behind a kind act or polished words. VN equivalent: 'has an ulterior motive'.",
          "VN-speaker trap: using it for every secret. This idiom usually suggests suspicion about motive.",
        ],
      },
      {
        en: "Besar pasak daripada tiang.",
        vi: "Cọc lớn hơn cột - chi tiêu nhiều hơn thu nhập.",
        pronunciation_focus: [
          "be-SAR PA-sak da-ri-PA-da TI-ang - nghĩa đen: cái chốt/cọc lại lớn hơn cái cột.",
          "Nghĩa bóng: tiêu nhiều hơn kiếm được; thâm hụt ngân sách. Tương đương VN: `vung tay quá trán`.",
          "Lỗi người Việt: dịch `pasak` thành `paku` (đinh). Thành ngữ cố định là `pasak`, không đổi từ.",
        ],
        pronunciation_focus_en: [
          "be-SAR PA-sak da-ri-PA-da TI-ang - literal: the peg is bigger than the pillar.",
          "Figurative: spending more than income; running a deficit. VN equivalent: overspending beyond one's means.",
          "VN-speaker trap: replacing `pasak` with `paku` (nail). The fixed proverb uses `pasak`.",
        ],
      },
      {
        en: "Tong kosong nyaring bunyinya.",
        vi: "Thùng rỗng kêu to.",
        pronunciation_focus: [
          "TONG KO-song NYA-ring BU-nyi-nya - nghĩa đen rất gần tiếng Việt: thùng rỗng thì âm vang lớn.",
          "Nghĩa bóng: người biết ít thường nói nhiều/khoe khoang. Tương đương VN: `thùng rỗng kêu to`.",
          "Lỗi người Việt: đọc `nyaring` như n-y. `ny` là một âm giống `nh`: NYA-ring.",
        ],
        pronunciation_focus_en: [
          "TONG KO-song NYA-ring BU-nyi-nya - literal: an empty barrel makes a loud sound.",
          "Figurative: people with little knowledge often talk or boast loudly. VN equivalent: `thùng rỗng kêu to`.",
          "VN-speaker trap: splitting `nyaring` into n-y. `ny` is one sound, like Spanish ñ: NYA-ring.",
        ],
      },
      {
        en: "Sambil menyelam minum air.",
        vi: "Vừa lặn vừa uống nước - một công đôi việc.",
        pronunciation_focus: [
          "SAM-bil me-nye-LAM MI-num A-ir - nghĩa đen: trong lúc lặn thì uống nước luôn.",
          "Nghĩa bóng: làm một việc mà đạt thêm việc khác. Tương đương VN: `một công đôi việc`.",
          "Lỗi người Việt: nói `dua pekerjaan satu kali`. Thành ngữ tự nhiên là `sambil menyelam minum air`.",
        ],
        pronunciation_focus_en: [
          "SAM-bil me-nye-LAM MI-num A-ir - literal: while diving, drink water too.",
          "Figurative: accomplish two things in one action. VN equivalent: `một công đôi việc`.",
          "VN-speaker trap: saying `dua pekerjaan satu kali`. The natural idiom is `sambil menyelam minum air`.",
        ],
      },
      {
        en: "Nasi sudah menjadi bubur.",
        vi: "Cơm đã thành cháo - chuyện đã rồi.",
        pronunciation_focus: [
          "NA-si SU-dah men-JA-di BU-bur - nghĩa đen: cơm đã thành cháo, không thể quay lại.",
          "Nghĩa bóng: việc đã xảy ra, không sửa lại được. Tương đương VN: `ván đã đóng thuyền`.",
          "Lỗi người Việt: Việt nói `gạo đã nấu thành cơm`, Indonesia nói cơm thành `bubur` (cháo). Giữ hình ảnh Indonesia.",
        ],
        pronunciation_focus_en: [
          "NA-si SU-dah men-JA-di BU-bur - literal: the rice has become porridge and cannot go back.",
          "Figurative: what is done is done. VN equivalent: 'the boat has sailed'.",
          "VN-speaker trap: Vietnamese says rice became cooked rice; Indonesian says rice became `bubur` (porridge). Keep the Indonesian image.",
        ],
      },
      {
        en: "Sedikit-sedikit, lama-lama menjadi bukit.",
        vi: "Từng chút một, lâu dần thành đồi - tích tiểu thành đại.",
        pronunciation_focus: [
          "se-DI-kit-se-DI-kit, la-ma-LA-ma men-JA-di BU-kit - lặp từ để nhấn mạnh quá trình từng chút một.",
          "Nghĩa bóng: gom góp/học đều đặn thì thành kết quả lớn. Tương đương VN: `kiến tha lâu cũng đầy tổ`.",
          "Lỗi người Việt: bỏ lặp từ. Trong peribahasa này, `sedikit-sedikit` và `lama-lama` tạo nhịp và nghĩa.",
        ],
        pronunciation_focus_en: [
          "se-DI-kit-se-DI-kit, la-ma-LA-ma men-JA-di BU-kit - reduplication stresses a bit-by-bit process.",
          "Figurative: saving or studying steadily creates a big result. VN equivalent: ants carrying bit by bit fill the nest.",
          "VN-speaker trap: dropping the repeated words. In this proverb, `sedikit-sedikit` and `lama-lama` carry both rhythm and meaning.",
        ],
      },
      {
        en: "Air tenang menghanyutkan.",
        vi: "Nước lặng cuốn trôi - người im lặng có thể rất sâu sắc/khó lường.",
        pronunciation_focus: [
          "A-ir te-NANG meng-ha-NYUT-kan - nghĩa đen: nước yên vẫn có thể cuốn người đi.",
          "Nghĩa bóng: người ít nói không nhất thiết yếu; có thể sâu sắc hoặc nguy hiểm. Tương đương VN: `tẩm ngẩm tầm ngầm`.",
          "Lỗi người Việt: chỉ dùng để khen. Thành ngữ này có thể khen sự sâu sắc hoặc cảnh báo sự khó đoán.",
        ],
        pronunciation_focus_en: [
          "A-ir te-NANG meng-ha-NYUT-kan - literal: calm water can still sweep people away.",
          "Figurative: quiet people are not necessarily weak; they may be deep or dangerous. VN equivalent: 'still waters run deep'.",
          "VN-speaker trap: using it only as praise. This idiom can praise depth or warn that someone is hard to read.",
        ],
      },
      {
        en: "Jauh di mata, dekat di hati.",
        vi: "Xa mặt nhưng gần trong tim.",
        pronunciation_focus: [
          "JA-uh di MA-ta, DE-kat di HA-ti - cặp đối lập `jauh/dekat` và `mata/hati` tạo nhịp dễ nhớ.",
          "Nghĩa bóng: dù xa về khoảng cách, tình cảm vẫn gần. Tương đương VN: `xa mặt nhưng không cách lòng`.",
          "Lỗi người Việt: dịch `near in heart` quá sát. Cụm cố định là `dekat di hati`.",
        ],
        pronunciation_focus_en: [
          "JA-uh di MA-ta, DE-kat di HA-ti - the `far/near` and `eyes/heart` contrast makes it memorable.",
          "Figurative: physically far but emotionally close. VN equivalent: far from sight, not from heart.",
          "VN-speaker trap: translating 'near in heart' too literally. The fixed phrase is `dekat di hati`.",
        ],
      },
      {
        en: "Murah di mulut, mahal di timbangan.",
        vi: "Rẻ ở miệng, đắt trên cân - nói thì dễ, làm mới khó.",
        pronunciation_focus: [
          "MU-rah di MU-lut, MA-hal di tim-BANG-an - nghĩa đen: rẻ khi nói miệng, đắt khi đem cân thật.",
          "Nghĩa bóng: lời hứa/nói miệng thì dễ, hành động thật mới tốn công. Gần VN: `nói thì dễ, làm mới khó`.",
          "Lỗi người Việt: hiểu là mặc cả giá. Đây là bình luận về lời nói và hành động, không phải mua bán.",
        ],
        pronunciation_focus_en: [
          "MU-rah di MU-lut, MA-hal di tim-BANG-an - literal: cheap in the mouth, expensive on the scale.",
          "Figurative: talk is easy; real action costs effort. VN equivalent: easy to say, hard to do.",
          "VN-speaker trap: reading it as price bargaining. It comments on speech versus action, not shopping.",
        ],
      },
      {
        en: "Malu bertanya, sesat di jalan.",
        vi: "Ngại hỏi thì lạc đường.",
        pronunciation_focus: [
          "MA-lu ber-TA-nya, SE-sat di JA-lan - nghĩa đen: xấu hổ không hỏi thì lạc đường.",
          "Nghĩa bóng: nếu không dám hỏi, mình sẽ sai/lạc hướng. Tương đương VN: `không biết thì phải hỏi`.",
          "Lỗi người Việt: dịch `malu` chỉ là xấu hổ mạnh. Ở đây là ngại/ngượng hỏi.",
        ],
        pronunciation_focus_en: [
          "MA-lu ber-TA-nya, SE-sat di JA-lan - literal: ashamed to ask, lost on the road.",
          "Figurative: if you do not ask, you may go wrong. VN equivalent: if you do not know, ask.",
          "VN-speaker trap: taking `malu` only as intense shame. Here it means being shy/embarrassed to ask.",
        ],
      },
      {
        en: "Ungkapan itu dipakai untuk menyindir dengan halus.",
        vi: "Cách nói đó được dùng để châm nhẹ một cách tế nhị.",
        pronunciation_focus: [
          "ung-KAP-an I-tu di-PA-kai un-TUK me-NYIN-dir de-NGAN HA-lus - `ungkapan` = thành ngữ/cách nói; `menyindir` = nói bóng/châm.",
          "Lỗi người Việt: dùng peribahasa trực diện trong mọi tình huống. Nhiều thành ngữ Indonesia dùng để nhắc khéo, không phải mắng thẳng.",
          "Luyện: `Ini sindiran halus, bukan marah-marah.`",
        ],
        pronunciation_focus_en: [
          "ung-KAP-an I-tu di-PA-kai un-TUK me-NYIN-dir de-NGAN HA-lus - `ungkapan` = expression/idiom; `menyindir` = hint or criticize indirectly.",
          "VN-speaker trap: using proverbs bluntly in every situation. Many Indonesian idioms are for gentle indirect criticism, not direct scolding.",
          "Drill: `Ini sindiran halus, bukan marah-marah.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Peribahasa và ungkapan Indonesia thường dùng hình ảnh đời sống cũ: pinang, udang, batu, nasi, bubur, tong, pasak, tiang. Giống tiếng Việt, chúng giúp nói gián tiếp, khuyên nhẹ, châm biếm hoặc nhận xét văn hóa mà không quá thô. Khi dùng với người lớn tuổi, đồng nghiệp, hoặc trong gia đình, sắc thái quan trọng hơn dịch nghĩa từng chữ.",
    cultural_notes_en:
      "Indonesian proverbs and idioms often use older everyday imagery: betel nut, shrimp, stone, rice, porridge, barrel, peg, and pillar. Like Vietnamese, they let speakers advise, tease, criticize, or comment indirectly without sounding too blunt. With elders, coworkers, or family, nuance matters more than literal translation.",
    tip_advice_vi:
      "Mẹo cho người Việt: trước khi dùng peribahasa, học ba lớp: nghĩa đen, nghĩa bóng, và tình huống dùng. Đừng thay từ trong thành ngữ cố định (`pasak`, không phải `paku`; `bubur`, không phải `nasi`). Nếu chưa chắc sắc thái, hãy thêm câu giải thích ngắn: `maksud saya, jangan boros` hoặc `maksudnya, ada motif tersembunyi`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: before using a proverb, learn three layers: literal meaning, figurative meaning, and usage situation. Do not swap words in fixed idioms (`pasak`, not `paku`; `bubur`, not `nasi`). If you are unsure about nuance, add a short explanation: `maksud saya, jangan boros` or `maksudnya, ada motif tersembunyi`.",
    vocabulary: [
      { word: "peribahasa", en: "proverb", vi: "tục ngữ", pos: "noun", pronunciation_vi: "pe-ri-ba-HA-sa", pronunciation_en: "pe-ree-ba-HA-sa" },
      { word: "ungkapan", en: "expression / idiom", vi: "thành ngữ / cách nói", pos: "noun", pronunciation_vi: "ung-KAP-an", pronunciation_en: "ung-KAP-an" },
      { word: "bagai pinang dibelah dua", en: "like two identical halves", vi: "giống nhau như hai giọt nước", pos: "idiom", pronunciation_vi: "BA-gai PI-nang di-BE-lah DU-a", pronunciation_en: "BA-gai PI-nang di-BE-lah DOO-a" },
      { word: "ada udang di balik batu", en: "there is a hidden motive", vi: "có ẩn ý / có ý đồ riêng", pos: "proverb", pronunciation_vi: "A-da U-dang di BA-lik BA-tu", pronunciation_en: "A-da OO-dang di BA-lik BA-too" },
      { word: "besar pasak daripada tiang", en: "expenses exceed income", vi: "vung tay quá trán", pos: "proverb", pronunciation_vi: "be-SAR PA-sak da-ri-PA-da TI-ang", pronunciation_en: "be-SAR PA-sak da-ree-PA-da TEE-ang" },
      { word: "makna budaya", en: "cultural meaning", vi: "ý nghĩa văn hóa", pos: "noun phrase", pronunciation_vi: "MAK-na bu-DA-ya", pronunciation_en: "MAK-na boo-DA-ya" },
      { word: "menyindir", en: "to hint / criticize indirectly", vi: "nói bóng / châm nhẹ", pos: "verb", pronunciation_vi: "me-NYIN-dir", pronunciation_en: "me-NYIN-deer" },
      { word: "boros", en: "wasteful", vi: "hoang phí", pos: "adjective", pronunciation_vi: "BO-ros", pronunciation_en: "BO-ros" },
      { word: "motif tersembunyi", en: "hidden motive", vi: "động cơ ẩn", pos: "noun phrase", pronunciation_vi: "mo-TIF ter-sem-BU-nyi", pronunciation_en: "mo-TEEF ter-sem-BOO-nyee" },
      { word: "sindiran halus", en: "gentle indirect criticism", vi: "lời châm nhẹ tế nhị", pos: "noun phrase", pronunciation_vi: "sin-DIR-an HA-lus", pronunciation_en: "sin-DEER-an HA-loos" },
    ],
    dialogue: [
      {
        speaker: "Ayu",
        text: "Kakak beradik itu mirip sekali.",
        vi: "Hai anh em đó giống nhau quá.",
        en: "Those siblings look so alike.",
      },
      {
        speaker: "Bima",
        text: "Iya, bagai pinang dibelah dua.",
        vi: "Ừ, giống nhau như hai giọt nước.",
        en: "Yes, like two identical halves of a betel nut.",
      },
      {
        speaker: "Ayu",
        text: "Tapi teman kita yang tiba-tiba baik itu agak mencurigakan.",
        vi: "Nhưng người bạn tự nhiên tốt bất thường kia hơi đáng ngờ.",
        en: "But our friend who is suddenly so nice is a bit suspicious.",
      },
      {
        speaker: "Bima",
        text: "Mungkin ada udang di balik batu.",
        vi: "Có thể có ẩn ý phía sau.",
        en: "Maybe there is a hidden motive.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu trong peribahasa:",
        instruction_en: "Fill in the missing proverb word:",
        items: [
          {
            prompt: "Bagai pinang dibelah ___. (hai)",
            answer: "dua",
            options: ["dua", "batu", "tiang"],
          },
          {
            prompt: "Ada udang di balik ___. (đá)",
            answer: "batu",
            options: ["batu", "bukit", "bubur"],
          },
          {
            prompt: "Besar pasak daripada ___. (cột)",
            answer: "tiang",
            options: ["tiang", "tangan", "tong"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối peribahasa với nghĩa tiếng Việt:",
        instruction_en: "Match each proverb with its Vietnamese meaning:",
        items: [
          { prompt: "Tong kosong nyaring bunyinya", answer: "thùng rỗng kêu to" },
          { prompt: "Nasi sudah menjadi bubur", answer: "chuyện đã rồi" },
          { prompt: "Sedikit-sedikit, lama-lama menjadi bukit", answer: "tích tiểu thành đại" },
          { prompt: "Malu bertanya, sesat di jalan", answer: "ngại hỏi thì lạc đường" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Họ giống nhau như hai giọt nước.", answer: "Mereka bagai pinang dibelah dua." },
          { prompt: "Có động cơ ẩn phía sau.", answer: "Ada udang di balik batu." },
          { prompt: "Chi tiêu nhiều hơn thu nhập.", answer: "Besar pasak daripada tiang." },
        ],
      },
    ],
  },
];

export default lessons;
