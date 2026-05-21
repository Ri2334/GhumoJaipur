import mongoose from "mongoose";

const touristLocationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    nearestStation: { type: String, trim: true },
    category: { type: String, trim: true },
  },
  { timestamps: true }
);

const TouristLocation = mongoose.model("TouristLocation", touristLocationSchema);

export default TouristLocation;
