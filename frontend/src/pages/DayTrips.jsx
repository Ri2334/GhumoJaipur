import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DayTrips() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaq, setOpenFaq] = useState(null);

  const dayTripsData = [
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
      description: "India's largest inland salt lake, famous for flamingo bird watching, salt train tracks, and starry night skies.",
      highlights: ["Salt Pan Train Tracks", "Flamingo Bird Watching", "Shakambhari Devi Temple", "Salt Mining"],
      transitOptions: { bus: "₹80 - ₹150", train: "₹40 - ₹120", cab: "₹2,000" },
      bestSeason: "November to February"
    },
    {
      id: "sariska",
      title: "Sariska Tiger Reserve & Alwar",
      category: "Wildlife",
      distanceKm: 120,
      driveTime: "2.5 Hours",
      image: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800&q=80",
      description: "Explore Sariska tiger forest, Siliserh Lake Palace, and the historic Bala Quila Fort in Alwar.",
      highlights: ["Bengal Tigers & Leopards", "Siliserh Lake Palace", "Kankwari Fort", "Bala Quila Alwar"],
      transitOptions: { bus: "₹150 - ₹250", train: "₹80 - ₹300", cab: "₹3,200" },
      bestSeason: "October to May"
    }
  ];

  const filteredTrips = dayTripsData.filter(
    (t) => activeCategory === "all" || t.category.toLowerCase() === activeCategory.toLowerCase()
  );

  const dayTripFaqs = [
    { q: "What are the most popular day trips from Jaipur?", a: "Pushkar & Ajmer (145km), Ranthambore Tiger Reserve (160km), Bhangarh Fort (85km), and Abhaneri Stepwell (95km) are the top day trips." },
    { q: "How to reach Pushkar and Ajmer from Jaipur?", a: "RSRTC Volvo buses run every 30 minutes from Sindhi Camp Bus Stand (2.5 hrs). Superfast trains run from Jaipur Junction to Ajmer in 2 hours." },
    { q: "Can Ranthambore tiger safari be done in a single day from Jaipur?", a: "Yes! Take the early morning Jan Shatabdi Express train from Jaipur to Sawai Madhopur (2 hrs), do the afternoon 2:00 PM Gypsy safari, and return by evening train." },
    { q: "Is Bhangarh Fort really haunted and what are the entry timing rules?", a: "Bhangarh Fort is ASI-protected. By law, entry before sunrise and after sunset is strictly prohibited." },
    { q: "What is the best way to travel to Abhaneri Chand Baori?", a: "Hiring a round-trip private cab from Jaipur (95 km via Jaipur-Agra Expressway) takes 2 hours and allows combining Abhaneri with Bhangarh Fort." },
    { q: "What is the best time of year for day trips around Jaipur?", a: "October to March offers pleasant winter weather (15°C - 25°C) ideal for sightseeing, safaris, and outdoor forts." },
    { q: "What is special about Sambhar Salt Lake?", a: "It is India's largest inland saline lake covering 190 sq km, famous for thousands of winter flamingos and salt rail trolley rides." },
    { q: "Are guided tour cabs available for day trips?", a: "Yes, certified outstation cabs (Sedans/SUVs) can be booked with driver for ₹2,000 to ₹3,800 full day." },
    { q: "What clothing is recommended for day trips?", a: "Comfortable cotton clothes, sun glasses, hat, and sturdy walking shoes for stepwells and forts." },
    { q: "Can I combine Bhangarh Fort and Abhaneri in one single day trip?", a: "Yes! Both are located on the Jaipur-Agra highway corridor and can easily be covered together in a 7-hour excursion." }
  ];

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Header */}
        <div className="text-center space-y-3">
          <span className="inline-block rounded-full bg-[#FAF1EC] border border-[#EBC5B2] px-4 py-1.5 text-xs font-bold text-[#B35D38] tracking-widest uppercase">
            Outstation Excursions
          </span>
          <h1 className="text-3xl sm:text-5xl font-marcellus text-[#2C1E18]">
            Day Trips from Jaipur
          </h1>
          <p className="text-sm sm:text-base text-[#543C32] max-w-2xl mx-auto font-medium leading-relaxed">
            Explore tiger safaris at Ranthambore, ancient stepwells at Abhaneri, spiritual Pushkar, and the haunted Bhangarh fort—all within a few hours of the Pink City.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-3xl border border-[#E6D6C3] bg-white p-6 shadow-xl text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#B35D38]">6</div>
            <div className="text-xs font-bold text-[#793A1F] uppercase tracking-wider mt-1">Destinations</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#2C1E18]">40 - 185 km</div>
            <div className="text-xs font-bold text-[#793A1F] uppercase tracking-wider mt-1">Distance Range</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#B35D38]">1 - 3.5 hrs</div>
            <div className="text-xs font-bold text-[#793A1F] uppercase tracking-wider mt-1">Drive Time</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700">Oct - Mar</div>
            <div className="text-xs font-bold text-[#793A1F] uppercase tracking-wider mt-1">Best Season</div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { id: "all", label: "All Destinations" },
            { id: "heritage", label: "🏰 Heritage & Forts" },
            { id: "wildlife", label: "🐅 Wildlife & Safaris" },
            { id: "spiritual", label: "🛕 Spiritual Places" },
            { id: "nature", label: "🌿 Nature & Lakes" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? "bg-[#B35D38] text-white shadow-md"
                  : "bg-white border border-[#E6D6C3] text-[#543C32] hover:bg-[#FAF1EC]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Day Trips Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="rounded-3xl border border-[#E6D6C3] bg-white overflow-hidden shadow-xl flex flex-col justify-between hover:-translate-y-1 transition duration-300"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <img src={trip.image} alt={trip.title} className="h-full w-full object-cover" />
                  <span className="absolute top-3 left-3 rounded-xl bg-[#2C1E18]/80 text-white px-3 py-1 text-[10px] font-bold uppercase backdrop-blur">
                    {trip.category}
                  </span>
                  <span className="absolute bottom-3 right-3 rounded-xl bg-white/90 text-[#2C1E18] px-3 py-1 text-xs font-black shadow">
                    📍 {trip.distanceKm} km ({trip.driveTime})
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-marcellus text-[#2C1E18]">{trip.title}</h3>
                  <p className="text-xs text-[#543C32] font-medium leading-relaxed">{trip.description}</p>

                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#A37B66]">Key Attractions</div>
                    <div className="flex flex-wrap gap-1">
                      {trip.highlights.map((hl, idx) => (
                        <span key={idx} className="rounded-md bg-[#FAF5EF] border border-[#E6D6C3] px-2 py-0.5 text-[11px] font-semibold text-[#2C1E18]">
                          • {hl}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#FAF5EF] p-3 text-xs border border-[#E6D6C3] space-y-1">
                    <div className="font-bold text-[#B35D38] uppercase text-[10px]">How to Reach:</div>
                    <div className="flex justify-between text-gray-700">
                      <span>🚌 Bus: {trip.transitOptions.bus}</span>
                      <span>🚆 Train: {trip.transitOptions.train}</span>
                    </div>
                    <div className="text-gray-700">🚖 Private Cab: {trip.transitOptions.cab}</div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => navigate('/transport', { state: { destination: trip.title } })}
                  className="w-full rounded-xl bg-[#B35D38] hover:bg-[#964B2A] text-white py-3 text-xs font-bold uppercase tracking-wider transition shadow"
                >
                  Plan Transit to {trip.title} →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 10 FAQs Section */}
        <div className="rounded-3xl border border-[#E6D6C3] bg-white p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#F3E8DB] pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B35D38]">Online Verified Travel Guide</span>
              <h2 className="text-2xl font-marcellus text-[#2C1E18] mt-1">Day Trips Frequently Asked Questions</h2>
            </div>
            <span className="rounded-xl bg-[#FAF1EC] border border-[#EBC5B2] px-3.5 py-1.5 text-xs font-bold text-[#B35D38]">
              10 Key Answers
            </span>
          </div>

          <div className="space-y-3">
            {dayTripFaqs.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-[#E6D6C3] bg-[#FAF5EF] overflow-hidden transition">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-bold text-[#2C1E18] hover:bg-[#FAF1EC]"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[#B35D38] font-black">Q{idx + 1}.</span>
                    {faq.q}
                  </span>
                  <span className="text-[#B35D38] font-bold text-base ml-2">
                    {openFaq === idx ? "−" : "+"}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm font-medium text-[#543C32] bg-white border-t border-[#F3E8DB] pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
