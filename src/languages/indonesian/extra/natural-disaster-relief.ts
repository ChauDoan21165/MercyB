// Natural Disaster Relief Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// pronunciation/logistics notes with English companions in pronunciation_focus_en.

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
    id: "indonesian_natural_disaster_relief",
    level: "B1",
    category: "emergency",
    title_vi: "Cứu trợ thiên tai và hậu cần khẩn cấp",
    title_en: "Natural disaster relief and emergency logistics",
    sentences: [
      {
        en: "Bantuan bencana akan dikirim ke posko utama.",
        vi: "Hàng cứu trợ thiên tai sẽ được gửi đến điểm cứu trợ chính.",
        pronunciation_focus: [
          "ban-TU-an ben-CA-na A-kan di-KI-rim ke POS-ko u-TA-ma - `bantuan bencana` = cứu trợ thiên tai; `posko utama` = điểm/ban chỉ huy chính.",
          "Lỗi người Việt: dùng `tolong bencana`. `Tolong` là giúp/cứu; danh từ cứu trợ là `bantuan`.",
          "Luyện: `Bantuan bencana dikirim ke posko.`",
        ],
        pronunciation_focus_en: [
          "ban-TOO-an ben-CHA-na A-kan di-KI-rim ke POS-ko oo-TA-ma - `bantuan bencana` = disaster aid; `posko utama` = main relief/command post.",
          "VN-speaker trap: using `tolong bencana`. `Tolong` is help/please; aid as a noun is `bantuan`.",
          "Drill: `Bantuan bencana dikirim ke posko.`",
        ],
      },
      {
        en: "Kami membuka donasi untuk korban gempa dan banjir.",
        vi: "Chúng tôi mở quyên góp cho nạn nhân động đất và lũ lụt.",
        pronunciation_focus: [
          "KA-mi mem-BU-ka do-NA-si UN-tuk KOR-ban GEM-pa dan ban-JIR - `membuka donasi` = mở đợt quyên góp.",
          "Lỗi người Việt: nói `mở bantuan`. Mở kênh quyên góp là `membuka donasi`; hàng nhận được là `bantuan`.",
          "Luyện: `Kami membuka donasi untuk korban banjir.`",
        ],
        pronunciation_focus_en: [
          "KA-mi mem-BOO-ka do-NA-see UN-tuk KOR-ban GEM-pa dan ban-JIR - `membuka donasi` = open a donation drive.",
          "VN-speaker trap: saying `membuka bantuan`. You open `donasi`; the goods/money received are `bantuan`.",
          "Drill: `Kami membuka donasi untuk korban banjir.`",
        ],
      },
      {
        en: "Relawan diminta datang sebelum pembagian logistik.",
        vi: "Tình nguyện viên được yêu cầu đến trước khi phát hậu cần/hàng cứu trợ.",
        pronunciation_focus: [
          "re-LA-wan di-MIN-ta DA-tang se-BE-lum pem-ba-GI-an lo-GIS-tik - `pembagian logistik` = phân phát hàng hậu cần.",
          "Lỗi người Việt: hiểu `logistik` chỉ là vận chuyển. Trong cứu trợ, `logistik` là hàng cần thiết: makanan, air, selimut.",
          "Luyện: `Pembagian logistik mulai pagi.`",
        ],
        pronunciation_focus_en: [
          "re-LA-wan di-MIN-ta DA-tang se-BE-lum pem-ba-GI-an lo-GIS-tik - `pembagian logistik` = distribution of supplies.",
          "VN-speaker trap: reading `logistik` as only transport. In relief work, it means essential supplies: food, water, blankets.",
          "Drill: `Pembagian logistik mulai pagi.`",
        ],
      },
      {
        en: "Pengungsi membutuhkan tenda darurat dan selimut.",
        vi: "Người sơ tán cần lều khẩn cấp và chăn.",
        pronunciation_focus: [
          "pe-NGUNG-si mem-bu-TUH-kan TEN-da da-RU-rat dan se-LI-mut - `pengungsi` = người đi lánh nạn; `tenda darurat` = lều khẩn cấp.",
          "Lỗi người Việt: lẫn `mengungsi` và `pengungsi`. `Mengungsi` là đi sơ tán; `pengungsi` là người sơ tán.",
          "Luyện: `Pengungsi membutuhkan selimut.`",
        ],
        pronunciation_focus_en: [
          "pe-NGUNG-see mem-boo-TUH-kan TEN-da da-ROO-rat dan se-LEE-mut - `pengungsi` = evacuees/displaced people; `tenda darurat` = emergency tent.",
          "VN-speaker trap: mixing `mengungsi` and `pengungsi`. `Mengungsi` is to evacuate; `pengungsi` is the evacuee.",
          "Drill: `Pengungsi membutuhkan selimut.`",
        ],
      },
      {
        en: "Dapur umum menyiapkan nasi bungkus untuk warga terdampak.",
        vi: "Bếp ăn cộng đồng chuẩn bị cơm gói cho người dân bị ảnh hưởng.",
        pronunciation_focus: [
          "DA-pur U-mum me-NYI-ap-kan NA-si BUNG-kus UN-tuk WAR-ga ter-DAM-pak - `dapur umum` = bếp ăn cứu trợ; `warga terdampak` = dân bị ảnh hưởng.",
          "Lỗi người Việt: dịch `public kitchen` từng chữ thành `dapur publik`. Cụm Indonesia là `dapur umum`.",
          "Luyện: `Dapur umum menyiapkan nasi bungkus.`",
        ],
        pronunciation_focus_en: [
          "DA-pur OO-mum me-NYI-ap-kan NA-see BUNG-kus UN-tuk WAR-ga ter-DAM-pak - `dapur umum` = communal relief kitchen; `warga terdampak` = affected residents.",
          "VN-speaker trap: translating 'public kitchen' as `dapur publik`. Indonesian uses `dapur umum`.",
          "Drill: `Dapur umum menyiapkan nasi bungkus.`",
        ],
      },
      {
        en: "Air bersih dan obat-obatan paling dibutuhkan saat ini.",
        vi: "Nước sạch và thuốc men đang cần nhất lúc này.",
        pronunciation_focus: [
          "A-ir BER-sih dan O-bat-O-bat-an PA-ling di-bu-TUH-kan SA-at I-ni - `air bersih` = nước sạch; `obat-obatan` = thuốc men.",
          "Lỗi người Việt: nói `obat banyak`. Danh từ tập hợp tự nhiên là `obat-obatan`.",
          "Luyện: `Air bersih paling dibutuhkan.`",
        ],
        pronunciation_focus_en: [
          "A-eer BER-sih dan O-bat-O-bat-an PA-ling di-boo-TUH-kan SA-at I-ni - `air bersih` = clean water; `obat-obatan` = medicines.",
          "VN-speaker trap: saying `obat banyak`. The natural collective noun is `obat-obatan`.",
          "Drill: `Air bersih paling dibutuhkan.`",
        ],
      },
      {
        en: "Tolong pisahkan logistik makanan, pakaian, dan perlengkapan bayi.",
        vi: "Làm ơn tách riêng hậu cần thực phẩm, quần áo và đồ dùng em bé.",
        pronunciation_focus: [
          "TO-long PI-sah-kan lo-GIS-tik ma-KA-nan, pa-KAI-an, dan per-leng-KAP-an BA-yi - `pisahkan` = tách riêng; `perlengkapan bayi` = đồ dùng em bé.",
          "Lỗi người Việt: dùng `pisah` trần trong yêu cầu lịch sự. Khi nhờ ai tách đồ, dùng `pisahkan`.",
          "Luyện: `Pisahkan makanan dan pakaian.`",
        ],
        pronunciation_focus_en: [
          "TO-long PI-sah-kan lo-GIS-tik ma-KA-nan, pa-KAI-an, dan per-leng-KAP-an BA-yi - `pisahkan` = separate; `perlengkapan bayi` = baby supplies.",
          "VN-speaker trap: using bare `pisah` in a polite request. When asking someone to separate items, use `pisahkan`.",
          "Drill: `Pisahkan makanan dan pakaian.`",
        ],
      },
      {
        en: "Data pengungsi harus dicatat sebelum bantuan dibagikan.",
        vi: "Dữ liệu người sơ tán phải được ghi lại trước khi cứu trợ được phát.",
        pronunciation_focus: [
          "DA-ta pe-NGUNG-si HA-rus di-CA-tat se-BE-lum ban-TU-an di-ba-GI-kan - `dicatat` = được ghi chép; `dibagikan` = được phân phát.",
          "Lỗi người Việt: bỏ bị động `di-` trong thông báo. Văn cứu trợ thường dùng `dicatat`, `dibagikan`, `dikirim`.",
          "Luyện: `Data pengungsi harus dicatat.`",
        ],
        pronunciation_focus_en: [
          "DA-ta pe-NGUNG-see HA-rus di-CA-tat se-BE-lum ban-TOO-an di-ba-GI-kan - `dicatat` = recorded; `dibagikan` = distributed.",
          "VN-speaker trap: dropping passive `di-` in notices. Relief notices often use `dicatat`, `dibagikan`, `dikirim`.",
          "Drill: `Data pengungsi harus dicatat.`",
        ],
      },
      {
        en: "Truk logistik tertahan karena jalan menuju desa putus.",
        vi: "Xe tải hậu cần bị kẹt vì đường vào làng bị đứt/chia cắt.",
        pronunciation_focus: [
          "truk lo-GIS-tik ter-TA-han ka-RE-na JA-lan me-NU-ju DE-sa PU-tus - `tertahan` = bị giữ/kẹt; `jalan putus` = đường bị cắt đứt.",
          "Lỗi người Việt: dịch `road broken` thành `jalan rusak`. `Jalan rusak` là đường hỏng; `jalan putus` là tuyến bị chia cắt.",
          "Luyện: `Jalan menuju desa putus.`",
        ],
        pronunciation_focus_en: [
          "truck lo-GIS-tik ter-TA-han ka-RE-na JA-lan me-NU-ju DE-sa PU-tus - `tertahan` = held up/stuck; `jalan putus` = road cut off.",
          "VN-speaker trap: translating 'road broken' as `jalan rusak`. `Jalan rusak` is damaged road; `jalan putus` is cut off.",
          "Drill: `Jalan menuju desa putus.`",
        ],
      },
      {
        en: "Koordinator meminta relawan tidak menyebarkan data pribadi pengungsi.",
        vi: "Điều phối viên yêu cầu tình nguyện viên không phát tán dữ liệu cá nhân của người sơ tán.",
        pronunciation_focus: [
          "ko-or-di-NA-tor me-MIN-ta re-LA-wan ti-DAK me-nye-BAR-kan DA-ta pri-BA-di pe-NGUNG-si - `data pribadi` = dữ liệu cá nhân.",
          "Lỗi người Việt: dùng `share` thoải mái trong bối cảnh nhạy cảm. Tiếng Indonesia cảnh báo là `jangan menyebarkan data pribadi`.",
          "Luyện: `Jangan menyebarkan data pribadi.`",
        ],
        pronunciation_focus_en: [
          "ko-or-di-NA-tor me-MIN-ta re-LA-wan ti-DAK me-nye-BAR-kan DA-ta pri-BA-di pe-NGUNG-see - `data pribadi` = personal data.",
          "VN-speaker trap: casually using `share` in sensitive contexts. Indonesian warnings say `jangan menyebarkan data pribadi`.",
          "Drill: `Jangan menyebarkan data pribadi.`",
        ],
      },
      {
        en: "Donasi uang harus masuk ke rekening resmi lembaga.",
        vi: "Tiền quyên góp phải vào tài khoản chính thức của tổ chức.",
        pronunciation_focus: [
          "do-NA-si U-ang HA-rus MA-suk ke re-KE-ning res-MI lem-BA-ga - `rekening resmi` = tài khoản chính thức; `lembaga` = tổ chức/cơ quan.",
          "Lỗi người Việt: dùng `akun` cho tài khoản ngân hàng. Ngân hàng dùng `rekening`; app/mạng xã hội dùng `akun`.",
          "Luyện: `Kirim donasi ke rekening resmi.`",
        ],
        pronunciation_focus_en: [
          "do-NA-see OO-ang HA-rus MA-suk ke re-KE-ning res-MI lem-BA-ga - `rekening resmi` = official bank account; `lembaga` = institution/organization.",
          "VN-speaker trap: using `akun` for bank account. Banking uses `rekening`; apps/social media use `akun`.",
          "Drill: `Kirim donasi ke rekening resmi.`",
        ],
      },
      {
        en: "Setelah masa tanggap darurat, bantuan dialihkan ke pemulihan.",
        vi: "Sau giai đoạn ứng phó khẩn cấp, hỗ trợ được chuyển sang phục hồi.",
        pronunciation_focus: [
          "se-TE-lah MA-sa tang-GAP da-RU-rat, ban-TU-an di-a-LIH-kan ke pe-mu-LIH-an - `tanggap darurat` = ứng phó khẩn cấp; `pemulihan` = phục hồi.",
          "Lỗi người Việt: dùng `darurat` cho mọi giai đoạn. Cứu trợ có giai đoạn: `tanggap darurat`, lalu `pemulihan`.",
          "Luyện: `Bantuan dialihkan ke pemulihan.`",
        ],
        pronunciation_focus_en: [
          "se-TE-lah MA-sa tang-GAP da-ROO-rat, ban-TOO-an di-a-LIH-kan ke pe-mu-LIH-an - `tanggap darurat` = emergency response; `pemulihan` = recovery.",
          "VN-speaker trap: using `darurat` for every phase. Relief has phases: `tanggap darurat`, then `pemulihan`.",
          "Drill: `Bantuan dialihkan ke pemulihan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong cứu trợ thiên tai ở Indonesia, `posko` là điểm điều phối quan trọng: nhận donasi, ghi data pengungsi, chia logistik, vận hành dapur umum và kết nối relawan với chính quyền địa phương. Các tổ chức như BNPB/BPBD, PMI, masjid, gereja, komunitas và RT/RW thường cùng tham gia. Khi quyên góp, người dân thường kiểm tra `rekening resmi` để tránh lừa đảo và ưu tiên nhu cầu thực tế như air bersih, makanan, obat-obatan, selimut, tenda darurat, perlengkapan bayi.",
    cultural_notes_en:
      "In Indonesian disaster relief, a `posko` is the key coordination point: receiving donations, recording evacuee data, distributing supplies, running communal kitchens, and connecting volunteers with local authorities. Organizations such as BNPB/BPBD, PMI, mosques, churches, communities, and RT/RW often work together. When donating, people check the `rekening resmi` to avoid scams and prioritize real needs such as clean water, food, medicines, blankets, emergency tents, and baby supplies.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt nhóm từ rất dễ nhầm: `bantuan` (hỗ trợ/cứu trợ), `donasi` (quyên góp), `logistik` (hàng hậu cần), `pengungsi` (người sơ tán), `mengungsi` (đi sơ tán), `tenda darurat` (lều khẩn cấp), `dapur umum` (bếp ăn cứu trợ). Trong thông báo cứu trợ, thể bị động `di-` xuất hiện liên tục: `dikirim`, `dibagikan`, `dicatat`, `dialihkan`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: separate easily confused relief terms: `bantuan` (aid/help), `donasi` (donation), `logistik` (supplies), `pengungsi` (evacuee/displaced person), `mengungsi` (evacuate), `tenda darurat` (emergency tent), and `dapur umum` (relief kitchen). Relief notices constantly use passive `di-`: `dikirim`, `dibagikan`, `dicatat`, `dialihkan`.",
    vocabulary: [
      { word: "bantuan bencana", en: "disaster aid", vi: "cứu trợ thiên tai", pos: "noun phrase", pronunciation_vi: "ban-TU-an ben-CA-na", pronunciation_en: "ban-TOO-an ben-CHA-na" },
      { word: "posko", en: "relief / command post", vi: "điểm cứu trợ / chỉ huy", pos: "noun", pronunciation_vi: "POS-ko", pronunciation_en: "POS-ko" },
      { word: "donasi", en: "donation", vi: "quyên góp", pos: "noun", pronunciation_vi: "do-NA-si", pronunciation_en: "do-NA-see" },
      { word: "relawan", en: "volunteer", vi: "tình nguyện viên", pos: "noun", pronunciation_vi: "re-LA-wan", pronunciation_en: "re-LA-wan" },
      { word: "logistik", en: "relief supplies / logistics", vi: "hàng hậu cần", pos: "noun", pronunciation_vi: "lo-GIS-tik", pronunciation_en: "lo-GIS-tik" },
      { word: "pengungsi", en: "evacuee / displaced person", vi: "người sơ tán", pos: "noun", pronunciation_vi: "pe-NGUNG-si", pronunciation_en: "pe-NGUNG-see" },
      { word: "tenda darurat", en: "emergency tent", vi: "lều khẩn cấp", pos: "noun phrase", pronunciation_vi: "TEN-da da-RU-rat", pronunciation_en: "TEN-da da-ROO-rat" },
      { word: "dapur umum", en: "communal relief kitchen", vi: "bếp ăn cứu trợ", pos: "noun phrase", pronunciation_vi: "DA-pur U-mum", pronunciation_en: "DA-pur OO-mum" },
      { word: "warga terdampak", en: "affected residents", vi: "người dân bị ảnh hưởng", pos: "noun phrase", pronunciation_vi: "WAR-ga ter-DAM-pak", pronunciation_en: "WAR-ga ter-DAM-pak" },
      { word: "rekening resmi", en: "official bank account", vi: "tài khoản chính thức", pos: "noun phrase", pronunciation_vi: "re-KE-ning res-MI", pronunciation_en: "re-KE-ning res-MEE" },
      { word: "tanggap darurat", en: "emergency response", vi: "ứng phó khẩn cấp", pos: "noun phrase", pronunciation_vi: "tang-GAP da-RU-rat", pronunciation_en: "tang-GAP da-ROO-rat" },
      { word: "pemulihan", en: "recovery", vi: "phục hồi", pos: "noun", pronunciation_vi: "pe-mu-LIH-an", pronunciation_en: "pe-moo-LIH-an" },
    ],
    dialogue: [
      {
        speaker: "Koordinator",
        text: "Posko utama butuh relawan untuk mencatat data pengungsi.",
        vi: "Điểm cứu trợ chính cần tình nguyện viên ghi dữ liệu người sơ tán.",
        en: "The main relief post needs volunteers to record evacuee data.",
      },
      {
        speaker: "Relawan",
        text: "Saya bisa bantu. Logistik apa yang paling dibutuhkan?",
        vi: "Tôi có thể giúp. Hàng hậu cần nào đang cần nhất?",
        en: "I can help. Which supplies are needed most?",
      },
      {
        speaker: "Koordinator",
        text: "Air bersih, obat-obatan, selimut, dan perlengkapan bayi.",
        vi: "Nước sạch, thuốc men, chăn và đồ dùng em bé.",
        en: "Clean water, medicines, blankets, and baby supplies.",
      },
      {
        speaker: "Relawan",
        text: "Baik. Donasi uang saya kirim ke rekening resmi lembaga.",
        vi: "Được. Tiền quyên góp tôi gửi vào tài khoản chính thức của tổ chức.",
        en: "Okay. I will send cash donations to the organization's official bank account.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng về cứu trợ thiên tai:",
        instruction_en: "Fill in the right disaster-relief word:",
        items: [
          {
            prompt: "___ membutuhkan tenda darurat dan selimut. (người sơ tán)",
            answer: "Pengungsi",
            options: ["Pengungsi", "Pengantar", "Penjual"],
          },
          {
            prompt: "Dapur umum menyiapkan ___ untuk warga terdampak. (cơm gói)",
            answer: "nasi bungkus",
            options: ["nasi bungkus", "nomor rekening", "nota belanja"],
          },
          {
            prompt: "Donasi uang harus masuk ke ___ resmi. (tài khoản ngân hàng)",
            answer: "rekening",
            options: ["rekening", "relawan", "ruangan"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối cụm tiếng Indonesia với nghĩa tiếng Việt:",
        instruction_en: "Match each Indonesian phrase with its Vietnamese meaning:",
        items: [
          { prompt: "bantuan bencana", answer: "cứu trợ thiên tai" },
          { prompt: "tenda darurat", answer: "lều khẩn cấp" },
          { prompt: "dapur umum", answer: "bếp ăn cứu trợ" },
          { prompt: "pembagian logistik", answer: "phân phát hàng hậu cần" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Hàng cứu trợ sẽ được gửi đến điểm cứu trợ chính.", answer: "Bantuan bencana akan dikirim ke posko utama." },
          { prompt: "Người sơ tán cần lều khẩn cấp.", answer: "Pengungsi membutuhkan tenda darurat." },
          { prompt: "Dữ liệu người sơ tán phải được ghi lại.", answer: "Data pengungsi harus dicatat." },
        ],
      },
    ],
  },
];

export default lessons;
