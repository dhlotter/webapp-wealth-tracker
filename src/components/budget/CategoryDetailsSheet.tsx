import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/transactions";
import { TransactionEdit } from "../transactions/TransactionEdit";
import { toast } from "sonner";
import { BudgetChart } from "./BudgetChart";
import { BudgetForm } from "./BudgetForm";
import { TransactionsList } from "./TransactionsList";
import { BudgetDialog } from "./BudgetDialog";

interface CategoryDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  category: {
    id: string;
    name: string;
    budgeted_amount: number;
  };
  selectedMonth: Date;
  averageMonths: number;
}

export const CategoryDetailsSheet = ({ 
  isOpen, 
  onClose, 
  category,
  selectedMonth,
  averageMonths,
}: CategoryDetailsSheetProps) => {
  const [budgetedAmount, setBudgetedAmount] = useState(category.budgeted_amount.toString());
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isTransactionEditOpen, setIsTransactionEditOpen] = useState(false);
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: chartData } = useQuery({
    queryKey: ["category-history", category.id, averageMonths],
    queryFn: async () => {
      const startDate = subMonths(startOfMonth(selectedMonth), averageMonths - 1);
      const { data: transactions, error } = await supabase
        .from("transactions")
        .select("amount, date")
        .eq("category", category.name)
        .gte("date", startDate.toISOString())
        .lte("date", endOfMonth(selectedMonth).toISOString());

      if (error) throw error;

      const monthlyTotals = Array.from({ length: averageMonths }, (_, i) => {
        const month = subMonths(selectedMonth, i);
        const monthTransactions = transactions?.filter(tx => 
          new Date(tx.date).getMonth() === month.getMonth() &&
          new Date(tx.date).getFullYear() === month.getFullYear()
        ) || [];
        
        return {
          month: format(month, "MMM yy"),
          total: monthTransactions.reduce((sum, tx) => sum + tx.amount, 0)
        };
      }).reverse();

      return monthlyTotals;
    }
  });

  const { data: transactions } = useQuery({
    queryKey: ["category-transactions", category.id, selectedMonth],
    queryFn: async () => {
      const startDate = subMonths(startOfMonth(selectedMonth), averageMonths - 1);
      const { data, error } = await supabase
        .from("transactions")
        .select("*, accounts(name, currency)")
        .eq("category", category.name)
        .gte("date", startDate.toISOString())
        .lte("date", endOfMonth(selectedMonth).toISOString())
        .order("date", { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    }
  });

  const updateCurrentMonthBudget = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const amount = Number(budgetedAmount);
      if (isNaN(amount)) throw new Error("Invalid amount");

      const { error } = await supabase
        .from("monthly_budgets")
        .upsert({
          user_id: user.id,
          category_id: category.id,
          month: startOfMonth(selectedMonth).toISOString(),
          budgeted_amount: amount,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-categories"] });
      toast.success("Budget updated for current month");
      setShowBudgetDialog(false);
      onClose();
    },
    onError: (error) => {
      console.error("Error updating budget:", error);
      toast.error("Failed to update budget");
      setShowBudgetDialog(false);
    }
  });

  const updateFutureMonthsBudget = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const amount = Number(budgetedAmount);
      if (isNaN(amount)) throw new Error("Invalid amount");

      // Update the budget category
      const { error: categoryError } = await supabase
        .from("budget_categories")
        .update({ budgeted_amount: amount })
        .eq("id", category.id);

      if (categoryError) throw categoryError;

      // Also update the current month's budget
      const { error: currentMonthError } = await supabase
        .from("monthly_budgets")
        .upsert({
          user_id: user.id,
          category_id: category.id,
          month: startOfMonth(selectedMonth).toISOString(),
          budgeted_amount: amount,
        });

      if (currentMonthError) throw currentMonthError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-categories"] });
      toast.success("Budget updated for current and future months");
      setShowBudgetDialog(false);
      onClose();
    },
    onError: (error) => {
      console.error("Error updating budget:", error);
      toast.error("Failed to update budget");
      setShowBudgetDialog(false);
    }
  });

  const groupedTransactions = transactions?.reduce((groups: { [key: string]: Transaction[] }, transaction) => {
    const month = format(new Date(transaction.date), "MMMM yyyy");
    if (!groups[month]) {
      groups[month] = [];
    }
    groups[month].push(transaction);
    return groups;
  }, {}) || {};

  const handleSaveBudget = () => {
    const amount = Number(budgetedAmount);
    if (isNaN(amount)) {
      toast.error("Please enter a valid number");
      return;
    }
    setShowBudgetDialog(true);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-[400px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{category.name}</SheetTitle>
          </SheetHeader>

          <div className="space-y-6 py-6">
            {chartData && <BudgetChart chartData={chartData} />}

            <BudgetForm
              budgetedAmount={budgetedAmount}
              onBudgetChange={setBudgetedAmount}
              onSave={handleSaveBudget}
              isLoading={updateCurrentMonthBudget.isPending || updateFutureMonthsBudget.isPending}
            />

            <TransactionsList
              groupedTransactions={groupedTransactions}
              onTransactionClick={(transaction) => {
                setSelectedTransaction(transaction);
                setIsTransactionEditOpen(true);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>

      {selectedTransaction && (
        <Sheet open={isTransactionEditOpen} onOpenChange={setIsTransactionEditOpen}>
          <SheetContent side="right" className="w-[400px] !p-0 flex flex-col">
            <SheetHeader className="p-[2mm]">
              <SheetTitle>Edit Transaction</SheetTitle>
            </SheetHeader>
            <TransactionEdit
              transaction={selectedTransaction}
              onClose={() => setIsTransactionEditOpen(false)}
            />
          </SheetContent>
        </Sheet>
      )}

      <BudgetDialog
        isOpen={showBudgetDialog}
        onClose={() => setShowBudgetDialog(false)}
        onUpdateCurrentMonth={() => updateCurrentMonthBudget.mutate()}
        onUpdateFutureMonths={() => updateFutureMonthsBudget.mutate()}
        isLoading={updateCurrentMonthBudget.isPending || updateFutureMonthsBudget.isPending}
      />
    </>
  );
};