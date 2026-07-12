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
    id: 'negotiating-rent-contract',
    title: 'Negosiasi kontrak sewa rumah',
    level: 'B1',
    topic: 'rental contract, lease term, rent increase, contract renewal, deposit, home repairs, negotiation, signature',
    vietnamese_title: 'Thương lượng hợp đồng thuê nhà',
    english_title: 'Negotiating a Rent Contract',
    pronunciation_focus: [
      'Kontrak sewa nghĩa là hợp đồng thuê. Sewa có thể là danh từ "tiền thuê/việc thuê" hoặc gốc động từ.',
      'Masa sewa nghĩa là thời hạn thuê. Masa ở đây là khoảng thời gian, không phải "masa" như số nhiều trong tiếng Anh.',
      'Naik harga nghĩa là tăng giá. Khi nói tiền thuê tăng, tự nhiên hơn là uang sewa naik hoặc harga sewanya naik.',
      'Perpanjang kontrak nghĩa là gia hạn hợp đồng. Perpanjang berasal dari panjang, nghĩa là làm dài thêm.',
      'Deposit hoặc uang jaminan là tiền cọc. Hỏi rõ apakah bisa dikembalikan để tránh hiểu nhầm.',
      'Tanda tangan là chữ ký/ký tên. Trong hợp đồng, dùng menandatangani kontrak cho "ký hợp đồng".',
    ],
    pronunciation_focus_en: [
      'Kontrak sewa means rental contract. Sewa can be a noun for rent/rental or a root related to renting.',
      'Masa sewa means lease term. Masa here means a period of time, not English "mass."',
      'Naik harga means price increase. For rent, uang sewa naik or harga sewanya naik sounds natural.',
      'Perpanjang kontrak means extend a contract. Perpanjang comes from panjang, meaning to make longer.',
      'Deposit or uang jaminan means deposit. Ask clearly whether it can be returned to avoid misunderstandings.',
      'Tanda tangan means signature or signing. In contracts, use menandatangani kontrak for "sign a contract."',
    ],
    sentences: [
      {
        en: 'Saya ingin membahas kontrak sewa sebelum tanda tangan.',
        vi: 'Tôi muốn thảo luận hợp đồng thuê trước khi ký.',
        pronunciation: 'SA-ya I-ngin mem-BA-has KON-trak SE-wa se-BE-lum TAN-da TA-ngan',
      },
      {
        en: 'Masa sewa di kontrak ini satu tahun.',
        vi: 'Thời hạn thuê trong hợp đồng này là một năm.',
        pronunciation: 'MA-sa SE-wa di KON-trak i-ni SA-tu TA-hun',
      },
      {
        en: 'Apakah harga sewa akan naik tahun depan?',
        vi: 'Giá thuê có tăng vào năm sau không?',
        pronunciation: 'a-PA-kah HAR-ga SE-wa A-kan naik TA-hun de-PAN',
      },
      {
        en: 'Bisa perpanjang kontrak dengan harga yang sama?',
        vi: 'Có thể gia hạn hợp đồng với giá cũ/giá như nhau không?',
        pronunciation: 'BI-sa per-PAN-jang KON-trak de-NGAN HAR-ga yang SA-ma',
      },
      {
        en: 'Deposit akan dikembalikan kalau tidak ada kerusakan.',
        vi: 'Tiền cọc sẽ được trả lại nếu không có hư hỏng.',
        pronunciation: 'DE-po-sit A-kan di-kem-BA-li-kan KA-lau TI-dak A-da ke-ru-SA-kan',
      },
      {
        en: 'Perbaikan rumah sebaiknya ditulis di kontrak.',
        vi: 'Việc sửa chữa nhà tốt nhất nên được ghi trong hợp đồng.',
        pronunciation: 'per-BAI-kan RU-mah se-BAIK-nya di-TU-lis di KON-trak',
      },
      {
        en: 'Saya mau negosiasi sebelum menyetujui kenaikan harga.',
        vi: 'Tôi muốn thương lượng trước khi đồng ý việc tăng giá.',
        pronunciation: 'SA-ya mau ne-go-si-A-si se-BE-lum me-nye-tu-JU-i ke-NAI-kan HAR-ga',
      },
      {
        en: 'Mohon kirim salinan kontrak setelah ditandatangani.',
        vi: 'Xin gửi bản sao hợp đồng sau khi đã ký.',
        pronunciation: 'MO-hon KI-rim sa-LI-nan KON-trak se-TE-lah di-tan-da-ta-NGA-ni',
      },
    ],
    vocabulary: [
      {
        cell_id: "dba73c5a-1880-489b-8c4c-ca06d414aeac",
        word: 'kontrak sewa',
        meaning_vi: 'hợp đồng thuê',
        meaning_en: 'rental contract',
        example: 'Kontrak sewa perlu dibaca dengan teliti.',
        example_vi: 'Hợp đồng thuê cần được đọc kỹ.',
      },
      {
        cell_id: "cf5e81cb-9c53-466a-b65f-8b5454752c7f",
        word: 'masa sewa',
        meaning_vi: 'thời hạn thuê',
        meaning_en: 'lease term',
        example: 'Masa sewa berakhir bulan Desember.',
        example_vi: 'Thời hạn thuê kết thúc vào tháng Mười Hai.',
      },
      {
        cell_id: "a76df159-4cfd-4a47-9633-9f519c815236",
        word: 'naik harga',
        meaning_vi: 'tăng giá',
        meaning_en: 'price increase',
        example: 'Pemilik rumah ingin naik harga tahun depan.',
        example_vi: 'Chủ nhà muốn tăng giá vào năm sau.',
      },
      {
        cell_id: "e7e943cf-9a96-4b6e-b319-8dcfebac9d48",
        word: 'perpanjang kontrak',
        meaning_vi: 'gia hạn hợp đồng',
        meaning_en: 'extend or renew a contract',
        example: 'Kami mau perpanjang kontrak selama enam bulan.',
        example_vi: 'Chúng tôi muốn gia hạn hợp đồng trong sáu tháng.',
      },
      {
        cell_id: "9cf963f6-7a64-455e-837a-8af237db1103",
        word: 'deposit',
        meaning_vi: 'tiền cọc',
        meaning_en: 'deposit',
        example: 'Deposit dibayar saat tanda tangan kontrak.',
        example_vi: 'Tiền cọc được trả khi ký hợp đồng.',
      },
      {
        cell_id: "17f17015-d127-4bf5-8f8c-325f860f3ed6",
        word: 'perbaikan rumah',
        meaning_vi: 'sửa chữa nhà',
        meaning_en: 'home repairs',
        example: 'Perbaikan rumah menjadi tanggung jawab pemilik.',
        example_vi: 'Việc sửa chữa nhà là trách nhiệm của chủ nhà.',
      },
      {
        cell_id: "8cc11c87-006d-4c7a-bcfb-98b10d609ea3",
        word: 'negosiasi',
        meaning_vi: 'thương lượng, đàm phán',
        meaning_en: 'negotiation',
        example: 'Negosiasi harga dilakukan sebelum kontrak ditandatangani.',
        example_vi: 'Việc thương lượng giá được thực hiện trước khi hợp đồng được ký.',
      },
      {
        cell_id: "5a302768-cca4-4957-bffa-0f67dc8d44d2",
        word: 'tanda tangan',
        meaning_vi: 'chữ ký, ký tên',
        meaning_en: 'signature or signing',
        example: 'Tolong beri tanda tangan di halaman terakhir.',
        example_vi: 'Vui lòng ký tên ở trang cuối.',
      },
    ],
    dialogue: [
      {
        cell_id: "fb11236b-8f03-4d2b-a32a-754c26679ff8",
        speaker: 'Penyewa',
        line: 'Pak, saya ingin membahas kontrak sewa sebelum tanda tangan.',
        vi: 'Anh/chú ơi, tôi muốn thảo luận hợp đồng thuê trước khi ký.',
        en: 'Sir, I would like to discuss the rental contract before signing.',
      },
      {
        cell_id: "a57b75cf-7517-418f-9f67-16d5e20bfbb5",
        speaker: 'Pemilik Rumah',
        line: 'Boleh. Bagian mana yang ingin dibahas?',
        vi: 'Được. Phần nào muốn thảo luận?',
        en: 'Sure. Which part would you like to discuss?',
      },
      {
        cell_id: "cc826236-2233-46b6-a763-22ffc405d798",
        speaker: 'Penyewa',
        line: 'Saya mau memastikan masa sewa dan aturan deposit.',
        vi: 'Tôi muốn xác nhận thời hạn thuê và quy định tiền cọc.',
        en: 'I want to confirm the lease term and deposit rules.',
      },
      {
        cell_id: "adb90a71-eaff-4831-a750-f004289a7734",
        speaker: 'Pemilik Rumah',
        line: 'Masa sewa satu tahun. Deposit dikembalikan kalau tidak ada kerusakan.',
        vi: 'Thời hạn thuê là một năm. Tiền cọc được trả lại nếu không có hư hỏng.',
        en: 'The lease term is one year. The deposit is returned if there is no damage.',
      },
      {
        cell_id: "cfb1168e-ccb6-47dc-9667-f644e4bb3422",
        speaker: 'Penyewa',
        line: 'Kalau tahun depan harga sewa naik, apakah bisa negosiasi dulu?',
        vi: 'Nếu năm sau giá thuê tăng, có thể thương lượng trước không?',
        en: 'If the rent increases next year, can we negotiate first?',
      },
      {
        cell_id: "0a1f3633-4f1a-4667-8f43-6b2903d12e88",
        speaker: 'Pemilik Rumah',
        line: 'Bisa. Kita tulis syarat perpanjang kontrak di sini.',
        vi: 'Có thể. Chúng ta ghi điều kiện gia hạn hợp đồng ở đây.',
        en: 'Yes. We will write the renewal terms here.',
      },
    ],
    cultural_notes_vi: [
      'Ở Indonesia, hợp đồng thuê có thể gọi là kontrak sewa, surat perjanjian sewa, hoặc perjanjian kontrakan, tùy loại nhà và mức độ trang trọng.',
      'Deposit cũng có thể gọi là uang jaminan. Nên hỏi rõ điều kiện hoàn cọc, kerusakan apa saja, và kapan uang dikembalikan.',
      'Nếu có perbaikan rumah, nên ghi siapa yang bertanggung jawab: pemilik rumah hoặc penyewa. Ghi trong hợp đồng giúp tránh tranh cãi.',
      'Khi negosiasi với chủ nhà, cách nói mềm như apakah bisa..., mohon dipertimbangkan, và sebelum tanda tangan giúp câu nghe lịch sự hơn.',
    ],
    cultural_notes_en: [
      'In Indonesia, a rental contract may be called kontrak sewa, surat perjanjian sewa, or perjanjian kontrakan depending on the housing type and formality.',
      'Deposit may also be called uang jaminan. Ask clearly about refund conditions, what counts as damage, and when the money is returned.',
      'For home repairs, write who is responsible: the landlord or the tenant. Putting it in the contract helps avoid disputes.',
      'When negotiating with a landlord, soft frames like apakah bisa..., mohon dipertimbangkan, and sebelum tanda tangan sound more polite.',
    ],
    tip_advice_vi: [
      'Cụm cần nhớ: kontrak sewa, masa sewa, perpanjang kontrak, deposit dikembalikan, perbaikan rumah, dan tanda tangan.',
      'Khi hỏi tăng giá, nói: Apakah harga sewa akan naik tahun depan? Nếu muốn thương lượng: Bisa negosiasi dulu?',
      'Dikembalikan là bị động "được trả lại". Rất hữu ích khi hỏi về deposit: Apakah deposit bisa dikembalikan?',
      'Trước khi ký, yêu cầu bản sao: Mohon kirim salinan kontrak setelah ditandatangani.',
    ],
    tip_advice_en: [
      'Remember these chunks: kontrak sewa, masa sewa, perpanjang kontrak, deposit dikembalikan, perbaikan rumah, and tanda tangan.',
      'To ask about price increases, say: Apakah harga sewa akan naik tahun depan? To negotiate: Bisa negosiasi dulu?',
      'Dikembalikan is the passive "returned/refunded." It is very useful for deposits: Apakah deposit bisa dikembalikan?',
      'Before signing, request a copy: Mohon kirim salinan kontrak setelah ditandatangani.',
    ],
    exercises: [
      {
        type: 'fill_blank',
        prompt: 'Masa ____ di kontrak ini satu tahun.',
        answer: 'sewa',
        explanation_vi: 'Masa sewa nghĩa là thời hạn thuê.',
        explanation_en: 'Masa sewa means lease term.',
      },
      {
        type: 'choice',
        prompt: 'Which phrase means “extend the contract”?',
        answer: 'perpanjang kontrak',
        explanation_vi: 'Perpanjang nghĩa là làm dài thêm/gia hạn; kontrak là hợp đồng.',
        explanation_en: 'Perpanjang means extend or make longer; kontrak means contract.',
      },
      {
        type: 'translate',
        prompt: 'Translate to Indonesian: Can the deposit be returned?',
        answer: 'Apakah deposit bisa dikembalikan?',
        explanation_vi: 'Dikembalikan là "được trả lại", phù hợp khi hỏi về tiền cọc.',
        explanation_en: 'Dikembalikan means "be returned/refunded," which fits asking about a deposit.',
      },
      {
        type: 'roleplay',
        prompt: 'Ask the landlord to send a copy of the contract after it is signed.',
        answer: 'Mohon kirim salinan kontrak setelah ditandatangani.',
        explanation_vi: 'Mohon kirim là cách yêu cầu lịch sự; salinan kontrak là bản sao hợp đồng.',
        explanation_en: 'Mohon kirim is a polite request; salinan kontrak means copy of the contract.',
      },
    ],
  },
];
