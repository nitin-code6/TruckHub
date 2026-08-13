import { Truck } from "../models/truck.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* ================= ADD TRUCK ================= */
const addTruck = asyncHandler(async (req, res) => {
  const {
    truckNumber,
    maxWeight,
    maxVolume,
    truckType,
    currentLocation,
    routeCoverage,
    costPerKm,
    co2PerKm
  } = req.body;

  if (!truckNumber || !maxWeight || !maxVolume || !truckType || !currentLocation) {
    throw new ApiError(400, "All required fields must be provided");
  }

  const exists = await Truck.findOne({ truckNumber });
  if (exists) throw new ApiError(409, "Truck already exists");

  const truck = await Truck.create({
    dealerId: req.user._id,
    truckNumber,
    maxWeight,
    maxVolume,
    truckType,
    currentLocation,
    routeCoverage,
    costPerKm,
    co2PerKm,
    status: "AVAILABLE"
  });

  res.status(201).json(new ApiResponse(201, truck, "Truck added"));
});

/* ================= GET MY TRUCKS ================= */
const getMyTrucks = asyncHandler(async (req, res) => {
  const trucks = await Truck.find({ dealerId: req.user._id });
  res.status(200).json(new ApiResponse(200, trucks));
});

/* ================= GET TRUCK BY ID ================= */
const getTruckById = asyncHandler(async (req, res) => {
  const truck = await Truck.findOne({
    _id: req.params.truckId,
    dealerId: req.user._id
  });

  if (!truck) throw new ApiError(404, "Truck not found");
  res.status(200).json(new ApiResponse(200, truck));
});

/* ================= UPDATE TRUCK ================= */
const updateTruck = asyncHandler(async (req, res) => {
  const truck = await Truck.findOne({
    _id: req.params.truckId,
    dealerId: req.user._id
  });

  if (!truck) throw new ApiError(404, "Truck not found");
  if (truck.status !== "AVAILABLE")
    throw new ApiError(400, "Cannot update active truck");

  const updated = await Truck.findByIdAndUpdate(
    req.params.truckId,
    req.body,
    { new: true }
  );

  res.status(200).json(new ApiResponse(200, updated));
});

/* ================= DELETE TRUCK ================= */
const deleteTruck = asyncHandler(async (req, res) => {
  const truck = await Truck.findOne({
    _id: req.params.truckId,
    dealerId: req.user._id
  });

  if (!truck) throw new ApiError(404, "Truck not found");
  if (truck.status !== "AVAILABLE")
    throw new ApiError(400, "Cannot delete active truck");

  await truck.deleteOne();
  res.status(200).json(new ApiResponse(200, {}, "Truck deleted"));
});

/* ================= AVAILABLE TRUCKS ================= */
const getAvailableTrucks = asyncHandler(async (req, res) => {
  const trucks = await Truck.find({ status: "AVAILABLE" });
  res.status(200).json(new ApiResponse(200, trucks));
});

export {
  addTruck,
  getMyTrucks,
  getTruckById,
  updateTruck,
  deleteTruck,
  getAvailableTrucks
};
 