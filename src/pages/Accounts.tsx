import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Account = {
  id: string;
  name: string;
  type: string;
  balance: number;
  lastUpdated: string;
};

const mockAccounts: Account[] = [
  {
    id: "1",
    name: "Main Checking",
    type: "Checking",
    balance: 5000,
    lastUpdated: "2024-03-20",
  },
  {
    id: "2",
    name: "Savings",
    type: "Savings",
    balance: 10000,
    lastUpdated: "2024-03-19",
  },
];

type SortConfig = {
  key: keyof Account | null;
  direction: "asc" | "desc";
};

const Accounts = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  const handleSort = (key: keyof Account) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));

    const sortedAccounts = [...accounts].sort((a, b) => {
      if (sortConfig.direction === "asc") {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });

    setAccounts(sortedAccounts);
  };

  const handleRowClick = (accountId: string) => {
    window.open(`/accounts/${accountId}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
        <Button onClick={() => navigate("/accounts/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Account Name
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("type")}
            >
              Type
            </TableHead>
            <TableHead
              className="cursor-pointer text-right"
              onClick={() => handleSort("balance")}
            >
              Balance
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("lastUpdated")}
            >
              Last Updated
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow
              key={account.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleRowClick(account.id)}
            >
              <TableCell>{account.name}</TableCell>
              <TableCell>{account.type}</TableCell>
              <TableCell className="text-right">
                ${account.balance.toLocaleString()}
              </TableCell>
              <TableCell>{new Date(account.lastUpdated).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Accounts;