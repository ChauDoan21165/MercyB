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
    id: 'advanced-story-retelling',
    title: 'Menceritakan ulang cerita dengan runtut',
    level: 'B2',
    topic: 'story retelling, plot, main character, conflict, point of view, summary, moral message, narrative style',
    vietnamese_title: 'Kể lại câu chuyện nâng cao',
    english_title: 'Advanced Story Retelling',
    pronunciation_focus: [
      'Menceritakan ulang nghĩa là kể lại. Ulang nghĩa là lặp lại/làm lại, nên bukan hanya "kể chuyện mới".',
      'Alur cerita là mạch truyện/cốt truyện. Jangan terjemahkan "plot" thành rencana; rencana là kế hoạch.',
      'Tokoh utama là nhân vật chính. Tokoh dùng nhiều trong phân tích truyện hơn karakter.',
      'Sudut pandang là góc nhìn/ngôi kể. Sudut = góc, pandang = nhìn; cụm này rất quan trọng khi phân tích narasi.',
      'Ringkasan là bản tóm tắt. Merangkum là động từ "tóm tắt"; ringkas berarti ngắn gọn.',
      'Pesan moral hoặc amanat là thông điệp/bài học của câu chuyện, không nhất thiết phải nói quá lộ liễu.',
    ],
    pronunciation_focus_en: [
      'Menceritakan ulang means to retell. Ulang means again/repeat, so this is not creating a new story.',
      'Alur cerita means plot or story flow. Do not translate "plot" as rencana; rencana means plan.',
      'Tokoh utama means main character. Tokoh is more common in story analysis than karakter.',
      'Sudut pandang means point of view. Sudut means angle, pandang means view; this phrase is central in narrative analysis.',
      'Ringkasan means summary. Merangkum is the verb "to summarize"; ringkas means concise.',
      'Pesan moral or amanat is the moral message of a story, but it does not always need to be stated too directly.',
    ],
    sentences: [
      {
        en: 'Saya akan menceritakan ulang cerita ini dengan bahasa saya sendiri.',
        vi: 'Tôi sẽ kể lại câu chuyện này bằng lời của chính tôi.',
        pronunciation: 'SA-ya A-kan men-ce-RI-ta-kan U-lang ce-RI-ta i-ni de-NGAN ba-HA-sa SA-ya sen-DI-ri',
      },
      {
        en: 'Alur ceritanya bergerak dari perkenalan tokoh ke konflik utama.',
        vi: 'Mạch truyện đi từ phần giới thiệu nhân vật đến xung đột chính.',
        pronunciation: 'A-lur ce-RI-ta-nya ber-GE-rak DA-ri per-ke-NA-lan TO-koh ke KON-flik u-TA-ma',
      },
      {
        en: 'Tokoh utama digambarkan sebagai orang yang sabar tetapi tegas.',
        vi: 'Nhân vật chính được miêu tả là người kiên nhẫn nhưng quyết đoán.',
        pronunciation: 'TO-koh u-TA-ma di-GAM-bar-kan se-BA-gai O-rang yang SA-bar te-TA-pi TE-gas',
      },
      {
        en: 'Konflik muncul ketika tokoh itu harus memilih antara keluarga dan pekerjaan.',
        vi: 'Xung đột xuất hiện khi nhân vật đó phải chọn giữa gia đình và công việc.',
        pronunciation: 'KON-flik MUN-cul ke-TI-ka TO-koh i-tu HA-rus me-MI-lih an-TA-ra ke-LU-ar-ga dan pe-KER-ja-an',
      },
      {
        en: 'Cerita ini memakai sudut pandang orang pertama.',
        vi: 'Câu chuyện này dùng ngôi kể/góc nhìn thứ nhất.',
        pronunciation: 'ce-RI-ta i-ni me-MA-kai SU-dut PAN-dang O-rang per-TA-ma',
      },
      {
        en: 'Ringkasan yang baik tidak memasukkan semua detail kecil.',
        vi: 'Một bản tóm tắt tốt không đưa vào mọi chi tiết nhỏ.',
        pronunciation: 'ring-KA-san yang BA-ik TI-dak me-ma-SUK-kan se-MU-a de-TAIL ke-CIL',
      },
      {
        en: 'Pesan moralnya adalah keberanian harus disertai tanggung jawab.',
        vi: 'Thông điệp đạo đức của nó là lòng dũng cảm phải đi kèm trách nhiệm.',
        pronunciation: 'PE-san mo-RAL-nya A-da-lah ke-be-RA-ni-an HA-rus di-ser-TA-i tang-GUNG JA-wab',
      },
      {
        en: 'Gaya narasinya tenang, tetapi akhir ceritanya sangat kuat.',
        vi: 'Phong cách kể chuyện điềm tĩnh, nhưng kết truyện rất mạnh.',
        pronunciation: 'GA-ya na-RA-si-nya te-NANG te-TA-pi A-khir ce-RI-ta-nya SA-ngat KU-at',
      },
    ],
    vocabulary: [
      {
        cell_id: "aa75f7d9-061a-4e1b-9747-cbe535b10c1f",
        word: 'menceritakan ulang',
        meaning_vi: 'kể lại',
        meaning_en: 'retell',
        example: 'Siswa diminta menceritakan ulang dongeng itu.',
        example_vi: 'Học sinh được yêu cầu kể lại truyện cổ tích đó.',
      },
      {
        cell_id: "cbaa14a4-3d68-438c-8249-a3b6dbc07fa0",
        word: 'alur cerita',
        meaning_vi: 'mạch truyện, cốt truyện',
        meaning_en: 'plot or story flow',
        example: 'Alur cerita novel ini maju mundur.',
        example_vi: 'Mạch truyện của tiểu thuyết này đi qua lại giữa hiện tại và quá khứ.',
      },
      {
        cell_id: "f1930589-769d-46fd-b3fc-922bef183015",
        word: 'tokoh utama',
        meaning_vi: 'nhân vật chính',
        meaning_en: 'main character',
        example: 'Tokoh utama berubah setelah menghadapi konflik.',
        example_vi: 'Nhân vật chính thay đổi sau khi đối mặt với xung đột.',
      },
      {
        cell_id: "d1a7bf86-cd9c-4120-89af-3b066ddf63a2",
        word: 'konflik',
        meaning_vi: 'xung đột',
        meaning_en: 'conflict',
        example: 'Konflik dalam cerita ini berasal dari salah paham.',
        example_vi: 'Xung đột trong câu chuyện này xuất phát từ hiểu lầm.',
      },
      {
        cell_id: "df40c859-7bfa-4a47-8404-e2d569a18dcb",
        word: 'sudut pandang',
        meaning_vi: 'góc nhìn, ngôi kể',
        meaning_en: 'point of view',
        example: 'Sudut pandang orang pertama membuat cerita terasa pribadi.',
        example_vi: 'Ngôi kể thứ nhất làm câu chuyện có cảm giác cá nhân.',
      },
      {
        cell_id: "cd3eb48a-9377-49af-b7c7-c911690944de",
        word: 'ringkasan',
        meaning_vi: 'bản tóm tắt',
        meaning_en: 'summary',
        example: 'Ringkasan harus singkat tetapi jelas.',
        example_vi: 'Bản tóm tắt phải ngắn gọn nhưng rõ ràng.',
      },
      {
        cell_id: "2b0ff936-0b97-406c-9b74-6f07b832b73d",
        word: 'pesan moral',
        meaning_vi: 'thông điệp đạo đức, bài học',
        meaning_en: 'moral message',
        example: 'Pesan moral cerita itu tidak disampaikan secara langsung.',
        example_vi: 'Thông điệp của câu chuyện đó không được truyền đạt trực tiếp.',
      },
      {
        cell_id: "888a5c23-d3a4-4c0e-8fd0-3fcd488526a9",
        word: 'gaya narasi',
        meaning_vi: 'phong cách kể chuyện',
        meaning_en: 'narrative style',
        example: 'Gaya narasinya sederhana dan mudah diikuti.',
        example_vi: 'Phong cách kể chuyện của nó đơn giản và dễ theo dõi.',
      },
    ],
    dialogue: [
      {
        cell_id: "25da4e29-b83b-4b9d-85c2-d7327155a756",
        speaker: 'Guru',
        line: 'Coba ceritakan ulang isi cerita ini secara singkat.',
        vi: 'Hãy thử kể lại nội dung câu chuyện này một cách ngắn gọn.',
        en: 'Try retelling the content of this story briefly.',
      },
      {
        cell_id: "926b30f1-7895-4d5d-a270-3774ec602919",
        speaker: 'Siswa',
        line: 'Baik. Cerita ini tentang seorang anak yang mencari ayahnya.',
        vi: 'Vâng. Câu chuyện này nói về một đứa trẻ đi tìm cha của mình.',
        en: 'All right. This story is about a child looking for his father.',
      },
      {
        cell_id: "1470135d-86b8-4b9d-9bac-091699cfba0c",
        speaker: 'Guru',
        line: 'Bagaimana alur cerita dan konflik utamanya?',
        vi: 'Mạch truyện và xung đột chính như thế nào?',
        en: 'What are the plot and main conflict like?',
      },
      {
        cell_id: "749c1cc1-e1e9-45eb-b197-bcef41015cf0",
        speaker: 'Siswa',
        line: 'Alurnya maju. Konflik muncul ketika tokoh utama kehilangan petunjuk penting.',
        vi: 'Mạch truyện tiến theo thời gian. Xung đột xuất hiện khi nhân vật chính mất manh mối quan trọng.',
        en: 'The plot is chronological. The conflict appears when the main character loses an important clue.',
      },
      {
        cell_id: "245438df-c0fe-4ab6-b153-f851f9caac4e",
        speaker: 'Guru',
        line: 'Menurutmu, apa pesan moralnya?',
        vi: 'Theo em, thông điệp/bài học là gì?',
        en: 'In your opinion, what is the moral message?',
      },
      {
        cell_id: "e6e96891-7768-4489-8027-5e98043f2b43",
        speaker: 'Siswa',
        line: 'Pesan moralnya adalah keluarga dan kejujuran lebih penting daripada rasa takut.',
        vi: 'Thông điệp là gia đình và sự trung thực quan trọng hơn nỗi sợ.',
        en: 'The moral message is that family and honesty are more important than fear.',
      },
    ],
    cultural_notes_vi: [
      'Trong lớp Bahasa Indonesia, học sinh thường diminta menceritakan ulang cerita hoặc teks bacaan bằng bahasa sendiri, bukan menyalin kalimat asli.',
      'Các yếu tố phân tích truyện thường gồm tokoh, alur, latar, konflik, sudut pandang, tema, amanat/pesan moral, và gaya bahasa.',
      'Ringkasan tiếng Indonesia nên giữ inti cerita: siapa tokohnya, apa masalahnya, bagaimana penyelesaiannya, dan apa pesan moralnya.',
      'Khi nhận xét văn học, dùng menurut saya, bagian yang paling kuat adalah..., dan pesan moralnya... để câu nghe học thuật nhưng vẫn tự nhiên.',
    ],
    cultural_notes_en: [
      'In Indonesian language classes, students are often asked to retell a story or reading text in their own words, not copy the original sentences.',
      'Common story-analysis elements include characters, plot, setting, conflict, point of view, theme, moral/message, and language style.',
      'An Indonesian summary should keep the core: who the character is, what the problem is, how it is resolved, and what the moral message is.',
      'When commenting on literature, use menurut saya, bagian yang paling kuat adalah..., and pesan moralnya... to sound academic but natural.',
    ],
    tip_advice_vi: [
      'Khung kể lại: Cerita ini tentang..., Tokoh utamanya..., Konflik muncul ketika..., Akhirnya..., Pesan moralnya...',
      'Đừng kể lại mọi chi tiết. Ringkasan yang baik chọn inti cerita và bỏ detail kecil.',
      'Phân biệt menceritakan ulang và merangkum: menceritakan ulang có thể dài hơn và giàu chi tiết; merangkum là tóm tắt ngắn.',
      'Khi nói "the point of view", dùng sudut pandang, không dịch thành pandangan saja.',
    ],
    tip_advice_en: [
      'Retelling frame: Cerita ini tentang..., Tokoh utamanya..., Konflik muncul ketika..., Akhirnya..., Pesan moralnya...',
      'Do not retell every detail. A good summary selects the core story and leaves out small details.',
      'Distinguish menceritakan ulang and merangkum: retelling can be longer and richer; summarizing is brief.',
      'For "point of view," use sudut pandang, not just pandangan.',
    ],
    exercises: [
      {
        type: 'fill_blank',
        prompt: 'Saya akan menceritakan ____ cerita ini dengan bahasa saya sendiri.',
        answer: 'ulang',
        explanation_vi: 'Menceritakan ulang nghĩa là kể lại một câu chuyện đã có.',
        explanation_en: 'Menceritakan ulang means retelling an existing story.',
      },
      {
        type: 'choice',
        prompt: 'Which phrase means “point of view” in story analysis?',
        answer: 'sudut pandang',
        explanation_vi: 'Sudut pandang là góc nhìn/ngôi kể trong phân tích truyện.',
        explanation_en: 'Sudut pandang means point of view in story analysis.',
      },
      {
        type: 'translate',
        prompt: 'Translate to Indonesian: The main character faces a big conflict.',
        answer: 'Tokoh utama menghadapi konflik besar.',
        explanation_vi: 'Tokoh utama là nhân vật chính; menghadapi là đối mặt; konflik besar là xung đột lớn.',
        explanation_en: 'Tokoh utama is main character; menghadapi is to face; konflik besar is a big conflict.',
      },
      {
        type: 'roleplay',
        prompt: 'Summarize a story by saying it is about a child who loses an important clue.',
        answer: 'Cerita ini tentang seorang anak yang kehilangan petunjuk penting.',
        explanation_vi: 'Cerita ini tentang... là khung mở đầu tóm tắt; petunjuk penting là manh mối quan trọng.',
        explanation_en: 'Cerita ini tentang... is a summary opener; petunjuk penting means important clue.',
      },
    ],
  },
];
