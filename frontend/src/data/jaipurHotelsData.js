import { AFFILIATE_CONFIG } from "../config/affiliateConfig";

const buildBookingUrl = (hotelName) => {
  const query = encodeURIComponent(`${hotelName}, Jaipur`);
  if (AFFILIATE_CONFIG.bookingComAid && AFFILIATE_CONFIG.bookingComAid !== "304140") {
    return `https://www.booking.com/searchresults.html?ss=${query}&aid=${AFFILIATE_CONFIG.bookingComAid}`;
  }
  return `https://www.booking.com/searchresults.html?ss=${query}`;
};

const INITIAL_JAIPUR_HOTELS = [
  {
    id: "rambagh-palace",
    name: "Rambagh Palace (Taj)",
    type: "Luxury Resort",
    rating: 4.9,
    reviewsCount: 1420,
    startingPrice: 38000,
    location: "Bhawani Singh Road, C-Scheme",
    city: "Jaipur",
    nearestSpots: ["Albert Hall Museum", "Birla Mandir", "City Palace"],
    amenities: ["Rooftop Dining", "Outdoor Pool", "Spa & Wellness", "Heritage Gardens", "Butler Service"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    description: "Former residence of the Maharaja of Jaipur. Known as the 'Jewel of Jaipur', featuring 47 acres of manicured gardens and opulent royal suites.",
    featured: true,
    bookingUrl: buildBookingUrl("Rambagh Palace")
  },
  {
    id: "samode-haveli",
    name: "Samode Haveli",
    type: "Heritage Haveli",
    rating: 4.8,
    reviewsCount: 980,
    startingPrice: 14500,
    location: "Gangapole, Old Pink City",
    city: "Jaipur",
    nearestSpots: ["Hawa Mahal", "Johari Bazaar", "City Palace"],
    amenities: ["Heritage Courtyard", "Outdoor Pool", "Traditional Rajasthani Thali", "Free Wi-Fi"],
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    description: "An authentic 175-year-old royal haveli built by the Samode family. Nestled inside the old walled city with exquisite frescoes and poolside dining.",
    featured: true,
    bookingUrl: buildBookingUrl("Samode Haveli")
  },
  {
    id: "alsisar-haveli",
    name: "Alsisar Haveli",
    type: "Heritage Haveli",
    rating: 4.7,
    reviewsCount: 740,
    startingPrice: 7800,
    location: "Sansar Chandra Road, Near Sindhi Camp",
    city: "Jaipur",
    nearestSpots: ["Sindhi Camp ISBT", "Raj Mandir Cinema", "MI Road"],
    amenities: ["Heritage Pool", "Rooftop Bar", "Free Parking", "Cultural Puppet Shows"],
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    description: "Restored Rajput mansion owned by the Alsisar nobles. Features intricate arches, antique chandeliers, and serene inner courtyards.",
    featured: true,
    bookingUrl: buildBookingUrl("Alsisar Haveli")
  },
  {
    id: "trident-jaipur",
    name: "Trident Jaipur",
    type: "Luxury Resort",
    rating: 4.7,
    reviewsCount: 1150,
    startingPrice: 11200,
    location: "Amber Fort Road, Opposite Mansagar Lake",
    city: "Jaipur",
    nearestSpots: ["Jal Mahal", "Amer Fort", "Nahargarh Fort"],
    amenities: ["Mansagar Lake View", "Heated Pool", "Kids Club", "Multi-cuisine Restaurant"],
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
    description: "Breathtaking lakefront resort overlooking Jal Mahal and the Aravalli Hills. Minutes from Amer Fort.",
    featured: true,
    bookingUrl: buildBookingUrl("Trident Jaipur")
  },
  {
    id: "shahpura-house",
    name: "Shahpura House",
    type: "Heritage Haveli",
    rating: 4.6,
    reviewsCount: 860,
    startingPrice: 6500,
    location: "Devi Marg, Bani Park",
    city: "Jaipur",
    nearestSpots: ["Jaipur Railway Station", "Bani Park", "Sindhi Camp"],
    amenities: ["Rooftop Pool", "Fresco Suites", "Ayurvedic Spa", "Traditional Music Evening"],
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    description: "Authentic Indo-Saracenic royal house boasting gilded mirrors, traditional frescoes, and a popular sunset rooftop restaurant.",
    featured: false,
    bookingUrl: buildBookingUrl("Shahpura House")
  },
  {
    id: "pearl-palace-heritage",
    name: "Pearl Palace Heritage",
    type: "Boutique Hotel",
    rating: 4.8,
    reviewsCount: 1650,
    startingPrice: 3200,
    location: "Ajmer Road, Gopalbari",
    city: "Jaipur",
    nearestSpots: ["Jaipur Railway Station", "MI Road", "Raj Mandir"],
    amenities: ["Artisanal Rooms", "Free High Speed Wi-Fi", "Airport Shuttle", "Rooftop Cafe"],
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    description: "Award-winning boutique hotel where every room represents a different Indian state & art heritage. Highly rated by international travelers.",
    featured: true,
    bookingUrl: buildBookingUrl("Pearl Palace Heritage")
  },
  {
    id: "zostel-jaipur",
    name: "Zostel Jaipur",
    type: "Budget & Hostel",
    rating: 4.5,
    reviewsCount: 2100,
    startingPrice: 899,
    location: "Hawa Mahal Road, Old City",
    city: "Jaipur",
    nearestSpots: ["Hawa Mahal", "Badi Chaupar", "Johari Bazaar"],
    amenities: ["Social Common Room", "Dormitories & Private Rooms", "Free Wi-Fi", "Walking Tours"],
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    description: "Vibrant backpacker hostel right in the heart of the walled Pink City. Steps away from Hawa Mahal.",
    featured: false,
    bookingUrl: buildBookingUrl("Zostel Jaipur")
  }
];

export const getStoredHotels = () => {
  try {
    const saved = localStorage.getItem("sheher_saathi_hotels");
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.error("Error loading hotels:", err);
  }
  return INITIAL_JAIPUR_HOTELS;
};

export const saveStoredHotels = (hotels) => {
  try {
    localStorage.setItem("sheher_saathi_hotels", JSON.stringify(hotels));
  } catch (err) {
    console.error("Error saving hotels:", err);
  }
};
