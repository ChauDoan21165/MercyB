// Neighborhood parking dispute Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson. It follows the established Indonesian extra
// lesson format: Indonesian target text in `en`, Vietnamese glosses in `vi`,
// Vietnamese L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.

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
    id: "indonesian_neighborhood_parking_dispute",
    level: "B1",
    category: "community",
    title_vi: "Tranh chấp đỗ xe trong khu dân cư",
    title_en: "Neighborhood parking dispute",
    sentences: [
      {
        en: "Maaf, mobilnya parkir menghalangi jalan sempit ini.",
        vi: "Xin lỗi, xe đang đỗ chắn con đường hẹp này.",
        pronunciation_focus: [
          "MA-af, MO-bil-nya PAR-kir meng-ha-LANG-i JA-lan SEM-pit I-ni - `menghalangi` = chắn, cản; `jalan sempit` = đường hẹp.",
          "Lỗi người Việt: nói `parkir di tengah` quá trực tiếp. Nếu muốn nhẹ giọng, thêm `maaf` và nêu vấn đề cụ thể.",
          "Luyện: `Mobilnya menghalangi jalan.`",
        ],
        pronunciation_focus_en: [
          "MAH-af, MOH-beel-nyah PAR-keer meng-hah-LAHNG-ee JAH-lahn SEM-peet EE-nee - `menghalangi` = block, obstruct; `jalan sempit` = narrow road.",
          "VN-speaker trap: bluntly saying `parkir di tengah`. To soften the tone, add `maaf` and state the issue clearly.",
          "Drill: `Mobilnya menghalangi jalan.`",
        ],
      },
      {
        en: "Kalau bisa, tolong pindahkan mobil ke garasi.",
        vi: "Nếu được, vui lòng dời xe vào gara.",
        pronunciation_focus: [
          "KA-lau BI-sa, TO-long pin-DAH-kan MO-bil ke ga-RA-si - `pindahkan` = dời đi/chuyển đi; `garasi` = gara.",
          "Lỗi người Việt: dùng `geser` trong mọi tình huống. `Pindahkan` lebih rapi saat meminta tetangga memindahkan mobil.",
          "Luyện: `Tolong pindahkan mobilnya.`",
        ],
        pronunciation_focus_en: [
          "KAH-low BEE-sah, TOH-long peen-DAH-kan MOH-beel keh gah-RAH-see - `pindahkan` = move/relocate; `garasi` = garage.",
          "VN-speaker trap: using `geser` for every situation. `Pindahkan` is tidier when asking a neighbor to move a car.",
          "Drill: `Tolong pindahkan mobilnya.`",
        ],
      },
      {
        en: "Jalan ini terlalu sempit untuk parkir dua mobil.",
        vi: "Con đường này quá hẹp để đỗ hai xe.",
        pronunciation_focus: [
          "JA-lan I-ni ter-LA-lu SEM-pit un-TUK PAR-kir DU-a MO-bil - `terlalu sempit` = quá hẹp.",
          "Lỗi người Việt: nói `jalan kecil sekali` vẫn hiểu, nhưng `terlalu sempit` phù hợp hơn khi giải thích alasan.",
          "Luyện: `Jalannya terlalu sempit.`",
        ],
        pronunciation_focus_en: [
          "JAH-lahn EE-nee ter-LAH-loo SEM-peet oon-TOOK PAR-keer DOO-ah MOH-beel - `terlalu sempit` = too narrow.",
          "VN-speaker trap: `jalan kecil sekali` may work, but `terlalu sempit` is better when explaining the reason.",
          "Drill: `Jalannya terlalu sempit.`",
        ],
      },
      {
        en: "Mohon jangan parkir sembarangan di depan rumah tetangga.",
        vi: "Làm ơn đừng đỗ xe bừa bãi trước nhà hàng xóm.",
        pronunciation_focus: [
          "MO-hon JANG-an PAR-kir sem-ba-RAN-gan di de-PAN RU-mah te-TANG-ga - `parkir sembarangan` = đỗ xe bừa bãi.",
          "Lỗi người Việt: dùng `asal parkir` nghe khá thô. Trong teguran sopan, `parkir sembarangan` rõ và lịch sự hơn.",
          "Luyện: `Jangan parkir sembarangan.`",
        ],
        pronunciation_focus_en: [
          "MOH-hon JAHNG-an PAR-keer sem-bah-RAHN-gahn dee deh-PAHN ROO-mah teh-TAHNG-gah - `parkir sembarangan` = park carelessly/anywhere.",
          "VN-speaker trap: using `asal parkir`, which sounds rather blunt. In a polite warning, `parkir sembarangan` is clearer and more respectful.",
          "Drill: `Jangan parkir sembarangan.`",
        ],
      },
      {
        en: "Anak-anak susah lewat kalau ada mobil tamu di sini.",
        vi: "Bọn trẻ khó đi qua nếu có xe khách ở đây.",
        pronunciation_focus: [
          "A-nak-A-nak SU-sah LE-wat KA-lau A-da MO-bil TA-mu di SI-ni - `mobil tamu` = xe khách/xe của khách đến chơi.",
          "Lỗi người Việt: nghĩ `tamu` chỉ là khách ngồi trong nhà. `Mobil tamu` là xe của khách đến thăm.",
          "Luyện: `Ada mobil tamu di sini.`",
        ],
        pronunciation_focus_en: [
          "AH-nak-AH-nak SOO-sah LEH-wat KAH-low AH-dah MOH-beel TAH-moo dee SEE-nee - `mobil tamu` = visitor's car.",
          "VN-speaker trap: thinking `tamu` only means a guest inside the house. `Mobil tamu` is a visitor's car.",
          "Drill: `Ada mobil tamu di sini.`",
        ],
      },
      {
        en: "Kami sudah sepakat aturan parkir untuk warga.",
        vi: "Chúng tôi đã thống nhất quy tắc đỗ xe cho cư dân.",
        pronunciation_focus: [
          "KA-mi SU-dah se-PA-kat a-TU-ran PAR-kir un-TUK WAR-ga - `sepakat` = đồng ý, thống nhất.",
          "Lỗi người Việt: nói `setuju semua` quá lỏng. Untuk aturan bersama, `sudah sepakat` lebih tepat.",
          "Luyện: `Kami sudah sepakat.`",
        ],
        pronunciation_focus_en: [
          "KAH-mee SOO-dah seh-PAH-kat ah-TOO-rahn PAR-keer oon-TOOK WAHR-gah - `sepakat` = agree, reach consensus.",
          "VN-speaker trap: using `setuju semua` too loosely. For shared rules, `sudah sepakat` is more appropriate.",
          "Drill: `Kami sudah sepakat.`",
        ],
      },
      {
        en: "Bisa kita bicarakan ini lewat RT atau RW?",
        vi: "Chúng ta có thể bàn việc này qua RT hay RW không?",
        pronunciation_focus: [
          "BI-sa ki-TA bi-CA-ra-kan I-ni le-WAT ER-TE a-tau ER-WE - `bicarakan` = bàn bạc; `lewat RT/RW` = qua ban khu phố/tổ dân phố.",
          "Lỗi người Việt: đi ngay để tranh cãi dengan tetangga. Kalau sensitif, salurkan lewat RT/RW lebih aman.",
          "Luyện: `Lewat RT saja.`",
        ],
        pronunciation_focus_en: [
          "BEE-sah kee-TA bee-CHAH-rah-kahn EE-nee leh-WAHT ER-TEH ah-TOH ER-WEH - `bicarakan` = discuss; `lewat RT/RW` = through neighborhood leaders.",
          "VN-speaker trap: confronting the neighbor immediately. If it is sensitive, channel it through RT/RW first.",
          "Drill: `Lewat RT saja.`",
        ],
      },
      {
        en: "Saya hanya ingin menegur dengan sopan.",
        vi: "Tôi chỉ muốn nhắc nhở một cách lịch sự.",
        pronunciation_focus: [
          "SA-ya HA-nya I-ngin me-ne-GUR de-NGAN SO-pan - `menegur` = nhắc nhở, góp ý, quở nhẹ.",
          "Lỗi người Việt: dùng `marah` khi mới muốn nhắc. `Menegur dengan sopan` mềm hơn và cocok untuk konflik kecil.",
          "Luyện: `Menegur dengan sopan.`",
        ],
        pronunciation_focus_en: [
          "SAH-yah HAH-nyah EE-ngin meh-neh-GOOR deh-NGAN SOH-pahn - `menegur` = admonish politely, warn, remind.",
          "VN-speaker trap: using `marah` when you only want to remind. `Menegur dengan sopan` is softer and suitable for small conflicts.",
          "Drill: `Menegur dengan sopan.`",
        ],
      },
      {
        en: "Kalau ada tamu besar, mohon beri tahu dulu.",
        vi: "Nếu có xe lớn, làm ơn báo trước.",
        pronunciation_focus: [
          "KA-lau A-da TA-mu BE-sar, MO-hon be-RI TA-hu DU-lu - `beri tahu dulu` = báo trước.",
          "Lỗi người Việt: nói `informasi dulu` không tự nhiên. Trong hal izin dan etika, `beri tahu dulu` rất dùng được.",
          "Luyện: `Mohon beri tahu dulu.`",
        ],
        pronunciation_focus_en: [
          "KAH-low AH-dah TAH-moo BEH-sar, MOH-hon beh-REE TAH-hoo DOO-loo - `beri tahu dulu` = inform first.",
          "VN-speaker trap: saying `informasi dulu`, which is unnatural. For permission and etiquette, `beri tahu dulu` is very usable.",
          "Drill: `Mohon beri tahu dulu.`",
        ],
      },
      {
        en: "Saya ingin cari solusi yang enak untuk semua warga.",
        vi: "Tôi muốn tìm giải pháp ổn cho tất cả cư dân.",
        pronunciation_focus: [
          "SA-ya I-ngin CA-ri so-LU-si yang E-nak un-TUK se-MUA WAR-ga - `solusi yang enak` = giải pháp ổn, dễ chịu cho mọi bên.",
          "Lỗi người Việt: nói `solusi bagus` chung chung. `Yang enak untuk semua` lebih diplomatis dalam konflik warga.",
          "Luyện: `Cari solusi yang enak.`",
        ],
        pronunciation_focus_en: [
          "SAH-yah EE-ngin CHAH-ree soh-LOO-see yahng EH-nak oon-TOOK seh-MOO-ah WAHR-gah - `solusi yang enak` = a workable, agreeable solution.",
          "VN-speaker trap: using vague `solusi bagus`. `Yang enak untuk semua` is more diplomatic in neighborhood conflicts.",
          "Drill: `Cari solusi yang enak.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Di lingkungan perumahan Indonesia, parkir sering jadi isu sensitif karena jalan sempit, mobil tamu, dan akses keluar-masuk tetangga. Nhiều nơi menyelesaikannya lewat obrolan sopan, pengurus RT/RW, atau kesepakatan warga. Cara bicara yang aman adalah mengeluh về masalah, bukan menyerang orang. Kalimat seperti `maaf`, `tolong`, `mohon`, dan `bisa kita bicarakan` membantu menjaga hubungan baik.",
    cultural_notes_en:
      "In Indonesian housing areas, parking often becomes sensitive because of narrow roads, visitor cars, and neighbor access. Many places solve it through polite conversation, RT/RW neighborhood leaders, or a resident agreement. The safe way to speak is to describe the problem, not attack the person. Phrases like `maaf`, `tolong`, `mohon`, and `bisa kita bicarakan` help preserve good relations.",
    tip_advice_vi:
      "Khung nói an toàn: `Maaf, mobilnya menghalangi jalan`, `Kalau bisa, tolong pindahkan mobilnya`, `Bisa kita bicarakan lewat RT/RW?`. Khi muốn mềm giọng, tập trung vào jalan sempit, akses, và kesepakatan warga, bukan blaming.",
    tip_advice_en:
      "Safe speaking frame: `Maaf, mobilnya menghalangi jalan`, `Kalau bisa, tolong pindahkan mobilnya`, `Bisa kita bicarakan lewat RT/RW?`. To sound softer, focus on the narrow road, access, and resident agreement, not blame.",
    vocabulary: [
      {
        word: "parkir sembarangan",
        en: "park carelessly / anywhere",
        vi: "đỗ xe bừa bãi",
        pos: "verb phrase",
        pronunciation_vi: "PAR-kir sem-ba-RAN-gan",
        pronunciation_en: "PAR-keer sem-bah-RAHN-gahn",
      },
      {
        word: "jalan sempit",
        en: "narrow road",
        vi: "đường hẹp",
        pos: "noun phrase",
        pronunciation_vi: "JA-lan SEM-pit",
        pronunciation_en: "JAH-lahn SEM-peet",
      },
      {
        word: "menegur sopan",
        en: "to warn/remind politely",
        vi: "nhắc nhở lịch sự",
        pos: "verb phrase",
        pronunciation_vi: "me-ne-GUR SO-pan",
        pronunciation_en: "meh-neh-GOOR SOH-pahn",
      },
      {
        word: "RT/RW",
        en: "neighborhood association leaders",
        vi: "ban khu phố / tổ dân phố",
        pos: "noun",
        pronunciation_vi: "ER-TE / ER-WE",
        pronunciation_en: "AR-TEE / AR-DUB-lyoo",
      },
      {
        word: "mobil tamu",
        en: "visitor's car",
        vi: "xe của khách",
        pos: "noun phrase",
        pronunciation_vi: "MO-bil TA-mu",
        pronunciation_en: "MOH-beel TAH-moo",
      },
      {
        word: "kesepakatan warga",
        en: "resident agreement",
        vi: "thỏa thuận của cư dân",
        pos: "noun phrase",
        pronunciation_vi: "ke-se-pa-KA-tan WAR-ga",
        pronunciation_en: "ke-se-pa-KAH-tan WAHR-gah",
      },
      {
        word: "garasi",
        en: "garage",
        vi: "gara",
        pos: "noun",
        pronunciation_vi: "ga-RA-si",
        pronunciation_en: "gah-RAH-see",
      },
      {
        word: "pindahkan",
        en: "move (something) away",
        vi: "dời đi / chuyển đi",
        pos: "verb",
        pronunciation_vi: "pin-DAH-kan",
        pronunciation_en: "peen-DAH-kan",
      },
    ],
    dialogue: [
      {
        speaker: "Warga A",
        text: "Maaf, mobilnya parkir menghalangi jalan sempit ini.",
        vi: "Xin lỗi, xe đang đỗ chắn con đường hẹp này.",
        en: "Sorry, the car is parked and blocking this narrow road.",
      },
      {
        speaker: "Warga B",
        text: "Oh, maaf. Saya pindahkan ke garasi sekarang.",
        vi: "Ồ, xin lỗi. Tôi sẽ dời vào gara ngay.",
        en: "Oh, sorry. I will move it into the garage now.",
      },
      {
        speaker: "Warga A",
        text: "Terima kasih. Kami cuma ingin menjaga jalan tetap bisa dilewati.",
        vi: "Cảm ơn. Chúng tôi chỉ muốn giữ cho đường đi vẫn thông suốt.",
        en: "Thank you. We just want to keep the road passable.",
      },
      {
        speaker: "Warga B",
        text: "Kalau ada masalah lagi, mari kita bicarakan lewat RT.",
        vi: "Nếu còn vấn đề gì nữa, hãy cùng bàn qua RT.",
        en: "If there is a problem again, let us discuss it through the neighborhood leader.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Xe đang đỗ chắn đường hẹp này.",
        prompt_en: "Translate into Indonesian: The car is parked and blocking this narrow road.",
        answer: "Mobilnya parkir menghalangi jalan sempit ini.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ còn thiếu: Kalau bisa, tolong ____ mobil ke garasi.",
        prompt_en: "Fill in the blank: Kalau bisa, tolong ____ mobil ke garasi.",
        answer: "pindahkan",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Cụm nào nghĩa là “đỗ xe bừa bãi”?",
        prompt_en: "Which phrase means “park carelessly/anywhere”?",
        choices: ["parkir sembarangan", "mobil tamu", "jalan sempit"],
        answer: "parkir sembarangan",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `kesepakatan warga` = ?",
        prompt_en: "Match the meaning: `kesepakatan warga` = ?",
        answer: "resident agreement",
      },
    ],
  },
];

export default lessons;
