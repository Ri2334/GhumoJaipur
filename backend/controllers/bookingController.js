import Driver from "../models/Driver.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { sendBookingEmail } from "../services/bookingEmailService.js";
import { createTransport } from "../utils/mailer.js";

const randomDriver = async (type = "cab") => {
  const driver = await Driver.findOne({ type, availability: "Available" });
  if (driver) return driver;
  // fallback to random driver
  const any = await Driver.findOne({ type });
  return any;
};

export const createBooking = async (req, res) => {
  try {
    const { type, pickup, destination, fare } = req.body;
    const user = req.user || null;
    if (!user || !type || !pickup || !destination || !fare) return res.status(400).json({ success: false, message: "Missing fields or not authenticated" });

    const etaMinutes = Math.max(3, Math.round(Math.random() * 10));

    // try to find coordinates for pickup/destination from TouristLocation
    let map = {};
    try {
      const src = await (await import('../models/TouristLocation.js')).default.findOne({ name: pickup });
      const dst = await (await import('../models/TouristLocation.js')).default.findOne({ name: destination });
      if (src) map.source = { latitude: src.latitude, longitude: src.longitude, name: src.name };
      if (dst) map.destination = { latitude: dst.latitude, longitude: dst.longitude, name: dst.name };
    } catch (e) {
      // ignore
    }

    const booking = await Booking.create({ user: user._id, type, pickup, destination, fare, etaMinutes, map });

    return res.status(201).json({ success: true, data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate('driver user');
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

    // Simulate payment success
    booking.status = 'paid';
    booking.paymentRef = `TXN_${Date.now().toString(36)}`;
    await booking.save();

    // Allocate driver
    const driver = await randomDriver(booking.type);
    if (driver) {
      booking.driver = driver._id;
      booking.status = 'confirmed';
      // mark driver busy
      driver.availability = 'Busy';
      await driver.save();
      await booking.save();
    }

    // Send confirmation email (async)
    sendBookingEmail(booking._id.toString()).catch(() => {});

    const populated = await Booking.findById(booking._id).populate('driver user');
    return res.status(200).json({ success: true, data: populated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    booking.status = 'cancelled';
    await booking.save();
    if (booking.driver) {
      const driver = await Driver.findById(booking.driver);
      if (driver) {
        driver.availability = 'Available';
        await driver.save();
      }
    }
    return res.status(200).json({ success: true, data: booking });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const sendRideOtp = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate('user');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    booking.metadata = booking.metadata || {};
    booking.metadata.rideOtp = otp;
    booking.metadata.rideOtpExpires = expires;
    await booking.save();

    const transport = createTransport();
    if (transport && booking.user?.email) {
      await transport.sendMail({ from: process.env.MAIL_FROM, to: booking.user.email, subject: 'Your ride OTP', html: `<p>Your ride OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>` });
    }

    return res.status(200).json({ success: true, message: 'OTP sent' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyRideOtp = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;
    const booking = await Booking.findById(id).populate('user');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (!booking.metadata || !booking.metadata.rideOtp) return res.status(400).json({ success: false, message: 'OTP not sent' });
    if (Date.now() > booking.metadata.rideOtpExpires) return res.status(400).json({ success: false, message: 'OTP expired' });
    if (String(otp) !== String(booking.metadata.rideOtp)) return res.status(400).json({ success: false, message: 'Invalid OTP' });

    booking.metadata.rideOtpVerified = true;
    await booking.save();
    return res.status(200).json({ success: true, message: 'OTP verified' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
