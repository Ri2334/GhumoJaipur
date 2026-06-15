# 🏛️ Ghumo Jaipur: Smart Tourism & Local Transport Assistant

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-blue)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%7C%20Mongoose-darkgreen)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT%20%7C%20OTP-orange)](https://jwt.io/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel-black)](https://ghumo-jaipur.vercel.app)

**Ghumo Jaipur** is a comprehensive smart tourism platform designed to enhance the travel experience in Jaipur, India. It combines a sophisticated recommendation engine for local transport with a rich tourism discovery module, helping users navigate the "Pink City" intelligently based on cost, time, and convenience.

🔗 **Live Demo:** [ghumo-jaipur.vercel.app](https://ghumo-jaipur.vercel.app)  
🔗 **Repository:** [github.com/Ri2334/GhumoJaipur](https://github.com/Ri2334/GhumoJaipur)

---

## 🚀 Problem Statement
Navigating a historic city like Jaipur can be overwhelming for tourists due to fragmented transport options (Metro, E-rickshaws, Buses, Cabs) and fluctuating prices. Ghumo Jaipur solves this by:
- Consolidating all transport modes into a single **Smart Transport Assistant**.
- Providing **real-time heuristic-based** fare and time estimations.
- Bridging the gap between **tourist attractions** and the **most efficient way to reach them**.

---

## ✨ Key Features

### 🛠️ Smart Transport Engine
- **Multi-modal Comparison:** Compare Metro, Public Buses, Cabs, Autos, and Walking in a single view.
- **Intelligent Recommendations:** Automatic tagging of options as **"Cheapest"**, **"Fastest"**, or **"Recommended"**.
- **Metro Simulation:** Realistic station-to-station routing for the Jaipur Pink Line, including next-train countdowns and headway simulation.
- **Shared Ride Marketplace:** Simulation of ride-pooling to reduce travel costs.
- **Heuristic-driven Estimations:** Fares and times calculated based on peak-hour traffic, vehicle speed, and distance.

### 🗺️ Tourism & Discovery
- **Explore Jaipur:** Filterable catalog of tourist spots with high-quality images and descriptions.
- **Interactive Details:** View entry fees, visiting hours, and nearby food recommendations.
- **User Reviews:** Rate and review locations with aggregated rating systems.
- **Saved Trips:** Bookmark places and plan itineraries with persisted user accounts.

### 👤 User & Role Management
- **Secure Authentication:** OTP-based signup/login via email verification.
- **Dashboards:** Dedicated interfaces for **Users**, **Drivers**, and **Administrators**.
- **Profile Management:** Manage ride history, saved trips, and personal details.

---

## 💻 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18 (Vite), Tailwind CSS, React-Router-DOM, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js, OTP via Nodemailer |
| **Maps & UI** | Leaflet (React-Leaflet), Lucide Icons, React Icons |
| **Storage** | Cloudinary (for image uploads) |

---


## 📁 Project Structure

```text
GhumoJaipur/
├── backend/                # Express Server
│   ├── config/             # DB & Cloudinary config
│   ├── controllers/        # Business logic (Transport, Auth, Places)
│   ├── middleware/         # JWT Auth & Admin protection
│   ├── models/             # Mongoose Schemas (User, Place, Transport)
│   ├── routes/             # API Endpoint definitions
│   ├── scripts/            # Seed data (Realistic Jaipur stations/routes)
│   └── utils/              # Mailer & Distance calculators
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # Reusable UI (Cards, Modals, Navbar)
│   │   ├── context/        # Auth & Toast State
│   │   ├── data/           # Static Jaipur transport data
│   │   ├── pages/          # Full-page views
│   │   ├── services/       # API calling modules
│   │   └── utils/          # Client-side validators
│   └── public/             # Static assets
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Atlas or Local)
- Cloudinary Account (for image uploads)
- Gmail App Password (for OTP service)

### 1. Clone the repository
```bash
git clone https://github.com/Ri2334/GhumoJaipur.git
cd GhumoJaipur
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
CLOUDINARY_CLOUD_NAME=name
CLOUDINARY_API_KEY=key
CLOUDINARY_API_SECRET=secret
```
Seed the database:
```bash
npm run seed:places
npm run seed:transport
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

| Variable | Description |
| :--- | :--- |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for token signing |
| `MAIL_USER` | Gmail address for sending OTPs |
| `MAIL_PASS` | Gmail App Password |
| `CORS_ORIGIN` | Allowed frontend URL (e.g., localhost:5173) |

---

## 📑 API Documentation

### Authentication
- `POST /api/auth/send-otp` - Send OTP for signup/password reset.
- `POST /api/auth/verify-otp` - Verify OTP and issue JWT.
- `POST /api/auth/signup` - Register a new user.

### Transport
- `POST /api/transport/search` - Main search engine for transport comparison.
- `GET /api/transport/stations` - Get all metro stations.
- `GET /api/transport/locations` - Get tourist location suggestions.

### Tourism
- `GET /api/places` - List all places with filters (category, search).
- `GET /api/places/:id` - Get detailed information about a place.
- `POST /api/places/:id/reviews` - Add a review (Authenticated).

---

## 🔒 Security & Optimization
- **Security:**
  - Password hashing using `Bcrypt.js`.
  - JWT for stateless authentication.
  - Role-based Access Control (RBAC) for Admin/User/Driver.
  - Input validation and normalization.
- **Performance:**
  - **Pagination:** Implemented for place listings to ensure fast load times.
  - **Heuristic Caching:** Pre-computed known distances for common Jaipur routes.
  - **Lazy Loading:** Frontend components split for optimal bundle size.

---


## 🧠 Challenges & Engineering Decisions
- **Fuzzy Search for Localities:** Implemented a name normalization and keyword-intersection algorithm to match user inputs (e.g., "Hawa Mahal") with nearest Metro stations even with spelling variations.
- **Transport Ranking Algorithm:** Developed a composite scoring system considering `fare`, `time`, and `convenience` to provide "Recommended" tags dynamically.
- **Realistic Metro Scheduling:** Simulated metro headways based on time of day (peak vs. off-peak) to provide realistic "Next Train" estimates without a real-time GTFS feed.

---

## 🔮 Future Improvements
- [ ] **Interactive Maps:** Full integration of Leaflet for real-time route polyline visualization.
- [ ] **Live Traffic API:** Replace heuristics with Google Maps/TomTom Traffic APIs.
- [ ] **Payment Integration:** Razorpay/Stripe for booking cabs/autos directly.
- [ ] **Multilingual Support:** Hindi and other local languages for better tourist accessibility.

---

## ✍️ Author

**Rishi Joshi**  
🚀 Full Stack Developer | Surat , India

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://in.linkedin.com/in/rishijoshi11)
[![Email](https://img.shields.io/badge/Email-D14836?style=flat&logo=gmail&logoColor=white)](mailto:rishi.joshi.ddu@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/Ri2334)

---
*Developed with ❤️ for the Pink City.*
