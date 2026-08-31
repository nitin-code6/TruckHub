import { useSelector } from "react-redux";

import PublicNavbar from "../Navbar/PublicNavbar";
import WarehouseNavbar from "../Navbar/WarehouseNavbar";
import DealerNavbar from "../Navbar/DealerNavbar";

const NavbarSwitcher = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // determine which navbar to render
  let nav = null;

  if (!isAuthenticated) nav = <PublicNavbar />;
  else if (user?.role === "WAREHOUSE") nav = <WarehouseNavbar />;
  else if (user?.role === "DEALER") nav = <DealerNavbar />;

  if (!nav) return null;

  // Hide navbar on small screens (mobile). Show from `md` breakpoint and up.
  return <div className="hidden md:block">{nav}</div>;
};

export default NavbarSwitcher;
