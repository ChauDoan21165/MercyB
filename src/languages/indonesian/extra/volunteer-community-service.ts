// Volunteer Community Service Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// pronunciation/culture notes with English companions in pronunciation_focus_en.

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
    id: "indonesian_volunteer_community_service",
    level: "B1",
    category: "community",
    title_vi: "Tình nguyện, posko và phục vụ cộng đồng",
    title_en: "Volunteering, relief posts, and community service",
    sentences: [
      {
        en: "Saya ingin mendaftar sebagai relawan komunitas.",
        vi: "Tôi muốn đăng ký làm tình nguyện viên cộng đồng.",
        pronunciation_focus: [
          "SA-ya IN-gin men-DAF-tar se-BA-gai re-LA-wan ko-mu-ni-TAS - `mendaftar` = đăng ký; `relawan` = tình nguyện viên.",
          "Lỗi người Việt: dùng danh từ `pendaftaran` như động từ. Hành động là `mendaftar`; biểu mẫu là `pendaftaran relawan`.",
          "Luyện: `Saya ingin mendaftar sebagai relawan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya IN-gin men-DAF-tar se-BA-gai re-LA-wan ko-mu-ni-TAS - `mendaftar` = register; `relawan` = volunteer.",
          "VN-speaker trap: using the noun `pendaftaran` as a verb. The action is `mendaftar`; the form/process is `pendaftaran relawan`.",
          "Drill: `Saya ingin mendaftar sebagai relawan.`",
        ],
      },
      {
        en: "Pendaftaran relawan dibuka sampai hari Jumat.",
        vi: "Đăng ký tình nguyện viên mở đến thứ Sáu.",
        pronunciation_focus: [
          "pen-DAF-tar-an re-LA-wan di-BU-ka SAM-pai HA-ri JUM-at - `pendaftaran` = việc đăng ký; `dibuka` = được mở.",
          "Lỗi người Việt: quên bị động `di-` trong thông báo. Poster/thông báo thường viết `pendaftaran dibuka`.",
          "Luyện: `Pendaftaran relawan dibuka hari ini.`",
        ],
        pronunciation_focus_en: [
          "pen-DAF-tar-an re-LA-wan di-BU-ka SAM-pai HA-ri JUM-at - `pendaftaran` = registration; `dibuka` = opened.",
          "VN-speaker trap: dropping passive `di-` in announcements. Posters usually say `pendaftaran dibuka`.",
          "Drill: `Pendaftaran relawan dibuka hari ini.`",
        ],
      },
      {
        en: "Kami butuh relawan untuk jaga posko malam ini.",
        vi: "Chúng tôi cần tình nguyện viên trực điểm cứu trợ tối nay.",
        pronunciation_focus: [
          "KA-mi BU-tuh re-LA-wan UN-tuk JA-ga POS-ko MA-lam I-ni - `jaga posko` = trực/canh điểm hỗ trợ.",
          "Lỗi người Việt: dịch `guard` thành `menjaga` lúc nào cũng trang trọng. Trong thông báo nhanh, `jaga posko` rất tự nhiên.",
          "Luyện: `Saya bisa jaga posko malam ini.`",
        ],
        pronunciation_focus_en: [
          "KA-mi BU-tuh re-LA-wan UN-tuk JA-ga POS-ko MA-lam I-ni - `jaga posko` = staff/watch the relief post.",
          "VN-speaker trap: always making `guard` formal as `menjaga`. In quick notices, `jaga posko` is natural.",
          "Drill: `Saya bisa jaga posko malam ini.`",
        ],
      },
      {
        en: "Bakti sosial ini fokus pada bantuan warga terdampak banjir.",
        vi: "Hoạt động thiện nguyện này tập trung vào hỗ trợ người dân bị ảnh hưởng bởi lũ.",
        pronunciation_focus: [
          "BAK-ti so-si-AL I-ni FO-kus PA-da ban-TU-an WAR-ga ter-DAM-pak BAN-jir - `bakti sosial` = hoạt động công tác xã hội; `terdampak` = bị ảnh hưởng.",
          "Lỗi người Việt: dùng `korban` cho mọi người nhận hỗ trợ. `warga terdampak` mềm và rộng hơn `korban`.",
          "Luyện: `Bantuan untuk warga terdampak banjir.`",
        ],
        pronunciation_focus_en: [
          "BAK-ti so-si-AL I-ni FO-kus PA-da ban-TU-an WAR-ga ter-DAM-pak BAN-jir - `bakti sosial` = social service event; `terdampak` = affected.",
          "VN-speaker trap: using `korban` for every aid recipient. `warga terdampak` is softer and broader than `korban`.",
          "Drill: `Bantuan untuk warga terdampak banjir.`",
        ],
      },
      {
        en: "Donasi bisa berupa uang, makanan, atau pakaian layak pakai.",
        vi: "Quyên góp có thể là tiền, thực phẩm, hoặc quần áo còn dùng tốt.",
        pronunciation_focus: [
          "do-NA-si BI-sa be-RU-pa U-ang, ma-KA-nan, A-tau pa-KAI-an LA-yak PA-kai - `berupa` = dưới dạng; `layak pakai` = còn dùng được.",
          "Lỗi người Việt: nói `pakaian bagus` khi muốn nói đồ còn dùng được. Cụm cứu trợ tự nhiên là `pakaian layak pakai`.",
          "Luyện: `Kami menerima pakaian layak pakai.`",
        ],
        pronunciation_focus_en: [
          "do-NA-si BI-sa be-RU-pa U-ang, ma-KA-nan, A-tau pa-KAI-an LA-yak PA-kai - `berupa` = in the form of; `layak pakai` = usable/decent condition.",
          "VN-speaker trap: saying `pakaian bagus` for usable donated clothes. Relief language says `pakaian layak pakai`.",
          "Drill: `Kami menerima pakaian layak pakai.`",
        ],
      },
      {
        en: "Tolong catat semua donasi yang masuk hari ini.",
        vi: "Làm ơn ghi lại tất cả khoản quyên góp nhận được hôm nay.",
        pronunciation_focus: [
          "TO-long CA-tat se-MU-a do-NA-si yang MA-suk HA-ri I-ni - `catat` = ghi chép; `donasi yang masuk` = khoản quyên góp đã nhận.",
          "Lỗi người Việt: dùng `datang` cho tiền/hàng vào. Trong tổ chức, dùng `masuk`: `donasi masuk`, `data masuk`.",
          "Luyện: `Donasi yang masuk harus dicatat.`",
        ],
        pronunciation_focus_en: [
          "TO-long CA-tat se-MU-a do-NA-si yang MA-suk HA-ri I-ni - `catat` = record; `donasi yang masuk` = donations received.",
          "VN-speaker trap: using `datang` for money/goods coming in. Organizations use `masuk`: `donasi masuk`, `data masuk`.",
          "Drill: `Donasi yang masuk harus dicatat.`",
        ],
      },
      {
        en: "Besok pagi ada kerja bakti membersihkan selokan.",
        vi: "Sáng mai có buổi lao động cộng đồng dọn rãnh thoát nước.",
        pronunciation_focus: [
          "BE-sok PA-gi A-da KER-ja BAK-ti mem-ber-SIH-kan se-LO-kan - `kerja bakti` = lao động chung vì cộng đồng; `selokan` = rãnh/cống nhỏ.",
          "Lỗi người Việt: dịch là `pekerjaan gratis`. `Kerja bakti` là hoạt động cộng đồng, không chỉ là làm miễn phí.",
          "Luyện: `Ada kerja bakti besok pagi.`",
        ],
        pronunciation_focus_en: [
          "BE-sok PA-gi A-da KER-ja BAK-ti mem-ber-SIH-kan se-LO-kan - `kerja bakti` = community volunteer labor; `selokan` = drain/ditch.",
          "VN-speaker trap: translating it as `pekerjaan gratis`. `Kerja bakti` is community service, not merely unpaid work.",
          "Drill: `Ada kerja bakti besok pagi.`",
        ],
      },
      {
        en: "Setiap relawan diminta membawa sarung tangan dan masker.",
        vi: "Mỗi tình nguyện viên được yêu cầu mang găng tay và khẩu trang.",
        pronunciation_focus: [
          "se-TI-ap re-LA-wan di-MIN-ta mem-BA-wa SA-rung TA-ngan dan MAS-ker - `diminta` = được yêu cầu; `sarung tangan` = găng tay.",
          "Lỗi người Việt: lẫn `sarung` (vải quấn) với `sarung tangan` (găng tay). Cả cụm mới là găng tay.",
          "Luyện: `Relawan diminta membawa masker.`",
        ],
        pronunciation_focus_en: [
          "se-TI-ap re-LA-wan di-MIN-ta mem-BA-wa SA-rung TA-ngan dan MAS-ker - `diminta` = asked/required; `sarung tangan` = gloves.",
          "VN-speaker trap: confusing `sarung` (wrap cloth) with `sarung tangan` (gloves). The full phrase means gloves.",
          "Drill: `Relawan diminta membawa masker.`",
        ],
      },
      {
        en: "Komunitas kami bekerja sama dengan RT dan karang taruna.",
        vi: "Cộng đồng/nhóm của chúng tôi phối hợp với RT và đoàn thanh niên khu phố.",
        pronunciation_focus: [
          "ko-mu-ni-TAS KA-mi be-KER-ja SA-ma DE-ngan er-te dan KA-rang ta-RU-na - `bekerja sama dengan` = phối hợp với; `karang taruna` = tổ chức thanh niên địa phương.",
          "Lỗi người Việt: bỏ `dengan`. Cụm cố định là `bekerja sama dengan`, giống `phối hợp với`.",
          "Luyện: `Kami bekerja sama dengan RT.`",
        ],
        pronunciation_focus_en: [
          "ko-mu-ni-TAS KA-mi be-KER-ja SA-ma DE-ngan er-te dan KA-rang ta-RU-na - `bekerja sama dengan` = cooperate with; `karang taruna` = local youth organization.",
          "VN-speaker trap: dropping `dengan`. The fixed phrase is `bekerja sama dengan`, like 'cooperate with'.",
          "Drill: `Kami bekerja sama dengan RT.`",
        ],
      },
      {
        en: "Bantuan akan dibagikan sesuai data penerima.",
        vi: "Hỗ trợ sẽ được phát theo dữ liệu/danh sách người nhận.",
        pronunciation_focus: [
          "ban-TU-an A-kan di-ba-GI-kan se-SU-ai DA-ta pe-ne-RI-ma - `dibagikan` = được phân phát; `penerima` = người nhận.",
          "Lỗi người Việt: dùng `bagi` trần trong thông báo chính thức. Văn thông báo dùng bị động `dibagikan`.",
          "Luyện: `Bantuan dibagikan sesuai data.`",
        ],
        pronunciation_focus_en: [
          "ban-TU-an A-kan di-ba-GI-kan se-SU-ai DA-ta pe-ne-RI-ma - `dibagikan` = distributed; `penerima` = recipient.",
          "VN-speaker trap: using bare `bagi` in official notices. Announcements use passive `dibagikan`.",
          "Drill: `Bantuan dibagikan sesuai data.`",
        ],
      },
      {
        en: "Kalau ada warga yang belum terdata, laporkan ke posko.",
        vi: "Nếu có người dân chưa được ghi danh, hãy báo cho điểm hỗ trợ.",
        pronunciation_focus: [
          "KA-lau A-da WAR-ga yang be-LUM ter-DA-ta, la-POR-kan ke POS-ko - `terdata` = đã có trong dữ liệu/danh sách; `laporkan` = hãy báo.",
          "Lỗi người Việt: nói `belum data`. Dạng đúng là `belum terdata` = chưa được ghi nhận trong dữ liệu.",
          "Luyện: `Warga itu belum terdata.`",
        ],
        pronunciation_focus_en: [
          "KA-lau A-da WAR-ga yang be-LUM ter-DA-ta, la-POR-kan ke POS-ko - `terdata` = recorded/listed in data; `laporkan` = report it.",
          "VN-speaker trap: saying `belum data`. Correct phrasing is `belum terdata` = not yet recorded.",
          "Drill: `Warga itu belum terdata.`",
        ],
      },
      {
        en: "Terima kasih atas partisipasi dan gotong royong semua warga.",
        vi: "Cảm ơn sự tham gia và tinh thần tương trợ của tất cả người dân.",
        pronunciation_focus: [
          "te-ri-MA KA-sih A-tas par-ti-si-PA-si dan GO-tong RO-yong se-MU-a WAR-ga - `partisipasi` = sự tham gia; `gotong royong` = tương trợ cộng đồng.",
          "Lỗi người Việt: dùng `terima kasih untuk` trong văn trang trọng. Thông báo thường viết `terima kasih atas ...`.",
          "Luyện: `Terima kasih atas partisipasinya.`",
        ],
        pronunciation_focus_en: [
          "te-ri-MA KA-sih A-tas par-ti-si-PA-si dan GO-tong RO-yong se-MU-a WAR-ga - `partisipasi` = participation; `gotong royong` = mutual community help.",
          "VN-speaker trap: using `terima kasih untuk` in formal notices. Announcements often use `terima kasih atas ...`.",
          "Drill: `Terima kasih atas partisipasinya.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Hoạt động tình nguyện ở Indonesia thường gắn với `gotong royong`, `kerja bakti`, `bakti sosial`, posko cứu trợ, RT/RW, karang taruna và nhóm WhatsApp khu phố. Khi có lũ, cháy, tang lễ, sự kiện xã hội hoặc dọn vệ sinh khu dân cư, người dân thường đăng ký ca trực, ghi nhận donasi, phân phát bantuan warga và phối hợp theo danh sách penerima.",
    cultural_notes_en:
      "Volunteering in Indonesia is closely tied to `gotong royong`, `kerja bakti`, `bakti sosial`, relief posts, RT/RW, local youth groups, and neighborhood WhatsApp groups. During floods, fires, funerals, social events, or neighborhood cleanups, residents often sign up for shifts, record donations, distribute community aid, and coordinate from recipient lists.",
    tip_advice_vi:
      "Mẹo cho người Việt: học theo cặp danh từ - động từ: `pendaftaran` nhưng `mendaftar`, `donasi` nhưng `mendonasikan/menyumbang`, `bantuan` nhưng `membantu`, `pembagian` nhưng `dibagikan`. Trong thông báo cộng đồng, bị động `di-` rất thường gặp: `dibuka`, `diminta`, `dibagikan`, `dicatat`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn noun - verb pairs: `pendaftaran` but `mendaftar`, `donasi` but `mendonasikan/menyumbang`, `bantuan` but `membantu`, `pembagian` but `dibagikan`. Community notices often use passive `di-`: `dibuka`, `diminta`, `dibagikan`, `dicatat`.",
    vocabulary: [
      { cell_id: "a2742a7c-db68-40b0-8b9a-d2f5e9907b92", word: "relawan", en: "volunteer", vi: "tình nguyện viên", pos: "noun", pronunciation_vi: "re-LA-wan", pronunciation_en: "re-LA-wan" },
      { cell_id: "4dc8bbb6-9c0b-475f-9cae-0dc195d92629", word: "pendaftaran relawan", en: "volunteer registration", vi: "đăng ký tình nguyện viên", pos: "noun phrase", pronunciation_vi: "pen-DAF-tar-an re-LA-wan", pronunciation_en: "pen-DAF-tar-an re-LA-wan" },
      { cell_id: "5ee3100a-fa25-4cc8-bc9d-9052f7460cd5", word: "bakti sosial", en: "social service / charity event", vi: "hoạt động công tác xã hội", pos: "noun phrase", pronunciation_vi: "BAK-ti so-si-AL", pronunciation_en: "BAK-tee so-see-AL" },
      { cell_id: "1049a443-9fea-47b2-9dd6-716140b2902f", word: "donasi", en: "donation", vi: "quyên góp", pos: "noun", pronunciation_vi: "do-NA-si", pronunciation_en: "do-NA-see" },
      { cell_id: "70d236dc-0f72-4c71-8a25-31ffeb4034ae", word: "posko", en: "relief post / command post", vi: "điểm cứu trợ/chỉ huy", pos: "noun", pronunciation_vi: "POS-ko", pronunciation_en: "POS-ko" },
      { cell_id: "2199b2d7-8c90-4a34-ba85-d986204b2086", word: "bantuan warga", en: "community aid", vi: "hỗ trợ của người dân", pos: "noun phrase", pronunciation_vi: "ban-TU-an WAR-ga", pronunciation_en: "ban-TOO-an WAR-ga" },
      { cell_id: "7008b441-27fe-4f55-a227-1f48ca73534d", word: "kerja bakti", en: "community volunteer labor", vi: "lao động công ích", pos: "noun phrase", pronunciation_vi: "KER-ja BAK-ti", pronunciation_en: "KER-ja BAK-tee" },
      { cell_id: "9c3358d5-8bac-47f8-aebb-b8164e2469b1", word: "komunitas", en: "community / group", vi: "cộng đồng / nhóm", pos: "noun", pronunciation_vi: "ko-mu-ni-TAS", pronunciation_en: "ko-moo-nee-TAS" },
      { cell_id: "3837b32c-6838-4443-84f0-f3171dfe1595", word: "terdata", en: "recorded/listed in data", vi: "được ghi danh / có trong dữ liệu", pos: "state verb", pronunciation_vi: "ter-DA-ta", pronunciation_en: "ter-DA-ta" },
      { cell_id: "084d0dd7-3294-40ff-96ae-bbbe3f01bd50", word: "penerima", en: "recipient", vi: "người nhận", pos: "noun", pronunciation_vi: "pe-ne-RI-ma", pronunciation_en: "pe-ne-REE-ma" },
      { cell_id: "0f43a462-6080-4008-aa27-96219f744686", word: "karang taruna", en: "local youth organization", vi: "tổ chức thanh niên địa phương", pos: "noun phrase", pronunciation_vi: "KA-rang ta-RU-na", pronunciation_en: "KA-rang ta-ROO-na" },
      { cell_id: "efb723af-8a1d-4441-87ef-05a51ac613da", word: "gotong royong", en: "mutual community cooperation", vi: "tương trợ cộng đồng", pos: "noun phrase", pronunciation_vi: "GO-tong RO-yong", pronunciation_en: "GO-tong RO-yong" },
    ],
    dialogue: [
      {
        cell_id: "8794dfe9-86d9-4e13-b8cf-a4ec28ce48da",
        speaker: "Koordinator",
        text: "Halo, pendaftaran relawan masih dibuka. Kamu mau ikut bagian apa?",
        vi: "Chào, đăng ký tình nguyện viên vẫn đang mở. Bạn muốn tham gia phần nào?",
        en: "Hi, volunteer registration is still open. Which section do you want to join?",
      },
      {
        cell_id: "03855426-9213-4ed2-b254-2070ee27dc81",
        speaker: "Minh",
        text: "Saya bisa jaga posko dan mencatat donasi yang masuk.",
        vi: "Tôi có thể trực điểm cứu trợ và ghi các khoản quyên góp nhận được.",
        en: "I can staff the relief post and record incoming donations.",
      },
      {
        cell_id: "a4079ccf-de22-47f1-ad55-324d755e4bcf",
        speaker: "Koordinator",
        text: "Bagus. Besok pagi juga ada kerja bakti membersihkan selokan.",
        vi: "Tốt. Sáng mai cũng có buổi lao động cộng đồng dọn rãnh thoát nước.",
        en: "Good. Tomorrow morning there is also community service to clean the drains.",
      },
      {
        cell_id: "e2656640-848d-4199-b9eb-d4f82eb56616",
        speaker: "Minh",
        text: "Siap. Saya bawa sarung tangan, masker, dan air minum.",
        vi: "Sẵn sàng. Tôi mang găng tay, khẩu trang và nước uống.",
        en: "Ready. I will bring gloves, a mask, and drinking water.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng về tình nguyện và phục vụ cộng đồng:",
        instruction_en: "Fill in the right volunteer/community-service word:",
        items: [
          {
            prompt: "Saya ingin mendaftar sebagai ___. (tình nguyện viên)",
            answer: "relawan",
            options: ["relawan", "rekening", "restoran"],
          },
          {
            prompt: "Donasi yang masuk harus ___. (được ghi chép)",
            answer: "dicatat",
            options: ["dicatat", "dibayar", "dibuka"],
          },
          {
            prompt: "Bantuan akan ___ sesuai data penerima. (được phân phát)",
            answer: "dibagikan",
            options: ["dibagikan", "ditutup", "dimasak"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối cụm tiếng Indonesia với nghĩa tiếng Việt:",
        instruction_en: "Match each Indonesian phrase with its Vietnamese meaning:",
        items: [
          { prompt: "pendaftaran relawan", answer: "đăng ký tình nguyện viên" },
          { prompt: "bakti sosial", answer: "hoạt động công tác xã hội" },
          { prompt: "kerja bakti", answer: "lao động công ích" },
          { prompt: "bantuan warga", answer: "hỗ trợ của người dân" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn đăng ký làm tình nguyện viên.", answer: "Saya ingin mendaftar sebagai relawan." },
          { prompt: "Chúng tôi cần tình nguyện viên trực điểm cứu trợ.", answer: "Kami butuh relawan untuk jaga posko." },
          { prompt: "Cảm ơn sự tham gia của tất cả người dân.", answer: "Terima kasih atas partisipasi semua warga." },
        ],
      },
    ],
  },
];

export default lessons;
