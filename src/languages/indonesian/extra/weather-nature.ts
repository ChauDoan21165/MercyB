// src/languages/indonesian/extra/weather-nature.ts
//
// Weather & Nature pack for Vietnamese learners of Indonesian.
// Indonesia is equatorial — no four seasons, just musim hujan (rainy) and
// musim kemarau (dry). This pack covers the tropical climate, volcanoes
// (gunung berapi), rainforest (hutan), beaches (pantai), and coral reefs
// (terumbu karang) — plus the everyday small-talk Indonesians make about
// the heat and the rain.
//
// Vietnamese-first: every line carries a `vi` gloss; `pronunciation_focus`
// holds the Vietnamese-facing pronunciation/grammar note (incl. the predictable
// Vietnamese-speaker mistake = L1 note), and `pronunciation_focus_en` is the
// English-speaker companion (same order). Indonesia's tropical climate is very
// close to southern Vietnam's, so the concepts transfer easily.
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
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

export type Exercise = Record<string, any>;

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
  // 1. Two seasons — musim hujan & musim kemarau
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_nature_dua_musim",
    level: "A2",
    category: "weather",
    title_vi: "Hai mùa — mùa mưa và mùa khô",
    title_en: "Two seasons — rainy and dry",
    sentences: [
      {
        en: "Indonesia hanya punya dua musim: hujan dan kemarau.",
        vi: "Indonesia chỉ có hai mùa: mùa mưa và mùa khô.",
        pronunciation_focus: [
          "hanya → HA-nya = chỉ; 'ny' = 'nh'",
          "musim → MU-sim = mùa",
          "hujan → HU-jan = mưa; 'j' như tiếng Anh",
          "kemarau → ke-MA-rau = mùa khô",
        ],
        pronunciation_focus_en: [
          "hanya → 'HAH-nyah' = only; 'ny' = ñ",
          "musim → 'MOO-sim' = season",
          "hujan → 'HOO-jan' = rain; 'j' as English",
          "kemarau → 'kuh-MAH-rau' = dry season",
        ],
      },
      {
        en: "Musim hujan biasanya dari Oktober sampai Maret.",
        vi: "Mùa mưa thường từ tháng Mười đến tháng Ba.",
        pronunciation_focus: [
          "biasanya → bi-a-SA-nya = thường, thông thường; 'ny' = 'nh'",
          "dari ... sampai → DA-ri ... sam-PAI = từ ... đến",
          "Oktober → ok-TO-ber = tháng Mười",
          "Maret → MA-ret = tháng Ba",
        ],
        pronunciation_focus_en: [
          "biasanya → 'bee-ah-SAH-nyah' = usually; 'ny' = ñ",
          "dari ... sampai → 'DAH-ree ... sam-PAI' = from ... to",
          "Oktober → 'ok-TOH-ber' = October",
          "Maret → 'MAH-ret' = March",
        ],
      },
      {
        en: "Saat kemarau, cuaca panas dan jarang turun hujan.",
        vi: "Vào mùa khô, thời tiết nóng và hiếm khi có mưa.",
        pronunciation_focus: [
          "saat → SA-at = lúc, khi (hai âm: sa-at)",
          "cuaca → cu-A-ca = thời tiết; 'c' = 'ch' → 'chu-a-cha'",
          "jarang → JA-rang = hiếm khi; 'ng' cuối",
          "turun hujan → TU-run HU-jan = mưa rơi (trời mưa)",
        ],
        pronunciation_focus_en: [
          "saat → 'SAH-at' = when/moment (two syllables)",
          "cuaca → 'choo-AH-chah' = weather; 'c' = 'ch' twice",
          "jarang → 'JAH-rang' = rarely; final 'ng'",
          "turun hujan → 'TOO-roon HOO-jan' = to rain (rain falls)",
        ],
      },
    ],
    cultural_notes_vi:
      "Indonesia nằm trên đường xích đạo nên KHÔNG có bốn mùa — chỉ có 'musim hujan' (mùa mưa) và 'musim kemarau' (mùa khô). Nhiệt độ quanh năm khoảng 27-32°C, rất giống miền Nam Việt Nam. Mùa mưa (khoảng tháng 10 đến tháng 3) thường có mưa rào buổi chiều dữ dội nhưng ngắn, kèm theo nguy cơ ngập ('banjir') ở Jakarta. Mùa khô (tháng 4 đến tháng 9) nóng và khô hơn. Người Việt sẽ thấy quen vì khí hậu nhiệt đới gió mùa tương tự. Lưu ý: 'cuaca' (thời tiết) khác 'iklim' (khí hậu) — đừng nhầm. Nói chuyện về thời tiết ('Panas ya hari ini' - Nóng ghê nhỉ) là cách bắt chuyện phổ biến.",
    cultural_notes_en:
      "Indonesia sits on the equator, so there are NO four seasons — only 'musim hujan' (rainy) and 'musim kemarau' (dry). Temperatures stay around 27–32°C year-round, very like southern Vietnam. The rainy season (roughly October to March) brings intense but short afternoon downpours and flood ('banjir') risk in Jakarta. The dry season (April to September) is hotter and drier. Vietnamese learners will find the tropical monsoon climate familiar. Note: 'cuaca' (weather) differs from 'iklim' (climate). Weather small talk ('Panas ya hari ini' — Hot today, isn't it) is a common icebreaker.",
    tip_advice_vi:
      "'musim' (mùa) + hujan/kemarau. 'cuaca' = thời tiết (đọc 'chu-a-cha', c=ch hai lần). 'ny' = 'nh' xuất hiện nhiều: hanya, biasanya — dễ với người Việt. Câu thời tiết hữu ích: 'Cuaca hari ini bagaimana?' (Thời tiết hôm nay thế nào?), 'Sepertinya mau hujan' (Hình như sắp mưa).",
    tip_advice_en:
      "'musim' (season) + hujan/kemarau. 'cuaca' = weather ('choo-AH-chah', c=ch twice). 'ny' = ñ appears a lot: hanya, biasanya — easy for Vietnamese. Useful weather lines: 'Cuaca hari ini bagaimana?' (How's the weather today?), 'Sepertinya mau hujan' (Looks like rain).",
    vocabulary: [
      { word: "musim", en: "season", vi: "mùa", pos: "noun", pronunciation_vi: "MU-sim", pronunciation_en: "MOO-sim" },
      { word: "musim hujan", en: "rainy season", vi: "mùa mưa", pos: "noun phrase", pronunciation_vi: "MU-sim HU-jan", pronunciation_en: "MOO-sim HOO-jan" },
      { word: "musim kemarau", en: "dry season", vi: "mùa khô", pos: "noun phrase", pronunciation_vi: "MU-sim ke-MA-rau", pronunciation_en: "MOO-sim kuh-MAH-rau" },
      { word: "cuaca", en: "weather", vi: "thời tiết", pos: "noun", pronunciation_vi: "cu-A-ca", pronunciation_en: "choo-AH-chah" },
      { word: "panas", en: "hot", vi: "nóng", pos: "adjective", pronunciation_vi: "PA-nas", pronunciation_en: "PAH-nas" },
      { word: "hujan", en: "rain", vi: "mưa", pos: "noun/verb", pronunciation_vi: "HU-jan", pronunciation_en: "HOO-jan" },
      { word: "iklim", en: "climate", vi: "khí hậu", pos: "noun", pronunciation_vi: "IK-lim", pronunciation_en: "EEK-lim" },
    ],
    dialogue: [
      { speaker: "Tono", text: "Panas banget ya hari ini. Lagi musim kemarau sih.", vi: "Hôm nay nóng ghê. Đang mùa khô mà.", en: "So hot today. It's the dry season, after all." },
      { speaker: "Mira", text: "Iya. Tapi bulan depan udah mulai musim hujan.", vi: "Ừ. Nhưng tháng sau là bắt đầu mùa mưa rồi.", en: "Yeah. But next month the rainy season starts." },
      { speaker: "Tono", text: "Wah, harus siap payung dong.", vi: "Wao, phải chuẩn bị ô thôi.", en: "Ah, better get an umbrella ready then." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        instruction_en: "Match the word to its meaning:",
        items: [
          { prompt: "musim hujan", answer: "mùa mưa" },
          { prompt: "musim kemarau", answer: "mùa khô" },
          { prompt: "cuaca", answer: "thời tiết" },
          { prompt: "panas", answer: "nóng" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 2. Talking about the weather
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_nature_cuaca_talk",
    level: "A2",
    category: "weather",
    title_vi: "Nói chuyện về thời tiết",
    title_en: "Talking about the weather",
    sentences: [
      {
        en: "Langit mendung, sepertinya mau hujan deras.",
        vi: "Trời âm u, hình như sắp mưa to.",
        pronunciation_focus: [
          "langit → LA-ngit = bầu trời; 'ng' giữa từ",
          "mendung → men-DUNG = âm u, nhiều mây",
          "sepertinya → se-per-TI-nya = hình như; 'ny' = 'nh'",
          "hujan deras → HU-jan de-RAS = mưa to, mưa lớn",
        ],
        pronunciation_focus_en: [
          "langit → 'LAH-ngit' = sky; medial 'ng'",
          "mendung → 'men-DOONG' = cloudy/overcast",
          "sepertinya → 'suh-per-TEE-nyah' = it seems; 'ny' = ñ",
          "hujan deras → 'HOO-jan duh-RAS' = heavy rain",
        ],
      },
      {
        en: "Bawa payung, nanti kehujanan di jalan.",
        vi: "Mang ô đi, kẻo dính mưa giữa đường.",
        pronunciation_focus: [
          "bawa → BA-wa = mang theo",
          "payung → PA-yung = ô, dù; 'ng' cuối",
          "kehujanan → ke-hu-JA-nan = bị mắc mưa (ke- + hujan + -an)",
          "di jalan → di JA-lan = trên đường",
        ],
        pronunciation_focus_en: [
          "bawa → 'BAH-wah' = to bring",
          "payung → 'PAH-yoong' = umbrella; final 'ng'",
          "kehujanan → 'kuh-hoo-JAH-nan' = to get caught in the rain (ke- + hujan + -an)",
          "di jalan → 'dee JAH-lan' = on the way/road",
        ],
      },
      {
        en: "Hari ini cerah dan berangin, enak buat jalan-jalan.",
        vi: "Hôm nay trời quang và có gió, thích hợp đi dạo.",
        pronunciation_focus: [
          "cerah → CE-rah = quang, nắng đẹp; 'c' = 'ch' → 'che-rah'",
          "berangin → ber-A-ngin = có gió (ber- + angin); 'ng' giữa",
          "enak → E-nak = dễ chịu, thích",
          "jalan-jalan → JA-lan JA-lan = đi dạo, đi chơi (từ lặp)",
        ],
        pronunciation_focus_en: [
          "cerah → 'CHEH-rah' = bright/sunny; 'c' = 'ch'",
          "berangin → 'ber-AH-ngin' = windy (ber- + angin); medial 'ng'",
          "enak → 'EH-nak' = pleasant, nice",
          "jalan-jalan → 'JAH-lan JAH-lan' = to stroll/go out (reduplication)",
        ],
      },
    ],
    cultural_notes_vi:
      "Thời tiết là chủ đề bắt chuyện an toàn và phổ biến ở Indonesia, đặc biệt vì cái nóng và những cơn mưa rào bất chợt. Mùa mưa, mưa thường đến rất nhanh và dữ dội vào buổi chiều — người ta luôn để sẵn 'payung' (ô) hoặc 'jas hujan' (áo mưa). Bị mắc mưa gọi là 'kehujanan' (cấu trúc ke-...-an chỉ điều không may xảy đến). Có câu tục ngữ 'sedia payung sebelum hujan' (chuẩn bị ô trước khi mưa = phòng xa). Người Việt rất quen vì khí hậu tương đồng — chỉ cần học từ vựng mới. Lưu ý cấu trúc ke-...-an chỉ sự cố ngoài ý muốn: kehujanan (mắc mưa), kepanasan (bị nóng quá), kedinginan (bị lạnh).",
    cultural_notes_en:
      "Weather is a safe, common icebreaker in Indonesia, especially given the heat and sudden downpours. In the rainy season, rain arrives fast and hard in the afternoon — people keep a 'payung' (umbrella) or 'jas hujan' (raincoat) handy. Getting caught in rain is 'kehujanan' (the ke-...-an pattern marks an unwanted event befalling you). There's a proverb 'sedia payung sebelum hujan' (have an umbrella ready before the rain = be prepared). Vietnamese learners will find it familiar — just new vocabulary. Note the ke-...-an pattern for involuntary states: kehujanan (caught in rain), kepanasan (overheated), kedinginan (too cold).",
    tip_advice_vi:
      "Cấu trúc ke-...-an = 'bị... một cách không mong muốn': kehujanan, kepanasan, kedinginan. 'c' = 'ch': cerah, cuaca. Cụm bắt chuyện: 'Panas ya?' (Nóng nhỉ?), 'Mau hujan kayaknya' (Hình như sắp mưa). Đừng quên 'payung' (ô) có 'ng' cuối, đọc rõ.",
    tip_advice_en:
      "The ke-...-an pattern = 'to be unwillingly affected by': kehujanan, kepanasan, kedinginan. 'c' = 'ch': cerah, cuaca. Icebreakers: 'Panas ya?' (Hot, huh?), 'Mau hujan kayaknya' (Looks like rain). Don't forget 'payung' (umbrella) has a final 'ng' — pronounce it clearly.",
    vocabulary: [
      { word: "langit", en: "sky", vi: "bầu trời", pos: "noun", pronunciation_vi: "LA-ngit", pronunciation_en: "LAH-ngit" },
      { word: "mendung", en: "cloudy, overcast", vi: "âm u, nhiều mây", pos: "adjective", pronunciation_vi: "men-DUNG", pronunciation_en: "men-DOONG" },
      { word: "cerah", en: "bright, sunny", vi: "quang, nắng đẹp", pos: "adjective", pronunciation_vi: "CE-rah", pronunciation_en: "CHEH-rah" },
      { word: "payung", en: "umbrella", vi: "ô, dù", pos: "noun", pronunciation_vi: "PA-yung", pronunciation_en: "PAH-yoong" },
      { word: "angin", en: "wind", vi: "gió", pos: "noun", pronunciation_vi: "A-ngin", pronunciation_en: "AH-ngin" },
      { word: "kehujanan", en: "caught in the rain", vi: "bị mắc mưa", pos: "verb", pronunciation_vi: "ke-hu-JA-nan", pronunciation_en: "kuh-hoo-JAH-nan" },
      { word: "jas hujan", en: "raincoat", vi: "áo mưa", pos: "noun", pronunciation_vi: "JAS HU-jan", pronunciation_en: "JAS HOO-jan" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền cấu trúc ke-...-an phù hợp:",
        instruction_en: "Fill the right ke-...-an form:",
        items: [
          { prompt: "Aku ___ di jalan tadi. (bị mắc mưa)", answer: "kehujanan", options: ["kehujanan", "kepanasan", "kedinginan"] },
          { prompt: "Bawa ___ kalau mau hujan. (ô)", answer: "payung", options: ["payung", "angin", "langit"] },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 3. Volcanoes & mountains
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_nature_gunung_berapi",
    level: "B1",
    category: "nature",
    title_vi: "Núi lửa và núi non",
    title_en: "Volcanoes & mountains",
    sentences: [
      {
        en: "Indonesia memiliki banyak gunung berapi yang masih aktif.",
        vi: "Indonesia có nhiều núi lửa vẫn còn hoạt động.",
        pronunciation_focus: [
          "memiliki → me-mi-LI-ki = sở hữu, có (meN- + milik + -i)",
          "gunung berapi → GU-nung be-RA-pi = núi lửa (núi có lửa)",
          "masih → MA-sih = vẫn còn",
          "aktif → AK-tif = hoạt động",
        ],
        pronunciation_focus_en: [
          "memiliki → 'muh-mee-LEE-kee' = to have/own (meN- + milik + -i)",
          "gunung berapi → 'GOO-noong buh-RAH-pee' = volcano (fire mountain)",
          "masih → 'MAH-see' = still",
          "aktif → 'AK-tif' = active",
        ],
      },
      {
        en: "Gunung Merapi meletus dan mengeluarkan abu vulkanik.",
        vi: "Núi Merapi phun trào và phun ra tro núi lửa.",
        pronunciation_focus: [
          "meletus → me-le-TUS = phun trào, nổ",
          "mengeluarkan → me-nge-lu-AR-kan = phun ra, thải ra; 'nge' giữa",
          "abu → A-bu = tro",
          "vulkanik → vul-KA-nik = (thuộc) núi lửa",
        ],
        pronunciation_focus_en: [
          "meletus → 'muh-luh-TOOS' = to erupt",
          "mengeluarkan → 'muh-nguh-loo-AR-kan' = to emit/expel; medial 'nge'",
          "abu → 'AH-boo' = ash",
          "vulkanik → 'vool-KAH-nik' = volcanic",
        ],
      },
      {
        en: "Tanah di sekitar gunung berapi sangat subur.",
        vi: "Đất quanh núi lửa rất màu mỡ.",
        pronunciation_focus: [
          "tanah → TA-nah = đất; 'h' cuối thở nhẹ",
          "sekitar → se-KI-tar = xung quanh",
          "sangat → SA-ngat = rất; 'ng' giữa từ",
          "subur → SU-bur = màu mỡ, phì nhiêu",
        ],
        pronunciation_focus_en: [
          "tanah → 'TAH-nah' = soil/land; soft final 'h'",
          "sekitar → 'suh-KEE-tar' = around/surrounding",
          "sangat → 'SAH-ngat' = very; medial 'ng'",
          "subur → 'SOO-boor' = fertile",
        ],
      },
    ],
    cultural_notes_vi:
      "Indonesia nằm trên 'Vành đai Lửa Thái Bình Dương' với hơn 120 núi lửa còn hoạt động — nhiều nhất thế giới. Các núi nổi tiếng: Merapi (Yogyakarta), Krakatau, Bromo, Semeru. Núi lửa vừa là mối nguy ('bencana' - thảm họa) vừa là phước lành: tro núi lửa làm 'tanah subur' (đất màu mỡ) nên nông nghiệp trù phú. Cơ quan theo dõi là PVMBG; mức cảnh báo từ 'Normal' đến 'Awas' (nguy hiểm cao nhất). Nhiều cộng đồng coi núi là linh thiêng và làm lễ cúng (như lễ Yadnya Kasada ở Bromo). Người Việt ít gặp núi lửa nên đây là chủ đề mới mẻ — lưu ý từ 'gunung berapi' (núi lửa) khác 'gunung' thường (núi).",
    cultural_notes_en:
      "Indonesia lies on the Pacific 'Ring of Fire' with 120+ active volcanoes — the most of any country. Famous ones: Merapi (Yogyakarta), Krakatau, Bromo, Semeru. Volcanoes are both a hazard ('bencana' - disaster) and a blessing: volcanic ash makes 'tanah subur' (fertile soil), so farming thrives. The monitoring agency is PVMBG; alert levels run from 'Normal' to 'Awas' (highest danger). Many communities regard the mountains as sacred and hold rituals (like Yadnya Kasada at Bromo). Vietnamese learners rarely encounter volcanoes, so this is fresh material — note 'gunung berapi' (volcano) vs plain 'gunung' (mountain).",
    tip_advice_vi:
      "'gunung' (núi) + 'berapi' (có lửa) = núi lửa. Động từ phun trào: 'meletus'. 'ng' giữa từ (gunung, sangat, sekitar) rất nhiều — dễ với người Việt. Phân biệt 'abu' (tro) với 'debu' (bụi). Mức cảnh báo cao nhất 'Awas' là từ cần nhớ khi du lịch vùng núi lửa.",
    tip_advice_en:
      "'gunung' (mountain) + 'berapi' (with fire) = volcano. Erupt verb: 'meletus'. Lots of medial 'ng' (gunung, sangat, sekitar) — easy for Vietnamese. Distinguish 'abu' (ash) from 'debu' (dust). The top alert level 'Awas' is worth knowing when visiting volcanic areas.",
    vocabulary: [
      { word: "gunung berapi", en: "volcano", vi: "núi lửa", pos: "noun phrase", pronunciation_vi: "GU-nung be-RA-pi", pronunciation_en: "GOO-noong buh-RAH-pee" },
      { word: "meletus", en: "to erupt", vi: "phun trào", pos: "verb", pronunciation_vi: "me-le-TUS", pronunciation_en: "muh-luh-TOOS" },
      { word: "abu", en: "ash", vi: "tro", pos: "noun", pronunciation_vi: "A-bu", pronunciation_en: "AH-boo" },
      { word: "tanah", en: "soil, land", vi: "đất", pos: "noun", pronunciation_vi: "TA-nah", pronunciation_en: "TAH-nah" },
      { word: "subur", en: "fertile", vi: "màu mỡ, phì nhiêu", pos: "adjective", pronunciation_vi: "SU-bur", pronunciation_en: "SOO-boor" },
      { word: "bencana", en: "disaster", vi: "thảm họa", pos: "noun", pronunciation_vi: "ben-CA-na", pronunciation_en: "ben-CHAH-nah" },
      { word: "gempa bumi", en: "earthquake", vi: "động đất", pos: "noun phrase", pronunciation_vi: "GEM-pa BU-mi", pronunciation_en: "GEM-pah BOO-mee" },
    ],
    dialogue: [
      { speaker: "Guru", text: "Kenapa tanah di Jawa subur sekali ya?", vi: "Tại sao đất ở Java màu mỡ thế nhỉ?", en: "Why is the soil in Java so fertile?" },
      { speaker: "Murid", text: "Karena abu gunung berapi, Pak.", vi: "Vì tro núi lửa ạ, thưa thầy.", en: "Because of volcanic ash, sir." },
      { speaker: "Guru", text: "Betul. Gunung berapi berbahaya tapi juga bermanfaat.", vi: "Đúng. Núi lửa nguy hiểm nhưng cũng có ích.", en: "Correct. Volcanoes are dangerous but also beneficial." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        instruction_en: "Match the word to its meaning:",
        items: [
          { prompt: "gunung berapi", answer: "núi lửa" },
          { prompt: "meletus", answer: "phun trào" },
          { prompt: "subur", answer: "màu mỡ" },
          { prompt: "bencana", answer: "thảm họa" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 4. Rainforest & wildlife
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_nature_hutan_satwa",
    level: "B1",
    category: "nature",
    title_vi: "Rừng nhiệt đới và động vật hoang dã",
    title_en: "Rainforest & wildlife",
    sentences: [
      {
        en: "Hutan hujan tropis Indonesia adalah paru-paru dunia.",
        vi: "Rừng mưa nhiệt đới Indonesia là lá phổi của thế giới.",
        pronunciation_focus: [
          "hutan → HU-tan = rừng",
          "tropis → TRO-pis = nhiệt đới",
          "paru-paru → PA-ru PA-ru = lá phổi (từ lặp)",
          "dunia → DU-nia = thế giới",
        ],
        pronunciation_focus_en: [
          "hutan → 'HOO-tan' = forest",
          "tropis → 'TROH-pis' = tropical",
          "paru-paru → 'PAH-roo PAH-roo' = lungs (reduplication)",
          "dunia → 'DOO-nee-ah' = world",
        ],
      },
      {
        en: "Orangutan dan harimau Sumatra hampir punah.",
        vi: "Đười ươi và hổ Sumatra gần như tuyệt chủng.",
        pronunciation_focus: [
          "orangutan → o-rang-U-tan = đười ươi ('orang hutan' = người rừng)",
          "harimau → ha-ri-MAU = hổ",
          "hampir → HAM-pir = gần như, suýt",
          "punah → PU-nah = tuyệt chủng",
        ],
        pronunciation_focus_en: [
          "orangutan → 'oh-rang-OO-tan' = orangutan (from 'orang hutan' = forest person)",
          "harimau → 'hah-ree-MAU' = tiger",
          "hampir → 'HAM-peer' = almost",
          "punah → 'POO-nah' = extinct",
        ],
      },
      {
        en: "Kita harus melindungi hutan dari penebangan liar.",
        vi: "Chúng ta phải bảo vệ rừng khỏi nạn chặt phá trái phép.",
        pronunciation_focus: [
          "melindungi → me-lin-DU-ngi = bảo vệ; 'ng' giữa từ",
          "penebangan → pe-ne-BA-ngan = việc chặt cây; 'ng' giữa",
          "liar → LI-ar = hoang, trái phép (hai âm: li-ar)",
          "dari → DA-ri = khỏi, từ",
        ],
        pronunciation_focus_en: [
          "melindungi → 'muh-lin-DOO-ngee' = to protect; medial 'ng'",
          "penebangan → 'puh-nuh-BAH-ngan' = logging/felling; medial 'ng'",
          "liar → 'LEE-ar' = wild/illegal (two syllables)",
          "dari → 'DAH-ree' = from",
        ],
      },
    ],
    cultural_notes_vi:
      "Indonesia có rừng mưa nhiệt đới lớn thứ ba thế giới (sau Amazon và Congo), trải khắp Sumatra, Kalimantan (Borneo), và Papua — được gọi là 'paru-paru dunia' (lá phổi thế giới). Đây là nơi sống của những loài độc đáo: 'orangutan' (đười ươi, nghĩa đen 'người rừng'), 'harimau Sumatra' (hổ Sumatra), 'komodo' (rồng Komodo), 'badak' (tê giác). Nhiều loài 'terancam punah' (nguy cấp) do 'penebangan liar' (chặt phá trái phép) và cháy rừng để trồng cọ dầu. Từ 'orangutan' chính là ghép 'orang' (người) + 'hutan' (rừng) — một mẹo nhớ hay. Người Việt sẽ quan tâm vì Việt Nam cũng đối mặt vấn đề bảo tồn rừng tương tự.",
    cultural_notes_en:
      "Indonesia has the world's third-largest rainforest (after the Amazon and Congo), across Sumatra, Kalimantan (Borneo), and Papua — called 'paru-paru dunia' (the world's lungs). It's home to unique species: 'orangutan' (literally 'forest person'), 'harimau Sumatra' (Sumatran tiger), 'komodo' (Komodo dragon), 'badak' (rhino). Many are 'terancam punah' (endangered) due to 'penebangan liar' (illegal logging) and fires for palm oil. The word 'orangutan' is just 'orang' (person) + 'hutan' (forest) — a handy mnemonic. Vietnamese learners will relate, as Vietnam faces similar forest-conservation issues.",
    tip_advice_vi:
      "Mẹo nhớ: orangutan = orang (người) + hutan (rừng). Động từ bảo vệ 'melindungi' và 'penebangan' (chặt cây) đầy 'ng' giữa từ — dễ với người Việt. 'punah' = tuyệt chủng; 'terancam punah' = nguy cấp. 'liar' (hoang/trái phép) đọc tách hai âm 'li-ar', đừng nuốt.",
    tip_advice_en:
      "Mnemonic: orangutan = orang (person) + hutan (forest). Verbs 'melindungi' (protect) and 'penebangan' (logging) are full of medial 'ng' — easy for Vietnamese. 'punah' = extinct; 'terancam punah' = endangered. 'liar' (wild/illegal) splits into 'li-ar' — don't merge it.",
    vocabulary: [
      { word: "hutan", en: "forest", vi: "rừng", pos: "noun", pronunciation_vi: "HU-tan", pronunciation_en: "HOO-tan" },
      { word: "orangutan", en: "orangutan", vi: "đười ươi", pos: "noun", pronunciation_vi: "o-rang-U-tan", pronunciation_en: "oh-rang-OO-tan" },
      { word: "harimau", en: "tiger", vi: "hổ", pos: "noun", pronunciation_vi: "ha-ri-MAU", pronunciation_en: "hah-ree-MAU" },
      { word: "punah", en: "extinct", vi: "tuyệt chủng", pos: "adjective", pronunciation_vi: "PU-nah", pronunciation_en: "POO-nah" },
      { word: "melindungi", en: "to protect", vi: "bảo vệ", pos: "verb", pronunciation_vi: "me-lin-DU-ngi", pronunciation_en: "muh-lin-DOO-ngee" },
      { word: "penebangan liar", en: "illegal logging", vi: "chặt phá trái phép", pos: "noun phrase", pronunciation_vi: "pe-ne-BA-ngan LI-ar", pronunciation_en: "puh-nuh-BAH-ngan LEE-ar" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu:",
        instruction_en: "Fill in the missing word:",
        items: [
          { prompt: "___ = orang + hutan (đười ươi)", answer: "orangutan", options: ["orangutan", "harimau", "komodo"] },
          { prompt: "Kita harus ___ hutan. (bảo vệ)", answer: "melindungi", options: ["melindungi", "menebang", "membakar"] },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 5. Beaches & coral reefs
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_nature_pantai_coral",
    level: "A2",
    category: "nature",
    title_vi: "Bãi biển và rạn san hô",
    title_en: "Beaches & coral reefs",
    sentences: [
      {
        en: "Pantai di Bali terkenal dengan pasir putihnya.",
        vi: "Bãi biển ở Bali nổi tiếng với cát trắng.",
        pronunciation_focus: [
          "pantai → PAN-tai = bãi biển",
          "terkenal → ter-KE-nal = nổi tiếng (ter- + kenal)",
          "pasir → PA-sir = cát",
          "putihnya → pu-TIH-nya = cát trắng của nó (putih + -nya); 'ny'='nh'",
        ],
        pronunciation_focus_en: [
          "pantai → 'PAN-tai' = beach",
          "terkenal → 'ter-KEH-nal' = famous (ter- + kenal)",
          "pasir → 'PAH-seer' = sand",
          "putihnya → 'poo-TEE-nyah' = its white (putih + -nya); 'ny'=ñ",
        ],
      },
      {
        en: "Terumbu karang penuh dengan ikan warna-warni.",
        vi: "Rạn san hô đầy cá đủ màu sắc.",
        pronunciation_focus: [
          "terumbu karang → te-RUM-bu KA-rang = rạn san hô; 'ng' cuối",
          "penuh → pe-NUH = đầy",
          "warna-warni → WAR-na WAR-ni = nhiều màu sắc (từ lặp biến âm)",
          "ikan → I-kan = cá",
        ],
        pronunciation_focus_en: [
          "terumbu karang → 'tuh-ROOM-boo KAH-rang' = coral reef; final 'ng'",
          "penuh → 'puh-NOOH' = full",
          "warna-warni → 'WAR-nah WAR-nee' = colourful (vowel-changing reduplication)",
          "ikan → 'EE-kan' = fish",
        ],
      },
      {
        en: "Jangan injak karang, itu makhluk hidup yang rapuh.",
        vi: "Đừng giẫm lên san hô, đó là sinh vật sống mong manh.",
        pronunciation_focus: [
          "jangan injak → JA-ngan IN-jak = đừng giẫm",
          "karang → KA-rang = san hô; 'ng' cuối",
          "makhluk hidup → MAKH-luk HI-dup = sinh vật sống; 'kh' khạc nhẹ",
          "rapuh → ra-PUH = mong manh, dễ vỡ",
        ],
        pronunciation_focus_en: [
          "jangan injak → 'JAH-ngan IN-jak' = don't step on",
          "karang → 'KAH-rang' = coral; final 'ng'",
          "makhluk hidup → 'MAKH-look HEE-doop' = living creature; 'kh' light guttural",
          "rapuh → 'rah-POOH' = fragile",
        ],
      },
    ],
    cultural_notes_vi:
      "Với hơn 81.000 km bờ biển, Indonesia có vô số 'pantai' (bãi biển) đẹp — Bali, Lombok, Raja Ampat. Vùng biển này nằm trong 'Tam giác San hô' (Coral Triangle), nơi có đa dạng san hô và sinh vật biển cao nhất hành tinh. 'Terumbu karang' (rạn san hô) là hệ sinh thái mong manh, bị đe dọa bởi tẩy trắng san hô ('pemutihan karang'), đánh bắt bằng bom, và rác thải nhựa. Quy tắc khi lặn/snorkeling: 'jangan injak karang' (đừng giẫm san hô) vì nó là sinh vật sống. Người Việt sẽ thấy quen với các bãi biển tương tự (Phú Quốc, Nha Trang). Lưu ý từ lặp biến âm 'warna-warni' (đủ màu) — kiểu reduplikasi đặc biệt, đổi nguyên âm.",
    cultural_notes_en:
      "With 81,000+ km of coastline, Indonesia has countless beautiful 'pantai' (beaches) — Bali, Lombok, Raja Ampat. These waters lie in the 'Coral Triangle', the planet's highest concentration of coral and marine biodiversity. 'Terumbu karang' (coral reefs) are fragile ecosystems threatened by bleaching ('pemutihan karang'), blast fishing, and plastic waste. Diving/snorkelling rule: 'jangan injak karang' (don't step on coral) — it's a living creature. Vietnamese learners will recognise similar beaches (Phú Quốc, Nha Trang). Note the vowel-changing reduplication 'warna-warni' (colourful) — a special reduplication type that alters the vowel.",
    tip_advice_vi:
      "'pantai' (biển) + 'pasir' (cát) + 'ombak' (sóng) + 'karang' (san hô) = bộ từ vựng biển cốt lõi. Hậu tố '-nya' = 'của nó/cái đó': pasir putihnya = cát trắng của nó. Từ lặp biến âm: warna-warni (đủ màu), bolak-balik (qua lại) — đổi nguyên âm chứ không lặp y hệt. 'kh' trong 'makhluk' đọc khạc nhẹ.",
    tip_advice_en:
      "'pantai' (beach) + 'pasir' (sand) + 'ombak' (wave) + 'karang' (coral) = the core beach vocabulary. The '-nya' suffix = 'its/the': pasir putihnya = its white sand. Vowel-changing reduplication: warna-warni (colourful), bolak-balik (back and forth) — the vowel shifts rather than repeating. 'kh' in 'makhluk' is a light guttural.",
    vocabulary: [
      { word: "pantai", en: "beach", vi: "bãi biển", pos: "noun", pronunciation_vi: "PAN-tai", pronunciation_en: "PAN-tai" },
      { word: "pasir", en: "sand", vi: "cát", pos: "noun", pronunciation_vi: "PA-sir", pronunciation_en: "PAH-seer" },
      { word: "terumbu karang", en: "coral reef", vi: "rạn san hô", pos: "noun phrase", pronunciation_vi: "te-RUM-bu KA-rang", pronunciation_en: "tuh-ROOM-boo KAH-rang" },
      { word: "ikan", en: "fish", vi: "cá", pos: "noun", pronunciation_vi: "I-kan", pronunciation_en: "EE-kan" },
      { word: "warna-warni", en: "colourful", vi: "đủ màu sắc", pos: "adjective", pronunciation_vi: "WAR-na WAR-ni", pronunciation_en: "WAR-nah WAR-nee" },
      { word: "rapuh", en: "fragile", vi: "mong manh, dễ vỡ", pos: "adjective", pronunciation_vi: "ra-PUH", pronunciation_en: "rah-POOH" },
      { word: "ombak", en: "wave", vi: "sóng biển", pos: "noun", pronunciation_vi: "OM-bak", pronunciation_en: "OM-bak" },
    ],
    dialogue: [
      { speaker: "Pemandu", text: "Airnya jernih ya. Lihat, terumbu karangnya warna-warni!", vi: "Nước trong ghê. Nhìn kìa, rạn san hô đủ màu!", en: "The water's so clear. Look, the coral reef is colourful!" },
      { speaker: "Turis", text: "Indah sekali! Boleh pegang karangnya?", vi: "Đẹp quá! Có được sờ san hô không?", en: "So beautiful! Can I touch the coral?" },
      { speaker: "Pemandu", text: "Jangan, ya. Karang itu makhluk hidup yang rapuh.", vi: "Đừng nhé. San hô là sinh vật sống mong manh đấy.", en: "Please don't. Coral is a fragile living creature." },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Bãi biển nổi tiếng với cát trắng.", answer: "Pantai terkenal dengan pasir putih." },
          { prompt: "Đừng giẫm lên san hô.", answer: "Jangan injak karang." },
        ],
      },
    ],
  },
];

export default lessons;
