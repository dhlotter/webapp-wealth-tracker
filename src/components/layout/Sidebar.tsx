import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarSettings } from "./SidebarSettings";
import { SidebarFooter } from "./SidebarFooter";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <SidebarHeader />
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          <SidebarNavigation />
          <SidebarSettings />
        </ul>
      </nav>
      <SidebarFooter />
    </div>
  );
};

export default Sidebar;