import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "./utils/axios";
import { loginSuccess } from "./component/context/authSlice";

/* Common */
import NavbarSwitcher from "./component/common/NavbarSwitcher";
import ProtectedRoute from "./component/common/ProtectedRoute";

/* Public Pages */
import Landing from "./pages/LandingPage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisiterPage";

/* Layouts */
import WarehouseLayout from "./layout/WarehouseLayout";
import DealerLayout from "./layout/DealerLayout";

/* Warehouse Pages */
import WarehouseDashboard from "./pages/warehouse/Dashboard";
import Shipments from "./pages/warehouse/Shipments";
import AddShipment from "./pages/warehouse/AddShipment";

import OptimizeShipment from "./pages/warehouse/OptimizeShipment";
import WarehouseBookings from "./pages/warehouse/Bookings";
import WarehouseAnalytics from "./pages/warehouse/Analytics";

/* Dealer Pages */
import DealerDashboard from "./pages/dealer/Dashboard";
import Trucks from "./pages/dealer/Trucks";
import AddTruck from "./pages/dealer/AddTruck";
import DealerBookings from "./pages/dealer/Bookings";
import Trips from "./pages/dealer/Trips";
import DealerAnalytics from "./pages/dealer/Analytics";

function App() {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/user/current-user");
        const user = res.data.data;
        if (user) dispatch(loginSuccess(user));
      } catch (err) {
        // not logged in or token expired — ignore
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (!authChecked) return null;
  return (
    <>
      {/* Navbar switches automatically */}
      <NavbarSwitcher />

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= WAREHOUSE ROUTES ================= */}
        <Route
          element={<ProtectedRoute allowedRoles={["WAREHOUSE"]} />}
        >
        <Route path="/warehouse" element={<WarehouseLayout />}>
          <Route path="dashboard" element={<WarehouseDashboard />} />
          <Route path="shipments" element={<Shipments />} />
          <Route path="shipments/add" element={<AddShipment />} />
          {/* <Route path="shipments/:id" element={<ShipmentDetails />} /> */}
          <Route path="optimize/:id" element={<OptimizeShipment />} />
          <Route path="bookings" element={<WarehouseBookings />} />
          <Route path="analytics" element={<WarehouseAnalytics />} />
        </Route>
        </Route>

        {/* ================= DEALER ROUTES ================= */}
        <Route
          element={<ProtectedRoute allowedRoles={["DEALER"]} />}
        >
          <Route path="/dealer" element={<DealerLayout />}>
            <Route path="dashboard" element={<DealerDashboard />} />
            <Route path="trucks" element={<Trucks />} />
            <Route path="trucks/add" element={<AddTruck />} />
            <Route path="bookings" element={<DealerBookings />} />
            <Route path="trips" element={<Trips />} />
            <Route path="analytics" element={<DealerAnalytics />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
