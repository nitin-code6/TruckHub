import { Bookmark } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const statusStyles = {
  OPEN: "bg-yellow-100 text-yellow-700",
  IN_TRANSIT: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700"
};

const BookingCard = ({ booking, onView }) => {
  const cardRef = useRef(null);
  if (!booking) return null;

  const {
    _id,
    bookingType,
    utilizationPercent,
    status,
    createdAt,
    truckId,
    dealerId,
    shipments
  } = booking;

  /* ================= GSAP ENTRY ================= */
  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out"
      }
    );
  }, []);

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-2xl border shadow-sm hover:shadow-lg
                 transition-all duration-300 hover:-translate-y-1
                 p-5 flex flex-col justify-between"
    >
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700">
            {dealerId?.name?.charAt(0) || "D"}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              {dealerId?.name || "Dealer"}
            </p>
            <p className="text-xs text-gray-500">
              Booking ID · {_id.slice(0, 8)}...
            </p>
          </div>
        </div>

        <Bookmark className="w-4 h-4 text-gray-400" />
      </div>

      {/* TRUCK */}
      <div className="mt-4">
        <h3 className="text-base font-semibold text-gray-900">
          Truck {truckId?.truckNumber}
        </h3>

        <div className="flex gap-2 mt-2">
          <span className="px-2 py-1 text-xs rounded-md bg-gray-100">
            {bookingType === "FULL_TRUCK" ? "Full Truck" : "Pooled"}
          </span>

          <span
            className={`px-2 py-1 text-xs rounded-md font-medium ${statusStyles[status]}`}
          >
            {status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
        <div>
          <p className="text-xs text-gray-400">Utilization</p>
          <p className="font-semibold">
            {utilizationPercent?.toFixed(1)}%
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Shipments</p>
          <p className="font-semibold">{shipments?.length}</p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-5 pt-4 border-t flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {new Date(createdAt).toLocaleDateString()}
        </p>

        <button
          onClick={() => onView && onView(booking)}
          className="text-sm font-semibold text-white bg-[#3f89f9]
                     px-4 py-1.5 rounded-lg hover:bg-gray-900 transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default BookingCard;
