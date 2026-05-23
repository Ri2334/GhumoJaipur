import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import BusRoute from '../models/BusRoute.js';
import TouristLocation from '../models/TouristLocation.js';

dotenv.config();

const busRoutes = [
  {
    routeNumber: "1",
    routeName: "Todi To Transport Nagar",
    stops: ["Todi", "Harmada", "Chomu Pulia", "Pittal Factory", "Chandpole", "GPO", "M.I. Road", "Sanganeri Gate", "Transport Nagar"],
    distanceKm: 21,
    frequencyMinutes: 11,
    numBuses: 12
  },
  {
    routeNumber: "1A",
    routeName: "VKI (Road No. 17) To Transport Nagar",
    stops: ["VKI (Road No. 17)", "Chomu Pulia", "Amba Badi", "Pani Pej", "Pittal Factory", "Chandpole", "GPO", "M.I. Road", "Sanganeri Gate", "Transport Nagar"],
    distanceKm: 21,
    frequencyMinutes: 11,
    numBuses: 12
  },
  {
    routeNumber: "2",
    routeName: "Bhakrota To Chandpole",
    stops: ["Bhakrota", "Heerapura", "DCM", "Sodala", "GPO", "Chandpole"],
    distanceKm: 14,
    frequencyMinutes: 10,
    numBuses: 10
  },
  {
    routeNumber: "3",
    routeName: "Dwarkapuri To Badi Chopad",
    stops: ["Dwarkapuri", "Sanganer Police Station", "Durgapura", "Tonk Phatak", "Rambhag", "Ajmeri Gate", "Badi Chopad"],
    distanceKm: 21,
    frequencyMinutes: 6,
    numBuses: 20
  },
  {
    routeNumber: "3A",
    routeName: "Sanganer To Choti Chopar",
    stops: ["Sanganer", "N.R.I Circle", "Sanganer Police Station", "Durgapura", "Tonk Phatak", "Rambhag", "Ajmeri Gate", "Choti Chopar"],
    distanceKm: 15,
    frequencyMinutes: 6,
    numBuses: 17
  },
  {
    routeNumber: "3B",
    routeName: "Pannadhay Circle To Kunda",
    stops: ["Pannadhay Circle", "Shyopur", "Sanganer Police Station", "Durgapura", "Tonk Phatak", "Rambhag", "Ajmeri Gate", "Sanganeri Gate", "Badi Chopad", "Ramgarh Mod", "Jal Mahal", "Amer", "Kunda"],
    distanceKm: 28,
    frequencyMinutes: 20,
    numBuses: 10
  },
  {
    routeNumber: "3C",
    routeName: "Mahatma Gandhi Hospital To Ajmeri Gate",
    stops: ["Mahatma Gandhi Hospital", "Genpect", "India Gate", "Sanganer Police Station", "Durgapura", "Tonk Phatak", "Rambhag", "Ajmeri Gate"],
    distanceKm: 20,
    frequencyMinutes: 10,
    numBuses: 12
  },
  {
    routeNumber: "6A",
    routeName: "Malviya Nagar To Kirni Fatak",
    stops: ["Malviya Nagar", "Malviya Nagar Sector 5", "Underpass Bridge", "Malviya Nagar Sector 1-3", "Saras Dairy", "JLN Marg", "Dainik Bhaskar", "Gandhi Nagar Station", "Tonk Phatak", "Rambhag", "SMS Hospital", "Ajmeri Gate", "M.I. Road", "Collectory Circle", "Chinkar Canteen", "Pani Pej", "Chomu Pulia", "Jhotwara", "Kirni Fatak"],
    distanceKm: 25,
    frequencyMinutes: 8,
    numBuses: 21
  },
  {
    routeNumber: "7",
    routeName: "Panchawala To Transport Nagar",
    stops: ["Panchawala", "Heerapura", "Gaj Singh Pura", "Kisan Dharm Kanta", "Gurjar Ki Thadi", "Triveni Nagar", "Gopalpura", "Rambhag", "Narayan Singh Circle", "Moti Dungri", "Govind Marg", "Mental Hospital", "Transport Nagar"],
    distanceKm: 20,
    frequencyMinutes: 7,
    numBuses: 18
  },
  {
    routeNumber: "7A",
    routeName: "Heerapura To Jawahar Nagar",
    stops: ["Heerapura", "Chitrakut Nagar", "Nursery Circle", "Vaishali Circle", "Khatipura Tiraha", "Hasanpura", "Railway Station", "GPO", "Panch Batti", "Ajmeri Gate", "Sanganeri Gate", "Ghatgate", "Govind Marg", "Mental Hospital", "Baraf Khana", "Mama Ki Hotal", "Jawahar Nagar"],
    distanceKm: 22,
    frequencyMinutes: 15,
    numBuses: 10
  },
  {
    routeNumber: "8",
    routeName: "Jagatpura To Jagatpura",
    stops: ["Jagatpura", "Apex Circle", "Jhalana", "Gandhi Nagar Mod", "Rambhag", "Ajmeri Gate", "M.I. Road", "GPO", "Sodala", "Kings Road", "Nirman Nagar", "Ganga Jamuna Petrol Pump", "Mansarovar", "Agarwal Farm", "Sanganer Police Station", "Sita Bari", "Aasarm Marg", "Jawahar Circle", "Vivek Vihar", "Jagatpura Rly Station"],
    distanceKm: 40,
    frequencyMinutes: 8,
    numBuses: 30
  },
  {
    routeNumber: "9",
    routeName: "Agrawal Farm To Agrawal Farm",
    stops: ["Agarwal Farm", "Gurjar Ki Thadi", "Gopalpura", "Tonk Phatak", "Imliwal Phatak", "Sahakar Bhawan Circle", "Railway Station", "Chandpole", "Chomu Pulia", "Jhotwara", "Khatipura", "Vaishali Nagar", "Purani Chungi", "Kings Road", "Nirman Nagar", "New Sanganer Road", "SFS"],
    distanceKm: 43,
    frequencyMinutes: 20,
    numBuses: 14
  },
  {
    routeNumber: "9A",
    routeName: "Agarwal Farm To Dadi Ka Fatak",
    stops: ["Agarwal Farm", "Vijay Path", "Sipra Path", "Maharani Farm", "Durgapura", "Tonk Phatak", "Rambhag", "Ajmeri Gate", "Sanganeri Gate", "Badi Chopad", "Chandpole", "Pittal Factory", "Shastri Nagar", "Vidyadhar Nagar", "Alka Cinema", "Road No. 1", "Murlipura", "Dadi Ka Fatak"],
    distanceKm: 28,
    frequencyMinutes: 7,
    numBuses: 29
  },
  {
    routeNumber: "9B",
    routeName: "Mahatma Gandhi Hospital To Heerapura",
    stops: ["Mahatma Gandhi Hospital", "Sitapura", "India Gate", "Pratap Nagar", "Sanganer Thana", "Sanganer Stadium", "RICCO Sanganer", "New Sanganer Road", "Mansarover Metro", "Kisan Dharam Kanta", "Heerapura"],
    distanceKm: 19,
    frequencyMinutes: 30,
    numBuses: 2
  },
  {
    routeNumber: "10",
    routeName: "Galta Gate To Niwaru",
    stops: ["Galta Gate", "Transport Nagar", "Jawahar Nagar", "Shanti Path", "Tilak Nagar", "JDA Circle", "Rambag Circle", "Sahakar Bhawan", "Sodala", "ESI No. 4", "Hasanpura", "Railway Station", "Chandpole", "Pittal Factory", "Chomu Pulia", "Jhotwara Kanta", "Shalimar", "Niwaru"],
    distanceKm: 28,
    frequencyMinutes: 13,
    numBuses: 16
  },
  {
    routeNumber: "11",
    routeName: "Siwad To Goner",
    stops: ["Siwad", "Meenawala", "Khatipura", "Railway Station", "Chandpole", "Ajmeri Gate", "Durgapura", "Sanganer Thana", "Pratap Nagar", "India Gate", "12 Meel", "Vidhani", "Goner"],
    distanceKm: 47,
    frequencyMinutes: 60,
    numBuses: 5
  },
  {
    routeNumber: "12",
    routeName: "Badi Chopad To Badi Chopad",
    stops: ["Badi Chopad", "Sanganeri Gate", "Ghat Gate", "Transport Nagar", "Khonagoriyan", "RTO", "Motuka Phatak", "Jagatpura Rob", "Jhalana", "Gandhi Nagar Mod", "Rambagh", "Ajmeri Gate", "Sanganeri Gate"],
    distanceKm: 17,
    frequencyMinutes: 80,
    numBuses: 2
  },
  {
    routeNumber: "14",
    routeName: "Jhotwara To Bassi",
    stops: ["Jhotwara", "Khatipura", "Vaishali Nagar", "Sodala", "Rambagh", "Ajmeri Gate", "Transport Nagar", "Kanota", "Bassi"],
    distanceKm: 47,
    frequencyMinutes: 15,
    numBuses: 17
  },
  {
    routeNumber: "15",
    routeName: "Chandpole To Chomu",
    stops: ["Chandpole", "Rampura", "Jetpura", "Chomu"],
    distanceKm: 32,
    frequencyMinutes: 15,
    numBuses: 8
  },
  {
    routeNumber: "16",
    routeName: "Ajmeri Gate To Chaksu",
    stops: ["Ajmeri Gate", "Tonk Phatak", "Durgapura", "Sanganer Thana", "Pratap Nagar", "12 Meel", "Bilwa", "Shivdaspura", "Shitla", "Chaksu"],
    distanceKm: 42,
    frequencyMinutes: 15,
    numBuses: 13
  },
  {
    routeNumber: "18",
    routeName: "Chomu Pulia To Kalwada",
    stops: ["Chomu Pulia", "Jhotwara", "Khatipura", "Vaishali Nagar", "Chitrakut Nagar", "Heerapura", "Bhankrota", "Mahapura", "Mahendra Sez", "Kalwada"],
    distanceKm: 28,
    frequencyMinutes: 150,
    numBuses: 1
  },
  {
    routeNumber: "26",
    routeName: "Chandpole To Bagru",
    stops: ["Chandpole", "Sodala", "Purani Chungi", "DCM", "Heerapura", "Bhankrota", "Bad Ke Balaji", "Dahmi Kala", "Sanjhariya", "Bagru"],
    distanceKm: 30,
    frequencyMinutes: 20,
    numBuses: 9
  },
  {
    routeNumber: "27",
    routeName: "Mohanpura To Goner",
    stops: ["Mohanpura", "Watika", "12 Meel", "India Gate", "Sanganer Thana", "Tonk Phatak", "Ajmeri Gate", "Transport Nagar", "Khaniya", "Luniyawas", "Dantli", "Siroli", "Goner"],
    distanceKm: 47,
    frequencyMinutes: 30,
    numBuses: 9
  },
  {
    routeNumber: "MiniBus1",
    routeName: "Railway Station To Galta Gate",
    stops: ["Railway Station", "Sindhi Camp", "Chandpole", "Choti Chopar", "Badi Chopad", "Ramganj Chopad", "Galta Gate"],
    distanceKm: 8,
    frequencyMinutes: 12,
    numBuses: 8
  },
  {
    routeNumber: "MiniBus2",
    routeName: "Railway Station To Khole Ke Hanuman Ji",
    stops: ["Railway Station", "Sindhi Camp", "Chandpole", "Choti Chopar", "Badi Chopad", "Ramganj Chopad", "Galta Gate", "Khole Ke Hanuman Ji"],
    distanceKm: 11,
    frequencyMinutes: 12,
    numBuses: 10
  },
  {
    routeNumber: "AC1",
    routeName: "Sanganer To Kukas",
    stops: ["Sanganer", "Sanganer Police Station", "Tonk Phatak", "Rambhag", "Ajmeri Gate", "Sanganeri Gate", "Badi Chopad", "Ramgarh Mod", "Jal Mahal", "Amer", "Kukas"],
    distanceKm: 33,
    frequencyMinutes: 16,
    numBuses: 14
  },
  {
    routeNumber: "AC2",
    routeName: "Joshi Marg To Mahatma Gandhi Hospital",
    stops: ["Joshi Marg", "Jhotwara", "Chomu Pulia", "Pani Pej", "Railway Station", "Chandpole", "Badi Chopad", "Ajmeri Gate", "Rambhag", "Tonk Phatak", "Durgapura", "Sanganer Police Station", "Pratap Nagar", "Sitapura", "Mahatma Gandhi Hospital"],
    distanceKm: 34,
    frequencyMinutes: 11,
    numBuses: 22
  },
  {
    routeNumber: "AC5",
    routeName: "Agarwal Farm To Amber",
    stops: ["Agarwal Farm", "Mansarovar", "Gurjar Ki Thadi", "Gopalpura", "Rambhag", "Ajmeri Gate", "Sanganeri Gate", "Badi Chopad", "Ramgarh Mod", "Jal Mahal", "Amer"],
    distanceKm: 28,
    frequencyMinutes: 16,
    numBuses: 13
  }
];

const seedBusRoutes = async () => {
  await connectDB();
  console.log('Seeding bus routes...');

  // Ensure all stops are in TouristLocation (with dummy coords if missing)
  const allStops = new Set();
  busRoutes.forEach(route => route.stops.forEach(stop => allStops.add(stop)));

  for (const stopName of allStops) {
    const existing = await TouristLocation.findOne({ name: stopName });
    if (!existing) {
      // Try to find a similar name or just use a default coordinate near Jaipur center
      await TouristLocation.create({
        name: stopName,
        description: `Bus stop at ${stopName}, Jaipur.`,
        latitude: 26.9124 + (Math.random() - 0.5) * 0.1,
        longitude: 75.7873 + (Math.random() - 0.5) * 0.1,
        area: stopName,
        category: "Bus Stop"
      });
      console.log(`Added missing stop: ${stopName}`);
    }
  }

  for (const route of busRoutes) {
    await BusRoute.findOneAndUpdate({ routeNumber: route.routeNumber }, route, { upsert: true });
    console.log(`Seeded Route: ${route.routeNumber}`);
  }

  console.log('Finished seeding bus routes.');
  process.exit(0);
};

seedBusRoutes();
