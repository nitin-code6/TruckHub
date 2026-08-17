import express from "express";
import { getWarehouseDashboard } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.get("/warehouse", verifyJWT, getWarehouseDashboard);

export default router;
