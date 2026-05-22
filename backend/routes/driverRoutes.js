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
  completeRide 
} from "../controllers/driverController.js";

const router = express.Router();

router.get("/me", protect, getMyDriverProfile);
router.put("/update", protect, updateDriverProfile);
router.post("/upload-docs", protect, upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'idProof', maxCount: 1 },
  { name: 'licenseProof', maxCount: 1 },
  { name: 'vehicleProof', maxCount: 1 }
]), uploadDocuments);
router.post("/request-verification", protect, requestVerification);
router.get("/requests", protect, getRideRequests);
router.post("/accept", protect, acceptRide);
router.post("/start", protect, startRide);
router.post("/complete", protect, completeRide);

export default router;
