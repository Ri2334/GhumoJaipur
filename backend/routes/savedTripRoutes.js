import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { deleteSavedTrip, getSavedTrips, saveTrip } from "../controllers/savedTripController.js";

const router = express.Router();

router.get("/", protect, getSavedTrips);
router.post("/", protect, saveTrip);
router.delete("/:placeId", protect, deleteSavedTrip);

export default router;