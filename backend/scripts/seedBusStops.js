import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TouristLocation from '../models/TouristLocation.js';
import connectDB from '../config/db.js';

dotenv.config();

const locations = [
  { name: "Todi", lat: 27.0125, lng: 75.7612 },
  { name: "Harmada", lat: 26.9850, lng: 75.7725 },
  { name: "Chomu Pulia", lat: 26.9542, lng: 75.7856 },
  { name: "Pittal Factory", lat: 26.9388, lng: 75.7942 },
  { name: "Transport Nagar", lat: 26.9150, lng: 75.8540 },
  { name: "VKI (Road No. 17)", lat: 26.9725, lng: 75.7645 },
  { name: "Amba Bari", lat: 26.9585, lng: 75.7925 },
  { name: "Pani Pej", lat: 26.9456, lng: 75.7885 },
  { name: "Bhakrota", lat: 26.8750, lng: 75.6985 },
  { name: "Heerapura", lat: 26.8856, lng: 75.7256 },
  { name: "DCM", lat: 26.8925, lng: 75.7412 },
  { name: "Sodala", lat: 26.9056, lng: 75.7725 },
  { name: "Dwarkapuri", lat: 26.8412, lng: 75.7356 },
  { name: "Sanganer Police Station", lat: 26.8185, lng: 75.7856 },
  { name: "Durgapura", lat: 26.8512, lng: 75.7925 },
  { name: "Tonk Phatak", lat: 26.8842, lng: 75.8012 },
  { name: "Rambhag", lat: 26.8985, lng: 75.8085 },
  { name: "Ajmeri Gate", lat: 26.9156, lng: 75.8156 },
  { name: "Sanganer", lat: 26.8012, lng: 75.7856 },
  { name: "N.R.I Circle", lat: 26.8125, lng: 75.8156 },
  { name: "Pannadhay Circle", lat: 26.7925, lng: 75.8125 },
  { name: "Shyopur", lat: 26.7812, lng: 75.8012 },
  { name: "Ramgarh Mod", lat: 26.9385, lng: 75.8356 },
  { name: "Jal Mahal", lat: 26.9535, lng: 75.8456 },
  { name: "Amer", lat: 26.9856, lng: 75.8512 },
  { name: "Kunda", lat: 27.0012, lng: 75.8756 },
  { name: "Mahatma Gandhi Hospital", lat: 26.7725, lng: 75.8656 },
  { name: "India Gate", lat: 26.7912, lng: 75.8356 },
  { name: "Malviya Nagar Sector 5", lat: 26.8456, lng: 75.8212 },
  { name: "Underpass Bridge", lat: 26.8512, lng: 75.8185 },
  { name: "Saras Dairy", lat: 26.8656, lng: 75.8112 },
  { name: "JLN Marg", lat: 26.8756, lng: 75.8085 },
  { name: "Dainik Bhaskar", lat: 26.8856, lng: 75.8056 },
  { name: "Gandhi Nagar Station", lat: 26.8912, lng: 75.7956 },
  { name: "SMS Hospital", lat: 26.9056, lng: 75.8112 },
  { name: "Collectory Circle", lat: 26.9256, lng: 75.7912 },
  { name: "Chinkar Canteen", lat: 26.9356, lng: 75.7856 },
  { name: "Panchawala", lat: 26.9125, lng: 75.7156 },
  { name: "Kisan Dharm Kanta", lat: 26.8812, lng: 75.7485 },
  { name: "Gurjar Ki Thadi", lat: 26.8825, lng: 75.7656 },
  { name: "Narayan Singh Circle", lat: 26.9056, lng: 75.8212 },
  { name: "Moti Dungri", lat: 26.8985, lng: 75.8212 },
  { name: "Govind Marg", lat: 26.9012, lng: 75.8356 },
  { name: "Mental Hospital", lat: 26.9056, lng: 75.8456 },
  { name: "Chitrakut Nagar", lat: 26.9012, lng: 75.7256 },
  { name: "Nursery Circle", lat: 26.9056, lng: 75.7356 },
  { name: "Vaishali Circle", lat: 26.9085, lng: 75.7456 },
  { name: "Khatipura Tiraha", lat: 26.9156, lng: 75.7556 },
  { name: "Hasanpura", lat: 26.9185, lng: 75.7756 },
  { name: "Ghatgate", lat: 26.9185, lng: 75.8356 },
  { name: "Baraf Khana", lat: 26.9085, lng: 75.8512 },
  { name: "Jawahar Nagar", lat: 26.9012, lng: 75.8556 },
  { name: "Jagatpura", lat: 26.8256, lng: 75.8556 },
  { name: "Apex Circle", lat: 26.8356, lng: 75.8456 },
  { name: "Jhalana", lat: 26.8556, lng: 75.8356 },
  { name: "Gandhi Nagar Mod", lat: 26.8925, lng: 75.8112 },
  { name: "Kings Road", lat: 26.8856, lng: 75.7412 },
  { name: "Nirman Nagar", lat: 26.8825, lng: 75.7312 },
  { name: "Ganga Jamuna Petrol Pump", lat: 26.8785, lng: 75.7256 },
  { name: "Agarwal Farm", lat: 26.8456, lng: 75.7656 },
  { name: "Sita Bari", lat: 26.8185, lng: 75.8012 },
  { name: "Jawahar Circle", lat: 26.8256, lng: 75.8156 },
  { name: "Jagatpura Rly Station", lat: 26.8212, lng: 75.8512 },
  { name: "Pratap Nagar", lat: 26.7912, lng: 75.8256 },
  { name: "Sitapura", lat: 26.7712, lng: 75.8456 },
  { name: "New Sanganer Road", lat: 26.8512, lng: 75.7512 },
  { name: "Galta Gate", lat: 26.9356, lng: 75.8456 },
  { name: "Tilak Nagar", lat: 26.8956, lng: 75.8256 },
  { name: "JDA Circle", lat: 26.9085, lng: 75.8156 },
  { name: "Niwaru", lat: 26.9756, lng: 75.7156 },
  { name: "Siwad", lat: 26.9212, lng: 75.6856 },
  { name: "Meenawala", lat: 26.9156, lng: 75.7012 },
  { name: "Khatipura", lat: 26.9256, lng: 75.7412 },
  { name: "12 Meel", lat: 26.7556, lng: 75.8556 },
  { name: "Vidhani", lat: 26.7412, lng: 75.8656 },
  { name: "Goner", lat: 26.7312, lng: 75.8856 },
  { name: "Khonagoriyan", lat: 26.8856, lng: 75.8756 },
  { name: "Bassi", lat: 26.8912, lng: 76.0456 },
  { name: "Chomu", lat: 27.1712, lng: 75.7212 },
  { name: "Chaksu", lat: 26.6012, lng: 75.9456 },
  { name: "Kalwada", lat: 26.8312, lng: 75.6512 },
  { name: "Bagru", lat: 26.8112, lng: 75.5512 },
  { name: "Kukas", lat: 27.0512, lng: 75.8956 },
  { name: "Joshi Marg", lat: 26.9656, lng: 75.7556 }
];

const seedBusStops = async () => {
  await connectDB();
  console.log('Seeding bus stops...');
  
  for (const loc of locations) {
    const existing = await TouristLocation.findOne({ name: loc.name });
    if (!existing) {
      await TouristLocation.create({
        name: loc.name,
        description: `Bus stop in ${loc.name} area, Jaipur.`,
        latitude: loc.lat,
        longitude: loc.lng,
        area: loc.name,
        category: "Bus Stop"
      });
      console.log(`Created: ${loc.name}`);
    }
  }
  
  console.log('Finished seeding.');
  process.exit(0);
};

seedBusStops();
