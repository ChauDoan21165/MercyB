// Punjabi CEFR B2 core lessons for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary; romanization is included as a bridge.
// Shahmukhi is mentioned only for awareness, not taught as a full script course.
// Native review is deferred.

export type PunjabiB2Category =
  | "opinion"
  | "workplace"
  | "service"
  | "healthcare"
  | "public_office"
  | "problem_solving"
  | "register";

export type PunjabiB2Sentence = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiB2Vocabulary = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
  pos: string;
};

export type PunjabiB2Mistake = {
  mistake: string;
  fix_vi: string;
  fix_en: string;
};

export type PunjabiB2ModelAnswer = {
  prompt_vi: string;
  prompt_en: string;
  answer_gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiB2Lesson = {
  id: string;
  level: "B2";
  category: PunjabiB2Category;
  title_vi: string;
  title_en: string;
  objective_vi: string;
  objective_en: string;
  keySentences: PunjabiB2Sentence[];
  vocabulary: PunjabiB2Vocabulary[];
  commonMistakes: PunjabiB2Mistake[];
  modelAnswers: PunjabiB2ModelAnswer[];
  explanation_vi: string;
  explanation_en: string;
};

export const punjabiB2CoreLessons: PunjabiB2Lesson[] = [
  {
    id: "pa_b2_opinion_balanced_stance",
    level: "B2",
    category: "opinion",
    title_vi: "Nêu quan điểm có cân bằng",
    title_en: "Giving a balanced opinion",
    objective_vi: "Nêu lập trường rõ nhưng vẫn để chỗ cho ý kiến khác.",
    objective_en: "State a clear position while leaving room for other views.",
    keySentences: [
      {
        gurmukhi: "ਮੇਰੇ ਵਿਚਾਰ ਵਿੱਚ, ਇਹ ਤਰੀਕਾ ਲੰਮੇ ਸਮੇਂ ਲਈ ਵਧੀਆ ਹੈ।",
        romanization: "mere vichaar vich, ih tariikaa lamme same lai vadhiyaa hai.",
        vi: "Theo ý tôi, cách này tốt hơn về lâu dài.",
        en: "In my view, this approach is better in the long term.",
      },
      {
        gurmukhi: "ਫਿਰ ਵੀ, ਮੈਂ ਦੂਜੇ ਪੱਖ ਦੀ ਚਿੰਤਾ ਸਮਝਦਾ ਹਾਂ।",
        romanization: "fir vii, main duuje pakkh di chintaa samajhdaa haan.",
        vi: "Tuy vậy, tôi hiểu mối lo của phía kia.",
        en: "Still, I understand the concern on the other side.",
      },
    ],
    vocabulary: [
      { gurmukhi: "ਵਿਚਾਰ", romanization: "vichaar", vi: "quan điểm", en: "opinion", pos: "n." },
      { gurmukhi: "ਪੱਖ", romanization: "pakkh", vi: "phía / mặt", en: "side / aspect", pos: "n." },
      { gurmukhi: "ਚਿੰਤਾ", romanization: "chintaa", vi: "mối lo", en: "concern", pos: "n." },
    ],
    commonMistakes: [
      {
        mistake: "ਮੈਂ ਸੋਚਦਾ ਇਹ ਠੀਕ ਹੈ।",
        fix_vi: "Sau ਸੋਚਦਾ/ਸੋਚਦੀ thường dùng ਕਿ để nối mệnh đề: ਮੈਂ ਸੋਚਦਾ ਹਾਂ ਕਿ ਇਹ ਠੀਕ ਹੈ।",
        fix_en: "After sochdaa/sochdii, use ki to link the clause: main sochdaa haan ki ih thiik hai.",
      },
    ],
    modelAnswers: [
      {
        prompt_vi: "Bạn ủng hộ làm việc hybrid nhưng thừa nhận bất lợi.",
        prompt_en: "Support hybrid work while acknowledging a drawback.",
        answer_gurmukhi: "ਮੇਰੇ ਵਿਚਾਰ ਵਿੱਚ ਹਾਈਬ੍ਰਿਡ ਕੰਮ ਲਾਭਦਾਇਕ ਹੈ, ਪਰ ਟੀਮ ਨਾਲ ਸੰਪਰਕ ਘੱਟ ਹੋ ਸਕਦਾ ਹੈ।",
        romanization: "mere vichaar vich hybrid kamm laabhdaaik hai, par team naal sampark ghatt ho sakdaa hai.",
        vi: "Theo tôi làm việc hybrid có lợi, nhưng liên lạc với đội có thể ít đi.",
        en: "In my view hybrid work is useful, but contact with the team may decrease.",
      },
    ],
    explanation_vi: "B2 cần câu có cấu trúc: lập trường + nhượng bộ + lý do. Tránh nói quá tuyệt đối như ਹਮੇਸ਼ਾ đúng hoặc ਕਦੇ ਨਹੀਂ sai.",
    explanation_en: "B2 opinions need structure: stance + concession + reason. Avoid over-absolute claims like always right or never useful.",
  },
  {
    id: "pa_b2_polite_disagreement",
    level: "B2",
    category: "opinion",
    title_vi: "Phản đối lịch sự",
    title_en: "Disagreeing politely",
    objective_vi: "Không đồng ý mà không làm đối phương mất mặt.",
    objective_en: "Disagree without making the other person lose face.",
    keySentences: [
      {
        gurmukhi: "ਮੈਂ ਤੁਹਾਡੀ ਗੱਲ ਸਮਝਦਾ ਹਾਂ, ਪਰ ਮੇਰੀ ਰਾਏ ਥੋੜ੍ਹੀ ਵੱਖਰੀ ਹੈ।",
        romanization: "main tuhaadii gall samajhdaa haan, par merii raae thorrhii vakhrii hai.",
        vi: "Tôi hiểu ý của anh/chị, nhưng ý kiến của tôi hơi khác.",
        en: "I understand your point, but my view is slightly different.",
      },
      {
        gurmukhi: "ਕੀ ਅਸੀਂ ਇਸਨੂੰ ਕਿਸੇ ਹੋਰ ਪਾਸੇ ਤੋਂ ਵੇਖ ਸਕਦੇ ਹਾਂ?",
        romanization: "kii asii isnu kise hor paase ton vekh sakde haan?",
        vi: "Ta có thể nhìn việc này từ một hướng khác không?",
        en: "Could we look at this from another angle?",
      },
    ],
    vocabulary: [
      { gurmukhi: "ਰਾਏ", romanization: "raae", vi: "ý kiến", en: "view", pos: "n." },
      { gurmukhi: "ਵੱਖਰਾ", romanization: "vakhraa", vi: "khác", en: "different", pos: "adj." },
      { gurmukhi: "ਪਾਸਾ", romanization: "paasaa", vi: "góc / phía", en: "angle / side", pos: "n." },
    ],
    commonMistakes: [
      {
        mistake: "ਤੁਸੀਂ ਗਲਤ ਹੋ।",
        fix_vi: "Câu này quá trực diện. Dùng ਮੇਰੀ ਰਾਏ ਥੋੜ੍ਹੀ ਵੱਖਰੀ ਹੈ để mềm hơn.",
        fix_en: "This is too direct. Use merii raae thorrhii vakhrii hai to soften disagreement.",
      },
    ],
    modelAnswers: [
      {
        prompt_vi: "Không đồng ý với đề xuất giá, nhưng giữ giọng hợp tác.",
        prompt_en: "Disagree with a price proposal while staying cooperative.",
        answer_gurmukhi: "ਮੈਂ ਤੁਹਾਡੀ ਗੱਲ ਸਮਝਦਾ ਹਾਂ, ਪਰ ਇਹ ਕੀਮਤ ਸਾਡੇ ਬਜਟ ਤੋਂ ਕੁਝ ਉੱਪਰ ਹੈ। ਕੀ ਅਸੀਂ ਵਿਚਕਾਰਲਾ ਰਾਹ ਲੱਭ ਸਕਦੇ ਹਾਂ?",
        romanization: "main tuhaadii gall samajhdaa haan, par ih kiimat saade budget ton kujh uppar hai. kii asii vichkaarlaa raah labh sakde haan?",
        vi: "Tôi hiểu ý anh/chị, nhưng giá này hơi vượt ngân sách của chúng tôi. Ta có thể tìm phương án ở giữa không?",
        en: "I understand your point, but this price is a little above our budget. Could we find a middle path?",
      },
    ],
    explanation_vi: "Punjabi lịch sự thường giảm độ sắc bằng ਥੋੜ੍ਹਾ/ਕੁਝ (hơi/một chút) và câu hỏi hợp tác.",
    explanation_en: "Polite Punjabi often reduces sharpness with thorrhaa/kujh and cooperative questions.",
  },
  {
    id: "pa_b2_workplace_negotiation_scope",
    level: "B2",
    category: "workplace",
    title_vi: "Thương lượng phạm vi công việc",
    title_en: "Negotiating work scope",
    objective_vi: "Thương lượng deadline, phạm vi, nguồn lực bằng giọng chuyên nghiệp.",
    objective_en: "Negotiate deadlines, scope, and resources professionally.",
    keySentences: [
      {
        gurmukhi: "ਜੇ ਤਰਜੀਹ ਰਿਪੋਰਟ ਨੂੰ ਹੈ, ਤਾਂ ਸਾਨੂੰ ਡੈਡਲਾਈਨ ਇੱਕ ਦਿਨ ਵਧਾਉਣੀ ਪਵੇਗੀ।",
        romanization: "je tarjih report nu hai, taan saanu deadline ikk din vadhaaunii pavegii.",
        vi: "Nếu ưu tiên là báo cáo, chúng ta sẽ phải gia hạn deadline thêm một ngày.",
        en: "If the report is the priority, we will need to extend the deadline by one day.",
      },
      {
        gurmukhi: "ਮੈਂ ਕੰਮ ਲੈ ਸਕਦਾ ਹਾਂ, ਪਰ ਸਾਨੂੰ ਉਮੀਦਾਂ ਸਾਫ਼ ਕਰਣੀਆਂ ਪੈਣਗੀਆਂ।",
        romanization: "main kamm lai sakdaa haan, par saanu umiidaan saaf karniiaan paingiiyaan.",
        vi: "Tôi có thể nhận việc, nhưng ta cần làm rõ kỳ vọng.",
        en: "I can take the work, but we need to clarify expectations.",
      },
    ],
    vocabulary: [
      { gurmukhi: "ਤਰਜੀਹ", romanization: "tarjih", vi: "ưu tiên", en: "priority", pos: "n." },
      { gurmukhi: "ਉਮੀਦ", romanization: "umiid", vi: "kỳ vọng", en: "expectation", pos: "n." },
      { gurmukhi: "ਵਧਾਉਣਾ", romanization: "vadhaaunaa", vi: "gia hạn / tăng", en: "to extend / increase", pos: "v." },
    ],
    commonMistakes: [
      {
        mistake: "ਮੈਂ ਨਹੀਂ ਕਰ ਸਕਦਾ।",
        fix_vi: "Trong công việc, đừng dừng ở 'tôi không thể'. Đưa điều kiện: ਜੇ X, ਤਾਂ Y.",
        fix_en: "At work, do not stop at 'I cannot'. Give a condition: je X, taan Y.",
      },
    ],
    modelAnswers: [
      {
        prompt_vi: "Bạn cần thêm thời gian nhưng không muốn nghe như đang từ chối.",
        prompt_en: "You need more time without sounding like you are refusing.",
        answer_gurmukhi: "ਮੈਂ ਇਹ ਕੰਮ ਕਰ ਸਕਦਾ ਹਾਂ, ਪਰ ਗੁਣਵੱਤਾ ਬਣਾਈ ਰੱਖਣ ਲਈ ਸਾਨੂੰ ਸ਼ੁੱਕਰਵਾਰ ਤੱਕ ਸਮਾਂ ਚਾਹੀਦਾ ਹੈ।",
        romanization: "main ih kamm kar sakdaa haan, par gunvattaa banaai rakhann lai saanu shukkarvaar takk samaa chaahiidaa hai.",
        vi: "Tôi có thể làm việc này, nhưng để giữ chất lượng, chúng ta cần thời gian đến thứ Sáu.",
        en: "I can do this work, but to maintain quality, we need until Friday.",
      },
    ],
    explanation_vi: "Khung B2 hữu ích: ਜੇ... ਤਾਂ... (nếu... thì...), ਪਰ... (nhưng...), ਲਈ... (để...).",
    explanation_en: "Useful B2 frames: je... taan... (if... then...), par... (but...), lai... (in order to).",
  },
  {
    id: "pa_b2_customer_service_complaint",
    level: "B2",
    category: "service",
    title_vi: "Khiếu nại dịch vụ lịch sự",
    title_en: "Polite customer service complaint",
    objective_vi: "Mô tả vấn đề, bằng chứng, và yêu cầu giải pháp rõ ràng.",
    objective_en: "Describe the problem, evidence, and requested solution clearly.",
    keySentences: [
      {
        gurmukhi: "ਮੈਨੂੰ ਆਰਡਰ ਮਿਲ ਗਿਆ ਹੈ, ਪਰ ਇੱਕ ਚੀਜ਼ ਗੁੰਮ ਹੈ।",
        romanization: "mainu order mil giyaa hai, par ikk chiiz gumm hai.",
        vi: "Tôi đã nhận đơn hàng, nhưng thiếu một món.",
        en: "I received the order, but one item is missing.",
      },
      {
        gurmukhi: "ਕੀ ਤੁਸੀਂ ਇਸ ਦੀ ਜਾਂਚ ਕਰਕੇ ਮੈਨੂੰ ਹੱਲ ਦੱਸ ਸਕਦੇ ਹੋ?",
        romanization: "kii tusii is di jaanch karke mainu hall dass sakde ho?",
        vi: "Anh/chị có thể kiểm tra và cho tôi biết cách giải quyết không?",
        en: "Could you check this and tell me the solution?",
      },
    ],
    vocabulary: [
      { gurmukhi: "ਜਾਂਚ", romanization: "jaanch", vi: "kiểm tra", en: "check / investigation", pos: "n." },
      { gurmukhi: "ਹੱਲ", romanization: "hall", vi: "giải pháp", en: "solution", pos: "n." },
      { gurmukhi: "ਗੁੰਮ", romanization: "gumm", vi: "bị thiếu / mất", en: "missing", pos: "adj." },
    ],
    commonMistakes: [
      {
        mistake: "ਤੁਹਾਡੀ ਸੇਵਾ ਖਰਾਬ ਹੈ।",
        fix_vi: "Chê toàn bộ dịch vụ dễ leo thang. Nói sự kiện cụ thể: ਇੱਕ ਚੀਜ਼ ਗੁੰਮ ਹੈ.",
        fix_en: "Attacking the whole service escalates. State the specific fact: ikk chiiz gumm hai.",
      },
    ],
    modelAnswers: [
      {
        prompt_vi: "Một món bị thiếu, bạn muốn đổi hoặc hoàn tiền.",
        prompt_en: "One item is missing; you want a replacement or refund.",
        answer_gurmukhi: "ਮੈਨੂੰ ਆਰਡਰ ਮਿਲ ਗਿਆ ਹੈ, ਪਰ ਇੱਕ ਚੀਜ਼ ਗੁੰਮ ਹੈ। ਕੀ ਤੁਸੀਂ ਬਦਲ ਭੇਜ ਸਕਦੇ ਹੋ ਜਾਂ ਰਿਫੰਡ ਕਰ ਸਕਦੇ ਹੋ?",
        romanization: "mainu order mil giyaa hai, par ikk chiiz gumm hai. kii tusii badal bhej sakde ho jaan refund kar sakde ho?",
        vi: "Tôi đã nhận đơn, nhưng thiếu một món. Anh/chị có thể gửi món thay thế hoặc hoàn tiền không?",
        en: "I received the order, but one item is missing. Could you send a replacement or issue a refund?",
      },
    ],
    explanation_vi: "Cấu trúc tốt: nhận việc đã xảy ra + vấn đề cụ thể + yêu cầu rõ. Tránh giọng buộc tội.",
    explanation_en: "Strong structure: acknowledge what happened + specific problem + clear request. Avoid accusatory tone.",
  },
  {
    id: "pa_b2_healthcare_explanation",
    level: "B2",
    category: "healthcare",
    title_vi: "Giải thích triệu chứng và tiền sử",
    title_en: "Explaining symptoms and history",
    objective_vi: "Mô tả triệu chứng, thời gian, mức độ và thuốc đang dùng.",
    objective_en: "Describe symptoms, timing, severity, and current medication.",
    keySentences: [
      {
        gurmukhi: "ਦਰਦ ਤਿੰਨ ਦਿਨਾਂ ਤੋਂ ਹੈ ਅਤੇ ਰਾਤ ਨੂੰ ਵੱਧ ਜਾਂਦਾ ਹੈ।",
        romanization: "dard tinn dinaan ton hai ate raat nu vadh jaandaa hai.",
        vi: "Cơn đau đã ba ngày và nặng hơn vào ban đêm.",
        en: "The pain has been there for three days and gets worse at night.",
      },
      {
        gurmukhi: "ਮੈਂ ਪਹਿਲਾਂ ਹੀ ਇਹ ਦਵਾਈ ਲੈ ਰਿਹਾ ਹਾਂ।",
        romanization: "main pahilaan hii ih davaai lai rihaa haan.",
        vi: "Tôi hiện đã đang dùng thuốc này.",
        en: "I am already taking this medicine.",
      },
    ],
    vocabulary: [
      { gurmukhi: "ਦਰਦ", romanization: "dard", vi: "đau", en: "pain", pos: "n." },
      { gurmukhi: "ਦਵਾਈ", romanization: "davaai", vi: "thuốc", en: "medicine", pos: "n." },
      { gurmukhi: "ਲੱਛਣ", romanization: "lachhan", vi: "triệu chứng", en: "symptom", pos: "n." },
    ],
    commonMistakes: [
      {
        mistake: "ਦਰਦ ਹੈ ਬਹੁਤ।",
        fix_vi: "Nên thêm thời gian và mức độ: ਦਰਦ ਤਿੰਨ ਦਿਨਾਂ ਤੋਂ ਹੈ ਅਤੇ ਕਾਫ਼ੀ ਤੇਜ਼ ਹੈ.",
        fix_en: "Add timing and severity: dard tinn dinaan ton hai ate kaafii tez hai.",
      },
    ],
    modelAnswers: [
      {
        prompt_vi: "Giải thích đau bụng cho bác sĩ.",
        prompt_en: "Explain stomach pain to a doctor.",
        answer_gurmukhi: "ਮੇਰੇ ਪੇਟ ਵਿੱਚ ਤਿੰਨ ਦਿਨਾਂ ਤੋਂ ਦਰਦ ਹੈ। ਖਾਣ ਤੋਂ ਬਾਅਦ ਦਰਦ ਵੱਧ ਜਾਂਦਾ ਹੈ, ਪਰ ਬੁਖਾਰ ਨਹੀਂ ਹੈ।",
        romanization: "mere pet vich tinn dinaan ton dard hai. khaan ton baad dard vadh jaandaa hai, par bukhaar nahin hai.",
        vi: "Tôi đau bụng ba ngày rồi. Sau khi ăn thì đau hơn, nhưng không sốt.",
        en: "I have had stomach pain for three days. It gets worse after eating, but I do not have a fever.",
      },
    ],
    explanation_vi: "Trong y tế, B2 là độ chính xác: bao lâu, khi nào nặng hơn, có/không có triệu chứng đi kèm.",
    explanation_en: "In healthcare, B2 means precision: how long, when it worsens, and which related symptoms are present or absent.",
  },
  {
    id: "pa_b2_immigration_public_office",
    level: "B2",
    category: "public_office",
    title_vi: "Ở văn phòng nhập cư / cơ quan công",
    title_en: "At immigration or a public office",
    objective_vi: "Hỏi giấy tờ, quy trình, và bước tiếp theo bằng giọng trang trọng.",
    objective_en: "Ask about documents, process, and next steps in a formal register.",
    keySentences: [
      {
        gurmukhi: "ਮੇਰੀ ਅਰਜ਼ੀ ਦੀ ਸਥਿਤੀ ਬਾਰੇ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ।",
        romanization: "merii arzii di sthiti baare jaankaarii chaahiidii hai.",
        vi: "Tôi cần thông tin về tình trạng hồ sơ của tôi.",
        en: "I need information about the status of my application.",
      },
      {
        gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ।",
        romanization: "kirpaa karke dasso ki aglaa kadam kii hai.",
        vi: "Xin vui lòng cho biết bước tiếp theo là gì.",
        en: "Please tell me what the next step is.",
      },
    ],
    vocabulary: [
      { gurmukhi: "ਅਰਜ਼ੀ", romanization: "arzii", vi: "đơn / hồ sơ", en: "application", pos: "n." },
      { gurmukhi: "ਸਥਿਤੀ", romanization: "sthiti", vi: "tình trạng", en: "status", pos: "n." },
      { gurmukhi: "ਦਸਤਾਵੇਜ਼", romanization: "dastaavez", vi: "giấy tờ", en: "document", pos: "n." },
    ],
    commonMistakes: [
      {
        mistake: "ਮੇਰਾ ਪੇਪਰ ਕਿੱਥੇ ਹੈ?",
        fix_vi: "Ở cơ quan công, ਪੇਪਰ nghe mơ hồ. Dùng ਅਰਜ਼ੀ, ਦਸਤਾਵੇਜ਼, ਸਥਿਤੀ.",
        fix_en: "In public offices, paper sounds vague. Use arzii, dastaavez, sthiti.",
      },
    ],
    modelAnswers: [
      {
        prompt_vi: "Hỏi về hồ sơ và giấy tờ còn thiếu.",
        prompt_en: "Ask about your application and missing documents.",
        answer_gurmukhi: "ਮੇਰੀ ਅਰਜ਼ੀ ਦੀ ਸਥਿਤੀ ਬਾਰੇ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ। ਜੇ ਕੋਈ ਦਸਤਾਵੇਜ਼ ਘੱਟ ਹੈ, ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਦੱਸੋ।",
        romanization: "merii arzii di sthiti baare jaankaarii chaahiidii hai. je koi dastaavez ghatt hai, kirpaa karke mainu dasso.",
        vi: "Tôi cần biết tình trạng hồ sơ. Nếu thiếu giấy tờ nào, xin vui lòng cho tôi biết.",
        en: "I need information about my application status. If any document is missing, please let me know.",
      },
    ],
    explanation_vi: "Dùng ਕਿਰਪਾ ਕਰਕੇ trong bối cảnh công quyền. Shahmukhi cũng được dùng trong cộng đồng Punjabi khác, nhưng khóa này chỉ dạy Gurmukhi.",
    explanation_en: "Use kirpaa karke in public-office settings. Shahmukhi is used in other Punjabi communities, but this course teaches Gurmukhi only.",
  },
  {
    id: "pa_b2_problem_solving_root_cause",
    level: "B2",
    category: "problem_solving",
    title_vi: "Phân tích vấn đề và nguyên nhân",
    title_en: "Analyzing a problem and root cause",
    objective_vi: "Tóm tắt tình huống, nguyên nhân, và giải pháp khả thi.",
    objective_en: "Summarize the situation, cause, and realistic solution.",
    keySentences: [
      {
        gurmukhi: "ਮੁੱਖ ਸਮੱਸਿਆ ਇਹ ਹੈ ਕਿ ਜਾਣਕਾਰੀ ਸਮੇਂ ਤੇ ਨਹੀਂ ਮਿਲੀ।",
        romanization: "mukh samassiaa ih hai ki jaankaarii same te nahin milii.",
        vi: "Vấn đề chính là thông tin không đến đúng lúc.",
        en: "The main problem is that the information did not arrive on time.",
      },
      {
        gurmukhi: "ਇਸ ਨੂੰ ਸੁਧਾਰਣ ਲਈ ਸਾਨੂੰ ਇੱਕ ਸਾਫ਼ ਪ੍ਰਕਿਰਿਆ ਚਾਹੀਦੀ ਹੈ।",
        romanization: "is nu sudhaaran lai saanu ikk saaf prakiriaa chaahiidii hai.",
        vi: "Để cải thiện việc này, chúng ta cần một quy trình rõ ràng.",
        en: "To improve this, we need a clear process.",
      },
    ],
    vocabulary: [
      { gurmukhi: "ਸਮੱਸਿਆ", romanization: "samassiaa", vi: "vấn đề", en: "problem", pos: "n." },
      { gurmukhi: "ਕਾਰਨ", romanization: "kaaran", vi: "nguyên nhân", en: "cause", pos: "n." },
      { gurmukhi: "ਪ੍ਰਕਿਰਿਆ", romanization: "prakiriaa", vi: "quy trình", en: "process", pos: "n." },
    ],
    commonMistakes: [
      {
        mistake: "ਸਭ ਕੁਝ ਖਰਾਬ ਹੈ।",
        fix_vi: "B2 cần cụ thể hóa: ਮੁੱਖ ਸਮੱਸਿਆ ਇਹ ਹੈ ਕਿ... rồi đề xuất ਹੱਲ.",
        fix_en: "B2 requires specificity: mukh samassiaa ih hai ki... then propose a hall.",
      },
    ],
    modelAnswers: [
      {
        prompt_vi: "Tóm tắt lỗi giao hàng và đề xuất quy trình.",
        prompt_en: "Summarize a delivery issue and propose a process.",
        answer_gurmukhi: "ਮੁੱਖ ਸਮੱਸਿਆ ਇਹ ਹੈ ਕਿ ਪੁਸ਼ਟੀ ਸਮੇਂ ਤੇ ਨਹੀਂ ਭੇਜੀ ਗਈ। ਇਸ ਲਈ ਸਾਨੂੰ ਹਰ ਆਰਡਰ ਲਈ ਚੈਕਲਿਸਟ ਬਣਾਉਣੀ ਚਾਹੀਦੀ ਹੈ।",
        romanization: "mukh samassiaa ih hai ki pushtii same te nahin bhejii gaii. is lai saanu har order lai checklist banaaunii chaahiidii hai.",
        vi: "Vấn đề chính là xác nhận không được gửi đúng lúc. Vì vậy, ta nên tạo checklist cho mỗi đơn hàng.",
        en: "The main problem is that confirmation was not sent on time. Therefore, we should create a checklist for every order.",
      },
    ],
    explanation_vi: "Khung problem solving: ਮੁੱਖ ਸਮੱਸਿਆ... / ਕਾਰਨ... / ਇਸ ਲਈ... / ਸਾਨੂੰ ਚਾਹੀਦਾ ਹੈ...",
    explanation_en: "Problem-solving frame: mukh samassiaa... / kaaran... / is lai... / saanu chaahiidaa hai...",
  },
  {
    id: "pa_b2_formal_casual_register",
    level: "B2",
    category: "register",
    title_vi: "Phân biệt trang trọng và thân mật",
    title_en: "Formal versus casual register",
    objective_vi: "Chọn đại từ, động từ, và câu yêu cầu phù hợp quan hệ.",
    objective_en: "Choose pronouns, verb forms, and requests appropriate to the relationship.",
    keySentences: [
      {
        gurmukhi: "ਤੁਸੀਂ ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਫਾਰਮ ਭਰ ਸਕਦੇ ਹੋ?",
        romanization: "tusii kirpaa karke ih form bhar sakde ho?",
        vi: "Anh/chị vui lòng điền mẫu này được không?",
        en: "Could you please fill out this form?",
      },
      {
        gurmukhi: "ਤੂੰ ਇਹ ਫਾਰਮ ਭਰ ਦੇਵੇਂਗਾ?",
        romanization: "tuun ih form bhar deveingaa?",
        vi: "Bạn điền mẫu này giúp được không? (thân mật)",
        en: "Can you fill out this form? (casual)",
      },
    ],
    vocabulary: [
      { gurmukhi: "ਤੁਸੀਂ", romanization: "tusii", vi: "anh/chị/bạn trang trọng", en: "formal/respectful you", pos: "pron." },
      { gurmukhi: "ਤੂੰ", romanization: "tuun", vi: "mày/cậu/bạn thân", en: "intimate you", pos: "pron." },
      { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ", romanization: "kirpaa karke", vi: "xin vui lòng", en: "please", pos: "phrase" },
    ],
    commonMistakes: [
      {
        mistake: "Dùng ਤੂੰ với người lạ hoặc cấp trên.",
        fix_vi: "ਤੂੰ chỉ dùng với người rất thân, trẻ nhỏ, hoặc khi có quan hệ gần. Người lạ/công sở dùng ਤੁਸੀਂ.",
        fix_en: "tuun is for very close people, children, or intimate relationships. Use tusii with strangers and at work.",
      },
    ],
    modelAnswers: [
      {
        prompt_vi: "Yêu cầu đồng nghiệp cấp trên gửi tài liệu.",
        prompt_en: "Ask a senior colleague to send a document.",
        answer_gurmukhi: "ਕੀ ਤੁਸੀਂ ਕਿਰਪਾ ਕਰਕੇ ਦਸਤਾਵੇਜ਼ ਅੱਜ ਸ਼ਾਮ ਤੱਕ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization: "kii tusii kirpaa karke dastaavez ajj shaam takk bhej sakde ho?",
        vi: "Anh/chị vui lòng gửi tài liệu trước tối nay được không?",
        en: "Could you please send the document by this evening?",
      },
    ],
    explanation_vi: "Tiếng Việt cũng có hệ thống xưng hô, nên lợi thế là hiểu register. Điểm khác: Punjabi có cặp ਤੁਸੀਂ/ਤੂੰ rất rõ.",
    explanation_en: "Vietnamese speakers already understand register through pronouns. Punjabi marks it strongly with tusii versus tuun.",
  },
  {
    id: "pa_b2_workplace_feedback",
    level: "B2",
    category: "workplace",
    title_vi: "Góp ý trong công việc",
    title_en: "Giving workplace feedback",
    objective_vi: "Nói lỗi và cách sửa mà không làm người nghe phòng thủ.",
    objective_en: "Name an issue and fix without making the listener defensive.",
    keySentences: [
      {
        gurmukhi: "ਰਿਪੋਰਟ ਵਿੱਚ ਜਾਣਕਾਰੀ ਚੰਗੀ ਹੈ, ਪਰ ਢਾਂਚਾ ਹੋਰ ਸਾਫ਼ ਹੋ ਸਕਦਾ ਹੈ।",
        romanization: "report vich jaankaarii changii hai, par dhaanchaa hor saaf ho sakdaa hai.",
        vi: "Thông tin trong báo cáo tốt, nhưng cấu trúc có thể rõ hơn.",
        en: "The information in the report is good, but the structure could be clearer.",
      },
      {
        gurmukhi: "ਜੇ ਅਸੀਂ ਉਦਾਹਰਨ ਜੋੜੀਏ, ਤਾਂ ਦਲੀਲ ਮਜ਼ਬੂਤ ਹੋਵੇਗੀ।",
        romanization: "je asii udaaharan jorrie, taan daliil mazbuut hovegii.",
        vi: "Nếu ta thêm ví dụ, lập luận sẽ mạnh hơn.",
        en: "If we add an example, the argument will be stronger.",
      },
    ],
    vocabulary: [
      { gurmukhi: "ਢਾਂਚਾ", romanization: "dhaanchaa", vi: "cấu trúc", en: "structure", pos: "n." },
      { gurmukhi: "ਦਲੀਲ", romanization: "daliil", vi: "lập luận", en: "argument", pos: "n." },
      { gurmukhi: "ਮਜ਼ਬੂਤ", romanization: "mazbuut", vi: "mạnh", en: "strong", pos: "adj." },
    ],
    commonMistakes: [
      {
        mistake: "ਇਹ ਰਿਪੋਰਟ ਖਰਾਬ ਹੈ।",
        fix_vi: "Góp ý B2 nên có điểm tốt + điểm sửa + lợi ích: ਜਾਣਕਾਰੀ ਚੰਗੀ ਹੈ, ਪਰ ਢਾਂਚਾ...",
        fix_en: "B2 feedback should include strength + fix + benefit: jaankaarii changii hai, par dhaanchaa...",
      },
    ],
    modelAnswers: [
      {
        prompt_vi: "Góp ý slide thuyết trình thiếu ví dụ.",
        prompt_en: "Give feedback that presentation slides lack examples.",
        answer_gurmukhi: "ਸਲਾਈਡਾਂ ਸਾਫ਼ ਹਨ, ਪਰ ਜੇ ਅਸੀਂ ਦੋ ਉਦਾਹਰਨਾਂ ਜੋੜੀਏ, ਤਾਂ ਸੁਨੇਹਾ ਹੋਰ ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਹੋਵੇਗਾ।",
        romanization: "slide-aan saaf han, par je asii do udaaharanaan jorrie, taan sunehaa hor prabhaavshaalii hovegaa.",
        vi: "Các slide rõ, nhưng nếu ta thêm hai ví dụ, thông điệp sẽ thuyết phục hơn.",
        en: "The slides are clear, but if we add two examples, the message will be more effective.",
      },
    ],
    explanation_vi: "Công thức feedback: điểm mạnh + ਪਰ + đề xuất cụ thể + kết quả tốt hơn.",
    explanation_en: "Feedback formula: strength + par + concrete suggestion + better outcome.",
  },
  {
    id: "pa_b2_service_deescalation",
    level: "B2",
    category: "service",
    title_vi: "Xử lý khách hàng bức xúc",
    title_en: "De-escalating an upset customer",
    objective_vi: "Thừa nhận cảm xúc, xin lỗi về trải nghiệm, và đưa bước tiếp theo.",
    objective_en: "Acknowledge emotion, apologize for the experience, and give the next step.",
    keySentences: [
      {
        gurmukhi: "ਮੈਨੂੰ ਅਫ਼ਸੋਸ ਹੈ ਕਿ ਤੁਹਾਨੂੰ ਇਹ ਤਜਰਬਾ ਹੋਇਆ।",
        romanization: "mainu afsos hai ki tuhaanu ih tajurbaa hoiaa.",
        vi: "Tôi rất tiếc vì anh/chị đã có trải nghiệm này.",
        en: "I am sorry that you had this experience.",
      },
      {
        gurmukhi: "ਮੈਂ ਹੁਣੇ ਜਾਂਚ ਕਰਦਾ ਹਾਂ ਅਤੇ ਤੁਹਾਨੂੰ ਅਪਡੇਟ ਦਿੰਦਾ ਹਾਂ।",
        romanization: "main hune jaanch kardaa haan ate tuhaanu update dindaa haan.",
        vi: "Tôi sẽ kiểm tra ngay và cập nhật cho anh/chị.",
        en: "I will check right now and give you an update.",
      },
    ],
    vocabulary: [
      { gurmukhi: "ਅਫ਼ਸੋਸ", romanization: "afsos", vi: "tiếc / lấy làm tiếc", en: "regret / sorry", pos: "n." },
      { gurmukhi: "ਤਜਰਬਾ", romanization: "tajurbaa", vi: "trải nghiệm", en: "experience", pos: "n." },
      { gurmukhi: "ਅਪਡੇਟ", romanization: "update", vi: "cập nhật", en: "update", pos: "n." },
    ],
    commonMistakes: [
      {
        mistake: "ਇਹ ਮੇਰੀ ਗਲਤੀ ਨਹੀਂ ਹੈ।",
        fix_vi: "Dù lỗi không phải của bạn, câu này làm căng thẳng. Nói về trải nghiệm: ਮੈਨੂੰ ਅਫ਼ਸੋਸ ਹੈ ਕਿ...",
        fix_en: "Even if it is not your fault, this escalates. Speak about the experience: mainu afsos hai ki...",
      },
    ],
    modelAnswers: [
      {
        prompt_vi: "Khách hàng phàn nàn vì chờ lâu.",
        prompt_en: "A customer complains about a long wait.",
        answer_gurmukhi: "ਮੈਨੂੰ ਅਫ਼ਸੋਸ ਹੈ ਕਿ ਤੁਹਾਨੂੰ ਲੰਮਾ ਇੰਤਜ਼ਾਰ ਕਰਨਾ ਪਿਆ। ਮੈਂ ਹੁਣੇ ਸਥਿਤੀ ਜਾਂਚ ਕਰਦਾ ਹਾਂ ਅਤੇ ਪੰਜ ਮਿੰਟ ਵਿੱਚ ਅਪਡੇਟ ਦਿੰਦਾ ਹਾਂ।",
        romanization: "mainu afsos hai ki tuhaanu lammaa intazaar karnaa piaa. main hune sthiti jaanch kardaa haan ate panj mint vich update dindaa haan.",
        vi: "Tôi rất tiếc vì anh/chị phải chờ lâu. Tôi sẽ kiểm tra ngay và cập nhật trong năm phút.",
        en: "I am sorry you had to wait a long time. I will check the status now and update you in five minutes.",
      },
    ],
    explanation_vi: "Trong dịch vụ, xin lỗi về trải nghiệm không nhất thiết nhận lỗi pháp lý; nó làm dịu cuộc nói chuyện.",
    explanation_en: "In service, apologizing for the experience does not necessarily admit legal fault; it calms the interaction.",
  },
  {
    id: "pa_b2_healthcare_instructions",
    level: "B2",
    category: "healthcare",
    title_vi: "Hiểu hướng dẫn chăm sóc sức khỏe",
    title_en: "Understanding healthcare instructions",
    objective_vi: "Xác nhận liều, thời gian, tác dụng phụ, và khi nào cần quay lại.",
    objective_en: "Confirm dose, timing, side effects, and when to return.",
    keySentences: [
      {
        gurmukhi: "ਇਹ ਦਵਾਈ ਦਿਨ ਵਿੱਚ ਕਿੰਨੀ ਵਾਰ ਲੈਣੀ ਹੈ?",
        romanization: "ih davaai din vich kinnii vaar lainii hai?",
        vi: "Thuốc này phải uống mấy lần một ngày?",
        en: "How many times a day should I take this medicine?",
      },
      {
        gurmukhi: "ਜੇ ਸਾਈਡ ਇਫੈਕਟ ਹੋਣ, ਤਾਂ ਮੈਨੂੰ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
        romanization: "je side effect hon, taan mainu kii karnaa chaahiidaa hai?",
        vi: "Nếu có tác dụng phụ, tôi nên làm gì?",
        en: "If there are side effects, what should I do?",
      },
    ],
    vocabulary: [
      { gurmukhi: "ਵਾਰ", romanization: "vaar", vi: "lần", en: "time / occurrence", pos: "n." },
      { gurmukhi: "ਸਾਈਡ ਇਫੈਕਟ", romanization: "side effect", vi: "tác dụng phụ", en: "side effect", pos: "n." },
      { gurmukhi: "ਮੁਲਾਕਾਤ", romanization: "mulaakaat", vi: "cuộc hẹn / lần gặp", en: "appointment / visit", pos: "n." },
    ],
    commonMistakes: [
      {
        mistake: "Chỉ gật đầu khi chưa hiểu liều thuốc.",
        fix_vi: "Hãy xác nhận bằng câu hỏi cụ thể: ਦਿਨ ਵਿੱਚ ਕਿੰਨੀ ਵਾਰ? ਖਾਣ ਤੋਂ ਪਹਿਲਾਂ ਜਾਂ ਬਾਅਦ?",
        fix_en: "Confirm with specific questions: din vich kinnii vaar? khaan ton pahilaan jaan baad?",
      },
    ],
    modelAnswers: [
      {
        prompt_vi: "Xác nhận cách dùng thuốc.",
        prompt_en: "Confirm how to take medicine.",
        answer_gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਪੁਸ਼ਟੀ ਕਰੋ: ਇਹ ਦਵਾਈ ਦਿਨ ਵਿੱਚ ਦੋ ਵਾਰ ਖਾਣ ਤੋਂ ਬਾਅਦ ਲੈਣੀ ਹੈ, ਠੀਕ ਹੈ?",
        romanization: "kirpaa karke pushtii karo: ih davaai din vich do vaar khaan ton baad lainii hai, thiik hai?",
        vi: "Xin xác nhận: thuốc này uống hai lần một ngày sau bữa ăn, đúng không?",
        en: "Please confirm: this medicine should be taken twice a day after meals, correct?",
      },
    ],
    explanation_vi: "Trong y tế, hỏi lại là hành vi an toàn, không phải bất lịch sự. Dùng ਕਿਰਪਾ ਕਰਕੇ ਪੁਸ਼ਟੀ ਕਰੋ.",
    explanation_en: "In healthcare, asking again is a safety behavior, not impolite. Use kirpaa karke pushtii karo.",
  },
  {
    id: "pa_b2_public_office_clarification",
    level: "B2",
    category: "public_office",
    title_vi: "Làm rõ yêu cầu ở cơ quan công",
    title_en: "Clarifying requirements at a public office",
    objective_vi: "Hỏi điều kiện, hạn chót, bản gốc/bản sao, và xác nhận.",
    objective_en: "Ask about requirements, deadlines, originals/copies, and confirmation.",
    keySentences: [
      {
        gurmukhi: "ਕੀ ਮੈਨੂੰ ਅਸਲ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ ਜਾਂ ਕਾਪੀਆਂ ਕਾਫ਼ੀ ਹਨ?",
        romanization: "kii mainu asal dastaavez chaahiide han jaan copies kaafii han?",
        vi: "Tôi cần giấy tờ gốc hay bản sao là đủ?",
        en: "Do I need original documents, or are copies enough?",
      },
      {
        gurmukhi: "ਕੀ ਤੁਸੀਂ ਇਹ ਲੋੜਾਂ ਲਿਖ ਕੇ ਦੇ ਸਕਦੇ ਹੋ?",
        romanization: "kii tusii ih lorraan likh ke de sakde ho?",
        vi: "Anh/chị có thể viết các yêu cầu này cho tôi không?",
        en: "Could you write these requirements down for me?",
      },
    ],
    vocabulary: [
      { gurmukhi: "ਅਸਲ", romanization: "asal", vi: "bản gốc", en: "original", pos: "adj./n." },
      { gurmukhi: "ਕਾਪੀ", romanization: "copy", vi: "bản sao", en: "copy", pos: "n." },
      { gurmukhi: "ਲੋੜ", romanization: "lorr", vi: "yêu cầu / nhu cầu", en: "requirement / need", pos: "n." },
    ],
    commonMistakes: [
      {
        mistake: "ਕਾਪੀ ਠੀਕ?",
        fix_vi: "Câu quá ngắn ở cơ quan công. Dùng câu đầy đủ với ਕੀ... ਜਾਂ...?",
        fix_en: "Too clipped for a public office. Use a full kii... jaan...? question.",
      },
    ],
    modelAnswers: [
      {
        prompt_vi: "Hỏi hạn chót nộp giấy tờ.",
        prompt_en: "Ask the deadline for submitting documents.",
        answer_gurmukhi: "ਇਹ ਦਸਤਾਵੇਜ਼ ਜਮ੍ਹਾਂ ਕਰਨ ਦੀ ਆਖਰੀ ਤਾਰੀਖ ਕੀ ਹੈ? ਕੀ ਮੈਨੂੰ ਕੋਈ ਰਸੀਦ ਮਿਲੇਗੀ?",
        romanization: "ih dastaavez jamhaa karan di aakhri taarikh kii hai? kii mainu koi rasiid milegii?",
        vi: "Hạn cuối nộp các giấy tờ này là ngày nào? Tôi có nhận biên nhận không?",
        en: "What is the deadline for submitting these documents? Will I receive a receipt?",
      },
    ],
    explanation_vi: "Cơ quan công cần câu hỏi cụ thể: bản gốc/bản sao, hạn chót, biên nhận, bước tiếp theo.",
    explanation_en: "Public offices require specific questions: original/copy, deadline, receipt, next step.",
  },
  {
    id: "pa_b2_register_email_request",
    level: "B2",
    category: "register",
    title_vi: "Email yêu cầu trang trọng",
    title_en: "Formal request email",
    objective_vi: "Viết yêu cầu ngắn, lịch sự, có deadline và lời cảm ơn.",
    objective_en: "Write a short polite request with a deadline and thanks.",
    keySentences: [
      {
        gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਕਿਰਪਾ ਕਰਕੇ ਜੁੜਿਆ ਹੋਇਆ ਦਸਤਾਵੇਜ਼ ਵੇਖੋ।",
        romanization: "sat sri akaal, kirpaa karke jurriyaa hoiaa dastaavez vekho.",
        vi: "Xin chào, vui lòng xem tài liệu đính kèm.",
        en: "Hello, please see the attached document.",
      },
      {
        gurmukhi: "ਜੇ ਸੰਭਵ ਹੋਵੇ, ਕਿਰਪਾ ਕਰਕੇ ਸ਼ੁੱਕਰਵਾਰ ਤੱਕ ਆਪਣੀ ਰਾਏ ਭੇਜੋ।",
        romanization: "je sambhav hove, kirpaa karke shukkarvaar takk aapnii raae bhejo.",
        vi: "Nếu có thể, xin vui lòng gửi ý kiến trước thứ Sáu.",
        en: "If possible, please send your feedback by Friday.",
      },
    ],
    vocabulary: [
      { gurmukhi: "ਜੁੜਿਆ ਹੋਇਆ", romanization: "jurriyaa hoiaa", vi: "đính kèm", en: "attached", pos: "adj." },
      { gurmukhi: "ਸੰਭਵ", romanization: "sambhav", vi: "có thể", en: "possible", pos: "adj." },
      { gurmukhi: "ਧੰਨਵਾਦ", romanization: "dhannvaad", vi: "cảm ơn", en: "thank you", pos: "n./phrase" },
    ],
    commonMistakes: [
      {
        mistake: "ਭੇਜੋ ਹੁਣੇ।",
        fix_vi: "Mệnh lệnh trần nghe gắt. Dùng ਜੇ ਸੰਭਵ ਹੋਵੇ + ਕਿਰਪਾ ਕਰਕੇ + deadline.",
        fix_en: "A bare command sounds harsh. Use je sambhav hove + kirpaa karke + deadline.",
      },
    ],
    modelAnswers: [
      {
        prompt_vi: "Viết yêu cầu góp ý tài liệu.",
        prompt_en: "Write a request for feedback on a document.",
        answer_gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਕਿਰਪਾ ਕਰਕੇ ਜੁੜਿਆ ਹੋਇਆ ਦਸਤਾਵੇਜ਼ ਵੇਖੋ। ਜੇ ਸੰਭਵ ਹੋਵੇ, ਸ਼ੁੱਕਰਵਾਰ ਤੱਕ ਆਪਣੀ ਰਾਏ ਭੇਜੋ। ਧੰਨਵਾਦ।",
        romanization: "sat sri akaal, kirpaa karke jurriyaa hoiaa dastaavez vekho. je sambhav hove, shukkarvaar takk aapnii raae bhejo. dhannvaad.",
        vi: "Xin chào, vui lòng xem tài liệu đính kèm. Nếu có thể, gửi ý kiến trước thứ Sáu. Cảm ơn.",
        en: "Hello, please see the attached document. If possible, send your feedback by Friday. Thank you.",
      },
    ],
    explanation_vi: "Email B2 không cần dài. Cần rõ người nhận phải làm gì, đến khi nào, và giọng lịch sự.",
    explanation_en: "A B2 email need not be long. It must clearly say what the recipient should do, by when, and in a polite tone.",
  },
  {
    id: "pa_b2_synthesis_meeting_summary",
    level: "B2",
    category: "problem_solving",
    title_vi: "Tóm tắt cuộc họp và bước tiếp theo",
    title_en: "Summarizing a meeting and next steps",
    objective_vi: "Tổng hợp quyết định, người phụ trách, hạn chót, và rủi ro.",
    objective_en: "Synthesize decisions, owners, deadlines, and risks.",
    keySentences: [
      {
        gurmukhi: "ਅੱਜ ਦੀ ਮੀਟਿੰਗ ਵਿੱਚ ਅਸੀਂ ਤਿੰਨ ਫੈਸਲੇ ਕੀਤੇ।",
        romanization: "ajj di meeting vich asii tinn faisle kiite.",
        vi: "Trong cuộc họp hôm nay, chúng ta đã đưa ra ba quyết định.",
        en: "In today's meeting, we made three decisions.",
      },
      {
        gurmukhi: "ਸਭ ਤੋਂ ਵੱਡਾ ਖਤਰਾ ਸਮਾਂ ਹੈ, ਇਸ ਲਈ ਅਸੀਂ ਹਫ਼ਤੇ ਵਿੱਚ ਦੋ ਵਾਰ ਪ੍ਰਗਤੀ ਵੇਖਾਂਗੇ।",
        romanization: "sabh ton vaddaa khatraa samaa hai, is lai asii hafte vich do vaar pragti vekhaange.",
        vi: "Rủi ro lớn nhất là thời gian, vì vậy ta sẽ kiểm tra tiến độ hai lần một tuần.",
        en: "The biggest risk is time, so we will review progress twice a week.",
      },
    ],
    vocabulary: [
      { gurmukhi: "ਫੈਸਲਾ", romanization: "faislaa", vi: "quyết định", en: "decision", pos: "n." },
      { gurmukhi: "ਖਤਰਾ", romanization: "khatraa", vi: "rủi ro", en: "risk", pos: "n." },
      { gurmukhi: "ਪ੍ਰਗਤੀ", romanization: "pragti", vi: "tiến độ", en: "progress", pos: "n." },
    ],
    commonMistakes: [
      {
        mistake: "ਮੀਟਿੰਗ ਹੋ ਗਈ। ਸਭ ਠੀਕ।",
        fix_vi: "Tóm tắt B2 cần decision + owner + deadline + risk, không chỉ nói chung chung.",
        fix_en: "A B2 summary needs decision + owner + deadline + risk, not a vague statement.",
      },
    ],
    modelAnswers: [
      {
        prompt_vi: "Tóm tắt sau cuộc họp dự án.",
        prompt_en: "Summarize after a project meeting.",
        answer_gurmukhi: "ਅੱਜ ਦੀ ਮੀਟਿੰਗ ਵਿੱਚ ਅਸੀਂ ਡਿਜ਼ਾਈਨ ਮਨਜ਼ੂਰ ਕੀਤਾ। ਅਮਨ ਸ਼ੁੱਕਰਵਾਰ ਤੱਕ ਡਰਾਫਟ ਭੇਜੇਗਾ, ਅਤੇ ਅਸੀਂ ਸੋਮਵਾਰ ਨੂੰ ਪ੍ਰਗਤੀ ਵੇਖਾਂਗੇ।",
        romanization: "ajj di meeting vich asii design manzuur kiitaa. Aman shukkarvaar takk draft bhejegaa, ate asii somvaar nu pragti vekhaange.",
        vi: "Trong cuộc họp hôm nay, chúng ta đã duyệt thiết kế. Aman sẽ gửi bản nháp trước thứ Sáu, và ta sẽ kiểm tra tiến độ vào thứ Hai.",
        en: "In today's meeting, we approved the design. Aman will send the draft by Friday, and we will review progress on Monday.",
      },
    ],
    explanation_vi: "Tổng hợp B2 là biến cuộc nói chuyện thành hành động: ai làm gì, khi nào, rủi ro nào cần theo dõi.",
    explanation_en: "B2 synthesis turns discussion into action: who does what, by when, and which risk needs monitoring.",
  },
];

export default punjabiB2CoreLessons;
