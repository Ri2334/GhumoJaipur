import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MetroStation from '../models/MetroStation.js';
import TouristLocation from '../models/TouristLocation.js';

dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

const MONGODB_URI = process.env.MONGODB_URI;

const stations = [
  { name: 'Railway Station', line: 'Pink Line', area: 'Station Road', sequence: 0, latitude: 26.918, longitude: 75.789 },
  { name: 'Sindhi Camp', line: 'Pink Line', area: 'Sindhi Camp', sequence: 1, latitude: 26.919, longitude: 75.795 },
  { name: 'Civil Lines', line: 'Pink Line', area: 'Civil Lines', sequence: 2, latitude: 26.921, longitude: 75.800 },
  { name: 'Ram Nagar', line: 'Pink Line', area: 'Ram Nagar', sequence: 3, latitude: 26.922, longitude: 75.805 },
  { name: 'Chandpole', line: 'Pink Line', area: 'Old City', sequence: 4, latitude: 26.923, longitude: 75.810 },
  { name: 'Badi Chopar', line: 'Pink Line', area: 'Old City', sequence: 5, latitude: 26.924, longitude: 75.823 },
];

const places = [
  { name: 'Hawa Mahal', description: 'Iconic pink sandstone palace with latticework', area: 'Old City', latitude: 26.9235, longitude: 75.826, nearestStation: 'Badi Chopar', category: 'Attraction' },
  { name: 'Jal Mahal', description: 'Lakeside palace set in Man Sagar Lake', area: 'Lake', latitude: 26.916, longitude: 75.804, nearestStation: 'Sindhi Camp', category: 'Attraction' },
  { name: 'Amer Fort', description: 'Hilltop fort with ramparts and palaces', area: 'Amer', latitude: 26.985, longitude: 75.851, nearestStation: 'Civil Lines', category: 'Attraction' },
  { name: 'City Palace', description: 'Royal complex with museums and gardens', area: 'Old City', latitude: 26.925, longitude: 75.823, nearestStation: 'Chandpole', category: 'Attraction' },
  { name: 'Jaipur Railway Station', description: 'Central railway hub for Jaipur', area: 'Station Road', latitude: 26.918, longitude: 75.789, nearestStation: 'Railway Station', category: 'Transit' },
  { name: 'Sindhi Camp', description: 'Major bus terminal and transit hub', area: 'Sindhi Camp', latitude: 26.919, longitude: 75.795, nearestStation: 'Sindhi Camp', category: 'Transit' },
  { name: 'Badi Chopar', description: 'Old city access point near heritage spots', area: 'Old City', latitude: 26.924, longitude: 75.823, nearestStation: 'Badi Chopar', category: 'Transit' },
  { name: 'Chandpole', description: 'Gateway to the old bazaars', area: 'Old City', latitude: 26.923, longitude: 75.810, nearestStation: 'Chandpole', category: 'Transit' },
];

const run = async () => {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not set in .env');
    process.exit(1);
  }
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB for dashboard seed');

  // Seed stations
  for (const s of stations) {
    await MetroStation.findOneAndUpdate({ name: s.name }, s, { upsert: true, new: true });
    console.log('Upserted station', s.name);
  }

  // Seed places
  for (const p of places) {
    await TouristLocation.findOneAndUpdate({ name: p.name }, p, { upsert: true, new: true });
    console.log('Upserted place', p.name);
  }

  await mongoose.disconnect();
  console.log('Dashboard seed complete');
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });
