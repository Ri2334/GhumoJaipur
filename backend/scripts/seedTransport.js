import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import MetroStation from "../models/MetroStation.js";
import TouristLocation from "../models/TouristLocation.js";
import MetroRoute from "../models/MetroRoute.js";

dotenv.config();

const stations = [
  { name: "Railway Station", line: "Pink Line", area: "Station Road", sequence: 1, latitude: 26.918, longitude: 75.789, nearbyPlaces: [] },
  { name: "Sindhi Camp", line: "Pink Line", area: "Bus Stand", sequence: 2, latitude: 26.920, longitude: 75.796, nearbyPlaces: [] },
  { name: "Civil Lines", line: "Pink Line", area: "Civil Lines", sequence: 3, latitude: 26.916, longitude: 75.799, nearbyPlaces: [] },
  { name: "Ram Nagar", line: "Pink Line", area: "Ram Nagar", sequence: 4, latitude: 26.913, longitude: 75.806, nearbyPlaces: [] },
  { name: "Chandpole", line: "Pink Line", area: "Chandpole", sequence: 5, latitude: 26.924, longitude: 75.816, nearbyPlaces: [] },
  { name: "Badi Chopar", line: "Pink Line", area: "Old City", sequence: 6, latitude: 26.923, longitude: 75.823, nearbyPlaces: [] },
];

const touristLocations = [
  { name: "Jaipur Railway Station", description: "Main arrival point for visitors to Jaipur.", area: "Station Road", latitude: 26.918, longitude: 75.789, nearestStation: "Railway Station", category: "Transit" },
  { name: "Badi Chopar", description: "Old city access point near iconic heritage spots.", area: "Old City", latitude: 26.923, longitude: 75.823, nearestStation: "Badi Chopar", category: "Transit" },
  { name: "Hawa Mahal", description: "Heritage palace of winds in the heart of Jaipur.", area: "Old City", latitude: 26.9239, longitude: 75.8267, nearestStation: "Badi Chopar", category: "Heritage" },
  { name: "Amber Fort", description: "Historic fort in Amer.", area: "Amer", latitude: 26.9855, longitude: 75.8513, nearestStation: "Badi Chopar", category: "Heritage" },
  { name: "City Palace", description: "Royal palace complex.", area: "Tripolia Bazar", latitude: 26.9259, longitude: 75.8237, nearestStation: "Badi Chopar", category: "Heritage" },
];

const routes = [
  ["Railway Station", "Badi Chopar"],
  ["Railway Station", "Chandpole"],
  ["Sindhi Camp", "Badi Chopar"],
  ["Civil Lines", "Badi Chopar"],
  ["Ram Nagar", "Badi Chopar"],
];

const runSeed = async () => {
  await connectDB();

  for (const station of stations) {
    await MetroStation.findOneAndUpdate({ name: station.name }, station, { upsert: true, new: true, setDefaultsOnInsert: true });
  }

  for (const location of touristLocations) {
    await TouristLocation.findOneAndUpdate({ name: location.name }, location, { upsert: true, new: true, setDefaultsOnInsert: true });
  }

  for (const [sourceName, destinationName] of routes) {
    const sourceStation = await MetroStation.findOne({ name: sourceName });
    const destinationStation = await MetroStation.findOne({ name: destinationName });
    const sourceIndex = stations.findIndex((station) => station.name === sourceName);
    const destinationIndex = stations.findIndex((station) => station.name === destinationName);
    const sequenceStations = stations.slice(Math.min(sourceIndex, destinationIndex), Math.max(sourceIndex, destinationIndex) + 1);
    const sequence = await Promise.all(sequenceStations.map(async (station) => {
      const stationDoc = await MetroStation.findOne({ name: station.name });
      return stationDoc._id;
    }));

    const hops = Math.max(sequence.length - 1, 1);
    await MetroRoute.findOneAndUpdate(
      { sourceStation: sourceStation._id, destinationStation: destinationStation._id },
      {
        sourceStation: sourceStation._id,
        destinationStation: destinationStation._id,
        stationSequence: sequence,
        fare: Math.max(10, 10 + hops * 8),
        travelTimeMinutes: 8 + hops * 9,
        waitingTimeMinutes: 6,
        nextTrainMinutes: 4,
        lineName: "Pink Line",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log("Seeded Jaipur metro and transport data.");
  await mongoose.disconnect();
};

runSeed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
