import {
  Truck,
  Package,
  Activity,
  CheckCircle,
  Play
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "../../utils/axios";
import gsap from "gsap";

const statusPill = {
  OPEN: "bg-yellow-100 text-yellow-700",
  IN_TRANSIT: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700"
};

const TripCard = ({ booking, onUpdate }) => {
  const cardRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const truck = booking.truckId;
  const shipments = booking.shipments || [];

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );
  }, []);

  const startTrip = async () => {
    try {
      setLoading(true);
      await axios.patch(`/bookings/${booking._id}/start`);
      onUpdate();
    } finally {
      setLoading(false);
    }
  };

  const completeTrip = async () => {
    try {
      setLoading(true);
      await axios.patch(`/bookings/${booking._id}/complete`);
      onUpdate();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={cardRef}
      className="
        bg-white
        rounded-2xl
        border border-gray-200
        p-6
        shadow-sm
        hover:shadow-lg
        transition
        cursor-pointer
      "
      onMouseEnter={() =>
        gsap.to(cardRef.current, { scale: 1.02, duration: 0.25 })
      }
      onMouseLeave={() =>
        gsap.to(cardRef.current, { scale: 1, duration: 0.25 })
      }
    >
      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs text-gray-400">Trip ID</p>
          <p className="font-semibold text-lg text-black">
            #{booking._id.slice(-6)}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusPill[booking.status]}`}
        >
          {booking.status.replace("_", " ")}
        </span>
      </div>

      {/* TRUCK */}
      <div className="space-y-3 text-[15px] text-gray-700">
        <p className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#3f89f9]" />
          <span className="font-medium text-black">Truck:</span>
          {truck?.truckNumber}
        </p>

        <p className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#3f89f9]" />
          <span className="font-medium text-black">Type:</span>
          {booking.bookingType.replace("_", " ")}
        </p>

        <p className="flex items-center gap-2">
          <Package className="w-4 h-4 text-[#3f89f9]" />
          <span className="font-medium text-black">Shipments:</span>
          {shipments.length}
        </p>
      </div>

      {/* UTILIZATION */}
      <div className="mt-5 bg-gray-50 rounded-xl p-4 text-center">
        <p className="text-xs text-gray-400 mb-1">
          Utilization
        </p>
        <p className="text-2xl font-bold text-black">
          {booking.utilizationPercent.toFixed(1)}%
        </p>
      </div>

      {/* ACTIONS */}
      <div className="mt-6 flex gap-3">
        {booking.status === "OPEN" && (
          <button
            disabled={loading}
            onClick={startTrip}
            className="
              flex-1
              flex items-center justify-center gap-2
              py-2.5
              rounded-lg
              bg-[#3f89f9]
              text-white
              font-semibold
              hover:bg-[#2f6fe0]
              transition
            "
          >
            <Play className="w-4 h-4" />
            Start Trip
          </button>
        )}

        {booking.status === "IN_TRANSIT" && (
          <button
            disabled={loading}
            onClick={completeTrip}
            className="
              flex-1
              flex items-center justify-center gap-2
              py-2.5
              rounded-lg
              bg-[#3f89f9]
              text-white
              font-semibold
              hover:bg-[#2f6fe0]
              transition
            "
          >
            <CheckCircle className="w-4 h-4" />
            Complete Trip
          </button>
        )}
      </div>
    </div>
  );
};

export default TripCard;
