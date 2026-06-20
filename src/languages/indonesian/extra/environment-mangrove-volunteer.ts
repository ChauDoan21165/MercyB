// Environment Mangrove Volunteer Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// community/environment notes with English companions in pronunciation_focus_en.

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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_environment_mangrove_volunteer",
    level: "B1",
    category: "environment_community",
    title_vi: "Tình nguyện trồng rừng ngập mặn",
    title_en: "Mangrove volunteer work",
    sentences: [
      {
        en: "Saya ingin ikut kegiatan relawan lingkungan di pantai.",
        vi: "Tôi muốn tham gia hoạt động tình nguyện môi trường ở bãi biển.",
        pronunciation_focus: [
          "SA-ya I-ngin I-kut ke-gi-AT-an re-LA-wan ling-KUNG-an di PAN-tai - `ikut kegiatan` = tham gia hoạt động; `relawan lingkungan` = tình nguyện môi trường.",
          "Lỗi người Việt: dùng `join` trong mọi ngữ cảnh. Trong Indonesia, `ikut kegiatan` nghe tự nhiên hơn.",
          "Luyện: `Saya ingin ikut kegiatan itu.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin EE-koot ke-gi-A-tan re-LA-wan ling-KOONG-an di PAN-tai - `ikut kegiatan` = join an activity; `relawan lingkungan` = environmental volunteer.",
          "VN-speaker trap: using English `join` everywhere. In Indonesian, `ikut kegiatan` sounds natural.",
          "Drill: `Saya ingin ikut kegiatan itu.`",
        ],
      },
      {
        en: "Kami akan menanam pohon mangrove bersama warga.",
        vi: "Chúng tôi sẽ trồng cây đước cùng với người dân.",
        pronunciation_focus: [
          "KA-mi A-kan me-na-NAM PO-hon MANG-gro-ve ber-SA-ma WAR-ga - `menanam` = trồng; `bersama warga` = cùng với người dân.",
          "Lỗi người Việt: nói `tanam pohon` trong mọi câu. `Menanam pohon mangrove` rõ hơn và đúng ngữ cảnh.",
          "Luyện: `Menanam pohon mangrove bersama warga.`",
        ],
        pronunciation_focus_en: [
          "KA-mee A-kan me-na-NAM PO-hon MANG-gro-ve ber-SA-ma WAR-ga - `menanam` = to plant; `bersama warga` = with the local residents.",
          "VN-speaker trap: using bare `tanam pohon` for everything. `Menanam pohon mangrove` is clearer and context-appropriate.",
          "Drill: `Menanam pohon mangrove bersama warga.`",
        ],
      },
      {
        en: "Mangrove membantu melindungi pantai dari abrasi.",
        vi: "Rừng ngập mặn giúp bảo vệ bờ biển khỏi xói mòn.",
        pronunciation_focus: [
          "MANG-gro-ve mem-BAN-tu me-lin-DUNG-i PAN-tai da-ri a-BRA-si - `melindungi` = bảo vệ; `abrasi` = xói mòn.",
          "Lỗi người Việt: dịch `protect` thành `proteksi` trong câu đơn. Động từ tự nhiên là `melindungi`.",
          "Luyện: `Mangrove melindungi pantai.`",
        ],
        pronunciation_focus_en: [
          "MANG-gro-ve mem-BAN-too me-lin-DOONG-i PAN-tai da-ree a-BRA-si - `melindungi` = protect; `abrasi` = coastal erosion.",
          "VN-speaker trap: translating `protect` as a noun-like `proteksi` in a simple sentence. The natural verb is `melindungi`.",
          "Drill: `Mangrove melindungi pantai.`",
        ],
      },
      {
        en: "Sampah plastik harus dikurangi supaya ekosistem tetap sehat.",
        vi: "Rác nhựa phải được giảm bớt để hệ sinh thái luôn khỏe mạnh.",
        pronunciation_focus: [
          "SAM-pah PLAS-tik HA-rus di-ku-RANG-i su-PA-ya e-ko-SIS-tem te-TAP SE-hat - `dikurangi` = được giảm bớt; `ekosistem` = hệ sinh thái.",
          "Lỗi người Việt: dùng `kurangi` trực tiếp cho mọi hoàn cảnh. Dạng pasif `harus dikurangi` hợp với kampanye.",
          "Luyện: `Sampah plastik harus dikurangi.`",
        ],
        pronunciation_focus_en: [
          "SAM-pah PLAS-tik HA-roos di-ku-RANG-i su-PA-ya e-ko-SIS-tem te-TAP SE-hat - `dikurangi` = reduced; `ekosistem` = ecosystem.",
          "VN-speaker trap: using direct `kurangi` in every context. The passive `harus dikurangi` fits campaigns better.",
          "Drill: `Sampah plastik harus dikurangi.`",
        ],
      },
      {
        en: "Relawan lingkungan perlu edukasi warga tentang manfaat mangrove.",
        vi: "Tình nguyện viên môi trường cần giáo dục người dân về lợi ích của rừng ngập mặn.",
        pronunciation_focus: [
          "re-LA-wan ling-KUNG-an per-LU e-du-KA-si WAR-ga ten-TANG man-FA-at MANG-gro-ve - `edukasi warga` = giáo dục người dân.",
          "Lỗi người Việt: dùng `mengajar warga` cho mọi hoạt động truyền thông. Trong kampanye, `edukasi` nghe tự nhiên hơn.",
          "Luyện: `Edukasi warga tentang mangrove.`",
        ],
        pronunciation_focus_en: [
          "re-LA-wan ling-KOONG-an per-LOO e-du-KA-si WAR-ga ten-TANG man-FA-at MANG-gro-ve - `edukasi warga` = educating the residents.",
          "VN-speaker trap: using `mengajar warga` for every outreach activity. In campaigns, `edukasi` sounds more natural.",
          "Drill: `Edukasi warga tentang mangrove.`",
        ],
      },
      {
        en: "Kami bekerja sama dengan komunitas lokal pada akhir pekan.",
        vi: "Chúng tôi hợp tác với cộng đồng địa phương vào cuối tuần.",
        pronunciation_focus: [
          "KA-mi be-KER-ja SA-ma de-NGAN ko-mu-ni-TAS LO-kal pa-da AK-hir PE-kan - `bekerja sama` = hợp tác; `akhir pekan` = cuối tuần.",
          "Lỗi người Việt: nói `kolaborasi sama` trong mọi câu. `Bekerja sama dengan` ổn định và dễ dùng hơn.",
          "Luyện: `Bekerja sama dengan komunitas lokal.`",
        ],
        pronunciation_focus_en: [
          "KA-mee be-KER-jah SA-ma de-NGAN ko-moo-ni-TAS LO-kal pa-da AK-hir PE-kan - `bekerja sama` = cooperate/work together; `akhir pekan` = weekend.",
          "VN-speaker trap: using `kolaborasi sama` everywhere. `Bekerja sama dengan` is stable and natural.",
          "Drill: `Bekerja sama dengan komunitas lokal.`",
        ],
      },
      {
        en: "Kegiatan ini juga menjadi ajang belajar bagi anak-anak sekolah.",
        vi: "Hoạt động này cũng trở thành dịp học hỏi cho các em học sinh.",
        pronunciation_focus: [
          "ke-gi-AT-an I-ni JU-ga men-JA-di A-jang be-LA-jar ba-GI A-nak A-nak se-KO-lah - `ajang belajar` = dịp để học hỏi.",
          "Lỗi người Việt: dùng `event` trong văn ý nghĩa cộng đồng. `Kegiatan` và `ajang belajar` nghe tự nhiên hơn.",
          "Luyện: `Menjadi ajang belajar.`",
        ],
        pronunciation_focus_en: [
          "ke-gi-A-tan I-ni JOO-ga men-JA-di A-jang be-LA-jar ba-GEE A-nak A-nak se-KO-lah - `ajang belajar` = an opportunity to learn.",
          "VN-speaker trap: using `event` in a community-minded context. `Kegiatan` and `ajang belajar` sound more natural.",
          "Drill: `Menjadi ajang belajar.`",
        ],
      },
      {
        en: "Kalau pantai bersih, wisatawan juga akan lebih nyaman datang.",
        vi: "Nếu bãi biển sạch, du khách cũng sẽ thấy thoải mái hơn khi đến.",
        pronunciation_focus: [
          "KA-lau PAN-tai ber-SIH, wi-sa-TA-wan JU-ga A-kan LE-bih nya-MAN da-TANG - `wisatawan` = du khách; `nyaman` = thoải mái.",
          "Lỗi người Việt: `datang` không chỉ là đi đến; trong ngữ cảnh du lịch, nó ổn để nói khách đến.",
          "Luyện: `Pantai bersih, wisatawan nyaman datang.`",
        ],
        pronunciation_focus_en: [
          "KA-lau PAN-tai ber-SEEH, wee-sa-TA-wan JOO-ga A-kan LE-bih nya-MAN da-TANG - `wisatawan` = tourists; `nyaman` = comfortable.",
          "VN-speaker trap: `datang` is not only physical arrival; in tourism context it works for visitors coming.",
          "Drill: `Pantai bersih, wisatawan nyaman datang.`",
        ],
      },
      {
        en: "Saya ingin tahu jadwal kegiatan dan titik kumpulnya.",
        vi: "Tôi muốn biết lịch hoạt động và điểm tập trung.",
        pronunciation_focus: [
          "SA-ya I-ngin TA-hu JAD-wal ke-gi-AT-an dan TIT-ik KUM-pul-nya - `titik kumpul` = điểm tập trung.",
          "Lỗi người Việt: hỏi `schedule` trong lúc nói. `Jadwal` là từ Indonesia chuẩn; `titik kumpul` rất hữu ích khi đi nhóm.",
          "Luyện: `Jadwal kegiatan kapan?`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin TA-hoo JAD-wal ke-gi-A-tan dan TIT-ik KOOM-pool-nya - `titik kumpul` = meeting point.",
          "VN-speaker trap: inserting English `schedule`. `Jadwal` is the standard Indonesian word; `titik kumpul` is useful for group events.",
          "Drill: `Jadwal kegiatan kapan?`",
        ],
      },
      {
        en: "Jika perlu, kami akan membagikan alat kerja dan sarung tangan.",
        vi: "Nếu cần, chúng tôi sẽ phát dụng cụ và găng tay.",
        pronunciation_focus: [
          "JI-ka per-LU, KA-mi A-kan mem-ba-GI-kan a-LAT KER-ja dan sa-RUNG ta-NGAN - `membagikan` = phát/chia; `sarung tangan` = găng tay.",
          "Lỗi người Việt: dùng `share alat` nghe lạ. Trong logistics kegiatan, `membagikan alat` phù hợp hơn.",
          "Luyện: `Membagikan alat kerja.`",
        ],
        pronunciation_focus_en: [
          "JI-ka per-LOO, KA-mee A-kan mem-ba-GEE-kan a-LAT KER-jah dan sa-ROONG ta-NGAN - `membagikan` = distribute; `sarung tangan` = gloves.",
          "VN-speaker trap: saying `share alat` sounds odd. In activity logistics, `membagikan alat` is better.",
          "Drill: `Membagikan alat kerja.`",
        ],
      },
      {
        en: "Terima kasih sudah ikut menjaga lingkungan bersama kami.",
        vi: "Cảm ơn vì đã cùng chúng tôi bảo vệ môi trường.",
        pronunciation_focus: [
          "te-ri-MA KA-sih SU-dah I-kut men-JA-ga ling-KUNG-an ber-SA-ma KA-mi - `menjaga lingkungan` = bảo vệ môi trường.",
          "Lỗi người Việt: kết thúc hoạt động bằng lời cảm ơn quá ngắn. Câu này giữ cảm giác cộng đồng và hợp tác.",
          "Luyện: `Terima kasih sudah ikut menjaga lingkungan.`",
        ],
        pronunciation_focus_en: [
          "te-ri-MA KA-sih SOO-dah EE-koot men-JA-ga ling-KOONG-an ber-SA-ma KA-mee - `menjaga lingkungan` = protect the environment.",
          "VN-speaker trap: ending a community activity too abruptly. This closing keeps a sense of community and cooperation.",
          "Drill: `Terima kasih sudah ikut menjaga lingkungan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Kegiatan lingkungan ở Indonesia thường đi cùng gotong royong, edukasi warga, dan kerja sama dengan komunitas lokal. Khi nói về mangrove, người Indonesia hay dùng `menanam mangrove`, `melindungi pantai`, `menjaga lingkungan`, `sampah plastik`, `wisatawan`, dan `titik kumpul`. Cách nói thuyết phục thường rất cộng đồng: không chỉ nhấn mạnh cây được trồng, mà còn nhấn mạnh warga, pantai, dan manfaat jangka panjang.",
    cultural_notes_en:
      "Environmental activities in Indonesia often involve gotong royong, public education, and cooperation with local communities. When talking about mangroves, Indonesians often use `menanam mangrove`, `melindungi pantai`, `menjaga lingkungan`, `sampah plastik`, `wisatawan`, and `titik kumpul`. Persuasive wording is often community-oriented: not only the trees being planted, but also the residents, the beach, and long-term benefits.",
    tip_advice_vi:
      "Mẹo cho người Việt: nói hoạt động môi trường theo chuỗi đơn giản: tujuan -> aksi -> manfaat -> ajakan. Dùng `ikut kegiatan`, `menanam`, `membagikan`, `edukasi warga`, `kerja sama`, và `terima kasih sudah ikut menjaga lingkungan` để bài nói tự nhiên. Tránh lạm dụng tiếng Anh như `join`, `share`, `event`, `schedule` khi đã có từ Indonesia rất rõ.",
    tip_advice_en:
      "Tip for Vietnamese speakers: describe environmental activities in a simple chain: goal -> action -> benefit -> invitation. Use `ikut kegiatan`, `menanam`, `membagikan`, `edukasi warga`, `kerja sama`, and `terima kasih sudah ikut menjaga lingkungan` to keep the speech natural. Avoid overusing English like `join`, `share`, `event`, `schedule` when clear Indonesian words already exist.",
    vocabulary: [
      { word: "mangrove", en: "mangrove", vi: "rừng ngập mặn", pos: "noun", pronunciation_vi: "MANG-gro-ve", pronunciation_en: "MANG-grove" },
      { word: "relawan lingkungan", en: "environmental volunteer", vi: "tình nguyện viên môi trường", pos: "noun phrase", pronunciation_vi: "re-LA-wan ling-KUNG-an", pronunciation_en: "re-LA-wan ling-KOONG-an" },
      { word: "menanam pohon", en: "to plant trees", vi: "trồng cây", pos: "verb phrase", pronunciation_vi: "me-na-NAM PO-hon", pronunciation_en: "me-na-NAM PO-hon" },
      { word: "pantai", en: "beach", vi: "bãi biển", pos: "noun", pronunciation_vi: "PAN-tai", pronunciation_en: "PAN-tai" },
      { word: "sampah plastik", en: "plastic waste", vi: "rác nhựa", pos: "noun phrase", pronunciation_vi: "SAM-pah PLAS-tik", pronunciation_en: "SAM-pah PLAS-tik" },
      { word: "edukasi warga", en: "educating residents", vi: "giáo dục người dân", pos: "noun phrase", pronunciation_vi: "e-du-KA-si WAR-ga", pronunciation_en: "e-du-KA-si WAR-ga" },
      { word: "konservasi", en: "conservation", vi: "bảo tồn", pos: "noun", pronunciation_vi: "kon-ser-VA-si", pronunciation_en: "kon-ser-VA-si" },
      { word: "kegiatan komunitas", en: "community activity", vi: "hoạt động cộng đồng", pos: "noun phrase", pronunciation_vi: "ke-gi-AT-an ko-mu-ni-TAS", pronunciation_en: "ke-gi-A-tan ko-moo-ni-TAS" },
    ],
    dialogue: [
      {
        speaker: "Rina",
        text: "Apa kegiatan hari ini?",
        vi: "Hôm nay có hoạt động gì?",
        en: "What is today's activity?",
      },
      {
        speaker: "Dimas",
        text: "Kita akan menanam pohon mangrove bersama warga.",
        vi: "Chúng ta sẽ trồng cây đước cùng với người dân.",
        en: "We will plant mangrove trees with the residents.",
      },
      {
        speaker: "Rina",
        text: "Bagus. Saya ingin ikut kegiatan relawan lingkungan ini.",
        vi: "Tốt quá. Tôi muốn tham gia hoạt động tình nguyện môi trường này.",
        en: "Great. I want to join this environmental volunteer activity.",
      },
      {
        speaker: "Dimas",
        text: "Tentu, titik kumpulnya di balai warga jam delapan pagi.",
        vi: "Tất nhiên, điểm tập trung là ở nhà cộng đồng lúc tám giờ sáng.",
        en: "Sure, the meeting point is at the community hall at 8 a.m.",
      },
      {
        speaker: "Rina",
        text: "Terima kasih sudah ikut menjaga lingkungan.",
        vi: "Cảm ơn vì đã cùng bảo vệ môi trường.",
        en: "Thank you for helping protect the environment.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt.",
        instruction_en: "Match the word with its Vietnamese meaning.",
        items: [
          { prompt: "mangrove", answer: "rừng ngập mặn" },
          { prompt: "relawan lingkungan", answer: "tình nguyện viên môi trường" },
          { prompt: "edukasi warga", answer: "giáo dục người dân" },
          { prompt: "titik kumpul", answer: "điểm tập trung" },
        ],
      },
      {
        type: "rewrite",
        instruction_vi: "Viết lại câu ngắn theo cách tự nhiên hơn trong bài về môi trường.",
        instruction_en: "Rewrite the short sentence in a more natural environmental-activity style.",
        items: [
          {
            prompt: "Join acara itu.",
            answer: "Saya ingin ikut kegiatan relawan lingkungan di pantai.",
          },
          {
            prompt: "Share alat kerja.",
            answer: "Kami akan membagikan alat kerja dan sarung tangan.",
          },
          {
            prompt: "Bersama jaga environment.",
            answer: "Terima kasih sudah ikut menjaga lingkungan bersama kami.",
          },
        ],
      },
    ],
  },
];

export default lessons;
