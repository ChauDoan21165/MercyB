import { Mic, RotateCcw, Square, Type } from "lucide-react";
import type { PlacementV3Task } from "@/lib/placement/v3/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import GenericTaskCard from "./GenericTaskCard";
import { useChromeT, useChromeLanguage } from "@/lib/i18n/chromeLanguage";
import { usePlacementT } from "@/components/placement/nativeCopy";
import type { PlacementNativeSlots } from "@/components/placement/nativeCopy";

const COPY_RECORD: PlacementNativeSlots = {
  en: "Record your answer",
  vi: "Ghi âm câu trả lời",
  ja: "回答を録音",
  id: "Rekam jawaban",
  th: "บันทึกคำตอบของคุณ",
  ar: "سجل إجابتك",
  hi: "अपना उत्तर रिकॉर्ड करें",
  ur: "اپنا جواب ریکارڈ کریں",
  ko: "답변 녹음",
  zh: "录制你的回答",
  pt: "Grave sua resposta",
  tr: "Cevabınızı kaydedin",
};

const COPY_MIC_UNAVAILABLE: PlacementNativeSlots = {
  en: "Microphone unavailable",
  vi: "Không dùng được micro",
  ja: "マイクが利用できません",
  id: "Mikrofon tidak tersedia",
  th: "ไมโครโฟนไม่พร้อมใช้งาน",
  ar: "الميكروفون غير متاح",
  hi: "माइक्रोफ़ोन उपलब्ध नहीं है",
  ur: "مائکروفون دستیاب نہیں",
  ko: "마이크를 사용할 수 없음",
  zh: "麦克风不可用",
  pt: "Microfone indisponível",
  tr: "Mikrofon kullanılamıyor",
};

const COPY_TRANSCRIPT_LABEL: PlacementNativeSlots = {
  en: "Transcript or typed answer",
  vi: "Nội dung nói hoặc câu trả lời gõ",
  ja: "文字起こしまたは入力回答",
  id: "Transkrip atau jawaban ketik",
  th: "คำถอดเสียงหรือคำตอบที่พิมพ์",
  ar: "نص أو إجابة مكتوبة",
  hi: "ट्रांसक्रिप्ट या टाइप किया गया उत्तर",
  ur: "نقل یا ٹائپ کردہ جواب",
  ko: "전사문 또는 입력 답변",
  zh: "转录或打字回答",
  pt: "Transcrição ou resposta digitada",
  tr: "Döküm veya yazılı cevap",
};

const COPY_STOP: PlacementNativeSlots = {
  en: "Stop",
  vi: "Dừng",
  ja: "停止",
  id: "Berhenti",
  th: "หยุด",
  ar: "إيقاف",
  hi: "रोकें",
  ur: "روکیں",
  ko: "중단",
  zh: "停止",
  pt: "Parar",
  tr: "Durdur",
};

const COPY_RECORD_BTN: PlacementNativeSlots = {
  en: "Record",
  vi: "Ghi âm",
  ja: "録音",
  id: "Rekam",
  th: "บันทึก",
  ar: "تسجيل",
  hi: "रिकॉर्ड करें",
  ur: "ریکارڈ",
  ko: "녹음",
  zh: "录音",
  pt: "Gravar",
  tr: "Kaydet",
};

const COPY_RETAKE: PlacementNativeSlots = {
  en: "Retake",
  vi: "Làm lại",
  ja: "録り直す",
  id: "Ulang",
  th: "ทำใหม่",
  ar: "إعادة",
  hi: "दोबारा लें",
  ur: "دوبارہ لیں",
  ko: "다시 녹음",
  zh: "重录",
  pt: "Refazer",
  tr: "Yeniden kaydet",
};

const STOP_LABELS: PlacementNativeSlots = {
  en: "Stop recording",
  vi: "Dừng ghi âm",
  ja: "録音を停止",
  id: "Hentikan perekaman",
  th: "หยุดบันทึก",
  ar: "إيقاف التسجيل",
  hi: "रिकॉर्डिंग रोकें",
  ur: "ریکارڈنگ روکیں",
  ko: "녹음 중단",
  zh: "停止录音",
  pt: "Parar gravação",
  tr: "Kaydı durdur",
};

const START_LABELS: PlacementNativeSlots = {
  en: "Start recording",
  vi: "Bắt đầu ghi âm",
  ja: "録音を開始",
  id: "Mulai merekam",
  th: "เริ่มบันทึก",
  ar: "بدء التسجيل",
  hi: "रिकॉर्डिंग शुरू करें",
  ur: "ریکارڈنگ شروع کریں",
  ko: "녹음 시작",
  zh: "开始录音",
  pt: "Iniciar gravação",
  tr: "Kaydı başlat",
};

const RECORDING_CONTROLS_LABEL: PlacementNativeSlots = {
  en: "Recording controls",
  vi: "Điều khiển ghi âm",
  ja: "録音コントロール",
  id: "Kontrol perekaman",
  th: "ควบคุมการบันทึก",
  ar: "عناصر التحكم في التسجيل",
  hi: "रिकॉर्डिंग नियंत्रण",
  ur: "ریکارڈنگ کنٹرولز",
  ko: "녹음 컨트롤",
  zh: "录音控制",
  pt: "Controles de gravação",
  tr: "Kayıt kontrolleri",
};

const RETAKE_LABEL: PlacementNativeSlots = {
  en: "Retake answer",
  vi: "Làm lại câu trả lời",
  ja: "回答を録り直す",
  id: "Ulang jawaban",
  th: "ทำคำตอบใหม่",
  ar: "إعادة الإجابة",
  hi: "उत्तर दोबारा लें",
  ur: "جواب دوبارہ لیں",
  ko: "답변 다시 녹음",
  zh: "重录答案",
  pt: "Refazer resposta",
  tr: "Cevabı yeniden kaydet",
};

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
  const t = useChromeT();
  const pt = usePlacementT();
  const showVi = useChromeLanguage() === "vi";
  const fallback = permission === "denied";

  return (
    <GenericTaskCard instruction={task.instruction} prompt={task.prompt}>
      <div className="rounded-[16px] border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-black text-slate-800">
              {fallback ? pt(COPY_MIC_UNAVAILABLE) : pt(COPY_RECORD)}
            </div>
            {showVi && (
              <div className="text-xs font-medium text-slate-600">
                {fallback ? COPY_MIC_UNAVAILABLE.vi : COPY_RECORD.vi}
              </div>
            )}
          </div>
          <div className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-700">
            {elapsedSeconds}s
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2" role="group" aria-label={pt(RECORDING_CONTROLS_LABEL)}>
          {isRecording ? (
            <Button type="button" onClick={onStop} aria-label={pt(STOP_LABELS)} className="rounded-full bg-rose-600 hover:bg-rose-700">
              <Square className="h-4 w-4" aria-hidden />
              {pt(COPY_STOP)}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onStart}
              aria-label={pt(START_LABELS)}
              className="rounded-full"
              disabled={fallback}
            >
              <Mic className="h-4 w-4" aria-hidden />
              {pt(COPY_RECORD_BTN)}
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onRetake} aria-label={pt(RETAKE_LABEL)} className="rounded-full">
            <RotateCcw className="h-4 w-4" aria-hidden />
            {pt(COPY_RETAKE)}
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="placement-speaking-transcript"
          className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700"
        >
          <Type className="h-4 w-4" aria-hidden />
          {pt(COPY_TRANSCRIPT_LABEL)}
        </label>
        <Textarea
          id="placement-speaking-transcript"
          value={transcript}
          onChange={(event) => onTranscriptChange(event.target.value)}
          className="min-h-[120px] rounded-[14px] border-slate-200 text-base leading-relaxed"
          placeholder={
            showVi
              ? "Type what you said if transcription is not available... / Nếu chưa có bản chép, hãy gõ ý bạn muốn nói..."
              : "Type what you said if transcription is not available..."
          }
        />
      </div>
    </GenericTaskCard>
  );
}

export default SpeakingTaskCard;
