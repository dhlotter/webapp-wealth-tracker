import React, { useState, useEffect } from "react";
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

  // Reset budgeted amount when category changes
  useEffect(() => {
    setBudgetedAmount(category.budgeted_amount.toString());
  }, [category.budgeted_amount]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return "Invalid date";
      }
      return format(date, "MMM yy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

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
        const monthTransactions = transactions?.filter(tx => {
          try {
            const txDate = new Date(tx.date);
            return txDate.getMonth() === month.getMonth() &&
                   txDate.getFullYear() === month.getFullYear();
          } catch (error) {
            console.error("Error parsing date:", error);
            return false;
          }
        }) || [];
        
        return {
          month: formatDate(month.toISOString()),
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

  const groupedTransactions = transactions?.reduce((groups: { [key: string]: Transaction[] }, transaction) => {
    try {
      const date = new Date(transaction.date);
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", transaction.date);
        return groups;
      }
      const month = format(date, "MMMM yyyy");
      if (!groups[month]) {
        groups[month] = [];
      }
      groups[month].push(transaction);
    } catch (error) {
      console.error("Error grouping transaction:", error);
    }
    return groups;
  }, {}) || {};

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
    },
    onError: (error) => {
      console.error("Error updating budget:", error);
      toast.error("Failed to update budget");
    }
  });

  const updateFutureMonthsBudget = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const amount = Number(budgetedAmount);
      if (isNaN(amount)) throw new Error("Invalid amount");

      const { error: categoryError } = await supabase
        .from("budget_categories")
        .update({ budgeted_amount: amount })
        .eq("id", category.id);

      if (categoryError) throw categoryError;

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
    },
    onError: (error) => {
      console.error("Error updating budget:", error);
      toast.error("Failed to update budget");
    }
  });

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
        onUpdateCurrentMonth={async () => {
          await updateCurrentMonthBudget.mutateAsync();
          setShowBudgetDialog(false);
          onClose();
        }}
        onUpdateFutureMonths={async () => {
          await updateFutureMonthsBudget.mutateAsync();
          setShowBudgetDialog(false);
          onClose();
        }}
        isLoading={updateCurrentMonthBudget.isPending || updateFutureMonthsBudget.isPending}
      />
    </>
  );
};
