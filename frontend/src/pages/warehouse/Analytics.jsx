import { useEffect, useRef, useState } from "react";
import axios from "../../utils/axios";
import gsap from "gsap";
import MetricsCard from "../../component/warehouse/MetricsCard";
import {
  Activity,
  CheckCircle,
  Package,
  Truck,
  Leaf
} from "lucide-react";

const Analytics = () => {
  const pageRef = useRef(null);
  const sectionsRef = useRef([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("/analytics/warehouse");
        setAnalytics(res.data.data);
      } catch (err) {
        console.error("Analytics fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  useEffect(() => {
    gsap.fromTo(
      pageRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" }
    );
  }, []);

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
    return <p className="text-center mt-20 text-gray-500">Loading analytics...</p>;
  }

  return (
    <div ref={pageRef} className="space-y-14 ">

      {/* HEADER */}
      <div ref={(el) => (sectionsRef.current[0] = el)}>
        <h1 className="text-3xl font-bold text-gray-900">
          Warehouse Analytics
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Performance trends & efficiency insights
        </p>
      </div>

      {/* METRICS */}
      <div
        ref={(el) => (sectionsRef.current[1] = el)}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <MetricsCard
          title="Avg Utilization"
          value={`${analytics.avgUtilization}%`}
          icon={Activity}
          color="blue"
        />

        <MetricsCard
          title="Pooling Success"
          value={`${analytics.poolingSuccessRate}%`}
          icon={CheckCircle}
          color="green"
        />

        <MetricsCard
          title="Completed Trips"
          value={analytics.totalTrips}
          icon={Truck}
          color="blue"
        />

        <MetricsCard
          title="Cost Saved"
          value={`₹${analytics.totalCostSaved}`}
          icon={Package}
          color="amber"
        />

        <MetricsCard
          title="CO₂ Reduced"
          value={`${analytics.totalCo2Saved} kg`}
          icon={Leaf}
          color="emerald"
        />
      </div>

      {/* PANELS */}
      <div
        ref={(el) => (sectionsRef.current[2] = el)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <AnimatedPanel
          title="Shipment Trends"
          accent="blue"
        >
          Pending → In Transit → Delivered
        </AnimatedPanel>

        <AnimatedPanel
          title="Cost & CO₂ Trends"
          accent="emerald"
        >
          Cost optimization & emission reduction over time
        </AnimatedPanel>
      </div>
    </div>
  );
};

/* PANEL */
const AnimatedPanel = ({ title, children, accent }) => {
  const ref = useRef(null);

  const accentStyle =
    accent === "emerald"
      ? "border-emerald-300 bg-emerald-50/40"
      : "border-[#3f89f9]/30 bg-[#3f89f9]/5";

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );
  }, []);

  return (
    <div
      ref={ref}
      className={`rounded-2xl border p-6 ${accentStyle}`}
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>

      <div className="h-64 rounded-xl bg-white flex items-center justify-center text-gray-400 text-sm">
        {children || "Chart coming soon"}
      </div>
    </div>
  );
};

export default Analytics;
