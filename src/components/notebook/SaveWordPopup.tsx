// Path: src/components/notebook/SaveWordPopup.tsx
// Reusable save dialog. Used from Teacher Mercy tab now; rooms later.

import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BookmarkCheck, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNotebook } from '@/hooks/useNotebook';
import {
  NotebookLimitError,
  type NotebookItem,
  type NotebookItemSource,
  type NotebookItemType,
} from '@/services/notebookService';

export interface SaveWordPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemType: NotebookItemType;
  contentEn: string;
  defaultContentVi?: string | null;
  defaultNotes?: string | null;
  source: NotebookItemSource;
  sourceRef?: string | null;
  audioUrl?: string | null;
  onSaved?: (item: NotebookItem) => void;
}

export function SaveWordPopup({
  open,
  onOpenChange,
  itemType,
  contentEn,
  defaultContentVi,
  defaultNotes,
  source,
  sourceRef,
  audioUrl,
  onSaved,
}: SaveWordPopupProps) {
  const { toast } = useToast();
  const notebook = useNotebook();
  const [contentVi, setContentVi] = useState(defaultContentVi ?? '');
  const [notes, setNotes] = useState(defaultNotes ?? '');
  const [existing, setExisting] = useState<NotebookItem | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setContentVi(defaultContentVi ?? '');
    setNotes(defaultNotes ?? '');
    setExisting(null);
    let cancelled = false;
    void notebook.checkSaved(itemType, contentEn).then((found) => {
      if (!cancelled) setExisting(found);
    });
    return () => {
      cancelled = true;
    };
  }, [open, itemType, contentEn, defaultContentVi, defaultNotes, notebook]);

  const atLimitNewSave = notebook.isAtLimit && !existing;

  const titleLabel = useMemo(
    () => (itemType === 'word' ? 'Save this word' : 'Save this grammar point'),
    [itemType],
  );

  const handleSave = async () => {
    if (atLimitNewSave) return;
    setSaving(true);
    try {
      const result = await notebook.save({
        item_type: itemType,
        content_en: contentEn,
        content_vi: contentVi.trim() || null,
        notes: notes.trim() || null,
        source,
        source_ref: sourceRef ?? null,
        audio_url: audioUrl ?? null,
      });
      if (result.alreadyExisted) {
        toast({ title: 'Already in your notebook ✓' });
      } else {
        toast({ title: 'Saved to your notebook ✓' });
      }
      onSaved?.(result.item);
      onOpenChange(false);
    } catch (err) {
      if (err instanceof NotebookLimitError) {
        toast({
          title: 'Notebook full',
          description: `Free tier allows ${err.limit} items. Upgrade for unlimited.`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Could not save',
          description: (err as Error)?.message ?? 'Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setSaving(false);
    }
  };

  if (!notebook.isAuthenticated) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in to save</DialogTitle>
            <DialogDescription>
              Create a free account to build your personal notebook.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bottom-0 left-0 top-auto w-full translate-x-0 translate-y-0 rounded-t-2xl p-5 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom sm:bottom-auto sm:left-[50%] sm:top-[50%] sm:max-w-md sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-2xl">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <BookmarkCheck className="h-5 w-5 text-rose-500" />
            {titleLabel}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Lưu vào sổ tay cá nhân để ôn lại sau.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          <div className="rounded-xl bg-rose-50/70 px-4 py-3">
            <p className="text-xl font-semibold leading-tight text-slate-900">
              {contentEn}
            </p>
          </div>

          {existing ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Already in your notebook ✓ — review due{' '}
              {new Date(existing.next_review_at).toLocaleDateString()}
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="notebook-vi" className="text-xs">
                  Tiếng Việt (Vietnamese)
                </Label>
                <Input
                  id="notebook-vi"
                  value={contentVi}
                  onChange={(e) => setContentVi(e.target.value)}
                  placeholder="Thêm bản dịch…"
                  autoComplete="off"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notebook-notes" className="text-xs">
                  Ghi chú (optional)
                </Label>
                <Textarea
                  id="notebook-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Example sentence or context…"
                  rows={2}
                />
              </div>
            </>
          )}

          {atLimitNewSave ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <p className="font-medium">
                You've saved {notebook.total} words — amazing progress!
              </p>
              <p className="mt-1 text-xs leading-5">
                Bạn đã lưu {notebook.total} từ — tuyệt vời! Nâng cấp Premium để
                lưu không giới hạn 💎
              </p>
            </div>
          ) : null}
        </div>

        <DialogFooter className="mt-4 flex-row gap-2 sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          {atLimitNewSave ? (
            <Button
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 sm:flex-none"
              onClick={() => onOpenChange(false)}
            >
              <Sparkles className="mr-1.5 h-4 w-4" />
              Unlock Premium
            </Button>
          ) : existing ? (
            <Button
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-none"
            >
              Got it
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-rose-500 hover:bg-rose-600 sm:flex-none"
            >
              {saving ? 'Saving…' : 'Save'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SaveWordPopup;
