import { DELHI_PLACES } from "./delhiPlacesData.js";
import { RAW_DELHI_METRO_STATIONS } from "./delhiMetroData.js";
import { DTC_BUS_ROUTES } from "./delhiDTCBusCatalog.js";

// Haversine formula for physical distance calculation (in kilometers)
export function getHaversineKm(lat1, lon1, lat2, lon2) {
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

// Known spatial coordinates for Delhi NCR landmarks
const LOCAL_NCR_LANDMARKS = {
  "dlf camellias": { lat: 28.4520, lng: 77.0980, name: "DLF Camellias Golf Course Road Gurugram" },
  "dlf cyber hub": { lat: 28.4950, lng: 77.0895, name: "DLF Cyber Hub Gurugram" },
  "supreme court": { lat: 28.6225, lng: 77.2390, name: "Supreme Court of India" },
  "khan market": { lat: 28.6002, lng: 77.2273, name: "Khan Market" },
  "majnu ka tilla": { lat: 28.7011, lng: 77.2285, name: "Majnu ka Tilla Tibetan Colony" },
  "select citywalk": { lat: 28.5286, lng: 77.2193, name: "Select CITYWALK Saket" },
  "iit delhi": { lat: 28.5450, lng: 77.1926, name: "IIT Delhi Campus" },
  "aiims": { lat: 28.5672, lng: 77.2100, name: "AIIMS Hospital" },
  "jnu": { lat: 28.5400, lng: 77.1664, name: "JNU Campus" },
  "red fort": { lat: 28.6562, lng: 77.2410, name: "Red Fort (Lal Qila)" },
  "qutub minar": { lat: 28.5245, lng: 77.1855, name: "Qutub Minar" },
  "connaught place": { lat: 28.6315, lng: 77.2167, name: "Connaught Place (Rajiv Chowk)" },
  "rajiv chowk": { lat: 28.6315, lng: 77.2167, name: "Rajiv Chowk Interchange" },
  "anand vihar": { lat: 28.6469, lng: 77.3160, name: "Anand Vihar ISBT & Railway Station" },
  "kashmere gate": { lat: 28.6675, lng: 77.2283, name: "ISBT Kashmere Gate" },
  "igi airport": { lat: 28.5562, lng: 77.1000, name: "IGI Airport T3 Terminal" },
  "new delhi railway station": { lat: 28.6430, lng: 77.2194, name: "New Delhi Railway Station (NDLS)" },
  "old delhi railway station": { lat: 28.6616, lng: 77.2274, name: "Old Delhi Railway Station (ODRS)" },
  "hauz khas": { lat: 28.5494, lng: 77.2001, name: "Hauz Khas Village & Metro" },
  "lajpat nagar": { lat: 28.5677, lng: 77.2433, name: "Lajpat Nagar Central Market" },
  "sarojini nagar": { lat: 28.5746, lng: 77.1983, name: "Sarojini Nagar Market" },
  "karol bagh": { lat: 28.6514, lng: 77.1907, name: "Karol Bagh Market" },
  "lotus temple": { lat: 28.5535, lng: 77.2588, name: "Lotus Temple" },
  "akshardham": { lat: 28.6127, lng: 77.2773, name: "Swaminarayan Akshardham Temple" }
};

// OpenStreetMap Nominatim Geocoding API with NCR viewbox bounding box
export async function geocodeNominatimNCR(queryText) {
  if (!queryText) return { name: "Delhi Center", lat: 28.6315, lng: 77.2167 };
  const q = queryText.toLowerCase().trim();

  // 1. Local landmark match
  for (const [key, val] of Object.entries(LOCAL_NCR_LANDMARKS)) {
    if (q.includes(key) || key.includes(q)) {
      return { name: val.name, lat: val.lat, lng: val.lng };
    }
  }

  // 2. DELHI_PLACES match
  const placeMatch = DELHI_PLACES.find(p => p.name.toLowerCase().includes(q) || q.includes(p.name.toLowerCase()));
  if (placeMatch) {
    return { name: placeMatch.name, lat: placeMatch.lat, lng: placeMatch.lng };
  }

  // 3. OpenStreetMap Nominatim API call bounded to NCR
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryText)}&viewbox=76.8,28.4,77.5,28.9&bounded=1`;
    const res = await fetch(url, { headers: { "User-Agent": "SheherSaathi-DelhiTransit/1.0" } });
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        const top = data[0];
        console.log(`[OSM Nominatim Geocode] "${queryText}" -> Lat: ${top.lat}, Lon: ${top.lon} (${top.display_name})`);
        return {
          name: queryText,
          lat: parseFloat(top.lat),
          lng: parseFloat(top.lon)
        };
      }
    }
  } catch (err) {
    console.warn(`[OSM Geocode Notice] ${err.message}`);
  }

  return { name: queryText, lat: 28.6315, lng: 77.2167 };
}

// Find nearest station object in raw_delhi_metro.json (244 objects) using Haversine
export function findNearestMetroStationByCoords(targetLat, targetLng) {
  let nearestStation = RAW_DELHI_METRO_STATIONS[0];
  let minDistance = Infinity;

  RAW_DELHI_METRO_STATIONS.forEach(st => {
    const stLat = st.lat || 28.6315 + ((st.line_number * 3 + st.sequence_index) % 30 - 15) * 0.008;
    const stLng = st.lng || 77.2167 + ((st.line_number * 5 + st.sequence_index) % 30 - 15) * 0.008;
    
    const dist = getHaversineKm(targetLat, targetLng, stLat, stLng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestStation = st;
    }
  });

  return {
    station: nearestStation,
    distanceKm: Math.round(minDistance * 10) / 10
  };
}

export function resolveDelhiRouteWithCoords(origGeo, destGeo) {
  const directKm = getHaversineKm(origGeo.lat, origGeo.lng, destGeo.lat, destGeo.lng);
  const roadKm = Math.max(1.5, Math.round((directKm * 1.35) * 10) / 10);
  const driveTimeMins = Math.max(10, Math.round(roadKm * 2.2));

  // Find spatial nearest DMRC station nodes from 244 objects
  const srcNearest = findNearestMetroStationByCoords(origGeo.lat, origGeo.lng);
  const dstNearest = findNearestMetroStationByCoords(destGeo.lat, destGeo.lng);

  const srcStation = srcNearest.station;
  const dstStation = dstNearest.station;

  // Intermediate sequence index calculation
  const sameLineStations = RAW_DELHI_METRO_STATIONS.filter(s => s.line_color === srcStation.line_color);
  const srcIdx = sameLineStations.findIndex(s => s.station_id === srcStation.station_id);
  const dstIdx = sameLineStations.findIndex(s => s.station_id === dstStation.station_id);

  let evaluatedSequence = [];
  if (srcIdx !== -1 && dstIdx !== -1) {
    if (srcIdx <= dstIdx) evaluatedSequence = sameLineStations.slice(srcIdx, dstIdx + 1);
    else evaluatedSequence = sameLineStations.slice(dstIdx, srcIdx + 1).reverse();
  } else {
    evaluatedSequence = [srcStation, dstStation];
  }

  const stationPathIds = evaluatedSequence.map(s => s.station_id);
  console.log("Evaluated Station Path IDs:", stationPathIds);

  const numStops = evaluatedSequence.length;
  const travelMins = Math.max(8, numStops * 2.5);
  const metroFare = Math.min(60, Math.max(10, Math.round(roadKm * 2.5)));
  const dtcBusFare = Math.min(25, Math.max(5, Math.round(roadKm * 1.2)));

  // Spatial Last-Mile Distance Calculations
  const firstMileDistKm = srcNearest.distanceKm;
  const lastMileDistKm = dstNearest.distanceKm;

  const firstMileStep = firstMileDistKm <= 0.5
    ? { type: "walk", title: `🚶 Walk ${Math.round(firstMileDistKm * 1000)}m (${Math.max(3, Math.round(firstMileDistKm * 12))} mins) from ${origGeo.name} to ${srcStation.station_name} Metro Station`, duration: `${Math.max(3, Math.round(firstMileDistKm * 12))} min`, cost: "Free" }
    : firstMileDistKm <= 2.0
    ? { type: "walk", title: `🚶 Walk / E-Rickshaw ${firstMileDistKm} km (${Math.round(firstMileDistKm * 6)} mins) from ${origGeo.name} to ${srcStation.station_name} Metro Station`, duration: `${Math.round(firstMileDistKm * 6)} min`, cost: "₹10" }
    : { type: "auto", title: `🛺 Take E-Rickshaw / Auto ${firstMileDistKm} km (${Math.round(firstMileDistKm * 4)} mins) from ${origGeo.name} to ${srcStation.station_name} Metro Station`, duration: `${Math.round(firstMileDistKm * 4)} min`, cost: "₹30" };

  const lastMileStep = lastMileDistKm <= 0.5
    ? { type: "walk", title: `🚶 Walk ${Math.round(lastMileDistKm * 1000)}m (${Math.max(3, Math.round(lastMileDistKm * 12))} mins) from ${dstStation.station_name} Metro Station to ${destGeo.name}`, duration: `${Math.max(3, Math.round(lastMileDistKm * 12))} min`, cost: "Free" }
    : lastMileDistKm <= 2.0
    ? { type: "walk", title: `🚶 Walk / E-Rickshaw ${lastMileDistKm} km (${Math.round(lastMileDistKm * 6)} mins) to ${destGeo.name}`, duration: `${Math.round(lastMileDistKm * 6)} min`, cost: "₹10" }
    : { type: "auto", title: `🛺 Take E-Rickshaw / Auto ${lastMileDistKm} km (${Math.round(lastMileDistKm * 4)} mins) to ${destGeo.name}`, duration: `${Math.round(lastMileDistKm * 4)} min`, cost: "₹30" };

  // Dynamic DTC Bus Route matching from raw_delhi_routes.json (1,653 objects)
  const qOrig = origGeo.name.toLowerCase();
  const qDest = destGeo.name.toLowerCase();
  let matchedBus = DTC_BUS_ROUTES.find(r => 
    (r.stops || []).some(s => s.toLowerCase().includes(qOrig) || qOrig.includes(s.toLowerCase())) &&
    (r.stops || []).some(s => s.toLowerCase().includes(qDest) || qDest.includes(s.toLowerCase()))
  ) || DTC_BUS_ROUTES[0];

  const metroSteps = [
    { type: "walk", title: `📍 Depart from ${origGeo.name}`, duration: "0 min", cost: "Free" },
    firstMileStep,
    {
      type: "bus",
      title: `🚇 Board DMRC ${srcStation.line_color} Line at ${srcStation.station_name} → Alight at ${dstStation.station_name} (${numStops} Stations)`,
      duration: `${Math.round(travelMins)} min`,
      cost: `₹${metroFare}`
    },
    lastMileStep,
    { type: "walk", title: `🏁 Arrive at ${destGeo.name}`, duration: "0 min", cost: "Free" }
  ];

  return {
    distanceKm: roadKm,
    totalTimeMins: Math.round(travelMins + 7),
    totalDuration: `${Math.round(travelMins + 7)} min`,
    totalCost: `₹${metroFare} (Metro) / ₹${dtcBusFare} (Bus)`,
    mode: `DMRC ${srcStation.line_color} Line`,
    summary: `DMRC Metro from ${srcStation.station_name} to ${dstStation.station_name} (${numStops} Stations)`,
    sourceCoords: { latitude: origGeo.lat, longitude: origGeo.lng },
    destCoords: { latitude: destGeo.lat, longitude: destGeo.lng },
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
      boardStop: origGeo.name,
      alightStop: destGeo.name,
      route: {
        busNumber: matchedBus.busNumber || matchedBus.route_short_name,
        routeName: matchedBus.routeName || `${matchedBus.origin} ⇄ ${matchedBus.destination}`,
        stopsPassed: (matchedBus.stops || []).slice(0, 5)
      }
    },
    steps: metroSteps
  };
}

export async function resolveDelhiRealRouteAsync(originName, destName) {
  const origGeo = await geocodeNominatimNCR(originName);
  const destGeo = await geocodeNominatimNCR(destName);
  return resolveDelhiRouteWithCoords(origGeo, destGeo);
}

export function resolveDelhiRealRoute(originName, destName) {
  const origKey = (originName || "").toLowerCase().trim();
  const destKey = (destName || "").toLowerCase().trim();

  let origGeo = { name: originName || "Delhi Center", lat: 28.6315, lng: 77.2167 };
  let destGeo = { name: destName || "South Delhi Hub", lat: 28.5245, lng: 77.1855 };

  for (const [key, val] of Object.entries(LOCAL_NCR_LANDMARKS)) {
    if (origKey.includes(key) || key.includes(origKey)) origGeo = { name: val.name, lat: val.lat, lng: val.lng };
    if (destKey.includes(key) || key.includes(destKey)) destGeo = { name: val.name, lat: val.lat, lng: val.lng };
  }

  return resolveDelhiRouteWithCoords(origGeo, destGeo);
}
