import { useEffect, useRef } from "react";
import gsap from "gsap";

const BookingDetailModal = ({ booking, onClose }) => {
  const modalRef = useRef(null);
  if (!booking) return null;

  const {
    dealerId,
    truckId,
    shipments,
    utilizationPercent,
    bookingType,
    status,
    createdAt
  } = booking;

  /* ================= GSAP MODAL ================= */
  useEffect(() => {
    gsap.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.92 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power2.out"
      }
    );
  }, []);

  return (
    <div
      ref={modalRef}
      className="w-full max-w-3xl bg-white rounded-2xl p-8 shadow-xl"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Booking Details</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* META */}
      <div className="grid md:grid-cols-2 gap-6 text-sm mb-6">
        <div>
          <p className="text-xs text-gray-400">Dealer</p>
          <p className="font-medium">{dealerId?.name}</p>
          <p className="text-xs text-gray-500">{dealerId?.email}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Truck</p>
          <p className="font-medium">
            {truckId?.truckNumber} ({truckId?.truckType})
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Booking Type</p>
          <p className="font-medium">
            {bookingType === "FULL_TRUCK" ? "Full Truck" : "Pooled"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Status</p>
          <p className="font-medium">{status.replace("_", " ")}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Utilization</p>
          <p className="font-medium">
            {utilizationPercent?.toFixed(1)}%
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Created On</p>
          <p className="font-medium">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* SHIPMENTS */}
      <div>
        <h3 className="font-semibold mb-3">Shipments</h3>

        <div className="space-y-3">
          {shipments.map((s, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-3 text-sm bg-gray-50"
            >
              <p><strong>Destination:</strong> {s.destination}</p>
              <p><strong>Weight:</strong> {s.weight} kg</p>
              <p><strong>Volume:</strong> {s.volume} m³</p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-[#3f89f9] text-white rounded-lg hover:bg-gray-900"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BookingDetailModal;
