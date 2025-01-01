export type Account = {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  lastUpdated: string;
  history: { date: string; balance: number }[];
};