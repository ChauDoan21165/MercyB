// Restaurant reservation for a group Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson. It follows the established Indonesian extra
// lesson format: Indonesian target text in `en`, Vietnamese glosses in `vi`,
// Vietnamese L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.

export type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
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
    id: "indonesian_restaurant_reservation_group",
    level: "B1",
    category: "food_and_service",
    title_vi: "Đặt bàn nhà hàng cho nhóm",
    title_en: "Restaurant reservation for a group",
    sentences: [
      {
        en: "Kami mau reservasi restoran untuk rombongan delapan orang.",
        vi: "Chúng tôi muốn đặt bàn nhà hàng cho nhóm tám người.",
        pronunciation_focus: [
          "KA-mi mau re-ser-VA-si res-to-RAN un-TUK rom-BONG-an de-la-pan O-rang - `reservasi` = đặt chỗ; `rombongan` = nhóm/đoàn đi cùng.",
          "Lỗi người Việt: nói `booking meja` trong mọi ngữ cảnh. `Reservasi` là từ tự nhiên hơn di layanan restoran.",
          "Luyện: `Kami mau reservasi.`",
        ],
        pronunciation_focus_en: [
          "KAH-mee mow reh-ser-VAH-see res-toh-RAHN oon-TOOK rom-BONG-an deh-lah-pahn OH-rahn - `reservasi` = reservation; `rombongan` = group.",
          "VN-speaker trap: saying `booking meja` in every situation. `Reservasi` is more natural in restaurant service.",
          "Drill: `Kami mau reservasi.`",
        ],
      },
      {
        en: "Apakah ada meja besar yang bisa dipakai untuk grup kami?",
        vi: "Có bàn lớn nào có thể dùng cho nhóm chúng tôi không?",
        pronunciation_focus: [
          "a-pa-KAH A-da ME-ja be-SAR yang BI-sa di-PA-kai un-TUK grup KA-mi - `meja besar` = bàn lớn; `dipakai` = được dùng.",
          "Lỗi người Việt: nói `meja gede` vẫn hiểu trong nói thân mật, nhưng `meja besar` rapi và trung tính hơn.",
          "Luyện: `Ada meja besar?`",
        ],
        pronunciation_focus_en: [
          "ah-pah-KAH AH-dah MEH-jah beh-SAR yahng BEE-sah dee-PAH-kai oon-TOOK groop KAH-mee - `meja besar` = big table; `dipakai` = used.",
          "VN-speaker trap: `meja gede` may work casually, but `meja besar` is cleaner and more neutral.",
          "Drill: `Ada meja besar?`",
        ],
      },
      {
        en: "Kami ingin duduk dekat satu sama lain.",
        vi: "Chúng tôi muốn ngồi gần nhau.",
        pronunciation_focus: [
          "KA-mi I-ngin DU-duk de-KAT sa-tu sa-MA la-in - `dekat satu sama lain` = gần nhau.",
          "Lỗi người Việt: dùng `berdekatan` tapi lupa konteks posisi duduk. `Duduk dekat` lebih langsung untuk reservasi.",
          "Luyện: `Kami ingin duduk dekat.`",
        ],
        pronunciation_focus_en: [
          "KAH-mee EEN-geen DOO-dook deh-KAT sah-too sah-MAH lah-een - `dekat satu sama lain` = close to each other.",
          "VN-speaker trap: using `berdekatan` but forgetting the seating context. `Duduk dekat` is more direct for reservations.",
          "Drill: `Kami ingin duduk dekat.`",
        ],
      },
      {
        en: "Apakah perlu DP untuk reservasi ini?",
        vi: "Có cần tiền cọc cho đặt bàn này không?",
        pronunciation_focus: [
          "a-pa-KAH per-LU DE-pe un-TUK re-ser-VA-si I-ni - `DP` dibaca `de-pe`; `perlu` = cần.",
          "Lỗi người Việt: dùng `deposit` panjang trong chat layanan. Di Indonesia, `DP` rất umum và ngắn gọn.",
          "Luyện: `Perlu DP?`",
        ],
        pronunciation_focus_en: [
          "ah-pah-KAH pehr-LOO DEH-peh oon-TOOK reh-ser-VAH-see EE-nee - `DP` is read `de-pe`; `perlu` = need.",
          "VN-speaker trap: using the longer `deposit` in service chat. In Indonesia, `DP` is very common and concise.",
          "Drill: `Perlu DP?`",
        ],
      },
      {
        en: "Apakah ada menu paket untuk delapan orang?",
        vi: "Có thực đơn combo cho tám người không?",
        pronunciation_focus: [
          "a-pa-KAH A-da me-NYU pa-KET un-TUK de-la-pan O-rang - `menu paket` = thực đơn combo/gói.",
          "Lỗi người Việt: dịch `set menu` thành tiếng Inggris trực tiếp. `Menu paket` lebih natural di restoran Indonesia.",
          "Luyện: `Ada menu paket?`",
        ],
        pronunciation_focus_en: [
          "ah-pah-KAH AH-dah meh-NYOO pah-KET oon-TOOK deh-lah-pahn OH-rahn - `menu paket` = set menu/package menu.",
          "VN-speaker trap: translating `set menu` directly into English. `Menu paket` is more natural in Indonesian restaurants.",
          "Drill: `Ada menu paket?`",
        ],
      },
      {
        en: "Jam berapa waktu kedatangan yang paling pas?",
        vi: "Mấy giờ là thời gian đến phù hợp nhất?",
        pronunciation_focus: [
          "jam be-RA-pa wak-tu ke-da-TANG-an yang pa-ling PAS - `waktu kedatangan` = thời gian đến; `paling pas` = phù hợp nhất.",
          "Lỗi người Việt: hỏi `jam berapa datang` nghe thiếu tự nhiên. `Waktu kedatangan` rapi hơn di konteks reservasi.",
          "Luyện: `Waktu kedatangan jam berapa?`",
        ],
        pronunciation_focus_en: [
          "jahm beh-RAH-pah WAK-too keh-dah-TAHNG-an yahng PAH-leeng PAHS - `waktu kedatangan` = arrival time; `paling pas` = most suitable.",
          "VN-speaker trap: asking `jam berapa datang` sounds a bit unnatural. `Waktu kedatangan` is tidier in reservation contexts.",
          "Drill: `Waktu kedatangan jam berapa?`",
        ],
      },
      {
        en: "Kami juga butuh kursi anak kalau ada yang bawa bayi.",
        vi: "Chúng tôi cũng cần ghế cho trẻ em nếu có ai mang theo em bé.",
        pronunciation_focus: [
          "KA-mi JU-ga BU-tuh KUR-si A-nak KA-lau A-da yang BA-wa BA-yi - `kursi anak` = ghế trẻ em.",
          "Lỗi người Việt: nói `baby chair` chèn tiếng Anh. `Kursi anak` atau `high chair` bisa dipakai, nhưng `kursi anak` là lebih netral.",
          "Luyện: `Butuh kursi anak.`",
        ],
        pronunciation_focus_en: [
          "KAH-mee JOO-gah BOO-toh KOOR-see AH-nak KAH-low AH-dah yahng BAH-wah BAH-yee - `kursi anak` = child's/high chair.",
          "VN-speaker trap: inserting English `baby chair`. `Kursi anak` or `high chair` may work, but `kursi anak` is more neutral.",
          "Drill: `Butuh kursi anak.`",
        ],
      },
      {
        en: "Kalau ada perubahan, mohon kabari kami sesegera mungkin.",
        vi: "Nếu có thay đổi, vui lòng báo chúng tôi càng sớm càng tốt.",
        pronunciation_focus: [
          "KA-lau A-da per-u-BA-han, MO-hon ka-BA-ri KA-mi se-se-ge-RA MUNG-kin - `sesegera mungkin` = càng sớm càng tốt.",
          "Lỗi người Việt: dùng `secepat mungkin` được hiểu, tetapi `sesegera mungkin` sering terdengar lebih formal dan sopan.",
          "Luyện: `Mohon kabari kami.`",
        ],
        pronunciation_focus_en: [
          "KAH-low AH-dah peh-roo-BAH-han, MOH-hon kah-BAH-ree KAH-mee seh-seh-geh-RAH MOONG-keen - `sesegera mungkin` = as soon as possible.",
          "VN-speaker trap: `secepat mungkin` is understood, but `sesegera mungkin` often sounds more formal and polite.",
          "Drill: `Mohon kabari kami.`",
        ],
      },
      {
        en: "Kami mungkin perlu membatalkan reservasi kalau ada yang batal ikut.",
        vi: "Chúng tôi có thể cần hủy đặt bàn nếu có ai không đi nữa.",
        pronunciation_focus: [
          "KA-mi MUNG-kin per-LU mem-ba-TAL-kan re-ser-VA-si KA-lau A-da yang BA-tal I-kut - `membatalkan reservasi` = hủy đặt chỗ.",
          "Lỗi người Việt: nói `cancel reservasi` karena campur bahasa. `Membatalkan reservasi` lebih natural.",
          "Luyện: `Membatalkan reservasi.`",
        ],
        pronunciation_focus_en: [
          "KAH-mee MOONG-kin pehr-LOO mehm-bah-TAL-kan reh-ser-VAH-see KAH-low AH-dah yahng BAH-tahl EE-koot - `membatalkan reservasi` = cancel a reservation.",
          "VN-speaker trap: saying `cancel reservasi` by mixing languages. `Membatalkan reservasi` is more natural.",
          "Drill: `Membatalkan reservasi.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, reservasi restoran cho rombongan thường cần konfirmasi jumlah orang, waktu kedatangan, dan apakah perlu meja besar hoặc kursi anak. Banyak tempat minta DP, terutama saat akhir pekan, acara keluarga, hoặc grup besar. Jika jadwal berubah, restoran biasanya lebih mudah membantu kalau diinformasikan lebih awal. Untuk komunikasi sopan, gunakan `kami`, `mohon`, `apakah`, dan sebut kebutuhan spesifik secara singkat.",
    cultural_notes_en:
      "In Indonesia, restaurant reservations for groups often require confirmation of the number of people, arrival time, and whether a large table or children's chair is needed. Many places ask for a deposit, especially on weekends, for family events, or for large groups. If the schedule changes, the restaurant is usually more willing to help if informed early. For polite communication, use `kami`, `mohon`, `apakah`, and state specific needs briefly.",
    tip_advice_vi:
      "Khung an toàn: `Kami mau reservasi restoran untuk rombongan...`, `Apakah ada meja besar?`, `Apakah perlu DP?`, `Jam berapa waktu kedatangan yang paling pas?`. Kalau ada kursi anak atau menu paket, sebut sejak awal supaya tidak bolak-balik chat.",
    tip_advice_en:
      "Safe frames: `Kami mau reservasi restoran untuk rombongan...`, `Apakah ada meja besar?`, `Apakah perlu DP?`, `Jam berapa waktu kedatangan yang paling pas?`. If you need a children's chair or a set menu, mention it early so you do not need extra back-and-forth messages.",
    vocabulary: [
      {
        cell_id: "5dc3fca3-ba67-46f2-af36-e33444e1501d",
        word: "reservasi",
        en: "reservation",
        vi: "đặt chỗ",
        pos: "noun",
        pronunciation_vi: "re-ser-VA-si",
        pronunciation_en: "reh-ser-VAH-see",
      },
      {
        cell_id: "9a97f553-a3b8-4df2-b856-e104c451becd",
        word: "rombongan",
        en: "group / party",
        vi: "nhóm / đoàn",
        pos: "noun",
        pronunciation_vi: "rom-BONG-an",
        pronunciation_en: "rom-BONG-an",
      },
      {
        cell_id: "863154c6-3d4c-4e95-b8c9-2e3bd6b5672c",
        word: "meja besar",
        en: "large table",
        vi: "bàn lớn",
        pos: "noun phrase",
        pronunciation_vi: "ME-ja be-SAR",
        pronunciation_en: "MEH-jah beh-SAR",
      },
      {
        cell_id: "851aaf76-c46c-4633-b131-c6aae661bbd6",
        word: "DP",
        en: "deposit / down payment",
        vi: "tiền cọc / tiền đặt trước",
        pos: "noun",
        pronunciation_vi: "DE-pe",
        pronunciation_en: "DEH-peh",
      },
      {
        cell_id: "901050bd-5326-4d3c-95a9-3aa211497ad3",
        word: "menu paket",
        en: "set menu / package menu",
        vi: "thực đơn combo",
        pos: "noun phrase",
        pronunciation_vi: "me-NYU pa-KET",
        pronunciation_en: "meh-NYOO pah-KET",
      },
      {
        cell_id: "5c669644-c047-4c30-8cec-9e927f7fac15",
        word: "waktu kedatangan",
        en: "arrival time",
        vi: "thời gian đến",
        pos: "noun phrase",
        pronunciation_vi: "WAK-tu ke-da-TANG-an",
        pronunciation_en: "WAK-too keh-dah-TAHNG-an",
      },
      {
        cell_id: "ff60c213-d0c9-4286-8afd-2665e507567b",
        word: "kursi anak",
        en: "children's chair / high chair",
        vi: "ghế trẻ em",
        pos: "noun phrase",
        pronunciation_vi: "KUR-si A-nak",
        pronunciation_en: "KOOR-see AH-nak",
      },
      {
        cell_id: "75045a08-4e42-4185-b27d-b68ca4881d77",
        word: "membatalkan reservasi",
        en: "cancel a reservation",
        vi: "hủy đặt bàn",
        pos: "verb phrase",
        pronunciation_vi: "mem-ba-TAL-kan re-ser-VA-si",
        pronunciation_en: "mehm-bah-TAL-kan reh-ser-VAH-see",
      },
    ],
    dialogue: [
      {
        cell_id: "c48a085b-1af6-4cac-8970-39aa039124ed",
        speaker: "Pelanggan",
        text: "Selamat malam. Kami mau reservasi restoran untuk rombongan delapan orang.",
        vi: "Chào buổi tối. Chúng tôi muốn đặt bàn nhà hàng cho nhóm tám người.",
        en: "Good evening. We would like to reserve a restaurant for a group of eight people.",
      },
      {
        cell_id: "15ebaa2f-f542-486c-b770-0273d8483ae3",
        speaker: "Staf Restoran",
        text: "Baik. Apakah Anda perlu meja besar dan kursi anak?",
        vi: "Được. Quý khách có cần bàn lớn và ghế trẻ em không?",
        en: "All right. Do you need a large table and a children's chair?",
      },
      {
        cell_id: "199310c7-72b8-4180-9f18-9a84703baae6",
        speaker: "Pelanggan",
        text: "Iya, dan kami ingin tahu apakah perlu DP.",
        vi: "Vâng, và chúng tôi muốn biết có cần tiền cọc không.",
        en: "Yes, and we would like to know whether a deposit is needed.",
      },
      {
        cell_id: "4f79bda4-0de1-4b43-a9a8-d9d57fd2c600",
        speaker: "Staf Restoran",
        text: "Untuk hari Sabtu, reservasi perlu DP. Menu paket juga tersedia.",
        vi: "Vào thứ Bảy, đặt bàn cần tiền cọc. Cũng có menu combo.",
        en: "For Saturday, reservations require a deposit. A set menu is also available.",
      },
      {
        cell_id: "de81d2a9-32e8-441b-8165-2b063390a56b",
        speaker: "Pelanggan",
        text: "Baik, kami akan konfirmasi lagi kalau jam kedatangan berubah.",
        vi: "Được, chúng tôi sẽ xác nhận lại nếu giờ đến thay đổi.",
        en: "Okay, we will confirm again if the arrival time changes.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Chúng tôi muốn đặt bàn cho nhóm tám người.",
        prompt_en: "Translate into Indonesian: We want to make a reservation for a group of eight people.",
        answer: "Kami mau reservasi restoran untuk rombongan delapan orang.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ còn thiếu: Apakah perlu ____ untuk reservasi ini?",
        prompt_en: "Fill in the blank: Apakah perlu ____ untuk reservasi ini?",
        answer: "DP",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Cụm nào nghĩa là “hủy đặt bàn”?",
        prompt_en: "Which phrase means “cancel a reservation”?",
        choices: ["membatalkan reservasi", "menu paket", "waktu kedatangan"],
        answer: "membatalkan reservasi",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `kursi anak` = ?",
        prompt_en: "Match the meaning: `kursi anak` = ?",
        answer: "children's chair / high chair",
      },
    ],
  },
];

export default lessons;
