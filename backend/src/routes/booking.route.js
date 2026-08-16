import { Router } from "express";
import {
  createBooking,
  getMyBookings,
  startTrip,
  rejectBooking,
  completeTrip
} from "../controllers/booking.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/:shipmentId", verifyJWT, createBooking);
router.get("/", verifyJWT, getMyBookings);
router.patch("/:bookingId/start", verifyJWT, startTrip);
router.patch("/:bookingId/complete", verifyJWT, completeTrip);
// allow dealer to reject a booking
router.patch("/:bookingId/reject", verifyJWT, rejectBooking);

export default router;
