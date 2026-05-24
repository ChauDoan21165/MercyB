// Path: src/components/mercy-guide/MercyGuidePanel.tsx
// File: MercyGuidePanel.tsx

import React, { useCallback } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
} from 'lucide-react';

import {
  MERCY_HOST_IMAGE_AVIF,
  MERCY_HOST_IMAGE_FALLBACK,
  MERCY_HOST_IMAGE_SRC,
  MERCY_HOST_IMAGE_WEBP,
} from './shared';

function FloatingHelperLauncher({
  title,
  onClose,
  isFullscreen,
  onToggleFullscreen,
  onAvatarError,
  onPanelDragStart,
}: {
  title: string;
  onClose: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onAvatarError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onPanelDragStart?: (event: React.PointerEvent<HTMLDivElement>) => void;
}) {
  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden border-l border-white/70 bg-gradient-to-br from-[#FFF8F1] via-[#FFFCFA] to-[#F7F5FF] shadow-2xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(255,159,122,0.14),_rgba(192,132,252,0.07)_42%,_transparent_74%)]" />

      <div
        className="relative z-30 flex items-center gap-2 border-b border-white/80 bg-white/78 px-2.5 py-2.5 backdrop-blur-md"
        onPointerDown={(event) => {
          if (isInteractiveHeaderTarget(event.target)) return;
          onPanelDragStart?.(event);
        }}
      >
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFD7C8] via-[#FFE6DC] to-[#DCC8FF] blur-sm opacity-80" />
          <picture>
            <source srcSet={MERCY_HOST_IMAGE_AVIF} type="image/avif" />
            <source srcSet={MERCY_HOST_IMAGE_WEBP} type="image/webp" />
            <img
              src={MERCY_HOST_IMAGE_SRC}
              alt={title}
              width={640}
              height={640}
              decoding="async"
              className="relative h-10 w-10 rounded-full border-2 border-white object-cover object-[50%_32%] scale-110 shadow-[0_8px_18px_rgba(148,163,184,0.18)]"
              onError={(event) => {
                fallbackAvatar(event);
                onAvatarError?.(event);
              }}
            />
          </picture>
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-black tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="truncate text-[11px] font-semibold text-slate-500">
            Choose where you want to practice.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            className="rounded-full p-2 text-slate-400 outline-none transition hover:bg-white/70 hover:text-slate-600 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
            aria-label={isFullscreen ? 'Exit full screen' : 'Full screen'}
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-transparent bg-white/75 p-2 text-slate-400 transition hover:border-red-100 hover:bg-red-50 hover:text-red-500"
            aria-label="Close Mercy panel"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-center overflow-y-auto p-4">
        <section className="mx-auto w-full max-w-[520px] rounded-3xl border border-white/85 bg-white/92 p-5 shadow-[0_18px_44px_rgba(148,163,184,0.14)]">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-600">
            Teacher Mercy
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            Pick a learning space
          </h3>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
            Mercy Kids and AI Tutor are separate. Open the one you need.
          </p>

          <div className="mt-5 grid gap-3">
            <a
              href="/kids/vi-english"
              className="inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
            >
              Vào Mercy Kids
            </a>
            <a
              href="/ai-tutor"
              className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Mở AI Tutor
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

type MercyGuidePanelProps = {
  isOpen: boolean;
  onClose?: () => void;

  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;

  onCloseGuide?: () => void;
  onPanelDragStart?: (event: React.PointerEvent<HTMLDivElement>) => void;
  onAvatarError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  journeyTitle?: string;
  bubbleLabel?: string | null;
  panelTitle?: string | null;
} & Record<string, unknown>;

function fallbackAvatar(event: React.SyntheticEvent<HTMLImageElement>): void {
  const img = event.currentTarget;

  if (img.src === MERCY_HOST_IMAGE_FALLBACK) {
    return;
  }

  img.onerror = null;
  img.src = MERCY_HOST_IMAGE_FALLBACK;
}

function cleanText(value?: string | null): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function isInteractiveHeaderTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;

  return Boolean(
    target.closest(
      'button,[role="listbox"],[role="option"],a,input,textarea,select,label',
    ),
  );
}

export const MercyGuidePanel: React.FC<MercyGuidePanelProps> = ({
  isOpen,
  onClose,
  isFullscreen,
  onToggleFullscreen,
  onCloseGuide,
  onPanelDragStart,
  onAvatarError,
  journeyTitle,
  bubbleLabel,
  panelTitle,
}) => {
  const handleClose = useCallback(() => {
    if (onCloseGuide) {
      onCloseGuide();
      return;
    }

    onClose?.();
  }, [onClose, onCloseGuide]);

  const headerTitle =
    cleanText(journeyTitle) ||
    cleanText(panelTitle) ||
    cleanText(bubbleLabel) ||
    'Teacher Mercy';

  if (!isOpen) {
    return null;
  }

  return (
    <FloatingHelperLauncher
      title={headerTitle}
      onClose={handleClose}
      isFullscreen={isFullscreen}
      onToggleFullscreen={onToggleFullscreen}
      onAvatarError={onAvatarError}
      onPanelDragStart={onPanelDragStart}
    />
  );

};

export default MercyGuidePanel;
