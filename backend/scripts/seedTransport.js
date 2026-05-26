import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import MetroStation from "../models/MetroStation.js";
import TouristLocation from "../models/TouristLocation.js";
import MetroRoute from "../models/MetroRoute.js";

dotenv.config();

const stations = [
  { name: "Mansarovar", line: "Pink Line", area: "Mansarovar", sequence: 1, latitude: 26.8756, longitude: 75.7533, nearbyPlaces: [] },
  { name: "New Aatish Market", line: "Pink Line", area: "Mansarovar", sequence: 2, latitude: 26.8834, longitude: 75.7589, nearbyPlaces: [] },
  { name: "Vivek Vihar", line: "Pink Line", area: "Sodala", sequence: 3, latitude: 26.8901, longitude: 75.7654, nearbyPlaces: [] },
  { name: "Shyam Nagar", line: "Pink Line", area: "Sodala", sequence: 4, latitude: 26.8978, longitude: 75.7721, nearbyPlaces: [] },
  { name: "Ram Nagar", line: "Pink Line", area: "Sodala", sequence: 5, latitude: 26.9045, longitude: 75.7798, nearbyPlaces: [] },
  { name: "Civil Lines", line: "Pink Line", area: "Civil Lines", sequence: 6, latitude: 26.9112, longitude: 75.7865, nearbyPlaces: [] },
  { name: "Railway Station", line: "Pink Line", area: "Station Road", sequence: 7, latitude: 26.9195, longitude: 75.7932, nearbyPlaces: [] },
  { name: "Sindhi Camp", line: "Pink Line", area: "Bus Stand", sequence: 8, latitude: 26.9248, longitude: 75.7999, nearbyPlaces: [] },
  { name: "Chandpole", line: "Pink Line", area: "Chandpole", sequence: 9, latitude: 26.9255, longitude: 75.8111, nearbyPlaces: [] },
  { name: "Chhoti Chaupar", line: "Pink Line", area: "Old City", sequence: 10, latitude: 26.9259, longitude: 75.8188, nearbyPlaces: [] },
  { name: "Badi Chaupar", line: "Pink Line", area: "Old City", sequence: 11, latitude: 26.9262, longitude: 75.8265, nearbyPlaces: [] },
];

const touristLocations = [
  // Core Transit Hubs
  { name: "Jaipur Railway Station", description: "Main arrival point for visitors.", area: "Station Road", latitude: 26.9195, longitude: 75.7932, nearestStation: "Railway Station", nearestBusStop: "Railway Station", category: "Transit" },
  { name: "Sindhi Camp Bus Stand", description: "Major inter-state bus terminal.", area: "Sindhi Camp", latitude: 26.9248, longitude: 75.7999, nearestStation: "Sindhi Camp", nearestBusStop: "Sindhi Camp", category: "Transit" },
  
  // Heritage & Landmarks
  { name: "Amber Fort", description: "Grand hilltop fort.", area: "Amer", latitude: 26.9855, longitude: 75.8513, nearestStation: "Badi Chaupar", nearestBusStop: "Amer", category: "Heritage" },
  { name: "Hawa Mahal", description: "Palace of Winds.", area: "Old City", latitude: 26.9239, longitude: 75.8267, nearestStation: "Badi Chaupar", nearestBusStop: "Badi Chopad", category: "Heritage" },
  { name: "City Palace", description: "Royal complex.", area: "Old City", latitude: 26.9259, longitude: 75.8237, nearestStation: "Badi Chaupar", nearestBusStop: "Choti Chopar", category: "Heritage" },
  { name: "Jantar Mantar", description: "Historic observatory.", area: "Old City", latitude: 26.9248, longitude: 75.8245, nearestStation: "Badi Chaupar", nearestBusStop: "Badi Chopad", category: "Heritage" },
  { name: "Nahargarh Fort", description: "Sunset viewpoint.", area: "Aravalli Hills", latitude: 26.9371, longitude: 75.8066, nearestStation: "Chandpole", nearestBusStop: "Amer", category: "Heritage" },
  { name: "Jaigarh Fort", description: "Fort with world's largest cannon.", area: "Amer", latitude: 26.9850, longitude: 75.8450, nearestStation: "Badi Chaupar", nearestBusStop: "Amer", category: "Heritage" },
  { name: "Albert Hall Museum", description: "State museum of Rajasthan.", area: "Ram Niwas Garden", latitude: 26.9116, longitude: 75.8195, nearestStation: "Chhoti Chaupar", nearestBusStop: "Ajmeri Gate", category: "Museum" },
  { name: "Jal Mahal", description: "Water palace in Man Sagar Lake.", area: "Amer Road", latitude: 26.9535, longitude: 75.8462, nearestStation: "Badi Chaupar", nearestBusStop: "Jal Mahal", category: "Heritage" },
  { name: "Birla Mandir", description: "White marble temple.", area: "Tilak Nagar", latitude: 26.8922, longitude: 75.8156, nearestStation: "Civil Lines", nearestBusStop: "Rambhag", category: "Spiritual" },
  { name: "Galtaji Temple", description: "Monkey temple.", area: "Galta Ji", latitude: 26.9168, longitude: 75.8587, nearestStation: "Badi Chaupar", nearestBusStop: "Transport Nagar", category: "Spiritual" },
  { name: "Govind Dev Ji Temple", description: "Spiritual heart of Jaipur.", area: "City Palace", latitude: 26.9270, longitude: 75.8230, nearestStation: "Badi Chaupar", nearestBusStop: "Badi Chopad", category: "Spiritual" },
  { name: "Patrika Gate", description: "Iconic photo spot.", area: "Jawahar Circle", latitude: 26.8488, longitude: 75.8000, nearestStation: "New Aatish Market", nearestBusStop: "Jawahar Circle", category: "Landmark" },
  { name: "Isarlat Sargasuli", description: "Victory tower.", area: "Old City", latitude: 26.9240, longitude: 75.8220, nearestStation: "Chhoti Chaupar", nearestBusStop: "Choti Chopar", category: "Heritage" },
  
  // Markets
  { name: "Johari Bazaar", description: "Jewelry market.", area: "Old City", latitude: 26.9205, longitude: 75.8267, nearestStation: "Badi Chaupar", nearestBusStop: "Badi Chopad", category: "Market" },
  { name: "Bapu Bazaar", description: "Textile and footwear market.", area: "Old City", latitude: 26.9189, longitude: 75.8208, nearestStation: "Chhoti Chaupar", nearestBusStop: "Ajmeri Gate", category: "Market" },
  { name: "Tripolia Bazaar", description: "Lac bangles and brassware.", area: "Old City", latitude: 26.9245, longitude: 75.8220, nearestStation: "Chhoti Chaupar", nearestBusStop: "Choti Chopar", category: "Market" },
  
  // Experiences & Parks
  { name: "Chokhi Dhani", description: "Ethnic village resort.", area: "Tonk Road", latitude: 26.7667, longitude: 75.8427, nearestStation: "New Aatish Market", nearestBusStop: "Sitapura", category: "Experience" },
  { name: "Jhalana Leopard Safari", description: "Wildlife safari in city.", area: "Malviya Nagar", latitude: 26.8778, longitude: 75.8222, nearestStation: "New Aatish Market", nearestBusStop: "Malviya Nagar", category: "Experience" },
  { name: "Kanak Vrindavan Garden", description: "Foothill garden.", area: "Amer Road", latitude: 26.9530, longitude: 75.8480, nearestStation: "Badi Chaupar", nearestBusStop: "Jal Mahal", category: "Nature" },
  { name: "Sisodia Rani Garden", description: "Royal garden.", area: "Agra Road", latitude: 26.9117, longitude: 75.8643, nearestStation: "Badi Chaupar", nearestBusStop: "Transport Nagar", category: "Nature" },
  { name: "Rambagh Palace", description: "Luxury heritage palace.", area: "Bhawani Singh Rd", latitude: 26.8981, longitude: 75.8063, nearestStation: "Civil Lines", nearestBusStop: "Rambhag", category: "Heritage" },
  { name: "Jawahar Kala Kendra", description: "Arts and cultural center.", area: "JLN Marg", latitude: 26.8917, longitude: 75.8083, nearestStation: "Civil Lines", nearestBusStop: "JLN Marg", category: "Cultural" },
];

const runSeed = async () => {
  await connectDB();

  console.log("Cleaning old transport data...");
  await MetroStation.deleteMany({});
  await TouristLocation.deleteMany({});
  await MetroRoute.deleteMany({});

  console.log("Seeding stations...");
  for (const station of stations) {
    await MetroStation.create(station);
  }

  console.log("Seeding locations...");
  for (const location of touristLocations) {
    await TouristLocation.create(location);
  }

  console.log("Generating all-pairs metro routes...");
  const allStations = await MetroStation.find().sort({ sequence: 1 });
  
  for (let i = 0; i < allStations.length; i++) {
    for (let j = 0; j < allStations.length; j++) {
      if (i === j) continue;
      
      const source = allStations[i];
      const dest = allStations[j];
      
      const sequence = i < j 
        ? allStations.slice(i, j + 1).map(s => s._id)
        : allStations.slice(j, i + 1).reverse().map(s => s._id);
        
      const hops = Math.abs(i - j);
      
      await MetroRoute.create({
        sourceStation: source._id,
        destinationStation: dest._id,
        stationSequence: sequence,
        fare: hops <= 2 ? 10 : hops <= 5 ? 15 : 20,
        travelTimeMinutes: hops * 3,
        waitingTimeMinutes: 5,
        nextTrainMinutes: 5,
        lineName: "Pink Line",
      });
    }
  }

  console.log("Seeded Jaipur metro and tourist location data.");
  await mongoose.disconnect();
};

runSeed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
