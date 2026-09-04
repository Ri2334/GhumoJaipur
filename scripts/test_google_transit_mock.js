import { normalizeGoogleTransitResponse } from "../backend/services/googleTransitService.js";

// Mock Google Directions API Response for Connaught Place -> Qutub Minar (Route 505)
const mockGoogleDirectionsResponse = {
  status: "OK",
  source: "DIRECTIONS_API",
  data: {
    routes: [
      {
        summary: "Route 505",
        fare: { text: "₹25", value: 25, currency: "INR" },
        legs: [
          {
            duration: { text: "45 mins", value: 2700 },
            distance: { text: "14.2 km", value: 14200 },
            steps: [
              {
                travel_mode: "WALKING",
                distance: { text: "350 m", value: 350 },
                duration: { text: "4 mins", value: 240 },
                html_instructions: "Walk 350m to Super Bazar Bus Stop",
                start_location: { lat: 28.6315, lng: 77.2167 },
                end_location: { lat: 28.6302, lng: 77.2198 }
              },
              {
                travel_mode: "TRANSIT",
                duration: { text: "38 mins", value: 2280 },
                distance: { text: "13.5 km", value: 13500 },
                transit_details: {
                  line: {
                    short_name: "505",
                    name: "Mori Gate Terminal to Mehrauli",
                    agencies: [{ name: "Delhi Transport Corporation (DTC)" }],
                    vehicle: { type: "BUS" },
                    color: "#1A73E8"
                  },
                  departure_stop: { name: "Super Bazar", location: { lat: 28.6302, lng: 77.2198 } },
                  arrival_stop: { name: "Qutub Minar", location: { lat: 28.5251, lng: 77.1861 } },
                  departure_time: { text: "5:30 PM", value: 1788523800 },
                  arrival_time: { text: "6:08 PM", value: 1788526080 },
                  num_stops: 18,
                  intermediate_stops: [
                    { name: "Connaught Place", location: { lat: 28.6311, lng: 77.2185 } },
                    { name: "Janpath", location: { lat: 28.6250, lng: 77.2180 } },
                    { name: "IIT Gate", location: { lat: 28.5460, lng: 77.1910 } },
                    { name: "Adchini", location: { lat: 28.5350, lng: 77.1900 } }
                  ]
                }
              },
              {
                travel_mode: "WALKING",
                distance: { text: "350 m", value: 350 },
                duration: { text: "4 mins", value: 240 },
                html_instructions: "Walk 350m to Qutub Minar",
                start_location: { lat: 28.5251, lng: 77.1861 },
                end_location: { lat: 28.5245, lng: 77.1855 }
              }
            ]
          }
        ]
      }
    ]
  }
};

function runMockNormalizationTest() {
  console.log("\n=======================================================");
  console.log("RUNNING MOCK GOOGLE ROUTE NORMALIZATION ASSERTION TEST");
  console.log("=======================================================");

  const originResolved = {
    placeId: "ChIJ1111",
    name: "Connaught Place",
    formattedAddress: "Connaught Place, New Delhi, Delhi",
    latitude: 28.6315,
    longitude: 77.2167
  };

  const destResolved = {
    placeId: "ChIJ2222",
    name: "Qutub Minar",
    formattedAddress: "Qutub Minar, Mehrauli, New Delhi, Delhi",
    latitude: 28.5245,
    longitude: 77.1855
  };

  const canonical = normalizeGoogleTransitResponse(mockGoogleDirectionsResponse, originResolved, destResolved);

  console.log("Normalized Canonical Response Status:", canonical.status);
  console.log("Total Routes Parsed:", canonical.routes.length);
  
  if (canonical.status !== "FOUND" || canonical.routes.length !== 1) {
    console.error("❌ FAILED: Normalization status should be FOUND.");
    process.exit(1);
  }

  const primary = canonical.routes[0];
  console.log("Summary:", primary.summary);
  console.log("Total Duration (min):", primary.totalDurationMinutes);
  console.log("Transfers:", primary.transfers);
  console.log("Fare:", primary.fare.text);
  console.log("Legs Count:", primary.legs.length);

  // Assert legs order
  console.log("\n--- Asserting Exact Itinerary Sequence ---");
  const leg0 = primary.legs[0];
  console.log("Leg 0 (First-Mile):", leg0.type, `Distance: ${leg0.distanceMeters}m`, `First-Mile Rec: ${leg0.firstMileRecommendation}`);
  if (leg0.type !== "WALK" || leg0.firstMileRecommendation !== "WALK") {
    console.error("❌ FAILED: Leg 0 should be WALK with firstMileRecommendation WALK");
    process.exit(1);
  }

  const leg1 = primary.legs[1];
  console.log("Leg 1 (Transit):", leg1.type, `Line: ${leg1.line.shortName}`, `Boarding: ${leg1.departureStop.name}`, `Alighting: ${leg1.arrivalStop.name}`, `Intermediate Stops: ${leg1.intermediateStops.length}`);
  if (leg1.type !== "TRANSIT" || leg1.line.shortName !== "505" || leg1.departureStop.name !== "Super Bazar" || leg1.arrivalStop.name !== "Qutub Minar") {
    console.error("❌ FAILED: Leg 1 details do not match Google's returned transit leg");
    process.exit(1);
  }

  const leg2 = primary.legs[2];
  console.log("Leg 2 (Last-Mile):", leg2.type, `Distance: ${leg2.distanceMeters}m`, `Last-Mile Rec: ${leg2.lastMileRecommendation}`);
  if (leg2.type !== "WALK" || leg2.lastMileRecommendation !== "WALK") {
    console.error("❌ FAILED: Leg 2 should be WALK with lastMileRecommendation WALK");
    process.exit(1);
  }

  console.log("\n✅ ALL CANONICAL SCHEMAS & LEG ORDER ASSERTIONS PASSED PERFECTLY!");
}

runMockNormalizationTest();
