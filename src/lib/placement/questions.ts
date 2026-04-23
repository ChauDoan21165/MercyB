// src/lib/placement/questions.ts
//
// MercyBlade placement-test question bank — v0.
//
// Each question has:
//   - cefr            — target CEFR level (A1..C2)
//   - difficulty      — numeric bucket for adaptive engine (A1=1, A2=2, ..., C2=6)
//   - skill           — what the question primarily tests (grammar, vocabulary,
//                       usage, reading)
//   - cefrDescriptor  — plain-English citation of the CEFR descriptor this
//                       question targets (for review)
//   - prompt          — bilingual question text (en + vi)
//   - options         — 4 choices (id a..d), bilingual labels
//   - correctOptionId — which option id is correct
//
// Reading questions additionally carry a `passage` field with a short bilingual
// passage. Both the passage and the question options are translated so a user
// reading in "VI mode" can still benchmark their EN proficiency — the text being
// tested is always the English, but the Vietnamese gives navigational support.
//
// Distribution (40 questions):
//   A1: 7 multiple-choice + 1 reading  = 8
//   A2: 6 multiple-choice + 2 reading  = 8
//   B1: 5 multiple-choice + 3 reading  = 8
//   B2: 4 multiple-choice + 2 reading  = 6
//   C1: 4 multiple-choice + 2 reading  = 6
//   C2: 4 multiple-choice + 0 reading  = 4
//
// No audio/listening questions in v0 (deferred to v1 per Chau's decision).
// No runtime AI — deterministic scoring only.

export type CEFR = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type QuestionSkill = 'grammar' | 'vocabulary' | 'usage' | 'reading';

export type BilingualText = {
  en: string;
  vi: string;
};

export type QuestionOption = {
  id: 'a' | 'b' | 'c' | 'd';
  text: BilingualText;
};

type QuestionBase = {
  id: string;
  cefr: CEFR;
  /** 1 (A1) through 6 (C2). Used by the adaptive engine. */
  difficulty: number;
  skill: QuestionSkill;
  /** Human-readable citation of the CEFR descriptor this question targets. */
  cefrDescriptor: string;
  prompt: BilingualText;
  options: QuestionOption[];
  correctOptionId: QuestionOption['id'];
};

export type MultipleChoiceQuestion = QuestionBase & {
  type: 'multiple_choice';
};

export type ReadingComprehensionQuestion = QuestionBase & {
  type: 'reading_comprehension';
  passage: BilingualText;
};

export type PlacementQuestion =
  | MultipleChoiceQuestion
  | ReadingComprehensionQuestion;

// ─────────────────────────────────────────────────────────────────────────────
// A1 — Basic survival, present tense, simple sentences (8 questions)
// ─────────────────────────────────────────────────────────────────────────────

const A1: PlacementQuestion[] = [
  {
    id: 'q_a1_001',
    type: 'multiple_choice',
    cefr: 'A1',
    difficulty: 1,
    skill: 'grammar',
    cefrDescriptor: "A1 grammar: verb 'to be' in present simple, first person",
    prompt: {
      en: 'I ___ a student.',
      vi: 'I ___ a student.',
    },
    options: [
      { id: 'a', text: { en: 'is', vi: 'is' } },
      { id: 'b', text: { en: 'am', vi: 'am' } },
      { id: 'c', text: { en: 'are', vi: 'are' } },
      { id: 'd', text: { en: 'be', vi: 'be' } },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q_a1_002',
    type: 'multiple_choice',
    cefr: 'A1',
    difficulty: 1,
    skill: 'vocabulary',
    cefrDescriptor: "A1 vocabulary: basic personal information (name / age / greeting)",
    prompt: {
      en: 'Hello, my ___ is Minh.',
      vi: 'Hello, my ___ is Minh.',
    },
    options: [
      { id: 'a', text: { en: 'name', vi: 'name (tên)' } },
      { id: 'b', text: { en: 'age', vi: 'age (tuổi)' } },
      { id: 'c', text: { en: 'color', vi: 'color (màu)' } },
      { id: 'd', text: { en: 'house', vi: 'house (nhà)' } },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q_a1_003',
    type: 'multiple_choice',
    cefr: 'A1',
    difficulty: 1,
    skill: 'vocabulary',
    cefrDescriptor: 'A1 vocabulary: numbers 1–10 and days of the week',
    prompt: {
      en: 'There are ___ days in a week.',
      vi: 'There are ___ days in a week.',
    },
    options: [
      { id: 'a', text: { en: 'five', vi: 'five (năm)' } },
      { id: 'b', text: { en: 'six', vi: 'six (sáu)' } },
      { id: 'c', text: { en: 'seven', vi: 'seven (bảy)' } },
      { id: 'd', text: { en: 'ten', vi: 'ten (mười)' } },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'q_a1_004',
    type: 'multiple_choice',
    cefr: 'A1',
    difficulty: 1,
    skill: 'grammar',
    cefrDescriptor: "A1 grammar: indefinite articles 'a' vs 'an' before vowel sounds",
    prompt: {
      en: 'She is ___ engineer.',
      vi: 'She is ___ engineer.',
    },
    options: [
      { id: 'a', text: { en: 'a', vi: 'a' } },
      { id: 'b', text: { en: 'an', vi: 'an' } },
      { id: 'c', text: { en: 'the', vi: 'the' } },
      { id: 'd', text: { en: '(no article)', vi: '(không có mạo từ)' } },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q_a1_005',
    type: 'multiple_choice',
    cefr: 'A1',
    difficulty: 1,
    skill: 'grammar',
    cefrDescriptor: 'A1 grammar: possessive adjectives (his / her / my / your)',
    prompt: {
      en: 'This is my brother. ___ name is Tom.',
      vi: 'This is my brother. ___ name is Tom.',
    },
    options: [
      { id: 'a', text: { en: 'He', vi: 'He' } },
      { id: 'b', text: { en: 'Him', vi: 'Him' } },
      { id: 'c', text: { en: 'His', vi: 'His' } },
      { id: 'd', text: { en: "He's", vi: "He's" } },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'q_a1_006',
    type: 'multiple_choice',
    cefr: 'A1',
    difficulty: 1,
    skill: 'vocabulary',
    cefrDescriptor: 'A1 vocabulary: family relationships',
    prompt: {
      en: "My father's brother is my ___.",
      vi: "My father's brother is my ___.",
    },
    options: [
      { id: 'a', text: { en: 'cousin', vi: 'cousin (anh/em họ)' } },
      { id: 'b', text: { en: 'nephew', vi: 'nephew (cháu trai)' } },
      { id: 'c', text: { en: 'uncle', vi: 'uncle (bác/chú)' } },
      { id: 'd', text: { en: 'grandfather', vi: 'grandfather (ông)' } },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'q_a1_007',
    type: 'multiple_choice',
    cefr: 'A1',
    difficulty: 1,
    skill: 'grammar',
    cefrDescriptor: 'A1 grammar: WH-question words (what / where / when / who)',
    prompt: {
      en: '___ do you live?',
      vi: '___ do you live?',
    },
    options: [
      { id: 'a', text: { en: 'What', vi: 'What' } },
      { id: 'b', text: { en: 'When', vi: 'When' } },
      { id: 'c', text: { en: 'Where', vi: 'Where' } },
      { id: 'd', text: { en: 'Who', vi: 'Who' } },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'q_a1_008',
    type: 'reading_comprehension',
    cefr: 'A1',
    difficulty: 1,
    skill: 'reading',
    cefrDescriptor:
      'A1 reading: simple personal description — name, age, family, likes',
    passage: {
      en: "Hi! I'm Anna. I am 10 years old. I live in Hanoi with my family. I have one brother and one sister. I like cats, and I have two cats at home.",
      vi: 'Chào! Mình là Anna. Mình 10 tuổi. Mình sống ở Hà Nội với gia đình. Mình có một anh trai và một em gái. Mình thích mèo và mình nuôi hai con mèo ở nhà.',
    },
    prompt: {
      en: 'How many cats does Anna have?',
      vi: 'Anna có bao nhiêu con mèo?',
    },
    options: [
      { id: 'a', text: { en: 'One', vi: 'Một' } },
      { id: 'b', text: { en: 'Two', vi: 'Hai' } },
      { id: 'c', text: { en: 'Three', vi: 'Ba' } },
      { id: 'd', text: { en: 'None', vi: 'Không con nào' } },
    ],
    correctOptionId: 'b',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// A2 — Simple past, basic modals, prepositions (8 questions)
// ─────────────────────────────────────────────────────────────────────────────

const A2: PlacementQuestion[] = [
  {
    id: 'q_a2_001',
    type: 'multiple_choice',
    cefr: 'A2',
    difficulty: 2,
    skill: 'grammar',
    cefrDescriptor: 'A2 grammar: past simple of regular verbs (-ed)',
    prompt: {
      en: 'Yesterday, I ___ my homework before dinner.',
      vi: 'Yesterday, I ___ my homework before dinner.',
    },
    options: [
      { id: 'a', text: { en: 'finish', vi: 'finish' } },
      { id: 'b', text: { en: 'finishes', vi: 'finishes' } },
      { id: 'c', text: { en: 'finished', vi: 'finished' } },
      { id: 'd', text: { en: 'finishing', vi: 'finishing' } },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'q_a2_002',
    type: 'multiple_choice',
    cefr: 'A2',
    difficulty: 2,
    skill: 'grammar',
    cefrDescriptor: "A2 grammar: past simple of irregular verbs (eat → ate)",
    prompt: {
      en: 'She ___ breakfast at 7 a.m. yesterday.',
      vi: 'She ___ breakfast at 7 a.m. yesterday.',
    },
    options: [
      { id: 'a', text: { en: 'ate', vi: 'ate' } },
      { id: 'b', text: { en: 'eat', vi: 'eat' } },
      { id: 'c', text: { en: 'eated', vi: 'eated' } },
      { id: 'd', text: { en: 'eating', vi: 'eating' } },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q_a2_003',
    type: 'multiple_choice',
    cefr: 'A2',
    difficulty: 2,
    skill: 'grammar',
    cefrDescriptor: 'A2 grammar: comparative adjectives (-er / more)',
    prompt: {
      en: 'My brother is ___ than me.',
      vi: 'My brother is ___ than me.',
    },
    options: [
      { id: 'a', text: { en: 'tall', vi: 'tall' } },
      { id: 'b', text: { en: 'taller', vi: 'taller' } },
      { id: 'c', text: { en: 'tallest', vi: 'tallest' } },
      { id: 'd', text: { en: 'more tall', vi: 'more tall' } },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q_a2_004',
    type: 'multiple_choice',
    cefr: 'A2',
    difficulty: 2,
    skill: 'grammar',
    cefrDescriptor: "A2 grammar: modal verb 'can' for ability",
    prompt: {
      en: 'She ___ speak three languages.',
      vi: 'She ___ speak three languages.',
    },
    options: [
      { id: 'a', text: { en: 'cans', vi: 'cans' } },
      { id: 'b', text: { en: 'can', vi: 'can' } },
      { id: 'c', text: { en: 'caning', vi: 'caning' } },
      { id: 'd', text: { en: 'canning', vi: 'canning' } },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q_a2_005',
    type: 'multiple_choice',
    cefr: 'A2',
    difficulty: 2,
    skill: 'vocabulary',
    cefrDescriptor: "A2 vocabulary: prepositions of time (in / on / at) with years",
    prompt: {
      en: 'I was born ___ 1995.',
      vi: 'I was born ___ 1995.',
    },
    options: [
      { id: 'a', text: { en: 'on', vi: 'on' } },
      { id: 'b', text: { en: 'at', vi: 'at' } },
      { id: 'c', text: { en: 'in', vi: 'in' } },
      { id: 'd', text: { en: 'by', vi: 'by' } },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'q_a2_006',
    type: 'multiple_choice',
    cefr: 'A2',
    difficulty: 2,
    skill: 'grammar',
    cefrDescriptor: "A2 grammar: future with 'going to' for predictions from evidence",
    prompt: {
      en: 'Look at those clouds! It ___ rain.',
      vi: 'Look at those clouds! It ___ rain.',
    },
    options: [
      { id: 'a', text: { en: 'is going to', vi: 'is going to' } },
      { id: 'b', text: { en: 'go to', vi: 'go to' } },
      { id: 'c', text: { en: 'goes', vi: 'goes' } },
      { id: 'd', text: { en: 'will going', vi: 'will going' } },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q_a2_007',
    type: 'reading_comprehension',
    cefr: 'A2',
    difficulty: 2,
    skill: 'reading',
    cefrDescriptor: 'A2 reading: short narrative about past events, factual detail',
    passage: {
      en: 'Last Saturday, Minh and his friends went to the beach. They swam in the sea and played volleyball. The weather was hot and sunny. They had lunch at a small restaurant near the beach. Minh ate noodles. His friends ordered rice. They all felt tired but happy after the trip.',
      vi: 'Thứ bảy tuần trước, Minh và các bạn đi biển. Họ bơi ở biển và chơi bóng chuyền. Thời tiết nóng và nắng. Họ ăn trưa ở một nhà hàng nhỏ gần biển. Minh ăn phở. Các bạn gọi cơm. Tất cả đều mệt nhưng vui sau chuyến đi.',
    },
    prompt: {
      en: 'What did Minh eat for lunch?',
      vi: 'Minh đã ăn gì vào bữa trưa?',
    },
    options: [
      { id: 'a', text: { en: 'Rice', vi: 'Cơm' } },
      { id: 'b', text: { en: 'Noodles', vi: 'Phở' } },
      { id: 'c', text: { en: 'Pizza', vi: 'Pizza' } },
      { id: 'd', text: { en: 'Fish', vi: 'Cá' } },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q_a2_008',
    type: 'reading_comprehension',
    cefr: 'A2',
    difficulty: 2,
    skill: 'reading',
    cefrDescriptor: 'A2 reading: description of a daily routine, specific detail',
    passage: {
      en: 'My mother starts her day at 6 a.m. She makes breakfast for our family. After that, she goes to work by motorbike. She is a nurse at a hospital near our house. She finishes work at 5 p.m. In the evening, she cooks dinner and watches TV.',
      vi: 'Mẹ mình bắt đầu ngày mới lúc 6 giờ sáng. Mẹ nấu bữa sáng cho gia đình. Sau đó, mẹ đi làm bằng xe máy. Mẹ là y tá ở bệnh viện gần nhà mình. Mẹ kết thúc công việc lúc 5 giờ chiều. Buổi tối, mẹ nấu bữa tối và xem tivi.',
    },
    prompt: {
      en: 'How does the mother travel to work?',
      vi: 'Người mẹ đi làm bằng phương tiện gì?',
    },
    options: [
      { id: 'a', text: { en: 'By bus', vi: 'Bằng xe buýt' } },
      { id: 'b', text: { en: 'By car', vi: 'Bằng ô tô' } },
      { id: 'c', text: { en: 'By motorbike', vi: 'Bằng xe máy' } },
      { id: 'd', text: { en: 'By bicycle', vi: 'Bằng xe đạp' } },
    ],
    correctOptionId: 'c',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// B1 — Present perfect, conditionals, phrasal verbs (8 questions)
// ─────────────────────────────────────────────────────────────────────────────

const B1: PlacementQuestion[] = [
  {
    id: 'q_b1_001',
    type: 'multiple_choice',
    cefr: 'B1',
    difficulty: 3,
    skill: 'grammar',
    cefrDescriptor: 'B1 grammar: present perfect for experience (have/has + past participle)',
    prompt: {
      en: '___ you ever ___ to Japan?',
      vi: '___ you ever ___ to Japan?',
    },
    options: [
      { id: 'a', text: { en: 'Did / go', vi: 'Did / go' } },
      { id: 'b', text: { en: 'Have / gone', vi: 'Have / gone' } },
      { id: 'c', text: { en: 'Are / going', vi: 'Are / going' } },
      { id: 'd', text: { en: 'Do / go', vi: 'Do / go' } },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q_b1_002',
    type: 'multiple_choice',
    cefr: 'B1',
    difficulty: 3,
    skill: 'grammar',
    cefrDescriptor: 'B1 grammar: first conditional (real future condition)',
    prompt: {
      en: 'If it rains tomorrow, we ___ the picnic.',
      vi: 'If it rains tomorrow, we ___ the picnic.',
    },
    options: [
      { id: 'a', text: { en: 'cancel', vi: 'cancel' } },
      { id: 'b', text: { en: 'will cancel', vi: 'will cancel' } },
      { id: 'c', text: { en: 'would cancel', vi: 'would cancel' } },
      { id: 'd', text: { en: 'have cancelled', vi: 'have cancelled' } },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q_b1_003',
    type: 'multiple_choice',
    cefr: 'B1',
    difficulty: 3,
    skill: 'grammar',
    cefrDescriptor: 'B1 grammar: past continuous vs past simple in interrupted action',
    prompt: {
      en: 'While I ___ dinner, the phone rang.',
      vi: 'While I ___ dinner, the phone rang.',
    },
    options: [
      { id: 'a', text: { en: 'cooked', vi: 'cooked' } },
      { id: 'b', text: { en: 'was cooking', vi: 'was cooking' } },
      { id: 'c', text: { en: 'have cooked', vi: 'have cooked' } },
      { id: 'd', text: { en: 'cook', vi: 'cook' } },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q_b1_004',
    type: 'multiple_choice',
    cefr: 'B1',
    difficulty: 3,
    skill: 'vocabulary',
    cefrDescriptor: "B1 vocabulary: common phrasal verbs ('get up' for waking)",
    prompt: {
      en: 'I need to ___ early tomorrow for my flight.',
      vi: 'I need to ___ early tomorrow for my flight.',
    },
    options: [
      { id: 'a', text: { en: 'get up', vi: 'get up' } },
      { id: 'b', text: { en: 'get off', vi: 'get off' } },
      { id: 'c', text: { en: 'get by', vi: 'get by' } },
      { id: 'd', text: { en: 'get away', vi: 'get away' } },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q_b1_005',
    type: 'multiple_choice',
    cefr: 'B1',
    difficulty: 3,
    skill: 'grammar',
    cefrDescriptor: 'B1 grammar: reported speech — backshift of present simple to past simple',
    prompt: {
      en: 'She said she ___ tired.',
      vi: 'She said she ___ tired.',
    },
    options: [
      { id: 'a', text: { en: 'is', vi: 'is' } },
      { id: 'b', text: { en: 'was', vi: 'was' } },
      { id: 'c', text: { en: 'be', vi: 'be' } },
      { id: 'd', text: { en: 'has been', vi: 'has been' } },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q_b1_006',
    type: 'reading_comprehension',
    cefr: 'B1',
    difficulty: 3,
    skill: 'reading',
    cefrDescriptor: 'B1 reading: opinion article, identify cause',
    passage: {
      en: "Many young people in Vietnam are learning English to find better jobs. English is not only useful for business, but also for travel and making friends from other countries. However, learning a language takes time and practice. Some learners give up because they feel shy when speaking. It is important to remember that making mistakes is part of learning.",
      vi: 'Nhiều bạn trẻ ở Việt Nam học tiếng Anh để tìm công việc tốt hơn. Tiếng Anh không chỉ hữu ích trong kinh doanh, mà còn giúp du lịch và kết bạn với người nước ngoài. Tuy nhiên, học ngôn ngữ cần thời gian và luyện tập. Một số người bỏ cuộc vì họ cảm thấy ngại khi nói. Điều quan trọng là phải nhớ rằng mắc lỗi là một phần của quá trình học.',
    },
    prompt: {
      en: 'According to the text, why do some learners give up?',
      vi: 'Theo bài đọc, vì sao một số người học bỏ cuộc?',
    },
    options: [
      { id: 'a', text: { en: 'Because English is too difficult', vi: 'Vì tiếng Anh quá khó' } },
      { id: 'b', text: { en: "Because they don't have time", vi: 'Vì họ không có thời gian' } },
      { id: 'c', text: { en: 'Because they feel shy when speaking', vi: 'Vì họ cảm thấy ngại khi nói' } },
      { id: 'd', text: { en: "Because they can't find a teacher", vi: 'Vì họ không tìm được giáo viên' } },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'q_b1_007',
    type: 'reading_comprehension',
    cefr: 'B1',
    difficulty: 3,
    skill: 'reading',
    cefrDescriptor: 'B1 reading: process / instructions, extract sequence',
    passage: {
      en: 'To make Vietnamese spring rolls at home, first prepare the ingredients: rice paper, shrimp, pork, lettuce, and herbs. Dip a sheet of rice paper in warm water for a few seconds until it becomes soft. Place the filling in the center and roll it tightly. Serve with peanut sauce or fish sauce. Spring rolls are a light and healthy meal, perfect for a hot day.',
      vi: 'Để làm gỏi cuốn tại nhà, trước tiên chuẩn bị nguyên liệu: bánh tráng, tôm, thịt heo, xà lách và rau thơm. Nhúng một tờ bánh tráng vào nước ấm vài giây cho đến khi mềm. Đặt nhân vào giữa và cuốn chặt. Dùng kèm nước chấm đậu phộng hoặc nước mắm. Gỏi cuốn là món ăn nhẹ và lành mạnh, rất hợp cho ngày nóng.',
    },
    prompt: {
      en: 'What should you do before placing the filling?',
      vi: 'Bạn nên làm gì trước khi đặt nhân vào bánh tráng?',
    },
    options: [
      { id: 'a', text: { en: 'Cook the shrimp', vi: 'Nấu tôm' } },
      { id: 'b', text: { en: 'Chop the herbs', vi: 'Thái rau thơm' } },
      { id: 'c', text: { en: 'Dip the rice paper in warm water', vi: 'Nhúng bánh tráng vào nước ấm' } },
      { id: 'd', text: { en: 'Make the peanut sauce', vi: 'Làm nước chấm đậu phộng' } },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'q_b1_008',
    type: 'reading_comprehension',
    cefr: 'B1',
    difficulty: 3,
    skill: 'reading',
    cefrDescriptor: 'B1 reading: public notice / news, specific factual detail',
    passage: {
      en: 'A new library opened last week in the city center. The library has over 20,000 books in both Vietnamese and English. It also offers free Wi-Fi and quiet study rooms for students. The opening hours are from 8 a.m. to 9 p.m. every day except Monday. Anyone can become a member for free by showing their ID card.',
      vi: 'Một thư viện mới mở cửa tuần trước tại trung tâm thành phố. Thư viện có hơn 20.000 cuốn sách bằng cả tiếng Việt và tiếng Anh. Thư viện cũng có Wi-Fi miễn phí và phòng tự học yên tĩnh cho sinh viên. Giờ mở cửa từ 8 giờ sáng đến 9 giờ tối mỗi ngày trừ thứ Hai. Bất kỳ ai cũng có thể trở thành thành viên miễn phí bằng cách xuất trình chứng minh thư.',
    },
    prompt: {
      en: 'When is the library closed?',
      vi: 'Thư viện đóng cửa vào ngày nào?',
    },
    options: [
      { id: 'a', text: { en: 'On Sunday', vi: 'Chủ nhật' } },
      { id: 'b', text: { en: 'On Monday', vi: 'Thứ hai' } },
      { id: 'c', text: { en: 'In the morning', vi: 'Buổi sáng' } },
      { id: 'd', text: { en: 'After 9 p.m.', vi: 'Sau 9 giờ tối' } },
    ],
    correctOptionId: 'b',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// B2 — Complex tenses, conditionals, passive, relative clauses (6 questions)
// ─────────────────────────────────────────────────────────────────────────────

const B2: PlacementQuestion[] = [
  {
    id: 'q_b2_001',
    type: 'multiple_choice',
    cefr: 'B2',
    difficulty: 4,
    skill: 'grammar',
    cefrDescriptor: "B2 grammar: second conditional with 'were' for hypothetical present",
    prompt: {
      en: 'If I ___ you, I would apologize immediately.',
      vi: 'If I ___ you, I would apologize immediately.',
    },
    options: [
      { id: 'a', text: { en: 'am', vi: 'am' } },
      { id: 'b', text: { en: 'was', vi: 'was' } },
      { id: 'c', text: { en: 'were', vi: 'were' } },
      { id: 'd', text: { en: 'would be', vi: 'would be' } },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'q_b2_002',
    type: 'multiple_choice',
    cefr: 'B2',
    difficulty: 4,
    skill: 'grammar',
    cefrDescriptor: 'B2 grammar: third conditional (hypothetical past, past perfect in if-clause)',
    prompt: {
      en: 'If she ___ studied harder, she would have passed the exam.',
      vi: 'If she ___ studied harder, she would have passed the exam.',
    },
    options: [
      { id: 'a', text: { en: 'has', vi: 'has' } },
      { id: 'b', text: { en: 'had', vi: 'had' } },
      { id: 'c', text: { en: 'have', vi: 'have' } },
      { id: 'd', text: { en: 'would have', vi: 'would have' } },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q_b2_003',
    type: 'multiple_choice',
    cefr: 'B2',
    difficulty: 4,
    skill: 'grammar',
    cefrDescriptor: 'B2 grammar: passive voice in future tense',
    prompt: {
      en: 'The report ___ by tomorrow morning.',
      vi: 'The report ___ by tomorrow morning.',
    },
    options: [
      { id: 'a', text: { en: 'will finish', vi: 'will finish' } },
      { id: 'b', text: { en: 'will be finished', vi: 'will be finished' } },
      { id: 'c', text: { en: 'finishes', vi: 'finishes' } },
      { id: 'd', text: { en: 'has finished', vi: 'has finished' } },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q_b2_004',
    type: 'multiple_choice',
    cefr: 'B2',
    difficulty: 4,
    skill: 'vocabulary',
    cefrDescriptor: "B2 vocabulary: verb collocations in business register ('deliver a project')",
    prompt: {
      en: 'Despite the setback, the team managed to ___ the project on schedule.',
      vi: 'Despite the setback, the team managed to ___ the project on schedule.',
    },
    options: [
      { id: 'a', text: { en: 'give', vi: 'give' } },
      { id: 'b', text: { en: 'make', vi: 'make' } },
      { id: 'c', text: { en: 'deliver', vi: 'deliver' } },
      { id: 'd', text: { en: 'produce', vi: 'produce' } },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'q_b2_005',
    type: 'reading_comprehension',
    cefr: 'B2',
    difficulty: 4,
    skill: 'reading',
    cefrDescriptor: "B2 reading: argumentative text — identify writer's main argument",
    passage: {
      en: 'Remote work has transformed the modern workplace. Employees can now balance their professional and personal lives more flexibly, often saving hours of commuting each day. However, this shift has also introduced challenges. Some workers report feelings of isolation and difficulty separating work from home life. Companies must therefore invest not only in technology but also in strategies that maintain team cohesion and employee well-being. The most successful organisations treat remote work as a long-term cultural change rather than a temporary arrangement.',
      vi: 'Làm việc từ xa đã thay đổi nơi làm việc hiện đại. Nhân viên giờ có thể cân bằng cuộc sống công việc và cá nhân linh hoạt hơn, thường tiết kiệm được hàng giờ di chuyển mỗi ngày. Tuy nhiên, sự thay đổi này cũng mang đến thách thức. Một số người lao động nói rằng họ cảm thấy cô lập và khó tách bạch công việc với cuộc sống gia đình. Vì vậy, các công ty phải đầu tư không chỉ vào công nghệ mà còn vào các chiến lược duy trì sự gắn kết đội nhóm và sức khỏe tinh thần của nhân viên. Những tổ chức thành công nhất xem làm việc từ xa là thay đổi văn hóa lâu dài chứ không phải là giải pháp tạm thời.',
    },
    prompt: {
      en: 'What does the writer suggest about successful organisations?',
      vi: 'Tác giả gợi ý điều gì về các tổ chức thành công?',
    },
    options: [
      { id: 'a', text: { en: 'They avoid remote work entirely', vi: 'Họ hoàn toàn tránh làm việc từ xa' } },
      { id: 'b', text: { en: 'They treat remote work as a long-term cultural change', vi: 'Họ coi làm việc từ xa là thay đổi văn hóa lâu dài' } },
      { id: 'c', text: { en: 'They force employees back to the office', vi: 'Họ ép nhân viên quay lại văn phòng' } },
      { id: 'd', text: { en: 'They only invest in new technology', vi: 'Họ chỉ đầu tư vào công nghệ mới' } },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q_b2_006',
    type: 'reading_comprehension',
    cefr: 'B2',
    difficulty: 4,
    skill: 'reading',
    cefrDescriptor: 'B2 reading: narrative with inference — interpret emotional subtext',
    passage: {
      en: 'Mai stood at the airport gate, her passport clutched tightly in one hand. She had dreamed of studying abroad for years, but now that the moment had arrived, her stomach turned with both excitement and fear. Her parents waved from behind the glass, their smiles slightly forced. Mai waved back, knowing that this goodbye would change everything — not just for her, but for the family she was leaving behind.',
      vi: 'Mai đứng ở cổng sân bay, hộ chiếu nắm chặt trong tay. Em đã mơ ước được đi du học nhiều năm, nhưng giờ khi thời khắc đã đến, bụng em cồn cào vừa háo hức vừa lo sợ. Bố mẹ em vẫy tay sau lớp kính, nụ cười của họ có phần gượng gạo. Mai vẫy lại, biết rằng lời chia tay này sẽ thay đổi mọi thứ — không chỉ với em, mà cả gia đình em đang để lại.',
    },
    prompt: {
      en: "Why were the parents' smiles 'slightly forced'?",
      vi: "Vì sao nụ cười của bố mẹ 'có phần gượng gạo'?",
    },
    options: [
      { id: 'a', text: { en: 'They were angry with Mai', vi: 'Họ đang giận Mai' } },
      { id: 'b', text: { en: 'They were in a hurry', vi: 'Họ đang vội' } },
      { id: 'c', text: { en: 'They were sad to see her leave', vi: 'Họ buồn khi thấy em rời đi' } },
      { id: 'd', text: { en: 'They disapproved of her decision', vi: 'Họ không đồng ý với quyết định của em' } },
    ],
    correctOptionId: 'c',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// C1 — Advanced grammar, idioms, collocations (6 questions)
// ─────────────────────────────────────────────────────────────────────────────

const C1: PlacementQuestion[] = [
  {
    id: 'q_c1_001',
    type: 'multiple_choice',
    cefr: 'C1',
    difficulty: 5,
    skill: 'grammar',
    cefrDescriptor:
      'C1 grammar: mixed conditional — past condition, present consequence',
    prompt: {
      en: "If you had followed my advice, you ___ in this mess now.",
      vi: "If you had followed my advice, you ___ in this mess now.",
    },
    options: [
      { id: 'a', text: { en: "wouldn't have been", vi: "wouldn't have been" } },
      { id: 'b', text: { en: "wouldn't be", vi: "wouldn't be" } },
      { id: 'c', text: { en: "won't be", vi: "won't be" } },
      { id: 'd', text: { en: "aren't", vi: "aren't" } },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q_c1_002',
    type: 'multiple_choice',
    cefr: 'C1',
    difficulty: 5,
    skill: 'grammar',
    cefrDescriptor: "C1 grammar: inversion with negative adverbs for emphasis ('Never have I...')",
    prompt: {
      en: 'Never ___ such a beautiful sunset.',
      vi: 'Never ___ such a beautiful sunset.',
    },
    options: [
      { id: 'a', text: { en: 'I saw', vi: 'I saw' } },
      { id: 'b', text: { en: 'I have seen', vi: 'I have seen' } },
      { id: 'c', text: { en: 'have I seen', vi: 'have I seen' } },
      { id: 'd', text: { en: 'did I saw', vi: 'did I saw' } },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'q_c1_003',
    type: 'multiple_choice',
    cefr: 'C1',
    difficulty: 5,
    skill: 'vocabulary',
    cefrDescriptor: "C1 vocabulary: advanced / academic register ('conclusive')",
    prompt: {
      en: 'The evidence is ___, leaving little room for doubt about the conclusion.',
      vi: 'The evidence is ___, leaving little room for doubt about the conclusion.',
    },
    options: [
      { id: 'a', text: { en: 'obvious', vi: 'obvious' } },
      { id: 'b', text: { en: 'conclusive', vi: 'conclusive' } },
      { id: 'c', text: { en: 'clear', vi: 'clear' } },
      { id: 'd', text: { en: 'big', vi: 'big' } },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q_c1_004',
    type: 'multiple_choice',
    cefr: 'C1',
    difficulty: 5,
    skill: 'usage',
    cefrDescriptor: "C1 usage: cohesive devices / discourse markers ('nevertheless')",
    prompt: {
      en: 'The report is incomplete; ___, it offers a useful starting point for discussion.',
      vi: 'The report is incomplete; ___, it offers a useful starting point for discussion.',
    },
    options: [
      { id: 'a', text: { en: 'therefore', vi: 'therefore' } },
      { id: 'b', text: { en: 'because', vi: 'because' } },
      { id: 'c', text: { en: 'nevertheless', vi: 'nevertheless' } },
      { id: 'd', text: { en: 'however then', vi: 'however then' } },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'q_c1_005',
    type: 'reading_comprehension',
    cefr: 'C1',
    difficulty: 5,
    skill: 'reading',
    cefrDescriptor: "C1 reading: abstract / analytical argument — identify writer's thesis",
    passage: {
      en: "The debate over artificial intelligence often oscillates between utopian and dystopian visions, yet neither extreme serves us well. The more productive question is not whether AI will replace human labour, but how we might restructure society to benefit from its productivity gains. Historical precedent suggests that technological revolutions rarely unfold as predicted: the printing press was feared as a threat to memory; the automobile was seen as a passing novelty. What matters is less the technology itself than the social institutions, labour laws, and educational systems built around it. Our collective agency in shaping those frameworks determines whether automation becomes a force for broad prosperity or for deepening inequality.",
      vi: 'Cuộc tranh luận về trí tuệ nhân tạo thường dao động giữa viễn cảnh không tưởng và viễn cảnh đen tối, nhưng không thái cực nào giúp ích cho chúng ta. Câu hỏi có ích hơn không phải là liệu AI có thay thế lao động con người hay không, mà là làm sao tái cấu trúc xã hội để hưởng lợi từ năng suất nó mang lại. Tiền lệ lịch sử cho thấy các cuộc cách mạng công nghệ hiếm khi diễn ra như dự đoán: máy in từng bị sợ hãi vì cho là đe dọa trí nhớ; ô tô từng bị xem là thứ mới lạ thoáng qua. Điều quan trọng không phải là bản thân công nghệ, mà là các thể chế xã hội, luật lao động và hệ thống giáo dục được xây dựng xung quanh nó. Khả năng tập thể của chúng ta trong việc định hình các khuôn khổ đó quyết định liệu tự động hóa trở thành lực lượng thúc đẩy sự thịnh vượng rộng rãi hay làm sâu sắc thêm bất bình đẳng.',
    },
    prompt: {
      en: "What is the writer's main argument?",
      vi: 'Luận điểm chính của tác giả là gì?',
    },
    options: [
      { id: 'a', text: { en: 'AI will definitely replace human workers', vi: 'AI chắc chắn sẽ thay thế người lao động' } },
      { id: 'b', text: { en: 'AI should be banned to protect jobs', vi: 'AI nên bị cấm để bảo vệ việc làm' } },
      { id: 'c', text: { en: 'The social structures around AI matter more than the technology itself', vi: 'Cấu trúc xã hội xung quanh AI quan trọng hơn bản thân công nghệ' } },
      { id: 'd', text: { en: 'Historical predictions about technology have always been accurate', vi: 'Các dự đoán lịch sử về công nghệ luôn chính xác' } },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'q_c1_006',
    type: 'reading_comprehension',
    cefr: 'C1',
    difficulty: 5,
    skill: 'reading',
    cefrDescriptor: "C1 reading: interpret tone — distinguish mild skepticism from direct criticism",
    passage: {
      en: "Dr. Nguyen's latest book is, to put it charitably, ambitious. She attempts to reconcile twenty centuries of philosophical tradition with contemporary neuroscience in a mere three hundred pages. The result, while occasionally brilliant, more often reads like a tour of highlights selected to support predetermined conclusions rather than a rigorous synthesis. Readers looking for a provocation will find much to underline; those seeking a definitive treatment may wish to keep their expectations modest.",
      vi: 'Cuốn sách mới nhất của Tiến sĩ Nguyễn, nói một cách nhẹ nhàng, là tham vọng. Bà cố gắng dung hòa hai mươi thế kỷ truyền thống triết học với thần kinh học đương đại trong vỏn vẹn ba trăm trang. Kết quả, dù đôi khi xuất sắc, thường đọc giống một chuyến dạo quanh những điểm nhấn được chọn để ủng hộ các kết luận định sẵn hơn là một sự tổng hợp nghiêm ngặt. Những độc giả muốn tìm một tác phẩm khiêu khích sẽ có nhiều chỗ để gạch chân; những ai tìm một công trình dứt khoát có lẽ nên giảm kỳ vọng.',
    },
    prompt: {
      en: "What is the reviewer's overall attitude?",
      vi: 'Thái độ tổng thể của người điểm sách là gì?',
    },
    options: [
      { id: 'a', text: { en: 'Enthusiastic praise', vi: 'Khen ngợi nồng nhiệt' } },
      { id: 'b', text: { en: 'Outright condemnation', vi: 'Lên án thẳng thừng' } },
      { id: 'c', text: { en: 'Polite but skeptical', vi: 'Lịch sự nhưng hoài nghi' } },
      { id: 'd', text: { en: 'Neutral summary without opinion', vi: 'Tóm tắt trung lập, không đưa ra ý kiến' } },
    ],
    correctOptionId: 'c',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// C2 — Near-native nuance, subjunctive, idioms (4 questions)
// ─────────────────────────────────────────────────────────────────────────────

const C2: PlacementQuestion[] = [
  {
    id: 'q_c2_001',
    type: 'multiple_choice',
    cefr: 'C2',
    difficulty: 6,
    skill: 'grammar',
    cefrDescriptor:
      "C2 grammar: subjunctive in formal register after 'recommend that / suggest that'",
    prompt: {
      en: 'The committee recommended that the proposal ___ rejected.',
      vi: 'The committee recommended that the proposal ___ rejected.',
    },
    options: [
      { id: 'a', text: { en: 'is', vi: 'is' } },
      { id: 'b', text: { en: 'was', vi: 'was' } },
      { id: 'c', text: { en: 'be', vi: 'be' } },
      { id: 'd', text: { en: 'would be', vi: 'would be' } },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'q_c2_002',
    type: 'multiple_choice',
    cefr: 'C2',
    difficulty: 6,
    skill: 'vocabulary',
    cefrDescriptor: "C2 vocabulary: sophisticated register and nuance ('egregious')",
    prompt: {
      en: "The minister's remarks were widely condemned as ___ — at best tone-deaf, at worst deliberately provocative.",
      vi: "The minister's remarks were widely condemned as ___ — at best tone-deaf, at worst deliberately provocative.",
    },
    options: [
      { id: 'a', text: { en: 'confusing', vi: 'confusing' } },
      { id: 'b', text: { en: 'interesting', vi: 'interesting' } },
      { id: 'c', text: { en: 'boring', vi: 'boring' } },
      { id: 'd', text: { en: 'egregious', vi: 'egregious' } },
    ],
    correctOptionId: 'd',
  },
  {
    id: 'q_c2_003',
    type: 'multiple_choice',
    cefr: 'C2',
    difficulty: 6,
    skill: 'usage',
    cefrDescriptor: "C2 usage: idiomatic discourse markers ('by and large')",
    prompt: {
      en: 'The policy, though well-intentioned, has ___ created more problems than it has solved.',
      vi: 'The policy, though well-intentioned, has ___ created more problems than it has solved.',
    },
    options: [
      { id: 'a', text: { en: 'by and large', vi: 'by and large' } },
      { id: 'b', text: { en: 'in the mean', vi: 'in the mean' } },
      { id: 'c', text: { en: 'by the way', vi: 'by the way' } },
      { id: 'd', text: { en: 'on all hand', vi: 'on all hand' } },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q_c2_004',
    type: 'multiple_choice',
    cefr: 'C2',
    difficulty: 6,
    skill: 'grammar',
    cefrDescriptor: "C2 grammar: bare infinitive after 'would sooner...than' (subjunctive-adjacent)",
    prompt: {
      en: 'I would sooner eat glass than ___ another meeting about it.',
      vi: 'I would sooner eat glass than ___ another meeting about it.',
    },
    options: [
      { id: 'a', text: { en: 'to sit through', vi: 'to sit through' } },
      { id: 'b', text: { en: 'sit through', vi: 'sit through' } },
      { id: 'c', text: { en: 'sitting through', vi: 'sitting through' } },
      { id: 'd', text: { en: 'I sit through', vi: 'I sit through' } },
    ],
    correctOptionId: 'b',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Export combined bank
// ─────────────────────────────────────────────────────────────────────────────

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  ...A1,
  ...A2,
  ...B1,
  ...B2,
  ...C1,
  ...C2,
];

/** Convenience accessor: all questions at a given CEFR level. */
export function questionsAt(cefr: CEFR): PlacementQuestion[] {
  return PLACEMENT_QUESTIONS.filter((q) => q.cefr === cefr);
}

/** Convenience accessor: a question by id (returns undefined if not found). */
export function questionById(id: string): PlacementQuestion | undefined {
  return PLACEMENT_QUESTIONS.find((q) => q.id === id);
}
