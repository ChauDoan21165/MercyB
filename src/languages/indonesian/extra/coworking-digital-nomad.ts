// Indonesian coworking / digital nomad lesson pack for Vietnamese learners.
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

export const coworkingDigitalNomadLessons: IndonesianLesson[] = [
  {
    id: "indonesian_coworking_day_pass",
    level: "A2",
    category: "work_travel",
    title_vi: "Thuê bàn theo ngày ở coworking space",
    title_en: "Booking a day desk at a coworking space",
    sentences: [
      {
        en: "Saya mau pesan meja harian untuk besok.",
        vi: "Tôi muốn đặt bàn theo ngày cho ngày mai.",
        pronunciation_focus: [
          "SA-ya MAU PE-san ME-ja ha-ri-AN UN-tuk BE-sok.",
          "`meja harian` = bàn theo ngày; `harian` giúp phân biệt với gói tháng.",
          "L1 Việt: `pesan` = đặt trước/gọi món. Trong coworking, nghĩa là đặt chỗ, không phải nhắn tin.",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU PE-san ME-ja ha-ri-AN UN-tuk BE-sok.",
          "`meja harian` = day desk; `harian` distinguishes it from a monthly plan.",
          "VN-speaker trap: `pesan` can mean reserve/order. In coworking, it means book a spot, not send a message.",
        ],
      },
      {
        en: "Apakah Wi-Fi di sini cepat dan stabil?",
        vi: "Wi-Fi ở đây có nhanh và ổn định không?",
        pronunciation_focus: [
          "a-PA-kah WAI-fai di SI-ni CE-pat dan STA-bil.",
          "`cepat dan stabil` là cặp từ tự nhiên khi hỏi về mạng.",
          "L1 Việt: chữ `c` trong `cepat` đọc như 'ch': CE-pat, không đọc như /k/.",
        ],
        pronunciation_focus_en: [
          "a-PA-kah WAI-fai di SI-ni CE-pat dan STA-bil.",
          "`cepat dan stabil` is a natural pair when asking about internet quality.",
          "VN-speaker note: Indonesian `c` in `cepat` sounds like 'ch', not /k/.",
        ],
      },
      {
        en: "Harga meja harian sudah termasuk kopi gratis?",
        vi: "Giá bàn theo ngày đã bao gồm cà phê miễn phí chưa?",
        pronunciation_focus: [
          "HAR-ga ME-ja ha-ri-AN SU-dah ter-MA-suk KO-pi GRA-tis.",
          "`sudah termasuk` = đã bao gồm; dùng khi hỏi giá có gồm tiện ích không.",
          "L1 Việt: `gratis` = miễn phí, không phải `bebas`. `Bebas` thường là tự do/thoải mái.",
        ],
        pronunciation_focus_en: [
          "HAR-ga ME-ja ha-ri-AN SU-dah ter-MA-suk KO-pi GRA-tis.",
          "`sudah termasuk` = already included; use it when asking what a price includes.",
          "VN-speaker trap: `gratis` = free of charge, not `bebas`. `Bebas` usually means free/unrestricted.",
        ],
      },
      {
        en: "Saya perlu stop kontak dekat meja.",
        vi: "Tôi cần ổ cắm điện gần bàn.",
        pronunciation_focus: [
          "SA-ya per-LU stop KON-tak de-KAT ME-ja.",
          "`stop kontak` = ổ cắm điện; cụm này rất thực tế ở quán cà phê/coworking.",
          "L1 Việt: `dekat meja` = gần bàn. Nếu nói `di meja`, nghĩa là ở trên/tại bàn.",
        ],
        pronunciation_focus_en: [
          "SA-ya per-LU stop KON-tak de-KAT ME-ja.",
          "`stop kontak` = power outlet; a very practical phrase in cafes and coworking spaces.",
          "VN-speaker trap: `dekat meja` = near the desk. `di meja` means at/on the desk.",
        ],
      },
      {
        en: "Meeting room bisa dipakai satu jam?",
        vi: "Phòng họp có thể dùng một giờ không?",
        pronunciation_focus: [
          "MI-ting rum BI-sa di-PA-kai SA-tu jam.",
          "`dipakai` = được dùng/sử dụng; dạng bị động rất tự nhiên khi hỏi quy định.",
          "L1 Việt: giữ `satu jam` sau động từ; không cần từ đếm riêng như tiếng Việt.",
        ],
        pronunciation_focus_en: [
          "MI-ting room BI-sa di-PA-kai SA-tu jam.",
          "`dipakai` = be used; the passive form is natural when asking about rules.",
          "VN-speaker note: keep `satu jam` after the verb; Indonesian does not need a separate classifier here.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Jakarta, Bali, Bandung và nhiều thành phố lớn, coworking space thường bán gói `meja harian`, gói mingguan/bulanan, meeting room, Wi-Fi cepat, loker, pantry, và kopi gratis. Người làm việc từ xa hay hỏi trước về kecepatan Wi-Fi, stop kontak, jam buka, dan ketenangan ruang kerja.",
    cultural_notes_en:
      "In Jakarta, Bali, Bandung, and other major cities, coworking spaces often sell day desks, weekly/monthly plans, meeting rooms, fast Wi-Fi, lockers, pantry access, and free coffee. Remote workers commonly ask about Wi-Fi speed, power outlets, opening hours, and how quiet the work area is.",
    tip_advice_vi:
      "Mẫu an toàn: `Saya mau pesan...`, `Apakah sudah termasuk...?`, `Saya perlu...`, `Bisa dipakai...?`. Người Việt nên chú ý `di sini` = ở đây, `ke sini` = đến đây; khi hỏi tiện ích ở coworking, thường dùng `di sini`.",
    tip_advice_en:
      "Safe frames: `Saya mau pesan...`, `Apakah sudah termasuk...?`, `Saya perlu...`, `Bisa dipakai...?`. Vietnamese speakers should track `di sini` = here/at this place, while `ke sini` = to here; for amenities at a coworking space, use `di sini`.",
    vocabulary: [
      {
        word: "coworking space",
        en: "coworking space",
        vi: "không gian làm việc chung",
        pos: "noun",
        pronunciation_vi: "KO-wer-king spes",
        pronunciation_en: "CO-working space",
      },
      {
        word: "meja harian",
        en: "day desk",
        vi: "bàn theo ngày",
        pos: "noun phrase",
        pronunciation_vi: "ME-ja ha-ri-AN",
        pronunciation_en: "ME-ja ha-ree-AN",
      },
      {
        word: "Wi-Fi cepat",
        en: "fast Wi-Fi",
        vi: "Wi-Fi nhanh",
        pos: "noun phrase",
        pronunciation_vi: "WAI-fai CE-pat",
        pronunciation_en: "WAI-fai CHE-pat",
      },
      {
        word: "meeting room",
        en: "meeting room",
        vi: "phòng họp",
        pos: "noun",
        pronunciation_vi: "MI-ting rum",
        pronunciation_en: "MEE-ting room",
      },
      {
        word: "kopi gratis",
        en: "free coffee",
        vi: "cà phê miễn phí",
        pos: "noun phrase",
        pronunciation_vi: "KO-pi GRA-tis",
        pronunciation_en: "KO-pee GRA-tis",
      },
      {
        word: "stop kontak",
        en: "power outlet",
        vi: "ổ cắm điện",
        pos: "noun",
        pronunciation_vi: "stop KON-tak",
        pronunciation_en: "stop KON-tak",
      },
    ],
    dialogue: [
      {
        speaker: "Resepsionis",
        text: "Selamat pagi. Mau ambil paket harian atau bulanan?",
        vi: "Chào buổi sáng. Bạn muốn lấy gói theo ngày hay theo tháng?",
        en: "Good morning. Would you like the daily or monthly package?",
      },
      {
        speaker: "Nomad",
        text: "Paket harian dulu. Wi-Fi di sini stabil?",
        vi: "Gói theo ngày trước. Wi-Fi ở đây ổn định không?",
        en: "The daily package first. Is the Wi-Fi stable here?",
      },
      {
        speaker: "Resepsionis",
        text: "Stabil. Kopi gratis juga sudah termasuk.",
        vi: "Ổn định. Cà phê miễn phí cũng đã bao gồm.",
        en: "Stable. Free coffee is also included.",
      },
      {
        speaker: "Nomad",
        text: "Bagus. Saya juga perlu meeting room satu jam sore ini.",
        vi: "Tốt. Tôi cũng cần phòng họp một giờ chiều nay.",
        en: "Good. I also need a meeting room for one hour this afternoon.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ phù hợp về coworking space:",
        instruction_en: "Fill in the suitable coworking word:",
        items: [
          {
            prompt: "Saya mau pesan ___ harian untuk besok. (bàn)",
            answer: "meja",
            options: ["meja", "motor", "makan"],
          },
          {
            prompt: "Apakah Wi-Fi di sini cepat dan ___? (ổn định)",
            answer: "stabil",
            options: ["stabil", "sakit", "sibuk"],
          },
          {
            prompt: "Harga ini sudah termasuk kopi ___? (miễn phí)",
            answer: "gratis",
            options: ["gratis", "panas", "pahit"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn đặt bàn theo ngày cho ngày mai.", answer: "Saya mau pesan meja harian untuk besok." },
          { prompt: "Wi-Fi ở đây có nhanh và ổn định không?", answer: "Apakah Wi-Fi di sini cepat dan stabil?" },
          { prompt: "Tôi cần ổ cắm điện gần bàn.", answer: "Saya perlu stop kontak dekat meja." },
        ],
      },
    ],
  },
  {
    id: "indonesian_remote_work_startup_community",
    level: "B1",
    category: "work_travel",
    title_vi: "Làm việc remote và cộng đồng startup",
    title_en: "Remote work and the startup community",
    sentences: [
      {
        en: "Saya kerja remote untuk perusahaan di Vietnam.",
        vi: "Tôi làm việc từ xa cho một công ty ở Việt Nam.",
        pronunciation_focus: [
          "SA-ya KER-ja ri-MOT UN-tuk per-u-sa-HA-an di VI-et-nam.",
          "`kerja remote` rất phổ biến trong nói hằng ngày; dạng đầy đủ là `bekerja secara remote`.",
          "L1 Việt: `untuk perusahaan` = cho công ty. Đừng dùng `dengan perusahaan` nếu nghĩa là làm cho ai.",
        ],
        pronunciation_focus_en: [
          "SA-ya KER-ja ree-MOTE UN-tuk per-u-sa-HA-an di VI-et-nam.",
          "`kerja remote` is common in daily speech; the fuller form is `bekerja secara remote`.",
          "VN-speaker trap: `untuk perusahaan` = for a company. Do not use `dengan perusahaan` when you mean employer/client.",
        ],
      },
      {
        en: "Saya butuh tempat yang tenang untuk video call.",
        vi: "Tôi cần một nơi yên tĩnh để gọi video.",
        pronunciation_focus: [
          "SA-ya BU-tuh TEM-pat yang TE-nang UN-tuk VI-de-o kol.",
          "`tempat yang tenang` = nơi yên tĩnh; `yang` nối danh từ với tính từ/cụm mô tả.",
          "L1 Việt: không đặt tính từ trước danh từ như tiếng Anh; nói `tempat tenang`, không phải `tenang tempat`.",
        ],
        pronunciation_focus_en: [
          "SA-ya BOO-tooh TEM-pat yang TE-nang UN-tuk VI-de-o call.",
          "`tempat yang tenang` = a quiet place; `yang` links a noun to a descriptive phrase.",
          "VN-speaker note: do not place the adjective before the noun like English; say `tempat tenang`, not `tenang tempat`.",
        ],
      },
      {
        en: "Komunitas startup di sini sering mengadakan acara networking.",
        vi: "Cộng đồng startup ở đây thường tổ chức sự kiện networking.",
        pronunciation_focus: [
          "ko-mu-ni-TAS STAR-tap di SI-ni SE-ring meng-a-DA-kan a-CA-ra NET-wer-king.",
          "`mengadakan acara` = tổ chức sự kiện; dùng cho meetup, workshop, networking.",
          "L1 Việt: `sering` đứng trước động từ/cụm động từ: `sering mengadakan`, giống 'thường tổ chức'.",
        ],
        pronunciation_focus_en: [
          "ko-mu-ni-TAS STAR-tup di SI-ni SE-ring meng-a-DA-kan a-CHA-ra NET-working.",
          "`mengadakan acara` = hold/organize an event; useful for meetups, workshops, and networking.",
          "VN-speaker win: `sering` goes before the verb phrase: `sering mengadakan`, like Vietnamese 'often organize'.",
        ],
      },
      {
        en: "Saya ingin ikut workshop tentang produk digital.",
        vi: "Tôi muốn tham gia workshop về sản phẩm số.",
        pronunciation_focus: [
          "SA-ya I-ngin I-kut WERK-syop ten-TANG PRO-duk di-gi-TAL.",
          "`ikut workshop` = tham gia workshop; `tentang` = về chủ đề gì.",
          "L1 Việt: `ikut` là cách nói tự nhiên cho tham gia hoạt động; không cần luôn dùng `berpartisipasi`.",
        ],
        pronunciation_focus_en: [
          "SA-ya I-ngin I-kut WORK-shop ten-TANG PRO-duk di-gi-TAL.",
          "`ikut workshop` = join a workshop; `tentang` introduces the topic.",
          "VN-speaker note: `ikut` is natural for joining activities; you do not always need formal `berpartisipasi`.",
        ],
      },
      {
        en: "Boleh kenalan dengan founder lain di acara ini?",
        vi: "Tôi có thể làm quen với các founder khác ở sự kiện này không?",
        pronunciation_focus: [
          "BO-leh ke-NAL-an DE-ngan FAUN-der LA-in di a-CA-ra I-ni.",
          "`kenalan dengan` = làm quen với; dùng khi mở đầu networking lịch sự.",
          "L1 Việt: `lain` đứng sau danh từ: `founder lain`, không nói `lain founder`.",
        ],
        pronunciation_focus_en: [
          "BO-leh ke-NAL-an DE-ngan FOUN-der LA-in di a-CHA-ra I-ni.",
          "`kenalan dengan` = get acquainted with; useful for polite networking.",
          "VN-speaker trap: `lain` comes after the noun: `founder lain`, not `lain founder`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Nhiều digital nomad ở Indonesia làm việc từ Bali, Jakarta, Yogyakarta hoặc Bandung. Trong komunitas startup, từ mượn tiếng Anh như `remote`, `founder`, `workshop`, `networking`, `pitch`, và `product` rất thường gặp. Dù vậy, khi cần lịch sự, người Indonesia vẫn dùng khung mềm như `boleh`, `ingin`, `mau tanya`, và `terima kasih`.",
    cultural_notes_en:
      "Many digital nomads in Indonesia work from Bali, Jakarta, Yogyakarta, or Bandung. In startup communities, English loanwords such as `remote`, `founder`, `workshop`, `networking`, `pitch`, and `product` are very common. Even so, polite Indonesian frames like `boleh`, `ingin`, `mau tanya`, and `terima kasih` remain important.",
    tip_advice_vi:
      "Mẫu networking hữu ích: `Boleh kenalan?`, `Saya kerja remote untuk...`, `Saya ingin ikut workshop...`, `Acara networking mulai jam berapa?`. Với người mới gặp, dùng `Kak`, `Bapak/Ibu`, hoặc tên người đó thay vì `kamu`.",
    tip_advice_en:
      "Useful networking chunks: `Boleh kenalan?`, `Saya kerja remote untuk...`, `Saya ingin ikut workshop...`, `Acara networking mulai jam berapa?`. With people you just met, use `Kak`, `Bapak/Ibu`, or the person's name instead of `kamu`.",
    vocabulary: [
      {
        word: "kerja remote",
        en: "remote work",
        vi: "làm việc từ xa",
        pos: "verb / noun phrase",
        pronunciation_vi: "KER-ja ri-MOT",
        pronunciation_en: "KER-ja ree-MOTE",
      },
      {
        word: "digital nomad",
        en: "digital nomad",
        vi: "người du mục số",
        pos: "noun",
        pronunciation_vi: "DI-ji-tal NO-mad",
        pronunciation_en: "DI-gi-tal NO-mad",
      },
      {
        word: "komunitas startup",
        en: "startup community",
        vi: "cộng đồng startup",
        pos: "noun phrase",
        pronunciation_vi: "ko-mu-ni-TAS STAR-tap",
        pronunciation_en: "ko-mu-ni-TAS STAR-tup",
      },
      {
        word: "acara networking",
        en: "networking event",
        vi: "sự kiện networking",
        pos: "noun phrase",
        pronunciation_vi: "a-CA-ra NET-wer-king",
        pronunciation_en: "a-CHA-ra NET-working",
      },
      {
        word: "video call",
        en: "video call",
        vi: "cuộc gọi video",
        pos: "noun",
        pronunciation_vi: "VI-de-o kol",
        pronunciation_en: "VI-de-o call",
      },
      {
        word: "kenalan",
        en: "to get acquainted",
        vi: "làm quen",
        pos: "verb",
        pronunciation_vi: "ke-NAL-an",
        pronunciation_en: "ke-NAL-an",
      },
    ],
    dialogue: [
      {
        speaker: "Nina",
        text: "Kamu digital nomad juga?",
        vi: "Bạn cũng là digital nomad à?",
        en: "Are you a digital nomad too?",
      },
      {
        speaker: "Mai",
        text: "Iya, saya kerja remote untuk perusahaan di Vietnam.",
        vi: "Ừ, tôi làm việc từ xa cho một công ty ở Việt Nam.",
        en: "Yes, I work remotely for a company in Vietnam.",
      },
      {
        speaker: "Nina",
        text: "Nanti malam ada acara networking komunitas startup.",
        vi: "Tối nay có sự kiện networking của cộng đồng startup.",
        en: "Tonight there is a networking event for the startup community.",
      },
      {
        speaker: "Mai",
        text: "Menarik. Boleh saya ikut dan kenalan dengan founder lain?",
        vi: "Thú vị đấy. Tôi có thể tham gia và làm quen với các founder khác không?",
        en: "Interesting. May I join and meet other founders?",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa tiếng Việt:",
        instruction_en: "Match each phrase with its Vietnamese meaning:",
        items: [
          { prompt: "kerja remote", answer: "làm việc từ xa" },
          { prompt: "komunitas startup", answer: "cộng đồng startup" },
          { prompt: "acara networking", answer: "sự kiện networking" },
          { prompt: "kenalan", answer: "làm quen" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Chọn từ đúng:",
        instruction_en: "Choose the correct word:",
        items: [
          {
            prompt: "Saya butuh tempat yang ___ untuk video call. (yên tĩnh)",
            answer: "tenang",
            options: ["tenang", "terlambat", "terbuka"],
          },
          {
            prompt: "Komunitas startup sering mengadakan acara ___.",
            answer: "networking",
            options: ["networking", "laundry", "parkir"],
          },
          {
            prompt: "Boleh ___ dengan founder lain? (làm quen)",
            answer: "kenalan",
            options: ["kenalan", "ketinggalan", "keberatan"],
          },
        ],
      },
    ],
  },
  {
    id: "indonesian_coworking_invoice_payment",
    level: "B1",
    category: "work_travel",
    title_vi: "Hóa đơn và thanh toán coworking",
    title_en: "Coworking invoices and payment",
    sentences: [
      {
        en: "Bisa minta invoice atas nama perusahaan?",
        vi: "Tôi có thể xin hóa đơn đứng tên công ty không?",
        pronunciation_focus: [
          "BI-sa MIN-ta IN-vois A-tas NA-ma per-u-sa-HA-an.",
          "`atas nama perusahaan` = đứng tên công ty; rất hay dùng khi cần hóa đơn.",
          "L1 Việt: `minta invoice` tự nhiên trong giao dịch; không cần dịch invoice thành từ khác nếu nơi đó dùng tiếng Anh.",
        ],
        pronunciation_focus_en: [
          "BI-sa MIN-ta IN-voice A-tas NA-ma per-u-sa-HA-an.",
          "`atas nama perusahaan` = under the company's name; common when requesting an invoice.",
          "VN-speaker note: `minta invoice` is natural in transactions; no need to translate `invoice` if the place uses the loanword.",
        ],
      },
      {
        en: "Pembayaran bisa lewat transfer bank atau QRIS?",
        vi: "Thanh toán có thể qua chuyển khoản ngân hàng hoặc QRIS không?",
        pronunciation_focus: [
          "pem-ba-YA-ran BI-sa LE-wat TRANS-fer bangk A-tau KU-ris.",
          "`lewat` = qua kênh/phương thức; dùng cho transfer, QRIS, aplikasi.",
          "L1 Việt: `bank` trong Indonesia thường nghe như `bangk`; viết vẫn là `bank`.",
        ],
        pronunciation_focus_en: [
          "pem-ba-YA-ran BI-sa LE-wat TRANS-fer bank A-tau QRIS.",
          "`lewat` = through/via a channel or method; use it for transfer, QRIS, or apps.",
          "VN-speaker note: Indonesian `bank` often sounds like `bangk`; the spelling remains `bank`.",
        ],
      },
      {
        en: "Tolong kirim invoice ke email saya.",
        vi: "Làm ơn gửi hóa đơn vào email của tôi.",
        pronunciation_focus: [
          "TO-long KI-rim IN-vois ke I-mel SA-ya.",
          "`kirim ke email` = gửi đến email; `ke` chỉ hướng gửi.",
          "L1 Việt: đừng dùng `di email` nếu nghĩa là gửi đến email; dùng `ke email` hoặc `lewat email`.",
        ],
        pronunciation_focus_en: [
          "TO-long KI-rim IN-voice ke E-mail SA-ya.",
          "`kirim ke email` = send to email; `ke` marks destination.",
          "VN-speaker trap: do not use `di email` when you mean send to email; use `ke email` or `lewat email`.",
        ],
      },
      {
        en: "Apakah ada diskon untuk paket mingguan?",
        vi: "Có giảm giá cho gói theo tuần không?",
        pronunciation_focus: [
          "a-PA-kah A-da DIS-kon UN-tuk PA-ket ming-gu-AN.",
          "`paket mingguan` = gói theo tuần; `bulanan` = theo tháng; `harian` = theo ngày.",
          "L1 Việt: đuôi `-an` tạo nghĩa theo chu kỳ/nhóm trong nhiều từ: harian, mingguan, bulanan.",
        ],
        pronunciation_focus_en: [
          "a-PA-kah A-da DIS-kon UN-tuk PA-ket ming-gu-AN.",
          "`paket mingguan` = weekly package; `bulanan` = monthly; `harian` = daily.",
          "VN-speaker note: the suffix `-an` often forms period/group nouns: harian, mingguan, bulanan.",
        ],
      },
      {
        en: "Saya akan perpanjang paket kalau internetnya stabil.",
        vi: "Tôi sẽ gia hạn gói nếu mạng ổn định.",
        pronunciation_focus: [
          "SA-ya A-kan per-PAN-jang PA-ket KA-lau IN-ter-net-nya STA-bil.",
          "`perpanjang paket` = gia hạn gói; `kalau` = nếu.",
          "L1 Việt: `internetnya` = mạng của chỗ đó/ngữ cảnh đó. Hậu tố `-nya` giúp câu tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya A-kan per-PAN-jang PA-ket KA-lau IN-ter-net-nya STA-bil.",
          "`perpanjang paket` = extend/renew a package; `kalau` = if.",
          "VN-speaker note: `internetnya` means the internet there/in that context. The `-nya` suffix makes the sentence natural.",
        ],
      },
    ],
    cultural_notes_vi:
      "Coworking space ở Indonesia có thể nhận thanh toán bằng transfer bank, QRIS, kartu debit/kredit, atau e-wallet. Nếu cần chứng từ công ty, hãy hỏi `invoice atas nama perusahaan` và cung cấp nama perusahaan, alamat, email, dan NPWP nếu họ yêu cầu. Với gói dài hơn, hỏi `diskon paket mingguan/bulanan` là bình thường.",
    cultural_notes_en:
      "Coworking spaces in Indonesia may accept bank transfer, QRIS, debit/credit cards, or e-wallets. If you need company documentation, ask for an `invoice atas nama perusahaan` and provide the company name, address, email, and NPWP if requested. For longer packages, asking about a weekly/monthly discount is normal.",
    tip_advice_vi:
      "Mẫu thực dụng: `Bisa minta invoice...?`, `Pembayaran bisa lewat...?`, `Tolong kirim ke email saya`, `Ada diskon untuk paket...?`. Người Việt nên phân biệt `ke email` (gửi đến email) và `di email` (ở trong email).",
    tip_advice_en:
      "Practical frames: `Bisa minta invoice...?`, `Pembayaran bisa lewat...?`, `Tolong kirim ke email saya`, `Ada diskon untuk paket...?`. Vietnamese speakers should distinguish `ke email` (send to email) from `di email` (in the email).",
    vocabulary: [
      {
        word: "invoice",
        en: "invoice",
        vi: "hóa đơn",
        pos: "noun",
        pronunciation_vi: "IN-vois",
        pronunciation_en: "IN-voice",
      },
      {
        word: "atas nama perusahaan",
        en: "under the company's name",
        vi: "đứng tên công ty",
        pos: "phrase",
        pronunciation_vi: "A-tas NA-ma per-u-sa-HA-an",
        pronunciation_en: "A-tas NA-ma per-u-sa-HA-an",
      },
      {
        word: "pembayaran",
        en: "payment",
        vi: "thanh toán",
        pos: "noun",
        pronunciation_vi: "pem-ba-YA-ran",
        pronunciation_en: "pem-ba-YA-ran",
      },
      {
        word: "transfer bank",
        en: "bank transfer",
        vi: "chuyển khoản ngân hàng",
        pos: "noun phrase",
        pronunciation_vi: "TRANS-fer bangk",
        pronunciation_en: "TRANS-fer bank",
      },
      {
        word: "paket mingguan",
        en: "weekly package",
        vi: "gói theo tuần",
        pos: "noun phrase",
        pronunciation_vi: "PA-ket ming-gu-AN",
        pronunciation_en: "PA-ket ming-goo-AN",
      },
      {
        word: "perpanjang paket",
        en: "extend a package",
        vi: "gia hạn gói",
        pos: "verb phrase",
        pronunciation_vi: "per-PAN-jang PA-ket",
        pronunciation_en: "per-PAN-jang PA-ket",
      },
    ],
    dialogue: [
      {
        speaker: "Nomad",
        text: "Bisa minta invoice atas nama perusahaan?",
        vi: "Tôi có thể xin hóa đơn đứng tên công ty không?",
        en: "Can I request an invoice under the company name?",
      },
      {
        speaker: "Admin",
        text: "Bisa. Tolong tulis nama perusahaan dan emailnya.",
        vi: "Được. Vui lòng viết tên công ty và email.",
        en: "Yes. Please write the company name and email.",
      },
      {
        speaker: "Nomad",
        text: "Pembayaran bisa lewat QRIS?",
        vi: "Thanh toán có thể qua QRIS không?",
        en: "Can payment be made through QRIS?",
      },
      {
        speaker: "Admin",
        text: "Bisa. Invoice akan kami kirim ke email setelah pembayaran.",
        vi: "Được. Chúng tôi sẽ gửi hóa đơn vào email sau khi thanh toán.",
        en: "Yes. We will send the invoice to your email after payment.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về thanh toán và hóa đơn:",
        instruction_en: "Fill in the payment and invoice word:",
        items: [
          {
            prompt: "Bisa minta ___ atas nama perusahaan? (hóa đơn)",
            answer: "invoice",
            options: ["invoice", "internet", "investor"],
          },
          {
            prompt: "Pembayaran bisa lewat transfer ___? (ngân hàng)",
            answer: "bank",
            options: ["bank", "buku", "barang"],
          },
          {
            prompt: "Apakah ada diskon untuk paket ___? (theo tuần)",
            answer: "mingguan",
            options: ["mingguan", "makanan", "malaman"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi có thể xin hóa đơn đứng tên công ty không?", answer: "Bisa minta invoice atas nama perusahaan?" },
          { prompt: "Làm ơn gửi hóa đơn vào email của tôi.", answer: "Tolong kirim invoice ke email saya." },
          { prompt: "Tôi sẽ gia hạn gói nếu mạng ổn định.", answer: "Saya akan perpanjang paket kalau internetnya stabil." },
        ],
      },
    ],
  },
];
