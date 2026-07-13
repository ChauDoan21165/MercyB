// Parenting screen time Indonesian (Vietnamese -> Indonesian study track).
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
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type DialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type Exercise = Record<string, unknown>;

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
    id: "indonesian_parenting_screen_time",
    level: "B1",
    category: "family",
    title_vi: "Quản lý thời gian màn hình của trẻ",
    title_en: "Parenting screen time",
    sentences: [
      {
        en: "Anak saya main HP terlalu lama hari ini.",
        vi: "Con tôi dùng điện thoại quá lâu hôm nay.",
        pronunciation_focus: [
          "`main HP` = dùng điện thoại / nghịch điện thoại; cách nói rất phổ biến với anak.",
          "`terlalu lama` = quá lâu; dùng để nói thời gian màn hình quá nhiều.",
          "Lỗi người Việt: dùng `bermain HP` kiểu sách vở. Trong percakapan keluarga, `main HP` lebih natural.",
        ],
        pronunciation_focus_en: [
          "`main HP` = using the phone; very common when talking about children.",
          "`terlalu lama` = too long; used to talk about excessive screen time.",
          "VN-speaker trap: using overly formal `bermain HP`. In family conversation, `main HP` sounds more natural.",
        ],
      },
      {
        en: "Kami punya aturan rumah tentang waktu layar.",
        vi: "Nhà tôi có quy định về thời gian màn hình.",
        pronunciation_focus: [
          "`aturan rumah` = quy tắc trong nhà; `waktu layar` = thời gian dùng màn hình.",
          "Lỗi người Việt: dịch `screen time` thành `waktu screen`. Trong tiếng Indonesia, `waktu layar` atau `lama main HP` lebih tự nhiên.",
          "Luyện: `Aturan rumah tentang waktu layar.`",
        ],
        pronunciation_focus_en: [
          "`aturan rumah` = house rules; `waktu layar` = screen time.",
          "VN-speaker trap: translating `screen time` as `waktu screen`. In Indonesian, `waktu layar` or `lama main HP` is more natural.",
          "Drill: `Aturan rumah tentang waktu layar.`",
        ],
      },
      {
        en: "Saya minta anak belajar dulu sebelum nonton.",
        vi: "Tôi bảo con học trước rồi mới xem.",
        pronunciation_focus: [
          "`minta anak belajar dulu` = yêu cầu con học trước; `dulu` = trước đã.",
          "Lỗi người Việt: dùng `harus belajar` quá cứng trong mọi câu. `Minta` nghe tự nhiên hơn dalam keluarga.",
          "Luyện: `Belajar dulu sebelum nonton.`",
        ],
        pronunciation_focus_en: [
          "`minta anak belajar dulu` = ask the child to study first; `dulu` = first/before anything else.",
          "VN-speaker trap: using `harus belajar` too rigidly in every sentence. `Minta` sounds more natural in family talk.",
          "Drill: `Belajar dulu sebelum nonton.`",
        ],
      },
      {
        en: "Kalau malam, HP harus dimatikan supaya bisa tidur lebih cepat.",
        vi: "Ban đêm, điện thoại phải tắt để có thể ngủ nhanh hơn.",
        pronunciation_focus: [
          "`harus dimatikan` = phải được tắt; dạng bị động rất hay trong quy định rumah.",
          "`supaya bisa tidur` = để có thể ngủ; mục đích rất jelas.",
          "Lỗi người Việt: chỉ nói `matikan HP`. Ở aturan keluarga, `harus dimatikan` terdengar lebih tegas.",
        ],
        pronunciation_focus_en: [
          "`harus dimatikan` = must be turned off; passive form is very common in house rules.",
          "`supaya bisa tidur` = so that (the child) can sleep; a clear purpose clause.",
          "VN-speaker trap: only saying `matikan HP`. In family rules, `harus dimatikan` sounds firmer.",
        ],
      },
      {
        en: "Konten yang ditonton harus aman untuk anak.",
        vi: "Nội dung xem phải an toàn cho trẻ.",
        pronunciation_focus: [
          "`konten yang ditonton` = nội dung được xem; dạng bị động làm câu nghe tự nhiên.",
          "`aman untuk anak` = an toàn cho trẻ; câu rất hữu ích ketika memilih video.",
          "Lỗi người Việt: nói `konten bagus` quá umum. `Aman untuk anak` là tiêu chí rõ hơn.",
        ],
        pronunciation_focus_en: [
          "`konten yang ditonton` = content that is watched; passive form feels natural.",
          "`aman untuk anak` = safe for children; very useful when choosing videos.",
          "VN-speaker trap: using vague `konten bagus`. `Aman untuk anak` is a clearer criterion.",
        ],
      },
      {
        en: "Saya setuju belajar online, tetapi waktunya perlu dibatasi.",
        vi: "Tôi đồng ý học online, nhưng thời gian cần được giới hạn.",
        pronunciation_focus: [
          "`belajar online` = học online; `tetapi` = nhưng; `perlu dibatasi` = cần được giới hạn.",
          "Lỗi người Việt: nói `dibates` kiểu tiếng Việt. Dùng `dibatasi` đúng dan natural.",
          "Luyện: `Waktunya perlu dibatasi.`",
        ],
        pronunciation_focus_en: [
          "`belajar online` = online learning; `tetapi` = but; `perlu dibatasi` = needs to be limited.",
          "VN-speaker trap: using Vietnamese-style `dibates`. The correct form is `dibatasi`.",
          "Drill: `Waktunya perlu dibatasi.`",
        ],
      },
      {
        en: "Anak saya biasanya lebih rewel kalau kurang tidur.",
        vi: "Con tôi thường khó chịu hơn nếu ngủ thiếu.",
        pronunciation_focus: [
          "`biasanya` = thường; `rewel` = quấy/khó chịu; `kurang tidur` = ngủ thiếu.",
          "Mẹo: tidur cukup sering jadi alasan utama screen time harus dibatasi.",
          "Lỗi người Việt: nói `capek` saja. `Kurang tidur` cụ thể hơn untuk kebiasaan dan perilaku.",
        ],
        pronunciation_focus_en: [
          "`biasanya` = usually; `rewel` = cranky/fussy; `kurang tidur` = not enough sleep.",
          "Tip: enough sleep is often the main reason screen time should be limited.",
          "VN-speaker trap: only saying `capek`. `Kurang tidur` is more specific for habits and behavior.",
        ],
      },
      {
        en: "Kalau boleh, kita buat jadwal tanpa HP satu jam sebelum tidur.",
        vi: "Nếu được, mình đặt lịch một giờ không dùng điện thoại trước khi ngủ.",
        pronunciation_focus: [
          "`Kalau boleh` = nếu được/cho phép; `tanpa HP` = không dùng điện thoại.",
          "`satu jam sebelum tidur` = một giờ trước khi ngủ; rutinitas yang sangat praktis.",
          "Lỗi người Việt: nói `no phone time` lẫn tiếng Anh. `tanpa HP` là ngắn và alami.",
        ],
        pronunciation_focus_en: [
          "`Kalau boleh` = if allowed; `tanpa HP` = without phone.",
          "`satu jam sebelum tidur` = one hour before sleep; a very practical routine.",
          "VN-speaker trap: mixing in `no phone time`. `tanpa HP` is short and natural.",
        ],
      },
      {
        en: "Saya ingin bicara dengan anak saya secara lembut, bukan memarahi.",
        vi: "Tôi muốn nói với con một cách nhẹ nhàng, chứ không quát mắng.",
        pronunciation_focus: [
          "`secara lembut` = một cách nhẹ nhàng; `memarahi` = la mắng.",
          "Mẹo: untuk parenting, kalimat lembut sering lebih efektif daripada larangan keras.",
          "Lỗi người Việt: dùng `marah` terus. `Memarahi` menunjukkan hành động la mắng, còn `lembut` giữ hubungan tốt.",
        ],
        pronunciation_focus_en: [
          "`secara lembut` = gently; `memarahi` = scold.",
          "Tip: for parenting, gentle sentences are often more effective than harsh bans.",
          "VN-speaker trap: using `marah` all the time. `Memarahi` shows the act of scolding, while `lembut` keeps the relationship better.",
        ],
      },
      {
        en: "Kami akan beri contoh, supaya anak lebih mudah mengikuti aturan.",
        vi: "Chúng tôi sẽ làm gương, để con dễ làm theo quy định hơn.",
        pronunciation_focus: [
          "`beri contoh` = làm gương / đưa ví dụ; `mengikuti aturan` = làm theo quy định.",
          "`supaya` = để; rất hữu ích khi giải thích mục tiêu của một quy tắc.",
          "Lỗi người Việt: chỉ cấm trẻ mà không làm mẫu. Di Indonesia, `beri contoh` rất penting dalam parenting.",
        ],
        pronunciation_focus_en: [
          "`beri contoh` = set an example; `mengikuti aturan` = follow the rules.",
          "`supaya` = so that; useful when explaining the purpose of a rule.",
          "VN-speaker trap: only forbidding the child without modeling the behavior. In Indonesia, `beri contoh` is important in parenting.",
        ],
      },
    ],
    cultural_notes_vi:
      "Di Indonesia, orang tua sering membahas `waktu layar` bersama aturan rumah, tidur malam, dan tugas sekolah. `Main HP` adalah ungkapan biasa untuk memakai handphone, dan bukan selalu berarti bermain game. Untuk anak, pendekatan yang lembut dan konsisten biasanya lebih efektif daripada larangan mendadak. Dalam keluarga, `tanpa HP sebelum tidur` atau `jam belajar` adalah istilah yang sering dipakai.",
    cultural_notes_en:
      "In Indonesia, parents often discuss `screen time` together with house rules, bedtime, and schoolwork. `Main HP` is a common phrase for using a phone, not necessarily only playing games. For children, a gentle and consistent approach is usually more effective than sudden bans. In families, `tanpa HP sebelum tidur` or `jam belajar` are commonly used terms.",
    tip_advice_vi:
      "Mẫu rất hữu ích: `aturan rumah`, `harus dimatikan`, `konten aman`, `kurang tidur`, `tanpa HP`, `beri contoh`. Trong lời khuyên cho con, dùng `supaya` để nói mục đích: `Supaya bisa tidur lebih cepat`.",
    tip_advice_en:
      "Very useful patterns: `aturan rumah`, `harus dimatikan`, `konten aman`, `kurang tidur`, `tanpa HP`, `beri contoh`. In advice to children, use `supaya` to express purpose: `Supaya bisa tidur lebih cepat`.",
    vocabulary: [
      {
        cell_id: "548b4b86-28b4-4eae-8abc-ee9ba61fa791",
        word: "waktu layar",
        en: "screen time",
        vi: "thời gian màn hình",
        pos: "noun phrase",
        pronunciation_vi: "WAK-tu LA-yar",
        pronunciation_en: "WAK-too LAH-yar",
      },
      {
        cell_id: "e058cac4-9861-4aa4-afdc-88415024c9fb",
        word: "aturan rumah",
        en: "house rules",
        vi: "quy tắc trong nhà",
        pos: "noun phrase",
        pronunciation_vi: "a-TU-ran RU-mah",
        pronunciation_en: "a-TOO-ran ROO-mah",
      },
      {
        cell_id: "40f18299-943b-465b-b703-b8f0f73886ae",
        word: "main HP",
        en: "use the phone; play on the phone",
        vi: "dùng điện thoại",
        pos: "verb phrase",
        pronunciation_vi: "MAIN HA-PE",
        pronunciation_en: "main AYCH-PEE",
      },
      {
        cell_id: "39abdb17-0ca6-4953-88b8-6a3188d063b3",
        word: "konten aman",
        en: "safe content",
        vi: "nội dung an toàn",
        pos: "noun phrase",
        pronunciation_vi: "KON-ten A-man",
        pronunciation_en: "KON-ten A-man",
      },
      {
        cell_id: "f77ed016-b427-4c73-93b6-23f6a3e1415d",
        word: "kurang tidur",
        en: "sleep deprivation / not enough sleep",
        vi: "ngủ thiếu",
        pos: "phrase",
        pronunciation_vi: "KU-rang TI-dur",
        pronunciation_en: "KOO-rang TEE-door",
      },
      {
        cell_id: "a7b1ce31-8920-405b-a3cf-bce66fcadab3",
        word: "tanpa HP",
        en: "without a phone",
        vi: "không dùng điện thoại",
        pos: "phrase",
        pronunciation_vi: "TAN-pa HA-PE",
        pronunciation_en: "TAN-pa AYCH-PEE",
      },
      {
        cell_id: "a810a0dd-9f81-4763-84bf-ffa6710add02",
        word: "beri contoh",
        en: "set an example",
        vi: "làm gương",
        pos: "verb phrase",
        pronunciation_vi: "BE-ri CON-toh",
        pronunciation_en: "BEH-ree CON-toh",
      },
      {
        cell_id: "b008718e-2e35-4b31-8869-e8cafd8889f6",
        word: "memarahi",
        en: "to scold",
        vi: "la mắng",
        pos: "verb",
        pronunciation_vi: "me-ma-RA-hi",
        pronunciation_en: "meh-ma-RAH-hee",
      },
      {
        cell_id: "a1d09a8e-7045-419f-baf3-4e52fe70ca1c",
        word: "belajar online",
        en: "online learning",
        vi: "học online",
        pos: "noun phrase",
        pronunciation_vi: "be-la-JAR ON-lain",
        pronunciation_en: "beh-la-JAHR ON-line",
      },
      {
        cell_id: "5ad5e84e-7723-4eae-90ac-5a4337a2c1a1",
        word: "supaya",
        en: "so that",
        vi: "để",
        pos: "conjunction",
        pronunciation_vi: "su-PA-ya",
        pronunciation_en: "soo-PAH-yah",
      },
    ],
    dialogue: [
      {
        cell_id: "2743d0e8-6243-4caf-87f2-25a49008e941",
        speaker: "Ibu",
        text: "Anak saya main HP terlalu lama hari ini.",
        vi: "Con tôi dùng điện thoại quá lâu hôm nay.",
        en: "My child used the phone for too long today.",
      },
      {
        cell_id: "e1c38331-ea70-4be8-b5ab-b4bab6eb2282",
        speaker: "Ayah",
        text: "Kita punya aturan rumah tentang waktu layar, kan?",
        vi: "Nhà mình có quy định về thời gian màn hình mà, đúng không?",
        en: "We have house rules about screen time, right?",
      },
      {
        cell_id: "c74f6e00-87b1-4a66-8d26-fc7966a7dcf6",
        speaker: "Ibu",
        text: "Iya, saya minta dia belajar dulu sebelum nonton.",
        vi: "Ừ, tôi bảo con học trước rồi mới xem.",
        en: "Yes, I ask them to study first before watching.",
      },
      {
        cell_id: "240eab9c-f3b6-4d3b-b55e-9352241a53b4",
        speaker: "Ayah",
        text: "Malam ini HP harus dimatikan supaya bisa tidur lebih cepat.",
        vi: "Tối nay điện thoại phải tắt để có thể ngủ nhanh hơn.",
        en: "Tonight the phone has to be turned off so they can sleep faster.",
      },
      {
        cell_id: "afe6ee3b-06f4-4ead-9004-dbbe1a2637b7",
        speaker: "Ibu",
        text: "Baik, kita beri contoh juga, supaya anak lebih mudah mengikuti aturan.",
        vi: "Được, mình cũng làm gương để con dễ làm theo quy định hơn.",
        en: "Okay, we should also set an example so the child can follow the rules more easily.",
      },
      {
        cell_id: "270998a2-b68f-4294-b991-fd4e4cf9877a",
        speaker: "Ayah",
        text: "Setuju. Kita buat jadwal tanpa HP satu jam sebelum tidur.",
        vi: "Đồng ý. Mình đặt lịch một giờ không dùng điện thoại trước khi ngủ.",
        en: "Agreed. Let's make a no-phone schedule one hour before bedtime.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt: "Dich sang tieng Indonesia: 'Nhà tôi có quy định về thời gian màn hình.'",
        answer: "Kami punya aturan rumah tentang waktu layar.",
        explanation_vi: "Dung `aturan rumah` va `waktu layar` de noi ro.",
        explanation_en: "Use `aturan rumah` and `waktu layar` to state the rule clearly.",
      },
      {
        type: "fill_blank",
        prompt: "Dien tu dung: HP harus ____ supaya bisa tidur lebih cepat.",
        answer: "dimatikan",
        explanation_vi: "Hanh dong phai duoc tat dung dang bi dong `di-`.",
        explanation_en: "Use the passive form `dimatikan` for must be turned off.",
      },
      {
        type: "choice",
        prompt: "Cau nao tu nhien hon khi noi ve doi song gia dinh?",
        answer: "Anak saya main HP terlalu lama hari ini.",
        explanation_vi: "`Main HP` la cach noi rat pho bien trong gia dinh.",
        explanation_en: "`Main HP` is a very common family phrase.",
      },
      {
        type: "roleplay",
        prompt: "Dong vai bo me va noi ve aturannya: waktu layar, belajar online, tidur, konten aman, va beri contoh.",
        answer: "Kami punya aturan rumah tentang waktu layar. Anak belajar dulu sebelum nonton. HP harus dimatikan satu jam sebelum tidur. Kami juga beri contoh supaya anak lebih mudah mengikuti aturan.",
        explanation_vi: "Giu cau ngan, ro, va mem.",
        explanation_en: "Keep the sentences short, clear, and gentle.",
      },
    ],
  },
];
