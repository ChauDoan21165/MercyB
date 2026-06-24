// Punjabi C1 professional correspondence pack for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught as a
// separate course here. Native review is deferred.
//
// Text data only: no audio, pronunciation scoring, Azure, auth, billing, RLS,
// Supabase, CI config, or unrelated integrations.

export type PunjabiProfessionalCorrespondenceType =
  | "formal_request"
  | "follow_up"
  | "complaint"
  | "clarification"
  | "summary"
  | "recommendation"
  | "respectful_disagreement"
  | "public_service_frame"
  | "professional_service_frame";

export type PunjabiCorrespondenceRoute = "review" | "remediation" | "readiness";

export type PunjabiCorrespondencePhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiProfessionalCorrespondenceC1 = {
  id: string;
  level: "C1";
  type: PunjabiProfessionalCorrespondenceType;
  route: PunjabiCorrespondenceRoute;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  writing_goal_vi: string;
  writing_goal_en: string;
  register_note_vi: string;
  register_note_en: string;
  frames: readonly PunjabiCorrespondencePhrase[];
  navigation_note_vi: string;
  navigation_note_en: string;
  canada_example: PunjabiCorrespondencePhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const professionalCorrespondenceScriptAwareness = {
  vi: "Khóa này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết truyền thống chữ viết Punjabi khác, không phải một khóa học đầy đủ.",
  en: "This course uses Gurmukhi as the primary script. Shahmukhi is mentioned only for awareness of another Punjabi writing tradition, not as a full course.",
} as const;

const professionalCorrespondenceSourcesC1: PunjabiProfessionalCorrespondenceC1[] = [
  {
    id: "pa_c1_pc_formal_request_meeting",
    level: "C1",
    type: "formal_request",
    route: "review",
    title_pa: "ਰਸਮੀ ਮਿਲਣ ਦੀ ਬੇਨਤੀ",
    title_rom: "rasmi milan di benati",
    title_vi: "Yêu cầu gặp mặt trang trọng",
    title_en: "Formal meeting request",
    writing_goal_vi: "Xin lịch gặp với mục đích, bối cảnh, và thời gian đề xuất rõ.",
    writing_goal_en: "Request a meeting with clear purpose, context, and proposed time.",
    register_note_vi: "Lịch sự, trực tiếp vừa đủ; dùng ਜੀ và ਕਿਰਪਾ ਕਰਕੇ khi phù hợp.",
    register_note_en: "Polite and sufficiently direct; use ਜੀ and ਕਿਰਪਾ ਕਰਕੇ where appropriate.",
    frames: [
      {
        pa: "ਮੈਂ ... ਬਾਰੇ ਮਿਲਣ ਦਾ ਸਮਾਂ ਮੰਗਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।",
        rom: "main ... bare milan da sama mangna chahunda/chahundi han.",
        vi: "Tôi muốn xin lịch gặp về...",
        en: "I would like to request a meeting about...",
      },
      {
        pa: "ਜੇ ਤੁਹਾਨੂੰ ਸੁਵਿਧਾ ਹੋਵੇ, ਤਾਂ ... ਸਮਾਂ ਠੀਕ ਰਹੇਗਾ।",
        rom: "je tuhanu suvidha hove, tan ... sama thik rahega.",
        vi: "Nếu thuận tiện cho thầy/cô/anh/chị, thời gian... sẽ phù hợp.",
        en: "If convenient for you, ... would work well.",
      },
      {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਕੀ ਇਹ ਸਮਾਂ ਤੁਹਾਡੇ ਲਈ ਠੀਕ ਹੈ।",
        rom: "kirpa karke dasso ki ki ih sama tuhade lai thik hai.",
        vi: "Xin vui lòng cho biết thời gian này có phù hợp không.",
        en: "Please let me know whether this time works for you.",
      },
    ],
    navigation_note_vi: "Dùng khi mục tiêu chính là xin action rõ, không phải giải thích dài.",
    navigation_note_en: "Use when the main goal is a clear requested action, not a long explanation.",
    canada_example: {
      context_vi: "Xin gặp cố vấn học tập tại Canada.",
      context_en: "Requesting a meeting with an academic advisor in Canada.",
      pa: "ਮੈਂ ਕੈਨੇਡਾ ਵਿੱਚ ਆਪਣੇ ਕੋਰਸ ਚੋਣ ਬਾਰੇ ਮਿਲਣ ਦਾ ਸਮਾਂ ਮੰਗਣਾ ਚਾਹੁੰਦੀ ਹਾਂ।",
      rom: "main Canada vich apne course chon bare milan da sama mangna chahundi han.",
      vi: "Tôi muốn xin lịch gặp về việc chọn môn học của mình tại Canada.",
      en: "I would like to request a meeting about my course selection in Canada.",
    },
    learner_traps_vi: ["Đừng mở email quá dài trước khi nêu request.", "Không quên đề xuất thời gian hoặc action cụ thể."],
    learner_traps_en: ["Do not open with a long explanation before the request.", "Do not forget to propose a time or specific action."],
  },
  {
    id: "pa_c1_pc_follow_up_status",
    level: "C1",
    type: "follow_up",
    route: "readiness",
    title_pa: "ਸਥਿਤੀ ਬਾਰੇ ਫਾਲੋ-ਅਪ",
    title_rom: "sthiti bare follow-up",
    title_vi: "Theo dõi tình trạng",
    title_en: "Status follow-up",
    writing_goal_vi: "Theo dõi lịch sự sau khi đã gửi yêu cầu hoặc hồ sơ.",
    writing_goal_en: "Follow up politely after a request or application has already been sent.",
    register_note_vi: "Nhẹ nhàng, có mốc thời gian, tránh gây áp lực quá mức.",
    register_note_en: "Gentle, with a timeline, avoiding excessive pressure.",
    frames: [
      {
        pa: "ਮੈਂ ... ਨੂੰ ਭੇਜੀ ਆਪਣੀ ਬੇਨਤੀ ਬਾਰੇ ਨਿਮਰ ਫਾਲੋ-ਅਪ ਕਰ ਰਿਹਾ/ਰਹੀ ਹਾਂ।",
        rom: "main ... nu bheji apni benati bare nimar follow-up kar riha/rahi han.",
        vi: "Tôi xin phép theo dõi yêu cầu đã gửi vào...",
        en: "I am politely following up on my request sent on...",
      },
      {
        pa: "ਜੇ ਕੋਈ ਹੋਰ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੋਵੇ, ਮੈਂ ਭੇਜ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।",
        rom: "je koi hor jankari chahidi hove, main bhej sakda/sakdi han.",
        vi: "Nếu cần thêm thông tin, tôi có thể gửi.",
        en: "If any further information is needed, I can send it.",
      },
      {
        pa: "ਤੁਹਾਡੇ ਸਮੇਂ ਅਤੇ ਸਹਾਇਤਾ ਲਈ ਧੰਨਵਾਦ।",
        rom: "tuhade same ate sahaita lai dhanvaad.",
        vi: "Cảm ơn thời gian và sự hỗ trợ của anh/chị.",
        en: "Thank you for your time and assistance.",
      },
    ],
    navigation_note_vi: "Dùng khi đã có email trước đó; nhắc context ngắn rồi hỏi tình trạng.",
    navigation_note_en: "Use when there is a previous email; briefly remind context and ask for status.",
    canada_example: {
      context_vi: "Theo dõi hồ sơ dịch vụ tại Canada.",
      context_en: "Following up on a service file in Canada.",
      pa: "ਮੈਂ ਕੈਨੇਡਾ ਵਿੱਚ ਆਪਣੀ ਅਰਜ਼ੀ ਦੀ ਸਥਿਤੀ ਬਾਰੇ ਨਿਮਰ ਫਾਲੋ-ਅਪ ਕਰ ਰਹੀ ਹਾਂ।",
      rom: "main Canada vich apni arzi di sthiti bare nimar follow-up kar rahi han.",
      vi: "Tôi xin phép theo dõi tình trạng hồ sơ của mình tại Canada.",
      en: "I am politely following up on the status of my application in Canada.",
    },
    learner_traps_vi: ["Đừng viết như lần đầu nếu đây là follow-up.", "Không dùng giọng đòi hỏi nếu chưa quá hạn rõ."],
    learner_traps_en: ["Do not write as if this is the first contact.", "Avoid demanding tone if there is no clear overdue deadline."],
  },
  {
    id: "pa_c1_pc_complaint_service",
    level: "C1",
    type: "complaint",
    route: "remediation",
    title_pa: "ਸੇਵਾ ਬਾਰੇ ਪੇਸ਼ਾਵਰ ਸ਼ਿਕਾਇਤ",
    title_rom: "seva bare peshavar shikayat",
    title_vi: "Khiếu nại dịch vụ chuyên nghiệp",
    title_en: "Professional service complaint",
    writing_goal_vi: "Nêu vấn đề, evidence, impact, và resolution mong muốn mà vẫn giữ tone chuyên nghiệp.",
    writing_goal_en: "State problem, evidence, impact, and desired resolution while keeping professional tone.",
    register_note_vi: "Chắc chắn nhưng không xúc phạm cá nhân.",
    register_note_en: "Firm but not personally insulting.",
    frames: [
      {
        pa: "ਮੈਂ ... ਸੇਵਾ ਬਾਰੇ ਆਪਣੀ ਚਿੰਤਾ ਦਰਜ ਕਰਵਾਉਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।",
        rom: "main ... seva bare apni chinta darj karvauna chahunda/chahundi han.",
        vi: "Tôi muốn ghi nhận mối quan ngại về dịch vụ...",
        en: "I would like to register my concern about the ... service.",
      },
      {
        pa: "ਸਮੱਸਿਆ ਦਾ ਪ੍ਰਭਾਵ ਇਹ ਹੋਇਆ ਕਿ ...",
        rom: "samasya da prabhav ih hoia ki ...",
        vi: "Tác động của vấn đề là...",
        en: "The impact of the problem was that...",
      },
      {
        pa: "ਮੈਂ ਬੇਨਤੀ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿ ਇਸ ਮਾਮਲੇ ਦੀ ਸਮੀਖਿਆ ਕੀਤੀ ਜਾਵੇ।",
        rom: "main benati karda/kardi han ki is mamle di samikhia kiti jave.",
        vi: "Tôi đề nghị vấn đề này được xem xét.",
        en: "I request that this matter be reviewed.",
      },
    ],
    navigation_note_vi: "Dùng khi cần correction hoặc review, không chỉ clarification.",
    navigation_note_en: "Use when correction or review is needed, not only clarification.",
    canada_example: {
      context_vi: "Khiếu nại về dịch vụ nhà ở sinh viên tại Canada.",
      context_en: "Complaint about student housing service in Canada.",
      pa: "ਮੈਂ ਕੈਨੇਡਾ ਵਿੱਚ ਵਿਦਿਆਰਥੀ ਨਿਵਾਸ ਸੇਵਾ ਬਾਰੇ ਆਪਣੀ ਚਿੰਤਾ ਦਰਜ ਕਰਵਾਉਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
      rom: "main Canada vich vidyarthi nivas seva bare apni chinta darj karvauna chahunda han.",
      vi: "Tôi muốn ghi nhận quan ngại về dịch vụ ký túc xá sinh viên tại Canada.",
      en: "I would like to register my concern about student residence service in Canada.",
    },
    learner_traps_vi: ["Đừng chỉ phàn nàn; hãy nói resolution mong muốn.", "Tránh lời đe dọa nếu mục tiêu là xử lý hành chính."],
    learner_traps_en: ["Do not only complain; state the resolution you want.", "Avoid threatening language when the goal is administrative handling."],
  },
  {
    id: "pa_c1_pc_clarification_notice",
    level: "C1",
    type: "clarification",
    route: "review",
    title_pa: "ਨੋਟਿਸ ਬਾਰੇ ਸਪਸ਼ਟੀਕਰਨ",
    title_rom: "notice bare spashtikaran",
    title_vi: "Làm rõ thông báo",
    title_en: "Clarifying a notice",
    writing_goal_vi: "Tóm tắt hiểu biết của mình rồi hỏi một câu cụ thể.",
    writing_goal_en: "Summarize your understanding and ask one specific question.",
    register_note_vi: "Trung lập; không biến clarification thành complaint nếu chưa cần.",
    register_note_en: "Neutral; do not turn clarification into a complaint unless needed.",
    frames: [
      {
        pa: "ਨੋਟਿਸ ਦੇ ਅਨੁਸਾਰ, ...",
        rom: "notice de anusaar, ...",
        vi: "Theo thông báo,...",
        en: "According to the notice,...",
      },
      {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਸਪਸ਼ਟ ਕਰੋ ਕਿ ...",
        rom: "kirpa karke sapashat karo ki ...",
        vi: "Xin vui lòng làm rõ liệu...",
        en: "Please clarify whether...",
      },
      {
        pa: "ਇਸ ਸਪਸ਼ਟੀਕਰਨ ਨਾਲ ਮੈਂ ਅਗਲਾ ਕਦਮ ਠੀਕ ਤਰੀਕੇ ਨਾਲ ਲੈ ਸਕਾਂਗਾ/ਸਕਾਂਗੀ।",
        rom: "is spashtikaran nal main agla kadam thik tarike nal lai sakanga/sakangi.",
        vi: "Việc làm rõ này sẽ giúp tôi thực hiện bước tiếp theo đúng cách.",
        en: "This clarification will help me take the next step correctly.",
      },
    ],
    navigation_note_vi: "Dùng cho public-service notice hoặc quy trình hành chính chưa rõ.",
    navigation_note_en: "Use for public-service notices or administrative processes that are unclear.",
    canada_example: {
      context_vi: "Hỏi về đăng ký trung tâm cộng đồng tại Canada.",
      context_en: "Asking about community-centre registration in Canada.",
      pa: "ਕਿਰਪਾ ਕਰਕੇ ਸਪਸ਼ਟ ਕਰੋ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਪੁਰਾਣੇ ਭਾਗੀਦਾਰਾਂ ਨੂੰ ਮੁੜ ਅਰਜ਼ੀ ਦੇਣੀ ਪਵੇਗੀ ਜਾਂ ਨਹੀਂ।",
      rom: "kirpa karke sapashat karo ki Canada vich purane bhagidaran nu mur arzi deni pavegi ja nahi.",
      vi: "Xin vui lòng làm rõ liệu tại Canada người tham gia cũ có phải nộp đơn lại hay không.",
      en: "Please clarify whether previous participants in Canada must apply again.",
    },
    learner_traps_vi: ["Đừng hỏi quá nhiều câu trong một email ngắn.", "Không bỏ qua summary của notice trước khi hỏi."],
    learner_traps_en: ["Do not ask too many questions in one short email.", "Do not skip summarizing the notice before asking."],
  },
  {
    id: "pa_c1_pc_summary_update",
    level: "C1",
    type: "summary",
    route: "readiness",
    title_pa: "ਪੇਸ਼ਾਵਰ ਸਾਰ ਅਪਡੇਟ",
    title_rom: "peshavar saar update",
    title_vi: "Update tóm tắt chuyên nghiệp",
    title_en: "Professional summary update",
    writing_goal_vi: "Tóm tắt status, evidence, risk, và next step trong update ngắn.",
    writing_goal_en: "Summarize status, evidence, risk, and next step in a short update.",
    register_note_vi: "Ngắn, có thứ tự, không viết như essay.",
    register_note_en: "Concise, ordered, not essay-like.",
    frames: [
      {
        pa: "ਮੌਜੂਦਾ ਸਥਿਤੀ ਇਹ ਹੈ ਕਿ ...",
        rom: "maujuda sthiti ih hai ki ...",
        vi: "Tình trạng hiện tại là...",
        en: "The current status is that...",
      },
      {
        pa: "ਇੱਕ ਮਹੱਤਵਪੂਰਨ ਜੋਖਮ ਇਹ ਹੈ ਕਿ ...",
        rom: "ikk mahatvapuran jokham ih hai ki ...",
        vi: "Một rủi ro quan trọng là...",
        en: "One important risk is that...",
      },
      {
        pa: "ਅਗਲਾ ਕਦਮ ... ਹੋਵੇਗਾ।",
        rom: "agla kadam ... hovega.",
        vi: "Bước tiếp theo sẽ là...",
        en: "The next step will be...",
      },
    ],
    navigation_note_vi: "Dùng trong email nội bộ hoặc memo ngắn.",
    navigation_note_en: "Use in internal email or a short memo.",
    canada_example: {
      context_vi: "Update nhóm dự án tại Canada.",
      context_en: "Project-team update in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸਾਡੇ ਪ੍ਰੋਜੈਕਟ ਲਈ ਪਹਿਲਾ ਮਸੌਦਾ ਤਿਆਰ ਹੈ, ਪਰ ਅੰਕੜਿਆਂ ਦੀ ਜਾਂਚ ਹਾਲੇ ਬਾਕੀ ਹੈ।",
      rom: "Canada vich sade project lai pahila masoda tiar hai, par ankrian di janch hale baki hai.",
      vi: "Tại Canada, bản nháp đầu cho dự án đã sẵn sàng, nhưng việc kiểm tra số liệu vẫn còn.",
      en: "In Canada, the first project draft is ready, but data checking still remains.",
    },
    learner_traps_vi: ["Đừng kể quá nhiều bối cảnh.", "Không quên next step hoặc owner nếu prompt có."],
    learner_traps_en: ["Do not include too much background.", "Do not forget the next step or owner if the prompt has one."],
  },
  {
    id: "pa_c1_pc_recommendation_action",
    level: "C1",
    type: "recommendation",
    route: "readiness",
    title_pa: "ਕਾਰਵਾਈ ਲਈ ਸਿਫ਼ਾਰਸ਼",
    title_rom: "karvai lai sifarash",
    title_vi: "Khuyến nghị hành động",
    title_en: "Action recommendation",
    writing_goal_vi: "Đưa recommendation có lý do, limitation, và bước tiếp theo.",
    writing_goal_en: "Give a recommendation with reason, limitation, and next step.",
    register_note_vi: "Cân bằng: không ra lệnh, không quá mơ hồ.",
    register_note_en: "Balanced: neither commanding nor too vague.",
    frames: [
      {
        pa: "ਮੇਰੀ ਸਿਫ਼ਾਰਸ਼ ਹੈ ਕਿ ਅਸੀਂ ...",
        rom: "meri sifarash hai ki asin ...",
        vi: "Khuyến nghị của tôi là chúng ta...",
        en: "My recommendation is that we...",
      },
      {
        pa: "ਇਸ ਦਾ ਕਾਰਨ ਇਹ ਹੈ ਕਿ ...",
        rom: "is da karan ih hai ki ...",
        vi: "Lý do là...",
        en: "The reason is that...",
      },
      {
        pa: "ਇੱਕ ਸੀਮਾ ਇਹ ਹੈ ਕਿ ...",
        rom: "ikk sima ih hai ki ...",
        vi: "Một giới hạn là...",
        en: "One limitation is that...",
      },
    ],
    navigation_note_vi: "Dùng sau khi đã có status hoặc evidence; không dùng làm câu mở đầu trống.",
    navigation_note_en: "Use after status or evidence is available; do not use as an empty opening.",
    canada_example: {
      context_vi: "Khuyến nghị cho nhóm dự án tại Canada.",
      context_en: "Recommendation for a project team in Canada.",
      pa: "ਮੇਰੀ ਸਿਫ਼ਾਰਸ਼ ਹੈ ਕਿ ਅਸੀਂ ਕੈਨੇਡਾ ਵਿੱਚ ਪਾਇਲਟ ਪ੍ਰੋਗਰਾਮ ਦੀ ਪਹਿਲਾਂ ਸਮੀਖਿਆ ਕਰੀਏ।",
      rom: "meri sifarash hai ki asin Canada vich pilot program di pahilan samikhia kariye.",
      vi: "Khuyến nghị của tôi là trước tiên chúng ta xem xét chương trình thí điểm tại Canada.",
      en: "My recommendation is that we first review the pilot program in Canada.",
    },
    learner_traps_vi: ["Đừng đưa recommendation không có lý do.", "Không bỏ qua limitation nếu evidence còn hạn chế."],
    learner_traps_en: ["Do not give a recommendation without a reason.", "Do not omit limitation if evidence is limited."],
  },
  {
    id: "pa_c1_pc_respectful_disagreement",
    level: "C1",
    type: "respectful_disagreement",
    route: "remediation",
    title_pa: "ਆਦਰ ਨਾਲ ਅਸਹਿਮਤੀ",
    title_rom: "adar nal asahimati",
    title_vi: "Bất đồng một cách tôn trọng",
    title_en: "Respectful disagreement",
    writing_goal_vi: "Thừa nhận quan điểm khác rồi nêu lý do bất đồng rõ ràng.",
    writing_goal_en: "Acknowledge another view and state the reason for disagreement clearly.",
    register_note_vi: "Không công kích cá nhân; dùng evidence và alternative.",
    register_note_en: "No personal attack; use evidence and an alternative.",
    frames: [
      {
        pa: "ਮੈਂ ਤੁਹਾਡੀ ਚਿੰਤਾ ਨੂੰ ਸਮਝਦਾ/ਸਮਝਦੀ ਹਾਂ, ਪਰ ...",
        rom: "main tuhadi chinta nu samjhda/samjhdi han, par ...",
        vi: "Tôi hiểu mối quan ngại của anh/chị, nhưng...",
        en: "I understand your concern, but...",
      },
      {
        pa: "ਮੇਰੇ ਵਿਚਾਰ ਵਿੱਚ, ਸਬੂਤ ... ਵੱਲ ਇਸ਼ਾਰਾ ਕਰਦਾ ਹੈ।",
        rom: "mere vichar vich, sabut ... vall ishara karda hai.",
        vi: "Theo tôi, evidence chỉ ra...",
        en: "In my view, the evidence points toward...",
      },
      {
        pa: "ਇਸ ਲਈ ਮੈਂ ਇੱਕ ਵੱਖਰਾ ਹੱਲ ਸੁਝਾਉਂਦਾ/ਸੁਝਾਉਂਦੀ ਹਾਂ।",
        rom: "is lai main ikk vakhra hall sujhaounda/sujhaoundi han.",
        vi: "Vì vậy, tôi đề xuất một giải pháp khác.",
        en: "Therefore, I suggest a different solution.",
      },
    ],
    navigation_note_vi: "Dùng trong meeting follow-up, memo, hoặc email khi cần giữ quan hệ làm việc.",
    navigation_note_en: "Use in meeting follow-up, memo, or email when working relationship matters.",
    canada_example: {
      context_vi: "Bất đồng về lịch dự án tại Canada.",
      context_en: "Disagreeing about a project timeline in Canada.",
      pa: "ਮੈਂ ਤੁਹਾਡੀ ਚਿੰਤਾ ਨੂੰ ਸਮਝਦੀ ਹਾਂ, ਪਰ ਕੈਨੇਡਾ ਵਿੱਚ ਇਸ ਸਮਾਂ-ਰੇਖਾ ਲਈ ਹੋਰ ਸਮੀਖਿਆ ਦੀ ਲੋੜ ਹੈ।",
      rom: "main tuhadi chinta nu samjhdi han, par Canada vich is sama-rekha lai hor samikhia di lor hai.",
      vi: "Tôi hiểu mối quan ngại của anh/chị, nhưng tại Canada lịch trình này cần được xem xét thêm.",
      en: "I understand your concern, but in Canada this timeline needs further review.",
    },
    learner_traps_vi: ["Đừng bắt đầu bằng 'you are wrong'.", "Không chỉ bất đồng; hãy đưa alternative."],
    learner_traps_en: ["Do not start with 'you are wrong'.", "Do not only disagree; provide an alternative."],
  },
  {
    id: "pa_c1_pc_public_service_frame",
    level: "C1",
    type: "public_service_frame",
    route: "review",
    title_pa: "ਜਨਤਕ ਸੇਵਾ ਲਈ ਰਸਮੀ ਫਰੇਮ",
    title_rom: "jantak seva lai rasmi frame",
    title_vi: "Khung trang trọng cho dịch vụ công",
    title_en: "Formal frame for public service",
    writing_goal_vi: "Viết phản hồi public-service rõ: context, question, requested next step.",
    writing_goal_en: "Write a clear public-service response: context, question, requested next step.",
    register_note_vi: "Rõ, trung lập, không claim quyền lợi không có trong prompt.",
    register_note_en: "Clear, neutral, without claiming rights not in the prompt.",
    frames: [
      {
        pa: "ਮੈਂ ... ਪ੍ਰਕਿਰਿਆ ਬਾਰੇ ਜਾਣਕਾਰੀ ਲੈਣ ਲਈ ਲਿਖ ਰਿਹਾ/ਰਹੀ ਹਾਂ।",
        rom: "main ... prakiria bare jankari lain lai likh riha/rahi han.",
        vi: "Tôi viết để hỏi thông tin về quy trình...",
        en: "I am writing to ask for information about the ... process.",
      },
      {
        pa: "ਮੇਰੀ ਸਥਿਤੀ ਇਹ ਹੈ ਕਿ ...",
        rom: "meri sthiti ih hai ki ...",
        vi: "Tình trạng của tôi là...",
        en: "My situation is that...",
      },
      {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਅਗਲਾ ਕਦਮ ਕੀ ਹੋਵੇਗਾ।",
        rom: "kirpa karke dasso ki agla kadam ki hovega.",
        vi: "Xin vui lòng cho biết bước tiếp theo sẽ là gì.",
        en: "Please let me know what the next step will be.",
      },
    ],
    navigation_note_vi: "Dùng khi viết cho trường, văn phòng thành phố, hoặc dịch vụ cộng đồng.",
    navigation_note_en: "Use when writing to a school, city office, or community service.",
    canada_example: {
      context_vi: "Hỏi quy trình dịch vụ cộng đồng tại Canada.",
      context_en: "Asking about a community-service process in Canada.",
      pa: "ਮੈਂ ਕੈਨੇਡਾ ਵਿੱਚ ਕਮਿਊਨਿਟੀ ਕੇਂਦਰ ਦੀ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪ੍ਰਕਿਰਿਆ ਬਾਰੇ ਜਾਣਕਾਰੀ ਲੈਣ ਲਈ ਲਿਖ ਰਹੀ ਹਾਂ।",
      rom: "main Canada vich community kendar di registration prakiria bare jankari lain lai likh rahi han.",
      vi: "Tôi viết để hỏi thông tin về quy trình đăng ký trung tâm cộng đồng tại Canada.",
      en: "I am writing to ask for information about the community-centre registration process in Canada.",
    },
    learner_traps_vi: ["Đừng viết quá cảm xúc trong public-service request.", "Không hỏi chung chung nếu cần next step cụ thể."],
    learner_traps_en: ["Do not write too emotionally in a public-service request.", "Do not ask generally if a specific next step is needed."],
  },
  {
    id: "pa_c1_pc_professional_service_frame",
    level: "C1",
    type: "professional_service_frame",
    route: "readiness",
    title_pa: "ਪੇਸ਼ਾਵਰ ਸੇਵਾ ਲਈ ਅਪਡੇਟ ਫਰੇਮ",
    title_rom: "peshavar seva lai update frame",
    title_vi: "Khung update cho dịch vụ chuyên nghiệp",
    title_en: "Update frame for professional service",
    writing_goal_vi: "Viết update dịch vụ chuyên nghiệp có status, risk, recommendation, và next step.",
    writing_goal_en: "Write a professional service update with status, risk, recommendation, and next step.",
    register_note_vi: "Ngắn, có cấu trúc, phù hợp email nội bộ hoặc khách hàng chuyên nghiệp.",
    register_note_en: "Concise and structured, suitable for internal email or professional clients.",
    frames: [
      {
        pa: "ਮੌਜੂਦਾ ਸਥਿਤੀ ਇਹ ਹੈ ਕਿ ...",
        rom: "maujuda sthiti ih hai ki ...",
        vi: "Tình trạng hiện tại là...",
        en: "The current status is that...",
      },
      {
        pa: "ਇੱਕ ਮਹੱਤਵਪੂਰਨ ਸੀਮਾ ਇਹ ਹੈ ਕਿ ...",
        rom: "ikk mahatvapuran sima ih hai ki ...",
        vi: "Một giới hạn quan trọng là...",
        en: "One important limitation is that...",
      },
      {
        pa: "ਮੇਰੀ ਸਿਫ਼ਾਰਸ਼ ਹੈ ਕਿ ਅਗਲਾ ਕਦਮ ... ਹੋਵੇ।",
        rom: "meri sifarash hai ki agla kadam ... hove.",
        vi: "Khuyến nghị của tôi là bước tiếp theo nên là...",
        en: "My recommendation is that the next step should be...",
      },
    ],
    navigation_note_vi: "Dùng khi người đọc cần quyết định nhanh dựa trên status và risk.",
    navigation_note_en: "Use when the reader needs to decide quickly based on status and risk.",
    canada_example: {
      context_vi: "Update dịch vụ chuyên nghiệp trong một nhóm dự án tại Canada.",
      context_en: "Professional service update in a project team in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸੇਵਾ ਰਿਪੋਰਟ ਦਾ ਪਹਿਲਾ ਮਸੌਦਾ ਤਿਆਰ ਹੈ, ਪਰ ਅੰਕੜਿਆਂ ਦੀ ਪੁਸ਼ਟੀ ਅਗਲਾ ਕਦਮ ਹੋਵੇਗੀ।",
      rom: "Canada vich seva report da pahila masoda tiar hai, par ankrian di pushti agla kadam hovegi.",
      vi: "Tại Canada, bản nháp đầu của báo cáo dịch vụ đã sẵn sàng, nhưng bước tiếp theo sẽ là xác minh số liệu.",
      en: "In Canada, the first draft of the service report is ready, but data verification will be the next step.",
    },
    learner_traps_vi: ["Đừng để update thiếu recommendation.", "Đừng trộn nhiều chủ đề không liên quan trong một update ngắn."],
    learner_traps_en: ["Do not leave the update without a recommendation.", "Do not mix unrelated topics in one short update."],
  },
];

export const professionalCorrespondenceC1 = professionalCorrespondenceSourcesC1.map((entry) => ({
  ...entry,
  id: entry.id.replace("pa_c1_pc_", "pa_c1_corr_"),
  correspondence_goal_vi: entry.writing_goal_vi,
  correspondence_goal_en: entry.writing_goal_en,
  writing_frames: entry.frames,
  navigation_label_vi: entry.navigation_note_vi,
  navigation_label_en: entry.navigation_note_en,
  readiness_check_vi: [
    entry.writing_goal_vi,
    entry.register_note_vi,
    entry.navigation_note_vi,
  ],
  readiness_check_en: [
    entry.writing_goal_en,
    entry.register_note_en,
    entry.navigation_note_en,
  ],
  remediation_tip_vi: entry.learner_traps_vi[0] ?? entry.navigation_note_vi,
  remediation_tip_en: entry.learner_traps_en[0] ?? entry.navigation_note_en,
}));
