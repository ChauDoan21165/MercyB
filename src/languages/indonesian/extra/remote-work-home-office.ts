// Remote Work & Home Office Indonesian (Vietnamese -> Indonesian study track).
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
  cell_id?: string;
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
  cell_id?: string;
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
    id: "indonesian_remote_work_home_office",
    level: "B1",
    category: "work",
    title_vi: "Làm việc từ nhà và góc làm việc",
    title_en: "Remote work and home office",
    sentences: [
      {
        en: "Saya kerja dari rumah tiga hari seminggu.",
        vi: "Tôi làm việc từ nhà ba ngày một tuần.",
        pronunciation_focus: [
          "SA-ya KER-ja da-ri RU-mah TI-ga HA-ri se-MING-gu -- `kerja dari rumah` = làm việc từ nhà.",
          "Mẹo: cũng có thể nghe `WFH`, đọc kiểu tiếng Anh, nhưng câu đầy đủ `kerja dari rumah` rõ hơn.",
          "Luyện: `Saya kerja dari rumah.`",
        ],
        pronunciation_focus_en: [
          "SA-ya KER-ja da-ri ROO-mah TEE-ga HA-ri se-MING-goo -- `kerja dari rumah` = work from home.",
          "Tip: you may also hear `WFH`, pronounced English-style, but the full phrase `kerja dari rumah` is clearer.",
          "Drill: `Saya kerja dari rumah.`",
        ],
      },
      {
        en: "Saya perlu ruang kerja yang tenang untuk rapat online.",
        vi: "Tôi cần không gian làm việc yên tĩnh để họp online.",
        pronunciation_focus: [
          "SA-ya per-LU RU-ang KER-ja yang te-NANG UN-tuk RA-pat on-LINE -- `ruang kerja` = không gian/phòng làm việc; `rapat online` = họp online.",
          "Lỗi người Việt: dùng `kamar kerja` cho mọi trường hợp. `Ruang kerja` tự nhiên hơn cho workspace.",
          "Luyện: `Saya perlu ruang kerja yang tenang.`",
        ],
        pronunciation_focus_en: [
          "SA-ya per-LOO ROO-ang KER-ja yang te-NANG OON-tuk RA-pat on-LINE -- `ruang kerja` = workspace/office room; `rapat online` = online meeting.",
          "VN-speaker trap: using `kamar kerja` for everything. `Ruang kerja` is more natural for a workspace.",
          "Drill: `Saya perlu ruang kerja yang tenang.`",
        ],
      },
      {
        en: "Ada gangguan rumah, jadi saya agak terlambat masuk meeting.",
        vi: "Có việc gây gián đoạn ở nhà, nên tôi hơi vào cuộc họp trễ.",
        pronunciation_focus: [
          "A-da gang-GU-an RU-mah, JA-di SA-ya A-gak ter-LAM-bat MA-suk MEE-ting -- `gangguan rumah` = gián đoạn ở nhà; `agak` = hơi.",
          "`jadi` nối nguyên nhân-kết quả rất tự nhiên: có việc ở nhà, nên vào meeting muộn.",
          "Luyện: `Ada gangguan rumah, jadi saya terlambat.`",
        ],
        pronunciation_focus_en: [
          "A-da gang-GOO-an ROO-mah, JA-di SA-ya A-gak ter-LAM-bat MA-suk MEE-ting -- `gangguan rumah` = home interruption; `agak` = somewhat.",
          "`Jadi` naturally links cause and result: home issue, so joining the meeting late.",
          "Drill: `Ada gangguan rumah, jadi saya terlambat.`",
        ],
      },
      {
        en: "Jadwal kerja saya fleksibel, tapi laporan online tetap harus dikirim sore ini.",
        vi: "Lịch làm việc của tôi linh hoạt, nhưng báo cáo online vẫn phải gửi chiều nay.",
        pronunciation_focus: [
          "JAD-wal KER-ja SA-ya flek-SI-bel, TA-pi la-PO-ran on-LINE te-TAP HA-rus di-KI-rim SO-re I-ni -- `jadwal fleksibel` = lịch linh hoạt.",
          "Mẹo: `tetap harus` = vẫn phải; dùng khi lịch linh hoạt nhưng trách nhiệm không đổi.",
          "Luyện: `Laporan online tetap harus dikirim.`",
        ],
        pronunciation_focus_en: [
          "JAD-wal KER-ja SA-ya flek-SEE-bel, TA-pi la-PO-ran on-LINE te-TAP HA-rus di-KEE-rim SO-re EE-ni -- `jadwal fleksibel` = flexible schedule.",
          "Tip: `tetap harus` = still must; use it when the schedule is flexible but responsibility remains.",
          "Drill: `Laporan online tetap harus dikirim.`",
        ],
      },
      {
        en: "Komunikasi tim lebih lancar kalau semua orang update di grup.",
        vi: "Giao tiếp nhóm trôi chảy hơn nếu mọi người cập nhật trong nhóm chat.",
        pronunciation_focus: [
          "ko-mu-ni-KA-si tim LE-bih LAN-car KA-lau se-MU-a O-rang UP-date di grup -- `komunikasi tim` = giao tiếp nhóm; `lancar` = trôi chảy.",
          "Lỗi người Việt: dịch 'cập nhật' thành `memperbarui` mọi lúc. Trong việc hằng ngày, `update di grup` rất tự nhiên.",
          "Luyện: `Tolong update di grup.`",
        ],
        pronunciation_focus_en: [
          "ko-mu-ni-KA-si team LE-bih LAN-char KA-lau se-MOO-a O-rang UP-date di grup -- `komunikasi tim` = team communication; `lancar` = smooth.",
          "VN-speaker trap: translating 'update' as `memperbarui` every time. In daily work, `update di grup` is very natural.",
          "Drill: `Tolong update di grup.`",
        ],
      },
      {
        en: "Produktivitas saya lebih baik kalau mulai kerja sebelum rumah ramai.",
        vi: "Năng suất của tôi tốt hơn nếu bắt đầu làm việc trước khi nhà đông/ồn.",
        pronunciation_focus: [
          "pro-duk-ti-VI-tas SA-ya LE-bih BA-ik KA-lau MU-lai KER-ja se-BE-lum RU-mah RA-mai -- `produktivitas` = năng suất; `rumah ramai` = nhà đông/ồn.",
          "`lebih baik kalau...` = tốt hơn nếu...; mẫu này hữu ích khi giải thích cách làm việc hiệu quả.",
          "Luyện: `Produktivitas saya lebih baik kalau mulai pagi.`",
        ],
        pronunciation_focus_en: [
          "pro-duk-ti-VEE-tas SA-ya LE-bih BA-ik KA-lau MOO-lai KER-ja se-BE-lum ROO-mah RA-mai -- `produktivitas` = productivity; `rumah ramai` = busy/noisy home.",
          "`Lebih baik kalau...` = better if...; useful for explaining how you work effectively.",
          "Drill: `Produktivitas saya lebih baik kalau mulai pagi.`",
        ],
      },
      {
        en: "Kalau internet rumah bermasalah, saya akan pakai hotspot sementara.",
        vi: "Nếu internet ở nhà có vấn đề, tôi sẽ dùng hotspot tạm thời.",
        pronunciation_focus: [
          "KA-lau IN-ter-net RU-mah ber-MA-sa-lah, SA-ya A-kan PA-kai HOT-spot se-men-TA-ra -- `bermasalah` = có vấn đề; `sementara` = tạm thời.",
          "Mẹo: `kalau... saya akan...` là khung kế hoạch dự phòng đơn giản.",
          "Luyện: `Kalau internet bermasalah, saya pakai hotspot.`",
        ],
        pronunciation_focus_en: [
          "KA-lau IN-ter-net ROO-mah ber-MA-sa-lah, SA-ya A-kan PA-kai HOT-spot se-men-TA-ra -- `bermasalah` = having problems; `sementara` = temporarily.",
          "Tip: `kalau... saya akan...` is a simple backup-plan frame.",
          "Drill: `Kalau internet bermasalah, saya pakai hotspot.`",
        ],
      },
      {
        en: "Saya akan kirim ringkasan pekerjaan setelah jam kerja selesai.",
        vi: "Tôi sẽ gửi bản tóm tắt công việc sau khi hết giờ làm.",
        pronunciation_focus: [
          "SA-ya A-kan KI-rim ring-KA-san pe-KER-ja-an se-TE-lah jam KER-ja se-le-SAI -- `ringkasan pekerjaan` = tóm tắt công việc.",
          "`setelah jam kerja selesai` = sau khi giờ làm kết thúc; rõ ràng hơn chỉ nói `nanti malam`.",
          "Luyện: `Saya akan kirim ringkasan pekerjaan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya A-kan KEE-rim ring-KA-san pe-KER-ja-an se-TE-lah jam KER-ja se-le-SAI -- `ringkasan pekerjaan` = work summary.",
          "`Setelah jam kerja selesai` = after work hours end; clearer than only saying `nanti malam`.",
          "Drill: `Saya akan kirim ringkasan pekerjaan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong môi trường kerja Indonesia, `kerja dari rumah` hoặc `WFH` thường đi kèm trách nhiệm báo tiến độ rõ: update di grup, laporan online, ringkasan pekerjaan, và hadir di rapat online. Nếu có gangguan rumah, internet bermasalah, atau jadwal fleksibel, nên báo sớm với giọng profesional: nêu vấn đề, rencana cadangan, dan kapan pekerjaan selesai.",
    cultural_notes_en:
      "In Indonesian work culture, `kerja dari rumah` or `WFH` usually still requires clear progress communication: group updates, online reports, work summaries, and online meeting attendance. If there is a home interruption, internet problem, or flexible schedule issue, report early in a professional tone: state the issue, backup plan, and when the work will be finished.",
    tip_advice_vi:
      "Mẹo cho người Việt: học theo cụm công việc: `kerja dari rumah`, `ruang kerja`, `gangguan rumah`, `jadwal fleksibel`, `laporan online`, `komunikasi tim`, `produktivitas`. Khi báo lỗi, dùng khung `Ada..., jadi...` rồi thêm `Saya akan...` để đưa giải pháp.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn work chunks: `kerja dari rumah`, `ruang kerja`, `gangguan rumah`, `jadwal fleksibel`, `laporan online`, `komunikasi tim`, `produktivitas`. When reporting an issue, use the frame `Ada..., jadi...` then add `Saya akan...` to give a solution.",
    vocabulary: [
      {
        cell_id: "3c024018-ca55-46df-ae5b-6f4caba4e122",
        word: "kerja dari rumah",
        en: "work from home",
        vi: "làm việc từ nhà",
        pos: "verb phrase",
        pronunciation_vi: "KER-ja da-ri RU-mah",
        pronunciation_en: "KER-ja da-ri ROO-mah",
      },
      {
        cell_id: "265bc52b-0427-4a27-960b-80b387c5e0f1",
        word: "ruang kerja",
        en: "workspace / office room",
        vi: "không gian làm việc",
        pos: "noun phrase",
        pronunciation_vi: "RU-ang KER-ja",
        pronunciation_en: "ROO-ang KER-ja",
      },
      {
        cell_id: "efcd8f82-b823-4e46-818a-6338e14e7122",
        word: "gangguan rumah",
        en: "home interruption",
        vi: "việc gián đoạn ở nhà",
        pos: "noun phrase",
        pronunciation_vi: "gang-GU-an RU-mah",
        pronunciation_en: "gang-GOO-an ROO-mah",
      },
      {
        cell_id: "417332c7-62a1-4e40-aa15-517d4771bc96",
        word: "jadwal fleksibel",
        en: "flexible schedule",
        vi: "lịch linh hoạt",
        pos: "noun phrase",
        pronunciation_vi: "JAD-wal flek-SI-bel",
        pronunciation_en: "JAD-wal flek-SEE-bel",
      },
      {
        cell_id: "67861824-7b15-4cea-bdba-3c10791027c1",
        word: "laporan online",
        en: "online report",
        vi: "báo cáo online",
        pos: "noun phrase",
        pronunciation_vi: "la-PO-ran on-LINE",
        pronunciation_en: "la-PO-ran on-LINE",
      },
      {
        cell_id: "272b0d43-4004-4950-97f0-847bcb635ca7",
        word: "komunikasi tim",
        en: "team communication",
        vi: "giao tiếp nhóm",
        pos: "noun phrase",
        pronunciation_vi: "ko-mu-ni-KA-si tim",
        pronunciation_en: "ko-mu-ni-KA-si team",
      },
      {
        cell_id: "508db537-a6f8-4a7b-a1b5-2f3ca9f6592b",
        word: "produktivitas",
        en: "productivity",
        vi: "năng suất",
        pos: "noun",
        pronunciation_vi: "pro-duk-ti-VI-tas",
        pronunciation_en: "pro-duk-ti-VEE-tas",
      },
      {
        cell_id: "a023f908-e85c-46aa-9272-4b342e12df64",
        word: "ringkasan pekerjaan",
        en: "work summary",
        vi: "tóm tắt công việc",
        pos: "noun phrase",
        pronunciation_vi: "ring-KA-san pe-KER-ja-an",
        pronunciation_en: "ring-KA-san pe-KER-ja-an",
      },
    ],
    dialogue: [
      {
        cell_id: "ec5dbea5-6bd8-410d-9055-d8ce46a96033",
        speaker: "Karyawan",
        text: "Pagi, hari ini saya kerja dari rumah karena ada urusan keluarga sebentar.",
        vi: "Chào buổi sáng, hôm nay tôi làm việc từ nhà vì có việc gia đình một lát.",
        en: "Morning, today I am working from home because I have a brief family matter.",
      },
      {
        cell_id: "decc604d-f9cd-4d00-a6bc-19c76899c9df",
        speaker: "Manajer",
        text: "Baik. Pastikan tetap update progres di grup tim.",
        vi: "Được. Hãy đảm bảo vẫn cập nhật tiến độ trong nhóm.",
        en: "Okay. Make sure you still update progress in the team group.",
      },
      {
        cell_id: "a52f9a11-122f-4a0c-9299-0b9f59cd704d",
        speaker: "Karyawan",
        text: "Siap. Kalau internet rumah bermasalah, saya akan pakai hotspot sementara.",
        vi: "Vâng. Nếu internet nhà có vấn đề, tôi sẽ dùng hotspot tạm thời.",
        en: "Understood. If the home internet has problems, I will use a hotspot temporarily.",
      },
      {
        cell_id: "d23ca401-12a2-48e9-97a8-7cf79c971b3e",
        speaker: "Manajer",
        text: "Laporan online bisa dikirim sebelum jam lima sore?",
        vi: "Báo cáo online có thể gửi trước năm giờ chiều không?",
        en: "Can the online report be sent before 5 p.m.?",
      },
      {
        cell_id: "e3ee9890-d25a-4a8e-827c-f2f34a00cf27",
        speaker: "Karyawan",
        text: "Bisa. Saya akan kirim ringkasan pekerjaan setelah rapat online selesai.",
        vi: "Có thể. Tôi sẽ gửi tóm tắt công việc sau khi cuộc họp online kết thúc.",
        en: "Yes. I will send the work summary after the online meeting finishes.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: 'Tôi làm việc từ nhà ba ngày một tuần.'",
        prompt_en: "Translate into Indonesian: 'I work from home three days a week.'",
        answer: "Saya kerja dari rumah tiga hari seminggu.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya perlu ruang kerja yang ____ untuk rapat online.`",
        prompt_en: "Fill in the blank: `Saya perlu ruang kerja yang ____ untuk rapat online.`",
        answer: "tenang",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm Indonesia với nghĩa tiếng Việt.",
        prompt_en: "Match the Indonesian phrase with the Vietnamese meaning.",
        pairs: [
          ["jadwal fleksibel", "lịch linh hoạt"],
          ["laporan online", "báo cáo online"],
          ["gangguan rumah", "việc gián đoạn ở nhà"],
        ],
      },
      {
        type: "roleplay",
        prompt_vi:
          "Bạn làm việc từ nhà. Báo với quản lý về gangguan rumah, internet bermasalah, jadwal fleksibel, và hứa gửi laporan online trước cuối ngày.",
        prompt_en:
          "You are working from home. Tell your manager about a home interruption, internet problem, flexible schedule, and promise to send the online report before the end of the day.",
      },
    ],
    content:
      "Use this lesson for Indonesian remote-work conversations: working from home, setting up a workspace, explaining home interruptions, flexible schedules, online reports, team communication, productivity, and backup plans for internet problems.",
  },
];
