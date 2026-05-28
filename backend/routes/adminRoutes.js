import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  getAllDrivers,
  verifyDriver,
  getDriverDetails,
  getDashboardStats,
  getAllUsers,
  deleteUser,
  deleteDriver
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getDashboardStats);
router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/users/:userId", protect, adminOnly, deleteUser);
router.get("/drivers", protect, adminOnly, getAllDrivers);
router.get("/drivers/:driverId", protect, adminOnly, getDriverDetails);
router.put("/drivers/verify/:driverId", protect, adminOnly, verifyDriver);
router.delete("/drivers/:driverId", protect, adminOnly, deleteDriver);

export default router;
