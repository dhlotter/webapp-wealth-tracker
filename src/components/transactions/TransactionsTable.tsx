import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction } from "@/types/transactions";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { format } from "date-fns";
import { useSettings } from "@/hooks/useSettings";

interface TransactionsTableProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
}

export const TransactionsTable = ({ transactions, onTransactionClick }: TransactionsTableProps) => {
  const { data: settings } = useSettings();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Account</TableHead>
          <TableHead>Merchant</TableHead>
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
              {format(new Date(transaction.date), settings?.date_format || "MMM d, yyyy")}
            </TableCell>
            <TableCell>{transaction.accounts?.name}</TableCell>
            <TableCell>{transaction.merchant}</TableCell>
            <TableCell>{transaction.category}</TableCell>
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