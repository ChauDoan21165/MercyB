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
  en: "Skip placement test?",
  vi: "Bỏ qua bài đánh giá?",
  ja: "プレイスメントテストをスキップしますか？",
  id: "Lewati tes penempatan?",
  th: "ข้ามการทดสอบวัดระดับหรือไม่?",
  ar: "هل تريد تخطي اختبار تحديد المستوى؟",
  hi: "प्लेसमेंट परीक्षण छोड़ें?",
  ur: "پلیسمنٹ ٹیسٹ چھوڑیں؟",
  ko: "레벨 테스트를 건너뛸까요?",
  zh: "跳过分级测试？",
  pt: "Pular o teste de nivelamento?",
  tr: "Seviye belirleme testini atla?",
};

const COPY_DESCRIPTION: PlacementNativeSlots = {
  en: "You can take it anytime from your Account page, and Mercy will recommend a starting lesson whenever you are ready.",
  vi: "Bạn có thể làm bất cứ lúc nào từ trang Tài khoản, và Mercy sẽ gợi ý bài học phù hợp khi bạn sẵn sàng.",
  ja: "いつでもアカウントページから受けることができます。準備ができたら、Mercyが最初のレッスンを提案します。",
  id: "Anda dapat mengikutinya kapan saja dari halaman Akun, dan Mercy akan merekomendasikan pelajaran awal kapan pun Anda siap.",
  th: "คุณสามารถทำได้ทุกเวลาจากหน้า บัญชี ของคุณ และ Mercy จะแนะนำบทเรียนเริ่มต้นเมื่อคุณพร้อม",
  ar: "يمكنك إجراؤه في أي وقت من صفحة الحساب الخاص بك، وسيوصي Mercy بدرس بداية عندما تكون مستعدًا.",
  hi: "आप इसे कभी भी अपने खाता पृष्ठ से ले सकते हैं, और Mercy जब भी आप तैयार होंगे तब एक शुरुआती पाठ की सिफारिश करेगा।",
  ur: "آپ اسے کسی بھی وقت اپنے اکاؤنٹ کے صفحے سے لے سکتے ہیں، اور Mercy جب بھی آپ تیار ہوں گے شروع کرنے کا سبق تجویز کرے گا۔",
  ko: "계정 페이지에서 언제든지 응시할 수 있으며, 준비가 되면 Mercy가 시작 레슨을 추천해드립니다.",
  zh: "您可以随时从您的账户页面参加测试，当您准备好时，Mercy会为您推荐起始课程。",
  pt: "Você pode fazer a qualquer momento na página da sua Conta, e a Mercy recomendará uma aula inicial quando estiver pronto.",
  tr: "İstediğiniz zaman Hesap sayfanızdan girebilirsiniz ve Mercy hazır olduğunuzda bir başlangıç dersi önerecektir.",
};

const COPY_KEEP_TESTING: PlacementNativeSlots = {
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

const COPY_SKIP: PlacementNativeSlots = {
  en: "Yes, skip",
  vi: "Có, bỏ qua",
  ja: "はい、スキップする",
  id: "Ya, lewati",
  th: "ใช่ ข้าม",
  ar: "نعم، تخط",
  hi: "हाँ, छोड़ें",
  ur: "ہاں، چھوڑیں",
  ko: "네, 건너뛸게요",
  zh: "是的，跳过",
  pt: "Sim, pular",
  tr: "Evet, atla",
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onKeepTesting: () => void;
  onSkip: () => void;
};

export function SkipForNowModal({ open, onOpenChange, onKeepTesting, onSkip }: Props) {
  const showVi = useChromeLanguage() === "vi";
  const t = usePlacementT();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {showVi ? (
              <>
                Skip placement test?
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
          <Button type="button" onClick={onKeepTesting} className="rounded-full" autoFocus>
            {t(COPY_KEEP_TESTING)}
          </Button>
          <Button type="button" variant="outline" onClick={onSkip} className="rounded-full">
            {t(COPY_SKIP)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SkipForNowModal;
