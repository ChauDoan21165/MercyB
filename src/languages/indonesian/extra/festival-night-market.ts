// Indonesian extra lesson pack: festival and night market language for Vietnamese learners.

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

interface LessonSentence {
  id: string;
  en: string;
  vi: string;
  pronunciation?: string;
  pronunciation_focus?: string[];
  pronunciation_focus_en?: string[];
}

interface VocabEntry {
  cell_id?: string;
  word: string;
  meaning_vi: string;
  meaning_en: string;
  example: string;
  example_vi: string;
}

interface DialogueLine {
  cell_id?: string;
  speaker: string;
  line: string;
  vi: string;
  en: string;
}

interface Exercise {
  id: string;
  type: "translation" | "fill_blank" | "roleplay" | "matching";
  prompt_vi: string;
  prompt_en: string;
  answer: string;
}

interface IndonesianLesson {
  id: string;
  title: string;
  title_vi: string;
  title_en: string;
  level: IndonesianCefrLevel;
  category: string;
  cultural_notes_vi: string[];
  cultural_notes_en: string[];
  sentences: LessonSentence[];
  vocabulary: VocabEntry[];
  dialogue: DialogueLine[];
  exercises: Exercise[];
  tips_vi: string[];
  tips_en: string[];
}

export const festivalNightMarketLessons: IndonesianLesson[] = [
  {
    id: "indonesian_festival_night_market_basics",
    title: "Pasar Malam dan Festival",
    title_vi: "Chợ đêm và lễ hội",
    title_en: "Night Markets and Festivals",
    level: "A2",
    category: "entertainment",
    cultural_notes_vi: [
      "Pasar malam ở Indonesia thường có gian đồ ăn, trò chơi nhỏ, sân khấu giải trí, và đôi khi có vé vào cổng riêng.",
      "Khi nơi đó ramai, hãy giữ barang bawaan như điện thoại, ví, túi nhỏ ở phía trước người.",
      "Tiket masuk là vé vào khu festival; vé cho từng wahana hoặc trò chơi có thể bán riêng.",
    ],
    cultural_notes_en: [
      "Indonesian night markets often have food stalls, small games, entertainment stages, and sometimes a separate entrance ticket.",
      "When a place is crowded, keep belongings such as your phone, wallet, and small bag in front of you.",
      "Tiket masuk is the entrance ticket; ride or game tickets may be sold separately.",
    ],
    sentences: [
      {
        id: "festival_basic_1",
        en: "Malam ini saya mau pergi ke pasar malam.",
        vi: "Tối nay tôi muốn đi chợ đêm.",
        pronunciation: "MA-lam i-ni SA-ya mau PER-gi ke PA-sar MA-lam.",
        pronunciation_focus: [
          "Dùng pergi ke cho hướng đi: đi đến chợ đêm. Khi đã ở đó, dùng di pasar malam.",
          "Pasar malam nghĩa là chợ đêm, không phải chỉ là chợ mở buổi tối trong nhà.",
        ],
        pronunciation_focus_en: [
          "Use pergi ke for direction: going to the night market. Once you are there, use di pasar malam.",
          "Pasar malam means a night market or fair-like evening market, not just any indoor market at night.",
        ],
      },
      {
        id: "festival_basic_2",
        en: "Apakah ada tiket masuk untuk festival ini?",
        vi: "Lễ hội này có vé vào cổng không?",
        pronunciation: "A-pa-kah A-da TI-ket MA-suk un-tuk FES-ti-val i-ni?",
        pronunciation_focus: [
          "Tiket masuk là vé vào cổng; nếu nói tiket saja, người nghe có thể hỏi vé cho phần nào.",
          "Masuk ở đây là vào trong, khác với pulang là về nhà.",
        ],
        pronunciation_focus_en: [
          "Tiket masuk means entrance ticket; if you only say tiket, people may ask which ticket you mean.",
          "Masuk here means entering, different from pulang, which means going home.",
        ],
      },
      {
        id: "festival_basic_3",
        en: "Tempatnya ramai sekali, jadi hati-hati dengan barang bawaan.",
        vi: "Chỗ này đông quá, nên hãy cẩn thận với đồ mang theo.",
        pronunciation: "TEM-pat-nya RA-mai se-KA-li, JA-di HA-ti HA-ti de-ngan BA-rang ba-WA-an.",
        pronunciation_focus: [
          "Ramai là đông, nhộn nhịp; không tự động có nghĩa là vui như tiếng Việt 'rộn ràng'.",
          "Barang bawaan là đồ mang theo trên người, rất hay dùng khi nhắc an toàn nơi đông người.",
        ],
        pronunciation_focus_en: [
          "Ramai means crowded or lively; it does not automatically mean happy or fun.",
          "Barang bawaan means belongings you are carrying, common in safety reminders for crowded places.",
        ],
      },
      {
        id: "festival_basic_4",
        en: "Saya mau coba makanan di stan itu.",
        vi: "Tôi muốn thử đồ ăn ở gian hàng kia.",
        pronunciation: "SA-ya mau CO-ba ma-KA-nan di stan I-tu.",
        pronunciation_focus: [
          "Stan là gian hàng; trong nói chuyện đời thường cũng nghe gerai hoặc lapak.",
          "Coba makanan tự nhiên hơn thử makanan trong nhiều tình huống nói thân mật.",
        ],
        pronunciation_focus_en: [
          "Stan means a stall or booth; in daily speech you may also hear gerai or lapak.",
          "Coba makanan sounds natural for trying food in casual conversation.",
        ],
      },
      {
        id: "festival_basic_5",
        en: "Panggung hiburan mulai jam delapan malam.",
        vi: "Sân khấu giải trí bắt đầu lúc tám giờ tối.",
        pronunciation: "PANG-gung hi-BU-ran MU-lai jam de-LA-pan MA-lam.",
        pronunciation_focus: [
          "Panggung là sân khấu; hiburan là giải trí. Cụm này hay thấy trên biển báo sự kiện.",
          "Jam delapan malam là 8 giờ tối; thêm malam để tránh hiểu nhầm 8 giờ sáng.",
        ],
        pronunciation_focus_en: [
          "Panggung means stage, and hiburan means entertainment. The phrase is common on event signs.",
          "Jam delapan malam means 8 p.m.; malam avoids confusion with 8 a.m.",
        ],
      },
    ],
    vocabulary: [
      {
        cell_id: "3f8e3d6f-39f4-4b69-a8be-0a73602d5482",
        word: "pasar malam",
        meaning_vi: "chợ đêm, hội chợ đêm",
        meaning_en: "night market",
        example: "Pasar malam itu buka sampai jam sebelas.",
        example_vi: "Chợ đêm đó mở đến mười một giờ.",
      },
      {
        cell_id: "1e95ff84-328e-4a53-b251-28cade7e95a8",
        word: "festival",
        meaning_vi: "lễ hội",
        meaning_en: "festival",
        example: "Festival kuliner ini ramai setiap akhir pekan.",
        example_vi: "Lễ hội ẩm thực này đông vào mỗi cuối tuần.",
      },
      {
        cell_id: "37787741-22d6-4a71-a684-5000086e8ef3",
        word: "tiket masuk",
        meaning_vi: "vé vào cổng",
        meaning_en: "entrance ticket",
        example: "Tiket masuknya lima belas ribu rupiah.",
        example_vi: "Vé vào cổng là mười lăm nghìn rupiah.",
      },
      {
        cell_id: "0cfa7741-00f4-43a2-8467-458b3d187f4f",
        word: "ramai",
        meaning_vi: "đông, nhộn nhịp",
        meaning_en: "crowded, lively",
        example: "Kalau terlalu ramai, kita tunggu di luar dulu.",
        example_vi: "Nếu đông quá, chúng ta chờ bên ngoài trước.",
      },
      {
        cell_id: "4f6c75a2-b9bc-4e95-8126-9a0039f9a077",
        word: "panggung hiburan",
        meaning_vi: "sân khấu giải trí",
        meaning_en: "entertainment stage",
        example: "Panggung hiburan ada di dekat pintu utama.",
        example_vi: "Sân khấu giải trí ở gần cổng chính.",
      },
    ],
    dialogue: [
      {
        cell_id: "aae4d601-3e83-4244-9d12-58b7909d89cd",
        speaker: "Lina",
        line: "Kita beli tiket masuk dulu atau langsung cari makanan?",
        vi: "Mình mua vé vào cổng trước hay đi tìm đồ ăn luôn?",
        en: "Should we buy the entrance ticket first or go straight to find food?",
      },
      {
        cell_id: "f93c2bf9-3681-41eb-9465-e5350043576b",
        speaker: "Rafi",
        line: "Beli tiket masuk dulu. Setelah itu kita lihat stan makanan.",
        vi: "Mua vé vào cổng trước. Sau đó mình xem gian đồ ăn.",
        en: "Let's buy the entrance ticket first. After that we can look at the food stalls.",
      },
      {
        cell_id: "f5374c78-04d8-4e02-acac-5c6afc753925",
        speaker: "Lina",
        line: "Tempatnya ramai sekali. Aku simpan tas di depan ya.",
        vi: "Chỗ này đông quá. Mình để túi phía trước nhé.",
        en: "This place is very crowded. I'll keep my bag in front.",
      },
      {
        cell_id: "7c9050f4-afbc-4d0d-a0ea-60b018e1639c",
        speaker: "Rafi",
        line: "Iya, nanti kita bertemu di dekat panggung hiburan.",
        vi: "Ừ, lát nữa mình gặp nhau gần sân khấu giải trí.",
        en: "Yes, later we'll meet near the entertainment stage.",
      },
    ],
    exercises: [
      {
        id: "festival_basic_ex_1",
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tối nay tôi muốn đi chợ đêm.",
        prompt_en: "Translate into Indonesian: Tonight I want to go to the night market.",
        answer: "Malam ini saya mau pergi ke pasar malam.",
      },
      {
        id: "festival_basic_ex_2",
        type: "fill_blank",
        prompt_vi: "Điền từ: Apakah ada ___ masuk untuk festival ini?",
        prompt_en: "Fill in the blank: Apakah ada ___ masuk untuk festival ini?",
        answer: "tiket",
      },
      {
        id: "festival_basic_ex_3",
        type: "roleplay",
        prompt_vi: "Bạn và bạn bè đang ở festival đông người. Nói bằng tiếng Indonesia rằng hãy cẩn thận với đồ mang theo.",
        prompt_en: "You and your friend are at a crowded festival. Say in Indonesian to be careful with belongings.",
        answer: "Hati-hati dengan barang bawaan.",
      },
    ],
    tips_vi: [
      "Khi hỏi vé, nói rõ tiket masuk hoặc tiket wahana để tránh nhầm.",
      "Ở chỗ ramai, cụm hati-hati dengan barang bawaan nghe tự nhiên và lịch sự.",
      "Dùng di cho vị trí trong festival: di stan itu, di dekat panggung, di pintu keluar.",
    ],
    tips_en: [
      "When asking about tickets, specify tiket masuk or tiket wahana to avoid confusion.",
      "In crowded places, hati-hati dengan barang bawaan sounds natural and polite.",
      "Use di for location inside the festival: di stan itu, di dekat panggung, di pintu keluar.",
    ],
  },
  {
    id: "indonesian_rides_late_return_safety",
    title: "Wahana dan Pulang Larut",
    title_vi: "Trò chơi và về khuya",
    title_en: "Rides and Returning Late",
    level: "B1",
    category: "entertainment",
    cultural_notes_vi: [
      "Ở pasar malam, wahana có thể là vòng quay, xe điện đụng, nhà ma, hoặc trò chơi cho trẻ em.",
      "Nếu pulang larut, nên thống nhất titik kumpul, kiểm tra pin điện thoại, và đặt xe trước khi quá muộn.",
      "Một số khu festival đông sau khi acara selesai, nên đi cùng rombongan hoặc nhóm bạn.",
    ],
    cultural_notes_en: [
      "At a night market, wahana can mean rides such as a Ferris wheel, bumper cars, a haunted house, or children's attractions.",
      "If returning late, agree on a meeting point, check phone battery, and arrange transport before it gets too late.",
      "Some festival areas become very crowded after the event ends, so move with your group when possible.",
    ],
    sentences: [
      {
        id: "festival_safety_1",
        en: "Wahana ini aman untuk anak-anak?",
        vi: "Trò chơi này có an toàn cho trẻ em không?",
        pronunciation: "wa-HA-na i-ni A-man un-tuk A-nak A-nak?",
        pronunciation_focus: [
          "Wahana ở festival là trò chơi hoặc điểm vui chơi, không chỉ là phương tiện di chuyển.",
          "Aman untuk anak-anak là cách hỏi trực tiếp và lịch sự về độ an toàn.",
        ],
        pronunciation_focus_en: [
          "Wahana at a festival means a ride or attraction, not only a vehicle.",
          "Aman untuk anak-anak is a direct and polite way to ask about safety for children.",
        ],
      },
      {
        id: "festival_safety_2",
        en: "Antrean wahana itu terlalu panjang.",
        vi: "Hàng chờ trò chơi đó dài quá.",
        pronunciation: "an-TRE-an wa-HA-na i-tu ter-LA-lu PAN-jang.",
        pronunciation_focus: [
          "Antrean là hàng chờ; jangan dùng baris nếu muốn nói xếp hàng chờ mua vé hoặc chơi trò chơi.",
          "Terlalu panjang nhấn mạnh là dài quá mức, có thể không đáng chờ.",
        ],
        pronunciation_focus_en: [
          "Antrean means a queue; baris means a line or row but is less specific for waiting in line.",
          "Terlalu panjang emphasizes that the queue is too long, possibly not worth waiting for.",
        ],
      },
      {
        id: "festival_safety_3",
        en: "Kalau pulang larut, kita pesan ojek online saja.",
        vi: "Nếu về khuya, mình đặt xe ôm công nghệ thôi.",
        pronunciation: "KA-lau PU-lang LA-rut, KI-ta PE-san O-jek on-LINE SA-ja.",
        pronunciation_focus: [
          "Pulang larut là về khuya; pulang terlambat nghe giống về trễ so với lịch hẹn hơn.",
          "Saja ở cuối câu làm đề xuất nghe nhẹ: vậy thôi, cho tiện.",
        ],
        pronunciation_focus_en: [
          "Pulang larut means returning late at night; pulang terlambat sounds more like returning late compared with a schedule.",
          "Saja at the end softens the suggestion: let's just do that because it is convenient.",
        ],
      },
      {
        id: "festival_safety_4",
        en: "Tolong tunggu di titik kumpul dekat pintu keluar.",
        vi: "Vui lòng chờ ở điểm tập trung gần lối ra.",
        pronunciation: "TO-long TUNG-gu di TI-tik KUM-pul DE-kat PIN-tu KE-lu-ar.",
        pronunciation_focus: [
          "Titik kumpul là điểm hẹn/tập trung, rất hữu ích khi đi theo nhóm.",
          "Pintu keluar là lối ra; pintu masuk là lối vào.",
        ],
        pronunciation_focus_en: [
          "Titik kumpul means a meeting point or assembly point, useful when going with a group.",
          "Pintu keluar means exit; pintu masuk means entrance.",
        ],
      },
      {
        id: "festival_safety_5",
        en: "Simpan tiketnya sampai acara selesai.",
        vi: "Giữ vé cho đến khi sự kiện kết thúc.",
        pronunciation: "SIM-pan TI-ket-nya SAM-pai a-CA-ra se-LE-sai.",
        pronunciation_focus: [
          "Simpan là giữ/cất; jangan buang tiket nếu còn cần kiểm tra lại.",
          "Acara selesai nghĩa là sự kiện kết thúc, tự nhiên hơn festival selesai khi nói về chương trình cụ thể.",
        ],
        pronunciation_focus_en: [
          "Simpan means keep or store; do not throw away the ticket if it may be checked again.",
          "Acara selesai means the event or program is finished, natural for a specific scheduled event.",
        ],
      },
      {
        id: "festival_safety_6",
        en: "Jangan terpisah dari rombongan.",
        vi: "Đừng tách khỏi nhóm.",
        pronunciation: "JA-ngan ter-PI-sah DA-ri rom-BONG-an.",
        pronunciation_focus: [
          "Rombongan là nhóm đi cùng nhau, thường dùng cho gia đình, bạn bè, đoàn du lịch.",
          "Terpisah dari nghĩa là bị tách khỏi; phù hợp khi nói về nơi đông người.",
        ],
        pronunciation_focus_en: [
          "Rombongan means a group traveling or moving together, common for family, friends, or tour groups.",
          "Terpisah dari means separated from, useful when talking about crowded places.",
        ],
      },
    ],
    vocabulary: [
      {
        cell_id: "205e7f7f-7f68-4d0e-abaf-5c26e1bfda16",
        word: "wahana",
        meaning_vi: "trò chơi, điểm vui chơi",
        meaning_en: "ride, attraction",
        example: "Wahana anak-anak ada di sebelah kanan.",
        example_vi: "Khu trò chơi trẻ em ở bên phải.",
      },
      {
        cell_id: "53d91405-98f1-4a0b-b2cf-d4dbd66a154f",
        word: "antrean",
        meaning_vi: "hàng chờ",
        meaning_en: "queue, line",
        example: "Antrean tiket wahana mulai panjang.",
        example_vi: "Hàng chờ vé trò chơi bắt đầu dài.",
      },
      {
        cell_id: "ea23ea22-7a3b-4b6f-b62a-dfb9229735c0",
        word: "pulang larut",
        meaning_vi: "về khuya",
        meaning_en: "return late at night",
        example: "Saya tidak mau pulang terlalu larut.",
        example_vi: "Tôi không muốn về quá khuya.",
      },
      {
        cell_id: "6c3e8b18-084c-40bb-9bb6-dd3392127e7a",
        word: "titik kumpul",
        meaning_vi: "điểm tập trung, điểm hẹn",
        meaning_en: "meeting point",
        example: "Titik kumpul kita di dekat pintu keluar.",
        example_vi: "Điểm hẹn của chúng ta ở gần lối ra.",
      },
      {
        cell_id: "527affe8-b848-4ea5-b9b4-27b228b3f04b",
        word: "rombongan",
        meaning_vi: "nhóm đi cùng, đoàn",
        meaning_en: "group, party",
        example: "Jangan jauh-jauh dari rombongan.",
        example_vi: "Đừng đi xa khỏi nhóm.",
      },
    ],
    dialogue: [
      {
        cell_id: "6575350f-8ab7-4d62-944c-7b894ae297e9",
        speaker: "Dewi",
        line: "Antrean wahana itu panjang sekali. Kita coba wahana lain?",
        vi: "Hàng chờ trò chơi đó dài quá. Mình thử trò khác không?",
        en: "The queue for that ride is very long. Should we try another ride?",
      },
      {
        cell_id: "4c4f21c4-4d95-435e-b8f7-c756c4da1971",
        speaker: "Nando",
        line: "Boleh. Tapi simpan tiketnya dulu, mungkin bisa dipakai nanti.",
        vi: "Được. Nhưng giữ vé trước đã, có thể lát nữa dùng được.",
        en: "Sure. But keep the ticket first, maybe we can use it later.",
      },
      {
        cell_id: "bb4eee6d-3167-4375-bb6f-4be61e00a15b",
        speaker: "Dewi",
        line: "Kalau acara selesai jam sebelas, kita pulang larut.",
        vi: "Nếu chương trình kết thúc lúc mười một giờ, mình sẽ về khuya.",
        en: "If the event ends at eleven, we will return late at night.",
      },
      {
        cell_id: "3835fb6f-d4e1-4d2e-a588-5ab088a9bd9f",
        speaker: "Nando",
        line: "Setuju. Kita bertemu di titik kumpul, lalu pesan ojek online.",
        vi: "Đồng ý. Mình gặp ở điểm hẹn, rồi đặt xe ôm công nghệ.",
        en: "Agreed. We'll meet at the meeting point, then order an online motorbike taxi.",
      },
    ],
    exercises: [
      {
        id: "festival_safety_ex_1",
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Nếu về khuya, mình đặt xe ôm công nghệ thôi.",
        prompt_en: "Translate into Indonesian: If we return late at night, let's just order an online motorbike taxi.",
        answer: "Kalau pulang larut, kita pesan ojek online saja.",
      },
      {
        id: "festival_safety_ex_2",
        type: "matching",
        prompt_vi: "Ghép nghĩa: titik kumpul",
        prompt_en: "Match the meaning: titik kumpul",
        answer: "meeting point / điểm tập trung",
      },
      {
        id: "festival_safety_ex_3",
        type: "fill_blank",
        prompt_vi: "Điền từ: Jangan terpisah dari ___.",
        prompt_en: "Fill in the blank: Jangan terpisah dari ___.",
        answer: "rombongan",
      },
      {
        id: "festival_safety_ex_4",
        type: "roleplay",
        prompt_vi: "Bạn đang đi pasar malam với nhóm. Nói bằng tiếng Indonesia rằng hãy chờ ở điểm hẹn gần lối ra.",
        prompt_en: "You are at a night market with a group. Say in Indonesian to wait at the meeting point near the exit.",
        answer: "Tolong tunggu di titik kumpul dekat pintu keluar.",
      },
    ],
    tips_vi: [
      "Khi đi festival đông người, hãy nhớ các cụm praktis: titik kumpul, pintu keluar, barang bawaan, rombongan.",
      "Wahana là từ rộng cho trò chơi/điểm vui chơi; nếu cần cụ thể, hỏi jenis wahananya apa?",
      "Pulang larut nhấn vào thời điểm khuya; pulang terlambat nhấn vào việc trễ so với dự kiến.",
    ],
    tips_en: [
      "At a crowded festival, remember practical phrases: titik kumpul, pintu keluar, barang bawaan, rombongan.",
      "Wahana is a broad word for a ride or attraction; to be specific, ask jenis wahananya apa?",
      "Pulang larut emphasizes late-night timing; pulang terlambat emphasizes being late compared with an expectation.",
    ],
  },
];
