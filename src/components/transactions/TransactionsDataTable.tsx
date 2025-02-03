"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Transaction } from "@/types/transactions"
import { format } from "date-fns"
import { useSettings } from "@/hooks/useSettings"
import { formatCurrency } from "@/lib/utils/formatCurrency"
import { ArrowUpDown, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface TransactionsDataTableProps {
  data: Transaction[]
  onTransactionClick?: (transaction: Transaction) => void;
  searchQuery?: string;
}

export function TransactionsDataTable({
  data,
  onTransactionClick,
  searchQuery = "",
}: TransactionsDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const { data: settings } = useSettings()
  const queryClient = useQueryClient()

  // Update column filters when search query changes
  React.useEffect(() => {
    if (searchQuery) {
      setColumnFilters([
        {
          id: "merchant",
          value: searchQuery,
        },
      ])
    } else {
      setColumnFilters([])
    }
  }, [searchQuery])

  const getSortIcon = (isSorted: boolean | string) => {
    if (!isSorted) return <ArrowUpDown className="ml-2 h-4 w-4" />
    return isSorted === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    )
  }

  const toggleSeenMutation = useMutation({
    mutationFn: async ({ ids, seen }: { ids: string[], seen: boolean }) => {
      const { error } = await supabase
        .from("transactions")
        .update({ seen })
        .in('id', ids)

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction status updated");
      setRowSelection({});
    },
    onError: (error) => {
      toast.error("Failed to update transaction status");
      console.error("Error updating transaction status:", error);
    },
  });

  const handleToggleSeen = () => {
    const selectedIds = Object.keys(rowSelection).map(
      (index) => data[parseInt(index)].id
    );
    
    // Check if any of the selected transactions are unseen
    const hasUnseenTransactions = selectedIds.some(
      (id) => !data.find((t) => t.id === id)?.seen
    );
    
    toggleSeenMutation.mutate({
      ids: selectedIds,
      seen: hasUnseenTransactions,
    });
  };

  const columns: ColumnDef<Transaction>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="h-[42px] flex items-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() ? "indeterminate" : false)
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="h-[42px] flex items-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            {getSortIcon(column.getIsSorted())}
          </div>
        )
      },
      cell: ({ row }) => format(new Date(row.getValue("date")), settings?.date_format || "MMM d, yyyy"),
    },
    {
      accessorKey: "accounts.name",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Account
            {getSortIcon(column.getIsSorted())}
          </div>
        )
      },
    },
    {
      accessorKey: "merchant",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Merchant
            {getSortIcon(column.getIsSorted())}
          </div>
        )
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category
            {getSortIcon(column.getIsSorted())}
          </div>
        )
      },
      cell: ({ row }) => `${row.original.spending_group} - ${row.original.category}`,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center justify-end cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            {getSortIcon(column.getIsSorted())}
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatCurrency(row.getValue("amount"), row.original.accounts?.currency)}
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const markAsSeen = useMutation({
    mutationFn: async (transactionId: string) => {
      const { error } = await supabase
        .from("transactions")
        .update({ seen: true })
        .eq("id", transactionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  return (
    <div className="space-y-4">
      {Object.keys(rowSelection).length > 0 && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleSeen}
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
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`${onTransactionClick ? "cursor-pointer hover:bg-muted" : ""} ${
                    !row.original.seen ? "font-semibold" : ""
                  }`}
                  onClick={() => {
                    if (onTransactionClick) {
                      markAsSeen.mutate(row.original.id);
                      onTransactionClick(row.original);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}