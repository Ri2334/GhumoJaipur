import MetroRoute from "../models/MetroRoute.js";
import MetroStation from "../models/MetroStation.js";
import TouristLocation from "../models/TouristLocation.js";
import TransportRoute from "../models/TransportRoute.js";
import CabRide from "../models/CabRide.js";
import SharedRide from "../models/SharedRide.js";
import Driver from "../models/Driver.js";

const normalizeName = (value = "") => String(value).trim().toLowerCase();

const toMinutes = (distanceKm, speedKmph) => Math.max(1, Math.round((distanceKm / speedKmph) * 60));

const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const radians = (value) => (value * Math.PI) / 180;
  const earthRadius = 6371;
  const deltaLat = radians(lat2 - lat1);
  const deltaLon = radians(lon2 - lon1);
  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(deltaLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLineDist = earthRadius * c;
  
  // Real world road distance is typically 1.3x to 1.5x the straight line distance
  // Using 1.35 as a realistic multiplier for Jaipur city traffic/roads
  const ROAD_FACTOR = 1.35;
  return Number((straightLineDist * ROAD_FACTOR).toFixed(1));
};

const routeOrder = [
  "Mansarovar",
  "New Aatish Market",
  "Vivek Vihar",
  "Shyam Nagar",
  "Ram Nagar",
  "Civil Lines",
  "Railway Station",
  "Sindhi Camp",
  "Chandpole",
  "Chhoti Chaupar",
  "Badi Chaupar"
];

const stationCoordinates = {
  "Mansarovar": { lat: 26.8756, lng: 75.7533 },
  "New Aatish Market": { lat: 26.8834, lng: 75.7589 },
  "Vivek Vihar": { lat: 26.8901, lng: 75.7654 },
  "Shyam Nagar": { lat: 26.8978, lng: 75.7721 },
  "Ram Nagar": { lat: 26.9045, lng: 75.7798 },
  "Civil Lines": { lat: 26.9112, lng: 75.7865 },
  "Railway Station": { lat: 26.9195, lng: 75.7932 },
  "Sindhi Camp": { lat: 26.9248, lng: 75.7999 },
  "Chandpole": { lat: 26.9255, lng: 75.8111 },
  "Chhoti Chaupar": { lat: 26.9259, lng: 75.8188 },
  "Badi Chaupar": { lat: 26.9262, lng: 75.8265 }
};

const placeCoordinates = {
  "amer fort": { lat: 26.9855, lng: 75.8513, nearest: "Badi Chaupar" },
  "hawa mahal": { lat: 26.9239, lng: 75.8267, nearest: "Badi Chaupar" },
  "city palace": { lat: 26.9255, lng: 75.8236, nearest: "Chhoti Chaupar" },
  "jaipur railway station": { lat: 26.9196, lng: 75.7880, nearest: "Railway Station" },
  "sindhi camp": { lat: 26.9248, lng: 75.7999, nearest: "Sindhi Camp" },
  "badi chaupar": { lat: 26.9262, lng: 75.8265, nearest: "Badi Chaupar" },
  "johari bazaar": { lat: 26.9205, lng: 75.8267, nearest: "Badi Chaupar" },
  "world trade park": { lat: 26.8270, lng: 75.8058, nearest: "New Aatish Market" },
  "wtp": { lat: 26.8270, lng: 75.8058, nearest: "New Aatish Market" },
  "albert hall museum": { lat: 26.9116, lng: 75.8195, nearest: "Chhoti Chaupar" },
  "birla mandir": { lat: 26.8922, lng: 75.8156, nearest: "Sindhi Camp" },
  "malviya nagar": { lat: 26.8549, lng: 75.8243, nearest: "New Aatish Market" },
  "vaishali nagar": { lat: 26.9075, lng: 75.7396, nearest: "Mansarovar" },
  "c-scheme": { lat: 26.9133, lng: 75.8031, nearest: "Civil Lines" },
  "raja park": { lat: 26.8979, lng: 75.8271, nearest: "Sindhi Camp" },
  "bani park": { lat: 26.9273, lng: 75.7903, nearest: "Railway Station" },
  "mansarovar area": { lat: 26.8584, lng: 75.7615, nearest: "Mansarovar" },
  "jhotwara": { lat: 26.9444, lng: 75.7317, nearest: "Chandpole" },
  "vidhyadhar nagar": { lat: 26.9587, lng: 75.7761, nearest: "Chandpole" },
  "pink city": { lat: 26.9239, lng: 75.8267, nearest: "Badi Chaupar" },
  "mi road": { lat: 26.9157, lng: 75.8111, nearest: "Sindhi Camp" },
  "tonk road": { lat: 26.8688, lng: 75.8066, nearest: "New Aatish Market" },
  "gopalpura": { lat: 26.8644, lng: 75.7753, nearest: "Ram Nagar" },
  "sitapura": { lat: 26.7900, lng: 75.8500, nearest: "New Aatish Market" },
  "shastri nagar": { lat: 26.9400, lng: 75.8000, nearest: "Sindhi Camp" },
  "lalkothi": { lat: 26.8900, lng: 75.8000, nearest: "Civil Lines" }
};

const getPlaceInfo = (name) => {
  const normalized = normalizeName(name);
  // Try exact match first
  if (placeCoordinates[normalized]) return { ...placeCoordinates[normalized], matchedName: name };

  // Try partial match
  for (const [key, value] of Object.entries(placeCoordinates)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return { ...value, matchedName: name };
    }
  }
  for (const [key, value] of Object.entries(stationCoordinates)) {
    if (normalized.includes(key.toLowerCase()) || key.toLowerCase().includes(normalized)) {
      return { lat: value.lat, lng: value.lng, nearest: key, matchedName: name };
    }
  }
  // Default fallback if not found
  return { lat: 26.9124, lng: 75.7873, nearest: "Railway Station", matchedName: name };
};

const buildMetroRoute = async (sourceStationName, destinationStationName) => {
  const sourceIndex = routeOrder.indexOf(sourceStationName);
  const destinationIndex = routeOrder.indexOf(destinationStationName);

  if (sourceIndex === -1 || destinationIndex === -1 || sourceIndex === destinationIndex) {
    return null; // No metro route if same station or unknown
  }

  const orderedStationNames = sourceIndex <= destinationIndex
    ? routeOrder.slice(sourceIndex, destinationIndex + 1)
    : routeOrder.slice(destinationIndex, sourceIndex + 1).reverse();

  // Create mock objects since the DB might not be fully seeded
  const stationSequence = orderedStationNames.map(name => ({ _id: name, name, ...stationCoordinates[name] }));
  
  const hops = Math.max(stationSequence.length - 1, 1);
  const fare = hops <= 2 ? 10 : hops <= 5 ? 15 : 20;
  const travelTimeMinutes = hops * 3; // Approx 3 mins per station hop
  const waitingTimeMinutes = Math.floor(Math.random() * 5) + 2; // Random wait 2-6 mins
  const nextTrainMinutes = waitingTimeMinutes;

  return {
    sourceStation: stationSequence[0],
    destinationStation: stationSequence[stationSequence.length - 1],
    stationSequence,
    fare,
    travelTimeMinutes,
    waitingTimeMinutes,
    nextTrainMinutes,
    lineName: "Pink Line"
  };
};

const getOrCreateTouristLocation = async (name, defaults) => {
  const existing = await TouristLocation.findOne({ name });
  if (existing) return existing;
  return TouristLocation.create({ name, ...defaults });
};

const getOrCreateStation = async (name, defaults) => {
  const existing = await MetroStation.findOne({ name });
  if (existing) return existing;
  return MetroStation.create({ name, ...defaults });
};

const buildRecommendation = ({ distanceKm, route, cabRide, sharedRide, autoRide, walkingAllowed, isMetroBeneficial, sourceToMetroDist, metroToDestDist }) => {
  const items = [];

  if (walkingAllowed) {
    items.push({
      mode: "Walk",
      fare: 0,
      time: `${Math.max(10, Math.round(distanceKm * 15))} mins`,
      badge: distanceKm <= 1.5 ? "best" : "cheapest",
      note: "Best for short city hops under 2 km.",
    });
  }

  if (autoRide) {
    items.push({
      mode: "Auto",
      fare: autoRide.estimatedFare,
      time: `${autoRide.estimatedDurationMinutes} mins`,
      badge: !isMetroBeneficial && distanceKm <= 5 ? "best" : "default",
      note: "Balanced city travel option.",
    });
  } else {
    items.push({ mode: "Auto", fare: 0, time: "--", badge: "default", note: "No autos available nearby." });
  }

  if (cabRide) {
    items.push({
      mode: "Cab",
      fare: cabRide.estimatedFare,
      time: `${cabRide.estimatedDurationMinutes} mins`,
      badge: "fastest",
      note: `Professional service, available now.`,
    });
  } else {
    items.push({ mode: "Cab", fare: 0, time: "--", badge: "default", note: "No cabs available nearby." });
  }

  if (sharedRide && cabRide) {
    items.push({
      mode: "Shared Cab",
      fare: sharedRide.splitFare,
      time: `${Math.max(10, sharedRide.timeWindowMinutes)} mins`,
      badge: sharedRide.recommended && !isMetroBeneficial ? "best" : "default",
      note: sharedRide.note || `Split fare with ${sharedRide.riderCount} riders.`,
    });
  }

  if (route && isMetroBeneficial) {
    const walkToMetro = Math.round(sourceToMetroDist * 1000);
    const walkFromMetro = Math.round(metroToDestDist * 1000);
    const totalTime = route.travelTimeMinutes + route.waitingTimeMinutes + Math.round(sourceToMetroDist * 15) + Math.round(metroToDestDist * 15);
    
    let metroNote = `Arriving in ${route.nextTrainMinutes} mins. `;
    if (walkToMetro > 1000) metroNote += `Take e-rickshaw to ${route.sourceStation.name}. `;
    else metroNote += `Walk ${walkToMetro}m to ${route.sourceStation.name}. `;
    
    if (walkFromMetro > 1000) metroNote += `Finally take auto to destination.`;
    else metroNote += `Finally walk ${walkFromMetro}m to destination.`;

    items.push({
      mode: "Metro",
      fare: route.fare,
      time: `${totalTime} mins`,
      badge: "recommended",
      note: metroNote,
    });
  }

  const cheapest = items.reduce((best, current) => (!best || current.fare < best.fare ? current : best), null);
  const fastest = items.reduce((best, current) => {
    const currentMinutes = Number(String(current.time).replace(/[^\d]/g, "")) || 999;
    const bestMinutes = best ? Number(String(best.time).replace(/[^\d]/g, "")) || 999 : 999;
    return currentMinutes < bestMinutes ? current : best;
  }, null);
  const recommended = items.find((item) => item.badge === "best" || item.badge === "recommended") || cheapest || items[0];

  return items.map((item) => ({
    ...item,
    isCheapest: cheapest?.mode === item.mode,
    isFastest: fastest?.mode === item.mode,
    isRecommended: recommended?.mode === item.mode,
  }));
};

export const searchTransport = async (req, res) => {
  try {
    const { source, destination } = req.body;

    if (!source || !destination) {
      return res.status(400).json({ success: false, message: "Source and destination are required" });
    }

    const sourceInfo = getPlaceInfo(source);
    const destInfo = getPlaceInfo(destination);

    const distanceKm = getDistanceKm(sourceInfo.lat, sourceInfo.lng, destInfo.lat, destInfo.lng);
    const walkingAllowed = distanceKm <= 2;

    const sourceStationName = sourceInfo.nearest;
    const destinationStationName = destInfo.nearest;

    const metroRoute = await buildMetroRoute(sourceStationName, destinationStationName);
    
    let isMetroBeneficial = false;
    let sourceToMetroDist = 0;
    let metroToDestDist = 0;

    if (metroRoute) {
      const srcMetroCoords = stationCoordinates[sourceStationName];
      const destMetroCoords = stationCoordinates[destinationStationName];
      sourceToMetroDist = getDistanceKm(sourceInfo.lat, sourceInfo.lng, srcMetroCoords.lat, srcMetroCoords.lng);
      metroToDestDist = getDistanceKm(destInfo.lat, destInfo.lng, destMetroCoords.lat, destMetroCoords.lng);
      if (sourceToMetroDist + metroToDestDist < 4 || distanceKm > 6) {
        isMetroBeneficial = true;
      }
    }

    // NEW: Query real available drivers from DB with proximity matching
    const sourceArea = sourceInfo.matchedName || source;
    
    const availableCabs = await Driver.find({ 
      type: "cab", 
      availability: "Available",
      isVerified: true,
      "currentLocation.areaName": { $regex: new RegExp(sourceArea, "i") }
    }).populate('userId', 'fullName mobile');

    const availableAutos = await Driver.find({ 
      type: "auto", 
      availability: "Available",
      isVerified: true,
      "currentLocation.areaName": { $regex: new RegExp(sourceArea, "i") }
    }).populate('userId', 'fullName mobile');

    // For simplicity in this version, we take the first available driver if any exists
    // Future expansion: Calculate proximity and choose nearest
    const cabDriver = availableCabs[0];
    const autoDriver = availableAutos[0];

    const cabBaseFare = cabDriver ? Math.round(cabDriver.baseFare + (distanceKm * cabDriver.perKmRate)) : 0;
    const autoBaseFare = autoDriver ? Math.round(autoDriver.baseFare + (distanceKm * autoDriver.perKmRate)) : 0;

    // REAL SHARED RIDE DATA - Match both source and destination proximity
    const realSharedRides = await SharedRide.find({ 
      sourceName: { $regex: new RegExp(sourceInfo.matchedName || source, "i") },
      destinationName: { $regex: new RegExp(destInfo.matchedName || destination, "i") },
      status: 'open',
      seatsAvailable: { $gt: 0 }
    });

    let sharedRideData = null;
    if (realSharedRides.length > 0) {
      const minFare = Math.min(...realSharedRides.map(r => r.splitFare));
      sharedRideData = {
        isAvailable: true,
        lowestFare: minFare,
        rideCount: realSharedRides.length,
        splitFare: minFare,
        note: `As low as ₹${minFare} with ${realSharedRides.length} active pools.`
      };
    } else {
      sharedRideData = {
        isAvailable: false,
        lowestFare: cabBaseFare, // Show private fare as the starting price
        splitFare: cabBaseFare,
        note: "No shared cabs available for this location. Create one shared cab and wait for another passengers to join."
      };
    }

    const recommendations = buildRecommendation({
      distanceKm,
      route: metroRoute,
      cabRide: cabDriver ? { estimatedFare: cabBaseFare, estimatedDurationMinutes: Math.max(8, toMinutes(distanceKm, 22)), surgeMultiplier: 1.0, availability: "High" } : null,
      sharedRide: cabDriver ? { 
        ...sharedRideData,
        timeWindowMinutes: 15, 
        sharedProbability: 60, 
        recommended: distanceKm > 4 
      } : null,
      autoRide: autoDriver ? { estimatedFare: autoBaseFare, estimatedDurationMinutes: Math.max(8, toMinutes(distanceKm, 18)) } : null,
      walkingAllowed,
      isMetroBeneficial,
      sourceToMetroDist,
      metroToDestDist
    });

    const routeRecord = {
      sourceName: source,
      destinationName: destination,
      distanceKm,
      walkingAllowed,
      recommendedMode: recommendations.find((item) => item.isRecommended)?.mode || recommendations[0]?.mode || "Cab",
      cheapestMode: recommendations.find((item) => item.isCheapest)?.mode || recommendations[0]?.mode || "Bus",
      fastestMode: recommendations.find((item) => item.isFastest)?.mode || recommendations[0]?.mode || "Cab",
      metroRoute: isMetroBeneficial ? metroRoute : null,
    };

    return res.status(200).json({
      success: true,
      data: {
        route: routeRecord,
        metroRoute: isMetroBeneficial ? metroRoute : null,
        cabDriver: cabDriver ? { _id: cabDriver._id, name: cabDriver.userId.fullName, vehicle: cabDriver.vehicle, vehicleNumber: cabDriver.vehicleNumber, rating: cabDriver.rating } : null,
        autoDriver: autoDriver ? { _id: autoDriver._id, name: autoDriver.userId.fullName, vehicle: autoDriver.vehicle, vehicleNumber: autoDriver.vehicleNumber, rating: autoDriver.rating } : null,
        recommendations,
        map: {
          source: { latitude: sourceInfo.lat, longitude: sourceInfo.lng, name: source },
          destination: { latitude: destInfo.lat, longitude: destInfo.lng, name: destination },
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMetroStations = async (req, res) => {
  try {
    const stations = await MetroStation.find().sort({ sequence: 1 });
    return res.status(200).json({ success: true, data: stations });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTouristLocations = async (req, res) => {
  try {
    const places = await TouristLocation.find().sort({ name: 1 });
    return res.status(200).json({ success: true, data: places });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
