import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    images: [{ type: String, trim: true }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    timings: { type: String, required: true, trim: true },
    ticketPrice: { type: Number, default: 0, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["Fort", "Palace", "Museum", "Temple", "Market", "Park", "Cafe", "Other"],
    },
    bestVisitTime: { type: String, required: true, trim: true },
    nearbyFoods: [{ type: String, trim: true }],
    transportOptions: [{ type: String, trim: true }],
    reviewCount: { type: Number, default: 0, min: 0 },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, trim: true, default: "" },
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

placeSchema.index({ name: "text", description: "text", location: "text", category: "text" });

const Place = mongoose.model("Place", placeSchema);

export default Place;
