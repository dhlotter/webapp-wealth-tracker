
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
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return "Invalid date";
      }
      return format(date, "d MMM yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

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
                  <div className="font-medium">{transaction.merchant || "(deleted account)"}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(transaction.date)} • {transaction.accounts?.name}
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
