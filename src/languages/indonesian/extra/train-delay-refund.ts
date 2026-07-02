// Train delay and refund Indonesian lesson pack for Vietnamese learners.
//
// Self-contained extra lesson file following the established Indonesian format.
// The `en` field holds TARGET-LANGUAGE Indonesian; `vi` holds the Vietnamese
// gloss. Pronunciation notes include Vietnamese L1 traps plus English companions.

type LessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type Exercise = Record<string, unknown>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: VocabEntry[];
  dialogue?: DialogueLine[];
  exercises?: Exercise[];
  content?: string;
};

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_train_delay_refund_ticket",
    level: "B1",
    category: "transport",
    title_vi: "Tàu chậm: refund tiket và loket KAI",
    title_en: "Train delays: ticket refunds and the KAI counter",
    sentences: [
      {
        en: "Kereta saya terlambat lebih dari satu jam.",
        vi: "Tàu của tôi bị trễ hơn một giờ.",
        pronunciation_focus: [
          "ke-RE-ta SA-ya ter-LAM-bat le-BIH da-ri SA-tu JAM.",
          "`terlambat` = bị trễ; `lebih dari` = hơn.",
          "L1 Việt: đừng dùng `late` hay `delay` thẳng nếu đang nói câu đầy đủ; `terlambat` là từ tự nhiên nhất.",
        ],
        pronunciation_focus_en: [
          "ke-RE-ta SA-ya ter-LAM-bat le-BEEH da-ree SA-too JAM.",
          "`terlambat` = delayed; `lebih dari` = more than.",
          "VN-speaker note: do not jump straight to English `late` or `delay` in a full sentence; `terlambat` is the most natural word.",
        ],
      },
      {
        en: "Saya mau minta refund tiket di loket KAI.",
        vi: "Tôi muốn yêu cầu hoàn tiền vé ở quầy KAI.",
        pronunciation_focus: [
          "SA-ya mau MIN-ta RI-fan TI-ket di LO-ket KAI.",
          "`minta refund tiket` = xin hoàn tiền vé; `loket KAI` = quầy của PT KAI.",
          "L1 Việt: `refund` là từ mượn rất phổ biến; dùng được ở quầy, không cần luôn chuyển sang `pengembalian uang`.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau MIN-ta REE-fund TEE-ket di LO-ket KAI.",
          "`minta refund tiket` = request a ticket refund; `loket KAI` = the KAI counter.",
          "VN-speaker note: `refund` is a very common loanword; you do not always need the more formal `pengembalian uang`.",
        ],
      },
      {
        en: "Apakah ada formulir untuk pengembalian dana?",
        vi: "Có mẫu đơn cho việc hoàn tiền không?",
        pronunciation_focus: [
          "A-pa-kah A-da for-mu-LIR un-tuk pe-ngem-ba-LI-an DA-na.",
          "`pengembalian dana` = hoàn tiền; `formulir` = mẫu đơn.",
          "L1 Việt: hỏi bằng `apakah ada` rất an toàn ở quầy; nếu muốn lịch sự hơn, thêm `mohon`.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah A-da for-moo-LEER OON-took pe-ngem-ba-LEE-an DA-na.",
          "`pengembalian dana` = refund of funds; `formulir` = form.",
          "VN-speaker note: asking with `apakah ada` is safe at a counter; add `mohon` if you want to sound more polite.",
        ],
      },
      {
        en: "Pengumuman stasiun bilang keretanya datang terlambat.",
        vi: "Thông báo ở ga nói rằng tàu đến muộn.",
        pronunciation_focus: [
          "pe-ngu-MUM-an sta-SI-un bi-LANG ke-re-TA-nya DA-tang ter-LAM-bat.",
          "`pengumuman stasiun` = thông báo ở ga; `bilang` = nói/báo rằng.",
          "L1 Việt: `pengumuman` là danh từ. Nếu muốn nói thông báo đã nói gì, dùng `bilang` atau `mengumumkan`.",
        ],
        pronunciation_focus_en: [
          "pe-ngoo-MOOM-an sta-SEE-un bee-LANG ke-re-TA-nya DA-tang ter-LAM-bat.",
          "`pengumuman stasiun` = station announcement; `bilang` = says/tells.",
          "VN-speaker note: `pengumuman` is a noun. If you want to say what the announcement said, use `bilang` or `mengumumkan`.",
        ],
      },
      {
        en: "Saya sudah simpan bukti pembayaran dan tiket elektronik.",
        vi: "Tôi đã lưu bằng chứng thanh toán và vé điện tử.",
        pronunciation_focus: [
          "SA-ya SU-dah SIM-pan BUK-ti pem-ba-YAR-an dan TI-ket e-lek-TRO-nik.",
          "`bukti pembayaran` = bằng chứng thanh toán; `tiket elektronik` = vé điện tử.",
          "L1 Việt: khi minta refund, simpan selalu bukti bayar, barcode, dan pesan email.",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah SIM-pan BOOK-ti pem-ba-YAR-an dan TEE-ket e-lek-TRO-nik.",
          "`bukti pembayaran` = payment proof; `tiket elektronik` = e-ticket.",
          "VN-speaker note: when asking for a refund, always keep payment proof, barcode, and email confirmation.",
        ],
      },
      {
        en: "Nomor antrean saya berapa?",
        vi: "Số thứ tự của tôi là bao nhiêu?",
        pronunciation_focus: [
          "NO-mor an-TRE-an SA-ya be-RA-pa.",
          "`nomor antrean` = số thứ tự; `berapa` dùng để hỏi số.",
          "L1 Việt: đừng hỏi `apa nomor antrean`. Khi hỏi số, dùng `berapa`.",
        ],
        pronunciation_focus_en: [
          "NO-mor an-TRE-an SA-ya be-RA-pa.",
          "`nomor antrean` = queue number; `berapa` asks for a number.",
          "VN-speaker note: do not ask `apa nomor antrean`. When asking for a number, use `berapa`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Di stasiun KAI, penumpang thường hỏi refund ticket, jadwal ulang, hoặc pengumuman keterlambatan di loket. Nếu kereta terlambat, simpan tiket elektronik, bukti pembayaran, dan ambil nomor antrean sebelum menuju petugas. Beberapa kasus bisa mendapat refund penuh hoặc sebagian, tergantung aturan tiket dan waktu pengajuan.",
    cultural_notes_en:
      "At KAI stations, passengers commonly ask about ticket refunds, rescheduling, or delay announcements at the counter. If the train is delayed, keep the e-ticket and payment proof, and take a queue number before approaching the staff. Some cases may qualify for full or partial refunds depending on the ticket rules and the submission time.",
    tip_advice_vi:
      "Khung câu hữu ích: `Kereta saya terlambat`, `Saya mau minta refund tiket`, `Apakah ada formulir?`, `Nomor antrean saya berapa?`. Người Việt nên nhớ `terlambat` = trễ, còn `tertinggal` = bị bỏ lỡ vì không kịp.",
    tip_advice_en:
      "Useful frames: `Kereta saya terlambat`, `Saya mau minta refund tiket`, `Apakah ada formulir?`, `Nomor antrean saya berapa?`. Vietnamese speakers should remember `terlambat` = delayed, while `tertinggal` = missed because you did not make it in time.",
    vocabulary: [
      { word: "kereta terlambat", en: "delayed train", vi: "tàu bị trễ", pos: "noun phrase", pronunciation_vi: "ke-RE-ta ter-LAM-bat", pronunciation_en: "ke-RE-ta ter-LAM-bat" },
      { word: "refund tiket", en: "ticket refund", vi: "hoàn tiền vé", pos: "noun phrase", pronunciation_vi: "RI-fan TI-ket", pronunciation_en: "REE-fund TEE-ket" },
      { word: "loket KAI", en: "KAI counter", vi: "quầy KAI", pos: "noun phrase", pronunciation_vi: "LO-ket KAI", pronunciation_en: "LO-ket KAI" },
      { word: "pengumuman stasiun", en: "station announcement", vi: "thông báo ở ga", pos: "noun phrase", pronunciation_vi: "pe-ngu-MUM-an sta-SI-un", pronunciation_en: "pe-ngoo-MOOM-an sta-SEE-un" },
      { word: "bukti pembayaran", en: "payment proof", vi: "bằng chứng thanh toán", pos: "noun phrase", pronunciation_vi: "BUK-ti pem-ba-YAR-an", pronunciation_en: "BOOK-ti pem-ba-YAR-an" },
      { word: "nomor antrean", en: "queue number", vi: "số thứ tự", pos: "noun phrase", pronunciation_vi: "NO-mor an-TRE-an", pronunciation_en: "NO-mor an-TRE-an" },
      { word: "pengembalian dana", en: "refund", vi: "hoàn tiền", pos: "noun phrase", pronunciation_vi: "pe-ngem-ba-LI-an DA-na", pronunciation_en: "pe-ngem-ba-LI-an DA-na" },
    ],
    dialogue: [
      {
        speaker: "Penumpang",
        text: "Selamat pagi, kereta saya terlambat lebih dari satu jam.",
        vi: "Chào buổi sáng, tàu của tôi bị trễ hơn một giờ.",
        en: "Good morning, my train is delayed by more than one hour.",
      },
      {
        speaker: "Petugas",
        text: "Baik, Pak. Silakan ke loket KAI untuk refund tiket.",
        vi: "Được ạ. Mời anh đến quầy KAI để hoàn tiền vé.",
        en: "Okay, Sir. Please go to the KAI counter for a ticket refund.",
      },
      {
        speaker: "Penumpang",
        text: "Apakah ada formulir untuk pengembalian dana?",
        vi: "Có mẫu đơn cho việc hoàn tiền không?",
        en: "Is there a form for the refund?",
      },
      {
        speaker: "Petugas",
        text: "Ada. Mohon ambil nomor antrean dulu.",
        vi: "Có. Xin vui lòng lấy số thứ tự trước.",
        en: "Yes. Please take a queue number first.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "kereta terlambat", answer: "tàu bị trễ" },
          { prompt: "refund tiket", answer: "hoàn tiền vé" },
          { prompt: "nomor antrean", answer: "số thứ tự" },
          { prompt: "bukti pembayaran", answer: "bằng chứng thanh toán" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tàu của tôi bị trễ hơn một giờ.", answer: "Kereta saya terlambat lebih dari satu jam." },
          { prompt: "Tôi muốn yêu cầu hoàn tiền vé ở quầy KAI.", answer: "Saya mau minta refund tiket di loket KAI." },
          { prompt: "Số thứ tự của tôi là bao nhiêu?", answer: "Nomor antrean saya berapa?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_train_reschedule_seat_compensation",
    level: "B2",
    category: "transport",
    title_vi: "Jadwal ulang, số ghế và bồi thường",
    title_en: "Rescheduling, seat numbers, and compensation",
    sentences: [
      {
        en: "Saya ingin jadwal ulang ke keberangkatan berikutnya.",
        vi: "Tôi muốn đổi sang chuyến khởi hành tiếp theo.",
        pronunciation_focus: [
          "SA-ya I-ngin jad-WAL u-LANG ke ke-be-rang-KAT-an be-RI-kut-nya.",
          "`jadwal ulang` = đổi lịch; `keberangkatan berikutnya` = chuyến khởi hành kế tiếp.",
          "L1 Việt: `jadwal ulang` là cụm rất hữu ích khi không muốn refund mà chỉ muốn đổi chuyến.",
        ],
        pronunciation_focus_en: [
          "SA-ya I-ngin jad-WAL oo-LANG ke ke-be-rang-KAT-an beh-REE-koot-nya.",
          "`jadwal ulang` = reschedule; `keberangkatan berikutnya` = next departure.",
          "VN-speaker note: `jadwal ulang` is useful when you do not want a refund and only want to change trains.",
        ],
      },
      {
        en: "Nomor kursi saya tetap sama atau berubah?",
        vi: "Số ghế của tôi giữ nguyên hay thay đổi?",
        pronunciation_focus: [
          "NO-mor KUR-si SA-ya te-TAP SA-ma a-tau ber-UB-ah.",
          "`nomor kursi` = số ghế; `tetap sama` = giữ nguyên.",
          "L1 Việt: `kursi` là ghế ngồi; đừng nhầm với `tempat duduk` nếu bạn muốn nói số ghế in trên vé.",
        ],
        pronunciation_focus_en: [
          "NO-mor KUR-see SA-ya te-TAP SA-ma a-TOO ber-OO-bah.",
          "`nomor kursi` = seat number; `tetap sama` = stays the same.",
          "VN-speaker note: `kursi` is a seat; do not confuse it with `tempat duduk` if you want the seat number printed on the ticket.",
        ],
      },
      {
        en: "Pengumuman stasiun tadi menyebut perubahan peron.",
        vi: "Thông báo ở ga lúc nãy có nhắc đến việc đổi sân ga.",
        pronunciation_focus: [
          "pe-ngu-MUM-an sta-SI-un TA-di me-nyE-but per-u-BA-han PE-ron.",
          "`menyebut` = nhắc đến; `peron` = sân ga/platform.",
          "L1 Việt: `peron` thường diucap dengan tekanan di suku kata akhir, dan rất hay xuất hiện trong pengumuman.",
        ],
        pronunciation_focus_en: [
          "pe-ngoo-MOOM-an sta-SEE-un TA-di me-NYEH-boot per-roo-BA-han PE-ron.",
          "`menyebut` = mention; `peron` = platform.",
          "VN-speaker note: `peron` often shows up in announcements and is usually stressed on the final syllable.",
        ],
      },
      {
        en: "Apakah saya mendapat kompensasi karena keretanya sangat terlambat?",
        vi: "Tôi có được bồi thường vì tàu quá trễ không?",
        pronunciation_focus: [
          "A-pa-kah SA-ya men-da-PAT kom-pen-SA-si ka-RE-na ke-re-TA-nya sa-NGAT ter-LAM-bat.",
          "`kompensasi` = bồi thường/đền bù; `karena` = vì.",
          "L1 Việt: hỏi `mendapat kompensasi` nghe tự nhiên hơn `ada uang pengganti` trong konteks transportasi resmi.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah SA-ya men-da-PAT kom-pen-SA-see ka-RE-na ke-re-TA-nya sa-NGAT ter-LAM-bat.",
          "`kompensasi` = compensation; `karena` = because of.",
          "VN-speaker note: `mendapat kompensasi` sounds natural in formal transport contexts, more so than `ada uang pengganti`.",
        ],
      },
      {
        en: "Saya akan simpan tiket dan pesan penundaan untuk bukti.",
        vi: "Tôi sẽ giữ vé và tin nhắn hoãn chuyến làm bằng chứng.",
        pronunciation_focus: [
          "SA-ya A-kan SIM-pan TI-ket dan PE-san pe-nun-DA-an un-tuk BUK-ti.",
          "`pesan penundaan` = tin nhắn/thông báo hoãn; `untuk bukti` = làm bằng chứng.",
          "L1 Việt: simpan screenshot, barcode, dan pesan dari aplikasi atau email jika ingin klaim.",
        ],
        pronunciation_focus_en: [
          "SA-ya A-kan SIM-pan TEE-ket dan PEH-san pe-noon-DA-an OON-took BOOK-ti.",
          "`pesan penundaan` = delay message/notice; `untuk bukti` = as evidence.",
          "VN-speaker note: keep screenshots, barcodes, and app/email messages if you want to claim compensation.",
        ],
      },
      {
        en: "Tolong jelaskan aturan antrean untuk penumpang yang jadwal ulang.",
        vi: "Xin hãy giải thích quy định xếp hàng cho hành khách đổi lịch.",
        pronunciation_focus: [
          "TO-long je-LAS-kan a-TUR-an an-TRE-an un-tuk pe-num-PANG yang jad-WAL u-LANG.",
          "`aturan antrean` = quy định xếp hàng; `jadwal ulang` = đổi lịch.",
          "L1 Việt: nếu muốn rõ thứ tự, hỏi `aturan antrean` và `loket mana` cùng lúc.",
        ],
        pronunciation_focus_en: [
          "TO-long je-LAS-kan a-TOOR-an an-TRE-an OON-took pe-noom-PANG yang jad-WAL oo-LANG.",
          "`aturan antrean` = queue rules; `jadwal ulang` = rescheduling.",
          "VN-speaker note: if you need the sequence to be clear, ask about `aturan antrean` and `loket mana` together.",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong kasus kereta terlambat ở Indonesia, penumpang thường hỏi hai hướng khác nhau: refund tiket atau jadwal ulang. Nếu chọn refund, bạn cần bukti pembayaran, tiket, dan sering phải datang ke loket KAI theo antrean. Nếu chọn jadwal ulang, số kursi dan peron bisa berubah, jadi nghe pengumuman stasiun dengan cẩn thận. Một số tình huống delay dài có thể có kompensasi theo aturan operator, nhưng không phải mọi vé đều giống nhau.",
    cultural_notes_en:
      "In Indonesian train-delay cases, passengers usually ask for one of two things: a ticket refund or a reschedule. If you choose a refund, you need payment proof, the ticket, and often must go to the KAI counter in queue order. If you choose rescheduling, the seat number and platform may change, so listen carefully to station announcements. Some long-delay situations may qualify for compensation depending on the operator's rules, but not every ticket is the same.",
    tip_advice_vi:
      "Mẫu nhớ nhanh: `Kereta saya terlambat`, `Saya mau minta refund tiket`, `Saya ingin jadwal ulang`, `Nomor kursi saya tetap sama?`, `Apakah ada kompensasi?`. Người Việt nên giữ `terlambat` = trễ, `jadwal ulang` = đổi lịch, `kompensasi` = bồi thường.",
    tip_advice_en:
      "Fast memory set: `Kereta saya terlambat`, `Saya mau minta refund tiket`, `Saya ingin jadwal ulang`, `Nomor kursi saya tetap sama?`, `Apakah ada kompensasi?`. Vietnamese speakers should keep `terlambat` = delayed, `jadwal ulang` = reschedule, and `kompensasi` = compensation.",
    vocabulary: [
      { word: "kereta terlambat", en: "delayed train", vi: "tàu bị trễ", pos: "noun phrase", pronunciation_vi: "ke-RE-ta ter-LAM-bat", pronunciation_en: "ke-RE-ta ter-LAM-bat" },
      { word: "jadwal ulang", en: "reschedule", vi: "đổi lịch", pos: "verb phrase", pronunciation_vi: "jad-WAL u-LANG", pronunciation_en: "jad-WAL oo-LANG" },
      { word: "nomor kursi", en: "seat number", vi: "số ghế", pos: "noun phrase", pronunciation_vi: "NO-mor KUR-si", pronunciation_en: "NO-mor KUR-see" },
      { word: "pengumuman stasiun", en: "station announcement", vi: "thông báo ở ga", pos: "noun phrase", pronunciation_vi: "pe-ngu-MUM-an sta-SI-un", pronunciation_en: "pe-ngoo-MOOM-an sta-SEE-un" },
      { word: "peron", en: "platform", vi: "sân ga", pos: "noun", pronunciation_vi: "PE-ron", pronunciation_en: "PE-ron" },
      { word: "kompensasi", en: "compensation", vi: "bồi thường", pos: "noun", pronunciation_vi: "kom-pen-SA-si", pronunciation_en: "kom-pen-SA-see" },
      { word: "aturan antrean", en: "queue rules", vi: "quy định xếp hàng", pos: "noun phrase", pronunciation_vi: "a-TUR-an an-TRE-an", pronunciation_en: "a-TOOR-an an-TRE-an" },
    ],
    dialogue: [
      {
        speaker: "Penumpang",
        text: "Saya ingin jadwal ulang ke keberangkatan berikutnya.",
        vi: "Tôi muốn đổi sang chuyến khởi hành tiếp theo.",
        en: "I would like to reschedule to the next departure.",
      },
      {
        speaker: "Petugas",
        text: "Baik. Nomor kursi Anda tetap sama atau berubah?",
        vi: "Được. Số ghế của anh/chị giữ nguyên hay thay đổi?",
        en: "Okay. Will your seat number stay the same or change?",
      },
      {
        speaker: "Penumpang",
        text: "Kalau bisa, saya minta nomor kursi yang sama.",
        vi: "Nếu được, tôi xin số ghế giống như cũ.",
        en: "If possible, I would like the same seat number.",
      },
      {
        speaker: "Petugas",
        text: "Silakan tunggu. Kami cek aturan antrean dan kompensasinya dulu.",
        vi: "Xin chờ. Chúng tôi kiểm tra quy định xếp hàng và bồi thường trước.",
        en: "Please wait. We will check the queue rules and compensation first.",
      },
    ],
    exercises: [
      {
        type: "multiple_choice",
        instruction_vi: "Chọn câu phù hợp để đổi chuyến tàu.",
        instruction_en: "Choose the suitable sentence for rescheduling a train.",
        items: [
          {
            prompt: "Bạn muốn đổi sang chuyến tiếp theo.",
            answer: "Saya ingin jadwal ulang ke keberangkatan berikutnya.",
            options: [
              "Saya ingin jadwal ulang ke keberangkatan berikutnya.",
              "Saya mau marah di loket.",
              "Saya tidak punya tiket lagi.",
            ],
          },
          {
            prompt: "Bạn muốn hỏi về bồi thường.",
            answer: "Apakah saya mendapat kompensasi karena keretanya sangat terlambat?",
            options: [
              "Apakah saya mendapat kompensasi karena keretanya sangat terlambat?",
              "Apakah kursi saya bagus?",
              "Saya suka peron ini.",
            ],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi muốn đổi sang chuyến khởi hành tiếp theo.", answer: "Saya ingin jadwal ulang ke keberangkatan berikutnya." },
          { prompt: "Số ghế của tôi giữ nguyên hay thay đổi?", answer: "Nomor kursi saya tetap sama atau berubah?" },
          { prompt: "Tôi sẽ giữ vé và tin nhắn hoãn chuyến làm bằng chứng.", answer: "Saya akan simpan tiket dan pesan penundaan untuk bukti." },
        ],
      },
    ],
  },
];
