import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth } from "date-fns";

interface BudgetCategory {
  id: string;
  name: string;
  spending_group: string;
  budgeted_amount: number;
  spent_amount: number;
  average_spend: number;
}

export const useBudgetCategories = (month: Date, averageMonths: number = 3) => {
  const startDate = startOfMonth(month);
  const endDate = endOfMonth(month);

  return useQuery({
    queryKey: ["budget-categories", month.toISOString()],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Get all budget categories
      const { data: categories, error: categoriesError } = await supabase
        .from("budget_categories")
        .select("*")
        .eq("user_id", user.id);

      if (categoriesError) throw categoriesError;

      // Get monthly budgets for the selected month
      const { data: monthlyBudgets, error: budgetsError } = await supabase
        .from("monthly_budgets")
        .select("*")
        .eq("user_id", user.id)
        .eq("month", startDate.toISOString().split('T')[0]);

      if (budgetsError) throw budgetsError;

      // Get transactions for the current month
      const { data: transactions, error: transactionsError } = await supabase
        .from("transactions")
        .select("category, amount")
        .eq("user_id", user.id)
        .gte("date", startDate.toISOString())
        .lte("date", endDate.toISOString());

      if (transactionsError) throw transactionsError;

      // Get transactions for average calculation
      const averageStartDate = startOfMonth(new Date(startDate));
      averageStartDate.setMonth(averageStartDate.getMonth() - averageMonths);

      const { data: historicalTransactions, error: historicalError } = await supabase
        .from("transactions")
        .select("category, amount, date")
        .eq("user_id", user.id)
        .gte("date", averageStartDate.toISOString())
        .lt("date", startDate.toISOString());

      if (historicalError) throw historicalError;

      // Calculate spent amounts
      const spentAmounts = transactions.reduce((acc: { [key: string]: number }, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
      }, {});

      // Calculate averages
      const averages = historicalTransactions.reduce((acc: { [key: string]: { total: number, months: Set<string> } }, tx) => {
        if (!acc[tx.category]) {
          acc[tx.category] = { total: 0, months: new Set() };
        }
        acc[tx.category].total += tx.amount;
        acc[tx.category].months.add(new Date(tx.date).toISOString().substring(0, 7));
        return acc;
      }, {});

      return categories.map((category) => ({
        ...category,
        budgeted_amount: monthlyBudgets?.find(b => b.category_id === category.id)?.budgeted_amount || 0,
        spent_amount: spentAmounts[category.name] || 0,
        average_spend: averages[category.name] 
          ? averages[category.name].total / averages[category.name].months.size 
          : 0
      }));
    },
  });
};