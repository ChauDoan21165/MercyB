// Batik & Traditional Clothes Indonesian (Vietnamese -> Indonesian study track).
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
    id: "indonesian_batik_traditional_clothes",
    level: "A2",
    category: "culture",
    title_vi: "Batik và trang phục truyền thống Indonesia",
    title_en: "Batik and Indonesian traditional clothes",
    sentences: [
      {
        en: "Saya mau beli kemeja batik untuk acara resmi.",
        vi: "Tôi muốn mua áo sơ mi batik cho sự kiện trang trọng.",
        pronunciation_focus: [
          "SA-ya mau BE-li ke-ME-ja BA-tik un-TUK a-CHA-ra res-MI - `batik` = vải/áo họa tiết batik; `acara resmi` = sự kiện trang trọng.",
          "Lỗi người Việt: nói `baju formal` được hiểu, nhưng `acara resmi` tự nhiên hơn khi nói lý do mặc.",
          "Luyện: `Saya mau beli kemeja batik untuk acara resmi.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau BE-li ke-ME-ja BA-tik un-TUK a-CHA-ra res-MI - `batik` = batik cloth/shirt; `acara resmi` = formal event.",
          "VN-speaker trap: `baju formal` is understood, but `acara resmi` is more natural when giving the reason for dressing up.",
          "Drill: `Saya mau beli kemeja batik untuk acara resmi.`",
        ],
      },
      {
        en: "Motif batik ini kelihatan elegan.",
        vi: "Họa tiết batik này trông thanh lịch.",
        pronunciation_focus: [
          "MO-tif BA-tik I-ni ke-li-HA-tan e-le-GAN - `motif` = họa tiết; `kelihatan` = trông/có vẻ.",
          "Lỗi người Việt: dịch 'nhìn' thành `lihat`. Khi nói 'trông có vẻ', dùng `kelihatan`.",
          "Luyện: `Motif batik ini kelihatan elegan.`",
        ],
        pronunciation_focus_en: [
          "MO-tif BA-tik I-ni ke-li-HA-tan e-le-GAN - `motif` = pattern; `kelihatan` = looks/seems.",
          "VN-speaker trap: translating 'looks' as `lihat`. For 'it looks/seems', use `kelihatan`.",
          "Drill: `Motif batik ini kelihatan elegan.`",
        ],
      },
      {
        en: "Apakah ukuran M masih ada?",
        vi: "Cỡ M còn không?",
        pronunciation_focus: [
          "a-PA-kah u-KU-ran em MA-sih A-da - `ukuran` = kích cỡ; `masih ada` = vẫn còn/còn hàng.",
          "Lỗi người Việt: hỏi `ada M tidak?` cũng được, nhưng `ukuran M masih ada?` rõ và lịch sự hơn.",
          "Luyện: `Ukuran M masih ada?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah u-KU-ran M MA-sih A-da - `ukuran` = size; `masih ada` = still available/in stock.",
          "VN-speaker trap: `ada M tidak?` works, but `ukuran M masih ada?` is clearer and more polite.",
          "Drill: `Ukuran M masih ada?`",
        ],
      },
      {
        en: "Kebaya ini cocok untuk kondangan.",
        vi: "Áo kebaya này hợp để đi đám cưới.",
        pronunciation_focus: [
          "ke-BA-ya I-ni CO-cok un-TUK kon-DA-ngan - `kebaya` = áo truyền thống nữ; `kondangan` = đi dự đám cưới/tiệc mời.",
          "Lỗi người Việt: đọc `cocok` như ko-kok. Chữ `c` Indonesia = 'ch': CHO-chok.",
          "Luyện: `Kebaya ini cocok untuk kondangan.`",
        ],
        pronunciation_focus_en: [
          "ke-BA-ya I-ni CHO-chok un-TUK kon-DA-ngan - `kebaya` = traditional women's blouse; `kondangan` = attending a wedding/invited event.",
          "VN-speaker trap: reading `cocok` as ko-kok. Indonesian `c` = 'ch': CHO-chok.",
          "Drill: `Kebaya ini cocok untuk kondangan.`",
        ],
      },
      {
        en: "Sarung biasanya dipakai untuk salat atau acara adat.",
        vi: "Sarong thường được mặc để cầu nguyện hoặc trong nghi lễ truyền thống.",
        pronunciation_focus: [
          "SA-rung bi-A-sa-nya di-PA-kai un-TUK SA-lat A-tau a-CHA-ra A-dat - `dipakai` = được mặc/dùng; `adat` = phong tục truyền thống.",
          "Lỗi người Việt: chỉ hiểu `sarung` là đồ đi biển. Ở Indonesia, sarung cũng dùng trong tôn giáo và nghi lễ.",
          "Luyện: `Sarung dipakai untuk salat.`",
        ],
        pronunciation_focus_en: [
          "SA-roong bi-A-sa-nya di-PA-kai un-TUK SA-lat A-tau a-CHA-ra A-dat - `dipakai` = worn/used; `adat` = traditional custom.",
          "VN-speaker trap: thinking `sarung` is only beachwear. In Indonesia it is also used in religious and ceremonial contexts.",
          "Drill: `Sarung dipakai untuk salat.`",
        ],
      },
      {
        en: "Pakaian adat setiap daerah berbeda-beda.",
        vi: "Trang phục truyền thống của mỗi vùng khác nhau.",
        pronunciation_focus: [
          "pa-KAI-an A-dat se-TI-ap DA-e-rah ber-BE-da BE-da - `pakaian adat` = trang phục truyền thống; `berbeda-beda` = khác nhau.",
          "Lỗi người Việt: nói `baju tradisional Indonesia` như một kiểu duy nhất. Indonesia có nhiều vùng và nhiều trang phục adat.",
          "Luyện: `Pakaian adat setiap daerah berbeda-beda.`",
        ],
        pronunciation_focus_en: [
          "pa-KAI-an A-dat se-TI-ap DA-e-rah ber-BE-da BE-da - `pakaian adat` = traditional clothing; `berbeda-beda` = varies/different.",
          "VN-speaker trap: saying `Indonesian traditional clothes` as if there is only one style. Indonesia has many regions and adat outfits.",
          "Drill: `Pakaian adat setiap daerah berbeda-beda.`",
        ],
      },
      {
        en: "Baju ini sopan untuk bertemu keluarga.",
        vi: "Bộ đồ này lịch sự/kín đáo để gặp gia đình.",
        pronunciation_focus: [
          "BA-ju I-ni SO-pan un-TUK ber-TE-mu ke-LU-ar-ga - `sopan` = lịch sự, đúng mực, kín đáo.",
          "Lỗi người Việt: dịch `sopan` chỉ là 'lễ phép'. Với quần áo, `sopan` còn nghĩa là kín đáo/phù hợp.",
          "Luyện: `Baju ini sopan.`",
        ],
        pronunciation_focus_en: [
          "BA-joo I-ni SO-pan un-TUK ber-TE-mu ke-LU-ar-ga - `sopan` = polite/proper/modest.",
          "VN-speaker trap: translating `sopan` only as 'polite'. For clothing it also means modest/appropriate.",
          "Drill: `Baju ini sopan.`",
        ],
      },
      {
        en: "Saya perlu penjahit untuk mengecilkan kebaya.",
        vi: "Tôi cần thợ may để sửa áo kebaya nhỏ lại.",
        pronunciation_focus: [
          "SA-ya per-LU pen-JA-hit un-TUK me-nge-CHIL-kan ke-BA-ya - `penjahit` = thợ may; `mengecilkan` = làm nhỏ lại.",
          "Lỗi người Việt: nói `membuat kecil` nghe vụng. Khi sửa cỡ áo, dùng `mengecilkan` hoặc `memperbesar`.",
          "Luyện: `Saya perlu penjahit.`",
        ],
        pronunciation_focus_en: [
          "SA-ya per-LOO pen-JA-hit un-TUK me-nge-CHIL-kan ke-BA-ya - `penjahit` = tailor; `mengecilkan` = make smaller.",
          "VN-speaker trap: saying `membuat kecil`, which sounds clumsy. For alteration, use `mengecilkan` or `memperbesar`.",
          "Drill: `Saya perlu penjahit.`",
        ],
      },
      {
        en: "Batik tulis biasanya lebih mahal daripada batik cap.",
        vi: "Batik vẽ tay thường đắt hơn batik in/dập khuôn.",
        pronunciation_focus: [
          "BA-tik TU-lis bi-A-sa-nya le-BIH MA-hal da-ri-PA-da BA-tik chap - `batik tulis` = batik vẽ tay; `batik cap` = batik dập khuôn.",
          "Lỗi người Việt: đọc `cap` như tiếng Anh 'cap'. Trong Indonesia, `c` = ch: `chap`.",
          "Luyện: `Batik tulis lebih mahal daripada batik cap.`",
        ],
        pronunciation_focus_en: [
          "BA-tik TU-lis bi-A-sa-nya le-BIH MA-hal da-ri-PA-da BA-tik chap - `batik tulis` = hand-drawn batik; `batik cap` = stamped batik.",
          "VN-speaker trap: reading `cap` like English 'cap'. In Indonesian, `c` = ch: `chap`.",
          "Drill: `Batik tulis lebih mahal daripada batik cap.`",
        ],
      },
      {
        en: "Untuk acara kantor, batik lengan panjang lebih aman.",
        vi: "Với sự kiện công ty, áo batik tay dài an toàn/phù hợp hơn.",
        pronunciation_focus: [
          "un-TUK a-CHA-ra KAN-tor, BA-tik LE-ngan PAN-jang le-BIH A-man - `lengan panjang` = tay dài; `lebih aman` = chắc ăn/phù hợp hơn.",
          "Lỗi người Việt: dịch `aman` chỉ là an toàn vật lý. Trong lời khuyên trang phục, `lebih aman` = ít rủi ro, hợp hoàn cảnh.",
          "Luyện: `Batik lengan panjang lebih aman.`",
        ],
        pronunciation_focus_en: [
          "un-TUK a-CHA-ra KAN-tor, BA-tik LE-ngan PAN-jang le-BIH A-man - `lengan panjang` = long sleeves; `lebih aman` = safer/better bet.",
          "VN-speaker trap: translating `aman` only as physical safety. In clothing advice, `lebih aman` = lower-risk/more appropriate.",
          "Drill: `Batik lengan panjang lebih aman.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Batik là một biểu tượng văn hóa quan trọng ở Indonesia và được mặc trong nhiều hoàn cảnh: đi làm, dự họp, dự cưới, lễ trường học, hoặc sự kiện nhà nước. `Batik tulis` thường thủ công và đắt hơn; `batik cap` dùng khuôn dập; `batik printing` là in công nghiệp. `Kebaya` thường đi với kain/sarung trong dịp trang trọng, còn `sarung` cũng xuất hiện trong sinh hoạt tôn giáo và nghi lễ. Khi không chắc dress code, hỏi `pakaiannya harus formal atau batik?` là lịch sự.",
    cultural_notes_en:
      "Batik is an important cultural symbol in Indonesia and is worn in many settings: work, meetings, weddings, school ceremonies, and government events. `Batik tulis` is usually handmade and more expensive; `batik cap` uses a stamp; `batik printing` is industrial print. `Kebaya` is often paired with kain/sarung for formal occasions, while `sarung` also appears in religious and ceremonial life. When unsure about dress code, ask `pakaiannya harus formal atau batik?` politely.",
    tip_advice_vi:
      "Mẹo cho người Việt: `baju` là từ rộng cho áo/quần áo, `pakaian` trang trọng hơn, còn `pakaian adat` là trang phục truyền thống theo vùng. `Sopan` khi nói về quần áo không chỉ là lễ phép mà còn là kín đáo, đúng hoàn cảnh. Nhớ chữ `c` đọc như 'ch': `cocok`, `cap`, `acara`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: `baju` is a broad everyday word for clothes/shirt, `pakaian` is more formal, and `pakaian adat` means region-specific traditional dress. `Sopan` for clothing is not just polite; it means modest and appropriate. Remember `c` sounds like 'ch': `cocok`, `cap`, `acara`.",
    vocabulary: [
      {
        cell_id: "81f4e1c0-2d12-44a3-9d90-4411b755f796",
        word: "batik",
        en: "batik cloth/clothing",
        vi: "vải/áo batik",
        pos: "noun",
        pronunciation_vi: "BA-tik",
        pronunciation_en: "BA-tik",
      },
      {
        cell_id: "5e5ba54f-f35c-421d-97e8-108810d7ed8d",
        word: "kebaya",
        en: "traditional women's blouse",
        vi: "áo kebaya truyền thống",
        pos: "noun",
        pronunciation_vi: "ke-BA-ya",
        pronunciation_en: "ke-BA-ya",
      },
      {
        cell_id: "e00fb6a8-931c-4057-b155-9e4dc03ce505",
        word: "sarung",
        en: "sarong",
        vi: "sarong / váy quấn",
        pos: "noun",
        pronunciation_vi: "SA-rung",
        pronunciation_en: "SA-roong",
      },
      {
        cell_id: "fd69bf6d-eff0-47a9-b3d1-f9178543924b",
        word: "pakaian adat",
        en: "traditional clothing",
        vi: "trang phục truyền thống",
        pos: "noun phrase",
        pronunciation_vi: "pa-KAI-an A-dat",
        pronunciation_en: "pa-KAI-an A-dat",
      },
      {
        cell_id: "b1c09f33-74b6-4a13-8735-d63923c8d634",
        word: "motif",
        en: "pattern / motif",
        vi: "họa tiết",
        pos: "noun",
        pronunciation_vi: "MO-tif",
        pronunciation_en: "MO-tif",
      },
      {
        cell_id: "7caa4844-2a06-4215-8427-59ab2276829f",
        word: "acara resmi",
        en: "formal event",
        vi: "sự kiện trang trọng",
        pos: "noun phrase",
        pronunciation_vi: "a-CHA-ra res-MI",
        pronunciation_en: "a-CHA-ra res-MI",
      },
      {
        cell_id: "83cebc78-4cc0-4000-89be-d16b176ee354",
        word: "sopan",
        en: "polite / modest / appropriate",
        vi: "lịch sự / kín đáo / phù hợp",
        pos: "adjective",
        pronunciation_vi: "SO-pan",
        pronunciation_en: "SO-pan",
      },
      {
        cell_id: "e01d8dd3-cfe7-4451-80e2-8a9d2a066dc0",
        word: "ukuran",
        en: "size",
        vi: "kích cỡ",
        pos: "noun",
        pronunciation_vi: "u-KU-ran",
        pronunciation_en: "oo-KOO-ran",
      },
      {
        cell_id: "eb0028d0-378b-48ca-ba35-fb54cbde09d4",
        word: "penjahit",
        en: "tailor",
        vi: "thợ may",
        pos: "noun",
        pronunciation_vi: "pen-JA-hit",
        pronunciation_en: "pen-JA-hit",
      },
      {
        cell_id: "3c651bb6-ee27-4c28-a3f0-f37494717493",
        word: "cocok",
        en: "suitable / matches",
        vi: "hợp / phù hợp",
        pos: "adjective",
        pronunciation_vi: "CHO-chok",
        pronunciation_en: "CHO-chok",
      },
    ],
    dialogue: [
      {
        cell_id: "72e6a5e6-edbe-4239-be37-2471c85fd28d",
        speaker: "Pembeli",
        text: "Mbak, saya cari kemeja batik untuk acara kantor.",
        vi: "Chị ơi, tôi tìm áo sơ mi batik cho sự kiện công ty.",
        en: "Miss, I am looking for a batik shirt for an office event.",
      },
      {
        cell_id: "da0a1f87-a79e-4fef-bffd-c5f963432adc",
        speaker: "Penjual",
        text: "Boleh. Mau lengan panjang atau pendek?",
        vi: "Được ạ. Anh/chị muốn tay dài hay tay ngắn?",
        en: "Sure. Do you want long sleeves or short sleeves?",
      },
      {
        cell_id: "d1fe1a10-918e-4738-92b8-17faffd2092a",
        speaker: "Pembeli",
        text: "Lengan panjang lebih aman. Ukuran M masih ada?",
        vi: "Tay dài chắc phù hợp hơn. Cỡ M còn không?",
        en: "Long sleeves are a safer choice. Is size M still available?",
      },
      {
        cell_id: "87adf488-b7d5-48b8-af42-4a637f203dec",
        speaker: "Penjual",
        text: "Masih ada. Motif ini sopan dan cocok untuk acara resmi.",
        vi: "Vẫn còn. Họa tiết này lịch sự và hợp cho sự kiện trang trọng.",
        en: "It is still available. This pattern is modest and suitable for formal events.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về batik và trang phục:",
        instruction_en: "Fill in the clothing word:",
        items: [
          {
            prompt: "Saya mau beli kemeja ___ untuk acara resmi.",
            answer: "batik",
            options: ["batik", "batuk", "batu"],
          },
          {
            prompt: "Apakah ___ M masih ada? (kích cỡ)",
            answer: "ukuran",
            options: ["ukuran", "urusan", "undangan"],
          },
          {
            prompt: "Saya perlu ___ untuk mengecilkan kebaya. (thợ may)",
            answer: "penjahit",
            options: ["penjahit", "penjual", "pengantin"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "motif", answer: "họa tiết" },
          { prompt: "kebaya", answer: "áo kebaya truyền thống" },
          { prompt: "sarung", answer: "sarong / váy quấn" },
          { prompt: "sopan", answer: "lịch sự / kín đáo / phù hợp" },
          { prompt: "pakaian adat", answer: "trang phục truyền thống" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          {
            prompt: "Tôi muốn mua áo sơ mi batik cho sự kiện trang trọng.",
            answer: "Saya mau beli kemeja batik untuk acara resmi.",
          },
          {
            prompt: "Cỡ M còn không?",
            answer: "Ukuran M masih ada?",
          },
          {
            prompt: "Bộ đồ này lịch sự/kín đáo để gặp gia đình.",
            answer: "Baju ini sopan untuk bertemu keluarga.",
          },
        ],
      },
    ],
  },
];
