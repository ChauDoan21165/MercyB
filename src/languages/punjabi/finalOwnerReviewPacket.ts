// src/languages/punjabi/finalOwnerReviewPacket.ts
//
// Wave 22 final owner review packet for Punjabi.
// This is not A11 integration. Native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalOwnerReviewArea =
  | "completion"
  | "gurmukhi_first"
  | "learner_support"
  | "canada_domain"
  | "proof_pack"
  | "final_qa"
  | "deferred"
  | "must_not_claim"
  | "owner_exit";

export type PunjabiFinalOwnerReviewDecision =
  | "ready_for_owner_review"
  | "review_before_a11"
  | "deferred_not_claimed";

export type PunjabiFinalOwnerReviewPacketItem = {
  id: string;
  area: PunjabiFinalOwnerReviewArea;
  decision: PunjabiFinalOwnerReviewDecision;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  owner_summary_vi: string;
  owner_summary_en: string;
  review_prompt_vi: string;
  review_prompt_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  evidence_modules: string[];
  proof_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_OWNER_REVIEW_PACKET_SCOPE = {
  wave: "Wave 22",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  audience_vi: "Người học nói tiếng Việt và người học dùng tiếng Anh.",
  audience_en: "Vietnamese-speaking learners and English-speaking learners.",
  shahmukhi_note_vi:
    "Shahmukhi chỉ là awareness để owner biết boundary; packet này không dạy full course Shahmukhi.",
  shahmukhi_note_en:
    "Shahmukhi is awareness-only for owner boundary review; this packet does not teach a full Shahmukhi course.",
  native_review_vi:
    "Native review được hoãn và không được claim là đã hoàn tất.",
  native_review_en:
    "Native review is deferred and must not be claimed as complete.",
  excluded_vi:
    "Không review audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push hoặc deploy.",
  excluded_en:
    "Does not review audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, or deploy.",
};

export const PUNJABI_FINAL_OWNER_REVIEW_AREAS: PunjabiFinalOwnerReviewArea[] = [
  "completion",
  "gurmukhi_first",
  "learner_support",
  "canada_domain",
  "proof_pack",
  "final_qa",
  "deferred",
  "must_not_claim",
  "owner_exit",
];

export const PUNJABI_FINAL_OWNER_REVIEW_PACKET: PunjabiFinalOwnerReviewPacketItem[] = [
  {
    id: "owner-completion-snapshot",
    area: "completion",
    decision: "ready_for_owner_review",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਕੰਮਲ ਸਨੈਪਸ਼ਾਟ",
    romanization: "mukammal snapshot",
    title_vi: "Snapshot hoàn tất",
    title_en: "Completion snapshot",
    owner_summary_vi:
      "Punjabi có foundation, dialogues, course map, learning path, progression, checkpoints, indexes, QA, audit, handoff, manifest, smoke, evidence và pre-integration summary.",
    owner_summary_en:
      "Punjabi has foundation, dialogues, course map, learning path, progression, checkpoints, indexes, QA, audit, handoff, manifest, smoke, evidence, and pre-integration summary artifacts.",
    review_prompt_vi:
      "Owner kiểm tra rằng các artifact này là dữ liệu TypeScript và có test riêng.",
    review_prompt_en:
      "Owner checks that these artifacts are TypeScript data and have their own tests.",
    sample: {
      gurmukhi: "ਪੰਜਾਬੀ ਤਿਆਰ ਹੈ, ਪਰ review ਬਾਕੀ ਹੈ।",
      romanization: "Punjabi tiar hai, par review baki hai",
      vi: "Punjabi đã sẵn sàng, nhưng review vẫn còn.",
      en: "Punjabi is ready, but review remains.",
    },
    evidence_modules: [
      "index",
      "dialogues",
      "courseMap",
      "learningPath",
      "progressionMatrix",
      "finalContentManifest",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
    ],
    proof_tags: ["owner-review", "completion", "typescript-data"],
    learner_trap_vi:
      "Hoàn tất packet không có nghĩa là đã chạy A11 integration.",
    learner_trap_en:
      "A complete packet does not mean A11 integration has run.",
  },
  {
    id: "owner-a1-c2-coverage",
    area: "completion",
    decision: "ready_for_owner_review",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1 ਤੋਂ C2 ਤੱਕ",
    romanization: "A1 ton C2 takk",
    title_vi: "Độ phủ A1-C2",
    title_en: "A1-C2 coverage",
    owner_summary_vi:
      "Các level A1-C2 xuất hiện trong map, can-do, checkpoints, quality gates, final QA và smoke evidence.",
    owner_summary_en:
      "A1-C2 levels appear in maps, can-do items, checkpoints, quality gates, final QA, and smoke evidence.",
    review_prompt_vi:
      "Owner xác nhận coverage theo level, không diễn giải thành chứng chỉ chính thức.",
    review_prompt_en:
      "Owner confirms level coverage without treating it as official certification.",
    sample: {
      gurmukhi: "ਇਹ ਸਬੂਤ ਹਰ ਪੱਧਰ ਲਈ ਹੈ।",
      romanization: "ih sabut har paddar lai hai",
      vi: "Bằng chứng này dành cho từng cấp.",
      en: "This evidence is for each level.",
    },
    evidence_modules: [
      "courseMap",
      "progressionMatrix",
      "masteryCheckpoints",
      "finalCanDoIndex",
      "finalQualityGates",
      "finalQaInventory",
      "finalSmokeChecklist",
    ],
    proof_tags: ["A1-C2", "coverage", "owner-check"],
    learner_trap_vi:
      "CEFR label trong course map không phải xác nhận năng lực chính thức.",
    learner_trap_en:
      "A CEFR label in the course map is not formal proficiency certification.",
  },
  {
    id: "owner-gurmukhi-first-path",
    area: "gurmukhi_first",
    decision: "ready_for_owner_review",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ",
    romanization: "Gurmukhi pehlan",
    title_vi: "Lộ trình Gurmukhi trước",
    title_en: "Gurmukhi-first path",
    owner_summary_vi:
      "Owner nên thấy Gurmukhi là primary trong titles và samples; romanization chỉ hỗ trợ đọc ban đầu.",
    owner_summary_en:
      "Owner should see Gurmukhi as primary in titles and samples; romanization only supports early reading.",
    review_prompt_vi:
      "Kiểm tra UI sau này phải hiển thị Gurmukhi trước romanization.",
    review_prompt_en:
      "Check that later UI displays Gurmukhi before romanization.",
    sample: {
      gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
      romanization: "sat sri akal",
      vi: "lời chào Punjabi",
      en: "Punjabi greeting",
    },
    evidence_modules: [
      "lessons-a1",
      "dialogues",
      "courseMap",
      "finalNavigationMap",
      "finalContentManifest",
    ],
    proof_tags: ["gurmukhi-first", "romanization-support", "script-path"],
    learner_trap_vi:
      "Romanization dễ che mất bật hơi, retroflex và nasalization.",
    learner_trap_en:
      "Romanization can hide aspiration, retroflex sounds, and nasalization.",
  },
  {
    id: "owner-shahmukhi-boundary",
    area: "deferred",
    decision: "deferred_not_claimed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਸ਼ਾਹਮੁਖੀ boundary",
    romanization: "Shahmukhi boundary",
    title_vi: "Boundary Shahmukhi",
    title_en: "Shahmukhi boundary",
    owner_summary_vi:
      "Shahmukhi được nhắc để nhận biết script context, không phải full course và không có bài dạy riêng.",
    owner_summary_en:
      "Shahmukhi is mentioned for script-context awareness, not as a full course and not as standalone lessons.",
    review_prompt_vi:
      "Owner giữ wording awareness-only nếu đưa vào A11 sau này.",
    review_prompt_en:
      "Owner keeps awareness-only wording if this is later integrated by A11.",
    sample: {
      gurmukhi: "ਲਿਪੀ ਦੀ ਜਾਣਕਾਰੀ",
      romanization: "lipi di jankari",
      vi: "nhận biết về chữ viết",
      en: "script awareness",
    },
    evidence_modules: [
      "courseMap",
      "finalModuleRegistry",
      "finalContentManifest",
      "finalPreIntegrationSummary",
    ],
    proof_tags: ["awareness-only", "not-full-course", "deferred"],
    learner_trap_vi:
      "Biết tên script không có nghĩa là học đọc script đó.",
    learner_trap_en:
      "Knowing the script name does not mean learning to read that script.",
    must_not_claim_vi: "Không claim khóa Shahmukhi đầy đủ.",
    must_not_claim_en: "Do not claim a full Shahmukhi course.",
  },
  {
    id: "owner-vi-en-learner-support",
    area: "learner_support",
    decision: "ready_for_owner_review",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਦੋ-ਭਾਸ਼ੀ ਸਹਾਇਤਾ",
    romanization: "do-bhashi sahaita",
    title_vi: "Hỗ trợ Việt-Anh",
    title_en: "Vietnamese-English support",
    owner_summary_vi:
      "Data có giải thích bằng tiếng Việt và tiếng Anh cho goals, samples, traps, QA và owner prompts.",
    owner_summary_en:
      "Data includes Vietnamese and English explanations for goals, samples, traps, QA, and owner prompts.",
    review_prompt_vi:
      "Owner kiểm tra không có English-only fallback khi field VI là cần thiết.",
    review_prompt_en:
      "Owner checks there is no English-only fallback where VI fields are required.",
    sample: {
      gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।",
      romanization: "kirpa karke hauli bolo",
      vi: "Xin vui lòng nói chậm.",
      en: "Please speak slowly.",
    },
    evidence_modules: [
      "dialogues",
      "learningPath",
      "contentIndex",
      "finalQaInventory",
      "finalPreIntegrationSummary",
    ],
    proof_tags: ["vi-support", "en-support", "learner-explanations"],
    learner_trap_vi:
      "Dịch nghĩa không thay thế note lỗi riêng cho người Việt.",
    learner_trap_en:
      "Translation does not replace error notes for Vietnamese-speaking learners.",
  },
  {
    id: "owner-canada-survival-public",
    area: "canada_domain",
    decision: "review_before_a11",
    levels: ["A1", "A2", "B1", "B2"],
    title_pa: "ਕੈਨੇਡਾ survival",
    romanization: "Canada survival",
    title_vi: "Canada survival và dịch vụ công",
    title_en: "Canada survival and public service",
    owner_summary_vi:
      "Packet trỏ tới survival, address, phone, documents, school office, settlement và public-service counters.",
    owner_summary_en:
      "Packet points to survival, address, phone, documents, school office, settlement, and public-service counters.",
    review_prompt_vi:
      "Owner xác nhận các ví dụ là language practice, không phải tư vấn pháp lý hay di trú.",
    review_prompt_en:
      "Owner confirms examples are language practice, not legal or immigration advice.",
    sample: {
      gurmukhi: "ਮੇਰਾ ਪਤਾ ਬਦਲ ਗਿਆ ਹੈ।",
      romanization: "mera pata badal gia hai",
      vi: "Địa chỉ của tôi đã thay đổi.",
      en: "My address has changed.",
    },
    evidence_modules: [
      "dialogues",
      "finalCanDoIndex",
      "finalNavigationMap",
      "finalSmokeChecklist",
      "finalIntegrationEvidenceMap",
    ],
    proof_tags: ["canada-practical", "survival", "public-service"],
    learner_trap_vi:
      "ਪਤਾ là address; đừng lẫn với phone number hoặc document number.",
    learner_trap_en:
      "Pata means address; do not confuse it with a phone number or document number.",
    canada_practical:
      "Canada settlement desks, school offices, municipal counters, public service desks, and community forms.",
  },
  {
    id: "owner-canada-work-health",
    area: "canada_domain",
    decision: "review_before_a11",
    levels: ["B1", "B2", "C1"],
    title_pa: "ਕੰਮ ਅਤੇ clinic",
    romanization: "kamm ate clinic",
    title_vi: "Công việc và clinic Canada",
    title_en: "Canada work and clinic",
    owner_summary_vi:
      "Workplace, shift, supervisor, clinic intake, pharmacy và symptom examples có boundary không chẩn đoán.",
    owner_summary_en:
      "Workplace, shift, supervisor, clinic intake, pharmacy, and symptom examples have no-diagnosis boundaries.",
    review_prompt_vi:
      "Owner kiểm tra health examples chỉ dạy language, không đưa lời khuyên y tế.",
    review_prompt_en:
      "Owner checks health examples teach language only and do not give medical advice.",
    sample: {
      gurmukhi: "ਮੇਰੀ shift ਕਦੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ?",
      romanization: "meri shift kadon shuru hundi hai?",
      vi: "Ca làm của tôi bắt đầu lúc nào?",
      en: "When does my shift start?",
    },
    evidence_modules: [
      "dialogues",
      "masteryCheckpoints",
      "finalCanDoIndex",
      "finalQualityGates",
      "finalIntegrationEvidenceMap",
    ],
    proof_tags: ["canada-practical", "work", "clinic", "scope-boundary"],
    learner_trap_vi:
      "Một câu đúng về symptom không phải chẩn đoán hay hướng dẫn điều trị.",
    learner_trap_en:
      "A correct symptom sentence is not a diagnosis or treatment instruction.",
    canada_practical:
      "Canada shift messages, supervisor notes, clinic intake, pharmacy counters, and telehealth language practice.",
  },
  {
    id: "owner-proof-pack",
    area: "proof_pack",
    decision: "ready_for_owner_review",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਸਬੂਤ packet",
    romanization: "sabut packet",
    title_vi: "Proof pack",
    title_en: "Proof pack",
    owner_summary_vi:
      "Owner có thể dùng module registry, content manifest, smoke checklist, evidence map và pre-integration summary làm proof pack.",
    owner_summary_en:
      "Owner can use the module registry, content manifest, smoke checklist, evidence map, and pre-integration summary as the proof pack.",
    review_prompt_vi:
      "Owner kiểm tra IDs, module names và route tags trước khi giao cho A11 sau này.",
    review_prompt_en:
      "Owner checks IDs, module names, and route tags before a later A11 handoff.",
    sample: {
      gurmukhi: "ਇਹ ਸਬੂਤ ਕਾਫ਼ੀ ਹੈ।",
      romanization: "ih sabut kafi hai",
      vi: "Bằng chứng này là đủ.",
      en: "This evidence is sufficient.",
    },
    evidence_modules: [
      "finalModuleRegistry",
      "finalContentManifest",
      "finalSmokeChecklist",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
    ],
    proof_tags: ["proof-pack", "final-owner-review", "evidence-map"],
    learner_trap_vi:
      "Proof pack chứng minh dữ liệu tồn tại, không chứng minh native review.",
    learner_trap_en:
      "The proof pack proves data exists, not that native review is complete.",
  },
  {
    id: "owner-final-qa",
    area: "final_qa",
    decision: "review_before_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਅੰਤਿਮ QA",
    romanization: "antim QA",
    title_vi: "Final QA",
    title_en: "Final QA",
    owner_summary_vi:
      "Final QA tập trung vào scope, script, bilingual fields, route readiness, learner traps và forbidden claims.",
    owner_summary_en:
      "Final QA focuses on scope, script, bilingual fields, route readiness, learner traps, and forbidden claims.",
    review_prompt_vi:
      "Owner đọc final QA trước khi yêu cầu A11 integration sau này.",
    review_prompt_en:
      "Owner reads final QA before requesting later A11 integration.",
    sample: {
      gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਜਾਂਚ ਪੂਰੀ ਕਰੋ।",
      romanization: "kirpa karke janch puri karo",
      vi: "Xin vui lòng hoàn tất kiểm tra.",
      en: "Please complete the check.",
    },
    evidence_modules: [
      "preMrAuditChecklist",
      "preIntegrationHandoffMap",
      "finalQaInventory",
      "finalQualityGates",
      "finalSmokeChecklist",
    ],
    proof_tags: ["final-QA", "owner-review", "handoff"],
    learner_trap_vi:
      "QA pass không thay thế review bản ngữ.",
    learner_trap_en:
      "A QA pass does not replace native review.",
  },
  {
    id: "owner-native-review-deferred",
    area: "deferred",
    decision: "deferred_not_claimed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "native review ਬਾਕੀ",
    romanization: "native review baki",
    title_vi: "Native review còn lại",
    title_en: "Native review remains",
    owner_summary_vi:
      "Native review is deferred; owner không được claim rằng nội dung đã được native-reviewed.",
    owner_summary_en:
      "Native review is deferred and not claimed; owner must not claim the content has been native-reviewed.",
    review_prompt_vi:
      "Owner thêm native review vào bước riêng sau này nếu cần, ngoài Wave 22.",
    review_prompt_en:
      "Owner adds native review as a separate later step if needed, outside Wave 22.",
    sample: {
      gurmukhi: "review ਅਜੇ ਬਾਕੀ ਹੈ।",
      romanization: "review aje baki hai",
      vi: "Review vẫn còn đang chờ.",
      en: "Review is still pending.",
    },
    evidence_modules: [
      "preMrAuditChecklist",
      "preIntegrationHandoffMap",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
    ],
    proof_tags: ["native-review-deferred", "not-claimed", "owner-boundary"],
    learner_trap_vi:
      "Không biến deferred thành passed trong copy marketing hoặc UI.",
    learner_trap_en:
      "Do not turn deferred into passed in marketing copy or UI.",
    must_not_claim_vi: "Không claim native review đã hoàn tất.",
    must_not_claim_en: "Do not claim native review is complete.",
  },
  {
    id: "owner-forbidden-claims",
    area: "must_not_claim",
    decision: "deferred_not_claimed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾ claim ਕਰੋ",
    romanization: "na claim karo",
    title_vi: "Không được claim",
    title_en: "Must not claim",
    owner_summary_vi:
      "Wave 22 không thêm audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, deploy hoặc A11 integration.",
    owner_summary_en:
      "Wave 22 adds no audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, deploy, or A11 integration.",
    review_prompt_vi:
      "Owner loại bỏ mọi wording gợi ý các tính năng này đã được làm.",
    review_prompt_en:
      "Owner removes any wording implying these features were completed.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ text ਹੈ।",
      romanization: "ih siraf text hai",
      vi: "Đây chỉ là text.",
      en: "This is text only.",
    },
    evidence_modules: [
      "finalQualityGates",
      "finalSmokeChecklist",
      "finalIntegrationEvidenceMap",
      "finalPreIntegrationSummary",
    ],
    proof_tags: ["must-not-claim", "text-only", "not-a11"],
    learner_trap_vi:
      "Text-only content không tự tạo audio hay scoring.",
    learner_trap_en:
      "Text-only content does not create audio or scoring.",
    must_not_claim_vi:
      "Không claim audio, scoring, Azure, Supabase, deploy, push hoặc A11 integration.",
    must_not_claim_en:
      "Do not claim audio, scoring, Azure, Supabase, deploy, push, or A11 integration.",
  },
  {
    id: "owner-exit-ticket",
    area: "owner_exit",
    decision: "review_before_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮਾਲਕ exit ticket",
    romanization: "owner exit ticket",
    title_vi: "Exit ticket cho owner",
    title_en: "Owner exit ticket",
    owner_summary_vi:
      "Owner có thể xác nhận: Gurmukhi-first, VI/EN support, Canada examples, proof pack, final QA, native-review deferred và no forbidden claims.",
    owner_summary_en:
      "Owner can confirm: Gurmukhi-first, VI/EN support, Canada examples, proof pack, final QA, native-review deferred, and no forbidden claims.",
    review_prompt_vi:
      "Chỉ sau owner review mới nên lập yêu cầu A11 integration riêng.",
    review_prompt_en:
      "Only after owner review should a separate A11 integration request be opened.",
    sample: {
      gurmukhi: "ਅਗਲਾ ਕਦਮ ਵੱਖਰਾ ਹੈ।",
      romanization: "agla kadam vakhra hai",
      vi: "Bước tiếp theo là riêng biệt.",
      en: "The next step is separate.",
    },
    evidence_modules: [
      "finalOwnerReviewPacket",
      "finalPreIntegrationSummary",
      "finalIntegrationEvidenceMap",
      "finalSmokeChecklist",
    ],
    proof_tags: ["owner-exit", "not-a11", "final-owner-review"],
    learner_trap_vi:
      "Exit ticket là checklist cho owner, không phải integration action.",
    learner_trap_en:
      "The exit ticket is an owner checklist, not an integration action.",
    must_not_claim_vi: "Không push, không deploy, không chạy A11 integration.",
    must_not_claim_en: "No push, no deploy, and no A11 integration.",
  },
];

export const PUNJABI_FINAL_OWNER_REVIEW_ROUTES = [
  {
    id: "owner-review-completion",
    vi: "Owner kiểm tra completion, A1-C2 coverage và proof pack.",
    en: "Owner reviews completion, A1-C2 coverage, and proof pack.",
    item_ids: ["owner-completion-snapshot", "owner-a1-c2-coverage", "owner-proof-pack"],
  },
  {
    id: "owner-review-learner-path",
    vi: "Owner kiểm tra Gurmukhi-first, VI/EN explanations và Canada-practical domains.",
    en: "Owner reviews Gurmukhi-first, VI/EN explanations, and Canada-practical domains.",
    item_ids: [
      "owner-gurmukhi-first-path",
      "owner-vi-en-learner-support",
      "owner-canada-survival-public",
      "owner-canada-work-health",
    ],
  },
  {
    id: "owner-review-boundary-exit",
    vi: "Owner kiểm tra deferred items, forbidden claims, final QA và exit ticket.",
    en: "Owner reviews deferred items, forbidden claims, final QA, and the exit ticket.",
    item_ids: [
      "owner-shahmukhi-boundary",
      "owner-final-qa",
      "owner-native-review-deferred",
      "owner-forbidden-claims",
      "owner-exit-ticket",
    ],
  },
];

export const PUNJABI_FINAL_OWNER_REVIEW_PACKET_ROOT = {
  scope: PUNJABI_FINAL_OWNER_REVIEW_PACKET_SCOPE,
  areas: PUNJABI_FINAL_OWNER_REVIEW_AREAS,
  packet: PUNJABI_FINAL_OWNER_REVIEW_PACKET,
  routes: PUNJABI_FINAL_OWNER_REVIEW_ROUTES,
};

export default PUNJABI_FINAL_OWNER_REVIEW_PACKET_ROOT;
