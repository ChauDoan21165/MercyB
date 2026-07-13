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
    id: 'farmers-market-organic',
    title: 'Pasar mingguan dan sayur organik',
    level: 'A2',
    topic: 'organic vegetables, local farmers, kilo prices, morning harvest, pesticide-free produce, regular customers, weekly market',
    vietnamese_title: 'Chợ nông sản và rau hữu cơ',
    english_title: 'Farmers Market Organic',
    pronunciation_focus: [
      'Sayur organik nghĩa là rau hữu cơ. Sayur là rau; organik đọc or-GA-nik.',
      'Petani lokal là nông dân địa phương. Lokal đứng sau danh từ, không đặt trước như tiếng Anh.',
      'Harga kiloan nghĩa là giá tính theo ký. Ở chợ, câu hỏi sống còn là Berapa sekilo?',
      'Panen pagi nghĩa là thu hoạch buổi sáng. Panen là thu hoạch; pagi là buổi sáng.',
      'Bebas pestisida nghĩa là không có thuốc trừ sâu. Bebas ở đây nghĩa là không chứa/miễn khỏi, không phải "tự do" chung chung.',
      'Langganan nghĩa là khách quen hoặc mối mua đều. Saya langganan di sini = Tôi hay mua ở đây.',
    ],
    pronunciation_focus_en: [
      'Sayur organik means organic vegetables. Sayur means vegetables; organik is pronounced or-GA-nik.',
      'Petani lokal means local farmer. Lokal follows the noun; do not place it before the noun as in English.',
      'Harga kiloan means price by the kilo. At markets, the essential question is Berapa sekilo?',
      'Panen pagi means morning harvest. Panen means harvest; pagi means morning.',
      'Bebas pestisida means pesticide-free. Bebas here means free from, not general personal freedom.',
      'Langganan means a regular customer or regular buying relationship. Saya langganan di sini = I buy here regularly.',
    ],
    sentences: [
      {
        en: 'Saya mau beli sayur organik di pasar mingguan.',
        vi: 'Tôi muốn mua rau hữu cơ ở chợ hằng tuần.',
        pronunciation: 'SA-ya mau be-LI SA-yur or-GA-nik di PA-sar MING-gu-an',
      },
      {
        en: 'Sayur ini dari petani lokal, ya?',
        vi: 'Rau này từ nông dân địa phương phải không?',
        pronunciation: 'SA-yur i-ni DA-ri pe-TA-ni LO-kal ya',
      },
      {
        en: 'Berapa harga kiloan untuk tomat organik?',
        vi: 'Giá theo ký cho cà chua hữu cơ là bao nhiêu?',
        pronunciation: 'be-RA-pa HAR-ga ki-LO-an UN-tuk TO-mat or-GA-nik',
      },
      {
        en: 'Ini panen pagi, jadi masih sangat segar.',
        vi: 'Đây là hàng thu hoạch buổi sáng, nên vẫn rất tươi.',
        pronunciation: 'I-ni PA-nen PA-gi JA-di MA-sih SA-ngat SE-gar',
      },
      {
        en: 'Apakah sayurnya bebas pestisida?',
        vi: 'Rau có không thuốc trừ sâu không?',
        pronunciation: 'a-PA-kah SA-yur-nya BE-bas pes-ti-SI-da',
      },
      {
        en: 'Kalau saya langganan, bisa pesan tiap minggu?',
        vi: 'Nếu tôi làm khách quen, có thể đặt mỗi tuần không?',
        pronunciation: 'KA-lau SA-ya lang-GA-nan BI-sa PE-san ti-AP MING-gu',
      },
      {
        en: 'Pasar mingguan ini buka setiap Sabtu pagi.',
        vi: 'Chợ hằng tuần này mở mỗi sáng thứ Bảy.',
        pronunciation: 'PA-sar MING-gu-an i-ni BU-ka se-TI-ap SAB-tu PA-gi',
      },
      {
        en: 'Saya ambil setengah kilo dulu untuk coba.',
        vi: 'Tôi lấy nửa ký trước để thử.',
        pronunciation: 'SA-ya AM-bil se-TE-ngah KI-lo DU-lu UN-tuk CO-ba',
      },
    ],
    vocabulary: [
      {
        cell_id: "fccda84e-0525-4521-94ef-ed53d6b44ab4",
        word: 'sayur organik',
        meaning_vi: 'rau hữu cơ',
        meaning_en: 'organic vegetables',
        example: 'Sayur organik biasanya lebih mahal sedikit.',
        example_vi: 'Rau hữu cơ thường đắt hơn một chút.',
      },
      {
        cell_id: "36217871-93ef-4ef3-86cb-d5d3557765db",
        word: 'petani lokal',
        meaning_vi: 'nông dân địa phương',
        meaning_en: 'local farmer',
        example: 'Pasar ini bekerja sama dengan petani lokal.',
        example_vi: 'Chợ này hợp tác với nông dân địa phương.',
      },
      {
        cell_id: "158548a9-3b9d-405e-956f-72c1fcf54bae",
        word: 'harga kiloan',
        meaning_vi: 'giá tính theo ký',
        meaning_en: 'price by the kilo',
        example: 'Harga kiloan cabai sedang naik.',
        example_vi: 'Giá ớt tính theo ký đang tăng.',
      },
      {
        cell_id: "84a5aea2-5cf7-471d-a079-a02033a6651f",
        word: 'panen pagi',
        meaning_vi: 'thu hoạch buổi sáng',
        meaning_en: 'morning harvest',
        example: 'Bayam ini panen pagi dari kebun dekat sini.',
        example_vi: 'Rau bina này được thu hoạch buổi sáng từ vườn gần đây.',
      },
      {
        cell_id: "2e181d3b-f05f-4dc8-bc09-dd483e8d6179",
        word: 'bebas pestisida',
        meaning_vi: 'không có thuốc trừ sâu',
        meaning_en: 'pesticide-free',
        example: 'Pelanggan sering bertanya apakah sayur ini bebas pestisida.',
        example_vi: 'Khách hàng thường hỏi rau này có không thuốc trừ sâu không.',
      },
      {
        cell_id: "6a402482-fcbf-4b94-b905-fa944a1fdf4a",
        word: 'langganan',
        meaning_vi: 'khách quen, mua đều',
        meaning_en: 'regular customer or subscription relationship',
        example: 'Saya sudah langganan telur organik di kios itu.',
        example_vi: 'Tôi đã là khách quen mua trứng hữu cơ ở quầy đó.',
      },
      {
        cell_id: "f64b6417-3f5e-4696-b789-f6f09ed02596",
        word: 'pasar mingguan',
        meaning_vi: 'chợ hằng tuần',
        meaning_en: 'weekly market',
        example: 'Pasar mingguan ramai pada Sabtu pagi.',
        example_vi: 'Chợ hằng tuần đông vào sáng thứ Bảy.',
      },
      {
        cell_id: "8bdcc54f-76c8-4eba-a5a6-37426f9920e7",
        word: 'setengah kilo',
        meaning_vi: 'nửa ký',
        meaning_en: 'half a kilo',
        example: 'Saya beli setengah kilo kacang panjang.',
        example_vi: 'Tôi mua nửa ký đậu đũa.',
      },
    ],
    dialogue: [
      {
        cell_id: "e8cd3b52-3ee9-4136-827c-f9a8564efd0a",
        speaker: 'Pembeli',
        line: 'Selamat pagi, Bu. Sayur organiknya panen pagi?',
        vi: 'Chào buổi sáng cô. Rau hữu cơ này thu hoạch sáng nay à?',
        en: 'Good morning. Are the organic vegetables harvested this morning?',
      },
      {
        cell_id: "f7e74619-d4b0-4322-85a6-aa90956aa219",
        speaker: 'Petani',
        line: 'Iya, ini dari kebun kami sendiri.',
        vi: 'Đúng, đây là từ vườn của chúng tôi.',
        en: 'Yes, these are from our own garden.',
      },
      {
        cell_id: "ade3ec66-6797-4eda-99aa-3b4aafd52911",
        speaker: 'Pembeli',
        line: 'Apakah bebas pestisida?',
        vi: 'Có không thuốc trừ sâu không?',
        en: 'Is it pesticide-free?',
      },
      {
        cell_id: "8c945c13-48e6-4fcf-a64c-067a200000f3",
        speaker: 'Petani',
        line: 'Kami tidak pakai pestisida kimia. Harganya tiga puluh ribu sekilo.',
        vi: 'Chúng tôi không dùng thuốc trừ sâu hóa học. Giá ba mươi nghìn một ký.',
        en: 'We do not use chemical pesticides. The price is thirty thousand per kilo.',
      },
      {
        cell_id: "a13dc305-fdc0-4557-a6b7-c4e81f2fb768",
        speaker: 'Pembeli',
        line: 'Saya ambil setengah kilo dulu. Kalau cocok, saya mau langganan.',
        vi: 'Tôi lấy nửa ký trước. Nếu hợp, tôi muốn mua đều.',
        en: 'I will take half a kilo first. If it works for me, I want to become a regular customer.',
      },
      {
        cell_id: "0d11c946-8f15-4bb0-8c4a-7797b5744896",
        speaker: 'Petani',
        line: 'Bisa, nanti kami kabari jadwal pasar mingguan.',
        vi: 'Được, lát nữa chúng tôi sẽ báo lịch chợ hằng tuần.',
        en: 'Sure, we will let you know the weekly market schedule.',
      },
    ],
    cultural_notes_vi: [
      'Pasar mingguan hoặc pasar tani ở Indonesia có thể bán rau, buah, telur, madu, kopi, hoặc produk rumahan từ petani lokal và usaha kecil.',
      'Từ organik có thể được dùng rộng rãi trong đời sống. Nếu cần chắc chắn, hỏi apakah bersertifikat organik hoặc apakah bebas pestisida.',
      'Ở chợ, mua theo kiloan rất phổ biến. Với rau lá, cũng có thể nghe ikat, nghĩa là một bó.',
      'Langganan với petani atau kios có thể giúp bạn được báo trước khi panen baru, stok terbatas, atau harga berubah.',
    ],
    cultural_notes_en: [
      'Weekly markets or farmers markets in Indonesia may sell vegetables, fruit, eggs, honey, coffee, or homemade products from local farmers and small businesses.',
      'The word organik can be used broadly in daily life. If you need certainty, ask whether it is certified organic or pesticide-free.',
      'At markets, buying by the kilo is common. For leafy greens, you may also hear ikat, meaning a bunch.',
      'Being a regular customer with a farmer or stall can help you get updates about new harvests, limited stock, or price changes.',
    ],
    tip_advice_vi: [
      'Câu hỏi chợ hữu ích: Berapa sekilo? Apakah bebas pestisida? Ini panen pagi? Bisa langganan?',
      'Để hỏi nguồn gốc, dùng Dari petani lokal? hoặc Dari kebun mana?',
      'Phân biệt segar = tươi, organik = hữu cơ, bebas pestisida = không thuốc trừ sâu.',
      'Khi mua thử, nói Saya ambil setengah kilo dulu untuk coba nghe tự nhiên và lịch sự.',
    ],
    tip_advice_en: [
      'Useful market questions: Berapa sekilo? Apakah bebas pestisida? Ini panen pagi? Bisa langganan?',
      'To ask the source, use Dari petani lokal? or Dari kebun mana?',
      'Separate segar = fresh, organik = organic, and bebas pestisida = pesticide-free.',
      'When buying a trial amount, Saya ambil setengah kilo dulu untuk coba sounds natural and polite.',
    ],
    exercises: [
      {
        type: 'fill_blank',
        prompt: 'Apakah sayurnya bebas ____?',
        answer: 'pestisida',
        explanation_vi: 'Bebas pestisida nghĩa là không có thuốc trừ sâu.',
        explanation_en: 'Bebas pestisida means pesticide-free.',
      },
      {
        type: 'choice',
        prompt: 'Which phrase means “local farmer”?',
        answer: 'petani lokal',
        explanation_vi: 'Petani là nông dân, lokal là địa phương và đứng sau danh từ.',
        explanation_en: 'Petani means farmer, and lokal means local; it follows the noun.',
      },
      {
        type: 'translate',
        prompt: 'Translate to Indonesian: How much is the price per kilo?',
        answer: 'Berapa harga kiloan?',
        explanation_vi: 'Berapa hỏi giá; harga kiloan là giá tính theo ký.',
        explanation_en: 'Berapa asks the price; harga kiloan means price by the kilo.',
      },
      {
        type: 'roleplay',
        prompt: 'Say you want half a kilo first to try.',
        answer: 'Saya ambil setengah kilo dulu untuk coba.',
        explanation_vi: 'Setengah kilo là nửa ký; dulu nghĩa là trước đã; untuk coba là để thử.',
        explanation_en: 'Setengah kilo means half a kilo; dulu means first; untuk coba means to try.',
      },
    ],
  },
];
