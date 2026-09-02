import { useEffect, useState } from "react";
import axios from "../../utils/axios";

const AddShipmentForm = ({ onClose, onCreated, initialData = null }) => {
  const [formData, setFormData] = useState({
    weight: "",
    volume: "",
    boxes: "",
    destination: "",
    deadline: "",
    description: "" // ✅ NEW
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= PREFILL FOR EDIT ================= */
  useEffect(() => {
    if (initialData) {
      setFormData({
        weight: initialData.weight || "",
        volume: initialData.volume || "",
        boxes: initialData.boxes || "",
        destination: initialData.destination || "",
        deadline: initialData.deadline
          ? initialData.deadline.slice(0, 10)
          : "",
        description: initialData.description || "" // ✅ NEW
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { weight, volume, boxes, destination } = formData;

    if (!weight || !volume || !boxes || !destination) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        weight: Number(weight),
        volume: Number(volume),
        boxes: Number(boxes),
        destination,
        deadline: formData.deadline || undefined,
        description: formData.description // ✅ NEW
      };

      if (initialData?._id) {
        await axios.put(`/shipments/shipment/${initialData._id}`, payload);
      } else {
        await axios.post("/shipments", payload);
      }

      onCreated && onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save shipment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white border rounded-xl px-8 py-8">
      <h2 className="text-xl font-semibold text-center mb-6">
        {initialData ? "Edit Shipment" : "Create Shipment"}
      </h2>

      {error && (
        <p className="mb-4 text-sm text-red-600 text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-sm">
        <div className="grid md:grid-cols-2 gap-5">
          {[
            ["weight", "Weight (kg)"],
            ["volume", "Volume (m³)"],
            ["boxes", "Boxes"],
            ["destination", "Destination"]
          ].map(([name, label]) => (
            <div key={name}>
              <label className="block mb-1 font-medium">
                {label}
              </label>
              <input
                type={name === "destination" ? "text" : "number"}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        {/* ✅ DESCRIPTION BOX */}
        <div>
          <label className="block mb-1 font-medium">
            Shipment Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Example: Fragile items, handle with care, stackable cartons..."
            className="w-full px-4 py-2 border rounded-md resize-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Delivery Deadline
          </label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div className="flex justify-center gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60"
          >
            {loading
              ? "Saving..."
              : initialData
              ? "Update Shipment"
              : "Save Shipment"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddShipmentForm;
