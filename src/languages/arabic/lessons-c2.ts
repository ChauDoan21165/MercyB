import type { ArabicLesson } from "./lessons";

export const lessons: ArabicLesson[] = [
  {
    id: "arabic_c2_close_reading_modern_prose",
    level: "C2",
    category: "literary_media_analysis",
    title_vi: "Đọc kỹ văn xuôi hiện đại: nghĩa từ cấu trúc, không chỉ cốt truyện",
    title_en: "Close reading modern prose: meaning from structure, not plot",
    intro_vi:
      "Bài C2 này luyện cách bình giảng một đoạn văn xuôi Ả Rập chuẩn hiện đại bằng chứng cứ ngôn ngữ: giọng kể, nhịp câu, hình ảnh, bỏ lửng và mối quan hệ giữa điều được nói với điều bị giữ lại.",
    intro_en:
      "This C2 lesson trains close reading of Modern Standard Arabic prose through linguistic evidence: narrative voice, sentence rhythm, imagery, omission, and the relation between what is said and what is withheld.",
    sentences: [
      {
        ar: "لا يكتفي السرد بنقل الحدث، بل يعيد ترتيب الصمت حوله.",
        romanization: "laa yaktafii as-sardu binaqli al-hadath, bal yu'iidu tartiiba as-samti hawlah.",
        vi: "Trần thuật không chỉ truyền đạt sự kiện, mà còn sắp xếp lại sự im lặng bao quanh nó.",
        en: "Narration does not merely transmit the event; it rearranges the silence around it.",
        pronunciation_focus: ["السرد: as-sard, âm r rõ", "يعيد: yu'iid, giữ hamza nhẹ", "الصمت: as-samt, cụm mt cuối"],
        pronunciation_focus_en: ["السرد: as-sard, clear r", "يعيد: yu'iid, keep the light hamza", "الصمت: as-samt, final mt cluster"],
      },
      {
        ar: "تؤدي الاستعارة هنا وظيفة بنائية، لا وظيفة زخرفية فحسب.",
        romanization: "tu'addii al-isti'aaratu hunaa waziifatan binaa'iyyah, laa waziifatan zukhrufiyyatan fahasb.",
        vi: "Ẩn dụ ở đây có chức năng kiến tạo, không chỉ là trang trí.",
        en: "The metaphor here performs a structural function, not merely a decorative one.",
      },
      {
        ar: "ينبغي أن نميّز بين صوت الراوي وموقف النص نفسه.",
        romanization: "yanbaghii an numayyiza bayna sawti ar-raawii wa-mawqifi an-nassi nafsih.",
        vi: "Cần phân biệt giữa giọng người kể và lập trường của chính văn bản.",
        en: "We must distinguish between the narrator's voice and the stance of the text itself.",
      },
      {
        ar: "لا يسمح الالتباس بتأويل واحد، بل يفتح مجالًا لتأويلات متنافسة.",
        romanization: "laa yasmahu al-iltibaasu bita'wiilin waahid, bal yaftahu majaalan lita'wiilaatin mutanaafisah.",
        vi: "Sự mơ hồ không cho phép một diễn giải duy nhất, mà mở ra vùng cho những diễn giải cạnh tranh.",
        en: "Ambiguity does not permit a single interpretation; it opens a field of competing readings.",
      },
    ],
    vocabulary: [
      { ar: "السرد", romanization: "as-sard", vi: "sự trần thuật", en: "narration", pos: "noun" },
      { ar: "الراوي", romanization: "ar-raawii", vi: "người kể chuyện", en: "narrator", pos: "noun" },
      { ar: "الصورة البلاغية", romanization: "as-suurah al-balaaghiyyah", vi: "hình ảnh tu từ", en: "rhetorical image", pos: "noun phrase" },
      { ar: "الالتباس", romanization: "al-iltibaas", vi: "sự mơ hồ / lưỡng nghĩa", en: "ambiguity", pos: "noun" },
      { ar: "التناص", romanization: "at-tanaass", vi: "liên văn bản", en: "intertextuality", pos: "noun" },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "ينبغي أن نميّز بين صوت ___ وموقف النص نفسه.",
        answer: "الراوي",
        hint_vi: "Từ chỉ người kể chuyện trong phân tích văn học.",
        hint_en: "The literary-analysis term for the narrator.",
      },
      {
        type: "matching",
        instruction_vi: "Nối thuật ngữ bình giảng với nghĩa tiếng Việt.",
        instruction_en: "Match each close-reading term with its Vietnamese meaning.",
        pairs: [
          { ar: "السرد", meaning_vi: "sự trần thuật", meaning_en: "narration" },
          { ar: "التناص", meaning_vi: "liên văn bản", meaning_en: "intertextuality" },
          { ar: "الالتباس", meaning_vi: "sự mơ hồ", meaning_en: "ambiguity" },
        ],
      },
      {
        type: "translation",
        vi: "Ẩn dụ ở đây có chức năng kiến tạo, không chỉ trang trí.",
        en: "The metaphor here has a structural function, not merely decoration.",
        ar: "تؤدي الاستعارة هنا وظيفة بنائية، لا وظيفة زخرفية فحسب.",
        romanization: "tu'addii al-isti'aaratu hunaa waziifatan binaa'iyyah, laa waziifatan zukhrufiyyatan fahasb.",
      },
    ],
    cultural_notes_vi:
      "Trong bình giảng văn học Ả Rập hiện đại, đừng biến đoạn văn thành tóm tắt cốt truyện. Hãy bắt đầu từ dấu hiệu trong câu: lựa chọn động từ, thứ tự từ, lặp lại, phép bỏ lửng, chuyển giọng, và nhịp dài-ngắn.",
    cultural_notes_en:
      "In modern Arabic literary analysis, do not reduce the passage to plot summary. Start from textual signals: verb choice, word order, repetition, ellipsis, shifts in voice, and long-short sentence rhythm.",
    tip_advice_vi:
      "Mẫu C2 hữu ích: `لا يكتفي X بـ... بل...` = 'X không chỉ..., mà còn...'. Mẫu này giúp bạn nâng câu phân tích từ nhận xét đơn giản lên lập luận.",
    tip_advice_en:
      "Useful C2 frame: `لا يكتفي X بـ... بل...` = 'X does not merely..., but also...'. It turns a simple observation into an analytic argument.",
    register_notes_vi:
      "Văn phong học thuật cao. Tránh khẳng định ý đồ tác giả nếu văn bản không cung cấp chứng cứ.",
    register_notes_en:
      "High academic register. Avoid claiming authorial intention unless the text itself provides evidence.",
  },
  {
    id: "arabic_c2_rhetorical_devices_effect",
    level: "C2",
    category: "rhetoric",
    title_vi: "Tu từ học C2: gọi tên thủ pháp và giải thích hiệu quả",
    title_en: "C2 rhetoric: naming devices and explaining their effect",
    intro_vi:
      "Bài này luyện cách nói về ẩn dụ, hoán dụ, đối lập, song hành, tỉnh lược và câu hỏi tu từ bằng tiếng Ả Rập chuẩn, đồng thời tránh phóng đại tác dụng của chúng.",
    intro_en:
      "This lesson practices discussing metaphor, metonymy, antithesis, parallelism, ellipsis, and rhetorical questions in MSA while avoiding exaggerated claims about their effect.",
    sentences: [
      {
        ar: "تخلق الموازاة إيقاعًا حجاجيًا يجعل الفكرة أكثر رسوخًا.",
        romanization: "takhluqu al-muwaazaah iiqaa'an hijaajiyyan yaj'alu al-fikrata akthara rusuukhan.",
        vi: "Phép song hành tạo nhịp lập luận khiến ý tưởng vững hơn.",
        en: "Parallelism creates an argumentative rhythm that makes the idea more firmly grounded.",
      },
      {
        ar: "لا تكشف الكناية المعنى مباشرة، بل تدفع القارئ إلى استنتاجه.",
        romanization: "laa takshifu al-kinaayah al-ma'naa mubaasharatan, bal tadfa'u al-qaari'a ilaa istintaajih.",
        vi: "Hoán dụ/ẩn ý không phơi bày nghĩa trực tiếp, mà đẩy người đọc tự suy ra.",
        en: "Metonymic implication does not reveal meaning directly; it pushes the reader to infer it.",
      },
      {
        ar: "يقوم الطباق على توتر دلالي بين لفظين متقابلين.",
        romanization: "yaquumu at-tibaaq 'alaa tawatturin dalaaliyyin bayna lafzayni mutaqaabilayn.",
        vi: "Phép đối lập dựa trên căng thẳng nghĩa giữa hai từ đối ứng.",
        en: "Antithesis rests on semantic tension between two opposed terms.",
      },
      {
        ar: "ليس الاستفهام الإنكاري طلبًا للجواب، بل وسيلة لتوجيه الحكم.",
        romanization: "laysa al-istifhaamu al-inkaarii talabaan lil-jawaab, bal wasiilatun litawjiihi al-hukm.",
        vi: "Câu hỏi phủ định tu từ không nhằm xin câu trả lời, mà là cách định hướng phán đoán.",
        en: "A rhetorical negative question does not seek an answer; it guides judgment.",
      },
    ],
    vocabulary: [
      { ar: "استعارة", romanization: "isti'aarah", vi: "ẩn dụ", en: "metaphor", pos: "noun" },
      { ar: "كناية", romanization: "kinaayah", vi: "ẩn ý / hoán dụ theo ngữ cảnh", en: "metonymic implication", pos: "noun" },
      { ar: "طباق", romanization: "tibaaq", vi: "phép đối lập", en: "antithesis", pos: "noun" },
      { ar: "موازاة", romanization: "muwaazaah", vi: "song hành cấu trúc", en: "parallelism", pos: "noun" },
      { ar: "حذف", romanization: "hadhf", vi: "tỉnh lược", en: "ellipsis", pos: "noun" },
      { ar: "استفهام إنكاري", romanization: "istifhaam inkaarii", vi: "câu hỏi phủ định tu từ", en: "rhetorical negative question", pos: "noun phrase" },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "تخلق ___ إيقاعًا حجاجيًا بتكرار البنية.",
        answer: "الموازاة",
        hint_vi: "Thủ pháp lặp lại cấu trúc để tạo nhịp.",
        hint_en: "The device that repeats structure to create rhythm.",
      },
      {
        type: "matching",
        instruction_vi: "Nối thủ pháp với chức năng phân tích.",
        instruction_en: "Match each device with its analytic function.",
        pairs: [
          { ar: "طباق", meaning_vi: "tạo căng thẳng giữa hai cực nghĩa", meaning_en: "creates tension between semantic poles" },
          { ar: "حذف", meaning_vi: "để lại khoảng trống cho suy luận", meaning_en: "leaves a gap for inference" },
          { ar: "استفهام إنكاري", meaning_vi: "định hướng phán đoán hơn là hỏi thật", meaning_en: "guides judgment rather than asking literally" },
        ],
      },
    ],
    cultural_notes_vi:
      "Các thuật ngữ البلاغة có lịch sử dài trong tiếng Ả Rập. Ở khóa học này, chúng được dùng để phân tích hiệu quả ngôn ngữ, không để đánh giá tôn giáo, luật học hay lập trường chính trị.",
    cultural_notes_en:
      "Arabic البلاغة terminology has a long history. In this course it is used to analyze linguistic effect, not to make religious, legal, or political judgments.",
    tip_advice_vi:
      "Công thức an toàn: `تؤدي X وظيفة...` hoặc `يسهم X في...`. Hai mẫu này giúp bạn nói tác dụng của thủ pháp mà không khẳng định quá mức.",
    tip_advice_en:
      "Safe frames: `تؤدي X وظيفة...` and `يسهم X في...`. They let you discuss effect without overclaiming.",
    register_notes_vi:
      "Dùng `قد` hoặc `يمكن أن` khi diễn giải hiệu quả tu từ để giữ mức chắc chắn hợp lý.",
    register_notes_en:
      "Use `قد` or `يمكن أن` when interpreting rhetorical effect to keep certainty calibrated.",
  },
  {
    id: "arabic_c2_formal_debate_rebuttal",
    level: "C2",
    category: "formal_debate",
    title_vi: "Tranh biện trang trọng: phản bác chính xác mà không gay gắt",
    title_en: "Formal debate: precise rebuttal without aggression",
    intro_vi:
      "Bài này luyện phản bác C2 bằng tiếng Ả Rập chuẩn: nhượng bộ có kiểm soát, giới hạn phạm vi, chỉ ra giả định chưa chứng minh, và chuyển gánh nặng chứng minh.",
    intro_en:
      "This lesson practices C2 rebuttal in MSA: controlled concession, scope limitation, identifying unproven assumptions, and shifting the burden of proof.",
    sentences: [
      {
        ar: "حتى لو سلّمنا بهذه المقدمة، فلا يترتب عليها الاستنتاج المذكور بالضرورة.",
        romanization: "hattaa law sallamnaa bihadhihi al-muqaddimah, falaa yatarattabu 'alayhaa al-istintaaju al-madhkuuru bid-daruurah.",
        vi: "Ngay cả nếu ta chấp nhận tiền đề này, kết luận được nêu không tất yếu phát sinh từ nó.",
        en: "Even if we grant this premise, the stated conclusion does not necessarily follow from it.",
      },
      {
        ar: "تقوم هذه الحجة على افتراض غير مسلّم به.",
        romanization: "taquumu haadhihi al-hujjah 'alaa iftiraadin ghayri musallamin bih.",
        vi: "Lập luận này dựa trên một giả định chưa được chấp nhận.",
        en: "This argument rests on an assumption that has not been granted.",
      },
      {
        ar: "ينبغي تحديد نطاق الادعاء قبل مناقشة نتائجه.",
        romanization: "yanbaghii tahdiidu nitaaqi al-iddi'aa' qabla munaaqashati nataa'ijih.",
        vi: "Cần xác định phạm vi của khẳng định trước khi bàn về hệ quả của nó.",
        en: "The scope of the claim should be defined before discussing its consequences.",
      },
      {
        ar: "يقع عبء الإثبات على من يقدّم تعميمًا بهذه الدرجة من الاتساع.",
        romanization: "yaqa'u 'ib'u al-ithbaat 'alaa man yuqaddimu ta'miiman bihadhihi ad-darajati mina al-ittisaa'.",
        vi: "Gánh nặng chứng minh thuộc về người đưa ra một khái quát rộng đến mức này.",
        en: "The burden of proof lies with whoever advances a generalization this broad.",
      },
    ],
    vocabulary: [
      { ar: "المقدمة", romanization: "al-muqaddimah", vi: "tiền đề", en: "premise", pos: "noun" },
      { ar: "الاستنتاج", romanization: "al-istintaaj", vi: "kết luận suy ra", en: "inference / conclusion", pos: "noun" },
      { ar: "الافتراض", romanization: "al-iftiraad", vi: "giả định", en: "assumption", pos: "noun" },
      { ar: "نطاق الادعاء", romanization: "nitaaq al-iddi'aa'", vi: "phạm vi của khẳng định", en: "scope of the claim", pos: "noun phrase" },
      { ar: "عبء الإثبات", romanization: "'ib' al-ithbaat", vi: "gánh nặng chứng minh", en: "burden of proof", pos: "noun phrase" },
    ],
    dialogue: [
      {
        speaker: "المحاور",
        ar: "هل يعني ذلك أنكم ترفضون الفكرة بالكامل؟",
        romanization: "hal ya'nii dhaalika annakum tarfuduuna al-fikrata bilkaamil?",
        vi: "Điều đó có nghĩa là quý vị bác bỏ hoàn toàn ý tưởng này không?",
        en: "Does that mean you reject the idea entirely?",
      },
      {
        speaker: "الباحثة",
        ar: "لا أرفضها بالكامل، لكنني أتحفظ على التعميم الذي بُنيت عليه.",
        romanization: "laa arfuduhaa bilkaamil, lakinnii atahaffazu 'alaa at-ta'miim alladhii buniyat 'alayh.",
        vi: "Tôi không bác bỏ hoàn toàn, nhưng tôi dè dặt với khái quát làm nền cho nó.",
        en: "I do not reject it entirely, but I have reservations about the generalization on which it rests.",
      },
    ],
    exercises: [
      {
        type: "translation",
        vi: "Ngay cả nếu ta chấp nhận tiền đề này, kết luận đó không tất yếu phát sinh.",
        en: "Even if we grant this premise, that conclusion does not necessarily follow.",
        ar: "حتى لو سلّمنا بهذه المقدمة، فلا يترتب عليها ذلك الاستنتاج بالضرورة.",
        romanization: "hattaa law sallamnaa bihadhihi al-muqaddimah, falaa yatarattabu 'alayhaa dhaalika al-istintaaju bid-daruurah.",
      },
      {
        type: "fill-blank",
        question: "يقع ___ على من يقدّم تعميمًا واسعًا.",
        answer: "عبء الإثبات",
        hint_vi: "Cụm chỉ trách nhiệm phải chứng minh.",
        hint_en: "The phrase meaning responsibility to prove a claim.",
      },
    ],
    cultural_notes_vi:
      "Tranh biện trang trọng bằng MSA thường ưu tiên cấu trúc và mức chắc chắn hơn cảm xúc. Phản bác mạnh nhất không nhất thiết là câu gay gắt nhất; thường là câu xác định đúng tiền đề, phạm vi và hệ quả.",
    cultural_notes_en:
      "Formal debate in MSA often prioritizes structure and calibrated certainty over emotional force. The strongest rebuttal is not necessarily the harshest sentence; it is often the one that precisely defines premise, scope, and consequence.",
    tip_advice_vi:
      "Ba bước phản bác: `حتى لو سلّمنا...` để nhượng bộ có điều kiện; `لا يترتب... بالضرورة` để cắt hệ quả; `يقع عبء الإثبات...` để trả lại trách nhiệm chứng minh.",
    tip_advice_en:
      "Three-step rebuttal: `حتى لو سلّمنا...` for conditional concession; `لا يترتب... بالضرورة` to sever the consequence; `يقع عبء الإثبات...` to return the burden of proof.",
    register_notes_vi:
      "Cao, trang trọng, phù hợp tranh luận học thuật hoặc hội thảo. Không dùng như lời công kích cá nhân.",
    register_notes_en:
      "Elevated and formal, suitable for academic debate or seminars. Do not use it as personal attack language.",
  },
  {
    id: "arabic_c2_sensitive_media_discourse",
    level: "C2",
    category: "academic_discourse",
    title_vi: "Diễn ngôn truyền thông nhạy cảm: quy chiếu, thận trọng và quy trách nhiệm nguồn",
    title_en: "Sensitive media discourse: attribution, caution, and source responsibility",
    intro_vi:
      "Bài này luyện phân tích ngôn ngữ báo chí về chủ đề nhạy cảm bằng ví dụ trung lập: quy chiếu nguồn, mức chắc chắn, thuật ngữ gây tranh cãi, câu bị động và khoảng trống thông tin.",
    intro_en:
      "This lesson practices analyzing journalistic language around sensitive topics through neutral examples: source attribution, certainty level, contested terminology, passive voice, and information gaps.",
    sentences: [
      {
        ar: "بحسب البيان، لم يتسن التحقق من جميع التفاصيل بصورة مستقلة.",
        romanization: "bihasabi al-bayaan, lam yatasanna at-tahaqququ min jamii'i at-tafaasiili bisuuratin mustaqillah.",
        vi: "Theo thông cáo, chưa thể xác minh độc lập tất cả các chi tiết.",
        en: "According to the statement, it was not possible to independently verify all details.",
      },
      {
        ar: "يُستخدم المصطلح في بعض المصادر، بينما تعدّه مصادر أخرى مثيرًا للجدل.",
        romanization: "yustakhdamu al-mustalahu fii ba'di al-masaadir, baynamaa ta'udduhu masaadiru ukhraa muthiiran lil-jadal.",
        vi: "Thuật ngữ này được dùng trong một số nguồn, trong khi các nguồn khác coi nó là gây tranh cãi.",
        en: "The term is used in some sources, while other sources regard it as contested.",
      },
      {
        ar: "تختلف التقديرات تبعًا للمنهجية المعتمدة ومصدر البيانات.",
        romanization: "takhtalifu at-taqdiiraat taba'an lil-manhajiyyati al-mu'tamadah wa-masdari al-bayaanaat.",
        vi: "Các ước tính khác nhau tùy theo phương pháp được dùng và nguồn dữ liệu.",
        en: "Estimates differ depending on the methodology used and the data source.",
      },
      {
        ar: "صيغة المبني للمجهول قد تحجب المسؤولية إذا لم تُذكر الجهة الفاعلة.",
        romanization: "siighatu al-mabnii lil-majhuul qad tahjubu al-mas'uuliyyah idhaa lam tudhkar al-jihatu al-faa'ilah.",
        vi: "Thể bị động có thể che khuất trách nhiệm nếu tác nhân không được nêu.",
        en: "The passive voice can obscure responsibility if the acting party is not named.",
      },
    ],
    vocabulary: [
      { ar: "بحسب", romanization: "bihasab", vi: "theo / căn cứ theo", en: "according to", pos: "preposition" },
      { ar: "لم يتسن التحقق", romanization: "lam yatasanna at-tahaqquq", vi: "chưa thể xác minh", en: "verification was not possible", pos: "frame" },
      { ar: "مصطلح مثير للجدل", romanization: "mustalah muthiir lil-jadal", vi: "thuật ngữ gây tranh cãi", en: "contested term", pos: "noun phrase" },
      { ar: "التقديرات", romanization: "at-taqdiiraat", vi: "các ước tính", en: "estimates", pos: "noun" },
      { ar: "المبني للمجهول", romanization: "al-mabnii lil-majhuul", vi: "thể bị động", en: "passive voice", pos: "noun phrase" },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "___ البيان، لم يتسن التحقق من جميع التفاصيل.",
        answer: "بحسب",
        hint_vi: "Khung quy nguồn thường dùng trong báo chí.",
        hint_en: "A common journalistic attribution frame.",
      },
      {
        type: "translation",
        vi: "Các ước tính khác nhau tùy theo phương pháp và nguồn dữ liệu.",
        en: "Estimates differ depending on methodology and data source.",
        ar: "تختلف التقديرات تبعًا للمنهجية ومصدر البيانات.",
        romanization: "takhtalifu at-taqdiiraat taba'an lil-manhajiyyah wa-masdari al-bayaanaat.",
      },
    ],
    cultural_notes_vi:
      "Bài này không dạy kết luận chính trị. Nó dạy cơ chế ngôn ngữ: nguồn nào nói, mức chắc chắn ra sao, thuật ngữ có bị tranh cãi không, và ai bị ẩn khỏi câu. Với chủ đề nhạy cảm, hãy quy nguồn thay vì biến nhận định thành sự thật tuyệt đối.",
    cultural_notes_en:
      "This lesson does not teach political conclusions. It teaches discourse mechanics: who says it, how certain it is, whether a term is contested, and who is hidden from the sentence. On sensitive topics, attribute rather than turn claims into absolutes.",
    tip_advice_vi:
      "Bộ khung an toàn: `بحسب...`, `لم يتسن التحقق...`, `تختلف التقديرات...`, `مصطلح مثير للجدل`. Chúng giúp bạn phân tích mà không tự nhận vai trò kiểm chứng thực tế.",
    tip_advice_en:
      "Safe frames: `بحسب...`, `لم يتسن التحقق...`, `تختلف التقديرات...`, `مصطلح مثير للجدل`. They let you analyze language without pretending to perform fact-checking.",
    register_notes_vi:
      "Báo chí học thuật trung lập. Tránh ví dụ về xung đột hoặc nhóm thật nếu không có brief nghiên cứu riêng.",
    register_notes_en:
      "Neutral academic-journalistic register. Avoid examples about real conflicts or real groups without a separate research brief.",
  },
];

export default lessons;
