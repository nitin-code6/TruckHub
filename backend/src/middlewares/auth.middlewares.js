import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // 1️ Get token from cookie or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Access token missing");
    }

    // 2️ Verify token
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    // 3 Get user from DB
    const user = await User.findById(decodedToken._id)
      .select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    // 4️ Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error("JWT Error:", error.message);

    throw new ApiError(
      401,
      error.name === "TokenExpiredError"
        ? "Access token expired"
        : "Unauthorized request"
    );
  }
});

export { verifyJWT };
