import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Account } from "@/types/accounts";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { useSettings } from "@/hooks/useSettings";

interface AccountsTableProps {
  accounts: Account[];
  onSort: (key: keyof Account) => void;
  onAccountClick: (account: Account) => void;
}

export function AccountsTable({ accounts, onSort, onAccountClick }: AccountsTableProps) {
  const { data: settings } = useSettings();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className="cursor-pointer"
            onClick={() => onSort("name")}
          >
            <div className="flex items-center">
              Account Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          </TableHead>
          <TableHead
            className="cursor-pointer"
            onClick={() => onSort("type")}
          >
            <div className="flex items-center">
              Type
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          </TableHead>
          <TableHead
            className="cursor-pointer text-right"
            onClick={() => onSort("balance")}
          >
            <div className="flex items-center justify-end">
              Balance
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          </TableHead>
          <TableHead
            className="cursor-pointer"
            onClick={() => onSort("lastUpdated")}
          >
            <div className="flex items-center">
              Last Updated
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts.map((account) => (
          <TableRow
            key={account.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onAccountClick(account)}
          >
            <TableCell>{account.name}</TableCell>
            <TableCell>{account.type}</TableCell>
            <TableCell className="text-right">
              {formatCurrency(account.balance, settings?.currency, settings?.locale)}
            </TableCell>
            <TableCell>
              {new Date(account.lastUpdated).toLocaleDateString(settings?.locale)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}