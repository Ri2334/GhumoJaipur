# 📖 Line-by-Line Code Explanation - Ghumo Jaipur

This document explains every important line of code in the project. Perfect for interview prep and understanding the codebase.

---

## 🔧 BACKEND CODE EXPLANATION

### **1. backend/server.js - Main Entry Point**

```javascript
import express from "express";
// Import the express framework for creating web server
// Think: Blueprint for building web applications

import cors from "cors";
// Import CORS middleware
// Think: Permission for frontend (http://localhost:5173) to talk to backend

import dotenv from "dotenv";
// Import dotenv to load environment variables from .env file
// Think: Access to secrets like DB password, JWT secret, etc.

import connectDB from "./config/db.js";
// Import MongoDB connection function
// Think: Opens connection to database when app starts

import testRoutes from "./routes/test.js";
// Import test routes
// Think: Contains API endpoints like /api/test

dotenv.config();
// Load all variables from .env file into process.env
// Think: Now we can use process.env.MONGODB_URI, etc.

const app = express();
// Create Express application
// Think: This is our server that listens for HTTP requests

connectDB();
// Connect to MongoDB when server starts
// Think: Opens database connection pool

app.use(express.json());
// Middleware: Parse incoming JSON requests into JavaScript objects
// Think: When frontend sends { name: "John" }, this converts it to object

app.use(cors({
  origin: process.env.CORS_ORIGIN,  // Allow only localhost:5173
  credentials: true,                 // Allow cookies
}));
// Middleware: Enable CORS from specific origin
// Think: Only this frontend URL can call this backend

app.use("/api/test", testRoutes);
// Register test routes
// Think: Any request to /api/test goes to testRoutes file

app.get("/", (req, res) => {
  // Route: GET / (home route)
  // req = incoming request, res = response to send back
  res.json({ 
    message: "🚀 Ghumo Jaipur Backend Server is Running",
    version: "1.0.0"
  });
  // Send JSON response
  // Think: Browser shows this when you visit http://localhost:5000
});

app.use((err, req, res, next) => {
  // Error handling middleware (catches all errors)
  // This runs if any error occurs
  console.error(err.stack);
  res.status(500).json({ 
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : ""
  });
  // Send error response
  // Think: Gracefully handle crashes instead of server dying
});

const PORT = process.env.PORT || 5000;
// Get PORT from .env or use 5000 as default
// Think: Server listens on this port

app.listen(PORT, () => {
  console.log(`🌍 Server running on http://localhost:${PORT}`);
  // Server starts listening for requests
  // Think: Now it's ready to receive requests
});
```

**Interview Q&A:**
- Q: What does `app.use()` do?
  - A: Registers middleware or routes that run on every request
- Q: What is CORS?
  - A: Allows frontend from different origin (port) to make requests
- Q: Why use environment variables?
  - A: Keep secrets out of code, easy to change for different environments

---

### **2. backend/config/db.js - MongoDB Connection**

```javascript
import mongoose from "mongoose";
// Import Mongoose - provides schema validation on top of MongoDB

const connectDB = async () => {
  // Async function because database operations are slow (I/O)
  // Think: This might take 1-2 seconds to connect
  
  try {
    // Try block - execute code that might fail
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    // Connect to MongoDB with URI from .env
    // Think: Opens TCP connection to MongoDB server
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    // Print success message with server hostname
    // Think: User knows connection succeeded
    
    return conn;
    // Return connection object (though we don't use it here)
  } catch (error) {
    // Catch block - if connection fails, execute this
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
    // Exit process with error code 1
    // Think: Don't start server if can't connect to DB
  }
};

export default connectDB;
// Export function so server.js can use it
```

**Interview Q&A:**
- Q: What is async/await?
  - A: Makes asynchronous code look like synchronous; we wait for result
- Q: Why exit if MongoDB fails?
  - A: Can't serve requests without database, so no point running
- Q: What's in process.env.MONGODB_URI?
  - A: Connection string from .env, like `mongodb://localhost:27017/dbname`

---

### **3. backend/routes/test.js - API Routes**

```javascript
import { getTestData, postTestData } from "../controllers/testController.js";
// Import controller functions
// Think: These functions handle the actual business logic

import express from "express";
// Import express to create router

const router = express.Router();
// Create a mini router (subset of main app)
// Think: Separate routes file keeps code organized

router.get("/", getTestData);
// Route: GET /api/test
// When someone sends GET request to /api/test, call getTestData function
// Think: Frontend code: await axios.get('/api/test')

router.post("/", postTestData);
// Route: POST /api/test
// When someone sends POST with data, call postTestData function
// Think: Frontend code: await axios.post('/api/test', { name: '...' })

export default router;
// Export router so server.js can register it
```

**Interview Q&A:**
- Q: What's the difference between GET and POST?
  - A: GET retrieves data, POST sends data to server
- Q: Why separate routes from controllers?
  - A: Routes define endpoints, controllers contain logic (Separation of Concerns)
- Q: What happens when POST request comes?
  - A: Route matches /api/test POST, calls postTestData controller function

---

### **4. backend/controllers/testController.js - Business Logic**

```javascript
export const getTestData = (req, res) => {
  // Handler for GET /api/test
  // req = HTTP request object, res = HTTP response object
  
  res.status(200).json({
    // Send response with status 200 (OK)
    // .json() automatically sets Content-Type: application/json
    success: true,
    // Flag to show operation succeeded
    message: "Test API GET route working!",
    // Message for frontend to display
    data: {
      places: ["City Palace", "Hawa Mahal", "Albert Hall Museum"],
      timestamp: new Date().toISOString()
      // Current time in ISO format
    }
  });
};

export const postTestData = (req, res) => {
  // Handler for POST /api/test
  
  const { name } = req.body;
  // Destructure 'name' from request body
  // Think: Get data that frontend sent with POST
  
  if (!name) {
    // Validate that name exists
    return res.status(400).json({
      // Return early with 400 error (Bad Request)
      success: false,
      error: "Name is required"
    });
    // Return keyword stops execution here
  }

  res.status(201).json({
    // 201 = Created (POST success status)
    success: true,
    message: "Test data received successfully",
    data: {
      name: name,
      // Echo back the name user sent
      timestamp: new Date().toISOString()
    }
  });
};
```

**Interview Q&A:**
- Q: What's req.body?
  - A: Request body - data sent by frontend in POST request
- Q: What are HTTP status codes?
  - A: 200=OK, 201=Created, 400=Bad Request, 404=Not Found, 500=Server Error
- Q: Why validate input?
  - A: Prevent invalid data from going to database

---

### **5. backend/.env - Configuration**

```
MONGODB_URI=mongodb://localhost:27017/ghumo-jaipur
# Connection string for local MongoDB
# Format: mongodb://[host]:[port]/[database_name]

PORT=5000
# Backend server runs on this port
# Can change to 3000, 8000, etc. if 5000 is taken

NODE_ENV=development
# Development mode (vs production)
# Affects error messages, logging, etc.

JWT_SECRET=your_jwt_secret_key_change_this_in_production_12345
# Secret key to sign JWT tokens (for login later)
# Must be long and random in production

CORS_ORIGIN=http://localhost:5173
# Only this frontend URL can call this backend
# Prevents cross-site attacks
```

**Interview Q&A:**
- Q: Why not commit .env?
  - A: Contains secrets; if leaked, anyone can access our database/services
- Q: What's in .gitignore?
  - A: Files Git should ignore, usually includes .env, node_modules/

---

## 🎨 FRONTEND CODE EXPLANATION

### **6. frontend/src/services/api.js - API Communication**

```javascript
import axios from "axios";
// Import Axios HTTP client
// Think: Tool for making HTTP requests from browser

const apiClient = axios.create({
  // Create reusable axios instance
  baseURL: import.meta.env.VITE_API_URL,
  // Base URL from .env.local (http://localhost:5000/api)
  // Think: All API calls start with this URL
  
  headers: {
    "Content-Type": "application/json",
    // Tell backend we're sending JSON
  },
});

export const getTestData = async () => {
  // Async function because API calls are slow (network delay)
  try {
    const response = await apiClient.get("/test");
    // Make GET request to http://localhost:5000/api/test
    // Wait for response (that's what await does)
    return response.data;
    // Return just the data part (not headers, status, etc.)
  } catch (error) {
    console.error("Error fetching test data:", error);
    throw error;
    // Re-throw error so component can handle it
  }
};

export const postTestData = async (name) => {
  // Async function to send data to backend
  try {
    const response = await apiClient.post("/test", { name });
    // POST request with name in body
    // Think: { name: "John" } becomes JSON and sent to server
    return response.data;
  } catch (error) {
    console.error("Error posting test data:", error);
    throw error;
  }
};

export default apiClient;
// Export instance for use in other files if needed
```

**Interview Q&A:**
- Q: Why create axios instance instead of calling directly?
  - A: Centralize configuration, reusable, easy to modify baseURL
- Q: What's import.meta.env?
  - A: Vite's way to access environment variables in frontend
- Q: What does await do?
  - A: Waits for async operation to complete before continuing

---

### **7. frontend/src/App.jsx - Main Component**

```javascript
import { useState, useEffect } from "react";
// Import React hooks
// useState = manage component state
// useEffect = run code after component renders

import { getTestData, postTestData } from "./services/api";
// Import API functions

function App() {
  // React functional component
  
  const [data, setData] = useState(null);
  // State for storing fetched data
  // data = current value, setData = function to update it
  // Initial value = null (no data yet)
  
  const [loading, setLoading] = useState(false);
  // Loading state (true = fetching, false = done)
  
  const [inputName, setInputName] = useState("");
  // State for input field value
  
  const [error, setError] = useState(null);
  // State for error messages

  useEffect(() => {
    // Run this code after component mounts
    // Like "initialization" code
    fetchTestData();
  }, []);
  // Empty dependency array [] = run only once on mount

  const fetchTestData = async () => {
    // Fetch data from backend
    setLoading(true);
    setError(null);
    try {
      const result = await getTestData();
      // Call API and wait for result
      setData(result);
      // Update state with result
      // This triggers re-render
    } catch (err) {
      setError("Failed to fetch data from backend");
      console.error(err);
    } finally {
      // Runs regardless of success or error
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    // Handle form submission
    e.preventDefault();
    // Prevent page reload on form submit
    
    if (!inputName.trim()) {
      // Validate input isn't empty
      setError("Please enter a name");
      return;
    }

    try {
      const result = await postTestData(inputName);
      // Send data to backend
      alert(`Success: ${result.message}`);
      setInputName("");
      // Clear input
      fetchTestData();
      // Refresh data
    } catch (err) {
      setError("Failed to submit data");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Main container with gradient background */}
      
      <header className="bg-gradient-to-r from-primary to-secondary text-white py-8 shadow-lg">
        {/* Header section */}
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold">🎉 Ghumo Jaipur</h1>
          {/* Main heading */}
          <p className="text-blue-100 mt-2">Tourism & Travel Guide for Jaipur</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Data display section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Backend Status</h2>
          
          {loading ? (
            <p className="text-blue-500 font-semibold">⏳ Loading...</p>
          ) : error ? (
            <p className="text-red-500 font-semibold">❌ {error}</p>
          ) : data ? (
            // Show data if available
            <div className="space-y-3">
              <p className="text-green-600 font-semibold">✅ Backend Connected!</p>
              <p className="text-gray-700"><strong>Message:</strong> {data.message}</p>
              <div>
                <p className="text-gray-700 font-semibold mb-2">Popular Places:</p>
                <ul className="list-disc list-inside space-y-1">
                  {data.data?.places?.map((place, idx) => (
                    // Loop through places array and display each
                    <li key={idx} className="text-gray-600">{place}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        {/* Form section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Test API Communication</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* onSubmit triggers handleSubmit when form submitted */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Enter Your Name:
              </label>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                // When user types, update state
                placeholder="e.g., John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              Send Data to Backend
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
// Export component so main.jsx can use it
```

**Interview Q&A:**
- Q: What's a React hook?
  - A: Function that lets functional components use state and other React features
- Q: Difference between useState and useEffect?
  - A: useState manages data, useEffect handles side effects (API calls)
- Q: What's e.preventDefault()?
  - A: Stops default form behavior (page reload) on submit
- Q: What triggers component re-render?
  - A: When state changes (setState is called)

---

### **8. frontend/vite.config.js - Build Configuration**

```javascript
import { defineConfig } from 'vite'
// Import Vite config helper

import react from '@vitejs/plugin-react'
// Import React plugin for Vite

export default defineConfig({
  // Export configuration object
  
  plugins: [react()],
  // Enable React support in Vite
  // Think: Vite knows how to handle JSX files
  
  server: {
    port: 5173,
    // Frontend runs on this port
    open: true,
    // Auto-open browser when dev server starts
  },
})
```

---

### **9. frontend/tailwind.config.js - Styling Configuration**

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Tell Tailwind where to find classes to include
    // Think: Scan these files for class names, include only used ones
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B6B",    // Custom color
        secondary: "#4ECDC4",  // Custom color
        // Use: className="bg-primary text-secondary"
      }
    },
  },
  plugins: [],
}
```

---

### **10. frontend/.env.local - Configuration**

```
VITE_API_URL=http://localhost:5000/api
# Backend API base URL
# VITE_ prefix makes it accessible in React code
# Think: import.meta.env.VITE_API_URL gets this value
```

---

## 🔄 **Complete Data Flow Example**

### **Scenario: User clicks "Send Data to Backend"**

**Step 1: User Event**
```javascript
// User types name and clicks button
onClick → handleSubmit(event)
```

**Step 2: Frontend Processing**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();  // Stop page reload
  
  // Validate
  if (!inputName.trim()) {
    setError("Please enter a name");
    return;
  }
  
  // Call API
  const result = await postTestData(inputName);
  // This calls: apiClient.post("/test", { name })
}
```

**Step 3: HTTP Request**
```
POST http://localhost:5000/api/test HTTP/1.1
Content-Type: application/json
{
  "name": "John"
}
```

**Step 4: Backend Processing**
```javascript
// routes/test.js
router.post("/", postTestData);

// controllers/testController.js
export const postTestData = (req, res) => {
  const { name } = req.body;  // Get name from request
  
  if (!name) {
    return res.status(400).json({ error: "Required" });
  }
  
  res.status(201).json({
    success: true,
    message: "Test data received successfully",
    data: { name: name, timestamp: "..." }
  });
}
```

**Step 5: HTTP Response**
```
HTTP/1.1 201 Created
Content-Type: application/json
{
  "success": true,
  "message": "Test data received successfully",
  "data": { "name": "John", "timestamp": "2026-05-21..." }
}
```

**Step 6: Frontend Updates**
```javascript
const result = await postTestData(inputName);
// result = { success: true, message: "...", data: {...} }

alert(`Success: ${result.message}`);
// Show alert: "Success: Test data received successfully"

setInputName("");
// Clear input field (triggers re-render)

fetchTestData();
// Refresh data (another API call)
```

**Step 7: UI Updates**
```
Component re-renders with new state
Alert appears → User reads message → Alert dismissed
```

---

## 🎓 **Key Concepts Summary**

| Concept | Frontend | Backend |
|---------|----------|---------|
| **Entry Point** | index.html → main.jsx | server.js |
| **State** | useState (component) | Database (MongoDB) |
| **API Call** | axios.get/post | app.get/post |
| **Error Handling** | try-catch | try-catch + middleware |
| **Hot Reload** | Vite HMR | Nodemon |
| **Communication** | HTTP Fetch | Express Router |
| **Validation** | JavaScript | Mongoose + Controller |

---

**📚 Next Step:** Run `npm run dev` in both folders and test the app!
