import type { PlacementV3Recommendation } from "@/lib/placement/v3/types";
import { Button } from "@/components/ui/button";
import BilingualLabel from "./BilingualLabel";

type Props = {
  recommendations: PlacementV3Recommendation[];
  onStartLesson: (roomId: string) => void;
};

export function RecommendedLessonsList({ recommendations, onStartLesson }: Props) {
  return (
    <section className="rounded-[18px] border border-emerald-200 bg-white p-5 shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
      <BilingualLabel
        text={{ en: "Start here", vi: "Bắt đầu từ đây" }}
        enClassName="text-lg font-black text-slate-950"
        viClassName="text-sm font-medium text-slate-500"
      />
      <div className="mt-4 grid gap-3">
        {recommendations.slice(0, 12).map((lesson, index) => (
          <article
            key={lesson.roomId}
            className={`rounded-[14px] border p-4 ${
              index === 0 ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <BilingualLabel
                text={lesson.title}
                enClassName="text-base font-black leading-snug text-slate-900"
                viClassName="text-sm font-medium leading-snug text-slate-500"
              />
              <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-emerald-700">
                {lesson.cefr}
              </span>
            </div>
            <BilingualLabel
              text={lesson.description}
              className="mt-2"
              enClassName="text-sm font-semibold leading-6 text-slate-700"
              viClassName="text-xs font-medium leading-5 text-slate-500"
            />
            <BilingualLabel
              text={lesson.reason}
              className="mt-3 rounded-[12px] bg-white/70 p-3"
              enClassName="text-xs font-bold leading-5 text-slate-600"
              viClassName="text-xs font-medium leading-5 text-slate-500"
            />
            {index === 0 ? (
              <Button
                type="button"
                onClick={() => onStartLesson(lesson.roomId)}
                className="mt-4 w-full rounded-full"
              >
                Start this lesson · Bắt đầu bài này
              </Button>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export default RecommendedLessonsList;
