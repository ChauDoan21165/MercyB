// Office confidentiality / NDA Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file following the established Indonesian extra
// format. The `en` field holds TARGET-LANGUAGE Indonesian, `vi` holds the
// Vietnamese gloss, and pronunciation_focus carries Vietnamese L1 notes with
// English companion explanations in the same order.

type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

type IndonesianVocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type IndonesianDialogueLine = {
  cell_id?: string;
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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_office_confidentiality_nda",
    level: "B1",
    category: "work_business",
    title_vi: "Bảo mật công ty và NDA",
    title_en: "Office confidentiality and NDA",
    sentences: [
      {
        en: "Sebelum mulai bekerja, saya harus menandatangani NDA.",
        vi: "Trước khi bắt đầu làm việc, tôi phải ký NDA.",
        pronunciation_focus: [
          "`menandatangani` = ký; đây là bentuk formal dari `tanda tangan`.",
          "`NDA` sering diucapkan per huruf: en-de-a. Di kantor, istilah ini umum untuk perjanjian rahasia.",
          "Lỗi người Việt: nói `sign NDA` camp tiếng Anh. Dalam bahasa kerja Indonesia, `menandatangani NDA` lebih rapi.",
        ],
        pronunciation_focus_en: [
          "`menandatangani` means to sign; it is the formal verb from `tanda tangan`.",
          "`NDA` is often spelled out letter by letter: en-de-a. In offices, it is a common term for a confidentiality agreement.",
          "VN-speaker trap: mixing in `sign NDA`. In Indonesian work language, `menandatangani NDA` is cleaner.",
        ],
      },
      {
        en: "Perusahaan kami punya aturan tentang rahasia perusahaan.",
        vi: "Công ty chúng tôi có quy định về bí mật công ty.",
        pronunciation_focus: [
          "`rahasia perusahaan` = bí mật công ty; cụm này sangat umum di kantor.",
          "`punya aturan tentang` = có quy định về; cách nói thẳng dan natural.",
          "Lỗi người Việt: dùng `secret perusahaan`. `Rahasia perusahaan` là cụm chuẩn và tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "`rahasia perusahaan` means company secrets; a very common office phrase.",
          "`punya aturan tentang` means has rules about; a direct and natural way to say it.",
          "VN-speaker trap: using `secret perusahaan`. `Rahasia perusahaan` is the standard natural phrase.",
        ],
      },
      {
        en: "Data klien tidak boleh dibagikan ke luar tim.",
        vi: "Dữ liệu khách hàng không được chia sẻ ra ngoài nhóm.",
        pronunciation_focus: [
          "`data klien` = dữ liệu khách hàng; `klien` dipakai untuk client/customer trong konteks bisnis.",
          "`ke luar tim` = ra ngoài nhóm; lebih natural daripada `keluar tim`.",
          "Lỗi người Việt: nói `share data` terlalu mentah. Untuk aturan kerja, gunakan `dibagikan`.",
        ],
        pronunciation_focus_en: [
          "`data klien` means client/customer data; `klien` is used in business contexts.",
          "`ke luar tim` means outside the team; more natural than `keluar tim`.",
          "VN-speaker trap: using raw `share data`. For work rules, use `dibagikan`.",
        ],
      },
      {
        en: "Dokumen sensitif harus disimpan di folder yang aman.",
        vi: "Tài liệu nhạy cảm phải được lưu trong thư mục an toàn.",
        pronunciation_focus: [
          "`dokumen sensitif` = tài liệu nhạy cảm; bisa berupa kontrak, laporan, hoặc data internal.",
          "`disimpan` = được lưu/để; bentuk pasif cocok untuk instruksi kantor.",
          "Lỗi người Việt: nói `dokumen penting` untuk semua hal. `Sensitif` lebih tepat kalau tidak semua orang boleh lihat.",
        ],
        pronunciation_focus_en: [
          "`dokumen sensitif` means sensitive documents; this can be contracts, reports, or internal data.",
          "`disimpan` means stored/saved; passive form fits office instructions.",
          "VN-speaker trap: using `dokumen penting` for everything. `Sensitif` is more accurate when not everyone may see it.",
        ],
      },
      {
        en: "Siapa yang punya izin akses ke file ini?",
        vi: "Ai có quyền truy cập vào tệp này?",
        pronunciation_focus: [
          "`izin akses` = quyền truy cập; `punya izin` = có quyền/được phép.",
          "`ke file ini` = vào tệp này; saat bertanya akses, `ke` dipakai untuk tujuan menuju file.",
          "Lỗi người Việt: nói `boleh buka file?` terlalu umum. `Izin akses` lebih tepat untuk data dan sistem.",
        ],
        pronunciation_focus_en: [
          "`izin akses` means access permission; `punya izin` means has permission/is allowed.",
          "`ke file ini` means to this file; when asking about access, `ke` marks the target file.",
          "VN-speaker trap: `boleh buka file?` is too general. `Izin akses` is more precise for data and systems.",
        ],
      },
      {
        en: "Saya tidak boleh membocorkan informasi internal.",
        vi: "Tôi không được làm rò rỉ thông tin nội bộ.",
        pronunciation_focus: [
          "`membocorkan` = làm lộ, làm rò rỉ; kata kerja penting untuk confidentiality.",
          "`informasi internal` = thông tin nội bộ; `internal` sering dipakai langsung di kantor.",
          "Lỗi người Việt: nói `bocor informasi` như noun phrase. Bentuk verban yang natural adalah `membocorkan informasi`.",
        ],
        pronunciation_focus_en: [
          "`membocorkan` means leak/reveal; an important verb for confidentiality.",
          "`informasi internal` means internal information; `internal` is commonly used as a loanword in offices.",
          "VN-speaker trap: using `bocor informasi` like a noun phrase. The natural verb form is `membocorkan informasi`.",
        ],
      },
      {
        en: "Kalau ada pertanyaan, tolong tanya atasan dulu.",
        vi: "Nếu có câu hỏi, vui lòng hỏi cấp trên trước.",
        pronunciation_focus: [
          "`atasan` = sếp, cấp trên; sangat umum dalam konteks kerja.",
          "`tanya atasan dulu` = hỏi sếp trước đã; cocok kalau masalahnya menyangkut akses atau izin.",
          "Lỗi người Việt: langsung tanya ke semua orang. Dalam urusan rahasia, jangan sebar pertanyaan ke banyak orang.",
        ],
        pronunciation_focus_en: [
          "`atasan` means boss/superior; very common in workplace contexts.",
          "`tanya atasan dulu` means ask the boss first; suitable when the issue concerns access or permission.",
          "VN-speaker trap: asking everyone immediately. For confidentiality matters, do not spread the question too widely.",
        ],
      },
      {
        en: "Tanggung jawab kerja saya termasuk menjaga kerahasiaan data.",
        vi: "Trách nhiệm công việc của tôi bao gồm việc giữ bí mật dữ liệu.",
        pronunciation_focus: [
          "`tanggung jawab kerja` = trách nhiệm công việc; cụm formal di deskripsi pekerjaan.",
          "`menjaga kerahasiaan` = giữ bí mật/bảo mật; kata kunci penting dalam NDA.",
          "Lỗi người Việt: bỏ `menjaga` rồi chỉ nói `kerahasiaan data`. Verb membuat kalimat lebih lengkap dan profesional.",
        ],
        pronunciation_focus_en: [
          "`tanggung jawab kerja` means job responsibility; a formal phrase in job descriptions.",
          "`menjaga kerahasiaan` means maintain confidentiality; a key NDA phrase.",
          "VN-speaker trap: dropping `menjaga` and only saying `kerahasiaan data`. The verb makes the sentence complete and professional.",
        ],
      },
      {
        en: "Saya perlu izin tertulis sebelum berbagi dokumen itu.",
        vi: "Tôi cần sự cho phép bằng văn bản trước khi chia sẻ tài liệu đó.",
        pronunciation_focus: [
          "`izin tertulis` = giấy phép bằng văn bản; penting ketika akses harus dicatat.",
          "`berbagi dokumen` = chia sẻ tài liệu; lebih natural daripada `share dokumen`.",
          "Lỗi người Việt: anggap semua izin cukup lisan. Untuk data sensitif, `tertulis` lebih aman dan resmi.",
        ],
        pronunciation_focus_en: [
          "`izin tertulis` means written permission; important when access must be recorded.",
          "`berbagi dokumen` means share documents; more natural than `share dokumen`.",
          "VN-speaker trap: assuming verbal permission is always enough. For sensitive data, `tertulis` is safer and more official.",
        ],
      },
      {
        en: "Mohon jangan kirim file sensitif lewat chat biasa.",
        vi: "Làm ơn đừng gửi tệp nhạy cảm qua chat thường.",
        pronunciation_focus: [
          "`mohon jangan` = xin đừng; rất kuat nhưng tetap sopan.",
          "`lewat chat biasa` = qua chat thường; mengingatkan bahwa kanal komunikasi juga penting untuk keamanan data.",
          "Lỗi người Việt: nghĩ chat pribadi selalu aman. Dalam kerja kantor, pilih saluran yang memang disetujui perusahaan.",
        ],
        pronunciation_focus_en: [
          "`mohon jangan` means please do not; strong but still polite.",
          "`lewat chat biasa` means through ordinary chat; it reminds us that communication channels matter for data safety.",
          "VN-speaker trap: assuming private chat is always safe. In office work, use the channel approved by the company.",
        ],
      },
    ],
    cultural_notes_vi:
      "Di kantor Indonesia, NDA dan aturan kerahasiaan sering dibahas saat onboarding, saat menangani data klien, atau saat bekerja dengan proyek internal. Kalimat penting biasanya berpusat pada `izin akses`, `dokumen sensitif`, `menjaga kerahasiaan`, dan `tanggung jawab kerja`. Dalam budaya kerja, orang sering menghindari nada menuduh; lebih aman mengatakan apa yang boleh dan tidak boleh dilakukan. Jika tidak yakin, minta konfirmasi tertulis dari atasan atau HR.",
    cultural_notes_en:
      "In Indonesian offices, NDAs and confidentiality rules are often discussed during onboarding, when handling client data, or when working on internal projects. Important phrases usually center on `izin akses`, `dokumen sensitif`, `menjaga kerahasiaan`, and `tanggung jawab kerja`. In workplace culture, people often avoid accusatory tones; it is safer to state what can and cannot be done. If unsure, ask your supervisor or HR for written confirmation.",
    tip_advice_vi:
      "Khung an toàn: `Saya perlu izin tertulis`, `Siapa yang punya izin akses?`, `Mohon jangan kirim file sensitif lewat chat biasa`, `Tanggung jawab kerja saya termasuk menjaga kerahasiaan data`. Jika ragu, pakai `mohon` dan `silakan konfirmasi` untuk tetap profesional.",
    tip_advice_en:
      "Safe frames: `Saya perlu izin tertulis`, `Siapa yang punya izin akses?`, `Mohon jangan kirim file sensitif lewat chat biasa`, `Tanggung jawab kerja saya termasuk menjaga kerahasiaan data`. If in doubt, use `mohon` and `silakan konfirmasi` to stay professional.",
    vocabulary: [
      {
        cell_id: "b671f378-b57d-43dc-b47f-16fc9f840bba",
        word: "rahasia perusahaan",
        en: "company secret",
        vi: "bí mật công ty",
        pos: "noun phrase",
        pronunciation_vi: "ra-HA-si-a per-u-SA-ha-an",
        pronunciation_en: "rah-HAH-see-ah per-oo-SAH-hah-an",
      },
      {
        cell_id: "d917e2ad-3a57-46f2-8d6a-68224df0293a",
        word: "NDA",
        en: "non-disclosure agreement",
        vi: "thỏa thuận bảo mật",
        pos: "noun abbreviation",
        pronunciation_vi: "en-de-a",
        pronunciation_en: "en-deh-AH",
      },
      {
        cell_id: "0298799f-c3a7-4949-9e3a-6a5bd0c6ee5f",
        word: "data klien",
        en: "client data",
        vi: "dữ liệu khách hàng",
        pos: "noun phrase",
        pronunciation_vi: "DA-ta KLI-en",
        pronunciation_en: "DAH-tah KLEE-ehn",
      },
      {
        cell_id: "a8315595-0952-4e4b-a3c8-7b15423c3a1a",
        word: "dokumen sensitif",
        en: "sensitive document",
        vi: "tài liệu nhạy cảm",
        pos: "noun phrase",
        pronunciation_vi: "do-ku-MEN sen-si-TIF",
        pronunciation_en: "do-KOO-men sen-see-TEEF",
      },
      {
        cell_id: "26baad03-a6ec-4db7-a925-dad16fdaf31c",
        word: "izin akses",
        en: "access permission",
        vi: "quyền truy cập",
        pos: "noun phrase",
        pronunciation_vi: "I-zin AK-ses",
        pronunciation_en: "EE-zeen AK-ses",
      },
      {
        cell_id: "7f6b4d9d-d1af-4b03-8570-a2f6e3eb42fb",
        word: "membocorkan informasi",
        en: "to leak information",
        vi: "làm rò rỉ thông tin",
        pos: "verb phrase",
        pronunciation_vi: "mem-bo-KOR-kan in-for-MA-si",
        pronunciation_en: "mem-boh-KOR-kan in-for-MAH-see",
      },
      {
        cell_id: "22fa858d-2ccc-4d90-bb1b-0ae1c656a493",
        word: "kerahasiaan",
        en: "confidentiality",
        vi: "tính bảo mật",
        pos: "noun",
        pronunciation_vi: "ke-ra-ha-si-A-an",
        pronunciation_en: "keh-rah-hah-see-AH-an",
      },
      {
        cell_id: "7e0580d3-54f1-43c5-89f1-7be01268112c",
        word: "tanggung jawab kerja",
        en: "work responsibility",
        vi: "trách nhiệm công việc",
        pos: "noun phrase",
        pronunciation_vi: "TANG-gung JA-wab KER-ja",
        pronunciation_en: "TAHNG-goong JAH-wab KER-jah",
      },
    ],
    dialogue: [
      {
        cell_id: "635b3a98-122d-49ec-a061-64dbde0aac93",
        speaker: "HR",
        text: "Sebelum mulai bekerja, Anda perlu menandatangani NDA.",
        vi: "Trước khi bắt đầu làm việc, bạn cần ký NDA.",
        en: "Before starting work, you need to sign the NDA.",
      },
      {
        cell_id: "f34e62a1-6168-4814-a33c-eb74cfb9da11",
        speaker: "Karyawan",
        text: "Baik. Apakah saya boleh melihat dokumen sensitif itu?",
        vi: "Được. Tôi có thể xem tài liệu nhạy cảm đó không?",
        en: "Okay. Am I allowed to see that sensitive document?",
      },
      {
        cell_id: "3ea22bd2-cabc-4c08-9236-5ed9d0052650",
        speaker: "Atasan",
        text: "Belum. Anda perlu izin akses dulu dari tim legal.",
        vi: "Chưa. Bạn cần quyền truy cập trước từ nhóm pháp lý.",
        en: "Not yet. You need access permission first from the legal team.",
      },
      {
        cell_id: "ce2b8f3d-ad65-4cfa-b47c-01c96f0c279f",
        speaker: "Karyawan",
        text: "Mengerti. Saya akan menjaga kerahasiaan data klien.",
        vi: "Hiểu rồi. Tôi sẽ giữ bí mật dữ liệu khách hàng.",
        en: "Understood. I will keep the client data confidential.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi cần sự cho phép bằng văn bản.",
        prompt_en: "Translate into Indonesian: I need written permission.",
        answer: "Saya perlu izin tertulis.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ còn thiếu: Data klien tidak boleh ____ ke luar tim.",
        prompt_en: "Fill in the blank: Data klien tidak boleh ____ ke luar tim.",
        answer: "dibagikan",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Cụm nào nghĩa là “thông tin nội bộ”?",
        prompt_en: "Which phrase means “internal information”?",
        choices: ["informasi internal", "izin akses", "tanggung jawab kerja"],
        answer: "informasi internal",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `menjaga kerahasiaan` = ?",
        prompt_en: "Match the meaning: `menjaga kerahasiaan` = ?",
        answer: "maintain confidentiality",
      },
    ],
  },
];

export default lessons;
