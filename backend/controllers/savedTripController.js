import SavedTrip from "../models/SavedTrip.js";

export const getSavedTrips = async (req, res) => {
  try {
    const savedTrips = await SavedTrip.find({ user: req.user._id })
      .populate({
        path: "place",
        populate: [
          { path: "createdBy", select: "fullName email role" },
          { path: "reviews.user", select: "fullName email role" },
        ],
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: savedTrips });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const saveTrip = async (req, res) => {
  try {
    const { placeId } = req.body;

    if (!placeId) {
      return res.status(400).json({ success: false, message: "Place id is required" });
    }

    const savedTrip = await SavedTrip.findOneAndUpdate(
      { user: req.user._id, place: placeId },
      { user: req.user._id, place: placeId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).populate({
      path: "place",
      populate: [
        { path: "createdBy", select: "fullName email role" },
        { path: "reviews.user", select: "fullName email role" },
      ],
    });

    return res.status(201).json({ success: true, data: savedTrip, message: "Trip saved successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({ success: true, message: "Trip already saved" });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSavedTrip = async (req, res) => {
  try {
    const { placeId } = req.params;

    const deleted = await SavedTrip.findOneAndDelete({ user: req.user._id, place: placeId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Saved trip not found" });
    }

    return res.status(200).json({ success: true, message: "Trip removed successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};