import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SpendingGroupsSheet } from "@/components/settings/SpendingGroupsSheet";

const SettingsBudget = () => {
  const [isSpendingGroupsOpen, setIsSpendingGroupsOpen] = useState(false);

  return (
    <PageLayout 
      title="Budget Settings" 
      description="Manage your budget preferences and categories."
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Spending Groups</h3>
          <p className="text-sm text-muted-foreground">
            Manage your spending groups for categorizing transactions.
          </p>
          <Button onClick={() => setIsSpendingGroupsOpen(true)}>
            Manage Spending Groups
          </Button>
        </div>

        <Sheet open={isSpendingGroupsOpen} onOpenChange={setIsSpendingGroupsOpen}>
          <SheetContent side="right" className="w-[400px] !p-0 flex flex-col">
            <SheetHeader className="p-[2mm]">
              <SheetTitle>Spending Groups</SheetTitle>
              <SheetDescription>
                Manage your spending groups for transactions
              </SheetDescription>
            </SheetHeader>
            <SpendingGroupsSheet />
          </SheetContent>
        </Sheet>
      </div>
    </PageLayout>
  );
};

export default SettingsBudget;