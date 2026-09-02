import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getPlacesApi } from "../services/api";
import PlaceCard from "../components/PlaceCard";
import { fallbackPlaces } from "../data/fallbackPlaces";
import SEOHead from "../components/SEOHead";

export default function Places() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [places, setPlaces] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("rating");
  const [loading, setLoading] = useState(true);

  // Sync category from URL query parameters
  useEffect(() => {
    const urlCat = searchParams.get("category");
    if (urlCat !== null) {
      setCategory(urlCat);
    }
  }, [searchParams]);

  // Dynamic Category Counts based on 140+ dataset
  const categoryCounts = useMemo(() => {
    const counts = { All: fallbackPlaces.length, Tourist: 0, Shopping: 0, Religious: 0, Parks: 0, Food: 0, Fun: 0 };
    fallbackPlaces.forEach((p) => {
      const cat = p.category || "Tourist";
      if (counts[cat] !== undefined) {
        counts[cat]++;
      } else {
        counts.Tourist++;
      }
    });
    return counts;
  }, []);

  const categoryTabs = [
    { id: "", label: `All (${categoryCounts.All})` },
    { id: "Tourist", label: `🏰 Tourist (${categoryCounts.Tourist})` },
    { id: "Shopping", label: `🛍️ Shopping (${categoryCounts.Shopping})` },
    { id: "Religious", label: `🛕 Religious (${categoryCounts.Religious})` },
    { id: "Parks", label: `🌿 Parks (${categoryCounts.Parks})` },
    { id: "Food", label: `🍴 Food (${categoryCounts.Food})` },
    { id: "Fun", label: `⚡ Fun (${categoryCounts.Fun})` }
  ];

  useEffect(() => {
    let active = true;

    const loadPlaces = async () => {
      try {
        setLoading(true);
        const response = await getPlacesApi({ search, category, sort });
        if (active) {
          if (response?.data && response.data.length > 0) {
            setPlaces(response.data);
          } else {
            let filtered = [...fallbackPlaces];
            if (category) {
              filtered = filtered.filter(p => p.category?.toLowerCase() === category.toLowerCase());
            }
            if (search) {
              const q = search.toLowerCase();
              filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(q) || 
                p.description.toLowerCase().includes(q) ||
                p.location.toLowerCase().includes(q) ||
                (p.famousForFood && p.famousForFood.toLowerCase().includes(q))
              );
            }
            setPlaces(filtered);
          }
        }
      } catch (err) {
        if (active) {
          let filtered = [...fallbackPlaces];
          if (category) {
            filtered = filtered.filter(p => p.category?.toLowerCase() === category.toLowerCase());
          }
          if (search) {
            const q = search.toLowerCase();
            filtered = filtered.filter(p => 
              p.name.toLowerCase().includes(q) || 
              p.description.toLowerCase().includes(q) ||
              p.location.toLowerCase().includes(q) ||
              (p.famousForFood && p.famousForFood.toLowerCase().includes(q))
            );
          }
          setPlaces(filtered);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    const timer = setTimeout(loadPlaces, 150);
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
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-8 selection:bg-[#B35D38] selection:text-white">
      <SEOHead
        title="140+ Jaipur Tourist Places Guide & Map | Sheher Saathi (Shehar App)"
        description="Browse all 140+ verified tourist places, forts, palaces, bazaars, and temples in Jaipur. Complete with entry fees, timings, real-time bus metro routes, and food guides."
        keywords="Jaipur tourist places, 140 places in Jaipur, Hawa Mahal, Amer Fort, City Palace, Jaipur fort guide, Sheher Saathi, Shehar App"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "140+ Jaipur Tourist Places Directory",
          "description": "Complete catalog of 140+ heritage tourist destinations in Jaipur.",
          "url": "https://shehersaathi.com/places"
        }}
      />
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Hero Header */}
        <div className="rounded-3xl border border-[#E6D6C3] bg-white p-8 shadow-xl relative overflow-hidden text-center sm:text-left">
          <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-[#FAF1EC] border border-[#EBC5B2] opacity-40 pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 text-xs font-bold text-emerald-800 tracking-wider uppercase">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              140+ Places to Explore Near Metro & Bus Routes
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-marcellus text-[#2C1E18]">
              Places Near Metro & Jaipur City
            </h1>
            <p className="text-sm sm:text-base text-[#543C32] font-medium leading-relaxed">
              Discover amazing heritage spots, markets, local food joints, and parks accessible by Jaipur Metro and city buses—complete with step-by-step directions and 10 online-verified FAQs per destination.
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
                placeholder="Search places, areas, food spots (e.g. Bapu Bazaar, Tattoo Cafe)..."
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
            <p className="mt-2 text-xs font-medium text-[#A37B66]">Try adjusting your search terms or selecting 'All'.</p>
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
              Showing {places.length} of {fallbackPlaces.length} destinations in Jaipur
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
