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
    </div>
  );
};

export default Transactions;