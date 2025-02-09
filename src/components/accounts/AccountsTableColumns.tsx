
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Account } from "@/types/accounts";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { format } from "date-fns";
import { useSettings } from "@/hooks/useSettings";

export const useAccountColumns = (onAccountClick?: (account: Account) => void): ColumnDef<Account>[] => {
  const { data: settings } = useSettings();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return "Invalid date";
      }
      return format(date, settings?.date_format || "MMM d, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

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
        return formatDate(row.getValue("lastUpdated"));
      },
    },
  ];
};
