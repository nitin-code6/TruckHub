import { ApiError } from "../utils/ApiError.js";

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "Access denied: insufficient permissions");
    }
    next();
  };
};

export { authorizeRoles };
