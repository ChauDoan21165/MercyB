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
  en: "Leave this placement test?",
  vi: "Rời khỏi bài đánh giá này?",
  ja: "このプレイスメントテストを終了しますか？",
  id: "Tinggalkan tes penempatan ini?",
  th: "ออกจากการทดสอบวัดระดับนี้หรือไม่?",
  ar: "هل تريد مغادرة اختبار تحديد المستوى هذا؟",
  hi: "यह प्लेसमेंट परीक्षण छोड़ें?",
  ur: "اس پلیسمنٹ ٹیسٹ کو چھوڑیں؟",
  ko: "이 레벨 테스트를 그만둘까요?",
  zh: "离开此次分班测试？",
  pt: "Sair deste teste de nivelamento?",
  tr: "Bu seviye belirleme testinden ayrıl?",
};

const COPY_DESCRIPTION: PlacementNativeSlots = {
  en: "Your answers in this session will be discarded. You can start again when you are ready.",
  vi: "Các câu trả lời trong phiên này sẽ không được lưu. Bạn có thể làm lại khi sẵn sàng.",
  ja: "このセッションの回答は破棄されます。準備ができたら再度開始できます。",
  id: "Jawaban Anda dalam sesi ini akan dibuang. Anda dapat memulai lagi kapan pun Anda siap.",
  th: "คำตอบของคุณในเซสชันนี้จะถูกยกเลิก คุณสามารถเริ่มใหม่ได้เมื่อคุณพร้อม",
  ar: "سيتم التخلص من إجاباتك في هذه الجلسة. يمكنك البدء مرة أخرى عندما تكون مستعدًا.",
  hi: "इस सत्र में आपके उत्तर खारिज कर दिए जाएंगे। आप तैयार होने पर फिर से शुरू कर सकते हैं।",
  ur: "اس سیشن میں آپ کے جوابات ضائع ہو جائیں گے۔ جب آپ تیار ہوں تو دوبارہ شروع کر سکتے ہیں۔",
  ko: "이 세션의 답변은 삭제됩니다. 준비가 되면 다시 시작할 수 있습니다.",
  zh: "您在此会话中的答案将被丢弃。您可以在准备好后重新开始。",
  pt: "Suas respostas nesta sessão serão descartadas. Você pode começar novamente quando estiver pronto.",
  tr: "Bu oturumdaki cevaplarınız silinecek. Hazır olduğunuzda tekrar başlayabilirsiniz.",
};

const COPY_KEEP_GOING: PlacementNativeSlots = {
  en: "Keep testing",
  vi: "Tiếp tục",
  ja: "テストを続ける",
  id: "Lanjutkan tes",
  th: "ทำแบบทดสอบต่อ",
  ar: "استمر في الاختبار",
  hi: "परीक्षण जारी रखें",
  ur: "ٹیسٹ جاری رکھیں",
  ko: "테스트 계속하기",
  zh: "继续测试",
  pt: "Continuar teste",
  tr: "Teste devam et",
};

const COPY_LEAVE: PlacementNativeSlots = {
  en: "Leave",
  vi: "Rời khỏi",
  ja: "終了する",
  id: "Tinggalkan",
  th: "ออก",
  ar: "مغادرة",
  hi: "छोड़ें",
  ur: "چھوڑیں",
  ko: "나가기",
  zh: "离开",
  pt: "Sair",
  tr: "Ayrıl",
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onKeepGoing: () => void;
  onAbandon: () => void;
  busy?: boolean;
};

export function AbandonConfirmModal({
  open,
  onOpenChange,
  onKeepGoing,
  onAbandon,
  busy = false,
}: Props) {
  const showVi = useChromeLanguage() === "vi";
  const t = usePlacementT();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {showVi ? (
              <>
                Leave this placement test?
                <span className="mt-1 block text-sm font-medium text-slate-600">
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
                <span className="mt-2 block text-slate-600">
                  {COPY_DESCRIPTION.vi}
                </span>
              </>
            ) : (
              t(COPY_DESCRIPTION)
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button type="button" onClick={onKeepGoing} className="rounded-full" disabled={busy} autoFocus>
            {t(COPY_KEEP_GOING)}
          </Button>
          <Button type="button" variant="outline" onClick={onAbandon} className="rounded-full" disabled={busy}>
            {t(COPY_LEAVE)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AbandonConfirmModal;
