import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { X, SlidersHorizontal } from "lucide-react";
import { QuickFilters } from "@/components/transactions/QuickFilters";
import { SearchBar } from "@/components/transactions/SearchBar";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { useTransactions } from "@/hooks/useTransactions";
import { Transaction, QuickFilter } from "@/types/transactions";
import { AdvancedSearch } from "@/components/transactions/AdvancedSearch";
import { TransactionEdit } from "@/components/transactions/TransactionEdit";

const Transactions = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: transactions = [], isLoading, error } = useTransactions();

  const filteredTransactions = transactions.filter(transaction => {
    // Quick filters
    if (quickFilter === "current") {
      const now = new Date();
      const transactionDate = new Date(transaction.date);
      if (transactionDate.getMonth() !== now.getMonth() || 
          transactionDate.getFullYear() !== now.getFullYear()) {
        return false;
      }
    } else if (quickFilter === "unseen" && transaction.seen) {
      return false;
    }

    // Search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        transaction.merchant.toLowerCase().includes(searchLower) ||
        transaction.description?.toLowerCase().includes(searchLower) ||
        transaction.spending_group.toLowerCase().includes(searchLower) ||
        transaction.category.toLowerCase().includes(searchLower) ||
        transaction.amount.toString().includes(searchLower) ||
        transaction.notes?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-[200px]">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[200px] text-destructive">
        Error: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Transactions</h1>

      <div className="flex items-center space-x-4">
        <QuickFilters quickFilter={quickFilter} setQuickFilter={setQuickFilter} />
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <Button
          variant="outline"
          onClick={() => {
            setQuickFilter("all");
            setSearchQuery("");
          }}
          disabled={quickFilter === "all" && !searchQuery}
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

      <TransactionsTable
        transactions={filteredTransactions}
        onTransactionClick={(transaction) => {
          setSelectedTransaction(transaction);
          setIsEditSheetOpen(true);
        }}
      />

      {selectedTransaction && (
        <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
          <SheetContent side="right" className="w-[400px] !p-0 flex flex-col">
            <SheetHeader className="p-[2mm]">
              <SheetTitle>Edit Transaction</SheetTitle>
              <SheetDescription>
                Make changes to the transaction details
              </SheetDescription>
            </SheetHeader>
            <TransactionEdit
              transaction={selectedTransaction}
              onClose={() => setIsEditSheetOpen(false)}
            />
          </SheetContent>
        </Sheet>
      )}

      <Sheet open={isAdvancedSearchOpen} onOpenChange={setIsAdvancedSearchOpen}>
        <SheetContent side="right" className="w-[400px] !p-0 flex flex-col">
          <SheetHeader className="p-[2mm]">
            <SheetTitle>Advanced Search</SheetTitle>
            <SheetDescription>
              Filter transactions using multiple criteria
            </SheetDescription>
          </SheetHeader>
          <AdvancedSearch onClose={() => setIsAdvancedSearchOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Transactions;