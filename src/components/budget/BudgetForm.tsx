import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BudgetFormProps {
  budgetedAmount: string;
  onBudgetChange: (value: string) => void;
  onSave: () => void;
  isLoading: boolean;
}

export const BudgetForm = ({ 
  budgetedAmount, 
  onBudgetChange, 
  onSave,
  isLoading 
}: BudgetFormProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Budgeted Amount</label>
      <div className="flex gap-2">
        <Input
          type="number"
          value={budgetedAmount}
          onChange={(e) => onBudgetChange(e.target.value)}
        />
        <Button 
          onClick={onSave}
          disabled={isLoading}
        >
          Save
        </Button>
      </div>
    </div>
  );
};