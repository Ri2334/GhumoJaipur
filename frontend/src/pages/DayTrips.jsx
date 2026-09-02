import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CityContext } from "../context/CityContext";
import SEOHead from "../components/SEOHead";

export default function DayTrips() {
  const navigate = useNavigate();
  const { currentCity, cityDetails } = useContext(CityContext);
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaq, setOpenFaq] = useState(null);

  const jaipurTrips = [
    {
      id: "pushkar",
      title: "Ajmer & Pushkar",
      category: "Spiritual",
      distanceKm: 145,
      driveTime: "2.5 Hours",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80",
      description: "Explore the sacred Pushkar Lake, the world's rare Lord Brahma Temple, and the historic Ajmer Sharif Dargah.",
      highlights: ["Lord Brahma Temple", "Pushkar Sacred Lake", "Ajmer Dargah Sharif", "Ana Sagar Lake"],
      transitOptions: { bus: "₹150 - ₹300", train: "₹50 - ₹250", cab: "₹3,000" },
      bestSeason: "October to March"
    },
    {
      id: "ranthambore",
      title: "Ranthambore Tiger Reserve",
      category: "Wildlife",
      distanceKm: 160,
      driveTime: "3.5 Hours",
      image: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=800&q=80",
      description: "Thrilling Open Gypsy tiger safaris in the wild ruins of Ranthambore Fort and national park.",
      highlights: ["Royal Bengal Tigers", "Ranthambore Fort UNESCO", "Trinetra Ganesha Temple", "Padam Talao"],
      transitOptions: { bus: "₹200 - ₹350", train: "₹100 - ₹400", cab: "₹3,800" },
      bestSeason: "October to June"
    },
    {
      id: "bhangarh",
      title: "Bhangarh Fort",
      category: "Heritage",
      distanceKm: 85,
      driveTime: "2.0 Hours",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
      description: "Visit India's most famous haunted fort, featuring 17th-century ASI-protected palace ruins and temples.",
      highlights: ["Haunted Fort Ruins", "Gopinath Temple", "Royal Palace Ramparts", "Bhangarh Market"],
      transitOptions: { bus: "₹100 - ₹180", train: "N/A", cab: "₹2,400" },
      bestSeason: "October to March"
    },
    {
      id: "abhaneri",
      title: "Abhaneri Stepwell (Chand Baori)",
      category: "Heritage",
      distanceKm: 95,
      driveTime: "2.0 Hours",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      description: "A 1,000-year-old architectural marvel featuring 3,500 symmetrical narrow steps over 13 stories.",
      highlights: ["Chand Baori Stepwell", "Harshat Mata Temple", "Geometrical Step Architecture"],
      transitOptions: { bus: "₹120 - ₹200", train: "N/A", cab: "₹2,600" },
      bestSeason: "October to March"
    },
    {
      id: "sambhar",
      title: "Sambhar Salt Lake",
      category: "Nature",
      distanceKm: 80,
      driveTime: "1.5 Hours",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      description: "India's largest inland salt lake, famous for flamingo birdwatching, salt pan trains, and starlit camping.",
      highlights: ["Flamingo Birdwatching", "Salt Pan Railway Circuit", "Shakambhari Devi Temple"],
      transitOptions: { bus: "₹80 - ₹150", train: "₹40 - ₹100", cab: "₹2,200" },
      bestSeason: "November to February"
    }
  ];

  const udaipurTrips = [
    {
      id: "nathdwara",
      title: "Nathdwara & Statue of Belief",
      category: "Spiritual",
      distanceKm: 48,
      driveTime: "1.0 Hour",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80",
      description: "Sacred Shrinathji Krishna Temple pilgrimage and the 369 ft Viswas Swaroopam (World's Tallest Lord Shiva Statue).",
      highlights: ["Shrinathji Temple Darshan", "369ft Statue of Belief", "Pichwai Art Studios", "Chappan Bhog Prasad"],
      transitOptions: { bus: "₹60 - ₹100", train: "N/A", cab: "₹1,400" },
      bestSeason: "All Year Round"
    },
    {
      id: "kumbhalgarh",
      title: "Kumbhalgarh Fort & Great Wall",
      category: "Heritage",
      distanceKm: 84,
      driveTime: "2.0 Hours",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
      description: "Imposing UNESCO World Heritage fort featuring a 36 km continuous perimeter wall—the 2nd longest wall on Earth.",
      highlights: ["36km Great Wall of India", "Badal Mahal (Cloud Palace)", "Maharana Pratap Birthplace", "Light & Sound Show"],
      transitOptions: { bus: "₹120 - ₹200", train: "N/A", cab: "₹2,500" },
      bestSeason: "October to March"
    },
    {
      id: "ranakpur",
      title: "Ranakpur Marble Jain Temple",
      category: "Spiritual",
      distanceKm: 93,
      driveTime: "2.0 Hours",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      description: "Aravalli valley marble marvel featuring 1,444 uniquely carved pillars, no two pillars being identical.",
      highlights: ["1,444 Carved Marble Pillars", "Chaumukha Adinath Temple", "Tree-shaded Aravalli Valley", "Sun Temple Ranakpur"],
      transitOptions: { bus: "₹130 - ₹220", train: "N/A", cab: "₹2,800" },
      bestSeason: "October to March"
    },
    {
      id: "chittorgarh",
      title: "Chittorgarh Fort Complex",
      category: "Heritage",
      distanceKm: 115,
      driveTime: "2.5 Hours",
      image: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=800&q=80",
      description: "Asia's largest fort complex, legendary site of Rajput valor, Vijay Stambha, Kirti Stambha, and Padmini Palace.",
      highlights: ["Vijay Stambha (Tower of Victory)", "Rani Padmini Palace & Jauhar Kund", "Kirti Stambha", "Gaumukh Reservoir"],
      transitOptions: { bus: "₹150 - ₹250", train: "₹60 - ₹200", cab: "₹3,200" },
      bestSeason: "October to March"
    },
    {
      id: "jaisamand",
      title: "Jaisamand Lake & Sanctuary",
      category: "Nature",
      distanceKm: 58,
      driveTime: "1.5 Hours",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      description: "Second-largest artificial lake in Asia with 7 marble islands, cenotaphs, and Dhebar Wildlife Sanctuary.",
      highlights: ["Island Boat Cruises", "Marble Elephant Cenotaphs", "Dhebar Wildlife Sanctuary", "Hawa Mahal Palace View"],
      transitOptions: { bus: "₹80 - ₹150", train: "N/A", cab: "₹1,800" },
      bestSeason: "October to March"
    },
    {
      id: "mountabu",
      title: "Mount Abu & Dilwara Temples",
      category: "Nature",
      distanceKm: 163,
      driveTime: "3.0 Hours",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80",
      description: "Rajasthan's only hill station featuring Nakki Lake boating, 11th-century Dilwara marble temples, and Sunset Point.",
      highlights: ["Dilwara Marble Temples", "Nakki Lake Boating", "Guru Shikhar Peak", "Sunset Point & Toad Rock"],
      transitOptions: { bus: "₹220 - ₹380", train: "₹120 - ₹300", cab: "₹4,200" },
      bestSeason: "All Year Round"
    }
  ];

  const activeTripsList = currentCity === "udaipur" ? udaipurTrips : jaipurTrips;

  const filteredTrips = activeTripsList.filter((trip) => {
    if (activeCategory === "all") return true;
    return trip.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const faqs = [
    {
      q: `What is the best mode of transport for day trips from ${cityDetails.name}?`,
      a: `For flexible schedules and doorstep pickups, private cabs or self-drive rentals are best. Regular RSRTC buses and express trains also run frequently to nearby hubs.`
    },
    {
      q: `Can I cover multiple day trip spots in a single day from ${cityDetails.name}?`,
      a: currentCity === "udaipur" 
        ? `Yes! Nathdwara + Kumbhalgarh or Nathdwara + Ranakpur can be combined easily in a 1-day loop.`
        : `Yes! Ajmer + Pushkar or Abhaneri + Bhangarh can be combined comfortably in a single 8-hour trip.`
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-10 selection:bg-[#B35D38] selection:text-white">
      <SEOHead
        title={`Best Day Trips & Excursions from ${cityDetails.name} | Sheher Saathi`}
        description={`Explore top day trip destinations near ${cityDetails.name} with verified distance, drive time, transport options, and itineraries.`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-4 py-1.5 rounded-full bg-[#FAF1EC] text-[#B35D38] text-xs font-black uppercase tracking-widest border border-[#EBC5B2]">
            Outstation Excursions ⛰️
          </span>
          <h1 className="text-4xl sm:text-6xl font-marcellus text-[#2C1E18]">
            Day Trips from <span className="text-[#B35D38]">{cityDetails.name}</span>
          </h1>
          <p className="text-sm sm:text-base text-[#543C32] font-medium leading-relaxed">
            Explore heritage forts, sacred pilgrimages, wildlife reserves, and natural lakes—all within a short drive from {cityDetails.name}.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-3xl border border-[#E6D6C3] shadow-lg text-center">
          <div>
            <div className="text-3xl font-marcellus text-[#B35D38]">{activeTripsList.length}</div>
            <div className="text-xs text-[#A37B66] font-bold uppercase tracking-wider mt-1">Destinations</div>
          </div>
          <div>
            <div className="text-3xl font-marcellus text-[#2C1E18]">45 – 165 km</div>
            <div className="text-xs text-[#A37B66] font-bold uppercase tracking-wider mt-1">Distance Range</div>
          </div>
          <div>
            <div className="text-3xl font-marcellus text-[#2C1E18]">1 – 3.5 hrs</div>
            <div className="text-xs text-[#A37B66] font-bold uppercase tracking-wider mt-1">Drive Time</div>
          </div>
          <div>
            <div className="text-3xl font-marcellus text-emerald-600">Popular</div>
            <div className="text-xs text-[#A37B66] font-bold uppercase tracking-wider mt-1">Weekend Excursions</div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {["all", "heritage", "spiritual", "nature", "wildlife"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold capitalize transition ${
                activeCategory === cat
                  ? "bg-[#B35D38] text-white shadow-md"
                  : "bg-white text-[#2C1E18] border border-[#E6D6C3] hover:bg-[#FAF1EC]"
              }`}
            >
              {cat === "all" ? "All Destinations" : cat}
            </button>
          ))}
        </div>

        {/* Day Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-3xl border border-[#E6D6C3] overflow-hidden shadow-xl flex flex-col justify-between group hover:shadow-2xl transition duration-300">
              <div>
                <div className="relative h-56 overflow-hidden bg-[#2C1E18]">
                  <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#B35D38] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      {trip.category}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg">
                      📍 {trip.distanceKm} km ({trip.driveTime})
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="font-marcellus text-2xl text-[#2C1E18]">{trip.title}</h3>
                  <p className="text-xs text-[#543C32] leading-relaxed font-medium">{trip.description}</p>

                  <div className="space-y-2 pt-2 border-t border-[#E6D6C3]">
                    <div className="text-[11px] font-bold text-[#A37B66] uppercase tracking-wider">Key Attractions:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {trip.highlights.map((h, idx) => (
                        <span key={idx} className="bg-[#FAF5EF] text-[#2C1E18] text-[11px] font-semibold px-2.5 py-1 rounded-md border border-[#E6D6C3]">
                          • {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#FAF1EC] p-3 rounded-2xl border border-[#EBC5B2] space-y-1 text-xs">
                    <div className="font-bold text-[#B35D38]">Transport Fares:</div>
                    <div className="text-[11px] text-[#543C32] flex justify-between">
                      <span>🚌 Bus: {trip.transitOptions.bus}</span>
                      <span>🚖 Cab: {trip.transitOptions.cab}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => navigate(`/transport?destination=${encodeURIComponent(trip.title)}`)}
                  className="w-full bg-[#3D2B23] hover:bg-[#4A362B] text-white py-3.5 rounded-2xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>Plan Route to {trip.title}</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-3xl border border-[#E6D6C3] p-8 shadow-xl space-y-6 max-w-4xl mx-auto">
          <h2 className="text-3xl font-marcellus text-[#2C1E18]">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-[#E6D6C3] pb-4">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left font-bold text-base text-[#2C1E18] flex justify-between items-center py-2"
                >
                  <span>{faq.q}</span>
                  <span>{openFaq === idx ? "−" : "+"}</span>
                </button>
                {openFaq === idx && (
                  <p className="text-xs text-[#543C32] font-medium leading-relaxed mt-2">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
