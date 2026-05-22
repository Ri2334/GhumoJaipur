import express from "express";
import { createBooking, getBookingById, confirmPayment, getMyBookings, cancelBooking } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/:id", protect, getBookingById);
router.post("/:id/confirm", protect, confirmPayment);
router.post('/:id/cancel', protect, cancelBooking);

export default router;
