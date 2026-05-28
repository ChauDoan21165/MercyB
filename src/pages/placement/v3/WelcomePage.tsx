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

export default function WelcomePage() {
  const navigate = useNavigate();
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
        <BilingualLabel
          as="h1"
          text={{
            en: "Let's find where you should start",
            vi: "Hãy tìm điểm bắt đầu phù hợp cho bạn",
          }}
          enClassName="text-[28px] font-black leading-tight text-slate-950 sm:text-4xl"
          viClassName="text-base font-medium leading-snug text-slate-500"
        />
        <BilingualLabel
          as="p"
          className="mx-auto mt-4 max-w-[460px]"
          text={{
            en: "A short test will show us your English level and point you at the first lesson that fits, with no guessing.",
            vi: "Một bài đánh giá ngắn sẽ cho chúng tôi biết trình độ của bạn và giới thiệu bài học đầu tiên phù hợp, bạn không phải tự đoán.",
          }}
          enClassName="text-base font-semibold leading-7 text-slate-600"
          viClassName="text-sm font-medium leading-6 text-slate-500"
        />

        <section className="mt-7 rounded-[18px] border border-slate-200 bg-white p-5 text-left shadow-sm">
          {[
            {
              icon: Clock,
              text: { en: "About 6-9 minutes", vi: "Khoảng 6-9 phút" },
            },
            {
              icon: ListChecks,
              text: {
                en: "Writing, speaking, reading, listening, and conversation",
                vi: "Có viết, nói, đọc, nghe và hội thoại",
              },
            },
            {
              icon: Languages,
              text: {
                en: "Bilingual support, English and Vietnamese throughout",
                vi: "Song ngữ, tiếng Anh và tiếng Việt trong suốt bài",
              },
            },
          ].map(({ icon: Icon, text }) => (
            <div key={text.en} className="flex items-start gap-3 py-2">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <Icon className="h-4 w-4" aria-hidden />
              </div>
              <BilingualLabel
                text={text}
                enClassName="text-sm font-black text-slate-800"
                viClassName="text-xs font-medium text-slate-500"
              />
            </div>
          ))}
        </section>

        <Button
          type="button"
          className="mt-6 min-h-12 w-full rounded-full text-base font-black"
          onClick={() => navigate("/placement/who")}
        >
          Start placement test · Bắt đầu đánh giá
        </Button>
        <button
          type="button"
          className="mt-4 text-sm font-bold text-slate-500 hover:text-slate-600"
          onClick={() => setSkipOpen(true)}
        >
          Skip for now — I'll explore on my own
          <span className="block text-xs font-medium">Bỏ qua — để tôi tự khám phá</span>
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
