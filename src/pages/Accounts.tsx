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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PlusCircle, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ScrollArea } from '@/components/ui/scroll-area';

type Account = {
  id: string;
  name: string;
  type: string;
  balance: number;
  lastUpdated: string;
  history: { date: string; balance: number }[];
};

type SortConfig = {
  key: keyof Account | null;
  direction: "asc" | "desc";
};

const accountTypes = [
  "Bank Account",
  "Investment Account",
  "Property",
  "Vehicle",
  "Bond",
  "Other Asset"
];

const mockAccounts: Account[] = [
  {
    id: "1",
    name: "Main Checking",
    type: "Bank Account",
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
    name: "Investment Portfolio",
    type: "Investment Account",
    balance: 150000,
    lastUpdated: "2024-03-19",
    history: [
      { date: "2024-01", balance: 145000 },
      { date: "2024-02", balance: 148000 },
      { date: "2024-03", balance: 150000 },
    ],
  },
  {
    id: "3",
    name: "Home Property",
    type: "Property",
    balance: 500000,
    lastUpdated: "2024-03-15",
    history: [
      { date: "2024-01", balance: 495000 },
      { date: "2024-02", balance: 498000 },
      { date: "2024-03", balance: 500000 },
    ],
  },
];

const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [newAccount, setNewAccount] = useState<Partial<Account>>({
    type: accountTypes[0],
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

  const handleAddAccount = () => {
    if (newAccount.name && newAccount.type && newAccount.balance) {
      const account: Account = {
        id: Date.now().toString(),
        name: newAccount.name,
        type: newAccount.type,
        balance: Number(newAccount.balance),
        lastUpdated: new Date().toISOString().split('T')[0],
        history: [
          { date: new Date().toISOString().split('T')[0], balance: Number(newAccount.balance) }
        ],
      };
      setAccounts([...accounts, account]);
      setNewAccount({ type: accountTypes[0] });
      setIsAddSheetOpen(false);
    }
  };

  const handleEditAccount = () => {
    if (selectedAccount) {
      const updatedAccounts = accounts.map((account) =>
        account.id === selectedAccount.id ? selectedAccount : account
      );
      setAccounts(updatedAccounts);
      setIsEditSheetOpen(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Accounts</h1>
        <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
          <SheetTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] !p-0 flex flex-col">
            <ScrollArea className="flex-1">
              <div className="p-[2mm]">
                <SheetHeader>
                  <SheetTitle>Add New Account</SheetTitle>
                  <SheetDescription>
                    Enter the details for your new account
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Account Name</Label>
                    <Input
                      id="name"
                      value={newAccount.name || ""}
                      onChange={(e) =>
                        setNewAccount({ ...newAccount, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Account Type</Label>
                    <Select
                      value={newAccount.type}
                      onValueChange={(value) =>
                        setNewAccount({ ...newAccount, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        {accountTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="balance">Current Balance</Label>
                    <Input
                      id="balance"
                      type="number"
                      value={newAccount.balance || ""}
                      onChange={(e) =>
                        setNewAccount({
                          ...newAccount,
                          balance: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="mt-auto border-t">
              <div className="p-[2mm] flex justify-center gap-2">
                <Button variant="outline" onClick={() => setIsAddSheetOpen(false)} className="flex-1">Cancel</Button>
                <Button onClick={handleAddAccount} className="flex-1">Add Account</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center">
                Account Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("type")}
            >
              <div className="flex items-center">
                Type
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer text-right"
              onClick={() => handleSort("balance")}
            >
              <div className="flex items-center justify-end">
                Balance
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("lastUpdated")}
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
              onClick={() => {
                setSelectedAccount(account);
                setIsEditSheetOpen(true);
              }}
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

      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent side="right" className="w-[400px] !p-0 flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-[2mm]">
              <SheetHeader>
                <SheetTitle>Edit Account</SheetTitle>
                <SheetDescription>
                  Make changes to your account
                </SheetDescription>
              </SheetHeader>
              {selectedAccount && (
                <>
                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Account Name</Label>
                      <Input
                        id="edit-name"
                        value={selectedAccount.name}
                        onChange={(e) =>
                          setSelectedAccount({
                            ...selectedAccount,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-type">Account Type</Label>
                      <Select
                        value={selectedAccount.type}
                        onValueChange={(value) =>
                          setSelectedAccount({
                            ...selectedAccount,
                            type: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          {accountTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-balance">Current Balance</Label>
                      <Input
                        id="edit-balance"
                        type="number"
                        value={selectedAccount.balance}
                        onChange={(e) =>
                          setSelectedAccount({
                            ...selectedAccount,
                            balance: parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Balance History</h3>
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={selectedAccount.history}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="balance"
                              stroke="#8884d8"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
          <div className="mt-auto border-t">
            <div className="p-[2mm] flex justify-center gap-2">
              <Button variant="outline" onClick={() => setIsEditSheetOpen(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleEditAccount} className="flex-1">Save Changes</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Accounts;