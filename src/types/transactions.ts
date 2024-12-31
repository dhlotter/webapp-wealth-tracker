export type QuickFilter = "all" | "current" | "unseen";

export type Transaction = {
  id: string;
  date: string;
  merchant: string;
  description: string;
  spending_group: string;
  category: string;
  amount: number;
  account_id: string;
  notes: string;
  seen: boolean;
  accounts: {
    currency: string;
  };
};