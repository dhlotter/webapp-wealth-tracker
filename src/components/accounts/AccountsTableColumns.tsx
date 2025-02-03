"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Account } from "@/types/accounts";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/useSettings";

export const useAccountColumns = (onAccountClick?: (account: Account) => void): ColumnDef<Account>[] => {
  const { data: settings } = useSettings();

  return [
    {
      accessorKey: "type",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "balance",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-right w-full justify-end"
          >
            Balance
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = row.getValue("balance") as number;
        const currency = row.original.currency;
        return <div className="text-right">{formatCurrency(amount, currency)}</div>;
      },
    },
    {
      accessorKey: "lastUpdated",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Last Updated
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return format(new Date(row.getValue("lastUpdated")), settings?.date_format || "MMM d, yyyy");
      },
    },
  ];
};