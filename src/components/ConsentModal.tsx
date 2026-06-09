// src/components/ConsentModal.tsx
//
// One-time opt-in for the C2 conversation data-capture pipeline. Lane A renders
// this on first conversation start when no choice has been recorded yet
// (hasCaptureConsentDecision() === false) and stops capture until the learner
// agrees.
//
// Privacy posture (no dark patterns):
//   - Nothing is pre-selected; the affirmative requires an explicit click.
//   - Declining — OR dismissing via Esc / backdrop / the close X — records a
//     "no" and fails closed (no capture). Either way the choice is remembered,
//     so the modal shows exactly once.
//   - Declining never breaks the conversation; it just means no data is saved.
//
// Vietnamese-first: VI is the primary copy, EN the secondary line beneath it.

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { setCaptureConsent } from "@/lib/conversationCapture/captureConsent";

interface ConsentModalProps {
  open: boolean;
  /** Called with the learner's choice after it has been persisted. */
  onDecision: (consented: boolean) => void;
}

export function ConsentModal({ open, onDecision }: ConsentModalProps) {
  const choose = (consented: boolean) => {
    setCaptureConsent(consented);
    onDecision(consented);
  };

  return (
    <Dialog
      open={open}
      // Esc / backdrop / close-X all resolve as a decline (fail closed).
      onOpenChange={(next) => {
        if (!next) choose(false);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">
            Cải thiện bài học của bạn
            <span className="block text-sm font-normal text-muted-foreground">
              Improve your lessons
            </span>
          </DialogTitle>
          <DialogDescription className="space-y-2 pt-2 text-base text-foreground">
            <span className="block">
              MercyBlade lưu bài tập hội thoại của bạn để cá nhân hóa việc học.
              Dữ liệu của bạn không bao giờ được chia sẻ.
            </span>
            <span className="block text-sm text-muted-foreground">
              MercyBlade saves your conversation practice to personalize your
              learning. Your data is never shared.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex gap-2">
          <Button className="flex-1" onClick={() => choose(true)}>
            Đồng ý
            <span className="ml-1 opacity-80">/ OK</span>
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => choose(false)}>
            Không, cảm ơn
            <span className="ml-1 opacity-80">/ No thanks</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConsentModal;
