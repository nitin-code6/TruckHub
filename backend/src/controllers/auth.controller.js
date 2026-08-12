import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* ================= TOKEN GENERATOR ================= */
const generateTokens = async (userId) => {
  const user = await User.findById(userId);

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

/* ================= REGISTER ================= */
const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    role,
    warehouseDetails,
    dealerDetails,
    profilePhoto // optional URL from frontend
  } = req.body;

  // If frontend sent warehouseDetails/dealerDetails as JSON strings (FormData), parse them
  let parsedWarehouseDetails = warehouseDetails;
  let parsedDealerDetails = dealerDetails;

  try {
    if (typeof warehouseDetails === "string" && warehouseDetails.trim()) {
      parsedWarehouseDetails = JSON.parse(warehouseDetails);
    }
  } catch (err) {
    parsedWarehouseDetails = undefined;
  }

  try {
    if (typeof dealerDetails === "string" && dealerDetails.trim()) {
      parsedDealerDetails = JSON.parse(dealerDetails);
    }
  } catch (err) {
    parsedDealerDetails = undefined;
  }

  // Normalize dealerDetails: accept JSON strings, comma-separated lists or arrays
  if (parsedDealerDetails) {
    // truckTypes may come as CSV string
    if (parsedDealerDetails.truckTypes && typeof parsedDealerDetails.truckTypes === "string") {
      parsedDealerDetails.truckTypes = parsedDealerDetails.truckTypes
        .split(/\s*,\s*/)
        .filter(Boolean);
    }

    // serviceAreas may come as CSV string
    if (parsedDealerDetails.serviceAreas && typeof parsedDealerDetails.serviceAreas === "string") {
      parsedDealerDetails.serviceAreas = parsedDealerDetails.serviceAreas
        .split(/\s*,\s*/)
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);
    }
  }

  if (!name || !email || !password || !role) {
    throw new ApiError(400, "All required fields must be provided");
  }

  if (!phone) {
    throw new ApiError(400, "Phone number is required");
  }

  // role-based validation
  if (role === "WAREHOUSE") {
    if (
      !parsedWarehouseDetails?.companyName ||
      !parsedWarehouseDetails?.managerName ||
      !parsedWarehouseDetails?.location
    ) {
      throw new ApiError(400, "Complete warehouse details required");
    }
  }

  if (role === "DEALER") {
    if (
      !parsedDealerDetails?.truckTypes?.length ||
      !parsedDealerDetails?.serviceAreas?.length
    ) {
      throw new ApiError(400, "Complete dealer details required");
    }
  }

  const userExists = await User.findOne({ $or: [{ email }, { phone }] });
  if (userExists) {
    // give a clearer message when phone/email already used
    if (userExists.email === email) throw new ApiError(409, "Email already in use");
    if (userExists.phone === phone) throw new ApiError(409, "Phone already in use");
    throw new ApiError(409, "User already exists");
  }

  /* ================= CLOUDINARY UPLOAD ================= */
  let profilePhotoUrl = null;

  if (req.file) {
    const uploaded = await uploadOnCloudinary(req.file.path);
    profilePhotoUrl = uploaded?.secure_url || null;
  } else if (profilePhoto) {
    // if frontend sends a direct URL
    profilePhotoUrl = profilePhoto;
  }

  /* ================= CREATE USER ================= */
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
    profilePhoto: profilePhotoUrl,
    warehouseDetails: role === "WAREHOUSE" ? parsedWarehouseDetails : undefined,
    dealerDetails: role === "DEALER" ? parsedDealerDetails : undefined
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully")
  );
});

/* ================= LOGIN ================= */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    sameSite: "lax",
    secure: false
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, { user: loggedInUser }, "Login successful")
    );
});

/* ================= LOGOUT ================= */
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $unset: { refreshToken: 1 }
  });

  const options = {
    httpOnly: true,
    sameSite: "lax",
    secure: false
  };

  return res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .status(200)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

/* ================= REFRESH TOKEN ================= */
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  const decoded = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decoded._id);

  if (!user || incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const options = {
    httpOnly: true,
    sameSite: "lax",
    secure: false
  };

  return res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .status(200)
    .json(
      new ApiResponse(200, {}, "Token refreshed")
    );
});

/* ================= CURRENT USER ================= */
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser
};
