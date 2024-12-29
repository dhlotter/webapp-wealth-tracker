import {
  LayoutDashboard,
  Wallet,
  Receipt,
  PieChart,
  TrendingUp,
} from "lucide-react";

export const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Wallet, label: "Accounts", path: "/accounts" },
  { icon: Receipt, label: "Transactions", path: "/transactions" },
  { icon: PieChart, label: "Budget", path: "/budget" },
  { icon: TrendingUp, label: "Investments", path: "/investments" },
];

export const settingsItems = [
  { label: "Profile", path: "/settings-profile" },
  { label: "General", path: "/settings-general" },
  { label: "Budget", path: "/settings-budget" },
];