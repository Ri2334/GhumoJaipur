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
    images: ["https://images.unsplash.com/photo-1590494139561-26046187970d?auto=format&fit=crop&w=1200&q=80"],
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
    images: ["https://images.unsplash.com/photo-1627309355948-7e3cd6e6d7ad?auto=format&fit=crop&w=1200&q=80"],
    rating: 4.7,
    timings: "9:00 AM - 4:30 PM",
    ticketPrice: 100,
    category: "Palace",
    bestVisitTime: "Early morning",
    nearbyFoods: ["City Palace", "Jantar Mantar", "Johari Bazaar", "Pyaz Kachori", "Lassi"],
    transportOptions: ["Walk", "Auto", "Metro + walk"],
  },
  {
    name: "City Palace",
    description: "A royal complex with museums, courtyards and living heritage in the heart of Jaipur.",
    location: "Tripolia Bazar, Jaipur",
    images: ["https://images.unsplash.com/photo-1591871212876-027961b7f00d?auto=format&fit=crop&w=1200&q=80"],
    rating: 4.6,
    timings: "9:30 AM - 5:00 PM",
    ticketPrice: 300,
    category: "Palace",
    bestVisitTime: "Morning",
    nearbyFoods: ["Hawa Mahal", "Jantar Mantar", "Tripolia Bazaar", "Rajasthani Thali", "Rabri"],
    transportOptions: ["Auto", "Cab", "Walk"],
  },
  {
    name: "Jantar Mantar",
    description: "UNESCO-listed observatory with giant astronomical instruments built by Maharaja Jai Singh II.",
    location: "Gangori Bazaar, Jaipur",
    images: ["https://images.unsplash.com/photo-1564446617304-12a6b4d7c80c?auto=format&fit=crop&w=1200&q=80"],
    rating: 4.5,
    timings: "9:00 AM - 4:30 PM",
    ticketPrice: 100,
    category: "Museum",
    bestVisitTime: "Morning",
    nearbyFoods: ["City Palace", "Hawa Mahal", "Johari Bazaar", "Samosa", "Lassi"],
    transportOptions: ["Auto", "Cab", "Metro"],
  },
  {
    name: "Nahargarh Fort",
    description: "A scenic fort on the Aravalli hills with some of the best sunset and city views in Jaipur.",
    location: "Aravalli Hills, Jaipur",
    images: ["https://images.unsplash.com/photo-1626081242436-c87fc23d1f47?auto=format&fit=crop&w=1200&q=80"],
    rating: 4.6,
    timings: "10:00 AM - 6:00 PM",
    ticketPrice: 100,
    category: "Fort",
    bestVisitTime: "Sunset",
    nearbyFoods: ["Sunset View", "Padao Restaurant", "Coffee", "Tea"],
    transportOptions: ["Scooter", "Cab", "Jeep"],
  },
  {
    name: "Albert Hall Museum",
    description: "A beautiful museum with artifacts, paintings and one of the most photographed facades in Jaipur.",
    location: "Ram Niwas Garden, Jaipur",
    images: ["https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1200&q=80"],
    rating: 4.4,
    timings: "9:00 AM - 5:00 PM",
    ticketPrice: 100,
    category: "Museum",
    bestVisitTime: "Afternoon",
    nearbyFoods: ["Bapu Bazaar", "Masala Chowk", "Ice Cream", "Pakora"],
    transportOptions: ["Walk", "Auto", "Cab"],
  },
  {
    name: "Jal Mahal",
    description: "The picturesque palace floating in the middle of Man Sagar Lake, a Jaipur postcard classic.",
    location: "Amer Road, Jaipur",
    images: ["https://images.unsplash.com/photo-1509266272358-7701da638078?auto=format&fit=crop&w=1200&q=80"],
    rating: 4.7,
    timings: "Open 24 hours (viewpoint)",
    ticketPrice: 0,
    category: "Palace",
    bestVisitTime: "Sunrise and sunset",
    nearbyFoods: ["Kanaka Vrindavan Garden", "Amer Road Shopping", "Chai", "Pakora"],
    transportOptions: ["Cab", "Auto", "Bus"],
  },
  {
    name: "Birla Mandir",
    description: "A serene white marble temple dedicated to Lord Vishnu and Goddess Lakshmi.",
    location: "Tilak Nagar, Jaipur",
    images: ["https://images.unsplash.com/photo-1591871212876-027961b7f00d?auto=format&fit=crop&w=1200&q=80"],
    rating: 4.6,
    timings: "6:00 AM - 12:00 PM, 3:00 PM - 8:00 PM",
    ticketPrice: 0,
    category: "Temple",
    bestVisitTime: "Evening",
    nearbyFoods: ["Moti Dungri Temple", "Lalkothi Market", "Prasad", "Sweets"],
    transportOptions: ["Auto", "Cab", "Metro + Auto"],
  },
  {
    name: "Patrika Gate",
    description: "A colorful gateway known for its vibrant Rajasthani motifs and photo-friendly arches.",
    location: "Jawahar Circle, Jaipur",
    images: ["https://images.unsplash.com/photo-1616122026657-7e1f4c8d6c67?auto=format&fit=crop&w=1200&q=80"],
    rating: 4.8,
    timings: "Open 24 hours",
    ticketPrice: 0,
    category: "Other",
    bestVisitTime: "Evening",
    nearbyFoods: ["World Trade Park", "Jawahar Circle Garden", "Street food", "Coffee"],
    transportOptions: ["Cab", "Auto", "Bus"],
  },
  {
    name: "Jaigarh Fort",
    description: "A historic hill fort famous for the Jaivana cannon and sweeping city views.",
    location: "Amer, Jaipur",
    images: ["https://images.unsplash.com/photo-1583000624009-40898495034c?auto=format&fit=crop&w=1200&q=80"],
    rating: 4.6,
    timings: "9:00 AM - 4:30 PM",
    ticketPrice: 150,
    category: "Fort",
    bestVisitTime: "Morning",
    nearbyFoods: ["Amber Fort", "Nahargarh Fort", "Tea", "Snacks"],
    transportOptions: ["Cab", "Jeep", "Auto"],
  },
  {
    name: "Galtaji Temple",
    description: "A sacred temple complex with natural springs and the famous monkey valley.",
    location: "Galta Ji, Jaipur",
    images: ["https://images.unsplash.com/photo-1622359487449-34b9cf43f32f?auto=format&fit=crop&w=1200&q=80"],
    rating: 4.5,
    timings: "5:00 AM - 9:00 PM",
    ticketPrice: 0,
    category: "Temple",
    bestVisitTime: "Morning",
    nearbyFoods: ["Sun Temple", "Galta Gate", "Prasad", "Tea"],
    transportOptions: ["Cab", "Auto", "Jeep"],
  },
  {
    name: "Sisodia Rani Garden",
    description: "A landscaped royal garden with fountains, murals and a peaceful heritage atmosphere.",
    location: "Agra Road, Jaipur",
    images: ["https://images.unsplash.com/photo-1623910303426-382d6221c5f3?auto=format&fit=crop&w=1200&q=80"],
    rating: 4.4,
    timings: "8:00 AM - 6:00 PM",
    ticketPrice: 100,
    category: "Park",
    bestVisitTime: "Morning",
    nearbyFoods: ["Vidyadhar Garden", "Galtaji", "Juice", "Snacks"],
    transportOptions: ["Cab", "Auto"],
  },
  {
    name: "Rambagh Palace",
    description: "A luxury heritage palace once home to Jaipur's royalty, now a famous hotel and landmark.",
    location: "Bhawani Singh Road, Jaipur",
    images: ["https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80"],
    rating: 4.8,
    timings: "View from outside any time",
    ticketPrice: 700,
    category: "Palace",
    bestVisitTime: "Evening",
    nearbyFoods: ["Central Park", "MGD School", "Bapu Bazaar", "Coffee", "Desserts"],
    transportOptions: ["Cab", "Auto"],
  },
  {
    name: "Govind Dev Ji Temple",
    description: "A beloved temple in the City Palace complex, famous for its daily aartis.",
    location: "City Palace complex, Jaipur",
    images: ["https://images.unsplash.com/photo-1585060544812-7b8f2c4c3f9d?auto=format&fit=crop&w=1200&q=80"],
    rating: 4.7,
    timings: "6:00 AM - 9:00 PM",
    ticketPrice: 0,
    category: "Temple",
    bestVisitTime: "Morning or evening aarti",
    nearbyFoods: ["City Palace", "Jantar Mantar", "Johari Bazaar", "Prasad", "Sweets"],
    transportOptions: ["Walk", "Auto", "Cab"],
  },
  {
    name: "Chokhi Dhani",
    description: "An ethnic village resort offering a deep dive into Rajasthani culture with folk dances, traditional food, and village games.",
    location: "Tonk Road, Jaipur",
    images: ["https://images.unsplash.com/photo-1590494139561-26046187970d?auto=format&fit=crop&w=1200&q=80"],
    rating: 4.6,
    timings: "5:00 PM - 11:00 PM",
    ticketPrice: 900,
    category: "Other",
    bestVisitTime: "Evening",
    nearbyFoods: ["Rajasthani Thali", "Dal Baati Churma", "Ker Sangri"],
    transportOptions: ["Cab", "Auto"],
  },
  {
    name: "Bapu Bazaar",
    description: "A vibrant market in the Pink City famous for Mojari shoes, Bandhani textiles, and traditional Rajasthani handicrafts.",
    location: "Bapu Bazaar, Jaipur",
    images: ["https://images.unsplash.com/photo-1627309355948-7e3cd6e6d7ad?auto=format&fit=crop&w=1200&q=80"],
    rating: 4.5,
    timings: "10:30 AM - 9:00 PM",
    ticketPrice: 0,
    category: "Market",
    bestVisitTime: "Evening",
    nearbyFoods: ["Laxmi Chat Bhandar", "Samrat Kachori", "Gulab Ji Chai"],
    transportOptions: ["Walk", "Auto", "Metro"],
  },
  {
    name: "Johari Bazaar",
    description: "Jaipur's premier destination for exquisite gemstone jewelry, Kundan work, and traditional wedding attire.",
    location: "Johari Bazaar, Jaipur",
    images: ["https://images.unsplash.com/photo-1596702334863-718a38c23f26?auto=format&fit=crop&w=1200&q=80"],
    rating: 4.7,
    timings: "10:30 AM - 9:00 PM",
    ticketPrice: 0,
    category: "Market",
    bestVisitTime: "Evening",
    nearbyFoods: ["LMB", "Pandit Kulfi", "Radhe Kachori"],
    transportOptions: ["Walk", "Auto", "Metro"],
  },
  {
    name: "Jhalana Leopard Safari",
    description: "India's first leopard reserve located within city limits, offering thrilling Jeep safaris to spot leopards and desert foxes.",
    location: "Malviya Nagar, Jaipur",
    images: ["https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"],
    rating: 4.8,
    timings: "6:00 AM - 9:00 AM, 4:30 PM - 7:00 PM",
    ticketPrice: 1200,
    category: "Other",
    bestVisitTime: "Early morning or evening",
    nearbyFoods: ["Townsend", "Shikaar Bagh", "Kebabs & Curries"],
    transportOptions: ["Cab", "Auto"],
  },
  {
    name: "Kanak Vrindavan Garden",
    description: "A beautifully landscaped garden at the foothills of Nahargarh, featuring marble fountains and stunning views of Jal Mahal.",
    location: "Amer Road, Jaipur",
    images: ["https://images.unsplash.com/photo-1591871212876-027961b7f00d?auto=format&fit=crop&w=1200&q=80"],
    rating: 4.4,
    timings: "8:00 AM - 5:00 PM",
    ticketPrice: 25,
    category: "Park",
    bestVisitTime: "Morning",
    nearbyFoods: ["Jal Mahal Restaurant", "Street Stalls", "Chai"],
    transportOptions: ["Auto", "Cab", "Bus"],
  },
  {
    name: "Isarlat Sargasuli",
    description: "A 18th-century victory tower offering the best 360-degree panoramic view of the Pink City from its top.",
    location: "Tripolia Bazar, Jaipur",
    images: ["https://images.unsplash.com/photo-1564446617304-12a6b4d7c80c?auto=format&fit=crop&w=1200&q=80"],
    rating: 4.3,
    timings: "9:30 AM - 4:30 PM",
    ticketPrice: 100,
    category: "Museum",
    bestVisitTime: "Morning",
    nearbyFoods: ["Sahu Chai", "Samrat Kachori", "City Palace food"],
    transportOptions: ["Walk", "Auto", "Metro"],
  },
  {
    name: "Jawahar Kala Kendra",
    description: "A multi-arts center designed by Charles Correa, hosting art exhibitions, theater, and cultural festivals.",
    location: "JLN Marg, Jaipur",
    images: ["https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1200&q=80"],
    rating: 4.6,
    timings: "10:00 AM - 9:00 PM",
    ticketPrice: 0,
    category: "Other",
    bestVisitTime: "Evening",
    nearbyFoods: ["Indian Coffee House", "Saras Parlor", "Tapri"],
    transportOptions: ["Auto", "Cab", "Bus"],
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

  for (const place of places) {
    await Place.findOneAndDelete({ name: place.name });
    await Place.create({ ...place, createdBy: owner._id });
  }

  console.log(`Seeded ${places.length} Jaipur places.`);
  await mongoose.disconnect();
};

runSeed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
