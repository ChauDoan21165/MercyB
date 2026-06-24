// src/languages/punjabi/scriptVocabularyExitTickets.ts
//
// Punjabi script and vocabulary exit tickets for Vietnamese-speaking and
// English-speaking learners. Gurmukhi is primary; romanization is a bridge.
// Shahmukhi is awareness only, not a full course. Native review is deferred.
// No pronunciation scoring, audio, or integration claims.

export type PunjabiScriptVocabularyExitTicketArea =
  | "gurmukhi_recognition"
  | "vowel_signs"
  | "addak_tippi_bindi"
  | "survival_signage"
  | "service_words"
  | "thematic_vocabulary"
  | "high_frequency_verbs"
  | "collocations"
  | "romanization_bridge_reduction"
  | "shahmukhi_awareness";

export type PunjabiScriptVocabularyExitTicketUse =
  | "exit_ticket"
  | "final_proof"
  | "final_qa";

export type PunjabiScriptVocabularyExitTicketItem = {
  id: string;
  area: PunjabiScriptVocabularyExitTicketArea;
  use: PunjabiScriptVocabularyExitTicketUse;
  gurmukhi: string;
  romanization?: string;
  prompt_vi: string;
  prompt_en: string;
  answer_vi: string;
  answer_en: string;
  success_vi: string;
  success_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  finalProof?: boolean;
  finalQA?: boolean;
};

export type PunjabiScriptVocabularyExitTicketSection = {
  area: PunjabiScriptVocabularyExitTicketArea;
  title_vi: string;
  title_en: string;
  exitGoal_vi: string;
  exitGoal_en: string;
  items: ReadonlyArray<PunjabiScriptVocabularyExitTicketItem>;
};

export const PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKETS_SCOPE = {
  vi: "Bộ exit ticket này kiểm tra nhận diện Gurmukhi, dấu nguyên âm, addak/tippi/bindi, biển sinh tồn, từ dịch vụ, từ vựng theo chủ đề, động từ tần suất cao, collocation và giảm lệ thuộc vào romanization. Không có chấm điểm phát âm hay integration. Shahmukhi chỉ là nhận biết, không phải khóa Shahmukhi đầy đủ. Native review được hoãn.",
  en: "This exit-ticket set checks Gurmukhi recognition, vowel signs, addak/tippi/bindi, survival signage, service words, thematic vocabulary, high-frequency verbs, collocations, and reducing reliance on romanization. No pronunciation scoring or integration claims. Shahmukhi is awareness only, not a full Shahmukhi course. Native review is deferred.",
  noAudioScoringOrIntegration: true,
} as const;

const sections: ReadonlyArray<PunjabiScriptVocabularyExitTicketSection> = [
  {
    area: "gurmukhi_recognition",
    title_vi: "Exit ticket chữ Gurmukhi",
    title_en: "Gurmukhi Recognition Exit Ticket",
    exitGoal_vi: "Nhận ra chữ và cặp dễ nhầm mà không cần đoán từ Latin.",
    exitGoal_en: "Recognize letters and confusing pairs without guessing from Latin.",
    items: [
      {
        id: "pa-exit-gurmukhi-001",
        area: "gurmukhi_recognition",
        use: "exit_ticket",
        gurmukhi: "ਕ / ਖ",
        romanization: "k / kh",
        prompt_vi: "Chữ nào là bật hơi trong cặp này?",
        prompt_en: "Which letter in this pair is aspirated?",
        answer_vi: "ਖ là kh bật hơi; ਕ là k không bật hơi.",
        answer_en: "ਖ is aspirated kh; ਕ is unaspirated k.",
        success_vi: "Đạt nếu chọn bằng hình chữ Gurmukhi, không tách kh thành hai chữ.",
        success_en: "Pass if chosen by Gurmukhi shape, not by splitting kh into two letters.",
        learnerTrap: {
          vi: "kh trong romanization không phải hai chữ riêng.",
          en: "kh in romanization is not two separate letters.",
        },
      },
      {
        id: "pa-exit-gurmukhi-002",
        area: "gurmukhi_recognition",
        use: "final_qa",
        gurmukhi: "ਤ / ਟ",
        romanization: "t / tt",
        prompt_vi: "Giải thích khác biệt giữa hai chữ này.",
        prompt_en: "Explain the difference between these two letters.",
        answer_vi: "ਤ là t răng; ਟ là t quặt lưỡi.",
        answer_en: "ਤ is dental t; ਟ is retroflex t.",
        success_vi: "Đạt nếu phân biệt được hình chữ mà không dựa vào một chữ t Latin.",
        success_en: "Pass if the learner distinguishes them by script shape rather than one Latin t.",
        learnerTrap: {
          vi: "Latin t che mất khác biệt quan trọng.",
          en: "A single Latin t hides the important difference.",
        },
      },
    ],
  },
  {
    area: "vowel_signs",
    title_vi: "Exit ticket dấu nguyên âm",
    title_en: "Vowel Sign Exit Ticket",
    exitGoal_vi: "Đọc đúng dấu nguyên âm thường gặp trong âm tiết ngắn.",
    exitGoal_en: "Read common vowel signs correctly in short syllables.",
    items: [
      {
        id: "pa-exit-vowel-001",
        area: "vowel_signs",
        use: "exit_ticket",
        gurmukhi: "ਕਿ / ਕੀ",
        romanization: "ki / kii",
        prompt_vi: "Dấu nào viết trước nhưng đọc sau phụ âm?",
        prompt_en: "Which sign is written before but read after the consonant?",
        answer_vi: "Dấu ਿ trong ਕਿ viết trước nhưng đọc sau ਕ.",
        answer_en: "The ਿ sign in ਕਿ is written before but read after ਕ.",
        success_vi: "Đạt nếu không đảo thứ tự đọc.",
        success_en: "Pass if the reading order is not reversed.",
        learnerTrap: {
          vi: "Dấu ਿ dễ làm người học đọc ngược.",
          en: "The ਿ sign can make learners read in reverse order.",
        },
      },
      {
        id: "pa-exit-vowel-002",
        area: "vowel_signs",
        use: "final_proof",
        gurmukhi: "ਕੇ / ਕੈ / ਕੌ",
        romanization: "ke / kai / kau",
        prompt_vi: "Bạn đọc ba dấu e, ai/ae và au thế nào?",
        prompt_en: "How do you read the three signs e, ai/ae, and au?",
        answer_vi: "ਕੇ là ke, ਕੈ là kai/ae, và ਕੌ là kau.",
        answer_en: "ਕੇ is ke, ਕੈ is kai/ae, and ਕੌ is kau.",
        success_vi: "Đạt nếu không lẫn ba dấu này với nhau.",
        success_en: "Pass if the three signs are not mixed up.",
        learnerTrap: {
          vi: "ai/ae có thể thay đổi theo nguồn romanization.",
          en: "ai/ae can vary by romanization source.",
        },
        finalProof: true,
      },
    ],
  },
  {
    area: "addak_tippi_bindi",
    title_vi: "Exit ticket addak, tippi, bindi",
    title_en: "Addak, Tippi, Bindi Exit Ticket",
    exitGoal_vi: "Nhận ra dấu phụ nhỏ nhưng quan trọng trong từ quen thuộc.",
    exitGoal_en: "Recognize small but important marks in familiar words.",
    items: [
      {
        id: "pa-exit-mark-001",
        area: "addak_tippi_bindi",
        use: "exit_ticket",
        gurmukhi: "ਬੱਸ ਅੱਡਾ",
        romanization: "bus adda",
        prompt_vi: "Tìm addak trong cụm giao thông này.",
        prompt_en: "Find the addak in this transport phrase.",
        answer_vi: "Addak ੱ nằm trong ਬੱਸ và ਅੱਡਾ.",
        answer_en: "The addak ੱ appears in both ਬੱਸ and ਅੱਡਾ.",
        success_vi: "Đạt nếu chỉ ra dấu nhỏ này khi đọc nhanh.",
        success_en: "Pass if the small mark is identified during quick reading.",
        learnerTrap: {
          vi: "Bỏ addak làm từ nhìn quen nhưng đọc thiếu.",
          en: "Skipping addak makes the word look familiar but incomplete.",
        },
        canadaPractical: true,
      },
      {
        id: "pa-exit-mark-002",
        area: "addak_tippi_bindi",
        use: "final_qa",
        gurmukhi: "ਮਾਂ",
        romanization: "maan",
        prompt_vi: "Dấu nào báo mũi hóa trong từ này?",
        prompt_en: "Which mark signals nasalization here?",
        answer_vi: "Dấu bindi ਂ ở trên báo mũi hóa trong ਮਾਂ.",
        answer_en: "The bindi ਂ above marks nasalization in ਮਾਂ.",
        success_vi: "Đạt nếu nhận ra dấu trên chữ mà không đoán bằng Latin.",
        success_en: "Pass if the upper mark is recognized without guessing from Latin.",
        finalQA: true,
      },
    ],
  },
  {
    area: "survival_signage",
    title_vi: "Exit ticket biển sinh tồn",
    title_en: "Survival Signage Exit Ticket",
    exitGoal_vi: "Đọc biển thực tế ở Canada và chọn hành động đúng.",
    exitGoal_en: "Read real Canadian signs and choose the right action.",
    items: [
      {
        id: "pa-exit-sign-001",
        area: "survival_signage",
        use: "final_proof",
        gurmukhi: "ਐਮਰਜੈਂਸੀ",
        romanization: "emergency",
        prompt_vi: "Bạn làm gì khi thấy biển này ở bệnh viện?",
        prompt_en: "What do you do when you see this sign in a hospital?",
        answer_vi: "Hiểu đây là cấp cứu và tìm trợ giúp khẩn cấp ngay.",
        answer_en: "Understand this as emergency and seek urgent help right away.",
        success_vi: "Đạt nếu liên hệ đúng với tình huống khẩn.",
        success_en: "Pass if it is matched to an urgent situation.",
        canadaPractical: true,
        finalProof: true,
      },
      {
        id: "pa-exit-sign-002",
        area: "survival_signage",
        use: "exit_ticket",
        gurmukhi: "ਨਿਕਾਸ",
        romanization: "nikaas",
        prompt_vi: "Biển này chỉ gì?",
        prompt_en: "What does this sign indicate?",
        answer_vi: "ਨਿਕਾਸ nghĩa là lối ra.",
        answer_en: "ਨਿਕਾਸ means exit.",
        success_vi: "Đạt nếu bạn chọn hành động đi theo lối ra.",
        success_en: "Pass if you choose the action of following the exit.",
        canadaPractical: true,
      },
    ],
  },
  {
    area: "service_words",
    title_vi: "Exit ticket từ dịch vụ",
    title_en: "Service Words Exit Ticket",
    exitGoal_vi: "Nhận ra từ dùng ở quầy, biển và nơi cần phục vụ nhanh.",
    exitGoal_en: "Recognize words used at counters, signs, and fast-service places.",
    items: [
      {
        id: "pa-exit-service-001",
        area: "service_words",
        use: "exit_ticket",
        gurmukhi: "ਫਾਰਮੇਸੀ",
        romanization: "pharmacy/farmacy",
        prompt_vi: "Từ này chỉ nơi nào?",
        prompt_en: "What place does this word point to?",
        answer_vi: "ਫਾਰਮੇਸੀ là nhà thuốc.",
        answer_en: "ਫਾਰਮੇਸੀ means pharmacy.",
        success_vi: "Đạt nếu bạn đọc được từ dịch vụ này trong Gurmukhi.",
        success_en: "Pass if the service word is read in Gurmukhi.",
        learnerTrap: {
          vi: "Đừng chỉ nhìn English pharmacy mà bỏ qua chữ ਪੰਜਾਬੀ.",
          en: "Do not only look at English pharmacy and skip the Punjabi script.",
        },
        canadaPractical: true,
      },
      {
        id: "pa-exit-service-002",
        area: "service_words",
        use: "final_qa",
        gurmukhi: "ਫਾਰਮ",
        romanization: "form",
        prompt_vi: "Từ này hữu ích khi nào ở Canada?",
        prompt_en: "When is this word useful in Canada?",
        answer_vi: "Dùng khi cần điền mẫu đơn hoặc nói về form.",
        answer_en: "Use it when you need to fill out or discuss a form.",
        success_vi: "Đạt nếu liên hệ đúng với quầy dịch vụ hoặc giấy tờ.",
        success_en: "Pass if it is linked to service desks or paperwork.",
        canadaPractical: true,
        finalQA: true,
      },
    ],
  },
  {
    area: "thematic_vocabulary",
    title_vi: "Exit ticket từ vựng theo chủ đề",
    title_en: "Thematic Vocabulary Exit Ticket",
    exitGoal_vi: "Gắn từ vào chủ đề sống còn: sức khỏe, nhà ở và tiền.",
    exitGoal_en: "Attach words to survival themes: health, housing, and money.",
    items: [
      {
        id: "pa-exit-theme-001",
        area: "thematic_vocabulary",
        use: "exit_ticket",
        gurmukhi: "ਦਵਾਈ",
        romanization: "davai",
        prompt_vi: "Từ này thuộc chủ đề nào?",
        prompt_en: "Which theme does this word belong to?",
        answer_vi: "ਦਵਾਈ là thuốc, thuộc chủ đề sức khỏe.",
        answer_en: "ਦਵਾਈ is medicine, in the health theme.",
        success_vi: "Đạt nếu nối từ với phòng khám hoặc nhà thuốc.",
        success_en: "Pass if the word is linked to clinic or pharmacy use.",
        canadaPractical: true,
      },
      {
        id: "pa-exit-theme-002",
        area: "thematic_vocabulary",
        use: "final_proof",
        gurmukhi: "ਕਿਰਾਇਆ",
        romanization: "kiraya",
        prompt_vi: "Từ này thuộc nhóm nào?",
        prompt_en: "Which group does this word belong to?",
        answer_vi: "ਕਿਰਾਇਆ là tiền thuê, thuộc nhà ở và tiền.",
        answer_en: "ਕਿਰਾਇਆ means rent, in housing and money.",
        success_vi: "Đạt nếu bạn hiểu đây là từ nhà ở, không phải y tế.",
        success_en: "Pass if this is understood as housing, not health.",
        canadaPractical: true,
        finalProof: true,
      },
    ],
  },
  {
    area: "high_frequency_verbs",
    title_vi: "Exit ticket động từ tần suất cao",
    title_en: "High-Frequency Verbs Exit Ticket",
    exitGoal_vi: "Nhận ra động từ lõi trong cụm dịch vụ và câu ngắn.",
    exitGoal_en: "Recognize core verbs inside service chunks and short sentences.",
    items: [
      {
        id: "pa-exit-verb-001",
        area: "high_frequency_verbs",
        use: "exit_ticket",
        gurmukhi: "ਕਰਨਾ",
        romanization: "karna",
        prompt_vi: "Động từ này thường ghép với loại từ nào?",
        prompt_en: "What kind of word does this verb usually combine with?",
        answer_vi: "ਕਰਨਾ nghĩa là làm và thường ghép với danh từ.",
        answer_en: "ਕਰਨਾ means do/make and usually combines with nouns.",
        success_vi: "Đạt nếu bạn đọc được vai trò hành động của nó.",
        success_en: "Pass if the action role is recognized.",
      },
      {
        id: "pa-exit-verb-002",
        area: "high_frequency_verbs",
        use: "final_qa",
        gurmukhi: "ਲੈਣਾ",
        romanization: "laina",
        prompt_vi: "Trong câu đặt lịch, ਲੈਣਾ có thể giúp tạo nghĩa gì?",
        prompt_en: "In appointment booking, what meaning can ਲੈਣਾ help form?",
        answer_vi: "Nó giúp tạo nghĩa đặt hoặc lấy lịch hẹn.",
        answer_en: "It helps form the meaning of booking or taking an appointment.",
        success_vi: "Đạt nếu nối được với tình huống phòng khám.",
        success_en: "Pass if linked to the clinic context.",
        canadaPractical: true,
        finalQA: true,
      },
    ],
  },
  {
    area: "collocations",
    title_vi: "Exit ticket collocation",
    title_en: "Collocation Exit Ticket",
    exitGoal_vi: "Đọc cụm tự nhiên thay vì dịch từng từ rời.",
    exitGoal_en: "Read natural chunks instead of translating word by word.",
    items: [
      {
        id: "pa-exit-collocation-001",
        area: "collocations",
        use: "exit_ticket",
        gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ",
        romanization: "mainu madad chahidi hai",
        prompt_vi: "Bạn dùng câu này khi nào?",
        prompt_en: "When do you use this sentence?",
        answer_vi: "Dùng khi cần giúp đỡ.",
        answer_en: "Use it when help is needed.",
        success_vi: "Đạt nếu dùng cả câu, không chỉ một từ.",
        success_en: "Pass if the whole sentence is used, not just one word.",
        canadaPractical: true,
      },
      {
        id: "pa-exit-collocation-002",
        area: "collocations",
        use: "final_proof",
        gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰਨਾ",
        romanization: "galti theek karna",
        prompt_vi: "Cụm này giải quyết việc gì?",
        prompt_en: "What does this phrase help you do?",
        answer_vi: "Nó nghĩa là sửa lỗi.",
        answer_en: "It means to correct a mistake.",
        success_vi: "Đạt nếu bạn chú ý chữ ਠ trong ਠੀਕ.",
        success_en: "Pass if the letter ਠ in ਠੀਕ is noticed.",
        learnerTrap: {
          vi: "ਠ không phải th tiếng Anh.",
          en: "ਠ is not English th.",
        },
        canadaPractical: true,
        finalProof: true,
      },
    ],
  },
  {
    area: "romanization_bridge_reduction",
    title_vi: "Exit ticket giảm lệ thuộc romanization",
    title_en: "Romanization Bridge Reduction Exit Ticket",
    exitGoal_vi: "Dùng Latin để tìm đường, nhưng chốt bằng Gurmukhi.",
    exitGoal_en: "Use Latin to get started, but finish with Gurmukhi.",
    items: [
      {
        id: "pa-exit-roman-001",
        area: "romanization_bridge_reduction",
        use: "exit_ticket",
        gurmukhi: "ਫਲ",
        romanization: "phal/fal",
        prompt_vi: "Nếu thấy phal hoặc fal, bạn chốt bằng chữ nào?",
        prompt_en: "If you see phal or fal, what script form do you confirm?",
        answer_vi: "Chốt bằng ਫਲ.",
        answer_en: "Confirm with ਫਲ.",
        success_vi: "Đạt nếu không dừng ở Latin.",
        success_en: "Pass if the learner does not stop at Latin.",
        learnerTrap: {
          vi: "Phal/fal chỉ là cầu nối, không phải đáp án cuối.",
          en: "Phal/fal is only a bridge, not the final answer.",
        },
      },
      {
        id: "pa-exit-roman-002",
        area: "romanization_bridge_reduction",
        use: "final_qa",
        gurmukhi: "ਸ਼ਹਿਰ",
        romanization: "shahir/shehar",
        prompt_vi: "Bạn xác nhận kết quả tìm kiếm bằng gì?",
        prompt_en: "How do you confirm the search result?",
        answer_vi: "Xác nhận bằng ਸ਼ਹਿਰ.",
        answer_en: "Confirm with ਸ਼ਹਿਰ.",
        success_vi: "Đạt nếu Gurmukhi là đáp án cuối.",
        success_en: "Pass if Gurmukhi is the final answer.",
        learnerTrap: {
          vi: "Romanization khác nhau không luôn đổi nghĩa.",
          en: "Different romanization does not always change meaning.",
        },
        finalQA: true,
      },
    ],
  },
  {
    area: "shahmukhi_awareness",
    title_vi: "Exit ticket nhận biết Shahmukhi",
    title_en: "Shahmukhi Awareness Exit Ticket",
    exitGoal_vi: "Giữ đúng phạm vi: Gurmukhi là chính, Shahmukhi chỉ để biết có hệ chữ khác.",
    exitGoal_en: "Keep scope clear: Gurmukhi is primary and Shahmukhi is only awareness.",
    items: [
      {
        id: "pa-exit-shahmukhi-001",
        area: "shahmukhi_awareness",
        use: "final_qa",
        gurmukhi: "ਗੁਰਮੁਖੀ ਵਿੱਚ ਪੜ੍ਹੋ",
        romanization: "gurmukhi vich parho",
        prompt_vi: "Bộ này có dạy Shahmukhi đầy đủ không?",
        prompt_en: "Does this set teach full Shahmukhi?",
        answer_vi: "Không. Gurmukhi là chính; Shahmukhi chỉ là nhận biết.",
        answer_en: "No. Gurmukhi is primary; Shahmukhi is awareness only.",
        success_vi: "Đạt nếu người học nêu đúng phạm vi.",
        success_en: "Pass if the learner states the scope correctly.",
        finalQA: true,
      },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKETS = sections;

export const PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKET_ITEMS: ReadonlyArray<PunjabiScriptVocabularyExitTicketItem> =
  sections.flatMap((section) => section.items);

export const punjabiScriptVocabularyExitTickets = PUNJABI_SCRIPT_VOCABULARY_EXIT_TICKETS;

export default punjabiScriptVocabularyExitTickets;
