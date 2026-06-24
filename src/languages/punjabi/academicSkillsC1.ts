// Punjabi C1 academic skills for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught as a
// separate course here. Native review is deferred.
//
// Text data only: no audio, pronunciation scoring, Azure, auth, billing, RLS,
// Supabase, CI config, or integrations.

export type PunjabiAcademicSkillCategory =
  | "summarize_argument"
  | "compare_sources"
  | "cautious_claims"
  | "cause_effect"
  | "evidence"
  | "academic_disagreement"
  | "essay_paragraph_frames"
  | "presentation_phrases";

export type PunjabiAcademicSkillPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiAcademicSkillExample = PunjabiAcademicSkillPhrase & {
  context_vi: string;
  context_en: string;
};

export type PunjabiAcademicSkill = {
  id: string;
  level: "C1";
  category: PunjabiAcademicSkillCategory;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  skill_goal_vi: string;
  skill_goal_en: string;
  core_phrases: readonly PunjabiAcademicSkillPhrase[];
  canada_example: PunjabiAcademicSkillExample;
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
  practice_task_vi: string;
  practice_task_en: string;
};

export const scriptAwareness = {
  vi: "Khóa này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết cộng đồng chữ viết Punjabi khác, không phải một khóa học đầy đủ.",
  en: "This course uses Gurmukhi as the primary script. Shahmukhi is mentioned only for awareness of another Punjabi writing tradition, not as a full course.",
} as const;

export const academicSkillsC1: PunjabiAcademicSkill[] = [
  {
    id: "pa_c1_skill_summarize_argument",
    level: "C1",
    category: "summarize_argument",
    title_pa: "ਦਲੀਲ ਦਾ ਸੰਖੇਪ ਸਾਰ",
    title_rom: "daleel da sankhep saar",
    title_vi: "Tóm tắt lập luận",
    title_en: "Summarizing an argument",
    skill_goal_vi: "Nêu luận điểm chính, bằng chứng, và kết luận mà không thêm ý kiến cá nhân.",
    skill_goal_en: "State the main claim, evidence, and conclusion without adding personal opinion.",
    core_phrases: [
      {
        pa: "ਲੇਖਕ ਦੀ ਮੁੱਖ ਦਲੀਲ ਇਹ ਹੈ ਕਿ ...",
        rom: "lekhak di mukh daleel ih hai ki ...",
        vi: "Luận điểm chính của tác giả là...",
        en: "The author's main argument is that...",
      },
      {
        pa: "ਇਸ ਦਲੀਲ ਨੂੰ ... ਨਾਲ ਸਮਰਥਨ ਮਿਲਦਾ ਹੈ।",
        rom: "is daleel nu ... nal samarthan milda hai.",
        vi: "Lập luận này được hỗ trợ bởi...",
        en: "This argument is supported by...",
      },
      {
        pa: "ਸੰਖੇਪ ਵਿੱਚ, ਨਤੀਜਾ ਇਹ ਹੈ ਕਿ ...",
        rom: "sankhep vich, natija ih hai ki ...",
        vi: "Tóm lại, kết luận là...",
        en: "In summary, the conclusion is...",
      },
    ],
    canada_example: {
      context_vi: "Tóm tắt một bài đọc về học phí đại học ở Canada.",
      context_en: "Summarizing a reading about university tuition in Canada.",
      pa: "ਲੇਖਕ ਦੀ ਮੁੱਖ ਦਲੀਲ ਇਹ ਹੈ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਸਿਰਫ਼ ਫੀਸ ਘਟਾਉਣ ਨਾਲ ਪੂਰੀ ਨਹੀਂ ਹੁੰਦੀ।",
      rom: "lekhak di mukh daleel ih hai ki Canada vich vidyarthi sahaita sirf fees ghataun nal puri nahi hundi.",
      vi: "Luận điểm chính của tác giả là ở Canada, hỗ trợ sinh viên không thể chỉ hoàn thành bằng cách giảm học phí.",
      en: "The author's main argument is that in Canada, student support is not solved only by lowering tuition.",
    },
    learner_traps_vi: [
      "Đừng biến tóm tắt thành phản biện; giữ giọng trung lập trước.",
      "Không liệt kê mọi chi tiết nhỏ; chọn luận điểm, bằng chứng, kết luận.",
    ],
    learner_traps_en: [
      "Do not turn a summary into a critique; keep a neutral voice first.",
      "Do not list every small detail; choose claim, evidence, conclusion.",
    ],
    practice_task_vi: "Tóm tắt một đoạn 150 từ bằng 3 câu Punjabi: luận điểm, bằng chứng, kết luận.",
    practice_task_en: "Summarize a 150-word paragraph in three Punjabi sentences: claim, evidence, conclusion.",
  },
  {
    id: "pa_c1_skill_compare_sources",
    level: "C1",
    category: "compare_sources",
    title_pa: "ਦੋ ਸਰੋਤਾਂ ਦੀ ਤੁਲਨਾ",
    title_rom: "do sarotan di tulna",
    title_vi: "So sánh hai nguồn",
    title_en: "Comparing two sources",
    skill_goal_vi: "Chỉ ra điểm giống, điểm khác, và mức độ tin cậy của hai nguồn.",
    skill_goal_en: "Identify similarity, difference, and reliability across two sources.",
    core_phrases: [
      {
        pa: "ਪਹਿਲਾ ਸਰੋਤ ... ਤੇ ਜ਼ੋਰ ਦਿੰਦਾ ਹੈ, ਜਦਕਿ ਦੂਜਾ ਸਰੋਤ ... ਨੂੰ ਮਹੱਤਵ ਦਿੰਦਾ ਹੈ।",
        rom: "pahila sarot ... te zor dinda hai, jadki duja sarot ... nu mahatav dinda hai.",
        vi: "Nguồn thứ nhất nhấn mạnh..., trong khi nguồn thứ hai coi trọng...",
        en: "The first source emphasizes..., whereas the second source gives importance to...",
      },
      {
        pa: "ਦੋਵਾਂ ਸਰੋਤਾਂ ਵਿੱਚ ਸਾਂਝੀ ਗੱਲ ਇਹ ਹੈ ਕਿ ...",
        rom: "dovan sarotan vich sanjhi gall ih hai ki ...",
        vi: "Điểm chung giữa hai nguồn là...",
        en: "The shared point between the two sources is...",
      },
      {
        pa: "ਭਰੋਸੇਯੋਗਤਾ ਦੇ ਪੱਖੋਂ, ...",
        rom: "bharoseyogta de pakkhon, ...",
        vi: "Về mặt độ tin cậy,...",
        en: "In terms of reliability,...",
      },
    ],
    canada_example: {
      context_vi: "So sánh trang chính phủ Canada và một bài blog về nhà ở.",
      context_en: "Comparing a Canadian government page and a blog post about housing.",
      pa: "ਭਰੋਸੇਯੋਗਤਾ ਦੇ ਪੱਖੋਂ, ਸਰਕਾਰੀ ਸਰੋਤ ਅੰਕੜਿਆਂ ਲਈ ਮਜ਼ਬੂਤ ਹੈ, ਜਦਕਿ ਬਲੌਗ ਨਿੱਜੀ ਤਜਰਬਾ ਦਿਖਾਉਂਦਾ ਹੈ।",
      rom: "bharoseyogta de pakkhon, sarkari sarot ankrian lai mazbut hai, jadki blog nijji tajraba dikhaounda hai.",
      vi: "Về độ tin cậy, nguồn chính phủ mạnh về số liệu, còn blog thể hiện trải nghiệm cá nhân.",
      en: "In terms of reliability, the government source is strong for data, while the blog shows personal experience.",
    },
    learner_traps_vi: [
      "Đừng nói hai nguồn 'giống nhau' nếu chúng chỉ cùng chủ đề nhưng khác mục đích.",
      "Phân biệt dữ liệu, ý kiến, và trải nghiệm cá nhân.",
    ],
    learner_traps_en: [
      "Do not say two sources are 'the same' if they only share a topic but differ in purpose.",
      "Distinguish data, opinion, and personal experience.",
    ],
    practice_task_vi: "So sánh một nguồn chính thức và một nguồn truyền thông bằng 4 câu.",
    practice_task_en: "Compare an official source and a media source in four sentences.",
  },
  {
    id: "pa_c1_skill_cautious_claims",
    level: "C1",
    category: "cautious_claims",
    title_pa: "ਸਾਵਧਾਨ ਦਾਅਵੇ",
    title_rom: "savdhan daave",
    title_vi: "Tuyên bố thận trọng",
    title_en: "Making cautious claims",
    skill_goal_vi: "Dùng ngôn ngữ có điều kiện khi bằng chứng chưa đủ tuyệt đối.",
    skill_goal_en: "Use qualified language when evidence is not absolute.",
    core_phrases: [
      {
        pa: "ਇਹ ਸੰਭਵ ਹੈ ਕਿ ...",
        rom: "ih sambhav hai ki ...",
        vi: "Có khả năng là...",
        en: "It is possible that...",
      },
      {
        pa: "ਉਪਲਬਧ ਸਬੂਤਾਂ ਦੇ ਆਧਾਰ ਤੇ, ...",
        rom: "uplabdh sabutan de adhar te, ...",
        vi: "Dựa trên bằng chứng hiện có,...",
        en: "Based on the available evidence,...",
      },
      {
        pa: "ਇਸ ਨਤੀਜੇ ਨੂੰ ਸਾਵਧਾਨੀ ਨਾਲ ਪੜ੍ਹਨਾ ਚਾਹੀਦਾ ਹੈ।",
        rom: "is natije nu savdhani nal parhna chahida hai.",
        vi: "Kết quả này nên được đọc một cách thận trọng.",
        en: "This result should be interpreted with caution.",
      },
    ],
    canada_example: {
      context_vi: "Đưa nhận định về dữ liệu việc làm sinh viên ở Canada.",
      context_en: "Making a claim about student employment data in Canada.",
      pa: "ਉਪਲਬਧ ਸਬੂਤਾਂ ਦੇ ਆਧਾਰ ਤੇ, ਕੈਨੇਡਾ ਵਿੱਚ ਅੰਤਰਰਾਸ਼ਟਰੀ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਪਾਰਟ-ਟਾਈਮ ਕੰਮ ਮਦਦਗਾਰ ਹੋ ਸਕਦਾ ਹੈ।",
      rom: "uplabdh sabutan de adhar te, Canada vich antarrashtri vidyarthian lai part-time kam madadgar ho sakda hai.",
      vi: "Dựa trên bằng chứng hiện có, việc làm bán thời gian có thể hữu ích cho sinh viên quốc tế ở Canada.",
      en: "Based on available evidence, part-time work may be helpful for international students in Canada.",
    },
    learner_traps_vi: [
      "Tránh khẳng định tuyệt đối như 'luôn luôn' nếu dữ liệu không chứng minh điều đó.",
      "Không lạm dụng 'có thể' đến mức câu mất lập trường.",
    ],
    learner_traps_en: [
      "Avoid absolute claims like 'always' when the data does not prove that.",
      "Do not overuse 'may' so much that the sentence loses its stance.",
    ],
    practice_task_vi: "Viết lại ba câu quá chắc chắn thành ba câu học thuật thận trọng.",
    practice_task_en: "Rewrite three overconfident sentences as cautious academic claims.",
  },
  {
    id: "pa_c1_skill_cause_effect",
    level: "C1",
    category: "cause_effect",
    title_pa: "ਕਾਰਨ ਅਤੇ ਪ੍ਰਭਾਵ",
    title_rom: "karan ate prabhav",
    title_vi: "Nguyên nhân và tác động",
    title_en: "Cause and effect",
    skill_goal_vi: "Phân biệt nguyên nhân trực tiếp, yếu tố góp phần, và kết quả.",
    skill_goal_en: "Distinguish direct cause, contributing factor, and outcome.",
    core_phrases: [
      {
        pa: "... ਸਿੱਧਾ ਕਾਰਨ ਨਹੀਂ, ਪਰ ਇੱਕ ਮਹੱਤਵਪੂਰਨ ਕਾਰਕ ਹੈ।",
        rom: "... siddha karan nahi, par ikk mahatvapuran karak hai.",
        vi: "... không phải nguyên nhân trực tiếp, nhưng là một yếu tố quan trọng.",
        en: "... is not a direct cause, but it is an important factor.",
      },
      {
        pa: "ਇਸ ਦੇ ਨਤੀਜੇ ਵਜੋਂ ...",
        rom: "is de natije vajon ...",
        vi: "Kết quả là...",
        en: "As a result,...",
      },
      {
        pa: "ਇਸ ਸੰਬੰਧ ਨੂੰ ਸਿਰਫ਼ ਕਾਰਨ-ਪ੍ਰਭਾਵ ਵਜੋਂ ਨਹੀਂ ਸਮਝਣਾ ਚਾਹੀਦਾ।",
        rom: "is sambandh nu sirf karan-prabhav vajon nahi samajhna chahida.",
        vi: "Không nên hiểu quan hệ này chỉ như nhân-quả đơn giản.",
        en: "This relationship should not be understood as simple cause and effect.",
      },
    ],
    canada_example: {
      context_vi: "Nói về chi phí nhà ở và lựa chọn học tập ở Canada.",
      context_en: "Discussing housing costs and study choices in Canada.",
      pa: "ਮਹਿੰਗਾ ਕਿਰਾਇਆ ਸਿੱਧਾ ਕਾਰਨ ਨਹੀਂ, ਪਰ ਵਿਦਿਆਰਥੀ ਦੇ ਕੰਮ ਦੇ ਘੰਟਿਆਂ ਲਈ ਇੱਕ ਮਹੱਤਵਪੂਰਨ ਕਾਰਕ ਹੈ।",
      rom: "mahinga kiraya siddha karan nahi, par vidyarthi de kam de ghantian lai ikk mahatvapuran karak hai.",
      vi: "Tiền thuê đắt không phải nguyên nhân trực tiếp, nhưng là yếu tố quan trọng đối với số giờ làm việc của sinh viên.",
      en: "High rent is not the direct cause, but it is an important factor in a student's work hours.",
    },
    learner_traps_vi: [
      "Đừng biến tương quan thành quan hệ nhân quả nếu chưa có chứng cứ.",
      "Nêu rõ 'yếu tố góp phần' khi có nhiều nguyên nhân.",
    ],
    learner_traps_en: [
      "Do not turn correlation into causation without evidence.",
      "Use 'contributing factor' when there are multiple causes.",
    ],
    practice_task_vi: "Giải thích một vấn đề xã hội bằng nguyên nhân trực tiếp, yếu tố góp phần, và hậu quả.",
    practice_task_en: "Explain a social issue using direct cause, contributing factor, and consequence.",
  },
  {
    id: "pa_c1_skill_evidence",
    level: "C1",
    category: "evidence",
    title_pa: "ਸਬੂਤ ਦੀ ਵਰਤੋਂ",
    title_rom: "sabut di varton",
    title_vi: "Sử dụng bằng chứng",
    title_en: "Using evidence",
    skill_goal_vi: "Đưa bằng chứng, giải thích ý nghĩa, và nối lại với luận điểm.",
    skill_goal_en: "Present evidence, explain its meaning, and link it back to the claim.",
    core_phrases: [
      {
        pa: "ਇੱਕ ਮਹੱਤਵਪੂਰਨ ਸਬੂਤ ਇਹ ਹੈ ਕਿ ...",
        rom: "ikk mahatvapuran sabut ih hai ki ...",
        vi: "Một bằng chứng quan trọng là...",
        en: "One important piece of evidence is that...",
      },
      {
        pa: "ਇਸ ਸਬੂਤ ਤੋਂ ਪਤਾ ਲੱਗਦਾ ਹੈ ਕਿ ...",
        rom: "is sabut ton pata lagda hai ki ...",
        vi: "Bằng chứng này cho thấy rằng...",
        en: "This evidence suggests that...",
      },
      {
        pa: "ਇਹ ਗੱਲ ਮੁੱਖ ਦਲੀਲ ਨਾਲ ਇਸ ਤਰ੍ਹਾਂ ਜੁੜਦੀ ਹੈ ਕਿ ...",
        rom: "ih gall mukh daleel nal is tarah jurdi hai ki ...",
        vi: "Điều này liên kết với luận điểm chính ở chỗ...",
        en: "This connects to the main argument in that...",
      },
    ],
    canada_example: {
      context_vi: "Dùng bằng chứng trong đoạn văn về giao thông công cộng Canada.",
      context_en: "Using evidence in a paragraph about Canadian public transport.",
      pa: "ਇਸ ਸਬੂਤ ਤੋਂ ਪਤਾ ਲੱਗਦਾ ਹੈ ਕਿ ਵੱਡੇ ਕੈਨੇਡੀਅਨ ਸ਼ਹਿਰਾਂ ਵਿੱਚ ਆਵਾਜਾਈ ਦੀ ਪਹੁੰਚ ਵਿਦਿਆਰਥੀ ਜੀਵਨ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰਦੀ ਹੈ।",
      rom: "is sabut ton pata lagda hai ki vadde Canadian shehran vich aavajai di pahunch vidyarthi jeevan nu prabhavit kardi hai.",
      vi: "Bằng chứng này cho thấy khả năng tiếp cận giao thông ở các thành phố lớn của Canada ảnh hưởng đến đời sống sinh viên.",
      en: "This evidence suggests that transit access in large Canadian cities affects student life.",
    },
    learner_traps_vi: [
      "Không thả số liệu vào đoạn văn rồi bỏ đó; phải giải thích ý nghĩa.",
      "Một ví dụ cá nhân không thay thế được bằng chứng rộng nếu đề yêu cầu phân tích học thuật.",
    ],
    learner_traps_en: [
      "Do not drop a statistic into a paragraph and leave it unexplained.",
      "A personal example does not replace broader evidence when the task asks for academic analysis.",
    ],
    practice_task_vi: "Viết một đoạn 4 câu: luận điểm, bằng chứng, giải thích, nối lại luận điểm.",
    practice_task_en: "Write a four-sentence paragraph: claim, evidence, explanation, link back.",
  },
  {
    id: "pa_c1_skill_academic_disagreement",
    level: "C1",
    category: "academic_disagreement",
    title_pa: "ਅਕਾਦਮਿਕ ਅਸਹਿਮਤੀ",
    title_rom: "academic asahimati",
    title_vi: "Bất đồng học thuật",
    title_en: "Academic disagreement",
    skill_goal_vi: "Phản biện ý tưởng mà không công kích người nói hoặc tác giả.",
    skill_goal_en: "Challenge an idea without attacking the speaker or author.",
    core_phrases: [
      {
        pa: "ਇਹ ਵਿਆਖਿਆ ਲਾਭਦਾਇਕ ਹੈ, ਪਰ ...",
        rom: "ih viakhia labhdayak hai, par ...",
        vi: "Cách giải thích này hữu ích, nhưng...",
        en: "This interpretation is useful, but...",
      },
      {
        pa: "ਮੈਂ ਇਸ ਨਤੀਜੇ ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸਹਿਮਤ ਨਹੀਂ, ਕਿਉਂਕਿ ...",
        rom: "main is natije nal puri tarah sahimat nahi, kyonki ...",
        vi: "Tôi không hoàn toàn đồng ý với kết luận này, vì...",
        en: "I do not fully agree with this conclusion because...",
      },
      {
        pa: "ਇੱਕ ਵਿਕਲਪਕ ਵਿਆਖਿਆ ਇਹ ਹੋ ਸਕਦੀ ਹੈ ਕਿ ...",
        rom: "ikk vikalpak viakhia ih ho sakdi hai ki ...",
        vi: "Một cách giải thích thay thế có thể là...",
        en: "An alternative interpretation may be that...",
      },
    ],
    canada_example: {
      context_vi: "Phản biện một nhận định về sinh viên quốc tế ở Canada.",
      context_en: "Disagreeing with a claim about international students in Canada.",
      pa: "ਮੈਂ ਇਸ ਨਤੀਜੇ ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸਹਿਮਤ ਨਹੀਂ, ਕਿਉਂਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਵਿਦਿਆਰਥੀਆਂ ਦੇ ਤਜਰਬੇ ਸੂਬੇ ਅਨੁਸਾਰ ਬਦਲਦੇ ਹਨ।",
      rom: "main is natije nal puri tarah sahimat nahi, kyonki Canada vich vidyarthian de tajarbe sube anusaar badalde han.",
      vi: "Tôi không hoàn toàn đồng ý với kết luận này, vì trải nghiệm của sinh viên ở Canada thay đổi theo tỉnh bang.",
      en: "I do not fully agree with this conclusion because student experiences in Canada vary by province.",
    },
    learner_traps_vi: [
      "Tránh nói người viết 'sai hoàn toàn' nếu chỉ có một phần chưa đủ chứng minh.",
      "Phản biện nên đưa lý do hoặc cách giải thích thay thế.",
    ],
    learner_traps_en: [
      "Avoid saying the writer is 'completely wrong' if only one part is under-supported.",
      "A critique should give a reason or an alternative explanation.",
    ],
    practice_task_vi: "Viết 3 câu phản biện lịch sự một kết luận mà bạn thấy quá rộng.",
    practice_task_en: "Write three sentences politely challenging a conclusion that seems too broad.",
  },
  {
    id: "pa_c1_skill_essay_paragraph_frames",
    level: "C1",
    category: "essay_paragraph_frames",
    title_pa: "ਲੇਖ ਦੇ ਪੈਰਾ ਫਰੇਮ",
    title_rom: "lekh de paira frame",
    title_vi: "Khung đoạn văn bài luận",
    title_en: "Essay paragraph frames",
    skill_goal_vi: "Xây đoạn văn học thuật có câu chủ đề, phát triển ý, bằng chứng, và kết luận nhỏ.",
    skill_goal_en: "Build an academic paragraph with topic sentence, development, evidence, and mini-conclusion.",
    core_phrases: [
      {
        pa: "ਇਸ ਪੈਰੇ ਦਾ ਮੁੱਖ ਬਿੰਦੂ ਇਹ ਹੈ ਕਿ ...",
        rom: "is paire da mukh bindu ih hai ki ...",
        vi: "Điểm chính của đoạn này là...",
        en: "The main point of this paragraph is that...",
      },
      {
        pa: "ਇਸ ਨੂੰ ਸਮਝਣ ਲਈ ਪਹਿਲਾਂ ... ਵੇਖਣਾ ਜ਼ਰੂਰੀ ਹੈ।",
        rom: "is nu samajhan lai pahilan ... vekhna zaruri hai.",
        vi: "Để hiểu điều này, trước hết cần xem...",
        en: "To understand this, it is first necessary to examine...",
      },
      {
        pa: "ਇਸ ਲਈ, ਇਹ ਪੈਰਾ ਦਿਖਾਉਂਦਾ ਹੈ ਕਿ ...",
        rom: "is lai, ih paira dikhaounda hai ki ...",
        vi: "Vì vậy, đoạn này cho thấy rằng...",
        en: "Therefore, this paragraph shows that...",
      },
    ],
    canada_example: {
      context_vi: "Viết đoạn văn về lựa chọn trường cao đẳng hoặc đại học ở Canada.",
      context_en: "Writing a paragraph about choosing a college or university in Canada.",
      pa: "ਇਸ ਪੈਰੇ ਦਾ ਮੁੱਖ ਬਿੰਦੂ ਇਹ ਹੈ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਸੰਸਥਾ ਦੀ ਚੋਣ ਸਿਰਫ਼ ਰੈਂਕਿੰਗ ਨਾਲ ਨਹੀਂ ਹੋਣੀ ਚਾਹੀਦੀ।",
      rom: "is paire da mukh bindu ih hai ki Canada vich sanstha di chon sirf ranking nal nahi honi chahidi.",
      vi: "Điểm chính của đoạn này là ở Canada, việc chọn trường không nên chỉ dựa vào xếp hạng.",
      en: "The main point of this paragraph is that in Canada, choosing an institution should not depend only on rankings.",
    },
    learner_traps_vi: [
      "Không bắt đầu mọi câu bằng 'và'; dùng liên kết học thuật rõ.",
      "Mỗi đoạn nên có một trọng tâm chính, không gom ba ý lớn.",
    ],
    learner_traps_en: [
      "Do not start every sentence with 'and'; use clear academic linking.",
      "Each paragraph should have one main focus, not three large ideas.",
    ],
    practice_task_vi: "Viết một đoạn 5 câu về việc chọn ngành học ở Canada.",
    practice_task_en: "Write a five-sentence paragraph about choosing a field of study in Canada.",
  },
  {
    id: "pa_c1_skill_presentation_phrases",
    level: "C1",
    category: "presentation_phrases",
    title_pa: "ਅਕਾਦਮਿਕ ਪੇਸ਼ਕਾਰੀ ਦੇ ਵਾਕ",
    title_rom: "academic peshkari de vaak",
    title_vi: "Cụm câu thuyết trình học thuật",
    title_en: "Academic presentation phrases",
    skill_goal_vi: "Điều hướng bài nói: mở đầu, chuyển phần, xử lý câu hỏi, và kết luận.",
    skill_goal_en: "Manage a talk: opening, transitions, questions, and closing.",
    core_phrases: [
      {
        pa: "ਮੈਂ ਆਪਣੀ ਪੇਸ਼ਕਾਰੀ ਨੂੰ ਤਿੰਨ ਹਿੱਸਿਆਂ ਵਿੱਚ ਵੰਡਾਂਗਾ/ਵੰਡਾਂਗੀ।",
        rom: "main apni peshkari nu tinn hissian vich vandanga/vandanggi.",
        vi: "Tôi sẽ chia bài thuyết trình thành ba phần.",
        en: "I will divide my presentation into three parts.",
      },
      {
        pa: "ਹੁਣ ਮੈਂ ਦੂਜੇ ਬਿੰਦੂ ਵੱਲ ਆਉਂਦਾ/ਆਉਂਦੀ ਹਾਂ।",
        rom: "hun main duje bindu vall aunda/aundi han.",
        vi: "Bây giờ tôi chuyển sang điểm thứ hai.",
        en: "Now I will move to the second point.",
      },
      {
        pa: "ਇਹ ਸਵਾਲ ਮਹੱਤਵਪੂਰਨ ਹੈ; ਮੈਂ ਇਸ ਦਾ ਜਵਾਬ ਦੋ ਪੱਖਾਂ ਤੋਂ ਦਿਆਂਗਾ/ਦਿਆਂਗੀ।",
        rom: "ih sawal mahatvapuran hai; main is da jawab do pakkhan ton dianga/diangi.",
        vi: "Câu hỏi này quan trọng; tôi sẽ trả lời từ hai phía.",
        en: "This question is important; I will answer it from two angles.",
      },
    ],
    canada_example: {
      context_vi: "Thuyết trình lớp học về dịch vụ hỗ trợ sinh viên ở Canada.",
      context_en: "Class presentation about student support services in Canada.",
      pa: "ਮੈਂ ਆਪਣੀ ਪੇਸ਼ਕਾਰੀ ਨੂੰ ਤਿੰਨ ਹਿੱਸਿਆਂ ਵਿੱਚ ਵੰਡਾਂਗਾ: ਸੇਵਾਵਾਂ, ਪਹੁੰਚ, ਅਤੇ ਵਿਦਿਆਰਥੀ ਅਨੁਭਵ।",
      rom: "main apni peshkari nu tinn hissian vich vandanga: sevavan, pahunch, ate vidyarthi anubhav.",
      vi: "Tôi sẽ chia bài thuyết trình thành ba phần: dịch vụ, khả năng tiếp cận, và trải nghiệm sinh viên.",
      en: "I will divide my presentation into three parts: services, access, and student experience.",
    },
    learner_traps_vi: [
      "Đừng đọc từng câu từ slide; dùng cụm chuyển để dẫn người nghe.",
      "Khi gặp câu hỏi khó, làm rõ phạm vi trước khi trả lời.",
    ],
    learner_traps_en: [
      "Do not read every sentence from slides; use transition phrases to guide listeners.",
      "For difficult questions, clarify the scope before answering.",
    ],
    practice_task_vi: "Chuẩn bị phần mở đầu 60 giây cho bài thuyết trình về hỗ trợ sinh viên.",
    practice_task_en: "Prepare a 60-second opening for a presentation about student support.",
  },
];
