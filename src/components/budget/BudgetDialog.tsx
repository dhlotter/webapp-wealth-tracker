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
  onUpdateCurrentMonth: () => void;
  onUpdateFutureMonths: () => void;
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onUpdateCurrentMonth}
            disabled={isLoading}
          >
            Current Month Only
          </AlertDialogAction>
          <AlertDialogAction 
            onClick={onUpdateFutureMonths}
            disabled={isLoading}
          >
            Apply to Future Months
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};