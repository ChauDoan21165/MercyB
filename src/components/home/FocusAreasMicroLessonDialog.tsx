// src/components/home/FocusAreasMicroLessonDialog.tsx
//
// Radix Dialog that shows a "why this is hard for Vietnamese speakers"
// micro-lesson for a single weakness tag, and routes to the mapped
// room on primary CTA.
//
// Bilingual EN + VI. Inline **bold** markdown inside strings is
// rendered via renderInlineBold so native terms stay emphasized.

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

  function handleStart() {
    if (!entry) return;
    if (userId) {
      logFocusAreasLessonStarted(userId, entry.tag, entry.roomId);
    }
    onOpenChange(false);
    navigate(`/room/${entry.roomId}`);
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
                {renderInlineBold(entry.displayEn)}
              </DialogTitle>
              <DialogDescription className="text-center text-sm text-slate-500">
                {renderInlineBold(entry.displayVi)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-1">
              <p className="text-sm leading-relaxed text-slate-800">
                {renderInlineBold(entry.whyEn)}
              </p>
              <p className="text-xs leading-relaxed text-slate-500">
                {renderInlineBold(entry.whyVi)}
              </p>
            </div>

            <DialogFooter className="mt-2 flex-col gap-2 sm:flex-col">
              <Button
                type="button"
                onClick={handleStart}
                className="w-full bg-amber-500 text-white hover:bg-amber-600"
              >
                Start lesson / Bắt đầu bài học
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Button>
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
