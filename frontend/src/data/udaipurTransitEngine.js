import { UDAIPUR_PLACES } from "./udaipurPlacesData";

export const UDAIPUR_ELECTRIC_BUS_ROUTES = [
  {
    id: "route-ub-1",
    routeName: "Route UB-1: Railway Station to Fatehsagar Promenade",
    busNumber: "UB-1 (Electric Green)",
    frequency: "Every 12 mins",
    operatingHours: "6:00 AM - 9:30 PM",
    fare: "₹10 - ₹25",
    stops: [
      "Udaipur City Railway Station",
      "Surajpole",
      "Delhi Gate",
      "Cheetak Circle",
      "Panchwati",
      "Saheliyon Ki Bari",
      "Fatehsagar Bombay Chowk"
    ]
  },
  {
    id: "route-ub-2",
    routeName: "Route UB-2: Udiapole ISBT to Sajjangarh Hill Gate",
    busNumber: "UB-2 (Electric City)",
    frequency: "Every 15 mins",
    operatingHours: "6:30 AM - 8:30 PM",
    fare: "₹15 - ₹30",
    stops: [
      "Udiapole Bus Stand",
      "Surajpole",
      "Delhi Gate",
      "Mullatalai",
      "Sajjangarh Base Gate"
    ]
  },
  {
    id: "route-ub-3",
    routeName: "Route UB-3: Railway Station to Sukhadia Circle & Bhuwana",
    busNumber: "UB-3 (City Express)",
    frequency: "Every 15 mins",
    operatingHours: "7:00 AM - 9:00 PM",
    fare: "₹10 - ₹20",
    stops: [
      "Udaipur City Railway Station",
      "Hiran Magri",
      "Court Circle",
      "Sukhadia Circle",
      "Bhuwana Bypass"
    ]
  }
];

export const calculateUdaipurRoute = (originName, destName) => {
  if (!originName || !destName) return null;

  const originPlace = UDAIPUR_PLACES.find(
    (p) => p.name.toLowerCase() === originName.toLowerCase() || p.id === originName
  );
  const destPlace = UDAIPUR_PLACES.find(
    (p) => p.name.toLowerCase() === destName.toLowerCase() || p.id === destName
  );

  // Check if destination is Jag Mandir Island (Requires Boat Ferry)
  const isJagMandir = destName.toLowerCase().includes("jag mandir") || originName.toLowerCase().includes("jag mandir");
  const isFatehsagarNehru = destName.toLowerCase().includes("nehru park") || originName.toLowerCase().includes("nehru park");
  const isRopeway = destName.toLowerCase().includes("ropeway") || destName.toLowerCase().includes("karni mata");

  if (isJagMandir) {
    return {
      mode: "Boat Ferry + Auto",
      summary: "City Auto to Rameshwar Ghat + Pichola Boat Ferry to Jag Mandir",
      totalDuration: "25 min",
      totalCost: "₹550 - ₹850",
      steps: [
        { type: "auto", title: "E-Rickshaw / Auto to City Palace Jetty", duration: "12 min", cost: "₹50 - ₹100" },
        { type: "boat", title: "Lake Pichola Official Boat Ferry to Jag Mandir Island", duration: "10 min", cost: "₹500 (Day) / ₹800 (Sunset)" }
      ]
    };
  }

  if (isRopeway) {
    return {
      mode: "Ropeway Cable Car",
      summary: "Auto to Doodh Talai + Mansapurna Karni Mata Ropeway to Hilltop",
      totalDuration: "18 min",
      totalCost: "₹170 - ₹220",
      steps: [
        { type: "auto", title: "E-Rickshaw to Doodh Talai Base Station", duration: "10 min", cost: "₹50 - ₹80" },
        { type: "ropeway", title: "Karni Mata Cable Car Aerial Ride", duration: "4 min", cost: "₹120 (Round Trip)" }
      ]
    };
  }

  return {
    mode: "Multi-Modal (Electric Bus / E-Rickshaw)",
    summary: `Direct electric city transit from ${originName} to ${destName}`,
    totalDuration: "20 min",
    totalCost: "₹20 - ₹90",
    steps: [
      { type: "bus", title: "Electric City Bus UB-1 / UB-2", duration: "14 min", cost: "₹15" },
      { type: "walk", title: "Short Walk to Destination Gate", duration: "4 min", cost: "Free" }
    ]
  };
};
