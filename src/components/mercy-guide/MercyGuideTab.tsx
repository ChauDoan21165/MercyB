import React, { useEffect, useState, useRef } from 'react';
import { Send, Play, Pause, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';

// 1. GLOBAL AUDIO SINGLETON (Essential for Chrome/Safari trust)
const globalMercyPlayer = typeof window !== 'undefined' ? new Audio() : null;

export function MercyGuideTab() {
  const [messages, setMessages] = useState<any[]>([]);
  const [draft, setDraft] = useState('');
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const PLAYLIST = [
    "https://actions.google.com/sounds/v1/science_fiction/low_vibe.ogg", 
    "https://actions.google.com/sounds/v1/science_fiction/robot_hum.ogg"
  ];

  // FIX 1: THE ZOOM (FORCED CSS & META OVERRIDE)
  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta) {
      meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
    }
    const style = document.createElement('style');
    style.innerHTML = `html, body, [data-state="active"] { touch-action: auto !important; overflow: auto !important; }`;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  // FIX 2: CONTINUOUS MUSIC (STABLE DOM EVENT)
  useEffect(() => {
    if (!globalMercyPlayer) return;
    const onEnded = () => {
      setTrackIndex((prev) => {
        const next = (prev + 1) % PLAYLIST.length;
        globalMercyPlayer.src = PLAYLIST[next];
        globalMercyPlayer.load(); 
        globalMercyPlayer.play().catch(() => console.log("Autoplay blocked"));
        return next;
      });
    };
    globalMercyPlayer.addEventListener('ended', onEnded);
    if (!globalMercyPlayer.src) globalMercyPlayer.src = PLAYLIST[trackIndex];
    return () => globalMercyPlayer.removeEventListener('ended', onEnded);
  }, [PLAYLIST]);

  const togglePlay = () => {
    if (!globalMercyPlayer) return;
    if (isPlaying) { globalMercyPlayer.pause(); setIsPlaying(false); }
    else { globalMercyPlayer.play().then(() => setIsPlaying(true)).catch(console.error); }
  };

  return (
    <TabsContent value="guide" className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between border-b p-2 bg-slate-50">
        <span className="text-[10px] font-bold text-slate-400 px-2 uppercase">Mercy Player</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={togglePlay}>{isPlaying ? <Pause size={14}/> : <Play size={14}/>}</Button>
          <Button variant="ghost" size="sm" onClick={() => setTrackIndex(i => (i + 1) % PLAYLIST.length)}><SkipForward size={14}/></Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">{/* Messages */}</div>
      <div className="border-t p-4 pb-10">
        <div className="flex gap-2">
          <Input 
            value={draft} 
            onChange={(e) => setDraft(e.target.value)} 
            style={{ fontSize: '16px', height: '48px' }} 
            className="text-base" 
            placeholder="Ask Guide..."
          />
          <Button className="h-12" onClick={() => setMessages([...messages, {role:'user', text: draft}])}><Send size={18}/></Button>
        </div>
      </div>
    </TabsContent>
  );
}