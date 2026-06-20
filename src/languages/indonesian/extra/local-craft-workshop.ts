// Local Craft Workshop Indonesian (Vietnamese -> Indonesian study track).
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

type IndonesianExercise = Record<string, any>;

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

export const localCraftWorkshopLessons: IndonesianLesson[] = [
  {
    id: "indonesian_local_craft_workshop",
    level: "B1",
    category: "culture_travel",
    title_vi: "Workshop kerajinan dia phuong: batik, anyaman va tanah liat",
    title_en: "Local craft workshops: batik, weaving and clay",
    sentences: [
      {
        en: "Saya mau ikut workshop kerajinan lokal akhir pekan ini.",
        vi: "Toi muon tham gia workshop thu cong dia phuong cuoi tuan nay.",
        pronunciation_focus: [
          "`ikut workshop` = tham gia workshop; `ikut` rat tu nhien khi noi ve lop ngan han.",
          "`kerajinan lokal` = do thu cong dia phuong; `kerajinan` khong phai la tinh cham chi trong cau nay.",
          "Loi nguoi Viet: noi `join workshop` trong cau Indonesia. Noi tu nhien hon: `ikut workshop`.",
        ],
        pronunciation_focus_en: [
          "`ikut workshop` means join a workshop; `ikut` is natural for short classes.",
          "`kerajinan lokal` means local crafts; here `kerajinan` means crafts, not diligence.",
          "VN-speaker trap: saying English `join workshop` inside Indonesian. More natural: `ikut workshop`.",
        ],
      },
      {
        en: "Workshop batik ini cocok untuk pemula?",
        vi: "Workshop batik nay co phu hop cho nguoi moi bat dau khong?",
        pronunciation_focus: [
          "`batik` = vai/hoa tiet batik; trong workshop co the hoc mencanting, mewarnai, atau motif dasar.",
          "`cocok untuk pemula` = phu hop cho nguoi moi bat dau; `c` trong `cocok` doc nhu 'ch'.",
          "Loi nguoi Viet: hoi `untuk beginner?` duoc hieu, nhung `pemula` la tu Indonesia ro hon.",
        ],
        pronunciation_focus_en: [
          "`batik` means batik cloth or pattern; in a workshop you may learn wax drawing, coloring, or basic motifs.",
          "`cocok untuk pemula` means suitable for beginners; Indonesian `c` in `cocok` is pronounced like 'ch'.",
          "VN-speaker note: `untuk beginner?` is understood, but `pemula` is clearer Indonesian.",
        ],
      },
      {
        en: "Instruktur akan mengajarkan cara memakai canting.",
        vi: "Giang vien se day cach dung but canting.",
        pronunciation_focus: [
          "`instruktur` = giang vien/nguoi huong dan trong lop thuc hanh.",
          "`canting` = dung cu nho de ve sap nong trong batik tulis; `c` doc 'ch': CHAN-ting.",
          "Loi nguoi Viet: dung `guru` khong sai, nhung trong workshop nguoi huong dan thuong goi la `instruktur`.",
        ],
        pronunciation_focus_en: [
          "`instruktur` means instructor or facilitator in a hands-on class.",
          "`canting` is the small tool for drawing hot wax in hand-drawn batik; `c` is 'ch': CHAN-ting.",
          "VN-speaker note: `guru` is not wrong, but in a workshop the guide is often called `instruktur`.",
        ],
      },
      {
        en: "Di kelas anyaman, kita belajar membuat keranjang kecil.",
        vi: "Trong lop dan lat, chung ta hoc lam gio nho.",
        pronunciation_focus: [
          "`anyaman` = do dan/ky thuat dan lat; co the dung bambu, pandan, atau rotan.",
          "`membuat keranjang kecil` = lam gio nho; tinh tu `kecil` dung sau danh tu.",
          "Loi nguoi Viet: noi `kecil keranjang` theo thu tu tieng Viet. Tieng Indonesia noi `keranjang kecil`.",
        ],
        pronunciation_focus_en: [
          "`anyaman` means woven craft or weaving technique; materials may include bamboo, pandan, or rattan.",
          "`membuat keranjang kecil` means make a small basket; adjective `kecil` comes after the noun.",
          "VN-speaker trap: saying `kecil keranjang` from Vietnamese order. Indonesian says `keranjang kecil`.",
        ],
      },
      {
        en: "Tanah liatnya harus dibasahi dulu sebelum dibentuk.",
        vi: "Dat set phai duoc lam am truoc khi tao hinh.",
        pronunciation_focus: [
          "`tanah liat` = dat set; dung trong lop gom, patung kecil, atau keramik sederhana.",
          "`dibasahi dulu` = duoc lam am truoc; bi dong `di-` phu hop khi noi ve vat lieu.",
          "Loi nguoi Viet: noi `kasih air` qua than mat. Trong huong dan lop, `dibasahi dulu` ro va tu nhien hon.",
        ],
        pronunciation_focus_en: [
          "`tanah liat` means clay, used in pottery, small sculptures, or simple ceramics.",
          "`dibasahi dulu` means moistened first; passive `di-` fits instructions about materials.",
          "VN-speaker note: `kasih air` is very casual. In class instructions, `dibasahi dulu` is clearer and more natural.",
        ],
      },
      {
        en: "Alat kerja sudah disediakan oleh panitia.",
        vi: "Dung cu lam viec da duoc ban to chuc cung cap.",
        pronunciation_focus: [
          "`alat kerja` = dung cu lam viec; trong workshop co the gom kuas, gunting, canting, cetakan.",
          "`disediakan oleh panitia` = duoc ban to chuc cung cap; cau bi dong rat thuong trong thong bao.",
          "Loi nguoi Viet: noi `alat sudah ada` duoc, nhung trong thong bao chinh thuc `alat kerja sudah disediakan` tot hon.",
        ],
        pronunciation_focus_en: [
          "`alat kerja` means work tools; in workshops this can include brushes, scissors, canting, or molds.",
          "`disediakan oleh panitia` means provided by the organizer; passive wording is common in announcements.",
          "VN-speaker note: `alat sudah ada` works, but in formal notices `alat kerja sudah disediakan` is better.",
        ],
      },
      {
        en: "Biaya kelas sudah termasuk bahan dan alat.",
        vi: "Hoc phi lop da bao gom vat lieu va dung cu.",
        pronunciation_focus: [
          "`biaya kelas` = phi lop/hoc phi cho workshop; hoi tien dung `berapa biaya kelasnya?`.",
          "`sudah termasuk bahan dan alat` = da bao gom vat lieu va dung cu; cum rat can thiet truoc khi dang ky.",
          "Loi nguoi Viet: hoi `apa biaya`. Khi hoi so tien, dung `berapa`, khong dung `apa`.",
        ],
        pronunciation_focus_en: [
          "`biaya kelas` means class fee; ask the amount with `berapa biaya kelasnya?`.",
          "`sudah termasuk bahan dan alat` means already includes materials and tools, important before registering.",
          "VN-speaker trap: asking `apa biaya`. For an amount of money, use `berapa`, not `apa`.",
        ],
      },
      {
        en: "Hasil karya peserta boleh dibawa pulang.",
        vi: "Tac pham cua hoc vien co the mang ve nha.",
        pronunciation_focus: [
          "`hasil karya` = tac pham/san pham minh lam ra; rat hay dung trong lop nghe thuat.",
          "`peserta` = nguoi tham gia/hoc vien workshop; khac voi `penonton` la khan gia.",
          "Loi nguoi Viet: dich `my product` thanh `produk saya` nghe thuong mai. Trong workshop, `hasil karya` dep hon.",
        ],
        pronunciation_focus_en: [
          "`hasil karya` means finished work or created piece, common in art/craft classes.",
          "`peserta` means participant; different from `penonton`, audience member.",
          "VN-speaker note: translating 'my product' as `produk saya` sounds commercial. In a workshop, `hasil karya` is better.",
        ],
      },
      {
        en: "Kalau belum rapi, instruktur bisa membantu memperbaiki bentuknya.",
        vi: "Neu chua gon dep, giang vien co the giup chinh lai hinh dang.",
        pronunciation_focus: [
          "`belum rapi` = chua gon/chua dep; nhe nhang hon noi `jelek`.",
          "`memperbaiki bentuknya` = chinh sua hinh dang cua no; dung cho dat set, anyaman, atau pola batik.",
          "Loi nguoi Viet: noi thang `jelek` co the nghe tho. Trong lop, dung `belum rapi` de lich su hon.",
        ],
        pronunciation_focus_en: [
          "`belum rapi` means not neat yet, gentler than saying `jelek`.",
          "`memperbaiki bentuknya` means fix its shape, useful for clay, weaving, or batik patterns.",
          "VN-speaker trap: blunt `jelek` can sound harsh. In class, use `belum rapi` for a polite tone.",
        ],
      },
      {
        en: "Saya ingin belajar teknik dasar sebelum mencoba motif yang rumit.",
        vi: "Toi muon hoc ky thuat co ban truoc khi thu hoa tiet phuc tap.",
        pronunciation_focus: [
          "`teknik dasar` = ky thuat co ban; dung trong batik, anyaman, tanah liat.",
          "`motif yang rumit` = hoa tiet/phong cach phuc tap; `yang` noi danh tu voi tinh chat.",
          "Loi nguoi Viet: dat `rumit` truoc danh tu. Tieng Indonesia noi `motif yang rumit` hoac `motif rumit`.",
        ],
        pronunciation_focus_en: [
          "`teknik dasar` means basic technique; useful for batik, weaving, and clay.",
          "`motif yang rumit` means a complicated motif/pattern; `yang` links the noun to the quality.",
          "VN-speaker trap: placing `rumit` before the noun. Indonesian says `motif yang rumit` or `motif rumit`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Workshop kerajinan o Indonesia thuong danh cho du khach, hoc sinh, hoac nguoi dia phuong muon thu lam batik, anyaman, tanah liat, ukiran, atau keramik sederhana. Nguoi tham gia thuong duoc cung cap bahan dan alat, duoc instruktur huong dan tung buoc, roi mang hasil karya ve nha. Voi batik, hay hoi lop dung batik tulis hay batik cap; voi tanah liat, hoi tac pham co can dibakar hay co the langsung dibawa pulang.",
    cultural_notes_en:
      "Craft workshops in Indonesia are often for travelers, students, or locals who want to try batik, weaving, clay, carving, or simple ceramics. Participants are usually provided with materials and tools, guided step by step by an instructor, then take their finished work home. For batik, ask whether the class uses hand-drawn batik or stamped batik; for clay, ask whether the piece needs firing or can be taken home directly.",
    tip_advice_vi:
      "Meo cho nguoi Viet: khi hoi workshop, dung cac khung an toan: `cocok untuk pemula?`, `biaya kelas sudah termasuk bahan dan alat?`, `alat kerja disediakan?`, `hasil karya boleh dibawa pulang?`. Nho rang tinh tu dung sau danh tu: `keranjang kecil`, `teknik dasar`, `motif rumit`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: when asking about a workshop, use safe frames: `cocok untuk pemula?`, `biaya kelas sudah termasuk bahan dan alat?`, `alat kerja disediakan?`, `hasil karya boleh dibawa pulang?`. Remember that adjectives follow nouns: `keranjang kecil`, `teknik dasar`, `motif rumit`.",
    vocabulary: [
      {
        word: "workshop kerajinan",
        en: "craft workshop",
        vi: "workshop thu cong",
        pos: "noun phrase",
        pronunciation_vi: "WOK-shop ke-ra-JI-nan",
        pronunciation_en: "WORK-shop keh-ra-JEE-nan",
      },
      {
        word: "batik",
        en: "batik",
        vi: "batik / vai ve sap nhuom",
        pos: "noun",
        pronunciation_vi: "BA-tik",
        pronunciation_en: "BA-tik",
      },
      {
        word: "anyaman",
        en: "woven craft / weaving",
        vi: "do dan / ky thuat dan lat",
        pos: "noun",
        pronunciation_vi: "a-NYA-man",
        pronunciation_en: "a-NYA-man",
      },
      {
        word: "tanah liat",
        en: "clay",
        vi: "dat set",
        pos: "noun phrase",
        pronunciation_vi: "TA-nah LI-at",
        pronunciation_en: "TA-nah LEE-at",
      },
      {
        word: "alat kerja",
        en: "work tools",
        vi: "dung cu lam viec",
        pos: "noun phrase",
        pronunciation_vi: "A-lat KER-ja",
        pronunciation_en: "A-lat KER-ja",
      },
      {
        word: "instruktur",
        en: "instructor",
        vi: "giang vien / nguoi huong dan",
        pos: "noun",
        pronunciation_vi: "in-STRUK-tur",
        pronunciation_en: "in-STROOK-toor",
      },
      {
        word: "hasil karya",
        en: "finished work / created piece",
        vi: "tac pham / san pham da lam",
        pos: "noun phrase",
        pronunciation_vi: "HA-sil KAR-ya",
        pronunciation_en: "HA-sil KAR-ya",
      },
      {
        word: "biaya kelas",
        en: "class fee",
        vi: "phi lop / hoc phi",
        pos: "noun phrase",
        pronunciation_vi: "bi-A-ya KE-las",
        pronunciation_en: "bee-A-ya KEH-las",
      },
    ],
    dialogue: [
      {
        speaker: "Peserta",
        text: "Permisi, workshop batik ini cocok untuk pemula?",
        vi: "Xin hoi, workshop batik nay co phu hop cho nguoi moi bat dau khong?",
        en: "Excuse me, is this batik workshop suitable for beginners?",
      },
      {
        speaker: "Instruktur",
        text: "Cocok. Nanti saya ajarkan teknik dasar dan cara memakai canting.",
        vi: "Phu hop. Lat nua toi se day ky thuat co ban va cach dung canting.",
        en: "Yes. Later I will teach basic techniques and how to use the canting.",
      },
      {
        speaker: "Peserta",
        text: "Biaya kelas sudah termasuk bahan dan alat?",
        vi: "Phi lop da bao gom vat lieu va dung cu chua?",
        en: "Does the class fee already include materials and tools?",
      },
      {
        speaker: "Instruktur",
        text: "Sudah. Hasil karya peserta juga boleh dibawa pulang.",
        vi: "Da bao gom. Tac pham cua hoc vien cung co the mang ve nha.",
        en: "Yes. Participants may also take their finished work home.",
      },
      {
        speaker: "Peserta",
        text: "Kalau motif saya belum rapi, boleh minta bantuan?",
        vi: "Neu hoa tiet cua toi chua dep, toi co the nho giup khong?",
        en: "If my pattern is not neat yet, may I ask for help?",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dich sang tieng Indonesia: Workshop nay co phu hop cho nguoi moi bat dau khong?",
        prompt_en: "Translate into Indonesian: Is this workshop suitable for beginners?",
        answer: "Workshop ini cocok untuk pemula?",
      },
      {
        type: "fill_blank",
        prompt_vi: "Dien tu: Biaya kelas sudah termasuk bahan dan ___.",
        prompt_en: "Fill in the blank: Biaya kelas sudah termasuk bahan dan ___.",
        answer: "alat",
      },
      {
        type: "translation",
        prompt_vi: "Dich sang tieng Indonesia: Tac pham cua hoc vien co the mang ve nha.",
        prompt_en: "Translate into Indonesian: Participants' finished work may be taken home.",
        answer: "Hasil karya peserta boleh dibawa pulang.",
      },
      {
        type: "roleplay",
        prompt_vi: "Ban dang o workshop batik. Hay hoi giang vien cach dung canting.",
        prompt_en: "You are at a batik workshop. Ask the instructor how to use the canting.",
        answer: "Bagaimana cara memakai canting?",
      },
    ],
  },
];
