// Punjabi B2 recommendation tasks for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization is included as a bridge.

export type PunjabiRecommendationB2Scenario =
  | "settlement"
  | "housing"
  | "work"
  | "education"
  | "healthcare"
  | "transport"
  | "public_service";

export type PunjabiRecommendationB2Task = {
  id: string;
  level: "B2";
  scenario: PunjabiRecommendationB2Scenario;
  recommendationFocus: "recommend_option" | "justify_reasons" | "compare_tradeoffs" | "address_concerns";
  prompt_gurmukhi: string;
  prompt_romanization: string;
  prompt_vi: string;
  prompt_en: string;
  recommendationFrame: {
    move: "recommend" | "reason" | "tradeoff" | "concern" | "final_quality";
    phrase_gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  }[];
  modelRecommendation_gurmukhi: string;
  modelRecommendation_romanization: string;
  modelRecommendation_vi: string;
  modelRecommendation_en: string;
  finalQualityCheck_vi: string[];
  finalQualityCheck_en: string[];
  remediation_vi: string;
  remediation_en: string;
  learnerTraps_vi: string[];
  learnerTraps_en: string[];
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

export const punjabiRecommendationTasksB2: PunjabiRecommendationB2Task[] = [
  {
    id: "pa_b2_recommend_settlement_service",
    level: "B2",
    scenario: "settlement",
    recommendationFocus: "justify_reasons",
    prompt_gurmukhi: "ਨਵੇਂ ਆਏ ਵਿਅਕਤੀ ਨੂੰ ਸੈਟਲਮੈਂਟ ਸੇਵਾ ਨਾਲ ਮਿਲਣ ਦੀ ਸਿਫ਼ਾਰਸ਼ ਕਰੋ।",
    prompt_romanization: "nave aaye viakti nu settlement sevaa naal milan di sifaarash karo.",
    prompt_vi: "Khuyến nghị người mới đến gặp dịch vụ định cư.",
    prompt_en: "Recommend that a newcomer meet a settlement service.",
    recommendationFrame: [
      { move: "recommend", phrase_gurmukhi: "ਮੇਰੀ ਸਿਫ਼ਾਰਸ਼ ਹੈ...", romanization: "merii sifaarash hai...", vi: "Đề xuất của tôi là...", en: "My recommendation is..." },
      { move: "reason", phrase_gurmukhi: "ਇਸ ਦਾ ਕਾਰਨ...", romanization: "is daa kaaran...", vi: "Lý do là...", en: "The reason is..." },
      { move: "concern", phrase_gurmukhi: "ਫਿਰ ਵੀ ਫੈਸਲਾ...", romanization: "fir vii faislaa...", vi: "Tuy vậy quyết định...", en: "Still, the decision..." },
      { move: "final_quality", phrase_gurmukhi: "ਇਹ practical ਹੈ ਕਿਉਂਕਿ...", romanization: "ih practical hai kiunki...", vi: "Điều này thực tế vì...", en: "This is practical because..." },
    ],
    modelRecommendation_gurmukhi: "ਮੇਰੀ ਸਿਫ਼ਾਰਸ਼ ਹੈ ਕਿ ਨਵੇਂ ਆਏ ਵਿਅਕਤੀ ਪਹਿਲਾਂ ਸੈਟਲਮੈਂਟ ਸੇਵਾ ਨਾਲ ਮਿਲੇ। ਇਸ ਦਾ ਕਾਰਨ ਹੈ ਕਿ ਸੇਵਾ forms, ਸਕੂਲ ਅਤੇ housing ਦਸਤਾਵੇਜ਼ ਬਾਰੇ ਦਿਸ਼ਾ ਦੇ ਸਕਦੀ ਹੈ। ਫਿਰ ਵੀ ਫੈਸਲਾ ਵਿਅਕਤੀ ਦੇ ਆਪਣੇ ਹਾਲਾਤ ਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ। ਇਹ practical ਹੈ ਕਿਉਂਕਿ ਪਹਿਲੀ ਮੀਟਿੰਗ ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਲਈ ਹੋ ਸਕਦੀ ਹੈ।",
    modelRecommendation_romanization: "merii sifaarash hai ki nave aaye viakti pahilaan settlement sevaa naal mile. is daa kaaran hai ki sevaa forms, school ate housing dastaaavez baare dishaa de sakdii hai. fir vii faislaa viakti de apne haalaat te nirbhar kardaa hai. ih practical hai kiunki pahilii meeting sirf jaankaari lai ho sakdii hai.",
    modelRecommendation_vi: "Tôi khuyến nghị người mới đến gặp dịch vụ định cư trước. Lý do là dịch vụ có thể hướng dẫn về form, trường học và giấy tờ nhà ở. Tuy vậy quyết định phụ thuộc hoàn cảnh mỗi người. Điều này thực tế vì buổi gặp đầu có thể chỉ để lấy thông tin.",
    modelRecommendation_en: "I recommend that a newcomer first meet a settlement service. The reason is that the service can guide forms, school, and housing documents. Still, the decision depends on the person's situation. This is practical because the first meeting can simply be for information.",
    finalQualityCheck_vi: ["Recommendation rõ", "Có reason", "Có limit"],
    finalQualityCheck_en: ["Clear recommendation", "Reason", "Limit"],
    remediation_vi: "Nếu hứa quá mức, thêm limit về hoàn cảnh cá nhân.",
    remediation_en: "If it promises too much, add a limit about personal situation.",
    learnerTraps_vi: ["ਸਿਫ਼ਾਰਸ਼ = recommendation.", "Đừng hứa service giải quyết mọi thứ."],
    learnerTraps_en: ["ਸਿਫ਼ਾਰਸ਼ means recommendation.", "Do not promise the service solves everything."],
    canadaPracticalExample_vi: "Ví dụ Canada: settlement workers often explain school, housing, and local service paths.",
    canadaPracticalExample_en: "Canada example: settlement workers often explain school, housing, and local service paths.",
    scriptAwareness_en: "Gurmukhi is taught here; Shahmukhi is awareness only.",
    nativeReview: "deferred",
  },
  {
    id: "pa_b2_recommend_housing_transit",
    level: "B2",
    scenario: "housing",
    recommendationFocus: "compare_tradeoffs",
    prompt_gurmukhi: "ਸਸਤੇ ਪਰ ਦੂਰ ਘਰ ਅਤੇ ਮਹਿੰਗੇ ਪਰ transit ਦੇ ਨੇੜੇ ਘਰ ਵਿੱਚੋਂ ਸਿਫ਼ਾਰਸ਼ ਕਰੋ।",
    prompt_romanization: "saste par duur ghar ate mahinge par transit de nere ghar vichon sifaarash karo.",
    prompt_vi: "Khuyến nghị giữa nhà rẻ nhưng xa và nhà đắt hơn nhưng gần transit.",
    prompt_en: "Recommend between cheaper housing farther away and more expensive housing near transit.",
    recommendationFrame: [
      { move: "recommend", phrase_gurmukhi: "ਮੇਰੀ ਚੋਣ...", romanization: "merii chon...", vi: "Lựa chọn của tôi...", en: "My choice..." },
      { move: "tradeoff", phrase_gurmukhi: "ਕਿਰਾਇਆ ਘੱਟ ਹੈ, ਪਰ...", romanization: "kiraayaa ghatt hai, par...", vi: "Tiền thuê thấp hơn, nhưng...", en: "Rent is lower, but..." },
      { move: "reason", phrase_gurmukhi: "ਲੰਮੇ ਸਮੇਂ ਵਿੱਚ...", romanization: "lamme same vich...", vi: "Về lâu dài...", en: "In the long term..." },
      { move: "concern", phrase_gurmukhi: "ਖਰਚੇ ਦੀ ਚਿੰਤਾ ਵਾਜਬ ਹੈ...", romanization: "kharche di chintaa vaajab hai...", vi: "Lo về chi phí là hợp lý...", en: "The cost concern is reasonable..." },
    ],
    modelRecommendation_gurmukhi: "ਮੇਰੀ ਚੋਣ transit ਦੇ ਨੇੜੇ ਘਰ ਹੈ ਜੇ ਪਰਿਵਾਰ ਕੋਲ ਗੱਡੀ ਨਹੀਂ। ਕਿਰਾਇਆ ਵੱਧ ਹੈ, ਪਰ commute ਛੋਟਾ ਅਤੇ ਭਰੋਸੇਯੋਗ ਹੋ ਸਕਦਾ ਹੈ। ਲੰਮੇ ਸਮੇਂ ਵਿੱਚ ਸਮਾਂ ਅਤੇ ਥਕਾਵਟ ਵੀ ਖਰਚੇ ਵਾਂਗ ਮਹੱਤਵਪੂਰਨ ਹਨ। ਖਰਚੇ ਦੀ ਚਿੰਤਾ ਵਾਜਬ ਹੈ, ਇਸ ਲਈ budget ਪਹਿਲਾਂ ਚੈੱਕ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ।",
    modelRecommendation_romanization: "merii chon transit de nere ghar hai je parivaar kol gaddi nahi. kiraayaa vadh hai, par commute chhota ate bharoseyog ho sakdaa hai. lamme same vich samaa ate thakaavat vii kharche vaang mahatvapooran han. kharche di chintaa vaajab hai, is lai budget pahilaan check karnaa chaahiidaa hai.",
    modelRecommendation_vi: "Tôi chọn nhà gần transit nếu gia đình không có xe. Tiền thuê cao hơn, nhưng commute ngắn và đáng tin hơn. Về lâu dài, thời gian và mệt mỏi cũng quan trọng như chi phí. Lo về chi phí là hợp lý, nên kiểm tra ngân sách trước.",
    modelRecommendation_en: "I choose housing near transit if the family has no car. Rent is higher, but the commute may be shorter and more reliable. In the long term, time and fatigue matter like cost. The cost concern is reasonable, so the budget should be checked first.",
    finalQualityCheck_vi: ["Tradeoff", "Reason long-term", "Concern addressed"],
    finalQualityCheck_en: ["Tradeoff", "Long-term reason", "Concern addressed"],
    remediation_vi: "Nếu chỉ nói rent, thêm commute và fatigue.",
    remediation_en: "If only rent is mentioned, add commute and fatigue.",
    learnerTraps_vi: ["ਵਾਜਬ = reasonable.", "Không chỉ so rent."],
    learnerTraps_en: ["ਵਾਜਬ means reasonable.", "Do not compare rent only."],
    canadaPracticalExample_vi: "Ví dụ Canada: transit routes and winter commute affect housing choice.",
    canadaPracticalExample_en: "Canada example: transit routes and winter commute affect housing choice.",
  },
  {
    id: "pa_b2_recommend_work_training",
    level: "B2",
    scenario: "work",
    recommendationFocus: "address_concerns",
    prompt_gurmukhi: "ਨਵੇਂ ਸਿਸਟਮ ਤੋਂ ਪਹਿਲਾਂ ਛੋਟੀ ਸਿਖਲਾਈ ਦੀ ਸਿਫ਼ਾਰਸ਼ ਕਰੋ ਅਤੇ time concern address ਕਰੋ।",
    prompt_romanization: "nave system ton pahilaan chhoti sikhlaai di sifaarash karo ate time concern address karo.",
    prompt_vi: "Khuyến nghị đào tạo ngắn trước hệ thống mới và xử lý lo ngại về thời gian.",
    prompt_en: "Recommend short training before a new system and address the time concern.",
    recommendationFrame: [
      { move: "recommend", phrase_gurmukhi: "ਮੈਂ ਸਿਫ਼ਾਰਸ਼ ਕਰਦਾ ਹਾਂ...", romanization: "main sifaarash kardaa haan...", vi: "Tôi khuyến nghị...", en: "I recommend..." },
      { move: "reason", phrase_gurmukhi: "ਇਸ ਨਾਲ ਗਲਤੀਆਂ ਘੱਟ...", romanization: "is naal galtiiaan ghatt...", vi: "Điều này giảm lỗi...", en: "This reduces mistakes..." },
      { move: "concern", phrase_gurmukhi: "ਸਮੇਂ ਦੀ ਚਿੰਤਾ...", romanization: "same di chintaa...", vi: "Lo về thời gian...", en: "The time concern..." },
      { move: "final_quality", phrase_gurmukhi: "ਛੋਟਾ format...", romanization: "chhota format...", vi: "Format ngắn...", en: "A short format..." },
    ],
    modelRecommendation_gurmukhi: "ਮੈਂ ਸਿਫ਼ਾਰਸ਼ ਕਰਦਾ ਹਾਂ ਕਿ ਨਵੇਂ ਸਿਸਟਮ ਤੋਂ ਪਹਿਲਾਂ ਤੀਹ ਮਿੰਟ ਦੀ ਸਿਖਲਾਈ ਹੋਵੇ। ਇਸ ਨਾਲ ਗਲਤੀਆਂ ਘੱਟ ਹੋਣਗੀਆਂ ਅਤੇ ਸਾਰੇ ਕਰਮਚਾਰੀ ਇੱਕੋ ਜਾਣਕਾਰੀ ਲੈਣਗੇ। ਸਮੇਂ ਦੀ ਚਿੰਤਾ ਵਾਜਬ ਹੈ, ਇਸ ਲਈ training ਛੋਟੀ ਹੋਵੇ ਅਤੇ ਬਾਅਦ ਵਿੱਚ guide ਭੇਜੀ ਜਾਵੇ।",
    modelRecommendation_romanization: "main sifaarash kardaa haan ki nave system ton pahilaan tiih mint di sikhlaai hove. is naal galtiiaan ghatt hongiiaan ate saare karamchaarii ikko jaankaari lainge. same di chintaa vaajab hai, is lai training chhoti hove ate baad vich guide bhejii jaave.",
    modelRecommendation_vi: "Tôi khuyến nghị đào tạo 30 phút trước hệ thống mới. Điều này giảm lỗi và mọi nhân viên nhận cùng thông tin. Lo về thời gian là hợp lý, nên training ngắn và gửi guide sau.",
    modelRecommendation_en: "I recommend thirty minutes of training before the new system. This reduces mistakes and all employees receive the same information. The time concern is reasonable, so training should be short and followed by a guide.",
    finalQualityCheck_vi: ["Recommendation", "Fairness reason", "Concern handled"],
    finalQualityCheck_en: ["Recommendation", "Fairness reason", "Concern handled"],
    remediation_vi: "Nếu không address time, thêm short format.",
    remediation_en: "If time is not addressed, add a short format.",
    learnerTraps_vi: ["ਸਿਖਲਾਈ = training.", "Đừng bỏ concern."],
    learnerTraps_en: ["ਸਿਖਲਾਈ means training.", "Do not skip the concern."],
  },
  {
    id: "pa_b2_recommend_work_hybrid",
    level: "B2",
    scenario: "work",
    recommendationFocus: "compare_tradeoffs",
    prompt_gurmukhi: "ਟੀਮ ਲਈ ਹਾਈਬ੍ਰਿਡ ਕੰਮ ਦੀ ਸਿਫ਼ਾਰਸ਼ ਕਰੋ।",
    prompt_romanization: "team lai hybrid kamm di sifaarash karo.",
    prompt_vi: "Khuyến nghị hybrid work cho đội.",
    prompt_en: "Recommend hybrid work for a team.",
    recommendationFrame: [
      { move: "recommend", phrase_gurmukhi: "ਮੇਰੀ ਸਿਫ਼ਾਰਸ਼ ਹਾਈਬ੍ਰਿਡ ਮਾਡਲ ਹੈ।", romanization: "merii sifaarash hybrid model hai.", vi: "Đề xuất của tôi là mô hình hybrid.", en: "My recommendation is a hybrid model." },
      { move: "reason", phrase_gurmukhi: "ਇਸ ਦਾ ਕਾਰਨ...", romanization: "is daa kaaran...", vi: "Lý do là...", en: "The reason is..." },
      { move: "tradeoff", phrase_gurmukhi: "ਘਰੋਂ ਧਿਆਨ... ਦਫ਼ਤਰ ਵਿੱਚ ਸਹਿਯੋਗ...", romanization: "gharon dhiaan... daftar vich sahiyog...", vi: "Ở nhà tập trung... văn phòng phối hợp...", en: "At home focus... in office collaboration..." },
      { move: "concern", phrase_gurmukhi: "communication ਦੀ ਚਿੰਤਾ...", romanization: "communication di chintaa...", vi: "Lo về giao tiếp...", en: "The communication concern..." },
      { move: "final_quality", phrase_gurmukhi: "ਸਪਸ਼ਟ ਦਿਨਾਂ ਨਾਲ...", romanization: "spasht dinaan naal...", vi: "Với ngày rõ...", en: "With clear days..." },
    ],
    modelRecommendation_gurmukhi: "ਮੇਰੀ ਸਿਫ਼ਾਰਸ਼ ਹਾਈਬ੍ਰਿਡ ਮਾਡਲ ਹੈ। ਘਰੋਂ ਧਿਆਨ ਵਾਲਾ ਕੰਮ ਚੰਗਾ ਹੋ ਸਕਦਾ ਹੈ, ਅਤੇ ਦਫ਼ਤਰ ਵਿੱਚ ਸਹਿਯੋਗ ਵਾਲਾ ਕੰਮ ਆਸਾਨ ਹੁੰਦਾ ਹੈ। communication ਦੀ ਚਿੰਤਾ ਵਾਜਬ ਹੈ, ਇਸ ਲਈ office days ਅਤੇ meeting times ਸਪਸ਼ਟ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।",
    modelRecommendation_romanization: "merii sifaarash hybrid model hai. gharon dhiaan vaalaa kamm changaa ho sakdaa hai, ate daftar vich sahiyog vaalaa kamm aasaan hundaa hai. communication di chintaa vaajab hai, is lai office days ate meeting times spasht hone chaahiide han.",
    modelRecommendation_vi: "Tôi khuyến nghị mô hình hybrid. Làm việc cần tập trung có thể tốt ở nhà, còn việc phối hợp dễ hơn ở văn phòng. Lo về giao tiếp là hợp lý, nên ngày văn phòng và giờ họp cần rõ.",
    modelRecommendation_en: "My recommendation is a hybrid model. Focus work can be good from home, and collaboration work is easier in the office. The communication concern is reasonable, so office days and meeting times should be clear.",
    finalQualityCheck_vi: ["Tradeoff", "Concern", "Clear implementation"],
    finalQualityCheck_en: ["Tradeoff", "Concern", "Clear implementation"],
    remediation_vi: "Nếu thiếu implementation, thêm clear office days.",
    remediation_en: "If implementation is missing, add clear office days.",
    learnerTraps_vi: ["ਸਹਿਯੋਗ = collaboration.", "Không nói hybrid chung chung."],
    learnerTraps_en: ["ਸਹਿਯੋਗ means collaboration.", "Do not keep hybrid vague."],
    canadaPracticalExample_vi: "Ví dụ Canada: winter commute can make hybrid days practical.",
    canadaPracticalExample_en: "Canada example: winter commuting can make hybrid days practical.",
  },
  {
    id: "pa_b2_recommend_education_work_study",
    level: "B2",
    scenario: "education",
    recommendationFocus: "compare_tradeoffs",
    prompt_gurmukhi: "ਵਿਦਿਆਰਥੀ ਲਈ ਪੜ੍ਹਾਈ ਨਾਲ ਪਾਰਟ-ਟਾਈਮ ਕੰਮ ਬਾਰੇ ਸਿਫ਼ਾਰਸ਼ ਕਰੋ।",
    prompt_romanization: "vidiaarthii lai parhaaee naal part-time kamm baare sifaarash karo.",
    prompt_vi: "Khuyến nghị về việc sinh viên vừa học vừa làm bán thời gian.",
    prompt_en: "Recommend whether a student should work part-time while studying.",
    recommendationFrame: [
      { move: "recommend", phrase_gurmukhi: "ਮੈਂ ਸੀਮਿਤ ਘੰਟਿਆਂ ਦੀ ਸਿਫ਼ਾਰਸ਼ ਕਰਦਾ ਹਾਂ।", romanization: "main siimit ghantiaa di sifaarash kardaa haan.", vi: "Tôi khuyến nghị số giờ giới hạn.", en: "I recommend limited hours." },
      { move: "reason", phrase_gurmukhi: "ਆਮਦਨ ਅਤੇ ਤਜਰਬਾ...", romanization: "aamdann ate tajrbaa...", vi: "Thu nhập và kinh nghiệm...", en: "Income and experience..." },
      { move: "tradeoff", phrase_gurmukhi: "ਪਰ ਪੜ੍ਹਾਈ ਪ੍ਰਭਾਵਿਤ...", romanization: "par parhaaee prabhaavit...", vi: "Nhưng việc học bị ảnh hưởng...", en: "But study may be affected..." },
      { move: "final_quality", phrase_gurmukhi: "ਇਮਤਿਹਾਨਾਂ ਤੋਂ ਪਹਿਲਾਂ...", romanization: "imtihaanaan ton pahilaan...", vi: "Trước kỳ thi...", en: "Before exams..." },
    ],
    modelRecommendation_gurmukhi: "ਮੈਂ ਸੀਮਿਤ ਘੰਟਿਆਂ ਵਾਲੇ ਪਾਰਟ-ਟਾਈਮ ਕੰਮ ਦੀ ਸਿਫ਼ਾਰਸ਼ ਕਰਦਾ ਹਾਂ। ਆਮਦਨ ਅਤੇ ਤਜਰਬਾ ਵਿਦਿਆਰਥੀ ਲਈ ਲਾਭਦਾਇਕ ਹਨ। ਪਰ ਜੇ ਘੰਟੇ ਵੱਧ ਹੋਣ, ਤਾਂ ਪੜ੍ਹਾਈ ਪ੍ਰਭਾਵਿਤ ਹੋ ਸਕਦੀ ਹੈ। ਇਮਤਿਹਾਨਾਂ ਤੋਂ ਪਹਿਲਾਂ shifts ਘਟਾਉਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ।",
    modelRecommendation_romanization: "main siimit ghantiaa vaale part-time kamm di sifaarash kardaa haan. aamdann ate tajrbaa vidiaarthii lai laabhdaaik han. par je ghante vadh hon, taan parhaaee prabhaavit ho sakdii hai. imtihaanaan ton pahilaan shifts ghataauniiaan chaahiidiiaan han.",
    modelRecommendation_vi: "Tôi khuyến nghị làm bán thời gian với số giờ giới hạn. Thu nhập và kinh nghiệm hữu ích cho sinh viên. Nhưng nếu số giờ quá nhiều, việc học có thể bị ảnh hưởng. Trước kỳ thi nên giảm ca.",
    modelRecommendation_en: "I recommend part-time work with limited hours. Income and experience are useful for a student. But if hours are too high, study may be affected. Shifts should be reduced before exams.",
    finalQualityCheck_vi: ["Limited recommendation", "Benefit", "Risk"],
    finalQualityCheck_en: ["Limited recommendation", "Benefit", "Risk"],
    remediation_vi: "Nếu chỉ nói benefit, thêm study risk.",
    remediation_en: "If only benefit is stated, add study risk.",
    learnerTraps_vi: ["ਸੀਮਿਤ = limited.", "Không chỉ nói income."],
    learnerTraps_en: ["ਸੀਮਿਤ means limited.", "Do not only mention income."],
  },
  {
    id: "pa_b2_recommend_education_program",
    level: "B2",
    scenario: "education",
    recommendationFocus: "recommend_option",
    prompt_gurmukhi: "Adult learner ਲਈ community class ਜਾਂ college course ਦੀ ਸਿਫ਼ਾਰਸ਼ ਕਰੋ।",
    prompt_romanization: "adult learner lai community class jaan college course di sifaarash karo.",
    prompt_vi: "Khuyến nghị lớp cộng đồng hoặc khóa college cho adult learner.",
    prompt_en: "Recommend a community class or college course for an adult learner.",
    recommendationFrame: [
      { move: "recommend", phrase_gurmukhi: "ਜੇ ਟੀਚਾ...", romanization: "je tiichaa...", vi: "Nếu mục tiêu...", en: "If the goal..." },
      { move: "tradeoff", phrase_gurmukhi: "ਕਮਿਊਨਟੀ ਕਲਾਸ ਸਸਤੀ...", romanization: "community class sastii...", vi: "Lớp cộng đồng rẻ...", en: "A community class is cheaper..." },
      { move: "reason", phrase_gurmukhi: "ਕਾਲਜ ਕੋਰਸ ਰਸਮੀ...", romanization: "college course rasmii...", vi: "Khóa college chính thức...", en: "A college course is formal..." },
      { move: "concern", phrase_gurmukhi: "ਚੋਣ ਟੀਚੇ ਤੇ ਨਿਰਭਰ...", romanization: "chon tiiche te nirbhar...", vi: "Lựa chọn phụ thuộc mục tiêu...", en: "The choice depends on the goal..." },
    ],
    modelRecommendation_gurmukhi: "ਜੇ ਟੀਚਾ language confidence ਹੈ, ਤਾਂ community class ਦੀ ਸਿਫ਼ਾਰਸ਼ ਕਰਦਾ ਹਾਂ ਕਿਉਂਕਿ ਇਹ ਸਸਤੀ ਅਤੇ ਲਚਕਦਾਰ ਹੈ। ਜੇ ਟੀਚਾ career credential ਹੈ, ਤਾਂ college course ਵਧੀਆ ਹੋ ਸਕਦਾ ਹੈ। ਚੋਣ ਟੀਚੇ, ਸਮੇਂ ਅਤੇ budget ਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।",
    modelRecommendation_romanization: "je tiichaa language confidence hai, taan community class di sifaarash kardaa haan kiunki ih sastii ate lachkdaar hai. je tiichaa career credential hai, taan college course vadhiyaa ho sakdaa hai. chon tiiche, same ate budget te nirbhar kardii hai.",
    modelRecommendation_vi: "Nếu mục tiêu là tự tin ngôn ngữ, tôi khuyến nghị lớp cộng đồng vì rẻ và linh hoạt. Nếu mục tiêu là chứng chỉ nghề nghiệp, khóa college có thể tốt hơn. Lựa chọn phụ thuộc mục tiêu, thời gian và ngân sách.",
    modelRecommendation_en: "If the goal is language confidence, I recommend a community class because it is cheaper and flexible. If the goal is a career credential, a college course may be better. The choice depends on goal, time, and budget.",
    finalQualityCheck_vi: ["Goal-based", "Two options", "No absolute answer"],
    finalQualityCheck_en: ["Goal-based", "Two options", "No absolute answer"],
    remediation_vi: "Nếu answer tuyệt đối, thêm if-goal condition.",
    remediation_en: "If the answer is absolute, add an if-goal condition.",
    learnerTraps_vi: ["ਨਿਰਭਰ = depends.", "Avoid one-size-fits-all."],
    learnerTraps_en: ["ਨਿਰਭਰ means depends.", "Avoid one-size-fits-all."],
    canadaPracticalExample_vi: "Ví dụ Canada: community centres and colleges serve different learner goals.",
    canadaPracticalExample_en: "Canada example: community centres and colleges serve different learner goals.",
  },
  {
    id: "pa_b2_recommend_health_wait_notice",
    level: "B2",
    scenario: "healthcare",
    recommendationFocus: "justify_reasons",
    prompt_gurmukhi: "ਕਲਿਨਿਕ ਲਈ ਉਡੀਕ ਸਮੇਂ ਬਾਰੇ ਸਧਾਰਨ notice ਦੀ ਸਿਫ਼ਾਰਸ਼ ਕਰੋ।",
    prompt_romanization: "clinic lai udiik same baare sadhaaran notice di sifaarash karo.",
    prompt_vi: "Khuyến nghị clinic dùng thông báo đơn giản về thời gian chờ.",
    prompt_en: "Recommend a plain notice about wait times for a clinic.",
    recommendationFrame: [
      { move: "recommend", phrase_gurmukhi: "ਮੇਰੀ ਸਿਫ਼ਾਰਸ਼...", romanization: "merii sifaarash...", vi: "Đề xuất của tôi...", en: "My recommendation..." },
      { move: "reason", phrase_gurmukhi: "ਇਸ ਨਾਲ ਚਿੰਤਾ ਘੱਟ...", romanization: "is naal chintaa ghatt...", vi: "Điều này giảm lo...", en: "This reduces anxiety..." },
      { move: "concern", phrase_gurmukhi: "ਤੁਰੰਤ ਮਾਮਲੇ...", romanization: "turant maamle...", vi: "Ca khẩn...", en: "Urgent cases..." },
      { move: "final_quality", phrase_gurmukhi: "ਸਧਾਰਨ ਭਾਸ਼ਾ...", romanization: "sadhaaran bhaashaa...", vi: "Ngôn ngữ đơn giản...", en: "Plain language..." },
    ],
    modelRecommendation_gurmukhi: "ਮੇਰੀ ਸਿਫ਼ਾਰਸ਼ ਹੈ ਕਿ ਕਲਿਨਿਕ ਉਡੀਕ ਸਮਾਂ ਅਤੇ ਅਗਲਾ ਕਦਮ ਸਧਾਰਨ notice ਵਿੱਚ ਲਿਖੇ। ਇਸ ਨਾਲ ਚਿੰਤਾ ਘੱਟ ਹੁੰਦੀ ਹੈ ਅਤੇ ਮਰੀਜ਼ ਯੋਜਨਾ ਬਣਾ ਸਕਦੇ ਹਨ। ਤੁਰੰਤ ਮਾਮਲਿਆਂ ਨੂੰ ਪਹਿਲ ਮਿਲ ਸਕਦੀ ਹੈ, ਇਸ ਲਈ notice ਵਿੱਚ ਇਹ ਵੀ ਸਪਸ਼ਟ ਹੋਵੇ।",
    modelRecommendation_romanization: "merii sifaarash hai ki clinic udiik samaa ate aglaa kadam sadhaaran notice vich likhe. is naal chintaa ghatt hundii hai ate mariiz yojnaa banaa sakde han. turant maamliaan nu pahal mil sakdii hai, is lai notice vich ih vii spasht hove.",
    modelRecommendation_vi: "Tôi khuyến nghị clinic viết thời gian chờ và bước tiếp theo trong notice đơn giản. Điều này giảm lo lắng và giúp bệnh nhân lên kế hoạch. Ca khẩn có thể được ưu tiên, nên notice cũng cần nói rõ điều đó.",
    modelRecommendation_en: "I recommend that the clinic write wait time and next step in a plain notice. This reduces anxiety and helps patients plan. Urgent cases may receive priority, so the notice should also make that clear.",
    finalQualityCheck_vi: ["No diagnosis", "Wait time", "Next step"],
    finalQualityCheck_en: ["No diagnosis", "Wait time", "Next step"],
    remediation_vi: "Nếu thành lời khuyên y tế cá nhân, quay lại process language.",
    remediation_en: "If it becomes personal medical advice, return to process language.",
    learnerTraps_vi: ["Không chẩn đoán.", "ਉਡੀਕ = wait."],
    learnerTraps_en: ["Do not diagnose.", "ਉਡੀਕ means wait."],
    canadaPracticalExample_vi: "Ví dụ Canada: walk-in clinics benefit from clear wait notices.",
    canadaPracticalExample_en: "Canada example: walk-in clinics benefit from clear wait notices.",
  },
  {
    id: "pa_b2_recommend_transport_evening_bus",
    level: "B2",
    scenario: "transport",
    recommendationFocus: "address_concerns",
    prompt_gurmukhi: "ਸ਼ਾਮ ਦੀ ਬੱਸ ਸੇਵਾ ਵਧਾਉਣ ਦੀ ਸਿਫ਼ਾਰਸ਼ ਕਰੋ ਅਤੇ cost concern address ਕਰੋ।",
    prompt_romanization: "shaam di bus sevaa vadhaaun di sifaarash karo ate cost concern address karo.",
    prompt_vi: "Khuyến nghị tăng xe buýt buổi tối và xử lý lo ngại chi phí.",
    prompt_en: "Recommend increasing evening bus service and address the cost concern.",
    recommendationFrame: [
      { move: "recommend", phrase_gurmukhi: "ਸੇਵਾ ਵਧਾਉਣੀ ਚਾਹੀਦੀ ਹੈ...", romanization: "sevaa vadhaaunii chaahiidii hai...", vi: "Nên tăng dịch vụ...", en: "Service should be increased..." },
      { move: "reason", phrase_gurmukhi: "ਇਸ ਨਾਲ workers...", romanization: "is naal workers...", vi: "Điều này giúp workers...", en: "This helps workers..." },
      { move: "concern", phrase_gurmukhi: "ਖਰਚੇ ਦੀ ਚਿੰਤਾ ਵਾਜਬ ਹੈ...", romanization: "kharche di chintaa vaajab hai...", vi: "Lo chi phí là hợp lý...", en: "The cost concern is reasonable..." },
      { move: "final_quality", phrase_gurmukhi: "ਪਹਿਲਾਂ high-demand routes...", romanization: "pahilaan high-demand routes...", vi: "Trước tiên tuyến nhu cầu cao...", en: "First high-demand routes..." },
    ],
    modelRecommendation_gurmukhi: "ਸ਼ਾਮ ਦੀ ਬੱਸ ਸੇਵਾ ਵਧਾਉਣੀ ਚਾਹੀਦੀ ਹੈ ਕਿਉਂਕਿ ਦੇਰ ਨਾਲ ਕੰਮ ਮੁਕਾਉਣ ਵਾਲੇ ਲੋਕਾਂ ਨੂੰ ਘਰ ਜਾਣ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ। ਖਰਚੇ ਦੀ ਚਿੰਤਾ ਵਾਜਬ ਹੈ, ਇਸ ਲਈ ਪਹਿਲਾਂ high-demand routes ਤੇ service ਵਧਾਈ ਜਾਵੇ। ਇਸ ਤਰੀਕੇ ਨਾਲ access ਵਧੇਗੀ ਪਰ cost ਕੰਟਰੋਲ ਰਹੇਗਾ।",
    modelRecommendation_romanization: "shaam di bus sevaa vadhaaunii chaahiidii hai kiunki der naal kamm mukaauṇ vaale lokaan nu ghar jaan di lor hundii hai. kharche di chintaa vaajab hai, is lai pahilaan high-demand routes te service vadhaaee jaave. is tariike naal access vadhegii par cost control rahegaa.",
    modelRecommendation_vi: "Nên tăng xe buýt buổi tối vì người tan ca muộn cần về nhà. Lo chi phí là hợp lý, nên trước tiên tăng dịch vụ trên tuyến có nhu cầu cao. Cách này tăng access nhưng giữ chi phí trong kiểm soát.",
    modelRecommendation_en: "Evening bus service should be increased because late workers need to get home. The cost concern is reasonable, so service should first increase on high-demand routes. This improves access while keeping cost controlled.",
    finalQualityCheck_vi: ["Need", "Cost concern", "Phased plan"],
    finalQualityCheck_en: ["Need", "Cost concern", "Phased plan"],
    remediation_vi: "Nếu bỏ cost, thêm phased recommendation.",
    remediation_en: "If cost is skipped, add a phased recommendation.",
    learnerTraps_vi: ["ਵਾਜਬ = reasonable.", "Public recommendation cần cost."],
    learnerTraps_en: ["ਵਾਜਬ means reasonable.", "A public recommendation needs cost."],
    canadaPracticalExample_vi: "Ví dụ Canada: shift workers and winter schedules affect evening transit.",
    canadaPracticalExample_en: "Canada example: shift workers and winter schedules affect evening transit.",
  },
  {
    id: "pa_b2_recommend_public_digital_support",
    level: "B2",
    scenario: "public_service",
    recommendationFocus: "compare_tradeoffs",
    prompt_gurmukhi: "ਸਿਰਫ਼ ਆਨਲਾਈਨ ਸੇਵਾ ਜਾਂ support ਵਾਲੀ ਸੇਵਾ ਵਿੱਚੋਂ ਸਿਫ਼ਾਰਸ਼ ਕਰੋ।",
    prompt_romanization: "sirf online sevaa jaan support vaalii sevaa vichon sifaarash karo.",
    prompt_vi: "Khuyến nghị giữa dịch vụ chỉ online và dịch vụ có hỗ trợ.",
    prompt_en: "Recommend between online-only service and service with support.",
    recommendationFrame: [
      { move: "recommend", phrase_gurmukhi: "ਦੋਵੇਂ ਵਿਕਲਪ ਰਹਿਣੇ ਚਾਹੀਦੇ ਹਨ।", romanization: "dovein vikalp rahine chaahiide han.", vi: "Nên giữ cả hai lựa chọn.", en: "Both options should remain." },
      { move: "reason", phrase_gurmukhi: "ਆਨਲਾਈਨ ਤੇਜ਼ ਹੈ...", romanization: "online tez hai...", vi: "Online nhanh...", en: "Online is fast..." },
      { move: "tradeoff", phrase_gurmukhi: "ਪਰ access...", romanization: "par access...", vi: "Nhưng access...", en: "But access..." },
      { move: "final_quality", phrase_gurmukhi: "high-use forms ਲਈ...", romanization: "high-use forms lai...", vi: "Cho form dùng nhiều...", en: "For high-use forms..." },
    ],
    modelRecommendation_gurmukhi: "ਮੇਰੀ ਸਿਫ਼ਾਰਸ਼ ਹੈ ਕਿ ਦੋਵੇਂ ਵਿਕਲਪ ਰਹਿਣ: online form ਅਤੇ phone ਜਾਂ ਦਫ਼ਤਰ support। ਆਨਲਾਈਨ ਤੇਜ਼ ਹੈ ਅਤੇ cost ਘੱਟ ਕਰ ਸਕਦਾ ਹੈ, ਪਰ ਹਰ ਕਿਸੇ ਲਈ ਆਸਾਨ ਨਹੀਂ। high-use forms ਲਈ support ਪਹਿਲਾਂ ਦੇਣਾ practical ਹੈ।",
    modelRecommendation_romanization: "merii sifaarash hai ki dovein vikalp rahan: online form ate phone jaan daftar support. online tez hai ate cost ghatt kar sakdaa hai, par har kise lai aasaan nahi. high-use forms lai support pahilaan denaa practical hai.",
    modelRecommendation_vi: "Tôi khuyến nghị giữ cả hai lựa chọn: form online và hỗ trợ qua phone hoặc văn phòng. Online nhanh và có thể giảm chi phí, nhưng không dễ cho mọi người. Hỗ trợ trước cho form dùng nhiều là thực tế.",
    modelRecommendation_en: "I recommend keeping both options: online form and phone or office support. Online is fast and can reduce cost, but it is not easy for everyone. Supporting high-use forms first is practical.",
    finalQualityCheck_vi: ["Both options", "Access barrier", "Practical priority"],
    finalQualityCheck_en: ["Both options", "Access barrier", "Practical priority"],
    remediation_vi: "Nếu answer chỉ nói online, thêm access barrier.",
    remediation_en: "If the answer only says online, add an access barrier.",
    learnerTraps_vi: ["ਦੋਵੇਂ = both.", "Đừng bỏ người cần support."],
    learnerTraps_en: ["ਦੋਵੇਂ means both.", "Do not skip people who need support."],
    canadaPracticalExample_vi: "Ví dụ Canada: libraries can help residents use online public forms.",
    canadaPracticalExample_en: "Canada example: libraries can help residents use online public forms.",
  },
  {
    id: "pa_b2_recommend_public_plain_language",
    level: "B2",
    scenario: "public_service",
    recommendationFocus: "justify_reasons",
    prompt_gurmukhi: "ਸਰਕਾਰੀ ਪੱਤਰਾਂ ਲਈ ਸਧਾਰਨ ਭਾਸ਼ਾ ਦੀ ਸਿਫ਼ਾਰਸ਼ ਕਰੋ।",
    prompt_romanization: "sarkaarii pattaraan lai sadhaaran bhaashaa di sifaarash karo.",
    prompt_vi: "Khuyến nghị dùng plain language trong thư công quyền.",
    prompt_en: "Recommend plain language in public-service letters.",
    recommendationFrame: [
      { move: "recommend", phrase_gurmukhi: "ਪੱਤਰ ਸਧਾਰਨ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।", romanization: "pattar sadhaaran hone chaahiide han.", vi: "Thư nên đơn giản.", en: "Letters should be plain." },
      { move: "reason", phrase_gurmukhi: "ਲੋਕ ਅਗਲਾ ਕਦਮ...", romanization: "lok aglaa kadam...", vi: "Người dân hiểu bước tiếp theo...", en: "People understand the next step..." },
      { move: "concern", phrase_gurmukhi: "ਫਿਰ ਵੀ ਜਾਣਕਾਰੀ ਪੂਰੀ...", romanization: "fir vii jaankaari puurii...", vi: "Tuy vậy thông tin đầy đủ...", en: "Still, information complete..." },
      { move: "final_quality", phrase_gurmukhi: "ਛੋਟੇ ਵਾਕ...", romanization: "chhote vaak...", vi: "Câu ngắn...", en: "Short sentences..." },
    ],
    modelRecommendation_gurmukhi: "ਸਰਕਾਰੀ ਪੱਤਰ ਸਧਾਰਨ ਭਾਸ਼ਾ ਵਿੱਚ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ। ਇਸ ਨਾਲ ਲੋਕ ਅਗਲਾ ਕਦਮ, ਮਿਤੀ ਅਤੇ ਦਸਤਾਵੇਜ਼ ਸਮਝਦੇ ਹਨ। ਫਿਰ ਵੀ ਜਾਣਕਾਰੀ ਪੂਰੀ ਰਹਿਣੀ ਚਾਹੀਦੀ ਹੈ। ਮੇਰੀ ਸਿਫ਼ਾਰਸ਼ ਹੈ ਕਿ ਪੱਤਰ ਛੋਟੇ ਵਾਕਾਂ ਅਤੇ ਸਪਸ਼ਟ headings ਨਾਲ ਲਿਖੇ ਜਾਣ।",
    modelRecommendation_romanization: "sarkaarii pattar sadhaaran bhaashaa vich hone chaahiide han. is naal lok aglaa kadam, mitii ate dastaaavez samajhde han. fir vii jaankaari puurii rahinii chaahiidii hai. merii sifaarash hai ki pattar chhote vaakaan ate spasht headings naal likhe jaan.",
    modelRecommendation_vi: "Thư công quyền nên dùng plain language. Điều này giúp người dân hiểu bước tiếp theo, ngày hạn và giấy tờ. Tuy vậy thông tin vẫn phải đầy đủ. Tôi đề xuất viết thư bằng câu ngắn và headings rõ.",
    modelRecommendation_en: "Public-service letters should use plain language. This helps people understand the next step, date, and documents. Still, information must remain complete. I recommend writing letters with short sentences and clear headings.",
    finalQualityCheck_vi: ["Plain language", "Complete information", "Concrete writing choice"],
    finalQualityCheck_en: ["Plain language", "Complete information", "Concrete writing choice"],
    remediation_vi: "Nếu simple thành incomplete, thêm completeness concern.",
    remediation_en: "If simple becomes incomplete, add completeness concern.",
    learnerTraps_vi: ["ਸਧਾਰਨ = plain/simple.", "Simple không phải thiếu thông tin."],
    learnerTraps_en: ["ਸਧਾਰਨ means plain/simple.", "Simple does not mean missing information."],
  },
  {
    id: "pa_b2_recommend_final_quality",
    level: "B2",
    scenario: "public_service",
    recommendationFocus: "address_concerns",
    prompt_gurmukhi: "public service improvement ਲਈ final-quality recommendation ਦਿਓ।",
    prompt_romanization: "public service improvement lai final-quality recommendation dio.",
    prompt_vi: "Đưa khuyến nghị final-quality cho cải thiện dịch vụ công.",
    prompt_en: "Give a final-quality recommendation for a public-service improvement.",
    recommendationFrame: [
      { move: "recommend", phrase_gurmukhi: "ਮੇਰੀ ਅੰਤਿਮ ਸਿਫ਼ਾਰਸ਼...", romanization: "merii antim sifaarash...", vi: "Khuyến nghị cuối của tôi...", en: "My final recommendation..." },
      { move: "reason", phrase_gurmukhi: "ਇਹ access ਵਧਾਉਂਦਾ ਹੈ...", romanization: "ih access vadhaaudaa hai...", vi: "Điều này tăng access...", en: "This increases access..." },
      { move: "concern", phrase_gurmukhi: "ਖਰਚੇ ਦੀ ਚਿੰਤਾ...", romanization: "kharche di chintaa...", vi: "Lo chi phí...", en: "The cost concern..." },
      { move: "final_quality", phrase_gurmukhi: "ਪਹਿਲਾਂ ਸਭ ਤੋਂ ਵੱਧ ਵਰਤੇ forms...", romanization: "pahilaan sabh ton vadh varte forms...", vi: "Trước tiên form dùng nhiều nhất...", en: "First the most-used forms..." },
    ],
    modelRecommendation_gurmukhi: "ਮੇਰੀ ਅੰਤਿਮ ਸਿਫ਼ਾਰਸ਼ ਹੈ ਕਿ public service ਸਭ ਤੋਂ ਵੱਧ ਵਰਤੇ forms ਲਈ ਸਧਾਰਨ ਭਾਸ਼ਾ ਅਤੇ phone support ਦੇਵੇ। ਇਹ access ਵਧਾਉਂਦਾ ਹੈ ਅਤੇ ਗਲਤੀਆਂ ਘੱਟ ਕਰਦਾ ਹੈ। ਖਰਚੇ ਦੀ ਚਿੰਤਾ ਵਾਜਬ ਹੈ, ਇਸ ਲਈ ਪਹਿਲਾਂ high-use forms ਨਾਲ ਸ਼ੁਰੂ ਕਰਨਾ practical ਹੈ।",
    modelRecommendation_romanization: "merii antim sifaarash hai ki public service sabh ton vadh varte forms lai sadhaaran bhaashaa ate phone support deve. ih access vadhaaudaa hai ate galtiiaan ghatt kardaa hai. kharche di chintaa vaajab hai, is lai pahilaan high-use forms naal shuruu karnaa practical hai.",
    modelRecommendation_vi: "Khuyến nghị cuối của tôi là dịch vụ công cung cấp plain language và phone support cho các form dùng nhiều nhất. Điều này tăng access và giảm lỗi. Lo chi phí là hợp lý, nên bắt đầu với high-use forms là thực tế.",
    modelRecommendation_en: "My final recommendation is that public service provide plain language and phone support for the most-used forms. This increases access and reduces mistakes. The cost concern is reasonable, so starting with high-use forms is practical.",
    finalQualityCheck_vi: ["Clear final recommendation", "Reason", "Concern", "Phased plan"],
    finalQualityCheck_en: ["Clear final recommendation", "Reason", "Concern", "Phased plan"],
    remediation_vi: "Nếu thiếu final-quality, thêm phased plan và measurable focus.",
    remediation_en: "If final quality is missing, add a phased plan and measurable focus.",
    learnerTraps_vi: ["ਅੰਤਿਮ = final.", "Recommendation cần cụ thể, không chung chung."],
    learnerTraps_en: ["ਅੰਤਿਮ means final.", "A recommendation needs to be specific, not vague."],
    canadaPracticalExample_vi: "Ví dụ Canada: high-use forms benefit from plain language and phone support.",
    canadaPracticalExample_en: "Canada example: high-use forms benefit from plain language and phone support.",
  },
];

export default punjabiRecommendationTasksB2;
