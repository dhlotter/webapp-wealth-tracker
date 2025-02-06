import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BudgetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateCurrentMonth: () => Promise<void>;
  onUpdateFutureMonths: () => Promise<void>;
  isLoading: boolean;
}

export const BudgetDialog = ({
  isOpen,
  onClose,
  onUpdateCurrentMonth,
  onUpdateFutureMonths,
  isLoading
}: BudgetDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Save Budget Amount</AlertDialogTitle>
          <AlertDialogDescription>
            Would you like to apply this budget amount to future months as well?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={async () => {
              await onUpdateCurrentMonth();
              onClose();
            }}
            disabled={isLoading}
          >
            Current Month Only
          </AlertDialogAction>
          <AlertDialogAction 
            onClick={async () => {
              await onUpdateFutureMonths();
              onClose();
            }}
            disabled={isLoading}
          >
            Apply to Future Months
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};