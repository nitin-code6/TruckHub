
import { Truck } from "../models/truck.model.js";
import { Booking } from "../models/booking.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


/* ================= DEALER DASHBOARD ================= */
export const dealerDashboard = asyncHandler(async (req, res) => {
  const dealerId = req.user._id;

  const totalTrucks = await Truck.countDocuments({ dealerId });

  const activeTrips = await Booking.countDocuments({
    dealerId,
    status: "IN_TRANSIT"
  });

  const completedTrips = await Booking.countDocuments({
    dealerId,
    status: "COMPLETED"
  });

  const earningsAgg = await Booking.aggregate([
    { $match: { dealerId } },
    { $unwind: "$shipments" },
    {
      $group: {
        _id: null,
        total: { $sum: "$shipments.cost" }
      }
    }
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      totalTrucks,
      activeTrips,
      completedTrips,
      totalEarnings: earningsAgg[0]?.total || 0
    })
  );
});

/* ================= DEALER ANALYTICS ================= */
export const dealerAnalytics = asyncHandler(async (req, res) => {
  const dealerId = req.user._id;

  const totalTrips = await Booking.countDocuments({
    dealerId,
    status: "COMPLETED"
  });

  const utilizationAgg = await Booking.aggregate([
    { $match: { dealerId, status: "COMPLETED" } },
    {
      $group: {
        _id: null,
        avgUtilization: { $avg: "$utilizationPercent" }
      }
    }
  ]);

  // Simple CO2 logic (you can refine later)
  const co2Saved = totalTrips * 0.15; // tons

  res.status(200).json(
    new ApiResponse(200, {
      totalTrips,
      avgUtilization: utilizationAgg[0]?.avgUtilization || 0,
      co2Saved
    })
  );
});
