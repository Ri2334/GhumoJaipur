import mongoose from "mongoose";

const metroStationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    line: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    sequence: { type: Number, required: true, min: 0 },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    nearbyPlaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "TouristLocation" }],
  },
  { timestamps: true }
);

metroStationSchema.index({ name: 1, line: 1 });

const MetroStation = mongoose.model("MetroStation", metroStationSchema);

export default MetroStation;
