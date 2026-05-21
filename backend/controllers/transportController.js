import MetroRoute from "../models/MetroRoute.js";
import MetroStation from "../models/MetroStation.js";
import TouristLocation from "../models/TouristLocation.js";
import TransportRoute from "../models/TransportRoute.js";
import CabRide from "../models/CabRide.js";
import SharedRide from "../models/SharedRide.js";

const normalizeName = (value = "") => String(value).trim().toLowerCase();

const toMinutes = (distanceKm, speedKmph) => Math.max(1, Math.round((distanceKm / speedKmph) * 60));

const getDistanceKm = (source, destination) => {
  const lat1 = Number(source.latitude);
  const lon1 = Number(source.longitude);
  const lat2 = Number(destination.latitude);
  const lon2 = Number(destination.longitude);

  const radians = (value) => (value * Math.PI) / 180;
  const earthRadius = 6371;
  const deltaLat = radians(lat2 - lat1);
  const deltaLon = radians(lon2 - lon1);
  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(deltaLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((earthRadius * c).toFixed(1));
};

const stationLookup = {
  "rajasthan railway station": "Railway Station",
  "jaipur railway station": "Railway Station",
  railway: "Railway Station",
  "badi chopar": "Badi Chopar",
  "badi choupad": "Badi Chopar",
  chandi: "Chandpole",
  chandpole: "Chandpole",
  "civil lines": "Civil Lines",
  "sindhi camp": "Sindhi Camp",
  "ram nagar": "Ram Nagar",
};

const metroRouteBlueprint = {
  "Railway Station|Badi Chopar": ["Railway Station", "Sindhi Camp", "Chandpole", "Badi Chopar"],
  "Railway Station|Chandpole": ["Railway Station", "Sindhi Camp", "Chandpole"],
  "Railway Station|Sindhi Camp": ["Railway Station", "Sindhi Camp"],
  "Sindhi Camp|Badi Chopar": ["Sindhi Camp", "Chandpole", "Badi Chopar"],
  "Civil Lines|Badi Chopar": ["Civil Lines", "Chandpole", "Badi Chopar"],
  "Ram Nagar|Badi Chopar": ["Ram Nagar", "Civil Lines", "Chandpole", "Badi Chopar"],
};

const routeOrder = ["Railway Station", "Sindhi Camp", "Civil Lines", "Ram Nagar", "Chandpole", "Badi Chopar"];

const buildMetroRoute = async (sourceStation, destinationStation) => {
  const sourceName = sourceStation.name;
  const destinationName = destinationStation.name;
  const key = `${sourceName}|${destinationName}`;
  const reverseKey = `${destinationName}|${sourceName}`;
  const blueprint = metroRouteBlueprint[key] || metroRouteBlueprint[reverseKey] || [sourceName, destinationName];
  const stationDocs = await MetroStation.find({ name: { $in: blueprint } }).sort({ sequence: 1 });
  const stationSequence = blueprint.map((stationName) => stationDocs.find((station) => station.name === stationName)).filter(Boolean);
  const hops = Math.max(stationSequence.length - 1, 1);
  const fare = Math.max(10, 10 + hops * 8);
  const travelTimeMinutes = 8 + hops * 9;
  const waitingTimeMinutes = 6;
  const nextTrainMinutes = 4;

  const existingRoute = await MetroRoute.findOne({ sourceStation: sourceStation._id, destinationStation: destinationStation._id });
  if (existingRoute) {
    existingRoute.stationSequence = stationSequence.map((station) => station._id);
    existingRoute.fare = fare;
    existingRoute.travelTimeMinutes = travelTimeMinutes;
    existingRoute.waitingTimeMinutes = waitingTimeMinutes;
    existingRoute.nextTrainMinutes = nextTrainMinutes;
    existingRoute.lineName = sourceStation.line || destinationStation.line || "Jaipur Metro";
    await existingRoute.save();
    return existingRoute.populate("sourceStation destinationStation stationSequence");
  }

  const route = await MetroRoute.create({
    sourceStation: sourceStation._id,
    destinationStation: destinationStation._id,
    stationSequence: stationSequence.map((station) => station._id),
    fare,
    travelTimeMinutes,
    waitingTimeMinutes,
    nextTrainMinutes,
    lineName: sourceStation.line || destinationStation.line || "Jaipur Metro",
  });

  return route.populate("sourceStation destinationStation stationSequence");
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

const buildRecommendation = ({ distanceKm, route, cabRide, sharedRide, walkingAllowed, busFare, busTime }) => {
  const items = [];

  if (walkingAllowed) {
    items.push({
      mode: "Walk",
      fare: 0,
      time: `${Math.max(10, Math.round(distanceKm * 15))} mins`,
      badge: distanceKm <= 1 ? "best" : "cheapest",
      note: "Best for short city hops under 2 km.",
    });
  }

  items.push(
    {
      mode: "Bus",
      fare: busFare,
      time: `${busTime} mins`,
      badge: "cheapest",
      note: "Budget option on main city routes.",
    },
    {
      mode: "Auto",
      fare: Math.max(35, Math.round(18 * distanceKm + 20)),
      time: `${Math.max(8, toMinutes(distanceKm, 18))} mins`,
      badge: "best",
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
      badge: sharedRide.recommended ? "best" : "default",
      note: `Split fare with ${sharedRide.riderCount} riders and ${sharedRide.sharedProbability}% match chance.`,
    });
  }

  if (route) {
    items.push({
      mode: "Metro",
      fare: route.fare,
      time: `${route.travelTimeMinutes + route.waitingTimeMinutes} mins`,
      badge: "recommended",
      note: `Route via ${route.stationSequence.map((station) => station.name).join(" → ")}.`,
    });
  }

  const cheapest = items.reduce((best, current) => (!best || current.fare < best.fare ? current : best), null);
  const fastest = items.reduce((best, current) => {
    const currentMinutes = Number(String(current.time).replace(/[^\d]/g, "")) || 999;
    const bestMinutes = best ? Number(String(best.time).replace(/[^\d]/g, "")) || 999 : 999;
    return currentMinutes < bestMinutes ? current : best;
  }, null);
  const recommended = items.find((item) => item.badge === "best") || cheapest || items[0];

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

    const sourceLocation = await getOrCreateTouristLocation(source, {
      description: `${source} tourist pickup`,
      area: source,
      latitude: 26.9196,
      longitude: 75.7878,
      nearestStation: "Railway Station",
      category: "Transit",
    });
    const destinationLocation = await getOrCreateTouristLocation(destination, {
      description: `${destination} tourist drop`,
      area: destination,
      latitude: 26.9265,
      longitude: 75.8242,
      nearestStation: "Badi Chopar",
      category: "Transit",
    });

    const distanceKm = getDistanceKm(sourceLocation, destinationLocation);
    const walkingAllowed = distanceKm <= 2;
    const sourceStationName = stationLookup[normalizeName(source)] || sourceLocation.nearestStation || "Railway Station";
    const destinationStationName = stationLookup[normalizeName(destination)] || destinationLocation.nearestStation || "Badi Chopar";

    const sourceStation = await getOrCreateStation(sourceStationName, {
      line: "Pink Line",
      area: sourceStationName,
      sequence: routeOrder.indexOf(sourceStationName) >= 0 ? routeOrder.indexOf(sourceStationName) : 0,
      latitude: 26.92,
      longitude: 75.8,
      nearbyPlaces: [],
    });
    const destinationStation = await getOrCreateStation(destinationStationName, {
      line: "Pink Line",
      area: destinationStationName,
      sequence: routeOrder.indexOf(destinationStationName) >= 0 ? routeOrder.indexOf(destinationStationName) : 5,
      latitude: 26.92,
      longitude: 75.82,
      nearbyPlaces: [],
    });

    const metroRoute = await buildMetroRoute(sourceStation, destinationStation);
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
    });

    const routeRecord = await TransportRoute.findOneAndUpdate(
      { sourceName: source, destinationName: destination },
      {
        sourceName: source,
        destinationName: destination,
        distanceKm,
        walkingAllowed,
        recommendedMode: recommendations.find((item) => item.isRecommended)?.mode || recommendations[0]?.mode || "Cab",
        cheapestMode: recommendations.find((item) => item.isCheapest)?.mode || recommendations[0]?.mode || "Bus",
        fastestMode: recommendations.find((item) => item.isFastest)?.mode || recommendations[0]?.mode || "Cab",
        sourceLocation: sourceLocation._id,
        destinationLocation: destinationLocation._id,
        metroRoute: metroRoute._id,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
      .populate("sourceLocation destinationLocation")
      .populate({ path: "metroRoute", populate: ["sourceStation", "destinationStation", "stationSequence"] });

    return res.status(200).json({
      success: true,
      data: {
        route: routeRecord,
        metroRoute,
        cabRide,
        sharedRide,
        recommendations,
        map: {
          source: sourceLocation,
          destination: destinationLocation,
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
