# Ghumo Jaipur 🏰🚇

Ghumo Jaipur is a modern, responsive MERN + Vite tourism and smart transport platform designed to provide a unified Uber + Google Maps + Jaipur Tourism experience. It connects the cultural heritage of Jaipur with smart, data-driven transport options.

## Features

### 🌟 Core Features
- **Authentication**: Secure user login and signup.
- **Interactive Dashboard**: Quick access to smart transport and recommendations.
- **Explore Places**: Detailed insights into major Jaipur tourist spots.
- **Cab & Auto Booking**: Simulated booking flows with OTP and interactive driver UI.
- **Saved Trips**: Bookmark your favorite routes.
- **MongoDB Integration**: Robust backend to store user preferences and transport routes.
- **Leaflet Map Integration**: Interactive transport routing and driver tracking.

### 🚀 Phase 1 Upgrades
- **Jaipur Metro System Integration**: Realistic representation of the Jaipur Metro Pink Line (Mansarovar to Badi Chaupar), complete with authentic timings, realistic travel/wait time approximations, and realistic station sequences.
- **Smart Routing Engine**: A robust transport recommendation engine that intelligently detects distances using the Haversine formula. It suggests Metro only when beneficial, automatically factors in walking distances to nearest stations, and determines the overall cheapest/fastest/best modes.
- **Place + Metro Integration**: 10+ major Jaipur places mapped to their exact coordinates and their closest metro connections, creating a realistic "nearest metro available" search functionality.
- **Interactive Transport Route Map**: Replaced static iframes with a dynamic Leaflet-powered `TransportRouteMap` that renders custom Metro polylines and live source/destination markers.
- **Enhanced Transport Cards**: Cards now realistically present dynamically-computed Eco Scores, Crowd Estimates, Availability, and Comfort levels. 

## Architectural Decisions
- **Decoupled Data**: Metro logic and Place datasets were migrated to frontend constants (`src/data/`) to improve initial load times and enable lightning-fast auto-complete without waiting on backend latency.
- **Heuristic Backend Routing**: The backend `transportController.js` algorithmically decides whether the metro route adds value compared to a direct cab/auto based on multi-segment distance calculations.
- **Vanilla CSS + Tailwind Framework**: Opted for modern Tailwind utility classes bundled via PostCSS/Vite. Complex interactive elements use standard React hooks to prevent bloat.
- **Sub-Component Architecture**: Broken down massive page components into highly focused sub-components (`TransportCard`, `SmartSearch`, `TransportRouteMap`) to maximize testability and future scaling.

## Future Roadmap (Phase 2 & Beyond)
- **Shared Cab Enhancements**: Introduce dynamic rider matching, live seat counts, and complex pickup sequence algorithms.
- **Orange Line Metro Data**: Expand the Metro datasets to include the future Orange Line and interchange nodes.
- **Place Details Improvements**: Enrich the individual tourist pages with "How to reach" sections, crowd indicators, and suggested itineraries.
- **Live WebSocket Tracking**: Elevate the dummy booking system into a true real-time websocket-driven live map for cabs and autos.

## Getting Started

1. Clone the repository.
2. Install frontend dependencies: `cd frontend && npm install`
3. Install backend dependencies: `cd backend && npm install`
4. Setup your `.env` variables for MongoDB in the backend.
5. Run the dev servers.

---
*Built to be investor-ready, combining the aesthetic of modern tourism platforms with the utility of advanced transit applications.*