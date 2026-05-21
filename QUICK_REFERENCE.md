# ⚡ Ghumo Jaipur - Developer Quick Reference

## 🚀 **Quick Start (Copy-Paste)**

```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend  
cd frontend
npm install
npm run dev

# Open http://localhost:5173 in browser
```

**Expected:** See "Backend Connected!" message on page ✅

---

## 📱 **File Modifications Cheat Sheet**

### **Want to modify API response?**
File: `backend/controllers/testController.js`
```javascript
export const getTestData = (req, res) => {
  res.status(200).json({
    success: true,
    message: "YOUR MESSAGE HERE",  // ← Modify this
    data: {
      places: ["Place 1", "Place 2"],  // ← Or this
      timestamp: new Date().toISOString()
    }
  });
};
```

### **Want to modify UI?**
File: `frontend/src/App.jsx`
```javascript
// Modify the JSX inside return statement
return (
  <div className="...">
    {/* Change text, colors, layout here */}
    <h1>Your New Title</h1>
  </div>
);
```

### **Want to add new API endpoint?**
1. Create route in `backend/routes/yourRoute.js`
2. Create controller in `backend/controllers/yourController.js`
3. Import and register in `backend/server.js`
4. Call from frontend using `services/api.js`

### **Want to change Tailwind colors?**
File: `frontend/tailwind.config.js`
```javascript
theme: {
  extend: {
    colors: {
      primary: "#YOUR_COLOR",      // ← Change here
      secondary: "#YOUR_COLOR",    // ← Change here
    }
  },
}
```

### **Want to change MongoDB URI?**
File: `backend/.env`
```
MONGODB_URI=YOUR_NEW_CONNECTION_STRING
```

---

## 🔗 **API Endpoints Reference**

### **Currently Available**

| Method | Endpoint | Purpose | Example |
|--------|----------|---------|---------|
| GET | `/` | Health check | `curl http://localhost:5000` |
| GET | `/api/test` | Get test data | Returns places list |
| POST | `/api/test` | Send test data | Send `{ name: "John" }` |

### **cURL Commands to Test**

```bash
# Test server health
curl http://localhost:5000

# Get test data
curl http://localhost:5000/api/test

# Send test data
curl -X POST http://localhost:5000/api/test \
  -H "Content-Type: application/json" \
  -d '{"name":"Your Name"}'
```

---

## 🎨 **Component Structure Reference**

### **How Components Talk to Backend**

```javascript
import { useState, useEffect } from "react";
import { getTestData } from "./services/api";

function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getTestData();  // Call API
      setData(result);  // Update state
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {data && <p>{data.message}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

---

## 📁 **File Paths Reference**

```
Backend Files:
├── server.js                           → Main server file
├── config/db.js                        → MongoDB connection
├── routes/test.js                      → API routes definition
├── controllers/testController.js       → Business logic
├── models/                             → Database schemas (add here)
├── middleware/                         → Auth, validation (add here)
├── .env                                → Secrets (NEVER COMMIT)
└── package.json                        → Dependencies

Frontend Files:
├── index.html                          → HTML template
├── src/main.jsx                        → React entry point
├── src/App.jsx                         → Main component
├── src/index.css                       → Tailwind CSS
├── src/services/api.js                 → API calls
├── src/pages/                          → Page components (add here)
├── src/components/                     → UI components (add here)
├── vite.config.js                      → Vite configuration
├── tailwind.config.js                  → Tailwind configuration
├── .env.local                          → Frontend env vars
└── package.json                        → Dependencies
```

---

## 🐛 **Debugging Guide**

### **Problem: "Cannot GET /"**
```
❌ Frontend not running
✅ Solution: npm run dev in frontend folder
```

### **Problem: API calls returning 404**
```
❌ Endpoint doesn't exist
✅ Solution: Check routes/test.js for correct path
```

### **Problem: CORS error in console**
```
❌ Backend not allowing frontend
✅ Solution: Check CORS_ORIGIN in backend/.env = http://localhost:5173
```

### **Problem: MongoDB connection error**
```
❌ MongoDB not running
✅ Solution: Run mongod in terminal
```

### **Problem: Styling not applied**
```
❌ Tailwind CSS not compiled
✅ Solution: Restart dev server or npm run build
```

### **View Error Details**
```
1. Open Browser DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Go to Network tab to see API requests/responses
5. Check terminal where npm run dev is running
```

---

## 🔄 **Common Workflows**

### **Workflow 1: Add New API Endpoint**

```bash
# Step 1: Create route
# File: backend/routes/newRoute.js
import { getNewData } from "../controllers/newController.js";
const router = express.Router();
router.get("/", getNewData);
export default router;

# Step 2: Create controller
# File: backend/controllers/newController.js
export const getNewData = (req, res) => {
  res.json({ success: true, data: [...] });
};

# Step 3: Register in server
# File: backend/server.js
import newRoutes from "./routes/newRoute.js";
app.use("/api/new", newRoutes);

# Step 4: Call from frontend
# File: frontend/src/services/api.js
export const getNewData = () => apiClient.get("/new");
```

### **Workflow 2: Modify Existing Component**

```bash
# Step 1: Make changes to App.jsx (UI/Logic)
# Step 2: Save file (hot reload happens automatically)
# Step 3: Check browser (should update instantly)
# Step 4: If errors, check console for messages
```

### **Workflow 3: Debug API Issue**

```bash
# Step 1: Check if backend is running
# Terminal: npm run dev in backend folder

# Step 2: Test API directly
# curl http://localhost:5000/api/test

# Step 3: Check browser DevTools Network tab
# Look for failed requests

# Step 4: Check .env files match
# backend/.env vs frontend/.env.local

# Step 5: Check CORS settings
# backend/.env CORS_ORIGIN = http://localhost:5173
```

---

## 📊 **Environment Variables Explained**

### **Backend (.env)**
| Variable | Purpose | Example |
|----------|---------|---------|
| MONGODB_URI | Database connection | mongodb://localhost:27017/ghumo-jaipur |
| PORT | Server port | 5000 |
| NODE_ENV | Development/Production | development |
| JWT_SECRET | Token signing key | random_secret_key_here |
| CORS_ORIGIN | Allowed frontend URL | http://localhost:5173 |

### **Frontend (.env.local)**
| Variable | Purpose | Example |
|----------|---------|---------|
| VITE_API_URL | Backend API base URL | http://localhost:5000/api |

---

## 🎯 **Response Format Reference**

### **Success Response Structure**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-05-21T10:30:00Z"
}
```

### **Error Response Structure**
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

---

## 📝 **Code Commenting Standards**

### **Comments We Use**
```javascript
// Single line comment
/*
  Multi-line comment
  for complex logic
*/

// ✅ Do this - clear intent
const connectDB = async () => {
  // Connect to MongoDB using URI from environment
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  return conn;
};

// ❌ Don't do this - unclear
const f = async () => {
  const c = await m.connect(p.m);
  return c;
};
```

---

## 🚀 **Performance Tips**

### **Frontend**
```javascript
// Good - lazy load data
const [data, setData] = useState(null);
useEffect(() => {
  fetchData();  // Only on mount
}, []);

// Avoid - fetching in every render
// Don't do this!
const data = await fetchData();  // Will run every render!
```

### **Backend**
```javascript
// Good - async/await
const user = await User.findById(id);

// Avoid - nested callbacks
User.findById(id, (err, user) => {
  if (err) { ... }
  // ...
});
```

---

## 💡 **Pro Tips**

### **Tip 1: Use DevTools Effectively**
- F12 opens DevTools
- Network tab shows API calls
- Console shows errors
- Elements tab shows HTML structure

### **Tip 2: Read Error Messages Carefully**
- Errors tell you exactly what's wrong
- Google the error message
- Check file paths and names (case-sensitive on Mac/Linux)

### **Tip 3: Keep Console Open While Developing**
- Catch errors immediately
- Understand data flow
- See console.log() outputs

### **Tip 4: Use Descriptive Variable Names**
```javascript
// ✅ Good
const touristPlaces = await getPlaces();
const userName = req.body.name;

// ❌ Bad
const p = await gp();
const n = req.body.n;
```

### **Tip 5: Test Incrementally**
- Make small changes
- Test immediately
- Don't change 10 things at once

---

## 🔐 **Security Reminders**

```
⚠️ IMPORTANT:
- Never commit .env files
- Never share JWT_SECRET
- Always validate user input
- Use HTTPS in production
- Don't log sensitive data
- Use environment variables for secrets
```

---

## 📞 **Quick Troubleshooting Matrix**

| Symptom | Cause | Fix |
|---------|-------|-----|
| Page shows "Cannot GET /" | Frontend not running | npm run dev in frontend |
| "Cannot connect to MongoDB" | MongoDB not running | Run mongod |
| "API is undefined" | api.js not imported | Add import statement |
| Styling looks wrong | Tailwind not compiled | Restart dev server |
| "CORS error" | Backend blocking frontend | Check .env CORS_ORIGIN |
| No data displaying | useEffect not fetching | Check API call |
| "Port already in use" | Another process on port | Kill it: lsof -ti:PORT | xargs kill -9 |
| Changes not reflecting | Hot reload not working | Restart dev server |
| "Cannot find module" | Package not installed | npm install |
| Infinite loop | Missing dependency in useEffect | Add proper dependencies |

---

## 🎓 **Interview Prep - Quick Answers**

**Q: How does your app work?**
A: React frontend sends HTTP requests to Express backend, which queries MongoDB and returns JSON. Data updates React state and re-renders UI.

**Q: What's the tech stack?**
A: MongoDB (database), Express (backend), React (frontend), Node.js (runtime). Vite for build, Tailwind for styling.

**Q: How do you handle errors?**
A: Try-catch in async functions, error middleware in Express, console logging for debugging.

**Q: What's next?**
A: Add user authentication with JWT, then build place/food APIs, then trip management features.

---

**🚀 You're ready to code! Start with: `npm run dev` in both folders!**
