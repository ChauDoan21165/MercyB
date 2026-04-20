// Path: src/components/notebook/NotebookPanel.tsx
// Orchestrator: due-queue header + filter pills + list + tier hint.

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Sparkles } from 'lucide-react';
import { useNotebook } from '@/hooks/useNotebook';
import { NotebookList } from './NotebookList';
import { NotebookReview } from './NotebookReview';

export interface NotebookPanelProps {
  isKidsMode?: boolean;
}

export function NotebookPanel({ isKidsMode = false }: NotebookPanelProps) {
  const notebook = useNotebook();
  const [reviewOpen, setReviewOpen] = useState(false);

  if (isKidsMode) return null;

  if (!notebook.isAuthenticated) {
    return (
      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-rose-500" />
          <h3 className="text-base font-semibold">Notebook</h3>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to save words and grammar for spaced-repetition review.
        </p>
      </section>
    );
  }

  const dueCount = notebook.dueItems.length;
  const limitText = Number.isFinite(notebook.limit)
    ? `${notebook.total} / ${notebook.limit} saved`
    : `${notebook.total} saved`;
  const showUpgradeHint =
    Number.isFinite(notebook.limit) &&
    notebook.total >= Math.floor((notebook.limit as number) * 0.8);

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-rose-500" />
          <h3 className="text-base font-semibold">Notebook</h3>
        </div>
        <span className="text-xs text-muted-foreground">{limitText}</span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-rose-50/60 px-3 py-2.5">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900">
            {dueCount === 0
              ? 'No reviews due'
              : `${dueCount} due for review`}
          </p>
          <p className="text-xs text-muted-foreground">
            {dueCount === 0
              ? 'Come back later — spaced repetition works best with time.'
              : 'A few minutes of review goes a long way.'}
          </p>
        </div>
        <Button
          size="sm"
          disabled={dueCount === 0}
          className="shrink-0 bg-rose-500 hover:bg-rose-600"
          onClick={() => setReviewOpen(true)}
        >
          Start review
        </Button>
      </div>

      <div className="mt-4">
        <NotebookList />
      </div>

      {showUpgradeHint ? (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="leading-5">
            Bạn đã lưu {notebook.total} từ — tuyệt vời! Nâng cấp Premium để lưu
            không giới hạn 💎
          </p>
        </div>
      ) : null}

      <NotebookReview open={reviewOpen} onOpenChange={setReviewOpen} />
    </section>
  );
}

export default NotebookPanel;
