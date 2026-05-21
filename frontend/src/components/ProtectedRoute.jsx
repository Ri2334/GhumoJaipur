import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

// Protects routes: if user not logged in, redirect to /login
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useContext(AuthContext)
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />
  return children
}
