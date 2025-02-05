import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { Transaction } from "@/types/transactions";
import { TransactionEdit } from "../transactions/TransactionEdit";
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
import { toast } from "sonner";

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

  // Update budgeted amount mutation for current month
  const updateCurrentMonthBudget = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("monthly_budgets")
        .upsert({
          user_id: user.id,
          category_id: category.id,
          month: startOfMonth(selectedMonth).toISOString(),
          budgeted_amount: Number(budgetedAmount),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-categories"] });
      toast.success("Budget updated for current month");
      setShowBudgetDialog(false);
      setBudgetedAmount(budgetedAmount); // Update local state
    },
    onError: (error) => {
      console.error("Error updating budget:", error);
      toast.error("Failed to update budget");
      setShowBudgetDialog(false);
    }
  });

  // Update budgeted amount mutation for future months
  const updateFutureMonthsBudget = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Update budget_categories table for future reference
      const { error: categoryError } = await supabase
        .from("budget_categories")
        .update({ budgeted_amount: Number(budgetedAmount) })
        .eq("id", category.id);

      if (categoryError) throw categoryError;

      // Update current month's budget
      const { error: currentMonthError } = await supabase
        .from("monthly_budgets")
        .upsert({
          user_id: user.id,
          category_id: category.id,
          month: startOfMonth(selectedMonth).toISOString(),
          budgeted_amount: Number(budgetedAmount),
        });

      if (currentMonthError) throw currentMonthError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-categories"] });
      toast.success("Budget updated for current and future months");
      setShowBudgetDialog(false);
      setBudgetedAmount(budgetedAmount); // Update local state
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
    if (isNaN(Number(budgetedAmount))) {
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
            <div className="h-[200px] w-full">
              <BarChart width={350} height={200} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#3b82f6" />
              </BarChart>
            </div>

            {/* Budget Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Budgeted Amount</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={budgetedAmount}
                  onChange={(e) => setBudgetedAmount(e.target.value)}
                />
                <Button onClick={handleSaveBudget}>Save</Button>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(groupedTransactions).map(([month, monthTransactions]) => (
                <div key={month}>
                  <Separator className="my-2" />
                  <h3 className="font-semibold mb-2">{month}</h3>
                  <div className="space-y-2">
                    {monthTransactions.map((transaction) => (
                      <div 
                        key={transaction.id} 
                        className="flex justify-between items-center cursor-pointer hover:bg-muted/50 p-2 rounded-md"
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setIsTransactionEditOpen(true);
                        }}
                      >
                        <div>
                          <div className="font-medium">{transaction.merchant}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(transaction.date), "d MMM yyyy")}
                          </div>
                        </div>
                        <div className="font-medium">
                          {formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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

      <AlertDialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Budget Amount</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to apply this budget amount to future months as well?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => updateCurrentMonthBudget.mutate()}>
              Current Month Only
            </AlertDialogAction>
            <AlertDialogAction onClick={() => updateFutureMonthsBudget.mutate()}>
              Apply to Future Months
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
