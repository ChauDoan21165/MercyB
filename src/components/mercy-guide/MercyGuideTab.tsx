import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Send, Volume2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';
import { getMercyGuideAnswer } from './mercyGuideAnswers';

interface MercyGuideTabProps {
  onRequestSpeakTab?: () => void;
  onRequestHostTab?: () => void; // 👈 NEW
}

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  language: 'vi' | 'en';
  suggestSpeak?: boolean;
};

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function cleanText(value?: string | null) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function detectLanguage(input: string): 'vi' | 'en' {
  return /[à-ỹ]/i.test(input) ? 'vi' : 'en';
}

function buildStarterMessage(): ChatMessage {
  return {
    id: makeId(),
    role: 'assistant',
    text: getMercyGuideAnswer('greeting', 'vi'),
    language: 'vi',
  };
}

export function MercyGuideTab({
  onRequestSpeakTab,
  onRequestHostTab,
}: MercyGuideTabProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [buildStarterMessage()]);
  const [draft, setDraft] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const messagesScrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const el = messagesScrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isSubmitting]);

  const append = (msg: ChatMessage) =>
    setMessages((prev) => [...prev, msg]);

  const submitMessage = useCallback(() => {
    const input = cleanText(draft);
    if (!input || isSubmitting) return;

    const lang = detectLanguage(input);

    append({
      id: makeId(),
      role: 'user',
      text: input,
      language: lang,
    });

    setDraft('');
    setIsSubmitting(true);

    // 🔥 SIMPLE GUIDE LOGIC ONLY

    let reply = '';

    const lower = input.toLowerCase();

    if (lower.includes('use') || lower.includes('how')) {
      reply = getMercyGuideAnswer('app_usage', lang);
    }
    else if (lower.includes('where') || lower.includes('room')) {
      reply = getMercyGuideAnswer('room_usage', lang);
    }
    else if (lower.includes('guide me')) {
      reply = getMercyGuideAnswer('onboarding', lang);
    }
    else if (lower.includes('pronounce') || lower.includes('speak')) {
      reply =
        lang === 'vi'
          ? 'Bạn nên dùng Speak để luyện phát âm.'
          : 'Please use Speak for pronunciation.';
      onRequestSpeakTab?.();
    }
    else if (
      lower.includes('grammar') ||
      lower.includes('check') ||
      lower.includes('correct') ||
      lower.includes('rewrite') ||
      lower.includes('summarize')
    ) {
      reply =
        lang === 'vi'
          ? 'Câu hỏi này phù hợp với Mercy Host. Hãy chuyển sang đó để học nhé.'
          : 'This is a learning question. Please switch to Mercy Host.';
      onRequestHostTab?.();
    }
    else {
      reply = getMercyGuideAnswer('fallback', lang);
    }

    append({
      id: makeId(),
      role: 'assistant',
      text: reply,
      language: lang,
    });

    setIsSubmitting(false);
  }, [draft, isSubmitting, onRequestSpeakTab, onRequestHostTab]);

  return (
    <TabsContent value="guide" className="m-0 flex h-full flex-col overflow-hidden">
      <div className="flex flex-1 flex-col bg-white">
        <div ref={messagesScrollRef} className="flex-1 overflow-y-auto px-4 pt-4">
          <div className="space-y-3 pb-24">
            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  m.role === 'user'
                    ? 'ml-8 rounded-2xl bg-primary px-4 py-3 text-primary-foreground'
                    : 'mr-8 rounded-2xl border bg-muted/30 px-4 py-3'
                }
              >
                {m.text}
              </div>
            ))}

            {isSubmitting && (
              <div className="mr-8 rounded-2xl border bg-muted/30 px-4 py-3">
                Mercy đang nghĩ...
              </div>
            )}
          </div>
        </div>

        <div className="border-t px-4 py-3">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  submitMessage();
                }
              }}
              placeholder="Ask Guide..."
            />

            <Button onClick={submitMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}