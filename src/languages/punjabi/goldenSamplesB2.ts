// Punjabi B2 golden samples for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization is included as a bridge.

export type PunjabiGoldenSampleB2Skill =
  | "structured_opinion"
  | "comparison"
  | "counterpoint"
  | "recommendation"
  | "workplace_fairness";

export type PunjabiGoldenSampleB2Topic =
  | "settlement"
  | "education"
  | "healthcare"
  | "housing"
  | "transport"
  | "public_service"
  | "work";

export type PunjabiGoldenSampleB2 = {
  id: string;
  level: "B2";
  skill: PunjabiGoldenSampleB2Skill;
  topic: PunjabiGoldenSampleB2Topic;
  prompt_gurmukhi: string;
  prompt_romanization: string;
  prompt_vi: string;
  prompt_en: string;
  goldenAnswer_gurmukhi: string;
  goldenAnswer_romanization: string;
  goldenAnswer_vi: string;
  goldenAnswer_en: string;
  finalQa_vi: string[];
  finalQa_en: string[];
  integrationReadiness_vi: string;
  integrationReadiness_en: string;
  learnerTraps_vi: string[];
  learnerTraps_en: string[];
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

export const punjabiGoldenSamplesB2: PunjabiGoldenSampleB2[] = [
  {
    id: "pa_b2_golden_public_plain_language",
    level: "B2",
    skill: "structured_opinion",
    topic: "public_service",
    prompt_gurmukhi: "ਸਰਕਾਰੀ ਪੱਤਰਾਂ ਵਿੱਚ ਸਧਾਰਨ ਭਾਸ਼ਾ ਕਿਉਂ ਜ਼ਰੂਰੀ ਹੈ?",
    prompt_romanization: "sarkaarii pattaraan vich sadhaaran bhaashaa kiun zaruurii hai?",
    prompt_vi: "Vì sao thư công quyền cần ngôn ngữ đơn giản?",
    prompt_en: "Why do public-service letters need plain language?",
    goldenAnswer_gurmukhi: "ਮੇਰੇ ਵਿਚਾਰ ਵਿੱਚ ਸਧਾਰਨ ਭਾਸ਼ਾ ਜ਼ਰੂਰੀ ਹੈ ਕਿਉਂਕਿ ਲੋਕਾਂ ਨੂੰ ਅਗਲਾ ਕਦਮ, ਮਿਤੀ ਅਤੇ ਦਸਤਾਵੇਜ਼ ਸਮਝਣੇ ਹੁੰਦੇ ਹਨ। ਜੇ ਪੱਤਰ ਜਟਿਲ ਹੋਵੇ, ਤਾਂ form ਗਲਤ ਭਰਿਆ ਜਾ ਸਕਦਾ ਹੈ। ਫਿਰ ਵੀ ਜਾਣਕਾਰੀ ਪੂਰੀ ਰਹਿਣੀ ਚਾਹੀਦੀ ਹੈ। ਮੇਰੀ ਸਿਫ਼ਾਰਸ਼ ਹੈ ਕਿ ਪੱਤਰ ਛੋਟੇ ਵਾਕਾਂ ਨਾਲ ਲਿਖੇ ਜਾਣ।",
    goldenAnswer_romanization: "mere vichaar vich sadhaaran bhaashaa zaruurii hai kiunki lokaan nu aglaa kadam, mitii ate dastaaavez samajhne hunde han. je pattar jatil hove, taan form galat bhariaa jaa sakdaa hai. fir vii jaankaari puurii rahinii chaahiidii hai. merii sifaarash hai ki pattar chhote vaakaan naal likhe jaan.",
    goldenAnswer_vi: "Theo tôi, plain language cần thiết vì người dân phải hiểu bước tiếp theo, ngày hạn và giấy tờ. Nếu thư phức tạp, form có thể bị điền sai. Tuy vậy thông tin vẫn phải đầy đủ. Tôi đề xuất viết thư bằng câu ngắn.",
    goldenAnswer_en: "In my view, plain language is necessary because people need to understand the next step, date, and documents. If a letter is complex, the form may be completed incorrectly. Still, information must remain complete. I recommend short sentences.",
    finalQa_vi: ["Có stance", "Có consequence", "Có recommendation"],
    finalQa_en: ["Stance", "Consequence", "Recommendation"],
    integrationReadiness_vi: "Sẵn sàng nếu answer có viewpoint, counterpoint và recommendation.",
    integrationReadiness_en: "Ready if the answer has viewpoint, counterpoint, and recommendation.",
    learnerTraps_vi: ["ਸਧਾਰਨ = plain/simple.", "Simple không có nghĩa thiếu thông tin."],
    learnerTraps_en: ["ਸਧਾਰਨ means plain/simple.", "Simple does not mean incomplete."],
    scriptAwareness_en: "Gurmukhi is taught here; Shahmukhi is awareness only.",
    nativeReview: "deferred",
  },
  {
    id: "pa_b2_golden_transport_compare",
    level: "B2",
    skill: "comparison",
    topic: "transport",
    prompt_gurmukhi: "ਗੱਡੀ ਖਰੀਦਣ ਅਤੇ ਪਬਲਿਕ ਟ੍ਰਾਂਜ਼ਿਟ ਵਰਤਣ ਦੀ ਤੁਲਨਾ ਕਰੋ।",
    prompt_romanization: "gaddi khariidan ate public transit vartan di tulnaa karo.",
    prompt_vi: "So sánh mua xe và dùng giao thông công cộng.",
    prompt_en: "Compare buying a car and using public transit.",
    goldenAnswer_gurmukhi: "ਗੱਡੀ ਲਚਕ ਦਿੰਦੀ ਹੈ, ਪਰ insurance, parking ਅਤੇ maintenance ਮਹਿੰਗੇ ਹੋ ਸਕਦੇ ਹਨ। ਪਬਲਿਕ ਟ੍ਰਾਂਜ਼ਿਟ ਸਸਤਾ ਹੈ, ਪਰ route ਅਤੇ ਸਮੇਂ ਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ। ਜੇ ਕੰਮ transit ਨਾਲ ਪਹੁੰਚਯੋਗ ਹੈ, ਪਹਿਲਾਂ transit ਅਜ਼ਮਾਉਣਾ ਵਧੀਆ ਹੈ।",
    goldenAnswer_romanization: "gaddi lachak dindii hai, par insurance, parking ate maintenance mahinge ho sakde han. public transit sastaa hai, par route ate same te nirbhar kardaa hai. je kamm transit naal pahunchyog hai, pahilaan transit azmaaunaa vadhiyaa hai.",
    goldenAnswer_vi: "Xe hơi linh hoạt nhưng bảo hiểm, đỗ xe và bảo trì có thể đắt. Transit rẻ hơn nhưng phụ thuộc tuyến và thời gian. Nếu nơi làm đến được bằng transit, nên thử transit trước.",
    goldenAnswer_en: "A car gives flexibility, but insurance, parking, and maintenance can be expensive. Public transit is cheaper but depends on routes and timing. If work is reachable by transit, try transit first.",
    finalQa_vi: ["Hai options", "Cost", "Conditional recommendation"],
    finalQa_en: ["Two options", "Cost", "Conditional recommendation"],
    integrationReadiness_vi: "Sẵn sàng nếu có tradeoff chứ không chỉ preference.",
    integrationReadiness_en: "Ready if there is a tradeoff, not only preference.",
    learnerTraps_vi: ["ਤੁਲਨਾ = comparison.", "Đừng bỏ parking/insurance."],
    learnerTraps_en: ["ਤੁਲਨਾ means comparison.", "Do not skip parking/insurance."],
    canadaPracticalExample_vi: "Ví dụ Canada: winter commute và bus frequency ảnh hưởng lựa chọn.",
    canadaPracticalExample_en: "Canada example: winter commuting and bus frequency affect the choice.",
  },
  {
    id: "pa_b2_golden_housing_recommend",
    level: "B2",
    skill: "recommendation",
    topic: "housing",
    prompt_gurmukhi: "ਸਸਤੇ ਪਰ ਦੂਰ ਘਰ ਅਤੇ transit ਦੇ ਨੇੜੇ ਘਰ ਵਿੱਚੋਂ ਸਿਫ਼ਾਰਸ਼ ਕਰੋ।",
    prompt_romanization: "saste par duur ghar ate transit de nere ghar vichon sifaarash karo.",
    prompt_vi: "Khuyến nghị giữa nhà rẻ nhưng xa và nhà gần transit.",
    prompt_en: "Recommend between cheaper housing far away and housing near transit.",
    goldenAnswer_gurmukhi: "ਮੇਰੀ ਸਿਫ਼ਾਰਸ਼ transit ਦੇ ਨੇੜੇ ਘਰ ਹੈ ਜੇ ਪਰਿਵਾਰ ਕੋਲ ਗੱਡੀ ਨਹੀਂ। ਕਿਰਾਇਆ ਵੱਧ ਹੈ, ਪਰ commute ਛੋਟਾ ਅਤੇ ਭਰੋਸੇਯੋਗ ਹੋ ਸਕਦਾ ਹੈ। ਖਰਚੇ ਦੀ ਚਿੰਤਾ ਵਾਜਬ ਹੈ, ਇਸ ਲਈ budget ਪਹਿਲਾਂ ਚੈੱਕ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ।",
    goldenAnswer_romanization: "merii sifaarash transit de nere ghar hai je parivaar kol gaddi nahi. kiraayaa vadh hai, par commute chhota ate bharoseyog ho sakdaa hai. kharche di chintaa vaajab hai, is lai budget pahilaan check karnaa chaahiidaa hai.",
    goldenAnswer_vi: "Tôi khuyến nghị nhà gần transit nếu gia đình không có xe. Tiền thuê cao hơn, nhưng commute ngắn và đáng tin hơn. Lo về chi phí là hợp lý, nên kiểm tra ngân sách trước.",
    goldenAnswer_en: "I recommend housing near transit if the family has no car. Rent is higher, but commuting can be shorter and more reliable. The cost concern is reasonable, so check the budget first.",
    finalQa_vi: ["Recommendation", "Tradeoff", "Concern addressed"],
    finalQa_en: ["Recommendation", "Tradeoff", "Concern addressed"],
    integrationReadiness_vi: "Sẵn sàng nếu answer cân nhắc rent và commute.",
    integrationReadiness_en: "Ready if the answer weighs rent and commute.",
    learnerTraps_vi: ["ਵਾਜਬ = reasonable.", "Không chỉ so sánh tiền thuê."],
    learnerTraps_en: ["ਵਾਜਬ means reasonable.", "Do not only compare rent."],
    canadaPracticalExample_vi: "Ví dụ Canada: transit routes and winter travel affect housing.",
    canadaPracticalExample_en: "Canada example: transit routes and winter travel affect housing.",
  },
  {
    id: "pa_b2_golden_settlement_service",
    level: "B2",
    skill: "recommendation",
    topic: "settlement",
    prompt_gurmukhi: "ਸੈਟਲਮੈਂਟ ਸੇਵਾ ਨਾਲ ਮਿਲਣ ਦੀ ਸਿਫ਼ਾਰਸ਼ ਕਰੋ।",
    prompt_romanization: "settlement sevaa naal milan di sifaarash karo.",
    prompt_vi: "Khuyến nghị gặp dịch vụ định cư.",
    prompt_en: "Recommend meeting a settlement service.",
    goldenAnswer_gurmukhi: "ਮੇਰੀ ਸਿਫ਼ਾਰਸ਼ ਹੈ ਕਿ ਨਵੇਂ ਆਏ ਵਿਅਕਤੀ ਪਹਿਲਾਂ ਸੈਟਲਮੈਂਟ ਸੇਵਾ ਨਾਲ ਮਿਲੇ। ਸੇਵਾ forms, school ਅਤੇ housing ਦਸਤਾਵੇਜ਼ ਬਾਰੇ ਦਿਸ਼ਾ ਦੇ ਸਕਦੀ ਹੈ। ਫਿਰ ਵੀ ਫੈਸਲਾ ਆਪਣੇ ਹਾਲਾਤ ਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ।",
    goldenAnswer_romanization: "merii sifaarash hai ki nave aaye viakti pahilaan settlement sevaa naal mile. sevaa forms, school ate housing dastaaavez baare dishaa de sakdii hai. fir vii faislaa apne haalaat te nirbhar kardaa hai.",
    goldenAnswer_vi: "Tôi khuyến nghị người mới đến gặp dịch vụ định cư trước. Dịch vụ có thể hướng dẫn về form, trường học và giấy tờ nhà ở. Tuy vậy quyết định phụ thuộc hoàn cảnh cá nhân.",
    goldenAnswer_en: "I recommend that a newcomer first meet a settlement service. The service can guide forms, school, and housing documents. Still, the decision depends on personal circumstances.",
    finalQa_vi: ["Benefit", "Limit", "Practical first step"],
    finalQa_en: ["Benefit", "Limit", "Practical first step"],
    integrationReadiness_vi: "Sẵn sàng nếu không hứa quá mức.",
    integrationReadiness_en: "Ready if it does not overpromise.",
    learnerTraps_vi: ["ਨਿਰਭਰ = depends.", "Đừng hứa service giải quyết mọi thứ."],
    learnerTraps_en: ["ਨਿਰਭਰ means depends.", "Do not promise the service solves everything."],
    canadaPracticalExample_vi: "Ví dụ Canada: settlement workers can explain school and housing pathways.",
    canadaPracticalExample_en: "Canada example: settlement workers can explain school and housing pathways.",
  },
  {
    id: "pa_b2_golden_work_fairness",
    level: "B2",
    skill: "workplace_fairness",
    topic: "work",
    prompt_gurmukhi: "ਟੀਮ ਵਿੱਚ ਕੰਮ ਦੀ ਵੰਡ ਅਸਮਾਨ ਹੈ। ਪੇਸ਼ੇਵਰ ਸੁਝਾਅ ਦਿਓ।",
    prompt_romanization: "team vich kamm di vand asamaan hai. peshevar sujhaav dio.",
    prompt_vi: "Phân việc trong đội không đều. Hãy góp ý chuyên nghiệp.",
    prompt_en: "Task distribution in the team is uneven. Give a professional suggestion.",
    goldenAnswer_gurmukhi: "ਮੇਰਾ ਸੁਝਾਅ ਹੈ ਕਿ ਕੰਮ ਦੀ ਸੂਚੀ ਖੁੱਲ੍ਹੀ ਰੱਖੀ ਜਾਵੇ ਅਤੇ ਹਫ਼ਤੇ ਵਿੱਚ ਇੱਕ ਵਾਰ ਵੰਡ ਦੀ ਸਮੀਖਿਆ ਹੋਵੇ। ਇਸ ਨਾਲ ਟੀਮ ਨੂੰ ਲੱਗੇਗਾ ਕਿ ਕੰਮ ਨਿਆਇਕ ਤਰੀਕੇ ਨਾਲ ਵੰਡਿਆ ਜਾ ਰਿਹਾ ਹੈ।",
    goldenAnswer_romanization: "mera sujhaav hai ki kamm di suuchii khullhii rakhii jaave ate hafte vich ikk vaar vand di samiikhiaa hove. is naal team nu laggegaa ki kamm niaaik tariike naal vandiaa jaa rihaa hai.",
    goldenAnswer_vi: "Đề xuất của tôi là giữ danh sách việc minh bạch và xem lại phân chia mỗi tuần. Điều này giúp đội cảm thấy công việc được chia công bằng.",
    goldenAnswer_en: "My suggestion is to keep the task list transparent and review distribution weekly. This helps the team feel work is being shared fairly.",
    finalQa_vi: ["No blame", "Process", "Fairness"],
    finalQa_en: ["No blame", "Process", "Fairness"],
    integrationReadiness_vi: "Sẵn sàng nếu tone professional.",
    integrationReadiness_en: "Ready if the tone is professional.",
    learnerTraps_vi: ["ਅਸਮਾਨ = uneven.", "Focus process, không blame."],
    learnerTraps_en: ["ਅਸਮਾਨ means uneven.", "Focus on process, not blame."],
  },
  {
    id: "pa_b2_golden_work_counter_shift",
    level: "B2",
    skill: "counterpoint",
    topic: "work",
    prompt_gurmukhi: "ਕੋਈ ਕਹਿੰਦਾ ਹੈ ਕਿ ਸ਼ਿਫਟ ਬਦਲਣਾ ਹਮੇਸ਼ਾ ਮਾੜਾ ਹੈ। ਜਵਾਬ ਦਿਓ।",
    prompt_romanization: "koi kahindaa hai ki shift badalnaa hameshaa maarraa hai. javaab dio.",
    prompt_vi: "Có người nói đổi ca luôn xấu. Hãy phản hồi.",
    prompt_en: "Someone says changing shifts is always bad. Respond.",
    goldenAnswer_gurmukhi: "ਚਿੰਤਾ ਵਾਜਬ ਹੈ ਕਿਉਂਕਿ ਅਚਾਨਕ ਬਦਲਾਅ ਯੋਜਨਾ ਪ੍ਰਭਾਵਿਤ ਕਰਦਾ ਹੈ। ਪਰ ਜੇ ਕਰਮਚਾਰੀ ਪਹਿਲਾਂ ਦੱਸੇ ਅਤੇ ਬਦਲ ਸੁਝਾਏ, ਤਾਂ ਨੁਕਸਾਨ ਘੱਟ ਹੋ ਸਕਦਾ ਹੈ। ਨਿਯਮ ਇਹ ਹੋ ਸਕਦਾ ਹੈ ਕਿ ਬੇਨਤੀ ਜਲਦੀ ਕੀਤੀ ਜਾਵੇ।",
    goldenAnswer_romanization: "chintaa vaajab hai kiunki achaanak badlaa yojnaa prabhaavit kardaa hai. par je karamchaarii pahilaan dasse ate badal sujhaae, taan nuksaan ghatt ho sakdaa hai. niyam ih ho sakdaa hai ki benatii jaldi kiti jaave.",
    goldenAnswer_vi: "Mối lo hợp lý vì thay đổi bất ngờ ảnh hưởng kế hoạch. Nhưng nếu nhân viên báo sớm và đề xuất người thay, tác hại có thể giảm. Quy định có thể là yêu cầu phải báo sớm.",
    goldenAnswer_en: "The concern is reasonable because sudden changes affect planning. But if the employee communicates early and suggests coverage, harm can be reduced. The rule could be that requests are made early.",
    finalQa_vi: ["Acknowledge", "Exception", "Rule"],
    finalQa_en: ["Acknowledge", "Exception", "Rule"],
    integrationReadiness_vi: "Sẵn sàng nếu answer tránh always/never.",
    integrationReadiness_en: "Ready if the answer avoids always/never.",
    learnerTraps_vi: ["ਵਾਜਬ = reasonable.", "Avoid always/never."],
    learnerTraps_en: ["ਵਾਜਬ means reasonable.", "Avoid always/never."],
    canadaPracticalExample_vi: "Ví dụ Canada: childcare and transit can affect shift schedules.",
    canadaPracticalExample_en: "Canada example: child care and transit can affect shift schedules.",
  },
  {
    id: "pa_b2_golden_education_parent",
    level: "B2",
    skill: "recommendation",
    topic: "education",
    prompt_gurmukhi: "ਅਧਿਆਪਕ ਨੂੰ ਬੱਚੇ ਦੀ ਤਰੱਕੀ ਬਾਰੇ ਨਰਮੀ ਨਾਲ ਪੁੱਛੋ।",
    prompt_romanization: "adhyaapak nu bachche di tarakki baare narmii naal puchho.",
    prompt_vi: "Hỏi giáo viên lịch sự về tiến bộ của con.",
    prompt_en: "Politely ask a teacher about a child's progress.",
    goldenAnswer_gurmukhi: "ਮੈਂ ਆਪਣੇ ਬੱਚੇ ਦੀ ਤਰੱਕੀ ਬਾਰੇ ਜਾਣਨਾ ਚਾਹੁੰਦਾ ਹਾਂ। ਕੀ ਤੁਸੀਂ ਦੱਸ ਸਕਦੇ ਹੋ ਕਿ ਉਹ ਕਿੱਥੇ ਮਜ਼ਬੂਤ ਹੈ ਅਤੇ ਕਿੱਥੇ ਹੋਰ ਅਭਿਆਸ ਦੀ ਲੋੜ ਹੈ? ਘਰ ਵਿੱਚ ਅਸੀਂ ਕੀ ਕਰ ਸਕਦੇ ਹਾਂ?",
    goldenAnswer_romanization: "main apne bachche di tarakki baare jaannaa chaahundaa haan. kii tusii dass sakde ho ki oh kithe mazbuut hai ate kithe hor abhyaas di lor hai? ghar vich asii kii kar sakde haan?",
    goldenAnswer_vi: "Tôi muốn biết về tiến bộ của con tôi. Thầy/cô có thể cho biết con mạnh ở đâu và cần luyện thêm ở đâu không? Ở nhà chúng tôi có thể làm gì?",
    goldenAnswer_en: "I would like to know about my child's progress. Could you tell me where they are strong and where they need more practice? What can we do at home?",
    finalQa_vi: ["Polite", "Specific", "Support request"],
    finalQa_en: ["Polite", "Specific", "Support request"],
    integrationReadiness_vi: "Sẵn sàng nếu câu hỏi cụ thể.",
    integrationReadiness_en: "Ready if the question is specific.",
    learnerTraps_vi: ["ਤਰੱਕੀ = progress.", "Không hỏi quá chung."],
    learnerTraps_en: ["ਤਰੱਕੀ means progress.", "Do not ask too generally."],
    canadaPracticalExample_vi: "Ví dụ Canada: parent-teacher interviews use polite specific questions.",
    canadaPracticalExample_en: "Canada example: parent-teacher interviews use polite specific questions.",
  },
  {
    id: "pa_b2_golden_education_compare",
    level: "B2",
    skill: "comparison",
    topic: "education",
    prompt_gurmukhi: "ਕਮਿਊਨਟੀ ਕਲਾਸ ਅਤੇ ਕਾਲਜ ਕੋਰਸ ਦੀ ਤੁਲਨਾ ਕਰੋ।",
    prompt_romanization: "community class ate college course di tulnaa karo.",
    prompt_vi: "So sánh lớp cộng đồng và khóa college.",
    prompt_en: "Compare a community class and a college course.",
    goldenAnswer_gurmukhi: "ਕਮਿਊਨਟੀ ਕਲਾਸ ਸਸਤੀ ਅਤੇ ਲਚਕਦਾਰ ਹੈ, ਇਸ ਲਈ ਸ਼ੁਰੂਆਤੀ ਸਹਾਇਤਾ ਲਈ ਚੰਗੀ ਹੈ। ਕਾਲਜ ਕੋਰਸ ਹੋਰ ਰਸਮੀ ਹੈ ਅਤੇ career ਲਈ ਵਧੀਆ ਹੋ ਸਕਦਾ ਹੈ। ਚੋਣ ਟੀਚੇ, ਸਮੇਂ ਅਤੇ ਪੈਸੇ ਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।",
    goldenAnswer_romanization: "community class sastii ate lachkdaar hai, is lai shuruaatii sahaaitaa lai changii hai. college course hor rasmii hai ate career lai vadhiyaa ho sakdaa hai. chon tiiche, same ate paise te nirbhar kardii hai.",
    goldenAnswer_vi: "Lớp cộng đồng rẻ và linh hoạt, nên tốt cho hỗ trợ ban đầu. Khóa college chính thức hơn và có thể tốt cho nghề nghiệp. Lựa chọn phụ thuộc mục tiêu, thời gian và tiền.",
    goldenAnswer_en: "A community class is cheaper and flexible, so it is good for initial support. A college course is more formal and may be better for a career. The choice depends on goal, time, and money.",
    finalQa_vi: ["Criteria", "Both options", "Depends"],
    finalQa_en: ["Criteria", "Both options", "Depends"],
    integrationReadiness_vi: "Sẵn sàng nếu không chọn tuyệt đối.",
    integrationReadiness_en: "Ready if the answer does not choose absolutely.",
    learnerTraps_vi: ["ਲਚਕਦਾਰ = flexible.", "Avoid absolute answer."],
    learnerTraps_en: ["ਲਚਕਦਾਰ means flexible.", "Avoid an absolute answer."],
  },
  {
    id: "pa_b2_golden_health_wait",
    level: "B2",
    skill: "structured_opinion",
    topic: "healthcare",
    prompt_gurmukhi: "ਲੰਬੀ ਉਡੀਕ ਬਾਰੇ ਮਰੀਜ਼ਾਂ ਨੂੰ ਕੀ ਜਾਣਕਾਰੀ ਮਿਲਣੀ ਚਾਹੀਦੀ ਹੈ?",
    prompt_romanization: "lambii udiik baare mariizaan nu kii jaankaari milnii chaahiidii hai?",
    prompt_vi: "Bệnh nhân nên nhận thông tin gì về thời gian chờ lâu?",
    prompt_en: "What information should patients receive about a long wait?",
    goldenAnswer_gurmukhi: "ਮਰੀਜ਼ਾਂ ਨੂੰ ਅੰਦਾਜ਼ੇ ਵਾਲਾ ਉਡੀਕ ਸਮਾਂ ਅਤੇ ਅਗਲਾ ਕਦਮ ਪਤਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ। ਜਾਣਕਾਰੀ ਸਧਾਰਨ ਭਾਸ਼ਾ ਵਿੱਚ ਹੋਵੇ ਤਾਂ ਜੋ ਚਿੰਤਾ ਘੱਟ ਹੋਵੇ। ਤੁਰੰਤ ਮਾਮਲਿਆਂ ਨੂੰ ਪਹਿਲ ਮਿਲ ਸਕਦੀ ਹੈ, ਇਹ ਵੀ ਸਪਸ਼ਟ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।",
    goldenAnswer_romanization: "mariizaan nu andaaze vaalaa udiik samaa ate aglaa kadam pataa honaa chaahiidaa hai. jaankaari sadhaaran bhaashaa vich hove taan jo chintaa ghatt hove. turant maamliaan nu pahal mil sakdii hai, ih vii spasht honaa chaahiidaa hai.",
    goldenAnswer_vi: "Bệnh nhân nên biết thời gian chờ ước tính và bước tiếp theo. Thông tin nên bằng ngôn ngữ đơn giản để giảm lo lắng. Cũng nên nói rõ ca khẩn có thể được ưu tiên.",
    goldenAnswer_en: "Patients should know the estimated wait time and next step. Information should be in plain language to reduce anxiety. It should also be clear that urgent cases may be prioritized.",
    finalQa_vi: ["No diagnosis", "Wait", "Next step"],
    finalQa_en: ["No diagnosis", "Wait", "Next step"],
    integrationReadiness_vi: "Sẵn sàng nếu answer giữ ở mức process.",
    integrationReadiness_en: "Ready if the answer stays at process level.",
    learnerTraps_vi: ["Không chẩn đoán.", "ਉਡੀਕ = wait."],
    learnerTraps_en: ["Do not diagnose.", "ਉਡੀਕ means wait."],
    canadaPracticalExample_vi: "Ví dụ Canada: walk-in clinics need clear wait notices.",
    canadaPracticalExample_en: "Canada example: walk-in clinics need clear wait notices.",
  },
  {
    id: "pa_b2_golden_health_priority",
    level: "B2",
    skill: "counterpoint",
    topic: "healthcare",
    prompt_gurmukhi: "ਪਹਿਲਾਂ ਆਉਣ ਵਾਲੇ ਨੂੰ ਪਹਿਲਾਂ ਸੇਵਾ: ਤੁਰੰਤ ਮਾਮਲਿਆਂ ਬਾਰੇ ਜਵਾਬ ਦਿਓ।",
    prompt_romanization: "pahilaan aaun vaale nu pahilaan sevaa: turant maamliaan baare javaab dio.",
    prompt_vi: "Ai đến trước phục vụ trước: phản hồi về ca khẩn.",
    prompt_en: "First come, first served: respond about urgent cases.",
    goldenAnswer_gurmukhi: "ਆਮ ਹਾਲਾਤ ਵਿੱਚ ਇਹ ਨਿਯਮ fair ਲੱਗਦਾ ਹੈ। ਪਰ ਤੁਰੰਤ ਮਾਮਲੇ ਵੱਖਰੇ ਹੁੰਦੇ ਹਨ ਕਿਉਂਕਿ ਦੇਰੀ ਨਾਲ ਨੁਕਸਾਨ ਹੋ ਸਕਦਾ ਹੈ। ਸਪਸ਼ਟ ਜਾਣਕਾਰੀ ਨਾਲ ਹੋਰ ਲੋਕ ਸਮਝ ਸਕਦੇ ਹਨ ਕਿ ਪਹਿਲ ਕਿਉਂ ਬਦਲੀ।",
    goldenAnswer_romanization: "aam haalaat vich ih niyam fair lagdaa hai. par turant maamle vakhre hunde han kiunki derii naal nuksaan ho sakdaa hai. spasht jaankaari naal hor lok samajh sakde han ki pahal kiun badlii.",
    goldenAnswer_vi: "Trong tình huống thường, quy tắc này có vẻ công bằng. Nhưng ca khẩn thì khác vì chậm trễ có thể gây hại. Thông tin rõ giúp người khác hiểu vì sao ưu tiên thay đổi.",
    goldenAnswer_en: "In ordinary situations, this rule seems fair. But urgent cases are different because delay can cause harm. Clear information helps others understand why priority changed.",
    finalQa_vi: ["Principle", "Exception", "Clear info"],
    finalQa_en: ["Principle", "Exception", "Clear info"],
    integrationReadiness_vi: "Sẵn sàng nếu không biến thành lời khuyên y tế.",
    integrationReadiness_en: "Ready if it does not become medical advice.",
    learnerTraps_vi: ["ਪਹਿਲ = priority.", "Không chẩn đoán."],
    learnerTraps_en: ["ਪਹਿਲ means priority.", "Do not diagnose."],
  },
  {
    id: "pa_b2_golden_public_digital",
    level: "B2",
    skill: "counterpoint",
    topic: "public_service",
    prompt_gurmukhi: "ਕੋਈ ਕਹਿੰਦਾ ਹੈ ਕਿ ਸਾਰੀਆਂ ਸੇਵਾਵਾਂ online ਹੋਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ। ਜਵਾਬ ਦਿਓ।",
    prompt_romanization: "koi kahindaa hai ki saariiaan sevaavaan online honiiaan chaahiidiiaan han. javaab dio.",
    prompt_vi: "Có người nói mọi dịch vụ nên online. Hãy phản hồi.",
    prompt_en: "Someone says all services should be online. Respond.",
    goldenAnswer_gurmukhi: "ਆਨਲਾਈਨ ਸੇਵਾ ਤੇਜ਼ ਅਤੇ ਸਸਤੀ ਹੋ ਸਕਦੀ ਹੈ। ਪਰ ਹਰ ਕਿਸੇ ਲਈ ਆਸਾਨ ਨਹੀਂ, ਖਾਸ ਕਰਕੇ ਬਜ਼ੁਰਗਾਂ ਜਾਂ ਨਵੇਂ ਆਏ ਲੋਕਾਂ ਲਈ। ਮੇਰੀ ਸਿਫ਼ਾਰਸ਼ ਹੈ ਕਿ online option ਰਹੇ, ਪਰ phone ਜਾਂ ਦਫ਼ਤਰ support ਵੀ ਹੋਵੇ।",
    goldenAnswer_romanization: "online sevaa tez ate sastii ho sakdii hai. par har kise lai aasaan nahi, khaas karke bazurgaan jaan nave aaye lokaan lai. merii sifaarash hai ki online option rahe, par phone jaan daftar support vii hove.",
    goldenAnswer_vi: "Dịch vụ online có thể nhanh và rẻ. Nhưng không dễ cho mọi người, nhất là người lớn tuổi hoặc người mới đến. Tôi đề xuất giữ online option nhưng cũng có hỗ trợ qua điện thoại hoặc văn phòng.",
    goldenAnswer_en: "Online service can be fast and cheap. But it is not easy for everyone, especially seniors or newcomers. I recommend keeping the online option while also offering phone or office support.",
    finalQa_vi: ["Benefit", "Access barrier", "Recommendation"],
    finalQa_en: ["Benefit", "Access barrier", "Recommendation"],
    integrationReadiness_vi: "Sẵn sàng nếu answer giữ cả benefit và access.",
    integrationReadiness_en: "Ready if the answer keeps both benefit and access.",
    learnerTraps_vi: ["ਦੋਵੇਂ = both.", "Đừng bỏ access barriers."],
    learnerTraps_en: ["ਦੋਵੇਂ means both.", "Do not skip access barriers."],
    canadaPracticalExample_vi: "Ví dụ Canada: libraries often help residents use online forms.",
    canadaPracticalExample_en: "Canada example: libraries often help residents use online forms.",
  },
];

export default punjabiGoldenSamplesB2;
