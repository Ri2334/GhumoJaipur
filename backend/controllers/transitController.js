import { getGoogleTransitJourney } from "../services/googleTransitService.js";

/**
 * Express Controller: Handles Google Places + Google Routes TRANSIT API journey queries
 */
export const searchGoogleTransit = async (req, res) => {
  try {
    const { origin, destination, preferences } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({
        status: "BAD_REQUEST",
        message: "Both 'origin' and 'destination' parameters are required."
      });
    }

    const journeyResult = await getGoogleTransitJourney(origin, destination, preferences || {});

    if (journeyResult.status === "MISSING_API_KEY") {
      return res.status(503).json({
        success: false,
        status: "MISSING_API_KEY",
        message: journeyResult.message,
        data: journeyResult
      });
    }

    return res.status(200).json({
      success: journeyResult.status === "FOUND",
      data: journeyResult
    });
  } catch (error) {
    console.error("[TransitController Error]", error);
    return res.status(500).json({
      success: false,
      status: "INTERNAL_ERROR",
      message: error.message
    });
  }
};
