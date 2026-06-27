// PATH: src/components/mercy-guide/MercyGuideTab.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { Send, Play, Pause, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Global audio singleton for trusted playback reuse across renders.
const globalMercyPlayer = typeof window !== 'undefined' ? new Audio() : null;

const PLAYLIST = [
  'https://actions.google.com/sounds/v1/science_fiction/low_vibe.ogg',
  'https://actions.google.com/sounds/v1/science_fiction/robot_hum.ogg',
];

type GuideMessage = {
  role: 'user';
  text: string;
};

export function MercyGuideTab() {
  const [messages, setMessages] = useState<GuideMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentTrack = useMemo(() => PLAYLIST[trackIndex] ?? PLAYLIST[0], [trackIndex]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const meta = document.querySelector('meta[name="viewport"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes'
      );
    }

    const style = document.createElement('style');
    style.innerHTML =
      'html, body, [data-state="active"] { touch-action: auto !important; overflow: auto !important; }';
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, []);

  useEffect(() => {
    if (!globalMercyPlayer) return;

    const onEnded = () => {
      setTrackIndex((prev) => {
        const next = (prev + 1) % PLAYLIST.length;
        globalMercyPlayer.src = PLAYLIST[next];
        globalMercyPlayer.load();
        globalMercyPlayer.play().catch(() => {
          setIsPlaying(false);
        });
        return next;
      });
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    globalMercyPlayer.addEventListener('ended', onEnded);
    globalMercyPlayer.addEventListener('play', onPlay);
    globalMercyPlayer.addEventListener('pause', onPause);

    if (!globalMercyPlayer.src) {
      globalMercyPlayer.src = currentTrack;
    }

    return () => {
      globalMercyPlayer.removeEventListener('ended', onEnded);
      globalMercyPlayer.removeEventListener('play', onPlay);
      globalMercyPlayer.removeEventListener('pause', onPause);
    };
  }, [currentTrack]);

  const togglePlay = () => {
    if (!globalMercyPlayer) return;

    if (!globalMercyPlayer.src) {
      globalMercyPlayer.src = currentTrack;
    }

    if (isPlaying) {
      globalMercyPlayer.pause();
      return;
    }

    globalMercyPlayer.play().catch(console.error);
  };

  const handleSkip = () => {
    if (!globalMercyPlayer) return;

    setTrackIndex((prev) => {
      const next = (prev + 1) % PLAYLIST.length;
      globalMercyPlayer.src = PLAYLIST[next];
      globalMercyPlayer.load();

      if (isPlaying) {
        globalMercyPlayer.play().catch(console.error);
      }

      return next;
    });
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: 'user', text }]);
    setDraft('');
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between border-b bg-slate-50 p-2">
        <span className="px-2 text-[10px] font-bold uppercase text-slate-600">
          Mercy Player
        </span>

        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={togglePlay}>
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </Button>

          <Button type="button" variant="ghost" size="sm" onClick={handleSkip}>
            <SkipForward size={14} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className="rounded-lg border bg-slate-50 px-3 py-2 text-sm"
            >
              <span className="mr-2 font-semibold capitalize">{message.role}:</span>
              <span>{message.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t p-4 pb-10">
        <div className="flex gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
            style={{ fontSize: '16px', height: '48px' }}
            className="text-base"
            placeholder="Ask Guide..."
          />

          <Button type="button" className="h-12" onClick={handleSend}>
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MercyGuideTab;