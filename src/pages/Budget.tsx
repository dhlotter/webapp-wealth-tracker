import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { MonthSelector } from "@/components/budget/MonthSelector";
import { useBudgetCategories } from "@/hooks/useBudgetCategories";
import { useSettings } from "@/hooks/useSettings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils/formatCurrency";

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

      <Accordion type="single" collapsible className="space-y-4">
        {Object.entries(groupedCategories).map(([group, categories]) => (
          <AccordionItem key={group} value={group} className="border rounded-lg p-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">{group}</h2>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(groupTotals[group].spent)} of {formatCurrency(groupTotals[group].budgeted)}
                  </span>
                </div>
                <Progress 
                  value={(groupTotals[group].spent / groupTotals[group].budgeted) * 100} 
                  className="h-2" 
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Budgeted</TableHead>
                    <TableHead className="text-right">Spent</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead className="text-right">Average ({settings?.average_months || 3}mo)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.name}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(category.budgeted_amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(category.spent_amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(category.budgeted_amount - category.spent_amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(category.average_spend)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </PageLayout>
  );
};

export default Budget;