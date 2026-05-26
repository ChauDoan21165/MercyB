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
import type { PlacementV3Recommendation, PlacementV3Results } from "@/lib/placement/v3/types";

const ACTIVE_LESSON_KEY = "mb.placement.v3.activeLesson";

type ActiveLessonMarker = {
  sessionId: string;
  roomId: string;
  completedRoomIds: string[];
  completionCount: number;
};

export default function ResultsPage() {
  const { sessionId = "" } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState<PlacementV3Results | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<ActiveLessonMarker | null>(null);

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

  useEffect(() => {
    if (!results) {
      setActiveLesson(null);
      return;
    }
    setActiveLesson(readActiveLessonMarker(sessionId, results.recommendations));
  }, [results, sessionId]);

  if (loading || !results) {
    return (
      <main className="px-4 py-8">
        <LoadingPlaceholder label={{ en: "Loading your results", vi: "Đang tải kết quả của bạn" }} />
      </main>
    );
  }

  const routeToRoom = (roomId: string) => {
    const normalizedRoomId = normalizePlacementV3RoomId(roomId);
    if (!normalizedRoomId) return;
    const next = persistActiveLessonMarker(sessionId, normalizedRoomId, activeLesson);
    setActiveLesson(next);
    navigate(`/room/${encodeURIComponent(normalizedRoomId)}`);
  };

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
          {activeLesson ? (
            <section className="rounded-[18px] border border-sky-200 bg-white p-5 shadow-[0_10px_30px_rgba(14,165,233,0.08)]">
              <BilingualLabel
                text={{ en: "Resume your lesson", vi: "Học tiếp bài của bạn" }}
                enClassName="text-lg font-black text-slate-950"
                viClassName="text-sm font-medium text-slate-400"
              />
              <Button
                type="button"
                className="mt-4 w-full rounded-full"
                onClick={() => routeToRoom(activeLesson.roomId)}
              >
                Resume lesson · Học tiếp
              </Button>
            </section>
          ) : null}
          <RecommendedLessonsList
            recommendations={results.recommendations}
            onStartLesson={(roomId) => routeToRoom(roomId)}
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

function normalizePlacementV3RoomId(value: unknown): string | null {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return null;
  let withoutPrefix = raw;
  while (withoutPrefix.startsWith("room:")) {
    withoutPrefix = withoutPrefix.slice("room:".length).trim();
  }
  if (!withoutPrefix || withoutPrefix.includes("/")) return null;
  return withoutPrefix;
}

function normalizedRecommendationIds(recommendations: PlacementV3Recommendation[]) {
  return recommendations
    .map((recommendation) => normalizePlacementV3RoomId(recommendation.roomId))
    .filter((roomId): roomId is string => Boolean(roomId));
}

function readActiveLessonMarker(
  sessionId: string,
  recommendations: PlacementV3Recommendation[],
): ActiveLessonMarker | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(ACTIVE_LESSON_KEY);
  if (!raw) return null;

  const recommendedRoomIds = normalizedRecommendationIds(recommendations);
  const clear = () => {
    window.localStorage.removeItem(ACTIVE_LESSON_KEY);
    return null;
  };

  try {
    const parsed = JSON.parse(raw) as Partial<ActiveLessonMarker>;
    if (parsed.sessionId !== sessionId) return clear();
    const roomId = normalizePlacementV3RoomId(parsed.roomId);
    if (!roomId || !recommendedRoomIds.includes(roomId)) return clear();

    const completedRoomIds = Array.isArray(parsed.completedRoomIds)
      ? Array.from(new Set(parsed.completedRoomIds.map(normalizePlacementV3RoomId).filter((id): id is string => Boolean(id))))
      : [];

    if (completedRoomIds.includes(roomId)) {
      const nextRoomId = recommendedRoomIds.find((candidate) => !completedRoomIds.includes(candidate));
      if (!nextRoomId) return clear();
      return persistActiveLessonMarker(sessionId, nextRoomId, {
        sessionId,
        roomId,
        completedRoomIds,
        completionCount: completedRoomIds.length,
      });
    }

    const marker: ActiveLessonMarker = {
      sessionId,
      roomId,
      completedRoomIds,
      completionCount: completedRoomIds.length,
    };
    window.localStorage.setItem(ACTIVE_LESSON_KEY, JSON.stringify(marker));
    return marker;
  } catch {
    return clear();
  }
}

function persistActiveLessonMarker(
  sessionId: string,
  roomId: string,
  previous: ActiveLessonMarker | null,
): ActiveLessonMarker {
  const completedRoomIds = previous?.completedRoomIds ?? [];
  const marker: ActiveLessonMarker = {
    sessionId,
    roomId,
    completedRoomIds,
    completionCount: completedRoomIds.length,
  };
  window.localStorage.setItem(ACTIVE_LESSON_KEY, JSON.stringify(marker));
  window.localStorage.setItem("mb.lastRoomId", roomId);
  return marker;
}
