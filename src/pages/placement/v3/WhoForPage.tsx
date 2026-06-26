import { useNavigate } from "react-router-dom";
import { Baby, UserRound } from "lucide-react";
import { BackButton, BilingualLabel } from "@/components/placement/v3";
import { usePlacementSessionV3 } from "@/hooks/placement/v3";
import { useAuth } from "@/providers/AuthProvider";
import { useChromeT } from "@/lib/i18n/chromeLanguage";
import { usePlacementT } from "@/components/placement/nativeCopy";
import type { PlacementNativeSlots } from "@/components/placement/nativeCopy";

const ADULT_LABEL_AUTHED: PlacementNativeSlots = {
  en: "Me — an adult learner",
  vi: "Mình — người lớn đang học",
  ja: "自分 — 大人の学習者",
  id: "Saya — pembelajar dewasa",
  th: "ฉัน — ผู้เรียนที่เป็นผู้ใหญ่",
  ar: "أنا — متعلم بالغ",
  hi: "मैं — एक वयस्क शिक्षार्थी",
  ur: "میں — ایک بالغ سیکھنے والا",
  ko: "저 — 성인 학습자",
  zh: "我 — 成年学习者",
  pt: "Eu — um aluno adulto",
  tr: "Ben — yetişkin bir öğrenci",
};

const ADULT_LABEL_UNAUTHED: PlacementNativeSlots = {
  en: "Sign in to take the test",
  vi: "Đăng nhập để làm bài test",
  ja: "テストを受けるにはサインイン",
  id: "Masuk untuk mengikuti tes",
  th: "ลงชื่อเข้าใช้เพื่อทำแบบทดสอบ",
  ar: "سجل الدخول لإجراء الاختبار",
  hi: "परीक्षण देने के लिए साइन इन करें",
  ur: "ٹیسٹ دینے کے لیے سائن ان کریں",
  ko: "테스트를 보려면 로그인",
  zh: "登录以参加测试",
  pt: "Faça login para fazer o teste",
  tr: "Teste girmek için oturum açın",
};

const CHILD_LABEL: PlacementNativeSlots = {
  en: "My child (ages 4-10)",
  vi: "Con của mình (4-10 tuổi)",
  ja: "子ども（4〜10歳）",
  id: "Anak saya (usia 4-10)",
  th: "ลูกของฉัน (อายุ 4-10 ปี)",
  ar: "طفلي (من 4 إلى 10 سنوات)",
  hi: "मेरा बच्चा (4-10 वर्ष)",
  ur: "میرا بچہ (4-10 سال)",
  ko: "내 아이 (4-10세)",
  zh: "我的孩子（4-10岁）",
  pt: "Meu filho (4-10 anos)",
  tr: "Çocuğum (4-10 yaş)",
};

export default function WhoForPage() {
  const navigate = useNavigate();
  const t = useChromeT();
  const pt = usePlacementT();
  const { user } = useAuth();
  const { loading, error, start } = usePlacementSessionV3(false);

  const startAdult = async () => {
    if (!user) {
      navigate("/signin?returnTo=%2Fplacement%2Fwho");
      return;
    }
    const session = await start();
    if (session) navigate(`/placement/test/${session.sessionId}`);
  };

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto min-h-[calc(100vh-72px)] w-full max-w-[760px] px-4 py-8">
      <BackButton onClick={() => navigate("/placement")} />
      <BilingualLabel
        as="h1"
        className="mt-6 text-center"
        text={{ en: "Who is this account for?", vi: "Tài khoản này là của ai?" }}
        enClassName="text-[28px] font-black leading-tight text-slate-950 sm:text-4xl"
        viClassName="text-base font-medium text-slate-500"
      />

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={startAdult}
          disabled={loading}
          aria-label={user ? pt(ADULT_LABEL_AUTHED) : pt(ADULT_LABEL_UNAUTHED)}
          className="min-h-[150px] rounded-[18px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-60"
        >
          <UserRound className="h-8 w-8 text-emerald-700" aria-hidden />
          <BilingualLabel
            text={
              user
                ? { en: "Me — an adult learner", vi: "Mình — người lớn đang học" }
                : { en: "Sign in to take the test", vi: "Đăng nhập để làm bài test" }
            }
            className="mt-3"
            enClassName="text-lg font-black text-slate-900"
            viClassName="text-sm font-medium text-slate-500"
          />
          <BilingualLabel
            text={{
              en: "Short test, 6-9 minutes, gives you a CEFR profile and a recommended starting lesson.",
              vi: "Bài đánh giá ngắn, 6-9 phút, cho bạn hồ sơ CEFR và bài học nên bắt đầu.",
            }}
            className="mt-3"
            enClassName="text-sm font-semibold leading-6 text-slate-600"
            viClassName="text-xs font-medium leading-5 text-slate-500"
          />
        </button>

        <button
          type="button"
          onClick={() => navigate("/room/alphabet_adventure_kids_l1")}
          aria-label={pt(CHILD_LABEL)}
          className="min-h-[150px] rounded-[18px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-amber-300 hover:bg-amber-50"
        >
          <Baby className="h-8 w-8 text-amber-700" aria-hidden />
          <BilingualLabel
            text={{ en: "My child (ages 4-10)", vi: "Con của mình (4-10 tuổi)" }}
            className="mt-3"
            enClassName="text-lg font-black text-slate-900"
            viClassName="text-sm font-medium text-slate-500"
          />
          <BilingualLabel
            text={{
              en: "Kids skip the test and go straight to fun beginner rooms: alphabet, colors, animals.",
              vi: "Trẻ em bỏ qua bài đánh giá và vào thẳng các phòng khởi đầu vui: bảng chữ cái, màu sắc, động vật.",
            }}
            className="mt-3"
            enClassName="text-sm font-semibold leading-6 text-slate-600"
            viClassName="text-xs font-medium leading-5 text-slate-500"
          />
        </button>
      </div>

      {error ? (
        <div
          role="alert"
          className="mt-5 rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800"
        >
          {error}
        </div>
      ) : null}
    </main>
  );
}
