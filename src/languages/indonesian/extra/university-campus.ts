// University & Campus Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack. The shape mirrors sibling Indonesian extra
// files: Indonesian target text lives in `en`, Vietnamese glosses in `vi`,
// `pronunciation_focus` contains Vietnamese L1 notes, and
// `pronunciation_focus_en` is the English companion in the same order.

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

// Loosely typed so per-type fields (translation, matching, fill_blank) can vary.
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
    id: "indonesian_university_campus",
    level: "B1",
    category: "education",
    title_vi: "Đại học và đời sống kampus",
    title_en: "University and campus life",
    sentences: [
      {
        en: "Saya kuliah di kampus negeri di Bandung.",
        vi: "Tôi học đại học ở một trường công tại Bandung.",
        pronunciation_focus: [
          "SA-ya ku-LI-ah di KAM-pus NE-ge-ri di BAN-dung - `kuliah` = học đại học/đi học đại học.",
          "Lỗi người Việt: dùng `belajar` cho mọi tình huống. `kuliah` tự nhiên hơn khi nói đời sinh viên đại học.",
          "`kampus negeri` = trường/cơ sở đại học công; `negeri` không phải 'đất nước' trong cụm này.",
          "Luyện: `Saya kuliah di kampus negeri.`",
        ],
        pronunciation_focus_en: [
          "SA-ya koo-LEE-ah dee KAM-poos NE-ge-ree dee BAN-doong - `kuliah` = to study at university / attend lectures.",
          "VN-speaker trap: using `belajar` for everything. `kuliah` is more natural for university student life.",
          "`kampus negeri` = public/state university campus; `negeri` here does not mean 'country'.",
          "Drill: `Saya kuliah di kampus negeri.`",
        ],
      },
      {
        en: "Jadwal kelas saya padat dari Senin sampai Jumat.",
        vi: "Lịch học của tôi dày từ thứ Hai đến thứ Sáu.",
        pronunciation_focus: [
          "JAD-wal KE-las SA-ya PA-dat - `jadwal kelas` = lịch học/lịch lớp.",
          "`padat` = dày/đặc/kín lịch; rất tự nhiên cho lịch học nhiều tiết.",
          "Lỗi người Việt: nói `jadwal saya banyak`. Tự nhiên hơn: `jadwal saya padat`.",
          "Luyện: `Jadwal kelas saya padat.`",
        ],
        pronunciation_focus_en: [
          "JAD-wal KE-las SA-ya PA-dat - `jadwal kelas` = class schedule.",
          "`padat` = dense/full/packed; natural for a heavy class schedule.",
          "VN-speaker trap: saying `jadwal saya banyak`. More natural: `jadwal saya padat`.",
          "Drill: `Jadwal kelas saya padat.`",
        ],
      },
      {
        en: "Dosen meminta kami mengumpulkan tugas sebelum jam lima.",
        vi: "Giảng viên yêu cầu chúng tôi nộp bài tập trước năm giờ.",
        pronunciation_focus: [
          "DO-sen me-MIN-ta KA-mi me-ngum-PUL-kan TU-gas - `dosen` = giảng viên đại học.",
          "`mengumpulkan tugas` = nộp bài/tập hợp bài; không dịch từng chữ là 'gom bài' trong đầu.",
          "Lỗi người Việt: lẫn `kami` và `kita`. `kami` = chúng tôi không gồm người nghe.",
          "Luyện: `Dosen meminta kami mengumpulkan tugas.`",
        ],
        pronunciation_focus_en: [
          "DO-sen me-MIN-ta KA-mee me-ngoom-POOL-kan TOO-gas - `dosen` = university lecturer.",
          "`mengumpulkan tugas` = submit an assignment; do not over-literalize it as 'collect'.",
          "VN-speaker trap: mixing `kami` and `kita`. `kami` excludes the listener.",
          "Drill: `Dosen meminta kami mengumpulkan tugas.`",
        ],
      },
      {
        en: "Saya harus mengerjakan tugas kelompok malam ini.",
        vi: "Tối nay tôi phải làm bài tập nhóm.",
        pronunciation_focus: [
          "ha-RUS me-nger-JA-kan TU-gas ke-LOM-pok - `tugas kelompok` = bài tập nhóm.",
          "`mengerjakan` = làm/thực hiện; gốc `kerja` thêm meN-...-kan.",
          "Lỗi người Việt: bỏ tiền tố và nói `saya kerja tugas`. Chuẩn: `mengerjakan tugas`.",
          "Luyện: `Saya mengerjakan tugas kelompok.`",
        ],
        pronunciation_focus_en: [
          "ha-ROOS me-nger-JA-kan TOO-gas ke-LOM-pok - `tugas kelompok` = group assignment.",
          "`mengerjakan` = to work on/do; root `kerja` with meN-...-kan.",
          "VN-speaker trap: dropping the affix and saying `saya kerja tugas`. Standard: `mengerjakan tugas`.",
          "Drill: `Saya mengerjakan tugas kelompok.`",
        ],
      },
      {
        en: "Ujian tengah semester dimulai minggu depan.",
        vi: "Kỳ thi giữa học kỳ bắt đầu vào tuần sau.",
        pronunciation_focus: [
          "u-JI-an TE-ngah se-MES-ter di-MU-lai MING-gu de-PAN - `UTS` thường là `ujian tengah semester`.",
          "`minggu depan` = tuần sau; `depan` dùng cho thời gian tương lai.",
          "Lỗi người Việt: đọc `ujian` như một âm. Tách rõ u-JI-an.",
          "Luyện: `Ujian dimulai minggu depan.`",
        ],
        pronunciation_focus_en: [
          "oo-JEE-an TE-ngah se-MES-ter dee-MOO-lai MING-goo de-PAN - `UTS` usually means midterm exam.",
          "`minggu depan` = next week; `depan` can mark upcoming time.",
          "VN-speaker trap: compressing `ujian` into one beat. Keep u-JI-an clear.",
          "Drill: `Ujian dimulai minggu depan.`",
        ],
      },
      {
        en: "Nilai saya keluar di portal akademik.",
        vi: "Điểm của tôi đã có trên cổng thông tin học vụ.",
        pronunciation_focus: [
          "NI-lai SA-ya KE-luar di POR-tal a-ka-DE-mik - `nilai` = điểm số.",
          "`keluar` trong ngữ cảnh này = được công bố/ra kết quả.",
          "Lỗi người Việt: dịch `ra điểm` từng chữ. Tiếng Indonesia tự nhiên: `nilai keluar`.",
          "Luyện: `Nilai saya sudah keluar.`",
        ],
        pronunciation_focus_en: [
          "NEE-lai SA-ya KE-loo-ar dee POR-tal a-ka-DE-mik - `nilai` = grade/score.",
          "`keluar` here means published/released.",
          "VN-speaker trap: translating 'grades came out' too literally. Natural Indonesian: `nilai keluar`.",
          "Drill: `Nilai saya sudah keluar.`",
        ],
      },
      {
        en: "Semester ini saya mulai menyusun skripsi.",
        vi: "Học kỳ này tôi bắt đầu xây dựng/viết luận văn tốt nghiệp.",
        pronunciation_focus: [
          "se-MES-ter I-ni mu-LAI me-NYU-sun SKRIP-si - `skripsi` = luận văn cử nhân.",
          "`menyusun skripsi` = soạn/triển khai luận văn; trang trọng hơn `bikin skripsi`.",
          "Lỗi người Việt: dùng `tesis` cho mọi luận văn. Bậc cử nhân Indonesia là `skripsi`; thạc sĩ là `tesis`.",
          "Luyện: `Saya mulai menyusun skripsi.`",
        ],
        pronunciation_focus_en: [
          "se-MES-ter EE-nee moo-LAI me-NYOO-soon SKRIP-see - `skripsi` = undergraduate thesis.",
          "`menyusun skripsi` = prepare/write a thesis; more formal than `bikin skripsi`.",
          "VN-speaker trap: using `tesis` for every thesis. Indonesian bachelor's thesis is `skripsi`; master's is `tesis`.",
          "Drill: `Saya mulai menyusun skripsi.`",
        ],
      },
      {
        en: "Saya ikut organisasi mahasiswa untuk belajar kepemimpinan.",
        vi: "Tôi tham gia tổ chức sinh viên để học kỹ năng lãnh đạo.",
        pronunciation_focus: [
          "I-kut or-ga-ni-SA-si ma-ha-SIS-wa - `ikut` = tham gia/đi theo.",
          "`organisasi mahasiswa` = tổ chức sinh viên; hay viết tắt `ormawa` trong môi trường kampus.",
          "`kepemimpinan` = sự lãnh đạo/kỹ năng lãnh đạo, từ gốc `pimpin`.",
          "Luyện: `Saya ikut organisasi mahasiswa.`",
        ],
        pronunciation_focus_en: [
          "EE-koot or-ga-nee-SA-see ma-ha-SIS-wa - `ikut` = join/participate.",
          "`organisasi mahasiswa` = student organization; often shortened to `ormawa` on campus.",
          "`kepemimpinan` = leadership, from the root `pimpin`.",
          "Drill: `Saya ikut organisasi mahasiswa.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `mahasiswa` là sinh viên đại học, khác với `siswa` (học sinh phổ thông). `Dosen` là giảng viên, không phải `guru`. Đời sống `kampus` thường xoay quanh jadwal kelas, tugas, UTS/UAS (thi giữa kỳ/cuối kỳ), portal akademik, skripsi và organisasi mahasiswa. Nhiều sinh viên tham gia BEM, himpunan jurusan hoặc câu lạc bộ để xây quan hệ và luyện kepemimpinan. So với Việt Nam, cấu trúc học kỳ và áp lực bài nhóm/luận văn khá quen thuộc, nhưng từ vựng học vụ Indonesia dùng nhiều danh từ có tiền tố-hậu tố như `perkuliahan`, `kepemimpinan`, `pendaftaran`.",
    cultural_notes_en:
      "In Indonesia, `mahasiswa` means university student, different from `siswa` for school pupils. `Dosen` is a university lecturer, not `guru`. Campus life often revolves around class schedules, assignments, UTS/UAS exams, academic portals, the undergraduate thesis (`skripsi`), and student organizations. Many students join BEM, department associations, or clubs to build networks and practice leadership. Vietnamese learners will recognize the semester pressure, group work, and thesis culture, but Indonesian academic vocabulary uses many affixed nouns such as `perkuliahan`, `kepemimpinan`, and `pendaftaran`.",
    tip_advice_vi:
      "Mẹo cho người Việt: nhớ ba cặp quan trọng: siswa = học sinh, mahasiswa = sinh viên; guru = giáo viên phổ thông, dosen = giảng viên; belajar = học nói chung, kuliah = học/đi học đại học. Khi nói lịch và bài vở, các cụm tự nhiên là `jadwal kelas`, `mengumpulkan tugas`, `ujian tengah semester`, `nilai keluar`, `menyusun skripsi`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: keep three pairs straight: siswa = school pupil, mahasiswa = university student; guru = school teacher, dosen = lecturer; belajar = study in general, kuliah = study at/attend university. For campus routines, the natural chunks are `jadwal kelas`, `mengumpulkan tugas`, `ujian tengah semester`, `nilai keluar`, and `menyusun skripsi`.",
    vocabulary: [
      {
        cell_id: "1af0a25e-f371-4437-a36d-36094a3d4dec",
        word: "kuliah",
        en: "to study at university / lecture",
        vi: "học đại học / buổi giảng",
        pos: "verb / noun",
        pronunciation_vi: "ku-LI-ah",
        pronunciation_en: "koo-LEE-ah",
      },
      {
        cell_id: "b49c1fa7-8159-43b3-be1f-75f3d53f78f5",
        word: "kampus",
        en: "campus / university",
        vi: "khuôn viên trường / đại học",
        pos: "noun",
        pronunciation_vi: "KAM-pus",
        pronunciation_en: "KAM-poos",
      },
      {
        cell_id: "694e5c8a-eb2f-48cc-89be-02e803ab6952",
        word: "mahasiswa",
        en: "university student",
        vi: "sinh viên",
        pos: "noun",
        pronunciation_vi: "ma-ha-SIS-wa",
        pronunciation_en: "ma-ha-SIS-wa",
      },
      {
        cell_id: "6c76c568-5e60-476c-98e3-7817a1948d6e",
        word: "dosen",
        en: "university lecturer",
        vi: "giảng viên",
        pos: "noun",
        pronunciation_vi: "DO-sen",
        pronunciation_en: "DO-sen",
      },
      {
        cell_id: "c36cf65d-a20f-4457-bb1a-7c160519b5c2",
        word: "jadwal kelas",
        en: "class schedule",
        vi: "lịch học / lịch lớp",
        pos: "noun phrase",
        pronunciation_vi: "JAD-wal KE-las",
        pronunciation_en: "JAD-wal KE-las",
      },
      {
        cell_id: "044950fa-bad2-4f94-8819-609d53beac6e",
        word: "tugas",
        en: "assignment / task",
        vi: "bài tập / nhiệm vụ",
        pos: "noun",
        pronunciation_vi: "TU-gas",
        pronunciation_en: "TOO-gas",
      },
      {
        cell_id: "1142123a-03d6-42ae-b7d1-eb2a365fa325",
        word: "ujian",
        en: "exam",
        vi: "kỳ thi",
        pos: "noun",
        pronunciation_vi: "u-JI-an",
        pronunciation_en: "oo-JEE-an",
      },
      {
        cell_id: "c70c7e02-50a0-4335-9c7d-b9333e173f2b",
        word: "skripsi",
        en: "undergraduate thesis",
        vi: "luận văn cử nhân",
        pos: "noun",
        pronunciation_vi: "SKRIP-si",
        pronunciation_en: "SKRIP-see",
      },
      {
        cell_id: "d1e51c7f-81e2-4e87-ae58-90068d07f4ca",
        word: "organisasi mahasiswa",
        en: "student organization",
        vi: "tổ chức sinh viên",
        pos: "noun phrase",
        pronunciation_vi: "or-ga-ni-SA-si ma-ha-SIS-wa",
        pronunciation_en: "or-ga-nee-SA-see ma-ha-SIS-wa",
      },
      {
        cell_id: "49e4cf1f-df8e-431a-b6f2-f561822bb4c2",
        word: "portal akademik",
        en: "academic portal",
        vi: "cổng thông tin học vụ",
        pos: "noun phrase",
        pronunciation_vi: "POR-tal a-ka-DE-mik",
        pronunciation_en: "POR-tal a-ka-DE-mik",
      },
    ],
    dialogue: [
      {
        cell_id: "6fb63f41-a136-4f38-9e51-ec7bb8158663",
        speaker: "Linh",
        text: "Raka, jadwal kelas semester ini sudah keluar?",
        vi: "Raka, lịch học kỳ này đã có chưa?",
        en: "Raka, has this semester's class schedule come out?",
      },
      {
        cell_id: "f9aa997e-1bd3-4a9e-835b-5b6548493969",
        speaker: "Raka",
        text: "Sudah. Hari Senin ada kuliah jam delapan pagi.",
        vi: "Có rồi. Thứ Hai có giờ học lúc tám giờ sáng.",
        en: "Yes. On Monday there is a lecture at eight in the morning.",
      },
      {
        cell_id: "66b74367-e606-48ca-b7bc-59ebeb9f67d3",
        speaker: "Linh",
        text: "Dosen memberi tugas kelompok juga?",
        vi: "Giảng viên cũng giao bài tập nhóm à?",
        en: "Did the lecturer also assign group work?",
      },
      {
        cell_id: "aaefedc5-cbb1-41f0-b3bf-ed6740a4109f",
        speaker: "Raka",
        text: "Iya, dan minggu depan mulai persiapan UTS.",
        vi: "Ừ, và tuần sau bắt đầu chuẩn bị thi giữa kỳ.",
        en: "Yes, and next week we start midterm preparation.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ/cụm từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word or phrase with its Vietnamese meaning:",
        items: [
          { prompt: "mahasiswa", answer: "sinh viên" },
          { prompt: "dosen", answer: "giảng viên" },
          { prompt: "jadwal kelas", answer: "lịch học" },
          { prompt: "skripsi", answer: "luận văn cử nhân" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu:",
        instruction_en: "Fill in the missing word:",
        items: [
          {
            prompt: "Saya ___ di kampus negeri. (học đại học)",
            answer: "kuliah",
            options: ["kuliah", "kantin", "kamar"],
          },
          {
            prompt: "Dosen meminta kami mengumpulkan ___. (bài tập)",
            answer: "tugas",
            options: ["tugas", "tamu", "toko"],
          },
          {
            prompt: "Semester ini saya mulai menyusun ___. (luận văn cử nhân)",
            answer: "skripsi",
            options: ["skripsi", "sarapan", "sepatu"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Lịch học của tôi dày.", answer: "Jadwal kelas saya padat." },
          { prompt: "Giảng viên yêu cầu chúng tôi nộp bài tập.", answer: "Dosen meminta kami mengumpulkan tugas." },
          { prompt: "Tôi tham gia tổ chức sinh viên.", answer: "Saya ikut organisasi mahasiswa." },
        ],
      },
    ],
  },
];

export default lessons;
