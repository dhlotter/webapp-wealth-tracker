import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils/formatCurrency";

interface BudgetCategoryListProps {
  categories: any[];
  averageMonths: number;
  selectedMonth: Date;
}

export const BudgetCategoryList = ({ 
  categories,
  averageMonths,
  selectedMonth
}: BudgetCategoryListProps) => {
  if (categories.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No categories in this group for {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Budgeted</TableHead>
          <TableHead className="text-right">Spent</TableHead>
          <TableHead className="text-right">Remaining</TableHead>
          <TableHead className="text-right">Average ({averageMonths}mo)</TableHead>
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
  );
};