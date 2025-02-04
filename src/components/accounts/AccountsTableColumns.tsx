"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Account } from "@/types/accounts";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { format } from "date-fns";
import { useSettings } from "@/hooks/useSettings";

export const useAccountColumns = (onAccountClick?: (account: Account) => void): ColumnDef<Account>[] => {
  const { data: settings } = useSettings();

  return [
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "balance",
      header: () => <div className="text-right">Balance</div>,
      cell: ({ row }) => {
        const amount = row.getValue("balance") as number;
        const currency = row.original.currency;
        return <div className="text-right">{formatCurrency(amount, currency)}</div>;
      },
    },
    {
      accessorKey: "lastUpdated",
      header: "Last Updated",
      cell: ({ row }) => {
        return format(new Date(row.getValue("lastUpdated")), settings?.date_format || "MMM d, yyyy");
      },
    },
  ];
};