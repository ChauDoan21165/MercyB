// src/languages/thai/reading.ts
//
// Thai reading-practice passages with bilingual (Vietnamese + English) support,
// spanning CEFR A1 → C2. Built by the A3 agent (Wave 2).
//
// Design:
//   • Lower levels (A1/A2/B1) carry a learner `romanization` of the whole
//     passage; B2/C1/C2 drop it (the target there is reading the script).
//   • EVERY passage carries a Vietnamese AND an English translation plus a
//     short bilingual `notes_*` explainer (what the passage teaches / what to
//     watch for).
//   • Each passage ships comprehension questions WITH answers (VI + EN, plus a
//     Thai answer where natural) and a small `vocab` gloss list.
//
// This is self-contained: the Thai vertical has no shared reading registry
// yet, so the types live here. C1/C2 passages are STUDY SUPPORT — denser, for
// guided reading — and, like the rest of this batch, native review is
// DEFERRED. No native-review claim is made; treat tone marks / register as
// provisional until a native speaker passes over it.

// ── Types ───────────────────────────────────────────────────────────────────

export type ThaiReadingLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ThaiComprehensionQuestion = {
  /** Question in Thai script (optional for the lowest levels). */
  q_th?: string;
  q_vi: string;
  q_en: string;
  /** Model answer in Thai script, where natural. */
  answer_th?: string;
  answer_vi: string;
  answer_en: string;
};

export type ThaiReadingVocab = {
  /** Thai headword in script. */
  word: string;
  /** Romanization (kept for all levels — vocab is where it helps most). */
  rtgs: string;
  en: string;
  vi: string;
};

export type ThaiReadingPassage = {
  id: string;
  level: ThaiReadingLevel;
  topic: string;
  title_vi: string;
  title_en: string;
  /** The passage itself, in Thai script. */
  passage_th: string;
  /** Whole-passage romanization — present for A1/A2/B1, omitted for B2+. */
  romanization?: string;
  translation_vi: string;
  translation_en: string;
  /** Short bilingual explainer: what this passage teaches / how to read it. */
  notes_vi: string;
  notes_en: string;
  questions: ThaiComprehensionQuestion[];
  vocab: ThaiReadingVocab[];
};

// ── A1 — short self/everyday passages ───────────────────────────────────────

const a1: ThaiReadingPassage[] = [
  {
    id: "thai_read_a1_intro",
    level: "A1",
    topic: "self_introduction",
    title_vi: "Tự giới thiệu",
    title_en: "Introducing myself",
    passage_th:
      "สวัสดีครับ ผมชื่อสมชาย ผมอายุยี่สิบห้าปี ผมเป็นคนไทย ผมอยู่ที่กรุงเทพ ผมชอบกินข้าวผัด",
    romanization:
      "sà-wàt-dii khráp. phǒm chûe sǒm-chaai. phǒm aa-yú yîi-sìp-hâa bpii. phǒm bpen khon thai. phǒm yùu thîi grung-thêep. phǒm châawp gin khâao-phàt.",
    translation_vi:
      "Xin chào. Tôi tên là Somchai. Tôi 25 tuổi. Tôi là người Thái. Tôi sống ở Bangkok. Tôi thích ăn cơm chiên.",
    translation_en:
      "Hello. My name is Somchai. I am 25 years old. I am Thai. I live in Bangkok. I like eating fried rice.",
    notes_vi:
      "Mẫu tự giới thiệu cơ bản: ชื่อ (tên) + อายุ...ปี (tuổi) + เป็นคน... (quốc tịch) + อยู่ที่... (nơi ở). 'ผม' là 'tôi' (nam).",
    notes_en:
      "Basic self-intro frame: ชื่อ (name) + อายุ…ปี (age) + เป็นคน… (nationality) + อยู่ที่… (residence). 'ผม' is the male 'I'.",
    questions: [
      {
        q_th: "สมชายอายุเท่าไหร่",
        q_vi: "Somchai bao nhiêu tuổi?",
        q_en: "How old is Somchai?",
        answer_th: "ยี่สิบห้าปี",
        answer_vi: "25 tuổi.",
        answer_en: "25 years old.",
      },
      {
        q_th: "สมชายอยู่ที่ไหน",
        q_vi: "Somchai sống ở đâu?",
        q_en: "Where does Somchai live?",
        answer_th: "ที่กรุงเทพ",
        answer_vi: "Ở Bangkok.",
        answer_en: "In Bangkok.",
      },
    ],
    vocab: [
      { word: "ชื่อ", rtgs: "chûe", en: "name / to be named", vi: "tên / tên là" },
      { word: "อายุ", rtgs: "aa-yú", en: "age", vi: "tuổi" },
      { word: "คนไทย", rtgs: "khon thai", en: "Thai person", vi: "người Thái" },
      { word: "ชอบ", rtgs: "châawp", en: "to like", vi: "thích" },
    ],
  },
  {
    id: "thai_read_a1_family",
    level: "A1",
    topic: "family",
    title_vi: "Gia đình tôi",
    title_en: "My family",
    passage_th:
      "ครอบครัวของฉันมีสี่คน พ่อ แม่ น้องชาย และฉัน พ่อเป็นครู แม่เป็นพยาบาล น้องชายยังเรียนหนังสือ เรารักกันมาก",
    romanization:
      "khrâawp-khrua khǎawng chǎn mii sìi khon. phâaw, mâae, náawng-chaai, láe chǎn. phâaw bpen khruu. mâae bpen phá-yaa-baan. náawng-chaai yang rian nǎng-sǔe. rao rák gan mâak.",
    translation_vi:
      "Gia đình tôi có bốn người: bố, mẹ, em trai và tôi. Bố là giáo viên, mẹ là y tá, em trai vẫn còn đi học. Chúng tôi rất yêu thương nhau.",
    translation_en:
      "My family has four people: father, mother, younger brother, and me. Father is a teacher, mother is a nurse, my younger brother is still in school. We love each other very much.",
    notes_vi:
      "'ของ (khǎawng)' = 'của' chỉ sở hữu: ครอบครัวของฉัน = gia đình của tôi. 'เป็น' nối với nghề nghiệp.",
    notes_en:
      "'ของ (khǎawng)' = 'of' marks possession: ครอบครัวของฉัน = my family. 'เป็น' links to a profession.",
    questions: [
      {
        q_th: "ครอบครัวมีกี่คน",
        q_vi: "Gia đình có mấy người?",
        q_en: "How many people are in the family?",
        answer_th: "สี่คน",
        answer_vi: "Bốn người.",
        answer_en: "Four people.",
      },
      {
        q_th: "แม่ทำงานอะไร",
        q_vi: "Mẹ làm nghề gì?",
        q_en: "What is the mother's job?",
        answer_th: "เป็นพยาบาล",
        answer_vi: "Y tá.",
        answer_en: "A nurse.",
      },
    ],
    vocab: [
      { word: "ครอบครัว", rtgs: "khrâawp-khrua", en: "family", vi: "gia đình" },
      { word: "ของ", rtgs: "khǎawng", en: "of (possession)", vi: "của" },
      { word: "พยาบาล", rtgs: "phá-yaa-baan", en: "nurse", vi: "y tá" },
      { word: "รัก", rtgs: "rák", en: "to love", vi: "yêu" },
    ],
  },
  {
    id: "thai_read_a1_food",
    level: "A1",
    topic: "food",
    title_vi: "Đồ ăn tôi thích",
    title_en: "Food I like",
    passage_th:
      "ฉันชอบกินอาหารไทย ฉันชอบต้มยำกุ้งมาก มันเผ็ดและเปรี้ยว ตอนเช้าฉันกินข้าวกับไข่ ตอนเย็นฉันกินผลไม้",
    romanization:
      "chǎn châawp gin aa-hǎan thai. chǎn châawp dtôm-yam-gûng mâak. man phèt láe bprîao. dtaawn-cháo chǎn gin khâao gàp khài. dtaawn-yen chǎn gin phǒn-lá-mái.",
    translation_vi:
      "Tôi thích ăn món Thái. Tôi rất thích tom yum tôm. Nó cay và chua. Buổi sáng tôi ăn cơm với trứng. Buổi tối tôi ăn trái cây.",
    translation_en:
      "I like Thai food. I really like tom yum goong. It is spicy and sour. In the morning I eat rice with egg. In the evening I eat fruit.",
    notes_vi:
      "'กับ (gàp)' = 'với/cùng': ข้าวกับไข่ = cơm với trứng. 'มัน (man)' = 'nó' chỉ vật.",
    notes_en:
      "'กับ (gàp)' = 'with': ข้าวกับไข่ = rice with egg. 'มัน (man)' = 'it' for things.",
    questions: [
      {
        q_th: "ต้มยำกุ้งรสชาติอย่างไร",
        q_vi: "Tom yum tôm có vị thế nào?",
        q_en: "What does tom yum goong taste like?",
        answer_th: "เผ็ดและเปรี้ยว",
        answer_vi: "Cay và chua.",
        answer_en: "Spicy and sour.",
      },
      {
        q_th: "ตอนเย็นกินอะไร",
        q_vi: "Buổi tối ăn gì?",
        q_en: "What is eaten in the evening?",
        answer_th: "ผลไม้",
        answer_vi: "Trái cây.",
        answer_en: "Fruit.",
      },
    ],
    vocab: [
      { word: "อาหารไทย", rtgs: "aa-hǎan thai", en: "Thai food", vi: "món Thái" },
      { word: "เผ็ด", rtgs: "phèt", en: "spicy", vi: "cay" },
      { word: "เปรี้ยว", rtgs: "bprîao", en: "sour", vi: "chua" },
      { word: "ผลไม้", rtgs: "phǒn-lá-mái", en: "fruit", vi: "trái cây" },
    ],
  },
  {
    id: "thai_read_a1_morning",
    level: "A1",
    topic: "daily_routine",
    title_vi: "Buổi sáng của tôi",
    title_en: "My morning",
    passage_th:
      "ทุกเช้าฉันตื่นนอนหกโมง ฉันแปรงฟันและอาบน้ำ แล้วฉันกินข้าวเช้า ฉันไปโรงเรียนเจ็ดโมงครึ่ง",
    romanization:
      "thúk cháo chǎn dtùen-naawn hòk moong. chǎn bpraaeng-fan láe àap-náam. láeo chǎn gin khâao-cháo. chǎn bpai roong-rian jèt moong khrûeng.",
    translation_vi:
      "Mỗi sáng tôi dậy lúc 6 giờ. Tôi đánh răng và tắm. Rồi tôi ăn sáng. Tôi đến trường lúc 7 giờ rưỡi.",
    translation_en:
      "Every morning I wake up at six. I brush my teeth and shower. Then I eat breakfast. I go to school at half past seven.",
    notes_vi:
      "'ครึ่ง (khrûeng)' = 'rưỡi/nửa': เจ็ดโมงครึ่ง = 7 giờ rưỡi. 'แล้ว' nối các bước.",
    notes_en:
      "'ครึ่ง (khrûeng)' = 'half': เจ็ดโมงครึ่ง = half past seven. 'แล้ว' links the steps.",
    questions: [
      {
        q_th: "ตื่นนอนกี่โมง",
        q_vi: "Dậy lúc mấy giờ?",
        q_en: "What time does she wake up?",
        answer_th: "หกโมง",
        answer_vi: "6 giờ.",
        answer_en: "Six o'clock.",
      },
      {
        q_th: "ไปโรงเรียนกี่โมง",
        q_vi: "Đến trường lúc mấy giờ?",
        q_en: "What time does she go to school?",
        answer_th: "เจ็ดโมงครึ่ง",
        answer_vi: "7 giờ rưỡi.",
        answer_en: "Half past seven.",
      },
    ],
    vocab: [
      { word: "ตื่นนอน", rtgs: "dtùen-naawn", en: "to wake up", vi: "thức dậy" },
      { word: "แปรงฟัน", rtgs: "bpraaeng-fan", en: "to brush teeth", vi: "đánh răng" },
      { word: "อาบน้ำ", rtgs: "àap-náam", en: "to shower/bathe", vi: "tắm" },
      { word: "ครึ่ง", rtgs: "khrûeng", en: "half", vi: "nửa / rưỡi" },
    ],
  },
  {
    id: "thai_read_a1_pet",
    level: "A1",
    topic: "pets",
    title_vi: "Con mèo của tôi",
    title_en: "My cat",
    passage_th:
      "ฉันมีแมวหนึ่งตัว มันชื่อมีมี่ มันสีขาว มันชอบนอนและกินปลา ฉันรักมันมาก",
    romanization:
      "chǎn mii maaeo nùeng dtua. man chûe mii-mîi. man sǐi khǎao. man châawp naawn láe gin bplaa. chǎn rák man mâak.",
    translation_vi:
      "Tôi có một con mèo. Nó tên Mimi. Nó màu trắng. Nó thích ngủ và ăn cá. Tôi rất yêu nó.",
    translation_en:
      "I have one cat. Its name is Mimi. It is white. It likes to sleep and eat fish. I love it very much.",
    notes_vi:
      "Loại từ động vật là 'ตัว': แมวหนึ่งตัว = một con mèo. Màu sắc: 'สี (sǐi) + màu', สีขาว = màu trắng.",
    notes_en:
      "The animal classifier is 'ตัว': แมวหนึ่งตัว = one cat. Colours: 'สี (sǐi) + colour', สีขาว = white.",
    questions: [
      {
        q_th: "แมวสีอะไร",
        q_vi: "Con mèo màu gì?",
        q_en: "What colour is the cat?",
        answer_th: "สีขาว",
        answer_vi: "Màu trắng.",
        answer_en: "White.",
      },
      {
        q_th: "แมวชอบกินอะไร",
        q_vi: "Con mèo thích ăn gì?",
        q_en: "What does the cat like to eat?",
        answer_th: "ปลา",
        answer_vi: "Cá.",
        answer_en: "Fish.",
      },
    ],
    vocab: [
      { word: "แมว", rtgs: "maaeo", en: "cat", vi: "con mèo" },
      { word: "สีขาว", rtgs: "sǐi khǎao", en: "white", vi: "màu trắng" },
      { word: "ปลา", rtgs: "bplaa", en: "fish", vi: "cá" },
      { word: "นอน", rtgs: "naawn", en: "to sleep", vi: "ngủ" },
    ],
  },
  {
    id: "thai_read_a1_weather",
    level: "A1",
    topic: "weather",
    title_vi: "Thời tiết hôm nay",
    title_en: "Today's weather",
    passage_th:
      "วันนี้อากาศร้อนมาก ท้องฟ้าแจ่มใส ฉันดื่มน้ำเย็น ตอนบ่ายฝนตก ฉันอยู่ในบ้าน",
    romanization:
      "wan-níi aa-gàat ráawn mâak. tháawng-fáa jàem-sǎi. chǎn dùem náam yen. dtaawn-bàai fǒn dtòk. chǎn yùu nai bâan.",
    translation_vi:
      "Hôm nay trời rất nóng. Bầu trời quang đãng. Tôi uống nước mát. Buổi chiều trời mưa. Tôi ở trong nhà.",
    translation_en:
      "Today it is very hot. The sky is clear. I drink cold water. In the afternoon it rains. I stay inside the house.",
    notes_vi:
      "'อากาศ (aa-gàat)' = thời tiết/không khí. 'ฝนตก (fǒn dtòk)' = mưa (nghĩa đen 'mưa rơi'). 'ใน (nai)' = trong.",
    notes_en:
      "'อากาศ (aa-gàat)' = weather/air. 'ฝนตก (fǒn dtòk)' = it rains (lit. 'rain falls'). 'ใน (nai)' = inside.",
    questions: [
      {
        q_th: "วันนี้อากาศเป็นอย่างไร",
        q_vi: "Hôm nay thời tiết thế nào?",
        q_en: "How is the weather today?",
        answer_th: "ร้อนมาก",
        answer_vi: "Rất nóng.",
        answer_en: "Very hot.",
      },
      {
        q_th: "ตอนบ่ายเกิดอะไรขึ้น",
        q_vi: "Buổi chiều có chuyện gì?",
        q_en: "What happens in the afternoon?",
        answer_th: "ฝนตก",
        answer_vi: "Trời mưa.",
        answer_en: "It rains.",
      },
    ],
    vocab: [
      { word: "อากาศ", rtgs: "aa-gàat", en: "weather", vi: "thời tiết" },
      { word: "ร้อน", rtgs: "ráawn", en: "hot", vi: "nóng" },
      { word: "ฝนตก", rtgs: "fǒn dtòk", en: "to rain", vi: "mưa" },
      { word: "ใน", rtgs: "nai", en: "in / inside", vi: "trong" },
    ],
  },
];

// ── A2 — everyday narratives ────────────────────────────────────────────────

const a2: ThaiReadingPassage[] = [
  {
    id: "thai_read_a2_market",
    level: "A2",
    topic: "shopping",
    title_vi: "Đi chợ",
    title_en: "Going to the market",
    passage_th:
      "เมื่อเช้าฉันไปตลาดกับแม่ เราซื้อผัก ผลไม้ และปลา ผักที่นี่สดและถูก แม่ต่อราคากับแม่ค้า แล้วเรากลับบ้านโดยรถเมล์",
    romanization:
      "mûea-cháo chǎn bpai dtà-làat gàp mâae. rao súe phàk, phǒn-lá-mái, láe bplaa. phàk thîi-nîi sòt láe thùuk. mâae dtàaw raa-khaa gàp mâae-kháa. láeo rao glàp bâan dooy rót-mee.",
    translation_vi:
      "Sáng nay tôi đi chợ với mẹ. Chúng tôi mua rau, trái cây và cá. Rau ở đây tươi và rẻ. Mẹ mặc cả với người bán. Rồi chúng tôi về nhà bằng xe buýt.",
    translation_en:
      "This morning I went to the market with my mother. We bought vegetables, fruit, and fish. The vegetables here are fresh and cheap. My mother bargained with the vendor. Then we went home by bus.",
    notes_vi:
      "'เมื่อเช้า' = sáng nay (quá khứ trong ngày). 'ต่อราคา (dtàaw raa-khaa)' = mặc cả. 'โดย (dooy) + xe' = bằng phương tiện.",
    notes_en:
      "'เมื่อเช้า' = this morning (earlier today). 'ต่อราคา (dtàaw raa-khaa)' = to bargain. 'โดย (dooy) + vehicle' = by (transport).",
    questions: [
      {
        q_th: "พวกเขาซื้ออะไรบ้าง",
        q_vi: "Họ mua những gì?",
        q_en: "What did they buy?",
        answer_th: "ผัก ผลไม้ และปลา",
        answer_vi: "Rau, trái cây và cá.",
        answer_en: "Vegetables, fruit, and fish.",
      },
      {
        q_th: "กลับบ้านอย่างไร",
        q_vi: "Họ về nhà bằng gì?",
        q_en: "How did they get home?",
        answer_th: "โดยรถเมล์",
        answer_vi: "Bằng xe buýt.",
        answer_en: "By bus.",
      },
    ],
    vocab: [
      { word: "ตลาด", rtgs: "dtà-làat", en: "market", vi: "chợ" },
      { word: "สด", rtgs: "sòt", en: "fresh", vi: "tươi" },
      { word: "ต่อราคา", rtgs: "dtàaw raa-khaa", en: "to bargain", vi: "mặc cả" },
      { word: "แม่ค้า", rtgs: "mâae-kháa", en: "(female) vendor", vi: "người bán hàng (nữ)" },
    ],
  },
  {
    id: "thai_read_a2_weekend",
    level: "A2",
    topic: "leisure",
    title_vi: "Kế hoạch cuối tuần",
    title_en: "Weekend plan",
    passage_th:
      "สุดสัปดาห์นี้ฉันจะไปเที่ยวทะเลกับเพื่อน เราจะนั่งรถไปพัทยา เราอยากว่ายน้ำและกินอาหารทะเล ถ้าฝนตกเราจะดูหนังแทน",
    romanization:
      "sùt-sàp-daa níi chǎn jà bpai thîao thá-lee gàp phûean. rao jà nâng rót bpai phát-thá-yaa. rao yàak wâai-náam láe gin aa-hǎan-thá-lee. thâa fǒn dtòk rao jà duu nǎng thaaen.",
    translation_vi:
      "Cuối tuần này tôi sẽ đi chơi biển với bạn. Chúng tôi sẽ đi xe đến Pattaya. Chúng tôi muốn bơi và ăn hải sản. Nếu trời mưa thì chúng tôi sẽ xem phim thay vào đó.",
    translation_en:
      "This weekend I will go to the seaside with friends. We will take a car to Pattaya. We want to swim and eat seafood. If it rains, we will watch a movie instead.",
    notes_vi:
      "'จะ' báo tương lai (cả đoạn nói kế hoạch). 'ถ้า...(แล้ว)จะ (thâa … jà)' = nếu... thì sẽ. 'แทน (thaaen)' = thay vào đó.",
    notes_en:
      "'จะ' marks the future throughout. 'ถ้า…จะ (thâa … jà)' = if … then will. 'แทน (thaaen)' = instead.",
    questions: [
      {
        q_th: "พวกเขาจะไปที่ไหน",
        q_vi: "Họ sẽ đi đâu?",
        q_en: "Where will they go?",
        answer_th: "ไปพัทยา / ทะเล",
        answer_vi: "Đi Pattaya / biển.",
        answer_en: "To Pattaya / the sea.",
      },
      {
        q_th: "ถ้าฝนตกจะทำอะไร",
        q_vi: "Nếu mưa thì làm gì?",
        q_en: "What will they do if it rains?",
        answer_th: "ดูหนัง",
        answer_vi: "Xem phim.",
        answer_en: "Watch a movie.",
      },
    ],
    vocab: [
      { word: "สุดสัปดาห์", rtgs: "sùt-sàp-daa", en: "weekend", vi: "cuối tuần" },
      { word: "ทะเล", rtgs: "thá-lee", en: "sea", vi: "biển" },
      { word: "ว่ายน้ำ", rtgs: "wâai-náam", en: "to swim", vi: "bơi" },
      { word: "ถ้า", rtgs: "thâa", en: "if", vi: "nếu" },
    ],
  },
  {
    id: "thai_read_a2_commute",
    level: "A2",
    topic: "transport",
    title_vi: "Đi làm",
    title_en: "Commuting to work",
    passage_th:
      "ทุกวันฉันไปทำงานโดยรถไฟฟ้า ฉันออกจากบ้านเจ็ดโมงเช้า รถไฟฟ้าเร็วแต่คนเยอะมาก ฉันถึงที่ทำงานแปดโมง ตอนเย็นฉันกลับบ้านโดยรถเมล์เพราะถูกกว่า",
    romanization:
      "thúk wan chǎn bpai tham-ngaan dooy rót-fai-fáa. chǎn àawk jàak bâan jèt moong cháo. rót-fai-fáa reo dtàae khon yúh mâak. chǎn thǔeng thîi tham-ngaan bpàaet moong. dtaawn-yen chǎn glàp bâan dooy rót-mee phráw thùuk gwàa.",
    translation_vi:
      "Mỗi ngày tôi đi làm bằng tàu điện. Tôi rời nhà lúc 7 giờ sáng. Tàu điện nhanh nhưng rất đông người. Tôi đến chỗ làm lúc 8 giờ. Buổi tối tôi về nhà bằng xe buýt vì rẻ hơn.",
    translation_en:
      "Every day I go to work by skytrain. I leave home at 7 a.m. The skytrain is fast but very crowded. I reach work at 8. In the evening I go home by bus because it is cheaper.",
    notes_vi:
      "'แต่ (dtàae)' = nhưng; 'เพราะ (phráw)' = vì. So sánh hơn: 'ถูกกว่า' = rẻ hơn (tính từ + กว่า). 'คนเยอะ' = đông người.",
    notes_en:
      "'แต่ (dtàae)' = but; 'เพราะ (phráw)' = because. Comparative 'ถูกกว่า' = cheaper (adjective + กว่า). 'คนเยอะ' = crowded.",
    questions: [
      {
        q_th: "ตอนเช้าไปทำงานอย่างไร",
        q_vi: "Buổi sáng đi làm bằng gì?",
        q_en: "How does she get to work in the morning?",
        answer_th: "โดยรถไฟฟ้า",
        answer_vi: "Bằng tàu điện.",
        answer_en: "By skytrain.",
      },
      {
        q_th: "ทำไมตอนเย็นนั่งรถเมล์",
        q_vi: "Vì sao tối đi xe buýt?",
        q_en: "Why does she take the bus in the evening?",
        answer_th: "เพราะถูกกว่า",
        answer_vi: "Vì rẻ hơn.",
        answer_en: "Because it is cheaper.",
      },
    ],
    vocab: [
      { word: "รถไฟฟ้า", rtgs: "rót-fai-fáa", en: "skytrain", vi: "tàu điện" },
      { word: "เยอะ", rtgs: "yúh", en: "a lot / many", vi: "nhiều / đông" },
      { word: "เพราะ", rtgs: "phráw", en: "because", vi: "vì" },
      { word: "ถูกกว่า", rtgs: "thùuk gwàa", en: "cheaper", vi: "rẻ hơn" },
    ],
  },
  {
    id: "thai_read_a2_restaurant",
    level: "A2",
    topic: "food",
    title_vi: "Ở nhà hàng",
    title_en: "At a restaurant",
    passage_th:
      "เมื่อวานฉันไปร้านอาหารกับครอบครัว เราสั่งผัดไทย ต้มยำ และข้าวผัด อาหารอร่อยแต่เผ็ดไปหน่อย พนักงานบริการดีมาก เราจ่ายเงินห้าร้อยบาท",
    romanization:
      "mûea-waan chǎn bpai ráan-aa-hǎan gàp khrâawp-khrua. rao sàng phàt-thai, dtôm-yam, láe khâao-phàt. aa-hǎan à-ràauy dtàae phèt bpai nàauy. phá-nák-ngaan baaw-rí-gaan dii mâak. rao jàai ngern hâa-ráauy bàat.",
    translation_vi:
      "Hôm qua tôi đi nhà hàng với gia đình. Chúng tôi gọi pad thai, tom yum và cơm chiên. Đồ ăn ngon nhưng hơi cay. Nhân viên phục vụ rất tốt. Chúng tôi trả 500 baht.",
    translation_en:
      "Yesterday I went to a restaurant with my family. We ordered pad thai, tom yum, and fried rice. The food was tasty but a little too spicy. The staff served us very well. We paid 500 baht.",
    notes_vi:
      "'สั่ง (sàng)' = gọi/đặt món. 'เผ็ดไปหน่อย' = hơi cay quá ('ไป' = quá, 'หน่อย' = một chút). 'จ่ายเงิน' = trả tiền.",
    notes_en:
      "'สั่ง (sàng)' = to order. 'เผ็ดไปหน่อย' = a bit too spicy ('ไป' = too, 'หน่อย' = a little). 'จ่ายเงิน' = to pay.",
    questions: [
      {
        q_th: "พวกเขาสั่งอะไรบ้าง",
        q_vi: "Họ gọi những món gì?",
        q_en: "What did they order?",
        answer_th: "ผัดไทย ต้มยำ และข้าวผัด",
        answer_vi: "Pad thai, tom yum và cơm chiên.",
        answer_en: "Pad thai, tom yum, and fried rice.",
      },
      {
        q_th: "จ่ายเงินเท่าไหร่",
        q_vi: "Trả bao nhiêu tiền?",
        q_en: "How much did they pay?",
        answer_th: "ห้าร้อยบาท",
        answer_vi: "500 baht.",
        answer_en: "500 baht.",
      },
    ],
    vocab: [
      { word: "สั่ง", rtgs: "sàng", en: "to order", vi: "gọi món" },
      { word: "พนักงาน", rtgs: "phá-nák-ngaan", en: "staff / employee", vi: "nhân viên" },
      { word: "บริการ", rtgs: "baaw-rí-gaan", en: "service", vi: "phục vụ" },
      { word: "จ่ายเงิน", rtgs: "jàai ngern", en: "to pay", vi: "trả tiền" },
    ],
  },
  {
    id: "thai_read_a2_neighborhood",
    level: "A2",
    topic: "places",
    title_vi: "Khu phố của tôi",
    title_en: "My neighborhood",
    passage_th:
      "บ้านของฉันอยู่ในซอยเล็กๆ ใกล้บ้านมีร้านสะดวกซื้อและตลาด ตรงข้ามบ้านมีวัด ทุกเช้าฉันได้ยินเสียงพระสวดมนต์ ที่นี่เงียบและปลอดภัย",
    romanization:
      "bâan khǎawng chǎn yùu nai saauy lék-lék. glâi bâan mii ráan-sà-dùak-súe láe dtà-làat. dtrong-khâam bâan mii wát. thúk cháo chǎn dâai-yin sǐang phrá sùat-mon. thîi-nîi ngîap láe bplàawt-phai.",
    translation_vi:
      "Nhà tôi nằm trong một con hẻm nhỏ. Gần nhà có cửa hàng tiện lợi và chợ. Đối diện nhà có một ngôi chùa. Mỗi sáng tôi nghe tiếng các nhà sư tụng kinh. Ở đây yên tĩnh và an toàn.",
    translation_en:
      "My house is in a small lane. Near the house there is a convenience store and a market. Opposite the house there is a temple. Every morning I hear the monks chanting. It is quiet and safe here.",
    notes_vi:
      "'ซอย (saauy)' = hẻm/ngõ (rất phổ biến trong địa chỉ Thái). Lặp 'เล็กๆ' = nhỏ nhỏ. 'ได้ยิน (dâai-yin)' = nghe thấy.",
    notes_en:
      "'ซอย (saauy)' = a lane/side-street (ubiquitous in Thai addresses). Reduplicated 'เล็กๆ' = small. 'ได้ยิน (dâai-yin)' = to hear.",
    questions: [
      {
        q_th: "ตรงข้ามบ้านมีอะไร",
        q_vi: "Đối diện nhà có gì?",
        q_en: "What is opposite the house?",
        answer_th: "มีวัด",
        answer_vi: "Có một ngôi chùa.",
        answer_en: "A temple.",
      },
      {
        q_th: "ที่นี่เป็นอย่างไร",
        q_vi: "Nơi đây như thế nào?",
        q_en: "What is the area like?",
        answer_th: "เงียบและปลอดภัย",
        answer_vi: "Yên tĩnh và an toàn.",
        answer_en: "Quiet and safe.",
      },
    ],
    vocab: [
      { word: "ซอย", rtgs: "saauy", en: "lane / side-street", vi: "hẻm / ngõ" },
      { word: "วัด", rtgs: "wát", en: "temple", vi: "chùa" },
      { word: "เงียบ", rtgs: "ngîap", en: "quiet", vi: "yên tĩnh" },
      { word: "ปลอดภัย", rtgs: "bplàawt-phai", en: "safe", vi: "an toàn" },
    ],
  },
  {
    id: "thai_read_a2_clinic",
    level: "A2",
    topic: "health",
    title_vi: "Đi khám bệnh",
    title_en: "A visit to the clinic",
    passage_th:
      "เมื่อวานฉันไม่สบาย ฉันปวดหัวและเป็นไข้ ฉันจึงไปหาหมอที่คลินิก หมอบอกว่าฉันเป็นหวัด หมอให้ยามากินวันละสามครั้ง วันนี้ฉันรู้สึกดีขึ้น",
    romanization:
      "mûea-waan chǎn mâi sà-baai. chǎn bpùat-hǔa láe bpen khâi. chǎn jueng bpai hǎa mǎaw thîi khlee-ník. mǎaw bàawk wâa chǎn bpen wàt. mǎaw hâi yaa maa gin wan-lá sǎam khráng. wan-níi chǎn rúu-sùek dii khûen.",
    translation_vi:
      "Hôm qua tôi không khỏe. Tôi đau đầu và bị sốt. Vì vậy tôi đi khám bác sĩ ở phòng khám. Bác sĩ nói tôi bị cảm. Bác sĩ cho thuốc uống ngày ba lần. Hôm nay tôi thấy đỡ hơn.",
    translation_en:
      "Yesterday I was unwell. I had a headache and a fever. So I went to see a doctor at the clinic. The doctor said I had a cold. The doctor gave me medicine to take three times a day. Today I feel better.",
    notes_vi:
      "'จึง (jueng)' = vì vậy/nên (nối kết quả). 'บอกว่า (bàawk wâa)' = nói rằng. 'วันละสามครั้ง' = ba lần một ngày ('ละ' = mỗi).",
    notes_en:
      "'จึง (jueng)' = so/therefore (links a result). 'บอกว่า (bàawk wâa)' = to say that. 'วันละสามครั้ง' = three times a day ('ละ' = per).",
    questions: [
      {
        q_th: "เมื่อวานเป็นอะไร",
        q_vi: "Hôm qua bị làm sao?",
        q_en: "What was wrong yesterday?",
        answer_th: "ปวดหัวและเป็นไข้",
        answer_vi: "Đau đầu và sốt.",
        answer_en: "A headache and a fever.",
      },
      {
        q_th: "กินยาวันละกี่ครั้ง",
        q_vi: "Uống thuốc mấy lần một ngày?",
        q_en: "How many times a day is the medicine taken?",
        answer_th: "สามครั้ง",
        answer_vi: "Ba lần.",
        answer_en: "Three times.",
      },
    ],
    vocab: [
      { word: "ไม่สบาย", rtgs: "mâi sà-baai", en: "unwell / sick", vi: "không khỏe" },
      { word: "ปวดหัว", rtgs: "bpùat-hǔa", en: "headache", vi: "đau đầu" },
      { word: "เป็นหวัด", rtgs: "bpen wàt", en: "to have a cold", vi: "bị cảm" },
      { word: "ดีขึ้น", rtgs: "dii khûen", en: "better", vi: "đỡ hơn" },
    ],
  },
];

// ── B1 — connected narratives & opinions ────────────────────────────────────

const b1: ThaiReadingPassage[] = [
  {
    id: "thai_read_b1_chiangmai",
    level: "B1",
    topic: "travel",
    title_vi: "Chuyến đi Chiang Mai",
    title_en: "A trip to Chiang Mai",
    passage_th:
      "ปีที่แล้วฉันไปเที่ยวเชียงใหม่เป็นครั้งแรก เชียงใหม่อยู่ทางภาคเหนือของประเทศไทย อากาศที่นั่นเย็นสบายกว่ากรุงเทพ ฉันได้ไปวัดเก่าแก่หลายแห่งและชิมอาหารเหนือ สิ่งที่ฉันประทับใจที่สุดคือผู้คนที่เป็นมิตร ฉันหวังว่าจะได้กลับไปอีก",
    romanization:
      "bpii thîi-láeo chǎn bpai thîao chiang-mài bpen khráng-râaek. chiang-mài yùu thaang phâak-nǔea khǎawng bprà-thêet-thai. aa-gàat thîi-nân yen sà-baai gwàa grung-thêep. chǎn dâai bpai wát gào-gàae lǎai hàeng láe chim aa-hǎan nǔea. sìng thîi chǎn bprà-tháp-jai thîi-sùt khue phûu-khon thîi bpen mít. chǎn wǎng wâa jà dâai glàp bpai ìik.",
    translation_vi:
      "Năm ngoái tôi đi Chiang Mai lần đầu tiên. Chiang Mai nằm ở miền Bắc Thái Lan. Thời tiết ở đó mát mẻ dễ chịu hơn Bangkok. Tôi đã đến nhiều ngôi chùa cổ và nếm thử món ăn miền Bắc. Điều khiến tôi ấn tượng nhất là con người thân thiện. Tôi hy vọng sẽ được quay lại lần nữa.",
    translation_en:
      "Last year I visited Chiang Mai for the first time. Chiang Mai is in the north of Thailand. The weather there is cooler and more pleasant than Bangkok. I visited many old temples and tasted northern food. What impressed me most was the friendly people. I hope I will get to go back again.",
    notes_vi:
      "'สิ่งที่...คือ (sìng thîi … khue)' = 'điều mà... là' — mẫu mệnh đề quan hệ. 'ประทับใจ' = ấn tượng. 'หวังว่า' = hy vọng rằng.",
    notes_en:
      "'สิ่งที่…คือ (sìng thîi … khue)' = 'the thing that … is' — a relative-clause frame. 'ประทับใจ' = impressed. 'หวังว่า' = to hope that.",
    questions: [
      {
        q_th: "เชียงใหม่อยู่ภาคไหน",
        q_vi: "Chiang Mai ở miền nào?",
        q_en: "Which region is Chiang Mai in?",
        answer_th: "ภาคเหนือ",
        answer_vi: "Miền Bắc.",
        answer_en: "The north.",
      },
      {
        q_th: "อะไรที่ผู้เขียนประทับใจที่สุด",
        q_vi: "Điều gì khiến người viết ấn tượng nhất?",
        q_en: "What impressed the writer most?",
        answer_th: "ผู้คนที่เป็นมิตร",
        answer_vi: "Con người thân thiện.",
        answer_en: "The friendly people.",
      },
    ],
    vocab: [
      { word: "ภาคเหนือ", rtgs: "phâak-nǔea", en: "the north", vi: "miền Bắc" },
      { word: "เก่าแก่", rtgs: "gào-gàae", en: "ancient / old", vi: "cổ kính" },
      { word: "ประทับใจ", rtgs: "bprà-tháp-jai", en: "impressed", vi: "ấn tượng" },
      { word: "เป็นมิตร", rtgs: "bpen mít", en: "friendly", vi: "thân thiện" },
    ],
  },
  {
    id: "thai_read_b1_learning",
    level: "B1",
    topic: "education",
    title_vi: "Học tiếng Thái",
    title_en: "Learning Thai",
    passage_th:
      "ฉันเริ่มเรียนภาษาไทยเมื่อสองปีก่อน ตอนแรกฉันคิดว่ายากมากเพราะตัวอักษรไทยแตกต่างจากภาษาของฉัน สิ่งที่ยากที่สุดคือวรรณยุกต์ เพราะคำเดียวกันแต่เสียงต่างกันมีความหมายต่างกัน อย่างไรก็ตาม ถ้าฝึกทุกวันก็จะเก่งขึ้น ตอนนี้ฉันพูดกับคนไทยได้แล้ว",
    romanization:
      "chǎn rôem rian phaa-sǎa thai mûea sǎawng bpii gàawn. dtaawn-râaek chǎn khít wâa yâak mâak phráw dtua-àk-sǎawn thai dtàaek-dtàang jàak phaa-sǎa khǎawng chǎn. sìng thîi yâak thîi-sùt khue wan-ná-yúk, phráw kham diao-gan dtàae sǐang dtàang-gan mii khwaam-mǎai dtàang-gan. yàang-rai-gâaw-dtaam, thâa fùek thúk wan gâaw jà gèng khûen. dtaawn-níi chǎn phûut gàp khon thai dâai láeo.",
    translation_vi:
      "Tôi bắt đầu học tiếng Thái hai năm trước. Lúc đầu tôi thấy rất khó vì chữ Thái khác với ngôn ngữ của tôi. Điều khó nhất là thanh điệu, vì cùng một từ nhưng âm khác nhau lại có nghĩa khác nhau. Tuy nhiên, nếu luyện tập mỗi ngày thì sẽ giỏi lên. Bây giờ tôi đã nói chuyện được với người Thái.",
    translation_en:
      "I started learning Thai two years ago. At first I thought it was very hard because the Thai script differs from my language. The hardest thing is the tones, because the same word with a different pitch has a different meaning. However, if you practice every day you will improve. Now I can talk with Thai people.",
    notes_vi:
      "'อย่างไรก็ตาม (yàang-rai-gâaw-dtaam)' = tuy nhiên (nối ý đối lập, văn viết). 'ถ้า...ก็จะ (thâa … gâaw jà)' = nếu... thì sẽ. 'วรรณยุกต์' = thanh điệu.",
    notes_en:
      "'อย่างไรก็ตาม (yàang-rai-gâaw-dtaam)' = however (a written contrast connector). 'ถ้า…ก็จะ (thâa … gâaw jà)' = if … then will. 'วรรณยุกต์' = tone.",
    questions: [
      {
        q_th: "สิ่งที่ยากที่สุดคืออะไร",
        q_vi: "Điều khó nhất là gì?",
        q_en: "What is the hardest thing?",
        answer_th: "วรรณยุกต์ (เสียงวรรณยุกต์)",
        answer_vi: "Thanh điệu.",
        answer_en: "The tones.",
      },
      {
        q_th: "ทำอย่างไรจึงจะเก่งขึ้น",
        q_vi: "Làm thế nào để giỏi lên?",
        q_en: "How does one improve?",
        answer_th: "ฝึกทุกวัน",
        answer_vi: "Luyện tập mỗi ngày.",
        answer_en: "Practice every day.",
      },
    ],
    vocab: [
      { word: "ตัวอักษร", rtgs: "dtua-àk-sǎawn", en: "letter / script", vi: "chữ cái" },
      { word: "วรรณยุกต์", rtgs: "wan-ná-yúk", en: "tone (mark)", vi: "thanh điệu" },
      { word: "แตกต่าง", rtgs: "dtàaek-dtàang", en: "to differ", vi: "khác biệt" },
      { word: "อย่างไรก็ตาม", rtgs: "yàang-rai-gâaw-dtaam", en: "however", vi: "tuy nhiên" },
    ],
  },
  {
    id: "thai_read_b1_songkran",
    level: "B1",
    topic: "culture",
    title_vi: "Tết Songkran",
    title_en: "Songkran festival",
    passage_th:
      "สงกรานต์เป็นเทศกาลปีใหม่ของไทย จัดขึ้นในเดือนเมษายนทุกปี คนไทยจะสาดน้ำใส่กันเพื่อความสนุกและคลายร้อน นอกจากนี้ ผู้คนยังรดน้ำดำหัวผู้ใหญ่เพื่อแสดงความเคารพ หลายคนกลับบ้านเกิดเพื่ออยู่กับครอบครัว สงกรานต์จึงเป็นทั้งความสนุกและประเพณีที่มีความหมาย",
    romanization:
      "sǒng-graan bpen thêet-sà-gaan bpii-mài khǎawng thai, jàt khûen nai duean mee-sǎa-yon thúk bpii. khon thai jà sàat náam sài gan phûea khwaam sà-nùk láe khlaai ráawn. nâawk-jàak-níi, phûu-khon yang rót náam dam-hǔa phûu-yài phûea sà-daaeng khwaam khao-róp. lǎai khon glàp bâan-gòet phûea yùu gàp khrâawp-khrua. sǒng-graan jueng bpen tháng khwaam sà-nùk láe bprà-phee-nii thîi mii khwaam-mǎai.",
    translation_vi:
      "Songkran là lễ mừng năm mới của Thái Lan, được tổ chức vào tháng Tư hằng năm. Người Thái té nước vào nhau để vui và giải nhiệt. Ngoài ra, người ta còn rưới nước lên tay người lớn tuổi để tỏ lòng kính trọng. Nhiều người về quê để ở bên gia đình. Vì vậy Songkran vừa vui vừa là một phong tục giàu ý nghĩa.",
    translation_en:
      "Songkran is Thailand's New Year festival, held every April. Thai people splash water on each other for fun and to cool off. Besides this, people also pour water over elders' hands to show respect. Many return to their hometowns to be with family. So Songkran is both fun and a meaningful tradition.",
    notes_vi:
      "'นอกจากนี้ (nâawk-jàak-níi)' = ngoài ra (thêm ý). 'เพื่อ (phûea)' = để (mục đích). 'ทั้ง...และ (tháng … láe)' = vừa... vừa.",
    notes_en:
      "'นอกจากนี้ (nâawk-jàak-níi)' = besides this (adds a point). 'เพื่อ (phûea)' = in order to. 'ทั้ง…และ (tháng … láe)' = both … and.",
    questions: [
      {
        q_th: "สงกรานต์จัดในเดือนอะไร",
        q_vi: "Songkran tổ chức vào tháng nào?",
        q_en: "In which month is Songkran held?",
        answer_th: "เดือนเมษายน",
        answer_vi: "Tháng Tư.",
        answer_en: "April.",
      },
      {
        q_th: "รดน้ำดำหัวผู้ใหญ่เพื่ออะไร",
        q_vi: "Rưới nước lên người lớn tuổi để làm gì?",
        q_en: "Why pour water over elders?",
        answer_th: "เพื่อแสดงความเคารพ",
        answer_vi: "Để tỏ lòng kính trọng.",
        answer_en: "To show respect.",
      },
    ],
    vocab: [
      { word: "เทศกาล", rtgs: "thêet-sà-gaan", en: "festival", vi: "lễ hội" },
      { word: "สาดน้ำ", rtgs: "sàat náam", en: "to splash water", vi: "té nước" },
      { word: "เคารพ", rtgs: "khao-róp", en: "to respect", vi: "kính trọng" },
      { word: "ประเพณี", rtgs: "bprà-phee-nii", en: "tradition", vi: "phong tục" },
    ],
  },
  {
    id: "thai_read_b1_wfh",
    level: "B1",
    topic: "work",
    title_vi: "Làm việc tại nhà",
    title_en: "Working from home",
    passage_th:
      "ตั้งแต่ปีที่แล้ว ฉันเริ่มทำงานที่บ้าน การทำงานที่บ้านมีทั้งข้อดีและข้อเสีย ข้อดีคือฉันไม่ต้องเสียเวลาเดินทางและประหยัดเงิน แต่ข้อเสียคือบางครั้งฉันรู้สึกเหงาและไม่มีสมาธิ ฉันจึงต้องจัดตารางเวลาให้ดี เพื่อให้ทำงานได้อย่างมีประสิทธิภาพ",
    romanization:
      "dtâng-dtàae bpii thîi-láeo, chǎn rôem tham-ngaan thîi bâan. gaan tham-ngaan thîi bâan mii tháng khâaw-dii láe khâaw-sǐa. khâaw-dii khue chǎn mâi dtâawng sǐa wee-laa dern-thaang láe bprà-yàt ngern. dtàae khâaw-sǐa khue baang-khráng chǎn rúu-sùek ngǎo láe mâi mii sà-maa-thí. chǎn jueng dtâawng jàt dtaa-raang wee-laa hâi dii, phûea hâi tham-ngaan dâai yàang mii bprà-sìt-thí-phâap.",
    translation_vi:
      "Từ năm ngoái, tôi bắt đầu làm việc tại nhà. Làm việc ở nhà có cả ưu điểm và nhược điểm. Ưu điểm là tôi không phải mất thời gian đi lại và tiết kiệm tiền. Nhưng nhược điểm là đôi khi tôi thấy cô đơn và mất tập trung. Vì vậy tôi phải sắp xếp thời gian cho tốt để làm việc hiệu quả.",
    translation_en:
      "Since last year, I started working from home. Working from home has both advantages and disadvantages. The advantage is that I don't waste time commuting and I save money. But the disadvantage is that sometimes I feel lonely and can't concentrate. So I have to schedule my time well in order to work efficiently.",
    notes_vi:
      "'ตั้งแต่ (dtâng-dtàae)' = từ khi. 'ข้อดี/ข้อเสีย' = ưu/nhược điểm. 'เพื่อให้ (phûea hâi)' = để cho. 'ประสิทธิภาพ' = hiệu quả.",
    notes_en:
      "'ตั้งแต่ (dtâng-dtàae)' = since. 'ข้อดี/ข้อเสีย' = pros/cons. 'เพื่อให้ (phûea hâi)' = so that. 'ประสิทธิภาพ' = efficiency.",
    questions: [
      {
        q_th: "ข้อดีของการทำงานที่บ้านคืออะไร",
        q_vi: "Ưu điểm của làm việc tại nhà là gì?",
        q_en: "What is an advantage of working from home?",
        answer_th: "ไม่เสียเวลาเดินทางและประหยัดเงิน",
        answer_vi: "Không mất thời gian đi lại và tiết kiệm tiền.",
        answer_en: "No commute time and saving money.",
      },
      {
        q_th: "ข้อเสียคืออะไร",
        q_vi: "Nhược điểm là gì?",
        q_en: "What is a disadvantage?",
        answer_th: "เหงาและไม่มีสมาธิ",
        answer_vi: "Cô đơn và mất tập trung.",
        answer_en: "Loneliness and lack of concentration.",
      },
    ],
    vocab: [
      { word: "ข้อดี", rtgs: "khâaw-dii", en: "advantage", vi: "ưu điểm" },
      { word: "ข้อเสีย", rtgs: "khâaw-sǐa", en: "disadvantage", vi: "nhược điểm" },
      { word: "สมาธิ", rtgs: "sà-maa-thí", en: "concentration", vi: "sự tập trung" },
      { word: "ประสิทธิภาพ", rtgs: "bprà-sìt-thí-phâap", en: "efficiency", vi: "hiệu quả" },
    ],
  },
  {
    id: "thai_read_b1_movie",
    level: "B1",
    topic: "opinion",
    title_vi: "Bộ phim yêu thích",
    title_en: "A favorite movie",
    passage_th:
      "เมื่อสัปดาห์ก่อนฉันดูหนังไทยเรื่องหนึ่งที่เพื่อนแนะนำ หนังเล่าเรื่องครอบครัวที่ต้องต่อสู้กับความยากจน แม้เนื้อเรื่องจะเศร้า แต่ก็ให้ข้อคิดเกี่ยวกับความรักและความหวัง นักแสดงเล่นได้ดีจนฉันร้องไห้ ฉันคิดว่าหนังเรื่องนี้คุ้มค่าแก่การดู",
    romanization:
      "mûea sàp-daa gàawn chǎn duu nǎng thai rûeang nùeng thîi phûean náe-nam. nǎng lâo rûeang khrâawp-khrua thîi dtâawng dtàaw-sûu gàp khwaam yâak-jon. máae núea-rûeang jà sâo, dtàae gâaw hâi khâaw-khít gìao-gàp khwaam-rák láe khwaam-wǎng. nák-sà-daaeng lên dâai dii jon chǎn ráawng-hâi. chǎn khít wâa nǎng rûeang níi khúm-khâa gàae gaan duu.",
    translation_vi:
      "Tuần trước tôi xem một bộ phim Thái mà bạn giới thiệu. Phim kể về một gia đình phải vật lộn với cái nghèo. Dù nội dung buồn, nhưng cũng cho ta bài học về tình yêu và hy vọng. Diễn viên diễn hay đến mức tôi đã khóc. Tôi nghĩ bộ phim này đáng xem.",
    translation_en:
      "Last week I watched a Thai movie my friend recommended. The film tells the story of a family struggling with poverty. Although the plot is sad, it gives a lesson about love and hope. The actors performed so well that I cried. I think this movie is worth watching.",
    notes_vi:
      "'แม้...แต่ (máae … dtàae)' = dù... nhưng. 'จน (jon)' ở đây = 'đến mức'. 'คุ้มค่าแก่การ (khúm-khâa gàae gaan)' = đáng để (làm gì).",
    notes_en:
      "'แม้…แต่ (máae … dtàae)' = although … but. 'จน (jon)' here = 'to the point that'. 'คุ้มค่าแก่การ (khúm-khâa gàae gaan)' = worth (doing).",
    questions: [
      {
        q_th: "หนังเล่าเรื่องอะไร",
        q_vi: "Phim kể về điều gì?",
        q_en: "What is the film about?",
        answer_th: "ครอบครัวที่ต่อสู้กับความยากจน",
        answer_vi: "Một gia đình vật lộn với cái nghèo.",
        answer_en: "A family struggling with poverty.",
      },
      {
        q_th: "ผู้เขียนรู้สึกอย่างไรกับหนัง",
        q_vi: "Người viết cảm thấy thế nào về phim?",
        q_en: "How does the writer feel about the film?",
        answer_th: "คิดว่าคุ้มค่าแก่การดู",
        answer_vi: "Cho rằng đáng xem.",
        answer_en: "Thinks it is worth watching.",
      },
    ],
    vocab: [
      { word: "แนะนำ", rtgs: "náe-nam", en: "to recommend", vi: "giới thiệu" },
      { word: "ต่อสู้", rtgs: "dtàaw-sûu", en: "to struggle / fight", vi: "vật lộn / đấu tranh" },
      { word: "ความยากจน", rtgs: "khwaam yâak-jon", en: "poverty", vi: "sự nghèo khó" },
      { word: "คุ้มค่า", rtgs: "khúm-khâa", en: "worthwhile", vi: "đáng giá" },
    ],
  },
  {
    id: "thai_read_b1_exercise",
    level: "B1",
    topic: "health",
    title_vi: "Sức khỏe và tập luyện",
    title_en: "Health and exercise",
    passage_th:
      "หลายคนในเมืองใหญ่ทำงานหนักจนไม่มีเวลาดูแลสุขภาพ ความจริงแล้ว การออกกำลังกายเพียงวันละสามสิบนาทีก็ช่วยให้ร่างกายแข็งแรงได้ นอกจากการออกกำลังกายแล้ว การกินอาหารที่มีประโยชน์และการนอนหลับให้เพียงพอก็สำคัญเช่นกัน ถ้าเราดูแลตัวเองตั้งแต่วันนี้ อนาคตเราก็จะมีสุขภาพที่ดี",
    romanization:
      "lǎai khon nai mueang yài tham-ngaan nàk jon mâi mii wee-laa duu-laae sùk-khà-phâap. khwaam-jing láeo, gaan àawk-gam-lang-gaai phiang wan-lá sǎam-sìp naa-thii gâaw chûay hâi râang-gaai khǎeng-raaeng dâai. nâawk-jàak gaan àawk-gam-lang-gaai láeo, gaan gin aa-hǎan thîi mii bprà-yòot láe gaan naawn-làp hâi phiang-phaaw gâaw sǎm-khan chên-gan. thâa rao duu-laae dtua-eeng dtâng-dtàae wan-níi, à-naa-khót rao gâaw jà mii sùk-khà-phâap thîi dii.",
    translation_vi:
      "Nhiều người ở thành phố lớn làm việc vất vả đến mức không có thời gian chăm sóc sức khỏe. Thực ra, chỉ cần tập thể dục 30 phút mỗi ngày cũng giúp cơ thể khỏe mạnh. Ngoài việc tập luyện, ăn uống bổ dưỡng và ngủ đủ giấc cũng quan trọng không kém. Nếu chúng ta chăm sóc bản thân ngay từ hôm nay, tương lai sẽ có sức khỏe tốt.",
    translation_en:
      "Many people in big cities work so hard that they have no time to look after their health. In fact, exercising just thirty minutes a day helps keep the body strong. Besides exercise, eating nutritious food and getting enough sleep are equally important. If we take care of ourselves starting today, our future health will be good.",
    notes_vi:
      "'ความจริงแล้ว' = thực ra. 'เพียง (phiang)' = chỉ/chỉ cần. 'เช่นกัน (chên-gan)' = cũng vậy. 'จน (jon)' = đến mức.",
    notes_en:
      "'ความจริงแล้ว' = in fact. 'เพียง (phiang)' = only / just. 'เช่นกัน (chên-gan)' = likewise. 'จน (jon)' = to the point that.",
    questions: [
      {
        q_th: "ออกกำลังกายวันละกี่นาทีก็พอ",
        q_vi: "Tập bao nhiêu phút mỗi ngày là đủ?",
        q_en: "How many minutes a day is enough?",
        answer_th: "สามสิบนาที",
        answer_vi: "30 phút.",
        answer_en: "Thirty minutes.",
      },
      {
        q_th: "นอกจากออกกำลังกาย อะไรสำคัญอีก",
        q_vi: "Ngoài tập luyện, điều gì còn quan trọng?",
        q_en: "Besides exercise, what else matters?",
        answer_th: "กินอาหารมีประโยชน์และนอนให้พอ",
        answer_vi: "Ăn bổ dưỡng và ngủ đủ giấc.",
        answer_en: "Nutritious food and enough sleep.",
      },
    ],
    vocab: [
      { word: "สุขภาพ", rtgs: "sùk-khà-phâap", en: "health", vi: "sức khỏe" },
      { word: "แข็งแรง", rtgs: "khǎeng-raaeng", en: "strong / healthy", vi: "khỏe mạnh" },
      { word: "ประโยชน์", rtgs: "bprà-yòot", en: "benefit / useful", vi: "lợi ích / bổ dưỡng" },
      { word: "เพียงพอ", rtgs: "phiang-phaaw", en: "enough", vi: "đủ" },
    ],
  },
];

// ── B2 — abstract / comparative (no whole-passage romanization) ─────────────

const b2: ThaiReadingPassage[] = [
  {
    id: "thai_read_b2_city_country",
    level: "B2",
    topic: "society",
    title_vi: "Thành thị và nông thôn",
    title_en: "City versus countryside",
    passage_th:
      "การย้ายถิ่นจากชนบทเข้าสู่เมืองใหญ่เป็นปรากฏการณ์ที่เกิดขึ้นทั่วโลก คนหนุ่มสาวจำนวนมากเดินทางเข้ากรุงเทพเพื่อหางานที่มีรายได้สูงกว่า อย่างไรก็ตาม ชีวิตในเมืองมีค่าใช้จ่ายสูงและการแข่งขันรุนแรง ในขณะที่ชีวิตในชนบทเรียบง่ายกว่าแต่โอกาสทางอาชีพมีจำกัด สุดท้ายแล้ว แต่ละคนต้องชั่งน้ำหนักระหว่างรายได้กับคุณภาพชีวิตด้วยตนเอง",
    translation_vi:
      "Việc di cư từ nông thôn vào các thành phố lớn là hiện tượng xảy ra khắp thế giới. Rất nhiều người trẻ đổ về Bangkok để tìm công việc có thu nhập cao hơn. Tuy nhiên, cuộc sống thành thị có chi phí cao và cạnh tranh khốc liệt, trong khi cuộc sống nông thôn giản dị hơn nhưng cơ hội nghề nghiệp lại hạn chế. Cuối cùng, mỗi người phải tự cân nhắc giữa thu nhập và chất lượng cuộc sống.",
    translation_en:
      "Migration from the countryside into big cities is a worldwide phenomenon. Many young people travel to Bangkok to find higher-paying work. However, city life has high costs and fierce competition, while rural life is simpler but career opportunities are limited. In the end, each person must weigh income against quality of life for themselves.",
    notes_vi:
      "Văn nghị luận B2: 'ในขณะที่ (nai khà-nà thîi)' = trong khi (đối chiếu); 'สุดท้ายแล้ว' = cuối cùng; 'ชั่งน้ำหนักระหว่าง...กับ' = cân nhắc giữa... và.",
    notes_en:
      "B2 argumentation: 'ในขณะที่ (nai khà-nà thîi)' = while (contrast); 'สุดท้ายแล้ว' = ultimately; 'ชั่งน้ำหนักระหว่าง…กับ' = to weigh … against.",
    questions: [
      {
        q_th: "ทำไมคนหนุ่มสาวเข้ากรุงเทพ",
        q_vi: "Vì sao người trẻ vào Bangkok?",
        q_en: "Why do young people move to Bangkok?",
        answer_th: "เพื่อหางานที่มีรายได้สูงกว่า",
        answer_vi: "Để tìm việc thu nhập cao hơn.",
        answer_en: "To find higher-paying work.",
      },
      {
        q_th: "ข้อเสียของชีวิตในเมืองคืออะไร",
        q_vi: "Nhược điểm của cuộc sống thành thị?",
        q_en: "What is a downside of city life?",
        answer_th: "ค่าใช้จ่ายสูงและการแข่งขันรุนแรง",
        answer_vi: "Chi phí cao và cạnh tranh khốc liệt.",
        answer_en: "High costs and fierce competition.",
      },
    ],
    vocab: [
      { word: "ย้ายถิ่น", rtgs: "yáai thìn", en: "to migrate", vi: "di cư" },
      { word: "ปรากฏการณ์", rtgs: "bpraa-gòt-gaan", en: "phenomenon", vi: "hiện tượng" },
      { word: "การแข่งขัน", rtgs: "gaan khàeng-khǎn", en: "competition", vi: "sự cạnh tranh" },
      { word: "คุณภาพชีวิต", rtgs: "khun-ná-phâap chii-wít", en: "quality of life", vi: "chất lượng cuộc sống" },
    ],
  },
  {
    id: "thai_read_b2_technology",
    level: "B2",
    topic: "technology",
    title_vi: "Công nghệ và xã hội",
    title_en: "Technology and society",
    passage_th:
      "เทคโนโลยีดิจิทัลได้เปลี่ยนวิธีที่ผู้คนสื่อสารและทำงานอย่างสิ้นเชิง สมาร์ทโฟนทำให้เราเข้าถึงข้อมูลได้ทันที และช่วยให้การทำงานสะดวกขึ้น แต่ในขณะเดียวกัน หลายคนกลับเสพติดหน้าจอจนละเลยความสัมพันธ์กับคนรอบข้าง ดังนั้น การใช้เทคโนโลยีอย่างมีสติจึงเป็นทักษะที่สำคัญในยุคปัจจุบัน",
    translation_vi:
      "Công nghệ số đã thay đổi hoàn toàn cách con người giao tiếp và làm việc. Điện thoại thông minh giúp ta tiếp cận thông tin tức thì và làm cho công việc thuận tiện hơn. Nhưng đồng thời, nhiều người lại nghiện màn hình đến mức bỏ bê các mối quan hệ với người xung quanh. Vì vậy, sử dụng công nghệ một cách có ý thức là một kỹ năng quan trọng trong thời đại ngày nay.",
    translation_en:
      "Digital technology has completely changed how people communicate and work. Smartphones let us access information instantly and make work more convenient. But at the same time, many people become addicted to screens to the point of neglecting their relationships with those around them. Therefore, using technology mindfully is an important skill in today's era.",
    notes_vi:
      "'อย่างสิ้นเชิง' = hoàn toàn. 'ในขณะเดียวกัน' = đồng thời. 'ดังนั้น (dang-nán)' = vì vậy (kết luận). 'อย่างมีสติ' = một cách có ý thức.",
    notes_en:
      "'อย่างสิ้นเชิง' = completely. 'ในขณะเดียวกัน' = at the same time. 'ดังนั้น (dang-nán)' = therefore (conclusion). 'อย่างมีสติ' = mindfully.",
    questions: [
      {
        q_th: "สมาร์ทโฟนมีประโยชน์อย่างไร",
        q_vi: "Điện thoại thông minh có lợi ích gì?",
        q_en: "How are smartphones beneficial?",
        answer_th: "เข้าถึงข้อมูลได้ทันทีและทำงานสะดวกขึ้น",
        answer_vi: "Tiếp cận thông tin tức thì và làm việc thuận tiện hơn.",
        answer_en: "Instant information access and more convenient work.",
      },
      {
        q_th: "ผู้เขียนแนะนำให้ใช้เทคโนโลยีอย่างไร",
        q_vi: "Người viết khuyên dùng công nghệ thế nào?",
        q_en: "How does the writer suggest using technology?",
        answer_th: "อย่างมีสติ",
        answer_vi: "Một cách có ý thức.",
        answer_en: "Mindfully.",
      },
    ],
    vocab: [
      { word: "เทคโนโลยี", rtgs: "thék-noo-loo-yii", en: "technology", vi: "công nghệ" },
      { word: "สื่อสาร", rtgs: "sùe-sǎan", en: "to communicate", vi: "giao tiếp" },
      { word: "เสพติด", rtgs: "sèep-dtìt", en: "to be addicted", vi: "nghiện" },
      { word: "ความสัมพันธ์", rtgs: "khwaam sǎm-phan", en: "relationship", vi: "mối quan hệ" },
    ],
  },
  {
    id: "thai_read_b2_plastic",
    level: "B2",
    topic: "environment",
    title_vi: "Rác thải nhựa",
    title_en: "Plastic waste",
    passage_th:
      "ปัญหาขยะพลาสติกกลายเป็นวิกฤตสิ่งแวดล้อมที่ร้ายแรงขึ้นทุกปี ถุงพลาสติกและขวดน้ำที่ใช้เพียงครั้งเดียวต้องใช้เวลาหลายร้อยปีกว่าจะย่อยสลาย ขยะเหล่านี้จำนวนมากไหลลงสู่ทะเลและเป็นอันตรายต่อสัตว์น้ำ แม้รัฐบาลจะรณรงค์ให้ลดการใช้พลาสติก แต่ความร่วมมือจากประชาชนทุกคนคือกุญแจสำคัญที่สุด",
    translation_vi:
      "Vấn đề rác thải nhựa đã trở thành một cuộc khủng hoảng môi trường ngày càng nghiêm trọng. Túi nilon và chai nước dùng một lần phải mất hàng trăm năm mới phân hủy. Phần lớn lượng rác này trôi ra biển và gây nguy hại cho sinh vật biển. Dù chính phủ vận động giảm sử dụng nhựa, nhưng sự hợp tác của toàn thể người dân mới là chìa khóa quan trọng nhất.",
    translation_en:
      "The problem of plastic waste has become an environmental crisis that grows more serious every year. Single-use plastic bags and water bottles take hundreds of years to decompose. Much of this waste flows into the sea and harms marine life. Although the government campaigns to reduce plastic use, cooperation from every citizen is the most important key.",
    notes_vi:
      "'กลายเป็น (glaai bpen)' = trở thành. 'กว่าจะ (gwàa jà)' = (mất...) mới. 'แม้...แต่' = dù... nhưng. 'กุญแจสำคัญ' = chìa khóa quan trọng.",
    notes_en:
      "'กลายเป็น (glaai bpen)' = to become. 'กว่าจะ (gwàa jà)' = before/until (it takes … to). 'แม้…แต่' = although … but. 'กุญแจสำคัญ' = the key.",
    questions: [
      {
        q_th: "พลาสติกใช้เวลาเท่าไหร่กว่าจะย่อยสลาย",
        q_vi: "Nhựa mất bao lâu để phân hủy?",
        q_en: "How long does plastic take to decompose?",
        answer_th: "หลายร้อยปี",
        answer_vi: "Hàng trăm năm.",
        answer_en: "Hundreds of years.",
      },
      {
        q_th: "อะไรคือกุญแจสำคัญที่สุด",
        q_vi: "Điều gì là chìa khóa quan trọng nhất?",
        q_en: "What is the most important key?",
        answer_th: "ความร่วมมือจากประชาชน",
        answer_vi: "Sự hợp tác của người dân.",
        answer_en: "Cooperation from citizens.",
      },
    ],
    vocab: [
      { word: "ขยะ", rtgs: "khà-yà", en: "garbage / waste", vi: "rác" },
      { word: "สิ่งแวดล้อม", rtgs: "sìng-wâaet-láawm", en: "environment", vi: "môi trường" },
      { word: "ย่อยสลาย", rtgs: "yâauy-sà-lǎai", en: "to decompose", vi: "phân hủy" },
      { word: "รณรงค์", rtgs: "ron-ná-rong", en: "to campaign", vi: "vận động" },
    ],
  },
  {
    id: "thai_read_b2_education",
    level: "B2",
    topic: "education",
    title_vi: "Giáo dục đang thay đổi",
    title_en: "Changing education",
    passage_th:
      "ระบบการศึกษาแบบเดิมที่เน้นการท่องจำกำลังถูกตั้งคำถามมากขึ้น ในโลกที่ข้อมูลเปลี่ยนแปลงอย่างรวดเร็ว ทักษะการคิดวิเคราะห์และการแก้ปัญหาจึงมีค่ามากกว่าการจดจำข้อเท็จจริง นักการศึกษาหลายคนเสนอว่าโรงเรียนควรส่งเสริมให้ผู้เรียนตั้งคำถามและเรียนรู้ด้วยตนเอง มากกว่าการรับความรู้แบบทางเดียวจากครู",
    translation_vi:
      "Hệ thống giáo dục truyền thống chú trọng học thuộc lòng đang ngày càng bị đặt câu hỏi. Trong một thế giới mà thông tin thay đổi nhanh chóng, kỹ năng tư duy phân tích và giải quyết vấn đề có giá trị hơn việc ghi nhớ sự kiện. Nhiều nhà giáo dục đề xuất rằng nhà trường nên khuyến khích người học đặt câu hỏi và tự học, thay vì tiếp nhận kiến thức một chiều từ giáo viên.",
    translation_en:
      "The traditional education system that emphasizes memorization is increasingly being questioned. In a world where information changes rapidly, analytical thinking and problem-solving skills are more valuable than memorizing facts. Many educators propose that schools should encourage learners to ask questions and learn independently, rather than receiving knowledge one-way from teachers.",
    notes_vi:
      "'ถูกตั้งคำถาม' = bị đặt câu hỏi (thể bị động với 'ถูก'). 'มากกว่า (mâak gwàa)' = hơn. 'แบบทางเดียว' = một chiều.",
    notes_en:
      "'ถูกตั้งคำถาม' = being questioned (passive with 'ถูก'). 'มากกว่า (mâak gwàa)' = more than. 'แบบทางเดียว' = one-way.",
    questions: [
      {
        q_th: "ทักษะอะไรมีค่ามากกว่าการท่องจำ",
        q_vi: "Kỹ năng nào giá trị hơn học thuộc?",
        q_en: "Which skills are more valuable than memorization?",
        answer_th: "การคิดวิเคราะห์และการแก้ปัญหา",
        answer_vi: "Tư duy phân tích và giải quyết vấn đề.",
        answer_en: "Analytical thinking and problem-solving.",
      },
      {
        q_th: "นักการศึกษาเสนอให้โรงเรียนทำอะไร",
        q_vi: "Nhà giáo dục đề xuất nhà trường làm gì?",
        q_en: "What do educators propose schools do?",
        answer_th: "ส่งเสริมให้ผู้เรียนตั้งคำถามและเรียนรู้ด้วยตนเอง",
        answer_vi: "Khuyến khích người học đặt câu hỏi và tự học.",
        answer_en: "Encourage learners to question and learn independently.",
      },
    ],
    vocab: [
      { word: "การศึกษา", rtgs: "gaan-sùek-sǎa", en: "education", vi: "giáo dục" },
      { word: "ท่องจำ", rtgs: "thâawng-jam", en: "to memorize", vi: "học thuộc lòng" },
      { word: "วิเคราะห์", rtgs: "wí-khráw", en: "to analyze", vi: "phân tích" },
      { word: "ส่งเสริม", rtgs: "sòng-sǒem", en: "to promote / encourage", vi: "khuyến khích" },
    ],
  },
  {
    id: "thai_read_b2_tourism",
    level: "B2",
    topic: "tourism",
    title_vi: "Tác động của du lịch",
    title_en: "The impact of tourism",
    passage_th:
      "การท่องเที่ยวเป็นแหล่งรายได้สำคัญของประเทศไทย และสร้างงานให้แก่ผู้คนจำนวนมาก อย่างไรก็ตาม การท่องเที่ยวที่ขยายตัวเร็วเกินไปก็ส่งผลกระทบต่อสิ่งแวดล้อมและวิถีชีวิตท้องถิ่น เกาะบางแห่งเผชิญปัญหาขยะล้นและปะการังเสื่อมโทรม ด้วยเหตุนี้ แนวคิดการท่องเที่ยวอย่างยั่งยืนจึงได้รับความสนใจมากขึ้น เพื่อรักษาสมดุลระหว่างเศรษฐกิจกับธรรมชาติ",
    translation_vi:
      "Du lịch là nguồn thu nhập quan trọng của Thái Lan và tạo việc làm cho rất nhiều người. Tuy nhiên, du lịch phát triển quá nhanh cũng gây tác động đến môi trường và lối sống địa phương. Một số hòn đảo đối mặt với tình trạng quá tải rác và san hô suy thoái. Vì lý do này, ý tưởng du lịch bền vững ngày càng được quan tâm, nhằm giữ cân bằng giữa kinh tế và thiên nhiên.",
    translation_en:
      "Tourism is an important source of income for Thailand and creates jobs for many people. However, tourism that expands too quickly also affects the environment and local ways of life. Some islands face overflowing waste and degraded coral reefs. For this reason, the idea of sustainable tourism is receiving more attention, in order to keep a balance between the economy and nature.",
    notes_vi:
      "'ส่งผลกระทบต่อ' = gây tác động đến. 'ด้วยเหตุนี้' = vì lý do này. 'อย่างยั่งยืน' = bền vững. 'สมดุลระหว่าง...กับ' = cân bằng giữa... và.",
    notes_en:
      "'ส่งผลกระทบต่อ' = to affect / impact. 'ด้วยเหตุนี้' = for this reason. 'อย่างยั่งยืน' = sustainably. 'สมดุลระหว่าง…กับ' = balance between … and.",
    questions: [
      {
        q_th: "การท่องเที่ยวส่งผลดีอย่างไร",
        q_vi: "Du lịch có tác động tốt gì?",
        q_en: "What positive impact does tourism have?",
        answer_th: "เป็นแหล่งรายได้และสร้างงาน",
        answer_vi: "Là nguồn thu nhập và tạo việc làm.",
        answer_en: "It is an income source and creates jobs.",
      },
      {
        q_th: "แนวคิดใดได้รับความสนใจมากขึ้น",
        q_vi: "Ý tưởng nào ngày càng được quan tâm?",
        q_en: "Which idea is gaining attention?",
        answer_th: "การท่องเที่ยวอย่างยั่งยืน",
        answer_vi: "Du lịch bền vững.",
        answer_en: "Sustainable tourism.",
      },
    ],
    vocab: [
      { word: "การท่องเที่ยว", rtgs: "gaan-thâawng-thîao", en: "tourism", vi: "du lịch" },
      { word: "ผลกระทบ", rtgs: "phǒn-grà-thóp", en: "impact", vi: "tác động" },
      { word: "ยั่งยืน", rtgs: "yâng-yuen", en: "sustainable", vi: "bền vững" },
      { word: "สมดุล", rtgs: "sà-mà-dun", en: "balance", vi: "cân bằng" },
    ],
  },
  {
    id: "thai_read_b2_worklife",
    level: "B2",
    topic: "work",
    title_vi: "Cân bằng công việc – cuộc sống",
    title_en: "Work-life balance",
    passage_th:
      "ในสังคมที่ให้คุณค่ากับความสำเร็จ หลายคนทุ่มเทเวลาให้กับงานจนละเลยสุขภาพและครอบครัว การทำงานหนักเกินไปอาจนำไปสู่ภาวะหมดไฟ ซึ่งส่งผลเสียทั้งต่อร่างกายและจิตใจ ผู้เชี่ยวชาญแนะนำว่าการกำหนดขอบเขตที่ชัดเจนระหว่างเวลางานกับเวลาส่วนตัวเป็นสิ่งจำเป็น เพราะความสมดุลที่ดีไม่เพียงทำให้มีความสุข แต่ยังเพิ่มประสิทธิภาพในการทำงานด้วย",
    translation_vi:
      "Trong một xã hội đề cao thành công, nhiều người dồn thời gian cho công việc đến mức bỏ bê sức khỏe và gia đình. Làm việc quá sức có thể dẫn đến tình trạng kiệt sức, gây hại cho cả thể chất lẫn tinh thần. Các chuyên gia khuyên rằng việc đặt ra ranh giới rõ ràng giữa thời gian làm việc và thời gian cá nhân là điều cần thiết, vì sự cân bằng tốt không chỉ mang lại hạnh phúc mà còn tăng hiệu quả công việc.",
    translation_en:
      "In a society that values success, many people pour their time into work to the point of neglecting health and family. Overworking can lead to burnout, which harms both body and mind. Experts advise that setting clear boundaries between work time and personal time is essential, because good balance not only brings happiness but also increases work efficiency.",
    notes_vi:
      "'นำไปสู่ (nam bpai sùu)' = dẫn đến. 'ภาวะหมดไฟ' = kiệt sức (burnout). 'ไม่เพียง...แต่ยัง...ด้วย' = không chỉ... mà còn.",
    notes_en:
      "'นำไปสู่ (nam bpai sùu)' = to lead to. 'ภาวะหมดไฟ' = burnout. 'ไม่เพียง…แต่ยัง…ด้วย' = not only … but also.",
    questions: [
      {
        q_th: "การทำงานหนักเกินไปอาจนำไปสู่อะไร",
        q_vi: "Làm việc quá sức có thể dẫn đến gì?",
        q_en: "What can overworking lead to?",
        answer_th: "ภาวะหมดไฟ",
        answer_vi: "Tình trạng kiệt sức.",
        answer_en: "Burnout.",
      },
      {
        q_th: "ผู้เชี่ยวชาญแนะนำอะไร",
        q_vi: "Chuyên gia khuyên điều gì?",
        q_en: "What do experts advise?",
        answer_th: "กำหนดขอบเขตระหว่างเวลางานกับเวลาส่วนตัว",
        answer_vi: "Đặt ranh giới giữa thời gian làm việc và cá nhân.",
        answer_en: "Set boundaries between work and personal time.",
      },
    ],
    vocab: [
      { word: "ทุ่มเท", rtgs: "thûm-thee", en: "to devote", vi: "dồn / cống hiến" },
      { word: "ภาวะหมดไฟ", rtgs: "phaa-wá mòt-fai", en: "burnout", vi: "kiệt sức" },
      { word: "ขอบเขต", rtgs: "khàawp-khèet", en: "boundary", vi: "ranh giới" },
      { word: "จำเป็น", rtgs: "jam-bpen", en: "necessary", vi: "cần thiết" },
    ],
  },
];

// ── C1 — academic study support (native review deferred) ────────────────────

const c1: ThaiReadingPassage[] = [
  {
    id: "thai_read_c1_urbanization",
    level: "C1",
    topic: "urban_studies",
    title_vi: "Đô thị hóa ở Bangkok",
    title_en: "Urbanization in Bangkok",
    passage_th:
      "กรุงเทพมหานครเติบโตขึ้นอย่างรวดเร็วจนกลายเป็นมหานครที่มีประชากรหนาแน่นที่สุดแห่งหนึ่งในภูมิภาค การขยายตัวของเมืองโดยปราศจากการวางผังที่รัดกุมก่อให้เกิดปัญหาเรื้อรัง ทั้งการจราจรที่ติดขัด มลพิษทางอากาศ และความเหลื่อมล้ำด้านที่อยู่อาศัย แม้จะมีความพยายามในการพัฒนาระบบขนส่งมวลชน แต่การแก้ไขปัญหาเชิงโครงสร้างยังคงล่าช้า นักวิชาการชี้ว่าหากปราศจากนโยบายที่บูรณาการอย่างแท้จริง คุณภาพชีวิตของคนเมืองก็ยากที่จะดีขึ้นอย่างยั่งยืน",
    translation_vi:
      "Bangkok tăng trưởng nhanh đến mức trở thành một trong những đô thị có mật độ dân số cao nhất khu vực. Sự mở rộng đô thị thiếu quy hoạch chặt chẽ đã gây ra những vấn đề kinh niên: kẹt xe, ô nhiễm không khí và bất bình đẳng về nhà ở. Dù đã có những nỗ lực phát triển hệ thống giao thông công cộng, việc giải quyết các vấn đề mang tính cấu trúc vẫn còn chậm trễ. Giới học giả chỉ ra rằng nếu thiếu một chính sách thực sự tích hợp, chất lượng sống của người dân đô thị khó có thể cải thiện một cách bền vững.",
    translation_en:
      "Bangkok has grown so rapidly that it has become one of the most densely populated metropolises in the region. Urban expansion without rigorous planning has produced chronic problems: traffic congestion, air pollution, and housing inequality. Although there have been efforts to develop mass transit, addressing structural problems remains slow. Scholars point out that without a genuinely integrated policy, the quality of life of urban residents is unlikely to improve sustainably.",
    notes_vi:
      "Văn học thuật C1 (hỗ trợ học tập, chưa qua kiểm định bản ngữ): 'โดยปราศจาก' = mà không có; 'ก่อให้เกิด' = gây ra; 'เชิงโครงสร้าง' = mang tính cấu trúc; 'บูรณาการ' = tích hợp.",
    notes_en:
      "C1 academic register (study support, native review deferred): 'โดยปราศจาก' = without; 'ก่อให้เกิด' = to give rise to; 'เชิงโครงสร้าง' = structural; 'บูรณาการ' = integrated.",
    questions: [
      {
        q_th: "การขยายตัวของเมืองก่อให้เกิดปัญหาอะไรบ้าง",
        q_vi: "Mở rộng đô thị gây ra những vấn đề gì?",
        q_en: "What problems does urban expansion cause?",
        answer_th: "การจราจรติดขัด มลพิษ และความเหลื่อมล้ำด้านที่อยู่อาศัย",
        answer_vi: "Kẹt xe, ô nhiễm và bất bình đẳng nhà ở.",
        answer_en: "Congestion, pollution, and housing inequality.",
      },
      {
        q_th: "นักวิชาการเห็นว่าต้องมีอะไรจึงจะแก้ปัญหาได้",
        q_vi: "Học giả cho rằng cần gì để giải quyết?",
        q_en: "What do scholars say is needed to solve it?",
        answer_th: "นโยบายที่บูรณาการอย่างแท้จริง",
        answer_vi: "Một chính sách thực sự tích hợp.",
        answer_en: "A genuinely integrated policy.",
      },
    ],
    vocab: [
      { word: "ประชากร", rtgs: "bprà-chaa-gaawn", en: "population", vi: "dân số" },
      { word: "ผังเมือง", rtgs: "phǎng mueang", en: "urban planning", vi: "quy hoạch đô thị" },
      { word: "ความเหลื่อมล้ำ", rtgs: "khwaam lùeam-lám", en: "inequality", vi: "bất bình đẳng" },
      { word: "บูรณาการ", rtgs: "buu-rá-naa-gaan", en: "to integrate", vi: "tích hợp" },
    ],
  },
  {
    id: "thai_read_c1_aging",
    level: "C1",
    topic: "demography",
    title_vi: "Xã hội già hóa",
    title_en: "An aging society",
    passage_th:
      "ประเทศไทยกำลังก้าวเข้าสู่สังคมผู้สูงอายุอย่างเต็มตัว อันเป็นผลจากอัตราการเกิดที่ลดลงและอายุขัยที่ยืนยาวขึ้น ปรากฏการณ์นี้สร้างแรงกดดันต่อระบบสวัสดิการและกำลังแรงงานของประเทศ เนื่องจากสัดส่วนของผู้ที่อยู่ในวัยทำงานลดลงอย่างต่อเนื่อง รัฐบาลจึงจำเป็นต้องเตรียมความพร้อมทั้งด้านระบบบำนาญ การดูแลสุขภาพ และการส่งเสริมให้ผู้สูงอายุยังคงมีส่วนร่วมในระบบเศรษฐกิจอย่างมีศักดิ์ศรี",
    translation_vi:
      "Thái Lan đang bước hẳn vào xã hội người cao tuổi, hệ quả của tỷ lệ sinh giảm và tuổi thọ kéo dài. Hiện tượng này tạo áp lực lên hệ thống phúc lợi và lực lượng lao động, vì tỷ lệ người trong độ tuổi lao động liên tục giảm. Do đó chính phủ buộc phải chuẩn bị cả về hệ thống lương hưu, chăm sóc sức khỏe, lẫn việc khuyến khích người cao tuổi tiếp tục tham gia vào nền kinh tế một cách có phẩm giá.",
    translation_en:
      "Thailand is fully entering an aging society, a consequence of declining birth rates and longer life expectancy. This phenomenon places pressure on the welfare system and the labor force, since the proportion of working-age people is continuously falling. The government must therefore prepare in terms of pension systems, healthcare, and encouraging the elderly to continue participating in the economy with dignity.",
    notes_vi:
      "C1 hỗ trợ học tập (chưa kiểm định bản ngữ): 'อันเป็นผลจาก' = hệ quả của; 'เนื่องจาก' = vì/do; 'จำเป็นต้อง' = buộc phải; 'อย่างมีศักดิ์ศรี' = một cách có phẩm giá.",
    notes_en:
      "C1 study support (native review deferred): 'อันเป็นผลจาก' = as a result of; 'เนื่องจาก' = because; 'จำเป็นต้อง' = must / be obliged to; 'อย่างมีศักดิ์ศรี' = with dignity.",
    questions: [
      {
        q_th: "อะไรเป็นสาเหตุของสังคมผู้สูงอายุ",
        q_vi: "Nguyên nhân của xã hội già hóa là gì?",
        q_en: "What causes the aging society?",
        answer_th: "อัตราการเกิดลดลงและอายุขัยยืนยาวขึ้น",
        answer_vi: "Tỷ lệ sinh giảm và tuổi thọ tăng.",
        answer_en: "Falling birth rates and longer life expectancy.",
      },
      {
        q_th: "รัฐบาลต้องเตรียมความพร้อมด้านใดบ้าง",
        q_vi: "Chính phủ cần chuẩn bị những mặt nào?",
        q_en: "What must the government prepare for?",
        answer_th: "ระบบบำนาญ การดูแลสุขภาพ และการมีส่วนร่วมของผู้สูงอายุ",
        answer_vi: "Lương hưu, chăm sóc sức khỏe và sự tham gia của người cao tuổi.",
        answer_en: "Pensions, healthcare, and elderly participation.",
      },
    ],
    vocab: [
      { word: "ผู้สูงอายุ", rtgs: "phûu-sǔung-aa-yú", en: "the elderly", vi: "người cao tuổi" },
      { word: "อัตราการเกิด", rtgs: "àt-dtraa gaan-gòet", en: "birth rate", vi: "tỷ lệ sinh" },
      { word: "สวัสดิการ", rtgs: "sà-wàt-dì-gaan", en: "welfare", vi: "phúc lợi" },
      { word: "บำนาญ", rtgs: "bam-naan", en: "pension", vi: "lương hưu" },
    ],
  },
  {
    id: "thai_read_c1_language_identity",
    level: "C1",
    topic: "linguistics",
    title_vi: "Ngôn ngữ và bản sắc",
    title_en: "Language and identity",
    passage_th:
      "ภาษาไม่ได้เป็นเพียงเครื่องมือสื่อสาร หากแต่เป็นส่วนสำคัญที่หล่อหลอมอัตลักษณ์ของชุมชน ในประเทศไทยมีภาษาถิ่นและภาษาของกลุ่มชาติพันธุ์หลากหลาย ซึ่งสะท้อนความหลากหลายทางวัฒนธรรมอันล้ำค่า อย่างไรก็ดี กระแสโลกาภิวัตน์และการครอบงำของภาษาที่มีอำนาจทำให้ภาษาเล็กๆ จำนวนมากเสี่ยงต่อการสูญหาย การธำรงรักษาภาษาเหล่านี้จึงมิใช่เพียงเรื่องของภาษาศาสตร์ แต่เป็นการปกป้องมรดกทางปัญญาของมนุษยชาติ",
    translation_vi:
      "Ngôn ngữ không chỉ là công cụ giao tiếp, mà còn là phần quan trọng định hình bản sắc của cộng đồng. Ở Thái Lan có nhiều phương ngữ và ngôn ngữ của các nhóm dân tộc, phản ánh sự đa dạng văn hóa quý giá. Tuy nhiên, làn sóng toàn cầu hóa và sự lấn át của các ngôn ngữ có quyền lực khiến nhiều ngôn ngữ nhỏ đứng trước nguy cơ biến mất. Vì vậy bảo tồn những ngôn ngữ này không chỉ là chuyện ngôn ngữ học, mà là việc bảo vệ di sản trí tuệ của nhân loại.",
    translation_en:
      "Language is not merely a tool of communication but a crucial part that shapes a community's identity. Thailand has many dialects and ethnic-group languages, reflecting precious cultural diversity. However, the tide of globalization and the dominance of powerful languages put many small languages at risk of disappearing. Preserving these languages is therefore not merely a matter of linguistics, but the protection of humanity's intellectual heritage.",
    notes_vi:
      "C1 hỗ trợ học tập (chưa kiểm định bản ngữ): 'ไม่ได้...หากแต่' = không phải... mà là; 'มิใช่เพียง...แต่' = không chỉ... mà; văn phong trang trọng dùng 'มิ' thay 'ไม่'.",
    notes_en:
      "C1 study support (native review deferred): 'ไม่ได้…หากแต่' = not … but rather; 'มิใช่เพียง…แต่' = not merely … but; formal register uses 'มิ' for 'not'.",
    questions: [
      {
        q_th: "ภาษามีบทบาทอะไรนอกจากการสื่อสาร",
        q_vi: "Ngôn ngữ có vai trò gì ngoài giao tiếp?",
        q_en: "What role does language play besides communication?",
        answer_th: "หล่อหลอมอัตลักษณ์ของชุมชน",
        answer_vi: "Định hình bản sắc cộng đồng.",
        answer_en: "Shaping community identity.",
      },
      {
        q_th: "อะไรทำให้ภาษาเล็กๆ เสี่ยงสูญหาย",
        q_vi: "Điều gì khiến ngôn ngữ nhỏ có nguy cơ mất?",
        q_en: "What endangers small languages?",
        answer_th: "โลกาภิวัตน์และการครอบงำของภาษาที่มีอำนาจ",
        answer_vi: "Toàn cầu hóa và sự lấn át của ngôn ngữ quyền lực.",
        answer_en: "Globalization and the dominance of powerful languages.",
      },
    ],
    vocab: [
      { word: "อัตลักษณ์", rtgs: "àt-dtà-lák", en: "identity", vi: "bản sắc" },
      { word: "ภาษาถิ่น", rtgs: "phaa-sǎa thìn", en: "dialect", vi: "phương ngữ" },
      { word: "โลกาภิวัตน์", rtgs: "loo-gaa-phí-wát", en: "globalization", vi: "toàn cầu hóa" },
      { word: "ธำรงรักษา", rtgs: "tham-rong rák-sǎa", en: "to preserve", vi: "bảo tồn" },
    ],
  },
  {
    id: "thai_read_c1_mentalhealth",
    level: "C1",
    topic: "public_health",
    title_vi: "Nhận thức về sức khỏe tâm thần",
    title_en: "Mental health awareness",
    passage_th:
      "ในอดีต ปัญหาสุขภาพจิตมักถูกมองข้ามหรือถูกตีตราในสังคมไทย ผู้ที่เผชิญภาวะซึมเศร้าหรือความวิตกกังวลจำนวนไม่น้อยเลือกที่จะเก็บความทุกข์ไว้เพียงลำพัง เพราะเกรงว่าจะถูกตัดสิน อย่างไรก็ตาม ในช่วงไม่กี่ปีที่ผ่านมา ความตระหนักรู้เริ่มขยายตัว สื่อและองค์กรต่างๆ ร่วมกันรณรงค์ให้สังคมเข้าใจว่าสุขภาพจิตมีความสำคัญไม่ยิ่งหย่อนไปกว่าสุขภาพกาย และการขอความช่วยเหลือไม่ใช่เรื่องน่าอาย",
    translation_vi:
      "Trước đây, vấn đề sức khỏe tâm thần thường bị xem nhẹ hoặc bị kỳ thị trong xã hội Thái. Không ít người đối mặt với trầm cảm hay lo âu đã chọn cách giữ nỗi đau cho riêng mình vì sợ bị phán xét. Tuy nhiên, vài năm gần đây nhận thức bắt đầu lan rộng. Truyền thông và các tổ chức cùng nhau vận động để xã hội hiểu rằng sức khỏe tâm thần quan trọng không kém sức khỏe thể chất, và việc tìm kiếm sự giúp đỡ không phải điều đáng xấu hổ.",
    translation_en:
      "In the past, mental health problems were often overlooked or stigmatized in Thai society. Many people facing depression or anxiety chose to keep their suffering to themselves, fearing they would be judged. However, in recent years awareness has begun to grow. Media and organizations have campaigned together for society to understand that mental health is no less important than physical health, and that asking for help is not shameful.",
    notes_vi:
      "C1 hỗ trợ học tập (chưa kiểm định bản ngữ): 'ถูกตีตรา' = bị kỳ thị; 'เพียงลำพัง' = một mình; 'ไม่ยิ่งหย่อนไปกว่า' = không kém gì.",
    notes_en:
      "C1 study support (native review deferred): 'ถูกตีตรา' = to be stigmatized; 'เพียงลำพัง' = alone; 'ไม่ยิ่งหย่อนไปกว่า' = no less than.",
    questions: [
      {
        q_th: "ในอดีตคนที่มีปัญหาสุขภาพจิตทำอย่างไร",
        q_vi: "Trước đây người có vấn đề tâm lý thường làm gì?",
        q_en: "In the past, what did people with mental health issues do?",
        answer_th: "เก็บความทุกข์ไว้คนเดียวเพราะกลัวถูกตัดสิน",
        answer_vi: "Giữ nỗi đau cho riêng mình vì sợ bị phán xét.",
        answer_en: "Kept their suffering to themselves for fear of judgment.",
      },
      {
        q_th: "สื่อและองค์กรรณรงค์เรื่องอะไร",
        q_vi: "Truyền thông và tổ chức vận động điều gì?",
        q_en: "What do media and organizations campaign for?",
        answer_th: "ให้เข้าใจว่าสุขภาพจิตสำคัญและการขอความช่วยเหลือไม่น่าอาย",
        answer_vi: "Hiểu rằng sức khỏe tâm thần quan trọng và xin giúp đỡ không đáng xấu hổ.",
        answer_en: "That mental health matters and seeking help is not shameful.",
      },
    ],
    vocab: [
      { word: "สุขภาพจิต", rtgs: "sùk-khà-phâap jìt", en: "mental health", vi: "sức khỏe tâm thần" },
      { word: "ซึมเศร้า", rtgs: "suem-sâo", en: "depression", vi: "trầm cảm" },
      { word: "ตีตรา", rtgs: "dtii-dtraa", en: "to stigmatize", vi: "kỳ thị" },
      { word: "ตระหนักรู้", rtgs: "dtrà-nàk-rúu", en: "awareness", vi: "nhận thức" },
    ],
  },
  {
    id: "thai_read_c1_renewable",
    level: "C1",
    topic: "energy",
    title_vi: "Năng lượng tái tạo",
    title_en: "Renewable energy",
    passage_th:
      "การเปลี่ยนผ่านสู่พลังงานหมุนเวียนถือเป็นวาระเร่งด่วนของหลายประเทศ รวมถึงไทย ด้วยศักยภาพด้านพลังงานแสงอาทิตย์ที่สูง ประเทศไทยจึงมีโอกาสลดการพึ่งพาเชื้อเพลิงฟอสซิลและลดการปล่อยก๊าซเรือนกระจก กระนั้น การลงทุนในโครงสร้างพื้นฐานและการปรับปรุงกฎระเบียบยังเป็นอุปสรรคสำคัญ ผู้กำหนดนโยบายจึงต้องสร้างแรงจูงใจที่เหมาะสม เพื่อเร่งให้ภาคเอกชนและประชาชนหันมาใช้พลังงานสะอาดอย่างกว้างขวาง",
    translation_vi:
      "Quá trình chuyển dịch sang năng lượng tái tạo được coi là vấn đề cấp bách của nhiều quốc gia, kể cả Thái Lan. Với tiềm năng năng lượng mặt trời cao, Thái Lan có cơ hội giảm lệ thuộc nhiên liệu hóa thạch và giảm phát thải khí nhà kính. Tuy vậy, đầu tư hạ tầng và cải cách quy định vẫn là rào cản lớn. Vì thế các nhà hoạch định chính sách phải tạo ra động lực phù hợp để thúc đẩy khu vực tư nhân và người dân chuyển sang dùng năng lượng sạch trên diện rộng.",
    translation_en:
      "The transition to renewable energy is considered an urgent agenda for many countries, including Thailand. With high solar energy potential, Thailand has an opportunity to reduce dependence on fossil fuels and cut greenhouse gas emissions. Nevertheless, investment in infrastructure and regulatory reform remain major obstacles. Policymakers must therefore create suitable incentives to accelerate the private sector's and the public's broad shift to clean energy.",
    notes_vi:
      "C1 hỗ trợ học tập (chưa kiểm định bản ngữ): 'การเปลี่ยนผ่าน' = quá trình chuyển dịch; 'กระนั้น' = tuy vậy; 'แรงจูงใจ' = động lực; 'อย่างกว้างขวาง' = trên diện rộng.",
    notes_en:
      "C1 study support (native review deferred): 'การเปลี่ยนผ่าน' = transition; 'กระนั้น' = nevertheless; 'แรงจูงใจ' = incentive; 'อย่างกว้างขวาง' = widely.",
    questions: [
      {
        q_th: "ไทยมีศักยภาพพลังงานชนิดใดสูง",
        q_vi: "Thái Lan có tiềm năng cao về loại năng lượng nào?",
        q_en: "Which energy does Thailand have high potential for?",
        answer_th: "พลังงานแสงอาทิตย์",
        answer_vi: "Năng lượng mặt trời.",
        answer_en: "Solar energy.",
      },
      {
        q_th: "อุปสรรคสำคัญคืออะไร",
        q_vi: "Rào cản quan trọng là gì?",
        q_en: "What are the major obstacles?",
        answer_th: "การลงทุนโครงสร้างพื้นฐานและการปรับปรุงกฎระเบียบ",
        answer_vi: "Đầu tư hạ tầng và cải cách quy định.",
        answer_en: "Infrastructure investment and regulatory reform.",
      },
    ],
    vocab: [
      { word: "พลังงานหมุนเวียน", rtgs: "phá-lang-ngaan mǔn-wian", en: "renewable energy", vi: "năng lượng tái tạo" },
      { word: "เชื้อเพลิงฟอสซิล", rtgs: "chúea-phloeng fáawt-sin", en: "fossil fuel", vi: "nhiên liệu hóa thạch" },
      { word: "ก๊าซเรือนกระจก", rtgs: "gáat ruean-grà-jòk", en: "greenhouse gas", vi: "khí nhà kính" },
      { word: "แรงจูงใจ", rtgs: "raaeng-juung-jai", en: "incentive", vi: "động lực" },
    ],
  },
  {
    id: "thai_read_c1_economy",
    level: "C1",
    topic: "economics",
    title_vi: "Kinh tế phụ thuộc du lịch",
    title_en: "A tourism-dependent economy",
    passage_th:
      "การที่เศรษฐกิจไทยพึ่งพารายได้จากการท่องเที่ยวในสัดส่วนที่สูง สะท้อนทั้งจุดแข็งและความเปราะบางในเวลาเดียวกัน เมื่อเกิดวิกฤตที่ฉุดให้นักท่องเที่ยวหายไป เช่น การระบาดของโรค ภาคธุรกิจจำนวนมหาศาลย่อมได้รับผลกระทบอย่างรุนแรงและฉับพลัน บทเรียนดังกล่าวตอกย้ำถึงความจำเป็นในการกระจายความเสี่ยงทางเศรษฐกิจ ด้วยการส่งเสริมอุตสาหกรรมที่มีมูลค่าเพิ่มและพัฒนาทักษะแรงงาน เพื่อมิให้ประเทศต้องฝากอนาคตไว้กับปัจจัยที่ควบคุมไม่ได้แต่เพียงอย่างเดียว",
    translation_vi:
      "Việc nền kinh tế Thái Lan phụ thuộc cao vào nguồn thu du lịch phản ánh đồng thời cả thế mạnh lẫn sự mong manh. Khi xảy ra khủng hoảng làm du khách biến mất, chẳng hạn dịch bệnh, vô số doanh nghiệp tất yếu chịu tác động nặng nề và đột ngột. Bài học đó nhấn mạnh sự cần thiết phải phân tán rủi ro kinh tế bằng cách thúc đẩy các ngành có giá trị gia tăng và phát triển kỹ năng lao động, để đất nước không phải đặt tương lai chỉ vào một yếu tố không thể kiểm soát.",
    translation_en:
      "Thailand's economy depending heavily on tourism revenue reflects both a strength and a fragility at once. When a crisis makes tourists vanish — such as a disease outbreak — a vast number of businesses are inevitably hit severely and suddenly. That lesson underscores the need to diversify economic risk by promoting higher value-added industries and developing the workforce's skills, so the country need not stake its future on a single uncontrollable factor.",
    notes_vi:
      "C1 hỗ trợ học tập (chưa kiểm định bản ngữ): 'ความเปราะบาง' = sự mong manh; 'ตอกย้ำ' = nhấn mạnh; 'กระจายความเสี่ยง' = phân tán rủi ro; 'มูลค่าเพิ่ม' = giá trị gia tăng.",
    notes_en:
      "C1 study support (native review deferred): 'ความเปราะบาง' = fragility; 'ตอกย้ำ' = to underscore; 'กระจายความเสี่ยง' = to diversify risk; 'มูลค่าเพิ่ม' = value-added.",
    questions: [
      {
        q_th: "การพึ่งพาการท่องเที่ยวสะท้อนอะไร",
        q_vi: "Phụ thuộc du lịch phản ánh điều gì?",
        q_en: "What does tourism dependence reflect?",
        answer_th: "ทั้งจุดแข็งและความเปราะบาง",
        answer_vi: "Cả thế mạnh lẫn sự mong manh.",
        answer_en: "Both a strength and a fragility.",
      },
      {
        q_th: "บทเรียนนี้ชี้ถึงความจำเป็นใด",
        q_vi: "Bài học chỉ ra sự cần thiết nào?",
        q_en: "What necessity does this lesson point to?",
        answer_th: "การกระจายความเสี่ยงทางเศรษฐกิจ",
        answer_vi: "Phân tán rủi ro kinh tế.",
        answer_en: "Diversifying economic risk.",
      },
    ],
    vocab: [
      { word: "พึ่งพา", rtgs: "phûeng-phaa", en: "to depend on", vi: "phụ thuộc" },
      { word: "เปราะบาง", rtgs: "bpràw-baang", en: "fragile", vi: "mong manh" },
      { word: "กระจายความเสี่ยง", rtgs: "grà-jaai khwaam-sìang", en: "to diversify risk", vi: "phân tán rủi ro" },
      { word: "มูลค่าเพิ่ม", rtgs: "muun-lá-khâa phôem", en: "value-added", vi: "giá trị gia tăng" },
    ],
  },
];

// ── C2 — discourse / nuanced argument (study support, native review deferred) ─

const c2: ThaiReadingPassage[] = [
  {
    id: "thai_read_c2_softpower",
    level: "C2",
    topic: "culture_policy",
    title_vi: "Quyền lực mềm và văn hóa Thái",
    title_en: "Soft power and Thai culture",
    passage_th:
      "แนวคิดเรื่อง “อำนาจละมุน” ได้กลายเป็นวาทกรรมที่รัฐหยิบยกมาใช้อย่างแพร่หลายในการส่งออกวัฒนธรรม ไม่ว่าจะเป็นอาหาร ภาพยนตร์ หรือศิลปะการต่อสู้ กระนั้น การลดทอนวัฒนธรรมอันมีรากลึกให้กลายเป็นเพียงสินค้าเพื่อการประชาสัมพันธ์ อาจบั่นทอนความหมายที่แท้จริงของมันลงอย่างน่าเสียดาย คำถามที่ลึกซึ้งกว่าจึงมิได้อยู่ที่ว่าจะขายภาพลักษณ์อย่างไร หากแต่อยู่ที่ว่าสังคมจะธำรงคุณค่าและบริบทดั้งเดิมไว้ได้เพียงใด ท่ามกลางแรงเสียดทานระหว่างการอนุรักษ์กับการแสวงหาผลประโยชน์เชิงพาณิชย์",
    translation_vi:
      "Khái niệm “quyền lực mềm” đã trở thành một diễn ngôn được nhà nước viện dẫn rộng rãi trong việc xuất khẩu văn hóa, dù là ẩm thực, điện ảnh hay võ thuật. Tuy vậy, việc giản lược một nền văn hóa có cội rễ sâu xa thành thuần túy hàng hóa quảng bá có thể làm xói mòn ý nghĩa đích thực của nó một cách đáng tiếc. Câu hỏi sâu sắc hơn vì thế không nằm ở chỗ bán hình ảnh ra sao, mà ở chỗ xã hội có thể gìn giữ giá trị và bối cảnh nguyên bản đến mức nào, giữa lực căng giữa bảo tồn và mưu cầu lợi ích thương mại.",
    translation_en:
      "The notion of “soft power” has become a discourse that the state invokes widely in exporting culture — whether cuisine, film, or martial arts. Yet reducing a deeply rooted culture to mere promotional merchandise may regrettably erode its true meaning. The deeper question therefore lies not in how to sell an image, but in how far a society can preserve original values and context amid the tension between conservation and the pursuit of commercial gain.",
    notes_vi:
      "C2 hỗ trợ học tập (chưa kiểm định bản ngữ): 'วาทกรรม' = diễn ngôn; 'ลดทอน' = giản lược/làm suy giảm; 'บั่นทอน' = xói mòn; 'มิได้อยู่ที่...หากแต่อยู่ที่' = không nằm ở... mà ở.",
    notes_en:
      "C2 study support (native review deferred): 'วาทกรรม' = discourse; 'ลดทอน' = to reduce/diminish; 'บั่นทอน' = to erode; 'มิได้อยู่ที่…หากแต่อยู่ที่' = lies not in … but in.",
    questions: [
      {
        q_th: "รัฐใช้แนวคิดอำนาจละมุนเพื่ออะไร",
        q_vi: "Nhà nước dùng quyền lực mềm để làm gì?",
        q_en: "What does the state use soft power for?",
        answer_th: "การส่งออกวัฒนธรรม",
        answer_vi: "Xuất khẩu văn hóa.",
        answer_en: "Exporting culture.",
      },
      {
        q_th: "ผู้เขียนเห็นว่าคำถามที่ลึกซึ้งกว่าคืออะไร",
        q_vi: "Người viết cho rằng câu hỏi sâu hơn là gì?",
        q_en: "What does the writer see as the deeper question?",
        answer_th: "สังคมจะธำรงคุณค่าและบริบทดั้งเดิมไว้ได้เพียงใด",
        answer_vi: "Xã hội gìn giữ giá trị và bối cảnh gốc đến mức nào.",
        answer_en: "How far society can preserve original values and context.",
      },
    ],
    vocab: [
      { word: "อำนาจละมุน", rtgs: "am-nâat lá-mun", en: "soft power", vi: "quyền lực mềm" },
      { word: "วาทกรรม", rtgs: "wâat-thá-gam", en: "discourse", vi: "diễn ngôn" },
      { word: "บั่นทอน", rtgs: "bàn-thaawn", en: "to erode / undermine", vi: "xói mòn" },
      { word: "อนุรักษ์", rtgs: "à-nú-rák", en: "to conserve", vi: "bảo tồn" },
    ],
  },
  {
    id: "thai_read_c2_inequality",
    level: "C2",
    topic: "social_justice",
    title_vi: "Bất bình đẳng thu nhập",
    title_en: "Income inequality",
    passage_th:
      "แม้ตัวเลขการเติบโตทางเศรษฐกิจจะดูน่าพึงพอใจ แต่ตัวเลขมหภาคเหล่านั้นมักบดบังความเหลื่อมล้ำที่ฝังลึกอยู่ภายใต้พื้นผิว ช่องว่างระหว่างผู้มั่งคั่งกับผู้ด้อยโอกาสมิได้แคบลง หากกลับถ่างกว้างขึ้นในหลายมิติ ทั้งการเข้าถึงการศึกษาที่มีคุณภาพ บริการสาธารณสุข และโอกาสในการเลื่อนสถานะทางสังคม การแก้ไขปัญหานี้จึงเรียกร้องมากกว่ามาตรการเชิงสงเคราะห์ชั่วคราว แต่ต้องอาศัยการปฏิรูปเชิงโครงสร้างที่กล้าหาญ ซึ่งย่อมหลีกเลี่ยงไม่ได้ที่จะกระทบต่อผลประโยชน์ของกลุ่มที่กุมอำนาจ",
    translation_vi:
      "Dù các con số tăng trưởng kinh tế trông có vẻ đáng hài lòng, những con số vĩ mô ấy thường che lấp sự bất bình đẳng ăn sâu bên dưới bề mặt. Khoảng cách giữa người giàu có và người yếu thế không hề thu hẹp, mà trái lại còn doãng rộng trên nhiều phương diện: tiếp cận giáo dục chất lượng, dịch vụ y tế công, và cơ hội dịch chuyển địa vị xã hội. Giải quyết vấn đề này vì vậy đòi hỏi nhiều hơn các biện pháp cứu trợ tạm thời, mà cần đến cải cách cấu trúc táo bạo — điều tất yếu sẽ đụng chạm lợi ích của các nhóm nắm quyền.",
    translation_en:
      "Although economic growth figures may look satisfying, those macro numbers often obscure inequality embedded beneath the surface. The gap between the wealthy and the disadvantaged has not narrowed but rather widened across many dimensions — access to quality education, public health services, and opportunities for social mobility. Solving this therefore demands more than temporary palliative measures; it requires bold structural reform, which inevitably affects the interests of those who hold power.",
    notes_vi:
      "C2 hỗ trợ học tập (chưa kiểm định bản ngữ): 'บดบัง' = che lấp; 'ถ่างกว้าง' = doãng rộng; 'เชิงสงเคราะห์' = mang tính cứu trợ; 'การปฏิรูปเชิงโครงสร้าง' = cải cách cấu trúc.",
    notes_en:
      "C2 study support (native review deferred): 'บดบัง' = to obscure; 'ถ่างกว้าง' = to widen; 'เชิงสงเคราะห์' = palliative/charitable; 'การปฏิรูปเชิงโครงสร้าง' = structural reform.",
    questions: [
      {
        q_th: "ตัวเลขมหภาคมักบดบังอะไร",
        q_vi: "Con số vĩ mô thường che lấp điều gì?",
        q_en: "What do macro figures often obscure?",
        answer_th: "ความเหลื่อมล้ำที่ฝังลึก",
        answer_vi: "Sự bất bình đẳng ăn sâu.",
        answer_en: "Deeply embedded inequality.",
      },
      {
        q_th: "การแก้ปัญหาต้องอาศัยอะไร",
        q_vi: "Giải quyết vấn đề cần đến gì?",
        q_en: "What does solving the problem require?",
        answer_th: "การปฏิรูปเชิงโครงสร้างที่กล้าหาญ",
        answer_vi: "Cải cách cấu trúc táo bạo.",
        answer_en: "Bold structural reform.",
      },
    ],
    vocab: [
      { word: "มหภาค", rtgs: "má-hà-phâak", en: "macro (-economic)", vi: "vĩ mô" },
      { word: "เหลื่อมล้ำ", rtgs: "lùeam-lám", en: "unequal / disparity", vi: "bất bình đẳng" },
      { word: "เลื่อนสถานะ", rtgs: "lûean sà-thǎa-ná", en: "social mobility", vi: "dịch chuyển địa vị" },
      { word: "ปฏิรูป", rtgs: "bpà-dtì-rûup", en: "to reform", vi: "cải cách" },
    ],
  },
  {
    id: "thai_read_c2_disinformation",
    level: "C2",
    topic: "media",
    title_vi: "Thông tin sai lệch thời số",
    title_en: "Digital disinformation",
    passage_th:
      "ในภูมิทัศน์ของข้อมูลข่าวสารที่ไหลบ่าอย่างไร้ขอบเขต เส้นแบ่งระหว่างข้อเท็จจริงกับเรื่องบิดเบือนกลับพร่าเลือนลงทุกที ข้อมูลเท็จที่ถูกออกแบบมาอย่างแยบยลสามารถแพร่กระจายได้รวดเร็วกว่าความจริงหลายเท่า เพราะมักเร้าอารมณ์และตอบสนองอคติที่ผู้คนมีอยู่เดิม ปรากฏการณ์นี้ท้าทายรากฐานของการถกเถียงในระบอบประชาธิปไตย เพราะเมื่อสาธารณชนมิอาจเห็นพ้องแม้กระทั่งในข้อเท็จจริงพื้นฐาน การแสวงหาฉันทามติย่อมกลายเป็นภารกิจที่แทบเป็นไปไม่ได้",
    translation_vi:
      "Trong bối cảnh thông tin tràn ngập không biên giới, ranh giới giữa sự thật và sự bóp méo ngày càng nhòe đi. Thông tin sai được thiết kế tinh vi có thể lan nhanh gấp nhiều lần sự thật, vì nó thường kích động cảm xúc và đáp ứng những định kiến sẵn có của con người. Hiện tượng này thách thức nền tảng của tranh luận trong thể chế dân chủ, bởi khi công chúng không thể đồng thuận ngay cả về những sự thật cơ bản, việc tìm kiếm sự đồng thuận tất yếu trở thành một nhiệm vụ gần như bất khả thi.",
    translation_en:
      "In an information landscape that floods in without boundaries, the line between fact and distortion grows ever more blurred. Cleverly designed falsehoods can spread many times faster than the truth, because they tend to inflame emotions and cater to people's existing biases. This phenomenon challenges the foundations of debate in a democracy, for when the public cannot agree even on basic facts, the search for consensus inevitably becomes a near-impossible task.",
    notes_vi:
      "C2 hỗ trợ học tập (chưa kiểm định bản ngữ): 'ภูมิทัศน์' = bối cảnh/cảnh quan; 'พร่าเลือน' = nhòe/mờ; 'แยบยล' = tinh vi; 'ฉันทามติ' = sự đồng thuận.",
    notes_en:
      "C2 study support (native review deferred): 'ภูมิทัศน์' = landscape; 'พร่าเลือน' = blurred; 'แยบยล' = ingenious/cleverly; 'ฉันทามติ' = consensus.",
    questions: [
      {
        q_th: "ทำไมข้อมูลเท็จแพร่เร็วกว่าความจริง",
        q_vi: "Vì sao tin giả lan nhanh hơn sự thật?",
        q_en: "Why does false information spread faster than truth?",
        answer_th: "เพราะเร้าอารมณ์และตอบสนองอคติเดิม",
        answer_vi: "Vì kích động cảm xúc và đáp ứng định kiến có sẵn.",
        answer_en: "Because it inflames emotions and feeds existing biases.",
      },
      {
        q_th: "ปรากฏการณ์นี้ท้าทายอะไร",
        q_vi: "Hiện tượng này thách thức điều gì?",
        q_en: "What does this phenomenon challenge?",
        answer_th: "รากฐานของการถกเถียงในระบอบประชาธิปไตย",
        answer_vi: "Nền tảng tranh luận trong dân chủ.",
        answer_en: "The foundations of democratic debate.",
      },
    ],
    vocab: [
      { word: "ข้อมูลเท็จ", rtgs: "khâaw-muun thét", en: "false information", vi: "thông tin sai" },
      { word: "บิดเบือน", rtgs: "bìt-buean", en: "to distort", vi: "bóp méo" },
      { word: "อคติ", rtgs: "à-khá-dtì", en: "bias / prejudice", vi: "định kiến" },
      { word: "ฉันทามติ", rtgs: "chǎn-thaa-má-dtì", en: "consensus", vi: "sự đồng thuận" },
    ],
  },
  {
    id: "thai_read_c2_preservation",
    level: "C2",
    topic: "heritage",
    title_vi: "Bảo tồn và hiện đại hóa",
    title_en: "Preservation versus modernization",
    passage_th:
      "ความตึงเครียดระหว่างการอนุรักษ์มรดกทางวัฒนธรรมกับการพัฒนาให้ทันสมัยมักถูกนำเสนอราวกับเป็นทางเลือกที่ขัดแย้งกันอย่างสิ้นเชิง ทว่าในความเป็นจริง ทั้งสองสิ่งหาได้เป็นปฏิปักษ์ต่อกันโดยปริยายไม่ ชุมชนที่ชาญฉลาดย่อมสามารถผสานคุณค่าดั้งเดิมเข้ากับนวัตกรรมร่วมสมัยได้อย่างกลมกลืน ปัญหาที่แท้จริงมักมิได้อยู่ที่ตัวการเปลี่ยนแปลงเอง หากอยู่ที่ว่าใครเป็นผู้กำหนดทิศทาง และผลประโยชน์ตกแก่ผู้ใด เมื่อใดที่เสียงของชุมชนท้องถิ่นถูกกลบด้วยตรรกะของทุน มรดกย่อมเสี่ยงที่จะถูกแปรสภาพเป็นเพียงฉากหลังอันว่างเปล่า",
    translation_vi:
      "Sự căng thẳng giữa bảo tồn di sản văn hóa và phát triển hiện đại thường được trình bày như thể là hai lựa chọn mâu thuẫn hoàn toàn. Nhưng trên thực tế, cả hai vốn không nhất thiết đối nghịch nhau. Một cộng đồng khôn ngoan hoàn toàn có thể hòa quyện giá trị truyền thống với đổi mới đương đại một cách hài hòa. Vấn đề thực sự thường không nằm ở bản thân sự thay đổi, mà ở chỗ ai là người định hướng và lợi ích thuộc về ai. Một khi tiếng nói của cộng đồng địa phương bị lấn át bởi logic của tư bản, di sản tất yếu có nguy cơ bị biến thành một phông nền trống rỗng.",
    translation_en:
      "The tension between preserving cultural heritage and modernizing is often presented as if it were a wholly contradictory choice. Yet in reality, the two are not inherently antagonistic. A wise community can blend traditional values with contemporary innovation harmoniously. The real problem usually lies not in change itself, but in who sets its direction and to whom the benefits accrue. Once the voice of the local community is drowned out by the logic of capital, heritage risks being transformed into a mere empty backdrop.",
    notes_vi:
      "C2 hỗ trợ học tập (chưa kiểm định bản ngữ): 'หาได้...ไม่' = vốn không (phủ định trang trọng); 'โดยปริยาย' = một cách mặc nhiên; 'ผสาน' = hòa quyện; 'ตรรกะของทุน' = logic của tư bản.",
    notes_en:
      "C2 study support (native review deferred): 'หาได้…ไม่' = is not at all (formal negation); 'โดยปริยาย' = by default/implicitly; 'ผสาน' = to blend; 'ตรรกะของทุน' = the logic of capital.",
    questions: [
      {
        q_th: "ผู้เขียนเห็นว่าการอนุรักษ์กับการพัฒนาเป็นปฏิปักษ์กันหรือไม่",
        q_vi: "Tác giả cho rằng bảo tồn và phát triển có đối nghịch không?",
        q_en: "Does the writer think preservation and development are antagonistic?",
        answer_th: "ไม่ — สามารถผสานกันได้",
        answer_vi: "Không — có thể hòa quyện.",
        answer_en: "No — they can be blended.",
      },
      {
        q_th: "ปัญหาที่แท้จริงอยู่ที่ใด",
        q_vi: "Vấn đề thực sự nằm ở đâu?",
        q_en: "Where does the real problem lie?",
        answer_th: "ที่ว่าใครกำหนดทิศทางและผลประโยชน์ตกแก่ผู้ใด",
        answer_vi: "Ở chỗ ai định hướng và lợi ích thuộc về ai.",
        answer_en: "In who sets the direction and who benefits.",
      },
    ],
    vocab: [
      { word: "มรดก", rtgs: "maaw-rá-dòk", en: "heritage", vi: "di sản" },
      { word: "ปฏิปักษ์", rtgs: "bpà-dtì-bpàk", en: "antagonist / opposed", vi: "đối nghịch" },
      { word: "ผสาน", rtgs: "phà-sǎan", en: "to merge / blend", vi: "hòa quyện" },
      { word: "ร่วมสมัย", rtgs: "rûam-sà-mǎi", en: "contemporary", vi: "đương đại" },
    ],
  },
  {
    id: "thai_read_c2_publichealth",
    level: "C2",
    topic: "policy",
    title_vi: "Chính sách y tế công",
    title_en: "Public health policy",
    passage_th:
      "การกำหนดนโยบายสาธารณสุขที่มีประสิทธิผลจำเป็นต้องอาศัยความสมดุลอันละเอียดอ่อนระหว่างหลักฐานเชิงวิทยาศาสตร์ ข้อจำกัดด้านทรัพยากร และความชอบธรรมทางการเมือง ในยามวิกฤต ผู้กำหนดนโยบายมักเผชิญภาวะกลืนไม่เข้าคายไม่ออก ที่ต้องเลือกระหว่างการปกป้องสุขภาพของส่วนรวมกับการธำรงเสรีภาพของปัจเจกบุคคล การตัดสินใจที่ปราศจากความไว้วางใจจากสาธารณชนย่อมยากที่จะสัมฤทธิ์ผล ไม่ว่ามาตรการนั้นจะตั้งอยู่บนหลักวิชาการที่หนักแน่นเพียงใด ด้วยเหตุนี้ การสื่อสารที่โปร่งใสและการมีส่วนร่วมของประชาชนจึงมิใช่เพียงอุดมคติ หากเป็นเงื่อนไขเชิงปฏิบัติที่ขาดเสียมิได้",
    translation_vi:
      "Việc hoạch định chính sách y tế công hữu hiệu đòi hỏi một sự cân bằng tinh tế giữa bằng chứng khoa học, giới hạn nguồn lực và tính chính danh chính trị. Trong khủng hoảng, nhà hoạch định thường đối mặt với thế lưỡng nan, phải chọn giữa bảo vệ sức khỏe cộng đồng và duy trì tự do cá nhân. Một quyết định thiếu sự tin cậy của công chúng tất yếu khó thành công, dù biện pháp ấy dựa trên cơ sở học thuật vững chắc đến đâu. Vì lẽ đó, truyền thông minh bạch và sự tham gia của người dân không chỉ là lý tưởng, mà là điều kiện thực tiễn không thể thiếu.",
    translation_en:
      "Formulating effective public health policy requires a delicate balance among scientific evidence, resource constraints, and political legitimacy. In a crisis, policymakers often face a dilemma, having to choose between protecting collective health and preserving individual liberty. A decision lacking public trust will inevitably struggle to succeed, no matter how solid its academic basis. For this reason, transparent communication and public participation are not merely an ideal but an indispensable practical condition.",
    notes_vi:
      "C2 hỗ trợ học tập (chưa kiểm định bản ngữ): 'ความชอบธรรม' = tính chính danh; 'กลืนไม่เข้าคายไม่ออก' = thế lưỡng nan (thành ngữ); 'สัมฤทธิ์ผล' = thành công; 'ขาดเสียมิได้' = không thể thiếu.",
    notes_en:
      "C2 study support (native review deferred): 'ความชอบธรรม' = legitimacy; 'กลืนไม่เข้าคายไม่ออก' = a dilemma (idiom); 'สัมฤทธิ์ผล' = to succeed; 'ขาดเสียมิได้' = indispensable.",
    questions: [
      {
        q_th: "นโยบายสาธารณสุขต้องสมดุลระหว่างอะไรบ้าง",
        q_vi: "Chính sách y tế phải cân bằng giữa những gì?",
        q_en: "What must health policy balance?",
        answer_th: "หลักฐานวิทยาศาสตร์ ทรัพยากร และความชอบธรรมทางการเมือง",
        answer_vi: "Bằng chứng khoa học, nguồn lực và tính chính danh.",
        answer_en: "Scientific evidence, resources, and political legitimacy.",
      },
      {
        q_th: "เหตุใดการสื่อสารโปร่งใสจึงขาดไม่ได้",
        q_vi: "Vì sao truyền thông minh bạch không thể thiếu?",
        q_en: "Why is transparent communication indispensable?",
        answer_th: "เพราะการตัดสินใจต้องอาศัยความไว้วางใจจากสาธารณชน",
        answer_vi: "Vì quyết định cần sự tin cậy của công chúng.",
        answer_en: "Because decisions need public trust to succeed.",
      },
    ],
    vocab: [
      { word: "สาธารณสุข", rtgs: "sǎa-thaa-rá-ná-sùk", en: "public health", vi: "y tế công" },
      { word: "ความชอบธรรม", rtgs: "khwaam châawp-tham", en: "legitimacy", vi: "tính chính danh" },
      { word: "ภาวะกลืนไม่เข้าคายไม่ออก", rtgs: "phaa-wá gluen-mâi-khâo-khaai-mâi-àawk", en: "dilemma", vi: "thế lưỡng nan" },
      { word: "โปร่งใส", rtgs: "bpròong-sǎi", en: "transparent", vi: "minh bạch" },
    ],
  },
  {
    id: "thai_read_c2_climate",
    level: "C2",
    topic: "climate",
    title_vi: "Thích ứng khí hậu",
    title_en: "Climate adaptation",
    passage_th:
      "ขณะที่วาทกรรมว่าด้วยการเปลี่ยนแปลงสภาพภูมิอากาศมักมุ่งเน้นไปที่การลดการปล่อยก๊าซ การปรับตัวเพื่อรองรับผลกระทบที่เกิดขึ้นแล้วกลับได้รับความสนใจน้อยกว่าอย่างไม่สมเหตุสมผล สำหรับประเทศที่มีพื้นที่ชายฝั่งกว้างขวางและพึ่งพิงเกษตรกรรมเช่นไทย ความเปราะบางต่อระดับน้ำทะเลที่สูงขึ้นและภัยแล้งที่รุนแรงมิใช่ความเสี่ยงในอนาคตอันไกลโพ้น หากเป็นความจริงที่คืบคลานเข้ามาแล้ว การลงทุนในการปรับตัวจึงมิควรถูกมองว่าเป็นการยอมจำนน หากเป็นการบริหารความเสี่ยงอย่างมีวิจารณญาณ ที่ตระหนักว่าการป้องกันเพียงอย่างเดียวนั้นไม่อาจเพียงพออีกต่อไป",
    translation_vi:
      "Trong khi diễn ngôn về biến đổi khí hậu thường tập trung vào giảm phát thải, việc thích ứng để ứng phó với các tác động đã xảy ra lại nhận được sự quan tâm ít hơn một cách bất hợp lý. Với một quốc gia có bờ biển rộng và phụ thuộc nông nghiệp như Thái Lan, sự dễ tổn thương trước mực nước biển dâng và hạn hán khốc liệt không phải là rủi ro của tương lai xa, mà là thực tại đang lặng lẽ tiến đến. Vì thế đầu tư cho thích ứng không nên bị xem là sự đầu hàng, mà là quản trị rủi ro một cách sáng suốt, nhận ra rằng chỉ phòng ngừa thôi không còn đủ nữa.",
    translation_en:
      "While the discourse on climate change tends to focus on cutting emissions, adaptation to cope with impacts that have already occurred receives unreasonably less attention. For a country with extensive coastlines and reliance on agriculture like Thailand, vulnerability to rising sea levels and severe drought is not a risk of the distant future but a reality already creeping in. Investment in adaptation should therefore not be seen as surrender, but as judicious risk management that recognizes prevention alone can no longer suffice.",
    notes_vi:
      "C2 hỗ trợ học tập (chưa kiểm định bản ngữ): 'การปรับตัว' = sự thích ứng; 'คืบคลานเข้ามา' = lặng lẽ tiến đến; 'การยอมจำนน' = sự đầu hàng; 'วิจารณญาณ' = sự sáng suốt.",
    notes_en:
      "C2 study support (native review deferred): 'การปรับตัว' = adaptation; 'คืบคลานเข้ามา' = to creep in; 'การยอมจำนน' = surrender; 'วิจารณญาณ' = judgment/discernment.",
    questions: [
      {
        q_th: "วาทกรรมเรื่องภูมิอากาศมักละเลยอะไร",
        q_vi: "Diễn ngôn khí hậu thường bỏ qua điều gì?",
        q_en: "What does climate discourse tend to neglect?",
        answer_th: "การปรับตัวเพื่อรองรับผลกระทบ",
        answer_vi: "Sự thích ứng với tác động.",
        answer_en: "Adaptation to impacts.",
      },
      {
        q_th: "ผู้เขียนเห็นว่าการลงทุนปรับตัวคืออะไร",
        q_vi: "Tác giả xem đầu tư thích ứng là gì?",
        q_en: "How does the writer view adaptation investment?",
        answer_th: "การบริหารความเสี่ยงอย่างมีวิจารณญาณ ไม่ใช่การยอมจำนน",
        answer_vi: "Quản trị rủi ro sáng suốt, không phải đầu hàng.",
        answer_en: "Judicious risk management, not surrender.",
      },
    ],
    vocab: [
      { word: "สภาพภูมิอากาศ", rtgs: "sà-phâap phuu-mí-aa-gàat", en: "climate", vi: "khí hậu" },
      { word: "การปรับตัว", rtgs: "gaan bpràp-dtua", en: "adaptation", vi: "sự thích ứng" },
      { word: "ระดับน้ำทะเล", rtgs: "rá-dàp náam thá-lee", en: "sea level", vi: "mực nước biển" },
      { word: "วิจารณญาณ", rtgs: "wí-jaa-rá-ná-yaan", en: "discernment / judgment", vi: "sự sáng suốt" },
    ],
  },
];

// ── Aggregate export ────────────────────────────────────────────────────────

export const passages: ThaiReadingPassage[] = [
  ...a1,
  ...a2,
  ...b1,
  ...b2,
  ...c1,
  ...c2,
];

export default passages;
