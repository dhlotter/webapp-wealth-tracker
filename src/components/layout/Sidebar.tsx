import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  PieChart,
  TrendingUp,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Wallet, label: "Accounts", path: "/accounts" },
  { icon: Receipt, label: "Transactions", path: "/transactions" },
  { icon: PieChart, label: "Budget", path: "/budget" },
  { icon: TrendingUp, label: "Investments", path: "/investments" },
];

const settingsItems = [
  { label: "Profile", path: "/settings/profile" },
  { label: "Appearance", path: "/settings/appearance" },
  { label: "Categories & Groups", path: "/settings/categories" },
];

const Sidebar = () => {
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary">Wealth Tracker</h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  location.pathname === item.path
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}

          <li>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors",
                location.pathname.startsWith("/settings")
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform",
                  isSettingsOpen && "transform rotate-180"
                )}
              />
            </button>

            {isSettingsOpen && (
              <ul className="mt-2 ml-8 space-y-2">
                {settingsItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={cn(
                        "block px-3 py-2 rounded-lg transition-colors",
                        location.pathname === item.path
                          ? "bg-primary text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 w-full px-3 py-2">
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
