# Ghumo Jaipur 🏰 — The Smart Tourism & Unified Transit Ecosystem

[![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](https://github.com/Ri2334/GhumoJaipur)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green.svg)](https://mongodb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20React-purple.svg)](https://vitejs.dev)

**Ghumo Jaipur** is an enterprise-grade, full-stack smart city solution tailored for the Jaipur tourism sector. It serves as a unified digital layer that consolidates fragmented transport modes, heritage data, and booking services into a single, high-performance ecosystem.

---

## 🏛️ Vision & Mission
Jaipur welcomes millions of tourists annually, yet navigating the city remains a challenge due to fragmented transit data and inconsistent pricing. **Ghumo Jaipur**'s mission is to democratize transit information and heritage accessibility through data-driven recommendations and seamless digital booking.

---

## 🎯 The Problem Landscape
Contemporary tourism in historical cities suffers from:
*   **The "Context Switch" Tax**: Users jump between mapping, ride-hailing, and cultural blogs.
*   **Last-Mile Blindness**: Public transit (Metro) is often overlooked because users can't visualize the walking or auto-rickshaw connection.
*   **Stale Content**: Static tourist guides don't reflect newly added landmarks or local food trends.
*   **Trust Deficit**: Inconsistent fare estimations for unorganized sectors like auto-rickshaws.

---

## 🚀 The Feature Ecosystem

### 1. Unified Smart Transport Engine (The Brain)
*   **The Problem**: No single app compares the Pink Line Metro with a private cab and a shared auto simultaneously.
*   **The Solution**: A multi-modal decision engine that processes 6 distinct transit types in parallel.
*   **The Logic**: Uses the **Haversine Spherical Geometry Formula** to calculate precise distances between GPS coordinates. It then applies a **Road Factor Heuristic (1.2x–1.4x)** to convert straight-line distance into realistic street-level mileage.
*   **Impact**: Users receive real-time badges (**Cheapest, Fastest, Recommended**) that dynamically update based on the calculated distance and mode-specific fare tables.

### 2. Proximity-Aware Metro Routing
*   **The Problem**: Tourists often take expensive cabs because they don't realize a Metro station is just 800m from their favorite fort.
*   **The Solution**: An intelligent routing algorithm that maps every `TouristLocation` to its **Nearest Metro Station**. 
*   **The Logic**: If the sum of (Source-to-Metro) + (Metro-to-Dest) distance is significantly lower than a direct road route, or if the road distance exceeds 6km, the system flags the Metro as **"Recommended"**.
*   **Impact**: Provides a full station sequence timeline, reducing city congestion and saving user costs.

### 3. End-to-End Booking & Payment Simulation
*   **The Problem**: High friction between finding a route and booking a ride.
*   **The Solution**: A complete mock-transactional flow.
*   **Key Components**:
    *   **Driver Allocation**: Realistic driver matching from a pool of available RJ-registered vehicles.
    *   **Interactive Payment UI**: A state-driven modal simulating the Razorpay/Stripe experience with loading, processing, and success states.
    *   **Dynamic OTP**: Generates and validates 4-digit ride codes for security.
*   **Impact**: Demonstrates a production-ready UX for transit service providers.

### 4. Adaptive "Living" Heritage Database
*   **The Problem**: New landmarks (like "Amar Javan Jyoti") aren't immediately supported by transit apps.
*   **The Solution**: A **Dual-Collection Sync System**. When an Admin adds a `Place`, the backend automatically geocodes it into the `TouristLocation` geospatial index using area-based keyword mapping.
*   **Impact**: Instantly enables transit routing and "Nearby Famous Things" guide generation for newly added landmarks without code changes.

### 5. Geospatial Visualization (Leaflet.js)
*   **The Problem**: "3.4 km" is a number; users need to *see* the turn.
*   **The Solution**: Integration with **Leaflet.js** and **OpenStreetMap**.
*   **Impact**: Renders dynamic markers, polylines for Metro paths, and interactive route summaries that increase user navigational confidence.

---

## 💻 Engineering Excellence

### Backend Architecture (Node.js/Express)
- **Controller-Service Pattern**: Decoupled business logic for transport heuristics and authentication.
- **Geospatial Heuristics**: Custom algorithms for estimating travel time based on peak/off-peak hour traffic patterns.
- **Security**: Argon2/Bcrypt password hashing and stateless JWT session management.

### Frontend Architecture (React/Vite)
- **Atomic Components**: Highly modularised UI (Cards, Timelines, Modals) for maximum reusability.
- **Context API State**: Global state management for User Auth and Notification Toasts, ensuring a smooth SPA (Single Page Application) experience.
- **Tailwind CSS Implementation**: A utility-first approach to ensure a high-performance, responsive design that works on every screen size.

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18.0.0+)
- MongoDB (Atlas Cloud or Local Instance)
- SMTP Credentials (for OTP functionality)

### Step-by-Step Guide
1.  **Clone Repository**:
    ```bash
    git clone https://github.com/Ri2334/GhumoJaipur.git
    cd GhumoJaipur
    ```
2.  **Environment Setup**:
    Create `/backend/.env`:
    ```env
    PORT=5001
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_private_key
    MAIL_USER=your_email@gmail.com
    MAIL_PASS=your_gmail_app_password
    ```
3.  **Install & Seed**:
    ```bash
    # Install all dependencies
    cd backend && npm install
    cd ../frontend && npm install
    
    # Initialize Database with Jaipur Data
    cd ../backend
    npm run seed:all
    ```
4.  **Launch**:
    ```bash
    # Backend (Terminal 1)
    npm run dev
    
    # Frontend (Terminal 2)
    cd ../frontend && npm run dev
    ```

---

## 👨‍💻 Author

**Rishi Joshi**  
Software Engineer | MERN Specialist  
📧 [rishi.joshi.ddu@gmail.com](mailto:rishi.joshi.ddu@gmail.com)  
🔗 [LinkedIn](https://linkedin.com/in/rishi-joshi)  

---
*Ghumo Jaipur: Engineering a smarter way to explore the Pink City.*
