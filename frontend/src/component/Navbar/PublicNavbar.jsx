import { Link } from "react-router-dom";

const PublicNavbar = () => {
  return (
    <nav
      className="
        w-full fixed top-0 z-50
        bg-white/30
        backdrop-blur-xl
        border-b border-white/20
        shadow-sm
      "
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link
            to="/"
            className="text-xl font-bold tracking-wide text-black"
          >
            TruckHub
          </Link>

          {/* RIGHT BUTTONS */}
          <div className="flex items-center gap-6">

            {/* LOGIN */}
            <Link
              to="/login"
              className="text-sm font-medium text-gray-800 hover:text-black transition"
            >
              Login
            </Link>

            {/* REGISTER */}
            <Link
              to="/register"
              className="
                px-5 py-2
                text-sm font-medium
                text-white
                bg-black/90
                backdrop-blur
                rounded-lg
                hover:bg-black
                transition
              "
            >
              Get Started
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
