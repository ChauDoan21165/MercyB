// Workplace Safety PPE Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for workplace safety: APD/PPE, project
// helmets, safety shoes, K3 training, incident reports, and dangerous areas.
// Indonesian target text lives in `en`, Vietnamese glosses in `vi`, Vietnamese
// L1 notes in `pronunciation_focus`, and English companions in
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

export const workplaceSafetyPpeLessons: IndonesianLesson[] = [
  {
    id: "indonesian_workplace_safety_ppe",
    level: "A2",
    category: "workplace_safety",
    title_vi: "Keselamatan kerja và APD ở nơi làm việc",
    title_en: "Workplace safety and PPE",
    sentences: [
      {
        en: "Keselamatan kerja harus menjadi prioritas semua orang.",
        vi: "An toàn lao động phải là ưu tiên của mọi người.",
        pronunciation_focus: [
          "ke-se-la-MAT-an KER-ja - `keselamatan kerja` = an toàn lao động.",
          "`harus menjadi prioritas` = phải trở thành ưu tiên; câu công sở rất tự nhiên.",
          "Lỗi người Việt: dịch `an toàn` thành chỉ `aman`. Chủ đề hệ thống/quy định là `keselamatan`.",
          "Luyện: `Keselamatan kerja harus menjadi prioritas.`",
        ],
        pronunciation_focus_en: [
          "ke-se-la-MAT-an KER-ja - `keselamatan kerja` = workplace safety.",
          "`harus menjadi prioritas` = must be a priority; natural workplace wording.",
          "VN-speaker trap: translating safety only as `aman`. For systems/rules, use `keselamatan`.",
          "Drill: `Keselamatan kerja harus menjadi prioritas.`",
        ],
      },
      {
        en: "Sebelum masuk area proyek, semua pekerja wajib memakai APD.",
        vi: "Trước khi vào khu vực công trình, mọi công nhân bắt buộc phải dùng đồ bảo hộ.",
        pronunciation_focus: [
          "A-pe-DE - `APD` = Alat Pelindung Diri, đồ bảo hộ cá nhân/PPE.",
          "`wajib memakai` = bắt buộc phải dùng/mặc; mạnh hơn `harus` trong quy định.",
          "Lỗi người Việt: nói `pakai alat safety` được hiểu, nhưng thuật ngữ K3 là `memakai APD`.",
          "Luyện: `Semua pekerja wajib memakai APD.`",
        ],
        pronunciation_focus_en: [
          "A-pe-DE - `APD` = Alat Pelindung Diri, personal protective equipment/PPE.",
          "`wajib memakai` = required to wear/use; stronger than `harus` in rules.",
          "VN-speaker trap: `pakai alat safety` is understood, but the K3 term is `memakai APD`.",
          "Drill: `Semua pekerja wajib memakai APD.`",
        ],
      },
      {
        en: "Helm proyek dan sepatu safety tidak boleh dilepas di area berbahaya.",
        vi: "Mũ bảo hộ công trình và giày bảo hộ không được tháo ra trong khu vực nguy hiểm.",
        pronunciation_focus: [
          "HELM PRO-yek - `helm proyek` = mũ bảo hộ công trình.",
          "`tidak boleh dilepas` = không được tháo ra; bị động `di-` cho đồ bị tháo.",
          "`area berbahaya` = khu vực nguy hiểm; `berbahaya` là tính từ từ `bahaya`.",
          "Luyện: `Helm proyek tidak boleh dilepas.`",
        ],
        pronunciation_focus_en: [
          "HELM PRO-yek - `helm proyek` = construction helmet/hard hat.",
          "`tidak boleh dilepas` = must not be removed; passive `di-` for the item being removed.",
          "`area berbahaya` = dangerous area; `berbahaya` is the adjective from `bahaya`.",
          "Drill: `Helm proyek tidak boleh dilepas.`",
        ],
      },
      {
        en: "Saya belum ikut pelatihan K3 minggu ini.",
        vi: "Tuần này tôi chưa tham gia đào tạo K3.",
        pronunciation_focus: [
          "pe-LA-tih-an ka-TI-ga - `pelatihan K3` = đào tạo an toàn sức khỏe lao động.",
          "`K3` = Keselamatan dan Kesehatan Kerja; thường đọc `ka tiga`.",
          "`belum ikut` = chưa tham gia; dùng `belum`, không phải `tidak`, nếu còn có thể tham gia.",
          "Luyện: `Saya belum ikut pelatihan K3.`",
        ],
        pronunciation_focus_en: [
          "pe-LA-tih-an ka-TEE-ga - `pelatihan K3` = occupational safety and health training.",
          "`K3` = Keselamatan dan Kesehatan Kerja; often read `ka tiga`.",
          "`belum ikut` = have not joined yet; use `belum`, not `tidak`, if still possible.",
          "Drill: `Saya belum ikut pelatihan K3.`",
        ],
      },
      {
        en: "Jangan masuk tanpa izin ke area berbahaya.",
        vi: "Đừng vào khu vực nguy hiểm khi chưa có phép.",
        pronunciation_focus: [
          "JA-ngan MA-suk - `jangan` dùng cho lệnh cấm/đừng, không dùng `tidak`.",
          "`tanpa izin` = không có phép/chưa được phép.",
          "Lỗi người Việt: nói `tidak masuk` chỉ là không vào, không phải lệnh cấm. Biển cảnh báo dùng `jangan masuk`.",
          "Luyện: `Jangan masuk tanpa izin.`",
        ],
        pronunciation_focus_en: [
          "JA-ngan MA-suk - `jangan` is used for prohibitions/negative commands, not `tidak`.",
          "`tanpa izin` = without permission.",
          "VN-speaker trap: `tidak masuk` only says does not enter; it is not a prohibition. Warning signs use `jangan masuk`.",
          "Drill: `Jangan masuk tanpa izin.`",
        ],
      },
      {
        en: "Kalau melihat kabel terbuka, segera lapor ke supervisor.",
        vi: "Nếu thấy dây điện hở, hãy báo ngay cho giám sát.",
        pronunciation_focus: [
          "KA-bel ter-BU-ka - `kabel terbuka` = dây điện/dây cáp bị hở.",
          "`segera lapor` = báo ngay; cụm an toàn dùng khi có nguy cơ.",
          "`ke supervisor` = cho giám sát; trong xưởng/công trình chức danh này rất thường dùng.",
          "Luyện: `Segera lapor ke supervisor.`",
        ],
        pronunciation_focus_en: [
          "KA-bel ter-BOO-ka - `kabel terbuka` = exposed cable/wire.",
          "`segera lapor` = report immediately; a safety phrase for hazards.",
          "`ke supervisor` = to the supervisor; common on factory/site floors.",
          "Drill: `Segera lapor ke supervisor.`",
        ],
      },
      {
        en: "Ada pekerja terpeleset, tetapi tidak ada luka serius.",
        vi: "Có công nhân bị trượt ngã, nhưng không có vết thương nghiêm trọng.",
        pronunciation_focus: [
          "ter-pe-LE-set - `terpeleset` = bị trượt ngã/vấp trượt.",
          "`luka serius` = vết thương nghiêm trọng; `serius` là từ mượn dễ nhận ra.",
          "`tidak ada` = không có; dùng cho sự tồn tại, giống `không có` tiếng Việt.",
          "Luyện: `Ada pekerja terpeleset.`",
        ],
        pronunciation_focus_en: [
          "ter-pe-LE-set - `terpeleset` = slipped/fell by slipping.",
          "`luka serius` = serious injury; `serius` is an easy loanword.",
          "`tidak ada` = there is/are no; used for existence, like Vietnamese `khong co`.",
          "Drill: `Ada pekerja terpeleset.`",
        ],
      },
      {
        en: "Kami harus membuat laporan insiden sebelum pulang.",
        vi: "Chúng tôi phải làm báo cáo sự cố trước khi về.",
        pronunciation_focus: [
          "la-PO-ran IN-si-den - `laporan insiden` = báo cáo sự cố/tai nạn.",
          "`membuat laporan` = làm/lập báo cáo; không dịch là `bikin report` trong văn bản.",
          "`sebelum pulang` = trước khi về nhà; `pulang` thường là về nơi mình ở.",
          "Luyện: `Kami harus membuat laporan insiden.`",
        ],
        pronunciation_focus_en: [
          "la-PO-ran IN-si-den - `laporan insiden` = incident report.",
          "`membuat laporan` = make/prepare a report; avoid casual `bikin report` in formal writing.",
          "`sebelum pulang` = before going home; `pulang` usually means return home/base.",
          "Drill: `Kami harus membuat laporan insiden.`",
        ],
      },
      {
        en: "Pastikan masker dan sarung tangan dipakai dengan benar.",
        vi: "Hãy bảo đảm khẩu trang và găng tay được đeo/mang đúng cách.",
        pronunciation_focus: [
          "PAS-ti-kan - `pastikan` = hãy bảo đảm/kiểm tra chắc.",
          "`sarung tangan` = găng tay; nghĩa đen là bao tay.",
          "`dipakai dengan benar` = được dùng đúng cách; `dengan benar` = một cách đúng.",
          "Luyện: `Pastikan APD dipakai dengan benar.`",
        ],
        pronunciation_focus_en: [
          "PAS-ti-kan - `pastikan` = make sure/ensure.",
          "`sarung tangan` = gloves; literally hand covering.",
          "`dipakai dengan benar` = worn/used correctly; `dengan benar` = correctly.",
          "Drill: `Pastikan APD dipakai dengan benar.`",
        ],
      },
      {
        en: "Kalau merasa pusing, berhenti kerja dan minta bantuan.",
        vi: "Nếu cảm thấy chóng mặt, hãy dừng làm việc và xin hỗ trợ.",
        pronunciation_focus: [
          "PU-sing - `pusing` = chóng mặt/đau đầu tùy ngữ cảnh.",
          "`berhenti kerja` = dừng làm việc; trong an toàn lao động, đừng cố tiếp tục.",
          "`minta bantuan` = xin hỗ trợ; danh từ `bantuan`, không phải động từ `bantu`.",
          "Luyện: `Berhenti kerja dan minta bantuan.`",
        ],
        pronunciation_focus_en: [
          "POO-sing - `pusing` = dizzy/headache depending on context.",
          "`berhenti kerja` = stop working; in safety contexts, do not push through.",
          "`minta bantuan` = ask for help; noun `bantuan`, not verb `bantu`.",
          "Drill: `Berhenti kerja dan minta bantuan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "`K3` là cách nói rất phổ biến ở Indonesia cho keselamatan dan kesehatan kerja. Ở nhà máy, công trình, kho, hoặc xưởng, pekerja thường phải memakai `APD` như helm proyek, sepatu safety, masker, sarung tangan, rompi, hoặc kacamata pelindung. Với nguy cơ nhỏ cũng nên `segera lapor`, vì nhiều công ty yêu cầu `laporan insiden` ngay cả khi tidak ada luka serius. Biển cảnh báo thường dùng `Wajib memakai APD`, `Dilarang masuk`, `Awas area berbahaya`, và `Laporkan insiden`.",
    cultural_notes_en:
      "`K3` is the common Indonesian term for occupational safety and health. In factories, construction sites, warehouses, or workshops, workers are often required to wear `APD` such as hard hats, safety shoes, masks, gloves, vests, or protective glasses. Even small hazards should be reported immediately, because many companies require an `incident report` even when there is no serious injury. Warning signs often use `Wajib memakai APD`, `Dilarang masuk`, `Awas area berbahaya`, and `Laporkan insiden`.",
    tip_advice_vi:
      "Mẹo cho người Việt: mệnh lệnh cấm dùng `jangan` hoặc biển báo `dilarang`, không dùng `tidak`. Học nguyên cụm an toàn: `wajib memakai APD`, `helm proyek`, `sepatu safety`, `pelatihan K3`, `area berbahaya`, `segera lapor`, `laporan insiden`. Khi không chắc có an toàn không, câu ngắn `Ini berbahaya?` hoặc `Boleh masuk area ini?` rất hữu ích.",
    tip_advice_en:
      "Tip for Vietnamese speakers: prohibitions use `jangan` or sign language `dilarang`, not `tidak`. Learn safety chunks whole: `wajib memakai APD`, `helm proyek`, `sepatu safety`, `pelatihan K3`, `area berbahaya`, `segera lapor`, `laporan insiden`. When unsure about safety, short questions like `Ini berbahaya?` or `Boleh masuk area ini?` are useful.",
    vocabulary: [
      {
        cell_id: "4a9d036c-7a58-48ff-839b-006c04e49c09",
        word: "keselamatan kerja",
        en: "workplace safety",
        vi: "an toàn lao động",
        pos: "noun phrase",
        pronunciation_vi: "ke-se-la-MAT-an KER-ja",
        pronunciation_en: "ke-se-la-MAT-an KER-ja",
      },
      {
        cell_id: "b031e6e4-f53c-4315-8b69-9c3e5dab3d0f",
        word: "APD",
        en: "PPE / personal protective equipment",
        vi: "đồ bảo hộ cá nhân",
        pos: "noun",
        pronunciation_vi: "A-pe-DE",
        pronunciation_en: "A-pe-DAY",
      },
      {
        cell_id: "2eb3f3ea-d720-4420-90dc-6db686b33bb5",
        word: "helm proyek",
        en: "hard hat / project helmet",
        vi: "mũ bảo hộ công trình",
        pos: "noun phrase",
        pronunciation_vi: "HELM PRO-yek",
        pronunciation_en: "HELM PRO-yek",
      },
      {
        cell_id: "0e3aea00-6b6d-453c-ab6d-7e52ca9ea41e",
        word: "sepatu safety",
        en: "safety shoes",
        vi: "giày bảo hộ",
        pos: "noun phrase",
        pronunciation_vi: "se-PA-tu SEF-ti",
        pronunciation_en: "se-PA-too SAFE-tee",
      },
      {
        cell_id: "c2c6db1c-65c3-4f6d-ba29-abc85a8f8699",
        word: "pelatihan K3",
        en: "occupational safety training",
        vi: "đào tạo K3 / an toàn lao động",
        pos: "noun phrase",
        pronunciation_vi: "pe-LA-tih-an ka-TI-ga",
        pronunciation_en: "pe-LA-tih-an ka-TEE-ga",
      },
      {
        cell_id: "fb123924-8321-4355-a61f-4a04d5855274",
        word: "laporan insiden",
        en: "incident report",
        vi: "báo cáo sự cố",
        pos: "noun phrase",
        pronunciation_vi: "la-PO-ran IN-si-den",
        pronunciation_en: "la-PO-ran IN-see-den",
      },
      {
        cell_id: "097a5828-df64-4785-8c80-c420df7654d6",
        word: "area berbahaya",
        en: "dangerous area",
        vi: "khu vực nguy hiểm",
        pos: "noun phrase",
        pronunciation_vi: "A-re-a ber-ba-HA-ya",
        pronunciation_en: "A-re-a ber-ba-HA-ya",
      },
      {
        cell_id: "c2d883a4-42d6-4b65-95ef-d052e64bddb9",
        word: "kabel terbuka",
        en: "exposed cable",
        vi: "dây điện/cáp bị hở",
        pos: "noun phrase",
        pronunciation_vi: "KA-bel ter-BU-ka",
        pronunciation_en: "KA-bel ter-BOO-ka",
      },
      {
        cell_id: "8303e690-a710-4d95-9b78-54502940a393",
        word: "terpeleset",
        en: "slipped",
        vi: "bị trượt ngã",
        pos: "verb",
        pronunciation_vi: "ter-pe-LE-set",
        pronunciation_en: "ter-pe-LE-set",
      },
      {
        cell_id: "2d1557a6-dc8c-4258-a911-0a79f5126b7f",
        word: "sarung tangan",
        en: "gloves",
        vi: "găng tay",
        pos: "noun",
        pronunciation_vi: "SA-rung TA-ngan",
        pronunciation_en: "SA-roong TA-ngan",
      },
    ],
    dialogue: [
      {
        cell_id: "810ddfb2-d68c-4158-9f6c-25df26806828",
        speaker: "Supervisor",
        text: "Sebelum masuk area proyek, semua pekerja wajib memakai APD.",
        vi: "Trước khi vào khu vực công trình, mọi công nhân bắt buộc phải dùng đồ bảo hộ.",
        en: "Before entering the project area, all workers must wear PPE.",
      },
      {
        cell_id: "db82160c-6924-489e-a153-be8ca58f942b",
        speaker: "Pekerja",
        text: "Baik, Pak. Helm proyek dan sepatu safety sudah saya pakai.",
        vi: "Vâng anh. Mũ bảo hộ và giày bảo hộ tôi đã mang rồi.",
        en: "Yes, sir. I am already wearing the hard hat and safety shoes.",
      },
      {
        cell_id: "ea986497-632b-445a-b64a-5b029d39f21b",
        speaker: "Supervisor",
        text: "Kalau melihat kabel terbuka atau area berbahaya, segera lapor.",
        vi: "Nếu thấy dây điện hở hoặc khu vực nguy hiểm, báo ngay.",
        en: "If you see exposed cables or a dangerous area, report it immediately.",
      },
      {
        cell_id: "fd192672-8039-4ccf-9679-d4d1af42d187",
        speaker: "Pekerja",
        text: "Tadi ada pekerja terpeleset, tetapi tidak ada luka serius.",
        vi: "Lúc nãy có công nhân bị trượt ngã, nhưng không có vết thương nghiêm trọng.",
        en: "A worker slipped earlier, but there was no serious injury.",
      },
      {
        cell_id: "f3b3280b-0b8f-4fb2-ae1f-ffd373acf540",
        speaker: "Supervisor",
        text: "Tetap buat laporan insiden sebelum pulang.",
        vi: "Vẫn lập báo cáo sự cố trước khi về.",
        en: "Still make an incident report before going home.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm từ an toàn lao động còn thiếu:",
        instruction_en: "Fill in the missing safety phrase:",
        items: [
          {
            prompt: "Semua pekerja wajib memakai ___.",
            answer: "APD",
            options: ["APD", "KTP", "ATM"],
          },
          {
            prompt: "Helm proyek tidak boleh dilepas di area ___.",
            answer: "berbahaya",
            options: ["berbahaya", "bersama", "berangkat"],
          },
          {
            prompt: "Kami harus membuat laporan ___ sebelum pulang.",
            answer: "insiden",
            options: ["insiden", "sarapan", "alamat"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ Indonesia với nghĩa tiếng Việt:",
        instruction_en: "Match the Indonesian phrase with its Vietnamese meaning:",
        items: [
          { prompt: "keselamatan kerja", answer: "an toàn lao động" },
          { prompt: "sepatu safety", answer: "giày bảo hộ" },
          { prompt: "pelatihan K3", answer: "đào tạo K3" },
          { prompt: "laporan insiden", answer: "báo cáo sự cố" },
          { prompt: "area berbahaya", answer: "khu vực nguy hiểm" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          {
            prompt: "Mọi công nhân bắt buộc phải dùng đồ bảo hộ.",
            answer: "Semua pekerja wajib memakai APD.",
          },
          {
            prompt: "Nếu thấy dây điện hở, hãy báo ngay cho giám sát.",
            answer: "Kalau melihat kabel terbuka, segera lapor ke supervisor.",
          },
          {
            prompt: "Chúng tôi phải làm báo cáo sự cố trước khi về.",
            answer: "Kami harus membuat laporan insiden sebelum pulang.",
          },
        ],
      },
    ],
  },
];

export default workplaceSafetyPpeLessons;
