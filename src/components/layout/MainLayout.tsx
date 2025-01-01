import Sidebar from "./Sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
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