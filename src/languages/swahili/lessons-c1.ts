// src/languages/swahili/lessons-c1.ts
//
// Swahili C1 (Advanced) lessons — adapted from A5-authoring room JSONs
// (swahili_c1_c101 through swahili_c1_c114).
//
// 14 lessons covering: complex sentences, verb extensions, relative clauses,
// idioms/proverbs, register, noun class agreement, narrative, academic/abstract,
// debate, business/presentations, literary, conditional, cultural nuances, opinions.
//
// Vietnamese-first pedagogy with English companion fields.

import type { SwahiliLesson } from "./lessons";

export const lessons: SwahiliLesson[] = [
  // C1-01 — Advanced Swahili Sentence Building
  {
    id: 'swahili_c1_complex_sentences',
    level: 'C1',
    category: 'complex_sentences',
    title_vi: 'C1-01 — Xây Dựng Câu Phức Trong Tiếng Swahili',
    title_en: 'C1-01 — Advanced Swahili Sentence Building',
    intro_vi: 'Phòng này dạy bạn xây dựng câu Swahili phức tạp với nhiều mệnh đề. Bạn sẽ học cách nối ý bằng liên từ, lồng mệnh đề phụ, và duy trì sự hòa hợp danh từ xuyên suốt câu dài.',
    intro_en: 'This room teaches you to build complex Swahili sentences with multiple clauses. You will learn how to connect ideas using conjunctions, embed subordinate clauses, and maintain correct noun class agreement across long sentences.',
    sentences: [
      {
        sw: 'Nilikwenda sokoni na nilinunua matunda',
        en: 'I went to the market and I bought fruit',
        vi: 'Tôi đã đi chợ và tôi đã mua trái cây',
        pronunciation_focus: ['Nilikwenda → nilikwenda', 'sokoni → sokoni', 'nilinunua → nilinunua', 'matunda → matunda'],
        pronunciation_focus_en: ['Nilikwenda = nilikwenda', 'sokoni = sokoni', 'nilinunua = nilinunua', 'matunda = matunda']
      },
      {
        sw: 'Alijaribu kufika mapema lakini basi lilichelewa',
        en: 'He tried to arrive early but the bus was late',
        vi: 'Tôi đã đi chợ và tôi đã mua trái cây',
        pronunciation_focus: ['Alijaribu → alijaribu', 'kufika → kufika', 'mapema → mapema', 'lakini → lakini'],
        pronunciation_focus_en: ['Alijaribu = alijaribu', 'kufika = kufika', 'mapema = mapema', 'lakini = lakini']
      },
      {
        sw: 'Ninaamini kwamba elimu ni muhimu',
        en: 'I believe that education is important',
        vi: 'Tôi tin rằng giáo dục là quan trọng',
        pronunciation_focus: ['Ninaamini → ninaamini', 'kwamba → kwamba', 'elimu → elimu', 'muhimu → muhimu'],
        pronunciation_focus_en: ['Ninaamini = ninaamini', 'kwamba = kwamba', 'elimu = elimu', 'muhimu = muhimu']
      },
      {
        sw: 'Najua kwamba umefika salama',
        en: 'I know that you arrived safely',
        vi: 'Tôi tin rằng giáo dục là quan trọng',
        pronunciation_focus: ['Najua → najua', 'kwamba → kwamba', 'umefika → umefika', 'salama → salama'],
        pronunciation_focus_en: ['Najua = najua', 'kwamba = kwamba', 'umefika = umefika', 'salama = salama']
      },
      {
        sw: 'Tulipika chakula, kisha tukala pamoja',
        en: 'We cooked food, then we ate together',
        vi: 'Chúng tôi nấu đồ ăn, rồi cùng ăn với nhau',
        pronunciation_focus: ['Tulipika → tulipika', 'chakula → chakula', 'kisha → kisha', 'tukala → tukala'],
        pronunciation_focus_en: ['Tulipika = tulipika', 'chakula = chakula', 'kisha = kisha', 'tukala = tukala']
      },
      {
        sw: 'Alimaliza kazi yake, halafu akaenda nyumbani',
        en: 'She finished her work, then went home',
        vi: 'Chúng tôi nấu đồ ăn, rồi cùng ăn với nhau',
        pronunciation_focus: ['Alimaliza → alimaliza', 'kazi → kazi', 'yake → yake', 'halafu → halafu'],
        pronunciation_focus_en: ['Alimaliza = alimaliza', 'kazi = kazi', 'yake = yake', 'halafu = halafu']
      },
      {
        sw: 'Ninasoma kwa bidii ili nifaulu mtihani',
        en: 'I study hard so that I pass the exam',
        vi: 'Tôi học chăm để thi đậu',
        pronunciation_focus: ['Ninasoma → ninasoma', 'kwa → kwa', 'bidii → bidii', 'ili → ili'],
        pronunciation_focus_en: ['Ninasoma = ninasoma', 'kwa = kwa', 'bidii = bidii', 'ili = ili']
      },
    ],
    cultural_notes_vi: 'Phòng này dạy bạn xây dựng câu Swahili phức tạp với nhiều mệnh đề. Bạn sẽ học cách nối ý bằng liên từ, lồng mệnh đề phụ, và duy trì sự hòa hợp danh từ xuyên suốt câu dài. Các mục tập trung vào những mẫu cấu trúc giúp tiếng Swahili của bạn nghe tự nhiên và tinh tế ở trình độ nâng cao.',
    cultural_notes_en: 'This room teaches you to build complex Swahili sentences with multiple clauses. You will learn how to connect ideas using conjunctions, embed subordinate clauses, and maintain correct noun class agreement across long sentences. These entries focus on the structural patterns that make Swahili sound natural and sophisticated at an advanced level.',
    tip_advice_vi: 'Bài luyện hàng ngày: Lấy hai câu đơn và nối chúng bằng na, lakini, kwa sababu, hoặc ili. Ví dụ: Niliamka asubuhi + Nilikunywa chai → Niliamka asubuhi na nilikunywa chai (Tôi thức dậy buổi sáng và tôi uống trà). Rồi thêm ý thứ ba: Niliamka asubuhi, nilikunywa chai, kisha nikaanza kufanya kazi (Tôi thức dậy, uống trà, rồi bắt đầu làm việc). Xây từ ha',
    tip_advice_en: 'Daily drill: Take two simple sentences and join them with na, lakini, kwa sababu, or ili. Example: Niliamka asubuhi + Nilikunywa chai → Niliamka asubuhi na nilikunywa chai. Then add a third idea: Niliamka asubuhi, nilikunywa chai, kisha nikaanza kufanya kazi. Build from two clauses to three. This daily practice trains your mind for natural complex',
    vocabulary: [
      { word: 'compound', en: 'compound', vi: 'câu ghép', pos: 'noun', pronunciation_vi: 'COMPOUND', pronunciation_en: 'compound' },
      { word: 'conjunctions', en: 'conjunctions', vi: 'liên từ', pos: 'noun', pronunciation_vi: 'CONJUNCTIONS', pronunciation_en: 'conjunctions' },
      { word: 'subordinate', en: 'subordinate', vi: 'mệnh đề phụ', pos: 'noun', pronunciation_vi: 'SUBORDINATE', pronunciation_en: 'subordinate' },
      { word: 'kwamba', en: 'kwamba', vi: 'kwamba', pos: 'noun', pronunciation_vi: 'KWAMBA', pronunciation_en: 'kwamba' },
      { word: 'sequence', en: 'sequence', vi: 'trình tự', pos: 'noun', pronunciation_vi: 'SEQUENCE', pronunciation_en: 'sequence' },
      { word: 'then', en: 'then', vi: 'rồi thì', pos: 'noun', pronunciation_vi: 'THEN', pronunciation_en: 'then' },
      { word: 'purpose', en: 'purpose', vi: 'mục đích', pos: 'noun', pronunciation_vi: 'PURPOSE', pronunciation_en: 'purpose' },
    ],
  },
  // C1-02 — Mastering Verb Extensions in Swahili
  {
    id: 'swahili_c1_verb_extensions',
    level: 'C1',
    category: 'verb_extensions',
    title_vi: 'C1-02 — Làm Chủ Các Dạng Mở Rộng Động Từ Trong Tiếng Swahili',
    title_en: 'C1-02 — Mastering Verb Extensions in Swahili',
    intro_vi: 'Phòng này khám phá hệ thống mở rộng động từ phong phú trong tiếng Swahili — dạng ứng dụng, sai khiến, bị động, hỗ tương, và trạng thái. Bạn sẽ học cách thêm một tiếp tố duy nhất có thể biến đổi ý nghĩa, và cách kết hợp nhiều đuôi mở rộng trong cùng một động từ.',
    intro_en: 'This room explores the rich system of verb extensions in Swahili — applicative, causative, passive, reciprocal, and stative forms. You will learn how adding a single infix can transform meaning, and how to combine multiple extensions in one verb.',
    sentences: [
      {
        sw: 'Ninapika chakula',
        en: 'I cook food',
        vi: 'Tôi nấu đồ ăn',
        pronunciation_focus: ['Ninapika → ninapika', 'chakula → chakula'],
        pronunciation_focus_en: ['Ninapika = ninapika', 'chakula = chakula']
      },
      {
        sw: 'Ninapikia watoto chakula',
        en: 'I cook food for the children',
        vi: 'Tôi nấu đồ ăn',
        pronunciation_focus: ['Ninapikia → ninapikia', 'watoto → watoto', 'chakula → chakula'],
        pronunciation_focus_en: ['Ninapikia = ninapikia', 'watoto = watoto', 'chakula = chakula']
      },
      {
        sw: 'Walimu wanafundisha wanafunzi shuleni',
        en: 'Teachers teach students at school',
        vi: 'Teachers teach students at school',
        pronunciation_focus: ['Walimu → walimu', 'wanafundisha → wanafundisha', 'wanafunzi → wanafunzi', 'shuleni → shuleni'],
        pronunciation_focus_en: ['Walimu = walimu', 'wanafundisha = wanafundisha', 'wanafunzi = wanafunzi', 'shuleni = shuleni']
      },
      {
        sw: 'Mwalimu anafundisha somo',
        en: 'The teacher teaches the lesson',
        vi: 'Bài học được dạy bởi thầy giáo',
        pronunciation_focus: ['Mwalimu → mwalimu', 'anafundisha → anafundisha', 'somo → somo'],
        pronunciation_focus_en: ['Mwalimu = mwalimu', 'anafundisha = anafundisha', 'somo = somo']
      },
      {
        sw: 'Somo linafundishwa na mwalimu',
        en: 'The lesson is taught by the teacher',
        vi: 'Bài học được dạy bởi thầy giáo',
        pronunciation_focus: ['Somo → somo', 'linafundishwa → linafundishwa', 'mwalimu → mwalimu'],
        pronunciation_focus_en: ['Somo = somo', 'linafundishwa = linafundishwa', 'mwalimu = mwalimu']
      },
      {
        sw: 'Wanajenga nyumba',
        en: 'They are building the house',
        vi: 'Bài học được dạy bởi thầy giáo',
        pronunciation_focus: ['Wanajenga → wanajenga', 'nyumba → nyumba'],
        pronunciation_focus_en: ['Wanajenga = wanajenga', 'nyumba = nyumba']
      },
      {
        sw: 'Nyumba inajengwa',
        en: 'The house is being built',
        vi: 'Bài học được dạy bởi thầy giáo',
        pronunciation_focus: ['Nyumba → nyumba', 'inajengwa → inajengwa'],
        pronunciation_focus_en: ['Nyumba = nyumba', 'inajengwa = inajengwa']
      },
    ],
    cultural_notes_vi: 'Phòng này khám phá hệ thống mở rộng động từ phong phú trong tiếng Swahili — dạng ứng dụng, sai khiến, bị động, hỗ tương, và trạng thái. Bạn sẽ học cách thêm một tiếp tố duy nhất có thể biến đổi ý nghĩa, và cách kết hợp nhiều đuôi mở rộng trong cùng một động từ. Làm chủ những mẫu này là điều cần thiết để nói tiếng Swahili nâng cao tự nhiên.',
    cultural_notes_en: 'This room explores the rich system of verb extensions in Swahili — applicative, causative, passive, reciprocal, and stative forms. You will learn how adding a single infix can transform meaning, and how to combine multiple extensions in one verb. Mastering these patterns is essential for advanced, natural Swahili.',
    tip_advice_vi: 'Bài luyện hàng ngày: Lấy một động từ gốc và áp dụng từng đuôi mở rộng theo thứ tự. Gốc: -som- (đọc/học). 1. Nasoma — Tôi đọc. 2. Ninasomea — Tôi đọc cho ai. 3. Ninasomesha — Tôi dạy (khiến đọc). 4. Ninasomwa — Tôi được đọc cho. 5. Tunasomana — Chúng tôi đọc cho nhau. 6. Ninasomeshewa — Tôi bị bắt đọc cho ai. Hãy luyện chuỗi này với các gốc từ khác',
    tip_advice_en: 'Daily drill: Take one root verb and apply each extension in sequence. Root: -som- (read/study). 1. Nasoma — I read. 2. Ninasomea — I read for someone. 3. Ninasomesha — I teach (cause to read). 4. Ninasomwa — I am read to. 5. Tunasomana — We read to each other. 6. Ninasomeshewa — I am made to read for someone. Practice this chain with different root',
    vocabulary: [
      { word: 'applicative', en: 'applicative', vi: 'ứng dụng', pos: 'noun', pronunciation_vi: 'APPLICATIVE', pronunciation_en: 'applicative' },
      { word: 'benefactive', en: 'benefactive', vi: 'có lợi', pos: 'noun', pronunciation_vi: 'BENEFACTIVE', pronunciation_en: 'benefactive' },
      { word: 'causative', en: 'causative', vi: 'sai khiến', pos: 'noun', pronunciation_vi: 'CAUSATIVE', pronunciation_en: 'causative' },
      { word: 'make', en: 'make', vi: 'làm cho', pos: 'noun', pronunciation_vi: 'MAKE', pronunciation_en: 'make' },
      { word: 'passive', en: 'passive', vi: 'bị động', pos: 'noun', pronunciation_vi: 'PASSIVE', pronunciation_en: 'passive' },
      { word: 'voice', en: 'voice', vi: 'thể', pos: 'noun', pronunciation_vi: 'VOICE', pronunciation_en: 'voice' },
      { word: 'reciprocal', en: 'reciprocal', vi: 'hỗ tương', pos: 'noun', pronunciation_vi: 'RECIPROCAL', pronunciation_en: 'reciprocal' },
    ],
  },
  // C1-03 — Relative Clauses in Depth
  {
    id: 'swahili_c1_relative_clauses',
    level: 'C1',
    category: 'relative_clauses',
    title_vi: 'C1-03 — Mệnh Đề Quan Hệ Chuyên Sâu',
    title_en: 'C1-03 — Relative Clauses in Depth',
    intro_vi: 'Phòng này dạy bạn hai cách chính để tạo mệnh đề quan hệ trong tiếng Swahili — phương pháp amba- và phương pháp tiếp tố. Bạn sẽ học khi nào dùng mỗi cách, cách khớp dấu hiệu quan hệ với đúng lớp danh từ, và cách lồng mệnh đề quan hệ một cách tự nhiên trong lời nói hàng ngày.',
    intro_en: 'This room teaches you the two main ways to form relative clauses in Swahili — the amba- method and the infix method. You will learn when to use each, how to match the relative marker to the correct noun class, and how to embed relative clauses naturally in everyday speech.',
    sentences: [
      {
        sw: 'Mtu ambaye anaimba ni dada yangu',
        en: 'The person who is singing is my sister',
        vi: 'Người đang hát là chị tôi',
        pronunciation_focus: ['Mtu → mtu', 'ambaye → ambaye', 'anaimba → anaimba', 'dada → dada'],
        pronunciation_focus_en: ['Mtu = mtu', 'ambaye = ambaye', 'anaimba = anaimba', 'dada = dada']
      },
      {
        sw: 'Vitabu ambavyo viko mezani ni vyangu',
        en: 'The books which are on the table are mine',
        vi: 'Người đang hát là chị tôi',
        pronunciation_focus: ['Vitabu → vitabu', 'ambavyo → ambavyo', 'viko → viko', 'mezani → mezani'],
        pronunciation_focus_en: ['Vitabu = vitabu', 'ambavyo = ambavyo', 'viko = viko', 'mezani = mezani']
      },
      {
        sw: 'Mtoto anayecheza ni wangu',
        en: 'The child who is playing is mine (instead of Mtoto ambaye anacheza…)',
        vi: 'Món tôi thích là cơm (thay vì Chakula ambacho ninakipenda',
        pronunciation_focus: ['Mtoto → mtoto', 'anayecheza → anayecheza', 'wangu → wangu'],
        pronunciation_focus_en: ['Mtoto = mtoto', 'anayecheza = anayecheza', 'wangu = wangu']
      },
      {
        sw: 'Chakula ninachokipenda ni wali',
        en: 'The food that I like is rice (instead of Chakula ambacho ninakipenda…)',
        vi: 'Món tôi thích là cơm (thay vì Chakula ambacho ninakipenda',
        pronunciation_focus: ['Chakula → chakula', 'ninachokipenda → ninachokipenda', 'wali → wali'],
        pronunciation_focus_en: ['Chakula = chakula', 'ninachokipenda = ninachokipenda', 'wali = wali']
      },
    ],
    cultural_notes_vi: 'Phòng này dạy bạn hai cách chính để tạo mệnh đề quan hệ trong tiếng Swahili — phương pháp amba- và phương pháp tiếp tố. Bạn sẽ học khi nào dùng mỗi cách, cách khớp dấu hiệu quan hệ với đúng lớp danh từ, và cách lồng mệnh đề quan hệ một cách tự nhiên trong lời nói hàng ngày.',
    cultural_notes_en: 'This room teaches you the two main ways to form relative clauses in Swahili — the amba- method and the infix method. You will learn when to use each, how to match the relative marker to the correct noun class, and how to embed relative clauses naturally in everyday speech.',
    tip_advice_vi: 'Bài luyện hàng ngày: Chọn một danh từ và tạo ba câu quan hệ — một với amba-, một với tiếp tố, một lồng ghép. Ví dụ: daktari (bác sĩ). 1. Daktari ambaye alinitibu ni mzuri sana — Bác sĩ đã chữa cho tôi rất giỏi. 2. Daktari aliyenitibu ni mzuri sana. 3. Daktari ninayemjua ambaye alinitibu jana ni mzuri sana. Làm vậy với 3 danh từ khác nhau mỗi ngày q',
    tip_advice_en: 'Daily drill: Pick a noun and make three relative sentences — one with amba-, one with infix, one embedded. Example: daktari (doctor). 1. Daktari ambaye alinitibu ni mzuri sana. 2. Daktari aliyenitibu ni mzuri sana. 3. Daktari ninayemjua ambaye alinitibu jana ni mzuri sana. Do this with 3 different nouns daily across different noun classes. Your rel',
    vocabulary: [
      { word: 'amba', en: 'amba', vi: 'amba', pos: 'noun', pronunciation_vi: 'AMBA', pronunciation_en: 'amba' },
      { word: 'relative', en: 'relative', vi: 'quan hệ', pos: 'noun', pronunciation_vi: 'RELATIVE', pronunciation_en: 'relative' },
      { word: 'infix', en: 'infix', vi: 'tiếp tố', pos: 'noun', pronunciation_vi: 'INFIX', pronunciation_en: 'infix' },
      { word: 'compact', en: 'compact', vi: 'gọn', pos: 'noun', pronunciation_vi: 'COMPACT', pronunciation_en: 'compact' },
      { word: 'agreement', en: 'agreement', vi: 'hòa hợp', pos: 'noun', pronunciation_vi: 'AGREEMENT', pronunciation_en: 'agreement' },
      { word: 'noun class', en: 'noun class', vi: 'lớp danh từ', pos: 'noun', pronunciation_vi: 'NOUN CLASS', pronunciation_en: 'noun class' },
      { word: 'choice', en: 'choice', vi: 'lựa chọn', pos: 'noun', pronunciation_vi: 'CHOICE', pronunciation_en: 'choice' },
    ],
  },
  // C1-04 — Swahili Proverbs and Wisdom Sayings
  {
    id: 'swahili_c1_idioms_proverbs',
    level: 'C1',
    category: 'idioms_proverbs',
    title_vi: 'C1-04 — Tục Ngữ và Thành Ngữ Swahili',
    title_en: 'C1-04 — Swahili Proverbs and Wisdom Sayings',
    intro_vi: 'Phòng này giới thiệu bạn với thế giới phong phú của tục ngữ Swahili (methali) và thành ngữ. Tục ngữ là trung tâm của văn hóa Swahili và được dùng hàng ngày trong hội thoại, diễn thuyết, và văn viết.',
    intro_en: 'This room introduces you to the rich world of Swahili proverbs (methali) and idiomatic expressions. Proverbs are central to Swahili culture and are used daily in conversations, speeches, and writing.',
    sentences: [
      {
        sw: 'Haraka haraka haina baraka',
        en: 'Hurry hurry has no blessing (haste makes waste)',
        vi: 'Kiên nhẫn kéo phước về',
        pronunciation_focus: ['Haraka → haraka', 'haraka → haraka', 'haina → haina', 'baraka → baraka'],
        pronunciation_focus_en: ['Haraka = haraka', 'haraka = haraka', 'haina = haina', 'baraka = baraka']
      },
      {
        sw: 'Polepole ndiyo mwendo',
        en: 'Slowly is indeed the way (slow and steady wins)',
        vi: 'Kiên nhẫn kéo phước về',
        pronunciation_focus: ['Polepole → polepole', 'ndiyo → ndiyo', 'mwendo → mwendo'],
        pronunciation_focus_en: ['Polepole = polepole', 'ndiyo = ndiyo', 'mwendo = mwendo']
      },
      {
        sw: 'Subira huvuta heri',
        en: 'Patience brings blessings',
        vi: 'Kiên nhẫn kéo phước về',
        pronunciation_focus: ['Subira → subira', 'huvuta → huvuta', 'heri → heri'],
        pronunciation_focus_en: ['Subira = subira', 'huvuta = huvuta', 'heri = heri']
      },
      {
        sw: 'Mvumilivu hula mbivu',
        en: 'The patient one eats ripe fruit',
        vi: 'Kiên nhẫn kéo phước về',
        pronunciation_focus: ['Mvumilivu → mvumilivu', 'hula → hula', 'mbivu → mbivu'],
        pronunciation_focus_en: ['Mvumilivu = mvumilivu', 'hula = hula', 'mbivu = mbivu']
      },
      {
        sw: 'Kidole kimoja hakivunji chawa',
        en: 'One finger does not crush a louse (you need others)',
        vi: 'Đoàn kết là sức mạnh, chia rẽ là yếu đuối',
        pronunciation_focus: ['Kidole → kidole', 'kimoja → kimoja', 'hakivunji → hakivunji', 'chawa → chawa'],
        pronunciation_focus_en: ['Kidole = kidole', 'kimoja = kimoja', 'hakivunji = hakivunji', 'chawa = chawa']
      },
      {
        sw: 'Asiye na mengi ana machache',
        en: 'One who has no many words has few (listen more, speak less)',
        vi: 'Người không nói nhiều có được ít lời (nghe nhiều, nói ít)',
        pronunciation_focus: ['Asiye → asiye', 'mengi → mengi', 'ana → ana', 'machache → machache'],
        pronunciation_focus_en: ['Asiye = asiye', 'mengi = mengi', 'ana = ana', 'machache = machache']
      },
      {
        sw: 'Maneno matamu humtoa nyoka pangoni',
        en: 'Sweet words draw the snake out of its hole',
        vi: 'Người không nói nhiều có được ít lời (nghe nhiều, nói ít)',
        pronunciation_focus: ['Maneno → maneno', 'matamu → matamu', 'humtoa → humtoa', 'nyoka → nyoka'],
        pronunciation_focus_en: ['Maneno = maneno', 'matamu = matamu', 'humtoa = humtoa', 'nyoka = nyoka']
      },
    ],
    cultural_notes_vi: 'Phòng này giới thiệu bạn với thế giới phong phú của tục ngữ Swahili (methali) và thành ngữ. Tục ngữ là trung tâm của văn hóa Swahili và được dùng hàng ngày trong hội thoại, diễn thuyết, và văn viết. Học chúng sẽ làm sâu sắc thêm hiểu biết văn hóa của bạn và khiến tiếng Swahili của bạn nghe khôn ngoan, tự nhiên, và gắn kết sâu sắc với truyền thống Đông Phi.',
    cultural_notes_en: 'This room introduces you to the rich world of Swahili proverbs (methali) and idiomatic expressions. Proverbs are central to Swahili culture and are used daily in conversations, speeches, and writing. Learning them will deepen your cultural understanding and make your Swahili sound wise, natural, and deeply connected to East African tradition.',
    tip_advice_vi: 'Luyện tập hàng ngày: Học một câu tục ngữ mỗi ngày. Đọc to lên. Viết một tình huống ngắn mà bạn sẽ dùng câu đó. Rồi nói cả cụm: tục ngữ + liên kết. Ví dụ (thứ Hai): Haraka haraka haina baraka. → \'Nilikuwa na haraka ya kumaliza kazi, lakini nilifanya makosa. Kweli, haraka haraka haina baraka.\' (Tôi đã vội hoàn thành công việc, nhưng tôi đã mắc lỗi. Q',
    tip_advice_en: 'Daily practice: Learn one proverb per day. Speak it aloud. Write a short situation where you would use it. Then say the whole thing: proverb + connection. Example (Monday): Haraka haraka haina baraka. → \'Nilikuwa na haraka ya kumaliza kazi, lakini nilifanya makosa. Kweli, haraka haraka haina baraka.\' In one month, you will carry 30 proverbs into re',
    vocabulary: [
      { word: 'patience', en: 'patience', vi: 'kiên nhẫn', pos: 'noun', pronunciation_vi: 'PATIENCE', pronunciation_en: 'patience' },
      { word: 'perseverance', en: 'perseverance', vi: 'bền bỉ', pos: 'noun', pronunciation_vi: 'PERSEVERANCE', pronunciation_en: 'perseverance' },
      { word: 'unity', en: 'unity', vi: 'đoàn kết', pos: 'noun', pronunciation_vi: 'UNITY', pronunciation_en: 'unity' },
      { word: 'community', en: 'community', vi: 'cộng đồng', pos: 'noun', pronunciation_vi: 'COMMUNITY', pronunciation_en: 'community' },
      { word: 'wisdom', en: 'wisdom', vi: 'khôn ngoan', pos: 'noun', pronunciation_vi: 'WISDOM', pronunciation_en: 'wisdom' },
      { word: 'caution', en: 'caution', vi: 'thận trọng', pos: 'noun', pronunciation_vi: 'CAUTION', pronunciation_en: 'caution' },
      { word: 'conversation', en: 'conversation', vi: 'hội thoại', pos: 'noun', pronunciation_vi: 'CONVERSATION', pronunciation_en: 'conversation' },
    ],
  },
  // C1-05 — Formal and Informal Swahili Register
  {
    id: 'swahili_c1_register',
    level: 'C1',
    category: 'register',
    title_vi: 'C1-05 — Phong Cách Trang Trọng và Thân Mật Trong Tiếng Swahili',
    title_en: 'C1-05 — Formal and Informal Swahili Register',
    intro_vi: 'Phòng này dạy bạn chuyển đổi giữa phong cách trang trọng và thân mật trong tiếng Swahili. Bạn sẽ học khi nào dùng dạng kính trọng, cách xưng hô với người lớn tuổi và quan chức, và cách điều chỉnh giọng điệu cho các bối cảnh xã hội khác nhau.',
    intro_en: 'This room teaches you to navigate between formal and informal Swahili registers. You will learn when to use respectful forms, how to address elders and officials, and how to shift your tone for different social settings. Register control is a key marker of advanced proficiency.',
    sentences: [
      {
        sw: 'Marahaba, mwanangu',
        en: 'I greet you with respect, elder',
        vi: 'I greet you with respect, elder',
        pronunciation_focus: ['Marahaba → marahaba', 'mwanangu → mwanangu'],
        pronunciation_focus_en: ['Marahaba = marahaba', 'mwanangu = mwanangu']
      },
      {
        sw: 'Mheshimiwa Waziri, asante kwa wito wako',
        en: 'Honorable Minister, thank you for your invitation',
        vi: 'Kính thưa, dành cho quan chức)',
        pronunciation_focus: ['Mheshimiwa → mheshimiwa', 'Waziri → waziri', 'asante → asante', 'kwa → kwa'],
        pronunciation_focus_en: ['Mheshimiwa = mheshimiwa', 'Waziri = waziri', 'asante = asante', 'kwa = kwa']
      },
      {
        sw: 'Ombi limepokelewa',
        en: 'The request has been received',
        vi: 'Đơn đã được tiếp nhận',
        pronunciation_focus: ['Ombi → ombi', 'limepokelewa → limepokelewa'],
        pronunciation_focus_en: ['Ombi = ombi', 'limepokelewa = limepokelewa']
      },
    ],
    cultural_notes_vi: 'Phòng này dạy bạn chuyển đổi giữa phong cách trang trọng và thân mật trong tiếng Swahili. Bạn sẽ học khi nào dùng dạng kính trọng, cách xưng hô với người lớn tuổi và quan chức, và cách điều chỉnh giọng điệu cho các bối cảnh xã hội khác nhau. Kiểm soát phong cách là dấu hiệu quan trọng của trình độ nâng cao.',
    cultural_notes_en: 'This room teaches you to navigate between formal and informal Swahili registers. You will learn when to use respectful forms, how to address elders and officials, and how to shift your tone for different social settings. Register control is a key marker of advanced proficiency.',
    tip_advice_vi: 'Bài luyện hàng ngày: Diễn đạt cùng một nội dung bằng ba phong cách. Nội dung: \'Tôi cần bạn giúp.\' (1) Trang trọng với người lớn: Shikamoo mzee. Naomba msaada wako tafadhali. (2) Trang trọng với người ngang hàng: Ndugu, ningehitaji msaada wako. (3) Thân mật với bạn: Bro, naomba mkono tafadhali. Hãy luyện mẫu ba phong cách này với 5 nội dung phổ biến',
    tip_advice_en: 'Daily drill: Express the same message in three registers. Message: \'I need your help.\' (1) Formal to elder: Shikamoo mzee. Naomba msaada wako tafadhali. (2) Formal to equal: Ndugu, ningehitaji msaada wako. (3) Informal to friend: Bro, naomba mkono tafadhali. Practice this three-register pattern with 5 common messages daily. Register flexibility mak',
    vocabulary: [
      { word: 'respect', en: 'respect', vi: 'kính trọng', pos: 'noun', pronunciation_vi: 'RESPECT', pronunciation_en: 'respect' },
      { word: 'greetings', en: 'greetings', vi: 'chào hỏi', pos: 'noun', pronunciation_vi: 'GREETINGS', pronunciation_en: 'greetings' },
      { word: 'formal', en: 'formal', vi: 'trang trọng', pos: 'noun', pronunciation_vi: 'FORMAL', pronunciation_en: 'formal' },
      { word: 'titles', en: 'titles', vi: 'danh xưng', pos: 'noun', pronunciation_vi: 'TITLES', pronunciation_en: 'titles' },
      { word: 'informal', en: 'informal', vi: 'thân mật', pos: 'noun', pronunciation_vi: 'INFORMAL', pronunciation_en: 'informal' },
      { word: 'peers', en: 'peers', vi: 'bạn bè', pos: 'noun', pronunciation_vi: 'PEERS', pronunciation_en: 'peers' },
      { word: 'shifting', en: 'shifting', vi: 'chuyển đổi', pos: 'noun', pronunciation_vi: 'SHIFTING', pronunciation_en: 'shifting' },
    ],
  },
  // C1-06 — Advanced Noun Class Agreement
  {
    id: 'swahili_c1_noun_classes',
    level: 'C1',
    category: 'noun_classes',
    title_vi: 'C1-06 — Hòa Hợp Lớp Danh Từ Nâng Cao',
    title_en: 'C1-06 — Advanced Noun Class Agreement',
    intro_vi: 'Phòng này nâng cao khả năng làm chủ hòa hợp lớp danh từ tiếng Swahili trên mọi thành phần câu. Bạn sẽ luyện hòa hợp với tính từ, sở hữu, chỉ định từ, và động từ trong câu phức. Hòa hợp hoàn hảo là điều phân biệt người nói nâng cao với người trung cấp.',
    intro_en: 'This room deepens your command of Swahili noun class agreement across all parts of speech. You will practice agreement with adjectives, possessives, demonstratives, and verbs in complex sentences. Perfect agreement is what separates advanced speakers from intermediate ones.',
    sentences: [
      {
        sw: 'Hiki kitabu ni changu, kile ni chako',
        en: 'This book is mine, that one is yours',
        vi: 'Quyển sách này là của tôi, quyển kia là của bạn',
        pronunciation_focus: ['Hiki → hiki', 'kitabu → kitabu', 'changu → changu', 'kile → kile'],
        pronunciation_focus_en: ['Hiki = hiki', 'kitabu = kitabu', 'changu = changu', 'kile = kile']
      },
      {
        sw: 'Kitabu nilichokisoma kinazungumzia historia',
        en: 'The book that I read discusses history',
        vi: 'Quyển sách tôi đã đọc bàn về lịch sử',
        pronunciation_focus: ['Kitabu → kitabu', 'nilichokisoma → nilichokisoma', 'kinazungumzia → kinazungumzia', 'historia → historia'],
        pronunciation_focus_en: ['Kitabu = kitabu', 'nilichokisoma = nilichokisoma', 'kinazungumzia = kinazungumzia', 'historia = historia']
      },
      {
        sw: 'Watu wanaokaa hapa wanapenda muziki',
        en: 'The people who live here like music — both verbs agree with watu (class 2)',
        vi: 'Quyển sách tôi đã đọc bàn về lịch sử',
        pronunciation_focus: ['Watu → watu', 'wanaokaa → wanaokaa', 'hapa → hapa', 'wanapenda → wanapenda'],
        pronunciation_focus_en: ['Watu = watu', 'wanaokaa = wanaokaa', 'hapa = hapa', 'wanapenda = wanapenda']
      },
      {
        sw: 'Nilimwona jana',
        en: 'I saw him yesterday',
        vi: 'Tôi đọc một quyển sách (chung chung) vs',
        pronunciation_focus: ['Nilimwona → nilimwona', 'jana → jana'],
        pronunciation_focus_en: ['Nilimwona = nilimwona', 'jana = jana']
      },
      {
        sw: 'Nilisoma kitabu',
        en: 'I read a book (general) vs',
        vi: 'Tôi đọc một quyển sách (chung chung) vs',
        pronunciation_focus: ['Nilisoma → nilisoma', 'kitabu → kitabu'],
        pronunciation_focus_en: ['Nilisoma = nilisoma', 'kitabu = kitabu']
      },
      {
        sw: 'Nilikisoma kitabu',
        en: 'I read the book (specific, with object infix -ki- for class 7)',
        vi: 'Tôi đọc một quyển sách (chung chung) vs',
        pronunciation_focus: ['Nilikisoma → nilikisoma', 'kitabu → kitabu'],
        pronunciation_focus_en: ['Nilikisoma = nilikisoma', 'kitabu = kitabu']
      },
      {
        sw: 'Tutaionunua nyumba',
        en: 'We will buy the house',
        vi: 'Tôi đọc một quyển sách (chung chung) vs',
        pronunciation_focus: ['Tutaionunua → tutaionunua', 'nyumba → nyumba'],
        pronunciation_focus_en: ['Tutaionunua = tutaionunua', 'nyumba = nyumba']
      },
    ],
    cultural_notes_vi: 'Phòng này nâng cao khả năng làm chủ hòa hợp lớp danh từ tiếng Swahili trên mọi thành phần câu. Bạn sẽ luyện hòa hợp với tính từ, sở hữu, chỉ định từ, và động từ trong câu phức. Hòa hợp hoàn hảo là điều phân biệt người nói nâng cao với người trung cấp.',
    cultural_notes_en: 'This room deepens your command of Swahili noun class agreement across all parts of speech. You will practice agreement with adjectives, possessives, demonstratives, and verbs in complex sentences. Perfect agreement is what separates advanced speakers from intermediate ones.',
    tip_advice_vi: 'Bài luyện hàng ngày: Xây chuỗi hòa hợp. Bắt đầu với danh từ + tính từ, thêm sở hữu, rồi chỉ định từ, rồi động từ. Ví dụ: gari (lớp 5) → gari kubwa langu hili linaenda — chiếc xe lớn này của tôi đang chạy. kitabu (lớp 7) → kitabu kizuri changu hiki kinazungumzia historia — quyển sách hay này của tôi bàn về lịch sử. Xây một chuỗi cho mỗi lớp danh từ',
    tip_advice_en: 'Daily drill: Build an agreement chain. Start with a noun + adjective, add possessive, then demonstrative, then verb. Example: gari (class 5) → gari kubwa langu hili linaenda / this big car of mine is going. kitabu (class 7) → kitabu kizuri changu hiki kinazungumzia historia / this good book of mine discusses history. Build one chain for each noun c',
    vocabulary: [
      { word: 'adjective', en: 'adjective', vi: 'tính từ', pos: 'noun', pronunciation_vi: 'ADJECTIVE', pronunciation_en: 'adjective' },
      { word: 'agreement', en: 'agreement', vi: 'hòa hợp', pos: 'noun', pronunciation_vi: 'AGREEMENT', pronunciation_en: 'agreement' },
      { word: 'possessive', en: 'possessive', vi: 'sở hữu', pos: 'noun', pronunciation_vi: 'POSSESSIVE', pronunciation_en: 'possessive' },
      { word: 'demonstrative', en: 'demonstrative', vi: 'chỉ định', pos: 'noun', pronunciation_vi: 'DEMONSTRATIVE', pronunciation_en: 'demonstrative' },
      { word: 'this that', en: 'this that', vi: 'này kia', pos: 'noun', pronunciation_vi: 'THIS THAT', pronunciation_en: 'this that' },
      { word: 'subject', en: 'subject', vi: 'chủ ngữ', pos: 'noun', pronunciation_vi: 'SUBJECT', pronunciation_en: 'subject' },
      { word: 'verb agreement', en: 'verb agreement', vi: 'hòa hợp động từ', pos: 'noun', pronunciation_vi: 'VERB AGREEMENT', pronunciation_en: 'verb agreement' },
    ],
  },
  // C1-07 — Narrative and Storytelling in Swahili
  {
    id: 'swahili_c1_narrative',
    level: 'C1',
    category: 'narrative',
    title_vi: 'C1-07 — Kể Chuyện và Tường Thuật Trong Tiếng Swahili',
    title_en: 'C1-07 — Narrative and Storytelling in Swahili',
    intro_vi: 'Phòng này dạy bạn nghệ thuật kể chuyện trong tiếng Swahili. Bạn sẽ học các thì kể chuyện, dấu hiệu liên tiếp -ka-, cụm từ đặt bối cảnh thời gian, và ngôn ngữ sống động làm câu chuyện trở nên sinh động.',
    intro_en: 'This room teaches you the art of storytelling in Swahili. You will learn narrative tenses, the -ka- consecutive marker, time-setting phrases, and the vivid language that brings stories to life.',
    sentences: [
      {
        sw: 'Jua lilikuwa linachomoza',
        en: 'The sun was rising',
        vi: 'Ngày xửa ngày xưa, có',
        pronunciation_focus: ['Jua → jua', 'lilikuwa → lilikuwa', 'linachomoza → linachomoza'],
        pronunciation_focus_en: ['Jua = jua', 'lilikuwa = lilikuwa', 'linachomoza = linachomoza']
      },
      {
        sw: 'Upepo ulivuma polepole',
        en: 'The wind blew gently',
        vi: 'Ngày xửa ngày xưa, có',
        pronunciation_focus: ['Upepo → upepo', 'ulivuma → ulivuma', 'polepole → polepole'],
        pronunciation_focus_en: ['Upepo = upepo', 'ulivuma = ulivuma', 'polepole = polepole']
      },
      {
        sw: 'Aliamka, akaoga, akavaa nguo, akakunywa chai, kisha akaenda shambani',
        en: 'He woke up, bathed, dressed, drank tea, then went to the farm',
        vi: 'Anh ấy thức dậy, tắm rửa, mặc quần áo, uống trà, rồi ra đồng',
        pronunciation_focus: ['Aliamka → aliamka', 'akaoga → akaoga', 'akavaa → akavaa', 'nguo → nguo'],
        pronunciation_focus_en: ['Aliamka = aliamka', 'akaoga = akaoga', 'akavaa = akavaa', 'nguo = nguo']
      },
      {
        sw: 'Ghafla, akasikia sauti kubwa',
        en: 'Suddenly, he heard a loud sound',
        vi: 'Suddenly, he heard a loud sound',
        pronunciation_focus: ['Ghafla → ghafla', 'akasikia → akasikia', 'sauti → sauti', 'kubwa → kubwa'],
        pronunciation_focus_en: ['Ghafla = ghafla', 'akasikia = akasikia', 'sauti = sauti', 'kubwa = kubwa']
      },
      {
        sw: 'Hatimaye, walifika salama nyumbani',
        en: 'Finally, they arrived safely home',
        vi: 'Finally, they arrived safely home',
        pronunciation_focus: ['Hatimaye → hatimaye', 'walifika → walifika', 'salama → salama', 'nyumbani → nyumbani'],
        pronunciation_focus_en: ['Hatimaye = hatimaye', 'walifika = walifika', 'salama = salama', 'nyumbani = nyumbani']
      },
      {
        sw: 'Jana, niliamka asubuhi',
        en: 'Yesterday, I woke up in the morning',
        vi: 'Hôm qua, tôi thức dậy buổi sáng',
        pronunciation_focus: ['Jana → jana', 'niliamka → niliamka', 'asubuhi → asubuhi'],
        pronunciation_focus_en: ['Jana = jana', 'niliamka = niliamka', 'asubuhi = asubuhi']
      },
      {
        sw: 'Nikaoga, nikavaa, nikala kiamsha kinywa',
        en: 'I bathed, dressed, ate breakfast',
        vi: 'Hôm qua, tôi thức dậy buổi sáng',
        pronunciation_focus: ['Nikaoga → nikaoga', 'nikavaa → nikavaa', 'nikala → nikala', 'kiamsha → kiamsha'],
        pronunciation_focus_en: ['Nikaoga = nikaoga', 'nikavaa = nikavaa', 'nikala = nikala', 'kiamsha = kiamsha']
      },
    ],
    cultural_notes_vi: 'Phòng này dạy bạn nghệ thuật kể chuyện trong tiếng Swahili. Bạn sẽ học các thì kể chuyện, dấu hiệu liên tiếp -ka-, cụm từ đặt bối cảnh thời gian, và ngôn ngữ sống động làm câu chuyện trở nên sinh động. Văn hóa Swahili rất coi trọng truyền miệng, và người kể chuyện hay được kính trọng trong mọi cộng đồng.',
    cultural_notes_en: 'This room teaches you the art of storytelling in Swahili. You will learn narrative tenses, the -ka- consecutive marker, time-setting phrases, and the vivid language that brings stories to life. Swahili culture is deeply oral, and good storytellers are respected in every community.',
    tip_advice_vi: 'Bài luyện hàng ngày: Kể to một câu chuyện ngắn bằng Swahili. Cấu trúc: (1) Thời gian và bối cảnh với -li-. (2) 4-6 hành động liên tiếp với -ka-. (3) Một đoạn đối thoại. (4) Một khoảnh khắc ghafla. (5) Kết thúc hatimaye. Dàn ý ví dụ: Jana, niliamka asubuhi — Hôm qua, tôi thức dậy buổi sáng. Nikaoga, nikavaa, nikala kiamsha kinywa — Tôi tắm, mặc đồ,',
    tip_advice_en: 'Daily drill: Tell one short story aloud in Swahili. Structure: (1) Time and setting with -li-. (2) 4-6 consecutive actions with -ka-. (3) One piece of dialogue. (4) One ghafla moment. (5) Hatimaye resolution. Example story outline: Jana, niliamka asubuhi / Yesterday, I woke up in the morning. Nikaoga, nikavaa, nikala kiamsha kinywa / I bathed, dres',
    vocabulary: [
      { word: 'narrative', en: 'narrative', vi: 'kể chuyện', pos: 'noun', pronunciation_vi: 'NARRATIVE', pronunciation_en: 'narrative' },
      { word: 'past tense', en: 'past tense', vi: 'quá khứ', pos: 'noun', pronunciation_vi: 'PAST TENSE', pronunciation_en: 'past tense' },
      { word: 'ka tense', en: 'ka tense', vi: 'thì ka', pos: 'noun', pronunciation_vi: 'KA TENSE', pronunciation_en: 'ka tense' },
      { word: 'consecutive', en: 'consecutive', vi: 'liên tiếp', pos: 'noun', pronunciation_vi: 'CONSECUTIVE', pronunciation_en: 'consecutive' },
      { word: 'dialogue', en: 'dialogue', vi: 'đối thoại', pos: 'noun', pronunciation_vi: 'DIALOGUE', pronunciation_en: 'dialogue' },
      { word: 'direct speech', en: 'direct speech', vi: 'lời nói trực tiếp', pos: 'noun', pronunciation_vi: 'DIRECT SPEECH', pronunciation_en: 'direct speech' },
      { word: 'climax', en: 'climax', vi: 'cao trào', pos: 'noun', pronunciation_vi: 'CLIMAX', pronunciation_en: 'climax' },
    ],
  },
  // C1-08 — Expressing Abstract Concepts in Swahili
  {
    id: 'swahili_c1_academic',
    level: 'C1',
    category: 'academic',
    title_vi: 'C1-08 — Diễn Đạt Khái Niệm Trừu Tượng Trong Tiếng Swahili',
    title_en: 'C1-08 — Expressing Abstract Concepts in Swahili',
    intro_vi: 'Phòng này giúp bạn diễn đạt ý tưởng trừu tượng trong tiếng Swahili — các khái niệm như công lý, tự do, bản sắc, thay đổi, và đạo đức. Từ vựng trừu tượng trong Swahili rút ra nhiều từ lớp danh từ 14 (danh từ trừu tượng u-) và từ mượn Ả Rập.',
    intro_en: 'This room helps you express abstract ideas in Swahili — concepts like justice, freedom, identity, change, and morality. Abstract vocabulary in Swahili draws heavily from noun class 14 (u- abstract nouns) and Arabic loanwords.',
    sentences: [
      {
        sw: 'Jamii yetu inabadilika haraka',
        en: 'Our society is changing fast',
        vi: 'Chúng ta cần thay đổi hệ thống giáo dục',
        pronunciation_focus: ['Jamii → jamii', 'yetu → yetu', 'inabadilika → inabadilika', 'haraka → haraka'],
        pronunciation_focus_en: ['Jamii = jamii', 'yetu = yetu', 'inabadilika = inabadilika', 'haraka = haraka']
      },
      {
        sw: 'Tunahitaji kubadilisha mfumo wetu wa elimu',
        en: 'We need to change our education system',
        vi: 'Chúng ta cần thay đổi hệ thống giáo dục',
        pronunciation_focus: ['Tunahitaji → tunahitaji', 'kubadilisha → kubadilisha', 'mfumo → mfumo', 'wetu → wetu'],
        pronunciation_focus_en: ['Tunahitaji = tunahitaji', 'kubadilisha = kubadilisha', 'mfumo = mfumo', 'wetu = wetu']
      },
      {
        sw: 'Kila mtu ana haki ya kuishi',
        en: 'Every person has the right to live',
        vi: 'Chúng ta nên tuân theo đạo đức tốt',
        pronunciation_focus: ['Kila → kila', 'mtu → mtu', 'ana → ana', 'haki → haki'],
        pronunciation_focus_en: ['Kila = kila', 'mtu = mtu', 'ana = ana', 'haki = haki']
      },
      {
        sw: 'Tunapaswa kufuata maadili mema',
        en: 'We should follow good morals',
        vi: 'Chúng ta nên tuân theo đạo đức tốt',
        pronunciation_focus: ['Tunapaswa → tunapaswa', 'kufuata → kufuata', 'maadili → maadili', 'mema → mema'],
        pronunciation_focus_en: ['Tunapaswa = tunapaswa', 'kufuata = kufuata', 'maadili = maadili', 'mema = mema']
      },
      {
        sw: 'Mtu akifa, huwa ameacha urithi',
        en: 'When a person dies, they leave an inheritance (general truth pattern with hu-)',
        vi: 'Khi một người chết, người ấy để lại di sản (mẫu chân lý chung với hu-)',
        pronunciation_focus: ['Mtu → mtu', 'akifa → akifa', 'huwa → huwa', 'ameacha → ameacha'],
        pronunciation_focus_en: ['Mtu = mtu', 'akifa = akifa', 'huwa = huwa', 'ameacha = ameacha']
      },
      {
        sw: 'Kama tungejua kesho, tusingefanya makosa',
        en: 'If we knew tomorrow, we would not make mistakes',
        vi: 'Khi một người chết, người ấy để lại di sản (mẫu chân lý chung với hu-)',
        pronunciation_focus: ['Kama → kama', 'tungejua → tungejua', 'kesho → kesho', 'tusingefanya → tusingefanya'],
        pronunciation_focus_en: ['Kama = kama', 'tungejua = tungejua', 'kesho = kesho', 'tusingefanya = tusingefanya']
      },
      {
        sw: 'Uhuru ni hali ya mtu kuwa huru',
        en: 'Freedom is the state of being free',
        vi: 'Theo tôi, tự do thực sự đi kèm với trách nhiệm',
        pronunciation_focus: ['Uhuru → uhuru', 'hali → hali', 'mtu → mtu', 'kuwa → kuwa'],
        pronunciation_focus_en: ['Uhuru = uhuru', 'hali = hali', 'mtu = mtu', 'kuwa = kuwa']
      },
    ],
    cultural_notes_vi: 'Phòng này giúp bạn diễn đạt ý tưởng trừu tượng trong tiếng Swahili — các khái niệm như công lý, tự do, bản sắc, thay đổi, và đạo đức. Từ vựng trừu tượng trong Swahili rút ra nhiều từ lớp danh từ 14 (danh từ trừu tượng u-) và từ mượn Ả Rập. Bạn sẽ học cách thảo luận triết học, đạo đức, và những ý tưởng phức tạp một cách rõ ràng.',
    cultural_notes_en: 'This room helps you express abstract ideas in Swahili — concepts like justice, freedom, identity, change, and morality. Abstract vocabulary in Swahili draws heavily from noun class 14 (u- abstract nouns) and Arabic loanwords. You will learn to discuss philosophy, ethics, and complex ideas with clarity.',
    tip_advice_vi: 'Bài luyện hàng ngày: Chọn một khái niệm trừu tượng và nói về nó trong 60 giây bằng Swahili. Cấu trúc: (1) Định nghĩa khái niệm. (2) Cho một ví dụ từ cuộc sống. (3) Bày tỏ một quan điểm cá nhân. Ví dụ cho uhuru: Uhuru ni hali ya mtu kuwa huru — Tự do là trạng thái một người được tự do. Kwa mfano, uhuru wa kusema ni muhimu katika jamii — Ví dụ, tự do',
    tip_advice_en: 'Daily drill: Pick one abstract concept and speak about it for 60 seconds in Swahili. Structure: (1) Define the concept. (2) Give one example from life. (3) Express one personal view. Example for uhuru: Uhuru ni hali ya mtu kuwa huru / Freedom is the state of being free. Kwa mfano, uhuru wa kusema ni muhimu katika jamii / For example, freedom of spe',
    vocabulary: [
      { word: 'abstract nouns', en: 'abstract nouns', vi: 'danh từ trừu tượng', pos: 'noun', pronunciation_vi: 'ABSTRACT NOUNS', pronunciation_en: 'abstract nouns' },
      { word: 'u-class', en: 'u-class', vi: 'lớp u', pos: 'noun', pronunciation_vi: 'U-CLASS', pronunciation_en: 'u-class' },
      { word: 'arabic', en: 'arabic', vi: 'Ả Rập', pos: 'noun', pronunciation_vi: 'ARABIC', pronunciation_en: 'arabic' },
      { word: 'loanwords', en: 'loanwords', vi: 'từ mượn', pos: 'noun', pronunciation_vi: 'LOANWORDS', pronunciation_en: 'loanwords' },
      { word: 'change', en: 'change', vi: 'thay đổi', pos: 'noun', pronunciation_vi: 'CHANGE', pronunciation_en: 'change' },
      { word: 'transformation', en: 'transformation', vi: 'biến đổi', pos: 'noun', pronunciation_vi: 'TRANSFORMATION', pronunciation_en: 'transformation' },
      { word: 'moral', en: 'moral', vi: 'đạo đức', pos: 'noun', pronunciation_vi: 'MORAL', pronunciation_en: 'moral' },
    ],
  },
  // C1-09 — Persuasive and Argumentative Swahili
  {
    id: 'swahili_c1_debate',
    level: 'C1',
    category: 'debate',
    title_vi: 'C1-09 — Tiếng Swahili Thuyết Phục và Tranh Luận',
    title_en: 'C1-09 — Persuasive and Argumentative Swahili',
    intro_vi: 'Phòng này trang bị cho bạn ngôn ngữ thuyết phục trong tiếng Swahili. Bạn sẽ học cách trình bày lập luận, phản bác một cách tôn trọng, dùng chiến lược tu từ, và xây dựng lập luận bằng chứng cứ. Swahili thuyết phục rất cần thiết cho tranh luận, họp hành, thuyết trình, và biện hộ.',
    intro_en: 'This room equips you with the language of persuasion in Swahili. You will learn how to present arguments, refute points respectfully, use rhetorical strategies, and build a case with evidence. Persuasive Swahili is essential for debates, meetings, presentations, and advocacy.',
    sentences: [
      {
        sw: 'Ninaheshimu wazo lako kuhusu kodi, lakini naona kwamba viwango vya chini vingesaidia wafanyabiashara wadogo',
        en: 'I respect your idea about taxes, but I see that lower rates would help small business owners',
        vi: 'Tôi tôn trọng ý kiến của bạn, nhưng',
        pronunciation_focus: ['Ninaheshimu → ninaheshimu', 'wazo → wazo', 'lako → lako', 'kuhusu → kuhusu'],
        pronunciation_focus_en: ['Ninaheshimu = ninaheshimu', 'wazo = wazo', 'lako = lako', 'kuhusu = kuhusu']
      },
      {
        sw: 'Kulingana na ripoti ya Benki ya Dunia, nchi zinazowekeza katika elimu ya wanawake zina maendeleo ya haraka zaidi',
        en: 'According to the World Bank report, countries that invest in women\'s education develop faster',
        vi: 'Theo nghiên cứu, Takwimu zinaonyesha kwamba',
        pronunciation_focus: ['Kulingana → kulingana', 'ripoti → ripoti', 'Benki → benki', 'Dunia → dunia'],
        pronunciation_focus_en: ['Kulingana = kulingana', 'ripoti = ripoti', 'Benki = benki', 'Dunia = dunia']
      },
      {
        sw: 'Tuungane kujenga taifa letu',
        en: 'In conclusion, as our elders say, \'Unity is strength',
        vi: 'Để kết luận, như các bậc trưởng lão của chúng ta thường nói, \'Đoàn kết là sức mạnh'
      },
    ],
    cultural_notes_vi: 'Phòng này trang bị cho bạn ngôn ngữ thuyết phục trong tiếng Swahili. Bạn sẽ học cách trình bày lập luận, phản bác một cách tôn trọng, dùng chiến lược tu từ, và xây dựng lập luận bằng chứng cứ. Swahili thuyết phục rất cần thiết cho tranh luận, họp hành, thuyết trình, và biện hộ.',
    cultural_notes_en: 'This room equips you with the language of persuasion in Swahili. You will learn how to present arguments, refute points respectfully, use rhetorical strategies, and build a case with evidence. Persuasive Swahili is essential for debates, meetings, presentations, and advocacy.',
    tip_advice_vi: 'Bài luyện hàng ngày: Chọn một chủ đề và tranh luận cả hai phía bằng Swahili, mỗi phía 2 phút. Ví dụ chủ đề: Je, teknolojia inaboresha au inaharibu jamii? — Công nghệ cải thiện hay phá hủy xã hội? Phía A (2 phút): cấu trúc với kwanza, pili, tatu, kwa hivyo. Phía B (2 phút): mở đầu bằng ninaheshimu maoni tofauti, rồi phản bác bằng bằng chứng. Bài luy',
    tip_advice_en: 'Daily drill: Pick a topic and argue both sides in Swahili for 2 minutes each. Topic example: Je, teknolojia inaboresha au inaharibu jamii? / Does technology improve or destroy society? Side A (2 min): structure with kwanza, pili, tatu, kwa hivyo. Side B (2 min): start with ninaheshimu maoni tofauti, then refute with evidence. This dual-argument pra',
    vocabulary: [
      { word: 'argument', en: 'argument', vi: 'lập luận', pos: 'noun', pronunciation_vi: 'ARGUMENT', pronunciation_en: 'argument' },
      { word: 'structure', en: 'structure', vi: 'cấu trúc', pos: 'noun', pronunciation_vi: 'STRUCTURE', pronunciation_en: 'structure' },
      { word: 'refutation', en: 'refutation', vi: 'phản bác', pos: 'noun', pronunciation_vi: 'REFUTATION', pronunciation_en: 'refutation' },
      { word: 'respect', en: 'respect', vi: 'tôn trọng', pos: 'noun', pronunciation_vi: 'RESPECT', pronunciation_en: 'respect' },
      { word: 'rhetorical', en: 'rhetorical', vi: 'tu từ', pos: 'noun', pronunciation_vi: 'RHETORICAL', pronunciation_en: 'rhetorical' },
      { word: 'questions', en: 'questions', vi: 'câu hỏi', pos: 'noun', pronunciation_vi: 'QUESTIONS', pronunciation_en: 'questions' },
      { word: 'evidence', en: 'evidence', vi: 'bằng chứng', pos: 'noun', pronunciation_vi: 'EVIDENCE', pronunciation_en: 'evidence' },
    ],
  },
  // C1-10 — Professional and Business Swahili
  {
    id: 'swahili_c1_business',
    level: 'C1',
    category: 'business',
    title_vi: 'C1-10 — Tiếng Swahili Chuyên Nghiệp và Thương Mại',
    title_en: 'C1-10 — Professional and Business Swahili',
    intro_vi: 'Phòng này dạy bạn tiếng Swahili chuyên nghiệp cho nơi làm việc, kinh doanh, và môi trường trang trọng. Bạn sẽ học từ vựng họp hành, quy ước email, cụm từ đàm phán, và cách nói gián tiếp lịch sự đặc trưng của văn hóa chuyên nghiệp Đông Phi.',
    intro_en: 'This room teaches you professional Swahili for workplace, business, and formal settings. You will learn meeting vocabulary, email conventions, negotiation phrases, and the polite indirectness that characterizes East African professional culture.',
    sentences: [
      {
        sw: 'Mkutano umeanza',
        en: 'The meeting has started',
        vi: 'Chương trình hôm nay là',
        pronunciation_focus: ['Mkutano → mkutano', 'umeanza → umeanza'],
        pronunciation_focus_en: ['Mkutano = mkutano', 'umeanza = umeanza']
      },
      {
        sw: 'Tafadhali, tuendelee na hoja inayofuata',
        en: 'Please, let\'s proceed to the next point',
        vi: 'Chương trình hôm nay là',
        pronunciation_focus: ['Tafadhali → tafadhali', 'tuendelee → tuendelee', 'hoja → hoja', 'inayofuata → inayofuata'],
        pronunciation_focus_en: ['Tafadhali = tafadhali', 'tuendelee = tuendelee', 'hoja = hoja', 'inayofuata = inayofuata']
      },
      {
        sw: 'Tunashukuru kwa ushirikiano wako',
        en: 'We thank you for your cooperation',
        vi: 'Kính gửi (trang trọng), Mpendwa',
        pronunciation_focus: ['Tunashukuru → tunashukuru', 'kwa → kwa', 'ushirikiano → ushirikiano', 'wako → wako'],
        pronunciation_focus_en: ['Tunashukuru = tunashukuru', 'kwa = kwa', 'ushirikiano = ushirikiano', 'wako = wako']
      },
      {
        sw: 'Hiyo ni ofa nzuri',
        en: 'That is a good offer',
        vi: 'Chúng ta có thể thảo luận về giá',
        pronunciation_focus: ['Hiyo → hiyo', 'ofa → ofa', 'nzuri → nzuri'],
        pronunciation_focus_en: ['Hiyo = hiyo', 'ofa = ofa', 'nzuri = nzuri']
      },
      {
        sw: 'Labda tuangalie njia nyingine',
        en: 'Perhaps let\'s look at another way',
        vi: 'Tôi cần suy nghĩ thêm',
        pronunciation_focus: ['Labda → labda', 'tuangalie → tuangalie', 'njia → njia', 'nyingine → nyingine'],
        pronunciation_focus_en: ['Labda = labda', 'tuangalie = tuangalie', 'njia = njia', 'nyingine = nyingine']
      },
      {
        sw: 'Ningehitaji kufikiria zaidi',
        en: 'I would need to think more',
        vi: 'Tôi cần suy nghĩ thêm',
        pronunciation_focus: ['Ningehitaji → ningehitaji', 'kufikiria → kufikiria', 'zaidi → zaidi'],
        pronunciation_focus_en: ['Ningehitaji = ningehitaji', 'kufikiria = kufikiria', 'zaidi = zaidi']
      },
    ],
    cultural_notes_vi: 'Phòng này dạy bạn tiếng Swahili chuyên nghiệp cho nơi làm việc, kinh doanh, và môi trường trang trọng. Bạn sẽ học từ vựng họp hành, quy ước email, cụm từ đàm phán, và cách nói gián tiếp lịch sự đặc trưng của văn hóa chuyên nghiệp Đông Phi. Swahili chuyên nghiệp mở ra cánh cửa ở Tanzania, Kenya, và khắp Cộng đồng Đông Phi.',
    cultural_notes_en: 'This room teaches you professional Swahili for workplace, business, and formal settings. You will learn meeting vocabulary, email conventions, negotiation phrases, and the polite indirectness that characterizes East African professional culture. Professional Swahili opens doors in Tanzania, Kenya, and across the East African Community.',
    tip_advice_vi: 'Bài luyện hàng ngày: Mô phỏng một tình huống kinh doanh bằng Swahili. Ví dụ — bạn đang thuyết trình cập nhật dự án. Mở đầu: Habari za asubuhi, wenzangu. Leo nitawajulisha kuhusu maendeleo ya mradi wetu — Chào buổi sáng, các đồng nghiệp. Hôm nay tôi sẽ thông báo về tiến độ dự án của chúng ta. Thân bài: Kwanza, tumemaliza awamu ya kwanza — Thứ nhất,',
    tip_advice_en: 'Daily drill: Simulate one business scenario in Swahili. Example — you are presenting a project update. Open: Habari za asubuhi, wenzangu. Leo nitawajulisha kuhusu maendeleo ya mradi wetu. Body: Kwanza, tumemaliza awamu ya kwanza. Pili, bajeti imetumika vizuri. Tatu, changamoto tulizokutana nazo ni… Close: Je, kuna maswali au maoni? Asanteni kwa mud',
    vocabulary: [
      { word: 'meeting', en: 'meeting', vi: 'họp', pos: 'noun', pronunciation_vi: 'MEETING', pronunciation_en: 'meeting' },
      { word: 'vocabulary', en: 'vocabulary', vi: 'từ vựng', pos: 'noun', pronunciation_vi: 'VOCABULARY', pronunciation_en: 'vocabulary' },
      { word: 'email', en: 'email', vi: 'email', pos: 'noun', pronunciation_vi: 'EMAIL', pronunciation_en: 'email' },
      { word: 'written', en: 'written', vi: 'văn viết', pos: 'noun', pronunciation_vi: 'WRITTEN', pronunciation_en: 'written' },
      { word: 'negotiation', en: 'negotiation', vi: 'đàm phán', pos: 'noun', pronunciation_vi: 'NEGOTIATION', pronunciation_en: 'negotiation' },
      { word: 'business', en: 'business', vi: 'kinh doanh', pos: 'noun', pronunciation_vi: 'BUSINESS', pronunciation_en: 'business' },
      { word: 'presentation', en: 'presentation', vi: 'thuyết trình', pos: 'noun', pronunciation_vi: 'PRESENTATION', pronunciation_en: 'presentation' },
    ],
  },
  // C1-11 — Literary and Poetic Swahili
  {
    id: 'swahili_c1_literary',
    level: 'C1',
    category: 'literary',
    title_vi: 'C1-11 — Tiếng Swahili Văn Chương và Thi Ca',
    title_en: 'C1-11 — Literary and Poetic Swahili',
    intro_vi: 'Phòng này giới thiệu vẻ đẹp của Swahili văn chương. Bạn sẽ học các biện pháp thi ca, ngôn ngữ ẩn dụ, nhịp điệu của thơ Swahili (ushairi), và cách thưởng thức cũng như sáng tạo biểu đạt văn chương.',
    intro_en: 'This room introduces the beauty of literary Swahili. You will learn poetic devices, metaphorical language, the rhythm of Swahili poetry (ushairi), and how to appreciate and create literary expression.',
    sentences: [
      {
        sw: 'Moyo wake ni mweupe kama theluji',
        en: 'His heart is white as snow',
        vi: 'Trái tim anh trắng như tuyết',
        pronunciation_focus: ['Moyo → moyo', 'wake → wake', 'mweupe → mweupe', 'kama → kama'],
        pronunciation_focus_en: ['Moyo = moyo', 'wake = wake', 'mweupe = mweupe', 'kama = kama']
      },
      {
        sw: 'Yeye ni simba vitani',
        en: 'He is a lion in battle',
        vi: 'Trái tim anh trắng như tuyết',
        pronunciation_focus: ['Yeye → yeye', 'simba → simba', 'vitani → vitani'],
        pronunciation_focus_en: ['Yeye = yeye', 'simba = simba', 'vitani = vitani']
      },
      {
        sw: 'Mwenye hasira kama simba',
        en: 'Angry like a lion',
        vi: 'Trái tim anh trắng như tuyết',
        pronunciation_focus: ['Mwenye → mwenye', 'hasira → hasira', 'kama → kama', 'simba → simba'],
        pronunciation_focus_en: ['Mwenye = mwenye', 'hasira = hasira', 'kama = kama', 'simba = simba']
      },
      {
        sw: 'Maisha ni safari',
        en: 'Life is a journey',
        vi: 'Trái tim anh trắng như tuyết',
        pronunciation_focus: ['Maisha → maisha', 'safari → safari'],
        pronunciation_focus_en: ['Maisha = maisha', 'safari = safari']
      },
      {
        sw: 'Kifo kilibisha hodi',
        en: 'Death knocked at the door',
        vi: 'Gió thì thầm bên tai tôi',
        pronunciation_focus: ['Kifo → kifo', 'kilibisha → kilibisha', 'hodi → hodi'],
        pronunciation_focus_en: ['Kifo = kifo', 'kilibisha = kilibisha', 'hodi = hodi']
      },
      {
        sw: 'Upendo ulinipofusha',
        en: 'Love blinded me',
        vi: 'Gió thì thầm bên tai tôi',
        pronunciation_focus: ['Upendo → upendo', 'ulinipofusha → ulinipofusha'],
        pronunciation_focus_en: ['Upendo = upendo', 'ulinipofusha = ulinipofusha']
      },
      {
        sw: 'Upepo ulinong\'ona masikioni mwangu',
        en: 'The wind whispered in my ears',
        vi: 'Gió thì thầm bên tai tôi',
        pronunciation_focus: ['Upepo → upepo', 'ulinong\'ona → ulinong\'ona', 'masikioni → masikioni', 'mwangu → mwangu'],
        pronunciation_focus_en: ['Upepo = upepo', 'ulinong\'ona = ulinong\'ona', 'masikioni = masikioni', 'mwangu = mwangu']
      },
    ],
    cultural_notes_vi: 'Phòng này giới thiệu vẻ đẹp của Swahili văn chương. Bạn sẽ học các biện pháp thi ca, ngôn ngữ ẩn dụ, nhịp điệu của thơ Swahili (ushairi), và cách thưởng thức cũng như sáng tạo biểu đạt văn chương. Swahili có truyền thống thi ca phong phú kéo dài hàng thế kỷ, từ sử thi utendi cổ điển đến spoken word hiện đại.',
    cultural_notes_en: 'This room introduces the beauty of literary Swahili. You will learn poetic devices, metaphorical language, the rhythm of Swahili poetry (ushairi), and how to appreciate and create literary expression. Swahili has a rich poetic tradition stretching back centuries, from classical utendi epics to modern spoken word.',
    tip_advice_vi: 'Bài luyện hàng ngày: Sáng tác một khổ thơ Swahili bốn dòng (ubeti mmoja). Theo hình thức shairi: 8 âm tiết mỗi dòng, vần cuối nhất quán. Mẫu: Dòng 1 (giới thiệu chủ đề), Dòng 2 (phát triển), Dòng 3 (chuyển/tương phản), Dòng 4 (kết). Ví dụ: Nakupenda kwa dhati (8) / Wewe ndiye wangu mati (8) / Siku zote za maisha (8) / Utakaa moyoni mwangu (8). Ý ng',
    tip_advice_en: 'Daily drill: Compose one four-line Swahili stanza (ubeti mmoja). Follow the shairi form: 8 syllables per line, consistent end rhyme. Template: Line 1 (introduce theme), Line 2 (develop), Line 3 (turn/contrast), Line 4 (resolve). Example: Nakupenda kwa dhati (8) / Wewe ndiye wangu mati (8) / Siku zote za maisha (8) / Utakaa moyoni mwangu (8). Meanin',
    vocabulary: [
      { word: 'metaphor', en: 'metaphor', vi: 'ẩn dụ', pos: 'noun', pronunciation_vi: 'METAPHOR', pronunciation_en: 'metaphor' },
      { word: 'simile', en: 'simile', vi: 'so sánh', pos: 'noun', pronunciation_vi: 'SIMILE', pronunciation_en: 'simile' },
      { word: 'rhythm', en: 'rhythm', vi: 'nhịp', pos: 'noun', pronunciation_vi: 'RHYTHM', pronunciation_en: 'rhythm' },
      { word: 'rhyme', en: 'rhyme', vi: 'vần', pos: 'noun', pronunciation_vi: 'RHYME', pronunciation_en: 'rhyme' },
      { word: 'poetry', en: 'poetry', vi: 'thơ', pos: 'noun', pronunciation_vi: 'POETRY', pronunciation_en: 'poetry' },
      { word: 'personification', en: 'personification', vi: 'nhân hóa', pos: 'noun', pronunciation_vi: 'PERSONIFICATION', pronunciation_en: 'personification' },
      { word: 'imagery', en: 'imagery', vi: 'hình ảnh', pos: 'noun', pronunciation_vi: 'IMAGERY', pronunciation_en: 'imagery' },
    ],
  },
  // C1-12 — Conditional and Hypothetical Speech
  {
    id: 'swahili_c1_conditional',
    level: 'C1',
    category: 'conditional',
    title_vi: 'C1-12 — Câu Điều Kiện và Giả Định Trong Tiếng Swahili',
    title_en: 'C1-12 — Conditional and Hypothetical Speech',
    intro_vi: 'Phòng này dạy bạn diễn đạt điều kiện, giả định, và phản thực trong tiếng Swahili. Bạn sẽ học các dấu hiệu điều kiện -nge- và -ngali-, điều kiện -ki-, và cách thảo luận về những gì đáng lẽ ra, những gì có thể, và những gì nên làm.',
    intro_en: 'This room teaches you to express conditions, hypotheticals, and counterfactuals in Swahili. You will learn the -nge- and -ngali- conditional markers, the -ki- conditional, and how to discuss what might have been, what could be, and what should be.',
    sentences: [
      {
        sw: 'Ukienda sokoni, utanunua matunda',
        en: 'If you go to the market, you will buy fruit',
        vi: 'If you go to the market, you will buy fruit',
        pronunciation_focus: ['Ukienda → ukienda', 'sokoni → sokoni', 'utanunua → utanunua', 'matunda → matunda'],
        pronunciation_focus_en: ['Ukienda = ukienda', 'sokoni = sokoni', 'utanunua = utanunua', 'matunda = matunda']
      },
      {
        sw: 'Nikisoma kwa bidii, nitafaulu',
        en: 'If I study hard, I will pass',
        vi: 'If I study hard, I will pass',
        pronunciation_focus: ['Nikisoma → nikisoma', 'kwa → kwa', 'bidii → bidii', 'nitafaulu → nitafaulu'],
        pronunciation_focus_en: ['Nikisoma = nikisoma', 'kwa = kwa', 'bidii = bidii', 'nitafaulu = nitafaulu']
      },
      {
        sw: 'Ningekuwa na pesa, ningenunua nyumba',
        en: 'If I had money, I would buy a house',
        vi: 'If I had money, I would buy a house',
        pronunciation_focus: ['Ningekuwa → ningekuwa', 'pesa → pesa', 'ningenunua → ningenunua', 'nyumba → nyumba'],
        pronunciation_focus_en: ['Ningekuwa = ningekuwa', 'pesa = pesa', 'ningenunua = ningenunua', 'nyumba = nyumba']
      },
      {
        sw: 'Ungejua Kiswahili, ungeelewa',
        en: 'If you knew Swahili, you would understand',
        vi: 'If you knew Swahili, you would understand',
        pronunciation_focus: ['Ungejua → ungejua', 'Kiswahili → kiswahili', 'ungeelewa → ungeelewa'],
        pronunciation_focus_en: ['Ungejua = ungejua', 'Kiswahili = kiswahili', 'ungeelewa = ungeelewa']
      },
      {
        sw: 'Ningalijua, ningalikuja mapema',
        en: 'If I had known, I would have come early',
        vi: 'If I had known, I would have come early',
        pronunciation_focus: ['Ningalijua → ningalijua', 'ningalikuja → ningalikuja', 'mapema → mapema'],
        pronunciation_focus_en: ['Ningalijua = ningalijua', 'ningalikuja = ningalikuja', 'mapema = mapema']
      },
      {
        sw: 'Ungalisoma, ungalifaulu',
        en: 'If you had studied, you would have passed',
        vi: 'If you had studied, you would have passed',
        pronunciation_focus: ['Ungalisoma → ungalisoma', 'ungalifaulu → ungalifaulu'],
        pronunciation_focus_en: ['Ungalisoma = ungalisoma', 'ungalifaulu = ungalifaulu']
      },
      {
        sw: 'Ningalisoma utotoni, ningekuwa na kazi nzuri sasa',
        en: 'If I had studied in childhood, I would have a good job now',
        vi: 'If I had studied in childhood, I would have a good job now',
        pronunciation_focus: ['Ningalisoma → ningalisoma', 'utotoni → utotoni', 'ningekuwa → ningekuwa', 'kazi → kazi'],
        pronunciation_focus_en: ['Ningalisoma = ningalisoma', 'utotoni = utotoni', 'ningekuwa = ningekuwa', 'kazi = kazi']
      },
    ],
    cultural_notes_vi: 'Phòng này dạy bạn diễn đạt điều kiện, giả định, và phản thực trong tiếng Swahili. Bạn sẽ học các dấu hiệu điều kiện -nge- và -ngali-, điều kiện -ki-, và cách thảo luận về những gì đáng lẽ ra, những gì có thể, và những gì nên làm. Làm chủ câu điều kiện là điều cần thiết cho thảo luận và lập kế hoạch tinh tế.',
    cultural_notes_en: 'This room teaches you to express conditions, hypotheticals, and counterfactuals in Swahili. You will learn the -nge- and -ngali- conditional markers, the -ki- conditional, and how to discuss what might have been, what could be, and what should be. Conditional mastery is essential for sophisticated discussion and planning.',
    tip_advice_vi: 'Bài luyện hàng ngày: Xây chuỗi điều kiện dùng cả ba loại. Bắt đầu với điều kiện -ki-, tưởng tượng giả định -nge- từ đó, rồi suy ngẫm với -ngali-. Ví dụ chuỗi: Nikisoma Kiswahili kila siku, nitaboresha — Nếu tôi học Swahili mỗi ngày, tôi sẽ tiến bộ. Ningeboresha Kiswahili, ningeweza kufanya kazi Tanzania — Nếu tôi giỏi Swahili hơn, tôi có thể làm vi',
    tip_advice_en: 'Daily drill: Build a conditional chain using all three types. Start with a -ki- conditional, imagine a -nge- hypothetical from it, then reflect with -ngali-. Example chain: Nikisoma Kiswahili kila siku, nitaboresha / If I study Swahili every day, I will improve. Ningeboresha Kiswahili, ningeweza kufanya kazi Tanzania / If I improved my Swahili, I c',
    vocabulary: [
      { word: 'ki conditional', en: 'ki conditional', vi: 'điều kiện ki', pos: 'noun', pronunciation_vi: 'KI CONDITIONAL', pronunciation_en: 'ki conditional' },
      { word: 'real', en: 'real', vi: 'thực', pos: 'noun', pronunciation_vi: 'REAL', pronunciation_en: 'real' },
      { word: 'nge conditional', en: 'nge conditional', vi: 'điều kiện nge', pos: 'noun', pronunciation_vi: 'NGE CONDITIONAL', pronunciation_en: 'nge conditional' },
      { word: 'hypothetical', en: 'hypothetical', vi: 'giả định', pos: 'noun', pronunciation_vi: 'HYPOTHETICAL', pronunciation_en: 'hypothetical' },
      { word: 'ngali conditional', en: 'ngali conditional', vi: 'điều kiện ngali', pos: 'noun', pronunciation_vi: 'NGALI CONDITIONAL', pronunciation_en: 'ngali conditional' },
      { word: 'counterfactual', en: 'counterfactual', vi: 'phản thực', pos: 'noun', pronunciation_vi: 'COUNTERFACTUAL', pronunciation_en: 'counterfactual' },
      { word: 'mixed', en: 'mixed', vi: 'hỗn hợp', pos: 'noun', pronunciation_vi: 'MIXED', pronunciation_en: 'mixed' },
    ],
  },
  // C1-13 — Cultural Nuances in Swahili Communication
  {
    id: 'swahili_c1_cultural_nuances',
    level: 'C1',
    category: 'cultural_nuances',
    title_vi: 'C1-13 — Sắc Thái Văn Hóa Trong Giao Tiếp Swahili',
    title_en: 'C1-13 — Cultural Nuances in Swahili Communication',
    intro_vi: 'Phòng này khám phá những tầng văn hóa sâu sắc ẩn trong giao tiếp Swahili. Ngoài từ vựng và ngữ pháp, bạn sẽ học về cách nói gián tiếp, chiến lược giữ thể diện, vai trò của tuổi tác và địa vị, và nghệ thuật tinh tế của việc nói không mà không cần nói không.',
    intro_en: 'This room explores the deep cultural layers embedded in Swahili communication. Beyond vocabulary and grammar, you will learn about indirect speech, face-saving strategies, the role of age and status, and the subtle art of saying no without saying no.',
    sentences: [
      {
        sw: 'Labda baadaye',
        en: 'Maybe later',
        vi: 'Không) có thể bị coi là thô lỗ trong văn hóa Swahili',
        pronunciation_focus: ['Labda → labda', 'baadaye → baadaye'],
        pronunciation_focus_en: ['Labda = labda', 'baadaye = baadaye']
      },
      {
        sw: 'Karibu chakula',
        en: 'Welcome to the food (please eat)',
        vi: 'đây không phải từ chối thật, mà là khiêm tốn lịch sự',
        pronunciation_focus: ['Karibu → karibu', 'chakula → chakula'],
        pronunciation_focus_en: ['Karibu = karibu', 'chakula = chakula']
      },
      {
        sw: 'Tafadhali, usione aibu',
        en: 'Please, don\'t be shy',
        vi: 'đây không phải từ chối thật, mà là khiêm tốn lịch sự',
        pronunciation_focus: ['Tafadhali → tafadhali', 'usione → usione', 'aibu → aibu'],
        pronunciation_focus_en: ['Tafadhali = tafadhali', 'usione = usione', 'aibu = aibu']
      },
      {
        sw: 'Nawashukuru sana',
        en: 'I thank you deeply',
        vi: 'đây không phải từ chối thật, mà là khiêm tốn lịch sự',
        pronunciation_focus: ['Nawashukuru → nawashukuru', 'sana → sana'],
        pronunciation_focus_en: ['Nawashukuru = nawashukuru', 'sana = sana']
      },
      {
        sw: 'Refuse once politely',
        en: 'Ahsante, lakini nimeshiba / Thank you, but I am full',
        vi: 'Karibu',
        pronunciation_focus: ['Refuse → refuse', 'once → once', 'politely → politely'],
        pronunciation_focus_en: ['Refuse = refuse', 'once = once', 'politely = politely']
      },
      {
        sw: 'Tutaonana inshallah',
        en: 'Thank you for your hospitality',
        vi: 'Karibu',
        pronunciation_focus: ['Tutaonana → tutaonana', 'inshallah → inshallah'],
        pronunciation_focus_en: ['Tutaonana = tutaonana', 'inshallah = inshallah']
      },
    ],
    cultural_notes_vi: 'Phòng này khám phá những tầng văn hóa sâu sắc ẩn trong giao tiếp Swahili. Ngoài từ vựng và ngữ pháp, bạn sẽ học về cách nói gián tiếp, chiến lược giữ thể diện, vai trò của tuổi tác và địa vị, và nghệ thuật tinh tế của việc nói không mà không cần nói không. Lưu loát văn hóa là điều biến người học ngôn ngữ thành người giao tiếp thực thụ.',
    cultural_notes_en: 'This room explores the deep cultural layers embedded in Swahili communication. Beyond vocabulary and grammar, you will learn about indirect speech, face-saving strategies, the role of age and status, and the subtle art of saying no without saying no. Cultural fluency is what transforms a language learner into a true communicator.',
    tip_advice_vi: 'Bài luyện hàng ngày: Thực hành một tình huống văn hóa hoàn chỉnh. Ví dụ — thăm nhà Swahili: (1) Chào đầy đủ: Hodi! — Cốc cốc! → Karibu! — Mời vào! → Shikamoo (với người lớn) → Marahaba. (2) Hỏi về gia đình: Habari za familia? Watoto hawajambo? (3) Nhận trà: Từ chối một lần lịch sự → Ahsante, lakini nimeshiba — Cảm ơn, nhưng tôi no rồi. → Chủ nhà nà',
    tip_advice_en: 'Daily drill: Practice one complete cultural scenario. Example — visiting a Swahili home: (1) Greet fully: Hodi! / Knock knock! → Karibu! / Welcome! → Shikamoo (to elder) → Marahaba. (2) Ask about family: Habari za familia? Watoto hawajambo? (3) Receive tea: Refuse once politely → Ahsante, lakini nimeshiba / Thank you, but I am full. → Host insists',
    vocabulary: [
      { word: 'indirect', en: 'indirect', vi: 'gián tiếp', pos: 'noun', pronunciation_vi: 'INDIRECT', pronunciation_en: 'indirect' },
      { word: 'refusal', en: 'refusal', vi: 'từ chối', pos: 'noun', pronunciation_vi: 'REFUSAL', pronunciation_en: 'refusal' },
      { word: 'age', en: 'age', vi: 'tuổi tác', pos: 'noun', pronunciation_vi: 'AGE', pronunciation_en: 'age' },
      { word: 'status', en: 'status', vi: 'địa vị', pos: 'noun', pronunciation_vi: 'STATUS', pronunciation_en: 'status' },
      { word: 'respect', en: 'respect', vi: 'kính trọng', pos: 'noun', pronunciation_vi: 'RESPECT', pronunciation_en: 'respect' },
      { word: 'greetings', en: 'greetings', vi: 'chào hỏi', pos: 'noun', pronunciation_vi: 'GREETINGS', pronunciation_en: 'greetings' },
      { word: 'small talk', en: 'small talk', vi: 'xã giao', pos: 'noun', pronunciation_vi: 'SMALL TALK', pronunciation_en: 'small talk' },
    ],
  },
  // C1-14 — Expressing Opinions with Precision
  {
    id: 'swahili_c1_opinions',
    level: 'C1',
    category: 'opinions',
    title_vi: 'C1-14 — Diễn Đạt Quan Điểm Chính Xác Trong Tiếng Swahili',
    title_en: 'C1-14 — Expressing Opinions with Precision',
    intro_vi: 'Phòng này giúp bạn diễn đạt quan điểm rõ ràng, lịch sự, và tinh tế trong tiếng Swahili. Ở trình độ C1, một ý kiến mạnh vẫn cần được nói ra sao cho cân bằng và thấu đáo.',
    intro_en: 'This room helps you express opinions clearly, politely, and with nuance in Swahili. At C1 level, strong ideas must sound balanced and thoughtful. These six entries teach you how to agree, disagree, add perspective, and express uncertainty in a mature and natural way.',
    sentences: [
      {
        sw: 'Mimi naona tofauti',
        en: 'I see it differently',
        vi: 'Tôi thấy khác',
        pronunciation_focus: ['Mimi → mimi', 'naona → naona', 'tofauti → tofauti'],
        pronunciation_focus_en: ['Mimi = mimi', 'naona = naona', 'tofauti = tofauti']
      },
      {
        sw: 'Labda kuna njia nyingine',
        en: 'Perhaps there is another way',
        vi: 'Tôi thấy khác',
        pronunciation_focus: ['Labda → labda', 'kuna → kuna', 'njia → njia', 'nyingine → nyingine'],
        pronunciation_focus_en: ['Labda = labda', 'kuna = kuna', 'njia = njia', 'nyingine = nyingine']
      },
      {
        sw: 'Nina wasiwasi kuhusu hoja hiyo',
        en: 'I have a concern about that argument',
        vi: 'Tôi hiểu điều bạn nói, nhưng',
        pronunciation_focus: ['Nina → nina', 'wasiwasi → wasiwasi', 'kuhusu → kuhusu', 'hoja → hoja'],
        pronunciation_focus_en: ['Nina = nina', 'wasiwasi = wasiwasi', 'kuhusu = kuhusu', 'hoja = hoja']
      },
      {
        sw: 'Bado ninafikiria jambo hili',
        en: 'I am still thinking about this',
        vi: 'Tôi vẫn đang suy nghĩ về việc này',
        pronunciation_focus: ['Bado → bado', 'ninafikiria → ninafikiria', 'jambo → jambo', 'hili → hili'],
        pronunciation_focus_en: ['Bado = bado', 'ninafikiria = ninafikiria', 'jambo = jambo', 'hili = hili']
      },
      {
        sw: 'Sina uhakika kabisa',
        en: 'I am not completely sure',
        vi: 'Tôi vẫn đang suy nghĩ về việc này',
        pronunciation_focus: ['Sina → sina', 'uhakika → uhakika', 'kabisa → kabisa'],
        pronunciation_focus_en: ['Sina = sina', 'uhakika = uhakika', 'kabisa = kabisa']
      },
      {
        sw: 'Huenda nikabadilisha maoni baadaye',
        en: 'I might change my opinion later',
        vi: 'Tôi vẫn đang suy nghĩ về việc này',
        pronunciation_focus: ['Huenda → huenda', 'nikabadilisha → nikabadilisha', 'maoni → maoni', 'baadaye → baadaye'],
        pronunciation_focus_en: ['Huenda = huenda', 'nikabadilisha = nikabadilisha', 'maoni = maoni', 'baadaye = baadaye']
      },
    ],
    cultural_notes_vi: 'Phòng này giúp bạn diễn đạt quan điểm rõ ràng, lịch sự, và tinh tế trong tiếng Swahili. Ở trình độ C1, một ý kiến mạnh vẫn cần được nói ra sao cho cân bằng và thấu đáo. Sáu phần trong phòng hướng dẫn bạn cách đồng ý, cách phản đối, cách thêm góc nhìn và cách nói khi mình chưa chắc chắn — đều một cách tự nhiên và chín chắn.',
    cultural_notes_en: 'This room helps you express opinions clearly, politely, and with nuance in Swahili. At C1 level, strong ideas must sound balanced and thoughtful. These six entries teach you how to agree, disagree, add perspective, and express uncertainty in a mature and natural way.',
    tip_advice_vi: 'Khi cần đưa ra một quan điểm mạnh, hãy giữ bình tĩnh và rõ ràng. Cụm từ hữu ích: Kwa maoni yangu… — Theo ý kiến của tôi… Ninaamini kwa dhati kwamba… — Tôi tin chắc rằng… Kulingana na uzoefu wangu… — Theo kinh nghiệm của tôi… Ukweli ni kwamba… — Sự thật là… Hãy nói một lần thật tự tin. Bạn không cần lặp đi lặp lại hay ra sức bảo vệ. Trong diễn ngôn',
    tip_advice_en: 'When you must express a strong opinion, keep it calm and clear. Useful phrases: Kwa maoni yangu… / In my opinion… Ninaamini kwa dhati kwamba… / I firmly believe that… Kulingana na uzoefu wangu… / According to my experience… Ukweli ni kwamba… / The truth is that… Say it once with confidence. You do not need to repeat or defend too much. In Swahili d',
    vocabulary: [
      { word: 'opinions', en: 'opinions', vi: 'quan điểm', pos: 'noun', pronunciation_vi: 'OPINIONS', pronunciation_en: 'opinions' },
      { word: 'soft tone', en: 'soft tone', vi: 'giọng mềm', pos: 'noun', pronunciation_vi: 'SOFT TONE', pronunciation_en: 'soft tone' },
      { word: 'agreement', en: 'agreement', vi: 'đồng ý', pos: 'noun', pronunciation_vi: 'AGREEMENT', pronunciation_en: 'agreement' },
      { word: 'balanced', en: 'balanced', vi: 'cân bằng', pos: 'noun', pronunciation_vi: 'BALANCED', pronunciation_en: 'balanced' },
      { word: 'disagreement', en: 'disagreement', vi: 'bất đồng', pos: 'noun', pronunciation_vi: 'DISAGREEMENT', pronunciation_en: 'disagreement' },
      { word: 'polite', en: 'polite', vi: 'lịch sự', pos: 'noun', pronunciation_vi: 'POLITE', pronunciation_en: 'polite' },
      { word: 'perspective', en: 'perspective', vi: 'góc nhìn', pos: 'noun', pronunciation_vi: 'PERSPECTIVE', pronunciation_en: 'perspective' },
    ],
  },
];

export default lessons;
