// src/languages/punjabi/smokeDeckA2.ts
//
// Punjabi A2 smoke deck for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary. Romanization is a practical reading aid, not a phonetic
// standard. Shahmukhi is mentioned only for awareness; this is not a Shahmukhi
// course. Native review is deferred.

export type PunjabiSmokeDeckA2Scenario =
  | "daily_routine"
  | "appointment"
  | "transport"
  | "housing"
  | "school"
  | "childcare"
  | "workplace_small_talk"
  | "polite_problem_explanation"
  | "interaction_repair";

export type PunjabiSmokeDeckA2Mode =
  | "smoke_check"
  | "final_qa"
  | "integration_readiness";

export type PunjabiSmokeDeckA2Answer = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiSmokeDeckA2Trap = {
  trap_vi: string;
  trap_en: string;
  better_pa: string;
  better_romanization: string;
};

export type PunjabiSmokeDeckA2Card = {
  id: string;
  scenario: PunjabiSmokeDeckA2Scenario;
  mode: PunjabiSmokeDeckA2Mode;
  title_vi: string;
  title_en: string;
  prompt_vi: string;
  prompt_en: string;
  answer: PunjabiSmokeDeckA2Answer;
  explanation_vi: string;
  explanation_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  traps: PunjabiSmokeDeckA2Trap[];
  pass_signal_vi: string;
  pass_signal_en: string;
  retry_hint_vi: string;
  retry_hint_en: string;
};

const scriptAwarenessVi = "Gurmukhi là chữ chính trong smoke deck; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn = "Gurmukhi is the main script in this smoke deck; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const smokeDeckA2: PunjabiSmokeDeckA2Card[] = [
  {
    id: "pa_a2_smoke_daily_routine",
    scenario: "daily_routine",
    mode: "smoke_check",
    title_vi: "Smoke check: thói quen sáng",
    title_en: "Smoke check: morning habit",
    prompt_vi: "Nói: Tôi đi làm buổi sáng. (nữ)",
    prompt_en: "Say: I go to work in the morning. (female speaker)",
    answer: { pa: "ਮੈਂ ਸਵੇਰੇ ਕੰਮ ਤੇ ਜਾਂਦੀ ਹਾਂ।", romanization: "main savere kamm te jandi haan.", vi: "Tôi đi làm buổi sáng.", en: "I go to work in the morning." },
    explanation_vi: "ਜਾਂਦੀ agrees với người nói nữ; động từ ở cuối câu.",
    explanation_en: "ਜਾਂਦੀ agrees with a female speaker; the verb stays at the end.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    traps: [{ trap_vi: "Đừng dùng ਜਾਂਦਾ cho người nói nữ.", trap_en: "Do not use ਜਾਂਦਾ for a female speaker.", better_pa: "ਮੈਂ ਜਾਂਦੀ ਹਾਂ।", better_romanization: "main jandi haan." }],
    pass_signal_vi: "Có ਸਵੇਰੇ, ਕੰਮ ਤੇ, và ਜਾਂਦੀ ਹਾਂ.",
    pass_signal_en: "Includes ਸਵੇਰੇ, ਕੰਮ ਤੇ, and ਜਾਂਦੀ ਹਾਂ.",
    retry_hint_vi: "Ôn habitual -ਦਾ/-ਦੀ.",
    retry_hint_en: "Review habitual -ਦਾ/-ਦੀ.",
  },
  {
    id: "pa_a2_smoke_appointment",
    scenario: "appointment",
    mode: "final_qa",
    title_vi: "Smoke check: lịch hẹn",
    title_en: "Smoke check: appointment",
    prompt_vi: "Nói: Lịch hẹn của tôi lúc hai giờ.",
    prompt_en: "Say: My appointment is at two.",
    answer: { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਦੋ ਵਜੇ ਹੈ।", romanization: "meri appointment do vaje hai.", vi: "Lịch hẹn của tôi lúc hai giờ.", en: "My appointment is at two." },
    explanation_vi: "ਦੋ ਵਜੇ = lúc hai giờ; ਮੇਰੀ agrees với ਅਪਾਇੰਟਮੈਂਟ.",
    explanation_en: "ਦੋ ਵਜੇ = at two; ਮੇਰੀ agrees with ਅਪਾਇੰਟਮੈਂਟ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "ਅਪਾਇੰਟਮੈਂਟ thường gặp ở clinic/dentist Canada.",
    canada_practical_en: "ਅਪਾਇੰਟਮੈਂਟ is common at Canadian clinics/dentists.",
    traps: [{ trap_vi: "Không nói chỉ ਦੋ; cần ਦੋ ਵਜੇ.", trap_en: "Do not say only ਦੋ; use ਦੋ ਵਜੇ.", better_pa: "ਦੋ ਵਜੇ", better_romanization: "do vaje" }],
    pass_signal_vi: "Có possessive ਮੇਰੀ và giờ với ਵਜੇ.",
    pass_signal_en: "Has possessive ਮੇਰੀ and clock time with ਵਜੇ.",
    retry_hint_vi: "Ôn appointment + time pattern.",
    retry_hint_en: "Review appointment + time pattern.",
  },
  {
    id: "pa_a2_smoke_transport",
    scenario: "transport",
    mode: "integration_readiness",
    title_vi: "Smoke check: hỏi tuyến",
    title_en: "Smoke check: route question",
    prompt_vi: "Hỏi: Xe buýt này đi đâu?",
    prompt_en: "Ask: Where does this bus go?",
    answer: { pa: "ਇਹ ਬੱਸ ਕਿੱਥੇ ਜਾਂਦੀ ਹੈ?", romanization: "eh bass kitthe jandi hai?", vi: "Xe buýt này đi đâu?", en: "Where does this bus go?" },
    explanation_vi: "ਕਿੱਥੇ hỏi địa điểm; ਜਾਂਦੀ agrees với ਬੱਸ.",
    explanation_en: "ਕਿੱਥੇ asks location; ਜਾਂਦੀ agrees with ਬੱਸ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được với bus routes, SkyTrain, TTC.",
    canada_practical_en: "Usable with bus routes, SkyTrain, TTC.",
    traps: [{ trap_vi: "Đừng dùng ਜਾਂਦਾ với ਬੱਸ trong mẫu này.", trap_en: "Do not use ਜਾਂਦਾ with ਬੱਸ in this pattern.", better_pa: "ਬੱਸ ਜਾਂਦੀ ਹੈ।", better_romanization: "bass jandi hai." }],
    pass_signal_vi: "Có ਕਿੱਥੇ và ਜਾਂਦੀ ਹੈ.",
    pass_signal_en: "Includes ਕਿੱਥੇ and ਜਾਂਦੀ ਹੈ.",
    retry_hint_vi: "Ôn transport agreement.",
    retry_hint_en: "Review transport agreement.",
  },
  {
    id: "pa_a2_smoke_housing",
    scenario: "housing",
    mode: "smoke_check",
    title_vi: "Smoke check: heater",
    title_en: "Smoke check: heater",
    prompt_vi: "Nói lịch sự: Xin lỗi, máy sưởi không hoạt động.",
    prompt_en: "Say politely: Sorry, the heater is not working.",
    answer: { pa: "ਮਾਫ਼ ਕਰਨਾ, ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "maaf karna, heater kamm nahi kar riha.", vi: "Xin lỗi, máy sưởi không hoạt động.", en: "Sorry, the heater is not working." },
    explanation_vi: "ਮਾਫ਼ ਕਰਨਾ mở đầu lịch sự; ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ dùng cho thiết bị.",
    explanation_en: "ਮਾਫ਼ ਕਰਨਾ opens politely; ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ is used for devices.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Heater messages are practical in Canadian housing.",
    canada_practical_en: "Heater messages are practical in Canadian housing.",
    traps: [{ trap_vi: "Đừng mở bằng mệnh lệnh mạnh với landlord.", trap_en: "Do not open with a strong command to a landlord.", better_pa: "ਮਾਫ਼ ਕਰਨਾ, ਇੱਕ ਸਮੱਸਿਆ ਹੈ।", better_romanization: "maaf karna, ikk samassia hai." }],
    pass_signal_vi: "Có ਮਾਫ਼ ਕਰਨਾ và problem phrase.",
    pass_signal_en: "Has ਮਾਫ਼ ਕਰਨਾ and a problem phrase.",
    retry_hint_vi: "Ôn polite problem openers.",
    retry_hint_en: "Review polite problem openers.",
  },
  {
    id: "pa_a2_smoke_school",
    scenario: "school",
    mode: "final_qa",
    title_vi: "Smoke check: báo vắng học",
    title_en: "Smoke check: school absence",
    prompt_vi: "Nói: Con tôi hôm nay không thể đến trường.",
    prompt_en: "Say: My child cannot come to school today.",
    answer: { pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "mera bachcha ajj school nahi aa sakda.", vi: "Con tôi hôm nay không thể đến trường.", en: "My child cannot come to school today." },
    explanation_vi: "ਮੇਰਾ và ਸਕਦਾ agree với ਬੱਚਾ.",
    explanation_en: "ਮੇਰਾ and ਸਕਦਾ agree with ਬੱਚਾ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Useful for school office absence messages.",
    canada_practical_en: "Useful for school office absence messages.",
    traps: [{ trap_vi: "ਮੇਰਾ/ਮੇਰੀ agrees với danh từ sau.", trap_en: "ਮੇਰਾ/ਮੇਰੀ agrees with the following noun.", better_pa: "ਮੇਰਾ ਬੱਚਾ", better_romanization: "mera bachcha" }],
    pass_signal_vi: "Có ਅੱਜ, ਸਕੂਲ, ਨਹੀਂ ਆ ਸਕਦਾ.",
    pass_signal_en: "Includes ਅੱਜ, ਸਕੂਲ, ਨਹੀਂ ਆ ਸਕਦਾ.",
    retry_hint_vi: "Ôn school absence frame.",
    retry_hint_en: "Review school absence frame.",
  },
  {
    id: "pa_a2_smoke_childcare",
    scenario: "childcare",
    mode: "smoke_check",
    title_vi: "Smoke check: đón trẻ",
    title_en: "Smoke check: child pickup",
    prompt_vi: "Nói: Tôi sẽ đến đón trẻ lúc năm giờ. (nữ)",
    prompt_en: "Say: I will come to pick up the child at five. (female speaker)",
    answer: { pa: "ਮੈਂ ਬੱਚੇ ਨੂੰ ਪੰਜ ਵਜੇ ਲੈਣ ਆਵਾਂਗੀ।", romanization: "main bachche nu panj vaje lain aavangi.", vi: "Tôi sẽ đến đón trẻ lúc năm giờ.", en: "I will come to pick up the child at five." },
    explanation_vi: "ਲੈਣ ਆਉਣਾ = đến đón; ਆਵਾਂਗੀ cho người nói nữ.",
    explanation_en: "ਲੈਣ ਆਉਣਾ = come to pick up; ਆਵਾਂਗੀ for a female speaker.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Daycare pickup is a common Canada scenario.",
    canada_practical_en: "Daycare pickup is a common Canadian scenario.",
    traps: [{ trap_vi: "Người nói nam dùng ਆਵਾਂਗਾ.", trap_en: "A male speaker uses ਆਵਾਂਗਾ.", better_pa: "ਮੈਂ ਲੈਣ ਆਵਾਂਗਾ।", better_romanization: "main lain aavanga." }],
    pass_signal_vi: "Có ਬੱਚੇ ਨੂੰ, ਪੰਜ ਵਜੇ, ਲੈਣ ਆਵਾਂਗੀ.",
    pass_signal_en: "Includes ਬੱਚੇ ਨੂੰ, ਪੰਜ ਵਜੇ, ਲੈਣ ਆਵਾਂਗੀ.",
    retry_hint_vi: "Ôn pickup future phrase.",
    retry_hint_en: "Review pickup future phrase.",
  },
  {
    id: "pa_a2_smoke_workplace",
    scenario: "workplace_small_talk",
    mode: "smoke_check",
    title_vi: "Smoke check: small talk",
    title_en: "Smoke check: small talk",
    prompt_vi: "Hỏi lịch sự: Cuối tuần của bạn thế nào?",
    prompt_en: "Ask politely: How was your weekend?",
    answer: { pa: "ਤੁਹਾਡਾ ਵੀਕਐਂਡ ਕਿਵੇਂ ਸੀ?", romanization: "tuhada weekend kiven si?", vi: "Cuối tuần của bạn thế nào?", en: "How was your weekend?" },
    explanation_vi: "ਤੁਹਾਡਾ lịch sự hơn ਤੇਰਾ.",
    explanation_en: "ਤੁਹਾਡਾ is more polite than ਤੇਰਾ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Weekend/weather small talk is safe in many Canadian workplaces.",
    canada_practical_en: "Weekend/weather small talk is safe in many Canadian workplaces.",
    traps: [{ trap_vi: "ਤੂੰ/ਤੇਰਾ có thể quá thân mật.", trap_en: "ਤੂੰ/ਤੇਰਾ can be too intimate.", better_pa: "ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", better_romanization: "tuhada din kiven hai?" }],
    pass_signal_vi: "Có polite possessive ਤੁਹਾਡਾ.",
    pass_signal_en: "Has polite possessive ਤੁਹਾਡਾ.",
    retry_hint_vi: "Ôn polite pronouns.",
    retry_hint_en: "Review polite pronouns.",
  },
  {
    id: "pa_a2_smoke_polite_problem",
    scenario: "polite_problem_explanation",
    mode: "integration_readiness",
    title_vi: "Smoke check: vấn đề lịch sự",
    title_en: "Smoke check: polite problem",
    prompt_vi: "Nói: Xin lỗi, tôi có một vấn đề nhỏ.",
    prompt_en: "Say: Sorry, I have a small problem.",
    answer: { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਇੱਕ ਛੋਟੀ ਸਮੱਸਿਆ ਹੈ।", romanization: "maaf karna, mainu ikk chhoti samassia hai.", vi: "Xin lỗi, tôi có một vấn đề nhỏ.", en: "Sorry, I have a small problem." },
    explanation_vi: "ਮੈਨੂੰ ... ਹੈ nói 'tôi có'; ਛੋਟੀ làm câu mềm hơn.",
    explanation_en: "ਮੈਨੂੰ ... ਹੈ means 'I have'; ਛੋਟੀ softens the sentence.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Useful at service counters, clinics, school offices, landlord messages.",
    canada_practical_en: "Useful at service counters, clinics, school offices, landlord messages.",
    traps: [{ trap_vi: "Đừng dùng command khi xin giúp người lạ.", trap_en: "Do not use a command when asking a stranger for help.", better_pa: "ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", better_romanization: "ki tusi madad kar sakde ho?" }],
    pass_signal_vi: "Có ਮਾਫ਼ ਕਰਨਾ and ਮੈਨੂੰ ... ਹੈ.",
    pass_signal_en: "Has ਮਾਫ਼ ਕਰਨਾ and ਮੈਨੂੰ ... ਹੈ.",
    retry_hint_vi: "Ôn polite problem frame.",
    retry_hint_en: "Review polite problem frame.",
  },
  {
    id: "pa_a2_smoke_repair",
    scenario: "interaction_repair",
    mode: "final_qa",
    title_vi: "Smoke check: xin nhắc lại",
    title_en: "Smoke check: ask for repetition",
    prompt_vi: "Nói lịch sự: Bạn có thể nói lại không?",
    prompt_en: "Say politely: Can you say that again?",
    answer: { pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusi dubara keh sakde ho?", vi: "Xin lỗi, bạn có thể nói lại không?", en: "Sorry, can you say that again?" },
    explanation_vi: "ਤੁਸੀਂ + ਸਕਦੇ ਹੋ tạo câu hỏi lịch sự.",
    explanation_en: "ਤੁਸੀਂ + ਸਕਦੇ ਹੋ creates a polite question.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    traps: [{ trap_vi: "Đừng chỉ nói ਕੀ? với người lạ.", trap_en: "Do not only say ਕੀ? to a stranger.", better_pa: "ਮਾਫ਼ ਕਰਨਾ, ਦੁਬਾਰਾ ਕਹੋ ਜੀ।", better_romanization: "maaf karna, dubara kaho ji." }],
    pass_signal_vi: "Có ਮਾਫ਼ ਕਰਨਾ, ਤੁਸੀਂ, ਦੁਬਾਰਾ.",
    pass_signal_en: "Includes ਮਾਫ਼ ਕਰਨਾ, ਤੁਸੀਂ, ਦੁਬਾਰਾ.",
    retry_hint_vi: "Ôn interaction repair phrases.",
    retry_hint_en: "Review interaction repair phrases.",
  },
];
