import { Shipment } from "../models/shipment.model.js";
import { Truck } from "../models/truck.model.js";
import { Booking } from "../models/booking.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* ================= SCORE FUNCTION ================= */
const calculateScore = ({ utilization, costPerKm, co2PerKm }) => {
  return (
    (utilization / 100) * 0.5 +
    (1 / costPerKm) * 0.25 +
    (1 / co2PerKm) * 0.25
  );
};

/* ================= OPTIMIZE SHIPMENT ================= */
const optimizeShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findOne({
    _id: req.params.shipmentId,
    warehouseId: req.user._id
  });

  if (!shipment) throw new ApiError(404, "Shipment not found");

  const fullTruckOptions = [];
  const pooledTruckOptions = [];

  const trucks = await Truck.find({ status: "AVAILABLE" });

  /* ---------- FULL TRUCK ---------- */
  for (const truck of trucks) {
    if (
      truck.maxVolume < shipment.volume ||
      truck.maxWeight < shipment.weight ||
      !truck.routeCoverage.includes(shipment.destination)
    ) continue;

    const utilization = (shipment.volume / truck.maxVolume) * 100;
    const estimatedCost = shipment.distanceKm * truck.costPerKm;

    const score = calculateScore({
      utilization,
      costPerKm: truck.costPerKm,
      co2PerKm: truck.co2PerKm
    });

    fullTruckOptions.push({
      truckId: truck._id,
      truckNumber: truck.truckNumber,
      utilization: Number(utilization.toFixed(2)),
      costPerKm: truck.costPerKm, // ✅ ADDED
      estimatedCost: Number(estimatedCost.toFixed(2)),
      distanceKm: shipment.distanceKm,
      score: Number(score.toFixed(4))
    });
  }

  /* ---------- POOLING ---------- */
  const openBookings = await Booking.find({ status: "OPEN" }).populate("truckId");

  for (const booking of openBookings) {
    const truck = booking.truckId;
    if (!truck) continue;

    const remainingVolume = truck.maxVolume - booking.totalVolumeUsed;
    if (remainingVolume < shipment.volume) continue;

    const volumeShare = shipment.volume / truck.maxVolume;
    const payableCost =
      volumeShare * shipment.distanceKm * truck.costPerKm;

    const utilizationAfterPooling =
      ((booking.totalVolumeUsed + shipment.volume) / truck.maxVolume) * 100;

    const score = calculateScore({
      utilization: utilizationAfterPooling,
      costPerKm: truck.costPerKm,
      co2PerKm: truck.co2PerKm
    });

    pooledTruckOptions.push({
      bookingId: booking._id,
      truckId: truck._id,
      truckNumber: truck.truckNumber,
      utilizationAfterPooling: Number(utilizationAfterPooling.toFixed(2)),
      costPerKm: truck.costPerKm, // ✅ ADDED
      estimatedCost: Number(payableCost.toFixed(2)),
      distanceKm: shipment.distanceKm,
      score: Number(score.toFixed(4))
    });
  }

  fullTruckOptions.sort((a, b) => b.score - a.score);
  pooledTruckOptions.sort((a, b) => b.score - a.score);

  res.status(200).json(
    new ApiResponse(200, {
      fullTruckOptions,
      pooledTruckOptions
    })
  );
});

export { optimizeShipment };
