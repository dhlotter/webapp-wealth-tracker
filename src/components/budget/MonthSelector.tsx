import { useState } from "react";
import { Button } from "@/components/ui/button";
import { format, subMonths, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthSelectorProps {
  selectedMonth: Date;
  onChange: (date: Date) => void;
}

export const MonthSelector = ({ selectedMonth, onChange }: MonthSelectorProps) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(subMonths(selectedMonth, 1))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-lg font-medium">
        {format(selectedMonth, "MMMM yyyy")}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(addMonths(selectedMonth, 1))}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};