// Public Transport Complaints Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// pronunciation/service notes with English companions in pronunciation_focus_en.

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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_public_transport_complaints",
    level: "B1",
    category: "transport",
    title_vi: "Khiếu nại về angkot, bus kota và giao thông công cộng",
    title_en: "Public transport complaints: angkot, city buses, and passengers",
    sentences: [
      {
        en: "Saya mau mengajukan keluhan sebagai penumpang.",
        vi: "Tôi muốn gửi khiếu nại với tư cách hành khách.",
        pronunciation_focus: [
          "SA-ya MAU me-nga-JU-kan ke-LUH-an se-BA-gai pe-NUM-pang - `mengajukan keluhan` = gửi khiếu nại; `penumpang` = hành khách.",
          "Lỗi người Việt: nói `saya komplain` được trong nói nhanh, nhưng với dịch vụ công nên dùng `mengajukan keluhan`.",
          "Luyện: `Saya mau mengajukan keluhan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU me-nga-JOO-kan ke-LOOH-an se-BA-gai pe-NUM-pang - `mengajukan keluhan` = submit a complaint; `penumpang` = passenger.",
          "VN-speaker trap: `saya komplain` works casually, but for public services `mengajukan keluhan` is smoother.",
          "Drill: `Saya mau mengajukan keluhan.`",
        ],
      },
      {
        en: "Sopir angkot menaikkan tarif tanpa pemberitahuan.",
        vi: "Tài xế angkot tăng giá vé mà không thông báo.",
        pronunciation_focus: [
          "SO-pir ANG-kot me-NA-ik-kan TA-rif TAN-pa pem-be-ri-TA-hu-an - `menaikkan tarif` = tăng giá vé; `tanpa pemberitahuan` = không thông báo.",
          "Lỗi người Việt: nói `harga naik` khi khiếu nại cước xe. Với vé/cước, từ đúng là `tarif`.",
          "Luyện: `Tarifnya naik tanpa pemberitahuan.`",
        ],
        pronunciation_focus_en: [
          "SO-pir ANG-kot me-NA-ik-kan TA-rif TAN-pa pem-be-ri-TA-hu-an - `menaikkan tarif` = raise the fare; `tanpa pemberitahuan` = without notice.",
          "VN-speaker trap: saying `harga naik` for transit fares. For fares, use `tarif`.",
          "Drill: `Tarifnya naik tanpa pemberitahuan.`",
        ],
      },
      {
        en: "Bus kota itu berhenti sembarangan di tengah jalan.",
        vi: "Xe buýt thành phố đó dừng tùy tiện giữa đường.",
        pronunciation_focus: [
          "bus KO-ta I-tu ber-HEN-ti sem-ba-RANG-an di TE-ngah JA-lan - `berhenti sembarangan` = dừng bừa/tùy tiện.",
          "Lỗi người Việt: dịch `dừng lung tung` thành `berhenti bingung`. Cụm tự nhiên là `berhenti sembarangan`.",
          "Luyện: `Jangan berhenti sembarangan.`",
        ],
        pronunciation_focus_en: [
          "bus KO-ta I-tu ber-HEN-ti sem-ba-RANG-an di TE-ngah JA-lan - `berhenti sembarangan` = stop wherever/irresponsibly.",
          "VN-speaker trap: translating 'random stop' as `berhenti bingung`. Natural Indonesian is `berhenti sembarangan`.",
          "Drill: `Jangan berhenti sembarangan.`",
        ],
      },
      {
        en: "Rute yang dilewati tidak sesuai dengan aplikasi.",
        vi: "Tuyến đường đi qua không khớp với ứng dụng.",
        pronunciation_focus: [
          "RU-te yang di-LE-wat-i ti-DAK se-SU-ai DE-ngan a-pli-KA-si - `rute` = tuyến đường; `tidak sesuai` = không phù hợp/không khớp.",
          "Lỗi người Việt: dùng `sama` cho văn khiếu nại. Cụm chuẩn hơn là `sesuai dengan aplikasi`.",
          "Luyện: `Rutenya tidak sesuai.`",
        ],
        pronunciation_focus_en: [
          "ROO-te yang di-LE-wat-i ti-DAK se-SU-ai DE-ngan ap-lee-KA-see - `rute` = route; `tidak sesuai` = does not match/is not appropriate.",
          "VN-speaker trap: using casual `sama` in a complaint. More standard: `sesuai dengan aplikasi`.",
          "Drill: `Rutenya tidak sesuai.`",
        ],
      },
      {
        en: "Saya turun di halte, tapi sopir tidak mau berhenti.",
        vi: "Tôi xuống ở trạm dừng, nhưng tài xế không chịu dừng.",
        pronunciation_focus: [
          "SA-ya TU-run di HAL-te, TA-pi SO-pir ti-DAK MAU ber-HEN-ti - `turun di halte` = xuống ở trạm; `tidak mau` = không chịu.",
          "Lỗi người Việt: dùng `ke halte` khi đang nói vị trí xuống. Điểm xuống cố định dùng `di halte`.",
          "Luyện: `Saya mau turun di halte.`",
        ],
        pronunciation_focus_en: [
          "SA-ya TOO-run di HAL-te, TA-pi SO-pir ti-DAK MAU ber-HEN-ti - `turun di halte` = get off at the stop; `tidak mau` = refused/would not.",
          "VN-speaker trap: using `ke halte` when stating the stop location. A fixed drop-off point uses `di halte`.",
          "Drill: `Saya mau turun di halte.`",
        ],
      },
      {
        en: "Barang saya hilang di dalam bus.",
        vi: "Đồ của tôi bị mất trong xe buýt.",
        pronunciation_focus: [
          "BA-rang SA-ya HI-lang di DA-lam bus - `barang hilang` = đồ bị mất; `di dalam bus` = trong xe buýt.",
          "Lỗi người Việt: nói `barang saya kalah`. `Kalah` là thua; đồ mất là `hilang`.",
          "Luyện: `Barang saya hilang.`",
        ],
        pronunciation_focus_en: [
          "BA-rang SA-ya HI-lang di DA-lam bus - `barang hilang` = lost item; `di dalam bus` = inside the bus.",
          "VN-speaker trap: saying `barang saya kalah`. `Kalah` means lose a game; an item is `hilang`.",
          "Drill: `Barang saya hilang.`",
        ],
      },
      {
        en: "Apakah ada layanan barang hilang untuk penumpang?",
        vi: "Có dịch vụ đồ thất lạc cho hành khách không?",
        pronunciation_focus: [
          "A-pa-kah A-da la-YA-nan BA-rang HI-lang UN-tuk pe-NUM-pang - `layanan barang hilang` = dịch vụ đồ thất lạc.",
          "Lỗi người Việt: dịch `lost and found` sang tiếng Anh trong câu. Ở quầy, nói rõ `layanan barang hilang`.",
          "Luyện: `Ada layanan barang hilang?`",
        ],
        pronunciation_focus_en: [
          "A-pa-kah A-da la-YA-nan BA-rang HI-lang UN-tuk pe-NUM-pang - `layanan barang hilang` = lost-item service.",
          "VN-speaker trap: switching to English `lost and found`. At the counter, say `layanan barang hilang` clearly.",
          "Drill: `Ada layanan barang hilang?`",
        ],
      },
      {
        en: "Sopir membawa kendaraan terlalu cepat dan membuat penumpang takut.",
        vi: "Tài xế chạy xe quá nhanh và làm hành khách sợ.",
        pronunciation_focus: [
          "SO-pir mem-BA-wa ken-da-RA-an ter-LA-lu CE-pat dan mem-BU-at pe-NUM-pang TA-kut - `terlalu cepat` = quá nhanh.",
          "Lỗi người Việt: nói `sopir jalan cepat`. Tài xế điều khiển phương tiện là `membawa kendaraan` hoặc nói gọn `ngebut`.",
          "Luyện: `Sopirnya terlalu cepat.`",
        ],
        pronunciation_focus_en: [
          "SO-pir mem-BA-wa ken-da-RA-an ter-LA-lu CE-pat dan mem-BU-at pe-NUM-pang TA-kut - `terlalu cepat` = too fast.",
          "VN-speaker trap: saying `sopir jalan cepat`. A driver operates a vehicle: `membawa kendaraan`, or casually `ngebut`.",
          "Drill: `Sopirnya terlalu cepat.`",
        ],
      },
      {
        en: "Kondektur meminta tarif dua kali.",
        vi: "Phụ xe/nhân viên thu vé yêu cầu trả tiền vé hai lần.",
        pronunciation_focus: [
          "kon-DEK-tur me-MIN-ta TA-rif DU-a KA-li - `kondektur` = phụ xe/người thu vé; `dua kali` = hai lần.",
          "Lỗi người Việt: gọi mọi nhân viên là `pegawai`. Trên xe buýt/angkot, người thu vé có thể gọi là `kondektur`.",
          "Luyện: `Saya sudah bayar tarif.`",
        ],
        pronunciation_focus_en: [
          "kon-DEK-tur me-MIN-ta TA-rif DOO-a KA-li - `kondektur` = conductor/fare collector; `dua kali` = twice.",
          "VN-speaker trap: calling every staff member `pegawai`. On buses/angkot, the fare collector can be `kondektur`.",
          "Drill: `Saya sudah bayar tarif.`",
        ],
      },
      {
        en: "Saya sudah bayar, tapi tidak diberi karcis.",
        vi: "Tôi đã trả tiền, nhưng không được đưa vé giấy.",
        pronunciation_focus: [
          "SA-ya SU-dah BA-yar, TA-pi ti-DAK di-BE-ri KAR-cis - `karcis` = vé giấy; `diberi` = được đưa/cho.",
          "Lỗi người Việt: dùng `tiket` cho mọi vé. `Tiket` đúng, nhưng vé nhỏ trên xe/điểm vào thường là `karcis`.",
          "Luyện: `Saya tidak diberi karcis.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah BA-yar, TA-pi ti-DAK di-BE-ri KAR-chis - `karcis` = paper ticket; `diberi` = was given.",
          "VN-speaker trap: using `tiket` for every ticket. It is correct, but small paper transit/entry tickets are often `karcis`.",
          "Drill: `Saya tidak diberi karcis.`",
        ],
      },
      {
        en: "Saya ingin melaporkan sopir yang kasar kepada penumpang.",
        vi: "Tôi muốn báo cáo tài xế thô lỗ với hành khách.",
        pronunciation_focus: [
          "SA-ya IN-gin me-la-POR-kan SO-pir yang KA-sar ke-PA-da pe-NUM-pang - `melaporkan` = báo cáo/tố cáo; `kasar` = thô lỗ.",
          "Lỗi người Việt: nói `sopir jahat` khi ý là thô lỗ. `Jahat` = ác; thái độ bất lịch sự là `kasar`.",
          "Luyện: `Saya ingin melaporkan sopir.`",
        ],
        pronunciation_focus_en: [
          "SA-ya IN-gin me-la-POR-kan SO-pir yang KA-sar ke-PA-da pe-NUM-pang - `melaporkan` = report; `kasar` = rude/rough.",
          "VN-speaker trap: saying `sopir jahat` when you mean rude. `Jahat` = evil; rude behavior is `kasar`.",
          "Drill: `Saya ingin melaporkan sopir.`",
        ],
      },
      {
        en: "Nomor kendaraan dan jam kejadian sudah saya catat.",
        vi: "Tôi đã ghi lại biển/số xe và giờ xảy ra sự việc.",
        pronunciation_focus: [
          "NO-mor ken-da-RA-an dan jam ke-JA-di-an SU-dah SA-ya CA-tat - `nomor kendaraan` = số xe/biển xe; `jam kejadian` = giờ xảy ra.",
          "Lỗi người Việt: chỉ nói cảm xúc khi khiếu nại. Ở Indonesia, thêm `nomor kendaraan`, `rute`, `jam kejadian` giúp xử lý nhanh hơn.",
          "Luyện: `Nomor kendaraan sudah saya catat.`",
        ],
        pronunciation_focus_en: [
          "NO-mor ken-da-RA-an dan jam ke-JA-dee-an SOO-dah SA-ya CA-tat - `nomor kendaraan` = vehicle number/plate; `jam kejadian` = time of incident.",
          "VN-speaker trap: only describing feelings in a complaint. Add `nomor kendaraan`, `rute`, `jam kejadian` for faster handling.",
          "Drill: `Nomor kendaraan sudah saya catat.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `angkot` là xe minibus chạy tuyến ngắn, thường dừng linh hoạt hơn bus kota. Vì vậy khi khiếu nại, hãy ghi rõ loại xe, rute, nomor kendaraan, jam kejadian, lokasi, tarif yang diminta, và nếu có, karcis hoặc foto. Khi nói với petugas, giữ giọng lịch sự: `Saya mau mengajukan keluhan`, rồi nêu sự việc ngắn gọn.",
    cultural_notes_en:
      "`Angkot` in Indonesia are shared minibuses on short routes and often stop more flexibly than city buses. For a complaint, record the vehicle type, route, vehicle number, time of incident, location, fare requested, and if available, the ticket or photo. With staff, keep the tone polite: `Saya mau mengajukan keluhan`, then state the issue briefly.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt `tarif` (cước/vé), `rute` (tuyến), `sopir` (tài xế), `kondektur` (người thu vé/phụ xe), `penumpang` (hành khách), `keluhan` (khiếu nại). Trong câu khiếu nại, thể bị động `di-` rất thường gặp: `diberi karcis`, `dilewati`, `diminta`, `diturunkan`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: distinguish `tarif` (fare), `rute` (route), `sopir` (driver), `kondektur` (fare collector/conductor), `penumpang` (passenger), and `keluhan` (complaint). Complaint sentences often use passive `di-`: `diberi karcis`, `dilewati`, `diminta`, `diturunkan`.",
    vocabulary: [
      { word: "angkot", en: "shared minibus", vi: "xe minibus tuyến ngắn", pos: "noun", pronunciation_vi: "ANG-kot", pronunciation_en: "ANG-kot" },
      { word: "bus kota", en: "city bus", vi: "xe buýt thành phố", pos: "noun phrase", pronunciation_vi: "bus KO-ta", pronunciation_en: "bus KO-ta" },
      { word: "sopir", en: "driver", vi: "tài xế", pos: "noun", pronunciation_vi: "SO-pir", pronunciation_en: "SO-peer" },
      { word: "tarif", en: "fare", vi: "cước / giá vé", pos: "noun", pronunciation_vi: "TA-rif", pronunciation_en: "TA-rif" },
      { word: "rute", en: "route", vi: "tuyến đường", pos: "noun", pronunciation_vi: "RU-te", pronunciation_en: "ROO-te" },
      { word: "berhenti sembarangan", en: "stop carelessly / anywhere", vi: "dừng tùy tiện", pos: "verb phrase", pronunciation_vi: "ber-HEN-ti sem-ba-RANG-an", pronunciation_en: "ber-HEN-ti sem-ba-RANG-an" },
      { word: "barang hilang", en: "lost item", vi: "đồ thất lạc", pos: "noun phrase", pronunciation_vi: "BA-rang HI-lang", pronunciation_en: "BA-rang HI-lang" },
      { word: "keluhan penumpang", en: "passenger complaint", vi: "khiếu nại của hành khách", pos: "noun phrase", pronunciation_vi: "ke-LUH-an pe-NUM-pang", pronunciation_en: "ke-LOOH-an pe-NUM-pang" },
      { word: "kondektur", en: "conductor / fare collector", vi: "phụ xe / người thu vé", pos: "noun", pronunciation_vi: "kon-DEK-tur", pronunciation_en: "kon-DEK-toor" },
      { word: "karcis", en: "paper ticket", vi: "vé giấy", pos: "noun", pronunciation_vi: "KAR-cis", pronunciation_en: "KAR-chis" },
      { word: "nomor kendaraan", en: "vehicle number / plate", vi: "số xe / biển xe", pos: "noun phrase", pronunciation_vi: "NO-mor ken-da-RA-an", pronunciation_en: "NO-mor ken-da-RA-an" },
      { word: "jam kejadian", en: "time of incident", vi: "giờ xảy ra sự việc", pos: "noun phrase", pronunciation_vi: "jam ke-JA-di-an", pronunciation_en: "jam ke-JA-dee-an" },
    ],
    dialogue: [
      {
        speaker: "Penumpang",
        text: "Permisi, saya mau mengajukan keluhan tentang bus kota.",
        vi: "Xin phép, tôi muốn gửi khiếu nại về xe buýt thành phố.",
        en: "Excuse me, I want to submit a complaint about a city bus.",
      },
      {
        speaker: "Petugas",
        text: "Baik. Apa masalahnya, dan nomor kendaraannya berapa?",
        vi: "Được. Vấn đề là gì, và số xe là bao nhiêu?",
        en: "Okay. What was the issue, and what was the vehicle number?",
      },
      {
        speaker: "Penumpang",
        text: "Sopir berhenti sembarangan dan saya tidak diberi karcis.",
        vi: "Tài xế dừng tùy tiện và tôi không được đưa vé giấy.",
        en: "The driver stopped carelessly and I was not given a ticket.",
      },
      {
        speaker: "Petugas",
        text: "Tolong tulis rute, jam kejadian, dan lokasi kejadian di formulir ini.",
        vi: "Làm ơn ghi tuyến, giờ xảy ra và địa điểm xảy ra vào mẫu này.",
        en: "Please write the route, time, and incident location on this form.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng về khiếu nại giao thông công cộng:",
        instruction_en: "Fill in the right public-transport complaint word:",
        items: [
          {
            prompt: "Sopir angkot menaikkan ___ tanpa pemberitahuan. (giá vé/cước)",
            answer: "tarif",
            options: ["tarif", "tenda", "tanda"],
          },
          {
            prompt: "Bus kota itu berhenti ___ di tengah jalan. (tùy tiện)",
            answer: "sembarangan",
            options: ["sembarangan", "sekarang", "sendirian"],
          },
          {
            prompt: "Barang saya ___ di dalam bus. (bị mất)",
            answer: "hilang",
            options: ["hilang", "hijau", "hidup"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối cụm tiếng Indonesia với nghĩa tiếng Việt:",
        instruction_en: "Match each Indonesian phrase with its Vietnamese meaning:",
        items: [
          { prompt: "keluhan penumpang", answer: "khiếu nại của hành khách" },
          { prompt: "nomor kendaraan", answer: "số xe / biển xe" },
          { prompt: "rute tidak sesuai", answer: "tuyến không khớp" },
          { prompt: "tidak diberi karcis", answer: "không được đưa vé giấy" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn gửi khiếu nại với tư cách hành khách.", answer: "Saya mau mengajukan keluhan sebagai penumpang." },
          { prompt: "Xe buýt dừng tùy tiện giữa đường.", answer: "Bus berhenti sembarangan di tengah jalan." },
          { prompt: "Tôi đã ghi lại số xe và giờ xảy ra sự việc.", answer: "Nomor kendaraan dan jam kejadian sudah saya catat." },
        ],
      },
    ],
  },
];

export default lessons;
