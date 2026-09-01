import { Pencil, Trash2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-700",
  REQUESTED: "bg-orange-100 text-orange-700",
  BOOKED: "bg-green-100 text-green-700",
  IN_TRANSIT: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-gray-200 text-gray-700"
};

const ShipmentCard = ({ shipment, onDeleted, onEdit, onView }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const { _id, destination, status, weight, volume, boxes } = shipment;

  const isPending = status === "PENDING";
  const isRequested = status === "REQUESTED";

  /* ================= GSAP ENTRY ================= */
  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out"
      }
    );
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!window.confirm("Delete this shipment?")) return;

    try {
      await axios.delete(`/shipments/shipment/${_id}`);
      onDeleted(_id);
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-2xl border shadow-sm p-5 flex flex-col justify-between
                 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* ================= HEADER ================= */}
      <div className="flex justify-between mb-4">
        <div>
          <p className="text-xs text-gray-400">Shipment ID</p>
          <h3 className="font-semibold text-sm">
            {_id.slice(0, 8)}...
          </h3>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
        >
          {status.replace("_", " ")}
        </span>
      </div>

      {/* ================= BODY ================= */}
      <div className="space-y-2 text-sm">
        <p><strong>Destination:</strong> {destination}</p>
        <p><strong>Weight:</strong> {weight} kg</p>
        <p><strong>Volume:</strong> {volume} m³</p>
        <p><strong>Boxes:</strong> {boxes}</p>
      </div>

      {/* ================= REQUEST INFO ================= */}
      {isRequested && (
        <div className="mt-3 flex items-center gap-2 text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
          <Clock size={14} />
          Waiting for dealer approval
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <div className="pt-4 border-t flex justify-between items-center mt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onView(shipment)}
            className="text-blue-600 text-sm hover:underline"
          >
            View Details →
          </button>

          {isPending && (
            <>
              <button
                onClick={() => onEdit(shipment)}
                className="text-gray-600 hover:text-blue-600 transition"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={handleDelete}
                className="text-gray-600 hover:text-red-600 transition"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>

        {isPending && (
          <button
            onClick={() => navigate(`/warehouse/optimize/${_id}`)}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs
                       hover:bg-blue-700 transition"
          >
            Optimize
          </button>
        )}
      </div>
    </div>
  );
};

export default ShipmentCard;
