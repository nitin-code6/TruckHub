import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import axios from "../../utils/axios";
import MetricsCard from "../../component/warehouse/MetricsCard";
import {
  Package,
  Truck,
  CheckCircle,
  AlertTriangle,
  Clock,
  Activity
} from "lucide-react";

const Dashboard = () => {
  const pageRef = useRef(null);
  const sectionsRef = useRef([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DASHBOARD DATA ================= */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("/dashboard/warehouse");
        setDashboard(res.data.data);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  /* ================= PAGE FADE ================= */
  useEffect(() => {
    gsap.fromTo(
      pageRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" }
    );
  }, []);

  /* ================= STAGGER SECTIONS ================= */
  useEffect(() => {
    if (!loading && sectionsRef.current.length) {
      gsap.fromTo(
        sectionsRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out"
        }
      );
    }
  }, [loading]);

  if (loading) {
    return (
      <p className="text-gray-500 text-center mt-20 text-lg">
        Loading dashboard...
      </p>
    );
  }

  if (!dashboard) {
    return (
      <p className="text-red-500 text-center mt-20 text-lg">
        Failed to load dashboard data
      </p>
    );
  }

  const { shipments, trucks, delayedShipments } = dashboard;

  return (
    <div ref={pageRef} className="space-y-12 ">

      {/* ================= HEADER ================= */}
      <div ref={(el) => (sectionsRef.current[0] = el)}>
        <h1 className="text-3xl font-bold text-gray-900">
          Warehouse Overview
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Real-time operational insights
        </p>
      </div>

      {/* ================= METRICS ================= */}
      <div
        ref={(el) => (sectionsRef.current[1] = el)}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <MetricsCard
          title="Pending Shipments"
          value={shipments.pending}
          icon={Package}
        />
        <MetricsCard
          title="In Transit"
          value={shipments.inTransit}
          icon={Truck}
        />
        <MetricsCard
          title="Delivered"
          value={shipments.delivered}
          icon={CheckCircle}
        />
        <MetricsCard
          title="Available Trucks"
          value={trucks.available}
          icon={Truck}
        />
      </div>

      {/* ================= MAIN GRID ================= */}
      <div
        ref={(el) => (sectionsRef.current[2] = el)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >

        {/* ===== DELAYED SHIPMENTS ===== */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:col-span-2">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Delayed Shipments
            </h2>
          </div>

          {delayedShipments.length ? (
            <table className="w-full text-sm">
              <thead className="border-b text-gray-400">
                <tr>
                  <th className="text-left py-2">Destination</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Last Update</th>
                </tr>
              </thead>
              <tbody>
                {delayedShipments.map((s) => (
                  <tr
                    key={s._id}
                    className="border-b last:border-none text-gray-700"
                  >
                    <td className="py-3">{s.destination}</td>
                    <td className="font-medium">{s.status}</td>
                    <td>
                      {new Date(s.updatedAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-500">
              No delayed shipments 🎉
            </p>
          )}
        </div>

        {/* ===== TODAY SUMMARY ===== */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#3f89f9]" />
            Today Summary
          </h2>

          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Pending</span>
              <span className="font-semibold">{shipments.pending}</span>
            </div>
            <div className="flex justify-between">
              <span>In Transit</span>
              <span className="font-semibold">{shipments.inTransit}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivered</span>
              <span className="font-semibold">{shipments.delivered}</span>
            </div>
          </div>

          <div className="mt-6 h-32 border-2 border-dashed rounded-xl flex items-center justify-center text-gray-400 text-sm">
            Live optimization running
          </div>
        </div>
      </div>

      {/* ================= BOTTOM GRID ================= */}
      <div
        ref={(el) => (sectionsRef.current[3] = el)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >

        {/* ===== AVAILABLE TRUCKS ===== */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#3f89f9]" />
            Available Trucks
          </h2>

          <p className="text-sm text-gray-600">
            Total available trucks:{" "}
            <span className="font-semibold text-gray-900">
              {trucks.available}
            </span>
          </p>
        </div>

        {/* ===== RECENT ACTIVITY ===== */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#3f89f9]" />
            Recent Activity
          </h2>

          <p className="text-sm text-gray-600">
            Live updates from shipments & bookings
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
