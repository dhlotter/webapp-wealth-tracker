"use client"

import * as React from "react"
import {
  SortingState,
  ColumnFiltersState,
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
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useSettings } from "@/hooks/useSettings"
import { BulkActionBar } from "./BulkActionBar"
import { getTableColumns } from "./TableColumns"
import { TransactionTableProps } from "./types"
import { format } from "date-fns"

export function TransactionsDataTable({
  data,
  onTransactionClick,
  searchQuery = "",
}: TransactionTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const { data: settings } = useSettings()
  const queryClient = useQueryClient()

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data

    const searchLower = searchQuery.toLowerCase()
    return data.filter(row => {
      const dateStr = format(new Date(row.date), settings?.date_format || "MMM d, yyyy")
      const amountStr = row.amount.toString()
      
      return (
        dateStr.toLowerCase().includes(searchLower) ||
        (row.accounts?.name || "").toLowerCase().includes(searchLower) ||
        (row.merchant || "").toLowerCase().includes(searchLower) ||
        (row.category || "").toLowerCase().includes(searchLower) ||
        (row.spending_group || "").toLowerCase().includes(searchLower) ||
        amountStr.includes(searchLower)
      )
    })
  }, [data, searchQuery, settings?.date_format])

  const getSortIcon = (isSorted: boolean | string) => {
    if (!isSorted) return <ArrowUpDown className="ml-2 h-4 w-4" />
    return isSorted === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    )
  }

  const columns = getTableColumns({ settings, getSortIcon })

  const table = useReactTable({
    data: filteredData,
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
        .eq("id", transactionId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
  })

  return (
    <div className="space-y-4">
      <BulkActionBar
        rowSelection={rowSelection}
        data={filteredData}
        onClearSelection={() => setRowSelection({})}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
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
                      markAsSeen.mutate(row.original.id)
                      onTransactionClick(row.original)
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
