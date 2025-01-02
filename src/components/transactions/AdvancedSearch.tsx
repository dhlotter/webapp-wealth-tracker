import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";

interface AdvancedSearchProps {
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

export const AdvancedSearch = ({ onClose, onApplyFilters }: AdvancedSearchProps) => {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const [amountMin, setAmountMin] = useState<string>("");
  const [amountMax, setAmountMax] = useState<string>("");
  const [spendingGroup, setSpendingGroup] = useState<string>();

  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accounts")
        .select("id, name, type")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onApplyFilters({
      fromDate,
      toDate,
      accountId: selectedAccount,
      amountMin: amountMin ? parseFloat(amountMin) : undefined,
      amountMax: amountMax ? parseFloat(amountMax) : undefined,
      spendingGroup,
    });
    onClose();
  };

  return (
    <ScrollArea className="flex-1 p-[2mm]">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Date Range</Label>
          <div className="flex gap-2">
            <DatePicker
              selected={fromDate}
              onSelect={setFromDate}
              placeholder="From date"
            />
            <DatePicker
              selected={toDate}
              onSelect={setToDate}
              placeholder="To date"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="account">Account</Label>
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger id="account">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts?.map((account) => (
                <SelectItem 
                  key={account.id} 
                  value={account.id}
                  className="text-muted-foreground"
                >
                  {`${account.type} - ${account.name}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount-min">Amount Range</Label>
          <div className="flex gap-2">
            <Input 
              id="amount-min" 
              placeholder="Min amount" 
              type="number" 
              value={amountMin}
              onChange={(e) => setAmountMin(e.target.value)}
            />
            <Input 
              id="amount-max" 
              placeholder="Max amount" 
              type="number"
              value={amountMax}
              onChange={(e) => setAmountMax(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="spending-group">Spending Group</Label>
          <Select value={spendingGroup} onValueChange={setSpendingGroup}>
            <SelectTrigger id="spending-group">
              <SelectValue placeholder="Select spending group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day-to-day">Day to Day</SelectItem>
              <SelectItem value="recurring">Recurring</SelectItem>
              <SelectItem value="invest-save-repay">Invest/Save/Repay</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 space-x-2">
          <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit">Apply Filters</Button>
        </div>
      </form>
    </ScrollArea>
  );
};