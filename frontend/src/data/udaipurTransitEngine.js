import { UDAIPUR_PLACES } from "./udaipurPlacesData";

export const UCTSL_BUS_ROUTES = [
  {
    id: "uctsl-route-1",
    routeNumber: "Route 1",
    routeName: "Badgaon ⇄ Titardi Corridor",
    busesAssigned: 4,
    operatingHours: "6:10 AM - 8:40 PM",
    headway: "Every 15 mins (Peak Hours)",
    fare: "₹10 - ₹25",
    type: "Urban Corridor",
    stops: [
      "Badgaon Terminus",
      "Syphon Choraha",
      "Fatehpura",
      "Sukhadia Circle",
      "Chetak Circle",
      "Hathipole",
      "Delhi Gate",
      "Surajpole",
      "Sewashram",
      "Hiran Magri",
      "Titardi Terminus"
    ]
  },
  {
    id: "uctsl-route-2",
    routeNumber: "Route 2",
    routeName: "Rampura ⇄ Dabok Airport Road Corridor",
    busesAssigned: 8,
    operatingHours: "6:30 AM - 8:40 PM",
    headway: "Every 15 - 20 mins",
    fare: "₹10 - ₹30",
    type: "Airport & Suburban",
    stops: [
      "Rampura Terminus",
      "Malla Talai",
      "Chetak Circle",
      "Delhi Gate",
      "Surajpole",
      "Pratap Nagar",
      "Dabok Airport Road"
    ]
  },
  {
    id: "uctsl-route-3",
    routeNumber: "Route 3",
    routeName: "Balicha ⇄ Badgaon Line",
    busesAssigned: 3,
    operatingHours: "6:30 AM - 8:30 PM",
    headway: "Every 20 - 25 mins",
    fare: "₹10 - ₹25",
    type: "North-South Express",
    stops: [
      "Balicha Bypass Terminal",
      "Goverdhan Vilas",
      "Reti Stand",
      "Patel Circle",
      "Udaipur City Railway Station",
      "Udiapol Central Bus Stand",
      "Surajpole",
      "Delhi Gate",
      "Hathipole",
      "Chetak Circle",
      "Fatehpura",
      "Syphon Choraha",
      "Badgaon"
    ]
  },
  {
    id: "uctsl-route-4",
    routeNumber: "Route 4",
    routeName: "Balicha ⇄ Amberi Outer Corridor",
    busesAssigned: 5,
    operatingHours: "6:15 AM - 8:45 PM",
    headway: "Every 20 mins",
    fare: "₹15 - ₹35",
    type: "Industrial & Transit",
    stops: [
      "Balicha South Base",
      "Goverdhan Vilas",
      "Paras Cinema",
      "Udiapol Terminal",
      "City Station Road",
      "Sewashram",
      "Pratapnagar Square",
      "Sukher Industrial Belt",
      "Amberi North Base"
    ]
  },
  {
    id: "uctsl-route-5",
    routeNumber: "Route 5",
    routeName: "City Station ⇄ Rampura Tourist Loop",
    busesAssigned: 2,
    operatingHours: "6:30 AM - 8:30 PM",
    headway: "Every 30 mins",
    fare: "₹10 - ₹20",
    type: "Heritage & Lake Special",
    stops: [
      "Udaipur City Railway Station",
      "Udiayapole Central Bus Stand",
      "Surajpole",
      "Delhi Gate",
      "Hathipole",
      "Chetak Circle",
      "Shiksha Bhawan",
      "Fatehsagar Lake Entry Point",
      "Radaji Chouraha",
      "Mahakaleshwar Chowk",
      "Malla Talai Chouraha",
      "Sajjangarh Biological Park Base / Rampura"
    ]
  },
  {
    id: "uctsl-airport-shuttle",
    routeNumber: "Airport Express",
    routeName: "Chetak Pahada ⇄ Maharana Pratap Airport Shuttle",
    busesAssigned: 2,
    operatingHours: "6:00 AM - 6:00 PM (Scheduled Timings)",
    headway: "Fixed Timed Dispatches",
    fare: "Flat ₹100",
    type: "Express Shuttle",
    stops: [
      "Chetak Pahada",
      "Delhi Gate",
      "Surajpol",
      "Thokar Chauraha",
      "Debari",
      "Maharana Pratap Dabok Airport Terminal"
    ]
  }
];

export const calculateUdaipurRoute = (originName, destName) => {
  if (!originName || !destName) {
    return {
      mode: "Multi-Modal",
      summary: "Udaipur Urban Transit",
      totalDuration: "15 min",
      totalCost: "₹20 - ₹80",
      steps: [
        { type: "auto", title: "Select Source & Destination above", duration: "0 min", cost: "₹0" }
      ]
    };
  }

  const origLow = originName.toLowerCase();
  const destLow = destName.toLowerCase();

  const isJagMandir = destLow.includes("jag mandir") || origLow.includes("jag mandir");
  const isFatehsagar = destLow.includes("fatehsagar") || origLow.includes("fatehsagar") || destLow.includes("nehru park") || origLow.includes("nehru park");
  const isSajjangarh = destLow.includes("sajjangarh") || origLow.includes("sajjangarh") || destLow.includes("monsoon") || origLow.includes("monsoon");
  const isRopeway = destLow.includes("ropeway") || destLow.includes("karni mata") || origLow.includes("ropeway") || origLow.includes("karni mata");
  const isAirport = destLow.includes("airport") || origLow.includes("airport") || destLow.includes("dabok") || origLow.includes("dabok");
  const isShilpgram = destLow.includes("shilpgram") || origLow.includes("shilpgram") || destLow.includes("bahubali") || origLow.includes("bahubali") || destLow.includes("badi lake");
  const isCityPalace = destLow.includes("palace") || origLow.includes("palace") || destLow.includes("jagdish") || origLow.includes("jagdish") || destLow.includes("bagore") || origLow.includes("bagore");

  if (isJagMandir) {
    return {
      mode: "Boat Ferry + E-Rickshaw",
      summary: `E-Rickshaw to Rameshwar Ghat + Pichola Boat Cruise to ${destName}`,
      totalDuration: "25 min",
      totalCost: "₹550 - ₹850",
      steps: [
        { type: "auto", title: `E-Rickshaw from ${originName} to Rameshwar Ghat (City Palace Jetty)`, duration: "12 min", cost: "₹50 - ₹100" },
        { type: "boat", title: `Lake Pichola Official Boat Ferry Cruise to ${destName}`, duration: "12 min", cost: "₹500 (Day) / ₹800 (Sunset)" }
      ]
    };
  }

  if (isFatehsagar) {
    return {
      mode: "UCTSL Bus + Motorboat Ferry",
      summary: `UCTSL Route 5 Tourist Loop + Fatehsagar Promenade Cruise`,
      totalDuration: "22 min",
      totalCost: "₹135",
      steps: [
        { type: "bus", title: `UCTSL Route 5 Tourist Loop Bus from ${originName} to Fatehsagar Promenade`, duration: "12 min", cost: "₹15" },
        { type: "boat", title: `Motorboat Ferry to Nehru Park Island / Promenade Jetty`, duration: "10 min", cost: "₹120" }
      ]
    };
  }

  if (isSajjangarh) {
    return {
      mode: "UCTSL Bus + Forest Jeep Shuttle",
      summary: `UCTSL Route 2/5 to Malla Talai + Forest Department Shuttle to Sajjangarh Monsoon Palace`,
      totalDuration: "30 min",
      totalCost: "₹135",
      steps: [
        { type: "bus", title: `UCTSL Route 2 / Route 5 Bus from ${originName} to Malla Talai Chouraha`, duration: "15 min", cost: "₹15" },
        { type: "auto", title: `Forest Dept Jeep / Electric Shuttle up Aravalli Hill to Sajjangarh Palace`, duration: "15 min", cost: "₹120" }
      ]
    };
  }

  if (isRopeway) {
    return {
      mode: "Ropeway Cable Car + Auto",
      summary: `Auto to Doodh Talai + Mansapurna Karni Mata Cable Car Aerial Ride`,
      totalDuration: "18 min",
      totalCost: "₹170 - ₹220",
      steps: [
        { type: "auto", title: `Auto / E-Rickshaw from ${originName} to Doodh Talai Ropeway Base`, duration: "10 min", cost: "₹50 - ₹80" },
        { type: "ropeway", title: "Mansapurna Karni Mata Cable Car Aerial Ride to Hilltop Viewpoint", duration: "4 min", cost: "₹120 (Round Trip)" }
      ]
    };
  }

  if (isAirport) {
    return {
      mode: "UCTSL Airport Express Shuttle",
      summary: `Direct Municipal AC Airport Express Shuttle connecting ${originName} and Dabok Airport`,
      totalDuration: "35 min",
      totalCost: "Flat ₹100",
      steps: [
        { type: "bus", title: `UCTSL AC Airport Express Shuttle (Chetak / Surajpol / Thokar stop)`, duration: "35 min", cost: "₹100 Flat Rate" }
      ]
    };
  }

  if (isShilpgram) {
    return {
      mode: "Electric Bus + Trek / Auto",
      summary: `UCTSL Route 3 to Badi Road + Auto to Shilpgram / Bahubali Hills`,
      totalDuration: "25 min",
      totalCost: "₹65",
      steps: [
        { type: "bus", title: `UCTSL Route 3 Electric Bus from ${originName} to Sukher / Badi Road`, duration: "15 min", cost: "₹15" },
        { type: "auto", title: `Auto / E-Rickshaw to Shilpgram Crafts Village / Bahubali Hills Base`, duration: "10 min", cost: "₹50" }
      ]
    };
  }

  if (isCityPalace) {
    return {
      mode: "UCTSL Route 5 Tourist Loop + Heritage Walk",
      summary: `UCTSL Route 5 Bus + Heritage Alley Walk to ${destName}`,
      totalDuration: "18 min",
      totalCost: "₹15",
      steps: [
        { type: "bus", title: `UCTSL Route 5 Tourist Loop Bus from ${originName} to Hathipole / Delhi Gate`, duration: "12 min", cost: "₹15" },
        { type: "walk", title: `Short Heritage Walk through Jagdish Chowk to ${destName} Gate`, duration: "6 min", cost: "Free" }
      ]
    };
  }

  return {
    mode: "UCTSL Electric Bus (Route 1 / 2 / 3 / 4)",
    summary: `UCTSL Electric Bus Corridor connecting ${originName} to ${destName}`,
    totalDuration: "20 min",
    totalCost: "₹15 - ₹40",
    steps: [
      { type: "bus", title: `UCTSL Route 1 (Badgaon-Titardi) / Route 2 (Rampura-Airport Rd) Electric Bus`, duration: "15 min", cost: "₹15" },
      { type: "walk", title: `Walk from UCTSL Bus Stop to ${destName}`, duration: "5 min", cost: "Free" }
    ]
  };
};
