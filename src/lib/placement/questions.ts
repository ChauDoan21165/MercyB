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
//                       question targets (for review). Items targeting
//                       Vietnamese L1 interference are prefixed with
//                       "Vietnamese L1 interference: <pattern>".
//   - prompt          — bilingual question text (en + vi). Vietnamese is
//                       provided to help learners understand the task.
//   - options         — 4 choices (id a..d). OPTION LABELS ARE ENGLISH ONLY.
//                       The schema keeps a BilingualText shape for simplicity,
//                       but vi === en for every option so we don't leak the
//                       answer via translation (doing otherwise lets learners
//                       pattern-match in Vietnamese rather than actually
//                       reading the English).
//   - correctOptionId — which option id is correct
//
// Reading questions additionally carry a `passage` field with a bilingual
// passage. The passage is translated so a learner can navigate, but the skill
// being tested is comprehension of the English — the Vietnamese is support,
// not the answer key.
//
// Distribution (43 questions):
//   A1: 8 multiple-choice + 1 reading             = 9
//   A2: 9 multiple-choice + 2 reading             = 11
//   B1: 6 multiple-choice + 3 reading             = 9
//   B2: 4 multiple-choice + 2 reading             = 6
//   C1: 4 multiple-choice + 2 reading             = 6
//   C2: 4 multiple-choice + 0 reading             = 4
//
// Includes 3 Vietnamese-L1-interference items (q_a1_009 plural -s,
// q_a2_009 past -ed, q_b1_009 third-person -s) — documented Vietnamese
// learner error patterns that raw CEFR tests often miss.
//
// No audio / listening questions in v0 (deferred to v1 per Chau's decision).
// No runtime AI — deterministic scoring only.

export type CEFR = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type QuestionSkill = 'grammar' | 'vocabulary' | 'usage' | 'reading';

export type BilingualText = {
  en: string;
  vi: string;
};

export type QuestionOption = {
  id: 'a' | 'b' | 'c' | 'd';
  /** Option labels are English only. vi === en by contract. */
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

// Helper: option labels are English only. vi === en.
const en = (text: string): BilingualText => ({ en: text, vi: text });

// ─────────────────────────────────────────────────────────────────────────────
// A1 — Basic survival, present tense, simple sentences (9 questions)
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
      { id: 'a', text: en('is') },
      { id: 'b', text: en('am') },
      { id: 'c', text: en('are') },
      { id: 'd', text: en('be') },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q_a1_002',
    type: 'multiple_choice',
    cefr: 'A1',
    difficulty: 1,
    skill: 'vocabulary',
    cefrDescriptor: 'A1 vocabulary: basic personal information (name / age / greeting)',
    prompt: {
      en: 'Hello, my ___ is Minh.',
      vi: 'Hello, my ___ is Minh.',
    },
    options: [
      { id: 'a', text: en('name') },
      { id: 'b', text: en('age') },
      { id: 'c', text: en('color') },
      { id: 'd', text: en('house') },
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
      { id: 'a', text: en('five') },
      { id: 'b', text: en('six') },
      { id: 'c', text: en('seven') },
      { id: 'd', text: en('ten') },
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
      { id: 'a', text: en('a') },
      { id: 'b', text: en('an') },
      { id: 'c', text: en('the') },
      { id: 'd', text: en('(no article)') },
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
      { id: 'a', text: en('He') },
      { id: 'b', text: en('Him') },
      { id: 'c', text: en('His') },
      { id: 'd', text: en("He's") },
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
      { id: 'a', text: en('cousin') },
      { id: 'b', text: en('nephew') },
      { id: 'c', text: en('uncle') },
      { id: 'd', text: en('grandfather') },
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
      { id: 'a', text: en('What') },
      { id: 'b', text: en('When') },
      { id: 'c', text: en('Where') },
      { id: 'd', text: en('Who') },
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
      { id: 'a', text: en('One') },
      { id: 'b', text: en('Two') },
      { id: 'c', text: en('Three') },
      { id: 'd', text: en('None') },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q_a1_009',
    type: 'multiple_choice',
    cefr: 'A1',
    difficulty: 1,
    skill: 'grammar',
    cefrDescriptor:
      'Vietnamese L1 interference: plural noun inflection (-s) — Vietnamese marks plurals with measure words, not suffixes, so learners often drop the -s',
    prompt: {
      en: 'I have three ___ on my desk.',
      vi: 'I have three ___ on my desk.',
    },
    options: [
      { id: 'a', text: en('book') },
      { id: 'b', text: en('books') },
      { id: 'c', text: en('bookes') },
      { id: 'd', text: en('a book') },
    ],
    correctOptionId: 'b',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// A2 — Simple past, basic modals, prepositions (11 questions)
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
      { id: 'a', text: en('finish') },
      { id: 'b', text: en('finishes') },
      { id: 'c', text: en('finished') },
      { id: 'd', text: en('finishing') },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'q_a2_002',
    type: 'multiple_choice',
    cefr: 'A2',
    difficulty: 2,
    skill: 'grammar',
    cefrDescriptor: 'A2 grammar: past simple of irregular verbs (eat → ate)',
    prompt: {
      en: 'She ___ breakfast at 7 a.m. yesterday.',
      vi: 'She ___ breakfast at 7 a.m. yesterday.',
    },
    options: [
      { id: 'a', text: en('ate') },
      { id: 'b', text: en('eat') },
      { id: 'c', text: en('eated') },
      { id: 'd', text: en('eating') },
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
      { id: 'a', text: en('tall') },
      { id: 'b', text: en('taller') },
      { id: 'c', text: en('tallest') },
      { id: 'd', text: en('more tall') },
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
      { id: 'a', text: en('cans') },
      { id: 'b', text: en('can') },
      { id: 'c', text: en('caning') },
      { id: 'd', text: en('canning') },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q_a2_005',
    type: 'multiple_choice',
    cefr: 'A2',
    difficulty: 2,
    skill: 'vocabulary',
    cefrDescriptor: 'A2 vocabulary: prepositions of time (in / on / at) with years',
    prompt: {
      en: 'I was born ___ 1995.',
      vi: 'I was born ___ 1995.',
    },
    options: [
      { id: 'a', text: en('on') },
      { id: 'b', text: en('at') },
      { id: 'c', text: en('in') },
      { id: 'd', text: en('by') },
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
      { id: 'a', text: en('is going to') },
      { id: 'b', text: en('go to') },
      { id: 'c', text: en('goes') },
      { id: 'd', text: en('will going') },
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
      { id: 'a', text: en('Rice') },
      { id: 'b', text: en('Noodles') },
      { id: 'c', text: en('Pizza') },
      { id: 'd', text: en('Fish') },
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
      { id: 'a', text: en('By bus') },
      { id: 'b', text: en('By car') },
      { id: 'c', text: en('By motorbike') },
      { id: 'd', text: en('By bicycle') },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'q_a2_009',
    type: 'multiple_choice',
    cefr: 'A2',
    difficulty: 2,
    skill: 'grammar',
    cefrDescriptor:
      'Vietnamese L1 interference: past-simple regular -ed ending — Vietnamese speech tends to drop final consonants, so "walked" is often heard/written as "walk"',
    prompt: {
      en: 'Yesterday I ___ to the market with my mother.',
      vi: 'Yesterday I ___ to the market with my mother.',
    },
    options: [
      { id: 'a', text: en('walk') },
      { id: 'b', text: en('walked') },
      { id: 'c', text: en('walking') },
      { id: 'd', text: en('walks') },
    ],
    correctOptionId: 'b',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// B1 — Present perfect, conditionals, phrasal verbs (9 questions)
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
      { id: 'a', text: en('Did / go') },
      { id: 'b', text: en('Have / gone') },
      { id: 'c', text: en('Are / going') },
      { id: 'd', text: en('Do / go') },
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
      { id: 'a', text: en('cancel') },
      { id: 'b', text: en('will cancel') },
      { id: 'c', text: en('would cancel') },
      { id: 'd', text: en('have cancelled') },
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
      { id: 'a', text: en('cooked') },
      { id: 'b', text: en('was cooking') },
      { id: 'c', text: en('have cooked') },
      { id: 'd', text: en('cook') },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q_b1_004',
    type: 'multiple_choice',
    cefr: 'B1',
    difficulty: 3,
    skill: 'vocabulary',
    cefrDescriptor:
      "B1 vocabulary: three-word phrasal verbs — 'put up with' (tolerate). Tests preposition-selection awareness beyond surface-level phrasal-verb recognition.",
    prompt: {
      en: "I can't ___ his rude behavior any longer.",
      vi: "I can't ___ his rude behavior any longer.",
    },
    options: [
      { id: 'a', text: en('put away') },
      { id: 'b', text: en('put up with') },
      { id: 'c', text: en('put down') },
      { id: 'd', text: en('put off') },
    ],
    correctOptionId: 'b',
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
      { id: 'a', text: en('is') },
      { id: 'b', text: en('was') },
      { id: 'c', text: en('be') },
      { id: 'd', text: en('has been') },
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
      en: 'Many young people in Vietnam are learning English to find better jobs. English is not only useful for business, but also for travel and making friends from other countries. However, learning a language takes time and practice. Some learners give up because they feel shy when speaking. It is important to remember that making mistakes is part of learning.',
      vi: 'Nhiều bạn trẻ ở Việt Nam học tiếng Anh để tìm công việc tốt hơn. Tiếng Anh không chỉ hữu ích trong kinh doanh, mà còn giúp du lịch và kết bạn với người nước ngoài. Tuy nhiên, học ngôn ngữ cần thời gian và luyện tập. Một số người bỏ cuộc vì họ cảm thấy ngại khi nói. Điều quan trọng là phải nhớ rằng mắc lỗi là một phần của quá trình học.',
    },
    prompt: {
      en: 'According to the text, why do some learners give up?',
      vi: 'Theo bài đọc, vì sao một số người học bỏ cuộc?',
    },
    options: [
      { id: 'a', text: en('Because English is too difficult') },
      { id: 'b', text: en("Because they don't have time") },
      { id: 'c', text: en('Because they feel shy when speaking') },
      { id: 'd', text: en("Because they can't find a teacher") },
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
      { id: 'a', text: en('Cook the shrimp') },
      { id: 'b', text: en('Chop the herbs') },
      { id: 'c', text: en('Dip the rice paper in warm water') },
      { id: 'd', text: en('Make the peanut sauce') },
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
      { id: 'a', text: en('On Sunday') },
      { id: 'b', text: en('On Monday') },
      { id: 'c', text: en('In the morning') },
      { id: 'd', text: en('After 9 p.m.') },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q_b1_009',
    type: 'multiple_choice',
    cefr: 'B1',
    difficulty: 3,
    skill: 'grammar',
    cefrDescriptor:
      'Vietnamese L1 interference: third-person singular -s in present simple. This is the most chronic Vietnamese-learner error and often persists into B1 / B2 — placing it at B1 catches learners whose level is otherwise B1 but who still miss this feature.',
    prompt: {
      en: 'She ___ English every day.',
      vi: 'She ___ English every day.',
    },
    options: [
      { id: 'a', text: en('study') },
      { id: 'b', text: en('studies') },
      { id: 'c', text: en('studying') },
      { id: 'd', text: en('studied') },
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
      { id: 'a', text: en('am') },
      { id: 'b', text: en('was') },
      { id: 'c', text: en('were') },
      { id: 'd', text: en('would be') },
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
      { id: 'a', text: en('has') },
      { id: 'b', text: en('had') },
      { id: 'c', text: en('have') },
      { id: 'd', text: en('would have') },
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
      { id: 'a', text: en('will finish') },
      { id: 'b', text: en('will be finished') },
      { id: 'c', text: en('finishes') },
      { id: 'd', text: en('has finished') },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q_b2_004',
    type: 'multiple_choice',
    cefr: 'B2',
    difficulty: 4,
    skill: 'vocabulary',
    cefrDescriptor:
      "B2 vocabulary: business collocation — 'meet a deadline'. Distractor verbs (reach, arrive, catch) are plausible from direct translation but wrong in English.",
    prompt: {
      en: "We'll have to work overtime to ___ the deadline.",
      vi: "We'll have to work overtime to ___ the deadline.",
    },
    options: [
      { id: 'a', text: en('reach') },
      { id: 'b', text: en('meet') },
      { id: 'c', text: en('arrive') },
      { id: 'd', text: en('catch') },
    ],
    correctOptionId: 'b',
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
      { id: 'a', text: en('They avoid remote work entirely') },
      { id: 'b', text: en('They treat remote work as a long-term cultural change') },
      { id: 'c', text: en('They force employees back to the office') },
      { id: 'd', text: en('They only invest in new technology') },
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
      { id: 'a', text: en('They were angry with Mai') },
      { id: 'b', text: en('They were in a hurry') },
      { id: 'c', text: en('They were sad to see her leave') },
      { id: 'd', text: en('They disapproved of her decision') },
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
      { id: 'a', text: en("wouldn't have been") },
      { id: 'b', text: en("wouldn't be") },
      { id: 'c', text: en("won't be") },
      { id: 'd', text: en("aren't") },
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
      { id: 'a', text: en('I saw') },
      { id: 'b', text: en('I have seen') },
      { id: 'c', text: en('have I seen') },
      { id: 'd', text: en('did I saw') },
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
      { id: 'a', text: en('obvious') },
      { id: 'b', text: en('conclusive') },
      { id: 'c', text: en('clear') },
      { id: 'd', text: en('big') },
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
      { id: 'a', text: en('therefore') },
      { id: 'b', text: en('because') },
      { id: 'c', text: en('nevertheless') },
      { id: 'd', text: en('however then') },
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
      { id: 'a', text: en('AI will definitely replace human workers') },
      { id: 'b', text: en('AI should be banned to protect jobs') },
      { id: 'c', text: en('The social structures around AI matter more than the technology itself') },
      { id: 'd', text: en('Historical predictions about technology have always been accurate') },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'q_c1_006',
    type: 'reading_comprehension',
    cefr: 'C1',
    difficulty: 5,
    skill: 'reading',
    cefrDescriptor: 'C1 reading: interpret tone — distinguish mild skepticism from direct criticism',
    passage: {
      en: "Dr. Nguyen's latest book is, to put it charitably, ambitious. She attempts to reconcile twenty centuries of philosophical tradition with contemporary neuroscience in a mere three hundred pages. The result, while occasionally brilliant, more often reads like a tour of highlights selected to support predetermined conclusions rather than a rigorous synthesis. Readers looking for a provocation will find much to underline; those seeking a definitive treatment may wish to keep their expectations modest.",
      vi: 'Cuốn sách mới nhất của Tiến sĩ Nguyễn, nói một cách nhẹ nhàng, là tham vọng. Bà cố gắng dung hòa hai mươi thế kỷ truyền thống triết học với thần kinh học đương đại trong vỏn vẹn ba trăm trang. Kết quả, dù đôi khi xuất sắc, thường đọc giống một chuyến dạo quanh những điểm nhấn được chọn để ủng hộ các kết luận định sẵn hơn là một sự tổng hợp nghiêm ngặt. Những độc giả muốn tìm một tác phẩm khiêu khích sẽ có nhiều chỗ để gạch chân; những ai tìm một công trình dứt khoát có lẽ nên giảm kỳ vọng.',
    },
    prompt: {
      en: "What is the reviewer's overall attitude?",
      vi: 'Thái độ tổng thể của người điểm sách là gì?',
    },
    options: [
      { id: 'a', text: en('Enthusiastic praise') },
      { id: 'b', text: en('Outright condemnation') },
      { id: 'c', text: en('Polite but skeptical') },
      { id: 'd', text: en('Neutral summary without opinion') },
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
      { id: 'a', text: en('is') },
      { id: 'b', text: en('was') },
      { id: 'c', text: en('be') },
      { id: 'd', text: en('would be') },
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
      { id: 'a', text: en('confusing') },
      { id: 'b', text: en('interesting') },
      { id: 'c', text: en('boring') },
      { id: 'd', text: en('egregious') },
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
      { id: 'a', text: en('by and large') },
      { id: 'b', text: en('in the mean') },
      { id: 'c', text: en('by the way') },
      { id: 'd', text: en('on all hand') },
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
      { id: 'a', text: en('to sit through') },
      { id: 'b', text: en('sit through') },
      { id: 'c', text: en('sitting through') },
      { id: 'd', text: en('I sit through') },
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
