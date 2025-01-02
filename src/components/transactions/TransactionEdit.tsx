import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Transaction } from "@/types/transactions";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { useSettings } from "@/hooks/useSettings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TransactionEditProps {
  transaction: Transaction;
  onClose: () => void;
}

export const TransactionEdit = ({ transaction, onClose }: TransactionEditProps) => {
  const { data: settings } = useSettings();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<Transaction>>({
    merchant: transaction.merchant,
    description: transaction.description,
    spending_group: transaction.spending_group,
    category: transaction.category,
    notes: transaction.notes,
    account_id: transaction.account_id,
  });

  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accounts")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Transaction>) => {
      const { error } = await supabase
        .from("transactions")
        .update(data)
        .eq("id", transaction.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction updated successfully");
      onClose();
    },
    onError: (error) => {
      toast.error("Failed to update transaction");
      console.error("Error updating transaction:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-[2mm]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="account">Account</Label>
            <Select
              value={formData.account_id}
              onValueChange={(value) => setFormData({ ...formData, account_id: value })}
            >
              <SelectTrigger id="account">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {accounts?.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="merchant">Merchant</Label>
            <Input
              id="merchant"
              value={formData.merchant}
              onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input 
              id="amount" 
              value={formatCurrency(transaction.amount, transaction.accounts?.currency)} 
              disabled 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="spending-group">Spending Group</Label>
            <Select
              value={formData.spending_group}
              onValueChange={(value) => setFormData({ ...formData, spending_group: value })}
            >
              <SelectTrigger id="spending-group">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day to day">Day to Day</SelectItem>
                <SelectItem value="recurring">Recurring</SelectItem>
                <SelectItem value="invest-save-repay">Invest/Save/Repay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="Groceries">Groceries</SelectItem>
                <SelectItem value="Home">Home</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </form>
      </ScrollArea>
      <div className="mt-auto border-t p-[2mm] flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} type="submit">Save Changes</Button>
      </div>
    </div>
  );
};