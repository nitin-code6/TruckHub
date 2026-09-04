import { useState } from "react";
import axios from "../../utils/axios";

const CITY_OPTIONS = [
  "DELHI",
  "MUMBAI",
  "BANGALORE",
  "CHENNAI",
  "HYDERABAD",
  "KOLKATA",
  "PUNE",
  "AHMEDABAD",
  "JAIPUR",
  "CHANDIGARH"
];

const AddTruckForm = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    truckNumber: "",
    truckType: "",
    maxWeight: "",
    maxVolume: "",
    currentLocation: "",
    routeCoverage: [],
    costPerKm: "",
    co2PerKm: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleCity = (city) => {
    setFormData(prev => ({
      ...prev,
      routeCoverage: prev.routeCoverage.includes(city)
        ? prev.routeCoverage.filter(c => c !== city)
        : [...prev.routeCoverage, city]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await axios.post("/trucks", {
        ...formData,
        maxWeight: Number(formData.maxWeight),
        maxVolume: Number(formData.maxVolume),
        costPerKm: Number(formData.costPerKm),
        co2PerKm: Number(formData.co2PerKm)
      });

      onCreated?.();
      onClose?.();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add truck");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl p-8">
      {/* TITLE */}
      <h2 className="text-xl font-semibold text-center mb-6">
        Add Truck
      </h2>

      {error && (
        <p className="text-red-600 text-sm mb-4 text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ================= GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Truck Number */}
          <div>
            <label className="text-sm font-medium">Truck Number</label>
            <input
              name="truckNumber"
              value={formData.truckNumber}
              onChange={handleChange}
              placeholder="DL-01-AB-1234"
              className="w-full mt-1 border px-3 py-2 rounded-lg"
            />
          </div>

          {/* Truck Type */}
          <div>
            <label className="text-sm font-medium">Truck Type</label>
            <select
              name="truckType"
              value={formData.truckType}
              onChange={handleChange}
              className="w-full mt-1 border px-3 py-2 rounded-lg bg-white"
            >
              <option value="">Select Truck Type</option>
              <option value="MINI_TRUCK">Mini Truck</option>
              <option value="14FT_TRUCK">14FT Truck</option>
              <option value="20FT_TRUCK">20FT Truck</option>
              <option value="32FT_TRUCK">32FT Truck</option>
              <option value="CONTAINER_TRUCK">Container Truck</option>
              <option value="REFRIGERATED_TRUCK">Refrigerated Truck</option>
              <option value="TANKER">Tanker</option>
              <option value="TRAILER">Trailer</option>
            </select>
          </div>

          {/* Max Weight */}
          <div>
            <label className="text-sm font-medium">Max Weight (kg)</label>
            <input
              name="maxWeight"
              type="number"
              value={formData.maxWeight}
              onChange={handleChange}
              className="w-full mt-1 border px-3 py-2 rounded-lg"
            />
          </div>

          {/* Max Volume */}
          <div>
            <label className="text-sm font-medium">Max Volume (m³)</label>
            <input
              name="maxVolume"
              type="number"
              value={formData.maxVolume}
              onChange={handleChange}
              className="w-full mt-1 border px-3 py-2 rounded-lg"
            />
          </div>

          {/* Current Location */}
          <div>
            <label className="text-sm font-medium">Current Location</label>
            <input
              name="currentLocation"
              value={formData.currentLocation}
              onChange={handleChange}
              placeholder="DELHI"
              className="w-full mt-1 border px-3 py-2 rounded-lg"
            />
          </div>

          {/* Cost / km */}
          <div>
            <label className="text-sm font-medium">Cost per km (₹)</label>
            <input
              name="costPerKm"
              type="number"
              value={formData.costPerKm}
              onChange={handleChange}
              className="w-full mt-1 border px-3 py-2 rounded-lg"
            />
          </div>

          {/* CO2 / km */}
          <div>
            <label className="text-sm font-medium">CO₂ per km (kg)</label>
            <input
              name="co2PerKm"
              type="number"
              value={formData.co2PerKm}
              onChange={handleChange}
              className="w-full mt-1 border px-3 py-2 rounded-lg"
            />
          </div>
        </div>

        {/* ================= ROUTE COVERAGE ================= */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Route Coverage (Select Multiple)
          </label>

          <div className="flex flex-wrap gap-2">
            {CITY_OPTIONS.map(city => (
              <button
                type="button"
                key={city}
                onClick={() => toggleCity(city)}
                className={`px-3 py-1.5 rounded-full text-xs border transition
                  ${
                    formData.routeCoverage.includes(city)
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700"
                  }
                `}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-center gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            {loading ? "Saving..." : "Save Truck"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTruckForm;
