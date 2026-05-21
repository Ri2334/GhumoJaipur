import mongoose from "mongoose";

const savedTripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    place: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true, index: true },
  },
  { timestamps: true }
);

savedTripSchema.index({ user: 1, place: 1 }, { unique: true });

const SavedTrip = mongoose.model("SavedTrip", savedTripSchema);

export default SavedTrip;