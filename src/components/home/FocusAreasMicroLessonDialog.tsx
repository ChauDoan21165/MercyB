// src/components/home/FocusAreasMicroLessonDialog.tsx
//
// Radix Dialog that shows a "why this is hard for Vietnamese speakers"
// micro-lesson for a single weakness tag, and routes to the mapped
// room on primary CTA.
//
// Bilingual EN + VI. Inline **bold** markdown inside strings is
// rendered via renderInlineBold so native terms stay emphasized.
//
// When `entry.linkedRoomId` is null the catalog doesn't yet have a
// matching room — the CTA flips to a disabled "coming soon" affordance
// instead of navigating anywhere.

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target } from "lucide-react";

import type { WeaknessEntry } from "@/lib/weakness/weakness-catalog";
import { renderInlineBold } from "@/lib/weakness/renderInlineBold";
import { logFocusAreasLessonStarted } from "@/lib/weakness/focusAreasAnalytics";

interface FocusAreasMicroLessonDialogProps {
  /** null closes the dialog; non-null opens and drives content. */
  entry: WeaknessEntry | null;
  onOpenChange: (open: boolean) => void;
  /** Current user id for analytics; optional. */
  userId?: string | null;
}

export default function FocusAreasMicroLessonDialog({
  entry,
  onOpenChange,
  userId,
}: FocusAreasMicroLessonDialogProps) {
  const navigate = useNavigate();
  const open = entry !== null;
  const hasRoom = entry !== null && entry.linkedRoomId !== null;

  function handleStart() {
    if (!entry || !entry.linkedRoomId) return;
    if (userId) {
      logFocusAreasLessonStarted(userId, entry.tag, entry.linkedRoomId);
    }
    onOpenChange(false);
    navigate(`/room/${entry.linkedRoomId}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {entry ? (
          <>
            <DialogHeader>
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <Target className="h-5 w-5" aria-hidden />
              </div>
              <DialogTitle className="text-center text-lg font-semibold">
                {renderInlineBold(entry.shortLabel.en)}
              </DialogTitle>
              <DialogDescription className="text-center text-sm text-slate-500">
                {renderInlineBold(entry.shortLabel.vi)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-1">
              <p className="text-sm leading-relaxed text-slate-800">
                {renderInlineBold(entry.longDescription.en)}
              </p>
              <p className="text-xs leading-relaxed text-slate-500">
                {renderInlineBold(entry.longDescription.vi)}
              </p>

              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 text-xs font-semibold uppercase text-rose-600">✗</span>
                  <span className="text-slate-700 line-through decoration-rose-300">
                    {entry.exampleWrong}
                  </span>
                </div>
                <div className="mt-1 flex items-start gap-2">
                  <span className="mt-0.5 text-xs font-semibold uppercase text-emerald-600">✓</span>
                  <span className="font-medium text-slate-800">{entry.exampleRight}</span>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-2 flex-col gap-2 sm:flex-col">
              {hasRoom ? (
                <Button
                  type="button"
                  onClick={handleStart}
                  className="w-full bg-amber-500 text-white hover:bg-amber-600"
                >
                  Start lesson / Bắt đầu bài học
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="w-full cursor-not-allowed bg-slate-200 text-slate-500 hover:bg-slate-200"
                >
                  Lesson coming soon / Sắp có bài học
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="w-full text-slate-500"
              >
                Not now / Để sau
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
