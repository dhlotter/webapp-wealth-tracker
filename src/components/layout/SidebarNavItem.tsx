import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarNavItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isActive: boolean;
}

export const SidebarNavItem = ({
  icon: Icon,
  label,
  path,
  isActive,
}: SidebarNavItemProps) => {
  return (
    <li>
      <Link
        to={path}
        className={cn(
          "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200",
          isActive 
            ? "text-[#F97316]" 
            : "text-gray-300 hover:text-[#F97316]",
          "hover:text-shadow-[0_0_10px_rgba(249,115,22,0.5)]"
        )}
      >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </Link>
    </li>
  );
};