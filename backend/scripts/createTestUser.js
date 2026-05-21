import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

const MONGODB_URI = process.env.MONGODB_URI;

const createToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

const run = async () => {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not set in .env');
    process.exit(1);
  }
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const email = 'devtest+gj@example.com';
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Test user already exists');
    console.log('Token:', createToken(existing._id.toString()));
    await mongoose.disconnect();
    process.exit(0);
  }

  const hashed = await bcrypt.hash('Password123', 10);
  const user = await User.create({ fullName: 'Dev Test', email, mobile: '9999999999', password: hashed, emailVerified: true, role: 'user' });
  console.log('Created user', user.email);
  console.log('Token:', createToken(user._id.toString()));

  await mongoose.disconnect();
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });
