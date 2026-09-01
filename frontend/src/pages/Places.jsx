import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPlacesApi } from "../services/api";
import PlaceCard from "../components/PlaceCard";

const categories = ["", "Fort", "Palace", "Museum", "Temple", "Market", "Park", "Cafe", "Other"];

export default function Places() {
  const [places, setPlaces] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("rating");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadPlaces = async () => {
      try {
        setLoading(true);
        const response = await getPlacesApi({ search, category, sort });
        if (active) setPlaces(response.data || []);
      } catch (err) {
        if (active) setError(err?.response?.data?.message || "Failed to load places");
      } finally {
        if (active) setLoading(false);
      }
    };

    const timer = setTimeout(loadPlaces, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search, category, sort]);

  const suggestions = search.trim()
    ? places.slice(0, 4).map((place) => place.name)
    : [];

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 rounded-3xl border border-[#E6D6C3] bg-white p-8 shadow-xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B35D38]">Heritage & Attractions</p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-marcellus text-[#2C1E18]">Explore Jaipur Places</h1>
          <p className="mt-3 max-w-2xl text-[#543C32] font-medium">Discover Jaipur's iconic forts, palaces, local food, and transport connections with updated 2026 travel details.</p>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.75fr_0.75fr]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search places, location or description..."
              className="rounded-2xl border border-[#E6D6C3] bg-[#FAF5EF] px-5 py-4 text-[#2C1E18] font-medium shadow-sm outline-none focus:border-[#B35D38]"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-2xl border border-[#E6D6C3] bg-[#FAF5EF] px-5 py-4 text-[#2C1E18] font-medium shadow-sm outline-none focus:border-[#B35D38]"
            >
              <option value="">All Categories</option>
              {categories.filter(Boolean).map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-2xl border border-[#E6D6C3] bg-[#FAF5EF] px-5 py-4 text-[#2C1E18] font-medium shadow-sm outline-none focus:border-[#B35D38]"
            >
              <option value="rating">Sort: Highest Rating</option>
              <option value="price">Sort: Lowest Price</option>
              <option value="latest">Sort: Latest</option>
              <option value="name">Sort: Name</option>
            </select>
            <Link to="/admin/places" className="rounded-2xl bg-[#2C1E18] hover:bg-[#3D2B23] px-6 py-4 text-center font-bold text-[#FAF5EF] transition flex items-center justify-center">
              Admin Portal
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {categories.filter(Boolean).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory((current) => (current === item ? "" : item))}
                className={`rounded-xl border px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition ${category === item ? "border-[#B35D38] bg-[#B35D38] text-white shadow-md" : "border-[#E6D6C3] bg-[#FAF5EF] text-[#793A1F] hover:bg-[#F3E8DB]"}`}
              >
                {item}
              </button>
            ))}
          </div>

          {suggestions.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2 text-sm text-[#793A1F]">
              <span className="font-bold text-[#2C1E18]">Suggestions:</span>
              {suggestions.map((item) => (
                <button key={item} type="button" onClick={() => setSearch(item)} className="rounded-xl bg-[#FAF1EC] px-3.5 py-1 text-[#B35D38] font-bold transition hover:bg-[#EBC5B2]">
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 font-bold">{error}</div>}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-[420px] animate-pulse rounded-3xl bg-white border border-[#E6D6C3] shadow-md" />
            ))}
          </div>
        ) : places.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#E6D6C3] bg-white p-12 text-center text-[#543C32] font-semibold shadow-xl">
            No places found. Add one from the admin portal or seed the database.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {places.map((place) => (
              <PlaceCard key={place._id} place={place} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
