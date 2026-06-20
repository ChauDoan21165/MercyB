// Indonesian pesantren / boarding school lesson pack for Vietnamese learners.
//
// Field convention: `en` holds the Indonesian target sentence, `vi` holds the
// Vietnamese gloss, and the two pronunciation arrays carry Vietnamese L1 notes
// plus English companion explanations in matching order.

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

export const boardingSchoolPesantrenLessons: IndonesianLesson[] = [
  {
    id: "indonesian_pesantren_daily_life",
    level: "A2",
    category: "education_culture",
    title_vi: "Đời sống hằng ngày trong pesantren",
    title_en: "Daily life in a pesantren",
    sentences: [
      {
        en: "Adik saya tinggal di asrama pesantren.",
        vi: "Em tôi sống trong ký túc xá của trường nội trú Hồi giáo.",
        pronunciation_focus: [
          "A-dik SA-ya TING-gal di as-RA-ma pe-SAN-tren — `pesantren` là trường nội trú Hồi giáo.",
          "L1 Việt: `tinggal di` = sống/ở tại. Đừng dùng `tinggal ke`; `ke` là hướng đi.",
          "Từ khóa: `asrama` = ký túc xá; đọc rõ âm cuối trong `pesantren`, không nuốt `n`.",
        ],
        pronunciation_focus_en: [
          "A-dik SA-ya TING-gal di as-RA-ma pe-SAN-tren — `pesantren` is an Islamic boarding school.",
          "VN-speaker trap: `tinggal di` = live/stay at. Do not use `tinggal ke`; `ke` marks direction.",
          "Key word: `asrama` = dormitory; sound the final `n` in `pesantren` clearly.",
        ],
      },
      {
        en: "Para santri belajar dengan ustaz setiap malam.",
        vi: "Các học viên pesantren học với thầy ustaz mỗi tối.",
        pronunciation_focus: [
          "PA-ra SAN-tri be-LA-jar DE-ngan US-taz se-TI-ap MA-lam.",
          "`santri` là học viên trong pesantren; không phải lúc nào cũng dịch bằng `siswa`.",
          "L1 Việt: `dengan` = với/bằng. Ở đây là `học với ustaz`, không phải dụng cụ.",
        ],
        pronunciation_focus_en: [
          "PA-ra SAN-tri be-LA-jar DE-ngan US-taz se-TI-ap MA-lam.",
          "`santri` means a student in a pesantren; do not automatically replace it with `siswa`.",
          "VN-speaker note: `dengan` can mean with/by means of. Here it means studying with an ustaz.",
        ],
      },
      {
        en: "Jadwal belajar dimulai setelah salat Subuh.",
        vi: "Lịch học bắt đầu sau buổi cầu nguyện Subuh.",
        pronunciation_focus: [
          "JAD-wal be-LA-jar di-MU-lai se-TE-lah SA-lat SU-buh.",
          "`dimulai` = được bắt đầu/bắt đầu; tiền tố `di-` thường tạo nghĩa bị động.",
          "L1 Việt: `setelah` = sau khi/sau. Đừng đảo thành `belajar jadwal`; đúng là `jadwal belajar`.",
        ],
        pronunciation_focus_en: [
          "JAD-wal be-LA-jar di-MU-lai se-TE-lah SA-lat SU-buh.",
          "`dimulai` = is started / begins; the `di-` prefix often marks passive meaning.",
          "VN-speaker trap: `setelah` = after. Keep the noun phrase as `jadwal belajar`, not `belajar jadwal`.",
        ],
      },
      {
        en: "Kegiatan harian di pesantren cukup padat.",
        vi: "Hoạt động hằng ngày ở pesantren khá dày đặc.",
        pronunciation_focus: [
          "ke-gi-A-tan ha-ri-AN di pe-SAN-tren CU-kup PA-dat.",
          "`harian` = hằng ngày; `cukup` = khá/đủ; `padat` = kín lịch/dày đặc.",
          "L1 Việt: chữ `c` trong `cukup` đọc như 'ch' nhẹ: CU-kup, không đọc như /k/.",
        ],
        pronunciation_focus_en: [
          "ke-gi-A-tan ha-ri-AN di pe-SAN-tren CU-kup PA-dat.",
          "`harian` = daily; `cukup` = quite/enough; `padat` = packed or dense.",
          "VN-speaker note: Indonesian `c` in `cukup` sounds like a light 'ch', not /k/.",
        ],
      },
      {
        en: "Saya harus mengikuti peraturan asrama.",
        vi: "Tôi phải tuân theo nội quy ký túc xá.",
        pronunciation_focus: [
          "SA-ya HA-rus me-ngi-KU-ti pe-ra-TU-ran as-RA-ma.",
          "`harus` = phải; `mengikuti peraturan` = tuân theo quy định/nội quy.",
          "L1 Việt: đừng dịch từng chữ `theo luật` thành `ikut aturan` trong văn cảnh lịch sự; dùng `mengikuti peraturan`.",
        ],
        pronunciation_focus_en: [
          "SA-ya HA-rus me-ngi-KU-ti pe-ra-TU-ran as-RA-ma.",
          "`harus` = must; `mengikuti peraturan` = to follow rules/regulations.",
          "VN-speaker trap: for polite institutional language, prefer `mengikuti peraturan` over casual `ikut aturan`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Pesantren là trường nội trú Hồi giáo, nơi santri sống trong asrama, học chương trình phổ thông hoặc tôn giáo tùy trường, và sinh hoạt theo lịch chung. Một số pesantren truyền thống nhấn mạnh học kitab và adab, còn pesantren hiện đại có thể có chương trình giống trường phổ thông. Khi nói chuyện, dùng `ustaz` cho thầy, `ustazah` cho cô, và giữ giọng lịch sự.",
    cultural_notes_en:
      "A pesantren is an Islamic boarding school where santri live in dormitories, study either general or religious subjects depending on the school, and follow a shared daily schedule. Traditional pesantren may emphasize kitab study and adab, while modern pesantren can resemble regular schools. Use `ustaz` for a male teacher, `ustazah` for a female teacher, and keep a respectful tone.",
    tip_advice_vi:
      "Mẹo cho người Việt: trong văn cảnh pesantren, `santri` chính xác hơn `siswa`. Học cặp cố định: `tinggal di asrama`, `belajar dengan ustaz`, `mengikuti peraturan`, `kegiatan harian`. Tiếng Indonesia không chia động từ, nên tập trung vào giới từ `di`, `ke`, `dengan`, `setelah`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: in a pesantren context, `santri` is more precise than `siswa`. Learn fixed chunks: `tinggal di asrama`, `belajar dengan ustaz`, `mengikuti peraturan`, `kegiatan harian`. Indonesian has no verb conjugation, so focus on prepositions like `di`, `ke`, `dengan`, and `setelah`.",
    vocabulary: [
      {
        word: "pesantren",
        en: "Islamic boarding school",
        vi: "trường nội trú Hồi giáo",
        pos: "noun",
        pronunciation_vi: "pe-SAN-tren",
        pronunciation_en: "pe-SAN-tren",
      },
      {
        word: "asrama",
        en: "dormitory",
        vi: "ký túc xá",
        pos: "noun",
        pronunciation_vi: "as-RA-ma",
        pronunciation_en: "as-RA-ma",
      },
      {
        word: "santri",
        en: "pesantren student",
        vi: "học viên pesantren",
        pos: "noun",
        pronunciation_vi: "SAN-tri",
        pronunciation_en: "SAN-tree",
      },
      {
        word: "ustaz / ustazah",
        en: "male / female Islamic teacher",
        vi: "thầy / cô giáo tôn giáo Hồi giáo",
        pos: "noun",
        pronunciation_vi: "US-taz / us-TA-zah",
        pronunciation_en: "OOS-taz / oos-TA-zah",
      },
      {
        word: "jadwal belajar",
        en: "study schedule",
        vi: "lịch học",
        pos: "noun phrase",
        pronunciation_vi: "JAD-wal be-LA-jar",
        pronunciation_en: "JAD-wal be-LA-jar",
      },
      {
        word: "kegiatan harian",
        en: "daily activities",
        vi: "hoạt động hằng ngày",
        pos: "noun phrase",
        pronunciation_vi: "ke-gi-A-tan ha-ri-AN",
        pronunciation_en: "ke-gee-A-tan ha-ree-AN",
      },
    ],
    dialogue: [
      {
        speaker: "Mai",
        text: "Adikmu tinggal di mana sekarang?",
        vi: "Em của bạn bây giờ sống ở đâu?",
        en: "Where does your younger sibling live now?",
      },
      {
        speaker: "Rafi",
        text: "Dia tinggal di asrama pesantren.",
        vi: "Em ấy sống trong ký túc xá pesantren.",
        en: "They live in a pesantren dormitory.",
      },
      {
        speaker: "Mai",
        text: "Jadwalnya padat?",
        vi: "Lịch có dày không?",
        en: "Is the schedule packed?",
      },
      {
        speaker: "Rafi",
        text: "Iya, para santri belajar setelah Subuh sampai malam.",
        vi: "Ừ, các santri học từ sau Subuh đến tối.",
        en: "Yes, the santri study from after Subuh until night.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ phù hợp về đời sống pesantren:",
        instruction_en: "Fill in the suitable pesantren daily-life word:",
        items: [
          {
            prompt: "Adik saya tinggal di ___ pesantren. (ký túc xá)",
            answer: "asrama",
            options: ["asrama", "pasar", "terminal"],
          },
          {
            prompt: "Para ___ belajar dengan ustaz setiap malam. (học viên pesantren)",
            answer: "santri",
            options: ["santri", "supir", "dokter"],
          },
          {
            prompt: "Kegiatan harian di pesantren cukup ___. (dày đặc)",
            answer: "padat",
            options: ["padat", "murah", "kosong"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Em tôi sống trong ký túc xá pesantren.", answer: "Adik saya tinggal di asrama pesantren." },
          { prompt: "Các santri học với ustaz mỗi tối.", answer: "Para santri belajar dengan ustaz setiap malam." },
          { prompt: "Tôi phải tuân theo nội quy ký túc xá.", answer: "Saya harus mengikuti peraturan asrama." },
        ],
      },
    ],
  },
  {
    id: "indonesian_pesantren_permission_home",
    level: "B1",
    category: "education_culture",
    title_vi: "Xin phép về nhà từ pesantren",
    title_en: "Asking permission to go home from a pesantren",
    sentences: [
      {
        en: "Saya mau minta izin pulang akhir pekan ini.",
        vi: "Tôi muốn xin phép về nhà cuối tuần này.",
        pronunciation_focus: [
          "SA-ya MAU MIN-ta I-zin PU-lang A-khir PE-kan I-ni.",
          "`minta izin` = xin phép; `pulang` = về nhà/quay về chỗ ở.",
          "L1 Việt: `mau` thân mật hơn `ingin`; với quản lý asrama có thể nói `Saya ingin minta izin...` để lịch sự hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU MIN-ta I-zin PU-lang A-khir PE-kan I-ni.",
          "`minta izin` = ask permission; `pulang` = go home/return to one's place.",
          "VN-speaker note: `mau` is casual; with dorm staff, `Saya ingin minta izin...` sounds more polite.",
        ],
      },
      {
        en: "Orang tua harus menghubungi pengurus asrama.",
        vi: "Phụ huynh phải liên hệ với người phụ trách ký túc xá.",
        pronunciation_focus: [
          "O-rang TU-a HA-rus meng-hu-BUNG-i pe-NGU-rus as-RA-ma.",
          "`pengurus asrama` = người phụ trách/quản lý ký túc xá.",
          "L1 Việt: `orang tua` trong ngữ cảnh trường học = cha mẹ/phụ huynh, không phải 'người già'.",
        ],
        pronunciation_focus_en: [
          "O-rang TU-a HA-rus meng-hu-BUNG-i pe-NGU-rus as-RA-ma.",
          "`pengurus asrama` = dormitory administrator or person in charge.",
          "VN-speaker trap: in school contexts, `orang tua` means parents/guardians, not elderly people.",
        ],
      },
      {
        en: "Izin pulang harus dicatat di buku izin.",
        vi: "Việc xin phép về nhà phải được ghi vào sổ phép.",
        pronunciation_focus: [
          "I-zin PU-lang HA-rus di-CA-tat di BU-ku I-zin.",
          "`dicatat` = được ghi lại; chữ `c` đọc như 'ch': di-CA-tat.",
          "L1 Việt: mẫu bị động `harus dicatat` rất tự nhiên trong quy định hành chính.",
        ],
        pronunciation_focus_en: [
          "I-zin PU-lang HA-rus di-CA-tat di BU-ku I-zin.",
          "`dicatat` = is recorded; Indonesian `c` sounds like 'ch': di-CA-tat.",
          "VN-speaker note: the passive pattern `harus dicatat` is very natural in administrative rules.",
        ],
      },
      {
        en: "Santri kembali ke pesantren sebelum Magrib.",
        vi: "Santri quay lại pesantren trước Magrib.",
        pronunciation_focus: [
          "SAN-tri kem-BA-li ke pe-SAN-tren se-BE-lum MAG-rib.",
          "`kembali ke` = quay lại đến; `sebelum` = trước khi/trước mốc thời gian.",
          "L1 Việt: dùng `ke` cho hướng quay lại pesantren; dùng `di` khi đã ở đó.",
        ],
        pronunciation_focus_en: [
          "SAN-tri kem-BA-li ke pe-SAN-tren se-BE-lum MAG-rib.",
          "`kembali ke` = return to; `sebelum` = before a time or event.",
          "VN-speaker trap: use `ke` for direction back to the pesantren; use `di` once located there.",
        ],
      },
      {
        en: "Kalau sakit, saya perlu surat keterangan dokter.",
        vi: "Nếu bị bệnh, tôi cần giấy xác nhận của bác sĩ.",
        pronunciation_focus: [
          "KA-lau SA-kit SA-ya per-LU SU-rat ke-te-RANG-an DOK-ter.",
          "`surat keterangan dokter` = giấy xác nhận/giấy chứng nhận của bác sĩ.",
          "L1 Việt: `perlu` = cần. Không cần thêm động từ `membutuhkan` trong câu đơn giản này.",
        ],
        pronunciation_focus_en: [
          "KA-lau SA-kit SA-ya per-LU SU-rat ke-te-RANG-an DOK-ter.",
          "`surat keterangan dokter` = doctor's note / medical certificate.",
          "VN-speaker note: `perlu` = need. You do not need a heavier verb like `membutuhkan` here.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở nhiều pesantren, santri không tự ý rời khu asrama. Việc `izin pulang` thường cần thông báo trước, được pengurus ghi vào sổ, và đôi khi cần xác nhận từ orang tua/wali santri. Giờ quay lại thường gắn với jadwal salat, giờ học, hoặc nội quy từng trường.",
    cultural_notes_en:
      "In many pesantren, santri cannot leave the dormitory area without permission. `Izin pulang` usually needs advance notice, is recorded by the administrator, and may require confirmation from a parent or guardian. Return times are often tied to prayer schedules, study schedules, or each school's dorm rules.",
    tip_advice_vi:
      "Mẫu lịch sự nên học nguyên câu: `Saya ingin minta izin pulang...`, `Orang tua saya bisa menghubungi pengurus`, `Saya akan kembali sebelum...`. Người Việt hay nhầm `orang tua` là người già; trong trường học nó thường là phụ huynh.",
    tip_advice_en:
      "Useful polite chunks: `Saya ingin minta izin pulang...`, `Orang tua saya bisa menghubungi pengurus`, `Saya akan kembali sebelum...`. Vietnamese speakers often read `orang tua` as elderly people; in school contexts it usually means parents.",
    vocabulary: [
      {
        word: "minta izin",
        en: "to ask permission",
        vi: "xin phép",
        pos: "verb phrase",
        pronunciation_vi: "MIN-ta I-zin",
        pronunciation_en: "MIN-ta EE-zin",
      },
      {
        word: "izin pulang",
        en: "permission to go home",
        vi: "phép về nhà",
        pos: "noun phrase",
        pronunciation_vi: "I-zin PU-lang",
        pronunciation_en: "EE-zin POO-lang",
      },
      {
        word: "pengurus asrama",
        en: "dormitory administrator",
        vi: "người phụ trách ký túc xá",
        pos: "noun phrase",
        pronunciation_vi: "pe-NGU-rus as-RA-ma",
        pronunciation_en: "pe-NGOO-roos as-RA-ma",
      },
      {
        word: "wali santri",
        en: "guardian of a pesantren student",
        vi: "người giám hộ/phụ huynh của santri",
        pos: "noun phrase",
        pronunciation_vi: "WA-li SAN-tri",
        pronunciation_en: "WA-lee SAN-tree",
      },
      {
        word: "buku izin",
        en: "permission logbook",
        vi: "sổ phép",
        pos: "noun phrase",
        pronunciation_vi: "BU-ku I-zin",
        pronunciation_en: "BOO-koo EE-zin",
      },
      {
        word: "surat keterangan dokter",
        en: "doctor's note",
        vi: "giấy xác nhận của bác sĩ",
        pos: "noun phrase",
        pronunciation_vi: "SU-rat ke-te-RANG-an DOK-ter",
        pronunciation_en: "SOO-rat ke-te-RANG-an DOK-ter",
      },
    ],
    dialogue: [
      {
        speaker: "Santri",
        text: "Ustaz, saya ingin minta izin pulang akhir pekan ini.",
        vi: "Thưa ustaz, em muốn xin phép về nhà cuối tuần này.",
        en: "Ustaz, I would like to ask permission to go home this weekend.",
      },
      {
        speaker: "Ustaz",
        text: "Apa orang tuamu sudah menghubungi pengurus asrama?",
        vi: "Phụ huynh của em đã liên hệ người phụ trách ký túc xá chưa?",
        en: "Have your parents contacted the dormitory administrator?",
      },
      {
        speaker: "Santri",
        text: "Sudah, Ustaz. Izin pulangnya juga sudah dicatat.",
        vi: "Rồi ạ, thưa ustaz. Phép về nhà cũng đã được ghi lại.",
        en: "Yes, Ustaz. The home-leave permission has also been recorded.",
      },
      {
        speaker: "Ustaz",
        text: "Baik. Kembali ke pesantren sebelum Magrib, ya.",
        vi: "Được. Quay lại pesantren trước Magrib nhé.",
        en: "Good. Return to the pesantren before Magrib, okay?",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa tiếng Việt:",
        instruction_en: "Match each phrase with its Vietnamese meaning:",
        items: [
          { prompt: "minta izin", answer: "xin phép" },
          { prompt: "pengurus asrama", answer: "người phụ trách ký túc xá" },
          { prompt: "buku izin", answer: "sổ phép" },
          { prompt: "surat keterangan dokter", answer: "giấy xác nhận của bác sĩ" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Chọn từ đúng:",
        instruction_en: "Choose the correct word:",
        items: [
          {
            prompt: "Saya mau minta izin ___ akhir pekan ini. (về nhà)",
            answer: "pulang",
            options: ["pulang", "padat", "paham"],
          },
          {
            prompt: "Izin pulang harus ___ di buku izin. (được ghi)",
            answer: "dicatat",
            options: ["dicatat", "dimakan", "ditutup"],
          },
          {
            prompt: "Santri kembali ___ pesantren sebelum Magrib. (đến)",
            answer: "ke",
            options: ["ke", "di", "dari"],
          },
        ],
      },
    ],
  },
  {
    id: "indonesian_kitab_and_adab",
    level: "B1",
    category: "education_culture",
    title_vi: "Học kitab và adab trong pesantren",
    title_en: "Kitab study and adab in a pesantren",
    sentences: [
      {
        en: "Kami mengaji kitab setelah makan malam.",
        vi: "Chúng tôi học/đọc kitab sau bữa tối.",
        pronunciation_focus: [
          "KA-mi me-NGA-ji KI-tab se-TE-lah MA-kan MA-lam.",
          "`mengaji` = đọc/học văn bản tôn giáo; thường nghe dạng thân mật `ngaji`.",
          "L1 Việt: `kitab` trong pesantren thường là sách/văn bản tôn giáo, không chỉ là `buku` chung chung.",
        ],
        pronunciation_focus_en: [
          "KA-mi me-NGA-ji KI-tab se-TE-lah MA-kan MA-lam.",
          "`mengaji` = to recite or study religious texts; the casual form `ngaji` is common.",
          "VN-speaker note: in a pesantren, `kitab` usually means a religious text, not just any `buku`.",
        ],
      },
      {
        en: "Santri punya hafalan baru setiap minggu.",
        vi: "Santri có phần học thuộc mới mỗi tuần.",
        pronunciation_focus: [
          "SAN-tri PU-nya ha-FAL-an BA-ru se-TI-ap MING-gu.",
          "`hafalan` = phần thuộc lòng/việc ghi nhớ; gốc `hafal` = thuộc lòng.",
          "L1 Việt: `punya` thân mật = có. Trong văn viết trang trọng có thể dùng `memiliki`.",
        ],
        pronunciation_focus_en: [
          "SAN-tri PU-nya ha-FAL-an BA-ru se-TI-ap MING-gu.",
          "`hafalan` = memorized material / memorization; root `hafal` = know by heart.",
          "VN-speaker note: `punya` is everyday speech for have. Formal writing may use `memiliki`.",
        ],
      },
      {
        en: "Tolong bicara sopan kepada ustaz dan teman.",
        vi: "Làm ơn nói chuyện lịch sự với ustaz và bạn bè.",
        pronunciation_focus: [
          "TO-long bi-CA-ra SO-pan ke-PA-da US-taz dan TE-man.",
          "`sopan` = lịch sự/lễ phép; `kepada` trang trọng hơn `ke` khi nói với người.",
          "L1 Việt: đừng dùng `dengan` sau `bicara` khi muốn nhấn mạnh người nhận lời nói; `bicara kepada` rất rõ và lịch sự.",
        ],
        pronunciation_focus_en: [
          "TO-long bi-CA-ra SO-pan ke-PA-da US-taz dan TE-man.",
          "`sopan` = polite/respectful; `kepada` is more formal than `ke` for people.",
          "VN-speaker trap: after `bicara`, use `kepada` when highlighting the person addressed; it sounds clear and respectful.",
        ],
      },
      {
        en: "Kitab ini memakai bahasa Arab dan terjemahan Indonesia.",
        vi: "Kitab này dùng tiếng Ả Rập và bản dịch tiếng Indonesia.",
        pronunciation_focus: [
          "KI-tab I-ni me-MA-kai ba-HA-sa A-rab dan ter-je-MA-han in-do-NE-sia.",
          "`memakai` = dùng/sử dụng; `terjemahan` = bản dịch.",
          "L1 Việt: `bahasa Arab` = tiếng Ả Rập; đừng nói `Arab bahasa` theo thứ tự tiếng Việt.",
        ],
        pronunciation_focus_en: [
          "KI-tab I-ni me-MA-kai ba-HA-sa A-rab dan ter-je-MA-han in-do-NE-sia.",
          "`memakai` = use; `terjemahan` = translation.",
          "VN-speaker trap: `bahasa Arab` = Arabic language; do not reverse it as `Arab bahasa`.",
        ],
      },
      {
        en: "Saya belum paham pelajaran hari ini.",
        vi: "Tôi chưa hiểu bài học hôm nay.",
        pronunciation_focus: [
          "SA-ya be-LUM PA-ham pe-la-JA-ran HA-ri I-ni.",
          "`belum paham` = chưa hiểu; mềm hơn và chính xác hơn `tidak paham` khi bạn đang học.",
          "L1 Việt: tiếng Việt nói `chưa hiểu`; tiếng Indonesia cũng dùng `belum`, không dùng `tidak` cho việc còn đang tiến triển.",
        ],
        pronunciation_focus_en: [
          "SA-ya be-LUM PA-ham pe-la-JA-ran HA-ri I-ni.",
          "`belum paham` = do not understand yet; softer and more precise than `tidak paham` while learning.",
          "VN-speaker win: Vietnamese uses 'chưa hiểu'; Indonesian maps this neatly to `belum paham`, not `tidak paham`.",
        ],
      },
    ],
    cultural_notes_vi:
      "`Kitab` trong môi trường pesantren thường chỉ sách/văn bản học tôn giáo, đôi khi có tiếng Arab và phần terjemahan Indonesia. `Adab` là cách cư xử đúng mực: nói năng sopan, tôn trọng ustaz/ustazah, bạn học, giờ học và không gian chung. Không phải pesantren nào cũng giống nhau, nên hỏi nhẹ nhàng về quy định địa phương là cách an toàn.",
    cultural_notes_en:
      "In a pesantren, `kitab` often refers to religious study texts, sometimes with Arabic and Indonesian translation. `Adab` means proper conduct: speaking politely, respecting ustaz/ustazah, classmates, study time, and shared spaces. Not every pesantren follows the same routines, so asking politely about local rules is the safest approach.",
    tip_advice_vi:
      "Cụm nên thuộc: `mengaji kitab`, `punya hafalan`, `bicara sopan`, `belum paham`. Khi không hiểu bài, nói `Saya belum paham` lịch sự và tự nhiên hơn `Saya tidak mengerti` trong lớp học.",
    tip_advice_en:
      "Chunks to memorize: `mengaji kitab`, `punya hafalan`, `bicara sopan`, `belum paham`. In class, `Saya belum paham` sounds more polite and natural than `Saya tidak mengerti` when you are still learning.",
    vocabulary: [
      {
        word: "kitab",
        en: "religious text / book",
        vi: "sách/văn bản tôn giáo",
        pos: "noun",
        pronunciation_vi: "KI-tab",
        pronunciation_en: "KI-tab",
      },
      {
        word: "mengaji / ngaji",
        en: "to recite or study religious texts",
        vi: "đọc/học kinh sách tôn giáo",
        pos: "verb",
        pronunciation_vi: "me-NGA-ji / NGA-ji",
        pronunciation_en: "me-NGA-jee / NGA-jee",
      },
      {
        word: "hafalan",
        en: "memorized material",
        vi: "phần học thuộc",
        pos: "noun",
        pronunciation_vi: "ha-FAL-an",
        pronunciation_en: "ha-FAL-an",
      },
      {
        word: "adab",
        en: "proper manners / conduct",
        vi: "phép tắc / cách cư xử đúng mực",
        pos: "noun",
        pronunciation_vi: "A-dab",
        pronunciation_en: "A-dab",
      },
      {
        word: "sopan",
        en: "polite",
        vi: "lịch sự / lễ phép",
        pos: "adjective",
        pronunciation_vi: "SO-pan",
        pronunciation_en: "SO-pan",
      },
      {
        word: "belum paham",
        en: "do not understand yet",
        vi: "chưa hiểu",
        pos: "phrase",
        pronunciation_vi: "be-LUM PA-ham",
        pronunciation_en: "be-LOOM PA-ham",
      },
    ],
    dialogue: [
      {
        speaker: "Ustazah",
        text: "Malam ini kita mengaji kitab yang sama.",
        vi: "Tối nay chúng ta học cùng kitab đó.",
        en: "Tonight we will study the same kitab.",
      },
      {
        speaker: "Santri",
        text: "Ustazah, saya belum paham bagian ini.",
        vi: "Thưa ustazah, em chưa hiểu phần này.",
        en: "Ustazah, I do not understand this part yet.",
      },
      {
        speaker: "Ustazah",
        text: "Tidak apa-apa. Baca terjemahan Indonesia dulu.",
        vi: "Không sao. Hãy đọc bản dịch tiếng Indonesia trước.",
        en: "That's okay. Read the Indonesian translation first.",
      },
      {
        speaker: "Santri",
        text: "Baik, saya juga akan mengulang hafalan.",
        vi: "Vâng, em cũng sẽ ôn lại phần học thuộc.",
        en: "Okay, I will also review the memorized passage.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về học kitab và adab:",
        instruction_en: "Fill in the kitab and adab word:",
        items: [
          {
            prompt: "Kami ___ kitab setelah makan malam. (học/đọc)",
            answer: "mengaji",
            options: ["mengaji", "menjual", "menutup"],
          },
          {
            prompt: "Santri punya ___ baru setiap minggu. (phần học thuộc)",
            answer: "hafalan",
            options: ["hafalan", "halaman", "harga"],
          },
          {
            prompt: "Saya ___ paham pelajaran hari ini. (chưa)",
            answer: "belum",
            options: ["belum", "bukan", "jangan"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Chúng tôi học kitab sau bữa tối.", answer: "Kami mengaji kitab setelah makan malam." },
          { prompt: "Làm ơn nói chuyện lịch sự với ustaz.", answer: "Tolong bicara sopan kepada ustaz." },
          { prompt: "Tôi chưa hiểu bài học hôm nay.", answer: "Saya belum paham pelajaran hari ini." },
        ],
      },
    ],
  },
];
