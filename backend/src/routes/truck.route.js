import { Router } from "express";
import {
  addTruck,
  getMyTrucks,
  getTruckById,
  updateTruck,
  deleteTruck,
  getAvailableTrucks
} from "../controllers/truck.controller.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/", verifyJWT, addTruck);
router.get("/my-trucks", verifyJWT, getMyTrucks);
router.get("/available", verifyJWT, getAvailableTrucks);
router.get("/:truckId", verifyJWT, getTruckById);
router.put("/:truckId", verifyJWT, updateTruck);
router.delete("/:truckId", verifyJWT, deleteTruck);

export default router;
