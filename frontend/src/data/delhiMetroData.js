import rawMetroPayload from "./raw_delhi_metro.json";

// Group stations into lines dynamically from raw_delhi_metro.json
const lineGroups = {};

rawMetroPayload.forEach(st => {
  if (!lineGroups[st.line_color]) {
    lineGroups[st.line_color] = {
      id: `${st.line_color.toLowerCase().replace(/[^a-z0-9]/g, '_')}_line`,
      name: `${st.line_color} Line`,
      color: getLineColorHex(st.line_color),
      firstTrain: st.line_color.includes("Airport") ? "04:45 AM" : "05:30 AM",
      lastTrain: "11:30 PM",
      averageWaitTime: st.line_color.includes("Airport") ? 10 : 3,
      terminals: st.terminal_mappings,
      stations: []
    };
  }
  lineGroups[st.line_color].stations.push({
    id: st.station_id,
    name: st.station_name,
    interchange: st.is_interchange,
    lines: st.interchange_lines,
    sequence: st.sequence_index
  });
});

export const DELHI_METRO_LINES = Object.values(lineGroups);
export const RAW_DELHI_METRO_STATIONS = rawMetroPayload;

function getLineColorHex(lineColor) {
  const low = lineColor.toLowerCase();
  if (low.includes("red")) return "#ef4444";
  if (low.includes("yellow")) return "#eab308";
  if (low.includes("blue")) return "#2563eb";
  if (low.includes("green")) return "#22c55e";
  if (low.includes("violet")) return "#7c3aed";
  if (low.includes("pink")) return "#ec4899";
  if (low.includes("magenta")) return "#be185d";
  if (low.includes("grey")) return "#6b7280";
  if (low.includes("orange") || low.includes("airport")) return "#f97316";
  if (low.includes("aqua")) return "#06b6d4";
  return "#3b82f6";
}

export function getNearestDelhiMetroStation(locationName) {
  if (!locationName) return null;
  const nameLower = locationName.toLowerCase().trim();

  // Look up direct station match from database
  const directMatch = rawMetroPayload.find(s => 
    s.station_name.toLowerCase().includes(nameLower) || nameLower.includes(s.station_name.toLowerCase())
  );

  if (directMatch) {
    return { name: directMatch.station_name, line: `${directMatch.line_color} Line` };
  }

  // Key landmarks mapping
  if (nameLower.includes("iit")) return { name: "IIT Delhi", line: "Magenta Line" };
  if (nameLower.includes("aiims")) return { name: "AIIMS", line: "Yellow Line" };
  if (nameLower.includes("jnu")) return { name: "Munirka", line: "Magenta Line" };
  if (nameLower.includes("red fort") || nameLower.includes("lal qila")) return { name: "Lal Qila", line: "Violet Line" };
  if (nameLower.includes("qutub")) return { name: "Qutub Minar", line: "Yellow Line" };
  if (nameLower.includes("india gate") || nameLower.includes("kartavya")) return { name: "Central Secretariat", line: "Yellow Line" };
  if (nameLower.includes("lotus")) return { name: "Kalkaji Mandir", line: "Violet Line" };
  if (nameLower.includes("akshardham")) return { name: "Akshardham", line: "Blue Line" };
  if (nameLower.includes("connaught") || nameLower.includes("rajiv") || nameLower.includes("cp")) return { name: "Rajiv Chowk", line: "Yellow Line" };
  if (nameLower.includes("chandni") || nameLower.includes("jama")) return { name: "Chandni Chowk", line: "Yellow Line" };
  if (nameLower.includes("airport") || nameLower.includes("igi")) return { name: "IGI Airport T3 Terminal", line: "Orange Line" };
  if (nameLower.includes("railway") || nameLower.includes("ndls")) return { name: "New Delhi", line: "Yellow Line" };
  if (nameLower.includes("hauz khas")) return { name: "Hauz Khas", line: "Yellow Line" };

  return { name: "Rajiv Chowk", line: "Yellow Line" };
}
