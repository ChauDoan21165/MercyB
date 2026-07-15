// Puskesmas dental referral Indonesian lesson pack for Vietnamese learners.
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
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
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
  content?: string;
};

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_puskesmas_dental_referral_flow",
    level: "B1",
    category: "health",
    title_vi: "Puskesmas và rujukan nha khoa BPJS",
    title_en: "Puskesmas and BPJS dental referral",
    sentences: [
      {
        en: "Saya perlu rujukan dokter gigi dari puskesmas.",
        vi: "Tôi cần giấy chuyển tuyến nha khoa từ puskesmas.",
        pronunciation_focus: [
          "SA-ya per-LU ru-JU-kan DOK-ter GI-gi da-ri pus-KES-mas.",
          "`rujukan dokter gigi` = giấy chuyển tuyến nha khoa; `puskesmas` = trung tâm y tế cộng đồng.",
          "L1 Việt: `rujukan` là giấy chuyển tuyến, không phải lời giới thiệu chung chung. Trong BPJS, đây là giấy rất quan trọng.",
        ],
        pronunciation_focus_en: [
          "SAH-yah per-LOO roo-JOO-kan DOK-ter GEE-gee da-ree poos-KES-mas.",
          "`rujukan dokter gigi` = dental referral; `puskesmas` = community health center.",
          "VN-speaker note: `rujukan` is a referral letter, not a generic recommendation. In BPJS, it is an important document.",
        ],
      },
      {
        en: "Saya sakit gigi dan sudah ke puskesmas pagi ini.",
        vi: "Tôi bị đau răng và đã đến puskesmas sáng nay.",
        pronunciation_focus: [
          "SA-ya SA-kit GI-gi dan SU-dah ke pus-KES-mas PA-gi I-ni.",
          "`sakit gigi` = đau răng; `pagi ini` = sáng nay.",
          "L1 Việt: nói rõ `sakit gigi` thay vì chỉ `sakit` để petugas hiểu triệu chứng utama.",
        ],
        pronunciation_focus_en: [
          "SAH-yah SAH-kit GEE-gee dan SOO-dah ke poos-KES-mas PAH-gee EE-nee.",
          "`sakit gigi` = toothache; `pagi ini` = this morning.",
          "VN-speaker note: say `sakit gigi` instead of just `sakit` so the staff understands the main symptom.",
        ],
      },
      {
        en: "Apakah saya bisa daftar antrean untuk dokter gigi hari ini?",
        vi: "Tôi có thể đăng ký xếp hàng gặp nha sĩ hôm nay không?",
        pronunciation_focus: [
          "A-pa-kah SA-ya BI-sa DAF-tar an-TRE-an UN-tuk DOK-ter GI-gi HA-ri I-ni.",
          "`daftar antrean` = đăng ký lấy số; `dokter gigi` = nha sĩ.",
          "L1 Việt: `antrean` là hàng đợi, còn `daftar antrean` là làm thủ tục lấy số, không chỉ đứng chờ.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah SAH-yah BEE-sa DAF-tar an-TRE-an OON-took DOK-ter GEE-gee HAH-ree EE-nee.",
          "`daftar antrean` = register for a queue number; `dokter gigi` = dentist.",
          "VN-speaker note: `antrean` means queue, while `daftar antrean` means registering to get a number, not just standing and waiting.",
        ],
      },
      {
        en: "Saya pakai BPJS, apakah tetap ada biaya?",
        vi: "Tôi dùng BPJS, vậy có vẫn còn chi phí không?",
        pronunciation_focus: [
          "SA-ya PA-kai be-pe-je-ES, a-pa-kah te-TAP A-da BI-a-ya.",
          "`pakai BPJS` = dùng bảo hiểm BPJS; `biaya` = chi phí.",
          "L1 Việt: khi hỏi tiền, dùng `berapa biaya` hoặc `ada biaya` thay vì chỉ `harga`.",
        ],
        pronunciation_focus_en: [
          "SAH-yah PAH-kai bay-pay-jay-ESS, ah-PA-kah teh-TAP A-da BEE-ah-yah.",
          "`pakai BPJS` = use BPJS coverage; `biaya` = cost/fee.",
          "VN-speaker note: when asking about money, use `berapa biaya` or `ada biaya`, not only `harga`.",
        ],
      },
      {
        en: "Obat sementara apa yang bisa saya minum?",
        vi: "Tôi có thể uống thuốc tạm thời nào?",
        pronunciation_focus: [
          "O-bat se-men-TA-ra A-pa yang BI-sa SA-ya MI-num.",
          "`obat sementara` = thuốc tạm thời; `minum` = uống thuốc/dùng thuốc uống.",
          "L1 Việt: `minum obat` là cách chuẩn cho thuốc uống. Đừng chỉ nói `makan obat` nếu thuốc không phải dạng ăn.",
        ],
        pronunciation_focus_en: [
          "OH-bat seh-men-TAH-rah A-pah yang BEE-sa SAH-yah MEE-noom.",
          "`obat sementara` = temporary medicine; `minum` = take by mouth/drink medication.",
          "VN-speaker note: `minum obat` is the normal way to say oral medication. Do not default to `makan obat` unless the medicine is chewable or specifically eaten.",
        ],
      },
      {
        en: "Kapan jadwal kontrol ulang saya?",
        vi: "Khi nào lịch tái khám của tôi?",
        pronunciation_focus: [
          "KA-pan JAD-wal kon-TROL u-LANG SA-ya.",
          "`kontrol ulang` = tái khám; `jadwal` = lịch hẹn.",
          "L1 Việt: `kontrol` trong y tế là tái khám, không phải kiểm soát chung chung.",
        ],
        pronunciation_focus_en: [
          "KAH-pan JAD-wahl kon-TROL oo-LANG SAH-yah.",
          "`kontrol ulang` = follow-up checkup; `jadwal` = schedule/appointment time.",
          "VN-speaker note: in healthcare, `kontrol` means follow-up checkup, not general control.",
        ],
      },
      {
        en: "Berapa biaya kalau saya tidak pakai BPJS?",
        vi: "Nếu tôi không dùng BPJS thì chi phí bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa BI-a-ya ka-LAU SA-ya ti-dak PA-kai be-pe-je-ES.",
          "`kalau` = nếu; `tidak pakai BPJS` = không dùng bảo hiểm BPJS.",
          "L1 Việt: khi hỏi giá trong y tế, thường tách rõ `pakai BPJS` và `tidak pakai BPJS` vì mức phí có thể khác.",
        ],
        pronunciation_focus_en: [
          "beh-RAH-pah BEE-ah-yah kah-LOW SAH-yah TEE-dak PAH-kai bay-pay-jay-ESS.",
          "`kalau` = if; `tidak pakai BPJS` = without BPJS coverage.",
          "VN-speaker note: in healthcare pricing, it is common to separate `pakai BPJS` and `tidak pakai BPJS` because the fee may differ.",
        ],
      },
    ],
    cultural_notes_vi:
      "Di puskesmas, alur umum untuk rujukan nha khoa biasanya bắt đầu từ pemeriksaan awal, lalu petugas mengecek apakah pasien BPJS butuh rujukan ke dokter gigi spesialis atau fasilitas lain. Không phải mọi masalah gigi đều bisa langsung ke spesialis; kadang puskesmas memberi obat sementara, lalu jadwal kontrol ulang. Jika pasien pakai BPJS, tanyakan juga apakah ada biaya tambahan, jam antrean, dan dokumen yang harus dibawa.",
    cultural_notes_en:
      "At a puskesmas, the usual flow for dental referral often starts with an initial examination, then staff check whether BPJS patients need a referral to a specialist dentist or another facility. Not every dental issue can go directly to a specialist; sometimes the puskesmas gives temporary medicine and then schedules a follow-up. If the patient uses BPJS, also ask whether there are extra costs, queue hours, and which documents to bring.",
    tip_advice_vi:
      "Mẫu hỏi hữu ích: `Saya perlu rujukan dokter gigi`, `Saya pakai BPJS`, `Apakah tetap ada biaya?`, `Kapan jadwal kontrol ulang?`. Người Việt nên nhớ `daftar antrean` là lấy số, còn `rujukan` là giấy chuyển tuyến.",
    tip_advice_en:
      "Useful question frames: `Saya perlu rujukan dokter gigi`, `Saya pakai BPJS`, `Apakah tetap ada biaya?`, `Kapan jadwal kontrol ulang?`. Vietnamese speakers should remember `daftar antrean` means getting a queue number, while `rujukan` means a referral letter.",
    vocabulary: [
      { cell_id: "312c5c91-47cb-4879-b9dc-fdcd44896a1c", word: "puskesmas", en: "community health center", vi: "trung tâm y tế cộng đồng", pos: "noun", pronunciation_vi: "pus-KES-mas", pronunciation_en: "poos-KES-mas" },
      { cell_id: "022c2f12-ad29-48bc-b8b8-c5fc02109d35", word: "rujukan dokter gigi", en: "dental referral", vi: "giấy chuyển tuyến nha khoa", pos: "noun phrase", pronunciation_vi: "ru-JU-kan DOK-ter GI-gi", pronunciation_en: "roo-JOO-kan DOK-ter GEE-gee" },
      { cell_id: "ccf49bce-c173-43d3-aeb1-1fd2f569fc94", word: "daftar antrean", en: "register for a queue number", vi: "đăng ký lấy số", pos: "verb phrase", pronunciation_vi: "DAF-tar an-TRE-an", pronunciation_en: "DAF-tar an-TRE-an" },
      { cell_id: "92960922-0e92-4e7d-be86-137febf16c11", word: "BPJS", en: "Indonesian national health insurance", vi: "bảo hiểm y tế BPJS", pos: "noun", pronunciation_vi: "be-pe-je-ES", pronunciation_en: "bay-pay-jay-ESS" },
      { cell_id: "2d88d349-1aec-41e2-a3f8-6a004271f658", word: "obat sementara", en: "temporary medicine", vi: "thuốc tạm thời", pos: "noun phrase", pronunciation_vi: "O-bat se-men-TA-ra", pronunciation_en: "OH-bat seh-men-TAH-rah" },
      { cell_id: "8aa39560-be1c-4e18-a1a8-5ac2c16ae08b", word: "kontrol ulang", en: "follow-up checkup", vi: "tái khám", pos: "noun phrase", pronunciation_vi: "kon-TROL u-LANG", pronunciation_en: "kon-TROL oo-LANG" },
      { cell_id: "822f616d-808d-4355-918f-79a72bd8c461", word: "biaya", en: "cost / fee", vi: "chi phí", pos: "noun", pronunciation_vi: "BI-a-ya", pronunciation_en: "BEE-ah-yah" },
    ],
    dialogue: [
      {
        cell_id: "a13cb7a1-1372-4f89-971d-5aa3b2f71a21",
        speaker: "Pasien",
        text: "Selamat pagi, saya perlu rujukan dokter gigi dari puskesmas.",
        vi: "Chào buổi sáng, tôi cần giấy chuyển tuyến nha khoa từ puskesmas.",
        en: "Good morning, I need a dental referral from the puskesmas.",
      },
      {
        cell_id: "f08bfdbe-e717-4553-8683-bd9103ff2291",
        speaker: "Petugas",
        text: "Baik, silakan daftar antrean dulu.",
        vi: "Được, mời đăng ký lấy số trước.",
        en: "Okay, please register for a queue number first.",
      },
      {
        cell_id: "3b837c4b-cc02-45a8-9778-cd75e705606b",
        speaker: "Pasien",
        text: "Saya pakai BPJS, apakah tetap ada biaya?",
        vi: "Tôi dùng BPJS, vậy có vẫn còn chi phí không?",
        en: "I use BPJS, will there still be any cost?",
      },
      {
        cell_id: "50e3757e-b0cc-4de8-8188-3db2329317f1",
        speaker: "Petugas",
        text: "Kami periksa dulu. Kalau perlu, dokter akan beri obat sementara dan jadwal kontrol ulang.",
        vi: "Chúng tôi kiểm tra trước. Nếu cần, bác sĩ sẽ cho thuốc tạm thời và lịch tái khám.",
        en: "We will check first. If needed, the doctor will give temporary medicine and a follow-up schedule.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "puskesmas", answer: "trung tâm y tế cộng đồng" },
          { prompt: "rujukan dokter gigi", answer: "giấy chuyển tuyến nha khoa" },
          { prompt: "obat sementara", answer: "thuốc tạm thời" },
          { prompt: "kontrol ulang", answer: "tái khám" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi cần giấy chuyển tuyến nha khoa từ puskesmas.", answer: "Saya perlu rujukan dokter gigi dari puskesmas." },
          { prompt: "Tôi có thể đăng ký xếp hàng gặp nha sĩ hôm nay không?", answer: "Apakah saya bisa daftar antrean untuk dokter gigi hari ini?" },
          { prompt: "Nếu tôi không dùng BPJS thì chi phí bao nhiêu?", answer: "Berapa biaya kalau saya tidak pakai BPJS?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_puskesmas_dental_cost_schedule",
    level: "B2",
    category: "health",
    title_vi: "Chi phí, hàng đợi, và lịch điều trị nha khoa",
    title_en: "Dental treatment costs, queueing, and schedules",
    sentences: [
      {
        en: "Saya ingin tahu apakah rujukan ini berlaku untuk kunjungan berikutnya.",
        vi: "Tôi muốn biết giấy chuyển tuyến này có còn hiệu lực cho lần khám tiếp theo không.",
        pronunciation_focus: [
          "SA-ya I-ngin TA-hu a-pa-kah ru-JU-kan i-ni ber-LA-ku un-TUK kun-JUNG-an be-RI-kut-nya.",
          "`berlaku` = còn hiệu lực; `kunjungan berikutnya` = lần khám tiếp theo.",
          "L1 Việt: hỏi `berlaku` rất quan trọng vì giấy tờ có thể có hạn dùng, không phải cứ có là dùng mãi.",
        ],
        pronunciation_focus_en: [
          "SAH-yah EE-ngin TAH-hoo ah-pa-kah roo-JOO-kan ee-nee ber-LAH-koo oon-TOOK koon-JOONG-an beh-REE-koot-nya.",
          "`berlaku` = valid/in force; `kunjungan berikutnya` = next visit.",
          "VN-speaker note: asking about `berlaku` is important because documents may have an expiry period.",
        ],
      },
      {
        en: "Petugas bilang antreannya panjang, jadi saya harus datang lebih pagi.",
        vi: "Nhân viên nói hàng đợi dài, nên tôi phải đến sớm hơn.",
        pronunciation_focus: [
          "pe-TU-gas bi-LANG an-TRE-an-nya PAN-jang, JA-di SA-ya HA-rus DA-tang le-BIH PA-gi.",
          "`antreannya panjang` = hàng đợi dài; `datang lebih pagi` = đến sớm hơn.",
          "L1 Việt: `lebih pagi` là sớm hơn về thời gian, không phải sáng hơn theo nghĩa ánh sáng.",
        ],
        pronunciation_focus_en: [
          "peh-TOO-gas bee-LANG an-TRE-an-nya PAN-jahng, JAH-dee SAH-yah HA-roos DAH-tahng leh-BEEH PAH-gee.",
          "`antreannya panjang` = the queue is long; `datang lebih pagi` = come earlier in the morning.",
          "VN-speaker note: `lebih pagi` means earlier in time, not brighter in terms of light.",
        ],
      },
      {
        en: "Apakah biaya obat dan tindakan bisa dijelaskan di awal?",
        vi: "Chi phí thuốc và thủ thuật có thể giải thích trước được không?",
        pronunciation_focus: [
          "A-pa-kah BI-a-ya O-bat dan tin-DA-kan BI-sa di-je-LAS-kan di A-wal.",
          "`tindakan` = thủ thuật/y lệnh điều trị; `di awal` = từ đầu.",
          "L1 Việt: trong y tế, hỏi `di awal` để tránh bất ngờ về chi phí là rất bình thường.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah BEE-ah-yah OH-bat dan tin-DAH-kan BEE-sa di-jeh-LAHS-kan di A-wahl.",
          "`tindakan` = procedure/medical action; `di awal` = up front / at the beginning.",
          "VN-speaker note: asking about costs `di awal` is normal in healthcare to avoid surprises later.",
        ],
      },
      {
        en: "Saya butuh surat kontrol kalau harus kembali minggu depan.",
        vi: "Tôi cần giấy tái khám nếu phải quay lại tuần tới.",
        pronunciation_focus: [
          "SA-ya BU-tuh su-RAT kon-TROL ka-lau HA-rus kem-BA-li MING-gu de-PAN.",
          "`surat kontrol` = giấy hẹn tái khám; `minggu depan` = tuần tới.",
          "L1 Việt: `surat kontrol` rất hữu ích khi muốn giữ lịch và tránh xếp hàng lại từ đầu.",
        ],
        pronunciation_focus_en: [
          "SAH-yah BOO-tooh soo-RAT kon-TROL kah-LOW HA-roos kem-BAH-lee MEENG-goo deh-PAHN.",
          "`surat kontrol` = follow-up appointment paper; `minggu depan` = next week.",
          "VN-speaker note: `surat kontrol` is useful when you want to keep the follow-up schedule and avoid lining up from scratch.",
        ],
      },
      {
        en: "Kalau gigi saya masih sakit, apakah saya harus kembali ke puskesmas?",
        vi: "Nếu răng tôi vẫn đau, tôi có phải quay lại puskesmas không?",
        pronunciation_focus: [
          "KA-lau GI-gi SA-ya ma-sih SA-kit, a-pa-kah SA-ya HA-rus kem-BA-li ke pus-KES-mas.",
          "`masih sakit` = vẫn đau; `harus kembali` = phải quay lại.",
          "L1 Việt: hỏi `harus kembali` giúp bạn biết có cần tái khám hay đi thẳng lên rujukan tiếp theo.",
        ],
        pronunciation_focus_en: [
          "KAH-low GEE-gee SAH-yah MAH-sih SAH-kit, ah-pa-kah SAH-yah HA-roos kem-BAH-lee ke poos-KES-mas.",
          "`masih sakit` = still hurts; `harus kembali` = must return.",
          "VN-speaker note: asking `harus kembali` tells you whether you need a follow-up visit or the next referral step.",
        ],
      },
      {
        en: "Mohon beri tahu jika ada biaya tambahan.",
        vi: "Xin hãy báo cho tôi nếu có chi phí phát sinh.",
        pronunciation_focus: [
          "MO-hon BE-ri TA-hu ji-ka A-da BI-a-ya tam-BA-han.",
          "`biaya tambahan` = chi phí phát sinh; `mohon beri tahu` = xin vui lòng cho biết.",
          "L1 Việt: `tambahan` là thêm vào, phụ trội. Trong bệnh viện, câu này lịch sự và rất thực tế.",
        ],
        pronunciation_focus_en: [
          "MO-hon BEH-ree TAH-hoo JEE-kah A-dah BEE-ah-yah tahm-BAH-han.",
          "`biaya tambahan` = additional cost; `mohon beri tahu` = please let me know.",
          "VN-speaker note: `tambahan` means extra/additional. In a clinic, this phrase is polite and practical.",
        ],
      },
      {
        en: "Saya akan simpan nomor antrean dan hasil rontgen untuk kontrol berikutnya.",
        vi: "Tôi sẽ giữ số thứ tự và kết quả X-quang cho lần tái khám tiếp theo.",
        pronunciation_focus: [
          "SA-ya A-kan SIM-pan NO-mor an-TRE-an dan ha-SIL RON-tgen un-TUK kon-TROL be-RI-kut-nya.",
          "`hasil rontgen` = kết quả X-quang; `kontrol berikutnya` = lần tái khám kế tiếp.",
          "L1 Việt: giữ lại nomor antrean, rujukan, hasil rontgen, dan kuitansi là thói quen rất tốt.",
        ],
        pronunciation_focus_en: [
          "SAH-yah A-kan SIM-pahn NO-mor an-TRE-an dan HA-sil RON-gen oon-TOOK kon-TROL beh-REE-koot-nya.",
          "`hasil rontgen` = X-ray result; `kontrol berikutnya` = next follow-up checkup.",
          "VN-speaker note: keep the queue number, referral, X-ray results, and receipts; that habit is very useful.",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong puskesmas Indonesia, alur nha khoa thường đi qua antrean, pemeriksaan awal, lalu keputusan apakah cần rujukan hay cukup obat sementara. Dengan BPJS, banyak pasien hỏi biaya sejak awal để biết ada biaya tambahan atau tidak. Nếu cần kontrol ulang, simpan surat kontrol, rujukan, nomor antrean, dan hasil rontgen supaya lần sau đăng ký nhanh hơn.",
    cultural_notes_en:
      "At Indonesian puskesmas, dental flow usually goes through the queue, initial examination, and then a decision on whether a referral is needed or temporary medicine is enough. With BPJS, many patients ask about cost up front to know whether there are extra charges. If you need follow-up care, keep the follow-up letter, referral, queue number, and X-ray results so the next visit is faster.",
    tip_advice_vi:
      "Khung hữu ích: `Saya sakit gigi`, `Saya perlu rujukan dokter gigi`, `Apakah ada biaya tambahan?`, `Kapan kontrol ulang?`. Người Việt nên phân biệt `daftar antrean` = lấy số và `kontrol ulang` = tái khám.",
    tip_advice_en:
      "Useful frames: `Saya sakit gigi`, `Saya perlu rujukan dokter gigi`, `Apakah ada biaya tambahan?`, `Kapan kontrol ulang?`. Vietnamese speakers should distinguish `daftar antrean` = getting a queue number and `kontrol ulang` = follow-up visit.",
    vocabulary: [
      { cell_id: "726cabd7-863d-48ea-b38c-e0cdd46d9de4", word: "surat kontrol", en: "follow-up letter / appointment slip", vi: "giấy hẹn tái khám", pos: "noun phrase", pronunciation_vi: "SU-rat kon-TROL", pronunciation_en: "SOO-rat kon-TROL" },
      { cell_id: "17a71e23-c597-401f-841e-a72d96a069ee", word: "biaya tambahan", en: "additional cost", vi: "chi phí phát sinh", pos: "noun phrase", pronunciation_vi: "BI-a-ya tam-BA-han", pronunciation_en: "BEE-ah-yah tahm-BAH-han" },
      { cell_id: "f97a333e-e3b1-4b52-8357-4551a63a7cca", word: "hasil rontgen", en: "X-ray result", vi: "kết quả X-quang", pos: "noun phrase", pronunciation_vi: "ha-SIL RON-tgen", pronunciation_en: "HA-sil RON-gen" },
      { cell_id: "0a6352cf-e3be-4fc2-ac80-f457638f336e", word: "tindakan", en: "procedure / medical action", vi: "thủ thuật / can thiệp y tế", pos: "noun", pronunciation_vi: "tin-DA-kan", pronunciation_en: "tin-DAH-kan" },
      { cell_id: "47f61670-c2e3-4733-bb16-a2492acc6ab5", word: "daftar antrean", en: "register for a queue number", vi: "đăng ký lấy số", pos: "verb phrase", pronunciation_vi: "DAF-tar an-TRE-an", pronunciation_en: "DAF-tar an-TRE-an" },
      { cell_id: "19f08a67-a03e-4928-8912-b5619a192baa", word: "kontrol ulang", en: "follow-up checkup", vi: "tái khám", pos: "noun phrase", pronunciation_vi: "kon-TROL u-LANG", pronunciation_en: "kon-TROL oo-LANG" },
      { cell_id: "3c18fce2-a790-4f1a-9a7e-dcadf6e2daf2", word: "biaya", en: "cost / fee", vi: "chi phí", pos: "noun", pronunciation_vi: "BI-a-ya", pronunciation_en: "BEE-ah-yah" },
    ],
    dialogue: [
      {
        cell_id: "aa10b40b-ff14-42db-8380-8a147df71e78",
        speaker: "Pasien",
        text: "Saya mau tanya, apakah biaya tindakan ini termasuk BPJS?",
        vi: "Tôi muốn hỏi, chi phí thủ thuật này có bao gồm trong BPJS không?",
        en: "I want to ask, is this procedure cost covered by BPJS?",
      },
      {
        cell_id: "bc02cb57-2133-4f9f-b979-d0b007c68482",
        speaker: "Petugas",
        text: "Kami cek dulu. Kalau tidak, ada biaya tambahan yang perlu dibayar.",
        vi: "Chúng tôi kiểm tra trước. Nếu không, sẽ có chi phí phát sinh cần thanh toán.",
        en: "We will check first. If not, there will be additional costs that need to be paid.",
      },
      {
        cell_id: "2ec20024-3286-4d96-80e0-5035629f42d4",
        speaker: "Pasien",
        text: "Baik, saya akan simpan nomor antrean dan surat kontrolnya.",
        vi: "Vâng, tôi sẽ giữ số thứ tự và giấy hẹn tái khám.",
        en: "Okay, I will keep the queue number and the follow-up letter.",
      },
      {
        cell_id: "6559098e-edb9-4396-9e97-fea2472733d1",
        speaker: "Petugas",
        text: "Silakan. Jangan lupa kembali sesuai jadwal kontrol ulang.",
        vi: "Mời anh/chị. Đừng quên quay lại đúng lịch tái khám.",
        en: "Please do. Do not forget to return according to the follow-up schedule.",
      },
    ],
    exercises: [
      {
        type: "multiple_choice",
        instruction_vi: "Chọn câu phù hợp khi hỏi về phí và tái khám.",
        instruction_en: "Choose the suitable sentence for asking about fees and follow-up.",
        items: [
          {
            prompt: "Bạn muốn hỏi có phí phát sinh không.",
            answer: "Mohon beri tahu jika ada biaya tambahan.",
            options: [
              "Mohon beri tahu jika ada biaya tambahan.",
              "Saya tidak suka puskesmas.",
              "Mana rontgennya cepat.",
            ],
          },
          {
            prompt: "Bạn muốn biết lịch tái khám.",
            answer: "Kapan jadwal kontrol ulang saya?",
            options: [
              "Kapan jadwal kontrol ulang saya?",
              "Saya sudah selesai, selamat tinggal.",
              "Rontgen saya mahal.",
            ],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi có thể đăng ký xếp hàng gặp nha sĩ hôm nay không?", answer: "Apakah saya bisa daftar antrean untuk dokter gigi hari ini?" },
          { prompt: "Tôi sẽ giữ số thứ tự và kết quả X-quang cho lần tái khám tiếp theo.", answer: "Saya akan simpan nomor antrean dan hasil rontgen untuk kontrol berikutnya." },
          { prompt: "Chi phí thuốc và thủ thuật có thể giải thích trước được không?", answer: "Apakah biaya obat dan tindakan bisa dijelaskan di awal?" },
        ],
      },
    ],
  },
];
