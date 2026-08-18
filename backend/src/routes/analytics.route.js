import express from "express";
import { getWarehouseAnalytics } from "../controllers/analytics.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.get("/warehouse", verifyJWT, getWarehouseAnalytics);

export default router;
