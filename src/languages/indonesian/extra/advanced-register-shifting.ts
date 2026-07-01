// Advanced Register Shifting Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// register notes with English companions in pronunciation_focus_en.
//
// Topic: adjusting language register (`bahasa formal` vs `bahasa informal`) for
// different situations: close friends, office meetings, superiors, and everyday
// chat. For Vietnamese speakers, the wins are familiar: you already shift register
// in Vietnamese by choosing `anh/chị`, `bạn`, `mày`, or more neutral phrasing.
// The traps: using too much slang with strangers, sounding too blunt, and not
// softening requests when talking to bosses or older people.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
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
  speaker: string;
  /** Indonesian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
  en?: string;
};

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
    id: "indonesian_advanced_register_shifting",
    level: "B2",
    category: "communication",
    title_vi: "Chuyển đổi sắc thái trang trọng và thân mật",
    title_en: "Advanced register shifting",
    sentences: [
      {
        en: "Kalau dengan teman dekat, saya biasanya ngomong lebih santai.",
        vi: "Nếu nói với bạn thân, tôi thường nói thoải mái hơn.",
        pronunciation_focus: [
          "KA-lau de-NGAN te-MAN de-KAT, SA-ya bi-a-SA-nya ngo-MONG LE-bih san-TAI — `teman dekat` = bạn thân; `ngomong` = nói (rất thân mật).",
          "Mẹo: `ngomong` nghe rất đời thường. Với người lạ hoặc trong công việc, nên đổi sang `bicara` hoặc `berbicara`.",
          "Lỗi người Việt: dùng cùng một kiểu nói cho mọi người. Tiếng Indonesia cũng cần đổi register theo quan hệ.",
        ],
        pronunciation_focus_en: [
          "KA-low de-NGAN TEH-man de-KAT, SA-ya bee-AH-sa-nya ngo-MONG LEH-bee san-TAI — `teman dekat` = close friend; `ngomong` = speak/talk (very informal).",
          "Tip: `ngomong` is very casual. With strangers or at work, switch to `bicara` or `berbicara`.",
          "VN-speaker trap: using the same style with everyone. Indonesian also changes register by relationship.",
        ],
      },
      {
        en: "Kalau di kantor, saya pilih bahasa yang lebih rapi.",
        vi: "Nếu ở văn phòng, tôi chọn ngôn ngữ chỉn chu hơn.",
        pronunciation_focus: [
          "KA-lau di KAN-tor, SA-ya pi-LIH ba-HA-sa yang LE-bih RA-pi — `rapi` = gọn gàng/chỉnh chu.",
          "Mẹo: `bahasa yang lebih rapi` là cách nói an toàn trong email, rapat, dan chat kerja.",
          "Lỗi người Việt: nghĩ `rapi` chỉ là quần áo. Trong ngôn ngữ, `rapi` = câu chữ gọn, sạch, rõ.",
        ],
        pronunciation_focus_en: [
          "KA-low di KAN-tor, SA-ya pee-LEE ba-HA-sa yang LEH-bee RA-pee — `rapi` = neat/tidy.",
          "Tip: `bahasa yang lebih rapi` is a safe choice for email, meetings, and work chats.",
          "VN-speaker trap: thinking `rapi` only means clothes. In language, `rapi` means neat, clean, and clear wording.",
        ],
      },
      {
        en: "Mohon tunggu sebentar, saya cek dulu ya.",
        vi: "Xin vui lòng chờ một chút, để tôi kiểm tra trước nhé.",
        pronunciation_focus: [
          "MO-hon TUNG-gu se-BEN-tar, SA-ya cek DU-lu ya — `mohon` = xin vui lòng; `cek dulu` = kiểm tra trước.",
          "Mẹo: thêm `ya` ở cuối làm câu mềm hơn, nhất là trong chat hoặc lời nhắc nhẹ.",
          "Lỗi người Việt: dùng lệnh trần trụi `tunggu sebentar`. Thêm `mohon` nghe lịch sự hơn nhiều.",
        ],
        pronunciation_focus_en: [
          "MO-hon TOONG-goo seh-BEN-tar, SA-ya chek DOO-loo yah — `mohon` = please; `cek dulu` = check first.",
          "Tip: adding `ya` at the end softens the sentence, especially in chat or a gentle reminder.",
          "VN-speaker trap: using bare command `tunggu sebentar`. Add `mohon` to sound much more polite.",
        ],
      },
      {
        en: "Saya tidak mau terdengar terlalu kasar.",
        vi: "Tôi không muốn nghe quá thô/cộc lốc.",
        pronunciation_focus: [
          "SA-ya ti-DAK MAU ter-de-NGAR ter-LA-lu KA-sar — `terdengar` = nghe có vẻ; `kasar` = thô, cộc.",
          "Mẹo: `terdengar` nói về ấn tượng khi người khác nghe mình. Đây là từ rất hữu ích khi tự chỉnh lời nói.",
          "Lỗi người Việt: nghĩ `kasar` chỉ là lời chửi. Trong register, nó còn là giọng điệu cộc hoặc quá trực diện.",
        ],
        pronunciation_focus_en: [
          "SA-ya tee-DAK MOW ter-deh-NGAR ter-LAH-loo KA-sar — `terdengar` = sound/come across as; `kasar` = rough/blunt.",
          "Tip: `terdengar` describes the impression others get from your speech. Very useful for self-monitoring.",
          "VN-speaker trap: thinking `kasar` only means swear words. In register, it also means blunt or too direct.",
        ],
      },
      {
        en: "Kalau bicara dengan atasan, saya pakai nada yang lebih sopan.",
        vi: "Nếu nói chuyện với cấp trên, tôi dùng giọng điệu lịch sự hơn.",
        pronunciation_focus: [
          "KA-lau bi-CA-ra de-NGAN a-TA-san, SA-ya PA-kai NA-da yang LE-bih SO-pan — `atasan` = cấp trên; `nada` = giọng điệu.",
          "Mẹo: `pakai nada yang lebih sopan` rất tự nhiên khi nói về tone, bukan cuma `bahasa sopan`.",
          "Lỗi người Việt: dùng cùng một tone thân mật cho cấp trên. Với atasan, `sopan` dan `tenang` biasanya lebih aman.",
        ],
        pronunciation_focus_en: [
          "KA-low bee-CHAR-ah deh-NGAN ah-TAH-san, SA-ya PA-kai NA-dah yang LEH-bee SOH-pan — `atasan` = superior/boss; `nada` = tone.",
          "Tip: `pakai nada yang lebih sopan` is very natural when talking about tone, not just `bahasa sopan`.",
          "VN-speaker trap: using the same friendly tone with a boss. With superiors, `sopan` and `tenang` are usually safer.",
        ],
      },
      {
        en: "Untuk teman dekat, saya bisa langsung bilang apa adanya.",
        vi: "Với bạn thân, tôi có thể nói thẳng điều mình nghĩ.",
        pronunciation_focus: [
          "UN-tuk te-MAN de-KAT, SA-ya BI-sa LANG-sung bi-LANG a-pa A-da-nya — `apa adanya` = đúng như thật, không vòng vo.",
          "Mẹo: `apa adanya` hợp với teman dekat. Với orang baru, thường cần làm mềm dulu.",
          "Lỗi người Việt: nói thật kiểu `apa adanya` với tất cả mọi người. Điều này có thể quá mạnh trong bối cảnh formal.",
        ],
        pronunciation_focus_en: [
          "UN-took TEH-man deh-KAT, SA-ya BEE-sa LANG-soong bee-LANG ah-pa AH-da-nya — `apa adanya` = as it is, straightforward.",
          "Tip: `apa adanya` works well with close friends. With new people, you usually need to soften first.",
          "VN-speaker trap: being `apa adanya` with everyone. That can be too strong in formal contexts.",
        ],
      },
      {
        en: "Di chat, saya sering singkatkan kata supaya cepat.",
        vi: "Trong chat, tôi thường viết tắt từ cho nhanh.",
        pronunciation_focus: [
          "di chat, SA-ya se-RING sing-KAT-kan KA-ta su-PA-ya CEP-at — `singkatkan` = làm ngắn lại; `supaya cepat` = để nhanh hơn.",
          "Mẹo: chat pribadi cho phép rút gọn; email kerja biasanya nên đầy đủ hơn.",
          "Lỗi người Việt: đem kiểu viết chat vào email resmi. `Singkat` oke di chat, tapi không phải lúc nào cũng cocok.",
        ],
        pronunciation_focus_en: [
          "di chat, SA-ya se-RING sing-KAT-kan KA-ta soo-PAH-yah CHEH-pat — `singkatkan` = shorten; `supaya cepat` = to be faster.",
          "Tip: private chat allows shortcuts; work email is usually better when written out fully.",
          "VN-speaker trap: bringing chat style into formal email. `Singkat` is fine in chat, but not always appropriate.",
        ],
      },
      {
        en: "Kalimat ini terdengar lebih halus kalau kita tambahkan sedikit penyangga.",
        vi: "Câu này nghe mềm hơn nếu chúng ta thêm chút đệm lời.",
        pronunciation_focus: [
          "ka-li-MAT i-NI ter-de-NGAR LE-bih HA-lus ka-lau KI-ta tam-BAH-kan se-DI-kit pe-NYANG-ga — `halus` = mềm, mượt; `penyangga` = phần đệm/đỡ.",
          "Mẹo: `penyangga` di sini bukan benda fisik saja, tetapi kata tambahan yang melembutkan, misalnya `sepertinya`, `mungkin`, `agaknya`.",
          "Lỗi người Việt: nói lurus tanpa đệm, lalu dianggap keras. Tambahkan sedikit `softener` để aman.",
        ],
        pronunciation_focus_en: [
          "kah-LEE-maht ee-NEE ter-deh-NGAR LEH-bee HA-loos kah-low KEE-tah tahm-BAH-kahn seh-DEE-kit pe-NYAHNG-gah — `halus` = smooth/gentle; `penyangga` = buffer/support.",
          "Tip: here `penyangga` is not just a physical support, but a word buffer that softens the message, such as `sepertinya`, `mungkin`, `agaknya`.",
          "VN-speaker trap: speaking too straight with no buffer and sounding harsh. Add a little softener to stay safe.",
        ],
      },
      {
        en: "Saya akan menyesuaikan pilihan kata dengan situasinya.",
        vi: "Tôi sẽ điều chỉnh lựa chọn từ ngữ theo tình huống.",
        pronunciation_focus: [
          "SA-ya A-kan me-nyu-a-I-kan pi-LIH-an KA-ta de-NGAN si-tu-A-si-nya — `menyesuaikan` = điều chỉnh cho phù hợp.",
          "Mẹo: `pilihan kata` là cụm rất hữu ích khi bàn về register, email, pidato, atau obrolan.",
          "Lỗi người Việt: chỉ nghĩ đến ngữ pháp. Thực ra register nhiều khi nằm ở `pilihan kata`, bukan struktur saja.",
        ],
        pronunciation_focus_en: [
          "SA-ya AH-kahn me-nyoo-ah-ee-kahn pee-LEE-han KAH-tah deh-NGAN see-too-AH-see-nyah — `menyesuaikan` = adjust to fit.",
          "Tip: `pilihan kata` is very useful when discussing register, email, speeches, or conversation.",
          "VN-speaker trap: focusing only on grammar. Register often lives in `pilihan kata`, not just structure.",
        ],
      },
      {
        en: "Yang penting, maksudnya tetap jelas meski nadanya berubah.",
        vi: "Điều quan trọng là ý của mình vẫn rõ dù giọng điệu thay đổi.",
        pronunciation_focus: [
          "yang PEN-ting, MAK-sud-nya te-TAP JE-las MES-ki NA-da-nya ber-U-bah — `tetap jelas` = vẫn rõ; `meski` = dù/mặc dù.",
          "Mẹo: register shifting không boleh mengorbankan kejelasan. `Jelas` tetap prioritas.",
          "Lỗi người Việt: terlalu fokus sopan sampai pesan kabur. Tujuannya tetap: jelas + sesuai situasi.",
        ],
        pronunciation_focus_en: [
          "yang PEN-ting, MAHK-sood-nya teh-TAP JEH-las MESS-kee NAH-dah-nyah beh-ROO-bah — `tetap jelas` = still clear; `meski` = even though.",
          "Tip: register shifting should not sacrifice clarity. `Jelas` remains the priority.",
          "VN-speaker trap: focusing so much on politeness that the message becomes vague. The goal is still: clear + suitable.",
        ],
      },
      {
        en: "Kalau ragu, saya mulai netral dulu lalu menyesuaikan.",
        vi: "Nếu phân vân, tôi bắt đầu trung tính trước rồi điều chỉnh sau.",
        pronunciation_focus: [
          "KA-lau RA-gu, SA-ya mu-LAI NE-tral DU-lu LA-lu me-nyu-a-I-kan — `netral` = trung tính; `ragu` = phân vân/không chắc.",
          "Mẹo: memulai netral adalah strategi aman. Setelah lihat lawan bicara, Anda bisa menaikkan atau menurunkan keakraban.",
          "Lỗi người Việt: mở đầu terlalu akrab. Với orang baru, `netral dulu` thường paling aman.",
        ],
        pronunciation_focus_en: [
          "KA-low RAH-goo, SA-ya moo-LAI NEH-tral DOO-loo LAH-loo me-nyoo-ah-ee-kahn — `netral` = neutral; `ragu` = unsure.",
          "Tip: starting neutral is a safe strategy. After seeing the other person, you can raise or lower the level of familiarity.",
          "VN-speaker trap: starting too familiarly. With new people, `netral dulu` is usually the safest.",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong tiếng Indonesia, chuyển register là kỹ năng sống còn. Người nói thường đổi giữa `saya`, `aku`, `gue`, `Anda`, `kamu`, `Bapak/Ibu`, `Mas/Mbak`, và thậm chí `bro` tùy người nghe. Ở kantor, sekolah, layanan publik, dan email, register formal giúp câu nói aman dan profesional. Với teman dekat, register santai membuat obrolan terasa hangat; nhưng với orang baru atau atasan, terlalu santai bisa terdengar kurang sopan. Điều quan trọng nhất không phải là nhớ một từ 'đúng', mà là chọn mức độ thân mật phù hợp.",
    cultural_notes_en:
      "In Indonesian, shifting register is an essential social skill. Speakers move between `saya`, `aku`, `gue`, `Anda`, `kamu`, `Bapak/Ibu`, `Mas/Mbak`, and even `bro` depending on the listener. In offices, schools, public services, and email, formal register makes speech feel safe and professional. With close friends, a relaxed register makes conversation warm; but with new people or superiors, being too casual can sound impolite. The key is not remembering one single 'correct' word, but choosing the right level of familiarity.",
    tip_advice_vi:
      "Mẹo cho người Việt: hãy nghĩ register như nút vặn âm lượng. Khi mới gặp, để mức `netral` trước. Với bạn thân, hạ xuống `santai`. Với atasan, nâng lên `rapi` và `sopan`. Nếu muốn nghe mềm hơn, thêm `mohon`, `mungkin`, `sepertinya`, hoặc `sedikit`. Nếu muốn nghe gần gũi hơn, dùng `ya`, `deh`, `sih`, hoặc cấu trúc ngắn nhưng đừng lạm dụng với người lạ.",
    tip_advice_en:
      "Tip for Vietnamese speakers: think of register like a volume knob. When you first meet someone, start at `netral`. With close friends, turn it down to `santai`. With a boss, turn it up to `rapi` and `sopan`. If you want to sound softer, add `mohon`, `mungkin`, `sepertinya`, or `sedikit`. If you want to sound friendlier, use `ya`, `deh`, `sih`, or short structures, but do not overuse them with strangers.",
    vocabulary: [
      {
        word: "formal",
        en: "formal",
        vi: "trang trọng",
        pos: "adjective",
        pronunciation_vi: "for-MAL — mượn tiếng Anh, rất phổ biến",
        pronunciation_en: "for-MAL — English loanword, very common",
      },
      {
        word: "informal",
        en: "informal",
        vi: "thân mật / không trang trọng",
        pos: "adjective",
        pronunciation_vi: "in-for-MAL — mượn tiếng Anh",
        pronunciation_en: "in-for-MAL — English loanword",
      },
      {
        word: "santai",
        en: "relaxed / casual",
        vi: "thoải mái / xuề xòa",
        pos: "adjective",
        pronunciation_vi: "san-TAI — dùng với teman dekat",
        pronunciation_en: "san-TIE — used with close friends",
      },
      {
        word: "rapi",
        en: "neat / tidy / polished",
        vi: "chỉnh chu / gọn gàng",
        pos: "adjective",
        pronunciation_vi: "RA-pi — bahasa rapi = câu chữ gọn gàng",
        pronunciation_en: "RA-pee — `bahasa rapi` = polished wording",
      },
      {
        word: "netral",
        en: "neutral",
        vi: "trung tính",
        pos: "adjective",
        pronunciation_vi: "NE-tral — pilihan aman saat ragu",
        pronunciation_en: "NE-tral — a safe choice when unsure",
      },
      {
        word: "atasan",
        en: "superior / boss",
        vi: "cấp trên",
        pos: "noun",
        pronunciation_vi: "a-TA-san — pakai nada sopan saat bicara dengan atasan",
        pronunciation_en: "a-TAH-san — use a polite tone with a superior",
      },
      {
        word: "pilihan kata",
        en: "word choice",
        vi: "lựa chọn từ ngữ",
        pos: "noun phrase",
        pronunciation_vi: "pi-LIH-an KA-ta — inti dari register shifting",
        pronunciation_en: "pee-LEE-han KAH-tah — a core part of register shifting",
      },
      {
        word: "menyesuaikan",
        en: "to adjust / adapt",
        vi: "điều chỉnh cho phù hợp",
        pos: "verb",
        pronunciation_vi: "me-nyu-a-I-kan — sesuaikan dengan situasi",
        pronunciation_en: "meh-nyoo-ah-ee-kahn — adapt to the situation",
      },
      {
        word: "kasar",
        en: "rough / blunt / rude",
        vi: "thô / cộc / sỗ sàng",
        pos: "adjective",
        pronunciation_vi: "KA-sar — terdengar kasar = nghe cộc",
        pronunciation_en: "KA-sar — terdengar kasar = sounds blunt",
      },
      {
        word: "halus",
        en: "soft / gentle / subtle",
        vi: "mềm / tinh tế",
        pos: "adjective",
        pronunciation_vi: "HA-lus — kalimat yang halus terdengar lebih aman",
        pronunciation_en: "HA-loos — a halus sentence sounds safer",
      },
    ],
    dialogue: [
      {
        speaker: "Rina",
        text: "Kalau chat ke teman, kamu biasanya pakai bahasa santai ya?",
        vi: "Khi nhắn cho bạn bè, bạn thường dùng ngôn ngữ thoải mái phải không?",
        en: "When you chat with friends, do you usually use casual language?",
      },
      {
        speaker: "Dimas",
        text: "Iya. Tapi kalau ke atasan, saya pilih kata yang lebih rapi.",
        vi: "Ừ. Nhưng khi nói với cấp trên, tôi chọn từ ngữ chỉn chu hơn.",
        en: "Yes. But when I talk to a boss, I choose more polished wording.",
      },
      {
        speaker: "Rina",
        text: "Kalau ragu, mulai netral dulu saja?",
        vi: "Nếu phân vân thì cứ bắt đầu trung tính trước thôi à?",
        en: "If you are unsure, do you just start neutral first?",
      },
      {
        speaker: "Dimas",
        text: "Betul. Setelah itu baru saya sesuaikan dengan situasinya.",
        vi: "Đúng rồi. Sau đó tôi mới điều chỉnh theo tình huống.",
        en: "Exactly. After that I adjust it to the situation.",
      },
      {
        speaker: "Rina",
        text: "Masuk akal. Yang penting, jangan terdengar terlalu kasar.",
        vi: "Hợp lý. Quan trọng là đừng nghe quá cộc lốc.",
        en: "Makes sense. The important thing is not to sound too blunt.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Nếu nói với bạn thân, tôi thường nói thoải mái hơn.", answer: "Kalau dengan teman dekat, saya biasanya ngomong lebih santai." },
          { prompt: "Nếu ở văn phòng, tôi chọn ngôn ngữ chỉn chu hơn.", answer: "Kalau di kantor, saya pilih bahasa yang lebih rapi." },
          { prompt: "Tôi sẽ điều chỉnh lựa chọn từ ngữ theo tình huống.", answer: "Saya akan menyesuaikan pilihan kata dengan situasinya." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu để câu nghe đúng sắc thái:",
        instruction_en: "Fill in the missing word to match the register:",
        items: [
          {
            prompt: "Kalau dengan teman dekat, saya biasanya ____ lebih santai. (nói)",
            answer: "ngomong",
            options: ["ngomong", "bertanya", "membaca"],
          },
          {
            prompt: "Kalau di kantor, saya pilih bahasa yang lebih ____. (chỉnh chu)",
            answer: "rapi",
            options: ["rapi", "kasar", "panjang"],
          },
          {
            prompt: "Kalau ragu, saya mulai ____ dulu. (trung tính)",
            answer: "netral",
            options: ["netral", "santai", "keras"],
          },
        ],
      },
      {
        type: "ordering",
        instruction_vi: "Sắp xếp thành câu đúng:",
        instruction_en: "Put the words in the correct order:",
        items: [
          {
            words: ["Saya", "akan", "menyesuaikan", "pilihan", "kata", "dengan", "situasinya"],
            answer: "Saya akan menyesuaikan pilihan kata dengan situasinya.",
          },
          {
            words: ["Kalau", "bicara", "dengan", "atasan", "saya", "pakai", "nada", "yang", "lebih", "sopan"],
            answer: "Kalau bicara dengan atasan saya pakai nada yang lebih sopan.",
          },
          {
            words: ["Yang", "penting", "jangan", "terdengar", "terlalu", "kasar"],
            answer: "Yang penting jangan terdengar terlalu kasar.",
          },
        ],
      },
    ],
  },
];
