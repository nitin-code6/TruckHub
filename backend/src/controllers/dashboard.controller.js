import { Shipment } from "../models/shipment.model.js";
import { Truck } from "../models/truck.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* =====================================================
   WAREHOUSE DASHBOARD (REAL-TIME)
===================================================== */
const getWarehouseDashboard = asyncHandler(async (req, res) => {
  const [
    pendingShipments,
    inTransitShipments,
    deliveredShipments,
    availableTrucks,
    delayedShipments
  ] = await Promise.all([
    Shipment.countDocuments({ status: "PENDING" }),
    Shipment.countDocuments({ status: "IN_TRANSIT" }),
    Shipment.countDocuments({ status: "DELIVERED" }),
    Truck.countDocuments({ status: "AVAILABLE" }),
    Shipment.find({ delayed: true })
      .sort({ updatedAt: -1 })
      .limit(5)
  ]);

  const dashboardData = {
    shipments: {
      pending: pendingShipments,
      inTransit: inTransitShipments,
      delivered: deliveredShipments
    },
    trucks: {
      available: availableTrucks
    },
    delayedShipments
  };

  return res.status(200).json(
    new ApiResponse(200, dashboardData, "Dashboard data fetched")
  );
});

export { getWarehouseDashboard };
