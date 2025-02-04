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
  const queryClient = useQueryClient();

  // Fetch historical data for the chart
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
          total: monthlyTotals?.reduce((sum, tx) => sum + tx.amount, 0) || 0
        };
      }).reverse();

      return monthlyTotals;
    }
  });

  // Fetch transactions for the list
  const { data: transactions } = useQuery({
    queryKey: ["category-transactions", category.id, averageMonths],
    queryFn: async () => {
      const startDate = subMonths(startOfMonth(selectedMonth), averageMonths - 1);
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("category", category.name)
        .gte("date", startDate.toISOString())
        .lte("date", endOfMonth(selectedMonth).toISOString())
        .order("date", { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Update budgeted amount mutation
  const updateBudget = useMutation({
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
    }
  });

  // Group transactions by month
  const groupedTransactions = transactions?.reduce((groups: { [key: string]: any[] }, transaction) => {
    const month = format(new Date(transaction.date), "MMMM yyyy");
    if (!groups[month]) {
      groups[month] = [];
    }
    groups[month].push(transaction);
    return groups;
  }, {}) || {};

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{category.name}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Chart */}
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
              <Button onClick={() => updateBudget.mutate()}>Save</Button>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-4">
            {Object.entries(groupedTransactions).map(([month, monthTransactions]) => (
              <div key={month}>
                <Separator className="my-2" />
                <h3 className="font-semibold mb-2">{month}</h3>
                <div className="space-y-2">
                  {monthTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center">
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
  );
};