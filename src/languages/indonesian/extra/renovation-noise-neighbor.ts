// Renovation noise and neighbor discussion Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It mirrors sibling Indonesian `extra/*`
// files: target-language text is stored in `en`, Vietnamese glosses in `vi`,
// Vietnamese-facing L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.
//
// Register note: neighbor-renovation Indonesian should stay calm and specific:
// `renovasi tetangga`, `suara bor`, `jam kerja`, `izin RT`, `komplain sopan`,
// `debu`, `tukang`, and `kesepakatan`.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length and order. */
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
    id: "indonesian_renovation_noise_neighbor",
    level: "B1",
    category: "community",
    title_vi: "Hàng xóm sửa nhà: tiếng ồn, bụi và thỏa thuận",
    title_en: "Neighbor renovation noise, dust, and agreements",
    sentences: [
      {
        en: "Tetangga sebelah sedang renovasi rumah.",
        vi: "Hàng xóm bên cạnh đang sửa nhà.",
        pronunciation_focus: [
          "te-TANG-ga se-BE-lah se-DANG re-no-VA-si RU-mah - `tetangga sebelah` = hàng xóm sát bên; `renovasi rumah` = sửa/cải tạo nhà.",
          "Lỗi người Việt: dùng `repair rumah` hoặc `perbaiki rumah` cho mọi việc. Cải tạo/sửa lớn thường nói `renovasi rumah`.",
          "Luyện: `Tetangga sedang renovasi rumah.`",
        ],
        pronunciation_focus_en: [
          "te-TANG-ga seh-BEH-lah seh-DANG reh-no-VA-see ROO-mah - `tetangga sebelah` = next-door neighbor; `renovasi rumah` = home renovation.",
          "VN-speaker trap: using `repair rumah` or `perbaiki rumah` for everything. Bigger renovation work is `renovasi rumah`.",
          "Drill: `Tetangga sedang renovasi rumah.`",
        ],
      },
      {
        en: "Maaf, suara bornya sangat keras pagi ini.",
        vi: "Xin lỗi, tiếng khoan sáng nay rất lớn.",
        pronunciation_focus: [
          "ma-AF, SU-a-ra BOR-nya SA-ngat KE-ras PA-gi I-ni - `suara bor` = tiếng khoan; `keras` = to/lớn tiếng.",
          "Lỗi người Việt: nói thẳng `berisik!` dễ căng. Mở bằng `maaf` và nêu âm thanh cụ thể: `suara bor`.",
          "Luyện: `Suara bornya sangat keras.`",
        ],
        pronunciation_focus_en: [
          "ma-AF, SOO-a-ra BOR-nya SA-ngat KEH-ras PA-gee EE-nee - `suara bor` = drill noise; `keras` = loud.",
          "VN-speaker trap: blunt `berisik!` can escalate. Start with `maaf` and name the sound: `suara bor`.",
          "Drill: `Suara bornya sangat keras.`",
        ],
      },
      {
        en: "Boleh tahu jam kerja tukangnya sampai jam berapa?",
        vi: "Cho tôi hỏi giờ làm của thợ đến mấy giờ?",
        pronunciation_focus: [
          "BO-leh TA-hu jam KER-ja TU-kang-nya SAM-pai jam be-RA-pa - `jam kerja` = giờ làm; `tukang` = thợ.",
          "Lỗi người Việt: dùng `pekerja` được, nhưng trong sửa nhà hằng ngày người Indonesia hay nói `tukang`.",
          "Luyện: `Jam kerja tukang sampai jam berapa?`",
        ],
        pronunciation_focus_en: [
          "BO-leh TA-hoo jam KER-ja TOO-kang-nya SAM-pai jam beh-RA-pa - `jam kerja` = working hours; `tukang` = worker/tradesperson.",
          "VN-speaker note: `pekerja` works, but for home repairs Indonesians commonly say `tukang`.",
          "Drill: `Jam kerja tukang sampai jam berapa?`",
        ],
      },
      {
        en: "Apakah renovasi ini sudah ada izin RT?",
        vi: "Việc sửa nhà này đã có phép của RT chưa?",
        pronunciation_focus: [
          "a-PA-kah re-no-VA-si I-ni SU-dah A-da I-zin er-TE - `izin RT` = phép/thông báo từ tổ dân cư RT.",
          "Lỗi người Việt: đọc RT theo tiếng Anh. Tiếng Indonesia đọc `er-te`.",
          "Luyện: `Sudah ada izin RT?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah reh-no-VA-see EE-nee SOO-dah A-da EE-zin er-TEH - `izin RT` = RT neighborhood permission/notice.",
          "VN-speaker trap: spelling RT with English letter names. Indonesian says `er-te`.",
          "Drill: `Sudah ada izin RT?`",
        ],
      },
      {
        en: "Saya ingin komplain sopan, bukan mencari masalah.",
        vi: "Tôi muốn góp ý/than phiền lịch sự, không phải gây chuyện.",
        pronunciation_focus: [
          "SA-ya I-ngin kom-PLAIN SO-pan, BU-kan men-CA-ri ma-sa-LAH - `komplain sopan` = phàn nàn lịch sự; `bukan` = không phải.",
          "Lỗi người Việt: chỉ nói `saya komplain` nghe đối đầu. Thêm `sopan` và `bukan mencari masalah` để giảm căng.",
          "Luyện: `Saya ingin komplain sopan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin kom-PLAIN SO-pan, BOO-kan men-CHA-ree ma-sa-LAH - `komplain sopan` = polite complaint; `bukan` = not.",
          "VN-speaker trap: `saya komplain` alone can sound confrontational. Add `sopan` and `bukan mencari masalah` to soften it.",
          "Drill: `Saya ingin komplain sopan.`",
        ],
      },
      {
        en: "Debu dari renovasi masuk ke rumah saya.",
        vi: "Bụi từ việc sửa nhà bay vào nhà tôi.",
        pronunciation_focus: [
          "DE-bu DA-ri re-no-VA-si MA-suk ke RU-mah SA-ya - `debu` = bụi; `masuk ke rumah` = vào nhà.",
          "Lỗi người Việt: vị trí tĩnh dùng `di rumah`, nhưng chuyển động vào nhà dùng `ke rumah`.",
          "Luyện: `Debu masuk ke rumah saya.`",
        ],
        pronunciation_focus_en: [
          "DEH-boo DA-ree reh-no-VA-see MA-sook keh ROO-mah SA-ya - `debu` = dust; `masuk ke rumah` = enters the house.",
          "VN-speaker trap: static location uses `di rumah`, but motion into the house uses `ke rumah`.",
          "Drill: `Debu masuk ke rumah saya.`",
        ],
      },
      {
        en: "Bisa minta tukang menutup area kerja dengan plastik?",
        vi: "Có thể nhờ thợ che khu vực làm việc bằng nhựa/tấm nilon không?",
        pronunciation_focus: [
          "BI-sa MIN-ta TU-kang me-NU-tup A-re-a KER-ja de-NGAN PLAS-tik - `menutup area kerja` = che khu vực làm việc.",
          "Lỗi người Việt: dùng `tutup` trần trong câu lịch sự. Câu đầy đủ dùng `menutup`.",
          "Luyện: `Menutup area kerja dengan plastik.`",
        ],
        pronunciation_focus_en: [
          "BEE-sa MIN-ta TOO-kang meh-NOO-toop A-re-a KER-ja deh-NGAN PLAS-tik - `menutup area kerja` = cover the work area.",
          "VN-speaker trap: using bare `tutup` in a polite full sentence. Use `menutup`.",
          "Drill: `Menutup area kerja dengan plastik.`",
        ],
      },
      {
        en: "Tolong jangan mengebor terlalu pagi.",
        vi: "Vui lòng đừng khoan quá sớm.",
        pronunciation_focus: [
          "TO-long JA-ngan me-NGE-bor ter-LA-lu PA-gi - `mengebor` = khoan; `terlalu pagi` = quá sớm.",
          "Lỗi người Việt: dùng `tidak mengebor` cho mệnh lệnh cấm. Cấm/lời nhắc dùng `jangan mengebor`.",
          "Luyện: `Jangan mengebor terlalu pagi.`",
        ],
        pronunciation_focus_en: [
          "TO-long JA-ngan meh-NGEH-bor ter-LA-loo PA-gee - `mengebor` = drill; `terlalu pagi` = too early.",
          "VN-speaker trap: using `tidak mengebor` for a negative command. A prohibition/request uses `jangan mengebor`.",
          "Drill: `Jangan mengebor terlalu pagi.`",
        ],
      },
      {
        en: "Anak saya tidur siang, jadi suara bor sangat mengganggu.",
        vi: "Con tôi ngủ trưa, nên tiếng khoan rất gây phiền.",
        pronunciation_focus: [
          "A-nak SA-ya TI-dur SI-ang, JA-di SU-a-ra BOR SA-ngat meng-GANG-gu - `tidur siang` = ngủ trưa; `mengganggu` = làm phiền.",
          "Lỗi người Việt: nói `ganggu sekali` hơi cụt. Câu đầy đủ: `sangat mengganggu`.",
          "Luyện: `Suara bor sangat mengganggu.`",
        ],
        pronunciation_focus_en: [
          "A-nak SA-ya TEE-door SEE-ang, JA-dee SOO-a-ra BOR SA-ngat meng-GANG-goo - `tidur siang` = nap; `mengganggu` = disturbing.",
          "VN-speaker trap: `ganggu sekali` sounds clipped. Full phrasing: `sangat mengganggu`.",
          "Drill: `Suara bor sangat mengganggu.`",
        ],
      },
      {
        en: "Sebaiknya kita buat kesepakatan jam kerja.",
        vi: "Tốt nhất là chúng ta lập thỏa thuận về giờ làm.",
        pronunciation_focus: [
          "se-BAIK-nya KI-ta BU-at ke-se-PA-kat-an jam KER-ja - `kesepakatan` = thỏa thuận; `sebaiknya` = tốt nhất nên.",
          "Lỗi người Việt: bỏ `sebaiknya` làm câu nghe ra lệnh. `Sebaiknya` làm đề xuất mềm hơn.",
          "Luyện: `Buat kesepakatan jam kerja.`",
        ],
        pronunciation_focus_en: [
          "seh-BAIK-nya KEE-ta BOO-at keh-seh-PA-kat-an jam KER-ja - `kesepakatan` = agreement; `sebaiknya` = it would be best.",
          "VN-speaker trap: dropping `sebaiknya` can make it sound like an order. It softens the suggestion.",
          "Drill: `Buat kesepakatan jam kerja.`",
        ],
      },
      {
        en: "Kalau perlu, kita bisa bicara dengan Pak RT.",
        vi: "Nếu cần, chúng ta có thể nói chuyện với ông RT.",
        pronunciation_focus: [
          "KA-lau PER-lu, KI-ta BI-sa bi-CA-ra de-NGAN Pak er-TE - `kalau perlu` = nếu cần; `Pak RT` = trưởng/tổ dân cư.",
          "Lỗi người Việt: kéo RT vào quá sớm dễ căng. `Kalau perlu` làm câu trung lập hơn.",
          "Luyện: `Kalau perlu, bicara dengan Pak RT.`",
        ],
        pronunciation_focus_en: [
          "KA-lau PER-loo, KEE-ta BEE-sa bee-CHA-ra deh-NGAN Pak er-TEH - `kalau perlu` = if needed; `Pak RT` = neighborhood head.",
          "VN-speaker note: involving RT too early can escalate. `Kalau perlu` makes the line more neutral.",
          "Drill: `Kalau perlu, bicara dengan Pak RT.`",
        ],
      },
      {
        en: "Saya menghargai renovasinya, tapi mohon perhatikan tetangga.",
        vi: "Tôi tôn trọng việc sửa nhà, nhưng xin để ý đến hàng xóm.",
        pronunciation_focus: [
          "SA-ya meng-har-GAI re-no-VA-si-nya, TA-pi MO-hon per-HA-ti-kan te-TANG-ga - `menghargai` = tôn trọng; `perhatikan` = chú ý/để ý.",
          "Lỗi người Việt: nói `saya tidak suka` quá thẳng. Mẫu `saya menghargai..., tapi...` lịch sự hơn.",
          "Luyện: `Mohon perhatikan tetangga.`",
        ],
        pronunciation_focus_en: [
          "SA-ya meng-har-GAI reh-no-VA-see-nya, TA-pee MO-hon per-HA-tee-kan te-TANG-ga - `menghargai` = appreciate/respect; `perhatikan` = pay attention to.",
          "VN-speaker trap: `saya tidak suka` is very direct. The frame `saya menghargai..., tapi...` is more polite.",
          "Drill: `Mohon perhatikan tetangga.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, vấn đề tiếng ồn sửa nhà thường được xử lý bằng nói chuyện nhẹ nhàng trước, rồi mới nhờ RT/RW hoặc pengelola nếu cần. Cách nói tốt là cụ thể: giờ nào ồn, âm thanh gì, ảnh hưởng thế nào, và đề xuất kesepakatan jam kerja. Bài này dạy ngôn ngữ giao tiếp, không phải tư vấn pháp lý.",
    cultural_notes_en:
      "In Indonesia, renovation-noise issues are often handled by a calm conversation first, then involving RT/RW or building management if needed. Good phrasing is specific: what time it is noisy, what sound it is, how it affects you, and a proposed work-hour agreement. This lesson teaches communication language, not legal advice.",
    tip_advice_vi:
      "Mẹo cho người Việt: tránh mở đầu bằng `berisik!`. Dùng khung mềm: `Maaf...`, `Boleh tahu...?`, `Tolong jangan...`, `Sebaiknya kita...`, và `Kalau perlu...` để giữ quan hệ hàng xóm.",
    tip_advice_en:
      "Tip for Vietnamese speakers: avoid opening with `berisik!`. Use soft frames like `Maaf...`, `Boleh tahu...?`, `Tolong jangan...`, `Sebaiknya kita...`, and `Kalau perlu...` to preserve neighbor relations.",
    vocabulary: [
      {
        word: "renovasi tetangga",
        en: "neighbor renovation",
        vi: "việc sửa nhà của hàng xóm",
        pos: "noun phrase",
        pronunciation_vi: "re-no-VA-si te-TANG-ga",
        pronunciation_en: "reh-no-VA-see te-TANG-ga",
      },
      {
        word: "suara bor",
        en: "drill noise",
        vi: "tiếng khoan",
        pos: "noun phrase",
        pronunciation_vi: "SU-a-ra BOR",
        pronunciation_en: "SOO-a-ra BOR",
      },
      {
        word: "jam kerja",
        en: "working hours",
        vi: "giờ làm",
        pos: "noun phrase",
        pronunciation_vi: "jam KER-ja",
        pronunciation_en: "jam KER-ja",
      },
      {
        word: "izin RT",
        en: "RT permission or notice",
        vi: "phép/thông báo của RT",
        pos: "noun phrase",
        pronunciation_vi: "I-zin er-TE",
        pronunciation_en: "EE-zin er-TEH",
      },
      {
        word: "komplain sopan",
        en: "polite complaint",
        vi: "phàn nàn lịch sự",
        pos: "noun phrase",
        pronunciation_vi: "kom-PLAIN SO-pan",
        pronunciation_en: "kom-PLAIN SO-pan",
      },
      {
        word: "debu",
        en: "dust",
        vi: "bụi",
        pos: "noun",
        pronunciation_vi: "DE-bu",
        pronunciation_en: "DEH-boo",
      },
      {
        word: "tukang",
        en: "worker; tradesperson",
        vi: "thợ",
        pos: "noun",
        pronunciation_vi: "TU-kang",
        pronunciation_en: "TOO-kang",
      },
      {
        word: "kesepakatan",
        en: "agreement",
        vi: "thỏa thuận",
        pos: "noun",
        pronunciation_vi: "ke-se-PA-kat-an",
        pronunciation_en: "keh-seh-PA-kat-an",
      },
      {
        word: "mengebor",
        en: "to drill",
        vi: "khoan",
        pos: "verb",
        pronunciation_vi: "me-NGE-bor",
        pronunciation_en: "meh-NGEH-bor",
      },
      {
        word: "mengganggu",
        en: "to disturb",
        vi: "làm phiền",
        pos: "verb",
        pronunciation_vi: "meng-GANG-gu",
        pronunciation_en: "meng-GANG-goo",
      },
    ],
    dialogue: [
      {
        speaker: "Tetangga",
        text: "Maaf, suara bornya sangat keras pagi ini. Boleh tahu jam kerja tukangnya?",
        vi: "Xin lỗi, tiếng khoan sáng nay rất lớn. Cho tôi hỏi giờ làm của thợ được không?",
        en: "Sorry, the drill noise is very loud this morning. May I know the workers' hours?",
      },
      {
        speaker: "Pemilik Rumah",
        text: "Maaf, Pak. Tukang biasanya bekerja sampai jam lima sore.",
        vi: "Xin lỗi anh. Thợ thường làm đến năm giờ chiều.",
        en: "Sorry, sir. The workers usually work until five in the afternoon.",
      },
      {
        speaker: "Tetangga",
        text: "Anak saya tidur siang. Sebaiknya kita buat kesepakatan jam kerja.",
        vi: "Con tôi ngủ trưa. Tốt nhất là chúng ta thỏa thuận giờ làm.",
        en: "My child naps at noon. It would be best if we make an agreement about work hours.",
      },
      {
        speaker: "Pemilik Rumah",
        text: "Baik, nanti saya bicara dengan tukang supaya tidak mengebor terlalu pagi.",
        vi: "Được, lát nữa tôi sẽ nói với thợ để không khoan quá sớm.",
        en: "All right, I will speak with the workers so they do not drill too early.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: “Tiếng khoan rất lớn.”",
        prompt_en: "Translate into Indonesian: “The drill noise is very loud.”",
        answer: "Suara bornya sangat keras.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ còn thiếu: Apakah renovasi ini sudah ada izin ____?",
        prompt_en: "Fill in the blank: Apakah renovasi ini sudah ada izin ____?",
        answer: "RT",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Cụm nào nghĩa là “thỏa thuận giờ làm”?",
        prompt_en: "Which phrase means “work-hour agreement”?",
        choices: ["kesepakatan jam kerja", "suara bor", "debu renovasi"],
        answer: "kesepakatan jam kerja",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `tukang` = ?",
        prompt_en: "Match the meaning: `tukang` = ?",
        answer: "worker; tradesperson",
      },
    ],
  },
];

export default lessons;
