// src/languages/punjabi/scriptVocabularyArchiveSamples.ts
//
// Punjabi script/vocabulary archive samples for later app integration.
// Native review is deferred.

export type PunjabiArchiveFocus =
  | "gurmukhi_primary"
  | "romanization_bridge"
  | "vowel_signs"
  | "addak_tippi_bindi"
  | "survival_signage"
  | "service_vocabulary"
  | "high_frequency_verbs"
  | "collocations"
  | "shahmukhi_awareness"
  | "archive_closure";

export type PunjabiArchiveStage = "pre_a11_archive" | "signoff" | "seal" | "pre_integration" | "regression";

export type PunjabiScriptVocabularyArchiveSample = {
  cell_id?: string;
  id: string;
  focus: PunjabiArchiveFocus;
  stage: PunjabiArchiveStage;
  gurmukhi: string;
  romanization?: string;
  archive_vi: string;
  archive_en: string;
  expected_vi: string;
  expected_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  archived?: boolean;
};

export const PUNJABI_SCRIPT_VOCABULARY_ARCHIVE_SCOPE = {
  vi: "Archive samples giữ nội dung Punjabi script/vocabulary ở trạng thái pre-A11: Gurmukhi primary, romanization chỉ là bridge, dấu nguyên âm và addak/tippi/bindi được bảo toàn, signage, service words, verbs, collocations và Shahmukhi awareness nằm đúng phạm vi. Đây là TypeScript data app-consumable; native review được hoãn.",
  en: "Archive samples preserve Punjabi script/vocabulary in a pre-A11 state: Gurmukhi is primary, romanization is only a bridge, vowel signs and addak/tippi/bindi are retained, and signage, service words, verbs, collocations, and Shahmukhi awareness stay scoped. This is app-consumable TypeScript data; native review is deferred.",
  archiveDataOnly: true,
} as const;

export const PUNJABI_SCRIPT_VOCABULARY_ARCHIVE_SAMPLES: ReadonlyArray<PunjabiScriptVocabularyArchiveSample> = [
  { id: "pa-archive-gurmukhi-001", focus: "gurmukhi_primary", stage: "pre_a11_archive", gurmukhi: "ਪੰਜਾਬੀ ਲਿਖੋ", romanization: "panjabi likho", archive_vi: "Archive giữ instruction viết bằng Gurmukhi trước mọi Latin bridge.", archive_en: "Archive keeps the write-Punjabi instruction in Gurmukhi before any Latin bridge.", expected_vi: "Người học thấy Gurmukhi là nội dung chính.", expected_en: "Learner sees Gurmukhi as the main content.", archived: true },
  { id: "pa-archive-gurmukhi-002", focus: "gurmukhi_primary", stage: "signoff", gurmukhi: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ", romanization: "gurmukhi pehlaan", archive_vi: "Signoff archive chốt thứ tự Gurmukhi-first trong snapshot.", archive_en: "Signoff archive locks Gurmukhi-first ordering in the snapshot.", expected_vi: "Không đảo sang romanization-first khi import sau.", expected_en: "Does not flip to romanization-first during a later import.", archived: true },
  { id: "pa-archive-roman-001", focus: "romanization_bridge", stage: "seal", gurmukhi: "ਖਾਣਾ", romanization: "khaana/khana", archive_vi: "Seal archive cho variant Latin nhưng không thay thế ਖਾਣਾ.", archive_en: "Seal archive allows Latin variants without replacing ਖਾਣਾ.", expected_vi: "Romanization chỉ hỗ trợ search và nhận diện.", expected_en: "Romanization only supports search and recognition.", learnerTrap: { vi: "Kh trong Latin không phải hai ký tự Gurmukhi.", en: "Latin kh is not two Gurmukhi characters." } },
  { id: "pa-archive-roman-002", focus: "romanization_bridge", stage: "regression", gurmukhi: "ਵਕਤ", romanization: "vakat/wakat", archive_vi: "Regression archive giữ v/w là bridge cho cùng một mục.", archive_en: "Regression archive keeps v/w as bridges for one item.", expected_vi: "Không tạo duplicate vì spelling Latin khác.", expected_en: "Does not create duplicates because Latin spelling differs.", learnerTrap: { vi: "Latin variant không chứng minh nghĩa mới.", en: "A Latin variant does not prove a new meaning." } },
  { id: "pa-archive-vowel-001", focus: "vowel_signs", stage: "pre_integration", gurmukhi: "ਪੁ / ਪੂ", romanization: "pu / puu", archive_vi: "Pre-integration archive giữ ੁ và ੂ tách biệt trong cặp ngắn.", archive_en: "Pre-integration archive keeps ੁ and ੂ distinct in a short pair.", expected_vi: "Không mất độ dài nguyên âm khi đóng gói.", expected_en: "Vowel length is not lost during packaging.", learnerTrap: { vi: "Dấu nhỏ dưới chữ dễ bị bỏ qua.", en: "The below-letter mark is easy to skip." } },
  { id: "pa-archive-vowel-002", focus: "vowel_signs", stage: "seal", gurmukhi: "ਮੇਰਾ / ਮੈਰਾ", romanization: "mera / maira", archive_vi: "Seal archive giữ ੇ và ੈ khác nhau trong từ dễ nhìn nhầm.", archive_en: "Seal archive keeps ੇ and ੈ separate in visually close words.", expected_vi: "Hai dạng không bị gom thành một card.", expected_en: "The two forms are not merged into one card." },
  { id: "pa-archive-smallmark-001", focus: "addak_tippi_bindi", stage: "signoff", gurmukhi: "ਦਿੱਲੀ", romanization: "dilli", archive_vi: "Signoff archive giữ addak trong tên địa danh quen thuộc.", archive_en: "Signoff archive keeps addak in the familiar place name.", expected_vi: "Dấu ੱ không bị coi là trang trí.", expected_en: "The ੱ mark is not treated as decoration.", learnerTrap: { vi: "Loanword quen thuộc vẫn cần dấu Gurmukhi.", en: "A familiar name still needs its Gurmukhi mark." } },
  { id: "pa-archive-smallmark-002", focus: "addak_tippi_bindi", stage: "regression", gurmukhi: "ਕੰਮ ਵਿੱਚ", romanization: "kamm vich", archive_vi: "Regression archive giữ tippi, addak và bindi trong cùng cụm.", archive_en: "Regression archive keeps tippi, addak, and bindi in one chunk.", expected_vi: "Các dấu nhỏ vẫn tồn tại sau snapshot.", expected_en: "Small marks remain after the snapshot.", learnerTrap: { vi: "Romanization không chỉ rõ vị trí từng dấu.", en: "Romanization does not show each mark location." } },
  { id: "pa-archive-sign-001", focus: "survival_signage", stage: "pre_a11_archive", gurmukhi: "ਸਾਵਧਾਨ", romanization: "saavdhan", archive_vi: "Archive biển cảnh báo dùng được trong tòa nhà hoặc transit.", archive_en: "Archive the caution sign for buildings or transit.", expected_vi: "Người học nhận đây là cảnh báo hành động.", expected_en: "Learner recognizes this as an action warning.", canadaPractical: true, archived: true },
  { id: "pa-archive-sign-002", focus: "survival_signage", stage: "seal", gurmukhi: "ਮਦਦ", romanization: "madad", archive_vi: "Seal archive giữ từ help cho biển hoặc nút hỗ trợ.", archive_en: "Seal archive keeps the help word for signs or support buttons.", expected_vi: "Không biến thành English-only support label.", expected_en: "Does not become an English-only support label.", canadaPractical: true },
  { id: "pa-archive-service-001", focus: "service_vocabulary", stage: "pre_integration", gurmukhi: "ਪਤਾ ਬਦਲਣਾ", romanization: "pata badalna", archive_vi: "Archive cụm đổi địa chỉ cho giấy tờ Canada.", archive_en: "Archive the change-address chunk for Canada paperwork.", expected_vi: "ਬਦਲਣਾ được giữ như hành động trong workflow.", expected_en: "ਬਦਲਣਾ stays as the action in the workflow.", canadaPractical: true, archived: true },
  { id: "pa-archive-service-002", focus: "service_vocabulary", stage: "signoff", gurmukhi: "ਇੰਸ਼ੋਰੈਂਸ ਨੰਬਰ", romanization: "insurance number", archive_vi: "Signoff archive cụm insurance number bằng Gurmukhi-primary.", archive_en: "Signoff archive stores insurance number as Gurmukhi-primary.", expected_vi: "Loanword không làm mất script chính.", expected_en: "The loanword does not remove the primary script.", canadaPractical: true },
  { id: "pa-archive-verb-001", focus: "high_frequency_verbs", stage: "pre_a11_archive", gurmukhi: "ਮੈਂ ਭਰਦਾ ਹਾਂ", romanization: "main bharda haan", archive_vi: "Archive động từ fill trong câu ngắn về form.", archive_en: "Archive the fill verb in a short form sentence.", expected_vi: "Câu vẫn đủ chủ ngữ và động từ.", expected_en: "The sentence keeps both subject and verb.", canadaPractical: true, archived: true },
  { id: "pa-archive-verb-002", focus: "high_frequency_verbs", stage: "regression", gurmukhi: "ਉਹ ਆਉਂਦਾ ਹੈ", romanization: "oh aunda hai", archive_vi: "Regression archive động từ come với bindi/tippi awareness.", archive_en: "Regression archive keeps the come verb with mark awareness.", expected_vi: "Gurmukhi câu đầy đủ không bị rút gọn.", expected_en: "The full Gurmukhi sentence is not reduced." },
  { id: "pa-archive-collocation-001", focus: "collocations", stage: "seal", gurmukhi: "ਸਵਾਲ ਪੁੱਛਣਾ", romanization: "savaal puchhna", archive_vi: "Seal archive cụm hỏi câu hỏi ở quầy dịch vụ.", archive_en: "Seal archive stores the ask-a-question chunk at a service counter.", expected_vi: "ਪੁੱਛਣਾ được hiểu theo collocation.", expected_en: "ਪੁੱਛਣਾ is understood through the collocation.", learnerTrap: { vi: "Dịch từng chữ có thể làm cụm cứng.", en: "Word-by-word translation can make the chunk stiff." }, canadaPractical: true },
  { id: "pa-archive-collocation-002", focus: "collocations", stage: "signoff", gurmukhi: "ਜਵਾਬ ਦੇਣਾ", romanization: "javaab dena", archive_vi: "Signoff archive cụm trả lời để không tách ਦੇਣਾ sai nghĩa.", archive_en: "Signoff archive stores answer-give so ਦੇਣਾ is not detached incorrectly.", expected_vi: "Collocation vẫn là một chunk học được.", expected_en: "The collocation remains a learnable chunk.", canadaPractical: true },
  { id: "pa-archive-shahmukhi-001", focus: "shahmukhi_awareness", stage: "pre_integration", gurmukhi: "ਗੁਰਮੁਖੀ archive", romanization: "gurmukhi archive", archive_vi: "Pre-integration note: Gurmukhi primary; Shahmukhi chỉ là awareness.", archive_en: "Pre-integration note: Gurmukhi is primary; Shahmukhi is awareness only.", expected_vi: "Không mở khóa Shahmukhi đầy đủ.", expected_en: "Does not open a full Shahmukhi course." },
  { id: "pa-archive-closure-001", focus: "archive_closure", stage: "pre_a11_archive", gurmukhi: "ਅਭਿਲੇਖ ਜਾਂਚ", romanization: "abhilekh jaanch", archive_vi: "Archive closure kiểm dữ liệu TypeScript, id, focus và VI/EN.", archive_en: "Archive closure checks TypeScript data, ids, focus, and VI/EN.", expected_vi: "Dữ liệu được lưu cho bước sau nhưng chưa tích hợp A11.", expected_en: "Data is preserved for a later step but not integrated with A11.", archived: true },
  { id: "pa-archive-closure-002", focus: "archive_closure", stage: "regression", gurmukhi: "ਅੰਤਿਮ ਸੰਭਾਲ", romanization: "antim sambhaal", archive_vi: "Regression archive bắt scope drift và claim native review sai.", archive_en: "Regression archive catches scope drift and false native review claims.", expected_vi: "Native review được hoãn, không có claim đã review.", expected_en: "Native review is deferred with no reviewed claim.", archived: true },
];

export default PUNJABI_SCRIPT_VOCABULARY_ARCHIVE_SAMPLES;
