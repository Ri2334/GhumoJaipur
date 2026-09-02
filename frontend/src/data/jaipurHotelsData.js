import { AFFILIATE_CONFIG } from "../config/affiliateConfig";

const buildBookingUrl = (hotelName, city = "Jaipur") => {
  const query = encodeURIComponent(`${hotelName}, ${city}`);
  if (AFFILIATE_CONFIG.bookingComAid && AFFILIATE_CONFIG.bookingComAid !== "304140") {
    return `https://www.booking.com/searchresults.html?ss=${query}&aid=${AFFILIATE_CONFIG.bookingComAid}`;
  }
  return `https://www.booking.com/searchresults.html?ss=${query}`;
};

const INITIAL_HOTELS = [
  // JAIPUR HOTELS
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
    bookingUrl: buildBookingUrl("Rambagh Palace", "Jaipur")
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
    bookingUrl: buildBookingUrl("Samode Haveli", "Jaipur")
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
    bookingUrl: buildBookingUrl("Alsisar Haveli", "Jaipur")
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
    bookingUrl: buildBookingUrl("Trident Jaipur", "Jaipur")
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
    description: "Award-winning boutique hotel where every room represents a different Indian state & art heritage.",
    featured: true,
    bookingUrl: buildBookingUrl("Pearl Palace Heritage", "Jaipur")
  },

  // UDAIPUR HOTELS
  {
    id: "taj-lake-palace-hotel",
    name: "Taj Lake Palace Udaipur",
    type: "Luxury Resort",
    rating: 4.9,
    reviewsCount: 2100,
    startingPrice: 42000,
    location: "Lake Pichola, Udaipur",
    city: "Udaipur",
    nearestSpots: ["City Palace Udaipur", "Jag Mandir", "Lake Pichola"],
    amenities: ["Island Floating Hotel", "Jiva Spa Boat", "Private Butler", "Picholi Bar"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    description: "Floating like a white marble jewel on Lake Pichola. Iconic 18th-century palace hotel accessed by private boat.",
    featured: true,
    bookingUrl: buildBookingUrl("Taj Lake Palace", "Udaipur")
  },
  {
    id: "leela-palace-udaipur",
    name: "The Leela Palace Udaipur",
    type: "Luxury Resort",
    rating: 4.9,
    reviewsCount: 1850,
    startingPrice: 36000,
    location: "Pichola, Lakefront, Udaipur",
    city: "Udaipur",
    nearestSpots: ["Lake Pichola", "Ambrai Ghat", "City Palace Udaipur"],
    amenities: ["Panoramic Lake View", "ESPA Spa", "Waterfront Fine Dining", "Private Boat Transfer"],
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    description: "Ultra-luxury lakeside palace hotel offering majestic views of the Aravalli mountains and City Palace across the lake.",
    featured: true,
    bookingUrl: buildBookingUrl("The Leela Palace", "Udaipur")
  },
  {
    id: "jagat-niwas-palace",
    name: "Jagat Niwas Palace Hotel",
    type: "Heritage Haveli",
    rating: 4.8,
    reviewsCount: 1250,
    startingPrice: 6800,
    location: "Lal Ghat, Old City, Udaipur",
    city: "Udaipur",
    nearestSpots: ["Lal Ghat", "City Palace Udaipur", "Jagdish Temple"],
    amenities: ["Lakeside Jharokhas", "Rooftop Restaurant", "Traditional Mewari Decor", "Free Wi-Fi"],
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    description: "17th-century haveli right on the eastern bank of Lake Pichola. Famous for its overhanging Jharokha seats overlooking the water.",
    featured: true,
    bookingUrl: buildBookingUrl("Jagat Niwas Palace", "Udaipur")
  },
  {
    id: "zostel-udaipur",
    name: "Zostel Udaipur",
    type: "Budget & Hostel",
    rating: 4.6,
    reviewsCount: 1950,
    startingPrice: 999,
    location: "Hanuman Ghat, Old City, Udaipur",
    city: "Udaipur",
    nearestSpots: ["Ambrai Ghat", "Daiji Bridge", "Lake Pichola"],
    amenities: ["Rooftop Lake View Cafe", "Social Common Area", "Dormitories & Private Rooms"],
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    description: "Lakeside backpacker hostel at Hanuman Ghat with breathtaking rooftop views of City Palace across Pichola.",
    featured: false,
    bookingUrl: buildBookingUrl("Zostel Udaipur", "Udaipur")
  }
];

export const getStoredHotels = () => {
  try {
    const saved = localStorage.getItem("sheher_saathi_hotels");
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.error("Error loading hotels:", err);
  }
  return INITIAL_HOTELS;
};

export const saveStoredHotels = (hotels) => {
  try {
    localStorage.setItem("sheher_saathi_hotels", JSON.stringify(hotels));
  } catch (err) {
    console.error("Error saving hotels:", err);
  }
};
