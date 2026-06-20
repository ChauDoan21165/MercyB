// Motorbike Taxi Safety Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file following the established Indonesian extra
// format. The `en` field holds TARGET-LANGUAGE Indonesian, `vi` holds the
// Vietnamese gloss, and pronunciation_focus carries Vietnamese L1 notes with
// English companion explanations in the same order.

type LessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar/culture notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
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

export const motorbikeTaxiSafetyLessons: IndonesianLesson[] = [
  {
    id: "indonesian_motorbike_taxi_safety",
    level: "B1",
    category: "transport",
    title_vi: "Đi ojek an toàn: mũ bảo hiểm, điểm đón và chia sẻ vị trí",
    title_en: "Safe ojek rides: helmet, pickup point and location sharing",
    sentences: [
      {
        en: "Saya mau naik ojek, tapi saya pilih lokasi jemput yang terang.",
        vi: "Tôi muốn đi xe ôm, nhưng tôi chọn điểm đón sáng sủa.",
        pronunciation_focus: [
          "`naik ojek` = đi xe ôm/xe ôm công nghệ; `naik` dùng cho lên xe và đi phương tiện.",
          "`lokasi jemput` = điểm đón; trong app cũng hay thấy `titik jemput`.",
          "Lỗi người Việt: dùng `di lokasi` khi nói hướng. Ở đây `pilih lokasi jemput` là chọn điểm đón, không cần `di`.",
        ],
        pronunciation_focus_en: [
          "`naik ojek` means taking a motorbike taxi; `naik` is used for boarding and using transport.",
          "`lokasi jemput` means pickup location; apps also often use `titik jemput`.",
          "VN-speaker trap: adding `di` when talking about choosing a place. Here `pilih lokasi jemput` needs no `di`.",
        ],
      },
      {
        en: "Pak, tolong tunggu di depan minimarket, bukan di gang kecil.",
        vi: "Anh ơi, làm ơn chờ trước cửa hàng tiện lợi, không phải trong hẻm nhỏ.",
        pronunciation_focus: [
          "`di depan minimarket` = trước cửa hàng tiện lợi; đây là điểm cố định nên dùng `di`.",
          "`gang kecil` = hẻm nhỏ; vào ban đêm nên tránh điểm đón quá vắng hoặc tối.",
          "Lỗi người Việt: lẫn `depan` và `di depan`. Khi chỉ vị trí, nói `di depan ...`.",
        ],
        pronunciation_focus_en: [
          "`di depan minimarket` means in front of the convenience store; it is a fixed point, so use `di`.",
          "`gang kecil` means a small alley; at night, avoid pickup points that are too quiet or dark.",
          "VN-speaker trap: mixing `depan` and `di depan`. For location, say `di depan ...`.",
        ],
      },
      {
        en: "Saya pakai helm dulu sebelum berangkat.",
        vi: "Tôi đội mũ bảo hiểm trước khi khởi hành.",
        pronunciation_focus: [
          "`pakai helm` = đội mũ bảo hiểm; `pakai` dùng cho mặc, đội, dùng.",
          "`sebelum berangkat` = trước khi đi/khởi hành; cụm rất tự nhiên trong ngữ cảnh đi xe.",
          "Lỗi người Việt: dịch `đội` thành từ riêng. Tiếng Indonesia dùng `pakai helm`, không cần động từ khác.",
        ],
        pronunciation_focus_en: [
          "`pakai helm` means wear a helmet; `pakai` covers wear, put on, and use.",
          "`sebelum berangkat` means before leaving; it is natural in ride contexts.",
          "VN-speaker trap: looking for a separate verb for 'wear on the head'. Indonesian simply says `pakai helm`.",
        ],
      },
      {
        en: "Boleh lewat rute yang lebih aman, meskipun sedikit lebih jauh?",
        vi: "Có thể đi tuyến đường an toàn hơn, dù xa hơn một chút không?",
        pronunciation_focus: [
          "`rute yang lebih aman` = tuyến đường an toàn hơn; `lebih` đặt trước tính từ.",
          "`meskipun sedikit lebih jauh` = dù xa hơn một chút; hữu ích khi ưu tiên an toàn hơn tốc độ.",
          "Lỗi người Việt: dùng `jalan aman` trống. `rute yang lebih aman` rõ hơn khi nói với driver.",
        ],
        pronunciation_focus_en: [
          "`rute yang lebih aman` means a safer route; `lebih` comes before the adjective.",
          "`meskipun sedikit lebih jauh` means even if it is a bit farther; useful when safety matters more than speed.",
          "VN-speaker trap: saying only `jalan aman`. `rute yang lebih aman` is clearer with a driver.",
        ],
      },
      {
        en: "Tarif di aplikasi sudah termasuk biaya parkir belum?",
        vi: "Giá cước trên ứng dụng đã bao gồm phí gửi xe/chỗ đậu xe chưa?",
        pronunciation_focus: [
          "`tarif di aplikasi` = giá cước trong app; với xe/app, `tarif` tự nhiên hơn `harga`.",
          "`sudah termasuk ... belum?` = đã bao gồm ... chưa? Đây là khung hỏi rất thực tế.",
          "Lỗi người Việt: hỏi `sudah termasuk tidak?`. Với 'đã...chưa', dùng `belum`, không dùng `tidak`.",
        ],
        pronunciation_focus_en: [
          "`tarif di aplikasi` means the fare in the app; for rides/apps, `tarif` is more natural than `harga`.",
          "`sudah termasuk ... belum?` means is it already included? This is a very practical question frame.",
          "VN-speaker trap: asking `sudah termasuk tidak?`. For 'already/yet' questions, use `belum`, not `tidak`.",
        ],
      },
      {
        en: "Kalau malam hari, saya berbagi lokasi dengan teman.",
        vi: "Nếu đi ban đêm, tôi chia sẻ vị trí với bạn.",
        pronunciation_focus: [
          "`malam hari` = ban đêm; cụm này rõ hơn chỉ nói `malam` trong lời khuyên an toàn.",
          "`berbagi lokasi` = chia sẻ vị trí; cũng nghe `share lokasi` trong nói chuyện thân mật.",
          "Lỗi người Việt: dịch `chia sẻ` thành `membagi` trong app. Với vị trí, `berbagi lokasi` hoặc `share lokasi` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "`malam hari` means nighttime; this is clearer than only `malam` in safety advice.",
          "`berbagi lokasi` means share location; casual speech may also say `share lokasi`.",
          "VN-speaker trap: translating 'share' as `membagi` in app contexts. For location, `berbagi lokasi` or `share lokasi` is more natural.",
        ],
      },
      {
        en: "Saya cek nama driver dan plat nomor sebelum naik.",
        vi: "Tôi kiểm tra tên tài xế và biển số trước khi lên xe.",
        pronunciation_focus: [
          "`cek nama driver` = kiểm tra tên tài xế; từ mượn `driver` phổ biến trong app.",
          "`plat nomor` = biển số xe; có thể nói `nomor polisi`, nhưng `plat nomor` rất thông dụng.",
          "Lỗi người Việt: nói `nomor motor` cho biển số. Từ đúng là `plat nomor`.",
        ],
        pronunciation_focus_en: [
          "`cek nama driver` means check the driver's name; the loanword `driver` is common in app contexts.",
          "`plat nomor` means vehicle plate number; `nomor polisi` is also possible, but `plat nomor` is very common.",
          "VN-speaker trap: saying `nomor motor` for license plate. The right phrase is `plat nomor`.",
        ],
      },
      {
        en: "Tolong jangan ngebut, saya tidak terburu-buru.",
        vi: "Làm ơn đừng chạy nhanh quá, tôi không vội.",
        pronunciation_focus: [
          "`ngebut` = chạy nhanh/phóng nhanh, khẩu ngữ nhưng rất tự nhiên khi nhắc tài xế.",
          "`tidak terburu-buru` = không vội; câu này làm yêu cầu nghe mềm hơn.",
          "Lỗi người Việt: nói `jangan cepat` nghe thiếu tự nhiên. Nói `jangan ngebut` khi muốn tài xế chạy chậm lại.",
        ],
        pronunciation_focus_en: [
          "`ngebut` means speeding; it is colloquial but very natural when reminding a driver.",
          "`tidak terburu-buru` means not in a hurry; it softens the request.",
          "VN-speaker trap: saying `jangan cepat`, which sounds unnatural. Say `jangan ngebut` when asking the driver not to speed.",
        ],
      },
      {
        en: "Kalau rutenya berubah, tolong beri tahu saya dulu.",
        vi: "Nếu tuyến đường thay đổi, vui lòng báo cho tôi trước.",
        pronunciation_focus: [
          "`rutenya berubah` = tuyến đường thay đổi; `-nya` chỉ chuyến/rute đang nói.",
          "`beri tahu saya dulu` = báo cho tôi trước; lịch sự và rõ hơn `bilang dulu` trong tình huống an toàn.",
          "Lỗi người Việt: bỏ `dulu`. Thêm `dulu` nhấn mạnh hãy nói trước khi đổi đường.",
        ],
        pronunciation_focus_en: [
          "`rutenya berubah` means the route changes; `-nya` points to the route being discussed.",
          "`beri tahu saya dulu` means tell me first; it is clearer and more polite than `bilang dulu` in safety contexts.",
          "VN-speaker trap: dropping `dulu`. Adding `dulu` emphasizes telling you before changing route.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ojek online như Gojek/Grab rất phổ biến ở Indonesia, nhưng người đi nên vẫn kiểm tra an toàn cơ bản: xác nhận nama driver và plat nomor, chọn lokasi jemput sáng và dễ thấy, luôn pakai helm, theo dõi rute di aplikasi, và berbagi lokasi khi đi malam hari. Nếu tài xế chạy quá nhanh, nói thẳng nhưng lịch sự: `Tolong jangan ngebut, saya tidak terburu-buru.` Với điểm đón ban đêm, chọn minimarket, lobi, pos satpam, hoặc nơi có nhiều người thay vì gang kecil.",
    cultural_notes_en:
      "Online ojek services such as Gojek/Grab are very common in Indonesia, but riders should still do basic safety checks: confirm the driver's name and plate number, choose a bright and visible pickup point, always wear a helmet, follow the app route, and share location when traveling at night. If the driver speeds, say directly but politely: `Tolong jangan ngebut, saya tidak terburu-buru.` For night pickups, choose a minimarket, lobby, security post, or busy place instead of a small alley.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt `di` cho vị trí cố định (`di depan minimarket`) và `ke` cho hướng đi (`ke stasiun`). Khi muốn an toàn hơn, dùng khung mềm nhưng rõ: `Boleh lewat rute yang lebih aman?`, `Tolong beri tahu saya dulu`, `Tolong jangan ngebut`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: distinguish `di` for fixed location (`di depan minimarket`) and `ke` for direction (`ke stasiun`). For safer rides, use polite but clear frames: `Boleh lewat rute yang lebih aman?`, `Tolong beri tahu saya dulu`, `Tolong jangan ngebut`.",
    vocabulary: [
      {
        word: "naik ojek",
        en: "take a motorbike taxi",
        vi: "đi xe ôm",
        pos: "verb phrase",
        pronunciation_vi: "NA-ik O-jek",
        pronunciation_en: "NA-ik OH-jek",
      },
      {
        word: "lokasi jemput",
        en: "pickup location",
        vi: "điểm đón",
        pos: "noun phrase",
        pronunciation_vi: "lo-KA-si JEM-put",
        pronunciation_en: "lo-KA-see JEM-poot",
      },
      {
        word: "helm",
        en: "helmet",
        vi: "mũ bảo hiểm",
        pos: "noun",
        pronunciation_vi: "helm",
        pronunciation_en: "helm",
      },
      {
        word: "rute aman",
        en: "safe route",
        vi: "tuyến đường an toàn",
        pos: "noun phrase",
        pronunciation_vi: "RU-te A-man",
        pronunciation_en: "ROO-teh A-man",
      },
      {
        word: "tarif",
        en: "fare",
        vi: "giá cước",
        pos: "noun",
        pronunciation_vi: "TA-rif",
        pronunciation_en: "TA-rif",
      },
      {
        word: "malam hari",
        en: "nighttime",
        vi: "ban đêm",
        pos: "noun phrase",
        pronunciation_vi: "MA-lam HA-ri",
        pronunciation_en: "MA-lam HA-ree",
      },
      {
        word: "berbagi lokasi",
        en: "share location",
        vi: "chia sẻ vị trí",
        pos: "verb phrase",
        pronunciation_vi: "ber-BA-gi lo-KA-si",
        pronunciation_en: "ber-BA-gee lo-KA-see",
      },
      {
        word: "plat nomor",
        en: "license plate",
        vi: "biển số xe",
        pos: "noun phrase",
        pronunciation_vi: "plat NO-mor",
        pronunciation_en: "plat NO-mor",
      },
    ],
    dialogue: [
      {
        speaker: "Penumpang",
        text: "Pak, tolong tunggu di depan minimarket, ya.",
        vi: "Anh ơi, làm ơn chờ trước cửa hàng tiện lợi nhé.",
        en: "Sir, please wait in front of the minimarket.",
      },
      {
        speaker: "Driver",
        text: "Baik. Saya sudah dekat. Pakai helm dulu sebelum naik.",
        vi: "Vâng. Tôi gần tới rồi. Đội mũ bảo hiểm trước khi lên nhé.",
        en: "Okay. I am nearby. Put on the helmet before getting on.",
      },
      {
        speaker: "Penumpang",
        text: "Saya sudah cek plat nomor. Kalau bisa, lewat rute yang lebih aman.",
        vi: "Tôi đã kiểm tra biển số. Nếu được, đi tuyến đường an toàn hơn.",
        en: "I have checked the plate number. If possible, take the safer route.",
      },
      {
        speaker: "Driver",
        text: "Bisa. Rutenya sedikit lebih jauh, tapi jalannya lebih ramai.",
        vi: "Được. Tuyến đó xa hơn một chút, nhưng đường đông người hơn.",
        en: "Sure. The route is a bit farther, but the road is busier.",
      },
      {
        speaker: "Penumpang",
        text: "Terima kasih. Saya juga berbagi lokasi dengan teman.",
        vi: "Cảm ơn. Tôi cũng chia sẻ vị trí với bạn.",
        en: "Thank you. I am also sharing my location with a friend.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi chọn điểm đón sáng sủa.",
        prompt_en: "Translate into Indonesian: I choose a bright pickup location.",
        answer: "Saya pilih lokasi jemput yang terang.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Saya pakai ___ dulu sebelum berangkat.",
        prompt_en: "Fill in the blank: Saya pakai ___ dulu sebelum berangkat.",
        answer: "helm",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Làm ơn đừng chạy nhanh quá, tôi không vội.",
        prompt_en: "Translate into Indonesian: Please do not speed, I am not in a hurry.",
        answer: "Tolong jangan ngebut, saya tidak terburu-buru.",
      },
      {
        type: "roleplay",
        prompt_vi: "Bạn đi ojek vào ban đêm. Nói bằng tiếng Indonesia rằng bạn chia sẻ vị trí với bạn.",
        prompt_en: "You are taking an ojek at night. Say in Indonesian that you are sharing your location with a friend.",
        answer: "Kalau malam hari, saya berbagi lokasi dengan teman.",
      },
    ],
  },
];
