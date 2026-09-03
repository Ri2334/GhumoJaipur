export const DELHI_METRO_LINES = [
  {
    id: "red_line",
    name: "Red Line (Line 1)",
    color: "#ef4444",
    firstTrain: "05:30",
    lastTrain: "23:00",
    averageWaitTime: 4,
    stations: [
      { id: "rithala", name: "Rithala", interchange: false },
      { id: "rohini_west", name: "Rohini West", interchange: false },
      { id: "rohini_east", name: "Rohini East", interchange: false },
      { id: "pitampura", name: "Pitampura", interchange: false },
      { id: "kohat_enclave", name: "Kohat Enclave", interchange: false },
      { id: "netaji_subhash_place", name: "Netaji Subhash Place", interchange: true, lines: ["Red", "Pink"] },
      { id: "indurlok", name: "Inderlok", interchange: true, lines: ["Red", "Green"] },
      { id: "kashmere_gate_r", name: "Kashmere Gate", interchange: true, lines: ["Red", "Yellow", "Violet"] },
      { id: "shastri_park", name: "Shastri Park", interchange: false },
      { id: "welcome", name: "Welcome", interchange: true, lines: ["Red", "Pink"] },
      { id: "shaheed_sthal", name: "Shaheed Sthal (Ghaziabad)", interchange: false }
    ]
  },
  {
    id: "yellow_line",
    name: "Yellow Line (Line 2)",
    color: "#eab308",
    firstTrain: "05:30",
    lastTrain: "23:30",
    averageWaitTime: 3,
    stations: [
      { id: "samaypur_badli", name: "Samaypur Badli", interchange: false },
      { id: "jahangirpuri", name: "Jahangirpuri", interchange: false },
      { id: "azadpur", name: "Azadpur", interchange: true, lines: ["Yellow", "Pink"] },
      { id: "vishwa_vidyalaya", name: "Vishwa Vidyalaya (North Campus)", interchange: false },
      { id: "civil_lines_d", name: "Civil Lines Delhi", interchange: false },
      { id: "kashmere_gate", name: "Kashmere Gate", interchange: true, lines: ["Yellow", "Red", "Violet"] },
      { id: "chandni_chowk", name: "Chandni Chowk", interchange: false },
      { id: "chawri_bazar", name: "Chawri Bazar", interchange: false },
      { id: "new_delhi", name: "New Delhi Railway Station", interchange: true, lines: ["Yellow", "Airport Express"] },
      { id: "rajiv_chowk", name: "Rajiv Chowk (Connaught Place)", interchange: true, lines: ["Yellow", "Blue"] },
      { id: "patel_chowk", name: "Patel Chowk", interchange: false },
      { id: "central_secretariat", name: "Central Secretariat", interchange: true, lines: ["Yellow", "Violet"] },
      { id: "udyog_bhawan", name: "Udyog Bhawan", interchange: false },
      { id: "lok_kalyan_marg", name: "Lok Kalyan Marg", interchange: false },
      { id: "jor_bagh", name: "Jor Bagh", interchange: false },
      { id: "dilli_haat_ina", name: "Dilli Haat INA", interchange: true, lines: ["Yellow", "Pink"] },
      { id: "aiims", name: "AIIMS", interchange: false },
      { id: "green_park", name: "Green Park", interchange: false },
      { id: "hauz_khas", name: "Hauz Khas", interchange: true, lines: ["Yellow", "Magenta"] },
      { id: "malviya_nagar", name: "Malviya Nagar", interchange: false },
      { id: "saket", name: "Saket", interchange: false },
      { id: "qutub_minar", name: "Qutub Minar", interchange: false },
      { id: "chhatarpur", name: "Chhatarpur", interchange: false },
      { id: "millennium_city_centre", name: "Millennium City Centre Gurugram", interchange: false }
    ]
  },
  {
    id: "blue_line",
    name: "Blue Line (Line 3 & 4)",
    color: "#2563eb",
    firstTrain: "05:30",
    lastTrain: "23:30",
    averageWaitTime: 3,
    stations: [
      { id: "dwarka_sec_21", name: "Dwarka Sector 21", interchange: true, lines: ["Blue", "Airport Express"] },
      { id: "janakpuri_west", name: "Janakpuri West", interchange: true, lines: ["Blue", "Magenta"] },
      { id: "rajouri_garden", name: "Rajouri Garden", interchange: true, lines: ["Blue", "Pink"] },
      { id: "karol_bagh", name: "Karol Bagh", interchange: false },
      { id: "rk_ashram", name: "RK Ashram Marg", interchange: false },
      { id: "rajiv_chowk", name: "Rajiv Chowk (Connaught Place)", interchange: true, lines: ["Blue", "Yellow"] },
      { id: "mandi_house", name: "Mandi House", interchange: true, lines: ["Blue", "Violet"] },
      { id: "supreme_court", name: "Supreme Court (Pragati Maidan)", interchange: false },
      { id: "yamuna_bank", name: "Yamuna Bank", interchange: true, lines: ["Blue Main", "Blue Vaishali Branch"] },
      { id: "akshardham", name: "Akshardham", interchange: false },
      { id: "mayur_vihar_1", name: "Mayur Vihar Phase 1", interchange: true, lines: ["Blue", "Pink"] },
      { id: "botanical_garden", name: "Botanical Garden Noida", interchange: true, lines: ["Blue", "Magenta"] },
      { id: "noida_sec_62", name: "Noida Electronic City", interchange: false },
      { id: "vaishali", name: "Vaishali (Ghaziabad Branch)", interchange: false }
    ]
  },
  {
    id: "violet_line",
    name: "Violet Line (Line 6)",
    color: "#7c3aed",
    firstTrain: "05:30",
    lastTrain: "23:30",
    averageWaitTime: 4,
    stations: [
      { id: "kashmere_gate_v", name: "Kashmere Gate", interchange: true, lines: ["Violet", "Yellow", "Red"] },
      { id: "lal_qila", name: "Lal Qila", interchange: false },
      { id: "jama_masjid", name: "Jama Masjid", interchange: false },
      { id: "delhi_gate", name: "Delhi Gate", interchange: false },
      { id: "ito", name: "ITO", interchange: false },
      { id: "mandi_house_v", name: "Mandi House", interchange: true, lines: ["Violet", "Blue"] },
      { id: "janpath", name: "Janpath", interchange: false },
      { id: "central_sec_v", name: "Central Secretariat", interchange: true, lines: ["Violet", "Yellow"] },
      { id: "khan_market", name: "Khan Market", interchange: false },
      { id: "jln_stadium", name: "JLN Stadium", interchange: false },
      { id: "jangpura", name: "Jangpura", interchange: false },
      { id: "lajpat_nagar", name: "Lajpat Nagar", interchange: true, lines: ["Violet", "Pink"] },
      { id: "kalkaji_mandir", name: "Kalkaji Mandir", interchange: true, lines: ["Violet", "Magenta"] },
      { id: "badarpur_border", name: "Badarpur Border", interchange: false },
      { id: "raja_nahar_singh", name: "Raja Nahar Singh (Ballabhgarh)", interchange: false }
    ]
  },
  {
    id: "pink_line_delhi",
    name: "Pink Line (Ring Metro)",
    color: "#ec4899",
    firstTrain: "06:00",
    lastTrain: "23:00",
    averageWaitTime: 5,
    stations: [
      { id: "majlis_park", name: "Majlis Park", interchange: false },
      { id: "azadpur_p", name: "Azadpur", interchange: true, lines: ["Pink", "Yellow"] },
      { id: "netaji_subhash_p", name: "Netaji Subhash Place", interchange: true, lines: ["Pink", "Red"] },
      { id: "punjabi_bagh_w", name: "Punjabi Bagh West", interchange: true, lines: ["Pink", "Green"] },
      { id: "rajouri_garden_p", name: "Rajouri Garden", interchange: true, lines: ["Pink", "Blue"] },
      { id: "dhaula_kuan_p", name: "Durgabai Deshmukh South Campus", interchange: true, lines: ["Pink", "Airport Express"] },
      { id: "sarojini_nagar", name: "Sarojini Nagar", interchange: false },
      { id: "dilli_haat_ina_p", name: "Dilli Haat INA", interchange: true, lines: ["Pink", "Yellow"] },
      { id: "lajpat_nagar_p", name: "Lajpat Nagar", interchange: true, lines: ["Pink", "Violet"] },
      { id: "hazrat_nizamuddin", name: "Hazrat Nizamuddin Railway Station", interchange: false },
      { id: "mayur_vihar_p", name: "Mayur Vihar Phase 1", interchange: true, lines: ["Pink", "Blue"] },
      { id: "anand_vihar_isbt", name: "Anand Vihar ISBT", interchange: true, lines: ["Pink", "Blue"] },
      { id: "welcome_p", name: "Welcome", interchange: true, lines: ["Pink", "Red"] },
      { id: "shiv_vihar", name: "Shiv Vihar", interchange: false }
    ]
  },
  {
    id: "magenta_line",
    name: "Magenta Line (Line 8)",
    color: "#be185d",
    firstTrain: "05:30",
    lastTrain: "23:30",
    averageWaitTime: 4,
    stations: [
      { id: "janakpuri_w_m", name: "Janakpuri West", interchange: true, lines: ["Magenta", "Blue"] },
      { id: "munirka", name: "Munirka", interchange: false },
      { id: "iit_delhi", name: "IIT Delhi", interchange: false },
      { id: "hauz_khas_m", name: "Hauz Khas", interchange: true, lines: ["Magenta", "Yellow"] },
      { id: "panchsheel_park", name: "Panchsheel Park", interchange: false },
      { id: "kalkaji_mandir_m", name: "Kalkaji Mandir", interchange: true, lines: ["Magenta", "Violet"] },
      { id: "okhla_nsic", name: "Okhla NSIC", interchange: false },
      { id: "botanical_g_m", name: "Botanical Garden Noida", interchange: true, lines: ["Magenta", "Blue"] }
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
      { id: "new_delhi_ap", name: "New Delhi Railway Station", interchange: true, lines: ["Airport Express", "Yellow"] },
      { id: "shivaji_stadium", name: "Shivaji Stadium (CP)", interchange: false },
      { id: "dhaula_kuan", name: "Dhaula Kuan (South Campus)", interchange: true, lines: ["Airport Express", "Pink"] },
      { id: "aerocity", name: "Delhi Aerocity", interchange: false },
      { id: "igi_airport", name: "IGI Airport T3 Terminal", interchange: false },
      { id: "dwarka_sec_21_ap", name: "Dwarka Sector 21", interchange: true, lines: ["Airport Express", "Blue"] }
    ]
  }
];

export function getNearestDelhiMetroStation(locationName) {
  if (!locationName) return null;
  const nameLower = locationName.toLowerCase().trim();

  if (nameLower.includes("iit")) return { name: "IIT Delhi", line: "Magenta Line" };
  if (nameLower.includes("aiims")) return { name: "AIIMS", line: "Yellow Line" };
  if (nameLower.includes("jnu")) return { name: "Munirka", line: "Magenta Line" };
  if (nameLower.includes("red fort") || nameLower.includes("lal qila")) return { name: "Lal Qila", line: "Violet Line" };
  if (nameLower.includes("qutub")) return { name: "Qutub Minar", line: "Yellow Line" };
  if (nameLower.includes("india gate") || nameLower.includes("kartavya") || nameLower.includes("rajpath")) return { name: "Central Secretariat", line: "Yellow Line" };
  if (nameLower.includes("lotus")) return { name: "Kalkaji Mandir", line: "Violet Line" };
  if (nameLower.includes("akshardham")) return { name: "Akshardham", line: "Blue Line" };
  if (nameLower.includes("connaught") || nameLower.includes("rajiv") || nameLower.includes("cp")) return { name: "Rajiv Chowk (Connaught Place)", line: "Yellow Line" };
  if (nameLower.includes("chandni") || nameLower.includes("jama")) return { name: "Chandni Chowk", line: "Yellow Line" };
  if (nameLower.includes("airport") || nameLower.includes("igi") || nameLower.includes("aerocity")) return { name: "IGI Airport T3 Terminal", line: "Airport Express" };
  if (nameLower.includes("railway") || nameLower.includes("ndls")) return { name: "New Delhi Railway Station", line: "Yellow Line" };
  if (nameLower.includes("hauz khas")) return { name: "Hauz Khas", line: "Yellow Line" };
  if (nameLower.includes("dilli haat") || nameLower.includes("ina")) return { name: "Dilli Haat INA", line: "Yellow Line" };
  if (nameLower.includes("lajpat nagar")) return { name: "Lajpat Nagar", line: "Violet Line" };
  if (nameLower.includes("anand vihar")) return { name: "Anand Vihar ISBT", line: "Blue Line" };
  if (nameLower.includes("kashmere gate") || nameLower.includes("isbt")) return { name: "Kashmere Gate", line: "Yellow Line" };

  return { name: "Rajiv Chowk (Connaught Place)", line: "Yellow Line" };
}
