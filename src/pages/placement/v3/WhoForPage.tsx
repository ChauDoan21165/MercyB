import { useNavigate } from "react-router-dom";
import { Baby, UserRound } from "lucide-react";
import { BackButton, BilingualLabel } from "@/components/placement/v3";
import { usePlacementSessionV3 } from "@/hooks/placement/v3";

export default function WhoForPage() {
  const navigate = useNavigate();
  const { loading, start } = usePlacementSessionV3(false);

  const startAdult = async () => {
    const session = await start();
    if (session) navigate(`/placement/test/${session.sessionId}`);
  };

  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] w-full max-w-[760px] px-4 py-8">
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
          className="min-h-[150px] rounded-[18px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-60"
        >
          <UserRound className="h-8 w-8 text-emerald-700" aria-hidden />
          <BilingualLabel
            text={{ en: "Me — an adult learner", vi: "Mình — người lớn đang học" }}
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
    </main>
  );
}
