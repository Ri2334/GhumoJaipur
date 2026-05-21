import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SharedRide from '../models/SharedRide.js';

dotenv.config({ path: new URL('../.env', import.meta.url).pathname });
const MONGODB_URI = process.env.MONGODB_URI;

const rides = [
  {
    sourceName: 'Badi Chopar',
    destinationName: 'Hawa Mahal',
    sourceCoord: { lat: 26.924, lng: 75.823 },
    destCoord: { lat: 26.9239, lng: 75.8265 },
    totalFare: 60,
    riderCount: 1,
    splitFare: 60,
    vehicleType: 'auto'
  },
  {
    sourceName: 'Sindhi Camp',
    destinationName: 'Jal Mahal',
    sourceCoord: { lat: 26.919, lng: 75.795 },
    destCoord: { lat: 26.8822, lng: 75.7938 },
    totalFare: 120,
    riderCount: 1,
    splitFare: 120,
    vehicleType: 'car'
  }
];

const run = async () => {
  if (!MONGODB_URI) throw new Error('MONGODB_URI missing');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB for shared ride seed');

  for (const r of rides) {
    await SharedRide.findOneAndUpdate({ sourceName: r.sourceName, destinationName: r.destinationName }, r, { upsert: true, new: true });
    console.log('Upserted shared ride', r.sourceName, '→', r.destinationName);
  }

  await mongoose.disconnect();
  console.log('Shared ride seed complete');
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });
