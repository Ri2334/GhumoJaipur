# 🚀 Getting Started with Ghumo Jaipur

## **Prerequisites**
- Node.js (v14+) - [Download here](https://nodejs.org/)
- MongoDB - [Install locally](https://docs.mongodb.com/manual/installation/) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Git (optional)
- Terminal/Command Prompt

---

## **Step-by-Step Setup Instructions**

### **1. Install MongoDB (if not already installed)**

**Option A: Local Installation (macOS)**
```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify MongoDB is running
mongo --version
```

**Option B: Cloud MongoDB Atlas**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get connection string
5. Update `backend/.env` with your connection string

### **2. Setup Backend**

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# You should see these packages installed:
# - express (web framework)
# - mongoose (MongoDB ODM)
# - dotenv (environment variables)
# - cors (cross-origin requests)
# - jsonwebtoken (authentication)
# - bcryptjs (password hashing)
# - nodemon (auto-reload during development)
```

**Verify `.env` file exists** with:
```
MONGODB_URI=mongodb://localhost:27017/ghumo-jaipur
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_this_in_production_12345
CORS_ORIGIN=http://localhost:5173
```

### **3. Start Backend Server**

```bash
# From backend folder
npm run dev

# Expected output:
# ✅ MongoDB Connected: localhost
# 🌍 Server running on http://localhost:5000
```

**Test Backend:**
Open in browser: `http://localhost:5000`
You should see: `{ "message": "🚀 Ghumo Jaipur Backend Server is Running", "version": "1.0.0" }`

### **4. Setup Frontend**

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# You should see these packages installed:
# - react (UI library)
# - react-dom (React renderer)
# - vite (build tool)
# - tailwindcss (styling framework)
# - axios (HTTP client)
```

**Verify `.env.local` file exists** with:
```
VITE_API_URL=http://localhost:5000/api
```

### **5. Start Frontend Server**

```bash
# From frontend folder
npm run dev

# Expected output:
# VITE v4.4.9  ready in 123 ms
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help
```

**Browser should open automatically** at `http://localhost:5173`

---

## **📲 Testing the Full Stack**

1. **Backend Connection Test:**
   - Open DevTools (F12 → Network tab)
   - You should see green checkmarks for API calls
   - If red X, backend isn't running

2. **Frontend Test:**
   - You should see "Backend Connected!" message
   - Popular places listed: City Palace, Hawa Mahal, Albert Hall Museum

3. **Test API Communication:**
   - Enter your name in the form
   - Click "Send Data to Backend"
   - You should see success message
   - Data submitted to backend

---

## **🔍 Understanding the Data Flow**

### **GET Request (Fetch Data)**
```
Click "Refresh" button
    ↓
fetchTestData() function runs
    ↓
Axios makes GET to http://localhost:5000/api/test
    ↓
Backend server receives request
    ↓
testController.getTestData() processes
    ↓
Returns JSON with places and timestamp
    ↓
React state updates with setData()
    ↓
Component re-renders showing places
```

### **POST Request (Send Data)**
```
Enter name and click "Send Data to Backend"
    ↓
handleSubmit() function runs
    ↓
postTestData(name) called
    ↓
Axios makes POST to http://localhost:5000/api/test with { name: "Your Name" }
    ↓
Backend receives POST request
    ↓
testController.postTestData() validates name
    ↓
Returns success message
    ↓
Alert pops up
    ↓
fetchTestData() runs to refresh data
```

---

## **📁 File Structure Quick Reference**

```
Backend Entry: backend/server.js
├── Connects to MongoDB (config/db.js)
├── Sets up CORS & JSON middleware
├── Registers routes (routes/test.js)
│   └── Routes to controllers (controllers/testController.js)
└── Listens on port 5000

Frontend Entry: frontend/src/main.jsx
├── Mounts React to index.html
├── Loads App.jsx component
└── App.jsx
    ├── Calls API (services/api.js)
    ├── Manages state (useState)
    ├── Handles effects (useEffect)
    └── Renders UI with Tailwind CSS
```

---

## **⚡ Common Commands**

```bash
# Backend
cd backend
npm install        # Install dependencies
npm run dev       # Start server with auto-reload
npm start         # Start server (production)

# Frontend
cd frontend
npm install       # Install dependencies
npm run dev       # Start dev server
npm run build     # Build for production

# MongoDB
mongod            # Start MongoDB server
mongo             # Connect to MongoDB CLI
```

---

## **🐛 Troubleshooting**

### **Problem: "Cannot connect to MongoDB"**
```
Solution:
1. Check if mongod is running: ps aux | grep mongod
2. If not, start it: mongod
3. If using MongoDB Atlas, verify connection string in .env
```

### **Problem: "Cannot GET /"** on localhost:5173
```
Solution:
1. Make sure frontend npm run dev is running
2. Check if terminal shows "Local: http://localhost:5173"
```

### **Problem: "API calls failing" (Network tab shows red X)**
```
Solution:
1. Check if backend is running
2. Verify VITE_API_URL in frontend/.env.local
3. Check CORS_ORIGIN in backend/.env
4. Look at browser console for exact error
```

### **Problem: "Port 5000/5173 already in use"**
```bash
# macOS
lsof -ti:5000 | xargs kill -9  # Kill port 5000
lsof -ti:5173 | xargs kill -9  # Kill port 5173

# Linux
fuser -k 5000/tcp
fuser -k 5173/tcp
```

### **Problem: "npm command not found"**
```
Solution:
1. Reinstall Node.js from https://nodejs.org/
2. Restart terminal
3. Verify: node -v && npm -v
```

---

## **📚 Understanding the Tech Stack**

### **Express.js**
- Web framework for Node.js
- Handles HTTP requests
- Routes requests to controllers
- Example: `app.get("/api/test", controllerFunction)`

### **MongoDB**
- NoSQL database
- Stores data as JSON-like documents
- No schema required (flexible)
- Example: `{ name: "Hawa Mahal", city: "Jaipur" }`

### **Mongoose**
- Schema layer on top of MongoDB
- Validates data before saving
- Defines relationships between collections
- Example: User has many Trips

### **React**
- UI library
- Components = reusable UI pieces
- State = component data
- Props = pass data between components

### **Vite**
- Fast build tool and dev server
- Hot Module Replacement (HMR) - auto-reload
- Instant feedback while coding
- Faster than Webpack

### **Tailwind CSS**
- Utility-first CSS framework
- Classes like `bg-blue-500`, `text-white`
- No custom CSS needed for simple designs
- Responsive design with `md:`, `lg:` prefixes

---

## **✅ Next Steps After Setup**

1. Play with the test API form
2. Open DevTools → Network tab to see requests/responses
3. Modify `testController.js` to return different data
4. Try styling App.jsx with different Tailwind classes
5. Read the main README.md for architecture details
6. Get ready for Feature 1: User Authentication

---

## **💡 Interview Preparation**

After successfully running the app, understand these questions:

1. **"How does frontend communicate with backend?"**
   - Answer: Via HTTP REST APIs using Axios/Fetch

2. **"What is CORS?"**
   - Answer: Allows requests from different domains (localhost:5173 → localhost:5000)

3. **"Why separate frontend and backend?"**
   - Answer: Scalability, independent deployment, different tech stacks

4. **"How does authentication work?"**
   - Answer: Will implement JWT tokens in next phase

5. **"What is MongoDB?"**
   - Answer: NoSQL database, stores JSON-like documents, flexible schema

---

## **🎯 Success Criteria**

You've successfully set up when:
- ✅ Backend running on http://localhost:5000
- ✅ Frontend running on http://localhost:5173
- ✅ Browser shows "Backend Connected!" message
- ✅ Can submit name and get success alert
- ✅ No errors in console or terminal

---

**Congratulations! 🎉 Your MERN stack is ready!**

Next session: Building User Authentication
