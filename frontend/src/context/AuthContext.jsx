import React, { createContext, useState, useEffect } from "react";
import apiClient, {
  sendOtpApi,
  verifyOtpApi,
  signupApi,
  loginApi,
  forgotPasswordApi,
  resetPasswordApi,
} from "../services/api";

// AuthContext provides authentication state and actions to the app.
// It persists the session in localStorage and talks to the backend API.

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("ghumo_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("ghumo_token") || "");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Persist user to localStorage
    if (user) localStorage.setItem("ghumo_user", JSON.stringify(user));
    else localStorage.removeItem("ghumo_user");
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("ghumo_token", token);
    else localStorage.removeItem("ghumo_token");
  }, [token]);

  const normalizeUser = (payloadUser, driverProfile = null) => ({
    id: payloadUser?.id || payloadUser?._id,
    name: payloadUser?.name || payloadUser?.fullName,
    email: payloadUser?.email,
    mobile: payloadUser?.mobile,
    role: payloadUser?.role || "user",
    rating: payloadUser?.rating || 5.0,
    driverRating: driverProfile?.rating,
    vehicle: driverProfile?.vehicle,
    vehicleNumber: driverProfile?.vehicleNumber,
    isVerified: driverProfile?.isVerified,
    status: driverProfile?.status,
    profilePicture: driverProfile?.profilePicture,
    idProof: driverProfile?.idProof,
    licenseProof: driverProfile?.licenseProof,
    vehicleProof: driverProfile?.vehicleProof,
  });

  const login = async ({ email, password, remember }) => {
    setLoading(true);
    try {
      const res = await loginApi({ email, password, remember });
      const nextUser = normalizeUser(res.user, res.driverProfile);
      setUser(nextUser);
      setToken(res.token || "");
      return { success: true, user: nextUser };
    } catch (error) {
      return { success: false, message: error?.response?.data?.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload) => {
    setLoading(true);
    try {
      const res = await signupApi(payload);
      const nextUser = normalizeUser(res.user, res.driverProfile);
      setUser(nextUser);
      setToken(res.token || "");
      return { success: true, user: nextUser };
    } catch (error) {
      return { success: false, message: error?.response?.data?.message || "Signup failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
  };

  const sendOTP = async (email, purpose = "signup") => {
    setLoading(true);
    try {
      const res = await sendOtpApi(email, purpose);
      return { success: true, message: res.message, otp: res.otp };
    } catch (error) {
      return { success: false, message: error?.response?.data?.message || "OTP send failed" };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email, otp, purpose = "signup") => {
    setLoading(true);
    try {
      const res = await verifyOtpApi(email, otp, purpose);
      return { success: true, message: res.message };
    } catch (error) {
      return { success: false, message: error?.response?.data?.message || "OTP verification failed" };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const res = await forgotPasswordApi(email);
      return { success: true, message: res.message, otp: res.otp };
    } catch (error) {
      return { success: false, message: error?.response?.data?.message || "Forgot password failed" };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async ({ email, otp, newPassword }) => {
    setLoading(true);
    try {
      const res = await resetPasswordApi({ email, otp, newPassword });
      return { success: true, message: res.message };
    } catch (error) {
      return { success: false, message: error?.response?.data?.message || "Reset password failed" };
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await apiClient.get("/auth/me");
      if (res.data.success) {
        const nextUser = normalizeUser(res.data.user, res.data.driverProfile);
        setUser(nextUser);
      }
    } catch (error) {
      console.error("Failed to refresh user data", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        loading,
        login,
        signup,
        logout,
        sendOTP,
        verifyOTP,
        forgotPassword,
        resetPassword,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
