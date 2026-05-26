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
  onOpenChange: (open: boolean) => void;
  onKeepGoing: () => void;
  onAbandon: () => void;
  busy?: boolean;
};

export function AbandonConfirmModal({
  open,
  onOpenChange,
  onKeepGoing,
  onAbandon,
  busy = false,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Leave this placement test?
            <span className="mt-1 block text-sm font-medium text-slate-400">
              Rời khỏi bài đánh giá này?
            </span>
          </DialogTitle>
          <DialogDescription>
            Your answers in this session will be discarded. You can start again
            when you are ready.
            <span className="mt-2 block text-slate-400">
              Các câu trả lời trong phiên này sẽ không được lưu. Bạn có thể làm
              lại khi sẵn sàng.
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button type="button" onClick={onKeepGoing} className="rounded-full" disabled={busy} autoFocus>
            Keep testing · Tiếp tục
          </Button>
          <Button type="button" variant="outline" onClick={onAbandon} className="rounded-full" disabled={busy}>
            Leave · Rời khỏi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AbandonConfirmModal;
