import { Shipment } from "../models/shipment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getDistanceKm } from "../utils/map.js";
/* ================= CREATE SHIPMENT ================= */
const createShipment = asyncHandler(async (req, res) => {
  const {
    weight,
    volume,
    boxes,
    destination,
    deadline,
    description
  } = req.body;

  if (!weight || !volume || !boxes || !destination) {
    throw new ApiError(400, "All required fields must be provided");
  }

  const origin = req.user.warehouseDetails?.location;
  if (!origin) {
    throw new ApiError(400, "Warehouse location not found");
  }

  // ✅ Distance calculated ONCE
  const distanceKm = await getDistanceKm(origin, destination);

  const shipment = await Shipment.create({
    warehouseId: req.user._id,
    weight,
    volume,
    boxes,
    destination,
    description,
    deadline,
    distanceKm,
    status: "PENDING"
  });

  res
    .status(201)
    .json(new ApiResponse(201, shipment, "Shipment created successfully"));
});


/* ================= GET MY SHIPMENTS ================= */
const getMyShipments = asyncHandler(async (req, res) => {
  const shipments = await Shipment.find({
    warehouseId: req.user._id
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, shipments, "Shipments fetched"));
});

/* ================= GET SINGLE SHIPMENT ================= */
const getShipmentById = asyncHandler(async (req, res) => {
  const { shipmentId } = req.params;

  const shipment = await Shipment.findById(shipmentId);

  if (!shipment) {
    throw new ApiError(404, "Shipment not found");
  }

  if (shipment.warehouseId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized access");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, shipment, "Shipment fetched"));
});

/* ================= UPDATE SHIPMENT ================= */
const updateShipment = asyncHandler(async (req, res) => {
  const { shipmentId } = req.params;

  const shipment = await Shipment.findOne({
    _id: shipmentId,
    warehouseId: req.user._id
  });

  if (!shipment) {
    throw new ApiError(404, "Shipment not found or unauthorized");
  }

  if (shipment.status !== "PENDING") {
    throw new ApiError(
      400,
      "Shipment cannot be updated after booking or optimization"
    );
  }

  const updatedShipment = await Shipment.findByIdAndUpdate(
    shipmentId,
    req.body, // description auto updates here
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedShipment, "Shipment updated"));
});

/* ================= DELETE SHIPMENT ================= */
const deleteShipment = asyncHandler(async (req, res) => {
  const { shipmentId } = req.params;

  const shipment = await Shipment.findOne({
    _id: shipmentId,
    warehouseId: req.user._id
  });

  if (!shipment) {
    throw new ApiError(404, "Shipment not found or unauthorized");
  }

  if (shipment.status !== "PENDING") {
    throw new ApiError(
      400,
      "Shipment cannot be deleted after booking or optimization"
    );
  }

  await shipment.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Shipment deleted"));
});

/* ================= MARK OPTIMIZED ================= */
const markShipmentOptimized = asyncHandler(async (req, res) => {
  const { shipmentId } = req.params;
  const { optimizedOptions } = req.body;

  if (!Array.isArray(optimizedOptions)) {
    throw new ApiError(400, "Optimized options must be an array");
  }

  const shipment = await Shipment.findOne({
    _id: shipmentId,
    warehouseId: req.user._id
  });

  if (!shipment) {
    throw new ApiError(404, "Shipment not found");
  }

  shipment.optimizedOptions = optimizedOptions;
  shipment.status = "BOOKED";

  await shipment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, shipment, "Shipment optimized successfully"));
});

/* ================= DASHBOARD METRICS ================= */
const shipmentMetrics = asyncHandler(async (req, res) => {
  const totalShipments = await Shipment.countDocuments({
    warehouseId: req.user._id
  });

  const optimizedShipments = await Shipment.countDocuments({
    warehouseId: req.user._id,
    status: { $ne: "PENDING" }
  });

  const optimizationPercentage =
    totalShipments === 0
      ? 0
      : ((optimizedShipments / totalShipments) * 100).toFixed(2);

  return res.status(200).json(
    new ApiResponse(200, {
      totalShipments,
      optimizedShipments,
      optimizationPercentage
    })
  );
});

export {
  createShipment,
  getMyShipments,
  getShipmentById,
  updateShipment,
  deleteShipment,
  markShipmentOptimized,
  shipmentMetrics
};
