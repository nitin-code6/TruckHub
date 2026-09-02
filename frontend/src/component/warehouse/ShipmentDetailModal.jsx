import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { X } from "lucide-react";

const ShipmentDetailModal = ({ shipmentId, onClose }) => {
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShipmentDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/shipments/shipment/${shipmentId}`);
        setShipment(res.data.data);
      } catch (err) {
        setError("Failed to load shipment details");
      } finally {
        setLoading(false);
      }
    };

    if (shipmentId) {
      fetchShipmentDetails();
    }
  }, [shipmentId]);

  const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-700",
    OPTIMIZED: "bg-blue-100 text-blue-700",
    BOOKED: "bg-green-100 text-green-700",
    IN_TRANSIT: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-gray-200 text-gray-700"
  };

  return (
    <div className="w-full max-w-2xl bg-white border rounded-xl px-8 py-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Shipment Details</h2>

      </div>

      {loading && (
        <p className="text-center text-gray-500">Loading details...</p>
      )}

      {error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {!loading && shipment && (
        <div className="space-y-6">

          {/* ================= HEADER INFO ================= */}
          <div className="pb-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-400">Shipment ID</p>
                <h3 className="text-lg font-semibold">{shipment._id}</h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[shipment.status]}`}
              >
                {shipment.status.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* ================= MAIN DETAILS ================= */}
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-1">Weight</p>
              <p className="font-medium">{shipment.weight} kg</p>
            </div>

            <div>
              <p className="text-gray-400 text-xs mb-1">Volume</p>
              <p className="font-medium">{shipment.volume} m³</p>
            </div>

            <div>
              <p className="text-gray-400 text-xs mb-1">Number of Boxes</p>
              <p className="font-medium">{shipment.boxes}</p>
            </div>

            <div>
              <p className="text-gray-400 text-xs mb-1">Destination</p>
              <p className="font-medium">{shipment.destination}</p>
            </div>

            {shipment.deadline && (
              <div>
                <p className="text-gray-400 text-xs mb-1">Delivery Deadline</p>
                <p className="font-medium">
                  {new Date(shipment.deadline).toLocaleDateString()}
                </p>
              </div>
            )}

            <div>
              <p className="text-gray-400 text-xs mb-1">Created On</p>
              <p className="font-medium">
                {new Date(shipment.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* ================= DESCRIPTION ================= */}
          {shipment.description ? (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-xs text-gray-400 mb-1">
                Shipment Description
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {shipment.description}
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg border text-sm text-gray-500 italic">
              No description provided for this shipment.
            </div>
          )}

          {/* ================= OPTIMIZATION DETAILS ================= */}
          {shipment.optimizedOptions?.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-semibold mb-3">
                Optimization Details
              </p>
              <div className="text-xs space-y-2">
                {shipment.optimizedOptions.map((option, idx) => (
                  <div key={idx} className="bg-white p-2 rounded">
                    <p className="font-medium">
                      Truck ID: {option.truckId || "Unassigned"}
                    </p>
                    <p>Utilization: {option.utilizationPercent}%</p>
                    <p>Score: {option.score}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= FOOTER ================= */}
          <div className="pt-6 border-t flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentDetailModal;
