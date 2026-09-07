import { useEffect, useState } from "react";
import MetricsCard from "../component/warehouse/MetricsCard";
import OptimizeCard from "../component/warehouse/OptimizeCard";
import ShipmentCard from "../component/warehouse/ShipmentCard";
import BookingCard from "../component/warehouse/BookingCard";
import api from "../utils/axios";

/* ================= DUMMY DATA ================= */
const dummyMetrics = { totalShipments: 24, openBookings: 8, activeTrucks: 12 };

const dummyShipments = [
  { 
    _id: "shp_001", 
    destination: "DELHI", 
    origin: "MUMBAI",
    weight: 1200, 
    volume: 8.5, 
    boxes: 60, 
    deadline: "2025-12-28", 
    status: "IN_TRANSIT" 
  },
  { 
    _id: "shp_002", 
    destination: "CHENNAI", 
    origin: "BANGALORE",
    weight: 900, 
    volume: 6.2, 
    boxes: 42, 
    deadline: "2025-12-26", 
    status: "PENDING" 
  }
];

const dummyBookings = [
  { 
    _id: "bkg_001", 
    bookingType: "FULL_TRUCK",
    status: "COMPLETED",
    truckId: { truckNumber: "TK-001" },
    shipments: [{ destination: "DELHI", volume: 8.5 }],
    utilizationPercent: 78,
    totalVolumeUsed: 8.5,
    totalWeightUsed: 1200
  },
  { 
    _id: "bkg_002", 
    bookingType: "POOLING",
    status: "IN_TRANSIT",
    truckId: { truckNumber: "TK-002" },
    shipments: [{ destination: "MUMBAI", volume: 6.2 }],
    utilizationPercent: 85,
    totalVolumeUsed: 6.2,
    totalWeightUsed: 900
  }
];

const WarehouseDashboard = () => {
  const [metrics, setMetrics] = useState(dummyMetrics);
  const [shipments, setShipments] = useState(dummyShipments);
  const [bookings, setBookings] = useState(dummyBookings);

  useEffect(() => {
    const load = async () => {
      try {
        const [mRes, sRes, bRes] = await Promise.all([
          api.get("/user/metrics"),
          api.get("/user/shipments"),
          api.get("/user/bookings")
        ]);

        if (mRes?.data?.data) setMetrics(mRes.data.data);
        if (sRes?.data?.data) setShipments(sRes.data.data);
        if (bRes?.data?.data) setBookings(bRes.data.data);
      } catch (err) {
        // Keep dummy data on error
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Warehouse Dashboard</h1>
      </header>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricsCard title="Total Shipments" value={metrics.totalShipments} />
        <MetricsCard title="Open Bookings" value={metrics.openBookings} />
        <MetricsCard title="Active Trucks" value={metrics.activeTrucks} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Placeholder (OptimizeCard requires shipmentId + options props) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4">Quick Optimize</h3>
            <p className="text-sm text-gray-500 mb-4">Select a shipment from the list to see optimization options.</p>
            <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-60" disabled>
              Optimize Shipment
            </button>
          </div>
        </div>

        {/* Right: Shipments + Bookings */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="text-lg font-medium mb-3">Recent Shipments</h2>
            <div className="space-y-3">
              {shipments.map((s) => (
                <ShipmentCard key={s._id} shipment={s} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Recent Bookings</h2>
            <div className="space-y-3">
              {bookings.map((b) => (
                <BookingCard key={b._id} booking={b} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default WarehouseDashboard;
 