import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
  {
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    /* ================= SHIPMENT DETAILS ================= */
    weight: {
      type: Number,
      required: true
    },

    volume: {
      type: Number,
      required: true
    },

    boxes: {
      type: Number,
      required: true
    },

    destination: {
      type: String,
      required: true,
      trim: true
    },

    // ✅ DISTANCE (CALCULATED BY GOOGLE MAPS API)
    distanceKm: {
      type: Number,
      required: true
    },

    // ✅ DESCRIPTION
    description: {
      type: String,
      trim: true,
      maxlength: 500
    },

    deadline: {
      type: Date
    },

    /* ================= STATUS FLOW ================= */
    status: {
      type: String,
      enum: [
        "PENDING",
        "REQUESTED",   // ✅ NEW (important)
        "BOOKED",
        "IN_TRANSIT",
        "DELIVERED"
      ],
      default: "PENDING"
    },

    /* ================= OPTIMIZATION ================= */
    optimizedOptions: [
      {
        truckId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Truck"
        },
        utilizationPercent: Number,
        score: Number
      }
    ],

    /* ================= BOOKING ================= */
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking"
    },

    isPooled: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const Shipment = mongoose.model("Shipment", shipmentSchema);
