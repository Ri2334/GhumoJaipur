# PROJECT CONTEXT — Ghumo Jaipur

Last updated: 2026-05-21

This document is the single-source master context for the Ghumo Jaipur application. It preserves architecture decisions, completed features, business logic (especially transport logic), database schemas, API references, folder structure, current status, and roadmap. Use this file to onboard new developers, drive future AI-assisted changes, or resume development in any environment.

---

## Project Overview

- **Project Name:** Ghumo Jaipur
- **Project Type:** Smart Tourism + Local Transport Recommendation System
- **Main Goal:** Help tourists intelligently travel around Jaipur by recommending and comparing transport options (metro, buses/public transport, autos, cabs, walking, shared rides) and provide a connected tourism experience (places, reviews, saved trips).

Key product capabilities:
- Place discovery (Explore, Place Details, Reviews)
- User accounts with OTP-based verification and JWT auth
- Persisted Saved Trips and Reviews
- Smart Transport Assistant: computes routes, metro simulation, fare/time estimates, and produces cheapest/fastest/recommended options

Design principles:
- Practical realism: recommendations use realistic Jaipur station/place data seeded in the DB.
- Incremental accuracy: simulation is realistic enough for demo and heuristic-driven improvement.
- Extensibility: models and controllers are structured to accept real-time providers later.

---

## Tech Stack

- Frontend: React (Vite), Tailwind CSS, React Router, Axios
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT Auth, Nodemailer
- Dev tools: nodemon, Vite, seed scripts

---

## Completed Features (high level)

1. Authentication System
   - Signup, Login
   - OTP verification (email via Nodemailer)
   - Forgot/reset password flows
   - JWT token issuance and `protect` middleware for protected routes

2. Navbar & Layout
   - Responsive navbar with profile dropdown and auth-aware links

3. Tourism Module
   - Explore places page, search, filtering, category chips
   - Place details page with gallery, description, food & nearby transport cards

4. User Features
   - Profile page
   - Saved trips (persisted in MongoDB) + UI toggles to save/remove

5. Reviews
   - Add/read place reviews, rating aggregation on Place document

6. Smart Transport System (Core)
   - Jaipur metro route simulation and metro route builder
   - Multi-modal transport comparison (bus, auto, cab, shared cab, metro, walking)
   - Fare/time estimation heuristics
   - Recommendation badges (cheapest, fastest, recommended)
   - Distance-based walking rules (walking hidden if distance > 2km)

---

## Transport Business Logic (detailed)

This section documents the heuristics, rules, and algorithms currently implemented in `transportController` and related models.

1) Walking rules
- Walking is allowed and presented only when computed straight-line distance <= 2.0 km (haversine distance). This protects UX from offering unrealistic walking options.
- Walk time is estimated with an assumed average walking speed of 5 km/h (i.e., time = distance / 5 * 60 minutes).

2) Metro route rules
- Metro network is modelled as `MetroStation` nodes and `MetroRoute` blueprints. The search engine finds the nearest station to source/destination (exact match or via `TouristLocation` lookup).
- Metro path is assembled using pre-seeded sequences of stations (seedTransport.js provides realistic Jaipur lines).
- Transfer logic: current implementation supports linear metro lines; transfers (multi-line) simulated by joining lines where seed data contains connecting stations.
- Metro travel time: station-to-station time uses a fixed per-hop time (configurable, default ~2 minutes per station) plus boarding/waiting overhead (default ~4 minutes).

3) Fare estimation
- Modeled per-mode heuristics:
  - Auto (three-wheeler): base fare + per-km multiplier. Availability simulated; fares include a small surge factor for short hops.
  - Cab (app-like): base fare + distance * per-km + time component. Simulates surge and service fees.
  - Shared cab: fare = cabFare * splitFactor (e.g., 0.4–0.6) depending on occupancy and probability of successful matching.
  - Bus: flat or low per-km fare, assumed slower than auto but cheaper.
  - Metro: fare derived from number of hops between stations and a metro fare table or simple per-hop cost.

4) Transport recommendation logic
- The engine builds a candidate list of transport items with properties: { mode, estimatedTime, estimatedFare, convenienceScore, seatsAvailable, reliabilityScore }.
- It computes three badges:
  - `isCheapest`: smallest estimatedFare among feasible options.
  - `isFastest`: smallest estimatedTime.
  - `isRecommended`: composite rank combining convenienceScore (user comfort, transfers), time, and fare; tuned to prefer low-time + low-cost balanced options. Recommendation also downranks walking for distances close to threshold if terrain/UX hints exist.

5) Shared ride logic
- Shared rides are simulated with:
  - `matchProbability`: chance to find a sharer for the same route (higher in dense areas/tourist hubs).
  - `splitFareFactor`: how much each rider pays; calculated from occupancy and matchProbability.
  - `extraTimePenalty`: expected detour / pickup overhead time added to trip time.
- If matchProbability < threshold, shared ride option is shown but marked lower on recommended list.

6) Waiting time simulation
- Simple random/heuristic wait time per transport mode:
  - Auto: 2–6 minutes (depends on proximity and surge)
  - Cab: 2–10 minutes (simulated availability)
  - Shared ride: 3–12 minutes (matching time)
  - Metro: scheduled frequency based on simulated headways (e.g., 6–12 minutes)
- Waiting time added to total estimatedTime for ranking.

7) Realistic Jaipur routes
- Project seeds a set of real Jaipur metro stations and tourist locations (e.g., Railway Station, Sindhi Camp, Badi Chopar, Hawa Mahal, Amber Fort) in `scripts/seedTransport.js` and `scripts/seedPlaces.js`.
- Transport route selection uses seeded connectivity to build plausible metro itineraries and to compute station hops.

Notes on extensibility:
- All numeric constants (walk threshold, per-km multipliers, waiting overheads) are intentionally tuned as constants in `transportController` and can be moved to configuration or feature flags.
- Real-time data can replace simulation by adding provider adapters (e.g., operator APIs, GTFS feeds) that conform to the candidate item shape.

---

## Real Jaipur Data (what's seeded)

The project includes seed scripts that populate MongoDB with realistic local data for Jaipur. Key seeded datasets:
- Metro stations (ordered arrays for each metro line): names, lat/lon, station codes.
- Tourist locations: curated list used by autos, transport suggestions, and place linking.
- Places: a short catalog of places (Hawa Mahal, City Palace, Jantar Mantar, Jal Mahal, Amber Fort, Badi Chopar, etc.), with descriptions, images, timings, categories, and nearby foods.

This seeded data is used in demo and testing. See `scripts/seedTransport.js` and `scripts/seedPlaces.js` for exact data arrays used.

---

## Database Schemas (models) — canonical descriptions

All schemas are Mongoose models. Below are simplified canonical versions and relationship notes. Use the actual model files in the backend for exact fields and indexes.

1) User
```js
{
  _id: ObjectId,
  name: String,
  email: { type: String, unique: true },
  password: String, // stored hashed with bcrypt
  role: String, // 'user' | 'admin'
  emailVerified: Boolean,
  createdAt: Date
}
```

2) TouristPlace (Place)
```js
{
  _id: ObjectId,
  name: String,
  description: String,
  location: { type: { lat: Number, lng: Number }, text: String },
  images: [String],
  rating: Number, // aggregated average
  reviewCount: Number,
  timings: String,
  ticketPrice: Number,
  category: String,
  bestVisitTime: String,
  nearbyFoods: [{ name, distanceKm }],
  transportOptions: [ { mode, note } ],
  createdBy: ObjectId (User),
  createdAt: Date
}
```

3) SavedTrip
```js
{
  _id: ObjectId,
  user: ObjectId (ref User),
  place: ObjectId (ref TouristPlace),
  note: String,
  createdAt: Date
}
```

4) Review (embedded on TouristPlace)
```js
{
  _id: ObjectId,
  user: ObjectId (ref User),
  rating: Number,
  comment: String,
  createdAt: Date
}
```

5) MetroStation
```js
{
  _id: ObjectId,
  name: String,
  code: String,
  lat: Number,
  lng: Number,
  line: String
}
```

6) MetroRoute (seeded blueprint)
```js
{
  _id: ObjectId,
  lineName: String,
  stations: [ObjectId of MetroStation in order],
  headwayMins: Number
}
```

7) TransportRoute (persisted search results)
```js
{
  _id: ObjectId,
  source: String,
  destination: String,
  distanceKm: Number,
  candidates: [ { mode, fare, timeMinutes, extraInfo } ],
  createdAt: Date
}
```

8) SharedRide (simulation record)
```js
{
  _id: ObjectId,
  routeRef: ObjectId (TransportRoute),
  matchProbability: Number,
  splitFareFactor: Number,
  expectedExtraMinutes: Number
}
```

Relationships:
- `SavedTrip.user` -> User
- `SavedTrip.place` -> TouristPlace
- `Review.user` -> User (embedded on TouristPlace)
- `MetroRoute.stations` -> MetroStation
- `TransportRoute.candidates` contain synthesized options (no direct refs required)

---

## API Documentation (selected endpoints)

Note: API root is `/api` (backend default server runs on PORT 5001 in development). Use `Authorization: Bearer <token>` for protected endpoints.

1) Auth
- POST `/api/auth/send-otp`
  - Body: `{ "email": "user@example.com", "purpose": "signup" | "reset-password" }`
  - Response: `{ success: true, message: 'OTP sent' }`

- POST `/api/auth/verify-otp`
  - Body: `{ "email": "user@example.com", "otp": "123456" }`
  - Response: `{ success: true, token?: '<jwt>' }` (signup flows issue token on verify)

- POST `/api/auth/signup`
  - Body: `{ name, email, password }`
  - Response: `{ success: true, user, token }`

- POST `/api/auth/login`
  - Body: `{ email, password }`
  - Response: `{ success: true, user, token }`

2) Places
- GET `/api/places` — list places with filters
  - Query: `q`, `category`, `sort`, `page`
  - Response: `{ success: true, data: [Place], total }`

- GET `/api/places/:id` — place details
  - Response: `{ success: true, data: Place }`

- POST `/api/places` — create (admin/protected)
  - Body: Place fields
  - Response: `{ success: true, data: Place }`

- POST `/api/places/:id/reviews` — add review (protected)
  - Body: `{ rating, comment }`
  - Response: `{ success: true, data: review }`

3) Saved Trips
- GET `/api/saved-trips` — get user saved trips (protected)
  - Response: `{ success: true, data: [SavedTrip] }`

- POST `/api/saved-trips` — save trip (protected)
  - Body: `{ placeId }`
  - Response: `{ success: true, data: SavedTrip }`

- DELETE `/api/saved-trips/:id` — delete saved trip (protected)

4) Transport
- GET `/api/transport/stations` — returns seeded metro stations

- GET `/api/transport/locations` — returns tourist location suggestions

- POST `/api/transport/search` — main transport assistant search
  - Body: `{ "source": "Jaipur Railway Station", "destination": "Badi Chopar" }`
  - Response (example):
```json
{
  "success": true,
  "data": {
    "distanceKm": 3.4,
    "walkingAllowed": false,
    "candidates": [
      { "mode": "Auto", "fare": 80, "timeMinutes": 11, "isCheapest": false, "isFastest": false },
      { "mode": "Cab", "fare": 95, "timeMinutes": 9, "isCheapest": false, "isFastest": true },
      { "mode": "Shared Cab", "fare": 36, "timeMinutes": 10, "isCheapest": true },
      { "mode": "Metro", "fare": 20, "timeMinutes": 41, "isRecommended": false }
    ],
    "recommended": { "mode": "Auto" },
    "metroPath": ["Railway Station","Sindhi Camp","Chandpole","Badi Chopar"]
  }
}
```

Notes:
- `candidates` entries may include `waitingMinutes`, `transferCount`, `seatsAvailable`, `extraInfo`.
- The endpoint also persists a `TransportRoute` for analytics/demo (configurable).

---

## Folder Structure (recommended and current)

Backend (server):

```
/backend
├─ server.js                 # Express app bootstrap
├─ .env                     # env vars (DB, JWT, MAIL settings)
├─ package.json
├─ controllers/
│  ├─ authController.js
│  ├─ placeController.js
│  ├─ transportController.js
│  └─ savedTripController.js
├─ models/
│  ├─ User.js
│  ├─ Place.js
│  ├─ SavedTrip.js
│  ├─ MetroStation.js
│  ├─ MetroRoute.js
│  └─ TransportRoute.js
├─ routes/
│  ├─ auth.js
│  ├─ places.js
│  ├─ transport.js
│  └─ savedTrips.js
├─ utils/
│  └─ mailer.js
└─ scripts/
   ├─ seedPlaces.js
   └─ seedTransport.js
```

Frontend (client):

```
/frontend (Vite + React)
├─ package.json
├─ src/
│  ├─ main.jsx
│  ├─ App.jsx
│  ├─ index.css (Tailwind)
│  ├─ context/AuthContext.jsx
│  ├─ services/api.js
│  ├─ pages/
│  │  ├─ Explore.jsx
│  │  ├─ PlaceDetails.jsx
│  │  ├─ TransportSearch.jsx
│  │  └─ SavedTrips.jsx
│  └─ components/
│     ├─ Navbar.jsx
│     ├─ PlaceCard.jsx
│     ├─ TransportCard.jsx
│     └─ RouteTimeline.jsx
```

---

## Current Project Status

Completed:
- All features listed in "Completed Features" above are implemented and smoke-tested locally.

Partially completed / simulated:
- Shared ride matching: simulated heuristics rather than real matching.
- Map visualizations: currently a Google Maps iframe placeholder; full-featured Leaflet/Mapbox integration pending.
- Real-time transport timings: waiting and headways are simulated.

Pending / future improvements:
- Replace simulation with real-time provider data (GTFS, operator APIs)
- Improve shared ride matching and persistence
- Add admin moderation for reviews, places and transport seeds
- Comprehensive tests and CI/CD pipelines

---

## Future Roadmap (recommended)

Short term:
- Integrate a map library (Leaflet or Mapbox) for interactive routing and map markers
- Add configuration file for transport constants (walk threshold, per-km fares)
- Expose analytics endpoints for transport usage and candidate performance

Mid term:
- Add GTFS/real-time transit ingestion for buses/metro (if available)
- Implement shared-ride marketplace: persistent rider requests, matching engine, web sockets
- Add payment integration (stripe) for fare estimation accuracy and bookings (optional)

Long term:
- ML-powered personalized recommendations using user preferences and past saved trips
- Deploy to production with Docker Compose / Kubernetes, add monitoring (Prometheus/Grafana)
- Admin dashboard for content moderation, seed management, and transport provider config

---

## Developer Notes & How to Run Locally

Prereqs:
- Node.js (v18+ recommended), npm
- MongoDB Atlas connection string or local MongoDB

Backend (example):
```bash
cd backend
cp .env.example .env  # fill MONGODB_URI, JWT_SECRET, MAIL_*
npm install
npm run seed:places
npm run seed:transport
npm run dev
```

Frontend (example):
```bash
cd frontend
npm install
npm run dev
```

Smoke test transport API:
```bash
curl -X POST http://localhost:5001/api/transport/search \
  -H 'Content-Type: application/json' \
  -d '{"source":"Jaipur Railway Station","destination":"Badi Chopar"}'
```

---

## Where to look in the codebase

- Transport logic: `backend/controllers/transportController.js` and `backend/models/*Transport*.js`
- Seed data: `backend/scripts/seedTransport.js`, `backend/scripts/seedPlaces.js`
- Frontend transport UI: `frontend/src/pages/TransportSearch.jsx`, `frontend/src/components/RouteTimeline.jsx`
- Auth & OTP: `backend/controllers/authController.js`, `backend/utils/mailer.js`, frontend `AuthContext.jsx`

If you need a precise code pointer, open the files above — they contain the canonical implementations.

---

## Conventions & Recommendations for Future AI Chats

- When modifying transport heuristics, update these files in tandem:
  1. `backend/controllers/transportController.js` — main logic
  2. `backend/models/TransportRoute.js` — persistence schema
  3. `backend/scripts/seedTransport.js` — seeded station/route data
  4. `frontend/src/pages/TransportSearch.jsx` & `frontend/src/components/TransportCard.jsx` — UI presentation

- Unit test candidate functions first (distance, fare calculators) before changing high-level ranking logic.
- Keep constants (per-km rates, thresholds) in a single config module or environment variables for experimentation and A/B testing.

---

If anything in this file becomes outdated during development, update this file immediately — it is the canonical project context for all future work and AI-enabled reasoning.

Contact: Project owner (local repository) for clarifications: owner@example.com
