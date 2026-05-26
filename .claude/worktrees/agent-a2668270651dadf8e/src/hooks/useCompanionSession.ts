import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { getRandomCompanionLine, CompanionCategory } from '@/lib/companionLines';
import { canCompanionSpeakGlobally, markCompanionSpoken } from '@/lib/companionGlobal';

const STORAGE_KEY = 'companion_enabled';
const MUTED_ROOMS_KEY = 'mercy_muted_rooms';
const VISIT_COUNTS_KEY = 'mercy_room_visits';
const SESSION_COOLDOWN_MS = 30_000;
const MAX_BUBBLES_EARLY = 3;
const MAX_BUBBLES_LATER = 1;

export interface CompanionSessionState {
  roomId: string;
  bubblesShown: number;
  lastCategory?: CompanionCategory;
  lastShownAt?: number;
}

function getMutedRooms(): string[] {
  try {
    return JSON.parse(localStorage.getItem(MUTED_ROOMS_KEY) || '[]');
  } catch { return []; }
}

function setMutedRooms(rooms: string[]): void {
  localStorage.setItem(MUTED_ROOMS_KEY, JSON.stringify(rooms));
}

function getVisitCounts(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(VISIT_COUNTS_KEY) || '{}');
  } catch { return {}; }
}

function incrementVisitCount(roomId: string): number {
  const counts = getVisitCounts();
  counts[roomId] = (counts[roomId] || 0) + 1;
  sessionStorage.setItem(VISIT_COUNTS_KEY, JSON.stringify(counts));
  return counts[roomId];
}

export function useCompanionSession(roomId: string) {
  const [sessionState, setSessionState] = useState<CompanionSessionState>({ roomId, bubblesShown: 0 });
  const [bubbleData, setBubbleData] = useState({ text: '', visible: false });
  const [isRoomMuted, setIsRoomMuted] = useState(() => getMutedRooms().includes(roomId));
  const [visitCount, setVisitCount] = useState(0);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const shownCategoriesRef = useRef<Set<CompanionCategory>>(new Set());

  useEffect(() => {
    setVisitCount(incrementVisitCount(roomId));
    setIsRoomMuted(getMutedRooms().includes(roomId));
    setSessionState({ roomId, bubblesShown: 0 });
    shownCategoriesRef.current.clear();
  }, [roomId]);

  useEffect(() => () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); }, []);

  const getMaxBubbles = useCallback(() => visitCount <= 3 ? MAX_BUBBLES_EARLY : MAX_BUBBLES_LATER, [visitCount]);

  const canSpeak = useCallback((): boolean => {
    if (!getCompanionEnabled() || isRoomMuted) return false;
    if (!canCompanionSpeakGlobally()) return false;
    if (sessionState.lastShownAt && Date.now() - sessionState.lastShownAt < SESSION_COOLDOWN_MS) return false;
    if (sessionState.bubblesShown >= getMaxBubbles()) return false;
    return true;
  }, [sessionState, isRoomMuted, getMaxBubbles]);

  const hideBubble = useCallback(() => setBubbleData(p => ({ ...p, visible: false })), []);

  const showBubble = useCallback((category: CompanionCategory, overrideCooldown = false) => {
    if (!getCompanionEnabled() || isRoomMuted) return;
    if (!overrideCooldown && shownCategoriesRef.current.has(category)) return;
    if (!overrideCooldown && !canSpeak()) return;
    if (sessionState.bubblesShown >= getMaxBubbles()) return;

    const text = getRandomCompanionLine(category);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setBubbleData({ text, visible: true });
    shownCategoriesRef.current.add(category);
    markCompanionSpoken();
    setSessionState(p => ({ ...p, bubblesShown: p.bubblesShown + 1, lastCategory: category, lastShownAt: Date.now() }));
    hideTimerRef.current = setTimeout(hideBubble, 8000);
  }, [canSpeak, sessionState.bubblesShown, isRoomMuted, getMaxBubbles, hideBubble]);

  const resetSession = useCallback(() => {
    setSessionState({ roomId, bubblesShown: 0 });
    shownCategoriesRef.current.clear();
    setBubbleData({ text: '', visible: false });
  }, [roomId]);

  const muteRoom = useCallback(() => {
    const muted = getMutedRooms();
    if (!muted.includes(roomId)) setMutedRooms([...muted, roomId]);
    setIsRoomMuted(true);
    hideBubble();
  }, [roomId, hideBubble]);

  const unmuteRoom = useCallback(() => {
    setMutedRooms(getMutedRooms().filter(id => id !== roomId));
    setIsRoomMuted(false);
  }, [roomId]);

  return useMemo(() => ({ sessionState, bubbleData, showBubble, canSpeak, resetSession, hideBubble, isRoomMuted, muteRoom, unmuteRoom, visitCount }), [sessionState, bubbleData, showBubble, canSpeak, resetSession, hideBubble, isRoomMuted, muteRoom, unmuteRoom, visitCount]);
}

export function setCompanionEnabled(enabled: boolean): void {
  localStorage.setItem(STORAGE_KEY, String(enabled));
  window.dispatchEvent(new CustomEvent('companion-enabled-change', { detail: enabled }));
}

export function getCompanionEnabled(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored !== 'false';
}

export function useCompanionEnabledState(): boolean {
  const [enabled, setEnabled] = useState(getCompanionEnabled);
  useEffect(() => {
    const h1 = (e: CustomEvent<boolean>) => setEnabled(e.detail);
    const h2 = (e: StorageEvent) => { if (e.key === STORAGE_KEY) setEnabled(e.newValue !== 'false'); };
    window.addEventListener('companion-enabled-change', h1 as EventListener);
    window.addEventListener('storage', h2);
    return () => { window.removeEventListener('companion-enabled-change', h1 as EventListener); window.removeEventListener('storage', h2); };
  }, []);
  return enabled;
}

export function getMutedRoomsList(): string[] { return getMutedRooms(); }
export function clearMutedRooms(): void { localStorage.removeItem(MUTED_ROOMS_KEY); }
