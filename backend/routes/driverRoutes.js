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
router.post("/upload-docs", protect, (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      console.error("MULTER ERROR IN ROUTE:", err);
      return res.status(500).json({ 
        success: false, 
        message: `Multer/Cloudinary Error: ${err.message}`,
        error: err 
      });
    }
    next();
  });
}, uploadDocuments);
router.post("/request-verification", protect, requestVerification);
router.get("/requests", protect, getRideRequests);
router.post("/accept", protect, acceptRide);
router.post("/start", protect, startRide);
router.post("/complete", protect, completeRide);

export default router;
