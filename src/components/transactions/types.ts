import { Transaction } from "@/types/transactions"

export interface TransactionTableProps {
  data: Transaction[]
  onTransactionClick?: (transaction: Transaction) => void
  searchQuery?: string
}

export interface BulkActionBarProps {
  rowSelection: Record<string, boolean>
  data: Transaction[]
  onClearSelection: () => void
}

export interface TableColumnsProps {
  settings: any
  getSortIcon: (isSorted: boolean | string) => JSX.Element
}