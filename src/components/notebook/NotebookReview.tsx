// Path: src/components/notebook/NotebookReview.tsx
// One-card-at-a-time review flow. Tap rating → auto-advance.

import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNotebook } from '@/hooks/useNotebook';
import type { NotebookItem, NotebookRating } from '@/services/notebookService';

export interface NotebookReviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RATING_ORDER: { value: NotebookRating; label: string; className: string }[] = [
  { value: 'again', label: 'Again', className: 'bg-rose-500 hover:bg-rose-600' },
  { value: 'hard', label: 'Hard', className: 'bg-amber-500 hover:bg-amber-600' },
  { value: 'good', label: 'Good', className: 'bg-emerald-500 hover:bg-emerald-600' },
  { value: 'easy', label: 'Easy', className: 'bg-sky-500 hover:bg-sky-600' },
];

export function NotebookReview({ open, onOpenChange }: NotebookReviewProps) {
  const { toast } = useToast();
  const notebook = useNotebook();
  const [queue, setQueue] = useState<NotebookItem[]>([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [rating, setRating] = useState<NotebookRating | null>(null);

  useEffect(() => {
    if (!open) return;
    setQueue(notebook.dueItems);
    setIndex(0);
    setShowAnswer(false);
    setRating(null);
  }, [open, notebook.dueItems]);

  const current = queue[index];
  const completed = index >= queue.length;

  const handleRate = async (value: NotebookRating) => {
    if (!current) return;
    setRating(value);
    try {
      await notebook.review(current.id, value);
    } catch (err) {
      toast({
        title: 'Could not save review',
        description: (err as Error)?.message ?? 'Please try again.',
        variant: 'destructive',
      });
    }
    setTimeout(() => {
      setIndex((i) => i + 1);
      setShowAnswer(false);
      setRating(null);
    }, 150);
  };

  const progressLabel = useMemo(() => {
    if (queue.length === 0) return '';
    return `${Math.min(index + 1, queue.length)} / ${queue.length}`;
  }, [index, queue.length]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Review</span>
            {queue.length > 0 && !completed ? (
              <span className="text-xs font-normal text-muted-foreground">
                {progressLabel}
              </span>
            ) : null}
          </DialogTitle>
          <DialogDescription>
            Tap the rating that matches how well you remembered it.
          </DialogDescription>
        </DialogHeader>

        {queue.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nothing due right now — nice work!
            </p>
            <Button className="mt-4" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : completed ? (
          <div className="py-8 text-center">
            <p className="text-base font-semibold">All done for now 🎉</p>
            <p className="mt-1 text-sm text-muted-foreground">
              You reviewed {queue.length} item{queue.length === 1 ? '' : 's'}.
            </p>
            <Button className="mt-4" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : current ? (
          <div className="space-y-4 py-2">
            <div className="rounded-xl bg-rose-50/70 px-4 py-5 text-center">
              <p className="text-2xl font-semibold leading-tight text-slate-900">
                {current.content_en}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                {current.item_type}
              </p>
            </div>

            {showAnswer ? (
              <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
                {current.content_vi ? (
                  <p className="text-base text-slate-900">{current.content_vi}</p>
                ) : (
                  <p className="text-sm italic text-muted-foreground">
                    No translation saved
                  </p>
                )}
                {current.notes ? (
                  <p className="text-xs leading-5 text-muted-foreground">
                    {current.notes}
                  </p>
                ) : null}
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowAnswer(true)}
              >
                Show answer
              </Button>
            )}

            {showAnswer ? (
              <div className="grid grid-cols-4 gap-2">
                {RATING_ORDER.map((r) => (
                  <Button
                    key={r.value}
                    className={`${r.className} text-white`}
                    onClick={() => handleRate(r.value)}
                    disabled={rating !== null}
                  >
                    {r.label}
                  </Button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default NotebookReview;
