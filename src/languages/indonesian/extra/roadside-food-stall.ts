// Roadside food stall Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file following the established Indonesian extra
// lesson format: Indonesian target text lives in `en`, Vietnamese glosses live in
// `vi`, and each Vietnamese-facing learning note has an English companion.

type LessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type Exercise = Record<string, any>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
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
  {
    id: "indonesian_roadside_food_stall",
    level: "B1",
    category: "food",
    title_vi: "Ăn ở warung pinggir jalan",
    title_en: "At a roadside food stall",
    sentences: [
      {
        en: "Saya mau makan di warung pinggir jalan itu.",
        vi: "Tôi muốn ăn ở quán ven đường đó.",
        pronunciation_focus: [
          "`warung pinggir jalan` = quán ven đường; `itu` đứng sau danh từ để chỉ quán đó.",
          "Lỗi người Việt: nói `jalan warung` theo thứ tự tiếng Việt. Trật tự tự nhiên là `warung pinggir jalan`.",
          "Luyện: `Saya mau makan di warung itu.`",
        ],
        pronunciation_focus_en: [
          "`warung pinggir jalan` = roadside stall; `itu` follows the noun to point to that stall.",
          "VN-speaker trap: switching to Vietnamese order `jalan warung`. Natural order is `warung pinggir jalan`.",
          "Drill: `Saya mau makan di warung itu.`",
        ],
      },
      {
        en: "Boleh pesan nasi bungkus satu?",
        vi: "Tôi có thể gọi một phần cơm gói không?",
        pronunciation_focus: [
          "`nasi bungkus` = cơm gói mang đi; rất phổ biến ở warung dan kaki lima.",
          "`boleh pesan` = có thể gọi món không; cách hỏi rất tự nhiên.",
          "Lỗi người Việt: dùng `order nasi pack`. Ở Indonesia, `pesan nasi bungkus` là cụm chuẩn.",
        ],
        pronunciation_focus_en: [
          "`nasi bungkus` = packed rice meal to go; very common at warung and street stalls.",
          "`boleh pesan` = may I order; a natural question frame.",
          "VN-speaker trap: saying `order nasi pack`. In Indonesian, `pesan nasi bungkus` is the natural phrase.",
        ],
      },
      {
        en: "Lauknya apa yang paling enak hari ini?",
        vi: "Món mặn nào ngon nhất hôm nay?",
        pronunciation_focus: [
          "`lauk` = món mặn/đồ ăn kèm với cơm; `paling enak` = ngon nhất.",
          "`hari ini` giúp hỏi món mới làm trong ngày, rất thường dùng ở warung.",
          "Lỗi người Việt: hỏi `menu apa enak?` quá chung. `Lauknya apa yang paling enak?` cụ thể hơn.",
        ],
        pronunciation_focus_en: [
          "`lauk` = side dish / savory dish eaten with rice; `paling enak` = the tastiest.",
          "`hari ini` helps ask about the dish made today, very common at stalls.",
          "VN-speaker trap: asking too generally `menu apa enak?`. `Lauknya apa yang paling enak?` is more specific.",
        ],
      },
      {
        en: "Saya mau sambal sedikit saja, jangan terlalu pedas.",
        vi: "Tôi muốn chỉ một ít sa tế/sambal thôi, đừng cay quá.",
        pronunciation_focus: [
          "`sambal` = sốt ớt; `sedikit saja` = chỉ một ít thôi.",
          "`jangan terlalu pedas` = đừng cay quá; `jangan` dùng cho yêu cầu cấm/đừng làm.",
          "Lỗi người Việt: nói `tidak pedas` khi đang nhờ người bán. Với yêu cầu, `jangan terlalu pedas` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "`sambal` = chili paste/sauce; `sedikit saja` = just a little.",
          "`jangan terlalu pedas` = not too spicy; `jangan` is used for requests not to do something.",
          "VN-speaker trap: saying `tidak pedas` when asking the vendor. For requests, `jangan terlalu pedas` is more natural.",
        ],
      },
      {
        en: "Teh manisnya hangat atau dingin?",
        vi: "Trà ngọt của quán là nóng hay đá?",
        pronunciation_focus: [
          "`teh manis` = trà ngọt; rất hay gọi cùng quán ăn pinggir jalan.",
          "`hangat atau dingin` = nóng hay lạnh/đá; hỏi cepat và rõ.",
          "Lỗi người Việt: nói `es` cho mọi minuman lạnh. `Dingin` đủ hiểu; `es` juga sangat umum.",
        ],
        pronunciation_focus_en: [
          "`teh manis` = sweet tea; very common at roadside stalls.",
          "`hangat atau dingin` = warm or cold; a quick and clear question.",
          "VN-speaker trap: using `es` for every cold drink. `Dingin` is enough, and `es` is also very common.",
        ],
      },
      {
        en: "Saya bayar tunai saja, ya.",
        vi: "Tôi chỉ trả tiền mặt thôi nhé.",
        pronunciation_focus: [
          "`bayar tunai` = trả tiền mặt; `saja` = chỉ/thôi.",
          "Lỗi người Việt: hỏi `cash boleh?` nửa Anh nửa Indo. Ở warung, `bayar tunai` là câu an toàn nhất.",
          "Luyện: `Saya bayar tunai.`",
        ],
        pronunciation_focus_en: [
          "`bayar tunai` = pay in cash; `saja` = just/only.",
          "VN-speaker trap: mixed `cash boleh?`. At a stall, `bayar tunai` is the safest phrase.",
          "Drill: `Saya bayar tunai.`",
        ],
      },
      {
        en: "Bisa makan di tempat atau bungkus?",
        vi: "Có thể ăn tại chỗ hay gói mang đi không?",
        pronunciation_focus: [
          "`makan di tempat` = ăn tại chỗ; `bungkus` = gói mang đi.",
          "Lỗi người Việt: hỏi `take away` mọi lúc. Trong warung, `bungkus` rất tự nhiên.",
          "Luyện: `Makan di tempat atau bungkus?`",
        ],
        pronunciation_focus_en: [
          "`makan di tempat` = eat on site; `bungkus` = wrap/take away.",
          "VN-speaker trap: using `take away` all the time. At a stall, `bungkus` is very natural.",
          "Drill: `Makan di tempat atau bungkus?`",
        ],
      },
      {
        en: "Nasinya boleh tambah sedikit?",
        vi: "Cơm có thể thêm một chút không?",
        pronunciation_focus: [
          "`nasi` = cơm; `tambah sedikit` = thêm một chút.",
          "`boleh` hỏi xin phép/được phép. Câu này lịch sự và rất đời thường.",
          "Lỗi người Việt: bỏ chủ ngữ/cụm danh từ, nói `tambah nasi?` vẫn hiểu nhưng `Nasinya boleh tambah sedikit?` mềm hơn.",
        ],
        pronunciation_focus_en: [
          "`nasi` = rice; `tambah sedikit` = add a little more.",
          "`boleh` asks permission; this sounds polite and very natural.",
          "VN-speaker trap: dropping the noun phrase and saying only `tambah nasi?`. It is understood, but `Nasinya boleh tambah sedikit?` is softer.",
        ],
      },
      {
        en: "Kalau lauk habis, saya ganti telur saja.",
        vi: "Nếu món mặn hết rồi, tôi đổi sang trứng thôi.",
        pronunciation_focus: [
          "`lauk habis` = món mặn hết; `ganti` = đổi sang.",
          "`saja` ở cuối câu làm ý nghĩa nghe nhẹ và thực tế hơn.",
          "Lỗi người Việt: nói `kalau habis` mà không rõ món gì. `Lauk habis` giúp câu cụ thể hơn.",
        ],
        pronunciation_focus_en: [
          "`lauk habis` = the side dish is sold out; `ganti` = switch/change to.",
          "`saja` at the end makes the sentence lighter and more practical.",
          "VN-speaker trap: saying `kalau habis` without naming what is sold out. `Lauk habis` makes it specific.",
        ],
      },
    ],
    cultural_notes_vi:
      "Warung pinggir jalan adalah bagian penting dari kehidupan sehari-hari di Indonesia. Orang sering memesan nasi bungkus, lauk, sambal, teh manis, dan bayar tunai. Kalau makan di tempat, pelanggan biasanya duduk sederhana dan bicara langsung dengan penjual. Bahasa yang sopan dan singkat sering paling efektif.",
    cultural_notes_en:
      "Roadside food stalls are an important part of daily life in Indonesia. People often order packed rice, side dishes, sambal, sweet tea, and pay in cash. When eating there, customers usually sit simply and speak directly with the vendor. Polite and short language is often the most effective.",
    tip_advice_vi:
      "Mẫu rất hữu ích: `Boleh pesan ...?`, `Jangan terlalu pedas`, `Bayar tunai saja`, `Makan di tempat atau bungkus?`, `Nasinya boleh tambah sedikit?` Trong warung, `bungkus` thường được hiểu ngay là gói mang đi.",
    tip_advice_en:
      "Very useful patterns: `Boleh pesan ...?`, `Jangan terlalu pedas`, `Bayar tunai saja`, `Makan di tempat atau bungkus?`, `Nasinya boleh tambah sedikit?` At a stall, `bungkus` is usually understood immediately as takeaway.",
    vocabulary: [
      {
        word: "warung pinggir jalan",
        en: "roadside food stall",
        vi: "quán ven đường",
        pos: "noun phrase",
        pronunciation_vi: "WA-rung ping-GIR JA-lan",
        pronunciation_en: "WA-rung PEENG-geer JA-lan",
      },
      {
        word: "nasi bungkus",
        en: "packed rice meal",
        vi: "cơm gói mang đi",
        pos: "noun phrase",
        pronunciation_vi: "NA-si BUNG-kus",
        pronunciation_en: "NA-see BOONG-koos",
      },
      {
        word: "lauk",
        en: "side dish; savory dish",
        vi: "món mặn",
        pos: "noun",
        pronunciation_vi: "LA-uk",
        pronunciation_en: "LA-ook",
      },
      {
        word: "sambal",
        en: "chili sauce / chili paste",
        vi: "sa tế / sốt ớt",
        pos: "noun",
        pronunciation_vi: "SAM-bal",
        pronunciation_en: "SAM-bahl",
      },
      {
        word: "teh manis",
        en: "sweet tea",
        vi: "trà ngọt",
        pos: "noun phrase",
        pronunciation_vi: "TEH MA-nis",
        pronunciation_en: "TEH MA-nees",
      },
      {
        word: "bayar tunai",
        en: "pay in cash",
        vi: "trả tiền mặt",
        pos: "verb phrase",
        pronunciation_vi: "BA-yar TU-nai",
        pronunciation_en: "BA-yar TOO-nai",
      },
      {
        word: "makan di tempat",
        en: "eat on site",
        vi: "ăn tại chỗ",
        pos: "verb phrase",
        pronunciation_vi: "MA-kan di TEM-pat",
        pronunciation_en: "MA-kan dee TEM-pat",
      },
      {
        word: "bungkus",
        en: "take away; wrap",
        vi: "gói mang đi",
        pos: "verb / noun",
        pronunciation_vi: "BUNG-kus",
        pronunciation_en: "BOONG-koos",
      },
      {
        word: "pedas",
        en: "spicy",
        vi: "cay",
        pos: "adjective",
        pronunciation_vi: "PE-das",
        pronunciation_en: "PEH-das",
      },
      {
        word: "tambah",
        en: "add more",
        vi: "thêm",
        pos: "verb",
        pronunciation_vi: "TAM-bah",
        pronunciation_en: "TAM-bah",
      },
    ],
    dialogue: [
      {
        speaker: "Pelanggan",
        text: "Boleh pesan nasi bungkus satu?",
        vi: "Tôi có thể gọi một phần cơm gói không?",
        en: "May I order one packed rice meal?",
      },
      {
        speaker: "Penjual",
        text: "Boleh. Lauknya apa?",
        vi: "Được chứ. Món mặn là gì ạ?",
        en: "Sure. What side dish would you like?",
      },
      {
        speaker: "Pelanggan",
        text: "Saya mau ayam goreng, sambal sedikit saja, dan teh manis dingin.",
        vi: "Tôi muốn gà rán, một ít sambal thôi, và trà ngọt đá.",
        en: "I want fried chicken, just a little sambal, and iced sweet tea.",
      },
      {
        speaker: "Penjual",
        text: "Makan di tempat atau bungkus?",
        vi: "Ăn tại chỗ hay gói mang đi?",
        en: "Eat here or take away?",
      },
      {
        speaker: "Pelanggan",
        text: "Makan di tempat. Saya bayar tunai saja.",
        vi: "Ăn tại chỗ. Tôi chỉ trả tiền mặt thôi.",
        en: "Eat here. I will pay in cash only.",
      },
      {
        speaker: "Penjual",
        text: "Baik, nasinya boleh tambah sedikit?",
        vi: "Được, cơm có thể thêm một chút không?",
        en: "Okay, would you like a little more rice?",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt: "Dich sang tieng Indonesia: 'Tôi muốn ăn ở quán ven đường đó.'",
        answer: "Saya mau makan di warung pinggir jalan itu.",
        explanation_vi: "Dung `warung pinggir jalan` de noi quan ven duong.",
        explanation_en: "Use `warung pinggir jalan` for a roadside stall.",
      },
      {
        type: "fill_blank",
        prompt: "Dien tu dung: Saya bayar ____ saja.",
        answer: "tunai",
        explanation_vi: "Cum co dinh la `bayar tunai` = tra tien mat.",
        explanation_en: "The fixed phrase is `bayar tunai` = pay in cash.",
      },
      {
        type: "choice",
        prompt: "Cau nao tu nhien hon khi hoi mang ve?",
        answer: "Makan di tempat atau bungkus?",
        explanation_vi: "Bungkus la cach noi pho bien cho mang di.",
        explanation_en: "`Bungkus` is the common natural word for takeaway.",
      },
      {
        type: "roleplay",
        prompt: "Dong vai khach va nguoi ban o warung. No ve nasi bungkus, lauk, sambal, teh manis, bayar tunai, va makan di tempat.",
        answer: "Boleh pesan nasi bungkus satu? Lauknya apa yang paling enak hari ini? Saya mau sambal sedikit saja. Makan di tempat. Saya bayar tunai saja.",
        explanation_vi: "Giu cau ngan, ro, va lich su khi order do an duong pho.",
        explanation_en: "Keep the order short, clear, and polite for street food.",
      },
    ],
  },
];
