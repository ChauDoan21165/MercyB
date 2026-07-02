// Neighborhood Clean Water Indonesian (Vietnamese -> Indonesian study track).
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
  /** Vietnamese-facing pronunciation/grammar/culture notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

type IndonesianVocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type IndonesianDialogueLine = {
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

export const neighborhoodCleanWaterLessons: IndonesianLesson[] = [
  {
    id: "indonesian_neighborhood_clean_water",
    level: "B1",
    category: "community_life",
    title_vi: "Nuoc sach trong khu dan: PDAM, sumur va bao cao ve RT",
    title_en: "Clean water in the neighborhood: PDAM, wells, and reporting to RT",
    sentences: [
      {
        en: "Air di rumah kami mulai berbau aneh.",
        vi: "Nuoc o nha toi bat dau co mui la.",
        pronunciation_focus: [
          "`air` = nuoc; dung tu nay cho nuoc sinh hoat, khong phai khong khi.",
          "`mulai berbau aneh` = bat dau co mui la; `berbau` mo ta tinh trang co mui.",
          "Loi nguoi Viet: nham `air` voi khong khi. Trong tieng Indonesia, `air` la nuoc.",
        ],
        pronunciation_focus_en: [
          "`air` means water, not air/atmosphere.",
          "`mulai berbau aneh` means starting to smell strange; `berbau` describes having an odor.",
          "VN-speaker trap: confusing `air` with air/atmosphere. In Indonesian, `air` is water.",
        ],
      },
      {
        en: "Kami curiga sumurnya perlu diperiksa.",
        vi: "Chung toi nghi la cai gieng can duoc kiem tra.",
        pronunciation_focus: [
          "`curiga` = nghi ngo; dung khi chua chac nguyen nhan.",
          "`perlu diperiksa` = can duoc kiem tra; cau bi dong rat tu nhien trong thong bao.",
          "Loi nguoi Viet: noi `check` qua nhieu. Trong thong bao, `diperiksa` trang trong va ro hon.",
        ],
        pronunciation_focus_en: [
          "`curiga` means suspect or think something may be wrong.",
          "`perlu diperiksa` means needs to be checked; passive form is natural in notices.",
          "VN-speaker note: overusing `check` is common. In notices, `diperiksa` sounds more formal and clear.",
        ],
      },
      {
        en: "Apakah air PDAM di sini sedang mati?",
        vi: "Nuoc PDAM o day co dang bi cat khong?",
        pronunciation_focus: [
          "`PDAM` = cong ty cap nuoc cong; quen voi he thong nuoc o Indonesia.",
          "`sedang mati` = dang bi cat/khong chay; trong ngu canh dien nuoc, `mati` co nghia la tat.",
          "Loi nguoi Viet: dich `mati` theo nghia `chet`. Voi thiet bi va dich vu, `mati` = tat/khong hoat dong.",
        ],
        pronunciation_focus_en: [
          "`PDAM` is the public water utility company in Indonesia.",
          "`sedang mati` means currently off or not running; for utilities, `mati` means out of service.",
          "VN-speaker trap: reading `mati` as 'dead'. For devices and utilities, it means off/not working.",
        ],
      },
      {
        en: "Tetangga bilang bau ini mungkin dari saluran air.",
        vi: "Hang xom noi mui nay co the tu ong nuoc thoat ra.",
        pronunciation_focus: [
          "`tetangga` = hang xom; tu rat hay dung trong van de khu pho.",
          "`saluran air` = ong/kenh nuoc thoat; co the lien quan den day thoat o, sewer, hay thoat nuoc mua.",
          "Loi nguoi Viet: noi `air channel` nghe vay muon. Nho cum tu co dinh `saluran air`.",
        ],
        pronunciation_focus_en: [
          "`tetangga` means neighbor; very common in neighborhood matters.",
          "`saluran air` means water channel or drainage pipe; it can refer to drain/sewer/rainwater flow.",
          "VN-speaker trap: saying `air channel` from English. Memorize the fixed phrase `saluran air`.",
        ],
      },
      {
        en: "Saya ingin melaporkan kualitas air ke RT.",
        vi: "Toi muon bao cao chat luong nuoc voi RT.",
        pronunciation_focus: [
          "`melaporkan` = bao cao; dung cho van de can thong bao chinh thuc.",
          "`kualitas air` = chat luong nuoc; co the noi ve mau, mui, vi, hoac day can.",
          "`RT` = ban quan ly khu dan/to dan pho; o Indonesia day la cap lien he gan nhat.",
        ],
        pronunciation_focus_en: [
          "`melaporkan` means report; used for issues that need official notice.",
          "`kualitas air` means water quality; it can refer to color, smell, taste, or sediment.",
          "`RT` is the neighborhood neighborhood-head level; in Indonesia it is the closest local contact.",
        ],
      },
      {
        en: "Apakah ada gotong royong untuk membersihkan selokan?",
        vi: "Co buoi lam viec chung de lam sach cong ranh khong?",
        pronunciation_focus: [
          "`gotong royong` = lam viec chung / giup nhau trong cong dong.",
          "`membersihkan selokan` = lam sach cong ranh/kenh thoa nuoc; dong tu `membersihkan` rat quan trong.",
          "Loi nguoi Viet: dung `clean` hoac `bersih` nhu tinh tu. Khi noi hanh dong, can `membersihkan`.",
        ],
        pronunciation_focus_en: [
          "`gotong royong` means community mutual-help work.",
          "`membersihkan selokan` means clean the drain; the verb `membersihkan` is important here.",
          "VN-speaker note: using only the adjective `clean/bersih` is not enough. Use the action verb `membersihkan`.",
        ],
      },
      {
        en: "Kami memasang filter air di dapur.",
        vi: "Chung toi lap bo loc nuoc o bep.",
        pronunciation_focus: [
          "`memasang` = lap dat; dung cho thiet bi, may moc, hoac vat dung co dinh.",
          "`filter air` = bo loc nuoc; trong nha o va toilet, tu nay rat pho bien.",
          "Loi nguoi Viet: noi `saring air` theo kieu dong tu. Trong tieng Indonesia, `filter air` la cum tu tu nhien.",
        ],
        pronunciation_focus_en: [
          "`memasang` means install or mount something in place.",
          "`filter air` means water filter; common for home and bathroom use.",
          "VN-speaker trap: trying to translate `saring air` word by word. In Indonesian, `filter air` is the natural phrase.",
        ],
      },
      {
        en: "Kalau air keruh, sebaiknya jangan langsung diminum.",
        vi: "Neu nuoc bi duc, tot nhat khong nen uong ngay.",
        pronunciation_focus: [
          "`keruh` = duc; mo ta nuoc khong trong.",
          "`sebaiknya jangan` = tot nhat khong nen; day la cach khuyen nghi mem.",
          "Loi nguoi Viet: noi `jangan minum` qua truc tiep. `sebaiknya jangan` lich su hon khi can canh bao.",
        ],
        pronunciation_focus_en: [
          "`keruh` means cloudy or murky.",
          "`sebaiknya jangan` means it is best not to; a soft recommendation.",
          "VN-speaker note: blunt `jangan minum` can sound too direct. `sebaiknya jangan` is gentler for warnings.",
        ],
      },
      {
        en: "Petugas datang untuk memeriksa pompa dan pipa.",
        vi: "Nhan vien den de kiem tra bom va ong nuoc.",
        pronunciation_focus: [
          "`petugas` = nhan vien phu trach; dung trong cac dich vu cong dong.",
          "`memeriksa` = kiem tra; goc `periksa` rat dung de noi ve kiem tra ky thuat.",
          "`pipa` = ong dan nuoc; thuong dung cho he thong nuoc nha.",
        ],
        pronunciation_focus_en: [
          "`petugas` means the staff member in charge.",
          "`memeriksa` means to inspect/check; from the root `periksa`.",
          "`pipa` means pipe, often for home water systems.",
        ],
      },
      {
        en: "Saya harap air bersih bisa kembali lancar besok.",
        vi: "Toi hy vong nuoc sach se lai chay on dinh vao ngay mai.",
        pronunciation_focus: [
          "`air bersih` = nuoc sach; cap tu quan trong trong khu dan.",
          "`kembali lancar` = quay lai on dinh, chay tot; `lancar` khong chi dung cho giao thong.",
          "Loi nguoi Viet: dung `air bersih` va `lancar` nhu tu rieng. Cac cum nay thuong di cung nhau trong thong bao.",
        ],
        pronunciation_focus_en: [
          "`air bersih` means clean water, a key phrase in neighborhoods.",
          "`kembali lancar` means return to smooth/normal operation; `lancar` is not only for traffic.",
          "VN-speaker note: `air bersih` and `lancar` are often used together in notices.",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong khu dan o Indonesia, van de nuoc sach thuong duoc ban theo ngay: nuoc PDAM bi mat, sumur co mui,  ong nuoc thoat bi tac, hoac can gotong royong lam sach selokan. Cap lien he thuong la RT, RW, tetangga, hoac petugas PDAM. Neu nuoc co mui, mau la, hay bi keruh, nguoi dan thuong bao RT truoc, roi moi goi don vi lien quan. Cach noi lich su va cu the giup van de duoc xu ly nhanh hon.",
    cultural_notes_en:
      "In Indonesian neighborhoods, clean-water issues are often handled very practically: PDAM water outages, smelly wells, clogged drainage pipes, or community clean-up work for the drains. The first points of contact are usually the RT, RW, neighbors, or the PDAM staff. If the water smells, looks discolored, or is murky, residents usually report to the RT first and then contact the relevant service. Polite, specific reporting usually gets faster action.",
    tip_advice_vi:
      "Mau bao cao van de nuoc, hay dung khung: `Air ...`, `Bau ...`, `Sejak ...`, `Mohon diperiksa ...`, `Saya lapor ke RT`. Neu muon de nghi hanh dong chung, dung `gotong royong` va `membersihkan selokan`.",
    tip_advice_en:
      "To report a water issue, use this frame: `Air ...`, `Bau ...`, `Sejak ...`, `Mohon diperiksa ...`, `Saya lapor ke RT`. If you want to propose community action, use `gotong royong` and `membersihkan selokan`.",
    vocabulary: [
      {
        word: "air bersih",
        en: "clean water",
        vi: "nuoc sach",
        pos: "noun phrase",
        pronunciation_vi: "AIR ber-SIH",
        pronunciation_en: "air BEH-ris",
      },
      {
        word: "sumur",
        en: "well",
        vi: "gieng",
        pos: "noun",
        pronunciation_vi: "SU-mur",
        pronunciation_en: "SOO-moor",
      },
      {
        word: "PDAM",
        en: "public water utility",
        vi: "cong ty cap nuoc cong",
        pos: "noun",
        pronunciation_vi: "pe-de-a-em",
        pronunciation_en: "pee-dee-ay-em",
      },
      {
        word: "filter air",
        en: "water filter",
        vi: "bo loc nuoc",
        pos: "noun phrase",
        pronunciation_vi: "FIL-ter AIR",
        pronunciation_en: "FIL-ter air",
      },
      {
        word: "gotong royong",
        en: "community mutual-help work",
        vi: "lam viec chung giup do lan nhau",
        pos: "noun phrase",
        pronunciation_vi: "GO-tong ro-YONG",
        pronunciation_en: "GOH-tong roy-YONG",
      },
      {
        word: "kualitas air",
        en: "water quality",
        vi: "chat luong nuoc",
        pos: "noun phrase",
        pronunciation_vi: "ku-a-li-TAS AIR",
        pronunciation_en: "koo-ah-lee-TAS air",
      },
      {
        word: "keruh",
        en: "murky, cloudy",
        vi: "duc",
        pos: "adjective",
        pronunciation_vi: "KE-ruh",
        pronunciation_en: "KEH-rooh",
      },
      {
        word: "petugas",
        en: "staff member on duty",
        vi: "nhan vien phu trach",
        pos: "noun",
        pronunciation_vi: "pe-TU-gas",
        pronunciation_en: "peh-TOO-gas",
      },
    ],
    dialogue: [
      {
        speaker: "Warga",
        text: "Selamat pagi, Pak. Air di rumah kami berbau aneh sejak tadi malam.",
        vi: "Chao buoi sang, chu. Nuoc o nha chung toi co mui la tu toi qua.",
        en: "Good morning, sir. The water at our house has smelled strange since last night.",
      },
      {
        speaker: "RT",
        text: "Baik, saya catat. Apakah sumurnya juga perlu diperiksa?",
        vi: "Vang, toi da ghi lai. Cai gieng co can duoc kiem tra khong?",
        en: "Alright, I will note it down. Does the well also need to be checked?",
      },
      {
        speaker: "Warga",
        text: "Iya, Pak. Kami juga curiga ada masalah di saluran air.",
        vi: "Vang, chu. Chung toi cung nghi co van de o ong nuoc thoat.",
        en: "Yes, sir. We also suspect there is a problem in the drainage line.",
      },
      {
        speaker: "RT",
        text: "Nanti saya laporkan ke petugas PDAM dan ajak warga gotong royong.",
        vi: "Lat nua toi se bao cho nhan vien PDAM va moi nguoi lam viec chung.",
        en: "Later I will report it to the PDAM staff and invite residents to do a community cleanup.",
      },
      {
        speaker: "Warga",
        text: "Terima kasih, Pak. Semoga air bersih bisa kembali lancar besok.",
        vi: "Cam on chu. Hy vong nuoc sach se lai chay on dinh ngay mai.",
        en: "Thank you, sir. Hopefully clean water will be flowing normally again tomorrow.",
      },
    ],
    exercises: [
      {
        type: "translation_id",
        prompt_vi: "Dich sang tieng Indonesia: Nuoc o nha toi bat dau co mui la.",
        prompt_en: "Translate into Indonesian: The water at my house has started to smell strange.",
        answer: "Air di rumah saya mulai berbau aneh.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Dien tu dung: Kami ingin ___ kualitas air ke RT.",
        prompt_en: "Fill in the correct word: Kami ingin ___ kualitas air ke RT.",
        answer: "melaporkan",
        explanation_vi: "`melaporkan` = bao cao.",
        explanation_en: "`melaporkan` means to report.",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Cum nao tu nhien nhat de noi 'community mutual-help work'?",
        prompt_en: "Which phrase is most natural for 'community mutual-help work'?",
        choices: ["gotong royong", "kerja sendiri", "air bareng", "jalan cepat"],
        answer: "gotong royong",
      },
      {
        type: "short_answer",
        prompt_vi: "Viet mot cau lich su de bao RT ve nuoc PDAM bi cat.",
        prompt_en: "Write one polite sentence to report to the neighborhood head that the PDAM water is cut off.",
        sample_answer: "Saya ingin melaporkan bahwa air PDAM di sini sedang mati.",
      },
    ],
  },
];
