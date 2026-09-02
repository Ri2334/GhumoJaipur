// Jaipur Transit Validator & Outstation Mapper
// Ensures NO fake Metro station is displayed for outstation/non-metro locations!

export const PINK_LINE_STATIONS = [
  { id: "mansarovar", name: "Mansarovar" },
  { id: "new_aatish_market", name: "New Aatish Market" },
  { id: "vivek_vihar", name: "Vivek Vihar" },
  { id: "shyam_nagar", name: "Shyam Nagar" },
  { id: "ram_nagar", name: "Ram Nagar" },
  { id: "civil_lines", name: "Civil Lines" },
  { id: "railway_station", name: "Railway Station" },
  { id: "sindhi_camp", name: "Sindhi Camp" },
  { id: "chandpole", name: "Chandpole" },
  { id: "chhoti_chaupar", name: "Chhoti Chaupar" },
  { id: "badi_chaupar", name: "Badi Chaupar" }
];

// Mapping of inner city landmarks to nearest metro station
export const LANDMARK_METRO_MAP = {
  "hawa mahal": { station: "Badi Chaupar", walkTime: "2 min walk" },
  "city palace": { station: "Badi Chaupar", walkTime: "6 min walk" },
  "jantar mantar": { station: "Chhoti Chaupar", walkTime: "5 min walk" },
  "johari bazaar": { station: "Badi Chaupar", walkTime: "1 min walk" },
  "bapu bazaar": { station: "Badi Chaupar", walkTime: "8 min walk" },
  "tripolia bazaar": { station: "Chhoti Chaupar", walkTime: "4 min walk" },
  "isarlat sargasooli": { station: "Chhoti Chaupar", walkTime: "3 min walk" },
  "govind dev ji temple": { station: "Badi Chaupar", walkTime: "6 min walk" },
  "albert hall museum": { station: "Railway Station", walkTime: "10 min auto" },
  "masala chowk": { station: "Railway Station", walkTime: "10 min auto" },
  "central park jaipur": { station: "SMS Hospital", walkTime: "10 min walk" },
  "tapri central": { station: "SMS Hospital", walkTime: "10 min walk" },
  "birla mandir": { station: "SMS Hospital", walkTime: "12 min walk" },
  "rawat misthan bhandar": { station: "Railway Station", walkTime: "3 min walk" }
};

// Outstation / Non-Metro places requiring Bus / Train / Outstation Cab instead of Metro
export const OUTSTATION_TRANSIT_INFO = {
  "sambhar salt lake": {
    isOutstation: true,
    distanceKm: 80,
    nearestRailway: "Sambhar Lake Railway Station (SBR) - 2.7 km",
    busTerminal: "Sindhi Camp Bus Stand (Nagaur/Kuchaman Express Bus)",
    routeNotes: "Take RSRTC bus from Sindhi Camp to Sambhar Town, then local auto."
  },
  "pushkar holy town": {
    isOutstation: true,
    distanceKm: 145,
    nearestRailway: "Ajmer Junction (AII) - 14 km",
    busTerminal: "Sindhi Camp Bus Stand (Ajmer Volvo Express)",
    routeNotes: "Take Volvo bus to Ajmer/Pushkar or Express Train from Jaipur Junction."
  },
  "ranthambore tiger reserve": {
    isOutstation: true,
    distanceKm: 160,
    nearestRailway: "Sawai Madhopur Junction (SWM) - 12 km",
    busTerminal: "Sindhi Camp Bus Stand",
    routeNotes: "Take Jan Shatabdi Express train from Jaipur to Sawai Madhopur."
  },
  "bhangarh fort": {
    isOutstation: true,
    distanceKm: 85,
    nearestRailway: "Dausa Railway Station (DO) - 28 km",
    busTerminal: "Sindhi Camp / Dausa Highway Bus",
    routeNotes: "Hire private outstation cab via Jaipur-Agra Highway."
  },
  "abhaneri stepwell chand baori": {
    isOutstation: true,
    distanceKm: 95,
    nearestRailway: "Bandikui Junction (BKI) - 8 km",
    busTerminal: "Sikandra Highway Stop",
    routeNotes: "Take outstation cab via Jaipur-Agra Expressway."
  },
  "sariska tiger reserve": {
    isOutstation: true,
    distanceKm: 120,
    nearestRailway: "Alwar Junction (AWR) - 36 km",
    busTerminal: "Sindhi Camp Alwar Bus",
    routeNotes: "Hire outstation taxi or Alwar bus."
  },
  "neemrana fort palace": {
    isOutstation: true,
    distanceKm: 150,
    nearestRailway: "Rewari Junction - 38 km",
    busTerminal: "Jaipur-Delhi Highway Bus",
    routeNotes: "Outstation cab along NH 48."
  }
};

export function getNearestMetroStation(locationName) {
  if (!locationName) return null;
  const nameLower = locationName.toLowerCase().trim();

  // Check if it's directly a Pink Line Metro Station
  const directStation = PINK_LINE_STATIONS.find(
    (s) => nameLower.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(nameLower)
  );
  if (directStation) return { name: directStation.name, walkTime: "Direct Station" };

  // Check landmark map
  if (LANDMARK_METRO_MAP[nameLower]) {
    const item = LANDMARK_METRO_MAP[nameLower];
    return { name: item.name || item.station, walkTime: item.walkTime };
  }

  // Check if outstation
  for (const key in OUTSTATION_TRANSIT_INFO) {
    if (nameLower.includes(key) || key.includes(nameLower)) {
      return null; // NO METRO
    }
  }

  // Generic fallback if location is within Jaipur city
  return { name: "Railway Station", walkTime: "10 min auto" };
}
