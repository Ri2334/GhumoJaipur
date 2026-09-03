export const DELHI_METRO_LINES = [
  {
    id: "yellow_line",
    name: "Yellow Line",
    color: "#eab308",
    firstTrain: "05:30",
    lastTrain: "23:30",
    averageWaitTime: 4,
    stations: [
      { id: "samaypur_badli", name: "Samaypur Badli", interchange: false },
      { id: "vishwa_vidyalaya", name: "Vishwa Vidyalaya", interchange: false },
      { id: "kashmere_gate", name: "Kashmere Gate", interchange: true, lines: ["Yellow", "Red", "Violet"] },
      { id: "chandni_chowk", name: "Chandni Chowk", interchange: false },
      { id: "new_delhi", name: "New Delhi", interchange: true, lines: ["Yellow", "Airport Express"] },
      { id: "rajiv_chowk", name: "Rajiv Chowk (Connaught Place)", interchange: true, lines: ["Yellow", "Blue"] },
      { id: "central_secretariat", name: "Central Secretariat", interchange: true, lines: ["Yellow", "Violet"] },
      { id: "dilli_haat_ina", name: "Dilli Haat INA", interchange: true, lines: ["Yellow", "Pink"] },
      { id: "hauz_khas", name: "Hauz Khas", interchange: true, lines: ["Yellow", "Magenta"] },
      { id: "qutub_minar", name: "Qutub Minar", interchange: false },
      { id: "millennium_city_centre", name: "Millennium City Centre Gurugram", interchange: false }
    ]
  },
  {
    id: "blue_line",
    name: "Blue Line",
    color: "#2563eb",
    firstTrain: "05:30",
    lastTrain: "23:30",
    averageWaitTime: 4,
    stations: [
      { id: "dwarka_sec_21", name: "Dwarka Sector 21", interchange: true, lines: ["Blue", "Airport Express"] },
      { id: "janakpuri_west", name: "Janakpuri West", interchange: true, lines: ["Blue", "Magenta"] },
      { id: "karol_bagh", name: "Karol Bagh", interchange: false },
      { id: "rajiv_chowk", name: "Rajiv Chowk (Connaught Place)", interchange: true, lines: ["Blue", "Yellow"] },
      { id: "mandi_house", name: "Mandi House", interchange: true, lines: ["Blue", "Violet"] },
      { id: "supreme_court", name: "Supreme Court", interchange: false },
      { id: "akshardham", name: "Akshardham", interchange: false },
      { id: "botanical_garden", name: "Botanical Garden", interchange: true, lines: ["Blue", "Magenta"] }
    ]
  },
  {
    id: "airport_express",
    name: "Airport Express (Orange Line)",
    color: "#f97316",
    firstTrain: "04:45",
    lastTrain: "23:30",
    averageWaitTime: 10,
    stations: [
      { id: "new_delhi_ap", name: "New Delhi", interchange: true, lines: ["Airport Express", "Yellow"] },
      { id: "shivaji_stadium", name: "Shivaji Stadium", interchange: false },
      { id: "dhaula_kuan", name: "Dhaula Kuan", interchange: true, lines: ["Airport Express", "Pink"] },
      { id: "aerocity", name: "Delhi Aerocity", interchange: false },
      { id: "igi_airport", name: "IGI Airport T3", interchange: false },
      { id: "dwarka_sec_21_ap", name: "Dwarka Sector 21", interchange: true, lines: ["Airport Express", "Blue"] }
    ]
  },
  {
    id: "violet_line",
    name: "Violet Line",
    color: "#7c3aed",
    firstTrain: "05:30",
    lastTrain: "23:30",
    averageWaitTime: 5,
    stations: [
      { id: "kashmere_gate_v", name: "Kashmere Gate", interchange: true, lines: ["Violet", "Yellow", "Red"] },
      { id: "lal_qila", name: "Lal Qila", interchange: false },
      { id: "jama_masjid", name: "Jama Masjid", interchange: false },
      { id: "mandi_house_v", name: "Mandi House", interchange: true, lines: ["Violet", "Blue"] },
      { id: "central_sec_v", name: "Central Secretariat", interchange: true, lines: ["Violet", "Yellow"] },
      { id: "jln_stadium", name: "JLN Stadium", interchange: false },
      { id: "lajpat_nagar", name: "Lajpat Nagar", interchange: true, lines: ["Violet", "Pink"] },
      { id: "kalkaji_mandir", name: "Kalkaji Mandir", interchange: true, lines: ["Violet", "Magenta"] }
    ]
  }
];

export function getNearestDelhiMetroStation(locationName) {
  if (!locationName) return null;
  const nameLower = locationName.toLowerCase().trim();

  if (nameLower.includes("red fort") || nameLower.includes("lal qila")) return { name: "Lal Qila", line: "Violet Line" };
  if (nameLower.includes("qutub")) return { name: "Qutub Minar", line: "Yellow Line" };
  if (nameLower.includes("india gate") || nameLower.includes("kartavya")) return { name: "Central Secretariat", line: "Yellow Line" };
  if (nameLower.includes("lotus")) return { name: "Kalkaji Mandir", line: "Violet Line" };
  if (nameLower.includes("akshardham")) return { name: "Akshardham", line: "Blue Line" };
  if (nameLower.includes("connaught") || nameLower.includes("rajiv")) return { name: "Rajiv Chowk", line: "Yellow Line" };
  if (nameLower.includes("chandni") || nameLower.includes("jama")) return { name: "Chandni Chowk", line: "Yellow Line" };
  if (nameLower.includes("airport") || nameLower.includes("igi") || nameLower.includes("dabok")) return { name: "IGI Airport T3", line: "Airport Express" };
  if (nameLower.includes("railway") || nameLower.includes("ndls")) return { name: "New Delhi", line: "Yellow Line" };
  if (nameLower.includes("hauz khas")) return { name: "Hauz Khas", line: "Yellow Line" };
  if (nameLower.includes("dilli haat") || nameLower.includes("ina")) return { name: "Dilli Haat INA", line: "Yellow Line" };

  return { name: "Rajiv Chowk", line: "Yellow Line" };
}
