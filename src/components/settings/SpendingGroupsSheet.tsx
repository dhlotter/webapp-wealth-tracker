import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSpendingGroups } from "@/hooks/useSpendingGroups";
import { Trash2 } from "lucide-react";

export const SpendingGroupsSheet = () => {
  const [newGroupName, setNewGroupName] = useState("");
  const { data: spendingGroups = [], isLoading, createSpendingGroup, deleteSpendingGroup } = useSpendingGroups();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      createSpendingGroup(newGroupName.trim());
      setNewGroupName("");
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="New spending group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <Button type="submit">Add</Button>
          </form>

          <div className="space-y-2">
            {spendingGroups.map((group) => (
              <div
                key={group.id}
                className="flex items-center justify-between p-2 rounded-lg bg-muted"
              >
                <span>{group.name}</span>
                {!group.is_default && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteSpendingGroup(group.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};