import { useState, useEffect } from "react";
import { format, parseISO, subMonths, startOfMonth } from "date-fns";
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
    const months: Date[] = [];
    const currentDate = startOfMonth(new Date());
    
    for (let i = 0; i < 12; i++) {
      months.push(subMonths(currentDate, i));
    }
    
    setAvailableMonths(months);
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