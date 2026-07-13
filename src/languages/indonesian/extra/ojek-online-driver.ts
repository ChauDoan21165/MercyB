// Ojek online driver Indonesian for Vietnamese learners.
//
// A1 Wave 9 file. Covers the driver side of Grab/Gojek work: daftar, orderan,
// rating, cancel, tips, and penghasilan. Self-contained so no registry or
// sibling agent files are touched.

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

export const ojekOnlineDriverLessons: IndonesianLesson[] = [
  {
    id: "indonesian_ojek_driver_registration",
    level: "A2",
    category: "work",
    title_vi: "Đăng ký làm tài xế ojek online",
    title_en: "Registering as an ojek online driver",
    sentences: [
      {
        en: "Saya mau daftar jadi driver Gojek.",
        vi: "Tôi muốn đăng ký làm tài xế Gojek.",
        pronunciation_focus: [
          "SA-ya mau DAF-tar JA-di DRAI-ver GO-jek — `daftar` = đăng ký; `jadi` = trở thành/làm.",
          "Lỗi người Việt: đọc `Gojek` như 'gô-dét'. Âm `j` Indonesia gần 'dj' trong 'jeans'.",
          "Mẫu nghề nghiệp: `Saya mau daftar jadi ...` = Tôi muốn đăng ký làm ...",
        ],
        pronunciation_focus_en: [
          "SA-ya mau DAF-tar JAH-dee DRAI-ver GO-jek — `daftar` = register; `jadi` = become/work as.",
          "VN-speaker trap: making `Gojek` too Vietnamese. Indonesian `j` is like English `j` in 'jeans'.",
          "Work frame: `Saya mau daftar jadi ...` = I want to register as ...",
        ],
      },
      {
        en: "Dokumen yang dibutuhkan KTP, SIM, dan STNK.",
        vi: "Giấy tờ cần có là KTP, bằng lái, và giấy đăng ký xe.",
        pronunciation_focus: [
          "do-KU-men yang di-BU-tuh-kan ka-te-PE, SIM, dan es-te-en-KA — `dibutuhkan` = được cần/cần có.",
          "`KTP` là chứng minh thư/căn cước Indonesia; `SIM` là bằng lái; `STNK` là giấy đăng ký xe.",
          "Lỗi người Việt: nhầm `SIM` với sim điện thoại. Trong giấy tờ lái xe, `SIM` = bằng lái.",
        ],
        pronunciation_focus_en: [
          "do-KOO-men yang dee-BOO-tooh-kan ka-te-PE, SIM, dan es-te-en-KA — `dibutuhkan` = required/needed.",
          "`KTP` is Indonesian ID; `SIM` is a driver's license; `STNK` is vehicle registration.",
          "VN-speaker trap: confusing `SIM` with a phone SIM card. In driver documents, `SIM` = license.",
        ],
      },
      {
        en: "Motor saya harus dalam kondisi baik.",
        vi: "Xe máy của tôi phải ở trong tình trạng tốt.",
        pronunciation_focus: [
          "MO-tor SA-ya HA-rus DA-lam kon-DI-si BA-ik — `motor` = xe máy, không phải ô tô.",
          "`harus` = phải; `dalam kondisi baik` = trong tình trạng tốt.",
          "Lỗi người Việt: dịch 'xe máy' thành `sepeda motor` mọi lúc. Trong đời thường, `motor` là đủ.",
        ],
        pronunciation_focus_en: [
          "MO-tor SA-ya HA-roos DA-lam kon-DEE-see BA-ik — `motor` = motorbike, not car.",
          "`harus` = must; `dalam kondisi baik` = in good condition.",
          "VN-speaker trap: always saying `sepeda motor`. In daily speech, `motor` is enough.",
        ],
      },
      {
        en: "Saya ikut pelatihan singkat sebelum aktif.",
        vi: "Tôi tham gia buổi đào tạo ngắn trước khi hoạt động.",
        pronunciation_focus: [
          "SA-ya I-kut pe-la-TI-han SING-kat se-BE-lum AK-tif — `pelatihan` = đào tạo.",
          "`sebelum aktif` = trước khi bắt đầu hoạt động/nhận chuyến.",
          "Lỗi người Việt: bỏ `ikut`. Với lớp/buổi đào tạo, `ikut pelatihan` nghe tự nhiên.",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-koot pe-la-TEE-han SING-kat se-BE-loom AK-tif — `pelatihan` = training.",
          "`sebelum aktif` = before becoming active/starting rides.",
          "VN-speaker trap: dropping `ikut`. For training sessions, `ikut pelatihan` sounds natural.",
        ],
      },
      {
        en: "Akun driver saya sudah aktif hari ini.",
        vi: "Tài khoản tài xế của tôi đã hoạt động hôm nay.",
        pronunciation_focus: [
          "A-kun DRAI-ver SA-ya SU-dah AK-tif HA-ri I-ni — `akun` = tài khoản.",
          "`sudah aktif` = đã kích hoạt/đang hoạt động; dùng nhiều trong app.",
          "Lỗi người Việt: nói `account` trong câu Indonesia. `akun` là từ mượn đã Indonesia hóa.",
        ],
        pronunciation_focus_en: [
          "AH-koon DRAI-ver SA-ya SOO-dah AK-tif HA-ree EE-nee — `akun` = account.",
          "`sudah aktif` = already active/activated; common in app contexts.",
          "VN-speaker trap: saying English `account` inside Indonesian. `akun` is the localized loanword.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, tài xế xe công nghệ thường gọi là `driver ojol` hoặc `driver ojek online`. Gojek và Grab đều có quy trình đăng ký, kiểm tra giấy tờ, kiểm tra xe, và kích hoạt tài khoản. Những giấy tờ như KTP, SIM, STNK là từ khóa rất thực tế nếu bạn hỗ trợ bạn bè/người thân đăng ký. `Ojol` là viết tắt thân mật của `ojek online`; trong văn bản chính thức nên dùng `ojek online` hoặc `mitra driver`.",
    cultural_notes_en:
      "In Indonesia, app-based motorbike drivers are often called `driver ojol` or `driver ojek online`. Gojek and Grab both have registration, document checks, vehicle checks, and account activation. Documents such as KTP, SIM, and STNK are practical keywords if you help friends or family register. `Ojol` is the casual abbreviation of `ojek online`; in formal writing, use `ojek online` or `mitra driver`.",
    tip_advice_vi:
      "Bộ câu đăng ký: `Saya mau daftar jadi driver ...`, `Dokumen yang dibutuhkan ...`, `Akun driver saya sudah aktif`. Bẫy người Việt: `motor` ở Indonesia thường nghĩa là xe máy, còn ô tô là `mobil`. Khi nói giấy tờ, nhớ `SIM` = bằng lái, không phải SIM điện thoại.",
    tip_advice_en:
      "Registration set: `Saya mau daftar jadi driver ...`, `Dokumen yang dibutuhkan ...`, `Akun driver saya sudah aktif`. VN-speaker trap: Indonesian `motor` usually means motorbike, while car is `mobil`. For documents, remember `SIM` = driver's license, not a phone SIM.",
    vocabulary: [
      { cell_id: "d885dd77-1235-4bc5-8d61-18a844c5bc2f", word: "daftar", en: "to register", vi: "đăng ký", pos: "verb", pronunciation_vi: "DAF-tar", pronunciation_en: "DAF-tar" },
      { cell_id: "7a3e88ad-680e-4a81-8b8d-b12984740021", word: "driver", en: "driver", vi: "tài xế", pos: "noun", pronunciation_vi: "DRAI-ver", pronunciation_en: "DRAI-ver" },
      { cell_id: "dec7f346-53c1-497e-a404-c6485cc3cb52", word: "ojek online", en: "app-based motorbike taxi", vi: "xe ôm công nghệ", pos: "noun", pronunciation_vi: "O-jek ON-lain", pronunciation_en: "OH-jek ON-line" },
      { cell_id: "deaf1da7-b917-4dda-8001-7316984c8bdf", word: "KTP", en: "Indonesian ID card", vi: "căn cước Indonesia", pos: "noun", pronunciation_vi: "ka-te-PE", pronunciation_en: "ka-te-PE" },
      { cell_id: "8bcb0c89-845a-40c8-81fe-94633ea382e3", word: "SIM", en: "driver's license", vi: "bằng lái", pos: "noun", pronunciation_vi: "SIM", pronunciation_en: "SIM" },
      { cell_id: "4ad85676-23ae-43d7-a46f-9cea76d1dc41", word: "STNK", en: "vehicle registration", vi: "giấy đăng ký xe", pos: "noun", pronunciation_vi: "es-te-en-KA", pronunciation_en: "es-te-en-KA" },
      { cell_id: "cc96c400-b544-40bf-8c55-b04afea6b4fd", word: "akun", en: "account", vi: "tài khoản", pos: "noun", pronunciation_vi: "A-kun", pronunciation_en: "AH-koon" },
    ],
    dialogue: [
      { cell_id: "93c22b58-3cf7-432d-8a96-f2edb1a5f7d5", speaker: "Calon driver", text: "Saya mau daftar jadi driver GrabBike. Dokumennya apa saja?", vi: "Tôi muốn đăng ký làm tài xế GrabBike. Cần những giấy tờ gì?", en: "I want to register as a GrabBike driver. What documents are needed?" },
      { cell_id: "4a7e094e-c8fc-46ca-97cd-4e059bf69679", speaker: "Petugas", text: "Siapkan KTP, SIM, STNK, dan foto motor.", vi: "Chuẩn bị KTP, bằng lái, giấy đăng ký xe, và ảnh xe máy.", en: "Prepare your ID, driver's license, vehicle registration, and a photo of the motorbike." },
      { cell_id: "852795d4-efbd-4087-85a4-f3cd228a4089", speaker: "Calon driver", text: "Baik, motor saya dalam kondisi baik.", vi: "Vâng, xe máy của tôi ở trong tình trạng tốt.", en: "Okay, my motorbike is in good condition." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối giấy tờ với nghĩa.",
        instruction_en: "Match the document to its meaning.",
        items: [
          { prompt: "KTP", answer: "căn cước Indonesia" },
          { prompt: "SIM", answer: "bằng lái" },
          { prompt: "STNK", answer: "giấy đăng ký xe" },
        ],
      },
    ],
  },
  {
    id: "indonesian_ojek_driver_orders_rating",
    level: "A2",
    category: "work",
    title_vi: "Nhận order, hủy chuyến và rating",
    title_en: "Taking orders, cancellations and ratings",
    sentences: [
      {
        en: "Saya sedang menunggu orderan masuk.",
        vi: "Tôi đang chờ đơn chuyến vào.",
        pronunciation_focus: [
          "SA-ya se-DANG me-NUNG-gu or-DER-an MA-suk — `orderan masuk` = đơn/chuyến xuất hiện trong app.",
          "`sedang` = đang; dùng khi mô tả việc đang diễn ra.",
          "Lỗi người Việt: nói `pesanan masuk` cũng hiểu, nhưng tài xế hay nói `orderan masuk`.",
        ],
        pronunciation_focus_en: [
          "SA-ya se-DANG me-NOONG-goo or-DER-an MA-sook — `orderan masuk` = an order/ride comes in through the app.",
          "`sedang` = currently; used for an action in progress.",
          "VN-speaker trap: `pesanan masuk` is understandable, but drivers often say `orderan masuk`.",
        ],
      },
      {
        en: "Saya ambil orderan yang dekat dulu.",
        vi: "Tôi nhận đơn gần trước.",
        pronunciation_focus: [
          "SA-ya AM-bil or-DER-an yang DE-kat DU-lu — `ambil orderan` = nhận đơn/chuyến.",
          "`yang dekat` = cái/chuyến gần; `dulu` = trước đã.",
          "Lỗi người Việt: dịch 'nhận đơn' thành `terima orderan` mọi lúc. Trong khẩu ngữ tài xế, `ambil orderan` rất tự nhiên.",
        ],
        pronunciation_focus_en: [
          "SA-ya AM-bil or-DER-an yang DEH-kat DOO-loo — `ambil orderan` = take an order/ride.",
          "`yang dekat` = the nearby one; `dulu` = first/for now.",
          "VN-speaker trap: always translating 'accept order' as `terima orderan`. Driver speech often uses `ambil orderan`.",
        ],
      },
      {
        en: "Penumpang minta dijemput di gerbang utama.",
        vi: "Hành khách yêu cầu được đón ở cổng chính.",
        pronunciation_focus: [
          "pe-NUM-pang MIN-ta di-JEM-put di GER-bang u-TA-ma — `penumpang` = hành khách.",
          "`dijemput` = được đón; bị động rất hay dùng khi nói từ góc nhìn hành khách.",
          "Lỗi người Việt: quên tiền tố `di-`. `minta dijemput` = yêu cầu được đón, không phải tự đi đón.",
        ],
        pronunciation_focus_en: [
          "pe-NOOM-pang MIN-ta dee-JEM-poot di GER-bang oo-TA-ma — `penumpang` = passenger.",
          "`dijemput` = be picked up; passive voice is common from the passenger viewpoint.",
          "VN-speaker trap: dropping `di-`. `minta dijemput` = asks to be picked up, not asks to pick someone up.",
        ],
      },
      {
        en: "Jangan cancel kalau tidak darurat.",
        vi: "Đừng hủy nếu không khẩn cấp.",
        pronunciation_focus: [
          "JA-ngan KEN-sel KA-lau TI-dak da-RU-rat — `cancel` = hủy trong ngôn ngữ app.",
          "`jangan` = đừng; `kalau` = nếu/khi.",
          "Lỗi người Việt: dùng `batal` một mình. Trong app, động từ vay mượn `cancel` rất phổ biến; dạng chuẩn hơn là `membatalkan`.",
        ],
        pronunciation_focus_en: [
          "JA-ngan KEN-sel KA-lau TEE-dak da-ROO-rat — `cancel` = cancel in app language.",
          "`jangan` = don't; `kalau` = if/when.",
          "VN-speaker trap: using bare `batal`. In apps, the loan verb `cancel` is common; the more standard form is `membatalkan`.",
        ],
      },
      {
        en: "Rating saya turun karena banyak cancel.",
        vi: "Rating của tôi giảm vì hủy nhiều chuyến.",
        pronunciation_focus: [
          "RA-ting SA-ya TU-run ka-RE-na BA-nyak KEN-sel — `rating turun` = điểm đánh giá giảm.",
          "`karena` = vì; đặt trước nguyên nhân.",
          "Lỗi người Việt: dùng `jatuh` cho rating. `turun` nghe tự nhiên hơn khi điểm/số giảm.",
        ],
        pronunciation_focus_en: [
          "RA-ting SA-ya TOO-roon ka-REH-na BA-nyak KEN-sel — `rating turun` = rating drops.",
          "`karena` = because; it introduces the cause.",
          "VN-speaker trap: using `jatuh` for ratings. `turun` is more natural when numbers/scores decrease.",
        ],
      },
      {
        en: "Saya selalu ramah supaya dapat rating bagus.",
        vi: "Tôi luôn thân thiện để được rating tốt.",
        pronunciation_focus: [
          "SA-ya se-LA-lu RA-mah su-PA-ya DA-pat RA-ting BA-gus — `ramah` = thân thiện.",
          "`supaya` = để/nhằm; nối hành động với mục đích.",
          "Lỗi người Việt: nói `untuk dapat rating bagus` vẫn được, nhưng `supaya dapat ...` tự nhiên hơn trong câu đầy đủ.",
        ],
        pronunciation_focus_en: [
          "SA-ya se-LA-loo RA-mah soo-PA-ya DA-pat RA-ting BA-goos — `ramah` = friendly.",
          "`supaya` = so that/in order to; connects action and purpose.",
          "VN-speaker trap: `untuk dapat rating bagus` is okay, but `supaya dapat ...` sounds more natural in a full sentence.",
        ],
      },
    ],
    cultural_notes_vi:
      "Với tài xế Grab/Gojek, `orderan` là nhịp sống: chờ order vào, nhận chuyến gần, giao đồ ăn, chở khách. Rating ảnh hưởng trực tiếp tới khả năng nhận chuyến và thu nhập. Hủy chuyến (`cancel`) nhiều có thể làm tài khoản bị cảnh báo hoặc giảm ưu tiên. Tài xế thường cố nhắn khách ngắn gọn, lịch sự: hỏi điểm đón, xác nhận điểm đến, báo đã tới, xin khách chờ.",
    cultural_notes_en:
      "For Grab/Gojek drivers, `orderan` is the rhythm of work: waiting for orders, taking nearby rides, delivering food, carrying passengers. Ratings directly affect access to rides and income. Too many cancellations (`cancel`) can trigger account warnings or lower priority. Drivers usually message passengers briefly and politely: ask pickup point, confirm destination, say they have arrived, ask the passenger to wait.",
    tip_advice_vi:
      "Cụm tài xế dùng nhiều: `orderan masuk`, `ambil orderan`, `penumpang minta dijemput`, `rating turun`, `rating bagus`. Bẫy ngữ pháp lớn là bị động `di-`: `dijemput` = được đón, `diantar` = được chở đến.",
    tip_advice_en:
      "Driver phrases: `orderan masuk`, `ambil orderan`, `penumpang minta dijemput`, `rating turun`, `rating bagus`. The big grammar trap is passive `di-`: `dijemput` = be picked up, `diantar` = be taken somewhere.",
    vocabulary: [
      { cell_id: "d79444a7-2e2f-4fa7-adb1-2b5ebf6d556c", word: "orderan", en: "order/ride request", vi: "đơn/chuyến đặt", pos: "noun", pronunciation_vi: "or-DER-an", pronunciation_en: "or-DER-an" },
      { cell_id: "7a572210-709b-4624-a352-592f236f05e1", word: "ambil orderan", en: "take an order", vi: "nhận đơn/chuyến", pos: "verb phrase", pronunciation_vi: "AM-bil or-DER-an", pronunciation_en: "AM-bil or-DER-an" },
      { cell_id: "9c8f3564-cc75-4e1f-8439-941535127102", word: "penumpang", en: "passenger", vi: "hành khách", pos: "noun", pronunciation_vi: "pe-NUM-pang", pronunciation_en: "pe-NOOM-pang" },
      { cell_id: "613106ed-27a8-4312-b894-3608fac518fb", word: "dijemput", en: "picked up", vi: "được đón", pos: "passive verb", pronunciation_vi: "di-JEM-put", pronunciation_en: "dee-JEM-poot" },
      { cell_id: "bd6344f4-2739-4f3a-851f-87fc62d89867", word: "cancel", en: "to cancel", vi: "hủy", pos: "verb", pronunciation_vi: "KEN-sel", pronunciation_en: "KAN-sel" },
      { cell_id: "11be21d8-14e2-4b95-9654-e645f3a9fab1", word: "rating turun", en: "rating drops", vi: "rating giảm", pos: "phrase", pronunciation_vi: "RA-ting TU-run", pronunciation_en: "RA-ting TOO-roon" },
      { cell_id: "109c2127-865b-456a-8d51-fda0250f85bc", word: "ramah", en: "friendly", vi: "thân thiện", pos: "adjective", pronunciation_vi: "RA-mah", pronunciation_en: "RA-mah" },
    ],
    dialogue: [
      { cell_id: "5d61670f-318e-4770-93a0-3c507a580a9f", speaker: "Driver A", text: "Hari ini orderan masuk terus, tapi banyak yang jauh.", vi: "Hôm nay đơn vào liên tục, nhưng nhiều đơn xa.", en: "Orders keep coming in today, but many are far away." },
      { cell_id: "c634a82c-f326-4276-aa8b-f965ff514e79", speaker: "Driver B", text: "Aku ambil yang dekat dulu. Rating jangan sampai turun.", vi: "Tôi nhận đơn gần trước. Đừng để rating bị giảm.", en: "I take the nearby ones first. Do not let the rating drop." },
      { cell_id: "de44883f-02c1-4a5a-9e11-d850fb3c604c", speaker: "Driver A", text: "Betul. Jangan cancel kalau tidak darurat.", vi: "Đúng. Đừng hủy nếu không khẩn cấp.", en: "Right. Do not cancel unless it is urgent." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng.",
        instruction_en: "Fill in the correct word.",
        items: [
          { prompt: "Saya sedang menunggu ___ masuk.", answer: "orderan" },
          { prompt: "Rating saya ___ karena banyak cancel.", answer: "turun" },
          { prompt: "Penumpang minta ___ di gerbang utama.", answer: "dijemput" },
        ],
      },
    ],
  },
  {
    id: "indonesian_ojek_driver_income_tips",
    level: "B1",
    category: "work",
    title_vi: "Tiền tip, thu nhập và ngày làm việc",
    title_en: "Tips, income and the workday",
    sentences: [
      {
        en: "Penghasilan driver tergantung jumlah orderan.",
        vi: "Thu nhập của tài xế phụ thuộc vào số lượng đơn.",
        pronunciation_focus: [
          "peng-ha-SIL-an DRAI-ver ter-GAN-tung JUM-lah or-DER-an — `penghasilan` = thu nhập.",
          "`tergantung` = phụ thuộc vào; đi với danh từ sau đó.",
          "Lỗi người Việt: dùng `gaji` cho mọi thu nhập. Tài xế app thường nói `penghasilan` vì thu nhập biến động.",
        ],
        pronunciation_focus_en: [
          "peng-ha-SEEL-an DRAI-ver ter-GAN-toong JOOM-lah or-DER-an — `penghasilan` = income/earnings.",
          "`tergantung` = depends on; followed by the factor.",
          "VN-speaker trap: using `gaji` for all income. App drivers often say `penghasilan` because earnings vary.",
        ],
      },
      {
        en: "Kalau ramai, saya bisa dapat lebih banyak.",
        vi: "Nếu đông khách, tôi có thể kiếm được nhiều hơn.",
        pronunciation_focus: [
          "KA-lau RA-mai, SA-ya BI-sa DA-pat LE-bih BA-nyak — `ramai` = đông/nhộn nhịp.",
          "`dapat` trong ngữ cảnh tiền = kiếm được/nhận được.",
          "Lỗi người Việt: dịch 'kiếm tiền' luôn thành `mencari uang`. Với thu nhập trong ngày, `dapat` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "KA-lau RA-mai, SA-ya BEE-sa DA-pat LEH-bih BA-nyak — `ramai` = busy/crowded.",
          "`dapat` in money context = earn/get.",
          "VN-speaker trap: always translating 'earn money' as `mencari uang`. For daily earnings, `dapat` is natural.",
        ],
      },
      {
        en: "Penumpang memberi tips lewat aplikasi.",
        vi: "Hành khách cho tiền tip qua ứng dụng.",
        pronunciation_focus: [
          "pe-NUM-pang mem-BE-ri tips LE-wat ap-li-KA-si — `memberi` = cho/tặng.",
          "`tips` trong Indonesia thường dùng dạng có `s`, nghĩa là tiền tip/bo.",
          "Lỗi người Việt: đọc `tips` như 'típ-sờ' quá nặng. Nói nhanh, âm cuối nhẹ.",
        ],
        pronunciation_focus_en: [
          "pe-NOOM-pang mem-BEH-ree tips LEH-wat ap-lee-KA-see — `memberi` = give.",
          "`tips` in Indonesian commonly has final `s`, meaning tip/gratuity.",
          "VN-speaker trap: over-pronouncing final `s`. Keep it light.",
        ],
      },
      {
        en: "Saya isi bensin sebelum jam sibuk.",
        vi: "Tôi đổ xăng trước giờ cao điểm.",
        pronunciation_focus: [
          "SA-ya I-si BEN-sin se-BE-lum jam SI-buk — `isi bensin` = đổ xăng.",
          "`jam sibuk` = giờ cao điểm/bận rộn; rất quan trọng với tài xế.",
          "Lỗi người Việt: nói `tambah bensin`. Hiểu được, nhưng `isi bensin` là cụm chuẩn đời thường.",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-see BEN-sin se-BE-loom jam SEE-book — `isi bensin` = fill up with gas/petrol.",
          "`jam sibuk` = rush hour/busy hour; very important for drivers.",
          "VN-speaker trap: saying `tambah bensin`. Understandable, but `isi bensin` is the standard everyday phrase.",
        ],
      },
      {
        en: "Setelah dipotong biaya aplikasi, sisanya masuk dompet driver.",
        vi: "Sau khi bị trừ phí ứng dụng, phần còn lại vào ví tài xế.",
        pronunciation_focus: [
          "se-TE-lah di-PO-tong BI-a-ya ap-li-KA-si, SI-sa-nya MA-suk DOM-pet DRAI-ver — `dipotong` = bị trừ/khấu trừ.",
          "`sisanya` = phần còn lại; `dompet driver` = ví tài xế trong app.",
          "Lỗi người Việt: bỏ bị động `di-`. Với phí bị trừ tự động, `dipotong` chính xác hơn `potong`.",
        ],
        pronunciation_focus_en: [
          "se-TE-lah dee-PO-tong BEE-a-ya ap-lee-KA-see, SEE-sa-nya MA-sook DOM-pet DRAI-ver — `dipotong` = deducted.",
          "`sisanya` = the remainder; `dompet driver` = driver wallet in the app.",
          "VN-speaker trap: dropping passive `di-`. For automatically deducted fees, `dipotong` is more accurate than `potong`.",
        ],
      },
      {
        en: "Target saya hari ini dua ratus ribu rupiah.",
        vi: "Mục tiêu của tôi hôm nay là hai trăm nghìn rupiah.",
        pronunciation_focus: [
          "TAR-get SA-ya HA-ri I-ni DU-a RA-tus RI-bu ru-PI-ah — `target` = mục tiêu.",
          "`dua ratus ribu` = 200.000; số đứng trước `ribu`.",
          "Lỗi người Việt: lẫn `ratus` và `ribu`. `ratus` = trăm; `ribu` = nghìn.",
        ],
        pronunciation_focus_en: [
          "TAR-get SA-ya HA-ree EE-nee DOO-a RA-toos REE-boo roo-PEE-ah — `target` = goal/target.",
          "`dua ratus ribu` = 200,000; the number comes before `ribu`.",
          "VN-speaker trap: mixing up `ratus` and `ribu`. `ratus` = hundred; `ribu` = thousand.",
        ],
      },
    ],
    cultural_notes_vi:
      "Thu nhập tài xế ojek online không cố định như lương tháng. Nó phụ thuộc vào số order, giờ cao điểm, khu vực, phí app, bonus, tips, xăng, bảo dưỡng xe, và hủy chuyến. Nhiều tài xế có mục tiêu ngày (`target harian`) như 150-300 nghìn rupiah tùy thành phố và thời gian làm. Tips qua app hoặc tiền mặt đều được đánh giá cao, nhưng không bắt buộc. Khi nói chuyện, đừng hỏi thu nhập quá trực tiếp nếu chưa thân; hỏi nhẹ hơn: `Hari ini ramai?` hoặc `Orderan banyak?`.",
    cultural_notes_en:
      "Ojek online driver income is not fixed like a monthly salary. It depends on order count, rush hours, area, app fees, bonuses, tips, fuel, bike maintenance, and cancellations. Many drivers have a daily target (`target harian`) such as 150-300 thousand rupiah depending on the city and work hours. Tips through the app or in cash are appreciated but not required. In conversation, avoid asking income too directly unless close; softer questions are `Hari ini ramai?` or `Orderan banyak?`.",
    tip_advice_vi:
      "Phân biệt `gaji` và `penghasilan`: `gaji` thường là lương cố định; `penghasilan` là thu nhập/tiền kiếm được, hợp với tài xế app. Cụm quan trọng: `tergantung jumlah orderan`, `dapat tips`, `isi bensin`, `dipotong biaya aplikasi`, `target harian`. Với tiền Indonesia, luyện `ribu` thật chắc vì giao dịch hằng ngày dùng hàng nghìn.",
    tip_advice_en:
      "Distinguish `gaji` and `penghasilan`: `gaji` is usually fixed salary; `penghasilan` is earnings/income, better for app drivers. Key phrases: `tergantung jumlah orderan`, `dapat tips`, `isi bensin`, `dipotong biaya aplikasi`, `target harian`. For Indonesian money, drill `ribu` because everyday prices use thousands.",
    vocabulary: [
      { cell_id: "a6182223-c141-4b9f-91ca-d4fb16631449", word: "penghasilan", en: "income/earnings", vi: "thu nhập", pos: "noun", pronunciation_vi: "peng-ha-SIL-an", pronunciation_en: "peng-ha-SEEL-an" },
      { cell_id: "5a23d770-e135-4965-850b-38e85a349be8", word: "tergantung", en: "depends on", vi: "phụ thuộc", pos: "verb", pronunciation_vi: "ter-GAN-tung", pronunciation_en: "ter-GAN-toong" },
      { cell_id: "6aba18e2-e758-4335-8038-6eee8289ddf3", word: "ramai", en: "busy/crowded", vi: "đông/nhộn nhịp", pos: "adjective", pronunciation_vi: "RA-mai", pronunciation_en: "RA-mai" },
      { cell_id: "64451d80-d53f-4390-ba4d-de499bf4003d", word: "tips", en: "tip/gratuity", vi: "tiền tip/tiền bo", pos: "noun", pronunciation_vi: "tips", pronunciation_en: "tips" },
      { cell_id: "43485ce7-14fe-4c65-971e-4d2ce77d72d2", word: "isi bensin", en: "fill up with fuel", vi: "đổ xăng", pos: "verb phrase", pronunciation_vi: "I-si BEN-sin", pronunciation_en: "EE-see BEN-sin" },
      { cell_id: "833f6f13-8640-4dbf-ac07-e74fefd4657f", word: "dipotong", en: "deducted", vi: "bị trừ/khấu trừ", pos: "passive verb", pronunciation_vi: "di-PO-tong", pronunciation_en: "dee-PO-tong" },
      { cell_id: "22b2916b-a5d4-4c3a-9850-a64fc996c049", word: "dompet driver", en: "driver wallet", vi: "ví tài xế", pos: "noun", pronunciation_vi: "DOM-pet DRAI-ver", pronunciation_en: "DOM-pet DRAI-ver" },
      { cell_id: "353f200f-2966-4b7b-b84c-024a48d7960f", word: "target harian", en: "daily target", vi: "mục tiêu hằng ngày", pos: "noun", pronunciation_vi: "TAR-get ha-RI-an", pronunciation_en: "TAR-get ha-REE-an" },
    ],
    dialogue: [
      { cell_id: "140fdf74-a430-4506-bd29-965d5620cc60", speaker: "Driver A", text: "Hari ini ramai, penghasilan lumayan.", vi: "Hôm nay đông khách, thu nhập khá ổn.", en: "Today is busy, the income is pretty decent." },
      { cell_id: "4f58638a-0a17-4d36-9f1c-1d84d5985e64", speaker: "Driver B", text: "Bagus. Aku baru isi bensin sebelum jam sibuk.", vi: "Tốt đấy. Tôi vừa đổ xăng trước giờ cao điểm.", en: "Good. I just filled up before rush hour." },
      { cell_id: "02088cf2-5835-48ed-ab03-4d504854b32a", speaker: "Driver A", text: "Semoga dapat tips juga. Targetku dua ratus ribu.", vi: "Hy vọng cũng được tip. Mục tiêu của tôi là hai trăm nghìn.", en: "Hopefully I get tips too. My target is two hundred thousand." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "penghasilan", answer: "thu nhập" },
          { prompt: "isi bensin", answer: "đổ xăng" },
          { prompt: "dipotong biaya aplikasi", answer: "bị trừ phí ứng dụng" },
          { prompt: "target harian", answer: "mục tiêu hằng ngày" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng.",
        instruction_en: "Fill in the correct word.",
        items: [
          { prompt: "Penghasilan driver ___ jumlah orderan.", answer: "tergantung" },
          { prompt: "Saya ___ bensin sebelum jam sibuk.", answer: "isi" },
          { prompt: "Target saya hari ini dua ratus ___ rupiah.", answer: "ribu" },
        ],
      },
    ],
  },
];
