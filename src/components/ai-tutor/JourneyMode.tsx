type Props = {
  onStartCorrection: () => void;
};

export default function JourneyMode({ onStartCorrection }: Props) {
  return (
    <section
      className="mx-auto w-full max-w-3xl rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm"
      data-testid="ai-tutor-journey-path"
    >
      <div className="text-xs font-black uppercase text-indigo-600">
        Lộ trình
      </div>
      <h2 className="mt-1 text-xl font-black text-slate-900">
        Lộ trình học hôm nay
      </h2>

      <ol className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
        <li className="rounded-[14px] border border-slate-100 bg-slate-50 px-4 py-3">
          1. Sửa một câu
        </li>
        <li className="rounded-[14px] border border-slate-100 bg-slate-50 px-4 py-3">
          2. Luyện nói câu đó
        </li>
        <li className="rounded-[14px] border border-slate-100 bg-slate-50 px-4 py-3">
          3. Hiểu vì sao tiếng Anh nói vậy
        </li>
      </ol>

      <button
        type="button"
        onClick={onStartCorrection}
        className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-black text-white transition hover:bg-slate-800 sm:w-auto"
      >
        Bắt đầu sửa câu
      </button>
    </section>
  );
}
