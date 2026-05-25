import { useMemo, useState } from "react";
import { Mic, Sparkles } from "lucide-react";
import { useBrowserStt } from "@/lib/ai-tutor/useBrowserStt";
import { recordLearningEvent } from "@/lib/tutor/learningEvents";

type KidsPicture = {
  id: string;
  english: string;
  vietnamese: string;
  image: string;
  sentence: string;
  response: string;
};

const PICTURES: KidsPicture[] = [
  {
    id: "apple",
    english: "apple",
    vietnamese: "quả táo",
    image: "/images/mercy-kids/apple.jpg",
    sentence: "I see an apple.",
    response: "Great. Apple. I see an apple.",
  },
  {
    id: "dog",
    english: "dog",
    vietnamese: "con chó",
    image: "/images/mercy-kids/dog.jpg",
    sentence: "I see a dog.",
    response: "Good job. Dog. I see a dog.",
  },
  {
    id: "cat",
    english: "cat",
    vietnamese: "con mèo",
    image: "/images/mercy-kids/cat.jpg",
    sentence: "I see a cat.",
    response: "Nice speaking. Cat. I see a cat.",
  },
  {
    id: "sun",
    english: "sun",
    vietnamese: "mặt trời",
    image: "/images/mercy-kids/sun.jpg",
    sentence: "I see the sun.",
    response: "Bright and clear. Sun. I see the sun.",
  },
  {
    id: "car",
    english: "car",
    vietnamese: "xe hơi",
    image: "/images/mercy-kids/toy-car.jpg",
    sentence: "I see a car.",
    response: "Well done. Car. I see a car.",
  },
  {
    id: "book",
    english: "book",
    vietnamese: "quyển sách",
    image: "/images/mercy-kids/book.jpg",
    sentence: "I see a book.",
    response: "Good. Book. I see a book.",
  },
];

const DEFAULT_PICTURE = PICTURES[0];

export default function ViKidsEnglishTutor() {
  const [selectedId, setSelectedId] = useState(DEFAULT_PICTURE.id);
  const [hasSpoken, setHasSpoken] = useState(false);
  const stt = useBrowserStt("en-US");

  const selected = useMemo(
    () => PICTURES.find((picture) => picture.id === selectedId) ?? DEFAULT_PICTURE,
    [selectedId],
  );

  function selectPicture(picture: KidsPicture) {
    setSelectedId(picture.id);
    setHasSpoken(false);
    recordLearningEvent({
      eventType: "kids_picture_selected",
      product: "mercy_kids",
      targetLanguage: "en",
      safeTopicTag: picture.id,
    });
  }

  function handleSpeakTap() {
    setHasSpoken(true);
    recordLearningEvent({
      eventType: "kids_speak_clicked",
      product: "mercy_kids",
      targetLanguage: "en",
      safeTopicTag: selected.id,
    });

    if (stt.supported) {
      if (stt.listening) stt.stop();
      else stt.start();
    }
  }

  return (
    <main
      className="min-h-screen bg-[#F7FBFF] px-4 py-6 text-slate-950 sm:px-6 lg:px-8"
      data-testid="vi-kids-english-tutor"
    >
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)]">
        <section className="flex min-h-[calc(100vh-3rem)] flex-col rounded-[8px] border border-sky-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-sky-700">English for kids</p>
              <h1 className="mt-1 text-3xl font-black tracking-normal text-slate-950 sm:text-4xl">
                Mercy Kids
              </h1>
            </div>
            <div className="rounded-[8px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">
              Picture + speak only
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[8px] border border-sky-200 bg-sky-50 px-4 py-3">
              <div className="text-sm font-black text-sky-900">1. Chọn hình</div>
              <p className="mt-1 text-sm font-semibold text-sky-800">Pick one picture.</p>
            </div>
            <div className="rounded-[8px] border border-violet-200 bg-violet-50 px-4 py-3">
              <div className="text-sm font-black text-violet-900">2. Bấm để nói</div>
              <p className="mt-1 text-sm font-semibold text-violet-800">Say the little English sentence.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {PICTURES.map((picture) => {
              const active = picture.id === selected.id;
              return (
                <button
                  key={picture.id}
                  type="button"
                  onClick={() => selectPicture(picture)}
                  className={`group grid min-h-[188px] overflow-hidden rounded-[8px] border bg-white text-left transition ${
                    active
                      ? "border-sky-500 shadow-[0_0_0_3px_rgba(14,165,233,0.18)]"
                      : "border-slate-200 hover:border-sky-300 hover:shadow-sm"
                  }`}
                  aria-pressed={active}
                  aria-label={`${picture.english} ${picture.vietnamese}`}
                >
                  <img
                    src={picture.image}
                    alt=""
                    className="h-32 w-full object-cover"
                    loading="lazy"
                  />
                  <span className="grid gap-0.5 px-3 py-2">
                    <span className="text-base font-black capitalize text-slate-950">
                      {picture.english}
                    </span>
                    <span className="text-sm font-bold text-slate-600">
                      {picture.vietnamese}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="flex min-h-[calc(100vh-3rem)] flex-col rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="overflow-hidden rounded-[8px] border border-slate-200 bg-slate-50">
            <img
              src={selected.image}
              alt={`${selected.english} ${selected.vietnamese}`}
              className="h-64 w-full object-cover"
            />
          </div>

          <div className="mt-4">
            <p className="text-xs font-black uppercase text-slate-500">Say this</p>
            <p className="mt-1 text-3xl font-black tracking-normal text-slate-950">
              {selected.sentence}
            </p>
            <p className="mt-1 text-base font-bold text-slate-600">
              {selected.vietnamese}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSpeakTap}
            className="mt-5 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[8px] border border-violet-300 bg-violet-600 px-4 py-3 text-base font-black text-white shadow-sm transition hover:bg-violet-700 disabled:opacity-70"
            aria-label={stt.listening ? "Dừng nói với Mercy" : "Bấm để nói với Mercy"}
          >
            <Mic className="h-5 w-5" aria-hidden />
            {stt.listening ? "Mercy đang nghe" : "Bấm để nói với Mercy"}
          </button>

          {stt.error && (
            <p className="mt-3 rounded-[8px] border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
              Mercy chưa nghe được trên trình duyệt này. Con vẫn có thể đọc câu với ba mẹ.
            </p>
          )}

          <div className="mt-5 rounded-[8px] border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 text-sm font-black text-emerald-900">
              <Sparkles className="h-4 w-4" aria-hidden />
              Mercy responds
            </div>
            <p className="mt-2 text-lg font-black text-emerald-950">
              {hasSpoken ? selected.response : "Pick a picture, then tap speak."}
            </p>
            {stt.transcript && (
              <p className="mt-2 text-sm font-semibold text-emerald-800">
                Mercy heard: {stt.transcript}
              </p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
