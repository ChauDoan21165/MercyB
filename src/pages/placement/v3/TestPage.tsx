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
import type { PlacementV3AnswerMode, PlacementV3MediaStatus, PlacementV3Session, PlacementV3Task } from "@/lib/placement/v3/types";
import {
  usePlacementAudioCapture,
  usePlacementProgress,
  usePlacementSubmit,
} from "@/hooks/placement/v3";
import { useChromeT, useChromeLanguage } from "@/lib/i18n/chromeLanguage";
import { usePlacementT } from "@/components/placement/nativeCopy";
import type { PlacementNativeSlots } from "@/components/placement/nativeCopy";
import { openSignal } from "@/lib/telemetry/signalCell";

function minAnswerLength(task: PlacementV3Task) {
  if (task.type === "writing") return 40;
  if (task.type === "speaking") return 12;
  if (task.type === "conversation") return 8;
  return 1;
}


function answerModeFor(task: PlacementV3Task, hasAudio: boolean): PlacementV3AnswerMode {
  if (task.type === "speaking") return hasAudio ? "recorded_audio" : "typed_fallback";
  if (task.options?.length) return "selected_option";
  return "typed";
}

export default function TestPage() {
  const { sessionId = "" } = useParams();
  const navigate = useNavigate();
  const t = useChromeT();
  const pt = usePlacementT();
  const showVi = useChromeLanguage() === "vi";
  const [session, setSession] = useState<PlacementV3Session | null>(null);
  const [answer, setAnswer] = useState("");
  const [listeningMediaStatus, setListeningMediaStatus] = useState<PlacementV3MediaStatus>("not_required");
  const [listeningDurationSeconds, setListeningDurationSeconds] = useState<number | undefined>();
  const [listeningPlaybackError, setListeningPlaybackError] = useState<string | undefined>();
  const [taskStartedAt, setTaskStartedAt] = useState(() => Date.now());
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
    setTaskStartedAt(Date.now());
  }, [session?.currentTask?.id]);

  const task = session?.currentTask ?? null;

  // A session with no current task is an exit, never a resting place. If the
  // session finished, leave for the results route — this is the path a resumed
  // completed session takes, which previously parked on the spinner forever.
  // Anything else is a dead end (server gave no next task but did not complete)
  // and renders an actionable error below rather than a terminal spinner.
  const awaitingResults = !loading && !!session && !task && session.status === "completed";
  const deadEnd = !loading && !!session && !task && session.status !== "completed";

  useEffect(() => {
    if (!awaitingResults || !session) return;
    navigate(`/placement/results/${session.sessionId}`, { replace: true });
  }, [awaitingResults, navigate, session]);

  // Cell covers the hand-off to the results route. A stuck navigate still emits
  // failed{timeout}. The dead-end branch is already reported as an invariant by
  // clientStub (`no_next_task_and_not_complete`), so it opens no second cell.
  useEffect(() => {
    if (!awaitingResults || !session) return;
    const cell = openSignal("PLACEMENT_RENDER_RESULTS", {
      context: {
        session_id: session.sessionId,
        session_status: session.status,
        answered_count: session.answeredCount,
      },
    });
    return () => cell.cancel();
  }, [awaitingResults, session]);

  useEffect(() => {
    if (!task) {
      setListeningMediaStatus("not_required");
      return;
    }
    setListeningMediaStatus(task.modality === "listening" ? (task.audioUrl ? "loading" : "missing") : "not_required");
    setListeningDurationSeconds(undefined);
    setListeningPlaybackError(undefined);
  }, [task?.id, task?.audioUrl, task?.modality]);
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
      answerMode: answerModeFor(task, Boolean(audio.blob)),
      mediaStatus: task.modality === "listening" ? listeningMediaStatus : "not_required",
      scoreEligible: task.modality !== "listening" || listeningMediaStatus === "playable",
      requestedAudioUrl: task.modality === "listening" ? task.audioUrl : undefined,
      audioDurationSeconds: task.modality === "listening" ? listeningDurationSeconds : undefined,
      audioPlaybackError: task.modality === "listening" ? listeningPlaybackError : undefined,
      speechPermission: task.modality === "speaking" ? audio.permission : undefined,
      elapsedMs: Math.max(0, Date.now() - taskStartedAt),
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

  // Completed → the effect above is navigating to results. This spinner is a
  // one-frame hand-off, not a resting state.
  if (awaitingResults) {
    return (
      <main id="main-content" tabIndex={-1} className="px-4 py-8">
        <LoadingPlaceholder label={{ en: "Preparing results", vi: "Đang chuẩn bị kết quả" }} />
      </main>
    );
  }

  // Dead end: no next task, but the session never completed. Give the user a way
  // out instead of an indefinite spinner.
  if (deadEnd) {
    return (
      <main id="main-content" tabIndex={-1} className="px-4 py-8">
        <div
          role="alert"
          className="mx-auto flex max-w-[620px] items-start gap-3 rounded-[14px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <div>
            <div className="font-black">
              {pt({
                en: "We could not load the next question.",
                vi: "Không tải được câu hỏi tiếp theo.",
                ja: "次の問題を読み込めませんでした。",
                id: "Tidak dapat memuat pertanyaan berikutnya.",
                th: "ไม่สามารถโหลดคำถามถัดไปได้",
                ar: "تعذر تحميل السؤال التالي.",
                hi: "अगला प्रश्न लोड नहीं हो सका।",
                ur: "اگلا سوال لوڈ نہیں ہو سکا۔",
                ko: "다음 문제를 불러오지 못했습니다.",
                zh: "无法加载下一道题。",
                pt: "Não foi possível carregar a próxima pergunta.",
                tr: "Sonraki soru yüklenemedi.",
              })}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate("/placement/who", { replace: true })}
              className="mt-3 rounded-full bg-white"
            >
              {pt({
                en: "Start a new test",
                vi: "Bắt đầu bài mới",
                ja: "新しいテストを開始",
                id: "Mulai tes baru",
                th: "เริ่มการทดสอบใหม่",
                ar: "ابدأ اختبارًا جديدًا",
                hi: "नया परीक्षण शुरू करें",
                ur: "نیا ٹیسٹ شروع کریں",
                ko: "새 테스트 시작",
                zh: "开始新测试",
                pt: "Iniciar um novo teste",
                tr: "Yeni test başlat",
              })}
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (!task) {
    return (
      <main id="main-content" tabIndex={-1} className="px-4 py-8">
        <LoadingPlaceholder />
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
            aria-label={pt({
              en: "Leave placement test",
              vi: "Rời bài kiểm tra trình độ",
              ja: "プレイスメントテストを終了",
              id: "Tinggalkan tes penempatan",
              th: "ออกจากการทดสอบวัดระดับ",
              ar: "مغادرة اختبار تحديد المستوى",
              hi: "प्लेसमेंट परीक्षण छोड़ें",
              ur: "پلیسمنٹ ٹیسٹ چھوڑیں",
              ko: "레벨 테스트 나가기",
              zh: "离开分班测试",
              pt: "Sair do teste de nivelamento",
              tr: "Seviye belirleme testinden ayrıl",
            })}
          >
            {pt({
              en: "Leave test",
              vi: "Rời bài",
              ja: "テストを終了",
              id: "Tinggalkan tes",
              th: "ออกจากแบบทดสอบ",
              ar: "مغادرة الاختبار",
              hi: "परीक्षण छोड़ें",
              ur: "ٹیسٹ چھوڑیں",
              ko: "테스트 나가기",
              zh: "离开测试",
              pt: "Sair do teste",
              tr: "Testten ayrıl",
            })}
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
          <ListeningTaskCard
            task={task}
            value={answer}
            onChange={setAnswer}
            onMediaStatusChange={(status, details) => {
              setListeningMediaStatus(status);
              setListeningDurationSeconds(details?.durationSeconds);
              setListeningPlaybackError(details?.playbackError);
            }}
          />
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
                {pt({
                  en: "Please try again, or use the typed-answer fallback for speaking.",
                  vi: "Hãy thử lại, hoặc dùng phần gõ câu trả lời cho bài nói.",
                  ja: "もう一度試すか、代わりに回答を入力してください。",
                  id: "Silakan coba lagi, atau gunakan jawaban ketik sebagai alternatif.",
                  th: "โปรดลองอีกครั้ง หรือใช้การพิมพ์คำตอบแทน",
                  ar: "يرجى المحاولة مرة أخرى، أو استخدم كتابة الإجابة كبديل.",
                  hi: "कृपया पुनः प्रयास करें, या टाइप किए गए उत्तर का उपयोग करें।",
                  ur: "براہ کرم دوبارہ کوشش کریں، یا ٹائپ کردہ جواب استعمال کریں۔",
                  ko: "다시 시도하거나 답변 입력을 대신 사용해 주세요.",
                  zh: "请重试，或改用键盘输入答案。",
                  pt: "Tente novamente ou use a digitação como alternativa.",
                  tr: "Lütfen tekrar deneyin veya yazılı cevap alternatifini kullanın.",
                })}
              </div>
              {submitter.error && submitter.canRetry ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="mt-3 rounded-full bg-white"
                >
                  {pt({
                    en: "Retry submit",
                    vi: "Gửi lại",
                    ja: "再送信",
                    id: "Kirim ulang",
                    th: "ส่งอีกครั้ง",
                    ar: "إعادة الإرسال",
                    hi: "पुनः सबमिट करें",
                    ur: "دوبارہ جمع کریں",
                    ko: "다시 제출",
                    zh: "重新提交",
                    pt: "Reenviar",
                    tr: "Yeniden gönder",
                  })}
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
          aria-label={
            submitter.submitting
              ? pt({ en: "Submitting answer", vi: "Đang gửi câu trả lời", ja: "回答を送信中", id: "Mengirim jawaban", th: "กำลังส่งคำตอบ", ar: "جارٍ إرسال الإجابة", hi: "उत्तर सबमिट हो रहा है", ur: "جمع کر رہا ہے", ko: "답변 제출 중", zh: "正在提交答案", pt: "Enviando resposta", tr: "Cevap gönderiliyor" })
              : pt({ en: "Submit answer", vi: "Gửi câu trả lời", ja: "回答を送信", id: "Kirim jawaban", th: "ส่งคำตอบ", ar: "إرسال الإجابة", hi: "उत्तर सबमिट करें", ur: "جواب جمع کریں", ko: "답변 제출", zh: "提交答案", pt: "Enviar resposta", tr: "Cevabı gönder" })
          }
          className="mx-auto flex min-h-12 w-full max-w-[620px] rounded-full text-base font-black"
        >
          {submitter.submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          {submitter.submitting
            ? pt({ en: "Submitting answer", vi: "Đang gửi câu trả lời", ja: "回答を送信中", id: "Mengirim jawaban", th: "กำลังส่งคำตอบ", ar: "جارٍ إرسال الإجابة", hi: "उत्तर सबमिट हो रहा है", ur: "جمع کر رہا ہے", ko: "답변 제출 중", zh: "正在提交答案", pt: "Enviando resposta", tr: "Cevap gönderiliyor" })
            : pt({ en: "Submit answer", vi: "Gửi câu trả lời", ja: "回答を送信", id: "Kirim jawaban", th: "ส่งคำตอบ", ar: "إرسال الإجابة", hi: "उत्तर सबमिट करें", ur: "جواب جمع کریں", ko: "답변 제출", zh: "提交答案", pt: "Enviar resposta", tr: "Cevabı gönder" })
          }
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
