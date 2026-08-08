import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"]
    },

    role: {
      type: String,
      enum: ["WAREHOUSE", "DEALER"],
      required: true
    },

    profilePhoto: {
      type: String, // image URL
      default: null
    },

    /* ================= WAREHOUSE DETAILS ================= */
    warehouseDetails: {
      companyName: {
        type: String
      },
      managerName: {
        type: String
      },
      location: {
        type: String
      },

    },

    /* ================= DEALER DETAILS ================= */
  dealerDetails: {
    truckTypes: {
      type: [String],
      enum: [
        "MINI_TRUCK",
        "14FT_TRUCK",
        "20FT_TRUCK",
        "32FT_TRUCK",
        "CONTAINER_TRUCK",
        "REFRIGERATED_TRUCK",
        "TANKER",
        "TRAILER"
      ]
    },
    serviceAreas: [
      {
        type: String,
        trim: true,
        uppercase: true
      }
    ]
  },

    refreshToken: {
      type: String
    }
  },
  { timestamps: true }
);

/* ================= PASSWORD HASH ================= */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );
};

export const User = mongoose.model("User", userSchema);
