// src/languages/indonesian/extra/sports-hobbies.ts
//
// Sports & Hobbies pack for Vietnamese learners of Indonesian.
// Covers the things Indonesians actually do and talk about in their free time:
// sepak bola (football) and Liga 1, badminton (the national obsession), the gym,
// hiking gunung (mountains), diving, and surfing. Lots of this vocabulary is
// social glue — knowing it lets you join the office football chat or get invited
// on a weekend pendakian.
//
// Vietnamese-first: every line carries a `vi` gloss; `pronunciation_focus` holds
// the Vietnamese-facing pronunciation/grammar note (incl. the predictable
// Vietnamese-speaker mistake = L1 note), and `pronunciation_focus_en` is the
// English-speaker companion (same order). Indonesian is Latin-script and
// toneless — easy for Vietnamese ears — but the r/c/j/ng traps still apply.
//
// Self-contained inline types (mirrors the sibling extra packs); swap for a
// shared import when src/languages/indonesian/lessons.ts lands.

export type LessonSentence = {
  en: string; // Indonesian target line
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type VocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type DialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

export type Exercise = Record<string, unknown>;

export type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: VocabEntry[];
  dialogue?: DialogueLine[];
  exercises?: Exercise[];
  content?: string;
};

export const lessons: IndonesianLesson[] = [
  // ──────────────────────────────────────────────────────────────────────
  // 1. Sepak bola — football & Liga 1
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_sports_sepak_bola",
    level: "A2",
    category: "sports",
    title_vi: "Sepak bola — bóng đá và Liga 1",
    title_en: "Football — sepak bola and Liga 1",
    sentences: [
      {
        en: "Saya suka menonton sepak bola setiap akhir pekan.",
        vi: "Tôi thích xem bóng đá vào mỗi cuối tuần.",
        pronunciation_focus: [
          "sepak bola → SE-pak BO-la = bóng đá",
          "menonton → me-NON-ton = xem (meN- + tonton)",
          "akhir pekan → A-khir PE-kan = cuối tuần; 'kh' khạc nhẹ",
          "suka → SU-ka = thích",
        ],
        pronunciation_focus_en: [
          "sepak bola → 'SUH-pak BOH-lah' = football/soccer",
          "menonton → 'muh-NON-ton' = to watch (meN- + tonton)",
          "akhir pekan → 'AH-kheer PUH-kan' = weekend; 'kh' is a light guttural",
          "suka → 'SOO-kah' = to like",
        ],
      },
      {
        en: "Tim favorit saya bermain di Liga 1 musim ini.",
        vi: "Đội yêu thích của tôi thi đấu ở Liga 1 mùa này.",
        pronunciation_focus: [
          "tim → TIM = đội (mượn 'team')",
          "bermain → ber-MA-in = chơi, thi đấu (ber- + main)",
          "musim → MU-sim = mùa (giải)",
          "Liga → LI-ga; 'g' cứng như 'go'",
        ],
        pronunciation_focus_en: [
          "tim → 'TEEM' = team",
          "bermain → 'ber-MAH-in' = to play (ber- + main)",
          "musim → 'MOO-sim' = season",
          "Liga → 'LEE-gah'; hard 'g' as in 'go'",
        ],
      },
      {
        en: "Mereka mencetak gol di menit terakhir dan menang!",
        vi: "Họ ghi bàn ở phút cuối và giành chiến thắng!",
        pronunciation_focus: [
          "mencetak gol → men-CE-tak GOL = ghi bàn; 'c' = 'ch' → 'men-che-tak'",
          "menit → ME-nit = phút",
          "terakhir → ter-A-khir = cuối cùng",
          "menang → me-NANG = thắng; 'ng' cuối",
        ],
        pronunciation_focus_en: [
          "mencetak gol → 'men-CHEH-tak GOL' = to score a goal; 'c' = 'ch'",
          "menit → 'MUH-nit' = minute",
          "terakhir → 'ter-AH-kheer' = last/final",
          "menang → 'muh-NANG' = to win; final 'ng'",
        ],
      },
    ],
    cultural_notes_vi:
      "Bóng đá là môn thể thao được yêu thích nhất Indonesia — cuồng nhiệt y như Việt Nam. Liga 1 là giải vô địch quốc gia; các CLB lớn như Persija Jakarta, Persib Bandung, Arema Malang có lượng cổ động viên khổng lồ và rất kình địch nhau. Cổ động viên gọi là 'suporter'; nhóm fan có biệt danh riêng (The Jakmania, Bobotoh, Aremania). Đội tuyển quốc gia là 'Timnas' (tim nasional). Người Việt rất dễ bắt chuyện bằng bóng đá — hỏi 'Dukung tim apa?' (Cổ vũ đội nào?) là cách phá băng tuyệt vời ở công sở. Lưu ý lịch sử bi thương Kanjuruhan 2022 — chủ đề nhạy cảm, tránh đùa cợt.",
    cultural_notes_en:
      "Football is Indonesia's most-loved sport — as fanatical as in Vietnam. Liga 1 is the top division; big clubs like Persija Jakarta, Persib Bandung, and Arema Malang have huge, fiercely rival fanbases. Fans are 'suporter', with named groups (The Jakmania, Bobotoh, Aremania). The national team is 'Timnas'. Football is an easy icebreaker — asking 'Dukung tim apa?' (Which team do you support?) works great at the office. Note the tragic 2022 Kanjuruhan disaster — a sensitive topic, never joke about it.",
    tip_advice_vi:
      "Nhớ quy tắc 'c' = 'ch': mencetak = 'men-che-tak', bukan 'men-ke-tak'. Động từ thể thao hay dùng tiền tố: bermain (chơi), menyerang (tấn công), bertahan (phòng thủ), menang/kalah (thắng/thua). Học cụm 'Dukung tim apa?' để bắt chuyện.",
    tip_advice_en:
      "Mind 'c' = 'ch': mencetak = 'men-CHEH-tak'. Sports verbs love prefixes: bermain (play), menyerang (attack), bertahan (defend), menang/kalah (win/lose). Learn 'Dukung tim apa?' as an icebreaker.",
    vocabulary: [
      { cell_id: "162d68ad-5dfa-4ff0-b1ee-53074487bd6a", word: "sepak bola", en: "football, soccer", vi: "bóng đá", pos: "noun", pronunciation_vi: "SE-pak BO-la", pronunciation_en: "SUH-pak BOH-lah" },
      { cell_id: "bcc05eab-7268-42e7-ac3a-94a457e65edd", word: "tim", en: "team", vi: "đội", pos: "noun", pronunciation_vi: "TIM", pronunciation_en: "TEEM" },
      { cell_id: "b2f9dc89-4bce-469e-8e19-b439226babb4", word: "gol", en: "goal", vi: "bàn thắng", pos: "noun", pronunciation_vi: "GOL", pronunciation_en: "GOL" },
      { cell_id: "4262eaf1-aaaa-4c37-8413-e9e323460739", word: "menang", en: "to win", vi: "thắng", pos: "verb", pronunciation_vi: "me-NANG", pronunciation_en: "muh-NANG" },
      { cell_id: "0c1d2fb1-95a8-44c4-933d-39af0258c06e", word: "kalah", en: "to lose", vi: "thua", pos: "verb", pronunciation_vi: "KA-lah", pronunciation_en: "KAH-lah" },
      { cell_id: "cebff3ed-c51e-4924-bf7f-ecc4284f8087", word: "suporter", en: "supporter, fan", vi: "cổ động viên", pos: "noun", pronunciation_vi: "su-POR-ter", pronunciation_en: "soo-POR-ter" },
      { cell_id: "5818e5dd-da85-4a77-b69a-daa8070948e7", word: "wasit", en: "referee", vi: "trọng tài", pos: "noun", pronunciation_vi: "WA-sit", pronunciation_en: "WAH-sit" },
    ],
    dialogue: [
      { cell_id: "c06acf1e-adca-4e05-9dd7-f20588af4088", speaker: "Andi", text: "Tadi malam nonton bola? Persija menang 2-0!", vi: "Tối qua xem bóng không? Persija thắng 2-0!", en: "Did you watch the match last night? Persija won 2-0!" },
      { cell_id: "1ae8f962-51a4-4775-b60c-9c508f80fa5e", speaker: "Bayu", text: "Iya! Gol terakhir keren banget. Dukung tim apa?", vi: "Có! Bàn cuối hay cực. Cậu cổ vũ đội nào?", en: "Yes! The last goal was awesome. Which team do you support?" },
      { cell_id: "06863b45-cab9-4db3-a74e-99c7338b6850", speaker: "Andi", text: "Aku Bobotoh, pendukung Persib. Hehe, rival nih.", vi: "Tớ là Bobotoh, fan Persib. Hehe, kình địch đấy.", en: "I'm Bobotoh, a Persib fan. Heh, rivals." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        instruction_en: "Match the word to its meaning:",
        items: [
          { prompt: "menang", answer: "thắng" },
          { prompt: "kalah", answer: "thua" },
          { prompt: "wasit", answer: "trọng tài" },
          { prompt: "suporter", answer: "cổ động viên" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 2. Badminton — the national pride
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_sports_badminton",
    level: "A2",
    category: "sports",
    title_vi: "Cầu lông — niềm tự hào quốc gia",
    title_en: "Badminton — the national pride",
    sentences: [
      {
        en: "Bulu tangkis adalah olahraga kebanggaan Indonesia.",
        vi: "Cầu lông là môn thể thao niềm tự hào của Indonesia.",
        pronunciation_focus: [
          "bulu tangkis → BU-lu TANG-kis = cầu lông (tên chính thức)",
          "olahraga → o-lah-RA-ga = thể thao (o-lah-ra-ga, 4 âm tiết)",
          "kebanggaan → ke-bang-GA-an = niềm tự hào; 'ngg' = ng + g",
          "adalah → 'là'",
        ],
        pronunciation_focus_en: [
          "bulu tangkis → 'BOO-loo TANG-kis' = badminton (official name)",
          "olahraga → 'oh-lah-RAH-gah' = sport (4 syllables)",
          "kebanggaan → 'kuh-bang-GAH-an' = pride; 'ngg' = ng + g",
          "adalah → 'is/are'",
        ],
      },
      {
        en: "Saya main bulu tangkis dengan teman setiap Rabu malam.",
        vi: "Tôi chơi cầu lông với bạn vào mỗi tối thứ Tư.",
        pronunciation_focus: [
          "main → MA-in = chơi (dạng gốc của bermain)",
          "dengan → de-NGAN = với; 'ng' giữa từ",
          "teman → te-MAN = bạn",
          "Rabu → RA-bu = thứ Tư",
        ],
        pronunciation_focus_en: [
          "main → 'MAH-in' = to play (root of bermain)",
          "dengan → 'duh-NGAN' = with; medial 'ng'",
          "teman → 'tuh-MAN' = friend",
          "Rabu → 'RAH-boo' = Wednesday",
        ],
      },
      {
        en: "Pemain ganda kita memenangkan medali emas Olimpiade.",
        vi: "Đôi đánh đôi của chúng ta giành huy chương vàng Olympic.",
        pronunciation_focus: [
          "pemain → pe-MA-in = vận động viên (pe- + main)",
          "ganda → GAN-da = đôi (đánh đôi)",
          "memenangkan → me-me-NANG-kan = giành chiến thắng",
          "medali emas → me-DA-li E-mas = huy chương vàng",
        ],
        pronunciation_focus_en: [
          "pemain → 'puh-MAH-in' = player (pe- + main)",
          "ganda → 'GAN-dah' = doubles",
          "memenangkan → 'muh-muh-NANG-kan' = to win (something)",
          "medali emas → 'muh-DAH-lee EH-mas' = gold medal",
        ],
      },
    ],
    cultural_notes_vi:
      "Cầu lông (bulu tangkis) là môn thể thao mà Indonesia thống trị thế giới — nguồn huy chương vàng Olympic lớn nhất của đất nước. Các huyền thoại như Susi Susanti, Taufik Hidayat, và cặp đôi Minions (Kevin/Marcus) là anh hùng dân tộc. Cầu lông cũng là môn chơi bình dân: sân cầu lông có khắp các khu phố, nhiều công ty có buổi đánh cầu hàng tuần. Nếu được rủ 'main bulu tangkis' sau giờ làm, đó là cách hòa nhập tuyệt vời — giống như đá bóng phong trào ở Việt Nam. Giải lớn nhất là Indonesia Open, khán giả cuồng nhiệt nổi tiếng thế giới.",
    cultural_notes_en:
      "Badminton (bulu tangkis) is the sport where Indonesia dominates globally — its biggest source of Olympic gold. Legends like Susi Susanti, Taufik Hidayat, and the Minions duo (Kevin/Marcus) are national heroes. It's also a grassroots game: courts are in every neighbourhood and many companies hold weekly sessions. Being invited to 'main bulu tangkis' after work is a great way to fit in. The biggest event is the Indonesia Open, famous for its passionate crowds.",
    tip_advice_vi:
      "Lưu ý 'olahraga' (thể thao) đọc đủ 4 âm tiết: o-lah-ra-ga. Phân biệt 'tunggal' (đánh đơn) và 'ganda' (đánh đôi). Động từ thắng có hai dạng: 'menang' (thắng, tự thân) và 'memenangkan' (giành được cái gì) — đừng nhầm.",
    tip_advice_en:
      "'olahraga' has four full syllables: o-lah-ra-ga. Distinguish 'tunggal' (singles) and 'ganda' (doubles). Two 'win' verbs: 'menang' (to win) vs 'memenangkan' (to win something).",
    vocabulary: [
      { cell_id: "dafecd84-ffdf-4ca5-a1f5-8042c3d7ebf8", word: "bulu tangkis", en: "badminton", vi: "cầu lông", pos: "noun", pronunciation_vi: "BU-lu TANG-kis", pronunciation_en: "BOO-loo TANG-kis" },
      { cell_id: "7e0cf348-bd98-4f70-84bf-15f8b4da9eae", word: "olahraga", en: "sport, exercise", vi: "thể thao", pos: "noun", pronunciation_vi: "o-lah-RA-ga", pronunciation_en: "oh-lah-RAH-gah" },
      { cell_id: "4ac63d69-d61c-4c2b-8edb-fffdf3139270", word: "pemain", en: "player", vi: "vận động viên", pos: "noun", pronunciation_vi: "pe-MA-in", pronunciation_en: "puh-MAH-in" },
      { cell_id: "dc39f103-5e0d-4c9c-8d6a-6bbbd439bfe2", word: "tunggal", en: "singles", vi: "đánh đơn", pos: "noun", pronunciation_vi: "TUNG-gal", pronunciation_en: "TOONG-gal" },
      { cell_id: "fdb4c4bc-e91e-4150-8155-dde8c2dcb81a", word: "ganda", en: "doubles", vi: "đánh đôi", pos: "noun", pronunciation_vi: "GAN-da", pronunciation_en: "GAN-dah" },
      { cell_id: "f84f2ece-a172-4219-811a-4ec495cf68c3", word: "medali", en: "medal", vi: "huy chương", pos: "noun", pronunciation_vi: "me-DA-li", pronunciation_en: "muh-DAH-lee" },
      { cell_id: "d09a76c6-062a-414e-aa05-d1bcef976d42", word: "juara", en: "champion", vi: "nhà vô địch", pos: "noun", pronunciation_vi: "ju-A-ra", pronunciation_en: "joo-AH-rah" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu:",
        instruction_en: "Fill in the missing word:",
        items: [
          { prompt: "Saya main ___ tangkis. (cầu lông)", answer: "bulu", options: ["bulu", "kaki", "meja"] },
          { prompt: "Dia jadi ___ dunia. (nhà vô địch)", answer: "juara", options: ["juara", "wasit", "pemain"] },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 3. Gym & fitness
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_sports_gym_fitness",
    level: "B1",
    category: "sports",
    title_vi: "Phòng gym và rèn luyện thể chất",
    title_en: "The gym & fitness",
    sentences: [
      {
        en: "Saya rutin nge-gym tiga kali seminggu.",
        vi: "Tôi đi tập gym đều đặn ba lần một tuần.",
        pronunciation_focus: [
          "rutin → RU-tin = đều đặn, thường xuyên",
          "nge-gym → nge-JIM = đi tập gym (gaul: tiền tố nge- + gym)",
          "tiga kali → TI-ga KA-li = ba lần",
          "seminggu → se-MING-gu = một tuần (se- + minggu)",
        ],
        pronunciation_focus_en: [
          "rutin → 'ROO-tin' = regularly",
          "nge-gym → 'nguh-JIM' = to go to the gym (slang nge- prefix + gym)",
          "tiga kali → 'TEE-gah KAH-lee' = three times",
          "seminggu → 'suh-MING-goo' = a week (se- + minggu)",
        ],
      },
      {
        en: "Saya mau menurunkan berat badan dan membentuk otot.",
        vi: "Tôi muốn giảm cân và tạo cơ bắp.",
        pronunciation_focus: [
          "menurunkan → me-nu-RUN-kan = làm giảm (meN- + turun + -kan)",
          "berat badan → be-RAT BA-dan = cân nặng",
          "membentuk → mem-ben-TUK = tạo dáng, định hình",
          "otot → O-tot = cơ bắp",
        ],
        pronunciation_focus_en: [
          "menurunkan → 'muh-noo-ROON-kan' = to lower (meN- + turun + -kan)",
          "berat badan → 'buh-RAT BAH-dan' = body weight",
          "membentuk → 'mem-ben-TOOK' = to shape/build",
          "otot → 'OH-tot' = muscle",
        ],
      },
      {
        en: "Jangan lupa pemanasan sebelum angkat beban.",
        vi: "Đừng quên khởi động trước khi nâng tạ.",
        pronunciation_focus: [
          "pemanasan → pe-ma-NA-san = khởi động (pe- + panas + -an)",
          "sebelum → se-be-LUM = trước khi",
          "angkat beban → ANG-kat be-BAN = nâng tạ",
          "jangan lupa → đừng quên (cụm mệnh lệnh)",
        ],
        pronunciation_focus_en: [
          "pemanasan → 'puh-mah-NAH-san' = warm-up (pe- + panas 'hot' + -an)",
          "sebelum → 'suh-buh-LOOM' = before",
          "angkat beban → 'ANG-kat buh-BAN' = weightlifting",
          "jangan lupa → 'don't forget' (command frame)",
        ],
      },
    ],
    cultural_notes_vi:
      "Văn hóa gym đang bùng nổ ở các thành phố lớn Indonesia, đặc biệt với giới trẻ đô thị. Tiếng lóng dùng tiền tố 'nge-' rất phổ biến: nge-gym (tập gym), nge-run (chạy bộ), nge-yoga. Nhiều người tập ở 'pusat kebugaran' (trung tâm thể hình) hay theo huấn luyện viên cá nhân ('personal trainer', viết tắt PT). Xu hướng 'hidup sehat' (sống khỏe), 'diet', và chạy bộ buổi sáng ('lari pagi') ở công viên rất thịnh hành. Người Việt sẽ thấy nhiều từ mượn tiếng Anh ở đây (gym, fitness, push-up, plank) — dễ nhận ra nhưng phát âm theo kiểu Indonesia.",
    cultural_notes_en:
      "Gym culture is booming in Indonesia's big cities, especially among urban youth. The slang 'nge-' prefix is everywhere: nge-gym, nge-run, nge-yoga. Many train at a 'pusat kebugaran' (fitness centre) or with a personal trainer (PT). Trends like 'hidup sehat' (healthy living), 'diet', and morning runs ('lari pagi') in parks are popular. Vietnamese learners will spot many English borrowings here (gym, fitness, push-up, plank) — recognisable but pronounced Indonesian-style.",
    tip_advice_vi:
      "Tiền tố gaul 'nge-' rất hữu ích: gắn trước danh từ/động từ để biến thành hành động (nge-gym, nge-mall, nge-game). Phát âm 'gym' = 'jim' (j như tiếng Anh). Động từ giảm/tăng: menurunkan (làm giảm) vs menaikkan (làm tăng) berat badan.",
    tip_advice_en:
      "The slang 'nge-' prefix is handy: stick it before a noun/verb to make it an action (nge-gym, nge-mall, nge-game). 'gym' = 'jim'. Verbs: menurunkan (lower) vs menaikkan (raise) berat badan.",
    vocabulary: [
      { cell_id: "c791e3ab-9391-4365-8354-6481ecaea6f8", word: "kebugaran", en: "fitness", vi: "thể hình, sự khỏe khoắn", pos: "noun", pronunciation_vi: "ke-bu-GA-ran", pronunciation_en: "kuh-boo-GAH-ran" },
      { cell_id: "a898d204-5fb1-4d95-8fdd-1e08073ef387", word: "otot", en: "muscle", vi: "cơ bắp", pos: "noun", pronunciation_vi: "O-tot", pronunciation_en: "OH-tot" },
      { cell_id: "a83fb294-1947-4c10-9d51-dcdaea2bf94e", word: "berat badan", en: "body weight", vi: "cân nặng", pos: "noun phrase", pronunciation_vi: "be-RAT BA-dan", pronunciation_en: "buh-RAT BAH-dan" },
      { cell_id: "a6e97aad-6ba4-40a1-8f15-7e2845278270", word: "pemanasan", en: "warm-up", vi: "khởi động", pos: "noun", pronunciation_vi: "pe-ma-NA-san", pronunciation_en: "puh-mah-NAH-san" },
      { cell_id: "1e8711cd-e598-4cb6-b752-e68670650554", word: "angkat beban", en: "weightlifting", vi: "nâng tạ", pos: "noun phrase", pronunciation_vi: "ANG-kat be-BAN", pronunciation_en: "ANG-kat buh-BAN" },
      { cell_id: "b29a6cd2-6e7c-4174-8982-e750dce84e07", word: "lari pagi", en: "morning run", vi: "chạy bộ buổi sáng", pos: "noun phrase", pronunciation_vi: "LA-ri PA-gi", pronunciation_en: "LAH-ree PAH-gee" },
    ],
    dialogue: [
      { cell_id: "a8545df6-e0c9-41ce-96a5-5e04a1af30bc", speaker: "Rian", text: "Lo rutin nge-gym ya? Badan jadi kekar.", vi: "Cậu tập gym đều à? Người vạm vỡ ghê.", en: "You hit the gym regularly, huh? You're getting buff." },
      { cell_id: "d4f21240-5b3e-458e-8381-1c0d106b8d5b", speaker: "Dewi", text: "Iya, tiga kali seminggu. Mau ikut? Pemanasan dulu lho.", vi: "Ừ, ba lần một tuần. Đi cùng không? Phải khởi động trước nha.", en: "Yeah, three times a week. Wanna join? Warm up first, though." },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn giảm cân.", answer: "Saya mau menurunkan berat badan." },
          { prompt: "Đừng quên khởi động.", answer: "Jangan lupa pemanasan." },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 4. Hiking gunung — mountain trekking
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_sports_hiking_gunung",
    level: "B1",
    category: "sports",
    title_vi: "Leo núi (mendaki gunung) — trekking",
    title_en: "Hiking gunung — mountain trekking",
    sentences: [
      {
        en: "Akhir pekan ini kami mau mendaki Gunung Bromo.",
        vi: "Cuối tuần này chúng tôi muốn leo núi Bromo.",
        pronunciation_focus: [
          "mendaki → men-DA-ki = leo (núi); meN- + daki",
          "gunung → GU-nung = núi; 'ng' giữa và cuối",
          "Bromo → BRO-mo = tên núi lửa nổi tiếng",
          "kami → KA-mi = chúng tôi (loại trừ người nghe)",
        ],
        pronunciation_focus_en: [
          "mendaki → 'men-DAH-kee' = to climb/hike (meN- + daki)",
          "gunung → 'GOO-noong' = mountain; medial and final 'ng'",
          "Bromo → 'BROH-moh' = a famous volcano",
          "kami → 'KAH-mee' = we (exclusive of listener)",
        ],
      },
      {
        en: "Kita harus membawa jaket tebal karena di puncak dingin.",
        vi: "Chúng ta phải mang áo khoác dày vì trên đỉnh rất lạnh.",
        pronunciation_focus: [
          "membawa → mem-BA-wa = mang theo (meN- + bawa)",
          "jaket tebal → JA-ket te-BAL = áo khoác dày",
          "puncak → PUN-cak = đỉnh; 'c' = 'ch' → 'pun-chak'",
          "dingin → DI-ngin = lạnh; 'ng' giữa từ",
        ],
        pronunciation_focus_en: [
          "membawa → 'mem-BAH-wah' = to bring (meN- + bawa)",
          "jaket tebal → 'JAH-ket tuh-BAL' = thick jacket",
          "puncak → 'POON-chak' = summit; 'c' = 'ch'",
          "dingin → 'DEE-ngin' = cold; medial 'ng'",
        ],
      },
      {
        en: "Kami berangkat dini hari untuk melihat matahari terbit.",
        vi: "Chúng tôi xuất phát lúc sáng sớm để ngắm mặt trời mọc.",
        pronunciation_focus: [
          "berangkat → be-RANG-kat = khởi hành (ber- + angkat)",
          "dini hari → DI-ni HA-ri = tờ mờ sáng",
          "matahari terbit → ma-ta-HA-ri ter-BIT = mặt trời mọc",
          "melihat → me-LI-hat = nhìn, ngắm",
        ],
        pronunciation_focus_en: [
          "berangkat → 'buh-RANG-kat' = to depart (ber- + angkat)",
          "dini hari → 'DEE-nee HAH-ree' = the small hours, pre-dawn",
          "matahari terbit → 'mah-tah-HAH-ree ter-BIT' = sunrise",
          "melihat → 'muh-LEE-hat' = to see/watch",
        ],
      },
    ],
    cultural_notes_vi:
      "Leo núi ('naik gunung' / 'mendaki') là sở thích cuối tuần cực thịnh của giới trẻ Indonesia — đất nước có hơn 100 núi lửa. Các đỉnh nổi tiếng: Bromo, Semeru, Rinjani (Lombok), Merbabu. Mục tiêu kinh điển là leo đêm để ngắm 'matahari terbit' (mặt trời mọc) từ đỉnh. Người leo núi gọi là 'pendaki'; phải xin giấy phép, đi theo nhóm, và tôn trọng quy tắc 'tidak meninggalkan apa pun selain jejak kaki' (không để lại gì ngoài dấu chân). Người Việt sẽ thấy quen vì trekking Fansipan/Tà Xùa rất tương đồng. Lưu ý: nhiều núi linh thiêng với cư dân bản địa — giữ thái độ tôn kính.",
    cultural_notes_en:
      "Mountain hiking ('naik gunung' / 'mendaki') is a hugely popular weekend hobby for young Indonesians — the country has 100+ volcanoes. Famous peaks: Bromo, Semeru, Rinjani (Lombok), Merbabu. The classic goal is a night climb to watch 'matahari terbit' (sunrise) from the summit. Hikers are 'pendaki'; you need permits, go in groups, and respect the leave-no-trace ethic. Vietnamese learners will find it familiar from Fansipan/Tà Xùa trekking. Note: many mountains are sacred to locals — stay respectful.",
    tip_advice_vi:
      "Phân biệt 'mendaki' (leo, trang trọng) và 'naik gunung' (lên núi, thông dụng). 'puncak' = đỉnh, đọc 'pun-chak' (c=ch). Từ chỉ thời gian: 'dini hari' (tờ mờ sáng) ≠ 'pagi' (sáng). Đại từ 'kami' (chúng tôi, không gồm người nghe) ≠ 'kita' (chúng ta, gồm người nghe) — lỗi rất hay gặp.",
    tip_advice_en:
      "Distinguish 'mendaki' (to climb, formal) and 'naik gunung' (everyday). 'puncak' = summit, said 'POON-chak' (c=ch). 'dini hari' (pre-dawn) ≠ 'pagi' (morning). Pronoun 'kami' (we, excluding listener) ≠ 'kita' (we, including listener) — a very common error.",
    vocabulary: [
      { cell_id: "7002fac9-6938-4509-9d6f-93ce4b081f59", word: "gunung", en: "mountain", vi: "núi", pos: "noun", pronunciation_vi: "GU-nung", pronunciation_en: "GOO-noong" },
      { cell_id: "2903a0c7-07a1-4535-985a-616b8998360d", word: "mendaki", en: "to hike, climb", vi: "leo núi", pos: "verb", pronunciation_vi: "men-DA-ki", pronunciation_en: "men-DAH-kee" },
      { cell_id: "1bed3303-40d4-4b29-a55a-2c69152c99b5", word: "puncak", en: "summit, peak", vi: "đỉnh", pos: "noun", pronunciation_vi: "PUN-cak", pronunciation_en: "POON-chak" },
      { cell_id: "becc625a-9c1a-4926-92d8-4872b5b2fa03", word: "pendaki", en: "hiker", vi: "người leo núi", pos: "noun", pronunciation_vi: "pen-DA-ki", pronunciation_en: "pen-DAH-kee" },
      { cell_id: "e9cc596d-d25a-4913-ac35-2ca26457a27d", word: "tenda", en: "tent", vi: "lều", pos: "noun", pronunciation_vi: "TEN-da", pronunciation_en: "TEN-dah" },
      { cell_id: "c9bc55dd-bed6-44b3-901e-416cb8f51137", word: "matahari terbit", en: "sunrise", vi: "mặt trời mọc", pos: "noun phrase", pronunciation_vi: "ma-ta-HA-ri ter-BIT", pronunciation_en: "mah-tah-HAH-ree ter-BIT" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn 'kami' hay 'kita':",
        instruction_en: "Choose 'kami' (excl.) or 'kita' (incl.):",
        items: [
          { prompt: "(nói với bạn cùng đi) Ayo, ___ berangkat sekarang!", answer: "kita", options: ["kita", "kami"] },
          { prompt: "(kể cho người không đi) ___ mendaki Bromo kemarin.", answer: "Kami", options: ["Kami", "Kita"] },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 5. Diving & surfing
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_sports_diving_surfing",
    level: "B1",
    category: "sports",
    title_vi: "Lặn biển và lướt sóng",
    title_en: "Diving & surfing",
    sentences: [
      {
        en: "Indonesia punya tempat menyelam terbaik di dunia.",
        vi: "Indonesia có những điểm lặn biển đẹp nhất thế giới.",
        pronunciation_focus: [
          "menyelam → me-nye-LAM = lặn; 'ny' = 'nh' (meN- + selam)",
          "tempat → TEM-pat = nơi, địa điểm",
          "terbaik → ter-BA-ik = tốt nhất (ter- + baik)",
          "dunia → DU-nia = thế giới",
        ],
        pronunciation_focus_en: [
          "menyelam → 'muh-nyuh-LAM' = to dive; 'ny' = ñ (meN- + selam)",
          "tempat → 'TEM-pat' = place",
          "terbaik → 'ter-BAH-ik' = the best (ter- + baik)",
          "dunia → 'DOO-nee-ah' = world",
        ],
      },
      {
        en: "Di Bali banyak orang belajar berselancar.",
        vi: "Ở Bali nhiều người học lướt sóng.",
        pronunciation_focus: [
          "banyak → BA-nyak = nhiều; 'ny' = 'nh'",
          "belajar → be-LA-jar = học (ber- + ajar)",
          "berselancar → ber-se-lan-CAR = lướt sóng; 'c' = 'ch' → '...lan-char'",
          "ombak → OM-bak = sóng (biển)",
        ],
        pronunciation_focus_en: [
          "banyak → 'BAH-nyak' = many; 'ny' = ñ",
          "belajar → 'buh-LAH-jar' = to learn (ber- + ajar)",
          "berselancar → 'ber-suh-lan-CHAR' = to surf; 'c' = 'ch'",
          "ombak → 'OM-bak' = wave",
        ],
      },
      {
        en: "Hati-hati dengan arus, ombaknya cukup besar hari ini.",
        vi: "Cẩn thận với dòng chảy, sóng hôm nay khá lớn.",
        pronunciation_focus: [
          "hati-hati → HA-ti HA-ti = cẩn thận (từ lặp)",
          "arus → A-rus = dòng chảy",
          "ombaknya → om-BAK-nya = sóng (của nó); hậu tố -nya",
          "cukup besar → CU-kup be-SAR = khá lớn; cukup 'chu-kup'",
        ],
        pronunciation_focus_en: [
          "hati-hati → 'HAH-tee HAH-tee' = careful (reduplication)",
          "arus → 'AH-roos' = current",
          "ombaknya → 'om-BAK-nyah' = the wave; -nya suffix ('the/its')",
          "cukup besar → 'CHOO-koop buh-SAR' = quite big; cukup = 'choo-koop'",
        ],
      },
    ],
    cultural_notes_vi:
      "Với hơn 17.000 đảo, Indonesia là thiên đường thể thao biển. Lặn biển ('menyelam' / 'diving') ở Raja Ampat (Papua), Bunaken, và Komodo nổi tiếng toàn cầu nhờ rạn san hô và đa dạng sinh học bậc nhất. Lướt sóng ('berselancar' / 'surfing') tập trung ở Bali (Kuta, Uluwatu), Mentawai, và Lombok — dân lướt sóng khắp thế giới đổ về. Người mới chơi học ở các 'sekolah selancar' (trường dạy lướt sóng). Từ vựng an toàn quan trọng: 'arus' (dòng chảy), 'ombak' (sóng), 'pelampung' (phao), 'hati-hati' (cẩn thận). Nhiều từ mượn tiếng Anh trực tiếp: diving, snorkeling, surfing.",
    cultural_notes_en:
      "With 17,000+ islands, Indonesia is a watersports paradise. Diving ('menyelam') at Raja Ampat (Papua), Bunaken, and Komodo is world-famous for coral and biodiversity. Surfing ('berselancar') centres on Bali (Kuta, Uluwatu), the Mentawais, and Lombok — surfers come from everywhere. Beginners learn at a 'sekolah selancar' (surf school). Key safety words: 'arus' (current), 'ombak' (wave), 'pelampung' (float/buoy), 'hati-hati' (careful). Many terms borrow English directly: diving, snorkeling, surfing.",
    tip_advice_vi:
      "Chú ý 'ny' = 'nh' (menyelam = 'me-nhe-lam', banyak = 'ba-nhak') — dễ với người Việt. Hậu tố '-nya' nghĩa 'cái... đó' hoặc 'của nó' (ombaknya = sóng đó). 'c' = 'ch' lại xuất hiện: berselancar, cukup. Học cụm an toàn 'hati-hati dengan arus' (cẩn thận với dòng chảy).",
    tip_advice_en:
      "Note 'ny' = ñ (menyelam, banyak) — easy for Vietnamese. The '-nya' suffix means 'the' or 'its' (ombaknya = the wave). 'c' = 'ch' again: berselancar, cukup. Learn the safety chunk 'hati-hati dengan arus'.",
    vocabulary: [
      { cell_id: "24599a59-8d84-4764-bcc2-62fcbe69511f", word: "menyelam", en: "to dive", vi: "lặn biển", pos: "verb", pronunciation_vi: "me-nye-LAM", pronunciation_en: "muh-nyuh-LAM" },
      { cell_id: "7b676904-5b88-4c78-8c2c-054b89d764f5", word: "berselancar", en: "to surf", vi: "lướt sóng", pos: "verb", pronunciation_vi: "ber-se-lan-CAR", pronunciation_en: "ber-suh-lan-CHAR" },
      { cell_id: "0d53e36b-6131-43c2-828b-3db692bb0c1d", word: "ombak", en: "wave", vi: "sóng biển", pos: "noun", pronunciation_vi: "OM-bak", pronunciation_en: "OM-bak" },
      { cell_id: "f79eca00-5fe0-4755-987e-f81aa55c6fb4", word: "arus", en: "current", vi: "dòng chảy", pos: "noun", pronunciation_vi: "A-rus", pronunciation_en: "AH-roos" },
      { cell_id: "2fba284c-3830-4580-9b46-a14dfac1f4f2", word: "pantai", en: "beach", vi: "bãi biển", pos: "noun", pronunciation_vi: "PAN-tai", pronunciation_en: "PAN-tai" },
      { cell_id: "a990fae3-855c-4f77-b1b8-eb8060aea6f1", word: "terumbu karang", en: "coral reef", vi: "rạn san hô", pos: "noun phrase", pronunciation_vi: "te-RUM-bu KA-rang", pronunciation_en: "tuh-ROOM-boo KAH-rang" },
    ],
    dialogue: [
      { cell_id: "01bb06b8-cff7-4206-8306-b6ddfb8f67c1", speaker: "Turis", text: "Saya mau belajar berselancar. Susah nggak?", vi: "Tôi muốn học lướt sóng. Có khó không?", en: "I want to learn to surf. Is it hard?" },
      { cell_id: "8dca27b1-064a-45ba-8fef-327494a9c72e", speaker: "Instruktur", text: "Nggak kok, tapi hati-hati dengan arus. Ombak hari ini sedang.", vi: "Không đâu, nhưng cẩn thận dòng chảy. Sóng hôm nay vừa phải.", en: "Not really, but watch the current. Today's waves are moderate." },
      { cell_id: "2ef1b6ba-ced9-4faa-8312-4d79e6a07a5c", speaker: "Turis", text: "Oke, saya ikut kelas pemula dulu.", vi: "Ok, tôi học lớp người mới trước.", en: "Okay, I'll take the beginner class first." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        instruction_en: "Match the word to its meaning:",
        items: [
          { prompt: "menyelam", answer: "lặn biển" },
          { prompt: "berselancar", answer: "lướt sóng" },
          { prompt: "ombak", answer: "sóng biển" },
          { prompt: "arus", answer: "dòng chảy" },
        ],
      },
    ],
  },
];

export default lessons;
