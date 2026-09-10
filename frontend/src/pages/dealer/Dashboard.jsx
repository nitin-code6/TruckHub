import { useEffect, useRef, useState } from "react";
import {
  Truck,
  Gauge,
  IndianRupee,
  Activity,
  Clock,
  AlertTriangle
} from "lucide-react";
import axios from "../../utils/axios";
import gsap from "gsap";
import MetricsCard from "../../component/dealer/MetricsCard";

const DealerDashboard = () => {
  const pageRef = useRef(null);
  const sectionsRef = useRef([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("/dealer/dashboard").then(res => {
      setStats(res.data.data);
    });

    gsap.fromTo(
      pageRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    );
  }, []);

  if (!stats) {
    return <p className="mt-20 text-center text-gray-500">Loading dashboard...</p>;
  }

  return (
    <div
      ref={pageRef}
      className="space-y-14 pt-20 px-6 bg-[#ffffff] min-h-screen"
    >

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dealer Overview
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Fleet performance & operational snapshot
        </p>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Trucks"
          value={stats.totalTrucks}
          icon={<Truck className="w-5 h-5" />}
          color="blue"
        />

        <MetricsCard
          title="Active Trips"
          value={stats.activeTrips}
          icon={<Gauge className="w-5 h-5" />}
          color="emerald"
        />

        <MetricsCard
          title="Completed Trips"
          value={stats.completedTrips}
          icon={<Activity className="w-5 h-5" />}
          color="green"
        />

        <MetricsCard
          title="Total Earnings"
          value={`₹${stats.totalEarnings}`}
          icon={<IndianRupee className="w-5 h-5" />}
          color="amber"
          subtitle="Lifetime earnings"
        />
      </div>

      {/* SECONDARY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* TODAY SUMMARY */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Today Summary
          </h2>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Trips Started</span>
              <span className="font-semibold">{stats.todayTrips || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Trips Completed</span>
              <span className="font-semibold">{stats.todayCompleted || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Earnings Today</span>
              <span className="font-semibold text-amber-600">
                ₹{stats.todayEarnings || 0}
              </span>
            </div>
          </div>
        </div>

        {/* FLEET UTILIZATION */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Fleet Utilization
          </h2>

          <p className="text-sm text-gray-600 mb-2">
            Avg Utilization
          </p>

          <div className="w-full h-3 bg-gray-200 rounded-full">
            <div
              className="h-3 bg-[#3f89f9] rounded-full"
              style={{ width: `${stats.avgUtilization || 0}%` }}
            />
          </div>

          <p className="text-sm font-semibold text-gray-900 mt-2">
            {Math.round(stats.avgUtilization || 0)}%
          </p>
        </div>

        {/* QUICK INSIGHTS */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Insights
          </h2>

          <div className="space-y-3 text-sm text-gray-700">
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#3f89f9]" />
              Avg trip duration improving
            </p>
            <p className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              2 trucks under-utilized
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerDashboard;
