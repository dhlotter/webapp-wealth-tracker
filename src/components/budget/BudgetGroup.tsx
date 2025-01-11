import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { BudgetCategoryList } from "./BudgetCategoryList";

interface BudgetGroupProps {
  group: string;
  categories: any[];
  groupTotals: {
    budgeted: number;
    spent: number;
  };
  averageMonths: number;
  selectedMonth: Date;
}

export const BudgetGroup = ({ 
  group, 
  categories, 
  groupTotals, 
  averageMonths,
  selectedMonth
}: BudgetGroupProps) => {
  const progressValue = groupTotals.budgeted > 0 
    ? (groupTotals.spent / groupTotals.budgeted) * 100 
    : 0;

  return (
    <AccordionItem value={group} className="border rounded-lg p-4">
      <AccordionTrigger className="hover:no-underline">
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">{group}</h2>
            <span className="text-sm text-muted-foreground">
              {formatCurrency(groupTotals.spent)} of {formatCurrency(groupTotals.budgeted)}
            </span>
          </div>
          <Progress 
            value={progressValue} 
            className="h-2" 
          />
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4">
        <BudgetCategoryList 
          categories={categories}
          averageMonths={averageMonths}
          selectedMonth={selectedMonth}
        />
      </AccordionContent>
    </AccordionItem>
  );
};