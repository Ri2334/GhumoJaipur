import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import testRoutes from "./routes/test.js";
import authRoutes from "./routes/auth.js";
import placeRoutes from "./routes/placeRoutes.js";
import savedTripRoutes from "./routes/savedTripRoutes.js";
import transportRoutes from "./routes/transportRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import sharedRoutes from "./routes/sharedRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// Parse incoming JSON requests
app.use(express.json());

// Enable CORS - allows frontend to communicate with backend
const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // In development, allow all origins if CORS_ORIGIN is not set
    if (process.env.NODE_ENV === 'development' && allowedOrigins.length === 0) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      return callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
      return callback(new Error('CORS blocked by server'), false);
    }
  },
  credentials: true,
}));

// Routes
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/saved-trips", savedTripRoutes);
app.use("/api/transport", transportRoutes);
app.use("/api/bookings", bookingRoutes);
app.use('/api/shared-rides', sharedRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/admin", adminRoutes);

// Basic health check route
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 Ghumo Jaipur Backend Server is Running",
    version: "1.0.0"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : ""
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Ghumo Jaipur Backend is running on port ${PORT}`);
});
