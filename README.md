# Ghumo Jaipur

Master README for the Ghumo Jaipur project.

See the canonical project context and architecture in PROJECT_CONTEXT.md

- Project context: [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)

Quick start (developer): see `PROJECT_CONTEXT.md` for detailed run instructions.
# 🎉 Ghumo Jaipur - Full Stack Tourism Web Application

A MERN stack application to help tourists explore Jaipur: attractions, food, transport options, prices, and save personalized trips.

---

## 📋 **Project Structure**

```
GhumoJaipur/
├── backend/                          # Express.js + MongoDB
│   ├── server.js                     # Entry point
│   ├── config/
│   │   └── db.js                     # MongoDB connection
│   ├── routes/
│   │   └── test.js                   # API routes
│   ├── controllers/
│   │   └── testController.js         # Business logic
│   ├── middleware/                   # Auth, validation, error handling
│   ├── models/                       # Mongoose schemas
│   ├── package.json
│   ├── .env                          # Environment secrets
│   └── .gitignore
│
├── frontend/                         # React + Vite + Tailwind
│   ├── src/
│   │   ├── main.jsx                  # Entry point
│   │   ├── App.jsx                   # Root component
│   │   ├── index.css                 # Tailwind CSS
│   │   ├── pages/                    # Page components
│   │   ├── components/               # Reusable components
│   │   └── services/
│   │       └── api.js                # API calls (axios)
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   ├── .env.local
│   └── .gitignore
│
└── README.md
```

---

## 🚀 **Quick Start Guide**

### **Prerequisites**
- Node.js (v14+)
- MongoDB (running locally or cloud instance)
- npm or yarn

### **1. Install Backend Dependencies**

```bash
cd backend
npm install
```

### **2. Start MongoDB**

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Update `MONGODB_URI` in `.env` with your connection string

### **3. Start Backend Server**

```bash
npm run dev
# Server runs on http://localhost:5000
```

Test the API:
```bash
curl http://localhost:5000/
curl http://localhost:5000/api/test
```

### **4. Install Frontend Dependencies**

```bash
cd frontend
npm install
```

### **5. Start Frontend Development Server**

```bash
npm run dev
# Opens automatically at http://localhost:5173
```

---

## 📚 **Architecture Explanation**

### **How Frontend & Backend Communicate**

```
User Browser
    ↓
React App (localhost:5173)
    ↓
Axios HTTP Request
    ↓
Express Server (localhost:5000)
    ↓
MongoDB Database
    ↓
Response JSON back to React
    ↓
Component State Update
    ↓
UI Renders
```

### **Tech Stack Breakdown**

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React + Vite | Fast, modern UI framework |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **HTTP Client** | Axios | Simple API calls |
| **Backend** | Express.js | Lightweight web server |
| **Database** | MongoDB + Mongoose | NoSQL database + schema |
| **Auth** | JWT | Stateless authentication |
| **Security** | bcryptjs | Password hashing |

---

## 📝 **File Explanations**

### **Backend Files**

#### `server.js` - Entry Point
- Initializes Express app
- Connects to MongoDB
- Sets up middleware (CORS, JSON parsing)
- Registers routes
- Starts server on PORT 5000

#### `config/db.js` - MongoDB Connection
- Connects to MongoDB using Mongoose
- Handles connection errors
- Exported as a function called in server.js

#### `routes/test.js` - API Routes
- Defines GET and POST endpoints
- Routes requests to controllers
- Pattern: `/api/test` endpoints

#### `controllers/testController.js` - Business Logic
- Contains handler functions for routes
- Validates input
- Processes data
- Sends response to client

#### `.env` - Environment Variables
- Secrets that shouldn't be in code
- Database URI, JWT secret, CORS origin
- Never commit to Git

### **Frontend Files**

#### `index.html` - HTML Template
- Entry point for Vite
- Contains `<div id="root">` where React mounts
- Loads JavaScript

#### `main.jsx` - React Entry
- Imports App component
- Renders React to DOM
- Sets up ReactDOM

#### `App.jsx` - Root Component
- Main application component
- Contains state (useState)
- Side effects (useEffect)
- Calls API functions
- Renders UI

#### `services/api.js` - API Service
- Axios instance with base URL
- Exported functions for API calls
- Centralized API logic
- Easy to modify base URL

#### `index.css` - Tailwind CSS
- Imports Tailwind directives
- Global CSS reset
- Custom fonts

#### `vite.config.js` - Vite Configuration
- React plugin setup
- Dev server port (5173)
- Build configuration

#### `tailwind.config.js` - Tailwind Configuration
- CSS content paths
- Custom colors
- Extends default theme

#### `.env.local` - Frontend Environment
- API base URL
- `VITE_` prefix makes it accessible in code

---

## 🔄 **Data Flow Example (Test API)**

### **GET Request Flow:**
1. User opens app
2. `useEffect` calls `fetchTestData()`
3. `getTestData()` from api.js makes HTTP GET to `/api/test`
4. Backend route receives GET request
5. `testController.getTestData()` processes and returns JSON
6. Axios response goes to React state
7. Component re-renders with data

### **POST Request Flow:**
1. User enters name and clicks "Send Data to Backend"
2. `handleSubmit()` calls `postTestData(inputName)`
3. Axios makes HTTP POST to `/api/test` with `{ name }`
4. Backend route receives POST request
5. `testController.postTestData()` validates and processes
6. Returns success response
7. Alert shown and data refreshed

---

## 🔐 **JWT Authentication (Overview)**

When we build auth later:

```javascript
// Login - Backend creates token
const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Frontend stores token
localStorage.setItem("token", token);

// Every request includes token
headers: { Authorization: `Bearer ${token}` }

// Backend verifies token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

---

## 💾 **MongoDB Collections (Future)**

```javascript
// Users
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  createdAt: Date
}

// Places
{
  _id: ObjectId,
  name: String,
  description: String,
  location: String,
  rating: Number,
  timings: String
}

// Trips
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  places: [ObjectId] (ref: Place),
  startDate: Date,
  endDate: Date
}
```

---

## ❓ **Common Interview Questions**

### **Backend**
1. **What is CORS?** - Allows frontend to call backend API
2. **What is MongoDB?** - NoSQL database storing JSON-like documents
3. **What is Mongoose?** - ODM (Object Data Modeling) for MongoDB
4. **What is JWT?** - Token-based authentication mechanism
5. **What is middleware?** - Functions that run before route handlers

### **Frontend**
1. **What is Vite?** - Fast build tool for modern web apps
2. **What is useState?** - Hook for managing component state
3. **What is useEffect?** - Hook for side effects (API calls, etc.)
4. **What is Axios?** - Promise-based HTTP client
5. **What is Tailwind?** - Utility-first CSS framework

### **Full Stack**
1. **How does frontend and backend communicate?** - HTTP REST APIs with JSON
2. **What happens when user clicks button?** - Event → API call → Backend processing → Response → State update → Re-render
3. **Why separate frontend and backend?** - Scalability, maintainability, independent deployment
4. **How is data stored?** - MongoDB stores, Mongoose validates, Express serves via APIs

---

## 🐛 **Troubleshooting**

### **Backend Issues**

#### MongoDB Connection Error
```
Solution: Ensure mongod is running or update MONGODB_URI in .env
```

#### Port 5000 Already in Use
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9
```

### **Frontend Issues**

#### API Call Failed
```
Solution: Check if backend is running on http://localhost:5000
Check VITE_API_URL in .env.local
```

#### Tailwind CSS Not Working
```bash
# Rebuild CSS
npm run build
```

---

## 📦 **Next Steps**

1. ✅ Initialize project structure
2. ✅ Set up Express server
3. ✅ Connect MongoDB
4. ✅ Create test API
5. ⬜ **Build User Authentication** (Login/Signup)
6. ⬜ Create Place & Location models
7. ⬜ Build Food recommendations API
8. ⬜ Build Transport options API
9. ⬜ Build Trip saving feature
10. ⬜ Deploy to production

---

## 📞 **Support & Resources**

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Happy Coding! 🚀**
