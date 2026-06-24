// Punjabi C1 source-based writing pack for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught as a
// separate course here. Native review is deferred.
//
// Text data only: no audio, pronunciation scoring, Azure, auth, billing, RLS,
// Supabase, CI config, or unrelated integrations.

export type PunjabiSourceWritingCategory =
  | "summarize_source"
  | "compare_two_views"
  | "cite_cautiously"
  | "synthesize_evidence"
  | "identify_limitation"
  | "structured_response"
  | "text_examples";

export type PunjabiSourceTextType = "academic" | "public_service";

export type PunjabiSourcePhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiSourceBasedWritingEntry = {
  id: string;
  level: "C1";
  category: PunjabiSourceWritingCategory;
  text_type: PunjabiSourceTextType;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  writing_goal_vi: string;
  writing_goal_en: string;
  source_task_vi: string;
  source_task_en: string;
  source_excerpt: PunjabiSourcePhrase;
  writing_frames: readonly PunjabiSourcePhrase[];
  canada_example: PunjabiSourcePhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
  practice_task_vi: string;
  practice_task_en: string;
};

export const sourceBasedWritingScriptAwareness = {
  vi: "Khóa này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết truyền thống chữ viết Punjabi khác, không phải một khóa học đầy đủ.",
  en: "This course uses Gurmukhi as the primary script. Shahmukhi is mentioned only for awareness of another Punjabi writing tradition, not as a full course.",
} as const;

export const sourceBasedWritingC1: PunjabiSourceBasedWritingEntry[] = [
  {
    id: "pa_c1_sbw_summarize_academic",
    level: "C1",
    category: "summarize_source",
    text_type: "academic",
    title_pa: "ਸਰੋਤ ਦਾ ਨਿਰਪੱਖ ਸਾਰ",
    title_rom: "sarot da nirpakh saar",
    title_vi: "Tóm tắt nguồn một cách trung lập",
    title_en: "Neutral source summary",
    writing_goal_vi: "Tóm tắt luận điểm, bằng chứng, và kết luận của nguồn mà không thêm ý kiến cá nhân.",
    writing_goal_en: "Summarize the source's claim, evidence, and conclusion without adding personal opinion.",
    source_task_vi: "Đọc nguồn học thuật ngắn và viết summary trung lập.",
    source_task_en: "Read a short academic source and write a neutral summary.",
    source_excerpt: {
      pa: "ਲੇਖ ਦਲੀਲ ਦਿੰਦਾ ਹੈ ਕਿ ਲਚਕਦਾਰ ਸਮਾਂ-ਸਾਰਣੀ ਵਿਦਿਆਰਥੀ ਭਾਗੀਦਾਰੀ ਵਧਾ ਸਕਦੀ ਹੈ।",
      rom: "lekh daleel dinda hai ki lachkdaar sama-sarni vidyarthi bhagidari vadha sakdi hai.",
      vi: "Bài viết lập luận rằng lịch học linh hoạt có thể tăng sự tham gia của sinh viên.",
      en: "The article argues that flexible scheduling may increase student participation.",
    },
    writing_frames: [
      {
        pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਇਹ ਹੈ ਕਿ ...",
        rom: "sarot da mukh daava ih hai ki ...",
        vi: "Luận điểm chính của nguồn là...",
        en: "The source's main claim is that...",
      },
      {
        pa: "ਲੇਖਕ ਇਸ ਦਾਅਵੇ ਨੂੰ ... ਨਾਲ ਸਮਰਥਨ ਦਿੰਦਾ ਹੈ।",
        rom: "lekhak is daave nu ... nal samarthan dinda hai.",
        vi: "Tác giả hỗ trợ luận điểm này bằng...",
        en: "The author supports this claim with...",
      },
      {
        pa: "ਸੰਖੇਪ ਵਿੱਚ, ਸਰੋਤ ਨਤੀਜਾ ਕੱਢਦਾ ਹੈ ਕਿ ...",
        rom: "sankhep vich, sarot natija kaddda hai ki ...",
        vi: "Tóm lại, nguồn kết luận rằng...",
        en: "In summary, the source concludes that...",
      },
    ],
    canada_example: {
      context_vi: "Tóm tắt nguồn học thuật về lịch học linh hoạt ở Canada.",
      context_en: "Summarizing an academic source about flexible schedules in Canada.",
      pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਇਹ ਹੈ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਲਚਕਦਾਰ ਕਲਾਸ ਸਮਾਂ ਵਿਦਿਆਰਥੀ ਭਾਗੀਦਾਰੀ ਨੂੰ ਸੁਧਾਰ ਸਕਦਾ ਹੈ।",
      rom: "sarot da mukh daava ih hai ki Canada vich lachkdaar class sama vidyarthi bhagidari nu sudhar sakda hai.",
      vi: "Luận điểm chính của nguồn là ở Canada, thời gian lớp học linh hoạt có thể cải thiện sự tham gia của sinh viên.",
      en: "The source's main claim is that in Canada, flexible class times can improve student participation.",
    },
    learner_traps_vi: [
      "Không đưa nhận xét cá nhân vào summary.",
      "Đừng tóm tắt từng câu; hãy gom luận điểm, bằng chứng, kết luận.",
    ],
    learner_traps_en: [
      "Do not add personal evaluation to a summary.",
      "Do not summarize sentence by sentence; group claim, evidence, and conclusion.",
    ],
    practice_task_vi: "Viết summary 3 câu cho một nguồn học thuật ngắn.",
    practice_task_en: "Write a three-sentence summary for a short academic source.",
  },
  {
    id: "pa_c1_sbw_compare_views",
    level: "C1",
    category: "compare_two_views",
    text_type: "academic",
    title_pa: "ਦੋ ਵਿਚਾਰਾਂ ਦੀ ਤੁਲਨਾ",
    title_rom: "do vicharan di tulna",
    title_vi: "So sánh hai quan điểm",
    title_en: "Comparing two views",
    writing_goal_vi: "Nêu điểm giống, điểm khác, và tiêu chí so sánh của hai nguồn.",
    writing_goal_en: "State similarity, difference, and comparison criterion across two sources.",
    source_task_vi: "Đọc hai nguồn cùng chủ đề và viết đoạn so sánh.",
    source_task_en: "Read two sources on the same topic and write a comparison paragraph.",
    source_excerpt: {
      pa: "ਪਹਿਲਾ ਸਰੋਤ ਫੀਸ ਤੇ ਜ਼ੋਰ ਦਿੰਦਾ ਹੈ, ਜਦਕਿ ਦੂਜਾ ਸਰੋਤ ਰਹਿਣ-ਸਹਿਣ ਦੇ ਖਰਚੇ ਨੂੰ ਮੁੱਖ ਮੰਨਦਾ ਹੈ।",
      rom: "pahila sarot fees te zor dinda hai, jadki duja sarot rehan-sehan de kharche nu mukh mannda hai.",
      vi: "Nguồn thứ nhất nhấn mạnh học phí, trong khi nguồn thứ hai xem chi phí sinh hoạt là chính.",
      en: "The first source emphasizes tuition, whereas the second sees living costs as central.",
    },
    writing_frames: [
      {
        pa: "ਦੋਵੇਂ ਸਰੋਤ ... ਬਾਰੇ ਚਿੰਤਤ ਹਨ।",
        rom: "dovein sarot ... bare chintat han.",
        vi: "Cả hai nguồn đều quan tâm đến...",
        en: "Both sources are concerned with...",
      },
      {
        pa: "ਮੁੱਖ ਫ਼ਰਕ ਇਹ ਹੈ ਕਿ ਪਹਿਲਾ ਸਰੋਤ ..., ਜਦਕਿ ਦੂਜਾ ...",
        rom: "mukh farak ih hai ki pahila sarot ..., jadki duja ...",
        vi: "Khác biệt chính là nguồn thứ nhất..., trong khi nguồn thứ hai...",
        en: "The main difference is that the first source..., whereas the second...",
      },
      {
        pa: "ਇਸ ਤੁਲਨਾ ਤੋਂ ਪਤਾ ਲੱਗਦਾ ਹੈ ਕਿ ...",
        rom: "is tulna ton pata lagda hai ki ...",
        vi: "So sánh này cho thấy rằng...",
        en: "This comparison suggests that...",
      },
    ],
    canada_example: {
      context_vi: "So sánh hai nguồn về chi phí học tập ở Canada.",
      context_en: "Comparing two sources about study costs in Canada.",
      pa: "ਦੋਵੇਂ ਸਰੋਤ ਕੈਨੇਡਾ ਵਿੱਚ ਵਿਦਿਆਰਥੀ ਖਰਚੇ ਬਾਰੇ ਚਿੰਤਤ ਹਨ, ਪਰ ਉਹ ਵੱਖ-ਵੱਖ ਕਾਰਕਾਂ ਨੂੰ ਮੁੱਖ ਮੰਨਦੇ ਹਨ।",
      rom: "dovein sarot Canada vich vidyarthi kharche bare chintat han, par oh vakh-vakh karakan nu mukh mannde han.",
      vi: "Cả hai nguồn đều quan tâm đến chi phí sinh viên ở Canada, nhưng chúng xem các yếu tố khác nhau là chính.",
      en: "Both sources are concerned with student costs in Canada, but they treat different factors as central.",
    },
    learner_traps_vi: [
      "Đừng chỉ nói nguồn A khác nguồn B; hãy nêu khác ở tiêu chí nào.",
      "Điểm giống cũng quan trọng như điểm khác.",
    ],
    learner_traps_en: [
      "Do not only say source A differs from source B; state the criterion.",
      "Similarity is as important as difference.",
    ],
    practice_task_vi: "Viết 4 câu so sánh hai nguồn có cùng chủ đề nhưng khác trọng tâm.",
    practice_task_en: "Write four sentences comparing two sources with the same topic but different focus.",
  },
  {
    id: "pa_c1_sbw_cite_cautiously",
    level: "C1",
    category: "cite_cautiously",
    text_type: "academic",
    title_pa: "ਸਾਵਧਾਨ ਹਵਾਲਾ ਦੇਣਾ",
    title_rom: "savdhan havala dena",
    title_vi: "Trích dẫn thận trọng",
    title_en: "Citing cautiously",
    writing_goal_vi: "Dùng nguồn để hỗ trợ luận điểm mà không phóng đại mức chắc chắn.",
    writing_goal_en: "Use a source to support a claim without overstating certainty.",
    source_task_vi: "Đọc nguồn có ngôn ngữ thận trọng và trích dẫn đúng mức.",
    source_task_en: "Read a cautiously worded source and cite it with the right strength.",
    source_excerpt: {
      pa: "ਸਰਵੇਖਣ ਸੁਝਾਉਂਦਾ ਹੈ ਕਿ ਮਾਰਗਦਰਸ਼ਨ ਸੇਵਾਵਾਂ ਵਿਦਿਆਰਥੀ ਤਣਾਅ ਘਟਾ ਸਕਦੀਆਂ ਹਨ।",
      rom: "sarvekhan sujhaounda hai ki margdarshan sevavan vidyarthi tanaa ghata sakdian han.",
      vi: "Khảo sát gợi ý rằng dịch vụ cố vấn có thể giảm căng thẳng của sinh viên.",
      en: "The survey suggests that advising services may reduce student stress.",
    },
    writing_frames: [
      {
        pa: "ਸਰੋਤ ਸੁਝਾਉਂਦਾ ਹੈ ਕਿ ...",
        rom: "sarot sujhaounda hai ki ...",
        vi: "Nguồn gợi ý rằng...",
        en: "The source suggests that...",
      },
      {
        pa: "ਇਸ ਨੂੰ ਪੱਕਾ ਸਬੂਤ ਨਹੀਂ, ਸਗੋਂ ਇੱਕ ਸੰਕੇਤ ਵਜੋਂ ਪੜ੍ਹਨਾ ਚਾਹੀਦਾ ਹੈ।",
        rom: "is nu pakka sabut nahi, sagon ikk sanket vajon parhna chahida hai.",
        vi: "Điều này nên được đọc như một dấu hiệu, không phải bằng chứng chắc chắn.",
        en: "This should be read as an indication, not conclusive proof.",
      },
      {
        pa: "ਉਪਲਬਧ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਤੇ, ... ਹੋ ਸਕਦਾ ਹੈ।",
        rom: "uplabdh jankari de adhar te, ... ho sakda hai.",
        vi: "Dựa trên thông tin hiện có, ... có thể...",
        en: "Based on the available information, ... may...",
      },
    ],
    canada_example: {
      context_vi: "Trích dẫn thận trọng từ khảo sát sinh viên ở Canada.",
      context_en: "Citing cautiously from a Canadian student survey.",
      pa: "ਉਪਲਬਧ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਤੇ, ਕੈਨੇਡਾ ਵਿੱਚ ਮਾਰਗਦਰਸ਼ਨ ਸੇਵਾਵਾਂ ਕੁਝ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਤਣਾਅ ਘਟਾ ਸਕਦੀਆਂ ਹਨ।",
      rom: "uplabdh jankari de adhar te, Canada vich margdarshan sevavan kujh vidyarthian lai tanaa ghata sakdian han.",
      vi: "Dựa trên thông tin hiện có, ở Canada, dịch vụ cố vấn có thể giảm căng thẳng cho một số sinh viên.",
      en: "Based on available information, advising services in Canada may reduce stress for some students.",
    },
    learner_traps_vi: [
      "Không biến 'gợi ý' thành 'chứng minh'.",
      "Dùng 'một số', 'có thể', 'dựa trên dữ liệu hiện có' khi cần thận trọng.",
    ],
    learner_traps_en: [
      "Do not turn 'suggests' into 'proves'.",
      "Use 'some', 'may', and 'based on available data' when caution is needed.",
    ],
    practice_task_vi: "Viết lại hai câu trích dẫn quá chắc chắn thành câu thận trọng.",
    practice_task_en: "Rewrite two overconfident citations as cautious sentences.",
  },
  {
    id: "pa_c1_sbw_synthesize_evidence",
    level: "C1",
    category: "synthesize_evidence",
    text_type: "academic",
    title_pa: "ਸਬੂਤਾਂ ਨੂੰ ਜੋੜਨਾ",
    title_rom: "sabutan nu jorna",
    title_vi: "Tổng hợp bằng chứng",
    title_en: "Synthesizing evidence",
    writing_goal_vi: "Kết hợp hai nguồn để tạo kết luận chung thay vì tóm tắt riêng lẻ.",
    writing_goal_en: "Combine two sources into a shared conclusion rather than summarizing separately.",
    source_task_vi: "Đọc hai nguồn bổ sung nhau và viết câu tổng hợp.",
    source_task_en: "Read two complementary sources and write a synthesis sentence.",
    source_excerpt: {
      pa: "ਇੱਕ ਸਰੋਤ ਆਰਥਿਕ ਰੁਕਾਵਟਾਂ ਦਿਖਾਉਂਦਾ ਹੈ; ਦੂਜਾ ਸਰੋਤ ਭਾਸ਼ਾਈ ਸਹਾਇਤਾ ਦੀ ਘਾਟ ਦਿਖਾਉਂਦਾ ਹੈ।",
      rom: "ikk sarot arthik rukavatan dikhaounda hai; duja sarot bhashai sahaita di ghat dikhaounda hai.",
      vi: "Một nguồn cho thấy rào cản kinh tế; nguồn thứ hai cho thấy thiếu hỗ trợ ngôn ngữ.",
      en: "One source shows economic barriers; the second shows limited language support.",
    },
    writing_frames: [
      {
        pa: "ਇੱਕੱਠੇ ਪੜ੍ਹਿਆਂ, ਦੋਵੇਂ ਸਰੋਤ ਦੱਸਦੇ ਹਨ ਕਿ ...",
        rom: "ikatthe parhian, dovein sarot dassde han ki ...",
        vi: "Khi đọc cùng nhau, hai nguồn cho thấy rằng...",
        en: "Read together, the two sources show that...",
      },
      {
        pa: "ਪਹਿਲਾ ਸਰੋਤ ... ਦਿਖਾਉਂਦਾ ਹੈ, ਅਤੇ ਦੂਜਾ ਇਸ ਨੂੰ ... ਨਾਲ ਪੂਰਾ ਕਰਦਾ ਹੈ।",
        rom: "pahila sarot ... dikhaounda hai, ate duja is nu ... nal pura karda hai.",
        vi: "Nguồn thứ nhất cho thấy..., và nguồn thứ hai bổ sung bằng...",
        en: "The first source shows..., and the second complements it with...",
      },
      {
        pa: "ਇਸ ਲਈ ਸਾਂਝਾ ਨਤੀਜਾ ਇਹ ਹੈ ਕਿ ...",
        rom: "is lai sanjha natija ih hai ki ...",
        vi: "Vì vậy kết luận chung là...",
        en: "Therefore, the shared conclusion is...",
      },
    ],
    canada_example: {
      context_vi: "Tổng hợp hai nguồn về hỗ trợ sinh viên ở Canada.",
      context_en: "Synthesizing two sources about student support in Canada.",
      pa: "ਇੱਕੱਠੇ ਪੜ੍ਹਿਆਂ, ਦੋਵੇਂ ਸਰੋਤ ਦੱਸਦੇ ਹਨ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਆਰਥਿਕ ਅਤੇ ਭਾਸ਼ਾਈ ਦੋਵੇਂ ਪੱਖਾਂ ਤੋਂ ਲੋੜੀਂਦੀ ਹੈ।",
      rom: "ikatthe parhian, dovein sarot dassde han ki Canada vich vidyarthi sahaita arthik ate bhashai dovein pakkhan ton lorindi hai.",
      vi: "Khi đọc cùng nhau, hai nguồn cho thấy ở Canada hỗ trợ sinh viên cần cả khía cạnh tài chính và ngôn ngữ.",
      en: "Read together, the two sources show that student support in Canada is needed in both financial and language dimensions.",
    },
    learner_traps_vi: [
      "Tổng hợp không phải tóm tắt nguồn A rồi nguồn B riêng rẽ.",
      "Câu tổng hợp cần nêu quan hệ giữa hai nguồn.",
    ],
    learner_traps_en: [
      "Synthesis is not source A summary followed by source B summary.",
      "A synthesis sentence must state the relationship between sources.",
    ],
    practice_task_vi: "Viết một đoạn 5 câu tổng hợp hai nguồn về cùng một vấn đề.",
    practice_task_en: "Write a five-sentence paragraph synthesizing two sources on one issue.",
  },
  {
    id: "pa_c1_sbw_identify_limitation",
    level: "C1",
    category: "identify_limitation",
    text_type: "academic",
    title_pa: "ਸਰੋਤ ਦੀ ਸੀਮਾ ਲਿਖਣਾ",
    title_rom: "sarot di seema likhna",
    title_vi: "Viết về giới hạn của nguồn",
    title_en: "Writing about a source limitation",
    writing_goal_vi: "Nêu giới hạn của nguồn và ảnh hưởng của nó đến cách dùng nguồn.",
    writing_goal_en: "State a source limitation and how it affects source use.",
    source_task_vi: "Đọc nguồn có giới hạn mẫu và viết cách sử dụng nguồn thận trọng.",
    source_task_en: "Read a source with a sample limitation and write how to use it cautiously.",
    source_excerpt: {
      pa: "ਅਧਿਐਨ ਵਿੱਚ ਸਿਰਫ਼ ਵੀਹ ਭਾਗੀਦਾਰ ਸ਼ਾਮਲ ਸਨ।",
      rom: "adhian vich sirf vih bhagidar shamil san.",
      vi: "Nghiên cứu chỉ có hai mươi người tham gia.",
      en: "The study included only twenty participants.",
    },
    writing_frames: [
      {
        pa: "ਇਸ ਸਰੋਤ ਦੀ ਇੱਕ ਸੀਮਾ ਇਹ ਹੈ ਕਿ ...",
        rom: "is sarot di ikk seema ih hai ki ...",
        vi: "Một giới hạn của nguồn này là...",
        en: "One limitation of this source is that...",
      },
      {
        pa: "ਇਸ ਕਰਕੇ ਇਸ ਦੇ ਨਤੀਜਿਆਂ ਨੂੰ ... ਲਈ ਸਾਵਧਾਨੀ ਨਾਲ ਵਰਤਣਾ ਚਾਹੀਦਾ ਹੈ।",
        rom: "is karke is de natijian nu ... lai savdhani nal vartna chahida hai.",
        vi: "Vì vậy, kết quả của nó nên được dùng thận trọng cho...",
        en: "Therefore, its findings should be used cautiously for...",
      },
      {
        pa: "ਫਿਰ ਵੀ, ਸਰੋਤ ... ਬਾਰੇ ਲਾਭਦਾਇਕ ਝਲਕ ਦਿੰਦਾ ਹੈ।",
        rom: "phir vi, sarot ... bare labhdayak jhalak dinda hai.",
        vi: "Tuy vậy, nguồn vẫn cung cấp góc nhìn hữu ích về...",
        en: "Nevertheless, the source offers useful insight into...",
      },
    ],
    canada_example: {
      context_vi: "Viết về giới hạn của khảo sát nhỏ tại Canada.",
      context_en: "Writing about the limitation of a small survey in Canada.",
      pa: "ਇਸ ਸਰੋਤ ਦੀ ਇੱਕ ਸੀਮਾ ਇਹ ਹੈ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਸਿਰਫ਼ ਇੱਕ ਕੈਂਪਸ ਦੇ ਵਿਦਿਆਰਥੀ ਸ਼ਾਮਲ ਸਨ।",
      rom: "is sarot di ikk seema ih hai ki Canada vich sirf ikk campus de vidyarthi shamil san.",
      vi: "Một giới hạn của nguồn này là ở Canada chỉ có sinh viên từ một cơ sở được đưa vào.",
      en: "One limitation of this source is that in Canada only students from one campus were included.",
    },
    learner_traps_vi: [
      "Nêu giới hạn không có nghĩa là bác bỏ toàn bộ nguồn.",
      "Sau giới hạn, hãy nói nguồn vẫn dùng được cho mục đích nào.",
    ],
    learner_traps_en: [
      "Naming a limitation does not mean rejecting the entire source.",
      "After the limitation, state what the source is still useful for.",
    ],
    practice_task_vi: "Viết 3 câu: giới hạn, ảnh hưởng, giá trị còn lại của nguồn.",
    practice_task_en: "Write three sentences: limitation, effect, remaining value of the source.",
  },
  {
    id: "pa_c1_sbw_structured_response_academic",
    level: "C1",
    category: "structured_response",
    text_type: "academic",
    title_pa: "ਸੰਰਚਿਤ ਅਕਾਦਮਿਕ ਜਵਾਬ",
    title_rom: "sanrachit academic jawab",
    title_vi: "Phản hồi học thuật có cấu trúc",
    title_en: "Structured academic response",
    writing_goal_vi: "Viết phản hồi theo cấu trúc: tóm tắt nguồn, đánh giá, lập trường của bạn.",
    writing_goal_en: "Write a response with source summary, evaluation, and your position.",
    source_task_vi: "Đọc một luận điểm học thuật và viết phản hồi ba phần.",
    source_task_en: "Read an academic claim and write a three-part response.",
    source_excerpt: {
      pa: "ਲੇਖ ਕਹਿੰਦਾ ਹੈ ਕਿ ਵਿਦਿਆਰਥੀ ਸਫ਼ਲਤਾ ਲਈ ਸਿਰਫ਼ ਵਿਅਕਤੀਗਤ ਮਿਹਨਤ ਜ਼ਰੂਰੀ ਹੈ।",
      rom: "lekh kehnda hai ki vidyarthi safalta lai sirf viaktigat mehnat zaruri hai.",
      vi: "Bài viết nói rằng chỉ nỗ lực cá nhân là cần thiết cho thành công của sinh viên.",
      en: "The article says that only individual effort is necessary for student success.",
    },
    writing_frames: [
      {
        pa: "ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਸਰੋਤ ਦਾ ਦਾਅਵਾ ਹੈ ਕਿ ...",
        rom: "sabh ton pahilan, sarot da daava hai ki ...",
        vi: "Trước hết, nguồn lập luận rằng...",
        en: "First, the source claims that...",
      },
      {
        pa: "ਇਹ ਦਾਅਵਾ ਲਾਭਦਾਇਕ ਹੈ, ਪਰ ਇਹ ... ਨੂੰ ਘੱਟ ਮਹੱਤਵ ਦਿੰਦਾ ਹੈ।",
        rom: "ih daava labhdayak hai, par ih ... nu ghatt mahatav dinda hai.",
        vi: "Luận điểm này hữu ích, nhưng nó đánh giá thấp...",
        en: "This claim is useful, but it gives too little weight to...",
      },
      {
        pa: "ਮੇਰੀ ਸਥਿਤੀ ਇਹ ਹੈ ਕਿ ...",
        rom: "meri sthiti ih hai ki ...",
        vi: "Lập trường của tôi là...",
        en: "My position is that...",
      },
    ],
    canada_example: {
      context_vi: "Viết phản hồi học thuật về thành công sinh viên ở Canada.",
      context_en: "Writing an academic response about student success in Canada.",
      pa: "ਮੇਰੀ ਸਥਿਤੀ ਇਹ ਹੈ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਵਿਦਿਆਰਥੀ ਸਫ਼ਲਤਾ ਵਿਅਕਤੀਗਤ ਮਿਹਨਤ ਅਤੇ ਸੰਸਥਾਗਤ ਸਹਾਇਤਾ ਦੋਵਾਂ ਨਾਲ ਜੁੜੀ ਹੈ।",
      rom: "meri sthiti ih hai ki Canada vich vidyarthi safalta viaktigat mehnat ate sansthagat sahaita dovan nal judi hai.",
      vi: "Lập trường của tôi là ở Canada, thành công của sinh viên liên quan đến cả nỗ lực cá nhân và hỗ trợ từ cơ sở giáo dục.",
      en: "My position is that in Canada, student success is linked to both individual effort and institutional support.",
    },
    learner_traps_vi: [
      "Đừng phản hồi trước khi tóm tắt đúng nguồn.",
      "Phản hồi C1 cần lập trường rõ nhưng có điều kiện.",
    ],
    learner_traps_en: [
      "Do not respond before accurately summarizing the source.",
      "A C1 response needs a clear but qualified position.",
    ],
    practice_task_vi: "Viết phản hồi 180 từ gồm summary, evaluation, position.",
    practice_task_en: "Write a 180-word response with summary, evaluation, and position.",
  },
  {
    id: "pa_c1_sbw_public_service_response",
    level: "C1",
    category: "structured_response",
    text_type: "public_service",
    title_pa: "ਜਨਤਕ ਸੇਵਾ ਸਰੋਤ ਨੂੰ ਜਵਾਬ",
    title_rom: "jantak seva sarot nu jawab",
    title_vi: "Phản hồi nguồn dịch vụ công",
    title_en: "Responding to a public-service source",
    writing_goal_vi: "Tóm tắt yêu cầu trong thông báo và viết phản hồi làm rõ thông tin còn thiếu.",
    writing_goal_en: "Summarize the notice requirement and write a response clarifying missing information.",
    source_task_vi: "Đọc thông báo dịch vụ công và viết email hỏi rõ thông tin còn thiếu.",
    source_task_en: "Read a public-service notice and write an email asking for missing information.",
    source_excerpt: {
      pa: "ਯੋਗ ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਲਈ ਆਨਲਾਈਨ ਅਰਜ਼ੀ ਦੇ ਸਕਦੇ ਹਨ। ਵੇਰਵੇ ਬਾਅਦ ਵਿੱਚ ਦਿੱਤੇ ਜਾਣਗੇ।",
      rom: "yog vidyarthi sahaita lai online arzi de sakde han. verve baad vich ditte jaange.",
      vi: "Sinh viên đủ điều kiện có thể nộp đơn hỗ trợ trực tuyến. Chi tiết sẽ được cung cấp sau.",
      en: "Eligible students may apply online for support. Details will be provided later.",
    },
    writing_frames: [
      {
        pa: "ਸੂਚਨਾ ਮੁਤਾਬਕ, ਯੋਗ ਵਿਦਿਆਰਥੀ ... ਕਰ ਸਕਦੇ ਹਨ।",
        rom: "suchna mutabak, yog vidyarthi ... kar sakde han.",
        vi: "Theo thông báo, sinh viên đủ điều kiện có thể...",
        en: "According to the notice, eligible students may...",
      },
      {
        pa: "ਹਾਲਾਂਕਿ, ਯੋਗਤਾ ਦੇ ਮਾਪਦੰਡ ਹਾਲੇ ਸਪਸ਼ਟ ਨਹੀਂ ਹਨ।",
        rom: "halanki, yogta de mapdand hale spasht nahi han.",
        vi: "Tuy nhiên, tiêu chí đủ điều kiện vẫn chưa rõ.",
        en: "However, the eligibility criteria are not yet clear.",
      },
      {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਸਪਸ਼ਟ ਕਰੋ ਕਿ ...",
        rom: "kirpa karke spasht karo ki ...",
        vi: "Xin vui lòng làm rõ liệu...",
        en: "Please clarify whether...",
      },
    ],
    canada_example: {
      context_vi: "Phản hồi thông báo hỗ trợ sinh viên tại Canada.",
      context_en: "Responding to a student-support notice in Canada.",
      pa: "ਸੂਚਨਾ ਮੁਤਾਬਕ, ਕੈਨੇਡਾ ਵਿੱਚ ਯੋਗ ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਲਈ ਅਰਜ਼ੀ ਦੇ ਸਕਦੇ ਹਨ, ਪਰ ਯੋਗਤਾ ਦੇ ਮਾਪਦੰਡ ਹਾਲੇ ਸਪਸ਼ਟ ਨਹੀਂ ਹਨ।",
      rom: "suchna mutabak, Canada vich yog vidyarthi sahaita lai arzi de sakde han, par yogta de mapdand hale spasht nahi han.",
      vi: "Theo thông báo, ở Canada sinh viên đủ điều kiện có thể nộp đơn hỗ trợ, nhưng tiêu chí đủ điều kiện vẫn chưa rõ.",
      en: "According to the notice, eligible students in Canada may apply for support, but the eligibility criteria are not yet clear.",
    },
    learner_traps_vi: [
      "Đừng giả định điều kiện nếu thông báo không nêu.",
      "Phản hồi nên hỏi rõ thông tin còn thiếu bằng giọng lịch sự.",
    ],
    learner_traps_en: [
      "Do not assume conditions if the notice does not state them.",
      "A response should ask for missing information politely.",
    ],
    practice_task_vi: "Viết email 100 từ hỏi rõ điều kiện từ một thông báo dịch vụ công.",
    practice_task_en: "Write a 100-word email asking for clarification from a public-service notice.",
  },
  {
    id: "pa_c1_sbw_mixed_synthesis",
    level: "C1",
    category: "text_examples",
    text_type: "public_service",
    title_pa: "ਅਕਾਦਮਿਕ ਅਤੇ ਸੇਵਾ ਸਰੋਤ ਜੋੜਨਾ",
    title_rom: "academic ate seva sarot jorna",
    title_vi: "Kết hợp nguồn học thuật và dịch vụ công",
    title_en: "Combining academic and public-service sources",
    writing_goal_vi: "Kết hợp một nguồn học thuật và một thông báo dịch vụ để viết đề xuất thực tế.",
    writing_goal_en: "Combine an academic source and a service notice to write a practical recommendation.",
    source_task_vi: "Đọc một nguồn học thuật và một thông báo dịch vụ công rồi viết đề xuất.",
    source_task_en: "Read one academic source and one public-service notice, then write a recommendation.",
    source_excerpt: {
      pa: "ਅਧਿਐਨ ਤਣਾਅ ਘਟਾਉਣ ਲਈ ਮਾਰਗਦਰਸ਼ਨ ਨੂੰ ਮਹੱਤਵ ਦਿੰਦਾ ਹੈ; ਸੇਵਾ ਨੋਟ ਸਿਰਫ਼ ਆਨਲਾਈਨ ਫਾਰਮ ਦਾ ਜ਼ਿਕਰ ਕਰਦਾ ਹੈ।",
      rom: "adhian tanaa ghataun lai margdarshan nu mahatav dinda hai; seva note sirf online form da zikar karda hai.",
      vi: "Nghiên cứu coi cố vấn là quan trọng để giảm căng thẳng; thông báo dịch vụ chỉ nhắc đến mẫu trực tuyến.",
      en: "The study values advising for reducing stress; the service notice only mentions an online form.",
    },
    writing_frames: [
      {
        pa: "ਅਕਾਦਮਿਕ ਸਰੋਤ ... ਨੂੰ ਮਹੱਤਵ ਦਿੰਦਾ ਹੈ, ਜਦਕਿ ਸੇਵਾ ਸਰੋਤ ... ਤੇ ਕੇਂਦਰਿਤ ਹੈ।",
        rom: "academic sarot ... nu mahatav dinda hai, jadki seva sarot ... te kendrit hai.",
        vi: "Nguồn học thuật coi trọng..., trong khi nguồn dịch vụ tập trung vào...",
        en: "The academic source values..., while the service source focuses on...",
      },
      {
        pa: "ਦੋਵੇਂ ਸਰੋਤ ਮਿਲ ਕੇ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ...",
        rom: "dovein sarot mil ke sujhaounde han ki ...",
        vi: "Hai nguồn kết hợp gợi ý rằng...",
        en: "Together, the two sources suggest that...",
      },
      {
        pa: "ਇੱਕ ਵਿਆਵਹਾਰਿਕ ਸਿਫਾਰਸ਼ ਇਹ ਹੋਵੇਗੀ ਕਿ ...",
        rom: "ikk viavaharik sifarash ih hovegi ki ...",
        vi: "Một khuyến nghị thực tế là...",
        en: "One practical recommendation would be that...",
      },
    ],
    canada_example: {
      context_vi: "Tổng hợp nguồn học thuật và thông báo dịch vụ ở Canada.",
      context_en: "Synthesizing an academic source and a service notice in Canada.",
      pa: "ਦੋਵੇਂ ਸਰੋਤ ਮਿਲ ਕੇ ਸੁਝਾਉਂਦੇ ਹਨ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਆਨਲਾਈਨ ਫਾਰਮ ਦੇ ਨਾਲ ਵਿਅਕਤੀਗਤ ਮਾਰਗਦਰਸ਼ਨ ਵੀ ਲੋੜੀਂਦਾ ਹੈ।",
      rom: "dovein sarot mil ke sujhaounde han ki Canada vich online form de nal viaktigat margdarshan vi lorinda hai.",
      vi: "Hai nguồn kết hợp gợi ý rằng ở Canada, bên cạnh mẫu trực tuyến cũng cần cố vấn cá nhân.",
      en: "Together, the two sources suggest that in Canada, personal advising is needed alongside the online form.",
    },
    learner_traps_vi: [
      "Nguồn dịch vụ công thường nói hành động; nguồn học thuật thường giải thích lý do.",
      "Đề xuất nên dựa trên cả hai nguồn, không chỉ nguồn bạn thích hơn.",
    ],
    learner_traps_en: [
      "A service source often states action; an academic source often explains why.",
      "A recommendation should use both sources, not only the one you prefer.",
    ],
    practice_task_vi: "Viết đề xuất 5 câu dựa trên một nghiên cứu và một thông báo.",
    practice_task_en: "Write a five-sentence recommendation based on one study and one notice.",
  },
];
