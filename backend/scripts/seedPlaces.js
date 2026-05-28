import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import Place from "../models/Place.js";
import User from "../models/User.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env") });

const places = [
  {
    name: "Amber Fort",
    description: "A grand hilltop fort with mirror work, courtyards and panoramic views of Jaipur.",
    location: "Devisinghpura, Amer, Jaipur",
    images: ["https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953020/Amber_Fort_etnj4b.webp"],
    rating: 4.8,
    timings: "8:00 AM - 5:30 PM",
    ticketPrice: 200,
    category: "Fort",
    bestVisitTime: "October to March",
    nearbyFoods: ["Dal Baati Churma", "Ghewar", "Lassi"],
    transportOptions: ["Auto", "Cab", "RSRTC bus"],
  },
  {
    name: "Hawa Mahal",
    description: "The iconic Palace of Winds, famous for its honeycomb facade and heritage charm.",
    location: "Badi Choupad, Jaipur",
    images: ["https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953024/hawamahal_owadja.jpg"],
    rating: 4.7,
    timings: "9:00 AM - 4:30 PM",
    ticketPrice: 100,
    category: "Palace",
    bestVisitTime: "Early morning",
    nearbyFoods: ["City Palace", "Jantar Mantar", "Lassi"],
    transportOptions: ["Walk", "Auto", "Metro"],
  },
  {
    name: "City Palace",
    description: "A royal complex with museums, courtyards and living heritage in the heart of Jaipur.",
    location: "Tripolia Bazar, Jaipur",
    images: ["https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953278/City_Palace_jmjeuo.webp"],
    rating: 4.6,
    timings: "9:30 AM - 5:00 PM",
    ticketPrice: 300,
    category: "Palace",
    bestVisitTime: "Morning",
    nearbyFoods: ["Rajasthani Thali", "Rabri"],
    transportOptions: ["Auto", "Cab", "Walk"],
  },
  {
    name: "Jantar Mantar",
    description: "UNESCO-listed observatory with giant astronomical instruments built by Maharaja Jai Singh II.",
    location: "Gangori Bazaar, Jaipur",
    images: ["https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953021/Jantar_Mantar_lm0jfo.jpg"],
    rating: 4.5,
    timings: "9:00 AM - 4:30 PM",
    ticketPrice: 100,
    category: "Museum",
    bestVisitTime: "Morning",
    nearbyFoods: ["Johari Bazaar", "Samosa"],
    transportOptions: ["Auto", "Cab", "Metro"],
  },
  {
    name: "Nahargarh Fort",
    description: "A scenic fort on the Aravalli hills with some of the best sunset and city views in Jaipur.",
    location: "Aravalli Hills, Jaipur",
    images: ["https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953023/Nahargarh_Fort_ieetqc.jpg"],
    rating: 4.6,
    timings: "10:00 AM - 6:00 PM",
    ticketPrice: 100,
    category: "Fort",
    bestVisitTime: "Sunset",
    nearbyFoods: ["Sunset View", "Padao Restaurant"],
    transportOptions: ["Cab", "Scooter"],
  },
  {
    name: "Albert Hall Museum",
    description: "A beautiful museum with artifacts, paintings and one of the most photographed facades in Jaipur.",
    location: "Ram Niwas Garden, Jaipur",
    images: ["https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953023/Albert_Hall_Museum_g25y8x.jpg"],
    rating: 4.4,
    timings: "9:00 AM - 5:00 PM",
    ticketPrice: 100,
    category: "Museum",
    bestVisitTime: "Afternoon",
    nearbyFoods: ["Bapu Bazaar", "Masala Chowk"],
    transportOptions: ["Walk", "Auto"],
  },
  {
    name: "Jal Mahal",
    description: "The picturesque palace floating in the middle of Man Sagar Lake, a Jaipur postcard classic.",
    location: "Amer Road, Jaipur",
    images: ["https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953029/Jal_Mahal_nytgp8.jpg"],
    rating: 4.7,
    timings: "Open 24 hours (viewpoint)",
    ticketPrice: 0,
    category: "Palace",
    bestVisitTime: "Sunrise and sunset",
    nearbyFoods: ["Chai", "Pakora"],
    transportOptions: ["Cab", "Auto", "Bus"],
  },
  {
    name: "Birla Mandir",
    description: "A serene white marble temple dedicated to Lord Vishnu and Goddess Lakshmi.",
    location: "Tilak Nagar, Jaipur",
    images: ["https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953020/Birla_Mandir_bn5dfb.jpg"],
    rating: 4.6,
    timings: "6:00 AM - 12:00 PM, 3:00 PM - 8:00 PM",
    ticketPrice: 0,
    category: "Temple",
    bestVisitTime: "Evening",
    nearbyFoods: ["Moti Dungri Temple", "Sweets"],
    transportOptions: ["Auto", "Cab"],
  },
  {
    name: "Patrika Gate",
    description: "A colorful gateway known for its vibrant Rajasthani motifs and photo-friendly arches.",
    location: "Jawahar Circle, Jaipur",
    images: ["https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953025/Patrika_Gate_wjuypt.jpg"],
    rating: 4.8,
    timings: "Open 24 hours",
    ticketPrice: 0,
    category: "Other",
    bestVisitTime: "Evening",
    nearbyFoods: ["World Trade Park", "Street food"],
    transportOptions: ["Cab", "Auto", "Bus"],
  },
  {
    name: "Jaigarh Fort",
    description: "A historic hill fort famous for the Jaivana cannon and sweeping city views.",
    location: "Amer, Jaipur",
    images: ["https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953028/Jaigarh_Fort_nkzlwp.jpg"],
    rating: 4.6,
    timings: "9:00 AM - 4:30 PM",
    ticketPrice: 150,
    category: "Fort",
    bestVisitTime: "Morning",
    nearbyFoods: ["Tea", "Snacks"],
    transportOptions: ["Cab", "Jeep"],
  },
  {
    name: "Galtaji Temple",
    description: "A sacred temple complex with natural springs and the famous monkey valley.",
    location: "Galta Ji, Jaipur",
    images: ["https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953019/Galtaji_Temple_u3rntw.jpg"],
    rating: 4.5,
    timings: "5:00 AM - 9:00 PM",
    ticketPrice: 0,
    category: "Temple",
    bestVisitTime: "Morning",
    nearbyFoods: ["Sun Temple", "Tea"],
    transportOptions: ["Cab", "Auto"],
  },
  {
    name: "Sisodia Rani Garden",
    description: "A landscaped royal garden with fountains, murals and a peaceful heritage atmosphere.",
    location: "Agra Road, Jaipur",
    images: ["https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953028/Sisodia_Rani_Garden_q8b4nx.jpg"],
    rating: 4.4,
    timings: "8:00 AM - 6:00 PM",
    ticketPrice: 100,
    category: "Park",
    bestVisitTime: "Morning",
    nearbyFoods: ["Juice", "Snacks"],
    transportOptions: ["Cab", "Auto"],
  },
  {
    name: "Rambagh Palace",
    description: "A luxury heritage palace once home to Jaipur's royalty, now a famous hotel and landmark.",
    location: "Bhawani Singh Road, Jaipur",
    images: ["https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953027/Rambagh_Palace_lcfwlv.jpg"],
    rating: 4.8,
    timings: "View from outside any time",
    ticketPrice: 700,
    category: "Palace",
    bestVisitTime: "Evening",
    nearbyFoods: ["Central Park", "Coffee"],
    transportOptions: ["Cab", "Auto"],
  },
  {
    name: "Govind Dev Ji Temple",
    description: "A beloved temple in the City Palace complex, famous for its daily aartis.",
    location: "City Palace complex, Jaipur",
    images: ["https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953021/Govind_Dev_Ji_Temple_nu1toc.jpg"],
    rating: 4.7,
    timings: "6:00 AM - 9:00 PM",
    ticketPrice: 0,
    category: "Temple",
    bestVisitTime: "Morning or evening aarti",
    nearbyFoods: ["Prasad", "Sweets"],
    transportOptions: ["Walk", "Auto"],
  },
  {
    name: "Chokhi Dhani",
    description: "An ethnic village resort offering a deep dive into Rajasthani culture with folk dances and traditional food.",
    location: "Tonk Road, Jaipur",
    images: ["https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953020/Chokhi_Dhani_e13lfx.jpg"],
    rating: 4.6,
    timings: "5:00 PM - 11:00 PM",
    ticketPrice: 900,
    category: "Other",
    bestVisitTime: "Evening",
    nearbyFoods: ["Rajasthani Thali", "Dal Baati Churma"],
    transportOptions: ["Cab", "Auto"],
  },
  {
    name: "Bapu Bazaar",
    description: "A vibrant market in the Pink City famous for Mojari shoes and Bandhani textiles.",
    location: "Bapu Bazaar, Jaipur",
    images: ["https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953021/Bapu_Bazaar_juabna.jpg"],
    rating: 4.5,
    timings: "10:30 AM - 9:00 PM",
    ticketPrice: 0,
    category: "Market",
    bestVisitTime: "Evening",
    nearbyFoods: ["Laxmi Chat Bhandar", "Samrat Kachori"],
    transportOptions: ["Walk", "Auto", "Metro"],
  },
  {
    name: "Johari Bazaar",
    description: "Jaipur's premier destination for exquisite gemstone jewelry and Kundan work.",
    location: "Johari Bazaar, Jaipur",
    images: ["https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953025/Johari_Bazaar_tpco2i.jpg"],
    rating: 4.7,
    timings: "10:30 AM - 9:00 PM",
    ticketPrice: 0,
    category: "Market",
    bestVisitTime: "Evening",
    nearbyFoods: ["LMB", "Pandit Kulfi"],
    transportOptions: ["Walk", "Auto", "Metro"],
  },
  {
    name: "Jhalana Leopard Safari",
    description: "India's first leopard reserve located within city limits, offering thrilling Jeep safaris.",
    location: "Malviya Nagar, Jaipur",
    images: ["https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953024/Jhalana_Leopard_Safari_sjzlza.jpg"],
    rating: 4.8,
    timings: "6:00 AM - 9:00 AM, 4:30 PM - 7:00 PM",
    ticketPrice: 1200,
    category: "Other",
    bestVisitTime: "Early morning or evening",
    nearbyFoods: ["Kebabs & Curries"],
    transportOptions: ["Cab", "Auto"],
  },
  {
    name: "Kanak Vrindavan Garden",
    description: "A beautifully landscaped garden at the foothills of Nahargarh.",
    location: "Amer Road, Jaipur",
    images: ["https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953024/Kanak_Vrindavan_Garden_b3tphy.jpg"],
    rating: 4.4,
    timings: "8:00 AM - 5:00 PM",
    ticketPrice: 25,
    category: "Park",
    bestVisitTime: "Morning",
    nearbyFoods: ["Street Stalls", "Chai"],
    transportOptions: ["Auto", "Cab"],
  },
  {
    name: "Isarlat Sargasuli",
    description: "A 18th-century victory tower offering 360-degree panoramic view of the Pink City.",
    location: "Tripolia Bazar, Jaipur",
    images: ["https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953022/Isarlat_Sargasuli_mfeue9.webp"],
    rating: 4.3,
    timings: "9:30 AM - 4:30 PM",
    ticketPrice: 100,
    category: "Museum",
    bestVisitTime: "Morning",
    nearbyFoods: ["Sahu Chai", "Samrat Kachori"],
    transportOptions: ["Walk", "Auto"],
  },
  {
    name: "Jawahar Kala Kendra",
    description: "A multi-arts center hosting art exhibitions, theater, and cultural festivals.",
    location: "JLN Marg, Jaipur",
    images: ["https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953024/Jawahar_Kala_Kendra_p9luy7.jpg"],
    rating: 4.6,
    timings: "10:00 AM - 9:00 PM",
    ticketPrice: 0,
    category: "Other",
    bestVisitTime: "Evening",
    nearbyFoods: ["Indian Coffee House", "Tapri"],
    transportOptions: ["Auto", "Cab"],
  },
];

const runSeed = async () => {
  await connectDB();

  let owner = await User.findOne({ email: process.env.ADMIN_EMAIL || "admin@ghumojaipur.local" });
  if (!owner) {
    owner = await User.findOne({ role: "admin" });
  }
  if (!owner) {
    const password = await bcrypt.hash("Admin@12345", 10);
    owner = await User.create({
      fullName: "Ghumo Jaipur Admin",
      email: process.env.ADMIN_EMAIL || "admin@ghumojaipur.local",
      mobile: "9999999999",
      password,
      emailVerified: true,
      role: "admin",
    });
  }

  // Clear existing places to ensure fresh re-seed with correct URLs
  console.log("Clearing old place data...");
  await Place.deleteMany({});

  for (const place of places) {
    await Place.create({ ...place, createdBy: owner._id });
  }

  console.log(`Successfully seeded ${places.length} Jaipur places with Cloudinary images.`);
  await mongoose.disconnect();
};

runSeed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
