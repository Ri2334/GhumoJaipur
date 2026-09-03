
const { resolveDelhiRealRoute } = require("./src/data/delhiTransitResolver.js");

const testPairs = [
  ["IIT Delhi", "AIIMS"],
  ["Connaught Place", "Red Fort"],
  ["Anand Vihar ISBT", "IGI Airport T3"],
  ["Qutub Minar", "Akshardham Temple"],
  ["Hauz Khas Village", "Karol Bagh"],
  ["Sarojini Nagar Market", "Lotus Temple"]
];

console.log("=== MULTIMODAL LAST-MILE ROUTING GRAPH AUDIT ===");

testPairs.forEach(([orig, dest]) => {
  const route = resolveDelhiRealRoute(orig, dest);
  console.log(`
--------------------------------------------------`);
  console.log(`QUERY: ${orig} ➔ ${dest}`);
  console.log(`MODE: ${route.mode}`);
  console.log(`SUMMARY: ${route.summary}`);
  console.log(`CHRONOLOGICAL TIMELINE STEPS (${route.steps.length}):`);
  route.steps.forEach((st, idx) => {
    console.log(`  ${idx + 1}. [${st.type.toUpperCase()}] ${st.title} (${st.duration} | ${st.cost})`);
  });
});
