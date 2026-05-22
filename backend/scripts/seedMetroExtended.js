import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MetroStation from '../models/MetroStation.js';

dotenv.config({ path: new URL('../.env', import.meta.url).pathname });
const MONGODB_URI = process.env.MONGODB_URI;

const stations = [
  { name: 'Mansarovar', line: 'Pink Line', area: 'Mansarovar', sequence: 0, latitude: 26.882, longitude: 75.775 },
  { name: 'New Aatish Market', line: 'Pink Line', area: 'Aatish Market', sequence: 1, latitude: 26.895, longitude: 75.785 },
  { name: 'Vivek Vihar', line: 'Pink Line', area: 'Vivek Vihar', sequence: 2, latitude: 26.904, longitude: 75.790 },
  { name: 'Shyam Nagar', line: 'Pink Line', area: 'Shyam Nagar', sequence: 3, latitude: 26.910, longitude: 75.795 },
  { name: 'Ram Nagar', line: 'Pink Line', area: 'Ram Nagar', sequence: 4, latitude: 26.922, longitude: 75.805 },
  { name: 'Civil Lines', line: 'Pink Line', area: 'Civil Lines', sequence: 5, latitude: 26.921, longitude: 75.800 },
  { name: 'Railway Station', line: 'Pink Line', area: 'Station Road', sequence: 6, latitude: 26.918, longitude: 75.789 },
  { name: 'Sindhi Camp', line: 'Pink Line', area: 'Sindhi Camp', sequence: 7, latitude: 26.919, longitude: 75.795 },
  { name: 'Chandpole', line: 'Pink Line', area: 'Old City', sequence: 8, latitude: 26.923, longitude: 75.810 },
  { name: 'Chhoti Chaupar', line: 'Pink Line', area: 'Old City', sequence: 9, latitude: 26.924, longitude: 75.817 },
  { name: 'Badi Chaupar', line: 'Pink Line', area: 'Old City', sequence: 10, latitude: 26.924, longitude: 75.823 },
];

const run = async () => {
  if (!MONGODB_URI) throw new Error('MONGODB_URI missing');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB for metro extended seed');

  for (const s of stations) {
    await MetroStation.findOneAndUpdate({ name: s.name }, s, { upsert: true, new: true });
    console.log('Upserted station', s.name);
  }

  await mongoose.disconnect();
  console.log('Metro extended seed complete');
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });
