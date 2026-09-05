import {
  X,
  Pencil,
  Trash2,
  Truck,
  MapPin,
  IndianRupee,
  Leaf
} from "lucide-react";
import { useState } from "react";
import axios from "../../utils/axios";

const statusStyles = {
  AVAILABLE: "bg-green-100 text-green-700",
  BOOKED: "bg-yellow-100 text-yellow-700",
  EN_ROUTE: "bg-blue-100 text-blue-700"
};

const TruckDetailsModal = ({ truck, onClose, onDelete, onUpdated }) => {
  const canModify = truck.status === "AVAILABLE";

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    truckNumber: truck.truckNumber || "",
    currentLocation: truck.currentLocation || "",
    maxWeight: truck.maxWeight || "",
    maxVolume: truck.maxVolume || "",
    routeCoverage: (truck.routeCoverage || []).join(", "),
    costPerKm: truck.costPerKm || "",
    co2PerKm: truck.co2PerKm || ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!canModify) {
      setError("This truck cannot be edited while booked or en route.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        ...form,
        maxWeight: Number(form.maxWeight),
        maxVolume: Number(form.maxVolume),
        costPerKm: Number(form.costPerKm),
        co2PerKm: Number(form.co2PerKm),
        routeCoverage: form.routeCoverage
          .split(",")
          .map((s) => s.trim().toUpperCase())
      };

      const res = await axios.put(`/trucks/${truck._id}`, payload);
      onUpdated && onUpdated(res.data.data || res.data);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!canModify) return;
    if (!window.confirm("Delete this truck?")) return;

    try {
      setLoading(true);
      await axios.delete(`/trucks/${truck._id}`);
      onDelete && onDelete(truck._id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* MODAL */}
      <div className="relative w-full max-w-md bg-white rounded-2xl border shadow-xl p-6">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs text-gray-400 uppercase">Truck Number</p>
            <h2 className="text-lg font-semibold">{truck.truckNumber}</h2>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[truck.status]}`}
            >
              {truck.status}
            </span>

            {canModify && (
              <>
                <button
                  onClick={() => setEditing((s) => !s)}
                  className="p-1.5 rounded-md hover:bg-gray-100"
                >
                  <Pencil className="w-4 h-4 text-gray-600" />
                </button>

                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded-md hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* VIEW MODE */}
        {!editing && (
          <>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span className="font-medium">Type:</span>
                {truck.truckType.replaceAll("_", " ")}
              </p>

              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Location:</span>
                {truck.currentLocation}
              </p>

              <p>
                <span className="font-medium">Capacity:</span>{" "}
                {truck.maxWeight} kg • {truck.maxVolume} m³
              </p>

              {!canModify && (
                <p className="text-xs text-orange-600 mt-2">
                  This truck cannot be edited or deleted while {truck.status.toLowerCase()}.
                </p>
              )}
            </div>
          </>
        )}

        {/* EDIT MODE */}
        {editing && (
          <div className="space-y-3 text-sm">
            <input
              name="truckNumber"
              value={form.truckNumber}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />

            <input
              name="currentLocation"
              value={form.currentLocation}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                name="maxWeight"
                value={form.maxWeight}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
                placeholder="Max Weight"
              />
              <input
                name="maxVolume"
                value={form.maxVolume}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
                placeholder="Max Volume"
              />
            </div>

            <input
              name="routeCoverage"
              value={form.routeCoverage}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="DELHI, MUMBAI"
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                name="costPerKm"
                value={form.costPerKm}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
                placeholder="Cost / km"
              />
              <input
                name="co2PerKm"
                value={form.co2PerKm}
                onChange={handleChange}
                className="border px-3 py-2 rounded"
                placeholder="CO₂ / km"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* METRICS */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Metric label="Cost / km" value={`₹${truck.costPerKm}`} />
          <Metric label="CO₂ / km" value={`${truck.co2PerKm} kg`} />
          <Metric label="Total Trips" value={truck.totalTrips} />
          <Metric label="CO₂ Saved" value={`${truck.totalCo2Saved} kg`} />
        </div>
      </div>
    </div>
  );
};

const Metric = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-4 text-center">
    <p className="text-xs text-gray-400">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

export default TruckDetailsModal;
