import type { PlacementV3Results } from "@/lib/placement/v3/types";
import BilingualLabel from "./BilingualLabel";
import { useChromeLanguage } from "@/lib/i18n/chromeLanguage";
import { usePlacementT } from "@/components/placement/nativeCopy";
import type { PlacementNativeSlots } from "@/components/placement/nativeCopy";

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
    </section>
  );
}

/** Map modality string to the standard BilingualText shape for skill sections. */
function modalityLabel(modality: string): { en: string; vi: string } {
  const slots = MODALITY_LABELS[modality] ?? MODALITY_LABELS.writing;
  return { en: slots.en ?? modality, vi: slots.vi ?? modality };
}

export default ResultsProfile;
