import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Returns the authenticated user's profile (attached by verifyJWT middleware)
const getUserProfile = asyncHandler(async (req, res) => {
	const user = req.user;

	if (!user) {
		return res.status(404).json(new ApiResponse(404, {}, "User not found"));
	}

	return res.status(200).json(new ApiResponse(200, user, "User profile fetched"));
});

export { getUserProfile };
