// src/components/kids/ViKidsEnglishTutor.tsx
// Mercy Kids — two-column picture + speak flow for very young learners.
// No mode tabs, no textarea, no advanced AI Tutor UI.
// Kid flow: choose picture → tap speak → Mercy listens → Mercy responds.

import { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { useBrowserStt } from "@/lib/ai-tutor/useBrowserStt";
import { useTtsSpeaker } from "@/lib/ai-tutor/useTtsSpeaker";
import { getSpeechLocale, type TutorLanguageCode } from "@/lib/tutor/languageRegistry";
import { recordLearningEvent } from "@/lib/tutor/learningEvents";
import { viKidsEnglish as viKidsEnglishConfig } from "@/lib/tutor/productConfigs";

const TARGET_LANGUAGE = viKidsEnglishConfig.defaultTargetLanguage as TutorLanguageCode;

type KidPicture = {
  id: string;
  emoji: string;
  labelVi: string;
  labelEn: string;
  mercySay: string;
};

const PICTURES: KidPicture[] = [
  { id: "apple", emoji: "🍎", labelVi: "quả táo", labelEn: "apple", mercySay: "Apple! Yummy apple." },
  { id: "dog", emoji: "🐕", labelVi: "con chó", labelEn: "dog", mercySay: "Dog! The dog is happy." },
  { id: "cat", emoji: "🐱", labelVi: "con mèo", labelEn: "cat", mercySay: "Cat! The cat is sleeping." },
  { id: "sun", emoji: "☀️", labelVi: "mặt trời", labelEn: "sun", mercySay: "Sun! The sun is shining." },
  { id: "car", emoji: "🚗", labelVi: "xe hơi", labelEn: "car", mercySay: "Car! The car goes fast." },
  { id: "book", emoji: "📖", labelVi: "quyển sách", labelEn: "book", mercySay: "Book! Let's read a book." },
];

export default function ViKidsEnglishTutor() {
  const [picked, setPicked] = useState<KidPicture | null>(null);
  const [mercyResponse, setMercyResponse] = useState<string | null>(null);
  const stt = useBrowserStt(getSpeechLocale(TARGET_LANGUAGE));
  const tts = useTtsSpeaker();

  const handlePick = (pic: KidPicture) => {
    recordLearningEvent({
      eventType: "kids_picture_selected",
      product: "mercy_kids",
      targetLanguage: TARGET_LANGUAGE,
      safeTopicTag: pic.id,
    });
    setPicked(pic);
    setMercyResponse(null);
    if (stt.listening) stt.stop();
  };

  const handleMicToggle = () => {
    if (stt.listening) {
      stt.stop();
      if (picked && stt.transcript) {
        const response = `${picked.mercySay} Con nói hay lắm!`;
        setMercyResponse(response);
        if (tts.supported) tts.speak(response, "en-US");
      }
      return;
    }
    if (picked) {
      recordLearningEvent({
        eventType: "kids_speak_clicked",
        product: "mercy_kids",
        targetLanguage: TARGET_LANGUAGE,
        safeTopicTag: picked.id,
      });
    }
    stt.start();
  };

  const handleMercySpeak = () => {
    if (!picked) return;
    if (tts.speaking) { tts.stop(); return; }
    tts.speak(picked.mercySay, "en-US");
  };

  return (
    <main data-testid="vi-kids-english-tutor" className="mx-auto min-h-[calc(100vh-72px)] w-full max-w-[720px] px-3 py-5 sm:px-6">
      <header className="mb-5 text-center">
        <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">Mercy Kids</h1>
        <p className="mt-1 text-sm font-semibold text-slate-500">Chọn hình rồi nói với Mercy.</p>
        <p className="mt-0.5 text-xs text-slate-400">Pick a picture and speak with Mercy.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Column 1 — Choose picture */}
        <section className="rounded-[20px] border-2 border-dashed border-slate-200 bg-slate-50/60 p-4">
          <h2 className="mb-3 text-center text-sm font-black uppercase text-slate-600">1. Chọn hình</h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-2">
            {PICTURES.map((pic) => (
              <button key={pic.id} type="button" onClick={() => handlePick(pic)}
                className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-3 transition ${
                  picked?.id === pic.id ? "border-indigo-500 bg-indigo-50 shadow-md" : "border-slate-100 bg-white hover:border-indigo-200 hover:shadow-sm"
                }`}
                aria-label={`Chọn ${pic.labelVi} — ${pic.labelEn}`}>
                <span className="text-4xl" aria-hidden>{pic.emoji}</span>
                <span className="text-[11px] font-bold text-slate-700">{pic.labelVi}</span>
                <span className="text-[10px] font-medium text-slate-400">{pic.labelEn}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Column 2 — Speak */}
        <section className="flex flex-col items-center justify-center gap-4 rounded-[20px] border-2 border-dashed border-slate-200 bg-slate-50/60 p-4">
          <h2 className="text-center text-sm font-black uppercase text-slate-600">2. Bấm để nói</h2>
          {!picked ? (
            <div className="text-center">
              <p className="text-sm font-medium text-slate-400">Chọn một hình bên trái trước nhé!</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-1 rounded-2xl border border-indigo-100 bg-white p-3 shadow-sm">
                <span className="text-5xl" aria-hidden>{picked.emoji}</span>
                <span className="text-sm font-black text-indigo-700">{picked.labelEn}</span>
              </div>
              {stt.supported ? (
                <button type="button" onClick={handleMicToggle}
                  className={`flex h-24 w-24 items-center justify-center rounded-full border-4 shadow-lg transition ${
                    stt.listening ? "animate-pulse border-red-400 bg-red-100 text-red-600" : "border-indigo-400 bg-gradient-to-br from-indigo-500 to-violet-500 text-white hover:scale-105"
                  }`}
                  aria-label={stt.listening ? "Mercy đang nghe — bấm để dừng" : "Bấm để nói với Mercy"}>
                  {stt.listening ? <MicOff className="h-9 w-9" aria-hidden /> : <Mic className="h-9 w-9" aria-hidden />}
                </button>
              ) : (
                <div className="text-center text-xs font-medium text-slate-400">
                  <MicOff className="mx-auto h-8 w-8 text-slate-300" aria-hidden />
                  <p className="mt-1">Không dùng được micro</p>
                </div>
              )}
              <p className="text-center text-sm font-black text-slate-700">{stt.listening ? "Mercy đang nghe…" : "Nói"}</p>
              {mercyResponse && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                  <p className="text-sm font-bold text-emerald-800">{mercyResponse}</p>
                  {tts.supported && (
                    <button type="button" onClick={handleMercySpeak}
                      className="mt-2 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700">
                      {tts.speaking ? "⏹ Dừng" : "🔊 Mercy đọc"}
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <footer className="mt-6 text-center text-[11px] font-medium text-slate-300">
        Kids-safe · không lưu audio · không gọi AI thật
      </footer>
    </main>
  );
}
