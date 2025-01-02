import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AdvancedSearchProps {
  onClose: () => void;
}

export const AdvancedSearch = ({ onClose }: AdvancedSearchProps) => {
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

  return (
    <ScrollArea className="flex-1 p-[2mm]">
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="date-range">Date Range</Label>
          <Select>
            <SelectTrigger id="date-range">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7">Last 7 days</SelectItem>
              <SelectItem value="last-30">Last 30 days</SelectItem>
              <SelectItem value="last-90">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="account">Account</Label>
          <Select>
            <SelectTrigger id="account">
              <SelectValue placeholder="Select account" />
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
          <Label htmlFor="amount-min">Amount Range</Label>
          <div className="flex gap-2">
            <Input id="amount-min" placeholder="Min amount" type="number" />
            <Input id="amount-max" placeholder="Max amount" type="number" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="spending-group">Spending Group</Label>
          <Select>
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
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Apply Filters</Button>
        </div>
      </form>
    </ScrollArea>
  );
};