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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

type Account = {
  id: string;
  name: string;
  type: string;
  balance: number;
  lastUpdated: string;
  history: { date: string; balance: number }[];
};

const mockAccounts: Account[] = [
  {
    id: "1",
    name: "Main Checking",
    type: "Checking",
    balance: 5000,
    lastUpdated: "2024-03-20",
    history: [
      { date: "2024-01", balance: 4000 },
      { date: "2024-02", balance: 4500 },
      { date: "2024-03", balance: 5000 },
    ],
  },
  {
    id: "2",
    name: "Savings",
    type: "Savings",
    balance: 10000,
    lastUpdated: "2024-03-19",
    history: [
      { date: "2024-01", balance: 9000 },
      { date: "2024-02", balance: 9500 },
      { date: "2024-03", balance: 10000 },
    ],
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
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const handleRowClick = (account: Account) => {
    setSelectedAccount(account);
    setIsDrawerOpen(true);
  };

  const handleDelete = () => {
    if (selectedAccount && window.confirm("Are you sure you want to delete this account?")) {
      setAccounts(accounts.filter(a => a.id !== selectedAccount.id));
      setIsDrawerOpen(false);
      toast.success("Account deleted successfully");
    }
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
              onClick={() => handleRowClick(account)}
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

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-4xl">
            <DrawerHeader>
              <DrawerTitle className="text-2xl font-bold">
                {selectedAccount?.name}
              </DrawerTitle>
              <DrawerDescription>
                Account Details
              </DrawerDescription>
            </DrawerHeader>
            {selectedAccount && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Type</h3>
                    <p className="text-lg font-semibold">{selectedAccount.type}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Balance</h3>
                    <p className="text-lg font-semibold">
                      ${selectedAccount.balance.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                    <p className="text-lg font-semibold">
                      {new Date(selectedAccount.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedAccount.history}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="balance"
                        stroke="#1E40AF"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="outline" onClick={() => navigate(`/accounts/${selectedAccount.id}/edit`)}>
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Accounts;