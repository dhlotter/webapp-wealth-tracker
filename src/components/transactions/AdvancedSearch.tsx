import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface AdvancedSearchProps {
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

export const AdvancedSearch = ({ onClose, onApplyFilters }: AdvancedSearchProps) => {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [amountMin, setAmountMin] = useState<string>("");
  const [amountMax, setAmountMax] = useState<string>("");
  const [selectedSpendingGroups, setSelectedSpendingGroups] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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
      accountIds: selectedAccounts,
      amountMin: amountMin ? parseFloat(amountMin) : undefined,
      amountMax: amountMax ? parseFloat(amountMax) : undefined,
      spendingGroups: selectedSpendingGroups,
      categories: selectedCategories,
    });
    onClose();
  };

  const toggleAccount = (accountId: string) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const toggleSpendingGroup = (group: string) => {
    setSelectedSpendingGroups(prev =>
      prev.includes(group)
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
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
              className="flex-1"
            />
            <DatePicker
              selected={toDate}
              onSelect={setToDate}
              placeholder="To date"
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Accounts</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedAccounts.map(accountId => {
              const account = accounts?.find(a => a.id === accountId);
              return account ? (
                <Badge 
                  key={account.id}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => toggleAccount(account.id)}
                >
                  {`${account.type} - ${account.name}`} ×
                </Badge>
              ) : null;
            })}
          </div>
          <Select
            onValueChange={toggleAccount}
            value={undefined}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select accounts" />
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
          <Label>Amount Range</Label>
          <div className="flex gap-2">
            <Input 
              placeholder="Min amount" 
              type="number" 
              value={amountMin}
              onChange={(e) => setAmountMin(e.target.value)}
              className="flex-1"
            />
            <Input 
              placeholder="Max amount" 
              type="number"
              value={amountMax}
              onChange={(e) => setAmountMax(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Spending Groups</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedSpendingGroups.map(group => (
              <Badge 
                key={group}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => toggleSpendingGroup(group)}
              >
                {group} ×
              </Badge>
            ))}
          </div>
          <Select
            onValueChange={toggleSpendingGroup}
            value={undefined}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select spending groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day-to-day">Day to Day</SelectItem>
              <SelectItem value="recurring">Recurring</SelectItem>
              <SelectItem value="invest-save-repay">Invest/Save/Repay</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Categories</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedCategories.map(category => (
              <Badge 
                key={category}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => toggleCategory(category)}
              >
                {category} ×
              </Badge>
            ))}
          </div>
          <Select
            onValueChange={toggleCategory}
            value={undefined}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Shopping">Shopping</SelectItem>
              <SelectItem value="Groceries">Groceries</SelectItem>
              <SelectItem value="Home">Home</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
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