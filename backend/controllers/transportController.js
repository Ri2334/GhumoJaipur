import MetroRoute from "../models/MetroRoute.js";
import MetroStation from "../models/MetroStation.js";
import TouristLocation from "../models/TouristLocation.js";
import TransportRoute from "../models/TransportRoute.js";
import CabRide from "../models/CabRide.js";
import SharedRide from "../models/SharedRide.js";

const normalizeName = (value = "") => String(value).trim().toLowerCase();

const toMinutes = (distanceKm, speedKmph) => Math.max(1, Math.round((distanceKm / speedKmph) * 60));

const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const radians = (value) => (value * Math.PI) / 180;
  const earthRadius = 6371;
  const deltaLat = radians(lat2 - lat1);
  const deltaLon = radians(lon2 - lon1);
  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(deltaLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((earthRadius * c).toFixed(1));
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
  "birla mandir": { lat: 26.8922, lng: 75.8156, nearest: "Sindhi Camp" }
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

const buildRecommendation = ({ distanceKm, route, cabRide, sharedRide, walkingAllowed, busFare, busTime, isMetroBeneficial, sourceToMetroDist, metroToDestDist }) => {
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

  items.push(
    {
      mode: "Auto",
      fare: Math.max(35, Math.round(18 * distanceKm + 20)),
      time: `${Math.max(8, toMinutes(distanceKm, 18))} mins`,
      badge: !isMetroBeneficial && distanceKm <= 5 ? "best" : "default",
      note: "Balanced city travel option.",
    },
    {
      mode: "Cab",
      fare: cabRide.estimatedFare,
      time: `${cabRide.estimatedDurationMinutes} mins`,
      badge: "fastest",
      note: `Surge ${cabRide.surgeMultiplier.toFixed(1)}x, availability: ${cabRide.availability.toLowerCase()}.`,
    },
  );

  if (sharedRide) {
    items.push({
      mode: "Shared Cab",
      fare: sharedRide.splitFare,
      time: `${Math.max(10, sharedRide.timeWindowMinutes)} mins`,
      badge: sharedRide.recommended && !isMetroBeneficial ? "best" : "default",
      note: `Split fare with ${sharedRide.riderCount} riders and ${sharedRide.sharedProbability}% match chance.`,
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
      
      // Metro is beneficial if walking to/from metro is reasonable (< 3km total) or it's a long journey
      if (sourceToMetroDist + metroToDestDist < 4 || distanceKm > 6) {
        isMetroBeneficial = true;
      }
    }

    const cabBaseFare = Math.max(60, Math.round(distanceKm * 22 + 20));
    const cabSurgeMultiplier = distanceKm > 12 ? 1.4 : distanceKm > 6 ? 1.2 : 1.0;
    const cabRide = await CabRide.create({
      sourceName: source,
      destinationName: destination,
      baseFare: cabBaseFare,
      surgeMultiplier: cabSurgeMultiplier,
      estimatedFare: Math.round(cabBaseFare * cabSurgeMultiplier),
      estimatedDurationMinutes: Math.max(8, toMinutes(distanceKm, 22)),
      estimatedArrivalMinutes: Math.max(2, Math.round(distanceKm / 3)),
      availability: distanceKm > 10 ? "High" : "Medium",
    });

    const sharedRide = await SharedRide.create({
      sourceName: source,
      destinationName: destination,
      riderCount: distanceKm > 8 ? 3 : 2,
      totalFare: Math.round(cabBaseFare * 0.75),
      splitFare: Math.round((cabBaseFare * 0.75) / (distanceKm > 8 ? 3 : 2)),
      timeWindowMinutes: distanceKm > 8 ? 15 : 10,
      sharedProbability: distanceKm > 8 ? 72 : 58,
      recommended: distanceKm > 4,
    });

    const busFare = Math.max(10, Math.round(distanceKm * 3));
    const busTime = Math.max(20, toMinutes(distanceKm, 12));
    
    const recommendations = buildRecommendation({
      distanceKm,
      route: metroRoute,
      cabRide,
      sharedRide,
      walkingAllowed,
      busFare,
      busTime,
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
        cabRide,
        sharedRide,
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
