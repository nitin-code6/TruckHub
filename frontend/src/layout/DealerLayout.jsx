import { Outlet } from "react-router-dom";
const DealerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">


      {/* Main Content Area */}
      <div className="flex flex-1">

        {/* Sidebar (future enhancement) */}
        {/*
        <aside className="w-64 bg-white border-r hidden md:block">
          Sidebar
        </aside>
        */}

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DealerLayout;
