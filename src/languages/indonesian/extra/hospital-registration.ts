// Hospital Registration Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson following the established Indonesian lesson shape.
// Field convention: sentence `en` is the TARGET-LANGUAGE text (Indonesian), and
// `vi` is the Vietnamese gloss. `pronunciation_focus` gives Vietnamese L1 notes;
// `pronunciation_focus_en` is the English companion in the same order.

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
    id: "indonesian_hospital_registration",
    level: "A2",
    category: "health",
    title_vi: "Đăng ký khám ở bệnh viện Indonesia",
    title_en: "Hospital registration in Indonesia",
    sentences: [
      {
        en: "Saya mau daftar rawat jalan.",
        vi: "Tôi muốn đăng ký khám ngoại trú.",
        pronunciation_focus: [
          "SA-ya MAU DAF-tar RA-wat JA-lan - `daftar` = đăng ký; `rawat jalan` = khám/điều trị ngoại trú.",
          "Lỗi người Việt: dịch `khám bệnh` thành `lihat sakit`. Ở quầy bệnh viện, dùng `daftar rawat jalan`.",
          "Luyện: `Saya mau daftar rawat jalan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU DAF-tar RA-wat JA-lan - `daftar` = register; `rawat jalan` = outpatient care.",
          "VN-speaker trap: translating 'see illness' as `lihat sakit`. At hospital registration, use `daftar rawat jalan`.",
          "Drill: `Saya mau daftar rawat jalan.`",
        ],
      },
      {
        en: "Loket pendaftaran rumah sakit di mana?",
        vi: "Quầy đăng ký của bệnh viện ở đâu?",
        pronunciation_focus: [
          "LO-ket pen-DAF-ta-ran RU-mah SA-kit di MA-na - `loket` = quầy; `pendaftaran` = việc đăng ký.",
          "Lỗi người Việt: `rumah sakit` nghĩa đen là 'nhà bệnh' nhưng là từ chuẩn cho bệnh viện, không nói `hospital` trong câu thường.",
          "Luyện: `Loket pendaftaran rumah sakit di mana?`",
        ],
        pronunciation_focus_en: [
          "LO-ket pen-DAF-ta-ran RU-mah SA-kit di MA-na - `loket` = counter; `pendaftaran` = registration.",
          "VN-speaker trap: `rumah sakit` literally means 'sick house' but is the standard word for hospital; avoid English `hospital` in normal Indonesian.",
          "Drill: `Loket pendaftaran rumah sakit di mana?`",
        ],
      },
      {
        en: "Ambil nomor antrean dulu, ya.",
        vi: "Lấy số thứ tự trước nhé.",
        pronunciation_focus: [
          "AM-bil NO-mor an-TRE-an DU-lu ya - `nomor antrean` = số thứ tự xếp hàng; `dulu` = trước đã.",
          "Lỗi người Việt: dùng `nomor tunggu`. Cách tự nhiên ở bệnh viện là `nomor antrean`.",
          "Luyện: `Ambil nomor antrean dulu, ya.`",
        ],
        pronunciation_focus_en: [
          "AM-bil NO-mor an-TRE-an DU-lu ya - `nomor antrean` = queue number; `dulu` = first/for now.",
          "VN-speaker trap: saying `nomor tunggu`. The natural hospital phrase is `nomor antrean`.",
          "Drill: `Ambil nomor antrean dulu, ya.`",
        ],
      },
      {
        en: "Nomor antrean saya sudah dipanggil.",
        vi: "Số thứ tự của tôi đã được gọi.",
        pronunciation_focus: [
          "NO-mor an-TRE-an SA-ya SU-dah di-PANG-gil - `dipanggil` = được gọi; `sudah` = đã/rồi.",
          "Lỗi người Việt: quên tiền tố bị động `di-`. Trên loa/quầy, `dipanggil` rất tự nhiên.",
          "Luyện: `Nomor antrean saya sudah dipanggil.`",
        ],
        pronunciation_focus_en: [
          "NO-mor an-TRE-an SA-ya SU-dah di-PANG-gil - `dipanggil` = has been called; `sudah` = already.",
          "VN-speaker trap: dropping the passive prefix `di-`. At counters, `dipanggil` sounds natural.",
          "Drill: `Nomor antrean saya sudah dipanggil.`",
        ],
      },
      {
        en: "Saya pakai BPJS Kesehatan.",
        vi: "Tôi dùng bảo hiểm y tế BPJS.",
        pronunciation_focus: [
          "SA-ya PA-kai be-pe-je-es ke-SE-ha-tan - `pakai` = dùng; `BPJS Kesehatan` = bảo hiểm y tế quốc gia Indonesia.",
          "Lỗi người Việt: nói `saya punya BPJS` khi quầy hỏi phương thức. Nói `pakai BPJS` = dùng BPJS để thanh toán/đăng ký.",
          "Luyện: `Saya pakai BPJS Kesehatan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PA-kai bay-pay-jay-es ke-SE-ha-tan - `pakai` = use; `BPJS Kesehatan` = Indonesia's national health insurance.",
          "VN-speaker trap: saying `saya punya BPJS` when the counter asks payment/coverage method. `Pakai BPJS` = use BPJS for registration/payment.",
          "Drill: `Saya pakai BPJS Kesehatan.`",
        ],
      },
      {
        en: "Saya perlu rujukan untuk dokter spesialis.",
        vi: "Tôi cần giấy chuyển tuyến để gặp bác sĩ chuyên khoa.",
        pronunciation_focus: [
          "SA-ya per-LU ru-JU-kan un-TUK DOK-ter spe-si-a-LIS - `rujukan` = giấy chuyển tuyến/giới thiệu; `dokter spesialis` = bác sĩ chuyên khoa.",
          "Lỗi người Việt: nhầm `spesialis` với tên khoa. `Spesialis` là bác sĩ chuyên khoa, ví dụ `spesialis anak`.",
          "Luyện: `Saya perlu rujukan untuk dokter spesialis.`",
        ],
        pronunciation_focus_en: [
          "SA-ya per-LU ru-JU-kan un-TUK DOK-ter spe-see-ah-LIS - `rujukan` = referral; `dokter spesialis` = specialist doctor.",
          "VN-speaker trap: confusing `spesialis` with a department name. `Spesialis` is the specialist doctor, e.g. `spesialis anak`.",
          "Drill: `Saya perlu rujukan untuk dokter spesialis.`",
        ],
      },
      {
        en: "Jadwal dokter spesialis penyakit dalam hari ini ada?",
        vi: "Hôm nay có lịch bác sĩ chuyên khoa nội không?",
        pronunciation_focus: [
          "JAD-wal DOK-ter spe-si-a-LIS pe-NYA-kit DA-lam HA-ri I-ni A-da - `jadwal` = lịch; `penyakit dalam` = nội khoa.",
          "Lỗi người Việt: dịch nội khoa thành `dalam tubuh`. Tên khoa là `penyakit dalam`.",
          "Luyện: `Jadwal dokter spesialis penyakit dalam hari ini ada?`",
        ],
        pronunciation_focus_en: [
          "JAD-wal DOK-ter spe-see-ah-LIS pe-NYA-kit DA-lam HA-ri I-ni A-da - `jadwal` = schedule; `penyakit dalam` = internal medicine.",
          "VN-speaker trap: translating internal medicine as `dalam tubuh`. The department name is `penyakit dalam`.",
          "Drill: `Jadwal dokter spesialis penyakit dalam hari ini ada?`",
        ],
      },
      {
        en: "Pasien ini harus rawat inap malam ini.",
        vi: "Bệnh nhân này phải nhập viện/điều trị nội trú tối nay.",
        pronunciation_focus: [
          "PA-sien I-ni HA-rus RA-wat I-nap MA-lam I-ni - `pasien` = bệnh nhân; `rawat inap` = điều trị nội trú/nằm viện.",
          "Lỗi người Việt: lẫn `rawat jalan` và `rawat inap`. `Jalan` = đi về trong ngày; `inap` = ở lại qua đêm.",
          "Luyện: `Pasien ini harus rawat inap malam ini.`",
        ],
        pronunciation_focus_en: [
          "PA-sien I-ni HA-rus RA-wat I-nap MA-lam I-ni - `pasien` = patient; `rawat inap` = inpatient care/stay overnight.",
          "VN-speaker trap: mixing `rawat jalan` and `rawat inap`. `Jalan` = go home same day; `inap` = stay overnight.",
          "Drill: `Pasien ini harus rawat inap malam ini.`",
        ],
      },
      {
        en: "Kapan hasil lab bisa diambil?",
        vi: "Khi nào có thể lấy kết quả xét nghiệm?",
        pronunciation_focus: [
          "KA-pan HA-sil lab BI-sa di-AM-bil - `hasil lab` = kết quả xét nghiệm; `diambil` = được lấy/đến lấy.",
          "Lỗi người Việt: nói `hasil tes darah` cho mọi xét nghiệm. Ở bệnh viện, `hasil lab` là cách nói rộng và tự nhiên.",
          "Luyện: `Kapan hasil lab bisa diambil?`",
        ],
        pronunciation_focus_en: [
          "KA-pan HA-sil lab BI-sa di-AM-bil - `hasil lab` = lab results; `diambil` = can be picked up/collected.",
          "VN-speaker trap: saying `hasil tes darah` for every test. In hospitals, `hasil lab` is broader and natural.",
          "Drill: `Kapan hasil lab bisa diambil?`",
        ],
      },
      {
        en: "Mohon tunggu di ruang tunggu sampai nama Anda dipanggil.",
        vi: "Xin chờ ở phòng chờ cho đến khi tên anh/chị được gọi.",
        pronunciation_focus: [
          "MO-hon TUNG-gu di RU-ang TUNG-gu SAM-pai NA-ma AN-da di-PANG-gil - `mohon` = xin vui lòng; `ruang tunggu` = phòng chờ.",
          "Lỗi người Việt: dùng `tolong tunggu` không sai, nhưng ở bệnh viện `mohon tunggu` lịch sự và chuẩn hơn.",
          "Luyện: `Mohon tunggu di ruang tunggu sampai nama Anda dipanggil.`",
        ],
        pronunciation_focus_en: [
          "MO-hon TUNG-gu di RU-ang TUNG-gu SAM-pai NA-ma AN-da di-PANG-gil - `mohon` = please; `ruang tunggu` = waiting room.",
          "VN-speaker trap: `tolong tunggu` is understandable, but in hospitals `mohon tunggu` is more formal and standard.",
          "Drill: `Mohon tunggu di ruang tunggu sampai nama Anda dipanggil.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở bệnh viện Indonesia, bạn thường đi qua quầy `pendaftaran`, lấy `nomor antrean`, xuất trình giấy tờ, rồi chờ tên hoặc số được gọi. Nếu dùng BPJS Kesehatan, bệnh viện có thể yêu cầu quy trình đúng tuyến và `rujukan` trước khi gặp `dokter spesialis`, trừ trường hợp cấp cứu. `Rawat jalan` nghĩa là khám/điều trị rồi về trong ngày; `rawat inap` nghĩa là nằm viện. `Hasil lab` có thể lấy trực tiếp, qua quầy, hoặc theo hướng dẫn của bệnh viện.",
    cultural_notes_en:
      "At Indonesian hospitals, you usually go through `pendaftaran`, take a `nomor antrean`, show documents, then wait for your name or number to be called. If using BPJS Kesehatan, the hospital may require the correct referral path and a `rujukan` before seeing a `dokter spesialis`, except in emergencies. `Rawat jalan` means outpatient care; `rawat inap` means inpatient admission. `Hasil lab` may be collected directly, at a counter, or according to the hospital's instructions.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt `pendaftaran` = đăng ký, `antrean` = hàng chờ, `rujukan` = giấy chuyển tuyến, `rawat jalan` = ngoại trú, `rawat inap` = nội trú. Khi hỏi vị trí dùng `di mana`; khi đi đến bác sĩ/khoa dùng `ke`. Câu lịch sự ở bệnh viện thường dùng `mohon`, `Anda`, và dạng bị động `dipanggil`, `diambil`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: separate `pendaftaran` = registration, `antrean` = queue, `rujukan` = referral, `rawat jalan` = outpatient, `rawat inap` = inpatient. Ask location with `di mana`; use `ke` when going to a doctor or department. Hospital speech often uses formal `mohon`, `Anda`, and passive forms like `dipanggil`, `diambil`.",
    vocabulary: [
      {
        word: "rumah sakit",
        en: "hospital",
        vi: "bệnh viện",
        pos: "noun",
        pronunciation_vi: "RU-mah SA-kit",
        pronunciation_en: "ROO-mah SAH-kit",
      },
      {
        word: "pendaftaran",
        en: "registration",
        vi: "đăng ký",
        pos: "noun",
        pronunciation_vi: "pen-DAF-ta-ran",
        pronunciation_en: "pen-DAF-ta-ran",
      },
      {
        word: "nomor antrean",
        en: "queue number",
        vi: "số thứ tự",
        pos: "noun phrase",
        pronunciation_vi: "NO-mor an-TRE-an",
        pronunciation_en: "NOH-mor an-TREH-an",
      },
      {
        word: "BPJS Kesehatan",
        en: "Indonesian national health insurance",
        vi: "bảo hiểm y tế quốc gia Indonesia",
        pos: "proper noun",
        pronunciation_vi: "be-pe-je-es ke-SE-ha-tan",
        pronunciation_en: "bay-pay-jay-es ke-SEH-ha-tan",
      },
      {
        word: "dokter spesialis",
        en: "specialist doctor",
        vi: "bác sĩ chuyên khoa",
        pos: "noun phrase",
        pronunciation_vi: "DOK-ter spe-si-a-LIS",
        pronunciation_en: "DOK-ter spe-see-ah-LIS",
      },
      {
        word: "rawat jalan",
        en: "outpatient care",
        vi: "khám/điều trị ngoại trú",
        pos: "noun phrase",
        pronunciation_vi: "RA-wat JA-lan",
        pronunciation_en: "RAH-wat JAH-lan",
      },
      {
        word: "rawat inap",
        en: "inpatient care",
        vi: "điều trị nội trú / nằm viện",
        pos: "noun phrase",
        pronunciation_vi: "RA-wat I-nap",
        pronunciation_en: "RAH-wat EE-nap",
      },
      {
        word: "hasil lab",
        en: "lab results",
        vi: "kết quả xét nghiệm",
        pos: "noun phrase",
        pronunciation_vi: "HA-sil lab",
        pronunciation_en: "HAH-sil lab",
      },
      {
        word: "rujukan",
        en: "referral",
        vi: "giấy chuyển tuyến / giấy giới thiệu",
        pos: "noun",
        pronunciation_vi: "ru-JU-kan",
        pronunciation_en: "roo-JOO-kan",
      },
      {
        word: "ruang tunggu",
        en: "waiting room",
        vi: "phòng chờ",
        pos: "noun phrase",
        pronunciation_vi: "RU-ang TUNG-gu",
        pronunciation_en: "ROO-ang TOONG-goo",
      },
    ],
    dialogue: [
      {
        speaker: "Pasien",
        text: "Selamat pagi, saya mau daftar rawat jalan.",
        vi: "Chào buổi sáng, tôi muốn đăng ký khám ngoại trú.",
        en: "Good morning, I want to register for outpatient care.",
      },
      {
        speaker: "Petugas",
        text: "Silakan ambil nomor antrean dulu. Pakai BPJS atau umum?",
        vi: "Vui lòng lấy số thứ tự trước. Dùng BPJS hay khám dịch vụ tự trả?",
        en: "Please take a queue number first. Are you using BPJS or paying privately?",
      },
      {
        speaker: "Pasien",
        text: "Saya pakai BPJS. Ini KTP dan surat rujukan saya.",
        vi: "Tôi dùng BPJS. Đây là KTP và giấy chuyển tuyến của tôi.",
        en: "I use BPJS. Here are my ID card and referral letter.",
      },
      {
        speaker: "Petugas",
        text: "Baik. Mau ke dokter spesialis apa?",
        vi: "Được. Anh/chị muốn gặp bác sĩ chuyên khoa nào?",
        en: "Okay. Which specialist do you want to see?",
      },
      {
        speaker: "Pasien",
        text: "Dokter spesialis penyakit dalam. Kapan hasil lab bisa diambil?",
        vi: "Bác sĩ chuyên khoa nội. Khi nào có thể lấy kết quả xét nghiệm?",
        en: "An internal medicine specialist. When can the lab results be collected?",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya mau daftar ____ jalan.`",
        prompt_en: "Fill in the blank: `Saya mau daftar ____ jalan.`",
        answer: "rawat",
        explanation_vi: "`rawat jalan` = khám/điều trị ngoại trú.",
        explanation_en: "`rawat jalan` = outpatient care.",
      },
      {
        type: "multiple_choice",
        prompt_vi: "`Nomor antrean` nghĩa là gì?",
        prompt_en: "What does `nomor antrean` mean?",
        choices: ["số thứ tự", "số phòng bệnh", "số điện thoại bác sĩ"],
        answer: "số thứ tự",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: `Tôi dùng bảo hiểm y tế BPJS.`",
        prompt_en: "Translate into Indonesian: `I use BPJS health insurance.`",
        answer: "Saya pakai BPJS Kesehatan.",
      },
      {
        type: "matching",
        prompt_vi: "Ghép đúng: `rawat jalan` và `rawat inap`.",
        prompt_en: "Match correctly: `rawat jalan` and `rawat inap`.",
        pairs: [
          ["rawat jalan", "outpatient care / ngoại trú"],
          ["rawat inap", "inpatient care / nội trú"],
        ],
      },
    ],
  },
];
