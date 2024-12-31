import { Button } from "@/components/ui/button";
import { QuickFilter } from "@/types/transactions";

interface QuickFiltersProps {
  quickFilter: QuickFilter;
  setQuickFilter: (filter: QuickFilter) => void;
}

export const QuickFilters = ({ quickFilter, setQuickFilter }: QuickFiltersProps) => {
  return (
    <div className="flex space-x-2">
      <Button
        variant={quickFilter === "all" ? "default" : "outline"}
        onClick={() => setQuickFilter("all")}
      >
        All
      </Button>
      <Button
        variant={quickFilter === "current" ? "default" : "outline"}
        onClick={() => setQuickFilter("current")}
      >
        Current Budget
      </Button>
      <Button
        variant={quickFilter === "unseen" ? "default" : "outline"}
        onClick={() => setQuickFilter("unseen")}
      >
        Unseen
      </Button>
    </div>
  );
};