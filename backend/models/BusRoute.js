import mongoose from "mongoose";

const busRouteSchema = new mongoose.Schema(
  {
    routeNumber: { type: String, required: true, trim: true, unique: true },
    routeName: { type: String, required: true, trim: true },
    stops: [{ type: String, required: true }], // Using names for simplicity or we can use ObjectIds later
    distanceKm: { type: Number, required: true, min: 0 },
    frequencyMinutes: { type: Number, required: true, min: 0 },
    numBuses: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const BusRoute = mongoose.model("BusRoute", busRouteSchema);

export default BusRoute;
