import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "@/types/transactions";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { useSettings } from "@/hooks/useSettings";

interface TransactionsTableProps {
  transactions: Transaction[];
  onTransactionClick: (transaction: Transaction) => void;
}

export const TransactionsTable = ({ transactions, onTransactionClick }: TransactionsTableProps) => {
  const { data: settings } = useSettings();

  return (
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
        {transactions.map((transaction) => (
          <TableRow
            key={transaction.id}
            className={`cursor-pointer hover:bg-muted/50 ${
              !transaction.seen ? "font-bold" : ""
            }`}
            onClick={() => onTransactionClick(transaction)}
          >
            <TableCell>
              {new Date(transaction.date).toLocaleDateString(settings?.locale, {
                dateStyle: "medium",
              })}
            </TableCell>
            <TableCell>{transaction.merchant}</TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell>{`${transaction.spending_group} - ${transaction.category}`}</TableCell>
            <TableCell className="text-right">
              {formatCurrency(transaction.amount, settings?.currency, settings?.locale)}
            </TableCell>
            <TableCell>{transaction.notes}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};