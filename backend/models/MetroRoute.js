import mongoose from "mongoose";

const metroRouteSchema = new mongoose.Schema(
  {
    sourceStation: { type: mongoose.Schema.Types.ObjectId, ref: "MetroStation", required: true },
    destinationStation: { type: mongoose.Schema.Types.ObjectId, ref: "MetroStation", required: true },
    stationSequence: [{ type: mongoose.Schema.Types.ObjectId, ref: "MetroStation" }],
    fare: { type: Number, required: true, min: 0 },
    travelTimeMinutes: { type: Number, required: true, min: 0 },
    waitingTimeMinutes: { type: Number, required: true, min: 0 },
    nextTrainMinutes: { type: Number, required: true, min: 0 },
    lineName: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

metroRouteSchema.index({ sourceStation: 1, destinationStation: 1 }, { unique: true });

const MetroRoute = mongoose.model("MetroRoute", metroRouteSchema);

export default MetroRoute;
