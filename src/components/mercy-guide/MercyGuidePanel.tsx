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
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden border-l border-slate-200/80 bg-slate-50 shadow-2xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_rgba(14,165,233,0.07)_45%,_transparent_76%)]" />

      <div
        className="relative z-30 flex items-center gap-2 border-b border-white/80 bg-white/78 px-2.5 py-2.5 backdrop-blur-md"
        onPointerDown={(event) => {
          if (isInteractiveHeaderTarget(event.target)) return;
          onPanelDragStart?.(event);
        }}
      >
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-100 via-white to-indigo-100 blur-sm opacity-90" />
          <picture>
            <source srcSet={MERCY_HOST_IMAGE_AVIF} type="image/avif" />
            <source srcSet={MERCY_HOST_IMAGE_WEBP} type="image/webp" />
            <img
              src={MERCY_HOST_IMAGE_SRC}
              alt={title}
              width={640}
              height={640}
              decoding="async"
              className="relative h-10 w-10 rounded-full border-2 border-white object-cover object-[50%_32%] scale-110 shadow-[0_8px_18px_rgba(15,23,42,0.12)]"
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
            Navigation helper
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
        <section className="mx-auto w-full max-w-[480px] rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_16px_36px_rgba(15,23,42,0.10)]">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Teacher Mercy
          </p>
          <h3 className="mt-2 text-xl font-black tracking-tight text-slate-950">
            Open the right learning space
          </h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
            This helper is only a doorway. Mercy Kids is the child learning room,
            and AI Tutor is the advanced study workspace.
          </p>

          <div className="mt-5 grid gap-3">
            <a
              href="/kids/vi-english"
              className="inline-flex min-h-[46px] items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-900 transition hover:border-emerald-200 hover:bg-emerald-50"
            >
              Vào Mercy Kids
            </a>
            <a
              href="/ai-tutor"
              className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
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
    cleanText(panelTitle) ||
    cleanText(bubbleLabel) ||
    'Mercy Guide';

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
