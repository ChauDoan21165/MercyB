import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AbandonConfirmModal,
  ConversationTaskCard,
  ListeningTaskCard,
  LoadingPlaceholder,
  ProgressStrip,
  ReadingTaskCard,
  SessionExpiredModal,
  SpeakingTaskCard,
  WritingTaskCard,
} from "@/components/placement/v3";
import { abandonSession, getResults, resumeSession } from "@/lib/placement/v3/clientStub";
import type { PlacementV3Session, PlacementV3Task } from "@/lib/placement/v3/types";
import {
  usePlacementAudioCapture,
  usePlacementProgress,
  usePlacementSubmit,
} from "@/hooks/placement/v3";

function minAnswerLength(task: PlacementV3Task) {
  if (task.type === "writing") return 40;
  if (task.type === "speaking") return 12;
  if (task.type === "conversation") return 8;
  return 1;
}

export default function TestPage() {
  const { sessionId = "" } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<PlacementV3Session | null>(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [abandonOpen, setAbandonOpen] = useState(false);
  const [expiredOpen, setExpiredOpen] = useState(false);
  const audio = usePlacementAudioCapture();
  const submitter = usePlacementSubmit();
  const progress = usePlacementProgress(session);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    resumeSession()
      .then((stored) => {
        if (cancelled) return;
        if (stored?.sessionId === sessionId) {
          setSession(stored);
          if (stored.status === "expired") setExpiredOpen(true);
        } else {
          navigate("/placement/resume", { replace: true });
        }
      })
      .catch(() => navigate("/placement/resume", { replace: true }))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [navigate, sessionId]);

  useEffect(() => {
    setAnswer("");
    audio.retake();
  }, [session?.currentTask?.id]);

  const task = session?.currentTask ?? null;
  const canSubmit = useMemo(() => {
    if (!task) return false;
    return answer.trim().length >= minAnswerLength(task);
  }, [answer, task]);

  const handleSubmit = async () => {
    if (!session || !task || !canSubmit) return;
    const result = await submitter.submit({
      sessionId: session.sessionId,
      taskId: task.id,
      modality: task.modality,
      value: answer,
      audioBlob: audio.blob,
    });
    if (!result) return;
    setSession(result.session);
    if (result.session.status === "expired") {
      setExpiredOpen(true);
      return;
    }
    if (result.completed) {
      if (result.results) {
        window.sessionStorage.setItem(
          `mb.placement.v3.results.${result.session.sessionId}`,
          JSON.stringify(result.results),
        );
      } else {
        const fetched = await getResults(result.session.sessionId);
        window.sessionStorage.setItem(
          `mb.placement.v3.results.${result.session.sessionId}`,
          JSON.stringify(fetched),
        );
      }
      navigate(`/placement/results/${result.session.sessionId}`, { replace: true });
    }
  };

  const handleRetry = async () => {
    const result = await submitter.retry();
    if (!result) return;
    setSession(result.session);
  };

  const handleAbandon = async () => {
    if (session) await abandonSession(session.sessionId);
    navigate("/", { replace: true });
  };

  if (loading || !session) {
    return (
      <main id="main-content" tabIndex={-1} className="px-4 py-8">
        <LoadingPlaceholder />
      </main>
    );
  }

  if (!task) {
    return (
      <main id="main-content" tabIndex={-1} className="px-4 py-8">
        <LoadingPlaceholder label={{ en: "Preparing results", vi: "Đang chuẩn bị kết quả" }} />
      </main>
    );
  }

  return (
    <main id="main-content" tabIndex={-1} data-clarity-mask="true" className="min-h-[calc(100vh-72px)] bg-white">
      <ProgressStrip
        current={progress.answeredCount}
        total={progress.estimatedTotal}
        modality={progress.currentModality}
        modalities={progress.modalities}
      />

      <div className="mx-auto w-full max-w-[760px] px-4 py-5">
        <div className="mb-4 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            className="rounded-full text-slate-600"
            onClick={() => setAbandonOpen(true)}
            aria-label="Leave placement test · Rời bài kiểm tra trình độ"
          >
            Leave test · Rời bài
          </Button>
        </div>

        {task.type === "writing" ? (
          <WritingTaskCard task={task} value={answer} onChange={setAnswer} />
        ) : null}
        {task.type === "speaking" ? (
          <SpeakingTaskCard
            task={task}
            transcript={answer}
            onTranscriptChange={setAnswer}
            isRecording={audio.isRecording}
            permission={audio.permission}
            elapsedSeconds={audio.elapsedSeconds}
            onStart={audio.start}
            onStop={audio.stop}
            onRetake={() => {
              audio.retake();
              setAnswer("");
            }}
          />
        ) : null}
        {task.modality === "reading" ? (
          <ReadingTaskCard task={task} value={answer} onChange={setAnswer} />
        ) : null}
        {task.modality === "listening" ? (
          <ListeningTaskCard task={task} value={answer} onChange={setAnswer} />
        ) : null}
        {task.modality === "conversation" ? (
          <ConversationTaskCard task={task} value={answer} onChange={setAnswer} />
        ) : null}

        {(submitter.error || audio.error) ? (
          <div role="alert" className="mx-auto mt-4 flex max-w-[620px] items-start gap-3 rounded-[14px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <div>
              <div className="font-black">{submitter.error ?? audio.error}</div>
              <div className="mt-1 text-xs font-medium text-rose-700">
                Please try again, or use the typed-answer fallback for speaking.
                <span className="block">
                  Hãy thử lại, hoặc dùng phần gõ câu trả lời cho bài nói.
                </span>
              </div>
              {submitter.error && submitter.canRetry ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="mt-3 rounded-full bg-white"
                >
                  Retry submit · Gửi lại
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <Button
          type="button"
          disabled={!canSubmit || submitter.submitting}
          onClick={handleSubmit}
          aria-label={submitter.submitting ? "Submitting answer · Đang gửi câu trả lời" : "Submit answer · Gửi câu trả lời"}
          className="mx-auto flex min-h-12 w-full max-w-[620px] rounded-full text-base font-black"
        >
          {submitter.submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          Submit answer · Gửi câu trả lời
        </Button>
      </div>

      <AbandonConfirmModal
        open={abandonOpen}
        onOpenChange={setAbandonOpen}
        onKeepGoing={() => setAbandonOpen(false)}
        onAbandon={handleAbandon}
      />
      <SessionExpiredModal
        open={expiredOpen}
        onStartNew={() => navigate("/placement/who", { replace: true })}
      />
    </main>
  );
}
