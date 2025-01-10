import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { MonthSelector } from "@/components/budget/MonthSelector";
import { BudgetGroup } from "@/components/budget/BudgetGroup";
import { useBudgetCategories } from "@/hooks/useBudgetCategories";
import { useSettings } from "@/hooks/useSettings";
import { Accordion } from "@/components/ui/accordion";

const Budget = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const { data: settings } = useSettings();
  const { data: categories = [], isLoading } = useBudgetCategories(
    selectedMonth,
    settings?.average_months || 3
  );

  // Group categories by spending group
  const groupedCategories = categories.reduce((acc: { [key: string]: typeof categories }, category) => {
    if (!acc[category.spending_group]) {
      acc[category.spending_group] = [];
    }
    acc[category.spending_group].push(category);
    return acc;
  }, {});

  // Calculate totals for each spending group
  const groupTotals = Object.entries(groupedCategories).reduce((acc: { [key: string]: { budgeted: number, spent: number } }, [group, categories]) => {
    acc[group] = categories.reduce(
      (total, cat) => ({
        budgeted: total.budgeted + cat.budgeted_amount,
        spent: total.spent + cat.spent_amount,
      }),
      { budgeted: 0, spent: 0 }
    );
    return acc;
  }, {});

  if (isLoading) {
    return (
      <PageLayout title="Budget">
        <div className="flex items-center justify-center h-[200px]">
          Loading...
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Budget">
      <MonthSelector
        selectedMonth={selectedMonth}
        onChange={setSelectedMonth}
      />

      <Accordion type="multiple" className="space-y-4">
        {Object.entries(groupedCategories).map(([group, categories]) => (
          <BudgetGroup
            key={group}
            group={group}
            categories={categories}
            groupTotals={groupTotals[group]}
            averageMonths={settings?.average_months || 3}
          />
        ))}
      </Accordion>
    </PageLayout>
  );
};

export default Budget;