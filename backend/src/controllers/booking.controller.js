import { Shipment } from "../models/shipment.model.js";
import { Truck } from "../models/truck.model.js";
import { Booking } from "../models/booking.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* ================= CREATE BOOKING ================= */
const createBooking = asyncHandler(async (req, res) => {
  const { shipmentId } = req.params;
  const { optionType, truckId, bookingId } = req.body;

  if (!optionType) {
    throw new ApiError(400, "Booking type is required");
  }

  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) throw new ApiError(404, "Shipment not found");

  if (shipment.status !== "PENDING") {
    throw new ApiError(400, "Shipment already requested or booked");
  }

  /* ================= FULL TRUCK ================= */
  if (optionType === "FULL_TRUCK") {
    const truck = await Truck.findById(truckId);
    if (!truck || truck.status !== "AVAILABLE") {
      throw new ApiError(400, "Truck not available");
    }

    const booking = await Booking.create({
      truckId: truck._id,
      dealerId: truck.dealerId,
      bookingType: "FULL_TRUCK",
      shipments: [
        {
          shipmentId: shipment._id,
          warehouseId: shipment.warehouseId,
          volume: shipment.volume,
          weight: shipment.weight,
          destination: shipment.destination
        }
      ],
      totalVolumeUsed: shipment.volume,
      totalWeightUsed: shipment.weight,
      utilizationPercent: (shipment.volume / truck.maxVolume) * 100,
      status: "OPEN"
    });

    shipment.status = "REQUESTED";
    shipment.bookingId = booking._id;
    await shipment.save();

    return res.status(201).json(
      new ApiResponse(201, booking, "Booking request sent to dealer")
    );
  }

  /* ================= POOLING ================= */
  if (optionType === "POOLING") {
    const booking = await Booking.findById(bookingId).populate("truckId");
    if (!booking || booking.status !== "OPEN") {
      throw new ApiError(404, "Pooling booking not available");
    }

    // 🔥🔥🔥 THIS IS THE FIX 🔥🔥🔥
    if (booking.bookingType === "FULL_TRUCK") {
      booking.bookingType = "POOLING";
    }

    booking.shipments.push({
      shipmentId: shipment._id,
      warehouseId: shipment.warehouseId,
      volume: shipment.volume,
      weight: shipment.weight,
      destination: shipment.destination
    });

    booking.totalVolumeUsed += shipment.volume;
    booking.totalWeightUsed += shipment.weight;

    await booking.save();

    shipment.status = "REQUESTED";
    shipment.isPooled = true;
    shipment.bookingId = booking._id;
    await shipment.save();

    return res.status(201).json(
      new ApiResponse(201, booking, "Pooling request sent to dealer")
    );
  }

  throw new ApiError(400, "Invalid booking option");
});

/* ================= GET BOOKINGS ================= */
const getMyBookings = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === "DEALER"
      ? { dealerId: req.user._id }
      : { "shipments.warehouseId": req.user._id };

  const bookings = await Booking.find(filter)
    .populate("truckId")
    .populate("shipments.warehouseId", "name email warehouseDetails")
    .populate("shipments.shipmentId")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, bookings));
});

/* ================= DEALER ACCEPT BOOKING ================= */
const startTrip = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId)
    .populate("truckId");

  if (!booking) throw new ApiError(404, "Booking not found");

  if (booking.dealerId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  if (booking.status !== "OPEN") {
    throw new ApiError(400, "Booking not open");
  }

  booking.status = "IN_TRANSIT";
  booking.truckId.status = "EN_ROUTE";
  booking.truckId.totalTrips += 1;

  await booking.truckId.save();
  await booking.save();

  await Shipment.updateMany(
    { bookingId: booking._id },
    { status: "BOOKED" }
  );

  res.status(200).json(
    new ApiResponse(200, booking, "Booking accepted, trip started")
  );
});

/* ================= COMPLETE TRIP ================= */
const completeTrip = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.bookingId,
    dealerId: req.user._id,
    status: "IN_TRANSIT"
  }).populate("truckId");

  if (!booking) throw new ApiError(404, "Trip not found");

  booking.status = "COMPLETED";
  await booking.save();

  booking.truckId.status = "AVAILABLE";
  await booking.truckId.save();

  await Shipment.updateMany(
    { bookingId: booking._id },
    { status: "DELIVERED" }
  );

  res.status(200).json(
    new ApiResponse(200, booking, "Trip completed successfully")
  );
});

/* ================= REJECT BOOKING ================= */
const rejectBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.bookingId,
    dealerId: req.user._id,
    status: "OPEN"
  });

  if (!booking) throw new ApiError(404, "Booking not found");

  await Shipment.updateMany(
    { bookingId: booking._id },
    {
      status: "PENDING",
      bookingId: null,
      isPooled: false
    }
  );

  await Truck.findByIdAndUpdate(booking.truckId, {
    status: "AVAILABLE"
  });

  booking.status = "REJECTED";
  await booking.save();

  res.status(200).json(
    new ApiResponse(200, booking, "Booking rejected")
  );
});

export {
  createBooking,
  getMyBookings,
  startTrip,
  completeTrip,
  rejectBooking
};
