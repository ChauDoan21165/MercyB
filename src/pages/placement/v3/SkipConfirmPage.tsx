import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BilingualLabel } from "@/components/placement/v3";
import { usePlacementT } from "@/components/placement/nativeCopy";
import type { PlacementNativeSlots } from "@/components/placement/nativeCopy";

const SKIP_HEADING: PlacementNativeSlots = {
  en: "Skip placement test?",
  vi: "Bỏ qua bài đánh giá?",
  ja: "プレイスメントテストをスキップしますか？",
  id: "Lewati tes penempatan?",
  th: "ข้ามการทดสอบวัดระดับหรือไม่?",
  ar: "هل تريد تخطي اختبار تحديد المستوى؟",
  hi: "प्लेसमेंट परीक्षण छोड़ें?",
  ur: "پلیسمنٹ ٹیسٹ چھوڑیں؟",
  ko: "레벨 테스트를 건너뛸까요?",
  zh: "跳过分班测试？",
  pt: "Pular o teste de nivelamento?",
  tr: "Seviye belirleme testini atla?",
};

const SKIP_DESC: PlacementNativeSlots = {
  en: "You can take it later from your Account page.",
  vi: "Bạn có thể làm bài này sau từ trang Tài khoản.",
  ja: "後でアカウントページから受けることができます。",
  id: "Anda dapat mengikutinya nanti dari halaman Akun.",
  th: "คุณสามารถทำได้ทีหลังจากหน้า บัญชี ของคุณ",
  ar: "يمكنك إجراؤه لاحقًا من صفحة الحساب الخاص بك.",
  hi: "आप इसे बाद में अपने खाता पृष्ठ से ले सकते हैं।",
  ur: "آپ اسے بعد میں اپنے اکاؤنٹ کے صفحے سے لے سکتے ہیں۔",
  ko: "계정 페이지에서 나중에 응시할 수 있습니다.",
  zh: "您可以稍后从账户页面参加测试。",
  pt: "Você pode fazer depois pela página da sua Conta.",
  tr: "Daha sonra Hesap sayfanızdan girebilirsiniz.",
};

const KEEP_TESTING_BUTTON: PlacementNativeSlots = {
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

const SKIP_BUTTON: PlacementNativeSlots = {
  en: "Yes, skip",
  vi: "Có, bỏ qua",
  ja: "はい、スキップ",
  id: "Ya, lewati",
  th: "ใช่ ข้าม",
  ar: "نعم، تخط",
  hi: "हाँ, छोड़ें",
  ur: "ہاں، چھوڑیں",
  ko: "네, 건너뛰기",
  zh: "是的，跳过",
  pt: "Sim, pular",
  tr: "Evet, atla",
};

export default function SkipConfirmPage() {
  const navigate = useNavigate();
  const pt = usePlacementT();
  return (
    <main className="flex min-h-[calc(100vh-72px)] justify-center px-4 py-8">
      <section className="w-full max-w-[520px] rounded-[18px] border border-slate-200 bg-white p-6 text-center shadow-sm">
        <BilingualLabel
          as="h1"
          text={{ en: SKIP_HEADING.en ?? "Skip placement test?", vi: SKIP_HEADING.vi ?? "" }}
          enClassName="text-2xl font-black text-slate-950"
          viClassName="text-sm font-medium text-slate-500"
        />
        <BilingualLabel
          as="p"
          className="mt-4"
          text={{
            en: SKIP_DESC.en ?? "You can take it later from your Account page.",
            vi: SKIP_DESC.vi ?? "",
          }}
          enClassName="text-sm font-semibold leading-6 text-slate-600"
          viClassName="text-xs font-medium leading-5 text-slate-500"
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button type="button" className="rounded-full" onClick={() => navigate("/placement")}>
            {pt(KEEP_TESTING_BUTTON)}
          </Button>
          <Button type="button" variant="outline" className="rounded-full" onClick={() => navigate("/", { replace: true })}>
            {pt(SKIP_BUTTON)}
          </Button>
        </div>
      </section>
    </main>
  );
}
