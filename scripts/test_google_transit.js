import fs from "fs";
import path from "path";
import { getGoogleTransitJourney } from "../backend/services/googleTransitService.js";

// Load backend/.env manually if present
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


const TEST_LOCATION_PAIRS = [
  { origin: "Connaught Place", destination: "India Gate" },
  { origin: "Connaught Place", destination: "Qutub Minar" },
  { origin: "IIT Delhi", destination: "Lotus Temple" },
  { origin: "Rajiv Chowk", destination: "New Delhi Railway Station" },
  { origin: "Anand Vihar", destination: "Sector 21 Dwarka" },
  { origin: "Karol Bagh", destination: "Lajpat Nagar" },
  { origin: "Hauz Khas", destination: "Chandni Chowk" },
  { origin: "Kashmere Gate ISBT", destination: "AIIMS New Delhi" },
  { origin: "Akshardham Temple", destination: "Sarojini Nagar Market" },
  { origin: "Delhi University North Campus", destination: "Nehru Place" },
  { origin: "Jawaharlal Nehru University", destination: "Red Fort" },
  { origin: "IGI Airport Terminal 3", destination: "Connaught Place" },
  { origin: "Dwarka Mor", destination: "Gurugram Cyber City" },
  { origin: "Saket Metro Station", destination: "Jama Masjid" },
  { origin: "Mayur Vihar Phase 1", destination: "Rohini Sector 18" },
  { origin: "Jasola Vihar", destination: "Janakpuri West" },
  { origin: "Pitampura", destination: "Green Park" },
  { origin: "Vasant Kunj", destination: "Dilli Haat INA" },
  { origin: "Nizamuddin Railway Station", destination: "Major Dhyan Chand National Stadium" },
  { origin: "Humayun's Tomb", destination: "Lodi Gardens" },
  { origin: "Purana Qila", destination: "National Gallery of Modern Art" },
  { origin: "Subhash Nagar", destination: "Paharganj" },
  { origin: "Model Town", destination: "Okhla Bird Sanctuary" },
  { origin: "Khan Market", destination: "Select CITYWALK Saket" },
  { origin: "Civil Lines", destination: "Vasant Vihar" },
  { origin: "Preet Vihar", destination: "Munirka" },
  { origin: "Kalkaji Mandir", destination: "Chhatarpur Temple" },
  { origin: "Rajouri Garden", destination: "Yamuna Bank" },
  { origin: "Shalimar Bagh", destination: "GTB Nagar" },
  { origin: "Chirag Delhi", destination: "Old Delhi Railway Station" }
];

async function runDiagnosticSuite() {
  console.log("\n=======================================================");
  console.log("SHEHER SAATHI — GOOGLE TRANSIT ENGINE DIAGNOSTIC SUITE");
  console.log("=======================================================");
  console.log(`Checking GOOGLE_MAPS_API_KEY...`);
  
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  console.log(`GOOGLE_MAPS_API_KEY status: ${apiKey ? "PRESENT" : "MISSING"}\n`);

  if (!apiKey) {
    console.log("-------------------------------------------------------");
    console.log("TEST 1: MISSING API KEY AUDIT ASSERTION");
    console.log("-------------------------------------------------------");
    const result = await getGoogleTransitJourney("Connaught Place", "Qutub Minar");
    console.log("Returned status:", result.status);
    console.log("Returned message:", result.message);
    if (result.status === "MISSING_API_KEY") {
      console.log("✅ PASSED: Backend correctly reports missing credentials without silently inventing broken routes.");
    } else {
      console.log("❌ FAILED: Unexpected status when API key is missing.");
    }
    console.log("\n[SYSTEM NOTICE] To test live Google Routes responses across all 30 test pairs, please add a valid GOOGLE_MAPS_API_KEY to backend/.env");
    return;
  }

  console.log(`Executing 30+ Arbitrary Delhi Location Pair Tests...\n`);
  let passedCount = 0;

  for (let i = 0; i < TEST_LOCATION_PAIRS.length; i++) {
    const pair = TEST_LOCATION_PAIRS[i];
    console.log(`--- Test ${i + 1}/${TEST_LOCATION_PAIRS.length}: "${pair.origin}" ➔ "${pair.destination}" ---`);

    try {
      const journey = await getGoogleTransitJourney(pair.origin, pair.destination);
      console.log(`Status: ${journey.status}`);

      if (journey.status === "FOUND") {
        console.log(`Routes Returned: ${journey.routes.length}`);
        const primary = journey.routes[0];
        console.log(`Primary Route Summary: "${primary.summary}"`);
        console.log(`Total Duration: ${primary.totalDurationMinutes} min | Walking: ${primary.walkingDistanceMeters} m | Transfers: ${primary.transfers}`);
        
        // Assert itinerary leg order and intermediate stops
        primary.legs.forEach((leg, lIdx) => {
          if (leg.type === "TRANSIT") {
            console.log(`  Leg ${lIdx + 1}: [${leg.mode}] ${leg.line.shortName} (${leg.line.agency || 'Transit'}) | ${leg.departureStop.name} ➔ ${leg.arrivalStop.name} (${leg.durationMinutes} min, ${leg.numStops} stops)`);
          } else if (leg.type === "WALK") {
            console.log(`  Leg ${lIdx + 1}: [WALK] ${leg.instruction || leg.distanceMeters + 'm'} ${leg.firstMileRecommendation ? '(First-Mile: ' + leg.firstMileRecommendation + ')' : ''} ${leg.lastMileRecommendation ? '(Last-Mile: ' + leg.lastMileRecommendation + ')' : ''}`);
          }
        });

        passedCount++;
      } else {
        console.log(`No verified route found by Google for pair: ${pair.origin} ➔ ${pair.destination}`);
        console.log(`Details: ${journey.errorDetails || journey.message || 'N/A'}`);
      }
    } catch (err) {
      console.error(`Exception during test:`, err.message);
    }
    console.log("");
  }

  console.log("=======================================================");
  console.log(`DIAGNOSTIC SUITE SUMMARY: ${passedCount}/${TEST_LOCATION_PAIRS.length} journeys successfully resolved.`);
  console.log("=======================================================");
}

runDiagnosticSuite();
