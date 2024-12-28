import { useLocation } from "react-router-dom";
import { menuItems } from "@/config/navigation";
import { SidebarNavItem } from "./SidebarNavItem";

export const SidebarNavigation = () => {
  const location = useLocation();

  return (
    <ul className="space-y-2">
      {menuItems.map((item) => (
        <SidebarNavItem
          key={item.path}
          {...item}
          isActive={location.pathname === item.path}
        />
      ))}
    </ul>
  );
};