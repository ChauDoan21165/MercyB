// Punjabi C2 audience adaptation pack for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support audience adaptation practice, not certification,
// official placement, legal/HR/medical/safety advice, or native-reviewed authority.
// Native review is deferred. Shahmukhi is mentioned only for script awareness,
// not as a full course.

export type PunjabiC2Audience =
  | "elder"
  | "peer"
  | "supervisor"
  | "public_service_worker"
  | "community_audience"
  | "formal_meeting"
  | "tense_conversation"
  | "sensitive_topic_discussion";

export type PunjabiC2AudienceMode = "navigation" | "review" | "remediation" | "readiness";

export type PunjabiC2AudiencePhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2AudienceRegisterShift = {
  too_direct_vi: string;
  too_direct_en: string;
  adapted_gurmukhi: string;
  adapted_romanization: string;
  adapted_vi: string;
  adapted_en: string;
};

export type PunjabiC2AudienceCheckpoint = {
  checkpoint_vi: string;
  checkpoint_en: string;
  ready_signal_vi: string;
  ready_signal_en: string;
};

export type PunjabiC2AudienceTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2AudienceRoute = {
  if_missing_vi: string;
  if_missing_en: string;
  remediation_vi: string;
  remediation_en: string;
};

export type PunjabiC2AudienceAdaptation = {
  id: string;
  audience: PunjabiC2Audience;
  mode: PunjabiC2AudienceMode;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  adaptation_goal_vi: string;
  adaptation_goal_en: string;
  key_phrases: PunjabiC2AudiencePhrase[];
  register_shift: PunjabiC2AudienceRegisterShift;
  checkpoints: PunjabiC2AudienceCheckpoint[];
  route: PunjabiC2AudienceRoute;
  learner_trap?: PunjabiC2AudienceTrap;
  canada_practical?: boolean;
};

export const C2_AUDIENCE_ADAPTATION_DISCLAIMER = {
  vi: "Gói điều chỉnh theo người nghe Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi audience adaptation pack supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const audienceAdaptationC2: PunjabiC2AudienceAdaptation[] = [
  {
    id: "pa_c2_audience_elder",
    audience: "elder",
    mode: "review",
    title_vi: "Điều chỉnh khi nói với người lớn tuổi",
    title_en: "Adapt tone for an elder",
    scenario_vi: "Bạn cần nêu ý khác trong cuộc nói chuyện gia đình hoặc cộng đồng.",
    scenario_en: "You need to offer a different view in a family or community conversation.",
    adaptation_goal_vi: "Giữ sự kính trọng, không biến kính trọng thành im lặng tuyệt đối.",
    adaptation_goal_en: "Keep respect without turning respect into total silence.",
    key_phrases: [
      {
        gurmukhi: "ਤੁਹਾਡੀ ਗੱਲ ਦੀ ਕਦਰ ਹੈ",
        romanization: "tuhadi gall di kadar hai",
        vi: "Tôi trân trọng ý của bác/anh/chị.",
        en: "I value your point.",
      },
      {
        gurmukhi: "ਮੇਰਾ ਇੱਕ ਛੋਟਾ ਜਿਹਾ ਨਜ਼ਰੀਆ ਹੈ",
        romanization: "mera ikk chhota jiha nazaria hai",
        vi: "Tôi có một góc nhìn nhỏ.",
        en: "I have one small perspective.",
      },
    ],
    register_shift: {
      too_direct_vi: "Ý này không đúng.",
      too_direct_en: "This point is not correct.",
      adapted_gurmukhi:
        "ਤੁਹਾਡੀ ਗੱਲ ਦੀ ਕਦਰ ਹੈ। ਮੇਰਾ ਇੱਕ ਛੋਟਾ ਜਿਹਾ ਨਜ਼ਰੀਆ ਹੈ ਕਿ ਅਸੀਂ ਇਹ ਪੱਖ ਵੀ ਵੇਖ ਸਕਦੇ ਹਾਂ।",
      adapted_romanization:
        "tuhadi gall di kadar hai. mera ikk chhota jiha nazaria hai ki asin ih pakh vi vekh sakde haan.",
      adapted_vi:
        "Tôi trân trọng ý của bác/anh/chị. Tôi có một góc nhìn nhỏ là chúng ta cũng có thể xem mặt này.",
      adapted_en:
        "I value your point. I have one small perspective: we could also look at this side.",
    },
    checkpoints: [
      {
        checkpoint_vi: "Có công nhận trước khi thêm góc nhìn không?",
        checkpoint_en: "Does it validate before adding a view?",
        ready_signal_vi: "Có ਕਦਰ và ਨਜ਼ਰੀਆ.",
        ready_signal_en: "Includes ਕਦਰ and ਨਜ਼ਰੀਆ.",
      },
    ],
    route: {
      if_missing_vi: "Nếu câu nghe như sửa lưng người lớn tuổi.",
      if_missing_en: "If the sentence sounds like correcting an elder.",
      remediation_vi: "Ôn lại công nhận, hạ giọng trực diện, rồi thêm góc nhìn.",
      remediation_en: "Review validation, lower directness, then add perspective.",
    },
    learner_trap: {
      trap_vi: "Nghĩ kính trọng nghĩa là không được nêu ý khác.",
      trap_en: "Assuming respect means never offering a different view.",
      repair_vi: "Dùng công nhận + 'một góc nhìn nhỏ'.",
      repair_en: "Use validation plus 'one small perspective'.",
    },
  },
  {
    id: "pa_c2_audience_peer",
    audience: "peer",
    mode: "navigation",
    title_vi: "Điều chỉnh khi nói với bạn ngang hàng",
    title_en: "Adapt tone for a peer",
    scenario_vi: "Bạn cần góp ý với bạn cùng nhóm mà vẫn giữ quan hệ hợp tác.",
    scenario_en: "You need to give feedback to a teammate while keeping collaboration.",
    adaptation_goal_vi: "Thân thiện nhưng vẫn rõ ràng về bước cần sửa.",
    adaptation_goal_en: "Friendly but clear about the step that needs revision.",
    key_phrases: [
      {
        gurmukhi: "ਮੈਨੂੰ ਲੱਗਦਾ ਹੈ ਇਹ ਹਿੱਸਾ ਚੰਗਾ ਹੈ",
        romanization: "mainu laggda hai ih hissa changa hai",
        vi: "Tôi thấy phần này tốt.",
        en: "I think this part is good.",
      },
      {
        gurmukhi: "ਇਸ ਹਿੱਸੇ ਨੂੰ ਹੋਰ ਸਪਸ਼ਟ ਕਰੀਏ",
        romanization: "is hisse nu hor spasht karie",
        vi: "Ta làm phần này rõ hơn nhé.",
        en: "Let's make this part clearer.",
      },
    ],
    register_shift: {
      too_direct_vi: "Sửa phần này đi.",
      too_direct_en: "Fix this part.",
      adapted_gurmukhi:
        "ਮੈਨੂੰ ਲੱਗਦਾ ਹੈ ਇਹ ਹਿੱਸਾ ਚੰਗਾ ਹੈ। ਇਸ ਹਿੱਸੇ ਨੂੰ ਹੋਰ ਸਪਸ਼ਟ ਕਰੀਏ ਤਾਂ ਕੰਮ ਮਜ਼ਬੂਤ ਹੋਵੇਗਾ।",
      adapted_romanization:
        "mainu laggda hai ih hissa changa hai. is hisse nu hor spasht karie taan kamm mazbut hovega.",
      adapted_vi:
        "Tôi thấy phần này tốt. Nếu ta làm phần này rõ hơn thì bài sẽ mạnh hơn.",
      adapted_en:
        "I think this part is good. If we make this part clearer, the work will be stronger.",
    },
    checkpoints: [
      {
        checkpoint_vi: "Có giữ giọng cùng làm không?",
        checkpoint_en: "Does it keep a collaborative tone?",
        ready_signal_vi: "Có ਕਰੀਏ hoặc ta/chúng ta.",
        ready_signal_en: "Includes ਕਰੀਏ or 'let's/we'.",
      },
    ],
    route: {
      if_missing_vi: "Nếu câu nghe như mệnh lệnh.",
      if_missing_en: "If the sentence sounds like an order.",
      remediation_vi: "Chuyển sang cấu trúc cùng làm: 'let's make it clearer'.",
      remediation_en: "Shift to a collaborative 'let's make it clearer' structure.",
    },
    learner_trap: {
      trap_vi: "Dùng mệnh lệnh quá ngắn với bạn ngang hàng.",
      trap_en: "Using a short command with a peer.",
      repair_vi: "Dùng ਕਰੀਏ để giữ cảm giác cùng làm.",
      repair_en: "Use ਕਰੀਏ to keep the sense of working together.",
    },
  },
  {
    id: "pa_c2_audience_supervisor",
    audience: "supervisor",
    mode: "readiness",
    title_vi: "Điều chỉnh khi nói với cấp trên",
    title_en: "Adapt tone for a supervisor",
    scenario_vi: "Bạn cần nêu rủi ro tiến độ với cấp trên.",
    scenario_en: "You need to raise a timeline risk with a supervisor.",
    adaptation_goal_vi: "Rõ ràng về rủi ro, có phương án, không nghe như than phiền.",
    adaptation_goal_en: "Be clear about risk, offer an option, and avoid sounding like complaining.",
    key_phrases: [
      {
        gurmukhi: "ਮੇਰੀ ਚਿੰਤਾ ਸਮੇਂ ਬਾਰੇ ਹੈ",
        romanization: "meri chinta same bare hai",
        vi: "Điều tôi lo là về thời gian.",
        en: "My concern is about timing.",
      },
      {
        gurmukhi: "ਇੱਕ ਸੰਭਵ ਵਿਕਲਪ ਇਹ ਹੋ ਸਕਦਾ ਹੈ",
        romanization: "ikk sambhav vikalp ih ho sakda hai",
        vi: "Một lựa chọn khả thi có thể là...",
        en: "One possible option could be...",
      },
    ],
    register_shift: {
      too_direct_vi: "Lịch này không làm được.",
      too_direct_en: "This schedule cannot be done.",
      adapted_gurmukhi:
        "ਮੇਰੀ ਚਿੰਤਾ ਸਮੇਂ ਬਾਰੇ ਹੈ। ਇੱਕ ਸੰਭਵ ਵਿਕਲਪ ਇਹ ਹੋ ਸਕਦਾ ਹੈ ਕਿ ਅਸੀਂ ਪਹਿਲੇ ਪੜਾਅ ਦੀ ਮਿਆਦ ਮੁੜ ਵੇਖੀਏ।",
      adapted_romanization:
        "meri chinta same bare hai. ikk sambhav vikalp ih ho sakda hai ki asin pehle paraa di miaad mur vekhie.",
      adapted_vi:
        "Điều tôi lo là về thời gian. Một lựa chọn khả thi là chúng ta xem lại hạn của giai đoạn đầu.",
      adapted_en:
        "My concern is about timing. One possible option could be reviewing the first phase deadline.",
    },
    checkpoints: [
      {
        checkpoint_vi: "Có rủi ro và phương án không?",
        checkpoint_en: "Does it include risk and an option?",
        ready_signal_vi: "Có ਚਿੰਤਾ và ਵਿਕਲਪ.",
        ready_signal_en: "Includes ਚਿੰਤਾ and ਵਿਕਲਪ.",
      },
    ],
    route: {
      if_missing_vi: "Nếu chỉ nêu vấn đề mà không có phương án.",
      if_missing_en: "If it only names a problem without an option.",
      remediation_vi: "Thêm một lựa chọn khả thi hoặc bước kiểm tra.",
      remediation_en: "Add one feasible option or review step.",
    },
    learner_trap: {
      trap_vi: "Quá vòng vo nên rủi ro không rõ.",
      trap_en: "Being so indirect that the risk is unclear.",
      repair_vi: "Nêu ਚਿੰਤਾ cụ thể rồi đưa ਵਿਕਲਪ.",
      repair_en: "Name the specific ਚਿੰਤਾ, then offer a ਵਿਕਲਪ.",
    },
  },
  {
    id: "pa_c2_audience_public_service_worker_canada",
    audience: "public_service_worker",
    mode: "navigation",
    title_vi: "Điều chỉnh tại quầy dịch vụ công Canada",
    title_en: "Adapt tone with a Canadian public-service worker",
    scenario_vi: "Bạn thiếu một giấy tờ nhưng muốn hỏi bước tiếp theo.",
    scenario_en: "You are missing a document and want to ask about the next step.",
    adaptation_goal_vi: "Tôn trọng quy định, nêu thông tin thật, hỏi lựa chọn.",
    adaptation_goal_en: "Respect the rule, state real information, and ask for options.",
    key_phrases: [
      {
        gurmukhi: "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ",
        romanization: "mainu niyam di samajh hai",
        vi: "Tôi hiểu quy định.",
        en: "I understand the rule.",
      },
      {
        gurmukhi: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
        romanization: "agla kadam ki ho sakda hai?",
        vi: "Bước tiếp theo có thể là gì?",
        en: "What could the next step be?",
      },
    ],
    register_shift: {
      too_direct_vi: "Tôi không có giấy đó, vậy làm sao?",
      too_direct_en: "I do not have that paper, so what now?",
      adapted_gurmukhi:
        "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਹੈ; ਅਗਲਾ ਕਦਮ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
      adapted_romanization:
        "mainu niyam di samajh hai. is vele mere kol copy hai; agla kadam ki ho sakda hai?",
      adapted_vi:
        "Tôi hiểu quy định. Hiện tôi có bản sao; bước tiếp theo có thể là gì?",
      adapted_en:
        "I understand the rule. Right now I have a copy; what could the next step be?",
    },
    checkpoints: [
      {
        checkpoint_vi: "Có thừa nhận quy định trước khi hỏi không?",
        checkpoint_en: "Does it acknowledge the rule before asking?",
        ready_signal_vi: "Có ਨਿਯਮ ਦੀ ਸਮਝ và ਅਗਲਾ ਕਦਮ.",
        ready_signal_en: "Includes ਨਿਯਮ ਦੀ ਸਮਝ and ਅਗਲਾ ਕਦਮ.",
      },
    ],
    route: {
      if_missing_vi: "Nếu câu nghe như phàn nàn về quy định.",
      if_missing_en: "If the sentence sounds like complaining about the rule.",
      remediation_vi: "Bắt đầu bằng hiểu quy định, sau đó hỏi bước tiếp theo.",
      remediation_en: "Start with understanding the rule, then ask for the next step.",
    },
    learner_trap: {
      trap_vi: "Chỉ nói 'tôi không có' rồi dừng lại.",
      trap_en: "Only saying 'I do not have it' and stopping.",
      repair_vi: "Nêu cái đang có rồi hỏi ਅਗਲਾ ਕਦਮ.",
      repair_en: "State what you have, then ask for ਅਗਲਾ ਕਦਮ.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_audience_community_audience",
    audience: "community_audience",
    mode: "review",
    title_vi: "Điều chỉnh cho người nghe cộng đồng",
    title_en: "Adapt for a community audience",
    scenario_vi: "Bạn thông báo quyết định nhóm cho nhiều người có mức thân quen khác nhau.",
    scenario_en: "You announce a group decision to people with different levels of familiarity.",
    adaptation_goal_vi: "Tóm tắt đồng thuận, điểm còn mở, và bước tiếp theo bằng giọng bao gồm.",
    adaptation_goal_en: "Summarize agreement, open point, and next step with inclusive tone.",
    key_phrases: [
      {
        gurmukhi: "ਹੁਣ ਤੱਕ ਸਹਿਮਤੀ ਇਹ ਹੈ",
        romanization: "hun takk sahimati ih hai",
        vi: "Đến giờ, điểm đồng thuận là...",
        en: "So far, the agreement is...",
      },
      {
        gurmukhi: "ਅਗਲਾ ਕਦਮ",
        romanization: "agla kadam",
        vi: "Bước tiếp theo.",
        en: "The next step.",
      },
    ],
    register_shift: {
      too_direct_vi: "Chúng ta quyết vậy rồi.",
      too_direct_en: "We decided this already.",
      adapted_gurmukhi:
        "ਹੁਣ ਤੱਕ ਸਹਿਮਤੀ ਇਹ ਹੈ ਕਿ ਸਮਾਗਮ ਹਫ਼ਤੇ ਦੇ ਅੰਤ ਹੋਵੇ। ਅਗਲਾ ਕਦਮ ਦੋ ਤਾਰੀਖਾਂ ਤੇ ਰਾਇ ਲੈਣਾ ਹੈ।",
      adapted_romanization:
        "hun takk sahimati ih hai ki samagam hafte de ant hove. agla kadam do tarikh'an te rai laina hai.",
      adapted_vi:
        "Đến giờ, điểm đồng thuận là sự kiện vào cuối tuần. Bước tiếp theo là lấy ý kiến về hai ngày.",
      adapted_en:
        "So far, the agreement is that the event should be on the weekend. The next step is to get views on two dates.",
    },
    checkpoints: [
      {
        checkpoint_vi: "Có tóm tắt thay vì áp đặt không?",
        checkpoint_en: "Does it summarize instead of imposing?",
        ready_signal_vi: "Có ਸਹਿਮਤੀ và ਰਾਇ.",
        ready_signal_en: "Includes ਸਹਿਮਤੀ and ਰਾਇ.",
      },
    ],
    route: {
      if_missing_vi: "Nếu câu nghe như chốt áp đặt.",
      if_missing_en: "If the sentence sounds like an imposed final decision.",
      remediation_vi: "Tách đồng thuận đã có khỏi phần cần lấy ý kiến.",
      remediation_en: "Separate existing agreement from the part needing input.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_audience_formal_meeting",
    audience: "formal_meeting",
    mode: "readiness",
    title_vi: "Điều chỉnh trong cuộc họp trang trọng",
    title_en: "Adapt in a formal meeting",
    scenario_vi: "Bạn cần đề nghị xem lại hạn mà không làm gián đoạn tiến trình họp.",
    scenario_en: "You need to suggest reviewing a deadline without derailing the meeting.",
    adaptation_goal_vi: "Nêu đề xuất ngắn, có lý do, và đưa lại về quyết định chung.",
    adaptation_goal_en: "Make a concise proposal with a reason and return to group decision.",
    key_phrases: [
      {
        gurmukhi: "ਕੀ ਅਸੀਂ ਮਿਆਦ ਨੂੰ ਮੁੜ ਵੇਖ ਸਕਦੇ ਹਾਂ?",
        romanization: "ki asin miaad nu mur vekh sakde haan?",
        vi: "Chúng ta có thể xem lại hạn không?",
        en: "Could we review the deadline?",
      },
      {
        gurmukhi: "ਫੈਸਲਾ ਮਿਲ ਕੇ ਕਰੀਏ",
        romanization: "faisla mil ke karie",
        vi: "Hãy quyết định cùng nhau.",
        en: "Let's decide together.",
      },
    ],
    register_shift: {
      too_direct_vi: "Hạn này sai.",
      too_direct_en: "This deadline is wrong.",
      adapted_gurmukhi:
        "ਸਮੇਂ ਬਾਰੇ ਇੱਕ ਚਿੰਤਾ ਹੈ। ਕੀ ਅਸੀਂ ਮਿਆਦ ਨੂੰ ਮੁੜ ਵੇਖ ਸਕਦੇ ਹਾਂ ਅਤੇ ਫੈਸਲਾ ਮਿਲ ਕੇ ਕਰੀਏ?",
      adapted_romanization:
        "same bare ikk chinta hai. ki asin miaad nu mur vekh sakde haan ate faisla mil ke karie?",
      adapted_vi:
        "Có một lo ngại về thời gian. Chúng ta có thể xem lại hạn và quyết định cùng nhau không?",
      adapted_en:
        "There is one concern about timing. Could we review the deadline and decide together?",
    },
    checkpoints: [
      {
        checkpoint_vi: "Có đề nghị dưới dạng câu hỏi hợp tác không?",
        checkpoint_en: "Is the proposal framed as a collaborative question?",
        ready_signal_vi: "Có ਕੀ ਅਸੀਂ và ਮਿਲ ਕੇ.",
        ready_signal_en: "Includes ਕੀ ਅਸੀਂ and ਮਿਲ ਕੇ.",
      },
    ],
    route: {
      if_missing_vi: "Nếu câu nghe như tuyên bố phủ định.",
      if_missing_en: "If the sentence sounds like a negative declaration.",
      remediation_vi: "Chuyển thành câu hỏi hợp tác với lý do cụ thể.",
      remediation_en: "Turn it into a collaborative question with a specific reason.",
    },
    learner_trap: {
      trap_vi: "Nói 'sai' trong họp trang trọng làm mất sắc thái.",
      trap_en: "Saying 'wrong' in a formal meeting loses nuance.",
      repair_vi: "Nói ਚਿੰਤਾ và mời xem lại.",
      repair_en: "Say ਚਿੰਤਾ and invite review.",
    },
  },
  {
    id: "pa_c2_audience_tense_conversation",
    audience: "tense_conversation",
    mode: "remediation",
    title_vi: "Điều chỉnh trong cuộc trao đổi căng",
    title_en: "Adapt in a tense conversation",
    scenario_vi: "Hai người nói chồng lên nhau và giọng đang tăng.",
    scenario_en: "Two people are speaking over each other and the tone is rising.",
    adaptation_goal_vi: "Giảm căng bằng quy trình, không ra lệnh cảm xúc.",
    adaptation_goal_en: "Reduce tension through process, not emotional commands.",
    key_phrases: [
      {
        gurmukhi: "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ",
        romanization: "aao ikk-ikk gall sunie",
        vi: "Ta hãy nghe từng ý một.",
        en: "Let's hear one point at a time.",
      },
      {
        gurmukhi: "ਮਕਸਦ ਹੱਲ ਲੱਭਣਾ ਹੈ",
        romanization: "maqsad hall labhna hai",
        vi: "Mục tiêu là tìm giải pháp.",
        en: "The goal is to find a solution.",
      },
    ],
    register_shift: {
      too_direct_vi: "Bình tĩnh đi.",
      too_direct_en: "Calm down.",
      adapted_gurmukhi:
        "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ। ਮਕਸਦ ਹੱਲ ਲੱਭਣਾ ਹੈ, ਇਸ ਲਈ ਬਾਰੀ-ਬਾਰੀ ਗੱਲ ਕਰੀਏ।",
      adapted_romanization:
        "aao ikk-ikk gall sunie. maqsad hall labhna hai, is lai baari-baari gall karie.",
      adapted_vi:
        "Ta hãy nghe từng ý một. Mục tiêu là tìm giải pháp, vì vậy hãy nói lần lượt.",
      adapted_en:
        "Let's hear one point at a time. The goal is to find a solution, so let's speak in turn.",
    },
    checkpoints: [
      {
        checkpoint_vi: "Có quy trình nghe/nói lần lượt không?",
        checkpoint_en: "Is there a turn-taking process?",
        ready_signal_vi: "Có ਇੱਕ-ਇੱਕ hoặc ਬਾਰੀ-ਬਾਰੀ.",
        ready_signal_en: "Includes ਇੱਕ-ਇੱਕ or ਬਾਰੀ-ਬਾਰੀ.",
      },
    ],
    route: {
      if_missing_vi: "Nếu câu ra lệnh cảm xúc.",
      if_missing_en: "If the sentence commands emotion.",
      remediation_vi: "Đổi sang đề xuất quy trình nghe từng lượt.",
      remediation_en: "Change to a turn-taking process suggestion.",
    },
    learner_trap: {
      trap_vi: "Ra lệnh 'bình tĩnh' có thể làm căng thẳng hơn.",
      trap_en: "Commanding someone to calm down can increase tension.",
      repair_vi: "Đề xuất cách tiếp tục cuộc nói chuyện.",
      repair_en: "Suggest how to continue the conversation.",
    },
  },
  {
    id: "pa_c2_audience_sensitive_topic",
    audience: "sensitive_topic_discussion",
    mode: "readiness",
    title_vi: "Điều chỉnh khi bàn chủ đề nhạy cảm",
    title_en: "Adapt for sensitive-topic discussion",
    scenario_vi: "Bạn cần phân công vai trò mà không dựa vào tuổi, giới, gia đình, hoặc cộng đồng.",
    scenario_en: "You need to assign roles without relying on age, gender, family, or community assumptions.",
    adaptation_goal_vi: "Dùng tiêu chí trung tính và cho người nghe quyền chọn.",
    adaptation_goal_en: "Use neutral criteria and give listeners choice.",
    key_phrases: [
      {
        gurmukhi: "ਰੁਚੀ ਅਤੇ ਸਮੇਂ ਦੇ ਅਨੁਸਾਰ",
        romanization: "ruchi ate same de anusaar",
        vi: "Theo sở thích và thời gian.",
        en: "According to interest and availability.",
      },
      {
        gurmukhi: "ਜਿਸ ਨੂੰ ਸੁਵਿਧਾ ਹੋਵੇ",
        romanization: "jis nu suvidha hove",
        vi: "Ai thấy thuận tiện.",
        en: "Whoever feels comfortable.",
      },
    ],
    register_shift: {
      too_direct_vi: "Nhóm này nên làm phần đó.",
      too_direct_en: "That group should do that part.",
      adapted_gurmukhi:
        "ਅਸੀਂ ਕੰਮ ਰੁਚੀ ਅਤੇ ਸਮੇਂ ਦੇ ਅਨੁਸਾਰ ਵੰਡ ਸਕਦੇ ਹਾਂ। ਜਿਸ ਨੂੰ ਸੁਵਿਧਾ ਹੋਵੇ, ਉਹ ਇਹ ਹਿੱਸਾ ਲੈ ਸਕਦਾ ਹੈ।",
      adapted_romanization:
        "asin kamm ruchi ate same de anusaar vand sakde haan. jis nu suvidha hove, oh ih hissa lai sakda hai.",
      adapted_vi:
        "Chúng ta có thể chia việc theo sở thích và thời gian. Ai thấy thuận tiện có thể nhận phần này.",
      adapted_en:
        "We can divide the work by interest and availability. Whoever feels comfortable can take this part.",
    },
    checkpoints: [
      {
        checkpoint_vi: "Có tránh định kiến và mở quyền chọn không?",
        checkpoint_en: "Does it avoid stereotypes and open choice?",
        ready_signal_vi: "Có ਰੁਚੀ, ਸਮੇਂ, và ਸੁਵਿਧਾ.",
        ready_signal_en: "Includes ਰੁਚੀ, ਸਮੇਂ, and ਸੁਵਿਧਾ.",
      },
    ],
    route: {
      if_missing_vi: "Nếu câu gán việc theo nhóm người.",
      if_missing_en: "If the sentence assigns work by group identity.",
      remediation_vi: "Chuyển sang tiêu chí sở thích, thời gian, và mức thoải mái.",
      remediation_en: "Shift to interest, availability, and comfort criteria.",
    },
    learner_trap: {
      trap_vi: "Dùng đặc điểm xã hội làm lý do phân công.",
      trap_en: "Using social identity as the reason for assignment.",
      repair_vi: "Dùng tiêu chí trung tính và quyền chọn.",
      repair_en: "Use neutral criteria and choice.",
    },
  },
];

export const audienceAdaptationC2ByAudience = (
  audience: PunjabiC2Audience,
): PunjabiC2AudienceAdaptation[] =>
  audienceAdaptationC2.filter((entry) => entry.audience === audience);
