import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BilingualLabel,
  GapAnalysisSection,
  L1FlagsDisplay,
  LoadingPlaceholder,
  RecommendedLessonsList,
  ResultsProfile,
} from "@/components/placement/v3";
import { getResults } from "@/lib/placement/v3/clientStub";
import type { PlacementV3Results } from "@/lib/placement/v3/types";

export default function ResultsPage() {
  const { sessionId = "" } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState<PlacementV3Results | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const stored = window.sessionStorage.getItem(`mb.placement.v3.results.${sessionId}`);
    if (stored) {
      setResults(JSON.parse(stored) as PlacementV3Results);
      setLoading(false);
      return;
    }
    getResults(sessionId)
      .then((next) => {
        if (!cancelled) setResults(next);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (loading || !results) {
    return (
      <main className="px-4 py-8">
        <LoadingPlaceholder label={{ en: "Loading your results", vi: "Đang tải kết quả của bạn" }} />
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] w-full max-w-[980px] px-4 py-6">
      <section className="rounded-[20px] border border-amber-100 bg-[#FFF8F3] p-5 text-center">
        <BilingualLabel
          as="h1"
          text={{ en: "Here's what we found", vi: "Đây là kết quả của bạn" }}
          enClassName="text-2xl font-black text-amber-950 sm:text-3xl"
          viClassName="text-sm font-medium text-slate-500"
        />
        <BilingualLabel
          as="p"
          className="mt-2"
          text={{
            en: "Based on your answers. You can retake anytime.",
            vi: "Dựa trên câu trả lời của bạn. Bạn có thể làm lại bất cứ lúc nào.",
          }}
          enClassName="text-sm font-semibold text-slate-600"
          viClassName="text-xs font-medium text-slate-400"
        />
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <ResultsProfile results={results} />
          <GapAnalysisSection strengths={results.strengths} gaps={results.gaps} />
          <L1FlagsDisplay flags={results.l1Flags} />
        </div>
        <div className="space-y-5">
          <RecommendedLessonsList
            recommendations={results.recommendations}
            onStartLesson={(roomId) => navigate(`/room/${roomId}`)}
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Button type="button" variant="outline" className="rounded-full" onClick={() => navigate("/rooms")}>
              See other lessons · Xem bài khác
            </Button>
            <Button type="button" variant="outline" className="rounded-full" onClick={() => navigate("/placement/who")}>
              Retake test · Làm lại
            </Button>
          </div>
          <div className="text-center text-xs font-medium text-slate-400">
            {results.questionCount} tasks · {new Date(results.completedAt).toLocaleDateString("en-CA")}
            <span className="block">
              {results.questionCount} mục · {new Date(results.completedAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
