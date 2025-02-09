
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction } from "@/types/transactions";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { format } from "date-fns";
import { useSettings } from "@/hooks/useSettings";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionsTableProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
  onSort?: (key: keyof Transaction) => void;
  sortKey?: keyof Transaction;
  sortDirection?: 'asc' | 'desc';
}

export const TransactionsTable = ({ 
  transactions, 
  onTransactionClick,
  onSort,
  sortKey,
  sortDirection
}: TransactionsTableProps) => {
  const { data: settings } = useSettings();

  const getSortIcon = (key: keyof Transaction) => {
    if (sortKey !== key) return null;
    return (
      <ArrowUpDown className={cn(
        "ml-2 h-4 w-4",
        sortDirection === 'desc' ? "transform rotate-180" : ""
      )} />
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return "Invalid date";
      }
      return format(date, settings?.date_format || "MMM d, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead 
            onClick={() => onSort?.('date')} 
            className={onSort ? "cursor-pointer hover:bg-muted" : ""}
          >
            Date {getSortIcon('date')}
          </TableHead>
          <TableHead>Account</TableHead>
          <TableHead 
            onClick={() => onSort?.('merchant')} 
            className={onSort ? "cursor-pointer hover:bg-muted" : ""}
          >
            Merchant {getSortIcon('merchant')}
          </TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow 
            key={transaction.id}
            className={onTransactionClick ? "cursor-pointer hover:bg-muted" : ""}
            onClick={() => onTransactionClick?.(transaction)}
          >
            <TableCell>
              {formatDate(transaction.date)}
            </TableCell>
            <TableCell>{transaction.accounts?.name}</TableCell>
            <TableCell>{transaction.merchant || "(deleted account)"}</TableCell>
            <TableCell>{`${transaction.spending_group} - ${transaction.category}`}</TableCell>
            <TableCell className="text-right">
              {formatCurrency(transaction.amount, transaction.accounts?.currency)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TransactionsTable;
