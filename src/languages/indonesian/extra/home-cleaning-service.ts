// Home cleaning service Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson for booking and discussing home cleaning:
// scheduling, hourly rates, cleaning tools, bathroom/kitchen focus, and
// polite complaints about the result. Indonesian target text lives in `en`,
// Vietnamese glosses in `vi`, Vietnamese L1 notes in `pronunciation_focus`, and
// English companions in `pronunciation_focus_en`.

export type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

export type IndonesianExercise = Record<string, any>;

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

export const homeCleaningServiceLessons: IndonesianLesson[] = [
  {
    id: "indonesian_home_cleaning_service_booking",
    level: "A2",
    category: "home_services",
    title_vi: "Đặt dịch vụ dọn nhà và nói rõ yêu cầu",
    title_en: "Booking a home cleaning service and stating your needs",
    sentences: [
      {
        en: "Saya mau pesan jasa bersih rumah untuk sore ini.",
        vi: "Tôi muốn đặt dịch vụ dọn nhà cho chiều nay.",
        pronunciation_focus: [
          "SA-ya mau PE-san JA-sa ber-SIH RU-mah - `jasa bersih rumah` = dịch vụ dọn nhà.",
          "Lỗi người Việt: nói `service bersih` hoặc `cleaning rumah` lẫn tiếng Anh. Cụm tự nhiên là `jasa bersih rumah`.",
          "Luyện: `Saya mau pesan jasa bersih rumah.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau PE-san JA-sa ber-SEEH ROO-mah - `jasa bersih rumah` = home cleaning service.",
          "VN-speaker trap: mixing in `service bersih` or `cleaning rumah`. Natural Indonesian is `jasa bersih rumah`.",
          "Drill: `Saya mau pesan jasa bersih rumah.`",
        ],
      },
      {
        en: "Berapa biaya per jam untuk cleaning service?",
        vi: "Dịch vụ dọn nhà tính bao nhiêu tiền mỗi giờ?",
        pronunciation_focus: [
          "be-RA-pa BI-a-ya per JAM - `biaya per jam` = chi phí mỗi giờ.",
          "Lỗi người Việt: hỏi `harga per hour` hoặc `berapa satu jam`. Dùng `per jam` là chuẩn.",
          "Luyện: `Berapa biaya per jam?`",
        ],
        pronunciation_focus_en: [
          "beh-RA-pa BEE-a-ya per JAHM - `biaya per jam` = hourly rate.",
          "VN-speaker trap: saying `harga per hour` or `berapa satu jam`. Use `per jam`.",
          "Drill: `Berapa biaya per jam?`",
        ],
      },
      {
        en: "Apakah alat kebersihan dibawa sendiri atau disediakan?",
        vi: "Dụng cụ vệ sinh tự mang theo hay được chuẩn bị sẵn?",
        pronunciation_focus: [
          "A-pa-kah a-LAT ke-BER-si-han di-BA-wa sen-DI-ri - `alat kebersihan` = dụng cụ vệ sinh.",
          "`dibawa sendiri` = tự mang theo; `disediakan` = được cung cấp sẵn.",
          "Lỗi người Việt: hỏi `alat apa bawa?` quá rời. Câu đầy đủ nghe tự nhiên hơn.",
          "Luyện: `Alat kebersihan disediakan?`",
        ],
        pronunciation_focus_en: [
          "A-pa-kah a-LAHT keh-BER-see-han dee-BA-wa sen-DEE-ree - `alat kebersihan` = cleaning tools.",
          "`dibawa sendiri` = brought by ourselves; `disediakan` = provided.",
          "VN-speaker trap: asking `alat apa bawa?` sounds choppy. The full question sounds natural.",
          "Drill: `Alat kebersihan disediakan?`",
        ],
      },
      {
        en: "Tolong fokus ke kamar mandi dan dapur.",
        vi: "Làm ơn tập trung vào phòng tắm và nhà bếp.",
        pronunciation_focus: [
          "FO-kus ke ka-MAR MAN-di dan DA-pur - `fokus ke...` = tập trung vào...",
          "Lỗi người Việt: nói `fokus pada` cũng đúng, nhưng trong yêu cầu dịch vụ `fokus ke` rất ngắn gọn.",
          "Luyện: `Fokus ke kamar mandi.`",
        ],
        pronunciation_focus_en: [
          "FO-kus ke ka-MAR MAHN-dee dan DA-poor - `fokus ke...` = focus on...",
          "VN-speaker trap: `fokus pada` is also correct, but `fokus ke` is shorter and very common in service requests.",
          "Drill: `Fokus ke kamar mandi.`",
        ],
      },
      {
        en: "Saya perlu jadwal cleaning hari Sabtu pagi.",
        vi: "Tôi cần lịch dọn dẹp vào sáng thứ Bảy.",
        pronunciation_focus: [
          "JAD-wal CLEA-ning - `jadwal` = lịch; `hari Sabtu pagi` = sáng thứ Bảy.",
          "Lỗi người Việt: nói `schedule cleaning` lẫn tiếng Anh. Nếu muốn gọn, dùng `jadwal cleaning`, nhưng `jadwal bersih-bersih` cũng tự nhiên.",
          "Luyện: `Saya perlu jadwal hari Sabtu pagi.`",
        ],
        pronunciation_focus_en: [
          "JAD-wahl KLEE-ning - `jadwal` = schedule; `hari Sabtu pagi` = Saturday morning.",
          "VN-speaker trap: mixing in `schedule cleaning`. If you want a natural local phrase, `jadwal bersih-bersih` also works.",
          "Drill: `Saya perlu jadwal hari Sabtu pagi.`",
        ],
      },
      {
        en: "Bisa datang lebih awal setengah jam?",
        vi: "Có thể đến sớm hơn nửa tiếng không?",
        pronunciation_focus: [
          "BI-sa DA-tang le-BIH A-wal - `lebih awal` = sớm hơn.",
          "`setengah jam` = nửa giờ; câu hỏi này rất tự nhiên khi hẹn dịch vụ.",
          "Lỗi người Việt: dùng `lebih cepat` vẫn hiểu, nhưng `lebih awal` đúng ngữ cảnh lịch hẹn hơn.",
          "Luyện: `Bisa datang setengah jam lebih awal?`",
        ],
        pronunciation_focus_en: [
          "BEE-sa DAH-tang leh-BEE A-wal - `lebih awal` = earlier.",
          "`setengah jam` = half an hour; this is a very natural scheduling question.",
          "VN-speaker trap: `lebih cepat` may be understood, but `lebih awal` fits appointments better.",
          "Drill: `Bisa datang setengah jam lebih awal?`",
        ],
      },
      {
        en: "Mohon sapu dan pel lantainya sampai bersih.",
        vi: "Làm ơn quét và lau sàn cho sạch.",
        pronunciation_focus: [
          "MO-hon SA-pu dan PEL lan-TAI-nya - `sapu` = quét; `pel` = lau sàn.",
          "`sampai bersih` = cho đến khi sạch; cách nói rất phổ biến trong yêu cầu dọn nhà.",
          "Lỗi người Việt: nói `wipe lantai` hoặc `mop the floor` lẫn tiếng Anh. Dùng `pel lantainya`.",
          "Luyện: `Tolong sapu dan pel.`",
        ],
        pronunciation_focus_en: [
          "MO-hon SA-poo dan PEL lan-TYEH-nya - `sapu` = sweep; `pel` = mop.",
          "`sampai bersih` = until it is clean; a very common phrase in cleaning requests.",
          "VN-speaker trap: mixing in `wipe lantai` or `mop the floor`. Use `pel lantainya`.",
          "Drill: `Tolong sapu dan pel.`",
        ],
      },
      {
        en: "Tolong bersihkan juga kamar mandi.",
        vi: "Làm ơn dọn cả phòng tắm nữa.",
        pronunciation_focus: [
          "ber-SIH-kan - `bersihkan` = làm sạch/dọn sạch.",
          "`juga` = cũng/cả; đặt ngay trước đối tượng là rất tự nhiên.",
          "Lỗi người Việt: quên `juga` khi muốn thêm hạng mục nữa.",
          "Luyện: `Tolong bersihkan kamar mandi juga.`",
        ],
        pronunciation_focus_en: [
          "ber-SEEH-kan - `bersihkan` = clean it.",
          "`juga` = also/as well; placing it near the noun sounds natural.",
          "VN-speaker trap: forgetting `juga` when adding one more task.",
          "Drill: `Tolong bersihkan kamar mandi juga.`",
        ],
      },
      {
        en: "Setelah selesai, tolong buang sampahnya juga.",
        vi: "Sau khi xong, làm ơn cũng đổ rác luôn.",
        pronunciation_focus: [
          "se-TE-lah se-LE-sai - `setelah selesai` = sau khi hoàn thành.",
          "`buang sampahnya` = vứt rác đi; `juga` nhấn mạnh việc làm thêm.",
          "Lỗi người Việt: nói `throw the garbage` trong câu Indonesia. Dùng `buang sampah`.",
          "Luyện: `Tolong buang sampahnya.`",
        ],
        pronunciation_focus_en: [
          "seh-TEH-lah seh-LEH-sai - `setelah selesai` = after finishing.",
          "`buang sampahnya` = throw out the trash; `juga` emphasizes an extra task.",
          "VN-speaker trap: translating with English `throw the garbage`. Use `buang sampah`.",
          "Drill: `Tolong buang sampahnya.`",
        ],
      },
      {
        en: "Hasilnya belum rapi, masih ada debu di meja.",
        vi: "Kết quả chưa gọn gàng, trên bàn vẫn còn bụi.",
        pronunciation_focus: [
          "ha-SIL-nya be-LUM RA-pi - `belum rapi` = chưa gọn/sạch sẽ như mong muốn.",
          "`masih ada debu` = vẫn còn bụi; rất hữu ích khi komplain hasil.",
          "Lỗi người Việt: nói `hasilnya kurang` quá chung chung. `Belum rapi` lebih spesifik.",
          "Luyện: `Masih ada debu di meja.`",
        ],
        pronunciation_focus_en: [
          "ha-SEEL-nya beh-lum RA-pee - `belum rapi` = not neat/clean yet.",
          "`masih ada debu` = there is still dust; very useful when complaining about results.",
          "VN-speaker trap: saying `hasilnya kurang` is too vague. `Belum rapi` is more specific.",
          "Drill: `Masih ada debu di meja.`",
        ],
      },
      {
        en: "Boleh saya minta diperbaiki lagi?",
        vi: "Tôi có thể nhờ sửa/dọn lại không?",
        pronunciation_focus: [
          "bo-LEH sa-YA MIN-ta di-per-BAI-ki la-GI - `diperbaiki lagi` = được sửa lại một lần nữa.",
          "Lỗi người Việt: nói `bisa revisi` lẫn tiếng Anh. Dalam komplain sopan, `diperbaiki lagi` lebih natural.",
          "Luyện: `Saya minta diperbaiki lagi.`",
        ],
        pronunciation_focus_en: [
          "bo-LEH sa-YA MIN-ta dee-per-BYE-kee la-GEE - `diperbaiki lagi` = fixed again / corrected.",
          "VN-speaker trap: mixing in `revisi`. In a polite complaint, `diperbaiki lagi` is more natural.",
          "Drill: `Saya minta diperbaiki lagi.`",
        ],
      },
      {
        en: "Saya ingin komplain hasil cleaning kemarin.",
        vi: "Tôi muốn phàn nàn về kết quả dọn dẹp hôm qua.",
        pronunciation_focus: [
          "ko-PLAIN ha-SIL CLEAN-ing ke-MA-rin - `komplain` = phàn nàn/khiếu nại.",
          "`kemarin` = hôm qua; rất thường dùng khi nói về dịch vụ vừa làm xong.",
          "Lỗi người Việt: dùng `complain` với phát âm tiếng Anh. Trong câu Indonesia, `komplain` là từ mượn đã Việt hóa.",
          "Luyện: `Saya ingin komplain.`",
        ],
        pronunciation_focus_en: [
          "koh-PLAIN ha-SEEL KLEE-ning keh-mah-REEN - `komplain` = complain/file a complaint.",
          "`kemarin` = yesterday; very common when referring to a recent service.",
          "VN-speaker trap: pronouncing English `complain`. In Indonesian, `komplain` is a borrowed local form.",
          "Drill: `Saya ingin komplain.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, dịch vụ dọn nhà thường tính theo jam, per kunjungan, atau paket bulanan. Khách nên nói rõ area yang perlu dibersihkan, misalnya kamar mandi, dapur, ruang tamu, dan apakah alat kebersihan sudah disiapkan. Khi komplain, cách nói sopan seperti `mohon dicek lagi` atau `bisa diperbaiki lagi?` akan dễ được hỗ trợ hơn.",
    cultural_notes_en:
      "In Indonesia, home cleaning services are often priced by the hour, per visit, or as a monthly package. Customers should clearly state the area to be cleaned, such as the bathroom, kitchen, and living room, and whether cleaning tools are provided. When complaining, polite phrasing such as `mohon dicek lagi` or `bisa diperbaiki lagi?` usually gets better support.",
    tip_advice_vi:
      "Khung nhớ nhanh: `biaya per jam`, `alat kebersihan`, `jadwal cleaning`, `fokus ke kamar mandi`, `sapu dan pel`, `komplain hasil`. Nếu hasilnya kurang bagus, trước hết nói phần cụ thể, rồi mới minta diperbaiki lagi.",
    tip_advice_en:
      "Quick frames to remember: `biaya per jam`, `alat kebersihan`, `jadwal cleaning`, `fokus ke kamar mandi`, `sapu dan pel`, `komplain hasil`. If the result is not good enough, name the specific problem first, then ask for `diperbaiki lagi`.",
    vocabulary: [
      {
        word: "jasa bersih rumah",
        en: "home cleaning service",
        vi: "dịch vụ dọn nhà",
        pos: "noun phrase",
        pronunciation_vi: "JA-sa ber-SIH RU-mah",
        pronunciation_en: "JA-sa ber-SEEH ROO-mah",
      },
      {
        word: "biaya per jam",
        en: "hourly rate",
        vi: "chi phí mỗi giờ",
        pos: "noun phrase",
        pronunciation_vi: "BI-a-ya per JAM",
        pronunciation_en: "BEE-a-ya per JAHM",
      },
      {
        word: "alat kebersihan",
        en: "cleaning tools",
        vi: "dụng cụ vệ sinh",
        pos: "noun phrase",
        pronunciation_vi: "a-LAT ke-BER-si-han",
        pronunciation_en: "a-LAHT keh-BER-see-han",
      },
      {
        word: "jadwal cleaning",
        en: "cleaning schedule",
        vi: "lịch dọn dẹp",
        pos: "noun phrase",
        pronunciation_vi: "JAD-wal CLEA-ning",
        pronunciation_en: "JAD-wahl KLEE-ning",
      },
      {
        word: "sapu",
        en: "sweep",
        vi: "quét",
        pos: "verb",
        pronunciation_vi: "SA-pu",
        pronunciation_en: "SAH-poo",
      },
      {
        word: "pel",
        en: "mop",
        vi: "lau sàn",
        pos: "verb",
        pronunciation_vi: "PEL",
        pronunciation_en: "PEL",
      },
      {
        word: "komplain",
        en: "complain; file a complaint",
        vi: "phàn nàn; khiếu nại",
        pos: "verb",
        pronunciation_vi: "ko-PLAIN",
        pronunciation_en: "koh-PLAIN",
      },
    ],
    dialogue: [
      {
        speaker: "Pelanggan",
        text: "Halo, saya mau pesan jasa bersih rumah untuk sore ini.",
        vi: "Xin chào, tôi muốn đặt dịch vụ dọn nhà cho chiều nay.",
        en: "Hello, I want to book a home cleaning service for this afternoon.",
      },
      {
        speaker: "Admin",
        text: "Baik. Berapa biaya per jam yang Anda cari?",
        vi: "Vâng. Anh/chị đang tìm mức giá bao nhiêu mỗi giờ?",
        en: "Okay. What hourly rate are you looking for?",
      },
      {
        speaker: "Pelanggan",
        text: "Saya perlu fokus ke kamar mandi dan dapur.",
        vi: "Tôi cần tập trung vào phòng tắm và nhà bếp.",
        en: "I need the bathroom and kitchen to be the focus.",
      },
      {
        speaker: "Admin",
        text: "Bisa. Alat kebersihan dibawa sendiri atau disediakan?",
        vi: "Được. Dụng cụ vệ sinh tự mang theo hay chúng tôi chuẩn bị?",
        en: "Sure. Are the cleaning tools brought by you or provided?",
      },
      {
        speaker: "Pelanggan",
        text: "Kalau hasilnya kurang rapi, saya boleh minta diperbaiki lagi?",
        vi: "Nếu kết quả chưa gọn gàng, tôi có thể nhờ sửa/dọn lại không?",
        en: "If the result is not neat enough, can I ask for it to be fixed again?",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Berapa biaya ___ jam?`",
        prompt_en: "Fill in: `Berapa biaya ___ jam?`",
        answer: "per",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Tôi muốn đặt dịch vụ dọn nhà cho chiều nay.",
        prompt_en: "Translate to Indonesian: I want to book a home cleaning service for this afternoon.",
        answer: "Saya mau pesan jasa bersih rumah untuk sore ini.",
      },
      {
        type: "rewrite_polite",
        prompt_vi: "Viết lịch sự hơn: `Bersihkan kamar mandi.`",
        prompt_en: "Rewrite more politely: `Clean the bathroom.`",
        answer: "Tolong bersihkan kamar mandi.",
      },
      {
        type: "choose_best_phrase",
        prompt_vi: "Chọn cụm tự nhiên nhất khi nói về quét và lau sàn.",
        prompt_en: "Choose the most natural phrase for sweeping and mopping the floor.",
        options: ["sapu dan pel", "bersih dan lantai", "cuci lantai"],
        answer: "sapu dan pel",
      },
    ],
  },
];

