import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MonthSelectorProps {
  selectedMonth: Date;
  onChange: (date: Date) => void;
}

export const MonthSelector = ({ selectedMonth, onChange }: MonthSelectorProps) => {
  const [availableMonths, setAvailableMonths] = useState<Date[]>([]);

  useEffect(() => {
    const fetchAvailableMonths = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("transactions")
        .select("date")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (data) {
        const uniqueMonths = Array.from(
          new Set(
            data.map((t) => format(new Date(t.date), "yyyy-MM"))
          )
        ).map((dateStr) => parseISO(`${dateStr}-01`));

        setAvailableMonths(uniqueMonths);
      }
    };

    fetchAvailableMonths();
  }, []);

  return (
    <div className="w-[200px] mx-auto mb-6">
      <Select
        value={format(selectedMonth, "yyyy-MM")}
        onValueChange={(value) => onChange(parseISO(`${value}-01`))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {availableMonths.map((date) => (
            <SelectItem key={format(date, "yyyy-MM")} value={format(date, "yyyy-MM")}>
              {format(date, "MMMM yyyy")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};