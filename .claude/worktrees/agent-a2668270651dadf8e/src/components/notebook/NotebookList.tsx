// Path: src/components/notebook/NotebookList.tsx
// Filterable list of saved notebook items with per-item delete.

import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNotebook } from '@/hooks/useNotebook';
import type { NotebookItemType } from '@/services/notebookService';

type FilterKey = 'all' | NotebookItemType;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'word', label: 'Words' },
  { key: 'grammar', label: 'Grammar' },
];

function formatRelativeDue(iso: string, now: Date = new Date()): string {
  const due = new Date(iso);
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return `due ${-diffDays}d ago`;
  if (diffDays === 0) return 'due today';
  if (diffDays === 1) return 'due tomorrow';
  return `due in ${diffDays}d`;
}

export function NotebookList() {
  const { toast } = useToast();
  const notebook = useNotebook();
  const [filter, setFilter] = useState<FilterKey>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return notebook.items;
    return notebook.items.filter((item) => item.item_type === filter);
  }, [filter, notebook.items]);

  const handleDelete = async (id: string) => {
    try {
      await notebook.remove(id);
      toast({ title: 'Removed from notebook' });
    } catch (err) {
      toast({
        title: 'Could not delete',
        description: (err as Error)?.message ?? 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              filter === f.key
                ? 'border-rose-300 bg-rose-500 text-white'
                : 'border-border bg-card text-foreground hover:bg-accent'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {notebook.isLoading ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Loading…
        </p>
      ) : filtered.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          {filter === 'all'
            ? 'Your notebook is empty. Save words from Teacher Mercy to get started.'
            : `No ${filter === 'word' ? 'words' : 'grammar points'} yet.`}
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((item) => (
            <li
              key={item.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {item.content_en}
                  </p>
                  <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-600">
                    {item.item_type}
                  </span>
                </div>
                {item.content_vi ? (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {item.content_vi}
                  </p>
                ) : null}
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {formatRelativeDue(item.next_review_at)} · reviewed{' '}
                  {item.review_count}×
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-rose-600"
                onClick={() => handleDelete(item.id)}
                aria-label={`Remove ${item.content_en}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotebookList;
