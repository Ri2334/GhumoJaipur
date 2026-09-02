import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import PlaceCard from "../components/PlaceCard";
import SEOHead from "../components/SEOHead";
import { getAllCitiesPlaces } from "../data/cityResolver";

export default function Places() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialCity = searchParams.get("city") || "all";

  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("rating");

  useEffect(() => {
    const urlCat = searchParams.get("category");
    if (urlCat !== null) setCategory(urlCat);
    const urlCity = searchParams.get("city");
    if (urlCity !== null) setSelectedCity(urlCity);
  }, [searchParams]);

  const allPlaces = useMemo(() => {
    return getAllCitiesPlaces(selectedCity);
  }, [selectedCity]);

  const filteredPlaces = useMemo(() => {
    let list = [...allPlaces];

    if (category) {
      list = list.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          (p.famousForFood && p.famousForFood.toLowerCase().includes(q))
      );
    }

    if (sort === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === "price-low") {
      list.sort((a, b) => (a.ticketPrice || 0) - (b.ticketPrice || 0));
    } else if (sort === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [allPlaces, category, search, sort]);

  const categoryTabs = [
    { id: "", label: "All Spots" },
    { id: "Forts & Palaces", label: "Forts & Palaces" },
    { id: "Lakes & Waterfronts", label: "Lakes & Waterfronts" },
    { id: "Temples & Spiritual", label: "Temples & Spiritual" },
    { id: "Heritage & Museums", label: "Heritage & Museums" },
    { id: "Parks & Nature", label: "Parks & Nature" },
  ];

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSearchParams(city === "all" ? {} : { city });
  };

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-8 selection:bg-[#B35D38] selection:text-white">
      <SEOHead
        title="160+ Rajasthan Tourist Places Guide & Map | Sheher Saathi (Shehar App)"
        description="Browse 160+ verified tourist places in Jaipur and Udaipur. Complete with entry fees, timings, real-time bus metro boat routes, and food guides."
        keywords="Jaipur tourist places, Udaipur tourist places, City Palace Udaipur, Lake Pichola, Hawa Mahal, Amer Fort, Sheher Saathi, Shehar App"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2C1E18] via-[#3D2B23] to-[#241712] rounded-[2.5rem] p-8 sm:p-12 text-[#FAF5EF] shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#B35D38] text-white text-xs font-black uppercase tracking-widest shadow-md">
              Multi-City Heritage Directory 🏰🌅
            </span>
            <h1 className="text-4xl sm:text-6xl font-marcellus leading-tight">
              Explore Jaipur &amp; <br />
              <span className="text-[#D98A5B]">Udaipur Destinations</span>
            </h1>
            <p className="text-sm sm:text-base text-[#E6D6C3] font-medium leading-relaxed">
              Complete catalog of verified heritage spots, real-time public transit routes, entry fees, and famous local tastes.
            </p>

            {/* City Selector Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              {[
                { id: "all", label: "All Cities (165+)" },
                { id: "jaipur", label: "🏰 Jaipur (140+)" },
                { id: "udaipur", label: "🌅 Udaipur (25+)" }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCitySelect(c.id)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-md ${
                    selectedCity === c.id
                      ? "bg-[#B35D38] text-white ring-2 ring-[#D98A5B]"
                      : "bg-[#3D2B23] hover:bg-[#4A362B] text-[#E6D6C3] border border-[#543C32]"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-6 rounded-3xl border border-[#E6D6C3] shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <span className="absolute left-4 top-3.5 text-base">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search place name, food, or location..."
              className="w-full bg-[#FAF5EF] border border-[#E6D6C3] rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-semibold text-[#2C1E18] outline-none focus:border-[#B35D38]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categoryTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setCategory(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  category === t.id
                    ? "bg-[#B35D38] text-white shadow-md"
                    : "bg-[#FAF5EF] hover:bg-[#F3E8DB] text-[#2C1E18] border border-[#E6D6C3]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Places Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlaces.map((p) => (
            <PlaceCard key={p._id || p.id} place={p} />
          ))}
        </div>

      </div>
    </div>
  );
}
