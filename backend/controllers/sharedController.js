import mongoose from 'mongoose';
import SharedRide from '../models/SharedRide.js';
import Booking from '../models/Booking.js';
import Driver from '../models/Driver.js';
import { sendBookingEmail } from '../services/bookingEmailService.js';
import { haversineKm } from '../utils/distance.js';

export const findMatches = async (req, res) => {
  try {
    const { sourceLat, sourceLng, destination, source } = req.query;
    const userCoord = sourceLat && sourceLng ? { lat: parseFloat(sourceLat), lng: parseFloat(sourceLng) } : null;

    let query = {};
    if (destination) query.destinationName = { $regex: new RegExp(destination, "i") };
    if (source) query.sourceName = { $regex: new RegExp(source, "i") };

    let rides = await SharedRide.find(query).limit(50);

    // If user coord provided, compute distance and sort by proximity
    if (userCoord) {
      rides = rides.map(r => ({
        ride: r,
        distKm: r.sourceCoord && r.sourceCoord.lat ? haversineKm(userCoord, r.sourceCoord) : 9999,
      }))
      .filter(x => x.distKm < 5) // only within 5km
      .sort((a,b) => a.distKm - b.distKm)
      .map(x => x.ride);
    }

    return res.status(200).json({ success: true, data: rides });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const joinSharedRide = async (req, res) => {
  try {
    const { rideId } = req.body;
    const user = req.user;
    const ride = await SharedRide.findById(rideId);
    if (!ride) return res.status(404).json({ success: false, message: 'Ride not found' });
    if (ride.seatsAvailable <= 0) return res.status(400).json({ success: false, message: 'Ride full' });
    if (ride.status !== 'open') return res.status(400).json({ success: false, message: 'Ride no longer accepting joiners' });

    // Check if user already joined
    const existingBooking = await Booking.findOne({ user: user._id, sharedRide: ride._id, status: { $ne: 'cancelled' } });
    if (existingBooking) return res.status(400).json({ success: false, message: 'Already joined this ride' });

    ride.riderCount += 1;
    ride.seatsAvailable = Math.max(0, ride.seatsAvailable - 1);
    ride.splitFare = Math.round(ride.totalFare / ride.riderCount);
    await ride.save();

    // Create booking for the new joiner
    const rideOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const distance = (ride.sourceCoord && ride.destCoord) ? 
      Math.round(haversineKm(ride.sourceCoord, ride.destCoord) * 10) / 10 : 0;

    const booking = await Booking.create({ 
      user: user._id, 
      type: 'shared', 
      pickup: ride.sourceName, 
      destination: ride.destinationName, 
      fare: ride.splitFare, 
      distance,
      status: ride.driver ? 'accepted' : 'requested', 
      sharedRide: ride._id,
      driver: ride.driver, // Link existing driver if assigned
      rideOtp,
      etaMinutes: Math.max(3, Math.round(Math.random()*10)) 
    });

    // DYNAMIC FARE: Update ALL other active bookings in this shared ride
    await Booking.updateMany(
      { sharedRide: ride._id, _id: { $ne: booking._id }, status: { $ne: 'cancelled' } },
      { fare: ride.splitFare }
    );

    return res.status(200).json({ success: true, data: { ride, booking } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createSharedRide = async (req, res) => {
  try {
    const { sourceName, destinationName, sourceCoord, destCoord, totalFare, vehicleType } = req.body;
    if (!sourceName || !destinationName) return res.status(400).json({ success: false, message: 'Missing names' });

    // Prevent multiple active shared rides for the same user
    if (req.user.role === 'user') {
      const activeBooking = await Booking.findOne({ 
        user: req.user._id, 
        type: 'shared', 
        status: { $in: ['requested', 'accepted', 'waiting_approval', 'approved', 'started'] } 
      });
      if (activeBooking) {
        return res.status(400).json({ 
          success: false, 
          message: "You already have an active shared ride. Please complete or cancel it before starting a new pool.",
          bookingId: activeBooking._id
        });
      }
    }

    // If a driver is trying to create a ride, check verification
    if (req.user.role === 'driver') {
      const driver = await Driver.findOne({ userId: req.user._id });
      if (!driver || !driver.isVerified) {
        return res.status(403).json({ success: false, message: "Only verified drivers can post shared rides" });
      }
    }

    const ride = await SharedRide.create({ 
      creator: req.user._id,
      sourceName, 
      destinationName, 
      sourceCoord, 
      destCoord, 
      totalFare: totalFare || 100, 
      vehicleType: vehicleType || 'auto', 
      splitFare: totalFare || 100,
      riderCount: 1,
      seatsAvailable: vehicleType === 'car' ? 3 : 2, // Auto usually 2, Car 3 for sharing
      status: 'open'
    });

    // Automatically create a booking for the creator (if passenger)
    let booking = null;
    if (req.user.role === 'user') {
      const rideOtp = Math.floor(1000 + Math.random() * 9000).toString();
      const distance = (ride.sourceCoord && ride.destCoord) ? 
        Math.round(haversineKm(ride.sourceCoord, ride.destCoord) * 10) / 10 : 0;
        
      booking = await Booking.create({
        user: req.user._id,
        type: 'shared',
        pickup: sourceName,
        destination: destinationName,
        fare: ride.totalFare,
        distance,
        status: 'requested',
        sharedRide: ride._id,
        rideOtp,
        etaMinutes: Math.max(3, Math.round(Math.random()*10))
      });
    }

    return res.status(201).json({ success: true, data: { ride, booking } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getAvailableSharedRides = async (req, res) => {
  try {
    const driver = await Driver.findOne({ userId: req.user._id });
    if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });

    const driverArea = driver.currentLocation?.areaName;

    const rides = await SharedRide.find({ 
      status: 'open', 
      driver: { $exists: false },
      sourceName: { $regex: new RegExp(driverArea, "i") } 
    }).sort({ createdAt: -1 });
    
    return res.status(200).json({ success: true, data: rides });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const driverAcceptSharedRide = async (req, res) => {
  try {
    const { rideId } = req.body;
    const driver = await Driver.findOne({ userId: req.user._id });
    if (!driver || !driver.isVerified) {
      return res.status(403).json({ success: false, message: "Only verified drivers can accept shared rides" });
    }

    const ride = await SharedRide.findById(rideId);
    if (!ride) return res.status(404).json({ success: false, message: "Ride not found" });
    if (ride.driver) return res.status(400).json({ success: false, message: "Ride already has a driver" });

    ride.driver = driver._id;
    await ride.save();

    // Link driver to all existing bookings for this ride and auto-accept them
    await Booking.updateMany(
      { sharedRide: new mongoose.Types.ObjectId(rideId), status: { $ne: 'cancelled' } },
      { driver: driver._id, status: 'accepted' }
    );

    return res.status(200).json({ success: true, data: ride });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const driverRequestStart = async (req, res) => {
  try {
    const { rideId } = req.body;
    const driver = await Driver.findOne({ userId: req.user._id });
    const ride = await SharedRide.findById(rideId);

    if (!ride || String(ride.driver) !== String(driver._id)) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    ride.status = 'waiting_approval';
    await ride.save();

    // Update all bookings to waiting_approval
    await Booking.updateMany(
      { sharedRide: new mongoose.Types.ObjectId(rideId), status: { $in: ['requested', 'accepted'] } },
      { status: 'waiting_approval' }
    );

    return res.status(200).json({ success: true, message: "Approval requests sent to passengers", data: ride });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const passengerApproveStart = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findOne({ _id: bookingId, user: req.user._id });
    
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (booking.status !== 'waiting_approval') {
      return res.status(400).json({ success: false, message: "No approval requested for this ride" });
    }

    booking.status = 'approved';
    await booking.save();

    return res.status(200).json({ success: true, message: "Ride approved" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const driverConfirmStart = async (req, res) => {
  try {
    const { rideId } = req.body;
    const driver = await Driver.findOne({ userId: req.user._id });
    const ride = await SharedRide.findById(rideId);

    if (!ride || String(ride.driver) !== String(driver._id)) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Check if there are any passengers who haven't approved yet (requested, accepted, or waiting_approval)
    const nonApprovedBookings = await Booking.find({ 
      sharedRide: new mongoose.Types.ObjectId(rideId), 
      status: { $in: ['requested', 'accepted', 'waiting_approval'] } 
    });
    
    if (nonApprovedBookings.length > 0) {
      return res.status(400).json({ success: false, message: "Wait for all passengers to approve. Some are still pending." });
    }

    const approvedBookings = await Booking.find({ sharedRide: new mongoose.Types.ObjectId(rideId), status: 'approved' });
    if (approvedBookings.length === 0) {
      return res.status(400).json({ success: false, message: "No approved passengers to start the ride" });
    }

    ride.status = 'started';
    await ride.save();

    await Booking.updateMany(
      { sharedRide: new mongoose.Types.ObjectId(rideId), status: 'approved' },
      { status: 'started' }
    );

    return res.status(200).json({ success: true, message: "Ride started!", data: ride });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
