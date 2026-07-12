import type { BilingualText, PlacementV3Results } from "@/lib/placement/v3/types";
import BilingualLabel from "./BilingualLabel";
import { useChromeLanguage } from "@/lib/i18n/chromeLanguage";
import { usePlacementT } from "@/components/placement/nativeCopy";
import type { PlacementNativeSlots } from "@/components/placement/nativeCopy";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import InterferenceProfileShare from "./InterferenceProfileShare";

type Props = {
  results: PlacementV3Results;
};

const MODALITY_LABELS: Record<string, PlacementNativeSlots> = {
  writing: {
    en: "Writing", vi: "Viết",
    ja: "ライティング", id: "Menulis", th: "การเขียน",
    ar: "الكتابة", hi: "लेखन", ur: "لکھنا",
    ko: "쓰기", zh: "写作", pt: "Escrita", tr: "Yazma",
  },
  speaking: {
    en: "Speaking", vi: "Nói",
    ja: "スピーキング", id: "Berbicara", th: "การพูด",
    ar: "التحدث", hi: "बोलना", ur: "بولنا",
    ko: "말하기", zh: "口语", pt: "Fala", tr: "Konuşma",
  },
  reading: {
    en: "Reading", vi: "Đọc",
    ja: "リーディング", id: "Membaca", th: "การอ่าน",
    ar: "القراءة", hi: "पढ़ना", ur: "پڑھنا",
    ko: "읽기", zh: "阅读", pt: "Leitura", tr: "Okuma",
  },
  listening: {
    en: "Listening", vi: "Nghe",
    ja: "リスニング", id: "Mendengarkan", th: "การฟัง",
    ar: "الاستماع", hi: "सुनना", ur: "سننا",
    ko: "듣기", zh: "听力", pt: "Compreensão auditiva", tr: "Dinleme",
  },
  conversation: {
    en: "Conversation", vi: "Hội thoại",
    ja: "会話", id: "Percakapan", th: "การสนทนา",
    ar: "المحادثة", hi: "बातचीत", ur: "گفتگو",
    ko: "회화", zh: "对话", pt: "Conversação", tr: "Sohbet",
  },
};

const LABEL_OVERALL_LEVEL: PlacementNativeSlots = {
  en: "Overall level",
  vi: "Trình độ chung",
  ja: "総合レベル",
  id: "Level keseluruhan",
  th: "ระดับโดยรวม",
  ar: "المستوى العام",
  hi: "समग्र स्तर",
  ur: "مجموعی سطح",
  ko: "전체 레벨",
  zh: "总体水平",
  pt: "Nível geral",
  tr: "Genel seviye",
};

const LABEL_CONFIDENCE: PlacementNativeSlots = {
  en: "confidence",
  vi: "Độ tin cậy",
  ja: "信頼度",
  id: "kepercayaan",
  th: "ความเชื่อมั่น",
  ar: "ثقة",
  hi: "विश्वसनीयता",
  ur: "اعتماد",
  ko: "신뢰도",
  zh: "可信度",
  pt: "confiança",
  tr: "güven",
};

const LABEL_HOW_WE_ASSESSED: BilingualText = {
  en: "How we assessed you",
  vi: "Cách chúng tôi đánh giá bạn",
};

const LABEL_REFERENCE_RESULT: BilingualText = {
  en: "Reference result",
  vi: "Kết quả tham khảo",
};

/**
 * Derive a short, honest, human-readable rationale for the placement result
 * from fields the runtime pipeline already wrote onto `results`
 * (placementValidity, runtimeDecision.offers, and per-skill scoreEligible /
 * runtimeExclusionReason). Pure — reads only real fields, invents nothing,
 * and never fetches. Exported so tests can assert the derivation directly.
 *
 * `isReference` is true when the result should be shown as a reference rather
 * than a firm placement — i.e. validity is "questionable" OR any skill score
 * was ruled ineligible (product/device failure). That is the integrity path:
 * we surface it instead of hiding it.
 */
export function buildAssessmentRationale(results: PlacementV3Results): {
  isReference: boolean;
  notes: BilingualText[];
} {
  const validity = results.placementValidity ?? results.runtimeDecision?.placementValidity ?? "valid";
  const offers = results.runtimeDecision?.offers;
  const excluded = results.skills.filter((skill) => skill.scoreEligible === false);
  const isReference = validity === "questionable" || excluded.length > 0;

  const notes: BilingualText[] = [];

  // Always: what the pipeline based the estimate on.
  notes.push({
    en: "We estimated your level from your answers and how you completed each task.",
    vi: "Chúng tôi ước lượng trình độ của bạn dựa trên các câu trả lời và cách bạn hoàn thành từng phần.",
  });

  // Per-skill: any score the runtime ruled ineligible, framed as our fault, not the learner's.
  for (const skill of excluded) {
    if (skill.runtimeExclusionReason === "product_failure_audio") {
      notes.push({
        en: "We did not count your Listening score because the audio did not play — a technical problem on our side, not a reflection of your ability.",
        vi: "Chúng tôi không tính điểm phần Nghe vì âm thanh không phát được — đây là lỗi kỹ thuật từ phía chúng tôi, không phải do khả năng của bạn.",
      });
    } else if (skill.runtimeExclusionReason === "mic_permission_or_device_block") {
      notes.push({
        en: "We did not count your Speaking score because the microphone was blocked — a device or permission issue, not a reflection of your ability.",
        vi: "Chúng tôi không tính điểm phần Nói vì micro bị chặn — đây là lỗi thiết bị hoặc quyền truy cập, không phải do khả năng của bạn.",
      });
    }
  }

  // Offers the runtime made available, so the learner knows there is a way forward.
  if (offers?.listeningRetest) {
    notes.push({
      en: "You can retake the Listening section when you are ready.",
      vi: "Bạn có thể làm lại phần Nghe khi sẵn sàng.",
    });
  }
  if (offers?.speakingTextFallback || offers?.micRetry) {
    notes.push({
      en: "You can retry the microphone or answer the Speaking section in writing.",
      vi: "Bạn có thể thử lại micro hoặc trả lời phần Nói bằng văn bản.",
    });
  }

  // Validity: reference caution (questionable) or a reassurance when everything counted.
  if (validity === "questionable") {
    notes.push({
      en: "This is a reference result: some answers came very quickly, so we are not fully certain — but we did not lower your level because of it.",
      vi: "Đây là kết quả tham khảo: một số câu được trả lời rất nhanh nên chúng tôi chưa hoàn toàn chắc chắn — nhưng chúng tôi không hạ trình độ của bạn vì điều đó.",
    });
  } else if (excluded.length === 0) {
    notes.push({
      en: "This result is complete and reliable.",
      vi: "Kết quả này đầy đủ và đáng tin cậy.",
    });
  }

  return { isReference, notes };
}

export function ResultsProfile({ results }: Props) {
  const showVi = useChromeLanguage() === "vi";
  const pt = usePlacementT();

  return (
    <section className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-5 sm:grid-cols-[220px_1fr]">
        <div className="text-center sm:text-left">
          <div className="text-xs font-black uppercase tracking-[0.08em] text-slate-600">
            {pt(LABEL_OVERALL_LEVEL)}
          </div>
          <div className="mt-2 text-6xl font-black leading-none text-emerald-600">
            {results.overallCefr}
          </div>
          <div className="mt-2 text-sm font-bold text-slate-700">
            {Math.round(results.overallConfidence * 100)}% {pt(LABEL_CONFIDENCE)}
            {showVi && (
              <span className="block text-xs font-medium text-slate-600">
                {LABEL_CONFIDENCE.vi} {Math.round(results.overallConfidence * 100)}%
              </span>
            )}
          </div>
        </div>
        <BilingualLabel
          text={results.overallSummary}
          enClassName="text-base font-bold leading-7 text-slate-800"
          viClassName="text-sm font-medium leading-6 text-slate-600"
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {results.skills.map((skill) => (
          <article key={skill.modality} className="rounded-[14px] border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <BilingualLabel
                text={modalityLabel(skill.modality)}
                enClassName="text-sm font-black text-slate-800"
                viClassName="text-xs font-medium text-slate-600"
              />
              <div className="text-right">
                <div className="text-xl font-black text-slate-950">{skill.cefr}</div>
                <div className="text-[11px] font-bold text-slate-600">
                  {Math.round(skill.confidence * 100)}%
                </div>
              </div>
            </div>
            <BilingualLabel
              text={skill.summary}
              className="mt-3"
              enClassName="text-sm font-semibold leading-6 text-slate-700"
              viClassName="text-xs font-medium leading-5 text-slate-600"
            />
          </article>
        ))}
      </div>

      {FEATURE_FLAGS.PLACEMENT_DECISION_VISIBLE && (() => {
        const { isReference, notes } = buildAssessmentRationale(results);
        return (
          <div
            data-testid="assessment-rationale"
            className="mt-6 rounded-[14px] border border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <BilingualLabel
                text={LABEL_HOW_WE_ASSESSED}
                enClassName="text-sm font-black text-slate-800"
                viClassName="text-xs font-medium text-slate-600"
              />
              {isReference && (
                <BilingualLabel
                  text={LABEL_REFERENCE_RESULT}
                  className="rounded-full bg-amber-100 px-3 py-1"
                  enClassName="text-[11px] font-black uppercase tracking-[0.04em] text-amber-800"
                  viClassName="text-[10px] font-bold text-amber-700"
                />
              )}
            </div>
            <ul className="mt-3 space-y-2">
              {notes.map((note, index) => (
                <li key={index}>
                  <BilingualLabel
                    text={note}
                    enClassName="text-sm font-semibold leading-6 text-slate-700"
                    viClassName="text-xs font-medium leading-5 text-slate-600"
                  />
                </li>
              ))}
            </ul>
            {FEATURE_FLAGS.INTERFERENCE_PROFILE_SHARE && <InterferenceProfileShare results={results} />}
          </div>
        );
      })()}
    </section>
  );
}

/** Map modality string to the standard BilingualText shape for skill sections. */
function modalityLabel(modality: string): { en: string; vi: string } {
  const slots = MODALITY_LABELS[modality] ?? MODALITY_LABELS.writing;
  return { en: slots.en ?? modality, vi: slots.vi ?? modality };
}

export default ResultsProfile;
