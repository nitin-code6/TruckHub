import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    truckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      required: true
    },

    dealerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    shipments: [
      {
        shipmentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Shipment"
        },
        warehouseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        volume: Number,
        weight: Number,
        destination: String
      }
    ],

    totalVolumeUsed: { type: Number, default: 0 },
    totalWeightUsed: { type: Number, default: 0 },
    utilizationPercent: { type: Number, default: 0 },

    bookingType: {
      type: String,
      enum: ["FULL_TRUCK", "POOLING"],
      required: true
    },

    status: {
      type: String,
      enum: ["OPEN", "IN_TRANSIT", "COMPLETED", "REJECTED"],
      default: "OPEN"
    }
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
