// Physiotherapy & rehabilitation Indonesian (Vietnamese -> Indonesian study track).
//
// A6 Wave 25 file. Covers fisioterapi, cedera, nyeri punggung,
// latihan pemulihan, jadwal terapi, alat bantu, and rujukan dokter.
// Self-contained so no registry or sibling agent files are touched.
//
// Field convention: sentence `en` holds the target Indonesian line, `vi` holds
// the Vietnamese gloss. `pronunciation_focus` carries Vietnamese-facing notes
// and common L1 traps; `pronunciation_focus_en` mirrors the same order for
// English-speaking companions.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
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
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
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

// Loosely typed so per-type fields (translation, fill-blank, matching) can vary.
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
    id: "indonesian_physiotherapy_rehab",
    level: "A2",
    category: "health",
    title_vi: "Vật lý trị liệu và phục hồi chức năng",
    title_en: "Physiotherapy and rehabilitation",
    sentences: [
      {
        en: "Dokter memberi saya rujukan untuk fisioterapi.",
        vi: "Bác sĩ cho tôi giấy chuyển tuyến để đi vật lý trị liệu.",
        pronunciation_focus: [
          "DOK-ter mem-BE-ri SA-ya ru-JU-kan UN-tuk fi-si-o-te-RA-pi - `rujukan` = giấy chuyển tuyến/giới thiệu; `fisioterapi` = vật lý trị liệu.",
          "`memberi saya rujukan` = cho tôi giấy giới thiệu. Trong y tế, `rujukan` rất quan trọng nếu dùng bảo hiểm/BPJS.",
          "Lỗi người Việt: nói `surat pindah dokter`. Từ y tế tự nhiên là `rujukan dokter` hoặc `rujukan untuk fisioterapi`.",
        ],
        pronunciation_focus_en: [
          "DOK-ter mem-BE-ree SA-ya roo-JOO-kan UN-tuk fee-see-o-te-RA-pee - `rujukan` = referral; `fisioterapi` = physiotherapy.",
          "`memberi saya rujukan` = gave me a referral. In healthcare, `rujukan` matters if using insurance/BPJS.",
          "VN-speaker trap: saying `surat pindah dokter`. Natural medical wording is `rujukan dokter` or `rujukan untuk fisioterapi`.",
        ],
      },
      {
        en: "Saya cedera lutut setelah jatuh dari motor.",
        vi: "Tôi bị chấn thương đầu gối sau khi ngã xe máy.",
        pronunciation_focus: [
          "SA-ya ce-DE-ra LU-tut se-TE-lah JA-tuh da-ri MO-tor - `cedera` = chấn thương; `lutut` = đầu gối.",
          "`jatuh dari motor` = ngã khỏi xe máy. `Motor` ở Indonesia thường là xe máy, không phải ô tô.",
          "Lỗi người Việt: dùng `luka` cho mọi chấn thương. `Luka` là vết thương; chấn thương khớp/cơ dùng `cedera`.",
        ],
        pronunciation_focus_en: [
          "SA-ya che-DE-ra LOO-toot se-TE-lah JA-tooh da-ree MO-tor - `cedera` = injury; `lutut` = knee.",
          "`jatuh dari motor` = fell from a motorcycle. In Indonesian, `motor` usually means motorcycle, not car.",
          "VN-speaker trap: using `luka` for every injury. `Luka` is a wound; joint/muscle injury uses `cedera`.",
        ],
      },
      {
        en: "Nyeri punggung saya terasa lebih parah saat duduk lama.",
        vi: "Đau lưng của tôi thấy nặng hơn khi ngồi lâu.",
        pronunciation_focus: [
          "NYE-ri PUNG-gung SA-ya te-RA-sa le-BIH PA-rah SA-at DU-duk LA-ma - `nyeri punggung` = đau lưng; `duduk lama` = ngồi lâu.",
          "`terasa` = cảm thấy/có cảm giác; dùng tự nhiên khi mô tả đau.",
          "Lỗi người Việt: nói `punggung saya sakit sekali` cho mọi mức đau. `Nyeri punggung` nghe y tế và chính xác hơn.",
        ],
        pronunciation_focus_en: [
          "NYE-ree POONG-goong SA-ya te-RA-sa le-BIH PA-rah SA-at DOO-dook LA-ma - `nyeri punggung` = back pain; `duduk lama` = sitting for a long time.",
          "`terasa` = feels; natural when describing pain.",
          "VN-speaker trap: saying `punggung saya sakit sekali` for every pain. `Nyeri punggung` is more medical and precise.",
        ],
      },
      {
        en: "Fisioterapis memeriksa gerakan bahu saya.",
        vi: "Chuyên viên vật lý trị liệu kiểm tra cử động vai của tôi.",
        pronunciation_focus: [
          "fi-si-o-te-RA-pis me-ME-rik-sa ge-RA-kan BA-hu SA-ya - `fisioterapis` = chuyên viên vật lý trị liệu; `gerakan bahu` = cử động vai.",
          "`bahu saya` = vai của tôi; sở hữu đứng sau danh từ trong tiếng Indonesia.",
          "Lỗi người Việt: nói `saya bahu`. Đúng là `bahu saya`, giống các bộ phận cơ thể khác: `lutut saya`, `punggung saya`.",
        ],
        pronunciation_focus_en: [
          "fee-see-o-te-RA-pis me-ME-rik-sa ge-RA-kan BA-hoo SA-ya - `fisioterapis` = physiotherapist; `gerakan bahu` = shoulder movement.",
          "`bahu saya` = my shoulder; possession follows the noun in Indonesian.",
          "VN-speaker trap: saying `saya bahu`. Correct: `bahu saya`, like other body parts: `lutut saya`, `punggung saya`.",
        ],
      },
      {
        en: "Latihan pemulihan ini harus dilakukan setiap hari.",
        vi: "Bài tập phục hồi này phải được làm mỗi ngày.",
        pronunciation_focus: [
          "LA-tih-an pe-MU-lih-an I-ni HA-rus di-la-KU-kan se-TI-ap HA-ri - `latihan pemulihan` = bài tập phục hồi; `dilakukan` = được thực hiện.",
          "Bị động `di-` rất tự nhiên trong hướng dẫn y tế: `harus dilakukan`, `harus diulang`, `harus dihentikan`.",
          "Lỗi người Việt: nói `latihan sembuh`. Cụm đúng cho phục hồi là `latihan pemulihan`.",
        ],
        pronunciation_focus_en: [
          "LA-tih-an pe-MOO-lih-an EE-nee HA-rus di-la-KOO-kan se-TEE-ap HA-ree - `latihan pemulihan` = rehab exercise; `dilakukan` = be done.",
          "Passive `di-` is natural in medical instructions: `harus dilakukan`, `harus diulang`, `harus dihentikan`.",
          "VN-speaker trap: saying `latihan sembuh`. The correct phrase for rehabilitation is `latihan pemulihan`.",
        ],
      },
      {
        en: "Jadwal terapi saya dua kali seminggu.",
        vi: "Lịch trị liệu của tôi là hai lần một tuần.",
        pronunciation_focus: [
          "JAD-wal te-RA-pi SA-ya DU-a KA-li se-MING-gu - `jadwal terapi` = lịch trị liệu; `dua kali seminggu` = hai lần mỗi tuần.",
          "`seminggu` = một tuần/per week; `se-` ở đây nghĩa là một.",
          "Lỗi người Việt: nói `dua kali satu minggu` nghe dịch chữ. Tự nhiên hơn: `dua kali seminggu`.",
        ],
        pronunciation_focus_en: [
          "JAD-wal te-RA-pee SA-ya DOO-a KA-lee se-MING-goo - `jadwal terapi` = therapy schedule; `dua kali seminggu` = twice a week.",
          "`seminggu` = one week/per week; `se-` here means one.",
          "VN-speaker trap: saying literal `dua kali satu minggu`. More natural: `dua kali seminggu`.",
        ],
      },
      {
        en: "Apakah saya perlu alat bantu jalan sementara?",
        vi: "Tôi có cần dụng cụ hỗ trợ đi lại tạm thời không?",
        pronunciation_focus: [
          "a-pa-KAH SA-ya PER-lu A-lat BAN-tu JA-lan se-men-TA-ra - `alat bantu jalan` = dụng cụ hỗ trợ đi lại; `sementara` = tạm thời.",
          "`alat bantu` có thể là nạng, walker, hoặc thiết bị hỗ trợ khác.",
          "Lỗi người Việt: dịch 'dụng cụ' thành `barang`. Trong y tế, dùng `alat bantu`.",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH SA-ya PER-loo A-lat BAN-too JA-lan se-men-TA-ra - `alat bantu jalan` = walking aid; `sementara` = temporary.",
          "`alat bantu` can refer to crutches, a walker, or other assistive equipment.",
          "VN-speaker trap: translating 'device/tool' as `barang`. In healthcare, use `alat bantu`.",
        ],
      },
      {
        en: "Gerakan ini terasa sakit, boleh saya berhenti dulu?",
        vi: "Động tác này thấy đau, tôi có thể dừng trước được không?",
        pronunciation_focus: [
          "ge-RA-kan I-ni te-RA-sa SA-kit, BO-leh SA-ya ber-HEN-ti DU-lu - `gerakan` = động tác/cử động; `berhenti dulu` = dừng trước đã.",
          "`boleh saya...?` là cách xin phép lịch sự khi đang tập với chuyên viên.",
          "Lỗi người Việt: nói `saya stop` nửa Anh nửa Indo. Tự nhiên hơn: `boleh saya berhenti dulu?`",
        ],
        pronunciation_focus_en: [
          "ge-RA-kan EE-nee te-RA-sa SA-kit, BO-leh SA-ya ber-HEN-tee DOO-loo - `gerakan` = movement; `berhenti dulu` = stop for now.",
          "`boleh saya...?` is a polite way to ask permission during therapy.",
          "VN-speaker trap: saying half-English `saya stop`. More natural: `boleh saya berhenti dulu?`",
        ],
      },
      {
        en: "Setelah terapi, punggung saya terasa lebih ringan.",
        vi: "Sau buổi trị liệu, lưng tôi cảm thấy nhẹ hơn.",
        pronunciation_focus: [
          "se-TE-lah te-RA-pi, PUNG-gung SA-ya te-RA-sa le-BIH RI-ngan - `lebih ringan` = nhẹ hơn/đỡ hơn.",
          "`ringan` không chỉ là trọng lượng nhẹ; trong đau nhức, nghĩa là cảm giác đỡ nặng.",
          "Lỗi người Việt: nói `lebih enak` được hiểu thân mật, nhưng trong phòng khám `lebih ringan` hoặc `membaik` rõ hơn.",
        ],
        pronunciation_focus_en: [
          "se-TE-lah te-RA-pee, POONG-goong SA-ya te-RA-sa le-BIH REE-ngan - `lebih ringan` = lighter/relieved.",
          "`ringan` is not only physical weight; for pain it means feeling less heavy.",
          "VN-speaker trap: `lebih enak` is understood casually, but at a clinic `lebih ringan` or `membaik` is clearer.",
        ],
      },
      {
        en: "Kapan saya harus kontrol lagi ke dokter rehabilitasi?",
        vi: "Khi nào tôi phải tái khám lại với bác sĩ phục hồi chức năng?",
        pronunciation_focus: [
          "KA-pan SA-ya HA-rus kon-TROL la-GI ke DOK-ter re-ha-bi-li-TA-si - `kontrol lagi` = tái khám lại; `dokter rehabilitasi` = bác sĩ phục hồi chức năng.",
          "`kapan` hỏi thời điểm/ngày; dùng tốt hơn `jam berapa` khi chưa biết lịch.",
          "Lỗi người Việt: dịch `tái khám` thành `periksa lagi` trong mọi ngữ cảnh. Từ bệnh viện rất hay dùng `kontrol lagi`.",
        ],
        pronunciation_focus_en: [
          "KA-pan SA-ya HA-rus kon-TROL la-GEE ke DOK-ter re-ha-bi-li-TA-see - `kontrol lagi` = follow up again; `dokter rehabilitasi` = rehab doctor.",
          "`kapan` asks timing/date; better than `jam berapa` when you do not know the schedule yet.",
          "VN-speaker trap: translating follow-up as `periksa lagi` everywhere. Hospitals often use `kontrol lagi`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `fisioterapi` có thể được chỉ định sau chấn thương, đau lưng, phẫu thuật, tai biến, hoặc bệnh mạn tính ảnh hưởng vận động. Bệnh nhân thường cần `rujukan dokter`, lịch `terapi`, và hướng dẫn `latihan pemulihan` để tập ở nhà. Nếu dùng BPJS hoặc bảo hiểm, hỏi rõ apakah perlu rujukan, berapa sesi terapi, dan apakah alat bantu ditanggung. Khi tập, nên báo ngay nếu có `nyeri` tăng, tê, chóng mặt, hoặc khó thở.",
    cultural_notes_en:
      "In Indonesia, `fisioterapi` may be prescribed after injury, back pain, surgery, stroke, or chronic conditions affecting movement. Patients often need a `rujukan dokter`, a therapy schedule, and `latihan pemulihan` instructions for home practice. If using BPJS or insurance, ask whether a referral is needed, how many therapy sessions are covered, and whether assistive devices are covered. During exercise, report increased `nyeri`, numbness, dizziness, or shortness of breath immediately.",
    tip_advice_vi:
      "Mẹo cho người Việt: `sakit` rộng là đau/ốm, còn `nyeri` là đau nhức cụ thể hơn. Bộ phận cơ thể đứng trước sở hữu: `punggung saya`, `lutut saya`, `bahu saya`. Với lịch trị liệu, dùng `Jadwal terapi saya kapan?`, `dua kali seminggu`, và `Kapan kontrol lagi?`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: `sakit` broadly means sick/hurts, while `nyeri` is more specific aching pain. Body parts come before possession: `punggung saya`, `lutut saya`, `bahu saya`. For therapy schedules, use `Jadwal terapi saya kapan?`, `dua kali seminggu`, and `Kapan kontrol lagi?`.",
    vocabulary: [
      { word: "fisioterapi", en: "physiotherapy", vi: "vật lý trị liệu", pos: "noun", pronunciation_vi: "fi-si-o-te-RA-pi", pronunciation_en: "fee-see-o-te-RA-pee" },
      { word: "fisioterapis", en: "physiotherapist", vi: "chuyên viên vật lý trị liệu", pos: "noun", pronunciation_vi: "fi-si-o-te-RA-pis", pronunciation_en: "fee-see-o-te-RA-pis" },
      { word: "cedera", en: "injury", vi: "chấn thương", pos: "noun/verb", pronunciation_vi: "ce-DE-ra", pronunciation_en: "che-DE-ra" },
      { word: "nyeri punggung", en: "back pain", vi: "đau lưng", pos: "noun phrase", pronunciation_vi: "NYE-ri PUNG-gung", pronunciation_en: "NYE-ree POONG-goong" },
      { word: "latihan pemulihan", en: "rehab exercise", vi: "bài tập phục hồi", pos: "noun phrase", pronunciation_vi: "LA-tih-an pe-MU-lih-an", pronunciation_en: "LA-tih-an pe-MOO-lih-an" },
      { word: "jadwal terapi", en: "therapy schedule", vi: "lịch trị liệu", pos: "noun phrase", pronunciation_vi: "JAD-wal te-RA-pi", pronunciation_en: "JAD-wal te-RA-pee" },
      { word: "alat bantu", en: "assistive device", vi: "dụng cụ hỗ trợ", pos: "noun phrase", pronunciation_vi: "A-lat BAN-tu", pronunciation_en: "A-lat BAN-too" },
      { word: "rujukan dokter", en: "doctor referral", vi: "giấy chuyển tuyến của bác sĩ", pos: "noun phrase", pronunciation_vi: "ru-JU-kan DOK-ter", pronunciation_en: "roo-JOO-kan DOK-ter" },
      { word: "gerakan", en: "movement", vi: "cử động/động tác", pos: "noun", pronunciation_vi: "ge-RA-kan", pronunciation_en: "ge-RA-kan" },
      { word: "kontrol lagi", en: "follow up again", vi: "tái khám lại", pos: "verb phrase", pronunciation_vi: "kon-TROL la-GI", pronunciation_en: "kon-TROL la-GEE" },
    ],
    dialogue: [
      {
        speaker: "Pasien",
        text: "Saya punya rujukan dokter untuk fisioterapi.",
        vi: "Tôi có giấy chuyển tuyến của bác sĩ để đi vật lý trị liệu.",
        en: "I have a doctor's referral for physiotherapy.",
      },
      {
        speaker: "Staf",
        text: "Baik. Keluhannya cedera lutut atau nyeri punggung?",
        vi: "Vâng. Triệu chứng là chấn thương đầu gối hay đau lưng?",
        en: "Okay. Is the complaint a knee injury or back pain?",
      },
      {
        speaker: "Pasien",
        text: "Nyeri punggung saya terasa lebih parah saat duduk lama.",
        vi: "Đau lưng của tôi thấy nặng hơn khi ngồi lâu.",
        en: "My back pain feels worse when I sit for a long time.",
      },
      {
        speaker: "Fisioterapis",
        text: "Kita mulai dengan latihan pemulihan ringan dulu.",
        vi: "Chúng ta bắt đầu với bài tập phục hồi nhẹ trước đã.",
        en: "We will start with light rehab exercises first.",
      },
      {
        speaker: "Pasien",
        text: "Kalau gerakan ini terasa sakit, boleh saya berhenti dulu?",
        vi: "Nếu động tác này thấy đau, tôi có thể dừng trước được không?",
        en: "If this movement feels painful, may I stop for now?",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "fisioterapi", answer: "vật lý trị liệu" },
          { prompt: "nyeri punggung", answer: "đau lưng" },
          { prompt: "latihan pemulihan", answer: "bài tập phục hồi" },
          { prompt: "alat bantu", answer: "dụng cụ hỗ trợ" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Bác sĩ cho tôi giấy chuyển tuyến để đi vật lý trị liệu.", answer: "Dokter memberi saya rujukan untuk fisioterapi." },
          { prompt: "Lịch trị liệu của tôi là hai lần một tuần.", answer: "Jadwal terapi saya dua kali seminggu." },
          { prompt: "Tôi có cần dụng cụ hỗ trợ đi lại tạm thời không?", answer: "Apakah saya perlu alat bantu jalan sementara?" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu.",
        instruction_en: "Fill in the missing word.",
        items: [
          { prompt: "Saya cedera ___ setelah jatuh dari motor.", answer: "lutut" },
          { prompt: "Latihan pemulihan ini harus ___ setiap hari.", answer: "dilakukan" },
          { prompt: "Kapan saya harus ___ lagi ke dokter rehabilitasi?", answer: "kontrol" },
        ],
      },
    ],
  },
];
