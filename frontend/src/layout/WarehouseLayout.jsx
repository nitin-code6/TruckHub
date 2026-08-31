import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block px-3 py-2 rounded-md text-sm font-medium ${
        isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
      }`
    }
  >
    {children}
  </NavLink>
);

const WarehouseLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Mobile sidebar (fixed) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white h-full p-4">
            <button className="mb-4 text-sm text-gray-600" onClick={() => setMobileOpen(false)}>Close</button>
            <nav className="space-y-1">
              <NavItem to="/warehouse/dashboard">Dashboard</NavItem>
              <NavItem to="/warehouse/shipments">Shipments</NavItem>
              <NavItem to="/warehouse/shipments/add">Add Shipment</NavItem>
              <NavItem to="/warehouse/bookings">Bookings</NavItem>
              <NavItem to="/warehouse/analytics">Analytics</NavItem>
            </nav>
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between bg-white border-b p-4">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden px-2 py-1 rounded-md bg-gray-100"
              onClick={() => setMobileOpen(true)}
            >
              Menu
            </button>
            <h1 className="text-lg font-semibold">Warehouse Dashboard</h1>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default WarehouseLayout;
