// src/languages/punjabi/scriptRomanizationBoundaryChecks.ts
//
// Punjabi script and romanization boundary checks.
// Native review is deferred.

export type PunjabiBoundaryFocus =
  | "gurmukhi_primary"
  | "romanization_bridge"
  | "vowel_sign_boundary"
  | "small_mark_boundary"
  | "survival_signage"
  | "service_vocabulary"
  | "shahmukhi_awareness"
  | "stability_regression";

export type PunjabiBoundaryCheckType = "boundary" | "checklist" | "regression" | "export";

export type PunjabiScriptRomanizationBoundaryCheck = {
  id: string;
  focus: PunjabiBoundaryFocus;
  type: PunjabiBoundaryCheckType;
  gurmukhi: string;
  romanization?: string;
  boundary_vi: string;
  boundary_en: string;
  acceptable_vi: string;
  acceptable_en: string;
  repair_vi: string;
  repair_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  finalStability?: boolean;
  regression?: boolean;
};

export type PunjabiBoundarySection = {
  focus: PunjabiBoundaryFocus;
  title_vi: string;
  title_en: string;
  goal_vi: string;
  goal_en: string;
  checks: ReadonlyArray<PunjabiScriptRomanizationBoundaryCheck>;
};

export const PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_SCOPE = {
  vi: "Bộ boundary check này giữ Gurmukhi là chính, dùng romanization như cầu tạm thời, kiểm tra dấu nguyên âm, addak/tippi/bindi, biển sinh tồn, từ dịch vụ và phạm vi Shahmukhi awareness. Native review được hoãn.",
  en: "This boundary check set keeps Gurmukhi primary, uses romanization as a temporary bridge, checks vowel signs, addak/tippi/bindi, survival signs, service words, and Shahmukhi awareness scope. Native review is deferred.",
  noExternalIntegration: true,
} as const;

const sections: ReadonlyArray<PunjabiBoundarySection> = [
  {
    focus: "gurmukhi_primary",
    title_vi: "Ranh giới Gurmukhi chính",
    title_en: "Gurmukhi-Primary Boundary",
    goal_vi: "Bảo đảm chữ Gurmukhi luôn là dữ liệu chính trước mọi dạng Latin phụ trợ.",
    goal_en: "Ensure Gurmukhi script is always the primary data before any supporting Latin form.",
    checks: [
      { id: "pa-boundary-gurmukhi-001", focus: "gurmukhi_primary", type: "boundary", gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "gurmukhi", boundary_vi: "Nếu mục học có romanization, trường Gurmukhi vẫn phải là trường chính.", boundary_en: "If an item has romanization, the Gurmukhi field must still be primary.", acceptable_vi: "Người học thấy ਗੁਰਮੁਖੀ trước khi thấy gurmukhi.", acceptable_en: "Learners see ਗੁਰਮੁਖੀ before seeing gurmukhi.", repair_vi: "Đưa chữ Gurmukhi lên đầu và đổi Latin thành hint phụ.", repair_en: "Move Gurmukhi first and change Latin text into a supporting hint.", learnerTrap: { vi: "Latin-first làm người học bỏ qua chữ thật.", en: "Latin-first order makes learners skip the real script." }, finalStability: true },
      { id: "pa-boundary-gurmukhi-002", focus: "gurmukhi_primary", type: "checklist", gurmukhi: "ਪੰਜਾਬੀ", romanization: "panjabi/punjabi", boundary_vi: "Tên Punjabi trong dữ liệu phải có ਪੰਜਾਬੀ, không chỉ Punjabi bằng Latin.", boundary_en: "Punjabi as a data label must include ਪੰਜਾਬੀ, not only Latin Punjabi.", acceptable_vi: "Có Gurmukhi, romanization khi cần, Vietnamese và English explanation.", acceptable_en: "Includes Gurmukhi, romanization when useful, Vietnamese and English explanation.", repair_vi: "Bổ sung ਪੰਜਾਬੀ vào trường chính rồi giữ Punjabi làm phụ.", repair_en: "Add ਪੰਜਾਬੀ to the primary field and keep Punjabi as secondary.", learnerTrap: { vi: "Punjabi bằng Latin không cho thấy tippi.", en: "Latin Punjabi does not show tippi." }, finalStability: true },
      { id: "pa-boundary-gurmukhi-003", focus: "gurmukhi_primary", type: "export", gurmukhi: "ਪੜ੍ਹੋ", romanization: "parho", boundary_vi: "Prompt đọc phải yêu cầu nhìn chữ Gurmukhi trước khi xem cầu Latin.", boundary_en: "Reading prompts must ask learners to inspect Gurmukhi before the Latin bridge.", acceptable_vi: "Prompt bắt đầu bằng việc đọc ਪੜ੍ਹੋ hoặc từ Gurmukhi liên quan.", acceptable_en: "The prompt starts by reading ਪੜ੍ਹੋ or a related Gurmukhi word.", repair_vi: "Đổi prompt Latin-first thành Gurmukhi-first trong checklist export.", repair_en: "Change Latin-first prompts into Gurmukhi-first prompts in the export checklist.", finalStability: true, regression: true },
    ],
  },
  {
    focus: "romanization_bridge",
    title_vi: "Ranh giới cầu romanization",
    title_en: "Romanization Bridge Boundary",
    goal_vi: "Giữ romanization hữu ích nhưng không để nó thay thế chữ Punjabi.",
    goal_en: "Keep romanization useful without letting it replace Punjabi script.",
    checks: [
      { id: "pa-boundary-roman-001", focus: "romanization_bridge", type: "regression", gurmukhi: "ਫਲ", romanization: "phal/fal", boundary_vi: "phal/fal chỉ là cầu đọc, không phải dạng chính của mục.", boundary_en: "phal/fal is only a reading bridge, not the main form of the item.", acceptable_vi: "Bài có lượt cuối chỉ hiện ਫਲ.", acceptable_en: "The final round shows only ਫਲ.", repair_vi: "Thêm bước ẩn romanization sau lần hướng dẫn đầu.", repair_en: "Add a step that hides romanization after the first guided round.", learnerTrap: { vi: "ph/f thay đổi theo nguồn; chữ ਫ là điểm neo.", en: "ph/f varies by source; ਫ is the anchor." }, finalStability: true, regression: true },
      { id: "pa-boundary-roman-002", focus: "romanization_bridge", type: "boundary", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", boundary_vi: "Biến thể v/w không được tạo hai nghĩa hoặc hai entry rời.", boundary_en: "v/w variants must not create two meanings or two separate entries.", acceptable_vi: "vadda và wadda cùng trỏ về ਵੱਡਾ.", acceptable_en: "vadda and wadda both point to ਵੱਡਾ.", repair_vi: "Gộp biến thể Latin và ghi rõ Gurmukhi là chuẩn hiển thị.", repair_en: "Merge Latin variants and state that Gurmukhi is the display standard.", learnerTrap: { vi: "Hai spelling Latin không luôn là hai từ.", en: "Two Latin spellings are not always two words." }, regression: true },
      { id: "pa-boundary-roman-003", focus: "romanization_bridge", type: "checklist", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", boundary_vi: "shahir/shehar không được thay thế nhận diện chữ ਸ਼.", boundary_en: "shahir/shehar must not replace recognition of ਸ਼.", acceptable_vi: "Người học đọc ਸ਼ਹਿਰ trước rồi mới xem biến thể Latin.", acceptable_en: "Learners read ਸ਼ਹਿਰ first, then see Latin variants.", repair_vi: "Đảo thứ tự hiển thị và thêm trap về dấu dưới.", repair_en: "Reverse the display order and add a trap about the lower mark.", learnerTrap: { vi: "Dấu dưới nhỏ nhưng phân biệt ਸ਼ với ਸ.", en: "The small lower mark separates ਸ਼ from ਸ." }, finalStability: true },
    ],
  },
  {
    focus: "vowel_sign_boundary",
    title_vi: "Ranh giới dấu nguyên âm",
    title_en: "Vowel-Sign Boundary",
    goal_vi: "Chặn lỗi dùng romanization làm mất dấu nguyên âm hoặc thứ tự đọc.",
    goal_en: "Block errors where romanization hides vowel signs or reading order.",
    checks: [
      { id: "pa-boundary-vowel-001", focus: "vowel_sign_boundary", type: "boundary", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / kii", boundary_vi: "Cặp i ngắn/dài phải giải thích bằng dấu Gurmukhi, không chỉ ki/kii.", boundary_en: "The short/long i pair must be explained through Gurmukhi signs, not only ki/kii.", acceptable_vi: "Có ghi chú ਿ viết trước nhưng đọc sau phụ âm.", acceptable_en: "Includes the note that ਿ is written before but read after the consonant.", repair_vi: "Thêm ví dụ Gurmukhi và cảnh báo không đọc theo thứ tự mắt nhìn.", repair_en: "Add a Gurmukhi example and warn against reading in visual order.", learnerTrap: { vi: "ਕਿ dễ bị đọc sai nếu nhìn vị trí dấu.", en: "ਕਿ is easy to misread from sign position." }, finalStability: true },
      { id: "pa-boundary-vowel-002", focus: "vowel_sign_boundary", type: "checklist", gurmukhi: "ਕੁ / ਕੂ", romanization: "ku / kuu", boundary_vi: "Cặp u ngắn/dài phải chỉ rõ ੁ và ੂ dưới phụ âm.", boundary_en: "The short/long u pair must point out ੁ and ੂ under the consonant.", acceptable_vi: "Người học phân biệt dấu trước khi đọc nhanh.", acceptable_en: "Learners distinguish the signs before fast reading.", repair_vi: "Thêm checklist so sánh hai dấu dưới chữ.", repair_en: "Add a checklist comparing the two under-letter signs.", regression: true },
      { id: "pa-boundary-vowel-003", focus: "vowel_sign_boundary", type: "export", gurmukhi: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", boundary_vi: "e, ai/ae và au phải được kiểm trước khi dùng trong biển hiệu.", boundary_en: "e, ai/ae, and au must be checked before signage use.", acceptable_vi: "Bài export có ba dạng và tiêu chí không đổi dấu.", acceptable_en: "The export item includes all three forms and a no-swap criterion.", repair_vi: "Thêm regression ngắn cho ba dấu trước phần signage.", repair_en: "Add a short regression for these three signs before signage.", finalStability: true, regression: true },
    ],
  },
  {
    focus: "small_mark_boundary",
    title_vi: "Ranh giới addak, tippi, bindi",
    title_en: "Addak, Tippi, Bindi Boundary",
    goal_vi: "Giữ dấu nhỏ trong dữ liệu vì chúng là tín hiệu đọc và nhận diện.",
    goal_en: "Keep small marks in data because they are reading and recognition signals.",
    checks: [
      { id: "pa-boundary-mark-001", focus: "small_mark_boundary", type: "boundary", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", boundary_vi: "Dữ liệu giao thông không được bỏ addak trong ਬੱਸ hoặc ਅੱਡਾ.", boundary_en: "Transit data must not drop addak in ਬੱਸ or ਅੱਡਾ.", acceptable_vi: "Cả hai từ giữ ੱ và có explanation về addak.", acceptable_en: "Both words keep ੱ and include an addak explanation.", repair_vi: "Sửa chữ và thêm trap rằng addak nhỏ không phải trang trí.", repair_en: "Correct the script and add a trap that small addak is not decoration.", learnerTrap: { vi: "Bỏ addak làm yếu kỹ năng đọc biển thật.", en: "Dropping addak weakens real sign reading." }, canadaPractical: true, finalStability: true },
      { id: "pa-boundary-mark-002", focus: "small_mark_boundary", type: "regression", gurmukhi: "ਮਾਂ / ਪੰਜਾਬ", romanization: "maan / panjab", boundary_vi: "Bindi và tippi cần được phân biệt bằng vị trí dấu trên chữ.", boundary_en: "Bindi and tippi need to be separated by mark placement in script.", acceptable_vi: "Mục nêu ਂ trong ਮਾਂ và ੰ trong ਪੰਜਾਬ.", acceptable_en: "The item names ਂ in ਮਾਂ and ੰ in ਪੰਜਾਬ.", repair_vi: "Tách ví dụ hoặc thêm nhãn rõ cho từng dấu.", repair_en: "Split examples or add clear labels for each mark.", learnerTrap: { vi: "Latin không hiển thị vị trí dấu đủ rõ.", en: "Latin text does not show mark placement clearly." }, regression: true },
      { id: "pa-boundary-mark-003", focus: "small_mark_boundary", type: "checklist", gurmukhi: "ਪੰਜਾਬ", romanization: "panjab/punjab", boundary_vi: "Tên Punjab/Punjabi không được làm mất awareness về tippi trong ਪੰਜਾਬ.", boundary_en: "Punjab/Punjabi labels must not lose awareness of tippi in ਪੰਜਾਬ.", acceptable_vi: "Có ਪੰਜਾਬ trong Gurmukhi và ghi chú tippi ngắn.", acceptable_en: "Includes ਪੰਜਾਬ in Gurmukhi and a short tippi note.", repair_vi: "Thêm ਪੰਜਾਬ cạnh dạng Latin để giữ ranh giới script.", repair_en: "Add ਪੰਜਾਬ beside the Latin form to keep the script boundary.", finalStability: true },
    ],
  },
  {
    focus: "survival_signage",
    title_vi: "Biển sinh tồn",
    title_en: "Survival Signage",
    goal_vi: "Giữ biển thực tế, ngắn và gắn với hành động ở Canada.",
    goal_en: "Keep signs practical, short, and tied to actions in Canada.",
    checks: [
      { id: "pa-boundary-sign-001", focus: "survival_signage", type: "export", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", boundary_vi: "Biển lối ra cần hành động rõ, không chỉ gloss bằng English.", boundary_en: "The exit sign needs a clear action, not only an English gloss.", acceptable_vi: "Người học biết đi theo biển để tìm lối ra.", acceptable_en: "Learners know to follow the sign to find the exit.", repair_vi: "Thêm Canada-practical action vào checklist.", repair_en: "Add a Canada-practical action to the checklist.", canadaPractical: true, finalStability: true },
      { id: "pa-boundary-sign-002", focus: "survival_signage", type: "checklist", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", boundary_vi: "Từ emergency vay mượn vẫn phải giữ nhận diện Gurmukhi.", boundary_en: "The emergency loanword still must keep Gurmukhi recognition.", acceptable_vi: "Có tình huống bệnh viện hoặc clinic và chữ ਐਮਰਜੈਂਸੀ.", acceptable_en: "Includes a hospital or clinic context and ਐਮਰਜੈਂਸੀ.", repair_vi: "Đặt chữ Gurmukhi trước nghĩa quen trong English.", repair_en: "Place Gurmukhi before the familiar English meaning.", canadaPractical: true },
      { id: "pa-boundary-sign-003", focus: "survival_signage", type: "regression", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", boundary_vi: "pharmacy/farmacy không được thay thế việc đọc ਫਾਰਮੇਸੀ.", boundary_en: "pharmacy/farmacy must not replace reading ਫਾਰਮੇਸੀ.", acceptable_vi: "Bài yêu cầu nhận ra ਫ trước khi dựa vào từ mượn.", acceptable_en: "The item asks learners to recognize ਫ before relying on the loanword.", repair_vi: "Thêm bước script-first cho biển nhà thuốc.", repair_en: "Add a script-first step for the pharmacy sign.", learnerTrap: { vi: "Từ mượn quen dễ làm đọc lướt chữ.", en: "A familiar loanword can make learners skim the script." }, canadaPractical: true, regression: true },
    ],
  },
  {
    focus: "service_vocabulary",
    title_vi: "Từ dịch vụ",
    title_en: "Service Vocabulary",
    goal_vi: "Kiểm ranh giới giữa từ vay mượn, romanization và chữ dịch vụ thật.",
    goal_en: "Check the boundary between loanwords, romanization, and real service script.",
    checks: [
      { id: "pa-boundary-service-001", focus: "service_vocabulary", type: "checklist", gurmukhi: "ਦਵਾਈ", romanization: "davai", boundary_vi: "Từ thuốc phải có chữ Gurmukhi và ngữ cảnh pharmacy hoặc clinic.", boundary_en: "Medicine vocabulary must have Gurmukhi script and pharmacy or clinic context.", acceptable_vi: "Có ਦਵਾਈ, nghĩa thuốc, và ví dụ hỏi dịch vụ.", acceptable_en: "Includes ਦਵਾਈ, medicine meaning, and a service request example.", repair_vi: "Thêm context hỏi thuốc ở Canada bằng giải thích ngắn.", repair_en: "Add a Canadian medicine-request context with a short explanation.", canadaPractical: true },
      { id: "pa-boundary-service-002", focus: "service_vocabulary", type: "export", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", boundary_vi: "Từ tiền thuê phải liên kết với form nhà ở hoặc tin thuê nhà.", boundary_en: "Rent vocabulary must link to a housing form or rental notice.", acceptable_vi: "Có ਕਿਰਾਇਆ và nghĩa tiền thuê trong bối cảnh nhà ở.", acceptable_en: "Includes ਕਿਰਾਇਆ and rent meaning in housing context.", repair_vi: "Thêm ví dụ housing form để tránh học từ rời.", repair_en: "Add a housing-form example to avoid isolated vocabulary.", canadaPractical: true, finalStability: true },
      { id: "pa-boundary-service-003", focus: "service_vocabulary", type: "regression", gurmukhi: "ਸਕੂਲ", romanization: "school/skul", boundary_vi: "Loanword school/skul phải được đọc bằng Gurmukhi trong dữ liệu.", boundary_en: "The school/skul loanword must be read through Gurmukhi in data.", acceptable_vi: "Có ਸਕੂਲ ở trường chính và English chỉ là meaning phụ.", acceptable_en: "Keeps ਸਕੂਲ in the primary field and English as secondary meaning.", repair_vi: "Đưa ਸਕੂਲ vào trường chính nếu mục chỉ có school.", repair_en: "Move ਸਕੂਲ into the primary field if the item only has school.", learnerTrap: { vi: "Từ quen ở trường học Canada vẫn cần đọc script.", en: "A familiar Canadian school word still needs script reading." }, canadaPractical: true, regression: true },
    ],
  },
  {
    focus: "shahmukhi_awareness",
    title_vi: "Ranh giới Shahmukhi awareness",
    title_en: "Shahmukhi Awareness Boundary",
    goal_vi: "Nhắc phạm vi Shahmukhi mà không biến bài này thành khóa Shahmukhi.",
    goal_en: "Mark Shahmukhi scope without turning this into a Shahmukhi course.",
    checks: [
      { id: "pa-boundary-shahmukhi-001", focus: "shahmukhi_awareness", type: "boundary", gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "gurmukhi", boundary_vi: "Mọi nhắc tới Shahmukhi phải nói rõ Gurmukhi là hệ chính của bộ này.", boundary_en: "Every Shahmukhi mention must state that Gurmukhi is primary in this set.", acceptable_vi: "Shahmukhi chỉ là awareness, không phải khóa đầy đủ.", acceptable_en: "Shahmukhi is awareness only, not a full course.", repair_vi: "Rút nội dung Shahmukhi sâu thành một ghi chú phạm vi.", repair_en: "Reduce deep Shahmukhi content to a scope note.", finalStability: true },
    ],
  },
  {
    focus: "stability_regression",
    title_vi: "Ổn định và regression",
    title_en: "Stability and Regression",
    goal_vi: "Đóng gói checklist cuối để dữ liệu ổn định và xuất được trong app.",
    goal_en: "Package final checklist items so the data remains stable and app-ready.",
    checks: [
      { id: "pa-boundary-stability-001", focus: "stability_regression", type: "export", gurmukhi: "ਅੰਤਿਮ ਹੱਦ", romanization: "antim hadd", boundary_vi: "Mỗi check phải có id, focus, type, Gurmukhi, VI/EN và repair rõ.", boundary_en: "Every check needs id, focus, type, Gurmukhi, VI/EN text, and a clear repair.", acceptable_vi: "Dữ liệu là TypeScript consumable, không phải notes rời.", acceptable_en: "Data is consumable TypeScript, not loose notes.", repair_vi: "Bổ sung trường thiếu trước khi export.", repair_en: "Add missing fields before export.", finalStability: true, regression: true },
      { id: "pa-boundary-stability-002", focus: "stability_regression", type: "regression", gurmukhi: "ਮੁੜ ਜਾਂਚ", romanization: "mur jaanch", boundary_vi: "Regression phải bắt lỗi Latin-first, dấu thiếu và nội dung vượt phạm vi.", boundary_en: "Regression must catch Latin-first order, missing marks, and scope drift.", acceptable_vi: "Checklist giữ Gurmukhi chính, song ngữ rõ, và phạm vi Punjabi script/vocabulary.", acceptable_en: "Checklist keeps Gurmukhi primary, bilingual text clear, and Punjabi script/vocabulary scope.", repair_vi: "Sửa mục sai phạm vi thay vì mở rộng sang chủ đề khác.", repair_en: "Repair out-of-scope items instead of expanding into other topics.", finalStability: true, regression: true },
    ],
  },
];

export const PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_CHECKS = sections;

export const PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_CHECK_ITEMS: ReadonlyArray<PunjabiScriptRomanizationBoundaryCheck> =
  sections.flatMap((section) => section.checks);

export default PUNJABI_SCRIPT_ROMANIZATION_BOUNDARY_CHECKS;
