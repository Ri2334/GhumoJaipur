import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Driver from '../models/Driver.js';
import SharedRide from '../models/SharedRide.js';
import Booking from '../models/Booking.js';

dotenv.config();

const testSystem = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Setup Test Users
    console.log('\n--- 1. Setting up Test Users ---');
    const passengerA = await User.findOneAndUpdate(
      { email: 'test_a@example.com' },
      { fullName: 'Passenger A', mobile: '1111111111', role: 'user' },
      { upsert: true, new: true }
    );
    const passengerB = await User.findOneAndUpdate(
      { email: 'test_b@example.com' },
      { fullName: 'Passenger B', mobile: '2222222222', role: 'user' },
      { upsert: true, new: true }
    );
    const driverUser = await User.findOneAndUpdate(
      { email: 'test_driver@example.com' },
      { fullName: 'Test Driver', mobile: '3333333333', role: 'driver' },
      { upsert: true, new: true }
    );

    const driver = await Driver.findOneAndUpdate(
      { userId: driverUser._id },
      { 
        vehicle: 'Swift Dzire', 
        vehicleNumber: 'RJ-14-TEST', 
        isVerified: true, 
        status: 'verified', 
        availability: 'Available' 
      },
      { upsert: true, new: true }
    );
    console.log('✅ Users and Verified Driver ready');

    // 2. Passenger A Creates Shared Ride
    console.log('\n--- 2. Passenger A Creating Shared Ride ---');
    const totalFare = 120;
    const ride = await SharedRide.create({
      creator: passengerA._id,
      sourceName: 'Railway Station',
      destinationName: 'Badi Chaupar',
      totalFare,
      splitFare: totalFare,
      riderCount: 1,
      seatsAvailable: 3,
      status: 'open'
    });

    const bookingA = await Booking.create({
      user: passengerA._id,
      type: 'shared',
      pickup: 'Railway Station',
      destination: 'Badi Chaupar',
      fare: totalFare,
      sharedRide: ride._id,
      status: 'requested'
    });
    console.log(`✅ Ride created. Passenger A Fare: ₹${bookingA.fare}`);

    // 3. Passenger B Joins Shared Ride
    console.log('\n--- 3. Passenger B Joining Shared Ride ---');
    ride.riderCount += 1;
    ride.seatsAvailable -= 1;
    ride.splitFare = Math.round(ride.totalFare / ride.riderCount);
    await ride.save();

    const bookingB = await Booking.create({
      user: passengerB._id,
      type: 'shared',
      pickup: 'Railway Station',
      destination: 'Badi Chaupar',
      fare: ride.splitFare,
      sharedRide: ride._id,
      status: 'requested'
    });

    // Sync Passenger A's fare
    await Booking.updateOne({ _id: bookingA._id }, { fare: ride.splitFare });
    const updatedBookingA = await Booking.findById(bookingA._id);
    
    console.log(`✅ Passenger B joined.`);
    console.log(`📊 New Dynamic Split Fare: ₹${ride.splitFare} (Total ₹${ride.totalFare} / 2)`);
    console.log(`✅ Passenger A Fare Updated: ₹${updatedBookingA.fare}`);
    console.log(`✅ Passenger B Fare: ₹${bookingB.fare}`);

    // 4. Driver Accepts and Requests Start
    console.log('\n--- 4. Driver Flow ---');
    ride.driver = driver._id;
    ride.status = 'waiting_approval';
    await ride.save();
    
    await Booking.updateMany({ sharedRide: ride._id }, { status: 'waiting_approval', driver: driver._id });
    console.log('✅ Driver accepted and requested start. Passengers moved to "waiting_approval"');

    // 5. Passenger Approvals
    console.log('\n--- 5. Passenger Approval Flow ---');
    await Booking.updateOne({ _id: bookingA._id }, { status: 'approved' });
    console.log('✅ Passenger A approved');
    
    // Simulate Passenger B cancelling instead of approving
    console.log('❌ Passenger B decides to cancel...');
    const bToCancel = await Booking.findById(bookingB._id);
    bToCancel.status = 'cancelled';
    await bToCancel.save();

    // Recalculate for remaining (Passenger A)
    ride.riderCount -= 1;
    ride.seatsAvailable += 1;
    ride.splitFare = Math.round(ride.totalFare / ride.riderCount);
    await ride.save();
    
    await Booking.updateOne({ _id: bookingA._id }, { fare: ride.splitFare });
    const finalBookingA = await Booking.findById(bookingA._id);
    
    console.log(`📊 Passenger B cancelled. Recalculating...`);
    console.log(`✅ Passenger A fare reverted to: ₹${finalBookingA.fare} (Only 1 rider left)`);

    // 6. Cleanup
    console.log('\n--- 6. Test Finished Successfully ---');
    await Booking.deleteMany({ sharedRide: ride._id });
    await SharedRide.deleteOne({ _id: ride._id });
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }
};

testSystem();
