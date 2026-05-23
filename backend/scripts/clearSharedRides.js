import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SharedRide from '../models/SharedRide.js';
import Booking from '../models/Booking.js';

dotenv.config();

const clearSharedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const rideResult = await SharedRide.deleteMany({});
    console.log(`✅ Deleted ${rideResult.deletedCount} shared rides`);

    const bookingResult = await Booking.deleteMany({ type: 'shared' });
    console.log(`✅ Deleted ${bookingResult.deletedCount} shared ride bookings`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error clearing data:', err);
    process.exit(1);
  }
};

clearSharedData();
