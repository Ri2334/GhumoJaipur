import mongoose from "mongoose";

const transportRouteSchema = new mongoose.Schema(
  {
    sourceName: { type: String, required: true, trim: true },
    destinationName: { type: String, required: true, trim: true },
    distanceKm: { type: Number, required: true, min: 0 },
    walkingAllowed: { type: Boolean, default: false },
    recommendedMode: { type: String, required: true, trim: true },
    cheapestMode: { type: String, required: true, trim: true },
    fastestMode: { type: String, required: true, trim: true },
    sourceLocation: { type: mongoose.Schema.Types.ObjectId, ref: "TouristLocation" },
    destinationLocation: { type: mongoose.Schema.Types.ObjectId, ref: "TouristLocation" },
    metroRoute: { type: mongoose.Schema.Types.ObjectId, ref: "MetroRoute" },
  },
  { timestamps: true }
);

transportRouteSchema.index({ sourceName: 1, destinationName: 1 }, { unique: true });

const TransportRoute = mongoose.model("TransportRoute", transportRouteSchema);

export default TransportRoute;
