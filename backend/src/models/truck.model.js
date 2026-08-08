import mongoose from "mongoose";

const truckSchema = new mongoose.Schema(
  {
    dealerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    truckNumber: {
      type: String,
      required: true,
      unique: true
    },

    /* ================= CAPACITY ================= */
    maxWeight: {
      type: Number,
      required: true
    },

    maxVolume: {
      type: Number,
      required: true
    },

    /* ================= TRUCK TYPE ================= */
    truckType: {
      type: String,
      enum: [
        "MINI_TRUCK",
        "14FT_TRUCK",
        "20FT_TRUCK",
        "32FT_TRUCK",
        "CONTAINER_TRUCK",
        "REFRIGERATED_TRUCK",
        "TANKER",
        "TRAILER"
      ],
      required: true
    },

    /* ================= LOCATION ================= */
    currentLocation: {
      type: String,
      required: true
    },

    routeCoverage: [
      {
        type: String
      }
    ],

    /* ================= COST & EMISSIONS ================= */
    costPerKm: {
      type: Number,
      required: true
    },

    co2PerKm: {
      type: Number,
      required: true
    },

    /* ================= STATUS ================= */
    status: {
      type: String,
      enum: ["AVAILABLE", "BOOKED", "EN_ROUTE"],
      default: "AVAILABLE"
    },

    /* ================= ANALYTICS ================= */
    totalTrips: {
      type: Number,
      default: 0
    },

    totalCo2Saved: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export const Truck = mongoose.model("Truck", truckSchema);
