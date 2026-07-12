// Childcare & School Pickup Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson following the established Indonesian extra shape.
// Sentence `en` is TARGET-LANGUAGE Indonesian; `vi` is the Vietnamese gloss.
// Vietnamese L1 notes live in `pronunciation_focus`, with English companions in
// `pronunciation_focus_en` in the same order.

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
    id: "indonesian_childcare_school_pickup",
    level: "A2",
    category: "childcare_parenting",
    title_vi: "Đưa đón con: daycare, cô giáo và giờ về",
    title_en: "Childcare and school pickup: daycare, teachers and going home",
    sentences: [
      {
        en: "Saya mau antar anak saya ke daycare pagi ini.",
        vi: "Tôi muốn đưa con tôi đến daycare sáng nay.",
        pronunciation_focus: [
          "SA-ya mau AN-tar A-nak SA-ya ke DE-ker PA-gi I-ni - `antar` = đưa/chở đến; `daycare` = nhà trẻ tư.",
          "Lỗi người Việt: lẫn `antar` và `jemput`. `Antar` là đưa đi; `jemput` là đón về.",
          "Luyện: `Saya mau antar anak saya ke daycare.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau AN-tar A-nak SA-ya ke DAY-care PA-gi I-ni - `antar` = take/drop off; `daycare` = private childcare.",
          "VN-speaker trap: mixing `antar` and `jemput`. `Antar` is take there; `jemput` is pick up.",
          "Drill: `Saya mau antar anak saya ke daycare.`",
        ],
      },
      {
        en: "Jam berapa saya harus jemput anak?",
        vi: "Mấy giờ tôi phải đón con?",
        pronunciation_focus: [
          "jam be-RA-pa SA-ya HA-rus JEM-put A-nak - `jam berapa` = mấy giờ; `jemput anak` = đón con.",
          "Lỗi người Việt: nói `ambil anak` theo nghĩa lấy. Có thể hiểu, nhưng chuẩn trong đưa đón là `jemput anak`.",
          "Luyện: `Jam berapa saya harus jemput anak?`",
        ],
        pronunciation_focus_en: [
          "jam be-RA-pa SA-ya HA-rus JEM-poot A-nak - `jam berapa` = what time; `jemput anak` = pick up the child.",
          "VN-speaker trap: saying `ambil anak` as 'take child'. It may be understood, but pickup is `jemput anak`.",
          "Drill: `Jam berapa saya harus jemput anak?`",
        ],
      },
      {
        en: "Kalau saya terlambat, tolong hubungi saya.",
        vi: "Nếu tôi đến muộn, làm ơn liên hệ với tôi.",
        pronunciation_focus: [
          "KA-lau SA-ya ter-LAM-bat, TO-long hu-BUNG-i SA-ya - `terlambat` = trễ; `hubungi` = liên hệ.",
          "Lỗi người Việt: dùng `lambat` một mình cho người đến muộn. Tự nhiên hơn: `saya terlambat`.",
          "Luyện: `Tolong hubungi saya.`",
        ],
        pronunciation_focus_en: [
          "KA-lau SA-ya ter-LAM-bat, TO-long hoo-BOONG-i SA-ya - `terlambat` = late; `hubungi` = contact.",
          "VN-speaker trap: using bare `lambat` for arriving late. More natural: `saya terlambat`.",
          "Drill: `Tolong hubungi saya.`",
        ],
      },
      {
        en: "Pengasuhnya siapa hari ini?",
        vi: "Hôm nay người trông trẻ là ai?",
        pronunciation_focus: [
          "pe-NGA-suh-nya SI-a-pa HA-ri I-ni - `pengasuh` = người trông trẻ/người chăm sóc; `siapa` = ai.",
          "Lỗi người Việt: dịch `người giữ trẻ` thành `orang jaga anak`. Từ tự nhiên hơn là `pengasuh`.",
          "Luyện: `Pengasuhnya siapa?`",
        ],
        pronunciation_focus_en: [
          "pe-NGA-sooh-nya SI-a-pa HA-ri I-ni - `pengasuh` = caregiver/nanny; `siapa` = who.",
          "VN-speaker trap: translating 'child watcher' as `orang jaga anak`. More natural word: `pengasuh`.",
          "Drill: `Pengasuhnya siapa?`",
        ],
      },
      {
        en: "Anak saya bawa bekal nasi dan buah.",
        vi: "Con tôi mang cơm hộp gồm cơm và trái cây.",
        pronunciation_focus: [
          "A-nak SA-ya BA-wa BE-kal NA-si dan BU-ah - `bekal` = đồ ăn mang theo/cơm hộp; `bawa` = mang.",
          "Lỗi người Việt: nói `makan siang box`. Ở trường/daycare, đồ ăn mang theo gọi là `bekal`.",
          "Luyện: `Anak saya bawa bekal.`",
        ],
        pronunciation_focus_en: [
          "A-nak SA-ya BA-wa BE-kal NA-see dan BOO-ah - `bekal` = packed meal/lunchbox; `bawa` = bring.",
          "VN-speaker trap: saying `makan siang box`. Packed food for school/daycare is `bekal`.",
          "Drill: `Anak saya bawa bekal.`",
        ],
      },
      {
        en: "Tolong ingatkan dia minum air putih.",
        vi: "Làm ơn nhắc bé uống nước lọc.",
        pronunciation_focus: [
          "TO-long i-NGAT-kan DI-a MI-num A-ir PU-tih - `ingatkan` = nhắc; `air putih` = nước lọc.",
          "Lỗi người Việt: dịch nước lọc thành `air biasa` trong mọi ngữ cảnh. Cụm rất tự nhiên là `air putih`.",
          "Luyện: `Tolong ingatkan dia minum air putih.`",
        ],
        pronunciation_focus_en: [
          "TO-long i-NGAT-kan DEE-a MI-num AH-eer POO-tih - `ingatkan` = remind; `air putih` = plain water.",
          "VN-speaker trap: translating plain water as `air biasa` in every context. The natural phrase is `air putih`.",
          "Drill: `Tolong ingatkan dia minum air putih.`",
        ],
      },
      {
        en: "Dia biasanya tidur siang setelah makan.",
        vi: "Bé thường ngủ trưa sau khi ăn.",
        pronunciation_focus: [
          "DI-a bi-A-sa-nya TI-dur SI-ang se-TE-lah MA-kan - `tidur siang` = ngủ trưa; `setelah makan` = sau khi ăn.",
          "Lỗi người Việt: nói `tidur trưa` theo tiếng Việt. Tiếng Indonesia dùng `tidur siang`.",
          "Luyện: `Dia biasanya tidur siang.`",
        ],
        pronunciation_focus_en: [
          "DEE-a bi-A-sa-nya TI-door SI-ang se-TE-lah MA-kan - `tidur siang` = nap; `setelah makan` = after eating.",
          "VN-speaker trap: saying `tidur trưa` from Vietnamese. Indonesian uses `tidur siang`.",
          "Drill: `Dia biasanya tidur siang.`",
        ],
      },
      {
        en: "Hari ini anak saya izin pulang lebih awal.",
        vi: "Hôm nay con tôi xin phép về sớm.",
        pronunciation_focus: [
          "HA-ri I-ni A-nak SA-ya I-zin PU-lang le-BIH A-wal - `izin pulang` = xin phép về; `lebih awal` = sớm hơn.",
          "Lỗi người Việt: nói `izin balik` nghe thân mật/không chuẩn ở trường. Với trường, dùng `izin pulang`.",
          "Luyện: `Anak saya izin pulang lebih awal.`",
        ],
        pronunciation_focus_en: [
          "HA-ri I-ni A-nak SA-ya EE-zin POO-lang le-BIH A-wal - `izin pulang` = request permission to go home; `lebih awal` = earlier.",
          "VN-speaker trap: saying casual `izin balik`. In school settings, use `izin pulang`.",
          "Drill: `Anak saya izin pulang lebih awal.`",
        ],
      },
      {
        en: "Nanti yang jemput anak adalah neneknya.",
        vi: "Lát nữa người đón bé là bà của bé.",
        pronunciation_focus: [
          "NAN-ti yang JEM-put A-nak A-da-lah NE-nek-nya - `yang jemput` = người đón; `neneknya` = bà của bé.",
          "Lỗi người Việt: bỏ `yang`. Khi xác định 'người làm việc X', dùng `yang + động từ`: `yang jemput`.",
          "Luyện: `Yang jemput anak adalah neneknya.`",
        ],
        pronunciation_focus_en: [
          "NAN-ti yang JEM-poot A-nak A-da-lah NE-nek-nya - `yang jemput` = the one picking up; `neneknya` = his/her grandma.",
          "VN-speaker trap: dropping `yang`. To identify 'the person who does X', use `yang + verb`: `yang jemput`.",
          "Drill: `Yang jemput anak adalah neneknya.`",
        ],
      },
      {
        en: "Ini nomor kontak guru kelasnya.",
        vi: "Đây là số liên hệ của giáo viên lớp bé.",
        pronunciation_focus: [
          "I-ni NO-mor KON-tak GU-ru KE-las-nya - `nomor kontak` = số liên hệ; `guru kelas` = giáo viên lớp.",
          "Lỗi người Việt: hỏi `kontak guru apa?` khi cần số. Hỏi số dùng `berapa`: `nomor kontaknya berapa?`",
          "Luyện: `Ini nomor kontak guru.`",
        ],
        pronunciation_focus_en: [
          "I-ni NO-mor KON-tak GOO-roo KE-las-nya - `nomor kontak` = contact number; `guru kelas` = class teacher.",
          "VN-speaker trap: asking `kontak guru apa?` when you need the number. For numbers use `berapa`: `nomor kontaknya berapa?`",
          "Drill: `Ini nomor kontak guru.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, phụ huynh thường dùng `antar jemput` để nói việc đưa đón con đi học/daycare. Daycare tư có thể gọi là `daycare`, `tempat penitipan anak`, hoặc `TPA`. Khi người khác đón trẻ, phụ huynh nên báo trước tên người đón, quan hệ với trẻ, và số liên hệ. Với giáo viên hoặc pengasuh, cách nói lịch sự an toàn là `Bu/Pak, tolong...`, `Mohon kabari saya...`, và `Terima kasih, Bu/Pak`.",
    cultural_notes_en:
      "In Indonesia, parents commonly use `antar jemput` for school/daycare drop-off and pickup. Private childcare may be called `daycare`, `tempat penitipan anak`, or `TPA`. If someone else picks up the child, parents should tell the staff the person's name, relationship to the child, and contact number. With teachers or caregivers, safe polite frames are `Bu/Pak, tolong...`, `Mohon kabari saya...`, and `Terima kasih, Bu/Pak`.",
    tip_advice_vi:
      "Mẹo cho người Việt: nhớ cặp `antar` = đưa đi và `jemput` = đón về. `Bekal` là đồ ăn mang theo, không phải chỉ 'bữa trưa'. `Tidur siang` là ngủ trưa; `izin pulang` là xin phép về. Nếu cần báo người đón thay, dùng khung `Nanti yang jemput anak adalah...`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: memorize the pair `antar` = drop off/take there and `jemput` = pick up. `Bekal` is food brought from home, not only lunch. `Tidur siang` is nap; `izin pulang` is permission to go home. If someone else will pick up the child, use `Nanti yang jemput anak adalah...`.",
    vocabulary: [
      {
        cell_id: "32252c2a-c645-489d-a624-8426a6e3ac99",
        word: "antar jemput",
        en: "drop-off and pickup",
        vi: "đưa đón",
        pos: "noun/verb phrase",
        pronunciation_vi: "AN-tar JEM-put",
        pronunciation_en: "AN-tar JEM-poot",
      },
      {
        cell_id: "63546801-9679-4033-b7aa-976edf1a5522",
        word: "daycare",
        en: "daycare",
        vi: "nhà trẻ tư / daycare",
        pos: "noun",
        pronunciation_vi: "DE-ker",
        pronunciation_en: "DAY-care",
      },
      {
        cell_id: "f37d60f2-7519-4611-bfd7-17e699774370",
        word: "pengasuh",
        en: "caregiver / nanny",
        vi: "người trông trẻ",
        pos: "noun",
        pronunciation_vi: "pe-NGA-suh",
        pronunciation_en: "pe-NGA-sooh",
      },
      {
        cell_id: "71057c68-b277-4299-8deb-5f8084d1e072",
        word: "izin pulang",
        en: "permission to go home",
        vi: "xin phép về",
        pos: "verb phrase",
        pronunciation_vi: "I-zin PU-lang",
        pronunciation_en: "EE-zin POO-lang",
      },
      {
        cell_id: "6582e4f3-a97a-44d5-a1ea-802ad66e5163",
        word: "bekal",
        en: "packed food / lunchbox",
        vi: "đồ ăn mang theo / cơm hộp",
        pos: "noun",
        pronunciation_vi: "BE-kal",
        pronunciation_en: "BE-kal",
      },
      {
        cell_id: "f3a19905-d77f-4631-83d6-82767464a97f",
        word: "tidur siang",
        en: "nap",
        vi: "ngủ trưa",
        pos: "verb phrase",
        pronunciation_vi: "TI-dur SI-ang",
        pronunciation_en: "TEE-door SEE-ang",
      },
      {
        cell_id: "d67d84a8-519f-427a-9932-f05d94846ca2",
        word: "jemput anak",
        en: "pick up the child",
        vi: "đón con",
        pos: "verb phrase",
        pronunciation_vi: "JEM-put A-nak",
        pronunciation_en: "JEM-poot A-nak",
      },
      {
        cell_id: "78bd40be-123e-4d77-8dbd-8fdd06fb2af6",
        word: "kontak guru",
        en: "teacher contact",
        vi: "liên hệ giáo viên",
        pos: "noun phrase",
        pronunciation_vi: "KON-tak GU-ru",
        pronunciation_en: "KON-tak GOO-roo",
      },
      {
        cell_id: "371db4d5-be36-42a8-b69e-b1fffc712919",
        word: "air putih",
        en: "plain water",
        vi: "nước lọc",
        pos: "noun phrase",
        pronunciation_vi: "A-ir PU-tih",
        pronunciation_en: "AH-eer POO-tih",
      },
      {
        cell_id: "f539501b-6021-4d54-bd04-70568c1a8f61",
        word: "terlambat",
        en: "late",
        vi: "trễ / muộn",
        pos: "adjective",
        pronunciation_vi: "ter-LAM-bat",
        pronunciation_en: "ter-LAM-bat",
      },
    ],
    dialogue: [
      {
        cell_id: "e6cdec3f-b62f-480d-a494-d9d463208f40",
        speaker: "Orang tua",
        text: "Bu, saya antar anak saya sekarang. Bekalnya ada di tas.",
        vi: "Cô ơi, tôi đưa con tôi đến bây giờ. Đồ ăn mang theo ở trong cặp.",
        en: "Ma'am, I am dropping off my child now. The packed food is in the bag.",
      },
      {
        cell_id: "3428493a-1312-4abc-8da6-eb54ef05cbd4",
        speaker: "Guru",
        text: "Baik, Bu. Nanti anak dijemput jam berapa?",
        vi: "Vâng ạ. Lát nữa bé được đón lúc mấy giờ?",
        en: "Okay, ma'am. What time will the child be picked up later?",
      },
      {
        cell_id: "c3642eac-3c95-4d2f-8b3b-64ce26e5f007",
        speaker: "Orang tua",
        text: "Jam empat. Kalau saya terlambat, neneknya yang jemput.",
        vi: "Bốn giờ. Nếu tôi trễ, bà của bé sẽ đón.",
        en: "At four. If I am late, the grandmother will pick up.",
      },
      {
        cell_id: "9e84bdb8-3ce4-47c8-81ac-ddf6400acbc7",
        speaker: "Guru",
        text: "Baik. Tolong kirim nomor kontak neneknya juga.",
        vi: "Được ạ. Làm ơn gửi cả số liên hệ của bà bé.",
        en: "Okay. Please also send the grandmother's contact number.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về đưa đón và daycare:",
        instruction_en: "Fill in the childcare pickup word:",
        items: [
          {
            prompt: "Saya mau ___ anak saya ke daycare. (đưa đi)",
            answer: "antar",
            options: ["antar", "ambil", "atur"],
          },
          {
            prompt: "Jam berapa saya harus ___ anak? (đón)",
            answer: "jemput",
            options: ["jemput", "jumpa", "jemur"],
          },
          {
            prompt: "Anak saya bawa ___ nasi dan buah. (đồ ăn mang theo)",
            answer: "bekal",
            options: ["bekal", "bekas", "besar"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "antar jemput", answer: "đưa đón" },
          { prompt: "pengasuh", answer: "người trông trẻ" },
          { prompt: "tidur siang", answer: "ngủ trưa" },
          { prompt: "izin pulang", answer: "xin phép về" },
          { prompt: "kontak guru", answer: "liên hệ giáo viên" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          {
            prompt: "Mấy giờ tôi phải đón con?",
            answer: "Jam berapa saya harus jemput anak?",
          },
          {
            prompt: "Nếu tôi đến muộn, làm ơn liên hệ với tôi.",
            answer: "Kalau saya terlambat, tolong hubungi saya.",
          },
          {
            prompt: "Lát nữa người đón bé là bà của bé.",
            answer: "Nanti yang jemput anak adalah neneknya.",
          },
        ],
      },
    ],
  },
];
