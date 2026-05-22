import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    rating: { type: Number, default: 4.7 },
    currentLocation: {
      latitude: { type: Number, default: 26.9124 },
      longitude: { type: Number, default: 75.7873 },
      areaName: { type: String, default: "Jaipur Railway Station" }
    },
    availability: { type: String, enum: ["Available", "Busy", "Offline"], default: "Offline" },
    type: { type: String, enum: ["cab", "auto"], default: "cab" },
    baseFare: { type: Number, default: 60 },
    perKmRate: { type: Number, default: 15 }
  },
  { timestamps: true }
);

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;
