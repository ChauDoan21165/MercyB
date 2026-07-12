type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation?: string;
  pronunciation_vi?: string;
};

type VocabEntry = {
  cell_id?: string;
  word: string;
  meaning_vi: string;
  meaning_en: string;
  example: string;
  example_vi: string;
};

type DialogueLine = {
  cell_id?: string;
  speaker: string;
  line: string;
  vi: string;
  en: string;
};

type Exercise = {
  type: 'fill_blank' | 'translate' | 'choice' | 'roleplay';
  prompt: string;
  answer: string;
  explanation_vi: string;
  explanation_en: string;
};

type IndonesianCefrLevel = 'A1' | 'A2' | 'B1' | 'B2';

type IndonesianLesson = {
  id: string;
  title: string;
  level: IndonesianCefrLevel;
  topic: string;
  vietnamese_title: string;
  english_title: string;
  pronunciation_focus: string[];
  pronunciation_focus_en: string[];
  sentences: IndonesianLessonSentence[];
  vocabulary: VocabEntry[];
  dialogue: DialogueLine[];
  cultural_notes_vi: string[];
  cultural_notes_en: string[];
  tip_advice_vi: string[];
  tip_advice_en: string[];
  exercises: Exercise[];
};

export const lessons: IndonesianLesson[] = [
  {
    id: 'cultural-food-sharing',
    title: 'Berbagi makanan dan sopan santun keluarga',
    level: 'A2',
    topic: 'sharing food, bringing souvenirs, eating together, politely refusing food, complimenting cooking, family customs',
    vietnamese_title: 'Chia sẻ đồ ăn và phép lịch sự trong gia đình Indonesia',
    english_title: 'Cultural Food Sharing',
    pronunciation_focus: [
      'Berbagi makanan nghĩa là chia sẻ đồ ăn. Berbagi nghe ấm áp và tự nhiên hơn memberi khi mọi người cùng ăn.',
      'Oleh-oleh là quà mang về sau khi đi xa hoặc đến thăm. Có thể là makanan, kue, kopi, atau barang kecil.',
      'Makan bersama nghĩa là ăn cùng nhau. Bersama đứng sau động từ hoặc danh từ để nhấn mạnh cùng nhau.',
      'Menolak makanan halus nghĩa là từ chối đồ ăn một cách nhẹ nhàng. Halus trong văn hóa giao tiếp là mềm mại/lịch sự.',
      'Masakan nghĩa là món ăn đã nấu hoặc tài nấu ăn. Pujian masakan là lời khen món ăn.',
      'Adat keluarga nghĩa là phong tục/thói quen của gia đình. Adat không chỉ là nghi lễ lớn, mà cũng có thể là nếp nhà.',
    ],
    pronunciation_focus_en: [
      'Berbagi makanan means sharing food. Berbagi feels warmer and more natural than memberi when people are eating together.',
      'Oleh-oleh is a gift brought back from travel or brought when visiting. It may be food, cakes, coffee, or a small item.',
      'Makan bersama means eating together. Bersama follows the verb or noun to emphasize togetherness.',
      'Menolak makanan halus means refusing food gently. Halus in social communication means soft, tactful, or polite.',
      'Masakan means cooked food or cooking. Pujian masakan is a compliment about the cooking.',
      'Adat keluarga means family customs. Adat is not only big ceremonies; it can also mean family habits and household norms.',
    ],
    sentences: [
      {
        en: 'Kami biasa berbagi makanan dengan tetangga.',
        vi: 'Chúng tôi thường chia sẻ đồ ăn với hàng xóm.',
        pronunciation: 'KA-mi BI-a-sa ber-BA-gi ma-KA-nan de-NGAN te-TANG-ga',
      },
      {
        en: 'Saya membawa oleh-oleh kecil untuk keluarga Ibu.',
        vi: 'Tôi mang một chút quà nhỏ cho gia đình cô/chị.',
        pronunciation: 'SA-ya mem-BA-wa O-leh O-leh ke-CIL UN-tuk ke-LU-ar-ga I-bu',
      },
      {
        en: 'Ayo makan bersama sebelum makanannya dingin.',
        vi: 'Mình cùng ăn trước khi đồ ăn nguội.',
        pronunciation: 'A-yo MA-kan ber-SA-ma se-BE-lum ma-KA-nan-nya DI-ngin',
      },
      {
        en: 'Masakannya enak sekali, bumbunya pas.',
        vi: 'Món ăn ngon quá, gia vị vừa miệng.',
        pronunciation: 'ma-SA-kan-nya E-nak se-KA-li BUM-bu-nya pas',
      },
      {
        en: 'Saya mau sedikit saja, terima kasih.',
        vi: 'Tôi chỉ lấy một chút thôi, cảm ơn.',
        pronunciation: 'SA-ya mau se-DI-kit SA-ja te-RI-ma KA-sih',
      },
      {
        en: 'Maaf, saya tidak bisa makan kacang karena alergi.',
        vi: 'Xin lỗi, tôi không thể ăn đậu vì bị dị ứng.',
        pronunciation: 'MA-af SA-ya TI-dak BI-sa MA-kan KA-cang ka-RE-na a-LER-gi',
      },
      {
        en: 'Biasanya keluarga kami makan nasi bersama lauk di tengah meja.',
        vi: 'Gia đình chúng tôi thường ăn cơm với món ăn đặt giữa bàn.',
        pronunciation: 'BI-a-sa-nya ke-LU-ar-ga KA-mi MA-kan NA-si ber-SA-ma LA-uk di TE-ngah ME-ja',
      },
      {
        en: 'Saya ingin menghormati adat keluarga di sini.',
        vi: 'Tôi muốn tôn trọng nếp gia đình ở đây.',
        pronunciation: 'SA-ya I-ngin meng-hor-MA-ti A-dat ke-LU-ar-ga di SI-ni',
      },
    ],
    vocabulary: [
      {
        cell_id: "83a22802-10db-4e46-bb3a-5da04b74a43e",
        word: 'berbagi makanan',
        meaning_vi: 'chia sẻ đồ ăn',
        meaning_en: 'sharing food',
        example: 'Saat ada acara, warga sering berbagi makanan.',
        example_vi: 'Khi có sự kiện, người dân thường chia sẻ đồ ăn.',
      },
      {
        cell_id: "6315d429-f7a4-4582-9385-28792fa800b4",
        word: 'oleh-oleh',
        meaning_vi: 'quà mang về, quà thăm hỏi',
        meaning_en: 'souvenir or small gift brought when visiting',
        example: 'Saya membawa oleh-oleh dari Bandung.',
        example_vi: 'Tôi mang quà từ Bandung về.',
      },
      {
        cell_id: "fca0aaa9-8593-4257-b29c-a6a15e1c6817",
        word: 'makan bersama',
        meaning_vi: 'ăn cùng nhau',
        meaning_en: 'eat together',
        example: 'Malam ini kami makan bersama keluarga besar.',
        example_vi: 'Tối nay chúng tôi ăn cùng đại gia đình.',
      },
      {
        cell_id: "3400e8a5-c55c-4aa6-a366-c23a3c7b5f63",
        word: 'menolak dengan halus',
        meaning_vi: 'từ chối nhẹ nhàng/lịch sự',
        meaning_en: 'refuse politely or tactfully',
        example: 'Kalau sudah kenyang, tolak dengan halus.',
        example_vi: 'Nếu đã no, hãy từ chối nhẹ nhàng.',
      },
      {
        cell_id: "63171bd9-afd3-4a5d-8c4d-6c9232ff2bef",
        word: 'pujian masakan',
        meaning_vi: 'lời khen món ăn/tài nấu ăn',
        meaning_en: 'compliment about cooking',
        example: 'Pujian masakan membuat tuan rumah senang.',
        example_vi: 'Lời khen món ăn làm chủ nhà vui.',
      },
      {
        cell_id: "e0dc8741-2fc1-47f7-8fee-e4786d7e8d2b",
        word: 'bumbu',
        meaning_vi: 'gia vị, hỗn hợp gia vị',
        meaning_en: 'seasoning or spice mixture',
        example: 'Bumbu rendangnya sangat harum.',
        example_vi: 'Gia vị món rendang rất thơm.',
      },
      {
        cell_id: "90fc7f19-bff6-41cb-b554-fdf1362c4c28",
        word: 'lauk',
        meaning_vi: 'món ăn kèm cơm',
        meaning_en: 'side dish eaten with rice',
        example: 'Ikan goreng ini cocok sebagai lauk.',
        example_vi: 'Cá chiên này hợp làm món ăn kèm cơm.',
      },
      {
        cell_id: "5f74e8a6-54f2-4eb1-af36-02b038638798",
        word: 'adat keluarga',
        meaning_vi: 'nếp nhà, phong tục gia đình',
        meaning_en: 'family custom',
        example: 'Setiap keluarga punya adat keluarga yang berbeda.',
        example_vi: 'Mỗi gia đình có nếp nhà khác nhau.',
      },
    ],
    dialogue: [
      {
        cell_id: "b3441f2f-98c8-42ed-a58a-fe6c84d9e88b",
        speaker: 'Tamu',
        line: 'Bu, saya membawa oleh-oleh kecil dari Vietnam.',
        vi: 'Cô/chị ơi, tôi mang một chút quà nhỏ từ Việt Nam.',
        en: 'Ma’am, I brought a small gift from Vietnam.',
      },
      {
        cell_id: "b526e93d-808e-43e8-8a14-eb5a8dce6791",
        speaker: 'Tuan Rumah',
        line: 'Wah, terima kasih. Ayo makan bersama dulu.',
        vi: 'Ôi, cảm ơn. Mình cùng ăn trước nhé.',
        en: 'Oh, thank you. Let’s eat together first.',
      },
      {
        cell_id: "acd32fe6-919a-4d17-aa1e-457a09977532",
        speaker: 'Tamu',
        line: 'Masakannya enak sekali. Bumbunya pas.',
        vi: 'Món ăn ngon quá. Gia vị vừa miệng.',
        en: 'The food is very delicious. The seasoning is just right.',
      },
      {
        cell_id: "f51a518c-c0d0-48c8-b875-65a654cf0d42",
        speaker: 'Tuan Rumah',
        line: 'Tambah lagi, ya. Jangan malu-malu.',
        vi: 'Lấy thêm nhé. Đừng ngại.',
        en: 'Have some more. Don’t be shy.',
      },
      {
        cell_id: "f2e41ee0-a890-4443-88b3-e73aa36bfc9c",
        speaker: 'Tamu',
        line: 'Terima kasih, saya mau sedikit saja. Saya sudah hampir kenyang.',
        vi: 'Cảm ơn, tôi chỉ lấy một chút thôi. Tôi gần no rồi.',
        en: 'Thank you, I will have just a little. I am almost full.',
      },
      {
        cell_id: "6fa66017-0dda-4554-ac8d-01313fc26ce9",
        speaker: 'Tuan Rumah',
        line: 'Baik. Kalau ada makanan yang tidak bisa dimakan, bilang saja.',
        vi: 'Được. Nếu có món nào không ăn được thì cứ nói nhé.',
        en: 'All right. If there is any food you cannot eat, just say so.',
      },
    ],
    cultural_notes_vi: [
      'Ở Indonesia, berbagi makanan với tetangga, teman kantor, hoặc keluarga besar là cách xây quan hệ rất tự nhiên.',
      'Khi đến nhà người khác, membawa oleh-oleh kecil được xem là chu đáo, nhưng không cần quá đắt. Đồ ăn đóng gói thường an toàn và dễ chia sẻ.',
      'Chủ nhà có thể mời tambah lagi nhiều lần. Nếu đã no, có thể từ chối nhẹ: Saya sudah kenyang, terima kasih hoặc Saya mau sedikit saja.',
      'Với dị ứng, kiêng tôn giáo, hoặc lý do sức khỏe, nên nói rõ và lịch sự: Maaf, saya tidak bisa makan... karena...',
      'Một số gia đình ăn kiểu lauk ở giữa bàn để mọi người lấy chung. Quan sát trước khi lấy món, dùng sendok saji nếu có, và tôn trọng adat keluarga.',
    ],
    cultural_notes_en: [
      'In Indonesia, sharing food with neighbors, coworkers, or extended family is a natural way to build relationships.',
      'When visiting someone’s home, bringing a small oleh-oleh is thoughtful, but it does not need to be expensive. Packaged food is often safe and easy to share.',
      'Hosts may offer tambah lagi several times. If you are full, refuse gently: Saya sudah kenyang, terima kasih or Saya mau sedikit saja.',
      'For allergies, religious restrictions, or health reasons, be clear and polite: Maaf, saya tidak bisa makan... karena...',
      'Some families place side dishes in the middle of the table for everyone to share. Observe first, use a serving spoon if available, and respect family customs.',
    ],
    tip_advice_vi: [
      'Lời khen an toàn: Masakannya enak sekali, Bumbunya pas, hoặc Saya suka rasanya.',
      'Từ chối mềm: Saya mau sedikit saja, Saya sudah kenyang, hoặc Maaf, saya tidak bisa makan kacang karena alergi.',
      'Khi được mời thêm, tambah lagi nghĩa là lấy thêm. Jangan malu-malu nghĩa là đừng ngại.',
      'Ở bàn ăn, dùng Boleh saya ambil...? để xin phép lấy món nếu không chắc cách ăn chung.',
    ],
    tip_advice_en: [
      'Safe compliments: Masakannya enak sekali, Bumbunya pas, or Saya suka rasanya.',
      'Gentle refusals: Saya mau sedikit saja, Saya sudah kenyang, or Maaf, saya tidak bisa makan kacang karena alergi.',
      'When offered more, tambah lagi means have more. Jangan malu-malu means don’t be shy.',
      'At the table, use Boleh saya ambil...? to ask permission to take a dish if you are unsure about shared eating.',
    ],
    exercises: [
      {
        type: 'fill_blank',
        prompt: 'Saya membawa ____ kecil untuk keluarga Ibu.',
        answer: 'oleh-oleh',
        explanation_vi: 'Oleh-oleh là quà nhỏ mang về hoặc mang khi đến thăm.',
        explanation_en: 'Oleh-oleh is a small gift brought back from travel or brought when visiting.',
      },
      {
        type: 'choice',
        prompt: 'Which phrase politely means “I will have just a little”?',
        answer: 'Saya mau sedikit saja.',
        explanation_vi: 'Sedikit saja nghĩa là chỉ một chút thôi, phù hợp khi từ chối thêm đồ ăn nhẹ nhàng.',
        explanation_en: 'Sedikit saja means just a little, useful for gently refusing more food.',
      },
      {
        type: 'translate',
        prompt: 'Translate to Indonesian: The cooking is very delicious.',
        answer: 'Masakannya enak sekali.',
        explanation_vi: 'Masakannya nói về món ăn/tài nấu của chủ nhà; enak sekali là rất ngon.',
        explanation_en: 'Masakannya refers to the host’s cooking; enak sekali means very delicious.',
      },
      {
        type: 'roleplay',
        prompt: 'You cannot eat peanuts because of an allergy. Refuse politely.',
        answer: 'Maaf, saya tidak bisa makan kacang karena alergi.',
        explanation_vi: 'Maaf mở đầu lịch sự; tidak bisa makan kacang nói rõ không ăn được đậu; karena alergi nêu lý do.',
        explanation_en: 'Maaf opens politely; tidak bisa makan kacang states you cannot eat peanuts; karena alergi gives the reason.',
      },
    ],
  },
];
