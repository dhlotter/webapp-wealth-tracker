import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PlusCircle } from "lucide-react";
import { AccountsTable } from "@/components/accounts/AccountsTable";
import { AccountForm } from "@/components/accounts/AccountForm";
import { Account } from "@/types/accounts";

type SortConfig = {
  key: keyof Account | null;
  direction: "asc" | "desc";
};

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

  const handleAddAccount = (newAccount: Partial<Account>) => {
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
      setIsAddSheetOpen(false);
    }
  };

  const handleEditAccount = (updatedAccount: Partial<Account>) => {
    if (selectedAccount && updatedAccount.name && updatedAccount.type && updatedAccount.balance) {
      const updatedAccounts = accounts.map((account) =>
        account.id === selectedAccount.id
          ? {
              ...selectedAccount,
              ...updatedAccount,
              lastUpdated: new Date().toISOString().split('T')[0],
              history: [
                ...selectedAccount.history,
                {
                  date: new Date().toISOString().split('T')[0],
                  balance: Number(updatedAccount.balance),
                },
              ],
            }
          : account
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
            <SheetHeader className="p-[2mm]">
              <SheetTitle>Add New Account</SheetTitle>
              <SheetDescription>
                Enter the details for your new account
              </SheetDescription>
            </SheetHeader>
            <AccountForm
              onSubmit={handleAddAccount}
              onCancel={() => setIsAddSheetOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      <AccountsTable
        accounts={accounts}
        onSort={handleSort}
        onAccountClick={(account) => {
          setSelectedAccount(account);
          setIsEditSheetOpen(true);
        }}
      />

      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent side="right" className="w-[400px] !p-0 flex flex-col">
          <SheetHeader className="p-[2mm]">
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>
              Make changes to your account
            </SheetDescription>
          </SheetHeader>
          {selectedAccount && (
            <AccountForm
              account={selectedAccount}
              onSubmit={handleEditAccount}
              onCancel={() => setIsEditSheetOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Accounts;