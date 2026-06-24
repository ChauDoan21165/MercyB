export type PunjabiB1IntegrationDryRunFocus =
  | "scenario_packs"
  | "service_recovery"
  | "issue_resolution"
  | "follow_up_message"
  | "conversation_recovery"
  | "workplace_task"
  | "housing_task"
  | "school_community_task"
  | "register_safe_repair";

export type PunjabiIntegrationDryRunLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiIntegrationDryRunTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiIntegrationDryRunLine;
};

export type PunjabiIntegrationDryRunPack = {
  dryRunPrompt_en: string;
  dryRunPrompt_vi: string;
  dryRunLine: PunjabiIntegrationDryRunLine;
  dryRunSignals_en: string[];
  dryRunSignals_vi: string[];
};

export type PunjabiB1IntegrationDryRunCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1IntegrationDryRunFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  dryRunPack: PunjabiIntegrationDryRunPack;
  commonTraps: PunjabiIntegrationDryRunTrap[];
  finalReadiness_en: string;
  finalReadiness_vi: string;
  integrationRoute_en: string;
  integrationRoute_vi: string;
};

export const punjabiB1IntegrationDryRunSet: PunjabiB1IntegrationDryRunCard[] = [
  {
    id: "b1-dryrun-scenario-packs",
    level: "B1",
    focus: "scenario_packs",
    title_en: "Pick a scenario pack for the dry run",
    title_vi: "Chọn bộ tình huống cho buổi dry run",
    scenario_en:
      "You want to pick the right B1 pack before a later integration session.",
    scenario_vi:
      "Bạn muốn chọn bộ B1 phù hợp trước một buổi tích hợp sau này.",
    canadaContext:
      "Useful for Canadian language classes, newcomer centres, and self-study planning.",
    dryRunPack: {
      dryRunPrompt_en:
        "Choose the scenario pack that best fits the conversation goal.",
      dryRunPrompt_vi:
        "Chọn bộ tình huống khớp nhất với mục tiêu hội thoại.",
      dryRunLine: {
        pa: "ਮੈਨੂੰ ਉਹ ਪੈਕ ਚਾਹੀਦਾ ਹੈ ਜੋ ਮੇਰੀ ਸਥਿਤੀ ਨਾਲ ਸਭ ਤੋਂ ਵੱਧ ਮਿਲਦਾ ਹੋਵੇ।",
        romanization:
          "mainu oh pack chahida hai jo meri sthiti nal sabh ton vadh milda hove.",
        en: "I want the pack that matches my situation best.",
        vi: "Tôi muốn bộ phù hợp nhất với tình huống của mình.",
      },
      dryRunSignals_en: [
        "Matches a scenario goal",
        "Keeps the next step visible",
        "Supports later integration",
      ],
      dryRunSignals_vi: [
        "Khớp mục tiêu tình huống",
        "Giữ bước tiếp theo rõ",
        "Hỗ trợ tích hợp sau này",
      ],
    },
    commonTraps: [
      {
        trap_en: "Choosing by topic only and ignoring the conversation goal.",
        trap_vi: "Chọn theo chủ đề בלבד và bỏ qua mục tiêu hội thoại.",
        better: {
          pa: "ਮੈਂ ਲਕਸ਼ ਦੇ ਅਨੁਸਾਰ ਚੁਣਾਂਗਾ।",
          romanization: "main laksh de anusar chunanga.",
          en: "I will choose according to the goal.",
          vi: "Tôi sẽ chọn theo mục tiêu.",
        },
      },
    ],
    finalReadiness_en:
      "Language practice only, not medical advice. Language practice only, not legal or financial advice. Final readiness is ready when the dry-run selector is short, stable, and easy to map.",
    finalReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Sẵn sàng cuối khi bộ chọn dry run ngắn, ổn định và dễ ánh xạ.",
    integrationRoute_en:
      "Route to B2 integrated packs if the goal stays stable; otherwise remain in B1 dry-run review.",
    integrationRoute_vi:
      "Chuyển sang bộ tích hợp B2 nếu mục tiêu ổn định; nếu chưa thì ở lại rà soát dry run B1.",
  },
  {
    id: "b1-dryrun-service-recovery",
    level: "B1",
    focus: "service_recovery",
    title_en: "Select a service-recovery dry run",
    title_vi: "Chọn dry run phục hồi dịch vụ",
    scenario_en:
      "A service conversation needs a polite reset after confusion or a missed step.",
    scenario_vi:
      "Cuộc trò chuyện dịch vụ cần đặt lại lịch sự sau nhầm lẫn hoặc bỏ sót bước.",
    canadaContext:
      "Useful for Canadian service counters, phone lines, and support chats.",
    dryRunPack: {
      dryRunPrompt_en:
        "Select the service pack that keeps the request clear.",
      dryRunPrompt_vi:
        "Chọn bộ dịch vụ giữ cho yêu cầu rõ ràng.",
      dryRunLine: {
        pa: "ਮੈਂ ਸੇਵਾ ਵਾਲੀ ਗੱਲ ਨੂੰ ਸਾਫ਼ ਅਤੇ ਸ਼ਾਂਤ ਤਰੀਕੇ ਨਾਲ ਜਾਰੀ ਰੱਖਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization:
          "main seva vali gall nu saf ate shant tarike nal jari rakhna chahunda han.",
        en: "I want to continue the service conversation clearly and calmly.",
        vi: "Tôi muốn tiếp tục cuộc trò chuyện dịch vụ một cách rõ và bình tĩnh.",
      },
      dryRunSignals_en: [
        "Keeps the request stable",
        "Avoids escalation",
        "Supports a calm reset",
      ],
      dryRunSignals_vi: [
        "Giữ yêu cầu ổn định",
        "Tránh leo thang",
        "Hỗ trợ đặt lại bình tĩnh",
      ],
    },
    commonTraps: [
      {
        trap_en: "Switching to a new complaint before the first issue is resolved.",
        trap_vi: "Chuyển sang than phiền mới trước khi vấn đề đầu được giải quyết.",
        better: {
          pa: "ਪਹਿਲੀ ਬੇਨਤੀ ਹੀ ਸਪਸ਼ਟ ਰੱਖੀਏ।",
          romanization: "pehli benti hi spasht rakhiye.",
          en: "Let's keep the first request clear.",
          vi: "Hãy giữ yêu cầu đầu tiên thật rõ.",
        },
      },
    ],
    finalReadiness_en:
      "language practice only, not medical advice. Shahmukhi is awareness only, not a full course. Ready for final-readiness checks when the reset stays polite and repeatable.",
    finalReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Shahmukhi chỉ để nhận biết, không phải một khóa đầy đủ. Sẵn sàng cho kiểm tra cuối khi phần đặt lại lịch sự và lặp lại được.",
    integrationRoute_en:
      "Route to B2 service problem-solving if the recovery remains stable.",
    integrationRoute_vi:
      "Chuyển sang giải quyết vấn đề dịch vụ B2 nếu phần phục hồi vẫn ổn định.",
  },
  {
    id: "b1-dryrun-issue-resolution",
    level: "B1",
    focus: "issue_resolution",
    title_en: "Select an issue-resolution dry run",
    title_vi: "Chọn dry run giải quyết vấn đề",
    scenario_en:
      "You need a pack for explaining an issue, asking for correction, and checking the result.",
    scenario_vi:
      "Bạn cần bộ để giải thích vấn đề, yêu cầu sửa và kiểm tra kết quả.",
    canadaContext:
      "Useful for Canadian billing desks, office support, and community services.",
    dryRunPack: {
      dryRunPrompt_en:
        "Choose the issue-resolution pack that keeps facts and next steps together.",
      dryRunPrompt_vi:
        "Chọn bộ giải quyết vấn đề giữ факт và bước tiếp theo đi cùng nhau.",
      dryRunLine: {
        pa: "ਮੈਨੂੰ ਮੁੱਦਾ, ਸੁਧਾਰ, ਅਤੇ ਅਗਲਾ ਕਦਮ ਇਕੱਠੇ ਚਾਹੀਦੇ ਹਨ।",
        romanization:
          "mainu mudda, sudhar, ate agla kadam ikathe chahide han.",
        en: "I need the issue, the correction, and the next step together.",
        vi: "Tôi cần vấn đề, phần sửa và bước tiếp theo đi cùng nhau.",
      },
      dryRunSignals_en: [
        "Links issue and correction",
        "Keeps a practical order",
        "Supports a final check",
      ],
      dryRunSignals_vi: [
        "Nối vấn đề với phần sửa",
        "Giữ thứ tự thực tế",
        "Hỗ trợ kiểm tra cuối",
      ],
    },
    commonTraps: [
      {
        trap_en: "Asking for a fix but not checking whether it worked.",
        trap_vi: "Yêu cầu sửa nhưng không kiểm tra xem đã hiệu quả chưa.",
        better: {
          pa: "ਕੀ ਸੁਧਾਰ ਹੋ ਗਿਆ ਹੈ, ਜਾਂ ਮੈਨੂੰ ਮੁੜ ਪੁੱਛਣਾ ਚਾਹੀਦਾ ਹੈ?",
          romanization:
            "ki sudhar ho gia hai, ja mainu mudh puchhna chahida hai?",
          en: "Has the correction happened, or should I ask again?",
          vi: "Phần sửa đã xong chưa, hay tôi nên hỏi lại?",
        },
      },
    ],
    finalReadiness_en:
      "Language practice only, not legal or financial advice. Final readiness is ready when the issue-resolution path is compact and checkable.",
    finalReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Sẵn sàng cuối khi lộ trình giải quyết vấn đề ngắn gọn và có thể kiểm tra.",
    integrationRoute_en:
      "Route to B2 issue-resolution and complaint handling tasks when the correction is stable.",
    integrationRoute_vi:
      "Chuyển sang nhiệm vụ giải quyết vấn đề và xử lý khiếu nại B2 khi phần sửa ổn định.",
  },
  {
    id: "b1-dryrun-follow-up-message",
    level: "B1",
    focus: "follow_up_message",
    title_en: "Select a follow-up dry run",
    title_vi: "Chọn dry run theo dõi",
    scenario_en:
      "You want to follow up by text or email without losing the original request.",
    scenario_vi:
      "Bạn muốn theo dõi bằng tin nhắn hoặc email mà không mất yêu cầu ban đầu.",
    canadaContext:
      "Useful for Canadian email, portal, and text follow-ups with offices or landlords.",
    dryRunPack: {
      dryRunPrompt_en:
        "Choose the follow-up pack that matches the earlier request.",
      dryRunPrompt_vi:
        "Chọn bộ theo dõi khớp với yêu cầu trước đó.",
      dryRunLine: {
        pa: "ਮੈਂ ਪਿਛਲੀ ਬੇਨਤੀ ਬਾਰੇ ਇੱਕ ਛੋਟਾ ਅਪਡੇਟ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization:
          "main pichhli benti bare ik chota update chahunda han.",
        en: "I want a short update about my previous request.",
        vi: "Tôi muốn một cập nhật ngắn về yêu cầu trước đó.",
      },
      dryRunSignals_en: [
        "Refers to the earlier request",
        "Stays brief",
        "Asks for one update",
      ],
      dryRunSignals_vi: [
        "Nhắc yêu cầu trước",
        "Giữ ngắn",
        "Hỏi một cập nhật",
      ],
    },
    commonTraps: [
      {
        trap_en: "Writing a brand-new message instead of following up.",
        trap_vi: "Viết tin nhắn hoàn toàn mới thay vì theo dõi.",
        better: {
          pa: "ਮੈਂ ਪੁਰਾਣੀ ਬੇਨਤੀ ਦੇ ਬਾਰੇ ਪੁੱਛ ਰਿਹਾ ਹਾਂ।",
          romanization: "main purani benti de bare puchh riha han.",
          en: "I am asking about the earlier request.",
          vi: "Tôi đang hỏi về yêu cầu trước đó.",
        },
      },
    ],
    finalReadiness_en:
      "language practice only, not legal or financial advice. Native review is deferred. Final readiness is ready when the follow-up remains consistent and polite.",
    finalReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Đánh giá bản ngữ được hoãn lại. Sẵn sàng cuối khi phần theo dõi nhất quán và lịch sự.",
    integrationRoute_en:
      "Route to B2 follow-up routing if the message stays stable.",
    integrationRoute_vi:
      "Chuyển sang định tuyến theo dõi B2 nếu tin nhắn giữ được tính ổn định.",
  },
  {
    id: "b1-dryrun-conversation-recovery",
    level: "B1",
    focus: "conversation_recovery",
    title_en: "Select a conversation-recovery dry run",
    title_vi: "Chọn dry run phục hồi hội thoại",
    scenario_en:
      "A conversation went off track and you need a pack that restarts it calmly.",
    scenario_vi:
      "Cuộc trò chuyện bị lệch hướng và bạn cần bộ để khởi động lại bình tĩnh.",
    canadaContext:
      "Useful for Canadian service desks, workplaces, housing offices, and community counters.",
    dryRunPack: {
      dryRunPrompt_en:
        "Choose the recovery pack that restarts the same conversation cleanly.",
      dryRunPrompt_vi:
        "Chọn bộ phục hồi khởi động lại cùng cuộc trò chuyện một cách gọn.",
      dryRunLine: {
        pa: "ਮੈਂ ਗੱਲ ਨੂੰ ਮੁੜ ਸਾਫ਼ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization: "main gall nu mudh saf karna chahunda han.",
        en: "I want to clarify the conversation again.",
        vi: "Tôi muốn làm rõ lại cuộc trò chuyện.",
      },
      dryRunSignals_en: [
        "Restarts the same topic",
        "Keeps the tone calm",
        "Supports a stable retry",
      ],
      dryRunSignals_vi: [
        "Khởi động lại cùng chủ đề",
        "Giữ giọng bình tĩnh",
        "Hỗ trợ thử lại ổn định",
      ],
    },
    commonTraps: [
      {
        trap_en: "Treating a reset like a brand-new topic.",
        trap_vi: "Xem việc đặt lại như một chủ đề hoàn toàn mới.",
        better: {
          pa: "ਉਹੀ ਗੱਲ, ਪਰ ਹੋਰ ਸਾਫ਼ ਤਰੀਕੇ ਨਾਲ।",
          romanization: "ohi gall, par hor saf tarike nal.",
          en: "The same topic, but more clearly.",
          vi: "Cùng chủ đề đó, nhưng rõ hơn.",
        },
      },
    ],
    finalReadiness_en:
      "Language practice only, not medical advice. Language practice only, not legal or financial advice. Final readiness is ready when the restart is calm and repeatable.",
    finalReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Sẵn sàng cuối khi phần khởi động lại bình tĩnh và lặp lại được.",
    integrationRoute_en:
      "Route to B2 conversation-recovery and retelling tasks if the reset stays stable.",
    integrationRoute_vi:
      "Chuyển sang nhiệm vụ phục hồi hội thoại và kể lại B2 nếu phần đặt lại ổn định.",
  },
  {
    id: "b1-dryrun-workplace-task",
    level: "B1",
    focus: "workplace_task",
    title_en: "Select a workplace-task dry run",
    title_vi: "Chọn dry run nhiệm vụ nơi làm việc",
    scenario_en:
      "You need a pack for work instructions, shift updates, and polite clarification.",
    scenario_vi:
      "Bạn cần bộ cho hướng dẫn công việc, cập nhật ca làm và làm rõ lịch sự.",
    canadaContext:
      "Useful for Canadian retail, warehouse, hospitality, and office shifts.",
    dryRunPack: {
      dryRunPrompt_en:
        "Choose the workplace pack that keeps task, time, and responsibility aligned.",
      dryRunPrompt_vi:
        "Chọn bộ nơi làm việc giữ nhiệm vụ, thời gian và trách nhiệm khớp nhau.",
      dryRunLine: {
        pa: "ਮੈਨੂੰ ਕੰਮ, ਸਮਾਂ, ਅਤੇ ਜ਼ਿੰਮੇਵਾਰੀ ਸਪਸ਼ਟ ਚਾਹੀਦੀ ਹੈ।",
        romanization:
          "mainu kamm, sama, ate zimmedari spasht chahidi hai.",
        en: "I need the task, time, and responsibility to be clear.",
        vi: "Tôi cần nhiệm vụ, thời gian và trách nhiệm thật rõ.",
      },
      dryRunSignals_en: [
        "Names the task",
        "Confirms the time",
        "Clarifies responsibility",
      ],
      dryRunSignals_vi: [
        "Nêu nhiệm vụ",
        "Xác nhận thời gian",
        "Làm rõ trách nhiệm",
      ],
    },
    commonTraps: [
      {
        trap_en: "Changing the task description after the supervisor replies.",
        trap_vi: "Đổi mô tả nhiệm vụ sau khi quản lý trả lời.",
        better: {
          pa: "ਮੈਂ ਉਹੀ ਕੰਮ ਮੁੜ ਸਪਸ਼ਟ ਕਰ ਰਿਹਾ ਹਾਂ।",
          romanization: "main ohi kamm mudh spasht kar riha han.",
          en: "I am clarifying the same task again.",
          vi: "Tôi đang làm rõ lại cùng một nhiệm vụ.",
        },
      },
    ],
    finalReadiness_en:
      "language practice only, not legal or financial advice. Final readiness is ready when the workplace selector stays stable and easy to verify.",
    finalReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Sẵn sàng cuối khi bộ chọn nơi làm việc ổn định và dễ xác minh.",
    integrationRoute_en:
      "Route to B2 workplace update and shift-management tasks when the task flow is stable.",
    integrationRoute_vi:
      "Chuyển sang nhiệm vụ cập nhật nơi làm việc và quản lý ca B2 khi luồng việc ổn định.",
  },
  {
    id: "b1-dryrun-housing-task",
    level: "B1",
    focus: "housing_task",
    title_en: "Select a housing-task dry run",
    title_vi: "Chọn dry run nhiệm vụ nhà ở",
    scenario_en:
      "You need a pack for repair follow-ups, landlord messages, and calm boundary setting.",
    scenario_vi:
      "Bạn cần bộ cho theo dõi sửa chữa, tin nhắn với chủ nhà và đặt ranh giới bình tĩnh.",
    canadaContext:
      "Useful for Canadian rental offices, tenant support, and building management.",
    dryRunPack: {
      dryRunPrompt_en:
        "Choose the housing pack that keeps the repair facts and timing consistent.",
      dryRunPrompt_vi:
        "Chọn bộ nhà ở giữ факт sửa chữa và thời gian nhất quán.",
      dryRunLine: {
        pa: "ਮੁਰੰਮਤ, ਸਮਾਂ, ਅਤੇ ਅਪਡੇਟ ਇਕੋ ਜਿਹੇ ਰਹਿਣੇ ਚਾਹੀਦੇ ਹਨ।",
        romanization:
          "murammat, sama, ate update iko jehe rehnhe chahide han.",
        en: "The repair, time, and update should stay consistent.",
        vi: "Việc sửa chữa, thời gian và cập nhật nên nhất quán.",
      },
      dryRunSignals_en: [
        "Keeps repair facts stable",
        "Tracks the timing",
        "Supports a calm boundary",
      ],
      dryRunSignals_vi: [
        "Giữ факт sửa chữa ổn định",
        "Theo dõi thời gian",
        "Hỗ trợ ranh giới bình tĩnh",
      ],
    },
    commonTraps: [
      {
        trap_en: "Turning a timing question into a long argument.",
        trap_vi: "Biến câu hỏi về thời gian thành tranh cãi dài.",
        better: {
          pa: "ਮੈਨੂੰ ਸਿਰਫ਼ ਅਪਡੇਟ ਚਾਹੀਦਾ ਹੈ।",
          romanization: "mainu sirf update chahida hai.",
          en: "I only need an update.",
          vi: "Tôi chỉ cần một cập nhật.",
        },
      },
    ],
    finalReadiness_en:
      "Language practice only, not medical advice. Final readiness is ready when the housing pack is factual, calm, and easy to reuse.",
    finalReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Sẵn sàng cuối khi bộ nhà ở mang tính факт, bình tĩnh và dễ tái dùng.",
    integrationRoute_en:
      "Route to B2 housing follow-up tasks if the repair thread remains stable.",
    integrationRoute_vi:
      "Chuyển sang nhiệm vụ theo dõi nhà ở B2 nếu mạch sửa chữa vẫn ổn định.",
  },
  {
    id: "b1-dryrun-school-community-task",
    level: "B1",
    focus: "school_community_task",
    title_en: "Select a school/community-task dry run",
    title_vi: "Chọn dry run nhiệm vụ trường học/cộng đồng",
    scenario_en:
      "You need a pack for school office, community centre, or settlement follow-up messages.",
    scenario_vi:
      "Bạn cần bộ cho văn phòng trường, trung tâm cộng đồng hoặc theo dõi ở chương trình định cư.",
    canadaContext:
      "Useful for Canadian school offices, community centres, and newcomer programs.",
    dryRunPack: {
      dryRunPrompt_en:
        "Choose the school/community pack that stays short and respectful.",
      dryRunPrompt_vi:
        "Chọn bộ trường học/cộng đồng ngắn gọn và tôn trọng.",
      dryRunLine: {
        pa: "ਮੈਂ ਆਪਣੀ ਪਿਛਲੀ ਬੇਨਤੀ ਨੂੰ ਸਪਸ਼ਟ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization:
          "main apni pichhli benti nu spasht karna chahunda han.",
        en: "I want to clarify my previous request.",
        vi: "Tôi muốn làm rõ yêu cầu trước đó.",
      },
      dryRunSignals_en: [
        "Refers back to the earlier request",
        "Keeps the ask simple",
        "Supports follow-through",
      ],
      dryRunSignals_vi: [
        "Nhắc yêu cầu trước",
        "Giữ yêu cầu đơn giản",
        "Hỗ trợ theo dõi đến cùng",
      ],
    },
    commonTraps: [
      {
        trap_en: "Making the message too long for a simple school update.",
        trap_vi: "Làm tin nhắn quá dài cho một cập nhật trường học đơn giản.",
        better: {
          pa: "ਛੋਟੀ ਗੱਲ ਬਿਹਤਰ ਹੈ।",
          romanization: "choti gall behatar hai.",
          en: "Short is better.",
          vi: "Ngắn là tốt hơn.",
        },
      },
    ],
    finalReadiness_en:
      "language practice only, not legal or financial advice. Native review is deferred. Final readiness is ready when the school/community selector stays polite and stable.",
    finalReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Đánh giá bản ngữ được hoãn lại. Sẵn sàng cuối khi bộ chọn trường học/cộng đồng lịch sự và ổn định.",
    integrationRoute_en:
      "Route to B2 school/community participation tasks if the request remains aligned.",
    integrationRoute_vi:
      "Chuyển sang nhiệm vụ tham gia trường học/cộng đồng B2 nếu yêu cầu vẫn khớp.",
  },
  {
    id: "b1-dryrun-register-safe-repair",
    level: "B1",
    focus: "register_safe_repair",
    title_en: "Select a register-safe repair dry run",
    title_vi: "Chọn dry run sửa sắc thái an toàn",
    scenario_en:
      "You need to soften a message without losing the meaning or the next step.",
    scenario_vi:
      "Bạn cần làm mềm thông điệp mà không mất ý nghĩa hoặc bước tiếp theo.",
    canadaContext:
      "Useful for Canadian service, workplace, and housing conversations that need a polite reset.",
    dryRunPack: {
      dryRunPrompt_en:
        "Choose the repair pack that keeps the meaning while softening the register.",
      dryRunPrompt_vi:
        "Chọn bộ sửa giữ ý nghĩa trong khi làm mềm sắc thái.",
      dryRunLine: {
        pa: "ਮੈਂ ਇਹ ਗੱਲ ਹੋਰ ਨਰਮ ਅਤੇ ਹੋਰ ਸਪਸ਼ਟ ਤਰੀਕੇ ਨਾਲ ਕਹਿਣੀ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization:
          "main eh gall hor narm ate hor spasht tarike nal kahini chahunda han.",
        en: "I want to say this more softly and more clearly.",
        vi: "Tôi muốn nói điều này mềm hơn và rõ hơn.",
      },
      dryRunSignals_en: [
        "Softens the tone",
        "Keeps the meaning",
        "Signals a polite reset",
      ],
      dryRunSignals_vi: [
        "Làm mềm giọng",
        "Giữ ý nghĩa",
        "Báo hiệu đặt lại lịch sự",
      ],
    },
    commonTraps: [
      {
        trap_en: "Over-apologizing until the request disappears.",
        trap_vi: "Xin lỗi quá nhiều đến mức yêu cầu biến mất.",
        better: {
          pa: "ਮੈਂ ਬੇਨਤੀ ਨੂੰ ਹੋਰ ਨਰਮ ਤਰੀਕੇ ਨਾਲ ਕਹਿ ਰਿਹਾ ਹਾਂ।",
          romanization:
            "main benti nu hor narm tarike nal kahi riha han.",
          en: "I am saying the request in a softer way.",
          vi: "Tôi đang nói yêu cầu theo cách mềm hơn.",
        },
      },
    ],
    finalReadiness_en:
      "Language practice only, not legal or financial advice. Shahmukhi is awareness only, not a full course. Final readiness is ready when the repair is polite, stable, and reusable.",
    finalReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Shahmukhi chỉ để nhận biết, không phải một khóa đầy đủ. Sẵn sàng cuối khi phần sửa lịch sự, ổn định và tái dùng được.",
    integrationRoute_en:
      "Route to B2 register-shift and repair tasks when the softened message stays clear.",
    integrationRoute_vi:
      "Chuyển sang nhiệm vụ chuyển sắc thái và sửa B2 khi thông điệp mềm hơn vẫn rõ.",
  },
];
