import { LogOut } from "lucide-react";

export const SidebarFooter = () => {
  return (
    <div className="p-4">
      <button className="flex items-center space-x-3 text-gray-300 hover:text-[#F97316] transition-all duration-200 hover:text-shadow-[0_0_10px_rgba(249,115,22,0.5)] w-full px-3 py-2">
        <LogOut className="w-5 h-5" />
        <span>Sign Out</span>
      </button>
    </div>
  );
};