// Community Sports Tournament Indonesian (Vietnamese -> Indonesian study track).
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

export const communitySportsTournamentLessons: IndonesianLesson[] = [
  {
    id: "indonesian_community_sports_tournament",
    level: "B1",
    category: "community_events",
    title_vi: "Giải thể thao khu phố: futsal, cầu lông và tinh thần fair play",
    title_en: "Community sports tournament: futsal, badminton and sportsmanship",
    sentences: [
      {
        en: "Tim saya sudah daftar untuk turnamen kampung.",
        vi: "Đội của tôi đã đăng ký giải đấu khu phố rồi.",
        pronunciation_focus: [
          "`tim saya` = đội của tôi; dùng rất tự nhiên khi nói về turnamen.",
          "`sudah daftar` = đã đăng ký; khẩu ngữ phổ biến hơn `sudah mendaftar` trong nói nhanh.",
          "Lỗi người Việt: nói `register team` chen tiếng Anh. Ở sini, `daftar` cukup alami dan mudah.",
        ],
        pronunciation_focus_en: [
          "`tim saya` means my team; very natural when talking about tournaments.",
          "`sudah daftar` means already registered; common spoken form for `sudah mendaftar`.",
          "VN-speaker trap: inserting `register team` English. Here `daftar` is natural and easy.",
        ],
      },
      {
        en: "Apakah pendaftaran tim masih dibuka hari ini?",
        vi: "Hôm nay còn mở đăng ký đội không?",
        pronunciation_focus: [
          "`pendaftaran tim` = việc đăng ký đội; `pendaftaran` là danh từ.",
          "`masih dibuka` = vẫn còn mở; thường dùng cho pendaftaran, tiket, atau lowongan.",
          "Lỗi người Việt: hỏi `masih open?` là trộn tiếng Anh. `masih dibuka` nghe đúng ngữ cảnh Indonesia hơn.",
        ],
        pronunciation_focus_en: [
          "`pendaftaran tim` means team registration; `pendaftaran` is the noun.",
          "`masih dibuka` means still open; common for registration, tickets, or vacancies.",
          "VN-speaker trap: asking `masih open?` with English. `masih dibuka` fits Indonesian usage better.",
        ],
      },
      {
        en: "Hadiah juara pertama cukup menarik.",
        vi: "Giải thưởng cho đội nhất khá hấp dẫn.",
        pronunciation_focus: [
          "`hadiah juara` = giải thưởng cho nhà vô địch/người thắng.",
          "`juara pertama` = giải nhất; dùng trong turnamen, lomba, perlombaan.",
          "Lỗi người Việt: nói `prize first` rất gượng. `juara pertama` là cụm chuẩn và gọn.",
        ],
        pronunciation_focus_en: [
          "`hadiah juara` means the winner's prize.",
          "`juara pertama` means first place; used in tournaments and contests.",
          "VN-speaker trap: literal `prize first` sounds awkward. `juara pertama` is the standard phrase.",
        ],
      },
      {
        en: "Wasit akan menjelaskan aturan pertandingan sebelum mulai.",
        vi: "Trọng tài sẽ giải thích luật thi đấu trước khi bắt đầu.",
        pronunciation_focus: [
          "`wasit` = trọng tài; từ này sangat umum dalam olahraga.",
          "`aturan pertandingan` = luật thi đấu; `pertandingan` dùng cho game/match.",
          "Lỗi người Việt: dùng `referee` terus. Trong tiếng Indonesia, `wasit` là kata yang tepat.",
        ],
        pronunciation_focus_en: [
          "`wasit` means referee; very common in sports.",
          "`aturan pertandingan` means match rules; `pertandingan` is used for games/matches.",
          "VN-speaker trap: relying on English `referee`. In Indonesian, `wasit` is the right word.",
        ],
      },
      {
        en: "Jadwal pertandingan futsal sore ini sudah ditempel di papan.",
        vi: "Lịch thi đấu futsal chiều nay đã được dán trên bảng.",
        pronunciation_focus: [
          "`jadwal pertandingan` = lịch thi đấu; cụm penting trong turnamen kampung.",
          "`ditempel di papan` = được dán trên bảng; câu bị động rất tự nhiên khi thông báo.",
          "Lỗi người Việt: nói `jadwal match` nghe lai tiếng Anh. `jadwal pertandingan` rõ và đúng hơn.",
        ],
        pronunciation_focus_en: [
          "`jadwal pertandingan` means match schedule; important in local tournaments.",
          "`ditempel di papan` means posted on the board; passive voice is natural in announcements.",
          "VN-speaker trap: `jadwal match` mixes English. `jadwal pertandingan` is clearer and correct.",
        ],
      },
      {
        en: "Kami ingin bermain dengan sportivitas tinggi.",
        vi: "Chúng tôi muốn thi đấu với tinh thần thể thao cao.",
        pronunciation_focus: [
          "`sportivitas` = tinh thần thể thao/công bằng; từ rất hay trong olahraga.",
          "`dengan sportivitas tinggi` = với tinh thần thể thao cao; nghe trang trọng và positif.",
          "Lỗi người Việt: nói `fair play` trực tiếp không sai, nhưng `sportivitas` là từ Indonesia đúng ngữ cảnh.",
        ],
        pronunciation_focus_en: [
          "`sportivitas` means sportsmanship; very common in sports.",
          "`dengan sportivitas tinggi` means with high sportsmanship; formal and positive.",
          "VN-speaker trap: using English `fair play` directly. `sportivitas` is the right Indonesian term.",
        ],
      },
      {
        en: "Kalau ada pelanggaran, tolong beri tahu panitia.",
        vi: "Nếu có phạm lỗi, làm ơn báo cho ban tổ chức nhé.",
        pronunciation_focus: [
          "`pelanggaran` = lỗi vi phạm; trong olahraga juga bisa berarti foul.",
          "`panitia` = ban tổ chức; rất quen trong kegiatan kampung.",
          "Lỗi người Việt: dùng `committee` trong câu Indonesia. `panitia` là từ chuẩn cho ban tổ chức.",
        ],
        pronunciation_focus_en: [
          "`pelanggaran` means violation or foul; common in sports contexts.",
          "`panitia` means organizing committee; very common for community events.",
          "VN-speaker trap: using English `committee`. `panitia` is the standard Indonesian word.",
        ],
      },
      {
        en: "Kami masih mencari sponsor untuk biaya acara.",
        vi: "Chúng tôi vẫn đang tìm nhà tài trợ cho chi phí sự kiện.",
        pronunciation_focus: [
          "`mencari sponsor` = tìm nhà tài trợ; rất hay cho acara komunitas.",
          "`biaya acara` = chi phí sự kiện; cụm đơn giản nhưng thường dùng.",
          "Lỗi người Việt: nói `supporter` thay cho sponsor. `sponsor` trong bahasa Indonesia là kata yang tepat.",
        ],
        pronunciation_focus_en: [
          "`mencari sponsor` means looking for sponsors; common for community events.",
          "`biaya acara` means event expenses; simple and common.",
          "VN-speaker trap: using `supporter` instead of sponsor. In Indonesian, `sponsor` is the correct word.",
        ],
      },
      {
        en: "Apakah ada hadiah untuk pemain terbaik?",
        vi: "Có phần thưởng cho cầu thủ xuất sắc nhất không?",
        pronunciation_focus: [
          "`pemain terbaik` = người chơi/cầu thủ xuất sắc nhất.",
          "`apakah ada` = có ... không; mở câu hỏi lịch sự.",
          "Lỗi người Việt: dùng `best player` trực tiếp. `pemain terbaik` là cách nói tự nhiên và chuẩn hơn.",
        ],
        pronunciation_focus_en: [
          "`pemain terbaik` means best player.",
          "`apakah ada` means is there / are there; polite question opener.",
          "VN-speaker trap: saying `best player` directly. `pemain terbaik` is the natural Indonesian phrase.",
        ],
      },
      {
        en: "Saya berharap semua tim bisa menikmati pertandingan ini.",
        vi: "Tôi hy vọng tất cả các đội đều có thể tận hưởng trận đấu này.",
        pronunciation_focus: [
          "`berharap` = hy vọng; dùng rất tốt ketika memberi doa atau harapan.",
          "`menikmati pertandingan` = tận hưởng trận đấu; nhấn tinh thần vui vẻ, bukan hanya menang-kalah.",
          "Lỗi người Việt: quá tập trung vào thắng thua. Câu này membantu menjaga suasana positif.",
        ],
        pronunciation_focus_en: [
          "`berharap` means hope; useful when expressing wishes.",
          "`menikmati pertandingan` means enjoy the match; it emphasizes fun, not only winning or losing.",
          "VN-speaker trap: focusing only on winning and losing. This sentence keeps the mood positive.",
        ],
      },
    ],
    cultural_notes_vi:
      "Turnamen kampung o Indonesia thuong do panitia warga to chuc trong cac dip 17 Agustus, reunian khu pho, atau acara amal. Nguoi ta hay da dang ky tim, tetapkan jadwal pertandingan, dan pimpin oleh wasit. Sportivitas quan trong khong kem gi chien thang: saling salam, khong protes berlebihan, va ton trong keputusan wasit la phan lon cua van hoa thi dau.",
    cultural_notes_en:
      "Community tournaments in Indonesia are often organized by local residents for Independence Day, neighborhood reunions, or charity events. Teams register, schedules are posted, and referees manage the matches. Sportsmanship matters as much as winning: shaking hands, not protesting too much, and respecting the referee's decisions are all important parts of the culture.",
    tip_advice_vi:
      "Mẹo cho người Việt: khi hỏi về turnamen, dùng khung thực tế `pendaftaran tim`, `jadwal pertandingan`, `hadiah juara`, `wasit`, `panitia`, `sponsor`. Nếu muốn giữ giọng thân thiện, thêm `tolong` dan `harap` khi meminta thông tin.",
    tip_advice_en:
      "Tip for Vietnamese speakers: when asking about a tournament, use practical frames like `pendaftaran tim`, `jadwal pertandingan`, `hadiah juara`, `wasit`, `panitia`, and `sponsor`. To sound friendly, add `tolong` and `harap` when requesting information.",
    vocabulary: [
      {
        cell_id: "3e02cae6-f36f-4aa4-a879-0b9d5790a450",
        word: "turnamen kampung",
        en: "neighborhood tournament",
        vi: "giai dau khu pho",
        pos: "noun phrase",
        pronunciation_vi: "turna-MEN KAM-pung",
        pronunciation_en: "tur-NAH-men KAHM-poong",
      },
      {
        cell_id: "aa1b7931-903d-4c4e-a5b5-1fa107578a3d",
        word: "pendaftaran tim",
        en: "team registration",
        vi: "dang ky doi",
        pos: "noun phrase",
        pronunciation_vi: "pen-daf-ta-RAN tim",
        pronunciation_en: "pen-daf-tah-RAN teem",
      },
      {
        cell_id: "29468f0f-b9a6-4894-a892-eb443d52f024",
        word: "jadwal pertandingan",
        en: "match schedule",
        vi: "lich thi dau",
        pos: "noun phrase",
        pronunciation_vi: "jad-wal per-tan-DING-an",
        pronunciation_en: "JAHD-wahl per-tan-DEENG-an",
      },
      {
        cell_id: "456c0d86-07d1-40b4-a48d-e829f932c51e",
        word: "wasit",
        en: "referee",
        vi: "trong tai",
        pos: "noun",
        pronunciation_vi: "WA-sit",
        pronunciation_en: "WAH-sit",
      },
      {
        cell_id: "28a9083e-487c-4e41-b9f4-64e0e497e59d",
        word: "sportivitas",
        en: "sportsmanship",
        vi: "tinh than the thao",
        pos: "noun",
        pronunciation_vi: "spor-ti-VI-tas",
        pronunciation_en: "spor-tee-VEE-tas",
      },
      {
        cell_id: "5728e662-ca7b-46cd-9743-15f04077d4a4",
        word: "hadiah juara",
        en: "winner's prize",
        vi: "giai thuong cho doi nhat",
        pos: "noun phrase",
        pronunciation_vi: "ha-di-AH ju-A-ra",
        pronunciation_en: "HAH-dee-AH JOO-ah-rah",
      },
      {
        cell_id: "56527ee2-7bee-4c08-a0f4-a8ca90839b69",
        word: "panitia",
        en: "organizing committee",
        vi: "ban to chuc",
        pos: "noun",
        pronunciation_vi: "pa-NI-ti-a",
        pronunciation_en: "pah-NEE-tee-ah",
      },
      {
        cell_id: "92a8aea0-1252-4b9e-be32-fd1469db663e",
        word: "sponsor",
        en: "sponsor",
        vi: "nha tai tro",
        pos: "noun",
        pronunciation_vi: "SPON-sor",
        pronunciation_en: "SPON-sor",
      },
    ],
    dialogue: [
      {
        cell_id: "4751d7ff-d0f0-4b3a-a291-28f2c9d7657b",
        speaker: "Panitia",
        text: "Selamat sore, tim futsal mana yang sudah daftar?",
        vi: "Chao buoi chieu, doi futsal nao da dang ky roi?",
        en: "Good afternoon, which futsal teams have already registered?",
      },
      {
        cell_id: "66b486ee-da4a-4fdb-87fe-051a79afd27a",
        speaker: "Kapten Tim",
        text: "Tim kami sudah daftar, dan kami ingin tahu jadwal pertandingan.",
        vi: "Doi chung toi da dang ky, va chung toi muon biet lich thi dau.",
        en: "Our team has already registered, and we want to know the match schedule.",
      },
      {
        cell_id: "93e6df2e-ba12-417d-be7b-490262eabb56",
        speaker: "Panitia",
        text: "Baik, saya kirim jadwalnya. Wasit akan menjelaskan aturan pertandingan sebelum mulai.",
        vi: "Duoc, toi se gui lich. Trong tai se giai thich luat thi dau truoc khi bat dau.",
        en: "Alright, I will send the schedule. The referee will explain the rules before the match starts.",
      },
      {
        cell_id: "34fcbffe-b2a1-467d-b9ad-ce139f1efc5c",
        speaker: "Kapten Tim",
        text: "Terima kasih. Kami ingin bermain dengan sportivitas tinggi.",
        vi: "Cam on. Chung toi muon thi dau voi tinh than the thao cao.",
        en: "Thank you. We want to play with strong sportsmanship.",
      },
      {
        cell_id: "26345b67-cb8f-4e9d-9184-a016ff2d6d43",
        speaker: "Panitia",
        text: "Bagus. Kalau menang, ada hadiah juara pertama dari sponsor.",
        vi: "Tot lam. Neu thang, co giai thuong hang nhat tu nha tai tro.",
        en: "Great. If you win, there is a first-place prize from the sponsor.",
      },
    ],
    exercises: [
      {
        type: "translation_id",
        prompt_vi: "Dich sang tieng Indonesia: Đội của tôi đã đăng ký giải đấu khu phố rồi.",
        prompt_en: "Translate into Indonesian: My team has already registered for the neighborhood tournament.",
        answer: "Tim saya sudah daftar untuk turnamen kampung.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Dien tu dung: ___ akan menjelaskan aturan pertandingan sebelum mulai.",
        prompt_en: "Fill in the correct word: ___ will explain the rules before the match starts.",
        answer: "Wasit",
        explanation_vi: "`Wasit` = trọng tài.",
        explanation_en: "`Wasit` means referee.",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Cum nao dung de chi tinh than cong bang va ton trong trong thi dau?",
        prompt_en: "Which phrase refers to fair and respectful behavior in competition?",
        choices: ["sportivitas", "pendaftaran", "jadwal", "panitia"],
        answer: "sportivitas",
      },
      {
        type: "short_answer",
        prompt_vi: "Viet mot cau lich su hoi ve lich thi dau futsal.",
        prompt_en: "Write one polite sentence asking about the futsal match schedule.",
        sample_answer: "Apakah jadwal pertandingan futsal sore ini sudah ditempel di papan?",
      },
    ],
  },
];
