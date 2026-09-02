import { UDAIPUR_PLACES } from "./udaipurPlacesData";

export const UCTSL_BUS_ROUTES = [
  {
    id: "uctsl-route-1",
    routeNumber: "Route 1",
    routeName: "Badgaon ⇄ Titardi Corridor",
    busesAssigned: 4,
    operatingHours: "6:10 AM - 8:40 PM",
    headway: "Every 15 mins (Peak Hours)",
    fare: "₹10 - ₹25",
    type: "Urban Corridor",
    stops: [
      "Badgaon Terminus",
      "Syphon Choraha",
      "Fatehpura",
      "Sukhadia Circle",
      "Chetak Circle",
      "Hathipole",
      "Delhi Gate",
      "Surajpole",
      "Sewashram",
      "Hiran Magri",
      "Titardi Terminus"
    ]
  },
  {
    id: "uctsl-route-2",
    routeNumber: "Route 2",
    routeName: "Rampura ⇄ Dabok Airport Road Corridor",
    busesAssigned: 8,
    operatingHours: "6:30 AM - 8:40 PM",
    headway: "Every 15 - 20 mins",
    fare: "₹10 - ₹30",
    type: "Airport & Suburban",
    stops: [
      "Rampura Terminus",
      "Malla Talai",
      "Chetak Circle",
      "Delhi Gate",
      "Surajpole",
      "Pratap Nagar",
      "Dabok Airport Road"
    ]
  },
  {
    id: "uctsl-route-3",
    routeNumber: "Route 3",
    routeName: "Balicha ⇄ Badgaon Line",
    busesAssigned: 3,
    operatingHours: "6:30 AM - 8:30 PM",
    headway: "Every 20 - 25 mins",
    fare: "₹10 - ₹25",
    type: "North-South Express",
    stops: [
      "Balicha Bypass Terminal",
      "Goverdhan Vilas",
      "Reti Stand",
      "Patel Circle",
      "Udaipur City Railway Station",
      "Udiapol Central Bus Stand",
      "Surajpole",
      "Delhi Gate",
      "Hathipole",
      "Chetak Circle",
      "Sukhadia Circle",
      "Badgaon Terminus"
    ]
  },
  {
    id: "uctsl-route-4",
    routeNumber: "Route 4",
    routeName: "Balicha ⇄ Amberi Outer Corridor",
    busesAssigned: 5,
    operatingHours: "6:30 AM - 8:40 PM",
    headway: "Every 20 mins",
    fare: "₹10 - ₹30",
    type: "Outer Ring Corridor",
    stops: [
      "Balicha Bypass Terminal",
      "Goverdhan Vilas",
      "Paras Cinema",
      "Udiapol Central Bus Stand",
      "Sewashram",
      "Pratapnagar Square",
      "Sukher Industrial Area",
      "Amberi Outer Corridor"
    ]
  },
  {
    id: "uctsl-route-5",
    routeNumber: "Route 5",
    routeName: "City Station ⇄ Rampura Tourist Loop",
    busesAssigned: 2,
    operatingHours: "6:30 AM - 8:30 PM",
    headway: "Every 30 mins",
    fare: "₹10 - ₹20",
    type: "Heritage & Lake Special",
    stops: [
      "Udaipur City Railway Station",
      "Udiayapole Central Bus Stand",
      "Surajpole",
      "Delhi Gate",
      "Hathipole",
      "Chetak Circle",
      "Shiksha Bhawan",
      "Fatehsagar Lake Entry Point",
      "Radaji Chouraha",
      "Mahakaleshwar Chowk",
      "Malla Talai Chouraha",
      "Sajjangarh Biological Park Base / Rampura"
    ]
  },
  {
    id: "uctsl-airport-shuttle",
    routeNumber: "Airport Express",
    routeName: "Chetak Pahada ⇄ Maharana Pratap Airport Shuttle",
    busesAssigned: 2,
    operatingHours: "6:00 AM - 6:00 PM (Scheduled Timings)",
    headway: "Fixed Timed Dispatches",
    fare: "Flat ₹100",
    type: "Express Shuttle",
    stops: [
      "Chetak Pahada",
      "Delhi Gate",
      "Surajpol",
      "Thokar Chauraha",
      "Debari",
      "Maharana Pratap Dabok Airport Terminal"
    ]
  }
];

// Helper: Haversine distance in km
function getHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find location metadata from UDAIPUR_PLACES or coordinates dictionary
const UDAIPUR_COORDINATES = {
  "city palace udaipur": { lat: 24.5764, lng: 73.6835, isOldCity: true },
  "lake pichola": { lat: 24.5678, lng: 73.6780, isLake: true },
  "jag mandir": { lat: 24.5670, lng: 73.6775, isIsland: true },
  "sajjangarh fort (monsoon palace)": { lat: 24.5898, lng: 73.6335, isHilltop: true },
  "sajjangarh monsoon palace": { lat: 24.5898, lng: 73.6335, isHilltop: true },
  "sajjangarh fort": { lat: 24.5898, lng: 73.6335, isHilltop: true },
  "fatehsagar lake": { lat: 24.6015, lng: 73.6735, isLake: true },
  "fatehsagar lake & bombay chowk": { lat: 24.6015, lng: 73.6735, isLake: true },
  "nehru park island": { lat: 24.6030, lng: 73.6750, isIsland: true },
  "saheliyon ki bari": { lat: 24.6042, lng: 73.6840 },
  "sukhadia circle": { lat: 24.6000, lng: 73.6900 },
  "bagore ki haveli": { lat: 24.5790, lng: 73.6815, isOldCity: true },
  "jagdish temple": { lat: 24.5785, lng: 73.6830, isOldCity: true },
  "ambrai ghat": { lat: 24.5775, lng: 73.6785 },
  "karni mata ropeway": { lat: 24.5695, lng: 73.6850, isRopeway: true },
  "udaipur city railway station": { lat: 24.5685, lng: 73.6990, isStation: true },
  "udiapole central bus stand": { lat: 24.5710, lng: 73.6965, isStation: true },
  "maharana pratap dabok airport": { lat: 24.6175, lng: 73.8960, isAirport: true },
  "bahubali hills": { lat: 24.6400, lng: 73.6550, isTrek: true },
  "shilpgram": { lat: 24.6100, lng: 73.6580 }
};

export const calculateUdaipurRoute = (originName, destName) => {
  if (!originName || !destName) {
    return {
      mode: "Multi-Modal",
      summary: "Udaipur Urban Transit",
      totalDuration: "15 min",
      totalCost: "₹20 - ₹80",
      steps: [
        { type: "auto", title: "Select Source & Destination above", duration: "0 min", cost: "₹0" }
      ]
    };
  }

  const origKey = originName.toLowerCase().trim();
  const destKey = destName.toLowerCase().trim();

  // Retrieve coordinates
  const origGeo = UDAIPUR_COORDINATES[origKey] || { lat: 24.5764, lng: 73.6835 };
  const destGeo = UDAIPUR_COORDINATES[destKey] || { lat: 24.6015, lng: 73.6735 };

  const directKm = getHaversineDistanceKm(origGeo.lat, origGeo.lng, destGeo.lat, destGeo.lng);
  
  // Winding Aravalli road curvature factor
  const roadKm = Math.round((Math.max(1.5, directKm * 1.4)) * 10) / 10;

  // Key Flag checks
  const isSajjangarhHill = destGeo.isHilltop || origGeo.isHilltop || destKey.includes("sajjangarh") || origKey.includes("sajjangarh");
  const isJagMandirIsland = destGeo.isIsland || destKey.includes("jag mandir") || origKey.includes("jag mandir");
  const isNehruParkIsland = destKey.includes("nehru park") || origKey.includes("nehru park");
  const isRopewaySpot = destGeo.isRopeway || destKey.includes("ropeway") || destKey.includes("karni mata");
  const isAirportHub = destGeo.isAirport || destKey.includes("airport") || origKey.includes("airport") || destKey.includes("dabok") || origKey.includes("dabok");

  // 1. SAJJANGARH HILLTOP (MONSOON PALACE) ROUTE LOGIC
  if (isSajjangarhHill) {
    const isDestHill = destKey.includes("sajjangarh") || destGeo.isHilltop;
    const hillDescendMins = 18;
    const cityDriveMins = Math.round(roadKm * 2.2);
    const totalDurationMins = hillDescendMins + cityDriveMins;

    const autoFare = Math.min(350, Math.max(180, Math.round(roadKm * 22 + 100)));

    return {
      distanceKm: roadKm,
      mode: "Forest Shuttle + City Bus / Taxi",
      summary: `Commute from Sajjangarh Monsoon Palace hilltop via Forest Shuttle to Foot Gate, then City Bus / Taxi to ${destName}`,
      totalDuration: `${totalDurationMins} min`,
      totalCost: "₹135 - ₹300",
      steps: [
        { 
          type: "auto", 
          title: "Forest Dept Authorized Jeep / Electric Van down Bansdara Hill (5 km winding road)", 
          duration: "18 min", 
          cost: "₹120" 
        },
        { 
          type: "bus", 
          title: `UCTSL Route 2 or Route 5 Bus from Sajjangarh Foot Gate (Malla Talai) towards ${destName}`, 
          duration: `${cityDriveMins} min`, 
          cost: "₹15" 
        },
        { 
          type: "walk", 
          title: `Arrive at ${destName} entry gate`, 
          duration: "5 min", 
          cost: "Free" 
        }
      ]
    };
  }

  // 2. JAG MANDIR ISLAND ROUTE LOGIC
  if (isJagMandirIsland) {
    const driveToGateMins = Math.round(roadKm * 2.0);

    return {
      distanceKm: roadKm,
      mode: "Taxi / Auto + Pichola Boat Cruise",
      summary: `Commute to Rameshwar Ghat (City Palace Jetty) + Lake Pichola Ferry Cruise to Jag Mandir Island`,
      totalDuration: `${driveToGateMins + 20} min`,
      totalCost: "₹550 - ₹850",
      steps: [
        { 
          type: "auto", 
          title: `Doorstep Auto / E-Rickshaw from ${originName} through heritage streets to Rameshwar Ghat Jetty`, 
          duration: `${driveToGateMins} min`, 
          cost: "₹60 - ₹100" 
        },
        { 
          type: "boat", 
          title: "Official Lake Pichola Boat Ferry Cruise across open lake water to Jag Mandir Island", 
          duration: "15 min", 
          cost: "₹500 (Day) / ₹800 (Sunset)" 
        }
      ]
    };
  }

  // 3. FATEHSAGAR NEHRU PARK ISLAND ROUTE LOGIC
  if (isNehruParkIsland) {
    const driveToPaalMins = Math.max(10, Math.round(roadKm * 2.0));

    return {
      distanceKm: roadKm,
      mode: "UCTSL Bus / Auto + Motorboat Ferry",
      summary: `City Bus / Auto to Fatehsagar Paal Jetty + Motorboat Ferry to Nehru Park Island`,
      totalDuration: `${driveToPaalMins + 12} min`,
      totalCost: "₹135",
      steps: [
        { 
          type: "bus", 
          title: `UCTSL Route 5 Tourist Loop Bus / Auto to Fatehsagar Promenade (Bombay Chowk Jetty)`, 
          duration: `${driveToPaalMins} min`, 
          cost: "₹15" 
        },
        { 
          type: "boat", 
          title: "Official Fatehsagar Motorboat Ferry from Promenade Jetty to Nehru Park Island", 
          duration: "10 min", 
          cost: "₹120" 
        }
      ]
    };
  }

  // 4. KARNI MATA ROPEWAY ROUTE LOGIC
  if (isRopewaySpot) {
    const driveToDoodhTalaiMins = Math.max(10, Math.round(roadKm * 2.0));

    return {
      distanceKm: roadKm,
      mode: "Auto + Cable Car Ropeway",
      summary: `Auto to Doodh Talai Base + Mansapurna Karni Mata Cable Car Aerial Ride`,
      totalDuration: `${driveToDoodhTalaiMins + 6} min`,
      totalCost: "₹170 - ₹220",
      steps: [
        { 
          type: "auto", 
          title: `Auto / E-Rickshaw from ${originName} to Doodh Talai Ropeway Base Station`, 
          duration: `${driveToDoodhTalaiMins} min`, 
          cost: "₹50 - ₹80" 
        },
        { 
          type: "ropeway", 
          title: "Mansapurna Karni Mata Cable Car Aerial Ride to Machhala Hilltop Temple", 
          duration: "4 min", 
          cost: "₹120 (Round Trip)" 
        }
      ]
    };
  }

  // 5. AIRPORT SHUTTLE ROUTE LOGIC
  if (isAirportHub) {
    return {
      distanceKm: roadKm,
      mode: "UCTSL AC Airport Express Shuttle",
      summary: `Direct Municipal AC Airport Express Shuttle connecting ${originName} and Dabok Airport`,
      totalDuration: "35 - 40 min",
      totalCost: "Flat ₹100",
      steps: [
        { 
          type: "bus", 
          title: `UCTSL AC Airport Express Shuttle from Chetak Circle / Delhi Gate / Thokar stop to Dabok Airport`, 
          duration: "35 min", 
          cost: "₹100 Flat Rate" 
        }
      ]
    };
  }

  // 6. GENERIC FACTUAL UDAIPUR URBAN CITY BUS & TAXI ROUTE
  const busMins = Math.max(12, Math.round(roadKm * 2.5));
  const autoFare = Math.min(200, Math.max(50, Math.round(roadKm * 18)));

  return {
    distanceKm: roadKm,
    mode: "UCTSL Electric Bus (Route 1 / 2 / 3 / 5) & Auto",
    summary: `UCTSL Municipal City Bus Corridor connecting ${originName} to ${destName}`,
    totalDuration: `${busMins + 5} min`,
    totalCost: `₹15 (Bus) / ₹${autoFare} (Auto)`,
    steps: [
      { 
        type: "bus", 
        title: `UCTSL City Bus (Route 1 / Route 2 / Route 5 Tourist Loop) from ${originName} stop towards ${destName}`, 
        duration: `${busMins} min`, 
        cost: "₹15" 
      },
      { 
        type: "walk", 
        title: `Short Walk / E-Rickshaw to ${destName} entry gate`, 
        duration: "5 min", 
        cost: "Free" 
      }
    ]
  };
};
