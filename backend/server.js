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
app.use(express.urlencoded({ extended: true }));

// Enable CORS - allows frontend to communicate with backend
const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
const defaultOrigins = [
  "https://shehersaathi.com",
  "https://www.shehersaathi.com",
  "http://localhost:5173",
  "http://localhost:5001",
  "http://localhost:3000"
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (
      defaultOrigins.includes(origin) ||
      allowedOrigins.includes(origin) ||
      allowedOrigins.includes("*") ||
      origin.endsWith(".vercel.app") ||
      origin.endsWith("shehersaathi.com") ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }

    console.warn(`CORS blocked for origin: ${origin}`);
    return callback(null, false);
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
    message: "🚀 Sheher Saathi Backend Server is Running",
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
  console.log(`🚀 Sheher Saathi Backend is running on port ${PORT}`);
});
