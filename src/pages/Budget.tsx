import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { MonthSelector } from "@/components/budget/MonthSelector";
import { BudgetGroup } from "@/components/budget/BudgetGroup";
import { useBudgetCategories } from "@/hooks/useBudgetCategories";
import { useSettings } from "@/hooks/useSettings";
import { useSpendingGroups } from "@/hooks/useSpendingGroups";
import { Accordion } from "@/components/ui/accordion";

const Budget = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const { data: settings } = useSettings();
  const { data: spendingGroups = [], isLoading: groupsLoading } = useSpendingGroups();
  const { data: categories = [], isLoading: categoriesLoading } = useBudgetCategories(
    selectedMonth,
    settings?.average_months || 3
  );

  if (categoriesLoading || groupsLoading) {
    return (
      <PageLayout title="Budget">
        <div className="flex items-center justify-center h-[200px]">
          Loading...
        </div>
      </PageLayout>
    );
  }

  // Group categories by spending group
  const categoriesByGroup = spendingGroups.reduce((acc: { [key: string]: any[] }, group) => {
    acc[group.name] = categories.filter(cat => cat.spending_group === group.name);
    return acc;
  }, {});

  // Calculate totals for each spending group
  const groupTotals = spendingGroups.reduce((acc: { [key: string]: { budgeted: number, spent: number } }, group) => {
    const groupCategories = categoriesByGroup[group.name] || [];
    acc[group.name] = groupCategories.reduce(
      (total, cat) => ({
        budgeted: total.budgeted + cat.budgeted_amount,
        spent: total.spent + cat.spent_amount,
      }),
      { budgeted: 0, spent: 0 }
    );
    return acc;
  }, {});

  return (
    <PageLayout title="Budget">
      <MonthSelector
        selectedMonth={selectedMonth}
        onChange={setSelectedMonth}
      />

      <Accordion type="multiple" className="space-y-4">
        {spendingGroups.map((group) => (
          <BudgetGroup
            key={group.id}
            group={group.name}
            categories={categoriesByGroup[group.name] || []}
            groupTotals={groupTotals[group.name] || { budgeted: 0, spent: 0 }}
            averageMonths={settings?.average_months || 3}
            selectedMonth={selectedMonth}
          />
        ))}
      </Accordion>
    </PageLayout>
  );
};

export default Budget;