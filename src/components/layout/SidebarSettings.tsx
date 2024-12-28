import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Settings, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { settingsItems } from "@/config/navigation";

export const SidebarSettings = () => {
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
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
  );
};