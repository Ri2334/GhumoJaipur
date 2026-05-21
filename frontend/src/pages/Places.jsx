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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_35%),linear-gradient(180deg,_#f8fbff_0%,_#eef2ff_100%)] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-white/70 bg-white/75 p-6 shadow-xl backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Explore Jaipur</p>
          <h1 className="mt-2 text-4xl font-black text-gray-900">Tourist places, food, transport and timings</h1>
          <p className="mt-3 max-w-2xl text-gray-600">Search Jaipur attractions, filter by category, and open each place for gallery, pricing and travel notes.</p>

          <div className="mt-6 grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.65fr_0.75fr]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search places, location or description"
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm outline-none focus:border-indigo-500"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm outline-none focus:border-indigo-500"
            >
              <option value="">All categories</option>
              {categories.filter(Boolean).map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm outline-none focus:border-indigo-500"
            >
              <option value="rating">Sort: Highest rating</option>
              <option value="price">Sort: Lowest price</option>
              <option value="latest">Sort: Latest</option>
              <option value="name">Sort: Name</option>
            </select>
            <Link to="/admin/places" className="rounded-2xl bg-gray-900 px-4 py-3 text-center font-semibold text-white">
              Admin Dashboard
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.filter(Boolean).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory((current) => (current === item ? "" : item))}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${category === item ? "border-indigo-600 bg-indigo-600 text-white" : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:text-indigo-600"}`}
              >
                {item}
              </button>
            ))}
          </div>

          {suggestions.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-500">
              <span className="font-semibold text-gray-600">Suggestions:</span>
              {suggestions.map((item) => (
                <button key={item} type="button" onClick={() => setSearch(item)} className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 transition hover:bg-indigo-100">
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-[420px] animate-pulse rounded-3xl bg-white/80 shadow-lg" />
            ))}
          </div>
        ) : places.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white/70 p-12 text-center text-gray-600 shadow-xl backdrop-blur">
            No places found. Add one from the admin dashboard or seed the database.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {places.map((place) => (
              <PlaceCard key={place._id} place={place} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
