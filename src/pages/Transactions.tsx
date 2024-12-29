import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, SlidersHorizontal, X } from "lucide-react";

// Types
type Transaction = {
  id: string;
  date: Date;
  merchant: string;
  description: string;
  spendingGroup: string;
  category: string;
  amount: number;
  account: string;
  notes: string;
  seen: boolean;
};

type QuickFilter = "all" | "current" | "unseen";

type AdvancedFilter = {
  merchant: string;
  description: string;
  spendingGroup: string | null;
  category: string | null;
  minAmount: string;
  maxAmount: string;
  account: string | null;
  notes: string;
};

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: new Date("2024-12-28"),
    merchant: "Grocery Store",
    description: "Weekly groceries",
    spendingGroup: "day to day",
    category: "Groceries",
    amount: 150.50,
    account: "Main Account",
    notes: "",
    seen: false,
  },
  {
    id: "2",
    date: new Date("2024-12-15"),
    merchant: "Shell",
    description: "Gas",
    spendingGroup: "Transportation",
    category: "Gas",
    amount: 45.50,
    account: "Credit Card",
    notes: "",
    seen: true,
  },
  {
    id: "3",
    date: new Date("2024-12-10"),
    merchant: "Amazon",
    description: "Books",
    spendingGroup: "Entertainment",
    category: "Books",
    amount: 25.00,
    account: "Main Account",
    notes: "",
    seen: true,
  },
  {
    id: "4",
    date: new Date("2024-12-05"),
    merchant: "Walmart",
    description: "Groceries",
    spendingGroup: "Food",
    category: "Groceries",
    amount: 120.00,
    account: "Main Checking",
    notes: "",
    seen: false,
  },
  {
    id: "5",
    date: new Date("2024-12-01"),
    merchant: "Target",
    description: "Clothes",
    spendingGroup: "Clothing",
    category: "Apparel",
    amount: 60.00,
    account: "Main Account",
    notes: "",
    seen: false,
  },
  {
    id: "6",
    date: new Date("2024-11-30"),
    merchant: "Best Buy",
    description: "Electronics",
    spendingGroup: "Electronics",
    category: "Gadgets",
    amount: 200.00,
    account: "Main Account",
    notes: "",
    seen: true,
  },
  {
    id: "7",
    date: new Date("2024-11-25"),
    merchant: "Starbucks",
    description: "Coffee",
    spendingGroup: "Dining",
    category: "Beverages",
    amount: 10.00,
    account: "Main Account",
    notes: "",
    seen: false,
  },
  {
    id: "8",
    date: new Date("2024-11-20"),
    merchant: "Netflix",
    description: "Subscription",
    spendingGroup: "Entertainment",
    category: "Subscriptions",
    amount: 15.00,
    account: "Main Account",
    notes: "",
    seen: true,
  }
];

const mockSpendingGroups = ["day to day", "recurring", "invest-save-repay", "income", "transfers"];
const mockCategories = ["Groceries", "Utilities", "Entertainment", "Transport"];

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilter>({
    merchant: "",
    description: "",
    spendingGroup: null,
    category: null,
    minAmount: "",
    maxAmount: "",
    account: null,
    notes: "",
  });

  // Sort transactions by date desc by default
  useEffect(() => {
    const sortedTransactions = [...transactions].sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
    setTransactions(sortedTransactions);
  }, []);

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditSheetOpen(true);
    
    // Mark transaction as seen when opened
    if (!transaction.seen) {
      setTransactions(prevTransactions =>
        prevTransactions.map(t =>
          t.id === transaction.id ? { ...t, seen: true } : t
        )
      );
    }
  };

  const handleSaveTransaction = () => {
    if (selectedTransaction) {
      setTransactions(prev =>
        prev.map(t =>
          t.id === selectedTransaction.id ? selectedTransaction : t
        )
      );
      setIsEditSheetOpen(false);
    }
  };

  const clearFilters = () => {
    setQuickFilter("all");
    setSearchQuery("");
    setAdvancedFilters({
      merchant: "",
      description: "",
      spendingGroup: null,
      category: null,
      minAmount: "",
      maxAmount: "",
      account: null,
      notes: "",
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    // Quick filters
    if (quickFilter === "current") {
      const now = new Date();
      if (transaction.date.getMonth() !== now.getMonth() || 
          transaction.date.getFullYear() !== now.getFullYear()) {
        return false;
      }
    } else if (quickFilter === "unseen" && transaction.seen) {
      return false;
    }

    // Search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        transaction.merchant.toLowerCase().includes(searchLower) ||
        transaction.description.toLowerCase().includes(searchLower) ||
        transaction.spendingGroup.toLowerCase().includes(searchLower) ||
        transaction.category.toLowerCase().includes(searchLower) ||
        transaction.amount.toString().includes(searchLower) ||
        transaction.notes.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Advanced filters
    if (advancedFilters.merchant && !transaction.merchant.toLowerCase().includes(advancedFilters.merchant.toLowerCase())) return false;
    if (advancedFilters.description && !transaction.description.toLowerCase().includes(advancedFilters.description.toLowerCase())) return false;
    if (advancedFilters.spendingGroup && transaction.spendingGroup !== advancedFilters.spendingGroup) return false;
    if (advancedFilters.category && transaction.category !== advancedFilters.category) return false;
    if (advancedFilters.minAmount && transaction.amount < parseFloat(advancedFilters.minAmount)) return false;
    if (advancedFilters.maxAmount && transaction.amount > parseFloat(advancedFilters.maxAmount)) return false;
    if (advancedFilters.account && transaction.account !== advancedFilters.account) return false;
    if (advancedFilters.notes && !transaction.notes.toLowerCase().includes(advancedFilters.notes.toLowerCase())) return false;

    return true;
  });

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Transactions</h1>

      {/* Quick Filters and Search */}
      <div className="flex items-center space-x-4">
        <div className="flex space-x-2">
          <Button
            variant={quickFilter === "all" ? "default" : "outline"}
            onClick={() => setQuickFilter("all")}
          >
            All
          </Button>
          <Button
            variant={quickFilter === "current" ? "default" : "outline"}
            onClick={() => setQuickFilter("current")}
          >
            Current Budget
          </Button>
          <Button
            variant={quickFilter === "unseen" ? "default" : "outline"}
            onClick={() => setQuickFilter("unseen")}
          >
            Unseen
          </Button>
        </div>

        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <Button
          variant="outline"
          onClick={clearFilters}
          disabled={quickFilter === "all" && !searchQuery && !Object.values(advancedFilters).some(v => v)}
        >
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>

        <Button
          variant="outline"
          onClick={() => setIsAdvancedSearchOpen(true)}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Advanced Search
        </Button>
      </div>

      {/* Transactions Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Spending Group + Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.map((transaction) => (
            <TableRow
              key={transaction.id}
              className={`cursor-pointer hover:bg-muted/50 ${
                !transaction.seen ? "font-bold" : ""
              }`}
              onClick={() => handleTransactionClick(transaction)}
            >
              <TableCell>{transaction.date.toLocaleDateString()}</TableCell>
              <TableCell>{transaction.merchant}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{`${transaction.spendingGroup} - ${transaction.category}`}</TableCell>
              <TableCell className="text-right">${transaction.amount.toLocaleString()}</TableCell>
              <TableCell>{transaction.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Sheet */}
      <div className="sheet-container" style={{ paddingRight: '0', marginRight: '0' }}>
        <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
          <SheetContent side="right" className="w-[400px] !p-0 flex flex-col">
            <ScrollArea className="flex-1">
              <div className="p-[2mm]">
                <SheetHeader>
                  <SheetTitle>Edit Transaction</SheetTitle>
                  <SheetDescription>
                    Make changes to the transaction details below
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Transaction Date</Label>
                    <Input
                      type="text"
                      value={selectedTransaction?.date.toLocaleDateString()}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input
                      type="text"
                      value={`$${selectedTransaction?.amount.toLocaleString()}`}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Account</Label>
                    <Input
                      type="text"
                      value={selectedTransaction?.account}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Merchant</Label>
                    <Input
                      value={selectedTransaction?.merchant}
                      onChange={(e) =>
                        setSelectedTransaction({
                          ...selectedTransaction,
                          merchant: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={selectedTransaction?.description}
                      onChange={(e) =>
                        setSelectedTransaction({
                          ...selectedTransaction,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Spending Group</Label>
                    <Select
                      value={selectedTransaction?.spendingGroup}
                      onValueChange={(value) =>
                        setSelectedTransaction({
                          ...selectedTransaction,
                          spendingGroup: value,
                          category: "", // Reset category when spending group changes
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select spending group" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockSpendingGroups.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={selectedTransaction?.category}
                      onValueChange={(value) =>
                        setSelectedTransaction({
                          ...selectedTransaction,
                          category: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Input
                      value={selectedTransaction?.notes}
                      onChange={(e) =>
                        setSelectedTransaction({
                          ...selectedTransaction,
                          notes: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="mt-auto border-t">
              <div className="p-[2mm] flex justify-center gap-2">
                <Button variant="outline" onClick={() => setIsEditSheetOpen(false)} className="flex-1">Cancel</Button>
                <Button onClick={handleSaveTransaction} className="flex-1">Save</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Advanced Search Sheet */}
      <div className="sheet-container" style={{ paddingRight: '0', marginRight: '0' }}>
        <Sheet open={isAdvancedSearchOpen} onOpenChange={setIsAdvancedSearchOpen}>
          <SheetContent side="right" className="w-[400px] !p-0 flex flex-col">
            <ScrollArea className="flex-1">
              <div className="p-[2mm]">
                <SheetHeader>
                  <SheetTitle>Advanced Search</SheetTitle>
                  <SheetDescription>
                    Filter transactions using multiple criteria
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Merchant</Label>
                    <Input
                      value={advancedFilters.merchant}
                      onChange={(e) =>
                        setAdvancedFilters((prev) => ({
                          ...prev,
                          merchant: e.target.value,
                        }))
                      }
                      placeholder="Filter by merchant"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={advancedFilters.description}
                      onChange={(e) =>
                        setAdvancedFilters((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Filter by description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount Range</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        value={advancedFilters.minAmount}
                        onChange={(e) =>
                          setAdvancedFilters((prev) => ({
                            ...prev,
                            minAmount: e.target.value,
                          }))
                        }
                        placeholder="Min"
                      />
                      <Input
                        type="number"
                        value={advancedFilters.maxAmount}
                        onChange={(e) =>
                          setAdvancedFilters((prev) => ({
                            ...prev,
                            maxAmount: e.target.value,
                          }))
                        }
                        placeholder="Max"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Spending Group</Label>
                    <Select
                      value={advancedFilters.spendingGroup || undefined}
                      onValueChange={(value) =>
                        setAdvancedFilters((prev) => ({
                          ...prev,
                          spendingGroup: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All spending groups" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Groups</SelectItem>
                        {mockSpendingGroups.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={advancedFilters.category || undefined}
                      onValueChange={(value) =>
                        setAdvancedFilters((prev) => ({
                          ...prev,
                          category: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {mockCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Input
                      value={advancedFilters.notes}
                      onChange={(e) =>
                        setAdvancedFilters((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder="Filter by notes"
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="mt-auto border-t">
              <div className="p-[2mm] flex justify-center gap-2">
                <Button variant="outline" onClick={() => {
                  setAdvancedFilters({
                    merchant: "",
                    description: "",
                    spendingGroup: null,
                    category: null,
                    minAmount: "",
                    maxAmount: "",
                    account: null,
                    notes: "",
                  });
                  setIsAdvancedSearchOpen(false);
                }} className="flex-1">Clear & Close</Button>
                <Button onClick={() => setIsAdvancedSearchOpen(false)} className="flex-1">
                  Apply Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Transactions;