// Elder Care Family Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for caring for elderly parents: caregivers,
// daily medicine, doctor checkups, wheelchairs, family coordination, and home
// care. Indonesian target text lives in `en`, Vietnamese glosses in `vi`,
// Vietnamese L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  cell_id?: string;
  /** Indonesian word/phrase. */
  word: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Part of speech. */
  pos: string;
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  cell_id?: string;
  speaker: string;
  /** Indonesian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
  en?: string;
};

// Loosely typed so per-type fields (translation, fill_blank, matching) can vary.
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

export const elderCareFamilyLessons: IndonesianLesson[] = [
  {
    id: "indonesian_elder_care_family",
    level: "A2",
    category: "health_family",
    title_vi: "Chăm sóc orang tua lanjut usia trong gia đình",
    title_en: "Caring for elderly parents in the family",
    sentences: [
      {
        en: "Ibu saya sudah lanjut usia dan tinggal bersama keluarga.",
        vi: "Mẹ tôi đã lớn tuổi và sống cùng gia đình.",
        pronunciation_focus: [
          "lan-JUT U-si-a - `lanjut usia` = cao tuổi/lớn tuổi; cách nói lịch sự hơn `tua`.",
          "`tinggal bersama keluarga` = sống cùng gia đình; `bersama` trang trọng hơn `sama`.",
          "Lỗi người Việt: dịch thẳng `người già` thành `orang tua` có thể nghĩa là cha mẹ. Cụm rõ là `orang lanjut usia`.",
          "Luyện: `Ibu saya sudah lanjut usia.`",
        ],
        pronunciation_focus_en: [
          "lan-JUT OO-see-a - `lanjut usia` = elderly; more polite than plain `tua`.",
          "`tinggal bersama keluarga` = live with family; `bersama` is more formal than `sama`.",
          "VN-speaker trap: translating 'old person' as `orang tua`, which can mean parents. Clear phrase: `orang lanjut usia`.",
          "Drill: `Ibu saya sudah lanjut usia.`",
        ],
      },
      {
        en: "Kami mencari perawat untuk membantu perawatan rumah.",
        vi: "Chúng tôi đang tìm điều dưỡng/người chăm sóc để hỗ trợ chăm sóc tại nhà.",
        pronunciation_focus: [
          "pe-RA-wat - `perawat` = y tá/điều dưỡng/người chăm sóc có kỹ năng.",
          "`perawatan rumah` = chăm sóc tại nhà; dùng trong ngữ cảnh sức khỏe gia đình.",
          "Lỗi người Việt: dùng `pembantu` cho mọi người giúp việc. Chăm sóc sức khỏe nên nói `perawat` hoặc `pendamping lansia`.",
          "Luyện: `Kami mencari perawat.`",
        ],
        pronunciation_focus_en: [
          "pe-RA-wat - `perawat` = nurse/caregiver with care skills.",
          "`perawatan rumah` = home care; used in family health contexts.",
          "VN-speaker trap: using `pembantu` for every helper. For health care, use `perawat` or `pendamping lansia`.",
          "Drill: `Kami mencari perawat.`",
        ],
      },
      {
        en: "Ayah harus minum obat harian setelah makan pagi.",
        vi: "Bố phải uống thuốc hằng ngày sau bữa sáng.",
        pronunciation_focus: [
          "O-bat HA-ri-an - `obat harian` = thuốc uống hằng ngày.",
          "`setelah makan pagi` = sau bữa sáng; cũng có thể nói `setelah sarapan`.",
          "`harus minum obat` = phải uống thuốc; không cần chia động từ theo chủ ngữ.",
          "Luyện: `Ayah harus minum obat harian.`",
        ],
        pronunciation_focus_en: [
          "O-bat HA-ree-an - `obat harian` = daily medicine.",
          "`setelah makan pagi` = after breakfast; `setelah sarapan` is also natural.",
          "`harus minum obat` = must take medicine; no verb conjugation by subject.",
          "Drill: `Ayah harus minum obat harian.`",
        ],
      },
      {
        en: "Saya catat jadwal obat supaya tidak ada dosis yang terlewat.",
        vi: "Tôi ghi lịch thuốc để không có liều nào bị bỏ lỡ.",
        pronunciation_focus: [
          "JAD-wal O-bat - `jadwal obat` = lịch uống thuốc.",
          "`dosis yang terlewat` = liều bị lỡ/bỏ qua; `ter-` ở đây chỉ trạng thái xảy ra.",
          "Lỗi người Việt: nói `lupa obat` nghe thiếu rõ. Nói rõ hơn: `dosis terlewat` hoặc `lupa minum obat`.",
          "Luyện: `Saya catat jadwal obat.`",
        ],
        pronunciation_focus_en: [
          "JAD-wal O-bat - `jadwal obat` = medicine schedule.",
          "`dosis yang terlewat` = missed dose; `ter-` marks an happened state here.",
          "VN-speaker trap: saying only `lupa obat`, which is unclear. Say `dosis terlewat` or `lupa minum obat`.",
          "Drill: `Saya catat jadwal obat.`",
        ],
      },
      {
        en: "Besok pagi ada kontrol dokter di rumah sakit.",
        vi: "Sáng mai có lịch tái khám với bác sĩ ở bệnh viện.",
        pronunciation_focus: [
          "kon-TROL DOK-ter - `kontrol dokter` = tái khám/kiểm tra định kỳ với bác sĩ.",
          "`rumah sakit` = bệnh viện; nghĩa đen là nhà bệnh nhưng là cụm cố định.",
          "Lỗi người Việt: dịch `đi kiểm tra` thành `periksa saja`. Với lịch hẹn sau điều trị, nói `kontrol dokter`.",
          "Luyện: `Ada kontrol dokter besok.`",
        ],
        pronunciation_focus_en: [
          "kon-TROL DOK-ter - `kontrol dokter` = follow-up/checkup with a doctor.",
          "`rumah sakit` = hospital; literally sick house but a fixed phrase.",
          "VN-speaker trap: translating 'go check' as `periksa saja`. For follow-up care, say `kontrol dokter`.",
          "Drill: `Ada kontrol dokter besok.`",
        ],
      },
      {
        en: "Tolong siapkan kursi roda sebelum kami berangkat.",
        vi: "Xin chuẩn bị xe lăn trước khi chúng tôi xuất phát.",
        pronunciation_focus: [
          "KUR-si RO-da - `kursi roda` = xe lăn; nghĩa đen là ghế bánh xe.",
          "`sebelum kami berangkat` = trước khi chúng tôi đi/xuất phát.",
          "`tolong siapkan` lịch sự và trực tiếp; dùng tốt với người nhà hoặc petugas.",
          "Luyện: `Tolong siapkan kursi roda.`",
        ],
        pronunciation_focus_en: [
          "KUR-see RO-da - `kursi roda` = wheelchair; literally wheel chair.",
          "`sebelum kami berangkat` = before we leave/depart.",
          "`tolong siapkan` is polite and direct; good with family or staff.",
          "Drill: `Tolong siapkan kursi roda.`",
        ],
      },
      {
        en: "Keluarga kami bergantian menjaga nenek di rumah.",
        vi: "Gia đình chúng tôi thay phiên nhau chăm bà ở nhà.",
        pronunciation_focus: [
          "ber-gan-TI-an - `bergantian` = thay phiên nhau.",
          "`menjaga nenek` = trông/chăm bà; `menjaga` mềm và tự nhiên trong gia đình.",
          "Lỗi người Việt: dùng `jaga` như danh từ. Trong câu này cần động từ `menjaga` hoặc dạng nói nhanh `jaga nenek`.",
          "Luyện: `Kami bergantian menjaga nenek.`",
        ],
        pronunciation_focus_en: [
          "ber-gan-TEE-an - `bergantian` = take turns.",
          "`menjaga nenek` = care for/watch over grandmother; `menjaga` sounds natural in family care.",
          "VN-speaker trap: using `jaga` as a noun. Here use verb `menjaga`, or casual `jaga nenek`.",
          "Drill: `Kami bergantian menjaga nenek.`",
        ],
      },
      {
        en: "Perawat membantu mandi, makan, dan latihan jalan pelan-pelan.",
        vi: "Người chăm sóc hỗ trợ tắm, ăn và tập đi chậm rãi.",
        pronunciation_focus: [
          "mem-BAN-tu MAN-di - `membantu mandi` = hỗ trợ tắm; không nhất thiết làm thay hoàn toàn.",
          "`latihan jalan` = tập đi; `pelan-pelan` = chậm/chậm rãi.",
          "Lỗi người Việt: dùng `belajar jalan` cho người lớn tuổi nghe như trẻ học đi. Phục hồi nên nói `latihan jalan`.",
          "Luyện: `Perawat membantu latihan jalan.`",
        ],
        pronunciation_focus_en: [
          "mem-BAN-too MAN-dee - `membantu mandi` = help with bathing; not necessarily do everything for them.",
          "`latihan jalan` = walking practice; `pelan-pelan` = slowly/gently.",
          "VN-speaker trap: using `belajar jalan` for an elderly adult sounds like a child learning to walk. For rehab, use `latihan jalan`.",
          "Drill: `Perawat membantu latihan jalan.`",
        ],
      },
      {
        en: "Kalau ada keluhan mendadak, segera hubungi dokter.",
        vi: "Nếu có triệu chứng/phàn nàn đột ngột, hãy liên hệ bác sĩ ngay.",
        pronunciation_focus: [
          "ke-LU-han men-DA-dak - `keluhan mendadak` = triệu chứng/than phiền xuất hiện đột ngột.",
          "`segera hubungi dokter` = liên hệ bác sĩ ngay; `hubungi` là dạng trang trọng của liên lạc.",
          "Mẹo an toàn: khi nói về sức khỏe người cao tuổi, dùng `segera` để nhấn mạnh khẩn cấp.",
          "Luyện: `Segera hubungi dokter.`",
        ],
        pronunciation_focus_en: [
          "ke-LOO-han men-DA-dak - `keluhan mendadak` = sudden complaint/symptom.",
          "`segera hubungi dokter` = contact the doctor immediately; `hubungi` is a formal contact verb.",
          "Safety tip: for elderly health, use `segera` to mark urgency.",
          "Drill: `Segera hubungi dokter.`",
        ],
      },
      {
        en: "Kami ingin perawatan rumah yang aman dan nyaman untuk orang tua.",
        vi: "Chúng tôi muốn việc chăm sóc tại nhà an toàn và thoải mái cho cha mẹ/người lớn tuổi.",
        pronunciation_focus: [
          "A-man dan NYA-man - `aman dan nyaman` = an toàn và thoải mái; cặp từ rất thường dùng.",
          "`orang tua` có thể nghĩa là cha mẹ; trong ngữ cảnh này cũng nói về người lớn tuổi trong nhà.",
          "`untuk orang tua` = cho cha mẹ/người cao tuổi; nếu sợ hiểu lầm, nói `untuk lansia`.",
          "Luyện: `Kami ingin perawatan rumah yang aman.`",
        ],
        pronunciation_focus_en: [
          "A-man dan NYA-man - `aman dan nyaman` = safe and comfortable; a very common pair.",
          "`orang tua` can mean parents; in this context it also refers to elderly family members.",
          "`untuk orang tua` = for parents/elderly people; if ambiguity matters, say `untuk lansia`.",
          "Drill: `Kami ingin perawatan rumah yang aman.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, việc chăm sóc cha mẹ cao tuổi thường là trách nhiệm chung của gia đình lớn. Con cái có thể `bergantian menjaga` ở nhà, thuê `perawat`, hoặc nhờ họ hàng hỗ trợ khi có `kontrol dokter`. Cách nói lịch sự về người cao tuổi là `lanjut usia` hoặc `lansia`; chỉ nói `tua` có thể nghe thiếu tinh tế. Khi làm việc với bệnh viện, Puskesmas, hoặc perawat, nên chuẩn bị `jadwal obat`, danh sách `keluhan`, giấy tờ, và xác nhận lịch tái khám.",
    cultural_notes_en:
      "In Indonesia, caring for elderly parents is often a shared responsibility across the extended family. Children may `bergantian menjaga` at home, hire a `perawat`, or ask relatives to help around `kontrol dokter`. Polite wording for elderly people is `lanjut usia` or `lansia`; plain `tua` can sound insensitive. When dealing with hospitals, Puskesmas, or caregivers, prepare the medicine schedule, symptom list, documents, and follow-up appointment details.",
    tip_advice_vi:
      "Mẹo cho người Việt: `orang tua` giống tiếng Việt ở chỗ có thể là 'cha mẹ', không phải lúc nào cũng là 'người già'. Nếu cần nói rõ người cao tuổi, dùng `lansia` hoặc `orang lanjut usia`. Với thuốc và chăm sóc, dùng cụm cụ thể: `obat harian`, `jadwal obat`, `dosis terlewat`, `kontrol dokter`, `kursi roda`, `perawatan rumah`. Khi nhờ hỗ trợ, `tolong` đủ lịch sự; với y tế khẩn cấp thêm `segera`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: `orang tua` can mean parents, not always elderly people. If you need to be clear, use `lansia` or `orang lanjut usia`. For medicine and care, use concrete chunks: `obat harian`, `jadwal obat`, `dosis terlewat`, `kontrol dokter`, `kursi roda`, `perawatan rumah`. When asking for help, `tolong` is polite enough; for urgent health matters add `segera`.",
    vocabulary: [
      {
        cell_id: "6a36ed8f-2d66-42ca-826c-a3c69b70b750",
        word: "lanjut usia",
        en: "elderly / advanced in age",
        vi: "cao tuổi",
        pos: "adjective phrase",
        pronunciation_vi: "lan-JUT U-si-a",
        pronunciation_en: "lan-JUT OO-see-a",
      },
      {
        cell_id: "116422fa-4859-4ec5-8ac2-0912d34aa586",
        word: "lansia",
        en: "elderly person / senior",
        vi: "người cao tuổi",
        pos: "noun",
        pronunciation_vi: "LAN-si-a",
        pronunciation_en: "LAN-see-a",
      },
      {
        cell_id: "736309a8-418a-4e38-baf5-3f469d1098fb",
        word: "perawat",
        en: "nurse / caregiver",
        vi: "điều dưỡng / người chăm sóc",
        pos: "noun",
        pronunciation_vi: "pe-RA-wat",
        pronunciation_en: "pe-RA-wat",
      },
      {
        cell_id: "19e70a49-2975-415f-a03b-15c14798538e",
        word: "obat harian",
        en: "daily medicine",
        vi: "thuốc hằng ngày",
        pos: "noun phrase",
        pronunciation_vi: "O-bat HA-ri-an",
        pronunciation_en: "O-bat HA-ree-an",
      },
      {
        cell_id: "e1772bf9-32c5-4547-96c2-5e500f6f4996",
        word: "jadwal obat",
        en: "medicine schedule",
        vi: "lịch uống thuốc",
        pos: "noun phrase",
        pronunciation_vi: "JAD-wal O-bat",
        pronunciation_en: "JAD-wal O-bat",
      },
      {
        cell_id: "8abc487a-896f-4242-94ff-3e68fcfef930",
        word: "kontrol dokter",
        en: "doctor follow-up / checkup",
        vi: "tái khám với bác sĩ",
        pos: "noun phrase",
        pronunciation_vi: "kon-TROL DOK-ter",
        pronunciation_en: "kon-TROL DOK-ter",
      },
      {
        cell_id: "dc861c16-876e-44ea-9064-e78c28219c01",
        word: "kursi roda",
        en: "wheelchair",
        vi: "xe lăn",
        pos: "noun",
        pronunciation_vi: "KUR-si RO-da",
        pronunciation_en: "KUR-see RO-da",
      },
      {
        cell_id: "d359b9ab-6a2e-4723-b62e-eb10febdb632",
        word: "perawatan rumah",
        en: "home care",
        vi: "chăm sóc tại nhà",
        pos: "noun phrase",
        pronunciation_vi: "pe-RA-wat-an RU-mah",
        pronunciation_en: "pe-RA-wat-an ROO-mah",
      },
      {
        cell_id: "e6fb0887-0c08-455b-bb9e-8cec40c62903",
        word: "bergantian menjaga",
        en: "take turns caring for",
        vi: "thay phiên nhau chăm sóc",
        pos: "verb phrase",
        pronunciation_vi: "ber-gan-TI-an men-JA-ga",
        pronunciation_en: "ber-gan-TEE-an men-JA-ga",
      },
      {
        cell_id: "b8b239bc-822b-4f1b-afab-d011c487e4f0",
        word: "keluhan mendadak",
        en: "sudden complaint / symptom",
        vi: "triệu chứng đột ngột",
        pos: "noun phrase",
        pronunciation_vi: "ke-LU-han men-DA-dak",
        pronunciation_en: "ke-LOO-han men-DA-dak",
      },
    ],
    dialogue: [
      {
        cell_id: "0f57fbb1-d8b7-45c2-9855-8ab9f42ce96d",
        speaker: "Anak",
        text: "Bu, besok ada kontrol dokter untuk Ayah. Obat hariannya sudah saya siapkan.",
        vi: "Mẹ ơi, mai có lịch tái khám cho bố. Thuốc hằng ngày con đã chuẩn bị rồi.",
        en: "Mom, Dad has a doctor follow-up tomorrow. I have prepared his daily medicine.",
      },
      {
        cell_id: "bd827344-66db-43b8-9295-2d5236a93435",
        speaker: "Ibu",
        text: "Baik. Tolong siapkan kursi roda sebelum kita berangkat.",
        vi: "Được. Con chuẩn bị xe lăn trước khi mình đi nhé.",
        en: "All right. Please prepare the wheelchair before we leave.",
      },
      {
        cell_id: "fca2273a-6884-4f44-83d6-dee81e44bab5",
        speaker: "Anak",
        text: "Perawat juga datang pagi ini untuk membantu mandi dan latihan jalan.",
        vi: "Người chăm sóc cũng đến sáng nay để hỗ trợ tắm và tập đi.",
        en: "The caregiver is also coming this morning to help with bathing and walking practice.",
      },
      {
        cell_id: "30659c55-9722-4b28-b04f-5249a592f410",
        speaker: "Ibu",
        text: "Kalau ada keluhan mendadak, kita segera hubungi dokter.",
        vi: "Nếu có triệu chứng đột ngột, mình liên hệ bác sĩ ngay.",
        en: "If there is any sudden symptom, we will contact the doctor immediately.",
      },
      {
        cell_id: "db0f6620-1f83-4147-b422-d8556a44ea45",
        speaker: "Anak",
        text: "Iya, Bu. Keluarga juga bergantian menjaga Ayah di rumah.",
        vi: "Vâng ạ. Gia đình cũng thay phiên nhau chăm bố ở nhà.",
        en: "Yes, Mom. The family is also taking turns caring for Dad at home.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm từ chăm sóc gia đình còn thiếu:",
        instruction_en: "Fill in the missing family-care phrase:",
        items: [
          {
            prompt: "Ayah harus minum ___ harian setelah makan pagi.",
            answer: "obat",
            options: ["obat", "kursi", "jadwal"],
          },
          {
            prompt: "Besok pagi ada kontrol ___ di rumah sakit.",
            answer: "dokter",
            options: ["dokter", "roda", "rumah"],
          },
          {
            prompt: "Tolong siapkan kursi ___ sebelum berangkat.",
            answer: "roda",
            options: ["roda", "obat", "usia"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ Indonesia với nghĩa tiếng Việt:",
        instruction_en: "Match the Indonesian phrase with its Vietnamese meaning:",
        items: [
          { prompt: "lansia", answer: "người cao tuổi" },
          { prompt: "perawat", answer: "điều dưỡng / người chăm sóc" },
          { prompt: "obat harian", answer: "thuốc hằng ngày" },
          { prompt: "kursi roda", answer: "xe lăn" },
          { prompt: "perawatan rumah", answer: "chăm sóc tại nhà" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          {
            prompt: "Mẹ tôi đã cao tuổi.",
            answer: "Ibu saya sudah lanjut usia.",
          },
          {
            prompt: "Chúng tôi đang tìm người chăm sóc để hỗ trợ chăm sóc tại nhà.",
            answer: "Kami mencari perawat untuk membantu perawatan rumah.",
          },
          {
            prompt: "Nếu có triệu chứng đột ngột, hãy liên hệ bác sĩ ngay.",
            answer: "Kalau ada keluhan mendadak, segera hubungi dokter.",
          },
        ],
      },
    ],
  },
];

export default elderCareFamilyLessons;
