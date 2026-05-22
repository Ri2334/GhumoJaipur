import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Driver from "../models/Driver.js";
import { sendOtpEmail } from "../utils/mailer.js";

const otpStore = new Map();
const verifiedEmails = new Map();

const createToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const isAdminEmail = (email) => {
  const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  return adminEmail && email.toLowerCase().trim() === adminEmail;
};

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const setOtpRecord = (email, purpose) => {
  const otp = generateOtp();
  otpStore.set(email, {
    otp,
    purpose,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });
  return otp;
};

const isOtpValid = (email, otp, purpose) => {
  const record = otpStore.get(email);
  if (!record) return false;
  if (record.purpose !== purpose) return false;
  if (record.expiresAt < Date.now()) return false;
  return record.otp === otp;
};

export const sendOtp = async (req, res) => {
  try {
    const { email, purpose = "signup" } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (purpose === "reset-password") {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(404).json({ success: false, message: "User does not exist. Please sign up first." });
      }
    }

    const otp = setOtpRecord(normalizedEmail, purpose);

    const mailResult = await sendOtpEmail({ to: normalizedEmail, otp, purpose });
    if (!mailResult.sent && process.env.NODE_ENV !== "development") {
      return res.status(500).json({
        success: false,
        message: "Email delivery is not configured. Please set SMTP credentials in backend/.env.",
      });
    }

    return res.status(200).json({
      success: true,
      message: mailResult.sent ? "OTP sent to email" : "OTP generated successfully (SMTP not configured)",
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, purpose = "signup" } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!isOtpValid(normalizedEmail, otp, purpose)) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    verifiedEmails.set(normalizedEmail, { purpose, verifiedAt: Date.now() });
    return res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const signup = async (req, res) => {
  try {
    const { fullName, email, mobile, password, otp, role = "user", vehicle, vehicleNumber, type = "cab" } = req.body;
    if (!fullName || !email || !mobile || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const verification = verifiedEmails.get(normalizedEmail);
    if (!verification || verification.purpose !== "signup") {
      return res.status(400).json({ success: false, message: "Please verify OTP before signing up" });
    }

    if (!otp || !isOtpValid(normalizedEmail, otp, "signup")) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email: normalizedEmail,
      mobile,
      password: hashedPassword,
      emailVerified: true,
      role: isAdminEmail(normalizedEmail) ? "admin" : role,
    });

    if (user.role === "driver") {
      await Driver.create({
        userId: user._id,
        vehicle: vehicle || "Standard Sedan",
        vehicleNumber: vehicleNumber || "RJ-14-XX-0000",
        type: type || "cab",
        availability: "Offline",
      });
    }

    otpStore.delete(normalizedEmail);
    verifiedEmails.delete(normalizedEmail);

    const token = createToken(user._id.toString());

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id.toString());

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: "User does not exist. Please sign up first." });
    }

    const otp = setOtpRecord(normalizedEmail, "reset-password");

    const mailResult = await sendOtpEmail({ to: normalizedEmail, otp, purpose: "reset-password" });
    if (!mailResult.sent && process.env.NODE_ENV !== "development") {
      return res.status(500).json({
        success: false,
        message: "Email delivery is not configured. Please set SMTP credentials in backend/.env.",
      });
    }

    return res.status(200).json({
      success: true,
      message: mailResult.sent ? "Password reset OTP sent to email" : "Password reset OTP generated successfully (SMTP not configured)",
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: "Email, OTP and new password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!isOtpValid(normalizedEmail, otp, "reset-password")) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findOneAndUpdate(
      { email: normalizedEmail },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    otpStore.delete(normalizedEmail);
    verifiedEmails.delete(normalizedEmail);

    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
