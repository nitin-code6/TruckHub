import express from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  dealerDashboard,
  dealerAnalytics
} from "../controllers/dealer.controller.js";

const router = express.Router();

router.get("/dashboard", verifyJWT, dealerDashboard);
router.get("/analytics", verifyJWT, dealerAnalytics);

export default router;
