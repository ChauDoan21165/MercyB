import { Mic, RotateCcw, Square, Type } from "lucide-react";
import type { PlacementV3Task } from "@/lib/placement/v3/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import GenericTaskCard from "./GenericTaskCard";

type Props = {
  task: PlacementV3Task;
  transcript: string;
  onTranscriptChange: (value: string) => void;
  isRecording: boolean;
  permission: "unknown" | "granted" | "denied";
  elapsedSeconds: number;
  onStart: () => void;
  onStop: () => void;
  onRetake: () => void;
};

export function SpeakingTaskCard({
  task,
  transcript,
  onTranscriptChange,
  isRecording,
  permission,
  elapsedSeconds,
  onStart,
  onStop,
  onRetake,
}: Props) {
  const fallback = permission === "denied";

  return (
    <GenericTaskCard instruction={task.instruction} prompt={task.prompt}>
      <div className="rounded-[16px] border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-black text-slate-800">
              {fallback ? "Microphone unavailable" : "Record your answer"}
            </div>
            <div className="text-xs font-medium text-slate-500">
              {fallback ? "Không dùng được micro" : "Ghi âm câu trả lời"}
            </div>
          </div>
          <div className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-700">
            {elapsedSeconds}s
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {isRecording ? (
            <Button type="button" onClick={onStop} className="rounded-full bg-rose-600 hover:bg-rose-700">
              <Square className="h-4 w-4" aria-hidden />
              Stop · Dừng
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onStart}
              className="rounded-full"
              disabled={fallback}
            >
              <Mic className="h-4 w-4" aria-hidden />
              Record · Ghi âm
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onRetake} className="rounded-full">
            <RotateCcw className="h-4 w-4" aria-hidden />
            Retake · Làm lại
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="placement-speaking-transcript"
          className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700"
        >
          <Type className="h-4 w-4" aria-hidden />
          Transcript or typed answer · Nội dung nói hoặc câu trả lời gõ
        </label>
        <Textarea
          id="placement-speaking-transcript"
          value={transcript}
          onChange={(event) => onTranscriptChange(event.target.value)}
          className="min-h-[120px] rounded-[14px] border-slate-200 text-base leading-relaxed"
          placeholder="Type what you said if transcription is not available... / Nếu chưa có bản chép, hãy gõ ý bạn muốn nói..."
        />
      </div>
    </GenericTaskCard>
  );
}

export default SpeakingTaskCard;
