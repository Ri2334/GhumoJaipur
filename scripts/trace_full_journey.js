import fs from "fs";
import path from "path";
import { getGoogleTransitJourney } from "../backend/services/googleTransitService.js";

// Load backend/.env
try {
  const envPath = path.resolve("./backend/.env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    content.split("\n").forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (!process.env[key]) process.env[key] = value.trim();
      }
    });
  }
} catch (e) {}

async function traceJourney(originStr, destStr) {
  console.log("\n=======================================================");
  console.log(`FULL RUNTIME TRACE FOR: "${originStr}" ➔ "${destStr}"`);
  console.log("=======================================================");

  // 1. USER INPUT
  console.log("\n--- STAGE 1: USER INPUT ---");
  console.log({ origin: originStr, destination: destStr });

  // Call Service (triggers STAGE 2: GOOGLE REQUEST & STAGE 3: GOOGLE RESPONSE SUMMARY)
  const canonical = await getGoogleTransitJourney(originStr, destStr);

  // 4. NORMALIZED BACKEND RESPONSE
  console.log("\n--- STAGE 4: NORMALIZED BACKEND RESPONSE ---");
  console.log(JSON.stringify({
    status: canonical.status,
    origin: canonical.origin,
    destination: canonical.destination,
    totalDurationMinutes: canonical.totalDurationMinutes,
    walkingDistanceMeters: canonical.walkingDistanceMeters,
    transfers: canonical.transfers,
    routesCount: canonical.routes?.length,
    primaryRouteSummary: canonical.routes?.[0]?.summary
  }, null, 2));

  // 5. FRONTEND RECEIVED OBJECT
  console.log("\n--- STAGE 5: FRONTEND RECEIVED OBJECT ---");
  const primaryRoute = canonical.routes?.[0];
  const transitLegs = primaryRoute?.legs.filter(l => l.type === "TRANSIT") || [];
  const firstMileLeg = primaryRoute?.legs.find(l => l.type === "WALK" && l.firstMileRecommendation);
  const lastMileLeg = primaryRoute?.legs.find(l => l.type === "WALK" && l.lastMileRecommendation);

  const frontendReceived = {
    status: canonical.status,
    routeCount: canonical.routes?.length,
    selectedRouteSummary: primaryRoute?.summary,
    transitLegs: transitLegs.map(l => ({
      mode: l.mode,
      line: l.line.shortName,
      agency: l.line.agency,
      boardingStop: l.departureStop.name,
      alightingStop: l.arrivalStop.name,
      durationMinutes: l.durationMinutes,
      intermediateStopsCount: l.intermediateStops.length
    })),
    firstMile: firstMileLeg ? firstMileLeg.firstMileRecommendation : "NONE",
    lastMile: lastMileLeg ? lastMileLeg.lastMileRecommendation : "NONE"
  };
  console.log(JSON.stringify(frontendReceived, null, 2));

  // 6. FINAL RENDERED JOURNEY
  console.log("\n--- STAGE 6: FINAL RENDERED JOURNEY (BUS ROUTE TIMELINE DATA CONTRACT) ---");
  const renderedJourney = {
    title: primaryRoute?.summary || "Transit Journey",
    fareText: primaryRoute?.fare?.text || "Information unavailable",
    durationText: `${primaryRoute?.totalDurationMinutes} mins`,
    boardingStop: transitLegs[0]?.departureStop?.name || originStr,
    alightingStop: transitLegs[transitLegs.length - 1]?.arrivalStop?.name || destStr,
    transitLine: transitLegs[0]?.line?.shortName || "Transit",
    firstMileRecommendation: firstMileLeg ? (firstMileLeg.firstMileRecommendation === "E_RICKSHAW_AUTO" ? `Take E-rickshaw / Auto (${Math.round(firstMileLeg.distanceMeters / 100) / 10} km)` : `Walk ${firstMileLeg.distanceMeters} m`) : "Walk",
    lastMileRecommendation: lastMileLeg ? (lastMileLeg.lastMileRecommendation === "E_RICKSHAW_AUTO" ? `Take E-rickshaw / Auto (${Math.round(lastMileLeg.distanceMeters / 100) / 10} km)` : `Walk ${lastMileLeg.distanceMeters} m`) : "Walk",
    intermediateStopsSequence: [
      transitLegs[0]?.departureStop?.name,
      ...(transitLegs[0]?.intermediateStops || []).map(s => s.name),
      transitLegs[transitLegs.length - 1]?.arrivalStop?.name
    ].filter(Boolean)
  };
  console.log(JSON.stringify(renderedJourney, null, 2));
}

async function runTraces() {
  await traceJourney("Connaught Place", "India Gate");
  await traceJourney("Connaught Place", "Qutub Minar");
}

runTraces();
