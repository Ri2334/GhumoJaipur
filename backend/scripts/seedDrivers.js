import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Driver from '../models/Driver.js';

dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

const MONGODB_URI = process.env.MONGODB_URI;

const drivers = [
  { name: 'Rahul Sharma', vehicle: 'WagonR (White)', vehicleNumber: 'RJ14 AB 1234', rating: 4.8, phone: '9876543210', type: 'cab' },
  { name: 'Amit Verma', vehicle: 'Swift Dzire (Blue)', vehicleNumber: 'RJ14 BB 4321', rating: 4.7, phone: '9876501234', type: 'cab' },
  { name: 'Suresh Kumar', vehicle: 'Auto (Green)', vehicleNumber: 'RJ14 AC 5555', rating: 4.6, phone: '9876512345', type: 'auto' },
  { name: 'Ramesh Singh', vehicle: 'Eeco (White)', vehicleNumber: 'RJ14 CC 7788', rating: 4.5, phone: '9876523456', type: 'cab' },
  { name: 'Vikash Joshi', vehicle: 'Auto (Yellow)', vehicleNumber: 'RJ14 DD 8899', rating: 4.4, phone: '9876534567', type: 'auto' },
];

const run = async () => {
  if (!MONGODB_URI) throw new Error('MONGODB_URI missing');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB for driver seed');

  for (const d of drivers) {
    await Driver.findOneAndUpdate({ vehicleNumber: d.vehicleNumber }, d, { upsert: true, new: true });
    console.log('Upserted driver', d.name);
  }

  await mongoose.disconnect();
  console.log('Driver seed complete');
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });
