// Pet Adoption & Shelter Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It follows the established Indonesian extra
// lesson format: Indonesian target text lives in `en`, Vietnamese glosses live in
// `vi`, and each Vietnamese-facing learning note has an English companion.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus -- same length + order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
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
  speaker: string;
  /** Indonesian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
  en?: string;
};

// Loosely typed so per-type fields (translation, fill-blank, matching) can vary.
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
    id: "indonesian_pet_adoption_shelter",
    level: "B1",
    category: "daily-life",
    title_vi: "Nhận nuôi thú cưng từ shelter",
    title_en: "Pet adoption from a shelter",
    sentences: [
      {
        en: "Saya tertarik mengadopsi hewan dari shelter ini.",
        vi: "Tôi quan tâm đến việc nhận nuôi động vật từ shelter này.",
        pronunciation_focus: [
          "SA-ya ter-TA-rik meng-a-DOP-si HE-wan da-ri SHEL-ter I-ni -- `mengadopsi hewan` = nhận nuôi động vật.",
          "Lỗi người Việt: nói `membeli hewan` khi ý là nhận nuôi. Ở shelter, dùng `mengadopsi`, không nhấn vào mua bán.",
          "Luyện: `Saya tertarik mengadopsi hewan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya ter-TA-rik meng-a-DOP-si HE-wan da-ri SHEL-ter EE-ni -- `mengadopsi hewan` = adopt an animal.",
          "VN-speaker trap: saying `membeli hewan` when you mean adoption. At a shelter, use `mengadopsi`, not buying language.",
          "Drill: `Saya tertarik mengadopsi hewan.`",
        ],
      },
      {
        en: "Apakah kucing ini sudah divaksin?",
        vi: "Con mèo này đã được tiêm vắc-xin chưa?",
        pronunciation_focus: [
          "A-pa-kah KU-ching I-ni SU-dah di-VAK-sin -- `divaksin` = được tiêm vắc-xin; `sudah` = đã.",
          "Mẹo: hỏi tình trạng y tế bằng bị động `di-`: `divaksin`, `diperiksa`, `disteril`.",
          "Luyện: `Apakah kucing ini sudah divaksin?`",
        ],
        pronunciation_focus_en: [
          "A-pa-kah KOO-ching EE-ni SOO-dah di-VAK-sin -- `divaksin` = vaccinated; `sudah` = already.",
          "Tip: ask about medical status with `di-` passives: `divaksin`, `diperiksa`, `disteril`.",
          "Drill: `Apakah kucing ini sudah divaksin?`",
        ],
      },
      {
        en: "Anjing itu sudah steril atau belum?",
        vi: "Con chó đó đã triệt sản hay chưa?",
        pronunciation_focus: [
          "AN-jing I-tu SU-dah STE-ril A-tau be-LUM -- `steril` = triệt sản trong ngữ cảnh thú cưng.",
          "`sudah atau belum?` là khung hỏi 'đã hay chưa' rất tự nhiên, ngắn hơn câu dịch từng chữ.",
          "Luyện: `Sudah steril atau belum?`",
        ],
        pronunciation_focus_en: [
          "AN-jing EE-too SOO-dah STE-ril A-tau be-LOOM -- `steril` = spayed/neutered in pet contexts.",
          "`Sudah atau belum?` is a natural 'already or not yet?' frame, shorter than literal translation.",
          "Drill: `Sudah steril atau belum?`",
        ],
      },
      {
        en: "Berapa biaya adopsi dan apa saja yang termasuk?",
        vi: "Phí nhận nuôi là bao nhiêu và bao gồm những gì?",
        pronunciation_focus: [
          "be-RA-pa BI-a-ya a-DOP-si dan A-pa SA-ja yang ter-MA-suk -- `biaya adopsi` = phí nhận nuôi; `apa saja` = những mục nào.",
          "Lỗi người Việt: hỏi `apa termasuk?` hơi cụt. Dùng `apa saja yang termasuk?` để hỏi danh sách đầy đủ.",
          "Luyện: `Berapa biaya adopsi?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa BEE-a-ya a-DOP-si dan A-pa SA-ja yang ter-MA-suk -- `biaya adopsi` = adoption fee; `apa saja` = what items.",
          "VN-speaker trap: asking `apa termasuk?`, which sounds clipped. Use `apa saja yang termasuk?` for the full list.",
          "Drill: `Berapa biaya adopsi?`",
        ],
      },
      {
        en: "Saya ingin bertemu dulu dengan hewan yang akan diadopsi.",
        vi: "Tôi muốn gặp trước con vật sẽ được nhận nuôi.",
        pronunciation_focus: [
          "SA-ya I-ngin ber-TE-mu DU-lu DE-ngan HE-wan yang A-kan di-a-DOP-si -- `bertemu dulu` = gặp trước.",
          "`yang akan diadopsi` dùng bị động để nói con vật sẽ được nhận nuôi, rất hợp trong thủ tục shelter.",
          "Luyện: `Saya ingin bertemu dulu.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin ber-TE-mu DOO-lu DE-ngan HE-wan yang A-kan di-a-DOP-si -- `bertemu dulu` = meet first.",
          "`Yang akan diadopsi` uses passive wording for the animal that will be adopted, natural in shelter procedures.",
          "Drill: `Saya ingin bertemu dulu.`",
        ],
      },
      {
        en: "Apa saja tanggung jawab pemilik setelah adopsi?",
        vi: "Sau khi nhận nuôi, trách nhiệm của chủ nuôi gồm những gì?",
        pronunciation_focus: [
          "A-pa SA-ja tang-GUNG JA-wab pe-MI-lik se-TE-lah a-DOP-si -- `tanggung jawab pemilik` = trách nhiệm của chủ nuôi.",
          "Mẹo: `pemilik` = người sở hữu/chủ; trong thú cưng tự nhiên hơn `majikan`.",
          "Luyện: `Apa tanggung jawab pemilik?`",
        ],
        pronunciation_focus_en: [
          "A-pa SA-ja tang-GOONG JA-wab pe-MEE-lik se-TE-lah a-DOP-si -- `tanggung jawab pemilik` = owner's responsibility.",
          "Tip: `pemilik` = owner; for pets it is more natural than `majikan`.",
          "Drill: `Apa tanggung jawab pemilik?`",
        ],
      },
      {
        en: "Apakah shelter melakukan kunjungan rumah setelah adopsi?",
        vi: "Shelter có đến thăm nhà sau khi nhận nuôi không?",
        pronunciation_focus: [
          "A-pa-kah SHEL-ter me-la-KU-kan kun-JUNG-an RU-mah se-TE-lah a-DOP-si -- `kunjungan rumah` = thăm nhà.",
          "Một số shelter muốn kiểm tra môi trường sống; câu này hỏi lịch sự về quy trình, không mang giọng phòng thủ.",
          "Luyện: `Apakah ada kunjungan rumah?`",
        ],
        pronunciation_focus_en: [
          "A-pa-kah SHEL-ter me-la-KOO-kan kun-JOONG-an ROO-mah se-TE-lah a-DOP-si -- `kunjungan rumah` = home visit.",
          "Some shelters check the living environment; this asks politely about the procedure without sounding defensive.",
          "Drill: `Apakah ada kunjungan rumah?`",
        ],
      },
      {
        en: "Saya siap memberi makan, vaksin rutin, dan tempat yang aman.",
        vi: "Tôi sẵn sàng cho ăn, tiêm vắc-xin định kỳ, và cung cấp nơi an toàn.",
        pronunciation_focus: [
          "SA-ya SI-ap mem-BE-ri MA-kan, VAK-sin ru-TIN, dan TEM-pat yang A-man -- `siap` = sẵn sàng; `rutin` = định kỳ.",
          "Lỗi người Việt: nói `kasih makan` được trong nói thân mật, nhưng `memberi makan` nghe chăm sóc và nghiêm túc hơn khi phỏng vấn adoption.",
          "Luyện: `Saya siap memberi makan dan vaksin rutin.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SEE-ap mem-BE-ri MA-kan, VAK-sin ru-TEEN, dan TEM-pat yang A-man -- `siap` = ready; `rutin` = routine/regular.",
          "VN-speaker trap: `kasih makan` is fine casually, but `memberi makan` sounds more caring and serious in adoption screening.",
          "Drill: `Saya siap memberi makan dan vaksin rutin.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `shelter` và cộng đồng penyelamat hewan thường hỏi người nhận nuôi về điều kiện nhà, lịch chăm sóc, biaya adopsi, vaksin, steril, và cam kết không bỏ rơi thú cưng. Một số nơi yêu cầu formulir adopsi, wawancara singkat, kunjungan rumah, hoặc cập nhật ảnh sau khi adopsi. Dùng giọng nghiêm túc và tôn trọng vì đây là cam kết chăm sóc lâu dài, không phải mua một món đồ.",
    cultural_notes_en:
      "In Indonesia, shelters and animal-rescue communities often ask adopters about home conditions, care schedule, adoption fees, vaccination, sterilization, and a commitment not to abandon the pet. Some require an adoption form, a short interview, a home visit, or photo updates after adoption. Use a serious and respectful tone because this is a long-term care commitment, not buying an item.",
    tip_advice_vi:
      "Mẹo cho người Việt: học các cụm thủ tục `mengadopsi hewan`, `biaya adopsi`, `sudah divaksin`, `sudah steril`, `kunjungan rumah`, và `tanggung jawab pemilik`. Khi hỏi, dùng `apakah` hoặc `apa saja` để nghe lịch sự. Khi nói về chăm sóc, dùng `saya siap...` để thể hiện cam kết.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn procedure chunks: `mengadopsi hewan`, `biaya adopsi`, `sudah divaksin`, `sudah steril`, `kunjungan rumah`, and `tanggung jawab pemilik`. When asking, use `apakah` or `apa saja` to sound polite. When talking about care, use `saya siap...` to show commitment.",
    vocabulary: [
      {
        word: "adopsi hewan",
        en: "pet/animal adoption",
        vi: "nhận nuôi động vật",
        pos: "noun phrase",
        pronunciation_vi: "a-DOP-si HE-wan",
        pronunciation_en: "a-DOP-si HE-wan",
      },
      {
        word: "shelter",
        en: "animal shelter",
        vi: "trạm/cơ sở cứu hộ động vật",
        pos: "noun",
        pronunciation_vi: "SHEL-ter",
        pronunciation_en: "SHEL-ter",
      },
      {
        word: "vaksin",
        en: "vaccine; vaccination",
        vi: "vắc-xin / tiêm vắc-xin",
        pos: "noun / verb",
        pronunciation_vi: "VAK-sin",
        pronunciation_en: "VAK-sin",
      },
      {
        word: "steril",
        en: "spayed/neutered",
        vi: "đã triệt sản",
        pos: "adjective",
        pronunciation_vi: "STE-ril",
        pronunciation_en: "STE-ril",
      },
      {
        word: "biaya adopsi",
        en: "adoption fee",
        vi: "phí nhận nuôi",
        pos: "noun phrase",
        pronunciation_vi: "BI-a-ya a-DOP-si",
        pronunciation_en: "BEE-a-ya a-DOP-si",
      },
      {
        word: "kucing",
        en: "cat",
        vi: "mèo",
        pos: "noun",
        pronunciation_vi: "KU-ching",
        pronunciation_en: "KOO-ching",
      },
      {
        word: "anjing",
        en: "dog",
        vi: "chó",
        pos: "noun",
        pronunciation_vi: "AN-jing",
        pronunciation_en: "AN-jing",
      },
      {
        word: "tanggung jawab pemilik",
        en: "owner's responsibility",
        vi: "trách nhiệm của chủ nuôi",
        pos: "noun phrase",
        pronunciation_vi: "tang-GUNG JA-wab pe-MI-lik",
        pronunciation_en: "tang-GOONG JA-wab pe-MEE-lik",
      },
    ],
    dialogue: [
      {
        speaker: "Calon adopter",
        text: "Permisi, saya tertarik mengadopsi kucing yang ada di foto ini.",
        vi: "Xin phép, tôi quan tâm đến việc nhận nuôi con mèo trong ảnh này.",
        en: "Excuse me, I am interested in adopting the cat in this photo.",
      },
      {
        speaker: "Petugas shelter",
        text: "Boleh. Kucing ini sudah divaksin dan sudah steril.",
        vi: "Được. Con mèo này đã tiêm vắc-xin và đã triệt sản.",
        en: "Sure. This cat has been vaccinated and sterilized.",
      },
      {
        speaker: "Calon adopter",
        text: "Berapa biaya adopsinya, dan apakah ada formulir yang harus saya isi?",
        vi: "Phí nhận nuôi là bao nhiêu, và có mẫu đơn nào tôi phải điền không?",
        en: "How much is the adoption fee, and is there a form I need to fill out?",
      },
      {
        speaker: "Petugas shelter",
        text: "Ada formulir singkat dan kami akan menanyakan kondisi rumah Anda.",
        vi: "Có một mẫu đơn ngắn và chúng tôi sẽ hỏi về điều kiện nhà của anh/chị.",
        en: "There is a short form, and we will ask about your home conditions.",
      },
      {
        speaker: "Calon adopter",
        text: "Saya siap merawatnya dengan makanan, vaksin rutin, dan tempat yang aman.",
        vi: "Tôi sẵn sàng chăm sóc nó bằng thức ăn, tiêm vắc-xin định kỳ, và nơi an toàn.",
        en: "I am ready to care for it with food, regular vaccination, and a safe place.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: 'Con chó này đã triệt sản chưa?'",
        prompt_en: "Translate into Indonesian: 'Has this dog been sterilized yet?'",
        answer: "Apakah anjing ini sudah steril?",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Berapa biaya ____ untuk kucing ini?`",
        prompt_en: "Fill in the blank: `Berapa biaya ____ untuk kucing ini?`",
        answer: "adopsi",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm Indonesia với nghĩa tiếng Việt.",
        prompt_en: "Match the Indonesian phrase with the Vietnamese meaning.",
        pairs: [
          ["sudah divaksin", "đã tiêm vắc-xin"],
          ["kunjungan rumah", "thăm nhà"],
          ["tanggung jawab pemilik", "trách nhiệm của chủ nuôi"],
        ],
      },
      {
        type: "roleplay",
        prompt_vi:
          "Bạn ở shelter. Hỏi về kucing, vaksin, steril, biaya adopsi, và trách nhiệm của pemilik sau khi nhận nuôi.",
        prompt_en:
          "You are at a shelter. Ask about the cat, vaccination, sterilization, adoption fee, and the owner's responsibilities after adoption.",
      },
    ],
    content:
      "Use this lesson for Indonesian conversations about adopting a pet from a shelter: asking about cats and dogs, vaccination, sterilization, adoption fees, shelter procedures, and the long-term responsibilities of pet ownership.",
  },
];
