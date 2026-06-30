import type { PlacementV3Modality } from "@/lib/placement/v3/types";
import { useChromeLanguage } from "@/lib/i18n/chromeLanguage";
import { usePlacementT } from "@/components/placement/nativeCopy";
import type { PlacementNativeSlots } from "@/components/placement/nativeCopy";

type Props = {
  current: number;
  total: number;
  modality: PlacementV3Modality;
  modalities: PlacementV3Modality[];
};

const MODALITY_LABELS: Record<PlacementV3Modality, PlacementNativeSlots> = {
  writing: {
    en: "Writing",
    vi: "Viết",
    ja: "ライティング",
    id: "Menulis",
    th: "การเขียน",
    ar: "الكتابة",
    hi: "लेखन",
    ur: "لکھنا",
    ko: "쓰기",
    zh: "写作",
    pt: "Escrita",
    tr: "Yazma",
  },
  speaking: {
    en: "Speaking",
    vi: "Nói",
    ja: "スピーキング",
    id: "Berbicara",
    th: "การพูด",
    ar: "التحدث",
    hi: "बोलना",
    ur: "بولنا",
    ko: "말하기",
    zh: "口语",
    pt: "Fala",
    tr: "Konuşma",
  },
  reading: {
    en: "Reading",
    vi: "Đọc",
    ja: "リーディング",
    id: "Membaca",
    th: "การอ่าน",
    ar: "القراءة",
    hi: "पढ़ना",
    ur: "پڑھنا",
    ko: "읽기",
    zh: "阅读",
    pt: "Leitura",
    tr: "Okuma",
  },
  listening: {
    en: "Listening",
    vi: "Nghe",
    ja: "リスニング",
    id: "Mendengarkan",
    th: "การฟัง",
    ar: "الاستماع",
    hi: "सुनना",
    ur: "سننا",
    ko: "듣기",
    zh: "听力",
    pt: "Compreensão auditiva",
    tr: "Dinleme",
  },
  conversation: {
    en: "Conversation",
    vi: "Hội thoại",
    ja: "会話",
    id: "Percakapan",
    th: "การสนทนา",
    ar: "المحادثة",
    hi: "बातचीत",
    ur: "گفتگو",
    ko: "회화",
    zh: "对话",
    pt: "Conversação",
    tr: "Sohbet",
  },
};

const TASK_LABELS: PlacementNativeSlots = {
  en: "Task",
  vi: "Mục",
  ja: "タスク",
  id: "Tugas",
  th: "ภารกิจ",
  ar: "مهمة",
  hi: "कार्य",
  ur: "کام",
  ko: "과제",
  zh: "题目",
  pt: "Tarefa",
  tr: "Görev",
};

export function ProgressStrip({ current, total, modality, modalities }: Props) {
  const showVi = useChromeLanguage() === "vi";
  const pt = usePlacementT();
  const safeTotal = Math.max(1, total);
  const pct = Math.min(100, Math.max(0, (current / safeTotal) * 100));

  return (
    <div
      className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur"
      aria-label="Placement test progress"
    >
      <div className="mx-auto w-full max-w-[760px]">
        <div
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`Task ${current} of ${total}`}
          className="h-1 overflow-hidden rounded-full bg-slate-200"
        >
          <div
            className="h-full rounded-full bg-emerald-500 transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 text-[11px] font-black uppercase tracking-[0.06em] text-slate-600">
          <span>
            {pt(TASK_LABELS)} {Math.min(current + 1, total)} of {total}
            {showVi && (
              <span className="block font-medium normal-case tracking-normal text-slate-600">
                Mục {Math.min(current + 1, total)} / {total}
              </span>
            )}
          </span>
          <span aria-live="polite" className="text-right">
            {pt(MODALITY_LABELS[modality])}
            {showVi && (
              <span className="block font-medium normal-case tracking-normal text-slate-600">
                {MODALITY_LABELS[modality].vi}
              </span>
            )}
          </span>
        </div>
        <div className="mt-2 grid grid-cols-5 gap-1" aria-hidden>
          {modalities.map((item) => (
            <div
              key={item}
              className={`h-1.5 rounded-full ${
                item === modality ? "bg-emerald-500" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProgressStrip;
