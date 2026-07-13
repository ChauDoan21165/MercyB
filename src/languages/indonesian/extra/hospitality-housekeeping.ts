// Hospitality Housekeeping Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file following the established Indonesian extra
// format. The `en` field holds TARGET-LANGUAGE Indonesian, `vi` holds the
// Vietnamese gloss, and pronunciation_focus carries Vietnamese L1 notes with
// English companion explanations in the same order.

type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

type IndonesianVocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type IndonesianDialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type IndonesianExercise = Record<string, unknown>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
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
    id: "indonesian_hospitality_housekeeping",
    level: "B1",
    category: "work_hospitality",
    title_vi: "Housekeeping khách sạn: dọn phòng, ca làm và phàn nàn của khách",
    title_en: "Hotel housekeeping: room cleaning, shifts and guest complaints",
    sentences: [
      {
        en: "Saya dari housekeeping, boleh bersihkan kamar sekarang?",
        vi: "Tôi từ bộ phận housekeeping, bây giờ có thể dọn phòng không ạ?",
        pronunciation_focus: [
          "HAUS-ki-ping thường được dùng trong khách sạn; cũng có thể nói `bagian kebersihan kamar`.",
          "`boleh bersihkan kamar sekarang?` là cách xin phép trước khi vào phòng khách.",
          "Lỗi người Việt: nói thẳng `saya bersihkan kamar`. Trong khách sạn nên hỏi `boleh ...?` để lịch sự.",
        ],
        pronunciation_focus_en: [
          "Housekeeping is commonly used in hotels; `bagian kebersihan kamar` is also possible.",
          "`boleh bersihkan kamar sekarang?` asks permission before entering or cleaning a guest room.",
          "VN-speaker trap: saying only `saya bersihkan kamar`. In a hotel, ask with `boleh ...?` for politeness.",
        ],
      },
      {
        en: "Mohon tunggu sebentar, kami akan ganti sprei dan sarung bantal.",
        vi: "Xin vui lòng chờ một chút, chúng tôi sẽ thay ga giường và vỏ gối.",
        pronunciation_focus: [
          "`sprei` = ga giường; `sarung bantal` = vỏ gối. Hai từ này rất hay gặp trong housekeeping.",
          "`ganti sprei` là thay ga; đừng dịch từng chữ thành `ubah sprei`.",
          "Lỗi người Việt: nhầm `bantal` (gối) với `selimut` (chăn). `sarung bantal` chỉ vỏ gối.",
        ],
        pronunciation_focus_en: [
          "`sprei` means bed sheet; `sarung bantal` means pillowcase. Both are common housekeeping terms.",
          "`ganti sprei` means change the sheets; do not translate literally as `ubah sprei`.",
          "VN-speaker trap: mixing up `bantal` (pillow) and `selimut` (blanket). `sarung bantal` is only the pillowcase.",
        ],
      },
      {
        en: "Handuk bersih sudah kami letakkan di kamar mandi.",
        vi: "Khăn sạch chúng tôi đã đặt trong phòng tắm.",
        pronunciation_focus: [
          "`handuk bersih` = khăn sạch; `kamar mandi` trong khách sạn là phòng tắm/toilet.",
          "`kami letakkan` nghe lịch sự và chuyên nghiệp hơn `kami taruh` trong báo cáo với khách.",
          "Lỗi người Việt: dùng `di` và `ke` lẫn nhau. Đặt vào phòng tắm là `di kamar mandi` nếu nói vị trí hiện tại.",
        ],
        pronunciation_focus_en: [
          "`handuk bersih` means clean towels; `kamar mandi` in a hotel is the bathroom.",
          "`kami letakkan` sounds more polished than `kami taruh` when reporting to a guest.",
          "VN-speaker trap: mixing `di` and `ke`. Use `di kamar mandi` when describing where the towels are now.",
        ],
      },
      {
        en: "Perlengkapan mandi seperti sabun dan sampo sudah diisi ulang.",
        vi: "Đồ dùng phòng tắm như xà phòng và dầu gội đã được bổ sung lại.",
        pronunciation_focus: [
          "`perlengkapan mandi` = đồ dùng phòng tắm; trong khách sạn gồm sabun, sampo, sikat gigi, pasta gigi.",
          "`diisi ulang` = được châm/bổ sung lại; hợp với chai, hộp, hoặc amenity đã hết.",
          "Lỗi người Việt: nói `ditambah lagi` cho mọi thứ. Với đồ tiêu hao trong phòng, `diisi ulang` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "`perlengkapan mandi` means bathroom amenities: soap, shampoo, toothbrush, toothpaste.",
          "`diisi ulang` means refilled or restocked; it fits bottles, containers, or used-up amenities.",
          "VN-speaker trap: using `ditambah lagi` for everything. For room consumables, `diisi ulang` is more natural.",
        ],
      },
      {
        en: "Jadwal shift saya hari ini dari jam tujuh pagi sampai jam tiga sore.",
        vi: "Lịch ca của tôi hôm nay từ bảy giờ sáng đến ba giờ chiều.",
        pronunciation_focus: [
          "`jadwal shift` là lịch ca; từ mượn `shift` rất thường dùng trong ngành khách sạn.",
          "Khoảng thời gian dùng `dari ... sampai ...`, không dùng `di jam tujuh sampai jam tiga`.",
          "Lỗi người Việt: bỏ `pagi/sore` làm giờ dễ mơ hồ. Thêm `pagi`, `siang`, `sore`, hoặc `malam`.",
        ],
        pronunciation_focus_en: [
          "`jadwal shift` means shift schedule; the loanword `shift` is very common in hospitality.",
          "Time ranges use `dari ... sampai ...`, not `di jam tujuh sampai jam tiga`.",
          "VN-speaker trap: omitting `pagi/sore`, making the time ambiguous. Add `pagi`, `siang`, `sore`, or `malam`.",
        ],
      },
      {
        en: "Tamu komplain karena kamar belum dibersihkan.",
        vi: "Khách phàn nàn vì phòng chưa được dọn.",
        pronunciation_focus: [
          "`tamu komplain` là khách phàn nàn; trong công việc cũng có thể nói `tamu mengeluh`.",
          "`belum dibersihkan` = chưa được dọn; thể bị động `di-` phù hợp khi nói về trạng thái phòng.",
          "Lỗi người Việt: dịch `chưa dọn` thành `belum bersih`. `belum bersih` là chưa sạch, không nhất thiết chưa dọn.",
        ],
        pronunciation_focus_en: [
          "`tamu komplain` means the guest complained; at work you may also hear `tamu mengeluh`.",
          "`belum dibersihkan` means has not been cleaned yet; passive `di-` fits room status.",
          "VN-speaker trap: translating 'not cleaned yet' as `belum bersih`. That means not clean yet, not necessarily not cleaned.",
        ],
      },
      {
        en: "Maaf atas ketidaknyamanannya, kami segera kirim petugas ke kamar Bapak.",
        vi: "Xin lỗi vì sự bất tiện này, chúng tôi sẽ gửi nhân viên đến phòng của anh ngay.",
        pronunciation_focus: [
          "`Maaf atas ketidaknyamanannya` là câu xin lỗi dịch vụ cố định, lịch sự hơn `maaf ya`.",
          "`petugas` = nhân viên phụ trách; dùng được khi chưa cần nói rõ housekeeper hay teknisi.",
          "Lỗi người Việt: dùng `kamu` với khách. Nói `Bapak/Ibu` để giữ giọng khách sạn chuyên nghiệp.",
        ],
        pronunciation_focus_en: [
          "`Maaf atas ketidaknyamanannya` is a fixed service apology, more professional than `maaf ya`.",
          "`petugas` means the staff member on duty; it works when you do not need to specify housekeeper or technician.",
          "VN-speaker trap: using `kamu` with a guest. Use `Bapak/Ibu` for professional hotel speech.",
        ],
      },
      {
        en: "Kamar ini sudah siap untuk tamu berikutnya.",
        vi: "Phòng này đã sẵn sàng cho khách tiếp theo.",
        pronunciation_focus: [
          "`sudah siap` = đã sẵn sàng; cụm báo cáo trạng thái phòng rất thường dùng.",
          "`tamu berikutnya` = khách tiếp theo; khác với `tamu lain` là khách khác.",
          "Lỗi người Việt: nói `kamar siap sudah`. Trật tự tự nhiên là `kamar ini sudah siap`.",
        ],
        pronunciation_focus_en: [
          "`sudah siap` means ready already; it is a common room-status phrase.",
          "`tamu berikutnya` means the next guest; `tamu lain` means another guest.",
          "VN-speaker trap: saying `kamar siap sudah`. Natural order is `kamar ini sudah siap`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong khách sạn Indonesia, housekeeping thường phối hợp với resepsionis và supervisor qua trạng thái phòng: `belum dibersihkan`, `sedang dibersihkan`, `sudah siap`, hoặc `ada komplain`. Với khách, giọng nói cần lịch sự và ngắn gọn: xin phép trước khi vào phòng, dùng `Bapak/Ibu`, xin lỗi bằng `maaf atas ketidaknyamanannya`, rồi nói hành động cụ thể như `kami segera kirim petugas`.",
    cultural_notes_en:
      "In Indonesian hotels, housekeeping often coordinates with reception and supervisors through room statuses: `belum dibersihkan`, `sedang dibersihkan`, `sudah siap`, or `ada komplain`. With guests, keep the tone polite and concise: ask permission before entering, use `Bapak/Ibu`, apologize with `maaf atas ketidaknyamanannya`, then state the concrete action such as `kami segera kirim petugas`.",
    tip_advice_vi:
      "Mẹo cho người Việt: trong housekeeping, hãy nhớ ba khung chính: xin phép (`boleh bersihkan kamar sekarang?`), báo trạng thái (`kamar sudah siap`), và xử lý phàn nàn (`maaf..., kami segera...`). Dùng thể bị động `di-` cho tình trạng phòng: `dibersihkan`, `diganti`, `diisi ulang`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: in housekeeping, remember three frames: permission (`boleh bersihkan kamar sekarang?`), status reports (`kamar sudah siap`), and complaint handling (`maaf..., kami segera...`). Use passive `di-` for room status: `dibersihkan`, `diganti`, `diisi ulang`.",
    vocabulary: [
      {
        cell_id: "c76150f1-fcde-48e6-994c-fd4aec5d3545",
        word: "housekeeping",
        en: "housekeeping department",
        vi: "bộ phận dọn phòng",
        pos: "noun",
        pronunciation_vi: "HAUS-ki-ping",
        pronunciation_en: "HOUSE-kee-ping",
      },
      {
        cell_id: "c9ad67ce-d491-4f17-a1ea-f0a7b44b599d",
        word: "bersihkan kamar",
        en: "clean the room",
        vi: "dọn phòng",
        pos: "verb phrase",
        pronunciation_vi: "ber-SIH-kan KA-mar",
        pronunciation_en: "ber-SEEH-kan KA-mar",
      },
      {
        cell_id: "df4fb3b9-cfee-4ded-b1ee-581e81a17426",
        word: "ganti sprei",
        en: "change the bed sheets",
        vi: "thay ga giường",
        pos: "verb phrase",
        pronunciation_vi: "GAN-ti SPREI",
        pronunciation_en: "GAN-tee SPRAY",
      },
      {
        cell_id: "f986fe46-022e-4ba0-bf2c-4b9ef70338b0",
        word: "handuk",
        en: "towel",
        vi: "khăn tắm",
        pos: "noun",
        pronunciation_vi: "HAN-duk",
        pronunciation_en: "HAN-dook",
      },
      {
        cell_id: "3f1af30f-5bed-4b78-9bc3-822afee6f0da",
        word: "perlengkapan mandi",
        en: "bathroom amenities",
        vi: "đồ dùng phòng tắm",
        pos: "noun phrase",
        pronunciation_vi: "per-leng-KAP-an MAN-di",
        pronunciation_en: "per-leng-KAP-an MAN-dee",
      },
      {
        cell_id: "78aca1be-e23b-40c4-a2a4-f09f1ec128ff",
        word: "jadwal shift",
        en: "shift schedule",
        vi: "lịch ca",
        pos: "noun phrase",
        pronunciation_vi: "JAD-wal shift",
        pronunciation_en: "JAD-wal shift",
      },
      {
        cell_id: "2a2677cd-ecea-4b62-8ca0-e44d856d7866",
        word: "tamu komplain",
        en: "the guest complains / complained",
        vi: "khách phàn nàn",
        pos: "phrase",
        pronunciation_vi: "TA-mu kom-PLAIN",
        pronunciation_en: "TA-moo kom-PLAIN",
      },
      {
        cell_id: "8d383aed-ac96-4f3b-9a1e-08d17213473a",
        word: "ketidaknyamanan",
        en: "inconvenience",
        vi: "sự bất tiện",
        pos: "noun",
        pronunciation_vi: "ke-ti-dak-nya-MA-nan",
        pronunciation_en: "ke-tee-dak-nya-MA-nan",
      },
    ],
    dialogue: [
      {
        cell_id: "a31248fb-66b2-495e-b2e9-0577c03c19c8",
        speaker: "Housekeeping",
        text: "Selamat pagi, saya dari housekeeping. Boleh bersihkan kamar sekarang?",
        vi: "Chào buổi sáng, tôi từ bộ phận housekeeping. Bây giờ có thể dọn phòng không ạ?",
        en: "Good morning, I am from housekeeping. May I clean the room now?",
      },
      {
        cell_id: "e8b9bf1d-e8fc-45c5-a463-e8028bf59b1e",
        speaker: "Tamu",
        text: "Boleh, tapi tolong ganti sprei dan tambah handuk.",
        vi: "Được, nhưng làm ơn thay ga giường và thêm khăn.",
        en: "Yes, but please change the sheets and add towels.",
      },
      {
        cell_id: "57b3b0eb-c619-466d-8e55-2190af6b2f48",
        speaker: "Housekeeping",
        text: "Baik, Bapak. Perlengkapan mandi juga akan kami isi ulang.",
        vi: "Vâng, thưa anh. Đồ dùng phòng tắm chúng tôi cũng sẽ bổ sung lại.",
        en: "Certainly, sir. We will also restock the bathroom amenities.",
      },
      {
        cell_id: "5df85e7c-c81e-4e57-9e11-8e13a7a92297",
        speaker: "Supervisor",
        text: "Kalau ada tamu komplain, segera lapor ke saya.",
        vi: "Nếu có khách phàn nàn, báo ngay cho tôi.",
        en: "If a guest complains, report to me immediately.",
      },
      {
        cell_id: "45b059d5-07ee-44e3-8d84-f2c1f9f389fc",
        speaker: "Housekeeping",
        text: "Siap. Setelah kamar selesai, saya ubah statusnya menjadi sudah siap.",
        vi: "Rõ. Sau khi phòng xong, tôi đổi trạng thái thành đã sẵn sàng.",
        en: "Understood. After the room is done, I will change the status to ready.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Bây giờ có thể dọn phòng không ạ?",
        prompt_en: "Translate into Indonesian: May I clean the room now?",
        answer: "Boleh bersihkan kamar sekarang?",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Mohon tunggu sebentar, kami akan ganti ___ dan sarung bantal.",
        prompt_en: "Fill in the blank: Mohon tunggu sebentar, kami akan ganti ___ dan sarung bantal.",
        answer: "sprei",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Khách phàn nàn vì phòng chưa được dọn.",
        prompt_en: "Translate into Indonesian: The guest complained because the room has not been cleaned yet.",
        answer: "Tamu komplain karena kamar belum dibersihkan.",
      },
      {
        type: "roleplay",
        prompt_vi: "Bạn là nhân viên housekeeping. Xin lỗi khách và nói sẽ gửi nhân viên đến phòng ngay.",
        prompt_en: "You are housekeeping staff. Apologize to the guest and say you will send staff to the room immediately.",
        answer: "Maaf atas ketidaknyamanannya, kami segera kirim petugas ke kamar Bapak/Ibu.",
      },
    ],
  },
];
