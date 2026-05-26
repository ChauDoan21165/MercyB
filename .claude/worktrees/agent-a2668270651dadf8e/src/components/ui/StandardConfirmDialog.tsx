import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CONFIRMATION_MESSAGES } from '@/lib/constants/uiText';

interface StandardConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  lang?: 'en' | 'vi';
}

/**
 * Standardized Confirmation Dialog
 * Consistent confirmation UX across the entire app
 */
export function StandardConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  lang = 'en',
}: StandardConfirmDialogProps) {
  const messages = CONFIRMATION_MESSAGES[lang];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || messages.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || messages.body}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{messages.cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {messages.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
