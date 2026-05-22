import express from "express";
import { createBooking, getBookingById, confirmPayment, getMyBookings, cancelBooking, rateDriver } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/:id", protect, getBookingById);
router.post("/:id/confirm", protect, confirmPayment);
router.post('/:id/cancel', protect, cancelBooking);
router.post('/:id/rate-driver', protect, rateDriver);

export default router;
