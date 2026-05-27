import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BilingualLabel, LoadingPlaceholder } from "@/components/placement/v3";
import { usePlacementResume, usePlacementSessionV3 } from "@/hooks/placement/v3";

export default function ResumePage() {
  const navigate = useNavigate();
  const resume = usePlacementResume();
  const starter = usePlacementSessionV3(false);

  if (resume.loading) {
    return (
      <main id="main-content" tabIndex={-1} className="px-4 py-8">
        <LoadingPlaceholder label={{ en: "Checking for an unfinished test", vi: "Đang kiểm tra bài còn dang dở" }} />
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
            en: resume.session ? "Resume your placement test?" : "No unfinished test found",
            vi: resume.session ? "Tiếp tục bài đánh giá dang dở?" : "Không có bài dang dở",
          }}
          enClassName="text-2xl font-black text-slate-950"
          viClassName="text-sm font-medium text-slate-400"
        />
        <BilingualLabel
          as="p"
          className="mt-4"
          text={{
            en: resume.session
              ? "You have an in-progress session. Continuing keeps your answers together for a more reliable profile."
              : "Start a fresh placement test when you are ready.",
            vi: resume.session
              ? "Bạn có một phiên đang làm. Tiếp tục sẽ giữ các câu trả lời trong cùng một hồ sơ để kết quả đáng tin cậy hơn."
              : "Hãy bắt đầu bài đánh giá mới khi bạn sẵn sàng.",
          }}
          enClassName="text-sm font-semibold leading-6 text-slate-600"
          viClassName="text-xs font-medium leading-5 text-slate-400"
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {resume.session ? (
            <Button
              type="button"
              className="rounded-full"
              onClick={() => navigate(`/placement/test/${resume.session?.sessionId}`)}
            >
              Resume · Tiếp tục
            </Button>
          ) : null}
          <Button
            type="button"
            variant={resume.session ? "outline" : "default"}
            className="rounded-full"
            onClick={startNew}
            disabled={starter.loading}
          >
            Start new · Làm bài mới
          </Button>
        </div>
      </section>
    </main>
  );
}
