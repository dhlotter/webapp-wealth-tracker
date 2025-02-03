import { ColumnDef } from "@tanstack/react-table"
import { Transaction } from "@/types/transactions"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { formatCurrency } from "@/lib/utils/formatCurrency"
import { TableColumnsProps } from "./types"

export function getTableColumns({ settings, getSortIcon }: TableColumnsProps): ColumnDef<Transaction>[] {
  return [
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
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          {getSortIcon(column.getIsSorted())}
        </div>
      ),
      cell: ({ row }) => format(new Date(row.getValue("date")), settings?.date_format || "MMM d, yyyy"),
    },
    {
      accessorKey: "accounts.name",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Account
          {getSortIcon(column.getIsSorted())}
        </div>
      ),
    },
    {
      accessorKey: "merchant",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Merchant
          {getSortIcon(column.getIsSorted())}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          {getSortIcon(column.getIsSorted())}
        </div>
      ),
      cell: ({ row }) => `${row.original.spending_group} - ${row.original.category}`,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <div
          className="flex items-center justify-end cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          {getSortIcon(column.getIsSorted())}
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatCurrency(row.getValue("amount"), row.original.accounts?.currency)}
        </div>
      ),
    },
  ]
}