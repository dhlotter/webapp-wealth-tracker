import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Account } from "@/types/accounts";

interface AccountsTableProps {
  accounts: Account[];
  onSort: (key: keyof Account) => void;
  onAccountClick: (account: Account) => void;
}

export function AccountsTable({ accounts, onSort, onAccountClick }: AccountsTableProps) {
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
              ${account.balance.toLocaleString()}
            </TableCell>
            <TableCell>
              {new Date(account.lastUpdated).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}