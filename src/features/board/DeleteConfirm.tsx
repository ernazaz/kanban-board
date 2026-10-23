import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/ui/dialog';

export function DeleteConfirm({ title, onConfirm }: { title: string; onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Delete card">
          <X className="size-3.5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent title="Delete this card?" description={`"${title}" will be removed. You can undo for 5 seconds.`}>
        <AlertDialogCancel asChild>
          <Button variant="outline">Cancel</Button>
        </AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
