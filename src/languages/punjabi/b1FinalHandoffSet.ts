export type PunjabiB1FinalHandoffFocus =
  | "scenario_packs"
  | "service_recovery"
  | "issue_resolution"
  | "follow_up_message"
  | "conversation_repair"
  | "workplace_task"
  | "housing_task"
  | "school_community_task"
  | "register_safe_repair";

export type PunjabiFinalHandoffLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiFinalHandoffTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiFinalHandoffLine;
};

export type PunjabiFinalHandoffPack = {
  finalHandoffPrompt_en: string;
  finalHandoffPrompt_vi: string;
  handoffLine: PunjabiFinalHandoffLine;
  handoffSignals_en: string[];
  handoffSignals_vi: string[];
};

export type PunjabiB1FinalHandoffCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1FinalHandoffFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  handoffPack: PunjabiFinalHandoffPack;
  commonTraps: PunjabiFinalHandoffTrap[];
  finalReadiness_en: string;
  finalReadiness_vi: string;
  integrationRoute_en: string;
  integrationRoute_vi: string;
};

export const punjabiB1FinalHandoffSet: PunjabiB1FinalHandoffCard[] = [
  {
    id: "b1-handoff-scenario-packs",
    level: "B1",
    focus: "scenario_packs",
    title_en: "Hand off the right scenario pack",
    title_vi: "Bàn giao bộ tình huống phù hợp",
    scenario_en:
      "You want to hand off a scenario pack cleanly so the next learner can use it.",
    scenario_vi:
      "Bạn muốn bàn giao một bộ tình huống gọn để người học tiếp theo có thể dùng.",
    canadaContext:
      "Useful for Canadian language classes, newcomer centres, and self-study planning.",
    handoffPack: {
      finalHandoffPrompt_en:
        "Name the pack, the goal, and the safest next step.",
      finalHandoffPrompt_vi:
        "Nêu tên bộ, mục tiêu và bước tiếp theo an toàn nhất.",
      handoffLine: {
        pa: "ਇਹ ਉਹ ਪੈਕ ਹੈ ਜੋ ਮੇਰੀ ਸਥਿਤੀ ਨਾਲ ਸਭ ਤੋਂ ਵੱਧ ਮਿਲਦਾ ਹੈ।",
        romanization:
          "ih oh pack hai jo meri sthiti nal sabh ton vadh milda hai.",
        en: "This is the pack that matches my situation best.",
        vi: "Đây là bộ phù hợp nhất với tình huống của tôi.",
      },
      handoffSignals_en: [
        "Names the pack",
        "Keeps the goal visible",
        "Sets up the next step",
      ],
      handoffSignals_vi: [
        "Nêu tên bộ",
        "Giữ mục tiêu rõ",
        "Đặt bước tiếp theo",
      ],
    },
    commonTraps: [
      {
        trap_en: "Handing off by topic only and losing the goal.",
        trap_vi: "Bàn giao theo chủ đề בלבד và mất mục tiêu.",
        better: {
          pa: "ਮੈਂ ਲਕਸ਼ ਦੇ ਅਨੁਸਾਰ ਪੈਕ ਦੱਸਾਂਗਾ।",
          romanization: "main laksh de anusar pack dassanga.",
          en: "I will name the pack according to the goal.",
          vi: "Tôi sẽ nêu bộ theo mục tiêu.",
        },
      },
    ],
    finalReadiness_en:
      "Language practice only, not medical advice. Language practice only, not legal or financial advice. Final readiness is ready when the handoff is short, stable, and easy to map.",
    finalReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Sẵn sàng cuối khi phần bàn giao ngắn, ổn định và dễ ánh xạ.",
    integrationRoute_en:
      "Route to B2 integrated packs if the goal is stable; otherwise remain in B1 handoff review.",
    integrationRoute_vi:
      "Chuyển sang bộ tích hợp B2 nếu mục tiêu ổn định; nếu chưa thì ở lại rà soát bàn giao B1.",
  },
  {
    id: "b1-handoff-service-recovery",
    level: "B1",
    focus: "service_recovery",
    title_en: "Hand off a service-recovery path",
    title_vi: "Bàn giao lộ trình phục hồi dịch vụ",
    scenario_en:
      "A service conversation needs a polite reset path that another person can continue.",
    scenario_vi:
      "Cuộc trò chuyện dịch vụ cần lộ trình đặt lại lịch sự để người khác có thể tiếp tục.",
    canadaContext:
      "Useful for Canadian service counters, phone lines, and support chats.",
    handoffPack: {
      finalHandoffPrompt_en:
        "Keep the request clear, the tone polite, and the next step visible.",
      finalHandoffPrompt_vi:
        "Giữ yêu cầu rõ, giọng lịch sự và bước tiếp theo rõ ràng.",
      handoffLine: {
        pa: "ਮੈਂ ਸੇਵਾ ਵਾਲੀ ਗੱਲ ਨੂੰ ਸਾਫ਼ ਅਤੇ ਸ਼ਾਂਤ ਤਰੀਕੇ ਨਾਲ ਜਾਰੀ ਰੱਖਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization:
          "main seva vali gall nu saf ate shant tarike nal jari rakhna chahunda han.",
        en: "I want to continue the service conversation clearly and calmly.",
        vi: "Tôi muốn tiếp tục cuộc trò chuyện dịch vụ một cách rõ và bình tĩnh.",
      },
      handoffSignals_en: [
        "Keeps the request stable",
        "Avoids escalation",
        "Supports a calm continuation",
      ],
      handoffSignals_vi: [
        "Giữ yêu cầu ổn định",
        "Tránh leo thang",
        "Hỗ trợ tiếp tục bình tĩnh",
      ],
    },
    commonTraps: [
      {
        trap_en: "Changing the issue before the first one is solved.",
        trap_vi: "Đổi vấn đề trước khi vấn đề đầu được giải quyết.",
        better: {
          pa: "ਪਹਿਲੀ ਬੇਨਤੀ ਹੀ ਸਪਸ਼ਟ ਰੱਖੀਏ।",
          romanization: "pehli benti hi spasht rakhiye.",
          en: "Let's keep the first request clear.",
          vi: "Hãy giữ yêu cầu đầu tiên thật rõ.",
        },
      },
    ],
    finalReadiness_en:
      "language practice only, not medical advice. Shahmukhi is awareness only, not a full course. Ready for final-handoff checks when the reset stays polite and repeatable.",
    finalReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Shahmukhi chỉ để nhận biết, không phải một khóa đầy đủ. Sẵn sàng cho kiểm tra bàn giao cuối khi phần đặt lại lịch sự và lặp lại được.",
    integrationRoute_en:
      "Route to B2 service problem-solving if the recovery remains stable.",
    integrationRoute_vi:
      "Chuyển sang giải quyết vấn đề dịch vụ B2 nếu phần phục hồi vẫn ổn định.",
  },
  {
    id: "b1-handoff-issue-resolution",
    level: "B1",
    focus: "issue_resolution",
    title_en: "Hand off an issue-resolution path",
    title_vi: "Bàn giao lộ trình giải quyết vấn đề",
    scenario_en:
      "You need to pass along an issue, the correction, and the next step together.",
    scenario_vi:
      "Bạn cần chuyển tiếp vấn đề, phần sửa và bước tiếp theo cùng nhau.",
    canadaContext:
      "Useful for Canadian billing desks, office support, and community services.",
    handoffPack: {
      finalHandoffPrompt_en:
        "Keep facts, correction, and next step together.",
      finalHandoffPrompt_vi:
        "Giữ факт, phần sửa và bước tiếp theo đi cùng nhau.",
      handoffLine: {
        pa: "ਮੈਨੂੰ ਮੁੱਦਾ, ਸੁਧਾਰ, ਅਤੇ ਅਗਲਾ ਕਦਮ ਇਕੱਠੇ ਚਾਹੀਦੇ ਹਨ।",
        romanization:
          "mainu mudda, sudhar, ate agla kadam ikathe chahide han.",
        en: "I need the issue, the correction, and the next step together.",
        vi: "Tôi cần vấn đề, phần sửa và bước tiếp theo đi cùng nhau.",
      },
      handoffSignals_en: [
        "Links issue and correction",
        "Keeps a practical order",
        "Supports a final check",
      ],
      handoffSignals_vi: [
        "Nối vấn đề với phần sửa",
        "Giữ thứ tự thực tế",
        "Hỗ trợ kiểm tra cuối",
      ],
    },
    commonTraps: [
      {
        trap_en: "Forgetting to verify whether the correction worked.",
        trap_vi: "Quên kiểm tra xem phần sửa đã hiệu quả chưa.",
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
    id: "b1-handoff-follow-up-message",
    level: "B1",
    focus: "follow_up_message",
    title_en: "Hand off a follow-up message",
    title_vi: "Bàn giao tin nhắn theo dõi",
    scenario_en:
      "You want to follow up by text or email without losing the earlier request.",
    scenario_vi:
      "Bạn muốn theo dõi bằng tin nhắn hoặc email mà không mất yêu cầu trước đó.",
    canadaContext:
      "Useful for Canadian email, portal, and text follow-ups with offices or landlords.",
    handoffPack: {
      finalHandoffPrompt_en:
        "Mention the earlier request and ask for one clear update.",
      finalHandoffPrompt_vi:
        "Nhắc yêu cầu trước và hỏi một cập nhật rõ ràng.",
      handoffLine: {
        pa: "ਮੈਂ ਪਿਛਲੀ ਬੇਨਤੀ ਬਾਰੇ ਇੱਕ ਛੋਟਾ ਅਪਡੇਟ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization:
          "main pichhli benti bare ik chota update chahunda han.",
        en: "I want a short update about my previous request.",
        vi: "Tôi muốn một cập nhật ngắn về yêu cầu trước đó.",
      },
      handoffSignals_en: [
        "Refers to the earlier request",
        "Stays brief",
        "Asks for one update",
      ],
      handoffSignals_vi: [
        "Nhắc yêu cầu trước",
        "Giữ ngắn",
        "Hỏi một cập nhật",
      ],
    },
    commonTraps: [
      {
        trap_en: "Writing a brand-new message instead of following up.",
        trap_vi: "Viết tin nhắn mới hoàn toàn thay vì theo dõi.",
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
    id: "b1-handoff-conversation-repair",
    level: "B1",
    focus: "conversation_repair",
    title_en: "Hand off a conversation-repair path",
    title_vi: "Bàn giao lộ trình sửa cuộc trò chuyện",
    scenario_en:
      "A conversation went off track and you need a handoff line that restarts it calmly.",
    scenario_vi:
      "Cuộc trò chuyện bị lệch hướng và bạn cần câu bàn giao để khởi động lại bình tĩnh.",
    canadaContext:
      "Useful for Canadian service desks, workplaces, housing offices, and community counters.",
    handoffPack: {
      finalHandoffPrompt_en:
        "Restart the same topic and keep the tone calm.",
      finalHandoffPrompt_vi:
        "Khởi động lại cùng chủ đề và giữ giọng bình tĩnh.",
      handoffLine: {
        pa: "ਮੈਂ ਗੱਲ ਨੂੰ ਮੁੜ ਸਾਫ਼ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization: "main gall nu mudh saf karna chahunda han.",
        en: "I want to clarify the conversation again.",
        vi: "Tôi muốn làm rõ lại cuộc trò chuyện.",
      },
      handoffSignals_en: [
        "Restarts the same topic",
        "Keeps the tone calm",
        "Supports a stable retry",
      ],
      handoffSignals_vi: [
        "Khởi động lại cùng chủ đề",
        "Giữ giọng bình tĩnh",
        "Hỗ trợ thử lại ổn định",
      ],
    },
    commonTraps: [
      {
        trap_en: "Treating a reset like a new topic.",
        trap_vi: "Xem việc đặt lại như chủ đề mới.",
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
      "Route to B2 conversation-repair and retelling tasks if the reset stays stable.",
    integrationRoute_vi:
      "Chuyển sang nhiệm vụ sửa cuộc trò chuyện và kể lại B2 nếu phần đặt lại ổn định.",
  },
  {
    id: "b1-handoff-workplace-task",
    level: "B1",
    focus: "workplace_task",
    title_en: "Hand off a workplace task",
    title_vi: "Bàn giao nhiệm vụ nơi làm việc",
    scenario_en:
      "You need to pass along work instructions, shift details, and responsibility clearly.",
    scenario_vi:
      "Bạn cần chuyển tiếp hướng dẫn công việc, chi tiết ca làm và trách nhiệm thật rõ.",
    canadaContext:
      "Useful for Canadian retail, warehouse, hospitality, and office shifts.",
    handoffPack: {
      finalHandoffPrompt_en:
        "Keep task, time, and responsibility aligned in the handoff.",
      finalHandoffPrompt_vi:
        "Giữ nhiệm vụ, thời gian và trách nhiệm khớp nhau khi bàn giao.",
      handoffLine: {
        pa: "ਮੈਨੂੰ ਕੰਮ, ਸਮਾਂ, ਅਤੇ ਜ਼ਿੰਮੇਵਾਰੀ ਸਪਸ਼ਟ ਚਾਹੀਦੀ ਹੈ।",
        romanization:
          "mainu kamm, sama, ate zimmedari spasht chahidi hai.",
        en: "I need the task, time, and responsibility to be clear.",
        vi: "Tôi cần nhiệm vụ, thời gian và trách nhiệm thật rõ.",
      },
      handoffSignals_en: [
        "Names the task",
        "Confirms the time",
        "Clarifies responsibility",
      ],
      handoffSignals_vi: [
        "Nêu nhiệm vụ",
        "Xác nhận thời gian",
        "Làm rõ trách nhiệm",
      ],
    },
    commonTraps: [
      {
        trap_en: "Changing the task description after the handoff begins.",
        trap_vi: "Đổi mô tả nhiệm vụ sau khi bàn giao bắt đầu.",
        better: {
          pa: "ਮੈਂ ਉਹੀ ਕੰਮ ਮੁੜ ਸਪਸ਼ਟ ਕਰ ਰਿਹਾ ਹਾਂ।",
          romanization: "main ohi kamm mudh spasht kar riha han.",
          en: "I am clarifying the same task again.",
          vi: "Tôi đang làm rõ lại cùng một nhiệm vụ.",
        },
      },
    ],
    finalReadiness_en:
      "language practice only, not legal or financial advice. Final readiness is ready when the workplace handoff stays stable and easy to verify.",
    finalReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Sẵn sàng cuối khi phần bàn giao nơi làm việc ổn định và dễ xác minh.",
    integrationRoute_en:
      "Route to B2 workplace update and shift-management tasks when the task flow is stable.",
    integrationRoute_vi:
      "Chuyển sang nhiệm vụ cập nhật nơi làm việc và quản lý ca B2 khi luồng việc ổn định.",
  },
  {
    id: "b1-handoff-housing-task",
    level: "B1",
    focus: "housing_task",
    title_en: "Hand off a housing-task path",
    title_vi: "Bàn giao lộ trình nhiệm vụ nhà ở",
    scenario_en:
      "You need a clean handoff for repair follow-up, landlord messages, or boundary-setting.",
    scenario_vi:
      "Bạn cần bàn giao gọn cho theo dõi sửa chữa, tin nhắn với chủ nhà hoặc đặt ranh giới.",
    canadaContext:
      "Useful for Canadian rental offices, tenant support, and building management.",
    handoffPack: {
      finalHandoffPrompt_en:
        "Keep the repair facts and timing consistent in the handoff.",
      finalHandoffPrompt_vi:
        "Giữ факт sửa chữa và thời gian nhất quán khi bàn giao.",
      handoffLine: {
        pa: "ਮੁਰੰਮਤ, ਸਮਾਂ, ਅਤੇ ਅਪਡੇਟ ਇਕੋ ਜਿਹੇ ਰਹਿਣੇ ਚਾਹੀਦੇ ਹਨ।",
        romanization:
          "murammat, sama, ate update iko jehe rehnhe chahide han.",
        en: "The repair, time, and update should stay consistent.",
        vi: "Việc sửa chữa, thời gian và cập nhật nên nhất quán.",
      },
      handoffSignals_en: [
        "Keeps repair facts stable",
        "Tracks the timing",
        "Supports a calm boundary",
      ],
      handoffSignals_vi: [
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
      "Language practice only, not medical advice. Final readiness is ready when the housing handoff is factual, calm, and easy to reuse.",
    finalReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn y tế. Sẵn sàng cuối khi phần bàn giao nhà ở mang tính факт, bình tĩnh và dễ tái dùng.",
    integrationRoute_en:
      "Route to B2 housing follow-up tasks if the repair thread remains stable.",
    integrationRoute_vi:
      "Chuyển sang nhiệm vụ theo dõi nhà ở B2 nếu mạch sửa chữa vẫn ổn định.",
  },
  {
    id: "b1-handoff-school-community-task",
    level: "B1",
    focus: "school_community_task",
    title_en: "Hand off a school/community task",
    title_vi: "Bàn giao nhiệm vụ trường học/cộng đồng",
    scenario_en:
      "You need a brief handoff for school-office or community-centre follow-up messages.",
    scenario_vi:
      "Bạn cần bàn giao ngắn cho tin nhắn theo dõi ở văn phòng trường hoặc trung tâm cộng đồng.",
    canadaContext:
      "Useful for Canadian school offices, community centres, and newcomer programs.",
    handoffPack: {
      finalHandoffPrompt_en:
        "Keep the earlier request and the next step aligned.",
      finalHandoffPrompt_vi:
        "Giữ yêu cầu trước và bước tiếp theo khớp nhau.",
      handoffLine: {
        pa: "ਮੈਂ ਆਪਣੀ ਪਿਛਲੀ ਬੇਨਤੀ ਨੂੰ ਸਪਸ਼ਟ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization:
          "main apni pichhli benti nu spasht karna chahunda han.",
        en: "I want to clarify my previous request.",
        vi: "Tôi muốn làm rõ yêu cầu trước đó.",
      },
      handoffSignals_en: [
        "Refers to the earlier request",
        "Keeps the ask simple",
        "Supports follow-through",
      ],
      handoffSignals_vi: [
        "Nhắc yêu cầu trước",
        "Giữ yêu cầu đơn giản",
        "Hỗ trợ theo dõi đến cùng",
      ],
    },
    commonTraps: [
      {
        trap_en: "Making the message longer than the task needs.",
        trap_vi: "Làm tin nhắn dài hơn mức nhiệm vụ cần.",
        better: {
          pa: "ਛੋਟੀ ਗੱਲ ਬਿਹਤਰ ਹੈ।",
          romanization: "choti gall behatar hai.",
          en: "Short is better.",
          vi: "Ngắn là tốt hơn.",
        },
      },
    ],
    finalReadiness_en:
      "language practice only, not legal or financial advice. Native review is deferred. Final readiness is ready when the school/community handoff stays polite and stable.",
    finalReadiness_vi:
      "Chỉ luyện ngôn ngữ, không phải tư vấn pháp lý hoặc tài chính. Đánh giá bản ngữ được hoãn lại. Sẵn sàng cuối khi phần bàn giao trường học/cộng đồng lịch sự và ổn định.",
    integrationRoute_en:
      "Route to B2 school/community participation tasks if the request remains aligned.",
    integrationRoute_vi:
      "Chuyển sang nhiệm vụ tham gia trường học/cộng đồng B2 nếu yêu cầu vẫn khớp.",
  },
  {
    id: "b1-handoff-register-safe-repair",
    level: "B1",
    focus: "register_safe_repair",
    title_en: "Hand off a register-safe repair",
    title_vi: "Bàn giao cách sửa sắc thái an toàn",
    scenario_en:
      "You need to soften a message without losing the meaning or the next step.",
    scenario_vi:
      "Bạn cần làm mềm thông điệp mà không mất ý nghĩa hoặc bước tiếp theo.",
    canadaContext:
      "Useful for Canadian service, workplace, and housing conversations that need a polite reset.",
    handoffPack: {
      finalHandoffPrompt_en:
        "Keep the meaning and soften the tone in the same line.",
      finalHandoffPrompt_vi:
        "Giữ ý nghĩa và làm mềm giọng trong cùng một câu.",
      handoffLine: {
        pa: "ਮੈਂ ਇਹ ਗੱਲ ਹੋਰ ਨਰਮ ਅਤੇ ਹੋਰ ਸਪਸ਼ਟ ਤਰੀਕੇ ਨਾਲ ਕਹਿਣੀ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization:
          "main eh gall hor narm ate hor spasht tarike nal kahini chahunda han.",
        en: "I want to say this more softly and more clearly.",
        vi: "Tôi muốn nói điều này mềm hơn và rõ hơn.",
      },
      handoffSignals_en: [
        "Softens the tone",
        "Keeps the meaning",
        "Signals a polite reset",
      ],
      handoffSignals_vi: [
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
