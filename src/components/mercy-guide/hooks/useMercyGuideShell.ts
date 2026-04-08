import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BUBBLE_POSITION_STORAGE_KEY,
  BUBBLE_SAFE_MARGIN,
  BUBBLE_SIZE,
  DEFAULT_BUBBLE_BOTTOM,
  DEFAULT_BUBBLE_RIGHT,
  DEFAULT_PANEL_BOTTOM,
  DEFAULT_PANEL_RIGHT,
  MIN_PANEL_HEIGHT,
  MIN_PANEL_MARGIN,
  MIN_PANEL_WIDTH,
  MOBILE_PANEL_BOTTOM_SAFE,
  MOBILE_PANEL_TOP_SAFE,
  SIZE_PRESETS,
} from '../mercyGuide.constants';
import {
  getBubbleBottomSafe,
  getDefaultPanelHeight,
  getPanelStorageKey,
  getPanelWidthPolicy,
  isMobileViewport,
} from '../mercyGuide.utils';

export type ResizeDirection =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export type PanelRect = {
  width: number;
  height: number;
  right: number;
  bottom: number;
};

export type BubblePos = {
  right: number;
  bottom: number;
};

type UseMercyGuideShellArgs = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateInteraction: () => void;
};

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function useMercyGuideShell({
  isOpen,
  setIsOpen,
  updateInteraction,
}: UseMercyGuideShellArgs) {
  const initialWidthPolicy = useMemo(() => getPanelWidthPolicy(), []);

  const [panelRect, setPanelRect] = useState<PanelRect>({
    width: initialWidthPolicy.defaultWidth,
    height: MIN_PANEL_HEIGHT,
    right: DEFAULT_PANEL_RIGHT,
    bottom: DEFAULT_PANEL_BOTTOM,
  });

  const [bubblePos, setBubblePos] = useState<BubblePos>({
    right: DEFAULT_BUBBLE_RIGHT,
    bottom: DEFAULT_BUBBLE_BOTTOM,
  });

  const clampPanelRect = useCallback((next: PanelRect): PanelRect => {
    const mobile = isMobileViewport();
    const leftSafe = MIN_PANEL_MARGIN;
    const rightSafe = MIN_PANEL_MARGIN;
    const topSafe = mobile ? MOBILE_PANEL_TOP_SAFE : MIN_PANEL_MARGIN;
    const bottomSafe = mobile ? MOBILE_PANEL_BOTTOM_SAFE : 4;
    const widthPolicy = getPanelWidthPolicy();

    if (typeof window === 'undefined') {
      return {
        width: Math.min(widthPolicy.maxWidth, Math.max(MIN_PANEL_WIDTH, next.width)),
        height: Math.max(MIN_PANEL_HEIGHT, next.height),
        right: Math.max(rightSafe, next.right),
        bottom: Math.max(bottomSafe, next.bottom),
      };
    }

    const maxWidth = Math.min(widthPolicy.maxWidth, window.innerWidth - leftSafe - rightSafe);
    const maxHeight = window.innerHeight - topSafe - bottomSafe;

    const width = Math.min(maxWidth, Math.max(MIN_PANEL_WIDTH, next.width));
    const height = Math.min(maxHeight, Math.max(MIN_PANEL_HEIGHT, next.height));

    const maxRight = Math.max(rightSafe, window.innerWidth - width - leftSafe);
    const maxBottom = Math.max(bottomSafe, window.innerHeight - height - topSafe);

    return {
      width,
      height,
      right: Math.min(maxRight, Math.max(rightSafe, next.right)),
      bottom: Math.min(maxBottom, Math.max(bottomSafe, next.bottom)),
    };
  }, []);

  const clampBubblePos = useCallback((next: BubblePos): BubblePos => {
    if (typeof window === 'undefined') {
      return {
        right: Math.max(BUBBLE_SAFE_MARGIN, next.right),
        bottom: Math.max(getBubbleBottomSafe(), next.bottom),
      };
    }

    const bottomSafe = getBubbleBottomSafe();
    const maxRight = Math.max(
      BUBBLE_SAFE_MARGIN,
      window.innerWidth - BUBBLE_SIZE - BUBBLE_SAFE_MARGIN
    );
    const maxBottom = Math.max(
      bottomSafe,
      window.innerHeight - BUBBLE_SIZE - BUBBLE_SAFE_MARGIN
    );

    return {
      right: Math.min(maxRight, Math.max(BUBBLE_SAFE_MARGIN, next.right)),
      bottom: Math.min(maxBottom, Math.max(bottomSafe, next.bottom)),
    };
  }, []);

  const getOpenPanelRectFromBubble = useCallback(
    (bubble: BubblePos, current: PanelRect): PanelRect => {
      const mobile = isMobileViewport();

      const candidate: PanelRect = {
        width: current.width,
        height: current.height,
        right: mobile ? bubble.right : Math.max(MIN_PANEL_MARGIN, bubble.right - 8),
        bottom: mobile ? MOBILE_PANEL_BOTTOM_SAFE : Math.max(MIN_PANEL_MARGIN, bubble.bottom - 8),
      };

      const clamped = clampPanelRect(candidate);
      if (!mobile) return clamped;

      const openOnRightHalf =
        typeof window !== 'undefined' ? bubble.right < window.innerWidth / 2 : true;

      return clampPanelRect({
        ...clamped,
        right: openOnRightHalf
          ? Math.max(MIN_PANEL_MARGIN, bubble.right)
          : Math.max(MIN_PANEL_MARGIN, bubble.right - 120),
        bottom: MOBILE_PANEL_BOTTOM_SAFE,
      });
    },
    [clampPanelRect]
  );

  const handleSetSizePreset = useCallback(
    (size: keyof typeof SIZE_PRESETS) => {
      updateInteraction();
      const preset = SIZE_PRESETS[size];
      setPanelRect((prev) =>
        clampPanelRect({
          ...prev,
          width: preset.width,
          height: preset.height,
        })
      );
    },
    [clampPanelRect, updateInteraction]
  );

  const openGuideFromBubble = useCallback(() => {
    setPanelRect((prev) => getOpenPanelRectFromBubble(bubblePos, prev));
    setIsOpen(true);
  }, [bubblePos, getOpenPanelRectFromBubble, setIsOpen]);

  const handleBubblePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      updateInteraction();
      event.preventDefault();
      event.stopPropagation();

      const startX = event.clientX;
      const startY = event.clientY;
      const startPos = bubblePos;
      const pointerId = event.pointerId;
      let moved = false;

      const onPointerMove = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId !== pointerId) return;
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;

        setBubblePos(
          clampBubblePos({
            right: startPos.right - dx,
            bottom: startPos.bottom - dy,
          })
        );
      };

      const onPointerUp = (upEvent: PointerEvent) => {
        if (upEvent.pointerId !== pointerId) return;
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);

        if (!moved) {
          openGuideFromBubble();
        }
      };

      window.addEventListener('pointermove', onPointerMove, { passive: false });
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    },
    [bubblePos, clampBubblePos, openGuideFromBubble, updateInteraction]
  );

  const handlePanelDragStart = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      updateInteraction();

      const target = event.target as HTMLElement | null;
      if (target?.closest('button')) return;

      event.preventDefault();

      const startX = event.clientX;
      const startY = event.clientY;
      const startRect = panelRect;
      const pointerId = event.pointerId;
      const previousUserSelect = document.body.style.userSelect;
      document.body.style.userSelect = 'none';

      const onPointerMove = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId !== pointerId) return;

        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        setPanelRect(
          clampPanelRect({
            ...startRect,
            right: startRect.right - dx,
            bottom: startRect.bottom - dy,
          })
        );
      };

      const cleanup = () => {
        document.body.style.userSelect = previousUserSelect;
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
      };

      const onPointerUp = (upEvent: PointerEvent) => {
        if (upEvent.pointerId !== pointerId) return;
        cleanup();
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    },
    [clampPanelRect, panelRect, updateInteraction]
  );

  const handleResizePointerDown = useCallback(
    (direction: ResizeDirection) => (event: React.PointerEvent<HTMLDivElement>) => {
      updateInteraction();
      event.preventDefault();
      event.stopPropagation();

      const startX = event.clientX;
      const startY = event.clientY;
      const startRect = panelRect;
      const pointerId = event.pointerId;
      const handleElement = event.currentTarget;
      const previousUserSelect = document.body.style.userSelect;
      document.body.style.userSelect = 'none';

      if (handleElement.setPointerCapture) {
        try {
          handleElement.setPointerCapture(pointerId);
        } catch (error) {
          console.error('Failed to capture resize pointer:', error);
        }
      }

      const handlePointerMove = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId !== pointerId) return;

        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        let nextRect: PanelRect = { ...startRect };

        if (direction.includes('left')) {
          nextRect.width = startRect.width - dx;
        }
        if (direction.includes('right')) {
          nextRect.width = startRect.width + dx;
          nextRect.right = startRect.right - dx;
        }
        if (direction.includes('top')) {
          nextRect.height = startRect.height - dy;
        }
        if (direction.includes('bottom')) {
          nextRect.height = startRect.height + dy;
          nextRect.bottom = startRect.bottom - dy;
        }

        setPanelRect(clampPanelRect(nextRect));
      };

      const cleanup = () => {
        document.body.style.userSelect = previousUserSelect;
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);

        if (handleElement.releasePointerCapture) {
          try {
            if (handleElement.hasPointerCapture?.(pointerId)) {
              handleElement.releasePointerCapture(pointerId);
            }
          } catch (error) {
            console.error('Failed to release resize pointer:', error);
          }
        }
      };

      const handlePointerUp = (upEvent: PointerEvent) => {
        if (upEvent.pointerId !== pointerId) return;
        cleanup();
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    },
    [clampPanelRect, panelRect, updateInteraction]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const widthPolicy = getPanelWidthPolicy();
    const fallbackRect = clampPanelRect({
      width: widthPolicy.defaultWidth,
      height: getDefaultPanelHeight(),
      right: DEFAULT_PANEL_RIGHT,
      bottom: DEFAULT_PANEL_BOTTOM,
    });

    try {
      const stored = window.sessionStorage.getItem(getPanelStorageKey());
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<PanelRect>;
        setPanelRect(
          clampPanelRect({
            width: isFiniteNumber(parsed.width) ? parsed.width : fallbackRect.width,
            height: isFiniteNumber(parsed.height) ? parsed.height : fallbackRect.height,
            right: isFiniteNumber(parsed.right) ? parsed.right : fallbackRect.right,
            bottom: isFiniteNumber(parsed.bottom) ? parsed.bottom : fallbackRect.bottom,
          })
        );
        return;
      }
    } catch (error) {
      console.error('Failed to restore Mercy Guide panel size:', error);
    }

    setPanelRect(fallbackRect);
  }, [clampPanelRect]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = window.sessionStorage.getItem(BUBBLE_POSITION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<BubblePos>;
        setBubblePos(
          clampBubblePos({
            right: isFiniteNumber(parsed.right) ? parsed.right : DEFAULT_BUBBLE_RIGHT,
            bottom: isFiniteNumber(parsed.bottom) ? parsed.bottom : DEFAULT_BUBBLE_BOTTOM,
          })
        );
        return;
      }
    } catch (error) {
      console.error('Failed to restore Mercy Guide bubble position:', error);
    }

    setBubblePos(
      clampBubblePos({
        right: DEFAULT_BUBBLE_RIGHT,
        bottom: DEFAULT_BUBBLE_BOTTOM,
      })
    );
  }, [clampBubblePos]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(getPanelStorageKey(), JSON.stringify(panelRect));
    } catch (error) {
      console.error('Failed to persist Mercy Guide panel size:', error);
    }
  }, [panelRect]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(BUBBLE_POSITION_STORAGE_KEY, JSON.stringify(bubblePos));
    } catch (error) {
      console.error('Failed to persist Mercy Guide bubble position:', error);
    }
  }, [bubblePos]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleWindowResize = () => {
      setPanelRect((prev) => {
        const widthPolicy = getPanelWidthPolicy();

        const next = {
          ...prev,
          width:
            !isMobileViewport() && prev.width < widthPolicy.defaultWidth
              ? widthPolicy.defaultWidth
              : prev.width,
        };

        return clampPanelRect(next);
      });

      setBubblePos((prev) => clampBubblePos(prev));
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [clampBubblePos, clampPanelRect]);

  useEffect(() => {
    if (!isOpen) return;
    setPanelRect((prev) => clampPanelRect(prev));
  }, [isOpen, clampPanelRect]);

  return {
    panelRect,
    bubblePos,
    openGuideFromBubble,
    handleSetSizePreset,
    handleBubblePointerDown,
    handlePanelDragStart,
    handleResizePointerDown,
  };
}