import Driver from "../models/Driver.js";
import Booking from "../models/Booking.js";
import { haversineKm } from "../utils/distance.js";

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
    const driver = await Driver.findOne({ userId: req.user._id });
    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver profile not found" });
    }

    // Prevent unverified drivers from going Online
    if (updates.availability === 'Available' && !driver.isVerified) {
      return res.status(403).json({ 
        success: false, 
        message: "Access Denied: Your profile must be verified by an admin before you can go online." 
      });
    }

    Object.assign(driver, updates);
    await driver.save();

    return res.status(200).json({ success: true, data: driver });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadDocuments = async (req, res) => {
  try {
    const driver = await Driver.findOne({ userId: req.user._id });
    if (!driver) return res.status(404).json({ success: false, message: "Driver profile not found" });

    if (req.files) {
      if (req.files.profilePicture) driver.profilePicture = req.files.profilePicture[0].path;
      if (req.files.idProof) driver.idProof = req.files.idProof[0].path;
      if (req.files.licenseProof) driver.licenseProof = req.files.licenseProof[0].path;
      if (req.files.vehicleProof) driver.vehicleProof = req.files.vehicleProof[0].path;
      
      await driver.save();
    }

    return res.status(200).json({ success: true, message: "Documents uploaded successfully", data: driver });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const requestVerification = async (req, res) => {
  try {
    const driver = await Driver.findOne({ userId: req.user._id });
    if (!driver) return res.status(404).json({ success: false, message: "Driver profile not found" });

    // Check if all required fields are present
    if (!driver.profilePicture || !driver.idProof || !driver.licenseProof || !driver.vehicleProof) {
      return res.status(400).json({ success: false, message: "Please upload all required documents before requesting verification" });
    }

    driver.status = "pending";
    await driver.save();

    return res.status(200).json({ success: true, message: "Verification request submitted", data: driver });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRideRequests = async (req, res) => {
  try {
    const driver = await Driver.findOne({ userId: req.user._id });
    if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });

    // Restrict access to unverified drivers
    if (!driver.isVerified) {
      return res.status(403).json({ success: false, message: "Verification Required" });
    }

    // Find requested or accepted/started bookings for this driver
    const bookings = await Booking.find({ 
      driver: driver._id, 
      status: { $in: ["requested", "accepted", "waiting_approval", "approved", "started"] } 
    }).populate('user', 'fullName mobile').populate('sharedRide');

    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const acceptRide = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const driver = await Driver.findOne({ userId: req.user._id });
    if (!driver || !driver.isVerified) {
      return res.status(403).json({ success: false, message: "Only verified drivers can accept rides" });
    }

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
    
    // Assign a distance if none exists or is 0
    if (!booking.distance || booking.distance === 0) {
      // Try to calculate from coordinates first
      if (booking.map?.source && booking.map?.destination) {
        const d = haversineKm(
          { lat: booking.map.source.latitude, lng: booking.map.source.longitude },
          { lat: booking.map.destination.latitude, lng: booking.map.destination.longitude }
        );
        booking.distance = Math.round(d * 10) / 10;
      } 
      // Fallback to fare proxy
      if ((!booking.distance || booking.distance === 0) && booking.fare > 0) {
        booking.distance = Math.round((booking.fare / 25) * 10) / 10;
      }
    }
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

export const getDriverStats = async (req, res) => {
  try {
    const { period = 'daily', date } = req.query; // period: daily, monthly, lifetime
    const driver = await Driver.findOne({ userId: req.user._id });
    if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });

    let matchStage = { driver: driver._id, status: "completed" };
    let groupFormat = "%Y-%m-%d";
    let limit = 7;

    const selectedDate = date ? new Date(date) : new Date();
    selectedDate.setHours(0,0,0,0);

    if (period === 'daily') {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      matchStage.updatedAt = { $gte: selectedDate, $lt: nextDay };
      groupFormat = "%H:00"; // Show hourly for daily
    } else if (period === 'monthly') {
      const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
      matchStage.updatedAt = { $gte: startOfMonth, $lte: endOfMonth };
      groupFormat = "%d"; // Show days for monthly
      limit = 31;
    } else if (period === 'lifetime') {
      groupFormat = "%Y-%m"; // Show months for lifetime
      limit = 12;
    }

    const chartData = await Booking.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: "$updatedAt" } },
          earnings: { $sum: "$fare" },
          trips: { $sum: 1 },
          distance: { $sum: { $ifNull: ["$distance", 0] } }
        }
      },
      { $sort: { "_id": 1 } },
      { $limit: limit }
    ]);

    // Real-time totals for the selected period
    const totals = chartData.reduce((acc, curr) => ({
      earnings: acc.earnings + curr.earnings,
      trips: acc.trips + curr.trips,
      distance: Math.round((acc.distance + curr.distance) * 10) / 10
    }), { earnings: 0, trips: 0, distance: 0 });

    const recentHistory = await Booking.find({ driver: driver._id, status: "completed" })
      .sort({ updatedAt: -1 })
      .limit(10);

    return res.status(200).json({ 
      success: true, 
      data: {
        totals,
        chartData,
        history: recentHistory.map(b => ({
          id: b._id,
          to: b.destination,
          fare: b.fare,
          time: b.updatedAt,
          distance: b.distance
        }))
      } 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
