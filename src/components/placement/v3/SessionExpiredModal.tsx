import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onStartNew: () => void;
};

export function SessionExpiredModal({ open, onStartNew }: Props) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            This session expired
            <span className="mt-1 block text-sm font-medium text-slate-500">
              Phiên đánh giá đã hết hạn
            </span>
          </DialogTitle>
          <DialogDescription>
            Start a fresh placement test so your level is based on one complete
            attempt.
            <span className="mt-2 block text-slate-500">
              Hãy bắt đầu bài mới để kết quả dựa trên một lần làm hoàn chỉnh.
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" onClick={onStartNew} className="w-full rounded-full" autoFocus>
            Start new test · Bắt đầu bài mới
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SessionExpiredModal;
