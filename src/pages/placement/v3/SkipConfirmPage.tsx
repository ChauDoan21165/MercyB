import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BilingualLabel } from "@/components/placement/v3";

export default function SkipConfirmPage() {
  const navigate = useNavigate();
  return (
    <main className="flex min-h-[calc(100vh-72px)] justify-center px-4 py-8">
      <section className="w-full max-w-[520px] rounded-[18px] border border-slate-200 bg-white p-6 text-center shadow-sm">
        <BilingualLabel
          as="h1"
          text={{ en: "Skip placement test?", vi: "Bỏ qua bài đánh giá?" }}
          enClassName="text-2xl font-black text-slate-950"
          viClassName="text-sm font-medium text-slate-500"
        />
        <BilingualLabel
          as="p"
          className="mt-4"
          text={{
            en: "You can take it later from your Account page.",
            vi: "Bạn có thể làm bài này sau từ trang Tài khoản.",
          }}
          enClassName="text-sm font-semibold leading-6 text-slate-600"
          viClassName="text-xs font-medium leading-5 text-slate-500"
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button type="button" className="rounded-full" onClick={() => navigate("/placement")}>
            Keep testing · Tiếp tục
          </Button>
          <Button type="button" variant="outline" className="rounded-full" onClick={() => navigate("/", { replace: true })}>
            Yes, skip · Có, bỏ qua
          </Button>
        </div>
      </section>
    </main>
  );
}
