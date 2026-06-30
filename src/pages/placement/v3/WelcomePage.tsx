import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Languages, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BilingualLabel,
  LoadingPlaceholder,
  SkipForNowModal,
} from "@/components/placement/v3";
import { usePlacementResume } from "@/hooks/placement/v3";
import { useChromeLanguage } from "@/lib/i18n/chromeLanguage";
import { usePlacementT } from "@/components/placement/nativeCopy";
import type { PlacementNativeSlots } from "@/components/placement/nativeCopy";

/* ---------- All-language copy slots for WelcomePage ---------- */

const COPY_HEADING: PlacementNativeSlots = {
  en: "Find the right starting point for you",
  vi: "Tìm điểm bắt đầu phù hợp cho bạn",
  ja: "あなたにぴったりのスタート地点を見つけましょう",
  id: "Temukan titik awal yang tepat untuk Anda",
  th: "ค้นหาจุดเริ่มต้นที่เหมาะสมสำหรับคุณ",
  ar: "اعثر على نقطة البداية المناسبة لك",
  hi: "अपने लिए सही शुरुआती बिंदु खोजें",
  ur: "اپنے لیے صحیح شروع کرنے کا مقام تلاش کریں",
  ko: "당신에게 맞는 시작점을 찾아보세요",
  zh: "为您找到合适的起点",
  pt: "Encontre o ponto de partida certo para você",
  tr: "Sizin için doğru başlangıç noktasını bulun",
};

const COPY_SUBTITLE: PlacementNativeSlots = {
  en: "A short assessment tells us your level and recommends your first lesson, so you do not have to guess.",
  vi: "Một bài đánh giá ngắn sẽ cho chúng tôi biết trình độ của bạn và giới thiệu bài học đầu tiên phù hợp, bạn không phải tự đoán.",
  ja: "短いテストであなたのレベルを確認し、最初のレッスンを提案します。自分で考える必要はありません。",
  id: "Penilaian singkat akan memberi tahu kami level Anda dan merekomendasikan pelajaran pertama Anda, jadi Anda tidak perlu menebak-nebak.",
  th: "การประเมินสั้นๆ จะบอกระดับของคุณและแนะนำบทเรียนแรกที่เหมาะสม คุณไม่ต้องเดาเอง",
  ar: "تقييم قصير يخبرنا بمستواك ويوصي بدرسك الأول، حتى لا تضطر إلى التخمين",
  hi: "एक छोटा मूल्यांकन हमें आपका स्तर बताता है और आपके पहले पाठ की सिफारिश करता है, ताकि आपको अनुमान न लगाना पड़े।",
  ur: "ایک مختصر تشخیص ہمیں آپ کی سطح بتاتی ہے اور آپ کے پہلے سبق کی سفارش کرتی ہے، تاکہ آپ کو اندازہ لگانے کی ضرورت نہ پڑے۔",
  ko: "짧은 평가를 통해 레벨을 알려주고 첫 수업을 추천해드리니, 직접 고민할 필요가 없습니다.",
  zh: "通过简短的评估，我们可以了解您的水平并推荐您的第一课，您无需猜测。",
  pt: "Uma avaliação rápida nos informa seu nível e recomenda sua primeira aula, para que você não tenha que adivinhar.",
  tr: "Kısa bir değerlendirme seviyenizi belirler ve ilk dersinizi önerir, böylece tahmin etmek zorunda kalmazsınız.",
};

const COPY_DURATION: PlacementNativeSlots = {
  en: "About 6-9 minutes",
  vi: "Khoảng 6-9 phút",
  ja: "約6〜9分",
  id: "Sekitar 6-9 menit",
  th: "ประมาณ 6-9 นาที",
  ar: "حوالي 6-9 دقائق",
  hi: "लगभग 6-9 मिनट",
  ur: "تقریباً 6-9 منٹ",
  ko: "약 6-9분",
  zh: "大约6-9分钟",
  pt: "Cerca de 6 a 9 minutos",
  tr: "Yaklaşık 6-9 dakika",
};

const COPY_SKILLS: PlacementNativeSlots = {
  en: "Writing, speaking, reading, listening, and conversation",
  vi: "Viết, nói, đọc, nghe và hội thoại",
  ja: "ライティング、スピーキング、リーディング、リスニング、会話",
  id: "Menulis, berbicara, membaca, mendengarkan, dan percakapan",
  th: "การเขียน การพูด การอ่าน การฟัง และการสนทนา",
  ar: "الكتابة والتحدث والقراءة والاستماع والمحادثة",
  hi: "लेखन, बोलना, पढ़ना, सुनना और बातचीत",
  ur: "لکھنا، بولنا، پڑھنا، سننا اور گفتگو",
  ko: "쓰기, 말하기, 읽기, 듣기, 회화",
  zh: "写作、口语、阅读、听力和对话",
  pt: "Escrita, fala, leitura, compreensão auditiva e conversação",
  tr: "Yazma, konuşma, okuma, dinleme ve sohbet",
};

const COPY_BILINGUAL: PlacementNativeSlots = {
  en: "Bilingual support throughout the test",
  vi: "Hỗ trợ song ngữ trong suốt bài kiểm tra",
  ja: "テスト中はバイリンガル対応",
  id: "Dukungan bilingual selama tes",
  th: "การสนับสนุนสองภาษาตลอดการทดสอบ",
  ar: "دعم ثنائي اللغة طوال الاختبار",
  hi: "परीक्षण के दौरान द्विभाषी सहायता",
  ur: "ٹیسٹ کے دوران دو لسانی مدد",
  ko: "테스트 전반에 걸친 이중 언어 지원",
  zh: "测试全程提供双语支持",
  pt: "Suporte bilíngue durante todo o teste",
  tr: "Test boyunca iki dilli destek",
};

const COPY_START_TEST_BUTTON: PlacementNativeSlots = {
  en: "Start placement test",
  vi: "Bắt đầu bài kiểm tra trình độ",
  ja: "プレイスメントテストを開始",
  id: "Mulai tes penempatan",
  th: "เริ่มทดสอบวัดระดับ",
  ar: "ابدأ اختبار تحديد المستوى",
  hi: "प्लेसमेंट परीक्षण शुरू करें",
  ur: "پلیسمنٹ ٹیسٹ شروع کریں",
  ko: "레벨 테스트 시작",
  zh: "开始分班测试",
  pt: "Iniciar teste de nivelamento",
  tr: "Seviye belirleme testini başlat",
};

const COPY_SKIP_LINK: PlacementNativeSlots = {
  en: "Skip for now — I'll explore on my own",
  vi: "Bỏ qua — để tôi tự khám phá",
  ja: "今はスキップ — 自分で探検します",
  id: "Lewati untuk sekarang — saya akan menjelajah sendiri",
  th: "ข้ามไปก่อน — เดี๋ยวฉันจะลองสำรวจเอง",
  ar: "تخط الآن — سأستكشف بنفسي",
  hi: "अभी के लिए छोड़ें — मैं खुद देखूँगा/देखूँगी",
  ur: "ابھی چھوڑیں — میں خود دریافت کروں گا/کروں گی",
  ko: "건너뛰기 — 혼자서 살펴볼게요",
  zh: "暂时跳过 — 我会自己探索",
  pt: "Pular por enquanto — vou explorar por conta própria",
  tr: "Şimdilik atla — kendi başıma keşfedeceğim",
};

/* ---------- Feature-card item ---------- */

type FeatureItem = {
  icon: typeof Clock;
  slots: PlacementNativeSlots;
};

const FEATURES: FeatureItem[] = [
  { icon: Clock, slots: COPY_DURATION },
  { icon: ListChecks, slots: COPY_SKILLS },
  { icon: Languages, slots: COPY_BILINGUAL },
];

/* ---------- Component ---------- */

export default function WelcomePage() {
  const navigate = useNavigate();
  const showVi = useChromeLanguage() === "vi";
  const t = usePlacementT();
  const [skipOpen, setSkipOpen] = useState(false);
  const resume = usePlacementResume();

  useEffect(() => {
    if (!resume.loading && resume.session?.status === "in_progress") {
      navigate("/placement/resume", { replace: true });
    }
  }, [navigate, resume.loading, resume.session]);

  if (resume.loading) {
    return (
      <main id="main-content" tabIndex={-1} className="px-4 py-8">
        <LoadingPlaceholder />
      </main>
    );
  }

  return (
    <main id="main-content" tabIndex={-1} className="flex min-h-[calc(100vh-72px)] justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-[540px] text-center">
        {/* Heading — native-aware */}
        {showVi ? (
          <BilingualLabel
            as="h1"
            text={{ en: COPY_HEADING.en ?? "", vi: COPY_HEADING.vi ?? "" }}
            enClassName="text-[28px] font-black leading-tight text-slate-950 sm:text-4xl"
            viClassName="text-base font-medium leading-snug text-slate-600"
          />
        ) : (
          <h1 className="text-[28px] font-black leading-tight text-slate-950 sm:text-4xl">
            {t(COPY_HEADING)}
          </h1>
        )}

        {/* Subtitle — native-aware */}
        {showVi ? (
          <BilingualLabel
            as="p"
            className="mx-auto mt-4 max-w-[460px]"
            text={{ en: COPY_SUBTITLE.en ?? "", vi: COPY_SUBTITLE.vi ?? "" }}
            enClassName="text-base font-semibold leading-7 text-slate-600"
            viClassName="text-sm font-medium leading-6 text-slate-600"
          />
        ) : (
          <p className="mx-auto mt-4 max-w-[460px] text-base font-semibold leading-7 text-slate-600">
            {t(COPY_SUBTITLE)}
          </p>
        )}

        {/* Feature cards — native-aware */}
        <section className="mt-7 rounded-[18px] border border-slate-200 bg-white p-5 text-left shadow-sm">
          {FEATURES.map(({ icon: Icon, slots }) => (
            <div key={slots.en ?? ""} className="flex items-start gap-3 py-2">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <Icon className="h-4 w-4" aria-hidden />
              </div>
              <div>
                <div className="text-sm font-black text-slate-800">
                  {t(slots)}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* CTA button */}
        <Button
          type="button"
          className="mt-6 min-h-12 w-full rounded-full text-base font-black"
          onClick={() => navigate("/placement/who")}
        >
          {t(COPY_START_TEST_BUTTON)}
        </Button>

        {/* Skip link */}
        <button
          type="button"
          className="mt-4 text-sm font-bold text-slate-600 hover:text-slate-600"
          onClick={() => setSkipOpen(true)}
        >
          {t(COPY_SKIP_LINK)}
        </button>
      </div>

      <SkipForNowModal
        open={skipOpen}
        onOpenChange={setSkipOpen}
        onKeepTesting={() => setSkipOpen(false)}
        onSkip={() => navigate("/", { replace: true })}
      />
    </main>
  );
}
