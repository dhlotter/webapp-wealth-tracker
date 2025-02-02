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
import { Transaction } from "@/types/transactions"
import { format } from "date-fns"
import { useSettings } from "@/hooks/useSettings"
import { formatCurrency } from "@/lib/utils/formatCurrency"
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react"

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

  return (
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
                className={onTransactionClick ? "cursor-pointer hover:bg-muted" : ""}
                onClick={() => onTransactionClick?.(row.original)}
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
  )
}