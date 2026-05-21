# 🏗️ Ghumo Jaipur - Architecture & Design Patterns

## **System Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
│  (React App - localhost:5173)                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  User Interface Components                          │    │
│  │  - Pages (Home, Explore, Profile, etc)             │    │
│  │  - Components (Cards, Forms, Navigation)           │    │
│  │  - State Management (useState, useReducer)         │    │
│  └─────────────────────────────────────────────────────┘    │
│            ↓ HTTP Requests (Axios)                          │
│            ↑ JSON Responses                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER                           │
│              (localhost:5000/api/*)                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Routes Layer                                       │    │
│  │  - /api/places                                      │    │
│  │  - /api/users                                       │    │
│  │  - /api/food                                        │    │
│  └─────────────────────────────────────────────────────┘    │
│            ↓ Request forwarding                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Controllers Layer (Business Logic)                 │    │
│  │  - Validate input                                   │    │
│  │  - Process data                                     │    │
│  │  - Call models                                      │    │
│  └─────────────────────────────────────────────────────┘    │
│            ↓ Database queries                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Models Layer (Mongoose Schemas)                    │    │
│  │  - User schema                                      │    │
│  │  - Place schema                                     │    │
│  │  - Trip schema                                      │    │
│  └─────────────────────────────────────────────────────┘    │
│            ↓ Mongoose ODM                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  MongoDB DATABASE                           │
│  Collections:                                               │
│  - users                                                    │
│  - places                                                   │
│  - food                                                     │
│  - transport                                                │
│  - trips                                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## **Design Patterns Used**

### **1. MVC (Model-View-Controller) Pattern**

**Why:** Separates concerns into distinct layers

```
Backend:
├── Models (M)        → Database schema (User, Place, Food)
├── Controllers (C)   → Business logic (getUser, createTrip)
└── Routes (V)        → API endpoints (/api/users, /api/places)

Frontend:
├── Components (V)    → React components displaying UI
└── Services (C)      → API calls and data fetching
```

**Benefit:** Easy to test, maintain, and scale

---

### **2. Repository Pattern (in Models)**

Each model exports functions:
```javascript
// models/User.js
export const createUser = async (userData) => { ... }
export const getUserById = async (id) => { ... }
export const updateUser = async (id, data) => { ... }
export const deleteUser = async (id) => { ... }
```

**Benefit:** Centralized database access, easy to change DB later

---

### **3. Service Layer Pattern (in API calls)**

Frontend has separate `services/api.js`:
```javascript
// services/api.js
export const getPlaces = async () => { ... }
export const searchPlaces = async (query) => { ... }
export const createTrip = async (tripData) => { ... }
```

**Benefit:** Reusable API calls across multiple components

---

### **4. Middleware Pattern (Express)**

Functions that run before route handlers:
```javascript
// Validate request
app.use(express.json())

// Handle CORS
app.use(cors())

// Authenticate user
router.get("/protected", authMiddleware, controllerFunction)
```

**Benefit:** Cross-cutting concerns separated from business logic

---

## **Backend Flow Explanation**

### **Step-by-Step: User Makes API Request**

#### **1. Frontend Initiates Request**
```javascript
// App.jsx or any component
const response = await getTestData();  // From api.js
```

#### **2. API Service Prepares Request**
```javascript
// services/api.js
export const getTestData = async () => {
  return apiClient.get("/test");  // Makes GET to http://localhost:5000/api/test
}
```

#### **3. HTTP Request Travels Over Network**
```
GET http://localhost:5000/api/test
Headers: { "Content-Type": "application/json" }
```

#### **4. Express Server Receives Request**
```javascript
// server.js
app.use("/api/test", testRoutes);  // Routes to test.js
```

#### **5. Route Handler Processes**
```javascript
// routes/test.js
router.get("/", getTestData);  // Forwards to controller
```

#### **6. Controller Executes Business Logic**
```javascript
// controllers/testController.js
export const getTestData = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Test API GET route working!",
    data: { places: [...] }
  });
}
```

#### **7. Response Sent Back**
```json
{
  "success": true,
  "message": "Test API GET route working!",
  "data": { "places": [...], "timestamp": "2026-05-21..." }
}
```

#### **8. Frontend Receives & Processes**
```javascript
// App.jsx
const result = await getTestData();
setData(result);  // Update state
// Component re-renders with new data
```

---

## **State Management Strategy**

### **Frontend State (React)**

**Local Component State (useState)**
```javascript
const [places, setPlaces] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

When we need global state, we'll add **Context API or Redux** (future):
```javascript
// User stays logged in across pages
// Trip data shared between components
```

### **Backend State (Database)**

Persistent state stored in MongoDB:
```javascript
// User state: saved in users collection
// Trip state: saved in trips collection
// Authentication state: stored as JWT token on client
```

---

## **Error Handling Strategy**

### **Frontend Error Handling**
```javascript
try {
  const data = await getTestData();
  setData(data);
} catch (error) {
  setError("Failed to fetch data");
  console.error(error);
}
```

### **Backend Error Handling**
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : ""
  });
});
```

---

## **Security Considerations**

### **1. Environment Variables**
```
✅ Secrets in .env (never committed)
❌ Hardcoded secrets in code
```

### **2. CORS Configuration**
```javascript
// Only allow localhost:5173
cors({
  origin: "http://localhost:5173",
  credentials: true
})
```

### **3. JWT Authentication (Future)**
```javascript
// Token sent with every protected request
headers: { Authorization: `Bearer ${token}` }
```

### **4. Password Hashing**
```javascript
// Never store plain passwords
const hash = await bcrypt.hash(password, 10);
```

---

## **Database Design Decisions**

### **Why MongoDB?**

| Aspect | SQL | MongoDB | Our Choice |
|--------|-----|---------|-----------|
| Schema | Fixed | Flexible | MongoDB ✅ |
| Complex Queries | Strong | Moderate | MongoDB OK |
| Setup | Complex | Simple | MongoDB ✅ |
| Good for | Large enterprises | Startups/MVP | MongoDB ✅ |

### **Data Structure for Places**

```javascript
{
  _id: ObjectId,           // Unique identifier
  name: String,            // "Hawa Mahal"
  description: String,     // Detailed description
  location: String,        // Address
  coordinates: {           // For maps
    latitude: Number,
    longitude: Number
  },
  rating: Number,          // 1-5 stars
  totalReviews: Number,    // Number of reviews
  timings: String,         // "9:00 AM - 5:30 PM"
  entryFee: Number,        // In rupees
  createdAt: Date,         // When created
  updatedAt: Date          // When updated
}
```

---

## **API Response Format (REST Convention)**

### **Success Response**
```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": { ... },
  "timestamp": "2026-05-21T10:30:00Z"
}
```

### **Error Response**
```json
{
  "success": false,
  "error": "Invalid request",
  "message": "Name field is required",
  "statusCode": 400
}
```

---

## **HTTP Status Codes We'll Use**

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET/PUT/PATCH |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Not logged in |
| 403 | Forbidden | Logged in but no access |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend error |

---

## **Scalability Considerations**

### **Phase 1 (Current)**
- Single Express server
- Local MongoDB
- Suitable for: MVP, learning, small traffic

### **Phase 2 (Future)**
- Multiple Express instances (load balancing)
- MongoDB Atlas (cloud)
- Caching with Redis
- Suitable for: Growing user base

### **Phase 3 (Enterprise)**
- Microservices (separate services for places, users, trips)
- Message queues (RabbitMQ, Kafka)
- GraphQL instead of REST
- Suitable for: Large-scale app

---

## **Development vs Production**

### **Development (.env)**
```
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ghumo-jaipur
JWT_SECRET=simple_secret_for_development
```

### **Production (.env)**
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ghumo-jaipur
JWT_SECRET=very_long_random_secret_generated
```

**Changes:**
- Production uses MongoDB Atlas
- Stronger JWT secret
- HTTPS instead of HTTP
- Domain-specific CORS
- Error messages less detailed

---

## **Testing Strategy (Future)**

### **Unit Tests**
```javascript
// Test individual functions
test("validateEmail returns true for valid email", () => {
  expect(validateEmail("user@example.com")).toBe(true);
});
```

### **Integration Tests**
```javascript
// Test API endpoints
test("GET /api/places returns array", async () => {
  const response = await request(app).get("/api/places");
  expect(response.status).toBe(200);
  expect(Array.isArray(response.body.data)).toBe(true);
});
```

### **End-to-End Tests**
```javascript
// Test full user flows
test("User can login and view trips", async () => {
  // Login user
  // Navigate to trips page
  // Verify trips displayed
});
```

---

## **Performance Optimization Tips**

### **Frontend**
- Code splitting (lazy loading pages)
- Image optimization
- Caching API responses
- Debouncing search

### **Backend**
- Database indexing on frequently searched fields
- Pagination (don't return all data at once)
- Caching with Redis
- API request rate limiting

### **General**
- Compress responses (gzip)
- CDN for static files
- Monitor with APM tools

---

## **Directory Structure Rationale**

```
backend/
├── config/        → Configurations (DB, auth, env)
├── routes/        → API endpoint definitions
├── controllers/   → Business logic
├── models/        → Database schemas
├── middleware/    → Cross-cutting concerns
└── server.js      → Entry point

Why this structure?
- Clear separation of concerns
- Easy to find what you need
- Scalable as app grows
- Industry standard
```

---

## **Key Principles to Follow**

### **1. Single Responsibility Principle**
```
❌ Don't: Controller that connects to DB, validates, and sends email
✅ Do: Controller validates, calls model, calls email service
```

### **2. DRY (Don't Repeat Yourself)**
```
❌ Don't: Validation logic in multiple controllers
✅ Do: Create validation middleware used everywhere
```

### **3. KISS (Keep It Simple, Stupid)**
```
❌ Don't: Complex nested logic, 10 levels of callbacks
✅ Do: Simple functions, use async/await, clear variable names
```

### **4. Fail Fast**
```
❌ Don't: Let invalid data propagate through system
✅ Do: Validate at entry point, return error immediately
```

---

## **Communication Protocols**

### **REST API Convention**

```
GET    /api/places          → Fetch all places
GET    /api/places/:id      → Fetch specific place
POST   /api/places          → Create new place
PUT    /api/places/:id      → Update place
DELETE /api/places/:id      → Delete place
```

**Why REST?**
- Simple HTTP methods
- Stateless (no server memory needed)
- Cacheable
- Scalable
- Widely understood

---

**Next Topic:** User Authentication with JWT

**Key Takeaway:** Good architecture makes code:
- ✅ Maintainable
- ✅ Testable
- ✅ Scalable
- ✅ Readable
- ✅ Professional
