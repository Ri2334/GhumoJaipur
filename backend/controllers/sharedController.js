import SharedRide from '../models/SharedRide.js';
import Booking from '../models/Booking.js';
import Driver from '../models/Driver.js';
import { sendBookingEmail } from '../services/bookingEmailService.js';

const haversineKm = (a, b) => {
  const toRad = v => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2) * Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon), Math.sqrt(1 - (sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon)));
  return R * c;
};

export const findMatches = async (req, res) => {
  try {
    const { sourceLat, sourceLng, destination } = req.query;
    const userCoord = sourceLat && sourceLng ? { lat: parseFloat(sourceLat), lng: parseFloat(sourceLng) } : null;

    let rides = await SharedRide.find().limit(50);

    // Filter by destination text closeness first
    if (destination) rides = rides.filter(r => r.destinationName.toLowerCase().includes(destination.toLowerCase()));

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
    if (ride.riderCount >= (4)) return res.status(400).json({ success: false, message: 'Ride full' });

    ride.riderCount += 1;
    ride.seatsAvailable = Math.max(0, ride.seatsAvailable - 1);
    ride.splitFare = Math.round(ride.totalFare / ride.riderCount);
    await ride.save();

    // create booking for user (assume paid/split)
    const booking = await Booking.create({ user: user._id, type: 'shared', pickup: ride.sourceName, destination: ride.destinationName, fare: ride.splitFare, status: 'confirmed', etaMinutes: Math.max(3, Math.round(Math.random()*10)) });

    // allocate a driver for shared ride
    const driver = await Driver.findOne({ availability: 'Available', type: ride.vehicleType }) || await Driver.findOne({ type: ride.vehicleType });
    if (driver) {
      booking.driver = driver._id;
      driver.availability = 'Busy';
      await driver.save();
      await booking.save();
    }

    // send booking email
    sendBookingEmail(booking._id.toString()).catch(()=>{});

    return res.status(200).json({ success: true, data: { ride, booking } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createSharedRide = async (req, res) => {
  try {
    const { sourceName, destinationName, sourceCoord, destCoord, totalFare, vehicleType } = req.body;
    if (!sourceName || !destinationName) return res.status(400).json({ success: false, message: 'Missing names' });
    const ride = await SharedRide.create({ sourceName, destinationName, sourceCoord, destCoord, totalFare: totalFare || 100, vehicleType: vehicleType || 'auto', splitFare: totalFare || 100 });
    return res.status(201).json({ success: true, data: ride });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
