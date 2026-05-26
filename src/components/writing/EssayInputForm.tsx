// src/components/writing/EssayInputForm.tsx
//
// Textarea-driven essay input. Counts words + chars, enforces a 2000-
// word ceiling, and emits the rubric to the parent on Submit. Save-
// attempt is intentionally a no-op for now (will land alongside the
// mercy_writing_attempts table in daytime work).

import React, { useCallback, useMemo, useState } from "react";
import { Loader2, Save, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { scoreEssay } from "@/lib/writing-feedback/scoreEssay";
import type { WritingRubric } from "@/lib/writing-feedback/rubric";
import { WRITING_COPY } from "./writingFeedbackCopy";

const MAX_WORDS = 2000;

interface EssayInputFormProps {
  /** Optional initial value for the textarea. */
  initialText?: string;
  /** Called with the resulting rubric (and submitted text) on Get feedback. */
  onScored: (rubric: WritingRubric, text: string) => void;
}

function countWords(text: string): number {
  const matches = text.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g);
  return matches ? matches.length : 0;
}

export function EssayInputForm({ initialText, onScored }: EssayInputFormProps) {
  const [text, setText] = useState(initialText ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  const wordCount = useMemo(() => countWords(text), [text]);
  const charCount = text.length;
  const tooLong = wordCount > MAX_WORDS;

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (text.trim().length === 0) {
        setWarning(WRITING_COPY.emptyTextWarning.vi);
        return;
      }
      if (tooLong) {
        setWarning(WRITING_COPY.tooLongWarning.vi);
        return;
      }
      setWarning(null);
      setIsSubmitting(true);
      // Synchronous scorer; the spinner is essentially decorative on
      // most devices but is honest on very long essays.
      const rubric = scoreEssay(text);
      onScored(rubric, text);
      setIsSubmitting(false);
    },
    [onScored, text, tooLong],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (warning) setWarning(null);
        }}
        placeholder={WRITING_COPY.inputPlaceholder.vi}
        rows={12}
        className="w-full resize-y rounded-md border border-input bg-background p-3 text-sm leading-relaxed shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className={tooLong ? "text-destructive" : undefined}>
          {WRITING_COPY.wordCount(wordCount, MAX_WORDS).vi}
        </span>
        <span>{WRITING_COPY.charCount(charCount).vi}</span>
      </div>

      {warning && <p className="text-xs text-destructive">{warning}</p>}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isSubmitting || tooLong}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          {WRITING_COPY.getFeedbackCta.vi}
        </Button>

        <Button type="button" variant="ghost" disabled title={WRITING_COPY.saveDeferredHint.vi}>
          <Save className="mr-2 h-4 w-4" />
          {WRITING_COPY.saveAttemptCta.vi}
        </Button>
      </div>

      <p className="text-[11px] text-muted-foreground">
        {WRITING_COPY.saveDeferredHint.vi}
      </p>
    </form>
  );
}
