import { NavLink, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../component/context/authSlice";

const DealerNavbar = () => {
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
            to="/dealer/dashboard"
            className="text-lg font-bold tracking-tight text-gray-900"
          >
            TruckHub<span className="text-[#3f89f9]"> | Dealer</span>
          </Link>

          {/* LINKS */}
          <div className="flex items-center gap-8 text-sm">

            <NavLink to="/dealer/dashboard" className={navClass}>
              Dashboard
            </NavLink>

            <NavLink to="/dealer/trucks" className={navClass}>
              Trucks
            </NavLink>

            <NavLink to="/dealer/bookings" className={navClass}>
              Bookings
            </NavLink>

            <NavLink to="/dealer/trips" className={navClass}>
              Trips
            </NavLink>

            <NavLink to="/dealer/analytics" className={navClass}>
              Analytics
            </NavLink>

            {/* LOGOUT */}
            <button
              onClick={() => dispatch(logout())}
              className="px-4 py-2 rounded-md text-sm font-semibold
                         bg-[#3f89f9] hover:bg-[#196aeb]
                         transition text-white"
            >
              Logout
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default DealerNavbar;
