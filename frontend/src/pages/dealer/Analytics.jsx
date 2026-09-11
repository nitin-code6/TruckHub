import { useEffect, useRef, useState } from "react";
import axios from "../../utils/axios";
import gsap from "gsap";
import MetricsCard from "../../component/dealer/MetricsCard";
import {
  Truck,
  Leaf,
  Gauge,
  TrendingUp,
  TrendingDown
} from "lucide-react";

const Analytics = () => {
  const pageRef = useRef(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("/dealer/analytics").then(res => {
      setStats(res.data.data);
    });
  }, []);

  useEffect(() => {
    if (pageRef.current) {
      gsap.fromTo(
        pageRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
      );
    }
  }, [stats]);

  if (!stats) {
    return <p className="mt-20 text-center text-gray-500">Loading analytics...</p>;
  }

  return (
    <div
      ref={pageRef}
      className="space-y-14 pt-20 px-6 bg-[#ffffff] min-h-screen"
    >

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dealer Analytics
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Efficiency, utilization & sustainability metrics
        </p>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Trips"
          value={stats.totalTrips}
          icon={<Truck className="w-5 h-5" />}
          color="blue"
        />

        <MetricsCard
          title="Avg Utilization"
          value={`${Math.round(stats.avgUtilization)}%`}
          icon={<Gauge className="w-5 h-5" />}
          color="purple"
        />

        <MetricsCard
          title="CO₂ Saved"
          value={`${stats.co2Saved} T`}
          icon={<Leaf className="w-5 h-5" />}
          color="emerald"
        />

        <MetricsCard
          title="Revenue Growth"
          value={`${stats.revenueGrowth || 12}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="green"
          subtitle="vs last month"
        />
      </div>

      {/* ANALYTIC PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* UTILIZATION TREND */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Utilization Trend
          </h2>

          <div className="h-56 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
            Utilization chart coming soon
          </div>
        </div>

        {/* CO2 & COST */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Cost & Emissions Impact
          </h2>

          <div className="space-y-4 text-sm text-gray-700">
            <p className="flex justify-between">
              <span>Fuel Cost Saved</span>
              <span className="font-semibold text-amber-600">
                ₹{stats.costSaved || 0}
              </span>
            </p>
            <p className="flex justify-between">
              <span>CO₂ Reduction</span>
              <span className="font-semibold text-emerald-600">
                {stats.co2Saved} T
              </span>
            </p>
            <p className="flex justify-between">
              <span>Avg Cost / Trip</span>
              <span className="font-semibold">
                ₹{stats.avgCostPerTrip || 0}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
