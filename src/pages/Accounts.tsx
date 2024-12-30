import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { fetchAccounts, createAccount, updateAccount } from "@/lib/api/accounts";
import { toast } from "sonner";

type SortConfig = {
  key: keyof Account | null;
  direction: "asc" | "desc";
};

const Accounts = () => {
  const queryClient = useQueryClient();
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  });

  const createMutation = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setIsAddSheetOpen(false);
      toast.success("Account created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create account");
      console.error("Error creating account:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, account }: { id: string; account: Partial<Account> }) =>
      updateAccount(id, account),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setIsEditSheetOpen(false);
      toast.success("Account updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update account");
      console.error("Error updating account:", error);
    },
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
  };

  const handleAddAccount = (newAccount: Partial<Account>) => {
    if (newAccount.name && newAccount.type && newAccount.balance) {
      createMutation.mutate(newAccount);
    }
  };

  const handleEditAccount = (updatedAccount: Partial<Account>) => {
    if (selectedAccount && updatedAccount.name && updatedAccount.type && updatedAccount.balance) {
      updateMutation.mutate({
        id: selectedAccount.id,
        account: updatedAccount,
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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