import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSpendingGroups } from "@/hooks/useSpendingGroups";
import { Trash2, Pencil, X, Check } from "lucide-react";

export const SpendingGroupsSheet = () => {
  const [newGroupName, setNewGroupName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const { 
    data: spendingGroups = [], 
    isLoading, 
    createSpendingGroup, 
    deleteSpendingGroup,
    updateSpendingGroup 
  } = useSpendingGroups();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      createSpendingGroup(newGroupName.trim());
      setNewGroupName("");
    }
  };

  const startEditing = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEditing = (id: string) => {
    if (editingName.trim()) {
      updateSpendingGroup(id, editingName.trim());
      setEditingId(null);
      setEditingName("");
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
                {editingId === group.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => saveEditing(group.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={cancelEditing}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span>{group.name}</span>
                    <div className="flex items-center gap-2">
                      {!group.is_default && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditing(group.id, group.name)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteSpendingGroup(group.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};