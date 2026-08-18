import { Booking } from "../models/booking.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* =====================================================
   WAREHOUSE ANALYTICS (HISTORICAL)
===================================================== */
const getWarehouseAnalytics = asyncHandler(async (req, res) => {
  const completedBookings = await Booking.find({
    status: "COMPLETED"
  });

  const totalTrips = completedBookings.length;

  let totalUtilization = 0;
  let pooledTrips = 0;
  let totalCostSaved = 0;
  let totalCo2Saved = 0;

  completedBookings.forEach((b) => {
    totalUtilization += b.utilizationPercent || 0;

    if (b.bookingType === "POOLING") pooledTrips += 1;

    // dummy formula (replace later)
    totalCostSaved += 1500;
    totalCo2Saved += 40;
  });

  const analyticsData = {
    avgUtilization: totalTrips
      ? (totalUtilization / totalTrips).toFixed(1)
      : 0,

    poolingSuccessRate: totalTrips
      ? ((pooledTrips / totalTrips) * 100).toFixed(1)
      : 0,

    totalTrips,
    totalCostSaved,
    totalCo2Saved
  };

  return res.status(200).json(
    new ApiResponse(200, analyticsData, "Analytics data fetched")
  );
});

export { getWarehouseAnalytics };
