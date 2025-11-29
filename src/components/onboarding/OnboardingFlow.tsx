import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type OnboardingStep = {
  id: number;
  title: string;
  subtitle: string;
  bullets: string[];
  tag?: string;
};

const STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: 'A gentle companion for your mind',
    subtitle:
      'Mercy Blade helps you untangle thoughts, calm anxiety, and grow step by step — no judgment, just tiny actions.',
    bullets: [
      'Short, focused rooms instead of long courses',
      'Bilingual EN / VI guidance when you need it',
      'Safe space to reflect, reset, and move forward',
    ],
    tag: 'Welcome / Chào bạn',
  },
  {
    id: 2,
    title: 'How sessions work',
    subtitle:
      "Pick a room, choose one entry, listen or read, and take a small dare. That's it — one micro-step at a time.",
    bullets: [
      '2–8 entries per room, each with a clear focus',
      'Audio + text so you can learn your way',
      'Dares are tiny actions you can do today',
    ],
    tag: 'Micro-sessions / Phiên nhỏ',
  },
  {
    id: 3,
    title: 'Choose your path, at your pace',
    subtitle:
      'Start free, then unlock deeper rooms for emotions, health, career, and meaning when you feel ready.',
    bullets: [
      'Free rooms to explore core topics',
      'VIP tiers for deeper, structured journeys',
      'You stay in control — no spam, no pressure',
    ],
    tag: 'Your path / Hành trình của bạn',
  },
];

export const OnboardingFlow: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const navigate = useNavigate();

  const current = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const handleSkip = () => {
    localStorage.setItem('mb_has_seen_onboarding', 'true');
    navigate('/signup');
  };

  const handleNext = () => {
    if (!isLast) {
      setStepIndex((prev) => prev + 1);
    } else {
      localStorage.setItem('mb_has_seen_onboarding', 'true');
      navigate('/');
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Top bar with Skip */}
      <header className="flex items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-emerald-400/10 flex items-center justify-center border border-emerald-400/40">
            <span className="text-sm font-semibold tracking-wide">MB</span>
          </div>
          <span className="text-sm font-medium text-emerald-100/80">
            Mercy Blade
          </span>
        </div>
        <button
          type="button"
          onClick={handleSkip}
          className="text-xs sm:text-sm text-slate-200/80 hover:text-white underline-offset-4 hover:underline"
        >
          Skip / Bỏ qua
        </button>
      </header>

      {/* Main card */}
      <main className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md rounded-3xl bg-slate-900/70 border border-slate-700/70 shadow-2xl shadow-emerald-500/10 px-6 py-7 sm:px-8 sm:py-9 backdrop-blur-md">
          {/* Step tag */}
          {current.tag && (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300/90 mb-3">
              {current.tag}
            </p>
          )}

          {/* Title & subtitle */}
          <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-3">
            {current.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-200/80 mb-5">
            {current.subtitle}
          </p>

          {/* Bullets */}
          <ul className="space-y-2.5 mb-6">
            {current.bullets.map((b, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="mt-1 h-5 w-5 rounded-full border border-emerald-400/60 flex items-center justify-center text-[0.65rem]">
                  {stepIndex + 1}.{idx + 1}
                </span>
                <p className="text-sm text-slate-100/90">{b}</p>
              </li>
            ))}
          </ul>

          {/* Progress dots */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              {STEPS.map((step, idx) => {
                const active = idx === stepIndex;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setStepIndex(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      active
                        ? 'w-6 bg-emerald-400'
                        : 'w-2.5 bg-slate-600 hover:bg-slate-500'
                    }`}
                    aria-label={`Go to step ${idx + 1}`}
                  />
                );
              })}
            </div>
            <span className="text-xs text-slate-400">
              {stepIndex + 1} / {STEPS.length}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleBack}
              disabled={stepIndex === 0}
              className={`text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-600/80 bg-slate-900/60 text-slate-200/80 hover:border-slate-400 hover:text-white transition ${
                stepIndex === 0 ? 'opacity-40 cursor-default hover:border-slate-600 hover:text-slate-200' : ''
              }`}
            >
              Back / Quay lại
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-semibold hover:bg-emerald-300 transition shadow-lg shadow-emerald-500/30"
            >
              {isLast ? 'Get started / Bắt đầu' : 'Next / Tiếp tục'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingFlow;
