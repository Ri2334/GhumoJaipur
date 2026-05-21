import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    vehicle: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    rating: { type: Number, default: 4.7 },
    phone: { type: String },
    location: {
      latitude: { type: Number, default: 26.92 },
      longitude: { type: Number, default: 75.8 },
    },
    availability: { type: String, enum: ["Available", "Busy", "Offline"], default: "Available" },
    type: { type: String, enum: ["cab", "auto"], default: "cab" },
  },
  { timestamps: true }
);

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;
