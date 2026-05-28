# Ghumo Jaipur 🏰 — The Ultimate Smart Tourism & Unified Transit Ecosystem

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/Ri2334/GhumoJaipur)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green.svg)](https://mongodb.com)
[![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20React-purple.svg)](https://vitejs.dev)

**Ghumo Jaipur** is a high-performance, full-stack platform designed to solve the "last-mile" navigation and fragmented information challenges faced by tourists in Jaipur. It bridges the gap between cultural heritage and modern mobility by combining smart transit heuristics with curated local intelligence.

---

## 🎯 The Problem
Tourists in Jaipur often struggle with:
1.  **Information Fragmentation**: Having to switch between Google Maps, Uber, and static tourism blogs.
2.  **Transit Uncertainty**: Not knowing if a Metro is faster than an Auto for a specific cross-city route.
3.  **Cost Transparency**: Dealing with fluctuating or arbitrary pricing from local transit providers.
4.  **Static Data**: Tourism websites that fail to reflect new landmarks or updated local recommendations.

## 🚀 The Solution: Feature Breakdown

### 1. Unified Smart Transport Engine
*   **Problem**: Users don't know which transport mode is optimal for their current time and budget.
*   **Solution**: A multi-modal comparison engine that processes **Cab, Auto, Bus, Metro, and Shared Rides** simultaneously.
*   **Impact**: Users receive real-time badges (**Cheapest, Fastest, Recommended**) calculated via the **Haversine Distance Algorithm**, enabling data-driven travel decisions in seconds.

### 2. Proximity-Aware Metro Integration
*   **Problem**: The Jaipur Metro (Pink Line) is often underutilized because its proximity to heritage sites is not explicitly clear to visitors.
*   **Solution**: The platform identifies the nearest metro station to any heritage site and algorithmically determines if taking the train is "Beneficial" based on total travel time vs. direct road routes.
*   **Impact**: Promotes sustainable public transit by providing a station-by-station timeline and boarding guides.

### 3. Heuristic Shared-Ride (Pooling) Marketplace
*   **Problem**: Solo travelers often find private cabs expensive, yet traditional pooling lacks visibility.
*   **Solution**: A simulated pooling logic that calculates **Match Probability** and **Split-Fare Factors** for any route.
*   **Impact**: Demonstrates a 40-60% cost reduction for budget-conscious travelers while optimizing vehicle occupancy.

### 4. End-to-End Cab & Auto Booking Simulation
*   **Problem**: The transition from searching to booking is often jarring.
*   **Solution**: A fully integrated booking flow including **Driver Allocation**, **Interactive OTP Verification**, and a **Razorpay-Style Payment UI**.
*   **Impact**: Provides a safe, "sandbox" environment to visualize the entire ride lifecycle, from driver arrival to final drop-off.

### 5. Dynamic "Local Guide" Intelligence
*   **Problem**: Hardcoded guidebooks become obsolete as new cafes or transport links open.
*   **Solution**: A fallback data pipeline that uses Admin-managed metadata (`nearbyFoods`, `transportOptions`) to generate "Famous things to try nearby" cards for newly added places.
*   **Impact**: Ensures that even a landmark added 5 minutes ago has relevant local tips, food suggestions, and transit connections.

### 6. Interactive Geospatial Visualization
*   **Problem**: Static maps don't help users visualize their specific journey.
*   **Solution**: Custom **Leaflet.js** integration that renders dynamic polylines, source/destination markers, and simulated driver movement.
*   **Impact**: Increases user confidence by providing a spatial context for their upcoming trip.

### 7. Secure Admin & Content Management
*   **Problem**: System maintainers need to update data without redeploying code.
*   **Solution**: A robust Admin Dashboard for CRUD operations on **Heritage Sites**, **Drivers**, and **Transit Nodes**.
*   **Impact**: Allows the platform to grow dynamically as Jaipur's infrastructure and tourism landscape evolve.

---

## 💻 Technical Excellence

### The Backend (Node.js & Express)
*   **Haversine Precision**: Implements spherical geometry to calculate distances between GPS coordinates.
*   **JWT & OTP Security**: A two-factor style authentication flow ensuring only verified users can book rides or post reviews.
*   **Sync Logic**: Automatic synchronization between the `Place` model and the `TouristLocation` geospatial index.

### The Frontend (React & Tailwind)
*   **Atomic Component Design**: Highly reusable components like `TransportCard` and `ExperienceCard` ensure a consistent UI/UX.
*   **Optimistic UI Patterns**: Instant feedback on saved trips and review submissions for a premium feel.
*   **Context-Driven State**: Efficient global state management for Authentication and Toast notifications.

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (Local or Atlas)
- SMTP Server (e.g., Gmail App Password) for OTPs

### Installation
1.  **Clone the Repo**:
    ```bash
    git clone https://github.com/Ri2334/GhumoJaipur.git
    ```
2.  **Backend Configuration**:
    Navigate to `/backend`, create a `.env` file, and add:
    ```env
    PORT=5001
    MONGODB_URI=your_uri
    JWT_SECRET=your_secret
    MAIL_USER=your_email
    MAIL_PASS=your_password
    ```
3.  **Data Initialization**:
    ```bash
    cd backend
    npm install
    npm run seed:all
    ```
4.  **Frontend Launch**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

---

## 👨‍💻 Author & Contribution

**Rishi Joshi**  
Software Engineer & Creator of Ghumo Jaipur  
📧 [rishi.joshi.ddu@gmail.com](mailto:rishi.joshi.ddu@gmail.com)  

---
*Ghumo Jaipur: Turning every transit into a guided experience.*
