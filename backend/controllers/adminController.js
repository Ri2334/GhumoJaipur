import Driver from "../models/Driver.js";
import User from "../models/User.js";

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
