import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Transaction = {
  id: string;
  date: string;
  merchant: string;
  description: string;
  category: string;
  amount: number;
  account: string;
  note: string;
  originalDate?: string;
  seen: boolean;
};

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2024-03-20",
    merchant: "Walmart",
    description: "Groceries",
    category: "Food",
    amount: 150.50,
    account: "Main Checking",
    note: "",
    seen: false,
  },
  {
    id: "2",
    date: "2024-03-19",
    merchant: "Amazon",
    description: "Electronics",
    category: "Shopping",
    amount: 299.99,
    account: "Credit Card",
    note: "New headphones",
    seen: true,
  },
];

type SortConfig = {
  key: keyof Transaction | null;
  direction: "asc" | "desc";
};

type FilterType = "unseen" | "current-month" | "all";

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Transaction>>({});

  const handleSort = (key: keyof Transaction) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));

    const sortedTransactions = [...transactions].sort((a, b) => {
      if (sortConfig.direction === "asc") {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });

    setTransactions(sortedTransactions);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    switch (filter) {
      case "unseen":
        return !transaction.seen;
      case "current-month": {
        const currentMonth = new Date().getMonth();
        const transactionMonth = new Date(transaction.date).getMonth();
        return currentMonth === transactionMonth;
      }
      default:
        return true;
    }
  });

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditForm(transaction);
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    if (!selectedTransaction || !editForm) return;

    const updatedTransaction = {
      ...selectedTransaction,
      ...editForm,
      originalDate: selectedTransaction.originalDate || selectedTransaction.date,
    };

    setTransactions(transactions.map(t => 
      t.id === selectedTransaction.id ? updatedTransaction : t
    ));

    setIsDrawerOpen(false);
    toast.success("Transaction updated successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <Select value={filter} onValueChange={(value) => setFilter(value as FilterType)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter transactions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unseen">Unseen</SelectItem>
            <SelectItem value="current-month">Current Month</SelectItem>
            <SelectItem value="all">All Transactions</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("date")}
            >
              Date
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("merchant")}
            >
              Merchant
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("description")}
            >
              Description
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("category")}
            >
              Category
            </TableHead>
            <TableHead
              className="cursor-pointer text-right"
              onClick={() => handleSort("amount")}
            >
              Amount
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("account")}
            >
              Account
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("note")}
            >
              Note
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.map((transaction) => (
            <TableRow
              key={transaction.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleRowClick(transaction)}
            >
              <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
              <TableCell>{transaction.merchant}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell className="text-right">
                ${transaction.amount.toLocaleString()}
              </TableCell>
              <TableCell>{transaction.account}</TableCell>
              <TableCell>{transaction.note}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-4xl">
            <DrawerHeader>
              <DrawerTitle className="text-2xl font-bold">
                Edit Transaction
              </DrawerTitle>
              <DrawerDescription>
                Make changes to your transaction here
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={editForm.date || ""}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="merchant">Merchant</Label>
                  <Input
                    id="merchant"
                    value={editForm.merchant || ""}
                    onChange={(e) => setEditForm({ ...editForm, merchant: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={editForm.description || ""}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={editForm.category || ""}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={editForm.amount || ""}
                    onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account">Account</Label>
                  <Input
                    id="account"
                    value={editForm.account || ""}
                    onChange={(e) => setEditForm({ ...editForm, account: e.target.value })}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="note">Note</Label>
                  <Input
                    id="note"
                    value={editForm.note || ""}
                    onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Transactions;