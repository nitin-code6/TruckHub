import {
  Truck,
  MapPin,
  Package,
  Activity,
  Phone,
  Mail,
  IndianRupee
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import axios from "../../utils/axios";
import gsap from "gsap";

const statusStyles = {
  OPEN: "bg-yellow-100 text-yellow-700",
  IN_TRANSIT: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700"
};

const BookingCard = ({ booking, refresh }) => {
  const cardRef = useRef(null);

  const truck = booking.truckId;
  const shipments = booking.shipments || [];
  const warehouse = shipments[0]?.warehouseId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalWeight = shipments.reduce((s, x) => s + (x.weight || 0), 0);
  const totalVolume = shipments.reduce((s, x) => s + (x.volume || 0), 0);

  const estimatedDistance = 1000;
  const earnings = estimatedDistance * (truck?.costPerKm || 0);

  /* ================= GSAP ENTRY ================= */
  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out"
      }
    );
  }, []);

  /* ================= ACTIONS ================= */
  const acceptBooking = async () => {
    try {
      setLoading(true);
      await axios.patch(`/bookings/${booking._id}/start`);
      refresh && refresh();
    } catch {
      setError("Failed to accept booking");
    } finally {
      setLoading(false);
    }
  };

  const rejectBooking = async () => {
    if (!window.confirm("Reject this booking?")) return;
    try {
      setLoading(true);
      await axios.patch(`/bookings/${booking._id}/reject`);
      refresh && refresh();
    } catch {
      setError("Failed to reject booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={cardRef}
      className="
        bg-white border border-gray-200 rounded-2xl p-6
        shadow-sm hover:shadow-xl
        transition-all duration-300
        hover:-translate-y-1
      "
    >
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <p className="text-xs text-gray-400">Booking ID</p>
          <p className="text-[15px] font-semibold text-gray-900">
            #{booking._id.slice(-6)}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[booking.status]}`}
        >
          {booking.status.replace("_", " ")}
        </span>
      </div>

      {/* ================= BASIC INFO ================= */}
      <div className="space-y-2 text-[15px] text-gray-700">
        <p className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#3f89f9]" />
          <span className="font-medium">Truck:</span>
          {truck?.truckNumber}
        </p>

        <p className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#3f89f9]" />
          <span className="font-medium">Booking Type:</span>
          {booking.bookingType.replace("_", " ")}
        </p>
      </div>

      {/* ================= WAREHOUSE ================= */}
      {warehouse && (
        <div className="mt-5 text-[15px] space-y-1 text-gray-700">
          <p className="text-xs text-gray-400">Warehouse Details</p>

          <p>
            <span className="font-medium">Name:</span> {warehouse.name}
          </p>

          <p>
            <span className="font-medium">Company:</span>{" "}
            {warehouse.warehouseDetails?.companyName}
          </p>

          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            {warehouse.email}
          </p>

          {warehouse.warehouseDetails?.phone && (
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              {warehouse.warehouseDetails.phone}
            </p>
          )}
        </div>
      )}

      {/* ================= ROUTE ================= */}
      <div className="mt-5 text-[15px] space-y-1 text-gray-700">
        <p className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#3f89f9]" />
          <span className="font-medium">Pickup:</span>
          {truck?.currentLocation}
        </p>

        <p className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#3f89f9]" />
          <span className="font-medium">Drop:</span>
          {shipments.map(s => s.destination).join(", ")}
        </p>
      </div>

      {/* ================= SHIPMENT ================= */}
      <div className="mt-5 text-[15px] text-gray-700">
        <p className="flex items-center gap-2">
          <Package className="w-4 h-4 text-[#3f89f9]" />
          <span className="font-medium">Shipments:</span>
          {shipments.length}
        </p>
        <p><b>Weight:</b> {totalWeight} kg</p>
        <p><b>Volume:</b> {totalVolume} m³</p>
      </div>

      {/* ================= EARNINGS ================= */}
      <div className="mt-5 bg-blue-50 rounded-xl p-4 text-center">
        <IndianRupee className="w-4 h-4 mx-auto mb-1 text-[#3f89f9]" />
        <p className="text-sm text-gray-500">Estimated Earnings</p>
        <p className="text-lg font-semibold text-gray-900">
          ₹{earnings}
        </p>
      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <p className="text-red-600 text-sm mt-3">{error}</p>
      )}

      {/* ================= ACTIONS ================= */}
      {booking.status === "OPEN" && (
        <div className="mt-6 flex gap-3">
          <button
            disabled={loading}
            onClick={acceptBooking}
            className="
              flex-1 py-2.5 rounded-lg
              text-base font-semibold
              bg-green-600 hover:bg-green-700
              text-white transition
            "
          >
            Accept
          </button>

          <button
            disabled={loading}
            onClick={rejectBooking}
            className="
              flex-1 py-2.5 rounded-lg
              text-base font-semibold
              border border-red-500 text-red-600
              hover:bg-red-50 transition
            "
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingCard;
