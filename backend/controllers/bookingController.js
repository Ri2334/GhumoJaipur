import Driver from "../models/Driver.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { createTransport } from "../utils/mailer.js";

export const createBooking = async (req, res) => {
  try {
    const { type, pickup, destination, fare, driverId } = req.body;
    const user = req.user || null;
    if (!user || !type || !pickup || !destination || !fare) return res.status(400).json({ success: false, message: "Missing fields or not authenticated" });

    const etaMinutes = Math.max(3, Math.round(Math.random() * 10));
    const rideOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // try to find coordinates for pickup/destination from TouristLocation
    let map = {};
    let destinationCoords = null;
    try {
      const TouristLocation = (await import('../models/TouristLocation.js')).default;
      const src = await TouristLocation.findOne({ name: pickup });
      const dst = await TouristLocation.findOne({ name: destination });
      if (src) map.source = { latitude: src.latitude, longitude: src.longitude, name: src.name };
      if (dst) {
        map.destination = { latitude: dst.latitude, longitude: dst.longitude, name: dst.name };
        destinationCoords = { latitude: dst.latitude, longitude: dst.longitude };
      }
    } catch (e) {
      // ignore
    }

    const booking = await Booking.create({ 
      user: user._id, 
      type, 
      pickup, 
      destination, 
      fare, 
      etaMinutes, 
      map,
      rideOtp,
      driver: driverId,
      destinationCoords,
      status: "requested"
    });

    // Send ride OTP email immediately
    try {
      const transport = createTransport();
      if (transport && user.email) {
        await transport.sendMail({ 
          from: process.env.MAIL_FROM, 
          to: user.email, 
          subject: 'Ghumo Jaipur: Your Ride OTP', 
          html: `<p>Your ride with Ghumo Jaipur is confirmed! Share this OTP with your driver to start the ride: <strong>${rideOtp}</strong></p>` 
        });
      }
    } catch (mailErr) {
      console.error("Mail failed", mailErr);
    }

    return res.status(201).json({ success: true, data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate({ path: 'driver', populate: { path: 'userId', select: 'fullName mobile' } }).populate('user');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    return res.status(200).json({ success: true, data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Not authenticated' });
    const bookings = await Booking.find({ user: user._id }).populate('driver');
    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.paymentStatus = 'paid';
    booking.paymentRef = `TXN_${Date.now().toString(36)}`;
    await booking.save();

    return res.status(200).json({ success: true, data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    
    if (booking.status === 'cancelled') return res.status(400).json({ success: false, message: 'Already cancelled' });

    booking.status = 'cancelled';
    await booking.save();

    // Reduce user rating by 0.1
    const user = await User.findById(booking.user);
    if (user) {
      user.rating = Number((Math.max(0, (user.rating || 5.0) - 0.1)).toFixed(2));
      await user.save();
    }

    if (booking.driver) {
      const driver = await Driver.findById(booking.driver);
      if (driver) {
        driver.availability = 'Available';
        await driver.save();
      }
    }
    return res.status(200).json({ success: true, data: booking, userRating: user?.rating });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const rateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body; // rating from 1 to 5
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Invalid rating" });
    }

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (booking.isRated) return res.status(400).json({ success: false, message: "Ride already rated" });
    if (!booking.driver) return res.status(400).json({ success: false, message: "No driver assigned to this booking" });

    const driver = await Driver.findById(booking.driver);
    if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });

    // Update driver rating
    const oldRating = driver.rating || 4.7;
    const oldCount = driver.totalRatings || 1;
    
    const newCount = oldCount + 1;
    const newRating = ((oldRating * oldCount) + rating) / newCount;
    
    driver.rating = Number(newRating.toFixed(1));
    driver.totalRatings = newCount;
    await driver.save();

    // Mark booking as rated
    booking.isRated = true;
    booking.userRating = rating;
    await booking.save();

    return res.status(200).json({ success: true, data: driver });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
