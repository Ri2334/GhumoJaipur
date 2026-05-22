import Driver from "../models/Driver.js";
import Booking from "../models/Booking.js";

export const getMyDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.findOne({ userId: req.user._id });
    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver profile not found" });
    }
    return res.status(200).json({ success: true, data: driver });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDriverProfile = async (req, res) => {
  try {
    const updates = req.body;
    const driver = await Driver.findOneAndUpdate(
      { userId: req.user._id },
      updates,
      { new: true, runValidators: true }
    );
    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver profile not found" });
    }
    return res.status(200).json({ success: true, data: driver });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRideRequests = async (req, res) => {
  try {
    const driver = await Driver.findOne({ userId: req.user._id });
    if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });

    // Find requested or accepted/started bookings for this driver
    const bookings = await Booking.find({ 
      driver: driver._id, 
      status: { $in: ["requested", "accepted", "started"] } 
    }).populate('user', 'fullName mobile');

    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const acceptRide = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    
    booking.status = "accepted";
    await booking.save();

    return res.status(200).json({ success: true, data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const startRide = async (req, res) => {
  try {
    const { bookingId, otp } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    if (String(booking.rideOtp) !== String(otp)) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    booking.status = "started";
    await booking.save();

    const driver = await Driver.findById(booking.driver);
    if (driver) {
      driver.availability = "Busy";
      await driver.save();
    }

    return res.status(200).json({ success: true, data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const completeRide = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    booking.status = "completed";
    await booking.save();

    const driver = await Driver.findById(booking.driver);
    if (driver) {
      driver.availability = "Available";
      if (booking.destinationCoords) {
        driver.currentLocation = {
          latitude: booking.destinationCoords.latitude,
          longitude: booking.destinationCoords.longitude,
          areaName: booking.destination
        };
      }
      await driver.save();
    }

    return res.status(200).json({ success: true, data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
