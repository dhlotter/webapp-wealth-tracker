import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Transaction } from "@/types/transactions";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { useSettings } from "@/hooks/useSettings";

interface TransactionEditProps {
  transaction: Transaction;
  onClose: () => void;
}

export const TransactionEdit = ({ transaction, onClose }: TransactionEditProps) => {
  const { data: settings } = useSettings();

  return (
    <ScrollArea className="flex-1 p-[2mm]">
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="merchant">Merchant</Label>
          <Input id="merchant" defaultValue={transaction.merchant} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" defaultValue={transaction.description || ''} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input 
            id="amount" 
            value={formatCurrency(transaction.amount, settings?.currency, settings?.locale)} 
            disabled 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="spending-group">Spending Group</Label>
          <Select defaultValue={transaction.spending_group}>
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
          <Select defaultValue={transaction.category}>
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
          <Textarea id="notes" defaultValue={transaction.notes || ''} />
        </div>

        <div className="pt-4 space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </ScrollArea>
  );
};