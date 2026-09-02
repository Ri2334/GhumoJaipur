import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getPlacesApi } from "../services/api";
import PlaceCard from "../components/PlaceCard";
import { fallbackPlaces } from "../data/fallbackPlaces";

const categoryTabs = [
  { id: "", label: "All Destinations (20+)" },
  { id: "Forts & Palaces", label: "🏰 Forts & Palaces" },
  { id: "Museums & Heritage", label: "🏛️ Museums & Heritage" },
  { id: "Temples & Spiritual", label: "🛕 Temples & Spiritual" },
  { id: "Markets & Bazaars", label: "🛍️ Markets & Bazaars" },
  { id: "Photo Spots & Parks", label: "📸 Photo Spots & Parks" },
  { id: "Wildlife & Nature", label: "🐅 Wildlife & Nature" }
];

export default function Places() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [places, setPlaces] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("rating");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlCat = searchParams.get("category");
    if (urlCat !== null) {
      setCategory(urlCat);
    }
  }, [searchParams]);

  useEffect(() => {
    let active = true;

    const loadPlaces = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPlacesApi({ search, category, sort });
        if (active) {
          if (response?.data && response.data.length > 0) {
            setPlaces(response.data);
          } else {
            let filtered = [...fallbackPlaces];
            if (category) {
              filtered = filtered.filter(p => p.category?.toLowerCase() === category.toLowerCase() || (category.includes("Fort") && p.category?.includes("Fort")));
            }
            if (search) {
              filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
            }
            setPlaces(filtered);
          }
        }
      } catch (err) {
        if (active) {
          let filtered = [...fallbackPlaces];
          if (category) {
            filtered = filtered.filter(p => p.category?.toLowerCase() === category.toLowerCase() || (category.includes("Fort") && p.category?.includes("Fort")));
          }
          if (search) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
          }
          setPlaces(filtered);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    const timer = setTimeout(loadPlaces, 200);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search, category, sort]);

  const handleCategorySelect = (catId) => {
    setCategory(catId);
    if (catId) {
      setSearchParams({ category: catId });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Hero Header */}
        <div className="rounded-3xl border border-[#E6D6C3] bg-white p-8 shadow-xl relative overflow-hidden text-center sm:text-left">
          <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-[#FAF1EC] border border-[#EBC5B2] opacity-40 pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="inline-block rounded-full bg-[#FAF1EC] border border-[#EBC5B2] px-4 py-1.5 text-xs font-bold text-[#B35D38] tracking-widest uppercase">
              Pink City Tourism Guide
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-marcellus text-[#2C1E18]">
              Explore All Places in Jaipur
            </h1>
            <p className="text-sm sm:text-base text-[#543C32] font-medium leading-relaxed">
              Complete, categorized guide to Jaipur's iconic forts, royal palaces, UNESCO observatories, bazaars, wildlife reserves, and photo spots—all with 10 online-verified FAQs per destination.
            </p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="rounded-3xl border border-[#E6D6C3] bg-white p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search place, food, or area (e.g. Amber, Hawa Mahal, Samosa)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-[#E6D6C3] bg-[#FAF5EF] px-4 py-3.5 pl-11 text-sm font-bold text-[#2C1E18] placeholder-[#A37B66] focus:border-[#B35D38] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B35D38]/20 transition"
              />
              <svg className="absolute left-4 top-4 h-4 w-4 text-[#A37B66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-3.5 text-xs font-bold text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-[#793A1F] whitespace-nowrap">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full md:w-auto rounded-xl border border-[#E6D6C3] bg-[#FAF5EF] px-4 py-2.5 text-xs font-bold text-[#2C1E18] focus:outline-none"
              >
                <option value="rating">Highest Rated ★</option>
                <option value="name">Name (A - Z)</option>
                <option value="ticketPrice">Entry Fee (Low to High)</option>
              </select>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2 border-t border-[#F3E8DB] pt-4">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleCategorySelect(tab.id)}
                className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  category === tab.id
                    ? "bg-[#B35D38] text-white shadow-md shadow-[#B35D38]/20"
                    : "bg-[#FAF5EF] text-[#543C32] border border-[#E6D6C3] hover:bg-[#FAF1EC] hover:text-[#B35D38]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 rounded-3xl bg-white animate-pulse border border-[#E6D6C3] shadow-md" />
            ))}
          </div>
        ) : places.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#E6D6C3] bg-white p-12 text-center text-[#543C32] shadow-xl">
            <h3 className="text-xl font-marcellus text-[#2C1E18]">No places found</h3>
            <p className="mt-2 text-xs font-medium text-[#A37B66]">Try adjusting your search terms or selecting 'All Destinations'.</p>
            <button
              onClick={() => { setSearch(""); setCategory(""); setSearchParams({}); }}
              className="mt-6 inline-block rounded-xl bg-[#B35D38] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xs font-bold text-[#793A1F]">
              Showing {places.length} destinations in Jaipur
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {places.map((place) => (
                <PlaceCard key={place._id} place={place} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
