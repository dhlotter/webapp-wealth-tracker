export type Account = {
  id: string;
  name: string;
  type: string;
  balance: number;
  lastUpdated: string;
  history: { date: string; balance: number }[];
};