export const INITIAL_RENTALS = [
  // UDAIPUR RENTALS
  {
    id: "ud-activa-6g",
    title: "Honda Activa 6G / 5G",
    category: "Activa & Scooty",
    city: "Udaipur",
    dailyRate: 400,
    hourlyRate: 60,
    deposit: 1000,
    pickupLocation: "Udaipur City Railway Station & Lal Ghat",
    hostName: "Mewar Bike Rentals (Verified)",
    hostPhone: "+919829012345",
    rating: 4.8,
    reviewsCount: 310,
    fuelType: "Petrol",
    helmetIncluded: "2 Helmets Included Free",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
    description: "Most popular automatic scooty for navigating narrow heritage alleys of Jagdish Chowk, Fatehsagar promenade, and Lake Pichola waterfront.",
    featured: true
  },
  {
    id: "ud-bullet-350",
    title: "Royal Enfield Classic 350",
    category: "Bikes & Cruisers",
    city: "Udaipur",
    dailyRate: 950,
    hourlyRate: 140,
    deposit: 2000,
    pickupLocation: "Udiapole Bus Stand & Chetak Circle",
    hostName: "Udaipur Royal Riders",
    hostPhone: "+919829054321",
    rating: 4.9,
    reviewsCount: 240,
    fuelType: "Petrol",
    helmetIncluded: "2 Helmets Included Free",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
    description: "Iconic Royal Enfield cruiser ideal for scenic highway rides to Monsoon Palace Sajjangarh, Bahubali Hills, and Kumbhalgarh Fort.",
    featured: true
  },
  {
    id: "ud-pulsar-150",
    title: "Bajaj Pulsar 150 / TVS Apache",
    category: "Bikes & Cruisers",
    city: "Udaipur",
    dailyRate: 650,
    hourlyRate: 90,
    deposit: 1500,
    pickupLocation: "Surajpole & Sukhadia Circle",
    hostName: "Lake City Wheels",
    hostPhone: "+919829067890",
    rating: 4.7,
    reviewsCount: 180,
    fuelType: "Petrol",
    helmetIncluded: "2 Helmets Included Free",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80",
    description: "Fuel-efficient sporty bike perfect for daily commuting across Udaipur city and Badi Lake.",
    featured: false
  },
  {
    id: "ud-thar-4x4",
    title: "Mahindra Thar 4x4 Convertible",
    category: "Self-Drive Cars",
    city: "Udaipur",
    dailyRate: 3800,
    hourlyRate: 500,
    deposit: 5000,
    pickupLocation: "Maharana Pratap Dabok Airport & Railway Station",
    hostName: "Udaipur Self-Drive Cars Hub",
    hostPhone: "+919829099999",
    rating: 4.9,
    reviewsCount: 140,
    fuelType: "Diesel / Manual",
    helmetIncluded: "Unlimited KM Option Available",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    description: "Open-top 4x4 SUV for luxury road trips around Aravalli valley trails and Nathdwara.",
    featured: true
  },
  {
    id: "ud-swift-dzire",
    title: "Maruti Swift / Dzire AC",
    category: "Self-Drive Cars",
    city: "Udaipur",
    dailyRate: 1800,
    hourlyRate: 250,
    deposit: 3000,
    pickupLocation: "Udaipur Railway Station",
    hostName: "Heritage Self Drive Cabs",
    hostPhone: "+919829088888",
    rating: 4.8,
    reviewsCount: 220,
    fuelType: "Petrol / AC",
    helmetIncluded: "Clean Sanitized Sedan",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    description: "Comfortable air-conditioned self-drive hatchback for family sightseeing across Udaipur & Ranakpur.",
    featured: false
  },

  // JAIPUR RENTALS
  {
    id: "jp-activa-6g",
    title: "Honda Activa 6G Pink City Edition",
    category: "Activa & Scooty",
    city: "Jaipur",
    dailyRate: 350,
    hourlyRate: 50,
    deposit: 1000,
    pickupLocation: "Jaipur Railway Station & Sindhi Camp",
    hostName: "Jaipur Bike Rental Hub",
    hostPhone: "+919414012345",
    rating: 4.8,
    reviewsCount: 450,
    fuelType: "Petrol",
    helmetIncluded: "2 Helmets Included Free",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
    description: "Top-rated Activa rental near Sindhi Camp ISBT & Railway Station for exploring Hawa Mahal and Amer Fort.",
    featured: true
  },
  {
    id: "jp-royal-enfield",
    title: "Royal Enfield Meteor 350",
    category: "Bikes & Cruisers",
    city: "Jaipur",
    dailyRate: 1000,
    hourlyRate: 150,
    deposit: 2000,
    pickupLocation: "MI Road & C-Scheme",
    hostName: "Pink City Riders",
    hostPhone: "+919414054321",
    rating: 4.9,
    reviewsCount: 380,
    fuelType: "Petrol",
    helmetIncluded: "2 Helmets Included Free",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
    description: "Cruiser bike for riding along Nahargarh Fort hills and Sambhar Salt Lake.",
    featured: true
  }
];

export const getStoredRentals = () => {
  try {
    const saved = localStorage.getItem("sheher_saathi_rentals");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error("Error loading rentals:", err);
  }
  return INITIAL_RENTALS;
};

export const saveStoredRentals = (rentals) => {
  try {
    localStorage.setItem("sheher_saathi_rentals", JSON.stringify(rentals));
  } catch (err) {
    console.error("Error saving rentals:", err);
  }
};
