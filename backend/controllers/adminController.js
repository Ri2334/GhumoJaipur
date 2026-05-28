import Driver from "../models/Driver.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Place from "../models/Place.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalDrivers = await Driver.countDocuments();
    const pendingDrivers = await Driver.countDocuments({ status: 'pending' });
    const totalBookings = await Booking.countDocuments();
    const totalPlaces = await Place.countDocuments();
    
    const recentBookings = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, revenue: { $sum: '$fare' } } }
    ]);
    const totalRevenue = recentBookings.length > 0 ? recentBookings[0].revenue : 0;

    return res.status(200).json({
      success: true,
      data: {
        users: totalUsers,
        drivers: totalDrivers,
        pendingDrivers,
        bookings: totalBookings,
        places: totalPlaces,
        revenue: totalRevenue
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllDrivers = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const drivers = await Driver.find(filter)
      .populate('userId', 'fullName email mobile rating')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: drivers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });

    // Also update the associated user role back to 'user' or delete if needed
    // For now, let's just delete the driver profile
    await Driver.findByIdAndDelete(driverId);

    return res.status(200).json({ success: true, message: "Driver profile deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: "Cannot delete admin user" });
    }

    await User.findByIdAndDelete(userId);
    // Optionally delete their bookings too
    await Booking.deleteMany({ user: userId });

    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { status } = req.body; // 'verified' or 'rejected'

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });

    driver.status = status;
    driver.isVerified = (status === 'verified');
    
    // If verified, maybe set availability to Offline (ready to go Online)
    if (driver.isVerified) {
      driver.availability = 'Offline';
    }

    await driver.save();

    return res.status(200).json({ 
      success: true, 
      message: `Driver ${status} successfully`,
      data: driver 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDriverDetails = async (req, res) => {
  try {
    const { driverId } = req.params;
    const driver = await Driver.findById(driverId).populate('userId', 'fullName email mobile rating');
    if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });

    return res.status(200).json({ success: true, data: driver });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
