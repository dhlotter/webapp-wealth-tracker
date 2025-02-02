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
import { TransactionsDataTable } from "@/components/transactions/TransactionsDataTable";
import { useTransactions } from "@/hooks/useTransactions";
import { Transaction, QuickFilter } from "@/types/transactions";
import { AdvancedSearch } from "@/components/transactions/AdvancedSearch";
import { TransactionEdit } from "@/components/transactions/TransactionEdit";
import { startOfDay, endOfDay } from "date-fns";

const Transactions = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [advancedFilters, setAdvancedFilters] = useState<any>(null);

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

    // Advanced filters
    if (advancedFilters) {
      if (advancedFilters.fromDate && new Date(transaction.date) < startOfDay(advancedFilters.fromDate)) {
        return false;
      }
      if (advancedFilters.toDate && new Date(transaction.date) > endOfDay(advancedFilters.toDate)) {
        return false;
      }
      if (advancedFilters.accountIds?.length > 0 && !advancedFilters.accountIds.includes(transaction.account_id)) {
        return false;
      }
      if (advancedFilters.amountMin && transaction.amount < advancedFilters.amountMin) {
        return false;
      }
      if (advancedFilters.amountMax && transaction.amount > advancedFilters.amountMax) {
        return false;
      }
      if (advancedFilters.spendingGroups?.length > 0 && !advancedFilters.spendingGroups.includes(transaction.spending_group)) {
        return false;
      }
      if (advancedFilters.categories?.length > 0 && !advancedFilters.categories.includes(transaction.category)) {
        return false;
      }
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
            setAdvancedFilters(null);
          }}
          disabled={quickFilter === "all" && !searchQuery && !advancedFilters}
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

      <TransactionsDataTable
        data={filteredTransactions}
        searchQuery={searchQuery}
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
          <AdvancedSearch 
            onClose={() => setIsAdvancedSearchOpen(false)}
            onApplyFilters={setAdvancedFilters}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Transactions;
