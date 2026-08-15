import { Router } from "express";
import { optimizeShipment } from "../controllers/optimization.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

/* POST /api/optimize/:shipmentId */
router.post("/:shipmentId", verifyJWT, optimizeShipment);

export default router;
