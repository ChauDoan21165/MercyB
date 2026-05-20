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
  onKeepTesting: () => void;
  onSkip: () => void;
};

export function SkipForNowModal({ open, onOpenChange, onKeepTesting, onSkip }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Skip placement test?
            <span className="mt-1 block text-sm font-medium text-slate-400">
              Bỏ qua bài đánh giá?
            </span>
          </DialogTitle>
          <DialogDescription>
            You can take it anytime from your Account page, and Mercy will
            recommend a starting lesson whenever you are ready.
            <span className="mt-2 block text-slate-400">
              Bạn có thể làm bất cứ lúc nào từ trang Tài khoản, và Mercy sẽ gợi
              ý bài học phù hợp khi bạn sẵn sàng.
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button type="button" onClick={onKeepTesting} className="rounded-full" autoFocus>
            Keep testing · Tiếp tục
          </Button>
          <Button type="button" variant="outline" onClick={onSkip} className="rounded-full">
            Yes, skip · Có, bỏ qua
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SkipForNowModal;
