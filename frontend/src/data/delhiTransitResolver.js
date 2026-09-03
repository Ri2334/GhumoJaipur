import { DELHI_PLACES } from "./delhiPlacesData";
import { getNearestDelhiMetroStation } from "./delhiMetroData";

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
    name: originName,
    lat: 28.6315,
    lng: 77.2167
  };

  const destObj = DELHI_PLACES.find(p => p.name.toLowerCase().includes(destKey) || destKey.includes(p.name.toLowerCase())) || {
    name: destName,
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
      ]
    };
  }

  const directKm = getHaversineKm(origObj.lat, origObj.lng, destObj.lat, destObj.lng);
  const roadKm = Math.round((Math.max(1.8, directKm * 1.3)) * 10) / 10;
  const driveTimeMins = Math.round(roadKm * 2.1);

  const srcMetro = getNearestDelhiMetroStation(origObj.name);
  const dstMetro = getNearestDelhiMetroStation(destObj.name);

  const hasMetro = Boolean(srcMetro && dstMetro && srcMetro.name !== dstMetro.name);

  // DMRC Metro Fare Tier (₹10 - ₹60)
  const metroFare = Math.min(60, Math.max(10, Math.round(roadKm * 2.5)));
  const dtcBusFare = Math.min(25, Math.max(10, Math.round(roadKm * 1.2)));

  const metroSequence = hasMetro ? [
    { name: srcMetro.name, area: `Boarding Station (${srcMetro.line})` },
    { name: "Rajiv Chowk (Interchange)", area: "DMRC Transfer Station" },
    { name: dstMetro.name, area: `Destination Station (${dstMetro.line})` }
  ] : null;

  return {
    distanceKm: roadKm,
    totalTimeMins: driveTimeMins,
    totalDuration: `${driveTimeMins} min`,
    totalCost: `₹${metroFare} (Metro) / ₹${dtcBusFare} (Bus)`,
    mode: hasMetro ? `DMRC ${srcMetro.line}` : "DTC Electric Bus Corridor",
    summary: hasMetro 
      ? `DMRC Metro from ${srcMetro.name} to ${dstMetro.name}` 
      : `DTC Electric Bus Corridor connecting ${origObj.name} to ${destObj.name}`,
    sourceCoords: { latitude: origObj.lat, longitude: origObj.lng },
    destCoords: { latitude: destObj.lat, longitude: destObj.lng },
    hasValidMetro: hasMetro,
    sourceMetroName: srcMetro?.name,
    destMetroName: dstMetro?.name,
    metroSequence: metroSequence,
    steps: [
      { 
        type: "bus", 
        title: hasMetro ? `DMRC ${srcMetro.line} from ${srcMetro.name} to ${dstMetro.name}` : `DTC Electric Bus from ${origObj.name}`, 
        duration: `${driveTimeMins} min`, 
        cost: `₹${metroFare}` 
      },
      { 
        type: "walk", 
        title: `Walk / E-Rickshaw from Metro Station to ${destObj.name}`, 
        duration: "5 min", 
        cost: "₹10" 
      }
    ]
  };
}
