import { LogOut } from "lucide-react";

export const SidebarFooter = () => {
  return (
    <div className="p-4 border-t border-gray-200">
      <button className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 w-full px-3 py-2">
        <LogOut className="w-5 h-5" />
        <span>Sign Out</span>
      </button>
    </div>
  );
};