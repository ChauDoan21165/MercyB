// src/languages/indonesian/extra/local-tour-guide.ts
//
// Indonesian local tour guide pack for Vietnamese learners.
// Covers: pemandu wisata, itinerary, tempat bersejarah, tiket masuk, foto,
// oleh-oleh, tips, jadwal tur, and practical guide/tourist conversations.
//
// Shape mirrors the sibling Indonesian extra files. This file is self-contained:
// it declares inline types and exports one uniquely named lesson array.
//
// Field convention: sentence `en` holds TARGET-LANGUAGE Indonesian; `vi` holds
// Vietnamese. `pronunciation_focus` carries Vietnamese-facing pronunciation and
// grammar notes, including L1 traps; `pronunciation_focus_en` is the English
// companion in the same order.

type LessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

type DialogueLine = {
  cell_id?: string;
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
};

export const localTourGuideLessons: IndonesianLesson[] = [
  {
    id: "indonesian_local_tour_guide_booking",
    level: "A2",
    category: "travel",
    title_vi: "Thuê hướng dẫn viên — lịch trình, vé và điểm tham quan",
    title_en: "Hiring a local guide — itinerary, tickets and sights",
    sentences: [
      {
        en: "Saya mencari pemandu wisata lokal untuk besok.",
        vi: "Tôi đang tìm hướng dẫn viên du lịch địa phương cho ngày mai.",
        pronunciation_focus: [
          "pemandu wisata → hướng dẫn viên du lịch; gốc `pandu` = dẫn đường.",
          "lokal → địa phương; từ mượn nhưng rất tự nhiên trong du lịch.",
          "untuk besok → cho ngày mai; thời gian đặt cuối câu rất gọn.",
        ],
        pronunciation_focus_en: [
          "pemandu wisata → tour guide; root `pandu` = to guide/lead.",
          "lokal → local; a loanword that is natural in tourism.",
          "untuk besok → for tomorrow; time at the end is compact and natural.",
        ],
      },
      {
        en: "Boleh saya lihat itinerary turnya?",
        vi: "Cho tôi xem lịch trình tour được không?",
        pronunciation_focus: [
          "boleh saya lihat ...? → cho tôi xem ... được không; lịch sự và ngắn.",
          "itinerary tur → lịch trình tour; cũng có thể nói `rencana perjalanan`.",
          "Lỗi người Việt: đọc `c` không liên quan ở đây, nhưng nhớ `tur` là cách viết Indonesia của tour.",
        ],
        pronunciation_focus_en: [
          "boleh saya lihat ...? → may I see ...? polite and short.",
          "itinerary tur → tour itinerary; you can also say `rencana perjalanan`.",
          "VN-speaker note: `tur` is the Indonesian spelling/pronunciation of tour.",
        ],
      },
      {
        en: "Jadwal turnya mulai jam delapan pagi.",
        vi: "Lịch tour bắt đầu lúc tám giờ sáng.",
        pronunciation_focus: [
          "jadwal tur → lịch tour; `jadwal` không phải `jam`.",
          "mulai jam delapan pagi → bắt đầu lúc tám giờ sáng.",
          "Lỗi người Việt: nói `di jam delapan`. Với giờ bắt đầu, dùng `mulai jam delapan`.",
        ],
        pronunciation_focus_en: [
          "jadwal tur → tour schedule; `jadwal` is not the same as `jam`.",
          "mulai jam delapan pagi → starts at eight in the morning.",
          "VN-speaker trap: saying `di jam delapan`. For start time, use `mulai jam delapan`.",
        ],
      },
      {
        en: "Apakah tiket masuk sudah termasuk dalam harga tur?",
        vi: "Vé vào cửa đã bao gồm trong giá tour chưa?",
        pronunciation_focus: [
          "tiket masuk → vé vào cửa; thường gặp ở bảo tàng, đền, công viên.",
          "sudah termasuk dalam harga tur → đã bao gồm trong giá tour.",
          "Lỗi người Việt: bỏ `dalam`. Cụm tự nhiên là `termasuk dalam harga`.",
        ],
        pronunciation_focus_en: [
          "tiket masuk → entrance ticket; common at museums, temples, parks.",
          "sudah termasuk dalam harga tur → already included in the tour price.",
          "VN-speaker trap: dropping `dalam`. Natural phrase: `termasuk dalam harga`.",
        ],
      },
      {
        en: "Kami ingin mengunjungi tempat bersejarah.",
        vi: "Chúng tôi muốn tham quan địa điểm lịch sử.",
        pronunciation_focus: [
          "mengunjungi → tham quan/ghé thăm; văn phong du lịch chuẩn.",
          "tempat bersejarah → địa điểm lịch sử; `bersejarah` = có lịch sử.",
          "Lỗi người Việt: nói `tempat sejarah`. Hiểu được, nhưng chuẩn hơn là `tempat bersejarah`.",
        ],
        pronunciation_focus_en: [
          "mengunjungi → visit; standard tourism wording.",
          "tempat bersejarah → historical place/site; `bersejarah` = having history.",
          "VN-speaker trap: saying `tempat sejarah`. Understandable, but `tempat bersejarah` is better.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `pemandu wisata` có thể là hướng dẫn viên chính thức, người địa phương dẫn đường, hoặc tài xế kiêm hướng dẫn. Khi đặt tour, hỏi rõ `jadwal tur`, itinerary, tiket masuk, transport, makan siang, bahasa yang digunakan, dan biaya tambahan. Ở nơi linh thiêng hoặc di tích, luôn hỏi trước khi chụp ảnh.",
    cultural_notes_en:
      "In Indonesia, a `pemandu wisata` can be a licensed guide, a local guide, or a driver-guide. When booking a tour, clarify `jadwal tur`, itinerary, entrance tickets, transport, lunch, language used, and extra fees. At sacred places or historical sites, always ask before taking photos.",
    tip_advice_vi:
      "Mẹo cho người Việt: `wisata` = du lịch/tham quan, nên `pemandu wisata` là hướng dẫn viên. Hỏi tour bằng ba khung: `Boleh saya lihat itinerary?`, `Tiket masuk sudah termasuk?`, `Jadwal turnya mulai jam berapa?`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: `wisata` means tourism/sightseeing, so `pemandu wisata` is a tour guide. Use three tour frames: `Boleh saya lihat itinerary?`, `Tiket masuk sudah termasuk?`, and `Jadwal turnya mulai jam berapa?`.",
    vocabulary: [
      {
        cell_id: "671b8d24-7cfd-46d9-aaac-e77ce5a82439",
        word: "pemandu wisata",
        en: "tour guide",
        vi: "hướng dẫn viên du lịch",
        pos: "noun phrase",
        pronunciation_vi: "pe-MAN-du wi-SA-ta",
        pronunciation_en: "peh-MAN-doo wee-SA-ta",
      },
      {
        cell_id: "4d617f19-82e8-40c0-9521-a990f824b799",
        word: "itinerary",
        en: "itinerary",
        vi: "lịch trình",
        pos: "noun",
        pronunciation_vi: "ai-TI-ne-ra-ri",
        pronunciation_en: "eye-TIN-er-air-ee",
      },
      {
        cell_id: "dea5cec4-3195-4bde-94f3-76707fc4af8f",
        word: "jadwal tur",
        en: "tour schedule",
        vi: "lịch tour",
        pos: "noun phrase",
        pronunciation_vi: "JAD-wal tur",
        pronunciation_en: "JAD-wal tour",
      },
      {
        cell_id: "c232799a-601c-4007-8358-b6d0f0f905ab",
        word: "tiket masuk",
        en: "entrance ticket",
        vi: "vé vào cửa",
        pos: "noun phrase",
        pronunciation_vi: "TI-ket MA-suk",
        pronunciation_en: "TEE-ket MA-sook",
      },
      {
        cell_id: "bc6e4018-dc74-41b2-a8ce-27c0bfcd193f",
        word: "tempat bersejarah",
        en: "historical site",
        vi: "địa điểm lịch sử",
        pos: "noun phrase",
        pronunciation_vi: "TEM-pat ber-se-JA-rah",
        pronunciation_en: "TEM-pat ber-seh-JA-rah",
      },
      {
        cell_id: "d0d96b26-1931-4b59-9890-e82f020c7d01",
        word: "mengunjungi",
        en: "to visit",
        vi: "tham quan / ghé thăm",
        pos: "verb",
        pronunciation_vi: "me-ngun-JUNG-i",
        pronunciation_en: "meh-ngoon-JOONG-ee",
      },
    ],
    dialogue: [
      {
        cell_id: "d60fd2d2-4d24-4e7c-aee2-6159405e6b89",
        speaker: "Wisatawan",
        text: "Saya mencari pemandu wisata lokal untuk besok.",
        vi: "Tôi đang tìm hướng dẫn viên địa phương cho ngày mai.",
        en: "I am looking for a local tour guide for tomorrow.",
      },
      {
        cell_id: "155f767d-d6ff-4f15-9124-9f070ad4d909",
        speaker: "Agen tur",
        text: "Bisa. Mau tur kota atau tempat bersejarah?",
        vi: "Được. Muốn tour thành phố hay địa điểm lịch sử?",
        en: "Sure. Do you want a city tour or historical sites?",
      },
      {
        cell_id: "056737d5-82ea-4018-be46-a0ebad19a2b0",
        speaker: "Wisatawan",
        text: "Tempat bersejarah. Boleh saya lihat itinerary turnya?",
        vi: "Địa điểm lịch sử. Cho tôi xem lịch trình tour được không?",
        en: "Historical sites. May I see the tour itinerary?",
      },
      {
        cell_id: "68fc2b62-075a-4f25-9e15-913cc4a1c16f",
        speaker: "Agen tur",
        text: "Tentu. Tiket masuk sudah termasuk dalam harga tur.",
        vi: "Tất nhiên. Vé vào cửa đã bao gồm trong giá tour.",
        en: "Of course. Entrance tickets are included in the tour price.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đặt tour còn thiếu:",
        instruction_en: "Fill in the missing tour-booking word:",
        items: [
          {
            prompt: "Saya mencari ___ wisata lokal. (hướng dẫn viên)",
            answer: "pemandu",
            options: ["pemandu", "pemilik", "pembeli"],
          },
          {
            prompt: "Boleh saya lihat ___ turnya? (lịch trình)",
            answer: "itinerary",
            options: ["itinerary", "internet", "identitas"],
          },
          {
            prompt: "Apakah ___ masuk sudah termasuk? (vé)",
            answer: "tiket",
            options: ["tiket", "tips", "toko"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "pemandu wisata", answer: "hướng dẫn viên du lịch" },
          { prompt: "jadwal tur", answer: "lịch tour" },
          { prompt: "tiket masuk", answer: "vé vào cửa" },
          { prompt: "tempat bersejarah", answer: "địa điểm lịch sử" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi đang tìm hướng dẫn viên địa phương cho ngày mai.", answer: "Saya mencari pemandu wisata lokal untuk besok." },
          { prompt: "Lịch tour bắt đầu lúc tám giờ sáng.", answer: "Jadwal turnya mulai jam delapan pagi." },
          { prompt: "Chúng tôi muốn tham quan địa điểm lịch sử.", answer: "Kami ingin mengunjungi tempat bersejarah." },
        ],
      },
    ],
  },
  {
    id: "indonesian_tour_photos_souvenirs_tips",
    level: "B1",
    category: "travel",
    title_vi: "Trong tour — ảnh, quà lưu niệm và tiền tip",
    title_en: "During the tour — photos, souvenirs and tips",
    sentences: [
      {
        en: "Boleh foto di dalam museum ini?",
        vi: "Có được chụp ảnh bên trong bảo tàng này không?",
        pronunciation_focus: [
          "boleh foto → được phép chụp ảnh; `boleh` = được phép.",
          "di dalam museum ini → bên trong bảo tàng này; vị trí dùng `di`.",
          "Lỗi người Việt: dùng `bisa` cho phép. `bisa` = có thể/khả năng, `boleh` = được phép.",
        ],
        pronunciation_focus_en: [
          "boleh foto → may take photos; `boleh` = allowed/permitted.",
          "di dalam museum ini → inside this museum; location uses `di`.",
          "VN-speaker trap: using `bisa` for permission. `bisa` = can/able, `boleh` = may/allowed.",
        ],
      },
      {
        en: "Tolong foto kami di depan candi.",
        vi: "Làm ơn chụp ảnh chúng tôi trước ngôi đền.",
        pronunciation_focus: [
          "tolong foto kami → làm ơn chụp ảnh chúng tôi; `foto` dùng như động từ trong hội thoại.",
          "di depan candi → trước đền/candi; `candi` là đền cổ Hindu-Buddha.",
          "Lỗi người Việt: nói `ambil foto kami` vẫn hiểu, nhưng du khách hay nói `foto kami`.",
        ],
        pronunciation_focus_en: [
          "tolong foto kami → please take our photo; `foto` works as a conversational verb.",
          "di depan candi → in front of the temple; `candi` is an ancient Hindu-Buddhist temple.",
          "VN-speaker trap: `ambil foto kami` is understandable, but tourists often say `foto kami`.",
        ],
      },
      {
        en: "Di mana tempat beli oleh-oleh yang harganya wajar?",
        vi: "Chỗ mua quà lưu niệm có giá hợp lý ở đâu?",
        pronunciation_focus: [
          "oleh-oleh → quà mang về/quà lưu niệm; từ lặp cố định.",
          "harganya wajar → giá hợp lý; `wajar` = phải chăng/hợp lý.",
          "Lỗi người Việt: nói `harga normal` theo tiếng Anh. `harga wajar` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "oleh-oleh → souvenirs/gifts to bring home; fixed reduplicated word.",
          "harganya wajar → the price is reasonable; `wajar` = fair/reasonable.",
          "VN-speaker trap: saying English-style `harga normal`. `harga wajar` is more natural.",
        ],
      },
      {
        en: "Apakah tips untuk pemandu wajib?",
        vi: "Tiền tip cho hướng dẫn viên có bắt buộc không?",
        pronunciation_focus: [
          "tips untuk pemandu → tiền tip cho hướng dẫn viên; `tips` thường có -s.",
          "wajib → bắt buộc; mạnh hơn `harus` trong quy định.",
          "Câu lịch sự để hỏi văn hóa tip mà không làm khó người nghe.",
        ],
        pronunciation_focus_en: [
          "tips untuk pemandu → tip for the guide; `tips` is commonly used with final -s.",
          "wajib → mandatory; stronger than `harus` in rules.",
          "A polite way to ask about tipping culture without putting pressure on anyone.",
        ],
      },
      {
        en: "Tur hari ini selesai jam lima sore.",
        vi: "Tour hôm nay kết thúc lúc năm giờ chiều.",
        pronunciation_focus: [
          "tur hari ini → tour hôm nay; `tur` là cách viết Indonesia.",
          "selesai jam lima sore → kết thúc lúc năm giờ chiều.",
          "Lỗi người Việt: nói `di jam lima`. Với giờ kết thúc, nói `selesai jam lima`.",
        ],
        pronunciation_focus_en: [
          "tur hari ini → today's tour; `tur` is Indonesian spelling.",
          "selesai jam lima sore → finishes at five in the afternoon.",
          "VN-speaker trap: saying `di jam lima`. For finish time, say `selesai jam lima`.",
        ],
      },
      {
        en: "Kalau hujan, jadwal tur bisa berubah.",
        vi: "Nếu trời mưa, lịch tour có thể thay đổi.",
        pronunciation_focus: [
          "kalau hujan → nếu trời mưa; `kalau` = nếu.",
          "jadwal tur bisa berubah → lịch tour có thể thay đổi.",
          "berubah → thay đổi; gốc `ubah` + ber-.",
        ],
        pronunciation_focus_en: [
          "kalau hujan → if it rains; `kalau` = if.",
          "jadwal tur bisa berubah → the tour schedule may change.",
          "berubah → change; root `ubah` + ber-.",
        ],
      },
    ],
    cultural_notes_vi:
      "Tiền `tips` ở Indonesia không phải lúc nào cũng bắt buộc, nhưng nhiều du khách vẫn tip cho pemandu wisata nếu dịch vụ tốt. Với `oleh-oleh`, người Indonesia rất quen mua quà mang về cho gia đình, đồng nghiệp, hoặc hàng xóm. Ở bảo tàng, candi, pura, hoặc khu adat, quy định foto có thể khác nhau: hỏi `Boleh foto?` trước là cách an toàn.",
    cultural_notes_en:
      "`Tips` in Indonesia are not always mandatory, but many tourists tip a guide when the service is good. `Oleh-oleh` is culturally important: Indonesians often bring gifts home for family, coworkers, or neighbors. At museums, temples, sacred sites, or adat areas, photo rules vary; asking `Boleh foto?` first is the safe approach.",
    tip_advice_vi:
      "Mẹo cho người Việt: `boleh` hỏi quyền/được phép, còn `bisa` hỏi khả năng. Nói `Boleh foto?` khi hỏi có được chụp ảnh không. `Oleh-oleh` là từ rất Indonesia: quà mang về sau chuyến đi.",
    tip_advice_en:
      "Tip for Vietnamese speakers: `boleh` asks permission, while `bisa` asks ability/possibility. Say `Boleh foto?` when asking whether photos are allowed. `Oleh-oleh` is a very Indonesian word: gifts brought back from a trip.",
    vocabulary: [
      {
        cell_id: "2312b338-0371-4f96-9a57-f5c5be09877d",
        word: "boleh foto",
        en: "may take photos",
        vi: "được chụp ảnh",
        pos: "phrase",
        pronunciation_vi: "BO-leh FO-to",
        pronunciation_en: "BO-leh FO-to",
      },
      {
        cell_id: "7440100f-90fc-4f90-a26b-b1d3d920b0f4",
        word: "museum",
        en: "museum",
        vi: "bảo tàng",
        pos: "noun",
        pronunciation_vi: "mu-SE-um",
        pronunciation_en: "moo-SEH-um",
      },
      {
        cell_id: "569c4598-173f-423f-9137-b2c04a0a2eeb",
        word: "candi",
        en: "ancient temple",
        vi: "đền cổ",
        pos: "noun",
        pronunciation_vi: "CHAN-di",
        pronunciation_en: "CHAN-dee",
      },
      {
        cell_id: "6a442728-ab52-40ae-a3f0-5b4a7b921921",
        word: "oleh-oleh",
        en: "souvenir / gift brought home",
        vi: "quà lưu niệm / quà mang về",
        pos: "noun",
        pronunciation_vi: "O-leh O-leh",
        pronunciation_en: "OH-leh OH-leh",
      },
      {
        cell_id: "15b5f91e-9b5f-4ced-b619-f96a60133667",
        word: "harga wajar",
        en: "reasonable price",
        vi: "giá hợp lý",
        pos: "noun phrase",
        pronunciation_vi: "HAR-ga WA-jar",
        pronunciation_en: "HAR-ga WA-jar",
      },
      {
        cell_id: "6bd4d283-8428-4d5d-8fb7-20dbcc54a95e",
        word: "tips",
        en: "tip / gratuity",
        vi: "tiền tip",
        pos: "noun",
        pronunciation_vi: "tips",
        pronunciation_en: "tips",
      },
      {
        cell_id: "4211f899-2461-443c-9113-ef0ee554048b",
        word: "berubah",
        en: "to change",
        vi: "thay đổi",
        pos: "verb",
        pronunciation_vi: "ber-U-bah",
        pronunciation_en: "ber-OO-bah",
      },
    ],
    dialogue: [
      {
        cell_id: "4e275a04-a160-4e0c-9c87-5cdd64ade518",
        speaker: "Wisatawan",
        text: "Boleh foto di dalam museum ini?",
        vi: "Có được chụp ảnh bên trong bảo tàng này không?",
        en: "May we take photos inside this museum?",
      },
      {
        cell_id: "28cef8e0-f03a-462d-ad46-37c762e894c2",
        speaker: "Pemandu",
        text: "Boleh, tapi tanpa flash, ya.",
        vi: "Được, nhưng không dùng flash nhé.",
        en: "Yes, but without flash, please.",
      },
      {
        cell_id: "84e195fd-daec-4021-a784-18144f4c5768",
        speaker: "Wisatawan",
        text: "Di mana tempat beli oleh-oleh yang harganya wajar?",
        vi: "Chỗ mua quà lưu niệm có giá hợp lý ở đâu?",
        en: "Where can we buy souvenirs at a reasonable price?",
      },
      {
        cell_id: "f05784c6-22d4-4de0-8b64-068f9fa8085c",
        speaker: "Pemandu",
        text: "Nanti setelah candi, kita mampir ke toko lokal.",
        vi: "Lát nữa sau đền, chúng ta ghé cửa hàng địa phương.",
        en: "Later after the temple, we will stop by a local shop.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ trong tour còn thiếu:",
        instruction_en: "Fill in the missing tour word:",
        items: [
          {
            prompt: "Boleh ___ di dalam museum ini? (chụp ảnh)",
            answer: "foto",
            options: ["foto", "fokus", "forum"],
          },
          {
            prompt: "Di mana tempat beli ___? (quà mang về)",
            answer: "oleh-oleh",
            options: ["oleh-oleh", "orang-orang", "ombak-ombak"],
          },
          {
            prompt: "Kalau hujan, jadwal tur bisa ___. (thay đổi)",
            answer: "berubah",
            options: ["berubah", "berulang", "berangkat"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "candi", answer: "đền cổ" },
          { prompt: "harga wajar", answer: "giá hợp lý" },
          { prompt: "tips", answer: "tiền tip" },
          { prompt: "museum", answer: "bảo tàng" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Có được chụp ảnh bên trong bảo tàng này không?", answer: "Boleh foto di dalam museum ini?" },
          { prompt: "Tiền tip cho hướng dẫn viên có bắt buộc không?", answer: "Apakah tips untuk pemandu wajib?" },
          { prompt: "Tour hôm nay kết thúc lúc năm giờ chiều.", answer: "Tur hari ini selesai jam lima sore." },
        ],
      },
    ],
  },
];
