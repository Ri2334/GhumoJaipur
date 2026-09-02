import React, { useState, useEffect } from "react";
import { getStoredHotels } from "../data/jaipurHotelsData";
import GoogleAd from "../components/GoogleAd";

export default function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setHotels(getStoredHotels());
  }, []);

  const types = ["All", "Heritage Haveli", "Luxury Resort", "Boutique Hotel", "Budget & Hostel"];

  const filteredHotels = hotels.filter((h) => {
    const matchesType = selectedType === "All" || h.type.toLowerCase().includes(selectedType.toLowerCase());
    const matchesSearch =
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.nearestSpots.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] pt-8 pb-20 selection:bg-[#B35D38] selection:text-white">
      
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-gradient-to-r from-[#2C1E18] via-[#3D2B23] to-[#241712] rounded-[2.5rem] p-8 sm:p-14 text-[#FAF5EF] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D98A5B]/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl relative z-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#B35D38] text-white text-xs font-black uppercase tracking-widest mb-4 shadow-md">
              Jaipur Stay Directory 🏨
            </span>
            <h1 className="text-4xl sm:text-6xl font-marcellus leading-tight text-[#FAF5EF]">
              Royal Havelis & <br />
              <span className="text-[#D98A5B]">Heritage Stays</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#E6D6C3] font-medium leading-relaxed">
              Discover hand-picked royal havelis, luxury resorts, boutique stays, and backpacker hostels near Jaipur's iconic 140+ tourist spots.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E6D6C3] shadow-lg">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <span className="absolute left-4 top-3.5 text-base">🔍</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search hotel name, area e.g. Amer, Hawa Mahal..."
              className="w-full bg-[#FAF5EF] border border-[#E6D6C3] rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-semibold text-[#2C1E18] outline-none focus:border-[#B35D38]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                  selectedType === type
                    ? "bg-[#B35D38] text-white shadow-md"
                    : "bg-[#FAF5EF] hover:bg-[#F3E8DB] text-[#2C1E18] border border-[#E6D6C3]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

        </div>

        {/* Ad Banner */}
        <GoogleAd slot="5678901234" />

        {/* Hotel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHotels.map((h) => (
            <div
              key={h.id}
              className="group bg-white rounded-3xl overflow-hidden border border-[#E6D6C3] shadow-lg hover:shadow-2xl transition duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Hotel Image Header */}
                <div className="relative h-56 overflow-hidden bg-[#2C1E18]">
                  <img
                    src={h.image}
                    alt={h.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C1E18]/80 via-transparent to-transparent" />
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-[#2C1E18] shadow-md flex items-center gap-1 border border-[#E6D6C3]">
                    <span className="text-amber-500">★</span>
                    <span>{h.rating}</span>
                    <span className="text-[10px] text-gray-500 font-normal">({h.reviewsCount})</span>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-4 right-4 bg-[#B35D38] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                    {h.type}
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-2xl font-marcellus leading-tight text-white">{h.name}</h3>
                    <p className="text-xs text-[#D98A5B] font-semibold mt-0.5">📍 {h.location}</p>
                  </div>
                </div>

                {/* Hotel Content */}
                <div className="p-6 space-y-4">
                  <p className="text-xs sm:text-sm text-[#543C32] font-medium leading-relaxed line-clamp-3">
                    {h.description}
                  </p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {h.amenities.map((am) => (
                      <span
                        key={am}
                        className="bg-[#FAF1EC] text-[#B35D38] border border-[#EBC5B2] px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                      >
                        ✨ {am}
                      </span>
                    ))}
                  </div>

                  {/* Nearest Spots */}
                  <div className="pt-3 border-t border-[#F3E8DB]">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#A37B66] mb-1">
                      Nearest Spots:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {h.nearestSpots.map((spot) => (
                        <span key={spot} className="text-xs font-bold text-[#2C1E18]">
                          📍 {spot} •
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="p-6 pt-0 flex items-center justify-between border-t border-[#F3E8DB] mt-4">
                <div>
                  <div className="text-[10px] font-bold text-[#A37B66] uppercase tracking-wider">Starting From</div>
                  <div className="text-2xl font-marcellus text-[#B35D38]">
                    ₹{h.startingPrice.toLocaleString("en-IN")}<span className="text-xs text-gray-500 font-sans font-normal">/night</span>
                  </div>
                </div>

                <a
                  href={h.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#B35D38] hover:bg-[#964B2A] text-white px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg transition flex items-center gap-1.5"
                >
                  <span>Book Now</span>
                  <span>→</span>
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
