// Expressing Emotions Politely Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// emotion/register notes with English companions in pronunciation_focus_en.

export type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
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
    id: "indonesian_expressing_emotions_politely",
    level: "B1",
    category: "communication",
    title_vi: "Bày tỏ cảm xúc một cách lịch sự",
    title_en: "Expressing emotions politely",
    sentences: [
      {
        en: "Saya senang sekali mendengar kabar baik itu.",
        vi: "Tôi rất vui khi nghe tin tốt đó.",
        pronunciation_focus: [
          "SA-ya se-NANG se-KA-li men-DE-ngar KA-bar BAIK I-tu - `senang sekali` = rất vui; `kabar baik` = tin tốt.",
          "Lỗi người Việt: dùng `bahagia` cho mọi câu vui. `Senang` tự nhiên hơn cho niềm vui đời thường.",
          "Luyện: `Saya senang sekali.`",
        ],
        pronunciation_focus_en: [
          "SA-ya se-NANG se-KA-li men-DE-ngar KA-bar BAIK I-too - `senang sekali` = very happy; `kabar baik` = good news.",
          "VN-speaker trap: using `bahagia` for every happy sentence. `Senang` is more natural for everyday pleasure.",
          "Drill: `Saya senang sekali.`",
        ],
      },
      {
        en: "Terus terang, saya agak kecewa dengan hasilnya.",
        vi: "Thành thật mà nói, tôi hơi thất vọng về kết quả.",
        pronunciation_focus: [
          "te-RUS te-RANG, SA-ya A-gak ke-CE-wa de-NGAN HA-sil-nya - `terus terang` = nói thật; `agak kecewa` = hơi thất vọng.",
          "Lỗi người Việt: nói thẳng `Saya kecewa sekali` quá mạnh trong công việc. Thêm `agak` để mềm hơn.",
          "Luyện: `Saya agak kecewa dengan hasilnya.`",
        ],
        pronunciation_focus_en: [
          "te-ROOS te-RANG, SA-ya A-gak ke-CHE-wa de-NGAN HA-sil-nya - `terus terang` = frankly; `agak kecewa` = a bit disappointed.",
          "VN-speaker trap: saying blunt `Saya kecewa sekali` can feel strong at work. Add `agak` to soften it.",
          "Drill: `Saya agak kecewa dengan hasilnya.`",
        ],
      },
      {
        en: "Saya khawatir kalau masalah ini belum selesai.",
        vi: "Tôi lo rằng vấn đề này vẫn chưa xong.",
        pronunciation_focus: [
          "SA-ya kha-WA-tir KA-lau MA-sa-lah I-ni be-LUM se-le-SAI - `khawatir` = lo lắng; `belum selesai` = chưa xong.",
          "Lỗi người Việt: dịch `lo` thành `takut` trong mọi tình huống. `Takut` là sợ; `khawatir` là lo ngại.",
          "Luyện: `Saya khawatir kalau...`",
        ],
        pronunciation_focus_en: [
          "SA-ya kha-WA-teer KA-lau MA-sa-lah I-ni be-LOOM se-le-SAI - `khawatir` = worried; `belum selesai` = not finished yet.",
          "VN-speaker trap: translating every 'lo' as `takut`. `Takut` is afraid; `khawatir` is concerned/worried.",
          "Drill: `Saya khawatir kalau...`",
        ],
      },
      {
        en: "Maaf, saya sedikit tersinggung dengan ucapan tadi.",
        vi: "Xin lỗi, tôi hơi bị chạm tự ái vì lời nói lúc nãy.",
        pronunciation_focus: [
          "ma-AF, SA-ya se-DI-kit ter-SING-gung de-NGAN u-CA-pan TA-di - `tersinggung` = bị xúc phạm/chạm tự ái; `ucapan tadi` = lời nói lúc nãy.",
          "Lỗi người Việt: dùng `marah` khi thật ra là bị tổn thương. `Tersinggung` chính xác và lịch sự hơn.",
          "Luyện: `Saya sedikit tersinggung.`",
        ],
        pronunciation_focus_en: [
          "ma-AF, SA-ya se-DEE-kit ter-SING-goong de-NGAN u-CHA-pan TA-di - `tersinggung` = offended/hurt; `ucapan tadi` = what was said earlier.",
          "VN-speaker trap: using `marah` when you mean hurt/offended. `Tersinggung` is more precise and polite.",
          "Drill: `Saya sedikit tersinggung.`",
        ],
      },
      {
        en: "Saya malu karena datang terlambat.",
        vi: "Tôi ngại/xấu hổ vì đến muộn.",
        pronunciation_focus: [
          "SA-ya MA-lu ka-RE-na DA-tang ter-LAM-bat - `malu` = ngại/xấu hổ; `terlambat` = muộn.",
          "Lỗi người Việt: `malu` không chỉ là 'nhút nhát'; nó cũng là cảm giác ngại/xấu hổ khi làm sai.",
          "Luyện: `Saya malu karena terlambat.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MA-loo ka-RE-na DA-tang ter-LAM-bat - `malu` = embarrassed/shy; `terlambat` = late.",
          "VN-speaker trap: `malu` is not only shy; it can mean embarrassed after a mistake.",
          "Drill: `Saya malu karena terlambat.`",
        ],
      },
      {
        en: "Boleh saya menyampaikan perasaan saya sebentar?",
        vi: "Tôi có thể nói cảm xúc của mình một chút được không?",
        pronunciation_focus: [
          "BO-leh SA-ya me-nyam-PAI-kan pe-RA-sa-an SA-ya se-BEN-tar - `menyampaikan perasaan` = bày tỏ cảm xúc; `sebentar` = một chút.",
          "Lỗi người Việt: mở đầu quá trực tiếp bằng `Saya mau bilang`. Câu xin phép này mềm và lịch sự hơn.",
          "Luyện: `Boleh saya menyampaikan perasaan saya?`",
        ],
        pronunciation_focus_en: [
          "BO-leh SA-ya me-nyam-PAI-kan pe-RA-sa-an SA-ya se-BEN-tar - `menyampaikan perasaan` = express feelings; `sebentar` = for a moment.",
          "VN-speaker trap: opening too directly with `Saya mau bilang`. This permission phrase is softer and more polite.",
          "Drill: `Boleh saya menyampaikan perasaan saya?`",
        ],
      },
      {
        en: "Saya perlu menenangkan diri dulu sebelum bicara.",
        vi: "Tôi cần bình tĩnh lại trước khi nói chuyện.",
        pronunciation_focus: [
          "SA-ya per-LU me-ne-NANG-kan DI-ri DU-lu se-BE-lum bi-CA-ra - `menenangkan diri` = tự trấn tĩnh; `sebelum bicara` = trước khi nói.",
          "Lỗi người Việt: dịch `bình tĩnh` chỉ bằng tính từ `tenang`. Hành động tự bình tĩnh lại là `menenangkan diri`.",
          "Luyện: `Saya perlu menenangkan diri dulu.`",
        ],
        pronunciation_focus_en: [
          "SA-ya per-LOO me-ne-NANG-kan DEE-ri DOO-loo se-BE-lum bi-CHA-ra - `menenangkan diri` = calm myself down; `sebelum bicara` = before talking.",
          "VN-speaker trap: translating calm only as adjective `tenang`. The action of calming yourself is `menenangkan diri`.",
          "Drill: `Saya perlu menenangkan diri dulu.`",
        ],
      },
      {
        en: "Mari kita bicara baik-baik supaya tidak salah paham.",
        vi: "Chúng ta hãy nói chuyện đàng hoàng để không hiểu lầm.",
        pronunciation_focus: [
          "MA-ri KI-ta bi-CA-ra BAIK-BAIK su-PA-ya ti-DAK SA-lah PA-ham - `bicara baik-baik` = nói chuyện tử tế/đàng hoàng; `salah paham` = hiểu lầm.",
          "Lỗi người Việt: `baik-baik` ở đây không phải 'tốt tốt' mà là cách nói bình tĩnh, tử tế.",
          "Luyện: `Kita bicara baik-baik.`",
        ],
        pronunciation_focus_en: [
          "MA-ri KI-ta bi-CHA-ra BAIK-BAIK su-PA-ya ti-DAK SA-lah PA-ham - `bicara baik-baik` = talk calmly/properly; `salah paham` = misunderstanding.",
          "VN-speaker trap: `baik-baik` here is not 'good-good'; it means calmly and respectfully.",
          "Drill: `Kita bicara baik-baik.`",
        ],
      },
      {
        en: "Saya paham maksud Anda, tetapi saya punya pandangan berbeda.",
        vi: "Tôi hiểu ý của bạn, nhưng tôi có quan điểm khác.",
        pronunciation_focus: [
          "SA-ya PA-ham MAK-sud AN-da, te-TA-pi SA-ya PU-nya pan-DA-ngan ber-BE-da - `maksud Anda` = ý của bạn; `pandangan berbeda` = quan điểm khác.",
          "Lỗi người Việt: phản đối bằng `tidak benar` nghe đối đầu. Câu này công nhận trước rồi nêu khác biệt.",
          "Luyện: `Saya paham, tetapi saya berbeda pendapat.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PA-ham MAK-sood AN-da, te-TA-pi SA-ya POO-nya pan-DA-ngan ber-BE-da - `maksud Anda` = your point/intention; `pandangan berbeda` = different view.",
          "VN-speaker trap: objecting with `tidak benar` can sound confrontational. This sentence acknowledges first, then differs.",
          "Drill: `Saya paham, tetapi saya berbeda pendapat.`",
        ],
      },
      {
        en: "Saya tidak bermaksud menyakiti perasaan Anda.",
        vi: "Tôi không có ý làm tổn thương cảm xúc của bạn.",
        pronunciation_focus: [
          "SA-ya ti-DAK ber-MAK-sud me-nya-KI-ti pe-RA-sa-an AN-da - `tidak bermaksud` = không có ý; `menyakiti perasaan` = làm tổn thương cảm xúc.",
          "Lỗi người Việt: nói `saya tidak salah` khi xin làm rõ. Câu `tidak bermaksud...` giảm căng thẳng hơn.",
          "Luyện: `Saya tidak bermaksud menyakiti.`",
        ],
        pronunciation_focus_en: [
          "SA-ya ti-DAK ber-MAK-sood me-nya-KEE-ti pe-RA-sa-an AN-da - `tidak bermaksud` = did not intend; `menyakiti perasaan` = hurt feelings.",
          "VN-speaker trap: saying `saya tidak salah` when clarifying. `Tidak bermaksud...` reduces tension better.",
          "Drill: `Saya tidak bermaksud menyakiti.`",
        ],
      },
      {
        en: "Saya butuh waktu untuk memikirkan ini dengan tenang.",
        vi: "Tôi cần thời gian để suy nghĩ chuyện này một cách bình tĩnh.",
        pronunciation_focus: [
          "SA-ya BU-tuh WAK-tu UN-tuk me-mi-KIR-kan I-ni de-NGAN te-NANG - `butuh waktu` = cần thời gian; `dengan tenang` = một cách bình tĩnh.",
          "Lỗi người Việt: im lặng lâu có thể bị hiểu là né tránh. Hãy nói rõ `saya butuh waktu`.",
          "Luyện: `Saya butuh waktu sebentar.`",
        ],
        pronunciation_focus_en: [
          "SA-ya BOO-tooh WAK-too UN-tuk me-mi-KEER-kan I-ni de-NGAN te-NANG - `butuh waktu` = need time; `dengan tenang` = calmly.",
          "VN-speaker trap: staying silent too long may sound avoidant. Say clearly `saya butuh waktu`.",
          "Drill: `Saya butuh waktu sebentar.`",
        ],
      },
      {
        en: "Terima kasih sudah mendengarkan saya.",
        vi: "Cảm ơn bạn đã lắng nghe tôi.",
        pronunciation_focus: [
          "te-ri-MA KA-sih SU-dah men-de-NGAR-kan SA-ya - `mendengarkan` = lắng nghe; `sudah` = đã.",
          "Lỗi người Việt: kết thúc cuộc nói chuyện căng bằng im lặng. Câu cảm ơn này giữ quan hệ tốt.",
          "Luyện: `Terima kasih sudah mendengarkan.`",
        ],
        pronunciation_focus_en: [
          "te-ri-MA KA-sih SOO-dah men-de-NGAR-kan SA-ya - `mendengarkan` = listen to; `sudah` = already/have.",
          "VN-speaker trap: ending a tense talk with silence. This thanks keeps the relationship intact.",
          "Drill: `Terima kasih sudah mendengarkan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong giao tiếp Indonesia, đặc biệt ở nơi làm việc hoặc với người lớn tuổi, bày tỏ cảm xúc thường đi kèm cách làm mềm: `agak`, `sedikit`, `terus terang`, `maaf`, `boleh saya...`, `menurut saya`. Nói quá thẳng có thể bị xem là kurang sopan dù nội dung đúng. Cách an toàn là nói cảm xúc của mình bằng `saya merasa...` hoặc `saya agak...`, rồi mời nói chuyện: `mari kita bicara baik-baik`.",
    cultural_notes_en:
      "In Indonesian communication, especially at work or with older people, expressing feelings often comes with softeners: `agak`, `sedikit`, `terus terang`, `maaf`, `boleh saya...`, `menurut saya`. Being too blunt can be seen as kurang sopan even when your point is valid. A safe pattern is to name your feeling with `saya merasa...` or `saya agak...`, then invite a calm talk: `mari kita bicara baik-baik`.",
    tip_advice_vi:
      "Mẹo cho người Việt: tiếng Việt cũng hay vòng mềm khi nói chuyện khó, nên hãy chuyển thói quen đó sang Indonesia. Dùng khung 4 bước: công nhận (`Saya paham maksud Anda`), nói cảm xúc (`saya agak kecewa/khawatir`), xin nói bình tĩnh (`mari bicara baik-baik`), và giữ quan hệ (`terima kasih sudah mendengarkan`). Tránh mở đầu bằng `Kamu salah` hoặc `Saya marah` nếu mục tiêu là giải quyết vấn đề.",
    tip_advice_en:
      "Tip for Vietnamese speakers: Vietnamese also softens difficult conversations, so transfer that habit into Indonesian. Use a four-step frame: acknowledge (`Saya paham maksud Anda`), name the feeling (`saya agak kecewa/khawatir`), invite calm discussion (`mari bicara baik-baik`), and preserve the relationship (`terima kasih sudah mendengarkan`). Avoid opening with `Kamu salah` or `Saya marah` if your goal is to solve the issue.",
    vocabulary: [
      { cell_id: "304f6426-5c8f-4f4b-9cf2-f5a8b414eb84", word: "senang", en: "happy, pleased", vi: "vui", pos: "adjective", pronunciation_vi: "se-NANG", pronunciation_en: "se-NANG" },
      { cell_id: "354bdeb9-8a68-4e68-b6bb-a0e9c34c030d", word: "kecewa", en: "disappointed", vi: "thất vọng", pos: "adjective", pronunciation_vi: "ke-CE-wa", pronunciation_en: "ke-CHE-wa" },
      { cell_id: "e647b46e-dce0-49fb-ad85-27b1aa14e1f9", word: "khawatir", en: "worried, concerned", vi: "lo lắng", pos: "adjective", pronunciation_vi: "kha-WA-tir", pronunciation_en: "kha-WA-teer" },
      { cell_id: "14d0f847-eebe-4e5f-9b8f-87fb8e17754e", word: "tersinggung", en: "offended, hurt", vi: "bị xúc phạm, chạm tự ái", pos: "adjective/passive verb", pronunciation_vi: "ter-SING-gung", pronunciation_en: "ter-SING-goong" },
      { cell_id: "4ba3f0c9-2361-49dc-8c22-b7f2cd671247", word: "malu", en: "embarrassed, shy", vi: "ngại, xấu hổ", pos: "adjective", pronunciation_vi: "MA-lu", pronunciation_en: "MA-loo" },
      { cell_id: "66aa8e8d-6e35-4537-a57b-ca84315aca39", word: "perasaan", en: "feeling", vi: "cảm xúc", pos: "noun", pronunciation_vi: "pe-RA-sa-an", pronunciation_en: "pe-RA-sa-an" },
      { cell_id: "6b8229d9-4d02-491b-9760-065b4d848648", word: "menenangkan diri", en: "to calm oneself down", vi: "tự bình tĩnh lại", pos: "verb phrase", pronunciation_vi: "me-ne-NANG-kan DI-ri", pronunciation_en: "me-ne-NANG-kan DEE-ri" },
      { cell_id: "32d17cd4-13a2-4c37-a3da-a0e2879ca455", word: "bicara baik-baik", en: "to talk calmly and respectfully", vi: "nói chuyện tử tế/bình tĩnh", pos: "verb phrase", pronunciation_vi: "bi-CA-ra BAIK-BAIK", pronunciation_en: "bi-CHA-ra BAIK-BAIK" },
    ],
    dialogue: [
      {
        cell_id: "d1c0ef79-ee09-431d-b867-dfb7a2942ce8",
        speaker: "Rani",
        text: "Boleh saya menyampaikan perasaan saya sebentar?",
        vi: "Tôi có thể nói cảm xúc của mình một chút được không?",
        en: "May I express how I feel for a moment?",
      },
      {
        cell_id: "d51f3ac2-5d96-4e20-b022-9a6855eb098e",
        speaker: "Dimas",
        text: "Boleh, silakan. Saya akan mendengarkan.",
        vi: "Được, xin mời. Tôi sẽ lắng nghe.",
        en: "Yes, please. I will listen.",
      },
      {
        cell_id: "17aa45e4-150d-4198-9112-49b7b2803c4b",
        speaker: "Rani",
        text: "Terus terang, saya agak kecewa dan sedikit tersinggung dengan ucapan tadi.",
        vi: "Thành thật mà nói, tôi hơi thất vọng và hơi chạm tự ái vì lời nói lúc nãy.",
        en: "Frankly, I felt a bit disappointed and a little hurt by what was said earlier.",
      },
      {
        cell_id: "45a5c641-f568-46bb-a674-53d5a86cea90",
        speaker: "Dimas",
        text: "Maaf, saya tidak bermaksud menyakiti perasaan kamu.",
        vi: "Xin lỗi, tôi không có ý làm tổn thương cảm xúc của bạn.",
        en: "Sorry, I did not mean to hurt your feelings.",
      },
      {
        cell_id: "be38ac82-31bb-4e80-834f-0b72b707e933",
        speaker: "Rani",
        text: "Tidak apa-apa. Mari kita bicara baik-baik supaya tidak salah paham.",
        vi: "Không sao. Chúng ta hãy nói chuyện bình tĩnh để không hiểu lầm.",
        en: "It's okay. Let's talk calmly so there is no misunderstanding.",
      },
    ],
    exercises: [
      {
        type: "softening",
        instruction_vi: "Làm mềm câu quá trực tiếp bằng tiếng Indonesia lịch sự hơn.",
        instruction_en: "Soften the direct sentence into more polite Indonesian.",
        items: [
          {
            prompt: "Saya kecewa sekali.",
            answer: "Terus terang, saya agak kecewa.",
          },
          {
            prompt: "Kamu salah.",
            answer: "Saya paham maksud Anda, tetapi saya punya pandangan berbeda.",
          },
          {
            prompt: "Saya marah.",
            answer: "Saya perlu menenangkan diri dulu sebelum bicara.",
          },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ cảm xúc phù hợp: senang, khawatir, malu, tersinggung.",
        instruction_en: "Fill in the suitable emotion word: senang, khawatir, malu, tersinggung.",
        items: [
          { prompt: "Saya ___ sekali mendengar kabar baik itu.", answer: "senang" },
          { prompt: "Saya ___ kalau masalah ini belum selesai.", answer: "khawatir" },
          { prompt: "Saya ___ karena datang terlambat.", answer: "malu" },
          { prompt: "Saya sedikit ___ dengan ucapan tadi.", answer: "tersinggung" },
        ],
      },
    ],
  },
];

export default lessons;
