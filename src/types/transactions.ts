export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  date: string;
  merchant: string;
  description?: string;
  spending_group: string;
  category: string;
  amount: number;
  notes?: string;
  seen?: boolean;
  accounts?: {
    name: string;
    currency: string;
  };
}

export type QuickFilter = "all" | "current" | "unseen";