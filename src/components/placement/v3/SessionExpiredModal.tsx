import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useChromeLanguage } from "@/lib/i18n/chromeLanguage";
import { usePlacementT } from "@/components/placement/nativeCopy";
import type { PlacementNativeSlots } from "@/components/placement/nativeCopy";

const COPY_TITLE: PlacementNativeSlots = {
  en: "This session expired",
  vi: "Phiên đánh giá đã hết hạn",
  ja: "このセッションは期限切れです",
  id: "Sesi ini telah kedaluwarsa",
  th: "เซสชันนี้หมดอายุแล้ว",
  ar: "انتهت صلاحية هذه الجلسة",
  hi: "यह सत्र समाप्त हो गया है",
  ur: "اس سیشن کی میعاد ختم ہو گئی ہے",
  ko: "이 세션이 만료되었습니다",
  zh: "此会话已过期",
  pt: "Esta sessão expirou",
  tr: "Bu oturumun süresi doldu",
};

const COPY_DESCRIPTION: PlacementNativeSlots = {
  en: "Start a fresh placement test so your level is based on one complete attempt.",
  vi: "Hãy bắt đầu bài mới để kết quả dựa trên một lần làm hoàn chỉnh.",
  ja: "新しいテストを開始してください。1回の完全な受験に基づいてレベルが判定されます。",
  id: "Mulai tes penempatan baru agar level Anda didasarkan pada satu percobaan lengkap.",
  th: "เริ่มการทดสอบวัดระดับใหม่เพื่อให้ระดับของคุณอิงจากความพยายามที่สมบูรณ์เพียงครั้งเดียว",
  ar: "ابدأ اختبار تحديد مستوى جديد بحيث يعتمد مستواك على محاولة كاملة واحدة.",
  hi: "एक नया प्लेसमेंट परीक्षण शुरू करें ताकि आपका स्तर एक पूर्ण प्रयास पर आधारित हो।",
  ur: "ایک نیا پلیسمنٹ ٹیسٹ شروع کریں تاکہ آپ کی سطح ایک مکمل کوشش پر مبنی ہو۔",
  ko: "새 레벨 테스트를 시작하여 하나의 완전한 응시 결과를 바탕으로 레벨을 측정하세요.",
  zh: "开始一个新的分班测试，这样您的水平将基于一次完整的测试。",
  pt: "Inicie um novo teste de nivelamento para que seu nível seja baseado em uma tentativa completa.",
  tr: "Seviyenizin tek bir tam denemeye dayanması için yeni bir seviye belirleme testi başlatın.",
};

const COPY_START_NEW: PlacementNativeSlots = {
  en: "Start new test",
  vi: "Bắt đầu bài mới",
  ja: "新しいテストを開始",
  id: "Mulai tes baru",
  th: "เริ่มแบบทดสอบใหม่",
  ar: "ابدأ اختبارًا جديدًا",
  hi: "नया परीक्षण शुरू करें",
  ur: "نیا ٹیسٹ شروع کریں",
  ko: "새 테스트 시작",
  zh: "开始新测试",
  pt: "Iniciar novo teste",
  tr: "Yeni test başlat",
};

type Props = {
  open: boolean;
  onStartNew: () => void;
};

export function SessionExpiredModal({ open, onStartNew }: Props) {
  const showVi = useChromeLanguage() === "vi";
  const t = usePlacementT();

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {showVi ? (
              <>
                This session expired
                <span className="mt-1 block text-sm font-medium text-slate-500">
                  {COPY_TITLE.vi}
                </span>
              </>
            ) : (
              t(COPY_TITLE)
            )}
          </DialogTitle>
          <DialogDescription>
            {showVi ? (
              <>
                {COPY_DESCRIPTION.en}
                <span className="mt-2 block text-slate-500">
                  {COPY_DESCRIPTION.vi}
                </span>
              </>
            ) : (
              t(COPY_DESCRIPTION)
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" onClick={onStartNew} className="w-full rounded-full" autoFocus>
            {t(COPY_START_NEW)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SessionExpiredModal;
