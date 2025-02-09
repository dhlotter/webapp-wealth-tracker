
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
import { fetchAccounts, createAccount, updateAccount, deleteAccount } from "@/lib/api/accounts";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Accounts = () => {
  const queryClient = useQueryClient();
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: accounts = [], isLoading, error } = useQuery({
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
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create account");
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
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update account");
      console.error("Error updating account:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setIsEditSheetOpen(false);
      setIsDeleteDialogOpen(false);
      toast.success("Account deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete account");
      console.error("Error deleting account:", error);
    },
  });

  const handleAddAccount = (newAccount: Partial<Account>) => {
    createMutation.mutate(newAccount);
  };

  const handleEditAccount = (updatedAccount: Partial<Account>) => {
    if (selectedAccount) {
      updateMutation.mutate({
        id: selectedAccount.id,
        account: updatedAccount,
      });
    }
  };

  const handleDeleteAccount = () => {
    if (selectedAccount) {
      deleteMutation.mutate(selectedAccount.id);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-[200px]">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[200px] text-destructive">
        Error: {(error as Error).message}
      </div>
    );
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
              onDelete={() => setIsDeleteDialogOpen(true)}
            />
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the account
              and all its history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Accounts;
