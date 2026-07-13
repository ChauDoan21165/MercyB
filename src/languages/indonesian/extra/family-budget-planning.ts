// Family Budget Planning Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson. Field convention follows the Indonesian extra
// pack: sentence `en` holds TARGET-LANGUAGE Indonesian, `vi` holds Vietnamese,
// Vietnamese L1 notes live in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en` with the same order.

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

export const familyBudgetPlanningLessons: IndonesianLesson[] = [
  {
    id: "indonesian_family_budget_monthly_expenses",
    level: "A2",
    category: "money",
    title_vi: "Lập ngân sách gia đình hằng tháng",
    title_en: "Planning a monthly family budget",
    sentences: [
      {
        en: "Kami perlu membuat anggaran keluarga untuk bulan depan.",
        vi: "Chúng tôi cần lập ngân sách gia đình cho tháng tới.",
        pronunciation_focus: [
          "KA-mi PER-lu mem-BU-at ang-GA-ran ke-LU-ar-ga un-TUK BU-lan de-PAN - `anggaran keluarga` = ngân sách gia đình; `bulan depan` = tháng tới.",
          "Lỗi người Việt: dùng `budget` trong mọi ngữ cảnh. Trong văn nói cũng hiểu, nhưng `anggaran` tự nhiên và chuẩn hơn.",
          "Luyện: `Kami perlu membuat anggaran keluarga.`",
        ],
        pronunciation_focus_en: [
          "KA-mi PER-loo mem-BOO-at ang-GA-ran ke-LOO-ar-ga un-TOOK BOO-lan de-PAN - `anggaran keluarga` = family budget; `bulan depan` = next month.",
          "VN-speaker trap: using `budget` everywhere. It is understood, but `anggaran` is more natural and standard.",
          "Drill: `Kami perlu membuat anggaran keluarga.`",
        ],
      },
      {
        en: "Belanja bulanan jangan sampai lebih dari tiga juta.",
        vi: "Mua sắm hằng tháng đừng vượt quá ba triệu.",
        pronunciation_focus: [
          "be-LAN-ja bu-LA-nan JA-ngan SAM-pai le-BIH da-ri TI-ga JU-ta - `belanja bulanan` = mua sắm hằng tháng; `lebih dari` = hơn/vượt quá.",
          "Lỗi người Việt: quên `juta`. Ba triệu phải nói `tiga juta`, không chỉ `tiga`.",
          "Luyện: `Belanja bulanan jangan lebih dari tiga juta.`",
        ],
        pronunciation_focus_en: [
          "be-LAN-ja boo-LA-nan JA-ngan SAM-pai le-BIH da-ri TEE-ga JOO-ta - `belanja bulanan` = monthly shopping; `lebih dari` = more than.",
          "VN-speaker trap: dropping `juta`. Three million must be `tiga juta`, not just `tiga`.",
          "Drill: `Belanja bulanan jangan lebih dari tiga juta.`",
        ],
      },
      {
        en: "Kita harus pisahkan uang sekolah dan cicilan rumah.",
        vi: "Chúng ta phải tách riêng tiền học và khoản trả góp nhà.",
        pronunciation_focus: [
          "KI-ta HA-rus pi-SAH-kan U-ang se-KO-lah dan ci-CI-lan RU-mah - `uang sekolah` = tiền học; `cicilan rumah` = khoản trả góp nhà.",
          "Lỗi người Việt: nói `bayar bulan rumah` theo tiếng Việt. Khoản trả góp là `cicilan`, không phải `bayar bulan`.",
          "Luyện: `Pisahkan uang sekolah dan cicilan rumah.`",
        ],
        pronunciation_focus_en: [
          "KEE-ta HA-rus pi-SAH-kan OO-ang se-KO-lah dan chi-CHEE-lan ROO-mah - `uang sekolah` = school fees; `cicilan rumah` = house installment.",
          "VN-speaker trap: saying literal monthly house payment. Installment is `cicilan`, not `bayar bulan`.",
          "Drill: `Pisahkan uang sekolah dan cicilan rumah.`",
        ],
      },
      {
        en: "Tabungan keluarga tidak boleh dipakai untuk belanja harian.",
        vi: "Tiền tiết kiệm gia đình không được dùng cho mua sắm hằng ngày.",
        pronunciation_focus: [
          "ta-BU-ngan ke-LU-ar-ga TI-dak BO-leh di-PA-kai un-TUK be-LAN-ja ha-RI-an - `tabungan` = tiền tiết kiệm; `tidak boleh` = không được phép.",
          "Lỗi người Việt: nhầm `tidak bisa` và `tidak boleh`. Ở đây là quy tắc gia đình, nên dùng `tidak boleh`.",
          "Luyện: `Tabungan tidak boleh dipakai.`",
        ],
        pronunciation_focus_en: [
          "ta-BOO-ngan ke-LOO-ar-ga TEE-dak BO-leh di-PA-kai un-TOOK be-LAN-ja ha-REE-an - `tabungan` = savings; `tidak boleh` = not allowed.",
          "VN-speaker trap: mixing `tidak bisa` and `tidak boleh`. This is a family rule, so use `tidak boleh`.",
          "Drill: `Tabungan tidak boleh dipakai.`",
        ],
      },
      {
        en: "Pengeluaran kecil juga harus dicatat.",
        vi: "Các khoản chi nhỏ cũng phải được ghi lại.",
        pronunciation_focus: [
          "pe-nge-LU-ar-an KE-cil JU-ga HA-rus di-CA-tat - `pengeluaran` = khoản chi; `dicatat` = được ghi lại.",
          "Lỗi người Việt: dịch 'chi tiêu' thành động từ `keluar uang` trong câu danh từ. Danh từ chuẩn là `pengeluaran`.",
          "Luyện: `Pengeluaran kecil harus dicatat.`",
        ],
        pronunciation_focus_en: [
          "pe-nge-LOO-ar-an KE-chil JOO-ga HA-rus di-CHA-tat - `pengeluaran` = expense; `dicatat` = recorded.",
          "VN-speaker trap: translating expenses as the verb phrase `keluar uang` in a noun slot. The noun is `pengeluaran`.",
          "Drill: `Pengeluaran kecil harus dicatat.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong nhiều gia đình Indonesia, tiền thường được chia theo mục: belanja bulanan, uang sekolah, cicilan, tabungan, dan dana darurat. Người quản lý tiền trong nhà có thể là ibu, bapak, hoặc cả hai cùng trao đổi. Giọng nói nên thực tế, không đổ lỗi: nói số tiền, mục chi, và ưu tiên.",
    cultural_notes_en:
      "In many Indonesian families, money is divided into categories: monthly shopping, school fees, installments, savings, and emergency funds. The household money manager may be the mother, father, or both together. Keep the tone practical, not blaming: state the amount, expense category, and priority.",
    tip_advice_vi:
      "Khung cần nhớ: `membuat anggaran`, `belanja bulanan`, `uang sekolah`, `cicilan`, `tabungan`, `pengeluaran`. Khi nói tiền, luôn nhớ bậc `ribu` và `juta`.",
    tip_advice_en:
      "Useful frames: `membuat anggaran`, `belanja bulanan`, `uang sekolah`, `cicilan`, `tabungan`, `pengeluaran`. When talking money, always keep `ribu` and `juta` scales.",
    vocabulary: [
      {
        cell_id: "5f1525a3-44eb-4ed5-b793-f7bba0ed6a96",
        word: "anggaran keluarga",
        en: "family budget",
        vi: "ngân sách gia đình",
        pos: "noun phrase",
        pronunciation_vi: "ang-GA-ran ke-LU-ar-ga",
        pronunciation_en: "ang-GA-ran ke-LOO-ar-ga",
      },
      {
        cell_id: "3a5a49fb-44b4-400f-92aa-087f799422ae",
        word: "belanja bulanan",
        en: "monthly shopping",
        vi: "mua sắm hằng tháng",
        pos: "noun phrase",
        pronunciation_vi: "be-LAN-ja bu-LA-nan",
        pronunciation_en: "be-LAN-ja boo-LA-nan",
      },
      {
        cell_id: "a8dcafa6-106b-4dbb-b6dc-48922cdc06b7",
        word: "tabungan",
        en: "savings",
        vi: "tiền tiết kiệm",
        pos: "noun",
        pronunciation_vi: "ta-BU-ngan",
        pronunciation_en: "ta-BOO-ngan",
      },
      {
        cell_id: "84f164ab-d261-4c81-83f3-fc58a9960e87",
        word: "cicilan",
        en: "installment payment",
        vi: "khoản trả góp",
        pos: "noun",
        pronunciation_vi: "ci-CI-lan",
        pronunciation_en: "chi-CHEE-lan",
      },
      {
        cell_id: "f42b2435-3547-4d73-93f4-f9b0328cad3a",
        word: "uang sekolah",
        en: "school fees",
        vi: "tiền học",
        pos: "noun phrase",
        pronunciation_vi: "U-ang se-KO-lah",
        pronunciation_en: "OO-ang se-KO-lah",
      },
      {
        cell_id: "3c12cec9-1b75-4101-83b7-469e0c9d1396",
        word: "pengeluaran",
        en: "expense",
        vi: "khoản chi",
        pos: "noun",
        pronunciation_vi: "pe-nge-LU-ar-an",
        pronunciation_en: "pe-nge-LOO-ar-an",
      },
    ],
    dialogue: [
      {
        cell_id: "7a348d39-ffb9-4c86-b0c8-b6efc05b18ad",
        speaker: "Ibu",
        text: "Bulan depan kita perlu membuat anggaran keluarga.",
        vi: "Tháng tới chúng ta cần lập ngân sách gia đình.",
        en: "Next month we need to make a family budget.",
      },
      {
        cell_id: "a933eb23-0c6b-432b-a0ea-d61ac4ff4ccf",
        speaker: "Ayah",
        text: "Setuju. Belanja bulanan jangan lebih dari tiga juta.",
        vi: "Đồng ý. Mua sắm hằng tháng đừng quá ba triệu.",
        en: "Agreed. Monthly shopping should not be more than three million.",
      },
      {
        cell_id: "ebb9e0eb-0fb8-4354-9d4b-6e6368d1fb60",
        speaker: "Ibu",
        text: "Uang sekolah dan cicilan rumah harus dipisahkan dulu.",
        vi: "Tiền học và khoản trả góp nhà phải được tách riêng trước.",
        en: "School fees and the house installment must be separated first.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Kami perlu membuat ___ keluarga.`",
        prompt_en: "Fill in: `Kami perlu membuat ___ keluarga.`",
        answer: "anggaran",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Các khoản chi nhỏ cũng phải được ghi lại.",
        prompt_en: "Translate to Indonesian: Small expenses must also be recorded.",
        answer: "Pengeluaran kecil juga harus dicatat.",
      },
      {
        type: "choice",
        prompt_vi: "Từ nào nghĩa là khoản trả góp?",
        prompt_en: "Which word means installment payment?",
        options: ["cicilan", "tabungan", "hemat"],
        answer: "cicilan",
      },
    ],
  },
  {
    id: "indonesian_family_savings_emergency_fund",
    level: "B1",
    category: "money",
    title_vi: "Tiết kiệm, quỹ khẩn cấp và sống tiết kiệm",
    title_en: "Savings, emergency funds and frugal habits",
    sentences: [
      {
        en: "Dana darurat sebaiknya cukup untuk tiga bulan pengeluaran.",
        vi: "Quỹ khẩn cấp nên đủ cho ba tháng chi tiêu.",
        pronunciation_focus: [
          "DA-na da-RU-rat se-BAIK-nya CU-kup un-TUK TI-ga BU-lan pe-nge-LU-ar-an - `dana darurat` = quỹ khẩn cấp; `sebaiknya` = nên.",
          "Lỗi người Việt: dùng `uang darurat` vẫn hiểu, nhưng cụm tài chính tự nhiên hơn là `dana darurat`.",
          "Luyện: `Dana darurat sebaiknya cukup.`",
        ],
        pronunciation_focus_en: [
          "DA-na da-ROO-rat se-BAIK-nya CHOO-kup un-TOOK TEE-ga BOO-lan pe-nge-LOO-ar-an - `dana darurat` = emergency fund; `sebaiknya` = ideally/should.",
          "VN-speaker trap: `uang darurat` is understandable, but the natural finance phrase is `dana darurat`.",
          "Drill: `Dana darurat sebaiknya cukup.`",
        ],
      },
      {
        en: "Kita harus lebih hemat sampai cicilan selesai.",
        vi: "Chúng ta phải tiết kiệm hơn cho đến khi khoản trả góp xong.",
        pronunciation_focus: [
          "KI-ta HA-rus le-BIH HE-mat SAM-pai ci-CI-lan se-LE-sai - `hemat` = tiết kiệm; `sampai` = cho đến khi.",
          "Lỗi người Việt: nhầm `hemat` và `simpan`. `Hemat` = tiêu ít/tiết kiệm lối sống; `simpan/menabung` = để dành tiền.",
          "Luyện: `Kita harus lebih hemat.`",
        ],
        pronunciation_focus_en: [
          "KEE-ta HA-rus le-BIH HE-mat SAM-pai chi-CHEE-lan se-LE-sai - `hemat` = frugal/save money in spending; `sampai` = until.",
          "VN-speaker trap: mixing `hemat` and `simpan`. `Hemat` = spend less/be frugal; `simpan/menabung` = put money aside.",
          "Drill: `Kita harus lebih hemat.`",
        ],
      },
      {
        en: "Kalau ada sisa uang, kita masukkan ke tabungan.",
        vi: "Nếu còn dư tiền, chúng ta cho vào tiết kiệm.",
        pronunciation_focus: [
          "KA-lau A-da SI-sa U-ang, KI-ta ma-SUK-kan ke ta-BU-ngan - `sisa uang` = tiền dư; `masukkan ke tabungan` = cho vào khoản tiết kiệm.",
          "Lỗi người Việt: nói `masuk tabungan` khi chủ ngữ là người. Hành động chủ động là `masukkan ke tabungan`.",
          "Luyện: `Sisa uang kita masukkan ke tabungan.`",
        ],
        pronunciation_focus_en: [
          "KA-lau A-da SEE-sa OO-ang, KEE-ta ma-SOOK-kan ke ta-BOO-ngan - `sisa uang` = leftover money; `masukkan ke tabungan` = put into savings.",
          "VN-speaker trap: saying `masuk tabungan` when the subject is the person. Active action: `masukkan ke tabungan`.",
          "Drill: `Sisa uang kita masukkan ke tabungan.`",
        ],
      },
      {
        en: "Pengeluaran untuk jajan anak perlu dibatasi.",
        vi: "Khoản chi cho quà vặt của con cần được giới hạn.",
        pronunciation_focus: [
          "pe-nge-LU-ar-an un-TUK JA-jan A-nak PER-lu di-BA-tas-i - `jajan anak` = tiền ăn vặt/quà vặt của con; `dibatasi` = được giới hạn.",
          "Lỗi người Việt: dịch `ăn vặt` thành `makan kecil`. Trong đời sống hằng ngày, `jajan` là từ rất tự nhiên.",
          "Luyện: `Jajan anak perlu dibatasi.`",
        ],
        pronunciation_focus_en: [
          "pe-nge-LOO-ar-an un-TOOK JA-jan A-nak PER-loo di-BA-tas-i - `jajan anak` = children's snacks/treat money; `dibatasi` = limited.",
          "VN-speaker trap: translating snacks as `makan kecil`. In daily life, `jajan` is the natural word.",
          "Drill: `Jajan anak perlu dibatasi.`",
        ],
      },
      {
        en: "Kita evaluasi anggaran setiap akhir bulan.",
        vi: "Chúng ta đánh giá lại ngân sách vào cuối mỗi tháng.",
        pronunciation_focus: [
          "KI-ta e-va-lu-A-si ang-GA-ran se-TI-ap A-khir BU-lan - `evaluasi anggaran` = đánh giá lại ngân sách; `akhir bulan` = cuối tháng.",
          "Lỗi người Việt: dùng `cek` trong mọi bối cảnh. `Cek anggaran` được, nhưng `evaluasi anggaran` nghe nghiêm túc hơn.",
          "Luyện: `Kita evaluasi anggaran setiap akhir bulan.`",
        ],
        pronunciation_focus_en: [
          "KEE-ta e-va-loo-A-si ang-GA-ran se-TEE-ap A-khir BOO-lan - `evaluasi anggaran` = evaluate/review the budget; `akhir bulan` = end of the month.",
          "VN-speaker trap: using `cek` for everything. `Cek anggaran` works, but `evaluasi anggaran` sounds more deliberate.",
          "Drill: `Kita evaluasi anggaran setiap akhir bulan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Nhiều gia đình Indonesia dùng cách nói thực tế như `hemat dulu`, `sisihkan untuk tabungan`, `dana darurat`, và `belanja bulanan`. Khi thu nhập không cố định, gia đình thường ưu tiên uang sekolah, cicilan, kebutuhan pokok, lalu tabungan nếu còn sisa.",
    cultural_notes_en:
      "Many Indonesian families use practical phrases like `hemat dulu`, `sisihkan untuk tabungan`, `dana darurat`, and `belanja bulanan`. When income is irregular, families often prioritize school fees, installments, basic needs, then savings if money remains.",
    tip_advice_vi:
      "Phân biệt ba ý: `hemat` = tiêu tiết kiệm, `menabung` = gửi/để dành tiền, `dana darurat` = quỹ cho việc bất ngờ. Đây là ba từ khóa khi bàn kế hoạch tiền trong gia đình.",
    tip_advice_en:
      "Separate three ideas: `hemat` = spend frugally, `menabung` = save/set money aside, `dana darurat` = emergency fund. These are key words for family money planning.",
    vocabulary: [
      {
        cell_id: "14c8bb92-d5dd-473a-b8d7-5afdd19560c7",
        word: "dana darurat",
        en: "emergency fund",
        vi: "quỹ khẩn cấp",
        pos: "noun phrase",
        pronunciation_vi: "DA-na da-RU-rat",
        pronunciation_en: "DA-na da-ROO-rat",
      },
      {
        cell_id: "b5016a0e-bd79-48a3-bccf-f8c33becbca3",
        word: "hemat",
        en: "frugal / economical",
        vi: "tiết kiệm trong chi tiêu",
        pos: "adjective",
        pronunciation_vi: "HE-mat",
        pronunciation_en: "HE-mat",
      },
      {
        cell_id: "e4790a90-8c74-4489-a442-418ad196ad8f",
        word: "sisa uang",
        en: "leftover money",
        vi: "tiền dư",
        pos: "noun phrase",
        pronunciation_vi: "SI-sa U-ang",
        pronunciation_en: "SEE-sa OO-ang",
      },
      {
        cell_id: "2af1771a-5da2-4155-8a3f-868b80fab06b",
        word: "jajan",
        en: "snacks / snack spending",
        vi: "ăn vặt / tiền quà vặt",
        pos: "noun/verb",
        pronunciation_vi: "JA-jan",
        pronunciation_en: "JA-jan",
      },
      {
        cell_id: "a6ee1f59-5c7f-42fc-a140-7ae5a170b9e0",
        word: "dibatasi",
        en: "limited",
        vi: "được giới hạn",
        pos: "verb",
        pronunciation_vi: "di-BA-tas-i",
        pronunciation_en: "di-BA-tas-i",
      },
      {
        cell_id: "6da76baa-dc70-4f9e-956c-66b7719d7c58",
        word: "akhir bulan",
        en: "end of the month",
        vi: "cuối tháng",
        pos: "noun phrase",
        pronunciation_vi: "A-khir BU-lan",
        pronunciation_en: "A-khir BOO-lan",
      },
    ],
    dialogue: [
      {
        cell_id: "5c6b2c11-9dcc-4da2-a92d-a6f9b92002e3",
        speaker: "Ayah",
        text: "Dana darurat kita belum cukup untuk tiga bulan pengeluaran.",
        vi: "Quỹ khẩn cấp của chúng ta chưa đủ cho ba tháng chi tiêu.",
        en: "Our emergency fund is not enough for three months of expenses yet.",
      },
      {
        cell_id: "f3dd68f3-52d2-44be-8551-7e21b16a6f78",
        speaker: "Ibu",
        text: "Kalau begitu, kita harus lebih hemat bulan ini.",
        vi: "Nếu vậy, tháng này chúng ta phải tiết kiệm hơn.",
        en: "In that case, we need to be more frugal this month.",
      },
      {
        cell_id: "d3beefab-34c3-4a14-a4cd-9a3ff7e1b45e",
        speaker: "Ayah",
        text: "Setuju. Kalau ada sisa uang, kita masukkan ke tabungan.",
        vi: "Đồng ý. Nếu còn dư tiền, chúng ta cho vào tiết kiệm.",
        en: "Agreed. If there is leftover money, we put it into savings.",
      },
      {
        cell_id: "0b8f4ef4-f91e-4f92-8b8c-90479916cb41",
        speaker: "Ibu",
        text: "Nanti akhir bulan kita evaluasi anggarannya lagi.",
        vi: "Cuối tháng mình đánh giá lại ngân sách nhé.",
        en: "At the end of the month, we will review the budget again.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Dana ___ sebaiknya cukup untuk tiga bulan pengeluaran.`",
        prompt_en: "Fill in: `Dana ___ sebaiknya cukup untuk three months of expenses.`",
        answer: "darurat",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Chúng ta phải tiết kiệm hơn.",
        prompt_en: "Translate to Indonesian: We need to be more frugal.",
        answer: "Kita harus lebih hemat.",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `hemat`, `dana darurat`, `akhir bulan`.",
        prompt_en: "Match meanings: `hemat`, `dana darurat`, `akhir bulan`.",
        pairs: [
          ["hemat", "tiết kiệm trong chi tiêu / frugal"],
          ["dana darurat", "quỹ khẩn cấp / emergency fund"],
          ["akhir bulan", "cuối tháng / end of the month"],
        ],
      },
    ],
  },
];
