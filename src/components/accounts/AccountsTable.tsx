import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Account } from "@/types/accounts";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { format } from "date-fns";
import { useSettings } from "@/hooks/useSettings";

interface AccountsTableProps {
  accounts: Account[];
  onAccountClick?: (account: Account) => void;
  onSort?: (key: keyof Account) => void;
}

export const AccountsTable = ({ accounts, onAccountClick, onSort }: AccountsTableProps) => {
  const { data: settings } = useSettings();
  
  // Sort accounts by type first, then by name
  const sortedAccounts = [...accounts].sort((a, b) => {
    const typeComparison = a.type.localeCompare(b.type);
    if (typeComparison !== 0) return typeComparison;
    return a.name.localeCompare(b.name);
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => onSort?.('type')} className={onSort ? "cursor-pointer hover:bg-muted" : ""}>Type</TableHead>
          <TableHead onClick={() => onSort?.('name')} className={onSort ? "cursor-pointer hover:bg-muted" : ""}>Name</TableHead>
          <TableHead onClick={() => onSort?.('balance')} className={onSort ? "cursor-pointer hover:bg-muted text-right" : "text-right"}>Balance</TableHead>
          <TableHead onClick={() => onSort?.('lastUpdated')} className={onSort ? "cursor-pointer hover:bg-muted" : ""}>Last Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedAccounts.map((account) => (
          <TableRow 
            key={account.id}
            className={onAccountClick ? "cursor-pointer hover:bg-muted" : ""}
            onClick={() => onAccountClick?.(account)}
          >
            <TableCell className="font-medium">{account.type}</TableCell>
            <TableCell>{account.name}</TableCell>
            <TableCell className="text-right">
              {formatCurrency(account.balance, account.currency)}
            </TableCell>
            <TableCell>
              {format(new Date(account.lastUpdated), settings?.date_format || "MMM d, yyyy")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AccountsTable;