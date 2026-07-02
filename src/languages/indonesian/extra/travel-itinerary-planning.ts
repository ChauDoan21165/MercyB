// Travel Itinerary Planning Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// notes with English companions in pronunciation_focus_en.
//
// Topic: planning a trip itinerary (`itinerary`), building a daily schedule
// (`jadwal harian`), choosing transport and accommodation, estimating cost, and
// leaving buffer time. For Vietnamese speakers, the wins are familiar: no verb
// conjugation, no tones, and noun-before-adjective. The traps: `ke` (to) versus
// `di` (at), `naik` for transport, and leaving space for `jam karet` (flexible time).

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  /** Indonesian word/phrase. */
  word: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Part of speech, e.g. "noun", "verb", "phrase". */
  pos: string;
  /** Vietnamese pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  speaker: string;
  /** Indonesian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
  en?: string;
};

export type IndonesianExercise = Record<string, unknown>;

export type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: IndonesianLessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: IndonesianVocabEntry[];
  dialogue?: IndonesianDialogueLine[];
  exercises?: IndonesianExercise[];
  content?: string;
};

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_travel_itinerary_planning",
    level: "B1",
    category: "travel",
    title_vi: "Lập lịch trình chuyến đi",
    title_en: "Travel itinerary planning",
    sentences: [
      {
        en: "Saya mau menyusun itinerary untuk akhir pekan ini.",
        vi: "Tôi muốn lập lịch trình cho cuối tuần này.",
        pronunciation_focus: [
          "sa-YA mau me-nyu-SUN i-ti-NE-ra-ri un-TUK a-KHIR pe-KAN i-NI - `menyusun` = lập/sắp xếp; `itinerary` thường dùng nguyên tiếng Anh.",
          "Lợi thế người Việt: không chia động từ — `saya mau menyusun` gọn như 'tôi muốn lập'.",
          "Lỗi người Việt: dịch từng chữ thành `susun itinerary`. Dùng `menyusun itinerary` hoặc `buat itinerary` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "sa-YA mau me-nyu-SOON i-ti-NE-ra-ri un-TOOK a-KHIR pe-KAN i-NI - `menyusun` = to arrange/plan; `itinerary` is often used directly in English.",
          "VN-speaker win: no conjugation — `saya mau menyusun` is as short as 'I want to plan'.",
          "VN-speaker trap: translating word-for-word as `susun itinerary`. `Menyusun itinerary` or `buat itinerary` sounds more natural.",
        ],
      },
      {
        en: "Kita mulai dari tempat yang paling dekat dulu.",
        vi: "Mình bắt đầu từ nơi gần nhất trước nhé.",
        pronunciation_focus: [
          "KI-ta mu-LAI da-ri TEMPAT yang pa-LING de-KAT DU-lu - `mulai dari` = bắt đầu từ; `paling dekat` = gần nhất.",
          "Mẹo: `yang` nối mệnh đề mô tả: `tempat yang paling dekat` = nơi mà gần nhất.",
          "Lỗi người Việt: nói `tempat dekat nhất` pha kiểu Việt. Chuẩn hơn là `paling dekat`.",
        ],
        pronunciation_focus_en: [
          "KI-ta moo-LAI da-ri TEM-pat yang pa-LEENG de-KAT DOO-loo - `mulai dari` = start from; `paling dekat` = the nearest.",
          "Tip: `yang` links the descriptive clause: `tempat yang paling dekat` = the place that is nearest.",
          "VN-speaker trap: `tempat dekat nhất` mixed into the structure. More natural is `paling dekat`.",
        ],
      },
      {
        en: "Setelah itu, kita naik kereta ke kota sebelah.",
        vi: "Sau đó, mình đi tàu hỏa đến thành phố bên cạnh.",
        pronunciation_focus: [
          "se-TE-lah I-tu, KI-ta na-IK ke-RE-ta ke KO-ta se-be-LAH - `setelah itu` = sau đó; `naik kereta` = đi tàu hỏa.",
          "Mẹo: phương tiện đi bằng dùng `naik`: `naik kereta`, `naik bus`, `naik ojek`.",
          "Lỗi người Việt: nói `dengan kereta`. Tự nhiên hơn trong tiếng Indonesia là `naik kereta`.",
        ],
        pronunciation_focus_en: [
          "se-TE-lah EE-too, KI-ta na-IK keh-REH-ta keh KOH-ta seh-be-LAH - `setelah itu` = after that; `naik kereta` = to travel by train.",
          "Tip: transport uses `naik`: `naik kereta`, `naik bus`, `naik ojek`.",
          "VN-speaker trap: saying `dengan kereta`. Indonesian normally says `naik kereta`.",
        ],
      },
      {
        en: "Saya pilih penginapan yang dekat stasiun.",
        vi: "Tôi chọn chỗ ở gần nhà ga.",
        pronunciation_focus: [
          "sa-YA pi-LIH pe-ngi-NA-pan yang de-KAT sta-SI-un - `penginapan` = chỗ ở/nhà nghỉ; `stasiun` = ga tàu.",
          "Mẹo: `dekat` thường đi thẳng với danh từ: `dekat stasiun`, không cần thêm `di`.",
          "Lỗi người Việt: nói `dekat di stasiun`. Ngắn và đúng là `dekat stasiun`.",
        ],
        pronunciation_focus_en: [
          "sa-YA pi-LEE pe-ngi-NA-pan yang de-KAT sta-SEE-oon - `penginapan` = lodging; `stasiun` = station.",
          "Tip: `dekat` usually goes directly with the noun: `dekat stasiun`, no extra `di` needed.",
          "VN-speaker trap: `dekat di stasiun`. Short and correct: `dekat stasiun`.",
        ],
      },
      {
        en: "Berapa biaya total perjalanan ini?",
        vi: "Tổng chi phí của chuyến đi này là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa bi-A-ya TO-tal per-ja-LAN-an i-NI - `biaya total` = tổng chi phí; `perjalanan` = chuyến đi.",
          "Mẹo: `berapa` đứng trước cụm cần hỏi. `Berapa biaya total ...?` nghe tự nhiên hơn `biaya total berapa?`.",
          "Lỗi người Việt: đặt `berapa` cuối câu theo thói quen tiếng Việt. Tiếng Indonesia thích `berapa` ở đầu hơn.",
        ],
        pronunciation_focus_en: [
          "be-RA-pa bee-A-ya TO-tal per-ja-LAH-nan i-NEE - `biaya total` = total cost; `perjalanan` = trip/journey.",
          "Tip: `berapa` comes before the phrase you are asking about. `Berapa biaya total ...?` sounds more natural than `biaya total berapa?`.",
          "VN-speaker trap: putting `berapa` at the end by Vietnamese habit. Indonesian prefers `berapa` near the front.",
        ],
      },
      {
        en: "Kita sisakan waktu luang satu jam di sore hari.",
        vi: "Mình chừa ra một giờ thời gian rảnh vào buổi chiều.",
        pronunciation_focus: [
          "KI-ta si-SA-kan WAK-tu LU-ang sa-TU jam di SO-re HA-ri - `waktu luang` = thời gian rảnh; `sisakan` = chừa ra.",
          "Mẹo: lịch trình tốt thường có khoảng đệm. `waktu luang` giúp không bị quá căng.",
          "Lỗi người Việt: nhét kín mọi điểm. Nếu đi Indonesia, để thêm thời gian vì `jam karet` khá phổ biến.",
        ],
        pronunciation_focus_en: [
          "KI-ta si-SAH-kan WAK-too LOO-ang sa-TOO jam di SO-re HA-ree - `waktu luang` = free time; `sisakan` = leave aside/save.",
          "Tip: a good itinerary leaves buffer time. `waktu luang` prevents the schedule from becoming too tight.",
          "VN-speaker trap: packing every minute full. In Indonesia, leave extra time because `jam karet` is common.",
        ],
      },
      {
        en: "Kalau hujan, kita pindah ke museum saja.",
        vi: "Nếu mưa, mình chuyển sang đi bảo tàng thôi.",
        pronunciation_focus: [
          "KA-lau HU-jan, KI-ta PIN-dah ke mu-SE-um SA-ja - `kalau` = nếu; `pindah ke` = chuyển sang/đi sang nơi khác.",
          "Mẹo: dùng `kalau` cho phương án dự phòng. `rencana cadangan` = kế hoạch dự phòng.",
          "Lỗi người Việt: bỏ `ke` sau `pindah`. Khi chỉ nơi đến, dùng `pindah ke museum`.",
        ],
        pronunciation_focus_en: [
          "KA-low HOO-jan, KI-ta PEEN-dah keh mu-SEH-um SA-jah - `kalau` = if; `pindah ke` = switch to/go to another place.",
          "Tip: use `kalau` for the backup option. `rencana cadangan` = backup plan.",
          "VN-speaker trap: dropping `ke` after `pindah`. When naming the destination, use `pindah ke museum`.",
        ],
      },
      {
        en: "Tolong kirim jadwal hariannya ke grup.",
        vi: "Làm ơn gửi lịch trình hằng ngày vào nhóm giúp tôi.",
        pronunciation_focus: [
          "TO-long KI-rim jad-WAL ha-RI-an-nya ke GRUP - `kirim` = gửi; `jadwal hariannya` = lịch trình hằng ngày.",
          "Mẹo: `ke grup` = gửi vào nhóm; dùng khi share kế hoạch qua WhatsApp hoặc chat nhóm.",
          "Lỗi người Việt: nói `di grup` khi ý là gửi tới nhóm. Hướng đích thường dùng `ke`.",
        ],
        pronunciation_focus_en: [
          "TO-long KEE-reem jad-WAL ha-REE-ah-nya keh GROOP - `kirim` = send; `jadwal hariannya` = daily schedule.",
          "Tip: `ke grup` = to the group; useful when sharing plans in WhatsApp or group chat.",
          "VN-speaker trap: `di grup` when you mean sending to the group. Direction toward the target normally uses `ke`.",
        ],
      },
      {
        en: "Jam berapa kita harus berangkat dari hotel?",
        vi: "Mấy giờ mình phải xuất phát từ khách sạn?",
        pronunciation_focus: [
          "jam be-RA-pa KI-ta ha-RUS ber-ANG-kat da-ri ho-TEL - `harus` = phải; `berangkat` = khởi hành/xuất phát.",
          "Mẹo: hỏi giờ bằng `jam berapa?` rất phổ biến, tự nhiên như `mấy giờ?`.",
          "Lỗi người Việt: dùng `ke hotel` khi nói điểm xuất phát. Xuất phát từ đâu dùng `dari hotel`.",
        ],
        pronunciation_focus_en: [
          "jam be-RA-pa KI-ta HA-roos ber-ANG-kat da-ri ho-TEL - `harus` = must; `berangkat` = depart/leave.",
          "Tip: asking time with `jam berapa?` is very common, just like Vietnamese `mấy giờ?`.",
          "VN-speaker trap: using `ke hotel` when talking about the starting point. Starting FROM somewhere uses `dari hotel`.",
        ],
      },
      {
        en: "Tempat wisata itu buka sampai pukul lima.",
        vi: "Điểm tham quan đó mở cửa đến 5 giờ.",
        pronunciation_focus: [
          "TEMPAT wi-SA-ta i-TU BU-ka SAM-pai PU-kul LI-ma - `buka sampai` = mở đến; `pukul` = giờ (trang trọng hơn `jam`).",
          "Mẹo: biển giờ mở cửa thường dùng `pukul`. Trong hội thoại cũng có thể dùng `jam lima`.",
          "Lỗi người Việt: nói `open sampai jam lima` pha tiếng Anh. Câu tự nhiên là `buka sampai pukul lima`.",
        ],
        pronunciation_focus_en: [
          "TEM-pat wi-SA-ta ee-TOO BOO-ka SAM-pai POO-kool LEE-ma - `buka sampai` = open until; `pukul` = o'clock (more formal than `jam`).",
          "Tip: opening hours often use `pukul`. In conversation you can also say `jam lima`.",
          "VN-speaker trap: mixing English `open sampai jam lima`. Natural Indonesian is `buka sampai pukul lima`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Người Indonesia thường lên lịch trình khá thực tế, nhưng giao thông và thời tiết có thể làm thay đổi. Từ `jam karet` hay được dùng để nói giờ giấc linh hoạt, nhất là khi di chuyển liên tỉnh hoặc giữa các điểm du lịch. Khi lên itinerary, đừng nhét quá dày; để sẵn khoảng đệm cho ăn uống, nghỉ, và kẹt xe. Với bạn đồng hành người Indonesia, chia lịch qua WhatsApp rất phổ biến: họ thích thấy rõ giờ khởi hành, phương tiện (`naik kereta`, `naik mobil`), chỗ ở, và chi phí ước tính. Trong câu hỏi, `ke` dùng cho điểm đến, còn `di` cho nơi đang ở. Nếu nhớ được hai điều này, bạn sẽ tránh được nhiều lỗi rất Việt.",
    cultural_notes_en:
      "Indonesians often plan practically, but traffic and weather can change the schedule. The phrase `jam karet` is commonly used for flexible timing, especially for intercity travel or tourism routes. When planning an itinerary, do not pack it too tightly; leave buffer time for meals, rests, and traffic jams. With Indonesian travel companions, sharing plans on WhatsApp is very common: people like to see departure time, transport mode (`naik kereta`, `naik mobil`), lodging, and estimated cost clearly. In questions, `ke` is for destinations, while `di` is for places you are already at. If you remember those two points, you will avoid many very Vietnamese mistakes.",
    tip_advice_vi:
      "Mẹo học nhanh: lập lịch theo khung `pagi - siang - sore - malam` (sáng - trưa - chiều - tối) rồi điền hoạt động vào từng khung. Khi hỏi kế hoạch, ưu tiên mẫu: `Kita mulai dari ...`, `Setelah itu ...`, `Berapa biaya total ...?`, `Kalau ...`. Với phương tiện, nhớ một từ khóa duy nhất: `naik`.",
    tip_advice_en:
      "Fast-learning tip: build your itinerary by the frame `pagi - siang - sore - malam` (morning - noon - afternoon - evening) and fill each block with activities. When asking about plans, prioritize these patterns: `Kita mulai dari ...`, `Setelah itu ...`, `Berapa biaya total ...?`, `Kalau ...`. For transport, remember one core word: `naik`.",
    vocabulary: [
      {
        word: "itinerary",
        en: "itinerary",
        vi: "lịch trình",
        pos: "noun",
        pronunciation_vi: "i-ti-NE-ra-ri — mượn tiếng Anh, dùng rất phổ biến trong du lịch",
        pronunciation_en: "i-ti-NE-ra-ri — English loanword, common in travel planning",
      },
      {
        word: "jadwal harian",
        en: "daily schedule",
        vi: "lịch trình hằng ngày",
        pos: "noun phrase",
        pronunciation_vi: "JAD-wal ha-RI-an — `harian` = hằng ngày",
        pronunciation_en: "JAD-wal ha-REE-an — `harian` = daily",
      },
      {
        word: "transportasi",
        en: "transportation",
        vi: "phương tiện di chuyển",
        pos: "noun",
        pronunciation_vi: "trans-por-TA-si — từ trang trọng; nói ngắn hơn: `transport` hoặc `naik apa`",
        pronunciation_en: "trans-por-TA-si — formal word; shorter in speech: `transport` or `naik apa`",
      },
      {
        word: "penginapan",
        en: "lodging / accommodation",
        vi: "chỗ ở / nhà nghỉ",
        pos: "noun",
        pronunciation_vi: "pe-ngi-NA-pan — `inap` = ngủ lại qua đêm",
        pronunciation_en: "pe-ngi-NA-pan — root `inap` = stay overnight",
      },
      {
        word: "tempat wisata",
        en: "tourist spot",
        vi: "điểm tham quan",
        pos: "noun phrase",
        pronunciation_vi: "TEMPAT wi-SA-ta — nói cả cụm khi hỏi điểm đi chơi",
        pronunciation_en: "TEM-pat wi-SA-ta — say the full phrase when asking about places to visit",
      },
      {
        word: "biaya",
        en: "cost / expense",
        vi: "chi phí",
        pos: "noun",
        pronunciation_vi: "bi-A-ya — `biaya total` = tổng chi phí",
        pronunciation_en: "bee-AH-yah — `biaya total` = total cost",
      },
      {
        word: "waktu luang",
        en: "free time",
        vi: "thời gian rảnh",
        pos: "noun phrase",
        pronunciation_vi: "WAK-tu LU-ang — chừa khoảng trống trong lịch",
        pronunciation_en: "WAK-too LOO-ang — leave some space in the schedule",
      },
      {
        word: "rencana cadangan",
        en: "backup plan",
        vi: "kế hoạch dự phòng",
        pos: "noun phrase",
        pronunciation_vi: "ren-CA-na ca-DANG-an — dùng khi trời mưa hoặc thay đổi lịch",
        pronunciation_en: "ren-CHA-na cha-DAH-ngan — used when weather or plans change",
      },
      {
        word: "berangkat",
        en: "to depart / leave",
        vi: "xuất phát / lên đường",
        pos: "verb",
        pronunciation_vi: "be-RANG-kat — `berangkat dari hotel` = xuất phát từ khách sạn",
        pronunciation_en: "be-RANG-kat — `berangkat dari hotel` = depart from the hotel",
      },
      {
        word: "jam karet",
        en: "flexible / delayed time",
        vi: "giờ dây thun / giờ linh hoạt",
        pos: "idiom",
        pronunciation_vi: "jam KA-ret — nhắc rằng lịch có thể trễ hơn dự tính",
        pronunciation_en: "jam KA-ret — reminds you the schedule may run later than planned",
      },
    ],
    dialogue: [
      {
        speaker: "Teman",
        text: "Itinerary-nya sudah jadi?",
        vi: "Lịch trình đã xong chưa?",
        en: "Is the itinerary ready?",
      },
      {
        speaker: "Saya",
        text: "Sudah. Kita mulai dari museum, lalu naik kereta ke kota sebelah.",
        vi: "Rồi. Mình bắt đầu từ bảo tàng, rồi đi tàu sang thành phố bên cạnh.",
        en: "Yes. We start with the museum, then take a train to the neighboring city.",
      },
      {
        speaker: "Teman",
        text: "Bagus. Berapa biaya total perjalanan ini?",
        vi: "Tốt. Tổng chi phí của chuyến đi này là bao nhiêu?",
        en: "Great. What is the total cost of this trip?",
      },
      {
        speaker: "Saya",
        text: "Sekitar satu juta rupiah. Saya juga sisakan waktu luang di sore hari.",
        vi: "Khoảng một triệu rupiah. Tôi cũng chừa ra thời gian rảnh vào buổi chiều.",
        en: "Around one million rupiah. I also left free time in the afternoon.",
      },
      {
        speaker: "Teman",
        text: "Kalau hujan, rencana cadangannya apa?",
        vi: "Nếu mưa thì phương án dự phòng là gì?",
        en: "If it rains, what's the backup plan?",
      },
      {
        speaker: "Saya",
        text: "Kita pindah ke museum saja, lalu saya kirim jadwal hariannya ke grup.",
        vi: "Mình chuyển sang đi bảo tàng thôi, rồi tôi gửi lịch trình hằng ngày vào nhóm.",
        en: "We'll switch to the museum, then I'll send the daily schedule to the group.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn lập lịch trình cho cuối tuần này.", answer: "Saya mau menyusun itinerary untuk akhir pekan ini." },
          { prompt: "Mình bắt đầu từ nơi gần nhất trước nhé.", answer: "Kita mulai dari tempat yang paling dekat dulu." },
          { prompt: "Tổng chi phí của chuyến đi này là bao nhiêu?", answer: "Berapa biaya total perjalanan ini?" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu trong lịch trình:",
        instruction_en: "Fill in the missing itinerary word:",
        items: [
          {
            prompt: "Kita naik ___ ke kota sebelah. (tàu hỏa)",
            answer: "kereta",
            options: ["kereta", "kamera", "keramik"],
          },
          {
            prompt: "Saya pilih ___ yang dekat stasiun. (chỗ ở)",
            answer: "penginapan",
            options: ["penginapan", "pengalaman", "pengiriman"],
          },
          {
            prompt: "Kita sisakan waktu ___ satu jam. (rảnh)",
            answer: "luang",
            options: ["luang", "lurus", "luar"],
          },
        ],
      },
      {
        type: "ordering",
        instruction_vi: "Sắp xếp thành câu đúng:",
        instruction_en: "Put the words in the correct order:",
        items: [
          {
            words: ["Saya", "mau", "menyusun", "itinerary", "untuk", "akhir", "pekan", "ini"],
            answer: "Saya mau menyusun itinerary untuk akhir pekan ini.",
          },
          {
            words: ["Berapa", "biaya", "total", "perjalanan", "ini"],
            answer: "Berapa biaya total perjalanan ini?",
          },
          {
            words: ["Kalau", "hujan", "kita", "pindah", "ke", "museum", "saja"],
            answer: "Kalau hujan kita pindah ke museum saja.",
          },
        ],
      },
    ],
  },
];
