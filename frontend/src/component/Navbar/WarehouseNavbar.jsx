import { NavLink, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../context/authSlice.js";

const WarehouseNavbar = () => {
  const dispatch = useDispatch();

  const navClass = ({ isActive }) =>
    isActive
      ? "text-gray-900 font-semibold"
      : "text-gray-600 hover:text-gray-900 transition font-medium";

  return (
    <nav className="w-full fixed top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link
            to="/warehouse/dashboard"
            className="text-lg font-bold tracking-tight text-gray-900"
          >
            TruckHub<span className="text-[#3f89f9]"> | Warehouse</span>
          </Link>

          {/* LINKS */}
          <div className="flex items-center gap-8 text-sm">

            <NavLink to="/warehouse/dashboard" className={navClass}>
              Dashboard
            </NavLink>
            <NavLink to="/warehouse/shipments" className={navClass}>
              Shipments
            </NavLink>


            <NavLink to="/warehouse/bookings" className={navClass}>
              Bookings
            </NavLink>

            <NavLink to="/warehouse/analytics" className={navClass}>
              Analytics
            </NavLink>

            {/* LOGOUT */}
            <button
              onClick={() => dispatch(logout())}
              className="px-4 py-2 rounded-md text-sm font-semibold bg-[#6EA8FE] hover:bg-[#4c8df6] transition"
            >
              Logout
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default WarehouseNavbar;
