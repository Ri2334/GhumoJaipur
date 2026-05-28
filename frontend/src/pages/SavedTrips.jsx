import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { deleteSavedTripApi, getSavedTripsApi } from "../services/api";

export default function SavedTrips() {
  const { user } = useContext(AuthContext);
  const [savedTrips, setSavedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSavedTrips = async () => {
    try {
      setLoading(true);
      const response = await getSavedTripsApi();
      setSavedTrips(response.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load saved trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    loadSavedTrips();
  }, [user]);

  const handleRemove = async (placeId) => {
    try {
      await deleteSavedTripApi(placeId);
      setSavedTrips((current) => current.filter((trip) => trip.place?._id !== placeId));
    } catch (err) {
      setError(err?.response?.data?.message || "Could not remove saved trip");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_35%),linear-gradient(180deg,_#f8fbff_0%,_#eef2ff_100%)] px-4">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-8 text-center shadow-xl backdrop-blur">
          <h2 className="text-2xl font-bold text-gray-900">Please log in</h2>
          <p className="mt-3 text-gray-600">You need an account to save and view trips.</p>
          <Link to="/login" className="mt-6 inline-flex rounded-full bg-indigo-600 px-5 py-3 text-white">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_35%),linear-gradient(180deg,_#f8fbff_0%,_#eef2ff_100%)] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-white/70 bg-white/75 p-6 shadow-xl backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Saved Trips</p>
          <h1 className="mt-2 text-4xl font-black text-gray-900">Your travel shortlist</h1>
          <p className="mt-3 text-gray-600">Your favorite spots are synced across all your devices, ready for your next adventure.</p>
        </div>

        {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-80 animate-pulse rounded-3xl bg-white/80 shadow-lg" />)}
          </div>
        ) : savedTrips.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white/70 p-12 text-center text-gray-600 shadow-xl backdrop-blur">
            You have no saved trips yet. Open a place and tap Save Trip.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {savedTrips.map((trip) => {
              const place = trip.place;
              const image = place?.images?.[0] || "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80";

              return (
                <div key={trip._id} className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-xl backdrop-blur">
                  <img src={image} alt={place?.name} className="h-56 w-full object-cover" />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-indigo-600">{place?.category}</div>
                        <h3 className="mt-1 text-2xl font-bold text-gray-900">{place?.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">{place?.location}</p>
                      </div>
                      <div className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">₹{place?.ticketPrice || 0}</div>
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">{place?.description}</p>

                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                      <span>{place?.rating?.toFixed(1) || "0.0"} ★</span>
                      <span>{place?.timings}</span>
                    </div>

                    <div className="mt-5 flex gap-3">
                      <Link to={`/places/${place?._id}`} className="flex-1 rounded-full bg-gray-900 px-4 py-3 text-center text-sm font-semibold text-white">View</Link>
                      <button onClick={() => handleRemove(place?._id)} className="rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white">Remove</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
