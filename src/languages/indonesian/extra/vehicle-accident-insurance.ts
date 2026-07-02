// Vehicle Accident & Insurance Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It follows the established Indonesian extra
// lesson format: Indonesian target text lives in `en`, Vietnamese glosses live in
// `vi`, and each Vietnamese-facing learning note has an English companion.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus -- same length + order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  /** Indonesian word/phrase. */
  word: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Part of speech, e.g. "noun", "verb", "phrase". */
  pos: string;
  /** Vietnamese pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  speaker: string;
  /** Indonesian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
  en?: string;
};

// Loosely typed so per-type fields (translation, fill-blank, matching) can vary.
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
    id: "indonesian_vehicle_accident_insurance",
    level: "B1",
    category: "transport",
    title_vi: "Tai nạn xe và bảo hiểm",
    title_en: "Vehicle accidents and insurance",
    sentences: [
      {
        en: "Saya mengalami kecelakaan kendaraan di jalan tol.",
        vi: "Tôi gặp tai nạn xe trên đường cao tốc.",
        pronunciation_focus: [
          "SA-ya me-nga-LA-mi ke-ce-la-KA-an ken-da-RA-an di JA-lan tol -- `mengalami` = trải qua/gặp phải; `kecelakaan kendaraan` = tai nạn xe.",
          "Lỗi người Việt: nói `saya kena kecelakaan` trong văn cảnh bảo hiểm. Tự nhiên và rõ hơn: `saya mengalami kecelakaan`.",
          "Luyện: `Saya mengalami kecelakaan kendaraan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya me-nga-LA-mi ke-che-la-KA-an ken-da-RA-an di JA-lan tol -- `mengalami` = experience/suffer; `kecelakaan kendaraan` = vehicle accident.",
          "VN-speaker trap: saying `saya kena kecelakaan` in an insurance context. Clearer: `saya mengalami kecelakaan`.",
          "Drill: `Saya mengalami kecelakaan kendaraan.`",
        ],
      },
      {
        en: "Saya mau mengajukan klaim asuransi mobil.",
        vi: "Tôi muốn nộp yêu cầu bồi thường bảo hiểm ô tô.",
        pronunciation_focus: [
          "SA-ya mau me-nga-JU-kan klaim a-su-RAN-si MO-bil -- `mengajukan klaim` = nộp yêu cầu bồi thường; `asuransi` = bảo hiểm.",
          "Lỗi người Việt: dùng `minta uang asuransi` nghe thiếu chính thức. Cụm chuẩn là `mengajukan klaim`.",
          "Luyện: `Saya mau mengajukan klaim asuransi.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau me-nga-JOO-kan claim a-su-RAN-si MO-bil -- `mengajukan klaim` = file a claim; `asuransi` = insurance.",
          "VN-speaker trap: `minta uang asuransi` sounds unofficial. The standard chunk is `mengajukan klaim`.",
          "Drill: `Saya mau mengajukan klaim asuransi.`",
        ],
      },
      {
        en: "Apakah harus ke bengkel rekanan?",
        vi: "Có phải đến gara liên kết của bảo hiểm không?",
        pronunciation_focus: [
          "a-pa-KAH HA-rus ke BENG-kel re-KA-nan -- `bengkel rekanan` = xưởng/gara đối tác liên kết.",
          "`ke bengkel` = đi đến gara; dùng `ke` vì có hướng di chuyển, khác `di bengkel` = ở gara.",
          "Luyện: `Harus ke bengkel rekanan?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH HA-rus ke BENG-kel re-KA-nan -- `bengkel rekanan` = partner/approved repair shop.",
          "`Ke bengkel` = to the workshop; use `ke` for movement, unlike `di bengkel` = at the workshop.",
          "Drill: `Harus ke bengkel rekanan?`",
        ],
      },
      {
        en: "Saya sudah menulis kronologi kecelakaan.",
        vi: "Tôi đã viết trình tự diễn biến tai nạn.",
        pronunciation_focus: [
          "SA-ya SU-dah me-NU-lis kro-no-lo-GI ke-ce-la-KA-an -- `kronologi` = trình tự sự việc/diễn biến.",
          "Mẹo: khi bảo hiểm hoặc cảnh sát hỏi `kronologi`, kể theo thứ tự: sebelum, saat, setelah.",
          "Luyện: `Saya sudah menulis kronologi.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah me-NOO-lis kro-no-lo-GI ke-che-la-KA-an -- `kronologi` = chronology/sequence of events.",
          "Tip: when insurance or police ask for `kronologi`, tell it in order: before, during, after.",
          "Drill: `Saya sudah menulis kronologi.`",
        ],
      },
      {
        en: "Ini foto kerusakan bagian depan mobil.",
        vi: "Đây là ảnh hư hỏng phần trước của xe.",
        pronunciation_focus: [
          "I-ni FO-to ke-ru-SA-kan BA-gi-an de-PAN MO-bil -- `foto kerusakan` = ảnh thiệt hại/hư hỏng; `bagian depan` = phần trước.",
          "`kerusakan` là danh từ từ `rusak` = hỏng. Trong hồ sơ, dùng danh từ này thay vì chỉ nói `rusak`.",
          "Luyện: `Ini foto kerusakan mobil.`",
        ],
        pronunciation_focus_en: [
          "EE-ni FO-to ke-ru-SA-kan BA-gi-an de-PAN MO-bil -- `foto kerusakan` = damage photos; `bagian depan` = front part.",
          "`Kerusakan` is the noun from `rusak` = damaged. In paperwork, use this noun rather than only `rusak`.",
          "Drill: `Ini foto kerusakan mobil.`",
        ],
      },
      {
        en: "Polisi sudah membuat laporan kecelakaan.",
        vi: "Cảnh sát đã lập biên bản/báo cáo tai nạn.",
        pronunciation_focus: [
          "po-LI-si SU-dah mem-BU-at la-PO-ran ke-ce-la-KA-an -- `laporan kecelakaan` = báo cáo tai nạn.",
          "Lỗi người Việt: dùng `melapor` cho giấy tờ. `Melapor` = đi trình báo; giấy/báo cáo là `laporan`.",
          "Luyện: `Polisi membuat laporan kecelakaan.`",
        ],
        pronunciation_focus_en: [
          "po-LEE-si SOO-dah mem-BOO-at la-PO-ran ke-che-la-KA-an -- `laporan kecelakaan` = accident report.",
          "VN-speaker trap: using `melapor` for the document. `Melapor` = report an incident; the document/report is `laporan`.",
          "Drill: `Polisi membuat laporan kecelakaan.`",
        ],
      },
      {
        en: "Apakah ada ganti rugi untuk kerusakan ini?",
        vi: "Có bồi thường cho thiệt hại này không?",
        pronunciation_focus: [
          "a-pa-KAH A-da GAN-ti RU-gi UN-tuk ke-ru-SA-kan I-ni -- `ganti rugi` = bồi thường.",
          "`ganti rugi` là cụm cố định; đừng dịch từng chữ thành `bayar rusak`.",
          "Luyện: `Ada ganti rugi untuk kerusakan ini?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH A-da GAN-ti ROO-gi OON-tuk ke-ru-SA-kan EE-ni -- `ganti rugi` = compensation/damages.",
          "`Ganti rugi` is a fixed phrase; do not translate literally as `bayar rusak`.",
          "Drill: `Ada ganti rugi untuk kerusakan ini?`",
        ],
      },
      {
        en: "Dokumen klaimnya harus dilengkapi hari ini.",
        vi: "Hồ sơ yêu cầu bồi thường phải được bổ sung đầy đủ hôm nay.",
        pronunciation_focus: [
          "DO-ku-men klaim-nya HA-rus di-leng-KA-pi HA-ri I-ni -- `dilengkapi` = được bổ sung cho đầy đủ.",
          "Trong văn phòng, bị động `di-` rất thường gặp: `diperiksa`, `dilengkapi`, `disetujui`.",
          "Luyện: `Dokumen klaim harus dilengkapi.`",
        ],
        pronunciation_focus_en: [
          "DO-ku-men claim-nya HA-rus di-leng-KA-pi HA-ri EE-ni -- `dilengkapi` = completed/supplemented.",
          "In offices, passive `di-` is very common: `diperiksa`, `dilengkapi`, `disetujui`.",
          "Drill: `Dokumen klaim harus dilengkapi.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi xảy ra tai nạn xe ở Indonesia, thường cần ghi lại `kronologi`, chụp `foto kerusakan`, lưu data pihak lain, liên hệ bảo hiểm, và nếu cần lập `laporan kecelakaan` với polisi. Một số polis bảo hiểm yêu cầu sửa ở `bengkel rekanan`; nếu sửa ngoài mạng lưới có thể cần persetujuan dulu. Không tự nhận lỗi bằng văn bản nếu chưa rõ; hãy ghi sự việc theo thứ tự và giữ bukti.",
    cultural_notes_en:
      "After a vehicle accident in Indonesia, you usually need to write the chronology, photograph the damage, keep the other party's details, contact insurance, and if needed file a police accident report. Some insurance policies require repair at an approved partner workshop; repairs outside the network may need prior approval. Do not admit fault in writing if the facts are unclear; record the sequence and keep evidence.",
    tip_advice_vi:
      "Mẹo cho người Việt: nhóm từ quan trọng là `mengajukan klaim`, `bengkel rekanan`, `kronologi`, `foto kerusakan`, `laporan polisi`, `ganti rugi`. Với giấy tờ bảo hiểm, tiếng Indonesia thích danh từ và bị động: `dokumen klaim`, `laporan kecelakaan`, `harus dilengkapi`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: key chunks are `mengajukan klaim`, `bengkel rekanan`, `kronologi`, `foto kerusakan`, `laporan polisi`, `ganti rugi`. Insurance paperwork favors nouns and passives: `dokumen klaim`, `laporan kecelakaan`, `harus dilengkapi`.",
    vocabulary: [
      {
        word: "kecelakaan kendaraan",
        en: "vehicle accident",
        vi: "tai nạn xe",
        pos: "noun phrase",
        pronunciation_vi: "ke-ce-la-KA-an ken-da-RA-an",
        pronunciation_en: "ke-che-la-KA-an ken-da-RA-an",
      },
      {
        word: "asuransi",
        en: "insurance",
        vi: "bảo hiểm",
        pos: "noun",
        pronunciation_vi: "a-su-RAN-si",
        pronunciation_en: "a-su-RAN-see",
      },
      {
        word: "klaim",
        en: "claim",
        vi: "yêu cầu bồi thường",
        pos: "noun",
        pronunciation_vi: "klaim",
        pronunciation_en: "claim",
      },
      {
        word: "bengkel rekanan",
        en: "partner repair shop",
        vi: "gara liên kết",
        pos: "noun phrase",
        pronunciation_vi: "BENG-kel re-KA-nan",
        pronunciation_en: "BENG-kel re-KA-nan",
      },
      {
        word: "kronologi",
        en: "chronology",
        vi: "trình tự diễn biến",
        pos: "noun",
        pronunciation_vi: "kro-no-lo-GI",
        pronunciation_en: "kro-no-lo-GI",
      },
      {
        word: "foto kerusakan",
        en: "damage photos",
        vi: "ảnh hư hỏng/thiệt hại",
        pos: "noun phrase",
        pronunciation_vi: "FO-to ke-ru-SA-kan",
        pronunciation_en: "FO-to ke-ru-SA-kan",
      },
      {
        word: "polisi",
        en: "police",
        vi: "cảnh sát",
        pos: "noun",
        pronunciation_vi: "po-LI-si",
        pronunciation_en: "po-LEE-see",
      },
      {
        word: "ganti rugi",
        en: "compensation",
        vi: "bồi thường",
        pos: "noun phrase",
        pronunciation_vi: "GAN-ti RU-gi",
        pronunciation_en: "GAN-ti ROO-gi",
      },
      {
        word: "laporan kecelakaan",
        en: "accident report",
        vi: "báo cáo/biên bản tai nạn",
        pos: "noun phrase",
        pronunciation_vi: "la-PO-ran ke-ce-la-KA-an",
        pronunciation_en: "la-PO-ran ke-che-la-KA-an",
      },
      {
        word: "dilengkapi",
        en: "completed / supplemented",
        vi: "được bổ sung đầy đủ",
        pos: "verb",
        pronunciation_vi: "di-leng-KA-pi",
        pronunciation_en: "di-leng-KA-pi",
      },
    ],
    dialogue: [
      {
        speaker: "Nasabah",
        text: "Saya mau mengajukan klaim asuransi mobil.",
        vi: "Tôi muốn nộp yêu cầu bồi thường bảo hiểm ô tô.",
        en: "I want to file a car insurance claim.",
      },
      {
        speaker: "Petugas asuransi",
        text: "Boleh. Mohon siapkan kronologi dan foto kerusakan.",
        vi: "Được. Vui lòng chuẩn bị trình tự sự việc và ảnh hư hỏng.",
        en: "Sure. Please prepare the chronology and damage photos.",
      },
      {
        speaker: "Nasabah",
        text: "Apakah harus ada laporan polisi?",
        vi: "Có bắt buộc phải có báo cáo cảnh sát không?",
        en: "Is a police report required?",
      },
      {
        speaker: "Petugas asuransi",
        text: "Untuk kerusakan besar, biasanya perlu laporan kecelakaan.",
        vi: "Với hư hỏng lớn, thường cần báo cáo tai nạn.",
        en: "For major damage, an accident report is usually required.",
      },
      {
        speaker: "Nasabah",
        text: "Baik. Setelah itu saya ke bengkel rekanan, ya?",
        vi: "Vâng. Sau đó tôi đến gara liên kết đúng không?",
        en: "Okay. After that I go to the partner repair shop, right?",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi muốn nộp yêu cầu bồi thường bảo hiểm ô tô.",
        prompt_en: "Translate into Indonesian: I want to file a car insurance claim.",
        answer: "Saya mau mengajukan klaim asuransi mobil.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Ini foto ____ bagian depan mobil.",
        prompt_en: "Fill in the blank: Ini foto ____ bagian depan mobil.",
        answer: "kerusakan",
      },
      {
        type: "matching",
        prompt_vi: "Ghép từ với nghĩa đúng.",
        prompt_en: "Match each word with the correct meaning.",
        pairs: [
          ["bengkel rekanan", "gara liên kết / partner repair shop"],
          ["kronologi", "trình tự diễn biến / chronology"],
          ["ganti rugi", "bồi thường / compensation"],
          ["laporan kecelakaan", "báo cáo tai nạn / accident report"],
        ],
      },
    ],
    content:
      "Useful accident-insurance chunks: `Saya mengalami kecelakaan kendaraan` (I had a vehicle accident), `Saya mau mengajukan klaim` (I want to file a claim), `Harus ke bengkel rekanan?` (must I go to a partner workshop?), `Ini foto kerusakan` (these are damage photos), `Ada ganti rugi?` (is there compensation?), and `Dokumen klaim harus dilengkapi` (the claim documents must be completed).",
  },
];
