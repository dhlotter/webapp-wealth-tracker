
import Sidebar from "./Sidebar";
import { useSettings } from "@/hooks/useSettings";
import { useEffect } from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: settings } = useSettings();

  useEffect(() => {
    // Apply dark mode class to document based on settings
    if (settings?.darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings?.darkMode]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-x-auto relative">
        <div className="min-w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
