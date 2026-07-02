// Child Birthday at School Indonesian (Vietnamese -> Indonesian study track).
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

export const childBirthdaySchoolLessons: IndonesianLesson[] = [
  {
    id: "indonesian_child_birthday_school",
    level: "A2",
    category: "childcare_parenting",
    title_vi: "Sinh nhật của con ở trường: xin phép cô giáo, bánh nhỏ và goodie bag",
    title_en: "A child's birthday at school: teacher permission, small cakes and goodie bags",
    sentences: [
      {
        en: "Besok anak saya ulang tahun di sekolah.",
        vi: "Ngày mai con tôi sinh nhật ở trường.",
        pronunciation_focus: [
          "`ulang tahun` = sinh nhật; nghĩa đen là năm lặp lại, nhưng dùng như danh từ sinh nhật.",
          "`di sekolah` = ở trường; đây là vị trí nên dùng `di`, không dùng `ke`.",
          "Lỗi người Việt: nói `anak saya punya ulang tahun`. Câu tự nhiên là `anak saya ulang tahun` hoặc `hari ulang tahun anak saya`.",
        ],
        pronunciation_focus_en: [
          "`ulang tahun` means birthday; literally 'repeat year', but it functions as a birthday noun.",
          "`di sekolah` means at school; it is a location, so use `di`, not `ke`.",
          "VN-speaker trap: saying `anak saya punya ulang tahun`. Natural phrasing is `anak saya ulang tahun` or `hari ulang tahun anak saya`.",
        ],
      },
      {
        en: "Bu Guru, apakah saya boleh membawa kue kecil untuk teman sekelasnya?",
        vi: "Cô ơi, tôi có được mang bánh nhỏ cho các bạn cùng lớp của bé không?",
        pronunciation_focus: [
          "`Bu Guru` = cô giáo; cách gọi lịch sự và thân thiện với giáo viên nữ.",
          "`boleh membawa` = được phép mang; hỏi luật/trường học thì dùng `boleh`, không phải `bisa`.",
          "Lỗi người Việt: dùng `teman kelas` thiếu `se-`. Bạn cùng lớp là `teman sekelas`.",
        ],
        pronunciation_focus_en: [
          "`Bu Guru` means teacher/ma'am teacher, a polite friendly address for a female teacher.",
          "`boleh membawa` means may bring; for permission or school rules, use `boleh`, not `bisa`.",
          "VN-speaker trap: saying `teman kelas` without `se-`. Classmates are `teman sekelas`.",
        ],
      },
      {
        en: "Kuenya kecil saja supaya mudah dibagikan.",
        vi: "Bánh nhỏ thôi để dễ chia cho mọi người.",
        pronunciation_focus: [
          "`kecil saja` = nhỏ thôi; `saja` làm đề xuất nghe nhẹ và thực tế.",
          "`mudah dibagikan` = dễ được chia/phát; bị động `di-` hợp khi nói đồ được chia cho lớp.",
          "Lỗi người Việt: nói `bagi mudah`. Trật tự đúng là `mudah dibagikan`.",
        ],
        pronunciation_focus_en: [
          "`kecil saja` means just small; `saja` makes the suggestion light and practical.",
          "`mudah dibagikan` means easy to distribute; passive `di-` fits items being shared with the class.",
          "VN-speaker trap: saying `bagi mudah`. Correct order is `mudah dibagikan`.",
        ],
      },
      {
        en: "Apakah ada murid yang punya alergi makanan?",
        vi: "Có học sinh nào bị dị ứng thức ăn không?",
        pronunciation_focus: [
          "`murid` = học sinh; trong trường tiểu học nghe tự nhiên hơn `siswa` trong nhiều tình huống thân mật.",
          "`punya alergi makanan` = có dị ứng thức ăn; cách nói đời thường, rõ ràng.",
          "Lỗi người Việt: hỏi `alergi makan?` thiếu danh từ. Cụm đúng là `alergi makanan`.",
        ],
        pronunciation_focus_en: [
          "`murid` means pupil/student; in primary-school contexts it can sound more natural than formal `siswa`.",
          "`punya alergi makanan` means has a food allergy; everyday and clear.",
          "VN-speaker trap: asking `alergi makan?` without the noun. The right phrase is `alergi makanan`.",
        ],
      },
      {
        en: "Saya siapkan goodie bag tanpa kacang dan cokelat.",
        vi: "Tôi chuẩn bị túi quà nhỏ không có đậu phộng và sô-cô-la.",
        pronunciation_focus: [
          "`goodie bag` là túi quà nhỏ cho trẻ sau tiệc; từ tiếng Anh này rất phổ biến ở trường/kids party.",
          "`tanpa kacang dan cokelat` = không có đậu phộng và sô-cô-la; dùng khi tránh dị ứng.",
          "Lỗi người Việt: dùng `tidak ada` trong nhãn quà. Với thành phần, `tanpa` ngắn và rõ hơn.",
        ],
        pronunciation_focus_en: [
          "`goodie bag` is a small party favor bag; this English loan phrase is common for school/kids parties.",
          "`tanpa kacang dan cokelat` means without peanuts and chocolate, useful for avoiding allergies.",
          "VN-speaker note: `tidak ada` is understandable, but for ingredients `tanpa` is shorter and clearer.",
        ],
      },
      {
        en: "Boleh foto bersama setelah anak-anak makan kue?",
        vi: "Có thể chụp ảnh chung sau khi các bé ăn bánh không?",
        pronunciation_focus: [
          "`foto bersama` = chụp ảnh chung; cũng có thể dùng như danh từ 'ảnh chung'.",
          "`setelah anak-anak makan kue` = sau khi trẻ ăn bánh; `anak-anak` là dạng số nhiều/tập thể.",
          "Lỗi người Việt: nói `ambil foto bersama` được, nhưng trong nói nhanh ở Indonesia `foto bersama` rất tự nhiên.",
        ],
        pronunciation_focus_en: [
          "`foto bersama` means take a group photo; it can also mean the group photo itself.",
          "`setelah anak-anak makan kue` means after the children eat cake; `anak-anak` is plural/collective.",
          "VN-speaker note: `ambil foto bersama` is understood, but in everyday Indonesian `foto bersama` is very natural.",
        ],
      },
      {
        en: "Kalau sekolah tidak mengizinkan lilin, tidak apa-apa.",
        vi: "Nếu trường không cho phép nến thì không sao.",
        pronunciation_focus: [
          "`mengizinkan` = cho phép; formal hơn `bolehkan` khi nói quy định trường.",
          "`tidak apa-apa` = không sao; câu giữ thái độ nhẹ nhàng với giáo viên.",
          "Lỗi người Việt: nói `tidak masalah` được, nhưng với cô giáo và phụ huynh `tidak apa-apa` mềm hơn.",
        ],
        pronunciation_focus_en: [
          "`mengizinkan` means allow; more formal than `bolehkan` for school rules.",
          "`tidak apa-apa` means no problem; it keeps the tone gentle with the teacher.",
          "VN-speaker note: `tidak masalah` works, but with teachers and parents `tidak apa-apa` is softer.",
        ],
      },
      {
        en: "Saya akan datang sebentar saat jam istirahat.",
        vi: "Tôi sẽ ghé một lát vào giờ ra chơi.",
        pronunciation_focus: [
          "`datang sebentar` = ghé/đến một lát; lịch sự hơn chen vào lớp lâu.",
          "`jam istirahat` = giờ nghỉ/giờ ra chơi; cụm rất thường dùng ở trường.",
          "Lỗi người Việt: dịch 'giờ ra chơi' thành `jam bermain`. Ở trường nói `jam istirahat`.",
        ],
        pronunciation_focus_en: [
          "`datang sebentar` means come briefly; it sounds respectful of class time.",
          "`jam istirahat` means break time/recess, a common school phrase.",
          "VN-speaker trap: translating recess as `jam bermain`. At school, say `jam istirahat`.",
        ],
      },
      {
        en: "Terima kasih sudah membantu mengatur ulang tahun anak saya.",
        vi: "Cảm ơn cô đã giúp sắp xếp sinh nhật của con tôi.",
        pronunciation_focus: [
          "`membantu mengatur` = giúp sắp xếp; dùng khi cảm ơn giáo viên vì phối hợp.",
          "`ulang tahun anak saya` = sinh nhật của con tôi; sở hữu đứng sau danh từ.",
          "Lỗi người Việt: nói `saya anak ulang tahun` do sao chép trật tự tiếng Việt. Đúng là `ulang tahun anak saya`.",
        ],
        pronunciation_focus_en: [
          "`membantu mengatur` means help arrange; use it to thank a teacher for coordinating.",
          "`ulang tahun anak saya` means my child's birthday; possession follows the noun.",
          "VN-speaker trap: saying `saya anak ulang tahun` by copying Vietnamese order. Correct: `ulang tahun anak saya`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở nhiều trường Indonesia, phụ huynh có thể mừng ulang tahun anak secara sederhana ở lớp, nhưng nên xin izin guru trước. Một số trường không cho thắp lilin, cắt bánh lớn, hoặc phát đồ ăn có alergi seperti kacang. `Goodie bag` nhỏ thường chứa snack, alat tulis, atau mainan kecil. Nên hỏi jumlah teman sekelas, aturan foto bersama, và apakah guru perlu memberi tahu orang tua lain.",
    cultural_notes_en:
      "In many Indonesian schools, parents may celebrate a child's birthday simply in class, but should ask the teacher first. Some schools do not allow candles, large cake-cutting, or foods with allergies such as peanuts. A small `goodie bag` often contains snacks, stationery, or a small toy. Ask about the number of classmates, group photo rules, and whether the teacher needs to inform other parents.",
    tip_advice_vi:
      "Mẹo cho người Việt: khi nói với giáo viên, dùng `Bu Guru/Pak Guru`, `apakah saya boleh...`, `kalau sekolah tidak mengizinkan...`, và `terima kasih sudah membantu...`. Nhớ phân biệt `boleh` = được phép, `bisa` = có thể/khả năng.",
    tip_advice_en:
      "Tip for Vietnamese speakers: with teachers, use `Bu Guru/Pak Guru`, `apakah saya boleh...`, `kalau sekolah tidak mengizinkan...`, and `terima kasih sudah membantu...`. Keep `boleh` = allowed/may separate from `bisa` = can/able.",
    vocabulary: [
      {
        word: "ulang tahun di sekolah",
        en: "birthday at school",
        vi: "sinh nhật ở trường",
        pos: "noun phrase",
        pronunciation_vi: "U-lang TA-hun di se-KO-lah",
        pronunciation_en: "OO-lang TA-hoon dee seh-KO-lah",
      },
      {
        word: "kue kecil",
        en: "small cake / small cakes",
        vi: "bánh nhỏ",
        pos: "noun phrase",
        pronunciation_vi: "KU-e KE-cil",
        pronunciation_en: "KOO-eh KEH-chil",
      },
      {
        word: "izin guru",
        en: "teacher permission",
        vi: "sự cho phép của giáo viên",
        pos: "noun phrase",
        pronunciation_vi: "I-zin GU-ru",
        pronunciation_en: "EE-zin GOO-roo",
      },
      {
        word: "teman sekelas",
        en: "classmate",
        vi: "bạn cùng lớp",
        pos: "noun phrase",
        pronunciation_vi: "te-MAN se-KE-las",
        pronunciation_en: "teh-MAN seh-KEH-las",
      },
      {
        word: "goodie bag",
        en: "party favor bag",
        vi: "túi quà nhỏ",
        pos: "noun phrase",
        pronunciation_vi: "GU-di beg",
        pronunciation_en: "GOO-dee bag",
      },
      {
        word: "alergi makanan",
        en: "food allergy",
        vi: "dị ứng thức ăn",
        pos: "noun phrase",
        pronunciation_vi: "a-LER-gi ma-KA-nan",
        pronunciation_en: "a-LER-gee ma-KA-nan",
      },
      {
        word: "foto bersama",
        en: "group photo",
        vi: "ảnh chung / chụp ảnh chung",
        pos: "noun / verb phrase",
        pronunciation_vi: "FO-to ber-SA-ma",
        pronunciation_en: "FO-toh ber-SA-ma",
      },
      {
        word: "jam istirahat",
        en: "break time / recess",
        vi: "giờ nghỉ / giờ ra chơi",
        pos: "noun phrase",
        pronunciation_vi: "jam is-ti-RA-hat",
        pronunciation_en: "jam is-tee-RA-hat",
      },
    ],
    dialogue: [
      {
        speaker: "Orang Tua",
        text: "Bu Guru, besok anak saya ulang tahun. Apakah boleh membawa kue kecil?",
        vi: "Cô ơi, mai con tôi sinh nhật. Có được mang bánh nhỏ không ạ?",
        en: "Teacher, tomorrow is my child's birthday. May I bring small cakes?",
      },
      {
        speaker: "Guru",
        text: "Boleh, Bu. Tapi kuenya jangan terlalu besar, supaya mudah dibagikan.",
        vi: "Được chị. Nhưng bánh đừng quá lớn, để dễ chia.",
        en: "Yes, ma'am. But please keep the cake not too big, so it is easy to distribute.",
      },
      {
        speaker: "Orang Tua",
        text: "Baik. Apakah ada murid yang punya alergi makanan?",
        vi: "Vâng. Có học sinh nào bị dị ứng thức ăn không?",
        en: "Okay. Are there any students with food allergies?",
      },
      {
        speaker: "Guru",
        text: "Ada satu anak alergi kacang. Goodie bag sebaiknya tanpa kacang.",
        vi: "Có một bé dị ứng đậu phộng. Túi quà nên không có đậu phộng.",
        en: "One child is allergic to peanuts. The goodie bag should be without peanuts.",
      },
      {
        speaker: "Orang Tua",
        text: "Siap, Bu. Nanti saya datang sebentar saat jam istirahat.",
        vi: "Dạ được, cô. Lát tôi sẽ ghé một chút vào giờ ra chơi.",
        en: "Understood, teacher. I will come briefly during break time.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Ngày mai con tôi sinh nhật ở trường.",
        prompt_en: "Translate into Indonesian: Tomorrow my child has a birthday at school.",
        answer: "Besok anak saya ulang tahun di sekolah.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Apakah ada murid yang punya ___ makanan?",
        prompt_en: "Fill in the blank: Apakah ada murid yang punya ___ makanan?",
        answer: "alergi",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Có thể chụp ảnh chung sau khi ăn bánh không?",
        prompt_en: "Translate into Indonesian: May we take a group photo after eating cake?",
        answer: "Boleh foto bersama setelah makan kue?",
      },
      {
        type: "roleplay",
        prompt_vi: "Bạn là phụ huynh. Xin phép cô giáo mang bánh nhỏ cho bạn cùng lớp của con.",
        prompt_en: "You are a parent. Ask the teacher for permission to bring small cakes for your child's classmates.",
        answer: "Bu Guru, apakah saya boleh membawa kue kecil untuk teman sekelasnya?",
      },
    ],
  },
];
