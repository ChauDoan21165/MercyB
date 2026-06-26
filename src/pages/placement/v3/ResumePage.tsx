import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BilingualLabel, LoadingPlaceholder } from "@/components/placement/v3";
import { usePlacementResume, usePlacementSessionV3 } from "@/hooks/placement/v3";
import { usePlacementT } from "@/components/placement/nativeCopy";
import type { PlacementNativeSlots } from "@/components/placement/nativeCopy";

const LOADING_CHECKING: PlacementNativeSlots = {
  en: "Checking for an unfinished test",
  vi: "Đang kiểm tra bài còn dang dở",
  ja: "未完了のテストを確認中",
  id: "Memeriksa tes yang belum selesai",
  th: "กำลังตรวจสอบแบบทดสอบที่ยังไม่เสร็จ",
  ar: "جارٍ التحقق من وجود اختبار غير مكتمل",
  hi: "अधूरे परीक्षण की जाँच हो रही है",
  ur: "نامکمل ٹیسٹ کی جانچ ہو رہی ہے",
  ko: "완료되지 않은 테스트 확인 중",
  zh: "正在检查未完成的测试",
  pt: "Verificando teste não concluído",
  tr: "Tamamlanmamış test kontrol ediliyor",
};

const RESUME_HEADING: PlacementNativeSlots = {
  en: "Resume your placement test?",
  vi: "Tiếp tục bài đánh giá dang dở?",
  ja: "プレイスメントテストを再開しますか？",
  id: "Lanjutkan tes penempatan Anda?",
  th: "ทำแบบทดสอบวัดระดับต่อหรือไม่?",
  ar: "هل تريد استئناف اختبار تحديد المستوى؟",
  hi: "अपना प्लेसमेंट परीक्षण जारी रखें?",
  ur: "اپنا پلیسمنٹ ٹیسٹ جاری رکھیں؟",
  ko: "레벨 테스트를 계속하시겠습니까?",
  zh: "继续您的分班测试？",
  pt: "Continuar seu teste de nivelamento?",
  tr: "Seviye belirleme testine devam et?",
};

const NO_RESUME_HEADING: PlacementNativeSlots = {
  en: "No unfinished test found",
  vi: "Không có bài dang dở",
  ja: "未完了のテストはありません",
  id: "Tidak ada tes yang belum selesai",
  th: "ไม่พบแบบทดสอบที่ยังไม่เสร็จ",
  ar: "لم يتم العثور على اختبار غير مكتمل",
  hi: "कोई अधूरा परीक्षण नहीं मिला",
  ur: "کوئی نامکمل ٹیسٹ نہیں ملا",
  ko: "완료되지 않은 테스트가 없습니다",
  zh: "未发现未完成的测试",
  pt: "Nenhum teste não concluído encontrado",
  tr: "Tamamlanmamış test bulunamadı",
};

const RESUME_DESC: PlacementNativeSlots = {
  en: "You have an in-progress session. Continuing keeps your answers together for a more reliable profile.",
  vi: "Bạn có một phiên đang làm. Tiếp tục sẽ giữ các câu trả lời trong cùng một hồ sơ để kết quả đáng tin cậy hơn.",
  ja: "進行中のセッションがあります。続けると回答がまとまり、より信頼性の高いプロファイルが得られます。",
  id: "Anda memiliki sesi yang sedang berjalan. Melanjutkan akan menyimpan jawaban Anda bersama untuk profil yang lebih andal.",
  th: "คุณมีเซสชันที่กำลังดำเนินอยู่ การดำเนินการต่อจะเก็บคำตอบของคุณไว้ด้วยกันเพื่อโปรไฟล์ที่น่าเชื่อถือยิ่งขึ้น",
  ar: "لديك جلسة قيد التقدم. الاستمرار يحافظ على إجاباتك معًا للحصول على ملف أكثر موثوقية.",
  hi: "आपका एक चालू सत्र है। जारी रखने से आपके उत्तर एक साथ रहेंगे और अधिक विश्वसनीय प्रोफ़ाइल मिलेगी।",
  ur: "آپ کا ایک فعال سیشن ہے۔ جاری رکھنے سے آپ کے جوابات ایک ساتھ رہیں گے اور زیادہ قابل اعتماد پروفائل ملے گا۔",
  ko: "진행 중인 세션이 있습니다. 계속하면 답변이 함께 유지되어 더 신뢰할 수 있는 프로필을 얻을 수 있습니다.",
  zh: "您有一个进行中的会话。继续测试将保留您的所有答案，以获得更可靠的学习档案。",
  pt: "Você tem uma sessão em andamento. Continuar mantém suas respostas juntas para um perfil mais confiável.",
  tr: "Devam eden bir oturumunuz var. Devam etmek cevaplarınızı bir arada tutarak daha güvenilir bir profil sağlar.",
};

const NO_RESUME_DESC: PlacementNativeSlots = {
  en: "Start a fresh placement test when you are ready.",
  vi: "Hãy bắt đầu bài đánh giá mới khi bạn sẵn sàng.",
  ja: "準備ができたら新しいテストを始めてください。",
  id: "Mulai tes penempatan baru saat Anda siap.",
  th: "เริ่มการทดสอบวัดระดับใหม่เมื่อคุณพร้อม",
  ar: "ابدأ اختبار تحديد مستوى جديد عندما تكون مستعدًا.",
  hi: "जब आप तैयार हों तो एक नया प्लेसमेंट परीक्षण शुरू करें।",
  ur: "جب آپ تیار ہوں تو ایک نیا پلیسمنٹ ٹیسٹ شروع کریں۔",
  ko: "준비가 되면 새 레벨 테스트를 시작하세요.",
  zh: "准备就绪后即可开始新的分班测试。",
  pt: "Inicie um novo teste de nivelamento quando estiver pronto.",
  tr: "Hazır olduğunuzda yeni bir seviye belirleme testi başlatın.",
};

const RESUME_BUTTON: PlacementNativeSlots = {
  en: "Resume",
  vi: "Tiếp tục",
  ja: "再開",
  id: "Lanjutkan",
  th: "ดำเนินการต่อ",
  ar: "استئناف",
  hi: "जारी रखें",
  ur: "جاری رکھیں",
  ko: "재개",
  zh: "继续",
  pt: "Continuar",
  tr: "Devam et",
};

const START_NEW_BUTTON: PlacementNativeSlots = {
  en: "Start new",
  vi: "Làm bài mới",
  ja: "新しく始める",
  id: "Mulai baru",
  th: "เริ่มใหม่",
  ar: "بدء جديد",
  hi: "नया शुरू करें",
  ur: "نیا شروع کریں",
  ko: "새로 시작",
  zh: "开始新的",
  pt: "Começar novo",
  tr: "Yeni başla",
};

export default function ResumePage() {
  const navigate = useNavigate();
  const pt = usePlacementT();
  const resume = usePlacementResume();
  const starter = usePlacementSessionV3(false);

  if (resume.loading) {
    return (
      <main id="main-content" tabIndex={-1} className="px-4 py-8">
        <LoadingPlaceholder label={{ en: LOADING_CHECKING.en ?? "Checking for an unfinished test", vi: LOADING_CHECKING.vi ?? "" }} />
      </main>
    );
  }

  const startNew = async () => {
    const session = await starter.start();
    if (session) navigate(`/placement/test/${session.sessionId}`, { replace: true });
  };

  return (
    <main id="main-content" tabIndex={-1} className="flex min-h-[calc(100vh-72px)] justify-center px-4 py-8">
      <section className="w-full max-w-[560px] rounded-[18px] border border-slate-200 bg-white p-6 text-center shadow-sm">
        <BilingualLabel
          as="h1"
          text={{
            en: resume.session ? (RESUME_HEADING.en ?? "Resume your placement test?") : (NO_RESUME_HEADING.en ?? "No unfinished test found"),
            vi: resume.session ? (RESUME_HEADING.vi ?? "") : (NO_RESUME_HEADING.vi ?? ""),
          }}
          enClassName="text-2xl font-black text-slate-950"
          viClassName="text-sm font-medium text-slate-500"
        />
        <BilingualLabel
          as="p"
          className="mt-4"
          text={{
            en: resume.session ? (RESUME_DESC.en ?? "") : (NO_RESUME_DESC.en ?? ""),
            vi: resume.session ? (RESUME_DESC.vi ?? "") : (NO_RESUME_DESC.vi ?? ""),
          }}
          enClassName="text-sm font-semibold leading-6 text-slate-600"
          viClassName="text-xs font-medium leading-5 text-slate-500"
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {resume.session ? (
            <Button
              type="button"
              className="rounded-full"
              onClick={() => navigate(`/placement/test/${resume.session?.sessionId}`)}
            >
              {pt(RESUME_BUTTON)}
            </Button>
          ) : null}
          <Button
            type="button"
            variant={resume.session ? "outline" : "default"}
            className="rounded-full"
            onClick={startNew}
            disabled={starter.loading}
          >
            {pt(START_NEW_BUTTON)}
          </Button>
        </div>
      </section>
    </main>
  );
}
