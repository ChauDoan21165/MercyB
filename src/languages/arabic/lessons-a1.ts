// src/languages/arabic/lessons-a1.ts
//
// Arabic A1 starter lessons for Vietnamese and English learners.
// Policy: Modern Standard Arabic first, with no audio promise and no dialect
// forms in answer keys. Romanization is a learner aid, not the source of truth.

export type ArabicCategoryId =
  | "script_orientation"
  | "greetings"
  | "introductions"
  | "classroom_survival"
  | "numbers_time";

export type ArabicCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ArabicSentence = {
  ar: string;
  romanization: string;
  en: string;
  vi: string;
  pronunciation_focus?: string[];
  pronunciation_focus_en?: string[];
  note_vi?: string;
  note_en?: string;
};

export type ArabicVocabEntry = {
  ar: string;
  romanization: string;
  en: string;
  vi: string;
  pos?: string;
};

export type ArabicDialogueLine = {
  speaker: string;
  ar: string;
  romanization: string;
  en: string;
  vi: string;
};

export type ArabicExercise =
  | {
      type: "fill-blank";
      question: string;
      answer: string;
      accepted_answers?: string[];
      hint_vi?: string;
      hint_en?: string;
    }
  | {
      type: "matching";
      instruction_vi: string;
      instruction_en: string;
      pairs: Array<{ ar: string; meaning_vi: string; meaning_en?: string }>;
    }
  | {
      type: "translation";
      vi: string;
      en: string;
      ar: string;
      romanization?: string;
      accepted_answers?: string[];
    };

export type ArabicLesson = {
  id: string;
  level: ArabicCefrLevel;
  category: ArabicCategoryId;
  title_vi: string;
  title_en: string;
  intro_vi: string;
  intro_en: string;
  vocabulary: ArabicVocabEntry[];
  sentences: ArabicSentence[];
  dialogue?: ArabicDialogueLine[];
  exercises?: ArabicExercise[];
  cultural_notes_vi?: string;
  cultural_notes_en?: string;
  tip_advice_vi?: string;
  tip_advice_en?: string;
  register_notes_vi?: string;
  register_notes_en?: string;
};

export const lessons: ArabicLesson[] = [
  {
    id: "arabic_a1_script_direction",
    level: "A1",
    category: "script_orientation",
    title_vi: "Huong doc va chu cai dau tien",
    title_en: "Reading direction and first letters",
    intro_vi:
      "Tieng A Rap viet tu phai sang trai. Bai nay chi nhan dien mot so chu trong loi chao, chua bat buoc viet dep hay hoc het bang chu cai.",
    intro_en:
      "Arabic is written from right to left. This lesson only asks you to recognize a few letters inside greetings, not master the full alphabet yet.",
    vocabulary: [
      { ar: "ا", romanization: "alif", en: "alif / long aa carrier", vi: "chu alif / ky hieu am aa dai", pos: "letter" },
      { ar: "م", romanization: "miim", en: "letter miim", vi: "chu miim", pos: "letter" },
      { ar: "ل", romanization: "laam", en: "letter laam", vi: "chu laam", pos: "letter" },
      { ar: "س", romanization: "siin", en: "letter siin", vi: "chu siin", pos: "letter" },
      { ar: "سلام", romanization: "salaam", en: "peace / greeting", vi: "binh an / loi chao", pos: "noun" },
      { ar: "اسم", romanization: "ism", en: "name", vi: "ten", pos: "noun" },
    ],
    sentences: [
      {
        ar: "سلام",
        romanization: "salaam",
        en: "Peace / hello.",
        vi: "Binh an / xin chao.",
        pronunciation_focus: ["Am aa dai trong romanization khong phai dau tieng Viet.", "Chu س co am /s/, khong doc nhu /sh/."],
        pronunciation_focus_en: ["The aa marks a long vowel, not stress.", "س is an /s/ sound, not /sh/."],
      },
      {
        ar: "السلام",
        romanization: "as-salaam",
        en: "the peace",
        vi: "su binh an",
        note_vi: "Chu ال viet o dau tu, nhung khi gap س thi am /l/ bi dong hoa trong phat am.",
        note_en: "The written ال stays visible, but before س the /l/ assimilates in pronunciation.",
      },
      {
        ar: "اسمي",
        romanization: "ismii",
        en: "my name",
        vi: "ten cua toi",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Noi chu/tieng A Rap voi nghia.",
        instruction_en: "Match the Arabic item with its meaning.",
        pairs: [
          { ar: "سلام", meaning_vi: "loi chao / binh an", meaning_en: "peace / greeting" },
          { ar: "اسم", meaning_vi: "ten", meaning_en: "name" },
          { ar: "س", meaning_vi: "chu siin", meaning_en: "letter siin" },
        ],
      },
      {
        type: "fill-blank",
        question: "Complete the familiar greeting word: سلا_",
        answer: "م",
        hint_vi: "Tu la سلام.",
        hint_en: "The word is سلام.",
      },
    ],
    cultural_notes_vi:
      "Nguoi hoc Viet Nam nen tap nhin ca tu nhu mot hinh dang tu phai sang trai. Dung ep thu tu chu A Rap vao thoi quen trai sang phai cua chu Latin.",
    cultural_notes_en:
      "Read the Arabic word as a right-to-left shape first. Do not force Arabic letters into left-to-right English spelling habits.",
    tip_advice_vi:
      "Khi thay chu Latin hoac so trong dong A Rap, chung co the van di theo huong trai sang phai. Day la hien tuong binh thuong cua van ban tron huong.",
    tip_advice_en:
      "Latin text and numbers can still run left to right inside Arabic text. Mixed direction is normal; the Arabic word itself runs right to left.",
  },
  {
    id: "arabic_a1_greetings_responses",
    level: "A1",
    category: "greetings",
    title_vi: "Chao hoi va dap lai",
    title_en: "Greetings and replies",
    intro_vi:
      "Hoc cac cong thuc chao hoi MSA thong dung. Uu tien dung dung cap cau hoi-dap, chua can phan tich tung tu.",
    intro_en:
      "Learn common MSA greeting formulas. The priority is using the right greeting-reply pair before analyzing every word.",
    vocabulary: [
      { ar: "السلام عليكم", romanization: "as-salaamu 'alaykum", en: "peace be upon you / hello", vi: "xin chao trang trong", pos: "greeting" },
      { ar: "وعليكم السلام", romanization: "wa-'alaykum as-salaam", en: "and peace be upon you", vi: "loi dap chao", pos: "reply" },
      { ar: "مرحبا", romanization: "marhaban", en: "hello", vi: "xin chao", pos: "greeting" },
      { ar: "صباح الخير", romanization: "sabaah al-khayr", en: "good morning", vi: "chao buoi sang", pos: "greeting" },
      { ar: "شكرا", romanization: "shukran", en: "thank you", vi: "cam on", pos: "phrase" },
      { ar: "عفوا", romanization: "'afwan", en: "you are welcome / pardon", vi: "khong co gi / xin loi nhe", pos: "phrase" },
    ],
    sentences: [
      {
        ar: "السلام عليكم.",
        romanization: "as-salaamu 'alaykum.",
        en: "Hello. / Peace be upon you.",
        vi: "Xin chao. / Binh an cho ban.",
        pronunciation_focus: ["ع la am hong; dung bien thanh nguyen am tron.", "aa la nguyen am dai."],
        pronunciation_focus_en: ["ع is a throat consonant; do not erase it into a plain vowel.", "aa marks a long vowel."],
      },
      {
        ar: "وعليكم السلام.",
        romanization: "wa-'alaykum as-salaam.",
        en: "And peace be upon you.",
        vi: "Va binh an cho ban.",
      },
      {
        ar: "مرحبا، كيف حالك؟",
        romanization: "marhaban, kayfa haaluka?",
        en: "Hello, how are you?",
        vi: "Xin chao, ban khoe khong?",
        note_vi: "ح trong حالك la phu am hong nhe, khac ه.",
        note_en: "The ح in حالك is a breathy throat consonant, different from ه.",
      },
      {
        ar: "أنا بخير، شكرا.",
        romanization: "anaa bikhayr, shukran.",
        en: "I am fine, thank you.",
        vi: "Toi on, cam on.",
      },
    ],
    dialogue: [
      {
        speaker: "Mariam",
        ar: "السلام عليكم.",
        romanization: "as-salaamu 'alaykum.",
        en: "Hello.",
        vi: "Xin chao.",
      },
      {
        speaker: "Omar",
        ar: "وعليكم السلام. كيف حالك؟",
        romanization: "wa-'alaykum as-salaam. kayfa haaluka?",
        en: "Hello. How are you?",
        vi: "Chao lai. Ban khoe khong?",
      },
      {
        speaker: "Mariam",
        ar: "أنا بخير، شكرا.",
        romanization: "anaa bikhayr, shukran.",
        en: "I am fine, thank you.",
        vi: "Toi on, cam on.",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "Reply to السلام عليكم with: ___",
        answer: "وعليكم السلام",
        accepted_answers: ["و عليكم السلام"],
        hint_vi: "Day la cap chao-dap co dinh.",
        hint_en: "This is a fixed greeting-reply pair.",
      },
      {
        type: "translation",
        vi: "Cam on.",
        en: "Thank you.",
        ar: "شكرا",
        romanization: "shukran",
      },
    ],
    cultural_notes_vi:
      "السلام عليكم la cong thuc chao rong rai trong nhieu boi canh. Trong khoa nay no duoc day nhu MSA va loi chao xa hoi, khong gan voi bai hoc ton giao.",
    cultural_notes_en:
      "السلام عليكم is a widely used greeting formula. This course treats it as social MSA language, not as a religious lesson.",
    tip_advice_vi:
      "Dung cap السلام عليكم / وعليكم السلام nhu mot khoi co dinh truoc khi tach nghia tung tu.",
    tip_advice_en:
      "Memorize السلام عليكم / وعليكم السلام as a pair first; word-by-word parsing can come later.",
  },
  {
    id: "arabic_a1_introducing_self",
    level: "A1",
    category: "introductions",
    title_vi: "Gioi thieu ten va que quan",
    title_en: "Introducing name and origin",
    intro_vi:
      "Bai nay dung cau danh tu don gian: tieng A Rap MSA khong can dong tu 'la' o hien tai trong cau nhu 'Toi la...'.",
    intro_en:
      "This lesson uses simple nominal sentences: Arabic MSA does not need a present-tense verb 'to be' in sentences like 'I am...'.",
    vocabulary: [
      { ar: "أنا", romanization: "anaa", en: "I", vi: "toi", pos: "pronoun" },
      { ar: "اسمي", romanization: "ismii", en: "my name", vi: "ten cua toi", pos: "phrase" },
      { ar: "من", romanization: "min", en: "from", vi: "tu", pos: "preposition" },
      { ar: "فيتنام", romanization: "Fiitnaam", en: "Vietnam", vi: "Viet Nam", pos: "place name" },
      { ar: "طالب", romanization: "taalib", en: "male student", vi: "hoc sinh/sinh vien nam", pos: "noun" },
      { ar: "طالبة", romanization: "taaliba", en: "female student", vi: "hoc sinh/sinh vien nu", pos: "noun" },
    ],
    sentences: [
      {
        ar: "أنا مريم.",
        romanization: "anaa Maryam.",
        en: "I am Mariam.",
        vi: "Toi la Mariam.",
        pronunciation_focus: ["أنا co aa dai o dau va cuoi.", "Khong them dong tu 'la' trong cau A Rap."],
        pronunciation_focus_en: ["أنا has long aa at the beginning and end.", "Do not add a separate Arabic verb for 'am' here."],
      },
      {
        ar: "اسمي عمر.",
        romanization: "ismii 'Umar.",
        en: "My name is Omar.",
        vi: "Ten toi la Omar.",
      },
      {
        ar: "أنا من فيتنام.",
        romanization: "anaa min Fiitnaam.",
        en: "I am from Vietnam.",
        vi: "Toi den tu Viet Nam.",
      },
      {
        ar: "أنا طالب.",
        romanization: "anaa taalib.",
        en: "I am a male student.",
        vi: "Toi la hoc sinh/sinh vien nam.",
      },
      {
        ar: "أنا طالبة.",
        romanization: "anaa taaliba.",
        en: "I am a female student.",
        vi: "Toi la hoc sinh/sinh vien nu.",
      },
    ],
    dialogue: [
      {
        speaker: "Teacher",
        ar: "ما اسمك؟",
        romanization: "maa ismuka?",
        en: "What is your name?",
        vi: "Ten ban la gi?",
      },
      {
        speaker: "Student",
        ar: "اسمي لinh. أنا من فيتنام.",
        romanization: "ismii Linh. anaa min Fiitnaam.",
        en: "My name is Linh. I am from Vietnam.",
        vi: "Ten toi la Linh. Toi den tu Viet Nam.",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "Complete: ___ من فيتنام.",
        answer: "أنا",
        hint_vi: "Can dai tu 'toi'.",
        hint_en: "You need the pronoun 'I'.",
      },
      {
        type: "translation",
        vi: "Ten toi la Mariam.",
        en: "My name is Mariam.",
        ar: "اسمي مريم",
        romanization: "ismii Maryam",
      },
    ],
    cultural_notes_vi:
      "Ten rieng nuoc ngoai co the duoc viet bang chu Latin trong bai dau tien de giam tai doc chu. Khi hoc cao hon, khoa co the gioi thieu cach phien am ten sang chu A Rap.",
    cultural_notes_en:
      "Foreign names may appear in Latin letters at the beginning to reduce script load. Later lessons can introduce Arabic spelling for names.",
    tip_advice_vi:
      "Ghi nho mau cau: أنا + ten/tinh chat, va أنا من + noi chon. Tieng Viet can 'la', nhung cau A Rap nay khong can.",
    tip_advice_en:
      "Memorize the frames أنا + name/role and أنا من + place. English uses 'am'; Arabic does not need it here.",
  },
  {
    id: "arabic_a1_classroom_survival",
    level: "A1",
    category: "classroom_survival",
    title_vi: "Cau sinh ton trong lop hoc",
    title_en: "Classroom survival phrases",
    intro_vi:
      "Bai nay cho nguoi moi biet cach noi khong hieu, xin noi cham, va hoi nghia. Tat ca deu la MSA an toan cho lop hoc.",
    intro_en:
      "This lesson gives beginners the language to say they do not understand, ask for slower speech, and ask what something means.",
    vocabulary: [
      { ar: "لا", romanization: "laa", en: "no / not", vi: "khong", pos: "particle" },
      { ar: "أفهم", romanization: "afham", en: "I understand", vi: "toi hieu", pos: "verb" },
      { ar: "من فضلك", romanization: "min fadlik", en: "please", vi: "lam on", pos: "phrase" },
      { ar: "ببطء", romanization: "bibuT'", en: "slowly", vi: "cham lai", pos: "adverb" },
      { ar: "كرر", romanization: "karrir", en: "repeat", vi: "lap lai", pos: "imperative" },
      { ar: "يعني", romanization: "ya'nii", en: "means", vi: "co nghia la", pos: "verb" },
    ],
    sentences: [
      {
        ar: "لا أفهم.",
        romanization: "laa afham.",
        en: "I do not understand.",
        vi: "Toi khong hieu.",
        pronunciation_focus: ["Hamza trong أفهم la phu am that, khong phai trang tri.", "لا co nguyen am dai aa."],
        pronunciation_focus_en: ["The hamza in أفهم is a real consonant, not decoration.", "لا has a long aa vowel."],
      },
      {
        ar: "كرر من فضلك.",
        romanization: "karrir min fadlik.",
        en: "Repeat, please.",
        vi: "Lam on lap lai.",
      },
      {
        ar: "ببطء من فضلك.",
        romanization: "bibuT' min fadlik.",
        en: "Slowly, please.",
        vi: "Lam on noi cham.",
        note_vi: "ط la phu am nhan manh; romanization T chi bao hieu phat am day hon, khong phai chu hoa trong cau.",
        note_en: "ط is an emphatic consonant; T only marks the heavier sound in this learner romanization.",
      },
      {
        ar: "ماذا يعني هذا؟",
        romanization: "maadhaa ya'nii haadhaa?",
        en: "What does this mean?",
        vi: "Cai nay co nghia la gi?",
      },
    ],
    dialogue: [
      {
        speaker: "Student",
        ar: "لا أفهم. كرر من فضلك.",
        romanization: "laa afham. karrir min fadlik.",
        en: "I do not understand. Repeat, please.",
        vi: "Toi khong hieu. Lam on lap lai.",
      },
      {
        speaker: "Teacher",
        ar: "نعم، ببطء.",
        romanization: "na'am, bibuT'.",
        en: "Yes, slowly.",
        vi: "Duoc, cham lai.",
      },
    ],
    exercises: [
      {
        type: "translation",
        vi: "Toi khong hieu.",
        en: "I do not understand.",
        ar: "لا أفهم",
        romanization: "laa afham",
        accepted_answers: ["لا افهم"],
      },
      {
        type: "fill-blank",
        question: "Complete the polite request: كرر ___ فضلك.",
        answer: "من",
        hint_vi: "Cum la من فضلك.",
        hint_en: "The phrase is من فضلك.",
      },
    ],
    cultural_notes_vi:
      "من فضلك la cach lich su, an toan trong MSA. Cac bien the noi hang ngay co the khac theo vung, nhung khong phai muc tieu cua A1 nay.",
    cultural_notes_en:
      "من فضلك is a safe polite MSA phrase. Everyday spoken variants differ by region, but they are not the target of this A1 lesson.",
    tip_advice_vi:
      "Hoc nguyen cau لا أفهم va كرر من فضلك de co the tu bao ve minh trong lop hoc ngay ca khi chua nam ngu phap.",
    tip_advice_en:
      "Memorize لا أفهم and كرر من فضلك as ready-to-use classroom tools before analyzing the grammar.",
  },
  {
    id: "arabic_a1_numbers_time",
    level: "A1",
    category: "numbers_time",
    title_vi: "So 0-10 va thoi gian don gian",
    title_en: "Numbers 0-10 and simple time",
    intro_vi:
      "Bai nay nhan dien so co ban va cach noi hom nay/ngay mai/hom qua. Quy tac so trong tieng A Rap phuc tap; A1 chi dung cum thuc te.",
    intro_en:
      "This lesson recognizes basic numbers and today/tomorrow/yesterday. Arabic number grammar is complex, so A1 uses practical chunks only.",
    vocabulary: [
      { ar: "صفر", romanization: "Sifr", en: "zero", vi: "so khong", pos: "number" },
      { ar: "واحد", romanization: "waahid", en: "one", vi: "mot", pos: "number" },
      { ar: "اثنان", romanization: "ithnaan", en: "two", vi: "hai", pos: "number" },
      { ar: "ثلاثة", romanization: "thalaatha", en: "three", vi: "ba", pos: "number" },
      { ar: "أربعة", romanization: "arba'a", en: "four", vi: "bon", pos: "number" },
      { ar: "خمسة", romanization: "khamsa", en: "five", vi: "nam", pos: "number" },
      { ar: "اليوم", romanization: "al-yawm", en: "today", vi: "hom nay", pos: "time word" },
      { ar: "غدا", romanization: "ghadan", en: "tomorrow", vi: "ngay mai", pos: "time word" },
      { ar: "أمس", romanization: "ams", en: "yesterday", vi: "hom qua", pos: "time word" },
    ],
    sentences: [
      {
        ar: "رقمي واحد اثنان ثلاثة.",
        romanization: "raqamii waahid ithnaan thalaatha.",
        en: "My number is one two three.",
        vi: "So cua toi la mot hai ba.",
        pronunciation_focus: ["خ trong خمسة giong am xat manh o cuong vi vom mem.", "غ trong غدا khac g/k; la am xat huu thanh."],
        pronunciation_focus_en: ["خ in خمسة is a strong velar fricative.", "غ in غدا is voiced and is not English g/k."],
      },
      {
        ar: "اليوم درس عربي.",
        romanization: "al-yawm dars 'arabii.",
        en: "Today is an Arabic lesson.",
        vi: "Hom nay co bai hoc tieng A Rap.",
      },
      {
        ar: "غدا عندي درس.",
        romanization: "ghadan 'indii dars.",
        en: "Tomorrow I have a lesson.",
        vi: "Ngay mai toi co bai hoc.",
      },
      {
        ar: "أمس كان عندي وقت.",
        romanization: "ams kaana 'indii waqt.",
        en: "Yesterday I had time.",
        vi: "Hom qua toi co thoi gian.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Noi so voi nghia.",
        instruction_en: "Match the number with its meaning.",
        pairs: [
          { ar: "واحد", meaning_vi: "mot", meaning_en: "one" },
          { ar: "اثنان", meaning_vi: "hai", meaning_en: "two" },
          { ar: "ثلاثة", meaning_vi: "ba", meaning_en: "three" },
        ],
      },
      {
        type: "fill-blank",
        question: "Complete: ___ عندي درس. (Tomorrow I have a lesson.)",
        answer: "غدا",
        hint_vi: "Can tu 'ngay mai'.",
        hint_en: "You need the word 'tomorrow'.",
      },
      {
        type: "translation",
        vi: "Hom nay.",
        en: "Today.",
        ar: "اليوم",
        romanization: "al-yawm",
      },
    ],
    cultural_notes_vi:
      "Nguoi hoc se gap ca chu so Latin va chu so A Rap-An Do trong doi thuc. A1 chi can nhan dien, khong dua ra loi hua chuan hoa hien thi.",
    cultural_notes_en:
      "Learners may see both Latin digits and Arabic-Indic digits in real life. A1 only builds recognition and does not promise one display standard.",
    tip_advice_vi:
      "Dung so dien thoai gia dinh de luyen 0-5 truoc, roi mo rong den 10. Dung hoc quy tac so phuc tap qua som.",
    tip_advice_en:
      "Practice 0-5 with familiar phone-number chunks first, then expand to 10. Do not overload yourself with full number agreement rules yet.",
  },
];

export default lessons;
