import React, { useEffect, useState, useMemo, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import PlaceCard from "../components/PlaceCard";
import SEOHead from "../components/SEOHead";
import { getAllCitiesPlaces } from "../data/cityResolver";
import { CityContext } from "../context/CityContext";
import CitySwitcher from "../components/CitySwitcher";

export default function Places() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const { currentCity, switchCity, cityDetails } = useContext(CityContext);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("rating");

  useEffect(() => {
    const urlCat = searchParams.get("category");
    if (urlCat !== null) setCategory(urlCat);
    const urlCity = searchParams.get("city");
    if (urlCity && (urlCity === "jaipur" || urlCity === "udaipur")) {
      switchCity(urlCity);
    }
  }, [searchParams]);

  // Strictly return places for the selected city
  const allPlaces = useMemo(() => {
    return getAllCitiesPlaces(currentCity);
  }, [currentCity]);

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

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-8 selection:bg-[#B35D38] selection:text-white">
      <SEOHead
        title={`${cityDetails.name} (${cityDetails.placesCount} Tourist Places) Guide & Map | Sheher Saathi`}
        description={`Explore all ${cityDetails.placesCount} verified tourist places in ${cityDetails.name}. Complete entry fees, timings, real-time public transit routes, and local food guides.`}
        keywords={`${cityDetails.name} tourist places, ${cityDetails.name} guide, Sheher Saathi, Shehar App`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2C1E18] via-[#3D2B23] to-[#241712] rounded-[2.5rem] p-8 sm:p-12 text-[#FAF5EF] shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10 space-y-4">
            
            <div className="flex items-center gap-3">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#B35D38] text-white text-xs font-black uppercase tracking-widest shadow-md">
                {cityDetails.name} Directory • {allPlaces.length} Destinations
              </span>
              <CitySwitcher />
            </div>

            <h1 className="text-4xl sm:text-6xl font-marcellus leading-tight">
              Explore <span className="text-[#D98A5B]">{cityDetails.name}</span> <br />
              {cityDetails.tagline}
            </h1>
            
            <p className="text-sm sm:text-base text-[#E6D6C3] font-medium leading-relaxed">
              Complete catalog of verified heritage spots, real-time public transit routes, entry fees, and famous local tastes in {cityDetails.name}.
            </p>

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
              placeholder={`Search ${cityDetails.name} places, food, or location...`}
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
