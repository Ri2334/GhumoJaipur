import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import Place from "../models/Place.js";
import User from "../models/User.js";

dotenv.config();

const places = [
  {
    name: "Amber Fort",
    description: "A grand hilltop fort with mirror work, courtyards and panoramic views of Jaipur.",
    location: "Devisinghpura, Amer, Jaipur",
    images: [
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
    ],
    rating: 4.8,
    timings: "8:00 AM - 5:30 PM",
    ticketPrice: 100,
    category: "Fort",
    bestVisitTime: "October to March",
    nearbyFoods: ["Dal Baati Churma", "Ghewar", "Lassi"],
    transportOptions: ["Auto", "Cab", "RSRTC bus"],
  },
  {
    name: "Hawa Mahal",
    description: "The iconic Palace of Winds, famous for its honeycomb facade and heritage charm.",
    location: "Badi Choupad, Jaipur",
    images: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502613374390-8da7aa535a0f?auto=format&fit=crop&w=1200&q=80",
    ],
    rating: 4.7,
    timings: "9:00 AM - 4:30 PM",
    ticketPrice: 50,
    category: "Palace",
    bestVisitTime: "Early morning",
    nearbyFoods: ["Pyaz Kachori", "Kulfi", "Mawa Kachori"],
    transportOptions: ["Walk", "Auto", "Metro + walk"],
  },
  {
    name: "City Palace",
    description: "A royal complex with museums, courtyards and living heritage in the heart of Jaipur.",
    location: "Tripolia Bazar, Jaipur",
    images: [
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    ],
    rating: 4.6,
    timings: "9:30 AM - 5:00 PM",
    ticketPrice: 200,
    category: "Palace",
    bestVisitTime: "Morning",
    nearbyFoods: ["Rajasthani Thali", "Chaat", "Rabri"],
    transportOptions: ["Auto", "Cab", "Walk"],
  },
  {
    name: "Jantar Mantar",
    description: "UNESCO-listed observatory with giant astronomical instruments built by Maharaja Jai Singh II.",
    location: "Gangori Bazaar, Jaipur",
    images: [
      "https://images.unsplash.com/photo-1564446617304-12a6b4d7c80c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&w=1200&q=80",
    ],
    rating: 4.5,
    timings: "9:00 AM - 4:30 PM",
    ticketPrice: 100,
    category: "Museum",
    bestVisitTime: "Morning",
    nearbyFoods: ["Samosa", "Lassi", "Kachori"],
    transportOptions: ["Auto", "Cab", "Metro"],
  },
  {
    name: "Nahargarh Fort",
    description: "A scenic fort on the Aravalli hills with some of the best sunset and city views in Jaipur.",
    location: "Aravalli Hills, Jaipur",
    images: [
      "https://images.unsplash.com/photo-1615695130833-3bead7e8e5b2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1602216056096-3b40cc0b7d0d?auto=format&fit=crop&w=1200&q=80",
    ],
    rating: 4.6,
    timings: "10:00 AM - 6:00 PM",
    ticketPrice: 50,
    category: "Fort",
    bestVisitTime: "Sunset",
    nearbyFoods: ["Coffee", "Noodles", "Tea"],
    transportOptions: ["Scooter", "Cab", "Jeep"],
  },
  {
    name: "Albert Hall Museum",
    description: "A beautiful museum with artifacts, paintings and one of the most photographed facades in Jaipur.",
    location: "Ram Niwas Garden, Jaipur",
    images: [
      "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524492449090-30f8d87d7d2c?auto=format&fit=crop&w=1200&q=80",
    ],
    rating: 4.4,
    timings: "9:00 AM - 5:00 PM",
    ticketPrice: 40,
    category: "Museum",
    bestVisitTime: "Afternoon",
    nearbyFoods: ["Ice Cream", "Pakora", "Tea"],
    transportOptions: ["Walk", "Auto", "Cab"],
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
    const exists = await Place.findOne({ name: place.name });
    if (exists) continue;
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
