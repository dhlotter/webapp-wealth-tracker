import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Types
type Category = {
  id: string;
  name: string;
  budgetedAmount: number;
  spentAmount: number;
  monthlySpending: {
    month: string;
    amount: number;
  }[];
};

type SpendingGroup = {
  id: string;
  name: string;
  totalBudget: number;
  totalSpent: number;
  categories: Category[];
};

// Mock data
const mockSpendingGroups: SpendingGroup[] = [
  {
    id: "1",
    name: "Housing",
    totalBudget: 10000,
    totalSpent: 3898,
    categories: [
      {
        id: "1-1",
        name: "Rent",
        budgetedAmount: 8000,
        spentAmount: 3000,
        monthlySpending: [
          { month: "2023-12", amount: 3000 },
          { month: "2023-11", amount: 3000 },
          { month: "2023-10", amount: 3000 },
          { month: "2023-09", amount: 3000 },
          { month: "2023-08", amount: 3000 },
          { month: "2023-07", amount: 3000 },
        ],
      },
      {
        id: "1-2",
        name: "Utilities",
        budgetedAmount: 2000,
        spentAmount: 898,
        monthlySpending: [
          { month: "2023-12", amount: 898 },
          { month: "2023-11", amount: 905 },
          { month: "2023-10", amount: 867 },
          { month: "2023-09", amount: 912 },
          { month: "2023-08", amount: 889 },
          { month: "2023-07", amount: 901 },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Transportation",
    totalBudget: 5000,
    totalSpent: 2150,
    categories: [
      {
        id: "2-1",
        name: "Car Payment",
        budgetedAmount: 3500,
        spentAmount: 1500,
        monthlySpending: [
          { month: "2023-12", amount: 1500 },
          { month: "2023-11", amount: 1500 },
          { month: "2023-10", amount: 1500 },
          { month: "2023-09", amount: 1500 },
          { month: "2023-08", amount: 1500 },
          { month: "2023-07", amount: 1500 },
        ],
      },
      {
        id: "2-2",
        name: "Gas",
        budgetedAmount: 1500,
        spentAmount: 650,
        monthlySpending: [
          { month: "2023-12", amount: 650 },
          { month: "2023-11", amount: 675 },
          { month: "2023-10", amount: 620 },
          { month: "2023-09", amount: 645 },
          { month: "2023-08", amount: 635 },
          { month: "2023-07", amount: 660 },
        ],
      },
    ],
  },
];

const Budget = () => {
  const [spendingGroups, setSpendingGroups] = useState<SpendingGroup[]>(mockSpendingGroups);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [newBudgetAmount, setNewBudgetAmount] = useState<string>("");
  const [isUpdatePromptOpen, setIsUpdatePromptOpen] = useState(false);

  const calculateAverageSpend = (monthlySpending: { month: string; amount: number }[]) => {
    const total = monthlySpending.reduce((sum, month) => sum + month.amount, 0);
    return total / monthlySpending.length;
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setNewBudgetAmount(category.budgetedAmount.toString());
    setIsEditSheetOpen(true);
  };

  const handleBudgetUpdate = (updateFuture: boolean) => {
    if (selectedCategory && newBudgetAmount) {
      const amount = parseFloat(newBudgetAmount);
      
      setSpendingGroups(prevGroups => 
        prevGroups.map(group => ({
          ...group,
          categories: group.categories.map(category => 
            category.id === selectedCategory.id 
              ? { ...category, budgetedAmount: amount }
              : category
          ),
          totalBudget: group.categories.reduce((sum, cat) => 
            cat.id === selectedCategory.id ? sum - selectedCategory.budgetedAmount + amount : sum + cat.budgetedAmount, 0
          ),
        }))
      );
      
      setIsUpdatePromptOpen(false);
      setIsEditSheetOpen(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Budget</h1>

      <Accordion type="single" collapsible className="space-y-4">
        {spendingGroups.map((group) => (
          <AccordionItem key={group.id} value={group.id} className="border rounded-lg p-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">{group.name}</h2>
                  <span className="text-sm text-muted-foreground">
                    ${group.totalSpent.toLocaleString()} of ${group.totalBudget.toLocaleString()}
                  </span>
                </div>
                <Progress value={(group.totalSpent / group.totalBudget) * 100} className="h-2" />
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
                    <TableHead className="text-right">Average (6mo)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.categories
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((category) => (
                      <TableRow
                        key={category.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleCategoryClick(category)}
                      >
                        <TableCell>{category.name}</TableCell>
                        <TableCell className="text-right">
                          ${category.budgetedAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ${category.spentAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ${(category.budgetedAmount - category.spentAmount).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ${calculateAverageSpend(category.monthlySpending).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent side="right">
          {selectedCategory && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedCategory.name}</SheetTitle>
                <SheetDescription>
                  View spending history and update budget
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="budgetAmount">Budget Amount</Label>
                  <Input
                    id="budgetAmount"
                    type="number"
                    value={newBudgetAmount}
                    onChange={(e) => setNewBudgetAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Monthly Spending History</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={selectedCategory.monthlySpending}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <Button 
                  onClick={() => setIsUpdatePromptOpen(true)} 
                  className="w-full"
                  disabled={!newBudgetAmount || parseFloat(newBudgetAmount) === selectedCategory.budgetedAmount}
                >
                  Update Budget
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={isUpdatePromptOpen} onOpenChange={setIsUpdatePromptOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Budget</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to apply this budget update to future months as well?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleBudgetUpdate(false)}>
              This Month Only
            </AlertDialogAction>
            <AlertDialogAction onClick={() => handleBudgetUpdate(true)}>
              All Future Months
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Budget;
