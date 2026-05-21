import express from "express";
import { createBooking, getBookingById, confirmPayment, getMyBookings, cancelBooking, sendRideOtp, verifyRideOtp } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/:id", protect, getBookingById);
router.post("/:id/confirm", protect, confirmPayment);
router.post('/:id/cancel', protect, cancelBooking);
router.post('/:id/send-otp', protect, sendRideOtp);
router.post('/:id/verify-otp', protect, verifyRideOtp);

export default router;
