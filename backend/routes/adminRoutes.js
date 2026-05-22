import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  getAllDrivers,
  verifyDriver,
  getDriverDetails
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/drivers", protect, adminOnly, getAllDrivers);
router.get("/drivers/:driverId", protect, adminOnly, getDriverDetails);
router.put("/drivers/verify/:driverId", protect, adminOnly, verifyDriver);

export default router;
