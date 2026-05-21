import express from "express";
import * as placeController from "../controllers/placeController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", placeController.getAllPlaces);
router.get("/:id", placeController.getPlaceById);
router.post("/:id/reviews", protect, placeController.addPlaceReview);
router.post("/", protect, adminOnly, placeController.createPlace);
router.put("/:id", protect, adminOnly, placeController.updatePlace);
router.delete("/:id", protect, adminOnly, placeController.deletePlace);

export default router;
