import { PINK_LINE_STATIONS, getNearestMetroStation } from "./jaipurTransitChecker";
import { jaipur140Places } from "./jaipur140Places";
import { UDAIPUR_PLACES } from "./udaipurPlacesData";
import { UCTSL_BUS_ROUTES } from "./udaipurTransitEngine";

// ==========================================
// 1. GEO-CALCULATION UTILITIES
// ==========================================
function getHaversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
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

// Master Location Database with Verified Coordinates
const MASTER_COORDINATES = {
  // JAIPUR LOCATIONS
  "hawa mahal": { name: "Hawa Mahal", city: "Jaipur", lat: 26.9239, lng: 75.8267, metro: "Badi Chaupar", isOldCity: true },
  "city palace": { name: "City Palace", city: "Jaipur", lat: 26.9258, lng: 75.8237, metro: "Badi Chaupar", isOldCity: true },
  "amer fort": { name: "Amer Fort", city: "Jaipur", lat: 26.9855, lng: 75.8513, metro: "Badi Chaupar", isHeritage: true },
  "nahargarh fort": { name: "Nahargarh Fort", city: "Jaipur", lat: 26.9373, lng: 75.8155, metro: "Chandpole", isHilltop: true },
  "jal mahal": { name: "Jal Mahal", city: "Jaipur", lat: 26.9534, lng: 75.8462, metro: "Badi Chaupar" },
  "jantar mantar": { name: "Jantar Mantar", city: "Jaipur", lat: 26.9248, lng: 75.8246, metro: "Chhoti Chaupar", isOldCity: true },
  "albert hall museum": { name: "Albert Hall Museum", city: "Jaipur", lat: 26.9116, lng: 75.8195, metro: "Railway Station" },
  "badi chaupar": { name: "Badi Chaupar", city: "Jaipur", lat: 26.9262, lng: 75.8265, metro: "Badi Chaupar", isMetro: true },
  "chhoti chaupar": { name: "Chhoti Chaupar", city: "Jaipur", lat: 26.9259, lng: 75.8188, metro: "Chhoti Chaupar", isMetro: true },
  "chandpole": { name: "Chandpole", city: "Jaipur", lat: 26.9255, lng: 75.8111, metro: "Chandpole", isMetro: true },
  "sindhi camp": { name: "Sindhi Camp", city: "Jaipur", lat: 26.9248, lng: 75.7999, metro: "Sindhi Camp", isMetro: true },
  "jaipur railway station": { name: "Jaipur Railway Station", city: "Jaipur", lat: 26.9195, lng: 75.7932, metro: "Railway Station", isMetro: true, isStation: true },
  "railway station": { name: "Jaipur Railway Station", city: "Jaipur", lat: 26.9195, lng: 75.7932, metro: "Railway Station", isMetro: true, isStation: true },
  "mansarovar": { name: "Mansarovar", city: "Jaipur", lat: 26.8756, lng: 75.7533, metro: "Mansarovar", isMetro: true },
  "collectory circle": { name: "Collectory Circle", city: "Jaipur", lat: 26.9220, lng: 75.7980, metro: "Sindhi Camp" },
  "chokhi dhani": { name: "Chokhi Dhani", city: "Jaipur", lat: 26.7667, lng: 75.8360, metro: null, isOutskirt: true },

  // UDAIPUR LOCATIONS
  "city palace udaipur": { name: "City Palace Udaipur", city: "Udaipur", lat: 24.5764, lng: 73.6835, isOldCity: true },
  "lake pichola": { name: "Lake Pichola", city: "Udaipur", lat: 24.5678, lng: 73.6780, isLake: true },
  "jag mandir": { name: "Jag Mandir Island", city: "Udaipur", lat: 24.5670, lng: 73.6775, isIsland: true },
  "sajjangarh fort (monsoon palace)": { name: "Sajjangarh Monsoon Palace", city: "Udaipur", lat: 24.5898, lng: 73.6335, isHilltop: true },
  "sajjangarh monsoon palace": { name: "Sajjangarh Monsoon Palace", city: "Udaipur", lat: 24.5898, lng: 73.6335, isHilltop: true },
  "sajjangarh fort": { name: "Sajjangarh Monsoon Palace", city: "Udaipur", lat: 24.5898, lng: 73.6335, isHilltop: true },
  "fatehsagar lake": { name: "Fatehsagar Lake", city: "Udaipur", lat: 24.6015, lng: 73.6735, isLake: true },
  "fatehsagar lake & bombay chowk": { name: "Fatehsagar Promenade (Bombay Chowk)", city: "Udaipur", lat: 24.6015, lng: 73.6735, isLake: true },
  "nehru park island": { name: "Nehru Park Island", city: "Udaipur", lat: 24.6030, lng: 73.6750, isIsland: true },
  "saheliyon ki bari": { name: "Saheliyon Ki Bari", city: "Udaipur", lat: 24.6042, lng: 73.6840 },
  "sukhadia circle": { name: "Sukhadia Circle", city: "Udaipur", lat: 24.6000, lng: 73.6900 },
  "bagore ki haveli": { name: "Bagore Ki Haveli", city: "Udaipur", lat: 24.5790, lng: 73.6815, isOldCity: true },
  "jagdish temple": { name: "Jagdish Temple", city: "Udaipur", lat: 24.5785, lng: 73.6830, isOldCity: true },
  "ambrai ghat": { name: "Ambrai Ghat", city: "Udaipur", lat: 24.5775, lng: 73.6785 },
  "karni mata ropeway": { name: "Mansapurna Karni Mata Ropeway", city: "Udaipur", lat: 24.5695, lng: 73.6850, isRopeway: true },
  "udaipur city railway station": { name: "Udaipur City Railway Station", city: "Udaipur", lat: 24.5685, lng: 73.6990, isStation: true },
  "udiapole central bus stand": { name: "Udiapole Central Bus Stand", city: "Udaipur", lat: 24.5710, lng: 73.6965, isStation: true },
  "maharana pratap dabok airport": { name: "Maharana Pratap Dabok Airport", city: "Udaipur", lat: 24.6175, lng: 73.8960, isAirport: true }
};

// ==========================================
// 2. REAL-WORLD JAIPUR ROUTE RESOLVER
// ==========================================
export function resolveJaipurRealRoute(originName, destName) {
  const origKey = originName.toLowerCase().trim();
  const destKey = destName.toLowerCase().trim();

  const origGeo = MASTER_COORDINATES[origKey] || { name: originName, lat: 26.9124, lng: 75.7872 };
  const destGeo = MASTER_COORDINATES[destKey] || { name: destName, lat: 26.9238, lng: 75.8267 };

  // SAME LOCATION CHECK
  if (origKey === destKey || (origGeo.name && destGeo.name && origGeo.name.toLowerCase() === destGeo.name.toLowerCase())) {
    return {
      origin: origGeo.name,
      destination: destGeo.name,
      distanceKm: 0,
      totalTimeMins: 0,
      mode: "Already at Destination",
      summary: `You are already at ${origGeo.name || originName}. No transit required.`,
      isOutstation: false,
      hasValidMetro: false,
      busRoute: {
        busNumber: "Direct Walk",
        routeName: "Already at Destination",
        type: "direct",
        transfers: 0,
        fare: "₹0",
        estimatedTimeMinutes: 0,
        boardStop: origGeo.name,
        alightStop: destGeo.name,
        route: { stopsPassed: [origGeo.name] }
      }
    };
  }

  const directKm = getHaversineKm(origGeo.lat, origGeo.lng, destGeo.lat, destGeo.lng);
  const roadKm = Math.round((Math.max(1.2, directKm * 1.25)) * 10) / 10;
  const isOutstation = roadKm > 35;

  // Metro station calculation
  const sourceMetroObj = getNearestMetroStation(originName);
  const destMetroObj = getNearestMetroStation(destName);

  const srcMetroName = sourceMetroObj?.name;
  const dstMetroName = destMetroObj?.name;

  // Pink Line Metro Stations list
  const pinkLineStations = [
    "Mansarovar", "New Aatish Market", "Vivek Vihar", "Shyam Nagar",
    "Ram Nagar", "Civil Lines", "Railway Station", "Sindhi Camp",
    "Chandpole", "Chhoti Chaupar", "Badi Chaupar"
  ];

  let metroSequence = null;
  let hasValidMetro = false;

  if (srcMetroName && dstMetroName && srcMetroName !== dstMetroName) {
    const sIdx = pinkLineStations.findIndex(s => s.toLowerCase() === srcMetroName.toLowerCase());
    const dIdx = pinkLineStations.findIndex(s => s.toLowerCase() === dstMetroName.toLowerCase());

    if (sIdx !== -1 && dIdx !== -1 && sIdx !== dIdx) {
      hasValidMetro = true;
      if (sIdx < dIdx) {
        metroSequence = pinkLineStations.slice(sIdx, dIdx + 1).map((name, i) => ({
          name,
          area: i === 0 ? "Boarding Station" : i === dIdx - sIdx ? "Destination Station" : "Pink Line Station"
        }));
      } else {
        metroSequence = pinkLineStations.slice(dIdx, sIdx + 1).reverse().map((name, i) => ({
          name,
          area: i === 0 ? "Boarding Station" : i === sIdx - dIdx ? "Destination Station" : "Pink Line Station"
        }));
      }
    }
  }

  // Determine Real JCTSL Bus Route
  let busNumber = "AC 1";
  let busRouteName = "Sanganer ⇄ Amer Fort Corridor";
  let boardStop = origGeo.name;
  let alightStop = destGeo.name;

  if (destKey.includes("amer") || origKey.includes("amer")) {
    busNumber = "AC 1";
    busRouteName = "Sanganer ⇄ Amer Fort Express";
  } else if (destKey.includes("railway") || origKey.includes("railway") || destKey.includes("sindhi") || origKey.includes("sindhi")) {
    busNumber = "AC 2";
    busRouteName = "Joshi Marg ⇄ Mahatma Gandhi Hospital Corridor";
  } else if (destKey.includes("chokhi")) {
    busNumber = "Route 9A";
    busRouteName = "Agarwal Farm ⇄ Tonk Road Express";
  }

  const travelTimeMins = Math.round(roadKm * 2.2);

  return {
    origin: origGeo.name,
    destination: destGeo.name,
    distanceKm: roadKm,
    totalTimeMins: travelTimeMins,
    isOutstation,
    sourceCoords: { latitude: origGeo.lat, longitude: origGeo.lng },
    destCoords: { latitude: destGeo.lat, longitude: destGeo.lng },
    hasValidMetro,
    sourceMetroName,
    destMetroName,
    metroSequence,
    busRoute: {
      busNumber,
      routeNumber: busNumber,
      routeName: busRouteName,
      type: "direct",
      transfers: 0,
      fare: `₹${Math.min(30, Math.max(15, Math.round(roadKm * 2)))}`,
      estimatedTimeMinutes: travelTimeMins + 5,
      boardStop: boardStop,
      alightStop: alightStop,
      route: {
        busNumber,
        routeName: busRouteName,
        stopsPassed: [boardStop, "Ajmeri Gate", alightStop]
      }
    }
  };
}

// ==========================================
// 3. REAL-WORLD UDAIPUR ROUTE RESOLVER
// ==========================================
export function resolveUdaipurRealRoute(originName, destName) {
  const origKey = originName.toLowerCase().trim();
  const destKey = destName.toLowerCase().trim();

  const origGeo = MASTER_COORDINATES[origKey] || { name: originName, lat: 24.5764, lng: 73.6835 };
  const destGeo = MASTER_COORDINATES[destKey] || { name: destName, lat: 24.6015, lng: 73.6735 };

  // SAME LOCATION CHECK
  if (origKey === destKey || (origGeo.name && destGeo.name && origGeo.name.toLowerCase() === destGeo.name.toLowerCase())) {
    return {
      distanceKm: 0,
      mode: "Already at Destination",
      summary: `You are already at ${origGeo.name || originName}. No transit required.`,
      totalDuration: "0 min",
      totalCost: "Free",
      steps: [
        {
          type: "walk",
          title: `You are currently at ${origGeo.name || originName}. Explore nearby sights on foot!`,
          duration: "0 min",
          cost: "Free"
        }
      ]
    };
  }

  const directKm = getHaversineKm(origGeo.lat, origGeo.lng, destGeo.lat, destGeo.lng);
  const roadKm = Math.round((Math.max(1.5, directKm * 1.35)) * 10) / 10;

  const isSajjangarh = origGeo.isHilltop || destGeo.isHilltop || origKey.includes("sajjangarh") || destKey.includes("sajjangarh");
  const isJagMandir = origGeo.isIsland || destGeo.isIsland || origKey.includes("jag mandir") || destKey.includes("jag mandir");
  const isNehruPark = destKey.includes("nehru park") || origKey.includes("nehru park");
  const isRopeway = origGeo.isRopeway || destGeo.isRopeway || origKey.includes("ropeway") || destKey.includes("ropeway") || origKey.includes("karni mata") || destKey.includes("karni mata");
  const isAirport = origGeo.isAirport || destGeo.isAirport || origKey.includes("airport") || destKey.includes("airport") || origKey.includes("dabok") || destKey.includes("dabok");

  // Sajjangarh Hill Route
  if (isSajjangarh) {
    return {
      distanceKm: roadKm,
      mode: "Forest Shuttle + UCTSL Bus",
      summary: `Forest Dept Shuttle down Sajjangarh Hill (18 min) + UCTSL Route 2/5 Bus to ${destGeo.name}`,
      totalDuration: "35 - 45 min",
      totalCost: "₹135",
      steps: [
        { 
          type: "auto", 
          title: "Forest Dept Approved Open Jeep / Electric Shuttle down Bansdara Hill (5 km winding hill road)", 
          duration: "18 min", 
          cost: "₹120" 
        },
        { 
          type: "bus", 
          title: `UCTSL Route 2 / Route 5 City Bus from Sajjangarh Foot Gate (Malla Talai) towards ${destGeo.name}`, 
          duration: "15 min", 
          cost: "₹15" 
        },
        { 
          type: "walk", 
          title: `Walk to ${destGeo.name} entry gate`, 
          duration: "5 min", 
          cost: "Free" 
        }
      ]
    };
  }

  // Jag Mandir Island Route
  if (isJagMandir) {
    return {
      distanceKm: roadKm,
      mode: "E-Rickshaw + Pichola Boat Cruise",
      summary: `E-Rickshaw to Rameshwar Ghat + Lake Pichola Official Boat Cruise to Jag Mandir Island`,
      totalDuration: "25 min",
      totalCost: "₹550 - ₹850",
      steps: [
        { 
          type: "auto", 
          title: `E-Rickshaw from ${origGeo.name} through heritage streets to Rameshwar Ghat (City Palace Jetty)`, 
          duration: "10 min", 
          cost: "₹50 - ₹100" 
        },
        { 
          type: "boat", 
          title: "Lake Pichola Official Boat Cruise across open water to Jag Mandir Island", 
          duration: "15 min", 
          cost: "₹500 (Day) / ₹800 (Sunset)" 
        }
      ]
    };
  }

  // Nehru Park Island Route
  if (isNehruPark) {
    return {
      distanceKm: roadKm,
      mode: "UCTSL Bus + Motorboat Ferry",
      summary: `UCTSL Route 5 Bus to Fatehsagar Promenade + Motorboat Ferry to Nehru Park Island`,
      totalDuration: "22 min",
      totalCost: "₹135",
      steps: [
        { 
          type: "bus", 
          title: `UCTSL Route 5 Tourist Loop Bus from ${origGeo.name} to Fatehsagar Promenade Jetty`, 
          duration: "12 min", 
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

  // Karni Mata Ropeway Route
  if (isRopeway) {
    return {
      distanceKm: roadKm,
      mode: "Auto + Cable Car Ropeway",
      summary: `Auto to Doodh Talai Base + Mansapurna Karni Mata Cable Car Aerial Ride`,
      totalDuration: "18 min",
      totalCost: "₹170 - ₹220",
      steps: [
        { 
          type: "auto", 
          title: `Auto / E-Rickshaw from ${origGeo.name} to Doodh Talai Ropeway Base Station`, 
          duration: "10 min", 
          cost: "₹50 - ₹80" 
        },
        { 
          type: "ropeway", 
          title: "Mansapurna Karni Mata Cable Car Aerial Ride to Machhala Hilltop Viewpoint", 
          duration: "4 min", 
          cost: "₹120 (Round Trip)" 
        }
      ]
    };
  }

  // Airport Route
  if (isAirport) {
    return {
      distanceKm: roadKm,
      mode: "UCTSL AC Airport Express Shuttle",
      summary: `Direct Municipal AC Airport Express Shuttle connecting ${origGeo.name} and Dabok Airport`,
      totalDuration: "35 - 40 min",
      totalCost: "Flat ₹100",
      steps: [
        { 
          type: "bus", 
          title: "UCTSL AC Airport Express Shuttle from Chetak Circle / Delhi Gate / Thokar stop to Dabok Airport", 
          duration: "35 min", 
          cost: "₹100 Flat Rate" 
        }
      ]
    };
  }

  // Standard Factual City Bus Route
  const driveTimeMins = Math.max(12, Math.round(roadKm * 2.2));
  return {
    distanceKm: roadKm,
    mode: "UCTSL Electric Bus (Route 1 / 2 / 3 / 5) & Auto",
    summary: `UCTSL Municipal City Bus Corridor connecting ${origGeo.name} to ${destGeo.name}`,
    totalDuration: `${driveTimeMins + 5} min`,
    totalCost: "₹15 (Bus) / ₹80 (Auto)",
    steps: [
      { 
        type: "bus", 
        title: `UCTSL City Bus (Route 1 / Route 2 / Route 5 Tourist Loop) from ${origGeo.name} stop towards ${destGeo.name}`, 
        duration: `${driveTimeMins} min`, 
        cost: "₹15" 
      },
      { 
        type: "walk", 
        title: `Walk / E-Rickshaw from UCTSL Bus Stop to ${destGeo.name} gate`, 
        duration: "5 min", 
        cost: "Free" 
      }
    ]
  };
}
