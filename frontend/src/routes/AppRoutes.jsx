import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Places from "../pages/Places";
import SavedTrips from "../pages/SavedTrips";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import ProtectedRoute from "../components/ProtectedRoute";
import MyRides from "../pages/MyRides";
import SharedRides from "../pages/SharedRides";
import PlaceDetails from "../pages/PlaceDetails";
import AdminPlaces from "../pages/AdminPlaces";
import AdminDrivers from "../pages/AdminDrivers";
import AdminUsers from "../pages/AdminUsers";
import TransportSearch from "../pages/TransportSearch";
import BookCab from "../pages/BookCab";
import BookAuto from "../pages/BookAuto";
import BookingSuccess from "../pages/BookingSuccess";
import DriverDashboard from "../pages/DriverDashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/places" element={<Places />} />
      <Route path="/places/:id" element={<PlaceDetails />} />
      <Route path="/transport" element={<TransportSearch />} />
      <Route path="/book/cab" element={<BookCab />} />
      <Route path="/book/auto" element={<BookAuto />} />
      <Route path="/book/success/:id" element={<BookingSuccess />} />
      <Route path="/saved-trips" element={<ProtectedRoute><SavedTrips /></ProtectedRoute>} />
      <Route path="/my-rides" element={<ProtectedRoute><MyRides /></ProtectedRoute>} />
      <Route path="/shared-rides" element={<ProtectedRoute><SharedRides /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/driver/dashboard" element={<ProtectedRoute><DriverDashboard /></ProtectedRoute>} />
      <Route path="/admin/places" element={<ProtectedRoute adminOnly><AdminPlaces /></ProtectedRoute>} />
      <Route path="/admin/drivers" element={<ProtectedRoute adminOnly><AdminDrivers /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}
