import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { BulkActionBarProps } from "./types"

export function BulkActionBar({ rowSelection, data, onClearSelection }: BulkActionBarProps) {
  const queryClient = useQueryClient()

  const toggleSeenMutation = useMutation({
    mutationFn: async ({ ids, seen }: { ids: string[], seen: boolean }) => {
      const { error } = await supabase
        .from("transactions")
        .update({ seen })
        .in('id', ids)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      toast.success("Transaction status updated")
      onClearSelection()
    },
    onError: (error) => {
      toast.error("Failed to update transaction status")
      console.error("Error updating transaction status:", error)
    },
  })

  const handleToggleSeen = () => {
    const selectedIds = Object.keys(rowSelection).map(
      (index) => data[parseInt(index)].id
    )
    
    const hasUnseenTransactions = selectedIds.some(
      (id) => !data.find((t) => t.id === id)?.seen
    )
    
    toggleSeenMutation.mutate({
      ids: selectedIds,
      seen: hasUnseenTransactions,
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggleSeen}
        disabled={Object.keys(rowSelection).length === 0}
        className="flex items-center gap-2"
      >
        {Object.keys(rowSelection).some(
          (index) => !data[parseInt(index)]?.seen
        ) ? (
          <>
            <Eye className="h-4 w-4" />
            Mark as Seen
          </>
        ) : (
          <>
            <EyeOff className="h-4 w-4" />
            Mark as Unseen
          </>
        )}
      </Button>
    </div>
  )
}