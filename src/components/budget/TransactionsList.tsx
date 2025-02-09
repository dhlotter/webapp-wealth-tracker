
import { format } from "date-fns";
import { Transaction } from "@/types/transactions";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { Separator } from "@/components/ui/separator";

interface TransactionsListProps {
  groupedTransactions: { [key: string]: Transaction[] };
  onTransactionClick: (transaction: Transaction) => void;
}

export const TransactionsList = ({ 
  groupedTransactions, 
  onTransactionClick 
}: TransactionsListProps) => {
  return (
    <div className="space-y-4">
      {Object.entries(groupedTransactions).map(([month, monthTransactions]) => (
        <div key={month}>
          <Separator className="my-2" />
          <h3 className="font-semibold mb-2">{month}</h3>
          <div className="space-y-2">
            {monthTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex justify-between items-center cursor-pointer hover:bg-muted/50 p-2 rounded-md"
                onClick={() => onTransactionClick(transaction)}
              >
                <div>
                  <div className="font-medium">{transaction.merchant}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(transaction.date), "d MMM yyyy")} • {transaction.accounts?.name || "(deleted account)"}
                  </div>
                </div>
                <div className="font-medium">
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
