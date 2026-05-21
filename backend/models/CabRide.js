import mongoose from "mongoose";

const cabRideSchema = new mongoose.Schema(
  {
    sourceName: { type: String, required: true, trim: true },
    destinationName: { type: String, required: true, trim: true },
    baseFare: { type: Number, required: true, min: 0 },
    surgeMultiplier: { type: Number, required: true, min: 1 },
    estimatedFare: { type: Number, required: true, min: 0 },
    estimatedDurationMinutes: { type: Number, required: true, min: 0 },
    estimatedArrivalMinutes: { type: Number, required: true, min: 0 },
    availability: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const CabRide = mongoose.model("CabRide", cabRideSchema);

export default CabRide;
