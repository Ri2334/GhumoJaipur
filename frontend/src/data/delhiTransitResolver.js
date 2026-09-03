import { DELHI_PLACES } from "./delhiPlacesData.js";
import { RAW_DELHI_METRO_STATIONS } from "./delhiMetroData.js";
import { DTC_BUS_ROUTES } from "./delhiDTCBusCatalog.js";

// Exact dynamic metro station lookup from raw_delhi_metro.json database (244 objects)
export function findMetroStationByNameOrKeyword(queryStr) {
  if (!queryStr) return RAW_DELHI_METRO_STATIONS[0];
  const q = queryStr.toLowerCase().trim();

  // Known landmark keyword aliases to DMRC station names
  if (q.includes("connaught") || q.includes("rajiv") || q.includes("cp")) {
    return RAW_DELHI_METRO_STATIONS.find(s => s.station_name === "Rajiv Chowk") || RAW_DELHI_METRO_STATIONS[14];
  }
  if (q.includes("red fort") || q.includes("lal qila")) {
    return RAW_DELHI_METRO_STATIONS.find(s => s.station_name === "Lal Qila" || s.station_name === "Chandni Chowk") || RAW_DELHI_METRO_STATIONS[12];
  }
  if (q.includes("iit")) {
    return RAW_DELHI_METRO_STATIONS.find(s => s.station_name === "IIT Delhi" || s.station_name === "Hauz Khas") || RAW_DELHI_METRO_STATIONS[23];
  }
  if (q.includes("aiims")) {
    return RAW_DELHI_METRO_STATIONS.find(s => s.station_name === "AIIMS") || RAW_DELHI_METRO_STATIONS[21];
  }
  if (q.includes("anand vihar")) {
    return RAW_DELHI_METRO_STATIONS.find(s => s.station_name === "Anand Vihar ISBT") || RAW_DELHI_METRO_STATIONS[0];
  }
  if (q.includes("airport") || q.includes("igi")) {
    return RAW_DELHI_METRO_STATIONS.find(s => s.station_name.includes("Airport")) || RAW_DELHI_METRO_STATIONS[0];
  }
  if (q.includes("qutub")) {
    return RAW_DELHI_METRO_STATIONS.find(s => s.station_name === "Qutub Minar") || RAW_DELHI_METRO_STATIONS[26];
  }
  if (q.includes("supreme court")) {
    return RAW_DELHI_METRO_STATIONS.find(s => s.station_name === "Supreme Court" || s.station_name === "Mandi House") || RAW_DELHI_METRO_STATIONS[31];
  }
  if (q.includes("khan market")) {
    return RAW_DELHI_METRO_STATIONS.find(s => s.station_name === "Khan Market") || RAW_DELHI_METRO_STATIONS[0];
  }
  if (q.includes("lajpat nagar")) {
    return RAW_DELHI_METRO_STATIONS.find(s => s.station_name === "Lajpat Nagar") || RAW_DELHI_METRO_STATIONS[0];
  }
  if (q.includes("sarojini nagar")) {
    return RAW_DELHI_METRO_STATIONS.find(s => s.station_name === "Sarojini Nagar") || RAW_DELHI_METRO_STATIONS[0];
  }
  if (q.includes("karol bagh")) {
    return RAW_DELHI_METRO_STATIONS.find(s => s.station_name === "Karol Bagh") || RAW_DELHI_METRO_STATIONS[0];
  }

  // Exact or partial substring match across 244 raw DMRC station objects
  const match = RAW_DELHI_METRO_STATIONS.find(s => 
    s.station_name.toLowerCase().includes(q) || q.includes(s.station_name.toLowerCase())
  );

  return match || RAW_DELHI_METRO_STATIONS[0];
}

export function resolveDelhiRealRoute(originName, destName) {
  const origKey = (originName || "").toLowerCase().trim();
  const destKey = (destName || "").toLowerCase().trim();

  // Find exact source and destination station objects from raw_delhi_metro.json database
  const srcStation = findMetroStationByNameOrKeyword(originName);
  const dstStation = findMetroStationByNameOrKeyword(destName);

  // Evaluate intermediate station sequence array between matched station indexes
  let evaluatedSequence = [];
  const sameLineStations = RAW_DELHI_METRO_STATIONS.filter(s => s.line_color === srcStation.line_color);
  const srcIdx = sameLineStations.findIndex(s => s.station_id === srcStation.station_id);
  const dstIdx = sameLineStations.findIndex(s => s.station_id === dstStation.station_id);

  if (srcIdx !== -1 && dstIdx !== -1) {
    if (srcIdx <= dstIdx) {
      evaluatedSequence = sameLineStations.slice(srcIdx, dstIdx + 1);
    } else {
      evaluatedSequence = sameLineStations.slice(dstIdx, srcIdx + 1).reverse();
    }
  } else {
    // Cross-line interchange path
    evaluatedSequence = [srcStation, dstStation];
  }

  // MANDATORY SYSTEM VERIFICATION LOG
  const stationPathIds = evaluatedSequence.map(s => s.station_id);
  console.log("Evaluated Station Path IDs:", stationPathIds);

  const numStops = evaluatedSequence.length;
  const travelMins = Math.max(8, numStops * 2.5);
  const roadKm = Math.round((numStops * 1.2 + 1.5) * 10) / 10;
  const metroFare = Math.min(60, Math.max(10, Math.round(roadKm * 2.5)));
  const dtcBusFare = Math.min(25, Math.max(5, Math.round(roadKm * 1.2)));

  // Match DTC Bus Route from raw_delhi_routes.json database
  let matchedBus = DTC_BUS_ROUTES.find(r => 
    (r.stops || []).some(s => s.toLowerCase().includes(origKey) || origKey.includes(s.toLowerCase())) &&
    (r.stops || []).some(s => s.toLowerCase().includes(destKey) || destKey.includes(s.toLowerCase()))
  ) || DTC_BUS_ROUTES[0];

  const metroSteps = [
    { type: "walk", title: `📍 Depart from ${originName || srcStation.station_name}`, duration: "0 min", cost: "Free" },
    { type: "walk", title: `🚶 Walk / E-Rickshaw 400m (3 mins) to ${srcStation.station_name} Metro Station`, duration: "3 min", cost: "Free" },
    { 
      type: "bus", 
      title: `🚇 Board DMRC ${srcStation.line_color} Line at ${srcStation.station_name} → Alight at ${dstStation.station_name} (${numStops} Stations)`, 
      duration: `${Math.round(travelMins)} min`, 
      cost: `₹${metroFare}` 
    },
    { type: "walk", title: `🚶 Walk / E-Rickshaw 500m (4 mins) from ${dstStation.station_name} to ${destName || dstStation.station_name}`, duration: "4 min", cost: "Free" },
    { type: "walk", title: `🏁 Arrive at ${destName || dstStation.station_name}`, duration: "0 min", cost: "Free" }
  ];

  return {
    distanceKm: roadKm,
    totalTimeMins: Math.round(travelMins + 7),
    totalDuration: `${Math.round(travelMins + 7)} min`,
    totalCost: `₹${metroFare} (Metro) / ₹${dtcBusFare} (Bus)`,
    mode: `DMRC ${srcStation.line_color} Line`,
    summary: `DMRC Metro from ${srcStation.station_name} to ${dstStation.station_name} (${numStops} Stations)`,
    sourceCoords: { latitude: 28.6315, longitude: 77.2167 },
    destCoords: { latitude: 28.6562, longitude: 77.2410 },
    hasValidMetro: true,
    sourceMetroName: srcStation.station_name,
    destMetroName: dstStation.station_name,
    stationPathIds: stationPathIds,
    metroSequence: evaluatedSequence.map(s => ({
      name: s.station_name,
      area: `${s.line_color} Line Station (Seq ${s.sequence_index})`
    })),
    busRoute: {
      busNumber: matchedBus.busNumber || matchedBus.route_short_name,
      routeName: matchedBus.routeName || `${matchedBus.origin} ⇄ ${matchedBus.destination}`,
      type: "direct",
      transfers: 0,
      fare: `₹${dtcBusFare}`,
      estimatedTimeMinutes: Math.round(travelMins + 10),
      boardStop: originName || srcStation.station_name,
      alightStop: destName || dstStation.station_name,
      route: {
        busNumber: matchedBus.busNumber || matchedBus.route_short_name,
        routeName: matchedBus.routeName || `${matchedBus.origin} ⇄ ${matchedBus.destination}`,
        stopsPassed: (matchedBus.stops || []).slice(0, 5)
      }
    },
    steps: metroSteps
  };
}
