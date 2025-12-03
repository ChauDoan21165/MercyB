import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X, VolumeX } from 'lucide-react';
import { MercyAvatar } from './MercyAvatar';

interface CompanionBubbleProps {
  text: string;
  visible: boolean;
  onClose?: () => void;
  textVi?: string;
  duration?: number;
  isTalking?: boolean;
  title?: string;
  className?: string;
  onMuteRoom?: () => void;
  showMuteOption?: boolean;
}

export function CompanionBubble({ text, visible, onClose, textVi, isTalking = false, title = 'Mercy', className, onMuteRoom, showMuteOption = false }: CompanionBubbleProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (visible) { setShouldRender(true); requestAnimationFrame(() => setIsAnimating(true)); }
    else { setIsAnimating(false); const t = setTimeout(() => setShouldRender(false), 300); return () => clearTimeout(t); }
  }, [visible]);

  const handleClose = useCallback(() => { setIsAnimating(false); setTimeout(() => onClose?.(), 300); }, [onClose]);

  if (!shouldRender || !text) return null;

  return (
    <div className={cn('fixed z-40 bottom-24 right-4 md:bottom-8 md:right-8 max-w-sm w-[min(320px,calc(100vw-2rem))] transition-all duration-300 ease-out', isAnimating ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95', className)} role="status" aria-live="polite">
      <div className="flex items-start gap-3 rounded-2xl bg-card/95 backdrop-blur-sm shadow-lg px-3 py-3 border border-border/50">
        <MercyAvatar size={36} isTalking={isTalking} />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{text}</p>
          {textVi && <p className="text-xs text-muted-foreground/70 mt-1">{textVi}</p>}
          {showMuteOption && onMuteRoom && (
            <button type="button" onClick={() => { onMuteRoom(); handleClose(); }} className="mt-2 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              <VolumeX className="h-3 w-3" />Hide Mercy in this room
            </button>
          )}
        </div>
        {onClose && <button type="button" onClick={handleClose} className="flex-shrink-0 ml-1 w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors" aria-label="Dismiss"><X className="w-3.5 h-3.5" /></button>}
      </div>
    </div>
  );
}

export default CompanionBubble;
