import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["cab", "auto", "shared"], required: true },
    pickup: { type: String, required: true },
    destination: { type: String, required: true },
    fare: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ["requested", "accepted", "waiting_approval", "approved", "started", "completed", "cancelled"], 
      default: "requested" 
    },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    sharedRide: { type: mongoose.Schema.Types.ObjectId, ref: "SharedRide" },
    distance: { type: Number, default: 0 },
    rideOtp: { type: String },
    destinationCoords: {
      latitude: { type: Number },
      longitude: { type: Number }
    },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    paymentRef: { type: String },
    etaMinutes: { type: Number },
    isRated: { type: Boolean, default: false },
    userRating: { type: Number },
    metadata: { type: Object },
    map: { type: Object },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
