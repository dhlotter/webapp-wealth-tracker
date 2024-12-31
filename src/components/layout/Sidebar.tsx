import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarSettings } from "./SidebarSettings";
import { SidebarFooter } from "./SidebarFooter";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-[#223145] flex flex-col fixed left-0 top-0">
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