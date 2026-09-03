import { DELHI_PLACES } from "./delhiPlacesData.js";
import { getNearestDelhiMetroStation } from "./delhiMetroData.js";
import { DTC_BUS_ROUTES } from "./delhiDTCBusCatalog.js";

function getHaversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
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

export function resolveDelhiRealRoute(originName, destName) {
  const origKey = (originName || "").toLowerCase().trim();
  const destKey = (destName || "").toLowerCase().trim();

  const origObj = DELHI_PLACES.find(p => p.name.toLowerCase().includes(origKey) || origKey.includes(p.name.toLowerCase())) || {
    name: originName || "Delhi City Center",
    lat: 28.6315,
    lng: 77.2167
  };

  const destObj = DELHI_PLACES.find(p => p.name.toLowerCase().includes(destKey) || destKey.includes(p.name.toLowerCase())) || {
    name: destName || "South Delhi Hub",
    lat: 28.5245,
    lng: 77.1855
  };

  // Same location check
  if (origKey === destKey || origObj.name.toLowerCase() === destObj.name.toLowerCase()) {
    return {
      distanceKm: 0,
      totalDuration: "0 min",
      totalCost: "Free",
      mode: "Already at Destination",
      summary: `You are already at ${origObj.name}. No transit required.`,
      steps: [
        { type: "walk", title: `You are at ${origObj.name}. Explore nearby on foot!`, duration: "0 min", cost: "Free" }
      ],
      trackPolyline: [[origObj.lat, origObj.lng]]
    };
  }

  const directKm = getHaversineKm(origObj.lat, origObj.lng, destObj.lat, destObj.lng);
  const roadKm = Math.round((Math.max(1.8, directKm * 1.3)) * 10) / 10;
  const driveTimeMins = Math.max(12, Math.round(roadKm * 2.1));

  const srcMetro = getNearestDelhiMetroStation(origObj.name);
  const dstMetro = getNearestDelhiMetroStation(destObj.name);

  const hasMetro = Boolean(srcMetro && dstMetro && srcMetro.name !== dstMetro.name);

  // Match DTC Official Bus Route from Catalog
  let matchedBus = DTC_BUS_ROUTES.find(r => 
    r.stops.some(s => s.toLowerCase().includes(origKey) || origKey.includes(s.toLowerCase())) &&
    r.stops.some(s => s.toLowerCase().includes(destKey) || destKey.includes(s.toLowerCase()))
  );

  if (!matchedBus) {
    if (origKey.includes("iit") || destKey.includes("iit")) {
      matchedBus = DTC_BUS_ROUTES.find(r => r.busNumber === "Route 764" || r.busNumber === "Route 620") || DTC_BUS_ROUTES[3];
    } else if (origKey.includes("aiims") || destKey.includes("aiims")) {
      matchedBus = DTC_BUS_ROUTES.find(r => r.busNumber === "Route 419" || r.busNumber === "Route 505") || DTC_BUS_ROUTES[0];
    } else if (origKey.includes("airport") || destKey.includes("airport") || origKey.includes("igi") || destKey.includes("igi")) {
      matchedBus = DTC_BUS_ROUTES.find(r => r.busNumber === "Airport Express-4") || DTC_BUS_ROUTES[6];
    } else if (origKey.includes("anand vihar") || destKey.includes("anand vihar")) {
      matchedBus = DTC_BUS_ROUTES.find(r => r.busNumber === "Route 534" || r.busNumber === "Route 212") || DTC_BUS_ROUTES[2];
    } else if (origKey.includes("qutub") || destKey.includes("qutub") || origKey.includes("mehrauli") || destKey.includes("mehrauli")) {
      matchedBus = DTC_BUS_ROUTES.find(r => r.busNumber === "Route 505") || DTC_BUS_ROUTES[1];
    } else {
      matchedBus = DTC_BUS_ROUTES[0];
    }
  }

  // DMRC Metro Fare Tier (₹10 - ₹60)
  const metroFare = Math.min(60, Math.max(10, Math.round(roadKm * 2.5)));
  const dtcBusFare = Math.min(25, Math.max(5, Math.round(roadKm * 1.2)));

  // Spatial last-mile calculation thresholds
  const firstMileDistKm = Math.round((directKm * 0.12 + 0.3) * 10) / 10;
  const lastMileDistKm = Math.round((directKm * 0.10 + 0.2) * 10) / 10;

  const buildFirstMileStep = (hubName) => {
    if (firstMileDistKm <= 0.5) {
      return {
        type: "walk",
        title: `🚶 Walk ${Math.round(firstMileDistKm * 1000)}m (${Math.max(3, Math.round(firstMileDistKm * 12))} mins) to ${hubName}`,
        duration: `${Math.max(3, Math.round(firstMileDistKm * 12))} min`,
        cost: "Free"
      };
    } else if (firstMileDistKm <= 2.0) {
      return {
        type: "walk",
        title: `🚶 Walk / E-Rickshaw ${firstMileDistKm} km (${Math.round(firstMileDistKm * 6)} mins) to ${hubName}`,
        duration: `${Math.round(firstMileDistKm * 6)} min`,
        cost: "₹10"
      };
    } else {
      return {
        type: "auto",
        title: `🛺 Take E-Rickshaw / Auto ${firstMileDistKm} km (${Math.round(firstMileDistKm * 4)} mins) to ${hubName}`,
        duration: `${Math.round(firstMileDistKm * 4)} min`,
        cost: "₹30"
      };
    }
  };

  const buildLastMileStep = (hubName, targetName) => {
    if (lastMileDistKm <= 0.5) {
      return {
        type: "walk",
        title: `🚶 Walk ${Math.round(lastMileDistKm * 1000)}m (${Math.max(3, Math.round(lastMileDistKm * 12))} mins) from ${hubName} to ${targetName}`,
        duration: `${Math.max(3, Math.round(lastMileDistKm * 12))} min`,
        cost: "Free"
      };
    } else if (lastMileDistKm <= 2.0) {
      return {
        type: "walk",
        title: `🚶 Walk / E-Rickshaw ${lastMileDistKm} km (${Math.round(lastMileDistKm * 6)} mins) to ${targetName}`,
        duration: `${Math.round(lastMileDistKm * 6)} min`,
        cost: "₹10"
      };
    } else {
      return {
        type: "auto",
        title: `🛺 Take E-Rickshaw / Auto ${lastMileDistKm} km (${Math.round(lastMileDistKm * 4)} mins) to ${targetName}`,
        duration: `${Math.round(lastMileDistKm * 4)} min`,
        cost: "₹30"
      };
    }
  };

  const metroSequence = hasMetro ? [
    { name: srcMetro.name, area: `Boarding Station (${srcMetro.line})` },
    { name: "Rajiv Chowk (Interchange)", area: "DMRC Transfer Hub" },
    { name: dstMetro.name, area: `Destination Station (${dstMetro.line})` }
  ] : null;

  const metroSteps = hasMetro ? [
    { type: "walk", title: `📍 Depart from ${origObj.name}`, duration: "0 min", cost: "Free" },
    buildFirstMileStep(srcMetro.name),
    {
      type: "bus",
      title: `🚇 Board DMRC ${srcMetro.line} at ${srcMetro.name} → Alight at ${dstMetro.name}`,
      duration: `${Math.max(8, driveTimeMins - 4)} min`,
      cost: `₹${metroFare}`
    },
    buildLastMileStep(dstMetro.name, destObj.name),
    { type: "walk", title: `🏁 Arrive at ${destObj.name}`, duration: "0 min", cost: "Free" }
  ] : [
    { type: "walk", title: `📍 Depart from ${origObj.name}`, duration: "0 min", cost: "Free" },
    buildFirstMileStep(matchedBus.origin || origObj.name),
    {
      type: "bus",
      title: `🚌 Board ${matchedBus.busNumber || matchedBus.route_short_name} DTC Electric Bus → Alight at ${destObj.name}`,
      duration: `${driveTimeMins} min`,
      cost: `₹${dtcBusFare}`
    },
    buildLastMileStep(matchedBus.destination || destObj.name, destObj.name),
    { type: "walk", title: `🏁 Arrive at ${destObj.name}`, duration: "0 min", cost: "Free" }
  ];

  const trackPolyline = [
    [origObj.lat, origObj.lng],
    [origObj.lat + (destObj.lat - origObj.lat) * 0.15, origObj.lng + (destObj.lng - origObj.lng) * 0.15],
    [origObj.lat + (destObj.lat - origObj.lat) * 0.85, origObj.lng + (destObj.lng - origObj.lng) * 0.85],
    [destObj.lat, destObj.lng]
  ];

  return {
    distanceKm: roadKm,
    totalTimeMins: driveTimeMins,
    totalDuration: `${driveTimeMins} min`,
    totalCost: `₹${metroFare} (Metro) / ₹${dtcBusFare} (Bus)`,
    mode: hasMetro ? `DMRC ${srcMetro.line}` : `${matchedBus.busNumber || matchedBus.route_short_name} DTC Electric Bus`,
    summary: hasMetro 
      ? `DMRC Metro from ${srcMetro.name} to ${dstMetro.name}` 
      : `${matchedBus.busNumber || matchedBus.route_short_name} (${matchedBus.routeName}) connecting ${origObj.name} to ${destObj.name}`,
    sourceCoords: { latitude: origObj.lat, longitude: origObj.lng },
    destCoords: { latitude: destObj.lat, longitude: destObj.lng },
    hasValidMetro: hasMetro,
    sourceMetroName: srcMetro?.name,
    destMetroName: dstMetro?.name,
    metroSequence: metroSequence,
    trackPolyline: trackPolyline,
    busRoute: {
      busNumber: matchedBus.busNumber || matchedBus.route_short_name,
      routeName: matchedBus.routeName,
      type: "direct",
      transfers: 0,
      fare: `₹${dtcBusFare}`,
      estimatedTimeMinutes: driveTimeMins + 5,
      boardStop: origObj.name,
      alightStop: destObj.name,
      route: {
        busNumber: matchedBus.busNumber || matchedBus.route_short_name,
        routeName: matchedBus.routeName,
        stopsPassed: (matchedBus.stops || []).slice(0, 5)
      }
    },
    steps: metroSteps
  };
}
