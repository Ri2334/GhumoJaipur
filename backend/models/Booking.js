import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["cab", "auto", "shared"], required: true },
    pickup: { type: String, required: true },
    destination: { type: String, required: true },
    fare: { type: Number, required: true },
    status: { type: String, enum: ["initiated", "paid", "confirmed", "ongoing", "completed", "cancelled"], default: "initiated" },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    paymentRef: { type: String },
    etaMinutes: { type: Number },
    metadata: { type: Object },
    map: { type: Object },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
