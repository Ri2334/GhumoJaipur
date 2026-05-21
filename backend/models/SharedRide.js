import mongoose from 'mongoose';

const SharedRideSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  sourceName: { type: String, required: true },
  destinationName: { type: String, required: true },
  sourceCoord: { lat: Number, lng: Number },
  destCoord: { lat: Number, lng: Number },
  departAt: { type: Date, default: Date.now },
  totalFare: { type: Number, default: 100 },
  riderCount: { type: Number, default: 1 },
  splitFare: { type: Number, default: 100 },
  vehicleType: { type: String, enum: ['auto','car'], default: 'auto' },
  seatsAvailable: { type: Number, default: 3 },
  timeWindowMinutes: { type: Number, default: 30 },
  sharedProbability: { type: Number, default: 50 },
  recommended: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('SharedRide', SharedRideSchema);
