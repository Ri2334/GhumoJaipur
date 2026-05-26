import MetroRoute from "../models/MetroRoute.js";
import MetroStation from "../models/MetroStation.js";
import TouristLocation from "../models/TouristLocation.js";
import TransportRoute from "../models/TransportRoute.js";
import CabRide from "../models/CabRide.js";
import SharedRide from "../models/SharedRide.js";
import Driver from "../models/Driver.js";
import BusRoute from "../models/BusRoute.js";
import User from "../models/User.js";

const normalizeName = (value = "") => {
  let normalized = String(value).trim().toLowerCase();
  // Standardize common Jaipur variations
  normalized = normalized.replace(/chaupar/g, "chopar");
  normalized = normalized.replace(/chopad/g, "chopar");
  normalized = normalized.replace(/choupad/g, "chopar");
  normalized = normalized.replace(/amber/g, "amer");
  normalized = normalized.replace(/station/g, "stn");
  normalized = normalized.replace(/hospital/g, "hosp");
  normalized = normalized.replace(/fort/g, ""); 
  normalized = normalized.replace(/temple/g, ""); 
  normalized = normalized.replace(/bazaar/g, "");
  normalized = normalized.replace(/bazar/g, "");
  normalized = normalized.replace(/garden/g, "");
  normalized = normalized.replace(/railway/g, "rly");
  normalized = normalized.replace(/\s+/g, "");
  return normalized;
};

const toMinutes = (distanceKm, speedKmph) => Math.max(1, Math.round((distanceKm / speedKmph) * 60));

const isPeakHour = (time) => {
  const hour = time.getHours();
  return (hour >= 8 && hour <= 11) || (hour >= 17 && hour <= 20);
};

const getMetroFrequency = (time) => {
  const day = time.getDay(); // 0 = Sunday, 6 = Saturday
  if (day === 0) return 15; // Sunday
  if (day === 6) return 12; // Saturday
  if (isPeakHour(time)) return 6; // Peak hours weekdays
  return 10; // Off-peak weekdays
};

const isMetroOperating = (time) => {
  const hour = time.getHours();
  const day = time.getDay();
  if (day === 0) return hour >= 8 && hour < 22; // Sunday 8am-10pm
  if (day === 6) return hour >= 7 && hour < 22; // Saturday 7am-10pm
  return hour >= 6 && hour < 22; // Weekdays 6am-10pm
};

const isBusOperating = (time) => {
  const hour = time.getHours();
  return hour >= 5 && hour < 21.5; // 5:00 AM to 9:30 PM
};

const getCabTimePerKm = (time) => {
  const hour = time.getHours();
  if (isPeakHour(time)) return 3.0; // Peak traffic
  if (hour >= 23 || hour < 6) return 1.2; // Late night fast
  return 1.8; // Normal day
};

const getAutoTimePerKm = (time) => {
  const hour = time.getHours();
  if (isPeakHour(time)) return 2.5; // Auto can squeeze through traffic better
  if (hour >= 23 || hour < 6) return 1.5;
  return 2.0;
};

const getNextDepartureTime = (time, frequency) => {
  const minsSinceHour = time.getMinutes();
  const nextDepartureMin = Math.ceil((minsSinceHour + 0.5) / frequency) * frequency;
  const nextTime = new Date(time);
  nextTime.setMinutes(nextDepartureMin);
  nextTime.setSeconds(0);
  nextTime.setMilliseconds(0);
  return nextTime;
};

const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getDistanceKm = (lat1, lon1, lat2, lon2, sourceName = "", destName = "") => {
  const radians = (value) => (value * Math.PI) / 180;
  const earthRadius = 6371;
  const deltaLat = radians(lat2 - lat1);
  const deltaLon = radians(lon2 - lon1);
  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(deltaLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLineDist = earthRadius * c;
  
  // Specific known road distances for accuracy
  const knownDistances = {
    "chomupulia-collectorycircle": 3.5,
    "jaipurrlystn-badichaupar": 4.8,
    "jaipurrlystn-sindhicamp": 1.8,
    "sindhicamp-chandpole": 1.2,
    "chandpole-badichaupar": 2.2,
    "malviyanagar-airport": 5.0,
    "mansarovar-rlystn": 9.5,
    "amer-badichaupar": 11.0,
    "vaishalinagar-rlystn": 6.5,
    "rajapark-citypalace": 4.5,
    "jaipurrlystn-sisodiaranigarden": 8.5,
    "transportnagar-sisodiaranigarden": 1.2
  };


  const key = `${normalizeName(sourceName)}-${normalizeName(destName)}`;
  const revKey = `${normalizeName(destName)}-${normalizeName(sourceName)}`;
  if (knownDistances[key]) return knownDistances[key];
  if (knownDistances[revKey]) return knownDistances[revKey];

  let roadFactor = 1.25; 
  if (straightLineDist > 5) roadFactor = 1.2;
  if (straightLineDist < 1) roadFactor = 1.4; 

  return Number((straightLineDist * roadFactor).toFixed(1));
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

const getPlaceInfo = async (name) => {
  const inputNorm = normalizeName(name);
  const inputWords = name.toLowerCase().split(/\s+/).filter(w => w.length > 2 && w !== "jaipur");
  
  const allLocations = await TouristLocation.find();
  
  // 1. Exact match
  let matchedLoc = allLocations.find(l => normalizeName(l.name) === inputNorm);
  
  // 2. Substring match
  if (!matchedLoc) {
    matchedLoc = allLocations.find(l => normalizeName(l.name).includes(inputNorm) || inputNorm.includes(normalizeName(l.name)));
  }

  // 3. Word-intersection match
  if (!matchedLoc && inputWords.length > 0) {
    matchedLoc = allLocations.find(l => {
      const locNameLow = l.name.toLowerCase();
      return inputWords.every(word => locNameLow.includes(word));
    });
  }

  if (matchedLoc) {
    let nearestStation = matchedLoc.nearestStation || "Railway Station";
    const canonicalStation = routeOrder.find(s => normalizeName(s) === normalizeName(nearestStation)) || nearestStation;

    return {
      lat: matchedLoc.latitude,
      lng: matchedLoc.longitude,
      nearest: canonicalStation,
      nearestBus: matchedLoc.nearestBusStop || matchedLoc.name,
      matchedName: matchedLoc.name
    };
  }

  // Metro station check
  for (const [key, value] of Object.entries(stationCoordinates)) {
    const stationNorm = normalizeName(key);
    if (inputNorm.includes(stationNorm) || stationNorm.includes(inputNorm)) {
      return { 
        lat: value.lat, 
        lng: value.lng, 
        nearest: key, 
        nearestBus: key, 
        matchedName: key 
      };
    }
  }

  return { lat: 26.9124, lng: 75.7873, nearest: "Railway Station", nearestBus: name, matchedName: name };
};

const findNearbyBusStops = async (lat, lng, limit = 5) => {
  const allPossibleStops = await TouristLocation.find({ 
    $or: [
      { category: "Bus Stop" },
      { category: "Transit" },
      { name: { $regex: /Bus Stop|Chaupar|Circle|Gate|Station|Mod|Phatak/i } }
    ]
  });

  const stopsWithDist = allPossibleStops.map(stop => ({
    name: stop.name,
    lat: stop.latitude,
    lng: stop.longitude,
    distance: getDistanceKm(lat, lng, stop.latitude, stop.longitude)
  }));

  const sorted = stopsWithDist.sort((a, b) => a.distance - b.distance);
  return sorted.slice(0, limit);
};

const findBusRoutes = async (sourcePlace, destPlace) => {
  const allRoutes = await BusRoute.find();
  const srcInfo = await getPlaceInfo(sourcePlace);
  const dstInfo = await getPlaceInfo(destPlace);

  if (normalizeName(srcInfo.matchedName) === normalizeName(dstInfo.matchedName)) return null;

  const srcNearbyStops = await findNearbyBusStops(srcInfo.lat, srcInfo.lng, 5);
  const dstNearbyStops = await findNearbyBusStops(dstInfo.lat, dstInfo.lng, 5);

  const freqMap = {
    "3A": 9, "RBP2": 10, "7": 12, "9A": 12, "3": 13, "AC2": 15, "14": 20, "16": 20, "28": 22, "AC7": 22, "26": 23, "AC1": 24, "1": 26, "AC8": 28, "15": 30, "24": 30, "34": 30, "30": 35, "32": 44, "11": 45, "6A": 48, "1A": 50, "27": 60, "10B": 75, "23A": 120, "MiniBus1": 12, "MiniBus2": 12, "AC5": 24
  };

  const matches = (stopList, targetName) => {
    const tNorm = normalizeName(targetName);
    return stopList.some(stop => {
       const stopNorm = normalizeName(stop);
       return stopNorm === tNorm || stopNorm.includes(tNorm) || tNorm.includes(stopNorm);
    });
  };

  const getStopNameInRoute = (stopList, targetName) => {
    const tNorm = normalizeName(targetName);
    return stopList.find(stop => {
       const stopNorm = normalizeName(stop);
       return stopNorm === tNorm || stopNorm.includes(tNorm) || tNorm.includes(stopNorm);
    });
  };

  let candidateRoutes = [];

  for (const sStop of srcNearbyStops) {
    for (const dStop of dstNearbyStops) {
      const sNorm = normalizeName(sStop.name);
      const dNorm = normalizeName(dStop.name);
      if (sNorm === dNorm) continue;

      // 1. Direct Routes
      const directRoutes = allRoutes.filter(r => matches(r.stops, sNorm) && matches(r.stops, dNorm));
      for (const dr of directRoutes) {
        const sNameInRoute = getStopNameInRoute(dr.stops, sNorm);
        const dNameInRoute = getStopNameInRoute(dr.stops, dNorm);
        const sIdx = dr.stops.indexOf(sNameInRoute);
        const dIdx = dr.stops.indexOf(dNameInRoute);
        
        if (sIdx === dIdx) continue;
        
        const stopsCount = Math.abs(dIdx - sIdx);
        
        const travelTime = (stopsCount * 5) + 8;
        const waitTime = Math.floor((freqMap[dr.routeNumber] || 15) / 2);
        
        const getLegTime = (dist) => {
          const baseTime = dist <= 1.0 ? dist * 15 : (dist * 4) + 3;
          const bias = dist > 1.5 ? 1.5 : 1.0; 
          return baseTime * bias;
        };
        const leg1Time = getLegTime(sStop.distance);
        const leg2Time = getLegTime(dStop.distance);
        const totalTime = leg1Time + waitTime + travelTime + leg2Time;

        candidateRoutes.push({
          type: "direct",
          route: dr,
          sourceStop: sNameInRoute,
          destStop: dNameInRoute,
          fare: stopsCount <= 5 ? 10 : stopsCount <= 10 ? 15 : 20,
          time: travelTime,
          walkToStopDist: sStop.distance,
          walkFromStopDist: dStop.distance,
          totalTime,
          frequency: freqMap[dr.routeNumber] || 20
        });
      }

      // 2. Indirect (1 transfer)
      if (directRoutes.length === 0) {
        const sourceRoutes = allRoutes.filter(r => matches(r.stops, sNorm));
        const destRoutes = allRoutes.filter(r => matches(r.stops, dNorm));

        for (const sr of sourceRoutes) {
          for (const dr of destRoutes) {
            const commonStop = sr.stops.find(stop => {
              const stopNorm = normalizeName(stop);
              return dr.stops.some(dStopInRoute => normalizeName(dStopInRoute) === stopNorm);
            });

            if (commonStop) {
              const sNameInRoute = getStopNameInRoute(sr.stops, sNorm);
              const dNameInRoute = getStopNameInRoute(dr.stops, dNorm);
              
              const travelTime = 55; 
              const waitTime = 15; 
              const getLegTime = (dist) => {
                const baseTime = dist <= 1.0 ? dist * 15 : (dist * 4) + 3;
                const bias = dist > 1.5 ? 1.5 : 1.0; 
                return baseTime * bias;
              };
              const leg1Time = getLegTime(sStop.distance);
              const leg2Time = getLegTime(dStop.distance);
              const totalTime = leg1Time + waitTime + travelTime + leg2Time;

              candidateRoutes.push({
                type: "indirect",
                route1: sr,
                route2: dr,
                transferStop: commonStop,
                sourceStop: sNameInRoute,
                destStop: dNameInRoute,
                fare: 25,
                time: travelTime,
                walkToStopDist: sStop.distance,
                walkFromStopDist: dStop.distance,
                totalTime,
                frequency: freqMap[sr.routeNumber] || 20
              });
            }
          }
        }
      }
    }
  }

  if (candidateRoutes.length === 0) return null;

  return candidateRoutes.sort((a, b) => a.totalTime - b.totalTime)[0];
};

const buildMetroRoute = async (sourceStationName, destinationStationName) => {
  const sNorm = normalizeName(sourceStationName);
  const dNorm = normalizeName(destinationStationName);

  const sourceIndex = routeOrder.findIndex(s => normalizeName(s) === sNorm);
  const destinationIndex = routeOrder.findIndex(s => normalizeName(s) === dNorm);

  if (sourceIndex === -1 || destinationIndex === -1 || sourceIndex === destinationIndex) {
    return null; 
  }

  const orderedStationNames = sourceIndex <= destinationIndex
    ? routeOrder.slice(sourceIndex, destinationIndex + 1)
    : routeOrder.slice(destinationIndex, sourceIndex + 1).reverse();

  const stationSequence = orderedStationNames.map(name => ({ _id: name, name, ...stationCoordinates[name] }));
  
  const hops = Math.max(stationSequence.length - 1, 1);
  const fare = hops <= 2 ? 10 : hops <= 5 ? 15 : 20;
  const travelTimeMinutes = hops * 3; 
  const waitingTimeMinutes = Math.floor(Math.random() * 5) + 2; 
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

const buildRecommendation = ({ distanceKm, route, cabRide, sharedRide, autoRide, busRoute, walkingAllowed, isMetroBeneficial, sourceToMetroDist, metroToDestDist, currentTime }) => {
  const items = [];
  const time = currentTime || new Date();

  if (walkingAllowed) {
    items.push({
      mode: "Walk",
      fare: 0,
      time: `${Math.max(10, Math.round(distanceKm * 15))} mins`,
      badge: distanceKm <= 1.5 ? "best" : "cheapest",
      note: "Best for short city hops under 2 km.",
    });
  }

  if (busRoute) {
    const operating = isBusOperating(time);
    const frequency = busRoute.route?.frequencyMinutes || busRoute.route1?.frequencyMinutes || 15;
    const nextDeparture = getNextDepartureTime(time, frequency);
    const waitTime = Math.round((nextDeparture - time) / 60000);
    
    const walkToBus = Math.round((busRoute.walkToStopDist || 0) * 1000);
    const walkFromBus = Math.round((busRoute.walkFromStopDist || 0) * 1000);
    
    const travelTime = busRoute.time;
    // Total time = walk to + wait + travel + walk from
    const totalTime = Math.round((busRoute.walkToStopDist || 0) * 15) + waitTime + travelTime + Math.round((busRoute.walkFromStopDist || 0) * 15);

    let busNote = !operating 
        ? "Bus service currently offline (Operates 5:30 AM - 9:30 PM)"
        : `Next bus at ${formatTime(nextDeparture)}. `;
    
    if (operating) {
        if (walkToBus > 800) busNote += `Take e-rickshaw to ${busRoute.sourceStop}. `;
        else if (walkToBus > 50) busNote += `Walk ${walkToBus}m to ${busRoute.sourceStop}. `;
        
        if (busRoute.type === "indirect") {
           busNote += `Transfer at ${busRoute.transferStop}. `;
        }

        if (walkFromBus > 800) busNote += `Finally take auto to destination.`;
        else if (walkFromBus > 50) busNote += `Finally walk ${walkFromBus}m to destination.`;
    }

    items.push({
      mode: "Bus",
      fare: operating ? busRoute.fare : 0,
      time: operating ? `${totalTime} mins` : "--",
      badge: operating && busRoute.type === "direct" && totalTime < 45 ? "cheapest" : "default",
      note: busNote
    });
  }

  if (autoRide) {
    const timePerKm = getAutoTimePerKm(time);
    const travelTime = Math.round(distanceKm * timePerKm);
    const waitTime = Math.floor(Math.random() * 5) + 3;

    items.push({
      mode: "Auto",
      fare: autoRide.estimatedFare,
      time: `${travelTime + waitTime} mins`,
      badge: !isMetroBeneficial && distanceKm <= 5 ? "best" : "default",
      note: `Arriving at pickup in ${waitTime}m. Optimized for current traffic.`,
    });
  } else {
    items.push({ mode: "Auto", fare: 0, time: "--", badge: "default", note: "No autos available nearby." });
  }

  if (cabRide) {
    const timePerKm = getCabTimePerKm(time);
    const travelTime = Math.round(distanceKm * timePerKm);
    const waitTime = Math.floor(Math.random() * 6) + 4;

    items.push({
      mode: "Cab",
      fare: cabRide.estimatedFare,
      time: `${travelTime + waitTime} mins`,
      badge: "fastest",
      note: `Arriving at pickup in ${waitTime}m. Professional service.`,
    });
  } else {
    items.push({ mode: "Cab", fare: 0, time: "--", badge: "default", note: "No cabs available nearby." });
  }

  if (sharedRide && cabRide) {
    const timePerKm = getCabTimePerKm(time);
    const travelTime = Math.round(distanceKm * timePerKm);
    const detourTime = Math.floor(Math.random() * 10) + 5; 
    const totalTime = travelTime + detourTime;

    items.push({
      mode: "Shared Cab",
      fare: sharedRide.splitFare,
      time: `${totalTime} mins`,
      badge: sharedRide.recommended && !isMetroBeneficial ? "best" : "default",
      note: sharedRide.note || `Lower cost, slightly longer route (${detourTime}m extra).`,
    });
  }

  if (route && isMetroBeneficial) {
    const operating = isMetroOperating(time);
    const frequency = getMetroFrequency(time);
    const nextDeparture = getNextDepartureTime(time, frequency);
    const waitTime = Math.round((nextDeparture - time) / 60000);
    
    const walkToMetro = Math.round(sourceToMetroDist * 1000);
    const walkFromMetro = Math.round(metroToDestDist * 1000);
    const totalTime = route.travelTimeMinutes + waitTime + Math.round(sourceToMetroDist * 15) + Math.round(metroToDestDist * 15);
    
    let metroNote = !operating 
        ? "Metro service currently closed (Starts 6:00 AM / 8:00 AM Sunday)"
        : `Next train at ${formatTime(nextDeparture)}. `;
    
    if (operating) {
        if (walkToMetro > 1000) metroNote += `Take e-rickshaw to ${route.sourceStation.name}. `;
        else metroNote += `Walk ${walkToMetro}m to ${route.sourceStation.name}. `;
        
        if (walkFromMetro > 1000) metroNote += `Finally take auto to destination.`;
        else metroNote += `Finally walk ${walkFromMetro}m to destination.`;
    }

    items.push({
      mode: "Metro",
      fare: operating ? route.fare : 0,
      time: operating ? `${totalTime} mins` : "--",
      badge: operating ? "recommended" : "default",
      note: metroNote,
      nextDepartureTime: operating ? nextDeparture.toISOString() : null,
      waitTimeMinutes: waitTime
    });
  }

  const cheapest = items.reduce((best, current) => (!best || (current.fare > 0 && current.fare < (best.fare || 999)) ? current : best), null);
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
    const { source, destination, currentTime } = req.body;
    const requestTime = currentTime ? new Date(currentTime) : new Date();

    if (!source || !destination) {
      return res.status(400).json({ success: false, message: "Source and destination are required" });
    }

    const sourceInfo = await getPlaceInfo(source);
    const destInfo = await getPlaceInfo(destination);

    const distanceKm = getDistanceKm(sourceInfo.lat, sourceInfo.lng, destInfo.lat, destInfo.lng, source, destination);
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
      sourceToMetroDist = getDistanceKm(sourceInfo.lat, sourceInfo.lng, srcMetroCoords.lat, srcMetroCoords.lng, source, sourceStationName);
      metroToDestDist = getDistanceKm(destInfo.lat, destInfo.lng, destMetroCoords.lat, destMetroCoords.lng, destination, destinationStationName);
      if (sourceToMetroDist + metroToDestDist < 4 || distanceKm > 6) {
        isMetroBeneficial = true;
      }
    }

    // BUS ROUTE SEARCH
    const busRoute = await findBusRoutes(source, destination);
    
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

    const cabDriver = availableCabs[0];
    const autoDriver = availableAutos[0];

    const cabBaseFare = cabDriver ? Math.round(cabDriver.baseFare + (distanceKm * cabDriver.perKmRate)) : 0;
    const autoBaseFare = autoDriver ? Math.round(autoDriver.baseFare + (distanceKm * autoDriver.perKmRate)) : 0;

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
        lowestFare: cabBaseFare, 
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
      busRoute,
      walkingAllowed,
      isMetroBeneficial,
      sourceToMetroDist,
      metroToDestDist,
      currentTime: requestTime
    });

    const metroRec = recommendations.find(r => r.mode === 'Metro');
    const busRec = recommendations.find(r => r.mode === 'Bus');

    const routeRecord = {
      sourceName: source,
      destinationName: destination,
      distanceKm,
      walkingAllowed,
      recommendedMode: recommendations.find((item) => item.isRecommended)?.mode || recommendations[0]?.mode || "Cab",
      cheapestMode: recommendations.find((item) => item.isCheapest)?.mode || recommendations[0]?.mode || "Bus",
      fastestMode: recommendations.find((item) => item.isFastest)?.mode || recommendations[0]?.mode || "Cab",
      metroRoute: isMetroBeneficial ? metroRoute : null,
      busRoute: busRoute
    };

    if (metroRec && metroRoute) {
        metroRoute.nextDepartureTime = metroRec.nextDepartureTime;
        metroRoute.waitingTimeMinutes = metroRec.waitTimeMinutes;
    }

    if (busRec && busRoute) {
        const frequency = busRoute.route?.frequencyMinutes || 15;
        const nextDeparture = getNextDepartureTime(requestTime, frequency);
        busRoute.nextDepartureTime = nextDeparture.toISOString();
        busRoute.waitingTimeMinutes = Math.round((nextDeparture - requestTime) / 60000);
    }

    return res.status(200).json({
      success: true,
      data: {
        route: routeRecord,
        metroRoute: isMetroBeneficial ? metroRoute : null,
        busRoute,
        cabDriver: cabDriver ? { _id: cabDriver._id, name: cabDriver.userId.fullName, vehicle: cabDriver.vehicle, vehicleNumber: cabDriver.vehicleNumber, rating: cabDriver.rating } : null,
        autoDriver: autoDriver ? { _id: autoDriver._id, name: autoDriver.userId.fullName, vehicle: autoDriver.vehicle, vehicleNumber: autoDriver.vehicleNumber, rating: autoDriver.rating } : null,
        recommendations,
        currentTime: requestTime.toISOString(),
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
