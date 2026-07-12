// Family Gathering Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson following the established Indonesian extra shape.
// Sentence `en` is TARGET-LANGUAGE Indonesian; `vi` is the Vietnamese gloss.
// Vietnamese L1 notes live in `pronunciation_focus`, with English companions in
// `pronunciation_focus_en` in the same order.

export type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  cell_id?: string;
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
    id: "indonesian_family_gathering",
    level: "A2",
    category: "social",
    title_vi: "Kumpul keluarga: họ hàng, arisan và ăn cùng nhau",
    title_en: "Family gatherings: relatives, arisan and eating together",
    sentences: [
      {
        en: "Akhir pekan ini kami kumpul keluarga di rumah nenek.",
        vi: "Cuối tuần này chúng tôi họp mặt gia đình ở nhà bà.",
        pronunciation_focus: [
          "A-khir PE-kan I-ni KA-mi KUM-pul ke-LU-ar-ga di RU-mah NE-nek - `kumpul keluarga` = họp mặt gia đình; `di rumah` = ở nhà.",
          "Lỗi người Việt: nói `ke rumah` khi ý là sự kiện diễn ra tại nhà. Nơi diễn ra dùng `di`, hướng đi dùng `ke`.",
          "Luyện: `Kami kumpul keluarga di rumah nenek.`",
        ],
        pronunciation_focus_en: [
          "A-khir PE-kan I-ni KA-mi KUM-pul ke-LU-ar-ga di RU-mah NE-nek - `kumpul keluarga` = family gathering; `di rumah` = at the house.",
          "VN-speaker trap: saying `ke rumah` when the event is held at the house. Event location uses `di`; movement toward uses `ke`.",
          "Drill: `Kami kumpul keluarga di rumah nenek.`",
        ],
      },
      {
        en: "Banyak saudara datang dari luar kota.",
        vi: "Nhiều họ hàng đến từ ngoài thành phố.",
        pronunciation_focus: [
          "BA-nyak sau-DA-ra DA-tang da-ri LU-ar KO-ta - `saudara` = anh chị em/họ hàng; `luar kota` = ngoài thành phố.",
          "Lỗi người Việt: chỉ hiểu `saudara` là anh chị em ruột. Trong hội thoại gia đình, `saudara` có thể là họ hàng rộng hơn.",
          "Luyện: `Banyak saudara datang.`",
        ],
        pronunciation_focus_en: [
          "BA-nyak sau-DA-ra DA-tang da-ri LU-ar KO-ta - `saudara` = sibling/relative; `luar kota` = out of town.",
          "VN-speaker trap: reading `saudara` only as biological sibling. In family conversation it can mean relatives more broadly.",
          "Drill: `Banyak saudara datang.`",
        ],
      },
      {
        en: "Sepupu saya membawa anak-anaknya.",
        vi: "Anh/chị/em họ của tôi mang con cái theo.",
        pronunciation_focus: [
          "se-PU-pu SA-ya mem-BA-wa A-nak A-nak-nya - `sepupu` = anh/chị/em họ; `anak-anaknya` = các con của người đó.",
          "Lỗi người Việt: muốn phân biệt anh họ/chị họ/em họ như tiếng Việt. Tiếng Indonesia thường chỉ nói chung `sepupu`.",
          "Luyện: `Sepupu saya membawa anak-anaknya.`",
        ],
        pronunciation_focus_en: [
          "se-PU-pu SA-ya mem-BA-wa A-nak A-nak-nya - `sepupu` = cousin; `anak-anaknya` = his/her children.",
          "VN-speaker trap: trying to encode older male/female/younger cousin like Vietnamese. Indonesian often just says `sepupu`.",
          "Drill: `Sepupu saya membawa anak-anaknya.`",
        ],
      },
      {
        en: "Saya agak gugup bertemu mertua untuk pertama kali.",
        vi: "Tôi hơi hồi hộp khi gặp bố mẹ vợ/chồng lần đầu.",
        pronunciation_focus: [
          "SA-ya A-gak GU-gup ber-TE-mu mer-TU-a un-TUK per-TA-ma KA-li - `mertua` = bố mẹ chồng/vợ; `agak gugup` = hơi hồi hộp.",
          "Lỗi người Việt: dịch riêng bố chồng/mẹ vợ quá sớm. Nếu chưa cần chi tiết, `mertua` là từ chung tự nhiên.",
          "Luyện: `Saya agak gugup bertemu mertua.`",
        ],
        pronunciation_focus_en: [
          "SA-ya A-gak GU-gup ber-TE-mu mer-TU-a un-TUK per-TA-ma KA-li - `mertua` = in-laws/parents-in-law; `agak gugup` = a bit nervous.",
          "VN-speaker trap: over-specifying father-in-law/mother-in-law too early. If detail is not needed, `mertua` is the natural broad word.",
          "Drill: `Saya agak gugup bertemu mertua.`",
        ],
      },
      {
        en: "Jangan lupa bawa oleh-oleh untuk keluarga.",
        vi: "Đừng quên mang quà đặc sản/quà từ chuyến đi cho gia đình.",
        pronunciation_focus: [
          "JA-ngan LU-pa BA-wa O-leh O-leh un-TUK ke-LU-ar-ga - `oleh-oleh` = quà mang về/đặc sản; dạng lặp cố định.",
          "Lỗi người Việt: dùng `hadiah` cho mọi loại quà. Quà đi xa mang về cho người nhà thường là `oleh-oleh`.",
          "Luyện: `Bawa oleh-oleh untuk keluarga.`",
        ],
        pronunciation_focus_en: [
          "JA-ngan LU-pa BA-wa O-leh O-leh un-TUK ke-LU-ar-ga - `oleh-oleh` = souvenir/food gift brought back; fixed reduplicated form.",
          "VN-speaker trap: using `hadiah` for every gift. A trip gift brought back for family is usually `oleh-oleh`.",
          "Drill: `Bawa oleh-oleh untuk keluarga.`",
        ],
      },
      {
        en: "Kami makan bersama setelah semua orang datang.",
        vi: "Chúng tôi ăn cùng nhau sau khi mọi người đến đủ.",
        pronunciation_focus: [
          "KA-mi MA-kan ber-SA-ma se-TE-lah se-MU-a O-rang DA-tang - `makan bersama` = ăn cùng nhau; `setelah` = sau khi.",
          "Lỗi người Việt: nói `makan sama-sama` được trong nói thân mật, nhưng `makan bersama` gọn và lịch sự hơn.",
          "Luyện: `Kami makan bersama.`",
        ],
        pronunciation_focus_en: [
          "KA-mi MA-kan ber-SA-ma se-TE-lah se-MU-a O-rang DA-tang - `makan bersama` = eat together; `setelah` = after.",
          "VN-speaker trap: `makan sama-sama` is colloquial and understood, but `makan bersama` is cleaner and more polite.",
          "Drill: `Kami makan bersama.`",
        ],
      },
      {
        en: "Biasanya ada arisan keluarga setiap bulan.",
        vi: "Thường có buổi arisan/hụi gia đình mỗi tháng.",
        pronunciation_focus: [
          "bi-A-sa-nya A-da a-RI-san ke-LU-ar-ga se-TI-ap BU-lan - `arisan` = hụi/hội góp tiền xoay vòng kiêm gặp mặt.",
          "Lỗi người Việt: dịch `arisan` chỉ là 'tiết kiệm'. Đây cũng là dịp xã giao, ăn uống và cập nhật tin gia đình.",
          "Luyện: `Ada arisan keluarga setiap bulan.`",
        ],
        pronunciation_focus_en: [
          "bi-A-sa-nya A-da a-RI-san ke-LU-ar-ga se-TI-ap BU-lan - `arisan` = rotating savings/social gathering.",
          "VN-speaker trap: translating `arisan` only as savings. It is also a social event with food and family updates.",
          "Drill: `Ada arisan keluarga setiap bulan.`",
        ],
      },
      {
        en: "Bulan ini giliran Tante Rina yang menjadi tuan rumah.",
        vi: "Tháng này đến lượt cô Rina làm chủ nhà.",
        pronunciation_focus: [
          "BU-lan I-ni gi-LI-ran TAN-te RI-na yang men-JA-di TU-an RU-mah - `giliran` = đến lượt; `tuan rumah` = chủ nhà/người tổ chức.",
          "Lỗi người Việt: dịch 'chủ nhà' thành `pemilik rumah`. Trong sự kiện, host là `tuan rumah`.",
          "Luyện: `Giliran Tante Rina menjadi tuan rumah.`",
        ],
        pronunciation_focus_en: [
          "BU-lan I-ni gi-LI-ran TAN-te RI-na yang men-JA-di TU-an RU-mah - `giliran` = turn; `tuan rumah` = host.",
          "VN-speaker trap: translating host as `pemilik rumah` (house owner). For an event, host is `tuan rumah`.",
          "Drill: `Giliran Tante Rina menjadi tuan rumah.`",
        ],
      },
      {
        en: "Anak-anak sungkem kepada kakek dan nenek saat Lebaran.",
        vi: "Trẻ/con cháu làm lễ sungkem với ông bà vào dịp Lebaran.",
        pronunciation_focus: [
          "A-nak A-nak SUNG-kem ke-PA-da KA-kek dan NE-nek SA-at le-BA-ran - `sungkem` = quỳ/cúi kính lễ xin phúc/tha lỗi với người lớn.",
          "Lỗi người Việt: dịch `sungkem` là chào thường. Đây là nghi thức kính trọng, nhất là trong gia đình Java và dịp Lebaran.",
          "Luyện: `Anak-anak sungkem kepada kakek dan nenek.`",
        ],
        pronunciation_focus_en: [
          "A-nak A-nak SUNG-kem ke-PA-da KA-kek dan NE-nek SA-at le-BA-ran - `sungkem` = kneel/bow respectfully to elders for blessing/forgiveness.",
          "VN-speaker trap: translating `sungkem` as ordinary greeting. It is a respect ritual, especially in Javanese families and at Lebaran.",
          "Drill: `Anak-anak sungkem kepada kakek dan nenek.`",
        ],
      },
      {
        en: "Saya memanggil kakak sepupu dengan sebutan Mas.",
        vi: "Tôi gọi anh họ bằng cách xưng hô Mas.",
        pronunciation_focus: [
          "SA-ya me-MANG-gil KA-kak se-PU-pu de-NGAN se-BU-tan Mas - `sebutan` = cách gọi/xưng hô; `Mas` = anh/nam lớn tuổi hơn.",
          "Lỗi người Việt: dùng `kamu` với họ hàng lớn tuổi. Với người lớn hơn, dùng tên kèm `Mas`, `Mbak`, `Kak`, `Pak`, `Bu`.",
          "Luyện: `Saya memanggil kakak sepupu dengan sebutan Mas.`",
        ],
        pronunciation_focus_en: [
          "SA-ya me-MANG-gil KA-kak se-PU-pu de-NGAN se-BU-tan Mas - `sebutan` = form of address; `Mas` = older brother/older man.",
          "VN-speaker trap: using `kamu` with older relatives. For older people, use names with `Mas`, `Mbak`, `Kak`, `Pak`, or `Bu`.",
          "Drill: `Saya memanggil kakak sepupu dengan sebutan Mas.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong văn hóa Indonesia, `kumpul keluarga` thường là dịp ăn chung, gặp họ hàng xa, mang `oleh-oleh`, và cập nhật chuyện gia đình. `Arisan keluarga` vừa là hình thức góp tiền xoay vòng vừa là lý do để gặp nhau định kỳ. Trong một số gia đình, đặc biệt dịp Lebaran hoặc gia đình Java, con cháu có thể `sungkem` với ông bà/cha mẹ để xin phúc lành hoặc xin lỗi. Cách xưng hô rất quan trọng: dùng `Mas`, `Mbak`, `Kak`, `Pak`, `Bu`, `Tante`, `Om` theo tuổi và quan hệ.",
    cultural_notes_en:
      "In Indonesian culture, `kumpul keluarga` often means eating together, seeing extended relatives, bringing `oleh-oleh`, and catching up on family news. `Arisan keluarga` is both a rotating savings practice and a reason to meet regularly. In some families, especially around Lebaran or in Javanese settings, children may `sungkem` to grandparents/parents to ask blessing or forgiveness. Address forms matter: use `Mas`, `Mbak`, `Kak`, `Pak`, `Bu`, `Tante`, `Om` according to age and relationship.",
    tip_advice_vi:
      "Mẹo cho người Việt: bản năng xưng hô theo tuổi rất hữu ích, nhưng đừng bê nguyên hệ thống Việt sang. `Sepupu` không bắt buộc nói rõ anh/chị/em họ; `mertua` là bố mẹ vợ/chồng nói chung; `saudara` có thể rộng hơn anh chị em ruột. Phân biệt `kami` = chúng tôi không gồm người nghe và `kita` = chúng ta có gồm người nghe khi nói chuyện gia đình.",
    tip_advice_en:
      "Tip for Vietnamese speakers: your age-based address instinct helps, but do not copy the Vietnamese kinship system one-to-one. `Sepupu` does not require older/younger/male/female cousin; `mertua` broadly means parents-in-law; `saudara` can be wider than siblings. Keep `kami` = we excluding the listener and `kita` = we including the listener separate in family talk.",
    vocabulary: [
      {
        cell_id: "d446d272-7b88-42c9-a620-05d180671b92",
        word: "kumpul keluarga",
        en: "family gathering",
        vi: "họp mặt gia đình",
        pos: "noun phrase",
        pronunciation_vi: "KUM-pul ke-LU-ar-ga",
        pronunciation_en: "KOOM-pool ke-LOO-ar-ga",
      },
      {
        cell_id: "3398417b-d8f5-47ff-bc2c-3bb023a1429e",
        word: "saudara",
        en: "sibling / relative",
        vi: "anh chị em / họ hàng",
        pos: "noun",
        pronunciation_vi: "sau-DA-ra",
        pronunciation_en: "sau-DA-ra",
      },
      {
        cell_id: "0efac4e6-65de-4bcd-9ff0-e3b8d933ad68",
        word: "sepupu",
        en: "cousin",
        vi: "anh/chị/em họ",
        pos: "noun",
        pronunciation_vi: "se-PU-pu",
        pronunciation_en: "se-POO-poo",
      },
      {
        cell_id: "ba611bf4-ba71-46cb-87e8-3a40be2f4df6",
        word: "mertua",
        en: "parents-in-law",
        vi: "bố mẹ vợ/chồng",
        pos: "noun",
        pronunciation_vi: "mer-TU-a",
        pronunciation_en: "mer-TOO-a",
      },
      {
        cell_id: "b9f1e6df-2cf4-4edf-a38a-afec205e30ff",
        word: "arisan",
        en: "rotating savings/social gathering",
        vi: "hụi / buổi góp tiền xoay vòng",
        pos: "noun",
        pronunciation_vi: "a-RI-san",
        pronunciation_en: "a-REE-san",
      },
      {
        cell_id: "2bbdd219-1456-4432-b92b-2c85a8f05417",
        word: "makan bersama",
        en: "eat together",
        vi: "ăn cùng nhau",
        pos: "verb phrase",
        pronunciation_vi: "MA-kan ber-SA-ma",
        pronunciation_en: "MA-kan ber-SA-ma",
      },
      {
        cell_id: "a6c1fa1a-ac59-4a62-9e05-b776bca6bc90",
        word: "oleh-oleh",
        en: "souvenir / gift brought back",
        vi: "quà mang về / đặc sản",
        pos: "noun",
        pronunciation_vi: "O-leh O-leh",
        pronunciation_en: "OH-leh OH-leh",
      },
      {
        cell_id: "a5bf4702-4d35-47b7-b972-39c148fb4cb4",
        word: "sungkem",
        en: "kneel/bow respectfully to elders",
        vi: "lễ cúi/quỳ kính người lớn",
        pos: "verb/noun",
        pronunciation_vi: "SUNG-kem",
        pronunciation_en: "SOONG-kem",
      },
      {
        cell_id: "ef94764d-a1aa-4c98-b2af-b84e4681f729",
        word: "tuan rumah",
        en: "host",
        vi: "chủ nhà / người tổ chức",
        pos: "noun phrase",
        pronunciation_vi: "TU-an RU-mah",
        pronunciation_en: "TOO-an ROO-mah",
      },
      {
        cell_id: "c0547e44-197b-4bed-818c-657ac498345c",
        word: "giliran",
        en: "turn",
        vi: "lượt",
        pos: "noun",
        pronunciation_vi: "gi-LI-ran",
        pronunciation_en: "gi-LEE-ran",
      },
    ],
    dialogue: [
      {
        cell_id: "eb68ace4-7806-4985-a7fd-bc550a667482",
        speaker: "Linh",
        text: "Akhir pekan ini ada kumpul keluarga di rumah nenek, ya?",
        vi: "Cuối tuần này có họp mặt gia đình ở nhà bà đúng không?",
        en: "There is a family gathering at grandma's house this weekend, right?",
      },
      {
        cell_id: "9734bbe2-679b-4579-8578-1559febfa474",
        speaker: "Raka",
        text: "Iya. Banyak saudara dan sepupu datang dari luar kota.",
        vi: "Đúng rồi. Nhiều họ hàng và anh chị em họ đến từ ngoài thành phố.",
        en: "Yes. Many relatives and cousins are coming from out of town.",
      },
      {
        cell_id: "7a46a5be-919c-48e4-ab4d-c61e4756367b",
        speaker: "Linh",
        text: "Saya harus bawa apa? Oleh-oleh cukup?",
        vi: "Tôi nên mang gì? Quà đặc sản là đủ không?",
        en: "What should I bring? Are souvenirs/food gifts enough?",
      },
      {
        cell_id: "259d0479-8648-4585-82e0-eee71f17acdf",
        speaker: "Raka",
        text: "Cukup. Nanti kita makan bersama, lalu ada arisan keluarga.",
        vi: "Đủ rồi. Lát nữa chúng ta ăn cùng nhau, rồi có arisan gia đình.",
        en: "Enough. Later we will eat together, then there is a family arisan.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về họp mặt gia đình:",
        instruction_en: "Fill in the family-gathering word:",
        items: [
          {
            prompt: "Akhir pekan ini kami ___ keluarga di rumah nenek. (họp mặt)",
            answer: "kumpul",
            options: ["kumpul", "kunci", "kirim"],
          },
          {
            prompt: "Jangan lupa bawa ___ untuk keluarga. (quà mang về)",
            answer: "oleh-oleh",
            options: ["oleh-oleh", "orang-orang", "omong-omong"],
          },
          {
            prompt: "Biasanya ada ___ keluarga setiap bulan. (hụi/gặp mặt)",
            answer: "arisan",
            options: ["arisan", "alasan", "aturan"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "sepupu", answer: "anh/chị/em họ" },
          { prompt: "mertua", answer: "bố mẹ vợ/chồng" },
          { prompt: "tuan rumah", answer: "chủ nhà / người tổ chức" },
          { prompt: "sungkem", answer: "lễ cúi/quỳ kính người lớn" },
          { prompt: "makan bersama", answer: "ăn cùng nhau" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          {
            prompt: "Cuối tuần này chúng tôi họp mặt gia đình ở nhà bà.",
            answer: "Akhir pekan ini kami kumpul keluarga di rumah nenek.",
          },
          {
            prompt: "Anh/chị/em họ của tôi mang con cái theo.",
            answer: "Sepupu saya membawa anak-anaknya.",
          },
          {
            prompt: "Chúng tôi ăn cùng nhau sau khi mọi người đến.",
            answer: "Kami makan bersama setelah semua orang datang.",
          },
        ],
      },
    ],
  },
];
