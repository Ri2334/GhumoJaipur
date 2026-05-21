import express from "express";
import { getMetroStations, getTouristLocations, searchTransport } from "../controllers/transportController.js";

const router = express.Router();

router.get("/stations", getMetroStations);
router.get("/locations", getTouristLocations);
router.post("/search", searchTransport);

// Demo endpoint (no DB) — returns a mocked transport recommendation payload
router.get("/demo", (req, res) => {
	return res.json({
		success: true,
		data: {
			distanceKm: 3.4,
			walkingAllowed: false,
			candidates: [
				{ mode: "Auto", fare: 80, timeMinutes: 11, isRecommended: true },
				{ mode: "Cab", fare: 95, timeMinutes: 9, isFastest: true },
				{ mode: "Shared Cab", fare: 36, timeMinutes: 10, isCheapest: true },
				{ mode: "Metro", fare: 20, timeMinutes: 41 }
			],
			recommended: { mode: "Auto" },
			metroPath: ["Railway Station", "Sindhi Camp", "Chandpole", "Badi Chopar"]
		}
	});
});

export default router;
