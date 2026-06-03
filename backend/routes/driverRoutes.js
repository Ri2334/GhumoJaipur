import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js";
import { 
  getMyDriverProfile, 
  updateDriverProfile, 
  uploadDocuments,
  requestVerification,
  getRideRequests, 
  acceptRide, 
  startRide, 
  completeRide,
  getDriverStats
} from "../controllers/driverController.js";

const router = express.Router();

router.get("/me", protect, getMyDriverProfile);
router.get("/stats", protect, getDriverStats);
router.put("/update", protect, updateDriverProfile);
router.post("/upload-docs", protect, upload.any(), uploadDocuments);
router.post("/request-verification", protect, requestVerification);
router.get("/requests", protect, getRideRequests);
router.post("/accept", protect, acceptRide);
router.post("/start", protect, startRide);
router.post("/complete", protect, completeRide);

export default router;
