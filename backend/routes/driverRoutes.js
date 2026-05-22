import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
  getMyDriverProfile, 
  updateDriverProfile, 
  getRideRequests, 
  acceptRide, 
  startRide, 
  completeRide 
} from "../controllers/driverController.js";

const router = express.Router();

router.get("/me", protect, getMyDriverProfile);
router.put("/update", protect, updateDriverProfile);
router.get("/requests", protect, getRideRequests);
router.post("/accept", protect, acceptRide);
router.post("/start", protect, startRide);
router.post("/complete", protect, completeRide);

export default router;
